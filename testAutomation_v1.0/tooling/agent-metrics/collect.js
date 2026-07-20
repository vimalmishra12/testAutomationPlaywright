"use strict";
/**
 * Agent Metrics collector (Level 2) — parses Claude Code session transcripts (JSONL) into a
 * per-session metrics CSV. Design-time tooling only (AGENTS.md §9): read-only over the
 * transcripts, never required by the framework. See DESIGN.md for column semantics.
 *
 * Usage:
 *   node tooling/agent-metrics/collect.js [--summary] [--split-date YYYY-MM-DD]
 *                                         [--projects-root <dir>] [--prefix <dirPrefix>] [--out <csv>]
 */

const fs = require("fs");
const path = require("path");
const os = require("os");
const readline = require("readline");

// ---------- CLI args (zero-dep parsing; only used at design time) ----------
const argv = {};
{
  const a = process.argv.slice(2);
  for (let i = 0; i < a.length; i++) {
    if (a[i] === "--summary") argv.summary = true;
    else if (a[i].startsWith("--") && i + 1 < a.length) argv[a[i].slice(2)] = a[++i];
  }
}

const PROJECTS_ROOT = argv["projects-root"] || path.join(os.homedir(), ".claude", "projects");
// Prefix matches BOTH project dirs for this repo (root + testAutomation_v1.0)
const DIR_PREFIX = argv.prefix || "D--testAutomation-QATestAutomation";
const OUT_CSV = argv.out || path.join(__dirname, "output", "agent-metrics.csv");

// ---------- helpers ----------
function textOfContent(content) {
  // tool_result / message content can be a plain string or an array of typed blocks
  if (typeof content === "string") return content;
  if (Array.isArray(content))
    return content.filter((b) => b && b.type === "text").map((b) => b.text || "").join("\n");
  return "";
}

function isTestRunCommand(cmd) {
  if (typeof cmd !== "string") return false;
  return /core[\\\/]runner[\\\/]run\.js/.test(cmd) || /npm run \S*(Test_|visualAcceptance_)/.test(cmd);
}

function csvEscape(v) {
  const s = String(v == null ? "" : v);
  return /[",\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}

// ---------- per-session parsing ----------
async function parseSession(filePath, projectName) {
  const s = {
    project: projectName,
    session_id: path.basename(filePath, ".jsonl"),
    tsMin: null,
    tsMax: null,
    models: new Set(),
    usageByRequest: new Map(), // requestId → usage (last wins — avoids double-counting streamed records)
    user_msgs: 0,
    assistant_requests: new Set(),
    tool_calls: 0,
    tool_errors: 0,
    skills: new Set(),
    phases: new Set(),
    test_runs: 0,
    runs_failed: 0,
    subagent_msgs: 0,
    label: "",
  };
  const testRunToolIds = new Set();

  const rl = readline.createInterface({
    input: fs.createReadStream(filePath, { encoding: "utf8" }),
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    if (!line.trim()) continue;
    let o;
    try {
      o = JSON.parse(line);
    } catch {
      continue; // tolerate partial/corrupt lines
    }

    if (o.timestamp) {
      const t = Date.parse(o.timestamp);
      if (!Number.isNaN(t)) {
        if (s.tsMin === null || t < s.tsMin) s.tsMin = t;
        if (s.tsMax === null || t > s.tsMax) s.tsMax = t;
      }
    }

    if (o.isSidechain) {
      if (o.type === "user" || o.type === "assistant") s.subagent_msgs++;
      continue; // subagent traffic tracked as one number; not mixed into main-session metrics
    }

    if (o.type === "assistant" && o.message) {
      const m = o.message;
      if (m.model && m.model !== "<synthetic>") s.models.add(m.model);
      if (o.requestId) {
        s.assistant_requests.add(o.requestId);
        if (m.usage) s.usageByRequest.set(o.requestId, m.usage);
      }
      for (const b of m.content || []) {
        if (b && b.type === "tool_use") {
          s.tool_calls++;
          const input = b.input || {};
          // Skill / phase attribution
          if (b.name === "Skill" && typeof input.skill === "string") s.skills.add(input.skill);
          const fp = typeof input.file_path === "string" ? input.file_path : "";
          const skillMatch = fp.match(/\.agent[\\\/]skills[\\\/]([a-z0-9-]+)/i);
          if (skillMatch) s.skills.add(skillMatch[1]);
          const phaseMatch = fp.match(/phases[\\\/](1-build|2-run-fix|3-visual)\.md/i);
          if (phaseMatch) s.phases.add(phaseMatch[1]);
          // Test-run detection (Bash/PowerShell invoking the runner)
          if ((b.name === "Bash" || b.name === "PowerShell") && isTestRunCommand(input.command)) {
            s.test_runs++;
            testRunToolIds.add(b.id);
          }
        }
      }
    } else if (o.type === "user" && o.message) {
      const content = o.message.content;
      let hasToolResult = false;
      if (Array.isArray(content)) {
        for (const b of content) {
          if (b && b.type === "tool_result") {
            hasToolResult = true;
            if (b.is_error) s.tool_errors++;
            if (testRunToolIds.has(b.tool_use_id)) {
              const txt = textOfContent(b.content);
              // failed run = tool-level error OR mocha "N failing" (N ≥ 1) in the output
              if (b.is_error || /(^|\s)[1-9]\d*\s+failing/.test(txt)) s.runs_failed++;
            }
          }
        }
      }
      if (!hasToolResult && !o.isMeta) {
        const txt = textOfContent(content).trim();
        if (txt) {
          s.user_msgs++;
          if (!s.label) s.label = txt.replace(/\s+/g, " ").slice(0, 80);
        }
      }
    }
  }

  // Sum usage once per requestId (streamed records repeat usage — last snapshot wins)
  let inTok = 0, outTok = 0, cacheRead = 0, cacheCreate = 0;
  for (const u of s.usageByRequest.values()) {
    inTok += u.input_tokens || 0;
    outTok += u.output_tokens || 0;
    cacheRead += u.cache_read_input_tokens || 0;
    cacheCreate += u.cache_creation_input_tokens || 0;
  }

  return {
    project: s.project,
    session_id: s.session_id,
    date_start: s.tsMin ? new Date(s.tsMin).toISOString() : "",
    date_end: s.tsMax ? new Date(s.tsMax).toISOString() : "",
    wall_clock_min: s.tsMin !== null ? Math.round((s.tsMax - s.tsMin) / 60000) : 0,
    model: [...s.models].join("|"),
    user_msgs: s.user_msgs,
    assistant_msgs: s.assistant_requests.size,
    tool_calls: s.tool_calls,
    tool_errors: s.tool_errors,
    input_tokens: inTok,
    output_tokens: outTok,
    cache_read: cacheRead,
    cache_create: cacheCreate,
    skill: [...s.skills].join("|") || "none",
    phase: [...s.phases].join("|") || "none",
    test_runs: s.test_runs,
    runs_failed: s.runs_failed,
    subagent_msgs: s.subagent_msgs,
    label: s.label,
  };
}

// ---------- main ----------
(async function main() {
  const dirs = fs
    .readdirSync(PROJECTS_ROOT, { withFileTypes: true })
    .filter((d) => d.isDirectory() && d.name.startsWith(DIR_PREFIX))
    .map((d) => path.join(PROJECTS_ROOT, d.name));
  if (dirs.length === 0) {
    console.error(`No project dirs matching "${DIR_PREFIX}*" under ${PROJECTS_ROOT}`);
    process.exit(1);
  }

  const rows = [];
  for (const dir of dirs) {
    const files = fs.readdirSync(dir).filter((f) => f.endsWith(".jsonl"));
    for (const f of files) rows.push(await parseSession(path.join(dir, f), path.basename(dir)));
  }
  rows.sort((a, b) => a.date_start.localeCompare(b.date_start));

  const cols = [
    "project", "session_id", "date_start", "date_end", "wall_clock_min", "model",
    "user_msgs", "assistant_msgs", "tool_calls", "tool_errors",
    "input_tokens", "output_tokens", "cache_read", "cache_create",
    "skill", "phase", "test_runs", "runs_failed", "subagent_msgs", "label",
  ];
  fs.mkdirSync(path.dirname(OUT_CSV), { recursive: true });
  fs.writeFileSync(
    OUT_CSV,
    [cols.join(","), ...rows.map((r) => cols.map((c) => csvEscape(r[c])).join(","))].join("\n") + "\n",
    "utf8"
  );
  console.log(`Wrote ${rows.length} session(s) → ${OUT_CSV}`);

  if (!argv.summary) return;

  // ---------- summary ----------
  const fmt = (n) => n.toLocaleString("en-US");
  const totTok = (r) => r.input_tokens + r.output_tokens;
  console.log("\n=== TOTALS ===");
  const sum = (k) => rows.reduce((a, r) => a + r[k], 0);
  console.log(
    `sessions: ${rows.length} | input: ${fmt(sum("input_tokens"))} | output: ${fmt(sum("output_tokens"))} | ` +
    `cache_read: ${fmt(sum("cache_read"))} | tool_errors: ${sum("tool_errors")} | test_runs: ${sum("test_runs")} (failed: ${sum("runs_failed")})`
  );

  const groupAvg = (keyFn, title) => {
    const g = new Map();
    for (const r of rows) {
      const k = keyFn(r);
      if (!g.has(k)) g.set(k, []);
      g.get(k).push(r);
    }
    console.log(`\n=== AVG PER SESSION, BY ${title} ===`);
    for (const [k, rs] of g) {
      const avg = (kk) => Math.round(rs.reduce((a, r) => a + r[kk], 0) / rs.length);
      console.log(
        `${k.padEnd(38)} n=${String(rs.length).padEnd(3)} in=${fmt(avg("input_tokens")).padStart(11)} ` +
        `out=${fmt(avg("output_tokens")).padStart(8)} toolErr=${avg("tool_errors")} userMsgs=${avg("user_msgs")}`
      );
    }
  };
  groupAvg((r) => r.skill, "SKILL");
  groupAvg((r) => r.phase, "PHASE");

  console.log("\n=== TOP 5 MOST EXPENSIVE SESSIONS (input+output tokens) ===");
  for (const r of [...rows].sort((a, b) => totTok(b) - totTok(a)).slice(0, 5))
    console.log(`${fmt(totTok(r)).padStart(12)}  ${r.date_start.slice(0, 10)}  [${r.skill}] ${r.label}`);

  console.log("\n=== ERROR HOTSPOTS (top 5 by tool_errors) ===");
  for (const r of [...rows].sort((a, b) => b.tool_errors - a.tool_errors).slice(0, 5))
    console.log(`errors=${String(r.tool_errors).padStart(3)} runsFailed=${r.runs_failed}  ${r.date_start.slice(0, 10)}  ${r.label}`);

  if (argv["split-date"]) {
    const cut = argv["split-date"];
    const before = rows.filter((r) => r.date_start.slice(0, 10) < cut);
    const after = rows.filter((r) => r.date_start.slice(0, 10) >= cut);
    const line = (name, rs) => {
      if (!rs.length) return console.log(`${name}: no sessions`);
      const avg = (k) => Math.round(rs.reduce((a, r) => a + r[k], 0) / rs.length);
      console.log(
        `${name}: n=${rs.length} | avg in=${fmt(avg("input_tokens"))} out=${fmt(avg("output_tokens"))} ` +
        `cacheRead=${fmt(avg("cache_read"))} toolErr=${avg("tool_errors")} userMsgs=${avg("user_msgs")}`
      );
    };
    console.log(`\n=== BEFORE vs AFTER ${cut} ===`);
    line("before", before);
    line("after ", after);
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});

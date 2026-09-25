#!/usr/bin/env node
"use strict";
/**
 * Stakeholder summary report — Step 1 (user request 2026-09-24).
 *
 * Builds a presentable, self-contained HTML report from a finished run, WITHOUT touching the
 * core runner: it reads what every run already writes —
 *   - the mochawesome JSON  (output/reports/TestReports/mochawesome/report.json): suites, tests,
 *     states, durations, errors, and the end-of-test screenshot;
 *   - the run's info log    (logs/info_*.json): the order of suites / hooks / tests and every
 *     assertion message (baseAssertionLibrary logs each one before checking it) and wait messages;
 *   - the execution file    : each suite's "Role" (Student / Teacher / Admin) and "Setup" flag;
 *   - the run data          : runtime/lastRun.json (ADR-022) for the accounts the run created;
 *   - the manual register   : the register title of each test.
 *
 * Output: <outputDir>/<exec>_<env>_<date>/index.html (screenshots embedded), and a .zip of it.
 * A small summary is kept in <historyDir> so each report compares itself with the previous run.
 *
 * Usage (after a run; every flag is optional — the defaults pick the latest run):
 *   node tooling/report/buildReport.js
 *     --mochawesome=<report.json>  --log=<logs/info_*.json>  --runData=<lastRun.json>
 *     --exec=<learningPath.json>   --env=<production>        --appType=<ExperienceApp>
 *     --out=<dir>  --noHistory  --noZip
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "../..");
const CONFIG = JSON.parse(fs.readFileSync(path.join(__dirname, "report.config.json"), "utf8"));

// ---------------------------------------------------------------- arguments
const ARGS = {};
process.argv.slice(2).forEach((a) => {
  const m = /^--([^=]+)(?:=(.*))?$/.exec(a);
  if (m) ARGS[m[1]] = m[2] === undefined ? true : m[2];
});
const abs = (p) => (path.isAbsolute(p) ? p : path.join(ROOT, p));

// ---------------------------------------------------------------- small helpers
const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const pad = (n) => String(n).padStart(2, "0");
// Repo files are shown relative to the repo; files from elsewhere (e.g. a saved report) by name only.
const shortPath = (f) => { const r = path.relative(ROOT, f); return r.startsWith("..") || path.isAbsolute(r) ? path.basename(f) : r; };

function fmtMs(ms) {
  ms = Math.max(0, Math.round(ms || 0));
  if (ms < 1000) return ms + " ms";
  if (ms < 60000) return (ms / 1000).toFixed(1) + " s";
  const m = Math.floor(ms / 60000);
  const s = Math.round((ms % 60000) / 1000);
  return m + " min" + (s ? " " + s + " s" : "");
}
function fmtDate(d) {
  return new Date(d).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", timeZoneName: "short" });
}
function getPath(obj, dotted) {
  return String(dotted).split(".").reduce((o, k) => (o == null ? undefined : o[k]), obj);
}

// ---------------------------------------------------------------- inputs
function loadMochawesome() {
  const f = abs(ARGS.mochawesome || "output/reports/TestReports/mochawesome/report.json");
  if (!fs.existsSync(f)) throw new Error("No mochawesome report at " + f + " — run a suite first, or pass --mochawesome=<file>");
  return { file: f, data: JSON.parse(fs.readFileSync(f, "utf8")) };
}

// The logger writes LOCAL time with a "Z" suffix (core/utils/logger.js) — read it back as local time.
const logTime = (ts) => new Date(String(ts).replace(/Z$/, ""));

function readLogLines(file) {
  return fs.readFileSync(file, "utf8").split(/\r?\n/).filter(Boolean).map((l) => {
    try { return JSON.parse(l.replace(/,\s*$/, "")); } catch (_) { return null; }
  }).filter(Boolean);
}

// The run's log is the info_*.json whose first entry is closest to the mochawesome start (within 3 min).
function findLog(startIso) {
  if (ARGS.log) return abs(ARGS.log);
  const dir = path.join(ROOT, "logs");
  if (!fs.existsSync(dir)) return null;
  const start = new Date(startIso).getTime();
  let best = null;
  fs.readdirSync(dir).filter((f) => /^info_.*\.json$/.test(f)).forEach((f) => {
    const full = path.join(dir, f);
    const fd = fs.openSync(full, "r");
    const buf = Buffer.alloc(400);
    fs.readSync(fd, buf, 0, 400, 0);
    fs.closeSync(fd);
    const m = /"timestamp":"([^"]+)"/.exec(buf.toString("utf8"));
    if (!m) return;
    const diff = Math.abs(logTime(m[1]).getTime() - start);
    if (diff < 180000 && (!best || diff < best.diff)) best = { file: full, diff };
  });
  return best && best.file;
}

// Walks the log in order and attributes every assertion / wait message to its suite, its setup
// ("BEFORE HOOK") or its test ("Executing testCase"). Tests are matched to mochawesome by order.
function parseLog(file) {
  const out = { env: null, browser: null, suites: {} };
  if (!file) return out;
  const waitRes = CONFIG.waitPatterns.map((p) => new RegExp(p));
  let suite = null;
  let item = null;
  readLogLines(file).forEach((e) => {
    const msg = String(e.msg == null ? "" : e.msg);
    if (!out.env && e.env) {
      const parts = String(e.env).split(",");
      out.browser = parts[0];
      out.env = parts[1];
    }
    const top = String(e.trace || "").split(",")[0];
    if (/tempRunner/.test(top)) {
      let m;
      if ((m = /^Starting Test Suite:(.*)$/.exec(msg))) {
        suite = out.suites[m[1].trim()] = { setup: { steps: [], asserts: [], waits: [] }, tests: [] };
        item = suite.setup;
        return;
      }
      if (suite && (m = /^BEFORE HOOK:(.*)$/s.exec(msg))) {
        let id = "";
        try { id = JSON.parse(m[1]).id; } catch (_) { /* keep the raw text out */ }
        suite.setup.steps.push(id);
        item = suite.setup;
        return;
      }
      if (suite && (m = /^Executing testCase:(\S+)/.exec(msg))) {
        item = { id: m[1], asserts: [], waits: [] };
        suite.tests.push(item);
        return;
      }
    }
    if (!item) return;
    // baseAssertionLibrary logs "<assertFn>.<caller>..." with the assertion message BEFORE checking it.
    if (/^(assert|assertEqual|assertNotEqual|isNotNaN|typeOf|assertFail|isAtMost)\./.test(String(e.logger || ""))) item.asserts.push(msg);
    waitRes.forEach((re) => {
      const w = re.exec(msg);
      if (w) item.waits.push(w[0]);
    });
  });
  return out;
}

function loadExecFile(appType, env, execName) {
  const f = path.join(ROOT, "testResources", "testExecutionFiles", appType, env, execName);
  return fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, "utf8")) : {};
}

function execConfig(execName) {
  let c = CONFIG.execFiles[execName] || {};
  if (c.extends) c = Object.assign({}, CONFIG.execFiles[c.extends] || {}, c);
  return c;
}

// The report leaves out the requirement prefix of suite and test titles (user request 2026-09-24):
// "LP-001, LP-005 - Learner opens…" / "LP-034/035: My progress…" / "LP-035 (runs after …) - Teacher marks…".
function stripReq(title) {
  return String(title || "").replace(/^[A-Z]+-\d+(?:[\d…,\/\s]|[A-Z]+-\d+)*?(?:\s*\([^)]*\))?\s*[-–:]\s+/, "");
}

// Manual register (.md) → { id: { title, req, status, comments } }.
function parseRegister(file) {
  const out = {};
  if (!file || !fs.existsSync(file)) return out;
  const md = fs.readFileSync(file, "utf8");
  md.split(/\n(?=\| \*\*S\.No\.\*\*)/).forEach((block) => {
    const f = {};
    block.split(/\r?\n/).forEach((line) => {
      const m = /^\| \*\*(.+?)\*\* \| (.*) \|\s*$/.exec(line);
      if (m && !(m[1] in f)) f[m[1]] = m[2].replace(/<br>/g, " ").replace(/\*\*/g, "").trim();
    });
    const id = f["Test Case ID"];
    if (!id || !/^TST_/.test(id)) return;
    const req = /#?(LP-\d+|[A-Z]+-\d+)/.exec(f["Linked Requirement"] || "");
    out[id] = { title: f["Title"] || "", req: req ? req[1] : "", reqText: f["Linked Requirement"] || "", status: f["Status"] || "", comments: f["Comments / Defect ID"] || "" };
  });
  return out;
}

function loadRunData(appType, env) {
  const f = abs(ARGS.runData || path.join("testResources", "testcaseData", appType, env, "runtime", "lastRun.json"));
  return fs.existsSync(f) ? { file: f, data: JSON.parse(fs.readFileSync(f, "utf8")) } : { file: null, data: {} };
}

// ADR-022 tokens — {{run.x}} and {{last.x}} both read the run's lastRun.json here.
const resolveTokens = (v, run) => (typeof v === "string" ? v.replace(/\{\{(?:run|last)\.(\w+)\}\}/g, (m, k) => (run[k] != null ? run[k] : m)) : v);

// ---------------------------------------------------------------- model
function buildModel() {
  const mw = loadMochawesome();
  const stats = mw.data.stats;
  const appType = ARGS.appType || "ExperienceApp";

  const mwSuites = [];
  (function walk(s) {
    if (s.title) mwSuites.push(s);
    (s.suites || []).forEach(walk);
  })({ suites: mw.data.results });

  const tempFile = (mwSuites[0] && mwSuites[0].file) || "";
  const execName = ARGS.exec || (path.basename(tempFile.replace(/\\/g, "/"), ".js") + ".json");
  const logFile = findLog(stats.start);
  const log = parseLog(logFile);
  const env = ARGS.env || log.env || "unknown";
  const cfg = execConfig(execName);
  const exec = loadExecFile(appType, env, execName);
  const runData = loadRunData(appType, env);
  const register = parseRegister(cfg.register && abs(cfg.register));

  // dataFile may be a list (e.g. NLP's own data + learningPathData.json, whose setup chain it reuses): merged per
  // top-level key (C1), earlier files winning.
  let data = {};
  [].concat(cfg.dataFile || []).slice().reverse().forEach((f) => {
    const df = abs(f.replace("{env}", env));
    if (!fs.existsSync(df)) return;
    const d = JSON.parse(fs.readFileSync(df, "utf8"));
    Object.keys(d).forEach((k) => {
      data[k] = d[k] && typeof d[k] === "object" && !Array.isArray(d[k]) ? Object.assign({}, data[k], d[k]) : d[k];
    });
  });
  const val = (p) => resolveTokens(getPath(data, p), runData.data);

  const envCfg = (() => {
    try { return JSON.parse(fs.readFileSync(path.join(ROOT, "env.json"), "utf8"))[appType].environments[env] || {}; } catch (_) { return {}; }
  })();

  // Tests whose log entries could not be lined up (their checks / waits are then left out).
  const unmatched = [];
  const suites = mwSuites.map((s) => {
    const key = s.title.split(" - ")[0].trim();
    const def = exec[key] || {};
    const lg = log.suites[s.title.trim()] || { setup: { steps: [], asserts: [], waits: [] }, tests: [] };
    const hookFail = (s.beforeHooks || []).find((h) => h.state === "failed" || h.fail);
    const tests = s.tests.map((t, i) => {
      const m = /^(TST_\w+?_TC_\d+)\s+(.*?)(?:\s+-\s+\((P\d)\))?$/.exec(t.title) || [null, "", t.title, ""];
      const lt = lg.tests[i] && lg.tests[i].id === m[1] ? lg.tests[i] : null;
      if (!lt && logFile) unmatched.push(key + " " + (m[1] || t.title));
      let shot = null;
      try {
        const ctx = typeof t.context === "string" && t.context ? JSON.parse(t.context) : t.context;
        (Array.isArray(ctx) ? ctx : [ctx]).forEach((c) => {
          if (c && typeof c.value === "string" && c.value.indexOf("data:image/png;base64,") === 0) shot = c.value;
        });
      } catch (_) { /* no screenshot */ }
      const state = t.pass ? "passed" : t.fail ? "failed" : "skipped";
      const errMsg = (t.err && (t.err.message || t.err.estack)) || "";
      const last = lt && lt.asserts[lt.asserts.length - 1];
      const failedAssert = state === "failed" && last && errMsg.indexOf(last.slice(0, 60)) !== -1 ? last : null;
      const reg = register[m[1]] || {};
      return {
        id: m[1], title: stripReq(m[2]), priority: m[3], state, duration: t.duration || 0,
        err: errMsg, stack: (t.err && t.err.estack) || "", failedAssert,
        checks: lt ? lt.asserts.length : 0, checksFailed: failedAssert ? 1 : 0,
        waits: lt ? lt.waits : [], shot, req: reg.req || "", reqText: reg.reqText || "", regTitle: reg.title || "",
      };
    });
    const setupState = hookFail ? "failed" : "passed";
    return {
      key, title: stripReq(def.Name || s.title.slice(key.length + 3)), role: def.Role || "Unassigned", setup: !!def.Setup,
      tests, duration: s.duration || tests.reduce((a, t) => a + t.duration, 0),
      setupSteps: lg.setup.steps, setupChecks: lg.setup.asserts.length, setupWaits: lg.setup.waits,
      setupState, setupErr: hookFail ? (hookFail.err && hookFail.err.message) || "Suite setup failed" : "",
      setupFailedStep: hookFail ? lg.setup.steps[lg.setup.steps.length - 1] || "" : "",
    };
  });

  // Checks: every assertion logged in a passed item passed; in a failed item the failing one is the last.
  let checksPassed = 0, checksFailed = 0;
  suites.forEach((s) => {
    checksPassed += s.setupChecks - (s.setupState === "failed" ? 1 : 0);
    checksFailed += s.setupState === "failed" ? 1 : 0;
    s.tests.forEach((t) => { checksPassed += t.checks - t.checksFailed; checksFailed += t.checksFailed; });
  });

  const accounts = {};
  Object.keys(cfg.accounts || {}).forEach((role) => { accounts[role] = val(cfg.accounts[role]); });
  const testData = (cfg.testData || []).map((d) => {
    let v;
    if (d.value) v = resolveTokens(d.value, runData.data);
    else if (d.paths) v = d.paths.map(val).filter((x) => x != null && x !== "").join(d.join || ", ");
    else v = val(d.path);
    return { label: d.label, value: v == null ? "—" : String(v) };
  });

  const roleOrder = CONFIG.roleOrder.concat(suites.map((s) => s.role).filter((r) => CONFIG.roleOrder.indexOf(r) === -1));
  const roles = roleOrder.filter((r, i) => roleOrder.indexOf(r) === i).map((role) => {
    const rs = suites.filter((s) => s.role === role);
    const ts = [].concat(...rs.map((s) => s.tests));
    return { role, account: accounts[role] || "", suites: rs, total: ts.length, passed: ts.filter((t) => t.state === "passed").length, failed: ts.filter((t) => t.state === "failed").length + rs.filter((s) => s.setupState === "failed").length };
  }).filter((r) => r.suites.length);


  let pwVersion = "";
  try { pwVersion = require(path.join(ROOT, "node_modules", "playwright", "package.json")).version; } catch (_) { /* optional */ }

  return {
    title: cfg.title || "Test Report — " + execName, mode: cfg.mode || "", execName, env, appType,
    baseUrl: envCfg.url || "", browser: log.browser || "", pwVersion,
    start: stats.start, end: stats.end, duration: stats.duration,
    stats: { tests: stats.tests, passes: stats.passes, failures: stats.failures, skipped: (stats.pending || 0) + (stats.skipped || 0), checksPassed, checksFailed },
    suites, roles, accounts, testData, unmatched,
    sources: { mochawesome: mw.file, log: logFile, runData: runData.file, register: cfg.register ? abs(cfg.register) : null },
  };
}

// ---------------------------------------------------------------- history / comparison
function historySummary(model) {
  const seen = {};
  const tests = [];
  model.suites.forEach((s) => s.tests.forEach((t) => {
    const k = s.key + "|" + t.id;
    seen[k] = (seen[k] || 0) + 1;
    tests.push({ key: k + "|" + seen[k], suite: s.key, id: t.id, title: t.title, state: t.state, duration: t.duration });
  }));
  return { exec: model.execName, env: model.env, start: model.start, duration: model.duration, stats: model.stats, tests };
}

function compareWithPrevious(model) {
  const dir = abs(CONFIG.historyDir);
  const cur = historySummary(model);
  const safe = (s) => s.replace(/[^\w.-]/g, "-");
  const prefix = safe(model.execName.replace(/\.json$/, "") + "_" + model.env) + "_";
  let prev = null;
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir).filter((f) => f.indexOf(prefix) === 0).sort();
    for (let i = files.length - 1; i >= 0; i--) {
      const h = JSON.parse(fs.readFileSync(path.join(dir, files[i]), "utf8"));
      if (new Date(h.start) < new Date(model.start)) { prev = h; break; }
    }
  }
  if (!ARGS.noHistory) {
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, prefix + safe(model.start) + ".json"), JSON.stringify(cur, null, 1));
    const files = fs.readdirSync(dir).filter((f) => f.indexOf(prefix) === 0).sort();
    files.slice(0, Math.max(0, files.length - CONFIG.historyKeep)).forEach((f) => fs.unlinkSync(path.join(dir, f)));
  }
  if (!prev) return null;

  const before = {};
  prev.tests.forEach((t) => { before[t.key] = t; });
  const now = {};
  cur.tests.forEach((t) => { now[t.key] = t; });
  const dc = CONFIG.durationChange;
  const out = { prev, newFailures: [], fixed: [], added: [], removed: [], slower: [], faster: [] };
  cur.tests.forEach((t) => {
    const p = before[t.key];
    if (!p) return out.added.push(t);
    if (t.state === "failed" && p.state !== "failed") out.newFailures.push(t);
    if (t.state === "passed" && p.state === "failed") out.fixed.push(t);
    const d = t.duration - p.duration;
    if (Math.abs(d) >= dc.minMs && Math.abs(d) >= dc.ratio * Math.max(p.duration, 1)) (d > 0 ? out.slower : out.faster).push(Object.assign({ was: p.duration }, t));
  });
  prev.tests.forEach((t) => { if (!now[t.key]) out.removed.push(t); });
  out.slower.sort((a, b) => (b.duration - b.was) - (a.duration - a.was));
  out.faster.sort((a, b) => (a.duration - a.was) - (b.duration - b.was));
  return out;
}

// ---------------------------------------------------------------- HTML
// The raw error, only when it says more than the failed check (an assertion error repeats its message).
function extraErr(t) {
  if (!t.err) return "";
  if (!t.failedAssert) return t.err;
  const rest = t.err.replace(/^\w*Error: /, "").replace(t.failedAssert, "").replace(/^\s*\[expected .*\]\s*$/, "").trim();
  return rest ? t.err : "";
}

function render(model, cmp) {
  const badge = CONFIG.envBadges[model.env] || "#475569";
  const st = model.stats;
  const failedItems = [];
  model.suites.forEach((s) => {
    if (s.setupState === "failed") failedItems.push({ s, setup: true });
    s.tests.forEach((t) => { if (t.state === "failed") failedItems.push({ s, t }); });
  });
  const roleCards = model.roles.map((r) => `<div class="card role role-${esc(r.role.toLowerCase())}"><div class="num">${r.passed}/${r.total}</div><div class="lbl">${esc(r.role)} passed</div></div>`).join("");

  const stateIcon = (s) => (s === "passed" ? '<span class="ok" aria-label="passed">✔</span>' : s === "failed" ? '<span class="ko" aria-label="failed">✖</span>' : '<span class="sk" aria-label="skipped">–</span>');

  const testRow = (s, t) => {
    const search = [t.id, t.title, s.key, s.title].join(" ").toLowerCase();
    return `<details class="test ${t.state}" data-role="${esc(s.role)}" data-state="${t.state}" data-setup="${s.setup ? 1 : 0}" data-text="${esc(search)}">
<summary>${stateIcon(t.state)}${t.shot ? `<a href="#${t.shotId}" class="idlink" data-shot="${t.shotId}" title="Open the screenshot of ${esc(t.id)}"><code class="id">${esc(t.id)}</code> 📷</a>` : `<code class="id">${esc(t.id)}</code>`}<span class="ttl">${esc(t.title)}</span><span class="meta">${t.checks} check${t.checks === 1 ? "" : "s"} · ${fmtMs(t.duration)}</span></summary>
<div class="body">
${t.regTitle ? `<p><b>Test case:</b> ${esc(t.regTitle)}</p>` : ""}
<p><b>Checks:</b> ${t.checks - t.checksFailed} passed${t.checksFailed ? `, <span class="ko">${t.checksFailed} failed</span>` : ""}${t.priority ? ` · <b>Priority:</b> ${esc(t.priority)}` : ""}</p>
${t.state === "failed" ? `<div class="err"><b>Failed:</b> ${esc(t.failedAssert || t.err)}${t.failedAssert && extraErr(t) ? `<pre>${esc(extraErr(t))}</pre>` : ""}</div>` : ""}
${t.waits.length ? `<p><b>Waits:</b> ${t.waits.map(esc).join(" · ")}</p>` : ""}
${t.shot ? `<figure><a href="#${t.shotId}" class="idlink" data-shot="${t.shotId}"><img id="${t.shotId}" loading="lazy" src="${t.shot}" alt="Screen at the end of ${esc(t.id)}"></a><figcaption>Screen at the end of the test</figcaption></figure>` : ""}
</div></details>`;
  };

  const suiteBlock = (s) => {
    const passed = s.tests.filter((t) => t.state === "passed").length;
    return `<details class="suite" data-role="${esc(s.role)}" data-setup="${s.setup ? 1 : 0}" ${s.tests.some((t) => t.state === "failed") || s.setupState === "failed" ? "open" : ""}>
<summary><span class="skey">${esc(s.key)}</span><span class="stitle">${esc(s.title)}</span>${s.setup ? '<span class="tag setup">Setup</span>' : ""}<span class="meta">${passed}/${s.tests.length} passed · ${fmtMs(s.duration)}</span></summary>
<div class="suite-body">
<p class="steps">Setup steps: ${s.setupSteps.length ? s.setupSteps.map((x) => `<code>${esc(x)}</code>`).join(" → ") : "—"} ${s.setupState === "failed" ? `<span class="ko">✖ failed at ${esc(s.setupFailedStep)}: ${esc(s.setupErr)}</span>` : `<span class="ok">✔</span> (${s.setupChecks} checks)`}</p>
${s.tests.map((t) => testRow(s, t)).join("\n")}
</div></details>`;
  };

  const roleSections = model.roles.map((r) => `<section class="rolegroup" data-role="${esc(r.role)}">
<div class="rolehead role-${esc(r.role.toLowerCase())}"><span class="pill">${esc(r.role.toUpperCase())}</span><b>${esc(r.role === "Student" ? "Learner" : r.role)} account</b><code>${esc(r.account || "—")}</code><span class="meta">${r.total} case${r.total === 1 ? "" : "s"} · ${r.passed} passed${r.failed ? ` · <span class="ko">${r.failed} failed</span>` : ""}</span></div>
${r.suites.map(suiteBlock).join("\n")}
</section>`).join("\n");

  const failures = failedItems.length
    ? failedItems.map((f) => f.setup
      ? `<div class="fail"><div class="fhead"><span class="pill role-${esc(f.s.role.toLowerCase())}">${esc(f.s.role.toUpperCase())}</span><b>${esc(f.s.key)} setup failed</b> at <code>${esc(f.s.setupFailedStep)}</code></div><div class="err">${esc(f.s.setupErr)}</div><p class="muted">The suite's tests did not run. ${esc(f.s.title)}</p></div>`
      : `<div class="fail"><div class="fhead"><span class="pill role-${esc(f.s.role.toLowerCase())}">${esc(f.s.role.toUpperCase())}</span><code>${esc(f.t.id)}</code> ${esc(f.t.title)} <span class="muted">(${esc(f.s.key)})</span></div>
<div class="err"><b>Failed check:</b> ${esc(f.t.failedAssert || "(not an assertion — see the error)")}${extraErr(f.t) ? `<pre>${esc(extraErr(f.t))}</pre>` : ""}</div>
${f.t.shot ? `<a href="#${f.t.shotId}" class="idlink" data-shot="${f.t.shotId}"><img loading="lazy" src="${f.t.shot}" alt="Screen when ${esc(f.t.id)} failed"></a>` : ""}
${fs.existsSync(path.join(ROOT, f.s.key + ".zip")) ? `<p class="muted">Playwright trace: <code>${esc(f.s.key)}.zip</code> — open with <code>npx playwright show-trace ${esc(f.s.key)}.zip</code></p>` : ""}</div>`).join("\n")
    : `<div class="allgood">✔ No failures — all ${st.tests} tests and ${st.checksPassed} checks passed.</div>`;

  const tlist = (arr, fn) => (arr.length ? `<ul>${arr.map(fn).join("")}</ul>` : '<p class="muted">None.</p>');
  const comparison = !cmp
    ? '<p class="muted">No earlier run of this execution file on this environment is in the history yet — the next report will compare with this one.</p>'
    : `<p>Compared with the run of <b>${esc(fmtDate(cmp.prev.start))}</b>: ${cmp.prev.stats.passes}/${cmp.prev.stats.tests} passed in ${fmtMs(cmp.prev.duration)} → now ${st.passes}/${st.tests} in ${fmtMs(model.duration)} (${model.duration >= cmp.prev.duration ? "+" : "−"}${fmtMs(Math.abs(model.duration - cmp.prev.duration))}).</p>
<div class="cmpgrid">
<div><h4 class="ko">New failures (${cmp.newFailures.length})</h4>${tlist(cmp.newFailures, (t) => `<li><code>${esc(t.id)}</code> ${esc(t.title)} <span class="muted">${esc(t.suite)}</span></li>`)}</div>
<div><h4 class="ok">Fixed since then (${cmp.fixed.length})</h4>${tlist(cmp.fixed, (t) => `<li><code>${esc(t.id)}</code> ${esc(t.title)} <span class="muted">${esc(t.suite)}</span></li>`)}</div>
<div><h4>Much slower (${cmp.slower.length})</h4>${tlist(cmp.slower.slice(0, 10), (t) => `<li><code>${esc(t.id)}</code> ${fmtMs(t.was)} → <b>${fmtMs(t.duration)}</b> <span class="muted">${esc(t.suite)}</span></li>`)}</div>
<div><h4>Much faster (${cmp.faster.length})</h4>${tlist(cmp.faster.slice(0, 10), (t) => `<li><code>${esc(t.id)}</code> ${fmtMs(t.was)} → <b>${fmtMs(t.duration)}</b> <span class="muted">${esc(t.suite)}</span></li>`)}</div>
</div>
${cmp.added.length || cmp.removed.length ? `<p class="muted">Tests added: ${cmp.added.length} · removed: ${cmp.removed.length}${cmp.added.length ? " (" + cmp.added.slice(0, 8).map((t) => esc(t.id)).join(", ") + (cmp.added.length > 8 ? ", …" : "") + ")" : ""}${cmp.removed.length ? " · removed: " + cmp.removed.slice(0, 8).map((t) => esc(t.id)).join(", ") : ""}</p>` : ""}`;

  const waits = [];
  model.suites.forEach((s) => {
    s.setupWaits.forEach((w) => waits.push({ s, id: "(setup)", title: "", w }));
    s.tests.forEach((t) => t.waits.forEach((w) => waits.push({ s, id: t.id, title: t.title, w })));
  });
  const slowest = [].concat(...model.suites.map((s) => s.tests.map((t) => ({ s, t })))).sort((a, b) => b.t.duration - a.t.duration).slice(0, 10);
  const waitsHtml = `<div class="cmpgrid two">
<div><h4>Waits on slow product behaviour</h4>${waits.length ? `<table><tr><th>Test</th><th>What was waited for</th></tr>${waits.map((x) => `<tr><td><code>${esc(x.id)}</code><div class="muted">${esc(x.s.key)}</div></td><td>${esc(x.w)}</td></tr>`).join("")}</table>` : '<p class="muted">No waits recorded in this run\'s log.</p>'}</div>
<div><h4>Slowest tests</h4><table><tr><th>Test</th><th>Time</th></tr>${slowest.map((x) => `<tr class="${x.t.duration >= CONFIG.slowTestMs ? "slow" : ""}"><td><code>${esc(x.t.id)}</code> ${esc(x.t.title)}<div class="muted">${esc(x.s.key)} · ${esc(x.s.role)}</div></td><td class="time">${fmtMs(x.t.duration)}</td></tr>`).join("")}</table></div>
</div>`;

  const dataRows = [
    ["Environment", model.env.toUpperCase()],
    ["Base URL", model.baseUrl],
    ["Run mode", model.mode],
  ].concat(Object.keys(model.accounts).map((r) => [(r === "Student" ? "Student (learner)" : r) + " account", model.accounts[r] || "—"]))
    .concat([["Password", "•••••••• (masked)"]])
    .concat(model.testData.map((d) => [d.label, d.value]))
    .concat([["Browser", [model.browser, "Playwright " + model.pwVersion].filter(Boolean).join(" · ")], ["Execution file", model.execName]]);

  const roleChips = model.roles.map((r) => `<button class="chip" data-f-role="${esc(r.role)}">${esc(r.role)}</button>`).join("");

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(model.title.replace(/^Cambridge One – /, ""))}</title>
<style>
:root{--bg:#f4f6f9;--card:#fff;--ink:#1c2430;--muted:#64748b;--line:#e3e8ef;--ok:#15803d;--ok-bg:#e8f6ee;--ko:#b91c1c;--ko-bg:#fdecec;--acc:${badge};--student:#0b7bc0;--teacher:#d97706;--admin:#7c3aed;--code:#f1f4f8}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#0f141b;--card:#18202a;--ink:#e6ebf2;--muted:#94a3b8;--line:#2a3441;--ok:#4ade80;--ok-bg:#15291e;--ko:#f87171;--ko-bg:#321a1a;--code:#222c38}}
:root[data-theme="dark"]{--bg:#0f141b;--card:#18202a;--ink:#e6ebf2;--muted:#94a3b8;--line:#2a3441;--ok:#4ade80;--ok-bg:#15291e;--ko:#f87171;--ko-bg:#321a1a;--code:#222c38}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:14px/1.5 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
.wrap{max-width:1240px;margin:0 auto;padding:20px 16px 60px}
h1{font-size:24px;margin:0;display:flex;flex-wrap:wrap;gap:12px;align-items:center}h2{font-size:18px;margin:32px 0 12px}h4{margin:0 0 8px;font-size:14px}
.envbadge{background:var(--acc);color:#fff;border-radius:8px;padding:2px 12px;font-size:16px;letter-spacing:.06em}
.sub{color:var(--muted);margin:6px 0 18px}
.cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px}
.card{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:14px 16px}
.card .num{font-size:28px;font-weight:700}.card .lbl{color:var(--muted);font-size:12px;text-transform:uppercase;letter-spacing:.04em}
.card.env{border:2px solid var(--acc)}.card.env .num{font-size:18px;color:var(--ink)}.card.env .url{font-size:12px;color:var(--muted);word-break:break-all}
.card.pass .num{color:var(--ok)}.card.fail .num{color:var(--ko)}
.card.role{border-top:4px solid var(--muted)}.role-student{border-top-color:var(--student)!important}.role-teacher{border-top-color:var(--teacher)!important}.role-admin{border-top-color:var(--admin)!important}
table{width:100%;border-collapse:collapse;background:var(--card);border:1px solid var(--line);border-radius:10px;overflow:hidden}
th,td{text-align:left;padding:8px 12px;border-bottom:1px solid var(--line);vertical-align:top}th{font-size:12px;color:var(--muted);text-transform:uppercase}
table.kv td:first-child{width:220px;color:var(--muted);font-weight:600}
code{background:var(--code);border-radius:4px;padding:1px 5px;font-size:12.5px;overflow-wrap:anywhere}
.muted{color:var(--muted);font-size:12.5px}.ok{color:var(--ok);font-weight:700}.ko{color:var(--ko);font-weight:700}.sk{color:var(--muted)}
.allgood{background:var(--ok-bg);color:var(--ok);border-radius:10px;padding:14px 16px;font-weight:600}
.fail{background:var(--card);border:1px solid var(--line);border-left:4px solid var(--ko);border-radius:10px;padding:12px 16px;margin-bottom:12px}
.fhead{margin-bottom:6px}.err{background:var(--ko-bg);border-radius:8px;padding:8px 12px;margin:6px 0;overflow-wrap:anywhere}
.err pre{white-space:pre-wrap;margin:6px 0 0;font-size:12px;max-height:180px;overflow:auto}
.pill{display:inline-block;border-radius:6px;padding:1px 8px;font-size:11px;font-weight:700;color:#fff;background:var(--muted);margin-right:8px;letter-spacing:.05em}
.rolegroup{margin-bottom:18px}
.rolehead{display:flex;flex-wrap:wrap;gap:10px;align-items:center;background:var(--card);border:1px solid var(--line);border-left:5px solid var(--muted);border-radius:10px;padding:12px 16px;margin-bottom:8px}
.rolehead.role-student{border-left-color:var(--student)}.rolehead.role-teacher{border-left-color:var(--teacher)}.rolehead.role-admin{border-left-color:var(--admin)}
.rolehead.role-student .pill,.pill.role-student{background:var(--student)}.rolehead.role-teacher .pill,.pill.role-teacher{background:var(--teacher)}.rolehead.role-admin .pill,.pill.role-admin{background:var(--admin)}
.meta{margin-left:auto;color:var(--muted);font-size:12.5px;white-space:nowrap}
details.suite{background:var(--card);border:1px solid var(--line);border-radius:10px;margin:0 0 8px 14px}
details.suite>summary{padding:10px 14px;cursor:pointer;display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.skey{font-weight:700}.stitle{flex:1 1 300px}
.suite-body{padding:0 14px 10px}.steps{font-size:12.5px;color:var(--muted);margin:0 0 8px}
details.test{border-top:1px solid var(--line)}details.test>summary{padding:8px 4px;cursor:pointer;display:flex;flex-wrap:wrap;gap:8px;align-items:center}
details.test.failed>summary{background:var(--ko-bg);border-radius:6px}
.id{white-space:nowrap}.ttl{flex:1 1 280px}
.tag{border-radius:999px;padding:0 8px;font-size:11px;font-weight:600;border:1px solid var(--line);color:var(--muted)}
.tag.setup{background:var(--code)}
a.idlink{color:inherit;text-decoration:none;white-space:nowrap}a.idlink:hover code{outline:1px solid var(--ink)}a.idlink img{cursor:zoom-in}
dialog#viewer{border:0;border-radius:10px;padding:0 10px 10px;width:96vw;max-width:96vw;max-height:94vh;overflow:auto;background:var(--card);color:var(--ink)}dialog#viewer::backdrop{background:rgba(0,0,0,.7)}
dialog#viewer img{width:100%;height:auto;display:block;border:1px solid var(--line)}dialog#viewer.fit img{width:auto;max-width:100%;max-height:calc(94vh - 60px);margin:0 auto}
dialog#viewer .vhead{display:flex;flex-wrap:wrap;gap:8px;align-items:center;position:sticky;top:0;background:var(--card);padding:10px 0 8px;z-index:1}dialog#viewer .vhead .muted{margin-right:auto}
.body{padding:4px 8px 12px 28px}.body p{margin:4px 0}
figure{margin:8px 0}figure img,.fail img{max-width:min(560px,100%);border:1px solid var(--line);border-radius:6px;display:block}figcaption{font-size:12px;color:var(--muted)}
.toolbar{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:0 0 12px;position:sticky;top:0;background:var(--bg);padding:8px 0;z-index:2}
.chip{border:1px solid var(--line);background:var(--card);color:var(--ink);border-radius:999px;padding:4px 12px;cursor:pointer;font:inherit}
.chip.on{background:var(--ink);color:var(--bg)}
input[type=search]{flex:1 1 220px;border:1px solid var(--line);background:var(--card);color:var(--ink);border-radius:8px;padding:6px 10px;font:inherit}
.cmpgrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(260px,100%),1fr));gap:12px}.cmpgrid>div{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:12px 14px}
.cmpgrid.two{grid-template-columns:repeat(auto-fit,minmax(min(360px,100%),1fr))}.cmpgrid table{border:0}
.cmpgrid ul{margin:0;padding-left:18px}tr.slow td.time{color:var(--ko);font-weight:700}
.hidden{display:none!important}
td.time,.tag{white-space:nowrap}
td{overflow-wrap:anywhere}
footer{margin-top:40px;color:var(--muted);font-size:12px}
@media (max-width:640px){.meta{margin-left:0}table.kv td:first-child{width:auto}.cmpgrid.two{grid-template-columns:1fr}details.suite{margin-left:0}}
@media print{.toolbar,.noprint{display:none!important}body{background:#fff;font-size:12px}.card,details.suite,.fail,table{break-inside:avoid}details>summary{list-style:none}figure img{max-width:360px}.wrap{max-width:none}}
</style></head><body><div class="wrap">
<h1>${esc(model.title)} <span class="envbadge">${esc(model.env.toUpperCase())}</span></h1>
<p class="sub">Run: ${esc(fmtDate(model.start))} · ${esc(model.mode)} · Playwright ${esc(model.pwVersion)}</p>

<div class="cards">
<div class="card env"><div class="num">${esc(model.env.charAt(0).toUpperCase() + model.env.slice(1))}</div><div class="lbl">Environment</div><div class="url">${esc(model.baseUrl)}</div></div>
<div class="card"><div class="num">${st.tests}</div><div class="lbl">Total cases</div></div>
<div class="card pass"><div class="num">${st.passes}</div><div class="lbl">Passed</div></div>
<div class="card ${st.failures ? "fail" : ""}"><div class="num">${st.failures}</div><div class="lbl">Failed</div></div>
${st.skipped ? `<div class="card"><div class="num">${st.skipped}</div><div class="lbl">Skipped</div></div>` : ""}
<div class="card pass"><div class="num">${st.checksPassed}</div><div class="lbl">Passed checks</div></div>
${st.checksFailed ? `<div class="card fail"><div class="num">${st.checksFailed}</div><div class="lbl">Failed checks</div></div>` : ""}
${roleCards}
<div class="card"><div class="num">${esc(fmtMs(model.duration))}</div><div class="lbl">Total duration</div></div>
</div>

<h2>Failures</h2>
${failures}

<h2>Compared with the previous run</h2>
${comparison}

<h2>Test data &amp; environment</h2>
<table class="kv">${dataRows.map((r) => `<tr><td>${esc(r[0])}</td><td>${esc(r[1])}</td></tr>`).join("")}</table>

<h2>Summary by user type</h2>
<div class="toolbar noprint">
<button class="chip on" data-f-role="">All users</button>${roleChips}
<span class="muted">|</span>
<button class="chip on" data-f-state="">All results</button><button class="chip" data-f-state="passed">Passed</button><button class="chip" data-f-state="failed">Failed</button>
<button class="chip" id="hideSetup">Hide setup</button>
<input type="search" id="q" placeholder="Search test ID or title">
<button class="chip" id="expand">Expand all</button><button class="chip" id="collapse">Collapse all</button><button class="chip" onclick="window.print()">Print / PDF</button>
</div>
${roleSections}

<h2>Waits and slow tests</h2>
${waitsHtml}

<footer>Built ${esc(fmtDate(new Date()))} by <code>tooling/report/buildReport.js</code> from ${[model.sources.mochawesome, model.sources.log, model.sources.runData].filter(Boolean).map((f) => `<code>${esc(shortPath(f))}</code>`).join(", ")}. Screenshots are taken at the end of each test and embedded in this page; click a test ID to open its screenshot.</footer>
</div>
<dialog id="viewer"><div class="vhead"><b id="vtitle"></b><span class="muted" id="vsize"></span><button class="chip" id="vfit">Fit to window</button><button class="chip" id="vclose">Close</button></div><img id="vimg" alt=""></dialog>
<script>
(function(){
  var f={role:"",state:"",setup:true,q:""};
  function apply(){
    document.querySelectorAll("details.test").forEach(function(t){
      var ok=(!f.role||t.dataset.role===f.role)&&(!f.state||t.dataset.state===f.state)&&(f.setup||t.dataset.setup!=="1")&&(!f.q||t.dataset.text.indexOf(f.q)!==-1);
      t.classList.toggle("hidden",!ok);
    });
    document.querySelectorAll("details.suite").forEach(function(s){
      var any=s.querySelector("details.test:not(.hidden)");s.classList.toggle("hidden",!any);
      if(any&&(f.q||f.state))s.open=true;
    });
    document.querySelectorAll(".rolegroup").forEach(function(g){g.classList.toggle("hidden",!g.querySelector("details.suite:not(.hidden)"));});
  }
  function group(attr){document.querySelectorAll("[data-f-"+attr+"]").forEach(function(b){b.addEventListener("click",function(){
    f[attr]=b.getAttribute("data-f-"+attr);
    document.querySelectorAll("[data-f-"+attr+"]").forEach(function(x){x.classList.toggle("on",x===b);});apply();});});}
  group("role");group("state");
  document.getElementById("hideSetup").addEventListener("click",function(){f.setup=!f.setup;this.classList.toggle("on",!f.setup);apply();});
  document.getElementById("q").addEventListener("input",function(){f.q=this.value.trim().toLowerCase();apply();});
  document.getElementById("expand").addEventListener("click",function(){document.querySelectorAll("details").forEach(function(d){d.open=true;});});
  document.getElementById("collapse").addEventListener("click",function(){document.querySelectorAll("details").forEach(function(d){d.open=false;});});
  var dlg=document.getElementById("viewer");
  document.addEventListener("click",function(e){var a=e.target.closest("a.idlink");if(!a)return;e.preventDefault();e.stopPropagation();
    var img=document.getElementById(a.getAttribute("data-shot"));if(!img)return;
    // Full-page screenshots open at full width and scroll; "Fit to window" shows the whole page at once.
    var v=document.getElementById("vimg"),vs=document.getElementById("vsize");vs.textContent="";
    v.onload=function(){vs.textContent=v.naturalWidth+" × "+v.naturalHeight+" px";};
    v.src=img.src;document.getElementById("vtitle").textContent=img.alt;
    dlg.classList.remove("fit");document.getElementById("vfit").classList.remove("on");dlg.showModal();dlg.scrollTop=0;},true);
  document.getElementById("vfit").addEventListener("click",function(){this.classList.toggle("on",dlg.classList.toggle("fit"));});
  document.getElementById("vclose").addEventListener("click",function(){dlg.close();});
  dlg.addEventListener("click",function(e){if(e.target===dlg)dlg.close();});
  window.addEventListener("beforeprint",function(){document.querySelectorAll("details.suite").forEach(function(d){d.open=true;});});
})();
</script>
</body></html>`;
}

// ---------------------------------------------------------------- output
async function main() {
  const model = buildModel();
  const cmp = compareWithPrevious(model);

  const d = new Date(model.start);
  const stamp = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(d.getHours())}h${pad(d.getMinutes())}`;
  const name = `${model.execName.replace(/\.json$/, "")}_${model.env}_${stamp}`;
  const outDir = path.join(abs(ARGS.out || CONFIG.outputDir), name);
  fs.mkdirSync(outDir, { recursive: true });

  // Screenshots stay embedded as data URIs (user request 2026-09-24: one self-contained page to share).
  let n = 0;
  model.suites.forEach((s) => s.tests.forEach((t) => { if (t.shot) t.shotId = "shot-" + ++n; }));

  const htmlFile = path.join(outDir, "index.html");
  fs.writeFileSync(htmlFile, render(model, cmp));

  let zipFile = null;
  if (!ARGS.noZip) {
    const JSZip = require("jszip");
    const zip = new JSZip();
    const folder = zip.folder(name);
    folder.file("index.html", fs.readFileSync(htmlFile));
    zipFile = outDir + ".zip";
    fs.writeFileSync(zipFile, await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" }));
  }

  const st = model.stats;
  console.log(`[report] ${model.execName} on ${model.env}: ${st.passes}/${st.tests} passed, ${st.failures} failed, ${st.checksPassed} checks passed, ${st.checksFailed} failed`);
  console.log(`[report] roles: ${model.roles.map((r) => r.role + " " + r.passed + "/" + r.total).join(", ")}`);
  if (model.unmatched.length) console.log(`[report] WARNING: ${model.unmatched.length} test(s) not found in the log: ${model.unmatched.slice(0, 5).join(", ")}`);
  console.log(`[report] log: ${model.sources.log ? path.relative(ROOT, model.sources.log) : "NOT FOUND (checks and waits omitted)"}`);
  console.log(`[report] compared with: ${cmp ? cmp.prev.start : "no previous run in history"}`);
  console.log(`[report] page: ${htmlFile}`);
  if (zipFile) console.log(`[report] zip : ${zipFile}`);
}

main().catch((e) => {
  console.error("[report] FAILED: " + (e && e.stack ? e.stack : e));
  process.exit(1);
});

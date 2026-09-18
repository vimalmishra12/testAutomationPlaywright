"use strict";

/**
 * automationAudit — derive each manual register case's REAL automation status from code.
 *
 * The registers' `Status` column had drifted badly (2026-09-16): it conflated
 * "a human ran this by hand" with "an automated suite runs this and it is green",
 * and its values had split into seven spellings across the six Admin registers.
 * Prose in the register headers ("64 of 92 automated") was maintained by hand and
 * disagreed with both the code and `authoring-status.md`.
 *
 * So: never trust the prose. Compute from ground truth, which is unambiguous —
 *
 *   WIRED   the TC id sits in a step slot of a testExecutionFiles/<app>/<env>/*.json suite
 *   CODED   a handler of the same name is exported from a test/<app>/*.test.js file
 *
 * and classify:
 *
 *   Automated            WIRED + CODED        — a suite really runs it
 *   Written - not wired  CODED, not WIRED     — code exists but nothing executes it
 *   Not Automated        neither
 *   Blocked              carries a blocker in the register (overrides the above)
 *   Excluded - Phase 1   carries the [EXTRA - Phase 1 exclusion] marker in Remarks
 *
 * Blocked and Excluded are register facts, not code facts, so they are read from the
 * .md and take precedence — a case can be both Blocked and unautomated, and the
 * blocker is the useful thing to show.
 *
 * Usage:
 *   node tooling/automationAudit.js report [<registerDir> ...]   # human-readable
 *   node tooling/automationAudit.js json   [<registerDir> ...]   # machine-readable
 *
 * With no dirs it audits every AdminApp-* register under test/Manual/C1App/.
 * READ-ONLY — it never writes. Applying the result to the registers is a separate,
 * deliberate step (tooling/xlsxRegister.js + the .md).
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

/** Every TC id wired into an execution file, mapped to the suites that run it. */
function collectWired() {
  const wired = new Map();
  const base = path.join(ROOT, "testResources", "testExecutionFiles");
  for (const file of walk(base, ".json")) {
    let doc;
    try {
      doc = JSON.parse(fs.readFileSync(file, "utf8"));
    } catch (e) {
      console.error("WARN  unparseable exec file, skipped: " + rel(file) + " (" + e.message + ")");
      continue;
    }
    // Only ids in an actual step slot count as wired. A TC id mentioned in a
    // "description" string is documentation, not execution.
    for (const suite of Object.values(doc)) {
      if (!suite || typeof suite !== "object") continue;
      for (const slot of ["Before", "BeforeEach", "Test", "AfterEach", "After"]) {
        for (const step of suite[slot] || []) {
          if (!step || !step.id) continue;
          if (!wired.has(step.id)) wired.set(step.id, new Set());
          wired.get(step.id).add(path.basename(file, ".json"));
        }
      }
    }
  }
  return wired;
}

/** Every TC id implemented as an exported handler, mapped to its test file. */
function collectCoded() {
  const coded = new Map();
  for (const file of walk(path.join(ROOT, "test"), ".test.js")) {
    const text = fs.readFileSync(file, "utf8");
    // A handler is a property definition at the start of a line:
    //   TST_X_TC_1: async function
    // Matching that shape (rather than any occurrence) keeps the hundreds of TC ids
    // that appear in comments from counting as implementations.
    const re = /^\s*(TST_[A-Z0-9]+_TC_[A-Za-z0-9_]+)\s*:\s*(?:async\s+)?function/gm;
    let m;
    while ((m = re.exec(text)) !== null) {
      if (!coded.has(m[1])) coded.set(m[1], new Set());
      coded.get(m[1]).add(path.basename(file, ".test.js"));
    }
  }
  return coded;
}

/**
 * Read the archived mochawesome reports written by tooling/auditRun.sh and reduce them to
 * one verdict per TC id.
 *
 * Titles look like "TST_CLST_TC_5 Verify search by class name ... - (P1)", so the id is the
 * first token. A case that appears in more than one pass is only "pass" if it passed in
 * EVERY pass - a case that passes once and fails once is flaky, which is a distinct fact
 * from passing, and recording it as Pass is exactly the drift this whole exercise exists to
 * remove.
 */
const RUNS_PER_SUITE = 2;

function collectRunResults() {
  const dir = path.join(ROOT, "output", "reports", "auditRuns");
  const byId = new Map();
  if (!fs.existsSync(dir)) return byId;

  // Only the most recent RUNS_PER_SUITE reports per suite count, newest first by mtime.
  //
  // Otherwise a verdict can never recover: a case that was genuinely flaky, was then FIXED and
  // now passes twice would still read "Flaky" forever, because the pre-fix failure sits in the
  // archive for good. Two latest runs is also exactly the bar this repo already uses to call a
  // suite good ("2 consecutive clean runs"), so the verdict answers the question people
  // actually ask of the register: is it green NOW.
  const chosen = [];
  const bySuite = new Map();
  for (const f of fs.readdirSync(dir).filter((f) => f.endsWith(".json"))) {
    const suite = path.basename(f, ".json").split("__")[0];
    if (!bySuite.has(suite)) bySuite.set(suite, []);
    bySuite.get(suite).push({ file: f, mtime: fs.statSync(path.join(dir, f)).mtimeMs });
  }
  for (const list of bySuite.values()) {
    list.sort((a, b) => b.mtime - a.mtime);
    for (const e of list.slice(0, RUNS_PER_SUITE)) chosen.push(e.file);
  }

  for (const file of chosen) {
    const [suite, passLabel] = path.basename(file, ".json").split("__");
    let doc;
    try {
      doc = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8"));
    } catch (e) {
      console.error("WARN  unreadable run report, skipped: " + file);
      continue;
    }
    const tests = [];
    (function walkSuites(s) {
      for (const sub of s.suites || []) walkSuites(sub);
      for (const t of s.tests || []) tests.push(t);
    })({ suites: doc.results || [] });

    for (const t of tests) {
      const m = /^(TST_[A-Z0-9]+_TC_[A-Za-z0-9_]+)\b/.exec(t.title || "");
      if (!m) continue;
      const id = m[1];
      if (!byId.has(id)) byId.set(id, { runs: [] });
      byId.get(id).runs.push({
        suite,
        pass: passLabel,
        state: t.pass ? "pass" : t.fail ? "fail" : t.pending ? "pending" : "unknown",
        durationMs: t.duration,
        error: t.err && t.err.message ? String(t.err.message).split("\n")[0] : ""
      });
    }
  }
  for (const rec of byId.values()) {
    const states = rec.runs.map((r) => r.state);
    rec.verdict = states.every((s) => s === "pass")
      ? "Pass"
      : states.every((s) => s === "fail")
        ? "Fail"
        : states.includes("pass") && states.includes("fail")
          ? "Flaky"
          : "Not Run";
    rec.lastError = (rec.runs.find((r) => r.error) || {}).error || "";
    rec.suites = [...new Set(rec.runs.map((r) => r.suite))].sort();
  }
  return byId;
}

/**
 * Parse a register .md into its cases. The format is one vertical
 * "| **Field** | Value |" block per case, so a "Test Case ID" row starts a case and
 * every field row after it belongs to that case.
 */
function parseRegister(mdFile) {
  const lines = fs.readFileSync(mdFile, "utf8").split(/\r?\n/);
  const cases = [];
  let cur = null;
  for (const line of lines) {
    const m = /^\|\s*\*\*(.+?)\*\*\s*\|\s*([\s\S]*?)\s*\|\s*$/.exec(line);
    if (!m) continue;
    const field = m[1].trim();
    const value = m[2].trim();
    if (field === "Test Case ID") {
      cur = { id: stripMd(value), fields: {}, file: mdFile };
      cases.push(cur);
    } else if (cur) {
      cur.fields[field] = value;
    }
  }
  return cases;
}

function stripMd(s) {
  return s.replace(/[`*]/g, "").trim();
}

/**
 * Some register cases are automated under a DIFFERENT id. The bulk class-creation
 * form (BCCF) was automated onto the pre-existing CCLS module rather than given its
 * own, and the register records that in Comments as "Automated: TST_CCLS_TC_13
 * (bulk suite)". Ignoring this convention made 16 correctly-automated BCCF cases
 * look like drift (2026-09-16), so any TC id named in Comments counts as a
 * surrogate: if IT is wired and coded, the register case is covered. The surrogate
 * is reported alongside, so the claim stays auditable rather than implicit.
 *
 * Only ids inside an "Automated: ..." clause count. Comments freely cross-reference
 * OTHER cases for unrelated reasons ("the fixture used by TST_MRPT_TC_41", "see
 * TST_CLST_TC_4's Actual Result"); reading every id in the field as a surrogate
 * made three Blocked cases look automated (2026-09-16). The clause ends at the
 * first sentence break, which is where the alias list ends in every observed use.
 */
function surrogateIds(comments, ownId) {
  const ids = [];
  for (const clause of comments.match(/Automated\b[^.|]*/gi) || [])
    ids.push(...(clause.match(/TST_[A-Z0-9]+_TC_[A-Za-z0-9_]+/g) || []));
  return [...new Set(ids)].filter((id) => id !== ownId);
}

function classify(tc, wired, coded, runs) {
  const remarks = tc.fields["Remarks"] || "";
  const status = stripMd(tc.fields["Status"] || "");
  const comments = tc.fields["Comments / Defect ID"] || "";

  const surrogates = surrogateIds(comments, tc.id).filter((id) => wired.has(id) && coded.has(id));
  const isWired = wired.has(tc.id) || surrogates.length > 0;
  const isCoded = coded.has(tc.id) || surrogates.length > 0;

  // Register facts win over code facts - see the header comment.
  const excluded = /EXTRA\s*[—-]\s*Phase 1 exclusion/i.test(remarks);
  // Status ONLY, never Remarks: Remarks is prose and routinely uses the word
  // "blocked" to discuss product behaviour ("'blocked' and 'warned but allowed'
  // are different products"), which produced false Blocked verdicts on 2026-09-16.
  const blocked = /blocked/i.test(status);

  let automation;
  if (blocked) automation = "Blocked";
  else if (isWired && isCoded) automation = "Automated";
  else if (isCoded) automation = "Written - not wired";
  else if (excluded) automation = "Excluded - Phase 1";
  else automation = "Not Automated";

  return {
    id: tc.id,
    title: tc.fields["Title"] || "",
    registerStatus: status || "(blank)",
    automation,
    excluded,
    blocked,
    wired: isWired,
    coded: isCoded,
    surrogates,
    // The observed result, from real archived runs - empty when nothing has executed it.
    run: [tc.id, ...surrogates].map((id) => runs && runs.get(id)).find(Boolean) || null,
    suites: [...new Set([tc.id, ...surrogates].flatMap((id) => [...(wired.get(id) || [])]))].sort(),
    testFiles: [...new Set([tc.id, ...surrogates].flatMap((id) => [...(coded.get(id) || [])]))].sort(),
    comments,
    // Each flag is a place the register and the code disagree.
    discrepancies: discrepancies({ isWired, isCoded, blocked, excluded, status })
  };
}

function discrepancies(f) {
  const out = [];
  const saysPass = /^pass$/i.test(f.status);
  if (saysPass && !f.isWired) out.push("register says Pass but no suite runs it");
  if (!saysPass && f.isWired && f.isCoded && !f.blocked)
    out.push("suite runs it but register status is '" + f.status + "'");
  if (f.isWired && !f.isCoded) out.push("wired into a suite but no handler found - suite would fail");
  if (f.isCoded && !f.isWired && !f.excluded) out.push("handler written but no exec file runs it");
  if (f.blocked && f.isWired) out.push("marked Blocked but a suite runs it");
  return out;
}

function walk(dir, suffix) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules") continue;
      out.push(...walk(p, suffix));
    } else if (entry.name.endsWith(suffix)) out.push(p);
  }
  return out;
}

function rel(p) {
  return path.relative(ROOT, p).replace(/\\/g, "/");
}

function defaultRegisters() {
  const base = path.join(ROOT, "test", "Manual", "C1App");
  return fs
    .readdirSync(base, { withFileTypes: true })
    .filter((e) => e.isDirectory() && e.name.startsWith("AdminApp-"))
    .map((e) => path.join(base, e.name));
}

function audit(dirs) {
  const wired = collectWired();
  const coded = collectCoded();
  const runs = collectRunResults();
  return dirs.map((dir) => {
    const md = fs
      .readdirSync(dir)
      .filter((f) => f.endsWith(".md"))
      .map((f) => path.join(dir, f))[0];
    if (!md) throw new Error("No register .md in " + rel(dir));
    return {
      register: path.basename(dir),
      md: rel(md),
      // Absolute too: `rel()` cannot express a path on another drive, so a caller that
      // re-joins `md` onto ROOT breaks for any register dir outside the repo (a scratch
      // copy under C:\ while the repo is on D:\). Writers use this.
      mdAbs: md,
      cases: parseRegister(md).map((tc) => classify(tc, wired, coded, runs))
    };
  });
}

const ORDER = ["Automated", "Written - not wired", "Blocked", "Excluded - Phase 1", "Not Automated"];

function main() {
  const [, , cmd, ...args] = process.argv;
  const dirs = args.length ? args.map((a) => path.resolve(ROOT, a)) : defaultRegisters();
  const results = audit(dirs);

  if (cmd === "json") {
    process.stdout.write(JSON.stringify(results, null, 2) + "\n");
    return;
  }

  const grand = {};
  for (const r of results) {
    const tally = {};
    for (const c of r.cases) tally[c.automation] = (tally[c.automation] || 0) + 1;
    for (const k of Object.keys(tally)) grand[k] = (grand[k] || 0) + tally[k];
    console.log("\n=== " + r.register + "  (" + r.cases.length + " cases)  " + r.md);
    for (const k of ORDER) if (tally[k]) console.log("    " + String(tally[k]).padStart(4) + "  " + k);
    const flagged = r.cases.filter((c) => c.discrepancies.length);
    if (flagged.length) {
      console.log("    --- " + flagged.length + " discrepancy(ies) between register and code ---");
      for (const c of flagged) console.log("      " + c.id.padEnd(22) + c.discrepancies.join("; "));
    }
  }
  const total = results.reduce((n, r) => n + r.cases.length, 0);
  console.log("\n=== TOTAL  (" + total + " cases)");
  for (const k of ORDER) if (grand[k]) console.log("    " + String(grand[k]).padStart(4) + "  " + k);
}

if (require.main === module) main();
module.exports = { audit, collectWired, collectCoded, collectRunResults, parseRegister };

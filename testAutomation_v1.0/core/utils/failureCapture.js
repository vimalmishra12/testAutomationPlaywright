"use strict";
/**
 * Failure capture [2026-09-29, user request — ADR-024 amendment 2].
 *
 * Called by testrunner.js → identifyTest() whenever a step throws — Before / BeforeEach / Test /
 * AfterEach / After alike. It captures the page AT THE MOMENT OF FAILURE (full-page screenshot, URL,
 * title, start of the visible text) and:
 *   1. saves it to disk at once — output/reports/TestReports/failures/<exec>_<env>_<start>/ — so the
 *      evidence survives a run that is stopped or crashes (mochawesome only writes at the very end);
 *   2. when the failing step is a Mocha HOOK (a suite's setup / teardown), attaches it to that hook in
 *      the mochawesome report. Mocha does not run afterEach for a failed hook, so until now a failed
 *      setup step had no screenshot at all; the summary report (buildReport.js) reads it from there.
 *      A failed TEST already gets its screenshot from playwright.setup.js afterEach, taken straight
 *      after this, so nothing is attached for tests (no duplicate).
 *
 * Best-effort by design: it never throws, is capped in time, and the caller re-throws the original
 * error untouched. Failure folders are pruned to the report history size (report.config.json
 * historyKeep, 30 by default).
 */
const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const SHOT_MS = 15000; // cap per capture call — a hung page must not hang the run
const STARTED = new Date();
let runDir = null;
let seq = 0;

let addContext = null;
try { addContext = require("mochawesome/addContext"); } catch (_) { /* reporter not installed */ }

const pad = (n) => String(n).padStart(2, "0");
const stamp = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(d.getHours())}h${pad(d.getMinutes())}m${pad(d.getSeconds())}s`;
const safe = (s) => String(s || "").replace(/[^\w.+-]+/g, "_").slice(0, 80);

function withTimeout(promise, ms) {
  let t;
  return Promise.race([promise, new Promise((_, rej) => { t = setTimeout(() => rej(new Error("timed out after " + ms + " ms")), ms); })])
    .finally(() => clearTimeout(t));
}

function keepRuns() {
  try {
    const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, "tooling", "report", "report.config.json"), "utf8"));
    return cfg.historyKeep > 0 ? cfg.historyKeep : 30;
  } catch (_) { return 30; }
}

/** The run's failure folder, created on the first failure; older run folders beyond keepRuns() are removed. */
function getRunDir() {
  if (runDir) return runDir;
  const argv = global.argv || {};
  const exec = String(argv.testExecFile || "run").split(",").map((f) => path.basename(f.trim(), ".json")).join("+");
  const base = path.join(ROOT, global.reportOutputDir || "output/reports/TestReports", "failures");
  runDir = path.join(base, `${safe(exec)}_${safe(argv.testEnv || "env")}_${stamp(STARTED)}`);
  fs.mkdirSync(runDir, { recursive: true });
  fs.writeFileSync(path.join(runDir, "run.json"), JSON.stringify({ exec: argv.testExecFile, env: argv.testEnv, startedAt: STARTED.toISOString() }, null, 2));
  try {
    const dirs = fs.readdirSync(base)
      .map((d) => path.join(base, d))
      .filter((d) => fs.statSync(d).isDirectory())
      .sort((a, b) => fs.statSync(a).mtimeMs - fs.statSync(b).mtimeMs);
    dirs.slice(0, Math.max(0, dirs.length - keepRuns())).forEach((d) => fs.rmSync(d, { recursive: true, force: true }));
  } catch (_) { /* pruning is housekeeping only */ }
  return runDir;
}

module.exports = {
  /**
   * @param {{ testFile: string, tcId: string, error: Error }} step
   * @returns {Promise<string|null>} the saved screenshot path, or null
   */
  onStepFailure: async function (step) {
    try {
      const page = global.page;
      if (!page) return null;
      // The step is still inside its Mocha time limit. Restart that clock so the capture cannot turn the
      // real error into a Mocha timeout (Runnable#timeout(ms) restarts a running timer from now).
      const runnable = global.__mochaRunner && global.__mochaRunner.currentRunnable;
      if (runnable && typeof runnable.timeout === "function" && runnable.timeout() !== 0) {
        runnable.timeout(SHOT_MS * 3); // title 5 s + text 5 s + full-page shot ≤ 15 s (+ viewport fallback)
      }

      const dir = getRunDir();
      const file = `${pad(++seq)}_${safe(step.tcId)}`;
      const info = {
        tcId: step.tcId,
        testFile: step.testFile,
        kind: runnable ? runnable.type : null, // "hook" | "test"
        step: runnable ? runnable.title : null,
        suite: runnable && runnable.parent ? runnable.parent.title : null,
        error: String((step.error && step.error.message) || step.error || "").slice(0, 1000),
        at: new Date().toISOString(),
      };
      try { info.url = page.url(); } catch (_) { /* page closed */ }
      info.title = await withTimeout(page.title(), 5000).catch(() => null);
      info.visibleText = await withTimeout(page.evaluate(() => (document.body ? document.body.innerText : "")), 5000)
        .then((t) => String(t).slice(0, 2000)).catch(() => null);
      const buf = await withTimeout(page.screenshot({ fullPage: true }), SHOT_MS)
        .catch(() => withTimeout(page.screenshot({ fullPage: false }), SHOT_MS))
        .catch((e) => { info.shotError = e.message; return null; });
      if (buf) {
        fs.writeFileSync(path.join(dir, file + ".png"), buf);
        info.screenshot = file + ".png";
      }
      fs.writeFileSync(path.join(dir, file + ".json"), JSON.stringify(info, null, 2));

      // A failed hook gets no afterEach screenshot — attach this one to the hook in the mochawesome report.
      if (buf && addContext && runnable && runnable.type === "hook") {
        addContext({ test: runnable }, { title: "Screenshot (at failure)", value: "data:image/png;base64," + buf.toString("base64") });
        addContext({ test: runnable }, { title: "Page at failure", value: (info.url || "?") + (info.title ? " — " + info.title : "") });
      }
      const saved = buf ? path.join(dir, file + ".png") : null;
      console.log(`[failure-capture] ${step.tcId}: ${saved ? path.relative(ROOT, saved) : "no screenshot (" + info.shotError + ")"} · ${info.url || "no URL"}`);
      return saved;
    } catch (e) {
      console.log("[failure-capture] skipped: " + (e && e.message));
      return null;
    }
  },
};

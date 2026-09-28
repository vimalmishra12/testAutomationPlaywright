"use strict";
/**
 * Builds the assertion evidence report (ADR-025) from a run folder written by
 * core/utils/assertionEvidence.js:
 *   <runDir>/run.json          run metadata (exec file, env, appType, start / end)
 *   <runDir>/evidence.jsonl    one JSON record per test (checks, linked elements, boxes)
 *   <runDir>/shots/NNNN.png    end-of-test screenshot per test
 * → <runDir>/index.html        RESULTS view: pass / fail, marks, check messages (shareable)
 * → <runDir>/debug.html        DEBUG view: everything recorded (selectors, values, raw data)
 * Both are self-contained (screenshots embedded).
 *
 * Runs automatically at the end of a run: --assertReport=true builds index.html,
 * --assertReport=debug builds both. Also runnable by hand — e.g. after a crashed run, or to get
 * the debug view of a run made with =true (both modes record the same data):
 *   node core/utils/assertion-report/buildAssertionReport.js [--from=<runDir>] [--view=results|debug]
 * With no --from it takes the newest folder under output/reports/TestReports/assertionReport;
 * with no --view it builds what the run's mode would have built.
 *
 * Lives under core/utils (not tooling/) because the runner calls it — AGENTS.md §9 forbids
 * framework files from requiring anything under tooling/.
 */

const fs = require("fs");
const nodePath = require("path");

const TEMPLATE = nodePath.join(__dirname, "template.html");
const DEFAULT_ROOT = nodePath.join(process.cwd(), "output", "reports", "TestReports", "assertionReport");

function readRecords(runDir) {
    const file = nodePath.join(runDir, "evidence.jsonl");
    if (!fs.existsSync(file)) return [];
    const out = [];
    fs.readFileSync(file, "utf8").split(/\r?\n/).forEach(function (line) {
        if (!line.trim()) return;
        // A run killed mid-write can leave a partial last line — skip it rather than fail.
        try { out.push(JSON.parse(line)); } catch (_) { /* partial line */ }
    });
    return out;
}

/**
 * RESULTS view data. Fields are REMOVED here, not hidden in the page: the report is meant to be
 * forwarded, and anything embedded would still be readable in the page source — selectors, the
 * values read from the page (test emails, usernames) and the raw record stay out of the file.
 * Kept: what a reader needs to judge the run — check messages, pass / fail, the expected vs
 * actual of a FAILED check, and the confident (non-"inferred") marks.
 */
function resultsView(tests) {
    return tests.map(function (t) {
        const failed = t.state === "failed" || t.state === "retried";
        return {
            index: t.index, title: t.title, suite: t.suite, state: t.state, attempt: t.attempt,
            durationMs: t.durationMs,
            // First line only — the full error (stack, expect() dump) is debug material.
            error: failed && t.error ? String(t.error).split("\n")[0] : null,
            shot: t.shot,
            checks: (t.checks || []).map(function (c) {
                const drawable = c.link === "exact";
                return {
                    n: c.n, status: c.status, message: c.message, kind: c.kind, link: c.link,
                    expected: c.status === "failed" ? c.expected : null,
                    actual: c.status === "failed" ? c.actual : null,
                    error: c.status === "failed" && c.error ? String(c.error).split("\n")[0] : null,
                    targets: (c.targets || []).map(function (x) {
                        const shown = drawable && x.state === "shown";
                        return { state: shown ? "shown" : "notShown", box: shown ? x.box : null };
                    })
                };
            })
        };
    });
}

/** Builds the report for `view` ("results" → index.html, "debug" → debug.html); returns its path. */
function build(runDir, view) {
    view = view === "debug" ? "debug" : "results";
    let meta = {};
    try { meta = JSON.parse(fs.readFileSync(nodePath.join(runDir, "run.json"), "utf8")); } catch (_) { meta = {}; }
    let tests = readRecords(runDir);
    if (view === "results") tests = resultsView(tests);
    tests.forEach(function (t) {
        if (!t.shot || !t.shot.path) return;
        const p = nodePath.join(runDir, t.shot.path);
        try { t.shot.src = "data:image/png;base64," + fs.readFileSync(p).toString("base64"); } catch (_) { t.shot.src = null; }
    });
    // Escape so no recorded string (a message, a page text) can close the <script> block.
    const json = JSON.stringify({ view: view, meta: meta, tests: tests })
        .replace(/</g, "\\u003c").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
    // A replacer FUNCTION, not a string: a string replacement would expand `$&`, `$1` … found in the data.
    const html = fs.readFileSync(TEMPLATE, "utf8").replace("/*__DATA__*/null", function () { return json; });
    const out = nodePath.join(runDir, view === "debug" ? "debug.html" : "index.html");
    fs.writeFileSync(out, html);
    return out;
}

function newestRunDir(root) {
    if (!fs.existsSync(root)) return null;
    const dirs = fs.readdirSync(root)
        .map(function (n) { return nodePath.join(root, n); })
        .filter(function (p) { return fs.existsSync(nodePath.join(p, "evidence.jsonl")); })
        .sort(function (a, b) { return fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs; });
    return dirs[0] || null;
}

if (require.main === module) {
    const arg = process.argv.find(function (a) { return a.indexOf("--from=") === 0; });
    const dir = arg ? nodePath.resolve(arg.slice("--from=".length)) : newestRunDir(DEFAULT_ROOT);
    if (!dir) {
        console.error("No run folder found. Pass --from=<runDir> (a folder containing evidence.jsonl).");
        process.exit(1);
    }
    const vArg = process.argv.find(function (a) { return a.indexOf("--view=") === 0; });
    let views;
    if (vArg) views = [vArg.slice("--view=".length).toLowerCase() === "debug" ? "debug" : "results"];
    else {
        let mode = null;
        try { mode = JSON.parse(fs.readFileSync(nodePath.join(dir, "run.json"), "utf8")).mode; } catch (_) { mode = null; }
        views = mode === "debug" ? ["results", "debug"] : ["results"];
    }
    views.forEach(function (v) { console.log("Assertion evidence report (" + v + "): " + build(dir, v)); });
}

module.exports = { build: build };

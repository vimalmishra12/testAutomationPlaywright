"use strict";
/**
 * Builds the assertion evidence report (ADR-025) from a run folder written by
 * core/utils/assertionEvidence.js:
 *   <runDir>/run.json          run metadata (exec file, env, appType, start / end)
 *   <runDir>/evidence.jsonl    one JSON record per test (checks, linked elements, boxes)
 *   <runDir>/shots/NNNN.png    end-of-test screenshot per test
 * → <runDir>/index.html        one self-contained file (screenshots embedded).
 *
 * Runs automatically at the end of a run with --assertReport=true. Also runnable by hand,
 * e.g. after a crashed run (every finished test is already on disk):
 *   node core/utils/assertion-report/buildAssertionReport.js [--from=<runDir>]
 * With no --from it takes the newest folder under output/reports/TestReports/assertionReport.
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

/** Builds index.html in runDir and returns its path. */
function build(runDir) {
    let meta = {};
    try { meta = JSON.parse(fs.readFileSync(nodePath.join(runDir, "run.json"), "utf8")); } catch (_) { meta = {}; }
    const tests = readRecords(runDir);
    tests.forEach(function (t) {
        if (!t.shot || !t.shot.path) return;
        const p = nodePath.join(runDir, t.shot.path);
        try { t.shot.src = "data:image/png;base64," + fs.readFileSync(p).toString("base64"); } catch (_) { t.shot.src = null; }
    });
    // Escape so no recorded string (a message, a page text) can close the <script> block.
    const json = JSON.stringify({ meta: meta, tests: tests })
        .replace(/</g, "\\u003c").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
    // A replacer FUNCTION, not a string: a string replacement would expand `$&`, `$1` … found in the data.
    const html = fs.readFileSync(TEMPLATE, "utf8").replace("/*__DATA__*/null", function () { return json; });
    const out = nodePath.join(runDir, "index.html");
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
    console.log("Assertion evidence report: " + build(dir));
}

module.exports = { build: build };

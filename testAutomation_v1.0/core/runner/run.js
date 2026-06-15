"use strict";

/**
 * Mocha entry point for the Playwright-as-library framework (Prompt 4 / Phase 1).
 *
 * Replaces the WDIO launcher. Flow:
 *   1. require env.conf.js → parses argv (yargs) and sets all framework globals
 *      (appUrl, testExecDir, selectorDir, moduleOff, assertion, jsonParserUtil,
 *      path, capabilities, resolution …). Exits if --appType/--testEnv/--testExecFile
 *      are missing (same contract as before).
 *   2. specGenerator writes the per-execution-file tempRunner specs (unchanged) —
 *      each is the full testrunner.js source + `new specRunner("<file>.json")`.
 *   3. A standalone Mocha instance runs those specs with the Playwright root hooks
 *      (playwright.setup.js) supplying the browser + globals.
 *
 * argv flows through process.argv to yargs (used by env.conf.js and specGenerator),
 * so there is NO collision with Mocha's own CLI parser — exactly why we use a Node
 * entry instead of invoking the `mocha` binary with custom flags.
 *
 * CLI: node core/runner/run.js --appType=ExperienceApp --testEnv=thor
 *      --testExecFile=<file>.json --browserCapability=desktop-chrome-1920 [--trace=true]
 * Env: PWHEADLESS=1 → headless;  ALLURE=1 → allure-mocha reporter.
 */

const path = require("path");
const fs = require("fs");

// 1) Resolve env + globals (must run BEFORE anything reads global.appUrl etc.).
require(path.join(process.cwd(), "env.conf.js"));

// Cloud execution (decision D7 / Phase 3). LambdaTest IS supported via the Playwright
// grid (chromium.connect in playwright.setup.js). Other remote services (BrowserStack /
// Appium) are not yet ported — fail fast with a clear message rather than silently
// launching a local browser for an unsupported cloud capability profile.
(function guardCloudCapability() {
    const capName = global.argv && global.argv.browserCapability;
    const cap = capName && global.capabilitiesFile && global.capabilitiesFile[capName];
    const service = cap && cap.webDriverService;
    const SUPPORTED = ["chromedriver", "lambdatest"];
    if (service && !SUPPORTED.includes(service)) {
        console.error(
            `\nERROR!!! Capability "${capName}" uses webDriverService="${service}" (cloud/remote).\n` +
            `Only local (chromedriver) and LambdaTest are supported under Playwright so far.\n` +
            `BrowserStack/Appium are not yet ported. Use --browserCapability=desktop-chrome-1920\n` +
            `(local) or --browserCapability=lambdatest-chrome-1920 (cloud).\n`
        );
        process.exit(1);
    }
})();

const Mocha = require("mocha");
const specGen = require(path.join(process.cwd(), "core/runner/specGenerator.js"));
const { mochaHooks } = require(path.join(process.cwd(), "core/runner/playwright.setup.js"));

(async () => {
    // 2) Generate the tempRunner spec(s) for the requested execution file(s).
    await specGen.fileArrayGenerator();

    const tempDir = path.join(process.cwd(), "test", "tempRunner");
    const specFiles = fs.existsSync(tempDir)
        ? fs.readdirSync(tempDir).filter((f) => f.endsWith(".js")).map((f) => path.join(tempDir, f))
        : [];

    if (specFiles.length === 0) {
        console.error("ERROR!!! No tempRunner specs generated for testExecFile=" + (global.argv && global.argv.testExecFile));
        process.exit(1);
    }

    // Reporter selection (decision D6). Works two ways so it is shell-agnostic
    // (PowerShell / CMD / bash all behave the same):
    //   CLI flag : npm run poc:thor -- --report=mochawesome | allure | spec
    //   Env var  : MOCHAWESOME=1 / ALLURE=1  (bash-style)
    // The CLI flag wins when both are present.
    //
    // [2026-06-15] DEFAULT is now mochawesome (HTML report + inline base64 screenshots),
    // so every `npm run <feature>` produces a report with no extra flags. Opt out with
    // `--report=spec` (or SPEC=1) for the plain console reporter, or `--report=allure`.
    const reportFlag = String((global.argv && global.argv.report) || "").toLowerCase();
    const wantSpec = reportFlag === "spec" || process.env.SPEC === "1";
    const wantAllure = reportFlag === "allure" || process.env.ALLURE === "1";
    // Mochawesome unless the user explicitly asked for spec/allure.
    const wantMochawesome =
        reportFlag === "mochawesome" ||
        process.env.MOCHAWESOME === "1" ||
        (!wantSpec && !wantAllure);

    let reporter = "spec";
    let reporterOptions = {};
    if (wantMochawesome) {
        reporter = "mochawesome";
        reporterOptions = {
            reportDir: "mochawesome-report",
            reportFilename: "report",
            html: true,
            json: true,
            overwrite: true,
            quiet: false,
            // Hide the (large, engine-level) test source code so each test shows
            // just its result + the attached screenshot — clean Timeline-style view.
            code: false
        };
    } else if (wantAllure) {
        reporter = "allure-mocha";
        reporterOptions = { resultsDir: "allure-results" };
    }
    const mocha = new Mocha({
        timeout: 120000,
        reporter: reporter,
        reporterOptions: reporterOptions,
        rootHooks: mochaHooks
    });

    specFiles.forEach((f) => mocha.addFile(f));

    // Visual (novus/pixelmatch) timeline report. WDIO drove this via the TimelineService
    // onPrepare/onComplete service hooks; under standalone Mocha we invoke them here.
    // onPrepare starts the changelog watcher; onComplete builds the index.html from the
    // per-suite *-visualReport-*.log files written by visualTest.setVisualReportData.
    let timelineSvc = null;
    if (String(global.argv && global.argv.visual).toLowerCase() === "novus") {
        try {
            const { TimelineService } = require(process.cwd() + "/core/utils/visual-report-utility/report-service");
            timelineSvc = new TimelineService();
            timelineSvc.onPrepare();
        } catch (e) {
            console.log("[visual] timeline onPrepare failed:", e.message);
            timelineSvc = null;
        }
    }

    const buildVisualReport = async () => {
        if (!timelineSvc) return;
        try {
            const fs = require("fs");
            const visualDir = path.join(process.cwd(), global.reportOutputDir, "visual");
            // Rebuild the changelog from disk so the report is robust to fs.watch races.
            const logs = fs.readdirSync(visualDir).filter((f) => f.includes("visualReport"));
            fs.writeFileSync(path.join(visualDir, "changelog.txt"), logs.join("\n") + "\n");
            await timelineSvc.onComplete();
        } catch (e) {
            console.log("[visual] timeline report build failed:", e.message);
        }
    };

    // 3) Load files, then cross a macrotask boundary so the testrunner's
    //    `await jsonParser(...)`-deferred describe() calls flush before run().
    await mocha.loadFilesAsync();
    await new Promise((resolve) => setImmediate(resolve));

    const runner = mocha.run((failures) => {
        try { specGen.removingTempSpecs(); } catch (_) { /* best-effort cleanup */ }
        buildVisualReport().finally(() => process.exit(failures ? 1 : 0));
    });

    // Compact end-of-run summary (handy when the allure reporter is active).
    runner.on("end", () => {
        const s = runner.stats || {};
        console.log(`\n[run] suites=${s.suites} tests=${s.tests} passes=${s.passes} failures=${s.failures} pending=${s.pending} (${s.duration}ms)`);
    });
})().catch((err) => {
    console.error("ERROR!!! run.js failed:", err && err.stack ? err.stack : err);
    try { specGen.removingTempSpecs(); } catch (_) { /* ignore */ }
    process.exit(1);
});

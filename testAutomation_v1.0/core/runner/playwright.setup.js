"use strict";

/**
 * Playwright root-hook setup for standalone Mocha — Prompt 4 / Phase 1.
 *
 * Owns the browser lifecycle and publishes ALL driver globals (decision D3):
 *   global.browser  — the Playwright Browser (ONE per run, decision D4)
 *   global.__pwContext  — the current BrowserContext (NEW per suite, decision D4)
 *   global.page     — the current Page
 *   global.$        — sel => page.locator(sel)       (compat shim)
 *   global.$$       — sel => page.locator(sel)       (.all() at call sites)
 *
 * The remaining framework globals (logger, stackTrace, assertion, jsonParserUtil,
 * argv, appUrl, selectorDir, testExecDir, moduleOff, path, capabilities,
 * resolution …) are set by env.conf.js, which run.js requires BEFORE these hooks
 * execute. This file does not duplicate them.
 *
 * Helpers exposed on global for testrunner.js (context-per-suite + tracing):
 *   global.createFreshContext()      — close old context, open a new one + page,
 *                                       reset page/$/$$, start tracing if --trace
 *   global.stopAndSaveTrace(name)    — stop tracing on the current context and
 *                                       save ./traces/<name>.zip (decision D6)
 *
 * NOTE: this file should be ADDED to the protected-file list in AGENTS.md and
 * system.md (it now owns browser lifecycle + globals — the role wdio.conf.js had).
 * Wording presented for confirmation in the session walkthrough.
 */

const { chromium } = require("playwright");
const fs = require("fs");
const nodePath = require("path");

// mochawesome screenshot attachment (Timeline-style report). Loaded lazily so the
// framework does not hard-depend on mochawesome when other reporters are used.
let mochaAddContext = null;
try { mochaAddContext = require("mochawesome/addContext"); } catch (_) { /* optional */ }
// Attach screenshots when the mochawesome report is active. As of 2026-06-15 mochawesome
// is the DEFAULT reporter (see run.js), so screenshots attach unless the user explicitly
// opted into the spec or allure reporter. Keep this gate in sync with run.js's selection.
// global.argv is set by env.conf.js, which run.js requires before this file.
const _reportFlag = String((global.argv && global.argv.report) || "").toLowerCase();
const _wantSpec = _reportFlag === "spec" || process.env.SPEC === "1";
const _wantAllure = _reportFlag === "allure" || process.env.ALLURE === "1";
const SHOTS_ENABLED =
    _reportFlag === "mochawesome" ||
    process.env.MOCHAWESOME === "1" ||
    (!_wantSpec && !_wantAllure);

// Headed by default (decision D4 / POC). Force headless via either the CLI flag
// (--headless=true) or the env var (PWHEADLESS=1) — shell-agnostic.
const HEADLESS =
    process.env.PWHEADLESS === "1" ||
    String(global.argv && global.argv.headless).toLowerCase() === "true";

// Browser channel resolution.
//   Playwright's BUNDLED Chromium fails to launch HEADED on some Windows hosts
//   ("browserType.launch: spawn UNKNOWN") while the installed Google Chrome
//   launches fine. So headed runs default to the system Chrome channel; headless
//   runs use the bundled Chromium (reproducible, no system dependency).
//   Override anytime with PWCHANNEL (e.g. PWCHANNEL=msedge, or PWCHANNEL= to force
//   bundled Chromium).
function resolveChannel() {
    if (process.env.PWCHANNEL !== undefined) {
        return process.env.PWCHANNEL || undefined; // empty string → bundled Chromium
    }
    return HEADLESS ? undefined : "chrome"; // headed → system Chrome by default
}

const TRACES_DIR = nodePath.join(process.cwd(), "traces");

// ---------------------------------------------------------------------------
// LambdaTest cloud execution (Phase 3 / decision D7).
//   Playwright-as-a-library does NOT use the Selenium /wd/hub endpoint WDIO used.
//   It connects to LambdaTest's PLAYWRIGHT grid over a websocket:
//     wss://cdp.lambdatest.com/playwright?capabilities=<url-encoded JSON>
//   where the JSON carries browserName/browserVersion + an LT:Options block with
//   the user / accessKey / platform / build / name. We derive that from the active
//   capability profile (capabilities.json) and the credentials wired by env.conf.js.
// ---------------------------------------------------------------------------
let playwrightClientVersion;
try { playwrightClientVersion = require("playwright/package.json").version; } catch (_) { /* optional */ }

function activeCapability() {
    const name = global.argv && global.argv.browserCapability;
    return (name && global.capabilitiesFile && global.capabilitiesFile[name]) || null;
}

function isLambdaTest() {
    const cap = activeCapability();
    return !!(cap && cap.webDriverService === "lambdatest");
}

function lambdaTestWsEndpoint() {
    const cap = activeCapability();
    const profileCap = (cap && cap.capabilities && cap.capabilities[0]) || {};
    const ltProfile = profileCap["LT:Options"] || {};
    const user = process.env.LT_USERNAME;
    const accessKey = process.env.LT_ACCESS_KEY;
    if (!user || !accessKey) {
        throw new Error(
            "LambdaTest credentials missing — set LT_USERNAME and LT_ACCESS_KEY " +
            "(env vars, or env.json -> lambdaTestCredentials) before running a lambdatest capability."
        );
    }
    // Selenium profiles use `platformName`; the Playwright grid expects `platform`.
    // `name` is the LambdaTest dashboard session name. To mirror WDIO's per-suite sessions
    // we set a per-suite name (global.__ltSessionName), set by the runner before each suite's
    // session is opened; falls back to the exec-file name.
    const ltOptions = Object.assign({}, ltProfile, {
        user,
        accessKey,
        platform: ltProfile.platform || ltProfile.platformName || "Windows 10",
        name: global.__ltSessionName || ltProfile.name || ((global.argv && global.argv.testExecFile) || "C1 Playwright test"),
    });
    delete ltOptions.platformName;
    if (playwrightClientVersion) ltOptions.playwrightClientVersion = playwrightClientVersion;

    const capabilities = {
        browserName: profileCap.browserName || "Chrome",
        browserVersion: profileCap.browserVersion || "latest",
        "LT:Options": ltOptions,
    };
    return (
        "wss://cdp.lambdatest.com/playwright?capabilities=" +
        encodeURIComponent(JSON.stringify(capabilities))
    );
}

// Derive the FIXED viewport from the resolved capability (env.conf.js parses
// capabilities.json "1920x1080" into global.resolution). Falls back to 1920x1080.
function resolveViewport() {
    const w = parseInt(global.resolution && global.resolution.width, 10);
    const h = parseInt(global.resolution && global.resolution.height, 10);
    if (Number.isFinite(w) && Number.isFinite(h)) return { width: w, height: h };
    return { width: 1920, height: 1080 };
}

// Headed runs MAXIMIZE the real window and use viewport:null so the page lays out
// at the ACTUAL window size — otherwise Playwright forces a 1920×1080 page viewport
// into a smaller (~1554×882) window, squashing the layout and throwing off click
// targets (this is what broke the logout dropdown). Headless keeps the fixed
// viewport for deterministic CI / visual baselines. Override with PWVIEWPORT=WxH.
const MAXIMIZE_HEADED = !HEADLESS && process.env.PWVIEWPORT === undefined;

function launchArgs() {
    const args = [
        // LTI 1.3 OIDC flows set cross-site cookies during the redirect chain.
        // Without this flag Chrome blocks those cookies (SameSite=Lax by default),
        // causing lti-onboarding to loop indefinitely before landing on lti-error.
        // Applied globally (not just BB) — impact is minimal for non-LTI suites
        // running against internal test environments.
        "--disable-features=SameSiteByDefaultCookies,CookiesWithoutSameSiteMustBeSecure",
    ];
    if (MAXIMIZE_HEADED) args.push("--start-maximized");
    return args;
}

// Context viewport: explicit PWVIEWPORT wins; else null (real window) when headed
// & maximized; else the fixed capability viewport (headless).
function contextViewport() {
    if (process.env.PWVIEWPORT) {
        const [w, h] = process.env.PWVIEWPORT.split("x").map((n) => parseInt(n, 10));
        if (Number.isFinite(w) && Number.isFinite(h)) return { width: w, height: h };
    }
    if (isLambdaTest()) return resolveViewport(); // remote browser — use the fixed capability viewport
    if (MAXIMIZE_HEADED) return null; // page fills the maximized window — no distortion
    return resolveViewport();
}

// True when the --trace=true CLI flag was passed (decision D6).
function tracingEnabled() {
    return String(global.argv && global.argv.trace) === "true";
}

/**
 * Closes any existing context (stopping a running trace first) and opens a fresh
 * context + page, republishing global.page/$/$$. Starts a new trace if --trace.
 * Called by playwright.setup beforeAll (first suite) and by testrunner.js before
 * each subsequent suite (decision D4 — context-per-suite replaces reloadSession).
 */
global.createFreshContext = async function createFreshContext() {
    if (global.__pwContext) {
        if (global.__tracingActive) {
            // A trace was left open (no explicit stop) — discard it to avoid leaks.
            await global.__pwContext.tracing.stop().catch(() => {});
            global.__tracingActive = false;
        }
        await global.__pwContext.close().catch(() => {});
    }
    // Cloudflare Access headers for qa/rel come from env.json → normalised into
    // global.headers by env.conf.js (empty {} for thor).
    // [2026-06-23] Confirmed by user. Previously these were applied as context-level
    // extraHTTPHeaders, which attaches them to EVERY request — including cross-origin
    // calls the Gigya login widget makes (cdns.eu1.gigya.com/sdk.config.get, OneTrust,
    // New Relic). Those third parties reject the custom cf-access-* headers in CORS
    // preflight, so the Gigya screen-set fails to initialise and the login box never
    // paints (verified via live QA DOM probe). Fix: inject the CF Access headers ONLY
    // for first-party requests (same host as appUrl) via a context route handler;
    // third-party requests pass through untouched.
    const contextOpts = { viewport: contextViewport() };
    global.__pwContext = await global.browser.newContext(contextOpts);
    if (global.headers && Object.keys(global.headers).length) {
        // Host of the application under test — CF Access only guards this origin.
        let firstPartyHost = "";
        try { firstPartyHost = new URL(global.appUrl).host; } catch (e) { firstPartyHost = ""; }
        await global.__pwContext.route("**/*", (route) => {
            let reqHost = "";
            try { reqHost = new URL(route.request().url()).host; } catch (e) { reqHost = ""; }
            // Match the exact app host (and its subdomains) so Cloudflare Access is
            // satisfied on first-party calls without leaking the headers cross-origin.
            const isFirstParty = firstPartyHost &&
                (reqHost === firstPartyHost || reqHost.endsWith("." + firstPartyHost));
            if (isFirstParty) {
                route.continue({ headers: { ...route.request().headers(), ...global.headers } });
            } else {
                route.continue();
            }
        });
    }
    global.page = await global.__pwContext.newPage();
    // Slow / collaborative apps (e.g. Builder) can exceed Playwright's 30s default navigation
    // timeout on "load". Raise it at the context level so EVERY goto/reload — including direct
    // page.reload() calls in page objects — gets the longer budget, not just browser.url/refresh.
    global.__pwContext.setDefaultNavigationTimeout(90000);
    // Reset iframe scope for the new suite (Category C — see baseActionLibrary root()).
    global.__activeFrame = null;
    // Compatibility shim (decision D3).
    global.$ = (sel) => global.page.locator(sel);
    global.$$ = (sel) => global.page.locator(sel);

    if (tracingEnabled()) {
        await global.__pwContext.tracing.start({ screenshots: true, snapshots: true, sources: true });
        global.__tracingActive = true;
    }
    return global.page;
};

/**
 * LambdaTest: report the CURRENT session's pass/fail to the dashboard. LambdaTest only
 * learns a Playwright test's status via the documented "lambdatest_action" magic command
 * run through page.evaluate. Status comes from global.__ltSuiteFailed (set by afterEach).
 * Best-effort — never throws into the run.
 */
global.lambdaTestReportStatus = async function lambdaTestReportStatus() {
    if (!global.__isCloud || !global.page) return;
    const status = global.__ltSuiteFailed ? "failed" : "passed";
    try {
        await global.page.evaluate(
            () => {},
            "lambdatest_action: " + JSON.stringify({
                action: "setTestStatus",
                arguments: { status: status, remark: global.__ltSessionName || "" }
            })
        );
    } catch (_) { /* best-effort */ }
};

/**
 * LambdaTest: rotate to a NEW per-suite session — mirrors WDIO's reloadSession(), so each
 * suite is its own dashboard session with its own name + pass/fail. Reports the previous
 * session's status, closes it (ending the LT session), then connects a fresh named session.
 */
global.lambdaTestRotateSession = async function lambdaTestRotateSession(sessionName) {
    await global.lambdaTestReportStatus();
    if (global.__pwContext) await global.__pwContext.close().catch(() => {});
    if (global.browser) await global.browser.close().catch(() => {}); // ends the LT session
    global.__ltSessionName = sessionName;
    global.__ltSuiteFailed = false;
    global.browser = await chromium.connect(lambdaTestWsEndpoint());
    attachBrowserCompat();
    await global.createFreshContext();
    console.log(`[pw-setup] LambdaTest session rotated → "${sessionName}".`);
};

/**
 * Stops the current trace and writes ./traces/<name>.zip. Safe no-op if tracing
 * is not active. Called by testrunner.js in each suite's `after` hook.
 */
global.stopAndSaveTrace = async function stopAndSaveTrace(name) {
    if (!global.__tracingActive || !global.__pwContext) return;
    try {
        if (!fs.existsSync(TRACES_DIR)) fs.mkdirSync(TRACES_DIR, { recursive: true });
        const safe = String(name).replace(/[^\w.-]+/g, "_");
        const file = nodePath.join(TRACES_DIR, `${safe}.zip`);
        await global.__pwContext.tracing.stop({ path: file });
        global.__tracingActive = false;
        console.log(`[pw-setup] Trace saved: ${file}  (view: npx playwright show-trace "${file}")`);
    } catch (err) {
        console.log("[pw-setup] Failed to save trace:", err.message);
        global.__tracingActive = false;
    }
};

/**
 * Attaches WDIO-style convenience methods onto the Playwright Browser global so the
 * many Page Objects / Test Cases that call `browser.*` directly keep working with
 * minimal edits (decision D3 compatibility shim). The architecture explicitly allows
 * `browser.pause` in Test Cases for timing, so that one is essential; the rest cover
 * the common direct-`browser` call sites. Each delegates to the CURRENT global.page,
 * so they stay correct across per-suite context swaps (D4). Real Playwright Browser
 * methods (newContext/close/version) are left untouched.
 */
function attachBrowserCompat() {
    const b = global.browser;
    // Navigation timeout: slow / collaborative apps (e.g. Builder) can take well over Playwright's
    // 30s default to finish "load". Use a generous 90s so a slow page load doesn't fail navigation.
    const NAV_TIMEOUT = 90000;
    b.pause = async (ms) => global.page.waitForTimeout(ms);
    b.url = async (u) => global.page.goto(u.startsWith("/") ? new URL(appUrl).origin + u : u, { waitUntil: "load", timeout: NAV_TIMEOUT });
    b.getUrl = async () => global.page.url();
    b.getTitle = async () => global.page.title();
    b.refresh = async () => global.page.reload({ waitUntil: "load", timeout: NAV_TIMEOUT });
    b.keys = async (k) => global.page.keyboard.press(Array.isArray(k) ? k.join("") : String(k));
    b.execute = async (fn, ...args) => global.page.evaluate(fn, ...args);
    b.executeAsync = async (fn, ...args) => global.page.evaluate(fn, ...args);
    b.getWindowSize = async () => global.page.viewportSize() || { width: 0, height: 0 };
    b.setWindowSize = async () => true; // no-op: headed maximizes, headless uses fixed viewport
    b.maximizeWindow = async () => true; // no-op: handled at launch/context level
    // WDIO browser.waitUntil(condFn, {timeout, interval, timeoutMsg}) — poll a condition.
    b.waitUntil = async (condFn, opts = {}) => {
        const timeout = opts.timeout || 5000;
        const interval = opts.interval || 100;
        const deadline = Date.now() + timeout;
        // eslint-disable-next-line no-constant-condition
        while (true) {
            let ok = false;
            try { ok = await condFn(); } catch (_) { ok = false; }
            if (ok) return ok;
            if (Date.now() > deadline) throw new Error(opts.timeoutMsg || "waitUntil timed out");
            await global.page.waitForTimeout(interval);
        }
    };
}

exports.mochaHooks = {
    /**
     * Runs once before any suite. Launches ONE Chromium and opens the first
     * context + page (used by suite 0). Later suites get fresh contexts via
     * testrunner.js → global.createFreshContext().
     */
    beforeAll: async function () {
        this.timeout(120000);
        if (isLambdaTest()) {
            // Phase 3 / D7 — connect to the LambdaTest Playwright grid instead of
            // launching a local browser. channel/headless/args do not apply remotely.
            this.timeout(180000); // cloud connect + session spin-up is slower
            global.__isCloud = true;
            // Name suite 0's session (the runner publishes per-suite names in __suiteNames);
            // later suites rotate to their own session via global.lambdaTestRotateSession().
            global.__ltSessionName = (global.__suiteNames && global.__suiteNames[0]) ||
                ((global.argv && global.argv.testExecFile) || "C1 Playwright test");
            global.__ltSuiteFailed = false;
            global.browser = await chromium.connect(lambdaTestWsEndpoint());
            attachBrowserCompat();
            await global.createFreshContext();
            console.log(`[pw-setup] Connected to LambdaTest session "${global.__ltSessionName}" (capability=${global.argv && global.argv.browserCapability}).`);
            return;
        }
        const channel = resolveChannel();
        const launchOpts = { headless: HEADLESS, args: launchArgs() };
        if (channel) launchOpts.channel = channel; // system Chrome for headed; bundled for headless
        global.browser = await chromium.launch(launchOpts);
        attachBrowserCompat(); // WDIO-style browser.* shim (browser.pause etc.) — D3
        await global.createFreshContext();
        console.log(`[pw-setup] Browser launched (headless=${HEADLESS}, channel=${channel || "bundled-chromium"}); globals browser/context/page/$/$$ set.`);
    },

    /**
     * Before EACH test: reset the iframe scope to the main frame (Category C). Without
     * this, a test that calls switchToFrame() and fails BEFORE switchToParentFrame()
     * would leave global.__activeFrame set, and every following test in the suite would
     * wrongly target the stale iframe — cascading the whole suite to failure.
     */
    beforeEach: async function () {
        global.__activeFrame = null;
    },

    /**
     * After EACH test: capture a screenshot of the current page and attach it to
     * the mochawesome report (only when MOCHAWESOME=1). This gives the single-HTML,
     * screenshot-per-test experience of the retired Timeline reporter — just open
     * mochawesome-report/report.html, no commands. Best-effort: never fails a test.
     */
    afterEach: async function () {
        // LambdaTest: remember if any test in the current suite failed, so the suite's
        // session is reported as "failed" when it closes (set via lambdaTestReportStatus).
        if (global.__isCloud && this.currentTest && this.currentTest.state === "failed") {
            global.__ltSuiteFailed = true;
        }
        if (!SHOTS_ENABLED || !mochaAddContext || !global.page) return;
        try {
            // Capture as a base64 data URI and embed it INLINE in the report. This
            // avoids any relative-path resolution problem — the image lives inside
            // report.html itself, so it shows no matter where the file is opened.
            const buf = await global.page.screenshot({ fullPage: false });
            const dataUri = "data:image/png;base64," + buf.toString("base64");
            mochaAddContext(this, { title: "Screenshot (end of test)", value: dataUri });
        } catch (err) {
            console.log("[pw-setup] screenshot attach skipped:", err.message);
        }
    },

    /**
     * Runs once after all suites. Stops any open trace, then closes context →
     * browser so no Chromium process is orphaned.
     */
    afterAll: async function () {
        this.timeout(90000); // extended for tracing.stop() on slow CI
        if (global.__tracingActive && global.__pwContext) {
            await global.__pwContext.tracing.stop().catch(() => {});
            global.__tracingActive = false;
        }
        // LambdaTest: report the LAST suite's pass/fail before closing its session.
        if (global.__isCloud) await global.lambdaTestReportStatus();
        if (global.__pwContext) await global.__pwContext.close().catch(() => {});
        if (global.browser) await global.browser.close().catch(() => {});
        console.log("[pw-setup] Browser torn down.");
    }
};

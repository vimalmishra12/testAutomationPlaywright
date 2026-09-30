"use strict";

/**
 * Page object for the Cambridge One Electron Desktop APP LIFECYCLE — the
 * "close the app and reopen it, the login session must still be there" journey.
 *
 * It complements electronLogin.page.js (first login) and electronDashboard.page.js
 * (walkthrough / logout) and deliberately reuses BOTH untouched — the login POC is not
 * modified. It drives the same launch/attach mechanism the framework itself uses in
 * core/runner/playwright.setup.js (spawn the installed exe with --remote-debugging-port,
 * then chromium.connectOverCDP), but from the TEST side, so a real user can quit and
 * relaunch the installed app in the middle of a suite.
 *
 * BLACK-BOX RULE (.architecture/PLAN_cambridge-desktop-playwright-migration): the test only
 * observes visible renderer DOM. It never reads tokens / cookies / local storage / command
 * lines. "Session retained" is the app's OWN on-disk behaviour — this file only proves, from
 * the UI, that after a relaunch the user is NOT asked to log in again.
 */

const { chromium } = require("playwright");
const { spawn, execSync } = require("child_process");
const nodePath = require("path");
const os = require("os");
const http = require("http");

// Reuse the login POC's selectors (read-only — electronLogin.page.js itself is not touched).
const selectorFile = jsonParserUtil.jsonParser(selectorDir);
const el = selectorFile.css.ComproC1.electronLogin;

const APP_IMAGE = "Cambridge One Desktop App.exe";

// Resolve the installed executable exactly as playwright.setup.js beforeAll does, so the
// relaunched instance is the same app the framework launched at run start.
function resolveAppPath() {
  const appConfig = (global.envData && global.envData[global.argv && global.argv.appType]) || {};
  const defaultAppPath = nodePath.join(
    process.env.LOCALAPPDATA || nodePath.join("C:\\Users", os.userInfo().username, "AppData", "Local"),
    "Programs", "CambridgeOne", APP_IMAGE
  );
  return (appConfig.electronAppPath || defaultAppPath).replace("{USERNAME}", os.userInfo().username);
}

function resolveDebugPort() {
  return parseInt(process.env.ELECTRON_DEBUG_PORT || (global.argv && global.argv.electronDebugPort) || "9222", 10);
}

// One-shot probe of the CDP endpoint. Resolves true only when /json/version answers 200.
function cdpResponds(port) {
  return new Promise((resolve) => {
    const req = http.get(`http://127.0.0.1:${port}/json/version`, (res) => {
      res.resume();
      resolve(res.statusCode === 200);
    });
    req.on("error", () => resolve(false));
    req.setTimeout(1000, () => { req.destroy(); resolve(false); });
  });
}

async function waitCdp(port, wantUp, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const up = await cdpResponds(port);
    if (up === wantUp) return true;
    await new Promise((r) => setTimeout(r, 500));
  }
  return false;
}

module.exports = {
  /**
   * Closes the Thor desktop application the way the framework tears it down: kill the PID we
   * spawned (and its tree), then by image name. Only run-owned processes are touched. Waits for
   * the debug port to be released so the relaunch cannot bind to a half-dead listener.
   */
  closeApp: async function () {
    await logger.logInto(await stackTrace.get());
    let killed = false;
    try {
      if (global.__electronProcess && global.__electronProcess.pid) {
        execSync(`taskkill /PID ${global.__electronProcess.pid} /T /F`, { stdio: "ignore" });
        killed = true;
      }
    } catch (_) { /* already gone */ }
    try {
      execSync(`taskkill /IM "${APP_IMAGE}" /T /F`, { stdio: "ignore" });
      killed = true;
    } catch (_) { /* already gone */ }

    // The OS releases the debug listener a moment after the kill; wait it out before relaunch.
    await waitCdp(resolveDebugPort(), false, 15000);
    console.log("[ELECTRON-SESSION] App closed (debug port released).");
    return killed;
  },

  /**
   * Relaunches the installed app and re-attaches Playwright over CDP.
   *
   * Deliberately does NOT replace global.browser: the WDIO-compat helpers (browser.pause /
   * browser.waitUntil) were attached to the original handle in playwright.setup.js and every
   * reused FOC page object depends on them — but they only ever delegate to global.page, which
   * we repoint below. (attachBrowserCompat is not exported; reusing the original handle avoids
   * duplicating it and changing behaviour for any other run.) global.__pwContext IS repointed so
   * the runner's per-suite createFreshContext() (Electron branch) keeps rebinding to the live
   * windows from here on.
   */
  relaunchAndReattach: async function () {
    await logger.logInto(await stackTrace.get());
    const port = resolveDebugPort();
    const exe = resolveAppPath();
    if (!require("fs").existsSync(exe)) {
      throw new Error(`[ELECTRON-SESSION] Desktop executable not found: ${exe}`);
    }

    const child = spawn(exe, [`--remote-debugging-port=${port}`, "--no-sandbox"], {
      detached: false,
      windowsHide: false
    });
    // Hand the relaunched process to core's afterAll so it is the one it reaps.
    global.__electronProcess = child;

    if (!(await waitCdp(port, true, 30000))) {
      throw new Error(`[ELECTRON-SESSION] Relaunched app CDP endpoint not ready on port ${port} after 30s`);
    }

    const b = await chromium.connectOverCDP(`http://127.0.0.1:${port}`, { isLocal: true });
    global.__electronReopenBrowser = b; // keep a ref alive; afterAll's taskkill-by-image still reaps it
    if (global.attachBrowserCompat) {
      global.attachBrowserCompat(b);
      global.browser = b;
    }
    const ctx = b.contexts()[0] || (await b.newContext());

    // Register devtools closer + new window listener on the new context
    if (global.setupElectronContext) {
      global.setupElectronContext(ctx);
    } else {
      ctx.on("page", async (newPage) => {
        if (newPage.url().startsWith("devtools://")) {
          console.log("[ELECTRON-SESSION] Automatically closing newly spawned DevTools window...");
          await newPage.close().catch(() => {});
          return;
        }
        newPage.on("framenavigated", async () => {
          if (newPage.url().startsWith("devtools://") && !newPage.isClosed()) {
            console.log("[ELECTRON-SESSION] Automatically closing navigated DevTools window...");
            await newPage.close().catch(() => {});
          }
        });
        console.log(`[ELECTRON-SESSION] Electron opened new window: ${newPage.url()}`);
        global.page = newPage;
        global.$ = (sel) => global.page.locator(sel);
        global.$$ = (sel) => global.page.locator(sel);
      });
    }

    // Actively close any DevTools window that is currently open or opens during initial startup
    for (let i = 0; i < 4; i++) {
      for (const p of ctx.pages()) {
        if (p.url().startsWith("devtools://") && !p.isClosed()) {
          console.log("[ELECTRON-SESSION] Automatically closing DevTools window...");
          await p.close().catch(() => {});
        }
      }
      await new Promise((r) => setTimeout(r, 400));
    }

    const open = ctx.pages().filter((p) => !p.isClosed() && !p.url().startsWith("devtools://"));
    global.__pwContext = ctx;
    global.page = open[open.length - 1];
    global.$ = (sel) => global.page.locator(sel);
    global.$$ = (sel) => global.page.locator(sel);
    console.log(`[ELECTRON-SESSION] Re-attached after relaunch; active window: ${global.page ? global.page.url() : "none"}`);
    return true;
  },

  /**
   * Real-user, UI-only retention check: after relaunch the app must show an authenticated
   * surface (welcome text, the header profile control, or a dashboard route) WITHOUT the
   * automation authenticating again. If instead the launch page's "Log in with web browser"
   * button is what the user is left on, the session was NOT retained.
   *
   * The launch page can flash briefly before the restored session routes to the dashboard, so
   * the login button is only treated as the verdict when it is still up near the end of the
   * budget — a transient splash must not fail a good run.
   */
  verifySessionRetained: async function () {
    await logger.logInto(await stackTrace.get());
    const TIMEOUT_MS = 90000;
    const STUCK_ON_LOGIN_MS = 20000; // login button persisting this long == genuinely logged out
    const start = Date.now();

    while (Date.now() - start < TIMEOUT_MS) {
      // Ensure any late-opening DevTools window is closed
      if (global.closeAllDevTools) {
        await global.closeAllDevTools(global.__pwContext);
      } else {
        for (const p of (global.__pwContext && global.__pwContext.pages()) || []) {
          if (p.url().startsWith("devtools://") && !p.isClosed()) {
            console.log("[ELECTRON-SESSION] Closing DevTools window during session check...");
            await p.close().catch(() => {});
          }
        }
      }

      const pages = (global.__pwContext && global.__pwContext.pages()) || [];
      const open = pages.filter((p) => !p.isClosed() && !p.url().startsWith("devtools://"));

      for (const p of open) {
        const u = p.url();
        const hasWelcome = await p.locator(el.welcome).first().isVisible().catch(() => false);
        const hasProfile = await p.locator(el.profileDropdown).first().isVisible().catch(() => false);
        const isDashboard = u.includes("dashboard") || u.includes("teacher-dashboard");
        if (hasWelcome || hasProfile || isDashboard) {
          if (p !== global.page) {
            global.page = p;
            global.$ = (sel) => global.page.locator(sel);
            global.$$ = (sel) => global.page.locator(sel);
          }
          const signal = hasWelcome ? "welcome" : hasProfile ? "profile" : "dashboard-url";
          console.log(`[ELECTRON-SESSION] Session retained — authenticated surface (${signal}) at ${u} ✅`);
          return { sessionRetained: true, signal, url: u };
        }
      }

      const stillOnLogin = open.length
        ? await open[open.length - 1].locator(el.loginBtn).first().isVisible().catch(() => false)
        : false;
      if (stillOnLogin && Date.now() - start > STUCK_ON_LOGIN_MS) {
        console.log("[ELECTRON-SESSION] Still on the login screen after reopen → session NOT retained.");
        return { sessionRetained: false, reason: "login-screen" };
      }
      await new Promise((r) => setTimeout(r, 1500));
    }

    return { sessionRetained: false, reason: "no-authenticated-surface-within-" + TIMEOUT_MS + "ms" };
  }
};

"use strict";

/**
 * Page object for Cambridge One Electron Desktop Login flow.
 * Handles:
 * 1. Clicking "Log in with web browser" in Electron
 * 2. Capturing the login URL from the launched browser process
 * 3. Completing authentication in a test-owned Playwright browser instance
 * 4. Handing off the session token back to the Electron desktop app via deep link
 * 5. Verifying the Electron app transitions to the authenticated dashboard
 */

const { chromium } = require("playwright");
const { spawn, exec } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");
const util = require("util");
const action = require("../../core/actionLibrary/baseActionLibrary.js");
const selectorFile = jsonParserUtil.jsonParser(selectorDir);

const execPromise = util.promisify(exec);

/** Local sleep. This page object drives a SECOND, test-owned browser that baseActionLibrary
 *  cannot reach (it is bound to global.page), so its waits cannot go through `action`. */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * One persistent PowerShell reader that appends every newly-started browser process's command
 * line to a file. A per-call scan cannot work here: `shell.openExternal` hands the URL to the
 * ALREADY RUNNING Chrome through a `chrome.exe --single-argument <url>` launcher that exits in
 * roughly 100 ms, and a fresh PowerShell needs 300-800 ms just to start. Measured live on
 * 2026-09-29 — the previous `Get-CimInstance | Select -ExpandProperty CommandLine` snapshot
 * approach captured nothing whenever Chrome was already open.
 */
const URL_WATCHER_PS = `
param([string]$CmdLog)
$seen = @{}
while ($true) {
  Get-CimInstance Win32_Process -Filter "Name='chrome.exe' or Name='msedge.exe'" -ErrorAction SilentlyContinue | ForEach-Object {
    if (-not $seen.ContainsKey($_.ProcessId)) {
      $seen[$_.ProcessId] = 1
      if ($_.CommandLine) { Add-Content -LiteralPath $CmdLog -Value $_.CommandLine }
    }
  }
  Start-Sleep -Milliseconds 40
}
`;

class ElectronLoginPage {
  constructor() {
    this.selectors = selectorFile.css.ComproC1.electronLogin;
  }

  extractUToken(url) {
    if (!url) return null;
    const match = url.match(/[?&]u=([^&\s#]+)/);
    return match ? match[1] : null;
  }

  /**
   * Starts the URL watcher BEFORE the Login button is clicked, because the launcher process that
   * carries the URL is gone in about 100 ms.
   * WORKAROUND — reading the URL out of a browser command line is process introspection, which
   * PLAN_cambridge-desktop-playwright-migration_2026-09-29.md §4 (:81) forbids for the final
   * design. It stays only until that plan's Phase 2 gives us a test-owned Chrome that Windows
   * hands the URL to; marked so it is removable. Nothing here kills or modifies any browser.
   */
  _startLoginUrlWatcher() {
    const dir = path.join(os.tmpdir(), "cora-electron-login");
    fs.mkdirSync(dir, { recursive: true });
    const cmdLog = path.join(dir, "browser-cmdlines.log");
    const psScript = path.join(dir, "url-watcher.ps1");
    fs.rmSync(cmdLog, { force: true });
    fs.writeFileSync(psScript, URL_WATCHER_PS);
    const proc = spawn("powershell", ["-NoProfile", "-ExecutionPolicy", "Bypass", "-File", psScript, "-CmdLog", cmdLog], {
      windowsHide: true,
      stdio: "ignore"
    });
    console.log("[ELECTRON-LOGIN] URL watcher started -> " + cmdLog);
    return { proc, cmdLog };
  }

  /** Polls the watcher's log for the login URL the desktop app just handed to the default browser. */
  async _waitForLoginUrl(watcher, { timeout = 30000 } = {}) {
    const deadline = Date.now() + timeout;
    console.log(`[ELECTRON-LOGIN] Waiting up to ${timeout}ms for the desktop app to hand a login URL to the browser...`);
    while (Date.now() < deadline) {
      if (fs.existsSync(watcher.cmdLog)) {
        for (const line of fs.readFileSync(watcher.cmdLog, "utf8").split("\n")) {
          if (!/single-argument|desktop-login|login\?u=/i.test(line)) continue;
          const m = line.match(/https?:\/\/[^\s"']+/);
          if (m && /comprodls|cambridgeone/i.test(m[0])) {
            console.log(`[ELECTRON-LOGIN] Captured login URL: ${m[0].split("?")[0]}`);
            return m[0];
          }
        }
      }
      await new Promise(r => setTimeout(r, 120));
    }
    return null;
  }

  _stopLoginUrlWatcher(watcher) {
    if (!watcher) return;
    try { watcher.proc.kill(); } catch (_) {}
    try { fs.rmSync(watcher.cmdLog, { force: true }); } catch (_) {}
  }

  triggerDeepLink(url) {
    console.log(`[ELECTRON-LOGIN] Triggering deep link to Electron: ${url}`);
    spawn("rundll32.exe", ["url.dll,FileProtocolHandler", url], {
      detached: true,
      stdio: "ignore"
    }).unref();
  }

  async confirmProtocolDialog({ maxAttempts = 4, waitBetween = 800 } = {}) {
    console.log("[ELECTRON-LOGIN] Confirming Chrome protocol dialog (UIAutomation + Keystrokes)...");
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const psCommand = `
          Add-Type -AssemblyName UIAutomationClient;
          Add-Type -AssemblyName UIAutomationTypes;
          Add-Type -AssemblyName System.Windows.Forms;
          Add-Type -AssemblyName Microsoft.VisualBasic;

          # 1. UI Automation search for 'Open Cambridge One Desktop App' dialog button
          $cond = New-Object System.Windows.Automation.PropertyCondition([System.Windows.Automation.AutomationElement]::NameProperty, "Open Cambridge One Desktop App");
          $btn = [System.Windows.Automation.AutomationElement]::RootElement.FindFirst([System.Windows.Automation.TreeScope]::Descendants, $cond);
          if (-not $btn) {
            $allBtns = [System.Windows.Automation.AutomationElement]::RootElement.FindAll(
              [System.Windows.Automation.TreeScope]::Descendants,
              (New-Object System.Windows.Automation.PropertyCondition([System.Windows.Automation.AutomationElement]::ControlTypeProperty, [System.Windows.Automation.ControlType]::Button))
            );
            foreach ($b in $allBtns) {
              if ($b.Current.Name -like '*Open Cambridge One*') {
                $btn = $b;
                break;
              }
            }
          }

          if ($btn) {
            try {
              $pattern = $btn.GetCurrentPattern([System.Windows.Automation.InvokePattern]::Pattern);
              $pattern.Invoke();
              Write-Host "UIA_CLICKED";
              exit 0;
            } catch {}
          }

          # 2. Keystroke fallback: activate Chrome and send LEFT + ENTER
          $chromes = Get-Process chrome -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowTitle -ne '' };
          if (-not $chromes) { exit 0; }
          $target = $chromes | Where-Object { $_.MainWindowTitle -like '*Cambridge One*' -or $_.MainWindowTitle -like '*Login*' } | Select-Object -First 1;
          if (-not $target) { $target = $chromes | Select-Object -First 1; }

          try {
            [Microsoft.VisualBasic.Interaction]::AppActivate($target.Id);
          } catch {}
          Start-Sleep -Milliseconds 600;

          if ($attempt -eq 1) {
            [System.Windows.Forms.SendKeys]::SendWait('{LEFT}');
          } else {
            [System.Windows.Forms.SendKeys]::SendWait('+{TAB}');
          }
          Start-Sleep -Milliseconds 300;
          [System.Windows.Forms.SendKeys]::SendWait('{ENTER}');
          Write-Host "KEYS_SENT";
        `;
        const { stdout } = await execPromise(`powershell -NoProfile -Command "${psCommand.replace(/\r?\n/g, '; ')}"`);
        console.log(`[ELECTRON-LOGIN] Dialog confirmation attempt ${attempt} complete (${(stdout || "").trim()}) ✓`);
        if (stdout && stdout.includes("UIA_CLICKED")) {
          break;
        }
        await new Promise(r => setTimeout(r, waitBetween));
      } catch (e) {
        console.log(`[ELECTRON-LOGIN] Dialog confirmation attempt ${attempt} warning:`, e.message);
      }
    }
  }

  _syncActivePage() {
    const pages = (global.__pwContext && global.__pwContext.pages()) || [];
    const openPages = pages.filter(p => !p.isClosed() && !p.url().startsWith("devtools://"));
    if (openPages.length) {
      global.page = openPages[openPages.length - 1];
      global.$ = (sel) => global.page.locator(sel);
      global.$$ = (sel) => global.page.locator(sel);
    }
    return global.page;
  }

  async login(testdata) {
    await logger.logInto(await stackTrace.get());
    console.log("[ELECTRON-LOGIN] Phase 1: Locating and clicking Login button in Electron...");

    // 1. Wait for and click Login button in Electron window (re-syncing if splash closes)
    let loginBtn = null;
    const deadline = Date.now() + 25000;
    while (Date.now() < deadline) {
      const page = this._syncActivePage();
      if (page && !page.isClosed()) {
        try {
          const btn = page.locator(this.selectors.loginBtn).first();
          if (await btn.isVisible()) {
            loginBtn = btn;
            break;
          }
        } catch (_) {}
      }
      await new Promise(r => setTimeout(r, 1000));
    }

    if (!loginBtn) {
      const page = this._syncActivePage();
      loginBtn = page.locator(this.selectors.loginBtn).first();
      await loginBtn.waitFor({ state: "visible", timeout: 10000 });
    }
    // The watcher must be running BEFORE the click: the process that carries the URL lives ~100ms.
    const watcher = this._startLoginUrlWatcher();
    await sleep(2500);
    await loginBtn.click();
    console.log("[ELECTRON-LOGIN] Login button clicked in Electron ✓");

    // 2. Capture the login URL launched by the desktop app
    console.log("[ELECTRON-LOGIN] Phase 2: Capturing login URL from launched browser...");
    let loginUrl = null;
    try {
      loginUrl = await this._waitForLoginUrl(watcher, { timeout: 30000 });
    } finally {
      this._stopLoginUrlWatcher(watcher);
    }
    if (!loginUrl) {
      throw new Error("[ELECTRON-LOGIN] Timeout: the desktop app did not hand a login URL to the browser within 30s");
    }
    // The tab the app opened in the system browser is deliberately left alone. The previous code
    // force-killed EVERY chrome/msedge process here to "keep the desktop clean" — on a shared
    // automation machine that closes the operator's own browser, and the migration plan's boundary
    // "the test only closes processes and browser profiles it created" forbids it (:82-83).

    // 3. Complete authentication in a dedicated Playwright browser instance
    console.log("[ELECTRON-LOGIN] Phase 3: Opening Playwright browser for authentication...");
    console.log("[ELECTRON-LOGIN] Testdata check:", { email: testdata && testdata.email, hasPassword: !!(testdata && testdata.password) });
    let legBrowser = null;
    try {
      const authProfileDir = path.join(process.cwd(), "scratch", "auth-chrome-profile");

      // Clean previous profile directory so every run starts 100% fresh without prior sessions
      try {
        if (fs.existsSync(authProfileDir)) {
          fs.rmSync(authProfileDir, { recursive: true, force: true });
        }
      } catch (cleanErr) {
        console.log("[ELECTRON-LOGIN] Note on cleaning auth profile dir:", cleanErr.message);
      }

      const defaultDir = path.join(authProfileDir, "Default");
      fs.mkdirSync(defaultDir, { recursive: true });

      const prefs = {
        protocol_handler: {
          allowed_origin_protocol_pairs: {
            "https://micro-nemo.comprodls.com": {
              "cambridgeone-app": true,
              "cambridgeone": true
            },
            "https://micro-nemo.comprodls.com:443": {
              "cambridgeone-app": true,
              "cambridgeone": true
            }
          }
        }
      };
      fs.writeFileSync(path.join(defaultDir, "Preferences"), JSON.stringify(prefs, null, 2));

      legBrowser = await chromium.launchPersistentContext(authProfileDir, {
        headless: false,
        channel: "chrome",
        viewport: { width: 1280, height: 800 },
        args: ["--no-sandbox", "--disable-popup-blocking"]
      });
      const pages = legBrowser.pages();
      const legPage = pages.length ? pages[0] : await legBrowser.newPage();

      console.log(`[ELECTRON-LOGIN] Navigating to: ${loginUrl}`);
      await legPage.goto(loginUrl, { waitUntil: "domcontentloaded", timeout: 30000 });

      // Dismiss cookie banner if present
      try {
        const cookieBtn = legPage.locator(this.selectors.cookieAccept).first();
        if (await cookieBtn.waitFor({ state: "visible", timeout: 5000 }).then(() => true).catch(() => false)) {
          console.log("[ELECTRON-LOGIN] Cookie banner detected, accepting...");
          await cookieBtn.click().catch(() => {});
          await legPage.waitForTimeout(500);
        }
      } catch (_) {}

      // Check if already on desktop-login page or if credentials are required
      const deepLinkBtn = legPage.locator(this.selectors.deepLinkBtn).first();
      const isOnDesktopLogin = legPage.url().includes("desktop-login") ||
        await deepLinkBtn.waitFor({ state: "visible", timeout: 6000 }).then(() => true).catch(() => false);

      if (isOnDesktopLogin) {
        console.log("[ELECTRON-LOGIN] Already on desktop-login page! Bypassing credential entry ✓");
      } else {
        // Enter credentials.
        // pressSequentially, not fill(): the Gigya form is a JS-driven widget whose own state is
        // only updated by real key events, and per Invariant 6 an input that needs a custom event
        // must be typed like a user rather than have its value set. Verified live 2026-09-29 — the
        // keystroke path authenticates, and it is what a user does.
        console.log("[ELECTRON-LOGIN] Phase 4: Submitting credentials in browser...");
        const userBox = legPage.locator(this.selectors.userName_tbox).first();
        await userBox.waitFor({ state: "visible", timeout: 25000 });
        await userBox.pressSequentially(testdata.email, { delay: 30 });

        const passBox = legPage.locator(this.selectors.password_tbox).first();
        await passBox.waitFor({ state: "visible", timeout: 15000 });
        await passBox.pressSequentially(testdata.password, { delay: 30 });

        const submitBtn = legPage.locator(this.selectors.login_btn).first();
        await submitBtn.click();
        console.log("[ELECTRON-LOGIN] Credentials submitted ✓");
      }

      // Wait for deep link CTA
      console.log("[ELECTRON-LOGIN] Phase 5: Waiting for desktop return button / deep link...");
      await deepLinkBtn.waitFor({ state: "visible", timeout: 30000 });

      // Wait until button is no longer disabled (Vue completes token generation)
      console.log("[ELECTRON-LOGIN] Waiting for deep link button to enable...");
      // The selector is passed in rather than written here — the plain-CSS deepLinkProbe variant
      // exists because this callback runs through document.querySelector, which has no
      // :has-text() engine.
      await legPage.waitForFunction(
        (probeSel) => {
          const btn = document.querySelector(probeSel);
          return btn && !btn.classList.contains('c1-btn-disabled');
        },
        this.selectors.deepLinkProbe,
        { timeout: 20000 }
      ).catch(() => console.log("[ELECTRON-LOGIN] Note: button class wait finished"));

      // Inspect if button has protocol href for direct OS invocation
      const deepLinkHref = await deepLinkBtn.getAttribute('href').catch(() => null);
      if (deepLinkHref && (deepLinkHref.startsWith("cambridgeone") || deepLinkHref.startsWith("cambridgeone-app"))) {
        console.log("[ELECTRON-LOGIN] Directly invoking protocol via OS handler:", deepLinkHref);
        await execPromise(`powershell -Command "Start-Process '${deepLinkHref}'"`).catch(() => {});
      }

      // Click deep link button to trigger browser protocol dialog
      console.log("[ELECTRON-LOGIN] Clicking 'Open Cambridge One Desktop App' button...");
      await deepLinkBtn.click({ force: true }).catch((e) => console.log("[ELECTRON-LOGIN] deepLinkBtn click note:", e.message));
      await new Promise(r => setTimeout(r, 1500));

      // Confirm native protocol prompt if dialog appeared
      await this.confirmProtocolDialog({ maxAttempts: 4, waitBetween: 800 }).catch(() => {});
      await new Promise(r => setTimeout(r, 2000));

    } catch (authErr) {
      console.error("[ELECTRON-LOGIN] Error during browser authentication:", authErr.message);
      throw authErr;
    } finally {
      if (legBrowser) {
        await legBrowser.close().catch(() => {});
        console.log("[ELECTRON-LOGIN] Authentication browser closed ✓");
      }
    }

    // 4. Verify Electron app transitions to authenticated dashboard
    console.log("[ELECTRON-LOGIN] Phase 6: Verifying authenticated UI in Electron...");
    const authDeadline = Date.now() + 90000;
    while (Date.now() < authDeadline) {
      const pages = (global.__pwContext && global.__pwContext.pages()) || [];
      const openPages = pages.filter(p => !p.isClosed() && !p.url().startsWith("devtools://"));

      for (const p of openPages) {
        const u = p.url();
        const hasWelcome = await p.locator(this.selectors.welcome).isVisible().catch(() => false);
        const hasProfile = await p.locator(this.selectors.profileDropdown).isVisible().catch(() => false);
        const hasWalkthrough = await p.locator(this.selectors.walkthroughSkipBtn).isVisible().catch(() => false);
        const isDashboard = u.includes("dashboard") || (u.includes("index.html") && !u.includes("launch-page") && !u.includes("about:blank"));

        if (hasWelcome || hasProfile || hasWalkthrough || isDashboard) {
          if (p !== global.page) {
            console.log(`[ELECTRON-LOGIN] Updating global.page to active window: ${u}`);
            global.page = p;
            global.$ = (sel) => global.page.locator(sel);
            global.$$ = (sel) => global.page.locator(sel);
          }
          let welcomeText = "Authenticated";
          if (hasWelcome) {
            welcomeText = await p.locator(this.selectors.welcome).innerText().catch(() => "Authenticated");
          }
          console.log(`[ELECTRON-LOGIN] Authenticated state detected in Electron ("${welcomeText.trim()}", url: ${u}) ✅`);
          return { isLoggedIn: true, welcomeText: welcomeText.trim() };
        }
      }
      await new Promise(r => setTimeout(r, 1500));
    }

    return { isLoggedIn: false, error: "Authenticated dashboard UI not detected in Electron after 90s" };
  }
}

module.exports = new ElectronLoginPage();

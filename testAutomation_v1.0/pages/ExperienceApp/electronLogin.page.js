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
const path = require("path");
const util = require("util");
const action = require("../../core/actionLibrary/baseActionLibrary.js");
const selectorFile = jsonParserUtil.jsonParser(selectorDir);

const execPromise = util.promisify(exec);

class ElectronLoginPage {
  constructor() {
    this.selectors = selectorFile.css.ComproC1.electronLogin;
  }

  extractUToken(url) {
    if (!url) return null;
    const match = url.match(/[?&]u=([^&\s#]+)/);
    return match ? match[1] : null;
  }

  async getChromeUrlFromProcess() {
    try {
      const psCmd = `Get-CimInstance Win32_Process | Where-Object { $_.Name -like '*chrome*' -or $_.Name -like '*msedge*' } | Select-Object -ExpandProperty CommandLine`;
      const { stdout } = await execPromise(`powershell -Command "${psCmd}"`);
      const lines = stdout.split("\n");
      const matched = lines.find(l => l.includes("desktop-login") || l.includes("login?u=") || l.includes("?u="));
      if (matched) {
        const urlMatch = matched.match(/(https?:\/\/[^\s"']+)/);
        if (urlMatch) {
          return urlMatch[1];
        }
      }
    } catch (e) {
      console.log("[ELECTRON-LOGIN] Process scan warning:", e.message);
    }
    return null;
  }

  async captureLoginUrl({ timeout = 15000 } = {}) {
    console.log("[ELECTRON-LOGIN] Polling system processes for launched login URL...");
    const deadline = Date.now() + timeout;
    while (Date.now() < deadline) {
      const url = await this.getChromeUrlFromProcess();
      if (url) {
        console.log(`[ELECTRON-LOGIN] Successfully captured login URL: ${url}`);
        return url;
      }
      await new Promise(r => setTimeout(r, 600));
    }
    throw new Error(`[ELECTRON-LOGIN] Timeout waiting for external browser launch after ${timeout}ms`);
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
    await loginBtn.click();
    console.log("[ELECTRON-LOGIN] Login button clicked in Electron ✓");

    // 2. Capture the login URL launched by the desktop app
    console.log("[ELECTRON-LOGIN] Phase 2: Capturing login URL from launched browser...");
    const loginUrl = await this.captureLoginUrl({ timeout: 20000 });

    // Optional: close the system-browser tab that was launched by the app to keep desktop clean
    try {
      await execPromise(`powershell -Command "Get-Process chrome,msedge -ErrorAction SilentlyContinue | Stop-Process -Force"`);
    } catch (_) {}

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
        const cookieBtn = legPage.locator('a[qid="cookies-2"], button:has-text("Accept")').first();
        if (await cookieBtn.waitFor({ state: "visible", timeout: 5000 }).then(() => true).catch(() => false)) {
          console.log("[ELECTRON-LOGIN] Cookie banner detected, accepting...");
          await cookieBtn.click().catch(() => {});
          await legPage.waitForTimeout(500);
        }
      } catch (_) {}

      // Check if already on desktop-login page or if credentials are required
      const deepLinkBtn = legPage.locator('a[qid="home-2"], a:has-text("Open Cambridge One Desktop App"), a:has-text("Open Cambridge One")').first();
      const isOnDesktopLogin = legPage.url().includes("desktop-login") ||
        await deepLinkBtn.waitFor({ state: "visible", timeout: 6000 }).then(() => true).catch(() => false);

      if (isOnDesktopLogin) {
        console.log("[ELECTRON-LOGIN] Already on desktop-login page! Bypassing credential entry ✓");
      } else {
        // Fill credentials
        console.log("[ELECTRON-LOGIN] Phase 4: Submitting credentials in browser...");
        const userBox = legPage.locator('input[name="username"]:visible, input[id^="gigya-loginID"]:visible').first();
        await userBox.waitFor({ state: "visible", timeout: 25000 });
        await userBox.fill(testdata.email);

        const passBox = legPage.locator('input[name="password"]:visible, input[id^="gigya-password"]:visible').first();
        await passBox.waitFor({ state: "visible", timeout: 15000 });
        await passBox.fill(testdata.password);

        const submitBtn = legPage.locator('input[value="Log in"]:visible, button:has-text("Log in"):visible').first();
        await submitBtn.click();
        console.log("[ELECTRON-LOGIN] Credentials submitted ✓");
      }

      // Wait for deep link CTA
      console.log("[ELECTRON-LOGIN] Phase 5: Waiting for desktop return button / deep link...");
      await deepLinkBtn.waitFor({ state: "visible", timeout: 30000 });

      // Wait until button is no longer disabled (Vue completes token generation)
      console.log("[ELECTRON-LOGIN] Waiting for deep link button to enable...");
      await legPage.waitForFunction(
        () => {
          const btn = document.querySelector('a[qid="home-2"], a.login-btn');
          return btn && !btn.classList.contains('c1-btn-disabled');
        },
        null,
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

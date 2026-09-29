"use strict";

/**
 * Page object for Cambridge One Electron Desktop Dashboard.
 * Interacts with post-login elements (walkthrough, profile dropdown, logout) inside the Electron window.
 */

const action = require("../../core/actionLibrary/baseActionLibrary.js");
const selectorFile = jsonParserUtil.jsonParser(selectorDir);

module.exports = {
  walkthroughSkipBtn: selectorFile.css.ComproC1.electronLogin.walkthroughSkipBtn,
  profileDropdown: selectorFile.css.ComproC1.electronLogin.profileDropdown,
  logoutBtn: selectorFile.css.ComproC1.electronLogin.logoutBtn,
  confirmLogoutBtn: selectorFile.css.ComproC1.electronLogin.confirmLogoutBtn,
  loginBtn: selectorFile.css.ComproC1.electronLogin.loginBtn,

  _syncActivePage: function () {
    const pages = (global.__pwContext && global.__pwContext.pages()) || [];
    const openPages = pages.filter(p => !p.isClosed() && !p.url().startsWith("devtools://"));
    if (openPages.length) {
      global.page = openPages[openPages.length - 1];
      global.$ = (sel) => global.page.locator(sel);
      global.$$ = (sel) => global.page.locator(sel);
    }
  },

  closeWalkthrough: async function () {
    await logger.logInto(await stackTrace.get());
    this._syncActivePage();
    let res = false;
    try {
      const skipBtnSelector = this.walkthroughSkipBtn;
      if (await action.waitForDisplayed(skipBtnSelector, 5000)) {
        console.log("[ELECTRON] Walkthrough skip button visible. Clicking to close...");
        res = await action.click(skipBtnSelector);
        console.log("[ELECTRON] Walkthrough skip button clicked successfully ✅");
        await new Promise(r => setTimeout(r, 1000));
      } else {
        console.log("[ELECTRON] Walkthrough skip button not visible (already dismissed).");
        res = true;
      }
    } catch (e) {
      console.log("[ELECTRON] Walkthrough skip button check: ", e.message);
      res = true;
    }
    return res;
  },

  logoutUser: async function () {
    await logger.logInto(await stackTrace.get());
    this._syncActivePage();
    
    // 1. Click Profile Dropdown
    console.log("[ELECTRON] Clicking profile dropdown...");
    const profileDropdown = global.page.locator(this.profileDropdown).first();
    await profileDropdown.waitFor({ state: "visible", timeout: 15000 });
    await profileDropdown.click();
    await new Promise(r => setTimeout(r, 1000));
    
    // 2. Click Logout Button in Dropdown
    console.log("[ELECTRON] Clicking logout option...");
    const logoutBtn = global.page.locator(this.logoutBtn).first();
    await logoutBtn.waitFor({ state: "visible", timeout: 15000 });
    await logoutBtn.click();
    await new Promise(r => setTimeout(r, 1000));
    
    // 3. Click Confirm Logout button in modal if present
    console.log("[ELECTRON] Checking confirm logout modal...");
    const confirmBtn = global.page.locator("button#logout-modal-btn, #logout-modal-btn, button:has-text('Yes, log out')").first();
    try {
      await confirmBtn.waitFor({ state: "visible", timeout: 10000 });
      console.log("[ELECTRON] Confirm logout modal button found. Clicking 'Yes, log out'...");
      await confirmBtn.click();
      console.log("[ELECTRON] Confirm logout modal clicked ✓");
    } catch (e) {
      console.log("[ELECTRON] Note on confirm logout modal:", e.message);
    }
    
    // 4. Verify logout completed by checking if loginBtn is displayed or url returns to launch page
    console.log("[ELECTRON] Verifying return to login/launch page...");
    let isLoggedOut = false;
    const deadline = Date.now() + 30000;
    while (Date.now() < deadline) {
      this._syncActivePage();
      const loginBtn = global.page ? global.page.locator(this.loginBtn).first() : null;
      const hasLoginBtn = loginBtn ? await loginBtn.isVisible().catch(() => false) : false;
      const url = global.page ? global.page.url() : "";
      if (hasLoginBtn || url.includes("launch-page") || (url.includes("index.html") && !url.includes("dashboard"))) {
        isLoggedOut = true;
        break;
      }
      await new Promise(r => setTimeout(r, 1000));
    }
    console.log("[ELECTRON] Logout status (is logged out?):", isLoggedOut);
    return isLoggedOut;
  }
};

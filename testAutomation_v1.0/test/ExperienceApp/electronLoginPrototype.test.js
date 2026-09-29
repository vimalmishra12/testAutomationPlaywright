"use strict";

/**
 * Test case definition for Electron Login Prototype.
 */

const electronLoginPage = require("../../pages/ExperienceApp/electronLogin.page.js");

module.exports = {
  PROTO_ELEC_LOGIN: async function (testdata) {
    console.log("════════════════════════════════════════════════════");
    console.log("  START: Electron Login Prototype");
    console.log("  Using test data email:", testdata && testdata.email);
    console.log("════════════════════════════════════════════════════");

    // Re-sync active open Electron window
    const activePage = electronLoginPage._syncActivePage();
    const currentUrl = activePage ? activePage.url() : "";
    const isAlreadyLoggedIn = activePage ? await activePage.locator(".welcome, [qid='desk-Header-3'], a.introjs-skipbutton").first().isVisible().catch(() => false) : false;

    if (currentUrl.includes("dashboard") || currentUrl.includes("teacher-dashboard") || isAlreadyLoggedIn) {
      console.log("⚠ Already logged in! Skipping login flow...");
      return await this.VERIFY_ONLY();
    }

    // Execute login flow via page object
    const result = await electronLoginPage.login(testdata);

    // Assert result
    if (!result || !result.isLoggedIn) {
      throw new Error(`Electron login failed: ${result && result.error}`);
    }

    console.log("════ LOGIN FLOW COMPLETE — User authenticated in Electron ✓ ════");
  },

  VERIFY_ONLY: async function () {
    console.log("Verifying logged-in UI in Electron...");
    try {
      const isWelcome = await global.page.locator(".welcome").isVisible().catch(() => false);
      const isProfile = await global.page.locator("[qid='desk-Header-3'], [qid='aHeader-3']").isVisible().catch(() => false);
      const isWalkthrough = await global.page.locator("a.introjs-skipbutton").isVisible().catch(() => false);
      if (isWelcome || isProfile || isWalkthrough) {
        console.log("════ VERIFICATION COMPLETE — User is logged in ✓ ════");
      } else {
        throw new Error("UI dashboard not detected");
      }
    } catch (e) {
      console.error("Dashboard not detected:", e.message);
      throw new Error("Electron Login Verification Failed: UI dashboard not detected");
    }
  }
};

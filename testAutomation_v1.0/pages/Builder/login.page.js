"use strict";
var action = require("../../core/actionLibrary/baseActionLibrary.js");
var selectorFile = jsonParserUtil.jsonParser(selectorDir);

// Builder login is a 3-step cross-domain SSO flow:
//   1. pre-login  (/2024/pre-login)  → choose organisation, click Login
//   2. confirm    (/2024/login)      → click Login (redirects to the comproDLS Identity IdP)
//   3. IdP        (…/builder-identity)→ username + password + submit → lands in Builder
// Selectors resolve from BuilderSelectors.json → css.Builder.*
module.exports = {
  orgSelect: selectorFile.css.Builder.preLogin.orgSelect,
  preLoginBtn: selectorFile.css.Builder.preLogin.loginBtn,
  confirmLoginBtn: selectorFile.css.Builder.loginConfirm.loginBtn,
  userInput: selectorFile.css.Builder.idpLogin.userInput,
  passInput: selectorFile.css.Builder.idpLogin.passInput,
  idpSubmitBtn: selectorFile.css.Builder.idpLogin.submitBtn,

  // The org <select> on the pre-login page is the stable init signal.
  isInitialized: async function () {
    var res;
    await logger.logInto(await stackTrace.get());
    await action.waitForDocumentLoad();
    res = {
      pageStatus: await action.waitForDisplayed(this.orgSelect, 30000),
    };
    return res;
  },

  /**
   * Drives the full Builder SSO login and confirms the landing page loaded.
   * testdata: { org, username, password }
   * Lazy require of landing.page.js avoids a circular dependency (ADR-004).
   */
  login: async function (testdata) {
    await logger.logInto(await stackTrace.get(), "Builder login: org=" + testdata.org);
    var res;

    // NOTE: button[type=submit] exists on BOTH the pre-login and confirm pages, so after
    // each click we MUST wait for the page to actually transition before acting again —
    // otherwise the next step re-targets the previous page's button and the flow desyncs.
    var onConfirmPage = async () => {
      const u = await browser.getUrl();
      return /\/2024\/login/.test(u) && !/pre-login/.test(u);
    };

    // Step 1 — pre-login: pick the organisation, click Login, wait for the confirm page.
    res = await action.selectByAttribute(this.orgSelect, "label", testdata.org);
    if (res !== true) {
      await logger.logInto(await stackTrace.get(), res + " org not selected", "error");
      return { pageStatus: res };
    }
    await action.waitForClickable(this.preLoginBtn, 10000);
    await action.click(this.preLoginBtn);
    await browser.waitUntil(onConfirmPage, { timeout: 30000, timeoutMsg: "confirm page (/2024/login) did not load" });

    // Step 2 — confirmation page: click Login → redirects to the IdP. Wait for the IdP
    // username field (cross-domain → comproDLS Identity) before continuing.
    await action.waitForDisplayed(this.confirmLoginBtn, 30000);
    await action.click(this.confirmLoginBtn);
    await action.waitForDisplayed(this.userInput, 45000);

    // Step 3 — IdP: enter credentials and submit. The comproDLS Identity form is a
    // React/Angular form that only registers input via real keystroke events — setValue
    // (Playwright fill) sets the value but does NOT fire them, so the form stays "empty",
    // validation fails on submit, and it bounces back to Sign In. Type char-by-char with
    // clearValue + addValue (pressSequentially) so the form state updates. (Same fix
    // pattern as notes / schoolName.)
    await action.clearValue(this.userInput);
    await action.addValue(this.userInput, testdata.username);
    await action.clearValue(this.passInput);
    await action.addValue(this.passInput, testdata.password);
    await browser.pause(500); // let the form's onChange/validation settle before submit
    await action.waitForClickable(this.idpSubmitBtn, 10000);
    await action.click(this.idpSubmitBtn);

    // Confirm we have landed back in Builder.
    res = await require("./landing.page.js").isInitialized();
    return res;
  },
};

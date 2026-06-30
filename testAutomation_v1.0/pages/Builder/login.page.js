"use strict";
var action = require("../../core/actionLibrary/baseActionLibrary.js");
var selectorFile = jsonParserUtil.jsonParser(selectorDir);

// Builder login is a cross-domain SSO flow:
//   1. pre-login  (/2024/pre-login)  → choose organisation, click Login   [OPTIONAL — see below]
//   2. confirm    (/2024/login)      → click Login (redirects to the comproDLS Identity IdP)
//   3. IdP        (…/builder-identity)→ username + password + submit → lands in Builder
// Selectors resolve from BuilderSelectors.json → css.Builder.*
//
// The org-select step is ENVIRONMENT-DEPENDENT and handled defensively (not by env name):
// on thor the pre-login page shows the org <select> (#selectedOrg); on qa the pre-login URL
// auto-redirects straight to the confirm page (/2024/login) with the org pre-bound to
// "Cambridge One", so there is NO org step. Both isInitialized() and login() detect which page
// rendered and proceed accordingly, so the same flow works on every Builder environment.
module.exports = {
  orgSelect: selectorFile.css.Builder.preLogin.orgSelect,
  preLoginBtn: selectorFile.css.Builder.preLogin.loginBtn,
  confirmLoginBtn: selectorFile.css.Builder.loginConfirm.loginBtn,
  userInput: selectorFile.css.Builder.idpLogin.userInput,
  passInput: selectorFile.css.Builder.idpLogin.passInput,
  idpSubmitBtn: selectorFile.css.Builder.idpLogin.submitBtn,

  // Launch signal: the org <select> (thor pre-login) OR the confirm-page Login button (qa, where
  // pre-login redirects past the org step). Accept whichever renders so this works on all envs.
  isInitialized: async function () {
    await logger.logInto(await stackTrace.get());
    await action.waitForDocumentLoad();
    var orgShown = await action.waitForDisplayed(this.orgSelect, 15000);
    if (orgShown === true) return { pageStatus: true };
    // No org dropdown — qa redirected to the confirm page; treat its Login button as launched.
    var confirmShown = await action.waitForDisplayed(this.confirmLoginBtn, 20000);
    return { pageStatus: confirmShown === true };
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

    // Step 1 — pre-login org select. thor shows the org <select>; qa auto-redirects past it to the
    // confirm page (org pre-bound). Do the org step ONLY if the dropdown actually rendered, so the
    // same code drives both the 3-step (thor) and 2-step (qa) flows.
    var hasOrg = await action.waitForDisplayed(this.orgSelect, 15000);
    if (hasOrg === true) {
      res = await action.selectByAttribute(this.orgSelect, "label", testdata.org);
      if (res !== true) {
        await logger.logInto(await stackTrace.get(), res + " org not selected", "error");
        return { pageStatus: res };
      }
      await action.waitForClickable(this.preLoginBtn, 10000);
      await action.click(this.preLoginBtn);
      await browser.waitUntil(onConfirmPage, { timeout: 30000, timeoutMsg: "confirm page (/2024/login) did not load" });
    }
    // else (qa): already on the confirm page — fall through to step 2.

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

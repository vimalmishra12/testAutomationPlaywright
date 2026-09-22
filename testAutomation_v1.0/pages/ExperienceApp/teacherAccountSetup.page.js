"use strict";
/**
 * Teacher "Complete your account" wizard → join a school with its school key (module TSET).
 * Migrated from playwright-automation-c1 DashboardPage.completeTeacherAccountSetup /
 * verifyIfSchoolJoinSuccessful (2026-09-22). Joining is DURABLE: the teacher stays affiliated
 * with the school (school + data used as SOURCE does, by user decision 2026-09-22).
 */
var action = require("../../core/actionLibrary/baseActionLibrary.js");
var selectorFile = jsonParserUtil.jsonParser(selectorDir);

// Resolves to C1Selectors.json → css.ComproC1.teacherAccountSetup
var ts = selectorFile.css.ComproC1.teacherAccountSetup;

// Wizard steps are client-side; SOURCE allowed 30 s for the setup page to appear.
var STEP_TIMEOUT = 30000;
// SOURCE waited 20 s per Join attempt for either the success or the server-error signal.
var JOIN_ATTEMPT_TIMEOUT = 20000;
var JOIN_MAX_ATTEMPTS = 5;

// [2026-09-22, prod trace] IntroJS tours mount ~1.8 s AFTER the page's own content, so a
// presence check the moment the page is ready reports "no tour" and the next click is
// intercepted. Give the tour this long to appear before deciding there is none.
var TOUR_LATE_MS = 5000;

/**
 * Closes an IntroJS tour if one is up (waiting up to lateMs for a late-mounting one). The tour
 * intercepts pointer events, so nothing underneath can be clicked until it is gone. Sentinel is
 * the tour dialog `.introjs-tooltip` — `.introjs-overlay` is not always rendered.
 */
async function closeIntroTourIfShown(lateMs) {
  if (lateMs) await action.waitForDisplayed(ts.introTourDialog, lateMs);
  if (true != (await action.isDisplayed(ts.introTourDialog))) return true;
  var res = await action.click(ts.introTourSkipBtn);
  if (true == res) res = await action.waitForDisplayed(ts.introTourDialog, 10000, true);
  return res;
}

module.exports = {
  /**
   * Setup page is ready once the "I teach in a school" option OR its "Welcome, Teacher
   * (1 of 5)" tour is shown — the tour renders on top of the option on first visit.
   */
  isInitialized: async function () {
    await logger.logInto(await stackTrace.get());
    await action.waitForDocumentLoad();
    var deadline = Date.now() + STEP_TIMEOUT;
    while (Date.now() < deadline) {
      if (true == (await action.isDisplayed(ts.teachInSchoolOption))) return { pageStatus: true };
      if (true == (await action.isDisplayed(ts.introTourDialog))) return { pageStatus: true };
      await browser.pause(500);
    }
    return { pageStatus: false };
  },

  /**
   * Opens the setup wizard from the teacher dashboard and closes its welcome tour.
   * Returns whether the first wizard choice ("I teach in a school") is usable.
   */
  click_completeAccount: async function () {
    await logger.logInto(await stackTrace.get());
    // A dashboard tour can still be up (or arriving) — it would swallow this click.
    var res = await closeIntroTourIfShown(TOUR_LATE_MS);
    if (true == res) res = await action.click(ts.completeAccountBtn);
    if (true == res) res = (await this.isInitialized()).pageStatus;
    // "Welcome, Teacher (1 of 5)" mounts after the wizard's first option.
    if (true == res) res = await closeIntroTourIfShown(TOUR_LATE_MS);
    return {
      pageStatus: true == res,
      teachInSchoolShown: true == (await action.waitForDisplayed(ts.teachInSchoolOption, STEP_TIMEOUT)),
    };
  },

  /**
   * "I teach in a school" → Next → "Join a school" → Next. Returns whether the school-key
   * form is shown.
   */
  select_joinSchoolPath: async function () {
    await logger.logInto(await stackTrace.get());
    var steps = [ts.teachInSchoolOption, ts.accountSetupNextBtn, ts.joinSchoolOption, ts.joinSchoolNextBtn];
    for (var i = 0; i < steps.length; i++) {
      var res = await action.waitForDisplayed(steps[i], STEP_TIMEOUT);
      if (true == res) res = await action.click(steps[i]);
      if (true != res) return { schoolKeyFormShown: false, failedAt: steps[i] };
    }
    return { schoolKeyFormShown: true == (await action.waitForDisplayed(ts.schoolKeyInput, STEP_TIMEOUT)) };
  },

  /**
   * Types the school key and clicks Join, then waits for either the success screen
   * ("Go to dashboard") or the server-error alert.
   *
   * WORKAROUND — PROD intermittently answers Join with "There was a problem on server";
   * SOURCE (playwright-automation-c1) retries up to 5×. Kept as SOURCE does by user decision
   * (2026-09-22), to be recorded in the manual register. Every retry is logged and returned
   * (serverErrors) so the run report shows how often the product failed. Remove once fixed.
   */
  set_schoolKey_join: async function (schoolKey) {
    await logger.logInto(await stackTrace.get(), "schoolKey:" + schoolKey);
    var res = await action.click(ts.schoolKeyInput);
    if (true == res) res = await action.addValue(ts.schoolKeyInput, schoolKey);
    if (true != res) return { joined: false, serverErrors: 0 };

    var serverError = action.getFilteredLocator(ts.serverErrorAlert, "There was a problem on server");
    var serverErrors = 0;
    for (var attempt = 1; attempt <= JOIN_MAX_ATTEMPTS; attempt++) {
      res = await action.click(ts.joinSchoolBtn);
      if (true != res) return { joined: false, serverErrors: serverErrors };
      var deadline = Date.now() + JOIN_ATTEMPT_TIMEOUT;
      var outcome = null;
      while (Date.now() < deadline && outcome === null) {
        if (true == (await action.isDisplayed(ts.goToDashboardBtn))) outcome = "ok";
        else if (true == (await action.isDisplayed(serverError))) outcome = "serverError";
        else await browser.pause(500);
      }
      if (outcome === "ok") return { joined: true, serverErrors: serverErrors };
      if (outcome === "serverError") {
        serverErrors++;
        await logger.logInto(await stackTrace.get(), "WORKAROUND: server error on Join, attempt " + attempt, "error");
        await action.click(ts.serverErrorAlertCloseBtn);
      }
    }
    return { joined: false, serverErrors: serverErrors };
  },

  /**
   * "Go to dashboard" → closes the dashboard tutorial → returns the school name in the header.
   */
  click_goToDashboard_getSchoolName: async function () {
    await logger.logInto(await stackTrace.get());
    var res = await action.click(ts.goToDashboardBtn);
    if (true == res) res = (await require("./dashboard.page.js").isInitialized()).pageStatus;
    if (true != res) return { schoolName: null };
    // The tutorial button only shows on the first dashboard visit after joining.
    if (true == (await action.waitForDisplayed(ts.dashboardTutorialBtn, 10000))) {
      await action.click(ts.dashboardTutorialBtn);
    }
    await closeIntroTourIfShown();
    if (true != (await action.waitForDisplayed(ts.schoolTitle, STEP_TIMEOUT))) return { schoolName: null };
    return { schoolName: (await action.getText(ts.schoolTitle)).trim() };
  },
};

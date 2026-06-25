"use strict";
var action = require("../../../core/actionLibrary/baseActionLibrary.js");
var selectorFile = jsonParserUtil.jsonParser(selectorDir);

var IFRAME_SEL = selectorFile.css.LTI.ltiPEPage.activityIframe;

module.exports = {

  // Click words inside the iframe in the given order (word-order exercise).
  _clickWords: async function (words) {
    await action.switchToFrame(IFRAME_SEL);
    for (var i = 0; i < words.length; i++) {
      // Try button first, then any clickable element with that text
      var wordBtn = global.__activeFrame
        .locator("button, span[role='button'], [class*='word'][class*='bank'] *, [class*='wordbank'] *")
        .filter({ hasText: new RegExp("^" + words[i] + "$") })
        .first();
      await wordBtn.click({ timeout: 10000 });
      await global.page.waitForTimeout(300);
    }
    await action.switchToParentFrame();
  },

  // Type an answer into the textbox inside the iframe (fill-in-the-blank exercise).
  _typeAnswer: async function (answer) {
    await action.switchToFrame(IFRAME_SEL);
    var inputSel = "input[type='text'], textarea, input:not([type='hidden']):not([type='submit']):not([type='button']):not([type='checkbox'])";
    await action.setValue(inputSel, answer);
    await action.switchToParentFrame();
  },

  // Click the Check or Next element on the outer page (button OR link).
  _clickOuterControl: async function (text) {
    var ctrl = global.page.locator("a, button").filter({ hasText: new RegExp("^" + text + "$", "i") }).first();
    await ctrl.click({ timeout: 10000 });
    await global.page.waitForTimeout(800);
  },

  // Perform all activity exercises from testdata.activity.exercises.
  performActivity: async function (testdata) {
    await logger.logInto(await stackTrace.get());
    var exercises = testdata.activity.exercises;
    var completionStatus = false;
    try {
      // Dismiss leave-confirmation dialog if it intercepted between TCs
      var stayBtn = global.page.locator("button.stay-on-page-link");
      var stayVisible = await stayBtn.isVisible().catch(() => false);
      if (stayVisible) {
        await stayBtn.click();
        await global.page.waitForTimeout(500);
      }
      // Accept cookie banner if visible
      var cookieBtn = global.page.locator("a.accept-btn, button.accept-btn");
      var cookieVisible = await cookieBtn.isVisible().catch(() => false);
      if (cookieVisible) {
        await cookieBtn.click();
        await global.page.waitForTimeout(500);
      }
      // If a specific activity title is provided, navigate to it via TOC
      if (testdata.activity.activityTitle) {
        var tocHamburger = global.page.locator("img.toc-hamburger-btn");
        var tocOpen = await global.page.locator(".toc-data-wrapper, a.activity-name-container").first().isVisible().catch(() => false);
        if (!tocOpen) {
          await tocHamburger.click({ timeout: 10000 });
          await global.page.waitForTimeout(800);
        }
        var activityLink = global.page
          .locator("a.activity-name-container")
          .filter({ hasText: testdata.activity.activityTitle })
          .first();
        await activityLink.click({ timeout: 10000 });
        await global.page.waitForTimeout(1000);
        // Confirm leaving the current activity if the leave-confirmation dialog appears
        var leaveBtn = global.page.locator("button").filter({ hasText: /yes.*leave|leave/i }).first();
        var leaveVisible = await leaveBtn.isVisible().catch(() => false);
        if (leaveVisible) {
          await leaveBtn.click();
          await global.page.waitForTimeout(800);
        }
        // Wait for iframe to reload after switching activity
        await action.waitForDisplayed(IFRAME_SEL, 15000);
        await logger.logInto(await stackTrace.get(), "Switched to activity: " + testdata.activity.activityTitle);
      }
      // Check outer page first — if NEXT ACTIVITY button is visible the exercise is already done
      var outerDone = await global.page
        .locator("a.nextActivityBtn, .nextActivityBtn")
        .first()
        .isVisible()
        .catch(() => false);
      if (outerDone) {
        await logger.logInto(await stackTrace.get(), "Activity already completed — NEXT ACTIVITY visible on outer page");
        completionStatus = true;
        return { completionStatus };
      }
      // Check inside iframe for completion screen
      await action.switchToFrame(IFRAME_SEL);
      var alreadyDone = await global.__activeFrame
        .locator("[class*='score'], [class*='result'], [class*='complete'], [class*='Summary']")
        .first()
        .isVisible()
        .catch(() => false);
      await action.switchToParentFrame();

      if (alreadyDone) {
        await logger.logInto(await stackTrace.get(), "Activity already completed — completion screen visible");
        completionStatus = true;
        return { completionStatus };
      }

      for (var i = 0; i < exercises.length; i++) {
        var ex = exercises[i];
        if (ex.type === "word-order") {
          await this._clickWords(ex.words);
        } else if (ex.type === "fill-blank") {
          await this._typeAnswer(ex.answer);
        }
        await this._clickOuterControl("Check");
        await global.page.waitForTimeout(500);
        var hasNext = await global.page.locator("a, button").filter({ hasText: /^Next$/i }).count();
        if (hasNext > 0) {
          await this._clickOuterControl("Next");
        }
      }

      // After last exercise the iframe shows score/completion screen.
      await action.switchToFrame(IFRAME_SEL);
      var completionEl = global.__activeFrame
        .locator("[class*='score'], [class*='result'], [class*='complete'], p")
        .filter({ hasText: /completed|score|result/i })
        .first();
      completionStatus = await completionEl.isVisible({ timeout: 5000 }).catch(() => false);
      await action.switchToParentFrame();
    } catch (err) {
      await logger.logInto(await stackTrace.get(), err.message, "error");
      await action.switchToParentFrame().catch(() => {});
    }
    return { completionStatus };
  },
};

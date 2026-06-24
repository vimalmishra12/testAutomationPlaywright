"use strict";
var action = require("../../../core/actionLibrary/baseActionLibrary.js");
var selectorFile = jsonParserUtil.jsonParser(selectorDir);

module.exports = {
  backBtn:        selectorFile.css.LTI.ltiPEPage.backBtn,
  deeplinkPageGuard:      selectorFile.css.LTI.ltiDeeplinkPEPage.pageGuard,
  deeplinkActivityIframe: selectorFile.css.LTI.ltiDeeplinkPEPage.activityIframe,
  deeplinkBackBtn:        selectorFile.css.LTI.ltiDeeplinkPEPage.backBtn,
  tocContainer:   selectorFile.css.LTI.ltiPEPage.tocContainer,
  tocHamburger:   selectorFile.css.LTI.ltiPEPage.tocHamburger,
  tocHeading:     selectorFile.css.LTI.ltiPEPage.tocHeading,
  tocItems:       selectorFile.css.LTI.ltiPEPage.tocItems,
  activityIframe: selectorFile.css.LTI.ltiPEPage.activityIframe,

  isInitialized_deeplink_student: async function () {
    await logger.logInto(await stackTrace.get());
    // Student learner page uses learning-path/learner/... — no h1; use iframe as guard.
    await global.page.waitForURL("**/learning-path/**", { timeout: 30000 });
    await action.waitForDocumentLoad();
    var iframeStatus  = await action.waitForDisplayed(this.deeplinkActivityIframe, 30000);
    var backBtnAbsent = !(await action.isDisplayed(this.deeplinkBackBtn));
    return { iframeStatus, backBtnAbsent };
  },

  isInitialized_deeplink: async function () {
    await logger.logInto(await stackTrace.get());
    // PE deeplink passes through lti-onboarding (shows a hidden h1 "Go to the newly
    // opened tab") before settling on the learning-path URL. Wait for the final URL
    // so element checks run on the correct page.
    await global.page.waitForURL("**/learning-path/**", { timeout: 30000 });
    await action.waitForDocumentLoad();
    var pageGuardStatus  = await action.waitForDisplayed(this.deeplinkPageGuard, 15000);
    var iframeStatus     = await action.waitForDisplayed(this.deeplinkActivityIframe, 30000);
    var backBtnAbsent    = !(await action.isDisplayed(this.deeplinkBackBtn));
    return { pageGuardStatus, iframeStatus, backBtnAbsent };
  },

  getData_peState: async function (testdata) {
    await logger.logInto(await stackTrace.get());
    await action.waitForDocumentLoad();
    var backBtnStatus    = await action.waitForDisplayed(this.backBtn, 15000);
    var teacherModeUrl   = global.page.url().includes('/teacher/');
    await action.click(this.tocHamburger);
    var tocStatus        = await action.waitForDisplayed(this.tocContainer, 15000);
    var tocHeadingStatus = await action.waitForDisplayed(this.tocHeading, 15000);
    var tocHeadingText   = await action.getText(this.tocHeading);
    var tocItemCount     = await global.page.locator(this.tocItems).count();
    var iframeStatus     = await action.waitForDisplayed(this.activityIframe, 15000);
    return { backBtnStatus, teacherModeUrl, tocStatus, tocHeadingStatus, tocHeadingText, tocItemCount, iframeStatus };
  },
};

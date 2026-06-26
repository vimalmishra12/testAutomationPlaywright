"use strict";
var action = require("../../../core/actionLibrary/baseActionLibrary.js");
var selectorFile = jsonParserUtil.jsonParser(selectorDir);

module.exports = {
  backBtn:        selectorFile.css.LTI.ltiPEPage.backBtn,
  tocContainer:   selectorFile.css.LTI.ltiPEPage.tocContainer,
  tocHamburger:   selectorFile.css.LTI.ltiPEPage.tocHamburger,
  tocHeading:     selectorFile.css.LTI.ltiPEPage.tocHeading,
  tocItems:       selectorFile.css.LTI.ltiPEPage.tocItems,
  activityIframe: selectorFile.css.LTI.ltiPEPage.activityIframe,

  getData_peState: async function (testdata) {
    await logger.logInto(await stackTrace.get());
    await action.waitForDocumentLoad();
    var backBtnStatus    = await action.waitForDisplayed(this.backBtn, 15000);
    var currentUrl       = await browser.getUrl();
    var teacherModeUrl   = currentUrl.includes('/teacher/');
    await action.click(this.tocHamburger);
    var [tocStatus, tocHeadingStatus, tocHeadingText, tocItemCount, iframeStatus] = await Promise.all([
      action.waitForDisplayed(this.tocContainer, 15000),
      action.waitForDisplayed(this.tocHeading, 15000),
      action.getText(this.tocHeading),
      action.getElementCount(this.tocItems),
      action.waitForDisplayed(this.activityIframe, 15000),
    ]);
    return { backBtnStatus, teacherModeUrl, tocStatus, tocHeadingStatus, tocHeadingText, tocItemCount, iframeStatus };
  },
};

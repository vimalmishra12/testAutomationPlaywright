"use strict";
var action = require("../../../core/actionLibrary/baseActionLibrary.js");
var selectorFile = jsonParserUtil.jsonParser(selectorDir);

module.exports = {
  componentPageGuard: selectorFile.css.LTI.ltiComponentPage.componentPageGuard,
  // Ebook viewer selectors — shared by the component-launch and deeplink ebook flows.
  ebookGuard:   selectorFile.css.LTI.ltiDeeplinkEbookPage.pageGuard,
  ebookToolbar: selectorFile.css.LTI.ltiDeeplinkEbookPage.toolbar,
  ebookBackBtn: selectorFile.css.LTI.ltiDeeplinkEbookPage.backBtn,

  isInitialized: async function () {
    await logger.logInto(await stackTrace.get());
    await action.waitForDocumentLoad();
    // Ebook components skip .product-launch-container and navigate directly to /foc/ URL.
    // Race both signals so this guard works for all component types.
    // NOTE: action.* helpers resolve (not reject) with an Error on failure, so the race
    // never rejects — inspect the resolved value. Each branch only settles on success or
    // at its 30s timeout, so the first `true` wins on success and an Error wins on failure.
    var res = await Promise.race([
      action.waitForDisplayed(this.componentPageGuard, 30000),
      action.waitForUrl('**/foc/**', 30000),
    ]);
    return { pageStatus: res === true };
  },

  getData_ebookState: async function () {
    await logger.logInto(await stackTrace.get());
    await action.waitForDocumentLoad();
    var [ebookGuardStatus, toolbarStatus] = await Promise.all([
      action.waitForDisplayed(this.ebookGuard,   15000),
      action.waitForDisplayed(this.ebookToolbar, 15000),
    ]);
    // Short timeout: the ebook viewer is already loaded (guard + toolbar above) so the
    // back button's absence is decided fast.
    // Normalize to boolean: waitForDisplayed returns TimeoutError string when not found.
    var backBtnStatus = (await action.waitForDisplayed(this.ebookBackBtn, 1500)) === true;
    var focUrl = (await browser.getUrl()).includes('/foc/');
    return { ebookGuardStatus, toolbarStatus, backBtnStatus, focUrl };
  },
};

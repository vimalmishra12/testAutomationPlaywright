"use strict";
var action = require("../../../core/actionLibrary/baseActionLibrary.js");
var selectorFile = jsonParserUtil.jsonParser(selectorDir);

module.exports = {
  componentPageGuard: selectorFile.css.LTI.ltiComponentPage.componentPageGuard,
  // Shared selectors — also used by deeplink ebook tests on integrationCases branch
  ebookGuard:   selectorFile.css.LTI.ltiDeeplinkEbookPage.pageGuard,
  ebookToolbar: selectorFile.css.LTI.ltiDeeplinkEbookPage.toolbar,

  isInitialized: async function () {
    await logger.logInto(await stackTrace.get());
    await action.waitForDocumentLoad();
    // Ebook components skip .product-launch-container and navigate directly to /foc/ URL.
    // Race both signals so this guard works for all component types.
    try {
      await Promise.race([
        global.page.locator(this.componentPageGuard).first().waitFor({ state: 'visible', timeout: 30000 }),
        global.page.waitForURL('**/foc/**', { timeout: 30000 }),
      ]);
      return { pageStatus: true };
    } catch (e) {
      return { pageStatus: false };
    }
  },

  getData_ebookState: async function () {
    await logger.logInto(await stackTrace.get());
    await action.waitForDocumentLoad();
    var [ebookGuardStatus, toolbarStatus] = await Promise.all([
      action.waitForDisplayed(this.ebookGuard,   15000),
      action.waitForDisplayed(this.ebookToolbar, 15000),
    ]);
    var focUrl = global.page.url().includes('/foc/');
    return { ebookGuardStatus, toolbarStatus, focUrl };
  },

  isInitialized_ebook: async function () {
    await logger.logInto(await stackTrace.get());
    // lti-onboarding redirects to the ebook URL (/foc/...); wait for it before checking elements.
    await global.page.waitForURL("**/foc/**", { timeout: 45000 });
    await action.waitForDocumentLoad();
    var [pageGuardStatus, toolbarStatus] = await Promise.all([
      action.waitForDisplayed(this.ebookGuard,   30000),
      action.waitForDisplayed(this.ebookToolbar, 15000),
    ]);
    return { pageGuardStatus, toolbarStatus };
  },
};

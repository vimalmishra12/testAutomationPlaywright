"use strict";
var action = require("../../../core/actionLibrary/baseActionLibrary.js");
var selectorFile = jsonParserUtil.jsonParser(selectorDir);

module.exports = {
  ebookGuard:   selectorFile.css.LTI.ltiDeeplinkEbookPage.pageGuard,
  ebookToolbar: selectorFile.css.LTI.ltiDeeplinkEbookPage.toolbar,

  isInitialized: async function () {
    await logger.logInto(await stackTrace.get());
    await action.waitForDocumentLoad();
    return { pageStatus: true };
  },

  getData_ebookState: async function () {
    await logger.logInto(await stackTrace.get());
    await action.waitForDocumentLoad();
    var ebookGuardStatus = await action.waitForDisplayed(this.ebookGuard,   15000);
    var toolbarStatus    = await action.waitForDisplayed(this.ebookToolbar, 15000);
    var focUrl           = global.page.url().includes('/foc/');
    return { ebookGuardStatus, toolbarStatus, focUrl };
  },

  isInitialized_ebook: async function () {
    await logger.logInto(await stackTrace.get());
    // lti-onboarding redirects to the ebook URL (/foc/...); wait for it before checking elements.
    await global.page.waitForURL("**/foc/**", { timeout: 45000 });
    await action.waitForDocumentLoad();
    var pageGuardStatus = await action.waitForDisplayed(this.ebookGuard,   30000);
    var toolbarStatus   = await action.waitForDisplayed(this.ebookToolbar, 15000);
    return { pageGuardStatus, toolbarStatus };
  },
};

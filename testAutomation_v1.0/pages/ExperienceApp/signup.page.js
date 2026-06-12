'use strict';
var action = require('../../core/actionLibrary/baseActionLibrary.js');
var selectorFile = jsonParserUtil.jsonParser(selectorDir);
var appShellPage = require('./appShell.page.js');
var res;

module.exports = {
  createAccountTitleTxt: selectorFile.css.ComproC1.signUp.createAccountTitleTxt,

  isInitialized: async function () {
    // var res;
    await logger.logInto(await stackTrace.get());
    await action.waitForDocumentLoad();
    res = {
      // [2026-06-11] Playwright port: the /regoptions signup page renders slower than
      // 5s; bumped to 15s so the (present) element is reliably found.
      pageStatus: await action.waitForDisplayed(
        this.createAccountTitleTxt,
        15000
      ),
      // appShellPage: await appShellPage.isInitialized()
    };
    return res;
  },
};

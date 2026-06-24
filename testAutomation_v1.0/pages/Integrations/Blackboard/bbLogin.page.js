"use strict";
var action = require("../../../core/actionLibrary/baseActionLibrary.js");
var selectorFile = jsonParserUtil.jsonParser(selectorDir);

module.exports = {
  privacyCookiesOkBtn: selectorFile.css.Blackboard.bbLogin.privacyCookiesOkBtn,
  usernameTbox: selectorFile.css.Blackboard.bbLogin.usernameTbox,
  passwordTbox: selectorFile.css.Blackboard.bbLogin.passwordTbox,
  signInBtn: selectorFile.css.Blackboard.bbLogin.signInBtn,
  postLoginIndicator: selectorFile.css.Blackboard.bbLogin.postLoginIndicator,

  isInitialized: async function () {
    var res;
    await logger.logInto(await stackTrace.get());
    await action.waitForDocumentLoad();
    res = {
      pageStatus: await action.waitForDisplayed(this.postLoginIndicator, 30000),
    };
    return res;
  },

  click_privacyCookiesOkBtn: async function () {
    await logger.logInto(await stackTrace.get());
    var res;
    const isVisible = await action.isDisplayed(this.privacyCookiesOkBtn);
    if (isVisible !== true) {
      await logger.logInto(await stackTrace.get(), "Privacy/cookies popup not visible — skipping");
      return true;
    }
    res = await action.click(this.privacyCookiesOkBtn);
    if (true == res) {
      await logger.logInto(await stackTrace.get(), "privacyCookiesOkBtn clicked");
      await action.waitForDisplayed(this.privacyCookiesOkBtn, 10000, true);
    } else {
      await logger.logInto(await stackTrace.get(), res + " privacyCookiesOkBtn NOT clicked", "error");
    }
    return res;
  },

  set_usernameTbox: async function (value) {
    await logger.logInto(await stackTrace.get());
    var res;
    res = await action.setValue(this.usernameTbox, value);
    if (true == res) {
      await logger.logInto(await stackTrace.get(), "Value entered in usernameTbox");
    } else {
      await logger.logInto(await stackTrace.get(), res + " Value NOT entered in usernameTbox", "error");
    }
    return res;
  },

  set_passwordTbox: async function (value) {
    await logger.logInto(await stackTrace.get());
    var res;
    res = await action.setValue(this.passwordTbox, value);
    if (true == res) {
      await logger.logInto(await stackTrace.get(), "Value entered in passwordTbox");
    } else {
      await logger.logInto(await stackTrace.get(), res + " Value NOT entered in passwordTbox", "error");
    }
    return res;
  },

  click_signInBtn: async function () {
    await logger.logInto(await stackTrace.get());
    var res;
    res = await action.click(this.signInBtn);
    if (true == res) {
      await logger.logInto(await stackTrace.get(), "signInBtn clicked");
      res = await this.isInitialized();
    } else {
      await logger.logInto(await stackTrace.get(), res + " signInBtn NOT clicked", "error");
    }
    return res;
  },
};

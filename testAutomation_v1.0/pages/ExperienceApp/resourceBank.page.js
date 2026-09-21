"use strict";
var action = require("../../core/actionLibrary/baseActionLibrary.js");
var selectorFile = jsonParserUtil.jsonParser(selectorDir);
var rb = selectorFile.css.ComproC1.resourceBank;

module.exports = {
  resourcesAreaHeading: rb.resourcesAreaHeading,

  isInitialized: async function () {
    await logger.logInto(await stackTrace.get());
    await action.waitForDocumentLoad();
    var res = {
      pageStatus: (await action.waitForDisplayed(this.resourcesAreaHeading, 25000)) === true
    };
    return res;
  },

  getData_header: async function () {
    await logger.logInto(await stackTrace.get());
    var text = null;
    if ((await action.isDisplayed(this.resourcesAreaHeading)) === true) {
      text = await action.getText(this.resourcesAreaHeading);
    }
    return {
      heading: typeof text === "string" ? text.trim() : ""
    };
  }
};

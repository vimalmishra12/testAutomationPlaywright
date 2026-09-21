"use strict";
var action = require("../../core/actionLibrary/baseActionLibrary.js");
var selectorFile = jsonParserUtil.jsonParser(selectorDir);
var rb = selectorFile.css.ComproC1.resourceBank;

module.exports = {
  resourcesAreaHeading: rb.resourcesAreaHeading,
  backBtn: rb.backBtn,

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
  },

  click_back: async function () {
    await logger.logInto(await stackTrace.get());
    var res = { pageStatus: false };
    var displayed = (await action.waitForDisplayed(this.backBtn, 15000)) === true;

    if (!displayed) {
      await logger.logInto(await stackTrace.get(), "Back button #rb-back-btn is not displayed", "error");
      return res;
    }

    var initialCount = action.getPageCount();
    await action.click(this.backBtn);
    await browser.pause(2000);

    // If clicking back closed a tab or if we need to return to original tab
    if (action.getPageCount() > 1 && initialCount > 1) {
      // Check if active page is still resource bank
      if (await action.isDisplayed(this.resourcesAreaHeading)) {
        await action.closeCurrentTabAndRefocus();
      }
    }

    await action.waitForDocumentLoad();
    res.pageStatus = true;
    return res;
  }
};

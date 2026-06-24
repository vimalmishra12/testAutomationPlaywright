"use strict";
var action = require("../../../core/actionLibrary/baseActionLibrary.js");
var selectorFile = jsonParserUtil.jsonParser(selectorDir);

module.exports = {
  coursePageGuard: selectorFile.css.Blackboard.bbCoursePage.coursePageGuard,
  addContentBtn: selectorFile.css.Blackboard.bbCoursePage.addContentBtn,
  contentMarketMenuItem: selectorFile.css.Blackboard.bbCoursePage.contentMarketMenuItem,
  devDashboardLink: selectorFile.css.Blackboard.bbCoursePage.devDashboardLink,

  isInitialized: async function () {
    var res;
    await logger.logInto(await stackTrace.get());
    await action.waitForDocumentLoad();
    res = { pageStatus: await action.waitForDisplayed(this.coursePageGuard, 30000) };
    return res;
  },

  click_ltiTool: async function () {
    await logger.logInto(await stackTrace.get());
    var res;

    res = await action.click(this.addContentBtn, { force: true });
    if (true !== res) {
      await logger.logInto(await stackTrace.get(), res + " addContentBtn NOT clicked", "error");
      return res;
    }
    await logger.logInto(await stackTrace.get(), "addContentBtn clicked");

    res = await action.click(this.contentMarketMenuItem);
    if (true !== res) {
      await logger.logInto(await stackTrace.get(), res + " contentMarketMenuItem NOT clicked", "error");
      return res;
    }
    await logger.logInto(await stackTrace.get(), "contentMarketMenuItem clicked");

    const pagePromise = global.__pwContext.waitForEvent("page");
    res = await action.click(this.devDashboardLink);
    if (true !== res) {
      await logger.logInto(await stackTrace.get(), res + " devDashboardLink NOT clicked", "error");
      return res;
    }
    await logger.logInto(await stackTrace.get(), "devDashboardLink clicked — waiting for new tab");

    const newPage = await pagePromise;
    await newPage.waitForLoadState("load");
    global.page = newPage;
    await logger.logInto(await stackTrace.get(), "Switched to LTI teacher dashboard tab");

    res = await require("../LTI/ltiTeacherDashboard.page.js").isInitialized();
    return res;
  },
};

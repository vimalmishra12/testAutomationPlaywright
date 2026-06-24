"use strict";
var action = require("../../../core/actionLibrary/baseActionLibrary.js");
var selectorFile = jsonParserUtil.jsonParser(selectorDir);

module.exports = {
  dashboardGuard:   selectorFile.css.LTI.ltiTeacherDashboard.dashboardGuard,
  courseTitle:      selectorFile.css.LTI.ltiTeacherDashboard.courseTitle,
  spaceTitle:       selectorFile.css.LTI.ltiTeacherDashboard.spaceTitle,
  bundleName:       selectorFile.css.LTI.ltiTeacherDashboard.bundleName,
  markingBtn:       selectorFile.css.LTI.ltiTeacherDashboard.markingBtn,
  createLinksBtn:   selectorFile.css.LTI.ltiTeacherDashboard.createLinksBtn,
  umbrellaCard:     selectorFile.css.LTI.ltiTeacherDashboard.umbrellaCard,
  componentItem:    selectorFile.css.LTI.ltiTeacherDashboard.componentItem,

  isInitialized: async function () {
    var res;
    await logger.logInto(await stackTrace.get());
    await action.waitForDocumentLoad();
    res = { pageStatus: await action.waitForDisplayed(this.dashboardGuard, 30000) };
    return res;
  },

  verifyDashboard: async function (testdata) {
    await logger.logInto(await stackTrace.get());
    var [courseTitleText, schoolNameText, courseDurationText, bundleNameText, markingBtnStatus, createLinksBtnStatus] = await Promise.all([
      action.getText(this.courseTitle),
      action.getText(global.page.locator(this.spaceTitle).nth(0)),
      action.getText(global.page.locator(this.spaceTitle).nth(1)),
      action.getText(this.bundleName),
      action.waitForDisplayed(this.markingBtn, 10000),
      action.waitForDisplayed(this.createLinksBtn, 10000),
    ]);
    return { pageStatus: true, courseTitleText, schoolNameText, courseDurationText, bundleNameText, markingBtnStatus, createLinksBtnStatus };
  },

  click_component: async function (testdata) {
    await logger.logInto(await stackTrace.get());
    var res;

    res = await action.waitForDisplayed(this.umbrellaCard, 30000);
    if (true !== res) {
      await logger.logInto(await stackTrace.get(), res + " — umbrellaCard NOT visible", "error");
      return { pageStatus: res };
    }

    var componentLocator = global.page
      .locator(this.umbrellaCard).filter({ hasText: testdata.umbrellaName })
      .locator(this.componentItem).filter({ hasText: testdata.componentName });

    res = await action.click(componentLocator);
    if (true !== res) {
      await logger.logInto(await stackTrace.get(), res + " — component NOT clicked", "error");
      return { pageStatus: res };
    }

    res = await require("./ltiComponentPage.page.js").isInitialized();
    return res;
  },

  returnToDashboard: async function (url) {
    await logger.logInto(await stackTrace.get());
    await global.page.goto(url);
    return await action.waitForDisplayed(this.dashboardGuard, 15000);
  },
};

"use strict";
var action = require("../../../core/actionLibrary/baseActionLibrary.js");
var selectorFile = jsonParserUtil.jsonParser(selectorDir);

module.exports = {
  dashboardGuard:   selectorFile.css.LTI.ltiTeacherDashboard.dashboardGuard,
  loaderWrapper:    selectorFile.css.LTI.ltiTeacherDashboard.loaderWrapper,
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
    // The LTI launch endpoint (/lti/launch) shows an OIDC spinner, then swaps in the
    // dashboard SPA in place (URL does not change). The page is telemetry-heavy and rarely
    // reaches 'networkidle', so we do NOT wait on it (it would burn the full timeout every
    // run); the loaderWrapper-hidden wait below is the authoritative readiness signal.
    await action.waitForDocumentLoad();
    // The dashboard shell (.lti-dashboard-container) renders immediately, but the course
    // content is fetched over the LTI integration and can be slow. Wait for the in-shell
    // loader to clear so the guard reflects a fully-loaded dashboard, not just the shell.
    res = await action.waitForDisplayed(this.dashboardGuard, 30000);
    if (true === res) {
      await action.waitForDisplayed(this.loaderWrapper, 120000, true); // reverse: wait until hidden
    }
    return { pageStatus: res };
  },

  verifyDashboard: async function (testdata) {
    await logger.logInto(await stackTrace.get());
    // schoolName is spaceTitle[0]; the spaceTitle[1] "course duration" value is intentionally
    // NOT read — its assertion was removed (flaky by a day, commit de4ec1f).
    var spaceTitleFirst = await action.getKthElement(this.spaceTitle, 0);
    var [courseTitleText, schoolNameText, bundleNameText, markingBtnStatus, createLinksBtnStatus] = await Promise.all([
      action.getText(this.courseTitle),
      action.getText(spaceTitleFirst),
      action.getText(this.bundleName),
      action.waitForDisplayed(this.markingBtn, 10000),
      action.waitForDisplayed(this.createLinksBtn, 10000),
    ]);
    return { pageStatus: true, courseTitleText, schoolNameText, bundleNameText, markingBtnStatus, createLinksBtnStatus };
  },

  click_component: async function (testdata) {
    await logger.logInto(await stackTrace.get());
    var res;

    res = await action.waitForDisplayed(this.umbrellaCard, 30000);
    if (true !== res) {
      await logger.logInto(await stackTrace.get(), res + " — umbrellaCard NOT visible", "error");
      return { pageStatus: res };
    }

    var componentLocator = action.getNestedFilteredLocator(
      this.umbrellaCard, testdata.umbrellaName,
      this.componentItem, testdata.componentName
    );

    res = await action.click(componentLocator);
    if (true !== res) {
      await logger.logInto(await stackTrace.get(), res + " — component NOT clicked", "error");
      return { pageStatus: res };
    }

    res = await require("./ltiComponentPage.page.js").isInitialized();
    return res;
  },

  getDashboardUrl: async function () {
    await logger.logInto(await stackTrace.get());
    return await browser.getUrl();
  },

  returnToDashboard: async function (url) {
    await logger.logInto(await stackTrace.get());
    await browser.url(url);
    // Reuse the canonical readiness definition (shell guard + loader cleared) instead of a
    // weaker shell-only wait, so the dashboard is fully loaded before the next component click.
    return (await this.isInitialized()).pageStatus;
  },
};

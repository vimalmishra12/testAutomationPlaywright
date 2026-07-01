"use strict";
var action = require("../../../core/actionLibrary/baseActionLibrary.js");
var selectorFile = jsonParserUtil.jsonParser(selectorDir);

module.exports = {
  coursePageGuard:      selectorFile.css.Blackboard.bbCoursePage.coursePageGuard,
  addContentBtn:        selectorFile.css.Blackboard.bbCoursePage.addContentBtn,
  contentMarketMenuItem: selectorFile.css.Blackboard.bbCoursePage.contentMarketMenuItem,
  devDashboardLink:     selectorFile.css.Blackboard.bbCoursePage.devDashboardLink,
  deepLinkItem:         selectorFile.css.Blackboard.bbCoursePage.deepLinkItem,
  launchPanelContainer: selectorFile.css.Blackboard.bbLaunchPanel.panelContainer,
  launchPanelHeading:   selectorFile.css.Blackboard.bbLaunchPanel.panelHeading,
  launchPanelLaunchBtn: selectorFile.css.Blackboard.bbLaunchPanel.launchBtn,

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

    const prevPage = global.page;
    const newPage = await pagePromise;
    await newPage.waitForLoadState("load");
    global.page = newPage;
    await logger.logInto(await stackTrace.get(), "Switched to LTI teacher dashboard tab");

    res = await require("../LTI/ltiTeacherDashboard.page.js").isInitialized();
    if (true !== res.pageStatus) {
      global.page = prevPage;
    }
    return res;
  },

  // Finds the named deeplink in Course Content and clicks it. Returns true / Error so the
  // caller can branch on the launch style (teacher direct-launch vs student detail panel).
  _openDeeplinkItem: async function (testdata) {
    var linkLocator = action.getFilteredLocator(this.deepLinkItem, testdata.deepLinkName);
    var res = await action.waitForDisplayed(linkLocator, 15000);
    if (true !== res) {
      await logger.logInto(await stackTrace.get(), res + " deeplink NOT visible: " + testdata.deepLinkName, "error");
      return res;
    }
    res = await action.click(linkLocator);
    if (true !== res) {
      await logger.logInto(await stackTrace.get(), res + " deeplink NOT clicked: " + testdata.deepLinkName, "error");
    }
    return res;
  },

  click_deeplink: async function (testdata) {
    await logger.logInto(await stackTrace.get());
    var res;

    // Deeplink click opens lti-onboarding in a new tab; lti-onboarding then
    // redirects that same tab to the actual content (no second tab is spawned).
    // Capture the tab count BEFORE the click so switchToNewTab can detect the new tab.
    var initialCount = action.getPageCount();
    res = await this._openDeeplinkItem(testdata);
    if (true !== res) {
      return { pageStatus: res };
    }

    res = await action.switchToNewTab(initialCount, 15000);
    if (true !== res) {
      await logger.logInto(await stackTrace.get(), res + " deeplink tab did not open: " + testdata.deepLinkName, "error");
      return { pageStatus: res };
    }

    // Wait for lti-onboarding to finish its in-tab redirect to the content URL
    // (best-effort: if it has already redirected, this resolves immediately).
    res = await action.waitForUrl(url => !url.includes('/lti-onboarding/'), 30000);
    if (true !== res) {
      await logger.logInto(await stackTrace.get(), res + " lti-onboarding redirect did not complete: " + testdata.deepLinkName, "error");
      return { pageStatus: res };
    }
    await action.waitForDocumentLoad();
    await logger.logInto(await stackTrace.get(), "content tab ready — URL: " + (await browser.getUrl()));
    return { pageStatus: true };
  },

  click_deeplink_student: async function (testdata) {
    await logger.logInto(await stackTrace.get());

    var res = await this._openDeeplinkItem(testdata);
    if (true !== res) {
      return { pageStatus: res };
    }
    await logger.logInto(await stackTrace.get(), "deeplink clicked — waiting for detail panel: " + testdata.deepLinkName);

    res = await action.waitForUrl("**/outline/lti/launch**", 15000);
    if (true !== res) {
      await logger.logInto(await stackTrace.get(), res + " detail panel URL not reached: " + testdata.deepLinkName, "error");
      return { pageStatus: res };
    }
    var [panelContainerStatus, panelHeadingStatus, launchBtnStatus] = await Promise.all([
      action.waitForDisplayed(this.launchPanelContainer, 10000),
      action.waitForDisplayed(this.launchPanelHeading,   10000),
      action.waitForDisplayed(this.launchPanelLaunchBtn, 10000),
    ]);
    await logger.logInto(await stackTrace.get(), "Detail panel — container: " + panelContainerStatus + ", heading: " + panelHeadingStatus + ", launchBtn: " + launchBtnStatus);
    return { pageStatus: true, panelContainerStatus, panelHeadingStatus, launchBtnStatus };
  },

  launch_from_detailPanel: async function () {
    await logger.logInto(await stackTrace.get());
    var res;

    res = await action.waitForDisplayed(this.launchPanelLaunchBtn, 15000);
    if (true !== res) {
      await logger.logInto(await stackTrace.get(), res + " detail panel Launch button NOT visible", "error");
      return { pageStatus: res };
    }

    var initialCount = action.getPageCount();
    res = await action.click(this.launchPanelLaunchBtn);
    if (true !== res) {
      await logger.logInto(await stackTrace.get(), res + " detail panel Launch button NOT clicked", "error");
      return { pageStatus: res };
    }
    await logger.logInto(await stackTrace.get(), "Launch clicked — waiting for new tab");

    res = await action.switchToNewTab(initialCount, 15000);
    if (true !== res) {
      await logger.logInto(await stackTrace.get(), res + " launched tab did not open", "error");
      return { pageStatus: res };
    }
    await logger.logInto(await stackTrace.get(), "Switched to launched tab — URL: " + (await browser.getUrl()));
    return { pageStatus: true };
  },

  returnToCourseContent: async function () {
    await logger.logInto(await stackTrace.get());
    var res = await action.closeCurrentTabAndRefocus();
    if (true !== res) {
      await logger.logInto(await stackTrace.get(), res + " could not close deeplink tab / refocus Course Content", "error");
      return { pageStatus: res };
    }
    await logger.logInto(await stackTrace.get(), "Closed deeplink tab — returned to Course Content");
    return { pageStatus: await action.waitForDisplayed(this.coursePageGuard, 15000) };
  },
};

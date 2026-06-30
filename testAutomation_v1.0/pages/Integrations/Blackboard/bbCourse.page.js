"use strict";
var action = require("../../../core/actionLibrary/baseActionLibrary.js");
var selectorFile = jsonParserUtil.jsonParser(selectorDir);

module.exports = {
  courseCard: selectorFile.css.Blackboard.bbCourse.courseCard,
  courseGuard: selectorFile.css.Blackboard.bbCourse.courseGuard,

  isInitialized: async function () {
    var res;
    await logger.logInto(await stackTrace.get());
    await action.waitForDocumentLoad();
    res = { pageStatus: await action.waitForDisplayed(this.courseGuard, 30000) };
    return res;
  },

  // Opens a course from the listing. Named open_* (not click_*) because BB's
  // .base-courses-container intercepts pointer events, so we read the card's id and
  // navigate to its outline URL directly rather than clicking the card.
  open_course: async function (testdata) {
    await logger.logInto(await stackTrace.get());
    var res;

    // Navigate to courses listing (after login BB lands on /ultra/stream)
    try {
      await browser.url(appUrl);
    } catch (err) {
      await logger.logInto(await stackTrace.get(), err + " failed to navigate to courses listing", "error");
      return { pageStatus: err };
    }

    res = await action.waitForDisplayed(this.courseGuard, 30000);
    if (true !== res) {
      await logger.logInto(await stackTrace.get(), res + " courses listing not loaded", "error");
      return { pageStatus: res };
    }
    await logger.logInto(await stackTrace.get(), "courses listing loaded");

    // Find the specific course card by name from testdata, then derive its outline URL.
    // Build the URL from the app ORIGIN (scheme+host) so it does not depend on appUrl
    // ending in a specific path like /ultra/course — survives env URL-format changes.
    var courseId, courseUrl;
    try {
      var courseName = testdata && testdata.courseName;
      var cardLocator = courseName
        ? action.getFilteredLocator(this.courseCard, courseName)
        : this.courseCard;
      courseId = (await action.getAttribute(cardLocator, "id")).replace("course-link-", "");
      courseUrl = new URL(appUrl).origin + "/ultra/courses/" + courseId + "/outline";
      await logger.logInto(await stackTrace.get(), "navigating to course outline: " + courseUrl);
      await browser.url(courseUrl);
      res = true;
    } catch (err) {
      res = err;
    }

    if (true == res) {
      res = await require("./bbCoursePage.page.js").isInitialized();
    } else {
      await logger.logInto(await stackTrace.get(), res + " courseCard navigation failed", "error");
    }
    return res;
  },
};

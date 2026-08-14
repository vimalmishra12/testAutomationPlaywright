"use strict";
var action = require("../../core/actionLibrary/baseActionLibrary.js");
// Selectors resolved at load time from C1Selectors.json → css.ComproC1.schoolAdminDashboard
var selectorFile = jsonParserUtil.jsonParser(selectorDir);

module.exports = {
  firstSchoolLink: selectorFile.css.ComproC1.schoolAdminDashboard.firstSchoolLink,
  teacherAdminToggle: selectorFile.css.ComproC1.schoolAdminDashboard.teacherAdminToggle,
  // Selector TEMPLATE (contains {{key}}) — resolved per school key in click_schoolByKey.
  // Resolves to C1Selectors.json → css.ComproC1.schoolAdminDashboard.schoolLinkByKey
  schoolLinkByKey: selectorFile.css.ComproC1.schoolAdminDashboard.schoolLinkByKey,

  /**
   * Confirms the school admin dashboard ("My school accounts") has loaded.
   * Checks for the first school link [qid="aDashboard-1"] which is unique to this view.
   * Used after school-admin login as a post-login guard — see login.page.js
   * click_login_btn_schoolAdmin and NEMO-24306.
   */
  isInitialized: async function () {
    var res;
    await logger.logInto(await stackTrace.get());
    await action.waitForDocumentLoad();
    res = {
      pageStatus: await action.waitForDisplayed(this.firstSchoolLink)
    };
    return res;
  },

  /**
   * Opens a specific school from "My school accounts" by its school key, then confirms
   * the school Classes page has loaded (schoolClasses.isInitialized).
   *
   * WHY by key, not by position: multiple schools can share the SAME display name
   * (e.g. two "3 July Test School 1" entries with different keys), so the visible
   * name is not unique. The school key IS unique and appears in each card link's
   * aria-label, so we disambiguate on it. The concrete key is test data, so the
   * selector TEMPLATE (schoolLinkByKey, holding {{key}}) is externalised in the
   * selector JSON and only the runtime key value is substituted here — no raw
   * selector literal in this page object.
   */
  click_schoolByKey: async function (schoolKey) {
    await logger.logInto(await stackTrace.get(), "selecting school key: " + schoolKey);
    var res;
    // Substitute the runtime school key into the externalised selector template.
    var selector = this.schoolLinkByKey.replace("{{key}}", schoolKey);
    res = await action.click(selector);
    if (true == res) {
      await logger.logInto(await stackTrace.get(), "school " + schoolKey + " is clicked");
      res = await require("./schoolClasses.page.js").isInitialized();
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + " school " + schoolKey + " is NOT clicked",
        "error"
      );
    }
    return res;
  }
};

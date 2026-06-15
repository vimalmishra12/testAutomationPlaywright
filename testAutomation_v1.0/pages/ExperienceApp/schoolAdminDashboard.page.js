"use strict";
var action = require("../../core/actionLibrary/baseActionLibrary.js");
// Selectors resolved at load time from C1Selectors.json → schoolAdminDashboard (root level)
// Note: this section lives at JSON root (not under css.ComproC1).
var selectorFile = jsonParserUtil.jsonParser(selectorDir);

module.exports = {
  // Resolves to C1Selectors.json → schoolAdminDashboard.firstSchoolLink
  firstSchoolLink: selectorFile.schoolAdminDashboard.firstSchoolLink,
  // Resolves to C1Selectors.json → schoolAdminDashboard.teacherAdminToggle
  teacherAdminToggle: selectorFile.schoolAdminDashboard.teacherAdminToggle,

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
  }
};

"use strict";
var manageReports = require("../../pages/ExperienceApp/manageReports.page.js");
var sts;

module.exports = {
  TST_MRAC_TC_1: async function (testdata) {
    sts = await manageReports.click_manageReports_link();
    await assertion.assertEqual(
      sts.pageStatus,
      true,
      "Manage Reports page is not launched."
    );
  },

  TST_MRAC_TC_2: async function (testdata) {
    sts = await manageReports.verifyDownloadBtnIsButton();
    await assertion.assertEqual(
      sts.isButton,
      true,
      "Accessibility Failure: Download element is NOT a button. tagName: " +
        sts.tagName +
        ", role: " +
        sts.role +
        ". Screen readers will NOT announce it as a button."
    );
  },
};

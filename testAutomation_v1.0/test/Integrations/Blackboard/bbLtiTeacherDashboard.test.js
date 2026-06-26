"use strict";
var bbCoursePage        = require("../../../pages/Integrations/Blackboard/bbCoursePage.page.js");
var ltiTeacherDashboard = require("../../../pages/Integrations/LTI/ltiTeacherDashboard.page.js");
var sts;

module.exports = {
  TST_BBIP1_TC_1: async function (testdata) {
    sts = await bbCoursePage.click_ltiTool();
    await assertion.assertEqual(sts.pageStatus, true, "LTI teacher dashboard did not load after clicking LTI tool");
  },

  TST_BBIP1_TC_2: async function (testdata) {
    sts = await ltiTeacherDashboard.verifyDashboard(testdata);
    await assertion.assertEqual(sts.courseTitleText,      testdata.courseName,     "Course title on teacher dashboard does not match");
    await assertion.assertEqual(sts.schoolNameText,       testdata.schoolName,  "School name on teacher dashboard does not match");
    await assertion.assertEqual(sts.bundleNameText,       testdata.productName, "Product name on teacher dashboard does not match");
    await assertion.assertEqual(sts.markingBtnStatus,     true,                   "Marking button not visible on teacher dashboard");
    await assertion.assertEqual(sts.createLinksBtnStatus, true,                   "Create and manage links button not visible on teacher dashboard");
  },
};

"use strict";
var bbCoursePage = require("../../../pages/Integrations/Blackboard/bbCoursePage.page.js");
var sts;

module.exports = {
  // ── IP3: Teacher — deeplink opens directly in new tab ───────────────────────

  TST_BBIP3_TC_1: async function (testdata) {
    sts = await bbCoursePage.click_deeplink(testdata);
    await assertion.assertEqual(sts.pageStatus, true,
      "PE deeplink tab did not open — deeplink: " + testdata.deepLinkName);
  },

  TST_BBIP3_TC_2: async function (testdata) {
    sts = await bbCoursePage.returnToCourseContent();
    await assertion.assertEqual(sts.pageStatus, true,
      "Course Content page did not reload after closing PE deeplink tab");
  },

  TST_BBIP3_TC_3: async function (testdata) {
    sts = await bbCoursePage.click_deeplink(testdata);
    await assertion.assertEqual(sts.pageStatus, true,
      "Ebook deeplink tab did not open — deeplink: " + testdata.deepLinkName);
  },

  // ── IP4: Student — PE deeplink shows a detail panel, then launches via button.
  //    The ebook deeplink instead launches directly in a new tab (same end-state as
  //    the teacher flow), so the student ebook path reuses TST_BBIP3_TC_3 in the
  //    execution file rather than a detail-panel TC. ──────────────────────────────

  TST_BBIP4_TC_1: async function (testdata) {
    sts = await bbCoursePage.click_deeplink_student(testdata);
    await assertion.assertEqual(sts.pageStatus,          true, "PE deeplink did not load detail panel — deeplink: " + testdata.deepLinkName);
    await assertion.assertEqual(sts.panelContainerStatus, true, "Detail panel container not visible");
    await assertion.assertEqual(sts.panelHeadingStatus,   true, "Detail panel heading not visible");
    await assertion.assertEqual(sts.launchBtnStatus,      true, "Detail panel Launch button not visible");
  },

  TST_BBIP4_TC_2: async function (testdata) {
    sts = await bbCoursePage.launch_from_detailPanel();
    await assertion.assertEqual(sts.pageStatus, true,
      "PE deeplink tab did not open after clicking Launch in detail panel");
  },

  TST_BBIP4_TC_3: async function (testdata) {
    sts = await bbCoursePage.returnToCourseContent();
    await assertion.assertEqual(sts.pageStatus, true,
      "Course Content page did not reload after closing student PE deeplink tab");
  },
};

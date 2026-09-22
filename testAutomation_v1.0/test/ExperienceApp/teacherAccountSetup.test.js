"use strict";
// TSET — teacher "Complete your account" → join a school by key
// (migrated from playwright-automation-c1, 2026-09-22).
var teacherAccountSetup = require("../../pages/ExperienceApp/teacherAccountSetup.page.js");
var sts;

module.exports = {
  // "Complete your account" opens the setup wizard; its welcome tour can be closed.
  TST_TSET_TC_1: async function (testdata) {
    sts = await teacherAccountSetup.click_completeAccount();
    await assertion.assertEqual(sts.pageStatus, true, "Setup wizard did not open, or its welcome tour could not be closed");
    await assertion.assertEqual(sts.teachInSchoolShown, true, "'I teach in a school' option is not shown");
  },

  // "I teach in a school" → "Join a school" reaches the school-key form.
  TST_TSET_TC_2: async function (testdata) {
    sts = await teacherAccountSetup.select_joinSchoolPath();
    await assertion.assertEqual(sts.schoolKeyFormShown, true, "School-key form not reached (stopped at " + sts.failedAt + ")");
  },

  // A valid school key joins the school ("Go to dashboard" success screen).
  TST_TSET_TC_3: async function (testdata) {
    sts = await teacherAccountSetup.set_schoolKey_join(testdata.schoolKey);
    await assertion.assertEqual(sts.joined, true, "Could not join school " + testdata.schoolKey + " (server errors: " + sts.serverErrors + ")");
  },

  // The dashboard header then shows the joined school (casing differs by environment — SOURCE).
  TST_TSET_TC_4: async function (testdata) {
    sts = await teacherAccountSetup.click_goToDashboard_getSchoolName();
    await assertion.assert(
      typeof sts.schoolName === "string" && sts.schoolName.toLowerCase().indexOf(testdata.schoolName.toLowerCase()) !== -1,
      "Dashboard header does not show '" + testdata.schoolName + "': " + sts.schoolName
    );
  },
};

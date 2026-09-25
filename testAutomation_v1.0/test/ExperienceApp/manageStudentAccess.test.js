"use strict";
// MSAC — teacher "Manage student access" (module code agreed with the user 2026-09-23).
// Manual register: test/Manual/C1App/LearningPath/ (LP-031). READ-ONLY: the rule is never created.
var manageStudentAccess = require("../../pages/ExperienceApp/manageStudentAccess.page.js");
var sts;

module.exports = {
  // LP-031: Materials → Manage student access → Create access rule → the component — the Learning Path
  // opens in rule-creation mode with its TOC ("Select all units") and Cancel / Continue. Continue is
  // never clicked, so no rule is created.
  TST_MSAC_TC_1: async function (testdata) {
    sts = await manageStudentAccess.launch_componentInCreateRule(testdata.bundleName, testdata.componentName);
    await assertion.assertEqual(sts.pageShown, true, "'Manage student access' did not open for '" + testdata.bundleName + "'");
    await assertion.assertEqual(sts.pickerShown, true, "Create access rule did not list '" + testdata.componentName + "'");
    await assertion.assertEqual(sts.onRoute, true, "The component did not open the Learning Path in rule-creation mode");
    await assertion.assertEqual(sts.tocShown, true, "The Learning Path TOC did not render in rule creation");
    await assertion.assertEqual(sts.selectAllShown, true, "The rule TOC offers no unit selection");
    await assertion.assertEqual(sts.cancelShown && sts.continueShown, true, "Cancel / Continue are not offered in rule creation");
  },
};

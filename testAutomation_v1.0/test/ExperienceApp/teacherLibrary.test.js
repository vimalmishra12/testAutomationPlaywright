"use strict";
// TLIB — teacher dashboard "My library" (module code agreed with the user 2026-09-23).
// Manual register: test/Manual/C1App/LearningPath/ (LP-032). Read-only.
var teacherLibrary = require("../../pages/ExperienceApp/teacherLibrary.page.js");
var umbrellaProduct = require("../../pages/ExperienceApp/umbrellaProduct.page.js");
var practiceExtra = require("../../pages/ExperienceApp/practiceExtra.page.js");
var sts;

module.exports = {
  // LP-032: My library → search → product → View details → Practice Extra — the Learning Path opens on
  // the teacher route with its TOC rendered.
  TST_TLIB_TC_1: async function (testdata) {
    sts = await teacherLibrary.open_productDetails(testdata.productId, testdata.productTitle);
    await assertion.assertEqual(sts.libraryShown, true, "'My library' did not open");
    await assertion.assertEqual(sts.productListed, true, "'" + testdata.productTitle + "' not found in My library");
    await assertion.assertEqual(sts.detailsShown, true, "'View details' not offered for '" + testdata.productTitle + "'");
    await assertion.assertEqual(sts.materialsShown, true, "The product materials view did not open");
    sts = await umbrellaProduct.launch_componentByName(testdata.componentName);
    await assertion.assertEqual(sts, true, "'" + testdata.componentName + "' could not be launched from the product");
    sts = await practiceExtra.getData_teacherPlayer();
    await assertion.assertEqual(sts.onRoute, true, "The component did not open the teacher Learning Path");
    await assertion.assertEqual(sts.tocShown, true, "The Learning Path TOC did not render for the teacher");
    await assertion.assertEqual(sts.unitShown, true, "The TOC shows no unit");
  },
};

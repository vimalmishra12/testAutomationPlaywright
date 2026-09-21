"use strict";
var classMaterials = require("../../pages/ExperienceApp/classMaterials.page.js");

var sts;

module.exports = {
  TST_CMAT_TC_1: async function () {
    sts = await classMaterials.click_materialsTab();
    await assertion.assertEqual(
      sts.pageStatus,
      true,
      "Class Materials tab was not loaded successfully."
    );
  },

  TST_CMAT_TC_2: async function (testdata) {
    sts = await classMaterials.isBundleDisplayed(testdata);
    await assertion.assertEqual(
      sts.bundleDisplayed,
      true,
      "Product bundle is not displayed in Class Materials."
    );
  },

  TST_CMAT_TC_3: async function (testdata) {
    sts = await classMaterials.click_component(testdata);
    await assertion.assertEqual(
      sts.pageStatus,
      true,
      "Failed to click the learning material component in Class Materials."
    );
  }
};

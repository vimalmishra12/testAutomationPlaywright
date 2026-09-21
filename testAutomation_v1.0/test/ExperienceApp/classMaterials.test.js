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
  },

  TST_CMAT_TC_4: async function (testdata) {
    sts = await classMaterials.click_folder(testdata);
    await assertion.assertEqual(
      sts.pageStatus,
      true,
      "Failed to click folder component in Class Materials."
    );
  },

  TST_CMAT_TC_5: async function (testdata) {
    sts = await classMaterials.click_resourceBankInFolder(testdata);
    await assertion.assertEqual(
      sts.pageStatus,
      true,
      "Failed to click Resource Bank component in folder."
    );
  },

  TST_CMAT_TC_6: async function () {
    sts = await classMaterials.click_categoryBack();
    await assertion.assertEqual(
      sts.pageStatus,
      true,
      "Failed to navigate back from folder to product materials."
    );
  }
};

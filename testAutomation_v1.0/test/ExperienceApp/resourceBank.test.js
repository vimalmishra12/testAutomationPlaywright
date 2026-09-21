"use strict";
var resourceBank = require("../../pages/ExperienceApp/resourceBank.page.js");

var sts;

module.exports = {
  TST_RBNK_TC_1: async function (testdata) {
    sts = await resourceBank.isInitialized();
    await assertion.assertEqual(
      sts.pageStatus,
      true,
      "Resource Bank Resources area page is not displayed."
    );

    if (testdata && testdata.expectedHeading) {
      var headerData = await resourceBank.getData_header();
      await assertion.assertEqual(
        headerData.heading.includes(testdata.expectedHeading),
        true,
        "Resource Bank header text mismatch. Expected: " + testdata.expectedHeading + " but got: " + headerData.heading
      );
    }
  }
};

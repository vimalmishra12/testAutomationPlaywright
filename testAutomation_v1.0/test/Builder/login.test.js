"use strict";
var login = require("../../pages/Builder/login.page.js");
var sts;

module.exports = {
  // Confirms the Builder pre-login page has loaded (org selector present).
  TST_BLOGI_TC_1: async function (testdata) {
    sts = await login.isInitialized();
    await assertion.assertEqual(sts.pageStatus, true, "Builder pre-login page is not launched.");
  },

  // Drives the full SSO login (org → confirm → IdP credentials) and asserts the
  // Builder landing page loads.
  TST_BLOGI_TC_2: async function (testdata) {
    sts = await login.login(testdata);
    await assertion.assertEqual(sts.pageStatus, true, "Builder landing did not load after login.");
  },
};

"use strict";
var bbLogin = require("../../../pages/Integrations/Blackboard/bbLogin.page.js");
var sts;

module.exports = {
  TST_BBLG_TC_1: async function (testdata) {
    sts = await bbLogin.click_privacyCookiesOkBtn();
    await assertion.assertEqual(sts, true, "privacyCookiesOkBtn was not clicked");
  },

  TST_BBLG_TC_2: async function (testdata) {
    sts = await bbLogin.set_usernameTbox(testdata.username);
    await assertion.assertEqual(sts, true, "usernameTbox value was not set");
  },

  TST_BBLG_TC_3: async function (testdata) {
    sts = await bbLogin.set_passwordTbox(testdata.password);
    await assertion.assertEqual(sts, true, "passwordTbox value was not set");
  },

  TST_BBLG_TC_4: async function (testdata) {
    sts = await bbLogin.click_signInBtn();
    await assertion.assertEqual(sts.pageStatus, true, "BB login failed — post-login page did not load");
  },
};

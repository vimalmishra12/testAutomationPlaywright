"use strict";
var ltiTeacherDashboard = require("../../../pages/Integrations/LTI/ltiTeacherDashboard.page.js");
var ltiPEPage           = require("../../../pages/Integrations/LTI/ltiPEPage.page.js");
var ltiComponentPage    = require("../../../pages/Integrations/LTI/ltiComponentPage.page.js");
var sts;

module.exports = {
  TST_LTI_IP2_TC_1: async function (testdata) {
    var dashboardUrl = await ltiTeacherDashboard.getDashboardUrl();
    sts = await ltiTeacherDashboard.click_component(testdata);
    await assertion.assertEqual(sts.pageStatus, true,
      "Component page did not load — umbrella: " + testdata.umbrellaName + ", component: " + testdata.componentName);
    var peState = await ltiPEPage.getData_peState(testdata);
    await assertion.assertEqual(peState.backBtnStatus,    true,              "Back button not visible — LTI launch context not established");
    await assertion.assertEqual(peState.teacherModeUrl,   true,              "PE page did not open in teacher mode — URL missing /teacher/");
    await assertion.assertEqual(peState.tocStatus,        true,              "TOC not visible on PE component page");
    await assertion.assertEqual(peState.tocHeadingStatus, true,              "TOC heading not visible after expanding sidebar");
    await assertion.assertEqual(peState.tocHeadingText,   testdata.unitName, "TOC heading text does not match expected unit name");
    await assertion.assertEqual(peState.tocItemCount > 0, true,              "TOC has no lesson items");
    await assertion.assertEqual(peState.iframeStatus,     true,              "Activity iframe not loaded on PE component page");
    await ltiTeacherDashboard.returnToDashboard(dashboardUrl);
  },

  TST_LTI_IP2_TC_2: async function (testdata) {
    var dashboardUrl = await ltiTeacherDashboard.getDashboardUrl();
    sts = await ltiTeacherDashboard.click_component(testdata);
    await assertion.assertEqual(sts.pageStatus, true,
      "Component page did not load — umbrella: " + testdata.umbrellaName + ", component: " + testdata.componentName);
    var ebookState = await ltiComponentPage.getData_ebookState();
    await assertion.assertEqual(ebookState.ebookGuardStatus, true, "Ebook viewer not visible on component page");
    await assertion.assertEqual(ebookState.toolbarStatus,    true, "Ebook toolbar not visible on component page");
    await assertion.assertEqual(ebookState.focUrl,           true, "Ebook URL does not contain /foc/");
    await ltiTeacherDashboard.returnToDashboard(dashboardUrl);
  },
};

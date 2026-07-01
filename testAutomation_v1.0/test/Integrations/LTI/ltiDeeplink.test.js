"use strict";
var ltiDeeplinkPage = require("../../../pages/Integrations/LTI/ltiDeeplinkPage.page.js");
var ltiComponentPage = require("../../../pages/Integrations/LTI/ltiComponentPage.page.js");
var sts;

module.exports = {
  // ── PE deeplink page verification ───────────────────────────────────────────

  TST_LTI_PEDL_TC_1: async function (testdata) {
    sts = await ltiDeeplinkPage.isInitialized();
    await assertion.assertEqual(sts.pageStatus,      true,  "PE deeplink page did not initialize — activity iframe not loaded within timeout");
    sts = await ltiDeeplinkPage.getData_peDeeplinkState();
    await assertion.assertEqual(sts.iframeStatus,  true,  "Activity iframe not loaded on teacher PE deeplink page");
    await assertion.assertEqual(sts.backBtnStatus, false, "Back button should not be present on teacher PE deeplink page");
    await assertion.assertEqual(sts.urlStatus,     true,  "Page URL still on /lti-onboarding/ for teacher PE deeplink");
    // Teacher view carries no student progress — expand the TOC, then confirm no scores.
    // Short timeout: no score will ever appear, so don't wait the full student budget.
    await ltiDeeplinkPage.expand_peToc();
    sts = await ltiDeeplinkPage.getData_peTocScores(3000);
    await assertion.assertEqual(sts.scorePresent, false, "Teacher PE deeplink TOC should NOT show activity scores (student-only state)");
  },

  TST_LTI_PEDL_TC_2: async function (testdata) {
    sts = await ltiDeeplinkPage.isInitialized();
    await assertion.assertEqual(sts.pageStatus, true, "Student PE deeplink page did not initialize — activity iframe not loaded within timeout");
    sts = await ltiDeeplinkPage.getData_peDeeplinkState();
    await assertion.assertEqual(sts.iframeStatus,  true,  "Activity iframe not loaded on student PE deeplink page");
    await assertion.assertEqual(sts.backBtnStatus, false, "Back button should not be present on student PE deeplink page");
    await assertion.assertEqual(sts.urlStatus,     true,  "Page URL still on /lti-onboarding/ for student PE deeplink");
    // Student view retains prior progress — expand the TOC, then confirm scores show.
    await ltiDeeplinkPage.expand_peToc();
    sts = await ltiDeeplinkPage.getData_peTocScores();
    await assertion.assertEqual(sts.scorePresent, true, "Student PE deeplink TOC should show retained activity scores");
  },

  // ── Ebook deeplink page verification ────────────────────────────────────────

  TST_LTI_EBKDL_TC_1: async function (testdata) {
    sts = await ltiComponentPage.isInitialized();
    await assertion.assertEqual(sts.pageStatus, true, "Ebook viewer did not initialize on deeplink ebook page");
    sts = await ltiComponentPage.getData_ebookState();
    await assertion.assertEqual(sts.ebookGuardStatus, true, "Ebook viewer guard not visible on deeplink ebook page");
    await assertion.assertEqual(sts.toolbarStatus,    true, "Toolbar not visible on deeplink ebook page");
    await assertion.assertEqual(sts.focUrl,        true,  "Ebook deeplink URL does not contain /foc/ — not on ebook viewer page");
    await assertion.assertEqual(sts.backBtnStatus, false, "Back button should not be present on ebook deeplink page");
  },
};

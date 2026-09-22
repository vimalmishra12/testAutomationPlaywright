"use strict";
// PEXT — Learning Path / Practice Extra player (migrated from playwright-automation-c1
// lp-scenarios TC-LP-001…006, 2026-09-22). Manual register: test/Manual/C1App/LearningPath/.
var practiceExtra = require("../../pages/ExperienceApp/practiceExtra.page.js");
var sts;

module.exports = {
  // LP-001: the activity player (iframe) is shown on entry. The TOC is NOT asserted: it opens by
  // itself only on a learner's first entry (prod, 2026-09-22), and LP-001's expected result is the player.
  TST_PEXT_TC_1: async function (testdata) {
    sts = await practiceExtra.getData_player();
    await assertion.assertEqual(sts.iframeShown, true, "Learning Path activity player (iframe) not shown");
  },

  // LP-002: Frame 1 — answer its dropdown, then Check.
  TST_PEXT_TC_4: async function (testdata) {
    sts = await practiceExtra.answer_frame(testdata.frame, testdata.answers);
    await assertion.assertEqual(sts.frameShown, true, "Frame " + (testdata.frame + 1) + " of the scorable activity not shown");
    await assertion.assertEqual(sts.filledCount, testdata.answers.length, "Not every Frame " + (testdata.frame + 1) + " dropdown registered its answer");
    await assertion.assertEqual(sts.checked, true, "Check could not be clicked");
  },

  // LP-003: Next → the following frame; answer all its dropdowns, then Check (frames 2, 3, 4).
  TST_PEXT_TC_5: async function (testdata) {
    sts = await practiceExtra.click_next();
    await assertion.assertEqual(sts, true, "Next could not be clicked");
    sts = await practiceExtra.answer_frame(testdata.frame, testdata.answers);
    await assertion.assertEqual(sts.frameShown, true, "Frame " + (testdata.frame + 1) + " of the scorable activity not shown after Next");
    await assertion.assertEqual(sts.filledCount, testdata.answers.length, "Not every Frame " + (testdata.frame + 1) + " dropdown registered its answer");
    await assertion.assertEqual(sts.checked, true, "Check could not be clicked");
  },

  // LP-003: Frame 3 — same flow as TC_5 with four dropdowns (data-driven).
  TST_PEXT_TC_6: async function (testdata) {
    await module.exports.TST_PEXT_TC_5(testdata);
  },

  // LP-003: Frame 4 — same flow as TC_5 with four dropdowns (data-driven).
  TST_PEXT_TC_7: async function (testdata) {
    await module.exports.TST_PEXT_TC_5(testdata);
  },

  // LP-003: the last Next shows the full score.
  TST_PEXT_TC_8: async function (testdata) {
    sts = await practiceExtra.click_next();
    await assertion.assertEqual(sts, true, "Next could not be clicked");
    sts = await practiceExtra.getData_score();
    await assertion.assert(
      typeof sts.scoreText === "string" && sts.scoreText.toLowerCase().indexOf(testdata.expected.toLowerCase()) !== -1,
      "Score screen does not read '" + testdata.expected + "': " + sts.scoreText
    );
  },

  // Housekeeping (TC_100+): TOC closed, whatever state the player opened in.
  TST_PEXT_TC_100: async function (testdata) {
    sts = await practiceExtra.ensure_tocClosed();
    await assertion.assertEqual(sts.tocClosed, true, "Could not bring the TOC sidebar to the closed state");
  },

  // LP-005: the open-sidebar control shows the TOC.
  TST_PEXT_TC_2: async function (testdata) {
    sts = await practiceExtra.click_openToc();
    await assertion.assertEqual(sts.tocShown, true, "TOC sidebar did not open");
  },

  // LP-006: the close control hides the TOC.
  TST_PEXT_TC_3: async function (testdata) {
    sts = await practiceExtra.click_closeToc();
    await assertion.assertEqual(sts.tocHidden, true, "TOC sidebar did not close");
  },
};

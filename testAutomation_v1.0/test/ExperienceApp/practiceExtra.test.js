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

  // ---- LP batch 2 (2026-09-23) — expected results as observed live on production ----

  // Housekeeping (TC_100+): TOC open at the UNIT view, whatever view it opened in.
  TST_PEXT_TC_101: async function (testdata) {
    sts = await practiceExtra.ensure_tocUnitView();
    await assertion.assertEqual(sts.unitView, true, "Could not bring the TOC to its unit view");
  },

  // LP-007: drilling into a unit reveals its activities.
  TST_PEXT_TC_9: async function (testdata) {
    sts = await practiceExtra.click_tocUnit(testdata.unit);
    await assertion.assertEqual(sts.lessonView, true, "Unit '" + testdata.unit + "' did not open its lesson view");
    await assertion.assertEqual(sts.unitListHidden, true, "The unit list is still shown after drilling into the unit");
    sts = await practiceExtra.getData_tocActivities(testdata.activities);
    await assertion.assertEqual(sts.shown.join(" | "), testdata.activities.join(" | "), "Not every activity of the unit is listed");
  },

  // LP-026: the lesson accordion collapses and expands its activities; "Go to unit view" goes back up a
  // level, and drilling in again returns to the same lesson with the same activities (context kept).
  TST_PEXT_TC_25: async function (testdata) {
    sts = await practiceExtra.toggle_tocLesson(testdata.lesson, testdata.probeActivity);
    await assertion.assertEqual(sts.wasShown, true, "Lesson '" + testdata.lesson + "' was not expanded to begin with");
    await assertion.assertEqual(sts.isShown, false, "Lesson '" + testdata.lesson + "' did not collapse");
    sts = await practiceExtra.toggle_tocLesson(testdata.lesson, testdata.probeActivity);
    await assertion.assertEqual(sts.isShown, true, "Lesson '" + testdata.lesson + "' did not expand again");
    sts = await practiceExtra.click_goToUnitView();
    await assertion.assertEqual(sts.unitView, true, "'Go to unit view' did not show the unit list");
    await assertion.assertEqual(sts.lessonViewHidden, true, "The lesson view is still shown after 'Go to unit view'");
    sts = await practiceExtra.click_tocUnit(testdata.unit);
    await assertion.assertEqual(sts.lessonView, true, "Drilling into '" + testdata.unit + "' again did not open its lesson view");
    sts = await practiceExtra.getData_tocActivities(testdata.activities);
    await assertion.assertEqual(sts.shown.join(" | "), testdata.activities.join(" | "), "The lesson did not come back with the same activities");
  },

  // LP-019: activating the open control again while the TOC is open (keyboard — the open sidebar
  // covers it for a mouse). Observed: it is a TOGGLE — the TOC closes, and a further activation opens
  // it again; there is never more than one sidebar. Ends with the TOC open.
  TST_PEXT_TC_19: async function (testdata) {
    sts = await practiceExtra.keyboard_toggleToc();
    await assertion.assertEqual(sts.wasOpen, true, "Precondition: the TOC was not open");
    await assertion.assertEqual(sts.pressed, true, "The open control could not be activated from the keyboard");
    await assertion.assertEqual(sts.isOpen, false, "Activating the open control while open did not toggle the TOC closed");
    sts = await practiceExtra.keyboard_toggleToc();
    await assertion.assertEqual(sts.isOpen, true, "Activating the open control again did not re-open the TOC");
    await assertion.assertEqual(sts.visibleSidebars, 1, "More than one TOC sidebar is visible");
  },

  // LP-008: Flashcards opens from the TOC — the deck loads in the player.
  TST_PEXT_TC_10: async function (testdata) {
    sts = await practiceExtra.open_tocActivity(testdata.activity);
    await assertion.assertEqual(sts.title, testdata.activity, "The player did not switch to '" + testdata.activity + "'");
    sts = await practiceExtra.getData_deck();
    await assertion.assertEqual(sts.loaded, true, "The flashcard deck did not load in the player");
  },

  // LP-009: the deck pages from its first card to its last, and no grading control is ever offered.
  TST_PEXT_TC_11: async function (testdata) {
    sts = await practiceExtra.page_deckToEnd();
    await assertion.assertEqual(sts.stuckAt, null, "The deck stopped advancing at " + sts.stuckAt);
    await assertion.assert(sts.steps >= 2, "Deck has " + sts.steps + " card(s) — nothing to page through");
    await assertion.assertEqual(sts.startIndex, 0, "The deck was not paged from its first card");
    await assertion.assertEqual(sts.endIndex, sts.steps - 1, "The deck did not reach its last card");
    await assertion.assertEqual(sts.paged, sts.steps - 1, "Not every card was reached by one Next");
    await assertion.assertEqual(sts.gradingSeen, false, "A grading (Check) control was offered by the non-scorable deck");
  },

  // LP-010: PS opens from the TOC on its free-text answer screen.
  TST_PEXT_TC_12: async function (testdata) {
    sts = await practiceExtra.open_tocActivity(testdata.activity);
    await assertion.assertEqual(sts.title, testdata.activity, "The player did not switch to '" + testdata.activity + "'");
    sts = await practiceExtra.getData_psScreen();
    await assertion.assertEqual(sts.editorShown, true, "The PS answer editor is not shown");
    await assertion.assertEqual(sts.submitShown, true, "The PS Submit button is not shown");
  },

  // LP-014: with an empty editor Submit is disabled — clicking it opens no "Ready to submit?" dialog.
  TST_PEXT_TC_16: async function (testdata) {
    sts = await practiceExtra.click_psSubmitWhenEmpty();
    await assertion.assertEqual(sts.editorEmpty, true, "Precondition: the PS editor is not empty");
    await assertion.assert(/\bdisabled\b/.test(sts.submitClass || ""), "Submit is not disabled with an empty answer (class: " + sts.submitClass + ")");
    await assertion.assertEqual(sts.dialogShown, false, "An empty answer opened the 'Ready to submit?' dialog");
    await assertion.assertEqual(sts.attemptedShown, false, "An empty answer was submitted");
  },

  // LP-011: type → Submit → confirm → the submitted-answer state. ONE ATTEMPT PER LEARNER.
  TST_PEXT_TC_13: async function (testdata) {
    sts = await practiceExtra.submit_ps(testdata.answer);
    await assertion.assertEqual(sts.typed, true, "The answer could not be typed into the PS editor");
    await assertion.assertEqual(sts.submitEnabled, true, "Submit did not become enabled after typing an answer");
    await assertion.assertEqual(sts.confirmShown, true, "The 'Ready to submit?' dialog did not open");
    await assertion.assertEqual(sts.confirmClosed, true, "The 'Ready to submit?' dialog did not close after Submit");
    await assertion.assertEqual(sts.attemptedShown, true, "The submitted-answer state is not shown after submitting");
    await assertion.assertEqual(sts.attemptedText, testdata.answer, "The submitted answer shown is not the one typed");
  },

  // LP-015: back on the submitted PS, the answer is shown and no fresh submission is offered.
  TST_PEXT_TC_17: async function (testdata) {
    sts = await practiceExtra.revisit_activity(testdata.away, testdata.activity);
    await assertion.assertEqual(sts.awayTitle, testdata.away, "Could not leave the PS for '" + testdata.away + "'");
    await assertion.assertEqual(sts.backTitle, testdata.activity, "Could not return to '" + testdata.activity + "'");
    await assertion.assertEqual(sts.attemptedShown, true, "The submitted answer is not shown on return");
    await assertion.assertEqual(sts.attemptedText, testdata.answer, "The answer shown on return is not the one submitted");
    await assertion.assertEqual(sts.editorShown, false, "The answer editor is offered again on a submitted PS");
    await assertion.assertEqual(sts.submitShown, false, "Submit is offered again on a submitted PS");
  },

  // LP-018: closing the lesson view closes the TOC only — the learner stays in the Learning Path.
  TST_PEXT_TC_18: async function (testdata) {
    sts = await practiceExtra.click_closeLessonView();
    await assertion.assertEqual(sts.wasLessonView, true, "Precondition: the TOC was not on its lesson view");
    await assertion.assertEqual(sts.tocHidden, true, "The lesson-view close control did not close the TOC");
    await assertion.assertEqual(sts.inLearningPath, true, "Closing the lesson view took the learner out of the Learning Path");
    await assertion.assertEqual(sts.sameActivity, true, "Closing the lesson view changed the current activity");
  },

  // Housekeeping (TC_100+): TOC open at the lesson view of the unit (the open control remembers the last view).
  TST_PEXT_TC_102: async function (testdata) {
    sts = await practiceExtra.ensure_tocLessonView(testdata.unit);
    await assertion.assertEqual(sts.lessonView, true, "Could not bring the TOC to the lesson view of '" + testdata.unit + "'");
  },

  // LP-013: nothing chosen on frame 1 → Check is not offered at all (it renders on the first selection,
  // which TST_PEXT_TC_4 then proves). Runs BEFORE TC_4 in the learner's one attempt — consumes nothing.
  TST_PEXT_TC_15: async function (testdata) {
    sts = await practiceExtra.getData_frameCheckState(testdata.frame);
    await assertion.assertEqual(sts.frameShown, true, "Frame " + (testdata.frame + 1) + " of the scorable activity not shown");
    await assertion.assertEqual(sts.filledCount, 0, "Precondition: an option is already chosen on frame " + (testdata.frame + 1));
    await assertion.assertEqual(sts.checkShown, false, "Check is offered although no option has been chosen");
  },

  // LP-025: after frame 1 is checked, leave the scorable for another activity and reopen it — the TOC shows
  // it "in progress" (not complete/scored) and it reopens on the frame where it was left, with the answer
  // kept, so the attempt can continue. [user 2026-09-23] The sheet's "Saved" means exactly that re-landing;
  // the TOC label itself is "Activity status: in progress".
  TST_PEXT_TC_24: async function (testdata) {
    sts = await practiceExtra.leave_and_relaunch(testdata.activity, testdata.away, testdata.frame, testdata.unit);
    await assertion.assertEqual(sts.awayTitle, testdata.away, "Could not leave the scorable for '" + testdata.away + "'");
    await assertion.assertEqual(sts.statusWhileAway, testdata.statusWhileAway, "The unfinished scorable's TOC status is wrong while away");
    await assertion.assertEqual(sts.backTitle, testdata.activity, "Could not reopen '" + testdata.activity + "'");
    await assertion.assertEqual(sts.frameShown, true, "The reopened scorable is not on frame " + (testdata.frame + 1));
    await assertion.assertEqual(sts.filledCount, testdata.answerCount, "The frame's answer was not kept");
    await assertion.assertEqual(sts.correctCount, testdata.answerCount, "The frame's checked (correct) state was not kept");
    await assertion.assertEqual(sts.nextShown, true, "The reopened scorable cannot continue (no Next)");
  },

  // LP-021: the HTML activity completes by itself — no submit: its TOC status becomes "viewed" and the
  // unit's "N/M Completed" goes up by one. Starts and ends with the TOC open (lesson view in, unit view out).
  TST_PEXT_TC_20: async function (testdata) {
    sts = await practiceExtra.click_goToUnitView();
    await assertion.assertEqual(sts.unitView, true, "Could not show the TOC unit view");
    var before = await practiceExtra.getData_unitProgress();
    await assertion.assert(before.done >= 0, "Unit completion counter not readable: " + before.text);
    sts = await practiceExtra.click_tocUnit(testdata.unit);
    await assertion.assertEqual(sts.lessonView, true, "Could not open unit '" + testdata.unit + "'");
    sts = await practiceExtra.open_activityAndWaitStatus(testdata.activity, testdata.status);
    await assertion.assertEqual(sts.title, testdata.activity, "The player did not switch to '" + testdata.activity + "'");
    await assertion.assertEqual(sts.iframeShown, true, "The HTML activity did not load in the player");
    await assertion.assertEqual(sts.statusAfter, testdata.status, "The HTML activity did not complete by itself (status: " + sts.statusAfter + ")");
    sts = await practiceExtra.click_goToUnitView();
    await assertion.assertEqual(sts.unitView, true, "Could not return to the TOC unit view");
    var after = await practiceExtra.getData_unitProgress();
    await assertion.assertEqual(after.done, before.done + 1, "Unit completion did not go up by one (" + before.text + " → " + after.text + ")");
  },

  // LP-022: NEXT ACTIVITY from the HTML activity lands on the downloadable PDF — a download page (not the
  // PDF itself), and landing marks it "viewed" with no download and no submit. Download is never clicked.
  TST_PEXT_TC_21: async function (testdata) {
    sts = await practiceExtra.open_nextActivityDownload(testdata.activity, testdata.status);
    await assertion.assert(sts.statusBefore !== testdata.status, "Precondition: '" + testdata.activity + "' was already '" + testdata.status + "' before landing on it");
    await assertion.assertEqual(sts.title, testdata.activity, "NEXT ACTIVITY did not land on '" + testdata.activity + "'");
    await assertion.assertEqual(sts.pageShown, true, "The download page of '" + testdata.activity + "' is not shown");
    await assertion.assertEqual(sts.instructions, testdata.instructions, "Unexpected download instructions");
    await assertion.assertEqual(sts.fileName, testdata.fileName, "Unexpected file name on the download page");
    await assertion.assertEqual(sts.downloadShown, true, "No Download link is offered");
    await assertion.assertEqual(sts.statusAfter, testdata.status, "Landing on the PDF did not mark it viewed");
  },

  // LP-018 (appended 2026-09-23): the way OUT of the Learning Path is the player's Back link → dashboard.
  TST_PEXT_TC_26: async function (testdata) {
    sts = await practiceExtra.click_back();
    await assertion.assertEqual(sts.onDashboard, true, "Back did not return the learner to the dashboard");
  },
};

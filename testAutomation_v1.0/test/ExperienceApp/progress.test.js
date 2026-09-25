"use strict";
// PROG — progress views for a learner's SUBMITTED Learning Path activities (LP-034, user request 2026-09-23).
// Runs after Suites 7–8 of learningPath.json, whose submissions are identical every full run, so the
// expected figures are fixed (learningPathData.json C1.progressAfterRun). Manual register:
// test/Manual/C1App/LearningPath/. Read-only.
var dashboard = require("../../pages/ExperienceApp/dashboard.page.js");
var progress = require("../../pages/ExperienceApp/progress.page.js");
var sts;

// Every expected phrase must appear in the block's text (text is whitespace-normalised).
async function assertPhrases(text, phrases, label) {
  await assertion.assert(typeof text === "string", label + " is not shown");
  for (var i = 0; i < phrases.length; i++) {
    await assertion.assert(text.indexOf(phrases[i]) !== -1, label + " does not show '" + phrases[i] + "': " + text);
  }
}

// One row per activity: its phrases and (where known) its status icon label.
async function assertActivityRows(rows, expected, who) {
  for (var i = 0; i < expected.length; i++) {
    var e = expected[i];
    var row = rows[e.name] || {};
    await assertPhrases(row.text, e.text, who + " progress row '" + e.name + "'");
    if (e.status) await assertion.assertEqual(row.status, e.status, who + " progress row '" + e.name + "' has the wrong status");
  }
}

module.exports = {
  // LP-034: the learner's class card "My progress" counts the submitted activities — overall and per component.
  // The summary totals are updated by a batch job minutes after the submissions (user-confirmed expected,
  // 2026-09-24), so the page is re-read (reload every reloadEveryMs, up to settleTimeoutMs) until they settle.
  TST_PROG_TC_1: async function (testdata) {
    sts = await dashboard.click_classMyProgress(testdata.className);
    await assertion.assertEqual(sts.opened, true, "'My progress' of class '" + testdata.className + "' did not open");
    sts = await progress.getData_aggregatedProgressSettled(testdata.learnerSummary, testdata.learnerComponents, testdata.settleTimeoutMs, testdata.reloadEveryMs);
    await logger.logInto(await stackTrace.get(), "My progress settled=" + sts.settled + " after " + sts.waitedMs + " ms (" + sts.attempts + " reads)");
    await assertion.assertEqual(sts.title, "My progress", "The My progress page is not shown");
    await assertPhrases(sts.summary, testdata.learnerSummary, "Learner progress summary");
    for (var name in testdata.learnerComponents) {
      await assertPhrases(sts.components[name], testdata.learnerComponents[name], "Learner progress of '" + name + "'");
    }
  },

  // LP-034: the learner's per-activity progress (product → component) shows each submitted activity's result — run
  // right after the submissions (end of Suite 8), so the PS is still "evaluation pending". Rows are immediate.
  TST_PROG_TC_2: async function (testdata) {
    sts = await dashboard.click_classMyProgress(testdata.className);
    await assertion.assertEqual(sts.opened, true, "'My progress' of class '" + testdata.className + "' did not open");
    sts = await progress.click_aggregatedBundle(testdata.product);
    await assertion.assertEqual(sts.opened, true, "The progress page of '" + testdata.product + "' did not open");
    sts = await progress.getData_componentActivities(testdata.component, testdata.activities.map(function (a) { return a.name; }));
    await assertion.assertEqual(sts.opened, true, "'" + testdata.component + "' did not open its activity list");
    await assertActivityRows(sts.rows, testdata.activities, "Learner");
  },

  // LP-034: the teacher's Class data shows the class figures and this learner's figures for the same submissions.
  // Same batch-job lag as TC_1 — re-read until settled (bounded).
  TST_PROG_TC_3: async function (testdata) {
    sts = await progress.getData_teacherClassProgressSettled(testdata.learnerName, testdata.teacherClass, testdata.teacherStudent, testdata.settleTimeoutMs, testdata.reloadEveryMs);
    await logger.logInto(await stackTrace.get(), "Class data settled=" + sts.settled + " after " + sts.waitedMs + " ms (" + sts.attempts + " reads)");
    await assertPhrases(sts.classMetrics, testdata.teacherClass, "Teacher class performance");
    await assertPhrases(sts.studentMetrics, testdata.teacherStudent, "Teacher view of '" + testdata.learnerName + "'");
  },

  // LP-034: the teacher's per-activity view of the learner matches what the learner sees.
  TST_PROG_TC_4: async function (testdata) {
    sts = await progress.click_teacherStudentBundle(testdata.learnerName, testdata.product);
    await assertion.assertEqual(sts.opened, true, "The teacher could not open '" + testdata.product + "' for '" + testdata.learnerName + "'");
    sts = await progress.getData_componentActivities(testdata.component, testdata.activities.map(function (a) { return a.name; }));
    await assertion.assertEqual(sts.opened, true, "'" + testdata.component + "' did not open its activity list for the teacher");
    await assertActivityRows(sts.rows, testdata.activities, "Teacher");
  },

  // LP-035: after the teacher marked the PS, the learner's bell has "New feedback" and it shows the mark + feedback.
  TST_PROG_TC_5: async function (testdata) {
    sts = await progress.getData_feedbackNotification(testdata.feedbackItem);
    await assertion.assertEqual(sts.itemShown, true, "The learner has no '" + testdata.feedbackItem + "' notification");
    await assertion.assertEqual(sts.score, testdata.score, "The feedback view does not show the score " + testdata.score);
    await assertion.assertEqual(sts.teacherScore, testdata.score, "The teacher's block does not show the score " + testdata.score);
    await assertion.assertEqual(sts.teacherFeedback, testdata.feedback, "The teacher's feedback is not shown");
  },

  // LP-035: the learner's per-activity rows after marking (the PS now scored) — from "My progress" (TST_PROG_TC_1).
  TST_PROG_TC_6: async function (testdata) {
    sts = await progress.click_aggregatedBundle(testdata.product);
    await assertion.assertEqual(sts.opened, true, "The progress page of '" + testdata.product + "' did not open");
    sts = await progress.getData_componentActivities(testdata.component, testdata.activities.map(function (a) { return a.name; }));
    await assertion.assertEqual(sts.opened, true, "'" + testdata.component + "' did not open its activity list");
    await assertActivityRows(sts.rows, testdata.activities, "Learner (after marking)");
  },

  // LP-035: teacher Class data → "Show progress details" → the learner's per-component figures after marking.
  TST_PROG_TC_7: async function (testdata) {
    sts = await progress.getData_teacherProgressDetails(testdata.learnerName, Object.keys(testdata.teacherDetails));
    await assertion.assertEqual(sts.switchedOn, true, "'Show progress details' could not be switched on");
    for (var name in testdata.teacherDetails) {
      await assertPhrases(sts.components[name], testdata.teacherDetails[name], "Teacher progress details of '" + name + "'");
    }
  },
};

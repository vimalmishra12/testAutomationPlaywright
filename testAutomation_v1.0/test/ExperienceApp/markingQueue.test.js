"use strict";
// MRKQ — the teacher marking queue (module code agreed with the user 2026-09-23). LP-035: the teacher marks the run's
// learner's Practice Set with SOURCE's score (70) and feedback ("Good") — user decision 2026-09-24.
// ⚠️ MUTATES the run's own data only: the mark is sent to the learner and cannot be changed afterwards.
var markingQueue = require("../../pages/ExperienceApp/markingQueue.page.js");
var sts;

module.exports = {
  // LP-035: the class shows work to mark, and the queue lists the learner's PS submission (pre-filled score).
  TST_MRKQ_TC_1: async function (testdata) {
    // [2026-09-25] minCount (default 1): the NLP suite waits for BOTH of its submissions (PS + Group PS) before marking.
    var minCount = testdata.minCount || 1;
    sts = await markingQueue.getData_classMarkingCount(testdata.countTimeoutMs, testdata.reloadEveryMs, minCount);
    await assertion.assert(sts.count >= minCount, "The class shows fewer than " + minCount + " submission(s) to mark (Marking count " + sts.count + " after " + sts.waitedMs + " ms)");
    sts = await markingQueue.open_submission(testdata.course, testdata.item, testdata.learnerName);
    await assertion.assertEqual(sts.queueShown, true, "The marking queue did not open");
    await assertion.assert(/Unmarked \(\d+\)/.test(sts.unmarkedTab || "") && !/Unmarked \(0\)/.test(sts.unmarkedTab), "The queue shows nothing unmarked: " + sts.unmarkedTab);
    await assertion.assertEqual(sts.courseShown, true, "'" + testdata.course + "' is not in the marking queue");
    await assertion.assertEqual(sts.itemShown, true, "'" + testdata.item + "' is not in the marking queue");
    await assertion.assertEqual(sts.submissionShown, true, "The submission of '" + testdata.learnerName + "' is not listed");
    await assertion.assertEqual(sts.score, testdata.prefilledScore, "The marking screen's score is not pre-filled with " + testdata.prefilledScore);
  },

  // LP-035: mark with the score and feedback, confirm "Ready to send?", and the submission shows as marked.
  TST_MRKQ_TC_2: async function (testdata) {
    sts = await markingQueue.mark_submission(testdata.score, testdata.feedback);
    await assertion.assertEqual(sts.scoreSet, String(testdata.score), "The score could not be set to " + testdata.score);
    await assertion.assert(typeof sts.confirmText === "string" && sts.confirmText.indexOf(testdata.confirmTitle) !== -1, "The send confirmation did not open ('" + testdata.confirmTitle + "'): " + sts.confirmText);
    await assertion.assertEqual(sts.confirmed, true, "The mark could not be confirmed");
    await assertion.assertEqual(sts.submissionScore, String(testdata.score), "The submission does not show the score " + testdata.score);
    await assertion.assertEqual(sts.teacherScore, String(testdata.score), "The teacher's feedback block does not show the score " + testdata.score);
    await assertion.assertEqual(sts.teacherFeedback, testdata.feedback, "The teacher's feedback block does not show the feedback");
    // [2026-09-25] unmarkedAfter (default "Unmarked (0)"): with two submissions the first mark leaves "Unmarked (1)".
    var expectedTab = testdata.unmarkedAfter || "Unmarked (0)";
    var tab = sts.unmarkedTab;
    // [2026-09-25] unmarkedSettleMs (opt-in, NLP Group PS): the counter can lag the mark by minutes — re-read until it
    // settles (bounded). Without it the count is read once, as before (LP suite unchanged).
    if (testdata.unmarkedSettleMs && tab !== expectedTab) {
      var settled = await markingQueue.getData_unmarkedTabSettled(expectedTab, testdata.unmarkedSettleMs, testdata.reloadEveryMs);
      await logger.logInto(await stackTrace.get(), "Unmarked tab '" + settled.unmarkedTab + "' after " + settled.waitedMs + " ms (" + settled.attempts + " reads)");
      tab = settled.unmarkedTab;
    }
    await assertion.assertEqual(tab, expectedTab, "The unmarked count did not drop as expected after marking");
  },
};

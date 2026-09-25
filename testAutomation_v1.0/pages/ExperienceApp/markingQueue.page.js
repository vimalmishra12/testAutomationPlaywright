"use strict";
var action = require("../../core/actionLibrary/baseActionLibrary.js");
var selectorFile = jsonParserUtil.jsonParser(selectorDir);

/**
 * Teacher marking queue (module MRKQ — agreed with the user 2026-09-23), captured live on production 2026-09-24 —
 * see learning-path-player.md §A12. Ported from SOURCE ClassDashboardPage goToMarkingQueue / openMarking / markPS,
 * WITHOUT its positional ids (course-link-<n>, course-content-<n>-<m> → matched by text) and WITHOUT its fixed 3 s
 * pause between Send and the confirmation (the confirm dialog is waited for instead; it opens in ~0.4 s).
 *
 * ⚠️ MUTATES: marking sends the mark to the learner and cannot be changed afterwards ("Once sent, you won't be able
 * to make any further changes"). The LP suite marks only its OWN run's learner (user-approved).
 */
module.exports = {
  unmarkedTab: selectorFile.css.ComproC1.markingQueue.unmarkedTab,

  isInitialized: async function () {
    await logger.logInto(await stackTrace.get());
    await action.waitForDocumentLoad();
    return { pageStatus: true == (await action.waitForDisplayed(this.unmarkedTab, 60000)) };
  },

  /**
   * Class page: the "<n> Marking" link. The count can lag the learner's submission, so the page is re-read (reload)
   * until the count is ≥ `minCount` (default 1) or `timeoutMs` passes (SOURCE polled the dashboard badge the same way).
   * [2026-09-25] minCount added for the NLP suite, whose learners make TWO submissions (PS + Group PS): waiting for
   * both before marking the first guarantees the second is listed when its turn comes.
   */
  getData_classMarkingCount: async function (timeoutMs, reloadEveryMs, minCount) {
    await logger.logInto(await stackTrace.get(), "timeout:" + timeoutMs + " minCount:" + (minCount || 1));
    var need = minCount || 1;
    var mq = selectorFile.css.ComproC1.markingQueue;
    var url = await browser.getUrl();
    var start = Date.now();
    var count = -1;
    while (true) {
      if (true == (await action.waitForDisplayed(mq.classMarkingLink, 30000))) {
        var m = String(await action.getText(mq.classMarkingLink)).match(/(\d+)/);
        count = m ? Number(m[1]) : 0;
      }
      if (count >= need || Date.now() - start >= timeoutMs) break;
      await browser.pause(reloadEveryMs); // sanctioned: nothing on the page signals the count update (Invariant 1)
      await browser.url(url);
      await action.waitForDocumentLoad();
    }
    return { count: count, waitedMs: Date.now() - start };
  },

  /** Class page → Marking → the component's course → the activity item → the learner's submission (all BY TEXT). */
  open_submission: async function (courseName, itemText, learnerName) {
    await logger.logInto(await stackTrace.get(), "course:" + courseName + " item:" + itemText + " learner:" + learnerName);
    var mq = selectorFile.css.ComproC1.markingQueue;
    var out = { queueShown: false, unmarkedTab: null, courseShown: false, itemShown: false, submissionShown: false, score: null };
    var res = await action.click(mq.classMarkingLink);
    out.queueShown = true == res && (await this.isInitialized()).pageStatus;
    if (!out.queueShown) return out;
    out.unmarkedTab = String(await action.getText(mq.unmarkedTab)).replace(/\s+/g, " ").trim();
    var course = action.getFilteredLocator(mq.courseLink, courseName);
    out.courseShown = true == (await action.waitForDisplayed(course, 30000));
    if (!out.courseShown || true != (await action.click(course))) return out;
    var item = action.getFilteredLocator(mq.contentItem, itemText);
    out.itemShown = true == (await action.waitForDisplayed(item, 30000));
    if (!out.itemShown || true != (await action.click(item))) return out;
    var sub = action.getFilteredLocator(mq.submissionItem, learnerName);
    out.submissionShown = true == (await action.waitForDisplayed(sub, 30000));
    if (!out.submissionShown || true != (await action.click(sub))) return out;
    if (true == (await action.waitForDisplayed(mq.scoreInput, 30000))) out.score = await action.getValue(mq.scoreInput);
    return out;
  },

  /**
   * On the marking screen: set the score, type the feedback, Send, confirm in "Ready to send?", and read the marked
   * state (the submission's score and the teacher's feedback block).
   */
  mark_submission: async function (score, feedback) {
    await logger.logInto(await stackTrace.get(), "score:" + score + " feedback:" + feedback);
    var mq = selectorFile.css.ComproC1.markingQueue;
    var out = { scoreSet: null, confirmText: null, confirmed: false, submissionScore: null, teacherScore: null, teacherFeedback: null, unmarkedTab: null };
    // The score is pre-filled (70 on 2026-09-24) — set it explicitly so a changed default cannot change the test.
    var res = await action.clearValue(mq.scoreInput);
    if (true == res) res = await action.addValue(mq.scoreInput, String(score));
    out.scoreSet = await action.getValue(mq.scoreInput);
    if (true == res) res = await action.click(mq.feedbackEditor);
    if (true == res) res = await action.addValue(mq.feedbackEditor, feedback);
    if (true == res) res = await action.click(mq.sendBtn);
    if (true != res || true != (await action.waitForDisplayed(mq.confirmModal, 15000))) return out;
    out.confirmText = String(await action.getText(mq.confirmModal)).replace(/\s+/g, " ").trim();
    out.confirmed = true == (await action.click(mq.confirmSendBtn)) && true == (await action.waitForDisplayed(mq.confirmModal, 15000, true));
    if (!out.confirmed) return out;
    if (true == (await action.waitForDisplayed(mq.teacherFeedbackScore, 30000))) {
      out.submissionScore = String(await action.getText(mq.submissionScore)).trim();
      out.teacherScore = String(await action.getText(mq.teacherFeedbackScore)).trim();
      out.teacherFeedback = String(await action.getText(mq.teacherFeedbackText)).trim();
    }
    out.unmarkedTab = String(await action.getText(mq.unmarkedTab)).replace(/\s+/g, " ").trim();
    return out;
  },

  /**
   * [2026-09-25, NLP run 4] Re-reads the "Unmarked (n)" tab (reloading the marking screen every `reloadEveryMs`) until it
   * reads `expected` or `timeoutMs` passes. After the Group PS of a group whose members have all launched the product
   * was marked, the counters read "Unmarked (2)" with "There are no student submissions to view" and reached 0 only
   * minutes later (≤ ~15 min seen) — the count lags the list. The mark itself is asserted separately and immediately.
   */
  getData_unmarkedTabSettled: async function (expected, timeoutMs, reloadEveryMs) {
    await logger.logInto(await stackTrace.get(), "expected:" + expected + " timeout:" + timeoutMs);
    var mq = selectorFile.css.ComproC1.markingQueue;
    var url = await browser.getUrl();
    var start = Date.now();
    var text = null;
    var attempts = 0;
    while (true) {
      if (true == (await action.waitForDisplayed(mq.unmarkedTab, 30000))) {
        text = String(await action.getText(mq.unmarkedTab)).replace(/\s+/g, " ").trim();
      }
      attempts++;
      if (text === expected || Date.now() - start >= timeoutMs) break;
      await browser.pause(reloadEveryMs); // sanctioned: nothing on the page signals the counter update (Invariant 1)
      await browser.url(url);
      await action.waitForDocumentLoad();
    }
    return { unmarkedTab: text, attempts: attempts, waitedMs: Date.now() - start };
  },
};

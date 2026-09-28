"use strict";
// NLPP — the New Learning Path (NLP) player: the "Projects" component of cqaautomationbundle1 (scenario sheet
// nlp-scenarios.xlsx, TC-NLP-001…022). Grounded live on production 2026-09-25. Manual register:
// test/Manual/C1App/NewLearningPath/. Knowledge: product-knowledge/ExperienceApp/new-learning-path.md.
var newLearningPath = require("../../pages/ExperienceApp/newLearningPath.page.js");
var sts;

// Teacher / admin preview (TC-NLP-012/014/015): the NLP route, a TOC listing activities, one activity opens and closes.
async function assertPreview(p, who) {
  await assertion.assertEqual(p.onRoute, true, "The component did not open the NLP preview (/nlp/teacher/) for the " + who);
  await assertion.assertEqual(p.tocShown, true, "The NLP TOC did not render for the " + who);
  await assertion.assert(p.activityCount > 0, "The NLP TOC lists no activity for the " + who);
  await assertion.assertEqual(p.opened && p.opened.inActivityView, true, "The " + who + " could not open an activity from the NLP TOC");
  await assertion.assertEqual(p.iframeShown, true, "The activity did not load in the " + who + "'s preview");
  await assertion.assertEqual(p.closed && p.closed.onToc, true, "Close Activity did not return the " + who + " to the NLP TOC");
}

// TC-NLP-021: on an open Collaborative Task — the group heading, every expected earlier comment (author + text), then
// (optionally) this user's own comment posted and shown.
async function assertCommentsAndPost(testdata) {
  sts = await newLearningPath.getData_collab();
  await assertion.assertEqual(sts.groupName, testdata.groupName, "The Collaborative Task is not shown for the group");
  for (var i = 0; i < testdata.expected.length; i++) {
    var e = testdata.expected[i];
    var hit = sts.comments.some(function (c) { return c.actor === e.actor && c.text === e.text; });
    await assertion.assert(hit, "The comment '" + e.text + "' by " + e.actor + " is not visible: " + JSON.stringify(sts.comments));
  }
  if (testdata.comment) {
    sts = await newLearningPath.post_collabComment(testdata.comment);
    await assertion.assertEqual(sts.shown, true, "The posted comment is not shown");
  }
}

module.exports = {
  // TC-NLP-001: after the launch, the NLP TOC page shows the product, the component and its activities.
  TST_NLPP_TC_1: async function (testdata) {
    sts = await newLearningPath.getData_toc();
    await assertion.assertEqual(sts.tocShown, true, "The NLP table of contents is not shown");
    await assertion.assertEqual(sts.productTitle, testdata.productTitle, "The NLP page does not name the product");
    await assertion.assertEqual(sts.componentTitle, testdata.componentName, "The NLP page does not name the component");
    await assertion.assertEqual(sts.activities.length, testdata.activities.length, "The NLP TOC does not list the component's activities: " + sts.activities.join(" | "));
  },

  // TC-NLP-016: the TOC is one vertical page — numbered unit, its lesson, the numbered activities in order with a
  // medal on the scorable types and a connector dot per activity; the unit collapses and expands; an activity
  // opened from the list closes (×) back to the same TOC.
  TST_NLPP_TC_2: async function (testdata) {
    sts = await newLearningPath.getData_toc();
    await assertion.assertEqual(sts.unitNumber, testdata.unitNumber, "The unit is not numbered '" + testdata.unitNumber + "'");
    await assertion.assert(typeof sts.unitText === "string" && sts.unitText.indexOf(testdata.unit) !== -1, "The unit heading does not read '" + testdata.unit + "': " + sts.unitText);
    await assertion.assertEqual(sts.lessonName, testdata.lesson, "The lesson heading is not '" + testdata.lesson + "'");
    await assertion.assertEqual(sts.activities.join(" | "), testdata.activities.join(" | "), "The activities are not listed, numbered, in order");
    await assertion.assertEqual(sts.medalRows.join(" | "), testdata.medalActivities.join(" | "), "Medal icons are not on exactly the scorable activities");
    await assertion.assertEqual(sts.connectors, testdata.activities.length, "The connector dots between activities are not all shown");
    await assertion.assertEqual(sts.unitExpanded, "true", "The unit is not expanded on entry");
    sts = await newLearningPath.toggle_unit(testdata.unit, testdata.probeActivity);
    await assertion.assertEqual(sts.isShown, false, "The unit did not collapse its activities");
    await assertion.assertEqual(sts.expanded, "false", "The collapsed unit still reports aria-expanded=true");
    sts = await newLearningPath.toggle_unit(testdata.unit, testdata.probeActivity);
    await assertion.assertEqual(sts.isShown, true, "The unit did not expand its activities again");
    await assertion.assertEqual(sts.expanded, "true", "The expanded unit does not report aria-expanded=true");
    sts = await newLearningPath.open_activity(testdata.openLabel, testdata.openTitle);
    await assertion.assertEqual(sts.title, testdata.openTitle, "Selecting '" + testdata.openLabel + "' did not open it in the activity view");
    await assertion.assertEqual(sts.closeShown, true, "The activity view offers no close (×)");
    sts = await newLearningPath.click_closeActivity();
    await assertion.assertEqual(sts.onToc, true, "Closing the activity did not return to the NLP TOC: " + sts.url);
    sts = await newLearningPath.getData_toc();
    await assertion.assertEqual(sts.activities.join(" | "), testdata.activities.join(" | "), "The TOC did not come back with the same activities");
  },

  // TC-NLP-003: Exercise 1 — open the scorable from the TOC, choose the answer, Check.
  TST_NLPP_TC_3: async function (testdata) {
    sts = await newLearningPath.open_activity(testdata.activityLabel, testdata.activityTitle);
    await assertion.assertEqual(sts.title, testdata.activityTitle, "The scorable activity did not open");
    sts = await newLearningPath.answer_frame(testdata.frame, testdata.answers);
    await assertion.assertEqual(sts.frameShown, true, "Exercise " + (testdata.frame + 1) + " is not shown");
    await assertion.assertEqual(sts.filledCount, testdata.answers.length, "The Exercise " + (testdata.frame + 1) + " dropdown did not show the chosen value");
    await assertion.assertEqual(sts.checked, true, "Check could not be clicked");
  },

  // TC-NLP-017: leave the half-done scorable (×) — the TOC shows it in progress, not completed / medalled; relaunched,
  // it restores the checked Exercise 1 answer and offers Next to carry on.
  TST_NLPP_TC_4: async function (testdata) {
    sts = await newLearningPath.click_closeActivity();
    await assertion.assertEqual(sts.onToc, true, "Close Activity did not return to the NLP TOC");
    sts = await newLearningPath.getData_activityState(testdata.activityLabel);
    await assertion.assertEqual(sts.inProgress, true, "The unfinished scorable is not shown in progress in the TOC");
    await assertion.assertEqual(sts.completed, false, "The unfinished scorable is shown as completed");
    await assertion.assert(/lch-medal-not-started/.test(sts.medalState || ""), "The unfinished scorable already shows a medal: " + sts.medalState);
    await assertion.assertEqual(sts.unitStatus, testdata.unitStatus, "The unit status is not '" + testdata.unitStatus + "'");
    sts = await newLearningPath.open_activity(testdata.activityLabel, testdata.activityTitle);
    await assertion.assertEqual(sts.title, testdata.activityTitle, "The scorable could not be relaunched");
    sts = await newLearningPath.getData_frameState(testdata.frame);
    await assertion.assertEqual(sts.frameShown, true, "The relaunched scorable is not on Exercise " + (testdata.frame + 1));
    await assertion.assertEqual(sts.filledCount, testdata.answerCount, "The Exercise " + (testdata.frame + 1) + " answer was not restored");
    await assertion.assertEqual(sts.correctCount, testdata.answerCount, "The Exercise " + (testdata.frame + 1) + " checked state was not restored");
    await assertion.assertEqual(sts.nextShown, true, "The relaunched scorable offers no Next to carry on");
  },

  // TC-NLP-003/004: Next → the following exercise; answer every dropdown, Check (data-driven: Exercises 2, 3, 4).
  TST_NLPP_TC_5: async function (testdata) {
    sts = await newLearningPath.click_next();
    await assertion.assertEqual(sts, true, "Next could not be clicked");
    sts = await newLearningPath.answer_frame(testdata.frame, testdata.answers);
    await assertion.assertEqual(sts.frameShown, true, "Next did not advance to Exercise " + (testdata.frame + 1));
    await assertion.assertEqual(sts.filledCount, testdata.answers.length, "Not every Exercise " + (testdata.frame + 1) + " dropdown registered its answer");
    await assertion.assertEqual(sts.checked, true, "Check could not be clicked");
  },

  // TC-NLP-004: the last Next shows the activity's result screen with the full score.
  TST_NLPP_TC_6: async function (testdata) {
    sts = await newLearningPath.click_next();
    await assertion.assertEqual(sts, true, "Next could not be clicked");
    sts = await newLearningPath.getData_result();
    await assertion.assertEqual(sts.shown, true, "The result screen is not shown");
    await assertion.assertEqual(sts.heading, testdata.heading, "The result screen heading is not '" + testdata.heading + "'");
    await assertion.assert(typeof sts.scoreText === "string" && sts.scoreText.toLowerCase().indexOf(testdata.expected.toLowerCase()) !== -1, "The result does not read '" + testdata.expected + "': " + sts.scoreText);
    await assertion.assertEqual(sts.nextActivityShown, true, "The result screen offers no 'Next activity'");
  },

  // TC-NLP-005: "Next activity" bridges to the flashcard deck; paged to its last card, it offers NEXT ACTIVITY.
  TST_NLPP_TC_7: async function (testdata) {
    sts = await newLearningPath.click_resultNextActivity(testdata.activityTitle);
    await assertion.assertEqual(sts.title, testdata.activityTitle, "'Next activity' did not open '" + testdata.activityTitle + "'");
    sts = await newLearningPath.page_deckToBridge();
    await assertion.assertEqual(sts.stuckAt, null, "The deck stopped advancing at " + sts.stuckAt);
    await assertion.assert(sts.steps >= 2, "The deck has " + sts.steps + " card(s) — nothing to page through");
    await assertion.assertEqual(sts.endIndex, sts.steps - 1, "The deck did not reach its last card");
    await assertion.assertEqual(sts.checkShown, false, "The non-scorable deck offers a Check button");
    await assertion.assertEqual(sts.bridgeShown, true, "The completed deck offers no NEXT ACTIVITY bridge");
  },

  // TC-NLP-006: NEXT ACTIVITY → the PS; type, Submit, confirm — the "Submitted" badge and the answer are shown.
  // ONE PS SUBMISSION PER LEARNER.
  TST_NLPP_TC_8: async function (testdata) {
    sts = await newLearningPath.click_nextActivity(testdata.activityTitle);
    await assertion.assertEqual(sts.title, testdata.activityTitle, "NEXT ACTIVITY did not open '" + testdata.activityTitle + "'");
    sts = await newLearningPath.submit_ps(testdata.answer);
    await assertion.assertEqual(sts.typed, true, "The answer could not be typed into the PS editor");
    await assertion.assertEqual(sts.submitEnabled, true, "Submit did not become enabled after typing an answer");
    await assertion.assertEqual(sts.confirmShown, true, "The 'Ready to submit?' dialog did not open");
    await assertion.assertEqual(sts.confirmClosed, true, "The 'Ready to submit?' dialog did not close after Submit");
    await assertion.assertEqual(sts.badgeShown, true, "No submitted badge is shown on the PS");
    await assertion.assert(typeof sts.badgeText === "string" && sts.badgeText.indexOf(testdata.badge) !== -1, "The PS badge does not read '" + testdata.badge + "': " + sts.badgeText);
    await assertion.assertEqual(sts.attemptedText, testdata.answer, "The submitted answer shown is not the one typed");
  },

  // TC-NLP-007: the activity view has no profile menu; Close Activity → the TOC, whose Cambridge One Home logo
  // returns to the full dashboard with its profile menu.
  TST_NLPP_TC_9: async function (testdata) {
    sts = await newLearningPath.getData_activityHeader();
    await assertion.assertEqual(sts.closeShown, true, "The activity view offers no Close Activity");
    await assertion.assertEqual(sts.profileMenuShown, false, "The activity view unexpectedly offers the profile menu");
    sts = await newLearningPath.click_closeActivity();
    await assertion.assertEqual(sts.onToc, true, "Close Activity did not return to the NLP TOC");
    sts = await newLearningPath.click_homeLogo(testdata.dashboardUrl);
    await assertion.assertEqual(sts.onDashboard, true, "The Cambridge One Home logo did not return to the dashboard");
    await assertion.assertEqual(sts.profileMenuShown, true, "The dashboard's profile menu is not reachable");
  },

  // TC-NLP-019: the HTML activity renders and completes by itself after a short dwell — no submit — and the TOC marks it
  // completed. [2026-09-25] Unblocked once the product team added the activity to Projects.
  TST_NLPP_TC_13: async function (testdata) {
    sts = await newLearningPath.open_htmlActivity(testdata.activityLabel, testdata.activityTitle, testdata.dwellMs);
    await assertion.assertEqual(sts.tickBefore, false, "Precondition: the HTML activity is already completed");
    await assertion.assertEqual(sts.title, testdata.activityTitle, "The HTML activity did not open");
    await assertion.assertEqual(sts.contentShown, true, "The HTML content did not render");
    await assertion.assertEqual(sts.submitShown, false, "The HTML activity offers a submit / check control");
    await assertion.assertEqual(sts.closed, true, "Close Activity did not return to the NLP TOC");
    await assertion.assertEqual(sts.tickAfter, true, "The HTML activity is not marked completed in the TOC");
  },

  // TC-NLP-020 (same rule as the classic LP's LP-022): NEXT ACTIVITY from the HTML activity lands on the PDF's download
  // page (file name + Download link) and landing marks it completed — Download is never clicked.
  TST_NLPP_TC_14: async function (testdata) {
    sts = await newLearningPath.open_pdfActivity(testdata.fromLabel, testdata.fromTitle, testdata.activityLabel, testdata.activityTitle, testdata.dwellMs);
    await assertion.assertEqual(sts.tickBefore, false, "Precondition: the PDF activity is already completed");
    await assertion.assertEqual(sts.fromTitle, testdata.fromTitle, "The activity before the PDF did not open");
    await assertion.assertEqual(sts.title, testdata.activityTitle, "NEXT ACTIVITY did not land on the PDF activity");
    await assertion.assertEqual(sts.pageShown, true, "The PDF activity's page is not shown");
    await assertion.assertEqual(sts.instructions, testdata.instructions, "Unexpected instructions on the PDF page");
    await assertion.assertEqual(sts.fileName, testdata.fileName, "Unexpected file name on the PDF page");
    await assertion.assertEqual(sts.downloadShown, true, "No Download link is offered for the PDF");
    await assertion.assertEqual(sts.tickAfter, true, "The PDF activity is not marked completed in the TOC");
  },

  // ---- Group activities (TC-NLP-021/022) — the run's two learners share one teacher-made group ----

  // TC-NLP-021: learner A opens the Collaborative Task (headed by the group's name) and posts a comment.
  TST_NLPP_TC_15: async function (testdata) {
    sts = await newLearningPath.open_activity(testdata.activityLabel, testdata.activityTitle);
    await assertion.assertEqual(sts.title, testdata.activityTitle, "The Collaborative Task did not open");
    sts = await newLearningPath.getData_collab();
    await assertion.assertEqual(sts.editorShown, true, "The Collaborative Task offers no comment box");
    await assertion.assertEqual(sts.groupName, testdata.groupName, "The Collaborative Task is not shown for the learner's group");
    sts = await newLearningPath.post_collabComment(testdata.comment);
    await assertion.assertEqual(sts.shown, true, "The posted comment is not shown");
  },

  // TC-NLP-021: another member (or the learner returning) sees the earlier comments with their authors, then posts.
  // Data: `expected` = [{actor, text}] that must already be listed; `comment` (optional) = what this user posts.
  TST_NLPP_TC_16: async function (testdata) {
    sts = await newLearningPath.open_activity(testdata.activityLabel, testdata.activityTitle);
    await assertion.assertEqual(sts.title, testdata.activityTitle, "The Collaborative Task did not open");
    await assertCommentsAndPost(testdata);
  },

  // TC-NLP-021: the teacher previews the Collaborative Task from the class Materials view (TOC already open, e.g. after
  // TST_NLPP_TC_10), chooses the group, sees both learners' comments and posts one too.
  TST_NLPP_TC_17: async function (testdata) {
    sts = await newLearningPath.open_activityForGroup(testdata.activityLabel, testdata.groupName);
    await assertion.assertEqual(sts.listed, true, "The group '" + testdata.groupName + "' is not offered in Select group");
    await assertion.assertEqual(sts.opened, true, "Choosing the group did not open the Collaborative Task");
    await assertCommentsAndPost(testdata);
  },


  // TC-NLP-022: learner A submits the Group PS for the whole group. ONE SUBMISSION PER GROUP.
  TST_NLPP_TC_18: async function (testdata) {
    sts = await newLearningPath.open_activity(testdata.activityLabel, testdata.activityTitle);
    await assertion.assertEqual(sts.title, testdata.activityTitle, "The Group PS did not open");
    sts = await newLearningPath.submit_groupPs(testdata.title, testdata.answer);
    await assertion.assertEqual(sts.typed, true, "The title / answer could not be typed");
    await assertion.assertEqual(sts.submitEnabled, true, "Submit did not become enabled after typing an answer");
    await assertion.assertEqual(sts.confirmTitle, testdata.confirmTitle, "The group submission confirmation did not open");
    await assertion.assertEqual(sts.confirmClosed, true, "The confirmation did not close after 'Yes, submit'");
    await assertion.assertEqual(sts.submitted.submittedBy, testdata.submittedBy, "The submission does not show who submitted for the group");
    await assertion.assert(typeof sts.submitted.badge === "string" && sts.submitted.badge.indexOf(testdata.badge) !== -1, "The Group PS badge does not read '" + testdata.badge + "': " + sts.submitted.badge);
    await assertion.assertEqual(sts.submitted.title, testdata.title, "The submitted title is not shown");
    await assertion.assertEqual(sts.submitted.answer, testdata.answer, "The submitted answer is not shown");
  },

  // TC-NLP-022: the other member sees the group's submission (read-only) — no second submission is offered.
  TST_NLPP_TC_19: async function (testdata) {
    sts = await newLearningPath.open_activity(testdata.activityLabel, testdata.activityTitle);
    await assertion.assertEqual(sts.title, testdata.activityTitle, "The Group PS did not open");
    sts = await newLearningPath.getData_submission();
    await assertion.assertEqual(sts.shown, true, "The group's submission is not shown to the other member");
    await assertion.assertEqual(sts.submittedBy, testdata.submittedBy, "The member does not see who submitted for the group");
    await assertion.assertEqual(sts.title, testdata.title, "The member does not see the group's title");
    await assertion.assertEqual(sts.answer, testdata.answer, "The member does not see the group's answer");
    await assertion.assertEqual(sts.editorShown, false, "The member is offered an editor for an already submitted Group PS");
  },

  // TC-NLP-022: after the teacher marked the Group PS ONCE, each member (run for learner A and learner B) sees that
  // mark: "Score : <n> %" on the group's submission and the teacher's block with the same score and the feedback.
  TST_NLPP_TC_20: async function (testdata) {
    sts = await newLearningPath.open_activity(testdata.activityLabel, testdata.activityTitle);
    await assertion.assertEqual(sts.title, testdata.activityTitle, "The Group PS did not open");
    sts = await newLearningPath.getData_submission();
    await assertion.assertEqual(sts.shown, true, "The group's submission is not shown");
    await assertion.assertEqual(sts.submittedBy, testdata.submittedBy, "This is not the group's submission");
    await assertion.assertEqual(sts.score, testdata.score, "The member does not see the group's mark " + testdata.score);
    await assertion.assertEqual(sts.teacherScore, testdata.score, "The teacher's block does not show the mark " + testdata.score);
    await assertion.assertEqual(sts.teacherFeedback, testdata.feedback, "The teacher's feedback is not shown to the member");
  },

  // TC-NLP-012: teacher — class Materials → the NLP component → preview with its TOC; an activity opens and closes.
  TST_NLPP_TC_10: async function (testdata) {
    sts = await require("../../pages/ExperienceApp/classMaterials.page.js").click_component(testdata);
    await assertion.assertEqual(sts.pageStatus, true, "'" + testdata.componentName + "' could not be clicked in the Materials tab");
    sts = await newLearningPath.preview_component(testdata.activityLabel, testdata.activityTitle);
    await assertPreview(sts, "teacher");
  },

  // TC-NLP-014: teacher — My library → product → View details → the NLP component → preview.
  TST_NLPP_TC_11: async function (testdata) {
    sts = await require("../../pages/ExperienceApp/teacherLibrary.page.js").open_productDetails(testdata.productId, testdata.productTitle);
    await assertion.assertEqual(sts.productListed, true, "'" + testdata.productTitle + "' not found in My library");
    await assertion.assertEqual(sts.materialsShown, true, "The product materials view did not open");
    sts = await require("../../pages/ExperienceApp/umbrellaProduct.page.js").launch_componentByName(testdata.componentName);
    await assertion.assertEqual(sts, true, "'" + testdata.componentName + "' could not be launched from the product");
    sts = await newLearningPath.preview_component(testdata.activityLabel, testdata.activityTitle);
    await assertPreview(sts, "teacher");
  },

  // TC-NLP-015: admin — LIBRARY (School licence section present) → search → "See materials" → the NLP component → preview.
  TST_NLPP_TC_12: async function (testdata) {
    var schoolLibrary = require("../../pages/ExperienceApp/schoolLibrary.page.js");
    sts = await schoolLibrary.getData_schoolLicenceSection();
    await assertion.assertEqual(sts.sectionPresent, true, "The Library tab has no School licence section");
    sts = await schoolLibrary.search_product(testdata.productTitle);
    await assertion.assertEqual(sts, true, "The Library search for '" + testdata.productTitle + "' did not settle");
    sts = await schoolLibrary.getData_searchState();
    // The heading wraps the banner in "Library — … . Clear" (admin-library-tab.md) — assert the banner phrase.
    await assertion.assert(typeof sts.headingText === "string" && sts.headingText.indexOf(testdata.searchBanner) !== -1, "The Library does not show '" + testdata.searchBanner + "': " + sts.headingText);
    sts = await schoolLibrary.click_productByTitle(testdata.productTitle);
    await assertion.assertEqual(sts, true, "'See materials' for '" + testdata.productTitle + "' did not open the materials view");
    sts = await require("../../pages/ExperienceApp/umbrellaProduct.page.js").launch_componentByName(testdata.componentName);
    await assertion.assertEqual(sts, true, "'" + testdata.componentName + "' could not be launched from the materials view");
    sts = await newLearningPath.preview_component(testdata.activityLabel, testdata.activityTitle);
    await assertPreview(sts, "admin");
  },
};

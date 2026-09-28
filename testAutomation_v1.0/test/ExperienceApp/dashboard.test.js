"use strict";
var dashboard = require("../../pages/ExperienceApp/dashboard.page.js");
var sts;

module.exports = {
  TST_DASH_TC_1: async function () {
    sts = await dashboard.isInitialized();
    await assertion.assertEqual(
      sts.pageStatus,
      true,
      "dashboard page status mismatch"
    );
  },

  TST_DASH_TC_2: async function (testdata) {
    sts = await dashboard.click_help_btn();
    await assertion.assertEqual(sts, true, "help_btn are not Clicked");
  },

  TST_DASH_TC_3: async function (testdata) {
    sts = await dashboard.click_progress_btn();
    await assertion.assertEqual(sts.pageStatus, true, "Page is not launched. ");
  },

  TST_DASH_TC_4: async function (testdata) {
    sts = await dashboard.click_praticeExtra_btn();
    await assertion.assertEqual(sts.pageStatus, true, "Page is not launched. ");
  },

  TST_DASH_TC_5: async function (testdata) {
    console.log("testdata 31" ,testdata); 
    sts = await dashboard.click_ebook_btn(testdata);
    await assertion.assertEqual(sts.pageStatus, true, "Page is not launched. ");
  },

  TST_DASH_TC_6: async function (testdata) {
    sts = await dashboard.click_homework_btn();
    await assertion.assertEqual(sts.pageStatus, true, "Page is not launched. ");
  },

  TST_DASH_TC_7: async function (testdata) {
    sts = await dashboard.click_myProgress_btn();
    await assertion.assertEqual(sts.pageStatus, true, "Page is not launched. ");
  },

  TST_DASH_TC_8: async function (testdata) {
    sts = await dashboard.getData_dashboard(testdata);
    await assertion.assertEqual(
      sts.help_btn,
      testdata.help_btn,
      "help_btn Values is not as expected."
    );
  },

  TST_DASH_TC_9: async function (testdata) {
    sts = await dashboard.getData_activeClasses(testdata);
    await assertion.assertEqual(
      sts.progress_btn,
      testdata[0].progress_btn,
      "progress_btn Values is not as expected."
    );
    await assertion.assertEqual(
      sts.praticeExtra_btn,
      testdata[0].praticeExtra_btn,
      "praticeExtra_btn Values is not as expected."
    );
    await assertion.assertEqual(
      sts.ebook_btn,
      testdata[0].ebook_btn,
      "ebook_btn Values is not as expected."
    );
    await assertion.assertEqual(
      sts.homework_btn,
      testdata[0].homework_btn,
      "homework_btn Values is not as expected."
    );
    await assertion.assertEqual(
      sts.myProgress_btn,
      testdata[0].myProgress_btn,
      "myProgress_btn Values is not as expected."
    );
  },

  TST_DASH_TC_10: async function (testdata) {
    sts = await dashboard.click_createNewClass();
    await browser.pause(1000);
    await assertion.assertEqual(sts.pageStatus, true, 'Page is not launched. ');
  },

  TST_DASH_TC_11: async function (testdata) {
    sts = await dashboard.click_activeClassCard(testdata);
    await assertion.assertEqual(sts.pageStatus, true, 'Page is not launched. ');
  },

  // [2026-09-22] LP migration: a new teacher's guided tour returns on every login; the
  // dashboard must be left usable (tour closed) before anything is clicked.
  // [2026-09-22] LP migration: after accepting on an SLE school, the learner sees the class and
  // its component with NO activation-code prompt (the licence grants the product).
  TST_DASH_TC_13: async function (testdata) {
    sts = await dashboard.getData_learnerClassAccess(testdata.className, testdata.componentName);
    await assertion.assertEqual(sts.classShown, true, "Class '" + testdata.className + "' not on the learner dashboard");
    await assertion.assertEqual(sts.componentShown, true, "'" + testdata.componentName + "' not available in the class card");
    await assertion.assertEqual(sts.activationPromptShown, false, "Learner was asked for an activation code despite the school licence");
  },

  // [2026-09-22] LP-001 entry: open the component from the NAMED class card → Learning Path player.
  TST_DASH_TC_14: async function (testdata) {
    sts = await dashboard.click_classComponent(testdata.className, testdata.componentName);
    await assertion.assertEqual(sts.pageStatus, true, "'" + testdata.componentName + "' of class '" + testdata.className + "' did not open the Learning Path player");
  },

  // [2026-09-23] LP-020: before accepting the invite the learner lands on the Invitations page (not the
  // dashboard) — no class card and no "Practice Extra" anywhere.
  TST_DASH_TC_15: async function (testdata) {
    sts = await dashboard.getData_learnerWithoutClass(testdata.className, testdata.componentName);
    await assertion.assertEqual(sts.onInvitations, true, "The learner with a pending invite was not taken to the Invitations page");
    await assertion.assertEqual(sts.classListed, true, "Invitation for '" + testdata.className + "' not listed on the Invitations page");
    await assertion.assertEqual(sts.classCardShown, false, "A class card is shown before the learner joined a class");
    await assertion.assertEqual(sts.componentShown, false, "'" + testdata.componentName + "' is reachable without a class / product");
  },

  // [2026-09-23] LP-027: the SLE component shows no expiry date and a loading indicator before the player.
  TST_DASH_TC_16: async function (testdata) {
    sts = await dashboard.launch_classComponent_watchLoading(testdata.className, testdata.componentName);
    await assertion.assertEqual(sts.tileShown, true, "'" + testdata.componentName + "' is not shown in class '" + testdata.className + "'");
    await assertion.assertEqual(sts.expiryText, null, "An expiry date is shown for the SLE component: " + sts.expiryText);
    await assertion.assertEqual(sts.loaderSeen, true, "No loading indicator was shown while the component launched");
    await assertion.assertEqual(sts.playerShown, true, "The Learning Path player did not open");
  },

  // [2026-09-25] TC-NLP-001/002/018: the SLE-granted NEW Learning Path component (Projects) of the named class shows
  // no expiry date; launched, a learner's FIRST launch shows the "setting up the learning materials" screen with its
  // progress bar, which clears into the NLP table of contents. `firstLaunch: false` data skips the provisioning checks.
  TST_DASH_TC_17: async function (testdata) {
    sts = await dashboard.launch_classNlpComponent(testdata.className, testdata.componentName, testdata.timeoutMs);
    await assertion.assertEqual(sts.tileShown, true, "'" + testdata.componentName + "' is not shown in class '" + testdata.className + "'");
    await assertion.assertEqual(sts.expiryText, null, "An expiry date is shown for the SLE component: " + sts.expiryText);
    await assertion.assertEqual(sts.clicked, true, "'" + testdata.componentName + "' could not be clicked");
    if (testdata.firstLaunch) {
      await assertion.assertEqual(sts.provisioningSeen, true, "The first launch did not show the materials-provisioning screen");
      await assertion.assertEqual(sts.progressBarSeen, true, "The provisioning screen showed no progress bar");
    }
    await assertion.assertEqual(sts.tocShown, true, "The NLP table of contents did not render after the launch (" + sts.waitedMs + " ms, at " + sts.route + ")");
  },

  TST_DASH_TC_12: async function (testdata) {
    sts = await dashboard.close_introTourIfShown();
    await assertion.assertEqual(sts.tourClosed, true, 'Guided tour is still covering the dashboard');
  },

};

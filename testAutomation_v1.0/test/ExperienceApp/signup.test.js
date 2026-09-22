"use strict";
// SNUP — Cambridge One signup (migrated from playwright-automation-c1, 2026-09-22).
// TC_1..58 were retired unbuilt (Q1); functional TCs continue from TC_59, TC_100+ = housekeeping.
// E-mails come in as {{run.*}} tokens resolved by the runner (ADR-022).
var signup = require("../../pages/ExperienceApp/signup.page.js");
var mailsacUI = require("../../pages/ExperienceApp/mailsacUI.page.js");
var dashboard = require("../../pages/ExperienceApp/dashboard.page.js");
var sts;

module.exports = {
  // Role selection + confirm dialog → the role's next screen (Teacher: profile form, Learner: age gate).
  TST_SNUP_TC_59: async function (testdata) {
    sts = await signup.select_role(testdata.role);
    await assertion.assertEqual(sts.roleSelected, true, "Role '" + testdata.role + "' could not be selected / confirm dialog did not open");
    await assertion.assert(
      typeof sts.confirmText === "string" && sts.confirmText.indexOf(testdata.role) !== -1,
      "Confirm dialog does not name the chosen role '" + testdata.role + "': " + sts.confirmText
    );
    sts = await signup.click_confirmRole();
    await assertion.assertEqual(sts.nextScreen, testdata.expectedScreen, "Wrong screen after confirming role '" + testdata.role + "'");
  },

  // Profile form + Sign up → verification-pending screen echoes the same e-mail. Creates the account.
  TST_SNUP_TC_60: async function (testdata) {
    sts = await signup.set_profileForm(testdata);
    await assertion.assertEqual(sts.formFilled, true, "Profile form could not be filled: " + sts.failedAt);
    await assertion.assertEqual(sts.termsTicked, true, "Terms of use checkbox is not ticked");
    sts = await signup.click_signUpSubmit();
    await assertion.assertEqual(sts.pendingScreen, true, "Verification-pending screen did not appear after Sign up");
    await assertion.assertEqual(sts.pendingEmail, testdata.email, "Verification-pending screen shows a different e-mail");
  },

  // Mailsac: the verification mail arrives and its link brings the user back to Cambridge One.
  TST_SNUP_TC_61: async function (testdata) {
    sts = await mailsacUI.loginToMailsac(testdata.mailsacUser, testdata.mailsacPassword);
    await assertion.assertEqual(sts.pageStatus, true, "Mailsac login failed");
    sts = await mailsacUI.openVerificationLink(testdata.email, testdata.mailTimeoutMs);
    await assertion.assertEqual(sts.mailFound, true, "Verification mail for " + testdata.email + " did not arrive");
    await assertion.assert(typeof sts.verifyHref === "string", "Verification link not found in the mail");
    await assertion.assertEqual(sts.landedOnApp, true, "Verification link did not land on Cambridge One: " + sts.landedUrl);
  },

  // Learner age + location gate: country and age accepted → the learner profile form opens.
  TST_SNUP_TC_63: async function (testdata) {
    sts = await signup.set_learnerAgeGate(testdata.country, testdata.age);
    await assertion.assertEqual(sts.ageSelected, true, "Age '" + testdata.age + "' could not be selected");
    await assertion.assertEqual(sts.profileFormShown, true, "Learner profile form did not open after the age gate");
  },

  // Verified learner's first landing: the welcome screen offers Continue.
  TST_SNUP_TC_64: async function (testdata) {
    sts = await dashboard.getData_learnerWelcome();
    await assertion.assertEqual(sts.continueShown, true, "Learner welcome screen (Continue) not shown after verification");
    await assertion.assertEqual(sts.tourClosed, true, "Guided tour is still covering the learner welcome screen");
  },

  // Verified teacher's first landing: welcome tour can be closed and "Complete your account" is offered.
  TST_SNUP_TC_62: async function (testdata) {
    sts = await dashboard.dismiss_introTour_getTeacherSetupPrompt();
    await assertion.assertEqual(sts.tourClosed, true, "IntroJS welcome tour is still covering the dashboard");
    await assertion.assertEqual(sts.completeAccountShown, true, "'Complete your account' is not offered to the new teacher");
  },
};

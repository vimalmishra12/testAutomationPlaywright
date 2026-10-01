'use strict';
var onboardingB3Page = require('../../pages/ExperienceApp/onboardingBatch3.page.js');
var mailsacUI = require('../../pages/ExperienceApp/mailsacUI.page.js');
var dashboard = require('../../pages/ExperienceApp/dashboard.page.js');
var sts;

module.exports = {
  /**
   * TST_SNUP_TC_77: Verify validation errors and Terms alert are shown when Teacher form is submitted incomplete.
   * Required fields: First name, Last name, Location. Invalid email and weak password errors. Terms unchecked alert.
   */
  TST_SNUP_TC_77: async function (testdata) {
    const data = testdata;
    sts = await onboardingB3Page.fill_teacher_form_incomplete(data);
    await assertion.assertEqual(sts.submitted, true, 'Failed to click Sign up submit button on Teacher form');

    const errData = await onboardingB3Page.getData_teacherFormValidationErrors();
    await assertion.assertEqual(errData.stayedOnForm, true, 'User should stay on Teacher registration form (/register-teacher)');
    await assertion.assertEqual(errData.hasRequiredErrors, true, "Expected required-field errors ('This field is required') for First name, Last name, and Location");
    await assertion.assertEqual(errData.hasInvalidEmail, true, "Expected 'E-mail address is invalid.' error for Work email");
    await assertion.assertEqual(errData.hasWeakPassword, true, "Expected 'Password does not meet complexity requirements' for weak password");
    await assertion.assertEqual(errData.hasTermsAlert, true, "Expected alert prompting user to read and confirm Privacy notice and Terms of use");
  },

  /**
   * TST_SNUP_TC_75: Verify the Parent form does not submit when 'parent or guardian' checkbox is left unchecked.
   * All fields valid, Terms checked, but guardian checkbox unchecked.
   */
  TST_SNUP_TC_75: async function (testdata) {
    const data = testdata;
    sts = await onboardingB3Page.fill_parent_form_without_guardian(data);
    await assertion.assertEqual(sts.submitted, true, 'Failed to click Sign up submit button on Parent form');

    const errData = await onboardingB3Page.getData_parentFormValidationErrors();
    await assertion.assertEqual(errData.stayedOnForm, true, 'Form must not submit without guardian consent — user should remain on /register-parent');
    await assertion.assertEqual(errData.guardianError, true, "Expected 'parent or guardian' checkbox container to highlight with validation error state (.parent-error)");
  },

  /**
   * TST_SNUP_TC_72: Verify a Learner (16+, India) account is created and reaches learner dashboard
   * when form is submitted and verified.
   */
  TST_SNUP_TC_72: async function (testdata) {
    // 1. Verify locked location & submit learner form
    sts = await onboardingB3Page.verify_and_fill_learner_signup_form(testdata.form);
    await assertion.assertEqual(sts.locationPreFilledAndDisabled, true, "Learner Location field is not pre-filled with 'India' or is not disabled/locked");
    await assertion.assertEqual(sts.pendingScreen, true, "Verification-pending screen did not appear after Learner sign up");
    await assertion.assertEqual(sts.pendingEmail, testdata.form.email, "Verification-pending screen shows a different email");

    // 2. Open verification link from Mailsac
    sts = await mailsacUI.loginToMailsac(testdata.mailsac.mailsacUser, testdata.mailsac.mailsacPassword);
    await assertion.assertEqual(sts.pageStatus, true, "Mailsac login failed");
    sts = await mailsacUI.openVerificationLink(testdata.form.email, testdata.mailsac.mailTimeoutMs || 300000);
    await assertion.assertEqual(sts.mailFound, true, "Verification mail for " + testdata.form.email + " did not arrive");
    await assertion.assertEqual(sts.landedOnApp, true, "Verification link did not land on Cambridge One: " + sts.landedUrl);

    // 3. Confirm landing on learner welcome / dashboard
    sts = await dashboard.getData_learnerWelcome();
    await assertion.assertEqual(sts.continueShown, true, "Learner welcome screen (Continue) not shown after verification");
  },

  /**
   * TST_SNUP_TC_73: Verify a Teacher account is created and reaches teacher dashboard
   * when form is submitted and verified.
   */
  TST_SNUP_TC_73: async function (testdata) {
    // 1. Verify Teacher form has no age gate & submit
    sts = await onboardingB3Page.verify_and_fill_teacher_signup_form(testdata.form);
    await assertion.assertEqual(sts.noAgeGate, true, "Teacher registration form should not have an age gate");
    await assertion.assertEqual(sts.pendingScreen, true, "Verification-pending screen did not appear after Teacher sign up");
    await assertion.assertEqual(sts.pendingEmail, testdata.form.email, "Verification-pending screen shows a different email");

    // 2. Open verification link from Mailsac
    sts = await mailsacUI.loginToMailsac(testdata.mailsac.mailsacUser, testdata.mailsac.mailsacPassword);
    await assertion.assertEqual(sts.pageStatus, true, "Mailsac login failed");
    sts = await mailsacUI.openVerificationLink(testdata.form.email, testdata.mailsac.mailTimeoutMs || 300000);
    await assertion.assertEqual(sts.mailFound, true, "Verification mail for " + testdata.form.email + " did not arrive");
    await assertion.assertEqual(sts.landedOnApp, true, "Verification link did not land on Cambridge One: " + sts.landedUrl);

    // 3. Confirm teacher dashboard & Complete your account prompt
    sts = await dashboard.dismiss_introTour_getTeacherSetupPrompt();
    await assertion.assertEqual(sts.completeAccountShown, true, "'Complete your account' is not offered to the new teacher");
  },

  /**
   * TST_SNUP_TC_74: Verify a Parent account is created and reaches parent dashboard
   * when form is submitted and verified.
   */
  TST_SNUP_TC_74: async function (testdata) {
    // 1. Verify Parent form has no age gate and has guardian checkbox & submit
    sts = await onboardingB3Page.verify_and_fill_parent_signup_form(testdata.form);
    await assertion.assertEqual(sts.noAgeGate, true, "Parent registration form should not have an age gate");
    await assertion.assertEqual(sts.hasGuardianCheckbox, true, "Parent registration form must have the 'parent or guardian' consent checkbox");
    await assertion.assertEqual(sts.pendingScreen, true, "Verification-pending screen did not appear after Parent sign up");
    await assertion.assertEqual(sts.pendingEmail, testdata.form.email, "Verification-pending screen shows a different email");

    // 2. Open verification link from Mailsac
    sts = await mailsacUI.loginToMailsac(testdata.mailsac.mailsacUser, testdata.mailsac.mailsacPassword);
    await assertion.assertEqual(sts.pageStatus, true, "Mailsac login failed");
    sts = await mailsacUI.openVerificationLink(testdata.form.email, testdata.mailsac.mailTimeoutMs || 300000);
    await assertion.assertEqual(sts.mailFound, true, "Verification mail for " + testdata.form.email + " did not arrive");
    await assertion.assertEqual(sts.landedOnApp, true, "Verification link did not land on Cambridge One: " + sts.landedUrl);

    // 3. Confirm parent dashboard
    sts = await onboardingB3Page.verify_parent_dashboard();
    await assertion.assertEqual(sts.dashboardLoaded, true, "Parent dashboard was not reached after verification");
  },

  /**
   * TST_RESE_TC_9: Verify user can set a new password via emailed reset link and log in with it.
   */
  TST_RESE_TC_9: async function (testdata) {
    const email = testdata.email;
    const newPassword = testdata.newPassword;
    const mailsacUser = testdata.mailsac.mailsacUser;
    const mailsacPassword = testdata.mailsac.mailsacPassword;

    // 1. Submit reset password request
    sts = await onboardingB3Page.request_password_reset(email);
    await assertion.assertEqual(sts.requested, true, "Failed to submit reset password request for " + email);

    // 2. Open reset link in Mailsac
    sts = await mailsacUI.loginToMailsac(mailsacUser, mailsacPassword);
    await assertion.assertEqual(sts.pageStatus, true, "Mailsac login failed");
    sts = await mailsacUI.openPasswordResetLink(email, testdata.mailsac.mailTimeoutMs || 300000);
    await assertion.assertEqual(sts.mailFound, true, "Password reset email for " + email + " did not arrive");
    await assertion.assertEqual(sts.landedOnApp, true, "Reset link did not land on Cambridge One: " + sts.landedUrl);

    // 3. Set new password, confirm modal, and click Back to login
    sts = await onboardingB3Page.set_new_password_and_confirm(newPassword);
    await assertion.assertEqual(sts.resetCompleted, true, "Failed to save new password and confirm");
    await assertion.assertEqual(sts.backToLogin, true, "Failed to navigate back to login screen after password reset");

    // 4. Log in with the new password and verify dashboard
    sts = await onboardingB3Page.login_with_credentials(email, newPassword);
    await assertion.assertEqual(sts.loginSuccess, true, "Login with newly reset password failed for " + email + ". Landed URL: " + sts.url);
  },

  /**
   * TST_RESE_TC_10: Verify fresh login succeeds with the newly reset password after logging out.
   */
  TST_RESE_TC_10: async function (testdata) {
    const email = testdata.email;
    const newPassword = testdata.newPassword;

    // 1. Log out from current session
    sts = await onboardingB3Page.logout_user();
    await assertion.assertEqual(sts.loggedOut, true, "Failed to log out user");

    // 2. Fresh login with the newly reset password
    sts = await onboardingB3Page.login_with_credentials(email, newPassword);
    await assertion.assertEqual(sts.loginSuccess, true, "Fresh login with reset password failed for " + email + ". Landed URL: " + sts.url);
  },

  /**
   * TST_PCHD_TC_2: Verify 'Next' does not proceed on 'Create my child's account'
   * while a required field or the consent checkbox is missing.
   */
  TST_PCHD_TC_2: async function (testdata) {
    sts = await onboardingB3Page.ensure_parent_on_child_creation(testdata.parentEmail, testdata.parentPassword);
    await assertion.assertEqual(sts.ready, true, "Failed to navigate to 'Create my child's account' iframe");

    sts = await onboardingB3Page.verify_child_form_validation(testdata);
    await assertion.assertEqual(sts.blankHasRequired, true, "Expected required-field errors on blank child registration submission");
    await assertion.assertEqual(sts.stayedOnSubscreen1, true, "Form must not proceed to subscreen 2 without ticking consent checkbox");
  },

  /**
   * TST_PCHD_TC_1: Verify a Parent can create a child's account from 'My children'.
   */
  TST_PCHD_TC_1: async function (testdata) {
    sts = await onboardingB3Page.ensure_parent_on_child_creation(testdata.parentEmail, testdata.parentPassword);
    await assertion.assertEqual(sts.ready, true, "Failed to navigate to 'Create my child's account' iframe");

    sts = await onboardingB3Page.create_child_account(testdata);
    await assertion.assertEqual(sts.created, true, "Child account creation confirmation did not display");
    await assertion.assertEqual(sts.hasCreatedText, true, "Confirmation screen missing 'Your child’s account has been created' message");
    await assertion.assertEqual(sts.hasUsername, true, "Confirmation screen missing the newly created child's username: " + testdata.username);
  },

  /**
   * TST_PCHD_TC_3: Verify a newly created child's account reaches a learner dashboard when it logs in for the first time.
   */
  TST_PCHD_TC_3: async function (testdata) {
    sts = await onboardingB3Page.verify_child_first_login(testdata);
    await assertion.assertEqual(sts.learnerDashboardLoaded, true, "Child did not reach Learner dashboard on first login. Landed URL: " + sts.url);

    // Clean up session
    await onboardingB3Page.logout_user();
  },

  /**
   * TST_INVI_TC_14: Verify a not-yet-registered invitee can sign up from the class invite e-mail's 'View invite' link.
   */
  TST_INVI_TC_14: async function (testdata) {
    sts = await onboardingB3Page.signup_from_class_invite(testdata);
    await assertion.assertEqual(sts.invited, true, "Teacher could not invite student or pending invite not shown");
    await assertion.assertEqual(sts.mailFound, true, "Class invite email did not arrive in Mailsac inbox");
    await assertion.assertEqual(sts.signupCompleted, true, "Sign up from class invite link did not complete. Landed URL: " + sts.finalUrl);
    await assertion.assertEqual(sts.emailVerified, true, "Verification mail could not be verified in Mailsac for " + testdata.inviteeEmail);
  },

  /**
   * TST_INVI_TC_15: Verify a logged-in, already-registered learner lands on their own dashboard when opening a class invite link.
   */
  TST_INVI_TC_15: async function (testdata) {
    sts = await onboardingB3Page.verify_registered_learner_invite(testdata);
    await assertion.assertEqual(sts.mailFound, true, "Class invite email did not arrive in Mailsac inbox");
    await assertion.assertEqual(sts.redirectedToDashboard, true, "Logged-in learner opening invite link did not land on dashboard. Final URL: " + sts.finalUrl);
  },

  /**
   * TST_SPRF_TC_24: Verify an Admin can set a temporary password for a student from Students tab / Manage learner profile.
   */
  TST_SPRF_TC_24: async function (testdata) {
    sts = await onboardingB3Page.admin_set_temporary_password(testdata);
    await assertion.assertEqual(sts.actionMenuOpened, true, "Failed to open student action menu in Admin Students tab");
    await assertion.assertEqual(sts.passwordInputSet, true, "Failed to access Password tab / input temporary password for student");
  },

  /**
   * TST_CREA_TC_31: Verify a Teacher can set a temporary password for an enrolled student from the class roster's 'Change password'.
   */
  TST_CREA_TC_31: async function (testdata) {
    sts = await onboardingB3Page.teacher_verify_change_password_roster(testdata);
    await assertion.assertEqual(sts.rosterAccessed, true, "Failed to navigate to teacher class roster");
    await assertion.assertEqual(sts.optionsMenuAvailable, true, "Student options / Actions menu not displayed on class roster");
  }
};


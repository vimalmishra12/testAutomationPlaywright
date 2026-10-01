'use strict';
var onboardingPage = require('../../pages/ExperienceApp/onboardingBatch1.page.js');
var landing = require('../../pages/ExperienceApp/landing.page.js');
var sts;

module.exports = {
  TST_LAND_TC_6: async function () {
    sts = await onboardingPage.getData_homepageElements();
    await assertion.assertEqual(sts.brandLogo, true, "Header brand logo not found");
    await assertion.assertEqual(sts.languageDropdown, true, "Header language selector not found");
    await assertion.assertEqual(sts.loginBtn, true, "Login button not found");
    await assertion.assertEqual(sts.signupBtn, true, "Sign up button not found");
    await assertion.assert(sts.headingText && sts.headingText.length > 0, "Heading text missing");
    await assertion.assertEqual(sts.footerTermsOfUse, true, "Terms of Use link not found");
    await assertion.assertEqual(sts.footerPrivacyNotice, true, "Privacy Notice link not found");
    await assertion.assertEqual(sts.footerAccessibility, true, "Accessibility link not found");
  },

  TST_LAND_TC_7: async function (testdata) {
    var targetLang = (testdata && testdata.lang) || (typeof testdata === 'string' ? testdata : "Español");
    sts = await landing.click_languageSelector_dropdown(targetLang);
    await assertion.assertEqual(sts, true, "Language selector could not be set to " + targetLang);
    var revertLang = (testdata && testdata.revertLang) || "English";
    sts = await landing.click_languageSelector_dropdown(revertLang);
    await assertion.assertEqual(sts, true, "Language selector could not be reverted back to " + revertLang);
  },

  TST_FOOT_TC_4: async function () {
    sts = await onboardingPage.click_footerOurApproaches();
    await assertion.assertEqual(sts.pageStatus, true, "Our Approaches external page failed to launch in new tab or refocus");
  },

  TST_FOOT_TC_6: async function () {
    sts = await onboardingPage.click_footerFAQs();
    await assertion.assertEqual(sts.pageStatus, true, "FAQs external page failed to launch in new tab or refocus");
  },

  TST_FOOT_TC_8: async function () {
    sts = await onboardingPage.click_footerHelp();
    await assertion.assertEqual(sts.pageStatus, true, "Help external page failed to launch in new tab or refocus");
  },

  TST_LOGI_TC_7: async function () {
    sts = await onboardingPage.click_login_submit_blank();
    await assertion.assertEqual(sts.onLoginPage, true, "User should stay on login page after blank submission");
    await assertion.assert(sts.errors && sts.errors.length > 0, "No active validation errors displayed on blank login submission");
    const errorsJoined = sts.errors.join(' | ').toLowerCase();
    await assertion.assert(
      errorsJoined.includes('username') || errorsJoined.includes('email') || errorsJoined.includes('enter your'),
      "Username/email validation error missing: " + sts.errors.join('; ')
    );
    await assertion.assert(
      errorsJoined.includes('password'),
      "Password validation error missing: " + sts.errors.join('; ')
    );
  },

  TST_LOGI_TC_10: async function (testdata) {
    var password = (testdata && testdata.password) || "TestPassword123";
    sts = await onboardingPage.toggle_password_visibility(password);
    await assertion.assertEqual(sts.typeBefore, "password", "Initial password input type was not password");
    await assertion.assertEqual(sts.typeRevealed, "text", "Password was not revealed (type was not text) after toggle click");
    await assertion.assertEqual(sts.typeMasked, "password", "Password was not masked (type was not password) after second toggle click");
  },

  TST_SNUP_TC_65: async function () {
    sts = await onboardingPage.verify_roles_and_next_disabled();
    await assertion.assertEqual(sts.rolesPresent, true, "Role selection screen must show Teacher, Learner, and Parent roles");
    await assertion.assertEqual(sts.nextDisabled, true, "Next button should be disabled until a role is selected");
  },

  TST_SNUP_TC_66: async function (testdata) {
    var role = (testdata && testdata.role) || "Learner";
    sts = await onboardingPage.select_role_and_open_confirm(role);
    await assertion.assertEqual(sts.dialogOpened, true, "Role confirmation modal did not open");
    await assertion.assert(
      sts.dialogText && sts.dialogText.toLowerCase().includes(role.toLowerCase()),
      "Role confirmation modal does not name the selected role '" + role + "': " + sts.dialogText
    );
  },

  TST_SNUP_TC_67: async function (testdata) {
    var role = (testdata && testdata.role) || "Learner";
    sts = await onboardingPage.dismiss_role_confirm_go_back(role);
    await assertion.assertEqual(sts.dialogClosed, true, "Role confirmation dialog failed to close on 'No, go back'");
    await assertion.assertEqual(sts.rolePreserved, true, "Role selection was not preserved after closing dialog");
  },

  TST_SNUP_TC_68: async function () {
    sts = await onboardingPage.click_role_page_login_link();
    await assertion.assertEqual(sts.landedOnLogin, true, "Login link on role selection page failed to navigate to Login page");
  },

  TST_SNUP_TC_69: async function (testdata) {
    var role = (testdata && testdata.role) || "Learner";
    sts = await onboardingPage.navigate_to_age_check(role);
    await assertion.assertEqual(sts.onAgeCheck, true, "Learner role did not navigate to age check screen");
  },

  TST_SNUP_TC_71: async function () {
    sts = await onboardingPage.verify_country_age_thresholds();
    await assertion.assertEqual(sts.thresholdVerified, true, "Age dropdown threshold options not found on age check screen");
  },

  TST_SNUP_TC_70: async function (testdata) {
    var country = (testdata && testdata.country) || "Spain";
    var age = (testdata && testdata.age) || "12";
    sts = await onboardingPage.verify_underage_blocked(country, age);
    await assertion.assertEqual(sts.underageBlocked, true, "Underage learner was not blocked by age gate");
  },

  TST_SNUP_TC_76: async function () {
    sts = await onboardingPage.navigate_to_learner_profile_and_validate_blank();
    await assertion.assertEqual(sts.onProfileForm, true, "Eligible learner did not reach registration profile form");
    await assertion.assertEqual(sts.errorsDisplayed, true, "Required field errors not displayed on blank registration form");
    await assertion.assert(sts.errors && sts.errors.length > 0, "No error texts captured on blank registration submission");
  },

  TST_SNUP_TC_78: async function () {
    sts = await onboardingPage.click_registration_login_link();
    await assertion.assertEqual(sts.landedOnLogin, true, "Login link on registration form failed to navigate to Login page");
  }
};


'use strict';
var onboardingB2Page = require('../../pages/ExperienceApp/onboardingBatch2.page.js');
var sts;

module.exports = {
  TST_RESE_TC_7: async function (testdata) {
    const email = (testdata && testdata.registeredEmail) || (typeof testdata === 'string' ? testdata : 'prod_stu_auto@mailsac.com');
    sts = await onboardingB2Page.submit_reset_password(email);
    await assertion.assertEqual(sts.submitted, true, 'Failed to submit reset password form for registered email');
    
    const confirmData = await onboardingB2Page.getData_resetPasswordConfirmation();
    await assertion.assert(
      confirmData.heading && confirmData.heading.toLowerCase().includes('reset password email sent'),
      `Expected heading 'Reset password email sent' but got: '${confirmData.heading}'`
    );
    await assertion.assert(
      confirmData.message && confirmData.message.toLowerCase().includes('linked to a cambridge account'),
      `Expected message body to mention 'linked to a Cambridge account' but got: '${confirmData.message}'`
    );
  },

  TST_RESE_TC_8: async function (testdata) {
    const email = (testdata && testdata.unregisteredEmail) || (typeof testdata === 'string' ? testdata : 'qa-unregistered-probe@mailsac.com');
    sts = await onboardingB2Page.submit_reset_password(email);
    await assertion.assertEqual(sts.submitted, true, 'Failed to submit reset password form for unregistered email');

    const confirmData = await onboardingB2Page.getData_resetPasswordConfirmation();
    await assertion.assert(
      confirmData.heading && confirmData.heading.toLowerCase().includes('reset password email sent'),
      `Expected generic heading 'Reset password email sent' for unregistered email but got: '${confirmData.heading}'`
    );
    await assertion.assert(
      confirmData.message && confirmData.message.toLowerCase().includes('linked to a cambridge account'),
      `Expected generic message for unregistered email but got: '${confirmData.message}'`
    );
  },

  TST_LOGI_TC_6: async function () {
    sts = await onboardingB2Page.click_dont_have_account_link();
    await assertion.assertEqual(sts.pageStatus, true, "Clicking 'Don\\'t have an account yet?' did not navigate to Sign up role selection");
  },

  TST_RESE_TC_4: async function () {
    sts = await onboardingB2Page.click_confirm_back_to_login();
    await assertion.assertEqual(sts.pageStatus, true, "Clicking 'Back to login' from confirmation screen did not navigate to Login page");
  },

  TST_LAND_TC_8: async function () {
    sts = await onboardingB2Page.navigateTo_loginPrimary();
    await assertion.assertEqual(sts.pageStatus, true, "Failed to navigate to /login-primary");

    const data = await onboardingB2Page.getData_loginPrimary();
    await assertion.assertEqual(data.containerVisible, true, "Primary login container #nemo-login-primary not displayed");
    await assertion.assertEqual(data.headerTitle, "Welcome to Cambridge One", "Primary login header title mismatch");
    await assertion.assertEqual(data.submitBtnVisible, true, "Primary login submit button 'Go!' not displayed");
    await assertion.assertEqual(data.cantLoginVisible, true, "Can't log in link not displayed on primary login");
    await assertion.assertEqual(data.brandLogo, true, "Header brand logo not displayed on primary login");
    await assertion.assertEqual(data.footerTermsOfUse, true, "Footer Terms of use not displayed on primary login");
    await assertion.assertEqual(data.footerPrivacyNotice, true, "Footer Privacy notice not displayed on primary login");
    await assertion.assertEqual(data.footerAccessibility, true, "Footer Accessibility not displayed on primary login");
    await assertion.assertEqual(data.footerCambridgeOneSchool, true, "Footer Cambridge One for Schools not displayed on primary login");
  },

  TST_LAND_TC_9: async function () {
    sts = await onboardingB2Page.navigateTo_loginSecondary();
    await assertion.assertEqual(sts.pageStatus, true, "Failed to navigate to /login-secondary");

    const data = await onboardingB2Page.getData_loginSecondary();
    await assertion.assertEqual(data.containerVisible, true, "Secondary login container #nemo-login-secondary not displayed");
    await assertion.assertEqual(data.headerTitle, "Welcome to Cambridge One", "Secondary login header title mismatch");
    await assertion.assertEqual(data.submitBtnVisible, true, "Secondary login submit button 'Go!' not displayed");
    await assertion.assertEqual(data.cantLoginVisible, true, "Can't log in link not displayed on secondary login");
    await assertion.assertEqual(data.brandLogo, true, "Header brand logo not displayed on secondary login");
    await assertion.assertEqual(data.footerTermsOfUse, true, "Footer Terms of use not displayed on secondary login");
    await assertion.assertEqual(data.footerPrivacyNotice, true, "Footer Privacy notice not displayed on secondary login");
    await assertion.assertEqual(data.footerAccessibility, true, "Footer Accessibility not displayed on secondary login");
    await assertion.assertEqual(data.footerCambridgeOneSchool, true, "Footer Cambridge One for Schools not displayed on secondary login");
  },

  TST_LOGI_TC_8: async function (testdata) {
    const email = (testdata && testdata.email) || 'prod_stu_auto@mailsac.com';
    const password = (testdata && testdata.invalidPassword) || 'WrongPassword123!';
    sts = await onboardingB2Page.submit_invalid_login(email, password);
    await assertion.assertEqual(sts.submitted, true, 'Failed to submit invalid login credentials');

    const alertData = await onboardingB2Page.getData_loginFormErrorAlert();
    await assertion.assertEqual(alertData.visible, true, 'Generic login error alert not displayed');
    await assertion.assert(
      alertData.message && alertData.message.includes('Please check your login and password and try again. You are limited to 5 attempts, or you can reset your password'),
      `Expected alert message to mention 'limited to 5 attempts' but got: '${alertData.message}'`
    );
    await assertion.assert(
      alertData.url.includes('/login'),
      `Expected user to stay on /login but got: '${alertData.url}'`
    );
  },

  TST_LOGI_TC_14: async function (testdata) {
    const email = (testdata && testdata.email) || 'prod_admin_mqa@yopmail.com';
    const password = (testdata && testdata.password) || 'Compro11';
    sts = await onboardingB2Page.login_as_school_admin(email, password);
    await assertion.assertEqual(sts.success, true, `Admin login did not navigate to /admin/admin/ dashboard. Current URL: ${sts.url}`);
    await assertion.assert(
      sts.url.includes('/admin/admin/'),
      `Expected URL to contain '/admin/admin/' but got: '${sts.url}'`
    );
  },

  TST_LOGI_TC_9: async function (testdata) {
    const email = (testdata && testdata.email) || 'cqatestuserforblockDND@mailsac.com';
    const password = (testdata && testdata.password) || 'Compro11';
    sts = await onboardingB2Page.verify_account_lockout(email, password);

    // Validate that early attempts reference the 5 attempts limit
    await assertion.assert(
      sts.attempts[0].text.includes('limited to 5 attempts'),
      `Expected attempt 1 alert to mention 'limited to 5 attempts' but got: '${sts.attempts[0].text}'`
    );

    // Validate that 6th attempt with correct password is still rejected with temporary lockout message
    await assertion.assert(
      sts.sixthAttempt.locked,
      `Expected 6th attempt with correct password to be rejected with lockout message, but got: '${sts.sixthAttempt.text}'`
    );
    await assertion.assert(
      sts.sixthAttempt.url.includes('/login'),
      `Expected user to remain on /login after 6th attempt but got: '${sts.sixthAttempt.url}'`
    );
  }
};

'use strict';
var action = require('../../core/actionLibrary/baseActionLibrary.js');
var selectorFile = jsonParserUtil.jsonParser(selectorDir);
var ob = selectorFile.css.ComproC1.onboarding;

module.exports = {
  forgotPasswordEmailInput: ob.forgotPasswordEmailInput,
  forgotPasswordSubmitBtn: ob.forgotPasswordSubmitBtn,
  forgotPasswordConfirmHeading: ob.forgotPasswordConfirmHeading,
  forgotPasswordConfirmBody: ob.forgotPasswordConfirmBody,
  loginDontHaveAccountLink: ob.loginDontHaveAccountLink,
  forgotPasswordBackToLogin: ob.forgotPasswordBackToLogin,
  primaryLoginContainer: ob.primaryLoginContainer,
  secondaryLoginContainer: ob.secondaryLoginContainer,
  childLoginHeader: ob.childLoginHeader,
  childLoginSubmitBtn: ob.childLoginSubmitBtn,
  childCantLoginLink: ob.childCantLoginLink,
  childBrandLogo: ob.childBrandLogo,
  loginFormErrorAlert: ob.loginFormErrorAlert,
  userName_tbox: selectorFile.css.ComproC1.login.userName_tbox,
  password_tbox: selectorFile.css.ComproC1.login.password_tbox,
  login_btn: selectorFile.css.ComproC1.login.login_btn,

  isInitialized: async function () {
    await logger.logInto(await stackTrace.get());
    await action.waitForDocumentLoad();
    return { pageStatus: true };
  },

  submit_reset_password: async function (email) {
    await logger.logInto(await stackTrace.get(), `Submitting reset password for: ${email}`);
    await action.waitForDocumentLoad();
    await action.waitForDisplayed(this.forgotPasswordEmailInput, 10000);
    if (global.browser && global.browser.pause) await global.browser.pause(1000);
    await action.click(this.forgotPasswordEmailInput);
    await action.clearValue(this.forgotPasswordEmailInput);
    await action.addValue(this.forgotPasswordEmailInput, email);
    if (global.browser && global.browser.pause) await global.browser.pause(1000);
    
    await action.waitForDisplayed(this.forgotPasswordSubmitBtn, 5000);
    const clickRes = await action.click(this.forgotPasswordSubmitBtn);
    if (!clickRes) {
      await logger.logInto(await stackTrace.get(), 'Reset password submit button click failed', 'error');
      return { submitted: false };
    }
    
    // Wait for the confirmation heading to display
    const headingDisplayed = await action.waitForDisplayed(this.forgotPasswordConfirmHeading, 20000);
    if (global.browser && global.browser.pause) await global.browser.pause(2000);
    return { submitted: headingDisplayed };
  },

  getData_resetPasswordConfirmation: async function () {
    await logger.logInto(await stackTrace.get());
    const isHeadingVis = await action.isDisplayed(this.forgotPasswordConfirmHeading);
    const headingText = isHeadingVis ? (await action.getText(this.forgotPasswordConfirmHeading)).trim() : '';

    const isBodyVis = await action.isDisplayed(this.forgotPasswordConfirmBody);
    const bodyText = isBodyVis ? (await action.getText(this.forgotPasswordConfirmBody)).trim() : '';

    return {
      heading: headingText,
      message: bodyText
    };
  },

  click_dont_have_account_link: async function () {
    await logger.logInto(await stackTrace.get());
    await action.waitForDocumentLoad();
    await action.waitForDisplayed(this.loginDontHaveAccountLink, 10000);
    if (global.browser && global.browser.pause) await global.browser.pause(1000);
    const res = await action.click(this.loginDontHaveAccountLink);
    if (res === true) {
      await logger.logInto(await stackTrace.get(), 'loginDontHaveAccountLink clicked, waiting for role selection screen');
      const signUpPage = require('./signUp.page.js');
      const initRes = await signUpPage.isInitialized();
      if (global.browser && global.browser.pause) await global.browser.pause(2000);
      return { pageStatus: initRes && initRes.pageStatus !== false };
    }
    return { pageStatus: false };
  },

  click_confirm_back_to_login: async function () {
    await logger.logInto(await stackTrace.get());
    await action.waitForDocumentLoad();
    await action.waitForDisplayed(this.forgotPasswordBackToLogin, 10000);
    if (global.browser && global.browser.pause) await global.browser.pause(1000);
    const res = await action.click(this.forgotPasswordBackToLogin);
    if (res === true) {
      await logger.logInto(await stackTrace.get(), 'Back to login clicked from confirmation screen');
      const loginPage = require('./login.page.js');
      const initRes = await loginPage.isInitialized();
      if (global.browser && global.browser.pause) await global.browser.pause(1000);
      return { pageStatus: initRes && initRes.pageStatus !== false };
    }
    return { pageStatus: false };
  },

  navigateTo_loginPrimary: async function () {
    await logger.logInto(await stackTrace.get(), 'Navigating to /login-primary');
    await browser.url('/login-primary');
    await action.waitForDocumentLoad();
    await action.waitForDisplayed(this.primaryLoginContainer, 15000);
    if (global.browser && global.browser.pause) await global.browser.pause(1500);
    return { pageStatus: true };
  },

  getData_loginPrimary: async function () {
    await logger.logInto(await stackTrace.get());
    const footer = require('./footer.page.js');
    
    const containerVis = await action.isDisplayed(this.primaryLoginContainer);
    const headerTitle = (await action.getText(this.childLoginHeader)).trim();
    const submitVis = await action.isDisplayed(this.childLoginSubmitBtn);
    const cantLoginVis = await action.isDisplayed(this.childCantLoginLink);
    const brandLogoVis = await action.isDisplayed(this.childBrandLogo);
    const footerData = await footer.getData_footerPage();

    return {
      containerVisible: containerVis,
      headerTitle: headerTitle,
      submitBtnVisible: submitVis,
      cantLoginVisible: cantLoginVis,
      brandLogo: brandLogoVis,
      footerTermsOfUse: footerData.footerTermsOfUse !== null,
      footerPrivacyNotice: footerData.footerPrivacyNotice !== null,
      footerAccessibility: footerData.footerAccesibility !== null,
      footerCambridgeOneSchool: footerData.footerCambridgeOneSchool !== null,
      footerCopyright: footerData.footerCambridgeUniversity !== null
    };
  },

  navigateTo_loginSecondary: async function () {
    await logger.logInto(await stackTrace.get(), 'Navigating to /login-secondary');
    await browser.url('/login-secondary');
    await action.waitForDocumentLoad();
    await action.waitForDisplayed(this.secondaryLoginContainer, 15000);
    if (global.browser && global.browser.pause) await global.browser.pause(1500);
    return { pageStatus: true };
  },

  getData_loginSecondary: async function () {
    await logger.logInto(await stackTrace.get());
    const footer = require('./footer.page.js');
    
    const containerVis = await action.isDisplayed(this.secondaryLoginContainer);
    const headerTitle = (await action.getText(this.childLoginHeader)).trim();
    const submitVis = await action.isDisplayed(this.childLoginSubmitBtn);
    const cantLoginVis = await action.isDisplayed(this.childCantLoginLink);
    const brandLogoVis = await action.isDisplayed(this.childBrandLogo);
    const footerData = await footer.getData_footerPage();

    return {
      containerVisible: containerVis,
      headerTitle: headerTitle,
      submitBtnVisible: submitVis,
      cantLoginVisible: cantLoginVis,
      brandLogo: brandLogoVis,
      footerTermsOfUse: footerData.footerTermsOfUse !== null,
      footerPrivacyNotice: footerData.footerPrivacyNotice !== null,
      footerAccessibility: footerData.footerAccesibility !== null,
      footerCambridgeOneSchool: footerData.footerCambridgeOneSchool !== null,
      footerCopyright: footerData.footerCambridgeUniversity !== null
    };
  },

  submit_invalid_login: async function (email, password) {
    await logger.logInto(await stackTrace.get(), `Submitting invalid login for: ${email}`);
    await action.waitForDocumentLoad();
    await action.waitForDisplayed(this.userName_tbox, 10000);
    if (global.browser && global.browser.pause) await global.browser.pause(1000);
    await action.setValue(this.userName_tbox, email);
    if (global.browser && global.browser.pause) await global.browser.pause(1000);
    await action.setValue(this.password_tbox, password);
    if (global.browser && global.browser.pause) await global.browser.pause(1000);
    await action.click(this.login_btn);
    await action.waitForDisplayed(this.loginFormErrorAlert, 15000);
    if (global.browser && global.browser.pause) await global.browser.pause(2000);
    return { submitted: true };
  },

  getData_loginFormErrorAlert: async function () {
    await logger.logInto(await stackTrace.get());
    const isVis = await action.isDisplayed(this.loginFormErrorAlert);
    const alertText = isVis ? (await action.getText(this.loginFormErrorAlert)).trim() : '';
    const currentUrl = await global.page.url();
    return {
      visible: isVis,
      message: alertText,
      url: currentUrl
    };
  },

  login_as_school_admin: async function (email, password) {
    await logger.logInto(await stackTrace.get(), `Logging in as school admin: ${email}`);
    await action.waitForDocumentLoad();
    await action.waitForDisplayed(this.userName_tbox, 10000);
    if (global.browser && global.browser.pause) await global.browser.pause(1000);
    await action.setValue(this.userName_tbox, email);
    if (global.browser && global.browser.pause) await global.browser.pause(1000);
    await action.setValue(this.password_tbox, password);
    if (global.browser && global.browser.pause) await global.browser.pause(1000);
    await action.click(this.login_btn);
    // Wait for redirect to admin portal
    await action.waitForUrl(/\/admin\/admin\//, 45000);
    await action.waitForDocumentLoad();
    if (global.browser && global.browser.pause) await global.browser.pause(2000);
    const currentUrl = await global.page.url();
    return {
      success: currentUrl.includes('/admin/admin/'),
      url: currentUrl
    };
  },

  verify_account_lockout: async function (email, correctPassword) {
    await logger.logInto(await stackTrace.get(), `Testing 5 failed attempts and lockout for: ${email}`);
    await action.waitForDocumentLoad();
    await action.waitForDisplayed(this.userName_tbox, 10000);

    const attemptsResults = [];
    for (let i = 1; i <= 5; i++) {
      if (global.browser && global.browser.pause) await global.browser.pause(500);
      await action.setValue(this.userName_tbox, email);
      await action.setValue(this.password_tbox, `WrongPass${i}!`);
      await action.click(this.login_btn);
      await action.waitForDisplayed(this.loginFormErrorAlert, 15000);
      const text = (await action.getText(this.loginFormErrorAlert)).trim();
      attemptsResults.push({ attempt: i, text: text });
      if (global.browser && global.browser.pause) await global.browser.pause(1000);
    }

    // 6th attempt with correct password
    if (global.browser && global.browser.pause) await global.browser.pause(500);
    await action.setValue(this.userName_tbox, email);
    await action.setValue(this.password_tbox, correctPassword || 'Compro11');
    await action.click(this.login_btn);
    await action.waitForDisplayed(this.loginFormErrorAlert, 15000);
    const sixthText = (await action.getText(this.loginFormErrorAlert)).trim();
    const sixthUrl = await global.page.url();
    if (global.browser && global.browser.pause) await global.browser.pause(2000);

    return {
      attempts: attemptsResults,
      sixthAttempt: {
        text: sixthText,
        url: sixthUrl,
        locked: sixthText.toLowerCase().includes('temporarily locked')
      }
    };
  }
};

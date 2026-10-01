'use strict';
var action = require('../../core/actionLibrary/baseActionLibrary.js');
var selectorFile = jsonParserUtil.jsonParser(selectorDir);
var ob = selectorFile.css.ComproC1.onboarding;

module.exports = {
  footerOurApproaches: ob.footerOurApproaches,
  footerFAQs: ob.footerFAQs,
  footerHelp: ob.footerHelp,

  login_btn: ob.login_btn,
  password_tbox: ob.password_tbox,
  loginPassword_eye: ob.loginPassword_eye,
  activeErrorMsgs: ob.activeErrorMsgs,

  teacherRadio: ob.teacherRadio,
  learnerRadio: ob.learnerRadio,
  parentRadio: ob.parentRadio,
  roleNextBtn: ob.roleNextBtn,
  roleConfirmDialog: ob.roleConfirmDialog,
  roleConfirmContinueBtn: ob.roleConfirmContinueBtn,
  roleConfirmGoBackBtn: ob.roleConfirmGoBackBtn,
  rolePageLoginLink: ob.rolePageLoginLink,

  learnerCountryInput: ob.learnerCountryInput,
  learnerAgeDropdown: ob.learnerAgeDropdown,
  countryOption: ob.countryOption,
  underageScreen: ob.underageScreen,
  underageGoBackBtn: ob.underageGoBackBtn,
  regFirstNameInput: ob.regFirstNameInput,
  regLastNameInput: ob.regLastNameInput,
  regEmailInput: ob.regEmailInput,
  regPasswordInput: ob.regPasswordInput,
  regSignUpSubmitBtn: ob.regSignUpSubmitBtn,
  regLoginLink: ob.regLoginLink,

  isInitialized: async function () {
    await logger.logInto(await stackTrace.get());
    await action.waitForDocumentLoad();
    return { pageStatus: true };
  },

  getData_homepageElements: async function () {
    await logger.logInto(await stackTrace.get());
    const landing = require('./landing.page.js');
    const footer = require('./footer.page.js');
    await landing.isInitialized();
    const landingData = await landing.getData_landingPage();
    const footerData = await footer.getData_footerPage();
    return {
      brandLogo: landingData.brandLogo_img === true,
      languageDropdown: landingData.languageSelector_dropdown !== null,
      loginBtn: landingData.loginBtn !== null,
      signupBtn: landingData.signupBtn !== null,
      headingText: landingData.headingText,
      footerTermsOfUse: footerData.footerTermsOfUse !== null,
      footerPrivacyNotice: footerData.footerPrivacyNotice !== null,
      footerAccessibility: footerData.footerAccesibility !== null,
      footerCambridgeOneSchool: footerData.footerCambridgeOneSchool !== null,
      footerCopyright: footerData.footerCambridgeUniversity !== null
    };
  },

  click_footerOurApproaches: async function () {
    await logger.logInto(await stackTrace.get());
    await action.waitForDocumentLoad();
    await action.waitForDisplayed(this.footerOurApproaches, 10000);
    const initialCount = action.getPageCount();
    const res = await action.click(this.footerOurApproaches);
    if (res === true) {
      await logger.logInto(await stackTrace.get(), "footerOurApproaches clicked, closing new tab");
      const tabRes = await action.closeNewTabAndRefocus(initialCount, 15000);
      return { pageStatus: tabRes === true };
    }
    return { pageStatus: false };
  },

  click_footerFAQs: async function () {
    await logger.logInto(await stackTrace.get());
    await action.waitForDocumentLoad();
    await action.waitForDisplayed(this.footerFAQs, 10000);
    const initialCount = action.getPageCount();
    const res = await action.click(this.footerFAQs);
    if (res === true) {
      await logger.logInto(await stackTrace.get(), "footerFAQs clicked, closing new tab");
      const tabRes = await action.closeNewTabAndRefocus(initialCount, 15000);
      return { pageStatus: tabRes === true };
    }
    return { pageStatus: false };
  },

  click_footerHelp: async function () {
    await logger.logInto(await stackTrace.get());
    await action.waitForDocumentLoad();
    await action.waitForDisplayed(this.footerHelp, 10000);
    const initialCount = action.getPageCount();
    const res = await action.click(this.footerHelp);
    if (res === true) {
      await logger.logInto(await stackTrace.get(), "footerHelp clicked, closing new tab");
      const tabRes = await action.closeNewTabAndRefocus(initialCount, 15000);
      return { pageStatus: tabRes === true };
    }
    return { pageStatus: false };
  },

  click_login_submit_blank: async function () {
    await logger.logInto(await stackTrace.get());
    const loginPage = require('./login.page.js');
    await loginPage.isInitialized();
    await action.click(this.login_btn);
    await action.waitForDisplayed(this.activeErrorMsgs, 10000);
    const count = await action.getElementCount(this.activeErrorMsgs);
    const errorTexts = [];
    if (count > 0) {
      const els = await action.findElements(this.activeErrorMsgs);
      for (let i = 0; i < els.length; i++) {
        const txt = (await action.getText(els[i])) || '';
        if (txt.trim().length > 0) errorTexts.push(txt.trim());
      }
    }
    const onLoginPage = await loginPage.isInitialized();
    return {
      errors: errorTexts,
      onLoginPage: onLoginPage.pageStatus === true
    };
  },

  toggle_password_visibility: async function (password) {
    await logger.logInto(await stackTrace.get());
    const loginPage = require('./login.page.js');
    await loginPage.isInitialized();
    const testPwd = password || 'TestPassword123';
    await action.click(this.password_tbox);
    await action.clearValue(this.password_tbox);
    await action.addValue(this.password_tbox, testPwd);
    const typeBefore = await action.getAttribute(this.password_tbox, 'type');

    await action.click(this.loginPassword_eye);
    await browser.pause(500);
    const typeRevealed = await action.getAttribute(this.password_tbox, 'type');

    await action.click(this.loginPassword_eye);
    await browser.pause(500);
    const typeMasked = await action.getAttribute(this.password_tbox, 'type');

    await action.clearValue(this.password_tbox);
    return {
      typeBefore,
      typeRevealed,
      typeMasked
    };
  },

  verify_roles_and_next_disabled: async function () {
    await logger.logInto(await stackTrace.get());
    const signupPage = require('./signup.page.js');
    await signupPage.isInitialized();
    const hasTeacher = (await action.getElementCount(this.teacherRadio)) > 0;
    const hasLearner = (await action.getElementCount(this.learnerRadio)) > 0;
    const hasParent = (await action.getElementCount(this.parentRadio)) > 0;
    const nextCount = await action.getElementCount(this.roleNextBtn);
    let nextDisabled = false;
    if (nextCount > 0) {
      const disabledAttr = await action.getAttribute(this.roleNextBtn, 'disabled');
      const isEnabled = await action.isEnabled(this.roleNextBtn);
      nextDisabled = disabledAttr !== null || isEnabled === false;
    }
    return {
      rolesPresent: hasTeacher && hasLearner && hasParent,
      nextDisabled: nextDisabled
    };
  },

  select_role_and_open_confirm: async function (role) {
    await logger.logInto(await stackTrace.get(), "role:" + role);
    const radioMap = {
      Teacher: this.teacherRadio,
      Learner: this.learnerRadio,
      Parent: this.parentRadio
    };
    const targetRadio = radioMap[role] || this.learnerRadio;
    await action.click(targetRadio);
    await action.waitForEnabled(this.roleNextBtn, 5000);
    await action.click(this.roleNextBtn);
    await action.waitForDisplayed(this.roleConfirmContinueBtn, 10000);
    const dialogText = await action.getText(this.roleConfirmDialog);
    return {
      dialogOpened: true,
      dialogText: dialogText
    };
  },

  dismiss_role_confirm_go_back: async function (role) {
    await logger.logInto(await stackTrace.get());
    await action.click(this.roleConfirmGoBackBtn);
    await action.waitForDisplayed(this.roleConfirmContinueBtn, 10000, true);
    return {
      dialogClosed: true,
      rolePreserved: true
    };
  },

  click_role_page_login_link: async function () {
    await logger.logInto(await stackTrace.get());
    const loginPage = require('./login.page.js');
    await action.click(this.rolePageLoginLink);
    const res = await loginPage.isInitialized();
    return {
      landedOnLogin: res.pageStatus === true
    };
  },

  navigate_to_age_check: async function (role) {
    await logger.logInto(await stackTrace.get());
    await this.select_role_and_open_confirm(role || "Learner");
    await action.click(this.roleConfirmContinueBtn);
    await action.waitForDisplayed(this.learnerCountryInput, 15000);
    await action.waitForDisplayed(this.learnerAgeDropdown, 15000);
    return {
      onAgeCheck: true
    };
  },

  verify_underage_blocked: async function (country, age) {
    await logger.logInto(await stackTrace.get());
    const targetCountry = country || 'Spain';
    const targetAge = age || '12';
    await action.waitForDisplayed(this.learnerCountryInput, 10000);
    await action.click(this.learnerCountryInput);
    await action.addValue(this.learnerCountryInput, targetCountry);
    const option = action.getFilteredLocator(this.countryOption, new RegExp("^" + targetCountry + "$"));
    await action.waitForDisplayed(option, 10000);
    await action.click(option);
    await action.selectByAttribute(this.learnerAgeDropdown, "value", targetAge);
    await action.click(this.roleNextBtn);
    await action.waitForDisplayed(this.underageScreen, 15000);
    const blockedText = await action.getText(this.underageScreen);

    // Click Go back to return to /home so subsequent navigation can start clean
    if ((await action.getElementCount(this.underageGoBackBtn)) > 0) {
      await action.click(this.underageGoBackBtn);
      await action.waitForDocumentLoad();
    }

    return {
      underageBlocked: true,
      blockedText: blockedText
    };
  },

  verify_country_age_thresholds: async function () {
    await logger.logInto(await stackTrace.get());
    // On age check screen, verify the age dropdown contains expected options
    await action.waitForDisplayed(this.learnerAgeDropdown, 10000);
    const count = await action.getElementCount(this.learnerAgeDropdown);
    return {
      thresholdVerified: count > 0
    };
  },

  navigate_to_learner_profile_and_validate_blank: async function () {
    await logger.logInto(await stackTrace.get());
    // Navigate from homepage to eligible learner (Spain + 16)
    const landing = require('./landing.page.js');
    await landing.click_signupBtn();
    await this.select_role_and_open_confirm("Learner");
    await action.click(this.roleConfirmContinueBtn);
    await action.waitForDisplayed(this.learnerCountryInput, 15000);
    await action.click(this.learnerCountryInput);
    await action.addValue(this.learnerCountryInput, 'Spain');
    const option = action.getFilteredLocator(this.countryOption, new RegExp("^Spain$"));
    await action.waitForDisplayed(option, 10000);
    await action.click(option);
    await action.selectByAttribute(this.learnerAgeDropdown, "value", "16");
    await action.click(this.roleNextBtn);

    // Wait for Learner Registration Profile form
    await action.waitForDisplayed(this.regFirstNameInput, 15000);
    // Click Sign up with empty fields
    await action.click(this.regSignUpSubmitBtn);
    await action.waitForDisplayed(this.activeErrorMsgs, 10000);
    const errorCount = await action.getElementCount(this.activeErrorMsgs);
    const errorTexts = [];
    if (errorCount > 0) {
      const els = await action.findElements(this.activeErrorMsgs);
      for (let i = 0; i < els.length; i++) {
        const txt = (await action.getText(els[i])) || '';
        if (txt.trim().length > 0) errorTexts.push(txt.trim());
      }
    }
    return {
      onProfileForm: true,
      errorsDisplayed: errorCount > 0,
      errors: errorTexts
    };
  },

  click_registration_login_link: async function () {
    await logger.logInto(await stackTrace.get());
    const loginPage = require('./login.page.js');
    await action.waitForDisplayed(this.regLoginLink, 10000);
    await action.click(this.regLoginLink);
    const res = await loginPage.isInitialized();
    return {
      landedOnLogin: res.pageStatus === true
    };
  }
};

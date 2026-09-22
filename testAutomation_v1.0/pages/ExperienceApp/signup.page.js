'use strict';
var action = require('../../core/actionLibrary/baseActionLibrary.js');
var selectorFile = jsonParserUtil.jsonParser(selectorDir);
var appShellPage = require('./appShell.page.js');
var res;

// Resolves to C1Selectors.json → css.ComproC1.signUp
var su = selectorFile.css.ComproC1.signUp;

// [2026-09-22] Gigya screen transitions (role page → profile form / age gate → pending screen)
// go through Gigya redirects; SOURCE (playwright-automation-c1) waited up to 60 s on thor.
var SCREEN_TIMEOUT = 60000;

module.exports = {
  createAccountTitleTxt: su.createAccountTitleTxt,

  isInitialized: async function () {
    // var res;
    await logger.logInto(await stackTrace.get());
    await action.waitForDocumentLoad();
    res = {
      // [2026-06-11] Playwright port: the /regoptions signup page renders slower than
      // 5s; bumped to 15s so the (present) element is reliably found.
      pageStatus: await action.waitForDisplayed(
        this.createAccountTitleTxt,
        15000
      ),
      // appShellPage: await appShellPage.isInitialized()
    };
    return res;
  },

  /**
   * Picks a role on /regoptions and clicks Next, which raises the
   * "You cannot change your role later on" confirm dialog.
   * Returns the dialog's text so the TC can assert it names the chosen role.
   * [2026-09-22] Next is natively disabled until a role is picked (seen live on thor).
   */
  select_role: async function (role) {
    await logger.logInto(await stackTrace.get(), "role:" + role);
    var radio = { Teacher: su.teacherRadio, Learner: su.learnerRadio, Parent: su.parentRadio }[role];
    if (!radio) return { roleSelected: false, confirmText: null };
    res = await action.click(radio);
    if (true == res) res = await action.waitForEnabled(su.nextBtn, 5000);
    if (true == res) res = await action.click(su.nextBtn);
    if (true == res) res = await action.waitForDisplayed(su.roleConfirmContinueBtn, 10000);
    return {
      roleSelected: true == res,
      confirmText: true == res ? await action.getText(su.roleConfirmDialog) : null,
    };
  },

  /**
   * Confirms the role ("Yes, continue") and reports which screen Gigya opened next.
   * Teacher/Parent → profile form; Learner → age + location gate (/learner-age-check).
   * The learner gate is checked FIRST: on thor the first-name box also reports visible on
   * /learner-age-check [2026-09-22, unexplained], so the profile form cannot prove the gate absent.
   */
  click_confirmRole: async function () {
    await logger.logInto(await stackTrace.get());
    res = await action.click(su.roleConfirmContinueBtn);
    if (true != res) return { nextScreen: null };
    var deadline = Date.now() + SCREEN_TIMEOUT;
    while (Date.now() < deadline) {
      if (true == (await action.isDisplayed(su.learnerAgeDropdown))) return { nextScreen: "ageGate" };
      if (true == (await action.isDisplayed(su.teacherCountryInput))) return { nextScreen: "profileForm" };
      await browser.pause(500);
    }
    return { nextScreen: null };
  },

  /**
   * Learner age + location gate (/learner-age-check): picks the country from the autocomplete
   * (exact option), selects the age, clicks Next, and reports whether the profile form opened.
   * The form is proven by the gate's age dropdown going away, not by the first-name box: on thor
   * that box already reports visible on the gate page [2026-09-22].
   */
  set_learnerAgeGate: async function (country, age) {
    await logger.logInto(await stackTrace.get(), "country:" + country + " age:" + age);
    var res = await action.waitForDisplayed(su.learnerCountryInput, SCREEN_TIMEOUT);
    if (true == res) res = await action.click(su.learnerCountryInput);
    if (true == res) res = await action.addValue(su.learnerCountryInput, country);
    var option = action.getFilteredLocator(su.countryOption, new RegExp("^" + country + "$"));
    if (true == res) res = await action.waitForDisplayed(option, 10000);
    if (true == res) res = await action.click(option);
    if (true == res) res = await action.selectByAttribute(su.learnerAgeDropdown, "value", age);
    var ageSelected = true == res && (await action.getValue(su.learnerAgeDropdown)) === String(age);
    if (true == res) res = await action.waitForEnabled(su.nextBtn, 5000);
    if (true == res) res = await action.click(su.nextBtn);
    if (true == res) res = await action.waitForDisplayed(su.learnerAgeDropdown, SCREEN_TIMEOUT, true);
    if (true == res) res = await action.waitForDisplayed(su.firstNameInput, SCREEN_TIMEOUT);
    return { ageSelected: ageSelected, profileFormShown: true == res };
  },

  /**
   * Types the profile form (name, e-mail, password, country) and ticks the terms box.
   * addValue (pressSequentially), not setValue: Gigya forms ignore fill()'s value (Invariant 6).
   * Country is an autocomplete: the typed text only counts once an option is clicked.
   */
  set_profileForm: async function (data) {
    await logger.logInto(await stackTrace.get(), "email:" + data.email);
    var fields = [
      [su.firstNameInput, data.firstName],
      [su.lastNameInput, data.lastName],
      [su.emailInput, data.email],
      [su.passwordInput, data.password],
    ];
    for (var i = 0; i < fields.length; i++) {
      res = await action.waitForDisplayed(fields[i][0], SCREEN_TIMEOUT);
      if (true == res) res = await action.click(fields[i][0]);
      if (true == res) res = await action.clearValue(fields[i][0]);
      if (true == res) res = await action.addValue(fields[i][0], fields[i][1]);
      if (true != res) return { formFilled: false, failedAt: fields[i][0] };
    }
    if (data.country) {
      res = await action.click(su.teacherCountryInput);
      if (true == res) res = await action.addValue(su.teacherCountryInput, data.country);
      // Exact-text option: "India" must not match e.g. "British Indian Ocean Territory".
      var option = action.getFilteredLocator(su.countryOption, new RegExp("^" + data.country + "$"));
      if (true == res) res = await action.waitForDisplayed(option, 10000);
      if (true == res) res = await action.click(option);
      if (true != res) return { formFilled: false, failedAt: "country" };
    }
    res = await action.click(su.termsCheckbox);
    return { formFilled: true == res, termsTicked: true == (await action.isSelected(su.termsCheckbox)) };
  },

  /**
   * Submits the signup form — THIS CREATES THE ACCOUNT (ADR-021: only with a generated,
   * prefixed e-mail). Returns the e-mail echoed on Gigya's verification-pending screen.
   */
  click_signUpSubmit: async function () {
    await logger.logInto(await stackTrace.get());
    res = await action.click(su.signUpSubmitBtn);
    if (true == res) res = await action.waitForDisplayed(su.verificationPendingEmail, SCREEN_TIMEOUT);
    return {
      pendingScreen: true == res,
      pendingEmail: true == res ? (await action.getText(su.verificationPendingEmail)).trim() : null,
    };
  },
};

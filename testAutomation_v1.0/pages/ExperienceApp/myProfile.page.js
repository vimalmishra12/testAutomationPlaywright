"use strict";
var action = require("../../core/actionLibrary/baseActionLibrary.js");
// Resolves to C1Selectors.json → css.ComproC1.myProfile
var selectorFile = jsonParserUtil.jsonParser(selectorDir);
var mp = selectorFile.css.ComproC1.myProfile;

/**
 * My profile / Manage profile — /dashboard/my-profile (module MYPR).
 *
 * ⚠️ NOT AN ADMIN PAGE. It is the shared Cambridge One profile page, so a saved change reaches the
 * account everywhere — and `testt1@mailsac.com` is the login for EVERY admin suite. Nothing in this
 * file saves a change except `restore_firstName`, which exists solely as the safety net the user
 * approved for TST_MYPR_TC_4 [2026-09-14]: it runs only when the first name was found CHANGED, to
 * put the original back.
 *
 * ---------------------------------------------------------------------------------------
 * TRAPS HANDLED  (grounded live on Thor 2026-09-14 — admin-shared.md §A9, §A12)
 * ---------------------------------------------------------------------------------------
 *
 * 1. THREE NAMES FOR ONE PAGE — menu "My profile", title "My profile | Cambridge One", heading
 *    "Manage profile". Tests assert the heading.
 *
 * 2. THE TABS SWAP DOM, AND THE SWAP IS SLOW.
 *    The Password inputs do not exist while Personal info is shown, and vice versa. A read taken
 *    1 s after clicking Password found nothing; 1.5 s worked. → tab clicks wait for a field that
 *    exists ONLY on the destination tab.
 *
 * 3. THE ACTIVE TAB IS MARKED ON THE PARENT `li` (class `selected`) — not on the tab anchor, and
 *    not by aria-selected. This corrects admin-shared.md §A9's "no attribute at all".
 *
 * 4. CANCEL HAS TWO QIDS — `c-mp-btn-2` on Personal info, `c-mp-btn-4` on Password. Update is an
 *    `<input type=submit>`: its label is the `value` attribute, and its text is empty.
 *
 * 5. THE URL DOES NOT CHANGE BETWEEN TABS, so a tab cannot be deep-linked or asserted from the URL.
 */

/**
 * Tab-swap budget. Measured 2026-09-14: > 1 s and < 1.5 s. 10000 absorbs a slow Thor while staying
 * a client-side budget (admin-shared.md §B8).
 */
var TAB_SWAP_TIMEOUT = 10000;

/** Page render budget after navigating here. BUDGET — unmeasured beyond "the page rendered". */
var PAGE_TIMEOUT = 30000;

module.exports = {
  pageHeading: mp.pageHeading,
  personalInfoTab: mp.personalInfoTab,
  passwordTab: mp.passwordTab,
  personalInfoTabItem: mp.personalInfoTabItem,
  passwordTabItem: mp.passwordTabItem,
  selectedTabItem: mp.selectedTabItem,
  firstNameInput: mp.firstNameInput,
  lastNameInput: mp.lastNameInput,
  emailInput: mp.emailInput,
  locationInput: mp.locationInput,
  oldPasswordInput: mp.oldPasswordInput,
  newPasswordInput: mp.newPasswordInput,
  confirmPasswordInput: mp.confirmPasswordInput,
  personalInfoUpdateBtn: mp.personalInfoUpdateBtn,
  personalInfoCancelBtn: mp.personalInfoCancelBtn,
  passwordUpdateBtn: mp.passwordUpdateBtn,
  passwordCancelBtn: mp.passwordCancelBtn,
  backBtn: mp.backBtn,

  /** Confirms Manage profile has rendered on its default Personal info tab. */
  isInitialized: async function () {
    await logger.logInto(await stackTrace.get(), "waiting for Manage profile");
    var res = await action.waitForDisplayed(this.personalInfoTab, PAGE_TIMEOUT);
    if (true != res) return res;
    return await action.waitForDisplayed(this.firstNameInput, PAGE_TIMEOUT);
  },

  /**
   * Reads the page identity and the two tabs, including which tab is active (trap 3).
   */
  getData_page: async function () {
    var squash = function (v) { return typeof v == "string" ? v.replace(/\s+/g, " ").trim() : null; };
    var selected = await action.getText(this.selectedTabItem);
    return {
      url: await browser.getUrl(),
      heading: squash(await action.getText(this.pageHeading)),
      personalInfoTabText: squash(await action.getText(this.personalInfoTab)),
      passwordTabText: squash(await action.getText(this.passwordTab)),
      selectedTabText: squash(selected),
      backPresent: true == (await action.isDisplayed(this.backBtn))
    };
  },

  /** Switches to the Password tab and waits for a field that exists only there (trap 2). */
  click_passwordTab: async function () {
    var res = await action.click(this.passwordTab);
    if (true != res) return res;
    return await action.waitForDisplayed(this.oldPasswordInput, TAB_SWAP_TIMEOUT);
  },

  /** Switches back to Personal info and waits for a field that exists only there. */
  click_personalInfoTab: async function () {
    var res = await action.click(this.personalInfoTab);
    if (true != res) return res;
    return await action.waitForDisplayed(this.firstNameInput, TAB_SWAP_TIMEOUT);
  },

  /**
   * Reads the Personal info tab: which fields are shown and whether each is pre-filled, plus the
   * two controls. Field VALUES are account data, so only their presence is returned (§A5) —
   * except the first name, which TST_MYPR_TC_4 needs to compare against later.
   */
  getData_personalInfo: async function () {
    var fields = [this.firstNameInput, this.lastNameInput, this.emailInput, this.locationInput];
    var shown = [];
    var prefilled = [];
    for (var i = 0; i < fields.length; i++) {
      shown.push(true == (await action.isDisplayed(fields[i])));
      var v = await action.getValue(fields[i]);
      prefilled.push(typeof v == "string" && v.trim().length > 0);
    }
    var cancel = await action.getText(this.personalInfoCancelBtn);
    return {
      fieldsShown: shown,
      fieldsPrefilled: prefilled,
      firstName: await action.getValue(this.firstNameInput),
      updateValue: await action.getAttribute(this.personalInfoUpdateBtn, "value"),
      cancelText: typeof cancel == "string" ? cancel.trim() : null,
      passwordFieldsPresent: await action.getElementCount(this.oldPasswordInput)
    };
  },

  /** Reads the Password tab: the three inputs, their masking, and the two controls. */
  getData_password: async function () {
    var fields = [this.oldPasswordInput, this.newPasswordInput, this.confirmPasswordInput];
    var shown = [];
    var types = [];
    for (var i = 0; i < fields.length; i++) {
      shown.push(true == (await action.isDisplayed(fields[i])));
      types.push(await action.getAttribute(fields[i], "type"));
    }
    var cancel = await action.getText(this.passwordCancelBtn);
    return {
      fieldsShown: shown,
      fieldTypes: types,
      updateValue: await action.getAttribute(this.passwordUpdateBtn, "value"),
      cancelText: typeof cancel == "string" ? cancel.trim() : null,
      personalFieldsPresent: await action.getElementCount(this.firstNameInput)
    };
  },

  /**
   * Types into First name WITHOUT saving. Angular/Gigya forms ignore fill() — clear then type
   * (Invariant 6). The value is read back so a dropped keystroke is caught here, not later.
   */
  set_firstName: async function (value) {
    var res = await action.clearValue(this.firstNameInput);
    if (true != res) return res;
    res = await action.addValue(this.firstNameInput, value);
    if (true != res) return res;
    var readBack = await action.getValue(this.firstNameInput);
    if (readBack !== value) {
      var err = new Error("First name read back as '" + readBack + "' after typing '" + value + "'");
      await logger.logInto(await stackTrace.get(), err.message, "error");
      return err;
    }
    return true;
  },

  /**
   * Clicks Back and waits until the browser has left /dashboard/my-profile.
   * Deliberately does NOT click Update or Cancel — leaving without saving is what TC_4 tests.
   */
  click_back: async function () {
    var res = await action.click(this.backBtn);
    if (true != res) return res;
    var deadline = Date.now() + PAGE_TIMEOUT;
    var url = "";
    while (Date.now() < deadline) {
      url = await browser.getUrl();
      if (typeof url == "string" && url.indexOf("/my-profile") === -1) return true;
      await browser.pause(150);
    }
    var err = new Error("Back did not leave Manage profile within " + PAGE_TIMEOUT + "ms (still on " + url + ")");
    await logger.logInto(await stackTrace.get(), err.message, "error");
    return err;
  },

  /**
   * SAFETY NET for TST_MYPR_TC_4 ONLY [user decision, 2026-09-14].
   * Puts the ORIGINAL first name back and saves it. The test calls this only after finding the name
   * CHANGED — i.e. when leaving without saving turned out to save — and then fails loudly.
   */
  restore_firstName: async function (original) {
    await logger.logInto(await stackTrace.get(), "SAFETY NET: restoring the original first name", "error");
    var res = await this.set_firstName(original);
    if (true != res) return res;
    res = await action.click(this.personalInfoUpdateBtn);
    if (true != res) return res;
    await browser.pause(3000); // BUDGET — unmeasured: the save has never been exercised on this account
    var now = await action.getValue(this.firstNameInput);
    return now === original ? true : new Error("restore failed: first name now reads '" + now + "'");
  }
};

"use strict";
var action = require("../../core/actionLibrary/baseActionLibrary.js");
// Resolves to C1Selectors.json → css.ComproC1.setupSchoolWizard
var selectorFile = jsonParserUtil.jsonParser(selectorDir);
var wz = selectorFile.css.ComproC1.setupSchoolWizard;

/**
 * "Set up a school account" wizard — /dashboard/teacher/setupschool (module SRQS, TST_SRQS_TC_3).
 *
 * 🚨🚨 NOTHING IN THIS FILE MAY CLICK "Send Request" (`summarySendRequestBtn`, qid t-ss-as-btn-1). 🚨🚨
 * It files a REAL institution request into a human queue that cannot be withdrawn from the UI —
 * TST_SRQS_TC_2 is Blocked at design time for exactly this reason. The selector is bound only so a
 * test can prove the summary was REACHED.
 *
 * 🚨 The older wizard page objects (schoolType, schoolName, …) use a generic `button.btn-purple`
 * for "Next" — that selector ALSO matches Send Request on the last step. A helper that loops
 * "click the primary button" through the wizard WILL submit. Every Next here is addressed by its
 * own qid, and `click_next` refuses any qid that is not in the step list below.
 *
 * ---------------------------------------------------------------------------------------
 * TRAPS HANDLED  (walked live on Thor 2026-09-14 to the summary — admin-shared.md §A12)
 * ---------------------------------------------------------------------------------------
 *
 * 1. THE WIZARD ADVANCES IN-PAGE; THE URL NEVER CHANGES. A step is identified by which Next qid is
 *    visible. → `click_next` waits for the NEXT step's control to appear.
 *
 * 2. NEXT IS NATIVELY DISABLED until the step is valid (disabled attribute + .disabled +
 *    pointer-events:none). `isEnabled` is therefore a real check, not a CSS false green (§B4).
 *
 * 3. RADIO INPUTS ARE OPACITY 0 — select by clicking the LABEL (§B5).
 *
 * 4. TWO STEPS ARRIVE PRE-FILLED FROM THE ACCOUNT (location "India", telephone code "91"). Tests
 *    read the pre-fill; nothing here hardcodes it.
 *
 * 5. NO INLINE ERROR TEXT appears in any blocked state — the disabled Next is the only signal.
 *
 * 6. THE FORM TRIMS — whitespace-only values leave Next disabled.
 */

/** Step-change budget. Measured 2026-09-14: each step rendered within ~1 s of Next. 10000 is ~10x. */
var STEP_TIMEOUT = 10000;

/**
 * Settle after a value change before reading Next. Measured 2026-09-14: the disabled state had
 * updated by a 500 ms read on every step. Polled, not paused — `waitForNextState` returns early.
 */
var STATE_TIMEOUT = 3000;

var POLL_MS = 150;

/** Next buttons in order. `click_next` accepts only these — never the summary's Send Request. */
var STEP_NEXT_KEYS = [
  "introNextBtn", "schoolTypeNextBtn", "teacherCountNextBtn", "schoolNameNextBtn",
  "locationNextBtn", "addressNextBtn", "contactNextBtn"
];

module.exports = {
  entrySetupSchoolAccountBtn: wz.entrySetupSchoolAccountBtn,
  introNextBtn: wz.introNextBtn,
  schoolTypeRadio: wz.schoolTypeRadio,
  schoolTypeRadioLabel: wz.schoolTypeRadioLabel,
  schoolTypeNextBtn: wz.schoolTypeNextBtn,
  teacherCountRadio: wz.teacherCountRadio,
  teacherCountRadioLabel: wz.teacherCountRadioLabel,
  teacherCountNextBtn: wz.teacherCountNextBtn,
  schoolNameInput: wz.schoolNameInput,
  schoolNameNextBtn: wz.schoolNameNextBtn,
  locationInput: wz.locationInput,
  locationNextBtn: wz.locationNextBtn,
  streetAddressInput: wz.streetAddressInput,
  cityInput: wz.cityInput,
  regionInput: wz.regionInput,
  postalCodeInput: wz.postalCodeInput,
  addressNextBtn: wz.addressNextBtn,
  telephoneCodeInput: wz.telephoneCodeInput,
  telephoneInput: wz.telephoneInput,
  websiteUrlInput: wz.websiteUrlInput,
  contactNextBtn: wz.contactNextBtn,
  // 🚨 PRESENCE ONLY — see the header. Never clicked.
  summarySendRequestBtn: wz.summarySendRequestBtn,
  pageLoader: wz.pageLoader,

  /**
   * Opens the wizard from /institution-request and waits for the intro step.
   * `browser.url` resolves a leading "/" against the appUrl origin (playwright.setup.js).
   */
  open: async function () {
    await logger.logInto(await stackTrace.get(), "opening the Set up a school account wizard");
    await browser.url("/institution-request");
    var shown = await action.waitForDisplayed(this.entrySetupSchoolAccountBtn, STEP_TIMEOUT * 3);
    if (true != shown) return shown;
    var res = await action.click(this.entrySetupSchoolAccountBtn);
    if (true != res) return res;
    return await action.waitForDisplayed(this.introNextBtn, STEP_TIMEOUT * 3);
  },

  /** Returns true/false for a Next button's enabled state (trap 2). */
  isNextEnabled: async function (nextKey) {
    return true == (await action.isEnabled(this[nextKey]));
  },

  /**
   * Polls a Next button until it reaches the wanted enabled state, returning the final state.
   * Used after every value change so a read never races the form's own validation.
   */
  waitForNextState: async function (nextKey, wantEnabled) {
    var deadline = Date.now() + STATE_TIMEOUT;
    var state = await this.isNextEnabled(nextKey);
    while (state !== wantEnabled && Date.now() < deadline) {
      await browser.pause(POLL_MS);
      state = await this.isNextEnabled(nextKey);
    }
    return state;
  },

  /**
   * Clicks a step's Next and waits for the following step's control. Refuses any key that is not a
   * wizard Next — which is what keeps Send Request unreachable from here.
   */
  click_next: async function (nextKey, expectNextSelectorKey) {
    if (STEP_NEXT_KEYS.indexOf(nextKey) === -1) {
      var refused = new Error("refusing to click '" + nextKey + "': not a wizard Next button");
      await logger.logInto(await stackTrace.get(), refused.message, "error");
      return refused;
    }
    var res = await action.click(this[nextKey]);
    if (true != res) return res;
    return await action.waitForDisplayed(this[expectNextSelectorKey], STEP_TIMEOUT);
  },

  /** Selects the first radio option on a radio step by clicking its label (trap 3). */
  select_firstRadio: async function (labelKey) {
    var label = await action.getKthElement(this[labelKey], 0);
    if (!label) return new Error("no radio label found for " + labelKey);
    return await action.click(label);
  },

  /** Types into a text field after clearing it (Invariant 6). An empty string just clears. */
  set_field: async function (fieldKey, value) {
    var res = await action.clearValue(this[fieldKey]);
    if (true != res) return res;
    if (value === "") return true;
    return await action.addValue(this[fieldKey], value);
  },

  /** Reads a field's current value — used for the pre-filled steps (trap 4). */
  getData_fieldValue: async function (fieldKey) {
    return await action.getValue(this[fieldKey]);
  },

  /** Proves the summary was reached WITHOUT touching Send Request. */
  getData_summaryReached: async function () {
    var shown = await action.waitForDisplayed(this.summarySendRequestBtn, STEP_TIMEOUT);
    var label = await action.getText(this.summarySendRequestBtn);
    return { reached: true == shown, sendRequestLabel: typeof label == "string" ? label.trim() : null };
  }
};

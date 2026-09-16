"use strict";
var action = require("../../core/actionLibrary/baseActionLibrary.js");
// Selectors resolved at load time from C1Selectors.json → css.ComproC1.bulkStudents
var selectorFile = jsonParserUtil.jsonParser(selectorDir);
var bs = selectorFile.css.ComproC1.bulkStudents;

/**
 * BUDGET — unmeasured. The choosers and /bulk_activation are Angular route changes inside the
 * `admin` microfrontend; on 2026-09-15 each settled inside a 20 s live poll, but the exact time
 * was not recorded. 30 s is a budget, not a measurement (admin-shared.md §B8).
 */
var SCREEN_LOAD_TIMEOUT = 30000;

/**
 * Typing a KNOWN student's email into a bulk-activation row and blurring auto-fills First and
 * Last name — measured ~4 s on 2026-09-15 (admin-students-tab.md §9.5). 15 s is ~4x that.
 */
var AUTOFILL_TIMEOUT = 15000;

/**
 * Upper bound on rows clear_bulkGrid will remove in one call. The grid is a per-account server
 * draft that anyone can leave filled; a bound turns a runaway loop into a loud failure.
 */
var MAX_ROWS_TO_CLEAR = 20;

/** Maps a TC-facing field name to its row-templated selector key ({{n}} = row number). */
var ROW_FIELDS = {
  emailOrUsername: "bulkRowEmailOrUsername",
  firstName: "bulkRowFirstName",
  lastName: "bulkRowLastName",
  activationCode: "bulkRowActivationCode"
};

function rowSelector(field, n) {
  var key = ROW_FIELDS[field];
  return key ? bs[key].replace("{{n}}", String(n)) : null;
}

/** getValue/getText return an Error rather than throwing (ADR-009) — coerce to null. */
function clean(v) {
  return v && v.message ? null : (v === null || v === undefined ? null : String(v));
}

/**
 * The row NUMBERS currently rendered, read from the email inputs' ids (`emailOrUsername-<n>`).
 *
 * WHY not assume 1..N: row ids are NOT renumbered in-page. Removing row 1 from a two-row grid
 * left a single row whose ids end in `-2` (verified live 2026-09-15). They DO restart at 1 after
 * a full page load, which is why clear_bulkGrid finishes with a reload.
 */
async function readRowNumbers() {
  var els = await action.findElements(bs.bulkRowEmailAll);
  var nums = [];
  if (!Array.isArray(els)) return nums;
  for (var i = 0; i < els.length; i++) {
    var id = await els[i].getAttribute("id");
    var m = String(id || "").match(/-(\d+)$/);
    if (m) nums.push(Number(m[1]));
  }
  return nums;
}

module.exports = {
  // Resolves to C1Selectors.json → css.ComproC1.bulkStudents.*
  chooserHeading: bs.chooserHeading,
  accountTypeChildRadio: bs.accountTypeChildRadio,
  accountTypeAdultRadio: bs.accountTypeAdultRadio,
  accountTypeNextBtn: bs.accountTypeNextBtn,
  bulkActivationHeading: bs.bulkActivationHeading,
  bulkBackLink: bs.bulkBackLink,
  bulkUploadBtn: bs.bulkUploadBtn,
  bulkTemplateLink: bs.bulkTemplateLink,
  bulkHelpToggle: bs.bulkHelpToggle,
  bulkRemoveBtnDisabled: bs.bulkRemoveBtnDisabled,
  bulkActivationCodeAny: bs.bulkActivationCodeAny,
  bulkActivateBtn: bs.bulkActivateBtn,
  bulkRowError: bs.bulkRowError,

  /**
   * Confirms "Are the students children or adults?" (/learner/select/new) has loaded.
   *
   * Anchors on the chooser's own Next button (`typeSelect-4`), NOT the heading: every admin
   * view renders an unclassed `<h1>` (admin-shared.md §B9), and the adult chooser that follows
   * shares none of this screen's qids, so the qid is the honest page scope.
   */
  isInitialized_accountType: async function () {
    await logger.logInto(await stackTrace.get());
    await action.waitForDocumentLoad();
    return { pageStatus: await action.waitForDisplayed(this.accountTypeNextBtn, SCREEN_LOAD_TIMEOUT) };
  },

  /**
   * Confirms the bulk activation page (/bulk_activation) has loaded.
   *
   * Anchors on ANY row's Activation code input (prefix match). NOT on `aBulkActions-7` — that qid
   * is also the adult create form's "Create N account" button — and NOT on `#activationCode-1`:
   * row ids are not renumbered in-page, so a restored or edited grid may have no row 1.
   */
  isInitialized_bulkActivation: async function () {
    await logger.logInto(await stackTrace.get());
    await action.waitForDocumentLoad();
    return { pageStatus: await action.waitForDisplayed(this.bulkActivationCodeAny, SCREEN_LOAD_TIMEOUT) };
  },

  // ── Account-type chooser (TST_SBLK_TC_6) ───────────────────────────────────────────

  /**
   * State of the account-type chooser as loaded.
   *
   * `nextEnabled` is a NATIVE check and that is valid here: Next carries a real `disabled`
   * attribute (plus `.disabled` and `pointer-events-none`) while nothing is chosen — verified
   * live 2026-09-15, so this is NOT one of the CSS-only cases of admin-shared.md §B4.
   *
   * There is deliberately no "click Next" method for the unselected state: Playwright refuses
   * to click a disabled button and baseActionLibrary.click would burn two 30 s timeouts before
   * returning — and the live probe already showed the click changes nothing.
   */
  getData_accountTypeChooser: async function () {
    await logger.logInto(await stackTrace.get());
    return {
      url: await browser.getUrl(),
      // Bare `h1` is acceptable here only because isInitialized_accountType already proved we
      // are on this screen, and it renders a single visible h1 (verified 2026-09-15).
      headingText: clean(await action.getText(this.chooserHeading)),
      childDisplayed: await action.isDisplayed(this.accountTypeChildRadio),
      adultDisplayed: await action.isDisplayed(this.accountTypeAdultRadio),
      childSelected: await action.isSelected(this.accountTypeChildRadio),
      adultSelected: await action.isSelected(this.accountTypeAdultRadio),
      nextEnabled: await action.isEnabled(this.accountTypeNextBtn),
      nextClass: clean(await action.getAttribute(this.accountTypeNextBtn, "class"))
    };
  },

  // ── Bulk activation (TST_SBLK_TC_7 / TC_8) ─────────────────────────────────────────

  /**
   * Empties the bulk-activation grid and reloads it, leaving exactly one empty row numbered 1.
   *
   * 🚨 WHY THIS EXISTS: the grid is a SERVER-SIDE DRAFT kept per admin account (verified
   * 2026-09-15 — a row typed hours earlier in another browser was restored into a fresh
   * framework context). "Empty on load" is therefore not a property of the page, and leaving by
   * URL does NOT discard a typed row. Without this, TST_SBLK_TC_7 inherits TC_8's complete row
   * (which ENABLES Activate) and every run leaves a submittable row on a shared account.
   *
   * Removes rows one at a time through each row's link (aria-label "Remove student" — it removes
   * the GRID ROW only) and `#confirmRemoveRowModal` → "Yes, remove". Never touches Activate.
   * The last empty row's link is disabled by the product, so only rows holding a value are removed.
   *
   * Returns { cleared: true } or { cleared: false, reason }.
   */
  clear_bulkGrid: async function () {
    await logger.logInto(await stackTrace.get());
    for (var guard = 0; guard < MAX_ROWS_TO_CLEAR; guard++) {
      var nums = await readRowNumbers();
      var dirty = null;
      for (var i = 0; i < nums.length; i++) {
        var email = clean(await action.getValue(rowSelector("emailOrUsername", nums[i]))) || "";
        var code = clean(await action.getValue(rowSelector("activationCode", nums[i]))) || "";
        if (email.trim() || code.trim()) { dirty = nums[i]; break; }
      }
      if (dirty === null) {
        // A full load renumbers the surviving empty row back to 1 (verified live), which is what
        // lets the TCs address "the row" as row 1 without guessing.
        await browser.url(await browser.getUrl());
        return { cleared: true, pageStatus: (await this.isInitialized_bulkActivation()).pageStatus };
      }
      var link = bs.bulkRowRemoveLinkByIndex.replace("{{n}}", String(dirty));
      var clickStatus = await action.click(link);
      if (true !== clickStatus) return { cleared: false, reason: "ROW_REMOVE_LINK_NOT_CLICKABLE:" + dirty };
      // The confirm dialog is pre-rendered (one of 11), so wait for VISIBILITY, never presence.
      var shown = await action.waitForDisplayed(bs.bulkConfirmRemoveRowYes, 5000); // BUDGET — client-side dialog
      if (true !== shown) return { cleared: false, reason: "CONFIRM_REMOVE_ROW_NOT_SHOWN:" + dirty };
      clickStatus = await action.click(bs.bulkConfirmRemoveRowYes);
      if (true !== clickStatus) return { cleared: false, reason: "CONFIRM_YES_NOT_CLICKABLE:" + dirty };
      // A Bootstrap fade: wait for the dialog to be fully hidden before touching the grid again.
      await action.waitForDisplayed(bs.bulkConfirmRemoveRowModal, 5000, true);
    }
    return { cleared: false, reason: "MORE_THAN_" + MAX_ROWS_TO_CLEAR + "_ROWS" };
  },

  /**
   * One read of everything TST_SBLK_TC_7 asserts about the loaded page.
   *
   * Every control is checked with isDisplayed: /bulk_activation pre-renders ELEVEN hidden
   * `.modal-content` dialogs (re-counted 2026-09-15), so any presence check is a guaranteed
   * false green (admin-shared.md §B2). Row fields are read for row 1, which clear_bulkGrid
   * guarantees exists.
   */
  getData_bulkActivationPage: async function () {
    await logger.logInto(await stackTrace.get());
    return {
      url: await browser.getUrl(),
      headingText: clean(await action.getText(this.bulkActivationHeading)),
      backDisplayed: await action.isDisplayed(this.bulkBackLink),
      uploadDisplayed: await action.isDisplayed(this.bulkUploadBtn),
      templateDisplayed: await action.isDisplayed(this.bulkTemplateLink),
      helpToggleDisplayed: await action.isDisplayed(this.bulkHelpToggle),
      rowCount: (await readRowNumbers()).length,
      emailOrUsernameDisplayed: await action.isDisplayed(rowSelector("emailOrUsername", 1)),
      firstNameDisplayed: await action.isDisplayed(rowSelector("firstName", 1)),
      lastNameDisplayed: await action.isDisplayed(rowSelector("lastName", 1)),
      activationCodeDisplayed: await action.isDisplayed(rowSelector("activationCode", 1)),
      activationCodePlaceholder: clean(await action.getAttribute(rowSelector("activationCode", 1), "placeholder")),
      activateText: clean(await action.getText(this.bulkActivateBtn)),
      // Natively disabled on a genuinely empty grid (attribute + .disabled + pointer-events:none).
      activateEnabled: await action.isEnabled(this.bulkActivateBtn),
      // ⚠️ `button.action-item.action-text` matches TWO buttons — the visible disabled one and a
      // hidden enabled twin (class `active`). The disabled one is the only visible match for
      // `.disable`, so "displayed" here means "Remove is shown in its disabled state".
      removeDisabledDisplayed: await action.isDisplayed(this.bulkRemoveBtnDisabled)
    };
  },

  /**
   * Types a value into one bulk-activation cell and blurs it with Tab.
   *
   * clearValue + addValue (pressSequentially), never setValue/fill — Angular ignores fill's
   * value (admin-shared.md §B5). Tab commits the value: the row's validation and the
   * email → name auto-fill both run on blur, not per keystroke (verified 2026-09-15).
   *
   * ⚠️ Filling a KNOWN email plus a code ENABLES "Activate 1 code" and the row is SAVED as a
   * server-side draft. This page object has no method that clicks Activate, on purpose, and
   * callers must run clear_bulkGrid before leaving the grid behind.
   *
   * @param {string} field - "emailOrUsername" | "firstName" | "lastName" | "activationCode"
   * @param {number} n - row number (1 after clear_bulkGrid)
   */
  set_bulkRowField: async function (field, n, value) {
    await logger.logInto(await stackTrace.get(), "field:" + field + " row:" + n + " value:" + value);
    var sel = rowSelector(field, n);
    if (!sel) return { setStatus: "UNKNOWN_FIELD:" + field };
    await action.clearValue(sel);
    var setStatus = await action.addValue(sel, value);
    if (true !== setStatus) return { setStatus: setStatus };
    return {
      setStatus: setStatus,
      keyStatus: await action.pressKey(sel, "Tab"),
      value: clean(await action.getValue(sel))
    };
  },

  /**
   * Waits for the product to auto-fill a row's First name after a known email was entered.
   * Returns true once it holds a value, false when the budget expires.
   */
  wait_forRowAutofill: async function (n) {
    await logger.logInto(await stackTrace.get(), "row:" + n);
    var deadline = Date.now() + AUTOFILL_TIMEOUT;
    var sel = rowSelector("firstName", n);
    while (Date.now() < deadline) {
      var v = clean(await action.getValue(sel));
      if (v && v.trim().length > 0) return true;
      await browser.pause(250); // polling interval — the auto-fill has no other observable signal
    }
    return false;
  },

  /**
   * A bulk-activation row's values, the Activate button state and every NON-EMPTY row message.
   *
   * `div.error-rectification-wrapper` renders one wrapper per cell and leaves the valid ones
   * EMPTY (verified 2026-09-15), so blanks are filtered out rather than counted.
   */
  getData_bulkRowState: async function (n) {
    await logger.logInto(await stackTrace.get(), "row:" + n);
    var messages = [];
    var els = await action.findElements(this.bulkRowError);
    if (Array.isArray(els)) {
      for (var i = 0; i < els.length; i++) {
        var t = await els[i].innerText();
        if (t && t.trim()) messages.push(t.trim());
      }
    }
    return {
      emailOrUsername: clean(await action.getValue(rowSelector("emailOrUsername", n))),
      firstName: clean(await action.getValue(rowSelector("firstName", n))),
      lastName: clean(await action.getValue(rowSelector("lastName", n))),
      activationCode: clean(await action.getValue(rowSelector("activationCode", n))),
      activateText: clean(await action.getText(this.bulkActivateBtn)),
      activateEnabled: await action.isEnabled(this.bulkActivateBtn),
      rowMessages: messages
    };
  },

  /** True when the browser is currently on /bulk_activation (so a reset knows to clear the grid). */
  getData_isOnBulkActivation: async function () {
    await logger.logInto(await stackTrace.get());
    return String(await browser.getUrl()).indexOf("/bulk_activation") >= 0;
  }
};

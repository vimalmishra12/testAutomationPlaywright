"use strict";
var action = require("../../core/actionLibrary/baseActionLibrary.js");
// Resolves to C1Selectors.json → css.ComproC1.changeSchoolKey
var selectorFile = jsonParserUtil.jsonParser(selectorDir);
var sk = selectorFile.css.ComproC1.changeSchoolKey;

/**
 * Admin App → School settings menu and the Change school key warning (module SKEY).
 *
 * 🚨🚨 THIS PAGE OBJECT EXPOSES NO WAY TO CONFIRM A KEY CHANGE, AND NEVER MAY. 🚨🚨
 * `continueBtn` (qid adEdit-3) PERMANENTLY changes the school key. There is no undo. On the primary
 * shared school FCN-CHZ-PDA that key is hardcoded across every admin suite's data, so one click
 * would break all of them at once (admin-shared.md §A10). The selector is bound only so a test can
 * assert the control is PRESENT. If you are tempted to add a `click_continue`, stop — the case that
 * needs it (TST_SKEY_TC_3) is Blocked at design time and must stay that way until a disposable
 * school exists.
 *
 * ⚠️ `TST_SKEY_TC_4` (open → Cancel) runs on KNF-XRD-QVE, NEVER FCN-CHZ-PDA
 * [user decision, 2026-09-14]. Cancel sits directly beside Continue.
 *
 * ---------------------------------------------------------------------------------------
 * TRAPS HANDLED  (grounded live on Thor 2026-09-11/14 — admin-shared.md §A10, §A12)
 * ---------------------------------------------------------------------------------------
 *
 * 1. THE DIALOG IS PRE-RENDERED AND HIDDEN, AND THE CLASSES TAB HOLDS 5 `.modal-content`.
 *    Its presence proves nothing (§B2), and an unscoped modal selector matches the wrong dialog.
 *    → every dialog selector is scoped with `#changeSchoolKey`, and state is read with visibility.
 *
 * 2. "CLOSED" IS NOT THE ABSENCE OF THE `show` CLASS.
 *    Measured 2026-09-14: after hiding began, the modal lost `show` while staying `display:block`
 *    with its `.modal-backdrop` and `body.modal-open` still in place for up to ~1.5 s. A check on
 *    `show` reports closed while the backdrop still blocks the page.
 *    → `getData_dialogState` reports all three signals; closed means content hidden AND no
 *      backdrop AND no body.modal-open. The backdrop and body class are GENUINELY removed, so their
 *      counts are truthful here (the rare §B2 exception).
 *
 * 3. CANCEL'S CLOSE WAS NOT OBSERVED WORKING FROM A SYNTHETIC CLICK.
 *    Cancel is `a[data-dismiss="modal"]`, relying on Bootstrap's delegated handler. During grounding
 *    a JS `.click()` did not close the dialog (Escape did). The grounding browser's real input was
 *    dead that day, so a REAL click was never tested. The framework clicks for real; this method
 *    therefore asserts the close outcome rather than trusting the click, and if the close does not
 *    happen it FAILS — there is deliberately no Escape fallback, because closing is the behaviour
 *    TST_SKEY_TC_4 is testing (Invariant 14: no resilience in the assertion path).
 *
 * 4. `adEdit` QIDS ARE NOT CONTIGUOUS.
 *    1 = trigger, 2/7/8 = menu items, 3/4 = dialog buttons. Never iterate the family.
 *
 * 5. THE LOADING OVERLAY SWALLOWS CLICKS ON VISIBLE ELEMENTS.
 *    Every click here is preceded by `waitForLoaderGone` — the root cause of most of the Library
 *    suite's first-run failures (schoolLibrary.page.js).
 */

/**
 * Budget for the dialog's fade-out. Measured 2026-09-14: the close completed within 1.5 s of the
 * hide starting. 5000 is ~3x that — short on purpose: this is client-side, and a long wait would
 * hide a close that never happens (admin-shared.md §B8).
 */
var DIALOG_CLOSE_TIMEOUT = 5000;

/**
 * Budget for the dialog or the settings menu to OPEN. BUDGET — unmeasured: in grounding the menu
 * items were pre-rendered and the dialog became visible within the first 150 ms poll. 5000 leaves
 * wide headroom on a slow Thor without approaching mocha's 120000.
 */
var OPEN_TIMEOUT = 5000;

/** Budget for the page loader to clear after a navigation. Matches schoolLibrary.page.js. */
var LOADER_TIMEOUT = 45000;

module.exports = {
  schoolSettingsTrigger: sk.schoolSettingsTrigger,
  changeSchoolKeyItem: sk.changeSchoolKeyItem,
  manageGradingCategoriesItem: sk.manageGradingCategoriesItem,
  manageGradingScalesItem: sk.manageGradingScalesItem,
  dialog: sk.dialog,
  dialogContent: sk.dialogContent,
  dialogWarningHeading: sk.dialogWarningHeading,
  dialogWarningIcon: sk.dialogWarningIcon,
  dialogTitle: sk.dialogTitle,
  dialogBody: sk.dialogBody,
  // 🚨 Bound for PRESENCE assertions only. Nothing in this file clicks it — see the header.
  continueBtn: sk.continueBtn,
  cancelBtn: sk.cancelBtn,
  modalBackdrop: sk.modalBackdrop,
  bodyModalOpen: sk.bodyModalOpen,
  schoolKeyText: sk.schoolKeyText,
  pageLoader: sk.pageLoader,

  /**
   * Confirms a school's Classes tab is ready for School-settings interaction: the trigger is
   * displayed and the loading overlay has cleared.
   */
  isInitialized: async function () {
    await logger.logInto(await stackTrace.get(), "waiting for the School settings trigger");
    var res = await action.waitForDisplayed(this.schoolSettingsTrigger, LOADER_TIMEOUT);
    if (true != res) {
      await logger.logInto(await stackTrace.get(), "the School settings trigger did not render", "error");
      return res;
    }
    return await this.waitForLoaderGone();
  },

  /**
   * Waits for the full-page loading overlay to disappear (trap 5).
   * `waitForDisplayed(sel, ms, true)` waits for the hidden state, which also covers "not in the DOM".
   */
  waitForLoaderGone: async function () {
    var res = await action.waitForDisplayed(this.pageLoader, LOADER_TIMEOUT, true);
    if (true != res) {
      await logger.logInto(await stackTrace.get(), "the page loading overlay never cleared", "error");
      return res;
    }
    return true;
  },

  /**
   * Opens the School settings menu and returns its items in DOM order.
   *
   * The three items are pre-rendered and hidden while the menu is closed, so "open" is proven by
   * the first item becoming VISIBLE, not by the items existing (trap 1 / §B2).
   *
   * @returns {{opened: boolean|Error, items: string[], changeSchoolKeyVisible: boolean}}
   */
  getData_settingsMenu: async function () {
    await logger.logInto(await stackTrace.get(), "opening the School settings menu");
    var clear = await this.waitForLoaderGone();
    if (true != clear) return { opened: clear, items: [], changeSchoolKeyVisible: false };

    var res = await action.click(this.schoolSettingsTrigger);
    if (true != res) return { opened: res, items: [], changeSchoolKeyVisible: false };

    var opened = await action.waitForDisplayed(this.changeSchoolKeyItem, OPEN_TIMEOUT);
    var items = [];
    var selectors = [this.changeSchoolKeyItem, this.manageGradingCategoriesItem, this.manageGradingScalesItem];
    for (var i = 0; i < selectors.length; i++) {
      var t = await action.getText(selectors[i]);
      items.push(typeof t == "string" ? t.replace(/\s+/g, " ").trim() : "");
    }
    return {
      opened: opened,
      items: items,
      changeSchoolKeyVisible: true == (await action.isDisplayed(this.changeSchoolKeyItem))
    };
  },

  /**
   * Opens the Change school key WARNING. This is safe: the warning is a confirmation step, and the
   * key changes only on Continue — which nothing here clicks.
   */
  click_changeSchoolKey: async function () {
    await logger.logInto(await stackTrace.get(), "opening the Change school key warning");
    var menu = await this.getData_settingsMenu();
    if (true != menu.opened) return menu.opened;

    var res = await action.click(this.changeSchoolKeyItem);
    if (true != res) {
      await logger.logInto(await stackTrace.get(), "Change school key could not be clicked", "error");
      return res;
    }
    var shown = await action.waitForDisplayed(this.dialogContent, OPEN_TIMEOUT);
    if (true != shown) {
      await logger.logInto(await stackTrace.get(), "the warning dialog did not become visible", "error");
      return shown;
    }
    return true;
  },

  /**
   * Reads the warning dialog's visible copy and controls.
   * Text is whitespace-squashed so it can be compared verbatim (admin-shared.md §A6).
   */
  getData_warningDialog: async function () {
    await logger.logInto(await stackTrace.get(), "reading the warning dialog");
    var squash = function (v) { return typeof v == "string" ? v.replace(/\s+/g, " ").trim() : null; };
    return {
      visible: true == (await action.isDisplayed(this.dialogContent)),
      warningHeading: squash(await action.getText(this.dialogWarningHeading)),
      warningIconCount: await action.getElementCount(this.dialogWarningIcon),
      title: squash(await action.getText(this.dialogTitle)),
      body: squash(await action.getText(this.dialogBody)),
      continueText: squash(await action.getText(this.continueBtn)),
      cancelText: squash(await action.getText(this.cancelBtn))
    };
  },

  /**
   * Reports the three signals that together define "dialog closed" (trap 2).
   */
  getData_dialogState: async function () {
    var contentVisible = true == (await action.isDisplayed(this.dialogContent));
    var backdrops = await action.getElementCount(this.modalBackdrop);
    var bodyOpen = await action.getElementCount(this.bodyModalOpen);
    backdrops = typeof backdrops == "number" ? backdrops : -1;
    bodyOpen = typeof bodyOpen == "number" ? bodyOpen : -1;
    return {
      contentVisible: contentVisible,
      backdropCount: backdrops,
      bodyModalOpen: bodyOpen > 0,
      closed: !contentVisible && backdrops === 0 && bodyOpen === 0
    };
  },

  /**
   * Clicks CANCEL on the warning and waits for the dialog to be genuinely closed.
   *
   * Guarded twice before clicking: the dialog must be visible, and the target must read "Cancel".
   * A wrong target here is not a failed test — it is an irreversible key change — so the method
   * refuses rather than risks it. Returns an Error, never throws (ADR-009).
   */
  click_cancelWarning: async function () {
    await logger.logInto(await stackTrace.get(), "cancelling the Change school key warning");
    if (true != (await action.isDisplayed(this.dialogContent))) {
      var notOpen = new Error("refusing to click Cancel: the warning dialog is not visible");
      await logger.logInto(await stackTrace.get(), notOpen.message, "error");
      return notOpen;
    }
    var label = await action.getText(this.cancelBtn);
    if (typeof label != "string" || label.replace(/\s+/g, " ").trim() !== "Cancel") {
      var wrong = new Error("refusing to click: the Cancel control reads '" + label + "', not 'Cancel'");
      await logger.logInto(await stackTrace.get(), wrong.message, "error");
      return wrong;
    }

    var res = await action.click(this.cancelBtn);
    if (true != res) return res;

    // Poll the three closed signals together — see trap 2 for why `show` alone is not enough.
    var deadline = Date.now() + DIALOG_CLOSE_TIMEOUT;
    var state = null;
    while (Date.now() < deadline) {
      state = await this.getData_dialogState();
      if (state.closed) {
        await logger.logInto(await stackTrace.get(), "the warning dialog is closed");
        return true;
      }
      await browser.pause(150);
    }
    var err = new Error(
      "the warning dialog did not close within " + DIALOG_CLOSE_TIMEOUT + "ms of Cancel: " + JSON.stringify(state)
    );
    await logger.logInto(await stackTrace.get(), err.message, "error");
    return err;
  },

  /** Returns the school key displayed on the Classes tab, trimmed. */
  getData_schoolKey: async function () {
    var t = await action.getText(this.schoolKeyText);
    return typeof t == "string" ? t.trim() : t;
  }
};

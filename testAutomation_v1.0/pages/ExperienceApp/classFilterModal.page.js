"use strict";
var action = require("../../core/actionLibrary/baseActionLibrary.js");
// Selectors resolved at load time from C1Selectors.json → css.ComproC1.classFilterModal
var selectorFile = jsonParserUtil.jsonParser(selectorDir);

module.exports = {
  // Resolves to C1Selectors.json → css.ComproC1.classFilterModal.*
  modalRoot: selectorFile.css.ComproC1.classFilterModal.modalRoot,
  modalTitle: selectorFile.css.ComproC1.classFilterModal.modalTitle,
  // Selector TEMPLATES (contain {{key}}) — resolved per status/label at call time, same
  // pattern as schoolAdminDashboard.schoolLinkByKey (runtime value, not a raw literal).
  statusOptionByLabel: selectorFile.css.ComproC1.classFilterModal.statusOptionByLabel,
  statusCheckboxByLabel: selectorFile.css.ComproC1.classFilterModal.statusCheckboxByLabel,
  labelSearchInput: selectorFile.css.ComproC1.classFilterModal.labelSearchInput,
  labelOptionByName: selectorFile.css.ComproC1.classFilterModal.labelOptionByName,
  selectedLabelChip: selectorFile.css.ComproC1.classFilterModal.selectedLabelChip,
  clearAllBtn: selectorFile.css.ComproC1.classFilterModal.clearAllBtn,
  applyBtn: selectorFile.css.ComproC1.classFilterModal.applyBtn,
  closeBtn: selectorFile.css.ComproC1.classFilterModal.closeBtn,

  /**
   * Confirms the Filter modal (#classSortFilterModal) is open.
   * Anchors on the modal root — unique to this dialog.
   */
  isInitialized: async function () {
    var res;
    await logger.logInto(await stackTrace.get());
    res = {
      pageStatus: await action.waitForDisplayed(this.modalRoot)
    };
    return res;
  },

  /**
   * TST_CLST_TC_2 support — reads presence of the modal's expected options (Req #2):
   * at least one Class status option, the Class labels "Find a label" input, Clear all
   * and Apply buttons.
   */
  getData_filterOptions: async function () {
    await logger.logInto(await stackTrace.get());
    var obj = {
      modalDisplayed: (await action.getElementCount(this.modalRoot)) > 0,
      statusOptionsDisplayed:
        (await action.getElementCount(this.statusOptionByLabel.replace("{{status}}", "Active"))) > 0,
      labelSearchInputDisplayed: (await action.getElementCount(this.labelSearchInput)) > 0,
      clearAllBtnDisplayed: (await action.getElementCount(this.clearAllBtn)) > 0,
      applyBtnDisplayed: (await action.getElementCount(this.applyBtn)) > 0
    };
    console.log("filterModalOptions", obj);
    return obj;
  },

  /**
   * Selects a Class status option (e.g. "Active").
   * The real <input type="radio"> is aria-hidden/tabindex=-1 and NOT clickable — the
   * interactive element is the wrapping div[role="radio"], whose aria-checked carries
   * the selected state. Clicks that div and confirms aria-checked flipped to "true".
   */
  select_status: async function (status) {
    await logger.logInto(await stackTrace.get(), "selecting status: " + status);
    var selector = this.statusCheckboxByLabel.replace("{{status}}", status);
    // The modal is a slide-in panel: in a full-suite run the click can land before the
    // panel has finished rendering its options, so gate on the real signals first —
    // panel present, then the option rendered and clickable (Invariant 1: no blind pause).
    await action.waitForDisplayed(this.modalRoot, 10000);
    await action.waitForDisplayed(selector, 10000);
    await action.waitForClickable(selector, 10000);
    var res = await action.click(selector);
    if (true == res) {
      res = (await action.getAttribute(selector, "aria-checked")) === "true";
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + " status " + status + " is NOT clicked",
        "error"
      );
    }
    return res;
  },

  /**
   * Types into "Find a label" and selects the matching label from the dropdown.
   * React-rendered input — types with addValue (Invariant 6), not setValue/fill.
   */
  select_label: async function (label) {
    await logger.logInto(await stackTrace.get(), "selecting label: " + label);
    await action.waitForDisplayed(this.modalRoot, 10000);
    await action.waitForDisplayed(this.labelSearchInput, 10000);
    // addValue uses pressSequentially, which APPENDS. Clearing the filter does not clear
    // this input, so a second select_label in the same session would type "VM1VM1" and
    // match nothing. Clear first, then type — pressSequentially fires the real keyup the
    // Angular combobox listens on (fill() alone does not open the suggestion list).
    var optionSelector = this.labelOptionByName.replace(/{{label}}/g, label);
    var res;
    // The suggestion list is a DEBOUNCED async search: immediately after the final
    // keystroke the list is transiently EMPTY, then repopulates ~1-3s later. Observed
    // live: typing "VM1" gave 6 → 2 → 0 suggestions, then 1 after settling. A single
    // type+wait therefore races the refetch and intermittently never sees the option.
    // Retry the whole type cycle (poll/retry over fixed pause — cross-app lesson).
    // The per-attempt wait must exceed the debounce: at 1000ms this raced and TST_CLST_TC_19
    // exhausted all 3 attempts on a label that TC_4 selected fine (live run 2026-08-15).
    // Also note the suggestion list only populates from REAL keystrokes — setting .value
    // programmatically does not fire Angular's search (confirmed live), which is why this
    // uses addValue/pressSequentially (Invariant 6).
    for (var attempt = 1; attempt <= 3; attempt++) {
      // Click the input before typing. The Angular combobox opens its suggestion dropdown off
      // a focus/click on the field, and the modal (and this input) PERSIST in the DOM between
      // TCs — so on the second and later select_label calls the field is often still focused,
      // no fresh focus event fires, and the dropdown never opens no matter what is typed.
      // That is what made the first label selection of a run succeed and later ones fail with
      // an empty suggestion list (diagnosed 2026-08-15; every manual repro clicked the field
      // first, which is why it never reproduced by hand).
      await action.click(this.labelSearchInput);
      await action.clearValue(this.labelSearchInput);
      // addValue = pressSequentially, which APPENDS — clearing first keeps a repeat
      // call from typing e.g. "VM1VM1", which matches nothing.
      res = await action.addValue(this.labelSearchInput, label);
      if (true != res) {
        await logger.logInto(await stackTrace.get(), res + " label search input NOT set", "error");
        return res;
      }
      if (true == (await action.waitForDisplayed(optionSelector, 5000))) {
        await action.waitForClickable(optionSelector, 5000);
        res = await action.click(optionSelector);
        // Confirm the label actually became a selected chip before reporting success.
        var chipSelector = this.selectedLabelChip.replace(/{{label}}/g, label);
        if (true == res && (await action.getElementCount(chipSelector)) > 0) {
          return true;
        }
      }
      await logger.logInto(
        await stackTrace.get(),
        "label '" + label + "' suggestion not ready (attempt " + attempt + "/3) — retrying",
        "error"
      );
    }
    return new Error("label '" + label + "' could not be selected after 3 attempts");
  },

  /**
   * Clicks "Clear all" and confirms the applied filter was actually reset (TST_CLST_TC_19).
   *
   * Verified live 2026-08-15: "Clear all" clears the APPLIED filter *and closes the panel*.
   * During the ~3.6s close the panel keeps its stale chips and aria-checked state in the DOM,
   * so asserting on the panel's own markup right after the click reads the PRE-clear state and
   * can never pass. (Reopening the panel afterwards shows it correctly rebuilt: all radios
   * aria-checked=false, no chips.) The reliable signal is at PAGE level — the "Clear" link
   * (qid=aClass-19) is rendered only while a filter is applied, so its disappearance is the
   * confirmation that the reset landed.
   *
   * Returns { chipCleared: <bool> }.
   */
  click_clearAll: async function () {
    await logger.logInto(await stackTrace.get());
    var schoolClasses = require("./schoolClasses.page.js");
    var obj = { chipCleared: false };
    var res = await action.click(this.clearAllBtn);
    if (true == res) {
      await logger.logInto(await stackTrace.get(), "clearAllBtn is clicked");
      // Clear all closes the panel as part of its action — let it finish first.
      await action.waitForDisplayed(this.modalRoot, 15000, true);
      // Filter cleared ⇒ the page-level "Clear" link is no longer rendered.
      obj.chipCleared = await action.waitForDisplayed(
        schoolClasses.clearFilterLink,
        10000,
        true
      );
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + " clearAllBtn is NOT clicked",
        "error"
      );
    }
    console.log("clearAll", obj);
    return obj;
  },

  /**
   * Resets the Classes tab to an unfiltered state, whatever state it is currently in.
   *
   * Run from the suite's **BeforeEach as well as AfterEach** (ADR-011 — TCs must be
   * independent). BeforeEach is the one that matters: the applied filter is persisted
   * SERVER-SIDE, so an AfterEach-only reset cannot protect a TC from state left behind by a
   * previous *run* (or by a run that crashed). This bled real failures — TST_CLST_TC_19
   * inherited TC_4's applied "VM1" filter, and because the label suggestion search is scoped
   * to the currently applied result set, searching "VM1" inside an already-VM1-filtered
   * (empty) list returned nothing and the label could never be selected.
   *
   * Tolerant by design: if the modal is open it closes it first, and if no filter is set the
   * whole thing is a no-op. Never throws, so a reset can't fail an otherwise-passing test.
   */
  reset_filters: async function () {
    await logger.logInto(await stackTrace.get(), "resetting filter state");
    var schoolClasses = require("./schoolClasses.page.js");
    try {
      // A failed TC can leave the modal open — close it first so the page-level
      // "Clear" link is reachable.
      //
      // MUST gate on VISIBILITY, not element count: #classSortFilterModal stays in the DOM
      // when closed (display:none), so getElementCount() > 0 is ALWAYS true. The old check
      // therefore always tried to click the hidden close button, which timed out on
      // actionability, threw, and was swallowed by the catch below — so the Clear-link click
      // never ran and the filter survived the reset. That is why an applied filter persisted
      // across runs and even into a fresh browser login (diagnosed live 2026-08-15).
      if (true === (await action.isDisplayed(this.modalRoot))) {
        await action.click(this.closeBtn);
        await action.waitForDisplayed(this.modalRoot, 15000, true);
      }
      // The page shows a "Clear" link (qid=aClass-19) only while a filter is applied —
      // one click resets every chip, which is why this is preferred over reopening the
      // modal to press Clear all + Apply. Absent link = nothing to reset (no-op).
      //
      // Retry: the applied filter is PERSISTED SERVER-SIDE (verified 2026-08-15 — a filter
      // left by one run was still applied after a completely fresh browser login), so a
      // half-completed clear leaks into the next TC and the next run. One click is normally
      // enough; the loop is the safety net.
      var hadFilter = await action.isDisplayed(schoolClasses.clearFilterLink);
      if (true === hadFilter) {
        for (var attempt = 1; attempt <= 3; attempt++) {
          if (true !== (await action.isDisplayed(schoolClasses.clearFilterLink))) break;
          await action.click(schoolClasses.clearFilterLink);
          await action.waitForDisplayed(schoolClasses.clearFilterLink, 10000, true);
        }
        await browser.pause(1000);
        await action.waitForDisplayed(schoolClasses.classRow, 20000);
      }
    } catch (e) {
      await logger.logInto(await stackTrace.get(), "reset_filters ignored: " + e.message, "error");
    }
    return true;
  },

  /**
   * Clicks "Apply" and confirms the modal closed (returns to the Classes tab).
   *
   * Timing measured live 2026-08-15: after Apply the panel keeps class "show" for ~3.37s,
   * then fades (Bootstrap keeps display:block at opacity 0 — which Playwright still counts
   * as VISIBLE), and only reaches display:none at ~3.61s. The previous 1000ms budget expired
   * mid-animation, which is what failed TC_3 / TC_4 / TC_22 with "Filter modal did not close
   * after Apply". 15s leaves headroom for the grid re-render on larger schools.
   */
  click_apply: async function () {
    await logger.logInto(await stackTrace.get());
    await action.waitForDisplayed(this.applyBtn, 10000);
    await action.waitForClickable(this.applyBtn, 10000);
    var res = await action.click(this.applyBtn);
    if (true == res) {
      await logger.logInto(await stackTrace.get(), "applyBtn is clicked");
      res = { pageStatus: await action.waitForDisplayed(this.modalRoot, 15000, true) };
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + " applyBtn is NOT clicked",
        "error"
      );
    }
    return res;
  },

  /**
   * Closes the Filter modal via its "X" close icon without applying any selection.
   * Used to reset modal state between TCs that only inspect the modal (e.g.
   * TST_CLST_TC_2) so a later TC's click_filter() is not blocked by an already-open
   * modal.
   */
  click_close: async function () {
    await logger.logInto(await stackTrace.get());
    // Gate on the close button being clickable first. isInitialized() resolves as soon as the
    // panel root becomes visible, which is EARLY in the slide-in animation — clicking X at
    // that point was swallowed by the still-animating panel, so the modal never closed and
    // this returned a TimeoutError. It went unnoticed because TST_CLST_TC_2 did not assert
    // the result and the AfterEach reset closed the panel for it (diagnosed 2026-08-15).
    await action.waitForDisplayed(this.closeBtn, 10000);
    var res = { pageStatus: false };
    // WORKAROUND — product bug, Filter panel X close (reported 2026-08-15, fix pending).
    // This is a PRODUCT defect, not an automation timing issue: action.click() reports
    // success but the panel stays open, and waiting longer does not help (a clean 0.9s close
    // and a full 15s timeout were observed on consecutive runs with identical code and data).
    // Re-clicking is what resolves it. Retained by explicit user decision to keep the suite
    // green until the app is fixed — REMOVE this retry then, so TST_CLST_TC_2 goes back to
    // catching the defect rather than routing around it (Invariant 14).
    for (var attempt = 1; attempt <= 3; attempt++) {
      await action.waitForClickable(this.closeBtn, 10000);
      var clicked = await action.click(this.closeBtn);
      if (true != clicked) {
        await logger.logInto(
          await stackTrace.get(),
          clicked + " closeBtn is NOT clicked (attempt " + attempt + "/3)",
          "error"
        );
        continue;
      }
      await logger.logInto(await stackTrace.get(), "closeBtn is clicked (attempt " + attempt + "/3)");
      if (true == (await action.waitForDisplayed(this.modalRoot, 5000, true))) {
        res.pageStatus = true;
        return res;
      }
      await logger.logInto(
        await stackTrace.get(),
        "panel still open after close attempt " + attempt + "/3 — retrying",
        "error"
      );
    }
    return res;
  }
};

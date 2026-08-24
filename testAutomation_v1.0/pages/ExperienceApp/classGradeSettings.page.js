"use strict";
var action = require("../../core/actionLibrary/baseActionLibrary.js");
// Selectors resolved at load time from C1Selectors.json -> css.ComproC1.classGradeSettings
var selectorFile = jsonParserUtil.jsonParser(selectorDir);
var cgs = selectorFile.css.ComproC1.classGradeSettings;

/**
 * CLASS GRADE SETTINGS (module CGST, Requirement #22) - /class/.../<uuid>/grade-weighting
 *
 * Entry is the class page's Actions menu (activeClass.page.js): click_actionButton() then
 * classGradeSettingsLink (a[qid='cView-60']). NOTE that "Delete class" (cView-13) lives in
 * the SAME menu, which is what lets a suite exercise this page and then delete the class
 * without re-navigating.
 *
 * TIMEOUT BUDGET - partially measured (2026-08-20, thor, FCN-CHZ-PDA).
 *   MEASURED: the page renders essentially immediately after the Actions-menu click; the
 *   change-scale modal opens and closes without a perceptible delay; a freshly created
 *   class became launchable with a working grade-settings page ~59 s after "Create".
 *   NOT MEASURED: the Save round-trip. The Phase-1 capture session deliberately never
 *   clicked Save (it was inspecting a class it did not own), so SAVE_TIMEOUT below is a
 *   BUDGET carried over from the grading-scales/categories family, not an observation.
 *   Phase 2 must log the real settle time and replace this note.
 *
 * SELECTOR TRAPS (all verified live 2026-08-20) - read before changing anything.
 *
 * 1. THE TOTAL AND THE SAVE BUTTON UPDATE ON BLUR, NOT ON KEYSTROKE. With the material at
 *    100 and a category typed to 500, the page still showed "Total grade: 100%" AND Save
 *    was ENABLED until the field was blurred; on blur the total corrected to 600%, the
 *    error appeared and Save re-disabled. Every set_* method here therefore blurs (Tab)
 *    before returning, and no caller may assert a total or a Save state without it.
 *    This is Invariant 6's "a DOM flag is not the form's model" in its purest form: reading
 *    without blurring would report the 100% validation as BROKEN when it works correctly.
 *
 * 2. span.percent-error JOINS THE SAME <p> AS THE TOTAL when a weightage is invalid, so the
 *    obvious "div.d-flex.pt-4 p.mb-0 span" matched BOTH the value and the error message.
 *    totalGradeValue is :not(.percent-error)-scoped for exactly this reason. Two distinct
 *    errors exist: weightageFieldError (per input, "Please enter a number 0-100") and
 *    totalGradeError (footer, "Your weighting choices exceed the maximum of 100%").
 *
 * 3. qid gradeW-14 IS DUPLICATED IN THE PRODUCT - it is on both the "Other grading
 *    categories" toggle and an unrelated .close-btn. otherCategoriesToggle is class-scoped
 *    (.other-grading-items). Never shorten it back to the bare qid.
 *
 * 4. h5.grading-scale-heading is REUSED by both "Grading Scale" and "Score settings", so it
 *    is registered as the LIST selector sectionHeading (count 2) and read as a list. Only
 *    h5.score-calc-heading is unique.
 *
 * 5. Apply / Cancel (modal) and Cancel (page) are <a> elements carrying a `disabled` CLASS,
 *    NOT the disabled property - action.waitForEnabled cannot see this. Only #gradeW-save-btn
 *    is a real <button> with a real .disabled. isDisabledLink() below reads the class list.
 *
 * 6. "Add a grading category" inserts an INLINE ROW - it does not open a modal. Its own
 *    label then flips to "Add ANOTHER grading category", so never assert the first wording
 *    unconditionally.
 *
 * 7. CANCEL DOES NOT RESET THE FORM IN PLACE. Clicking #gradeW-cancel-btn on a dirty form
 *    left the added category row and the wrong total on screen. reload_page() is the only
 *    reliable discard - use it, never Cancel, when a TC needs a clean form.
 *
 * 8. Scale radios (grade-scale-radio-<n>) and category options (data-items-dropdown-view-0-<n>)
 *    are POSITIONAL over lists that other suites mutate. Every selection here is BY NAME via
 *    findScaleRowIndex / the option-text scan - never by a literal index.
 *
 * 9. THE OVERRIDE TOGGLE RAISES A CONFIRMATION DIALOG, and leaving it open silently blocks
 *    every later click on the page while READS keep working. This single miss caused 5 of the
 *    6 failures on the first run and made four unrelated TCs look individually broken. See
 *    click_overrideToggle. Any future control that opens a dialog must close it in the same
 *    method - never leave one open across a TC boundary.
 *
 * 10. isInitialized MUST wait for the form STATE, not just the button's presence: Save renders
 *    before Angular's form-state binding runs, so a pristine page can momentarily report Save
 *    as ENABLED. See isInitialized.
 */
var SETTLE_TIMEOUT = 15000;
var SAVE_TIMEOUT = 20000; // budget, not measured - see header
// How long isInitialized waits for the Angular form state to settle (trap 10). Short on
// purpose: it is a render-vs-binding race, not a network wait, and a long budget here would
// hide a genuinely dirty-on-load form instead of failing on it.
var FORM_SETTLE_TIMEOUT = 5000;

/** getText with ADR-009's Error return folded into "", so callers can compare strings. */
async function readText(selector) {
  var t = await action.getText(selector);
  return t && t.message ? "" : String(t).trim();
}

/** getValue with the same Error-to-"" folding. */
async function readValue(selector) {
  var v = await action.getValue(selector);
  return v && v.message ? "" : String(v);
}

/** getElementCount folded to 0 on Error, so callers can do arithmetic safely. */
async function readCount(selector) {
  var c = await action.getElementCount(selector);
  return typeof c === "number" ? c : 0;
}

/** Reads the innerText of the k-th match of a list selector. "" when unreadable. */
async function readKthText(selector, k) {
  var loc = await action.getKthElement(selector, k);
  if (!loc) return "";
  var t = await action.getText(loc);
  return t && t.message ? "" : String(t).trim();
}

/**
 * True when an <a> carries the `disabled` CLASS (trap 5). Returns null when the element
 * is missing, so callers can tell "absent" from "present but enabled".
 */
async function isDisabledLink(selector) {
  if ((await readCount(selector)) === 0) return null;
  var cls = await action.getAttribute(selector, "class");
  if (cls && cls.message) return null;
  return String(cls || "").split(/\s+/).indexOf("disabled") !== -1;
}

/** Row index of the scale whose row text contains `name`. -1 when absent. */
async function findScaleRowIndex(name) {
  var count = await readCount(cgs.scaleModalRow);
  for (var i = 0; i < count; i++) {
    if ((await readKthText(cgs.scaleModalRow, i)).indexOf(name) !== -1) return i;
  }
  return -1;
}

/**
 * Index of the dropdown option whose text is EXACTLY `name`. Exact, not contains, because
 * the shared category list holds near-duplicates ("new catagory" / "new Grading Category").
 */
async function findOptionIndex(listSelector, name) {
  var count = await readCount(listSelector);
  for (var i = 0; i < count; i++) {
    if ((await readKthText(listSelector, i)) === name) return i;
  }
  return -1;
}

/** Fills a numeric field the way an Angular form expects, then BLURS (trap 1). */
async function setNumericField(selector, value) {
  var res = { set: false, blurred: false, value: "" };
  res.cleared = await action.clearValue(selector);
  if (true != res.cleared) return res;
  res.typed = await action.addValue(selector, String(value));
  if (true != res.typed) return res;
  // Trap 1: the model, the total and the Save state only update on blur.
  res.blurred = (await action.pressTab()) === true;
  res.value = await readValue(selector);
  res.set = res.value === String(value);
  return res;
}

module.exports = {
  gradeWeightingPage: cgs.gradeWeightingPage,
  pageHeading: cgs.pageHeading,
  className: cgs.className,
  backLink: cgs.backLink,
  userGuideLink: cgs.userGuideLink,
  sectionHeading: cgs.sectionHeading,
  scaleName: cgs.scaleName,
  scaleDescription: cgs.scaleDescription,
  changeScaleBtn: cgs.changeScaleBtn,
  overrideToggle: cgs.overrideToggle,
  scoreCalcHeading: cgs.scoreCalcHeading,
  scoreCalcDropdown: cgs.scoreCalcDropdown,
  scoreCalcMenuOpen: cgs.scoreCalcMenuOpen,
  scoreCalcOption: cgs.scoreCalcOption,
  materialRow: cgs.materialRow,
  materialWeightageInput: cgs.materialWeightageInput,
  otherCategoriesToggle: cgs.otherCategoriesToggle,
  addCategoryLink: cgs.addCategoryLink,
  categoryPicker: cgs.categoryPicker,
  categoryMenuOpen: cgs.categoryMenuOpen,
  categoryOption: cgs.categoryOption,
  categoryWeightageInput: cgs.categoryWeightageInput,
  totalGradeLabel: cgs.totalGradeLabel,
  totalGradeValue: cgs.totalGradeValue,
  weightageError: cgs.weightageError,
  weightageFieldError: cgs.weightageFieldError,
  totalGradeError: cgs.totalGradeError,
  cancelBtn: cgs.cancelBtn,
  saveBtn: cgs.saveBtn,
  // Modal
  scaleModal: cgs.scaleModal,
  scaleModalClose: cgs.scaleModalClose,
  scaleModalRadio: cgs.scaleModalRadio,
  scaleModalLabel: cgs.scaleModalLabel,
  scaleModalRow: cgs.scaleModalRow,
  scaleModalActiveRow: cgs.scaleModalActiveRow,
  scaleModalManageLink: cgs.scaleModalManageLink,
  scaleModalCancel: cgs.scaleModalCancel,
  scaleModalApply: cgs.scaleModalApply,
  overrideModal: cgs.overrideModal,
  overrideModalConfirm: cgs.overrideModalConfirm,
  overrideModalCancel: cgs.overrideModalCancel,
  overrideModalClose: cgs.overrideModalClose,
  savedModal: cgs.savedModal,
  savedModalClose: cgs.savedModalClose,
  savedModalBackToClassData: cgs.savedModalBackToClassData,
  cancelWarningModal: cgs.cancelWarningModal,
  cancelWarningGoBack: cgs.cancelWarningGoBack,
  cancelWarningConfirm: cgs.cancelWarningConfirm,
  totalWeightageErrorModal: cgs.totalWeightageErrorModal,
  totalWeightageErrorClose: cgs.totalWeightageErrorClose,
  saveErrorModal: cgs.saveErrorModal,
  removeCategoryModal: cgs.removeCategoryModal,
  removeCategoryConfirm: cgs.removeCategoryConfirm,
  removeCategoryCancel: cgs.removeCategoryCancel,
  maxCategoriesModal: cgs.maxCategoriesModal,
  maxCategoriesClose: cgs.maxCategoriesClose, // the max-categories modal's own "Go back"
  createCategoryModal: cgs.createCategoryModal,
  // Selector TEMPLATES - resolved per index at call time.
  materialWeightageByIndex: cgs.materialWeightageByIndex,
  categoryWeightageByIndex: cgs.categoryWeightageByIndex,
  categoryRemoveByIndex: cgs.categoryRemoveByIndex,
  scaleModalRadioByIndex: cgs.scaleModalRadioByIndex,

  /**
   * Confirms the Class grade settings page is loaded. Anchors on the Save button: it is the
   * only element unique to this page that is a real <button> with a real disabled property,
   * and it is present in both the pristine and dirty states. Deliberately NOT the <h1> or
   * the tab title - the title briefly reads "Class Page" before settling (see product notes).
   */
  isInitialized: async function () {
    await logger.logInto(await stackTrace.get());
    await action.waitForDocumentLoad();
    var res = { pageStatus: await action.waitForDisplayed(this.saveBtn, SETTLE_TIMEOUT) };
    if (true !== res.pageStatus) return res;

    /*
     * TRAP 10 (found on the first run, 2026-08-20): waitForDisplayed returns the moment the
     * button is RENDERED, which is not the moment the Angular form-state binding has run.
     * TST_CGST_TC_1 read Save as ENABLED on a brand-new class whose form was visibly pristine,
     * and failed its "pristine form cannot be saved" assertion.
     *
     * So the page is not "ready" until the form state has settled. Poll briefly for Save to
     * reach its disabled (pristine) state.
     *
     * This is a BOUNDED wait that does NOT mask a real finding: if a freshly created class
     * genuinely loads with a dirty form, the poll simply expires, formSettled comes back
     * false, and TC_1's assertion still fails - which is the correct outcome, because that
     * would be product behaviour worth reporting rather than waiting away (Invariant 14).
     */
    var deadline = Date.now() + FORM_SETTLE_TIMEOUT;
    res.formSettled = false;
    while (Date.now() < deadline) {
      if ((await action.getAttribute(this.saveBtn, "disabled")) !== null) {
        res.formSettled = true;
        break;
      }
      await browser.pause(150);
    }
    if (!res.formSettled) {
      await logger.logInto(
        await stackTrace.get(),
        "form did not settle to a pristine state within " + FORM_SETTLE_TIMEOUT + "ms " +
          "(Save stayed enabled) - see trap 10",
        "error"
      );
    }
    return res;
  },

  /**
   * Everything TST_CGST_TC_1 asserts, in one read: the page identity plus the presence of
   * each section the requirement names. Read-only - does not touch the form.
   */
  getData_pageLayout: async function () {
    await logger.logInto(await stackTrace.get());
    var sectionCount = await readCount(this.sectionHeading);
    var sections = [];
    for (var i = 0; i < sectionCount; i++) sections.push(await readKthText(this.sectionHeading, i));
    var saveCount = await readCount(this.saveBtn);
    return {
      heading: await readText(this.pageHeading),
      className: await readText(this.className),
      scaleName: await readText(this.scaleName),
      scaleDescription: await readText(this.scaleDescription),
      sectionHeadings: sections,
      scoreCalcHeadingText: await readText(this.scoreCalcHeading),
      scoreCalculation: await readText(this.scoreCalcDropdown),
      changeScaleDisplayed: await action.isDisplayed(this.changeScaleBtn),
      overrideDisplayed: await action.isDisplayed(this.overrideToggle),
      materialCount: await readCount(this.materialRow),
      weightageCount: await readCount(this.materialWeightageInput),
      addCategoryText: await readText(this.addCategoryLink),
      totalLabel: await readText(this.totalGradeLabel),
      totalValue: await readText(this.totalGradeValue),
      saveDisplayed: saveCount > 0,
      saveDisabled: saveCount > 0 ? await action.getAttribute(this.saveBtn, "disabled") !== null : null
    };
  },

  /**
   * The form's dirty state, straight from the app's own signal. Save is a real <button>, so
   * this is the genuine disabled property (unlike the <a> Cancel - trap 5).
   */
  getData_saveState: async function () {
    await logger.logInto(await stackTrace.get());
    return {
      displayed: await action.isDisplayed(this.saveBtn),
      disabled: (await action.getAttribute(this.saveBtn, "disabled")) !== null
    };
  },

  /** The current total plus whichever validation messages are on screen (trap 2). */
  getData_totals: async function () {
    await logger.logInto(await stackTrace.get());
    return {
      totalValue: await readText(this.totalGradeValue),
      errorCount: await readCount(this.weightageError),
      totalError: (await readCount(this.totalGradeError)) > 0 ? await readText(this.totalGradeError) : "",
      fieldError: (await readCount(this.weightageFieldError)) > 0 ? await readText(this.weightageFieldError) : ""
    };
  },

  /**
   * Discards unsaved edits. Trap 7: Cancel does NOT reset the form in place, so a reload is
   * the only reliable discard. Returns isInitialized so the caller can assert it came back.
   */
  reload_page: async function () {
    await logger.logInto(await stackTrace.get());
    await browser.refresh();
    return await this.isInitialized();
  },

  /**
   * Saves, waits for the product's own success dialog, and CLOSES IT.
   *
   * TRAP 11 (cost a run, 2026-08-20): a successful save opens
   * #changesSavedConfirmationModal ("Changes saved - Your changes have been applied to your
   * class settings"). The first version of this method polled for Save to go back to disabled,
   * which it does - so it reported success and returned with the dialog still open, silently
   * blocking every click in the four TCs that followed.
   *
   * Waiting on the dialog is also a STRONGER check than watching the Save button: it is the
   * app's own explicit statement that the round-trip succeeded, whereas a disabled Save button
   * is merely consistent with it. It also distinguishes success from the failure dialog
   * (#gradeWeightingErrorModal, "Your changes could not be saved"), which is reported rather
   * than being left to look like a timeout.
   *
   * Closed via the X (gradeW-13), NOT "Back to class data" (gradeW-12) - the latter navigates
   * away from the page the next TC needs.
   */
  click_saveChanges: async function () {
    var res = { pageStatus: false, savedDialogShown: false };
    await logger.logInto(await stackTrace.get());
    res.enabledBefore = (await action.getAttribute(this.saveBtn, "disabled")) === null;
    if (!res.enabledBefore) {
      // Nothing to save means the caller's earlier edit never registered - fail loudly
      // rather than silently "succeeding" (Invariant 13).
      await logger.logInto(await stackTrace.get(), "Save was already disabled - nothing to save", "error");
      return res;
    }
    res.clicked = await action.click(this.saveBtn);
    if (true != res.clicked) return res;

    res.savedDialogShown = (await action.waitForDisplayed(this.savedModal, SAVE_TIMEOUT)) === true;
    if (!res.savedDialogShown) {
      // Did the product say it FAILED? That is a real finding, not a timeout (Invariant 14).
      if ((await action.isDisplayed(this.saveErrorModal)) === true) {
        res.saveError = await readText(this.saveErrorModal);
        await logger.logInto(await stackTrace.get(), "save failed: " + res.saveError, "error");
      } else {
        await logger.logInto(
          await stackTrace.get(),
          "no save confirmation within " + SAVE_TIMEOUT + "ms - see trap 11",
          "error"
        );
      }
      return res;
    }

    res.savedCopy = await readText(this.savedModal);
    res.closed = await action.click(this.savedModalClose);
    if (true != res.closed) return res;
    // MUST actually close, or everything after this is blocked by an invisible overlay.
    res.pageStatus = (await action.waitForDisplayed(this.savedModal, SETTLE_TIMEOUT, true)) === true;
    if (!res.pageStatus) {
      await logger.logInto(await stackTrace.get(), "the 'Changes saved' dialog would not close", "error");
    }
    return res;
  },

  // ---------------------------------------------------------------- grading scale (TC_2)

  /** Opens the Change grading scale modal and waits for it to be VISIBLE (not merely present). */
  click_changeScale: async function () {
    var res = { pageStatus: false };
    await logger.logInto(await stackTrace.get());
    res.clicked = await action.click(this.changeScaleBtn);
    if (true != res.clicked) return res;
    res.pageStatus = await action.waitForDisplayed(this.scaleModal, SETTLE_TIMEOUT);
    return res;
  },

  /** The modal's contents: every offered scale, which one is currently applied, Apply state. */
  getData_scaleModal: async function () {
    await logger.logInto(await stackTrace.get());
    var count = await readCount(this.scaleModalRow);
    var labels = [];
    var labelCount = await readCount(this.scaleModalLabel);
    for (var i = 0; i < labelCount; i++) labels.push(await readKthText(this.scaleModalLabel, i));
    return {
      shown: await action.isDisplayed(this.scaleModal),
      rowCount: count,
      scaleLabels: labels,
      activeScale: count > 0 ? await readText(this.scaleModalActiveRow) : "",
      applyDisabled: await isDisabledLink(this.scaleModalApply),
      manageLinkDisplayed: await action.isDisplayed(this.scaleModalManageLink)
    };
  },

  /**
   * The FULL rendered row for one scale in the modal - name, target score and every band.
   *
   * This is the evidence for TC_2's "we did not damage someone else's scale" check: the row
   * text is the scale's whole definition as the product renders it, so comparing it before
   * and after applying catches any change to the scale itself, not merely its name.
   * Returns "" when the scale is not offered.
   */
  getData_scaleRowText: async function (name) {
    await logger.logInto(await stackTrace.get(), "scale:" + name);
    var index = await findScaleRowIndex(name);
    if (index < 0) return "";
    return await readKthText(this.scaleModalRow, index);
  },

  /**
   * Selects a scale BY NAME (trap 8 - the radio qids are positional over a shared list).
   * Clicks the radio itself rather than setting .checked, because an Angular form ignores a
   * programmatic value (Invariant 6).
   */
  select_scale: async function (name) {
    var res = { pageStatus: false, name: name };
    await logger.logInto(await stackTrace.get(), "scale:" + name);
    res.index = await findScaleRowIndex(name);
    if (res.index < 0) {
      await logger.logInto(await stackTrace.get(), "scale not offered: " + name, "error");
      return res;
    }
    var radio = this.scaleModalRadioByIndex.replace("{{n}}", String(res.index));
    res.clicked = await action.click(radio);
    if (true != res.clicked) return res;
    res.selected = await action.isSelected(radio);
    res.pageStatus = res.selected === true;
    return res;
  },

  /** Applies the chosen scale and waits for the modal to go away. */
  click_applyScale: async function () {
    var res = { pageStatus: false };
    await logger.logInto(await stackTrace.get());
    res.applyDisabledBefore = await isDisabledLink(this.scaleModalApply);
    res.clicked = await action.click(this.scaleModalApply);
    if (true != res.clicked) return res;
    // reverse=true -> wait for it to STOP being displayed.
    res.pageStatus = await action.waitForDisplayed(this.scaleModal, SETTLE_TIMEOUT, true);
    return res;
  },

  /** Closes the modal via its X. Verified to close first time on this page (unlike the filter modal). */
  click_closeScaleModal: async function () {
    var res = { pageStatus: false };
    await logger.logInto(await stackTrace.get());
    res.clicked = await action.click(this.scaleModalClose);
    if (true != res.clicked) return res;
    res.pageStatus = await action.waitForDisplayed(this.scaleModal, SETTLE_TIMEOUT, true);
    return res;
  },

  /** The scale currently shown on the page (outside the modal). */
  getData_appliedScale: async function () {
    await logger.logInto(await stackTrace.get());
    return {
      name: await readText(this.scaleName),
      description: await readText(this.scaleDescription)
    };
  },

  // ------------------------------------------------------------- grading category (TC_3)

  /** Adds an inline category row (trap 6 - not a modal) and waits for its picker to appear. */
  click_addCategory: async function () {
    var res = { pageStatus: false };
    await logger.logInto(await stackTrace.get());
    res.labelBefore = await readText(this.addCategoryLink);
    res.rowsBefore = await readCount(this.categoryWeightageInput);
    res.clicked = await action.click(this.addCategoryLink);
    if (true != res.clicked) return res;
    res.pageStatus = await action.waitForDisplayed(this.categoryPicker, SETTLE_TIMEOUT);
    res.rowsAfter = await readCount(this.categoryWeightageInput);
    res.labelAfter = await readText(this.addCategoryLink);
    return res;
  },

  /** Opens the "Create or choose a custom grading category" dropdown. */
  click_categoryPicker: async function () {
    var res = { pageStatus: false };
    await logger.logInto(await stackTrace.get());
    res.clicked = await action.click(this.categoryPicker);
    if (true != res.clicked) return res;
    res.pageStatus = await action.waitForDisplayed(this.categoryMenuOpen, SETTLE_TIMEOUT);
    return res;
  },

  /** Every category the dropdown currently offers, in DOM order. */
  getData_categoryOptions: async function () {
    await logger.logInto(await stackTrace.get());
    var count = await readCount(this.categoryOption);
    var names = [];
    for (var i = 0; i < count; i++) names.push(await readKthText(this.categoryOption, i));
    return { shown: await action.isDisplayed(this.categoryMenuOpen), count: count, names: names };
  },

  /** Selects a category BY EXACT NAME (trap 8 + near-duplicate names on this school). */
  select_category: async function (name) {
    var res = { pageStatus: false, name: name };
    await logger.logInto(await stackTrace.get(), "category:" + name);
    res.index = await findOptionIndex(this.categoryOption, name);
    if (res.index < 0) {
      await logger.logInto(await stackTrace.get(), "category not offered: " + name, "error");
      return res;
    }
    var opt = await action.getKthElement(this.categoryOption, res.index);
    res.clicked = await action.click(opt);
    res.pageStatus = res.clicked === true;
    return res;
  },

  /** Sets a category row's weightage. Blurs before returning (trap 1). */
  set_categoryWeightage: async function (rowIndex, value) {
    await logger.logInto(await stackTrace.get(), "row:" + rowIndex + " value:" + value);
    var sel = this.categoryWeightageByIndex.replace("{{n}}", String(rowIndex));
    return await setNumericField(sel, value);
  },

  /** Removes a category row (used to restore the form without a reload). */
  click_removeCategory: async function (rowIndex) {
    var res = { pageStatus: false };
    await logger.logInto(await stackTrace.get(), "row:" + rowIndex);
    var before = await readCount(this.categoryWeightageInput);
    res.clicked = await action.click(this.categoryRemoveByIndex.replace("{{n}}", String(rowIndex)));
    if (true != res.clicked) return res;
    res.rowsBefore = before;
    res.rowsAfter = await readCount(this.categoryWeightageInput);
    res.pageStatus = res.rowsAfter === before - 1;
    return res;
  },

  /** How many inline category rows currently exist. */
  getData_categoryRowCount: async function () {
    await logger.logInto(await stackTrace.get());
    return await readCount(this.categoryWeightageInput);
  },

  // ------------------------------------------------------------ score calculation (TC_4)

  /** Opens the Best/First score dropdown. */
  click_scoreCalcDropdown: async function () {
    var res = { pageStatus: false };
    await logger.logInto(await stackTrace.get());
    res.currentBefore = await readText(this.scoreCalcDropdown);
    res.clicked = await action.click(this.scoreCalcDropdown);
    if (true != res.clicked) return res;
    res.pageStatus = await action.waitForDisplayed(this.scoreCalcMenuOpen, SETTLE_TIMEOUT);
    return res;
  },

  /** The options the score-calculation dropdown offers. */
  getData_scoreCalcOptions: async function () {
    await logger.logInto(await stackTrace.get());
    var count = await readCount(this.scoreCalcOption);
    var names = [];
    for (var i = 0; i < count; i++) names.push(await readKthText(this.scoreCalcOption, i));
    return { shown: await action.isDisplayed(this.scoreCalcMenuOpen), count: count, names: names };
  },

  /** Picks a score type by name and waits for the toggle's own label to reflect it. */
  select_scoreCalc: async function (name) {
    var res = { pageStatus: false, name: name };
    await logger.logInto(await stackTrace.get(), "scoreType:" + name);
    res.index = await findOptionIndex(this.scoreCalcOption, name);
    if (res.index < 0) {
      await logger.logInto(await stackTrace.get(), "score type not offered: " + name, "error");
      return res;
    }
    var opt = await action.getKthElement(this.scoreCalcOption, res.index);
    res.clicked = await action.click(opt);
    if (true != res.clicked) return res;
    var deadline = Date.now() + SETTLE_TIMEOUT;
    while (Date.now() < deadline) {
      res.current = await readText(this.scoreCalcDropdown);
      if (res.current === name) {
        res.pageStatus = true;
        return res;
      }
      await browser.pause(200);
    }
    return res;
  },

  /** The currently displayed score type. */
  getData_scoreCalc: async function () {
    await logger.logInto(await stackTrace.get());
    return { current: await readText(this.scoreCalcDropdown) };
  },

  // -------------------------------------------------------------- score settings (TC_5)

  /** Reads the teacher score-override toggle. It is a real checkbox, so isSelected is truthful. */
  getData_override: async function () {
    await logger.logInto(await stackTrace.get());
    return {
      displayed: await action.isDisplayed(this.overrideToggle),
      checked: await action.isSelected(this.overrideToggle)
    };
  },

  /**
   * Flips the override toggle, completing the confirmation dialog the product raises.
   *
   * TRAP 9 (cost the entire first run, 2026-08-20): clicking the toggle opens
   * #warningForEnableTeacherOverrideScoreModal - "Are you sure? By turning on this setting
   * you are enabling the teacher to manually add and override scores..." with
   * "No, go back" / "Yes, enable". The FIRST build did not know about it, so the modal stayed
   * open and silently blocked every click for the rest of the suite (4 later TCs failed on
   * unrelated-looking symptoms while every READ kept working).
   *
   * Two things measured while the modal is open:
   *   - the toggle already reads CHECKED, and
   *   - Save is still DISABLED.
   * So the toggle alone is NOT the change - it commits only on "Yes, enable". Asserting on
   * the toggle before confirming would report success for a change that never happened.
   *
   * The dialog is treated as OPTIONAL: the copy is worded for turning the setting ON, so
   * turning it OFF may well not warn. That asymmetry is UNVERIFIED - deliberately, because
   * confirming it would have meant saving a changed setting onto a class this session did not
   * own. Probing for it is correct under both behaviours. `confirmShown` is returned so a
   * caller (and the run log) can see which path ran - this is not a swallowed failure, the
   * real assertion is that the checked state actually flipped.
   */
  click_overrideToggle: async function () {
    var res = { pageStatus: false, confirmShown: false };
    await logger.logInto(await stackTrace.get());
    res.before = await action.isSelected(this.overrideToggle);
    res.clicked = await action.click(this.overrideToggle);
    if (true != res.clicked) return res;

    // Short probe: the dialog renders immediately when it renders at all.
    res.confirmShown = (await action.waitForDisplayed(this.overrideModal, 3000)) === true;
    if (res.confirmShown) {
      res.confirmClicked = await action.click(this.overrideModalConfirm);
      if (true != res.confirmClicked) return res;
      // The modal MUST close, or everything after this is blocked by an invisible overlay.
      res.confirmClosed = await action.waitForDisplayed(this.overrideModal, SETTLE_TIMEOUT, true);
      if (true != res.confirmClosed) {
        await logger.logInto(await stackTrace.get(), "override confirmation did not close", "error");
        return res;
      }
    } else {
      await logger.logInto(
        await stackTrace.get(),
        "no override confirmation appeared - the off path, or the product changed"
      );
    }

    res.after = await action.isSelected(this.overrideToggle);
    res.pageStatus = res.after !== res.before;
    return res;
  },

  /**
   * Closes whichever known dialog is open, if any. A no-op when the page is clean.
   *
   * Exists for the suite-level cleanup: a TC that fails mid-dialog leaves an overlay that
   * blocks the cleanup itself, and cleanup that cannot run leaves REAL DATA on a shared
   * school (that is exactly what happened on the first run - a class and a stuck search had
   * to be removed by hand). Returns what it closed so the log shows it.
   */
  dismiss_openDialogs: async function () {
    var res = { closed: [] };
    await logger.logInto(await stackTrace.get());
    /*
     * Every dialog this page can raise, each with a NON-COMMITTING way out (an X, a "No, go
     * back", or a "Close"). Never a confirm button - cleanup must not accidentally apply a
     * change it was only trying to clear.
     *
     * The list is taken from the ELEVEN modals pre-rendered on this page, not from the ones
     * encountered so far: this page raises a dialog at essentially every state-changing
     * control, and discovering them one failed run at a time proved expensive.
     */
    var dialogs = [
      { name: "overrideConfirmation", modal: this.overrideModal, close: this.overrideModalCancel },
      { name: "changesSaved", modal: this.savedModal, close: this.savedModalClose },
      { name: "cancelWarning", modal: this.cancelWarningModal, close: this.cancelWarningGoBack },
      { name: "totalWeightageError", modal: this.totalWeightageErrorModal, close: this.totalWeightageErrorClose },
      { name: "removeCategory", modal: this.removeCategoryModal, close: this.removeCategoryCancel },
      { name: "maxCategories", modal: this.maxCategoriesModal, close: this.maxCategoriesClose },
      { name: "changeGradingScale", modal: this.scaleModal, close: this.scaleModalClose }
    ];
    for (var i = 0; i < dialogs.length; i++) {
      var d = dialogs[i];
      if ((await readCount(d.modal)) === 0) continue;
      if ((await action.isDisplayed(d.modal)) !== true) continue;
      await action.click(d.close);
      var gone = await action.waitForDisplayed(d.modal, SETTLE_TIMEOUT, true);
      res.closed.push(d.name + (gone === true ? "" : "(FAILED TO CLOSE)"));
      if (gone !== true) {
        await logger.logInto(await stackTrace.get(), d.name + " would not close", "error");
      }
    }
    return res;
  },

  // ------------------------------------------------------------ material weightage (TC_6)

  /** Reads a material weightage input by bundle/item index. */
  getData_materialWeightage: async function (bundleIndex, itemIndex) {
    await logger.logInto(await stackTrace.get());
    var sel = this.materialWeightageByIndex
      .replace("{{b}}", String(bundleIndex))
      .replace("{{i}}", String(itemIndex));
    return { value: await readValue(sel), count: await readCount(sel) };
  },

  /** Sets a material weightage. Blurs before returning (trap 1). */
  set_materialWeightage: async function (bundleIndex, itemIndex, value) {
    await logger.logInto(await stackTrace.get(), "b:" + bundleIndex + " i:" + itemIndex + " value:" + value);
    var sel = this.materialWeightageByIndex
      .replace("{{b}}", String(bundleIndex))
      .replace("{{i}}", String(itemIndex));
    return await setNumericField(sel, value);
  }
};

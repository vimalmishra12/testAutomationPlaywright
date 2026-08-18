"use strict";
var action = require("../../core/actionLibrary/baseActionLibrary.js");
// Selectors resolved at load time from C1Selectors.json → css.ComproC1.createClasses
var selectorFile = jsonParserUtil.jsonParser(selectorDir);

module.exports = {
  // Resolves to C1Selectors.json → css.ComproC1.createClasses.*
  classNameInput: selectorFile.css.ComproC1.createClasses.classNameInput,
  startDateInput: selectorFile.css.ComproC1.createClasses.startDateInput,
  startDateTodayCell: selectorFile.css.ComproC1.createClasses.startDateTodayCell,
  endDateInput: selectorFile.css.ComproC1.createClasses.endDateInput,
  endDateNextMonthBtn: selectorFile.css.ComproC1.createClasses.endDateNextMonthBtn,
  endDateDay15Cell: selectorFile.css.ComproC1.createClasses.endDateDay15Cell,
  endDateDisabledCell: selectorFile.css.ComproC1.createClasses.endDateDisabledCell,
  createClassBtn: selectorFile.css.ComproC1.createClasses.createClassBtn,
  successDialogTitle: selectorFile.css.ComproC1.createClasses.successDialogTitle,
  addMaterialBtn: selectorFile.css.ComproC1.createClasses.addMaterialBtn,
  materialSearchInput: selectorFile.css.ComproC1.createClasses.materialSearchInput,
  materialItem: selectorFile.css.ComproC1.createClasses.materialItem,
  addMaterialsConfirmBtn: selectorFile.css.ComproC1.createClasses.addMaterialsConfirmBtn,
  selectedMaterialInput: selectorFile.css.ComproC1.createClasses.selectedMaterialInput,
  backToDashboardLink: selectorFile.css.ComproC1.createClasses.backToDashboardLink,
  createMoreClassesLink: selectorFile.css.ComproC1.createClasses.createMoreClassesLink,
  // Row 2 of the bulk form (a new empty row auto-appends once row 1 is filled).
  // Same dBulkClass-<row>-<col> qid pattern as row 1 (row index 0 → 1).
  classNameInputRow2: selectorFile.css.ComproC1.createClasses.classNameInputRow2,
  startDateInputRow2: selectorFile.css.ComproC1.createClasses.startDateInputRow2,
  endDateInputRow2: selectorFile.css.ComproC1.createClasses.endDateInputRow2,
  // Form-level components (BCCF_TC_1) + bulk toolbar / row-1 add-teacher / add-label
  // (BCCF_TC_3, TC_5, TC_9) — live-captured via Playwright MCP. Selectors are
  // school-agnostic; only the test DATA (label name, copy-source class) is per-school.
  uploadFileBtn: selectorFile.css.ComproC1.createClasses.uploadFileBtn,
  csvFileInput: selectorFile.css.ComproC1.createClasses.csvFileInput,
  getCsvTemplateLink: selectorFile.css.ComproC1.createClasses.getCsvTemplateLink,
  howToUseFormBtn: selectorFile.css.ComproC1.createClasses.howToUseFormBtn,
  selectAllCheckbox: selectorFile.css.ComproC1.createClasses.selectAllCheckbox,
  // Row select checkbox. Matched by NAME PREFIX, not by id: the ids are sequential
  // (`checkbox-1`, `checkbox-2`, …) and are re-issued as rows are added/removed, so
  // the first row's checkbox is NOT reliably `#checkbox-1`. Hardcoding the id was the
  // root cause of intermittent "row checkbox is not clicked" failures in TC_17/TC_18.
  rowCheckbox: selectorFile.css.ComproC1.createClasses.rowCheckbox,
  toolbarStartDateBtn: selectorFile.css.ComproC1.createClasses.toolbarStartDateBtn,
  toolbarEndDateBtn: selectorFile.css.ComproC1.createClasses.toolbarEndDateBtn,
  toolbarAddTeacherBtn: selectorFile.css.ComproC1.createClasses.toolbarAddTeacherBtn,
  toolbarAddLabelsBtn: selectorFile.css.ComproC1.createClasses.toolbarAddLabelsBtn,
  toolbarAddMaterialBtn: selectorFile.css.ComproC1.createClasses.toolbarAddMaterialBtn,
  toolbarCopyExistingClassBtn: selectorFile.css.ComproC1.createClasses.toolbarCopyExistingClassBtn,
  toolbarDuplicateBtn: selectorFile.css.ComproC1.createClasses.toolbarDuplicateBtn,
  toolbarShowStudentProgressBtn: selectorFile.css.ComproC1.createClasses.toolbarShowStudentProgressBtn,
  toolbarRemoveBtn: selectorFile.css.ComproC1.createClasses.toolbarRemoveBtn,
  bulkStartDateConfirmBtn: selectorFile.css.ComproC1.createClasses.bulkStartDateConfirmBtn,
  bulkEndDateConfirmBtn: selectorFile.css.ComproC1.createClasses.bulkEndDateConfirmBtn,
  addTeachersBtn: selectorFile.css.ComproC1.createClasses.addTeachersBtn,
  teacherEmailInput: selectorFile.css.ComproC1.createClasses.teacherEmailInput,
  teacherFirstNameInput: selectorFile.css.ComproC1.createClasses.teacherFirstNameInput,
  teacherLastNameInput: selectorFile.css.ComproC1.createClasses.teacherLastNameInput,
  teacherApplyChangesBtn: selectorFile.css.ComproC1.createClasses.teacherApplyChangesBtn,
  selectedTeacherInput: selectorFile.css.ComproC1.createClasses.selectedTeacherInput,
  addLabelBtn: selectorFile.css.ComproC1.createClasses.addLabelBtn,
  // The label dropdown is rendered PER ROW — `#class-label-list-modal-<rowIndex>`,
  // each holding a full copy of every label (~87). An unscoped
  // `input[placeholder='Create or find a label']` therefore matches one element per
  // row and can type into a hidden row's box, leaving row 1's list unfiltered — the
  // root cause of TC_16's "label was not selected" timeouts. Both selectors are
  // scoped to row 1's own container (`-0`), matching the row-0 qids used elsewhere.
  labelSearchInput: selectorFile.css.ComproC1.createClasses.labelSearchInput,
  classLabelItem: selectorFile.css.ComproC1.createClasses.classLabelItem,
  // Reset (select-all + Remove) and Duplicate — BCCF_TC_7, live-captured 2026-08-18.
  // "Copy an Existing Class" 2-step wizard — BCCF_TC_8, live-captured 2026-08-18.
  copyFromModalTitle: selectorFile.css.ComproC1.createClasses.copyFromModalTitle,
  copyFromSearchInput: selectorFile.css.ComproC1.createClasses.copyFromSearchInput,
  copyFromClassItem: selectorFile.css.ComproC1.createClasses.copyFromClassItem,
  copyFromContinueBtn: selectorFile.css.ComproC1.createClasses.copyFromContinueBtn,
  copyFromBackLink: selectorFile.css.ComproC1.createClasses.copyFromBackLink,
  copyTeachersCheckbox: selectorFile.css.ComproC1.createClasses.copyTeachersCheckbox,
  // The Bootstrap custom-control LABEL overlays the input and intercepts pointer
  // events, so these checkboxes must be clicked via their label, not the input.
  copyTeachersLabel: selectorFile.css.ComproC1.createClasses.copyTeachersLabel,
  copyMaterialsCheckbox: selectorFile.css.ComproC1.createClasses.copyMaterialsCheckbox,
  copyMaterialsLabel: selectorFile.css.ComproC1.createClasses.copyMaterialsLabel,
  copiedFromIndicator: selectorFile.css.ComproC1.createClasses.copiedFromIndicator,
  removeRowsDialogTitle: selectorFile.css.ComproC1.createClasses.removeRowsDialogTitle,
  removeRowsConfirmLink: selectorFile.css.ComproC1.createClasses.removeRowsConfirmLink,
  removeRowsCancelLink: selectorFile.css.ComproC1.createClasses.removeRowsCancelLink,
  duplicateLabelDialogTitle: selectorFile.css.ComproC1.createClasses.duplicateLabelDialogTitle,
  includeClassLabelsCheckbox: selectorFile.css.ComproC1.createClasses.includeClassLabelsCheckbox,
  duplicateContinueLink: selectorFile.css.ComproC1.createClasses.duplicateContinueLink,
  duplicateCancelLink: selectorFile.css.ComproC1.createClasses.duplicateCancelLink,
  selectedTeacherInputRow2: selectorFile.css.ComproC1.createClasses.selectedTeacherInputRow2,
  selectedMaterialInputRow2: selectorFile.css.ComproC1.createClasses.selectedMaterialInputRow2,

  /**
   * Confirms the "Create new classes" bulk form loaded.
   * Anchors on the first row's Class name input [qid="dBulkClass-0-2"].
   */
  isInitialized: async function () {
    var res;
    await logger.logInto(await stackTrace.get());
    await action.waitForDocumentLoad();
    res = {
      pageStatus: await action.waitForDisplayed(this.classNameInput)
    };
    return res;
  },

  /**
   * Types the class name into the first row.
   * Uses clearValue + addValue (pressSequentially) — the form is Angular-rendered and
   * fill()/setValue can be ignored on validated inputs (Invariant 6 / ADR-013).
   */
  set_className: async function (value) {
    var res;
    await logger.logInto(await stackTrace.get());
    await action.clearValue(this.classNameInput);
    res = await action.addValue(this.classNameInput, value);
    if (true == res) {
      await logger.logInto(await stackTrace.get(), "Value is entered in classNameInput");
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + "Value is NOT entered in classNameInput",
        "error"
      );
    }
    return res;
  },

  /**
   * Clears the first row's Class name input. Used to establish a deterministic
   * "incomplete row" precondition for the negative Create-disabled check (TST_CCLS_TC_9):
   * the form auto-saves/restores a draft, so it is NOT guaranteed empty on load — clearing
   * the name guarantees a missing required field regardless of any restored draft.
   */
  clear_className: async function () {
    var res;
    await logger.logInto(await stackTrace.get());
    res = await action.clearValue(this.classNameInput);
    if (true == res) {
      await logger.logInto(await stackTrace.get(), "classNameInput cleared");
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + "classNameInput is NOT cleared",
        "error"
      );
    }
    return res;
  },

  /**
   * Sets the Start date to TODAY. The date field is a readonly Owl date-picker, so we
   * open it (click the input) and click today's cell — the picker opens on the current
   * month with today marked as the active cell (td.owl-dt-calendar-cell-active).
   */
  set_startDate: async function () {
    var res;
    await logger.logInto(await stackTrace.get());
    await action.click(this.startDateInput); // opens the calendar
    await action.waitForDisplayed(this.startDateTodayCell);
    res = await action.click(this.startDateTodayCell); // today
    if (true == res) {
      await logger.logInto(await stackTrace.get(), "Start date set to today");
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + "Start date is NOT set",
        "error"
      );
    }
    return res;
  },

  /**
   * Sets the End date to the 15th of NEXT month. Chosen deliberately: day 15 always
   * exists, is always after a start date of today, and appears exactly once in a
   * month grid (so the text-based cell selector is unambiguous). We open the picker,
   * advance one month, then click the "15" cell.
   */
  set_endDate: async function () {
    var res;
    await logger.logInto(await stackTrace.get());
    await action.click(this.endDateInput); // opens the calendar
    await action.waitForDisplayed(this.endDateNextMonthBtn);
    await action.click(this.endDateNextMonthBtn); // advance to next month
    await action.waitForDisplayed(this.endDateDay15Cell);
    res = await action.click(this.endDateDay15Cell); // day 15 of next month
    if (true == res) {
      await logger.logInto(await stackTrace.get(), "End date set to day 15 of next month");
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + "End date is NOT set",
        "error"
      );
    }
    return res;
  },

  /**
   * Clicks "Create N class" and waits for the success dialog to appear.
   * The button is disabled until class name + both dates are valid, so this must be
   * called only after set_className/set_startDate/set_endDate.
   */
  click_createClass: async function () {
    var res;
    await logger.logInto(await stackTrace.get());
    res = await action.click(this.createClassBtn);
    if (true == res) {
      await logger.logInto(await stackTrace.get(), "createClassBtn is clicked");
      // Creation is async; the success dialog is the immediate confirmation.
      res = await action.waitForDisplayed(this.successDialogTitle);
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + "createClassBtn is NOT clicked",
        "error"
      );
    }
    return res;
  },

  /**
   * Reads the success dialog. Class creation is asynchronous ("can take up to 12 hours"),
   * so this dialog — not an updated class count — is the reliable pass condition.
   * Returns { shown: <bool>, title: <dialog heading text> }.
   */
  getData_successMessage: async function () {
    await logger.logInto(await stackTrace.get());
    var obj = {
      shown: await action.waitForDisplayed(this.successDialogTitle),
      title:
        (await action.getElementCount(this.successDialogTitle)) > 0
          ? await action.getText(this.successDialogTitle)
          : null
    };
    console.log("successMessage", obj);
    return obj;
  },

  // ── Add material (admin bulk-create form) ─────────────────────────────────────
  // NOTE: this is the ADMIN form's own material component (qids dBulkClass-*), NOT the
  // teacher wizard's material modal (createNewClass.page.js, qids material-modal-*/t-cc-cm-*).
  // The two screens differ, so the teacher material TCs cannot be reused here.

  /**
   * Opens the row's "Add Materials" modal and waits for the material search box.
   */
  click_addMaterialBtn: async function () {
    var res;
    await logger.logInto(await stackTrace.get());
    res = await action.click(this.addMaterialBtn);
    if (true == res) {
      await logger.logInto(await stackTrace.get(), "addMaterialBtn is clicked");
      res = await action.waitForDisplayed(this.materialSearchInput);
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + "addMaterialBtn is NOT clicked",
        "error"
      );
    }
    return res;
  },

  /**
   * Searches for a material by name and selects it from the results dropdown.
   * Types the name (addValue → pressSequentially, so Angular's filter fires) then clicks
   * the matching `.dropdown-item` via a text-filtered locator built in the action library
   * (getFilteredLocator — keeps the runtime-value match out of the page object). Selecting
   * an item enables the "Add materials" confirm button.
   */
  select_material: async function (materialName) {
    var res;
    await logger.logInto(await stackTrace.get(), "material: " + materialName);
    await action.addValue(this.materialSearchInput, materialName);
    // Locator filtered by the material name — the concrete match is a runtime value.
    var itemLocator = action.getFilteredLocator(this.materialItem, materialName);
    await action.waitForDisplayed(itemLocator);
    res = await action.click(itemLocator);
    if (true == res) {
      await logger.logInto(await stackTrace.get(), materialName + " is selected");
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + " " + materialName + " is NOT selected",
        "error"
      );
    }
    return res;
  },

  /**
   * Clicks "Add materials" to attach the selected material to the row, then confirms the
   * material chip rendered on the row. Returns { added: <bool>, material: <chip value> }.
   */
  click_addMaterialsConfirm: async function () {
    await logger.logInto(await stackTrace.get());
    var obj = { added: false, material: null };
    var res = await action.click(this.addMaterialsConfirmBtn);
    if (true == res) {
      await logger.logInto(await stackTrace.get(), "addMaterialsConfirmBtn is clicked");
      // Modal closes and the chosen material renders in the row's material input.
      obj.added = await action.waitForDisplayed(this.selectedMaterialInput);
      obj.material = await action.getValue(this.selectedMaterialInput);
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + "addMaterialsConfirmBtn is NOT clicked",
        "error"
      );
    }
    console.log("addMaterial", obj);
    return obj;
  },

  // ── Form validation getters (bulk-create form; no class is created) ───────────
  // Read-only checks backing the Edge/Negative scenario-#3 TCs. They never click
  // "Create N class", so they seed no data and can run on a fresh, empty form.

  /**
   * Reads the class-name input's maxlength attribute as an integer.
   * Returns { max: <int|null>, raw: <attribute string> }.
   */
  getData_classNameMaxLength: async function () {
    await logger.logInto(await stackTrace.get());
    var raw = await action.getAttribute(this.classNameInput, "maxlength");
    var obj = { raw: raw, max: null };
    if (typeof raw === "string" && /^\d+$/.test(raw)) {
      obj.max = parseInt(raw, 10);
    }
    console.log("classNameMaxLength", obj);
    return obj;
  },

  /**
   * Whether the "Create N class" button is currently enabled. The button is gated
   * on a row having class name + start + end date, so this backs the negative TCs
   * (empty row / invalid name ⇒ expected false). Coerced to a strict boolean so an
   * Error from the action layer never reads as truthy (Invariant 4).
   */
  getData_createBtnEnabled: async function () {
    await logger.logInto(await stackTrace.get());
    var res = await action.isEnabled(this.createClassBtn);
    var enabled = res === true;
    console.log("createBtnEnabled", enabled);
    return enabled;
  },

  /**
   * Opens the End-date picker and counts the disabled day cells in the shown month.
   * With a start date of today, days on/before the start are disabled
   * (owl-dt-calendar-cell-disabled), so a count > 0 confirms an end date earlier
   * than the start cannot be chosen. Call AFTER set_startDate. Returns an int count.
   */
  getData_endDatePickerDisabledCount: async function () {
    await logger.logInto(await stackTrace.get());
    await action.click(this.endDateInput); // opens the calendar
    await action.waitForDisplayed(this.endDateNextMonthBtn); // picker is open
    var count = await action.getElementCount(this.endDateDisabledCell);
    console.log("endDatePickerDisabledCount", count);
    return count;
  },

  // ── Bulk (multi-row) creation — BCCF_TC_6 ────────────────────────────────────
  // A new empty row auto-appends once the previous row is filled, so row 2 exists
  // only after row 1 has a name/date. These mirror the row-1 methods against the
  // row-2 qids; the date-picker OVERLAY selectors are shared (one picker at a time).

  /**
   * Types the class name into row 2. clearValue + addValue for the same
   * Angular-validated-input reason as row 1 (Invariant 6 / ADR-013).
   */
  set_className_row2: async function (value) {
    var res;
    await logger.logInto(await stackTrace.get());
    await action.clearValue(this.classNameInputRow2);
    res = await action.addValue(this.classNameInputRow2, value);
    if (true == res) {
      await logger.logInto(await stackTrace.get(), "Value is entered in classNameInputRow2");
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + "Value is NOT entered in classNameInputRow2",
        "error"
      );
    }
    return res;
  },

  /**
   * Sets row 2's Start date to TODAY (opens the picker, clicks the active cell).
   */
  set_startDate_row2: async function () {
    var res;
    await logger.logInto(await stackTrace.get());
    await action.click(this.startDateInputRow2); // opens the calendar
    await action.waitForDisplayed(this.startDateTodayCell);
    res = await action.click(this.startDateTodayCell);
    if (true == res) {
      await logger.logInto(await stackTrace.get(), "Row 2 start date set to today");
    } else {
      await logger.logInto(await stackTrace.get(), res + "Row 2 start date is NOT set", "error");
    }
    return res;
  },

  /**
   * Sets row 2's End date to the 15th of NEXT month — same rationale as row 1
   * (day 15 always exists, is always after today, and is unique in the grid).
   */
  set_endDate_row2: async function () {
    var res;
    await logger.logInto(await stackTrace.get());
    await action.click(this.endDateInputRow2); // opens the calendar
    await action.waitForDisplayed(this.endDateNextMonthBtn);
    await action.click(this.endDateNextMonthBtn); // advance to next month
    await action.waitForDisplayed(this.endDateDay15Cell);
    res = await action.click(this.endDateDay15Cell);
    if (true == res) {
      await logger.logInto(await stackTrace.get(), "Row 2 end date set to day 15 of next month");
    } else {
      await logger.logInto(await stackTrace.get(), res + "Row 2 end date is NOT set", "error");
    }
    return res;
  },

  /**
   * Reads the Create button's label and the class count embedded in it
   * ("Create 2 classes" → 2). The count is parsed from the label rather than
   * assumed, because the form can restore an auto-saved draft (so the absolute
   * starting count is not fixed) — callers assert the DELTA after filling a row.
   * Returns { raw: <label text>, count: <int|null> }.
   */
  getData_createBtnLabel: async function () {
    await logger.logInto(await stackTrace.get());
    var raw = await action.getText(this.createClassBtn);
    var obj = { raw: raw, count: null };
    var m = typeof raw === "string" ? raw.match(/\d+/) : null;
    if (m) {
      obj.count = parseInt(m[0], 10);
    }
    console.log("createBtnLabel", obj);
    return obj;
  },

  // ── Form-load component check — BCCF_TC_1 ─────────────────────────────────────

  /**
   * Reads presence of every top-level "Create new classes" form component: CSV
   * actions, the "How to use this form" info, the full bulk-action toolbar (9
   * actions), the first row's core fields, and whether "Create N class" is
   * disabled. Read-only — creates no class. Callers should clear the row's name
   * first (clear_className) so the disabled check is not defeated by a restored
   * draft (see TST_CCLS_TC_9's fix). Returns an object of booleans.
   */
  getData_formComponentsPresent: async function () {
    await logger.logInto(await stackTrace.get());
    var obj = {
      uploadFileBtn: (await action.getElementCount(this.uploadFileBtn)) > 0,
      getCsvTemplateLink: (await action.getElementCount(this.getCsvTemplateLink)) > 0,
      howToUseFormBtn: (await action.getElementCount(this.howToUseFormBtn)) > 0,
      toolbarStartDateBtn: (await action.getElementCount(this.toolbarStartDateBtn)) > 0,
      toolbarEndDateBtn: (await action.getElementCount(this.toolbarEndDateBtn)) > 0,
      toolbarAddTeacherBtn: (await action.getElementCount(this.toolbarAddTeacherBtn)) > 0,
      toolbarAddLabelsBtn: (await action.getElementCount(this.toolbarAddLabelsBtn)) > 0,
      toolbarAddMaterialBtn: (await action.getElementCount(this.toolbarAddMaterialBtn)) > 0,
      toolbarCopyExistingClassBtn: (await action.getElementCount(this.toolbarCopyExistingClassBtn)) > 0,
      toolbarDuplicateBtn: (await action.getElementCount(this.toolbarDuplicateBtn)) > 0,
      toolbarShowStudentProgressBtn: (await action.getElementCount(this.toolbarShowStudentProgressBtn)) > 0,
      toolbarRemoveBtn: (await action.getElementCount(this.toolbarRemoveBtn)) > 0,
      rowClassNameInput: (await action.getElementCount(this.classNameInput)) > 0,
      rowStartDateInput: (await action.getElementCount(this.startDateInput)) > 0,
      rowEndDateInput: (await action.getElementCount(this.endDateInput)) > 0,
      rowAddTeachersBtn: (await action.getElementCount(this.addTeachersBtn)) > 0,
      rowAddMaterialBtn: (await action.getElementCount(this.addMaterialBtn)) > 0,
      rowAddLabelBtn: (await action.getElementCount(this.addLabelBtn)) > 0,
      createBtnDisabled: (await action.isEnabled(this.createClassBtn)) !== true
    };
    console.log("formComponentsPresent", obj);
    return obj;
  },

  // ── Add teacher to a row — BCCF_TC_3 ───────────────────────────────────────────

  /**
   * Opens row 1's "Edit teachers" modal and waits for the Email field.
   */
  click_addTeachersBtn: async function () {
    var res;
    await logger.logInto(await stackTrace.get());
    res = await action.click(this.addTeachersBtn);
    if (true == res) {
      await logger.logInto(await stackTrace.get(), "addTeachersBtn is clicked");
      res = await action.waitForDisplayed(this.teacherEmailInput);
    } else {
      await logger.logInto(await stackTrace.get(), res + "addTeachersBtn is NOT clicked", "error");
    }
    return res;
  },

  /**
   * Types the teacher's email into the "Edit teachers" modal. First/Last name are
   * optional (manual doc) so are not set here. clearValue + addValue for the same
   * Angular-validated-input reason as the class-name field (Invariant 6).
   * Confirmed live: this field can silently DROP the last keystroke of
   * pressSequentially (observed "...mailsac.co" instead of "...mailsac.com") —
   * this modal's own async validation re-renders mid-type. Verifies the typed
   * value against the intended one and retries (clear + retype) up to 3 times
   * rather than trust a single addValue call.
   */
  set_teacherEmail: async function (value) {
    var res, actual;
    await logger.logInto(await stackTrace.get());
    var attempts = 3;
    for (var i = 0; i < attempts; i++) {
      await action.clearValue(this.teacherEmailInput);
      res = await action.addValue(this.teacherEmailInput, value);
      actual = await action.getValue(this.teacherEmailInput);
      if (true == res && actual === value) {
        await logger.logInto(await stackTrace.get(), "Value is entered in teacherEmailInput");
        return true;
      }
    }
    await logger.logInto(
      await stackTrace.get(),
      "teacherEmailInput value mismatch after " + attempts + " attempts (expected: " +
        value + ", got: " + actual + ")",
      "error"
    );
    return false;
  },

  /**
   * Clicks "Apply changes" and confirms the teacher rendered on the row (the row's
   * "Add teachers" button holds a readonly input, same shape as selectedMaterialInput).
   * "Apply changes" is never natively disabled (no `disabled` attribute — confirmed
   * live), so the click itself always "succeeds"; the app takes several seconds to
   * validate + apply. A SINGLE click is used deliberately (re-clicking risks
   * double-applying the teacher if the first click is still processing) with a
   * generous single wait for the observable result, per Invariant 1.
   * Returns { added: <bool>, email: <applied value> }.
   */
  click_teacherApplyChanges: async function () {
    await logger.logInto(await stackTrace.get());
    var obj = { added: false, email: null };
    var res = await action.click(this.teacherApplyChangesBtn);
    if (true == res) {
      obj.added = await action.waitForDisplayed(this.selectedTeacherInput, 15000);
      if (obj.added) {
        await logger.logInto(await stackTrace.get(), "teacherApplyChangesBtn applied the teacher");
        obj.email = await action.getValue(this.selectedTeacherInput);
      } else {
        await logger.logInto(
          await stackTrace.get(),
          "teacherApplyChangesBtn did not apply the teacher within 15s",
          "error"
        );
      }
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + "teacherApplyChangesBtn is NOT clicked",
        "error"
      );
    }
    console.log("teacherApplyChanges", obj);
    return obj;
  },

  // ── Add label to a row — BCCF_TC_5 ─────────────────────────────────────────────

  /**
   * Opens row 1's "Add class label" dropdown and waits for the label search input.
   */
  click_addLabelBtn: async function () {
    var res;
    await logger.logInto(await stackTrace.get());
    res = await action.click(this.addLabelBtn);
    if (true == res) {
      await logger.logInto(await stackTrace.get(), "addLabelBtn is clicked");
      res = await action.waitForDisplayed(this.labelSearchInput);
    } else {
      await logger.logInto(await stackTrace.get(), res + "addLabelBtn is NOT clicked", "error");
    }
    return res;
  },

  /**
   * Selects an existing label from the dropdown by name. Types the name into the
   * "Create or find a label" search box FIRST to narrow the (large, ~80-item)
   * dropdown down to matching entries — this list is known to render at least one
   * HIDDEN duplicate item per label (confirmed live: a `hidden=""` `<a
   * class="dropdown-item">` sharing the same text as the real one), so filtering
   * the visible list via search is more reliable than matching by text alone
   * against the full unfiltered list (unlike select_material's smaller list).
   * Locator still uses getFilteredLocator + classLabelItem's `:visible` selector
   * as the final disambiguator.
   */
  select_classLabel: async function (labelName) {
    var res;
    await logger.logInto(await stackTrace.get(), "label: " + labelName);
    await action.addValue(this.labelSearchInput, labelName);
    var itemLocator = action.getFilteredLocator(this.classLabelItem, labelName);
    await action.waitForDisplayed(itemLocator);
    res = await action.click(itemLocator);
    if (true == res) {
      await logger.logInto(await stackTrace.get(), labelName + " is selected");
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + " " + labelName + " is NOT selected",
        "error"
      );
    }
    return res;
  },

  /**
   * Reads the row's "Add class label" button text after selection (the applied
   * label renders inline on the button itself, unlike teacher/material which use a
   * separate readonly input). Returns { raw: <button text> }.
   */
  getData_appliedLabel: async function () {
    await logger.logInto(await stackTrace.get());
    var raw = await action.getText(this.addLabelBtn);
    var obj = { raw: raw };
    console.log("appliedLabel", obj);
    return obj;
  },

  // ── Bulk toolbar: set start/end date for selected rows — BCCF_TC_9 ─────────────

  /**
   * Ticks row 1's select checkbox, activating the bulk-action toolbar. A single
   * click with a generous wait for the checked state (action.isSelected) rather
   * than a blind assertion — same "single click, longer wait" reasoning as
   * click_teacherApplyChanges (re-clicking a checkbox that DID register would
   * toggle it back off).
   */
  click_rowCheckbox: async function () {
    await logger.logInto(await stackTrace.get());
    var res = await action.click(this.rowCheckbox);
    var checked = false;
    if (true == res) {
      try {
        await browser.waitUntil(
          async () => (await action.isSelected(this.rowCheckbox)) === true,
          { timeout: 10000, timeoutMsg: "rowCheckbox did not become checked" }
        );
        checked = true;
      } catch (e) {
        checked = false;
      }
    }
    if (checked) {
      await logger.logInto(await stackTrace.get(), "rowCheckbox is checked");
    } else {
      await logger.logInto(await stackTrace.get(), "rowCheckbox did not become checked", "error");
    }
    return checked;
  },

  /**
   * Bulk-sets the START date for all selected rows via the toolbar: opens the
   * "Change start date" modal, picks TODAY (td.owl-dt-calendar-cell-active — the
   * same picker control as the row-level set_startDate), and confirms. Requires at
   * least one row selected first (click_rowCheckbox). A single click on the
   * toolbar button with a generous wait for the modal to open — same "single
   * click, longer wait" reasoning as click_teacherApplyChanges.
   */
  click_toolbarStartDate: async function () {
    await logger.logInto(await stackTrace.get());
    await action.click(this.toolbarStartDateBtn);
    var opened = await action.waitForDisplayed(this.startDateTodayCell, 10000);
    if (opened !== true) {
      await logger.logInto(await stackTrace.get(), "Change start date modal never opened", "error");
      return false;
    }
    await action.click(this.startDateTodayCell); // today
    var res = await action.click(this.bulkStartDateConfirmBtn);
    if (true == res) {
      await logger.logInto(await stackTrace.get(), "Bulk start date set to today");
    } else {
      await logger.logInto(await stackTrace.get(), res + "Bulk start date is NOT set", "error");
    }
    return res;
  },

  /**
   * Bulk-sets the END date for all selected rows via the toolbar: opens the
   * "Change end date" modal, advances to next month, picks day 15 (same rationale
   * as the row-level set_endDate — always exists, always after today, unique in
   * the grid), and confirms. Same "single click, longer wait" reasoning as
   * click_toolbarStartDate.
   */
  click_toolbarEndDate: async function () {
    await logger.logInto(await stackTrace.get());
    await action.click(this.toolbarEndDateBtn);
    var opened = await action.waitForDisplayed(this.endDateNextMonthBtn, 10000);
    if (opened !== true) {
      await logger.logInto(await stackTrace.get(), "Change end date modal never opened", "error");
      return false;
    }
    await action.click(this.endDateNextMonthBtn); // advance to next month
    await action.waitForDisplayed(this.endDateDay15Cell);
    await action.click(this.endDateDay15Cell); // day 15 of next month
    var res = await action.click(this.bulkEndDateConfirmBtn);
    if (true == res) {
      await logger.logInto(await stackTrace.get(), "Bulk end date set to day 15 of next month");
    } else {
      await logger.logInto(await stackTrace.get(), res + "Bulk end date is NOT set", "error");
    }
    return res;
  },

  /**
   * Reads row 1's current start/end date field values, to confirm a bulk toolbar
   * action actually applied to the row. Returns { start: <string>, end: <string> }.
   */
  getData_rowDates: async function () {
    await logger.logInto(await stackTrace.get());
    var obj = {
      start: await action.getValue(this.startDateInput),
      end: await action.getValue(this.endDateInput)
    };
    console.log("rowDates", obj);
    return obj;
  },

  // ── Get CSV template (download) — BCCF_TC_10 ─────────────────────────────────

  /**
   * Clicks "Get CSV template" and saves the downloaded file, then reads back its
   * header row so the caller can assert the exact template columns.
   * Uses `action.downloadFile` (added to the action library for this case — the
   * library had no download handling).
   *
   * The template is UTF-8 with a BOM, so the BOM is stripped before splitting the
   * header, otherwise the first column would read "﻿Class name".
   * Returns { downloaded, fileName, headers: <string[]>, rowCount }.
   */
  getData_csvTemplate: async function (saveDir) {
    await logger.logInto(await stackTrace.get());
    var obj = { downloaded: false, fileName: null, headers: [], rowCount: 0 };
    var res = await action.downloadFile(this.getCsvTemplateLink, saveDir);
    if (!res || res.downloaded !== true) {
      await logger.logInto(await stackTrace.get(), "CSV template did not download", "error");
      return obj;
    }
    obj.downloaded = true;
    obj.fileName = res.fileName;
    var fs = require("fs");
    var text = fs.readFileSync(res.filePath, "utf8").replace(/^﻿/, "");
    var lines = text.split(/\r?\n/).filter(function (l) { return l.trim().length > 0; });
    obj.rowCount = lines.length;
    obj.headers = lines.length ? lines[0].split(",").map(function (h) { return h.trim(); }) : [];
    console.log("csvTemplate", { fileName: obj.fileName, rowCount: obj.rowCount, headerCount: obj.headers.length });
    return obj;
  },

  // ── Bulk CSV upload — BCCF_TC_11 ──────────────────────────────────────────────

  /**
   * Uploads a bulk-classes CSV. Verified live: the upload POPULATES THE FORM's rows
   * — it does NOT create any class. Creation still requires clicking "Create N
   * classes", so a caller that stops here creates nothing.
   *
   * The file input is hidden (`class="d-none"`, `accept=".csv"`); Playwright's
   * setInputFiles sets files directly on it and fires the native change event, so
   * there is no need to click "Upload file" first (same pattern as
   * createAdultStudentAccounts.upload_csvFile).
   *
   * Template format (from "Get CSV template", captured 2026-08-18): 14 columns —
   * `Class name, Start date DD/MM/YYYY, End date DD/MM/YYYY, Teacher 1..10
   * (optional), Student progress data`. Dates MUST be DD/MM/YYYY; the form then
   * displays them as e.g. "Tue, Sep 15, 2026".
   *
   * Returns true once the first row is populated, else false.
   */
  upload_csvFile: async function (csvFilePath) {
    await logger.logInto(await stackTrace.get(), "uploading: " + csvFilePath);
    var res = await action.setInputFiles(this.csvFileInput, csvFilePath);
    if (true != res) {
      await logger.logInto(await stackTrace.get(), "setInputFiles failed for: " + csvFilePath, "error");
      return false;
    }
    // Parsing/populating is async — settled once row 1 carries a class name.
    try {
      await browser.waitUntil(
        async () => {
          var v = await action.getValue(this.classNameInput);
          return typeof v === "string" && v.length > 0;
        },
        { timeout: 20000, timeoutMsg: "CSV upload did not populate the first row" }
      );
    } catch (e) {
      await logger.logInto(await stackTrace.get(), "CSV upload did not populate the form", "error");
      return false;
    }
    await logger.logInto(await stackTrace.get(), "CSV uploaded and form populated");
    return true;
  },

  // ── "Copy an Existing Class" 2-step wizard — BCCF_TC_8 ────────────────────────
  // Step 1: search + pick a source class → Continue.
  // Step 2: tick WHAT to copy (Teachers / Course materials / Assignments / Locked
  //         content rules / Class grade settings) → Continue, which applies to every
  //         selected row and closes the modal.
  // NOTE: both steps share the SAME Continue selector, so each step transition is
  // waited on explicitly rather than assumed.
  // NOTE: an option is only enabled when the SOURCE class actually has items of that
  // kind (the label shows a count, e.g. "Teachers [1]" vs a disabled "Assignments [0]").

  /**
   * Opens the "Copy an Existing Class" modal from the bulk toolbar and waits for the
   * class search box. Requires at least one row selected (click_rowCheckbox).
   */
  click_toolbarCopyExistingClass: async function () {
    var res;
    await logger.logInto(await stackTrace.get());
    res = await action.click(this.toolbarCopyExistingClassBtn);
    if (true != res) {
      await logger.logInto(await stackTrace.get(), res + "copyExistingClass is NOT clicked", "error");
      return res;
    }
    res = await action.waitForDisplayed(this.copyFromSearchInput, 10000);
    if (res !== true) return res;
    // The input being VISIBLE is not the same as the component being READY: Angular
    // still has to bind the keystroke handler that fires the class search. Typing into
    // that gap puts the text in the box while nothing is listening, so no search runs —
    // diagnosed live as a correct searchBoxValue alongside an unfiltered 20-row list.
    // The default result list rendering is the readiness signal: once rows exist, the
    // component has run a query and its handler is bound. Bounded wait — if the list
    // stays empty we proceed anyway and let the caller's search retry cover it.
    try {
      await browser.waitUntil(
        async () => (await action.getElementCount(this.copyFromClassItem)) > 0,
        { timeout: 10000, timeoutMsg: "copy-from result list did not render" }
      );
    } catch (e) {
      await logger.logInto(
        await stackTrace.get(),
        "copy-from result list did not render within 10s — continuing; the search retry will cover it",
        "error"
      );
    }
    return true;
  },

  /**
   * Step 1 — searches for the source class by name, picks the matching result, then
   * clicks Continue to reach the "what to copy" step. Results render as
   * `[Class name] [class key]`, so the match is a text filter on the class name
   * (the key is per-class and not known up front).
   * Waits for the Teachers option to confirm step 2 actually rendered.
   */
  select_copySourceClass: async function (className) {
    await logger.logInto(await stackTrace.get(), "source class: " + className);
    // Retry the WHOLE SEARCH, not just the typing. Diagnosed live: the search box can
    // hold exactly the right text while the results list still shows the default ~20
    // classes — i.e. the search request intermittently never fires, so the filtered
    // item never appears no matter how long we wait. Re-typing re-triggers it.
    // (An earlier theory that a keystroke was being dropped was DISPROVEN: the
    // diagnostic showed searchBoxValue exactly equal to the class name.)
    var itemLocator = action.getFilteredLocator(this.copyFromClassItem, className);
    var found = false;
    for (var attempt = 0; attempt < 3 && !found; attempt++) {
      await action.clearValue(this.copyFromSearchInput);
      await action.addValue(this.copyFromSearchInput, className);
      var actual = await action.getValue(this.copyFromSearchInput);
      if (actual !== className) {
        continue; // text landed wrong — retype rather than search on a bad string
      }
      // Short per-attempt wait: if the search fired, the list narrows quickly; a long
      // wait here just delays the retry that actually fixes it.
      found = (await action.waitForDisplayed(itemLocator, 6000)) === true;
    }
    if (!found) {
      var totalResults = await action.getElementCount(this.copyFromClassItem);
      var boxValue = await action.getValue(this.copyFromSearchInput);
      console.log("copySourceClass DIAGNOSTIC", {
        searchBoxValue: boxValue,
        resultRowsInDom: totalResults,
        lookingFor: className
      });
      await logger.logInto(
        await stackTrace.get(),
        "source class '" + className + "' not found after 3 search attempts — box held '" +
          boxValue + "', " + totalResults + " result rows in DOM",
        "error"
      );
      return false;
    }
    var res = await action.click(itemLocator);
    if (true != res) {
      await logger.logInto(await stackTrace.get(), res + " source class was NOT selected", "error");
      return false;
    }
    res = await action.click(this.copyFromContinueBtn); // step 1 → step 2
    if (true != res) {
      await logger.logInto(await stackTrace.get(), res + " step-1 Continue was NOT clicked", "error");
      return false;
    }
    // Step 2 is confirmed by its own controls appearing (same Continue selector).
    var atStep2 = await action.waitForDisplayed(this.copyTeachersLabel, 10000);
    if (atStep2 !== true) {
      await logger.logInto(await stackTrace.get(), "'what to copy' step did not render", "error");
      return false;
    }
    return true;
  },

  /**
   * Step 2 — ticks Teachers + Course materials (clicking the LABELS: the Bootstrap
   * custom-control label overlays the input and intercepts pointer events, so
   * clicking the input itself times out), then Continue to apply and close.
   * Returns true once the modal has closed.
   */
  apply_copyOptions: async function () {
    await logger.logInto(await stackTrace.get());
    await action.click(this.copyTeachersLabel);
    await action.click(this.copyMaterialsLabel);
    var res = await action.click(this.copyFromContinueBtn); // applies to selected rows
    if (true != res) {
      await logger.logInto(await stackTrace.get(), res + " step-2 Continue was NOT clicked", "error");
      return false;
    }
    // Applied once the modal is gone.
    var closed = await action.waitForDisplayed(this.copyFromModalTitle, 15000, true);
    if (closed !== true) {
      await logger.logInto(await stackTrace.get(), "copy-from modal did not close", "error");
      return false;
    }
    await logger.logInto(await stackTrace.get(), "copy options applied");
    return true;
  },

  /**
   * Reads row 1's "Copied from a class" indicator, which renders only after a copy
   * and shows `[source class] [key]` plus the copied categories.
   * Returns { shown: <bool>, text: <string|null> }.
   */
  getData_copiedFrom: async function () {
    await logger.logInto(await stackTrace.get());
    var obj = { shown: false, text: null };
    obj.shown = (await action.getElementCount(this.copiedFromIndicator)) > 0;
    if (obj.shown) {
      obj.text = await action.getText(this.copiedFromIndicator);
    }
    console.log("copiedFrom", obj);
    return obj;
  },

  // ── Reset the form to a single empty row — BCCF_TC_7 precondition ─────────────

  /**
   * Resets the bulk form to ONE empty row: ticks select-all, clicks the toolbar's
   * Remove, and confirms the "Are you sure you want to remove selected rows?"
   * dialog ("Yes, remove rows").
   *
   * WHY THIS EXISTS: the form auto-saves and RESTORES a draft, so a run never
   * starts from a known state — rows left by a previous run reappear. Any test
   * that asserts on a specific row INDEX is therefore non-deterministic without
   * this. Verified live: after confirming, exactly one empty row remains.
   * Removes only unsaved FORM rows — no class is created or deleted.
   *
   * Returns true once a single empty row remains, else false.
   */
  reset_formToSingleEmptyRow: async function () {
    await logger.logInto(await stackTrace.get());
    // Select-all is a no-op when the form is already a lone empty row (its row
    // checkbox is disabled), so treat "nothing to remove" as success.
    var rowCount = await action.getElementCount(this.rowCheckbox);
    if (rowCount === 0) {
      await logger.logInto(await stackTrace.get(), "form already has no removable rows");
      return true;
    }
    await action.click(this.selectAllCheckbox);
    await action.click(this.toolbarRemoveBtn);
    // The confirm dialog is slow to paint — wait on it rather than the click result.
    var shown = await action.waitForDisplayed(this.removeRowsDialogTitle, 10000);
    if (shown !== true) {
      await logger.logInto(await stackTrace.get(), "remove-rows dialog never opened", "error");
      return false;
    }
    var res = await action.click(this.removeRowsConfirmLink);
    if (true != res) {
      await logger.logInto(await stackTrace.get(), res + "remove-rows was NOT confirmed", "error");
      return false;
    }
    // Settled when the class-name input is empty again (one pristine row).
    try {
      await browser.waitUntil(
        async () => (await action.getValue(this.classNameInput)) === "",
        { timeout: 10000, timeoutMsg: "form did not reset to an empty row" }
      );
    } catch (e) {
      await logger.logInto(await stackTrace.get(), "form did not reset to an empty row", "error");
      return false;
    }
    await logger.logInto(await stackTrace.get(), "form reset to a single empty row");
    return true;
  },

  // ── Duplicate a selected row — BCCF_TC_7 ──────────────────────────────────────

  /**
   * Clicks the toolbar's "Duplicate" for the selected row(s) and handles the
   * label-confirmation dialog. Verified live: Duplicate itself is immediate (no
   * confirm), and the copy is APPENDED AFTER THE LAST FILLED ROW — not inserted
   * next to the source — which is why callers must control the row count (see
   * reset_formToSingleEmptyRow) if they assert on a row index.
   *
   * The "Apply the labels to new classes too?" dialog appears ONLY when the source
   * row carries a label; when it does, `includeLabels` decides whether the label is
   * copied (tick the box) before clicking Continue. Handled conditionally so the
   * method works for labelled and unlabelled source rows alike.
   *
   * Requires at least one row selected first (click_rowCheckbox).
   */
  click_toolbarDuplicate: async function (includeLabels) {
    await logger.logInto(await stackTrace.get());
    var res = await action.click(this.toolbarDuplicateBtn);
    if (true != res) {
      await logger.logInto(await stackTrace.get(), res + "toolbarDuplicateBtn is NOT clicked", "error");
      return false;
    }
    // Only labelled source rows raise the dialog — a short wait, then move on.
    var dialogShown = await action.waitForDisplayed(this.duplicateLabelDialogTitle, 5000);
    if (dialogShown === true) {
      await logger.logInto(await stackTrace.get(), "label-copy dialog shown");
      if (includeLabels === true) {
        await action.click(this.includeClassLabelsCheckbox);
      }
      var cont = await action.click(this.duplicateContinueLink);
      if (true != cont) {
        await logger.logInto(await stackTrace.get(), cont + "duplicate Continue was NOT clicked", "error");
        return false;
      }
      await action.waitForDisplayed(this.duplicateLabelDialogTitle, 10000, true); // wait until hidden
    }
    await logger.logInto(await stackTrace.get(), "row duplicated");
    return true;
  },

  /**
   * Reads the duplicated row's (row 2's) fields, for comparison against the source
   * row. Valid only when the form was reset to a single filled row before
   * duplicating — otherwise the copy lands further down (see click_toolbarDuplicate).
   * Returns { name, start, end, teacher, material }.
   */
  getData_row2Values: async function () {
    await logger.logInto(await stackTrace.get());
    var obj = {
      name: await action.getValue(this.classNameInputRow2),
      start: await action.getValue(this.startDateInputRow2),
      end: await action.getValue(this.endDateInputRow2),
      teacher: (await action.getElementCount(this.selectedTeacherInputRow2)) > 0
        ? await action.getValue(this.selectedTeacherInputRow2) : null,
      material: (await action.getElementCount(this.selectedMaterialInputRow2)) > 0
        ? await action.getValue(this.selectedMaterialInputRow2) : null
    };
    console.log("row2Values", obj);
    return obj;
  },

  /**
   * Reads row 1's (the source row's) fields, mirroring getData_row2Values so a
   * caller can compare the two field-by-field.
   * Returns { name, start, end, teacher, material }.
   */
  getData_row1Values: async function () {
    await logger.logInto(await stackTrace.get());
    var obj = {
      name: await action.getValue(this.classNameInput),
      start: await action.getValue(this.startDateInput),
      end: await action.getValue(this.endDateInput),
      teacher: (await action.getElementCount(this.selectedTeacherInput)) > 0
        ? await action.getValue(this.selectedTeacherInput) : null,
      material: (await action.getElementCount(this.selectedMaterialInput)) > 0
        ? await action.getValue(this.selectedMaterialInput) : null
    };
    console.log("row1Values", obj);
    return obj;
  },

  /**
   * From the success dialog, clicks "Create more classes" — the sibling of
   * "Back to dashboard" (both live in #successCreateClassesModal; only ONE can be
   * used per dialog, since either dismisses it). Confirms the Create-new-classes
   * form is usable again afterwards, and reports the first row's state so the
   * caller can assert whether the form was reset or a draft was retained.
   * Returns { pageStatus, rowName, rowStart, rowEnd }.
   */
  click_createMoreClasses: async function () {
    await logger.logInto(await stackTrace.get());
    var obj = { pageStatus: false, rowName: null, rowStart: null, rowEnd: null };
    var res = await action.click(this.createMoreClassesLink);
    if (true != res) {
      await logger.logInto(await stackTrace.get(), res + "createMoreClassesLink is NOT clicked", "error");
      return obj;
    }
    // The dialog closes and the form is re-presented — wait for it to be ready.
    var init = await this.isInitialized();
    obj.pageStatus = init.pageStatus === true;
    if (obj.pageStatus) {
      obj.rowName = await action.getValue(this.classNameInput);
      obj.rowStart = await action.getValue(this.startDateInput);
      obj.rowEnd = await action.getValue(this.endDateInput);
    }
    console.log("createMoreClasses", obj);
    return obj;
  },

  /**
   * From the success dialog, clicks "Back to dashboard" and confirms the school Classes
   * page (…/org_<slug>/class) has reloaded. Verified live: this link returns to the school
   * Classes page (the school dashboard), not the top-level "My school accounts" list.
   * Uses lazy require to avoid a circular dependency with schoolClasses.page.js (ADR-004).
   */
  click_backToDashboard: async function () {
    await logger.logInto(await stackTrace.get());
    var res;
    res = await action.click(this.backToDashboardLink);
    if (true == res) {
      await logger.logInto(await stackTrace.get(), "backToDashboardLink is clicked");
      res = await require("./schoolClasses.page.js").isInitialized();
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + "backToDashboardLink is NOT clicked",
        "error"
      );
    }
    return res;
  }
};

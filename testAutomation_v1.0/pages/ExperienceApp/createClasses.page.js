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
  // Row 2 of the bulk form (a new empty row auto-appends once row 1 is filled).
  // Same dBulkClass-<row>-<col> qid pattern as row 1 (row index 0 → 1).
  classNameInputRow2: selectorFile.css.ComproC1.createClasses.classNameInputRow2,
  startDateInputRow2: selectorFile.css.ComproC1.createClasses.startDateInputRow2,
  endDateInputRow2: selectorFile.css.ComproC1.createClasses.endDateInputRow2,

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

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
  createClassBtn: selectorFile.css.ComproC1.createClasses.createClassBtn,
  successDialogTitle: selectorFile.css.ComproC1.createClasses.successDialogTitle,
  addMaterialBtn: selectorFile.css.ComproC1.createClasses.addMaterialBtn,
  materialSearchInput: selectorFile.css.ComproC1.createClasses.materialSearchInput,
  materialItem: selectorFile.css.ComproC1.createClasses.materialItem,
  addMaterialsConfirmBtn: selectorFile.css.ComproC1.createClasses.addMaterialsConfirmBtn,
  selectedMaterialInput: selectorFile.css.ComproC1.createClasses.selectedMaterialInput,
  backToDashboardLink: selectorFile.css.ComproC1.createClasses.backToDashboardLink,

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

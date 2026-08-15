"use strict";
var action = require("../../core/actionLibrary/baseActionLibrary.js");
// Selectors resolved at load time from C1Selectors.json → css.ComproC1.schoolClasses
var selectorFile = jsonParserUtil.jsonParser(selectorDir);

module.exports = {
  // Resolves to C1Selectors.json → css.ComproC1.schoolClasses.*
  addClassBtn: selectorFile.css.ComproC1.schoolClasses.addClassBtn,
  activeClassesHeading: selectorFile.css.ComproC1.schoolClasses.activeClassesHeading,
  endedClassesHeading: selectorFile.css.ComproC1.schoolClasses.endedClassesHeading,
  searchInput: selectorFile.css.ComproC1.schoolClasses.searchInput,
  filterLink: selectorFile.css.ComproC1.schoolClasses.filterLink,
  userGuideToggle: selectorFile.css.ComproC1.schoolClasses.userGuideToggle,
  selectAllCheckbox: selectorFile.css.ComproC1.schoolClasses.selectAllCheckbox,
  deleteClassBtn: selectorFile.css.ComproC1.schoolClasses.deleteClassBtn,
  leftNavClasses: selectorFile.css.ComproC1.schoolClasses.leftNavClasses,
  leftNavStudents: selectorFile.css.ComproC1.schoolClasses.leftNavStudents,
  leftNavStaff: selectorFile.css.ComproC1.schoolClasses.leftNavStaff,
  leftNavLibrary: selectorFile.css.ComproC1.schoolClasses.leftNavLibrary,
  leftNavReports: selectorFile.css.ComproC1.schoolClasses.leftNavReports,
  tableHeaderClassName: selectorFile.css.ComproC1.schoolClasses.tableHeaderClassName,
  tableHeaderClassKey: selectorFile.css.ComproC1.schoolClasses.tableHeaderClassKey,
  tableHeaderStartDate: selectorFile.css.ComproC1.schoolClasses.tableHeaderStartDate,
  tableHeaderEndDate: selectorFile.css.ComproC1.schoolClasses.tableHeaderEndDate,
  tableHeaderStudentProgress: selectorFile.css.ComproC1.schoolClasses.tableHeaderStudentProgress,
  classRow: selectorFile.css.ComproC1.schoolClasses.classRow,
  noMatchingClassesText: selectorFile.css.ComproC1.schoolClasses.noMatchingClassesText,
  clearFilterLink: selectorFile.css.ComproC1.schoolClasses.clearFilterLink,

  /**
   * Confirms a school's Classes page (…/org_<slug>/class) has loaded.
   * Anchors on the "Add class" button [qid="aClass-10"], which is unique to this view.
   */
  isInitialized: async function () {
    var res;
    await logger.logInto(await stackTrace.get());
    await action.waitForDocumentLoad();
    res = {
      pageStatus: await action.waitForDisplayed(this.addClassBtn)
    };
    return res;
  },

  /**
   * Reads the current active-class count from the "Active classes (N)" heading.
   * The count is captured as a BASELINE only — class creation on this app is
   * asynchronous (the success dialog states it "can take up to 12 hours"), so the
   * newly created class does NOT appear in this count immediately after creation.
   * Returns { count: <int>, raw: <heading text> }; count is null if it can't be parsed.
   */
  getData_activeClassCount: async function () {
    await logger.logInto(await stackTrace.get());
    var obj = { count: null, raw: null };
    if ((await action.getElementCount(this.activeClassesHeading)) > 0) {
      var text = await action.getText(this.activeClassesHeading); // e.g. "Active classes  (8)"
      obj.raw = text;
      var match = /\((\d+)\)/.exec(text || ""); // pull the integer inside the parentheses
      obj.count = match ? parseInt(match[1], 10) : null;
    }
    console.log("activeClassCount", obj);
    return obj;
  },

  /**
   * Clicks "Add class" and confirms the "Create new classes" form loaded.
   * Uses lazy require to avoid a circular dependency with createClasses.page.js (ADR-004).
   */
  click_addClass: async function () {
    await logger.logInto(await stackTrace.get());
    var res;
    res = await action.click(this.addClassBtn);
    if (true == res) {
      await logger.logInto(await stackTrace.get(), " addClassBtn is clicked");
      res = await require("./createClasses.page.js").isInitialized();
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + "addClassBtn is NOT clicked",
        "error"
      );
    }
    return res;
  },

  /**
   * TST_CLST_TC_1 support — reads presence of every component expected on the loaded
   * Classes tab (Req #1): heading, search box, filter link, user guide toggle, select-all +
   * delete class control, table column headers, and the separate Ended classes section.
   * Returns booleans per component (element-count based, no assertions here — ADR-003).
   */
  getData_classesTabLayout: async function () {
    await logger.logInto(await stackTrace.get());
    var obj = {
      activeClassesHeadingDisplayed: (await action.getElementCount(this.activeClassesHeading)) > 0,
      searchInputDisplayed: (await action.getElementCount(this.searchInput)) > 0,
      addClassBtnDisplayed: (await action.getElementCount(this.addClassBtn)) > 0,
      filterLinkDisplayed: (await action.getElementCount(this.filterLink)) > 0,
      userGuideToggleDisplayed: (await action.getElementCount(this.userGuideToggle)) > 0,
      selectAllCheckboxDisplayed: (await action.getElementCount(this.selectAllCheckbox)) > 0,
      deleteClassBtnDisplayed: (await action.getElementCount(this.deleteClassBtn)) > 0,
      deleteClassBtnEnabled: await action.isEnabled(this.deleteClassBtn),
      tableHeadersDisplayed:
        (await action.getElementCount(this.tableHeaderClassName)) > 0 &&
        (await action.getElementCount(this.tableHeaderClassKey)) > 0 &&
        (await action.getElementCount(this.tableHeaderStartDate)) > 0 &&
        (await action.getElementCount(this.tableHeaderEndDate)) > 0 &&
        (await action.getElementCount(this.tableHeaderStudentProgress)) > 0,
      endedClassesHeadingDisplayed: (await action.getElementCount(this.endedClassesHeading)) > 0,
      leftNavDisplayed:
        (await action.getElementCount(this.leftNavClasses)) > 0 &&
        (await action.getElementCount(this.leftNavStudents)) > 0 &&
        (await action.getElementCount(this.leftNavStaff)) > 0 &&
        (await action.getElementCount(this.leftNavLibrary)) > 0 &&
        (await action.getElementCount(this.leftNavReports)) > 0
    };
    console.log("classesTabLayout", obj);
    return obj;
  },

  /**
   * Reads the number of class rows currently visible in the active table (for filter
   * assertions in Req #2 — e.g. confirming a status/label filter narrowed the list).
   * Returns { count: <int> }.
   */
  getData_visibleClassRowCount: async function () {
    await logger.logInto(await stackTrace.get());
    var count = await action.getElementCount(this.classRow);
    return { count: count };
  },

  /**
   * Reports whether the "no matching classes" empty state is shown (Req #2 negative case —
   * a filter combination with zero matches).
   *
   * Verified live 2026-08-15: the page renders TWO <empty-class-state> nodes — one inside
   * .active-section (visible) and a twin inside the collapsed .ended-section (hidden). The
   * selector's .active-section prefix is what disambiguates them, so this must stay a
   * visibility check rather than a bare element count.
   */
  getData_emptyStateDisplayed: async function () {
    await logger.logInto(await stackTrace.get());
    return await action.isDisplayed(this.noMatchingClassesText);
  },

  /**
   * Reports whether a filter is currently applied to the Classes tab.
   * The page-level "Clear" link (qid=aClass-19) is rendered ONLY while a filter is applied,
   * so its presence is the app's own signal that Apply took effect — used by the Req #2 TCs
   * instead of inferring "the filter worked" from a row count that may legitimately be zero.
   */
  getData_filterApplied: async function () {
    await logger.logInto(await stackTrace.get());
    return await action.isDisplayed(this.clearFilterLink);
  },

  /**
   * Clicks "Filter" and confirms the Filter modal (#classSortFilterModal) loaded.
   * Uses lazy require to avoid a circular dependency (ADR-004).
   */
  click_filter: async function () {
    await logger.logInto(await stackTrace.get());
    var res;
    res = await action.click(this.filterLink);
    if (true == res) {
      await logger.logInto(await stackTrace.get(), "filterLink is clicked");
      res = await require("./classFilterModal.page.js").isInitialized();
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + "filterLink is NOT clicked",
        "error"
      );
    }
    return res;
  }
};

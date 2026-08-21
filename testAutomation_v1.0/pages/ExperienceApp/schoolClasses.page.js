"use strict";
var action = require("../../core/actionLibrary/baseActionLibrary.js");
// Selectors resolved at load time from C1Selectors.json → css.ComproC1.schoolClasses
var selectorFile = jsonParserUtil.jsonParser(selectorDir);
var sc = selectorFile.css.ComproC1.schoolClasses;
// Captured by isInitialized() so a TC that navigates to a class page can return here.
// The URL contains the school's org slug, so it cannot be a constant.
var classesTabUrl = null;

/**
 * Reads a cheap fingerprint of the currently listed classes: row count + the first and
 * last class name. Used to detect that the grid has actually re-rendered after a search
 * or a sort.
 *
 * WHY a fingerprint rather than waiting on a UI flag — measured live 2026-08-17:
 * the sort header's own status label ("sorted ascending"/"sorted descending") flips in
 * ~90-120ms, but the ROWS only re-order at ~1.2-3.2s. The label is optimistic UI, updated
 * before the server responds. Waiting on it and then reading the rows reads the PREVIOUS
 * order. Search settles at ~1.0-1.2s. So the only trustworthy "it's done" signal is the
 * row content itself changing.
 */
async function readListSignature() {
  var count = await action.getElementCount(sc.classRow);
  if (typeof count !== "number") return "UNREADABLE";
  if (count === 0) return "EMPTY:0";
  var first = await action.getText(sc.rowClassNameByIndex.replace("{{n}}", "0"));
  var last = await action.getText(sc.rowClassNameByIndex.replace("{{n}}", String(count - 1)));
  // getText returns an Error object on failure (ADR-009) — a row can vanish mid-poll while
  // the grid re-renders. Coerce to a string either way: a changed signature is all we need.
  return count + "|" + String(first && first.message ? "ERR" : first) +
    "|" + String(last && last.message ? "ERR" : last);
}

/**
 * Polls until the listed classes differ from `previous`, or the budget expires.
 * Returns true if the list changed, false on timeout. Budget defaults to 20s — measured
 * worst case is 3.2s (sort) / 1.2s (search), so this is ~6x headroom, not a guess.
 */
async function waitForListChange(previous, timeoutMs) {
  var deadline = Date.now() + (timeoutMs || 20000);
  while (Date.now() < deadline) {
    if ((await readListSignature()) !== previous) return true;
    await browser.pause(250); // polling interval — nothing observable to wait on between polls
  }
  return false;
}

module.exports = {
  // Resolves to C1Selectors.json → css.ComproC1.schoolClasses.*
  addClassBtn: selectorFile.css.ComproC1.schoolClasses.addClassBtn,
  activeClassesHeading: selectorFile.css.ComproC1.schoolClasses.activeClassesHeading,
  endedClassesHeading: selectorFile.css.ComproC1.schoolClasses.endedClassesHeading,
  searchInput: selectorFile.css.ComproC1.schoolClasses.searchInput,
  searchBtn: selectorFile.css.ComproC1.schoolClasses.searchBtn,
  filterLink: selectorFile.css.ComproC1.schoolClasses.filterLink,
  userGuideToggle: selectorFile.css.ComproC1.schoolClasses.userGuideToggle,
  userGuidePanel: selectorFile.css.ComproC1.schoolClasses.userGuidePanel,
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
  sortByClassNameBtn: selectorFile.css.ComproC1.schoolClasses.sortByClassNameBtn,
  sortByStartDateBtn: selectorFile.css.ComproC1.schoolClasses.sortByStartDateBtn,
  sortByEndDateBtn: selectorFile.css.ComproC1.schoolClasses.sortByEndDateBtn,
  sortStatusClassName: selectorFile.css.ComproC1.schoolClasses.sortStatusClassName,
  sortStatusStartDate: selectorFile.css.ComproC1.schoolClasses.sortStatusStartDate,
  sortStatusEndDate: selectorFile.css.ComproC1.schoolClasses.sortStatusEndDate,
  classRow: selectorFile.css.ComproC1.schoolClasses.classRow,
  // Selector TEMPLATES ({{n}} = the row's 0-based index within the Active section) —
  // resolved per row at call time, same pattern as classFilterModal.statusOptionByLabel.
  rowClassNameByIndex: selectorFile.css.ComproC1.schoolClasses.rowClassNameByIndex,
  rowClassKeyByIndex: selectorFile.css.ComproC1.schoolClasses.rowClassKeyByIndex,
  rowStartDateByIndex: selectorFile.css.ComproC1.schoolClasses.rowStartDateByIndex,
  rowEndDateByIndex: selectorFile.css.ComproC1.schoolClasses.rowEndDateByIndex,
  noMatchingClassesText: selectorFile.css.ComproC1.schoolClasses.noMatchingClassesText,
  clearFilterLink: selectorFile.css.ComproC1.schoolClasses.clearFilterLink,
  rowDetailsToggleByIndex: selectorFile.css.ComproC1.schoolClasses.rowDetailsToggleByIndex,
  rowDetailsPanelByIndex: selectorFile.css.ComproC1.schoolClasses.rowDetailsPanelByIndex,
  rowDetailsLabelsHeadingByIndex: selectorFile.css.ComproC1.schoolClasses.rowDetailsLabelsHeadingByIndex,
  rowDetailsMaterialsByIndex: selectorFile.css.ComproC1.schoolClasses.rowDetailsMaterialsByIndex,
  endedSection: selectorFile.css.ComproC1.schoolClasses.endedSection,
  endedSectionToggle: selectorFile.css.ComproC1.schoolClasses.endedSectionToggle,
  endedSectionPanel: selectorFile.css.ComproC1.schoolClasses.endedSectionPanel,
  endedSectionToggleText: selectorFile.css.ComproC1.schoolClasses.endedSectionToggleText,
  endedTableHeaderClassStatus: selectorFile.css.ComproC1.schoolClasses.endedTableHeaderClassStatus,
  endedClassRow: selectorFile.css.ComproC1.schoolClasses.endedClassRow,
  endedRowClassNameByIndex: selectorFile.css.ComproC1.schoolClasses.endedRowClassNameByIndex,
  endedRowClassKeyByIndex: selectorFile.css.ComproC1.schoolClasses.endedRowClassKeyByIndex,
  endedRowStatusByIndex: selectorFile.css.ComproC1.schoolClasses.endedRowStatusByIndex,
  loadMoreLink: selectorFile.css.ComproC1.schoolClasses.loadMoreLink,

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
    // Remember where the Classes tab lives so a TC that launches a class can come back
    // (return_toClassesTab). The URL embeds the school's org slug, so it cannot be built
    // from a constant - it has to be captured from a real visit.
    if (true === res.pageStatus) classesTabUrl = await browser.getUrl();
    return res;
  },

  /**
   * Returns to the Classes tab after a TC has launched a class page (Req #19 / #29).
   *
   * Uses the URL captured by isInitialized() rather than browser history: the class page is
   * an SPA route, and going "back" would leave the Angular app in whatever state the class
   * page left it. A fresh navigation also resets the Ended section's lazy-loaded rows, which
   * is what makes the load-more TCs independent (see click_loadMore).
   */
  return_toClassesTab: async function () {
    await logger.logInto(await stackTrace.get(), "returning to the Classes tab");
    if (!classesTabUrl) {
      await logger.logInto(await stackTrace.get(), "no Classes tab URL captured yet", "error");
      return { pageStatus: false };
    }
    await browser.url(classesTabUrl);
    return await this.isInitialized();
  },

  /**
   * Reloads the Classes tab to restore first-page state.
   *
   * Needed by the load-more TCs: once "Load more" has run, the extra rows stay in the DOM
   * even if the Ended section is collapsed and re-expanded (verified live 2026-08-17 -
   * collapse/re-expand kept 26 rows and the link stayed gone). Only a fresh page load returns
   * the Ended list to its first 20 rows with the link present, so this is what keeps
   * TST_CLST_TC_17 and TC_20 independent of each other and of run order (ADR-011).
   */
  reload_classesTab: async function () {
    await logger.logInto(await stackTrace.get(), "reloading the Classes tab");
    await browser.refresh();
    return await this.isInitialized();
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
   * Reads the text of the "no results / no matching classes" empty state.
   * On a search the app echoes the term back — "No classes that match your search <term>"
   * (captured live 2026-08-17) — so the text is what lets TST_CLST_TC_21 prove the state
   * belongs to THIS search rather than merely existing.
   * Returns the string, or null when the empty state is not displayed.
   */
  getData_emptyStateText: async function () {
    await logger.logInto(await stackTrace.get());
    if (true !== (await action.isDisplayed(this.noMatchingClassesText))) return null;
    var text = await action.getText(this.noMatchingClassesText);
    return text && text.message ? null : text;
  },

  /**
   * Reads every visible class row in the Active section, in DOM order, as
   * [{ name, key, startDate, endDate }, ...].
   *
   * Row cells carry stable indexed ids (class-cell-<field>-ACTIVE_SECTION-<n>), so each
   * field is read through an ordinary selector rather than a DOM-order nth() — no new
   * action-library capability needed (Invariant 3).
   *
   * NOTE: the list lazy-loads ("Load more …"), so this returns the VISIBLE rows, which on a
   * large school are a subset of the "Active classes (N)" heading count.
   */
  getData_classRows: async function () {
    await logger.logInto(await stackTrace.get());
    var rows = [];
    var count = await action.getElementCount(this.classRow);
    if (typeof count !== "number") return rows;
    for (var n = 0; n < count; n++) {
      var i = String(n);
      var key = await action.getText(this.rowClassKeyByIndex.replace("{{n}}", i));
      rows.push({
        name: await action.getText(this.rowClassNameByIndex.replace("{{n}}", i)),
        // The key cell also holds a "Copy" button whose accessible name is not rendered as
        // text; innerText is therefore just the key, but trim it — the markup pads it.
        key: (typeof key === "string" ? key : "").trim(),
        startDate: await action.getText(this.rowStartDateByIndex.replace("{{n}}", i)),
        endDate: await action.getText(this.rowEndDateByIndex.replace("{{n}}", i))
      });
    }
    console.log("classRows", rows.length, rows.map(function (r) { return r.name; }));
    return rows;
  },

  /**
   * Types a term into the class Search box and clicks Search (Req #9).
   *
   * Verified live 2026-08-17: typing alone does NOT filter — search is submit-driven, not
   * debounced-live, so the Search button click is required. The input is Angular-backed, so
   * it is typed with addValue/pressSequentially and cleared first (Invariant 6): addValue
   * appends, and the term PERSISTS between TCs (see clear_search), so a second search would
   * otherwise concatenate two terms and match nothing.
   *
   * Waits for the grid to actually re-render (~1.0-1.2s measured) rather than a fixed pause.
   * Returns { pageStatus: <bool> } — false if the list never changed within the budget.
   */
  search_class: async function (term) {
    await logger.logInto(await stackTrace.get(), "searching classes for: " + term);
    await action.waitForDisplayed(this.searchInput, 15000);
    // Click the field before typing — same Angular focus requirement as the filter panel's
    // label search (Invariant 6).
    await action.click(this.searchInput);
    await action.clearValue(this.searchInput);
    var res = true;
    if (term !== "") res = await action.addValue(this.searchInput, term);
    if (true != res) {
      await logger.logInto(await stackTrace.get(), res + " search term NOT entered", "error");
      return { pageStatus: false };
    }
    var before = await readListSignature();
    await action.waitForClickable(this.searchBtn, 10000);
    res = await action.click(this.searchBtn);
    if (true != res) {
      await logger.logInto(await stackTrace.get(), res + " searchBtn is NOT clicked", "error");
      return { pageStatus: false };
    }
    return { pageStatus: await waitForListChange(before, 20000) };
  },

  /**
   * Housekeeping — clears the class search so the next TC starts from the full list.
   *
   * REQUIRED, not optional: verified live 2026-08-17 that the search term persists exactly
   * like the applied filter — it survived a full page reload, still filtering the list to a
   * single class. Without this, a search left by TST_CLST_TC_5/6/18/21 would leave the sort
   * TCs (TST_CLST_TC_7/8) sorting a one-row list, and would leak into the NEXT RUN.
   *
   * Tolerant by design (it runs from Before/AfterEach): a no-op when nothing is searched,
   * and it never throws. It does log a failure rather than swallowing it (Invariant 13).
   */
  clear_search: async function () {
    await logger.logInto(await stackTrace.get(), "clearing class search");
    try {
      var current = await action.getValue(this.searchInput);
      if (typeof current !== "string" || current === "") return true; // nothing searched
      var res = await this.search_class("");
      if (true !== res.pageStatus) {
        await logger.logInto(
          await stackTrace.get(),
          "clear_search: list did not repopulate after clearing the search box",
          "error"
        );
      }
    } catch (e) {
      await logger.logInto(await stackTrace.get(), "clear_search failed: " + e.message, "error");
    }
    return true;
  },

  /**
   * Reads which column the Active list is currently sorted by, and in which direction.
   *
   * The app renders a visually-hidden status span ("sorted ascending" / "sorted descending")
   * INSIDE the active sort column's header button only — the other columns' spans are removed
   * from the DOM entirely (verified live 2026-08-17). So a null here means "not the sort
   * column", which is itself an assertable fact.
   *
   * Returns { className, startDate, endDate } — each a direction string or null.
   */
  getData_sortStatus: async function () {
    await logger.logInto(await stackTrace.get());
    var read = async function (selector) {
      if ((await action.getElementCount(selector)) < 1) return null;
      var text = await action.getText(selector);
      return typeof text === "string" ? text.trim() : null;
    };
    var obj = {
      className: await read(this.sortStatusClassName),
      startDate: await read(this.sortStatusStartDate),
      endDate: await read(this.sortStatusEndDate)
    };
    console.log("sortStatus", obj);
    return obj;
  },

  /**
   * Clicks a sortable Active-table column header and waits for the rows to actually reorder.
   *
   * `column` is "className" | "startDate" | "endDate" (Class key is NOT sortable — its header
   * is a disabled span, confirmed live 2026-08-17).
   *
   * Each click TOGGLES the direction, so this deliberately does not assume the resulting
   * direction — the caller reads it from getData_sortStatus(). Waiting is on the row order,
   * never the status label: the label flips in ~100ms but the rows follow ~1.2-3.2s later
   * (see readListSignature).
   *
   * Returns { pageStatus: <bool> } — false if the order never changed within the budget.
   */
  click_sortBy: async function (column) {
    await logger.logInto(await stackTrace.get(), "sorting by: " + column);
    var selectors = {
      className: this.sortByClassNameBtn,
      startDate: this.sortByStartDateBtn,
      endDate: this.sortByEndDateBtn
    };
    var selector = selectors[column];
    if (!selector) {
      await logger.logInto(await stackTrace.get(), "unknown sort column: " + column, "error");
      return { pageStatus: false };
    }
    var before = await readListSignature();
    await action.waitForDisplayed(selector, 15000);
    await action.waitForClickable(selector, 10000);
    var res = await action.click(selector);
    if (true != res) {
      await logger.logInto(await stackTrace.get(), res + " sort header NOT clicked", "error");
      return { pageStatus: false };
    }
    return { pageStatus: await waitForListChange(before, 20000) };
  },

  // ── Req #18 — expand / collapse a class row ─────────────────────────────────

  /**
   * Toggles a class row's "Show/Hide class details" panel and waits for the panel to reach
   * `expectDisplayed`.
   *
   * TWO TRAPS, both verified live 2026-08-17:
   * 1. The panel's CONTENT stays in the DOM while collapsed (a collapsed panel still has its
   *    Students/Teachers nodes), so an element-count check is always true - only visibility
   *    distinguishes the states. Same trap as #classSortFilterModal.
   * 2. Bootstrap runs an intermediate `collapsing` class for ~700ms. Clicking again during
   *    that window races the animation and silently lands in the wrong state - which is how
   *    an early exploration read an expanded row as empty. Waiting on visibility (rather than
   *    firing the next click immediately) is what makes this deterministic.
   *
   * `rowIndex` is the row's 0-based position in the Active section.
   * Returns { pageStatus: <bool> }.
   */
  click_rowDetailsToggle: async function (rowIndex, expectDisplayed) {
    await logger.logInto(await stackTrace.get(), "toggling class details for row " + rowIndex);
    var toggle = this.rowDetailsToggleByIndex.replace("{{n}}", String(rowIndex));
    var panel = this.rowDetailsPanelByIndex.replace("{{n}}", String(rowIndex));
    await action.waitForDisplayed(toggle, 15000);
    await action.waitForClickable(toggle, 10000);
    var res = await action.click(toggle);
    if (true != res) {
      await logger.logInto(await stackTrace.get(), res + " row details toggle NOT clicked", "error");
      return { pageStatus: false };
    }
    if (expectDisplayed === true) {
      // Wait for CONTENT, not the container. Playwright treats the panel as visible as soon
      // as it has a non-empty box, which happens PARTWAY THROUGH the ~700ms expand while the
      // panel is still shorter than its content and the inner heading is clipped to zero
      // height. Gating on the panel let TST_CLST_TC_9 read a clipped "Class labels" heading as
      // not-displayed and fail (live run 2026-08-17) — the same "waited on the wrong signal"
      // trap as the optimistic sort label.
      return {
        pageStatus: await action.waitForDisplayed(
          this.rowDetailsLabelsHeadingByIndex.replace("{{n}}", String(rowIndex)), 15000)
      };
    }
    // Collapsing: the panel itself IS the signal — reverse=true waits for it to be hidden.
    return { pageStatus: await action.waitForDisplayed(panel, 15000, true) };
  },

  /**
   * Reads a class row's expanded details (Req #18): course materials, class labels heading,
   * and the Students / Teachers counts.
   *
   * Every check is visibility-based, never a count - see click_rowDetailsToggle trap 1.
   * The materials column shows EITHER a "Course materials" list OR the empty state
   * ("You haven't chosen learning materials for this class yet"), so this reports its text
   * and lets the TC accept both rather than assuming the school's data.
   */
  getData_rowDetails: async function (rowIndex) {
    await logger.logInto(await stackTrace.get());
    var n = String(rowIndex);
    var panel = this.rowDetailsPanelByIndex.replace("{{n}}", n);
    var materials = this.rowDetailsMaterialsByIndex.replace("{{n}}", n);
    var obj = {
      panelDisplayed: await action.isDisplayed(panel),
      labelsHeadingDisplayed: await action.isDisplayed(this.rowDetailsLabelsHeadingByIndex.replace("{{n}}", n)),
      materialsDisplayed: await action.isDisplayed(materials),
      materialsText: null,
      countsText: null,
      toggleLabel: null
    };
    if (true === obj.materialsDisplayed) {
      var mt = await action.getText(materials);
      obj.materialsText = typeof mt === "string" ? mt.replace(/\s+/g, " ").trim() : null;
    }
    if (true === obj.panelDisplayed) {
      // Read the WHOLE panel, not the first .font-weight-bold. getText returns only the FIRST
      // match, and that element is "Course materials" on any row that has materials — so the
      // Students/Teachers counts were never being read on those rows. It looked fine during
      // capture only because row 0 happened to be a class with no materials; once the sort TCs
      // reordered the list, row 0 had materials and TST_CLST_TC_9 failed (live run 2026-08-17).
      // The panel's innerText carries materials, labels, Students N and Teachers N together,
      // so it is correct for both shapes of row.
      var ct = await action.getText(panel);
      obj.countsText = typeof ct === "string" ? ct.replace(/\s+/g, " ").trim() : null;
    }
    var label = await action.getText(this.rowDetailsToggleByIndex.replace("{{n}}", n));
    obj.toggleLabel = typeof label === "string" ? label.trim() : null;
    console.log("rowDetails[" + rowIndex + "]", obj);
    return obj;
  },

  // ── Req #17 / #33 — user guide ──────────────────────────────────────────────

  /**
   * Toggles the "User guide" help panel and waits for it to reach `expectDisplayed`.
   *
   * Unlike the class-details panel and the filter modal, this panel is REMOVED from the DOM
   * when collapsed (verified live 2026-08-17), so either check would work - visibility is used
   * for consistency and because waitForDisplayed(reverse) handles removal correctly too.
   * Returns { pageStatus: <bool> }.
   */
  click_userGuideToggle: async function (expectDisplayed) {
    await logger.logInto(await stackTrace.get(), "toggling the user guide");
    await action.waitForDisplayed(this.userGuideToggle, 15000);
    await action.waitForClickable(this.userGuideToggle, 10000);
    var res = await action.click(this.userGuideToggle);
    if (true != res) {
      await logger.logInto(await stackTrace.get(), res + " user guide toggle NOT clicked", "error");
      return { pageStatus: false };
    }
    return { pageStatus: await action.waitForDisplayed(this.userGuidePanel, 15000, expectDisplayed !== true) };
  },

  /**
   * Reads the user guide's state (Req #17/#33). The toggle's aria-label is the app's own
   * statement of what the next click will do - "Open the user guide" when collapsed,
   * "Hide the user guide" when expanded - which makes it a better signal than the visible
   * text ("User guide" / "Hide").
   */
  getData_userGuide: async function () {
    await logger.logInto(await stackTrace.get());
    var obj = {
      panelDisplayed: await action.isDisplayed(this.userGuidePanel),
      toggleAriaLabel: await action.getAttribute(this.userGuideToggle, "aria-label"),
      panelText: null
    };
    if (true === obj.panelDisplayed) {
      var t = await action.getText(this.userGuidePanel);
      obj.panelText = typeof t === "string" ? t.replace(/\s+/g, " ").trim() : null;
    }
    console.log("userGuide", obj);
    return obj;
  },

  // ── Req #19 / #29 — launch a class ──────────────────────────────────────────

  /**
   * Clicks a class name to launch its Class Page (Req #19 active, Req #29 ended).
   * `section` is "active" or "ended".
   *
   * Reuses activeClass.page.js for the destination check rather than adding a page object
   * (ADR-011) - it already anchors on the class page's Actions button. Lazy require avoids a
   * circular dependency (ADR-004).
   */
  click_className: async function (rowIndex, section) {
    await logger.logInto(await stackTrace.get(), "launching class at row " + rowIndex + " of " + section);
    var template = section === "ended" ? this.endedRowClassNameByIndex : this.rowClassNameByIndex;
    var selector = template.replace("{{n}}", String(rowIndex));
    await action.waitForDisplayed(selector, 15000);
    var name = await action.getText(selector);
    await action.waitForClickable(selector, 10000);
    var res = await action.click(selector);
    if (true != res) {
      await logger.logInto(await stackTrace.get(), res + " class name NOT clicked", "error");
      return { pageStatus: false, className: null };
    }
    var dest = await require("./activeClass.page.js").isInitialized();
    return {
      pageStatus: dest.pageStatus,
      className: typeof name === "string" ? name.trim() : null,
      url: await browser.getUrl()
    };
  },

  // ── Req #28 / #20 — Ended section and load more ─────────────────────────────

  /**
   * Expands or collapses the "Ended classes" section and waits for its panel to settle.
   *
   * The Ended section is COLLAPSED on load and its rows are not rendered at all until it is
   * expanded (verified live 2026-08-17: a freshly loaded page has zero ENDED_SECTION rows and
   * no "Load more" link). Rows appear ~1.0s after expanding, so expansion waits for the first
   * row rather than the panel alone.
   * Returns { pageStatus: <bool> }.
   */
  click_endedSectionToggle: async function (expectExpanded) {
    await logger.logInto(await stackTrace.get(), "toggling the Ended classes section");
    await action.waitForDisplayed(this.endedSectionToggle, 15000);
    await action.waitForClickable(this.endedSectionToggle, 10000);
    var res = await action.click(this.endedSectionToggle);
    if (true != res) {
      await logger.logInto(await stackTrace.get(), res + " ended section toggle NOT clicked", "error");
      return { pageStatus: false };
    }
    if (expectExpanded === true) {
      // Wait for real content, not just the panel: the rows are fetched after the animation.
      return { pageStatus: await action.waitForDisplayed(this.endedClassRow, 20000) };
    }
    return { pageStatus: await action.waitForDisplayed(this.endedSectionPanel, 15000, true) };
  },

  /**
   * Ensures the Ended section is expanded, whatever state it is in (idempotent).
   * Used as setup by the ended-section TCs so none of them depends on what ran before.
   */
  expand_endedSectionIfCollapsed: async function () {
    await logger.logInto(await stackTrace.get());
    if ("true" === (await action.getAttribute(this.endedSectionToggle, "aria-expanded"))) {
      return { pageStatus: true };
    }
    return await this.click_endedSectionToggle(true);
  },

  /**
   * Reads the Ended classes section (Req #28): its heading count, expanded state, the
   * Open/Close toggle text, the Class status column, and the note about ended/deleted classes.
   * Returns nulls rather than throwing when the section is collapsed.
   */
  getData_endedSection: async function () {
    await logger.logInto(await stackTrace.get());
    var headingText = await action.getText(this.endedClassesHeading);
    var raw = typeof headingText === "string" ? headingText : "";
    var match = /\((\d+)\)/.exec(raw);
    var toggleText = await action.getText(this.endedSectionToggleText);
    var sectionText = await action.getText(this.endedSection);
    var obj = {
      headingDisplayed: await action.isDisplayed(this.endedClassesHeading),
      headingRaw: raw.replace(/\s+/g, " ").trim(),
      count: match ? parseInt(match[1], 10) : null,
      expanded: (await action.getAttribute(this.endedSectionToggle, "aria-expanded")) === "true",
      toggleText: typeof toggleText === "string" ? toggleText.trim() : null,
      panelDisplayed: await action.isDisplayed(this.endedSectionPanel),
      statusColumnDisplayed: await action.isDisplayed(this.endedTableHeaderClassStatus),
      visibleRowCount: await action.getElementCount(this.endedClassRow),
      loadMoreDisplayed: await action.isDisplayed(this.loadMoreLink),
      sectionText: typeof sectionText === "string" ? sectionText.replace(/\s+/g, " ").trim().slice(0, 200) : null
    };
    console.log("endedSection", obj);
    return obj;
  },

  /**
   * Clicks "Load more ..." in the Ended section and waits for extra rows to render (Req #20).
   *
   * Measured live 2026-08-17: the new rows land ~3.5s after the click, so this waits on the
   * row count actually increasing rather than on a fixed pause. Returns
   * { pageStatus, before, after } so the TC can assert the list really grew.
   */
  click_loadMore: async function () {
    await logger.logInto(await stackTrace.get(), "clicking 'Load more ...'");
    var before = await action.getElementCount(this.endedClassRow);
    await action.waitForDisplayed(this.loadMoreLink, 15000);
    await action.waitForClickable(this.loadMoreLink, 10000);
    var res = await action.click(this.loadMoreLink);
    if (true != res) {
      await logger.logInto(await stackTrace.get(), res + " 'Load more' NOT clicked", "error");
      return { pageStatus: false, before: before, after: before };
    }
    var deadline = Date.now() + 20000;
    var after = before;
    while (Date.now() < deadline) {
      after = await action.getElementCount(this.endedClassRow);
      if (typeof after === "number" && after > before) break;
      await browser.pause(250); // polling interval - nothing observable between polls
    }
    return { pageStatus: after > before, before: before, after: after };
  },

  /**
   * Clicks "Load more ..." until every ended class is listed (Req #20 edge case).
   * Returns { rowCount, loadMoreDisplayed, clicks }. Bounded so a product bug that keeps the
   * link forever fails the TC instead of hanging the suite.
   */
  loadAll_endedClasses: async function () {
    await logger.logInto(await stackTrace.get());
    var clicks = 0;
    while (clicks < 20 && true === (await action.isDisplayed(this.loadMoreLink))) {
      var res = await this.click_loadMore();
      clicks++;
      if (true !== res.pageStatus) break; // stop on a click that added nothing
    }
    return {
      rowCount: await action.getElementCount(this.endedClassRow),
      loadMoreDisplayed: await action.isDisplayed(this.loadMoreLink),
      clicks: clicks
    };
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

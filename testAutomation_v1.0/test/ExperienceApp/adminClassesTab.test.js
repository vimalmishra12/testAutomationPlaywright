"use strict";
// Admin App — Classes tab: Req #1 (tab load), Req #2 (filter), Req #9 (search),
// Req #27 (sort by class name / start date / end date).
// Manual source: test/Manual/C1App/AdminApp-Classes/AdminApp_Classes_tab_test_cases.md
// Module code: CLST (Classes Tab) — pages/ExperienceApp/schoolClasses.page.js +
// pages/ExperienceApp/classFilterModal.page.js.
var schoolClasses = require("../../pages/ExperienceApp/schoolClasses.page.js");
var classFilterModal = require("../../pages/ExperienceApp/classFilterModal.page.js");

var sts;

// ── Local ordering helpers (pure comparison — no DOM, no page knowledge) ──────────

function namesOf(rows) {
  return rows.map(function (r) { return r.name; });
}

/**
 * String comparison by CODE POINT, which is what the app's own class-name sort does —
 * verified live 2026-08-17 on the tricky pairs: "(14 aug) class 1" sorts before
 * "AutoClass_CreateOnly" ('(' < 'A'), every capitalised name sorts before every
 * lower-case one ('T' < 'c'), and "test Class 14 aug 2" sorts before "testClass1"
 * (' ' < 'C'). A case-insensitive/localeCompare comparison would NOT match the product.
 */
function compareText(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

// Dates render as "Aug 17, 2026" (live 2026-08-17), which Date parses directly.
function compareDate(a, b) {
  return new Date(a).getTime() - new Date(b).getTime();
}

/**
 * Confirms `values` are ordered consistently with the direction the app reports.
 * Uses >= / <= (not strict) because duplicates are real — six active classes share the
 * start date "Aug 14, 2026" on this school.
 */
function isSortedBy(values, direction, compare) {
  for (var i = 1; i < values.length; i++) {
    var c = compare(values[i - 1], values[i]);
    if (direction === "sorted ascending" && c > 0) return false;
    if (direction === "sorted descending" && c < 0) return false;
  }
  return true;
}

function isSortDirection(status) {
  return status === "sorted ascending" || status === "sorted descending";
}

module.exports = {
  /**
   * TST_CLST_TC_RESET — BeforeEach + suite-level After housekeeping, not a functional test.
   * Clears any applied Class status / label filter AND any class search, so the next TC
   * starts from the full, unfiltered list (ADR-011: TCs must not depend on what ran before
   * them). Intentionally carries no assertions — a reset must never fail the suite.
   *
   * The search reset is not belt-and-braces: the search term persists exactly like the
   * filter (verified live 2026-08-17 — it survived a full page reload), so without it the
   * search TCs would hand TST_CLST_TC_7/8 a single-row list to sort, and would leak into
   * the next run.
   *
   * REGISTERED IN BeforeEach AND THE SUITE-LEVEL After — NEVER AfterEach (ADR-019).
   * The mochawesome screenshot is taken in a ROOT afterEach (core/runner/playwright.setup.js),
   * and mocha runs root afterEach hooks LAST, so an AfterEach reset fires BEFORE the shot:
   * every search/filter TC was photographed on the full unfiltered list, with the result it
   * had just asserted already wiped off the screen. BeforeEach gives each TC the same clean
   * start, and the After entry still stops the term leaking into the next run.
   */
  TST_CLST_TC_RESET: async function (testdata) {
    // ORDER MATTERS — clear the search FIRST. reset_filters() finishes by waiting for the
    // class grid to repopulate (so no TC inherits an empty grid), and that wait cannot
    // succeed while a search is still applied: after TST_CLST_TC_21 the grid is empty
    // *because of the search*, so the wait burned its full 20s budget every run. It failed
    // silently — action.waitForDisplayed RETURNS the error rather than throwing, so the
    // try/catch in reset_filters never fired and nothing appeared in the log; the only
    // symptom was ~20s of unexplained suite time (measured 2026-08-17).
    await schoolClasses.clear_search();
    await classFilterModal.reset_filters();
  },

  // ── POSITIVE ─────────────────────────────────────────────────────────────────

  /**
   * TST_CLST_TC_1 — Req #1: Verify the Classes tab loads with all expected components.
   */
  TST_CLST_TC_1: async function (testdata) {
    sts = await schoolClasses.getData_classesTabLayout();
    await assertion.assertEqual(sts.activeClassesHeadingDisplayed, true, "'Active classes' heading not displayed");
    await assertion.assertEqual(sts.searchInputDisplayed, true, "Search box not displayed");
    await assertion.assertEqual(sts.addClassBtnDisplayed, true, "'Add class' button not displayed");
    await assertion.assertEqual(sts.filterLinkDisplayed, true, "'Filter' link not displayed");
    await assertion.assertEqual(sts.userGuideToggleDisplayed, true, "User guide toggle not displayed");
    await assertion.assertEqual(sts.selectAllCheckboxDisplayed, true, "Select-all checkbox not displayed");
    await assertion.assertEqual(sts.deleteClassBtnDisplayed, true, "'Delete class' button not displayed");
    await assertion.assertEqual(sts.deleteClassBtnEnabled, false, "'Delete class' button should be disabled by default");
    await assertion.assertEqual(sts.tableHeadersDisplayed, true, "Class table column headers not all displayed");
    await assertion.assertEqual(sts.endedClassesHeadingDisplayed, true, "'Ended classes' section not displayed");
    await assertion.assertEqual(sts.leftNavDisplayed, true, "Left nav (Classes/Students/Staff/Library/Reports) not fully displayed");
  },

  /**
   * TST_CLST_TC_2 — Req #2: Verify the Filter modal opens and shows all filter options.
   *
   * OPEN ONLY — closing is TST_CLST_TC_23. Split on 2026-08-21: one TC doing both left the
   * report screenshot (taken at end of test) showing a CLOSED panel, so the one image that
   * should prove "all filter options are displayed" proved nothing. Ending here leaves the
   * panel open and photographed with its options on screen.
   *
   * Leaving the modal open is safe: the BeforeEach TST_CLST_TC_RESET closes it before the
   * next TC (classFilterModal.reset_filters, which gates on the panel being visible).
   */
  TST_CLST_TC_2: async function (testdata) {
    sts = await schoolClasses.click_filter();
    await assertion.assertEqual(sts.pageStatus, true, "Filter modal did not open");
    sts = await classFilterModal.getData_filterOptions();
    await assertion.assertEqual(sts.modalDisplayed, true, "Filter modal not displayed");
    await assertion.assertEqual(sts.statusOptionsDisplayed, true, "Class status options not displayed in Filter modal");
    await assertion.assertEqual(sts.labelSearchInputDisplayed, true, "'Find a label' input not displayed in Filter modal");
    await assertion.assertEqual(sts.clearAllBtnDisplayed, true, "'Clear all' button not displayed in Filter modal");
    await assertion.assertEqual(sts.applyBtnDisplayed, true, "'Apply' button not displayed in Filter modal");
  },

  /**
   * TST_CLST_TC_23 — Req #2: Verify the X button closes the Filter modal without applying
   * a filter. Split out of TST_CLST_TC_2 on 2026-08-21.
   *
   * OPENS THE MODAL ITSELF rather than inheriting TST_CLST_TC_2's. It has to: the BeforeEach
   * reset closes any open panel between TCs, so there is nothing to inherit. That also keeps
   * this TC runnable on its own and independent of whether TST_CLST_TC_2 passed (ADR-011).
   *
   * WHY FOUR ASSERTIONS, not just "the panel is gone":
   *  1. The panel must be VISIBLE first — otherwise "not visible" at the end is satisfied by a
   *     panel that never opened, and the TC could not fail. Read via getData_modalDisplayed()
   *     (isDisplayed), NOT getData_filterOptions(): the panel root stays in the DOM when
   *     closed, so its element-count reading is always true and can never fail.
   *  2. The panel is gone after ONE click. click_close() carries that contract since the 3x
   *     re-click workaround was removed (2026-08-21, X-close defect fixed).
   *  3. NO FILTER WAS APPLIED. This is the one that matters: Apply also closes the panel, so
   *     without it the TC would still pass if X silently started applying the selection.
   *  4. The class list is untouched — the same property read a second way.
   *
   * The end-of-test screenshot is WEAK here by nature (a closed panel looks identical to one
   * that never opened), which is exactly why the evidence lives in these assertions. Listed
   * directly after TST_CLST_TC_2 in the exec file so the report shows the open panel one row
   * above this result.
   */
  TST_CLST_TC_23: async function (testdata) {
    var before = await schoolClasses.getData_visibleClassRowCount();

    sts = await schoolClasses.click_filter();
    await assertion.assertEqual(sts.pageStatus, true, "Filter modal did not open");
    var openedVisible = await classFilterModal.getData_modalDisplayed();
    await assertion.assertEqual(openedVisible, true, "Filter modal was not visible before the close click");

    /*
     * The panel is not just visible but fully RENDERED - its controls are present.
     *
     * These reads were first added believing they also bought the render time the close
     * click needs. THEY DO NOT: locator.count() returns immediately, so all five together
     * cost ~20ms and the TC still failed 3/3. The wait that actually matters lives in
     * click_close() (see the settle comment there). They are kept because they assert
     * something true and cheap, not because of any timing effect.
     */
    var controls = await classFilterModal.getData_filterOptions();
    await assertion.assertEqual(controls.statusOptionsDisplayed, true, "Class status options were not rendered before the close click");
    await assertion.assertEqual(controls.applyBtnDisplayed, true, "Apply button was not rendered before the close click");

    sts = await classFilterModal.click_close();
    await assertion.assertEqual(sts.pageStatus, true, "Filter modal did not close on a single X click");

    var stillVisible = await classFilterModal.getData_modalDisplayed();
    var applied = await schoolClasses.getData_filterApplied();
    var after = await schoolClasses.getData_visibleClassRowCount();
    console.log("TC_23 →", { modalVisible: stillVisible, filterApplied: applied, rowsBefore: before.count, rowsAfter: after.count });

    await assertion.assertEqual(stillVisible, false, "Filter modal is still visible after the X click");
    await assertion.assertEqual(applied, false, "Closing with X applied a filter — the page-level Clear link is present");
    await assertion.assertEqual(after.count, before.count, "The class list changed after closing the Filter modal with X (" + before.count + " -> " + after.count + ")");
  },

  /**
   * TST_CLST_TC_3 — Req #2: Verify filtering by Class status returns only classes of that status.
   * testdata: { status }
   */
  TST_CLST_TC_3: async function (testdata) {
    // Baseline BEFORE any filtering, so the effect of Apply is observable.
    var before = await schoolClasses.getData_visibleClassRowCount();
    var beforeHeading = await schoolClasses.getData_activeClassCount();
    console.log("TC_3 BEFORE apply →", { rows: before.count, heading: beforeHeading.count });

    sts = await schoolClasses.click_filter();
    await assertion.assertEqual(sts.pageStatus, true, "Filter modal did not open");

    sts = await classFilterModal.select_status(testdata.status);
    await assertion.assertEqual(sts, true, "Class status '" + testdata.status + "' was not selected");
    console.log("TC_3 status selected:", testdata.status);

    sts = await classFilterModal.click_apply();
    console.log("TC_3 click_apply returned:", JSON.stringify(sts));
    await assertion.assertEqual(sts.pageStatus, true, "Filter modal did not close after Apply");

    // Let the filtered list re-render before reading it (third-party grid re-paint).
    await browser.pause(1000);
    var applied = await schoolClasses.getData_filterApplied();
    var after = await schoolClasses.getData_visibleClassRowCount();
    var afterHeading = await schoolClasses.getData_activeClassCount();
    console.log("TC_3 AFTER apply →", { rows: after.count, heading: afterHeading.count, filterApplied: applied });

    // 1. The app's own signal that Apply took effect (the "Clear" link only renders while a
    //    filter is applied) — this is what actually proves the filter was applied, rather
    //    than inferring it from a row count.
    await assertion.assertEqual(applied, true, "No filter appears to be applied after clicking Apply");
    // 2. Filtering by "Active" must leave the active list populated.
    await assertion.assert(after.count > 0, "No class rows were readable after applying the filter");
    // 3. Consistency with the "Active classes (N)" heading. Asserted as <= rather than ===:
    //    the tab lazy-loads via "Load more ..." (a[qid='aClass-8'], confirmed live 2026-08-15),
    //    so on a school with more active classes than one page the visible rows are a SUBSET
    //    of N. Equality held on this school (16 = 16) but would break on a larger one.
    await assertion.assert(
      typeof afterHeading.count === "number",
      "Could not read the 'Active classes (N)' heading count (raw: " + afterHeading.raw + ")"
    );
    await assertion.assert(
      after.count <= afterHeading.count,
      "Visible filtered rows (" + after.count + ") exceed the 'Active classes (N)' heading (" + afterHeading.count + ")"
    );
  },

  /**
   * TST_CLST_TC_4 — Req #2: Verify filtering by a Class label returns only classes with that label.
   * testdata: { label }
   */
  TST_CLST_TC_4: async function (testdata) {
    sts = await schoolClasses.click_filter();
    await assertion.assertEqual(sts.pageStatus, true, "Filter modal did not open");
    sts = await classFilterModal.select_label(testdata.label);
    await assertion.assertEqual(sts, true, "Class label '" + testdata.label + "' was not selected");
    sts = await classFilterModal.click_apply();
    await assertion.assertEqual(sts.pageStatus, true, "Filter modal did not close after Apply");

    await browser.pause(1000); // grid re-paint after the filter is applied
    var applied = await schoolClasses.getData_filterApplied();
    var rows = await schoolClasses.getData_visibleClassRowCount();
    var empty = await schoolClasses.getData_emptyStateDisplayed();
    console.log("TC_4 AFTER apply →", { rows: rows.count, filterApplied: applied, emptyState: empty });

    // The old assertion was `count >= 0`, which is true for every possible value — it could
    // never fail and proved nothing. A label filter may legitimately match ZERO classes
    // (verified live 2026-08-15: label "VM1" matches no ACTIVE class), so the meaningful
    // assertions are that the filter was actually applied and that the resulting list is in
    // exactly one of its two valid states — populated, or showing the empty state.
    await assertion.assertEqual(
      applied,
      true,
      "Label filter '" + testdata.label + "' does not appear to have been applied"
    );
    await assertion.assert(
      (rows.count > 0) !== empty,
      "Label-filtered list is in an inconsistent state (rows: " + rows.count + ", emptyState: " + empty + ")"
    );
  },

  /**
   * TST_CLST_TC_5 — Req #9: Verify search by class name returns the matching class.
   * testdata: { searchByName }
   */
  TST_CLST_TC_5: async function (testdata) {
    sts = await schoolClasses.search_class(testdata.searchByName);
    await assertion.assertEqual(sts.pageStatus, true, "Class list did not update after searching '" + testdata.searchByName + "'");

    var rows = await schoolClasses.getData_classRows();
    console.log("TC_5 results →", namesOf(rows));

    await assertion.assert(rows.length > 0, "Search for '" + testdata.searchByName + "' returned no classes");
    // Every returned row must actually match the term — this is what makes the search
    // assertion meaningful rather than "some rows came back".
    var term = testdata.searchByName.toLowerCase();
    var allMatch = rows.every(function (r) { return String(r.name).toLowerCase().indexOf(term) > -1; });
    await assertion.assertEqual(allMatch, true, "Search returned classes not matching '" + testdata.searchByName + "': " + JSON.stringify(namesOf(rows)));
    var exact = rows.some(function (r) { return r.name === testdata.searchByName; });
    await assertion.assertEqual(exact, true, "Expected class '" + testdata.searchByName + "' was not in the search results");
  },

  /**
   * TST_CLST_TC_6 — Req #9: Verify search by class key returns the matching class.
   * testdata: { searchByKey, searchByKeyExpectedName }
   */
  TST_CLST_TC_6: async function (testdata) {
    sts = await schoolClasses.search_class(testdata.searchByKey);
    await assertion.assertEqual(sts.pageStatus, true, "Class list did not update after searching key '" + testdata.searchByKey + "'");

    var rows = await schoolClasses.getData_classRows();
    console.log("TC_6 results →", rows);

    // A class key is unique, so this must resolve to exactly one class — asserting the
    // count is what proves the search matched the KEY rather than doing a broad text match.
    await assertion.assertEqual(rows.length, 1, "Search by class key '" + testdata.searchByKey + "' should return exactly 1 class, got " + rows.length);
    await assertion.assertEqual(rows[0].key, testdata.searchByKey, "Returned class carries the wrong class key");
    await assertion.assertEqual(rows[0].name, testdata.searchByKeyExpectedName, "Class key '" + testdata.searchByKey + "' resolved to an unexpected class");
  },

  /**
   * TST_CLST_TC_7 — Req #27: Verify sorting by Class name toggles ascending/descending.
   *
   * Deliberately does NOT assume the first click yields ascending: each click toggles, and
   * the sort survives between TCs within a session (it resets only on page load), so the
   * starting direction depends on what ran before. Instead this asserts the behaviour the
   * requirement actually describes — the direction flips, and the rows match whichever
   * direction the app reports.
   */
  TST_CLST_TC_7: async function (testdata) {
    var baseline = await schoolClasses.getData_classRows();
    await assertion.assert(baseline.length >= 2, "Need at least 2 active classes to verify sorting, found " + baseline.length);

    // ── first click ──
    sts = await schoolClasses.click_sortBy("className");
    await assertion.assertEqual(sts.pageStatus, true, "Clicking the 'Class name' header did not reorder the class list");
    var firstStatus = (await schoolClasses.getData_sortStatus()).className;
    var firstNames = namesOf(await schoolClasses.getData_classRows());
    console.log("TC_7 first click →", firstStatus, firstNames);

    await assertion.assertEqual(isSortDirection(firstStatus), true, "'Class name' column does not report a sort direction (got: " + firstStatus + ")");
    // Pin the row count across the sort. Without this the ordering assertions below could
    // pass VACUOUSLY: isSortedBy() compares adjacent pairs, so a 0- or 1-row list satisfies
    // it without comparing anything, and the reversal check would compare [] against [].
    // Sorting must reorder rows, never add or drop them — so this is a real invariant, not
    // just a guard.
    await assertion.assertEqual(firstNames.length, baseline.length, "Sorting by class name changed the number of visible classes (" + baseline.length + " → " + firstNames.length + ")");
    await assertion.assertEqual(isSortedBy(firstNames, firstStatus, compareText), true, "Class names are not in " + firstStatus + " order: " + JSON.stringify(firstNames));

    // ── second click: must toggle to the opposite direction ──
    sts = await schoolClasses.click_sortBy("className");
    await assertion.assertEqual(sts.pageStatus, true, "Second click on the 'Class name' header did not reorder the class list");
    var secondStatus = (await schoolClasses.getData_sortStatus()).className;
    var secondNames = namesOf(await schoolClasses.getData_classRows());
    console.log("TC_7 second click →", secondStatus, secondNames);

    await assertion.assertEqual(isSortDirection(secondStatus), true, "'Class name' column does not report a sort direction after the second click (got: " + secondStatus + ")");
    await assertion.assert(secondStatus !== firstStatus, "Second click did not toggle the sort direction (still '" + firstStatus + "')");
    await assertion.assertEqual(isSortedBy(secondNames, secondStatus, compareText), true, "Class names are not in " + secondStatus + " order: " + JSON.stringify(secondNames));

    // The exact-reverse check is the strongest assertion available here, but it is only VALID
    // when the visible rows are the complete set and no two names tie. Both conditions used to
    // hold on this school and both have since stopped:
    //   - the Active list paginates at 20, and the school now has more than 20 active classes,
    //     so ascending and descending show two DIFFERENT 20-row windows of a larger set - they
    //     cannot be reverses of each other (the same lazy-load caveat TST_CLST_TC_3 already
    //     respects);
    //   - another suite has created many identically-named "AutoClass_CreateOnly" classes, so
    //     names now tie and a reversal is undefined for them, exactly like the dates in TC_8.
    // Asserting it unconditionally failed on correct product behaviour (live runs 2026-08-17).
    var heading = await schoolClasses.getData_activeClassCount();
    var listComplete = firstNames.length === heading.count;
    var namesUnique = new Set(firstNames).size === firstNames.length;
    if (listComplete && namesUnique) {
      await assertion.assertEqual(
        JSON.stringify(secondNames),
        JSON.stringify(firstNames.slice().reverse()),
        "Descending order is not the exact reverse of ascending order"
      );
    } else {
      // Logged, not silently skipped: if this never runs again the reason should be visible.
      console.log("TC_7 exact-reverse check not applicable — visible " + firstNames.length +
        " of " + heading.count + " active classes, unique names: " + namesUnique);
    }
  },

  /**
   * TST_CLST_TC_8 — Req #27: Verify sorting by Start date and End date.
   *
   * Unlike class names, dates REPEAT (six active classes share "Aug 14, 2026"), so this
   * asserts monotonic ordering per direction and that the direction toggles — but not an
   * exact reversal, which ties make undefined.
   */
  TST_CLST_TC_8: async function (testdata) {
    var baseline = await schoolClasses.getData_classRows();
    await assertion.assert(baseline.length >= 2, "Need at least 2 active classes to verify sorting, found " + baseline.length);

    var columns = [
      { column: "startDate", field: "startDate", label: "Start date" },
      { column: "endDate", field: "endDate", label: "End date" }
    ];

    for (var c = 0; c < columns.length; c++) {
      var col = columns[c];
      var seen = [];

      for (var click = 1; click <= 2; click++) {
        sts = await schoolClasses.click_sortBy(col.column);
        await assertion.assertEqual(sts.pageStatus, true, "Click " + click + " on the '" + col.label + "' header did not reorder the class list");

        var status = (await schoolClasses.getData_sortStatus())[col.column];
        var rows = await schoolClasses.getData_classRows();
        var values = rows.map(function (r) { return r[col.field]; });
        console.log("TC_8 " + col.label + " click " + click + " →", status, values);

        await assertion.assertEqual(isSortDirection(status), true, "'" + col.label + "' column does not report a sort direction on click " + click + " (got: " + status + ")");
        // See TST_CLST_TC_7 — pins the row count so isSortedBy() cannot pass vacuously on an
        // empty or single-row list.
        await assertion.assertEqual(values.length, baseline.length, "Sorting by '" + col.label + "' changed the number of visible classes (" + baseline.length + " → " + values.length + ")");
        await assertion.assertEqual(isSortedBy(values, status, compareDate), true, "'" + col.label + "' values are not in " + status + " order: " + JSON.stringify(values));
        seen.push(status);
      }

      await assertion.assert(seen[0] !== seen[1], "Second click on '" + col.label + "' did not toggle the sort direction (still '" + seen[0] + "')");
    }
  },

  /**
   * TST_CLST_TC_9 — Req #18: Verify expanding a class row shows the class details.
   * testdata: { detailsRowIndex }
   */
  TST_CLST_TC_9: async function (testdata) {
    var row = testdata.detailsRowIndex;
    // Start from a known state: a previous TC may have left this row expanded.
    var before = await schoolClasses.getData_rowDetails(row);
    if (before.panelDisplayed === true) {
      sts = await schoolClasses.click_rowDetailsToggle(row, false);
      await assertion.assertEqual(sts.pageStatus, true, "Could not collapse row " + row + " to establish the starting state");
    }

    sts = await schoolClasses.click_rowDetailsToggle(row, true);
    await assertion.assertEqual(sts.pageStatus, true, "Class details panel did not open for row " + row);

    var d = await schoolClasses.getData_rowDetails(row);
    await assertion.assertEqual(d.panelDisplayed, true, "Class details panel is not displayed after expanding row " + row);
    await assertion.assertEqual(d.labelsHeadingDisplayed, true, "'Class labels' heading not shown in the expanded details");
    await assertion.assertEqual(d.materialsDisplayed, true, "Course materials column not shown in the expanded details");
    // The materials column legitimately shows EITHER chosen materials OR the empty state, so
    // assert it says one of the two rather than assuming this school's data.
    var m = String(d.materialsText);
    await assertion.assert(
      m.indexOf("Course materials") > -1 || m.indexOf("haven't chosen learning materials") > -1,
      "Materials column shows neither course materials nor the empty state: " + d.materialsText
    );
    var counts = String(d.countsText);
    await assertion.assert(counts.indexOf("Students") > -1, "Students count not shown in the expanded details: " + d.countsText);
    await assertion.assertEqual(d.toggleLabel, "Hide class details", "Row toggle should read 'Hide class details' while expanded");
  },

  /**
   * TST_CLST_TC_10 — Req #18: Verify collapsing an expanded class row hides the details.
   * testdata: { detailsRowIndex }
   */
  TST_CLST_TC_10: async function (testdata) {
    var row = testdata.detailsRowIndex;
    // Precondition per the manual TC: the row must be expanded before we collapse it.
    var before = await schoolClasses.getData_rowDetails(row);
    if (before.panelDisplayed !== true) {
      sts = await schoolClasses.click_rowDetailsToggle(row, true);
      await assertion.assertEqual(sts.pageStatus, true, "Could not expand row " + row + " to establish the precondition");
    }

    sts = await schoolClasses.click_rowDetailsToggle(row, false);
    await assertion.assertEqual(sts.pageStatus, true, "Class details panel did not collapse for row " + row);

    var d = await schoolClasses.getData_rowDetails(row);
    // Visibility, NOT element count — the panel's content stays in the DOM while collapsed.
    await assertion.assertEqual(d.panelDisplayed, false, "Class details panel is still displayed after collapsing row " + row);
    await assertion.assertEqual(d.toggleLabel, "Show class details", "Row toggle should read 'Show class details' while collapsed");
  },

  /**
   * TST_CLST_TC_11 — Req #17/#33: Verify expanding the user guide shows the help panel.
   */
  TST_CLST_TC_11: async function (testdata) {
    var before = await schoolClasses.getData_userGuide();
    if (before.panelDisplayed === true) {
      sts = await schoolClasses.click_userGuideToggle(false);
      await assertion.assertEqual(sts.pageStatus, true, "Could not collapse the user guide to establish the starting state");
    }

    sts = await schoolClasses.click_userGuideToggle(true);
    await assertion.assertEqual(sts.pageStatus, true, "User guide panel did not open");

    var g = await schoolClasses.getData_userGuide();
    await assertion.assertEqual(g.panelDisplayed, true, "User guide panel is not displayed after opening it");
    await assertion.assertEqual(g.toggleAriaLabel, "Hide the user guide", "User guide toggle should offer to hide the guide once open");
    // The guide explains searching by class name and class code — assert the content, so an
    // empty panel cannot pass.
    var text = String(g.panelText);
    await assertion.assert(text.indexOf("On this page you can") > -1, "User guide panel does not show its guidance text: " + g.panelText);
    await assertion.assert(text.indexOf("class name") > -1, "User guide does not mention searching by class name: " + g.panelText);
  },

  /**
   * TST_CLST_TC_12 — Req #17/#33: Verify collapsing the user guide hides the help panel.
   */
  TST_CLST_TC_12: async function (testdata) {
    var before = await schoolClasses.getData_userGuide();
    if (before.panelDisplayed !== true) {
      sts = await schoolClasses.click_userGuideToggle(true);
      await assertion.assertEqual(sts.pageStatus, true, "Could not open the user guide to establish the precondition");
    }

    sts = await schoolClasses.click_userGuideToggle(false);
    await assertion.assertEqual(sts.pageStatus, true, "User guide panel did not collapse");

    var g = await schoolClasses.getData_userGuide();
    await assertion.assertEqual(g.panelDisplayed, false, "User guide panel is still displayed after collapsing it");
    await assertion.assertEqual(g.toggleAriaLabel, "Open the user guide", "User guide toggle should offer to open the guide once closed");
  },

  /**
   * TST_CLST_TC_13 — Req #19: Verify launching an Active class opens the Class Page.
   * testdata: { launchRowIndex }
   *
   * Navigates away, so it returns to the Classes tab before finishing — otherwise every
   * later TC would run against the class page (ADR-011: TCs must not depend on order).
   */
  TST_CLST_TC_13: async function (testdata) {
    sts = await schoolClasses.click_className(testdata.launchRowIndex, "active");
    await assertion.assertEqual(sts.pageStatus, true, "Class Page did not load after clicking an active class name");
    await assertion.assert(
      String(sts.url).indexOf("/class/") > -1 && String(sts.url).indexOf("/view") > -1,
      "Launched URL is not a class page: " + sts.url
    );
    console.log("TC_13 launched:", sts.className, "→", sts.url);

    var back = await schoolClasses.return_toClassesTab();
    await assertion.assertEqual(back.pageStatus, true, "Could not return to the Classes tab after launching a class");
  },

  /**
   * TST_CLST_TC_14 — Req #28: Verify Active and Ended classes appear in separate sections
   * with counts.
   */
  TST_CLST_TC_14: async function (testdata) {
    // The Active section is rendered on load, so its count is readable straight away.
    var activeHeading = await schoolClasses.getData_activeClassCount();
    await assertion.assert(typeof activeHeading.count === "number", "Could not read the 'Active classes (N)' count (raw: " + activeHeading.raw + ")");

    // The Ended section exists as a separate, collapsed section from the moment the tab loads —
    // that separation is the requirement, and it holds before anything is expanded.
    var collapsed = await schoolClasses.getData_endedSection();
    await assertion.assertEqual(collapsed.headingDisplayed, true, "'Ended classes' section heading is not displayed");

    // Everything else about the Ended section is fetched WITH its rows, on expand — verified
    // live 2026-08-17: while collapsed the heading reads a bare "Ended classes" and the count
    // never arrives (polled 10s), then appears ~0.9s after expanding. So the count, the note
    // and the Class status column can only be asserted once the section is open.
    sts = await schoolClasses.expand_endedSectionIfCollapsed();
    await assertion.assertEqual(sts.pageStatus, true, "Could not expand the Ended classes section");

    var ended = await schoolClasses.getData_endedSection();
    await assertion.assert(typeof ended.count === "number", "Could not read the 'Ended classes (N)' count (raw: " + ended.headingRaw + ")");
    await assertion.assert(
      String(ended.sectionText).indexOf("automatically move into this section") > -1,
      "Ended section does not carry its explanatory note: " + ended.sectionText
    );
    // The Class status column exists in the Ended table only — it is what distinguishes the
    // two tables, so asserting it is what proves they are genuinely separate surfaces.
    await assertion.assertEqual(ended.statusColumnDisplayed, true, "Ended table does not show the 'Class status' column");
    await assertion.assert(ended.visibleRowCount > 0, "Ended section expanded but lists no classes");
  },

  /**
   * TST_CLST_TC_15 — Req #28: Verify expanding and collapsing the Ended classes section.
   *
   * The section is COLLAPSED on load and renders no rows until opened, so this drives it
   * from whatever state it is in rather than assuming one.
   */
  TST_CLST_TC_15: async function (testdata) {
    var before = await schoolClasses.getData_endedSection();
    if (before.expanded === true) {
      sts = await schoolClasses.click_endedSectionToggle(false);
      await assertion.assertEqual(sts.pageStatus, true, "Could not collapse the Ended section to establish the starting state");
    }

    // ── Open ──
    sts = await schoolClasses.click_endedSectionToggle(true);
    await assertion.assertEqual(sts.pageStatus, true, "Ended section did not expand");
    var open = await schoolClasses.getData_endedSection();
    await assertion.assertEqual(open.expanded, true, "Ended section does not report itself expanded");
    await assertion.assertEqual(open.panelDisplayed, true, "Ended section panel is not displayed after opening");
    await assertion.assertEqual(open.toggleText, "Close", "Ended section toggle should read 'Close' while open");
    await assertion.assert(open.visibleRowCount > 0, "Ended section shows no class rows when open");

    // ── Close ──
    sts = await schoolClasses.click_endedSectionToggle(false);
    await assertion.assertEqual(sts.pageStatus, true, "Ended section did not collapse");
    var closed = await schoolClasses.getData_endedSection();
    await assertion.assertEqual(closed.expanded, false, "Ended section still reports itself expanded after closing");
    await assertion.assertEqual(closed.panelDisplayed, false, "Ended section panel is still displayed after closing");
    await assertion.assertEqual(closed.toggleText, "Open", "Ended section toggle should read 'Open' while closed");
  },

  /**
   * TST_CLST_TC_16 — Req #29: Verify launching a class from the Ended section opens the
   * Class Page.
   * testdata: { endedLaunchRowIndex }
   */
  TST_CLST_TC_16: async function (testdata) {
    sts = await schoolClasses.expand_endedSectionIfCollapsed();
    await assertion.assertEqual(sts.pageStatus, true, "Could not expand the Ended classes section");

    sts = await schoolClasses.click_className(testdata.endedLaunchRowIndex, "ended");
    await assertion.assertEqual(sts.pageStatus, true, "Class Page did not load after clicking an ended class name");
    await assertion.assert(
      String(sts.url).indexOf("/class/") > -1 && String(sts.url).indexOf("/view") > -1,
      "Launched URL is not a class page: " + sts.url
    );
    console.log("TC_16 launched ended class:", sts.className, "→", sts.url);

    var back = await schoolClasses.return_toClassesTab();
    await assertion.assertEqual(back.pageStatus, true, "Could not return to the Classes tab after launching an ended class");
  },

  /**
   * TST_CLST_TC_17 — Req #20: Verify "Load more" loads additional classes.
   *
   * Reloads first: once "Load more" has run, the extra rows stay in the DOM even through a
   * collapse/re-expand (verified live), so only a fresh page restores the first-page state
   * this TC needs. That is what keeps it independent of TST_CLST_TC_20.
   */
  TST_CLST_TC_17: async function (testdata) {
    sts = await schoolClasses.reload_classesTab();
    await assertion.assertEqual(sts.pageStatus, true, "Classes tab did not reload");
    sts = await schoolClasses.expand_endedSectionIfCollapsed();
    await assertion.assertEqual(sts.pageStatus, true, "Could not expand the Ended classes section");

    var ended = await schoolClasses.getData_endedSection();
    await assertion.assertEqual(ended.loadMoreDisplayed, true, "'Load more' is not shown — the Ended section needs more classes than one page (" + ended.visibleRowCount + " of " + ended.count + ")");

    sts = await schoolClasses.click_loadMore();
    await assertion.assertEqual(sts.pageStatus, true, "'Load more' did not add any class rows (before " + sts.before + ", after " + sts.after + ")");
    await assertion.assert(sts.after > sts.before, "Visible ended rows did not increase: " + sts.before + " → " + sts.after);
    // Rows are appended, never replaced, and must not exceed the section's own count.
    await assertion.assert(sts.after <= ended.count, "More rows visible (" + sts.after + ") than the 'Ended classes (N)' heading reports (" + ended.count + ")");
  },

  // ── EDGE ─────────────────────────────────────────────────────────────────────

  /**
   * TST_CLST_TC_20 — Req #20 (Edge): Verify "Load more" no longer appears once all classes
   * are loaded.
   *
   * The manual TC left "hides vs disables" as [ASSUMED]; captured live 2026-08-17 — the link
   * is REMOVED from the DOM entirely once the last batch has loaded.
   */
  TST_CLST_TC_20: async function (testdata) {
    // Same reason as TST_CLST_TC_17: only a reload restores the not-fully-loaded state.
    sts = await schoolClasses.reload_classesTab();
    await assertion.assertEqual(sts.pageStatus, true, "Classes tab did not reload");
    sts = await schoolClasses.expand_endedSectionIfCollapsed();
    await assertion.assertEqual(sts.pageStatus, true, "Could not expand the Ended classes section");

    var ended = await schoolClasses.getData_endedSection();
    await assertion.assertEqual(ended.loadMoreDisplayed, true, "'Load more' is not shown before loading all classes — nothing to exhaust");

    var all = await schoolClasses.loadAll_endedClasses();
    console.log("TC_20 loaded all ended classes →", all);

    await assertion.assert(all.clicks > 0, "'Load more' was never clicked");
    await assertion.assertEqual(all.loadMoreDisplayed, false, "'Load more' is still shown after loading every ended class");
    // The link disappearing must mean everything is listed, not that loading broke — so tie
    // the visible rows to the section's own count.
    await assertion.assertEqual(all.rowCount, ended.count, "Ended rows listed (" + all.rowCount + ") do not match the 'Ended classes (N)' heading (" + ended.count + ")");
  },

  /**
   * TST_CLST_TC_18 — Req #9 (Edge): Verify class search is case-insensitive and matches
   * partial names.
   * testdata: { searchPartial, searchPartialExpectedName }
   *
   * The manual TC carried this as [ASSUMED]; confirmed live 2026-08-17 — searching the
   * lower-case fragment "sarthak" returns "SarthakTestClass1".
   */
  TST_CLST_TC_18: async function (testdata) {
    sts = await schoolClasses.search_class(testdata.searchPartial);
    await assertion.assertEqual(sts.pageStatus, true, "Class list did not update after searching '" + testdata.searchPartial + "'");

    var rows = await schoolClasses.getData_classRows();
    console.log("TC_18 results →", namesOf(rows));

    await assertion.assert(rows.length > 0, "Partial lower-case search '" + testdata.searchPartial + "' returned no classes");
    // Matching a name whose casing DIFFERS from the term is what proves both properties at
    // once: the match is partial (the term is a fragment) and case-insensitive.
    var expected = rows.some(function (r) { return r.name === testdata.searchPartialExpectedName; });
    await assertion.assertEqual(expected, true, "Expected '" + testdata.searchPartialExpectedName + "' from partial search '" + testdata.searchPartial + "', got " + JSON.stringify(namesOf(rows)));
    var term = testdata.searchPartial.toLowerCase();
    var allMatch = rows.every(function (r) { return String(r.name).toLowerCase().indexOf(term) > -1; });
    await assertion.assertEqual(allMatch, true, "Search returned classes not containing '" + testdata.searchPartial + "': " + JSON.stringify(namesOf(rows)));
  },

  /**
   * TST_CLST_TC_19 — Req #2 (Edge): Verify "Clear all" resets the filter selections.
   * testdata: { clearAllStatus, clearAllLabel }
   *
   * Uses its own status/label pair rather than the { status, label } used elsewhere, because
   * the two must CO-EXIST. The Class labels search only offers labels that are present on a
   * class of the currently selected status (verified live 2026-08-15), so the previous data —
   * status "Active" + label "VM1" — was unusable: no active class carries VM1 (applying that
   * combination yields "No classes that are Active, VM1"), the suggestion list stayed empty
   * and the label could never be selected. "A11y test" is offered under "Active".
   */
  TST_CLST_TC_19: async function (testdata) {
    sts = await schoolClasses.click_filter();
    await assertion.assertEqual(sts.pageStatus, true, "Filter modal did not open");
    sts = await classFilterModal.select_status(testdata.clearAllStatus);
    await assertion.assertEqual(sts, true, "Class status '" + testdata.clearAllStatus + "' was not selected");
    sts = await classFilterModal.select_label(testdata.clearAllLabel);
    await assertion.assertEqual(sts, true, "Class label '" + testdata.clearAllLabel + "' was not selected");

    // "Clear all" clears the applied filter AND closes the panel; click_clearAll verifies the
    // reset at page level (the "Clear" link disappears). It deliberately does NOT inspect the
    // panel's own chips — during the ~3.6s close the panel still holds its pre-clear DOM, so
    // the previous chip-count assertion read stale markup and could never pass.
    sts = await classFilterModal.click_clearAll();
    await assertion.assertEqual(sts.chipCleared, true, "Filter selections were not cleared by 'Clear all'");

    // And the list must be back to its unfiltered state.
    var applied = await schoolClasses.getData_filterApplied();
    await assertion.assertEqual(applied, false, "A filter is still applied after 'Clear all'");
  },

  // ── NEGATIVE ─────────────────────────────────────────────────────────────────

  /**
   * TST_CLST_TC_21 — Req #9 (Negative): Verify searching for a non-existent class shows a
   * no-results state.
   * testdata: { searchNoMatch }
   *
   * The manual TC left the copy [ASSUMED]; captured live 2026-08-17 — the app echoes the
   * term back: "No classes that match your search <term>". Asserting the echoed term (not
   * just that some empty state exists) is what ties the state to THIS search.
   */
  TST_CLST_TC_21: async function (testdata) {
    sts = await schoolClasses.search_class(testdata.searchNoMatch);
    await assertion.assertEqual(sts.pageStatus, true, "Class list did not update after searching '" + testdata.searchNoMatch + "'");

    var rows = await schoolClasses.getData_classRows();
    var emptyDisplayed = await schoolClasses.getData_emptyStateDisplayed();
    var emptyText = await schoolClasses.getData_emptyStateText();
    console.log("TC_21 →", { rows: rows.length, emptyDisplayed: emptyDisplayed, emptyText: emptyText });

    await assertion.assertEqual(rows.length, 0, "A search for a non-existent class returned " + rows.length + " classes");
    await assertion.assertEqual(emptyDisplayed, true, "No-results empty state was not shown for '" + testdata.searchNoMatch + "'");
    await assertion.assert(
      String(emptyText).indexOf("No classes that match your search") > -1,
      "Unexpected no-results copy: " + emptyText
    );
    await assertion.assert(
      String(emptyText).indexOf(testdata.searchNoMatch) > -1,
      "No-results message does not echo the search term '" + testdata.searchNoMatch + "': " + emptyText
    );
  },

  /**
   * TST_CLST_TC_22 — Req #2 (Negative): Verify a filter combination with no matches
   * shows an empty state (no error).
   * testdata: { noMatchStatus, noMatchLabel }
   */
  TST_CLST_TC_22: async function (testdata) {
    sts = await schoolClasses.click_filter();
    await assertion.assertEqual(sts.pageStatus, true, "Filter modal did not open");
    sts = await classFilterModal.select_status(testdata.noMatchStatus);
    await assertion.assertEqual(sts, true, "Class status '" + testdata.noMatchStatus + "' was not selected");
    sts = await classFilterModal.select_label(testdata.noMatchLabel);
    await assertion.assertEqual(sts, true, "Class label '" + testdata.noMatchLabel + "' was not selected");
    sts = await classFilterModal.click_apply();
    await assertion.assertEqual(sts.pageStatus, true, "Filter modal did not close after Apply");
    sts = await schoolClasses.getData_emptyStateDisplayed();
    await assertion.assertEqual(sts, true, "Empty/no-matching-classes state was not shown for a zero-match filter combo");
  }
};

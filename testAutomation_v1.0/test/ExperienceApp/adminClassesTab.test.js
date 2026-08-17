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
   * TST_CLST_TC_RESET — Before/AfterEach housekeeping, not a functional test.
   * Clears any applied Class status / label filter AND any class search, so the next TC
   * starts from the full, unfiltered list (ADR-011: TCs must not depend on what ran before
   * them). Intentionally carries no assertions — a reset must never fail the suite.
   *
   * The search reset is not belt-and-braces: the search term persists exactly like the
   * filter (verified live 2026-08-17 — it survived a full page reload), so without it the
   * search TCs would hand TST_CLST_TC_7/8 a single-row list to sort, and would leak into
   * the next run.
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
    // Close without applying so the modal doesn't stay open for the next TC's click_filter().
    // Asserted, not fire-and-forget: this call was silently returning a TimeoutError (the X
    // click landed mid-animation and never closed the panel) and the failure was masked by
    // the AfterEach reset tidying up afterwards.
    sts = await classFilterModal.click_close();
    await assertion.assertEqual(sts.pageStatus, true, "Filter modal did not close via the X button");
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
    // Class names are unique, so the reversed order must match exactly.
    await assertion.assertEqual(
      JSON.stringify(secondNames),
      JSON.stringify(firstNames.slice().reverse()),
      "Descending order is not the exact reverse of ascending order"
    );
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

  // ── EDGE ─────────────────────────────────────────────────────────────────────

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

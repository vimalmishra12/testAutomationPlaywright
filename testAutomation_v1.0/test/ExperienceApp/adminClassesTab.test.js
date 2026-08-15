"use strict";
// Admin App — Classes tab: Req #1 (tab load) + Req #2 (filter functionality).
// Manual source: test/Manual/C1App/AdminApp-Classes/AdminApp_Classes_tab_test_cases.md
// Module code: CLST (Classes Tab) — pages/ExperienceApp/schoolClasses.page.js +
// pages/ExperienceApp/classFilterModal.page.js.
var schoolClasses = require("../../pages/ExperienceApp/schoolClasses.page.js");
var classFilterModal = require("../../pages/ExperienceApp/classFilterModal.page.js");

var sts;

module.exports = {
  /**
   * TST_CLST_TC_RESET — AfterEach housekeeping, not a functional test.
   * Clears any applied Class status / label filter so the next TC starts from an
   * unfiltered list (ADR-011: TCs must not depend on what ran before them).
   * Intentionally carries no assertions — a reset must never fail the suite.
   */
  TST_CLST_TC_RESET: async function (testdata) {
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

  // ── EDGE ─────────────────────────────────────────────────────────────────────

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

"use strict";
var schoolReports = require("../../pages/ExperienceApp/schoolReports.page.js");
var sts;

/**
 * Admin App → Reports tab / Create report flow (module MRPT) — Phase 1 READ-ONLY block.
 *
 * 12 cases: TC_2, 4, 5, 8, 9, 13, 14, 18, 19, 27, 34, 40.
 *
 * ⚠️ EVERY CASE IN THIS FILE IS SIDE-EFFECT FREE. Nothing here submits the config dialog, so
 * no report is ever created on the shared school. `TST_MRPT_TC_19` and `TST_MRPT_TC_27` both
 * open the dialog and then leave it — they are safe ONLY because they never click Submit.
 * Keep that rule if you touch them.
 *
 * The nine cases that DO create real reports (TC_21–TC_26, TC_28, TC_35, TC_37) are
 * deliberately excluded and need their own data-owning suite (admin-shared.md §A7/§B7).
 *
 * ⚠️ CLEANUP IS IN BeforeEach, AND THE EXEC FILE'S AfterEach IS EMPTY BY DESIGN (ADR-019).
 * The mochawesome screenshot is taken in a ROOT afterEach, which mocha runs LAST — so an
 * AfterEach reset here would reload the page microseconds before each screenshot, and the
 * evidence for TC_9 (a filtered list) and TC_14 (a full selection) would be a picture of the
 * pristine list while the tests still reported green. That empty AfterEach is a deliberate
 * signal; do not "restore" it by symmetry with another module.
 *
 * Expected results and their evidence: admin-reports-tab.md §10 and the manual register
 * test/Manual/C1App/AdminApp-Reports/. Six of these cases had WRONG expected results in the
 * register before the 2026-09-08 live pass; the corrections are noted per case below.
 */
module.exports = {
  /**
   * BeforeEach reset — returns the class picker to its pristine state.
   *
   * A plain reload suffices because NEITHER the filter NOR the search persists on this
   * screen (§10.6). That is the opposite of the Classes tab, whose filter and search persist
   * server-side and survive the browser entirely (admin-shared.md §A4/§B7) — do not inherit
   * that reset discipline here.
   *
   * The result IS asserted: a reset that silently failed would bleed a filter into the next
   * case and produce a confusing downstream failure (Invariant 13).
   */
  TST_MRPT_TC_100: async function (testdata) {
    sts = await schoolReports.reset_classPicker();
    await assertion.assertEqual(
      sts.pageStatus,
      true,
      "Reset failed: the class-selection step did not return to its pristine state."
    );
  },

  /**
   * Before-chain step — from the Classes tab (where opening a school lands) to the Reports
   * tab, then into the class-selection step, so every case starts there.
   *
   * ⚠️ Not a manual-register case; this is suite plumbing. The register's own launch case is
   * TST_MRPT_TC_2, which repeats the click under assertion rather than trusting this.
   */
  TST_MRPT_TC_101: async function (testdata) {
    sts = await schoolReports.click_reportsTab();
    await assertion.assertEqual(sts.pageStatus, true, "The Reports tab did not open.");
    sts = await schoolReports.click_createReport();
    await assertion.assertEqual(sts.pageStatus, true, "The class-selection step did not open.");
  },

  /**
   * TC_2 — the class-selection step launches when "Create report" is clicked.
   *
   * ⚠️ Two controls carry the label "Create report" (aReport-1 header, aReport-12
   * empty-state). The page object uses the header one deliberately — see click_createReport.
   *
   * Returns to the Reports tab and performs the click ITSELF rather than inheriting the
   * Before chain's navigation, so the case actually exercises what its title claims.
   *
   * ⚠️ Returns via "Go back", NOT via the REPORTS tab link. The class-selection step renders
   * NO school tab strip at all — zero `aDetail-*` links (verified live 2026-09-08, §10.15) —
   * so `click_reportsTab` cannot work from here and times out. `click_reportsTab` is still
   * correct from the Classes tab, which is where the Before chain uses it.
   */
  TST_MRPT_TC_2: async function (testdata) {
    sts = await schoolReports.click_goBack();
    await assertion.assertEqual(sts.pageStatus, true, "'Go back' did not return to the Reports tab.");

    sts = await schoolReports.click_createReport();
    await assertion.assertEqual(
      sts.pageStatus,
      true,
      "Clicking 'Create report' did not open the class-selection step."
    );

    sts = await schoolReports.getData_classStep();

    await assertion.assert(
      /\/reports\/create$/.test(sts.url),
      "Expected the class-selection step at /reports/create, got: " + sts.url
    );
    await assertion.assert(
      /^Select classes/.test(sts.heading),
      "Expected a 'Select classes' heading, got: '" + sts.heading + "'"
    );
    await assertion.assertEqual(
      sts.searchPlaceholder,
      testdata.searchPlaceholder,
      "The class search placeholder does not match."
    );
    await assertion.assertEqual(
      sts.searchMaxLength,
      testdata.searchMaxLength,
      "The class search maxlength does not match."
    );
    await assertion.assertEqual(
      sts.filterSummary,
      testdata.unfilteredSummaryLabel,
      "The unfiltered filter summary label does not match."
    );
    await assertion.assertEqual(
      sts.selectAllDisplayed,
      true,
      "The 'Select all classes' checkbox is not displayed."
    );
    // Falsifiable: a school with no classes, or a list that never rendered, fails here.
    await assertion.assert(
      sts.rowCount > 0,
      "No class rows rendered on the class-selection step."
    );
  },

  /**
   * TC_4 — a class is returned when its full class name is searched.
   *
   * ⚠️ CORRECTED 2026-09-08. The register previously assumed the search was submit-driven
   * (inherited from the Classes tab) and required a "Search" click. It is LIVE/debounced.
   * `searchClicked` is asserted false so a regression BACK to submit-driven would fail this
   * case rather than pass silently.
   */
  TST_MRPT_TC_4: async function (testdata) {
    sts = await schoolReports.search_class(testdata.className);
    await assertion.assertEqual(sts.pageStatus, true, "The class search did not settle.");
    await assertion.assertEqual(
      sts.searchClicked,
      false,
      "The search was submitted by clicking 'Search' - this search is live/debounced (§10.5)."
    );
    await assertion.assertEqual(
      sts.rowCount,
      1,
      "Expected exactly 1 class row for the name '" + testdata.className + "', got " + sts.rowCount + "."
    );

    var rows = await schoolReports.getData_rowLabels();
    await assertion.assert(
      rows.labels[0].indexOf(testdata.className) !== -1,
      "The returned row does not name '" + testdata.className + "'. Row: " + rows.labels[0]
    );
    await assertion.assert(
      rows.labels[0].indexOf(testdata.classKey) !== -1,
      "The returned row does not carry key '" + testdata.classKey + "'. Row: " + rows.labels[0]
    );
  },

  /** TC_5 — a class is returned when its class key is searched. */
  TST_MRPT_TC_5: async function (testdata) {
    sts = await schoolReports.search_class(testdata.classKey);
    await assertion.assertEqual(sts.pageStatus, true, "The class-key search did not settle.");
    await assertion.assertEqual(
      sts.rowCount,
      1,
      "Expected exactly 1 class row for the key '" + testdata.classKey + "', got " + sts.rowCount + "."
    );

    var rows = await schoolReports.getData_rowLabels();
    await assertion.assert(
      rows.labels[0].indexOf(testdata.classKey) !== -1,
      "The returned row does not carry key '" + testdata.classKey + "'. Row: " + rows.labels[0]
    );
    await assertion.assert(
      rows.labels[0].indexOf(testdata.className) !== -1,
      "Searching the key did not return the expected class '" + testdata.className + "'. Row: " + rows.labels[0]
    );
  },

  /**
   * TC_8 — the filter panel opens with all five class statuses.
   *
   * ⚠️ CORRECTED 2026-09-08. The register said the five checkboxes were UNTICKED. All five
   * are TICKED by default, which is exactly what makes the summary read "All class statuses".
   */
  TST_MRPT_TC_8: async function (testdata) {
    sts = await schoolReports.click_filter();
    await assertion.assertEqual(sts.pageStatus, true, "The filter panel did not open.");

    var panel = await schoolReports.getData_filterPanel();
    await assertion.assertEqual(panel.headingDisplayed, true, "The 'Filter by' heading is not displayed.");
    await assertion.assertEqual(
      panel.statusCount,
      testdata.classStatuses.length,
      "Expected " + testdata.classStatuses.length + " status checkboxes, got " + panel.statusCount + "."
    );
    await assertion.assertEqual(
      panel.statusLabels.join(" | "),
      testdata.classStatuses.join(" | "),
      "The class status labels do not match."
    );
    await assertion.assertEqual(
      panel.allChecked,
      true,
      "Expected all five statuses TICKED by default, got: " + JSON.stringify(panel.statusChecked)
    );
    await assertion.assertEqual(panel.clearAllDisplayed, true, "'Clear all' is not displayed.");
    await assertion.assertEqual(panel.applyDisplayed, true, "'Apply' is not displayed.");
    await assertion.assertEqual(panel.closeDisplayed, true, "The filter panel 'Close' control is not displayed.");
    await assertion.assertEqual(
      panel.summaryLabel,
      testdata.unfilteredSummaryLabel,
      "The unfiltered summary label does not match."
    );
  },

  /**
   * TC_9 — the list narrows to one status when that status filter is applied.
   *
   * ⚠️ CORRECTED 2026-09-08. The steps are UNTICK-THE-OTHERS, not tick-one, because all five
   * start ticked; and the summary label is now known to be "1 class status" (singular).
   *
   * The exclusion assertion is what makes this case worth having: it captures the matching
   * total BEFORE filtering and requires it to DROP. On the original grounding school every
   * class was Active, so the filter could not be shown to exclude anything at all.
   */
  TST_MRPT_TC_9: async function (testdata) {
    var before = await schoolReports.getData_matchingClassTotal();

    sts = await schoolReports.click_filter();
    await assertion.assertEqual(sts.pageStatus, true, "The filter panel did not open.");

    sts = await schoolReports.apply_singleStatusFilter(testdata.filterStatus);
    await assertion.assertEqual(sts.pageStatus, true, "Applying the single-status filter failed.");
    await assertion.assertEqual(
      sts.summaryLabel,
      testdata.singleStatusSummaryLabel,
      "The filter summary label after applying one status does not match."
    );

    var rows = await schoolReports.getData_rowLabels();
    await assertion.assert(rows.rowCount > 0, "The filtered list rendered no rows at all.");
    for (var i = 0; i < rows.labels.length; i++) {
      await assertion.assert(
        new RegExp(testdata.filterStatus + "$").test(rows.labels[i]),
        "Row " + i + " is not '" + testdata.filterStatus + "': " + rows.labels[i]
      );
    }

    // The exclusion proof - falsifiable, and the reason this school was chosen.
    var after = await schoolReports.getData_matchingClassTotal();
    await assertion.assert(
      after.matchingTotal < before.matchingTotal,
      "The filter excluded nothing: " + before.matchingTotal + " classes matched before and " +
        after.matchingTotal + " after. This case cannot pass on a school where every class shares one status."
    );
  },

  /**
   * TC_13 — the selection count and footer summary update on a single tick.
   *
   * Asserts the zero-selection state FIRST, which is what makes the post-tick assertions
   * meaningful: the footer bar is genuinely ABSENT from the DOM at zero selection, not
   * disabled (admin-reports-tab.md §5), so this pair is properly falsifiable.
   */
  TST_MRPT_TC_13: async function (testdata) {
    sts = await schoolReports.search_class(testdata.className);
    await assertion.assertEqual(sts.pageStatus, true, "The class search did not settle.");

    var before = await schoolReports.getData_selectionState();
    await assertion.assertEqual(
      before.footerPresent,
      false,
      "The footer action bar exists at ZERO selection - it should be absent from the DOM entirely."
    );
    await assertion.assertEqual(
      before.headingHasCount,
      false,
      "The heading carries a '(N)' count at zero selection: '" + before.heading + "'"
    );

    sts = await schoolReports.click_selectClassByText(testdata.className);
    await assertion.assertEqual(sts.pageStatus, true, "Selecting the class row failed.");

    var after = await schoolReports.getData_selectionState();
    await assertion.assertEqual(after.selectedCount, 1, "The heading count is not (1) after one tick.");
    await assertion.assertEqual(after.footerPresent, true, "The footer action bar did not appear.");
    await assertion.assertEqual(after.continuePresent, true, "'Continue' did not appear in the footer bar.");
    await assertion.assertEqual(
      after.summaryText.indexOf(testdata.singleSelectionSummary) !== -1,
      true,
      "The footer summary does not contain '" + testdata.singleSelectionSummary + "'. Got: " + after.summaryText
    );
  },

  /**
   * TC_14 — every matching class is selected by "Select all classes".
   *
   * ⚠️ CORRECTED 2026-09-08, and this is the case the correction matters most for. "Select
   * all" selects every class MATCHING the query (110), not the rendered page (20). The
   * register's original expected result — "<N> is the number of listed classes" — would have
   * FAILED against the live product.
   *
   * ⚠️ 110 is NOT hardcoded: the school is shared and its class count churns. The count is
   * asserted against the createReport-11-N anchor total, which tracks the matching total, and
   * against `selectedCount > renderedRows`, which is what actually proves the selection
   * spans beyond the loaded page.
   */
  TST_MRPT_TC_14: async function (testdata) {
    var totals = await schoolReports.getData_matchingClassTotal();
    await assertion.assert(
      totals.loadMorePresent,
      "'Load more...' is absent, so the list is not paginated and this case cannot prove that " +
        "select-all spans beyond the rendered page. Needs a school with more than one page of classes."
    );

    sts = await schoolReports.click_selectAllClasses();
    await assertion.assertEqual(sts.pageStatus, true, "'Select all classes' did not take effect.");

    var state = await schoolReports.getData_selectionState();
    await assertion.assertEqual(
      state.selectAllChecked,
      true,
      "The 'Select all classes' checkbox is not checked."
    );
    await assertion.assertEqual(
      state.checkedRows,
      state.renderedRows,
      "Only " + state.checkedRows + " of " + state.renderedRows + " rendered rows are ticked."
    );
    await assertion.assertEqual(
      state.selectedCount,
      totals.matchingTotal,
      "The heading count (" + state.selectedCount + ") does not equal the number of matching classes (" +
        totals.matchingTotal + ")."
    );
    // The point of the case: the selection is bigger than the page.
    await assertion.assert(
      state.selectedCount > state.renderedRows,
      "The selection (" + state.selectedCount + ") does not exceed the rendered rows (" +
        state.renderedRows + ") - 'Select all' appears to cover only the loaded page."
    );
  },

  /**
   * TC_18 — Cancel on the class-selection step.
   *
   * ⚠️ REWRITTEN 2026-09-08 by user decision. The register expected this Cancel to return to
   * the Reports tab. It does NOT: it CLEARS THE SELECTION and stays on the class-selection
   * step. Reproduced twice, the second time on a fresh page load, with no dialog and no
   * backdrop, and confirmed as accepted product behaviour — not a defect (§10.8).
   *
   * The URL assertion is the important one: it pins the behaviour, so if Cancel ever DOES
   * start navigating, this case fails and the question is reopened rather than silently
   * absorbed. The control that exits is "Go back" (TST_MRPT_TC_3, Phase 1 excluded).
   */
  TST_MRPT_TC_18: async function (testdata) {
    sts = await schoolReports.search_class(testdata.className);
    await assertion.assertEqual(sts.pageStatus, true, "The class search did not settle.");

    sts = await schoolReports.click_selectClassByText(testdata.className);
    await assertion.assertEqual(sts.pageStatus, true, "Selecting the class row failed.");

    sts = await schoolReports.click_cancelSelection();
    await assertion.assertEqual(sts.pageStatus, true, "Cancel did not remove the footer action bar.");

    var after = await schoolReports.getData_selectionState();
    await assertion.assertEqual(after.checkedRows, 0, "The class is still selected after Cancel.");
    await assertion.assertEqual(
      after.headingHasCount,
      false,
      "The heading still carries a count after Cancel: '" + after.heading + "'"
    );
    await assertion.assertEqual(after.footerPresent, false, "The footer action bar is still present after Cancel.");
    await assertion.assert(
      /\/reports\/create$/.test(String(await browser.getUrl())),
      "Cancel navigated away from the class-selection step. Per §10.8 it should clear the " +
        "selection and STAY; 'Go back' is the control that exits."
    );
  },

  /**
   * TC_19 — the config dialog closes without creating a report on its own Cancel.
   *
   * ⚠️ VERIFIED 2026-09-08, resolving a long-standing [ASSUMED]: the dialog's Cancel
   * PRESERVES the class selection and resets the report type. This case could not be
   * confirmed on 2026-09-07 because the browser session was degraded — not a product fault.
   *
   * ⚠️ SIDE-EFFECT FREE ONLY BECAUSE IT NEVER CLICKS SUBMIT.
   *
   * ⚠️ Asserts the dialog is not DISPLAYED, never that it is absent — it is pre-rendered and
   * stays in the DOM at display:none (§B2).
   */
  TST_MRPT_TC_19: async function (testdata) {
    sts = await schoolReports.search_class(testdata.className);
    await assertion.assertEqual(sts.pageStatus, true, "The class search did not settle.");

    sts = await schoolReports.click_selectClassByText(testdata.className);
    await assertion.assertEqual(sts.pageStatus, true, "Selecting the class row failed.");

    sts = await schoolReports.click_continue();
    await assertion.assertEqual(sts.pageStatus, true, "The Create report dialog did not open.");

    sts = await schoolReports.select_reportType(testdata.reportType);
    await assertion.assertEqual(sts.pageStatus, true, "Choosing the report type failed.");

    sts = await schoolReports.click_cancelReportDialog();
    await assertion.assertEqual(sts.pageStatus, true, "The dialog did not close on Cancel.");

    var dialog = await schoolReports.getData_reportDialog();
    await assertion.assertEqual(dialog.dialogDisplayed, false, "The Create report dialog is still displayed.");
    await assertion.assertEqual(
      dialog.typeToggleText,
      testdata.reportTypePlaceholder,
      "The report type did not reset after Cancel."
    );

    var state = await schoolReports.getData_selectionState();
    await assertion.assertEqual(
      state.selectedCount,
      1,
      "The class selection was not preserved when the dialog was cancelled."
    );
    await assertion.assertEqual(state.footerPresent, true, "The footer action bar is gone after cancelling the dialog.");
    await assertion.assert(
      /\/reports\/create$/.test(String(await browser.getUrl())),
      "Cancelling the dialog navigated away from the class-selection step."
    );
  },

  /**
   * TC_27 — the custom date-range controls become available on a date-capable type.
   *
   * ⚠️ Submit here is disabled BOTH natively and by CSS class, so the native check is
   * truthful. That is the OPPOSITE of the staff profile's "Yes, remove", where a native
   * check is a false green (§B4). Both signals are asserted so a change either way shows.
   *
   * ⚠️ SIDE-EFFECT FREE ONLY BECAUSE IT NEVER CLICKS SUBMIT.
   */
  TST_MRPT_TC_27: async function (testdata) {
    sts = await schoolReports.search_class(testdata.className);
    await assertion.assertEqual(sts.pageStatus, true, "The class search did not settle.");
    sts = await schoolReports.click_selectClassByText(testdata.className);
    await assertion.assertEqual(sts.pageStatus, true, "Selecting the class row failed.");
    sts = await schoolReports.click_continue();
    await assertion.assertEqual(sts.pageStatus, true, "The Create report dialog did not open.");

    // Before a report type is chosen.
    var before = await schoolReports.getData_reportDialog();
    await assertion.assertEqual(
      before.fromBeginningEnabled,
      false,
      "'From the beginning' is enabled before a report type is chosen."
    );
    await assertion.assertEqual(
      before.customRangeEnabled,
      false,
      "'Custom date range' is enabled before a report type is chosen."
    );
    await assertion.assertEqual(
      before.fromBeginningSelected,
      true,
      "'From the beginning' is not pre-selected."
    );
    await assertion.assertEqual(
      before.submitNativelyDisabled,
      true,
      "Submit is not natively disabled before a report type is chosen."
    );
    await assertion.assertEqual(
      before.submitCssDisabled,
      true,
      "Submit does not carry the CSS 'disabled' class before a report type is chosen."
    );

    // After choosing a date-capable type.
    sts = await schoolReports.select_reportType(testdata.reportType);
    await assertion.assertEqual(sts.pageStatus, true, "Choosing the report type failed.");

    var after = await schoolReports.getData_reportDialog();
    await assertion.assertEqual(after.fromBeginningEnabled, true, "'From the beginning' did not become enabled.");
    await assertion.assertEqual(after.customRangeEnabled, true, "'Custom date range' did not become enabled.");
    await assertion.assertEqual(after.submitNativelyDisabled, false, "Submit did not become enabled.");

    // Selecting the custom range reveals the two date fields.
    sts = await schoolReports.select_customDateRange();
    await assertion.assertEqual(sts.pageStatus, true, "The custom date fields did not appear.");

    var dates = await schoolReports.getData_dateRange();
    await assertion.assertEqual(dates.fromDisplayed, true, "The 'From' date field is not displayed.");
    await assertion.assertEqual(dates.toDisplayed, true, "The 'To' date field is not displayed.");
    await assertion.assertEqual(dates.fromReadOnly, true, "The 'From' date field is not readOnly - the picker should be the only input path.");
    await assertion.assertEqual(dates.toReadOnly, true, "The 'To' date field is not readOnly.");
    await assertion.assert(
      dates.fromValue.length > 0 && dates.toValue.length > 0,
      "The custom date range did not default to a value. From: '" + dates.fromValue + "' To: '" + dates.toValue + "'"
    );
  },

  /**
   * TC_34 — the custom grade option is offered and unticked by default.
   *
   * ⚠️ Asserted BEFORE any report type is chosen: this checkbox does not wait for one, which
   * is what distinguishes it from the date radios in TC_27 (§3).
   *
   * ⚠️ SIDE-EFFECT FREE ONLY BECAUSE IT NEVER CLICKS SUBMIT.
   */
  TST_MRPT_TC_34: async function (testdata) {
    sts = await schoolReports.search_class(testdata.className);
    await assertion.assertEqual(sts.pageStatus, true, "The class search did not settle.");
    sts = await schoolReports.click_selectClassByText(testdata.className);
    await assertion.assertEqual(sts.pageStatus, true, "Selecting the class row failed.");
    sts = await schoolReports.click_continue();
    await assertion.assertEqual(sts.pageStatus, true, "The Create report dialog did not open.");

    var dialog = await schoolReports.getData_reportDialog();
    await assertion.assertEqual(
      dialog.gradeCheckboxEnabled,
      true,
      "The custom grade checkbox is disabled before a report type is chosen - it should be enabled from the start."
    );
    await assertion.assertEqual(
      dialog.gradeCheckboxSelected,
      false,
      "The custom grade checkbox is ticked by default - it should be unticked."
    );
    await assertion.assertEqual(
      dialog.gradeCheckboxLabel,
      testdata.customGradeLabel,
      "The custom grade checkbox label does not match."
    );
    await assertion.assertEqual(
      dialog.reportTypeCount,
      testdata.reportTypeCount,
      "Expected " + testdata.reportTypeCount + " report types, got " + dialog.reportTypeCount + "."
    );
  },

  /**
   * TC_40 — the filter offers class statuses only, and no class-label filter.
   *
   * ⚠️ REWRITTEN. This case originally asked whether the filter narrows by class LABEL,
   * taken from the other team's sheet describing a "status/label filter". Grounded live
   * 2026-09-08: the premise is FALSE — the panel offers five status checkboxes and nothing
   * else. The case is therefore inverted to PIN THAT ABSENCE, so if a label filter is ever
   * added this case fails and the register is revisited deliberately.
   *
   * The assertion is `statusCount === 5` over ALL checkboxes in the panel, which is what
   * makes "and no other group" falsifiable rather than merely unstated.
   */
  TST_MRPT_TC_40: async function (testdata) {
    sts = await schoolReports.click_filter();
    await assertion.assertEqual(sts.pageStatus, true, "The filter panel did not open.");

    var panel = await schoolReports.getData_filterPanel();
    await assertion.assertEqual(
      panel.statusCount,
      testdata.classStatuses.length,
      "The filter panel offers " + panel.statusCount + " checkboxes, expected exactly " +
        testdata.classStatuses.length + " (the class statuses). A different count means a " +
        "second filter group - most likely class labels - has been added."
    );
    await assertion.assertEqual(
      panel.statusLabels.join(" | "),
      testdata.classStatuses.join(" | "),
      "The filter panel's checkboxes are not exactly the five class statuses."
    );
  },
};

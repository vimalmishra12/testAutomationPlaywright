"use strict";
var fs = require("fs");
var path = require("path");
var action = require("../../core/actionLibrary/baseActionLibrary.js");
// Selectors resolved at load time from C1Selectors.json → css.ComproC1.schoolReports
var selectorFile = jsonParserUtil.jsonParser(selectorDir);
var sr = selectorFile.css.ComproC1.schoolReports;

/**
 * Admin App → Reports tab and the Create report flow (module MRPT).
 *
 * ⚠️ NAMING. This file is `schoolReports.page.js`, NOT the `manageReports.page.js` that
 * AGENTS.md Rule 6 and manual-test-standard.md both cite as MRPT's worked example. That
 * filename is already taken by the teacher-side class-page flow (module MRAC,
 * `manageReports.test.js`), which is a different screen entirely. The module code stays
 * `MRPT` — it is fixed across a 42-case manual register and the product-knowledge file, and
 * commit 51938b7 renamed the older module to MRAC specifically to free it. The name here
 * follows the admin-tab convention instead (`schoolStaff`, `schoolStudents`, `schoolClasses`).
 *
 * ---------------------------------------------------------------------------------------
 * TRAPS THIS PAGE OBJECT HANDLES  (evidence: admin-reports-tab.md §10, captured 2026-09-08)
 * ---------------------------------------------------------------------------------------
 *
 * 1. ROW IDS ARE POSITIONAL AND 0-BASED, AND `name` IS EMPTY.
 *    `id="checkbox-0"` / `qid="createReport-7-0"` are re-issued on every search and filter —
 *    literally Invariant 2's canonical `#checkbox-1` example. The product-knowledge file
 *    previously claimed the checkbox `name` held the class UUID; it is EMPTY on this school.
 *    → Every row is resolved by its LABEL TEXT (`rowLabelFor`), never by index.
 *
 * 2. `createReport-11-N` IS A FALSE-GREEN GENERATOR, BUT A GOOD TOTAL-COUNT ORACLE.
 *    110 anchors present, 0 visible, with 20 rows rendered. Its COUNT tracks the number of
 *    classes matching the current query (110 → 21 filtered → 1 searched).
 *    → Never counted as "rows rendered"; used only by `getData_matchingClassTotal`.
 *
 * 3. TWO CLICK CONVENTIONS ON ONE SCREEN.
 *    Row checkboxes follow admin-shared.md §B5 (the label overlays the input, click the
 *    label). The SELECT-ALL checkbox is the opposite: its label renders no text at all and
 *    has a permanent 0×0 rect, so Playwright refuses it as "not visible" — the INPUT must be
 *    clicked, and works because opacity-0 is still visible to Playwright (Invariant 1).
 *
 * 4. THE FOOTER ACTION BAR DOES NOT EXIST AT ZERO SELECTION.
 *    `createReport-13` (Cancel) and `createReport-14` (Continue) are absent from the DOM, not
 *    disabled. → `getData_selectionState` asserts ABSENCE via isExisting, never isDisplayed
 *    on a missing node.
 *
 * 5. THE SEARCH IS LIVE / DEBOUNCED, NOT SUBMIT-DRIVEN.
 *    Typing alone filters; the `Search` button is not required. The Classes tab is the
 *    opposite, and that expectation had been inherited into the register (admin-shared §A4).
 *    → `search_class` types and waits for the list to settle. It never clicks Search.
 *
 * 6. NEITHER THE FILTER NOR THE SEARCH PERSISTS.
 *    Both reset on reload — the opposite of the Classes tab's server-side persistence
 *    (admin-shared.md §A4/§B7). → `reset_classPicker` is a plain reload, and owes no
 *    server-side undo. This is also why `search_class` IS idempotent here, unlike
 *    `schoolClasses.search_class`, which must clear first (§B7).
 *
 * 7. THREE DIFFERENT "CANCEL-LIKE" CONTROLS.
 *    `createReport-1` Go back LEAVES the flow; `createReport-13` Cancel CLEARS THE SELECTION
 *    and stays; `createReport-15` Cancel closes the config dialog. Separate methods, named
 *    for what they do, so a caller cannot pick the wrong one by accident.
 *
 * 8. THE CONFIG DIALOG IS PRE-RENDERED (4 `.modal-content` on this route, 0 visible).
 *    → Every dialog check uses isDisplayed, never isExisting (§B2). The date inputs are
 *    likewise in the DOM but hidden until `Custom date range` is chosen.
 */

/**
 * Budget for any transition on this screen.
 *
 * ⚠️ Everything measured on this page on 2026-09-08 completed WITHIN ONE 100ms POLL —
 * the footer bar, the config dialog, the date radios enabling, the filter panel opening
 * and closing, and the Go back navigation all read 0 ms. The list-affecting operations
 * (select-all, apply filter, live search) had all settled by the first 1.5 s check.
 *
 * 15000 is ~10x the slowest thing observed. It is deliberately NOT larger: nothing here
 * touches the network except the initial list fetch, so a long wait would hide a bug rather
 * than absorb latency (admin-shared.md §B8, "prefer a SHORT timeout on client-side work").
 * It still leaves ample headroom under mocha's 120000, so a failure reports this method's
 * own diagnostic and not a generic timeout.
 */
var UI_TIMEOUT = 15000;

/**
 * Budget for the class list to finish rendering after a load, search or filter.
 *
 * Longer than UI_TIMEOUT because this one DOES wait on the server: the initial page load
 * fetches the class list. Measured well under 3 s on a healthy Thor, but Thor's throughput
 * varies 4-8x for identical work (§B8), so this is ~10x the observed figure.
 */
var LIST_TIMEOUT = 30000;

/**
 * Budgets for the two halves of a class search.
 *
 * The search is debounced by **~1 second** — measured 2026-09-08, the list narrowed from 20
 * rows to 1 at **994 ms** after the last keystroke.
 *
 * ⚠️ THESE ARE DELIBERATELY SMALL ENOUGH TO FAIL BEFORE MOCHA DOES. `search_class` runs both
 * waits back to back, so the pair must stay well under mocha's 120000 timeout
 * (`.mocharc.js`). The first version used LIST_TIMEOUT (30000) for BOTH halves; combined with
 * a 30 s Playwright locator stall that pushed six cases past 120 s, and mocha's generic
 * "Timeout of 120000ms exceeded" then REPLACED this method's own diagnostic — leaving no clue
 * which half had failed. That is exactly the trap admin-shared.md §B8 records ("a poll budget
 * set to exactly mocha's timeout is useless... leave headroom"), and it has now been made
 * twice in this repo.
 *
 * 15000 is ~15x the measured debounce; 5000 covers the follow-up render. Worst case ~20 s.
 */
var SEARCH_CHANGE_TIMEOUT = 15000;
var SEARCH_SETTLE_TIMEOUT = 5000;

/** Poll interval for the settle helpers below. */
var POLL_MS = 100;

/**
 * Polls until `fn()` returns true, or the budget expires.
 * Returns true on success and false on expiry — the CALLER decides whether expiry is a
 * failure, so this never swallows a problem silently (Invariant 13).
 */
async function pollUntil(fn, timeout) {
  var deadline = Date.now() + timeout;
  /* eslint-disable no-await-in-loop */
  while (Date.now() < deadline) {
    if (await fn()) return true;
    await browser.pause(POLL_MS);
  }
  /* eslint-enable no-await-in-loop */
  return await fn();
}

/** Squashes runtime whitespace so a comparison is not defeated by the product's blank lines. */
function squash(raw) {
  if (raw === null || raw === undefined || raw.message) return "";
  return String(raw).replace(/\s+/g, " ").trim();
}

module.exports = {
  // Resolves to C1Selectors.json → css.ComproC1.schoolReports.*
  reportsTabLink: sr.reportsTabLink,
  createReportBtn: sr.createReportBtn,
  createReportEmptyStateLink: sr.createReportEmptyStateLink,
  goBackLink: sr.goBackLink,
  pageComponent: sr.pageComponent,
  createReportHeading: sr.createReportHeading,
  selectClassesHeading: sr.selectClassesHeading,
  footerPanel: sr.footerPanel,
  searchInput: sr.searchInput,
  searchBtn: sr.searchBtn,
  selectAllCheckbox: sr.selectAllCheckbox,
  selectAllLabel: sr.selectAllLabel,
  rowCheckboxAll: sr.rowCheckboxAll,
  rowCheckboxChecked: sr.rowCheckboxChecked,
  filterStatusChecked: sr.filterStatusChecked,
  rowLabelAll: sr.rowLabelAll,
  listContainer: sr.listContainer,
  noRecords: sr.noRecords,
  modalCloseBtn: sr.modalCloseBtn,
  classNameAnchorAll: sr.classNameAnchorAll,
  loadMoreLink: sr.loadMoreLink,
  filterToggle: sr.filterToggle,
  filterPanelHeading: sr.filterPanelHeading,
  filterStatusAll: sr.filterStatusAll,
  filterStatusLabelAll: sr.filterStatusLabelAll,
  filterClearAllLink: sr.filterClearAllLink,
  filterApplyBtn: sr.filterApplyBtn,
  filterCloseBtn: sr.filterCloseBtn,
  filterSummaryLabel: sr.filterSummaryLabel,
  footerCancelLink: sr.footerCancelLink,
  footerContinueBtn: sr.footerContinueBtn,
  reportModal: sr.reportModal,
  reportTypeToggle: sr.reportTypeToggle,
  reportTypeOptionAll: sr.reportTypeOptionAll,
  customGradeCheckbox: sr.customGradeCheckbox,
  customGradeLabel: sr.customGradeLabel,
  rangeFromBeginningRadio: sr.rangeFromBeginningRadio,
  rangeCustomRadio: sr.rangeCustomRadio,
  rangeCustomLabel: sr.rangeCustomLabel,
  rangeLabelAll: sr.rangeLabelAll,
  dateFromInput: sr.dateFromInput,
  dateToInput: sr.dateToInput,
  modalCancelBtn: sr.modalCancelBtn,
  modalSubmitBtn: sr.modalSubmitBtn,
  successModal: sr.successModal,
  successCreateAnotherLink: sr.successCreateAnotherLink,
  successBackToReportsBtn: sr.successBackToReportsBtn,
  schoolCode: sr.schoolCode,
  reportsHeading: sr.reportsHeading,
  reportRowAll: sr.reportRowAll,
  reportDownloadAll: sr.reportDownloadAll,
  datePicker: sr.datePicker,
  datePickerCellAll: sr.datePickerCellAll,
  // Selector TEMPLATE — {{label}} resolved at call time.
  datePickerCellByLabel: sr.datePickerCellByLabel,
  datePickerSetBtn: sr.datePickerSetBtn,
  datePickerCancelBtn: sr.datePickerCancelBtn,

  /* ------------------------------------------------------------------ lifecycle */

  /**
   * Confirms the class-selection step has loaded AND its class list has rendered.
   *
   * Anchors on `h2.select-classes`, not a bare `h1` — every admin view renders an unclassed
   * `<h1>` (here it says "Create report", the same words as the config dialog's own `<h4>`),
   * so a bare `h1` would silently match the wrong thing (admin-shared.md §B9).
   *
   * ⚠️ Waits for the first ROW too, not just the heading. The heading renders before the
   * class list arrives, and every case on this screen acts on rows — returning early would
   * be the §B6 "optimistic UI" trap, where the announcement is mistaken for the thing.
   */
  isInitialized: async function () {
    await logger.logInto(await stackTrace.get());
    await action.waitForDocumentLoad();
    var headingUp = await action.waitForDisplayed(this.selectClassesHeading, UI_TIMEOUT);
    if (true != headingUp) return { pageStatus: headingUp };
    var self = this;
    var rowsUp = await pollUntil(async function () {
      return (await action.getElementCount(self.rowCheckboxAll)) > 0;
    }, LIST_TIMEOUT);
    return { pageStatus: rowsUp === true ? true : new Error("the class list did not render within " + LIST_TIMEOUT + "ms") };
  },

  /**
   * Navigates from any school tab to the REPORTS tab.
   *
   * ⚠️ Uses `aDetail-6`. The school tab family is NOT contiguous — the sequence is
   * 1, 2, 4, 5, 6 (`aDetail-3` is skipped), so never iterate it (admin-shared.md §A9).
   *
   * ⚠️ Waits on the URL, not on the tab's active class. Every tab anchor carries an
   * identical className whether active or not, so asserting on the anchor's class is a
   * guaranteed false green; the active marker lives on the parent `<li>` (§A9).
   * Measured: Reports took ~4.3 s to become active, so this uses LIST_TIMEOUT.
   */
  click_reportsTab: async function () {
    await logger.logInto(await stackTrace.get());
    var res = await action.click(this.reportsTabLink);
    if (true != res) return { pageStatus: res };
    var landed = await action.waitForUrl(/\/reports$/, LIST_TIMEOUT);
    if (true != landed) return { pageStatus: landed };
    return { pageStatus: await action.waitForDisplayed(this.createReportBtn, LIST_TIMEOUT) };
  },

  /**
   * Clicks "Create report" on the Reports tab and hands off to the class-selection step.
   *
   * ⚠️ TWO controls carry this label — the header button (`aReport-1`) and the empty-state
   * link (`aReport-12`). This method deliberately uses the HEADER one, which is present in
   * both the empty and populated states; the empty-state link only exists on a school with
   * no reports (admin-reports-tab.md §4).
   *
   * Owned by this page object rather than a Reports-tab one because the tab that owns the
   * control owns the hop into the destination — the convention `schoolStaff.click_viewProfile`
   * established.
   */
  click_createReport: async function () {
    await logger.logInto(await stackTrace.get());
    var res = await action.click(this.createReportBtn);
    if (true != res) return { pageStatus: res };
    var onStep = await action.waitForUrl(/\/reports\/create$/, UI_TIMEOUT);
    if (true != onStep) return { pageStatus: onStep };
    return await this.isInitialized();
  },

  /**
   * Returns the class picker to its pristine state before each test.
   *
   * A plain reload is CORRECT and sufficient here — unlike the Classes tab, neither the
   * filter nor the search persists server-side on this screen (admin-reports-tab.md §10.6),
   * so there is nothing to undo beyond the current DOM. Verified live: after a reload all
   * five statuses are ticked again, the summary reads "All class statuses" and the search
   * box is empty.
   *
   * ⚠️ Returns its result so a failed reset FAILS rather than bleeding state into the next
   * test (Invariant 13 — cleanup must never hide).
   */
  reset_classPicker: async function () {
    await logger.logInto(await stackTrace.get());
    var url = await browser.getUrl();
    if (!/\/reports\/create/.test(String(url))) {
      return { pageStatus: new Error("reset_classPicker called from " + url + ", not the class-selection step") };
    }
    await browser.url(String(url));
    return await this.isInitialized();
  },

  /* ------------------------------------------------------------------- reading */

  /**
   * The class-selection step's structural layout — what TST_MRPT_TC_2 asserts.
   */
  getData_classStep: async function () {
    await logger.logInto(await stackTrace.get());
    return {
      url: String(await browser.getUrl()),
      heading: squash(await action.getText(this.selectClassesHeading)),
      searchPlaceholder: String(await action.getAttribute(this.searchInput, "placeholder")),
      searchMaxLength: String(await action.getAttribute(this.searchInput, "maxlength")),
      filterSummary: squash(await action.getText(this.filterSummaryLabel)),
      selectAllDisplayed: await action.isDisplayed(this.selectAllCheckbox),
      rowCount: await action.getElementCount(this.rowCheckboxAll),
    };
  },

  /**
   * The number of classes MATCHING the current search/filter.
   *
   * ⚠️ Read from `createReport-11-N`, which is 0 VISIBLE in every state — so this must never
   * be used as a count of rendered rows (that is the §B2 false green). Its count DOES track
   * the matching total, which is the only churn-proof total on a shared school: measured
   * 110 unfiltered, 21 with the Active filter, 1 on a single-hit search (§10.4).
   */
  getData_matchingClassTotal: async function () {
    await logger.logInto(await stackTrace.get());
    return {
      matchingTotal: await action.getElementCount(this.classNameAnchorAll),
      renderedRows: await action.getElementCount(this.rowCheckboxAll),
      loadMorePresent: await action.isExisting(this.loadMoreLink),
    };
  },

  /**
   * Everything about the current selection — the heading count, the footer bar and the rows.
   *
   * ⚠️ `footerPresent` uses isExisting BY DESIGN. At zero selection the footer bar is absent
   * from the DOM entirely, not disabled (admin-reports-tab.md §5), so this is one of the rare
   * places where a presence check is the truthful assertion rather than a false green. That
   * makes "no footer at zero selection" genuinely falsifiable.
   */
  getData_selectionState: async function () {
    await logger.logInto(await stackTrace.get());
    var heading = squash(await action.getText(this.selectClassesHeading));
    var match = heading.match(/Select classes\((\d+)\)/);
    var rows = await action.getElementCount(this.rowCheckboxAll);
    // ⚠️ Counted with a `:checked` selector, NOT by looping isSelected over every row.
    // Measured 2026-09-10: isSelected costs ~0.67s per call, so a 20-row loop cost ~13s EVERY
    // time this method ran, and it runs several times per test. Across the suite that loop
    // alone accounted for ~108s of a 822s run. One count call replaces twenty.
    var checked = await action.getElementCount(this.rowCheckboxChecked);
    return {
      heading: heading,
      selectedCount: match ? Number(match[1]) : null,
      headingHasCount: match !== null,
      renderedRows: rows,
      checkedRows: checked,
      selectAllChecked: await action.isSelected(this.selectAllCheckbox),
      footerPresent: await action.isExisting(this.footerCancelLink),
      continuePresent: await action.isExisting(this.footerContinueBtn),
      summaryText: (await action.isExisting(this.footerPanel))
        ? squash(await action.getText(this.footerPanel))
        : null,
    };
  },

  /** The rendered rows' label text, one entry per row. Used to prove a filter or search narrowed the list. */
  getData_rowLabels: async function () {
    await logger.logInto(await stackTrace.get());
    var n = await action.getElementCount(this.rowCheckboxAll);
    var out = [];
    /* eslint-disable no-await-in-loop */
    for (var i = 0; i < n; i++) {
      out.push(squash(await action.getText(await action.getKthElement(this.rowLabelAll, i))));
    }
    /* eslint-enable no-await-in-loop */
    return { rowCount: n, labels: out };
  },

  /* -------------------------------------------------------------------- search */

  /**
   * Types a term into the class search and waits for the list to settle.
   *
   * ⚠️ DELIBERATELY DOES NOT CLICK "Search". This search is LIVE/debounced — the list
   * narrowed before the button was clicked during capture (§10.5). Clicking it would still
   * work, but asserting through it would hide a regression from live back to submit-driven.
   *
   * ⚠️ Uses clearValue + addValue, never setValue/fill — Angular ignores fill's value
   * (Invariant 6 / §B5).
   *
   * ⚠️ THE SEARCH IS DEBOUNCED BY ~1 SECOND. Measured 2026-09-08: the list narrowed from 20
   * rows to 1 at **994 ms** after the last keystroke. This is why the wait below is written
   * as WAIT-FOR-CHANGE and not as a stability window.
   *
   * The first version of this method polled for "the row count has not changed across 3
   * consecutive 100 ms reads" and reported success in ~300 ms — while the list was still
   * showing the PRE-SEARCH 20 rows. A stability check cannot distinguish "the filter has not
   * started yet" from "the filter has finished", so it read the old list as a settled result
   * and TC_4/TC_5 failed with 20 rows instead of 1. Textbook admin-shared.md §B6: waiting on
   * the wrong signal.
   *
   * The signal is the ROW-LABEL FINGERPRINT, not the row count — the same choice §B6
   * prescribes for sort order. A count would miss a search that returns a different set of
   * the same size; the fingerprint catches it.
   *
   * Unlike `schoolClasses.search_class` this IS idempotent — the term does not persist
   * server-side here (§10.6) and BeforeEach reloads to the unfiltered list, so the
   * fingerprint always changes for a narrowing search.
   */
  search_class: async function (term) {
    await logger.logInto(await stackTrace.get(), "term:" + term);

    var self = this;

    /**
     * ⚠️ ONE ATOMIC READ of the whole list container — never a per-row `.nth(i)` loop.
     *
     * The first fingerprint did exactly that: it read the row count (20), then looped
     * `.nth(0)…nth(19)`. The ~1 s debounce fired MID-LOOP, the list collapsed to 1 row, and
     * `.nth(4)` then blocked for Playwright's full 30 s default waiting for an element that
     * no longer existed. A few of those per test exhausted mocha's 120 s cap, and six cases
     * died reporting a generic timeout instead of this method's own diagnostic.
     *
     * The irony is the point: this fingerprint exists to detect the list changing, and the
     * old implementation could not survive the very change it was watching for. A single
     * `innerText` on `div.list-view` (verified unique, contains every row) is atomic, is one
     * call instead of 21, and cannot go stale between reads.
     *
     * NEVER index into a list that is still settling.
     *
     * ⚠️ THE MATCHING TOTAL IS PART OF THE FINGERPRINT, and it is the half that actually
     * works. The rendered page alone is not enough: `FCN-CHZ-PDA`'s unfiltered list already
     * BEGINS with the `BulkCSV_*` classes, so searching "bulkcsv" returns the same first 20
     * rows and the visible text never changes — the wait then burned its whole budget and
     * failed TC_6 and TC_16 with "the class list did not change".
     *
     * `createReport-11-N` counts every MATCHING class, not the rendered page (§10.4), so it
     * moves 110 -> 34 on that same search. Any narrowing search changes it, and BeforeEach
     * always reloads to the unfiltered list, so it is a reliable signal.
     */
    var fingerprint = async function () {
      var total = await action.getElementCount(self.classNameAnchorAll);
      var rows = await action.getElementCount(self.rowCheckboxAll);
      // ⚠️ NEVER getText the list container here. When a search matches nothing the container
      // (`div.list-view`) is REMOVED from the DOM, and Playwright's innerText then WAITS its
      // full 30 s default for an element that will never appear — on every poll. That made
      // each zero-result search cost ~90 s and was the whole reason TC_6, TC_7 and TC_12 were
      // slow. Same shape as the `.nth(4)` stall in §10.17: waiting on something that is not
      // there. Only the first row is read, and only when there IS one.
      var first = rows > 0
        ? squash(await action.getText(await action.getKthElement(self.rowLabelAll, 0)))
        : "";
      return total + "::" + rows + "::" + first;
    };

    var before = await fingerprint();

    var cleared = await action.clearValue(this.searchInput);
    if (true != cleared) return { pageStatus: cleared };
    var typed = await action.addValue(this.searchInput, term);
    if (true != typed) return { pageStatus: typed };

    var actual = String(await action.getValue(this.searchInput));
    if (actual !== term) {
      return { pageStatus: new Error("the search box holds '" + actual + "' after typing '" + term + "' - Angular dropped keystrokes (§B5)") };
    }

    // Cross the ~1s debounce: wait for the list to actually become a different list.
    var changed = await pollUntil(async function () {
      return (await fingerprint()) !== before;
    }, SEARCH_CHANGE_TIMEOUT);
    if (changed !== true) {
      return { pageStatus: new Error("the class list did not change within " + SEARCH_CHANGE_TIMEOUT + "ms of searching '" + term + "' (debounce measured at ~1s) - it still holds the pre-search rows") };
    }

    // Then let any follow-up render settle before the caller reads the list.
    var last = null;
    var stableFor = 0;
    await pollUntil(async function () {
      var fp = await fingerprint();
      if (fp === last) { stableFor++; } else { stableFor = 0; last = fp; }
      return stableFor >= 3;
    }, SEARCH_SETTLE_TIMEOUT);

    return {
      pageStatus: true,
      rowCount: await action.getElementCount(this.rowCheckboxAll),
      searchClicked: false,
    };
  },

  /* -------------------------------------------------------------------- filter */

  /** Opens the filter panel and waits for Apply to be visible (the panel is pre-rendered — §B2). */
  click_filter: async function () {
    await logger.logInto(await stackTrace.get());
    var res = await action.click(this.filterToggle);
    if (true != res) return { pageStatus: res };
    return { pageStatus: await action.waitForDisplayed(this.filterApplyBtn, UI_TIMEOUT) };
  },

  /**
   * The filter panel's contents — what TST_MRPT_TC_8 and TST_MRPT_TC_40 assert.
   *
   * `statusCount` is the assertion that PINS THE ABSENCE of a class-label filter (TC_40):
   * the panel offers exactly five checkboxes and no other group, which disproves the other
   * team's "status/label filter" description (§10 / register TC_40).
   */
  getData_filterPanel: async function () {
    await logger.logInto(await stackTrace.get());
    var n = await action.getElementCount(this.filterStatusAll);
    var labels = [];
    /* eslint-disable no-await-in-loop */
    for (var i = 0; i < n; i++) {
      labels.push(squash(await action.getText(await action.getKthElement(this.filterStatusLabelAll, i))));
    }
    /* eslint-enable no-await-in-loop */
    // Same reasoning as getData_selectionState: one `:checked` count instead of five
    // isSelected calls.
    //
    // ⚠️ Reports a COUNT, deliberately not a per-box boolean array. The count cannot say WHICH
    // boxes are ticked, and fabricating an array from it (first N = true) would be wrong the
    // moment a middle status is the ticked one — a diagnostic that lies is worse than one that
    // is absent. Every assertion here only needs "how many", so that is all it returns.
    var checkedCount = await action.getElementCount(this.filterStatusChecked);
    return {
      panelDisplayed: await action.isDisplayed(this.filterApplyBtn),
      headingDisplayed: await action.isDisplayed(this.filterPanelHeading),
      statusCount: n,
      statusLabels: labels,
      checkedCount: checkedCount,
      allChecked: n > 0 && checkedCount === n,
      clearAllDisplayed: await action.isDisplayed(this.filterClearAllLink),
      applyDisplayed: await action.isDisplayed(this.filterApplyBtn),
      closeDisplayed: await action.isDisplayed(this.filterCloseBtn),
      summaryLabel: squash(await action.getText(this.filterSummaryLabel)),
    };
  },

  /**
   * Unticks every status except `keepLabel`, leaving exactly one applied.
   *
   * ⚠️ Written as UNTICK-THE-OTHERS, not tick-one, because all five start CHECKED
   * (§10.2) — the register originally said unticked, and a tick-one implementation would
   * have selected six-of-five and filtered nothing.
   *
   * Statuses are matched by LABEL TEXT, never by the positional `status.nameN` id.
   */
  apply_singleStatusFilter: async function (keepLabel) {
    await logger.logInto(await stackTrace.get(), "keep:" + keepLabel);
    var n = await action.getElementCount(this.filterStatusAll);
    var kept = false;
    /* eslint-disable no-await-in-loop */
    for (var i = 0; i < n; i++) {
      var label = await action.getKthElement(this.filterStatusLabelAll, i);
      var text = squash(await action.getText(label));
      var box = await action.getKthElement(this.filterStatusAll, i);
      var isOn = await action.isSelected(box);
      if (text === keepLabel) {
        kept = true;
        if (true !== isOn) {
          var onRes = await action.click(label);
          if (true != onRes) return { pageStatus: onRes };
        }
      } else if (true === isOn) {
        var offRes = await action.click(label);
        if (true != offRes) return { pageStatus: offRes };
      }
    }
    /* eslint-enable no-await-in-loop */
    if (!kept) return { pageStatus: new Error("no status checkbox is labelled '" + keepLabel + "'") };

    var applied = await action.click(this.filterApplyBtn);
    if (true != applied) return { pageStatus: applied };

    // Apply CLOSES the panel — that is the observable outcome to wait on, not the click
    // returning (§B4/§B6). Measured 0 ms, but assert it rather than assume it.
    var closed = await action.waitForDisplayed(this.filterApplyBtn, UI_TIMEOUT, true);
    if (true != closed) return { pageStatus: new Error("the filter panel did not close after Apply") };

    var self = this;
    await pollUntil(async function () {
      return squash(await action.getText(self.filterSummaryLabel)) !== "All class statuses";
    }, UI_TIMEOUT);

    return { pageStatus: true, summaryLabel: squash(await action.getText(this.filterSummaryLabel)) };
  },

  /**
   * The empty state shown when nothing matches the current search and/or filter.
   *
   * ⚠️ The copy is a bare **"No results"** — it does NOT echo the search term. The register
   * assumed the Classes tab's form (`No classes that match your search <term>`) and that was
   * wrong (§11.10). There is also **no filter-specific variant**: a filter that matches nothing
   * and a search that matches nothing produce the same message.
   *
   * ⚠️ `div.list-view` is genuinely REMOVED in this state, not merely emptied — so its absence
   * is a truthful signal here, unlike most of this app (§B2).
   */
  getData_emptyState: async function () {
    await logger.logInto(await stackTrace.get());
    var present = await action.isExisting(this.noRecords);
    return {
      emptyStateShown: present,
      emptyStateText: present ? squash(await action.getText(this.noRecords)) : null,
      listViewPresent: await action.isExisting(this.listContainer),
      rowCount: await action.getElementCount(this.rowCheckboxAll),
      matchingTotal: await action.getElementCount(this.classNameAnchorAll),
    };
  },

  /**
   * Ticks EXACTLY the statuses named in `keepLabels` and applies the filter.
   *
   * The multi-status sibling of `apply_singleStatusFilter`. Same reasoning: all five start
   * CHECKED (§10.2), so this unticks everything not named rather than ticking what is.
   * Statuses are matched by LABEL TEXT, never by the positional `status.nameN` id.
   */
  apply_statusFilter: async function (keepLabels) {
    await logger.logInto(await stackTrace.get(), "keep:" + keepLabels.join("+"));
    var n = await action.getElementCount(this.filterStatusAll);
    var seen = [];
    /* eslint-disable no-await-in-loop */
    for (var i = 0; i < n; i++) {
      var label = await action.getKthElement(this.filterStatusLabelAll, i);
      var text = squash(await action.getText(label));
      var box = await action.getKthElement(this.filterStatusAll, i);
      var isOn = await action.isSelected(box);
      var want = keepLabels.indexOf(text) !== -1;
      if (want) seen.push(text);
      if (isOn !== want) {
        var res = await action.click(label);
        if (true != res) return { pageStatus: res };
      }
    }
    /* eslint-enable no-await-in-loop */
    for (var k = 0; k < keepLabels.length; k++) {
      if (seen.indexOf(keepLabels[k]) === -1) {
        return { pageStatus: new Error("no status checkbox is labelled '" + keepLabels[k] + "'") };
      }
    }

    var applied = await action.click(this.filterApplyBtn);
    if (true != applied) return { pageStatus: applied };
    var closed = await action.waitForDisplayed(this.filterApplyBtn, UI_TIMEOUT, true);
    if (true != closed) return { pageStatus: new Error("the filter panel did not close after Apply") };

    var self = this;
    await pollUntil(async function () {
      return squash(await action.getText(self.filterSummaryLabel)) !== "All class statuses";
    }, UI_TIMEOUT);

    return {
      pageStatus: true,
      summaryLabel: squash(await action.getText(this.filterSummaryLabel)),
      matchingTotal: await action.getElementCount(this.classNameAnchorAll),
    };
  },

  /**
   * Closes the report-configuration dialog with its **X** control (`crm-close`).
   *
   * ⚠️ The FOURTH dismiss-like control on this flow, and it behaves identically to the
   * dialog's Cancel — verified 2026-09-10: the selection is preserved and the report type
   * resets (§11.11). `createReport-1` leaves the flow, `createReport-13` clears the selection,
   * `createReport-15` cancels the dialog, `crm-close` closes it. Four controls, three
   * different outcomes.
   */
  click_closeReportDialog: async function () {
    await logger.logInto(await stackTrace.get());
    var res = await action.click(this.modalCloseBtn);
    if (true != res) return { pageStatus: res };
    var hidden = await action.waitForDisplayed(this.reportModal, UI_TIMEOUT, true);
    if (true != hidden) return { pageStatus: new Error("the Create report dialog was still visible " + UI_TIMEOUT + "ms after Close") };
    return { pageStatus: true };
  },

  /**
   * Opens a date picker and reports which dates it allows.
   *
   * Used by the end-date boundary case: with `From` set, the `To` picker disables every date
   * BEFORE the start date and every date after today, so its enabled window is exactly
   * `[From, today]` (§11.12). Reading the whole grid makes that assertion falsifiable in both
   * directions rather than probing one date.
   *
   * Leaves the picker CLOSED via Cancel — it is a modal and would block everything after it.
   */
  getData_datePickerWindow: async function (which) {
    await logger.logInto(await stackTrace.get(), which);
    var field = which === "from" ? this.dateFromInput : this.dateToInput;
    var opened = await action.click(field);
    if (true != opened) return { pageStatus: opened };
    var up = await action.waitForDisplayed(this.datePicker, UI_TIMEOUT);
    if (true != up) return { pageStatus: new Error("the '" + which + "' date picker did not open") };

    var n = await action.getElementCount(this.datePickerCellAll);
    var enabled = [];
    var disabled = [];
    /* eslint-disable no-await-in-loop */
    for (var i = 0; i < n; i++) {
      var cell = await action.getKthElement(this.datePickerCellAll, i);
      var lbl = await action.getAttribute(cell, "aria-label");
      var cls = String(await action.getAttribute(cell, "class"));
      if (!lbl) continue;
      if (/owl-dt-calendar-cell-disabled/.test(cls)) disabled.push(String(lbl));
      else enabled.push(String(lbl));
    }
    /* eslint-enable no-await-in-loop */

    var closed = await action.click(this.datePickerCancelBtn);
    if (true != closed) return { pageStatus: new Error("could not close the '" + which + "' date picker") };
    await action.waitForDisplayed(this.datePicker, UI_TIMEOUT, true);

    return { pageStatus: true, enabled: enabled, disabled: disabled, totalCells: n };
  },

  /**
   * Clicks "Clear all".
   *
   * ⚠️ This is a RESET, not an untick: it re-ticks all five statuses, applies IMMEDIATELY
   * with no Apply click, and closes the panel (§10.2). The register's original expectation
   * ("all five return to unticked") was wrong. This method therefore waits for the panel to
   * CLOSE, which would not happen if the product ever reverted to needing Apply.
   */
  click_clearAllFilters: async function () {
    await logger.logInto(await stackTrace.get());
    var res = await action.click(this.filterClearAllLink);
    if (true != res) return { pageStatus: res };
    var closed = await action.waitForDisplayed(this.filterApplyBtn, UI_TIMEOUT, true);
    if (true != closed) return { pageStatus: new Error("the filter panel did not close after Clear all - has it started requiring Apply?") };
    var self = this;
    await pollUntil(async function () {
      return squash(await action.getText(self.filterSummaryLabel)) === "All class statuses";
    }, UI_TIMEOUT);
    return { pageStatus: true, summaryLabel: squash(await action.getText(this.filterSummaryLabel)) };
  },

  /* ----------------------------------------------------------------- selection */

  /**
   * Ticks the row whose label contains `classText`.
   *
   * ⚠️ Resolved BY CONTENT, never by index — row ids are positional, 0-based and re-issued
   * on every search/filter, and the checkbox `name` is empty (§10.1). The label carries the
   * whole row, so filtering labels by the class name or key addresses the row uniquely.
   *
   * ⚠️ Clicks the LABEL, per admin-shared.md §B5 — the label overlays the input here. This
   * is the OPPOSITE of `click_selectAllClasses` below; see that method's note.
   */
  click_selectClassByText: async function (classText) {
    await logger.logInto(await stackTrace.get(), "class:" + classText);
    var row = action.getFilteredLocator(this.rowLabelAll, classText);
    var count = await action.getElementCount(row);
    if (count !== 1) {
      return { pageStatus: new Error("expected exactly 1 class row matching '" + classText + "', found " + count) };
    }
    var res = await action.click(row);
    if (true != res) return { pageStatus: res };
    // The footer bar appearing is the observable outcome (measured same-tick, 0 ms).
    return { pageStatus: await action.waitForDisplayed(this.footerContinueBtn, UI_TIMEOUT) };
  },

  /**
   * TOGGLES the Nth currently-rendered row, and returns whether it ended up checked.
   *
   * ⚠️ POSITIONAL ON PURPOSE, and this is the one place it is defensible. Invariant 2 forbids
   * positional ids because they get RE-ISSUED — an index cached across a search, a filter or a
   * re-sort points at a different row later. Here the index is used and discarded inside a
   * single settled list, with nothing in between that could re-order it.
   *
   * It exists because content-based resolution genuinely cannot work for the untick case:
   * `FCN-CHZ-PDA` holds many classes sharing one name (`BulkCSV_Class1` ×3+,
   * `AutoClass_CreateOnly` ×8), so "the second BulkCSV_Class1" is not expressible by text.
   * `click_selectClassByText` remains the right method wherever a name IS unique.
   *
   * ⚠️ Waits on the CHECKBOX's own state, not on the footer bar — the footer is already
   * present when unticking one of several, so waiting for it would prove nothing.
   */
  click_selectClassByIndex: async function (index) {
    await logger.logInto(await stackTrace.get(), "index:" + index);
    var n = await action.getElementCount(this.rowCheckboxAll);
    if (index < 0 || index >= n) {
      return { pageStatus: new Error("row index " + index + " is out of range - only " + n + " rows are rendered") };
    }
    var box = await action.getKthElement(this.rowCheckboxAll, index);
    var before = await action.isSelected(box);

    var res = await action.click(await action.getKthElement(this.rowLabelAll, index));
    if (true != res) return { pageStatus: res };

    var self = this;
    var flipped = await pollUntil(async function () {
      return (await action.isSelected(await action.getKthElement(self.rowCheckboxAll, index))) !== before;
    }, UI_TIMEOUT);
    if (flipped !== true) {
      return { pageStatus: new Error("row " + index + " did not change checked state (still " + before + ")") };
    }
    return { pageStatus: true, checked: !before };
  },

  /**
   * Ticks "Select all classes".
   *
   * ⚠️ Clicks the INPUT, not the label — and that is not an oversight. The select-all label
   * renders NO TEXT and has a permanent 0×0 rect, so Playwright rejects it as "element is
   * not visible"; the input is `opacity:0` but has a real 17×17 box, and opacity-0 is still
   * visible to Playwright (Invariant 1). This is the exact opposite of the row checkboxes
   * one line above, on the same screen (§10.7 — it qualifies admin-shared.md §B5).
   *
   * ⚠️ Selects EVERY MATCHING class, not the rendered page: 110 selected with 20 rows
   * rendered (§10.3). Callers must not expect selectedCount === renderedRows.
   */
  click_selectAllClasses: async function () {
    await logger.logInto(await stackTrace.get());
    var res = await action.click(this.selectAllCheckbox);
    if (true != res) return { pageStatus: res };
    var self = this;
    var settled = await pollUntil(async function () {
      return true === (await action.isSelected(self.selectAllCheckbox));
    }, UI_TIMEOUT);
    if (settled !== true) return { pageStatus: new Error("the Select all classes checkbox did not become checked within " + UI_TIMEOUT + "ms") };
    // Wait for the heading to gain its count, which is what actually proves the selection
    // model saw the click — the checkbox flipping alone would not (§8, synthetic clicks).
    await pollUntil(async function () {
      return /Select classes\(\d+\)/.test(squash(await action.getText(self.selectClassesHeading)));
    }, UI_TIMEOUT);
    return { pageStatus: true };
  },

  /* ------------------------------------------------------------------ the exits */

  /**
   * Clicks the footer bar's "Cancel" (`createReport-13`).
   *
   * ⚠️ THIS DOES NOT LEAVE THE FLOW. It CLEARS THE SELECTION and stays on the
   * class-selection step — reproduced twice, the second on a fresh page load, and confirmed
   * as accepted product behaviour on 2026-09-08 (§10.8). The register's original expectation
   * that it returns to the Reports tab was wrong and has been corrected.
   *
   * The control that leaves is `click_goBack` below. Do not swap them.
   */
  click_cancelSelection: async function () {
    await logger.logInto(await stackTrace.get());
    var res = await action.click(this.footerCancelLink);
    if (true != res) return { pageStatus: res };
    // The footer bar being REMOVED is the observable outcome. waitForDisplayed(..., true)
    // waits for it to go; the node is deleted, so this also covers the absence case.
    var gone = await pollUntil(async function () {
      return false === (await action.isExisting(sr.footerCancelLink));
    }, UI_TIMEOUT);
    if (gone !== true) return { pageStatus: new Error("the footer action bar was still present " + UI_TIMEOUT + "ms after Cancel") };
    return { pageStatus: true };
  },

  /**
   * Clicks "Go back" (`createReport-1`) — the control that actually LEAVES the flow,
   * returning to the Reports tab. Verified 2026-09-08 (§10.8).
   */
  click_goBack: async function () {
    await logger.logInto(await stackTrace.get());
    var res = await action.click(this.goBackLink);
    if (true != res) return { pageStatus: res };
    return { pageStatus: await action.waitForUrl(/\/reports$/, UI_TIMEOUT) };
  },

  /* ------------------------------------------------------- the config dialog */

  /** Clicks "Continue" and waits for the config dialog to become VISIBLE (it is pre-rendered — §B2). */
  click_continue: async function () {
    await logger.logInto(await stackTrace.get());
    var res = await action.click(this.footerContinueBtn);
    if (true != res) return { pageStatus: res };
    return { pageStatus: await action.waitForDisplayed(this.reportModal, UI_TIMEOUT) };
  },

  /**
   * The config dialog's control states — what TST_MRPT_TC_27 and TST_MRPT_TC_34 assert.
   *
   * ⚠️ `submitNativelyDisabled` reads the real `disabled` property. On THIS dialog Submit is
   * disabled both natively AND by the CSS class, so a native check is truthful — the
   * opposite of the staff profile's "Yes, remove", where CSS-only disabling makes the same
   * check a false green (§10.10 / §B4). Both are reported so a regression either way shows.
   */
  getData_reportDialog: async function () {
    await logger.logInto(await stackTrace.get());
    var submitCls = String(await action.getAttribute(this.modalSubmitBtn, "class"));
    return {
      dialogDisplayed: await action.isDisplayed(this.reportModal),
      typeToggleText: squash(await action.getText(this.reportTypeToggle)),
      reportTypeCount: await action.getElementCount(this.reportTypeOptionAll),
      submitNativelyDisabled: !(await action.isEnabled(this.modalSubmitBtn)),
      submitCssDisabled: /(^|\s)disabled(\s|$)/.test(submitCls),
      fromBeginningEnabled: await action.isEnabled(this.rangeFromBeginningRadio),
      fromBeginningSelected: await action.isSelected(this.rangeFromBeginningRadio),
      customRangeEnabled: await action.isEnabled(this.rangeCustomRadio),
      customRangeSelected: await action.isSelected(this.rangeCustomRadio),
      gradeCheckboxEnabled: await action.isEnabled(this.customGradeCheckbox),
      gradeCheckboxSelected: await action.isSelected(this.customGradeCheckbox),
      gradeCheckboxLabel: squash(await action.getText(this.customGradeLabel)),
      dateFieldsDisplayed: await action.isDisplayed(this.dateFromInput),
    };
  },

  /** Opens the report-type dropdown and picks the option whose text is `typeName`. */
  select_reportType: async function (typeName) {
    await logger.logInto(await stackTrace.get(), "type:" + typeName);
    var opened = await action.click(this.reportTypeToggle);
    if (true != opened) return { pageStatus: opened };
    var option = action.getFilteredLocator(this.reportTypeOptionAll, typeName);
    var n = await action.getElementCount(option);
    if (n !== 1) return { pageStatus: new Error("expected exactly 1 report type matching '" + typeName + "', found " + n) };
    var picked = await action.click(option);
    if (true != picked) return { pageStatus: picked };
    var self = this;
    var settled = await pollUntil(async function () {
      return squash(await action.getText(self.reportTypeToggle)) === typeName;
    }, UI_TIMEOUT);
    if (settled !== true) return { pageStatus: new Error("the report type toggle never showed '" + typeName + "'") };
    return { pageStatus: true };
  },

  /** Selects "Custom date range" and waits for the From/To fields to become visible. */
  select_customDateRange: async function () {
    await logger.logInto(await stackTrace.get());
    var res = await action.click(this.rangeCustomLabel);
    if (true != res) return { pageStatus: res };
    return { pageStatus: await action.waitForDisplayed(this.dateFromInput, UI_TIMEOUT) };
  },

  /** The custom date fields' values and constraints. Both are readOnly — the picker is the only input path (§3). */
  getData_dateRange: async function () {
    await logger.logInto(await stackTrace.get());
    return {
      fromDisplayed: await action.isDisplayed(this.dateFromInput),
      toDisplayed: await action.isDisplayed(this.dateToInput),
      fromValue: String(await action.getValue(this.dateFromInput)),
      toValue: String(await action.getValue(this.dateToInput)),
      fromReadOnly: (await action.getAttribute(this.dateFromInput, "readonly")) !== null,
      toReadOnly: (await action.getAttribute(this.dateToInput, "readonly")) !== null,
      rangeLabels: await (async function (self) {
        var n = await action.getElementCount(self.rangeLabelAll);
        var out = [];
        /* eslint-disable no-await-in-loop */
        for (var i = 0; i < n; i++) out.push(squash(await action.getText(await action.getKthElement(self.rangeLabelAll, i))));
        /* eslint-enable no-await-in-loop */
        return out;
      })(this),
    };
  },

  /**
   * Clicks the config dialog's "Cancel" (`createReport-15`).
   *
   * ⚠️ This is the THIRD Cancel-like control on the flow and closes only the dialog. It
   * PRESERVES the class selection and resets the report type (§10.9) — verified 2026-09-08,
   * resolving a long-standing [ASSUMED].
   *
   * ⚠️ Waits for the dialog to become INVISIBLE, not to leave the DOM — it is pre-rendered
   * and stays at display:none (§B2).
   */
  click_cancelReportDialog: async function () {
    await logger.logInto(await stackTrace.get());
    var res = await action.click(this.modalCancelBtn);
    if (true != res) return { pageStatus: res };
    var hidden = await action.waitForDisplayed(this.reportModal, UI_TIMEOUT, true);
    if (true != hidden) return { pageStatus: new Error("the Create report dialog was still visible " + UI_TIMEOUT + "ms after Cancel") };
    return { pageStatus: true };
  },

  /* ===================================================================================== */
  /* REPORT-CREATING half (data-owning suite). Everything below CREATES REAL DATA.          */
  /*                                                                                        */
  /* ⚠️ A SUCCESSFULLY CREATED REPORT CANNOT BE DELETED FROM THE UI. Verified live           */
  /*    2026-09-10: the report row's ONLY control is Download (`aReport-2-N`). The           */
  /*    `Remove from the reports list` button (`aReport-9`) lives inside                     */
  /*    `#reportCreationFailedModal` and applies to FAILED reports only.                     */
  /*                                                                                        */
  /*    So there is NO cleanup method here, and its absence is deliberate — not an           */
  /*    oversight to be "fixed" later. Every run leaves its reports on the school for 60     */
  /*    days. This is why the creating suite lives on the automation-only school             */
  /*    VED-NEH-KVU and NEVER on the shared FCN-CHZ-PDA (admin-shared.md §A7).               */
  /* ===================================================================================== */

  /**
   * Reads the school context the browser is currently in.
   *
   * ⚠️ Exists because a SINGLE-school admin never sees "My school accounts", so the usual
   * `TST_SADB_TC_1` ("open the school by key") cannot run and the school is never explicitly
   * chosen. The admin-shared.md §0 rule — *always identify a school by KEY, never by name or
   * position* — still has to be honoured, so the key is READ BACK from the page instead of
   * being selected. If the account ever lands on a different school, the caller fails loudly
   * rather than silently creating reports in the wrong place.
   */
  getData_schoolContext: async function () {
    await logger.logInto(await stackTrace.get());
    await action.waitForDisplayed(this.schoolCode, LIST_TIMEOUT);
    return {
      url: String(await browser.getUrl()),
      schoolKey: squash(await action.getText(this.schoolCode)),
    };
  },

  /**
   * Sets a custom date-range bound using the calendar picker.
   *
   * ⚠️ BOTH date inputs are `readOnly` — the picker is the ONLY input path, so `addValue`
   * and `setValue` are both useless here (admin-reports-tab.md §3).
   *
   * ⚠️ THE `Set` BUTTON IS MANDATORY. Clicking a calendar cell alone selects it visually but
   * does NOT commit the value and leaves the picker open — measured live 2026-09-10: after
   * clicking the Sep 2 cell the field still read `Fri, Sep 4, 2026`. Only after `Set` did it
   * become `Wed, Sep 2, 2026` and the picker close. A test that skipped `Set` would submit
   * the DEFAULT window while appearing to have chosen one.
   *
   * ⚠️ Cells are addressed by their `aria-label` (the full date, e.g. "Sep 2, 2026"), never
   * by index — the grid is 42 cells spanning three months and re-flows per month (Invariant 2).
   *
   * @param {string} which  "from" or "to"
   * @param {string} ariaDate  the cell's aria-label, e.g. "Sep 2, 2026"
   */
  set_dateRangeBound: async function (which, ariaDate) {
    await logger.logInto(await stackTrace.get(), which + ":" + ariaDate);
    var field = which === "from" ? this.dateFromInput : this.dateToInput;

    var opened = await action.click(field);
    if (true != opened) return { pageStatus: opened };
    var pickerUp = await action.waitForDisplayed(this.datePicker, UI_TIMEOUT);
    if (true != pickerUp) return { pageStatus: new Error("the date picker did not open for the '" + which + "' field") };

    // ⚠️ Matched on the ATTRIBUTE, not with getFilteredLocator. That helper filters by
    // hasText, and a calendar cell's TEXT is just the day number ("7") — the full date lives
    // only in `aria-label`. Filtering by text found 0 cells and failed TC_28 on run 2.
    var cell = this.datePickerCellByLabel.replace("{{label}}", ariaDate);
    var n = await action.getElementCount(cell);
    if (n !== 1) {
      return { pageStatus: new Error("expected exactly 1 calendar cell for '" + ariaDate + "', found " + n + " - is the picker showing a different month, or is that date disabled?") };
    }
    var picked = await action.click(cell);
    if (true != picked) return { pageStatus: picked };

    // Commit. Without this the value silently stays at its previous setting.
    var set = await action.click(this.datePickerSetBtn);
    if (true != set) return { pageStatus: set };
    var closed = await action.waitForDisplayed(this.datePicker, UI_TIMEOUT, true);
    if (true != closed) return { pageStatus: new Error("the date picker did not close after Set") };

    var actual = String(await action.getValue(field));
    if (actual.indexOf(ariaDate) === -1) {
      return { pageStatus: new Error("the '" + which + "' field reads '" + actual + "' after choosing '" + ariaDate + "' - the Set click did not commit") };
    }
    return { pageStatus: true, value: actual };
  },

  /**
   * Submits the report-configuration dialog. ⚠️ THIS CREATES A REAL REPORT.
   *
   * Waits for the success dialog to become VISIBLE — it is pre-rendered (`#reportEmailModal`),
   * so presence proves nothing (§B2). Measured live 2026-09-10: the dialog appeared within the
   * first 100 ms poll, i.e. the app does not wait for generation before confirming.
   */
  click_submitReport: async function () {
    await logger.logInto(await stackTrace.get());
    var res = await action.click(this.modalSubmitBtn);
    if (true != res) return { pageStatus: res };
    var up = await action.waitForDisplayed(this.successModal, UI_TIMEOUT);
    if (true != up) return { pageStatus: new Error("the success dialog did not appear after Submit - was the report created?") };
    return { pageStatus: true };
  },

  /** The success dialog's copy and controls — what the creating TCs assert after Submit. */
  getData_successDialog: async function () {
    await logger.logInto(await stackTrace.get());
    return {
      displayed: await action.isDisplayed(this.successModal),
      text: squash(await action.getText(this.successModal)),
      createAnotherDisplayed: await action.isDisplayed(this.successCreateAnotherLink),
      backToReportsDisplayed: await action.isDisplayed(this.successBackToReportsBtn),
    };
  },

  /** Leaves the success dialog via "Back to Reports" and waits for the Reports list. */
  click_backToReports: async function () {
    await logger.logInto(await stackTrace.get());
    var res = await action.click(this.successBackToReportsBtn);
    if (true != res) return { pageStatus: res };
    var landed = await action.waitForUrl(/\/reports$/, LIST_TIMEOUT);
    if (true != landed) return { pageStatus: landed };
    var self = this;
    var listed = await pollUntil(async function () {
      return /Reports \(\d+\)/.test(squash(await action.getText(self.reportsHeading)));
    }, LIST_TIMEOUT);
    if (listed !== true) return { pageStatus: new Error("the Reports heading did not render after Back to Reports") };
    return { pageStatus: true };
  },

  /**
   * Waits until the NEWEST report row offers a Download control.
   *
   * ⚠️ Report generation is ASYNCHRONOUS. Submit returns immediately and the row appears
   * straight away, but its `Download` button only renders once the file exists. On run 2 the
   * list held 2 rows and 1 Download — the just-created report was still generating — and an
   * assertion of "every row is downloadable" failed for a reason that was not a defect.
   *
   * ⚠️ Scoped to the TOP row on purpose. A whole-list assertion also depends on rows this
   * suite did not create (earlier runs, manual tests), whose state it cannot control — that is
   * what made the original check fragile rather than strict.
   *
   * Budget is LIST_TIMEOUT: generation was seconds in manual capture (2.8 KB), but this is the
   * one genuinely server-side wait on the screen and Thor's throughput varies 4-8x (§B8).
   */
  waitFor_newestReportDownloadable: async function () {
    await logger.logInto(await stackTrace.get());
    var self = this;
    var ok = await pollUntil(async function () {
      if ((await action.getElementCount(self.reportRowAll)) === 0) return false;
      var top = await action.getKthElement(self.reportRowAll, 0);
      return (await action.getElementCount(top.locator("button[qid^='aReport-2-']"))) > 0;
    }, LIST_TIMEOUT);
    if (ok !== true) {
      return { pageStatus: new Error("the newest report row still offers no Download control after " + LIST_TIMEOUT + "ms - generation may have failed") };
    }
    return { pageStatus: true };
  },

  /**
   * Downloads the NEWEST report and returns its parsed contents.
   *
   * ⚠️ THE DOWNLOAD IS A ZIP CONTAINING ONE CSV PER PRODUCT COMPONENT — not a single file.
   * Captured from a real download 2026-09-10 (§13): a `Class summary` report over a class on
   * one 3-component product produced three CSVs, named
   * `<product> <component>_<DD-MMM-YYYY>_<report type> report.csv`.
   *
   * ⚠️ Every CSV carries a UTF-8 BOM. It is stripped before parsing, exactly as
   * `createClasses.page.js` does for the downloaded class template — without that the first
   * header reads `﻿First name` and every column lookup misses.
   *
   * Unzipping uses `jszip`, now a DECLARED dependency. It was already on disk as a transitive
   * dependency of `exceljs`, but relying on that would break these tests the day exceljs
   * changed its own internals — an unrelated cause for an unrelated failure.
   *
   * Returns one entry per CSV so the caller can assert across all of them.
   */
  download_newestReport: async function (saveDir) {
    await logger.logInto(await stackTrace.get());
    var JSZip = require("jszip");
    var parseCsv = require("csv-parse/lib/sync");

    var dir = saveDir || path.join(process.cwd(), "output", "downloads", "reports");
    var top = await action.getKthElement(this.reportRowAll, 0);
    if (!top) return { pageStatus: new Error("there is no report row to download") };

    var res = await action.downloadFile(top.locator("button[qid^='aReport-2-']"), dir);
    if (!res || res.downloaded !== true) {
      return { pageStatus: res instanceof Error ? res : new Error("the report download did not start or did not complete") };
    }

    var buf;
    try {
      buf = fs.readFileSync(res.filePath);
    } catch (err) {
      return { pageStatus: new Error("the downloaded report could not be read from " + res.filePath + ": " + err.message) };
    }
    if (!buf.length) return { pageStatus: new Error("the downloaded report is 0 bytes: " + res.filePath) };

    var zip;
    try {
      zip = await JSZip.loadAsync(buf);
    } catch (err) {
      return { pageStatus: new Error("the downloaded report is not a readable ZIP (" + res.fileName + "): " + err.message) };
    }

    var names = Object.keys(zip.files).filter(function (n) {
      return !zip.files[n].dir && /\.csv$/i.test(n);
    });

    var files = [];
    /* eslint-disable no-await-in-loop */
    for (var i = 0; i < names.length; i++) {
      var text = await zip.files[names[i]].async("string");
      text = text.replace(/^﻿/, "");                       // strip the BOM
      var rows = parseCsv(text, { columns: true, skip_empty_lines: true, bom: true });
      var headers = parseCsv(text, { to_line: 1, skip_empty_lines: true })[0] || [];
      files.push({ name: names[i], headers: headers, rows: rows });
    }
    /* eslint-enable no-await-in-loop */

    return {
      pageStatus: true,
      zipName: res.fileName,
      zipPath: res.filePath,
      zipBytes: buf.length,
      csvCount: files.length,
      files: files,
    };
  },

  /**
   * The Reports tab's list state.
   *
   * ⚠️ `reportRowAll` is `div.list-view div.list-items` — the FOURTH screen in this app to use
   * `.list-items` (staff list, staff-profile classes, the class picker, and now this). It is
   * only unambiguous because the Reports LIST route renders no class picker; do not reuse this
   * key on `/reports/create` (§B3).
   */
  getData_reportsList: async function () {
    await logger.logInto(await stackTrace.get());
    var heading = squash(await action.getText(this.reportsHeading));
    var m = heading.match(/Reports \((\d+)\)/);
    var n = await action.getElementCount(this.reportRowAll);

    // ⚠️ Reads ONLY the newest row, never the whole list — this is a cost decision, not a
    // convenience one. Created reports CANNOT be deleted (see the header), so this list grows
    // by 8 on every run and never shrinks inside the 60-day window. The first version looped
    // getText over every row and the suite went from 116 s to 385 s between two runs purely
    // because the list had grown from ~8 rows to ~16. Left alone it would keep degrading, and
    // eventually hit mocha's timeout for a reason unrelated to the product.
    //
    // Nothing here needs the older rows: the assertions are the heading count and the newest
    // report's own contents.
    var topRow = n > 0 ? squash(await action.getText(await action.getKthElement(this.reportRowAll, 0))) : null;

    return {
      heading: heading,
      headingCount: m ? Number(m[1]) : null,
      rowCount: n,
      topRow: topRow,
    };
  },
};

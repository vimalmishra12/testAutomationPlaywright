"use strict";
var action = require("../../core/actionLibrary/baseActionLibrary.js");
// Selectors resolved at load time from C1Selectors.json → css.ComproC1.schoolStudents
var selectorFile = jsonParserUtil.jsonParser(selectorDir);
var ss = selectorFile.css.ComproC1.schoolStudents;
// Captured by isInitialized() so a TC that navigates away (profile, bulk screens) can
// return here. The URL embeds the school's org slug, so it cannot be a constant.
var studentsTabUrl = null;

/**
 * PAGE SIZE of the student list, measured live 2026-08-28 on FCN-CHZ-PDA: the tab loads
 * 20 rows and one "Load more ..." click brought the total to 27 (the school's full roll).
 */
var PAGE_SIZE = 20;

/**
 * Reads a cheap fingerprint of the currently listed students: row count + the first and
 * last row's text. Used to detect that the list has actually re-rendered after a search,
 * a sort or a Load more.
 *
 * WHY a fingerprint and not the sort-status label — the Classes tab measured the same
 * effect (schoolClasses.page.js) and the Students tab behaves identically: the header's
 * "sorted ascending"/"sorted descending" label is OPTIMISTIC UI that flips well before the
 * server responds, while the ROWS re-order at ~2-3.5s (measured 2026-08-28). Waiting on
 * the label and then reading the rows reads the PREVIOUS order.
 */
async function readListSignature() {
  var count = await action.getElementCount(ss.studentRow);
  if (typeof count !== "number") return "UNREADABLE";
  if (count === 0) return "EMPTY:0";
  var first = await action.getText(ss.rowLastNameByIndex.replace("{{n}}", "0"));
  var last = await action.getText(ss.rowLastNameByIndex.replace("{{n}}", String(count - 1)));
  // getText returns an Error object rather than throwing (ADR-009), and a row can vanish
  // mid-poll while the list re-renders. Coerce either way — a CHANGED signature is all we need.
  return count + "|" + String(first && first.message ? "ERR" : first) +
    "|" + String(last && last.message ? "ERR" : last);
}

/**
 * Polls until the listed students differ from `previous`, or the budget expires.
 * Returns true if the list changed, false on timeout.
 *
 * Budget 20s. Measured worst case is ~3.5s (sort) / ~2s (search) / ~4s (load more)
 * on 2026-08-28, so this is ~5x headroom — a measurement, not an inherited guess
 * (ARCHITECTURE-INVARIANTS Invariant 1).
 */
async function waitForListChange(previous, timeoutMs) {
  var deadline = Date.now() + (timeoutMs || 20000);
  while (Date.now() < deadline) {
    if ((await readListSignature()) !== previous) return true;
    await browser.pause(250); // polling interval — nothing observable to wait on between polls
  }
  return false;
}

/**
 * Resolves a student's 0-based ROW INDEX from their visible content.
 *
 * WHY this exists: row identifiers are POSITIONAL (`aLearner-15-<index>`,
 * `learner-cell-*-<index>`) and shift with sort, search and Load more
 * (admin-students-tab.md §4). Never hard-code an index — look it up by content first,
 * then act on the index you got back.
 *
 * Matching is done against the row action button's aria-label, which is the one place
 * that carries every column plus the account type, e.g.
 *   "Row4 Adult Learner Last name student First name Marvin Jae
 *    Email address or Username nonmqastudent5@mailsac.com Action Menu"
 *
 * Returns the index, or -1 when no row matches.
 */
async function findRowIndexByText(needle) {
  var count = await action.getElementCount(ss.rowActionMenuAll);
  if (typeof count !== "number") return -1;
  for (var i = 0; i < count; i++) {
    var label = await action.getAttribute(ss.rowActionMenuByIndex.replace("{{n}}", String(i)), "aria-label");
    if (label && !label.message && String(label).toLowerCase().indexOf(String(needle).toLowerCase()) >= 0) {
      return i;
    }
  }
  return -1;
}

module.exports = {
  // Resolves to C1Selectors.json → css.ComproC1.schoolStudents.*
  leftNavStudents: ss.leftNavStudents,
  studentsHeading: ss.studentsHeading,
  studentsCount: ss.studentsCount,
  searchBanner: ss.searchBanner,
  searchBannerTerm: ss.searchBannerTerm,
  searchInput: ss.searchInput,
  searchBtn: ss.searchBtn,
  clearSearchLink: ss.clearSearchLink,
  activationCheckbox: ss.activationCheckbox,
  activationCheckboxLabel: ss.activationCheckboxLabel,
  activationHelperPanel: ss.activationHelperPanel,
  activationHelperLines: ss.activationHelperLines,
  manageStudentsDropdown: ss.manageStudentsDropdown,
  addNewStudentsLink: ss.addNewStudentsLink,
  addExistingStudentsLink: ss.addExistingStudentsLink,
  activateCourseMaterialsLink: ss.activateCourseMaterialsLink,
  userGuideToggleCollapsed: ss.userGuideToggleCollapsed,
  userGuideToggleExpanded: ss.userGuideToggleExpanded,
  userGuidePanel: ss.userGuidePanel,
  userGuidePanelLines: ss.userGuidePanelLines,
  userGuidePanelBullets: ss.userGuidePanelBullets,
  selectAllCheckbox: ss.selectAllCheckbox,
  selectedCounterLabel: ss.selectedCounterLabel,
  removeFromSchoolBtn: ss.removeFromSchoolBtn,
  sortByLastNameBtn: ss.sortByLastNameBtn,
  sortByFirstNameBtn: ss.sortByFirstNameBtn,
  sortByEmailUsernameBtn: ss.sortByEmailUsernameBtn,
  sortStatusLastName: ss.sortStatusLastName,
  sortStatusFirstName: ss.sortStatusFirstName,
  sortStatusEmailUsername: ss.sortStatusEmailUsername,
  sortHeaderRow: ss.sortHeaderRow,
  studentRow: ss.studentRow,
  loadMoreLink: ss.loadMoreLink,
  noRecordsMessage: ss.noRecordsMessage,
  rowCheckbox: ss.rowCheckbox,
  // Selector TEMPLATES ({{n}} = the row's 0-based index) — resolved per row at call time.
  rowActionMenuByIndex: ss.rowActionMenuByIndex,
  rowActionMenuAll: ss.rowActionMenuAll,
  rowActionMenuPanelByIndex: ss.rowActionMenuPanelByIndex,
  rowMenuViewProfileByIndex: ss.rowMenuViewProfileByIndex,
  rowMenuActivateMaterialsByIndex: ss.rowMenuActivateMaterialsByIndex,
  rowLastNameByIndex: ss.rowLastNameByIndex,
  rowFirstNameByIndex: ss.rowFirstNameByIndex,
  rowEmailByIndex: ss.rowEmailByIndex,
  rowCheckboxByIndex: ss.rowCheckboxByIndex,

  /**
   * Confirms the school's Students tab (…/org_<slug>/learner) has loaded.
   *
   * Anchors on `learner h2` — the heading INSIDE the <learner> component, which is
   * unique to this view (count 1, verified live 2026-08-28). A bare `h2` would match the
   * wrong view: every admin tab renders one (Phase 1 Step 0 — "verify the page-scoping
   * anchor; any view in a SPA can render an unclassed heading").
   */
  isInitialized: async function () {
    var res;
    await logger.logInto(await stackTrace.get());
    await action.waitForDocumentLoad();
    res = {
      pageStatus: await action.waitForDisplayed(this.studentsHeading)
    };
    // Remember where the Students tab lives so a TC that opens a profile or a bulk screen
    // can come back. The URL embeds the school's org slug, so it cannot be a constant.
    if (true === res.pageStatus) studentsTabUrl = await browser.getUrl();
    return res;
  },

  /**
   * Navigates Classes tab → Students tab via the left nav.
   *
   * Uses the qid, NOT `a:has-text("Students")` — that text also matches a HIDDEN help
   * link ("Adding students to a class", qid `cHeader-hlp-6`) which resolves first and
   * fails the click with "element is not visible" (found live 2026-08-28;
   * admin-students-tab.md §7.4). The existing schoolClasses.leftNavStudents still carries
   * the ambiguous form.
   */
  click_studentsTab: async function () {
    await logger.logInto(await stackTrace.get());
    var clickStatus = await action.click(this.leftNavStudents);
    if (true !== clickStatus) return { clickStatus: clickStatus };
    return { clickStatus: clickStatus, pageStatus: (await this.isInitialized()).pageStatus };
  },

  // ── Tab-load layout ──────────────────────────────────────────────────────────────

  /**
   * One read of everything TST_SLST_TC_1 asserts about the loaded tab.
   *
   * Every control is checked with isDisplayed, never getElementCount — FOUR modals are
   * pre-rendered into this page with nothing open (`removeLearnerWarningModal`,
   * `maxLearnerSelectedModal`, `removeLearnerDelayModal`, `changeSchoolKey`), so a
   * presence check is a guaranteed false green (admin-shared.md §B2).
   */
  getData_studentsTabLayout: async function () {
    await logger.logInto(await stackTrace.get());
    return {
      url: await browser.getUrl(),
      headingText: await action.getText(this.studentsHeading),
      searchInputDisplayed: await action.isDisplayed(this.searchInput),
      searchPlaceholder: await action.getAttribute(this.searchInput, "placeholder"),
      searchBtnDisplayed: await action.isDisplayed(this.searchBtn),
      activationCheckboxDisplayed: await action.isDisplayed(this.activationCheckbox),
      manageStudentsDisplayed: await action.isDisplayed(this.manageStudentsDropdown),
      selectAllDisplayed: await action.isDisplayed(this.selectAllCheckbox),
      selectedCounterText: await action.getText(this.selectedCounterLabel),
      // Natively disabled at 0 selected — an ATTRIBUTE check, not a CSS-class one.
      removeBtnEnabled: await action.isEnabled(this.removeFromSchoolBtn),
      userGuideToggleDisplayed: await action.isDisplayed(this.userGuideToggleCollapsed),
      sortLastNameDisplayed: await action.isDisplayed(this.sortByLastNameBtn),
      sortFirstNameDisplayed: await action.isDisplayed(this.sortByFirstNameBtn),
      sortEmailUsernameDisplayed: await action.isDisplayed(this.sortByEmailUsernameBtn),
      rowCount: await action.getElementCount(this.studentRow)
    };
  },

  /**
   * The heading's student count as a NUMBER, or null when a search is active.
   *
   * While a search is applied the count `<span>` is REPLACED by the result banner
   * `<small>` (verified live 2026-08-28), so "no count" is a meaningful state, not a
   * failure. Never assert an ABSOLUTE count — FCN-CHZ-PDA is shared and actively mutated
   * (26 on 2026-08-22, 27 on 2026-08-28; admin-shared.md §A5).
   */
  getData_studentCount: async function () {
    await logger.logInto(await stackTrace.get());
    if (!(await action.isExisting(this.studentsCount))) return null;
    var raw = await action.getText(this.studentsCount);
    if (!raw || raw.message) return null;
    var m = String(raw).match(/(\d+)/);
    return m ? Number(m[1]) : null;
  },

  // ── Search ───────────────────────────────────────────────────────────────────────

  /**
   * Types a term and submits it.
   *
   * Search is SUBMIT-DRIVEN — typing alone does not filter (this is what TST_SLST_TC_9
   * proves), so the Search click is required. `clearValue` first because the box is not
   * idempotent across calls; `addValue` (pressSequentially) rather than setValue/fill so
   * the Angular form control actually registers the input.
   *
   * @param {string} term
   * @param {object} [options]
   * @param {boolean} [options.expectListChange=true] - set FALSE when the search is
   *   expected to return the SAME list it already shows (a whitespace-only term is
   *   trimmed to nothing and returns everything — TST_SLST_TC_11). The row fingerprint
   *   can never change in that case, so waiting on it burns the entire 20s budget and
   *   then continues anyway: a silent 20s tax that looks like nothing at all. Measured
   *   at 20.5s vs ~1s for the other search TCs on the 2026-08-28 run. The Classes suite
   *   carries the same scar. In that mode we wait for the SEARCH BANNER instead, which
   *   is the honest "the search was applied" signal when the rows cannot move.
   */
  search_student: async function (term, options) {
    var expectListChange = !(options && options.expectListChange === false);
    await logger.logInto(await stackTrace.get(), "term:" + term + " expectListChange:" + expectListChange);
    var before = await readListSignature();
    await action.clearValue(this.searchInput);
    await action.addValue(this.searchInput, term);
    var clickStatus = await action.click(this.searchBtn);
    if (true !== clickStatus) return { clickStatus: clickStatus };
    if (expectListChange) {
      return { clickStatus: clickStatus, listChanged: await waitForListChange(before) };
    }
    return {
      clickStatus: clickStatus,
      listChanged: false,
      bannerApplied: await action.waitForDisplayed(this.searchBanner)
    };
  },

  /** Types into the search box WITHOUT submitting — TST_SLST_TC_9 only. */
  type_searchTermOnly: async function (term) {
    await logger.logInto(await stackTrace.get(), "term:" + term);
    await action.clearValue(this.searchInput);
    return { setStatus: await action.addValue(this.searchInput, term) };
  },

  /** Clears an active search via the banner's Clear link, restoring the full list. */
  clear_search: async function () {
    await logger.logInto(await stackTrace.get());
    if (!(await action.isExisting(this.clearSearchLink))) return { clickStatus: "NO_SEARCH_ACTIVE" };
    var before = await readListSignature();
    var clickStatus = await action.click(this.clearSearchLink);
    if (true !== clickStatus) return { clickStatus: clickStatus };
    return { clickStatus: clickStatus, listChanged: await waitForListChange(before) };
  },

  /**
   * The search-result banner state. While a search is active the heading reads
   * "Students / Showing search results for <term>. / Clear" and the count disappears.
   */
  getData_searchBanner: async function () {
    await logger.logInto(await stackTrace.get());
    var active = await action.isExisting(this.searchBanner);
    return {
      bannerDisplayed: active ? await action.isDisplayed(this.searchBanner) : false,
      bannerText: active ? await action.getText(this.searchBanner) : null,
      // The term is echoed VERBATIM, preserving its case.
      echoedTerm: (active && (await action.isExisting(this.searchBannerTerm)))
        ? await action.getText(this.searchBannerTerm) : null,
      clearDisplayed: (await action.isExisting(this.clearSearchLink))
        ? await action.isDisplayed(this.clearSearchLink) : false,
      countDisplayed: await action.isExisting(this.studentsCount),
      searchBoxValue: await action.getValue(this.searchInput)
    };
  },

  /**
   * The no-results empty state.
   *
   * NOTE — this asserts FIXED behaviour. Until at least 2026-08-22 a no-match search
   * rendered NOTHING (table removed, no message) and threw a TypeError from the admin
   * bundle; that defect was re-checked on 2026-08-28 and is GONE. The message now renders
   * in `div.no-records > p.mb-0` with zero console errors (admin-students-tab.md §7.3).
   * Do not re-introduce the defect expectation.
   */
  getData_noResultsState: async function () {
    await logger.logInto(await stackTrace.get());
    var present = await action.isExisting(this.noRecordsMessage);
    return {
      messageDisplayed: present ? await action.isDisplayed(this.noRecordsMessage) : false,
      messageText: present ? await action.getText(this.noRecordsMessage) : null,
      rowCount: await action.getElementCount(this.studentRow),
      // The table AND its sort header row are removed in this state — that part is unchanged.
      sortHeaderPresent: await action.isExisting(this.sortHeaderRow)
    };
  },

  // ── "Who activated the code in my school?" ───────────────────────────────────────

  /**
   * Toggles the activation checkbox.
   *
   * Clicks the LABEL, not the input: it is a Bootstrap custom-control whose real <input>
   * is visually hidden, so clicking the input itself is unreliable.
   *
   * ⚠️ This checkbox is a SEARCH-MODE SWITCH, not a list filter. It re-points the search
   * box at 16-character activation codes and reveals two helper lines; the LIST IS NOT
   * FILTERED and must not change (verified live 2026-08-28 — the DOM names it
   * `name="activation-code-search"`; admin-students-tab.md §7.5). So this method
   * deliberately does NOT wait for a list change: there isn't one, and waiting for one
   * would burn the full timeout on every call.
   */
  click_activationCheckbox: async function () {
    await logger.logInto(await stackTrace.get());
    var clickStatus = await action.click(this.activationCheckboxLabel);
    if (true !== clickStatus) return { clickStatus: clickStatus };
    // The helper panel is added/removed synchronously with the toggle; a short settle is
    // enough. Measured: the two <p> lines render immediately on click.
    await browser.pause(1000);
    return { clickStatus: clickStatus };
  },

  /** State of the activation checkbox and the helper text it reveals. */
  getData_activationSearchMode: async function () {
    await logger.logInto(await stackTrace.get());
    var helperPresent = await action.isExisting(this.activationHelperPanel);
    var lines = [];
    if (helperPresent) {
      // Read the panel's text once and split, rather than walking each <p> — getText
      // returns the container's rendered innerText, and the two lines are separate
      // paragraphs so they arrive newline-separated.
      var raw = await action.getText(this.activationHelperPanel);
      if (raw && !raw.message) {
        lines = String(raw).split("\n").map(function (s) { return s.trim(); })
          .filter(function (s) { return s.length > 0; });
      }
    }
    return {
      checked: await action.isSelected(this.activationCheckbox),
      // The panel is genuinely ABSENT from the DOM when unticked, not merely hidden.
      helperPanelPresent: helperPresent,
      helperLines: lines
    };
  },

  // ── Sort ─────────────────────────────────────────────────────────────────────────

  /**
   * Clicks a sort header and waits for the ROWS to re-order.
   * @param {string} column - "lastName" | "firstName" | "emailUsername"
   */
  click_sortBy: async function (column) {
    await logger.logInto(await stackTrace.get(), "column:" + column);
    var map = {
      lastName: this.sortByLastNameBtn,
      firstName: this.sortByFirstNameBtn,
      emailUsername: this.sortByEmailUsernameBtn
    };
    if (!map[column]) return { clickStatus: "UNKNOWN_COLUMN:" + column };
    var before = await readListSignature();
    var clickStatus = await action.click(map[column]);
    if (true !== clickStatus) return { clickStatus: clickStatus };
    return { clickStatus: clickStatus, listChanged: await waitForListChange(before) };
  },

  /**
   * The three columns' sort-status labels.
   *
   * Read by stable ID, which sidesteps a documented trap: the Email/Username column's
   * status span sits OUTSIDE its header button (unlike the other two), so reading that
   * button's own text returns the bare label. All three ids were verified live
   * 2026-08-28. Absent id = that column does not currently own the sort.
   */
  getData_sortStatus: async function () {
    await logger.logInto(await stackTrace.get());
    var read = async function (sel) {
      if (!(await action.isExisting(sel))) return null;
      var t = await action.getText(sel);
      return t && t.message ? null : String(t).trim();
    };
    return {
      lastName: await read(this.sortStatusLastName),
      firstName: await read(this.sortStatusFirstName),
      emailUsername: await read(this.sortStatusEmailUsername)
    };
  },

  // ── Rows ─────────────────────────────────────────────────────────────────────────

  /**
   * Every listed student as {lastName, firstName, emailOrUsername, accountType}.
   * accountType comes from the row's accessible name — the ONLY place Adult/Child is
   * exposed on this list (there is no visible badge).
   */
  getData_studentRows: async function () {
    await logger.logInto(await stackTrace.get());
    var count = await action.getElementCount(this.rowActionMenuAll);
    if (typeof count !== "number") return [];
    var rows = [];
    for (var i = 0; i < count; i++) {
      var label = await action.getAttribute(this.rowActionMenuByIndex.replace("{{n}}", String(i)), "aria-label");
      var text = function (v) { return v && v.message ? null : (v === null ? null : String(v).trim()); };
      rows.push({
        index: i,
        lastName: text(await action.getText(this.rowLastNameByIndex.replace("{{n}}", String(i)))),
        firstName: text(await action.getText(this.rowFirstNameByIndex.replace("{{n}}", String(i)))),
        emailOrUsername: text(await action.getText(this.rowEmailByIndex.replace("{{n}}", String(i)))),
        accountType: (label && !label.message && /Child Learner/i.test(label)) ? "Child"
          : (label && !label.message && /Adult Learner/i.test(label)) ? "Adult" : null
      });
    }
    return rows;
  },

  /** Number of student rows currently rendered. */
  getData_visibleRowCount: async function () {
    await logger.logInto(await stackTrace.get());
    return await action.getElementCount(this.studentRow);
  },

  /** 0-based index of the first row whose accessible name contains `needle`, or -1. */
  getData_rowIndexByText: async function (needle) {
    await logger.logInto(await stackTrace.get(), "needle:" + needle);
    return await findRowIndexByText(needle);
  },

  /**
   * Opens one row's action menu, resolving the row BY CONTENT.
   *
   * The menu items (`View student profile`, `Activate course materials`) are pre-rendered
   * once per row — 20 rows meant 20 copies of `a[qid='aLearner-83']`, ALL sharing that one
   * qid, so a bare presence or count check on it is a guaranteed false green
   * (admin-students-tab.md §4). This scopes every item to `#learnerActionsMenu-<index>`,
   * which IS unique per row, so the ambiguity never arises.
   */
  click_rowActionMenu: async function (studentIdentifier) {
    await logger.logInto(await stackTrace.get(), "student:" + studentIdentifier);
    var idx = await findRowIndexByText(studentIdentifier);
    if (idx < 0) return { clickStatus: "STUDENT_NOT_FOUND:" + studentIdentifier, rowIndex: -1 };
    var clickStatus = await action.click(this.rowActionMenuByIndex.replace("{{n}}", String(idx)));
    if (true !== clickStatus) return { clickStatus: clickStatus, rowIndex: idx };
    var panel = this.rowActionMenuPanelByIndex.replace("{{n}}", String(idx));
    return {
      clickStatus: clickStatus,
      rowIndex: idx,
      menuDisplayed: await action.waitForDisplayed(panel),
      viewProfileDisplayed: await action.isDisplayed(this.rowMenuViewProfileByIndex.replace("{{n}}", String(idx))),
      activateDisplayed: await action.isDisplayed(this.rowMenuActivateMaterialsByIndex.replace("{{n}}", String(idx)))
    };
  },

  // ── User guide ───────────────────────────────────────────────────────────────────

  /**
   * Expands the user guide.
   *
   * The toggle is a DIFFERENT ELEMENT in each state — `aLearner-11` ("User guide") when
   * collapsed, `aLearner-12` ("Hide") when expanded — so a page object bound to one of
   * them breaks the other half of the toggle test (admin-students-tab.md §4).
   */
  click_expandUserGuide: async function () {
    await logger.logInto(await stackTrace.get());
    var clickStatus = await action.click(this.userGuideToggleCollapsed);
    if (true !== clickStatus) return { clickStatus: clickStatus };
    return { clickStatus: clickStatus, panelStatus: await action.waitForDisplayed(this.userGuidePanel) };
  },

  /** Collapses the user guide via the EXPANDED-state toggle (`aLearner-12`, "Hide"). */
  click_collapseUserGuide: async function () {
    await logger.logInto(await stackTrace.get());
    var clickStatus = await action.click(this.userGuideToggleExpanded);
    if (true !== clickStatus) return { clickStatus: clickStatus };
    // The panel is GENUINELY REMOVED from the DOM when collapsed — one of the few admin
    // containers that is — so wait for it to disappear (reverse=true).
    return { clickStatus: clickStatus, panelRemoved: await action.waitForDisplayed(this.userGuidePanel, 10000, true) };
  },

  /** User-guide state: which toggle is present, and the panel's bullet lines. */
  getData_userGuide: async function () {
    await logger.logInto(await stackTrace.get());
    var open = await action.isExisting(this.userGuidePanel);
    var lines = [];
    if (open) {
      // One read of the bullet container, split on newlines — same reasoning as
      // getData_activationSearchMode: each bullet is its own <p>, so they arrive
      // newline-separated and no per-element locator walk is needed.
      var raw = await action.getText(this.userGuidePanelBullets);
      if (raw && !raw.message) {
        lines = String(raw).split("\n").map(function (s) { return s.trim(); })
          .filter(function (s) { return s.length > 0; });
      }
    }
    return {
      panelPresent: open,
      collapsedTogglePresent: await action.isExisting(this.userGuideToggleCollapsed),
      expandedTogglePresent: await action.isExisting(this.userGuideToggleExpanded),
      panelLines: lines
    };
  },

  // ── Load more ────────────────────────────────────────────────────────────────────

  /**
   * Clicks "Load more ..." and waits for the extra students to be appended.
   * Returns rowsBefore/rowsAfter so a TC can assert growth without an absolute count.
   */
  click_loadMore: async function () {
    await logger.logInto(await stackTrace.get());
    if (!(await action.isExisting(this.loadMoreLink))) return { clickStatus: "LOAD_MORE_ABSENT" };
    var before = await readListSignature();
    var rowsBefore = await action.getElementCount(this.studentRow);
    var clickStatus = await action.click(this.loadMoreLink);
    if (true !== clickStatus) return { clickStatus: clickStatus };
    var changed = await waitForListChange(before);
    return {
      clickStatus: clickStatus,
      listChanged: changed,
      rowsBefore: rowsBefore,
      rowsAfter: await action.getElementCount(this.studentRow)
    };
  },

  /**
   * Whether "Load more ..." is offered.
   *
   * Reports PRESENCE, not enabled-state: the link is REMOVED from the DOM once the list is
   * exhausted, never disabled (verified live 2026-08-28 — 20 → 27 rows, then gone). A TC
   * asserting "disabled" would never fail.
   */
  getData_loadMoreAvailable: async function () {
    await logger.logInto(await stackTrace.get());
    return await action.isExisting(this.loadMoreLink);
  },

  /** The measured page size (20), so TCs express intent instead of a magic number. */
  getData_pageSize: function () {
    return PAGE_SIZE;
  },

  /**
   * Reloads the Students tab. Used by TST_SLST_TC_19 to prove the chosen sort is NOT
   * retained (confirmed live 2026-08-28 — the list returns to First name ascending).
   */
  reload_studentsTab: async function () {
    await logger.logInto(await stackTrace.get());
    await browser.refresh();
    return { pageStatus: (await this.isInitialized()).pageStatus };
  },

  /** Navigates back to the Students tab after a TC has left it. */
  return_toStudentsTab: async function () {
    await logger.logInto(await stackTrace.get());
    if (!studentsTabUrl) return { pageStatus: "NO_URL_CAPTURED" };
    await browser.url(studentsTabUrl);
    return { pageStatus: (await this.isInitialized()).pageStatus };
  }
};

"use strict";
var action = require("../../core/actionLibrary/baseActionLibrary.js");
// Selectors resolved at load time from C1Selectors.json → css.ComproC1.schoolStaff
var selectorFile = jsonParserUtil.jsonParser(selectorDir);
var sf = selectorFile.css.ComproC1.schoolStaff;
// Captured by isInitialized() so a TC that navigates away (a staff profile, the invitation
// form) can return here. The URL embeds the school's org slug, so it cannot be a constant.
var staffTabUrl = null;

/**
 * PAGE SIZE of the staff list, measured live 2026-09-02 on FCN-CHZ-PDA: the tab loads
 * 20 rows and one "Load more ..." click brought the total to 21, after which the link was
 * REMOVED from the DOM (admin-staff-tab.md §2).
 */
var PAGE_SIZE = 20;

/**
 * Reads a cheap fingerprint of the currently listed staff: row count + the first and last
 * row's last name. Used to detect that the list has actually re-rendered after a search,
 * a sort or a Load more.
 *
 * WHY a fingerprint and not the sort-status label — the Classes and Students tabs both
 * measured the same effect and the Staff tab behaves identically: the header's
 * "sorted ascending"/"sorted descending" label is OPTIMISTIC UI that flips well before the
 * server responds, while the ROWS re-order at ~0.8-4.1s (measured 2026-09-02). Waiting on
 * the label and then reading the rows reads the PREVIOUS order.
 */
async function readListSignature() {
  var count = await action.getElementCount(sf.staffRow);
  if (typeof count !== "number") return "UNREADABLE";
  if (count === 0) return "EMPTY:0";
  var first = await action.getText(sf.rowLastNameByIndex.replace("{{n}}", "0"));
  var last = await action.getText(sf.rowLastNameByIndex.replace("{{n}}", String(count - 1)));
  // getText returns an Error object rather than throwing (ADR-009), and a row can vanish
  // mid-poll while the list re-renders. Coerce either way — a CHANGED signature is all we need.
  return count + "|" + String(first && first.message ? "ERR" : first) +
    "|" + String(last && last.message ? "ERR" : last);
}

/**
 * Polls until the listed staff differ from `previous`, or the budget expires.
 * Returns true if the list changed, false on timeout.
 *
 * Budget 20s. Measured worst case on 2026-09-02 is ~4.1s (Role sort) / ~3.4s (no-match
 * search) / ~1.1s (load more), so this is ~5x headroom — a measurement, not an inherited
 * guess (ARCHITECTURE-INVARIANTS Invariant 1).
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
 * Resolves a staff member's 0-based ROW INDEX from their visible content.
 *
 * WHY this exists: row identifiers are POSITIONAL (`aAdmin-16-<index>`,
 * `staff-cell-*-<index>`) and shift with sort, search and Load more
 * (admin-staff-tab.md §4). Never hard-code an index — look it up by content first, then
 * act on the index you got back.
 *
 * Matching is done against the row button's aria-label, which is the one place carrying
 * every column at once, e.g.
 *   "Row2 Teacher Last name 21aug First name teacherdev
 *    Email address teacherdev21aug4@mailsac.com Role Teacher Action Menu"
 *
 * ⚠️ The aria row NUMBER is offset by two (index 0 renders "Row2" — Row1 is the header),
 * so never map the aria number onto the index.
 *
 * Returns the index, or -1 when no row matches.
 */
async function findRowIndexByText(needle) {
  var count = await action.getElementCount(sf.rowActionMenuAll);
  if (typeof count !== "number") return -1;
  for (var i = 0; i < count; i++) {
    var label = await action.getAttribute(sf.rowActionMenuByIndex.replace("{{n}}", String(i)), "aria-label");
    if (label && !label.message && String(label).toLowerCase().indexOf(String(needle).toLowerCase()) >= 0) {
      return i;
    }
  }
  return -1;
}

module.exports = {
  // Resolves to C1Selectors.json → css.ComproC1.schoolStaff.*
  leftNavStaff: sf.leftNavStaff,
  staffHeading: sf.staffHeading,
  staffCount: sf.staffCount,
  searchBanner: sf.searchBanner,
  searchBannerTerm: sf.searchBannerTerm,
  searchInput: sf.searchInput,
  searchBtn: sf.searchBtn,
  clearSearchLink: sf.clearSearchLink,
  manageStaffDropdown: sf.manageStaffDropdown,
  addNewTeachersLink: sf.addNewTeachersLink,
  userGuideToggleCollapsed: sf.userGuideToggleCollapsed,
  userGuideToggleExpanded: sf.userGuideToggleExpanded,
  userGuidePanel: sf.userGuidePanel,
  userGuidePanelBullets: sf.userGuidePanelBullets,
  sortByLastNameBtn: sf.sortByLastNameBtn,
  sortByFirstNameBtn: sf.sortByFirstNameBtn,
  sortByEmailBtn: sf.sortByEmailBtn,
  sortByRoleBtn: sf.sortByRoleBtn,
  sortStatusLastName: sf.sortStatusLastName,
  sortStatusFirstName: sf.sortStatusFirstName,
  sortStatusEmail: sf.sortStatusEmail,
  sortStatusRole: sf.sortStatusRole,
  sortHeaderRow: sf.sortHeaderRow,
  staffRow: sf.staffRow,
  loadMoreLink: sf.loadMoreLink,
  noRecordsMessage: sf.noRecordsMessage,
  // Selector TEMPLATES ({{n}} = the row's 0-based index) — resolved per row at call time.
  rowActionMenuAll: sf.rowActionMenuAll,
  rowActionMenuByIndex: sf.rowActionMenuByIndex,
  rowMenuViewProfileByIndex: sf.rowMenuViewProfileByIndex,
  rowLastNameByIndex: sf.rowLastNameByIndex,
  rowFirstNameByIndex: sf.rowFirstNameByIndex,
  rowEmailByIndex: sf.rowEmailByIndex,
  rowRoleByIndex: sf.rowRoleByIndex,

  /**
   * Confirms the school's Staff tab (…/org_<slug>/staff) has loaded.
   *
   * Anchors on `staff h2` — the heading INSIDE the <staff> component, which is unique to
   * this view (verified live 2026-09-02: the h2's ancestor chain is h2 › div › staff ›
   * … › admin › app). A bare `h2` would match the wrong view: every admin tab renders one
   * (Phase 1 Step 0 — "verify the page-scoping anchor").
   */
  isInitialized: async function () {
    var res;
    await logger.logInto(await stackTrace.get());
    await action.waitForDocumentLoad();
    res = {
      pageStatus: await action.waitForDisplayed(this.staffHeading)
    };
    // Remember where the Staff tab lives so a TC that leaves it can come back. The URL
    // embeds the school's org slug, so it cannot be a constant.
    if (true === res.pageStatus) staffTabUrl = await browser.getUrl();
    return res;
  },

  /**
   * Navigates Classes tab → Staff tab via the left nav.
   *
   * Uses the qid `aDetail-4`, NOT `a:has-text("Staff")` — the Students tab suite was bitten
   * by a hidden help link matching its text form (admin-students-tab.md §7.4), and the same
   * class of ambiguity applies here.
   */
  click_staffTab: async function () {
    await logger.logInto(await stackTrace.get());
    var clickStatus = await action.click(this.leftNavStaff);
    if (true !== clickStatus) return { clickStatus: clickStatus };
    return { clickStatus: clickStatus, pageStatus: (await this.isInitialized()).pageStatus };
  },

  /**
   * The heading's staff count as a NUMBER, or null when a search is active.
   *
   * While a search is applied the count `<span>` is REPLACED by the result banner `<small>`
   * (verified live 2026-09-02), so "no count" is a meaningful state, not a failure.
   *
   * ⚠️ Never assert an ABSOLUTE count. FCN-CHZ-PDA is shared and actively mutated — the
   * heading read 23 on 2026-08-24 and 22 on 2026-09-02 (admin-shared.md §A5). It also
   * DISAGREES with the rendered row count (21 both times): a known, unexplained product
   * defect covered by TST_STFL_TC_26, which is out of Phase 1 scope.
   */
  getData_staffCount: async function () {
    await logger.logInto(await stackTrace.get());
    if (!(await action.isExisting(this.staffCount))) return null;
    var raw = await action.getText(this.staffCount);
    if (!raw || raw.message) return null;
    var m = String(raw).match(/(\d+)/);
    return m ? Number(m[1]) : null;
  },

  // ── Search ───────────────────────────────────────────────────────────────────────

  /**
   * Types a term and submits it.
   *
   * Search is SUBMIT-DRIVEN — typing alone does not filter (admin-staff-tab.md §2), so the
   * Search click is required. `clearValue` first because the box is not idempotent across
   * calls; `addValue` (pressSequentially) rather than setValue/fill so the Angular form
   * control actually registers the input (ADR-013).
   *
   * @param {string} term
   * @param {object} [options]
   * @param {boolean} [options.expectListChange=true] - set FALSE when the search is
   *   expected to return the SAME list it already shows. The row fingerprint can never
   *   change in that case, so waiting on it burns the entire 20s budget and then continues
   *   anyway — a silent 20s tax the Students and Classes suites both paid before this
   *   option existed. In that mode we wait for the SEARCH BANNER instead, which is the
   *   honest "the search was applied" signal when the rows cannot move.
   */
  search_staff: async function (term, options) {
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

  /**
   * Clears an active search via the banner's Clear link, restoring the full list.
   *
   * ⚠️ The Clear link's qid on this tab is `aClass-99` — a CLASSES-tab id reused inside the
   * Staff heading (verified live 2026-09-02). Binding to that qid would be both confusing
   * and fragile, so the selector scopes the stable class instead:
   * `staff h2 small a.clear-search`.
   */
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
   * "Staff / Showing search results for <term>. / Clear" and the count disappears.
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
      countDisplayed: await action.isExisting(this.staffCount),
      searchBoxValue: await action.getValue(this.searchInput)
    };
  },

  /**
   * The no-results empty state.
   *
   * Unlike the Students tab (which rendered nothing at all for a while), the Staff tab has
   * always rendered a proper message here. Its copy carries a known wording defect — it
   * says "no administrators" on a tab listing teachers too — recorded in the register's
   * Remarks rather than as its own case. Assert the copy AS SHIPPED.
   */
  getData_noResultsState: async function () {
    await logger.logInto(await stackTrace.get());
    var present = await action.isExisting(this.noRecordsMessage);
    return {
      messageDisplayed: present ? await action.isDisplayed(this.noRecordsMessage) : false,
      messageText: present ? await action.getText(this.noRecordsMessage) : null,
      rowCount: await action.getElementCount(this.staffRow),
      // The table AND its sort header are removed in this state (verified 2026-09-02).
      sortHeaderPresent: await action.isExisting(this.sortHeaderRow)
    };
  },

  // ── Sort ─────────────────────────────────────────────────────────────────────────

  /**
   * Clicks a sort header and waits for the ROWS to re-order.
   *
   * ⚠️ The qids are NOT in visual column order — First name is `aAdmin-3` and Last name is
   * `aAdmin-4`, even though Last name is the leftmost column (verified live 2026-09-02).
   * That inversion is exactly why this map exists.
   *
   * @param {string} column - "lastName" | "firstName" | "email" | "role"
   */
  click_sortBy: async function (column) {
    await logger.logInto(await stackTrace.get(), "column:" + column);
    var map = {
      lastName: this.sortByLastNameBtn,
      firstName: this.sortByFirstNameBtn,
      email: this.sortByEmailBtn,
      role: this.sortByRoleBtn
    };
    if (!map[column]) return { clickStatus: "UNKNOWN_COLUMN:" + column };
    var before = await readListSignature();
    var clickStatus = await action.click(map[column]);
    if (true !== clickStatus) return { clickStatus: clickStatus };
    return { clickStatus: clickStatus, listChanged: await waitForListChange(before) };
  },

  /**
   * The four columns' sort-status labels, read by stable id.
   *
   * ⚠️ TWO traps live here, both verified live 2026-09-02:
   *  1. Only the column that CURRENTLY owns the sort has a status element at all — the
   *     others are absent from the DOM, which is what makes TST_STFL_TC_19 assertable.
   *  2. The id's `-a` suffix is NOT the direction. `sortStatus-staff-roles-a` reads
   *     "sorted descending" after a second click; the id never changes. Read the TEXT for
   *     direction, never the id.
   *
   * The column key in the id is the API field, not the label: last_name, first_name,
   * ext_email and **roles** (plural).
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
      email: await read(this.sortStatusEmail),
      role: await read(this.sortStatusRole)
    };
  },

  // ── Rows ─────────────────────────────────────────────────────────────────────────

  /**
   * Every listed staff member as {index, lastName, firstName, email, role}.
   *
   * The Staff tab has a real, visible Role column (`staff-cell-role-<n>`) — unlike the
   * Students tab, where the account type is only exposed in the row's accessible name.
   */
  getData_staffRows: async function () {
    await logger.logInto(await stackTrace.get());
    var count = await action.getElementCount(this.rowActionMenuAll);
    if (typeof count !== "number") return [];
    var rows = [];
    var text = function (v) { return v && v.message ? null : (v === null ? null : String(v).trim()); };
    for (var i = 0; i < count; i++) {
      rows.push({
        index: i,
        lastName: text(await action.getText(this.rowLastNameByIndex.replace("{{n}}", String(i)))),
        firstName: text(await action.getText(this.rowFirstNameByIndex.replace("{{n}}", String(i)))),
        email: text(await action.getText(this.rowEmailByIndex.replace("{{n}}", String(i)))),
        role: text(await action.getText(this.rowRoleByIndex.replace("{{n}}", String(i))))
      });
    }
    return rows;
  },

  /** Number of staff rows currently rendered. */
  getData_visibleRowCount: async function () {
    await logger.logInto(await stackTrace.get());
    return await action.getElementCount(this.staffRow);
  },

  /** 0-based index of the first row whose accessible name contains `needle`, or -1. */
  getData_rowIndexByText: async function (needle) {
    await logger.logInto(await stackTrace.get(), "needle:" + needle);
    return await findRowIndexByText(needle);
  },

  // ── User guide ───────────────────────────────────────────────────────────────────

  /**
   * Expands the user guide.
   *
   * The toggle is a DIFFERENT ELEMENT in each state — `aAdmin-8` ("User guide") when
   * collapsed, `aAdmin-9` ("Hide", aria-label "Hide the user guide") when expanded — and
   * the collapsed one is genuinely REMOVED while expanded (verified live 2026-09-02). A
   * page object bound to one of them breaks the other half of the toggle test.
   */
  click_expandUserGuide: async function () {
    await logger.logInto(await stackTrace.get());
    var clickStatus = await action.click(this.userGuideToggleCollapsed);
    if (true !== clickStatus) return { clickStatus: clickStatus };
    return { clickStatus: clickStatus, panelStatus: await action.waitForDisplayed(this.userGuidePanel) };
  },

  /** Collapses the user guide via the EXPANDED-state toggle (`aAdmin-9`, "Hide"). */
  click_collapseUserGuide: async function () {
    await logger.logInto(await stackTrace.get());
    var clickStatus = await action.click(this.userGuideToggleExpanded);
    if (true !== clickStatus) return { clickStatus: clickStatus };
    // The panel is GENUINELY REMOVED from the DOM when collapsed — one of the few admin
    // containers that is (verified live 2026-09-02) — so wait for it to go (reverse=true).
    return { clickStatus: clickStatus, panelRemoved: await action.waitForDisplayed(this.userGuidePanel, 10000, true) };
  },

  /** User-guide state: which toggle is present, and the panel's bullet lines. */
  getData_userGuide: async function () {
    await logger.logInto(await stackTrace.get());
    var open = await action.isExisting(this.userGuidePanel);
    var lines = [];
    if (open) {
      // One read of the bullet container, split on newlines — each bullet is its own <p>,
      // so they arrive newline-separated and no per-element locator walk is needed.
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
   * Clicks "Load more ..." and waits for the extra staff to be appended.
   * Returns rowsBefore/rowsAfter so a TC can assert growth without an absolute count.
   */
  click_loadMore: async function () {
    await logger.logInto(await stackTrace.get());
    if (!(await action.isExisting(this.loadMoreLink))) return { clickStatus: "LOAD_MORE_ABSENT" };
    var before = await readListSignature();
    var rowsBefore = await action.getElementCount(this.staffRow);
    var clickStatus = await action.click(this.loadMoreLink);
    if (true !== clickStatus) return { clickStatus: clickStatus };
    var changed = await waitForListChange(before);
    return {
      clickStatus: clickStatus,
      listChanged: changed,
      rowsBefore: rowsBefore,
      rowsAfter: await action.getElementCount(this.staffRow)
    };
  },

  /**
   * Whether "Load more ..." is offered.
   *
   * Reports PRESENCE, not enabled-state: the link is REMOVED from the DOM once the list is
   * exhausted, never disabled (verified live 2026-09-02 — 20 → 21 rows, then gone). A TC
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

  /** Reloads the Staff tab, restoring the default Last-name-ascending sort and page 1. */
  reload_staffTab: async function () {
    await logger.logInto(await stackTrace.get());
    await browser.refresh();
    return { pageStatus: (await this.isInitialized()).pageStatus };
  },

  /** True when the browser is currently on this school's Staff tab. */
  getData_isOnStaffTab: async function () {
    await logger.logInto(await stackTrace.get());
    var url = await browser.getUrl();
    return String(url).indexOf("/staff") >= 0 && (await action.isExisting(this.staffHeading));
  },

  /** Navigates back to the Staff tab after a TC has left it. */
  return_toStaffTab: async function () {
    await logger.logInto(await stackTrace.get());
    if (!staffTabUrl) return { pageStatus: "NO_URL_CAPTURED" };
    await browser.url(staffTabUrl);
    return { pageStatus: (await this.isInitialized()).pageStatus };
  }
};

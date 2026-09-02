"use strict";
// Admin App — Staff tab. Module code STFL → pages/ExperienceApp/schoolStaff.page.js.
// Manual source: test/Manual/C1App/AdminApp-Staff/AdminApp_Staff_tab_test_cases.md
//
// PHASE 1 SCOPE — the side-effect-free STFL block, minus the cases marked
// "[EXTRA — Phase 1 exclusion]" in the register (TC_1, 5, 7, 10, 21, 26) and minus TC_27,
// which needs an invited teacher to accept and therefore mutates real data. That leaves
// the 19 cases in this file: TC_2, 3, 4, 6, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
// 23, 24, 25. Nothing here creates, edits or removes anything.
//
// SHARED SCHOOL. FCN-CHZ-PDA is mutated by other teams — the Staff heading read 23 on
// 2026-08-24 and 22 on 2026-09-02. NOTHING here asserts an absolute count
// (admin-shared.md §A5); counts are compared to themselves across a step.
//
// ⚠️ The heading count and the rendered row count DISAGREE on this school (22 vs 21 on
// 2026-09-02) — a known, unexplained product defect owned by TST_STFL_TC_26, which is
// out of Phase 1 scope. No case in this file may assert that they match.
var schoolStaff = require("../../pages/ExperienceApp/schoolStaff.page.js");

var stf;

// ── Local ordering helpers (pure comparison — no DOM, no page knowledge) ──────────────

/**
 * String comparison by CODE POINT, which is what the app's own sort does.
 *
 * Verified live 2026-09-02 on this school: Last name ascending yields
 * "21aug, Ln, Perf Test, T1, User, gg, ln, s, teacher, teacher9752" — EVERY capitalised
 * surname sorts before EVERY lower-case one, because 'U' (0x55) < 'g' (0x67). A
 * case-insensitive `localeCompare` would interleave them and would NOT match the product.
 * Same collation as the Classes and Students tabs (admin-shared.md §A4). TST_STFL_TC_20
 * exists specifically to pin this down.
 */
function compareCodePoint(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

/**
 * Confirms `values` are ordered consistently with the direction the app reports.
 * Uses >= / <= rather than strict comparison because duplicates are real — this school
 * holds nine staff sharing the surname "Perf Test".
 */
function isSortedBy(values, direction) {
  for (var i = 1; i < values.length; i++) {
    var c = compareCodePoint(values[i - 1], values[i]);
    if (direction === "sorted ascending" && c > 0) return false;
    if (direction === "sorted descending" && c < 0) return false;
  }
  return true;
}

function pluck(rows, field) {
  return rows.map(function (r) { return r[field]; })
    .filter(function (v) { return v !== null && v !== undefined; });
}

/** True when every `first` value appears before every `second` value in `values`. */
function isGroupedBefore(values, first, second) {
  var lastFirst = -1;
  var firstSecond = values.length;
  for (var i = 0; i < values.length; i++) {
    if (values[i] === first) lastFirst = i;
    if (values[i] === second && i < firstSecond) firstSecond = i;
  }
  if (lastFirst === -1 || firstSecond === values.length) return true; // only one group present
  return lastFirst < firstSecond;
}

module.exports = {
  /**
   * TST_STFL_TC_NAV — Before-hook navigation, not a functional test.
   *
   * The Before chain leaves the browser on the school's CLASSES tab (the default view
   * after TST_SADB_TC_1 opens the school), so every STFL case needs one hop to the Staff
   * tab first.
   *
   * Asserted, unlike TST_STFL_TC_RESET: if this hop fails, every TC after it fails for a
   * reason that has nothing to do with what it was testing, so failing loudly here is the
   * kinder outcome.
   */
  TST_STFL_TC_NAV: async function () {
    stf = await schoolStaff.click_staffTab();
    await assertion.assertEqual(stf.clickStatus, true, "Clicking the STAFF left-nav link should succeed");
    await assertion.assertEqual(stf.pageStatus, true, "The Staff tab should finish loading");
  },

  /**
   * TST_STFL_TC_RESET — BeforeEach + suite-level After housekeeping, not a functional test.
   *
   * Clears any active search and collapses the user guide so the next TC starts from the
   * full, unfiltered list with the guide closed (ADR-011: a TC must not depend on what ran
   * before it). Carries no assertions — a reset must never fail the suite.
   *
   * REGISTERED IN BeforeEach AND THE SUITE-LEVEL After — NEVER AfterEach (ADR-019). The
   * mochawesome screenshot is taken in a ROOT afterEach and mocha runs root afterEach hooks
   * LAST, so resetting in AfterEach fires BEFORE the shot: every search TC would be
   * photographed on the full list, with the result it had just asserted already wiped off
   * the screen.
   *
   * Collapsing the guide matters for the same reason it did on the Students tab: TC_12
   * leaves it OPEN, and without this reset TC_13's sibling cases would click a
   * collapsed-state toggle that no longer exists, burning two 30s Playwright timeouts.
   */
  TST_STFL_TC_RESET: async function () {
    try {
      await schoolStaff.clear_search();
      var guide = await schoolStaff.getData_userGuide();
      if (guide.panelPresent === true) await schoolStaff.click_collapseUserGuide();
    } catch (e) {
      // Intentionally swallowed — housekeeping must not fail the suite.
    }
  },

  // ── Requirement #1-#4 — search ───────────────────────────────────────────────────

  /** TST_STFL_TC_2 — searching a full first name returns that staff member. */
  TST_STFL_TC_2: async function (testdata) {
    stf = await schoolStaff.search_staff(testdata.searchByFirstName);
    await assertion.assertEqual(stf.clickStatus, true, "Search button click should succeed");

    var rows = await schoolStaff.getData_staffRows();
    await assertion.assertEqual(rows.length, 1,
      "Exactly one staff member should match first name '" + testdata.searchByFirstName + "' — got " + rows.length);
    await assertion.assertEqual(rows[0].firstName, testdata.searchByFirstNameExpectedFirst,
      "Matched row's First name should be '" + testdata.searchByFirstNameExpectedFirst + "'");
    await assertion.assertEqual(rows[0].lastName, testdata.searchByFirstNameExpectedLast,
      "Matched row's Last name should be '" + testdata.searchByFirstNameExpectedLast + "'");
    await assertion.assertEqual(rows[0].email, testdata.searchByFirstNameExpectedEmail,
      "Matched row's Email address should be '" + testdata.searchByFirstNameExpectedEmail + "'");
    await assertion.assertEqual(rows[0].role, testdata.searchByFirstNameExpectedRole,
      "Matched row's Role should be '" + testdata.searchByFirstNameExpectedRole + "'");

    var banner = await schoolStaff.getData_searchBanner();
    await assertion.assertEqual(banner.bannerDisplayed, true, "The search-result banner should be displayed");
    await assertion.assertEqual(banner.echoedTerm, testdata.searchByFirstName,
      "The banner should echo the search term verbatim");
    await assertion.assertEqual(banner.clearDisplayed, true, "A 'Clear' link should be offered");
    // The count is REPLACED by the banner while a search is active.
    await assertion.assertEqual(banner.countDisplayed, false,
      "The '(N)' count should be replaced by the search banner while a search is active");
  },

  /**
   * TST_STFL_TC_3 — a partial first name returns every match.
   *
   * The search is partial-matching across first name, last name AND email, so this asserts
   * that every returned row contains the term SOMEWHERE — not that it matched the first
   * name specifically. Asserting a count would break the moment another team adds a
   * "teacher…" account to this shared school.
   */
  TST_STFL_TC_3: async function (testdata) {
    stf = await schoolStaff.search_staff(testdata.searchPartialName);
    await assertion.assertEqual(stf.clickStatus, true, "Search button click should succeed");

    var rows = await schoolStaff.getData_staffRows();
    await assertion.assertEqual(rows.length > 1, true,
      "A partial term should match MORE than one staff member — got " + rows.length +
      ", which would not prove partial matching");

    var term = String(testdata.searchPartialName).toLowerCase();
    for (var i = 0; i < rows.length; i++) {
      var haystack = [rows[i].firstName, rows[i].lastName, rows[i].email].join(" ").toLowerCase();
      await assertion.assertEqual(haystack.indexOf(term) >= 0, true,
        "Row " + i + " should contain '" + term + "' in one of its columns — got: " + haystack);
    }
  },

  /**
   * TST_STFL_TC_4 — the same term in a different case returns the same rows.
   *
   * Runs the upper-case search FIRST, keeps its row set, clears, then runs the lower-case
   * one and compares. The banner is checked on the upper-case pass because the echo
   * preserves the case AS TYPED — that is the one place the difference must survive.
   */
  TST_STFL_TC_4: async function (testdata) {
    stf = await schoolStaff.search_staff(testdata.searchByFirstNameUpperCase);
    await assertion.assertEqual(stf.clickStatus, true, "Upper-case search click should succeed");
    var upperRows = pluck(await schoolStaff.getData_staffRows(), "email");
    await assertion.assertEqual(upperRows.length > 0, true,
      "The upper-case search must return at least one row, or the comparison proves nothing");

    var banner = await schoolStaff.getData_searchBanner();
    await assertion.assertEqual(banner.echoedTerm, testdata.searchByFirstNameUpperCase,
      "The banner should echo the term with the case AS TYPED");

    stf = await schoolStaff.clear_search();
    await assertion.assertEqual(stf.clickStatus, true, "Clear should succeed between the two searches");

    stf = await schoolStaff.search_staff(testdata.searchByFirstName);
    await assertion.assertEqual(stf.clickStatus, true, "Lower-case search click should succeed");
    var lowerRows = pluck(await schoolStaff.getData_staffRows(), "email");

    await assertion.assertEqual(lowerRows.join("|"), upperRows.join("|"),
      "Both searches should return an identical row set — matching is case-insensitive. " +
      "Upper: " + upperRows.join(", ") + " | Lower: " + lowerRows.join(", "));
  },

  /**
   * TST_STFL_TC_6 — searching a last name returns the staff who hold it.
   *
   * Also carries the Load-more half of the expected result: a two-row result set is well
   * under the page size, so the control must be absent.
   */
  TST_STFL_TC_6: async function (testdata) {
    stf = await schoolStaff.search_staff(testdata.searchByLastName);
    await assertion.assertEqual(stf.clickStatus, true, "Search button click should succeed");

    var rows = await schoolStaff.getData_staffRows();
    await assertion.assertEqual(rows.length > 0, true,
      "At least one staff member should match last name '" + testdata.searchByLastName + "'");
    for (var i = 0; i < rows.length; i++) {
      await assertion.assertEqual(String(rows[i].lastName).toLowerCase(),
        String(testdata.searchByLastName).toLowerCase(),
        "Every returned row should carry the searched last name — row " + i + " was '" + rows[i].lastName + "'");
    }

    var banner = await schoolStaff.getData_searchBanner();
    await assertion.assertEqual(banner.echoedTerm, testdata.searchByLastName,
      "The banner should echo the searched last name");
    await assertion.assertEqual(await schoolStaff.getData_loadMoreAvailable(), false,
      "'Load more ...' should be absent — the result set is well under one page");
  },

  /** TST_STFL_TC_8 — a full email address returns exactly that staff member. */
  TST_STFL_TC_8: async function (testdata) {
    stf = await schoolStaff.search_staff(testdata.searchByEmail);
    await assertion.assertEqual(stf.clickStatus, true, "Search button click should succeed");

    var rows = await schoolStaff.getData_staffRows();
    await assertion.assertEqual(rows.length, 1,
      "Exactly one staff member should match '" + testdata.searchByEmail + "' — got " + rows.length);
    await assertion.assertEqual(rows[0].email, testdata.searchByEmail,
      "The matched row's Email address should be the searched address");
    await assertion.assertEqual(rows[0].lastName, testdata.searchByEmailExpectedLast,
      "The matched row's Last name should be '" + testdata.searchByEmailExpectedLast + "'");
    await assertion.assertEqual(rows[0].firstName, testdata.searchByEmailExpectedFirst,
      "The matched row's First name should be '" + testdata.searchByEmailExpectedFirst + "'");
    await assertion.assertEqual(rows[0].role, testdata.searchByEmailExpectedRole,
      "The matched row's Role should be '" + testdata.searchByEmailExpectedRole + "'");

    var banner = await schoolStaff.getData_searchBanner();
    await assertion.assertEqual(banner.echoedTerm, testdata.searchByEmail,
      "The banner should echo the full address");
  },

  /**
   * TST_STFL_TC_9 — a partial email returns everyone on that domain, with '@' matched
   * literally rather than treated as an operator.
   */
  TST_STFL_TC_9: async function (testdata) {
    stf = await schoolStaff.search_staff(testdata.searchByEmailDomain);
    await assertion.assertEqual(stf.clickStatus, true, "Search button click should succeed");

    var rows = await schoolStaff.getData_staffRows();
    await assertion.assertEqual(rows.length > 1, true,
      "More than one staff member should share the domain '" + testdata.searchByEmailDomain +
      "' — got " + rows.length);

    var domain = String(testdata.searchByEmailDomain).toLowerCase();
    for (var i = 0; i < rows.length; i++) {
      await assertion.assertEqual(String(rows[i].email).toLowerCase().indexOf(domain) >= 0, true,
        "Row " + i + "'s email should contain '" + domain + "' — got: " + rows[i].email);
    }

    var banner = await schoolStaff.getData_searchBanner();
    await assertion.assertEqual(banner.echoedTerm, testdata.searchByEmailDomain,
      "The banner should echo the domain term verbatim, '@' included");
  },

  /**
   * TST_STFL_TC_11 — a non-matching search shows the empty state.
   *
   * The copy is asserted AS SHIPPED, including its known wording defect ("no
   * administrators" on a tab that lists teachers too). That defect is recorded in the
   * register's Remarks, not fixed here — a test must never route around a product defect
   * (Invariant 14), and it must not silently expect the corrected wording either.
   */
  TST_STFL_TC_11: async function (testdata) {
    stf = await schoolStaff.search_staff(testdata.searchNoMatch);
    await assertion.assertEqual(stf.clickStatus, true, "Search button click should succeed");

    var empty = await schoolStaff.getData_noResultsState();
    await assertion.assertEqual(empty.rowCount, 0,
      "No staff rows should be listed for a non-matching search");
    await assertion.assertEqual(empty.messageDisplayed, true,
      "An empty-state message should be shown");

    var text = String(empty.messageText).replace(/\s+/g, " ").trim();
    await assertion.assertEqual(text, testdata.noMatchMessage.replace("{{term}}", testdata.searchNoMatch),
      "The empty-state message should match the verified copy and echo the term");

    // The table and its sort header are removed together in this state.
    await assertion.assertEqual(empty.sortHeaderPresent, false,
      "The sort header row is removed along with the table in the empty state");

    // The banner and its Clear link survive, so the admin can get back.
    var banner = await schoolStaff.getData_searchBanner();
    await assertion.assertEqual(banner.bannerDisplayed, true,
      "The search banner should still be shown in the empty state");
    await assertion.assertEqual(banner.clearDisplayed, true,
      "'Clear' must remain available so the admin can escape the empty state");
  },

  // ── Requirement — user guide ─────────────────────────────────────────────────────

  /**
   * TST_STFL_TC_12 — the User guide toggle expands the panel with its documented copy.
   *
   * Leaves the guide OPEN on purpose: TST_STFL_TC_13 needs it open, and TST_STFL_TC_RESET
   * closes it for everything else.
   */
  TST_STFL_TC_12: async function (testdata) {
    var before = await schoolStaff.getData_userGuide();
    await assertion.assertEqual(before.panelPresent, false,
      "Precondition: the user guide should start collapsed");
    await assertion.assertEqual(before.collapsedTogglePresent, true,
      "Precondition: the collapsed-state toggle ('User guide') should be present");

    stf = await schoolStaff.click_expandUserGuide();
    await assertion.assertEqual(stf.clickStatus, true, "Clicking the 'User guide' toggle should succeed");
    await assertion.assertEqual(stf.panelStatus, true, "The user guide panel should be displayed");

    var after = await schoolStaff.getData_userGuide();
    await assertion.assertEqual(after.panelPresent, true, "The panel should now be present");
    // The toggle SWAPS element: the collapsed one is removed and the 'Hide' one appears.
    await assertion.assertEqual(after.collapsedTogglePresent, false,
      "The collapsed-state toggle should be replaced once the guide is open");
    await assertion.assertEqual(after.expandedTogglePresent, true,
      "The expanded-state toggle ('Hide') should now be present");

    for (var i = 0; i < testdata.userGuideLines.length; i++) {
      await assertion.assertEqual(after.panelLines.indexOf(testdata.userGuideLines[i]) >= 0, true,
        "The user guide should contain the line: " + testdata.userGuideLines[i] +
        " — got: " + after.panelLines.join(" / "));
    }
  },

  /**
   * TST_STFL_TC_13 — the Hide toggle removes the panel from the page entirely.
   *
   * Opens the guide itself rather than inheriting TST_STFL_TC_12's state: TST_STFL_TC_RESET
   * runs between every pair of cases and closes it, and a TC must not depend on what ran
   * before it (ADR-011).
   */
  TST_STFL_TC_13: async function () {
    stf = await schoolStaff.click_expandUserGuide();
    await assertion.assertEqual(stf.clickStatus, true, "Precondition: expanding the guide should succeed");
    await assertion.assertEqual(stf.panelStatus, true, "Precondition: the panel should be open before hiding it");

    stf = await schoolStaff.click_collapseUserGuide();
    await assertion.assertEqual(stf.clickStatus, true, "Clicking the 'Hide' toggle should succeed");
    // The panel is genuinely REMOVED, not merely hidden — so this asserts removal, which a
    // presence check could never fail on a container that stays in the DOM.
    await assertion.assertEqual(stf.panelRemoved, true,
      "The user guide panel should be REMOVED from the page, not just hidden");

    var after = await schoolStaff.getData_userGuide();
    await assertion.assertEqual(after.panelPresent, false, "The panel should be gone from the DOM");
    await assertion.assertEqual(after.collapsedTogglePresent, true,
      "The toggle label should revert to 'User guide'");
    await assertion.assertEqual(after.expandedTogglePresent, false,
      "The 'Hide' toggle should no longer be present");
  },

  // ── Requirement #5 — sort ────────────────────────────────────────────────────────

  /**
   * TST_STFL_TC_14 — the tab loads sorted by Last name ascending.
   *
   * Reloads first so the default is genuinely re-established: an earlier sort TC in the
   * same run would otherwise leave a different column owning the sort, and this case would
   * assert whatever it inherited.
   */
  TST_STFL_TC_14: async function () {
    stf = await schoolStaff.reload_staffTab();
    await assertion.assertEqual(stf.pageStatus, true, "The Staff tab should reload successfully");

    var status = await schoolStaff.getData_sortStatus();
    await assertion.assertEqual(status.lastName, "sorted ascending",
      "Last name should carry 'sorted ascending' on a fresh load");
    // Exactly one column is ever indicated — the other three have no status element at all.
    await assertion.assertEqual(status.firstName, null, "First name should carry no sort indicator on load");
    await assertion.assertEqual(status.email, null, "Email address should carry no sort indicator on load");
    await assertion.assertEqual(status.role, null, "Role should carry no sort indicator on load");

    var names = pluck(await schoolStaff.getData_staffRows(), "lastName");
    await assertion.assertEqual(names.length > 0, true, "The list should render rows to order");
    await assertion.assertEqual(isSortedBy(names, "sorted ascending"), true,
      "Last names should ascend in code-point order — got: " + names.join(", "));
  },

  /**
   * TST_STFL_TC_15 — clicking First name re-orders by first name and clears Last name.
   *
   * Reloads first, like every sort case here. TST_STFL_TC_RESET clears the search but does
   * NOT reset the sort, so without this the case would inherit whichever column the
   * previous TC left owning it — and if that were already First name, this click would flip
   * it to DESCENDING and the case would fail for a reason that is purely test order
   * (ADR-011). The reload restores the documented default, Last name ascending.
   */
  TST_STFL_TC_15: async function () {
    stf = await schoolStaff.reload_staffTab();
    await assertion.assertEqual(stf.pageStatus, true, "The Staff tab should reload successfully");

    stf = await schoolStaff.click_sortBy("firstName");
    await assertion.assertEqual(stf.clickStatus, true, "Clicking the First name header should succeed");
    await assertion.assertEqual(stf.listChanged, true,
      "The rows should actually re-order — not just the header label, which is optimistic UI");

    var status = await schoolStaff.getData_sortStatus();
    await assertion.assertEqual(status.firstName, "sorted ascending",
      "First name should now be sorted ascending");
    await assertion.assertEqual(status.lastName, null,
      "The Last name indicator should be removed once First name takes over the sort");

    var names = pluck(await schoolStaff.getData_staffRows(), "firstName");
    await assertion.assertEqual(isSortedBy(names, "sorted ascending"), true,
      "First names should ascend in code-point order — got: " + names.join(", "));
  },

  /** TST_STFL_TC_16 — clicking Email address re-orders by email. Reloads first (see TC_15). */
  TST_STFL_TC_16: async function () {
    stf = await schoolStaff.reload_staffTab();
    await assertion.assertEqual(stf.pageStatus, true, "The Staff tab should reload successfully");

    stf = await schoolStaff.click_sortBy("email");
    await assertion.assertEqual(stf.clickStatus, true, "Clicking the Email address header should succeed");
    await assertion.assertEqual(stf.listChanged, true, "The rows should actually re-order");

    var status = await schoolStaff.getData_sortStatus();
    await assertion.assertEqual(status.email, "sorted ascending",
      "Email address should now be sorted ascending");
    await assertion.assertEqual(status.lastName, null,
      "The Last name indicator should be removed once Email address takes over the sort");

    var emails = pluck(await schoolStaff.getData_staffRows(), "email");
    await assertion.assertEqual(isSortedBy(emails, "sorted ascending"), true,
      "Email addresses should ascend in code-point order — got: " + emails.join(", "));
  },

  /**
   * TST_STFL_TC_17 — clicking Role groups Administrator/Teacher before Teacher.
   *
   * Asserts GROUPING, not a count: how many of each role this shared school holds changes
   * under us, but the grouping rule does not.
   */
  TST_STFL_TC_17: async function (testdata) {
    stf = await schoolStaff.reload_staffTab(); // see TC_15 — the sort is not reset by TC_RESET
    await assertion.assertEqual(stf.pageStatus, true, "The Staff tab should reload successfully");

    stf = await schoolStaff.click_sortBy("role");
    await assertion.assertEqual(stf.clickStatus, true, "Clicking the Role header should succeed");
    await assertion.assertEqual(stf.listChanged, true, "The rows should actually re-order");

    var status = await schoolStaff.getData_sortStatus();
    await assertion.assertEqual(status.role, "sorted ascending", "Role should now be sorted ascending");
    await assertion.assertEqual(status.lastName, null,
      "The Last name indicator should be removed once Role takes over the sort");

    var roles = pluck(await schoolStaff.getData_staffRows(), "role");
    await assertion.assertEqual(isGroupedBefore(roles, testdata.roleAdmin, testdata.roleTeacher), true,
      "Every '" + testdata.roleAdmin + "' row should sort before every '" + testdata.roleTeacher +
      "' row — got: " + roles.join(", "));
  },

  /**
   * TST_STFL_TC_18 — a second click on Role reverses the grouping.
   *
   * ⚠️ The status element's id keeps its `-a` suffix in BOTH directions
   * (`sortStatus-staff-roles-a` reads "sorted descending" after this click), so direction
   * is read from the TEXT, never from the id (verified live 2026-09-02).
   */
  TST_STFL_TC_18: async function (testdata) {
    stf = await schoolStaff.reload_staffTab(); // see TC_15 — the sort is not reset by TC_RESET
    await assertion.assertEqual(stf.pageStatus, true, "The Staff tab should reload successfully");

    stf = await schoolStaff.click_sortBy("role");
    await assertion.assertEqual(stf.clickStatus, true, "Precondition: first Role click should succeed");
    await assertion.assertEqual(stf.listChanged, true, "Precondition: the first click should re-order the rows");
    var asc = await schoolStaff.getData_sortStatus();
    await assertion.assertEqual(asc.role, "sorted ascending",
      "Precondition: Role should be ascending before the reversing click");

    stf = await schoolStaff.click_sortBy("role");
    await assertion.assertEqual(stf.clickStatus, true, "Clicking the Role header a second time should succeed");
    await assertion.assertEqual(stf.listChanged, true, "The rows should re-order again");

    var desc = await schoolStaff.getData_sortStatus();
    await assertion.assertEqual(desc.role, "sorted descending",
      "A second click on Role should flip the sort to descending");

    var roles = pluck(await schoolStaff.getData_staffRows(), "role");
    await assertion.assertEqual(isGroupedBefore(roles, testdata.roleTeacher, testdata.roleAdmin), true,
      "Descending, every '" + testdata.roleTeacher + "' row should sort before every '" +
      testdata.roleAdmin + "' row — got: " + roles.join(", "));
  },

  /**
   * TST_STFL_TC_19 — taking over the sort clears the previous column's indicator.
   *
   * This is assertable precisely because the losing column's status element is REMOVED
   * from the DOM rather than emptied (verified live 2026-09-02).
   */
  TST_STFL_TC_19: async function () {
    stf = await schoolStaff.reload_staffTab(); // see TC_15 — the sort is not reset by TC_RESET
    await assertion.assertEqual(stf.pageStatus, true, "The Staff tab should reload successfully");

    stf = await schoolStaff.click_sortBy("role");
    await assertion.assertEqual(stf.clickStatus, true, "Clicking the Role header should succeed");
    await assertion.assertEqual(stf.listChanged, true, "The rows should re-order for Role");
    var afterRole = await schoolStaff.getData_sortStatus();
    await assertion.assertEqual(afterRole.role, "sorted ascending",
      "Precondition: Role should own the sort before another column takes over");

    stf = await schoolStaff.click_sortBy("firstName");
    await assertion.assertEqual(stf.clickStatus, true, "Clicking the First name header should succeed");
    await assertion.assertEqual(stf.listChanged, true, "The rows should re-order for First name");

    var after = await schoolStaff.getData_sortStatus();
    await assertion.assertEqual(after.firstName, "sorted ascending",
      "First name should now own the sort");
    await assertion.assertEqual(after.role, null,
      "The Role indicator should have been REMOVED once First name took over");
    await assertion.assertEqual(after.lastName, null, "Last name should carry no indicator");
    await assertion.assertEqual(after.email, null, "Email address should carry no indicator");
  },

  /**
   * TST_STFL_TC_20 — sorting orders by code point, not by locale.
   *
   * Loads the WHOLE list first, because the evidence only appears once both capitalised and
   * lower-case surnames are on screen together. Asserts the code-point RULE rather than the
   * captured sequence: the sequence belongs to this school's data on one day, the rule does
   * not. It additionally asserts that a locale comparison would give a DIFFERENT answer —
   * without that, the case would still pass on data where the two agree, proving nothing.
   */
  TST_STFL_TC_20: async function () {
    stf = await schoolStaff.reload_staffTab();
    await assertion.assertEqual(stf.pageStatus, true, "The Staff tab should reload successfully");

    var guard = 0;
    while ((await schoolStaff.getData_loadMoreAvailable()) === true && guard < 20) {
      stf = await schoolStaff.click_loadMore();
      await assertion.assertEqual(stf.clickStatus, true, "Each 'Load more ...' click should succeed");
      guard++;
    }
    await assertion.assertEqual(guard < 20, true,
      "The list should finish loading within 20 'Load more ...' clicks");

    var status = await schoolStaff.getData_sortStatus();
    await assertion.assertEqual(status.lastName, "sorted ascending",
      "Precondition: the list should still be sorted by Last name ascending");

    var names = pluck(await schoolStaff.getData_staffRows(), "lastName");
    await assertion.assertEqual(isSortedBy(names, "sorted ascending"), true,
      "Last names should ascend by CODE POINT — got: " + names.join(", "));

    // The discriminating half: a locale-aware sort of the same values must NOT agree, or
    // this school's data cannot tell the two collations apart and the case proves nothing.
    var localeSorted = names.slice().sort(function (a, b) { return String(a).localeCompare(String(b)); });
    await assertion.assertEqual(localeSorted.join("|") !== names.join("|"), true,
      "A localeCompare ordering should DIFFER from the product's code-point ordering — " +
      "if they agree, this data cannot distinguish the two collations. Product: " +
      names.join(", ") + " | locale: " + localeSorted.join(", "));
  },

  // ── Requirement — Load more ──────────────────────────────────────────────────────

  /**
   * TST_STFL_TC_23 — Load more appends the next page without replacing what is shown.
   *
   * Reloads first so the case always starts from a fresh first page rather than inheriting
   * an already-exhausted list from an earlier TC (TST_STFL_TC_RESET clears the search but
   * does not reload).
   */
  TST_STFL_TC_23: async function () {
    stf = await schoolStaff.reload_staffTab();
    await assertion.assertEqual(stf.pageStatus, true, "The Staff tab should reload successfully");

    var pageSize = schoolStaff.getData_pageSize();
    var firstPage = await schoolStaff.getData_staffRows();
    await assertion.assertEqual(firstPage.length, pageSize,
      "The first page should hold exactly " + pageSize + " rows — got " + firstPage.length);
    await assertion.assertEqual(await schoolStaff.getData_loadMoreAvailable(), true,
      "Precondition: 'Load more ...' should be offered while staff remain");

    stf = await schoolStaff.click_loadMore();
    await assertion.assertEqual(stf.clickStatus, true, "Clicking 'Load more ...' should succeed");
    await assertion.assertEqual(stf.listChanged, true, "The list should actually grow");
    await assertion.assertEqual(stf.rowsAfter > stf.rowsBefore, true,
      "Load more should APPEND rows — before " + stf.rowsBefore + ", after " + stf.rowsAfter);

    // The already-loaded rows must be retained IN PLACE, not replaced or re-ordered.
    var afterRows = await schoolStaff.getData_staffRows();
    for (var i = 0; i < firstPage.length; i++) {
      await assertion.assertEqual(afterRows[i].email, firstPage[i].email,
        "Row " + i + " from the first page should be RETAINED in place after Load more");
    }
  },

  /**
   * TST_STFL_TC_24 — Load more is REMOVED once the whole list is loaded.
   * The link is removed from the DOM, never left visible in a disabled state — so this
   * asserts absence. An "is disabled" assertion here could never fail.
   */
  TST_STFL_TC_24: async function () {
    stf = await schoolStaff.reload_staffTab();
    await assertion.assertEqual(stf.pageStatus, true, "The Staff tab should reload successfully");
    await assertion.assertEqual(await schoolStaff.getData_visibleRowCount(), schoolStaff.getData_pageSize(),
      "Precondition: the reload should restore a full first page");
    await assertion.assertEqual(await schoolStaff.getData_loadMoreAvailable(), true,
      "Precondition: 'Load more ...' should be offered again after the reload");

    // Bounded so a product change that makes the link permanent fails the TC instead of
    // hanging the suite.
    var guard = 0;
    while ((await schoolStaff.getData_loadMoreAvailable()) === true && guard < 20) {
      stf = await schoolStaff.click_loadMore();
      await assertion.assertEqual(stf.clickStatus, true, "Each 'Load more ...' click should succeed");
      guard++;
    }
    await assertion.assertEqual(guard < 20, true,
      "'Load more ...' should stop being offered within 20 clicks — it never disappeared");
    await assertion.assertEqual(await schoolStaff.getData_loadMoreAvailable(), false,
      "'Load more ...' must be REMOVED from the page once every staff member is loaded");
    await assertion.assertEqual(await schoolStaff.getData_visibleRowCount() > schoolStaff.getData_pageSize(), true,
      "More than one page of staff should now be listed");
  },

  /**
   * TST_STFL_TC_25 — Load more is absent for a result set that fits on one page, and
   * returns once Clear restores the full list.
   */
  TST_STFL_TC_25: async function (testdata) {
    stf = await schoolStaff.search_staff(testdata.searchByLastName);
    await assertion.assertEqual(stf.clickStatus, true, "Search button click should succeed");

    var rows = await schoolStaff.getData_visibleRowCount();
    await assertion.assertEqual(rows > 0 && rows < schoolStaff.getData_pageSize(), true,
      "Precondition: the result set should be non-empty and fit on one page — got " + rows + " rows");
    await assertion.assertEqual(await schoolStaff.getData_loadMoreAvailable(), false,
      "'Load more ...' should not be offered when the whole result set fits on one page");

    stf = await schoolStaff.clear_search();
    await assertion.assertEqual(stf.clickStatus, true, "Clearing the search should succeed");
    await assertion.assertEqual(stf.listChanged, true, "Clearing should restore the full list");
    await assertion.assertEqual(await schoolStaff.getData_loadMoreAvailable(), true,
      "'Load more ...' should reappear once the full list is restored");
  }
};

"use strict";
// Admin App — Students tab. Module code SLST → pages/ExperienceApp/schoolStudents.page.js.
// Manual source: test/Manual/C1App/AdminApp-Students/AdminApp_Students_tab_test_cases.md
//
// Batch 1 (this file): Req — tab load (TC_1), Req #1 search by first name
// (TC_2, TC_9, TC_10, TC_3, TC_11, TC_12), Req #5 activation checkbox (TC_13).
//
// SHARED SCHOOL. FCN-CHZ-PDA is mutated by other teams — it held 26 students on
// 2026-08-22 and 27 on 2026-08-28. NOTHING here asserts an absolute count
// (admin-shared.md §A5); counts are compared to themselves across a step.
var schoolStudents = require("../../pages/ExperienceApp/schoolStudents.page.js");

var sts;

// ── Local ordering helpers (pure comparison — no DOM, no page knowledge) ──────────────

/**
 * String comparison by CODE POINT, which is what the app's own sort does.
 *
 * Verified live 2026-08-28 on this school: sorting by Last name ascending yields
 * "Garg, Learner, Perf Test, S, … budhiraja, kr, learner, student, test, us" — EVERY
 * capitalised surname sorts before EVERY lower-case one, because 'S' (0x53) < 'b' (0x62).
 * A case-insensitive `localeCompare` would interleave them and would NOT match the
 * product. Same collation as the Classes tab (admin-shared.md §A4). TST_SLST_TC_18
 * exists specifically to pin this down.
 */
function compareCodePoint(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

/**
 * Confirms `values` are ordered consistently with the direction the app reports.
 * Uses >= / <= rather than strict comparison because duplicates are real — this school
 * holds many students sharing the surname "Perf Test".
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

module.exports = {
  /**
   * TST_SLST_TC_RESET — BeforeEach + suite-level After housekeeping, not a functional test.
   *
   * Clears any active search and unticks the activation checkbox so the next TC starts
   * from the full, unfiltered list in name-search mode (ADR-011: a TC must not depend on
   * what ran before it). Carries no assertions — a reset must never fail the suite.
   *
   * REGISTERED IN BeforeEach AND THE SUITE-LEVEL After — NEVER AfterEach (ADR-019).
   * The mochawesome screenshot is taken in a ROOT afterEach, and mocha runs root afterEach
   * hooks LAST, so resetting in AfterEach fires BEFORE the shot: every search TC would be
   * photographed on the full list, with the result it had just asserted already wiped off
   * the screen. The Classes suite learned this the hard way.
   */
  TST_SLST_TC_RESET: async function () {
    try {
      await schoolStudents.clear_search();
      var mode = await schoolStudents.getData_activationSearchMode();
      if (mode.checked === true) await schoolStudents.click_activationCheckbox();
      // Collapse the user guide if a previous TC left it open. Without this, TST_SLST_TC_21
      // starts with the guide ALREADY expanded (TC_20 leaves it so), its click on the
      // collapsed-state toggle `aLearner-11` targets an element that does not exist, and
      // baseActionLibrary.click burns TWO 30s Playwright timeouts — scrollIntoViewIfNeeded
      // then click — for a measured 60.3s of dead time on the 2026-08-28 run.
      var guide = await schoolStudents.getData_userGuide();
      if (guide.panelPresent === true) await schoolStudents.click_collapseUserGuide();
    } catch (e) {
      // Intentionally swallowed — housekeeping must not fail the suite.
    }
  },

  /**
   * TST_SLST_TC_NAV — Before-hook navigation, not a functional test.
   *
   * The Before chain leaves the browser on the school's CLASSES tab (that is the default
   * view after TST_SADB_TC_1 opens the school), so every SLST case needs one hop to the
   * Students tab first. Crossing into it is a full microfrontend load, measured at ~4.4s
   * on 2026-08-28 — not an Angular route change.
   *
   * Asserted, unlike TST_SLST_TC_RESET: if this hop fails, every TC after it fails for a
   * reason that has nothing to do with what it was testing, so failing loudly here is the
   * kinder outcome.
   */
  TST_SLST_TC_NAV: async function () {
    sts = await schoolStudents.click_studentsTab();
    await assertion.assertEqual(sts.clickStatus, true, "Clicking the STUDENTS left-nav link should succeed");
    await assertion.assertEqual(sts.pageStatus, true, "The Students tab should finish loading");
  },

  /**
   * TST_SLST_TC_1 — the Students tab loads with all expected components.
   *
   * Every control is checked with isDisplayed rather than a presence/count check: FOUR
   * modals are pre-rendered into this page with nothing open, so presence is a guaranteed
   * false green (admin-shared.md §B2).
   */
  TST_SLST_TC_1: async function (testdata) {
    sts = await schoolStudents.getData_studentsTabLayout();

    await assertion.assertEqual(
      sts.url.indexOf(testdata.studentsUrlFragment) >= 0, true,
      "Students tab URL should contain '" + testdata.studentsUrlFragment + "' — got: " + sts.url);

    // Heading is "Students (N)". N moves on this shared school, so assert the SHAPE only.
    await assertion.assertEqual(
      /^Students\s*\(\d+\)$/.test(String(sts.headingText).replace(/\s+/g, " ").trim()), true,
      "Heading should read 'Students (N)' — got: " + sts.headingText);

    await assertion.assertEqual(sts.searchInputDisplayed, true, "Search box should be displayed");
    await assertion.assertEqual(sts.searchPlaceholder, testdata.searchPlaceholder,
      "Search placeholder should match the verified copy");
    await assertion.assertEqual(sts.searchBtnDisplayed, true, "Search button should be displayed");
    await assertion.assertEqual(sts.activationCheckboxDisplayed, true,
      "'Who activated the code in my school?' checkbox should be displayed");
    await assertion.assertEqual(sts.manageStudentsDisplayed, true, "'Manage students' dropdown should be displayed");
    await assertion.assertEqual(sts.selectAllDisplayed, true, "Select-all checkbox should be displayed");
    await assertion.assertEqual(String(sts.selectedCounterText).replace(/\s+/g, " ").trim(), "0 Selected",
      "Selected counter should read '0 Selected' with nothing selected");
    // Natively disabled at 0 selected — an attribute, not a CSS class.
    await assertion.assertEqual(sts.removeBtnEnabled, false,
      "'Remove from school account' should be disabled while no student is selected");
    await assertion.assertEqual(sts.userGuideToggleDisplayed, true, "User guide toggle should be displayed");
    await assertion.assertEqual(sts.sortLastNameDisplayed, true, "'Last name' sort header should be displayed");
    await assertion.assertEqual(sts.sortFirstNameDisplayed, true, "'First name' sort header should be displayed");
    await assertion.assertEqual(sts.sortEmailUsernameDisplayed, true,
      "'Email address or Username' sort header should be displayed");
    await assertion.assertEqual(sts.rowCount > 0, true,
      "The student list should render at least one row — got: " + sts.rowCount);
  },

  /**
   * TST_SLST_TC_2 — searching an exact first name returns that student, and the count
   * heading is replaced by the search banner.
   */
  TST_SLST_TC_2: async function (testdata) {
    sts = await schoolStudents.search_student(testdata.searchByFirstName);
    await assertion.assertEqual(sts.clickStatus, true, "Search button click should succeed");

    var rows = await schoolStudents.getData_studentRows();
    await assertion.assertEqual(rows.length, 1,
      "Exactly one student should match '" + testdata.searchByFirstName + "' — got " + rows.length);
    await assertion.assertEqual(rows[0].firstName, testdata.searchByFirstNameExpectedFirst,
      "Matched row's First name should be '" + testdata.searchByFirstNameExpectedFirst + "'");
    await assertion.assertEqual(rows[0].lastName, testdata.searchByFirstNameExpectedLast,
      "Matched row's Last name should be '" + testdata.searchByFirstNameExpectedLast + "'");
    await assertion.assertEqual(rows[0].emailOrUsername, testdata.searchByFirstNameExpectedEmail,
      "Matched row's Email should be '" + testdata.searchByFirstNameExpectedEmail + "'");

    var banner = await schoolStudents.getData_searchBanner();
    await assertion.assertEqual(banner.bannerDisplayed, true, "The search-result banner should be displayed");
    // The term is echoed VERBATIM, preserving case.
    await assertion.assertEqual(banner.echoedTerm, testdata.searchByFirstName,
      "The banner should echo the search term verbatim");
    await assertion.assertEqual(banner.clearDisplayed, true, "A 'Clear' link should be offered");
    // The count is REPLACED by the banner while a search is active.
    await assertion.assertEqual(banner.countDisplayed, false,
      "The '(N)' count should be replaced by the search banner while a search is active");
  },

  /**
   * TST_SLST_TC_9 — the list does not filter until Search is clicked.
   * Search is submit-driven, not live.
   */
  TST_SLST_TC_9: async function (testdata) {
    var before = await schoolStudents.getData_visibleRowCount();
    var countBefore = await schoolStudents.getData_studentCount();

    sts = await schoolStudents.type_searchTermOnly(testdata.searchByFirstName);
    await assertion.assertEqual(sts.setStatus, true, "Typing into the search box should succeed");
    // Deliberate dwell: prove no debounce-driven filter fires on its own.
    await browser.pause(3000);

    await assertion.assertEqual(await schoolStudents.getData_visibleRowCount(), before,
      "Typing alone must NOT change the row count — search is submit-driven");
    await assertion.assertEqual(await schoolStudents.getData_studentCount(), countBefore,
      "Typing alone must NOT replace the '(N)' count heading");
    var banner = await schoolStudents.getData_searchBanner();
    await assertion.assertEqual(banner.bannerDisplayed, false,
      "No search banner should appear until Search is clicked");

    // Now submit, and the list must narrow — proving the dwell above was a real negative.
    sts = await schoolStudents.search_student(testdata.searchByFirstName);
    await assertion.assertEqual(sts.clickStatus, true, "Search button click should succeed");
    await assertion.assertEqual(await schoolStudents.getData_visibleRowCount(), 1,
      "After clicking Search the list should narrow to the single match");
  },

  /** TST_SLST_TC_10 — Clear restores the full list and the count heading. */
  TST_SLST_TC_10: async function (testdata) {
    sts = await schoolStudents.search_student(testdata.searchByFirstName);
    await assertion.assertEqual(sts.clickStatus, true, "Search button click should succeed");
    await assertion.assertEqual(await schoolStudents.getData_visibleRowCount(), 1,
      "Precondition: the search should have narrowed the list to one row");

    sts = await schoolStudents.clear_search();
    await assertion.assertEqual(sts.clickStatus, true, "Clear link click should succeed");

    var banner = await schoolStudents.getData_searchBanner();
    await assertion.assertEqual(banner.bannerDisplayed, false, "The search banner should be gone after Clear");
    await assertion.assertEqual(banner.countDisplayed, true, "The '(N)' count heading should be restored");
    await assertion.assertEqual(String(banner.searchBoxValue || "").trim(), "",
      "The search box should be emptied by Clear");

    // Page size is 20 and this school holds more than that, so a full first page returns.
    await assertion.assertEqual(await schoolStudents.getData_visibleRowCount(), schoolStudents.getData_pageSize(),
      "Clear should restore a full first page of students");
    await assertion.assertEqual(await schoolStudents.getData_loadMoreAvailable(), true,
      "'Load more ...' should be offered again once the full list is restored");
  },

  /** TST_SLST_TC_3 — a partial, differently-cased first name still matches. */
  TST_SLST_TC_3: async function (testdata) {
    sts = await schoolStudents.search_student(testdata.searchPartialLowercase);
    await assertion.assertEqual(sts.clickStatus, true, "Search button click should succeed");

    var rows = await schoolStudents.getData_studentRows();
    await assertion.assertEqual(rows.length > 0, true,
      "A partial, lower-case term should still match — got 0 rows for '" + testdata.searchPartialLowercase + "'");

    var found = rows.filter(function (r) {
      return r.firstName === testdata.searchByFirstNameExpectedFirst;
    });
    await assertion.assertEqual(found.length, 1,
      "'" + testdata.searchPartialLowercase + "' should match '" +
      testdata.searchByFirstNameExpectedFirst + "' — search is case-insensitive and partial");

    var banner = await schoolStudents.getData_searchBanner();
    await assertion.assertEqual(banner.echoedTerm, testdata.searchPartialLowercase,
      "The banner echoes the term with its ORIGINAL case, not the matched student's");
  },

  /**
   * TST_SLST_TC_11 — a whitespace-only term is treated as an empty search.
   *
   * Verified live 2026-08-28: it still enters the banner state (with an empty term) and
   * returns the full list. The box keeps the spaces.
   */
  TST_SLST_TC_11: async function (testdata) {
    // expectListChange:false — a whitespace term is trimmed to nothing and returns the
    // SAME full list, so the row fingerprint cannot move. Waiting on it would burn the
    // full 20s budget for no signal; wait for the banner instead.
    sts = await schoolStudents.search_student(testdata.searchWhitespaceOnly, { expectListChange: false });
    await assertion.assertEqual(sts.clickStatus, true, "Search button click should succeed");
    await assertion.assertEqual(sts.bannerApplied, true, "The search banner should appear once the search is applied");

    await assertion.assertEqual(await schoolStudents.getData_visibleRowCount(), schoolStudents.getData_pageSize(),
      "A whitespace-only search should return the full first page, not an empty list");
    await assertion.assertEqual(await schoolStudents.getData_loadMoreAvailable(), true,
      "'Load more ...' should still be offered after a whitespace-only search");

    var banner = await schoolStudents.getData_searchBanner();
    await assertion.assertEqual(banner.bannerDisplayed, true,
      "A whitespace-only term still enters the search-banner state (the term is trimmed to nothing)");
    await assertion.assertEqual(String(banner.echoedTerm || "").trim(), "",
      "The echoed term should be empty — whitespace is trimmed away");
  },

  /**
   * TST_SLST_TC_12 — a search matching no student shows a meaningful empty state.
   *
   * ⚠️ This asserts FIXED behaviour. Until at least 2026-08-22 this rendered NOTHING —
   * table removed, no message — and threw "TypeError: Cannot read properties of undefined
   * (reading 'length') at o.search" from the admin bundle. Re-checked live 2026-08-28: the
   * message renders correctly with ZERO console errors. The manual case and
   * admin-students-tab.md §7.3 were updated accordingly. Do NOT re-introduce the defect
   * expectation if this fails — investigate a regression instead.
   */
  TST_SLST_TC_12: async function (testdata) {
    sts = await schoolStudents.search_student(testdata.searchNoMatch);
    await assertion.assertEqual(sts.clickStatus, true, "Search button click should succeed");

    var empty = await schoolStudents.getData_noResultsState();
    await assertion.assertEqual(empty.rowCount, 0,
      "No student rows should be listed for a non-matching search");
    await assertion.assertEqual(empty.messageDisplayed, true,
      "An empty-state message MUST be shown (this was defect-fixed between 2026-08-22 and 2026-08-28)");

    var text = String(empty.messageText).replace(/\s+/g, " ").trim();
    await assertion.assertEqual(text, testdata.noMatchMessage.replace("{{term}}", testdata.searchNoMatch),
      "The empty-state message should match the verified copy and echo the term");

    // The table and its sort header row ARE still removed in this state — unchanged behaviour.
    await assertion.assertEqual(empty.sortHeaderPresent, false,
      "The sort header row is removed along with the table in the empty state");

    // The banner and its Clear link survive, so the admin can get back.
    var banner = await schoolStudents.getData_searchBanner();
    await assertion.assertEqual(banner.bannerDisplayed, true,
      "The search banner should still be shown in the empty state");
    await assertion.assertEqual(banner.clearDisplayed, true,
      "'Clear' must remain available so the admin can escape the empty state");
  },

  /** TST_SLST_TC_4 — searching a last name returns that student. */
  TST_SLST_TC_4: async function (testdata) {
    sts = await schoolStudents.search_student(testdata.searchByLastName);
    await assertion.assertEqual(sts.clickStatus, true, "Search button click should succeed");

    var rows = await schoolStudents.getData_studentRows();
    await assertion.assertEqual(rows.length, 1,
      "Exactly one student should match last name '" + testdata.searchByLastName + "' — got " + rows.length);
    await assertion.assertEqual(rows[0].lastName, testdata.searchByLastNameExpectedLast, "Last name should match");
    await assertion.assertEqual(rows[0].firstName, testdata.searchByLastNameExpectedFirst, "First name should match");
    await assertion.assertEqual(rows[0].emailOrUsername, testdata.searchByLastNameExpectedEmail, "Email should match");

    var banner = await schoolStudents.getData_searchBanner();
    await assertion.assertEqual(banner.echoedTerm, testdata.searchByLastName,
      "The banner should echo the last-name term verbatim");
  },

  /** TST_SLST_TC_5 — searching a full email address returns that student. */
  TST_SLST_TC_5: async function (testdata) {
    sts = await schoolStudents.search_student(testdata.searchByEmail);
    await assertion.assertEqual(sts.clickStatus, true, "Search button click should succeed");

    var rows = await schoolStudents.getData_studentRows();
    await assertion.assertEqual(rows.length, 1,
      "Exactly one student should match email '" + testdata.searchByEmail + "' — got " + rows.length);
    await assertion.assertEqual(rows[0].emailOrUsername, testdata.searchByEmail,
      "The matched row's email should be the one searched for");
    await assertion.assertEqual(rows[0].firstName, testdata.searchByLastNameExpectedFirst, "First name should match");
    await assertion.assertEqual(rows[0].lastName, testdata.searchByLastNameExpectedLast, "Last name should match");
  },

  /**
   * TST_SLST_TC_6 — an email typed in upper case still matches the lower-case account.
   * Matching is case-insensitive, but the banner does NOT normalise the term's case.
   */
  TST_SLST_TC_6: async function (testdata) {
    sts = await schoolStudents.search_student(testdata.searchByEmailUpperCase);
    await assertion.assertEqual(sts.clickStatus, true, "Search button click should succeed");

    var rows = await schoolStudents.getData_studentRows();
    await assertion.assertEqual(rows.length, 1,
      "An upper-case email should still match the lower-case account — got " + rows.length + " rows");
    // The ROW still shows the account's real, lower-case address.
    await assertion.assertEqual(rows[0].emailOrUsername, testdata.searchByEmail,
      "The row should show the account's actual lower-case email");

    var banner = await schoolStudents.getData_searchBanner();
    await assertion.assertEqual(banner.echoedTerm, testdata.searchByEmailUpperCase,
      "The banner echoes the term AS TYPED (upper case) — it does not normalise case");
  },

  /**
   * TST_SLST_TC_7 — an email containing special characters is matched exactly.
   * The + & % ^ $ characters are neither stripped nor treated as wildcards.
   */
  TST_SLST_TC_7: async function (testdata) {
    sts = await schoolStudents.search_student(testdata.searchBySpecialCharEmail);
    await assertion.assertEqual(sts.clickStatus, true, "Search button click should succeed");

    var rows = await schoolStudents.getData_studentRows();
    await assertion.assertEqual(rows.length, 1,
      "Exactly one student should match the special-character email — got " + rows.length +
      ". More than one would mean the characters were treated as wildcards.");
    await assertion.assertEqual(rows[0].emailOrUsername, testdata.searchBySpecialCharEmail,
      "The matched row's email should be the special-character address, character for character");
    await assertion.assertEqual(rows[0].firstName, testdata.searchBySpecialCharExpectedFirst, "First name should match");
    await assertion.assertEqual(rows[0].lastName, testdata.searchBySpecialCharExpectedLast, "Last name should match");

    var banner = await schoolStudents.getData_searchBanner();
    await assertion.assertEqual(banner.echoedTerm, testdata.searchBySpecialCharEmail,
      "The banner should echo the special characters verbatim, unescaped and unstripped");
  },

  /**
   * TST_SLST_TC_8 — a child account is returned when searching by its username.
   *
   * For username-based accounts the "Email address or Username" column holds the
   * USERNAME. The row's accessible name is the only place the account type is exposed —
   * there is no visible Adult/Child badge on this list.
   */
  TST_SLST_TC_8: async function (testdata) {
    sts = await schoolStudents.search_student(testdata.searchByUsername);
    await assertion.assertEqual(sts.clickStatus, true, "Search button click should succeed");

    var rows = await schoolStudents.getData_studentRows();
    await assertion.assertEqual(rows.length, 1,
      "Exactly one student should match username '" + testdata.searchByUsername + "' — got " + rows.length);
    await assertion.assertEqual(rows[0].emailOrUsername, testdata.searchByUsername,
      "The Email/Username column should hold the USERNAME for a username-based account");
    await assertion.assertEqual(rows[0].firstName, testdata.searchByUsernameExpectedFirst, "First name should match");
    await assertion.assertEqual(rows[0].lastName, testdata.searchByUsernameExpectedLast, "Last name should match");
    await assertion.assertEqual(rows[0].accountType, testdata.searchByUsernameExpectedAccountType,
      "The row's accessible name should identify this as a Child Learner");
  },

  // ── Req #6 — sort ──────────────────────────────────────────────────────────────────

  /** TST_SLST_TC_15 — the list loads sorted by First name ascending. */
  TST_SLST_TC_15: async function () {
    var status = await schoolStudents.getData_sortStatus();
    await assertion.assertEqual(status.firstName, "sorted ascending",
      "On load the First name column should own the sort, ascending");
    // The other two columns carry no indicator at all until they take the sort over.
    await assertion.assertEqual(status.lastName, null,
      "Last name should carry no sort indicator on load");
    await assertion.assertEqual(status.emailUsername, null,
      "Email/Username should carry no sort indicator on load");

    var names = pluck(await schoolStudents.getData_studentRows(), "firstName");
    await assertion.assertEqual(names.length > 1, true, "There should be several rows to compare");
    await assertion.assertEqual(isSortedBy(names, "sorted ascending"), true,
      "First names should ascend in code-point order — got: " + names.join(", "));
  },

  /** TST_SLST_TC_16 — Last name sorts ascending, then descending on a second click. */
  TST_SLST_TC_16: async function () {
    sts = await schoolStudents.click_sortBy("lastName");
    await assertion.assertEqual(sts.clickStatus, true, "Clicking the Last name header should succeed");
    await assertion.assertEqual(sts.listChanged, true,
      "The rows should actually re-order — not just the header label, which is optimistic UI");

    var asc = await schoolStudents.getData_sortStatus();
    await assertion.assertEqual(asc.lastName, "sorted ascending", "Last name should now be sorted ascending");
    // Taking over a column REMOVES the indicator from the previous one.
    await assertion.assertEqual(asc.firstName, null,
      "The First name indicator should be removed once Last name takes over the sort");
    var ascNames = pluck(await schoolStudents.getData_studentRows(), "lastName");
    await assertion.assertEqual(isSortedBy(ascNames, "sorted ascending"), true,
      "Last names should ascend in code-point order — got: " + ascNames.join(", "));

    sts = await schoolStudents.click_sortBy("lastName");
    await assertion.assertEqual(sts.clickStatus, true, "Clicking Last name a second time should succeed");
    await assertion.assertEqual(sts.listChanged, true, "The rows should re-order again");

    var desc = await schoolStudents.getData_sortStatus();
    await assertion.assertEqual(desc.lastName, "sorted descending",
      "A second click on Last name should flip the sort to descending");
    var descNames = pluck(await schoolStudents.getData_studentRows(), "lastName");
    await assertion.assertEqual(isSortedBy(descNames, "sorted descending"), true,
      "Last names should descend in code-point order — got: " + descNames.join(", "));
  },

  /**
   * TST_SLST_TC_17 — Email address or Username sorts by that column.
   *
   * This column's status span sits OUTSIDE its header button, unlike the other two, so
   * reading the button's own text would return the bare label. The page object reads it
   * by its stable id (#sortStatus-learner-ext_email) instead.
   */
  TST_SLST_TC_17: async function () {
    sts = await schoolStudents.click_sortBy("emailUsername");
    await assertion.assertEqual(sts.clickStatus, true, "Clicking the Email/Username header should succeed");
    await assertion.assertEqual(sts.listChanged, true, "The rows should actually re-order");

    var asc = await schoolStudents.getData_sortStatus();
    await assertion.assertEqual(asc.emailUsername, "sorted ascending",
      "Email/Username should be sorted ascending after the first click");
    await assertion.assertEqual(asc.firstName, null,
      "The First name indicator should be removed once Email/Username takes over");
    var ascVals = pluck(await schoolStudents.getData_studentRows(), "emailOrUsername");
    await assertion.assertEqual(isSortedBy(ascVals, "sorted ascending"), true,
      "Email/Username values should ascend — got: " + ascVals.join(", "));

    sts = await schoolStudents.click_sortBy("emailUsername");
    await assertion.assertEqual(sts.clickStatus, true, "Clicking Email/Username again should succeed");
    await assertion.assertEqual(sts.listChanged, true, "The rows should re-order again");

    var desc = await schoolStudents.getData_sortStatus();
    await assertion.assertEqual(desc.emailUsername, "sorted descending",
      "A second click should flip Email/Username to descending");
    var descVals = pluck(await schoolStudents.getData_studentRows(), "emailOrUsername");
    await assertion.assertEqual(isSortedBy(descVals, "sorted descending"), true,
      "Email/Username values should descend — got: " + descVals.join(", "));
  },

  /**
   * TST_SLST_TC_18 — sorting uses CODE-POINT order, not locale-aware collation.
   *
   * The distinguishing evidence: with Last name ascending, every capitalised surname
   * sorts before every lower-case one. A localeCompare sort would interleave them. This
   * TC fails loudly if the product ever switches to locale collation.
   */
  TST_SLST_TC_18: async function () {
    // Reload FIRST so the sort starts from the known default (First name ascending).
    // Sort state PERSISTS within the session and TC_RESET does not clear it — there is no
    // "reset sort" control, only a reload (which is exactly what TST_SLST_TC_19 proves).
    // Without this the TC inherits whatever sort ran before it, and a click on Last name
    // may produce no row movement at all, in violation of ADR-011.
    sts = await schoolStudents.reload_studentsTab();
    await assertion.assertEqual(sts.pageStatus, true, "The Students tab should reload successfully");

    sts = await schoolStudents.click_sortBy("lastName");
    await assertion.assertEqual(sts.clickStatus, true, "Clicking the Last name header should succeed");
    await assertion.assertEqual(sts.listChanged, true, "The rows should actually re-order");

    var status = await schoolStudents.getData_sortStatus();
    await assertion.assertEqual(status.lastName, "sorted ascending", "Precondition: sorted by Last name ascending");

    var names = pluck(await schoolStudents.getData_studentRows(), "lastName");
    await assertion.assertEqual(names.length > 1, true, "There should be several rows to compare");

    // 1. The order matches a code-point comparison.
    await assertion.assertEqual(isSortedBy(names, "sorted ascending"), true,
      "Last names should ascend by CODE POINT — got: " + names.join(", "));

    // 2. The stronger claim: no lower-case initial appears before an upper-case one.
    var lastUpperIdx = -1, firstLowerIdx = -1;
    for (var i = 0; i < names.length; i++) {
      var initial = String(names[i]).charAt(0);
      if (initial >= "A" && initial <= "Z") lastUpperIdx = i;
      if (firstLowerIdx === -1 && initial >= "a" && initial <= "z") firstLowerIdx = i;
    }
    // Only meaningful when the page actually holds both cases — it did on 2026-08-28.
    if (lastUpperIdx >= 0 && firstLowerIdx >= 0) {
      await assertion.assertEqual(lastUpperIdx < firstLowerIdx, true,
        "Every upper-case surname must sort before every lower-case one (code-point, not locale) — got: " +
        names.join(", "));
    }
  },

  /**
   * TST_SLST_TC_19 — the chosen sort is NOT retained across a page reload.
   *
   * Expected result CONFIRMED live 2026-08-28 — this was one of the manual batch's
   * [ASSUMED] results and is now verified: the list returns to First name ascending.
   */
  TST_SLST_TC_19: async function () {
    // Reload FIRST so the two clicks below start from the default sort and land
    // deterministically on ascending → descending. Sort persists within the session and
    // TC_RESET does not clear it (see TST_SLST_TC_18).
    sts = await schoolStudents.reload_studentsTab();
    await assertion.assertEqual(sts.pageStatus, true, "The Students tab should reload successfully");

    sts = await schoolStudents.click_sortBy("lastName");
    await assertion.assertEqual(sts.clickStatus, true, "Clicking the Last name header should succeed");
    sts = await schoolStudents.click_sortBy("lastName");
    await assertion.assertEqual(sts.clickStatus, true, "A second click should flip it to descending");

    var before = await schoolStudents.getData_sortStatus();
    await assertion.assertEqual(before.lastName, "sorted descending",
      "Precondition: the list is sorted by Last name descending before the reload");

    sts = await schoolStudents.reload_studentsTab();
    await assertion.assertEqual(sts.pageStatus, true, "The Students tab should reload successfully");

    var after = await schoolStudents.getData_sortStatus();
    await assertion.assertEqual(after.firstName, "sorted ascending",
      "After a reload the sort should return to the DEFAULT First name ascending");
    await assertion.assertEqual(after.lastName, null,
      "The Last name sort should NOT be retained across a reload");
  },

  // ── Req #7 — user guide ────────────────────────────────────────────────────────────

  /** TST_SLST_TC_20 — the user guide expands and shows the four documented actions. */
  TST_SLST_TC_20: async function (testdata) {
    var closed = await schoolStudents.getData_userGuide();
    await assertion.assertEqual(closed.panelPresent, false, "Precondition: the user guide starts collapsed");

    sts = await schoolStudents.click_expandUserGuide();
    await assertion.assertEqual(sts.clickStatus, true, "Clicking the user guide toggle should succeed");
    await assertion.assertEqual(sts.panelStatus, true, "The user guide panel should be displayed");

    var open = await schoolStudents.getData_userGuide();
    await assertion.assertEqual(open.panelPresent, true, "The panel should now be present");
    // The toggle is a DIFFERENT element in each state — collapsed is aLearner-11
    // ("User guide"), expanded is aLearner-12 ("Hide").
    await assertion.assertEqual(open.expandedTogglePresent, true,
      "The expanded-state toggle ('Hide') should now be present");
    await assertion.assertEqual(open.collapsedTogglePresent, false,
      "The collapsed-state toggle ('User guide') should be gone while the panel is open");

    var expected = testdata.userGuideLines;
    await assertion.assertEqual(open.panelLines.length, expected.length,
      "The guide should list " + expected.length + " lines — got " + open.panelLines.length +
      ": " + open.panelLines.join(" | "));
    for (var i = 0; i < expected.length; i++) {
      await assertion.assertEqual(open.panelLines[i], expected[i],
        "User guide line " + (i + 1) + " should match the verified copy");
    }
  },

  /**
   * TST_SLST_TC_21 — the user guide collapses and its panel is REMOVED from the page.
   * Not merely hidden — this is one of the few admin containers genuinely removed, so
   * the assertion is absence, not invisibility.
   */
  TST_SLST_TC_21: async function () {
    sts = await schoolStudents.click_expandUserGuide();
    await assertion.assertEqual(sts.panelStatus, true, "Precondition: the user guide is expanded");

    sts = await schoolStudents.click_collapseUserGuide();
    await assertion.assertEqual(sts.clickStatus, true, "Clicking 'Hide' should succeed");
    await assertion.assertEqual(sts.panelRemoved, true, "The panel should disappear from the page");

    var closed = await schoolStudents.getData_userGuide();
    await assertion.assertEqual(closed.panelPresent, false,
      "The guide panel must be REMOVED from the DOM when collapsed, not just hidden");
    await assertion.assertEqual(closed.panelLines.length, 0,
      "None of the guide text should remain anywhere on the page");
    await assertion.assertEqual(closed.collapsedTogglePresent, true,
      "The toggle label should revert to 'User guide'");
    await assertion.assertEqual(closed.expandedTogglePresent, false,
      "The 'Hide' toggle should be gone once the panel is closed");
  },

  // ── Req #16 — load more ────────────────────────────────────────────────────────────

  /**
   * TST_SLST_TC_22 — Load more APPENDS the remaining students.
   *
   * Asserts growth and retention, never an absolute total: this school is shared and its
   * roll moves (26 on 2026-08-22, 27 on 2026-08-28).
   */
  TST_SLST_TC_22: async function () {
    var pageSize = schoolStudents.getData_pageSize();
    var firstPage = await schoolStudents.getData_studentRows();
    await assertion.assertEqual(firstPage.length, pageSize,
      "The first page should hold exactly " + pageSize + " rows — got " + firstPage.length);
    await assertion.assertEqual(await schoolStudents.getData_loadMoreAvailable(), true,
      "Precondition: 'Load more ...' should be offered while students remain");

    sts = await schoolStudents.click_loadMore();
    await assertion.assertEqual(sts.clickStatus, true, "Clicking 'Load more ...' should succeed");
    await assertion.assertEqual(sts.listChanged, true, "The list should actually grow");
    await assertion.assertEqual(sts.rowsAfter > sts.rowsBefore, true,
      "Load more should APPEND rows — before " + sts.rowsBefore + ", after " + sts.rowsAfter);

    // The already-loaded rows must be retained, not replaced.
    var afterRows = await schoolStudents.getData_studentRows();
    for (var i = 0; i < firstPage.length; i++) {
      await assertion.assertEqual(afterRows[i].emailOrUsername, firstPage[i].emailOrUsername,
        "Row " + i + " from the first page should be RETAINED in place after Load more");
    }
  },

  /**
   * TST_SLST_TC_23 — Load more disappears once every student is loaded.
   * The link is REMOVED from the DOM, not left visible in a disabled state — so this
   * asserts absence. An "is disabled" assertion here could never fail.
   */
  TST_SLST_TC_23: async function () {
    // Reload FIRST to restore a fresh 20-row first page. Without this the TC inherits the
    // already-exhausted list from TST_SLST_TC_22 (TC_RESET clears the search but does not
    // reload), finds Load more already gone, skips the loop entirely and asserts the
    // aftermath — passing in ~0ms without ever exercising exhaustion, and depending on
    // test order in violation of ADR-011.
    sts = await schoolStudents.reload_studentsTab();
    await assertion.assertEqual(sts.pageStatus, true, "The Students tab should reload successfully");
    await assertion.assertEqual(await schoolStudents.getData_visibleRowCount(), schoolStudents.getData_pageSize(),
      "Precondition: the reload should restore a full first page");
    await assertion.assertEqual(await schoolStudents.getData_loadMoreAvailable(), true,
      "Precondition: 'Load more ...' should be offered again after the reload");

    // Keep clicking until the list is exhausted. Bounded so a product change that makes
    // the link permanent fails the TC instead of hanging the suite.
    var guard = 0;
    while ((await schoolStudents.getData_loadMoreAvailable()) === true && guard < 20) {
      sts = await schoolStudents.click_loadMore();
      await assertion.assertEqual(sts.clickStatus, true, "Each 'Load more ...' click should succeed");
      guard++;
    }
    await assertion.assertEqual(guard < 20, true,
      "'Load more ...' should stop being offered within 20 clicks — it never disappeared");
    await assertion.assertEqual(await schoolStudents.getData_loadMoreAvailable(), false,
      "'Load more ...' must be REMOVED from the page once every student is loaded");
    await assertion.assertEqual(await schoolStudents.getData_visibleRowCount() > schoolStudents.getData_pageSize(), true,
      "More than one page of students should now be listed");
  },

  /**
   * TST_SLST_TC_24 — Load more is not offered when a result set fits on one page.
   * A single-match search returns one row, well under the page size of 20.
   */
  TST_SLST_TC_24: async function (testdata) {
    sts = await schoolStudents.search_student(testdata.searchByLastName);
    await assertion.assertEqual(sts.clickStatus, true, "Search button click should succeed");

    var rows = await schoolStudents.getData_visibleRowCount();
    await assertion.assertEqual(rows < schoolStudents.getData_pageSize(), true,
      "Precondition: the result set should fit on one page — got " + rows + " rows");
    await assertion.assertEqual(await schoolStudents.getData_loadMoreAvailable(), false,
      "'Load more ...' should not be offered when the whole result set fits on one page");
  },

  /**
   * TST_SLST_TC_13 — the "Who activated the code in my school?" checkbox is a
   * SEARCH-MODE SWITCH, not a list filter.
   *
   * ⚠️ EXPECTED RESULT CORRECTED 2026-08-28. The manual case originally [ASSUMED] that
   * ticking filters the list to students who activated a code, and recorded the identical
   * ticked/unticked result on this school as an unprovable blocker. That was wrong: the
   * checkbox does not filter at all. The DOM names it — `name="activation-code-search"`.
   * Ticking re-points the search box at 16-character activation codes and reveals two
   * helper lines; the LIST MUST NOT CHANGE. (admin-students-tab.md §7.5)
   */
  TST_SLST_TC_13: async function (testdata) {
    // Baseline — capture what must NOT change.
    var countBefore = await schoolStudents.getData_studentCount();
    var rowsBefore = await schoolStudents.getData_visibleRowCount();
    var firstRowBefore = (await schoolStudents.getData_studentRows())[0];
    var loadMoreBefore = await schoolStudents.getData_loadMoreAvailable();

    var offState = await schoolStudents.getData_activationSearchMode();
    await assertion.assertEqual(offState.checked, false, "Precondition: the checkbox starts unticked");
    await assertion.assertEqual(offState.helperPanelPresent, false,
      "The activation helper text must be ABSENT from the DOM while the checkbox is unticked");

    // ── Tick ──
    sts = await schoolStudents.click_activationCheckbox();
    await assertion.assertEqual(sts.clickStatus, true, "Ticking the activation checkbox should succeed");

    var onState = await schoolStudents.getData_activationSearchMode();
    await assertion.assertEqual(onState.checked, true, "The checkbox should now be ticked");
    await assertion.assertEqual(onState.helperPanelPresent, true,
      "Ticking should reveal the activation-code helper text");
    await assertion.assertEqual(onState.helperLines.length, 2,
      "Exactly two helper lines should appear — got " + onState.helperLines.length);
    await assertion.assertEqual(onState.helperLines[0], testdata.activationHelperLine1,
      "First helper line should match the verified copy");
    await assertion.assertEqual(onState.helperLines[1], testdata.activationHelperLine2,
      "Second helper line should match the verified copy");

    // ── The list must be untouched — this is the heart of the corrected expectation ──
    await assertion.assertEqual(await schoolStudents.getData_studentCount(), countBefore,
      "The '(N)' count MUST NOT change — the checkbox switches search mode, it does not filter");
    await assertion.assertEqual(await schoolStudents.getData_visibleRowCount(), rowsBefore,
      "The number of listed students MUST NOT change when the checkbox is ticked");
    var firstRowAfter = (await schoolStudents.getData_studentRows())[0];
    await assertion.assertEqual(firstRowAfter.emailOrUsername, firstRowBefore.emailOrUsername,
      "The first listed student MUST NOT change when the checkbox is ticked");
    await assertion.assertEqual(await schoolStudents.getData_loadMoreAvailable(), loadMoreBefore,
      "'Load more ...' availability MUST NOT change when the checkbox is ticked");

    // ── Untick ──
    sts = await schoolStudents.click_activationCheckbox();
    await assertion.assertEqual(sts.clickStatus, true, "Unticking the activation checkbox should succeed");

    var backOff = await schoolStudents.getData_activationSearchMode();
    await assertion.assertEqual(backOff.checked, false, "The checkbox should be unticked again");
    await assertion.assertEqual(backOff.helperPanelPresent, false,
      "Unticking should REMOVE the helper text from the DOM");
    await assertion.assertEqual(await schoolStudents.getData_visibleRowCount(), rowsBefore,
      "The list should still be unchanged after unticking");
  }
};

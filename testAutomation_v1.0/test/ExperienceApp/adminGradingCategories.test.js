"use strict";
// Admin App - Manage grading categories: Req #4 (manage page), #5 (create grading
// category), #6 (see details page) and Req #8 (delete grading category).
// Manual source: test/Manual/C1App/AdminApp-Classes/AdminApp_Classes_tab_test_cases.md
// Module code: GCAT - pages/ExperienceApp/manageGradingCategories.page.js
//
// SCOPE NOTE: this file covers Req #4, #5, #6 and #8.
//   TST_GCAT_TC_4 (maximum-categories limit) is deliberately NOT automated. Its
//   precondition is "the school is already at its maximum", and reaching that state means
//   filling a SHARED thor school to its cap, which would break other suites mid-run. The
//   exact modal copy is captured in product knowledge; the TC stays blocked pending a
//   dedicated school or a product-supplied maximum. Deferred with the user, 2026-08-18.
//   TST_GCAT_TC_7 (Req #7) LIVES HERE but RUNS IN THE CGST SUITE - it needs the category
//   applied to a live class, which only the CGST suite produces. It is listed in
//   testExecutionFiles/.../adminClassGradeSettings.json before TST_CGST_TC_9 (the delete).
//   Registered here, not in the CGST test file, because the page it exercises is the
//   CATEGORY details page and module ownership follows the page object (AGENTS.md Rule 6).
//
// DATA SAFETY: every category these TCs create is named with the `namePrefix` from test
// data ("AutoCat_") plus a timestamp, so it is unique per run and unmistakably ours.
// TST_GCAT_TC_10 sweeps that prefix in BeforeEach - see its comment for why BeforeEach
// and NOT AfterEach.
var manageGradingCategories = require("../../pages/ExperienceApp/manageGradingCategories.page.js");
var schoolClasses = require("../../pages/ExperienceApp/schoolClasses.page.js");
var classGradeSettings = require("../../pages/ExperienceApp/classGradeSettings.page.js");

var sts;

// Exact banner copy, measured live 2026-08-18. Asserted verbatim so a wording change is
// caught rather than silently tolerated.
var BANNER_CREATED = "Grading category successfully created";
var BANNER_REMOVED = "Grading category successfully removed";

// Exact page copy, captured live 2026-08-19 (thor, FCN-CHZ-PDA). Asserted verbatim for the
// same reason as the banners: a wording change should fail a test, not pass unnoticed.
var PAGE_HEADING = "Manage grading categories";
var PAGE_DESCRIPTION =
  "Create (or remove) grading categories for your school. Categories can then be applied to a class on the class grade settings page";
var LIST_HEADING = "Grading categories";

// Details page copy. A category this suite has just created has no classes applied, so
// "(0)" is deterministic here - it is NOT a general truth about the page.
var DETAILS_ACTIVE_CLASSES_HEADING = "Active classes (0)";
var DETAILS_NO_CLASSES_MESSAGE = "The category has not been added to any active classes";

// Single character used only to prove the Save button can leave its disabled state
// (TST_GCAT_TC_5). Never saved - see the comment at its call site for why it is one char.
var SAVE_ENABLED_PROBE = "A";

var CLASS_GRADE_SETTINGS_HEADING = "Class grade settings";

/** Collapses runs of whitespace so multi-element copy compares as one line. */
function squash(s) {
  return String(s || "").replace(/\s+/g, " ").trim();
}

/** Unique, sweepable category name: <prefix><tag>_<epoch-ms>. */
function uniqueName(prefix, tag) {
  return prefix + tag + "_" + Date.now();
}

/**
 * A sweepable name of EXACTLY `len` characters, right-padded with "A".
 * Keeps the prefix at the front so the housekeeping sweep still recognises it.
 */
function nameOfLength(prefix, len) {
  var base = prefix + Date.now();
  if (base.length >= len) return base.slice(0, len);
  return base + new Array(len - base.length + 1).join("A");
}

module.exports = {
  /**
   * TST_GCAT_TC_1 - Req #4: Verify the Manage grading categories page loads with all
   * components. testdata: none used.
   *
   * The page is REACHED by BeforeEach (TST_GCAT_TC_10 -> reset_state), which navigates the
   * real School settings route. This TC therefore asserts what is on screen, not the
   * navigation - that is already covered by the housekeeping's own assertion.
   *
   * The row menu is OPENED rather than counted. Every row's "See details" and "Remove"
   * links sit in the DOM permanently whether the menu is open or not (page-object trap 5:
   * 3 rows -> 3 links present, 0 visible), so a count-based check here would pass on a
   * page where the menu never opens at all.
   *
   * Ends deliberately with the menu open, so the end-of-test screenshot shows both menu
   * items (ADR-019). The next BeforeEach closes it with Escape.
   */
  TST_GCAT_TC_1: async function () {
    var page = await manageGradingCategories.getData_pageComponents();
    console.log("TC_1 page →", page);

    await assertion.assertEqual(page.heading, PAGE_HEADING,
      "Manage grading categories heading did not match the expected copy");
    await assertion.assertEqual(page.description, PAGE_DESCRIPTION,
      "Page description did not match the expected copy");
    await assertion.assertEqual(page.listHeading, LIST_HEADING,
      "Grading categories list heading did not match the expected copy");
    await assertion.assertEqual(page.createBtnDisplayed, true,
      "'Create a grading category' button is not visible on the Manage page");

    // The row count and the readable names must agree - if they diverge, one of the two
    // reads is looking at the wrong thing and every row-index lookup in this file is suspect.
    var list = await manageGradingCategories.getData_categoryNames();
    console.log("TC_1 categories →", list.names);
    await assertion.assertEqual(page.rowCount, list.count,
      "Rendered row count (" + page.rowCount + ") does not match the number of readable category names (" +
      list.count + "): " + JSON.stringify(list.names));

    // Precondition, and it can genuinely fail: the school's own categories must be listed
    // for "each row has an Open grade options menu" to mean anything.
    await assertion.assertEqual(list.count > 0, true,
      "No grading categories are listed, so the row menu could not be verified");

    var menu = await manageGradingCategories.click_openRowMenu(list.names[0]);
    console.log("TC_1 row menu →", menu);
    await assertion.assertEqual(menu.menuDisplayed, true,
      "'Open grade options' menu did not become visible for category '" + list.names[0] + "'");
    await assertion.assertEqual(menu.seeDetailsDisplayed, true,
      "'See details' is not visible in the open row menu");
    await assertion.assertEqual(menu.removeDisplayed, true,
      "'Remove' is not visible in the open row menu");
  },

  /**
   * TST_GCAT_TC_2 - Req #5: Verify a grading category is created with a valid name.
   * testdata: { namePrefix }
   *
   * Asserts BOTH signals the app gives: the success banner (its label) and the category
   * actually appearing in the list (the data). The banner alone would pass even if the
   * category were never created - exactly the false green Invariant 13 warns about.
   *
   * Ends deliberately on the list with the category visible, so the end-of-test screenshot
   * carries the evidence. The banner lives ~15 s, so it is usually still in shot too.
   */
  TST_GCAT_TC_2: async function (testdata) {
    var name = uniqueName(testdata.namePrefix, "create");

    sts = await manageGradingCategories.click_createCategory();
    await assertion.assertEqual(sts.pageStatus, true, "Create a grading category modal did not open");

    sts = await manageGradingCategories.set_categoryName(name);
    console.log("TC_2 typed →", { intended: name, readBack: sts.readBack, settleMs: sts.settleMs });
    await assertion.assertEqual(sts.pageStatus, true,
      "Name field did not hold the typed name. Intended '" + name + "', field held '" + sts.readBack + "'");

    var saved = await manageGradingCategories.click_save(name);
    // Read the real list BEFORE asserting - an assertion throws, so anything logged after a
    // failing one never runs, and the stored name would stay invisible in the report.
    var listNow = await manageGradingCategories.getData_categoryNames();
    console.log("TC_2 saved →", { preSaveValue: saved.preSaveValue, bannerText: saved.bannerText, listed: saved.listed });
    console.log("TC_2 list now →", listNow.names);

    await assertion.assertEqual(saved.bannerShown, true, "Success banner did not appear after Save");
    await assertion.assertEqual(saved.bannerText, BANNER_CREATED, "Success banner text did not match the expected copy");
    await assertion.assertEqual(saved.listed, true,
      "Created category '" + name + "' did not appear in the list. Field held '" + saved.preSaveValue +
      "' when Save was pressed; list now: " + JSON.stringify(listNow.names));
  },

  /**
   * TST_GCAT_TC_3 - Req #5: Verify a grading category name at the 50-character maximum
   * is accepted. testdata: { namePrefix, maxNameLength }
   *
   * The input carries maxlength="50" (confirmed live 2026-08-18), so a 50-char name is the
   * boundary the product allows. The name is asserted to be exactly 50 characters before
   * it is used - otherwise a helper bug could quietly turn this into a 20-char test that
   * proves nothing about the boundary.
   */
  TST_GCAT_TC_3: async function (testdata) {
    var name = nameOfLength(testdata.namePrefix, testdata.maxNameLength);
    await assertion.assertEqual(name.length, testdata.maxNameLength,
      "Test built a name of the wrong length - the boundary would not actually be exercised");

    sts = await manageGradingCategories.click_createCategory();
    await assertion.assertEqual(sts.pageStatus, true, "Create a grading category modal did not open");

    sts = await manageGradingCategories.set_categoryName(name);
    await assertion.assertEqual(sts.pageStatus, true, "Could not type the 50-character grading category name");

    sts = await manageGradingCategories.click_save(name);
    await assertion.assertEqual(sts.bannerShown, true, "Success banner did not appear after saving a 50-character name");
    await assertion.assertEqual(sts.listed, true, "50-character category '" + name + "' did not appear in the list");
  },

  /**
   * TST_GCAT_TC_5 - Req #5: Verify a grading category cannot be created with an empty name.
   * testdata: { namePrefix }
   *
   * Checks the control BOTH ways - disabled while empty, enabled once a name is typed.
   * A one-way check would still pass against a Save button that is permanently disabled,
   * which would be a real defect this TC is meant to catch.
   *
   * Ends with the modal OPEN and the name cleared, so the end-of-test screenshot shows the
   * disabled Save. TST_GCAT_TC_10 closes it in the next BeforeEach.
   */
  TST_GCAT_TC_5: async function (testdata) {
    sts = await manageGradingCategories.click_createCategory();
    await assertion.assertEqual(sts.pageStatus, true, "Create a grading category modal did not open");

    sts = await manageGradingCategories.getData_saveEnabled();
    await assertion.assertEqual(sts.enabled, false, "Save was enabled with an empty grading category name");

    // Positive control: prove the button can change state, so the check above is meaningful.
    //
    // Deliberately a SINGLE character. What this TC is about is Save's enabled/disabled
    // behaviour, not name fidelity - so it must not be able to fail for an unrelated typing
    // reason. One character is also immune to the dropped-keystroke problem that the
    // top-up loop in set_categoryName exists to absorb. Nothing here is ever saved.
    sts = await manageGradingCategories.set_categoryName(SAVE_ENABLED_PROBE);
    await assertion.assertEqual(sts.pageStatus, true,
      "Could not put a single character into the name field (field held '" + sts.readBack + "')");
    sts = await manageGradingCategories.getData_saveEnabled();
    await assertion.assertEqual(sts.enabled, true, "Save stayed disabled even after a valid name was typed");

    // Back to empty - this is the state the screenshot must show. Nothing is saved.
    sts = await manageGradingCategories.set_categoryName("");
    await assertion.assertEqual(sts.pageStatus, true, "Could not clear the grading category name");
    sts = await manageGradingCategories.getData_saveEnabled();
    await assertion.assertEqual(sts.enabled, false, "Save did not return to disabled after the name was cleared");
    sts = await manageGradingCategories.getData_createModalDisplayed();
    await assertion.assertEqual(sts.displayed, true, "Create modal was not still open at the end of the test");
  },

  /**
   * TST_GCAT_TC_6 - Req #6: Verify the grading category "See details" page opens.
   * testdata: { namePrefix }
   *
   * Creates its OWN category first rather than opening one of the school's three shared
   * ones. Two reasons, both about determinism on a shared environment:
   *   - BeforeEach sweeps every AutoCat_* category, so a category created by an earlier TC
   *     is already gone by the time this one runs - it cannot borrow one.
   *   - A brand-new category is GUARANTEED to have zero classes applied, which is what
   *     makes "Active classes (0)" and the empty-state copy safe to assert verbatim. A
   *     shared category could have a class attached by another team at any time.
   *
   * Ends deliberately ON the details page so the end-of-test screenshot proves it opened
   * (ADR-019). That page has no School settings toggle, so the next BeforeEach steps back
   * via its own Back link - see page-object trap 6.
   */
  TST_GCAT_TC_6: async function (testdata) {
    var name = uniqueName(testdata.namePrefix, "details");

    sts = await manageGradingCategories.create_category(name);
    await assertion.assertEqual(sts.pageStatus, true,
      "Could not create the precondition category '" + name + "' for the See details check");

    var opened = await manageGradingCategories.click_seeDetails(name);
    console.log("TC_6 opened →", opened);
    await assertion.assertEqual(opened.urlMatched, true,
      "URL did not change to the category details route (.../manage-grading-categories/<id>/classes)");
    await assertion.assertEqual(opened.pageStatus, true,
      "'See details' page did not load for category '" + name + "'");

    var details = await manageGradingCategories.getData_detailsPage();
    console.log("TC_6 details →", details);
    await assertion.assertEqual(details.heading, name,
      "Details page title is not the category name");
    await assertion.assertEqual(details.activeClassesHeading, DETAILS_ACTIVE_CLASSES_HEADING,
      "Active classes heading did not match the expected copy for a category with no classes");
    await assertion.assertEqual(details.noClassesDisplayed, true,
      "The 'no active classes' empty state is not visible on a newly created category's details page");
    await assertion.assertEqual(details.noClassesMessage, DETAILS_NO_CLASSES_MESSAGE,
      "Empty-state message did not match the expected copy");
  },

  /**
   * TST_GCAT_TC_9 - Req #8: Verify removing a grading category can be cancelled.
   * testdata: { namePrefix, removeModalCopy }
   *
   * Creates its own category first so the TC can run standalone, and so the destructive
   * confirmation is only ever pointed at OUR data - never at a pre-existing school
   * category, where a misfire would delete someone else's work.
   *
   * Ends on the list with the category still present - that is the evidence.
   */
  TST_GCAT_TC_9: async function (testdata) {
    var name = uniqueName(testdata.namePrefix, "cancelremove");

    sts = await manageGradingCategories.create_category(name);
    await assertion.assertEqual(sts.pageStatus, true, "Precondition failed: could not create '" + name + "' to cancel the removal of");

    sts = await manageGradingCategories.click_removeCategory(name);
    await assertion.assertEqual(sts.pageStatus, true, "Remove confirmation modal did not open");

    sts = await manageGradingCategories.getData_removeModal();
    await assertion.assertEqual(sts.displayed, true, "Remove confirmation modal was not displayed");
    await assertion.assert(sts.text.indexOf(testdata.removeModalCopy) !== -1,
      "Remove confirmation copy did not contain the expected warning. Actual: " + sts.text);

    sts = await manageGradingCategories.click_cancelRemove();
    await assertion.assertEqual(sts.pageStatus, true, "Remove confirmation modal did not close after 'No, go back'");

    sts = await manageGradingCategories.getData_categoryListed(name);
    await assertion.assertEqual(sts.listed, true, "Category '" + name + "' was removed even though the confirmation was cancelled");
  },

  /**
   * TST_GCAT_TC_8 - Req #8: Verify a grading category is removed after confirmation.
   * testdata: { namePrefix }
   *
   * Creates its own category, and asserts it IS listed before removing it - "it is gone
   * now" proves nothing if it was never there.
   *
   * Ends on the list without the category - that is the evidence.
   */
  TST_GCAT_TC_8: async function (testdata) {
    var name = uniqueName(testdata.namePrefix, "remove");

    sts = await manageGradingCategories.create_category(name);
    await assertion.assertEqual(sts.pageStatus, true, "Precondition failed: could not create '" + name + "' to remove");

    sts = await manageGradingCategories.getData_categoryListed(name);
    await assertion.assertEqual(sts.listed, true, "Category '" + name + "' was not listed before the removal - the removal check would be meaningless");

    sts = await manageGradingCategories.click_removeCategory(name);
    await assertion.assertEqual(sts.pageStatus, true, "Remove confirmation modal did not open");

    sts = await manageGradingCategories.click_confirmRemove(name);
    await assertion.assertEqual(sts.bannerShown, true, "Success banner did not appear after 'Yes, remove'");
    await assertion.assertEqual(sts.bannerText, BANNER_REMOVED, "Removal banner text did not match the expected copy");
    await assertion.assertEqual(sts.removed, true, "Category '" + name + "' was still listed after confirming the removal");
  },

  /**
   * TST_GCAT_TC_7 (Positive, Req #7) - the class grade settings page launches from a grading
   * category's details page.
   *
   * RUNS INSIDE THE CGST SUITE, not the GCAT one: its precondition is "the category is
   * applied to >= 1 active class", and TST_CGST_TC_3 is what applies (and SAVES)
   * `categoryName` onto the class that suite creates. Slotted before TST_CGST_TC_9.
   *
   * ⚠ THIS PAGE COUNTS *ACTIVE* CLASSES ONLY - its heading reads `Active classes (N)`, where
   * the equivalent scales page reads `Classes (N)` and includes Deleted rows. That single
   * difference is why this TC sat blocked for weeks: all three categories on FCN-CHZ-PDA
   * read `Active classes (0)` because every class they had ever been applied to had since
   * been deleted. The row therefore disappears the moment the class is deleted, which is
   * exactly why this must run BEFORE the suite's cleanup.
   *
   * As on the scales page, the manual case's "click a listed class" is wrong - the class name
   * is plain text and the row's only control is a "Class grade settings" link. Captured live
   * 2026-08-20; corrected in the manual register.
   *
   * The class key is resolved at runtime for the same reason as TST_GSCL_TC_7 - see that
   * TC's comment for the full rationale.
   */
  TST_GCAT_TC_7: async function (testdata) {
    // --- 1. Resolve the class under test, and its unique key, from the Classes tab. -------
    sts = await schoolClasses.return_toClassesTab();
    await assertion.assertEqual(
      sts.pageStatus, true,
      "Could not return to the Classes tab to resolve the class under test"
    );

    // Clear before searching - search_class() is not idempotent and the term persists
    // server-side, so re-searching the same term waits out its budget and fails. See the
    // full explanation on TST_GSCL_TC_7, which failed this way on its first run.
    await schoolClasses.clear_search();
    sts = await schoolClasses.search_class(testdata.className);
    await assertion.assertEqual(sts.pageStatus, true, "The class search did not settle");
    var rows = await schoolClasses.getData_classRows();
    var mine = rows.filter(function (r) { return String(r.name).trim() === testdata.className; });
    // Cleared before asserting - the search term persists server-side into the next run.
    await schoolClasses.clear_search();
    await assertion.assertEqual(
      mine.length, 1,
      "Expected exactly one ACTIVE class named '" + testdata.className + "' to resolve its " +
        "key, found " + mine.length
    );
    var classKey = mine[0].key;
    await assertion.assert(
      classKey !== "",
      "Could not read the class key for '" + testdata.className + "'"
    );

    // --- 2. Open the category's See details page by the real user route. ------------------
    sts = await manageGradingCategories.navigate_fromClassesTab();
    await assertion.assertEqual(
      sts.pageStatus, true, "Could not open the Manage grading categories page"
    );

    sts = await manageGradingCategories.click_seeDetails(testdata.categoryName);
    await assertion.assertEqual(
      sts.pageStatus, true,
      "See details did not open for grading category '" + testdata.categoryName + "'"
    );

    // --- 3. The class the category was applied to is listed on that page. -----------------
    var details = await manageGradingCategories.getData_detailsPage();
    await assertion.assertEqual(
      details.noClassesDisplayed, false,
      "The category still shows its empty state after being applied to a class"
    );

    var row = await manageGradingCategories.getData_detailsClassRow(classKey);
    await assertion.assertEqual(
      row.found, true,
      "Class '" + testdata.className + "' (" + classKey + ") is not listed on the details " +
        "page for category '" + testdata.categoryName + "' after being applied to it"
    );
    await assertion.assertEqual(
      squash(row.name), testdata.className,
      "The listed row's class name does not match the class under test"
    );

    // --- 4. The row's link opens THAT class's grade settings page. ------------------------
    sts = await manageGradingCategories.click_classGradeSettingsByKey(classKey);
    await assertion.assertEqual(
      sts.pageStatus, true,
      "'Class grade settings' did not open the grade settings page from the category's " +
        "details page"
    );

    var page = await classGradeSettings.getData_pageLayout();
    await assertion.assertEqual(
      squash(page.heading), CLASS_GRADE_SETTINGS_HEADING,
      "The destination is not the Class grade settings page"
    );
    await assertion.assertEqual(
      squash(page.className), testdata.className,
      "The grade settings page opened for the wrong class"
    );
  },

  /**
   * TST_GCAT_TC_10 - housekeeping. Puts the page into a known state: on the Manage grading
   * categories page, no modal open, and no category left over from a previous run.
   *
   * REGISTERED IN BeforeEach ONLY - deliberately not AfterEach. The mochawesome screenshot
   * is taken by a ROOT afterEach hook (core/runner/playwright.setup.js), and Mocha runs
   * root afterEach hooks AFTER the suite-level ones that execute the exec file's AfterEach
   * list. Sweeping in AfterEach would therefore delete each category a moment BEFORE its
   * screenshot was taken, and every create/remove TC would be evidenced by a picture of an
   * empty list. Sweeping only in BeforeEach keeps the evidence and still guarantees a clean
   * start - including after a crashed run, whose leftovers would otherwise accumulate
   * against the school's maximum-categories limit.
   *
   * The sweep is asserted, not fire-and-forget: a reset that silently fails would bleed
   * state into the next TC (Invariant 13).
   */
  TST_GCAT_TC_10: async function (testdata) {
    sts = await manageGradingCategories.reset_state(testdata.namePrefix);
    await assertion.assertEqual(sts.pageStatus, true,
      "Housekeeping reset failed - could not remove: " + JSON.stringify(sts.failed));
  }
};

"use strict";
// Admin App - Manage grading categories: Req #5 (create grading category) and
// Req #8 (delete grading category).
// Manual source: test/Manual/C1App/AdminApp-Classes/AdminApp_Classes_tab_test_cases.md
// Module code: GCAT - pages/ExperienceApp/manageGradingCategories.page.js
//
// SCOPE NOTE: this batch covers Req #5 and #8 ONLY.
//   TST_GCAT_TC_4 (maximum-categories limit) is deliberately NOT automated. Its
//   precondition is "the school is already at its maximum", and reaching that state means
//   filling a SHARED thor school to its cap, which would break other suites mid-run. The
//   exact modal copy is captured in product knowledge; the TC stays blocked pending a
//   dedicated school or a product-supplied maximum. Deferred with the user, 2026-08-18.
//   TST_GCAT_TC_1 / TC_6 / TC_7 belong to Req #4 / #6 / #7 and are out of scope here.
//
// DATA SAFETY: every category these TCs create is named with the `namePrefix` from test
// data ("AutoCat_") plus a timestamp, so it is unique per run and unmistakably ours.
// TST_GCAT_TC_10 sweeps that prefix in BeforeEach - see its comment for why BeforeEach
// and NOT AfterEach.
var manageGradingCategories = require("../../pages/ExperienceApp/manageGradingCategories.page.js");

var sts;

// Exact banner copy, measured live 2026-08-18. Asserted verbatim so a wording change is
// caught rather than silently tolerated.
var BANNER_CREATED = "Grading category successfully created";
var BANNER_REMOVED = "Grading category successfully removed";

// Single character used only to prove the Save button can leave its disabled state
// (TST_GCAT_TC_5). Never saved - see the comment at its call site for why it is one char.
var SAVE_ENABLED_PROBE = "A";

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

"use strict";
// Admin App - Class grade settings: Requirement #22.
// Manual source: test/Manual/C1App/AdminApp-Classes/AdminApp_Classes_tab_test_cases.md
// Module code: CGST - pages/ExperienceApp/classGradeSettings.page.js
//
// TC_1..TC_6 are the six manual cases. TC_7 and TC_8 are automation-only helpers with no
// manual counterpart (housekeeping and "launch the class under test") - same pattern as
// TST_GSCL_TC_13 / TST_CCLS_TC_23.
//
// DATA STRATEGY (agreed with the user 2026-08-20) - this suite OWNS its data:
//   The exec file CREATES a throwaway class in the Test list (reusing the existing
//   TST_CCLS_* create chain), runs CGST against it, and DELETES it in After. Nothing
//   belonging to anyone else is modified.
//   Measured live 2026-08-20: a new class is visible in the Active list ~24s after Create
//   and fully launchable with a working grade-settings page well inside a minute, so the
//   product's "can take up to 12 hours" copy does NOT prevent same-run use. TC_8 still POLLS
//   for the row rather than pausing.
//
//   The class needs COURSE MATERIAL - the per-material Weightage row is what TC_3 and TC_6
//   manipulate, and a class with no material has nothing to weight.
//
//   The scale and category this suite selects (`scaleName` / `categoryName` in the test data)
//   BELONG TO OTHER PEOPLE - on FCN-CHZ-PDA the only options are "new Grading Auto" and
//   "new catagory"/"new Grading Category"/"some". Selecting one only ASSOCIATES it with our
//   own throwaway class; it never edits or deletes the scale/category itself. TC_2 asserts
//   that explicitly (see its "unchanged" check). User approved this 2026-08-20.
//
// DELETE IS SOFT: the class leaves Active and reappears in Ended with status "Deleted"
// (verified live). So the After-block delete keeps Active clean but does NOT stop rows
// accumulating in Ended - which is exactly why TC_7 sweeps Active before creating.
var classGradeSettings = require("../../pages/ExperienceApp/classGradeSettings.page.js");
var schoolClasses = require("../../pages/ExperienceApp/schoolClasses.page.js");
var activeClass = require("../../pages/ExperienceApp/activeClass.page.js");

var sts;

/**
 * URL of the class THIS RUN created, captured by TST_CGST_TC_8 and consumed by TST_CGST_TC_9.
 *
 * Module-scoped state between two TCs is normally against the rules (TCs are stateless), and
 * it is justified here for one reason: CLEANUP MUST NOT DEPEND ON THE PART THAT BREAKS.
 * Cleanup previously re-found the class by searching the Classes tab - the same search path
 * whose failure is what left the class behind in the first place. Three separate runs on
 * 2026-08-20 leaked a real class onto a SHARED school for exactly that reason.
 *
 * A direct URL needs no search, no row matching and no list-change wait, so it survives almost
 * any mid-suite failure. The search sweep remains as the fallback when this is empty (the run
 * died before TC_8, so no class of ours can exist yet - but sweep anyway, cheaply).
 */
var createdClassUrl = "";

// Exact page copy, captured live 2026-08-20 (thor, FCN-CHZ-PDA). These resolve the
// [ASSUMED] markers on TST_CGST_TC_2 / TC_3 / TC_6 in the manual document.
var PAGE_HEADING = "Class grade settings";
var TOTAL_LABEL = "Total grade:";
var ADD_CATEGORY_LABEL = "Add a grading category";
// The link's own label flips once a category row exists - trap 6 in the page object.
var ADD_ANOTHER_CATEGORY_LABEL = "Add another grading category";
var TOTAL_ERROR_COPY = "Your weighting choices exceed the maximum of 100%";
var FIELD_ERROR_COPY = "Please enter a number 0-100";
var SECTION_HEADINGS = ["Grading Scale", "Score settings"];
var SCORE_CALC_HEADING = "Score calculation";

/** Collapses whitespace runs so copy is compared by wording, not layout. */
function squash(s) {
  return String(s == null ? "" : s).replace(/\s+/g, " ").trim();
}

/**
 * How long TC_8 will wait for a freshly created class to appear (measured ~24s on a healthy
 * Thor, 2026-08-20).
 *
 * MUST STAY COMFORTABLY BELOW MOCHA'S TEST TIMEOUT (.mocharc.js: 120000). The first build set
 * this to exactly 120000, so mocha killed the test at the same instant the poll expired and
 * the failure surfaced as a generic "Timeout of 120000ms exceeded" instead of this TC's own
 * message. A poll budget is only useful if the runner lets it finish and report.
 *
 * [2026-08-20] Raised 90000 -> 100000 after a run where the class was NOT visible at 92s but
 * WAS present ~25s later (the cleanup sweep found and deleted it). So creation genuinely
 * exceeded 90s on a loaded Thor — measured against ~24s on a responsive one.
 *
 * 100000 is close to the practical ceiling: mocha's 120000 has to cover this poll AND the
 * launch that follows. If creation regularly needs more than this, the fix is NOT a bigger
 * number here — it is either raising mocha's timeout (a PROTECTED file, needs confirmation)
 * or splitting the wait and the launch into two test cases so each gets its own budget.
 */
var CLASS_APPEAR_TIMEOUT = 100000;

/**
 * Deletes every Active class named exactly `className`, from the Classes tab, and leaves the
 * search cleared. Shared by TC_7 (before creating) and TC_9 (after testing).
 *
 * Assumes the Classes tab is already on screen. Returns how many it removed.
 *
 * Every step is ASSERTED rather than wrapped in a try/catch: a sweep that quietly fails is
 * worse than one that stops the run, because it hands the next TC an ambiguous list
 * (Invariant 13). The loop is bounded - a runaway delete loop on a SHARED school would be
 * far worse than a failed assertion.
 */
async function sweepClassesNamed(className) {
  var removed = 0;
  for (var attempt = 0; attempt < 10; attempt++) {
    /*
     * CLEAR BEFORE EVERY SEARCH. search_class() waits for the class list to CHANGE, so
     * searching a term that is ALREADY applied is a no-op that waits out its full budget and
     * then reports failure. The term persists server-side and survives a delete redirect, so
     * without this the second iteration - and any call after TST_CGST_TC_8 has searched -
     * fails for a reason that has nothing to do with the sweep. clear_search() is a no-op
     * when nothing is searched, so this costs nothing in the common case.
     */
    await schoolClasses.clear_search();
    var found = await schoolClasses.search_class(className);
    await assertion.assertEqual(
      found.pageStatus, true,
      "The class search did not return a settled list while sweeping '" + className + "'"
    );
    var rows = await schoolClasses.getData_classRows();
    var match = -1;
    for (var i = 0; i < rows.length; i++) {
      if (String(rows[i].name).trim() === className) { match = i; break; }
    }
    if (match === -1) break;

    var launched = await schoolClasses.click_className(match, "active");
    await assertion.assertEqual(
      launched.pageStatus, true,
      "Could not launch class '" + className + "' in order to delete it"
    );
    var opened = await activeClass.click_actionButton();
    await assertion.assertEqual(opened, true, "Actions menu did not open while deleting '" + className + "'");
    var deleted = await activeClass.delete_class();
    await assertion.assertEqual(deleted.pageStatus, true, "Class '" + className + "' could not be deleted");
    removed++;

    var back = await schoolClasses.isInitialized();
    await assertion.assertEqual(
      back.pageStatus, true,
      "The Classes tab did not return after deleting '" + className + "'"
    );
  }
  // ALWAYS leave the search cleared - it persists SERVER-SIDE and would poison the next run.
  await schoolClasses.clear_search();
  return removed;
}

module.exports = {
  /**
   * TST_CGST_TC_1 (Positive) - the Class grade settings page launches from a class page.
   *
   * Assumes the class page is already open (TC_8 leaves it there) and drives the real user
   * path: Actions -> Class grade settings. Deliberately NOT a URL jump - a break in that menu
   * route must fail the run rather than be routed around (Invariant 14).
   *
   * Asserts every section Requirement #22 names, so a silently-missing section fails here
   * rather than confusing a later TC.
   */
  TST_CGST_TC_1: async function (testdata) {
    sts = await activeClass.click_actionButton();
    await assertion.assertEqual(sts, true, "Actions menu was not opened on the class page");

    sts = await activeClass.click_classGradeSettings();
    await assertion.assertEqual(
      sts.pageStatus, true,
      "'Class grade settings' did not open the grade-weighting page"
    );

    var layout = await classGradeSettings.getData_pageLayout();
    await assertion.assertEqual(layout.heading, PAGE_HEADING, "Page heading is not as expected");
    await assertion.assertEqual(
      layout.className, testdata.className,
      "The page does not name the class under test"
    );
    await assertion.assertEqual(
      layout.sectionHeadings.join("|"), SECTION_HEADINGS.join("|"),
      "Grading Scale / Score settings sections are not both present"
    );
    await assertion.assertEqual(
      squash(layout.scoreCalcHeadingText), SCORE_CALC_HEADING,
      "'Score calculation' section is missing"
    );
    await assertion.assertEqual(layout.changeScaleDisplayed, true, "'Change' (grading scale) is not displayed");
    await assertion.assertEqual(layout.overrideDisplayed, true, "Score-settings override toggle is not displayed");
    await assertion.assertEqual(
      layout.scaleName, testdata.defaultScaleName,
      "A new class did not start on the school's default grading scale"
    );
    // The class was created WITH material, so exactly one weightage row must exist. A zero
    // here means the create chain silently dropped the material and TC_3/TC_6 cannot work.
    await assertion.assertEqual(layout.materialCount, 1, "Expected exactly one course material on the class");
    await assertion.assertEqual(layout.weightageCount, 1, "Expected exactly one material weightage input");
    await assertion.assertEqual(squash(layout.totalLabel), TOTAL_LABEL, "'Total grade:' label is missing");
    await assertion.assertEqual(layout.totalValue, "100%", "A new class should total 100%");
    await assertion.assertEqual(
      squash(layout.addCategoryText), ADD_CATEGORY_LABEL,
      "'Add a grading category' link is missing"
    );
    await assertion.assertEqual(layout.saveDisplayed, true, "'Save changes' is not displayed");
    // The app's own dirty-state signal: an untouched form must not be saveable.
    await assertion.assertEqual(layout.saveDisabled, true, "'Save changes' should be disabled on a pristine form");
  },

  /**
   * TST_CGST_TC_2 (Positive) - the grading scale can be changed for a class.
   * Resolves the [ASSUMED] on the change-scale selector, and unblocks TST_GSCL_TC_7.
   *
   * The scale selected belongs to someone else, so this TC also proves we did not damage it:
   * the modal renders each scale's full definition (name, target score, bands), so its row
   * text is captured BEFORE applying and re-read AFTER saving and compared. That check is the
   * reason the user approved referencing a third-party scale at all - it must never be
   * weakened to "the name is still there".
   */
  TST_CGST_TC_2: async function (testdata) {
    sts = await classGradeSettings.click_changeScale();
    await assertion.assertEqual(sts.pageStatus, true, "Change grading scale modal did not open");

    var modal = await classGradeSettings.getData_scaleModal();
    await assertion.assertEqual(modal.shown, true, "Grading scale modal is not displayed");
    await assertion.assert(
      modal.scaleLabels.length > 1,
      "Only one grading scale is offered - there is nothing to change to"
    );
    await assertion.assert(
      modal.activeScale.indexOf(testdata.defaultScaleName) !== -1,
      "The modal does not show the school default as the currently applied scale"
    );

    // Full definition of the target scale, as rendered before we touch anything.
    var before = await classGradeSettings.getData_scaleRowText(testdata.scaleName);
    await assertion.assert(
      before !== "",
      "Target grading scale '" + testdata.scaleName + "' is not offered on this school"
    );

    sts = await classGradeSettings.select_scale(testdata.scaleName);
    await assertion.assertEqual(
      sts.pageStatus, true,
      "Grading scale '" + testdata.scaleName + "' could not be selected"
    );

    sts = await classGradeSettings.click_applyScale();
    await assertion.assertEqual(sts.pageStatus, true, "Apply did not close the grading scale modal");

    sts = await classGradeSettings.click_saveChanges();
    await assertion.assertEqual(sts.pageStatus, true, "Save changes did not complete after changing the scale");

    var applied = await classGradeSettings.getData_appliedScale();
    await assertion.assertEqual(
      applied.name, testdata.scaleName,
      "The class is not showing the newly applied grading scale"
    );

    // The scale itself must be untouched - we only associated it with our class.
    sts = await classGradeSettings.click_changeScale();
    await assertion.assertEqual(sts.pageStatus, true, "Could not reopen the grading scale modal to verify");
    var after = await classGradeSettings.getData_scaleRowText(testdata.scaleName);
    await assertion.assertEqual(
      squash(after), squash(before),
      "The grading scale's own definition changed - applying it to a class must not modify it"
    );
    sts = await classGradeSettings.click_closeScaleModal();
    await assertion.assertEqual(sts.pageStatus, true, "Grading scale modal did not close");
  },

  /**
   * TST_CGST_TC_3 (Positive) - a grading category can be added to a class.
   * Resolves the [ASSUMED] on the add-category selector, and unblocks TST_GCAT_TC_7.
   *
   * The manual steps do not mention touching the material weightage, but they must: the
   * material already holds 100%, and the product refuses to save unless the total is exactly
   * 100%. So the material is reduced to `materialWeightage` first and the category takes the
   * remainder. Adding that step is what makes the manual case executable at all.
   */
  TST_CGST_TC_3: async function (testdata) {
    sts = await classGradeSettings.click_addCategory();
    await assertion.assertEqual(sts.pageStatus, true, "'Add a grading category' did not add a category row");
    await assertion.assertEqual(sts.rowsAfter, sts.rowsBefore + 1, "A category row was not added");
    // The link relabels itself once a row exists - asserted because a later TC would
    // otherwise silently match the wrong wording.
    await assertion.assertEqual(
      squash(sts.labelAfter), ADD_ANOTHER_CATEGORY_LABEL,
      "The add-category link did not relabel after a row was added"
    );

    sts = await classGradeSettings.click_categoryPicker();
    await assertion.assertEqual(sts.pageStatus, true, "The grading category dropdown did not open");

    var options = await classGradeSettings.getData_categoryOptions();
    await assertion.assert(
      options.names.indexOf(testdata.categoryName) !== -1,
      "Grading category '" + testdata.categoryName + "' is not offered on this school"
    );

    sts = await classGradeSettings.select_category(testdata.categoryName);
    await assertion.assertEqual(
      sts.pageStatus, true,
      "Grading category '" + testdata.categoryName + "' could not be selected"
    );

    // Make room for the category so the total can reach exactly 100%.
    sts = await classGradeSettings.set_materialWeightage(0, 0, testdata.materialWeightage);
    await assertion.assertEqual(sts.set, true, "Material weightage was not set");

    sts = await classGradeSettings.set_categoryWeightage(0, testdata.categoryWeightage);
    await assertion.assertEqual(sts.set, true, "Category weightage was not set");

    // Both fields are blurred by set_* (trap 1), so the total is now the real model value.
    var totals = await classGradeSettings.getData_totals();
    await assertion.assertEqual(totals.totalValue, "100%", "Weightages do not total 100% before saving");
    await assertion.assertEqual(totals.errorCount, 0, "A validation error is showing on a valid form");

    sts = await classGradeSettings.click_saveChanges();
    await assertion.assertEqual(sts.pageStatus, true, "Save changes did not complete after adding the category");

    // Evidence: the row survived the save (ADR-019 - this TC ends on the screen proving it).
    await assertion.assertEqual(
      await classGradeSettings.getData_categoryRowCount(), 1,
      "The grading category did not persist after saving"
    );
  },

  /**
   * TST_CGST_TC_4 (Positive) - the score calculation (Best / First score) can be changed.
   */
  TST_CGST_TC_4: async function (testdata) {
    var initial = await classGradeSettings.getData_scoreCalc();
    await assertion.assertEqual(
      initial.current, testdata.scoreCalcDefault,
      "Score calculation did not start on the expected default"
    );

    sts = await classGradeSettings.click_scoreCalcDropdown();
    await assertion.assertEqual(sts.pageStatus, true, "The score calculation dropdown did not open");

    var options = await classGradeSettings.getData_scoreCalcOptions();
    await assertion.assert(
      options.names.indexOf(testdata.scoreCalcTarget) !== -1,
      "Score type '" + testdata.scoreCalcTarget + "' is not offered"
    );

    sts = await classGradeSettings.select_scoreCalc(testdata.scoreCalcTarget);
    await assertion.assertEqual(
      sts.pageStatus, true,
      "Score type did not change to '" + testdata.scoreCalcTarget + "'"
    );

    sts = await classGradeSettings.click_saveChanges();
    await assertion.assertEqual(sts.pageStatus, true, "Save changes did not complete after changing the score type");

    var afterSave = await classGradeSettings.getData_scoreCalc();
    await assertion.assertEqual(
      afterSave.current, testdata.scoreCalcTarget,
      "The saved score type is not the one selected"
    );
  },

  /**
   * TST_CGST_TC_5 (Positive) - the teacher score-override setting can be toggled.
   *
   * Asserts the flip against the value read immediately before it, rather than a hardcoded
   * true/false, so the TC stays correct whichever state a previous run left behind.
   */
  TST_CGST_TC_5: async function (testdata) {
    var before = await classGradeSettings.getData_override();
    await assertion.assertEqual(before.displayed, true, "The score-override toggle is not displayed");

    sts = await classGradeSettings.click_overrideToggle();
    await assertion.assertEqual(sts.pageStatus, true, "The score-override toggle did not change state");
    await assertion.assertEqual(sts.after, !before.checked, "The toggle did not flip to the opposite state");
    // Recorded rather than asserted: the warning is worded for turning the setting ON, so
    // whether the OFF direction also warns is still unverified. The run log settles it.
    console.log(
      "TST_CGST_TC_5 toggled " + before.checked + " -> " + sts.after +
      "; confirmation dialog shown: " + sts.confirmShown
    );

    sts = await classGradeSettings.click_saveChanges();
    await assertion.assertEqual(sts.pageStatus, true, "Save changes did not complete after toggling the override");

    var after = await classGradeSettings.getData_override();
    await assertion.assertEqual(
      after.checked, !before.checked,
      "The override setting was not saved in the state it was toggled to"
    );
  },

  /**
   * TST_CGST_TC_6 (Edge) - the total grade weightage must equal 100%.
   * Resolves the [ASSUMED] on the validation copy.
   *
   * THE TRAP THIS TC EXISTS TO CATCH (measured live 2026-08-20): the total and the Save
   * button only update ON BLUR. Mid-edit the page still showed "Total grade: 100%" AND Save
   * ENABLED while the real total was 600%. set_materialWeightage blurs before returning, so
   * everything below reads the settled model - never remove that blur.
   *
   * Runs LAST because it deliberately leaves the form invalid; it reloads to discard.
   */
  TST_CGST_TC_6: async function (testdata) {
    sts = await classGradeSettings.set_materialWeightage(0, 0, testdata.invalidMaterialWeightage);
    await assertion.assertEqual(sts.set, true, "The invalid material weightage was not entered");

    var totals = await classGradeSettings.getData_totals();
    await assertion.assertEqual(
      totals.totalValue, testdata.invalidTotal,
      "The running total did not reflect the invalid weightage"
    );
    await assertion.assertEqual(
      squash(totals.totalError), TOTAL_ERROR_COPY,
      "The over-100% validation message is not as expected"
    );

    // Saving must be PREVENTED while the total is wrong - the point of the requirement.
    var save = await classGradeSettings.getData_saveState();
    await assertion.assertEqual(
      save.disabled, true,
      "'Save changes' is enabled while the total grade is not 100% - the validation is not enforced"
    );

    // A single field outside 0-100 raises its own message alongside the total's.
    sts = await classGradeSettings.set_materialWeightage(0, 0, testdata.outOfRangeWeightage);
    await assertion.assertEqual(sts.set, true, "The out-of-range material weightage was not entered");
    totals = await classGradeSettings.getData_totals();
    await assertion.assertEqual(
      squash(totals.fieldError), FIELD_ERROR_COPY,
      "The per-field 0-100 validation message is not as expected"
    );

    // Discard - trap 7: Cancel does NOT reset the form, only a reload does.
    sts = await classGradeSettings.reload_page();
    await assertion.assertEqual(sts.pageStatus, true, "The page did not reload after discarding the invalid form");
    var restored = await classGradeSettings.getData_totals();
    await assertion.assertEqual(restored.totalValue, "100%", "The discarded edit was not rolled back");
    await assertion.assertEqual(restored.errorCount, 0, "A validation error survived the reload");
  },

  /**
   * TST_CGST_TC_7 (housekeeping, no manual counterpart) - removes any leftover class named
   * `className` from the Active list BEFORE this run creates its own.
   *
   * WHY THIS IS NEEDED: TST_CCLS_TC_1 takes the class name from test data, so every run
   * creates the SAME name (it is shared by three other suites and must not be changed to
   * self-generate). Delete is soft, so a crashed run leaves a live class behind - and two
   * classes with one name make "launch the class under test" ambiguous. Verified live that
   * this school already carries duplicate AutoClass_* names from exactly this cause.
   *
   * BeforeEach-style placement (see ADR-019): sweeping BEFORE survives a crashed run, which
   * an After-only sweep does not.
   *
   * Failures are LOGGED AND ASSERTED, never swallowed (Invariant 13) - a sweep that quietly
   * fails hands the next TC an ambiguous list.
   */
  TST_CGST_TC_7: async function (testdata) {
    var removed = await sweepClassesNamed(testdata.className);
    console.log("TST_CGST_TC_7 swept " + removed + " leftover '" + testdata.className + "' class(es)");
    // The list must now be unambiguous - that is the whole point of the sweep.
    // CLEAR BEFORE SEARCHING. sweepClassesNamed() exits its loop with the term STILL
    // applied, so re-searching it here is a no-op: search_class() waits for the list to
    // CHANGE, nothing changes, and it burns its full 20s budget before reporting a failure
    // the search never had. It only passed before because clicking Search re-renders the
    // grid and getText momentarily returns an error, which shifts the list signature - a
    // race, not a guarantee.
    await schoolClasses.clear_search();
    sts = await schoolClasses.search_class(testdata.className);
    await assertion.assertEqual(sts.pageStatus, true, "The class search did not settle after sweeping");
    var rows = await schoolClasses.getData_classRows();
    var remaining = rows.filter(function (r) { return String(r.name).trim() === testdata.className; });
    await assertion.assertEqual(
      remaining.length, 0,
      "'" + testdata.className + "' is still in the Active list after the sweep"
    );
    await schoolClasses.clear_search();
  },

  /**
   * TST_CGST_TC_9 (cleanup, no manual counterpart) - deletes the class this run created.
   *
   * Registered in the exec file's suite-level `After`, NOT AfterEach: by then every TC's
   * screenshot has been taken, so deleting the class destroys no evidence (ADR-019).
   *
   * TC_7 already sweeps before creating, so this is deliberately belt-and-braces - if the
   * run dies before reaching here, the next run still starts clean.
   *
   * Returns to the Classes tab first because TC_6 leaves the browser on the grade-settings
   * page, where there is no Actions menu.
   */
  TST_CGST_TC_9: async function (testdata) {
    // An earlier TC may have failed mid-dialog, and an open modal blocks every click -
    // including this cleanup's. That is exactly what happened on the first run: the class and
    // a stuck server-side search had to be removed by hand afterwards. Clear anything open
    // BEFORE trying to navigate.
    var dismissed = await classGradeSettings.dismiss_openDialogs();
    if (dismissed.closed.length) console.log("TST_CGST_TC_9 closed: " + dismissed.closed.join(", "));

    // PREFERRED PATH: go straight to the class this run created. No search, no row matching,
    // no list-change wait - so it works even when the Classes tab is misbehaving.
    if (createdClassUrl) {
      await browser.url(createdClassUrl);
      sts = await activeClass.isInitialized();
      await assertion.assertEqual(
        sts.pageStatus, true,
        "Could not open the class under test at " + createdClassUrl + " to delete it"
      );
      sts = await activeClass.click_actionButton();
      await assertion.assertEqual(sts, true, "Actions menu did not open during cleanup");
      sts = await activeClass.delete_class();
      await assertion.assertEqual(sts.pageStatus, true, "The class under test could not be deleted");
      console.log("TST_CGST_TC_9 deleted the class under test by URL");
    } else {
      await logger.logInto(
        await stackTrace.get(),
        "no class URL captured - the run failed before TST_CGST_TC_8; falling back to the sweep"
      );
    }

    // Belt-and-braces: confirm nothing of ours survives, whichever path ran above. Leaves the
    // search cleared, which matters because the term persists SERVER-SIDE into the next run.
    sts = await schoolClasses.return_toClassesTab();
    await assertion.assertEqual(sts.pageStatus, true, "Could not return to the Classes tab to verify cleanup");

    // sweepClassesNamed returns how many it REMOVED, and it loops until none are left — so a
    // non-zero count is it doing its job, NOT a failure. (The first version asserted this was
    // 0 and failed a cleanup that had actually just worked: when the run dies before TC_8 the
    // URL path is unavailable, so the sweep legitimately removes the one class.)
    var removed = await sweepClassesNamed(testdata.className);
    console.log("TST_CGST_TC_9 sweep removed " + removed + " class(es)");

    // The real check: nothing of ours is left on the shared school.
    // CLEAR BEFORE SEARCHING. sweepClassesNamed() exits its loop with the term STILL
    // applied, so re-searching it here is a no-op: search_class() waits for the list to
    // CHANGE, nothing changes, and it burns its full 20s budget before reporting a failure
    // the search never had. It only passed before because clicking Search re-renders the
    // grid and getText momentarily returns an error, which shifts the list signature - a
    // race, not a guarantee.
    await schoolClasses.clear_search();
    sts = await schoolClasses.search_class(testdata.className);
    await assertion.assertEqual(sts.pageStatus, true, "The class search did not settle while verifying cleanup");
    var rows = await schoolClasses.getData_classRows();
    var leftover = rows.filter(function (r) { return String(r.name).trim() === testdata.className; });
    await schoolClasses.clear_search();
    await assertion.assertEqual(
      leftover.length, 0,
      "Cleanup left " + leftover.length + " class(es) named '" + testdata.className + "' behind"
    );
  },

  /**
   * TST_CGST_TC_8 (helper, no manual counterpart) - finds the class this run just created
   * and launches it, leaving the class page open for TC_1.
   *
   * POLLS for the row rather than pausing: creation is asynchronous and the product warns it
   * "can take up to 12 hours", but measured live 2026-08-20 the row appears in ~24s. Polling
   * is correct either way - it returns as soon as the class is really there, and fails with a
   * clear message if the product ever does take its worst case.
   */
  TST_CGST_TC_8: async function (testdata) {
    /*
     * SEARCH ONCE, THEN POLL BY RELOADING.
     *
     * search_class() waits for the class LIST TO CHANGE. Calling it repeatedly with the SAME
     * term is therefore a trap: the first call filters the list (a change), but every later
     * call is a no-op against an already-filtered list, so it waits out its full budget and
     * reports failure even though the search worked perfectly. That cost a whole run
     * (2026-08-20) and cascaded into six unrelated-looking failures.
     *
     * Reloading instead is both correct and cheaper: the search term PERSISTS SERVER-SIDE
     * (documented product behaviour), so a reload re-runs the same filter and returns fresh
     * rows without needing anything to "change".
     */
    sts = await schoolClasses.search_class(testdata.className);
    await assertion.assertEqual(sts.pageStatus, true, "The class search did not return a settled list");

    var deadline = Date.now() + CLASS_APPEAR_TIMEOUT;
    var match = -1;
    var rows = [];
    var polls = 0;
    while (true) {
      rows = await schoolClasses.getData_classRows();
      match = -1;
      for (var i = 0; i < rows.length; i++) {
        if (String(rows[i].name).trim() === testdata.className) { match = i; break; }
      }
      if (match !== -1 || Date.now() >= deadline) break;
      polls++;
      await browser.pause(3000); // nothing observable - the row simply is not there yet
      // The persisted search survives the reload, so the list comes back already filtered.
      var reloaded = await schoolClasses.reload_classesTab();
      await assertion.assertEqual(
        reloaded.pageStatus, true,
        "The Classes tab did not reload while polling for the new class"
      );
    }
    console.log("TST_CGST_TC_8 found the class after " + polls + " reload poll(s)");
    await assertion.assert(
      match !== -1,
      "Class '" + testdata.className + "' did not appear in the Active list within " +
        CLASS_APPEAR_TIMEOUT / 1000 + "s of being created"
    );
    // Exactly one, or "the class under test" is ambiguous and TC_7 did not do its job.
    var duplicates = rows.filter(function (r) { return String(r.name).trim() === testdata.className; });
    await assertion.assertEqual(
      duplicates.length, 1,
      "Expected exactly one class named '" + testdata.className + "', found " + duplicates.length
    );

    var launched = await schoolClasses.click_className(match, "active");
    await assertion.assertEqual(launched.pageStatus, true, "The class under test could not be launched");
    await assertion.assertEqual(launched.className, testdata.className, "A different class was launched");

    // Remember exactly which class this run owns, so cleanup never has to search for it again
    // (see TST_CGST_TC_9). Module-scoped, not test data - it is a per-run fact.
    createdClassUrl = launched.url;
    console.log("TST_CGST_TC_8 class under test: " + createdClassUrl);
  }
};

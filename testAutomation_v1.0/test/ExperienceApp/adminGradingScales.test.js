"use strict";
// Admin App - Grading scales: Req #10 (manage page), #11 (create), #12 (view details),
// #14 (set as default), #15 (delete) and #16 (expand bands).
// Manual source: test/Manual/C1App/AdminApp-Classes/AdminApp_Classes_tab_test_cases.md
// Module code: GSCL - pages/ExperienceApp/manageGradingScales.page.js
//
// SCOPE NOTE - two of the twelve manual GSCL cases are deliberately NOT here:
//   TST_GSCL_TC_4 (maximum-scales limit). Its precondition is "the school is already at its
//   maximum", which means filling a SHARED thor school to its cap and breaking every other
//   suite's scale creation mid-run. Same call as TST_GCAT_TC_4. The expected modal copy is
//   already verified word for word (the modal is pre-rendered in the DOM, so capturing it
//   cost nothing), so this is short work once a dedicated school exists.
// Neither is registered anywhere, so neither can run by accident.
//
// TST_GSCL_TC_7 (Req #13) LIVES HERE but RUNS IN THE CGST SUITE. It needs the scale applied
// to a live class, which only the CGST suite produces, so it is listed in
// testExecutionFiles/.../adminClassGradeSettings.json between TST_CGST_TC_3 (which applies
// the scale and SAVES) and TST_CGST_TC_9 (which deletes the class). It is registered here,
// not in the CGST test file, because the page it exercises is the SCALE details page and
// module ownership follows the page object (AGENTS.md Rule 6).
//
// DATA SAFETY: every scale these TCs create is named `namePrefix` ("AutoScale_") + a
// timestamp, so it is unique per run and unmistakably ours. TST_GSCL_TC_13 sweeps that
// prefix in BeforeEach - see its comment for why BeforeEach and NOT AfterEach.
// The school's own scales - "Cambridge One grading scale" (system default) and
// "new Grading Auto" - are never touched.
var manageGradingScales = require("../../pages/ExperienceApp/manageGradingScales.page.js");
var schoolClasses = require("../../pages/ExperienceApp/schoolClasses.page.js");
var classGradeSettings = require("../../pages/ExperienceApp/classGradeSettings.page.js");

var sts;

// Exact page copy, captured live 2026-08-19 (thor, FCN-CHZ-PDA).
//
// Compared through squash() below rather than byte-for-byte. The product renders these
// strings across several elements, so innerText carries blank lines between the heading and
// the body ("Are you sure?\n\nDeleting the grading scale..."). Collapsing runs of whitespace
// on BOTH sides keeps the assertion sensitive to every WORDING change - which is the point -
// while not failing when only the layout's line breaks move. This is deliberately not a
// loosening of the check: the full sentence still has to be present and identical.
var PAGE_HEADING = "Grading scales";
var DETAILS_CLASSES_HEADING = "Classes (0)";
var DETAILS_NO_CLASSES_TEXT =
  "No classes yet To associate the grading scale with a class, go to its 'Class grade settings' page";

// Note the CURLY apostrophe in "won't" - it is what the product actually renders.
var DELETE_MODAL_COPY =
  "Are you sure? Deleting the grading scale will not affect classes associated with it, " +
  "but it won’t be available to apply to any new classes. Delete this grading scale from your school?";
var SET_DEFAULT_MODAL_COPY =
  "Set as default for the school? All newly created classes will be associated with this " +
  "grading scale. Existing classes will not be affected";

/** Collapses whitespace runs to single spaces so copy is compared by wording, not layout. */
var CLASS_GRADE_SETTINGS_HEADING = "Class grade settings";

function squash(s) {
  return String(s == null ? "" : s).replace(/\s+/g, " ").trim();
}

/**
 * Unique, sweepable scale name that FITS the field: <prefix><2-char tag><base36 epoch>.
 *
 * The title input carries maxlength="20" (captured live 2026-08-19 - the manual cases do
 * not mention it). The first build used "<prefix><tag>_<epoch-ms>", which is 30 characters,
 * so the browser silently kept the first 20 and six TCs failed on the read-back. Base36
 * shortens the 13-digit epoch to 8 characters, which brings the whole name to exactly 20
 * and keeps it unique per run.
 *
 * The length is GUARDED rather than assumed: if the prefix or a tag is ever lengthened, this
 * throws immediately with the reason instead of letting the browser truncate and producing a
 * confusing read-back failure several lines later.
 */
function uniqueName(prefix, tag, maxLength) {
  var name = prefix + tag + Date.now().toString(36);
  if (name.length > maxLength) {
    throw new Error(
      "Generated scale name '" + name + "' is " + name.length + " characters, but the title " +
      "field accepts only " + maxLength + ". Shorten namePrefix or the tag - do not let the " +
      "browser truncate it."
    );
  }
  return name;
}

/**
 * Fills the two-band form the manual cases describe: Highest `A` from 50% (To is fixed at
 * 100%) and Lowest `F` to 49% (From is fixed at 0%). Returns the page-object results so the
 * caller can assert each step rather than trusting a single boolean.
 *
 * Band indices are read from the form, never assumed - adding a middle band re-indexes the
 * lowest row (page-object trap 4).
 */
async function fillTwoBandScale(testdata, title) {
  var out = {};
  out.title = await manageGradingScales.set_title(title);
  var rows = await manageGradingScales.getData_bandRowCount();
  out.rowCount = rows.count;
  out.highest = await manageGradingScales.set_band(0, { name: testdata.highestGrade, from: testdata.highestFrom });
  out.lowest = await manageGradingScales.set_band(rows.count - 1, { name: testdata.lowestGrade, to: testdata.lowestTo });
  // Commit the last field: set_band blurs each input by moving to the next, but the final
  // one is left focused, and a form using updateOn:'blur' would never see its value.
  out.blurred = await manageGradingScales.blur_activeField(testdata.blurKey);
  // Click the target explicitly. The Highest band's radio RENDERS checked on a fresh form,
  // but a DOM checked flag is not proof that the form model holds a target - and "Save" is
  // gated on a target being chosen. Clicking makes the intent real instead of assumed.
  out.target = await manageGradingScales.click_setTarget(0);
  // Logged for EVERY creating TC, not just TC_2: when a save fails the useful question is
  // always "what did the form actually hold", and each run costs ~3 minutes on a shared
  // school. Cheap to print, expensive to go back for.
  out.formState = await manageGradingScales.getData_formState();
  console.log("form state before save →", JSON.stringify(out.formState));
  return out;
}

module.exports = {
  /**
   * TST_GSCL_TC_1 - Req #10: Verify the Manage grading scales page loads with all
   * components. testdata: { systemDefaultScale }
   *
   * The page is REACHED by BeforeEach (TST_GSCL_TC_13 -> reset_state), which walks the real
   * School settings route; this TC asserts what is on screen, not the navigation.
   *
   * Ends on the loaded list, which is its own evidence.
   */
  TST_GSCL_TC_1: async function (testdata) {
    var page = await manageGradingScales.getData_pageComponents();
    console.log("TC_1 page →", page);

    await assertion.assertEqual(page.heading, PAGE_HEADING,
      "Grading scales page heading did not match the expected copy");
    await assertion.assertEqual(page.userGuideDisplayed, true,
      "'User guide' is not visible on the Grading scales page");
    await assertion.assertEqual(page.createBtnDisplayed, true,
      "'Create grading scale' button is not visible on the Grading scales page");
    await assertion.assertEqual(page.defaultBadgeDisplayed, true,
      "No scale carries the 'default' badge");
    await assertion.assertEqual(page.defaultScale, testdata.systemDefaultScale,
      "The default badge is not on the expected school default scale");

    var list = await manageGradingScales.getData_scaleNames();
    console.log("TC_1 scales →", list.names);
    await assertion.assertEqual(page.rowCount, list.count,
      "Rendered row count (" + page.rowCount + ") does not match the number of readable scale names (" +
      list.count + "): " + JSON.stringify(list.names));
    await assertion.assertEqual(list.count > 0, true,
      "No grading scales are listed, so the row menu could not be verified");
  },

  /**
   * TST_GSCL_TC_2 - Req #11: Verify a grading scale is created with a title, bands and a
   * target score. testdata: { namePrefix, highestGrade, highestFrom, lowestGrade, lowestTo,
   * expectedTargetScore }
   *
   * Save is asserted to be DISABLED before the form is filled and ENABLED after, so the
   * button's state is proven to respond to the input rather than merely being enabled at
   * the moment we happen to look.
   *
   * The list is the proof of creation, not the button click - only the list shows the record
   * exists (Invariant 13). The row's "Target score" line is asserted too, because the manual
   * case's expected result names it explicitly.
   */
  TST_GSCL_TC_2: async function (testdata) {
    var name = uniqueName(testdata.namePrefix, "cr", testdata.maxTitleLength);

    sts = await manageGradingScales.click_createScale();
    await assertion.assertEqual(sts.pageStatus, true, "Create grading scale form did not open");

    var beforeFill = await manageGradingScales.getData_saveEnabled();
    await assertion.assertEqual(beforeFill.enabled, false,
      "'Save grading scale' was already enabled on an empty form");

    var filled = await fillTwoBandScale(testdata, name);
    console.log("TC_2 filled →", { title: filled.title, rowCount: filled.rowCount });
    await assertion.assertEqual(filled.title.pageStatus, true,
      "Title field did not hold the typed name. Intended '" + name + "', field held '" + filled.title.readBack + "'");
    await assertion.assertEqual(filled.highest.pageStatus, true, "Could not fill the Highest grade band");
    await assertion.assertEqual(filled.lowest.pageStatus, true, "Could not fill the Lowest grade band");

    // The Highest band is the target (fillTwoBandScale clicks it explicitly).
    var target = await manageGradingScales.getData_targetSelected(0);
    await assertion.assertEqual(target.selected, true,
      "The Highest grade band is not marked as the target score");

    // Full form state is captured BEFORE the assertion, so a "Save stayed disabled" failure
    // reports what the form actually held rather than costing another ~3-minute run on a
    // shared school to find out.
    var form = await manageGradingScales.getData_formState();
    console.log("TC_2 form state →", JSON.stringify(form));
    await assertion.assertEqual(form.saveEnabled, true,
      "'Save grading scale' stayed disabled after a complete, valid scale was entered. Form state: " +
      JSON.stringify(form));

    var saved = await manageGradingScales.click_saveScale(name);
    var listNow = await manageGradingScales.getData_scaleNames();
    console.log("TC_2 saved →", saved);
    console.log("TC_2 list now →", listNow.names);
    await assertion.assertEqual(saved.listed, true,
      "Created scale '" + name + "' did not appear in the list. Title field held '" + saved.preSaveTitle +
      "' when Save was pressed; list now: " + JSON.stringify(listNow.names));

    var score = await manageGradingScales.getData_targetScore(name);
    console.log("TC_2 target score →", score);
    await assertion.assertEqual(score.text, testdata.expectedTargetScore,
      "The created scale's target score line did not match the expected copy");
  },

  /**
   * TST_GSCL_TC_3 - Req #11: Verify a middle band can be added with "+ Add new grade".
   * testdata: { namePrefix, highestGrade, highestFrom, lowestGrade, lowestTo, middleGrade,
   * middleFrom, middleTo }
   *
   * Creates NOTHING - it exercises the form's structure and then cancels, so it can run on
   * a shared school with no side effects.
   *
   * The point of the TC is the RE-INDEXING (page-object trap 4): before the click the rows
   * are 0 = Highest, 1 = Lowest; after it they are 0 = Highest, 1 = the new middle band,
   * 2 = Lowest. That is asserted explicitly, because a selector written against the old
   * layout would silently write the middle band's values into the Lowest row.
   *
   * Ends on the filled form so the screenshot shows the three bands.
   */
  TST_GSCL_TC_3: async function (testdata) {
    var name = uniqueName(testdata.namePrefix, "md", testdata.maxTitleLength);

    sts = await manageGradingScales.click_createScale();
    await assertion.assertEqual(sts.pageStatus, true, "Create grading scale form did not open");

    var filled = await fillTwoBandScale(testdata, name);
    // Asserted even though this TC never saves: leaving set_title's result unchecked is how
    // the first build passed this TC while its title had been silently truncated to the
    // field's 20-character cap. Green is not proof.
    await assertion.assertEqual(filled.title.pageStatus, true,
      "Title field did not hold '" + name + "', it held '" + filled.title.readBack + "' (" +
      filled.title.diagnosis + ")");
    await assertion.assertEqual(filled.rowCount, 2,
      "A fresh create form should start with exactly 2 band rows (Highest + Lowest), saw " + filled.rowCount);
    await assertion.assertEqual(filled.lowest.pageStatus, true, "Could not fill the Lowest grade band");

    // Prove where the Lowest band sits BEFORE the middle band is added.
    var lowestBefore = await manageGradingScales.getData_band(1);
    console.log("TC_3 row 1 before add →", lowestBefore);
    await assertion.assertEqual(lowestBefore.name, testdata.lowestGrade,
      "Row 1 was expected to be the Lowest grade before a middle band is added");

    var added = await manageGradingScales.click_addGrade(0);
    console.log("TC_3 add grade →", added);
    await assertion.assertEqual(added.pageStatus, true, "'+ Add new grade' did not add a band row");
    await assertion.assertEqual(added.after, 3,
      "Expected 3 band rows after adding a middle band, saw " + added.after);

    // The Lowest band has moved to index 2; index 1 is now the new, empty middle band.
    var middle = await manageGradingScales.getData_band(1);
    var lowestAfter = await manageGradingScales.getData_band(2);
    console.log("TC_3 after add →", { middle: middle, lowest: lowestAfter });
    await assertion.assertEqual(lowestAfter.name, testdata.lowestGrade,
      "The Lowest grade did not move to index 2 after a middle band was added");
    await assertion.assertEqual(middle.name, "",
      "Index 1 should be the newly added, empty middle band");
    await assertion.assertEqual(middle.hasFrom && middle.hasTo, true,
      "A middle band should expose BOTH From and To (unlike Highest, whose To is fixed at 100%)");

    sts = await manageGradingScales.set_band(1, {
      name: testdata.middleGrade, from: testdata.middleFrom, to: testdata.middleTo
    });
    await assertion.assertEqual(sts.pageStatus, true, "Could not fill the new middle band");

    var check = await manageGradingScales.getData_band(1);
    console.log("TC_3 middle filled →", check);
    await assertion.assertEqual(check.name, testdata.middleGrade,
      "The middle band did not hold the typed grade name");
  },

  /**
   * TST_GSCL_TC_5 - Req #11 (Negative): Verify Save is disabled until a title, valid bands
   * and a target score are provided. testdata: { highestGrade, highestFrom }
   *
   * Creates nothing. Each stage asserts Save is STILL disabled, so the test would fail if
   * the button ever enabled early - a single check at the end could not tell "correctly
   * disabled" from "disabled for some other reason".
   *
   * Ends on the incomplete form with Save disabled - that is the evidence.
   */
  TST_GSCL_TC_5: async function (testdata) {
    sts = await manageGradingScales.click_createScale();
    await assertion.assertEqual(sts.pageStatus, true, "Create grading scale form did not open");

    var empty = await manageGradingScales.getData_saveEnabled();
    console.log("TC_5 empty form →", empty);
    await assertion.assertEqual(empty.enabled, false,
      "'Save grading scale' is enabled on a completely empty form");

    // Bands only, still no title.
    sts = await manageGradingScales.set_band(0, { name: testdata.highestGrade, from: testdata.highestFrom });
    await assertion.assertEqual(sts.pageStatus, true, "Could not fill the Highest grade band");
    var noTitle = await manageGradingScales.getData_saveEnabled();
    console.log("TC_5 bands but no title →", noTitle);
    await assertion.assertEqual(noTitle.enabled, false,
      "'Save grading scale' became enabled with bands entered but no title");

    // Title only, with the Lowest band still empty so the bands cannot cover 0-100%.
    sts = await manageGradingScales.set_title("A");
    await assertion.assertEqual(sts.pageStatus, true, "Could not type a title");
    var incompleteBands = await manageGradingScales.getData_saveEnabled();
    console.log("TC_5 title but incomplete bands →", incompleteBands);
    await assertion.assertEqual(incompleteBands.enabled, false,
      "'Save grading scale' became enabled while the bands do not cover 0-100% without gaps");
  },

  /**
   * TST_GSCL_TC_6 - Req #12: Verify the grading scale View details page opens.
   * testdata: { namePrefix, highestGrade, highestFrom, lowestGrade, lowestTo }
   *
   * Creates its OWN scale first rather than opening one of the school's. A brand-new scale
   * is GUARANTEED to have zero classes, which is what makes "Classes (0)" and the empty
   * state safe to assert verbatim; a shared scale could gain a class at any moment. It also
   * cannot borrow an earlier TC's scale, because BeforeEach sweeps them.
   *
   * Ends ON the details page so the screenshot proves it opened (ADR-019). That page has no
   * School settings toggle, so the next BeforeEach steps back via its own Back link.
   */
  TST_GSCL_TC_6: async function (testdata) {
    var name = uniqueName(testdata.namePrefix, "dt", testdata.maxTitleLength);

    sts = await manageGradingScales.click_createScale();
    await assertion.assertEqual(sts.pageStatus, true, "Create grading scale form did not open");
    var filled = await fillTwoBandScale(testdata, name);
    await assertion.assertEqual(filled.title.pageStatus, true,
      "Title field did not hold '" + name + "', it held '" + filled.title.readBack + "'");
    sts = await manageGradingScales.click_saveScale(name);
    await assertion.assertEqual(sts.listed, true,
      "Could not create the precondition scale '" + name + "' for the View details check");

    var opened = await manageGradingScales.click_viewDetails(name);
    console.log("TC_6 opened →", opened);
    await assertion.assertEqual(opened.urlMatched, true,
      "URL did not change to the scale details route (.../grading-scales/<id>)");
    await assertion.assertEqual(opened.pageStatus, true,
      "'View details' page did not load for scale '" + name + "'");

    var details = await manageGradingScales.getData_detailsPage();
    console.log("TC_6 details →", details);
    await assertion.assertEqual(details.heading, name, "Details page title is not the scale name");
    await assertion.assertEqual(details.bandsToggleDisplayed, true,
      "The collapsible 'Grading scale bands' section is not visible");
    await assertion.assertEqual(details.bandsExpanded, "false",
      "'Grading scale bands' should start collapsed");
    await assertion.assertEqual(details.classesHeading, DETAILS_CLASSES_HEADING,
      "Classes heading did not match the expected copy for a scale with no classes");
    await assertion.assertEqual(details.noClassesDisplayed, true,
      "The 'no classes' empty state is not visible on a newly created scale's details page");
    await assertion.assertEqual(squash(details.noClassesText), DETAILS_NO_CLASSES_TEXT,
      "Empty-state message did not match the expected copy");
  },

  /**
   * TST_GSCL_TC_12 - Req #16: Verify expanding the grading scale bands shows the bands.
   * testdata: { namePrefix, highestGrade, highestFrom, lowestGrade, lowestTo,
   * expectedBandCells, expectedBandTargetScore }
   *
   * Creates its own scale for the same determinism reason as TC_6, then expands the
   * accordion on its details page. The bands are asserted by CONTENT, not by "the panel is
   * no longer collapsed" - the panel stays in the DOM while collapsed, so its presence
   * proves nothing (this is trap 1's shape again).
   *
   * Ends on the expanded panel - the evidence.
   */
  TST_GSCL_TC_12: async function (testdata) {
    var name = uniqueName(testdata.namePrefix, "bd", testdata.maxTitleLength);

    sts = await manageGradingScales.click_createScale();
    await assertion.assertEqual(sts.pageStatus, true, "Create grading scale form did not open");
    var filled = await fillTwoBandScale(testdata, name);
    await assertion.assertEqual(filled.title.pageStatus, true,
      "Title field did not hold '" + name + "', it held '" + filled.title.readBack + "'");
    sts = await manageGradingScales.click_saveScale(name);
    await assertion.assertEqual(sts.listed, true,
      "Could not create the precondition scale '" + name + "' for the expand-bands check");

    sts = await manageGradingScales.click_viewDetails(name);
    await assertion.assertEqual(sts.pageStatus, true, "'View details' page did not load for '" + name + "'");

    var expanded = await manageGradingScales.click_expandBands();
    console.log("TC_12 expand →", expanded);
    await assertion.assertEqual(expanded.expandedBefore, "false",
      "'Grading scale bands' was already expanded before it was clicked");
    await assertion.assertEqual(expanded.pageStatus, true,
      "'Grading scale bands' panel did not become visible after clicking");
    await assertion.assertEqual(expanded.expandedAfter, "true",
      "The bands control did not report itself as expanded");

    var bands = await manageGradingScales.getData_bands();
    console.log("TC_12 bands →", bands);
    await assertion.assertEqual(bands.cells.join(" | "), testdata.expectedBandCells,
      "The expanded bands did not show the expected grade names and ranges");
    await assertion.assertEqual(bands.targetScoreText, testdata.expectedBandTargetScore,
      "The band target-score label did not match the expected copy");
  },

  /**
   * TST_GSCL_TC_8 - Req #14: Verify a grading scale can be set as the school default.
   * testdata: { namePrefix, systemDefaultScale, ... band fields }
   *
   * SHARED-SCHOOL WARNING. This is the only TC in the suite that changes SCHOOL-WIDE state:
   * the product's own confirmation says "All newly created classes will be associated with
   * this grading scale". FCN-CHZ-PDA is shared, so the badge is handed straight back by the
   * next BeforeEach (reset_state restores `systemDefaultScale` BEFORE it sweeps, because a
   * default scale exposes no Delete option - page-object trap 3 and 6).
   * Automating it with that restore was confirmed with the user on 2026-08-19.
   *
   * The confirmation copy is asserted before confirming, and the badge is then asserted to
   * have actually MOVED - the modal closing would not prove the default changed.
   *
   * Ends with our scale holding the badge, which is the evidence.
   */
  TST_GSCL_TC_8: async function (testdata) {
    var name = uniqueName(testdata.namePrefix, "df", testdata.maxTitleLength);

    var before = await manageGradingScales.getData_defaultScaleName();
    console.log("TC_8 default before →", before);
    await assertion.assertEqual(before.name, testdata.systemDefaultScale,
      "The school default was not the expected scale at the start of this test");

    sts = await manageGradingScales.click_createScale();
    await assertion.assertEqual(sts.pageStatus, true, "Create grading scale form did not open");
    var filled = await fillTwoBandScale(testdata, name);
    await assertion.assertEqual(filled.title.pageStatus, true,
      "Title field did not hold '" + name + "', it held '" + filled.title.readBack + "'");
    sts = await manageGradingScales.click_saveScale(name);
    await assertion.assertEqual(sts.listed, true,
      "Could not create the precondition scale '" + name + "' for the set-as-default check");

    sts = await manageGradingScales.click_setAsDefault(name);
    await assertion.assertEqual(sts.pageStatus, true,
      "The 'Set as default' confirmation did not open for '" + name + "'");

    var modal = await manageGradingScales.getData_setDefaultModal();
    console.log("TC_8 modal →", modal);
    await assertion.assertEqual(modal.displayed, true, "The set-as-default confirmation is not visible");
    await assertion.assertEqual(squash(modal.text).indexOf(SET_DEFAULT_MODAL_COPY) !== -1, true,
      "Set-as-default confirmation copy did not match. Saw: '" + modal.text + "'");

    var confirmed = await manageGradingScales.click_confirmSetDefault(name);
    console.log("TC_8 confirmed →", confirmed);
    await assertion.assertEqual(confirmed.becameDefault, true,
      "The 'default' badge did not move to '" + name + "'; it is on '" + confirmed.defaultNow + "'");
  },

  /**
   * TST_GSCL_TC_9 - Req #15: Verify a grading scale is deleted after confirmation.
   * testdata: { namePrefix, ... band fields }
   *
   * Creates its own scale, deletes it, and asserts it actually LEFT the list. The modal
   * closing is not the signal - only the list is.
   *
   * Ends on the list without the scale. The success is a removal, so the evidence is an
   * absence; the assertion message carries the names that WERE present when it was checked.
   */
  TST_GSCL_TC_9: async function (testdata) {
    var name = uniqueName(testdata.namePrefix, "dl", testdata.maxTitleLength);

    sts = await manageGradingScales.click_createScale();
    await assertion.assertEqual(sts.pageStatus, true, "Create grading scale form did not open");
    var filled = await fillTwoBandScale(testdata, name);
    await assertion.assertEqual(filled.title.pageStatus, true,
      "Title field did not hold '" + name + "', it held '" + filled.title.readBack + "'");
    sts = await manageGradingScales.click_saveScale(name);
    await assertion.assertEqual(sts.listed, true, "Could not create the scale to be deleted");

    sts = await manageGradingScales.click_deleteScale(name);
    await assertion.assertEqual(sts.pageStatus, true,
      "The Delete confirmation did not open for '" + name + "'");

    var modal = await manageGradingScales.getData_deleteModal();
    console.log("TC_9 modal →", modal);
    await assertion.assertEqual(modal.displayed, true, "The delete confirmation is not visible");
    await assertion.assertEqual(squash(modal.text).indexOf(DELETE_MODAL_COPY) !== -1, true,
      "Delete confirmation copy did not match. Saw: '" + modal.text + "'");

    var removed = await manageGradingScales.click_confirmDelete(name);
    var listNow = await manageGradingScales.getData_scaleNames();
    console.log("TC_9 removed →", removed);
    await assertion.assertEqual(removed.removed, true,
      "Scale '" + name + "' is still listed after confirming deletion. List now: " +
      JSON.stringify(listNow.names));
  },

  /**
   * TST_GSCL_TC_10 - Req #15 (Edge): Verify deleting a grading scale can be cancelled.
   * testdata: { namePrefix, ... band fields }
   *
   * "No, go back" must both close the confirmation AND leave the scale listed. Asserting
   * only the first would pass even if the scale had been deleted anyway.
   *
   * Ends on the list with the scale still present - the evidence.
   */
  TST_GSCL_TC_10: async function (testdata) {
    var name = uniqueName(testdata.namePrefix, "ca", testdata.maxTitleLength);

    sts = await manageGradingScales.click_createScale();
    await assertion.assertEqual(sts.pageStatus, true, "Create grading scale form did not open");
    var filled = await fillTwoBandScale(testdata, name);
    await assertion.assertEqual(filled.title.pageStatus, true,
      "Title field did not hold '" + name + "', it held '" + filled.title.readBack + "'");
    sts = await manageGradingScales.click_saveScale(name);
    await assertion.assertEqual(sts.listed, true, "Could not create the scale for the cancel-delete check");

    sts = await manageGradingScales.click_deleteScale(name);
    await assertion.assertEqual(sts.pageStatus, true, "The Delete confirmation did not open");

    sts = await manageGradingScales.click_cancelDelete();
    await assertion.assertEqual(sts.pageStatus, true,
      "The Delete confirmation did not close after 'No, go back'");

    var still = await manageGradingScales.getData_scaleListed(name);
    console.log("TC_10 after cancel →", still);
    await assertion.assertEqual(still.listed, true,
      "Scale '" + name + "' was removed even though deletion was cancelled. List now: " +
      JSON.stringify(still.names));
  },

  /**
   * TST_GSCL_TC_11 - Req #15 (Negative): Verify the default grading scale cannot be deleted.
   * testdata: { systemDefaultScale }
   *
   * Unlike the grading-CATEGORIES page, this page genuinely OMITS "Set as default" and
   * "Delete" from the default scale's menu rather than hiding them (page-object trap 3,
   * verified live 2026-08-19). So a COUNT of 0 is a truthful assertion here - and both the
   * count and the visibility are asserted, so the test still fails if the product changes
   * to "present but hidden", which would be a different behaviour worth catching.
   *
   * Ends with the default scale's menu open showing only View details - the evidence.
   */
  TST_GSCL_TC_11: async function (testdata) {
    var menu = await manageGradingScales.click_openRowMenu(testdata.systemDefaultScale);
    console.log("TC_11 default scale menu →", menu);

    await assertion.assertEqual(menu.index !== -1, true,
      "The default scale '" + testdata.systemDefaultScale + "' is not listed");
    await assertion.assertEqual(menu.menuDisplayed, true,
      "The default scale's 'Open drop down' menu did not open");
    await assertion.assertEqual(menu.viewDetailsDisplayed, true,
      "'View details' is not visible in the default scale's menu");
    await assertion.assertEqual(menu.deleteCount, 0,
      "The default scale's menu contains a Delete option - it should not be deletable");
    await assertion.assertEqual(menu.deleteDisplayed, false,
      "A Delete option is visible in the default scale's menu");
    await assertion.assertEqual(menu.setDefaultCount, 0,
      "The default scale's menu contains 'Set as default' - it is already the default");
  },

  /**
   * TST_GSCL_TC_7 (Positive, Req #13) - the class grade settings page launches from a
   * grading scale's details page.
   *
   * RUNS INSIDE THE CGST SUITE, not the GSCL one: its precondition is "the scale is applied
   * to >= 1 class", and TST_CGST_TC_2 is what applies (and SAVES) `scaleName` onto the class
   * that suite creates. Slotted after TST_CGST_TC_3 and before TST_CGST_TC_9 (the delete).
   *
   * THE MANUAL CASE'S STEP 2 IS WRONG. It reads "click a listed class"; it was written from a
   * details page that had NO classes on it, so nobody had seen the populated layout. Captured
   * live 2026-08-20: the class name is plain text (`span.item-text`) and the row's only
   * control is a dedicated "Class grade settings" link. Corrected in the manual register.
   *
   * ⚠ THE CLASS MUST STILL BE ACTIVE. This page lists Deleted classes too (delete is soft),
   * and clicking the link on a Deleted row does NOT open grade settings - it drops the school
   * context and lands on "My school accounts" with "Sorry! The item is not available because
   * the class is no longer active". Hence the explicit `status === "Active"` assertion below:
   * without it, this TC could pass its "row is listed" check against a corpse from an earlier
   * run and then fail confusingly at the click.
   *
   * WHY THE KEY IS RESOLVED AT RUNTIME instead of being test data: the class is created by
   * this run, so its key does not exist until then. Names cannot be used as the handle -
   * FCN-CHZ-PDA is a SHARED school with duplicate class names, and every past CGST run has
   * left another Deleted `AutoClass_CGST` row on this very page. Asserting "exactly one
   * ACTIVE class with this name" both yields the key and fails loudly (rather than silently
   * testing the wrong class) if someone else's run created a second one concurrently.
   */
  TST_GSCL_TC_7: async function (testdata) {
    // --- 1. Resolve the class under test, and its unique key, from the Classes tab. -------
    sts = await schoolClasses.return_toClassesTab();
    await assertion.assertEqual(
      sts.pageStatus, true,
      "Could not return to the Classes tab to resolve the class under test"
    );

    /*
     * CLEAR BEFORE SEARCHING - search_class() is NOT idempotent.
     *
     * It waits for the class LIST TO CHANGE, and the search term PERSISTS SERVER-SIDE
     * (documented, confirmed-intended product behaviour). TST_CGST_TC_8 has already searched
     * for this very class name and does not clear it, so by the time this TC runs the list is
     * STILL filtered to it. Re-typing the same term changes nothing, so the wait burns its
     * full 20s budget and reports failure even though the search worked perfectly.
     *
     * That is exactly how this TC failed on its first run (2026-08-20). Clearing first makes
     * both steps real changes: filtered -> all rows, then all rows -> filtered.
     */
    await schoolClasses.clear_search();
    sts = await schoolClasses.search_class(testdata.className);
    await assertion.assertEqual(sts.pageStatus, true, "The class search did not settle");
    var rows = await schoolClasses.getData_classRows();
    var mine = rows.filter(function (r) { return String(r.name).trim() === testdata.className; });
    // Clear BEFORE asserting: the search term persists SERVER-SIDE into the next TC and the
    // next run, so a failed assertion must not leave the list filtered (documented product
    // behaviour, confirmed intended 2026-08-17).
    await schoolClasses.clear_search();
    await assertion.assertEqual(
      mine.length, 1,
      "Expected exactly one ACTIVE class named '" + testdata.className + "' to resolve its " +
        "key, found " + mine.length + " - the suite's own sweep should guarantee one"
    );
    var classKey = mine[0].key;
    await assertion.assert(
      classKey !== "",
      "Could not read the class key for '" + testdata.className + "'"
    );

    // --- 2. Open the scale's details page by the real user route. -------------------------
    sts = await manageGradingScales.navigate_fromClassesTab();
    await assertion.assertEqual(sts.pageStatus, true, "Could not open the Grading scales page");

    sts = await manageGradingScales.click_viewDetails(testdata.scaleName);
    await assertion.assertEqual(
      sts.pageStatus, true,
      "View details did not open for grading scale '" + testdata.scaleName + "'"
    );

    // --- 3. The class the scale was applied to is listed on that page. --------------------
    var row = await manageGradingScales.getData_detailsClassRow(classKey);
    await assertion.assertEqual(
      row.found, true,
      "Class '" + testdata.className + "' (" + classKey + ") is not listed on the details " +
        "page for scale '" + testdata.scaleName + "' after being applied to it"
    );
    await assertion.assertEqual(
      squash(row.name), testdata.className,
      "The listed row's class name does not match the class under test"
    );
    await assertion.assertEqual(
      squash(row.status), "Active",
      "The class under test is not Active on the scale's details page - the grade settings " +
        "link only works for an active class"
    );

    // --- 4. The row's link opens THAT class's grade settings page. ------------------------
    sts = await manageGradingScales.click_classGradeSettingsByKey(classKey);
    await assertion.assertEqual(
      sts.pageStatus, true,
      "'Class grade settings' did not open the grade settings page from the scale's details page"
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
    // Arriving via this scale's details page must land on a class actually using that scale.
    await assertion.assertEqual(
      squash(page.scaleName), testdata.scaleName,
      "The class's applied grading scale is not the scale whose details page we came from"
    );
  },

  /**
   * TST_GSCL_TC_13 - housekeeping. Puts the page into a known state: on the Grading scales
   * list, nothing open, the school default back where it belongs, and no scale left over
   * from a previous run.
   *
   * REGISTERED IN BeforeEach ONLY - deliberately not AfterEach. The mochawesome screenshot
   * is taken by a ROOT afterEach hook, and Mocha runs root afterEach hooks AFTER the
   * suite-level ones that execute the exec file's AfterEach list. Sweeping in AfterEach
   * would therefore delete each scale a moment BEFORE its screenshot was taken, and every
   * create/delete TC would be evidenced by a picture of a list that no longer contains its
   * subject (ADR-019).
   *
   * It is asserted, not fire-and-forget: a reset that silently failed would bleed state into
   * the next TC, and here that state includes the SCHOOL DEFAULT (Invariant 13).
   */
  TST_GSCL_TC_13: async function (testdata) {
    sts = await manageGradingScales.reset_state(testdata.namePrefix, testdata.systemDefaultScale);
    if (sts.defaultBefore !== sts.defaultAfter) {
      console.log("TC_13 restored school default →", { from: sts.defaultBefore, to: sts.defaultAfter });
    }
    if (sts.removed && sts.removed.length) console.log("TC_13 swept →", sts.removed);
    await assertion.assertEqual(sts.pageStatus, true,
      "Housekeeping reset failed - could not clean up: " + JSON.stringify(sts.failed));
  }
};

"use strict";
// Admin App — bulk student operations. Module code SBLK → pages/ExperienceApp/bulkStudents.page.js
// (plus the existing createAdultStudentAccounts.page.js from the NEMO-24306 work, reused).
// Manual source: test/Manual/C1App/AdminApp-Students/AdminApp_Students_tab_test_cases.md
//
// Batch (this file, 2026-09-15): TC_6 (account-type chooser), TC_7 (bulk activation page),
// TC_8 (Activate enabling threshold), TC_14 (rule-violating CSV row — OPEN DEFECT, kept out of
// every execution file).
//
// SIDE-EFFECT FREE BY CONSTRUCTION. Nothing here submits: no "Next" with a selection, no
// "Activate", no "Create N account". TC_8 deliberately reaches a state where Activate IS
// enabled — the page object exposes no method that clicks it.
//
// SHARED SCHOOL. FCN-CHZ-PDA is mutated by other teams — nothing asserts a school-wide count.
var schoolStudents = require("../../pages/ExperienceApp/schoolStudents.page.js");
var bulkStudents = require("../../pages/ExperienceApp/bulkStudents.page.js");
var createAdultStudentAccounts = require("../../pages/ExperienceApp/createAdultStudentAccounts.page.js");

var sts;

/**
 * Collapses whitespace and normalises apostrophes before comparing product copy.
 * The bulk-activation row message uses a CURLY apostrophe ("student’s", verified 2026-09-15)
 * while other Students-tab copy uses a straight one (§8.7) — compare words, not glyphs.
 */
function normaliseCopy(s) {
  return String(s === null || s === undefined ? "" : s)
    .replace(/[‘’ʼ]/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

module.exports = {
  /**
   * TST_SBLK_TC_RESET — BeforeEach + suite-level After housekeeping, not a functional test.
   *
   * Every SBLK case leaves the Students tab, so this returns there.
   *
   * 🚨 CORRECTED 2026-09-15 after the first run. Leaving /bulk_activation by URL does NOT discard
   * a typed row: the grid is a SERVER-SIDE DRAFT per admin account, restored on the next load in
   * any browser (admin-students-tab.md §9.5). TC_8 ends with a complete, SUBMITTABLE row (student +
   * code, Activate enabled). So when the reset finds itself on that page it EMPTIES THE GRID first —
   * otherwise the next case (and the next run, and the next person on this shared account) inherits
   * a row one click away from consuming a code. The empty grid is not evidence any TC relies on, so
   * clearing here erases nothing (ADR-019 is about the screenshot, which is already taken).
   *
   * REGISTERED IN BeforeEach AND THE SUITE-LEVEL After — NEVER AfterEach (ADR-019): the report
   * screenshot is taken after AfterEach, and leaving the page there would replace every case's
   * evidence with a picture of the student list. Carries no assertions — a reset must never
   * fail the suite — but a failed grid clear is LOGGED, never swallowed silently (Invariant 13).
   */
  TST_SBLK_TC_RESET: async function () {
    try {
      if (true === (await bulkStudents.getData_isOnBulkActivation())) {
        var grid = await bulkStudents.clear_bulkGrid();
        if (true !== grid.cleared) {
          await logger.logInto(await stackTrace.get(),
            "TST_SBLK_TC_RESET could NOT empty the bulk-activation draft: " + grid.reason, "error");
        }
      }
      if (true !== (await schoolStudents.getData_isOnStudentsTab())) {
        await schoolStudents.return_toStudentsTab();
      }
    } catch (e) {
      // Intentionally swallowed — housekeeping must not fail the suite.
    }
  },

  /**
   * TST_SBLK_TC_6 — the account-type chooser cannot be advanced without a selection.
   *
   * Resolves the manual case's [ASSUMED]: on load NEITHER radio is chosen and Next is NATIVELY
   * disabled (attribute, not CSS — verified live 2026-09-15). A live click on the disabled Next
   * left the admin on the same URL, so asserting the disabled attribute is asserting the
   * behaviour; clicking it here would only burn two 30 s Playwright timeouts.
   */
  TST_SBLK_TC_6: async function (testdata) {
    sts = await schoolStudents.click_manageStudentsOption("addNew");
    await assertion.assertEqual(sts.clickStatus, true, "Manage students → 'Add new students to classes' should be clickable");
    await assertion.assertEqual(sts.pageStatus, true, "The account-type chooser should load");

    var chooser = await bulkStudents.getData_accountTypeChooser();
    await assertion.assertEqual(chooser.url.indexOf(testdata.accountTypeUrlFragment) >= 0, true,
      "The chooser should open at '" + testdata.accountTypeUrlFragment + "' — got: " + chooser.url);
    await assertion.assertEqual(normaliseCopy(chooser.headingText), testdata.accountTypeHeading,
      "The chooser should be headed '" + testdata.accountTypeHeading + "'");
    await assertion.assertEqual(chooser.childDisplayed, true, "The 'Children' option should be shown");
    await assertion.assertEqual(chooser.adultDisplayed, true, "The 'Adults' option should be shown");
    await assertion.assertEqual(chooser.childSelected, false, "'Children' must not be pre-selected");
    await assertion.assertEqual(chooser.adultSelected, false, "'Adults' must not be pre-selected");
    await assertion.assertEqual(chooser.nextEnabled, false,
      "'Next' must be disabled while no account type is chosen — the admin cannot advance");
    await assertion.assertEqual(/\bdisabled\b/.test(String(chooser.nextClass)), true,
      "'Next' should also be styled disabled — got class: " + chooser.nextClass);
  },

  /**
   * TST_SBLK_TC_7 — the bulk activation page loads with its entry grid and CSV controls.
   */
  TST_SBLK_TC_7: async function (testdata) {
    sts = await schoolStudents.click_manageStudentsOption("activate");
    await assertion.assertEqual(sts.clickStatus, true, "Manage students → 'Activate course materials' should be clickable");
    await assertion.assertEqual(sts.pageStatus, true, "The bulk activation page should load");

    // The grid is a per-account server draft — start from a genuinely empty one (see TC_RESET).
    sts = await bulkStudents.clear_bulkGrid();
    await assertion.assertEqual(sts.cleared, true, "Setup: the bulk-activation draft should be emptied — " + sts.reason);

    var p = await bulkStudents.getData_bulkActivationPage();
    await assertion.assertEqual(p.rowCount, 1, "An empty grid should show exactly one entry row — got " + p.rowCount);
    await assertion.assertEqual(p.url.indexOf(testdata.bulkActivationUrlFragment) >= 0, true,
      "The page should open at '" + testdata.bulkActivationUrlFragment + "' — got: " + p.url);
    await assertion.assertEqual(normaliseCopy(p.headingText), testdata.bulkActivationHeading,
      "The page should be headed '" + testdata.bulkActivationHeading + "'");
    await assertion.assertEqual(p.backDisplayed, true, "A 'Back' link should be shown");
    await assertion.assertEqual(p.uploadDisplayed, true, "'Upload file' should be shown");
    await assertion.assertEqual(p.templateDisplayed, true, "'Get CSV template' should be shown");
    await assertion.assertEqual(p.helpToggleDisplayed, true, "The 'How to use this form' help toggle should be shown");
    await assertion.assertEqual(p.emailOrUsernameDisplayed, true, "Row 1 should offer 'Email or Username'");
    await assertion.assertEqual(p.firstNameDisplayed, true, "Row 1 should offer 'First name'");
    await assertion.assertEqual(p.lastNameDisplayed, true, "Row 1 should offer 'Last name'");
    await assertion.assertEqual(p.activationCodeDisplayed, true, "Row 1 should offer 'Activation code'");
    await assertion.assertEqual(p.activationCodePlaceholder, testdata.activationCodePlaceholder,
      "The activation code placeholder should read '" + testdata.activationCodePlaceholder + "'");
    // The label counts the rows, so with the single default row it is singular.
    await assertion.assertEqual(normaliseCopy(p.activateText), testdata.activateLabelOneRow,
      "The submit button should read '" + testdata.activateLabelOneRow + "'");
    await assertion.assertEqual(p.activateEnabled, false, "'Activate 1 code' should be disabled on an empty grid");
    await assertion.assertEqual(p.removeDisabledDisplayed, true, "Row 'Remove' should be shown disabled while no row is selected");
  },

  /**
   * TST_SBLK_TC_8 — Activate stays disabled until a row identifies a student AND carries a code.
   *
   * Resolves the manual case's [ASSUMED] threshold, verified live 2026-09-15:
   *   code only                 → still disabled, row asks for the student
   *   + a KNOWN student's email → First/Last name auto-fill (~4 s) and Activate becomes enabled
   *
   * ⚠️ The case ENDS with Activate enabled. It is never clicked — that would consume a code. The
   * code used is a syntactically valid, never-issued one, and the BeforeEach reset discards the row.
   */
  TST_SBLK_TC_8: async function (testdata) {
    sts = await schoolStudents.click_manageStudentsOption("activate");
    await assertion.assertEqual(sts.pageStatus, true, "The bulk activation page should load");

    // Start from a genuinely empty draft so row 1 exists and holds nothing (see TC_RESET).
    sts = await bulkStudents.clear_bulkGrid();
    await assertion.assertEqual(sts.cleared, true, "Setup: the bulk-activation draft should be emptied — " + sts.reason);

    var empty = await bulkStudents.getData_bulkRowState(1);
    await assertion.assertEqual(empty.activateEnabled, false, "Precondition: Activate is disabled on an empty row");

    // ── Step 2: code only ──
    sts = await bulkStudents.set_bulkRowField("activationCode", 1, testdata.unredeemedActivationCode);
    await assertion.assertEqual(sts.setStatus, true, "Typing the activation code should succeed");
    await assertion.assertEqual(sts.value, testdata.unredeemedActivationCode, "The code cell should hold what was typed");

    var codeOnly = await bulkStudents.getData_bulkRowState(1);
    await assertion.assertEqual(codeOnly.activateEnabled, false,
      "Activate must stay disabled while the row has a code but no student");
    var asksForStudent = codeOnly.rowMessages.map(normaliseCopy).indexOf(normaliseCopy(testdata.missingStudentMessage)) >= 0;
    await assertion.assertEqual(asksForStudent, true,
      "The row should ask for the student ('" + testdata.missingStudentMessage + "') — got: " + codeOnly.rowMessages.join(" | "));

    // ── Step 3: identify the student ──
    sts = await bulkStudents.set_bulkRowField("emailOrUsername", 1, testdata.knownStudentEmail);
    await assertion.assertEqual(sts.setStatus, true, "Typing the student's email should succeed");
    await assertion.assertEqual(await bulkStudents.wait_forRowAutofill(1), true,
      "First name should auto-fill once a known student's email is entered");

    var complete = await bulkStudents.getData_bulkRowState(1);
    await assertion.assertEqual(complete.firstName, testdata.knownStudentFirstName,
      "First name should be auto-filled as '" + testdata.knownStudentFirstName + "'");
    await assertion.assertEqual(complete.lastName, testdata.knownStudentLastName,
      "Last name should be auto-filled as '" + testdata.knownStudentLastName + "'");
    await assertion.assertEqual(complete.activateEnabled, true,
      "Activate should become enabled once the row identifies a student and carries a code");
  },

  /**
   * TST_SBLK_TC_14 — a rule-violating username/password is flagged on its own row, and account
   * creation stays unavailable while any row is invalid.
   *
   * ⚠️ EXPECTED TO FAIL AGAINST THE CURRENT PRODUCT and deliberately NOT in any execution file
   * (decision taken with the user, 2026-09-15). Reproduced on two uploads: the invalid row IS
   * flagged correctly, but "Create 2 account" stays fully ENABLED (no disabled attribute, no
   * .disabled, pointer-events auto) — admin-students-tab.md §9.4. Add this case to an execution
   * file the day that is fixed. It asserts the REQUIREMENT, never the defect.
   *
   * The adult create page is UPLOAD-ONLY (no typed rows), hence the CSV fixture. The form is
   * NEVER submitted — Create is not clicked under any outcome.
   */
  TST_SBLK_TC_14: async function (testdata) {
    sts = await createAdultStudentAccounts.navigateTo(testdata.adultCreateRelPath);
    await assertion.assertEqual(sts.pageStatus, true, "The 'Create adult student accounts' page should load");

    sts = await createAdultStudentAccounts.upload_csvFile(testdata.tc14CsvPath);
    await assertion.assertEqual(sts, true, "Uploading the fixture CSV should succeed");

    var valid = await createAdultStudentAccounts.getData_rowFieldValidity(testdata.tc14ValidRow);
    await assertion.assertEqual(valid.usernameInvalid, false, "The VALID row's username should not be flagged");
    await assertion.assertEqual(valid.passwordInvalid, false, "The VALID row's password should not be flagged");

    var invalid = await createAdultStudentAccounts.getData_rowFieldValidity(testdata.tc14InvalidRow);
    await assertion.assertEqual(invalid.usernameInvalid, true, "The rule-violating username should be flagged on its own row");
    await assertion.assertEqual(invalid.passwordInvalid, true, "The rule-violating password should be flagged on its own row");

    var errors = await createAdultStudentAccounts.getData_uploadErrors();
    await assertion.assertEqual(errors.indexOf(testdata.tc14UsernameError) >= 0, true,
      "The username message should read '" + testdata.tc14UsernameError + "' — got: " + errors.join(" | "));
    await assertion.assertEqual(errors.indexOf(testdata.tc14PasswordError) >= 0, true,
      "The password message should read '" + testdata.tc14PasswordError + "' — got: " + errors.join(" | "));

    var create = await createAdultStudentAccounts.getData_createButtonState();
    await assertion.assertEqual(create.available, false,
      "Account creation must be unavailable while a row is invalid — OPEN DEFECT (2026-09-15): '" +
      create.text + "' is enabled (disabled attr: " + create.disabledAttr + ", pointer-events: " + create.pointerEvents + ")");
  }
};

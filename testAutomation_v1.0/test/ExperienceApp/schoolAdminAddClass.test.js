"use strict";
// Admin App — School-admin "Add class" flow (Run 1: create class only).
// Login is composed from existing TCs in the execution file's Before hook
// (launchUrl → TST_LAND_TC_3 → TST_LOGI_TC_1/2 → TST_NEMO24306_TC_LOGIN),
// so this file only contains the genuinely new steps (ADR-011: reuse, don't redefine).
var schoolAdminDashboard = require("../../pages/ExperienceApp/schoolAdminDashboard.page.js");
var schoolClasses = require("../../pages/ExperienceApp/schoolClasses.page.js");
var createClasses = require("../../pages/ExperienceApp/createClasses.page.js");
var sts;

module.exports = {
  /**
   * TST_SADB_TC_1 — Open the target school by its unique school key.
   * testdata: { schoolKey }
   */
  TST_SADB_TC_1: async function (testdata) {
    sts = await schoolAdminDashboard.click_schoolByKey(testdata.schoolKey);
    await assertion.assertEqual(
      sts.pageStatus,
      true,
      "School Classes page did not load for key " + testdata.schoolKey
    );
  },

  /**
   * TST_SCLS_TC_1 — Capture the current active-class count (baseline).
   * Creation is async, so this count is logged as a baseline, not asserted against
   * a post-create value. We assert only that a numeric count was read.
   */
  TST_SCLS_TC_1: async function (testdata) {
    sts = await schoolClasses.getData_activeClassCount();
    await assertion.assert(
      typeof sts.count === "number",
      "Active class count could not be read (raw: " + sts.raw + ")"
    );
  },

  /**
   * TST_SCLS_TC_2 — Click "Add class" and confirm the create form loaded.
   */
  TST_SCLS_TC_2: async function (testdata) {
    sts = await schoolClasses.click_addClass();
    await assertion.assertEqual(
      sts.pageStatus,
      true,
      "Create new classes form did not load"
    );
  },

  /**
   * TST_CCLS_TC_1 — Enter the class name.
   * testdata: { className }
   */
  TST_CCLS_TC_1: async function (testdata) {
    sts = await createClasses.set_className(testdata.className);
    await assertion.assertEqual(sts, true, "className is not set");
  },

  /**
   * TST_CCLS_TC_2 — Set the start date (today).
   */
  TST_CCLS_TC_2: async function (testdata) {
    sts = await createClasses.set_startDate();
    await assertion.assertEqual(sts, true, "startDate is not set");
  },

  /**
   * TST_CCLS_TC_3 — Set the end date (day 15 of next month).
   */
  TST_CCLS_TC_3: async function (testdata) {
    sts = await createClasses.set_endDate();
    await assertion.assertEqual(sts, true, "endDate is not set");
  },

  /**
   * TST_CCLS_TC_5 — Open the row's "Add Materials" modal.
   */
  TST_CCLS_TC_5: async function (testdata) {
    sts = await createClasses.click_addMaterialBtn();
    await assertion.assertEqual(sts, true, "Add Materials modal did not open");
  },

  /**
   * TST_CCLS_TC_6 — Search for and select the material by name.
   * testdata: { material }
   */
  TST_CCLS_TC_6: async function (testdata) {
    sts = await createClasses.select_material(testdata.material);
    await assertion.assertEqual(sts, true, "material '" + testdata.material + "' was not selected");
  },

  /**
   * TST_CCLS_TC_7 — Confirm "Add materials" and verify the material attached to the row.
   * testdata: { material }
   */
  TST_CCLS_TC_7: async function (testdata) {
    var res = await createClasses.click_addMaterialsConfirm();
    await assertion.assertEqual(res.added, true, "material chip did not render on the row");
    await assertion.assertEqual(
      res.material,
      testdata.material,
      "attached material mismatch (got: " + res.material + ")"
    );
  },

  /**
   * TST_CCLS_TC_4 — Click "Create class" and verify the success dialog.
   * testdata: { successMessage }  (substring expected in the dialog title)
   */
  TST_CCLS_TC_4: async function (testdata) {
    sts = await createClasses.click_createClass();
    await assertion.assertEqual(sts, true, "createClass did not reach the success dialog");
    var msg = await createClasses.getData_successMessage();
    await assertion.assertEqual(msg.shown, true, "Success dialog was not shown");
    await assertion.assert(
      typeof msg.title === "string" && msg.title.indexOf(testdata.successMessage) !== -1,
      "Success dialog text mismatch. Expected to contain '" +
        testdata.successMessage +
        "' but got: " + msg.title
    );
  },

  /**
   * TST_CCLS_TC_8 — From the success dialog, click "Back to dashboard" and confirm the
   * school Classes page (the school dashboard) reloads.
   */
  TST_CCLS_TC_8: async function (testdata) {
    sts = await createClasses.click_backToDashboard();
    await assertion.assertEqual(
      sts.pageStatus,
      true,
      "School Classes dashboard did not load after 'Back to dashboard'"
    );
  },

  // ── Scenario #3 (bulk create form) — Edge / Negative validation ───────────────
  // These run on a FRESH, empty create form (own execution suite) and never create a
  // class. Manual doc mapping: TC_9←BCCF_TC_15, TC_10←BCCF_TC_16, TC_11←BCCF_TC_13,
  // TC_12←BCCF_TC_14.

  /**
   * TST_CCLS_TC_9 (Negative) — "Create N class" is disabled when a row is missing a
   * required field (BCCF_TC_15). The form auto-restores a saved draft, so it is not
   * guaranteed empty on load; we clear the class name first to deterministically create
   * an incomplete row, then assert Create stays disabled.
   */
  TST_CCLS_TC_9: async function (testdata) {
    var cleared = await createClasses.clear_className();
    await assertion.assertEqual(cleared, true, "class name could not be cleared");
    var enabled = await createClasses.getData_createBtnEnabled();
    await assertion.assertEqual(
      enabled,
      false,
      "Create button should be disabled on an empty row but was enabled"
    );
  },

  /**
   * TST_CCLS_TC_10 (Negative) — a non-alphanumeric-only class name (e.g. "---") does
   * not satisfy the name rule, so "Create N class" stays disabled (BCCF_TC_16).
   * testdata: { invalidName }
   */
  TST_CCLS_TC_10: async function (testdata) {
    sts = await createClasses.set_className(testdata.invalidName);
    await assertion.assertEqual(sts, true, "invalidName is not set");
    var enabled = await createClasses.getData_createBtnEnabled();
    await assertion.assertEqual(
      enabled,
      false,
      "Create button should stay disabled for a non-alphanumeric name '" +
        testdata.invalidName + "' but was enabled"
    );
  },

  /**
   * TST_CCLS_TC_11 (Edge) — the class-name input caps input at 50 characters
   * (maxlength=50), so a name cannot exceed the maximum (BCCF_TC_13).
   * testdata: { classNameMaxLength }
   */
  TST_CCLS_TC_11: async function (testdata) {
    var res = await createClasses.getData_classNameMaxLength();
    await assertion.assertEqual(
      res.max,
      testdata.classNameMaxLength,
      "class-name maxlength mismatch (raw: " + res.raw + ")"
    );
  },

  /**
   * TST_CCLS_TC_12 (Edge) — with a start date of today, the End-date picker disables
   * days on/before the start, so an end date earlier than the start cannot be chosen
   * (BCCF_TC_14).
   */
  TST_CCLS_TC_12: async function (testdata) {
    var startSet = await createClasses.set_startDate();
    await assertion.assertEqual(startSet, true, "startDate is not set");
    var disabledCount = await createClasses.getData_endDatePickerDisabledCount();
    await assertion.assert(
      typeof disabledCount === "number" && disabledCount > 0,
      "End-date picker showed no disabled cells for dates on/before the start date " +
        "(count: " + disabledCount + ")"
    );
  },

  /**
   * TST_CCLS_TC_13 (Positive) — bulk: filling a SECOND class row increases the count in
   * the "Create N class(es)" button by exactly one, proving the form accumulates rows
   * for bulk creation (BCCF_TC_6). Deliberately asserts the DELTA and never clicks
   * Create — the form can restore an auto-saved draft (so the starting count is not
   * fixed), and no class is created, keeping the test school clean.
   * testdata: { className, classNameRow2 }
   */
  TST_CCLS_TC_13: async function (testdata) {
    // Row 1 is set explicitly so the baseline is a known-complete row regardless of draft.
    sts = await createClasses.set_className(testdata.className);
    await assertion.assertEqual(sts, true, "row 1 className is not set");
    sts = await createClasses.set_startDate();
    await assertion.assertEqual(sts, true, "row 1 startDate is not set");
    sts = await createClasses.set_endDate();
    await assertion.assertEqual(sts, true, "row 1 endDate is not set");

    var before = await createClasses.getData_createBtnLabel();
    await assertion.assert(
      typeof before.count === "number",
      "Create button count could not be read (label: " + before.raw + ")"
    );

    sts = await createClasses.set_className_row2(testdata.classNameRow2);
    await assertion.assertEqual(sts, true, "row 2 className is not set");
    sts = await createClasses.set_startDate_row2();
    await assertion.assertEqual(sts, true, "row 2 startDate is not set");
    sts = await createClasses.set_endDate_row2();
    await assertion.assertEqual(sts, true, "row 2 endDate is not set");

    var after = await createClasses.getData_createBtnLabel();
    await assertion.assertEqual(
      after.count,
      before.count + 1,
      "Create button count did not increase by 1 after filling a second row " +
        "(before: " + before.raw + ", after: " + after.raw + ")"
    );
  }
};

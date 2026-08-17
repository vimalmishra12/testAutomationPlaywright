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

  /**
   * TST_CCLS_TC_9 — Set teacher email/name via Add Teacher modal during class creation.
   * testdata: { teacherEmail } (or string teacher email value)
   */
  TST_CCLS_TC_9: async function (testdata) {
    var teacherVal = typeof testdata === "string" ? testdata : (testdata.teacherEmail || (testdata.instructor && testdata.instructor.email) || "");
    sts = await createClasses.set_teacher(teacherVal);
    await assertion.assertEqual(sts, true, "teacher value was not set in class creation form");
  }
};

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
   *
   * Resets first so the row carries NO pre-existing end date. An Owl date-picker opens
   * on the month of its currently-selected value, so a leftover end date far in the
   * future (e.g. a restored draft holding Jun 2027) makes the picker open on a month
   * entirely after the start date — where nothing is disabled and the count is 0.
   * Observed exactly that: this TC found 18 disabled cells on a clean form early in the
   * session, then 0 once the bulk suite had left dates in the draft.
   */
  TST_CCLS_TC_12: async function (testdata) {
    var wasReset = await createClasses.reset_formToSingleEmptyRow();
    await assertion.assertEqual(wasReset, true, "form did not reset to a single empty row");
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
    // Reset first: the form restores an auto-saved draft, so row 2 may ALREADY be
    // filled from a previous run (e.g. by TST_CCLS_TC_18's duplicate) — re-filling an
    // already-complete row adds no class, and the +1 delta below would never happen.
    var wasReset = await createClasses.reset_formToSingleEmptyRow();
    await assertion.assertEqual(wasReset, true, "form did not reset to a single empty row");
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
  },

  /**
   * TST_CCLS_TC_14 (Positive) — BCCF_TC_1: the "Create new classes" bulk form loads
   * with every top-level component (CSV actions, help, the full bulk-action
   * toolbar, the first row's core fields) and "Create N class" is disabled. Clears
   * the row name first (form auto-restores a draft — same lesson as TC_9) so the
   * disabled check is not defeated by leftover data.
   */
  TST_CCLS_TC_14: async function (testdata) {
    var cleared = await createClasses.clear_className();
    await assertion.assertEqual(cleared, true, "class name could not be cleared");
    var comp = await createClasses.getData_formComponentsPresent();
    for (var key in comp) {
      await assertion.assertEqual(
        comp[key],
        true,
        "Form component check failed for '" + key + "' (full result: " + JSON.stringify(comp) + ")"
      );
    }
  },

  /**
   * TST_CCLS_TC_15 (Positive) — BCCF_TC_3: a teacher (email only, first/last name
   * optional) can be added to a class row via the "Edit teachers" modal.
   * testdata: { className, teacherEmail }
   */
  TST_CCLS_TC_15: async function (testdata) {
    var namedSet = await createClasses.set_className(testdata.className);
    await assertion.assertEqual(namedSet, true, "className is not set");
    var opened = await createClasses.click_addTeachersBtn();
    await assertion.assertEqual(opened, true, "Edit teachers modal did not open");
    var emailSet = await createClasses.set_teacherEmail(testdata.teacherEmail);
    await assertion.assertEqual(emailSet, true, "teacherEmail is not set");
    var res = await createClasses.click_teacherApplyChanges();
    await assertion.assertEqual(res.added, true, "teacher chip did not render on the row");
    await assertion.assertEqual(
      res.email,
      testdata.teacherEmail,
      "applied teacher email mismatch (got: " + res.email + ")"
    );
  },

  /**
   * TST_CCLS_TC_16 (Positive) — BCCF_TC_5: an existing label can be selected from
   * the "Add class label" dropdown and applies to the row.
   *
   * Resets and sets its own name rather than inheriting a row from a previous TC:
   * a restored draft can arrive with the label ALREADY applied, and re-selecting it
   * would toggle it off instead of on.
   * testdata: { className, classLabel }
   */
  TST_CCLS_TC_16: async function (testdata) {
    var wasReset = await createClasses.reset_formToSingleEmptyRow();
    await assertion.assertEqual(wasReset, true, "form did not reset to a single empty row");
    sts = await createClasses.set_className(testdata.className);
    await assertion.assertEqual(sts, true, "className is not set");

    var opened = await createClasses.click_addLabelBtn();
    await assertion.assertEqual(opened, true, "Add class label dropdown did not open");
    var selected = await createClasses.select_classLabel(testdata.classLabel);
    await assertion.assertEqual(selected, true, "label '" + testdata.classLabel + "' was not selected");
    var res = await createClasses.getData_appliedLabel();
    await assertion.assert(
      typeof res.raw === "string" && res.raw.indexOf(testdata.classLabel) !== -1,
      "Applied label mismatch. Expected to contain '" + testdata.classLabel + "' but got: " + res.raw
    );
  },

  /**
   * TST_CCLS_TC_21 (Positive) — BCCF_TC_8: "Copy an Existing Class" copies a source
   * class's settings onto the selected row(s). Confirmed live as a 2-STEP wizard:
   * search/pick a source class → Continue → tick what to copy → Continue.
   * Copies the chosen categories only; the row's own name and dates are NOT
   * overwritten. Creates no class.
   *
   * Resets first so the copy lands on a known row (the form restores a draft).
   * testdata: { className, copySourceClass }
   *
   * ⚠️ Depends on `copySourceClass` existing in the target school AND having at least
   * one teacher and one course material — the copy options are disabled when the
   * source has none of that kind (label shows e.g. "Assignments [0]").
   */
  TST_CCLS_TC_21: async function (testdata) {
    var wasReset = await createClasses.reset_formToSingleEmptyRow();
    await assertion.assertEqual(wasReset, true, "form did not reset to a single empty row");

    sts = await createClasses.set_className(testdata.className);
    await assertion.assertEqual(sts, true, "className is not set");
    sts = await createClasses.set_startDate();
    await assertion.assertEqual(sts, true, "startDate is not set");
    sts = await createClasses.set_endDate();
    await assertion.assertEqual(sts, true, "endDate is not set");

    var checked = await createClasses.click_rowCheckbox();
    await assertion.assertEqual(checked, true, "row checkbox is not clicked");

    var opened = await createClasses.click_toolbarCopyExistingClass();
    await assertion.assertEqual(opened, true, "'Copy an Existing Class' modal did not open");
    var picked = await createClasses.select_copySourceClass(testdata.copySourceClass);
    await assertion.assertEqual(
      picked,
      true,
      "source class '" + testdata.copySourceClass + "' could not be selected"
    );
    var applied = await createClasses.apply_copyOptions();
    await assertion.assertEqual(applied, true, "copy options were not applied");

    // The row records WHICH class it was copied from...
    var copied = await createClasses.getData_copiedFrom();
    await assertion.assertEqual(copied.shown, true, "'Copied from a class' indicator did not render");
    await assertion.assert(
      typeof copied.text === "string" && copied.text.indexOf(testdata.copySourceClass) !== -1,
      "'Copied from a class' does not name the source class. Expected to contain '" +
        testdata.copySourceClass + "' but got: " + copied.text
    );

    // ...and the copied categories actually landed on the row.
    var row = await createClasses.getData_row1Values();
    await assertion.assert(
      typeof row.teacher === "string" && row.teacher.length > 0,
      "no teacher was copied onto the row (got: " + row.teacher + ")"
    );
    await assertion.assert(
      typeof row.material === "string" && row.material.length > 0,
      "no course material was copied onto the row (got: " + row.material + ")"
    );
    // The row's own name is preserved — copy does not overwrite it.
    await assertion.assertEqual(row.name, testdata.className, "copy overwrote the row's class name");
  },

  /**
   * TST_CCLS_TC_20 (Positive) — BCCF_TC_12, "Create more classes" leg. The success
   * dialog offers "Back to dashboard" (already covered by TST_CCLS_TC_8) and
   * "Create more classes"; either one dismisses the dialog, so each leg needs its
   * OWN created class — hence this TC creates one of its own.
   *
   * ⚠️ This TC CREATES A REAL CLASS (async, triggers an email report). It lives in the
   * workflow suite, which already creates classes, deliberately keeping the bulk
   * suite (schoolAdminAddClassBulk.json) side-effect free.
   *
   * Precondition: on a fresh Create-new-classes form (compose TST_SCLS_TC_2 before it).
   * testdata: { createMoreClassName, successMessage }
   */
  TST_CCLS_TC_20: async function (testdata) {
    sts = await createClasses.set_className(testdata.createMoreClassName);
    await assertion.assertEqual(sts, true, "createMoreClassName is not set");
    sts = await createClasses.set_startDate();
    await assertion.assertEqual(sts, true, "startDate is not set");
    sts = await createClasses.set_endDate();
    await assertion.assertEqual(sts, true, "endDate is not set");

    sts = await createClasses.click_createClass();
    await assertion.assertEqual(sts, true, "createClass did not reach the success dialog");
    var msg = await createClasses.getData_successMessage();
    await assertion.assertEqual(msg.shown, true, "Success dialog was not shown");

    // The leg under test: "Create more classes" must return a usable create form.
    var res = await createClasses.click_createMoreClasses();
    await assertion.assertEqual(
      res.pageStatus,
      true,
      "'Create more classes' did not return to a usable Create new classes form"
    );
    // ...and it comes back genuinely EMPTY. Confirmed live 2026-08-18 (the manual doc's
    // [ASSUMED] on this point): notable because the form otherwise restores an auto-saved
    // draft — this path is the one place it does not.
    await assertion.assertEqual(res.rowName, "", "form was not reset — class name persisted");
    await assertion.assertEqual(res.rowStart, "", "form was not reset — start date persisted");
    await assertion.assertEqual(res.rowEnd, "", "form was not reset — end date persisted");
  },

  /**
   * TST_CCLS_TC_22 (Positive) — BCCF_TC_10: "Get CSV template" downloads the bulk
   * class-creation template with the correct column headers. Downloads only —
   * creates nothing.
   * testdata: { csvTemplateFileName, csvTemplateHeaders }
   */
  TST_CCLS_TC_22: async function (testdata) {
    var res = await createClasses.getData_csvTemplate();
    await assertion.assertEqual(res.downloaded, true, "CSV template did not download");
    await assertion.assertEqual(
      res.fileName,
      testdata.csvTemplateFileName,
      "downloaded template filename mismatch"
    );
    await assertion.assertEqual(
      res.headers.length,
      testdata.csvTemplateHeaders.length,
      "template column count mismatch (got: " + JSON.stringify(res.headers) + ")"
    );
    for (var i = 0; i < testdata.csvTemplateHeaders.length; i++) {
      await assertion.assertEqual(
        res.headers[i],
        testdata.csvTemplateHeaders[i],
        "template column " + (i + 1) + " mismatch"
      );
    }
  },

  /**
   * TST_CCLS_TC_19 (Positive) — BCCF_TC_11: uploading a CSV in the template format
   * bulk-adds its classes to the form. Verified live: the upload POPULATES the form's
   * rows and creates NOTHING — creation still requires clicking "Create N classes",
   * which this TC deliberately does not do, so the test school stays clean.
   *
   * Resets first so the uploaded rows land at known indices (the form restores a
   * draft otherwise). The expected date strings are the form's DISPLAY format
   * ("Tue, Sep 15, 2026"), not the CSV's DD/MM/YYYY input format.
   * testdata: { csvPath, csvClass1Name, csvClass2Name, csvStartDate, csvEndDate, csvClassCount }
   */
  TST_CCLS_TC_19: async function (testdata) {
    var wasReset = await createClasses.reset_formToSingleEmptyRow();
    await assertion.assertEqual(wasReset, true, "form did not reset to a single empty row");

    var uploaded = await createClasses.upload_csvFile(testdata.csvPath);
    await assertion.assertEqual(uploaded, true, "CSV upload did not populate the form");

    // Both CSV rows landed, in order, with their dates parsed from DD/MM/YYYY.
    var row1 = await createClasses.getData_row1Values();
    await assertion.assertEqual(row1.name, testdata.csvClass1Name, "CSV row 1 class name mismatch");
    await assertion.assertEqual(row1.start, testdata.csvStartDate, "CSV row 1 start date mismatch");
    await assertion.assertEqual(row1.end, testdata.csvEndDate, "CSV row 1 end date mismatch");

    var row2 = await createClasses.getData_row2Values();
    await assertion.assertEqual(row2.name, testdata.csvClass2Name, "CSV row 2 class name mismatch");
    await assertion.assertEqual(row2.start, testdata.csvStartDate, "CSV row 2 start date mismatch");
    await assertion.assertEqual(row2.end, testdata.csvEndDate, "CSV row 2 end date mismatch");

    // The Create button reflects the uploaded rows as PENDING — nothing is created.
    var label = await createClasses.getData_createBtnLabel();
    await assertion.assertEqual(
      label.count,
      testdata.csvClassCount,
      "Create button count does not match the uploaded CSV row count (label: " + label.raw + ")"
    );
  },

  /**
   * TST_CCLS_TC_18 (Positive) — BCCF_TC_7: "Duplicate" copies a selected class row.
   * Verified live: Duplicate is immediate (no confirm of its own) and the copy is
   * APPENDED AFTER THE LAST FILLED ROW carrying the same name (no "Copy of" prefix),
   * dates, teacher and material. Labels are the exception — they are copied only via
   * the "Apply the labels to new classes too?" dialog, which appears only when the
   * source row has a label.
   *
   * The form restores an auto-saved draft, so this TC FIRST resets to a single empty
   * row — without that the copy's row index is unpredictable and the comparison below
   * would be meaningless. Creates no class.
   * testdata: { className, teacherEmail }
   */
  TST_CCLS_TC_18: async function (testdata) {
    var wasReset = await createClasses.reset_formToSingleEmptyRow();
    await assertion.assertEqual(wasReset, true, "form did not reset to a single empty row");

    // Build a known source row: name + both dates + a teacher (proves non-date
    // fields are copied too). Label is deliberately NOT set — see TC_16.
    sts = await createClasses.set_className(testdata.className);
    await assertion.assertEqual(sts, true, "className is not set");
    sts = await createClasses.set_startDate();
    await assertion.assertEqual(sts, true, "startDate is not set");
    sts = await createClasses.set_endDate();
    await assertion.assertEqual(sts, true, "endDate is not set");
    sts = await createClasses.click_addTeachersBtn();
    await assertion.assertEqual(sts, true, "Edit teachers modal did not open");
    sts = await createClasses.set_teacherEmail(testdata.teacherEmail);
    await assertion.assertEqual(sts, true, "teacherEmail is not set");
    var teacherRes = await createClasses.click_teacherApplyChanges();
    await assertion.assertEqual(teacherRes.added, true, "teacher was not added to the source row");

    var before = await createClasses.getData_createBtnLabel();
    var source = await createClasses.getData_row1Values();

    var checked = await createClasses.click_rowCheckbox();
    await assertion.assertEqual(checked, true, "row checkbox is not clicked");
    var duplicated = await createClasses.click_toolbarDuplicate(true);
    await assertion.assertEqual(duplicated, true, "Duplicate did not complete");

    // One more class row now exists...
    var after = await createClasses.getData_createBtnLabel();
    await assertion.assertEqual(
      after.count,
      before.count + 1,
      "Create button count did not increase by 1 after Duplicate " +
        "(before: " + before.raw + ", after: " + after.raw + ")"
    );

    // ...and it carries the source row's details.
    var copy = await createClasses.getData_row2Values();
    await assertion.assertEqual(copy.name, source.name, "duplicated row name mismatch");
    await assertion.assertEqual(copy.start, source.start, "duplicated row start date mismatch");
    await assertion.assertEqual(copy.end, source.end, "duplicated row end date mismatch");
    await assertion.assertEqual(copy.teacher, source.teacher, "duplicated row teacher mismatch");
  },

  /**
   * TST_CCLS_TC_17 (Positive) — BCCF_TC_9: selecting a row and using the toolbar's
   * "Start date"/"End date" actions bulk-applies the chosen dates to the selected
   * row(s) at once (verified with 1 selected row — the toolbar mechanism is
   * identical for more; extra rows add no additional verification here).
   *
   * Two product behaviours drive the shape of this test, both confirmed live:
   *  1. The form restores an auto-saved draft, so it resets first for a known row.
   *  2. Applying a bulk date CLEARS the row selection ("All selected" → "0 Selected"),
   *     which re-disables the toolbar — so the row must be re-selected before the
   *     second (End date) action, otherwise that click silently does nothing.
   * testdata: { className }
   */
  TST_CCLS_TC_17: async function (testdata) {
    var wasReset = await createClasses.reset_formToSingleEmptyRow();
    await assertion.assertEqual(wasReset, true, "form did not reset to a single empty row");
    sts = await createClasses.set_className(testdata.className);
    await assertion.assertEqual(sts, true, "className is not set");

    var checked = await createClasses.click_rowCheckbox();
    await assertion.assertEqual(checked, true, "row checkbox is not clicked");
    var startSet = await createClasses.click_toolbarStartDate();
    await assertion.assertEqual(startSet, true, "bulk toolbar start date is not set");

    // Re-select: the start-date action cleared the selection (see note above).
    var reChecked = await createClasses.click_rowCheckbox();
    await assertion.assertEqual(reChecked, true, "row checkbox is not re-selected before End date");
    var endSet = await createClasses.click_toolbarEndDate();
    await assertion.assertEqual(endSet, true, "bulk toolbar end date is not set");
    var dates = await createClasses.getData_rowDates();
    await assertion.assert(
      typeof dates.start === "string" && dates.start.length > 0,
      "Row start date was not applied by the bulk toolbar action (raw: " + dates.start + ")"
    );
    await assertion.assert(
      typeof dates.end === "string" && dates.end.length > 0,
      "Row end date was not applied by the bulk toolbar action (raw: " + dates.end + ")"
    );
  }
};

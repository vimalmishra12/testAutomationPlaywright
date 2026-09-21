"use strict";

/**
 * Bulk Class Creation with Mailsac Email Verification Test Suite.
 *
 * Module: BCEV (Bulk Class Email Verification)
 *
 * Full Browser UI Testing for Mailsac Web Application and Cambridge One School Dashboard.
 */

var mailsacUI = require("../../pages/ExperienceApp/mailsacUI.page.js");
var schoolClasses = require("../../pages/ExperienceApp/schoolClasses.page.js");
var createClasses = require("../../pages/ExperienceApp/createClasses.page.js");
var action = require("../../core/actionLibrary/baseActionLibrary.js");
var sts;

module.exports = {
  /**
   * TST_BCEV_TC_1 — Purge admin inbox via Mailsac UI before test execution.
   * testdata: { adminEmail }
   */
  TST_BCEV_TC_1: async function (testdata) {
    sts = await mailsacUI.purgeInboxUI(testdata.adminEmail);
    await assertion.assertEqual(
      sts.purged,
      true,
      "Failed to purge admin inbox in UI: " + testdata.adminEmail
    );
  },

  /**
   * TST_BCEV_TC_2 — Purge teacher inbox via Mailsac UI before test execution.
   * testdata: { teacherEmail }
   */
  TST_BCEV_TC_2: async function (testdata) {
    sts = await mailsacUI.purgeInboxUI(testdata.teacherEmail);
    await assertion.assertEqual(
      sts.purged,
      true,
      "Failed to purge teacher inbox in UI: " + testdata.teacherEmail
    );
  },

  /**
   * TST_BCEV_TC_3 — Verify admin received 1 summary report email via Mailsac UI.
   * testdata: { adminEmail, expectedCreatedCount, expectedFailedCount, emailTimeoutMs, mailsacUser, mailsacPassword }
   */
  TST_BCEV_TC_3: async function (testdata) {
    var createdCount = testdata.expectedCreatedCount !== undefined ? testdata.expectedCreatedCount : 2;
    var failedCount = testdata.expectedFailedCount !== undefined ? testdata.expectedFailedCount : 0;
    var timeout = testdata.emailTimeoutMs || 60000;

    // Login to Mailsac if credentials are provided
    if (testdata.mailsacUser && testdata.mailsacPassword) {
      await mailsacUI.loginToMailsac(testdata.mailsacUser, testdata.mailsacPassword);
    }

    sts = await mailsacUI.verifyAdminEmailUI(
      testdata.adminEmail,
      createdCount,
      failedCount,
      timeout
    );

    await assertion.assertEqual(
      sts.found,
      true,
      "Admin summary email was not found in Mailsac UI on: " + testdata.adminEmail
    );

    await assertion.assertEqual(
      sts.hasCreated,
      true,
      "Admin email body in UI did not contain '" + createdCount + " created successfully'"
    );

    await assertion.assertEqual(
      sts.hasFailed,
      true,
      "Admin email body in UI did not contain '" + failedCount + " failed'"
    );

    await assertion.assertEqual(
      sts.isMatch,
      true,
      "Admin summary email validation in Mailsac UI failed"
    );
  },

  /**
   * TST_BCEV_TC_4 — Verify teacher received 2 per-class notification emails via Mailsac UI.
   * testdata: { teacherEmail, class1Name, class2Name, adminEmail, schoolDisplayName, emailTimeoutMs, mailsacUser, mailsacPassword }
   */
  TST_BCEV_TC_4: async function (testdata) {
    var class1 = testdata.class1Name || "BulkEmail_Class1";
    var class2 = testdata.class2Name || "BulkEmail_Class2";
    var expectedClasses = [class1, class2];
    var timeout = testdata.emailTimeoutMs || 60000;

    // Login to Mailsac if credentials are provided
    if (testdata.mailsacUser && testdata.mailsacPassword) {
      await mailsacUI.loginToMailsac(testdata.mailsacUser, testdata.mailsacPassword);
    }

    sts = await mailsacUI.verifyTeacherEmailsUI(
      testdata.teacherEmail,
      expectedClasses,
      testdata.adminEmail,
      testdata.schoolDisplayName,
      timeout
    );

    await assertion.assertEqual(
      sts.found,
      true,
      "Teacher notification emails were not found in Mailsac UI on: " + testdata.teacherEmail
    );

    await assertion.assertEqual(
      sts.matchedAll,
      true,
      "Not all expected classes (" + expectedClasses.join(", ") + ") were found in teacher notification emails"
    );
  },

  /**
   * TST_BCEV_TC_5 — Cleanup: delete admin emails in Mailsac UI.
   * testdata: { adminEmail }
   */
  TST_BCEV_TC_5: async function (testdata) {
    sts = await mailsacUI.purgeInboxUI(testdata.adminEmail);
    await assertion.assertEqual(
      sts.purged,
      true,
      "Failed to cleanup admin inbox in Mailsac UI: " + testdata.adminEmail
    );
  },

  /**
   * TST_BCEV_TC_6 — Cleanup: delete teacher emails in Mailsac UI.
   * testdata: { teacherEmail }
   */
  TST_BCEV_TC_6: async function (testdata) {
    sts = await mailsacUI.purgeInboxUI(testdata.teacherEmail);
    await assertion.assertEqual(
      sts.purged,
      true,
      "Failed to cleanup teacher inbox in Mailsac UI: " + testdata.teacherEmail
    );
  },

  /**
   * TST_BCEV_TC_7 — Search for Class 1 in the dashboard class list and verify it exists.
   * testdata: { className } or { class1Name }
   */
  TST_BCEV_TC_7: async function (testdata) {
    var className = testdata.className || testdata.class1Name || "BulkEmail_Class1";
    await schoolClasses.clear_search();
    sts = await schoolClasses.search_class(className);
    await assertion.assertEqual(
      sts.pageStatus,
      true,
      "Class list did not update after searching for '" + className + "'"
    );

    var rows = await schoolClasses.getData_classRows();
    var exists = rows.some(function (r) {
      return r.name === className;
    });

    await assertion.assertEqual(
      exists,
      true,
      "Created class '" + className + "' was not found in dashboard class list"
    );

    await schoolClasses.clear_search();
  },

  /**
   * TST_BCEV_TC_8 — Search for Class 2 in the dashboard class list and verify it exists.
   * testdata: { className } or { class2Name }
   */
  TST_BCEV_TC_8: async function (testdata) {
    var className = testdata.class2Name || testdata.className || "BulkEmail_Class2";
    await schoolClasses.clear_search();
    sts = await schoolClasses.search_class(className);
    await assertion.assertEqual(
      sts.pageStatus,
      true,
      "Class list did not update after searching for '" + className + "'"
    );

    var rows = await schoolClasses.getData_classRows();
    var exists = rows.some(function (r) {
      return r.name === className;
    });

    await assertion.assertEqual(
      exists,
      true,
      "Created class '" + className + "' was not found in dashboard class list"
    );

    await schoolClasses.clear_search();
  },

  /**
   * TST_BCEV_TC_9 — Bulk create Class 1 & Class 2 together with Start Date, End Date, and Teacher (No label, No material).
   * testdata: { class1Name, class2Name, className, classNameRow2, teacherEmail, successMessage }
   */
  TST_BCEV_TC_9: async function (testdata) {
    var class1 = testdata.class1Name || testdata.className || "BulkEmail_Class1";
    var class2 = testdata.class2Name || testdata.classNameRow2 || "BulkEmail_Class2";
    var teacher = testdata.teacherEmail || "teacher17aug2026@mailsac.com";
    var expectedMsg = testdata.successMessage || "Success! We are now creating";

    // 1. Fill Row 1: Class 1 Name + Start Date (today) + End Date (15th of next month)
    var r1Name = await createClasses.set_className(class1);
    await assertion.assertEqual(r1Name, true, "Row 1 class name was not set: " + class1);

    var r1Start = await createClasses.set_startDate();
    await assertion.assertEqual(r1Start, true, "Row 1 start date was not set");

    var r1End = await createClasses.set_endDate();
    await assertion.assertEqual(r1End, true, "Row 1 end date was not set");

    // 2. Fill Row 2: Class 2 Name + Start Date (today) + End Date (15th of next month)
    var r2Name = await createClasses.set_className_row2(class2);
    await assertion.assertEqual(r2Name, true, "Row 2 class name was not set: " + class2);

    var r2Start = await createClasses.set_startDate_row2();
    await assertion.assertEqual(r2Start, true, "Row 2 start date was not set");

    var r2End = await createClasses.set_endDate_row2();
    await assertion.assertEqual(r2End, true, "Row 2 end date was not set");

    // 3. Add Teacher to Row 1
    var opened1 = await createClasses.click_addTeachersBtn();
    await assertion.assertEqual(opened1, true, "Row 1 Edit teachers modal did not open");

    var emailSet1 = await createClasses.set_teacherEmail(teacher);
    await assertion.assertEqual(emailSet1, true, "Row 1 teacher email was not set: " + teacher);
    await createClasses.set_teacherFirstName("Teacher");
    await createClasses.set_teacherLastName("Test");

    var applied1 = await createClasses.click_teacherApplyChanges();
    await assertion.assertEqual(applied1.added, true, "Teacher was not applied to row 1");

    // 4. Add Teacher to Row 2
    var opened2 = await createClasses.click_addTeachersBtn_row2();
    await assertion.assertEqual(opened2, true, "Row 2 Edit teachers modal did not open");

    var emailSet2 = await createClasses.set_teacherEmail(teacher);
    await assertion.assertEqual(emailSet2, true, "Row 2 teacher email was not set: " + teacher);
    await createClasses.set_teacherFirstName("Teacher");
    await createClasses.set_teacherLastName("Test");

    var applied2 = await createClasses.click_teacherApplyChanges_row2();
    await assertion.assertEqual(applied2.added, true, "Teacher was not applied to row 2");


    // 4. Click 'Create 2 classes' and verify success dialog
    var createClicked = await createClasses.click_createClass();
    await assertion.assertEqual(createClicked, true, "createClass did not reach the success dialog");

    var msg = await createClasses.getData_successMessage();
    await assertion.assertEqual(msg.shown, true, "Success dialog was not shown");
    await assertion.assert(
      typeof msg.title === "string" && msg.title.indexOf(expectedMsg) !== -1,
      "Success dialog title mismatch (got: " + msg.title + ")"
    );

    // 5. Click 'Back to dashboard'
    var backSts = await createClasses.click_backToDashboard();
    await assertion.assertEqual(
      backSts.pageStatus,
      true,
      "School Classes dashboard did not load after 'Back to dashboard'"
    );
  }
};

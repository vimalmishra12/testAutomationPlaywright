"use strict";
var adminShell = require("../../pages/ExperienceApp/adminShell.page.js");
var changeSchoolKey = require("../../pages/ExperienceApp/changeSchoolKey.page.js");
var sts;

/**
 * Admin App — organisation context and the Administrator/Teacher toggle (module SADB) —
 * 2 cases: TC_3 (switching organisations) and TC_5 (the toggle round trip).
 *
 * Separate from schoolAdminAddClass.test.js, which holds TST_SADB_TC_1 (the key-based school open that
 * almost every admin suite's Before chain reuses). A second SADB module on its own test file keeps
 * these cases resolvable — testrunner.js takes the first module whose testFile matches.
 *
 * Both cases are side-effect free: opening schools and switching views change nothing on the account.
 * TC_5 always finishes back in Administrator view, and BeforeEach restores it if a failed run did not.
 *
 * Evidence: admin-shared.md §A10, §A11 and §A12; manual register test/Manual/C1App/AdminApp-Generic/.
 */
module.exports = {
  /**
   * BeforeEach — start on My school accounts in Administrator view. If a previous case was left in
   * the teacher view, switch back first (housekeeping — Invariant 14 allows resilience here).
   */
  TST_SADB_TC_100: async function (testdata) {
    var url = await browser.getUrl();
    if (typeof url == "string" && url.indexOf("/dashboard/teacher") > -1) {
      await logger.logInto(await stackTrace.get(), "BeforeEach found the teacher view — switching back", "error");
      sts = await adminShell.click_roleToggle("admin");
      await assertion.assertEqual(sts, true, "BeforeEach could not return to Administrator view.");
    }
    await browser.url("/admin/admin/dashboard");
    sts = await adminShell.isInitialized();
    await assertion.assertEqual(sts, true, "My school accounts did not render with the admin shell.");
  },

  /**
   * TC_3 — each school opens under its own org slug, heading and key; nothing carries over.
   *
   * The slug is CAPTURED from the URL, never constructed (§A10). "Nothing carries over" is made
   * falsifiable with a class that exists only on school A — asserting class COUNTS would not be, as
   * both schools are shared and mutable (ADR-021 rule 1).
   */
  TST_SADB_TC_3: async function (testdata) {
    var a = testdata.schoolA;
    var b = testdata.schoolB;

    sts = await adminShell.open_schoolByKey(a.key);
    await assertion.assertEqual(sts, true, "Could not open school A (" + a.key + ").");
    var ctxA = await adminShell.getData_schoolContext();
    await assertion.assertEqual(ctxA.orgSlug, a.orgSlug, "School A opened under an unexpected org slug. URL: " + ctxA.url);
    await assertion.assertEqual(ctxA.heading, a.heading, "School A's heading is wrong.");
    await assertion.assertEqual(await changeSchoolKey.getData_schoolKey(), a.key, "School A shows the wrong school key.");

    sts = await adminShell.open_schoolByKey(b.key);
    await assertion.assertEqual(sts, true, "Could not open school B (" + b.key + ").");
    var ctxB = await adminShell.getData_schoolContext();
    await assertion.assertEqual(ctxB.orgSlug, b.orgSlug, "School B opened under an unexpected org slug. URL: " + ctxB.url);
    await assertion.assertEqual(ctxB.heading, b.heading, "School B's heading is wrong.");
    await assertion.assertEqual(await changeSchoolKey.getData_schoolKey(), b.key, "School B shows the wrong school key.");

    await assertion.assert(ctxA.orgSlug !== ctxB.orgSlug, "Both schools opened under the same org slug: " + ctxA.orgSlug);

    // Falsifiable no-carry-over check: school A's unique class must not appear on school B.
    var pageText = await adminShell.getData_pageText();
    await assertion.assert(
      typeof pageText == "string" && pageText.indexOf(a.uniqueClassName) === -1,
      "School A's class '" + a.uniqueClassName + "' is visible while school B is open — content carried over."
    );
  },

  /**
   * TC_5 — the toggle switches to the teacher dashboard and back again.
   *
   * State is read from the input's checked property and the switch's accessible name — never from a
   * class, because the switch's class DIFFERS between the two views (§A11). The document title is not
   * asserted: it varies with the load path (§A12). Started on the dashboard, the round trip returns there.
   */
  TST_SADB_TC_5: async function (testdata) {
    var start = await adminShell.getData_roleToggle();
    await assertion.assertEqual(start.checked, false, "The toggle does not start in Administrator view.");
    await assertion.assert(start.ariaLabel.indexOf(testdata.toggle.adminActive) > -1, "The toggle's name does not report Administrator active: " + start.ariaLabel);

    sts = await adminShell.click_roleToggle("teacher");
    await assertion.assertEqual(sts, true, "The toggle did not open the teacher dashboard.");
    var teacher = await adminShell.getData_roleToggle();
    await assertion.assert(teacher.url.indexOf(testdata.teacherDashboardFragment) > -1, "The teacher view is not at " + testdata.teacherDashboardFragment + ". URL: " + teacher.url);
    await assertion.assertEqual(teacher.checked, true, "The toggle input is not checked in the teacher view.");
    await assertion.assert(teacher.ariaLabel.indexOf(testdata.toggle.teacherActive) > -1, "The toggle's name does not report Teacher active: " + teacher.ariaLabel);
    await assertion.assertEqual(teacher.teacherSwitchCount, 1, "The teacher-view switch (.can-toggle-switch) is not rendered.");
    var greeting = await adminShell.getData_schoolContext();
    await assertion.assert(new RegExp(testdata.teacherGreetingPattern).test(greeting.heading || ""), "The teacher dashboard does not greet the user: " + greeting.heading);

    sts = await adminShell.click_roleToggle("admin");
    await assertion.assertEqual(sts, true, "The toggle did not return to the administrator view.");
    var back = await adminShell.getData_roleToggle();
    await assertion.assert(back.url.indexOf(testdata.adminDashboardFragment) > -1, "The round trip did not return to My school accounts. URL: " + back.url);
    await assertion.assertEqual(back.checked, false, "The toggle input is still checked after returning.");
    await assertion.assert(back.ariaLabel.indexOf(testdata.toggle.adminActive) > -1, "The toggle's name does not report Administrator active after returning: " + back.ariaLabel);
    await assertion.assertEqual(back.adminSwitchCount, 1, "The admin-view switch (.can-toggle__switch) is not rendered.");
  }
};

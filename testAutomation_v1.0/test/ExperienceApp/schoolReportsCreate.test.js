"use strict";
var schoolReports = require("../../pages/ExperienceApp/schoolReports.page.js");
var sts;

/**
 * Builds a calendar cell's `aria-label` for "today minus N days", e.g. "Sep 2, 2026".
 *
 * ⚠️ COMPUTED, NEVER HARDCODED. The picker opens on the month of the currently selected
 * `From` value, which defaults to today−6. A literal date such as "Sep 2, 2026" would stop
 * being visible in the grid a month later and the case would fail for a reason that has
 * nothing to do with the product.
 *
 * A small offset is used deliberately: the grid renders adjacent-month days too (the Sep 2026
 * view showed "Aug 31, 2026"), so a date within a few days of the default is reliably present
 * AND is in the past, so it is never disabled — the picker's ceiling is today
 * (admin-reports-tab.md §3).
 *
 * `en-US` short-month formatting matches the product's own `aria-label` format exactly.
 */
function ariaDateDaysAgo(days) {
  var d = new Date();
  d.setDate(d.getDate() - days);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/**
 * Admin App → Create report flow, the REPORT-CREATING half (module MRPT).
 *
 * 8 cases: TC_21, 22, 23, 24, 25, 26 (the six report types), TC_28 (custom date range),
 * TC_37 (Estimated CEFR level).
 *
 * =====================================================================================
 * ⚠️ THIS SUITE CREATES REAL DATA AND CANNOT CLEAN UP AFTER ITSELF.
 *
 * Every case clicks Submit, which creates a real report on the school. Verified live
 * 2026-09-10: **a successfully created report cannot be deleted from the UI.** The report
 * row's only control is Download; the `Remove from the reports list` button belongs to the
 * report-GENERATION-FAILED dialog, not to a successful row.
 *
 * So one full run leaves **8 reports** on the school, and they persist for **60 days**.
 * There is no After hook that removes them, and that absence is deliberate — do not add a
 * cleanup hook believing one was forgotten.
 *
 * This is why the suite runs on **VED-NEH-KVU (Cqa Test Ashish School 1)**, a school created
 * for automation, and NEVER on the shared FCN-CHZ-PDA that the read-only suite uses
 * (admin-shared.md §A7 / §B7 — data-creating suites live apart from side-effect-free ones).
 *
 * Accepted by the user on 2026-09-10 after the no-delete finding was raised.
 * =====================================================================================
 *
 * Each case is INDEPENDENT by design: it navigates to the class picker itself, selects the
 * class, configures and submits. Chaining them through "Create another report" would be
 * faster but would make one failure cascade into the rest.
 *
 * Expected results and evidence: admin-reports-tab.md §11 and the manual register
 * test/Manual/C1App/AdminApp-Reports/.
 */

/**
 * Runs the shared create-a-report flow and asserts the confirmation + the new list row.
 *
 * Every one of TC_21–TC_26 and TC_37 is this same flow with a different report type, so the
 * body lives here once. `TC_28` does NOT use it — it needs the date picker in the middle.
 */
async function createReportAndVerify(testdata, reportType) {
  // Baseline BEFORE creating, so the +1 assertion is real rather than assumed.
  sts = await schoolReports.click_reportsTab();
  await assertion.assertEqual(sts.pageStatus, true, "The Reports tab did not open.");

  var before = await schoolReports.getData_reportsList();
  await assertion.assert(
    before.headingCount !== null,
    "Could not read the Reports heading count before creating. Heading was: '" + before.heading + "'"
  );

  sts = await schoolReports.click_createReport();
  await assertion.assertEqual(sts.pageStatus, true, "The class-selection step did not open.");

  sts = await schoolReports.search_class(testdata.className);
  await assertion.assertEqual(sts.pageStatus, true, "The class search did not settle.");

  sts = await schoolReports.click_selectClassByText(testdata.className);
  await assertion.assertEqual(sts.pageStatus, true, "Selecting the class row failed.");

  sts = await schoolReports.click_continue();
  await assertion.assertEqual(sts.pageStatus, true, "The Create report dialog did not open.");

  sts = await schoolReports.select_reportType(reportType);
  await assertion.assertEqual(sts.pageStatus, true, "Choosing the report type '" + reportType + "' failed.");

  // ⚠️ The real side effect happens here.
  sts = await schoolReports.click_submitReport();
  await assertion.assertEqual(sts.pageStatus, true, "Submitting the report failed.");

  var dialog = await schoolReports.getData_successDialog();
  await assertion.assertEqual(dialog.displayed, true, "The success dialog is not displayed.");
  await assertion.assert(
    dialog.text.indexOf(testdata.successHeading) !== -1,
    "The success dialog does not say '" + testdata.successHeading + "'. Got: " + dialog.text
  );
  // The report type is interpolated into the copy — this is what proves the RIGHT report
  // type was submitted, not merely that something was.
  await assertion.assert(
    dialog.text.indexOf(reportType) !== -1,
    "The success dialog does not name the report type '" + reportType + "'. Got: " + dialog.text
  );
  await assertion.assertEqual(dialog.createAnotherDisplayed, true, "'Create another report' is not offered.");
  await assertion.assertEqual(dialog.backToReportsDisplayed, true, "'Back to Reports' is not offered.");

  sts = await schoolReports.click_backToReports();
  await assertion.assertEqual(sts.pageStatus, true, "'Back to Reports' did not return to the Reports list.");

  var after = await schoolReports.getData_reportsList();
  await assertion.assertEqual(
    after.headingCount,
    before.headingCount + 1,
    "The Reports count did not increase by one (before " + before.headingCount + ", after " + after.headingCount + ")."
  );
  await assertion.assert(
    after.topRow !== null && after.topRow.indexOf(reportType) !== -1,
    "The newest report row does not name '" + reportType + "'. Top row: " + (after.topRow || "(no rows)")
  );
  await assertion.assert(
    after.topRow.indexOf(testdata.newBadge) !== -1,
    "The newest report row does not carry the '" + testdata.newBadge + "' badge. Top row: " + after.topRow
  );

  return after;
}

module.exports = {
  /**
   * Before-chain login for a SINGLE-school admin, replacing the usual
   * `TST_NEMO24306_TC_LOGIN` + `TST_SADB_TC_1` pair.
   *
   * ⚠️ `cqatestashish_admin` administers exactly ONE school, so the app skips
   * "My school accounts" entirely — verified live 2026-09-10: an explicit visit to
   * `/admin/admin/dashboard` redirects to `/admin/admin/org_<slug>/class` with **zero** school
   * cards. The standard login TC waits for `aDashboard-1` and therefore times out after 30 s
   * with a message blaming the dashboard rather than the account shape. That cost this suite
   * its first run.
   *
   * ⚠️ Because there is no picker, the school is never explicitly chosen — so the key is
   * ASSERTED instead. `admin-shared.md` §0 says a school is always identified by KEY, never by
   * name or position; reading it back preserves that guarantee. Without this assertion the
   * suite could silently create reports on the wrong school.
   */
  TST_MRPT_TC_201: async function (testdata) {
    var login = require("../../pages/ExperienceApp/login.page.js");
    await login.acceptCookies();
    sts = await login.click_login_btn_singleSchoolAdmin();
    await assertion.assertEqual(
      sts,
      true,
      "Login did not reach a school context. Either the credentials are wrong, or this account " +
        "is no longer a single-school admin (check C1.login.user.reportsSchoolAdmin)."
    );

    var ctx = await schoolReports.getData_schoolContext();
    await assertion.assertEqual(
      ctx.schoolKey,
      testdata.schoolKey,
      "Logged into the WRONG school: expected key " + testdata.schoolKey + ", got " +
        ctx.schoolKey + " (" + ctx.url + "). This suite creates real reports - it must never " +
        "run against an unintended school."
    );
  },

  /**
   * BeforeEach reset — return to the Reports tab so each case starts from a known place.
   *
   * ⚠️ This does NOT remove anything. Nothing here can be undone (see the file header). It
   * only repositions the browser.
   */
  TST_MRPT_TC_200: async function (testdata) {
    sts = await schoolReports.click_reportsTab();
    await assertion.assertEqual(
      sts.pageStatus,
      true,
      "Reset failed: could not return to the Reports tab."
    );
  },

  /** TC_21 — Class summary report is created and listed. */
  TST_MRPT_TC_21: async function (testdata) {
    var after = await createReportAndVerify(testdata, testdata.typeClassSummary);
    // Only the first case asserts the full row shape; the rest would be duplicating it.
    await assertion.assert(
      after.topRow.indexOf(testdata.itemsAllItems) !== -1,
      "The new row's Items column does not read '" + testdata.itemsAllItems +
        "' with the grade option unticked. Top row: " + after.topRow
    );
    await assertion.assert(
      after.topRow.indexOf(testdata.fromBeginningRangePrefix) !== -1,
      "The new row's Date range does not use the 'from the beginning' form ('" +
        testdata.fromBeginningRangePrefix + "'). Top row: " + after.topRow
    );
    // "…and listed FOR DOWNLOAD" — the second half of this case's title, and the only
    // genuinely async step. Generation is not instant, so this polls rather than reads once.
    sts = await schoolReports.waitFor_newestReportDownloadable();
    await assertion.assertEqual(
      sts.pageStatus,
      true,
      "The created report never became downloadable."
    );
  },

  /** TC_22 — Class detailed data report is created and listed. */
  TST_MRPT_TC_22: async function (testdata) {
    await createReportAndVerify(testdata, testdata.typeClassDetailed);
  },

  /** TC_23 — Class daily data report is created and listed. */
  TST_MRPT_TC_23: async function (testdata) {
    await createReportAndVerify(testdata, testdata.typeClassDaily);
  },

  /** TC_24 — Aggregated data report is created and listed. */
  TST_MRPT_TC_24: async function (testdata) {
    await createReportAndVerify(testdata, testdata.typeAggregated);
  },

  /** TC_25 — Assignments summary report is created and listed. */
  TST_MRPT_TC_25: async function (testdata) {
    await createReportAndVerify(testdata, testdata.typeAssignmentsSummary);
  },

  /** TC_26 — Assignments detailed data report is created and listed. */
  TST_MRPT_TC_26: async function (testdata) {
    await createReportAndVerify(testdata, testdata.typeAssignmentsDetailed);
  },

  /**
   * TC_37 — Estimated CEFR level report is created and listed.
   *
   * ⚠️ This type supports NEITHER a custom date range NOR custom grade settings — the only
   * one of the seven that supports neither (admin-reports-tab.md §2). It is covered here as a
   * first-class creation case because the source scenario workbook omitted it, which the
   * requester confirmed was a genuine gap rather than a deliberate exclusion.
   */
  TST_MRPT_TC_37: async function (testdata) {
    await createReportAndVerify(testdata, testdata.typeCefr);
  },

  /**
   * TC_28 — a report is created over a chosen custom window.
   *
   * ⚠️ Does NOT reuse the shared helper: the date picker has to be driven between choosing
   * the type and submitting.
   *
   * ⚠️ The dates come from the test data as calendar `aria-label` strings, and they must be
   * REAL dates that exist in the picker and are not disabled (no future dates — the ceiling
   * is today). See the data file's note on keeping them current.
   */
  TST_MRPT_TC_28: async function (testdata) {
    sts = await schoolReports.click_reportsTab();
    await assertion.assertEqual(sts.pageStatus, true, "The Reports tab did not open.");

    var before = await schoolReports.getData_reportsList();

    sts = await schoolReports.click_createReport();
    await assertion.assertEqual(sts.pageStatus, true, "The class-selection step did not open.");

    sts = await schoolReports.search_class(testdata.className);
    await assertion.assertEqual(sts.pageStatus, true, "The class search did not settle.");

    sts = await schoolReports.click_selectClassByText(testdata.className);
    await assertion.assertEqual(sts.pageStatus, true, "Selecting the class row failed.");

    sts = await schoolReports.click_continue();
    await assertion.assertEqual(sts.pageStatus, true, "The Create report dialog did not open.");

    sts = await schoolReports.select_reportType(testdata.typeClassSummary);
    await assertion.assertEqual(sts.pageStatus, true, "Choosing the report type failed.");

    sts = await schoolReports.select_customDateRange();
    await assertion.assertEqual(sts.pageStatus, true, "The custom date fields did not appear.");

    // Capture the defaults so the assertion below proves the window actually CHANGED.
    var defaults = await schoolReports.getData_dateRange();

    var targetFrom = ariaDateDaysAgo(testdata.customFromDaysAgo);
    sts = await schoolReports.set_dateRangeBound("from", targetFrom);
    await assertion.assertEqual(sts.pageStatus, true, "Setting the 'From' date to " + targetFrom + " failed.");

    var chosen = await schoolReports.getData_dateRange();
    await assertion.assert(
      chosen.fromValue !== defaults.fromValue,
      "The 'From' date did not change from its default ('" + defaults.fromValue +
        "') - the picker's Set click did not commit."
    );
    await assertion.assert(
      chosen.fromValue.indexOf(targetFrom) !== -1,
      "The 'From' field reads '" + chosen.fromValue + "', expected it to contain '" + targetFrom + "'."
    );

    sts = await schoolReports.click_submitReport();
    await assertion.assertEqual(sts.pageStatus, true, "Submitting the custom-range report failed.");

    var dialog = await schoolReports.getData_successDialog();
    await assertion.assertEqual(dialog.displayed, true, "The success dialog is not displayed.");

    sts = await schoolReports.click_backToReports();
    await assertion.assertEqual(sts.pageStatus, true, "'Back to Reports' did not return to the Reports list.");

    var after = await schoolReports.getData_reportsList();
    await assertion.assertEqual(
      after.headingCount,
      before.headingCount + 1,
      "The Reports count did not increase by one (before " + before.headingCount + ", after " + after.headingCount + ")."
    );
    // The point of this case: the row must NOT show the "from the beginning" form.
    await assertion.assert(
      after.topRow.indexOf(testdata.fromBeginningRangePrefix) === -1,
      "The new row still shows the 'from the beginning' date range ('" +
        testdata.fromBeginningRangePrefix + "') despite a custom window being chosen. Top row: " + after.topRow
    );
  },
};

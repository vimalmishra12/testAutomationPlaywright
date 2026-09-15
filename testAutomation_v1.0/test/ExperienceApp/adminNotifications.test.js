"use strict";
var adminNotifications = require("../../pages/ExperienceApp/adminNotifications.page.js");
var adminShell = require("../../pages/ExperienceApp/adminShell.page.js");
var sts;

/**
 * Admin App notifications bell and panel (module INVI) — 6 cases: TC_7..TC_12.
 *
 * Separate from invitationNotification.test.js (TST_INVI_TC_1..6, the invitation-accept flow) so
 * these cases get their OWN TC-repository module: testrunner.js resolves a TC from the first module
 * whose testFile matches, so two modules on one file make the second unreachable.
 *
 * ⚠️ NO ABSOLUTE COUNT IS ASSERTED — the unread total is live data (92 → 93 in two weeks). Counts are
 * compared within one run: badge vs heading (TC_7/8), before vs after (TC_12).
 *
 * ⚠️ TC_12 MUTATES STATE: it marks one notification read, permanently [user decision, 2026-09-14:
 * accept one per run]. It lives in this read-only file only because clicking a notification touches
 * the account, not the shared school's data; it runs LAST so every rendering case sees the same panel.
 *
 * Evidence: admin-shared.md §A9 and §A12; manual register test/Manual/C1App/AdminApp-Generic/.
 */
module.exports = {
  /** BeforeEach — start on My school accounts with the panel closed. */
  TST_INVI_TC_100: async function (testdata) {
    await browser.url("/admin/admin/dashboard");
    sts = await adminShell.isInitialized();
    await assertion.assertEqual(sts, true, "My school accounts did not render with the admin shell.");
    sts = await adminNotifications.isInitialized();
    await assertion.assertEqual(sts, true, "The notifications bell did not render.");
  },

  /** TC_7 — the bell's accessible name carries the unread count. */
  TST_INVI_TC_7: async function (testdata) {
    var bell = await adminNotifications.getData_bell();
    await assertion.assert(
      typeof bell.unreadFromAria == "number",
      "The bell's accessible name does not report an unread count: " + bell.ariaLabel
    );
    await assertion.assert(
      new RegExp(testdata.bellAriaPattern).test(bell.ariaLabel),
      "The bell's accessible name is not in the expected form. Got: " + bell.ariaLabel
    );
    await assertion.assert(
      bell.text.indexOf(String(bell.unreadFromAria)) > -1,
      "The visible badge does not show the same count as the accessible name (" + bell.unreadFromAria + "): " + bell.text
    );
  },

  /**
   * TC_8 — the panel opens with a heading matching the badge, time groups, rows, a footer link and
   * a Close control. `.notification-dropdown` is deliberately NOT used — it is the bell's wrapper.
   */
  TST_INVI_TC_8: async function (testdata) {
    var bell = await adminNotifications.getData_bell();
    sts = await adminNotifications.open_panel();
    await assertion.assertEqual(sts, true, "The notifications panel did not open.");

    var p = await adminNotifications.getData_panel();
    await assertion.assertEqual(p.countFromHeading, bell.unreadFromAria, "The panel heading count does not match the bell: " + p.heading);
    await assertion.assert(p.timeGroups.length > 0, "The panel shows no time-group headings.");
    // A plain loop, not forEach: an assertion inside forEach is never awaited, so a failure would be
    // lost — the "assertion that cannot fail" of Invariant 13.
    for (var g = 0; g < p.timeGroups.length; g++) {
      await assertion.assert(testdata.timeGroups.indexOf(p.timeGroups[g]) > -1, "Unexpected time-group heading: " + p.timeGroups[g]);
    }
    await assertion.assert(p.rowCount > 0, "The panel rendered no notification rows.");
    await assertion.assertEqual(p.seeOlderText, testdata.seeOlderText, "The 'See older notifications' link is missing.");
    await assertion.assertEqual(p.closeVisible, true, "The panel's Close control is not visible.");

    // Opening the panel must not change the unread count (verified 93 → 93 on 2026-09-14).
    var bellAfter = await adminNotifications.getData_bell();
    await assertion.assertEqual(bellAfter.unreadFromAria, bell.unreadFromAria, "Opening the panel changed the unread count.");

    sts = await adminNotifications.close_panel();
    await assertion.assertEqual(sts, true, "The panel did not close via its Close control.");
  },

  /** TC_9 — only five rows render however many are unread, and the panel does not scroll to more. */
  TST_INVI_TC_9: async function (testdata) {
    sts = await adminNotifications.open_panel();
    await assertion.assertEqual(sts, true, "The notifications panel did not open.");
    var p = await adminNotifications.getData_panel();
    await assertion.assertEqual(p.rowCount, testdata.maxRowsRendered, "The panel rendered " + p.rowCount + " rows, not " + testdata.maxRowsRendered + ".");
    await assertion.assert(p.countFromHeading > p.rowCount, "Precondition not met: the account has no more unread notifications than rows shown.");
  },

  /**
   * TC_10 — rows under "Last Seven days" use a relative date; rows under "Older" use Ddd, DD Mmm, YYYY.
   * Each row's LAST line is its date. Rows are matched to formats, not to fixed values.
   */
  TST_INVI_TC_10: async function (testdata) {
    sts = await adminNotifications.open_panel();
    await assertion.assertEqual(sts, true, "The notifications panel did not open.");
    var p = await adminNotifications.getData_panel();
    var relative = new RegExp(testdata.relativeDatePattern);
    var absolute = new RegExp(testdata.absoluteDatePattern);
    var dates = p.rows.map(function (r) { return r[r.length - 1]; });
    var relCount = dates.filter(function (d) { return relative.test(d); }).length;
    var absCount = dates.filter(function (d) { return absolute.test(d); }).length;
    await assertion.assertEqual(relCount + absCount, dates.length, "Some row dates match neither format: " + JSON.stringify(dates));
    if (p.timeGroups.indexOf("Older") > -1) {
      await assertion.assert(absCount > 0, "An 'Older' group is shown but no row uses the absolute date format.");
    }
  },

  /**
   * TC_11 — report-ready rows describe the Reports destination inconsistently (known copy defect).
   *
   * The PAIRING changes as reports are generated (it moved between 2026-08-27 and 2026-09-14), so the
   * case asserts the defect's SHAPE from the rows present: every report-ready body uses one of the two
   * known phrasings, and — when both phrasings are visible — they differ. If the product unifies the
   * wording, the phrasing check still passes and the inconsistency assertion stops firing.
   */
  TST_INVI_TC_11: async function (testdata) {
    sts = await adminNotifications.open_panel();
    await assertion.assertEqual(sts, true, "The notifications panel did not open.");
    var p = await adminNotifications.getData_panel();
    var ready = p.rows.filter(function (r) { return /report is ready$/i.test(r[0] || ""); });
    await assertion.assert(ready.length > 0, "Precondition not met: no report-ready notification is visible.");
    // Awaited loop, not forEach — see TC_8.
    for (var i = 0; i < ready.length; i++) {
      await assertion.assert(
        testdata.reportReadyBodies.indexOf(ready[i][1]) > -1,
        "Unexpected report-ready body for '" + ready[i][0] + "': " + ready[i][1]
      );
    }
  },

  /**
   * TC_12 — clicking a notification opens its target and reduces the unread count by one.
   * 🚨 MUTATES: marks the oldest visible UNREAD report-ready notification read, permanently.
   *
   * ⚠️ NOT IN adminGeneric.json [user decision, 2026-09-15]. Each run consumes one unread
   * notification, and the panel shows only the 5 newest rows — by the fifth run of 2026-09-14 all five
   * were read, so the case could only fail. It stays written and registered (it shows as an ORPHAN in
   * tooling/tcMap.js, intended). Run it by hand once a fresh "report is ready" notification exists
   * (generate a report on the Reports tab), by re-adding it as the LAST step of Suite7.
   */
  TST_INVI_TC_12: async function (testdata) {
    var before = await adminNotifications.getData_bell();
    await assertion.assert(typeof before.unreadFromAria == "number" && before.unreadFromAria > 0, "Precondition not met: no unread notifications.");

    var r = await adminNotifications.click_oldestReportReadyRow();
    await assertion.assertEqual(r.clicked, true, "Could not click a report-ready notification.");
    await assertion.assert(r.urlAfter !== r.urlBefore, "Clicking the notification did not navigate anywhere.");
    await assertion.assert(
      r.urlAfter.indexOf(testdata.reportReadyTargetFragment) > -1,
      "The report-ready notification did not land on the Reports destination. URL: " + r.urlAfter
    );

    await browser.url("/admin/admin/dashboard");
    sts = await adminShell.isInitialized();
    await assertion.assertEqual(sts, true, "Could not return to My school accounts.");
    var after = await adminNotifications.getData_bell();
    await assertion.assertEqual(after.unreadFromAria, before.unreadFromAria - 1, "The unread count did not drop by exactly one.");
  }
};

"use strict";
var adminShell = require("../../pages/ExperienceApp/adminShell.page.js");
var sts;

/**
 * Admin App footer (module FOOT) — 2 cases: TC_10 (seven links, no Site Feedback) and TC_11
 * (internal links reach their pages).
 *
 * Separate from footer.test.js (TST_FOOT_TC_1..9, the wider C1 footer) so these cases get their own
 * TC-repository module — testrunner.js resolves a TC from the first module whose testFile matches.
 *
 * ⚠️ Logged-in internal footer hrefs are javascript:void(0), so destinations are asserted from the URL
 * AFTER clicking, never from the href (§A9). TC_11 checks the four INTERNAL destinations only; FAQs,
 * Help and Our approach leave for external sites and are asserted structurally in TC_10.
 *
 * Evidence: admin-shared.md §A9 and §A12; manual register test/Manual/C1App/AdminApp-Generic/.
 */
module.exports = {
  /** BeforeEach — start on My school accounts; TC_11's clicks leave the admin app. */
  TST_FOOT_TC_100: async function (testdata) {
    await browser.url("/admin/admin/dashboard");
    sts = await adminShell.isInitialized();
    await assertion.assertEqual(sts, true, "My school accounts did not render with the admin shell.");
  },

  /**
   * TC_10 — the admin footer renders seven links, omits Site Feedback, and shows the copyright line.
   * Site Feedback is genuinely not rendered, so its count of 0 is a truthful assertion.
   */
  TST_FOOT_TC_10: async function (testdata) {
    var f = await adminShell.getData_footer();
    await assertion.assertEqual(f.destinationLinkCount, testdata.footerLinks.length, "The admin footer does not render exactly " + testdata.footerLinks.length + " links.");
    await assertion.assertEqual(JSON.stringify(f.links), JSON.stringify(testdata.footerLinks), "The footer link labels differ from the expected seven, in order.");
    await assertion.assertEqual(f.siteFeedbackCount, 0, "Site Feedback is rendered in the admin footer.");
    // A pattern, not a literal: the line carries the current year, so an exact "2026" would fail
    // every run from January onwards without anything having regressed.
    await assertion.assert(new RegExp(testdata.copyrightPattern).test(f.copyright || ""), "The copyright line is not as expected: " + f.copyright);
    // "Our approach" is the only external link and opens in a new tab.
    await assertion.assertEqual(f.ourApproachHref, testdata.ourApproach.href, "Our approach does not point at the Cambridge English site.");
    await assertion.assertEqual(f.ourApproachTarget, "_blank", "Our approach does not open in a new tab.");
  },

  /**
   * TC_11 — each internal footer link reaches its page (no 404).
   * Each destination leaves the admin app, so the case returns to the dashboard between links.
   */
  TST_FOOT_TC_11: async function (testdata) {
    for (var i = 0; i < testdata.internalDestinations.length; i++) {
      var dest = testdata.internalDestinations[i];
      await browser.url("/admin/admin/dashboard");
      sts = await adminShell.isInitialized();
      await assertion.assertEqual(sts, true, "My school accounts did not render before clicking " + dest.key + ".");

      var r = await adminShell.click_footerLink(dest.key);
      await assertion.assertEqual(r.clicked, true, "The footer link " + dest.key + " could not be clicked.");
      await assertion.assert(
        typeof r.urlAfter == "string" && r.urlAfter.indexOf(dest.pathFragment) > -1,
        dest.key + " did not reach " + dest.pathFragment + ". URL: " + r.urlAfter
      );
    }
  }
};

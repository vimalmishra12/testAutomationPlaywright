"use strict";
var changeSchoolKey = require("../../pages/ExperienceApp/changeSchoolKey.page.js");
var adminShell = require("../../pages/ExperienceApp/adminShell.page.js");
var sts;

/**
 * Admin App → School settings menu and the Change school key warning (module SKEY).
 *
 * 3 cases: TC_1 (menu items), TC_2 (warning copy), TC_4 (Cancel leaves the key unchanged).
 * TC_3 — actually changing the key — is Blocked at design time and is NOT here.
 *
 * 🚨🚨 NOTHING IN THIS FILE CONFIRMS A KEY CHANGE. 🚨🚨
 * The page object exposes no way to click Continue, deliberately. Keep it that way.
 *
 * 🚨 SCHOOL: every case here runs on KNF-XRD-QVE ("3 July Test School 2"), never FCN-CHZ-PDA
 * [user decision, 2026-09-14]. FCN-CHZ-PDA's key is hardcoded across every admin suite's data, so a
 * single misclick on Continue there would break all of them with no way back. The school key comes
 * from the data file, and TST_SKEY_TC_100 refuses to proceed if the opened school's key does not match
 * it — so a data-file slip cannot silently point this suite at the primary school.
 *
 * Evidence: admin-shared.md §A10 and §A12; manual register test/Manual/C1App/AdminApp-Generic/.
 */
module.exports = {
  /**
   * BeforeEach — re-open the target school so each case starts on its Classes tab with no dialog
   * or menu left open by the previous case, and prove it is the RIGHT school before anything else.
   *
   * Re-opening via the school card (not a reload) also re-establishes the school context, which a
   * deep link cannot do (admin-shared.md §A1).
   */
  TST_SKEY_TC_100: async function (testdata) {
    sts = await adminShell.open_schoolByKey(testdata.schoolKey);
    await assertion.assertEqual(sts, true, "Could not open school " + testdata.schoolKey + " from My school accounts.");

    sts = await changeSchoolKey.isInitialized();
    await assertion.assertEqual(sts, true, "The Classes tab did not become ready for School settings.");

    // 🚨 Safety interlock: refuse to run SKEY cases against any school but the configured one.
    var shownKey = await changeSchoolKey.getData_schoolKey();
    await assertion.assertEqual(
      shownKey,
      testdata.schoolKey,
      "SAFETY STOP: the opened school shows key '" + shownKey + "', not the configured '" + testdata.schoolKey +
      "'. The SKEY suite will not touch a school it was not configured for."
    );
    await assertion.assert(
      shownKey !== testdata.forbiddenSchoolKey,
      "SAFETY STOP: the SKEY suite must never run on " + testdata.forbiddenSchoolKey + "."
    );
  },

  /**
   * TC_1 — School settings exposes exactly three items, Change school key first.
   *
   * This corrects admin-shared.md §A1, which once listed only the two grading entries. The items are
   * pre-rendered and hidden while the menu is closed, so the case proves the menu OPENED (first item
   * visible) before reading, rather than reading hidden text (§B2).
   */
  TST_SKEY_TC_1: async function (testdata) {
    var menu = await changeSchoolKey.getData_settingsMenu();
    await assertion.assertEqual(menu.opened, true, "The School settings menu did not open.");
    await assertion.assertEqual(menu.changeSchoolKeyVisible, true, "'Change school key' is not visible in the open menu.");
    await assertion.assertEqual(
      JSON.stringify(menu.items),
      JSON.stringify(testdata.settingsMenuItems),
      "The School settings menu items differ from the expected three, in order."
    );
  },

  /**
   * TC_2 — choosing Change school key shows the irreversible-action warning, copy verbatim.
   *
   * Opening the warning is safe: the key changes only on Continue. Verified live on KNF-XRD-QVE,
   * 2026-09-14. The icon is asserted by count because it is genuinely absent unless rendered inside
   * this dialog's heading (the selector is scoped to #changeSchoolKey).
   */
  TST_SKEY_TC_2: async function (testdata) {
    sts = await changeSchoolKey.click_changeSchoolKey();
    await assertion.assertEqual(sts, true, "The Change school key warning did not open.");

    var d = await changeSchoolKey.getData_warningDialog();
    await assertion.assertEqual(d.visible, true, "The warning dialog is not visible.");
    await assertion.assertEqual(d.warningHeading, testdata.warning.heading, "The warning heading is not verbatim.");
    await assertion.assertEqual(d.warningIconCount, 1, "The warning-triangle icon is not shown in the dialog heading.");
    await assertion.assertEqual(d.title, testdata.warning.title, "The warning title is not verbatim.");
    await assertion.assertEqual(d.body, testdata.warning.body, "The warning body is not verbatim.");
    await assertion.assertEqual(d.continueText, testdata.warning.continueText, "The Continue control is missing or relabelled.");
    await assertion.assertEqual(d.cancelText, testdata.warning.cancelText, "The Cancel control is missing or relabelled.");
  },

  /**
   * TC_4 — Cancel closes the warning and the school key is unchanged.
   *
   * "Closed" is asserted with all three signals (content hidden, no backdrop, no body.modal-open) —
   * the `show` class alone reports closed while the backdrop still covers the page (§A12).
   *
   * ⚠️ The CLOSE half is still [ASSUMED] for a real click: during grounding a SYNTHETIC click on Cancel
   * did not close the dialog (Escape did). This case is where a real click proves it. If it fails on
   * the close assertion while the key is unchanged, that is the finding to report — do NOT add an
   * Escape fallback here (Invariant 14).
   */
  TST_SKEY_TC_4: async function (testdata) {
    var keyBefore = await changeSchoolKey.getData_schoolKey();
    await assertion.assertEqual(keyBefore, testdata.schoolKey, "The school key before the warning is not the configured key.");

    sts = await changeSchoolKey.click_changeSchoolKey();
    await assertion.assertEqual(sts, true, "The Change school key warning did not open.");

    sts = await changeSchoolKey.click_cancelWarning();
    await assertion.assertEqual(sts, true, "The warning dialog did not close after Cancel.");

    var state = await changeSchoolKey.getData_dialogState();
    await assertion.assertEqual(state.closed, true, "The dialog is not fully closed: " + JSON.stringify(state));

    var keyAfter = await changeSchoolKey.getData_schoolKey();
    await assertion.assertEqual(
      keyAfter,
      keyBefore,
      "🚨 The school key CHANGED after Cancel: '" + keyBefore + "' → '" + keyAfter + "'. Stop and report immediately."
    );
  }
};

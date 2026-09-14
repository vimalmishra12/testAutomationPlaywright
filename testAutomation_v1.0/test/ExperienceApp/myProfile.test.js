"use strict";
var myProfile = require("../../pages/ExperienceApp/myProfile.page.js");
var adminShell = require("../../pages/ExperienceApp/adminShell.page.js");
var sts;

/**
 * My profile / Manage profile (module MYPR) — 4 cases: TC_1, TC_2, TC_3, TC_4.
 *
 * ⚠️ `testt1@mailsac.com` is the login for EVERY admin suite, and this page saves to that account
 * everywhere. TC_1–TC_3 are read-only. TC_4 edits First name and leaves WITHOUT saving; its safety
 * net [user decision, 2026-09-14] restores the original name and fails loudly if leaving turned out to
 * save. Password and validation paths (MYPR_TC_5..8) are Phase-1 exclusions and are not here.
 *
 * Evidence: admin-shared.md §A9 and §A12; manual register test/Manual/C1App/AdminApp-Generic/.
 */
module.exports = {
  /**
   * BeforeEach — start every case on My school accounts, so TC_1 exercises the real menu path and the
   * others reach Manage profile the same way a user does.
   */
  TST_MYPR_TC_100: async function (testdata) {
    await browser.url("/admin/admin/dashboard");
    sts = await adminShell.isInitialized();
    await assertion.assertEqual(sts, true, "My school accounts did not render with the admin shell.");
  },

  /**
   * TC_1 — the header menu offers My profile, which opens Manage profile with two tabs.
   *
   * Three names for one page: the case asserts the HEADING ("Manage profile"), not the menu label or
   * the document title (§A9).
   */
  TST_MYPR_TC_1: async function (testdata) {
    var menu = await adminShell.getData_profileMenu();
    await assertion.assertEqual(menu.opened, true, "The profile menu did not open.");
    await assertion.assertEqual(menu.myProfile, testdata.menu.myProfile, "The profile menu has no 'My profile' item.");
    await assertion.assertEqual(menu.logout, testdata.menu.logout, "The profile menu has no 'Log out' item.");

    sts = await adminShell.click_myProfile();
    await assertion.assertEqual(sts, true, "Manage profile did not open from the profile menu.");

    var page = await myProfile.getData_page();
    await assertion.assert(page.url.indexOf(testdata.profileUrlFragment) > -1, "Manage profile is not at " + testdata.profileUrlFragment + ". URL: " + page.url);
    await assertion.assertEqual(page.heading, testdata.heading, "The page heading is not '" + testdata.heading + "'.");
    await assertion.assertEqual(page.personalInfoTabText, testdata.tabs.personalInfo, "The Personal info tab is missing or relabelled.");
    await assertion.assertEqual(page.passwordTabText, testdata.tabs.password, "The Password tab is missing or relabelled.");
    // The active tab is marked on its parent li (class 'selected') — §A12 corrects §A9 here.
    await assertion.assertEqual(page.selectedTabText, testdata.tabs.personalInfo, "Personal info is not the active tab on arrival.");
    await assertion.assertEqual(page.backPresent, true, "The Back control is not shown.");
  },

  /**
   * TC_2 — Personal info shows four pre-filled fields plus Update and Cancel.
   *
   * Field VALUES are account data and are not asserted (§A5); only that each is shown and pre-filled.
   * Update is an <input type=submit>, so its label is read from `value` (§A12).
   */
  TST_MYPR_TC_2: async function (testdata) {
    sts = await adminShell.click_myProfile();
    await assertion.assertEqual(sts, true, "Manage profile did not open.");

    var p = await myProfile.getData_personalInfo();
    await assertion.assertEqual(JSON.stringify(p.fieldsShown), JSON.stringify([true, true, true, true]), "Not all four Personal info fields are shown.");
    await assertion.assertEqual(JSON.stringify(p.fieldsPrefilled), JSON.stringify([true, true, true, true]), "Not all four Personal info fields are pre-filled from the account.");
    await assertion.assertEqual(p.updateValue, testdata.buttons.update, "The Update control is missing or relabelled.");
    await assertion.assertEqual(p.cancelText, testdata.buttons.cancel, "The Cancel control is missing or relabelled.");
    // The tabs swap DOM: the Password inputs must not exist while Personal info is shown.
    await assertion.assertEqual(p.passwordFieldsPresent, 0, "Password inputs are present on the Personal info tab.");
  },

  /**
   * TC_3 — the Password tab shows three masked fields plus Update and Cancel.
   */
  TST_MYPR_TC_3: async function (testdata) {
    sts = await adminShell.click_myProfile();
    await assertion.assertEqual(sts, true, "Manage profile did not open.");

    sts = await myProfile.click_passwordTab();
    await assertion.assertEqual(sts, true, "The Password tab did not show its fields.");

    var page = await myProfile.getData_page();
    await assertion.assertEqual(page.selectedTabText, testdata.tabs.password, "Password is not marked as the active tab.");
    await assertion.assert(page.url.indexOf(testdata.profileUrlFragment) > -1, "Changing tabs changed the URL: " + page.url);

    var p = await myProfile.getData_password();
    await assertion.assertEqual(JSON.stringify(p.fieldsShown), JSON.stringify([true, true, true]), "Not all three password fields are shown.");
    await assertion.assertEqual(JSON.stringify(p.fieldTypes), JSON.stringify(["password", "password", "password"]), "Not every password field masks its content.");
    await assertion.assertEqual(p.updateValue, testdata.buttons.update, "The Password tab's Update control is missing or relabelled.");
    await assertion.assertEqual(p.cancelText, testdata.buttons.cancel, "The Password tab's Cancel control is missing or relabelled.");
    await assertion.assertEqual(p.personalFieldsPresent, 0, "Personal info inputs are present on the Password tab.");
  },

  /**
   * TC_4 — Back leaves without saving; First name keeps its original value.
   *
   * SAFETY NET [user decision, 2026-09-14]: if the name comes back CHANGED, restore the original first
   * and only then fail — so a failing run never leaves the shared login account renamed. The marker
   * value is unmistakable in case anything goes wrong mid-run.
   */
  TST_MYPR_TC_4: async function (testdata) {
    sts = await adminShell.click_myProfile();
    await assertion.assertEqual(sts, true, "Manage profile did not open.");

    var original = (await myProfile.getData_personalInfo()).firstName;
    await assertion.assert(typeof original == "string" && original.length > 0, "Could not read the original First name.");
    await assertion.assert(original !== testdata.unsavedFirstName, "The account's First name already equals the marker value — a previous run may have saved it.");

    sts = await myProfile.set_firstName(testdata.unsavedFirstName);
    await assertion.assertEqual(sts, true, "Could not type the marker value into First name.");

    sts = await myProfile.click_back();
    await assertion.assertEqual(sts, true, "Back did not leave Manage profile.");

    sts = await adminShell.click_myProfile();
    await assertion.assertEqual(sts, true, "Manage profile did not re-open.");
    var after = (await myProfile.getData_personalInfo()).firstName;

    if (after !== original) {
      var restored = await myProfile.restore_firstName(original);
      await assertion.assertEqual(
        after,
        original,
        "🚨 Leaving with Back SAVED the First name ('" + original + "' → '" + after + "'). Safety net restore result: " + restored
      );
    }
    await assertion.assertEqual(after, original, "First name changed after leaving without saving.");
  }
};

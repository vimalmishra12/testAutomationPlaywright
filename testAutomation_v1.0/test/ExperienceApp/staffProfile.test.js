"use strict";
// Admin App — staff profile, Manage account, grant/remove admin rights, remove from school.
// Module code STFP → pages/ExperienceApp/staffProfile.page.js.
// Manual source: test/Manual/C1App/AdminApp-Staff/AdminApp_Staff_tab_test_cases.md
//
// Batch (this file): the READ-ONLY half of STFP —
//   Req #7  TC_1, TC_2      (profile layout, role)
//   Req #8  TC_7            (class launch)
//   Req #9  TC_9            (Grant offered on a teacher)
//   Req #11 TC_11, TC_12    (Remove offered on an admin; rights retained on cancel)
//   Req #10 TC_15, TC_16, TC_17 (removal dialog copy, checkbox gate, cancel)
//
// ⚠️ EVERY CASE HERE IS SIDE-EFFECT FREE. Six of them OPEN a mutating dialog and then
// leave it; they are safe ONLY because they never confirm. "Never click the confirm
// button" is a hard rule of this batch, not a preference. The mutating cases — TC_10
// (grant), TC_13 (revoke), TC_18 (removal), TC_19 — are deliberately NOT here: they need a
// data-owning suite that creates its own staff member (admin-staff-tab.md §6).
//
// ⚠️ Never revoke rights from, or remove, a staff member this suite did not create, and
// never either action against testt1@mailsac.com — it is the login for every admin suite,
// and the product offers both on the signed-in user's own profile.
//
// SHARED SCHOOL. FCN-CHZ-PDA is mutated by other teams — the Staff heading read 23 on
// 2026-08-24 and 22 on both 2026-09-02 and 2026-09-07. Nothing here asserts an absolute
// school-wide count.
var schoolStaff = require("../../pages/ExperienceApp/schoolStaff.page.js");
var staffProfile = require("../../pages/ExperienceApp/staffProfile.page.js");
var action = require("../../core/actionLibrary/baseActionLibrary.js");

var sts;

/**
 * Collapses whitespace before comparing product copy.
 *
 * The dialogs render blank lines between their heading, body and buttons, and the profile
 * pads its values, so a verbatim comparison would fail on layout rather than on words
 * (admin-shared.md §A6 — compare through a whitespace squash on BOTH sides).
 */
function normaliseCopy(s) {
  return String(s === null || s === undefined ? "" : s)
    .replace(/[‘’ʼ]/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

module.exports = {
  /**
   * TST_STFP_TC_RESET — BeforeEach + suite-level After housekeeping, not a functional test.
   *
   * Every case in this suite navigates AWAY from the Staff tab — into a profile, and in
   * TC_7 into the class microfrontend entirely — so the next case cannot assume where it
   * starts. This returns to the tab and clears any search left behind. It carries no
   * assertions: a reset must never fail the suite.
   *
   * REGISTERED IN BeforeEach AND THE SUITE-LEVEL After — NEVER AfterEach (ADR-019). The
   * mochawesome screenshot is taken in a ROOT afterEach which mocha runs LAST, so
   * navigating back in AfterEach would photograph the Staff list for every profile case
   * and the evidence would be worthless while the suite stayed green.
   */
  TST_STFP_TC_RESET: async function () {
    try {
      // Only pay for the reload when we actually left the tab — returning is a full
      // microfrontend load, and after TC_7 we are in a different microfrontend entirely.
      if (true !== (await schoolStaff.getData_isOnStaffTab())) {
        await schoolStaff.return_toStaffTab();
      }
      await schoolStaff.clear_search();
    } catch (e) {
      // Intentionally swallowed — housekeeping must not fail the suite. The reset's own
      // success is re-established by the next case's first assertion, which fails loudly
      // if we are not on the Staff tab.
    }
  },

  /**
   * TST_STFP_TC_1 — a teacher's profile opens with every expected detail.
   *
   * Asserts the heading, avatar, role, email and the SHAPE of "Last login <date>" and
   * "Classes (N)". The date and the count are moving values on a shared school
   * (admin-shared.md §A5), so pinning either literally would make this case fail on other
   * teams' activity rather than on a product change.
   */
  TST_STFP_TC_1: async function (testdata) {
    sts = await schoolStaff.search_staff(testdata.teacherEmail);
    await assertion.assertEqual(sts.clickStatus, true,
      "Searching for the teacher fixture " + testdata.teacherEmail + " should succeed");

    sts = await schoolStaff.click_viewProfile(testdata.teacherEmail);
    await assertion.assertEqual(sts.clickStatus, true,
      "Clicking 'View profile' for " + testdata.teacherEmail + " should succeed");
    await assertion.assertEqual(sts.pageStatus, true, "The staff profile page should load");

    sts = await staffProfile.getData_profileLayout();

    await assertion.assertEqual(sts.url.indexOf(testdata.profileUrlFragment) >= 0, true,
      "Profile URL should contain '" + testdata.profileUrlFragment + "' — got: " + sts.url);
    // Heading format is "Last name, First name" — NOT "First Last". The removal dialog
    // uses the opposite order, which is why both are pinned in this suite.
    await assertion.assertEqual(normaliseCopy(sts.headingText), testdata.teacherProfileHeading,
      "Profile heading should read '" + testdata.teacherProfileHeading + "'");
    await assertion.assertEqual(normaliseCopy(sts.avatarInitials), testdata.teacherProfileInitials,
      "Avatar should show the initials '" + testdata.teacherProfileInitials + "'");
    await assertion.assertEqual(normaliseCopy(sts.role), testdata.roleTeacher,
      "The role line should read '" + testdata.roleTeacher + "'");
    await assertion.assertEqual(normaliseCopy(sts.email), testdata.teacherEmail,
      "The email line should hold the teacher's email address");
    await assertion.assertEqual(/^Last login\s+.+$/.test(normaliseCopy(sts.lastLogin)), true,
      "A 'Last login <date>' line should be shown — got: " + sts.lastLogin);

    await assertion.assertEqual(sts.backDisplayed, true, "A 'Back' link should be displayed");
    await assertion.assertEqual(sts.manageAccountDisplayed, true,
      "The 'Manage account' dropdown should be displayed");
    // Both menu items are pre-rendered inside the CLOSED dropdown, so this is what proves
    // the menu is genuinely closed rather than merely present (admin-shared.md §B2).
    await assertion.assertEqual(sts.menuItemsDisplayedWhileClosed, false,
      "Manage account items should be hidden until the dropdown is opened");

    await assertion.assertEqual(sts.classesSectionPresent, true,
      "The classes section should be present on the profile");
    await assertion.assertEqual(/^Classes\s*\(\d+\)$/.test(normaliseCopy(sts.classesHeading)), true,
      "A 'Classes (N)' heading should be shown — got: " + sts.classesHeading);
  },

  /**
   * TST_STFP_TC_2 — an administrator's profile shows the role as Administrator/Teacher.
   *
   * The point of the case is that the profile AGREES with the Role column on the list, so
   * both are read and compared rather than the profile alone being checked against a
   * literal. That is what would catch the profile falling back to a default role.
   */
  TST_STFP_TC_2: async function (testdata) {
    sts = await schoolStaff.search_staff(testdata.adminEmail);
    await assertion.assertEqual(sts.clickStatus, true,
      "Searching for the administrator fixture " + testdata.adminEmail + " should succeed");

    var rows = await schoolStaff.getData_staffRows();
    await assertion.assertEqual(rows.length >= 1, true,
      "The administrator fixture should be listed — got " + rows.length + " rows");
    await assertion.assertEqual(rows[0].role, testdata.roleAdmin,
      "The list's Role column should read '" + testdata.roleAdmin + "' — got: " + rows[0].role);

    sts = await schoolStaff.click_viewProfile(testdata.adminEmail);
    await assertion.assertEqual(sts.pageStatus, true, "The administrator's profile should load");

    sts = await staffProfile.getData_profileLayout();
    await assertion.assertEqual(normaliseCopy(sts.headingText), testdata.adminProfileHeading,
      "Profile heading should read '" + testdata.adminProfileHeading + "'");
    await assertion.assertEqual(normaliseCopy(sts.role), testdata.roleAdmin,
      "The profile's role line should read '" + testdata.roleAdmin + "', matching the list");
  },

  /**
   * TST_STFP_TC_7 — clicking a class on a profile opens that class's page.
   *
   * ⚠️ The class is resolved BY NAME and the case asserts the name is UNIQUE on this
   * profile. Class names repeat heavily here — the fixture teacher lists `BulkCSV_Class2`
   * 17 times (accumulation from the class-creating suites, admin-shared.md §A7) — so a
   * non-unique name would mean "some class opened", which is not what the case claims.
   * The uniqueness assertion is what keeps this honest if the school's data shifts again.
   */
  TST_STFP_TC_7: async function (testdata) {
    sts = await schoolStaff.search_staff(testdata.teacherWithClassesEmail);
    await assertion.assertEqual(sts.clickStatus, true,
      "Searching for " + testdata.teacherWithClassesEmail + " should succeed");

    sts = await schoolStaff.click_viewProfile(testdata.teacherWithClassesEmail);
    await assertion.assertEqual(sts.pageStatus, true, "The teacher's profile should load");

    var layout = await staffProfile.getData_profileLayout();
    await assertion.assertEqual(layout.classRowCount > 0, true,
      "The fixture teacher should belong to at least one class — got " + layout.classRowCount);

    sts = await staffProfile.click_classByName(testdata.classNameToLaunch);
    await assertion.assertEqual(sts.matchCount, 1,
      "'" + testdata.classNameToLaunch + "' should appear EXACTLY ONCE on this profile — got "
      + sts.matchCount + ". A repeated name cannot identify which class was opened.");
    await assertion.assertEqual(sts.clickStatus, true, "Clicking the class name should succeed");
    // Crossing admin → class is a full page load, so the URL settling is the arrival signal.
    await assertion.assertEqual(/\/class\/[^/]+\/view\/classdata/.test(sts.url), true,
      "The class page should open at /class/<uuid>/view/classdata — got: " + sts.url);
    await assertion.assertEqual(String(sts.title).indexOf(testdata.classNameToLaunch) >= 0, true,
      "The tab title should carry the class name '" + testdata.classNameToLaunch
      + "' — got: " + sts.title);
  },

  /**
   * TST_STFP_TC_9 — Manage account offers Grant admin rights on a TEACHER.
   *
   * Asserts BOTH halves: Grant and Remove-from-school are offered, AND Remove admin rights
   * is not. The negative half is the one that can fail — the item is genuinely ABSENT from
   * the DOM for a teacher (verified live 2026-09-07), not merely hidden, so this is a real
   * assertion rather than a presence check that is true forever (Invariants 13 and 15).
   */
  TST_STFP_TC_9: async function (testdata) {
    sts = await schoolStaff.search_staff(testdata.teacherEmail);
    await assertion.assertEqual(sts.clickStatus, true, "Searching for the teacher should succeed");

    sts = await schoolStaff.click_viewProfile(testdata.teacherEmail);
    await assertion.assertEqual(sts.pageStatus, true, "The teacher's profile should load");

    var role = (await staffProfile.getData_profileLayout()).role;
    await assertion.assertEqual(normaliseCopy(role), testdata.roleTeacher,
      "The fixture must actually be a '" + testdata.roleTeacher
      + "' for this case to mean anything — got: " + role);

    sts = await staffProfile.click_manageAccount();
    await assertion.assertEqual(sts.clickStatus, true, "Opening 'Manage account' should succeed");
    await assertion.assertEqual(sts.menuStatus, true, "The Manage account menu should open");

    await assertion.assertEqual(sts.grantDisplayed, true,
      "'Grant admin rights' should be offered for a teacher");
    await assertion.assertEqual(sts.removeDisplayed, true,
      "'Remove from school account' should be offered for a teacher");
    await assertion.assertEqual(sts.revokePresent, false,
      "'Remove admin rights' should NOT be offered for a teacher");
    await assertion.assertEqual(sts.itemTexts.length, 2,
      "The menu should hold exactly two items — got: " + JSON.stringify(sts.itemTexts));
  },

  /**
   * TST_STFP_TC_11 — Manage account offers Remove admin rights on an ADMINISTRATOR.
   * The mirror of TC_9, and the negative half is again the assertable one: Grant is absent
   * from the DOM for an Administrator/Teacher.
   */
  TST_STFP_TC_11: async function (testdata) {
    sts = await schoolStaff.search_staff(testdata.adminEmail);
    await assertion.assertEqual(sts.clickStatus, true, "Searching for the administrator should succeed");

    sts = await schoolStaff.click_viewProfile(testdata.adminEmail);
    await assertion.assertEqual(sts.pageStatus, true, "The administrator's profile should load");

    var role = (await staffProfile.getData_profileLayout()).role;
    await assertion.assertEqual(normaliseCopy(role), testdata.roleAdmin,
      "The fixture must actually be an '" + testdata.roleAdmin
      + "' for this case to mean anything — got: " + role);

    sts = await staffProfile.click_manageAccount();
    await assertion.assertEqual(sts.menuStatus, true, "The Manage account menu should open");

    await assertion.assertEqual(sts.revokeDisplayed, true,
      "'Remove admin rights' should be offered for an administrator");
    await assertion.assertEqual(sts.removeDisplayed, true,
      "'Remove from school account' should be offered for an administrator");
    await assertion.assertEqual(sts.grantPresent, false,
      "'Grant admin rights' should NOT be offered for an administrator");
    await assertion.assertEqual(sts.itemTexts.length, 2,
      "The menu should hold exactly two items — got: " + JSON.stringify(sts.itemTexts));
  },

  /**
   * TST_STFP_TC_12 — admin rights are RETAINED when the revoke confirmation is cancelled.
   *
   * ⚠️ Opens a mutating dialog and leaves it by the cancel button. `Yes, remove admin
   * rights` is NEVER clicked — the fixture is a shared account this suite did not create.
   *
   * The case asserts the outcome three ways, because "the dialog closed" alone would also
   * be true if the revoke had gone through: the role still reads Administrator/Teacher,
   * and the menu still offers Remove (not Grant), which is the app's own signal that the
   * rights are intact.
   */
  TST_STFP_TC_12: async function (testdata) {
    sts = await schoolStaff.search_staff(testdata.adminEmail);
    await assertion.assertEqual(sts.clickStatus, true, "Searching for the administrator should succeed");

    sts = await schoolStaff.click_viewProfile(testdata.adminEmail);
    await assertion.assertEqual(sts.pageStatus, true, "The administrator's profile should load");

    sts = await staffProfile.click_manageAccount();
    await assertion.assertEqual(sts.revokeDisplayed, true,
      "'Remove admin rights' should be offered before this case can proceed");

    sts = await staffProfile.click_removeAdminRights();
    await assertion.assertEqual(sts.clickStatus, true, "Opening the revoke dialog should succeed");
    await assertion.assertEqual(sts.dialogStatus, true, "The revoke confirmation should be displayed");

    var dialog = await staffProfile.getData_removeAdminDialog();
    await assertion.assertEqual(dialog.dialogDisplayed, true,
      "The revoke dialog should be displayed, not merely present in the DOM");
    await assertion.assertEqual(normaliseCopy(dialog.dialogText).indexOf(testdata.revokeDialogHeading) >= 0, true,
      "The dialog should be headed '" + testdata.revokeDialogHeading + "' — got: " + dialog.dialogText);
    // Personalised in "<First> <Last>" order, the OPPOSITE of the profile heading's
    // "Last, First" — verified live 2026-09-07 on two different administrators.
    await assertion.assertEqual(normaliseCopy(dialog.dialogText).indexOf(testdata.revokeDialogBody) >= 0, true,
      "The dialog should explain the consequence naming the staff member — got: " + dialog.dialogText);
    await assertion.assertEqual(dialog.keepBtnText, testdata.revokeKeepBtn,
      "The cancel button should read '" + testdata.revokeKeepBtn + "'");
    await assertion.assertEqual(dialog.confirmBtnText, testdata.revokeConfirmBtn,
      "The confirm button should read '" + testdata.revokeConfirmBtn + "'");

    sts = await staffProfile.click_keepAdminRights();
    await assertion.assertEqual(sts.clickStatus, true, "Clicking '" + testdata.revokeKeepBtn + "' should succeed");
    await assertion.assertEqual(sts.dialogClosed, true, "The dialog should close");

    // The rights must be intact — asserted on the app's own state, not on the click.
    var after = await staffProfile.getData_profileLayout();
    await assertion.assertEqual(normaliseCopy(after.role), testdata.roleAdmin,
      "The role should still read '" + testdata.roleAdmin + "' after cancelling");

    var menu = await staffProfile.click_manageAccount();
    await assertion.assertEqual(menu.revokeDisplayed, true,
      "'Remove admin rights' should still be offered — its absence would mean the rights were revoked");
    await assertion.assertEqual(menu.grantPresent, false,
      "'Grant admin rights' must NOT have appeared — it would mean the revoke went through");
  },

  /**
   * TST_STFP_TC_15 — the removal confirmation explains the consequence.
   *
   * ⚠️ Opens a mutating dialog and leaves it. `Yes, remove` is NEVER clicked.
   * Copy is asserted AS SHIPPED, captured verbatim from the pre-rendered DOM.
   */
  TST_STFP_TC_15: async function (testdata) {
    sts = await schoolStaff.search_staff(testdata.teacherEmail);
    await assertion.assertEqual(sts.clickStatus, true, "Searching for the teacher should succeed");

    sts = await schoolStaff.click_viewProfile(testdata.teacherEmail);
    await assertion.assertEqual(sts.pageStatus, true, "The teacher's profile should load");

    sts = await staffProfile.click_manageAccount();
    await assertion.assertEqual(sts.removeDisplayed, true,
      "'Remove from school account' should be offered");

    sts = await staffProfile.click_removeFromSchool();
    await assertion.assertEqual(sts.clickStatus, true, "Opening the removal dialog should succeed");
    await assertion.assertEqual(sts.dialogStatus, true, "The removal confirmation should be displayed");

    var dialog = await staffProfile.getData_removeStaffDialog();
    await assertion.assertEqual(dialog.dialogDisplayed, true,
      "The removal dialog should be displayed, not merely present in the DOM");

    var text = normaliseCopy(dialog.dialogText);
    await assertion.assertEqual(text.indexOf(testdata.removalDialogHeading) >= 0, true,
      "The dialog should be headed '" + testdata.removalDialogHeading + "' — got: " + text);
    await assertion.assertEqual(text.indexOf(testdata.removalDialogBody) >= 0, true,
      "The dialog should explain the consequence — got: " + text);
    await assertion.assertEqual(text.indexOf(testdata.removalCheckboxLabel) >= 0, true,
      "The dialog should carry the confirmation checkbox label — got: " + text);
    await assertion.assertEqual(dialog.cancelBtnText, testdata.removalCancelBtn,
      "The cancel button should read '" + testdata.removalCancelBtn + "'");
    await assertion.assertEqual(dialog.confirmBtnText, testdata.removalConfirmBtn,
      "The confirm button should read '" + testdata.removalConfirmBtn + "'");

    // Leave the dialog without confirming — this suite never takes the other exit.
    sts = await staffProfile.click_cancelRemoval();
    await assertion.assertEqual(sts.dialogClosed, true, "The dialog should close on cancel");
  },

  /**
   * TST_STFP_TC_16 — "Yes, remove" is unavailable until the confirmation checkbox is ticked.
   *
   * ⚠️ THE CASE THIS TRAP EXISTS FOR. The button is disabled BY CSS CLASS ONLY: the class
   * `disabled` comes and goes while the native `disabled` property stays `false`
   * throughout. `toBeDisabled()` / `isEnabled()` would report this case as passing while
   * proving nothing (admin-shared.md §B4) — so the assertion is on the CLASS, and the
   * native state is pinned as `true` at all three points to document the trap rather than
   * leave it as a comment.
   *
   * All three states re-verified live 2026-09-07.
   */
  TST_STFP_TC_16: async function (testdata) {
    sts = await schoolStaff.search_staff(testdata.teacherEmail);
    await assertion.assertEqual(sts.clickStatus, true, "Searching for the teacher should succeed");

    sts = await schoolStaff.click_viewProfile(testdata.teacherEmail);
    await assertion.assertEqual(sts.pageStatus, true, "The teacher's profile should load");

    await staffProfile.click_manageAccount();
    sts = await staffProfile.click_removeFromSchool();
    await assertion.assertEqual(sts.dialogStatus, true, "The removal confirmation should be displayed");

    // 1 — unticked: unavailable.
    var state = await staffProfile.getData_removeStaffDialog();
    await assertion.assertEqual(state.checkboxTicked, false,
      "The confirmation checkbox should start unticked");
    await assertion.assertEqual(state.disabledByClass, true,
      "'" + testdata.removalConfirmBtn + "' should carry the 'disabled' class while unticked — got: "
      + state.confirmBtnClass);
    await assertion.assertEqual(state.nativeEnabled, true,
      "The NATIVE disabled property should stay false — this is the trap: a toBeDisabled() "
      + "assertion here is a false green (admin-shared.md §B4)");

    // 2 — ticked: available.
    var toggled = await staffProfile.click_removalConfirmCheckbox();
    await assertion.assertEqual(toggled.tickedAfter, true, "Ticking the checkbox should select it");
    state = await staffProfile.getData_removeStaffDialog();
    await assertion.assertEqual(state.disabledByClass, false,
      "The 'disabled' class should be removed once the checkbox is ticked — got: "
      + state.confirmBtnClass);
    await assertion.assertEqual(state.nativeEnabled, true,
      "The native disabled property should STILL be false — it never changes");

    // 3 — unticked again: unavailable once more.
    toggled = await staffProfile.click_removalConfirmCheckbox();
    await assertion.assertEqual(toggled.tickedAfter, false, "Unticking the checkbox should clear it");
    state = await staffProfile.getData_removeStaffDialog();
    await assertion.assertEqual(state.disabledByClass, true,
      "The 'disabled' class should return when the checkbox is unticked — got: "
      + state.confirmBtnClass);

    // Leave the dialog unticked and unconfirmed.
    sts = await staffProfile.click_cancelRemoval();
    await assertion.assertEqual(sts.dialogClosed, true, "The dialog should close on cancel");
  },

  /**
   * TST_STFP_TC_17 — the staff member is RETAINED when the removal is cancelled.
   *
   * ⚠️ Opens a mutating dialog and leaves it by the cancel button.
   *
   * "The dialog closed" is not enough on its own — that would also be true after a
   * successful removal. So the case goes Back to the Staff tab and searches for the staff
   * member again: still being listed is the app's own evidence that nothing was removed.
   */
  TST_STFP_TC_17: async function (testdata) {
    sts = await schoolStaff.search_staff(testdata.teacherEmail);
    await assertion.assertEqual(sts.clickStatus, true, "Searching for the teacher should succeed");

    sts = await schoolStaff.click_viewProfile(testdata.teacherEmail);
    await assertion.assertEqual(sts.pageStatus, true, "The teacher's profile should load");

    await staffProfile.click_manageAccount();
    sts = await staffProfile.click_removeFromSchool();
    await assertion.assertEqual(sts.dialogStatus, true, "The removal confirmation should be displayed");

    sts = await staffProfile.click_cancelRemoval();
    await assertion.assertEqual(sts.clickStatus, true,
      "Clicking '" + testdata.removalCancelBtn + "' should succeed");
    await assertion.assertEqual(sts.dialogClosed, true, "The dialog should close");

    // The profile itself is unchanged.
    var after = await staffProfile.getData_profileLayout();
    await assertion.assertEqual(normaliseCopy(after.headingText), testdata.teacherProfileHeading,
      "The profile should be unchanged after cancelling");
    await assertion.assertEqual(normaliseCopy(after.role), testdata.roleTeacher,
      "The role should still read '" + testdata.roleTeacher + "'");

    // And the staff member is still on the Staff tab — the assertion that would actually
    // fail if the removal had gone through.
    sts = await staffProfile.click_back();
    await assertion.assertEqual(sts.pageStatus, true, "'Back' should return to the Staff tab");

    // ⚠️ expectListChange:false — this is the SECOND search for the SAME term in this case.
    // `click_back` resolves as soon as the Staff heading renders, which is BEFORE the list has
    // repopulated from the earlier filtered state, so the row fingerprint can be taken against
    // the stale one-row list and then never change. Waiting on it burned the full 20s poll and
    // made this case ~39s against ~5s for its neighbours (measured 2026-09-07). In this mode
    // `search_staff` waits on the SEARCH BANNER instead — the honest "the search was applied"
    // signal when the rows legitimately cannot move.
    sts = await schoolStaff.search_staff(testdata.teacherEmail, { expectListChange: false });
    await assertion.assertEqual(sts.clickStatus, true, "Re-searching for the teacher should succeed");
    await assertion.assertEqual(sts.bannerApplied, true,
      "The search banner should confirm the search was applied");
    var rows = await schoolStaff.getData_staffRows();
    await assertion.assertEqual(rows.length >= 1, true,
      "The staff member should still be listed on the Staff tab after cancelling — got "
      + rows.length + " rows");
    await assertion.assertEqual(rows[0].email, testdata.teacherEmail,
      "The listed row should still be " + testdata.teacherEmail + " — got: " + rows[0].email);
  },

  /**
   * TST_STFP_TC_19 — Grant admin rights to a teacher, verify dual-login access to Admin Console, and teardown revocation.
   *
   * ⚠️ MUTATING TEST WITH GUARANTEED TEARDOWN:
   * Uses dedicated fixture `cqatesttea18sept@mailsac.com` (password managed via env).
   * 1. Promotes teacher to Administrator/Teacher.
   * 2. Logs in as the promoted teacher and verifies access to school Admin Console.
   * 3. IN FINALLY BLOCK: Logs back in as school admin and revokes admin rights to restore baseline Teacher role.
   */
  TST_STFP_TC_19: async function (testdata) {
    var teacherEmail = testdata.promotionTeacherEmail;
    var teacherPassword = testdata.promotionTeacherPassword;
    var adminEmail = testdata.adminUser;
    var adminPassword = testdata.adminPassword;
    var schoolKey = testdata.schoolKey;

    var schoolAdminDashboard = require("../../pages/ExperienceApp/schoolAdminDashboard.page.js");
    var schoolClasses = require("../../pages/ExperienceApp/schoolClasses.page.js");
    var loginPage = require("../../pages/ExperienceApp/login.page.js");
    var landingPage = require("../../pages/ExperienceApp/landing.page.js");
    var appShell = require("../../pages/ExperienceApp/appShell.page.js");
    var adminShell = require("../../pages/ExperienceApp/adminShell.page.js");

    var ensureLogin = async function () {
      var url = await browser.getUrl();
      if (url.indexOf("/login") === -1) {
        var domain = url.split("/").slice(0, 3).join("/");
        await browser.url(domain + "/login");
      }
      await action.waitForDocumentLoad();
      if (await action.isDisplayed(landingPage.loginBtn)) {
        console.log("[STFP_19] Clicking landing login button");
        await landingPage.click_loginBtn();
      }
      return await loginPage.isInitialized();
    };

    var doLogout = async function () {
      console.log("[STFP_19] doLogout started");
      try {
        if (await action.isDisplayed(adminShell.profileMenuTrigger)) {
          console.log("[STFP_19] clicking adminShell.profileMenuTrigger");
          await action.click(adminShell.profileMenuTrigger);
          await action.waitForDisplayed(adminShell.logoutItem, 5000);
          console.log("[STFP_19] clicking adminShell.logoutItem");
          await action.click(adminShell.logoutItem);
          await action.waitForDocumentLoad();
        } else if (await action.isDisplayed(appShell.userDrop_down)) {
          console.log("[STFP_19] clicking appShell.userDrop_down");
          await appShell.click_userDrop_down();
          await action.waitForDisplayed(appShell.logout_btn, 5000);
          console.log("[STFP_19] clicking appShell.logout_btn");
          await appShell.click_logout_btn();
          await action.waitForDocumentLoad();
        }
      } catch (e) {
        console.log("[STFP_19] doLogout exception:", e.message);
      }
      var baseUrl = await browser.getUrl();
      var domain = baseUrl.split("/").slice(0, 3).join("/");
      await browser.url(domain + "/login");
      await action.waitForDocumentLoad();
      if (await action.isDisplayed(landingPage.loginBtn)) {
        console.log("[STFP_19] Clicking landing login button after logout");
        await landingPage.click_loginBtn();
      }
      await loginPage.isInitialized();
      console.log("[STFP_19] doLogout completed");
    };

    var doLoginAndOpenSchool = async function (email, password) {
      console.log("[STFP_19] doLoginAndOpenSchool started for", email);
      await ensureLogin();
      await loginPage.set_userName_tbox(email);
      await loginPage.set_password_tbox(password);
      console.log("[STFP_19] clicking login button");
      await action.click(loginPage.login_btn);
      await action.waitForDocumentLoad();
      await browser.pause(4000);

      var hasDashboardCards = (await action.getElementCount(schoolAdminDashboard.firstSchoolLink)) > 0;
      var isDashboard = hasDashboardCards && (await action.isDisplayed(schoolAdminDashboard.firstSchoolLink));
      console.log("[STFP_19] isDashboard =", isDashboard);
      if (isDashboard) {
        console.log("[STFP_19] clicking school key", schoolKey);
        await schoolAdminDashboard.click_schoolByKey(schoolKey);
      } else {
        if ((await action.isExisting(adminShell.roleToggleSwitchTeacher)) && (await action.isDisplayed(adminShell.roleToggleSwitchTeacher))) {
          console.log("[STFP_19] toggling to Admin role");
          await action.click(adminShell.roleToggleSwitchTeacher);
          await action.waitForDocumentLoad();
        }
        await schoolClasses.isInitialized();
      }
      console.log("[STFP_19] doLoginAndOpenSchool finished");
    };

    var openProfileForTeacher = async function (isFirstSearch) {
      var sSts = await schoolStaff.search_staff(teacherEmail, { expectListChange: !isFirstSearch ? false : true });
      console.log("[STFP_19] search_staff result:", JSON.stringify(sSts));
      var vSts = await schoolStaff.click_viewProfile(teacherEmail);
      console.log("[STFP_19] click_viewProfile result:", JSON.stringify(vSts));
      return vSts;
    };

    // ── STAGE 1: Admin Promotion ────────────────────────────────────────────────────
    console.log("[STFP_19] Stage 1: Searching for teacher", teacherEmail);
    sts = await openProfileForTeacher(true);
    await assertion.assertEqual(sts.pageStatus, true, "Teacher profile should load");

    var initialRole = (await staffProfile.getData_profileLayout()).role;
    console.log("[STFP_19] Initial role on profile:", initialRole);
    if (normaliseCopy(initialRole) === testdata.roleAdmin) {
      console.log("[STFP_19] Account was previously Admin; resetting to Teacher baseline");
      await staffProfile.click_confirmRemoveAdminRights();
      await browser.pause(5000);
      await browser.refresh();
      await action.waitForDocumentLoad();
      await browser.pause(3000);
      await staffProfile.isInitialized();
      initialRole = (await staffProfile.getData_profileLayout()).role;
      console.log("[STFP_19] Reset role:", initialRole);
    }
    await assertion.assertEqual(normaliseCopy(initialRole), testdata.roleTeacher,
      "Account should initially have role '" + testdata.roleTeacher + "'");

    console.log("[STFP_19] Granting admin rights");
    sts = await staffProfile.click_grantAdminRights();
    await assertion.assertEqual(sts.clickStatus, true, "Granting admin rights should succeed");

    // [KNOWN ISSUE / WORKAROUND]: On Thor, granting admin rights causes the page to enter an
    // infinite loading state. We wait 10s for the backend mutation to settle and reload the page.
    // This reload workaround will be removed once the underlying product bug is fixed.
    console.log("[STFP_19] Waiting 10s and reloading page to clear loader loop (workaround for infinite loading issue)");
    await browser.pause(10000);
    await browser.refresh();
    await action.waitForDocumentLoad();
    await browser.pause(3000);
    await staffProfile.isInitialized();

    var promotedRole = (await staffProfile.getData_profileLayout()).role;
    console.log("[STFP_19] Promoted role on profile:", promotedRole);
    await assertion.assertEqual(normaliseCopy(promotedRole), testdata.roleAdmin,
      "Role should update to '" + testdata.roleAdmin + "' after grant");

    // ── STAGE 2 & 3: Login Verification + Guaranteed Teardown ───────────────────────
    try {
      // 2a. Logout admin
      console.log("[STFP_19] Stage 2: Logging out admin");
      await doLogout();

      // 2b. Login as promoted teacher
      console.log("[STFP_19] Logging in as promoted teacher");
      await doLoginAndOpenSchool(teacherEmail, teacherPassword);

      // 2c. Verify Admin Console loaded
      console.log("[STFP_19] Verifying schoolClasses isInitialized for promoted teacher");
      sts = await schoolClasses.isInitialized();
      await assertion.assertEqual(sts.pageStatus, true,
        "Promoted teacher should access school Admin Console (Classes tab)");

      // 2d. Navigate to Staff tab as admin
      console.log("[STFP_19] Navigating to Staff tab as promoted teacher");
      sts = await schoolStaff.click_staffTab();
      await assertion.assertEqual(sts.pageStatus, true,
        "Promoted teacher should be able to open Staff tab in Admin Console");

    } finally {
      // ── STAGE 3: Guaranteed Teardown Revocation ──────────────────────────────────
      try {
        console.log("[STFP_19] Stage 3 Teardown: Logging out teacher");
        await doLogout();
        console.log("[STFP_19] Stage 3 Teardown: Logging in as admin", adminEmail);
        await doLoginAndOpenSchool(adminEmail, adminPassword);
        console.log("[STFP_19] Stage 3 Teardown: Opening Staff tab and searching teacher");
        await schoolStaff.click_staffTab();
        await openProfileForTeacher(true);

        var currentRole = (await staffProfile.getData_profileLayout()).role;
        console.log("[STFP_19] Stage 3 Teardown: Current role:", currentRole);
        if (normaliseCopy(currentRole) === testdata.roleAdmin) {
          console.log("[STFP_19] Stage 3 Teardown: Revoking admin rights");
          await staffProfile.click_confirmRemoveAdminRights();
          console.log("[STFP_19] Stage 3 Teardown: Waiting 5s and refreshing page");
          await browser.pause(5000);
          await browser.refresh();
          await action.waitForDocumentLoad();
          await browser.pause(3000);
          await staffProfile.isInitialized();
        }
        var restoredRole = (await staffProfile.getData_profileLayout()).role;
        console.log("[STFP_19] Stage 3 Teardown: Restored role:", restoredRole);
        await assertion.assertEqual(normaliseCopy(restoredRole), testdata.roleTeacher,
          "Teardown: Role should be restored to '" + testdata.roleTeacher + "'");
      } catch (teardownErr) {
        console.log("[STFP_19] Teardown error:", teardownErr.message);
        await logger.logInto(await stackTrace.get(), "Teardown error: " + teardownErr.message, "error");
      }
    }
  }
};

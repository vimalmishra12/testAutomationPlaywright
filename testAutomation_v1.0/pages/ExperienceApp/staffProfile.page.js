"use strict";
var action = require("../../core/actionLibrary/baseActionLibrary.js");
// Selectors resolved at load time from C1Selectors.json → css.ComproC1.staffProfile
var selectorFile = jsonParserUtil.jsonParser(selectorDir);
var sp = selectorFile.css.ComproC1.staffProfile;

/**
 * Budget for the crossing from the `admin` microfrontend into `class` when a class is
 * launched from the profile (TST_STFP_TC_7). This is a FULL page load, not an Angular
 * route change (admin-staff-tab.md §1).
 *
 * Measured live 2026-09-07: the class document loaded in 3.44s (domContentLoaded 1.60s).
 * 60000 is ~17x that — deliberately generous because Thor's throughput varies 4-8x for
 * the same work (admin-shared.md §B8) and this is a cross-microfrontend navigation, the
 * slowest thing either Staff suite does. It still leaves headroom under mocha's 120000
 * timeout, so a failure here reports THIS method's diagnostic rather than a generic
 * "Timeout of 120000ms exceeded" (admin-shared.md §B8).
 *
 * The same budget and the same two-signal wait are used by `studentProfile.click_classEntry`.
 */
var CLASS_LAUNCH_TIMEOUT = 60000;

/**
 * Budget for a confirmation dialog to appear or disappear.
 *
 * Both dialogs are PRE-RENDERED in the DOM (§B2), so this is only ever waiting on
 * Bootstrap's fade, never on a network call. Measured 2026-09-07: the Manage account menu
 * toggles in ~1ms and both dialogs settled well inside 2.5s. 10000 is ~4x the observed
 * worst case.
 *
 * ⚠️ Kept SHORT on purpose. A generous budget here would mask the failure mode actually
 * seen during capture — a backdrop rendering with no dialog behind it — by eventually
 * "succeeding" against a half-open modal.
 */
var DIALOG_TIMEOUT = 10000;

/**
 * Splits a container's rendered text into trimmed, non-empty lines.
 * The profile renders blank lines between the role, email and last-login values.
 */
function textLines(raw) {
  if (!raw || raw.message) return [];
  return String(raw).split("\n").map(function (s) { return s.trim(); })
    .filter(function (s) { return s.length > 0; });
}

module.exports = {
  // Resolves to C1Selectors.json → css.ComproC1.staffProfile.*
  profileSection: sp.profileSection,
  profileHeading: sp.profileHeading,
  profileAvatarInitials: sp.profileAvatarInitials,
  profileRole: sp.profileRole,
  profileEmail: sp.profileEmail,
  profileLastLogin: sp.profileLastLogin,
  backLink: sp.backLink,
  manageAccountDropdown: sp.manageAccountDropdown,
  manageAccountMenu: sp.manageAccountMenu,
  manageAccountGrantAdmin: sp.manageAccountGrantAdmin,
  manageAccountRemoveAdmin: sp.manageAccountRemoveAdmin,
  manageAccountRemoveFromSchool: sp.manageAccountRemoveFromSchool,
  classesSection: sp.classesSection,
  classesCountHeading: sp.classesCountHeading,
  classRowAll: sp.classRowAll,
  classNameAll: sp.classNameAll,
  removeAdminModal: sp.removeAdminModal,
  removeAdminModalKeepBtn: sp.removeAdminModalKeepBtn,
  removeAdminModalConfirmBtn: sp.removeAdminModalConfirmBtn,
  removeStaffModal: sp.removeStaffModal,
  removeStaffModalCheckbox: sp.removeStaffModalCheckbox,
  removeStaffModalCheckboxLabel: sp.removeStaffModalCheckboxLabel,
  removeStaffModalCancelBtn: sp.removeStaffModalCancelBtn,
  removeStaffModalConfirmBtn: sp.removeStaffModalConfirmBtn,
  // Selector TEMPLATES — {{n}} resolved at call time.
  classNameByIndex: sp.classNameByIndex,
  classChevronByIndex: sp.classChevronByIndex,

  /**
   * Confirms a staff member's View profile page has loaded.
   *
   * Anchors on `div.view-profile`, the page-scoping wrapper, NOT on `h1` — every admin
   * view renders an unclassed heading, so a bare `h1` silently matches the wrong page
   * (admin-shared.md §B9).
   *
   * ⚠️ There is no `<staff>` component tag on this view (verified live 2026-09-07) — that
   * tag scopes the Staff LIST only. `div.view-profile` is the honest scope here, and it is
   * the SAME wrapper the student profile uses; the two screens differ only below it.
   */
  isInitialized: async function () {
    await logger.logInto(await stackTrace.get());
    await action.waitForDocumentLoad();
    return { pageStatus: await action.waitForDisplayed(this.profileSection) };
  },

  /**
   * The profile's header block — everything above the Classes section.
   *
   * ⚠️ Reads the Manage account items' visibility WHILE THE MENU IS CLOSED. Both are
   * pre-rendered inside the closed dropdown, so `menuItemsDisplayedWhileClosed === false`
   * is what proves the menu is genuinely closed rather than merely present (§B2).
   */
  getData_profileLayout: async function () {
    await logger.logInto(await stackTrace.get());
    var text = async function (sel) {
      if (!(await action.isExisting(sel))) return null;
      var t = await action.getText(sel);
      return t && t.message ? null : String(t).trim();
    };
    var removePresent = await action.isExisting(this.manageAccountRemoveFromSchool);
    return {
      url: await browser.getUrl(),
      headingText: await text(this.profileHeading),
      avatarInitials: await text(this.profileAvatarInitials),
      role: await text(this.profileRole),
      email: await text(this.profileEmail),
      lastLogin: await text(this.profileLastLogin),
      backDisplayed: await action.isDisplayed(this.backLink),
      manageAccountDisplayed: await action.isDisplayed(this.manageAccountDropdown),
      menuItemsDisplayedWhileClosed: removePresent
        ? await action.isDisplayed(this.manageAccountRemoveFromSchool) : false,
      classesSectionPresent: await action.isExisting(this.classesSection),
      // ⚠️ ABSENT ENTIRELY when the staff member has no classes — it does NOT render
      // "Classes (0)" (verified live 2026-09-07 on an administrator with none).
      classesHeading: await text(this.classesCountHeading),
      classRowCount: await action.getElementCount(this.classRowAll)
    };
  },

  /**
   * Opens the Manage account dropdown and reports which items it offers.
   *
   * ⚠️ The menu is ROLE-CONDITIONAL, and the items that do not apply are ABSENT FROM THE
   * DOM — not merely hidden (verified live 2026-09-07):
   *   Teacher               → Grant admin rights  (user-profile-4) + Remove from school
   *   Administrator/Teacher → Remove admin rights (user-profile-3) + Remove from school
   * That is what makes "the other item is NOT offered" an assertion which can genuinely
   * fail, rather than a presence check that is true forever (Invariants 13 and 15).
   */
  click_manageAccount: async function () {
    await logger.logInto(await stackTrace.get());
    var clickStatus = await action.click(this.manageAccountDropdown);
    if (true !== clickStatus) return { clickStatus: clickStatus };
    var menuStatus = await action.waitForDisplayed(this.manageAccountMenu, DIALOG_TIMEOUT);
    var grantPresent = await action.isExisting(this.manageAccountGrantAdmin);
    var revokePresent = await action.isExisting(this.manageAccountRemoveAdmin);
    var removePresent = await action.isExisting(this.manageAccountRemoveFromSchool);
    return {
      clickStatus: clickStatus,
      menuStatus: menuStatus,
      grantPresent: grantPresent,
      revokePresent: revokePresent,
      removePresent: removePresent,
      grantDisplayed: grantPresent ? await action.isDisplayed(this.manageAccountGrantAdmin) : false,
      revokeDisplayed: revokePresent ? await action.isDisplayed(this.manageAccountRemoveAdmin) : false,
      removeDisplayed: removePresent ? await action.isDisplayed(this.manageAccountRemoveFromSchool) : false,
      itemTexts: textLines(await action.getText(this.manageAccountMenu))
    };
  },

  /**
   * Manage account → "Remove admin rights", opening the confirmation dialog.
   *
   * ⚠️ OPENS ONLY. The confirm button is never touched here — revoking rights on a staff
   * member this suite did not create is forbidden (admin-staff-tab.md §6), and the signed-in
   * account is offered the same action on its own profile.
   *
   * The menu items carry `data-toggle="modal"` with NO `data-target`, so the dialog is
   * opened by the app's own handler rather than by Bootstrap's data API.
   */
  click_removeAdminRights: async function () {
    await logger.logInto(await stackTrace.get());
    if (!(await action.isExisting(this.manageAccountRemoveAdmin))) {
      return { clickStatus: "REMOVE_ADMIN_NOT_OFFERED" };
    }
    var clickStatus = await action.click(this.manageAccountRemoveAdmin);
    if (true !== clickStatus) return { clickStatus: clickStatus };
    return {
      clickStatus: clickStatus,
      // isDisplayed, never a count — the dialog is pre-rendered (§B2).
      dialogStatus: await action.waitForDisplayed(this.removeAdminModal, DIALOG_TIMEOUT)
    };
  },

  /** The Remove-admin-rights dialog's state and copy. */
  getData_removeAdminDialog: async function () {
    await logger.logInto(await stackTrace.get());
    var present = await action.isExisting(this.removeAdminModal);
    if (!present) return { dialogDisplayed: false, dialogText: null };
    var confirm = await action.getText(this.removeAdminModalConfirmBtn);
    var keep = await action.getText(this.removeAdminModalKeepBtn);
    return {
      dialogDisplayed: await action.isDisplayed(this.removeAdminModal),
      dialogText: String(await action.getText(this.removeAdminModal)),
      keepBtnText: keep && keep.message ? null : String(keep).trim(),
      confirmBtnText: confirm && confirm.message ? null : String(confirm).trim()
    };
  },

  /**
   * Dismisses the Remove-admin-rights dialog with "No, keep admin rights" (TST_STFP_TC_12).
   * The non-mutating exit — the ONLY exit this suite ever takes from this dialog.
   */
  click_keepAdminRights: async function () {
    await logger.logInto(await stackTrace.get());
    var clickStatus = await action.click(this.removeAdminModalKeepBtn);
    if (true !== clickStatus) return { clickStatus: clickStatus };
    return {
      clickStatus: clickStatus,
      // reverse=true — wait for it to go, not merely for the click to return.
      dialogClosed: await action.waitForDisplayed(this.removeAdminModal, DIALOG_TIMEOUT, true)
    };
  },

  /**
   * Manage account → "Remove from school account", opening the confirmation dialog.
   * ⚠️ OPENS ONLY — `Yes, remove` is never clicked by this suite.
   */
  click_removeFromSchool: async function () {
    await logger.logInto(await stackTrace.get());
    if (!(await action.isExisting(this.manageAccountRemoveFromSchool))) {
      return { clickStatus: "REMOVE_FROM_SCHOOL_NOT_OFFERED" };
    }
    var clickStatus = await action.click(this.manageAccountRemoveFromSchool);
    if (true !== clickStatus) return { clickStatus: clickStatus };
    return {
      clickStatus: clickStatus,
      dialogStatus: await action.waitForDisplayed(this.removeStaffModal, DIALOG_TIMEOUT)
    };
  },

  /**
   * The Remove-from-school dialog's state, copy and — critically — how `Yes, remove` is
   * disabled.
   *
   * ⚠️ THE TRAP THIS WHOLE METHOD EXISTS FOR: the button is disabled by CSS CLASS ONLY.
   * Re-verified live 2026-09-07 across all three states:
   *   unticked → class "btn btn-lg btn-main-1 btn-block disabled", native disabled = false
   *   ticked   → class "btn btn-lg btn-main-1 btn-block"          , native disabled = false
   *   unticked → class "... disabled"                              , native disabled = false
   * The native property NEVER changes, so `isEnabled()` / `toBeDisabled()` is a FALSE
   * GREEN — it would report TST_STFP_TC_16 as passing while proving nothing
   * (admin-shared.md §B4, admin-staff-tab.md §4). Assert `disabledByClass`.
   *
   * `nativeEnabled` is returned alongside deliberately, so the test can pin the trap
   * itself: the native state staying `true` throughout is part of what the case documents.
   */
  getData_removeStaffDialog: async function () {
    await logger.logInto(await stackTrace.get());
    var present = await action.isExisting(this.removeStaffModal);
    if (!present) return { dialogDisplayed: false, dialogText: null };
    var cls = await action.getAttribute(this.removeStaffModalConfirmBtn, "class");
    var confirm = await action.getText(this.removeStaffModalConfirmBtn);
    var cancel = await action.getText(this.removeStaffModalCancelBtn);
    return {
      dialogDisplayed: await action.isDisplayed(this.removeStaffModal),
      dialogText: String(await action.getText(this.removeStaffModal)),
      cancelBtnText: cancel && cancel.message ? null : String(cancel).trim(),
      confirmBtnText: confirm && confirm.message ? null : String(confirm).trim(),
      checkboxTicked: await action.isSelected(this.removeStaffModalCheckbox),
      confirmBtnClass: cls && cls.message ? null : String(cls),
      disabledByClass: cls && !cls.message
        ? String(cls).split(/\s+/).indexOf("disabled") >= 0 : null,
      nativeEnabled: await action.isEnabled(this.removeStaffModalConfirmBtn)
    };
  },

  /**
   * Toggles the removal dialog's confirmation checkbox.
   *
   * ⚠️ Clicked via its `<label>`, not the input. The `label.custom-control-label` of a
   * Bootstrap custom control overlays the input and intercepts pointer events, so clicking
   * the input itself times out (admin-shared.md §B5).
   */
  click_removalConfirmCheckbox: async function () {
    await logger.logInto(await stackTrace.get());
    var before = await action.isSelected(this.removeStaffModalCheckbox);
    var clickStatus = await action.click(this.removeStaffModalCheckboxLabel);
    if (true !== clickStatus) return { clickStatus: clickStatus };
    return {
      clickStatus: clickStatus,
      tickedBefore: before,
      tickedAfter: await action.isSelected(this.removeStaffModalCheckbox)
    };
  },

  /**
   * Dismisses the Remove-from-school dialog with "No, cancel" (TST_STFP_TC_17).
   * The non-mutating exit — the ONLY exit this suite ever takes from this dialog.
   */
  click_cancelRemoval: async function () {
    await logger.logInto(await stackTrace.get());
    var clickStatus = await action.click(this.removeStaffModalCancelBtn);
    if (true !== clickStatus) return { clickStatus: clickStatus };
    return {
      clickStatus: clickStatus,
      dialogClosed: await action.waitForDisplayed(this.removeStaffModal, DIALOG_TIMEOUT, true)
    };
  },

  /** Every class listed on the profile, in render order. */
  getData_classNames: async function () {
    await logger.logInto(await stackTrace.get());
    var count = await action.getElementCount(this.classNameAll);
    if (typeof count !== "number") return [];
    var names = [];
    for (var i = 1; i <= count; i++) {
      var t = await action.getText(this.classNameByIndex.replace("{{n}}", String(i)));
      names.push(t && t.message ? null : String(t).trim());
    }
    return names;
  },

  /**
   * Launches a class from the profile's Classes section BY NAME (TST_STFP_TC_7).
   *
   * ⚠️ Resolved by NAME, never by index, for two independent reasons found live 2026-09-07:
   *  1. `a.class-details` matches roughly TWO elements per row — the class-name anchor and
   *     the course-material anchor beneath it. The fixture teacher's 43 classes produced
   *     129 matches, and its target class sat at index 84. An index over that collection
   *     means nothing.
   *  2. Class names REPEAT on this school — the same teacher lists `BulkCSV_Class2` 17
   *     times and `AutoClass_CreateOnly` 8 times, accumulated by the class-creating suites
   *     (admin-shared.md §A7). A name that is not unique is not a fixture; the caller is
   *     expected to pass one that is, and this returns `matchCount` so the test can assert
   *     it did.
   *
   * Crossing into `class` is a FULL page load, not an Angular route change, so arrival is
   * confirmed by the destination URL settling plus the document load — the same two-signal
   * wait `studentProfile.click_classEntry` uses. This module does not own the class page,
   * so it deliberately does not assert a DOM anchor there.
   */
  click_classByName: async function (className) {
    await logger.logInto(await stackTrace.get(), "class:" + className);
    var count = await action.getElementCount(this.classNameAll);
    if (typeof count !== "number" || count === 0) return { clickStatus: "NO_CLASSES_LISTED" };
    var target = -1;
    var matches = 0;
    for (var i = 1; i <= count; i++) {
      var t = await action.getText(this.classNameByIndex.replace("{{n}}", String(i)));
      if (t && !t.message && String(t).trim() === String(className)) {
        matches++;
        if (target < 0) target = i;
      }
    }
    if (target < 0) return { clickStatus: "CLASS_NOT_FOUND:" + className, matchCount: 0 };
    var clickStatus = await action.click(this.classNameByIndex.replace("{{n}}", String(target)));
    if (true !== clickStatus) return { clickStatus: clickStatus, matchCount: matches };
    await action.waitForUrl(/\/class\/[^/]+\/view\/classdata/, CLASS_LAUNCH_TIMEOUT);
    await action.waitForDocumentLoad();
    return {
      clickStatus: clickStatus,
      matchCount: matches,
      url: await browser.getUrl(),
      title: await browser.getTitle()
    };
  },

  /**
   * "Back" → the Staff tab.
   *
   * Measured live 2026-09-07: ~2.4s, and it also CLEARS any active search — the list comes
   * back at `Staff (N)` with the full first page, not at the search that was applied before
   * the profile was opened.
   */
  click_back: async function () {
    await logger.logInto(await stackTrace.get());
    var clickStatus = await action.click(this.backLink);
    if (true !== clickStatus) return { clickStatus: clickStatus };
    var schoolStaff = require("./schoolStaff.page.js"); // lazy — avoids a require cycle
    return { clickStatus: clickStatus, pageStatus: (await schoolStaff.isInitialized()).pageStatus };
  }
};

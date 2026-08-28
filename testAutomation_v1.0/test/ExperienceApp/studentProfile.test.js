"use strict";
// Admin App — student profile, Manage learner profile and individual code activation.
// Module code SPRF → pages/ExperienceApp/studentProfile.page.js.
// Manual source: test/Manual/C1App/AdminApp-Students/AdminApp_Students_tab_test_cases.md
//
// Batch (this file): Req #8 (TC_1, TC_4, TC_5, TC_6, TC_7), Req #9 (TC_2),
// Req #11 (TC_9), Req #12 (TC_11), Req #13 (TC_15, TC_16), Req #14 (TC_17),
// Req #22 (TC_21). Every case here is SIDE-EFFECT FREE — nothing is created, changed or
// removed. The mutating cases in this module (TC_8 set password, TC_10 update names,
// TC_14 consume a code, TC_19/TC_22 remove a student) are deliberately NOT in this batch:
// they change a REAL account on a shared school (admin-shared.md §A5 / ADR-021 rule 7).
//
// SHARED SCHOOL. FCN-CHZ-PDA is mutated by other teams — 26 students on 2026-08-22,
// 27 on 2026-08-28. Nothing here asserts an absolute count of anything school-wide.
var schoolStudents = require("../../pages/ExperienceApp/schoolStudents.page.js");
var studentProfile = require("../../pages/ExperienceApp/studentProfile.page.js");

var sts;

/**
 * Collapses whitespace and normalises the apostrophe before comparing product copy.
 *
 * The activation error uses U+0027 (a STRAIGHT apostrophe — char code 39, read off the
 * live DOM 2026-08-28), while the manual test case and the product-knowledge file both
 * record it as U+2019 (curly). Failing a verbatim-copy assertion on which apostrophe a
 * document happened to use would be a false negative about the product, so normalise
 * both sides and let the comparison be about the words.
 */
function normaliseCopy(s) {
  return String(s === null || s === undefined ? "" : s)
    .replace(/[‘’ʼ]/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

module.exports = {
  /**
   * TST_SPRF_TC_RESET — BeforeEach + suite-level After housekeeping, not a functional test.
   *
   * Every case in this suite navigates AWAY from the Students tab (into the profile, the
   * Manage learner profile form, a Gigya screen-set, the activation page or a class
   * page), so the next case cannot assume where it starts. This returns to the tab and
   * clears any search left behind. It carries no assertions — a reset must never fail the
   * suite.
   *
   * REGISTERED IN BeforeEach AND THE SUITE-LEVEL After — NEVER AfterEach (ADR-019). The
   * mochawesome screenshot is taken in a ROOT afterEach which mocha runs LAST, so
   * navigating back in AfterEach would photograph the Students tab for every profile case
   * and the evidence would be worthless while the suite stayed green.
   */
  TST_SPRF_TC_RESET: async function () {
    try {
      // Only pay for the reload when we actually left the tab — returning is a full
      // microfrontend load (~4.4s measured 2026-08-28), and most resets do need it.
      if (true !== (await schoolStudents.getData_isOnStudentsTab())) {
        await schoolStudents.return_toStudentsTab();
      }
      await schoolStudents.clear_search();
    } catch (e) {
      // Intentionally swallowed — housekeeping must not fail the suite.
    }
  },

  /**
   * TST_SPRF_TC_1 — an adult learner's profile shows every expected section.
   *
   * Asserts the SHAPE of the two section headings rather than their numbers: the counts
   * belong to a shared, mutated school and the student's own materials can be changed by
   * anyone (admin-shared.md §A5). "Last login" is asserted the same way — the date is a
   * moving value.
   */
  TST_SPRF_TC_1: async function (testdata) {
    sts = await schoolStudents.click_viewStudentProfile(testdata.adultEmail);
    await assertion.assertEqual(sts.clickStatus, true,
      "Clicking 'View student profile' for " + testdata.adultEmail + " should succeed");
    await assertion.assertEqual(sts.pageStatus, true, "The student profile page should load");

    sts = await studentProfile.getData_profileLayout();

    await assertion.assertEqual(sts.url.indexOf(testdata.profileUrlFragment) >= 0, true,
      "Profile URL should contain '" + testdata.profileUrlFragment + "' — got: " + sts.url);
    // Heading format is "Last name, First name" — NOT "First Last".
    await assertion.assertEqual(normaliseCopy(sts.headingText), testdata.adultProfileHeading,
      "Profile heading should read '" + testdata.adultProfileHeading + "'");
    await assertion.assertEqual(normaliseCopy(sts.avatarInitials), testdata.adultProfileInitials,
      "Avatar should show the initials '" + testdata.adultProfileInitials + "'");
    // For an email-based account the identifier line holds the email address.
    await assertion.assertEqual(normaliseCopy(sts.identifier), testdata.adultEmail,
      "Identifier line should hold the student's email address");
    await assertion.assertEqual(/^Last login\s+.+$/.test(normaliseCopy(sts.lastLogin)), true,
      "A 'Last login <date>' line should be shown — got: " + sts.lastLogin);

    await assertion.assertEqual(sts.backDisplayed, true, "A 'Back' link should be displayed");
    await assertion.assertEqual(sts.manageAccountDisplayed, true,
      "The 'Manage account' dropdown should be displayed");
    // Both menu items are pre-rendered inside the closed dropdown, so this proves the
    // menu is genuinely CLOSED rather than merely present (admin-shared.md §B2).
    await assertion.assertEqual(sts.manageAccountItemsDisplayedWhileClosed, false,
      "Manage account items should be hidden until the dropdown is opened");

    await assertion.assertEqual(/^Course materials\s*\(\d+\)$/.test(normaliseCopy(sts.courseMaterialsHeading)), true,
      "A 'Course materials (N)' section should be shown — got: " + sts.courseMaterialsHeading);
    await assertion.assertEqual(/^Classes\s*\(\d+\)/.test(normaliseCopy(sts.classesHeading)), true,
      "A 'Classes (N)' section should be shown — got: " + sts.classesHeading);
  },

  /**
   * TST_SPRF_TC_2 — a child account's profile shows its USERNAME as the identifier.
   *
   * The product renders the identifier in the same `div.email` node for both account
   * types, so the assertion that matters is that the value is the username and carries no
   * "@" — the class name promises an email that is not there.
   */
  TST_SPRF_TC_2: async function (testdata) {
    sts = await schoolStudents.click_viewStudentProfile(testdata.childUsername);
    await assertion.assertEqual(sts.clickStatus, true,
      "Clicking 'View student profile' for " + testdata.childUsername + " should succeed");
    await assertion.assertEqual(sts.pageStatus, true, "The child's profile page should load");

    sts = await studentProfile.getData_profileLayout();
    await assertion.assertEqual(normaliseCopy(sts.headingText), testdata.childProfileHeading,
      "Profile heading should read '" + testdata.childProfileHeading + "'");
    await assertion.assertEqual(normaliseCopy(sts.avatarInitials), testdata.childProfileInitials,
      "Avatar should show the initials '" + testdata.childProfileInitials + "'");
    await assertion.assertEqual(normaliseCopy(sts.identifier), testdata.childUsername,
      "Identifier line should hold the USERNAME for a username-based account");
    await assertion.assertEqual(normaliseCopy(sts.identifier).indexOf("@") < 0, true,
      "A username identifier should not look like an email address — got: " + sts.identifier);
    await assertion.assertEqual(/^Course materials\s*\(\d+\)$/.test(normaliseCopy(sts.courseMaterialsHeading)), true,
      "A 'Course materials (N)' section should be shown — got: " + sts.courseMaterialsHeading);
    await assertion.assertEqual(/^Classes\s*\(\d+\)/.test(normaliseCopy(sts.classesHeading)), true,
      "A 'Classes (N)' section should be shown — got: " + sts.classesHeading);
  },

  /**
   * TST_SPRF_TC_4 — every course-material component shows one of three states, and its
   * dates follow from that state.
   *
   * The rule under test is structural, not a fixed list of components: this student's
   * materials belong to a shared school and can be changed by anyone. What must always
   * hold is (a) the heading count counts UMBRELLAS, not components, and (b) an activated
   * or expired component carries both dates while an unactivated one carries neither.
   */
  TST_SPRF_TC_4: async function (testdata) {
    sts = await schoolStudents.click_viewStudentProfile(testdata.adultEmail);
    await assertion.assertEqual(sts.pageStatus, true, "The student profile page should load");

    var materials = await studentProfile.getData_courseMaterials();

    await assertion.assertEqual(materials.headingCount, materials.umbrellaCount,
      "'Course materials (N)' should count UMBRELLAS — heading says " + materials.headingCount +
      " and " + materials.umbrellaCount + " umbrella titles are rendered");
    await assertion.assertEqual(materials.components.length > 0, true,
      "The fixture student should list at least one course-material component");
    await assertion.assertEqual(materials.components.length, materials.componentRowCount,
      "Every rendered component row should have been read — parsed " +
      materials.components.length + " of " + materials.componentRowCount);

    var allowed = ["Code activated", "Code not activated", "Code expired"];
    var datesConsistent = true;
    var offender = null;
    for (var i = 0; i < materials.components.length; i++) {
      var c = materials.components[i];
      await assertion.assertEqual(allowed.indexOf(c.state) >= 0, true,
        "Component '" + c.name + "' should show one of the three documented states — got: " + c.state);
      var wantsDates = (c.state === "Code activated" || c.state === "Code expired");
      var hasDates = (c.activatedDate !== null && c.expiresDate !== null);
      var hasNoDates = (c.activatedDate === null && c.expiresDate === null);
      if (wantsDates ? !hasDates : !hasNoDates) { datesConsistent = false; offender = c; }
    }
    await assertion.assertEqual(datesConsistent, true,
      "'Code activated' / 'Code expired' should carry both dates and 'Code not activated' neither" +
      (offender ? " — offender: " + JSON.stringify(offender) : ""));

    // This fixture is the only account on the school known to carry BOTH an expired and
    // an unactivated component; it is what makes the case worth running here.
    var states = materials.components.map(function (c) { return c.state; });
    await assertion.assertEqual(states.indexOf(testdata.expectedComponentState) >= 0, true,
      "Fixture '" + testdata.adultEmail + "' should still show at least one '" +
      testdata.expectedComponentState + "' component — got states: " + states.join(", "));
  },

  /**
   * TST_SPRF_TC_5 — Back returns the admin to the Students tab with school context intact.
   */
  TST_SPRF_TC_5: async function (testdata) {
    sts = await schoolStudents.click_viewStudentProfile(testdata.adultEmail);
    await assertion.assertEqual(sts.pageStatus, true, "The student profile page should load");

    sts = await studentProfile.click_back();
    await assertion.assertEqual(sts.clickStatus, true, "Clicking 'Back' should succeed");
    await assertion.assertEqual(sts.url.indexOf(testdata.studentsUrlFragment) >= 0, true,
      "Back should land on the Students tab — got: " + sts.url);
    // The school context surviving is the point: the tab renders its own list, it does
    // not bounce to /dashboard/error the way a context-less Classes deep link does.
    await assertion.assertEqual(sts.pageStatus, true,
      "The Students tab should load with the school context intact");
  },

  /**
   * TST_SPRF_TC_6 — a profile URL can be opened directly as a deep link.
   *
   * The URL is captured from a profile opened normally rather than hard-coded: it embeds
   * the org slug, the org UUID and a learner id that appears nowhere in the Students list.
   *
   * Scope note: this proves deep-linking works WITHIN a session whose school context is
   * already set. Cold-session behaviour is a different question and is not tested here.
   */
  TST_SPRF_TC_6: async function (testdata) {
    sts = await schoolStudents.click_viewStudentProfile(testdata.adultEmail);
    await assertion.assertEqual(sts.pageStatus, true, "The student profile page should load");

    var profileUrl = studentProfile.getData_lastProfileUrl();
    await assertion.assertEqual(typeof profileUrl === "string" && profileUrl.indexOf(testdata.profileUrlFragment) >= 0, true,
      "A profile URL should have been captured — got: " + profileUrl);

    // Leave the profile first, so re-opening it is genuinely a fresh navigation and not a
    // no-op against the page already on screen.
    sts = await studentProfile.click_back();
    await assertion.assertEqual(sts.pageStatus, true, "Back to the Students tab should succeed");

    sts = await studentProfile.open_profileByUrl(profileUrl);
    await assertion.assertEqual(sts.pageStatus, true,
      "The profile should load when its URL is opened directly");
    await assertion.assertEqual(sts.url.indexOf(testdata.profileUrlFragment) >= 0, true,
      "The deep link should stay on the profile route rather than redirect — got: " + sts.url);

    var layout = await studentProfile.getData_profileLayout();
    await assertion.assertEqual(normaliseCopy(layout.headingText), testdata.adultProfileHeading,
      "The deep-linked page should be the SAME student's profile");
  },

  /**
   * TST_SPRF_TC_7 — an admin is shown a readable error when a profile cannot be loaded.
   *
   * ⚠️ THIS CASE IS EXPECTED TO FAIL AGAINST THE CURRENT PRODUCT, and it is deliberately
   * NOT listed in the execution file — it is registered and kept here so it is ready the
   * day the defect is fixed (decision taken with the user, 2026-08-28).
   *
   * Open defect, re-confirmed live 2026-08-28: opening this student's profile collapses
   * the URL to `/class/` and renders NOTHING — no heading, no button, no text, no error —
   * forever, because `GET …/getUserDetailWithClasses?…` returns HTTP 500. Two faults in
   * one: the 500 itself (student-specific — every other profile on this school loads) and
   * the missing client-side handling of it.
   *
   * It asserts the REQUIREMENT (the profile loads, or the admin is told what went wrong),
   * never the defect. Encoding the broken behaviour as the expectation would make the
   * test start failing on the day the product is fixed, which is the wrong way round.
   */
  TST_SPRF_TC_7: async function (testdata) {
    sts = await schoolStudents.click_viewStudentProfile(testdata.brokenProfileEmail);
    await assertion.assertEqual(sts.clickStatus, true,
      "Clicking 'View student profile' for " + testdata.brokenProfileEmail + " should succeed");
    await assertion.assertEqual(sts.pageStatus, true,
      "The profile should either load or show the admin a readable error — it currently " +
      "hangs on an empty page at /class/ because getUserDetailWithClasses returns HTTP 500");
  },

  /**
   * TST_SPRF_TC_9 — a password failing the complexity rules is rejected with a clear
   * message, and nothing is changed.
   *
   * Safe to run on the shared school: the rejection is CLIENT-SIDE inside the Gigya
   * screen-set, so no request is sent and the student's real password is untouched. The
   * weak value is what keeps it safe — never point this case at a valid password.
   */
  TST_SPRF_TC_9: async function (testdata) {
    sts = await schoolStudents.click_viewStudentProfile(testdata.childUsername);
    await assertion.assertEqual(sts.pageStatus, true, "The student profile page should load");

    sts = await studentProfile.click_manageAccount();
    await assertion.assertEqual(sts.editDetailsDisplayed, true,
      "'Edit account details' should appear in the Manage account menu");

    sts = await studentProfile.click_editAccountDetails();
    await assertion.assertEqual(sts.pageStatus, true, "The Manage learner profile page should load");

    sts = await studentProfile.click_passwordTab();
    await assertion.assertEqual(sts.clickStatus, true, "Clicking the 'Password' tab should succeed");
    await assertion.assertEqual(sts.fieldStatus, true,
      "The Gigya 'New password' field should appear once the screen-set has injected");

    sts = await studentProfile.set_newPasswordAndSubmit(testdata.weakPassword);
    await assertion.assertEqual(sts.errorStatus, true,
      "A validation error should be raised for the weak password '" + testdata.weakPassword + "'");

    var validation = await studentProfile.getData_passwordValidation();
    await assertion.assertEqual(validation.errorDisplayed, true,
      "The complexity error should be visible, not merely present in the DOM");
    await assertion.assertEqual(normaliseCopy(validation.errorText), testdata.weakPasswordError,
      "The rejection message should read verbatim: '" + testdata.weakPasswordError + "'");
    // The screen-set DOES state the rules, in the strength hint above the field — which
    // answers the manual case's remark that the message does not say what they are.
    await assertion.assertEqual(normaliseCopy(validation.requirementsText), testdata.passwordRequirements,
      "The strength hint should state the actual complexity rules");
    await assertion.assertEqual(normaliseCopy(validation.headingText), testdata.passwordHeading,
      "The screen should still be headed '" + testdata.passwordHeading + "'");
  },

  /**
   * TST_SPRF_TC_11 — the identifier and Location fields are shown but cannot be edited.
   *
   * Run against the CHILD account, where the third field is the Username. On an adult it
   * is the Email address — the same qid (`ed-user-prof-3`), a different field and a
   * different label — so which student this case opens is part of what it tests.
   *
   * Nothing is typed and Update is never clicked: the case proves editability, and
   * clicking Update would rename a real student on a shared school.
   */
  TST_SPRF_TC_11: async function (testdata) {
    sts = await schoolStudents.click_viewStudentProfile(testdata.childUsername);
    await assertion.assertEqual(sts.pageStatus, true, "The child's profile page should load");

    sts = await studentProfile.click_manageAccount();
    await assertion.assertEqual(sts.editDetailsDisplayed, true,
      "'Edit account details' should appear in the Manage account menu");
    sts = await studentProfile.click_editAccountDetails();
    await assertion.assertEqual(sts.pageStatus, true, "The Manage learner profile page should load");
    await assertion.assertEqual(sts.url.indexOf(testdata.editProfileUrlFragment) >= 0, true,
      "Manage learner profile should open at '" + testdata.editProfileUrlFragment + "' — got: " + sts.url);

    var info = await studentProfile.getData_personalInfo();
    await assertion.assertEqual(normaliseCopy(info.headingText), testdata.editProfileHeading,
      "The page should be headed '" + testdata.editProfileHeading + "'");
    await assertion.assertEqual(info.personalInfoTabDisplayed, true, "A 'Personal info' tab should be shown");
    await assertion.assertEqual(info.passwordTabDisplayed, true, "A 'Password' tab should be shown");

    await assertion.assertEqual(info.firstNameEnabled, true, "First name should be editable");
    await assertion.assertEqual(info.lastNameEnabled, true, "Last name should be editable");
    // getAttribute returns the empty string for a valueless boolean attribute, and null
    // when it is absent — so "not null" is the honest check for `required`.
    await assertion.assertEqual(info.firstNameRequired !== null, true, "First name should be required");
    await assertion.assertEqual(info.lastNameRequired !== null, true, "Last name should be required");

    await assertion.assertEqual(info.identifierEnabled, false,
      "The Username field should be disabled and reject input");
    await assertion.assertEqual(normaliseCopy(info.identifierValue), testdata.childUsername,
      "The disabled identifier field should hold the child's username");
    await assertion.assertEqual(info.locationEnabled, false,
      "The Location field should be disabled and reject input");

    // No maxlength on either name field — recorded so nobody writes a boundary case off
    // an assumed limit. If this ever fails, a real limit has appeared and can be measured.
    await assertion.assertEqual(info.firstNameMaxLength, null,
      "First name should carry no maxlength — any length limit here is server-side and unmeasured");
  },

  /**
   * TST_SPRF_TC_15 — Activate stays disabled until an activation code is entered.
   *
   * A NATIVE disabled check is valid on this button: it carries a real `disabled`
   * attribute rather than only a CSS class, which is the exception to the admin-app rule
   * that "disabled" is usually cosmetic (admin-shared.md §B4). Nothing is submitted.
   */
  TST_SPRF_TC_15: async function (testdata) {
    sts = await schoolStudents.click_activateCourseMaterials(testdata.adultEmail);
    await assertion.assertEqual(sts.clickStatus, true,
      "Clicking 'Activate course materials' should succeed");
    await assertion.assertEqual(sts.pageStatus, true, "The activation page should load");

    var page = await studentProfile.getData_activationPage();
    await assertion.assertEqual(page.url.indexOf(testdata.activationUrlFragment) >= 0, true,
      "Activation should open at '" + testdata.activationUrlFragment + "' — got: " + page.url);
    await assertion.assertEqual(normaliseCopy(page.headingText), testdata.activationHeading,
      "The page should be headed '" + testdata.activationHeading + "'");
    await assertion.assertEqual(page.codePlaceholder, testdata.activationPlaceholder,
      "The code field should show the placeholder '" + testdata.activationPlaceholder + "'");
    await assertion.assertEqual(page.submitEnabled, false,
      "'Activate' should be disabled while the code field is empty");
    // The page names the student it is about — worth proving, since the route carries only
    // an opaque user id and picking the wrong student would be invisible otherwise.
    await assertion.assertEqual(String(page.studentPanelText).indexOf(testdata.adultEmail) >= 0, true,
      "The page should name the target student — got: " + page.studentPanelText);

    sts = await studentProfile.set_activationCode(testdata.invalidActivationCode);
    await assertion.assertEqual(sts.setStatus, true, "Typing an activation code should succeed");

    page = await studentProfile.getData_activationPage();
    await assertion.assertEqual(page.codeValue, testdata.invalidActivationCode,
      "The code field should hold what was typed");
    await assertion.assertEqual(page.submitEnabled, true,
      "'Activate' should become enabled once the field has content");
  },

  /**
   * TST_SPRF_TC_16 — an unusable activation code is rejected with an on-screen error.
   *
   * ⚠️ Uses a deliberately unusable code. A VALID code would be CONSUMED — "You can only
   * use each code once", per the page's own copy — and could not be reused by the next run.
   *
   * SLOW BY NATURE: the server takes ~40s to answer (measured 40.3s, 2026-08-28), so this
   * is the longest case in the suite by a wide margin. That is the product, not a stall.
   */
  TST_SPRF_TC_16: async function (testdata) {
    sts = await schoolStudents.click_activateCourseMaterials(testdata.adultEmail);
    await assertion.assertEqual(sts.pageStatus, true, "The activation page should load");

    sts = await studentProfile.set_activationCode(testdata.invalidActivationCode);
    await assertion.assertEqual(sts.setStatus, true, "Typing the unusable code should succeed");

    sts = await studentProfile.click_activate();
    await assertion.assertEqual(sts.clickStatus, true, "Clicking 'Activate' should succeed");
    await assertion.assertEqual(sts.errorStatus, true,
      "An inline error should appear beneath the code field within the measured budget");

    var err = await studentProfile.getData_activationError();
    await assertion.assertEqual(err.errorDisplayed, true, "The error should be visible");
    await assertion.assertEqual(normaliseCopy(err.errorText), normaliseCopy(testdata.invalidCodeError),
      "The error should read verbatim: '" + testdata.invalidCodeError + "'");
  },

  /**
   * TST_SPRF_TC_17 — a class can be launched from the student's profile.
   */
  TST_SPRF_TC_17: async function (testdata) {
    sts = await schoolStudents.click_viewStudentProfile(testdata.childUsername);
    await assertion.assertEqual(sts.pageStatus, true, "The child's profile page should load");

    var layout = await studentProfile.getData_profileLayout();
    await assertion.assertEqual(layout.classEntryCount > 0, true,
      "The fixture student should belong to at least one class — got " + layout.classEntryCount);

    sts = await studentProfile.click_classEntry(0);
    await assertion.assertEqual(sts.clickStatus, true, "Clicking the class name should succeed");
    await assertion.assertEqual(/\/class\/[^/]+\/view\/classdata/.test(sts.url), true,
      "The class page should open at /class/<uuid>/view/classdata — got: " + sts.url);
    // The browser tab title becoming the class name is the manual case's stated outcome.
    await assertion.assertEqual(String(sts.title).indexOf(testdata.childClassName) >= 0, true,
      "The tab title should carry the class name '" + testdata.childClassName + "' — got: " + sts.title);
  },

  /**
   * TST_SPRF_TC_21 — Remove from school account is disabled while nothing is selected.
   *
   * Lives in the SPRF module because it belongs to the removal requirement (#22), but it
   * is read off the Students LIST, so it uses the schoolStudents page object. Natively
   * disabled, verified live — an attribute check, not a CSS-class one.
   */
  TST_SPRF_TC_21: async function () {
    sts = await schoolStudents.getData_studentsTabLayout();
    await assertion.assertEqual(normaliseCopy(sts.selectedCounterText), "0 Selected",
      "The selection counter should read '0 Selected' — got: " + sts.selectedCounterText);
    await assertion.assertEqual(sts.removeBtnEnabled, false,
      "'Remove from school account' should be disabled while no student is selected");
  }
};

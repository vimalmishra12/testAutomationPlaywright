"use strict";
var action = require("../../core/actionLibrary/baseActionLibrary.js");
// Selectors resolved at load time from C1Selectors.json → css.ComproC1.studentProfile
var selectorFile = jsonParserUtil.jsonParser(selectorDir);
var sp = selectorFile.css.ComproC1.studentProfile;

/**
 * Captured by isInitialized() so TST_SPRF_TC_6 can re-open the SAME profile as a deep
 * link without a hard-coded URL. The path embeds the school's org slug, the org UUID and
 * the learner's id, none of which are constants — and the learner id is not exposed
 * anywhere in the Students list, so the only honest way to get one is to open a profile
 * and read where we landed.
 */
var lastProfileUrl = null;

/**
 * The invalid-activation-code round trip is SLOW: measured 40.3s from clicking Activate
 * to the error rendering, on 2026-08-28 (`POST /dashboard/api/activate-accesscode`
 * returns `PEAS_AUTHENTICATION_ERROR`). A 30s probe in an earlier recon pass saw nothing
 * and wrongly looked like "no error is ever shown".
 *
 * 75s is ~1.9x the measurement and, added to the ~15s it takes to reach the page, still
 * leaves >30s of headroom under mocha's 120000 timeout — a poll budget equal to the
 * runner's timeout replaces this method's diagnostic with a generic "Timeout of 120000ms
 * exceeded" (admin-shared.md §B8).
 */
var ACTIVATION_ERROR_TIMEOUT = 75000;

/**
 * The Gigya screen-set on the Password tab takes several seconds to inject itself after
 * the tab is clicked. Measured ~6-9s on 2026-08-28; 45s is a deliberate over-budget
 * because the screen-set is fetched from SAP CDC, not from Thor.
 */
var GIGYA_LOAD_TIMEOUT = 45000;

/**
 * Splits a container's rendered text into trimmed, non-empty lines.
 * The profile renders blank lines between a component's state and its dates, so a naive
 * read keeps them; every caller here wants them gone.
 */
function textLines(raw) {
  if (!raw || raw.message) return [];
  return String(raw).split("\n").map(function (s) { return s.trim(); })
    .filter(function (s) { return s.length > 0; });
}

/** The three — and only three — activation states a component can be in. */
var COMPONENT_STATES = ["Code activated", "Code not activated", "Code expired"];

/**
 * Parses the Course materials section's rendered text into one entry per COMPONENT.
 *
 * WHY parse text rather than walk locators: the component rows carry no id, no qid and no
 * per-row class — a row is `div.row.mb-3` and the state is an unclassed `<span>` inside
 * `div.class-date`. Reading them element-by-element would need an nth() locator per row,
 * which a page object may not build (ADR-003 / AGENTS.md Rule 4). The section's innerText
 * is a single-element read that carries everything, and `getData_userGuide` in
 * schoolStudents.page.js already establishes this pattern.
 *
 * The section reads, verbatim (captured 2026-08-28):
 *
 *   Course materials (1)
 *   <umbrella name>
 *   <component name>
 *   Code expired
 *   Activated: Apr 30, 2025
 *   Expires: Apr 30, 2026
 *   <component name>
 *   Code not activated
 *
 * A line is a COMPONENT NAME only when the next line is one of the three states — which
 * is exactly what separates a component from the umbrella heading above it.
 */
function parseCourseMaterials(lines) {
  var components = [];
  for (var i = 0; i < lines.length; i++) {
    if (COMPONENT_STATES.indexOf(lines[i]) < 0) continue;
    var entry = {
      name: i > 0 ? lines[i - 1] : null,
      state: lines[i],
      activatedDate: null,
      expiresDate: null
    };
    // Dates follow the state and are optional — "Code not activated" carries none.
    for (var j = i + 1; j < lines.length && j <= i + 2; j++) {
      var m = lines[j].match(/^(Activated|Expires):\s*(.+)$/);
      if (!m) break;
      if (m[1] === "Activated") entry.activatedDate = m[2].trim();
      else entry.expiresDate = m[2].trim();
    }
    components.push(entry);
  }
  return components;
}

module.exports = {
  // Resolves to C1Selectors.json → css.ComproC1.studentProfile.*
  profileSection: sp.profileSection,
  profileHeading: sp.profileHeading,
  profileAvatarInitials: sp.profileAvatarInitials,
  profileIdentifier: sp.profileIdentifier,
  profileLastLogin: sp.profileLastLogin,
  backLink: sp.backLink,
  manageAccountDropdown: sp.manageAccountDropdown,
  manageAccountEditDetails: sp.manageAccountEditDetails,
  manageAccountRemove: sp.manageAccountRemove,
  courseMaterialsSection: sp.courseMaterialsSection,
  courseMaterialsHeading: sp.courseMaterialsHeading,
  courseMaterialsUmbrellaTitle: sp.courseMaterialsUmbrellaTitle,
  courseMaterialsComponentRow: sp.courseMaterialsComponentRow,
  classesSection: sp.classesSection,
  classEntryAll: sp.classEntryAll,
  classEntryByIndex: sp.classEntryByIndex,
  editProfileHeading: sp.editProfileHeading,
  editProfileTabPersonalInfo: sp.editProfileTabPersonalInfo,
  editProfileTabPassword: sp.editProfileTabPassword,
  editProfileFirstName: sp.editProfileFirstName,
  editProfileLastName: sp.editProfileLastName,
  editProfileIdentifier: sp.editProfileIdentifier,
  editProfileLocation: sp.editProfileLocation,
  editProfileUpdate: sp.editProfileUpdate,
  passwordNewPasswordInput: sp.passwordNewPasswordInput,
  passwordStrengthRequirements: sp.passwordStrengthRequirements,
  passwordError: sp.passwordError,
  activationHeading: sp.activationHeading,
  activationCodeInput: sp.activationCodeInput,
  activationSubmitBtn: sp.activationSubmitBtn,
  activationErrorMessage: sp.activationErrorMessage,
  activationStudentPanel: sp.activationStudentPanel,

  /**
   * Confirms a student's View profile page has loaded.
   *
   * Anchors on `div.view-profile` — the page-scoping wrapper — and NOT on `h1`. Every
   * admin/class view renders an unclassed heading, so a bare `h1` silently matches the
   * wrong page (admin-shared.md §B9). `h1.user-name` would in fact be specific enough,
   * but the wrapper is the honest page scope and it is also what the HTTP-500 defect
   * fails to render at all, so this is the check that catches it.
   */
  isInitialized: async function () {
    var res;
    await logger.logInto(await stackTrace.get());
    await action.waitForDocumentLoad();
    res = { pageStatus: await action.waitForDisplayed(this.profileSection) };
    if (true === res.pageStatus) lastProfileUrl = await browser.getUrl();
    return res;
  },

  /**
   * Confirms the Manage learner profile page has loaded.
   *
   * A SEPARATE initializer rather than a second page object because all three screens in
   * this flow (profile → Manage learner profile → Activate an access code) belong to the
   * one module, SPRF, and are only ever reached from each other. Anchoring on the
   * FIRST NAME input rather than the `h1`: the heading is `Manage learner profile` on the
   * Personal info tab but changes to `Change learner password` on the Password tab, so
   * the heading is not a stable page anchor here.
   */
  isInitialized_manageLearnerProfile: async function () {
    await logger.logInto(await stackTrace.get());
    await action.waitForDocumentLoad();
    return { pageStatus: await action.waitForDisplayed(this.editProfileFirstName) };
  },

  /**
   * Confirms the individual "Activate an access code" page has loaded.
   * Anchors on the code input — the one control unique to this view.
   */
  isInitialized_activateCode: async function () {
    await logger.logInto(await stackTrace.get());
    await action.waitForDocumentLoad();
    return { pageStatus: await action.waitForDisplayed(this.activationCodeInput) };
  },

  // ── Profile page ─────────────────────────────────────────────────────────────────

  /**
   * One read of everything TST_SPRF_TC_1 / TC_2 assert about a loaded profile.
   *
   * `identifier` holds the EMAIL for an email-based account and the USERNAME for a
   * username-based one — the product uses the same `div.email` node for both (verified on
   * an adult and a child, 2026-08-28), so the class name is misleading and the value is
   * the only signal of account type on this screen.
   *
   * The Manage account menu items are checked with isDisplayed, not presence: both are
   * pre-rendered into the closed dropdown, so a presence check is a guaranteed false
   * green (admin-shared.md §B2).
   */
  getData_profileLayout: async function () {
    await logger.logInto(await stackTrace.get());
    var classesText = (await action.isExisting(this.classesSection))
      ? await action.getText(this.classesSection) : null;
    var classesLines = textLines(classesText);
    return {
      url: await browser.getUrl(),
      headingText: await action.getText(this.profileHeading),
      avatarInitials: await action.getText(this.profileAvatarInitials),
      identifier: await action.getText(this.profileIdentifier),
      lastLogin: await action.getText(this.profileLastLogin),
      backDisplayed: await action.isDisplayed(this.backLink),
      manageAccountDisplayed: await action.isDisplayed(this.manageAccountDropdown),
      manageAccountItemsDisplayedWhileClosed:
        (await action.isDisplayed(this.manageAccountEditDetails)) === true
        || (await action.isDisplayed(this.manageAccountRemove)) === true,
      courseMaterialsHeading: (await action.isExisting(this.courseMaterialsHeading))
        ? String(await action.getText(this.courseMaterialsHeading)).trim() : null,
      // The Classes section has no heading node of its own — its first rendered line IS
      // the heading (verified 2026-08-28), so read the section and take line 0.
      classesHeading: classesLines.length ? classesLines[0] : null,
      classEntryCount: await action.getElementCount(this.classEntryAll)
    };
  },

  /**
   * The Course materials section: its heading count, its umbrella count, and one entry
   * per component with its state and dates.
   *
   * ⚠️ Everything is scoped to `div.course-material-section`. The Classes section BELOW
   * repeats the very same umbrellas and components for each class, so an unscoped read
   * returns every component twice (28 `.bundle-name` nodes for 14 components, measured
   * 2026-08-28) and any count assertion silently doubles.
   */
  getData_courseMaterials: async function () {
    await logger.logInto(await stackTrace.get());
    var headingRaw = (await action.isExisting(this.courseMaterialsHeading))
      ? await action.getText(this.courseMaterialsHeading) : null;
    var heading = headingRaw && !headingRaw.message ? String(headingRaw).trim() : null;
    var m = heading ? heading.match(/\((\d+)\)/) : null;
    var lines = textLines(await action.getText(this.courseMaterialsSection));
    return {
      headingText: heading,
      // "Course materials (N)" counts UMBRELLAS, not components — the single most
      // misread number on this screen (admin-students-tab.md §2).
      headingCount: m ? Number(m[1]) : null,
      umbrellaCount: await action.getElementCount(this.courseMaterialsUmbrellaTitle),
      componentRowCount: await action.getElementCount(this.courseMaterialsComponentRow),
      components: parseCourseMaterials(lines)
    };
  },

  /** The URL of the profile most recently confirmed by isInitialized(). */
  getData_lastProfileUrl: function () {
    return lastProfileUrl;
  },

  /**
   * Opens a profile URL directly (TST_SPRF_TC_6).
   *
   * The profile route IS deep-linkable inside a session whose school context is already
   * set — re-confirmed live 2026-08-28. This is NOT true of the Classes tab, where
   * `/admin/admin/org_<slug>/class` returns `/dashboard/error` unless the school card was
   * clicked first (admin-shared.md §A1), so the two must not be assumed to behave alike.
   */
  open_profileByUrl: async function (url) {
    await logger.logInto(await stackTrace.get(), "url:" + url);
    if (!url) return { pageStatus: "NO_URL_SUPPLIED" };
    await browser.url(url);
    return {
      pageStatus: (await this.isInitialized()).pageStatus,
      url: await browser.getUrl()
    };
  },

  /**
   * Clicks Back and confirms the Students tab is reached.
   * Lazy require, so the two page objects can reference each other without a cycle.
   */
  click_back: async function () {
    await logger.logInto(await stackTrace.get());
    var clickStatus = await action.click(this.backLink);
    if (true !== clickStatus) return { clickStatus: clickStatus };
    var schoolStudents = require("./schoolStudents.page.js");
    return {
      clickStatus: clickStatus,
      url: await browser.getUrl(),
      pageStatus: (await schoolStudents.isInitialized()).pageStatus
    };
  },

  /** Opens the Manage account dropdown and reports what it offers. */
  click_manageAccount: async function () {
    await logger.logInto(await stackTrace.get());
    var clickStatus = await action.click(this.manageAccountDropdown);
    if (true !== clickStatus) return { clickStatus: clickStatus };
    return {
      clickStatus: clickStatus,
      editDetailsDisplayed: await action.waitForDisplayed(this.manageAccountEditDetails),
      removeDisplayed: await action.isDisplayed(this.manageAccountRemove)
    };
  },

  /**
   * Manage account ▾ → Edit account details.
   * Crosses from the `class` microfrontend into `admin`, which is a FULL page load rather
   * than an Angular route change — hence the explicit destination initializer.
   */
  click_editAccountDetails: async function () {
    await logger.logInto(await stackTrace.get());
    var clickStatus = await action.click(this.manageAccountEditDetails);
    if (true !== clickStatus) return { clickStatus: clickStatus };
    return {
      clickStatus: clickStatus,
      pageStatus: (await this.isInitialized_manageLearnerProfile()).pageStatus,
      url: await browser.getUrl()
    };
  },

  /**
   * Launches the class at `index` from the profile's Classes section (TST_SPRF_TC_17).
   *
   * The entries are addressed positionally (`user-profile-2-<n>`) because the class name
   * is repeated across entries on this school — the child fixture lists "sample class"
   * twice — so resolving by content would be ambiguous. Index 0 is therefore the honest
   * choice here, unlike on the Students list where rows must be resolved by content.
   */
  click_classEntry: async function (index) {
    await logger.logInto(await stackTrace.get(), "index:" + index);
    var sel = this.classEntryByIndex.replace("{{n}}", String(index || 0));
    if (!(await action.isExisting(sel))) return { clickStatus: "CLASS_ENTRY_ABSENT:" + sel };
    var clickStatus = await action.click(sel);
    if (true !== clickStatus) return { clickStatus: clickStatus };
    // The class page lives in the `class` microfrontend and renders its own view; wait on
    // the URL settling rather than on a DOM anchor this module does not own.
    await action.waitForUrl(/\/class\/[^/]+\/view\/classdata/, 60000);
    await action.waitForDocumentLoad();
    return {
      clickStatus: clickStatus,
      url: await browser.getUrl(),
      title: await browser.getTitle()
    };
  },

  // ── Manage learner profile — Personal info ───────────────────────────────────────

  /**
   * Field-by-field state of the Personal info tab (TST_SPRF_TC_11).
   *
   * ⚠️ `identifier` is qid `ed-user-prof-3` on BOTH account types but is a different
   * field in each: `#email` ("Email address") on an adult, `#username` ("Username") on a
   * child. The qid is stable, the id is not — so read the qid and let the TC say which
   * label it expected (verified live on both, 2026-08-28).
   *
   * No field on this form carries a `maxlength`, so any length limit is server-side and
   * unmeasured — do not write a boundary case off this (admin-students-tab.md §2).
   */
  getData_personalInfo: async function () {
    await logger.logInto(await stackTrace.get());
    return {
      url: await browser.getUrl(),
      headingText: await action.getText(this.editProfileHeading),
      firstNameValue: await action.getValue(this.editProfileFirstName),
      firstNameEnabled: await action.isEnabled(this.editProfileFirstName),
      firstNameRequired: await action.getAttribute(this.editProfileFirstName, "required"),
      firstNameMaxLength: await action.getAttribute(this.editProfileFirstName, "maxlength"),
      lastNameValue: await action.getValue(this.editProfileLastName),
      lastNameEnabled: await action.isEnabled(this.editProfileLastName),
      lastNameRequired: await action.getAttribute(this.editProfileLastName, "required"),
      identifierValue: await action.getValue(this.editProfileIdentifier),
      identifierEnabled: await action.isEnabled(this.editProfileIdentifier),
      locationValue: await action.getValue(this.editProfileLocation),
      locationEnabled: await action.isEnabled(this.editProfileLocation),
      passwordTabDisplayed: await action.isDisplayed(this.editProfileTabPassword),
      personalInfoTabDisplayed: await action.isDisplayed(this.editProfileTabPersonalInfo)
    };
  },

  // ── Manage learner profile — Password (Gigya screen-set) ─────────────────────────

  /**
   * Opens the Password tab and waits for the Gigya screen-set to inject.
   *
   * Clicking this tab appends a one-time `?pwrt=<token>&apiKey=<key>` to the URL.
   * **Never record a captured token in test data or in a walkthrough.**
   */
  click_passwordTab: async function () {
    await logger.logInto(await stackTrace.get());
    var clickStatus = await action.click(this.editProfileTabPassword);
    if (true !== clickStatus) return { clickStatus: clickStatus };
    return {
      clickStatus: clickStatus,
      // Wait for the ONE VISIBLE new-password field. The screen-set injects ~80 inputs,
      // most of them hidden clones (`password`, `newPassword`, `passwordRetype`,
      // `profile.*`), so a name-based selector here is ambiguous by construction — this
      // is the documented Gigya trap (admin-students-tab.md §4). The id is unique.
      fieldStatus: await action.waitForDisplayed(this.passwordNewPasswordInput, GIGYA_LOAD_TIMEOUT)
    };
  },

  /**
   * Types a password and submits the Gigya form with Enter.
   *
   * ⚠️ Submitted with **Enter, not a click**. The screen-set's `input.gigya-input-submit`
   * ("Update") renders at `opacity: 0.5` inside an animated container and a click on it
   * times out after the full 30s Playwright default — reproduced twice on 2026-08-28.
   * Enter submits the same form immediately.
   *
   * ⚠️ CALLING THIS WITH A VALID PASSWORD CHANGES A REAL STUDENT'S PASSWORD on a shared
   * school. TST_SPRF_TC_9 passes a deliberately weak value, which Gigya rejects
   * client-side without sending anything.
   */
  set_newPasswordAndSubmit: async function (password) {
    await logger.logInto(await stackTrace.get(), "password length:" + String(password || "").length);
    await action.clearValue(this.passwordNewPasswordInput);
    var setStatus = await action.addValue(this.passwordNewPasswordInput, password);
    if (true !== setStatus) return { setStatus: setStatus };
    var keyStatus = await action.pressKey(this.passwordNewPasswordInput, "Enter");
    // Gigya validates client-side and paints the message within a second; 5s is ample
    // and failing fast here is deliberate (admin-shared.md §B8).
    return {
      setStatus: setStatus,
      keyStatus: keyStatus,
      errorStatus: await action.waitForDisplayed(this.passwordError, 5000)
    };
  },

  /**
   * The Gigya validation state.
   *
   * Gigya's error nodes are present but EMPTY until triggered — unlike the Angular
   * dialogs elsewhere in the admin app, their copy cannot be free-captured from the
   * pre-rendered DOM (admin-students-tab.md §4), which is why TST_SPRF_TC_9 has to
   * provoke it.
   */
  getData_passwordValidation: async function () {
    await logger.logInto(await stackTrace.get());
    var errPresent = await action.isExisting(this.passwordError);
    var reqPresent = await action.isExisting(this.passwordStrengthRequirements);
    return {
      errorDisplayed: errPresent ? await action.isDisplayed(this.passwordError) : false,
      errorText: errPresent ? String(await action.getText(this.passwordError)).trim() : null,
      // The strength hint DOES state the rules, which corrects the manual case's remark
      // that "the message does not state what the rules are".
      requirementsText: reqPresent ? String(await action.getText(this.passwordStrengthRequirements)).trim() : null,
      headingText: await action.getText(this.editProfileHeading)
    };
  },

  // ── Individual code activation ───────────────────────────────────────────────────

  /**
   * The "Activate an access code" page as loaded, before anything is typed.
   *
   * `submitEnabled` is a NATIVE disabled check and that is valid here: the button carries
   * a real `disabled` attribute, not merely a CSS class (verified 2026-08-28), which is
   * the exception to the admin-app rule in admin-shared.md §B4.
   */
  getData_activationPage: async function () {
    await logger.logInto(await stackTrace.get());
    return {
      url: await browser.getUrl(),
      headingText: String(await action.getText(this.activationHeading)).trim(),
      codeInputDisplayed: await action.isDisplayed(this.activationCodeInput),
      codePlaceholder: await action.getAttribute(this.activationCodeInput, "placeholder"),
      codeValue: await action.getValue(this.activationCodeInput),
      submitEnabled: await action.isEnabled(this.activationSubmitBtn),
      studentPanelText: (await action.isExisting(this.activationStudentPanel))
        ? textLines(await action.getText(this.activationStudentPanel)).join(" | ") : null
    };
  },

  /** Types an activation code without submitting it (TST_SPRF_TC_15). */
  set_activationCode: async function (code) {
    await logger.logInto(await stackTrace.get(), "code:" + code);
    await action.clearValue(this.activationCodeInput);
    return { setStatus: await action.addValue(this.activationCodeInput, code) };
  },

  /**
   * Submits the entered activation code and waits for the outcome.
   *
   * ⚠️ A VALID code is CONSUMED — "You can only use each code once", per the page's own
   * copy. TST_SPRF_TC_16 submits a deliberately unusable code, which consumes nothing.
   *
   * Waits on the ERROR NODE, not on the button leaving its loading state: while the
   * request is in flight the button renders the untranslated key
   * `SCREEN_READER.PROCESSING_MESSAGE` (an open defect, see TST_SBLK_TC_10's class of
   * problem), so the button's own text is not a signal worth waiting on.
   */
  click_activate: async function () {
    await logger.logInto(await stackTrace.get());
    var clickStatus = await action.click(this.activationSubmitBtn);
    if (true !== clickStatus) return { clickStatus: clickStatus };
    return {
      clickStatus: clickStatus,
      errorStatus: await action.waitForDisplayed(this.activationErrorMessage, ACTIVATION_ERROR_TIMEOUT)
    };
  },

  /** The inline error shown beneath the activation code field. */
  getData_activationError: async function () {
    await logger.logInto(await stackTrace.get());
    var present = await action.isExisting(this.activationErrorMessage);
    return {
      errorDisplayed: present ? await action.isDisplayed(this.activationErrorMessage) : false,
      errorText: present ? String(await action.getText(this.activationErrorMessage)).trim() : null,
      submitEnabled: await action.isEnabled(this.activationSubmitBtn)
    };
  }
};

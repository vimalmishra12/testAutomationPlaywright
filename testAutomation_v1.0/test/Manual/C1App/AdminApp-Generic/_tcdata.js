/**
 * Source of truth for the AdminApp Generic (shell) manual test-case set.
 * Both the .md document and the .xlsx register are generated from this file, so they
 * cannot drift (SKILL golden rule 6).
 *
 * RE-SCOPED 2026-08-27 after an existing-coverage audit. The first draft duplicated
 * automation that already exists; this set covers only the genuine gaps.
 *
 * Module codes REUSE the existing page objects wherever the markup is shared:
 *   FOOT — footer.page.js / footer.test.js        already TST_FOOT_TC_1..9  → extend from TC_10
 *   INVI — invitationNotification.page.js         already TST_INVI_TC_1..6  → extend from TC_7
 *   ASHL — NEW, the NEMO admin shell header       (see the module-code note in _generate.js)
 *   APRF — adminProfile.page.js                   no cases yet, not grounded
 */

const PRE_IN =
  'Logged in as school-admin <ADMIN_USER> on Thor; "My school accounts" (/admin/admin/dashboard) displayed.';

const REQS = [
  /* Batch A — shell chrome */
  '#1 — Verify Spanish view',
  '#2 — Verify My Profile',
  '#3 — Verify notifications',
  '#7 — Verify Help',
  '#8 — Verify footer link',
  '#11 — Verify different tab navigation',
  /* Batch B — school context */
  '#4 — Verify Change school key for normal school',
  '#5 — Verify non mqa admin should not see cqa/mqa product',
  '#10 — Admin part of multiple org',
  '#12 — Verify viewing multiple schools',
  /* Batch C — cross-app */
  '#6 — Verify launch of Cambridge one for schools and create institution request',
  '#9 — Verify various errors in forms and modals',
  '#13 — Verify Admin is able to switch to teacher view',
  '#14 — Verify admin is able to create a new class in teacher view and view that class in Admin classes tab',
];

const PRE_DASH =
  'Logged in as school-admin <ADMIN_USER> on Thor; "My school accounts" (/admin/admin/dashboard) displayed.';
const PRE_SCHOOL =
  'Logged in as school-admin <ADMIN_USER> on Thor; a school opened from "My school accounts" so the '
  + 'school context is set; Classes tab displayed.';

const TCS = [
  /* ---------------------------------------------- #1 Verify Spanish view */
  {
    id: 'TST_ASHL_TC_1',
    title: 'Verify the language control offers English and Español with the active language marked as selected',
    req: '#1 — Verify Spanish view',
    type: 'Positive',
    priority: 'High',
    pre: PRE_IN,
    steps: '1. Click the site-language control (labelled "English") in the footer.\n2. Observe the options.',
    data: '—',
    expected:
      'Exactly TWO options are offered, in this order: "English", then "Español".\n'
      + 'The active language ("English") is visually marked as the selected option, and the control\'s '
      + 'accessible name reads "Site language, English".',
    remarks:
      'Grounded live 2026-08-27 from the pre-rendered DOM. Control qid "sp-ldd-cntr"; options '
      + '"sp-ldd-btn-en" and "sp-ldd-btn-es". Selection is marked by the CSS class "selected-item" on the '
      + 'active option — that class, not styling, is the reliable check. '
      + 'The control appears in the HEADER when logged out and the FOOTER when logged in. '
      + 'DISTINCT FROM TST_LAND_TC_4, which covers the same control on the LANDING page — this case is the '
      + 'admin-app instance.',
  },
  {
    id: 'TST_ASHL_TC_2',
    title: 'Verify the admin interface renders in Spanish when Español is selected',
    req: '#1 — Verify Spanish view',
    type: 'Positive',
    priority: 'High',
    pre: PRE_IN,
    steps:
      '1. Click the site-language control.\n'
      + '2. Select "Español".\n'
      + '3. Observe the "My school accounts" heading, the footer links and the Administrator/Teacher toggle.\n'
      + '4. Reload the page.\n'
      + '5. Switch back to "English".',
    data: 'Expected Spanish strings: to be added to appLangES.json once captured (see Remarks).',
    expected:
      '[ASSUMED] After step 2 the admin interface re-renders in Spanish: the "My school accounts" heading, '
      + 'the footer links and the role toggle all show Spanish copy, and the language control now reads '
      + '"Español" with "Español" marked selected.\n'
      + '[ASSUMED] After step 4 the Spanish selection PERSISTS across the reload.\n'
      + 'After step 5 the interface returns to English.',
    remarks:
      '⚠️ NOT GROUNDED — no admin-app Spanish copy has been verified. '
      + 'GENUINE GAP: appLangES.json exists but contains only "landing" and "login" sections — it has NO '
      + 'admin-app or footer entries, so the strings this case needs do not exist yet anywhere. '
      + 'When captured they should be added to appLangES.json under a new admin section, matching the '
      + 'existing appLangEN.json pattern. '
      + 'Whether the choice persists per-account server-side (as the class Filter and Search do, '
      + 'admin-shared.md §A4) or only for the session is specifically unknown. '
      + 'CHANGES ACCOUNT STATE: switches the language and must switch it back (step 5).',
  },

  /* -------------------------------------------------- #2 Verify My Profile */
  {
    id: 'TST_MYPR_TC_1',
    title: 'Verify the Manage profile page opens with both tabs when My profile is selected from the header menu',
    req: '#2 — Verify My Profile',
    type: 'Positive',
    priority: 'High',
    pre: PRE_IN,
    steps:
      '1. Click the account name ("Test") in the page header.\n'
      + '2. Observe the items in the dropdown.\n'
      + '3. Click "My profile".',
    data: '—',
    expected:
      'After step 2 the dropdown shows exactly three items: the account name, "My profile", "Log out".\n'
      + 'After step 3 the browser navigates to /dashboard/my-profile, the browser tab reads '
      + '"My profile | Cambridge One", and the page heading reads "Manage profile".\n'
      + 'Two tabs are shown: "Personal info" (active by default) and "Password".\n'
      + 'A "Back" control is present.',
    remarks:
      'GROUNDED LIVE 2026-08-27 (user-driven navigation, agent DOM read). '
      + '⚠️ THREE DIFFERENT NAMES for one page: the menu says "My profile", the browser tab says '
      + '"My profile | Cambridge One", the heading says "Manage profile". Assert the heading, not the '
      + 'menu label. '
      + 'Selectors: menu trigger qid "aHeader-3" (id "dropdownMenuLinkHeader"); item "aHeader-6"; '
      + 'tabs "c-mp-tab-1" / "c-mp-tab-2"; Back "c-mp-btn-1". '
      + 'NOTE the URL is /dashboard/my-profile — NOT under /admin/. This is the shared Cambridge One '
      + 'profile page, so a change here affects teachers and students too.',
  },
  {
    id: 'TST_MYPR_TC_2',
    title: 'Verify the Personal info tab shows the four account fields pre-filled with the current values',
    req: '#2 — Verify My Profile',
    type: 'Positive',
    priority: 'High',
    pre: PRE_IN + ' Manage profile open on the "Personal info" tab.',
    steps: '1. Observe the fields on the Personal info tab and their values.\n2. Observe the buttons.',
    data: '—',
    expected:
      'Four editable text fields are shown, labelled and pre-filled from the account:\n'
      + '1. "First name"  2. "Last name"  3. "Email"  4. "Location"\n'
      + 'Two controls are present: "Update" and "Cancel".\n'
      + 'Observed 2026-08-27 for <ADMIN_USER>: First name "Test", Last name "T1", '
      + 'Email "testt1@mailsac.com", Location "India".',
    remarks:
      'GROUNDED LIVE 2026-08-27. Field qids "c-mp-inpt-1".."c-mp-inpt-4"; Update "c-mp-btn-3"; '
      + 'Cancel "c-mp-btn-4". Underlying Gigya names: profile.firstName / profile.lastName / '
      + 'profile.email / profile.country. '
      + '⚠️ The "Location" field has THREE identities — label "Location", name "profile.country", '
      + 'HTML id "gigya-textbox-zip" (zip, i.e. postcode). It behaves as a country ("India"). Select it '
      + 'by qid, and do not infer its meaning from the id. '
      + 'VALUES ARE ACCOUNT-SPECIFIC — use <ADMIN_USER> placeholders, never the literals above '
      + '(admin-shared.md §A5).',
  },
  {
    id: 'TST_MYPR_TC_3',
    title: 'Verify the Password tab shows the three password fields when it is selected',
    req: '#2 — Verify My Profile',
    type: 'Positive',
    priority: 'High',
    pre: PRE_IN + ' Manage profile open.',
    steps: '1. Click the "Password" tab.\n2. Observe the fields and buttons.',
    data: '—',
    expected:
      'Three password fields are shown, in this order:\n'
      + '1. "Old password"  2. "New password"  3. "Confirm new password"\n'
      + 'Two controls are present: "Update" and "Cancel".\n'
      + 'All three inputs mask their content (type=password).',
    remarks:
      'GROUNDED LIVE 2026-08-27. Field qids "c-mp-inpt-5".."c-mp-inpt-7"; Update "c-mp-btn-5". '
      + 'Gigya names: password / newPassword / passwordRetype. '
      + '⚠️ The URL does NOT change between tabs — both are /dashboard/my-profile. The Password tab '
      + 'therefore CANNOT be deep-linked, and the active tab cannot be asserted from the URL. '
      + 'Combined with the missing aria-selected (TST_MYPR_TC_8) there is currently NO reliable '
      + 'attribute identifying the active tab — automation must assert on the visible fields instead.',
  },
  {
    id: 'TST_MYPR_TC_4',
    title: 'Verify Back returns to the previous page without saving when it is clicked',
    req: '#2 — Verify My Profile',
    type: 'Positive',
    priority: 'Medium',
    pre: PRE_IN + ' Manage profile open on the "Personal info" tab.',
    steps:
      '1. Change the "First name" field to a different value.\n'
      + '2. Do NOT click Update.\n'
      + '3. Click "Back".\n'
      + '4. Return to Manage profile and inspect "First name".',
    data: 'First name: "<ORIGINAL_FIRST_NAME>" changed to "AutoProfile_Temp"',
    expected:
      '[ASSUMED] After step 3 the previous page is shown and no change is saved.\n'
      + '[ASSUMED] After step 4 "First name" still holds its original value.',
    remarks:
      '⚠️ EXPECTED RESULT NOT VERIFIED — the edit-then-leave path was not exercised. '
      + 'Specifically UNKNOWN: whether an unsaved-changes confirmation appears. admin-shared.md §A6 '
      + 'records a pre-rendered "Save changes?" dialog on the OTHER app\'s Manage learner profile, and '
      + 'the create-classes form auto-saves a draft (§A4) — so BOTH "silently discards" and "prompts" '
      + 'are plausible here. Do not assume; capture what happens. '
      + 'Back qid "c-mp-btn-1". CHANGES ACCOUNT STATE only if Update is pressed, which this case avoids.',
  },
  {
    id: 'TST_MYPR_TC_5',
    title: 'Verify an over-long first name is handled correctly when no client-side limit exists',
    req: '#2 — Verify My Profile',
    type: 'Edge',
    priority: 'Medium',
    pre: PRE_IN + ' Manage profile open on the "Personal info" tab. USE A DISPOSABLE ACCOUNT.',
    steps:
      '1. Clear "First name".\n'
      + '2. Type a 300-character value.\n'
      + '3. Observe whether the field truncates the input as it is typed.\n'
      + '4. Click "Update".',
    data: 'First name: 300 repetitions of "a"',
    expected:
      'After step 3 the field accepts all 300 characters — there is NO client-side truncation.\n'
      + '[ASSUMED] After step 4 the server rejects the value with a validation message, or accepts and '
      + 'truncates it. Capture which, and the exact message.',
    remarks:
      'GROUNDED PARTIALLY 2026-08-27: the ABSENCE of a limit is verified — ALL SEVEN fields across both '
      + 'tabs have maxlength=null and none is marked required. What the SERVER does is [ASSUMED]. '
      + 'This is a deliberate departure from the rest of the admin app, where limits are declared and '
      + 'enforced client-side (class name 50, grading scale title 20 — admin-shared.md §A3). Because '
      + 'nothing is declared here, boundary cases CANNOT be derived from the markup and must be found '
      + 'by submitting. '
      + '⚠️ DO NOT RUN ON <ADMIN_USER> — that account is the login for the whole admin suite. Blocked '
      + 'until a disposable account exists.',
  },
  {
    id: 'TST_MYPR_TC_6',
    title: 'Verify an error is shown when the new password and its confirmation do not match',
    req: '#2 — Verify My Profile',
    type: 'Negative',
    priority: 'High',
    pre: PRE_IN + ' Manage profile open on the "Password" tab. USE A DISPOSABLE ACCOUNT.',
    steps:
      '1. Enter the correct current password in "Old password".\n'
      + '2. Enter a valid new password in "New password".\n'
      + '3. Enter a DIFFERENT value in "Confirm new password".\n'
      + '4. Click "Update".',
    data: 'Old: <VALID_PASSWORD> · New: "Compro@2026" · Confirm: "Compro@2027"',
    expected:
      '[ASSUMED] The password is NOT changed and a mismatch validation message is shown against the '
      + 'confirmation field.',
    remarks:
      '⚠️ ERROR COPY NOT CAPTURED — nothing was submitted, by agreement, because <ADMIN_USER> is the '
      + 'admin suite\'s login account. The message text must be captured on a disposable account. '
      + 'For reference the equivalent page in the other app exposes a dedicated error element '
      + '("confirmPasswordError_text" in the SETT selector set), so a field-level message is expected '
      + 'here too — but that is the OTHER app and must not be assumed identical. '
      + 'DESTRUCTIVE IF IT SUCCEEDS: a mistyped variant of this case would change a real password.',
  },
  {
    id: 'TST_MYPR_TC_7',
    title: 'Verify an error is shown when the old password is incorrect',
    req: '#2 — Verify My Profile',
    type: 'Negative',
    priority: 'High',
    pre: PRE_IN + ' Manage profile open on the "Password" tab. USE A DISPOSABLE ACCOUNT.',
    steps:
      '1. Enter an INCORRECT value in "Old password".\n'
      + '2. Enter a valid new password in both "New password" and "Confirm new password".\n'
      + '3. Click "Update".',
    data: 'Old: "WrongPassword123" · New / Confirm: "Compro@2026"',
    expected:
      '[ASSUMED] The password is NOT changed and an error identifies the old password as incorrect.',
    remarks:
      '⚠️ ERROR COPY NOT CAPTURED — see TST_MYPR_TC_6. The SETT selector set has a matching '
      + '"currentPasswordError_text" element in the other app. '
      + 'Worth checking whether repeated failures lock the account, which would affect suite design.',
  },
  {
    id: 'TST_MYPR_TC_8',
    title: 'Verify the active profile tab is identifiable to assistive technology',
    req: '#2 — Verify My Profile',
    type: 'Negative',
    priority: 'Medium',
    pre: PRE_IN + ' Manage profile open.',
    steps:
      '1. Inspect the "Personal info" and "Password" tab controls.\n'
      + '2. Check for a tab role and a selected-state attribute.\n'
      + '3. Switch tabs and re-check.',
    data: '—',
    expected:
      'Each tab exposes an appropriate role and a selected state, so assistive technology can announce '
      + 'which tab is active.\n'
      + 'ACTUAL (2026-08-27): this FAILS. Both are plain <a> elements with NO role="tab" and NO '
      + 'aria-selected. Nothing in the markup or the URL identifies the active tab.',
    remarks:
      'GROUNDED LIVE 2026-08-27. Raised as a case because it is both an accessibility gap and an '
      + 'automation blocker: with no aria-selected AND no URL change between tabs (TST_MYPR_TC_3), '
      + 'there is no attribute to assert the active tab on — automation must fall back to checking '
      + 'which fields are visible. '
      + 'Confirm with the product team whether this should be raised as a defect. '
      + 'Tab qids "c-mp-tab-1" (Personal info) and "c-mp-tab-2" (Password).',
  },

  /* ---------------------------------------------- #3 Verify notifications */
  {
    id: 'TST_INVI_TC_7',
    title: 'Verify the notifications bell badge and its accessible name report the same unread count',
    req: '#3 — Verify notifications',
    type: 'Positive',
    priority: 'High',
    pre: PRE_IN,
    steps: '1. Observe the notifications bell in the page header.\n2. Read its badge and its accessible name.',
    data: '—',
    expected:
      'The bell shows a numeric badge with the unread count, and its accessible name mirrors that same '
      + 'count in the form "Notifications (<N> unread notifications)".\n'
      + 'Observed 2026-08-27: badge "92", accessible name "Notifications (92 unread notifications)".',
    remarks:
      'Grounded live 2026-08-27. EXTENDS the existing INVI module — invitationNotification.page.js already '
      + 'targets this same control as "notificationBtn" (#tippyDropdownMenuButton) and TST_INVI_TC_1 clicks '
      + 'it. What INVI does NOT cover is the badge/accessible-name agreement, which is this case. '
      + 'Bell qid "ntf-1"; wrapper ".notification-dropdown". '
      + 'The COUNT is volatile — assert that badge and accessible name AGREE, never a literal 92 '
      + '(admin-shared.md §A5: never assert an absolute count on a shared account).',
  },
  {
    id: 'TST_INVI_TC_8',
    title: 'Verify the notifications panel opens with a heading, time-grouped rows and a close control',
    req: '#3 — Verify notifications',
    type: 'Positive',
    priority: 'High',
    pre: PRE_IN,
    steps:
      '1. Click the notifications bell.\n'
      + '2. Observe the panel heading.\n'
      + '3. Observe the time-group headings and the notification rows beneath each.\n'
      + '4. Observe the control at the foot of the panel.\n'
      + '5. Click the "×" close control.',
    data: '—',
    expected:
      'A panel opens anchored to the bell:\n'
      + '1. Heading reads "Notifications (<N>)", where <N> matches the bell badge.\n'
      + '2. Rows are grouped under time headings — "Last Seven days" and "Older".\n'
      + '3. Each row shows a title, a body line and a date.\n'
      + '4. A "See older notifications" link sits at the foot of the panel.\n'
      + '5. A "×" control labelled "Close" dismisses the panel.\n'
      + 'Observed 2026-08-27: heading "Notifications (92)" matching the badge; both time groups present.',
    remarks:
      'GROUNDED LIVE 2026-08-27 — the panel was opened manually and read in full, resolving the earlier '
      + '[ASSUMED] version of this case. '
      + 'GENUINE GAP: TST_INVI_TC_1..6 cover the INVITATION-ACCEPT flow reached through this bell '
      + '(invitationNotify → selectCheckbox → acceptBtn → goToDashboard); they do NOT cover this panel. '
      + 'Selectors: panel ".notification-dropdown"; heading ".notification-heading" h2 with span.readCount; '
      + 'time groups "p.time-related-title"; rows "button.tippy-dropdown-item"; footer link qid "ntf-4". '
      + '⚠️ The close "×" carries qid "ntf-2" on TWO visible elements (".close" and ".close-dummy") — '
      + 'address it by class, not qid. Same trap shape as cFooter-9. '
      + 'NOT pre-rendered — built lazily by tippy.js, so it must actually be opened (admin-shared.md §A6 '
      + 'does not apply here). '
      + 'The EMPTY state was not seen — this account has 92 notifications. [ASSUMED] and still open.',
  },
  {
    id: 'TST_INVI_TC_9',
    title: 'Verify the panel renders only the five most recent notifications when many are unread',
    req: '#3 — Verify notifications',
    type: 'Edge',
    priority: 'Medium',
    pre: PRE_IN + ' The account has many unread notifications (92 at capture).',
    steps:
      '1. Click the notifications bell.\n'
      + '2. Count the notification rows rendered in the panel.\n'
      + '3. Compare that count with the number in the panel heading.\n'
      + '4. Observe the "See older notifications" link.',
    data: '—',
    expected:
      'The panel renders exactly FIVE notification rows, even though the heading reports 92.\n'
      + 'The panel does NOT scroll to reveal more — the remainder are reached only through '
      + '"See older notifications".',
    remarks:
      'Grounded live 2026-08-27: 5 rows rendered against a heading of "Notifications (92)", and the panel '
      + 'body was not scrollable (scrollHeight === clientHeight). '
      + '⚠️ The row qids are POSITIONAL and start at 30 — "ntf-30" … "ntf-34" — not at 1. Do not infer the '
      + 'base index; look rows up by text or by position within ".notification-items-wrapper" '
      + '(admin-shared.md §B3). '
      + 'Whether five is a fixed cap or a page size is [ASSUMED] — confirm by clicking "See older '
      + 'notifications", which was not followed in this session.',
  },
  {
    id: 'TST_INVI_TC_10',
    title: 'Verify recent notifications show a relative date and older ones show an absolute date',
    req: '#3 — Verify notifications',
    type: 'Edge',
    priority: 'Medium',
    pre: PRE_IN + ' The account has notifications both within and beyond the last seven days.',
    steps:
      '1. Click the notifications bell.\n'
      + '2. Read the date on a row under "Last Seven days".\n'
      + '3. Read the date on a row under "Older".',
    data: '—',
    expected:
      'Rows under "Last Seven days" show a RELATIVE date, e.g. "5 days ago".\n'
      + 'Rows under "Older" show an ABSOLUTE date in the format "Ddd, DD Mmm, YYYY", '
      + 'e.g. "Mon, 17 Aug, 2026".',
    remarks:
      'Grounded live 2026-08-27 — both formats observed in the same panel. '
      + 'This is worth pinning because a single date-format assertion across all rows will fail: the '
      + 'format depends on which time group the row falls in. '
      + 'The exact boundary between the two groups is [ASSUMED] to be seven days from the group heading '
      + 'wording; it was not tested at the boundary.',
  },
  {
    id: 'TST_INVI_TC_11',
    title: 'Verify report-ready notifications describe the Reports destination consistently',
    req: '#3 — Verify notifications',
    type: 'Negative',
    priority: 'Low',
    pre: PRE_IN + ' The account has both "Class summary" and "Aggregated data" report-ready notifications.',
    steps:
      '1. Click the notifications bell.\n'
      + '2. Read the body line of a "Your Class summary report is ready" row.\n'
      + '3. Read the body line of a "Your Aggregated data report is ready" row.',
    data: '—',
    expected:
      'Both notifications refer to the same destination in the same words.\n'
      + 'ACTUAL (2026-08-27): they do NOT. Class summary reads '
      + '"View your report, available to download in the Reports tab", while Aggregated data reads '
      + '"View your report, available to download on the Reports page" — "Reports tab" vs "Reports page".',
    remarks:
      'Grounded live 2026-08-27, both strings captured verbatim from the same open panel. '
      + 'A low-severity copy inconsistency, raised as a case so it is not rediscovered during automation '
      + 'and so any verbatim-copy assertion is written against the correct string per notification type. '
      + 'Confirm with the product team whether this is intended before raising a ticket. '
      + 'Full failure copy also captured: "Sorry, something went wrong. The <TYPE> report you requested '
      + 'failed to generate. Details available in the Reports tab".',
  },

  /* ------------------------------------------------------- #7 Verify Help */
  {
    id: 'TST_ASHL_TC_3',
    title: 'Verify the admin header Help menu exposes Help centre and Tutorials when it is opened',
    req: '#7 — Verify Help',
    type: 'Positive',
    priority: 'High',
    pre: PRE_IN,
    steps: '1. Click "Help" in the page header.\n2. Observe the items in the open dropdown.',
    data: '—',
    expected:
      'The Help dropdown opens and contains exactly two items, in this order:\n'
      + '1. "Help centre"\n'
      + '2. "Tutorials" (itself a submenu)',
    remarks:
      'Grounded live 2026-08-27 by reading the pre-rendered DOM (admin-shared.md §A6). '
      + 'Trigger qid "cHeader-hlp-2" (id "hdr-help-dd"); items "cHeader-hlp-3" (Help centre) and '
      + '"cHeader-hlp-5" (Tutorials, id "dropdownMenuButtonUserTutorials"). '
      + 'GENUINE GAP: TST_FOOT_TC_8 covers the FOOTER Help link and TST_DASH_TC_2 covers a Help button on '
      + 'the C1 Dashboard — neither covers this admin HEADER Help MENU and its two items. '
      + 'Item labels are verified; the dropdown was never opened interactively, so the open/close behaviour '
      + 'is [ASSUMED].',
  },
  {
    id: 'TST_ASHL_TC_4',
    title: 'Verify the Tutorials submenu lists all five tutorial topics when it is expanded',
    req: '#7 — Verify Help',
    type: 'Positive',
    priority: 'Medium',
    pre: PRE_IN,
    steps: '1. Click "Help" in the page header.\n2. Click "Tutorials".\n3. Observe the listed tutorial topics.',
    data: '—',
    expected:
      'Exactly five tutorial topics are listed, with these titles verbatim:\n'
      + '1. "Understanding codes and keys"\n'
      + '2. "Activating course materials"\n'
      + '3. "Creating a class"\n'
      + '4. "Adding students to a class"\n'
      + '5. "Creating assignments"',
    remarks:
      'Titles grounded live 2026-08-27 from the pre-rendered DOM. '
      + '⚠️ All five share the SINGLE qid "cHeader-hlp-6" — when automated they must be addressed by text '
      + 'or index, never by qid. Same trap class as "t-prd-cmp-cntr-1" (admin-shared.md §B3), and the same '
      + 'shape as the cFooter-9 duplication the footer selectors already work around with an aria-label '
      + 'qualifier. '
      + 'What each topic OPENS was not captured — [ASSUMED] and out of scope for this case.',
  },

  /* --------------------------------------- #11 Verify different tab navigation */
  {
    id: 'TST_ASHL_TC_5',
    title: 'Verify all five school tabs are shown with Classes active when a school is opened',
    req: '#11 — Verify different tab navigation',
    type: 'Positive',
    priority: 'High',
    pre: PRE_IN,
    steps:
      '1. Click a school card on "My school accounts".\n'
      + '2. Observe the tab strip and which tab is active.\n'
      + '3. Observe the page heading and the browser tab title.',
    data: 'School: "3 July Test School 1" (<SCHOOL_KEY>)',
    expected:
      'Exactly FIVE tabs are shown, in this order and in upper case:\n'
      + 'CLASSES · STUDENTS · STAFF · LIBRARY · REPORTS\n'
      + '"CLASSES" is the active tab by default, the page heading shows the school name, and the '
      + 'browser tab reads "Classes | Cambridge One".',
    remarks:
      'GROUNDED LIVE 2026-08-27. Tab qids "aDetail-1" (Classes), "aDetail-2" (Students), '
      + '"aDetail-4" (Staff), "aDetail-5" (Library), "aDetail-6" (Reports). '
      + '⚠️ "aDetail-3" IS SKIPPED — the sequence is 1,2,4,5,6. Do not iterate 1..5 assuming contiguity. '
      + '⚠️ THE ACTIVE MARKER IS ON THE PARENT <li>, not the anchor: "li.nav-item.active > a". The '
      + 'anchor className is identical on every tab whether active or not, so asserting on the link '
      + 'class is a guaranteed false green. '
      + 'Labels render UPPER CASE — confirm whether that is CSS text-transform or the actual text '
      + 'before asserting case-sensitively.',
  },
  {
    id: 'TST_ASHL_TC_6',
    title: 'Verify each tab loads its own page and becomes the active tab when it is selected',
    req: '#11 — Verify different tab navigation',
    type: 'Positive',
    priority: 'High',
    pre: PRE_IN + ' A school is open on the Classes tab.',
    steps:
      '1. Click "STUDENTS" and note the URL, title and active tab.\n'
      + '2. Repeat for "STAFF", "LIBRARY", "REPORTS", then "CLASSES".',
    data: 'School slug: org_<SCHOOL_SLUG>',
    expected:
      'Each tab navigates to its own URL, sets its own browser-tab title, and becomes the active tab:\n'
      + '| Tab | URL suffix | Title |\n'
      + '| CLASSES | /class | "Classes \\| Cambridge One" |\n'
      + '| STUDENTS | /learner | "Students \\| Cambridge One" |\n'
      + '| STAFF | /staff | "Staff \\| Cambridge One" |\n'
      + '| LIBRARY | /library | "Library \\| Cambridge One" |\n'
      + '| REPORTS | /reports | "Reports \\| Cambridge One" |\n'
      + 'The school heading stays unchanged throughout.',
    remarks:
      'GROUNDED LIVE 2026-08-27 — all five walked and every URL and title confirmed. '
      + '⚠️ NOTE the STUDENTS tab routes to "/learner", NOT "/student". A URL assertion built from the '
      + 'tab label will fail on this one. '
      + 'Tabs carry REAL hrefs (unlike the footer, whose logged-in hrefs collapse to javascript:void(0) '
      + '— TST_FOOT_TC_10 remarks), so tab navigation is genuinely href-driven. '
      + 'TIMING measured this session: Reports took ~4.3 s to become active, Classes ~1.2 s. Poll for '
      + '"li.nav-item.active > a" carrying the expected qid rather than using a fixed pause '
      + '(admin-shared.md §B8).',
  },
  {
    id: 'TST_ASHL_TC_7',
    title: 'Verify the active school tab is identifiable to assistive technology',
    req: '#11 — Verify different tab navigation',
    type: 'Negative',
    priority: 'Medium',
    pre: PRE_IN + ' A school is open.',
    steps:
      '1. Inspect each tab link for an aria-current or selected-state attribute.\n'
      + '2. Switch tabs and re-inspect.',
    data: '—',
    expected:
      'The active tab exposes an accessible current/selected state, so assistive technology can '
      + 'announce which section the user is in.\n'
      + 'ACTUAL (2026-08-27): this FAILS. No tab link carries aria-current or aria-selected; the only '
      + 'indicator is the "active" CSS class on the parent <li>, which is presentational.',
    remarks:
      'GROUNDED LIVE 2026-08-27. '
      + 'This is the SECOND instance of the same gap in this batch — the My Profile tabs have it too '
      + '(TST_MYPR_TC_8). Worth raising as one combined accessibility ticket rather than two. '
      + 'The school tabs are at least recoverable for automation via "li.nav-item.active"; the profile '
      + 'tabs have no indicator at all, which makes them the more severe of the two.',
  },

  /* ------------------------------------------------ #8 Verify footer link */
  {
    id: 'TST_FOOT_TC_10',
    title: 'Verify the admin footer renders seven links and omits Site Feedback',
    req: '#8 — Verify footer link',
    type: 'Edge',
    priority: 'Medium',
    pre: PRE_IN,
    steps: '1. Scroll to the bottom of an admin page.\n2. List every link rendered in the footer.',
    data: '—',
    expected:
      'The admin footer renders exactly SEVEN links:\n'
      + '"Terms of use" · "Privacy notice" · "Accessibility" · "Our approach" · "FAQs" · '
      + '"Cambridge One for schools" · "Help"\n'
      + 'plus the site-language control and the copyright line '
      + '"© Cambridge University Press & Assessment 2026".\n'
      + '"Site Feedback" (qid cFooter-4) is NOT rendered in the admin app.',
    remarks:
      'Grounded live 2026-08-27 on /admin/admin/dashboard. '
      + 'EXTENDS the existing FOOT module (TST_FOOT_TC_1..9, footer.test.js) rather than duplicating it — '
      + 'those nine cases already validate each footer page launches correctly, and this batch adds no '
      + 'per-link cases. '
      + 'GENUINE GAP: the FOOT selector set includes "footerSiteFeedback" (a[qid="cFooter-4"]), so the C1 '
      + 'footer carries EIGHT links, but the ADMIN footer renders only seven — Site Feedback is absent. '
      + 'Nothing currently pins that difference, so a shared-footer change could silently add or remove it. '
      + 'The copyright YEAR is dynamic — assert the pattern, not the literal 2026.',
  },

  /* ======================= BATCH B — school context ======================= */

  /* ------------------------ #4 Verify Change school key for normal school */
  {
    id: 'TST_SKEY_TC_1',
    title: 'Verify the School settings menu exposes Change school key alongside the grading options',
    req: '#4 — Verify Change school key for normal school',
    type: 'Positive',
    priority: 'High',
    pre: PRE_SCHOOL,
    steps: '1. Click "School settings" on the Classes tab.\n2. Observe the items in the open menu.',
    data: '—',
    expected:
      'The menu opens and contains exactly three items:\n'
      + '1. "Change school key"\n'
      + '2. "Manage grading categories"\n'
      + '3. "Manage grading scales"',
    remarks:
      'GROUNDED LIVE 2026-08-27 from the pre-rendered DOM. Trigger qid "adEdit-1"; items "adEdit-2" '
      + '(Change school key), "adEdit-7" (categories), "adEdit-8" (scales). '
      + '⚠️ CORRECTS admin-shared.md §A1, which lists School settings as having only the TWO grading '
      + 'entries. "Change school key" is a third and was previously undocumented. '
      + 'Note the qid numbering is NOT contiguous (2, 7, 8) — adEdit-3/4 are the confirmation-dialog '
      + 'buttons, not menu items. Do not iterate the family.',
  },
  {
    id: 'TST_SKEY_TC_2',
    title: 'Verify an irreversible-action warning is shown when Change school key is selected',
    req: '#4 — Verify Change school key for normal school',
    type: 'Positive',
    priority: 'High',
    pre: PRE_SCHOOL,
    steps: '1. Open "School settings".\n2. Click "Change school key".\n3. Read the dialog.',
    data: '—',
    expected:
      'A warning dialog is shown, carrying a warning-triangle icon and this copy verbatim:\n'
      + 'Heading: "CAREFUL!"\n'
      + 'Title: "Changing the school key cannot be undone"\n'
      + 'Body: "This action is recommended only if your current school key has been compromised"\n'
      + 'Two controls are offered: "Continue" and "Cancel".',
    remarks:
      'COPY GROUNDED LIVE 2026-08-27 — captured VERBATIM from the pre-rendered DOM (admin-shared.md '
      + '§A6) WITHOUT triggering the action, which is the only safe way to verify it on a shared school. '
      + 'Dialog buttons: Continue "adEdit-3", Cancel "adEdit-4". '
      + 'The expected copy is therefore VERIFIED even though the dialog was never opened; only the '
      + 'act of opening it is [ASSUMED].',
  },
  {
    id: 'TST_SKEY_TC_3',
    title: 'Verify a new school key is issued and the old one stops working when Continue is confirmed',
    req: '#4 — Verify Change school key for normal school',
    type: 'Positive',
    priority: 'High',
    status: 'Blocked',
    comments:
      'BLOCKED at design time 2026-08-27 — IRREVERSIBLE ACTION ON A SHARED SCHOOL. The product itself '
      + 'states "Changing the school key cannot be undone". Unblock with a DEDICATED, DISPOSABLE school '
      + 'that no suite depends on.',
    pre:
      'Logged in as school-admin on a DEDICATED, DISPOSABLE school that no test suite references. '
      + 'NEVER FCN-CHZ-PDA. Classes tab displayed.',
    steps:
      '1. Note the current school key.\n'
      + '2. Open "School settings" and click "Change school key".\n'
      + '3. Click "Continue" in the warning dialog.\n'
      + '4. Return to "My school accounts" and read the school key on the card.\n'
      + '5. Attempt to join the school using the OLD key.',
    data: 'Old key: <DISPOSABLE_SCHOOL_KEY>',
    expected:
      '[ASSUMED] After step 3 a new school key is generated and shown.\n'
      + '[ASSUMED] After step 4 the card shows the NEW key, in the same XXX-XXX-XXX format.\n'
      + '[ASSUMED] After step 5 the OLD key is rejected.',
    remarks:
      '⚠️ NOT EXECUTED AND MUST NOT BE, on any shared school. FCN-CHZ-PDA is the primary shared school; '
      + 'its key is hardcoded as "schoolKey" in schoolAdminAddClassData.json, so changing it would break '
      + 'EVERY admin suite at once (admin-shared.md §0, §A5). '
      + 'Key format observed across all 7 schools: three uppercase triplets, e.g. "FCN-CHZ-PDA". '
      + 'Whether existing members are affected, and whether the change is announced anywhere, are both '
      + 'unknown. '
      + 'DESTRUCTIVE AND IRREVERSIBLE — this decides suite placement absolutely: it can never sit in a '
      + 'shared-school suite.',
  },
  {
    id: 'TST_SKEY_TC_4',
    title: 'Verify the school key is unchanged when the warning dialog is cancelled',
    req: '#4 — Verify Change school key for normal school',
    type: 'Negative',
    priority: 'High',
    pre: PRE_SCHOOL,
    steps:
      '1. Note the current school key.\n'
      + '2. Open "School settings" and click "Change school key".\n'
      + '3. Click "Cancel" in the warning dialog.\n'
      + '4. Re-read the school key.',
    data: '—',
    expected:
      '[ASSUMED] The dialog closes and the school key is UNCHANGED.',
    remarks:
      '⚠️ EXPECTED RESULT NOT VERIFIED — the dialog was never opened, by design, on the shared school. '
      + 'This is the SAFE half of the flow and is the one case here that could reasonably be run on a '
      + 'shared school, PROVIDED Cancel is clicked and never Continue. Even so, treat it carefully: a '
      + 'misclick is irreversible. '
      + 'Cancel qid "adEdit-4". '
      + 'Also confirm whether dismissing via Esc or a backdrop click behaves the same as Cancel.',
  },

  /* ------------- #5 Verify non mqa admin should not see cqa/mqa product */
  {
    id: 'TST_LIBR_TC_32',
    title: 'Verify MQA and CQA restricted products are not listed for an administrator outside those programmes',
    req: '#5 — Verify non mqa admin should not see cqa/mqa product',
    type: 'Negative',
    priority: 'High',
    status: 'Blocked',
    comments:
      'BLOCKED at design time 2026-08-27 on TWO counts: (1) no non-MQA admin account is available — '
      + '<ADMIN_USER>\'s home school IS MQA Sierra School (MQA-ABC-DEF); (2) the product team must first '
      + 'define what technically marks a product as MQA/CQA-restricted. Unblock with a non-MQA admin '
      + 'account and that definition.',
    pre:
      'Logged in as an administrator with NO MQA or CQA entitlement, on a school outside those '
      + 'programmes. Library tab open.',
    steps:
      '1. Open the Library tab for the school.\n'
      + '2. Note the total product count in the "Library (N)" heading.\n'
      + '3. Search the listing for products restricted to the MQA and CQA programmes.',
    data: 'School: <NON_MQA_SCHOOL_KEY>',
    expected:
      '[ASSUMED] No MQA- or CQA-restricted product appears in the listing, and the total count excludes '
      + 'them.',
    remarks:
      '⚠️ THE EXPECTED RESULT DEPENDS ON A DEFINITION THAT DOES NOT YET EXIST. Restriction is a '
      + 'licensing property, NOT a naming convention, so this case cannot be written against product '
      + 'titles.\n'
      + 'OBSERVED LIVE 2026-08-27 on "3 July Test School 1" (FCN-CHZ-PDA), Library (971): TWO products '
      + 'whose TITLES contain "CQA" are listed — "CQA - 7 Jan 2021 - Test Umbrella product" and '
      + '"Teacher Training - CQA Test Product". Separately, 3 titles begin "NON MQA", which are '
      + 'explicitly non-MQA products and are correctly present.\n'
      + 'This is an OBSERVATION, NOT A DEFECT CLAIM: a title containing "CQA" does not prove the product '
      + 'is CQA-restricted. It is recorded because it is the concrete thing to check once the definition '
      + 'exists — if those two ARE restricted, this is a live leak; if they are merely named that way, '
      + 'the case needs different data.\n'
      + 'Extends the existing LIBR module (TST_LIBR_TC_1..31) — do not renumber it.',
  },

  /* -------------------------------- #10 Admin part of multiple org */
  {
    id: 'TST_SADB_TC_2',
    title: 'Verify every school the administrator manages is listed when My school accounts is opened',
    req: '#10 — Admin part of multiple org',
    type: 'Positive',
    priority: 'High',
    pre: PRE_DASH,
    steps: '1. Observe the "My school accounts" page.\n2. Inspect each school card.',
    data: '—',
    expected:
      'Every school the administrator manages is listed, one card each, numbered sequentially from "01" '
      + 'with zero padding.\n'
      + 'Each card shows: index, school name, address, the label "School key", the key itself in '
      + 'XXX-XXX-XXX format, a "Copy" control, and a chevron opening the school.\n'
      + 'Observed 2026-08-27 for <ADMIN_USER>: 7 schools, numbered 01–07.',
    remarks:
      'GROUNDED LIVE 2026-08-27. Card qid "aDashboard-N" (a.inst-link); chevron is a SEPARATE '
      + '"aDashboard1-N". Both are POSITIONAL. The school key is carried in the card\'s aria-label, '
      + 'which is what makes key-based selection possible (schoolAdminDashboard.schoolLinkByKey uses '
      + 'a.inst-link[aria-label*="{{key}}"]).\n'
      + '⚠️ NEVER assert the literal count 7 — this is a shared account and the list changes '
      + '(admin-shared.md §A5). Assert the card STRUCTURE and that the expected key is present.\n'
      + 'Extends the existing SADB module (TST_SADB_TC_1 opens a school by key) — that case already '
      + 'covers opening; this one covers the LISTING, which nothing did.\n'
      + '⚠️ EXTENDS admin-shared.md §0, which documents 4 schools. This account sees 7 — KNF-XRD-QVE, '
      + 'HQC-ZWM-ZVF and GYB-JMU-KYA were undocumented.',
  },
  {
    id: 'TST_SADB_TC_3',
    title: 'Verify switching between organisations loads each one independently when the admin manages several',
    req: '#10 — Admin part of multiple org',
    type: 'Positive',
    priority: 'High',
    pre: PRE_DASH,
    steps:
      '1. Open the first school and note the org slug in the URL and the page heading.\n'
      + '2. Return to "My school accounts".\n'
      + '3. Open a DIFFERENT school and note its org slug and heading.\n'
      + '4. Compare the Classes listings of the two.',
    data: 'Schools: <SCHOOL_KEY_A> and <SCHOOL_KEY_B>',
    expected:
      'Each school opens under its own org slug, /admin/admin/org_<slug>/class, with its own name as '
      + 'the page heading and its own class list. No content from the previously opened school persists.\n'
      + 'Observed 2026-08-27: "3 July Test School 1" (FCN-CHZ-PDA) opened as org_perf_testschool_1.',
    remarks:
      'GROUNDED PARTIALLY 2026-08-27 — one school was opened and its slug confirmed; the SWITCH between '
      + 'two schools was not exercised, so step 4 is [ASSUMED].\n'
      + '⚠️ The org slug is NOT derivable from the school name or key — "3 July Test School 1" '
      + '(FCN-CHZ-PDA) maps to org_perf_testschool_1. Capture each slug; never construct it.\n'
      + 'The school context MUST be set by clicking the card — deep-linking /admin/admin/org_<slug>/class '
      + 'returns /dashboard/error even when authenticated (admin-shared.md §A1).\n'
      + 'Worth checking whether the per-account server-side class Filter and Search (§A4) are scoped per '
      + 'school or leak across organisations — that is unknown and would be a real defect if they leak.',
  },

  /* ------------------------- #12 Verify viewing multiple schools */
  {
    id: 'TST_SADB_TC_4',
    title: 'Verify two schools sharing a display name remain distinguishable by their school key',
    req: '#12 — Verify viewing multiple schools',
    type: 'Edge',
    priority: 'High',
    pre: PRE_DASH,
    steps:
      '1. Locate the two cards sharing the same display name.\n'
      + '2. Compare their school keys.\n'
      + '3. Open the one matching a specific key and confirm which school loaded.',
    data: 'Duplicate display name "3 July Test School 1" — keys FCN-CHZ-PDA and ZPB-TWP-AEQ',
    expected:
      'Both cards show the SAME display name but DIFFERENT school keys, and the card selected by key '
      + 'opens that specific school.',
    remarks:
      'GROUNDED LIVE 2026-08-27 — cards 01 and 02 both read "3 July Test School 1" with keys '
      + 'FCN-CHZ-PDA and ZPB-TWP-AEQ, and identical addresses too.\n'
      + '⚠️ THIS IS THE CASE THAT JUSTIFIES admin-shared.md §0\'s standing rule: ALWAYS select a school '
      + 'by KEY, never by name or card position. Selecting by name is ambiguous here, and card qids '
      + '(aDashboard-N) are positional so they re-issue when the list changes.\n'
      + 'Confirming WHICH school loaded (step 3) needs a distinguishing feature — the org slug in the '
      + 'URL is the reliable one, since the heading shows the shared name.',
  },

  /* ========================= BATCH C — cross-app ========================= */

  /* --- #6 Launch Cambridge One for schools and create institution request */
  {
    id: 'TST_SRQS_TC_2',
    title: 'Verify the institution request is submitted and confirmed from the summary step',
    req: '#6 — Verify launch of Cambridge one for schools and create institution request',
    type: 'Positive',
    priority: 'High',
    status: 'Blocked',
    comments:
      'BLOCKED at design time 2026-08-27 — submitting raises a REAL institution request that reaches '
      + 'a human queue and cannot be withdrawn from the UI. Unblock by confirming with the product team '
      + 'that Thor submissions are safe to raise and are swept, or by agreeing a test-only school name '
      + 'prefix.',
    pre:
      'The "Set up a school account" wizard has been completed through step 7, so the School request '
      + 'summary step (step 8) is displayed.',
    steps:
      '1. Review the summary of the entered details.\n'
      + '2. Submit the request.\n'
      + '3. Observe the confirmation.',
    data:
      'School name: "<TEST_PREFIX> Test School" · Type: Primary school · Teachers: 2-14 · '
      + 'Location: United Kingdom · Address: 123 Test Street, Test City · Tel: +441234567890',
    expected:
      '[ASSUMED] The request is submitted and a confirmation is shown, stating that the request has '
      + 'been received and what happens next.',
    remarks:
      '⚠️ THE ONLY UNCOVERED STEP OF THIS SCENARIO. The wizard is already automated step by step — '
      + 'TST_DINS_TC_1 (entry), TST_SUSA_TC_1..2 (intro), TST_SCTY_* (type), TST_NTCH_* (teachers), '
      + 'TST_SNAM_* (name), TST_SLOC_* (location), TST_SADR_* (address), TST_SCON_* (contact), '
      + 'TST_SRQS_TC_1 (summary loads). Launching from the footer is covered by TST_FOOT_TC_7 '
      + '("Validate Cambridge One School page is launched correctly"). '
      + 'What NOTHING covers is the actual SUBMISSION and its confirmation — this case, extending SRQS. '
      + 'Confirmation copy is [ASSUMED]; capture it verbatim when the block is lifted. '
      + 'CREATES REAL DATA outside the test estate.',
  },
  {
    id: 'TST_SRQS_TC_3',
    title: 'Verify each wizard step blocks progress until its required input is supplied',
    req: '#6 — Verify launch of Cambridge one for schools and create institution request',
    type: 'Negative',
    priority: 'Medium',
    pre: 'The "Set up a school account" wizard is open at step 2 (School type).',
    steps:
      '1. On School type, without selecting an option, attempt to continue.\n'
      + '2. Select an option and confirm progress is now allowed.\n'
      + '3. Repeat the same check for Number of teachers, School name, School location, School address '
      + 'and School contact details.',
    data: '—',
    expected:
      '[ASSUMED] On each step the Next control is unavailable until that step\'s required input is '
      + 'supplied, and becomes available once it is. No step can be skipped.',
    remarks:
      '⚠️ EXPECTED RESULT NOT VERIFIED — the wizard was not walked in this session. '
      + 'INFERRED from the existing automation, whose case titles state the enabling direction only, '
      + 'e.g. TST_SCTY_TC_3 "Select first radio option (Primary school) to ENABLE Next button" and '
      + 'TST_SNAM_TC_3 "Fill school name field to ENABLE Next button". The DISABLED half is nowhere '
      + 'asserted, which is the gap this case fills. '
      + 'Confirm whether Next is natively disabled or only CSS-disabled — admin-shared.md §B4 records '
      + 'CSS-only disabling elsewhere in this app, which would make a naive enabled-state check a false '
      + 'green. '
      + 'SIDE-EFFECT FREE: stops short of submission.',
  },

  /* ------------------- #9 Verify various errors in forms and modals */
  {
    id: 'TST_ASHL_TC_8',
    title: 'Verify no dialog is visible when an admin screen first loads',
    req: '#9 — Verify various errors in forms and modals',
    type: 'Negative',
    priority: 'High',
    pre: PRE_SCHOOL,
    steps:
      '1. Load the Classes tab and observe the screen without interacting.\n'
      + '2. Repeat for Students, Staff, Library and Reports.',
    data: '—',
    expected:
      'On every tab, no dialog, warning or error is visible on load. The screen shows only its own '
      + 'content.',
    remarks:
      'GROUNDED LIVE 2026-08-27 — verified that every dialog present in the DOM was hidden on load '
      + '(Classes 5, Students 4, Staff 1; all offsetParent === null). '
      + '⚠️ THIS IS THE HEADLINE AUTOMATION TRAP FOR THIS SCENARIO. Admin dialogs are PRE-RENDERED, so '
      + 'they exist in the DOM before anything triggers them. Any check of the form '
      + '"getElementCount(dialog) > 0" therefore passes ALWAYS and proves nothing — admin-shared.md §B2 '
      + 'records this silently breaking reset_filters for weeks. Assert VISIBILITY, never presence. '
      + 'Note also that opacity:0 still counts as visible to Playwright; only display:none is hidden.',
  },
  {
    id: 'TST_ASHL_TC_9',
    title: 'Verify the 50-item limit warnings use a consistent message pattern across screens',
    req: '#9 — Verify various errors in forms and modals',
    type: 'Edge',
    priority: 'Medium',
    pre: PRE_SCHOOL,
    steps:
      '1. Read the bulk-limit warning offered on the Classes tab.\n'
      + '2. Read the equivalent warning on the Students tab.\n'
      + '3. Compare their wording.',
    data: '—',
    expected:
      'Both follow the same two-line pattern, differing only in the noun:\n'
      + 'Classes: "You can only delete 50 classes at one time" / '
      + '"Please uncheck some classes to continue"\n'
      + 'Students: "You can only remove 50 students at one time" / '
      + '"Please uncheck some students to continue"\n'
      + 'Both offer a "Close" control.',
    remarks:
      'COPY GROUNDED LIVE 2026-08-27 — both captured VERBATIM from the pre-rendered DOM (§A6) without '
      + 'reaching the capped state, which would otherwise require 51+ rows. '
      + 'Note the VERB differs with the domain — "delete" for classes, "remove" for students — so a '
      + 'single shared assertion string is wrong. The LIMIT (50) and the sentence shape are the '
      + 'consistent parts. '
      + 'Reaching these states for real is Blocked on the shared school (admin-shared.md §A5: it holds '
      + '26 students, so the 50-student cap cannot be hit).',
  },
  {
    id: 'TST_ASHL_TC_10',
    title: 'Verify destructive confirmations state their consequence before the action is taken',
    req: '#9 — Verify various errors in forms and modals',
    type: 'Positive',
    priority: 'High',
    pre: PRE_SCHOOL,
    steps:
      '1. Read the class-deletion confirmation.\n'
      + '2. Read the student-removal confirmation.\n'
      + '3. Read the change-school-key confirmation.\n'
      + '4. Check each offers a way to back out.',
    data: '—',
    expected:
      'Each destructive confirmation names its consequence and offers a non-destructive exit:\n'
      + 'Class delete — "WARNING!" / "There might be students, teachers and course materials in the '
      + 'selected classes" / "Are you sure you want to delete?" / "No, cancel"\n'
      + 'Student removal — "I confirm that I want to remove students from my school account" / '
      + '"Cancel" / "Request to remove"\n'
      + 'Change school key — "CAREFUL!" / "Changing the school key cannot be undone" / "Cancel"',
    remarks:
      'ALL THREE CAPTURED VERBATIM 2026-08-27 from the pre-rendered DOM, without triggering any of them '
      + '— which is the only safe way, since all three are destructive on a shared school. '
      + '⚠️ The change-school-key dialog is present on EVERY admin tab (Classes, Students, Staff all '
      + 'carry it) because School settings lives in the shared page chrome — scope any modal selector '
      + 'with :has(...) to the specific dialog, or it will match this one everywhere. '
      + 'Async follow-ups are also pre-rendered and worth checking in the same pass: '
      + '"This will take a few minutes" (classes) and "Removing students may take some time" (students).',
  },

  /* --------------------- #13 Admin is able to switch to teacher view */
  {
    id: 'TST_SADB_TC_5',
    title: 'Verify the administrator can switch to the teacher dashboard and back again',
    req: '#13 — Verify Admin is able to switch to teacher view',
    type: 'Positive',
    priority: 'High',
    pre: PRE_DASH,
    steps:
      '1. Note that the toggle reports Administrator as active.\n'
      + '2. Activate the toggle.\n'
      + '3. Observe the resulting page.\n'
      + '4. Activate the toggle again.\n'
      + '5. Confirm the administrator view is restored.',
    data: '—',
    expected:
      'After step 2 the browser navigates to /dashboard/teacher/dashboard, the browser tab reads '
      + '"Teacher dashboard | Cambridge One", the page greets the user ("Hi <FIRST_NAME>!") and the '
      + 'toggle now reports "Teacher currently active".\n'
      + 'After step 4 the browser returns to /admin/admin/dashboard, titled "My school accounts | '
      + 'Cambridge One", and the toggle reports "Administrator currently active".',
    remarks:
      'GROUNDED LIVE 2026-08-27 — the full round trip was performed and the account was left in '
      + 'Administrator view. '
      + '⚠️ THE SWITCH ELEMENT IS NAMED DIFFERENTLY IN EACH VIEW: ".can-toggle__switch" (double '
      + 'underscore) in the admin view, ".can-toggle-switch" (single hyphen) in the teacher view. A '
      + 'selector written for one view SILENTLY FAILS to find it in the other, which breaks exactly the '
      + 'round trip this case exercises. Use "#teacher-admin-toggle" (stable in both) and read the '
      + 'input\'s checked state — false = Administrator, true = Teacher. '
      + 'The focusable control is the inner [tabindex="0"] div; the input itself is aria-hidden. '
      + 'The toggle also appears on inner admin tabs, not just the dashboard. '
      + 'Existing selector schoolAdminDashboard.teacherAdminToggle already targets the input; this '
      + 'extends SADB. SIDE-EFFECT FREE — a view switch only.',
  },
  {
    id: 'TST_SADB_TC_6',
    title: 'Verify the teacher view lists the schools where the user teaches, not those they administer',
    req: '#13 — Verify Admin is able to switch to teacher view',
    type: 'Edge',
    priority: 'High',
    pre: PRE_DASH + ' The user is both an administrator and a teacher on overlapping sets of schools.',
    steps:
      '1. On "My school accounts", list the schools shown.\n'
      + '2. Switch to the teacher view.\n'
      + '3. List the school groups shown there.\n'
      + '4. Compare the two lists.',
    data: '—',
    expected:
      'The two lists are NOT the same. The administrator view shows schools the user administers; the '
      + 'teacher view groups classes under schools where the user teaches, which may include schools '
      + 'absent from the administrator view.\n'
      + 'Observed 2026-08-27: administrator view 7 schools; teacher view 8 school groups, including '
      + '"ABERYSTWYTH COLLEGE : THOR" and "LTI INTEGRATIONS TEST2", neither of which appears in the '
      + 'administrator list.',
    remarks:
      'GROUNDED LIVE 2026-08-27. This matters because it is easy to assume the two views show the same '
      + 'estate — they do not, and a test asserting equal school counts across the toggle will fail. '
      + '⚠️ The teacher view groups by school DISPLAY NAME, so the two distinct schools both called '
      + '"3 July Test School 1" (FCN-CHZ-PDA and ZPB-TWP-AEQ) collapse into a SINGLE group there. The '
      + 'admin view keeps them separate via their keys. Do not match schools across the two views by '
      + 'name. '
      + '⚠️ NEVER assert the literal counts 7 and 8 — shared account (§A5). Assert the RELATIONSHIP: '
      + 'the teacher list contains at least one school the admin list does not. '
      + '⚠️ Every "Create class" button in the teacher view shares qid "tDashboard-ncls-btn-1" — 7 '
      + 'elements, one per school group. See TST_SADB_TC_7.',
  },

  /* ---- #14 Create a class in teacher view and see it in the Admin classes tab */
  {
    id: 'TST_SADB_TC_7',
    title: 'Verify a class created in the teacher view appears in the Admin Classes tab for the same school',
    req: '#14 — Verify admin is able to create a new class in teacher view and view that class in Admin classes tab',
    type: 'Positive',
    priority: 'High',
    pre:
      PRE_DASH + ' The user is both administrator and teacher on the target school. '
      + 'USE A SCHOOL WHOSE CLASS LIST IS NOT ASSERTED BY OTHER SUITES.',
    steps:
      '1. Switch to the teacher view.\n'
      + '2. Locate the section for the target school and click ITS "Create class" control.\n'
      + '3. Create a class named "AutoClass_TeacherView_<RUN_ID>".\n'
      + '4. Switch back to the administrator view.\n'
      + '5. Open the same school and go to the Classes tab.\n'
      + '6. Search for the class by name.',
    data: 'School: <SCHOOL_KEY> · Class name: "AutoClass_TeacherView_<RUN_ID>"',
    expected:
      '[ASSUMED] The class is created under the chosen school and, after step 6, is listed in that '
      + 'school\'s Admin Classes tab under the same name.',
    remarks:
      '⚠️ CREATES REAL DATA — a real class on a real school. This decides suite placement absolutely: '
      + 'it must NOT sit in a side-effect-free suite. Use the sweepable "AutoClass_" prefix '
      + '(admin-shared.md §A7) so leftovers are recognisable, and note that class DELETE is SOFT, so '
      + 'every run leaves a permanent soft-deleted row (§A5).\n'
      + '⚠️ CHOOSING THE RIGHT "Create class" IS THE HARD PART. All 7 buttons in the teacher view share '
      + 'qid "tDashboard-ncls-btn-1", one per school group, and the qid cannot distinguish them. The '
      + 'button must be located THROUGH its school-group heading, or the class lands on the wrong '
      + 'school. A class literally named "admin as a teacher class" already exists under MQA Sierra '
      + 'School, suggesting this has been done manually before.\n'
      + '⚠️ CLASS CREATION IS ASYNCHRONOUS (§A4) — the success dialog says it "can take up to 12 hours"; '
      + 'measured visibility ~24 s on a responsive Thor and >90 s on a loaded one. Step 6 must POLL, '
      + 'and the active-class count does NOT increment immediately, so never assert count + 1.\n'
      + 'Teacher-side creation itself is already automated (ENTE / CREA modules, createNewClass.page.js) '
      + '— what is NOT covered anywhere is this CROSS-ROLE journey, which is the point of the case.\n'
      + 'The teacher view groups by display name, so a school with a duplicate name is ambiguous here — '
      + 'pick a school with a UNIQUE name (§A5, TST_SADB_TC_6).',
  },
];

module.exports = { TCS, REQS };

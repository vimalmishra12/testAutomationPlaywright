/**
 * LP SETUP test cases — the fresh-user chain that precedes the Learning Path cases:
 * teacher signup → join school → create class → learner signup → invite → accept (SLE access).
 * Emitted as a SEPARATE sheet/section of the LearningPath workbook (user decision 2026-09-22);
 * to be moved into application/feature registers later.
 *
 * Grouped MODULE-WISE (one group per module/feature), rows in the order the flow runs them.
 * Includes the EXISTING TCs the flow reuses (marked "Existing TC, reused"), so the whole flow can be
 * checked step by step from this sheet. Housekeeping TCs (INVI_TC_101, PEXT_TC_100) are not cases —
 * they are mentioned in Preconditions/Remarks.
 */

const { RUN } = require("./_tcdata.js");

const ENV = 'Production (www.cambridgeone.org).';
const T = '<LP_TEACHER_EMAIL> ("{{run.lpTeacherEmail}}", e.g. cqaprodlpteach_w1b7@mailsac.com)';
const L = '<LP_LEARNER_EMAIL> ("{{run.lpLearnerEmail}}", e.g. cqaprodlplearn_jqh2@mailsac.com)';
const C = '<LP_CLASS_NAME> ("{{run.lpClassName}}", e.g. "Class vyi9")';
const PW = 'Password: the suite\'s standard test password (learningPathData.json)';
const V = 'Verified live 2026-09-22 (production), full run 53/53.';
const REUSED = 'Existing TC, reused unchanged by the LP flow. ';

const GROUPS = [
  'S1 — Landing & login (LAND / LOGI)',
  'S2 — Signup & e-mail verification (SNUP)',
  'S3 — Teacher account setup / join a school (TSET)',
  'S4 — Teacher dashboard & create a class (DASH / ENTE)',
  'S5 — Teacher invites a learner (DASH / CREA)',
  'S6 — Learner accepts the invitation; school-licence access (INVI / DASH)',
];

const P = (group, o) => Object.assign({ req: group, type: 'Positive' }, o);

const TCS = [
  // ── S1 ─────────────────────────────────────────────────────────────────────────────
  P(GROUPS[0], { id: 'TST_LAND_TC_2', priority: 'High',
    title: 'Verify the signup page opens when "Sign up" is clicked on the landing page',
    pre: ENV + ' Landing page open, logged out.', steps: '1. Click "Sign up".', data: '—',
    expected: 'The role-selection page (/regoptions) opens with Teacher / Learner / Parent options.',
    remarks: REUSED + 'Before-step of LP setup Suites 1 and 4. ' + V }),
  P(GROUPS[0], { id: 'TST_LAND_TC_3', priority: 'High',
    title: 'Verify the login page opens when "Log in" is clicked on the landing page',
    pre: ENV + ' Landing page open, logged out.', steps: '1. Click "Log in".', data: '—',
    expected: 'The Gigya login form (e-mail + password) is shown.',
    remarks: REUSED + 'Before-step of Suites 2, 3, 5, 6, 7. ' + V }),
  P(GROUPS[0], { id: 'TST_LOGI_TC_1', priority: 'High',
    title: 'Verify the e-mail can be entered when the login form is shown',
    pre: 'Login form open.', steps: '1. Type the account e-mail.', data: 'Teacher ' + T + ' or learner ' + L,
    expected: 'The e-mail box holds the typed address.', remarks: REUSED + 'Receives the run-generated user via an ADR-022 token. ' + V }),
  P(GROUPS[0], { id: 'TST_LOGI_TC_2', priority: 'High',
    title: 'Verify the password can be entered when the login form is shown',
    pre: 'E-mail entered.', steps: '1. Type the password.', data: PW,
    expected: 'The password box holds the typed value (masked).', remarks: REUSED + V }),
  P(GROUPS[0], { id: 'TST_LOGI_TC_5', priority: 'High',
    title: 'Verify the user reaches the dashboard when valid credentials are submitted',
    pre: 'E-mail and password entered.', steps: '1. Accept cookies if the banner shows.\n2. Click "Log in".', data: '—',
    expected: 'The Cambridge One dashboard loads (header help button visible).',
    remarks: REUSED + 'Proves every run-generated account can log in. A new teacher/learner gets a guided tour on every login — closed by TST_DASH_TC_12. ' + V }),

  // ── S2 ─────────────────────────────────────────────────────────────────────────────
  P(GROUPS[1], { id: 'TST_SNUP_TC_59', priority: 'High',
    title: 'Verify the role\'s next signup screen opens when a role is selected and confirmed',
    pre: ENV + ' Signup role page (/regoptions) open.',
    steps: '1. Select the role (Teacher / Learner).\n2. Click Next.\n3. In "You cannot change your role later on" click "Yes, continue".',
    data: 'Teacher → expected screen "profile form"; Learner → expected screen "age gate"',
    expected: 'Next is disabled until a role is picked. The confirm dialog names the chosen role ("You have selected <Role>"). '
      + 'After "Yes, continue": Teacher → /register-teacher profile form; Learner → /learner-age-check (country + age).',
    remarks: 'Run twice in the flow (teacher Suite 1, learner Suite 4). ' + V }),
  P(GROUPS[1], { id: 'TST_SNUP_TC_63', priority: 'High',
    title: 'Verify the learner profile form opens when a country and an allowed age are entered in the age gate',
    pre: 'Learner age gate (/learner-age-check) open.',
    steps: '1. Type "India" in the location box and pick "India" from the suggestions.\n2. Select age "18+".\n3. Click Next.',
    data: 'Country: India · Age: 18 (option "18+")',
    expected: 'The age gate closes and the learner profile form (name, e-mail, password, terms) is shown.',
    remarks: 'The first-name box can report visible on the gate page (thor); the form is proven by the age dropdown going away. ' + V }),
  P(GROUPS[1], { id: 'TST_SNUP_TC_60', priority: 'High',
    title: 'Verify the verification-pending screen shows the entered e-mail when the signup form is submitted',
    pre: 'Teacher profile form, or learner profile form after the age gate.',
    steps: '1. Enter first name, last name, e-mail and password.\n2. Teacher only: type "India" in Country and pick it.\n'
      + '3. Tick "I accept the Privacy notice and Terms of use".\n4. Click "Sign up".',
    data: 'Teacher: Teacher / User / ' + T + ' / India · Learner: Learner / User / ' + L + ' · ' + PW,
    expected: 'Gigya\'s verification-pending screen is shown and echoes exactly the entered e-mail.',
    remarks: '⚠️ CREATES A REAL ACCOUNT every run (user-approved on production). The terms checkbox id differs by env '
      + '(thor #legal-checkbox-1, prod #teacher-checkbox-1); both have class termsCheckbox. ' + V }),
  P(GROUPS[1], { id: 'TST_SNUP_TC_61', priority: 'High',
    title: 'Verify the Mailsac verification link returns the user to Cambridge One',
    pre: 'Account just created (pending screen shown).',
    steps: '1. Log in to Mailsac.\n2. Open the new account\'s inbox and the "Verify" mail.\n3. Unblock content.\n4. Open the mail\'s verification link.',
    data: 'Inbox: ' + T + ' / ' + L + ' · Mailsac account: comproqatest21@gmail.com',
    expected: 'The mail arrives (seconds on production) and its link signs the user in and lands on the Cambridge One dashboard.',
    remarks: 'The link goes via login.comprodls.com — on THOR its certificate expired in 2022, so this case is Blocked on thor '
      + '(see c1-core-shared.md §A4). ' + V }),
  P(GROUPS[1], { id: 'TST_SNUP_TC_62', priority: 'High',
    title: 'Verify a newly verified teacher can close the welcome tour and is offered "Complete your account"',
    pre: 'Teacher just verified (or freshly logged in, before joining a school).',
    steps: '1. Wait for the dashboard.\n2. Close the guided tour (cross, top right) if shown.',
    data: '—',
    expected: 'The tour closes and the "Complete account set up" button is shown.',
    remarks: 'The tour mounts ~1.8 s after the dashboard; allow it time before deciding it is absent. Reused at the start of Suite 2. ' + V }),
  P(GROUPS[1], { id: 'TST_SNUP_TC_64', priority: 'High',
    title: 'Verify a newly verified learner lands on the welcome screen with Continue',
    pre: 'Learner just verified.', steps: '1. Wait for the page after verification.\n2. Close the guided tour if shown.', data: '—',
    expected: 'The learner welcome screen with its "Continue" button is shown.', remarks: V }),

  // ── S3 ─────────────────────────────────────────────────────────────────────────────
  P(GROUPS[2], { id: 'TST_TSET_TC_1', priority: 'High',
    title: 'Verify the setup wizard opens with "I teach in a school" when the teacher clicks "Complete your account"',
    pre: 'New teacher logged in, not yet in any school; guided tour closed.',
    steps: '1. Click "Complete account set up".\n2. Close the "Welcome, Teacher (1 of 5)" tour if shown.', data: '—',
    expected: 'The account-setup wizard shows the "I teach in a school" option.', remarks: V }),
  P(GROUPS[2], { id: 'TST_TSET_TC_2', priority: 'High',
    title: 'Verify the school-key form is shown when the teacher chooses "I teach in a school" and "Join a school"',
    pre: 'Setup wizard open.', steps: '1. Choose "I teach in a school" → Next.\n2. Choose "Join a school" → Next.', data: '—',
    expected: 'The school-key input form is shown.', remarks: V }),
  P(GROUPS[2], { id: 'TST_TSET_TC_3', priority: 'High',
    title: 'Verify the teacher joins the school when a valid school key is entered',
    pre: 'School-key form open.', steps: '1. Type the school key.\n2. Click Join.', data: 'School key: MQA-ABC-DEF (MQA Sierra School, production)',
    expected: 'The success screen with "Go to dashboard" is shown.',
    remarks: '⚠️ WORKAROUND (user decision 2026-09-22, as SOURCE): production sometimes answers Join with "There was a problem on server"; '
      + 'the automation retries Join up to 5 times and logs every retry. Not seen in our runs (0 retries). Joining is durable. ' + V }),
  P(GROUPS[2], { id: 'TST_TSET_TC_4', priority: 'High',
    title: 'Verify the dashboard header shows the joined school after "Go to dashboard"',
    pre: 'Join succeeded.', steps: '1. Click "Go to dashboard".\n2. Close the dashboard tutorial if shown.', data: 'School name: MQA Sierra School',
    expected: 'The dashboard header shows the school name (compare case-insensitively — casing differs by environment).', remarks: V }),

  // ── S4 ─────────────────────────────────────────────────────────────────────────────
  P(GROUPS[3], { id: 'TST_DASH_TC_12', priority: 'High',
    title: 'Verify the dashboard is usable after login when the guided tour is shown and closed',
    pre: 'Teacher or learner just logged in.', steps: '1. Wait up to 5 s for the guided tour.\n2. If shown, close it.', data: '—',
    expected: 'No guided tour covers the dashboard.', remarks: 'Runs after every login in Suites 3, 5, 6, 7. ' + V }),
  P(GROUPS[3], { id: 'TST_DASH_TC_10', priority: 'High',
    title: 'Verify the Create class page opens when "Create class" is clicked on the teacher dashboard',
    pre: 'Teacher (in a school) on the dashboard.', steps: '1. Click "Create class".', data: '—',
    expected: 'The "Enter class details" step is shown.', remarks: REUSED + V }),
  P(GROUPS[3], { id: 'TST_ENTE_TC_3', priority: 'High',
    title: 'Verify the class name can be entered on the class details step',
    pre: 'Create class — class details step.', steps: '1. Type the class name.', data: 'Class name: ' + C,
    expected: 'The class-name box holds the name.', remarks: REUSED + V }),
  P(GROUPS[3], { id: 'TST_ENTE_TC_9', priority: 'High',
    title: 'Verify Next moves to the class-materials step', pre: 'Class name entered.', steps: '1. Click Next.', data: '—',
    expected: 'The "Add class materials" step is shown.', remarks: REUSED + V }),
  P(GROUPS[3], { id: 'TST_ENTE_TC_22', priority: 'High',
    title: 'Verify the material search opens when "Add materials" is clicked', pre: 'Class-materials step.', steps: '1. Click "Add materials".', data: '—',
    expected: 'The material search box is shown.', remarks: REUSED + V }),
  P(GROUPS[3], { id: 'TST_ENTE_TC_21', priority: 'High',
    title: 'Verify a material name can be searched', pre: 'Material search open.', steps: '1. Type the product name.', data: 'Product: cqaautomationbundle1',
    expected: 'Matching materials are listed.', remarks: REUSED + V }),
  P(GROUPS[3], { id: 'TST_ENTE_TC_24', priority: 'High',
    title: 'Verify the material with the exact searched name is picked when it is selected from the search results',
    pre: 'Search results shown.', steps: '1. Click the result whose name is exactly the product.\n2. Tick it.', data: 'Product: cqaautomationbundle1',
    expected: 'The picked material shown in the modal is exactly "cqaautomationbundle1".',
    remarks: 'Results are ranked, not exact — the older ENTE_TC_20/23 pick the FIRST result and could silently build the class with the wrong material. ' + V }),
  P(GROUPS[3], { id: 'TST_ENTE_TC_19', priority: 'High',
    title: 'Verify the picked material is added when "Add to class" is clicked', pre: 'Material ticked.', steps: '1. Click "Add to class".', data: '—',
    expected: 'The material is added to the class draft.', remarks: REUSED + V }),
  P(GROUPS[3], { id: 'TST_ENTE_TC_26', priority: 'High',
    title: 'Verify the "This material is collaborative" dialog is shown and can be closed after a collaborative material is added',
    pre: 'Collaborative material just added.', steps: '1. Read the dialog.\n2. Close it (×).', data: 'Expected title: "This material is collaborative"',
    expected: 'The dialog titled "This material is collaborative" is shown and closes; Finish becomes clickable.',
    remarks: 'The dialog blocks Finish until closed. ' + V }),
  P(GROUPS[3], { id: 'TST_ENTE_TC_18', priority: 'High',
    title: 'Verify Finish creates the class', pre: 'Material added, dialog closed.', steps: '1. Click Finish.', data: '—',
    expected: 'Class creation completes.', remarks: REUSED + '⚠️ CREATES A REAL CLASS every run (user-approved). ' + V }),
  P(GROUPS[3], { id: 'TST_ENTE_TC_25', priority: 'High',
    title: 'Verify the new class is listed on the dashboard with a class key when class creation finishes',
    pre: 'Finish clicked.', steps: '1. Read the success heading.\n2. Go to dashboard.\n3. Open the class by its name.\n4. Read the class key.',
    data: 'Class name: ' + C + ' · Expected heading: "Class successfully created"',
    expected: '"Class successfully created" is shown; the class card with that name is on the dashboard; its class page shows a class key (e.g. N348-p6W8).',
    remarks: 'The key is stored for the run as lpClassKey (ADR-022). ' + V }),

  // ── S5 ─────────────────────────────────────────────────────────────────────────────
  P(GROUPS[4], { id: 'TST_DASH_TC_11', priority: 'High',
    title: 'Verify the class page opens when the class card is clicked on the teacher dashboard',
    pre: 'Teacher on the dashboard.', steps: '1. Click the card of the class.', data: 'Class: ' + C,
    expected: 'The class page opens.', remarks: REUSED + V }),
  P(GROUPS[4], { id: 'TST_CREA_TC_19', priority: 'High',
    title: 'Verify the class students area opens', pre: 'Class page open.', steps: '1. Open the students area of the class.', data: '—',
    expected: 'The students area with "Add students" is shown.', remarks: REUSED + V }),
  P(GROUPS[4], { id: 'TST_CREA_TC_20', priority: 'High',
    title: 'Verify the invite dialog opens when "Add students" is clicked', pre: 'Students area open.', steps: '1. Click "Add students".', data: '—',
    expected: 'The dialog asks "Are the students children or adults?".', remarks: REUSED + V }),
  P(GROUPS[4], { id: 'TST_CREA_TC_21', priority: 'High',
    title: 'Verify "Adults" can be chosen', pre: 'Invite dialog open.', steps: '1. Choose "Adults".', data: '—',
    expected: 'Adults is selected.', remarks: REUSED + V }),
  P(GROUPS[4], { id: 'TST_CREA_TC_22', priority: 'High',
    title: 'Verify Next moves to the e-mail step', pre: 'Adults chosen.', steps: '1. Click Next.', data: '—',
    expected: 'The learner e-mail box is shown.', remarks: REUSED + V }),
  P(GROUPS[4], { id: 'TST_CREA_TC_23', priority: 'High',
    title: 'Verify the learner e-mail can be entered', pre: 'E-mail step open.', steps: '1. Type the learner\'s e-mail.', data: 'Learner: ' + L,
    expected: 'The e-mail box holds the address.', remarks: REUSED + V }),
  P(GROUPS[4], { id: 'TST_CREA_TC_24', priority: 'High',
    title: 'Verify the invitation is sent when Invite is clicked', pre: 'E-mail entered.', steps: '1. Click Invite.', data: '—',
    expected: 'The "Pending" section is shown.', remarks: REUSED + V }),
  P(GROUPS[4], { id: 'TST_CREA_TC_30', priority: 'High',
    title: 'Verify the invited learner\'s e-mail is listed in the class\'s pending invitations after Invite',
    pre: 'Invite sent.', steps: '1. Look at the pending invitations.', data: 'Learner: ' + L,
    expected: 'The pending list contains the invited e-mail.', remarks: 'TST_CREA_TC_24 only proves some invite is pending; this proves it is THIS one. ' + V }),

  // ── S6 ─────────────────────────────────────────────────────────────────────────────
  P(GROUPS[5], { id: 'TST_INVI_TC_1', priority: 'High',
    title: 'Verify the learner\'s notification bell opens', pre: 'Learner logged in, tour closed; the invitation has reached the bell (housekeeping TST_INVI_TC_101 waits up to 2 min).',
    steps: '1. Click the bell.', data: '—', expected: 'The notification list opens with the class invitation.', remarks: REUSED + 'Invitation arrived in seconds on production. ' + V }),
  P(GROUPS[5], { id: 'TST_INVI_TC_2', priority: 'High',
    title: 'Verify the invitation page opens from the notification', pre: 'Bell open.', steps: '1. Click the invitation notification.', data: '—',
    expected: 'The invitations page (/dashboard/invitation/main) opens.', remarks: REUSED + 'Clicks the FIRST notification — sound for a new learner whose only notification is the invite. ' + V }),
  P(GROUPS[5], { id: 'TST_INVI_TC_13', priority: 'High',
    title: 'Verify Accept is enabled when the invited class is ticked on the invitation page',
    pre: 'Invitations page open.', steps: '1. Wait for the invitation list.\n2. Tick the invitation of the class (checkbox "Select <class name>").', data: 'Class: ' + C,
    expected: 'The invitation is ticked and "Accept" becomes enabled.',
    remarks: 'The page renders the list, then routes to /dashboard/invitation/main and re-renders it — a tick made earlier is lost. '
      + 'Used instead of TST_INVI_TC_3 ("Select all"), which raced that re-render. ' + V }),
  P(GROUPS[5], { id: 'TST_INVI_TC_4', priority: 'High',
    title: 'Verify the invitation is accepted when Accept is clicked', pre: 'Invitation ticked.', steps: '1. Click Accept.', data: '—',
    expected: 'The acceptance confirmation with "Go to dashboard" is shown.', remarks: REUSED + V }),
  P(GROUPS[5], { id: 'TST_INVI_TC_5', priority: 'High',
    title: 'Verify "Go to dashboard" returns the learner to the dashboard', pre: 'Invitation accepted.', steps: '1. Click "Go to dashboard".', data: '—',
    expected: 'The learner dashboard is shown.', remarks: REUSED + V }),
  P(GROUPS[5], { id: 'TST_DASH_TC_13', priority: 'High',
    title: 'Verify the learner sees the class and its component without an activation-code prompt after accepting an invite on a school-licensed school',
    pre: 'Learner back on the dashboard after accepting.', steps: '1. Find the class card.\n2. Look for the "Practice Extra" tile inside it.\n3. Check for an activation-code box.',
    data: 'Class: ' + C + ' · Component: Practice Extra',
    expected: 'The class card is shown with its "Practice Extra" tile, and NO activation-code prompt — the School Level Licence grants the product.',
    remarks: V }),
];

TCS.forEach((tc) => { tc.status = 'Pass'; tc.comments = RUN; });

module.exports = { TCS, GROUPS };

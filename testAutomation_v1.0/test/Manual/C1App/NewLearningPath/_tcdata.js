/**
 * Source of truth for the New Learning Path (NLP — "Projects") manual test-case set.
 * Both the .md document and the .xlsx register are generated from this file (SKILL golden rule 6):
 *   node test/Manual/C1App/NewLearningPath/_generate.js
 *
 * Scenarios: D:\Playwright\Test_Cases_CUP\nlp-scenarios.xlsx, sheet "New Learning Path", TC-NLP-001…022
 * (scope agreed with the user 2026-09-25: all 22; teacher/admin previews on the run's own bundle
 * cqaautomationbundle1 instead of "R55 Multi Component Umbrella"; group cases automated with a second learner).
 * Modules: DASH (dashboard.page.js) launch, NLPP (newLearningPath.page.js) player, CGRP (classGroups.page.js)
 * groups; reused MSAC / MRKQ / PROG.
 * Every expected result below was seen live on production on 2026-09-25 unless marked [ASSUMED].
 */

const PRE_LEARNER =
  'Production (www.cambridgeone.org). A run-generated learner (<NLP_LEARNER_EMAIL>) has accepted the run teacher\'s '
  + 'invite to class <NLP_CLASS_NAME> on the School-Level-Licence school "MQA Sierra School" (MQA-ABC-DEF); the class '
  + 'uses product "cqaautomationbundle1", whose "Projects" component (cqaautomationpr1) is the NLP. The learner is '
  + 'logged in on the dashboard (guided tour closed).';
const PRE_TEACHER =
  'Production. The run-generated teacher (<NLP_TEACHER_EMAIL>) owns class <NLP_CLASS_NAME> with product '
  + '"cqaautomationbundle1" and is logged in on the dashboard (guided tour closed).';
const PRE_ADMIN =
  'Production. The single-school admin of MQA Sierra School (<PROD_ADMIN_EMAIL>) is logged in on the admin '
  + 'console, school key MQA-ABC-DEF, LIBRARY tab open.';
const SEEN = 'Verified live 2026-09-25 (production) by read-only probes (learner _mhfh, teacher _r04f, Class 036n).';
const REUSED = 'Existing TC, reused with the Projects data (newLearningPathData.json).';

const REQS = [
  'TC-NLP-001 — Learner navigates into the Projects component via the class dashboard tile',
  'TC-NLP-002 — First-time Projects launch shows the materials-provisioning screen',
  'TC-NLP-003 — Learner answers Exercise 1 (single dropdown) of the Projects scorable activity',
  'TC-NLP-004 — Learner completes all four exercises and reaches a perfect score',
  'TC-NLP-005 — Learner pages through the Projects flashcard deck to completion',
  'TC-NLP-006 — Learner submits a Productive Skill response in Projects',
  'TC-NLP-007 — Learner closes the Projects activity and returns to the full dashboard',
  'TC-NLP-008 — Teacher marks the learner\'s Projects PS from the marking queue',
  'TC-NLP-009 — Learner sees their updated analytics for Projects',
  'TC-NLP-010 — Teacher sees class- and student-level analytics for Projects',
  'TC-NLP-011 — A School Level Licence grants Projects with no activation code',
  'TC-NLP-012 — Teacher previews an NLP component from the class Materials tab',
  'TC-NLP-013 — Teacher previews an NLP component via Manage student access (lock-rule creation)',
  'TC-NLP-014 — Teacher previews an NLP component via My library',
  'TC-NLP-015 — Admin previews an NLP component from the Library tab',
  'TC-NLP-016 — NLP TOC is a single-page vertical journey with expand/collapse units',
  'TC-NLP-017 — Exiting a scorable without finishing keeps an in-progress state, restored on relaunch',
  'TC-NLP-018 — An SLE-activated Projects component shows no expiry date',
  'TC-NLP-019 — Learner opens an HTML activity within Projects',
  'TC-NLP-020 — Learner opens a PDF activity within Projects',
  'TC-NLP-021 — Group members and the teacher comment on a shared Collab activity',
  'TC-NLP-022 — One learner submits a Group PS; the teacher marks it once for all members',
];
const R = (n) => REQS[n - 1];

// Requirements covered by a TC whose row sits under another requirement (listed in the coverage map).
const ALSO = {
  [R(1)]: ['TST_DASH_TC_17'],
  [R(18)]: ['TST_DASH_TC_17'],
  [R(4)]: ['TST_NLPP_TC_5'],
};

const NOT_COVERED = {};

const TCS = [
  {
    id: 'TST_NLPP_TC_1', req: R(1), type: 'Positive', priority: 'High',
    title: 'Verify the NLP table of contents shows the product, the component and its activities when Projects is launched from the class card',
    pre: PRE_LEARNER + ' TST_DASH_TC_17 has launched Projects.',
    steps: '1. On the learner dashboard, in the card of class <NLP_CLASS_NAME>, click the "Projects" tile.\n2. Wait for the Projects page.',
    data: 'Class <NLP_CLASS_NAME> · component "Projects"',
    expected: 'The NLP page opens (/nlp/learner/…/product/cqaautomationpr1): heading "cqaautomationbundle1", sub-heading "Projects", and a table of contents listing the component\'s 7 activities.',
    remarks: SEEN + ' The sheet\'s "activity player (iframe) loads" is the classic LP; the NLP lands on its table of contents and the player opens per activity (TST_NLPP_TC_3). The tile is looked up INSIDE the named class card.',
  },
  {
    id: 'TST_DASH_TC_17', req: R(2), type: 'Positive', priority: 'Medium',
    title: 'Verify a learner\'s first Projects launch shows the materials-provisioning screen with a progress bar, which clears into the NLP table of contents',
    pre: PRE_LEARNER + ' The learner has never launched Projects.',
    steps: '1. Check the Projects tile and its class card for an expiry date.\n2. Click the "Projects" tile.\n3. Watch the page until the table of contents renders.',
    data: 'Class <NLP_CLASS_NAME> · component "Projects" · bound 300 s',
    expected: '1. No expiry date on the tile or the card (TC-NLP-018).\n2. "Welcome to your Cambridge One — We\'re setting up the learning materials for you" with a percentage progress bar (measured: 80 % at 60 s, 100 % at ~64 s).\n3. It clears into the NLP table of contents (TC-NLP-001).',
    remarks: SEEN + ' Provisioning is per PRODUCT (a learner who had used Practice Extra still got it for Projects) and shown once; a second launch opens the TOC in ~1.7 s. Also covers TC-NLP-001 (launch) and TC-NLP-018 (no expiry).',
  },
  {
    id: 'TST_NLPP_TC_3', req: R(3), type: 'Positive', priority: 'High',
    title: 'Verify Exercise 1\'s dropdown shows the chosen value and can be checked when the scorable activity is opened from the NLP table of contents',
    pre: PRE_LEARNER + ' Projects is open on its table of contents; the scorable has not been started.',
    steps: '1. Click "1. BASE04_Dropdown_Scorable.zip".\n2. Open Exercise 1\'s dropdown and choose "is doing".\n3. Click Check.',
    data: 'Option: "is doing"',
    expected: 'The activity view opens (title BASE04_Dropdown_Scorable.zip, Close Activity ×); the dropdown shows the chosen value; Check appears once an option is chosen and grades the response (Next is offered).',
    remarks: SEEN + ' No Check button is rendered until an option is chosen. The rich dropdown closes when the page scrolls — the option is clicked at its centre.',
  },
  {
    id: 'TST_NLPP_TC_5', req: R(3), type: 'Positive', priority: 'High',
    title: 'Verify Next advances to the following exercise and its dropdowns register their answers when checked',
    pre: 'The previous exercise has been checked (Next offered).',
    steps: '1. Click Next.\n2. Answer every dropdown of the exercise.\n3. Click Check.\n(Run for Exercises 2, 3 and 4.)',
    data: 'Ex 2: "is doing" · Ex 3/4 in order: "in the middle of the country", "I found a job at a big", "six months ago", "also a little scary sometimes"',
    expected: 'Next shows the next exercise; every dropdown shows its value (Ex 3/4: four each); Check grades it.',
    remarks: SEEN + ' Also covers the exercise steps of TC-NLP-004.',
  },
  {
    id: 'TST_NLPP_TC_6', req: R(4), type: 'Positive', priority: 'High',
    title: 'Verify the result screen reads "You scored 4 out of 4" when every exercise of the scorable activity is answered correctly',
    pre: 'Exercise 4 has been checked.',
    steps: '1. Click Next.',
    data: '—',
    expected: 'The result screen: "Amazing!" and "You scored 4 out of 4 and won a gold medal.", with "Next activity" and "Review answers".',
    remarks: SEEN + ' The sheet\'s "Amazing! You scored 4 out of 4" is on two lines (h2 + p.score). In NLP a finished scorable REOPENS as a fresh attempt (the classic LP does not offer it again).',
  },
  {
    id: 'TST_NLPP_TC_7', req: R(5), type: 'Positive', priority: 'High',
    title: 'Verify the flashcard deck pages to its last card and offers the NEXT ACTIVITY bridge when opened via "Next activity"',
    pre: 'The scorable\'s result screen is shown.',
    steps: '1. Click "Next activity".\n2. Click Next, letting each card change settle, until the last card.',
    data: '—',
    expected: 'Flashcards.zip opens (6 cards); the deck reaches its last card; no Check is offered; "NEXT ACTIVITY" appears.',
    remarks: SEEN + ' A Next within ~1.8 s of a card change is ignored by the player (classic LP measurement, same engine) — each change is followed by a 2.5 s settle; the loop is driven by the deck state, not a fixed count.',
  },
  {
    id: 'TST_NLPP_TC_8', req: R(6), type: 'Positive', priority: 'High',
    title: 'Verify the Practice Set shows a "Submitted" badge with the answer when it is submitted and confirmed',
    pre: 'The flashcard deck offers NEXT ACTIVITY. The learner has never submitted this PS.',
    steps: '1. Click NEXT ACTIVITY.\n2. Type the answer in the PS editor.\n3. Click Submit.\n4. Confirm with Submit in "Ready to submit?".',
    data: 'Answer: "Submitting PS activity"',
    expected: 'The PS opens with Submit disabled while empty; after typing Submit is enabled; "Ready to submit?" opens; after confirming, the PS shows "Learner User · <date · time> · 3 words · Submitted" and the answer read-only.',
    remarks: SEEN + ' ONE submission per learner. The TOC row keeps an in-progress icon until the PS is marked.',
  },
  {
    id: 'TST_NLPP_TC_9', req: R(7), type: 'Positive', priority: 'Medium',
    title: 'Verify Close Activity returns to the NLP table of contents and its Cambridge One Home logo returns to the dashboard with its profile menu',
    pre: 'The learner is inside a Projects activity (after submitting the PS).',
    steps: '1. Observe the activity header.\n2. Click Close Activity (×).\n3. Click the Cambridge One Home logo.',
    data: '—',
    expected: '1. The activity header has only the logo and × — no profile menu.\n2. The NLP table of contents is shown.\n3. The learner dashboard opens with its profile menu.',
    remarks: SEEN + ' The TOC page itself also carries the logo and a profile menu (productView-2); the activity view does not.',
  },
  {
    id: 'TST_MRKQ_TC_1', req: R(8), type: 'Positive', priority: 'High',
    title: 'Verify the class shows work to mark and the queue lists the learner\'s Projects PS',
    pre: PRE_TEACHER + ' The learner submitted the Projects PS at least ~5 minutes ago.',
    steps: '1. Open class <NLP_CLASS_NAME>.\n2. Wait until the "<n> Marking" link shows ≥ 1 (reload).\n3. Open Marking → "Projects (1) cqaautomationbundle1" → "Unit 1: Lesson 1 / PS" → the learner\'s submission.',
    data: 'Course "Projects" · item "Unit 1: Lesson 1 / PS" · learner "Learner User"',
    expected: '"Unmarked (1)"; the Projects course, the PS item and the learner\'s submission are listed; the marking screen opens with the score pre-filled 70.',
    remarks: REUSED + ' ' + SEEN + ' The submission reached the queue ~4 min after it was made.',
  },
  {
    id: 'TST_MRKQ_TC_2', req: R(8), type: 'Positive', priority: 'High',
    title: 'Verify the Projects PS shows as marked and the unmarked count drops to 0 when the teacher sends a score with feedback',
    pre: 'TST_MRKQ_TC_1 — the marking screen of the learner\'s Projects PS is open.',
    steps: '1. Set the score 70.\n2. Type the feedback "Good".\n3. Send → confirm "Ready to send?".',
    data: 'Score 70 · feedback "Good"',
    expected: 'The submission shows "Score : 70 %" and the teacher block "Score: 70 % Feedback: Good"; the tab reads "Unmarked (0)".',
    remarks: REUSED + ' Mutates the run\'s own data only. Same marking screen as the classic LP (LP-035), confirmed by run 1. The run makes two submissions, so the PS is marked first and one stays unmarked ("Unmarked (1)").',
  },
  {
    id: 'TST_PROG_TC_1', req: R(9), type: 'Positive', priority: 'Medium',
    title: 'Verify the learner\'s "My progress" shows the Projects figures after the marked PS',
    pre: PRE_LEARNER + ' The scorable, the flashcards and the (marked) PS of Projects are done.',
    steps: '1. In the class card click "My progress".\n2. Read the summary and the Projects block (reload until the batch figures settle, ≤ 10 min).',
    data: 'See newLearningPathData.json C1.nlpProgress',
    expected: 'Summary "Completed activities: 5/11", "Activities completed above target score : 3/5", "87% Average score"; Projects block "Completed activities: 5/6", "3 Gold medals", "87%" (scorable 100 %, flashcards, PS 70, HTML, PDF, Group PS 90 — Projects counts 6 of its 7 activities).',
    remarks: REUSED + ' Figures seen live 2026-09-25 (re-read on run 2\'s users after the Projects update: Class qjug, learner _r4cx). The summary totals lag by minutes (batch analytics) — re-read until settled. Projects counts GOLD MEDALS where Practice Extra counts above/below target.',
  },
  {
    id: 'TST_PROG_TC_6', req: R(9), type: 'Positive', priority: 'Medium',
    title: 'Verify the learner\'s per-activity Projects progress shows each activity\'s result after marking',
    pre: 'TST_PROG_TC_1 — "My progress" is open.',
    steps: '1. Click the product card.\n2. Open "Projects".\n3. Read each activity row.',
    data: 'Component "Projects"',
    expected: 'Scorable "First score 100% · Best score 100% · Attempts 1"; Flashcards "Viewed"; PS "First score 70% · Best score 70% · Attempts 1"; HTML and PDF "Viewed"; Group PS "First score 90% · Best score 90% · Attempts 1".',
    remarks: REUSED + ' Before marking (seen 2026-09-25) the PS read "First score - · Best score - · Attempts 1".',
  },
  {
    id: 'TST_PROG_TC_5', req: R(9), type: 'Positive', priority: 'Medium',
    title: 'Verify the learner\'s bell shows "New feedback" and it opens the marked Projects PS with the score and feedback',
    pre: 'The teacher marked the Projects PS (TST_MRKQ_TC_2).',
    steps: '1. Open the bell.\n2. Click the "New feedback" notification.',
    data: 'Score 70 · feedback "Good"',
    expected: 'The bell lists "New feedback · PS · Your teacher has sent you some feedback" (and a separate one for the Group PS); it opens the PS showing "Score : 70 %" and the teacher block "Score: 70 % Feedback: Good".',
    remarks: REUSED + ' Notification texts seen live 2026-09-25; the item is picked by the text "New feedback PS Your teacher" ("… Group PS …" does not match it).',
  },
  {
    id: 'TST_PROG_TC_3', req: R(10), type: 'Positive', priority: 'Medium',
    title: 'Verify the teacher\'s Class data shows the class and learner figures for the Projects work after marking',
    pre: PRE_TEACHER + ' The learner\'s Projects PS is marked.',
    steps: '1. Open class <NLP_CLASS_NAME> (Class data).\n2. Read the class metrics and the learner\'s card (reload until settled, ≤ 10 min).',
    data: 'See C1.nlpProgress',
    expected: 'Class "Average completed activities: 27%", "4 /6", "88%"; learner A "Completed activities: 5/11", "3/5", "87%"; learner B "Completed activities: 1/11", "1/1", "90%" (the group mark); "Show progress details": B\'s Projects "1/6", "1 Gold medal", "90%".',
    remarks: REUSED + ' Seen live 2026-09-25 (run 4). Learner B is credited with the group\'s mark only when B has launched the components: the setup has learner B launch Practice Extra and Projects right after accepting, before any group work (user fix 2026-09-25 — on run 2, without it, B stayed 0/5 and the class 20%).',
  },
  {
    id: 'TST_PROG_TC_7', req: R(10), type: 'Positive', priority: 'Medium',
    title: 'Verify "Show progress details" shows the learner\'s Projects figures',
    pre: 'TST_PROG_TC_3 — Class data is open.',
    steps: '1. Switch on "Show progress details".\n2. Read the learner\'s Projects block.',
    data: 'See C1.nlpProgress',
    expected: 'Learner A\'s Projects block: "Completed activities: 5/6", "3 Gold medals", "87%".',
    remarks: REUSED,
  },
  {
    id: 'TST_PROG_TC_4', req: R(10), type: 'Positive', priority: 'Medium',
    title: 'Verify the teacher\'s per-activity view of the learner\'s Projects matches the learner\'s',
    pre: 'TST_PROG_TC_3 — Class data is open.',
    steps: '1. Click the learner\'s product title.\n2. Open "Projects".\n3. Read each activity row.',
    data: 'Component "Projects"',
    expected: 'The same rows as TST_PROG_TC_6.',
    remarks: REUSED,
  },
  {
    id: 'TST_DASH_TC_13', req: R(11), type: 'Positive', priority: 'High',
    title: 'Verify Projects is available in the class card with no activation-code prompt when the learner joined via the SLE invite',
    pre: 'The learner has just accepted the class invite (never entered an activation code).',
    steps: '1. Go to the dashboard.\n2. Look at the card of class <NLP_CLASS_NAME>.',
    data: 'Class <NLP_CLASS_NAME> · component "Projects"',
    expected: 'The class card lists "Projects"; no activation-code input is shown.',
    remarks: REUSED + ' Opening Projects (TST_DASH_TC_17) then never asks for a code either.',
  },
  {
    id: 'TST_NLPP_TC_10', req: R(12), type: 'Positive', priority: 'High',
    title: 'Verify a teacher can preview the NLP component and open its activities when it is launched from the class Materials tab',
    pre: PRE_TEACHER,
    steps: '1. Open class <NLP_CLASS_NAME> → Materials.\n2. Click "Projects" in cqaautomationbundle1.\n3. Open "1. BASE04_Dropdown_Scorable.zip", then Close Activity.',
    data: 'Bundle "cqaautomationbundle1" · component "Projects"',
    expected: '/nlp/teacher/…/class/<id>/product/… opens with the NLP table of contents (and Back); the activity loads in the player; × returns to the TOC.',
    remarks: SEEN + ' The sheet\'s product "R55 Multi Component Umbrella" replaced by the run\'s own bundle (user decision 2026-09-25). Nothing is saved; a preview creates no learner progress.',
  },
  {
    id: 'TST_MSAC_TC_1', req: R(13), type: 'Positive', priority: 'Low',
    title: 'Verify the Projects component opens in rule-creation mode with its TOC when chosen in Manage student access > Create access rule',
    pre: PRE_TEACHER + ' Class Materials tab open.',
    steps: '1. Click "Manage student access" of cqaautomationbundle1.\n2. Click "Create access rule".\n3. Choose "Projects".',
    data: 'Bundle "cqaautomationbundle1" · component "Projects"',
    expected: 'Projects opens in the rule-creation player (/learning-path/teacher/…/create-access) with its TOC, "Select all units", Cancel and Continue.',
    remarks: REUSED + ' ' + SEEN + ' Rule creation opens Projects in the CLASSIC LP player, not the NLP one. Continue is never clicked — no rule is created.',
  },
  {
    id: 'TST_NLPP_TC_11', req: R(14), type: 'Positive', priority: 'High',
    title: 'Verify a teacher can preview the NLP component and open its activities when it is launched from My library',
    pre: PRE_TEACHER,
    steps: '1. Open My library, search "cqaautomationbundle1", click its title, then View details.\n2. Click the Projects tile.\n3. Open an activity, then Close Activity.',
    data: 'Product "cqaautomationbundle1" · component "Projects"',
    expected: '/nlp/teacher/…/product/… opens with the NLP TOC; the activity loads; × returns to the TOC.',
    remarks: SEEN,
  },
  {
    id: 'TST_NLPP_TC_12', req: R(15), type: 'Positive', priority: 'High',
    title: 'Verify a school admin can preview the NLP component and open its activities when it is launched from the Library tab\'s See materials',
    pre: PRE_ADMIN,
    steps: '1. Check the Library tab\'s School licence section.\n2. Search "cqaautomationbundle1".\n3. Click "See materials" on the product.\n4. Click the Projects tile; open an activity, then Close Activity.',
    data: 'Product "cqaautomationbundle1" · component "Projects"',
    expected: '1. The School licence section is shown.\n2. The heading shows "Showing search results for cqaautomationbundle1".\n3. The product\'s components are listed.\n4. The NLP preview opens with its TOC; the activity loads; × returns to the TOC.',
    remarks: 'Confirmed by run 1 (2026-09-25): the admin preview uses the same /nlp/teacher/…/product/… route. Product replaced as TST_NLPP_TC_10. The sheet\'s "All course materials" label is not asserted (admin-library-tab.md).',
  },
  {
    id: 'TST_NLPP_TC_2', req: R(16), type: 'Positive', priority: 'High',
    title: 'Verify the NLP table of contents is a single vertical page with a numbered unit, its lesson and numbered activities, and that the unit collapses and expands and an opened activity closes back to it',
    pre: PRE_LEARNER + ' Projects is open on its table of contents.',
    steps: '1. Read the TOC.\n2. Collapse the "1 Unit 1" section, then expand it.\n3. Open "1. BASE04_Dropdown_Scorable.zip", then Close Activity (×).',
    data: 'Activities: 1. BASE04_Dropdown_Scorable.zip · 2. Flashcards.zip · 3. PS · 4. Non-scorable HTML activity · 5. test pdf · 6. Collaborative Task · 7. Group PS',
    expected: '1. One page: numbered unit "1 Unit 1", lesson "Lesson 1" with a progress bar, then the seven numbered activities in order, a connector dot before each, medal icons on the scorable ones (1, 3, 7).\n2. The unit collapses (activities hidden) and expands again.\n3. The activity opens in the activity view (name + ×); × returns to the same TOC.',
    remarks: SEEN + ' This product has NO "Version" labels (the sheet\'s wording comes from another product).',
  },
  {
    id: 'TST_NLPP_TC_4', req: R(17), type: 'Positive', priority: 'Medium',
    title: 'Verify an unfinished scorable shows as in progress in the NLP table of contents and restores its checked answer when relaunched',
    pre: 'TST_NLPP_TC_3 — Exercise 1 checked, activity not finished.',
    steps: '1. Click Close Activity (×).\n2. Look at the scorable\'s TOC row and the unit status.\n3. Relaunch the scorable.',
    data: '—',
    expected: '2. The row shows the in-progress icon (no tick, medal not started); the unit reads "In progress".\n3. The scorable reopens on Exercise 1 with "is doing" kept and checked, and offers Next.',
    remarks: SEEN + ' The sheet\'s "Saved" state = this in-progress icon and re-landing where the learner left (as the classic LP, LP-025); no "Saved" text is shown.',
  },
  {
    id: 'TST_NLPP_TC_13', req: R(19), type: 'Positive', priority: 'Low',
    title: 'Verify the HTML activity renders and is marked completed in the NLP table of contents after a short dwell with no submit',
    pre: PRE_LEARNER + ' Projects is open on its table of contents; the HTML activity has never been opened by this learner.',
    steps: '1. Open "4. Non-scorable HTML activity" from the NLP TOC.\n2. Stay ~3 s.\n3. Click Close Activity (×) and look at its TOC row.',
    data: 'Activity "4. Non-scorable HTML activity"',
    expected: 'The HTML content renders in the activity view (only × and NEXT ACTIVITY — no Submit / Check); back on the TOC the row shows the completed tick.',
    remarks: 'Verified live 2026-09-25 after the product team added the HTML and PDF activities to Projects (learner _r4cx). The learner\'s progress row reads "Viewed" (Activity status: viewed).',
    comments: 'Unblocked 2026-09-25 (was Blocked: Projects had no HTML activity).',
  },
  {
    id: 'TST_NLPP_TC_14', req: R(20), type: 'Positive', priority: 'Low',
    title: 'Verify the PDF activity opens its download page and is marked completed in the NLP table of contents without downloading',
    pre: PRE_LEARNER + ' Projects is open on its table of contents; the PDF activity has never been opened by this learner.',
    steps: '1. Open "5. test pdf" from the NLP TOC.\n2. Read the page (do NOT click Download).\n3. Click Close Activity (×) and look at its TOC row.',
    data: 'Activity "5. test pdf" · file "Sample1.pdf"',
    expected: 'A download page: "Download the test pdf below and complete this activity", "Sample1.pdf", a Download link and NEXT ACTIVITY — no download starts; back on the TOC the row shows the completed tick.',
    remarks: 'Verified live 2026-09-25 (learner _r4cx). The sheet\'s "PDF renders/opens" does not hold: the NLP, like the classic LP (LP-022), shows a download page, and landing on it completes the activity. The sheet\'s "CSP-6967.pdf" is another product\'s file. Progress row: "Viewed".',
    comments: 'Unblocked 2026-09-25 (was Blocked: Projects had no PDF activity).',
  },
];

module.exports = { REQS, TCS, NOT_COVERED, ALSO };

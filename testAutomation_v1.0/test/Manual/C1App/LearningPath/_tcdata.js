/**
 * Source of truth for the Learning Path (Practice Extra) manual test-case set.
 * Both the .md document and the .xlsx register are generated from this file (SKILL golden rule 6):
 *   node test/Manual/C1App/LearningPath/_generate.js
 *
 * Scenarios: playwright-automation-c1 `test-scenarios/lp-scenarios.xlsx`, rows TC-LP-001…006
 * (batch 1, agreed with the user 2026-09-22). Modules: DASH (dashboard.page.js) for the entry click,
 * PEXT (practiceExtra.page.js) for the player.
 */

const PRE_LEARNER =
  'Production (www.cambridgeone.org). A run-generated learner (<LP_LEARNER_EMAIL>, "{{run.lpLearnerEmail}}") '
  + 'has accepted a teacher\'s invite to class <LP_CLASS_NAME> on the School-Level-Licence school '
  + '"MQA Sierra School" (MQA-ABC-DEF); the class uses product "cqaautomationbundle1". The learner is logged in '
  + 'on the dashboard (guided tour closed).';
const PRE_PLAYER = 'As TC_1 has been completed: the learner is inside Practice Extra, on the Learning Path unit view.';
// [2026-09-22] Was "[ASSUMED — SOURCE-verified]"; confirmed by our own runs on production —
// debug run on learner _ajq1 and the full first-time run (learner _jqh2, 53/53).
const SRC = 'Verified live 2026-09-22 (production) — learner _ajq1 (debug) and a brand-new learner _jqh2 (full run). '
  + 'Flow taken from playwright-automation-c1.';

// Execution attribution (Tester columns) — the suite ran green end to end on 2026-09-22.
const RUN = 'Automated — npm run learningPathTest_prod (production). Last full run 2026-09-22: 53/53 passing '
  + '(teacher _w1b7, Class vyi9, learner _jqh2).';

const REQS = [
  '#LP-001 — Learner navigates from the class dashboard into the Learning Path via "Practice Extra"',
  '#LP-002 — Learner answers the scorable activity\'s first frame via its dropdown and checks it',
  '#LP-003 — Learner completes all four frames of the scorable dropdown gap-fill activity',
  '#LP-004 — A Frame 3/4 dropdown that fails to reach its "filled" state surfaces a clear diagnostic error',
  '#LP-005 — Learner opens the Table of Contents (TOC) sidebar from the unit view',
  '#LP-006 — Learner closes the TOC sidebar via its close control',
];

const TCS = [
  {
    id: 'TST_DASH_TC_14', req: REQS[0], type: 'Positive', priority: 'High',
    title: 'Verify the Learning Path player page opens when the learner clicks "Practice Extra" in the class card',
    pre: PRE_LEARNER + ' Practice Extra has never been opened by this learner (first-time state).',
    steps: '1. On the learner dashboard, locate the card of class <LP_CLASS_NAME>.\n'
      + '2. Click the "Practice Extra" tile inside that card.\n'
      + '3. If "We\'re setting up the learning materials for you" is shown, wait for it to clear.',
    data: 'Class: <LP_CLASS_NAME> · Component: "Practice Extra"',
    expected: 'The Learning Path (Practice Extra) page opens. On a first launch a one-time '
      + '"setting up the learning materials" screen may show first and then clears (SOURCE saw up to ~3 min on thor; '
      + 'not observed on production — the player opened in ~9 s on a first entry).',
    remarks: SRC + ' The tile is found INSIDE the named class card: once a product is active, other class cards can list the same component.',
  },
  {
    id: 'TST_PEXT_TC_1', req: REQS[0], type: 'Positive', priority: 'High',
    title: 'Verify the activity player is shown when Practice Extra is opened',
    pre: 'As TST_DASH_TC_14 has been completed (Practice Extra just opened).',
    steps: '1. Observe the Learning Path page.',
    data: '—',
    expected: 'The activity iframe (div#content-course-ext iframe) is rendered.',
    remarks: 'Verified live 2026-09-22 (production, learner _ajq1). The TOC sidebar opens by itself ONLY on a learner\'s '
      + 'first entry (unit view); later entries start with it closed — so the TOC is not part of this check '
      + '(SOURCE asserted it; the scenario\'s expected result is the player).',
  },
  {
    id: 'TST_PEXT_TC_4', req: REQS[1], type: 'Positive', priority: 'High',
    title: 'Verify Frame 1\'s dropdown shows the chosen answer when it is selected and checked',
    pre: PRE_PLAYER + ' The scorable activity has never been attempted by this learner.',
    steps: '1. Open Frame 1\'s dropdown.\n2. Select "is doing".\n3. Click the green Check button.',
    data: 'Frame 1 answer: "is doing"',
    expected: 'The dropdown shows "is doing" as its value and Check grades the response.',
    remarks: SRC + ' Scrolling the page while the dropdown is open closes it — the option must be clicked without scrolling. '
      + 'Check/Next are on the OUTER page, not inside the iframe. One attempt per learner: a finished (or half-finished) activity is not offered fresh again.',
  },
  {
    id: 'TST_PEXT_TC_5', req: REQS[2], type: 'Positive', priority: 'High',
    title: 'Verify Frame 2 opens and accepts its answer when Next is clicked after Frame 1',
    pre: 'As TST_PEXT_TC_4 has been completed.',
    steps: '1. Click Next.\n2. In Frame 2 open the dropdown and select "is doing".\n3. Click Check.',
    data: 'Frame 2 answer: "is doing"',
    expected: 'Frame 2\'s content is shown after Next; its dropdown shows "is doing" after selection.',
    remarks: SRC,
  },
  {
    id: 'TST_PEXT_TC_6', req: REQS[2], type: 'Positive', priority: 'High',
    title: 'Verify all four Frame 3 dropdowns reach the filled state when each is answered',
    pre: 'As TST_PEXT_TC_5 has been completed.',
    steps: '1. Click Next.\n2. Answer the four Frame 3 dropdowns in order.\n3. Click Check.',
    data: 'Frame 3 answers, in order: "in the middle of the country", "I found a job at a big", "six months ago", "also a little scary sometimes"',
    expected: 'Each Frame 3 dropdown reaches its "filled" state (.wrapper-dropdown.filled) after its answer is chosen.',
    remarks: SRC + ' Content-specific: tied to one unit\'s authored text in cqaautomationbundle1.',
  },
  {
    id: 'TST_PEXT_TC_7', req: REQS[2], type: 'Positive', priority: 'High',
    title: 'Verify all four Frame 4 dropdowns reach the filled state when each is answered',
    pre: 'As TST_PEXT_TC_6 has been completed.',
    steps: '1. Click Next.\n2. Answer the four Frame 4 dropdowns in order.\n3. Click Check.',
    data: 'Frame 4 answers, in order: "in the middle of the country", "I found a job at a big", "six months ago", "also a little scary sometimes"',
    expected: 'Each Frame 4 dropdown reaches its "filled" state after its answer is chosen.',
    remarks: SRC,
  },
  {
    id: 'TST_PEXT_TC_8', req: REQS[2], type: 'Positive', priority: 'High',
    title: 'Verify the learner is shown a full score when the last frame is completed',
    pre: 'As TST_PEXT_TC_7 has been completed.',
    steps: '1. Click Next.',
    data: '—',
    expected: 'The result screen reads "You scored 4 out of 4" (p.score, on the outer page).',
    remarks: SRC + ' SOURCE saw the full message as "Amazing! You scored 4 out of 4".',
  },
  {
    id: 'TST_PEXT_TC_2', req: REQS[4], type: 'Positive', priority: 'Medium',
    title: 'Verify the TOC sidebar is shown when the open-sidebar control is clicked',
    pre: PRE_PLAYER + ' The TOC sidebar is closed.',
    steps: '1. Click the open-sidebar control (the "1.1 <activity>" breadcrumb, a.open-sidebar-btn).',
    data: '—',
    expected: 'The TOC sidebar (div.sidebar.bg-white) becomes visible, exposing the unit/activity navigation.',
    remarks: 'Verified live 2026-09-22 (production). Opening from the breadcrumb shows the LESSON view of the TOC.',
  },
  {
    id: 'TST_PEXT_TC_3', req: REQS[5], type: 'Positive', priority: 'Medium',
    title: 'Verify the TOC sidebar is hidden when its close control is clicked',
    pre: PRE_PLAYER + ' The TOC sidebar is open.',
    steps: '1. Click the cross labelled "Close table of contents" at the top of the TOC.',
    data: '—',
    expected: 'The TOC sidebar closes (the app adds "d-none" to div.sidebar.bg-white).',
    remarks: 'Verified live 2026-09-22 (production). The cross is #unitViewCrossBtn in the unit view and #lessonViewCrossBtn in the lesson view; SOURCE\'s .unit-view-header a.close-sidebar no longer exists.',
  },
];

// Scenarios deliberately without a manual case.
const NOT_COVERED = {
  [REQS[3]]: 'none — automation-mechanics scenario (it checks the automation\'s own error message, not product '
    + 'behaviour, and its precondition — broken activity JS — cannot be forced). Not automated, by user decision 2026-09-22.',
};

// Every LP case ran green in the full run — record it in the Tester columns.
TCS.forEach((tc) => { tc.status = 'Pass'; tc.comments = RUN; });

module.exports = { TCS, REQS, NOT_COVERED, RUN };

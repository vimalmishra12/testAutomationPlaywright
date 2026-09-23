/**
 * Batch 2 — the remaining Learning Path scenarios of `lp-scenarios.xlsx` (TC-LP-007 … TC-LP-033),
 * designed 2026-09-22 so any team member can pick one up and automate it. Batch 1 (LP-001…006) lives
 * in _tcdata.js; both are emitted into the same "Test Cases" sheet by _generate.js.
 *
 * NOT DESIGNED AS CASES (automation-mechanics scenarios, like LP-004): LP-016, LP-017 — see NOT_COVERED.
 *
 * Grounding: these were NOT executed. Steps/expected results come from the scenario sheet and, where
 * it says so, from SOURCE's page objects. Everything the sheet itself calls "Not confirmed / inferred"
 * is marked [ASSUMED] here and must be confirmed live during Phase 1 of whoever automates it.
 * Module codes are the page object the case will belong to (AGENTS.md Rule 6); where no page object
 * exists yet the code is marked "proposed".
 */

const ASSUMED = '[ASSUMED] The scenario sheet states this behaviour is not confirmed — verify live before automating.';
const SRC = 'From SOURCE playwright-automation-c1 (live-verified by that team); confirm live when automating.';
const PRE_PLAYER = 'Learner (with an activated product and a joined class) is inside Practice Extra, on the Learning Path unit view.';
const PRE_TOC = PRE_PLAYER + ' The TOC sidebar is open (TST_PEXT_TC_2).';
// [2026-09-23] Batch A/C automated — expected results below were CONFIRMED LIVE on production (probe on
// learner _uyu7, then the Suite 8 debug run); where the sheet's assumption was wrong, the observed
// behaviour replaces it and Remarks say so. Status/comments are set from the full run.
const LIVE = 'Confirmed live on production 2026-09-23.';
const B2_RUN = 'Automated 2026-09-23 in learningPath.json Suite 8 (Suite 6 for DASH_TC_15). Debug run 21/21 (learner _uyu7); full runs 74/75 (learner _vcmw) and 75/75 (learner _iyit) — this case passed in both.';

const REQS = [
  '#LP-007 — Drilling into a unit from the open TOC sidebar reveals that unit\'s activity list',
  '#LP-008 — Learner opens a non-scorable activity (Flashcards) from the TOC',
  '#LP-009 — Learner pages through the non-scorable Flashcards activity to completion with no grading step',
  '#LP-010 — Learner opens the Practice Set (PS) activity from the TOC',
  '#LP-011 — Learner types a free-text answer and submits the PS via its two-step submit-then-confirm flow',
  '#LP-012 — A Parent-created Child account can complete the same Learning Path flow as a Learner',
  '#LP-013 — Clicking check on a scorable frame without selecting any dropdown option',
  '#LP-014 — Submitting the PS with an empty answer',
  '#LP-015 — Revisiting a Practice Set activity after it has already been submitted',
  '#LP-016 — Iframe load failure surfaces only a generic timeout (automation-mechanics)',
  '#LP-017 — Non-scorable paging\'s fixed 5-click assumption (automation-mechanics)',
  '#LP-018 — Closing the main lesson-view panel returns the learner out of the Learning Path view',
  '#LP-019 — Opening the TOC sidebar a second time without closing it first',
  '#LP-020 — A Learner without an activated product and joined class cannot reach "Practice Extra"',
  '#LP-021 — Learner launches an HTML activity within a PE component (auto-completes after a dwell)',
  '#LP-022 — Learner launches a PDF activity within a PE component (auto-completes after a dwell)',
  '#LP-023 — Learners and teacher collaborate via comments on a group-enabled Collab activity',
  '#LP-024 — Learner submits a Group PS; teacher marks it and analytics update at both ends',
  '#LP-025 — Exiting a Scorable activity before submitting saves it in a "Saved" in-progress state',
  '#LP-026 — Multi-level TOC (units > lessons > activities) expand/collapse and "Back" context',
  '#LP-027 — An SLE-activated PE/LP component shows no expiry date and a progress bar on launch',
  '#LP-028 — Teacher launches a Practice Extra component via the class Materials tab',
  '#LP-029 — Teacher launches an LP component from within the assignment-creation flow',
  '#LP-030 — Teacher launches an NLP component from within the assignment-creation flow',
  '#LP-031 — Teacher launches an LP component while creating lock rules via "Manage student access"',
  '#LP-032 — Teacher launches a Practice Extra component under a product via "My library"',
  '#LP-033 — Admin launches an LP component under an umbrella product via the Library tab',
];

const TCS = [
  { id: 'TST_PEXT_TC_9', req: REQS[0], type: 'Positive', priority: 'Medium',
    title: 'Verify a unit\'s activity list is revealed when the unit is opened from the TOC sidebar',
    pre: PRE_PLAYER + ' The TOC sidebar is open at its UNIT view (housekeeping TST_PEXT_TC_101 — the open control lands on the lesson view on every entry but the first).',
    steps: '1. Click the unit row "Unit 1" in the TOC unit view (.unit-level-item).',
    data: 'Unit "Unit 1"; activities of cqaautomationbundle1: BASE04_Dropdown_Scorable.zip, Flashcards.zip, PS, Non-scorable HTML activity, test pdf',
    expected: 'The TOC switches to the unit\'s lesson view (header "Unit 1", "Lesson 1" expanded) and lists all five activities; the unit list is no longer shown.',
    remarks: LIVE + ' Matches SOURCE LearningpathPage.goInsideUnit(). Precondition for LP-008 and LP-010.',
    status: 'Pass', comments: B2_RUN },

  { id: 'TST_PEXT_TC_10', req: REQS[1], type: 'Positive', priority: 'Medium',
    title: 'Verify the Flashcards activity opens when it is selected from the TOC',
    pre: PRE_TOC + ' The unit\'s activity list is showing (TST_PEXT_TC_9).',
    steps: '1. Click the entry named "Flashcards.zip" in the TOC card.',
    data: 'Activity: "Flashcards.zip" (product cqaautomationbundle1)',
    expected: 'The player\'s activity title reads "Flashcards.zip" and the flashcard deck (6 cards, step bar) loads in the activity iframe. The TOC stays open.',
    remarks: LIVE + ' Matches SOURCE LearningpathPage.openNonScorable().',
    status: 'Pass', comments: B2_RUN },

  { id: 'TST_PEXT_TC_11', req: REQS[2], type: 'Positive', priority: 'Medium',
    title: 'Verify the flashcard deck can be paged to the end with no grading step',
    pre: 'The Flashcards activity has just loaded (TST_PEXT_TC_10).',
    steps: '1. If the deck is not on its first card, go back with "Previous" (the deck remembers where the learner left it).\n2. Click "Next" once per card, waiting for the card to change, until the last card is current.',
    data: 'Deck of 6 cards (cqaautomationbundle1). No fixed click count — the loop follows the deck\'s step bar (LP-017).',
    expected: 'Each Next advances exactly one card, from the first to the last (6 of 6); on the last card the bar offers "Previous" and "NEXT ACTIVITY". No Check / grading control is offered at any point.',
    remarks: LIVE + ' A Next clicked within ~1.8 s of the previous card change is ignored (≥ 2.0 s always accepted) — the automation waits 2.5 s per card. Clicking "NEXT ACTIVITY" moves on to the PS.',
    status: 'Pass', comments: B2_RUN },

  { id: 'TST_PEXT_TC_12', req: REQS[3], type: 'Positive', priority: 'High',
    title: 'Verify the Practice Set answer screen opens when PS is selected from the TOC',
    pre: PRE_TOC + ' The unit\'s activity list is showing.',
    steps: '1. Click the entry named "PS" in the TOC card.',
    data: 'Activity: "PS"',
    expected: 'The player\'s activity title reads "PS" and the free-text answer screen is shown: instructions, an "Answer:" rich editor ("Type here …", B/I/U, "Word count: 0"), Save and Submit.',
    remarks: LIVE + ' The PS is NOT inside the activity iframe (outer page). Matches SOURCE LearningpathPage.openPS().',
    status: 'Pass', comments: B2_RUN },

  { id: 'TST_PEXT_TC_13', req: REQS[4], type: 'Positive', priority: 'High',
    title: 'Verify a Practice Set answer is accepted when it is typed and confirmed through the two-step submit',
    pre: 'The PS answer screen is open (TST_PEXT_TC_12).',
    steps: '1. Type an answer into the rich editor.\n2. Click the submit-answer button.\n3. Confirm in the follow-up modal.',
    data: 'Answer text: "Submitting PS activity"',
    expected: 'Typing enables Submit; Submit opens "Ready to submit?" ("…it won\'t be possible to make any changes to your work after it\'s submitted", Cancel / Submit); confirming closes it and the answer is shown read-only (div.attempted-answer = the typed text). The editor and Submit are gone; the TOC marks PS "evaluation pending".',
    remarks: LIVE + ' Matches SOURCE LearningpathPage.submitPS(). PS is free text and NOT auto-graded — the answer enters the teacher\'s marking queue. ONE ATTEMPT PER LEARNER: plan the run like the scorable activity.',
    status: 'Pass', comments: B2_RUN },

  { id: 'TST_PEXT_TC_14', req: REQS[5], type: 'Positive', priority: 'High', status: 'Blocked',
    title: 'Verify a Child account completes the same Learning Path flow as a directly-registered Learner',
    pre: 'A Child account created by a Parent ("Add child"), with an activated product and a joined class.',
    steps: '1. Log in as the child (username, no domain).\n2. Repeat the full Learning Path flow: Practice Extra → scorable activity → TOC → non-scorable activity → PS submission.',
    data: 'child_username (no domain); the password set during Add child',
    expected: 'The child completes the identical sequence with identical outcomes to a Learner — no role-specific differences in the Learning Path UI.',
    remarks: SRC + ' Deliberately one case, not one per sub-feature: the outcome is role-invariant.',
    comments: 'BLOCKED: no parent/child automation exists (parent/child is parked in the migration plan; SOURCE reports child creation failing on thor). Unblock = a Child account with product access, or the parent/child flow automated first.' },

  { id: 'TST_PEXT_TC_15', req: REQS[6], type: 'Negative', priority: 'Medium',
    title: 'Verify what happens when check is clicked on a scorable frame with no option selected',
    pre: 'Learner is on a scorable activity frame; no dropdown opened or selected.',
    steps: '1. Without opening or selecting any option, click the green check button.',
    data: '—',
    expected: ASSUMED + ' Inferred: the check is rejected / no-ops, or an explicit empty-answer state is shown.',
    remarks: 'Not exercised by SOURCE (it always selects an answer first). Capture the real copy when confirming, and keep it out of the same run as the happy-path scorable case (one attempt per learner).' },

  { id: 'TST_PEXT_TC_16', req: REQS[7], type: 'Negative', priority: 'Medium',
    title: 'Verify an empty Practice Set answer cannot be submitted',
    pre: 'The PS answer screen is open, editor left empty.',
    steps: '1. Leave the rich editor empty.\n2. Click the submit-answer button.',
    data: '—',
    expected: 'Submit is disabled while the editor is empty ("Word count: 0"): it is greyed out, clicking it opens no "Ready to submit?" dialog and nothing is submitted. No validation message is shown.',
    remarks: LIVE + ' Submit is disabled by CSS class only (class="btn disabled", no disabled attribute). Safe to run before TST_PEXT_TC_13 — it does not consume the learner\'s one PS submission. Not exercised by SOURCE.',
    status: 'Pass', comments: B2_RUN },

  { id: 'TST_PEXT_TC_17', req: REQS[8], type: 'Edge', priority: 'Medium',
    title: 'Verify a submitted Practice Set shows its answer and no fresh submit when it is revisited',
    pre: 'The learner has already submitted a PS answer for this activity.',
    steps: '1. Open another activity from the TOC (Flashcards.zip).\n2. Open the PS again from the TOC.',
    data: 'Away: "Flashcards.zip"; back: "PS"',
    expected: 'The submitted answer is shown read-only (the text that was submitted); there is no editor and no Submit, so no fresh submission is possible.',
    remarks: LIVE + ' Natural follow-on from LP-011 in the same run, since the PS is already submitted by then.',
    status: 'Pass', comments: B2_RUN },

  { id: 'TST_PEXT_TC_18', req: REQS[11], type: 'Positive', priority: 'Low',
    title: 'Verify closing the lesson-view panel closes the TOC and keeps the learner in the Learning Path',
    pre: 'Learner is inside the Learning Path with the TOC open on its lesson view.',
    steps: '1. Click the lesson-view close control (✕, #lessonViewCrossBtn).',
    data: '—',
    expected: 'The TOC closes; the learner stays in the Learning Path on the same activity (it does NOT leave the player). Leaving is done with the player\'s "Back" link — see TST_PEXT_TC_26.',
    remarks: LIVE + ' The scenario sheet assumed this control left the Learning Path; on production it only closes the TOC. SOURCE\'s closeMainSideBar() was dead code.',
    status: 'Pass', comments: B2_RUN },

  { id: 'TST_PEXT_TC_26', req: REQS[11], type: 'Positive', priority: 'Low',
    title: 'Verify the player\'s Back link returns the learner from the Learning Path to the dashboard',
    pre: 'Learner is inside the Learning Path (any activity), TOC closed.',
    steps: '1. Click "Back" (top left of the player).',
    data: '—',
    expected: 'The learner is returned to the learner dashboard (/dashboard/learner/dashboard).',
    remarks: 'APPENDED 2026-09-23 while automating LP-018: the scenario\'s intent ("return the learner out of the Learning Path view") is met by Back, not by the lesson-view close control. ' + LIVE,
    status: 'Pass', comments: B2_RUN },

  { id: 'TST_PEXT_TC_19', req: REQS[12], type: 'Edge', priority: 'Low',
    title: 'Verify the TOC sidebar stays in one consistent state when the open control is activated again while open',
    pre: 'The TOC sidebar is already open.',
    steps: '1. With the sidebar open, move keyboard focus to the open-sidebar control (the activity title link) and press Enter.\n2. Press Enter again.',
    data: '—',
    expected: 'The control is a toggle: the first Enter CLOSES the TOC, the second re-opens it. There is never more than one sidebar and the layout stays intact.',
    remarks: LIVE + ' While the TOC is open it covers the open control, so a mouse cannot click it again — only the keyboard can. The sheet assumed the TOC would simply stay open; it toggles instead (a consistent state, not a defect — flagged to the product owner to confirm).',
    status: 'Pass', comments: B2_RUN },

  { id: 'TST_DASH_TC_15', req: REQS[13], type: 'Negative', priority: 'Medium',
    title: 'Verify "Practice Extra" is not reachable for a learner with no activated product and no class',
    pre: 'A learner who has signed up and verified but has NOT joined a class or activated a product.',
    steps: '1. Log in as that learner (who has a pending class invite).\n2. Look for a class card and a "Practice Extra" entry point.',
    data: 'Class of the LP run (invited, not accepted); component "Practice Extra"',
    expected: 'The learner is NOT shown the dashboard: login routes straight to the "Invitations (1)" page, listing the invited class (Accept disabled until it is ticked). No class card and no "Practice Extra" entry point are shown.',
    remarks: 'Runs in the LP suite\'s Suite 6, after the learner logs in and BEFORE the invite is accepted (between TST_SNUP_TC_64 and TST_INVI_TC_4) — so only a full run exercises it; a --runData=last learner already has the class.',
    status: 'Pass', comments: 'Automated 2026-09-23 (Suite 6). First full run (learner _vcmw) failed on the test design — it expected the dashboard, but a learner with a pending invite is routed to the Invitations page; fixed, then full run 75/75 (learner _iyit) passed.' },

  { id: 'TST_PEXT_TC_20', req: REQS[14], type: 'Positive', priority: 'High', status: 'Not Run',
    title: 'Verify an HTML activity completes by itself after a short dwell',
    pre: 'A PE component containing an HTML activity; learner has access.',
    steps: '1. Log in as the learner.\n2. Launch the PE component.\n3. Navigate to the HTML activity.\n4. Wait about 3 seconds without interacting.',
    data: '—',
    expected: 'The HTML activity loads without error and is marked completed after the dwell, with no explicit submit.',
    remarks: '[LP Test Cases] TC_LRN_002. No page-object support in SOURCE; selectors must be captured live.',
    comments: 'UNBLOCKED 2026-09-23: the design-time blocker was wrong — cqaautomationbundle1\'s Practice Extra (Unit 1 > Lesson 1) DOES contain "Non-scorable HTML activity" (seen live on production). Ready to automate in a later batch (was: "needs a product whose PE component contains an HTML activity").' },

  { id: 'TST_PEXT_TC_21', req: REQS[15], type: 'Positive', priority: 'High', status: 'Not Run',
    title: 'Verify a PDF activity completes by itself after a short dwell',
    pre: 'A PE component containing a PDF activity; learner has access.',
    steps: '1. Log in as the learner.\n2. Launch the PE component.\n3. Navigate to the PDF activity.\n4. Wait about 3 seconds without interacting.',
    data: '—',
    expected: 'The PDF activity loads without error and is marked completed after the dwell, with no explicit submit.',
    remarks: '[LP Test Cases] TC_LRN_002. No page-object support in SOURCE.',
    comments: 'UNBLOCKED 2026-09-23: cqaautomationbundle1\'s Practice Extra (Unit 1 > Lesson 1) contains "test pdf", marked "Downloadable item" in the TOC — confirm live whether it opens in the player or downloads (the expected result may need to change). Ready to automate in a later batch.' },

  { id: 'TST_PEXT_TC_22', req: REQS[16], type: 'Positive', priority: 'High', status: 'Blocked',
    title: 'Verify learners and the teacher see each other\'s comments in a group-enabled Collab activity',
    pre: 'A group-enabled PE component with a Collab activity; two learners with product access in the same class and in one group.',
    steps: '1. Learner 1 launches the Collab activity and adds a comment.\n2. Learner 2 opens the same activity, sees Learner 1\'s comment and adds one.\n3. Teacher opens the class → class material → the same component and activity.\n4. Teacher selects the group, sees both comments and adds one.\n5. Learner 1 sees the teacher\'s comment.\n6. Learner 1 marks the activity ready/submitted.',
    data: '—',
    expected: 'Every participant sees the others\' comments in the Collab activity, and the activity is marked completed once submitted.',
    remarks: '[LP Test Cases] TC_LRN_003. Multi-actor (2 learners + teacher) — plan the run accordingly.',
    comments: 'BLOCKED: needs a group-enabled component with a Collab activity, 2 learners and a class group. Class groups are not automated yet (planned as a separate module). Unblock = that product/data plus group creation.' },

  { id: 'TST_PEXT_TC_23', req: REQS[17], type: 'Positive', priority: 'High', status: 'Blocked',
    title: 'Verify a Group PS is marked like an individual PS and the score reaches both learners and the teacher\'s analytics',
    pre: 'A group-enabled PE component with a Group PS; two learners with product access in the same class and in one group.',
    steps: '1. Learner 1 submits the Group PS.\n2. Teacher marks it in the Marking Queue (score + comment).\n3. Both learners check their progress page for the score.\n4. Teacher checks that class analytics reflect the mark.',
    data: '—',
    expected: 'The Group PS is marked like a normal PS and the score/analytics appear for both learners and in the teacher\'s class view.',
    remarks: '[LP Test Cases] TC_LRN_003. Depends on marking + analytics, which are separate un-migrated areas.',
    comments: 'BLOCKED: as TST_PEXT_TC_22, plus the teacher marking queue and analytics are not automated yet.' },

  { id: 'TST_PEXT_TC_24', req: REQS[18], type: 'Positive', priority: 'Medium',
    title: 'Verify an unfinished scorable activity is kept in a "Saved" state and restores its answers on relaunch',
    pre: 'A PE component with a scorable activity the learner has NOT completed.',
    steps: '1. Log in as the learner and open Practice Extra → a unit → a lesson.\n2. Launch the scorable activity and answer part of it without completing.\n3. Exit back to the TOC.\n4. Relaunch the same activity.',
    data: 'Use the same answers as TST_PEXT_TC_4 (frame 1) — stop before the final Next.',
    expected: ASSUMED + ' Inferred from the sheet: the TOC shows the activity as "Saved" (in progress), not complete/scored, and relaunching restores the answers already entered.',
    remarks: 'Needs a learner whose scorable activity is untouched — mutually exclusive with LP-002/003 in the same run (one attempt per learner). Plan a dedicated learner, or run this INSTEAD of the full scorable pass.' },

  { id: 'TST_PEXT_TC_25', req: REQS[19], type: 'Positive', priority: 'Medium',
    title: 'Verify a multi-level TOC expands, collapses and returns to the right level with "Back"',
    pre: 'A PE/LP component whose TOC has units containing lessons containing activities.',
    steps: '1. With the TOC on the lesson view of "Unit 1" (after TST_PEXT_TC_9), click the "Lesson 1" heading to collapse it.\n2. Click it again to expand it.\n3. Click "Go to unit view" (‹ in the TOC).\n4. Click "Unit 1" again.',
    data: 'Unit "Unit 1", lesson "Lesson 1", the five activities of TST_PEXT_TC_9',
    expected: 'Collapsing hides the lesson\'s activities and expanding shows them again; "Go to unit view" replaces the lesson view with the unit list; opening "Unit 1" again returns to the same lesson with the same five activities.',
    remarks: '[LP Test Cases] TC_LRN_005. ' + LIVE + ' cqaautomationbundle1 has three levels (Unit 1 > Lesson 1 > activities). Units do not collapse in place — a unit opens its own lesson view, and "Go to unit view" is the level-up ("Back") control. Opening an activity keeps the TOC on the same lesson view.',
    status: 'Pass', comments: B2_RUN },

  { id: 'TST_DASH_TC_16', req: REQS[20], type: 'Positive', priority: 'High',
    title: 'Verify an SLE-activated component shows no expiry date and a loading indicator while it launches',
    pre: 'A learner on a School-Level-Licence school (e.g. MQA Sierra School) with the SLE-activated PE component on the dashboard.',
    steps: '1. Log in as the learner.\n2. Locate the SLE-activated PE component on the dashboard.\n3. Check whether an expiry date is shown under it.\n4. Launch the component and watch the loading sequence.',
    data: 'Class of the LP run; component "Practice Extra"',
    expected: 'No expiry date on the SLE-activated component (the tile reads "Practice Extra / Continue learning"; the class card shows only the class start → end dates). Launching shows a loading SPINNER for about a second, then the Learning Path player opens.',
    remarks: LIVE + ' The sheet expected a PROGRESS BAR; production shows a spinner (div.loader, ~0.2–1.1 s after the click) — no progress bar was observed (flagged to the product owner). The SLE half is already proven by TST_DASH_TC_13. False-green trap: ".progress-container" is the permanent "See Progress" card.',
    status: 'Pass', comments: B2_RUN },

  { id: 'TST_CMAT_TC_7', req: REQS[21], type: 'Positive', priority: 'High',
    title: 'Verify a teacher can launch a Practice Extra component from the class Materials tab',
    pre: 'Teacher in a class whose product contains an LP component.',
    steps: '1. Log in as the teacher.\n2. Open the class from the teacher dashboard.\n3. Open the "Materials" tab.\n4. Expand the product and click the Practice Extra component.',
    data: 'Class of the LP run; product cqaautomationbundle1',
    expected: ASSUMED + ' The component launches for the teacher and its TOC renders, so the teacher can preview activities without submitting.',
    remarks: '[LP Test Cases] TC_TCH_001. Module CMAT (classMaterials.page.js) already exists for the Materials tab; the LP launch from it is new. Teacher preview must not create learner progress — confirm.' },

  { id: 'TST_C1AS_TC_26', req: REQS[22], type: 'Positive', priority: 'High',
    title: 'Verify a teacher can launch an LP component from the assignment-creation flow',
    pre: 'Teacher in a class whose product contains an LP component.',
    steps: '1. Log in as the teacher and open the class.\n2. Open the "Assignments" tab.\n3. Click "Create assignment".\n4. Select and launch the LP component inside the flow.',
    data: 'Class of the LP run',
    expected: ASSUMED + ' The LP component launches for the teacher and its TOC renders inside assignment creation.',
    remarks: '[LP Test Cases] TC_TCH_002. Module C1AS (c1assignment) covers assignments today; check its existing TCs before adding selectors.' },

  { id: 'TST_C1AS_TC_27', req: REQS[23], type: 'Positive', priority: 'High', status: 'Blocked',
    title: 'Verify a teacher can launch an NLP component from the assignment-creation flow',
    pre: 'Teacher in a class with at least one NLP (Projects) component.',
    steps: '1. Log in as the teacher and open the class.\n2. Open the "Assignments" tab.\n3. Click "Create assignment".\n4. Select and launch the NLP component.',
    data: '—',
    expected: ASSUMED + ' The component launches in the LP app/view and its TOC renders.',
    remarks: '[LP Test Cases] TC_TCH_003. The sheet marks the whole scenario an ASSUMPTION — confirm with product/design that NLP appears here at all.',
    comments: 'BLOCKED: NLP/Projects is not automated anywhere yet, and the sheet flags the scenario itself as unverified. Unblock = confirm the flow exists, then automate after the NLP player.' },

  { id: 'TST_MSAC_TC_1', req: REQS[24], type: 'Positive', priority: 'High',
    title: 'Verify a teacher can launch an LP component while creating a lock rule in "Manage student access"',
    pre: 'Teacher in a class with a product added; "Manage student access" available under Materials.',
    steps: '1. Log in as the teacher and open the class.\n2. Open the "Materials" tab and click "Manage student access".\n3. Start creating a lock/unlock rule and launch the LP component from that flow.',
    data: 'Class of the LP run',
    expected: ASSUMED + ' The LP component launches for the teacher and its TOC renders.',
    remarks: '[LP Test Cases] TC_TCH_004. Module code MSAC is PROPOSED — no page object exists for "Manage student access"; agree the code when the page object is created (AGENTS.md Rule 6). Creating a lock rule changes class state — decide before running whether the rule is removed afterwards (ADR-021).' },

  { id: 'TST_TLIB_TC_1', req: REQS[25], type: 'Positive', priority: 'High',
    title: 'Verify a teacher can launch a Practice Extra component from "My library"',
    pre: 'Teacher whose "My library" contains the product.',
    steps: '1. Log in as the teacher.\n2. Open the "My library" tab on the teacher dashboard.\n3. Find/search the product.\n4. Open the product ("View details" / bundle view).\n5. Launch the Practice Extra component.',
    data: 'Product cqaautomationbundle1',
    expected: ASSUMED + ' The component launches for the teacher and its TOC renders.',
    remarks: '[LP Test Cases] TC_TCH_005. Module code TLIB is PROPOSED — no page object exists for the teacher "My library" tab. Read-only case, safe to run repeatedly.' },

  { id: 'TST_UMBP_TC_5', req: REQS[26], type: 'Positive', priority: 'High',
    title: 'Verify an admin can launch an LP component from the Library tab\'s product materials',
    pre: 'School-admin login; the school library contains an umbrella product with an LP component.',
    steps: '1. Log in as the admin.\n2. Open the "LIBRARY" tab.\n3. Search the product.\n4. Click "See materials".\n5. Launch the LP component.',
    data: 'An umbrella product on the admin\'s school (e.g. the SLE product of the LP school)',
    expected: ASSUMED + ' The Library tab shows "School licence" and "All course materials"; search filters to matching products; "See materials" opens the component list; the LP component launches for preview and renders.',
    remarks: '[LP Test Cases] TC_ADM_001. Module UMBP (umbrellaProduct — product materials view) already covers "See materials"; only the LP launch is new. The Library tab itself is covered by LIBR in AdminApp-Library — check that register for overlap before automating.' },
];

// Scenarios deliberately without a case (automation-mechanics, like LP-004).
const NOT_COVERED = {
  [REQS[9]]: 'none — automation-mechanics scenario: it asks for a bespoke diagnostic when the player iframe never loads, i.e. a property of the test code, not the product. Worth doing as a code improvement in the page object, not as a test case.',
  [REQS[10]]: 'none — automation-mechanics scenario: SOURCE pages the flashcard deck a hardcoded 5 times. Our TST_PEXT_TC_11 addresses it by driving the loop from the deck\'s own state instead.',
};

module.exports = { REQS, TCS, NOT_COVERED };

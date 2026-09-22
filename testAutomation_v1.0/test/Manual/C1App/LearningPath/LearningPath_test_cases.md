# Manual Functional Test Cases — Cambridge One: Learning Path / Practice Extra (Batch 1)

**Source:** `lp-scenarios.xlsx` (playwright-automation-c1 `test-scenarios/`), sheet "Learning Path" — rows TC-LP-001…006
**Module:** PEXT (Practice Extra player) — *`practiceExtra.page.js`*; the entry click is DASH (`dashboard.page.js`)
**App:** Cambridge One — `www.cambridgeone.org` (production; thor is blocked — see `c1-core-shared.md` §A4)
**Page in scope:** learner dashboard → Practice Extra → Learning Path unit view
**Generated:** 2026-09-22 | **Total TCs:** 9 (9 Positive · 0 Edge · 0 Negative) — 5 of 6 scenarios covered; LP-004 deliberately not (see map)
**Execution status (2026-09-22):** **9 of 9 LP TCs automated and passing** — `npm run learningPathTest_prod`, full first-time run 53/53 (teacher _w1b7, Class vyi9, learner _jqh2).
**Part 2 — LP setup chain (40 TCs, module-wise, separate sheet):** **40 of 40 passing** in the same run. Kept here for now; to be moved into application-wise registers later (user decision 2026-09-22).

**Batches:** Batch 1 — LP-001…006 (`TST_PEXT_*` + `TST_DASH_TC_14`, 9 TCs) · Setup — sheet "LP Setup (by module)".

> **Ordering:** grouped by Linked Requirement (scenario); Positive → Edge → Negative within a group.
> **S.No.** follows that order; **Test Case IDs** are stable and so appear out of numeric sequence.
>
> **Batch 1 scope (agreed 2026-09-22):** the first six rows of the sheet. LP-002 and LP-003 are split
> into one case per frame plus the final score; LP-004 is not a product scenario and is not covered.
>
> **Grounding.** Flows come from the SOURCE suite; every expected result was then **verified live on
> production on 2026-09-22** by our own runs (debug runs on learner _ajq1, then the full first-time run).
> Where SOURCE was wrong it is corrected and noted in Remarks (TOC close control, TOC on entry).
>
> **Data.** The learner, class and invite are created by the setup suites of `learningPath.json`
> (ADR-022 run-generated users) — see `authoring-status.md`. **The scorable activity can be attempted
> once per learner**: a finished or half-finished activity is not offered fresh again, so a failed run of
> TC_4…TC_8 needs a new learner.

---

## Requirement → Test Case coverage map

| Linked Requirement (scenario) | Mapped TC IDs (P → E → N) |
|---|---|
| #LP-001 — Learner navigates from the class dashboard into the Learning Path via "Practice Extra" | TST_DASH_TC_14, TST_PEXT_TC_1 |
| #LP-002 — Learner answers the scorable activity's first frame via its dropdown and checks it | TST_PEXT_TC_4 |
| #LP-003 — Learner completes all four frames of the scorable dropdown gap-fill activity | TST_PEXT_TC_5, TST_PEXT_TC_6, TST_PEXT_TC_7, TST_PEXT_TC_8 |
| #LP-004 — A Frame 3/4 dropdown that fails to reach its "filled" state surfaces a clear diagnostic error | none — automation-mechanics scenario (it checks the automation's own error message, not product behaviour, and its precondition — broken activity JS — cannot be forced). Not automated, by user decision 2026-09-22. |
| #LP-005 — Learner opens the Table of Contents (TOC) sidebar from the unit view | TST_PEXT_TC_2 |
| #LP-006 — Learner closes the TOC sidebar via its close control | TST_PEXT_TC_3 |

---

## Product reference (from SOURCE, 2026-09-22 — to be re-confirmed live)

- Entry: the "Practice Extra" tile inside the class card on the learner dashboard. A first launch can show
  *"We're setting up the learning materials for you"* (≤ ~3 min on thor) before the player.
- Player: activity iframe `div#content-course-ext iframe`; **Check** (`a.green-btn`) and **Next**
  (`a[title="Next"]`) are on the OUTER page. Result `p.score` — "You scored 4 out of 4" — also outer.
- TOC: `div.sidebar.bg-white` (hidden via `d-none`); open `a.open-sidebar-btn`, close
  `.unit-view-header a.close-sidebar`. Opens automatically on the first navigation.
- Scorable content (cqaautomationbundle1): 4 frames of rich dropdowns (`.rich-dropdown`); frames 3/4 have
  four each and mark `.wrapper-dropdown.filled` when answered. Scrolling closes an open dropdown.

---

## Section — Test Cases (grouped by Linked Requirement)

### Requirement #LP-001 — Learner navigates from the class dashboard into the Learning Path via "Practice Extra"

| Field | Value |
|---|---|
| **S.No.** | 1 |
| **Test Case ID** | TST_DASH_TC_14 |
| **Title** | Verify the Learning Path player page opens when the learner clicks "Practice Extra" in the class card |
| **Linked Requirement** | #LP-001 — Learner navigates from the class dashboard into the Learning Path via "Practice Extra" |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Production (www.cambridgeone.org). A run-generated learner (<LP_LEARNER_EMAIL>, "{{run.lpLearnerEmail}}") has accepted a teacher's invite to class <LP_CLASS_NAME> on the School-Level-Licence school "MQA Sierra School" (MQA-ABC-DEF); the class uses product "cqaautomationbundle1". The learner is logged in on the dashboard (guided tour closed). Practice Extra has never been opened by this learner (first-time state). |
| **Test Steps** | 1. On the learner dashboard, locate the card of class <LP_CLASS_NAME>.<br>2. Click the "Practice Extra" tile inside that card.<br>3. If "We're setting up the learning materials for you" is shown, wait for it to clear. |
| **Test Data** | Class: <LP_CLASS_NAME> · Component: "Practice Extra" |
| **Expected Result** | The Learning Path (Practice Extra) page opens. On a first launch a one-time "setting up the learning materials" screen may show first and then clears (SOURCE saw up to ~3 min on thor; not observed on production — the player opened in ~9 s on a first entry). |
| **Remarks** | Verified live 2026-09-22 (production) — learner _ajq1 (debug) and a brand-new learner _jqh2 (full run). Flow taken from playwright-automation-c1. The tile is found INSIDE the named class card: once a product is active, other class cards can list the same component. |
| **Actual Result** | *(blank in design)* |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — npm run learningPathTest_prod (production). Last full run 2026-09-22: 53/53 passing (teacher _w1b7, Class vyi9, learner _jqh2). |

---

| Field | Value |
|---|---|
| **S.No.** | 2 |
| **Test Case ID** | TST_PEXT_TC_1 |
| **Title** | Verify the activity player is shown when Practice Extra is opened |
| **Linked Requirement** | #LP-001 — Learner navigates from the class dashboard into the Learning Path via "Practice Extra" |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | As TST_DASH_TC_14 has been completed (Practice Extra just opened). |
| **Test Steps** | 1. Observe the Learning Path page. |
| **Test Data** | — |
| **Expected Result** | The activity iframe (div#content-course-ext iframe) is rendered. |
| **Remarks** | Verified live 2026-09-22 (production, learner _ajq1). The TOC sidebar opens by itself ONLY on a learner's first entry (unit view); later entries start with it closed — so the TOC is not part of this check (SOURCE asserted it; the scenario's expected result is the player). |
| **Actual Result** | *(blank in design)* |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — npm run learningPathTest_prod (production). Last full run 2026-09-22: 53/53 passing (teacher _w1b7, Class vyi9, learner _jqh2). |

---

### Requirement #LP-002 — Learner answers the scorable activity's first frame via its dropdown and checks it

| Field | Value |
|---|---|
| **S.No.** | 3 |
| **Test Case ID** | TST_PEXT_TC_4 |
| **Title** | Verify Frame 1's dropdown shows the chosen answer when it is selected and checked |
| **Linked Requirement** | #LP-002 — Learner answers the scorable activity's first frame via its dropdown and checks it |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | As TC_1 has been completed: the learner is inside Practice Extra, on the Learning Path unit view. The scorable activity has never been attempted by this learner. |
| **Test Steps** | 1. Open Frame 1's dropdown.<br>2. Select "is doing".<br>3. Click the green Check button. |
| **Test Data** | Frame 1 answer: "is doing" |
| **Expected Result** | The dropdown shows "is doing" as its value and Check grades the response. |
| **Remarks** | Verified live 2026-09-22 (production) — learner _ajq1 (debug) and a brand-new learner _jqh2 (full run). Flow taken from playwright-automation-c1. Scrolling the page while the dropdown is open closes it — the option must be clicked without scrolling. Check/Next are on the OUTER page, not inside the iframe. One attempt per learner: a finished (or half-finished) activity is not offered fresh again. |
| **Actual Result** | *(blank in design)* |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — npm run learningPathTest_prod (production). Last full run 2026-09-22: 53/53 passing (teacher _w1b7, Class vyi9, learner _jqh2). |

---

### Requirement #LP-003 — Learner completes all four frames of the scorable dropdown gap-fill activity

| Field | Value |
|---|---|
| **S.No.** | 4 |
| **Test Case ID** | TST_PEXT_TC_5 |
| **Title** | Verify Frame 2 opens and accepts its answer when Next is clicked after Frame 1 |
| **Linked Requirement** | #LP-003 — Learner completes all four frames of the scorable dropdown gap-fill activity |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | As TST_PEXT_TC_4 has been completed. |
| **Test Steps** | 1. Click Next.<br>2. In Frame 2 open the dropdown and select "is doing".<br>3. Click Check. |
| **Test Data** | Frame 2 answer: "is doing" |
| **Expected Result** | Frame 2's content is shown after Next; its dropdown shows "is doing" after selection. |
| **Remarks** | Verified live 2026-09-22 (production) — learner _ajq1 (debug) and a brand-new learner _jqh2 (full run). Flow taken from playwright-automation-c1. |
| **Actual Result** | *(blank in design)* |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — npm run learningPathTest_prod (production). Last full run 2026-09-22: 53/53 passing (teacher _w1b7, Class vyi9, learner _jqh2). |

---

| Field | Value |
|---|---|
| **S.No.** | 5 |
| **Test Case ID** | TST_PEXT_TC_6 |
| **Title** | Verify all four Frame 3 dropdowns reach the filled state when each is answered |
| **Linked Requirement** | #LP-003 — Learner completes all four frames of the scorable dropdown gap-fill activity |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | As TST_PEXT_TC_5 has been completed. |
| **Test Steps** | 1. Click Next.<br>2. Answer the four Frame 3 dropdowns in order.<br>3. Click Check. |
| **Test Data** | Frame 3 answers, in order: "in the middle of the country", "I found a job at a big", "six months ago", "also a little scary sometimes" |
| **Expected Result** | Each Frame 3 dropdown reaches its "filled" state (.wrapper-dropdown.filled) after its answer is chosen. |
| **Remarks** | Verified live 2026-09-22 (production) — learner _ajq1 (debug) and a brand-new learner _jqh2 (full run). Flow taken from playwright-automation-c1. Content-specific: tied to one unit's authored text in cqaautomationbundle1. |
| **Actual Result** | *(blank in design)* |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — npm run learningPathTest_prod (production). Last full run 2026-09-22: 53/53 passing (teacher _w1b7, Class vyi9, learner _jqh2). |

---

| Field | Value |
|---|---|
| **S.No.** | 6 |
| **Test Case ID** | TST_PEXT_TC_7 |
| **Title** | Verify all four Frame 4 dropdowns reach the filled state when each is answered |
| **Linked Requirement** | #LP-003 — Learner completes all four frames of the scorable dropdown gap-fill activity |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | As TST_PEXT_TC_6 has been completed. |
| **Test Steps** | 1. Click Next.<br>2. Answer the four Frame 4 dropdowns in order.<br>3. Click Check. |
| **Test Data** | Frame 4 answers, in order: "in the middle of the country", "I found a job at a big", "six months ago", "also a little scary sometimes" |
| **Expected Result** | Each Frame 4 dropdown reaches its "filled" state after its answer is chosen. |
| **Remarks** | Verified live 2026-09-22 (production) — learner _ajq1 (debug) and a brand-new learner _jqh2 (full run). Flow taken from playwright-automation-c1. |
| **Actual Result** | *(blank in design)* |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — npm run learningPathTest_prod (production). Last full run 2026-09-22: 53/53 passing (teacher _w1b7, Class vyi9, learner _jqh2). |

---

| Field | Value |
|---|---|
| **S.No.** | 7 |
| **Test Case ID** | TST_PEXT_TC_8 |
| **Title** | Verify the learner is shown a full score when the last frame is completed |
| **Linked Requirement** | #LP-003 — Learner completes all four frames of the scorable dropdown gap-fill activity |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | As TST_PEXT_TC_7 has been completed. |
| **Test Steps** | 1. Click Next. |
| **Test Data** | — |
| **Expected Result** | The result screen reads "You scored 4 out of 4" (p.score, on the outer page). |
| **Remarks** | Verified live 2026-09-22 (production) — learner _ajq1 (debug) and a brand-new learner _jqh2 (full run). Flow taken from playwright-automation-c1. SOURCE saw the full message as "Amazing! You scored 4 out of 4". |
| **Actual Result** | *(blank in design)* |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — npm run learningPathTest_prod (production). Last full run 2026-09-22: 53/53 passing (teacher _w1b7, Class vyi9, learner _jqh2). |

---

### Requirement #LP-004 — A Frame 3/4 dropdown that fails to reach its "filled" state surfaces a clear diagnostic error

_none — automation-mechanics scenario (it checks the automation's own error message, not product behaviour, and its precondition — broken activity JS — cannot be forced). Not automated, by user decision 2026-09-22._

---

### Requirement #LP-005 — Learner opens the Table of Contents (TOC) sidebar from the unit view

| Field | Value |
|---|---|
| **S.No.** | 8 |
| **Test Case ID** | TST_PEXT_TC_2 |
| **Title** | Verify the TOC sidebar is shown when the open-sidebar control is clicked |
| **Linked Requirement** | #LP-005 — Learner opens the Table of Contents (TOC) sidebar from the unit view |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | As TC_1 has been completed: the learner is inside Practice Extra, on the Learning Path unit view. The TOC sidebar is closed. |
| **Test Steps** | 1. Click the open-sidebar control (the "1.1 <activity>" breadcrumb, a.open-sidebar-btn). |
| **Test Data** | — |
| **Expected Result** | The TOC sidebar (div.sidebar.bg-white) becomes visible, exposing the unit/activity navigation. |
| **Remarks** | Verified live 2026-09-22 (production). Opening from the breadcrumb shows the LESSON view of the TOC. |
| **Actual Result** | *(blank in design)* |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — npm run learningPathTest_prod (production). Last full run 2026-09-22: 53/53 passing (teacher _w1b7, Class vyi9, learner _jqh2). |

---

### Requirement #LP-006 — Learner closes the TOC sidebar via its close control

| Field | Value |
|---|---|
| **S.No.** | 9 |
| **Test Case ID** | TST_PEXT_TC_3 |
| **Title** | Verify the TOC sidebar is hidden when its close control is clicked |
| **Linked Requirement** | #LP-006 — Learner closes the TOC sidebar via its close control |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | As TC_1 has been completed: the learner is inside Practice Extra, on the Learning Path unit view. The TOC sidebar is open. |
| **Test Steps** | 1. Click the cross labelled "Close table of contents" at the top of the TOC. |
| **Test Data** | — |
| **Expected Result** | The TOC sidebar closes (the app adds "d-none" to div.sidebar.bg-white). |
| **Remarks** | Verified live 2026-09-22 (production). The cross is #unitViewCrossBtn in the unit view and #lessonViewCrossBtn in the lesson view; SOURCE's .unit-view-header a.close-sidebar no longer exists. |
| **Actual Result** | *(blank in design)* |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — npm run learningPathTest_prod (production). Last full run 2026-09-22: 53/53 passing (teacher _w1b7, Class vyi9, learner _jqh2). |

---

## Open items / `[ASSUMED]` to confirm on the next live pass

1. ~~**Every expected result** is `[ASSUMED — SOURCE-verified]`~~ — **RESOLVED 2026-09-22.** All verified live on production.
2. ~~**TOC initial state**~~ — **RESOLVED 2026-09-22.** Opens by itself only on a learner's FIRST entry; later entries start closed.
   Housekeeping `TST_PEXT_TC_100` closes it first so TC_2/TC_3 always start from the same state.
3. **Provisioning screen** (TST_DASH_TC_14): not observed on production (first entry opened in ~9 s). SOURCE saw it on thor.

---

# Part 2 — LP setup chain (sheet "LP Setup (by module)")

The fresh-user chain every LP run starts with: teacher signup → join school → create class → learner
signup → invite → accept. **Module-wise groups**, rows in the order the flow runs them. Existing TCs the
flow reuses are included (Remarks: "Existing TC, reused") so the whole chain can be checked step by step.
Housekeeping steps (`TST_INVI_TC_101` bell wait, `TST_PEXT_TC_100` TOC close) are not cases.

⚠️ **Creates real data on production every run** (user-approved 2026-09-22): 1 teacher (+ school
affiliation to MQA Sierra School), 1 class, 1 learner (+ class membership). Thor is **Blocked** at
TST_SNUP_TC_61 (expired certificate on the verification-link host).

| Module group | TC IDs (flow order) |
|---|---|
| S1 — Landing & login (LAND / LOGI) | TST_LAND_TC_2, TST_LAND_TC_3, TST_LOGI_TC_1, TST_LOGI_TC_2, TST_LOGI_TC_5 |
| S2 — Signup & e-mail verification (SNUP) | TST_SNUP_TC_59, TST_SNUP_TC_63, TST_SNUP_TC_60, TST_SNUP_TC_61, TST_SNUP_TC_62, TST_SNUP_TC_64 |
| S3 — Teacher account setup / join a school (TSET) | TST_TSET_TC_1, TST_TSET_TC_2, TST_TSET_TC_3, TST_TSET_TC_4 |
| S4 — Teacher dashboard & create a class (DASH / ENTE) | TST_DASH_TC_12, TST_DASH_TC_10, TST_ENTE_TC_3, TST_ENTE_TC_9, TST_ENTE_TC_22, TST_ENTE_TC_21, TST_ENTE_TC_24, TST_ENTE_TC_19, TST_ENTE_TC_26, TST_ENTE_TC_18, TST_ENTE_TC_25 |
| S5 — Teacher invites a learner (DASH / CREA) | TST_DASH_TC_11, TST_CREA_TC_19, TST_CREA_TC_20, TST_CREA_TC_21, TST_CREA_TC_22, TST_CREA_TC_23, TST_CREA_TC_24, TST_CREA_TC_30 |
| S6 — Learner accepts the invitation; school-licence access (INVI / DASH) | TST_INVI_TC_1, TST_INVI_TC_2, TST_INVI_TC_13, TST_INVI_TC_4, TST_INVI_TC_5, TST_DASH_TC_13 |

### S1 — Landing & login (LAND / LOGI)

| Field | Value |
|---|---|
| **S.No.** | 1 |
| **Test Case ID** | TST_LAND_TC_2 |
| **Title** | Verify the signup page opens when "Sign up" is clicked on the landing page |
| **Linked Requirement** | S1 — Landing & login (LAND / LOGI) |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Production (www.cambridgeone.org). Landing page open, logged out. |
| **Test Steps** | 1. Click "Sign up". |
| **Test Data** | — |
| **Expected Result** | The role-selection page (/regoptions) opens with Teacher / Learner / Parent options. |
| **Remarks** | Existing TC, reused unchanged by the LP flow. Before-step of LP setup Suites 1 and 4. Verified live 2026-09-22 (production), full run 53/53. |
| **Actual Result** | *(blank in design)* |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — npm run learningPathTest_prod (production). Last full run 2026-09-22: 53/53 passing (teacher _w1b7, Class vyi9, learner _jqh2). |

---

| Field | Value |
|---|---|
| **S.No.** | 2 |
| **Test Case ID** | TST_LAND_TC_3 |
| **Title** | Verify the login page opens when "Log in" is clicked on the landing page |
| **Linked Requirement** | S1 — Landing & login (LAND / LOGI) |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Production (www.cambridgeone.org). Landing page open, logged out. |
| **Test Steps** | 1. Click "Log in". |
| **Test Data** | — |
| **Expected Result** | The Gigya login form (e-mail + password) is shown. |
| **Remarks** | Existing TC, reused unchanged by the LP flow. Before-step of Suites 2, 3, 5, 6, 7. Verified live 2026-09-22 (production), full run 53/53. |
| **Actual Result** | *(blank in design)* |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — npm run learningPathTest_prod (production). Last full run 2026-09-22: 53/53 passing (teacher _w1b7, Class vyi9, learner _jqh2). |

---

| Field | Value |
|---|---|
| **S.No.** | 3 |
| **Test Case ID** | TST_LOGI_TC_1 |
| **Title** | Verify the e-mail can be entered when the login form is shown |
| **Linked Requirement** | S1 — Landing & login (LAND / LOGI) |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Login form open. |
| **Test Steps** | 1. Type the account e-mail. |
| **Test Data** | Teacher <LP_TEACHER_EMAIL> ("{{run.lpTeacherEmail}}", e.g. cqaprodlpteach_w1b7@mailsac.com) or learner <LP_LEARNER_EMAIL> ("{{run.lpLearnerEmail}}", e.g. cqaprodlplearn_jqh2@mailsac.com) |
| **Expected Result** | The e-mail box holds the typed address. |
| **Remarks** | Existing TC, reused unchanged by the LP flow. Receives the run-generated user via an ADR-022 token. Verified live 2026-09-22 (production), full run 53/53. |
| **Actual Result** | *(blank in design)* |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — npm run learningPathTest_prod (production). Last full run 2026-09-22: 53/53 passing (teacher _w1b7, Class vyi9, learner _jqh2). |

---

| Field | Value |
|---|---|
| **S.No.** | 4 |
| **Test Case ID** | TST_LOGI_TC_2 |
| **Title** | Verify the password can be entered when the login form is shown |
| **Linked Requirement** | S1 — Landing & login (LAND / LOGI) |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | E-mail entered. |
| **Test Steps** | 1. Type the password. |
| **Test Data** | Password: the suite's standard test password (learningPathData.json) |
| **Expected Result** | The password box holds the typed value (masked). |
| **Remarks** | Existing TC, reused unchanged by the LP flow. Verified live 2026-09-22 (production), full run 53/53. |
| **Actual Result** | *(blank in design)* |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — npm run learningPathTest_prod (production). Last full run 2026-09-22: 53/53 passing (teacher _w1b7, Class vyi9, learner _jqh2). |

---

| Field | Value |
|---|---|
| **S.No.** | 5 |
| **Test Case ID** | TST_LOGI_TC_5 |
| **Title** | Verify the user reaches the dashboard when valid credentials are submitted |
| **Linked Requirement** | S1 — Landing & login (LAND / LOGI) |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | E-mail and password entered. |
| **Test Steps** | 1. Accept cookies if the banner shows.<br>2. Click "Log in". |
| **Test Data** | — |
| **Expected Result** | The Cambridge One dashboard loads (header help button visible). |
| **Remarks** | Existing TC, reused unchanged by the LP flow. Proves every run-generated account can log in. A new teacher/learner gets a guided tour on every login — closed by TST_DASH_TC_12. Verified live 2026-09-22 (production), full run 53/53. |
| **Actual Result** | *(blank in design)* |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — npm run learningPathTest_prod (production). Last full run 2026-09-22: 53/53 passing (teacher _w1b7, Class vyi9, learner _jqh2). |

---

### S2 — Signup & e-mail verification (SNUP)

| Field | Value |
|---|---|
| **S.No.** | 6 |
| **Test Case ID** | TST_SNUP_TC_59 |
| **Title** | Verify the role's next signup screen opens when a role is selected and confirmed |
| **Linked Requirement** | S2 — Signup & e-mail verification (SNUP) |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Production (www.cambridgeone.org). Signup role page (/regoptions) open. |
| **Test Steps** | 1. Select the role (Teacher / Learner).<br>2. Click Next.<br>3. In "You cannot change your role later on" click "Yes, continue". |
| **Test Data** | Teacher → expected screen "profile form"; Learner → expected screen "age gate" |
| **Expected Result** | Next is disabled until a role is picked. The confirm dialog names the chosen role ("You have selected <Role>"). After "Yes, continue": Teacher → /register-teacher profile form; Learner → /learner-age-check (country + age). |
| **Remarks** | Run twice in the flow (teacher Suite 1, learner Suite 4). Verified live 2026-09-22 (production), full run 53/53. |
| **Actual Result** | *(blank in design)* |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — npm run learningPathTest_prod (production). Last full run 2026-09-22: 53/53 passing (teacher _w1b7, Class vyi9, learner _jqh2). |

---

| Field | Value |
|---|---|
| **S.No.** | 7 |
| **Test Case ID** | TST_SNUP_TC_63 |
| **Title** | Verify the learner profile form opens when a country and an allowed age are entered in the age gate |
| **Linked Requirement** | S2 — Signup & e-mail verification (SNUP) |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Learner age gate (/learner-age-check) open. |
| **Test Steps** | 1. Type "India" in the location box and pick "India" from the suggestions.<br>2. Select age "18+".<br>3. Click Next. |
| **Test Data** | Country: India · Age: 18 (option "18+") |
| **Expected Result** | The age gate closes and the learner profile form (name, e-mail, password, terms) is shown. |
| **Remarks** | The first-name box can report visible on the gate page (thor); the form is proven by the age dropdown going away. Verified live 2026-09-22 (production), full run 53/53. |
| **Actual Result** | *(blank in design)* |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — npm run learningPathTest_prod (production). Last full run 2026-09-22: 53/53 passing (teacher _w1b7, Class vyi9, learner _jqh2). |

---

| Field | Value |
|---|---|
| **S.No.** | 8 |
| **Test Case ID** | TST_SNUP_TC_60 |
| **Title** | Verify the verification-pending screen shows the entered e-mail when the signup form is submitted |
| **Linked Requirement** | S2 — Signup & e-mail verification (SNUP) |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Teacher profile form, or learner profile form after the age gate. |
| **Test Steps** | 1. Enter first name, last name, e-mail and password.<br>2. Teacher only: type "India" in Country and pick it.<br>3. Tick "I accept the Privacy notice and Terms of use".<br>4. Click "Sign up". |
| **Test Data** | Teacher: Teacher / User / <LP_TEACHER_EMAIL> ("{{run.lpTeacherEmail}}", e.g. cqaprodlpteach_w1b7@mailsac.com) / India · Learner: Learner / User / <LP_LEARNER_EMAIL> ("{{run.lpLearnerEmail}}", e.g. cqaprodlplearn_jqh2@mailsac.com) · Password: the suite's standard test password (learningPathData.json) |
| **Expected Result** | Gigya's verification-pending screen is shown and echoes exactly the entered e-mail. |
| **Remarks** | ⚠️ CREATES A REAL ACCOUNT every run (user-approved on production). The terms checkbox id differs by env (thor #legal-checkbox-1, prod #teacher-checkbox-1); both have class termsCheckbox. Verified live 2026-09-22 (production), full run 53/53. |
| **Actual Result** | *(blank in design)* |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — npm run learningPathTest_prod (production). Last full run 2026-09-22: 53/53 passing (teacher _w1b7, Class vyi9, learner _jqh2). |

---

| Field | Value |
|---|---|
| **S.No.** | 9 |
| **Test Case ID** | TST_SNUP_TC_61 |
| **Title** | Verify the Mailsac verification link returns the user to Cambridge One |
| **Linked Requirement** | S2 — Signup & e-mail verification (SNUP) |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Account just created (pending screen shown). |
| **Test Steps** | 1. Log in to Mailsac.<br>2. Open the new account's inbox and the "Verify" mail.<br>3. Unblock content.<br>4. Open the mail's verification link. |
| **Test Data** | Inbox: <LP_TEACHER_EMAIL> ("{{run.lpTeacherEmail}}", e.g. cqaprodlpteach_w1b7@mailsac.com) / <LP_LEARNER_EMAIL> ("{{run.lpLearnerEmail}}", e.g. cqaprodlplearn_jqh2@mailsac.com) · Mailsac account: comproqatest21@gmail.com |
| **Expected Result** | The mail arrives (seconds on production) and its link signs the user in and lands on the Cambridge One dashboard. |
| **Remarks** | The link goes via login.comprodls.com — on THOR its certificate expired in 2022, so this case is Blocked on thor (see c1-core-shared.md §A4). Verified live 2026-09-22 (production), full run 53/53. |
| **Actual Result** | *(blank in design)* |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — npm run learningPathTest_prod (production). Last full run 2026-09-22: 53/53 passing (teacher _w1b7, Class vyi9, learner _jqh2). |

---

| Field | Value |
|---|---|
| **S.No.** | 10 |
| **Test Case ID** | TST_SNUP_TC_62 |
| **Title** | Verify a newly verified teacher can close the welcome tour and is offered "Complete your account" |
| **Linked Requirement** | S2 — Signup & e-mail verification (SNUP) |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Teacher just verified (or freshly logged in, before joining a school). |
| **Test Steps** | 1. Wait for the dashboard.<br>2. Close the guided tour (cross, top right) if shown. |
| **Test Data** | — |
| **Expected Result** | The tour closes and the "Complete account set up" button is shown. |
| **Remarks** | The tour mounts ~1.8 s after the dashboard; allow it time before deciding it is absent. Reused at the start of Suite 2. Verified live 2026-09-22 (production), full run 53/53. |
| **Actual Result** | *(blank in design)* |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — npm run learningPathTest_prod (production). Last full run 2026-09-22: 53/53 passing (teacher _w1b7, Class vyi9, learner _jqh2). |

---

| Field | Value |
|---|---|
| **S.No.** | 11 |
| **Test Case ID** | TST_SNUP_TC_64 |
| **Title** | Verify a newly verified learner lands on the welcome screen with Continue |
| **Linked Requirement** | S2 — Signup & e-mail verification (SNUP) |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Learner just verified. |
| **Test Steps** | 1. Wait for the page after verification.<br>2. Close the guided tour if shown. |
| **Test Data** | — |
| **Expected Result** | The learner welcome screen with its "Continue" button is shown. |
| **Remarks** | Verified live 2026-09-22 (production), full run 53/53. |
| **Actual Result** | *(blank in design)* |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — npm run learningPathTest_prod (production). Last full run 2026-09-22: 53/53 passing (teacher _w1b7, Class vyi9, learner _jqh2). |

---

### S3 — Teacher account setup / join a school (TSET)

| Field | Value |
|---|---|
| **S.No.** | 12 |
| **Test Case ID** | TST_TSET_TC_1 |
| **Title** | Verify the setup wizard opens with "I teach in a school" when the teacher clicks "Complete your account" |
| **Linked Requirement** | S3 — Teacher account setup / join a school (TSET) |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | New teacher logged in, not yet in any school; guided tour closed. |
| **Test Steps** | 1. Click "Complete account set up".<br>2. Close the "Welcome, Teacher (1 of 5)" tour if shown. |
| **Test Data** | — |
| **Expected Result** | The account-setup wizard shows the "I teach in a school" option. |
| **Remarks** | Verified live 2026-09-22 (production), full run 53/53. |
| **Actual Result** | *(blank in design)* |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — npm run learningPathTest_prod (production). Last full run 2026-09-22: 53/53 passing (teacher _w1b7, Class vyi9, learner _jqh2). |

---

| Field | Value |
|---|---|
| **S.No.** | 13 |
| **Test Case ID** | TST_TSET_TC_2 |
| **Title** | Verify the school-key form is shown when the teacher chooses "I teach in a school" and "Join a school" |
| **Linked Requirement** | S3 — Teacher account setup / join a school (TSET) |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Setup wizard open. |
| **Test Steps** | 1. Choose "I teach in a school" → Next.<br>2. Choose "Join a school" → Next. |
| **Test Data** | — |
| **Expected Result** | The school-key input form is shown. |
| **Remarks** | Verified live 2026-09-22 (production), full run 53/53. |
| **Actual Result** | *(blank in design)* |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — npm run learningPathTest_prod (production). Last full run 2026-09-22: 53/53 passing (teacher _w1b7, Class vyi9, learner _jqh2). |

---

| Field | Value |
|---|---|
| **S.No.** | 14 |
| **Test Case ID** | TST_TSET_TC_3 |
| **Title** | Verify the teacher joins the school when a valid school key is entered |
| **Linked Requirement** | S3 — Teacher account setup / join a school (TSET) |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | School-key form open. |
| **Test Steps** | 1. Type the school key.<br>2. Click Join. |
| **Test Data** | School key: MQA-ABC-DEF (MQA Sierra School, production) |
| **Expected Result** | The success screen with "Go to dashboard" is shown. |
| **Remarks** | ⚠️ WORKAROUND (user decision 2026-09-22, as SOURCE): production sometimes answers Join with "There was a problem on server"; the automation retries Join up to 5 times and logs every retry. Not seen in our runs (0 retries). Joining is durable. Verified live 2026-09-22 (production), full run 53/53. |
| **Actual Result** | *(blank in design)* |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — npm run learningPathTest_prod (production). Last full run 2026-09-22: 53/53 passing (teacher _w1b7, Class vyi9, learner _jqh2). |

---

| Field | Value |
|---|---|
| **S.No.** | 15 |
| **Test Case ID** | TST_TSET_TC_4 |
| **Title** | Verify the dashboard header shows the joined school after "Go to dashboard" |
| **Linked Requirement** | S3 — Teacher account setup / join a school (TSET) |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Join succeeded. |
| **Test Steps** | 1. Click "Go to dashboard".<br>2. Close the dashboard tutorial if shown. |
| **Test Data** | School name: MQA Sierra School |
| **Expected Result** | The dashboard header shows the school name (compare case-insensitively — casing differs by environment). |
| **Remarks** | Verified live 2026-09-22 (production), full run 53/53. |
| **Actual Result** | *(blank in design)* |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — npm run learningPathTest_prod (production). Last full run 2026-09-22: 53/53 passing (teacher _w1b7, Class vyi9, learner _jqh2). |

---

### S4 — Teacher dashboard & create a class (DASH / ENTE)

| Field | Value |
|---|---|
| **S.No.** | 16 |
| **Test Case ID** | TST_DASH_TC_12 |
| **Title** | Verify the dashboard is usable after login when the guided tour is shown and closed |
| **Linked Requirement** | S4 — Teacher dashboard & create a class (DASH / ENTE) |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Teacher or learner just logged in. |
| **Test Steps** | 1. Wait up to 5 s for the guided tour.<br>2. If shown, close it. |
| **Test Data** | — |
| **Expected Result** | No guided tour covers the dashboard. |
| **Remarks** | Runs after every login in Suites 3, 5, 6, 7. Verified live 2026-09-22 (production), full run 53/53. |
| **Actual Result** | *(blank in design)* |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — npm run learningPathTest_prod (production). Last full run 2026-09-22: 53/53 passing (teacher _w1b7, Class vyi9, learner _jqh2). |

---

| Field | Value |
|---|---|
| **S.No.** | 17 |
| **Test Case ID** | TST_DASH_TC_10 |
| **Title** | Verify the Create class page opens when "Create class" is clicked on the teacher dashboard |
| **Linked Requirement** | S4 — Teacher dashboard & create a class (DASH / ENTE) |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Teacher (in a school) on the dashboard. |
| **Test Steps** | 1. Click "Create class". |
| **Test Data** | — |
| **Expected Result** | The "Enter class details" step is shown. |
| **Remarks** | Existing TC, reused unchanged by the LP flow. Verified live 2026-09-22 (production), full run 53/53. |
| **Actual Result** | *(blank in design)* |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — npm run learningPathTest_prod (production). Last full run 2026-09-22: 53/53 passing (teacher _w1b7, Class vyi9, learner _jqh2). |

---

| Field | Value |
|---|---|
| **S.No.** | 18 |
| **Test Case ID** | TST_ENTE_TC_3 |
| **Title** | Verify the class name can be entered on the class details step |
| **Linked Requirement** | S4 — Teacher dashboard & create a class (DASH / ENTE) |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Create class — class details step. |
| **Test Steps** | 1. Type the class name. |
| **Test Data** | Class name: <LP_CLASS_NAME> ("{{run.lpClassName}}", e.g. "Class vyi9") |
| **Expected Result** | The class-name box holds the name. |
| **Remarks** | Existing TC, reused unchanged by the LP flow. Verified live 2026-09-22 (production), full run 53/53. |
| **Actual Result** | *(blank in design)* |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — npm run learningPathTest_prod (production). Last full run 2026-09-22: 53/53 passing (teacher _w1b7, Class vyi9, learner _jqh2). |

---

| Field | Value |
|---|---|
| **S.No.** | 19 |
| **Test Case ID** | TST_ENTE_TC_9 |
| **Title** | Verify Next moves to the class-materials step |
| **Linked Requirement** | S4 — Teacher dashboard & create a class (DASH / ENTE) |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Class name entered. |
| **Test Steps** | 1. Click Next. |
| **Test Data** | — |
| **Expected Result** | The "Add class materials" step is shown. |
| **Remarks** | Existing TC, reused unchanged by the LP flow. Verified live 2026-09-22 (production), full run 53/53. |
| **Actual Result** | *(blank in design)* |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — npm run learningPathTest_prod (production). Last full run 2026-09-22: 53/53 passing (teacher _w1b7, Class vyi9, learner _jqh2). |

---

| Field | Value |
|---|---|
| **S.No.** | 20 |
| **Test Case ID** | TST_ENTE_TC_22 |
| **Title** | Verify the material search opens when "Add materials" is clicked |
| **Linked Requirement** | S4 — Teacher dashboard & create a class (DASH / ENTE) |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Class-materials step. |
| **Test Steps** | 1. Click "Add materials". |
| **Test Data** | — |
| **Expected Result** | The material search box is shown. |
| **Remarks** | Existing TC, reused unchanged by the LP flow. Verified live 2026-09-22 (production), full run 53/53. |
| **Actual Result** | *(blank in design)* |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — npm run learningPathTest_prod (production). Last full run 2026-09-22: 53/53 passing (teacher _w1b7, Class vyi9, learner _jqh2). |

---

| Field | Value |
|---|---|
| **S.No.** | 21 |
| **Test Case ID** | TST_ENTE_TC_21 |
| **Title** | Verify a material name can be searched |
| **Linked Requirement** | S4 — Teacher dashboard & create a class (DASH / ENTE) |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Material search open. |
| **Test Steps** | 1. Type the product name. |
| **Test Data** | Product: cqaautomationbundle1 |
| **Expected Result** | Matching materials are listed. |
| **Remarks** | Existing TC, reused unchanged by the LP flow. Verified live 2026-09-22 (production), full run 53/53. |
| **Actual Result** | *(blank in design)* |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — npm run learningPathTest_prod (production). Last full run 2026-09-22: 53/53 passing (teacher _w1b7, Class vyi9, learner _jqh2). |

---

| Field | Value |
|---|---|
| **S.No.** | 22 |
| **Test Case ID** | TST_ENTE_TC_24 |
| **Title** | Verify the material with the exact searched name is picked when it is selected from the search results |
| **Linked Requirement** | S4 — Teacher dashboard & create a class (DASH / ENTE) |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Search results shown. |
| **Test Steps** | 1. Click the result whose name is exactly the product.<br>2. Tick it. |
| **Test Data** | Product: cqaautomationbundle1 |
| **Expected Result** | The picked material shown in the modal is exactly "cqaautomationbundle1". |
| **Remarks** | Results are ranked, not exact — the older ENTE_TC_20/23 pick the FIRST result and could silently build the class with the wrong material. Verified live 2026-09-22 (production), full run 53/53. |
| **Actual Result** | *(blank in design)* |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — npm run learningPathTest_prod (production). Last full run 2026-09-22: 53/53 passing (teacher _w1b7, Class vyi9, learner _jqh2). |

---

| Field | Value |
|---|---|
| **S.No.** | 23 |
| **Test Case ID** | TST_ENTE_TC_19 |
| **Title** | Verify the picked material is added when "Add to class" is clicked |
| **Linked Requirement** | S4 — Teacher dashboard & create a class (DASH / ENTE) |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Material ticked. |
| **Test Steps** | 1. Click "Add to class". |
| **Test Data** | — |
| **Expected Result** | The material is added to the class draft. |
| **Remarks** | Existing TC, reused unchanged by the LP flow. Verified live 2026-09-22 (production), full run 53/53. |
| **Actual Result** | *(blank in design)* |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — npm run learningPathTest_prod (production). Last full run 2026-09-22: 53/53 passing (teacher _w1b7, Class vyi9, learner _jqh2). |

---

| Field | Value |
|---|---|
| **S.No.** | 24 |
| **Test Case ID** | TST_ENTE_TC_26 |
| **Title** | Verify the "This material is collaborative" dialog is shown and can be closed after a collaborative material is added |
| **Linked Requirement** | S4 — Teacher dashboard & create a class (DASH / ENTE) |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Collaborative material just added. |
| **Test Steps** | 1. Read the dialog.<br>2. Close it (×). |
| **Test Data** | Expected title: "This material is collaborative" |
| **Expected Result** | The dialog titled "This material is collaborative" is shown and closes; Finish becomes clickable. |
| **Remarks** | The dialog blocks Finish until closed. Verified live 2026-09-22 (production), full run 53/53. |
| **Actual Result** | *(blank in design)* |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — npm run learningPathTest_prod (production). Last full run 2026-09-22: 53/53 passing (teacher _w1b7, Class vyi9, learner _jqh2). |

---

| Field | Value |
|---|---|
| **S.No.** | 25 |
| **Test Case ID** | TST_ENTE_TC_18 |
| **Title** | Verify Finish creates the class |
| **Linked Requirement** | S4 — Teacher dashboard & create a class (DASH / ENTE) |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Material added, dialog closed. |
| **Test Steps** | 1. Click Finish. |
| **Test Data** | — |
| **Expected Result** | Class creation completes. |
| **Remarks** | Existing TC, reused unchanged by the LP flow. ⚠️ CREATES A REAL CLASS every run (user-approved). Verified live 2026-09-22 (production), full run 53/53. |
| **Actual Result** | *(blank in design)* |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — npm run learningPathTest_prod (production). Last full run 2026-09-22: 53/53 passing (teacher _w1b7, Class vyi9, learner _jqh2). |

---

| Field | Value |
|---|---|
| **S.No.** | 26 |
| **Test Case ID** | TST_ENTE_TC_25 |
| **Title** | Verify the new class is listed on the dashboard with a class key when class creation finishes |
| **Linked Requirement** | S4 — Teacher dashboard & create a class (DASH / ENTE) |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Finish clicked. |
| **Test Steps** | 1. Read the success heading.<br>2. Go to dashboard.<br>3. Open the class by its name.<br>4. Read the class key. |
| **Test Data** | Class name: <LP_CLASS_NAME> ("{{run.lpClassName}}", e.g. "Class vyi9") · Expected heading: "Class successfully created" |
| **Expected Result** | "Class successfully created" is shown; the class card with that name is on the dashboard; its class page shows a class key (e.g. N348-p6W8). |
| **Remarks** | The key is stored for the run as lpClassKey (ADR-022). Verified live 2026-09-22 (production), full run 53/53. |
| **Actual Result** | *(blank in design)* |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — npm run learningPathTest_prod (production). Last full run 2026-09-22: 53/53 passing (teacher _w1b7, Class vyi9, learner _jqh2). |

---

### S5 — Teacher invites a learner (DASH / CREA)

| Field | Value |
|---|---|
| **S.No.** | 27 |
| **Test Case ID** | TST_DASH_TC_11 |
| **Title** | Verify the class page opens when the class card is clicked on the teacher dashboard |
| **Linked Requirement** | S5 — Teacher invites a learner (DASH / CREA) |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Teacher on the dashboard. |
| **Test Steps** | 1. Click the card of the class. |
| **Test Data** | Class: <LP_CLASS_NAME> ("{{run.lpClassName}}", e.g. "Class vyi9") |
| **Expected Result** | The class page opens. |
| **Remarks** | Existing TC, reused unchanged by the LP flow. Verified live 2026-09-22 (production), full run 53/53. |
| **Actual Result** | *(blank in design)* |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — npm run learningPathTest_prod (production). Last full run 2026-09-22: 53/53 passing (teacher _w1b7, Class vyi9, learner _jqh2). |

---

| Field | Value |
|---|---|
| **S.No.** | 28 |
| **Test Case ID** | TST_CREA_TC_19 |
| **Title** | Verify the class students area opens |
| **Linked Requirement** | S5 — Teacher invites a learner (DASH / CREA) |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Class page open. |
| **Test Steps** | 1. Open the students area of the class. |
| **Test Data** | — |
| **Expected Result** | The students area with "Add students" is shown. |
| **Remarks** | Existing TC, reused unchanged by the LP flow. Verified live 2026-09-22 (production), full run 53/53. |
| **Actual Result** | *(blank in design)* |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — npm run learningPathTest_prod (production). Last full run 2026-09-22: 53/53 passing (teacher _w1b7, Class vyi9, learner _jqh2). |

---

| Field | Value |
|---|---|
| **S.No.** | 29 |
| **Test Case ID** | TST_CREA_TC_20 |
| **Title** | Verify the invite dialog opens when "Add students" is clicked |
| **Linked Requirement** | S5 — Teacher invites a learner (DASH / CREA) |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Students area open. |
| **Test Steps** | 1. Click "Add students". |
| **Test Data** | — |
| **Expected Result** | The dialog asks "Are the students children or adults?". |
| **Remarks** | Existing TC, reused unchanged by the LP flow. Verified live 2026-09-22 (production), full run 53/53. |
| **Actual Result** | *(blank in design)* |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — npm run learningPathTest_prod (production). Last full run 2026-09-22: 53/53 passing (teacher _w1b7, Class vyi9, learner _jqh2). |

---

| Field | Value |
|---|---|
| **S.No.** | 30 |
| **Test Case ID** | TST_CREA_TC_21 |
| **Title** | Verify "Adults" can be chosen |
| **Linked Requirement** | S5 — Teacher invites a learner (DASH / CREA) |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Invite dialog open. |
| **Test Steps** | 1. Choose "Adults". |
| **Test Data** | — |
| **Expected Result** | Adults is selected. |
| **Remarks** | Existing TC, reused unchanged by the LP flow. Verified live 2026-09-22 (production), full run 53/53. |
| **Actual Result** | *(blank in design)* |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — npm run learningPathTest_prod (production). Last full run 2026-09-22: 53/53 passing (teacher _w1b7, Class vyi9, learner _jqh2). |

---

| Field | Value |
|---|---|
| **S.No.** | 31 |
| **Test Case ID** | TST_CREA_TC_22 |
| **Title** | Verify Next moves to the e-mail step |
| **Linked Requirement** | S5 — Teacher invites a learner (DASH / CREA) |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Adults chosen. |
| **Test Steps** | 1. Click Next. |
| **Test Data** | — |
| **Expected Result** | The learner e-mail box is shown. |
| **Remarks** | Existing TC, reused unchanged by the LP flow. Verified live 2026-09-22 (production), full run 53/53. |
| **Actual Result** | *(blank in design)* |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — npm run learningPathTest_prod (production). Last full run 2026-09-22: 53/53 passing (teacher _w1b7, Class vyi9, learner _jqh2). |

---

| Field | Value |
|---|---|
| **S.No.** | 32 |
| **Test Case ID** | TST_CREA_TC_23 |
| **Title** | Verify the learner e-mail can be entered |
| **Linked Requirement** | S5 — Teacher invites a learner (DASH / CREA) |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | E-mail step open. |
| **Test Steps** | 1. Type the learner's e-mail. |
| **Test Data** | Learner: <LP_LEARNER_EMAIL> ("{{run.lpLearnerEmail}}", e.g. cqaprodlplearn_jqh2@mailsac.com) |
| **Expected Result** | The e-mail box holds the address. |
| **Remarks** | Existing TC, reused unchanged by the LP flow. Verified live 2026-09-22 (production), full run 53/53. |
| **Actual Result** | *(blank in design)* |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — npm run learningPathTest_prod (production). Last full run 2026-09-22: 53/53 passing (teacher _w1b7, Class vyi9, learner _jqh2). |

---

| Field | Value |
|---|---|
| **S.No.** | 33 |
| **Test Case ID** | TST_CREA_TC_24 |
| **Title** | Verify the invitation is sent when Invite is clicked |
| **Linked Requirement** | S5 — Teacher invites a learner (DASH / CREA) |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | E-mail entered. |
| **Test Steps** | 1. Click Invite. |
| **Test Data** | — |
| **Expected Result** | The "Pending" section is shown. |
| **Remarks** | Existing TC, reused unchanged by the LP flow. Verified live 2026-09-22 (production), full run 53/53. |
| **Actual Result** | *(blank in design)* |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — npm run learningPathTest_prod (production). Last full run 2026-09-22: 53/53 passing (teacher _w1b7, Class vyi9, learner _jqh2). |

---

| Field | Value |
|---|---|
| **S.No.** | 34 |
| **Test Case ID** | TST_CREA_TC_30 |
| **Title** | Verify the invited learner's e-mail is listed in the class's pending invitations after Invite |
| **Linked Requirement** | S5 — Teacher invites a learner (DASH / CREA) |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Invite sent. |
| **Test Steps** | 1. Look at the pending invitations. |
| **Test Data** | Learner: <LP_LEARNER_EMAIL> ("{{run.lpLearnerEmail}}", e.g. cqaprodlplearn_jqh2@mailsac.com) |
| **Expected Result** | The pending list contains the invited e-mail. |
| **Remarks** | TST_CREA_TC_24 only proves some invite is pending; this proves it is THIS one. Verified live 2026-09-22 (production), full run 53/53. |
| **Actual Result** | *(blank in design)* |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — npm run learningPathTest_prod (production). Last full run 2026-09-22: 53/53 passing (teacher _w1b7, Class vyi9, learner _jqh2). |

---

### S6 — Learner accepts the invitation; school-licence access (INVI / DASH)

| Field | Value |
|---|---|
| **S.No.** | 35 |
| **Test Case ID** | TST_INVI_TC_1 |
| **Title** | Verify the learner's notification bell opens |
| **Linked Requirement** | S6 — Learner accepts the invitation; school-licence access (INVI / DASH) |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Learner logged in, tour closed; the invitation has reached the bell (housekeeping TST_INVI_TC_101 waits up to 2 min). |
| **Test Steps** | 1. Click the bell. |
| **Test Data** | — |
| **Expected Result** | The notification list opens with the class invitation. |
| **Remarks** | Existing TC, reused unchanged by the LP flow. Invitation arrived in seconds on production. Verified live 2026-09-22 (production), full run 53/53. |
| **Actual Result** | *(blank in design)* |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — npm run learningPathTest_prod (production). Last full run 2026-09-22: 53/53 passing (teacher _w1b7, Class vyi9, learner _jqh2). |

---

| Field | Value |
|---|---|
| **S.No.** | 36 |
| **Test Case ID** | TST_INVI_TC_2 |
| **Title** | Verify the invitation page opens from the notification |
| **Linked Requirement** | S6 — Learner accepts the invitation; school-licence access (INVI / DASH) |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Bell open. |
| **Test Steps** | 1. Click the invitation notification. |
| **Test Data** | — |
| **Expected Result** | The invitations page (/dashboard/invitation/main) opens. |
| **Remarks** | Existing TC, reused unchanged by the LP flow. Clicks the FIRST notification — sound for a new learner whose only notification is the invite. Verified live 2026-09-22 (production), full run 53/53. |
| **Actual Result** | *(blank in design)* |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — npm run learningPathTest_prod (production). Last full run 2026-09-22: 53/53 passing (teacher _w1b7, Class vyi9, learner _jqh2). |

---

| Field | Value |
|---|---|
| **S.No.** | 37 |
| **Test Case ID** | TST_INVI_TC_13 |
| **Title** | Verify Accept is enabled when the invited class is ticked on the invitation page |
| **Linked Requirement** | S6 — Learner accepts the invitation; school-licence access (INVI / DASH) |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Invitations page open. |
| **Test Steps** | 1. Wait for the invitation list.<br>2. Tick the invitation of the class (checkbox "Select <class name>"). |
| **Test Data** | Class: <LP_CLASS_NAME> ("{{run.lpClassName}}", e.g. "Class vyi9") |
| **Expected Result** | The invitation is ticked and "Accept" becomes enabled. |
| **Remarks** | The page renders the list, then routes to /dashboard/invitation/main and re-renders it — a tick made earlier is lost. Used instead of TST_INVI_TC_3 ("Select all"), which raced that re-render. Verified live 2026-09-22 (production), full run 53/53. |
| **Actual Result** | *(blank in design)* |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — npm run learningPathTest_prod (production). Last full run 2026-09-22: 53/53 passing (teacher _w1b7, Class vyi9, learner _jqh2). |

---

| Field | Value |
|---|---|
| **S.No.** | 38 |
| **Test Case ID** | TST_INVI_TC_4 |
| **Title** | Verify the invitation is accepted when Accept is clicked |
| **Linked Requirement** | S6 — Learner accepts the invitation; school-licence access (INVI / DASH) |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Invitation ticked. |
| **Test Steps** | 1. Click Accept. |
| **Test Data** | — |
| **Expected Result** | The acceptance confirmation with "Go to dashboard" is shown. |
| **Remarks** | Existing TC, reused unchanged by the LP flow. Verified live 2026-09-22 (production), full run 53/53. |
| **Actual Result** | *(blank in design)* |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — npm run learningPathTest_prod (production). Last full run 2026-09-22: 53/53 passing (teacher _w1b7, Class vyi9, learner _jqh2). |

---

| Field | Value |
|---|---|
| **S.No.** | 39 |
| **Test Case ID** | TST_INVI_TC_5 |
| **Title** | Verify "Go to dashboard" returns the learner to the dashboard |
| **Linked Requirement** | S6 — Learner accepts the invitation; school-licence access (INVI / DASH) |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Invitation accepted. |
| **Test Steps** | 1. Click "Go to dashboard". |
| **Test Data** | — |
| **Expected Result** | The learner dashboard is shown. |
| **Remarks** | Existing TC, reused unchanged by the LP flow. Verified live 2026-09-22 (production), full run 53/53. |
| **Actual Result** | *(blank in design)* |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — npm run learningPathTest_prod (production). Last full run 2026-09-22: 53/53 passing (teacher _w1b7, Class vyi9, learner _jqh2). |

---

| Field | Value |
|---|---|
| **S.No.** | 40 |
| **Test Case ID** | TST_DASH_TC_13 |
| **Title** | Verify the learner sees the class and its component without an activation-code prompt after accepting an invite on a school-licensed school |
| **Linked Requirement** | S6 — Learner accepts the invitation; school-licence access (INVI / DASH) |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Learner back on the dashboard after accepting. |
| **Test Steps** | 1. Find the class card.<br>2. Look for the "Practice Extra" tile inside it.<br>3. Check for an activation-code box. |
| **Test Data** | Class: <LP_CLASS_NAME> ("{{run.lpClassName}}", e.g. "Class vyi9") · Component: Practice Extra |
| **Expected Result** | The class card is shown with its "Practice Extra" tile, and NO activation-code prompt — the School Level Licence grants the product. |
| **Remarks** | Verified live 2026-09-22 (production), full run 53/53. |
| **Actual Result** | *(blank in design)* |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — npm run learningPathTest_prod (production). Last full run 2026-09-22: 53/53 passing (teacher _w1b7, Class vyi9, learner _jqh2). |

---

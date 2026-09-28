# Manual Functional Test Cases — Cambridge One: New Learning Path (NLP — "Projects")

**Source:** `D:\Playwright\Test_Cases_CUP\nlp-scenarios.xlsx`, sheet "New Learning Path" — TC-NLP-001…022 (all in scope, agreed 2026-09-25)
**Modules:** NLPP (`newLearningPath.page.js`) · DASH (`dashboard.page.js`) launch · CGRP (`classGroups.page.js`) groups · reused MSAC / MRKQ / PROG
**App:** Cambridge One — `www.cambridgeone.org` (production). NLP component = **Projects** (product `cqaautomationpr1`) of `cqaautomationbundle1`
**Generated:** 2026-09-25 | **Total TCs:** 34 (34 Positive · 0 Edge · 0 Negative) — every scenario of the sheet mapped
**Execution status:** **34 Pass** · **0 Fail** · **0 Not Run** · **0 Blocked** (—) · **0 On Hold** — full run 5 on production 2026-09-25: 135/135 — clean (learner B launches both components in setup; the group-mark queue counter is waited for)

> **Ordering:** grouped by Linked Requirement (scenario); Positive → Edge → Negative within a group. **S.No.** follows
> that order; **Test Case IDs** are stable and so appear out of numeric sequence. Reused TCs (DASH_TC_13, MSAC_TC_1,
> MRKQ_TC_1/2, PROG_TC_*) keep their IDs and run with the Projects data (`newLearningPathData.json`).
>
> **Decisions (user, 2026-09-25):** own execution file `newLearningPath.json` with its own fresh teacher, class and
> learner(s) (setup chain = Suites 1–6 of `learningPath.json`); previews use the run's bundle, not "R55 Multi Component
> Umbrella"; the teacher marks the Projects PS; the group cases (TC-NLP-021/022) are automated with a second learner.
>
> **Data.** A full run creates real production data (teacher + affiliation to MQA Sierra School, class, learner(s),
> progress, a mark, a group). The Practice Set can be submitted **once per learner**; in NLP the scorable can be retaken.

---

## How to automate / re-run a case from this register

1. Keep the **Test Case ID**; never renumber — a new case is appended.
2. Read `.architecture/authoring-status.md` (`newLearningPath` block) and
   `product-knowledge/ExperienceApp/new-learning-path.md`; follow the `c1-test-authoring` skill.
3. `[ASSUMED]` is a question, not a fact — confirm live and replace the text with what was seen.
4. Close the loop: edit `_tcdata*.js` / `_run.js`, run `node test/Manual/C1App/NewLearningPath/_generate.js`.

---

## Requirement → Test Case coverage map

| Linked Requirement (scenario) | Mapped TC IDs (P → E → N) |
|---|---|
| TC-NLP-001 — Learner navigates into the Projects component via the class dashboard tile | TST_NLPP_TC_1, TST_DASH_TC_17 (also) |
| TC-NLP-002 — First-time Projects launch shows the materials-provisioning screen | TST_DASH_TC_17 |
| TC-NLP-003 — Learner answers Exercise 1 (single dropdown) of the Projects scorable activity | TST_NLPP_TC_3, TST_NLPP_TC_5 |
| TC-NLP-004 — Learner completes all four exercises and reaches a perfect score | TST_NLPP_TC_6, TST_NLPP_TC_5 (also) |
| TC-NLP-005 — Learner pages through the Projects flashcard deck to completion | TST_NLPP_TC_7 |
| TC-NLP-006 — Learner submits a Productive Skill response in Projects | TST_NLPP_TC_8 |
| TC-NLP-007 — Learner closes the Projects activity and returns to the full dashboard | TST_NLPP_TC_9 |
| TC-NLP-008 — Teacher marks the learner's Projects PS from the marking queue | TST_MRKQ_TC_1, TST_MRKQ_TC_2 |
| TC-NLP-009 — Learner sees their updated analytics for Projects | TST_PROG_TC_1, TST_PROG_TC_6, TST_PROG_TC_5 |
| TC-NLP-010 — Teacher sees class- and student-level analytics for Projects | TST_PROG_TC_3, TST_PROG_TC_7, TST_PROG_TC_4 |
| TC-NLP-011 — A School Level Licence grants Projects with no activation code | TST_DASH_TC_13 |
| TC-NLP-012 — Teacher previews an NLP component from the class Materials tab | TST_NLPP_TC_10 |
| TC-NLP-013 — Teacher previews an NLP component via Manage student access (lock-rule creation) | TST_MSAC_TC_1 |
| TC-NLP-014 — Teacher previews an NLP component via My library | TST_NLPP_TC_11 |
| TC-NLP-015 — Admin previews an NLP component from the Library tab | TST_NLPP_TC_12 |
| TC-NLP-016 — NLP TOC is a single-page vertical journey with expand/collapse units | TST_NLPP_TC_2 |
| TC-NLP-017 — Exiting a scorable without finishing keeps an in-progress state, restored on relaunch | TST_NLPP_TC_4 |
| TC-NLP-018 — An SLE-activated Projects component shows no expiry date | TST_DASH_TC_17 (also) |
| TC-NLP-019 — Learner opens an HTML activity within Projects | TST_NLPP_TC_13 |
| TC-NLP-020 — Learner opens a PDF activity within Projects | TST_NLPP_TC_14 |
| TC-NLP-021 — Group members and the teacher comment on a shared Collab activity | TST_CGRP_TC_1, TST_NLPP_TC_15, TST_NLPP_TC_16, TST_NLPP_TC_17 |
| TC-NLP-022 — One learner submits a Group PS; the teacher marks it once for all members | TST_NLPP_TC_18, TST_NLPP_TC_19, TST_MRKQ_TC_1, TST_MRKQ_TC_2, TST_NLPP_TC_20 |

---

## Section — Test Cases (grouped by Linked Requirement)

### TC-NLP-001 — Learner navigates into the Projects component via the class dashboard tile

| Field | Value |
|---|---|
| **S.No.** | 1 |
| **Test Case ID** | TST_NLPP_TC_1 |
| **Title** | Verify the NLP table of contents shows the product, the component and its activities when Projects is launched from the class card |
| **Linked Requirement** | TC-NLP-001 — Learner navigates into the Projects component via the class dashboard tile |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Production (www.cambridgeone.org). A run-generated learner (<NLP_LEARNER_EMAIL>) has accepted the run teacher's invite to class <NLP_CLASS_NAME> on the School-Level-Licence school "MQA Sierra School" (MQA-ABC-DEF); the class uses product "cqaautomationbundle1", whose "Projects" component (cqaautomationpr1) is the NLP. The learner is logged in on the dashboard (guided tour closed). TST_DASH_TC_17 has launched Projects. |
| **Test Steps** | 1. On the learner dashboard, in the card of class <NLP_CLASS_NAME>, click the "Projects" tile.<br>2. Wait for the Projects page. |
| **Test Data** | Class <NLP_CLASS_NAME> · component "Projects" |
| **Expected Result** | The NLP page opens (/nlp/learner/…/product/cqaautomationpr1): heading "cqaautomationbundle1", sub-heading "Projects", and a table of contents listing the component's 7 activities. |
| **Remarks** | Verified live 2026-09-25 (production) by read-only probes (learner _mhfh, teacher _r04f, Class 036n). The sheet's "activity player (iframe) loads" is the classic LP; the NLP lands on its table of contents and the player opens per activity (TST_NLPP_TC_3). The tile is looked up INSIDE the named class card. |
| **Actual Result** | As expected (run 2). |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — npm run newLearningPathTest_prod (production). Full run 5, 2026-09-25: 135/135 (teacher _5srg, Class brvp, learners _3jsj / B _6bu5, group NLPGroup akq2). |

---

### TC-NLP-002 — First-time Projects launch shows the materials-provisioning screen

| Field | Value |
|---|---|
| **S.No.** | 2 |
| **Test Case ID** | TST_DASH_TC_17 |
| **Title** | Verify a learner's first Projects launch shows the materials-provisioning screen with a progress bar, which clears into the NLP table of contents |
| **Linked Requirement** | TC-NLP-002 — First-time Projects launch shows the materials-provisioning screen |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | Production (www.cambridgeone.org). A run-generated learner (<NLP_LEARNER_EMAIL>) has accepted the run teacher's invite to class <NLP_CLASS_NAME> on the School-Level-Licence school "MQA Sierra School" (MQA-ABC-DEF); the class uses product "cqaautomationbundle1", whose "Projects" component (cqaautomationpr1) is the NLP. The learner is logged in on the dashboard (guided tour closed). The learner has never launched Projects. |
| **Test Steps** | 1. Check the Projects tile and its class card for an expiry date.<br>2. Click the "Projects" tile.<br>3. Watch the page until the table of contents renders. |
| **Test Data** | Class <NLP_CLASS_NAME> · component "Projects" · bound 300 s |
| **Expected Result** | 1. No expiry date on the tile or the card (TC-NLP-018).<br>2. "Welcome to your Cambridge One — We're setting up the learning materials for you" with a percentage progress bar (measured: 80 % at 60 s, 100 % at ~64 s).<br>3. It clears into the NLP table of contents (TC-NLP-001). |
| **Remarks** | Verified live 2026-09-25 (production) by read-only probes (learner _mhfh, teacher _r04f, Class 036n). Provisioning is per PRODUCT (a learner who had used Practice Extra still got it for Projects) and shown once; a second launch opens the TOC in ~1.7 s. Also covers TC-NLP-001 (launch) and TC-NLP-018 (no expiry). |
| **Actual Result** | As expected (run 2). |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — npm run newLearningPathTest_prod (production). Full run 5, 2026-09-25: 135/135 (teacher _5srg, Class brvp, learners _3jsj / B _6bu5, group NLPGroup akq2). |

---

### TC-NLP-003 — Learner answers Exercise 1 (single dropdown) of the Projects scorable activity

| Field | Value |
|---|---|
| **S.No.** | 3 |
| **Test Case ID** | TST_NLPP_TC_3 |
| **Title** | Verify Exercise 1's dropdown shows the chosen value and can be checked when the scorable activity is opened from the NLP table of contents |
| **Linked Requirement** | TC-NLP-003 — Learner answers Exercise 1 (single dropdown) of the Projects scorable activity |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Production (www.cambridgeone.org). A run-generated learner (<NLP_LEARNER_EMAIL>) has accepted the run teacher's invite to class <NLP_CLASS_NAME> on the School-Level-Licence school "MQA Sierra School" (MQA-ABC-DEF); the class uses product "cqaautomationbundle1", whose "Projects" component (cqaautomationpr1) is the NLP. The learner is logged in on the dashboard (guided tour closed). Projects is open on its table of contents; the scorable has not been started. |
| **Test Steps** | 1. Click "1. BASE04_Dropdown_Scorable.zip".<br>2. Open Exercise 1's dropdown and choose "is doing".<br>3. Click Check. |
| **Test Data** | Option: "is doing" |
| **Expected Result** | The activity view opens (title BASE04_Dropdown_Scorable.zip, Close Activity ×); the dropdown shows the chosen value; Check appears once an option is chosen and grades the response (Next is offered). |
| **Remarks** | Verified live 2026-09-25 (production) by read-only probes (learner _mhfh, teacher _r04f, Class 036n). No Check button is rendered until an option is chosen. The rich dropdown closes when the page scrolls — the option is clicked at its centre. |
| **Actual Result** | As expected (run 2). |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — npm run newLearningPathTest_prod (production). Full run 5, 2026-09-25: 135/135 (teacher _5srg, Class brvp, learners _3jsj / B _6bu5, group NLPGroup akq2). |

---

| Field | Value |
|---|---|
| **S.No.** | 4 |
| **Test Case ID** | TST_NLPP_TC_5 |
| **Title** | Verify Next advances to the following exercise and its dropdowns register their answers when checked |
| **Linked Requirement** | TC-NLP-003 — Learner answers Exercise 1 (single dropdown) of the Projects scorable activity |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | The previous exercise has been checked (Next offered). |
| **Test Steps** | 1. Click Next.<br>2. Answer every dropdown of the exercise.<br>3. Click Check.<br>(Run for Exercises 2, 3 and 4.) |
| **Test Data** | Ex 2: "is doing" · Ex 3/4 in order: "in the middle of the country", "I found a job at a big", "six months ago", "also a little scary sometimes" |
| **Expected Result** | Next shows the next exercise; every dropdown shows its value (Ex 3/4: four each); Check grades it. |
| **Remarks** | Verified live 2026-09-25 (production) by read-only probes (learner _mhfh, teacher _r04f, Class 036n). Also covers the exercise steps of TC-NLP-004. |
| **Actual Result** | As expected (run 2). |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — npm run newLearningPathTest_prod (production). Full run 5, 2026-09-25: 135/135 (teacher _5srg, Class brvp, learners _3jsj / B _6bu5, group NLPGroup akq2). |

---

### TC-NLP-004 — Learner completes all four exercises and reaches a perfect score

| Field | Value |
|---|---|
| **S.No.** | 5 |
| **Test Case ID** | TST_NLPP_TC_6 |
| **Title** | Verify the result screen reads "You scored 4 out of 4" when every exercise of the scorable activity is answered correctly |
| **Linked Requirement** | TC-NLP-004 — Learner completes all four exercises and reaches a perfect score |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Exercise 4 has been checked. |
| **Test Steps** | 1. Click Next. |
| **Test Data** | — |
| **Expected Result** | The result screen: "Amazing!" and "You scored 4 out of 4 and won a gold medal.", with "Next activity" and "Review answers". |
| **Remarks** | Verified live 2026-09-25 (production) by read-only probes (learner _mhfh, teacher _r04f, Class 036n). The sheet's "Amazing! You scored 4 out of 4" is on two lines (h2 + p.score). In NLP a finished scorable REOPENS as a fresh attempt (the classic LP does not offer it again). |
| **Actual Result** | As expected (run 2). |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — npm run newLearningPathTest_prod (production). Full run 5, 2026-09-25: 135/135 (teacher _5srg, Class brvp, learners _3jsj / B _6bu5, group NLPGroup akq2). |

---

### TC-NLP-005 — Learner pages through the Projects flashcard deck to completion

| Field | Value |
|---|---|
| **S.No.** | 6 |
| **Test Case ID** | TST_NLPP_TC_7 |
| **Title** | Verify the flashcard deck pages to its last card and offers the NEXT ACTIVITY bridge when opened via "Next activity" |
| **Linked Requirement** | TC-NLP-005 — Learner pages through the Projects flashcard deck to completion |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | The scorable's result screen is shown. |
| **Test Steps** | 1. Click "Next activity".<br>2. Click Next, letting each card change settle, until the last card. |
| **Test Data** | — |
| **Expected Result** | Flashcards.zip opens (6 cards); the deck reaches its last card; no Check is offered; "NEXT ACTIVITY" appears. |
| **Remarks** | Verified live 2026-09-25 (production) by read-only probes (learner _mhfh, teacher _r04f, Class 036n). A Next within ~1.8 s of a card change is ignored by the player (classic LP measurement, same engine) — each change is followed by a 2.5 s settle; the loop is driven by the deck state, not a fixed count. |
| **Actual Result** | As expected (run 2). |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — npm run newLearningPathTest_prod (production). Full run 5, 2026-09-25: 135/135 (teacher _5srg, Class brvp, learners _3jsj / B _6bu5, group NLPGroup akq2). |

---

### TC-NLP-006 — Learner submits a Productive Skill response in Projects

| Field | Value |
|---|---|
| **S.No.** | 7 |
| **Test Case ID** | TST_NLPP_TC_8 |
| **Title** | Verify the Practice Set shows a "Submitted" badge with the answer when it is submitted and confirmed |
| **Linked Requirement** | TC-NLP-006 — Learner submits a Productive Skill response in Projects |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | The flashcard deck offers NEXT ACTIVITY. The learner has never submitted this PS. |
| **Test Steps** | 1. Click NEXT ACTIVITY.<br>2. Type the answer in the PS editor.<br>3. Click Submit.<br>4. Confirm with Submit in "Ready to submit?". |
| **Test Data** | Answer: "Submitting PS activity" |
| **Expected Result** | The PS opens with Submit disabled while empty; after typing Submit is enabled; "Ready to submit?" opens; after confirming, the PS shows "Learner User · <date · time> · 3 words · Submitted" and the answer read-only. |
| **Remarks** | Verified live 2026-09-25 (production) by read-only probes (learner _mhfh, teacher _r04f, Class 036n). ONE submission per learner. The TOC row keeps an in-progress icon until the PS is marked. |
| **Actual Result** | As expected (run 2). |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — npm run newLearningPathTest_prod (production). Full run 5, 2026-09-25: 135/135 (teacher _5srg, Class brvp, learners _3jsj / B _6bu5, group NLPGroup akq2). |

---

### TC-NLP-007 — Learner closes the Projects activity and returns to the full dashboard

| Field | Value |
|---|---|
| **S.No.** | 8 |
| **Test Case ID** | TST_NLPP_TC_9 |
| **Title** | Verify Close Activity returns to the NLP table of contents and its Cambridge One Home logo returns to the dashboard with its profile menu |
| **Linked Requirement** | TC-NLP-007 — Learner closes the Projects activity and returns to the full dashboard |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | The learner is inside a Projects activity (after submitting the PS). |
| **Test Steps** | 1. Observe the activity header.<br>2. Click Close Activity (×).<br>3. Click the Cambridge One Home logo. |
| **Test Data** | — |
| **Expected Result** | 1. The activity header has only the logo and × — no profile menu.<br>2. The NLP table of contents is shown.<br>3. The learner dashboard opens with its profile menu. |
| **Remarks** | Verified live 2026-09-25 (production) by read-only probes (learner _mhfh, teacher _r04f, Class 036n). The TOC page itself also carries the logo and a profile menu (productView-2); the activity view does not. |
| **Actual Result** | As expected (run 2). |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — npm run newLearningPathTest_prod (production). Full run 5, 2026-09-25: 135/135 (teacher _5srg, Class brvp, learners _3jsj / B _6bu5, group NLPGroup akq2). |

---

### TC-NLP-008 — Teacher marks the learner's Projects PS from the marking queue

| Field | Value |
|---|---|
| **S.No.** | 9 |
| **Test Case ID** | TST_MRKQ_TC_1 |
| **Title** | Verify the class shows work to mark and the queue lists the learner's Projects PS |
| **Linked Requirement** | TC-NLP-008 — Teacher marks the learner's Projects PS from the marking queue |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Production. The run-generated teacher (<NLP_TEACHER_EMAIL>) owns class <NLP_CLASS_NAME> with product "cqaautomationbundle1" and is logged in on the dashboard (guided tour closed). The learner submitted the Projects PS at least ~5 minutes ago. |
| **Test Steps** | 1. Open class <NLP_CLASS_NAME>.<br>2. Wait until the "<n> Marking" link shows ≥ 1 (reload).<br>3. Open Marking → "Projects (1) cqaautomationbundle1" → "Unit 1: Lesson 1 / PS" → the learner's submission. |
| **Test Data** | Course "Projects" · item "Unit 1: Lesson 1 / PS" · learner "Learner User" |
| **Expected Result** | "Unmarked (1)"; the Projects course, the PS item and the learner's submission are listed; the marking screen opens with the score pre-filled 70. |
| **Remarks** | Existing TC, reused with the Projects data (newLearningPathData.json). Verified live 2026-09-25 (production) by read-only probes (learner _mhfh, teacher _r04f, Class 036n). The submission reached the queue ~4 min after it was made. |
| **Actual Result** | As expected (run 2). |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — npm run newLearningPathTest_prod (production). Full run 5, 2026-09-25: 135/135 (teacher _5srg, Class brvp, learners _3jsj / B _6bu5, group NLPGroup akq2). |

---

| Field | Value |
|---|---|
| **S.No.** | 10 |
| **Test Case ID** | TST_MRKQ_TC_2 |
| **Title** | Verify the Projects PS shows as marked and the unmarked count drops to 0 when the teacher sends a score with feedback |
| **Linked Requirement** | TC-NLP-008 — Teacher marks the learner's Projects PS from the marking queue |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | TST_MRKQ_TC_1 — the marking screen of the learner's Projects PS is open. |
| **Test Steps** | 1. Set the score 70.<br>2. Type the feedback "Good".<br>3. Send → confirm "Ready to send?". |
| **Test Data** | Score 70 · feedback "Good" |
| **Expected Result** | The submission shows "Score : 70 %" and the teacher block "Score: 70 % Feedback: Good"; the tab reads "Unmarked (0)". |
| **Remarks** | Existing TC, reused with the Projects data (newLearningPathData.json). Mutates the run's own data only. Same marking screen as the classic LP (LP-035), confirmed by run 1. The run makes two submissions, so the PS is marked first and one stays unmarked ("Unmarked (1)"). |
| **Actual Result** | As expected (run 2). |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — npm run newLearningPathTest_prod (production). Full run 5, 2026-09-25: 135/135 (teacher _5srg, Class brvp, learners _3jsj / B _6bu5, group NLPGroup akq2). |

---

### TC-NLP-009 — Learner sees their updated analytics for Projects

| Field | Value |
|---|---|
| **S.No.** | 11 |
| **Test Case ID** | TST_PROG_TC_1 |
| **Title** | Verify the learner's "My progress" shows the Projects figures after the marked PS |
| **Linked Requirement** | TC-NLP-009 — Learner sees their updated analytics for Projects |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | Production (www.cambridgeone.org). A run-generated learner (<NLP_LEARNER_EMAIL>) has accepted the run teacher's invite to class <NLP_CLASS_NAME> on the School-Level-Licence school "MQA Sierra School" (MQA-ABC-DEF); the class uses product "cqaautomationbundle1", whose "Projects" component (cqaautomationpr1) is the NLP. The learner is logged in on the dashboard (guided tour closed). The scorable, the flashcards and the (marked) PS of Projects are done. |
| **Test Steps** | 1. In the class card click "My progress".<br>2. Read the summary and the Projects block (reload until the batch figures settle, ≤ 10 min). |
| **Test Data** | See newLearningPathData.json C1.nlpProgress |
| **Expected Result** | Summary "Completed activities: 5/11", "Activities completed above target score : 3/5", "87% Average score"; Projects block "Completed activities: 5/6", "3 Gold medals", "87%" (scorable 100 %, flashcards, PS 70, HTML, PDF, Group PS 90 — Projects counts 6 of its 7 activities). |
| **Remarks** | Existing TC, reused with the Projects data (newLearningPathData.json). Figures seen live 2026-09-25 (re-read on run 2's users after the Projects update: Class qjug, learner _r4cx). The summary totals lag by minutes (batch analytics) — re-read until settled. Projects counts GOLD MEDALS where Practice Extra counts above/below target. |
| **Actual Result** | As expected (run 2). |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — npm run newLearningPathTest_prod (production). Full run 5, 2026-09-25: 135/135 (teacher _5srg, Class brvp, learners _3jsj / B _6bu5, group NLPGroup akq2). |

---

| Field | Value |
|---|---|
| **S.No.** | 12 |
| **Test Case ID** | TST_PROG_TC_6 |
| **Title** | Verify the learner's per-activity Projects progress shows each activity's result after marking |
| **Linked Requirement** | TC-NLP-009 — Learner sees their updated analytics for Projects |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | TST_PROG_TC_1 — "My progress" is open. |
| **Test Steps** | 1. Click the product card.<br>2. Open "Projects".<br>3. Read each activity row. |
| **Test Data** | Component "Projects" |
| **Expected Result** | Scorable "First score 100% · Best score 100% · Attempts 1"; Flashcards "Viewed"; PS "First score 70% · Best score 70% · Attempts 1"; HTML and PDF "Viewed"; Group PS "First score 90% · Best score 90% · Attempts 1". |
| **Remarks** | Existing TC, reused with the Projects data (newLearningPathData.json). Before marking (seen 2026-09-25) the PS read "First score - · Best score - · Attempts 1". |
| **Actual Result** | As expected (run 2). |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — npm run newLearningPathTest_prod (production). Full run 5, 2026-09-25: 135/135 (teacher _5srg, Class brvp, learners _3jsj / B _6bu5, group NLPGroup akq2). |

---

| Field | Value |
|---|---|
| **S.No.** | 13 |
| **Test Case ID** | TST_PROG_TC_5 |
| **Title** | Verify the learner's bell shows "New feedback" and it opens the marked Projects PS with the score and feedback |
| **Linked Requirement** | TC-NLP-009 — Learner sees their updated analytics for Projects |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | The teacher marked the Projects PS (TST_MRKQ_TC_2). |
| **Test Steps** | 1. Open the bell.<br>2. Click the "New feedback" notification. |
| **Test Data** | Score 70 · feedback "Good" |
| **Expected Result** | The bell lists "New feedback · PS · Your teacher has sent you some feedback" (and a separate one for the Group PS); it opens the PS showing "Score : 70 %" and the teacher block "Score: 70 % Feedback: Good". |
| **Remarks** | Existing TC, reused with the Projects data (newLearningPathData.json). Notification texts seen live 2026-09-25; the item is picked by the text "New feedback PS Your teacher" ("… Group PS …" does not match it). |
| **Actual Result** | As expected (run 2). |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — npm run newLearningPathTest_prod (production). Full run 5, 2026-09-25: 135/135 (teacher _5srg, Class brvp, learners _3jsj / B _6bu5, group NLPGroup akq2). |

---

### TC-NLP-010 — Teacher sees class- and student-level analytics for Projects

| Field | Value |
|---|---|
| **S.No.** | 14 |
| **Test Case ID** | TST_PROG_TC_3 |
| **Title** | Verify the teacher's Class data shows the class and learner figures for the Projects work after marking |
| **Linked Requirement** | TC-NLP-010 — Teacher sees class- and student-level analytics for Projects |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | Production. The run-generated teacher (<NLP_TEACHER_EMAIL>) owns class <NLP_CLASS_NAME> with product "cqaautomationbundle1" and is logged in on the dashboard (guided tour closed). The learner's Projects PS is marked. |
| **Test Steps** | 1. Open class <NLP_CLASS_NAME> (Class data).<br>2. Read the class metrics and the learner's card (reload until settled, ≤ 10 min). |
| **Test Data** | See C1.nlpProgress |
| **Expected Result** | Class "Average completed activities: 27%", "4 /6", "88%"; learner A "Completed activities: 5/11", "3/5", "87%"; learner B "Completed activities: 1/11", "1/1", "90%" (the group mark); "Show progress details": B's Projects "1/6", "1 Gold medal", "90%". |
| **Remarks** | Existing TC, reused with the Projects data (newLearningPathData.json). Seen live 2026-09-25 (run 4). Learner B is credited with the group's mark only when B has launched the components: the setup has learner B launch Practice Extra and Projects right after accepting, before any group work (user fix 2026-09-25 — on run 2, without it, B stayed 0/5 and the class 20%). |
| **Actual Result** | As expected (run 2). |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — npm run newLearningPathTest_prod (production). Full run 5, 2026-09-25: 135/135 (teacher _5srg, Class brvp, learners _3jsj / B _6bu5, group NLPGroup akq2). |

---

| Field | Value |
|---|---|
| **S.No.** | 15 |
| **Test Case ID** | TST_PROG_TC_7 |
| **Title** | Verify "Show progress details" shows the learner's Projects figures |
| **Linked Requirement** | TC-NLP-010 — Teacher sees class- and student-level analytics for Projects |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | TST_PROG_TC_3 — Class data is open. |
| **Test Steps** | 1. Switch on "Show progress details".<br>2. Read the learner's Projects block. |
| **Test Data** | See C1.nlpProgress |
| **Expected Result** | Learner A's Projects block: "Completed activities: 5/6", "3 Gold medals", "87%". |
| **Remarks** | Existing TC, reused with the Projects data (newLearningPathData.json). |
| **Actual Result** | As expected (run 2). |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — npm run newLearningPathTest_prod (production). Full run 5, 2026-09-25: 135/135 (teacher _5srg, Class brvp, learners _3jsj / B _6bu5, group NLPGroup akq2). |

---

| Field | Value |
|---|---|
| **S.No.** | 16 |
| **Test Case ID** | TST_PROG_TC_4 |
| **Title** | Verify the teacher's per-activity view of the learner's Projects matches the learner's |
| **Linked Requirement** | TC-NLP-010 — Teacher sees class- and student-level analytics for Projects |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | TST_PROG_TC_3 — Class data is open. |
| **Test Steps** | 1. Click the learner's product title.<br>2. Open "Projects".<br>3. Read each activity row. |
| **Test Data** | Component "Projects" |
| **Expected Result** | The same rows as TST_PROG_TC_6. |
| **Remarks** | Existing TC, reused with the Projects data (newLearningPathData.json). |
| **Actual Result** | As expected (run 2). |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — npm run newLearningPathTest_prod (production). Full run 5, 2026-09-25: 135/135 (teacher _5srg, Class brvp, learners _3jsj / B _6bu5, group NLPGroup akq2). |

---

### TC-NLP-011 — A School Level Licence grants Projects with no activation code

| Field | Value |
|---|---|
| **S.No.** | 17 |
| **Test Case ID** | TST_DASH_TC_13 |
| **Title** | Verify Projects is available in the class card with no activation-code prompt when the learner joined via the SLE invite |
| **Linked Requirement** | TC-NLP-011 — A School Level Licence grants Projects with no activation code |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | The learner has just accepted the class invite (never entered an activation code). |
| **Test Steps** | 1. Go to the dashboard.<br>2. Look at the card of class <NLP_CLASS_NAME>. |
| **Test Data** | Class <NLP_CLASS_NAME> · component "Projects" |
| **Expected Result** | The class card lists "Projects"; no activation-code input is shown. |
| **Remarks** | Existing TC, reused with the Projects data (newLearningPathData.json). Opening Projects (TST_DASH_TC_17) then never asks for a code either. |
| **Actual Result** | As expected (run 2). |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — npm run newLearningPathTest_prod (production). Full run 5, 2026-09-25: 135/135 (teacher _5srg, Class brvp, learners _3jsj / B _6bu5, group NLPGroup akq2). |

---

### TC-NLP-012 — Teacher previews an NLP component from the class Materials tab

| Field | Value |
|---|---|
| **S.No.** | 18 |
| **Test Case ID** | TST_NLPP_TC_10 |
| **Title** | Verify a teacher can preview the NLP component and open its activities when it is launched from the class Materials tab |
| **Linked Requirement** | TC-NLP-012 — Teacher previews an NLP component from the class Materials tab |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Production. The run-generated teacher (<NLP_TEACHER_EMAIL>) owns class <NLP_CLASS_NAME> with product "cqaautomationbundle1" and is logged in on the dashboard (guided tour closed). |
| **Test Steps** | 1. Open class <NLP_CLASS_NAME> → Materials.<br>2. Click "Projects" in cqaautomationbundle1.<br>3. Open "1. BASE04_Dropdown_Scorable.zip", then Close Activity. |
| **Test Data** | Bundle "cqaautomationbundle1" · component "Projects" |
| **Expected Result** | /nlp/teacher/…/class/<id>/product/… opens with the NLP table of contents (and Back); the activity loads in the player; × returns to the TOC. |
| **Remarks** | Verified live 2026-09-25 (production) by read-only probes (learner _mhfh, teacher _r04f, Class 036n). The sheet's product "R55 Multi Component Umbrella" replaced by the run's own bundle (user decision 2026-09-25). Nothing is saved; a preview creates no learner progress. |
| **Actual Result** | As expected (run 2). |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — npm run newLearningPathTest_prod (production). Full run 5, 2026-09-25: 135/135 (teacher _5srg, Class brvp, learners _3jsj / B _6bu5, group NLPGroup akq2). |

---

### TC-NLP-013 — Teacher previews an NLP component via Manage student access (lock-rule creation)

| Field | Value |
|---|---|
| **S.No.** | 19 |
| **Test Case ID** | TST_MSAC_TC_1 |
| **Title** | Verify the Projects component opens in rule-creation mode with its TOC when chosen in Manage student access > Create access rule |
| **Linked Requirement** | TC-NLP-013 — Teacher previews an NLP component via Manage student access (lock-rule creation) |
| **Type** | Positive |
| **Priority** | Low |
| **Preconditions** | Production. The run-generated teacher (<NLP_TEACHER_EMAIL>) owns class <NLP_CLASS_NAME> with product "cqaautomationbundle1" and is logged in on the dashboard (guided tour closed). Class Materials tab open. |
| **Test Steps** | 1. Click "Manage student access" of cqaautomationbundle1.<br>2. Click "Create access rule".<br>3. Choose "Projects". |
| **Test Data** | Bundle "cqaautomationbundle1" · component "Projects" |
| **Expected Result** | Projects opens in the rule-creation player (/learning-path/teacher/…/create-access) with its TOC, "Select all units", Cancel and Continue. |
| **Remarks** | Existing TC, reused with the Projects data (newLearningPathData.json). Verified live 2026-09-25 (production) by read-only probes (learner _mhfh, teacher _r04f, Class 036n). Rule creation opens Projects in the CLASSIC LP player, not the NLP one. Continue is never clicked — no rule is created. |
| **Actual Result** | As expected (run 2). |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — npm run newLearningPathTest_prod (production). Full run 5, 2026-09-25: 135/135 (teacher _5srg, Class brvp, learners _3jsj / B _6bu5, group NLPGroup akq2). |

---

### TC-NLP-014 — Teacher previews an NLP component via My library

| Field | Value |
|---|---|
| **S.No.** | 20 |
| **Test Case ID** | TST_NLPP_TC_11 |
| **Title** | Verify a teacher can preview the NLP component and open its activities when it is launched from My library |
| **Linked Requirement** | TC-NLP-014 — Teacher previews an NLP component via My library |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Production. The run-generated teacher (<NLP_TEACHER_EMAIL>) owns class <NLP_CLASS_NAME> with product "cqaautomationbundle1" and is logged in on the dashboard (guided tour closed). |
| **Test Steps** | 1. Open My library, search "cqaautomationbundle1", click its title, then View details.<br>2. Click the Projects tile.<br>3. Open an activity, then Close Activity. |
| **Test Data** | Product "cqaautomationbundle1" · component "Projects" |
| **Expected Result** | /nlp/teacher/…/product/… opens with the NLP TOC; the activity loads; × returns to the TOC. |
| **Remarks** | Verified live 2026-09-25 (production) by read-only probes (learner _mhfh, teacher _r04f, Class 036n). |
| **Actual Result** | As expected (run 2). |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — npm run newLearningPathTest_prod (production). Full run 5, 2026-09-25: 135/135 (teacher _5srg, Class brvp, learners _3jsj / B _6bu5, group NLPGroup akq2). |

---

### TC-NLP-015 — Admin previews an NLP component from the Library tab

| Field | Value |
|---|---|
| **S.No.** | 21 |
| **Test Case ID** | TST_NLPP_TC_12 |
| **Title** | Verify a school admin can preview the NLP component and open its activities when it is launched from the Library tab's See materials |
| **Linked Requirement** | TC-NLP-015 — Admin previews an NLP component from the Library tab |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Production. The single-school admin of MQA Sierra School (<PROD_ADMIN_EMAIL>) is logged in on the admin console, school key MQA-ABC-DEF, LIBRARY tab open. |
| **Test Steps** | 1. Check the Library tab's School licence section.<br>2. Search "cqaautomationbundle1".<br>3. Click "See materials" on the product.<br>4. Click the Projects tile; open an activity, then Close Activity. |
| **Test Data** | Product "cqaautomationbundle1" · component "Projects" |
| **Expected Result** | 1. The School licence section is shown.<br>2. The heading shows "Showing search results for cqaautomationbundle1".<br>3. The product's components are listed.<br>4. The NLP preview opens with its TOC; the activity loads; × returns to the TOC. |
| **Remarks** | Confirmed by run 1 (2026-09-25): the admin preview uses the same /nlp/teacher/…/product/… route. Product replaced as TST_NLPP_TC_10. The sheet's "All course materials" label is not asserted (admin-library-tab.md). |
| **Actual Result** | As expected (run 2). |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — npm run newLearningPathTest_prod (production). Full run 5, 2026-09-25: 135/135 (teacher _5srg, Class brvp, learners _3jsj / B _6bu5, group NLPGroup akq2). |

---

### TC-NLP-016 — NLP TOC is a single-page vertical journey with expand/collapse units

| Field | Value |
|---|---|
| **S.No.** | 22 |
| **Test Case ID** | TST_NLPP_TC_2 |
| **Title** | Verify the NLP table of contents is a single vertical page with a numbered unit, its lesson and numbered activities, and that the unit collapses and expands and an opened activity closes back to it |
| **Linked Requirement** | TC-NLP-016 — NLP TOC is a single-page vertical journey with expand/collapse units |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Production (www.cambridgeone.org). A run-generated learner (<NLP_LEARNER_EMAIL>) has accepted the run teacher's invite to class <NLP_CLASS_NAME> on the School-Level-Licence school "MQA Sierra School" (MQA-ABC-DEF); the class uses product "cqaautomationbundle1", whose "Projects" component (cqaautomationpr1) is the NLP. The learner is logged in on the dashboard (guided tour closed). Projects is open on its table of contents. |
| **Test Steps** | 1. Read the TOC.<br>2. Collapse the "1 Unit 1" section, then expand it.<br>3. Open "1. BASE04_Dropdown_Scorable.zip", then Close Activity (×). |
| **Test Data** | Activities: 1. BASE04_Dropdown_Scorable.zip · 2. Flashcards.zip · 3. PS · 4. Non-scorable HTML activity · 5. test pdf · 6. Collaborative Task · 7. Group PS |
| **Expected Result** | 1. One page: numbered unit "1 Unit 1", lesson "Lesson 1" with a progress bar, then the seven numbered activities in order, a connector dot before each, medal icons on the scorable ones (1, 3, 7).<br>2. The unit collapses (activities hidden) and expands again.<br>3. The activity opens in the activity view (name + ×); × returns to the same TOC. |
| **Remarks** | Verified live 2026-09-25 (production) by read-only probes (learner _mhfh, teacher _r04f, Class 036n). This product has NO "Version" labels (the sheet's wording comes from another product). |
| **Actual Result** | As expected (run 2). |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — npm run newLearningPathTest_prod (production). Full run 5, 2026-09-25: 135/135 (teacher _5srg, Class brvp, learners _3jsj / B _6bu5, group NLPGroup akq2). |

---

### TC-NLP-017 — Exiting a scorable without finishing keeps an in-progress state, restored on relaunch

| Field | Value |
|---|---|
| **S.No.** | 23 |
| **Test Case ID** | TST_NLPP_TC_4 |
| **Title** | Verify an unfinished scorable shows as in progress in the NLP table of contents and restores its checked answer when relaunched |
| **Linked Requirement** | TC-NLP-017 — Exiting a scorable without finishing keeps an in-progress state, restored on relaunch |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | TST_NLPP_TC_3 — Exercise 1 checked, activity not finished. |
| **Test Steps** | 1. Click Close Activity (×).<br>2. Look at the scorable's TOC row and the unit status.<br>3. Relaunch the scorable. |
| **Test Data** | — |
| **Expected Result** | 2. The row shows the in-progress icon (no tick, medal not started); the unit reads "In progress".<br>3. The scorable reopens on Exercise 1 with "is doing" kept and checked, and offers Next. |
| **Remarks** | Verified live 2026-09-25 (production) by read-only probes (learner _mhfh, teacher _r04f, Class 036n). The sheet's "Saved" state = this in-progress icon and re-landing where the learner left (as the classic LP, LP-025); no "Saved" text is shown. |
| **Actual Result** | As expected (run 2). |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — npm run newLearningPathTest_prod (production). Full run 5, 2026-09-25: 135/135 (teacher _5srg, Class brvp, learners _3jsj / B _6bu5, group NLPGroup akq2). |

---

### TC-NLP-018 — An SLE-activated Projects component shows no expiry date

_Covered by TST_DASH_TC_17 (see its row)._

---

### TC-NLP-019 — Learner opens an HTML activity within Projects

| Field | Value |
|---|---|
| **S.No.** | 24 |
| **Test Case ID** | TST_NLPP_TC_13 |
| **Title** | Verify the HTML activity renders and is marked completed in the NLP table of contents after a short dwell with no submit |
| **Linked Requirement** | TC-NLP-019 — Learner opens an HTML activity within Projects |
| **Type** | Positive |
| **Priority** | Low |
| **Preconditions** | Production (www.cambridgeone.org). A run-generated learner (<NLP_LEARNER_EMAIL>) has accepted the run teacher's invite to class <NLP_CLASS_NAME> on the School-Level-Licence school "MQA Sierra School" (MQA-ABC-DEF); the class uses product "cqaautomationbundle1", whose "Projects" component (cqaautomationpr1) is the NLP. The learner is logged in on the dashboard (guided tour closed). Projects is open on its table of contents; the HTML activity has never been opened by this learner. |
| **Test Steps** | 1. Open "4. Non-scorable HTML activity" from the NLP TOC.<br>2. Stay ~3 s.<br>3. Click Close Activity (×) and look at its TOC row. |
| **Test Data** | Activity "4. Non-scorable HTML activity" |
| **Expected Result** | The HTML content renders in the activity view (only × and NEXT ACTIVITY — no Submit / Check); back on the TOC the row shows the completed tick. |
| **Remarks** | Verified live 2026-09-25 after the product team added the HTML and PDF activities to Projects (learner _r4cx). The learner's progress row reads "Viewed" (Activity status: viewed). |
| **Actual Result** | As expected (run 2). |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — npm run newLearningPathTest_prod (production). Full run 5, 2026-09-25: 135/135 (teacher _5srg, Class brvp, learners _3jsj / B _6bu5, group NLPGroup akq2). |

---

### TC-NLP-020 — Learner opens a PDF activity within Projects

| Field | Value |
|---|---|
| **S.No.** | 25 |
| **Test Case ID** | TST_NLPP_TC_14 |
| **Title** | Verify the PDF activity opens its download page and is marked completed in the NLP table of contents without downloading |
| **Linked Requirement** | TC-NLP-020 — Learner opens a PDF activity within Projects |
| **Type** | Positive |
| **Priority** | Low |
| **Preconditions** | Production (www.cambridgeone.org). A run-generated learner (<NLP_LEARNER_EMAIL>) has accepted the run teacher's invite to class <NLP_CLASS_NAME> on the School-Level-Licence school "MQA Sierra School" (MQA-ABC-DEF); the class uses product "cqaautomationbundle1", whose "Projects" component (cqaautomationpr1) is the NLP. The learner is logged in on the dashboard (guided tour closed). Projects is open on its table of contents; the PDF activity has never been opened by this learner. |
| **Test Steps** | 1. Open "5. test pdf" from the NLP TOC.<br>2. Read the page (do NOT click Download).<br>3. Click Close Activity (×) and look at its TOC row. |
| **Test Data** | Activity "5. test pdf" · file "Sample1.pdf" |
| **Expected Result** | A download page: "Download the test pdf below and complete this activity", "Sample1.pdf", a Download link and NEXT ACTIVITY — no download starts; back on the TOC the row shows the completed tick. |
| **Remarks** | Verified live 2026-09-25 (learner _r4cx). The sheet's "PDF renders/opens" does not hold: the NLP, like the classic LP (LP-022), shows a download page, and landing on it completes the activity. The sheet's "CSP-6967.pdf" is another product's file. Progress row: "Viewed". |
| **Actual Result** | As expected (run 2). |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — npm run newLearningPathTest_prod (production). Full run 5, 2026-09-25: 135/135 (teacher _5srg, Class brvp, learners _3jsj / B _6bu5, group NLPGroup akq2). |

---

### TC-NLP-021 — Group members and the teacher comment on a shared Collab activity

| Field | Value |
|---|---|
| **S.No.** | 26 |
| **Test Case ID** | TST_CGRP_TC_1 |
| **Title** | Verify the teacher can create a group of the class's two learners and it is listed with its students |
| **Linked Requirement** | TC-NLP-021 — Group members and the teacher comment on a shared Collab activity |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | Production. The teacher's class <NLP_CLASS_NAME> has learners A and B (no groups yet). Class page open (Class data). |
| **Test Steps** | 1. Switch Class data from Students to Groups.<br>2. Click "Create groups".<br>3. Type the group name; tick learners A and B (rows identified by e-mail).<br>4. Click Create. |
| **Test Data** | Group name "NLPGroup <rand4>" (maxlength 50) · learners A and B |
| **Expected Result** | "Groups (0)" + "Create groups"; the form "Create new group" lists both learners; Create becomes available; back on Class data: "2 students added to <group>", "Groups (1)", "All students in this class are now in groups", the group with "2 Students". |
| **Remarks** | Verified live 2026-09-25 (production) on the run's own class (Class jyaf, group "NLPGroup qt4c"). Precondition for TC-NLP-021/022 (the sheet's "group CRUD setup"). Mutates the run's own class only. Student rows are chosen by e-mail — both learners are named "… User". |
| **Actual Result** | As expected (run 2). |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — npm run newLearningPathTest_prod (production). Full run 5, 2026-09-25: 135/135 (teacher _5srg, Class brvp, learners _3jsj / B _6bu5, group NLPGroup akq2). |

---

| Field | Value |
|---|---|
| **S.No.** | 27 |
| **Test Case ID** | TST_NLPP_TC_15 |
| **Title** | Verify a grouped learner can post a comment on the Collaborative Task, which is headed by their group's name |
| **Linked Requirement** | TC-NLP-021 — Group members and the teacher comment on a shared Collab activity |
| **Type** | Positive |
| **Priority** | Low |
| **Preconditions** | Production. The run's class <NLP_CLASS_NAME> has TWO run-generated learners (A <NLP_LEARNER_EMAIL>, B <NLP_LEARNER_B_EMAIL>) who both accepted the invite; the teacher has put them in one group <NLP_GROUP_NAME> (TST_CGRP_TC_1). Learner A is on the Projects TOC. |
| **Test Steps** | 1. Open "6. Collaborative Task".<br>2. Type a comment and click Post. |
| **Test Data** | Comment "Comment from learner A" |
| **Expected Result** | The activity is headed by the group name ("No comments yet" at first); after Post the comment shows as "Learner User · Just now · Comment from learner A". A "Ready" button becomes available (not used). |
| **Remarks** | Verified live 2026-09-25 (production) on the run's own class (Class jyaf, group "NLPGroup qt4c"). Before grouping the same activity reads "This is a collaborative activity. It can only be completed by students assigned to groups by a teacher". |
| **Actual Result** | As expected (run 2). |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — npm run newLearningPathTest_prod (production). Full run 5, 2026-09-25: 135/135 (teacher _5srg, Class brvp, learners _3jsj / B _6bu5, group NLPGroup akq2). |

---

| Field | Value |
|---|---|
| **S.No.** | 28 |
| **Test Case ID** | TST_NLPP_TC_16 |
| **Title** | Verify a group member sees the group's earlier comments with their authors and can add their own |
| **Linked Requirement** | TC-NLP-021 — Group members and the teacher comment on a shared Collab activity |
| **Type** | Positive |
| **Priority** | Low |
| **Preconditions** | Production. The run's class <NLP_CLASS_NAME> has TWO run-generated learners (A <NLP_LEARNER_EMAIL>, B <NLP_LEARNER_B_EMAIL>) who both accepted the invite; the teacher has put them in one group <NLP_GROUP_NAME> (TST_CGRP_TC_1). Learner A has posted (TST_NLPP_TC_15). |
| **Test Steps** | 1. As learner B open the Collaborative Task; read the comments.<br>2. Post a comment.<br>(Run again as learner A at the end: B's and the teacher's comments.) |
| **Test Data** | Comment "Comment from learner B" |
| **Expected Result** | B sees "Learner User … Comment from learner A"; after Post also "LearnerB User … Comment from learner B". Learner A later sees A's, B's and the teacher's comments. |
| **Remarks** | Verified live 2026-09-25 (production) on the run's own class (Class jyaf, group "NLPGroup qt4c"). |
| **Actual Result** | As expected (run 2). |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — npm run newLearningPathTest_prod (production). Full run 5, 2026-09-25: 135/135 (teacher _5srg, Class brvp, learners _3jsj / B _6bu5, group NLPGroup akq2). |

---

| Field | Value |
|---|---|
| **S.No.** | 29 |
| **Test Case ID** | TST_NLPP_TC_17 |
| **Title** | Verify the teacher can open the group's Collaborative Task from the preview, see the learners' comments and add a comment |
| **Linked Requirement** | TC-NLP-021 — Group members and the teacher comment on a shared Collab activity |
| **Type** | Positive |
| **Priority** | Low |
| **Preconditions** | Production. The run's class <NLP_CLASS_NAME> has TWO run-generated learners (A <NLP_LEARNER_EMAIL>, B <NLP_LEARNER_B_EMAIL>) who both accepted the invite; the teacher has put them in one group <NLP_GROUP_NAME> (TST_CGRP_TC_1). Both learners have posted. Teacher: class Materials → Projects open (TST_NLPP_TC_10). |
| **Test Steps** | 1. Click "6. Collaborative Task".<br>2. On "Select group", choose the group.<br>3. Read the comments; post one. |
| **Test Data** | Comment "Comment from the teacher" |
| **Expected Result** | A "Select group" page lists the group; choosing it opens the Collaborative Task with both learners' comments; the teacher's comment is added ("Teacher User" with a "Teacher" tag). |
| **Remarks** | Verified live 2026-09-25 (production) on the run's own class (Class jyaf, group "NLPGroup qt4c"). The sheet's "teacher previews … and adds a comment" — the teacher view offers Post and NEXT ACTIVITY, no Ready. |
| **Actual Result** | As expected (run 2). |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — npm run newLearningPathTest_prod (production). Full run 5, 2026-09-25: 135/135 (teacher _5srg, Class brvp, learners _3jsj / B _6bu5, group NLPGroup akq2). |

---

### TC-NLP-022 — One learner submits a Group PS; the teacher marks it once for all members

| Field | Value |
|---|---|
| **S.No.** | 30 |
| **Test Case ID** | TST_NLPP_TC_18 |
| **Title** | Verify a learner can submit the Group PS on behalf of the group after confirming "Ready to submit your group's work?" |
| **Linked Requirement** | TC-NLP-022 — One learner submits a Group PS; the teacher marks it once for all members |
| **Type** | Positive |
| **Priority** | Low |
| **Preconditions** | Production. The run's class <NLP_CLASS_NAME> has TWO run-generated learners (A <NLP_LEARNER_EMAIL>, B <NLP_LEARNER_B_EMAIL>) who both accepted the invite; the teacher has put them in one group <NLP_GROUP_NAME> (TST_CGRP_TC_1). Nobody in the group has submitted the Group PS. |
| **Test Steps** | 1. As learner A open "7. Group PS".<br>2. Type a title and an answer.<br>3. Submit → "Yes, submit". |
| **Test Data** | Title "Group answer title" (maxlength 50) · answer "Group PS answer from learner A" |
| **Expected Result** | Submit is disabled until there is an answer; the dialog reads "Ready to submit your group's work? You are acting for all group members…"; afterwards "Learner User on behalf of <group> · <date · time> · 6 words · Submitted" with the title and answer. |
| **Remarks** | Verified live 2026-09-25 (production) on the run's own class (Class jyaf, group "NLPGroup qt4c"). ONE submission per group. |
| **Actual Result** | As expected (run 2). |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — npm run newLearningPathTest_prod (production). Full run 5, 2026-09-25: 135/135 (teacher _5srg, Class brvp, learners _3jsj / B _6bu5, group NLPGroup akq2). |

---

| Field | Value |
|---|---|
| **S.No.** | 31 |
| **Test Case ID** | TST_NLPP_TC_19 |
| **Title** | Verify the other group member sees the group's submitted Group PS read-only |
| **Linked Requirement** | TC-NLP-022 — One learner submits a Group PS; the teacher marks it once for all members |
| **Type** | Positive |
| **Priority** | Low |
| **Preconditions** | TST_NLPP_TC_18 done. |
| **Test Steps** | 1. As learner B open "7. Group PS". |
| **Test Data** | — |
| **Expected Result** | B sees the same "Learner User on behalf of <group> … Submitted", title and answer; no editor is offered. |
| **Remarks** | Verified live 2026-09-25 (production) on the run's own class (Class jyaf, group "NLPGroup qt4c"). |
| **Actual Result** | As expected (run 2). |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — npm run newLearningPathTest_prod (production). Full run 5, 2026-09-25: 135/135 (teacher _5srg, Class brvp, learners _3jsj / B _6bu5, group NLPGroup akq2). |

---

| Field | Value |
|---|---|
| **S.No.** | 32 |
| **Test Case ID** | TST_MRKQ_TC_1 |
| **Title** | Verify the teacher's marking queue lists the Group PS once, under the group's name |
| **Linked Requirement** | TC-NLP-022 — One learner submits a Group PS; the teacher marks it once for all members |
| **Type** | Positive |
| **Priority** | Low |
| **Preconditions** | The Group PS was submitted ≥ ~5 minutes ago. |
| **Test Steps** | 1. Class → Marking → "Projects" → "Unit 1: Lesson 1 / Group PS". |
| **Test Data** | Item "Unit 1: Lesson 1 / Group PS" · submitter = the GROUP name |
| **Expected Result** | One submission, listed as "<group> · <date · time>" (not per learner); the marking screen opens, score pre-filled 70. |
| **Remarks** | Existing TC, reused (group data). Verified live 2026-09-25 (production) on the run's own class (Class jyaf, group "NLPGroup qt4c"). Reached the queue ~4 min after submitting. |
| **Actual Result** | As expected (run 2). |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — npm run newLearningPathTest_prod (production). Full run 5, 2026-09-25: 135/135 (teacher _5srg, Class brvp, learners _3jsj / B _6bu5, group NLPGroup akq2). |

---

| Field | Value |
|---|---|
| **S.No.** | 33 |
| **Test Case ID** | TST_MRKQ_TC_2 |
| **Title** | Verify the teacher marks the Group PS once for the whole group |
| **Linked Requirement** | TC-NLP-022 — One learner submits a Group PS; the teacher marks it once for all members |
| **Type** | Positive |
| **Priority** | Low |
| **Preconditions** | The Group PS marking screen is open. |
| **Test Steps** | 1. Score 90, feedback "Well Done".<br>2. Send → confirm "Ready to send?". |
| **Test Data** | Score 90 · feedback "Well Done" (agreed with the user 2026-09-23) |
| **Expected Result** | The submission shows "Score : 90 %" and the teacher block "Score: 90 % Feedback: Well Done"; "Unmarked (0)". |
| **Remarks** | Existing TC, reused (group data). Verified live 2026-09-25 (production) on the run's own class (Class jyaf, group "NLPGroup qt4c"). Run 4: right after the mark the counters read "Unmarked (2)" while the list showed "There are no student submissions to view"; they reached 0 within ~15 min (the count lags once both members have launched the product). The step re-reads the tab until it settles (≤ 20 min — user decision 2026-09-25). |
| **Actual Result** | As expected (run 2). |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — npm run newLearningPathTest_prod (production). Full run 5, 2026-09-25: 135/135 (teacher _5srg, Class brvp, learners _3jsj / B _6bu5, group NLPGroup akq2). |

---

| Field | Value |
|---|---|
| **S.No.** | 34 |
| **Test Case ID** | TST_NLPP_TC_20 |
| **Title** | Verify every group member sees the teacher's single mark and feedback on the group's Group PS |
| **Linked Requirement** | TC-NLP-022 — One learner submits a Group PS; the teacher marks it once for all members |
| **Type** | Positive |
| **Priority** | Low |
| **Preconditions** | The teacher has marked the Group PS (90, "Well Done"). |
| **Test Steps** | 1. As learner B, then as learner A, open "7. Group PS". |
| **Test Data** | Score 90 · feedback "Well Done" |
| **Expected Result** | Each member sees "Score : 90 %" on the group's submission and "Teacher User … Score: 90 % Feedback: Well Done". Learner B's bell: "New feedback · Group PS". The teacher's Class data credits B too (1/11 · 1/1 · 90%) — provided B launched the components before the group work (setup). |
| **Remarks** | Verified live 2026-09-25 (production) on the run's own class (Class jyaf, group "NLPGroup qt4c"). Analytics for the group mark are checked by TST_PROG_TC_3 (learner B) and TST_PROG_TC_5 (learner B's feedback notification). |
| **Actual Result** | As expected (run 2). |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — npm run newLearningPathTest_prod (production). Full run 5, 2026-09-25: 135/135 (teacher _5srg, Class brvp, learners _3jsj / B _6bu5, group NLPGroup akq2). |

---

## Open items

1. None open. History: learner B's group credit (fixed in setup, user 2026-09-25); the marking counter lag after the Group PS mark (waited for, ≤ 20 min); the PDF follows the LP-022 rule.

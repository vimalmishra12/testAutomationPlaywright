# Authoring Status — in-flight phased test authoring

> **Live state file** for the `c1-test-authoring` phased workflow (router → Phase 1 build →
> Phase 2 run/fix → Phase 3 visual). One block per test currently in flight. The skill reads
> this file at session start to resume from the first ⬜ phase, and each phase's exit checklist
> updates it. **Remove a block when Phase 3 completes** — an empty file means nothing is pending.
> History lives in the session walkthroughs, never here.

## Status markers

| Marker | Meaning |
|---|---|
| ✅ | Phase complete **and verified** — for Phase 1 that means the suite was actually executed |
| ⚠️ | **Built but NEVER EXECUTED** — every selector, timeout and data value is an unverified guess |
| ⬜ | Not started |

> **Why ⚠️ exists.** A Phase 1 that was written from documentation and never run is not
> "complete" — it is an untested hypothesis, and marking it ✅ hands the next person a minefield
> labelled as finished work. `adminClassesTab` shipped as "Phase 1 ✅" having never been
> executed; its first real run was 2/6, and Phase 2 then took ~15 runs because eight unverified
> guesses surfaced simultaneously and entangled with each other. **If you did not run it, it is
> ⚠️, not ✅** — and say why in the block, so the next session knows to distrust every value in it.

## Block format

**This section is the single source of the block format** — the `c1-test-authoring` phase files
point here rather than repeating it. Keep a block to **status + open items**; debugging narrative
goes in the walkthrough, durable lessons in the product-knowledge file. `[updated 2026-09-21]`

```markdown
## <testName> (<App>, <env>) — `<npm script>`
Module `<MOD>` (<what it covers>) · knowledge: `<per-screen file>`
- Phase 1 ✅ <date> — `TST_<MOD>_TC_…`; <P> passing / <F> failing on first run; visual candidates: <list|none>
- Phase 2 ⬜ pending            (when done: ✅ <date> — <N>/<N> passing, 2 consecutive clean runs)
- Phase 3 ⬜ pending            (⏭️ DEFERRED by user decision — if deferred; remove the block when ✅)
- **On Hold:** <TC> — <open product bug, where it is written up>          (only if any)
- **Blocked:** <TC> (<what is missing / what unblocks it>)                  (only if any)
- **Not built:** <TC> (<why — e.g. creates data → data-owning suite>)       (only if any)
- Follow-up: <one line>                                                     (only if any)
```

Built but not yet executed:

```markdown
- Phase 1 ⚠️ <date> — built from documentation, NEVER EXECUTED. Every selector / timeout / data
  value is UNVERIFIED. Blocker: <reason>
```

---

> **Compacted 2026-09-18.** Blocks now hold status + open items only. The pre-compaction file is
> `archive/authoring-status_2026-09-18.md`; debugging narrative lives in the walkthroughs; the
> lessons are in the product-knowledge files.

## schoolAdminAddClassValidation (ExperienceApp, thor) — `P1AdminclassValidation_Thor`
Module `CCLS` (bulk class-creation form, validation) · knowledge: `admin-create-classes-form.md`
- Phase 1 ✅ 2026-08-14 — `TST_CCLS_TC_9..12`; visual candidates: none
- Phase 2 ✅ 2026-08-14 — 6/6 passing, 2 consecutive clean runs
- Phase 3 ⬜ pending

## schoolAdminAddClassBulk (ExperienceApp, thor) — `P1AdminclassBulk_Thor`
Module `CCLS` (bulk form: load, multi-row, toolbar, duplicate, copy, CSV) · **creates no class** ·
knowledge: `admin-create-classes-form.md`
- Phase 1 ✅ 2026-08-18 — `TST_CCLS_TC_13..19, 21, 22`; visual candidates: none
- Phase 2 ✅ 2026-08-18 — 11/11 passing, 2 consecutive clean runs
- Phase 3 ⬜ pending
- Data dependency: `TC_21` needs source class "cqa test class 17aug2026 1" (≥1 teacher, ≥1 material)
  on the school — swap `copySourceClass` in `schoolAdminAddClassData.json` if it disappears.

## schoolAdminAddClass — workflow suite (ExperienceApp, thor) — `P1Adminclassworkflow_Thor`
Module `CCLS` (create a real class end to end, incl. "Create more classes") · **creates 2 classes
per run** (`AutoClass_CreateOnly`, `AutoClass_CreateMore`) on `FCN-CHZ-PDA`
- Phase 1 ✅ 2026-08-18 — `TST_CCLS_TC_1..8, 15, 16, 20`; visual candidates: none
- Phase 2 ✅ 2026-08-18 — 13/13 passing (only ONE run carries the final assertion — accepted, since
  each run creates 2 real classes)
- Phase 3 ⬜ pending
- `TC_16` (label) REQUIRES a preceding `TST_CCLS_TC_23` in the suite — a restored draft can already
  carry the label, and re-selecting it toggles it OFF.

**Scenario #3 coverage:** all 16 BCCF manual cases automated across the three `CCLS` suites (map in
`admin-create-classes-form.md` "Automation coverage").

⚠️ **OPEN — not re-run since the 2026-08-19 `TST_CCLS_TC_23` refactor** (reset moved out of seven
TCs; placement rule in `admin-create-classes-form.md`). Only the CSV suite has executed `TC_23`
since. Re-run bulk + validation first (they create nothing); the workflow suite costs 2 classes.

> **Completed and removed 2026-09-18** (all three phases ✅ — the header rule): `adminGradingScales`
> (GSCL, `P1AdminGradingScales_Thor`, 10/10), the GSCL/GCAT `TC_7` pair (runs inside CGST), and
> `adminClassGradeSettings` (CGST, `P1AdminClassGradeSettings_Thor`, 19/19 → 21/21 with the pair).
> Open items live in the knowledge files: `TST_GSCL_TC_4` / `TST_GCAT_TC_4` Blocked (ADR-021, dedicated
> school); `TST_GSCL_TC_5` visual promotion declined 2026-08-19 (`admin-grading-scales.md`); fixture +
> seeding follow-up in `admin-shared.md` §A7. Full blocks: `archive/authoring-status_2026-09-18.md`.

## Admin Students tab (ExperienceApp, thor) — modules SLST / SPRF / SBLK
Manual register `test/Manual/C1App/AdminApp-Students/` · knowledge `admin-students-tab.md` ·
remaining work (Groups B/C/D) `HANDOFF_adminStudents_remaining_20260915.md` · school `FCN-CHZ-PDA`

### adminStudentsTab — SLST — `adminStudentsTabTest_thor`
- Phase 1 ✅ 2026-08-28 · Phase 2 ✅ — **24/24 passing**, 2 consecutive clean runs (2026-09-16, `TC_26` added)
- Phase 3 ⬜ pending — expected "no candidates" (shared, mutable data)
- **On Hold:** `TC_28` — unused-code search → HTTP 504 → error page (Jira; knowledge §9.6)
- **Blocked:** `TC_14` (needs a redeemed 16-char code + its student) · `TC_27` (only one username
  account on FCN — unblocked by Group C)
- **Not built:** `TC_25` (creates a student → Group C, `VED-NEH-KVU`)
- Follow-up: `TC_5/6/12` now take ~31–61 s (were ~1 s) — likely a 30 s wait on a missing element; green, not investigated.

### adminStudentProfile — SPRF — `adminStudentProfileTest_thor`
- Phase 1 ✅ 2026-08-28 · Phase 2 ✅ — **11/11 passing**, 2 consecutive clean runs (2026-09-15, `TC_12` added)
- Phase 3 ✅ 2026-08-28 (no candidates) — `TC_12` ⬜ not yet assessed (user deferred; ask first)
- **On Hold:** `TC_7` — profile hangs on HTTP 500 (`Vandna Garg`); add to the exec file when fixed
- **Blocked:** `TC_19–22` (student removal gone from the product — Jira; §9.7) · `TC_3` (no
  adult-with-username account) · `TC_18` (product decision: umbrella name is not a link) · `TC_14`
  (consumes a real code)
- **Not built:** `TC_8`, `TC_10`, `TC_13` (mutate a real account → Group C)
- Note: an earlier "11 passing" (2026-08-28) was really 10 — `TC_21` was never wired into the run.

### adminBulkStudents — SBLK — `adminBulkStudentsTest_thor`
- Phase 1 ✅ 2026-09-15 · Phase 2 ✅ — **3/3 passing** (`TC_6/7/8` + `TC_RESET`), 2 consecutive clean runs
- Phase 3 ⬜ pending — ask the user first
- **On Hold:** `TC_14` — "Create N account" enabled with an invalid row (Jira; §9.4)
- **Not built:** Group B (`TC_11`, `TC_17`), Group C, Group D — see the handoff

## Admin Staff tab (ExperienceApp, thor) — modules STFL / STFP / STFB
Manual register `test/Manual/C1App/AdminApp-Staff/` (57 TCs) · knowledge `admin-staff-tab.md` ·
school `FCN-CHZ-PDA`

### adminStaffTab — STFL — `adminStaffTabTest_thor`
- Phase 1 ✅ 2026-09-02 · Phase 2 ✅ 2026-09-02 — **19/19 passing**, 2 consecutive clean runs
  (`TC_2, 3, 4, 6, 8, 9, 11–20, 23, 24, 25`; `TC_1, 5, 7, 10, 21, 26` are Phase-1 EXTRA; `TC_22` retired)
- Phase 3 ⏭️ **DEFERRED by user decision** — not done; expected "no candidates", not yet assessed
- **Not built:** `TC_27` (needs an invited teacher to accept → data-owning suite)
- Watch: runtime drifted 77 s → 229 s across four runs (uniform, environmental); slowest case
  12.9 s against the 20 s poll budget — re-measure rather than raise if it starts to bite.

### adminStaffProfile — STFP — `adminStaffProfileTest_thor`
- Phase 1 ✅ 2026-09-07 — **9/9 passing** on three consecutive runs (`TC_1, 2, 7, 9, 11, 12, 15, 16, 17`)
- Phase 2 ⬜ pending · Phase 3 ⬜ pending
- 🔒 Six cases OPEN a mutating dialog and leave it — **never click confirm** in this suite.
- **Open for Phase 2 (proposed, awaiting confirmation):** `TST_STFP_TC_RESET` clears the search
  without waiting for the unfiltered list, so the next same-term search burns the full 20 s poll
  (`TC_16`/`TC_17`). Fix it in the reset (wait for the Clear link to go), not per case.
- **Blocked:** `TC_20` (needs a school with exactly one administrator)
- **Not built:** `TC_10` grant, `TC_13` revoke, `TC_18` removal, `TC_19` → data-owning suite with
  `AutoStaff_` staff; never confirm against `testt1@mailsac.com`.

### STFB (invitation form) — not started
- Leave until last: `TC_3` downloads, `TC_9` uploads, `TC_10` sends real email; the form restores a
  shared draft. **Blocked:** `TC_11` (upload-error condition not reproduced; root cause known).

**Open product items:** `TST_STFL_TC_26` heading count ≠ rendered rows (22 vs 21, unexplained) ·
unanswered: a larger school for Staff? · is self-revocation of admin rights by design?
**Unrelated, found here:** `manageReportsTest_thor` (MRAC, teacher side) fails 0/2 on
`button[qid^="aReport-2-"]` — pre-existing, not investigated `[2026-09-07]`.

## Admin Library tab (ExperienceApp, thor) — modules LIBR / UMBP — `adminSchoolLibraryTest_thor`
Manual register `test/Manual/C1App/AdminApp-Library/` (42; 28 Phase-1 EXTRA) · knowledge `admin-library-tab.md`
- Phase 1 ✅ 2026-09-14 · Phase 2 ✅ 2026-09-14 — **14/14 passing** (`LIBR_TC_2, 3, 4, 10, 11, 12, 20, 23, 25, 33`
  + `UMBP_TC_1, 2, 3, 9`; housekeeping `LIBR_TC_100/101`)
- Phase 3 ⬜ pending — expected "no candidates" (§B10), still owed
- ⚠️ **OPEN:** the LIBRARY tab click is intermittently inert (reports success, browser stays on
  `/class`; not the loader). BeforeEach recovery avoids it; `TST_LIBR_TC_101` still uses the click.
  Needs a live browser session to diagnose.
- Brittle by necessity: `UMBP_TC_1/2/3/9` find another team's products BY TITLE — a rename is a
  one-line fix in `adminSchoolLibraryData.json`.

## Admin Generic / shell (ExperienceApp, thor) — ASHL / FOOT / MYPR / SADB / SRQS / SKEY / INVI — `adminGenericTest_thor`
Manual register `test/Manual/C1App/AdminApp-Generic/` (41; 13 Phase-1 EXTRA) · knowledge `admin-generic-shell.md`
§A9–§A11 · exec `adminGeneric.json` (7 suites, INVI last; SKEY runs on `KNF-XRD-QVE`, never FCN)
- Phase 1 ✅ 2026-09-14 · Phase 2 ✅ 2026-09-15 — **21/21 passing**, 2 consecutive clean runs
- Phase 3 ⏭️ **DEFERRED by user decision** — not done; "no candidates" is an expectation, not a finding
- **Parked:** `TST_INVI_TC_12` — registered, NOT in the exec file (consumes an unread notification;
  all five were read). Re-add as Suite 7's last step once a fresh "report is ready" notification exists.
- **Blocked:** `SKEY_TC_3`, `LIBR_TC_32`, `SRQS_TC_2`, `LIBR_TC_34`, `SADB_TC_8`
- **Not built:** `SADB_TC_7` — creates a real class → own data-owning suite on `KNF-XRD-QVE` + own
  npm script (ask first). Design below.
- **Product issues recorded, not yet raised:** `rel="nopener"` on "Our approach"; untranslated Spanish
  strings ("Our approach", bell aria-label); wizard summary omits school type and number of teachers.

**`SADB_TC_7` design** (grounded read-only 2026-09-14, nothing created):
- Do NOT use the per-school "Create class" (`a[qid=tDashboard-ncls-btn-1]`) — it exists only while the teacher has no class in that school.
- Use the global `a.create-class` (beside "Active classes") → `/dashboard/teacher/create-class` "Enter class details": name `t-cc-cd-inpt-1` (**maxlength 50**) · start `t-cc-cd-inpt-2` · end `t-cc-cd-inpt-3` · school `#selected-school-dropdown[qid=t-cc-cd-inpt-4]` (**readonly**; focus opens `li.dropdown-item`; match by startsWith "3 July Test School 2" — exactly 1 item; **never click "Add a school / Join using a school key"**) · Cancel `t-cc-cd-btn-1` · Next `t-cc-cd-btn-2` (natively disabled). Where Cancel lands is unresolved (a synthetic click reached the admin dashboard; a real click stayed put) — do not rely on it.
- Later steps (materials → "Add later" → success) are NOT grounded — the first run grounds them.
- Reuse `createNewClass.page.js` `click_next_btn` / `click_addLater_Btn` / `getData_successfullyCreated`, but NOT `set_startDate` / `set_endDate` (hardcoded 2024 dates) or `set_enterYourSchool` (types into a readonly field).
- Name `AutoClass_TeacherView_<RUN_ID>`. Verify in KNF's admin Classes tab by polling (creation is async, ~24 s to >90 s). Cleanup: CGST's `sweepClassesNamed` pattern (`adminClassGradeSettings.test.js`) — sweep BEFORE creating, bounded loop, assert every step.
- Own exec file (e.g. `adminGenericCreate.json`) + own npm script (needs user confirmation).

## learningPath (ExperienceApp, production; thor blocked) — `learningPathTest_prod` / `learningPathTest_thor`
Modules `SNUP` · `TSET` · `ENTE`/`CREA`/`INVI`/`DASH` deltas (setup chain) · **`PEXT`** (LP-001/002/003/005/006) — playwright-automation-c1 `lp-scenarios.xlsx` rows 1–6 · **creates 1 teacher + affiliation + 1 class + 1 learner per full run** (user-approved; debug runs `learningPathDebug.json --runData=last` create nothing) · knowledge: `onboarding.md`, `teacher-dashboard-class-page.md`, `learning-path-player.md`, `c1-core-shared.md` · manual register: `test/Manual/C1App/LearningPath/` (sheet 1 LP, sheet 2 setup by module)
- Phase 1 ✅ 2026-09-22 — setup `TST_SNUP_TC_59..64`, `TST_TSET_TC_1..4`, `TST_ENTE_TC_24..26`, `TST_CREA_TC_30`, `TST_INVI_TC_13/101`, `TST_DASH_TC_12/13`; LP `TST_DASH_TC_14`, `TST_PEXT_TC_1..8`, `TST_PEXT_TC_100` (+ reused LAND/LOGI/DASH/ENTE/CREA/INVI TCs); visual candidates: none (generated users / names / keys)
- Phase 2 ✅ 2026-09-22 — full suite (7 suites) **53/53** on prod; Suites 1–3 clean twice before; Suites 6–7 debugged in `--runData=last` mode (8/8, 11/11)
- Phase 3 ⏭️ DEFERRED by user decision (2026-09-22) — all TCs stay `visualTest: false`
- **Blocked:** thor — verify link host `login.comprodls.com` certificate expired 2022 (`SNUP_TC_61`); unblock = cert renewed
- **Not built:** LP-004, LP-016, LP-017 (automation-mechanics — recorded as not covered in the register)

### Batch 2 — part A + C (learner player + dashboard) `[2026-09-23]`
Suite 8 (new) + `TST_DASH_TC_15` in Suite 6 · `TST_DASH_TC_16`, `TST_PEXT_TC_9…13, 16…19, 25`, appended `TST_PEXT_TC_26`, housekeeping `TST_PEXT_TC_101`
- Phase 1 ✅ 2026-09-23 — grounded live first (read-only probe on learner `_uyu7`); Suite 8 debug run **21/21** (`--runData=last`)
- Phase 2 ✅ 2026-09-23 — full run 1 **74/75** (learner `_vcmw`; `TST_DASH_TC_15` failed on test design — a learner
  with a pending invite lands on "Invitations (1)", not the dashboard; fixed with user OK), full run 2 **75/75**
  (teacher `_e9mo`, Class lm76, learner `_iyit`). Every Suite 8 case green in both full runs + the debug run;
  `DASH_TC_15` green once (only a full run can exercise it). Evidence audit clean (both runs).
- Phase 3 ⏭️ DEFERRED (as batch 1) — all new TCs `visualTest: false`
- **Register:** regenerated (`.md` + `.xlsx`): 22 Pass · 9 Not Run · 4 Blocked.
- **Register corrections:** LP-021/022 were wrongly Blocked (product HAS an HTML and a PDF activity).
- **Open for the product owner:** LP-019 open control toggles the TOC (sheet assumed "stays open"); LP-027 spinner, not a progress bar; LP-018 ✕ keeps the learner in the LP (Back leaves).

### Batch 2 — part B + D + E + LP-021/022 `[2026-09-23]`
Suite 7 +`TST_PEXT_TC_15` (LP-013, before TC_4) +`TC_24` (LP-025, after TC_4) — ONE learner, no second one ·
Suite 8 +`TC_20/21` (HTML/PDF) + housekeeping `TC_102` · Suites 9–12 teacher (`CMAT_TC_7`, `MSAC_TC_1`, `C1AS_TC_26`,
`TLIB_TC_1`) · Suite 13 admin (`UMBP_TC_11`, prod `prod_admin_mqa@yopmail.com`) · new modules **MSAC**, **TLIB** (agreed)
- Phase 1 ✅ — grounded live (teacher `_e9mo`, admin, fresh learner `_5an7` from a setup-only run Suites 1–6)
- Phase 2 ✅ 2026-09-23 — full run 3 **95/96** (`TC_24` failed: first entry → TOC reopens on the unit view; fixed with
  user OK) → full run 4 **96/96** (teacher `_osgr`, Class qzwn, learner `_xov9`). Debug Suites 8–13 green after 3
  approved fixes; `UMBP_TC_11` 5/5 after the load-wait fix. Evidence audit clean. Suite 7's LP-013/025 steps have
  one clean full run (each needs a fresh learner) — the rest passed in several.
- Phase 3 ⏭️ DEFERRED — all new TCs `visualTest: false`
- **Register:** 31 Pass · 0 Not Run · 4 Blocked (child account, group Collab, group PS, NLP). `TST_UMBP_TC_5` → `TST_UMBP_TC_11`.
- **Nothing saved on teacher paths** (user decision): Next/Assign and Continue never clicked.

### Batch 2 — LP-030 + collaborative / group (LP-023/024) `[2026-09-23]`
- **`TST_C1AS_TC_27`** (LP-030, Projects = the NLP component, launch only): Suite 14; debug 3/3; passed in full run 7.
- **`TST_PEXT_TC_22` / `TC_23` — ON HOLD by user** ("do not automate until I confirm"). Blockers resolved: Projects
  (`cqaautomationpr1`) holds "Collaborative Task" + "Group PS"; groups = Class data → Students/Groups toggle → "+ Create
  groups" (user screenshot; toggle not seen on a 1-student class); learner B approved for these two only; mark 90 /
  "Well Done"; modules NLPP / CGRP / MRKQ agreed. **Parked**: `learningPathGroups.json` (Suites 17–19, learner B
  signup → invite → accept) — NOT in `learningPathTest_prod`; verified 65/65 with Suites 1–6 (teacher `_f6up`, Class
  f98w, learners `_mgka` + B `_kwtm`). Next when confirmed: ground the Groups toggle on that 2-student class.

### LP-034 — progress views (module PROG) `[2026-09-24]`
- `TST_PROG_TC_1/2` (learner, end of Suite 8) · `TST_PROG_TC_3/4` (teacher, Suite 15) — Phase 1 ✅: debug 7/7 on the
  previous run's users (`_osgr` / Class qzwn / `_xov9`) after a user-approved selector fix.
- Phase 2 ⚠️ — full run 7 (2026-09-24) **103/105** (teacher `_4n9d`, Class u62l, learner `_yqma`): TC_2/TC_4 ✅; TC_1/TC_3
  failed on the summary lag (batch job, minutes — user-confirmed expected). Fixed: learner PROG moved to the LAST suite
  (16); TC_1/TC_3 re-read every 20 s up to 10 min. Verified on a debug run only — **full run NOT run by user decision**.
  Earlier: two runs stopped in class creation (production disruption); `click_addMaterial_btn` now waits 90 s.
- Phase 3 ⏭️ DEFERRED — `visualTest: false`.

### LP-035 — teacher marks the PS (MRKQ) + post-marking progress (PROG_TC_5…7) `[2026-09-24]`
From SOURCE `ClassDashboardPage` (marking / analytics), ported without its positional ids, fixed 3 s pause and silent skips.
- Grounded: one REAL mark (user-approved) of run 7's learner `_yqma` (Class u62l) — score 70 (pre-filled; user: SOURCE's 70), "Good".
- Built: `markingQueue.page.js` + `markingQueue.test.js` (`MRKQ_TC_1/2`, new **Suite8b** after Suite 8); `PROG_TC_5` (feedback
  notification), `PROG_TC_6` (rows after marking), `PROG_TC_7` ("Show progress details"); `PROG_TC_1/3/4` now expect the post-marking
  figures (`C1.progressMarked`); `PROG_TC_2` back at the end of Suite 8 (pending state, `C1.progressPending`).
- Phase 2 ✅ 2026-09-24 — full run 8: MRKQ_TC_1 failed (a submission reaches the queue after 4.3–6.6 min; waited 3) → fixed
  (≤ 12 min; Suite8b moved after Suite 14, user OK). **Full run 9: 112/113** (teacher `_qzro`, Class e6tb, learner `_m10b`) — every
  MRKQ / PROG case green. The one failure: `TLIB_TC_1` — My library still loading at 30 s (disruption); fix APPLIED (≤ 90 s, user OK) — NOT yet verified (no full run, user decision).
- Deferred by user: the same chain for Projects' own PS (SOURCE `openMarking(1)`).

### NEXT BATCH — start here if you are asked to "automate the Learning Path" `[2026-09-23]`
**The cases are already designed.** Do not re-derive them from the scenario sheet: all 33 scenarios of
`lp-scenarios.xlsx` are mapped in the manual register `test/Manual/C1App/LearningPath/`
(sheet "Test Cases": 34 rows — 9 Pass = automated, 19 Not Run, 6 Blocked with reasons; sheet
"LP Setup (by module)": the fresh-user chain). Pick the Not Run cases, keep their TC IDs.
1. **Read first:** this block · `product-knowledge/ExperienceApp/learning-path-player.md` (Part C has
   the commands, the debug mode and the data constraints) · `c1-core-shared.md` · the register `.md`
   (its "How to automate a case from this register" section) · then the `c1-test-authoring` skill.
2. **Suggested order:** ~~LP-007…011, 014, 015, 018…020, 026, 027~~ (done 2026-09-23, above), then
   LP-013/025 (second learner), LP-021/022, then the teacher/admin entry points (`CMAT_TC_7`, `C1AS_TC_26`,
   `MSAC_TC_1`, `TLIB_TC_1`, `UMBP_TC_5` — `MSAC`/`TLIB` module codes are PROPOSED, agree them first).
3. **Constraints that decide how a run is planned:** the suite runs on **production and creates real
   data every full run**; the scorable activity and the Practice Set are fresh **once per learner**;
   debug with `learningPathDebug.json` + `--runData=last` (creates nothing).
4. **Ask the user** (they know the product): any expected result marked `[ASSUMED]` in the register,
   what unblocks the 6 Blocked cases, and approval before any new data-creating flow (ADR-021).
5. **Close the loop:** update the register (Status + `Comments`) via
   `node test/Manual/C1App/LearningPath/_generate.js` after back-porting into `_tcdata*.js`, and update
   this block. Remove this "NEXT BATCH" section when the LP work is finished.

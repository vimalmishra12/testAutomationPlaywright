# Walkthrough — ebook-foc-suite-merge

## Session 1 — 2026-09-22

## Summary
Analysis-only session: audited all 51 `ExperienceApp/thor` execution files, identified the 17 eBook / FOC
(Front-of-Class) suites and their test cases, documented verified duplicates and overlaps, and produced a
merged-suite consolidation plan. **No test code, page objects, TC repository, or protected files were changed.**
One planning document was created.

## Changes Made

### 1. `.architecture/PLAN_ebook-foc-suite-merge_2026-09-22.md`
- **Type:** Created
- **Layer:** Documentation (architecture/planning)
- **What changed:** Full consolidation plan containing: (1) inventory of the 17 eBook/FOC exec files + their 16
  npm scripts with exact TC-ID sets and login accounts; (2) verified exact/near duplicates with file:line evidence
  (e.g. `player.json` ≡ `ebooksE2ETest.json` Suite8; `eBookTestMaster_v.0.json` ⊂ `ebooksE2ETest.json`;
  `toolsFeatureTest.json` fully absorbed); (3) merged target structure — canonical 8-suite `ebooksE2ETest.json`,
  collapsed 1-suite `ebookFocusA11yTest.json`, new `teacherEbookLaunchTest.json` (4 launch suites),
  `highlighterTest.json` re-marked visual-only, 8 npm scripts retired; (4) original→merged mapping table with a
  coverage guard (executed-TC union identical before/after); (5) ordered CI flow with dependencies;
  (6) implementation notes, trade-offs and a 6-step execution checklist.
- **Why:** Reduce ~62 % duplicated execution volume across the eBook/FOC npm scripts without dropping any test
  suite, test case, or validation.
- **Lines affected:** Entire file (new, ~190 lines)

## Architecture Decisions Triggered
- No code-level pattern changes. The plan deliberately operates only on execution-file JSONs + npm scripts —
  honoring Layer 5 ("Execution Files Are Pure Configuration") and the protected-file rule for `package.json`
  (change gated behind the confirmation protocol in plan §7 step 5).
- Plan records the repo's FOC definition ("Front of Class (eBooks)", `tooling/dashboard/dashboard.config.json`)
  alongside the keyboard-Focus suites so both readings are covered.

## Protected Files Touched
None — no protected files were modified. (`package.json` edits are *proposed* in the plan but require explicit
user confirmation before execution.)

## Pending / Follow-up
- Plan is **PROPOSED** — awaiting user approval to execute §7 of the plan (exec-file edits → teacher merged file
  → `package.json` confirmation → green re-runs → retire twin exec JSONs).
- Decision deferred to user: adding registered-but-unexecuted TCs (EBOO 10‑12,14‑16, PAGE 3,5, NOTE 2,5,
  DRAW 7,8,11‑13,15‑17, TIME 8,10,15,16, SHOW 4, COMM 5,6, CMAT 6) to the merged flow.
- `qa/` and `production/` folders hold the same twin exec files; the same merge can be inherited later.
- Filename note: this walkthrough uses the date-only form (precedent: `walkthrough_notesTest_2026-09-17.md`)
  because no session clock was available for the `HHh-MMm` suffix.

---

## Session 2 — 2026-09-22

## Summary
Independent code review of the Session-1 plan (full cross-check against the 51 thor exec files, the
`C1TCRepository.json` registrations, and every `package.json` script). Review verdict: APPROVE WITH
SUGGESTIONS — teacher and student coverage claims verified complete; two MEDIUM and four LOW issues found.
The plan was then revised in place to r2 accordingly.

## Changes Made

### 1. `.architecture/PLAN_ebook-foc-suite-merge_2026-09-22.md`
- **Type:** Modified (r2)
- **Layer:** Documentation (architecture/planning)
- **What changed:** (1) §3.1 now explicitly retains the `EBOO_1/3/8` viewer-open steps before the notes battery
  (r1's wording would have run `NOTE_TC_1` with the viewer closed — E2E S3's Before has no open steps, unlike
  `notesTest.json` which carries them in Before); (2) §4 coverage guard corrected to
  `NOTE 1,3,4,6‑15,18 (14 ids)` and a registry note added — `TST_NOTE_TC_16/17` do not exist;
  (3) §1 row 18 corrected to `EBOO 1‑8,13,17‑22,24,25` (EBOO_23 absent from `teacherPresentationPlus1RBTest.json`);
  (4) §2.2 tools-S1 drop-list corrected to `DRAW_TC_19/20`; (5) §3 counts restated from the plan's own inventory
  (19 → 8 scripts; 9 → 1 functional learner-reader runs); (6) §6 verification checklist gained the clean-tree /
  baseline-sha precondition (4 page-object/selector files are currently staged) and a new bullet requiring the
  post-S6 mid-file logout to be verified with S7/S8 in the same run; (7) §6 production bullet flags the
  unregistered `EBOO_55‑61` references in `production/ebookLearningHyperlinkVC_V.1.0.json:132‑170` as an
  inheritance prerequisite; (8) §7 gained step 0 (clean baseline) and step 1 now spells out the retained Suite3
  open steps; header carries the r2 revision note.
- **Why:** Review found the r1 Suite3 spec breakable as literally worded, and the §4 guard impossible to match
  in a run report (it required NOTE_16/17, which are not registered anywhere); LOW items were inventory/
  arithmetic precision in a document whose purpose is to be an exact checklist.
- **Lines affected:** header (revision bullet); §1 row 18; §2.2 tools-S1 bullet; §3.1; §3 counts paragraph;
  §4 mapping row + coverage-guard NOTE entry + FYI note; §6 three bullets; §7 steps 0–1.

## Architecture Decisions Triggered
None — plan-level corrections only; no new patterns.

## Protected Files Touched
None — no protected files were modified.

## Pending / Follow-up
- Plan remains **PROPOSED**; §7 step 0 (clean tree + baseline sha) is now the mandatory first action.
- `EBOO_55‑61` dangling references in the production hyperlink suite must be resolved before qa/production
  inherit the merge.
- During the §7 step-6 green run, explicitly confirm E2E S7/S8 pass after the transplanted S6 `APPS_1/2` logout.

---

## Session 3 — 2026-09-22

## Summary
User decisions restructured the final script set; the plan was rewritten in place to r3. No code, exec-file,
or protected-file changes — the plan remains PROPOSED.

## Changes Made

### 1. `.architecture/PLAN_ebook-foc-suite-merge_2026-09-22.md`
- **Type:** Modified (r3 — full rewrite)
- **Layer:** Documentation (architecture/planning)
- **What changed:** Encodes the user's decisions: (1) learner E2E renamed **`ebookE2EstudentTest`** (script +
  exec file, via `git mv`); (2) `ebookToolbarFocusTestVisual_thor` **retired** — EBTF visual baseline dropped,
  functional EBTF 1‑16 kept; (3) the 4 teacher launch suites **plus** the Presentation Plus suite merged into
  one new **`ebookE2EteacherTest_thor`** / `ebookE2EteacherTest.json` (5 suites — all teacher eBook cases;
  S5 verbatim incl. its `APPS_1/2` logout After); (4) `createAssignmentFeatureTest_thor` renamed
  **`createAssignmentTest_thor`** (exec `c1createAssignment.json` unchanged) alongside the unchanged
  `createAssignmentPplusTest_thor`; (5) `visualAcceptance_thor` name kept — now the only visual script in the
  perimeter. Script-change totals recomputed: **14 retired, 2 renamed, 1 added → 7 final scripts**
  (6 eBook/FOC + the renamed create-assignment script). §2.2 pplus bullet, §3 (sections 🅐–🅤), §4 mapping
  (rename rows + "r3 changes nothing in the union" note), §5 (7-step CI order), §6 (confirmation protocol now
  covers renames/additions; stale-reference check added) and §7 (steps 0–6) all restructured. All r2
  corrections preserved (Suite3 viewer-open steps, NOTE 14-id guard, teacher battery range, clean-baseline
  step, mid-file-logout check, production EBOO_55‑61 prerequisite).
- **Why:** Direct user decisions on the final script set and naming, and on merging the teacher launch and
  PPlus coverage into a single teacher E2E script. TC-union coverage guard unchanged.
- **Lines affected:** entire file (rewrite, 328 lines); this Session-3 walkthrough section.

## Architecture Decisions Triggered
- Teacher E2E pattern: one file merging launch flows + PPlus surface suite (🅒). If adopted at execution,
  consider an ADR in `decisions.md` describing the `<domain>E2E<role>Test` script/exec-file pattern.

## Protected Files Touched
None — no protected files were modified (`package.json` renames/additions remain PROPOSED behind the §7
step-5 confirmation protocol).

## Pending / Follow-up
- Plan remains **PROPOSED**; §7 step 5 is now a single protected-file confirmation covering 14 retirements,
  2 renames and 1 addition.
- Open user choice: whether the `…Test_thor` rename pattern should extend to
  `completeAssignmentFeatureTest_thor`, `deleteAssignmentFeatureTest_thor`, `studentAssignmentFeatureTest_thor`.
- EBTF visual baseline is dropped (user decision) — `ebookToolbarFocusTestVisual_thor` can be restored from
  git history if toolbar visual checks are wanted again.

---

## Session 4 — 2026-09-22

## Summary
User decision: **no exec file in `thor/` may ever be deleted, renamed or modified.** Plan revised in place to
r4 accordingly. Still no code/exec-file changes — plan remains PROPOSED.

## Changes Made

### 1. `.architecture/PLAN_ebook-foc-suite-merge_2026-09-22.md`
- **Type:** Modified (r4)
- **Layer:** Documentation (architecture/planning)
- **What changed:** File-deletion policy replaced with create-only: (1) 🅐 `ebookE2EstudentTest.json` is now a
  **new file created as a copy** of `ebooksE2ETest.json` (r3's `git mv` rename dropped; original kept as
  archive); (2) 🅑 the focus 4→1 collapse moves to a **new** file `ebookFocusA11yMergedTest.json` and
  `ebookFocusA11yTest_thor` is retargeted via `--testExecFile` instead of the old file being edited; (3) 🅤 the
  `highlighterTest.json` re-marking step is dropped — the file stays byte-identical (visual-only by usage);
  (4) the 11-twin post-green deletion list becomes a permanent **archive** list (13 files unreferenced: 11
  twins + `ebooksE2ETest.json` + `ebookFocusA11yTest.json`; `notesTest.json` also becomes archive) — thor/
  grows 51 → 54, nothing is deleted; (5) archive files are declared frozen (never edit them again);
  (6) script ops summary is now 14 retired / 2 renamed / 1 retargeted / 1 added; (7) §4 mapping rows, §6
  confirmation-protocol wording and verification bullet, and §7 steps 1–6 updated to match. Header carries
  the r4 revision bullet.
- **Why:** User directive — keep every existing file under `testResources/testExecutionFiles/ExperienceApp/thor/`
  intact; consolidation may only add new exec files and change npm scripts.
- **Lines affected:** header (r4 bullet); §1 footnote; §3 intro policy paragraph; 🅐 heading+intro; 🅑 section;
  🅤 section; §3 "Renamed/Retargeted/Added" paragraph and exec-file paragraph; §4 two mapping rows; §6 two
  bullets; §7 steps 1–6.

## Architecture Decisions Triggered
- r4 archive policy: superseded exec files are retained and frozen rather than deleted; the merged copies are
  the single source of truth going forward. Consider an ADR note in `decisions.md` if this becomes the
  standing policy for suite consolidations.

## Protected Files Touched
None — no protected files were modified.

## Pending / Follow-up
- Plan remains **PROPOSED**; §7 step 5 (protected-file confirmation) now covers 14 retirements, 2 renames,
  1 retarget, 1 addition.
- Deletion of the 13 archived files, if ever desired, is a separate future decision (r4 keeps git history as
  the only recovery path argument moot — the files simply stay).
- Archive files must never be edited; if the merged copies diverge from product behaviour, fix the merged
  files only.

---

## Session 5 — 2026-09-22

## Summary
Executed plan §7 steps 1–3 (r4 create-only): the three new merged exec files were generated in `thor/` by a
guarded Node build script (temp dir, not committed) and independently audited. No existing exec file was
touched; step 0 (uncommitted page-object/selector work) was resolved by the user in commit `0d9c2bf`.

## Changes Made

### 1. testResources/testExecutionFiles/ExperienceApp/thor/ebookE2EstudentTest.json
- **Type:** Created
- **Layer:** Test Resources (execution file)
- **What changed:** Content-identical copy of `ebooksE2ETest.json` (all 8 suites) with exactly two edits —
  (a) `Suite3`: Name → "Validation of eBook Page (Notes) - full notes battery (merged)" and Test replaced by
  [EBOO_1, EBOO_3, EBOO_8, EBOO_13] + the full 38-step battery from `notesTest.json` Suite1.Test verbatim
  (42 steps total); (b) `Suite6`: empty After filled with the 7-step teardown from
  `nextPreviousPageButtonTest.json` After verbatim (EBOO_9, PAGE_2, PAGE_1, PAGE_4, EBOO_5, APPS_1, APPS_2).
  No suite-label fixes were needed — the E2E file's `Name` fields were already accurate (the mislabels lived
  only in the frozen twin files).
- **Why:** Plan step 1 — single student E2E owner of notes; r4 forbids editing the source.
- **Lines affected:** whole file (new); deltas described above relative to `ebooksE2ETest.json`.

### 2. testResources/testExecutionFiles/ExperienceApp/thor/ebookFocusA11yMergedTest.json
- **Type:** Created
- **Layer:** Test Resources (execution file)
- **What changed:** `ebookFocusA11yTest.json`'s four suites collapsed into one `Suite1`: Before block from
  Suite1 (build script asserts all four source Before blocks are byte-identical), Test = KBOA_1…KBOA_19
  concatenated as a single login journey; BeforeEach/AfterEach/After empty (script asserts all four source
  After blocks were empty).
- **Why:** Plan step 2 — one login instead of four for the a11y battery; source stays frozen.
- **Lines affected:** whole file (new): 1 suite, Before:6, Test:19.

### 3. testResources/testExecutionFiles/ExperienceApp/thor/ebookE2EteacherTest.json
- **Type:** Created
- **Layer:** Test Resources (execution file)
- **What changed:** Five top-level suites, each the verbatim `Suite1` object of `teacherEbook1RBTest.json`,
  `teacherEbook2RBTest.json`, `teacherClassMaterials1RBTest.json`, `teacherClassMaterials2RBTest.json`,
  `teacherPresentationPlus1RBTest.json` — each keeps its own Before (DASH_11 entry) and 2-step APPS logout
  After. Suite counts: 9/9/5/9/27 Test steps.
- **Why:** Plan step 3 — one teacher E2E script covering the five teacher batteries.
- **Lines affected:** whole file (new).
- **Facts corrected during build guards:** teacher S1/S2 Test order ends with EBOO_5 (closeBook last, after
  checkpoint/reading-progress); `teacherClassMaterials2RBTest` Test set is {CMAT_1,2,4,5, RBNK_1,2} — no
  CMAT_3 (it only runs in S3; §4's CMAT 1‑5 coverage holds via S3 ∪ S4).

### 4. package.json  (PROTECTED FILE — confirmation protocol followed)
- **Type:** Modified
- **Layer:** Configuration
- **What changed:** Thor script block consolidated to the 7-script end state — retired 14 scripts
  (`eBookFeatureTest_thor`, `notesFeatureTest_thor`, `highlighterFeatureTest_thor`, `timerFeatureTest_thor`,
  `nextPreviousPageTest_thor`, `toolsFeatureTest_thor`, `drawingFeatureTest_thor`, `eBookHotLinkTest_thor`,
  `ebookToolbarFocusTestVisual_thor`, `teacherClassMaterials1RBTest_thor`, `teacherClassMaterials2RBTest_thor`,
  `teacherEbook1RBTest_thor`, `teacherEbook2RBTest_thor`, `teacherPplusTest_thor`); renamed
  `createAssignmentFeatureTest_thor` → `createAssignmentTest_thor` (target file unchanged) and
  `ebooksE2ETest_thor` → `ebookE2EstudentTest_thor` (retargeted to `ebookE2EstudentTest.json`); retargeted
  `ebookFocusA11yTest_thor` → `ebookFocusA11yMergedTest.json` (name kept); added
  `ebookE2EteacherTest_thor` → `ebookE2EteacherTest.json`; added a `//`-marker key noting the consolidation
  and pointing at the plan file (JSON has no comments; marker matches the file's existing section-marker style).
- **Why:** Plan §7 step 5. ⚠️ Confirmation protocol: exact change block (file/section/current/change/reason)
  was presented; user confirmed by directing continuation ("continue") after the block was shown.
- **Lines affected:** scripts block — former lines 17, 24–30, 33–37, 59–63.

## Verification performed
- Build guards (sequence/set equality per suite) — all pass after the two corrections above.
- Independent audit script re-parsed all three files, dumped the layout above, and re-checked §4 coverage
  across student+focus+teacher+toolbar: EBOO 1‑9,13,17‑25,51‑54 · PAGE 1,2,4 · NOTE 1,3,4,6‑15,18 ·
  DRAW 1‑6,9,10,14,18‑20 · TIME 1‑7,9,11‑14 · SHOW 1‑3 · PLAY 1‑10 · COMM 1‑4 · KBOA 1‑19 · CMAT 1‑5 ·
  RBNK 1‑2 — all green.
- Every step id in the three new files (whitelisting the `launchUrl` keyword) exists in
  `C1TCRepository.json` — all registered.
- `git status --porcelain`: exactly the three new files added; zero modifications to any existing exec file
  (r4 frozen-archive invariant intact).
- After the `package.json` edit: `node -e JSON.parse` OK; all 14 retired + 2 old names absent; the 4 new/
  retargeted thor scripts resolve to files that exist in `thor/`; sweep of every thor script's
  `--testExecFile` found only pre-existing breakage unrelated to this change (`dashboardFeatureTest_thor` →
  `dashboardTest.json` and `resetPasswordTest_thor` → `resetPassword.json` exist only in `qa/`+`production/`;
  Builder/LTI scripts resolve under their own appType dirs) — no regressions introduced.
- NOT yet run against thor — live runs are §7 step 6.
- **Step 6 progress:** smoke run `npm run ebookFocusA11yTest_thor` (merged `ebookFocusA11yMergedTest.json`)
  against thor: **19 passing / 0 failing (110s)** — single-login collapse works end-to-end. Remaining 6
  suites still to run.

## Architecture Decisions Triggered
None new; r4 create-only policy followed as adopted in Session 4.

## Protected Files Touched
`package.json` — scripts block consolidated per plan §7 step 5 under the mandatory confirmation protocol
(exact change block presented; user confirmed by directing continuation). All other protected files
untouched.

## Pending / Follow-up
- §7 step 6: seven green thor runs (`ebookE2EstudentTest_thor`, `ebookFocusA11yTest_thor`,
  `ebookToolbarFocusTest_thor`, `ebookE2EteacherTest_thor`, `createAssignmentPplusTest_thor`,
  `createAssignmentTest_thor`, nightly `visualAcceptance_thor`).
- Pre-existing, out of scope: `dashboardFeatureTest_thor` and `resetPasswordTest_thor` point at exec files
  that do not exist under `thor/` — broken before this change; fix or retire separately.

---

## Session 6 — 2026-09-23

## Summary
Integrated the Presentation Plus Assignment Creation workflow into the teacher E2E test suite as Suite 6
(plan revision r5, Approach A), stabilized new-tab URL resolution in `notes.page.js`, corrected Thor eBook
dropdown fixtures, and updated `package.json` scripts (Commit `71f7451ac161`).

## Changes Made

### 1. testResources/testExecutionFiles/ExperienceApp/thor/ebookE2EteacherTest.json
- **Type:** Modified
- **Layer:** Test Resources (execution file)
- **What changed:** Added `Suite6_CreateAssignmentPresentationPlus` ("Validation of Creating Assignments from
  Presentation Plus in Class 1RB", lines 865–1066). Integrates the 18 steps from the standalone
  `createAssignmentPresentationPlusTest.json`: launches Presentation Plus in Class 1RB, opens TOC, triggers
  "Create Assignment" (`TST_C1AS_TC_21/22`), selects Unit 1 Lesson A, configures dates and students
  (`TST_C1AS_TC_5..13`), assigns, verifies modal return (`TST_C1AS_TC_24`), verifies home navigation
  (`TST_EBOO_TC_5`), and performs clean teardown (`TST_APPS_TC_1/2`).
- **Why:** Plan revision r5 (Approach A) — consolidates the Presentation Plus assignment creation flow
  directly into the master teacher E2E suite, eliminating the need for a separate assignment runner.

### 2. pages/ExperienceApp/notes.page.js
- **Type:** Modified
- **Layer:** Page Object
- **What changed:** Enhanced `click_noteHyperlink()` to eliminate race conditions when reading
  new tab URLs. Replaced immediate `global.page.url()` read with `global.page.waitForURL(...)` specifying
  `{ timeout: 15000, waitUntil: "commit" }`, followed by a fallback 5-iteration polling loop.
  > Corrected `[2026-09-23]`: this line named `switchToNewTabAndVerifyUrlPart()`, which does not exist
  > anywhere in the repository. The method changed is `click_noteHyperlink`, called from
  > `test/ExperienceApp/notes.test.js:114`; `switchToNewTab` is a separate `baseActionLibrary` helper
  > that this method calls.
- **Why:** In asynchronous tab creation, reading `global.page.url()` immediately captured `about:blank`
  before the browser committed navigation to the destination URL.

### 3. testResources/testcaseData/ExperienceApp/thor/ebookData.json
- **Type:** Modified
- **Layer:** Test Resources (test data)
- **What changed:** Corrected `dropdownBook.ebookTwoName` from `vm_automation_ebook_latest_03` to
  `vm_automation_ebook_latest_02`.
- **Why:** Align test data with the actual second eBook fixture provisioned in Thor.

### 4. package.json
- **Type:** Modified
- **Layer:** Configuration
- **What changed:** Removed superseded `createAssignmentPplusTest_thor` script (absorbed by
  `ebookE2EteacherTest_thor`), restored `eBookHotLinkTest_thor` (`player.json`), and cleaned up unused scripts.
- **Why:** Align npm scripts with the 6-suite teacher E2E structure.

### 5. .architecture/PLAN_ebook-foc-suite-merge_2026-09-22.md
- **Type:** Modified
- **Layer:** Documentation
- **What changed:** Recorded revision r5 (Approach A): `createAssignmentPresentationPlusTest.json` merged as
  Suite 6 into `ebookE2EteacherTest.json` (77 tests across 6 teacher suites).

## Architecture Decisions Triggered
- Formally adopted in ADR-023: Role-separated E2E consolidation, multi-suite session isolation via teardown
  hooks, and `waitForURL({ waitUntil: "commit" })` for tab navigation verification.

## Protected Files Touched
- `package.json` updated to retire `createAssignmentPplusTest_thor`.

## Pending / Follow-up
- Clean live runs of `ebookE2EteacherTest_thor` against Thor to verify all 6 suites passing end-to-end.

---

## Session 7 — 2026-09-23

## Summary
Implemented the confirmed follow-ups from reviewing `9228b5e` + `71f7451`: created the merged
accessibility execution file, added the missing per-suite logout teardown to the student E2E file,
paid the outstanding `AGENTS.md` §7 comment debt in `notes.page.js`, and corrected several
knowledge-base claims that measurement proved wrong. Regenerated `tooling/tc-map.md`, which had been
failing its own check since the consolidation.

## Changes Made

### 1. testResources/testExecutionFiles/ExperienceApp/thor/ebookAccessibilityTest.json
- **Type:** Created
- **Layer:** Execution File (Test Resources)
- **What changed:** Merged the 19 `TST_KBOA_TC_1..19` steps of `ebookFocusA11yMergedTest.json` with
  the 16 `TST_EBTF_TC_1..16` steps of `ebookToolbarFocusTest.json` — 35 `Test` steps on one login —
  plus `After: [TST_EBOO_TC_5, TST_APPS_TC_1, TST_APPS_TC_2]`. Built mechanically, not retyped: the
  two sources' `Before` blocks were asserted byte-identical before joining, and each step keeps its
  own `testFile` (ADR-011 composition — no TC redefined). All 38 steps verified to resolve in
  `C1TCRepository.json` via the runner's own `testFile`→`id` rule (`testrunner.js:550`,`:557`).
- **Why:** Restores the 16 `TST_EBTF_TC_*` P1 TCs, which ran in **no** live npm script after their
  two scripts were retired in `9228b5e`. Their flags were left untouched, so per AGENTS.md §8 Rule B
  the companion `visualAcceptance_ebookAccessibility_thor` script is required.
- **Lines affected:** whole file (new, 1…467)

### 2. testResources/testExecutionFiles/ExperienceApp/thor/ebookE2EstudentTest.json
- **Type:** Modified
- **Layer:** Execution File (Test Resources)
- **What changed:** Added the missing `After` teardown to the 7 suites that had none. Suites 1, 2, 4,
  5, 7 (ending on a step other than Close eBook) get `[TST_EBOO_TC_5, TST_APPS_TC_1, TST_APPS_TC_2]`;
  Suites 3 and 8 already end on `TST_EBOO_TC_5` so get `[TST_APPS_TC_1, TST_APPS_TC_2]`. Suite 6 was
  already complete and is untouched. Diff: 128 insertions, 7 deletions (the 7 are the `"After": []`
  lines that expanded).
- **Why:** The file violated ADR-023 decision 2 — its own rule that every suite in a multi-suite file
  logs out. Leaked auth state leaked into the next suite's `launchUrl`.
- **Lines affected:** the `After` block of each of the 8 suites

### 3. pages/ExperienceApp/notes.page.js
- **Type:** Modified
- **Layer:** Page Object
- **What changed:** Added the doc comment for `click_noteHyperlink` (it had none) and inline comments
  across the tab-switch block, which had **zero** comments across ~40 changed lines. 23 insertions,
  0 deletions — comments only, no behaviour change. Records why `waitUntil: "commit"` is load-bearing,
  why `action.waitForUrl()` is unusable here, and why the `catch` falls back to a substring poll.
- **Why:** `AGENTS.md` §7 requires a what/why comment on every changed JS line group.
- **Lines affected:** 193-201 (method doc), 233-240 and 253-256 (wait), 266-271 (fallback)

### 4. .architecture/decisions.md — ADR-023
- **Type:** Modified · **Layer:** Documentation
- **What changed:** Status line no longer claims the student and teacher suites were verified on thor
  (`authoring-status.md:224`/`:230` record them as Phase 2 pending). "38-step notes battery" → 42-step.
  Consequences now carry measured script counts and the two corrections below.
- **Why:** The ADR asserted execution that never happened, and contradicted itself on script counts.

### 5. .architecture/authoring-status.md
- **Type:** Modified · **Layer:** Documentation
- **What changed:** Corrected the notes-battery counts to measured values and opened an
  `ebookAccessibilityTest` block at Phase 1 with Phase 2 pending.
- **Why:** This file owns the "✅ requires a real run" rule; the new file must not inherit a ✅ it has
  not earned.

### 6. .architecture/product-knowledge/ExperienceApp/class-materials-ebook-foc.md
- **Type:** Modified · **Layer:** Documentation
- **What changed:** Part B §1 now states the boundary with ADR-015C instead of reading as a
  contradiction of `schoolLibrary.page.js:351-364`, and records that the `baseActionLibrary` escape
  hatch is still outstanding. Part B §2 generalises the teardown rule to student suites, documents the
  close-eBook-before-logout ordering as `[ASSUMED]`, and documents the duplicate-`TST_APPS_TC_*` id
  trap. Part C §2's suite table corrected to measured step counts.
- **Why:** ADR-020: a trap found in a session is not documented until it reaches a knowledge file.

### 7. package_copyDND.json
- **Type:** Modified · **Layer:** Config
- **What changed:** Eight `//` marker keys at the head of `scripts` stating plainly that this is a
  stale copy, not a retirement ledger, that 5 removed scripts are absent from it, and that nothing
  reads it.
- **Why:** It was being relied on as the ledger for the retired scripts; measurement shows it is not.

### 8. tooling/tc-map.md
- **Type:** Modified (generated) · **Layer:** Tooling
- **What changed:** Regenerated with `node tooling/tcMap.js` — 143 execution files, 1112 TCs.
- **Why:** `node tooling/tcMap.js --check` has exited 1 since `9228b5e` removed scripts without
  regenerating. It now reports the map up to date.

## Architecture Decisions Triggered
- No new ADR. ADR-023 corrected in place; ADR-011 (reuse, compose via per-step `testFile`) and
  ADR-003 (escape hatch) both re-cited rather than extended.
- ⚠ Two claims from earlier sessions were **disproved by measurement** and are corrected above: the
  retired-script count, and `package_copyDND.json`'s status as a ledger.

## Protected Files Touched
- `package.json` — **modified after explicit confirmation**, later in the same session (see §9 below).
  The confirmation block was presented, held open across several turns while the non-protected work
  was done and verified, and answered before the file was edited.
- `baseActionLibrary.js`, `testrunner.js`, `run.js`, `env.conf.js` and the rest of the protected list
  are untouched.

### 9. package.json  (PROTECTED FILE — confirmation received before editing)
- **Type:** Modified
- **Layer:** Configuration
- **What changed:** Line 15 `ebookFocusA11yTest_thor` → `ebookAccessibilityTest_thor`, repointed from
  the frozen `ebookFocusA11yMergedTest.json` to `ebookAccessibilityTest.json`; added
  `visualAcceptance_ebookAccessibility_thor` running the same file with
  `--visual=novus --skipAssertion=true`. Script count 94 → 95. Two cosmetic fixes applied on a second
  explicit confirmation: line 7's `test` hint suggested the deleted `loginFeatureTest_thor` and now
  suggests `ebookE2EstudentTest_thor`, and line 13's `//` marker gained a pointer to
  `package_copyDND.json` with the caveat that it is an incomplete copy. No other line changed.
- **Naming decision — `Feature` suffix: considered and DECLINED by the user `[2026-09-23]`.** The
  proposal was to drop the redundant `Feature` from the five `*AssignmentFeatureTest_prod` /
  `createAssignmentFeatureTest_LT` scripts. Measured before acting: **32 of the 95 scripts carry
  `Feature`** (15 `_prod`, 15 `_LT`, 2 `_LT` variants), so renaming 5 would leave 27 keeping it and put
  `createAssignmentTest_prod` beside `completeAssignmentFeatureTest_prod` — more inconsistent than
  before, not less. Renaming all 32 for real consistency is also riskier than it looks, because the CI
  default `loginFeatureTest_LT` contains the word and appears three times in
  `.github/workflows/e2e-tests.yml`. User decision: leave the naming alone. **Do not re-propose this
  without new information.**
- **Why:** Gives the merged 35-step file a name to be run by, and satisfies AGENTS.md §8 Rule B, which
  requires a dual script because that file contains 16 `visualTest: true` TCs. Naming covers the
  toolbar-focus suite as well as the keyboard-focus suite, since both now live in this one file.
- **Lines affected:** 15-16
- **Verified:** `npm run visualAcceptance_ebookAccessibility_thor` → 35/35 in 3m, exit 0, wrote 16
  baselines all named `TST_EBTF_TC_*` and none for the keyboard steps, no non-zero mismatch. The
  functional script's command string was asserted byte-identical to the direct-runner invocation that
  had already passed 35/35. `tooling/tc-map.md` regenerated: `TST_EBTF_TC_*` now resolve to
  `ebookAccessibilityTest_thor` + the visual script instead of the two retired names.

## Pending / Follow-up
- `package.json` — **fully closed out.** The a11y rename, repoint and Rule B companion (§9) plus the
  two cosmetic fixes are applied and verified; the `Feature`-suffix rename was declined. Nothing about
  this file remains open.
- **Knowledge-file split: considered and DECLINED `[2026-09-23]`.** Splitting
  `class-materials-ebook-foc.md` into per-screen files was raised under ADR-020 and rejected on that
  same ADR's own triggers: the file is 120 lines against a ~500-line secondary trigger, its Part A/B/C
  structure is already the ADR's shared-file shape, and `c1-core-shared.md` is the designated shared
  entry point for this area (`ExperienceApp.md:73-74`), so a second `*-shared.md` would create two
  competing shared files for one area. Its factual errors were corrected in place instead (§6).
  > **Superseded `[2026-09-23]`, later the same day — the decline above does not stand.** The user
  > re-opened it and a plan was written:
  > [`PLAN_split-class-materials-knowledge_2026-09-23.md`](../PLAN_split-class-materials-knowledge_2026-09-23.md).
  > Two of the three reasons given above were misreadings of ADR-020: the ~500-line trigger is stated
  > as *"the **app file** passing ~500 lines"* (`decisions.md:690-691`) and does not govern a
  > feature-area file, and the Part A/B/C shape is shared by the per-screen files too
  > (`learning-path-player.md:12-106`), so it argues nothing. The `c1-core-shared.md` objection is
  > sound but inapplicable — the plan creates no second `*-shared.md`, it routes cross-screen content
  > into the existing one. ADR-020's **primary** trigger (own module code + own page object) is met
  > five times in this file, and the split is now the anomaly-free state of the directory. **Executed
  > later `[2026-09-23]` — see Session 8 below.**
- **Live verification performed after the edits above, all green on thor.** Each was invoked straight
  through the runner (`node core/runner/run.js --appType=ExperienceApp --testEnv=thor
  --testExecFile=<file> --browserCapability=desktop-chrome-1920`), which needs no `package.json`
  change and therefore did not pre-empt the outstanding confirmation:
  | Execution file | Result | Wall clock |
  |---|---|---|
  | `ebookAccessibilityTest.json` | **35/35 passing**, 0 failures, 0 pending | 4m (222,798 ms) |
  | `ebookE2EstudentTest.json` | **127/127 passing** across 8 suites | 13m (794,599 ms) |
  | `ebookE2EteacherTest.json` | **77/77 passing** across 6 suites | 5m (303,618 ms) |
  All three exited 0. The student run confirms the new teardown: every one of the 8 suites executed an
  `After` ending in `TST_APPS_TC_1` → `TST_APPS_TC_2`, and the 5 suites that gained a leading
  `TST_EBOO_TC_5` passed, so closing the reader before logout is safe after the drawing and timer
  suites. The accessibility run confirms the single login carries both halves and the KBOA→EBTF page
  handoff. Logs: `output/a11y_verify.log`, `output/student_verify.log`, `output/teacher_verify.log`
  (gitignored).
- `baseActionLibrary` — extract the forced raw `global.page.waitForURL` into a named logged method
  (needs protected-file confirmation).
- `TST_APPS_TC_1/2` are registered twice (`Login` and `appShell` modules); worth de-duplicating.
- **Pre-existing, not from this session:** 13 execution steps reference TC ids the runner will throw
  on — `TST_EBOOK_TC_1/2/4` (invalid module code; `eBook.page.js` yields `EBOO`, not `EBOOK`) and
  `TST_EBOO_TC_55..61` (never registered), all in the frozen archives
  `ebookLearningHyperlinkVC.json` and `ebookLearningHyperlinkVC_V.1.0.json`. These keep
  `node tooling/tcMap.js --check` exiting 1 even with an up-to-date map.
- `learningPathTest_thor` in `authoring-status.md:187` is **not** an error — that section is headed
  "production; thor blocked" and `learningPathTest_prod` does exist. An earlier review finding
  claiming it dead was wrong.

---

## Session 8 - 2026-09-23

## Summary

Split `class-materials-ebook-foc.md` into five per-screen knowledge files and moved its cross-screen
rules into `c1-core-shared.md`, under ADR-020. Documentation only — no test, page object, execution
file, selector, TC repository or `package.json` change. Plan:
[`PLAN_split-class-materials-knowledge_2026-09-23.md`](../PLAN_split-class-materials-knowledge_2026-09-23.md).

This reverses the Session 7 decline. That decline rested on two misreadings of ADR-020, recorded in the
supersede note above it; the operative trigger is *"a feature area earns its own file when it has its
own module code and page object"* (`decisions.md:690-691`), which this content satisfied five times,
while the ~500-line figure is explicitly *"the **app file** passing ~500 lines"* and never applied here.

## Changes Made

### 1. Five new screen files under `product-knowledge/ExperienceApp/`
- **Type:** Created — `foc-class-materials.md` (32 lines, `CMAT`), `foc-resource-bank.md` (28, `RBNK`),
  `foc-ebook-reader.md` (58, `EBOO` + `DRAW` `PLAY` `TIME` `SHOW` `KBOA`), `foc-notes.md` (60, `NOTE`),
  `foc-presentation-plus.md` (40, `C1AS`).
- **Layer:** Product knowledge (ADR-020 feature-area level).
- **What changed:** Bodies were **cut by line range from a snapshot of the original**, never retyped,
  so moved text is byte-identical by construction. Each file carries the 9-line header shape of
  `learning-path-player.md:1-9` and the Part A / B / C structure its siblings already use.
- **Why:** `CMAT`, `RBNK`, `EBOO`, `NOTE` and `C1AS` each own a module code and a page object; the
  reader tools (`DRAW` `PLAY` `TIME` `SHOW` `KBOA`) have no page object of their own and therefore
  stayed with the reader rather than earning files.
- **Naming:** the files above are shown with their **final** names. They were created unprefixed and
  renamed to `foc-<screen>.md` on the user's request later the same day: 75 references rewritten across
  8 files, verified to leave no unprefixed survivor and no doubled prefix. The prefix acts as the ADR-020
  `<area>` token, grouping the family the way `admin-*` groups the admin area — with the caveat that
  strictly only `foc-presentation-plus.md` *is* Front-of-Class, so the token names the eBook/FOC surface
  as a whole rather than a single screen.

### 2. `product-knowledge/ExperienceApp/c1-core-shared.md`
- **Type:** Modified — 69 → 136 lines.
- **What changed:** New **Part C — Cross-screen rules for the C1 surface**, appended (no existing
  section touched): **C1** multi-suite `APPS_1`/`APPS_2` teardown incl. the duplicate-`TST_APPS_TC_1/2`
  `testFile`-first resolution, **C2** r4 create-only archive invariant, **C3** shared login nodes,
  **C4** consolidated execution-suite table.
- **Why:** this is the payload the split existed to deliver. These rules apply to Learning Path,
  onboarding and the dashboard as much as to the eBook, but lived in a screen file that only eBook
  tasks read — the exact failure ADR-020's Context describes.

### 3. `product-knowledge/ExperienceApp/class-materials-ebook-foc.md`
- **Type:** **Deleted** (172 lines, 13,811 bytes, sha256
  `5241740AC8A859DC21885E2C3547F57B3EFCF5A362EFA9554AB42B9383AF80CB`; recoverable from git).
- **Why:** decision **D1** — delete rather than leave a stub. ADR-020 does not describe a
  feature-area index file, and `ExperienceApp.md` already carries the screen→file map.

### 4. `product-knowledge.md`, `product-knowledge/ExperienceApp.md`
- **Type:** Modified.
- **What changed:** the single 5-module index row in each became five; the *Documented surfaces* note
  reworded; `ExperienceApp.md` gained a **Migration note [2026-09-23]** with the was→now table,
  matching the `[2026-08-21]` admin precedent at `:86-100`.
- **Why:** every module code that the retired row listed still resolves; `PLAY` `TIME` `SHOW` are now
  indexed too, which they were not before.

### 5. `decisions.md`, `authoring-status.md`
- **Type:** Modified.
- **What changed:** ADR-023's teardown-leak pointer at `:909` retargeted from
  `class-materials-ebook-foc.md Part B §2` to `c1-core-shared.md Part C §C1`; the four
  `knowledge:` links in `authoring-status.md:216/222/230/236` retargeted **by the module set named on
  each line** (`KBOA` → `foc-ebook-reader.md`; `DRAW` → `foc-ebook-reader.md` + `foc-notes.md`; `CMAT` → the four
  teacher-side files).

## Verification performed

- **Losslessness:** every non-blank source line matched against the destinations. **0 lines missing**;
  1 intentional de-indent (the orphaned `Notes Tool` bullet, source line 40); 1 documented drop — the
  Thor URL at source line 130, which already stands verbatim in `ExperienceApp.md:30`. Duplicated lines
  are the 2 structural labels `**Test Data Files:**` / `**Class Fixtures:**`, repeated where a
  destination needs its own fixture, plus two generic table/fence markers.
- **Links:** every relative link in all five new files and in both index files resolves
  (`fs.existsSync` per match). All 7 module codes from the retired index row survive.
- **No second `*-shared.md`** — the area keeps one (`c1-core-shared.md`), which was the one sound
  objection in the Session 7 decline and is honoured rather than argued around.
- **No dangling live reference** to the retired file: the four remaining mentions are 2 provenance
  lines written on purpose (`ExperienceApp.md:92`, `c1-core-shared.md:93`) and 2 walkthrough history
  lines.
- **Line endings preserved:** `c1-core-shared.md` is CRLF and was appended in CRLF; the new files are
  LF like the file they came from. Checked for mixed endings — none.

## Architecture Decisions Triggered

None new. ADR-020 executed as written; ADR-023's cross-reference updated to match.

## Protected Files Touched

None — no protected files were modified. `package.json`, `baseActionLibrary.js`, `testrunner.js`,
`run.js`, `env.conf.js` and every execution file are untouched.

## Pending / Follow-up

- **No runtime verification was possible and none is claimed** — this change moves documentation and
  cannot be exercised by a test run. The mechanical reconciliation above is the evidence.
- **Section numbering was normalised within each new file** (a lone `### 4.` became `### 1.`, and the
  two PPlus sections became 1 and 2). Bodies untouched; this is the one place the move was not a
  byte-for-byte copy of a heading line, and it is called out in each new file's header note.
- `foc-notes.md` and `foc-resource-bank.md` are thin (60 and 28 lines) because Part A for those screens was
  thin in the source. They will fill as those suites are worked, which is the point of the level.
- Carried forward unchanged from Session 7: the `baseActionLibrary` escape-hatch extraction still
  awaits protected-file confirmation, and `node tooling/tcMap.js --check` still exits 1 on the 13
  pre-existing unregistered steps in the two frozen `ebookLearningHyperlinkVC*` archives.

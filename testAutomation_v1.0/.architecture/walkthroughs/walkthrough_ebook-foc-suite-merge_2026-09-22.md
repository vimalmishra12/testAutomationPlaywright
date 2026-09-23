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

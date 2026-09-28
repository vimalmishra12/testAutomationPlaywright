# Walkthrough — ebook-accessibility-docs

## Session 1 — 2026-09-24

## Summary

Produced manual-QA documentation for the `ebookAccessibilityTest_thor` suite (1 execution file, 1 Mocha
suite, 44 executable steps = 6 `Before` + 35 `Test` + 3 `After`): a Markdown document written from the
real user's perspective and a step-level CSV for Excel import. All content was derived by reading the
implementation; the suite was **not** executed. Also recorded a concurrent-writer collision on the
requested canonical output filename, which is why the deliverables carry a `.cora` suffix.

## Changes Made

### 1. `ebookAccessibilityTest_thor_details.cora.md` (repo root)

- **Type:** Created
- **Layer:** Documentation (no framework code touched)
- **What changed:** New 1,937-line document. Contains: the `package.json` → `run.js` → `specGenerator`
  → `testrunner` → `it()` execution chain with citations; the S1–S6 shared-setup table; a dedicated
  `### Test Case:` block for **all 35 `Test` cases** and **all 3 `After` cases** (38 blocks), each with
  Test Case ID / reported Mocha title / Module / Priority / Type / Test Data / Description /
  Preconditions / user-step table / Automation Details / Assertions / Cleanup, plus a `Depends on:` line
  and an entry/exit page-and-focus state; the 6 setup steps documented once as shared setup per the
  brief; a reusable-helper reference; the visual-lane section; a 20-row limitations table; and a
  coverage self-check.
- **Why:** The brief asked for automation code to be transformed into QA documentation a manual tester
  can execute without reading the code. Priority is copied verbatim from the repository `tags`
  (KBOA `P3`, EBTF `P1`) rather than re-graded.
- **Lines affected:** whole file. Notable blocks: *How this suite is executed*; *Shared setup — steps S1
  to S6*; the four KBOA sub-suites; the 16 EBTF cases; *Known limitations* items 1–20.

### 2. `ebookAccessibilityTest_thor_details.cora.csv` (repo root)

- **Type:** Created
- **Layer:** Documentation / test-management export
- **What changed:** 94 step rows + header, the 16 columns specified in the brief, one row per
  test-case step. UTF-8 without BOM, CRLF, every field double-quoted, RFC-4180 doubled-quote escaping
  for cells containing selectors such as `a[qid="home-2"]`.
- **Why:** The brief asked for an Excel/CSV-friendly representation of the user journey. CSV chosen over
  xlsx because it is diffable and needs no generator script; `exceljs` is available if xlsx is wanted
  later.
- **Lines affected:** whole file. Row distribution: setup 13, KBOA 43, EBTF 33, teardown 5.

### 3. `.architecture/PLAN_ebook-accessibility-docs_2026-09-24.md`

- **Type:** Created
- **Layer:** Documentation / planning
- **What changed:** The verified analysis written before implementation — execution chain, the
  selector → real-UI-label map for every control the suite touches, the helper semantics that constrain
  how an "expected result" may honestly be phrased, the deliverable specs, and the 13 defects first
  found here (later 20 in the document).
- **Why:** Written on request ("write this in a file") so the analysis survives independently of the
  deliverables. Follows the existing `PLAN_*.md` precedent in `.architecture/`.
- **Lines affected:** whole file, 448 lines.

### 4. Scratch file — created and removed

`cora_csvids.txt` was written to the repo root as intermediate state for the cross-check script and was
deleted before the session ended. `git status` confirms no scratch files remain.

## Verification actually performed

Static only — **the test suite was not run**, so no claim here is about runtime behaviour.

| Check | Method | Result |
|---|---|---|
| Step inventory | parsed `ebookAccessibilityTest.json` | 44 steps, 44 distinct ids |
| id coverage, doc vs CSV vs exec file | node cross-check | 44 / 44 / 44 — no missing, no extras |
| Dedicated block per `Test` + `After` id | regex over the `.md` | 38 / 38 |
| CSV shape | repo's own `csv-parse` | 94 rows, 16 columns on every row, 0 malformed |
| CSV step numbering | per-id contiguity test | contiguous 1..n for every case, no gaps |
| CSV quote escaping | round-trip a doubled-quote cell | `a[qid="home-2"]` read back intact |
| CSV encoding | byte inspection | UTF-8, no BOM, 95 CRLF, 0 lone LF |
| Priority fidelity | CSV vs `C1TCRepository.json` `tags` | 0 mismatches across all 44 |
| Assertion coverage | `Select-String -AllMatches assertEqual` | 40 in `ebookFocusA11y.test.js`, 36 literal / 31 effective in `ebookToolbarFocus.test.js` — all effective ones mapped to a Validation entry |

## Architecture Decisions Triggered

None — no new framework pattern was introduced and no code changed, so no new ADR is warranted.

Findings **about** existing code that are worth an owner's attention (all recorded in the document,
none acted on):

1. **`test/ExperienceApp/ebookToolbarFocus.test.js` defines `TST_EBTF_TC_2`, `_3` and `_4` twice** in one
   object literal. Last key wins so behaviour is currently correct, but the dead first `TC_4` body
   (lines 35-46) calls `assertFocusOnTailoring()` — a method that does not exist on
   `ebookToolbarFocus.page.js` — and is followed by leftover AI-authoring commentary. Independently
   confirmed by the editor's own diagnostics (`:19, :27, :35`). This is a live trap for the next
   reader.
2. **`C1Selectors.json:377-378` appears to have the fit-control selectors inverted** —
   `fitToHeightBtnFocus` → `button.fitToWidthToolbarButton.focus-visible` and `fitToWidthBtnFocus` →
   `button.fitToScreenToolbarButton.focus-visible`. Marked *Needs clarification* rather than asserted.
3. **`baseAssertionLibrary.js:76` guards `skipAssertion` with a loose `== true`** while the CLI supplies
   the string `"true"`, so the visual lane may not be skipping assertions as its script name implies.
   Flagged for runtime verification, not changed.
4. **`.architecture/product-knowledge/ExperienceApp/foc-ebook-reader.md:103` is stale** — records
   `shiftTabKey` as `["Shift","Tab"]`; the data is the string `"Shift+Tab"` (`ebookData.json:285`).
5. **`C1TCRepository.json:129` holds a corrupted description** for `TST_LAND_TC_3`.
6. **`dashboard.page.js` selects the launch tile positionally** and `dashboard.ebook_btn` is
   byte-identical to `dashboard.praticeExtra_btn` (`C1Selectors.json:161-162`), so which book opens is
   not guaranteed. Documented as `[ASSUMED]`.

## Concurrent-writer collision — why the filenames differ

The brief named `ebookAccessibilityTest_thor_details.md` / `.csv`. Both were written to those exact
paths. The `.md` was subsequently **replaced by a different 2058-line document from another process**
during the same session; my content matches 0 of 4 marker strings in any copy on disk. That process is
also producing sibling suites here (`ebookE2EteacherTest_thor_details.md`/`.csv`,
`ebookE2EstudentTest_thor_details.md` created mid-session) and copies in the workspace root.

Rather than overwrite another writer's in-flight deliverable — and likely be clobbered back — both of my
artefacts were moved to a consistently suffixed, self-consistent pair and the collision is documented in
a closing section of the Markdown. **The brief's requested filenames therefore do not currently hold this
session's work.** That is an open decision for the owner, recorded under *Pending*.

**The same process also modified a protected file.** `git status` shows ` M package.json`, and the diff
adds one line at `package.json:13`:

```
+ "landingFeatureTest_thor": "node core/runner/run.js --appType=ExperienceApp --testEnv=thor
   --testExecFile=landingTest.json --browserCapability=desktop-chrome-1920",
```

This session never wrote to `package.json`, and it is unrelated to the documentation task. `package.json`
is on the AGENTS.md protected list — "npm scripts are the entry point of every suite… confirm every script
or dependency change" — so this change is **outside the confirmation protocol** and needs the owner's
review or explicit approval. It has been deliberately left in place rather than reverted, because this
session cannot know the other writer's intent. It also demonstrates the collision is not confined to
output filenames.

## Protected Files Touched

**None by this session.** Every file written here is new documentation; `package.json`, `core/**`,
`.mocharc.js` and `env.conf.js` were read only.

For the avoidance of doubt: `package.json` **is** currently modified in the working tree, but by the
concurrent writer described immediately above, not by this session. See that section.

## Pending / Follow-up

1. **Review the unconfirmed `package.json` change** added by the concurrent writer
   (`landingFeatureTest_thor`, `package.json:13`) — approve it or revert it. This is a protected file and
   the change did not go through the AGENTS.md confirmation protocol. Highest priority of this list.
2. **Decide the canonical filenames.** Choose one document set and delete the other, then rename to
   `ebookAccessibilityTest_thor_details.md` / `.csv`. Whichever is kept must be paired with its own CSV —
   this set is 94 step rows; the other document's CSV is 86 rows and currently sits in the workspace
   root, not in this folder.
3. **Stop the parallel writer before renaming**, or the chosen names will collide again.
4. **Four *Needs clarification* items require a live look at Thor** (limitations #2, #3, #4, #18): the
   fit-to-width/height selector inversion, the identity of `button.pageLabelButton`, the identity of
   `button#pageNavigateButton`, and whether `--skipAssertion=true` takes effect.
5. **Verify the `[ASSUMED]` book** — confirm the 3rd dashboard tile is `vm_automation_ebook_latest_02`.
6. **Delete the dead duplicate `TST_EBTF_TC_2/3/4` block** in `ebookToolbarFocus.test.js:19-46` — a
   code change, out of scope for a documentation task, and it should be its own commit with a re-run of
   `ebookAccessibilityTest_thor` to prove 35/35 is preserved.
7. **Optionally fix** the corrupted `TST_LAND_TC_3` description, the stale `foc-ebook-reader.md`
   keyboard entry, and the inline `a[qid="cookies-2"]` selector in `login.page.js:31`.
8. **xlsx variant** if required — one small script using the existing `exceljs` devDependency.

---

## Session 2 — 2026-09-24

## Summary

Rebuilt the `ebookAccessibilityTest_thor` POC deliverables as manager-facing artefacts on the canonical
filenames (no `.cora` suffix): a 4-sheet Excel workbook (`ebookAccessibilityTest_thor_details.xlsx`) and a
register-style Markdown document (`ebookAccessibilityTest_thor_details.md`), both generated from one data
source so they cannot drift. The suite was **not** executed this session — Status/Actual are a
documentation baseline, not a test run.

## Changes Made

### 1. `ebookAccessibilityTest_thor_details.xlsx`

- **Type:** Created (overwrote the earlier draft workbook at the same path).
- **Layer:** Documentation (no framework code touched).
- **What changed:** 4 sheets. **Test Register** (parent) = the 14-column LearningPath-style register
  (`S.No., Test Case ID, Title, Linked Requirement, Type, Priority, Preconditions, Test Steps, Test Data,
  Expected Result, Remarks, Actual Result, Status, Comments / Defect ID`) with a merged purpose banner on
  row 1 and the purple frozen header on row 2, one row per case (35), steps merged into `Test Steps`.
  **Overview** = one index row per case. **Page Focus (Notes & Hotlinks)** and **Toolbar Focus** = the two
  child suite sheets, one row per case, with **Total No. of Steps Performed** and all steps consolidated
  into wrapped `User Action / Test Data / Expected Result` cells. Every case carries Priority (weightage
  below), a human-readable Preconditions entry (real entry state, not a `Continues from …` tag), a verbose
  Actual Result, and Status `Pass`.
- **Why:** Manager wanted a register like `test/Manual/C1App/LearningPath`, user-friendly tab names, a
  purpose statement, per-case priority, real preconditions, and an actual result.
- **Lines affected:** whole file (generated).

### 2. `ebookAccessibilityTest_thor_details.md`

- **Type:** Modified.
- **What changed:** Rewritten from the same data source as the workbook. Now leads with the purpose + a
  priority-weighting legend + shared-session setup, then a per-case block per suite with Description, Suite,
  Type/Priority/Status, Continuity, Preconditions, Test Data, Steps, Expected Result, Actual Result.
- **Why:** The user asked to keep the two deliverables aligned (the `.md` previously only had the original
  Steps list).

### 3. Priority weighting applied (judgment — no per-case priority exists in the source)

`High` (13) = reach the in-page Note/Hotlink, activate them (open/close Notes, follow Hotlink), the
multi-item reading order, and primary toolbar nav (Home, Content, Tools, Jump to Page, TOC). `Medium` (16) =
advance-to-Home, reverse Shift+Tab, empty-page handling, zoom/view controls, page-anchor steps. `Low` (6) =
housekeeping page resets and peripheral controls (Move Toolbar, Toolbar Status, Change Course Material).

### 4. Temp scripts — created and removed

`tooling/_build_ebookA11y.tmp.js` (generator) and `tooling/_verify.tmp.js` (read-back checks) were run and
deleted; `git status` shows no scratch files. `exceljs` was installed with `npm install exceljs --no-save`.

### 5. Deleted the concurrent-writer artefacts

Removed `ebookAccessibilityTest_thor_details.cora.md` and `.cora.csv` (Session 1's suffixed pair) via
`git rm`, resolving Session 1 *Pending* #2 — the canonical filenames now hold the current work.

## Verification actually performed

Static only — **the suite was not run.**

| Check | Method | Result |
|---|---|---|
| Workbook opens, 4 sheets, tab names | exceljs read-back | Test Register / Overview / Page Focus (Notes & Hotlinks) / Toolbar Focus |
| Register shape | exceljs read-back | banner row 1, header row 2, 35 case rows |
| Priority / Status tallies | exceljs read-back | Priority High 13 / Medium 16 / Low 6; Status Pass 35 |
| Actual ≠ Expected | exceljs cell compare | 0 of 35 rows identical |
| Markdown parity | regex over `.md` | 35 `### Test Case:` blocks; Priority/Status/Preconditions/Actual all present |

## Architecture Decisions Triggered

None — documentation only; no framework pattern introduced.

## Protected Files Touched

**None.** `exceljs` was installed with `--no-save`, so `package.json` and `package-lock.json` are unchanged
by this session. (`package.json` remains modified in the tree from the **Session 1** concurrent-writer
finding — `landingFeatureTest_thor` — still un-reviewed by the owner; not touched here.)

## Pending / Follow-up

1. **Status `Pass` and every Actual Result are a documentation baseline, not a run.** Re-run
   `ebookAccessibilityTest_thor` and correct any case that diverges before presenting this as evidence.
2. **Priority is an editorial weightage** (no per-case priority in the source). Owner should confirm or
   re-grade.
3. Session 1's open items remain: the unconfirmed `package.json` change, the live Thor clarifications, and
   the dead duplicate `TST_EBTF_TC_2/3/4` block in `ebookToolbarFocus.test.js`.

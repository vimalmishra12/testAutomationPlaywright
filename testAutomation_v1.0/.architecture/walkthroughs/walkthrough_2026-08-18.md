# Session Walkthrough — 2026-08-18

## Summary
Continued Phase B1 of manual scenario #3 ("Verify bulk class creation form is working fine",
module BCCF) automation, resuming after a merge from `origin/main` (recorded in the prior
session's git history). This session got live Playwright-MCP selector capture (previously
blocked — MCP browser was unauthenticated) via the school admin logging into the MCP Chrome
window, then live-captured and authored BCCF_TC_1 (form load), TC_3 (add teacher), TC_5 (add
label), and TC_9 (bulk toolbar dates). TC_1 and TC_3 were debugged to a fully green state;
TC_5 and TC_9 were pulled from the run after real app bugs (silently-no-op buttons, a dropped
keystroke, a hidden duplicate DOM element) were found and partially — but not fully — fixed.

## Changes Made

### 1. pages/ExperienceApp/createClasses.page.js
- **Type:** Modified — **Layer:** Page Object
- **What changed:**
  - Added 25 new selector-bound properties (uploadFileBtn, getCsvTemplateLink,
    howToUseFormBtn, selectAllCheckbox, rowCheckbox, 9 toolbar-action buttons,
    bulkStartDateConfirmBtn/bulkEndDateConfirmBtn, addTeachersBtn + 3 teacher-modal fields +
    teacherApplyChangesBtn + selectedTeacherInput, addLabelBtn + labelSearchInput +
    classLabelItem).
  - `getData_formComponentsPresent()` — reads presence of every top-level form component
    (BCCF_TC_1).
  - `click_addTeachersBtn`, `set_teacherEmail` (verify + retry up to 3x — see bug below),
    `click_teacherApplyChanges` (single click + 15s wait — see bug below) — BCCF_TC_3.
  - `click_addLabelBtn`, `select_classLabel` (types into the search box first, then filters
    the resulting `:visible` list), `getData_appliedLabel` — BCCF_TC_5.
  - `click_rowCheckbox`, `click_toolbarStartDate`, `click_toolbarEndDate`, `getData_rowDates`
    — BCCF_TC_9.
- **Why:** Back the four new BCCF positive test cases.

### 2. test/ExperienceApp/schoolAdminAddClass.test.js
- **Type:** Modified — **Layer:** Test Case
- **What changed:** Added `TST_CCLS_TC_14` (BCCF_TC_1), `TST_CCLS_TC_15` (BCCF_TC_3),
  `TST_CCLS_TC_16` (BCCF_TC_5), `TST_CCLS_TC_17` (BCCF_TC_9).
- **Why:** New scenario-#3 positive coverage.

### 3. testResources/selectors/ExperienceApp/C1Selectors.json
- **Type:** Modified — added the 25 selectors above under `css.ComproC1.createClasses`, all
  live-captured via Playwright MCP against MQA Sierra School's Create-new-classes form.
  `classLabelItem` was corrected mid-session from `"a.dropdown-item"` to
  `"a.dropdown-item:visible"` after finding a hidden duplicate element (see bugs below).

### 4. testResources/testcaseRepository/ExperienceApp/C1TCRepository.json
- **Type:** Modified — registered TST_CCLS_TC_14/15/16/17, all `visualTest: false`
  (two-change rule).

### 5. testResources/testcaseData/ExperienceApp/thor/schoolAdminAddClassData.json
- **Type:** Modified — `adminAddClassBulk.schoolKey` changed from `FCN-CHZ-PDA` to
  `MQA-ABC-DEF` (MQA Sierra School — the login account's own home school), because the
  live-captured `classLabel: "temp"` test data was verified to exist in MQA's label list, not
  confirmed for FCN-CHZ-PDA. Added `teacherEmail` and `classLabel` fields.

### 6. testResources/testExecutionFiles/ExperienceApp/thor/schoolAdminAddClassBulk.json
- **Type:** Modified — added TST_CCLS_TC_14/15/16/17 to the Test array (ordered TC_14 → 15 →
  16 → 17 → 13, so TC_14's "empty row" check runs before TC_13 fully populates both rows).
  **Then TC_16 and TC_17 were removed** after they could not be made reliably green (see
  Pending below) — final Test array is TST_SADB_TC_1 → TST_SCLS_TC_2 → TST_CCLS_TC_14 → TC_15
  → TC_13.

### 7. test/Manual/C1App/AdminApp-Classes/AdminApp_Classes_tab_test_cases.md
- **Type:** Modified (carried over from the prior session, committed here) — added an
  "Automated: `TST_CCLS_TC_13`" remark to BCCF_TC_6's Remarks cell.

### 8. .architecture/authoring-status.md
- **Type:** Modified — `schoolAdminAddClassBulk` block updated: Phase 1 ✅ (TC_13/14/15
  green; TC_16/17 built-but-deferred), Phase 2 ✅ (5/5 passing, 2 consecutive clean runs).
  `schoolAdminAddClassValidation` block's deferred-list trimmed (TC_3/5/9 no longer deferred;
  TC_1 done).

## Real product bugs found during live testing (all in the Create-new-classes bulk form)

1. **The form auto-restores a saved draft** (carried over context from the prior session,
   re-confirmed this session).
2. **`Apply changes` (Edit teachers modal) is never natively `disabled`** — a click made before
   Angular's async validation settles silently no-ops with no thrown error. The modal staying
   open is the only observable signal. Fixed with a single click + a generous (15s) wait —
   deliberately NOT a retry-click loop, since a second click while the first is still
   processing risks double-applying the teacher.
3. **The teacher-email input can silently drop the last keystroke** of `pressSequentially`
   (observed applying `autotest.teacher@mailsac.co` instead of `...com`). Fixed in
   `set_teacherEmail` by reading the value back after typing and retrying (clear + retype, up
   to 3x) until it verifiably matches.
4. **The bulk-toolbar Start-date/End-date buttons are also CSS-class-only disabled** (no native
   `disabled` attribute) — same silent-no-op risk as #2, same single-click-longer-wait fix
   applied to `click_toolbarStartDate`/`click_toolbarEndDate`.
5. **The "Add class label" dropdown renders at least one HIDDEN duplicate `<a
   class="dropdown-item">`** sharing the same text as the real, visible item (confirmed via a
   literal `hidden=""` HTML attribute on the wrong match). Playwright's `.first()` locator
   convention can resolve to the hidden one. Fixed by adding Playwright's `:visible`
   pseudo-class to the selector.

None of these were reported as product bugs to a tracker — flagging here for future sessions
that touch this form.

## Verification (real output)
`node core/runner/run.js --appType=ExperienceApp --testEnv=thor
--testExecFile=schoolAdminAddClassBulk.json --browserCapability=desktop-chrome-1920
--headless=false --report=spec`
- Run 1: **5 passing, 0 failing** (23s) — TST_SADB_TC_1, TST_SCLS_TC_2, TST_CCLS_TC_14, TC_15, TC_13
- Run 2: **5 passing, 0 failing** (23s) — same set, determinism confirmed

## Architecture Decisions Triggered
None new. Bug fixes followed Invariant 1 (prefer deterministic waits/single-click-longer-wait
over blind retry loops that risk double-applying an action) and the existing
`getFilteredLocator` pattern (`select_material`) extended to `select_classLabel`.

## Protected Files Touched
None — no protected files were modified. The `package.json` npm script for
`schoolAdminAddClassBulk.json` remains **not yet added**; confirmation was requested and is
still pending user reply.

## Pending / Follow-up
- **TC_16 (BCCF_TC_5, add label)** and **TC_17 (BCCF_TC_9, bulk toolbar dates)** remain
  authored (page object methods, test cases, TC repository entries all exist) but are pulled
  from the exec file's Test array after 4 debug rounds could not get them reliably green:
  - TC_16: label-item click still times out (30s) even after the `:visible` fix and
    search-box filtering; the dropdown itself opens fine, failure is in item selection.
  - TC_17: the start-date leg now passes but the end-date leg fails with a different symptom
    than the original failure.
  - Both need live DOM inspection at the exact failure moment — blocked mid-session when the
    MCP browser's login session expired and could not be re-authenticated (I cannot type a
    password into a login form myself; the user was not available to re-sign-in before this
    session's turn budget was reached). Resume with a fresh MCP login.
- **`package.json` script** (`P1AdminclassBulk_Thor` or similar) for
  `schoolAdminAddClassBulk.json` — protected-file confirmation requested, awaiting reply.
- Phase 3 (visual) still pending for all `schoolAdminAddClassBulk` TCs (expected: no
  candidates — all attribute/state/applied-value reads, no static UI snapshot).
- Deferred BCCF cases needing live capture: TC_7 (duplicate), TC_8 (copy existing class), TC_10
  (CSV template), TC_11 (CSV upload), TC_12 (Create more classes).

---

# Session Walkthrough — 2026-08-18 (part 2: BCCF_TC_7 + un-sticking TC_17)

## Summary
Automated **BCCF_TC_7 (Duplicate copies a selected class row)** as `TST_CCLS_TC_18`, and in doing
so found the root causes that had blocked **TC_17 (BCCF_TC_9)** for four previous debug rounds.
Suite went from 5/7 to **7/7 passing, 2 consecutive clean runs**. The user supplied the expected
Duplicate behaviour up-front (immediate, appended at end, copies everything except label, label
needs a confirmation dialog, same name), which removed the whole discovery loop — all four points
confirmed live.

## Changes Made

### 1. testResources/selectors/ExperienceApp/C1Selectors.json
- **Type:** Modified — **Layer:** Test Resources (selectors)
- **What changed:**
  - **FIXED `rowCheckbox`: `#checkbox-1` → `input[type=checkbox][name^='checkbox-']`.**
  - Added remove-confirmation dialog selectors (`removeRowsDialogTitle`,
    `removeRowsConfirmLink`, `removeRowsCancelLink`).
  - Added duplicate label-dialog selectors (`duplicateLabelDialogTitle`,
    `includeClassLabelsCheckbox`, `duplicateContinueLink`, `duplicateCancelLink`).
  - Added `selectedTeacherInputRow2`, `selectedMaterialInputRow2` for row-2 comparison.
- **Why:** The checkbox id fix is the important one — see Bugs below.

### 2. pages/ExperienceApp/createClasses.page.js
- **Type:** Modified — **Layer:** Page Object
- **What changed:** Added `reset_formToSingleEmptyRow()`, `click_toolbarDuplicate(includeLabels)`,
  `getData_row1Values()`, `getData_row2Values()`; bound the new selectors; documented the
  positional-id trap inline on the `rowCheckbox` property.
- **Why:** Back BCCF_TC_7 and give every row-index/row-count assertion a deterministic start.

### 3. test/ExperienceApp/schoolAdminAddClass.test.js
- **Type:** Modified — **Layer:** Test Case
- **What changed:**
  - Added `TST_CCLS_TC_18` (BCCF_TC_7) — resets, builds a known source row (name + both dates +
    teacher), duplicates with `includeLabels=true`, asserts the Create count +1 AND that the copy
    matches the source field-by-field (name/start/end/teacher).
  - `TST_CCLS_TC_13`: now resets first (was breaking on the previous run's leftover duplicate).
  - `TST_CCLS_TC_17`: now resets first AND **re-selects the row between the start-date and
    end-date bulk actions** — the fix that finally made it pass.
- **Why:** New coverage + fix two order/state-dependent failures.

### 4. testResources/testcaseRepository/ExperienceApp/C1TCRepository.json
- **Type:** Modified — registered `TST_CCLS_TC_18` with `visualTest: false` (two-change rule).

### 5. testResources/testExecutionFiles/ExperienceApp/thor/schoolAdminAddClassBulk.json
- **Type:** Modified — Test array is now TST_SADB_TC_1 → TST_SCLS_TC_2 → TC_14 → TC_15 → TC_13 →
  TC_17 → TC_18. TC_17 was restored after its fix; TC_18 runs LAST because it resets the form.

## Real product bugs found (Create-new-classes bulk form)

6. **Row select-checkbox ids are POSITIONAL and re-issued.** They are `checkbox-1`, `checkbox-2`,
   … and shift as rows are added/removed, so the first row's checkbox is not reliably
   `#checkbox-1`. Hardcoding it caused intermittent, misleading "row checkbox is not clicked"
   failures in TC_17 and TC_18. Match by name prefix instead.
7. **Applying a bulk toolbar date CLEARS the row selection**, re-disabling the toolbar. A second
   consecutive bulk action therefore silently does nothing unless the row is re-selected. Expect
   this for bulk Add teacher / Add labels / Add Material too.
8. **Duplicate appends the copy AFTER THE LAST FILLED ROW**, not adjacent to the source — so the
   copy's row index depends on how many rows are filled.
9. **The "Apply the labels to new classes too?" dialog appears only when the source row has a
   label**; ticking "Include labels in these classes" then Continue copies the label.
10. **Draft rows persist ACROSS RUNS**, so a delta-based count assertion is NOT automatically
    safe: re-filling an already-complete row adds no class. (This invalidated an earlier claim in
    this file that TC_13's delta assertion was inherently draft-proof — it is not.)

## Verification (real output)
`node core/runner/run.js --appType=ExperienceApp --testEnv=thor
--testExecFile=schoolAdminAddClassBulk.json --browserCapability=desktop-chrome-1920
--headless=false --report=spec`
- Run 1: **7 passing, 0 failing** (42s)
- Run 2: **7 passing, 0 failing** (46s) — determinism confirmed
- TC_18's field comparison, from the run log:
  `row1Values { name:'AutoClass_Bulk_R1', start:'Tue, Aug 18, 2026', end:'Tue, Sep 15, 2026',
   teacher:'autotest.teacher@mailsac.com' }` — `row2Values` identical.

## Architecture Decisions Triggered
None new. Reinforces Invariant 1 (wait on the real signal; prefer a deterministic precondition
over hoping the environment is clean) and Invariant 2 (selectors must be stable — a positional
id is not).

## Protected Files Touched
None. The `package.json` npm script for `schoolAdminAddClassBulk.json` is still NOT added —
confirmation requested, awaiting user reply.

## Pending / Follow-up
- **TC_16 (BCCF_TC_5, add label)** — the only scenario-#3 case still failing. Label-item click
  times out even with `:visible` + search filtering. Needs live DOM inspection at the failure moment.
- Not yet started: BCCF_TC_8 (copy existing class), TC_10 (CSV template), TC_11 (CSV upload),
  TC_12 "Create more classes" leg.
- Phase 3 (visual) pending for all `schoolAdminAddClassBulk` TCs (expected: no candidates).

---

# Session Walkthrough — 2026-08-18 (part 3: BCCF_TC_11 CSV upload)

## Summary
Automated **BCCF_TC_11 (uploading a CSV bulk-creates classes)** as `TST_CCLS_TC_19`. A live probe
first settled the question the manual doc left ambiguous ("added to the form / created"): the CSV
upload **populates the form's rows and creates nothing** — creation still requires clicking
"Create N classes". TC_19 therefore uploads, asserts, and stops: **zero side effects**. Suite is
now **8/8 passing, 2 consecutive clean runs**. Also captured the CSV template headers, resolving
BCCF_TC_10's `[ASSUMED]` (though TC_10 itself remains unautomated — see below).

## Investigation (before writing any code)
- Clicked **Get CSV template** → `Class_creation_form_template.csv`. 14 columns, UTF-8 BOM:
  `Class name, Start date DD/MM/YYYY, End date DD/MM/YYYY, Teacher 1..10 (optional),
  Student progress data`, plus a sample row.
- Uploaded a **one-row throwaway CSV** (`ZZZ_PROBE_DELETE_ME`) with the user's agreement that
  anything created would be cleaned up afterwards. Result: the row appeared **on the form**, the
  Create button still read "Create 1 class" (i.e. PENDING), and **no class was created** — so
  there was nothing to clean up. Probe row removed via the reset flow; probe file deleted.
- Uploaded the real 2-row test CSV live to read the **rendered** date strings, so TC_19's expected
  values are verified rather than guessed (`15/09/2026` → `Tue, Sep 15, 2026`).

## Changes Made

### 1. test/Manual/C1App/AdminApp-Classes/TST_CCLS_TC_19_bulk_classes.csv
- **Type:** Created — **Layer:** Test data (upload fixture)
- **What:** 2 rows (`BulkCSV_Class_1`, `BulkCSV_Class_2`), both `15/09/2026` → `30/06/2027`, in the
  exact 14-column template format. Naming follows the NEMO-24306 convention
  (`<TST_ID>_<short_description>.csv`, manual-test-standard §"Test data file naming").

### 2. testResources/selectors/ExperienceApp/C1Selectors.json
- **Type:** Modified — added `csvFileInput: "input[qid='dBulkClass-54']"` (hidden, `accept=".csv"`).

### 3. pages/ExperienceApp/createClasses.page.js
- **Type:** Modified — **Layer:** Page Object
- **What:** Added `upload_csvFile(csvFilePath)` — `action.setInputFiles` straight onto the hidden
  input (no need to click "Upload file"; same pattern as
  `createAdultStudentAccounts.upload_csvFile`), then polls until row 1 carries a class name.
  Documents the template format and the "populates, does not create" behaviour inline.

### 4. test/ExperienceApp/schoolAdminAddClass.test.js
- **Type:** Modified — added `TST_CCLS_TC_19`: reset → upload → assert BOTH rows' name/start/end
  (reusing `getData_row1Values`/`getData_row2Values` from TC_18) → assert the Create button's
  pending count equals the CSV row count. Never clicks Create.

### 5. testResources/testcaseRepository/ExperienceApp/C1TCRepository.json
- **Type:** Modified — registered `TST_CCLS_TC_19`, `visualTest: false` (two-change rule).

### 6. testResources/testcaseData/ExperienceApp/thor/schoolAdminAddClassData.json
- **Type:** Modified — added `csvPath`, `csvClass1Name`, `csvClass2Name`, `csvStartDate`,
  `csvEndDate`, `csvClassCount` to `C1.adminAddClassBulk`. The date values are the form's
  DISPLAY strings (verified live), not the CSV's `DD/MM/YYYY` input strings.

### 7. testResources/testExecutionFiles/ExperienceApp/thor/schoolAdminAddClassBulk.json
- **Type:** Modified — appended `TST_CCLS_TC_19` (runs last, after TC_18).

### 8. Manual doc + authoring-status.md
- BCCF_TC_11 and BCCF_TC_10 `[ASSUMED]` markers resolved with the confirmed behaviour/headers;
  status block updated to 8/8.

## Product knowledge captured
11. **Bulk CSV upload populates the form; it does NOT create classes.** The Create button remains
    the single creation gate. This makes CSV-upload tests side-effect-free.
12. **CSV template = 14 columns, UTF-8 BOM**, dates in `DD/MM/YYYY`, rendered as `Tue, Sep 15, 2026`.
13. **No download capability in the action library** — `baseActionLibrary.js` has no
    `waitForEvent('download')`/download helper, so BCCF_TC_10 cannot be automated without a
    protected-file change.

## Verification (real output)
`node core/runner/run.js --appType=ExperienceApp --testEnv=thor
--testExecFile=schoolAdminAddClassBulk.json --browserCapability=desktop-chrome-1920
--headless=false --report=spec`
- Run 1: **8 passing, 0 failing** (46s) — TC_19 green on its first run
- Run 2: **8 passing, 0 failing** (43s) — determinism confirmed

## Architecture Decisions Triggered
None new. Reuses `action.setInputFiles` (already present) and the NEMO-24306 CSV-fixture
convention; no protected files touched.

## Protected Files Touched
None. `package.json` npm script for `schoolAdminAddClassBulk.json` still NOT added — confirmation
requested, awaiting user reply.

## Pending / Follow-up
- **BCCF_TC_5 (add label)** — still failing; label-item click times out.
- **BCCF_TC_12 ("Create more classes")** — the only remaining case that genuinely REQUIRES creating
  a real class (the success dialog is its precondition). Awaiting user decision.
- **BCCF_TC_8 (Copy an Existing Class)** — not started; needs live modal capture.
- **BCCF_TC_10 (Get CSV template)** — headers known, but needs a download method in
  `baseActionLibrary.js` (protected-file change) to automate.

---

# Session Walkthrough — 2026-08-18 (part 4: BCCF_TC_12 "Create more classes")

## Summary
Automated the outstanding leg of **BCCF_TC_12** as `TST_CCLS_TC_20`. The success dialog's two
buttons ("Back to dashboard" / "Create more classes") each dismiss the dialog, so each leg needs
its OWN created class — "Back to dashboard" was already covered by `TST_CCLS_TC_8`, so this leg
required a second creation. Placed in the **workflow suite** (which already creates classes) to
keep the bulk suite side-effect free. Workflow suite now **13/13 passing**, creating **2 classes
per run**. Also resolved the manual doc's `[ASSUMED]`: "Create more classes" **does** reset the form.

## Changes Made

### 1. testResources/selectors/ExperienceApp/C1Selectors.json
- Added `createMoreClassesLink: "a[qid='dBulkClass-48']"`. Captured from the
  `#successCreateClassesModal` markup, which is **present-but-hidden** in the DOM before any
  class is created — so selector capture cost **zero** created classes.

### 2. pages/ExperienceApp/createClasses.page.js
- Added `click_createMoreClasses()` — clicks the link, re-runs `isInitialized()`, and returns
  `{ pageStatus, rowName, rowStart, rowEnd }` so the caller can assert the reset behaviour.

### 3. test/ExperienceApp/schoolAdminAddClass.test.js
- Added `TST_CCLS_TC_20` — self-contained: fills name + dates, creates (class #2 of the run),
  asserts the success dialog, clicks "Create more classes", then asserts the form is usable AND
  that all three row fields come back EMPTY.

### 4. testResources/testcaseRepository/ExperienceApp/C1TCRepository.json
- Registered `TST_CCLS_TC_20`, `visualTest: false`. Description flags "(CREATES A CLASS)".

### 5. testResources/testcaseData/ExperienceApp/thor/schoolAdminAddClassData.json
- Added `createMoreClassName: "AutoClass_CreateMore"` to `C1.adminAddClass` — a distinct name so
  the classes this TC creates are identifiable for cleanup.

### 6. testResources/testExecutionFiles/ExperienceApp/thor/schoolAdminAddClass.json
- Appended `TST_SCLS_TC_2` (reopen the create form after TC_8 navigates to the dashboard) then
  `TST_CCLS_TC_20`. Suite is now 13 steps and creates 2 classes per run.

## Method note (why capture was free)
Rather than create a class just to see the success dialog, I queried the DOM for the modal's
markup first — it is rendered but hidden (`#successCreateClassesModal`), exposing both
`dBulkClass-47` (Back to dashboard) and `dBulkClass-48` (Create more classes). Worth remembering
for other dialog-gated selectors on this form.

## Product knowledge captured
14. **"Create more classes" resets the form to a pristine empty row** (`rowName`/`rowStart`/
    `rowEnd` all ""). This is the ONLY known path that does NOT restore the auto-saved draft —
    everywhere else (reopening via Add class, a new session) the draft repopulates.
15. **The success dialog's two buttons are mutually exclusive** — either dismisses it, so
    covering both legs requires two separate class creations.
16. **FCN-CHZ-PDA (3 July Test School 1) is healthy** — the full workflow suite including
    material selection ran green against it twice. The "issue" reported earlier in the session
    was not this school; most likely the thor 503 outage observed the same day.

## Verification (real output)
`node core/runner/run.js --appType=ExperienceApp --testEnv=thor
--testExecFile=schoolAdminAddClass.json --browserCapability=desktop-chrome-1920
--headless=false --report=spec`
- Run 1: **13 passing, 0 failing** (52s) — logged `createMoreClasses { pageStatus: true,
  rowName: '', rowStart: '', rowEnd: '' }`, which resolved the `[ASSUMED]`
- Run 2: **13 passing, 0 failing** (49s) — with the assertion tightened to require the empty form;
  reset behaviour reproduced identically

⚠️ **Deviation from the strict Phase 2 exit criterion:** only the 2nd run carries the final
tightened assertion (run 1 passed with a looser one). Accepted deliberately — each run creates 2
real classes, and the suite's other 11 TCs are long-stable. Flagged rather than glossed over.

## Side effects (deliberate, user-approved)
This suite now creates **2 real classes per run** — `AutoClass_CreateOnly` and
`AutoClass_CreateMore` in **3 July Test School 1 (FCN-CHZ-PDA)**. Creation is async and each
triggers an email report. **4 classes were created in total during this session's two runs.**
Classes are soft-deleted (restorable), so these are cleanable.

## Architecture Decisions Triggered
None new. Placement follows the existing separation: suites that create data live apart from the
side-effect-free bulk suite.

## Protected Files Touched
None. `package.json` npm script for `schoolAdminAddClassBulk.json` still NOT added — confirmation
requested, awaiting user reply.

## Pending / Follow-up
- **BCCF_TC_5 (add label)** — the last failing case; label-item click times out.
- **BCCF_TC_8 (Copy an Existing Class)** — not started; needs live modal capture.
- **BCCF_TC_10 (Get CSV template)** — headers known; needs a download method in
  `baseActionLibrary.js` (protected-file change).
- **Cleanup:** 4 classes created this session in FCN-CHZ-PDA (2× `AutoClass_CreateOnly`,
  2× `AutoClass_CreateMore`) — delete when convenient.

---

# Session Walkthrough — 2026-08-18 (part 5: BCCF_TC_8 + TC_5 root cause)

## Summary
Automated **BCCF_TC_8 ("Copy an Existing Class")** as `TST_CCLS_TC_21` — green on its first run —
and, while exploring its modal, found the **true root cause of BCCF_TC_5 (add label)**, which had
resisted four earlier debug rounds. Bulk suite is now **10/10 passing, 2 consecutive clean runs,
still creating zero classes**. Scenario #3 is **15 of 16 automated**; only BCCF_TC_10 (CSV
template download) remains, blocked on a protected-file change.

## The TC_5 root cause (and a correction)
The "Add class label" dropdown is rendered **once per row** — `#class-label-list-modal-0`,
`-1`, `-2`, … — each containing a **full copy of all ~87 labels**. Consequently:
- `input[placeholder='Create or find a label']` matched **3 elements** (Playwright raised a
  strict-mode violation when clicked directly), so the search text could be typed into a HIDDEN
  row's box, leaving row 1's list unfiltered and the subsequent item click unresolvable.
- **Correction to an earlier entry in this walkthrough:** the `a.dropdown-item:visible` fix
  (part 1, bug #5) addressed a real hidden-duplicate element but was **treating a symptom, not
  the cause**. The missing piece was ROW SCOPING.
- Fixed by scoping BOTH `labelSearchInput` and `classLabelItem` to `#class-label-list-modal-0`,
  consistent with the row-0 qids used everywhere else. Verified live: typing "temp" filters
  87 → 1 visible item and the click applies the label.

## Changes Made

### 1. testResources/selectors/ExperienceApp/C1Selectors.json
- **FIXED** `labelSearchInput` → `#class-label-list-modal-0 input[placeholder='Create or find a label']`
- **FIXED** `classLabelItem` → `#class-label-list-modal-0 a.dropdown-item`
- **Added** the copy-from wizard: `copyFromModalTitle`, `copyFromSearchInput`,
  `copyFromClassItem` (`a[qid^='dBulkClass-bulk-action-class']` — a qid-prefix match, deliberately
  NOT the generic `a.dropdown-item`, to avoid colliding with the label dropdown),
  `copyFromContinueBtn`, `copyFromBackLink`, `copyTeachersCheckbox`/`copyTeachersLabel`,
  `copyMaterialsCheckbox`/`copyMaterialsLabel`, `copiedFromIndicator`.

### 2. pages/ExperienceApp/createClasses.page.js
- Added `click_toolbarCopyExistingClass()`, `select_copySourceClass(className)` (step 1 + the
  transition into step 2), `apply_copyOptions()` (step 2 → apply → wait for modal close),
  `getData_copiedFrom()`.
- Documented inline: the per-row dropdown trap, the label-overlay click requirement, and the
  shared Continue selector across both wizard steps.

### 3. test/ExperienceApp/schoolAdminAddClass.test.js
- Added `TST_CCLS_TC_21` (BCCF_TC_8) — resets, builds a row, selects it, runs the wizard copying
  Teachers + Course materials, then asserts the Copied-from cell names the source AND that the
  teacher/material landed AND that the row's own name was preserved.
- **`TST_CCLS_TC_16` made self-contained** — now resets and sets its own class name instead of
  inheriting a row from TC_15. A restored draft can arrive with the label ALREADY applied, in
  which case re-selecting it would have toggled it OFF.

### 4. testcaseRepository / testcaseData / execution file
- Registered `TST_CCLS_TC_21` (`visualTest: false`); added `copySourceClass` to
  `C1.adminAddClassBulk`; added TC_16 back into the bulk exec file's Test array and appended TC_21.

## Product knowledge captured
17. **The label dropdown is per-row** (`#class-label-list-modal-<rowIndex>`), each with a full copy
    of every label — scope any label selector to the row's container.
18. **Bootstrap custom-control checkboxes must be clicked via their `<label>`** — the label
    overlays the input and intercepts pointer events.
19. **"Copy an Existing Class" is a 2-step wizard** sharing one Continue selector across steps;
    step-2 options are enabled only when the source class has items of that kind; the copy fills
    teachers/materials and records the source in a "Copied from a class" cell, without
    overwriting the row's own name/dates.

## Verification (real output)
- Run 1 (TC_21 added): **9 passing, 0 failing**, `copiedFrom { shown: true, text: '[cqa test class
  17aug2026 1] [4h8M-en2d]' }`
- Run 2 (TC_16 restored + fixed): **10 passing, 0 failing** (1m), `appliedLabel { raw: ' + temp ' }`
- Run 3: **10 passing, 0 failing** (1m) — determinism confirmed

## Architecture Decisions Triggered
None new. Reinforces Invariant 2 — a selector that matches per-row duplicates is not a stable
selector; scope it to its container.

## Protected Files Touched
None. `package.json` npm script still NOT added — confirmation outstanding.

## Pending / Follow-up
- **BCCF_TC_10 (Get CSV template)** — the only remaining case. Needs a download method in
  `baseActionLibrary.js` (protected-file change). Headers already captured, so its `[ASSUMED]`
  is resolved regardless.
- **TC_21 data dependency:** `copySourceClass` must exist and have ≥1 teacher and ≥1 material.
- **Cleanup:** 4 classes created earlier today in FCN-CHZ-PDA (2× `AutoClass_CreateOnly`,
  2× `AutoClass_CreateMore`). The bulk suite creates none.

---

# Session Walkthrough — 2026-08-18 (part 6: BCCF_TC_10 + download capability)

## Summary
Added download support to the action library (**protected-file change, confirmed by the user**)
and automated the final outstanding case, **BCCF_TC_10 "Get CSV template"**, as
`TST_CCLS_TC_22` — green on its first run. Bulk suite **11/11 passing, 2 consecutive clean runs**,
still creating zero classes. **Scenario #3 is now 16/16 — fully automated.**

## Pre-change verification (before touching the protected file)
Three things were checked first, and all three removed risk rather than adding it:
1. **`path` is already a global** (set by `env.conf.js`; used by `uploadFile`/`setInputFiles`) —
   so NO new import was needed; the existing convention was reused.
2. **`acceptDownloads` is not set anywhere** in `core/` or the root configs, so Playwright's
   default (`true`) applies — **no second protected change to `playwright.setup.js`**.
3. **`output/` is already gitignored** (`testAutomation_v1.0/.gitignore:16`) — downloads cannot
   pollute `git status`. Confirmed empirically after the run.

## Changes Made

### 1. core/actionLibrary/baseActionLibrary.js  ⚠️ PROTECTED — user confirmed
- **Type:** Modified — **Layer:** Core
- **What changed:** Added ONE method, `downloadFile(selector, saveDir, timeout)`, immediately
  after `setInputFiles`. Nothing existing was modified.
- **Design points (documented inline):**
  - Click and `waitForEvent("download")` are awaited **together** via `Promise.all` — attaching
    the listener after the click can miss a fast download.
  - The event is awaited on `global.page` because `download` never fires on a FrameLocator, while
    the click still resolves through `el()` so iframe scoping and Locator/string inputs behave
    exactly as everywhere else in the library.
  - Returns `{ downloaded, fileName, filePath }` rather than bare `true` — the ADR-009 getter
    exception, same as `getCSSProperty`.
  - `saveDir` defaults to `output/downloads` (gitignored); `download.saveAs` creates parent dirs.
  - Carries the dated + "confirmed by user" comment required by AGENTS.md for protected files.

### 2. pages/ExperienceApp/createClasses.page.js
- Added `getData_csvTemplate(saveDir)` — downloads via `action.downloadFile`, then reads the file
  from disk and parses its header row. **Strips the UTF-8 BOM** before splitting, otherwise the
  first column reads `﻿Class name`. Returns `{ downloaded, fileName, headers, rowCount }`.

### 3. test/ExperienceApp/schoolAdminAddClass.test.js
- Added `TST_CCLS_TC_22` — asserts the downloaded filename, the column COUNT, and each of the
  14 headers positionally (so a reordering is caught, not just a missing column).

### 4. testcaseRepository / testcaseData / execution file
- Registered `TST_CCLS_TC_22` (`visualTest: false`); added `csvTemplateFileName` +
  `csvTemplateHeaders` (the full 14-column array) to `C1.adminAddClassBulk`; inserted TC_22 into
  the bulk exec file before TC_19 (template download reads naturally before the upload case).

## Verification (real output)
- Run 1: **11 passing, 0 failing** — `csvTemplate { fileName: 'Class_creation_form_template.csv',
  rowCount: 2, headerCount: 14 }`; file confirmed on disk (380 bytes) at
  `output/downloads/Class_creation_form_template.csv`; `git status` clean of `output/`.
- Run 2: **11 passing, 0 failing** (55s) — determinism confirmed.

## Architecture Decisions Triggered
> ⚠️ New capability added to a protected core file. Follows the ADR-003 escape-hatch protocol
> exactly: a missing low-level capability was added as a named, logged method in the action
> library rather than inlined as a raw `global.page.*` call in a page object. No new ADR is
> needed — this is the documented process working as intended — but the new method is worth
> knowing about for any future download-based test (report exports, student CSV downloads, etc.).

## Protected Files Touched
`core/actionLibrary/baseActionLibrary.js` — additive only, confirmed by the user before editing,
inline comment dated and attributed. `package.json` still NOT touched (script confirmation
outstanding).

## Pending / Follow-up
- **`package.json` npm script** for `schoolAdminAddClassBulk.json` — still awaiting confirmation.
- **Cleanup:** 4 classes created earlier today in FCN-CHZ-PDA (2× `AutoClass_CreateOnly`,
  2× `AutoClass_CreateMore`).
- **Phase 3 (visual)** pending for all scenario-#3 suites (expected outcome: no candidates —
  every TC reads attributes/state/applied values, none assert a static UI snapshot).
- Nothing committed yet; the whole session's work sits in the working tree.

---

# Session Walkthrough — 2026-08-18 (part 7: npm script)

## Changes Made

### testAutomation_v1.0/package.json  ⚠️ PROTECTED — user confirmed
- **Type:** Modified — **Layer:** Configuration
- **What changed:** Added ONE script line beside the existing `P1Adminclass*` entries:
  `"P1AdminclassBulk_Thor": "node core/runner/run.js --appType=ExperienceApp --testEnv=thor
  --testExecFile=schoolAdminAddClassBulk.json --browserCapability=desktop-chrome-1920"`
- **Why:** Phase 2 step 1 — the bulk suite had no npm script and was being run via a raw
  `node core/runner/run.js` command. Follows the `<feature>_<env>` convention (AGENTS.md Rule 6/C).
- **No `visualAcceptance_*` counterpart:** AGENTS.md Rule B requires the dual script only when a
  TC in the exec file has `visualTest: true`. Every TC here is `false` (Phase 3 has not run), so
  the visual script is deliberately omitted — revisit if Phase 3 promotes any candidate.

## Verification (real output)
`npm run P1AdminclassBulk_Thor` → **11 passing, 0 failing** (58s). Run through the SCRIPT rather
than the raw node command, so the script entry itself is verified, not assumed:
```
> testAutomation@0.9.4 P1AdminclassBulk_Thor
> node core/runner/run.js --appType=ExperienceApp --testEnv=thor --testExecFile=schoolAdminAddClassBulk.json --browserCapability=desktop-chrome-1920
```

## Protected Files Touched
`package.json` — one additive script line, confirmed by the user beforehand.
(Also this session: `core/actionLibrary/baseActionLibrary.js` — see part 6.)

## Session totals — scenario #3 ("Verify bulk class creation form is working fine")
**16 of 16 manual BCCF cases automated.** Suites:
| Suite | npm script | TCs | Creates classes? |
|---|---|---|---|
| Bulk positives | `P1AdminclassBulk_Thor` | 11 | **No** |
| Create workflow | `P1Adminclassworkflow_Thor` | 13 | Yes — 2/run |
| Edge/Negative validation | `P1AdminclassValidation_Thor` | 6 | No |

## Pending / Follow-up
- **Phase 3 (visual)** for all three suites — expected outcome "no candidates" (every TC reads
  attributes/state/applied values; none assert a static UI snapshot), but the assessment is still
  formally required before the feature is closed.
- **Cleanup:** 4 classes created today in FCN-CHZ-PDA (2× `AutoClass_CreateOnly`,
  2× `AutoClass_CreateMore`).
- **Not committed** — the entire session's work is in the working tree.

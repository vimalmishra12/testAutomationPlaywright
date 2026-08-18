# Session Walkthrough — 2026-08-14 (Run 2: bulk-form validation)

## Summary
Extended the existing Admin App **`CCLS`** module (createClasses page object, `schoolAdminAddClass.test.js`)
with the **Edge/Negative** cases of manual scenario **#3 — "Verify bulk class creation form is working
fine"** (`test/Manual/C1App/AdminApp-Classes`). Source of truth: the manual `.md`; decision (per user):
**extend `CCLS`** rather than create a parallel `BCCF` module — same page object, one screen. Four new
TCs added, each cross-referenced to its manual `BCCF_TC_*` id:

| New automation TC | Manual case | Type | Assertion |
|---|---|---|---|
| `TST_CCLS_TC_9`  | BCCF_TC_15 | Negative | "Create N class" disabled on an empty row |
| `TST_CCLS_TC_10` | BCCF_TC_16 | Negative | non-alphanumeric name (`---`) keeps Create disabled |
| `TST_CCLS_TC_11` | BCCF_TC_13 | Edge | class-name input `maxlength` = 50 |
| `TST_CCLS_TC_12` | BCCF_TC_14 | Edge | End-date picker disables days on/before the start date |

These run on a **fresh, empty** create form via a new execution suite (**Run 2**) and never create a
class (no data seeded). BCCF_TC_2/4/12-back-to-dashboard were already covered by `TST_CCLS_TC_1..8`.

## ⚠️ Important caveat — selectors NOT captured live this session
The project's standard capture tool (Playwright MCP, `.mcp.json`, with the persisted Thor login profile)
**did not connect** this session, and driving a manual browser login is disallowed (entering a password
to authenticate). Artifacts were therefore authored from the already-verified `dBulkClass-*` qid scheme
plus the manual doc's live-captured details. One new selector — `endDateDisabledCell`
(`.owl-dt-calendar-cell-disabled`) — comes from the manual doc's live capture but was **not re-verified**.
**Phase 2 must run `npm run P1AdminclassValidation_Thor` to confirm all selectors and the empty-row
precondition before this is considered green.**

## Changes Made

### 1. testResources/selectors/ExperienceApp/C1Selectors.json — Modified (selectors)
Added `endDateDisabledCell` (`.owl-dt-calendar-cell-disabled`) to `css.ComproC1.createClasses`.

### 2. pages/ExperienceApp/createClasses.page.js — Modified (page object)
Added the `endDateDisabledCell` selector ref and three read-only getters (no class is created):
`getData_classNameMaxLength()` (parses the `maxlength` attribute), `getData_createBtnEnabled()`
(strict-boolean `isEnabled` of the Create button — Invariant 4), `getData_endDatePickerDisabledCount()`
(opens the End-date picker, counts disabled cells).

### 3. test/ExperienceApp/schoolAdminAddClass.test.js — Modified (test)
Added `TST_CCLS_TC_9..12` (see table). Ordering matters: TC_9 asserts the *empty* row first, TC_10
then types `---`, TC_12 sets a start date before opening the end picker.

### 4. testResources/testcaseRepository/ExperienceApp/C1TCRepository.json — Modified (TC repo)
Registered `TST_CCLS_TC_9..12` in the `ADMINADDCLASS` module block, all `visualTest: false`
(two-change rule — Invariant 7).

### 5. testResources/testcaseData/ExperienceApp/thor/schoolAdminAddClassData.json — Modified (data)
Added `C1.adminAddClassValidation` block: `schoolKey`, `invalidName` (`---`), `classNameMaxLength` (50).

### 6. testResources/testExecutionFiles/ExperienceApp/thor/schoolAdminAddClassValidation.json — Created (exec)
"Run 2" suite: same login Before-hook (reused TCs — ADR-011) → open school → Add class →
TC_11, TC_9, TC_10, TC_12 (deliberate order).

### 7. package.json — Modified (script)
Added `P1AdminclassValidation_Thor` → runs `schoolAdminAddClassValidation.json`.

### 8. .architecture/authoring-status.md — Modified
Added the in-flight block (Phase 1 ✅, Phase 2/3 ⬜) with the live-capture caveat and the list of
deferred POSITIVE scenario-#3 cases.

### 9. Manual doc remarks — Modified
Cross-referenced the automation ids into `BCCF_TC_13/14/15/16` Remarks.

## Verification done
- All edited/created JSON parses (`JSON.parse`).
- Both edited JS files pass `node --check`.
- **Not** run against the live app yet — that is Phase 2.

## Next steps (Phase 2)
1. `npm run P1AdminclassValidation_Thor` (recommended: fresh session).
2. Verify `endDateDisabledCell` and the empty-row Create-disabled state on the live form; fix if needed
   (propose-then-edit on any failure — Invariant 9).
3. Then Phase 3 visual assessment (expected: no candidates — all reads are attribute/state, no snapshot).

## Deferred (need live Playwright-MCP capture before authoring)
Scenario-#3 POSITIVE cases: BCCF_TC_1 (enriched toolbar assertions), TC_3 (add teacher), TC_5 (add
label), TC_6 (bulk create 2), TC_7 (duplicate), TC_8 (copy existing class), TC_9 (bulk set dates),
TC_10 (CSV template download), TC_11 (CSV upload), TC_12 "Create more classes" leg.

---

# Session Walkthrough — 2026-08-14 (Phase 2 run/fix — validation suite)

## Summary
Ran the bulk-form validation suite (`P1AdminclassValidation_Thor`) for the first time and closed
Phase 2. First run: 5/6 passing — `TST_CCLS_TC_9` failed (`Create` found *enabled* on the "empty"
row). Root cause: the create form **restores an auto-saved draft**, so the row is not empty on load
(a valid name + dates from earlier `P1Adminclassworkflow_Thor` create runs were restored → Create
enabled). Fixed by making TC_9 establish its own precondition; suite now green, 2 consecutive clean runs.

## Changes Made

### 1. pages/ExperienceApp/createClasses.page.js
- **Type:** Modified
- **Layer:** Page Object
- **What changed:** Added `clear_className()` — clears the first row's class-name input via
  `action.clearValue(this.classNameInput)` (no new selector).
- **Why:** Give TC_9 a deterministic "incomplete row" precondition independent of any restored draft.

### 2. test/ExperienceApp/schoolAdminAddClass.test.js
- **Type:** Modified
- **Layer:** Test Case
- **What changed:** `TST_CCLS_TC_9` now calls `clear_className()` and asserts it succeeded, then
  asserts `getData_createBtnEnabled()` is false. Updated the doc comment to explain the draft-restore.
- **Why:** The form is not guaranteed empty on load (auto-saved draft); clearing the name guarantees a
  missing required field, still validating BCCF_TC_15's rule.

### 3. .architecture/authoring-status.md
- **Type:** Modified — marked Phase 2 ✅ (6 passing, 2 clean runs); recorded that `endDateDisabledCell`
  (`.owl-dt-calendar-cell-disabled`) is now live-verified (18 disabled cells).

## Product knowledge learned
- **Create-new-classes form auto-restores a saved draft** — reopening `Add class` can pre-populate a
  row (name + dates) from a prior session, so validation tests must not assume a pristine empty form.
  (Consider promoting to product-knowledge/ExperienceApp.md.)

## Architecture Decisions Triggered
None new — standard self-precondition test-design; Invariant 1 (deterministic waits) and Golden Rule 6
(propose-then-fix) followed.

## Protected Files Touched
None — no protected files were modified. (`P1AdminclassValidation_Thor` npm script already existed.)

## Pending / Follow-up
- Phase 3 (visual) for the validation TCs still ⬜ pending — candidates: none (attribute/state reads only).
- Next: Phase B1 — author BCCF positive batch (TC_1,3,5,6,9,12) via live Playwright-MCP capture.

---

# Session Walkthrough — 2026-08-14 (Phase B1 — first bulk POSITIVE case)

## Summary
Authored and verified the first scenario-#3 **positive** case: **BCCF_TC_6 (bulk create multiple
classes)** as `TST_CCLS_TC_13`. Per user decision, it asserts **form behaviour only and creates no
class** — it fills row 1 + row 2 and asserts the "Create N class(es)" button count increases by
exactly one. Built + verified green (2 consecutive clean runs) in the same session.

## Changes Made

### 1. testResources/selectors/ExperienceApp/C1Selectors.json
- **Type:** Modified — **Layer:** Test Resources (selectors)
- **What changed:** Added `classNameInputRow2`, `startDateInputRow2`, `endDateInputRow2` under
  `css.ComproC1.createClasses` (`input[qid='dBulkClass-1-2'/'-1-3'/'-1-4']`).
- **Why:** Row 2 of the bulk form. INFERRED from the row-1 `dBulkClass-<row>-<col>` pattern
  (no live MCP capture available — profile not authenticated); **verified live by the run**.

### 2. pages/ExperienceApp/createClasses.page.js
- **Type:** Modified — **Layer:** Page Object
- **What changed:** Added `set_className_row2()`, `set_startDate_row2()`, `set_endDate_row2()`
  (mirroring the row-1 methods against row-2 qids; the date-picker OVERLAY selectors are shared),
  and `getData_createBtnLabel()` returning `{ raw, count }` parsed from the button label.
- **Why:** Back the bulk multi-row case. The count is *parsed* rather than assumed because the form
  restores an auto-saved draft, so the absolute starting count is not fixed.

### 3. test/ExperienceApp/schoolAdminAddClass.test.js
- **Type:** Modified — **Layer:** Test Case
- **What changed:** Added `TST_CCLS_TC_13` — sets row 1 explicitly (known baseline), reads the
  Create-button count, fills row 2, re-reads, asserts `after == before + 1`.
- **Why:** Proves bulk row accumulation (BCCF_TC_6) **without clicking Create**, so the test school
  stays clean. Delta-based so a restored draft cannot make it flaky.

### 4. testResources/testcaseRepository/ExperienceApp/C1TCRepository.json
- **Type:** Modified — Registered `TST_CCLS_TC_13` with `visualTest: false` (two-change rule).

### 5. testResources/testcaseData/ExperienceApp/thor/schoolAdminAddClassData.json
- **Type:** Modified — Added `C1.adminAddClassBulk` (`schoolKey`, `className`, `classNameRow2`).

### 6. testResources/testExecutionFiles/ExperienceApp/thor/schoolAdminAddClassBulk.json
- **Type:** Created — **Layer:** Execution File
- **What changed:** New Suite1 "Run 3 (bulk-form positives: no class created)" — standard login
  Before hook (reused TCs, ADR-011) + `TST_SADB_TC_1` → `TST_SCLS_TC_2` → `TST_CCLS_TC_13`.

## Verification (real output)
`node core/runner/run.js --appType=ExperienceApp --testEnv=thor --testExecFile=schoolAdminAddClassBulk.json
--browserCapability=desktop-chrome-1920 --headless=false --report=spec`
- Run 1: **3 passing, 0 failing** — `createBtnLabel {raw:'Create 1 class',count:1}` → `{raw:'Create 2 classes',count:2}`
- Run 2: **3 passing, 0 failing** (determinism proven)

## Architecture Decisions Triggered
None new. Followed ADR-011 (compose login from existing TCs), Invariant 6 (`clearValue`+`addValue`
on Angular inputs), Invariant 7 (two-change rule), and Golden Rule 8 (`visualTest: false` on new TCs).

## Protected Files Touched
None — no protected files were modified. **`package.json` deliberately NOT edited**: the suite was
run directly via `node core/runner/run.js`. An npm script (`P1AdminclassBulk_Thor`) still needs to be
added with confirmation once the rest of the B1 positives land.

## Pending / Follow-up
- **Blocked on live capture (MCP profile not logged in):** BCCF_TC_3 (add-teacher modal), TC_5
  (label dropdown), TC_9 (bulk toolbar + row checkboxes), TC_12 ("Create more classes"), and the
  enriched TC_1 toolbar assertions. Their modal/toolbar qids cannot be reliably inferred.
- ⚠️ **Security note:** the runner prints the resolved login data — including the plaintext password —
  to the console at `TST_LOGI_TC_1`. Pre-existing framework logging behaviour, not introduced here;
  worth masking (credentials are also stored plaintext in `logindata.json`, a known interim per ADR-013).
- Phase 3 (visual) pending for both the validation block and this one (expected outcome: no candidates).

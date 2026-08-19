# Session Walkthrough — 2026-08-14

## Summary
Authored (Phase 1 build) a new Admin App (School-admin / NEMO, `micro-nemo.comprodls.com`)
"Add class" automation — **Run 1: create class only** — for school **"3 July Test School 1"**
(school key **FCN-CHZ-PDA**), logging in as `testt1@mailsac.com` (existing `schoolAdmin`
login data). Flow: select the specific school → capture the active-class count → click
"Add class" → fill the create form (name + start/end dates) → Create → verify the success
dialog. Login is reused from existing TCs (ADR-011). Selectors captured live via Playwright MCP.

## Changes Made

### 1. testResources/selectors/ExperienceApp/C1Selectors.json
- **Type:** Modified
- **Layer:** Test Resources (selectors)
- **What changed:** Added `schoolLinkByKey` template to `css.ComproC1.schoolAdminDashboard`;
  added two new sections `css.ComproC1.schoolClasses` (addClassBtn, activeClassesHeading) and
  `css.ComproC1.createClasses` (classNameInput, startDateInput, startDateTodayCell, endDateInput,
  endDateNextMonthBtn, endDateDay15Cell, createClassBtn, successDialogTitle).
- **Why:** New pages in the admin add-class flow needed their selectors externalised (ADR-002).

### 2. pages/ExperienceApp/schoolAdminDashboard.page.js
- **Type:** Modified
- **Layer:** Page Object
- **What changed:** Added `schoolLinkByKey` property + `click_schoolByKey(schoolKey)` method,
  which substitutes the runtime key into the externalised selector template, clicks the school,
  then calls `schoolClasses.isInitialized()`.
- **Why:** Two schools share the name "3 July Test School 1"; the school key is the unique
  disambiguator (it appears in each card link's `aria-label`).

### 3. pages/ExperienceApp/schoolClasses.page.js
- **Type:** Created
- **Layer:** Page Object
- **What changed:** `isInitialized()` (anchor = Add class btn), `getData_activeClassCount()`
  (parses "Active classes (N)"), `click_addClass()` (→ createClasses.isInitialized()).

### 4. pages/ExperienceApp/createClasses.page.js
- **Type:** Created
- **Layer:** Page Object
- **What changed:** `isInitialized()`, `set_className()` (clearValue+addValue — Angular form),
  `set_startDate()` (open Owl picker → click today's active cell), `set_endDate()` (open picker →
  Next month → click day-15 cell), `click_createClass()` (→ waits for success dialog),
  `getData_successMessage()`.

### 5. test/ExperienceApp/schoolAdminAddClass.test.js
- **Type:** Created
- **Layer:** Test Case
- **What changed:** TST_SADB_TC_1 (select school), TST_SCLS_TC_1 (capture count baseline),
  TST_SCLS_TC_2 (add class), TST_CCLS_TC_1..4 (name, start date, end date, create + verify success).

### 6. testResources/testcaseData/ExperienceApp/thor/schoolAdminAddClassData.json
- **Type:** Created
- **Layer:** Test Resources (data)
- **What changed:** `C1.adminAddClass` = { schoolKey FCN-CHZ-PDA, className AutoClass_CreateOnly,
  successMessage "Success! We are now creating" }.

### 7. testResources/testExecutionFiles/ExperienceApp/thor/schoolAdminAddClass.json
- **Type:** Created
- **Layer:** Test Resources (execution)
- **What changed:** Suite1 with Before = reused login chain (launchUrl → TST_LAND_TC_3 →
  TST_LOGI_TC_1/2 → TST_NEMO24306_TC_LOGIN) and Test = the 7 new TCs.

### 8. testResources/testcaseRepository/ExperienceApp/C1TCRepository.json
- **Type:** Modified
- **Layer:** Test Resources (TC repository)
- **What changed:** Added module "Admin App | School-admin Add Class (Run 1: create class only)"
  registering all 7 new TCs, all `visualTest: false`.

### 9. .architecture/authoring-status.md
- **Type:** Modified — added the `schoolAdminAddClass (ExperienceApp, thor)` in-flight block
  (Phase 1 ✅, Phase 2/3 ⬜).

## Product knowledge captured (live, via Playwright MCP)
- **Admin dashboard** (`/admin/admin/dashboard`, "My school accounts"): school cards are
  `a.inst-link[qid="aDashboard-N"]` (N positional); the school key is in the card's `aria-label`.
  **Two schools can share a display name** — select by key, not name/position.
- **School Classes page** (`/admin/admin/org_<slug>/class`): FCN-CHZ-PDA's slug is
  `org_perf_testschool_1`. Active-class count is in `<h2>` "Active classes (N)"; "Add class" is
  `a[qid="aClass-10"]`.
- **Create new classes form** (`/class/create`): bulk grid. Row-0 fields — name
  `input[qid="dBulkClass-0-2"]` (maxlength 50, pattern requires alphanumeric), start/end dates are
  **readonly Owl date-pickers** (`dBulkClass-0-3`/`-0-4`) opened by click; today = active cell
  (`td.owl-dt-calendar-cell-active`); Next-month = `button[aria-label="Next month"]`. "Create N
  class" = `button[qid="dBulkClass-13"]`, disabled until name+dates valid.
- **Class creation is ASYNCHRONOUS.** Success dialog (`#successCreateClassesModalLabel`) states
  "Success! We are now creating 1 class for you… can take up to 12 hours." The new class does NOT
  appear in the active-class count immediately, so verification is the success dialog, not count+1.
  > Follow-up: append these to `.architecture/product-knowledge/ExperienceApp.md` (NEMO section)
  > once the test is green in Phase 2.

## Architecture Decisions Triggered
- No new ADR. Uses existing patterns: ADR-002 (externalised selectors), ADR-011 (reuse login TCs),
  ADR-004 (lazy require for page-nav chains), Invariant 6 (addValue on the Angular class-name input).
- Minor pattern: a selector **template** (`schoolLinkByKey` with `{{key}}`) externalised in the
  selector JSON, with only the runtime key substituted in the page object — keeps the selector
  pattern in JSON while handling a data-driven attribute match without a protected-file change.

## Protected Files Touched
None — no protected files were modified.

## Pending / Follow-up
- **Phase 2 (run/fix):** run `schoolAdminAddClass.json` on thor and fix any failures. Watch for:
  (a) create-form draft persistence ("Saved …") leaving stale rows across runs — may need an
  about:blank teardown like `createAdultStudentAccounts.navigateTo`; (b) date-picker timing.
- **Later runs (per user):** add teacher (admin flow adds a **teacher**, not a student), materials.
- **Data note:** `className` is static; repeated runs create duplicate same-named classes on thor
  (acceptable for now; consider a timestamped name later).
- Promote the product-knowledge notes above into `product-knowledge/ExperienceApp.md` once green.

---

## Phase 2 (Run & Fix) — 2026-08-14

**Result:** GREEN first try. `schoolAdminAddClass.json` on thor — **7/7 passing, 2 consecutive
clean runs** (44s then 16s) via direct `node core/runner/run.js --appType=ExperienceApp
--testEnv=thor --testExecFile=schoolAdminAddClass.json --browserCapability=desktop-chrome-1920`.
No source fixes were needed; **no protected files modified**.

**Observations from the real runs:**
- Success dialog verified live: `title: 'Success! We are now creating 1 class for you'`.
- Active-class count read cleanly and climbed across runs (10 → 11) as the async-created classes
  landed — confirms the "creation is asynchronous, verify via dialog not count+1" design decision.
- The create-form draft-persistence risk did NOT materialize: clicking "Add class" each run lands
  on a fresh empty row 0, and the row-0 qids (`dBulkClass-0-2/3/4`) resolved every time.

**Data note (unchanged):** `className` is static ("AutoClass_CreateOnly"), so each run adds another
same-named class to the school. Acceptable on thor; revisit with a timestamped name if duplicates
become noise.

**package.json (PROTECTED) — confirmed by user 2026-08-14:** added functional script
`"P1Adminclassworkflow_Thor": "node core/runner/run.js --appType=ExperienceApp --testEnv=thor
--testExecFile=schoolAdminAddClass.json --browserCapability=desktop-chrome-1920"`. Verified via
`npm run P1Adminclassworkflow_Thor` — 7/7 passing (3rd clean run, through the named entry point).
No visual script added (all TCs `visualTest:false`; Phase 3 not yet done).

**Pending:** Phase 3 (visual assessment — expected "no candidates", all data is dynamic).

---

## Extension — Add material to the created class (2026-08-14)

**Request:** make the admin class also add a material, reusing the material TCs from
`createNewClassWithStudent.json`.

**Finding (why the existing TCs were NOT reused):** the material TCs in that file
(`TST_ENTE_TC_22/21/23/20/19`) are bound to `createNewClass.page.js` — the **teacher** create-class
wizard (qids `add-class-materials-button-3`, `material-modal-filter-input`,
`material-modal-add-to-class-btn`, …). The **admin bulk-create form** uses a **different component**
(verified live): row button `dBulkClass-0-6` → search `dBulkClass-add-learning-material-modal-1-0`
→ result `a.dropdown-item` → confirm `dBulkClass-add-learning-material-modal-2` → material renders in
`input[qid="dBulkClass-products0-6"]`. The teacher functions reference teacher selectors, so they
cannot drive the admin screen — admin-native methods were required (same logical workflow, same
material value `dev_test_ebook_bundle_104_bundle`).

**Changes:**
- `C1Selectors.json` → `css.ComproC1.createClasses`: added addMaterialBtn, materialSearchInput,
  materialItem, addMaterialsConfirmBtn, selectedMaterialInput.
- `createClasses.page.js`: added `click_addMaterialBtn()`, `select_material(name)` (uses
  `action.getFilteredLocator` to match the result by name — runtime value kept out of the page
  object), `click_addMaterialsConfirm()` (verifies the chip via `getValue`).
- `schoolAdminAddClass.test.js`: added TST_CCLS_TC_5 (open modal), TST_CCLS_TC_6 (select material),
  TST_CCLS_TC_7 (confirm + verify attached).
- `schoolAdminAddClassData.json`: added `material: dev_test_ebook_bundle_104_bundle`.
- Execution file: inserted TC_5/6/7 between the end-date (TC_3) and Create (TC_4) steps.
- TC repository: registered the 3 new TCs (`visualTest:false`).

**Result:** `npm run P1Adminclassworkflow_Thor` — **10/10 passing, 2 consecutive clean runs**
(68s then 38s). Material attaches (`{ added: true, material: 'dev_test_ebook_bundle_104_bundle' }`)
then the class is created (success dialog). **No protected files touched.**

**Watch-item:** TST_CCLS_TC_6 hits a live per-keystroke backend material search; its duration varies
(15–43s observed) but stays within Playwright action timeouts. If it ever flakes on a slow search,
switch the search from `addValue` (per-keystroke) to `setValue` (single fill) and rely on the
by-name click, or raise the wait timeout.

---

## Phase 3 (Visual Assessment) — 2026-08-14

**Outcome: assessed, NO visual candidates.** Every one of the 10 TCs maps to a ❌ row of the
AGENTS.md §8 decision table, so all stay `visualTest: false` (verified in the TC repo). Per the
rule this is not a judgment call — no user confirmation, no promotion, and no `visualAcceptance_*`
script is created.

| TC | Decision-table row | Decision |
|---|---|---|
| TST_SADB_TC_1 | User-generated key (school key FCN-CHZ-PDA) | false |
| TST_SCLS_TC_1 | Paginated / dynamic count ("Active classes (N)") | false |
| TST_SCLS_TC_2 | Timestamp ("Saved N days ago" on the form) | false |
| TST_CCLS_TC_1 | User-generated class entity (class name) | false |
| TST_CCLS_TC_2 | Timestamps / dates (start = today) | false |
| TST_CCLS_TC_3 | Timestamps / dates (end = next month) | false |
| TST_CCLS_TC_5 | Env-variant / dynamic list (material library) | false |
| TST_CCLS_TC_6 | Paginated / dynamic list (backend material search) | false |
| TST_CCLS_TC_7 | Env-variant value (school-library material) | false |
| TST_CCLS_TC_4 | Dialog text static, but captured screen is dominated by dynamic dates + "Saved" timestamp | false |

**Feature CLOSED.** All three phases complete: Phase 1 (build) ✅, Phase 2 (run/fix, 10/10, 2 clean
runs) ✅, Phase 3 (visual assessment, no candidates) ✅. The `schoolAdminAddClass` block was removed
from `authoring-status.md`. Ready to merge.

---

## Extension — "Back to dashboard" after create (2026-08-14)

**Request:** after creating the class, click "Back to dashboard" and land on the dashboard page.

**Verified live:** the success dialog's "Back to dashboard" link (`a[qid="dBulkClass-47"]`) returns
to the **school Classes page** (`/admin/admin/org_<slug>/class`, h1 "3 July Test School 1", Add-class
button, "Active classes (N)") — i.e. the school dashboard, NOT the top-level "My school accounts"
list. So the destination is the existing `schoolClasses` page object (reused its `isInitialized()`).

**Changes:**
- `C1Selectors.json` → `createClasses.backToDashboardLink` = `a[qid='dBulkClass-47']`.
- `createClasses.page.js`: added `click_backToDashboard()` (clicks the link, confirms
  `schoolClasses.isInitialized()` via lazy require).
- `schoolAdminAddClass.test.js`: added `TST_CCLS_TC_8`.
- TC repository + execution file: registered/added `TST_CCLS_TC_8` after `TST_CCLS_TC_4`.
- Visual: `TST_CCLS_TC_8` is `visualTest:false` (lands on a page with a dynamic class count).

**Result:** `npm run P1Adminclassworkflow_Thor` — **11/11 passing, 2 consecutive clean runs**
(35s then 49s). No protected files touched.

## Follow-ups for future runs (not blocking merge)
- Add **teacher** to the class (admin flow adds a teacher, not a student) — next run.
- Optionally harden TST_CCLS_TC_6's material search (fill vs per-keystroke) if it flakes.
- Promote the captured NEMO admin product-knowledge (school Classes page, create form, async
  creation, material component) into `product-knowledge/ExperienceApp.md`.

---

# Session — 2026-08-19 (evening)

## Summary
Refactor session, no new coverage. Extracted the create-form reset into its own test case
(`TST_CCLS_TC_23`) and enriched the class the workflow suite creates: it now carries a
**label** and a **teacher** as well as a name, dates and a material.

The trigger was a composition problem. The ask was to move `TST_CCLS_TC_16` (label) and
`TST_CCLS_TC_15` (teacher) into the class-creating workflow suite. `TC_15` moved cleanly, but
`TC_16` began with `reset_formToSingleEmptyRow()` — dropped in after `TC_1/2/3` it would have
**deleted the very row those TCs had just filled**, and the suite could have gone green while
creating the wrong class.

The user's diagnosis was the right one, and better than the first two workarounds discussed
(remove the reset from `TC_16`; or reorder so `TC_16` runs first): **the reset does not belong
inside any TC.** `TC_16`'s title promises a label test; it was doing housekeeping, a class name
and a label. Reset is its own concern, name is `TC_1`'s job, label is `TC_16`'s.

## Changes Made

### 1. test/ExperienceApp/schoolAdminAddClass.test.js
- **Type:** Modified
- **Layer:** Test Cases
- Added **`TST_CCLS_TC_23`** — reset only, nothing else.
- Removed the inline `reset_formToSingleEmptyRow()` + assertion pair from **seven** TCs:
  `TC_12, 13, 16, 17, 18, 19, 21`. (Seven, not the five first estimated — `TC_12` in the
  validation suite was found during the edit.)
- `TST_CCLS_TC_16` is now **label-only**: its `set_className()` was removed too, and its doc
  comment records that it REQUIRES a preceding `TC_23` in its suite (a restored draft can arrive
  with the label already applied, and re-selecting it would toggle it OFF).
- `TST_CCLS_TC_15` (teacher) needed no change — it never had a reset.

### 2. pages/ExperienceApp/createClasses.page.js
- **Type:** Modified (non-protected)
- `reset_formToSingleEmptyRow()` now returns early unless the form's own `classNameInput` is
  present. **Found while reviewing the blast radius, not from a failure.** As a `BeforeEach`
  step the reset also fires on the school dashboard and the Classes tab, and its old guard
  (`rowCheckbox` = `input[type=checkbox][name^='checkbox-']`) is a structural match that could
  hit another page's row checkboxes. Checked and confirmed it could **not** have deleted real
  classes — the select-all/Remove ids are form-specific — but a false positive would have
  stalled for the remove-dialog's full 10 s timeout and failed the hook.

### 3. Execution files — placement is now the exec file's decision
- `schoolAdminAddClass.json` — `TC_23` **once** in the `Test` list after the form opens; then
  `TC_16` (label) and `TC_15` (teacher) inserted after `TC_3`.
- `schoolAdminAddClassBulk.json` — `TC_23` in **`BeforeEach`**; `TC_15` and `TC_16` removed
  (11 → 9 TCs).
- `schoolAdminAddClassValidation.json` — `TC_23` in **`BeforeEach`**.

**This per-suite split is the whole payoff.** The bulk and validation suites hold independent
TCs, so each wants its own clean form — `BeforeEach`. The workflow suite's TCs deliberately
ACCUMULATE onto one row (name → dates → label → teacher → material → Create), so a per-test
reset there would delete the half-built class before every step. One TC, two placements — only
expressible once the reset is a composable unit of its own. `BeforeEach` and never `AfterEach`
in both cases (ADR-019).

### 4. Test data / TC repository / manual register
- `schoolAdminAddClassData.json` → `C1.adminAddClass` gained `classLabel: "VM1"` and
  `teacherEmail: "teacher17aug2026@mailsac.com"`. The bulk suite keeps
  `autotest.teacher@mailsac.com`.
- `C1TCRepository.json` → `TST_CCLS_TC_23` registered, `visualTest: false` (Invariant 12).
- Manual register: BCCF_TC_3 / BCCF_TC_5 re-attributed from the bulk suite to the workflow
  suite; BCCF_TC_2's Test Data corrected from `AutoClass_Bulk` (the bulk fixture) to
  `AutoClass_CreateOnly`, with a note that the automated path now also applies a label, a
  teacher and a material beyond that case's four steps.

## Result

All three suites green on the **first** run after the refactor:

| Suite | Result | Time |
|---|---|---|
| `P1AdminclassBulk_Thor` | **9/9** | 64 s |
| `P1AdminclassValidation_Thor` | **6/6** | 23 s |
| `P1Adminclassworkflow_Thor` | **16/16** | 31 s |

The workflow log shows the accumulation surviving to Create — `appliedLabel { raw: ' + VM1 ' }`,
then `{ added: true, email: 'teacher17aug2026@mailsac.com' }`, then the material, then
`'Success! We are now creating 1 class for you'`.

⚠️ **One clean run each, not the usual two** — the user judged a second pass unnecessary. The
workflow suite creates 2 real classes per run, so a second pass is not free.

Incidental: `TST_CCLS_TC_12` now reads **23** disabled date cells (was 18). Expected — the count
depends on today's date and the picker's month; the TC asserts `> 0`, not a fixed number.

## Follow-ups

1. **CLEANUP OWED — manual-TC ↔ automation mapping is unclear and needs tidying.** Two separate
   confusions, both live:
   - **One manual TC maps to MANY automation TC ids.** `TST_BCCF_TC_2` alone is covered by
     `TST_CCLS_TC_1..4`; the manual register records this only as free text in a Remarks cell,
     with no consistent format. There is no way to ask "which automation TCs cover this manual
     case?" other than reading prose.
   - **Which execution file does a given TC run in?** `schoolAdminAddClass.test.js` holds
     `TC_1..TC_23` spread across THREE exec files, and the test file itself gives no hint.
     Reading a TC does not tell you which suite it belongs to.

   **Important finding from this session: the relationship is MANY-TO-MANY, not one-to-one.**
   `TST_CCLS_TC_23` runs in all three suites (`Test` in the workflow suite, `BeforeEach` in the
   other two); `TST_SCLS_TC_2` in all three; `TST_SADB_TC_1` in **six** exec files across four
   features. So a hand-maintained mapping file would be correct on the day it is written and
   silently wrong after the next exec-file edit — it would add a fourth place to keep in sync on
   top of the existing test file + TC repo + exec file.

   Options weighed (decision deferred, nothing built):
   - (A) hand-written mapping file — highest drift risk;
   - (B) suite name in each TC's doc comment — still hand-maintained;
   - (C) **recommended** — derive it: a small `tooling/` script reading `testExecutionFiles/`,
     with a `--check` mode that fails when stale, output either as a generated header block in
     the test file or a generated `.md`. Zero drift, because the exec files stay the single
     source of truth. It also detects **orphan TCs** (defined in a test file, referenced by no
     exec file) — currently zero, which is exactly the kind of rot that hides for months;
   - (D) split the test file per suite — **rejected**: `TC_23`, `TST_SCLS_TC_2` and
     `TST_SADB_TC_1` are shared across suites, so splitting would force duplication — the very
     thing this session removed.

2. **`TST_CCLS_TC_23`'s description in `schoolAdminAddClass.json` is too long** — it prints in
   full in the mocha output. Shorten it and keep the reasoning in the test file's doc comment.

3. Still open from earlier sessions: the X-close `// WORKAROUND` in
   `classFilterModal.click_close()`; `TST_CLST_TC_RESET` off-convention naming; loose `leftNav*`
   text-match selectors.

4. **The `.xlsx` register was NOT updated this session, only the `.md`.** Working agreement #10
   says update BOTH. No Status cell changed (all affected rows were already `Pass`), but three
   text cells did: BCCF_TC_2's Test Data (`AutoClass_Bulk` → `AutoClass_CreateOnly`) and the
   Comments cells for BCCF_TC_3 / BCCF_TC_5 (bulk suite → workflow suite). Left for the user to
   decide — the xlsx is patched by rewriting `xl/worksheets/sheet1.xml` inside the zip, which
   must not be attempted while the workbook is open in Excel.

**Post-session note (2026-08-19, after the description trim):** `TST_CCLS_TC_23`'s over-long
descriptions were shortened in all three exec files (follow-up 2 above — now closed), with the
detail moved into the TC's doc comment so nothing was lost. Re-verified: bulk **9/9** (57 s) and
validation **6/6** (25 s) — both now at **2 consecutive clean runs**. The workflow suite was not
re-run (only a description string changed, and each run creates 2 real classes), so it remains at
**one** clean run.

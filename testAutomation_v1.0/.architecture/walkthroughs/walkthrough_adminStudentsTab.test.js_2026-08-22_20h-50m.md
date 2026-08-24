# Walkthrough — Admin App Students tab, manual test-case authoring (Batch 1)

**Date:** 2026-08-22 · **Skill:** `c1-manual-test-authoring` · **Phase:** design only, no automation
**Env:** Thor `micro-nemo.comprodls.com` · school `3 July Test School 1` / `FCN-CHZ-PDA` · `testt1@mailsac.com`
**Deliverables:** `test/Manual/C1App/AdminApp-Students/AdminApp_Students_tab_test_cases.md` + `.xlsx`

---

## Session 1 — 2026-08-22

### What was asked
Review the manual-authoring skill, the architecture, and the attached `AdminApp_Student Tab.xlsx`,
then create test cases for each scenario.

### Input
The attached path (`test/Manual/C1App/AdminApp-Classes/AdminApp_Student Tab.xlsx`) **did not exist**.
The workbook was found at `C:\Users\Compro\Desktop\Admin Automation\AdminApp_Student Tab.xlsx` —
one sheet, 23 scenarios in rows 2–24. Flagged to the user rather than guessed at.

### Scope agreed before designing (skill Step 1)
Three decisions were put to the user and answered:

1. **Full live recon first** — rather than writing from product knowledge with `[ASSUMED]` markers.
2. **One document, all 23 scenarios** in a new area folder `AdminApp-Students/`.
3. **Three module codes** — `SLST` / `SPRF` / `SBLK`, named after the page objects those screens
   will get (`schoolStudents`, `studentProfile`, `bulkStudents`), per golden rule 3.

### Recon performed (Playwright MCP, live)
Search on all four dimensions · the activation checkbox · all three sort columns and their toggles ·
user guide expand/collapse · load more to exhaustion · a child profile and two adult profiles ·
Manage learner profile (both tabs) · a weak-password rejection · individual code activation with an
unusable code · class launch from a profile · all four bulk entry screens · and a free capture of
every pre-rendered dialog on the Students tab, Manage learner profile and `/bulk_activation`.

**Nothing was mutated.** No password was changed, no student removed, no account created, no
activation code consumed. The only two submissions were a deliberately weak password and a
deliberately unusable activation code — both rejected, both leaving state untouched.

### Four defects found by grounding

| # | Defect | Case |
|---|---|---|
| 1 | A no-results search renders **nothing** — table removed, no empty-state message — with a `TypeError` from the admin bundle | `TST_SLST_TC_12` |
| 2 | One student's profile hangs on an **infinite spinner**; `getUserDetailWithClasses` returns **HTTP 500**, with no client-side error handling | `TST_SPRF_TC_7` |
| 3 | The bulk-activation **success dialog renders three raw i18n keys** | `TST_SBLK_TC_9` |
| 4 | Untranslated keys leak into **accessible names** (`…SELECT_STUDENT`, `SCREEN_READER.PROCESSING_MESSAGE`) | `TST_SBLK_TC_10`, `TST_SPRF_TC_16` |

Defect 3 is the clearest payoff of the §A6 free-capture trick — it was found by reading the
pre-rendered success dialog, without ever running a bulk activation.

### One scenario appears not implementable as written
Source scenario #15 asks for the umbrella details page to be launched by **clicking the umbrella
name** on a profile. The umbrella name is a plain `<span class="bundle-title">` with **no link or
button anywhere in its ancestry**, confirmed on both a child and an adult profile. Written up as
`TST_SPRF_TC_18` (expected vs actual); needs a product decision before automation.

> This is exactly the failure mode `admin-shared.md` §A8.1 warns about — the historic
> *"click a listed class"* cases. Caught here at design time instead of weeks later.

### Output

- **59 test cases** — 32 Positive · 17 Edge · 10 Negative. All 23 source scenarios covered, plus one
  designer-added tab-load case.
- **SLST 25 · SPRF 22 · SBLK 12.**
- **3 Blocked at design time** (`TST_SLST_TC_14`, `TST_SPRF_TC_3`, `TST_SPRF_TC_20`) — shared-school
  constraints, recorded Blocked with reason and unblock, not Not Run.
- **10 `[ASSUMED]` expected results**, every one listed in the document's Open items section. Each is
  a state that could not be reached without mutating a shared school, consuming a real code, sending
  real email, or a fixture the school lacks.
- `.md` and `.xlsx` were generated **from one source array**, so they cannot drift; the `.xlsx` write
  was verified by reading the saved file back (the `xlsxRegister` discipline), and both were then
  cross-counted independently — 59 / 32 / 17 / 10 / 56 Not Run / 3 Blocked on both sides.

### Knowledge promoted (not left only in the document)

- **New** `product-knowledge/ExperienceApp/admin-students-tab.md` — routes across the three
  microfrontends, product behaviour, verified copy, automation traps, the four defects, fixtures.
- **`admin-shared.md`** — §A2 gains the three Students modules and a note that this batch applied
  the module-code lesson; §A5 gains the Students-tab shared-school blockers; §A6 gains the three new
  free-capture wins; §B2 gains the Students-tab, bulk-activation and Gigya pre-render counts.
- **`product-knowledge.md`** — the feature-area map gains the new per-screen file.

### Deliberately not done

- **No CSV fixtures.** The bulk templates were not downloaded, and `manual-test-standard.md` requires
  the exact template headers — writing them from memory would be the guess the standard forbids. The
  seven filenames needed are named in the document's handoff section.
- **No boundary case for First name / Last name.** Neither carries a `maxlength`, so there is no
  boundary to test until the server-side limit is measured. Flagged rather than invented
  (`admin-shared.md` §A8.2).

### Handoff
`c1-test-authoring` Phase 1. Module codes and their page objects, the Blocked cases and their
unblock, the `[ASSUMED]` list, and the side-effect-free versus data-mutating split are all stated in
the document's *Handoff to automation* section.

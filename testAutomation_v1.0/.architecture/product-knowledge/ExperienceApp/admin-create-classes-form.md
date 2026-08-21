# Admin App — Create new classes (bulk form)

> **Manual module `BCCF` · automation module `CCLS`** (`createClasses.page.js`).
> The mismatch is deliberate: module codes come from the page object, not the manual batch
> (AGENTS.md Rule 6). See `admin-shared.md` §A2.
>
> **Read [`admin-shared.md`](admin-shared.md) first** — navigation, the pre-rendered-modal
> doctrine, positional ids, CSS-only-disabled buttons and Angular typing all apply here and are
> not repeated. This file holds only what is specific to this screen.
>
> **This is the most automation-hostile screen in the Admin App.** Fourteen distinct gotchas were
> found across seven sessions (2026-08-14 → 08-19). Read the Traps section before touching it.
>
> Living document — append, never overwrite. `[Seeded 2026-08-21]` from
> `walkthrough_2026-08-18.md` (parts 1–7), the `schoolAdminAddClass*` walkthroughs, and
> `HANDOFF-adminclasses-scenario3.md` §4.

---

## Entry path and URL

**Classes tab → "Add class"** (`a[qid='aClass-10']`) → `/class/create`, heading *"Create new classes"*.

It is a **bulk grid**, not a single-class form — even when creating one class. Row fields follow
`dBulkClass-<rowIndex>-<colIndex>`, row 0 being the first row.

## Key elements

**Row 0 fields**

| Element | Selector | Notes |
|---|---|---|
| Class name | `input[qid='dBulkClass-0-2']` | `maxlength=50`; pattern requires alphanumeric — `---` is rejected |
| Start date | `input[qid='dBulkClass-0-3']` | **readonly** Owl date-picker, opened by click |
| End date | `input[qid='dBulkClass-0-4']` | readonly Owl picker; days on/before start are disabled |
| Add teachers | `button[qid='dBulkClass-0-5']` | opens a fullscreen modal |
| Add materials | `button[qid='dBulkClass-0-6']` | opens the catalogue modal |
| Add label | `button[qid='dBulkClass-class-label0-7']` | per-row dropdown — see trap 3 |
| Applied teacher / material | `input[qid='dBulkClass-teachers0-5']` / `dBulkClass-products0-6'` | read back to prove the apply landed |
| Copied-from cell | `button[qid='dBulkClass-copied-class-data-0-9']` | present only after a copy |

Row 1 mirrors these as `dBulkClass-1-2 / -1-3 / -1-4` (inferred from the pattern, then **verified
live**). The date-picker *overlay* selectors are shared across rows.

**Date picker (Owl)**

| Element | Selector |
|---|---|
| Today's cell | `td.owl-dt-calendar-cell-active` |
| Next month | `button[aria-label='Next month']` |
| Day 15 cell | `td.owl-dt-calendar-cell:has(span.owl-dt-calendar-cell-content:text-is("15"))` |
| Disabled cell | `.owl-dt-calendar-cell-disabled` |

**Form-level**

| Element | Selector | Notes |
|---|---|---|
| Create N classes | `button[qid='dBulkClass-13']` | label carries the pending row count; disabled until valid |
| Select all rows | `#bulk-class-selectall-checkbox` | |
| Row checkbox | `input[type=checkbox][name^='checkbox-']` | **positional ids — see trap 2** |
| Upload file | `button[qid='dBulkClass-11']` | not needed — see trap 9 |
| Hidden CSV input | `input[qid='dBulkClass-54']` | `accept=".csv"`, `class="d-none"`; takes files directly |
| Get CSV template | `a[qid='dBulkClass-download-template']` | |
| How to use this form | `button[qid='aBulkActionHelp-1']` | |
| Success dialog title | `#successCreateClassesModalLabel` | **pre-rendered — see trap 15** |
| Back to dashboard | `a[qid='dBulkClass-47']` | → school **Classes** page, not My school accounts |
| Create more classes | `a[qid='dBulkClass-48']` | |

**Bulk toolbar** (applies to selected rows) — `#startDateBtn`, `#endDateBtn`, `#addTeacherBtn`,
`#addBulkClassLabelBtn`, `#addLearningMaterialBtn`, `#copyFromBtn`, `#duplicateSelectedRowBtn`,
`#resetProgressDataBtn`, `#removeSelectedRowBtn`.

---

## Traps — read before changing anything

**1. The form auto-saves and RESTORES a draft — across runs AND sessions.**
It is **not empty on load**. One suite's leftover rows change what another suite sees. This is the
single biggest source of failures on this screen, including cross-suite contamination.
→ **Any TC that asserts on a row index or a row count MUST call
`reset_formToSingleEmptyRow()` first** (select-all → Remove → confirm *"Yes, remove rows"*; removes
only unsaved form rows, creates and deletes nothing). That reset is its own TC — `TST_CCLS_TC_23` —
so the execution file chooses where it runs.
> A delta-based count assertion is **not** inherently draft-proof: re-filling an already-complete
> row adds no class, so the delta is 0. An earlier note in the walkthrough claimed otherwise and
> was **wrong**.

**2. Row checkbox ids are POSITIONAL and re-issued.** `checkbox-1`, `checkbox-2`, … shift as rows
are added and removed, so row 1 is **not** reliably `#checkbox-1`. This was the root cause of
recurring, misleading *"row checkbox is not clicked"* failures in two TCs. Match structurally:
`input[type=checkbox][name^='checkbox-']`.

**3. The "Add class label" dropdown is rendered ONCE PER ROW** — `#class-label-list-modal-0`,
`-1`, `-2`, … — each holding a **full copy of every label** (~87 on MQA, ~15 on FCN). An unscoped
`input[placeholder='Create or find a label']` therefore matches one per row: Playwright raises a
strict-mode violation, or the search text lands in a **hidden row's** box, leaving row 1's list
unfiltered so the item click never resolves.
→ Scope **both** the search input and the item to `#class-label-list-modal-0`.
> **Correction to an earlier fix:** adding `:visible` to `a.dropdown-item` addressed a real hidden
> duplicate but treated a *symptom*. The cause was row scoping. This trap resisted four debug
> rounds before that was found.

**4. Bootstrap custom-control checkboxes must be clicked via their `<label>`.** The
`label.custom-control-label` overlays the input and intercepts pointer events, so clicking the
input times out with *"\<label …\> intercepts pointer events"*. Applies to the copy-options
checkboxes (`copyTeachersLabel` / `copyMaterialsLabel`).

**5. Several buttons are "disabled" by CSS class only** — no native `disabled` attribute — so a
click before Angular's async validation settles **silently no-ops with no thrown error**. Confirmed
on **"Apply changes"** in the teacher modal and the **bulk-toolbar Start/End date** buttons. Use a
single click plus a generous wait on the observable outcome (the modal closing, the value landing).
**Never a retry-click loop** — a second click while the first is still processing risks
double-applying.

**6. Angular inputs can silently DROP a keystroke.** Proven on the teacher-email field: applied
`…mailsac.co` instead of `…com`. Type, **read the value back**, retype if it does not match (up to
3×). `set_teacherEmail` does this.

**7. Applying a bulk toolbar date CLEARS the row selection** (*"All selected"* → *"0 Selected"*),
re-disabling the toolbar. A second consecutive bulk action therefore does nothing unless the row is
**re-selected** in between. This is why one TC's end-date leg failed after its start-date leg
succeeded. Expect the same for bulk Add teacher / Add labels / Add Material.

**8. Duplicate appends the copy AFTER THE LAST FILLED ROW**, not adjacent to the source — so the
copy's row index depends on how many rows are filled. The *"Apply the labels to new classes too?"*
dialog appears **only when the source row has a label**; ticking *"Include labels in these classes"*
then Continue copies it.

**9. CSV upload POPULATES the form — it does NOT create classes.** Probed live with a one-row
throwaway CSV: the row appeared on the form, the Create button still read *"Create 1 class"*, and
nothing was created. Creation still requires clicking Create, which makes CSV-upload tests
side-effect free. The hidden `input[qid='dBulkClass-54']` takes files directly via
`action.setInputFiles` — **no need to click "Upload file" first** (same as the NEMO uploader).

**10. "Create more classes" is the ONLY path that returns a genuinely empty form**
(`rowName`/`rowStart`/`rowEnd` all `""`). Everywhere else the draft is restored.

**11. "Copy an Existing Class" is a 2-STEP wizard sharing ONE Continue selector**
(`dBulkClass-copy-from-modal-4`) across both steps — each transition must be waited on via that
step's own controls. Step-2 options are enabled **only when the source class has items of that
kind** (labels show counts: *"Teachers [1]"* vs a disabled *"Assignments [0]"*). The copy does
**not** overwrite the row's own name or dates; it fills teachers/materials and records the source
in a *"Copied from a class"* cell.

**12. The copy-from class search has a binding race.** The input can be visible before Angular
binds its keystroke handler, so the text lands but **no search runs** — symptom: the correct value
in the search box next to an unfiltered ~20-row list. Fix: wait for the **default result list** to
render before typing. Implemented in `click_toolbarCopyExistingClass`.
> An earlier theory blamed a dropped keystroke; a diagnostic disproved it (the box held the exact
> text). `walkthrough_2026-08-18.md` part 1 still carries the stale theory — parts 5+ have the
> correction.

**13. Owl date-pickers open on the month of the currently-selected value.** A leftover end date far
in the future makes the end-date picker open on a month with nothing disabled — so a
disabled-cell assertion silently reads a different month than intended.

**14. The materials modal's loading state renders the words "No search results"** — word-for-word
identical to a genuine empty result. See *Add materials* below; this one cost five runs.

**15. The success dialog is pre-rendered and hidden** (`#successCreateClassesModal`) before any
class is created — so both its links (`dBulkClass-47` Back to dashboard, `dBulkClass-48` Create
more classes) were captured at **zero created classes**. Worth remembering for other dialog-gated
selectors on this form.

---

## Add materials — the one that cost five runs

Opening the modal fires **exactly one** `POST …/products` returning the whole catalogue (~800
options at once). Typing fires **no further requests** (verified by counting network traffic while
typing 16 characters). Filtering is **client-side and measured at 1 ms**.

Until that call returns, the dropdown shows **"No search results"** next to a spinner. The test was
typing into an empty catalogue, and *no amount of waiting on the filtered item could help* — the
filter had already run against nothing.

**Two different waits, because there are two different things:**

| Step | Wait | Budget | Why |
|---|---|---|---|
| Catalogue arrives | `waitForExist` | 60 s | a server call |
| Type + read back | — | — | verifies the term landed |
| Filtered match | `waitForDisplayed` | **5 s** | client-side, ~1 ms |

`waitForExist`, **not** `waitForDisplayed`: before typing, the options are in the DOM but
**invisible** (measured 808 present, 0 visible) because the dropdown is closed — a visibility wait
there hangs forever.

> **A long wait aimed at the wrong signal hid the real bug.** The 90 s budget was not merely too
> big; failing fast is what surfaced the truth. It also pushed the test past mocha's 120 s once the
> click's own 30 s default was added, turning a precise failure into a generic runner timeout.

`select_material` also clears, types, **reads the value back and compares**, retrying up to 3× —
after a duplicated first character (`ddev_test_ebook_bundle…`) was observed. A mistyped term is an
automation defect and must never be reported as a product one.

> `materialItem` was once page-wide `a.dropdown-item` and matched the **header profile menu** — up
> to **885 elements**. Now scoped to `#addLearningMaterialModal`.

---

## Product behaviour (for manual test design)

- **Class creation is ASYNCHRONOUS.** The success dialog says *"Success! We are now creating 1
  class for you"* and warns it *"can take up to 12 hours"*. Measured: dialog ~5 s, class visible in
  the Active list **~24 s** on a responsive Thor, **>90 s** on a loaded one. **The active-class
  count does not increment immediately** — verify by the dialog, never by `count + 1`.
- **The success dialog's two buttons are mutually exclusive** — either dismisses it — so covering
  both legs requires **two separate class creations**.
- **"Back to dashboard" returns to the school Classes page** (`/admin/admin/org_<slug>/class`), not
  the top-level *My school accounts* list.
- **CSV template**: 14 columns, UTF-8 BOM — `Class name, Start date DD/MM/YYYY,
  End date DD/MM/YYYY, Teacher 1..10 (optional), Student progress data`, plus one sample row.
  Filename `Class_creation_form_template.csv`. **There is no course-material column**, which is why
  CSV-created classes cannot be used for grade-settings work.
- **Dates go in as `DD/MM/YYYY` and render as `Tue, Sep 15, 2026`** — assert the DISPLAY form.
- **The end-date year picker caps at 2036**; every later year is disabled.
- Teacher modal fields: Email (required) + optional First/Last name → *Apply changes*, with an
  *"only apply to this class"* note.

## Automation coverage

All 16 manual `BCCF` cases are automated, split across three suites by side-effect profile:

| Suite | npm script | TCs | Creates classes? |
|---|---|---|---|
| Bulk positives | `P1AdminclassBulk_Thor` | 11 | **No** |
| Create workflow | `P1Adminclassworkflow_Thor` | 16 | **Yes — 2 per run** |
| Edge/Negative validation | `P1AdminclassValidation_Thor` | 6 | No |
| CSV end-to-end | `P1AdminclassBulkCreateCSV_Thor` | 7 | **Yes — 2 per run, by design** |

`TST_CCLS_TC_23` (the reset) runs in **`BeforeEach`** for the bulk and validation suites — every TC
there is independent — and **once in the `Test` list** for the workflow suite, whose TCs
deliberately accumulate onto one row (name → dates → label → teacher → material → Create). One TC,
two placements: that split is the whole reason the reset is its own composable unit (ADR-019).

## Data notes

- `TST_CCLS_TC_21` depends on `copySourceClass` = *"cqa test class 17aug2026 1"* existing in the
  target school **with ≥1 teacher and ≥1 course material** — the copy options are disabled
  otherwise. It has a dated name, so it may eventually be cleaned up; swap the value in
  `schoolAdminAddClassData.json` if the test starts failing on *"source class could not be
  selected"*.
- See `admin-shared.md` §A7 for which suites leave classes behind and the `BulkCSV_Class_1` vs
  `BulkCSV_Class1` naming trap.

## Open items

- `input[qid='dBulkClass-add-learning-material-modal-1-0']` still carries a **hardcoded positional
  index** (trap 2's family). It resolves today; it broke once when the draft's row count changed.
- Phase 3 (visual) is still ⬜ pending for the bulk and validation suites, and for the workflow
  suite's later TCs (`TC_20`, `TC_23`).

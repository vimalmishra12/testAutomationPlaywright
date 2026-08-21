---
name: c1-manual-test-authoring
description: >
  Designing MANUAL functional test cases for Cambridge One / Builder from product scenarios, before
  any automation exists. Use whenever the user supplies scenarios, a requirements list, a
  scenario spreadsheet (e.g. AdminApp.xlsx), a Jira ticket with acceptance criteria, or points at a
  screen/tab and asks for test cases to be written or extended. Also use when updating an existing
  manual register — statuses, actual results, corrected steps, resolved [ASSUMED] items, or the
  rolled-up summary. Produces BOTH a Markdown document and an .xlsx register under test/Manual/.
  Trigger on any mention of: manual test cases, write test cases, create test cases from scenarios,
  test case design, test scenarios, scenario to test case, requirement coverage map, traceability
  matrix, manual register, test case document, xlsx register, npm run register, mark test case
  Pass/Fail/Blocked, [ASSUMED] expected result, boundary/edge case design, AdminApp.xlsx, batch of
  test cases, TST_ id, module code. If the request is to AUTOMATE test cases that already exist,
  use c1-test-authoring instead — this skill hands off to it.
---

# C1 Manual Test Case Authoring Skill

**Deliverable:** one manual functional test-case set, emitted as **both** a Markdown document
**and** an `.xlsx` register, under `test/Manual/<App>/<Area>/`. Both are required — the `.md` is
the readable artefact and the review surface; the `.xlsx` is the execution register.

**This is the FIRST step of the pipeline:**

```
scenarios  →  [THIS SKILL]  →  manual TCs (.md + .xlsx)  →  c1-test-authoring  →  automation
```

Errors caught here are the cheapest in the whole pipeline. Errors left here become wrong automated
tests that pass — Phase 1 shipped two manual cases whose steps were simply wrong ("click a listed
class" — the class name is not clickable), and they survived weeks of automation work before anyone
noticed.

---

## What this skill is NOT

- **Not automation.** Once the cases exist and the user wants them automated → `c1-test-authoring`.
- **Not a format-only exercise.** `manual-test-standard.md` gives the columns and the ID rules.
  This skill adds the two things that actually determine quality: **live grounding** and
  **automation-awareness**.

---

## Load order — read these before writing a single test case

| # | Read | For |
|---|---|---|
| 1 | `.architecture/manual-test-standard.md` | Columns, `TST_<MOD>_TC_<N>` convention, Type/Priority values, ordering, flat vs traceability structure |
| 2 | `.architecture/product-knowledge.md` → the per-app file → **the feature-area file** | What the product actually does |
| 3 | **Admin App tasks: `product-knowledge/ExperienceApp/admin-shared.md` — Part A** | Navigation, field caps, async/persistence, shared-school blockers, verified copy, fixtures, and §A8's rules for admin manual cases. **Part B is automation detail — skip it here.** |
| 4 | `AGENTS.md` Rule 6 (naming) | Module codes — see golden rule 3 |
| 5 | `.agent/skills/c1-manual-test-authoring/reference/document-template.md` | The exact output structure, when you reach step 3 |

Do **not** load the `c1-test-authoring` phase files. Wrong layer.

---

## Golden rules

**1. Ground on the LIVE app before writing. A document written against an empty state is a
hypothesis, not a spec.**
This is the highest-value rule in the skill and it is evidence-backed twice over: `GCAT_TC_7` and
`GSCL_TC_7` both carried the step *"click a listed class"*, written from a details page that had
zero classes on it — there is no clickable class name, the row has a dedicated link. A third case
claimed *"Cancel does not reset the form"*; Cancel actually raises a confirmation modal nobody had
looked for. **Ground on a POPULATED state**, or mark the expected result `[ASSUMED]` and list it in
Open items. If live access is blocked, say so and agree how to proceed — do not quietly infer.

**2. Never invent expected copy.** Capture it verbatim, or mark it `[ASSUMED]`.
> **Capture it for free.** Almost every admin dialog is **pre-rendered in the DOM before it is ever
> triggered**, so its copy can be read *without reaching the state that raises it*. This has already
> resolved three `[ASSUMED]`s at zero data cost — including two max-limit modals that would
> otherwise have required filling a shared school to its cap. Try this before writing `[ASSUMED]`.

**3. Choose a module code that will survive automation.**
`<MOD>` must be derived from the **page object the screen will get** (AGENTS.md Rule 6) — not from
the manual batch, and never from the ticket number. Phase 1 invented `BCCF` for the bulk-create
form; automation had to use `CCLS` (the `createClasses` page object), so 16 manual cases now map to
a different module's ids and the mapping survives only as prose in Remarks cells. Ask "what will the
page object be called?" *before* assigning the code.

**4. Mark design-time blockers as `Blocked`, not `Not Run`.**
If a case's precondition cannot be met on the target environment, it is Blocked **on the day it is
written**, with the reason and the unblock options in Comments. `TST_GCAT_TC_4` and `TST_GSCL_TC_4`
(maximum categories / scales) need a school already at its cap; the shared school cannot be held
there. Both sat mislabelled for weeks.

**5. Read field constraints before writing boundary cases.**
`maxlength`, patterns, pickers, date ceilings. None of these appeared in the Phase 1 manual cases
and every one was found later by automation breaking — the grading-scale title's `maxlength="20"`
cost a full 6-failure run, and **GSCL still has no boundary case for it** while GCAT has one for its
50-char field. See `admin-shared.md` §A3 for what is already known.

**6. Emit BOTH `.md` and `.xlsx`, and make them agree.**
They drifted repeatedly. Use `npm run register` (`tooling/xlsxRegister.js`) for every `.xlsx` write —
it verifies each write by reading the saved file back, reports any cell that changed as a side
effect, and refuses to run while the workbook is open in Excel. Never hand-patch the zip.

**7. Do not renumber to insert.** A new case is **appended** with the next `S.No.`, and the
requirement's coverage-map row lists it in the right place. Inserting `TST_CLST_TC_23` after `TC_2`
would have renumbered 79 rows in two files for no gain (user decision, 2026-08-21).

**8. Never overwrite the Tester columns during design.** `Actual Result`, `Status` and
`Comments / Defect ID` are filled by execution. In design they are blank (or carry a design-time
`Blocked` per rule 4).

**9. Roll up the summary.** The header's execution-status block drifts silently — it once read
"55 of 81" for a whole session while per-row statuses had moved on. Recount from the rows.

---

## Step 1 — GROUND

1. **Read the scenario source** (e.g. `AdminApp.xlsx`) and restate the scope back to the user:
   which scenarios are in this batch, which are deferred, and why. Agree it before designing.
   Phase 1 did this every batch and it worked — batches were sized to one screen, one entry path.
2. **Navigate the screen live** and run the *product half* of the reconnaissance checklist
   (`admin-shared.md` §B1 — the product-relevant items):
   - entry path and URL, and whether the screen is reachable by deep link
   - every field: label, type, `maxlength`, pattern, required-ness
   - **every state**: empty, populated, error, loading, max — and which of those you have actually
     seen. **A state you have not seen is `[ASSUMED]`.**
   - dialog/banner copy, captured verbatim (see golden rule 2's free-capture note)
   - what is async, what persists, what is shared
3. **Write the Product reference section as you go**, dated and attributed
   (`captured live <date>, <env> · <school/account>`). This section is what makes the document
   reviewable by someone who cannot open the app.
4. **Promote durable findings into product knowledge**, not just into this document — the per-screen
   file, or `admin-shared.md` if it generalises across screens.

## Step 2 — DESIGN

1. **Choose the structure** per `manual-test-standard.md`:
   - **AC-driven ticket** → full traceability structure (Traceability Matrix + Test Cases, compound
     `AC<n>.UC<n>.S<n>.TC<n>` in Linked Requirement).
   - **Scenario list** (the Admin App pattern) → the **grouped-by-Linked-Requirement** structure:
     all TCs for a scenario contiguous, **Positive → Edge → Negative within each group**, `S.No.`
     sequential across the whole document, Test Case IDs stable and therefore out of numeric
     sequence within a group.
     > This deliberately departs from `manual-test-standard.md`'s *global* P→E→N ordering, by user
     > preference. It is the format in `AdminApp_Classes_tab_test_cases.md` — follow it.
2. **Assign the module code** (golden rule 3) and number `TST_<MOD>_TC_<N>` sequentially.
3. **Write each case** into the 14 fields. Titles use
   **"Verify \<expected outcome\> when \<condition\>"**. Steps are numbered and atomic. Expected
   Result names the *thing checked*, quoting product copy verbatim where copy is the point.
4. **Cover the states you found in step 1** — especially the empty state, the max/limit state, and
   the boundary of every capped field.
5. **Mark as you go:** `[ASSUMED]` on anything unverified; `<PLACEHOLDER>` on environment-specific
   values with a note in Remarks; `Blocked` per golden rule 4.
6. **Build the Requirement → Test Case coverage map** — every scenario must have ≥1 TC, and the map
   is how that is proven. If a scenario has none, say so explicitly rather than leaving a gap.

## Step 3 — EMIT & REGISTER

1. Write the `.md` per `reference/document-template.md`.
2. Write/update the `.xlsx` — same 14 columns, one row per TC — via `npm run register`.
3. **Verify they agree:** total TCs, the Positive/Edge/Negative split, and the status tally.
   State the counts in your reply.
4. Update the header's execution-status block (golden rule 9).
5. Any CSV fixture goes alongside, named `<TST_ID>_<short_description>.csv`, in the **real upload
   template format** (exact headers, verified against a downloaded template).

---

## Exit checklist (mandatory)

- [ ] Scope agreed with the user before designing; deferred scenarios named.
- [ ] Every case grounded live, **or** its expected result marked `[ASSUMED]` and listed in Open items.
- [ ] Product reference section written, dated, with env + school/account.
- [ ] Module code chosen by the future page object (Rule 6), and stated in the header.
- [ ] Every capped field has a boundary case, or the gap is flagged.
- [ ] Design-time blockers marked `Blocked` with reason + unblock options.
- [ ] Coverage map complete — every scenario has ≥1 TC.
- [ ] **Both `.md` and `.xlsx` written and in agreement**; `.xlsx` via `npm run register`.
- [ ] Header summary recounted from the rows.
- [ ] Durable product findings promoted into product knowledge, not left only in this document.
- [ ] Session walkthrough written/appended (AGENTS.md §Walkthrough).
- [ ] **Handoff stated** — see below.

## Handoff to automation

Close by telling the user, explicitly:

- the **module code** and the page object it implies;
- which cases are **Blocked** and what would unblock them;
- which expected results are still **`[ASSUMED]`** and need live confirmation during Phase 1;
- which cases will **create or delete real data**, since that decides suite placement
  (`c1-test-authoring` keeps side-effect-free suites apart from data-creating ones);
- that automation continues in **`c1-test-authoring` Phase 1**.

---

## Don'ts

- ❌ Write an expected result from a state you have not seen without marking it `[ASSUMED]`.
- ❌ Invent product copy, error messages, or limits.
- ❌ Derive the module code from the manual batch or the ticket number.
- ❌ Emit only the `.md` (or only the `.xlsx`).
- ❌ Hand-patch `xl/worksheets/sheet1.xml` inside the workbook zip — that technique is retired.
- ❌ Edit the workbook while it is open in Excel.
- ❌ Renumber existing rows to insert a new case.
- ❌ Fill `Actual Result` / `Status` / `Comments` during design (except a design-time `Blocked`).
- ❌ Mark a case `Pass` on the strength of automation that has not actually run green.

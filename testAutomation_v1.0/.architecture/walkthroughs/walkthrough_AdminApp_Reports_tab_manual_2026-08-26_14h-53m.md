# Walkthrough — AdminApp Reports tab, manual test-case authoring (Batch 1)

**Date:** 2026-08-26 · **Skill:** `c1-manual-test-authoring`
**Source:** `C:\Users\Compro\Desktop\Admin Automation\AdminApp_Report tab.xlsx` (13 scenarios)
**Deliverable:** `test/Manual/C1App/AdminApp-Reports/` — 39 manual TCs, module `MRPT`
**Environment grounded on:** Thor · `Cqa Test Ashish School 1` (`VED-NEH-KVU`,
org `org_cup_j9GskaJJmvDjmQZ9`) · `cqatestashish_admin@mailsac.com`

---

## What was done

1. Read the skill, `manual-test-standard.md`, `admin-shared.md` Part A, and AGENTS.md Rule 6.
2. Read the scenario workbook, restated scope, and agreed both the grounding approach and the
   target school with the user before designing anything.
3. **Grounded live** on the Reports tab and the full Create report flow.
4. Designed 39 TCs (21 Positive · 11 Edge · 7 Negative), grouped by Linked Requirement.
5. Emitted `.md` + `.xlsx`, seeded a new product-knowledge file, and registered it in both indexes.

---

## Decisions worth keeping

**Module code `MRPT`, chosen before any case was written.** Derived from the page object the screen
will get (`manageReports.page.js`) per AGENTS.md Rule 6 — and `MRPT` is that rule's own worked
example. Manual and automation codes therefore agree from the start, as the Students batch achieved
and the `BCCF` → `CCLS` batch did not.

**Both artefacts generated from one source.** `_tcdata.js` holds the 39 cases; `_generate.js` emits
the `.md` and the `.xlsx` from it. Golden rule 6 (the two must agree) is then structural rather than
a discipline problem — the registers have drifted repeatedly in past batches. The `.xlsx` was
verified afterwards through the repo's own `tooling/xlsxRegister.js`.
*Open question for the user: these two `_*.js` files are not part of the documented area-folder
structure (`.md` + `.xlsx` + CSVs). They were kept because deleting them makes future edits
drift-prone again.*

**Product surface with no scenario behind it got its own groups.** Three cases cover things the
scenario list does not mention: the seventh report type and the two error dialogs. Rather than
silently folding them into an existing scenario, they were kept separate so the coverage map stays
honest about what came from the source and what did not.

**Then the requester confirmed the seventh report type was a genuine miss** — so `Estimated CEFR
level` was promoted from "added coverage" to a first-class scenario **#14**, sitting alongside
#6–#11 with the other report types. The two error dialogs remain added coverage, now **#15**.
`TST_MRPT_TC_37` kept its ID through the move (golden rule 7 — never renumber to insert), and the
source workbook now owes a 14th scenario row so the two registers agree.

---

## What the live grounding actually changed

Grounding was not a formality here — it produced facts that would have been wrong if assumed:

- **There are seven report types, not six.** `Estimated CEFR level` supports neither a custom date
  range nor custom grade settings, which fully explains its absence from scenarios #12 and #13 —
  **but not its absence from #6–#11, which turned out to be a genuine gap in the source workbook.**
  Verified by cycling all seven types and reading the disabled state of the controls.
  The trap: because the two capability lists *were* correct, the missing seventh type looked
  deliberate. **Count the live dropdown against the scenario list before designing.**
- **The capability matrix confirms the scenario list exactly** — four date-capable types (scenario
  #12), six grade-capable types (scenario #13). Without checking, the natural assumption would have
  been that all types support both, and TC_33 / TC_36 (the negative halves) would not exist.
- **Both date fields are `readOnly`.** This deletes an entire family of "type an invalid date"
  negative cases before they are written.
- **Date bounds read off the attributes:** start floor 2022-01-01, both capped at today, end floor
  tracking the start. Exactly the §A3 constraints-before-boundaries rule, and none of it guessable.
- **The footer action bar does not exist at zero selection** — absent from the DOM, not disabled. A
  case asserting "Continue is disabled" would fail to find the element.
- **There are two separate Cancel controls**, one per step. Scenario #5 says "Verify Cancel button
  functionality" — singular. It needed three cases, not one.

## The near-miss worth recording

The pre-rendered DOM showed `ADMIN.CREATE_REPORT.null` and `ADMIN.REPORT.undefined` in two dialogs,
plus a literal `{{totalClasses}}` and a `NaN undefined`. Given that the Students batch found genuine
untranslated i18n keys the same way, these looked like the same defect and were nearly written up as
one. **Submitting a real report showed them resolving correctly** — the dialog read "your **Class
summary** report". They are un-instantiated Angular bindings in an unrendered template.

The lesson generalises and has been promoted into the new knowledge file: **§A6's free-capture trick
gives you the copy skeleton for free, but any interpolated part of that copy shows as a
placeholder.** Do not assert on the pre-rendered form, and do not raise placeholders as defects
without triggering the state.

---

## Blockers and honest gaps

**3 cases Blocked at design time** (not Not Run), per golden rule 4:

| Case | Reason | Unblock |
|---|---|---|
| `TST_MRPT_TC_17` | school holds 6 classes, cap is 1500 | a school seeded with >1500 classes |
| `TST_MRPT_TC_38` | generation failure cannot be forced on Thor | fault injection / stubbed failure |
| `TST_MRPT_TC_39` | needs a partially-failing multi-class report | fault injection |

Both error-dialog cases nonetheless carry **verified** expected copy, captured from the pre-rendered
DOM without reaching the state.

**11 open `[ASSUMED]` items** are listed in the document. The two that matter most:

- **Search semantics** — substring (Classes tab) or fuzzy (Library tab)? `admin-shared.md` §A4 warns
  explicitly not to inherit one tab's expectation onto another. Left `[ASSUMED]` rather than guessed.
- **`Clear all` in the filter panel** — applies immediately, or still needs `Apply`?

**Grounding stopped short of two things**, and the cases say so rather than inventing an answer:
no report *file* was ever opened, so scenarios #6–#11 are verified only to the point of a
downloadable row; and the `Items` / `Date range` cell values for the custom-grade and custom-window
variants were not captured, because the step-2 dialog stopped re-opening for synthetically driven
selections late in the session.

---

## Automation traps found (promoted to `admin-reports-tab.md` §8)

- Synthetic clicks — including a full pointer-event dispatch — do **not** drive this screen's Angular
  buttons. The checkbox toggles and the footer updates, but `Continue` then no-ops.
- The footer bar is **invisible to the accessibility tree** while being fully visible, not
  `aria-hidden` and not `inert`.
- `qid` typos on the Reports tab: `aReport=10` / `aReport=11` use `=` where everything else uses `-`.
- Row checkbox `name` attributes are class **UUIDs** (stable); their `qid`s are **positional**.
- `offsetParent` is useless for visibility here — the panel and both dialogs are fixed-position.

---

## Handoff to automation (`c1-test-authoring` Phase 1)

- **Module `MRPT`** → page object `manageReports.page.js`, selectors under
  `css.ComproC1.manageReports`.
- **Side-effecting cases:** `TST_MRPT_TC_21`–`TC_26`, `TC_28`, `TC_35`, `TC_37` create real reports
  (60-day expiry). They must not share a suite with the side-effect-free cases.
- **Confirm the `[ASSUMED]` items during Phase 1** — the search semantics and `Clear all` first.
- **`Estimated CEFR level` is IN SCOPE** — confirmed 2026-08-26. Automate `TST_MRPT_TC_37` with the
  other report types, and add the missing 14th scenario row to `AdminApp_Report tab.xlsx`.

## Files touched

| File | Change |
|---|---|
| `test/Manual/C1App/AdminApp-Reports/AdminApp_Reports_tab_test_cases.md` | new — 39 TCs |
| `test/Manual/C1App/AdminApp-Reports/AdminApp_Reports_tab_test_cases.xlsx` | new — 14-column register |
| `test/Manual/C1App/AdminApp-Reports/_tcdata.js`, `_generate.js` | new — single source + generator |
| `.architecture/product-knowledge/ExperienceApp/admin-reports-tab.md` | new — feature-area knowledge |
| `.architecture/product-knowledge/ExperienceApp.md` | Reports tab row added to the screen→file map |
| `.architecture/product-knowledge/ExperienceApp/admin-shared.md` | Reports tab row added to §A2 |

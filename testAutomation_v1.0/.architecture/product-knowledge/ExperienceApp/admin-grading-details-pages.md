# Admin App — Grading scale / category “classes using this” details pages

> **Migrated from [`../ExperienceApp.md`](../ExperienceApp.md) on [2026-08-21] under ADR-020**
> (product knowledge splits per feature area). **The content below is unchanged** — this was a
> pure move, verified byte-identical. Append here from now on, not to the app file.
>
> **Read [`admin-shared.md`](admin-shared.md) first.** It carries what is true of *every* admin
> screen — navigation, pre-rendered modals, positional ids, CSS-only-disabled buttons, Angular
> typing, measured timings, the visual-testing verdict — and is not repeated here.

---

#### Feature: The "classes using this" lists on a grading SCALE's and CATEGORY's details page

*Captured live on Thor [2026-08-20], school "3 July Test School 1" / `FCN-CHZ-PDA`, during
Phase 1 of `TST_GSCL_TC_7` (Req #13) and `TST_GCAT_TC_7` (Req #7). Resolves the `[ASSUMED]`
expected result in BOTH manual cases — until now every scale and category anyone had opened
had **zero** classes, so the populated layout had never been seen.*

##### The manual test steps for both TCs were WRONG

Both read *"click a listed class"*. There is **no clickable class name** — the name is plain
text in a `span.item-text`. Each row's only control is a dedicated **"Class grade settings"**
link at the end of the row. Both manual cases corrected.

##### They are NOT the same page — the difference matters

| | Scale details (`grading-scale-details`) | Category details (`grading-category-classes`) |
|---|---|---|
| Heading | `p.classes-heading` → `Classes (N)` | `h2.heading-2` → **`Active classes (N)`** |
| Includes deleted classes? | **YES** | **NO — active only** |
| Columns | name, key, start, end, **status** | name, key only |
| Row link | `a[qid='gradingScaleDetails-3-<n>']` | `a[qid='gradingCategoryClass-3-<n>']` |
| Pagination | `a[qid='gradingScaleDetails-4']` "Load more…", page size 20 | none seen |
| Search / sort | none | `#searchClassText` + `a[qid='gradingCategoryClass-6']`; sort `a[qid='gradingCategoryClass-2']` |
| Destination URL | `…/grade-weighting?gradingScaleId=<id>` | `…/grade-weighting?gradingCategory=<id>` |

**Consequence of the active-only rule:** a category row **vanishes when its class is deleted**.
This is the entire reason `TST_GCAT_TC_7` looked blocked for weeks — all three categories
(`new catagory`, `new Grading Category`, `some`) read `Active classes (0)` simply because every
class they had been applied to had since been soft-deleted. Any TC asserting a category's class
list MUST run before the class is deleted.

**The category page's search bar and sort control render ONLY when the category has ≥1 active
class.** They are absent from an empty details page, which is why the page object written on
2026-08-18 has no model for them.

##### ⚠ The row link is a dead end for a DELETED class

Clicking "Class grade settings" on a scale-details row whose status is `Deleted` does **not**
open grade settings. It **drops the school context entirely**, redirects to *My school accounts*,
and raises a dialog:

> **Sorry!** — *"The item is not available because the class is no longer active"* (Close)

The dialog is a generic `div.modal-content` with `p.modal-title` / `p.modal-description` and
**no `qid`**, rendered on the school-accounts page. This is the product explaining itself, **not
a defect** — but it costs the school context, so a test must recover by re-selecting the school.

##### Addressing rows: use the class KEY, never the name

Two independent reasons, both observed live:
- Class names on this school are already duplicated (many `BulkCSV_Class1` / `AutoClass_CreateOnly`).
- Delete is soft **and the scale page lists deleted classes**, so every CGST run leaves another
  `AutoClass_CGST` row on `new Grading Auto` permanently. Row count only ever grows.

Never assert on `Classes (N)` / `Active classes (N)` as a fixed number either — the school is
shared and mutates mid-session (active classes went 25 → 27 → 32 while this capture was running).

##### Data notes — the permanent fixture class

**`Fixture_GradeSettings_DO_NOT_DELETE`** (key **`62k3-AXm6`**) was created on `FCN-CHZ-PDA`
[2026-08-20] with user approval, specifically so this DOM can be re-captured without re-deriving
the state. Start Aug 20 2026, **end Dec 31 2036**, material `dev_test_ebook_bundle_104_bundle`,
grade settings saved as material 70% + category `some` 30%.

- **Do not delete it**, and do not let a name-prefix sweep match it — the CGST suite sweeps
  `AutoClass_CGST`, which deliberately does not collide.
- **2036 is the product's ceiling, not an arbitrary choice.** The end-date picker's year view
  offers 2026–2036 and disables every other year, so ten years is the most expiry-proofing
  available.
- **The start date must stay in the past.** A future start date makes the class `Not started`,
  and the category details page counts *active* classes only — the fixture would silently stop
  serving its purpose.
- Applying a category requires the class to **have course material**: a class without it shows
  *"You haven't chosen any learning materials yet / Add at least one learning material to start
  customising grade settings for this class"* and the whole page is gated. This rules out every
  automation leftover on the school — `AutoClass_CreateOnly` / `AutoClass_CreateMore` are created
  without material, and the **bulk-CSV template has no material column at all** (class name,
  dates, 10 teachers, progress data), so `BulkCSV_Class*` have none either.

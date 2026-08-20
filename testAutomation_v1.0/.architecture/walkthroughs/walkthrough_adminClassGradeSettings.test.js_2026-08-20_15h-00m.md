# Walkthrough — `adminClassGradeSettings.test.js` (module CGST, Requirement #22)

**Session: 2026-08-20** · Env **thor** · School "3 July Test School 1" / `FCN-CHZ-PDA`
**Outcome: 19/19 passing, confirmed twice (97 s and 92 s). School state clean after every run.**

---

## 1. What was built

New suite **`P1AdminClassGradeSettings_Thor`** covering Requirement #22 (Class grade settings).

| Layer | Artefact |
|---|---|
| npm script | `P1AdminClassGradeSettings_Thor` |
| Exec file | `testExecutionFiles/ExperienceApp/thor/adminClassGradeSettings.json` |
| Test file | `test/ExperienceApp/adminClassGradeSettings.test.js` |
| Page object | `pages/ExperienceApp/classGradeSettings.page.js` (new) |
| Selectors | `css.ComproC1.classGradeSettings` — 61 keys, every one verified live |
| Data | `testcaseData/ExperienceApp/thor/adminClassGradeSettingsData.json` |

**TCs:** `TST_CGST_TC_1..6` are the six manual cases. `TC_7` (sweep leftovers), `TC_8` (poll for
the created class and launch it) and `TC_9` (cleanup) are automation-only helpers with no manual
counterpart — same pattern as `TST_GSCL_TC_13` / `TST_CCLS_TC_23`.

All nine registered `visualTest: false`.

## 2. The data strategy — agreed with the user before any code

CGST modifies a real class's grading config, so §4a of the handoff required agreeing an approach
first. The user proposed, and we built, a **self-contained cycle**:

```
Before  → login
Test    → sweep leftovers → CREATE AutoClass_CGST (with course material) → CGST TCs
After   → DELETE the class
```

Two things make this work rather than merely sound good:

- **The class is created WITH course material.** The per-material Weightage row is what `TC_3`
  and `TC_6` manipulate; a bare class has nothing to weight (consistent with `TST_CLON_TC_3`
  observing "Class grade settings — Not available" for an empty source class).
- **`TC_7` sweeps BEFORE creating, not only after.** Delete is soft, so a crashed run leaves a
  live class behind, and two classes with one name make "the class under test" ambiguous. The
  school already carries duplicate `AutoClass_*` names from exactly this cause.

**Scales/categories belong to other people.** On this school the only options are
`new Grading Auto` and `new catagory`/`new Grading Category`/`some` — all on the "never delete"
list. The user approved *referencing* them, and `TC_2` asserts the scale's own definition is
byte-identical before and after, so "we only associated it, we did not modify it" is proven
rather than assumed.

## 3. Was a same-run create even possible? — measured first

The product warns class creation "can take up to 12 hours", which would have killed the design.
Rather than guess, a throwaway probe was run **before writing any code**:

| Milestone | Elapsed |
|---|---|
| Success dialog | ~5 s |
| Visible in the Active list | **~24 s** |
| Launchable, CGST page working | ~59 s (first attempt, no retry) |

So same-run use is fine. **But this turned out to be a good day** — see §5.

## 4. Six real defects, found over nine runs

Five were in the new code, one in shared pre-existing code.

**1 · The override toggle raises a confirmation dialog.** `#warningForEnableTeacherOverrideScoreModal`
("Are you sure? By turning on this setting…"). Nothing closed it. An unclosed modal is a
full-viewport overlay that blocks every subsequent click **while every read keeps working**, so
four unrelated TCs failed with individually plausible symptoms ("modal did not open", "row not
added", "value not entered"). Cost one full run.

Also measured: while the dialog is open the toggle already reads `checked:true` **but Save stays
disabled** — the change commits only on "Yes, enable". Asserting on the toggle before confirming
would report success for a change that never happened.

**2 · A successful Save opens `#changesSavedConfirmationModal`.** Identical failure mode, cost
another run. `click_saveChanges` now waits for that dialog — a *stronger* success signal than a
disabled Save button, because it is the app's own explicit statement — and closes it via the X,
never "Back to class data" (which navigates away from the page the next TC needs).

**3 · `isInitialized` returned before the Angular form state settled.** `waitForDisplayed` fires
the moment the Save button renders, which is not the moment its disabled binding runs, so a
visibly pristine page briefly reported Save as ENABLED and `TC_1` failed. Now bounded-polls for
the settled state — deliberately short, so a genuinely dirty-on-load form still fails.

**4 · `search_class()` is not idempotent.** It waits for the class list to **change**, so calling
it twice with the same term waits out its full budget and reports failure even though the search
worked perfectly. This broke the `TC_8` poll *and*, one layer down, the cleanup sweep — I fixed
the first and immediately reproduced it in the second. Every call site now clears first.

**5 · Cleanup depended on the very thing that breaks.** `TC_9` re-found the class *by searching*.
When search failed, cleanup failed, and a real class was left on a **shared** school — three
times, hand-cleaned each time. `TC_8` now records the created class's URL and `TC_9` deletes via
that URL directly: no search, no row matching, no list-change wait. The sweep remains a fallback
and a verification pass.

**6 · `select_material` typed before the material catalogue had loaded.** The only change to
shared code, and the one that cost the most. See §5.

## 5. The one that cost five runs — and why it was so hard to see

`TST_CCLS_TC_6` (shared, passes for three other suites) began failing intermittently. Three
hypotheses were wrong before the answer was found **in a screenshot that had been available the
whole time**:

- ~~Typing is corrupted~~ → verified correct, 32/32 characters
- ~~The dropdown needs a click first (Invariant 6)~~ → it opened fine without one
- ~~Every keystroke fires a request~~ → network showed exactly **one** request for 16 characters

The screenshot showed the search term typed perfectly, the dropdown open, **"No search results"**,
and a spinner. That is the whole story:

> **The modal's loading state renders the words "No search results" — word-for-word identical to
> a genuinely empty result.**

Opening the modal fires one `POST …/products` returning the whole catalogue (~800 options at
once); filtering afterwards is client-side and measured at **1 ms**. So the test was typing into
an empty catalogue, and *no amount of waiting on the filtered item could help* — the filter had
already run against nothing.

**Fix — two waits, because there are two different things:**

| Step | Wait | Budget | Why |
|---|---|---|---|
| Catalogue arrives | `waitForExist` | 60 s | a server call |
| Type + read back | — | — | verifies the term landed |
| Filtered match | `waitForDisplayed` | 5 s | client-side, ~1 ms |

`waitForExist`, not `waitForDisplayed`: before typing the options are in the DOM but **invisible**
(measured 808 present, 0 visible) because the dropdown is closed. A visibility wait there hangs
forever.

**The user's own observation is now permanently guarded.** They reported once seeing
`ddev_test_ebook_bundle_104_bundle` — a duplicated first character. `select_material` now clears,
types, **reads the value back and compares**, and retypes up to 3 times, logging what it actually
got. A mistyped term is an automation defect and must never be reported as a product one.

## 6. Two timeout mistakes worth not repeating

**A poll budget set to exactly mocha's `timeout` (120000) is useless** — the runner kills the test
at the same instant the poll expires, so the failure surfaces as a generic "Timeout of 120000ms
exceeded" instead of the TC's own diagnostic message. Made this **twice**: once directly in
`CLASS_APPEAR_TIMEOUT`, once by stacking a 90 s wait on top of the click's own 30 s default.

**And a long wait can be the wrong instinct entirely.** The 90 s material wait was not merely too
big — it was aimed at the wrong signal, and it *hid* the real problem for five runs. The user
called this correctly: "if it types correctly you get it in a few ms — if you want a timeout,
just 5 sec". Failing fast is what surfaced the truth.

## 7. Thor throughput varied ~8x during the session

The same suite, unchanged in the relevant path: **97 s … 12.5 min**. On slow runs the material
type-ahead exceeded 90 s and class creation exceeded 90 s (measured at ~24 s on a good run).

This slowness is **known and accepted** (user, 2026-08-20) — do not raise it as a defect and do
not add retries to shared TCs to paper over it. But it means **a green run proves the code, not
the timings.** Do not tighten any timeout on the strength of one fast run.

## 8. Product knowledge recorded (so this is not re-discovered)

Appended to `product-knowledge/ExperienceApp.md`:

- The full CGST page: selectors, entry path, and that **Class grade settings and Delete class
  share one Actions menu** (which is what lets the suite test then delete without re-navigating).
- **Eleven modals are pre-rendered in the DOM** on this page, all `display:none`. Two
  consequences: any assertion on modal *presence* is a guaranteed false green, and their copy can
  be captured **without triggering them** — including the max-grading-categories limit. The table
  lists each modal's non-committing exit.
- **Total and Save update on BLUR, not keystroke.** Mid-edit the page showed `Total grade: 100%`
  and Save ENABLED while the real total was 600%. A TC that types then immediately asserts
  reports the validation as broken.
- Validation copy confirmed (was `[ASSUMED]`): `Your weighting choices exceed the maximum of 100%`
  and `Please enter a number 0-100`.
- The override dialog is **symmetric** (resolved an `[ASSUMED]`) — same modal id, copy and button
  swap to "Yes, disable".
- **A correction:** an earlier note in this same session claimed "Cancel does not reset the form".
  Wrong — Cancel raises `#cancelChangesWarningModal`, which had not been looked for. Flagged as a
  correction rather than silently edited, since someone may already have read it.
- The Add Materials catalogue behaviour from §5.
- Class-creation latency, and the throughput warning from §7.

## 9. State left behind

**None.** Verified after every run and again at session end: Active classes back to **21** (the
baseline this session started from), no `AutoClass_CGST`, search box empty, no filter applied.
The `AutoClass_CreateOnly` / `CreateMore` rows present belong to the workflow suite, not this one.

Three earlier runs *did* leak a class and a stuck server-side search; each was hand-cleaned at the
time, and defect 5 above is the fix that stopped it recurring.

## 10. Follow-ups (not blocking)

- **`CLASS_APPEAR_TIMEOUT` is at 100 s, near its practical ceiling** — mocha's 120 s must cover
  this poll *and* the launch. If creation regularly needs more, the answer is not a bigger number:
  either raise mocha's timeout (**protected file**, needs confirmation) or split the wait and the
  launch into two TCs so each gets its own budget.
- **`SAVE_TIMEOUT` (20 s) is still a budget, not a measurement** — the real save round-trip was
  never logged. Worth replacing with a measured figure.
- **`TST_GSCL_TC_7` and `TST_GCAT_TC_7` are now genuinely unblocked.** CGST proves a scale and a
  category can be applied to a class. Deliberately left out of this batch.
- `createClasses.materialItem` was page-wide (`a.dropdown-item`) and matched the header profile
  menu — up to 885 elements. Now scoped to the modal. Other page objects may carry similar
  page-wide `.dropdown-item` selectors; not audited.

---
---

# Session 2 — 2026-08-20 (later) · `TST_GSCL_TC_7` + `TST_GCAT_TC_7`

**Outcome: 21/21 passing, confirmed twice (4 min and 3 min). School state clean after every run.**
The suite grew from 19 to 21 TCs; the manual register moved **61 → 63 Pass**.

These are **GSCL and GCAT test cases that run inside the CGST suite.** Their precondition is a
scale / category applied to a *live* class, which only this suite produces. They are registered
in `adminGradingScales.test.js` / `adminGradingCategories.test.js` — ownership follows the page
object (AGENTS.md Rule 6) — and listed in `adminClassGradeSettings.json` after `TST_CGST_TC_6`,
before the `After` block's `TST_CGST_TC_9` (the delete).

## 1. Why these sat blocked for weeks, and what actually unblocked them

Both manual cases carried `[ASSUMED]` expected results with the note *"pending a scale/category
applied to a class"*. The real obstacle was subtler than "nobody applied one":

**The category details page counts ACTIVE classes only.** Every category on `FCN-CHZ-PDA` read
`Active classes (0)` — not because no category had ever been applied to a class, but because
every class they had been applied to had since been **soft-deleted**. The evidence erases itself.
The scales page does *not* behave this way: it lists deleted classes too, which is why
`new Grading Auto` showed `Classes (2)` (two dead `AutoClass_CGST` rows from earlier runs) while
the category `some` showed zero, despite both being applied by the same suite on the same class.

So the two pages are **not symmetric**, and assuming they were would have produced a page object
that worked for one and silently failed for the other.

| | Scale details (`grading-scale-details`) | Category details (`grading-category-classes`) |
|---|---|---|
| Heading | `p.classes-heading` → `Classes (N)` | `h2.heading-2` → `Active classes (N)` |
| Lists deleted classes | **yes** | **no** |
| Columns | name, key, start, end, status | name, key |
| Row link | `a[qid='gradingScaleDetails-3-<n>']` | `a[qid='gradingCategoryClass-3-<n>']` |
| Load more | `a[qid='gradingScaleDetails-4']`, page size 20 | none |
| Search / sort | none | `#searchClassText`, `gradingCategoryClass-6`, sort `-2` |

## 2. The manual test steps were wrong

Both read *"click a listed class"*. There is **no clickable class name** — the name is plain text
in a `span.item-text`; the row's only control is a dedicated **"Class grade settings"** link. The
step had been written from a details page that had no classes on it, so nobody had ever seen the
populated layout. Both manual cases corrected in the `.md` and the `.xlsx`.

*Lesson, and it is the same one as last session's "Cancel does not reset the form" correction:*
**a document written against an empty state is a hypothesis, not a spec.**

## 3. The fixture, and the data problem behind it

Capture needed a category applied to a live class, and nothing on the school could provide it:

- All three categories read `Active classes (0)`.
- Every automation leftover **has no course material**, and the grade settings page is fully gated
  without it (*"You haven't chosen any learning materials yet"*). `AutoClass_CreateOnly` /
  `AutoClass_CreateMore` are created without material, and the **bulk-CSV template has no material
  column at all** — so `BulkCSV_Class*` have none either.
- The only active classes with material belong to other people.

Agreed with the user, so **`Fixture_GradeSettings_DO_NOT_DELETE`** (key `62k3-AXm6`) was created:
start Aug 20 2026, end **Dec 31 2036**, material `dev_test_ebook_bundle_104_bundle`, grade
settings saved at material 70% + category `some` 30%.

Two constraints worth recording, both discovered while creating it:
- **2036 is the product's ceiling.** The end-date year picker offers 2026–2036 and disables every
  other year. Ten years is the most expiry-proofing available.
- **The start date must stay in the past.** A future start makes the class `Not started`, and the
  category page counts *active* classes — the fixture would silently stop working.

**The fixture is not used by any test.** Both TCs use the class the CGST suite creates and
deletes. Its only job is to make this DOM re-capturable without re-deriving the state.

## 4. Why the class key is resolved at runtime

The obvious design — put the class name in test data and match rows by it — is wrong here:

- The class is created by the run, so its key does not exist beforehand.
- Class names on this school are **already duplicated**, and every past CGST run leaves another
  soft-deleted `AutoClass_CGST` row on the scale's page **permanently**.

So each TC searches the Classes tab, asserts **exactly one ACTIVE class** with that name, and
takes its key. If a concurrent run creates a second one, the TC fails loudly instead of quietly
testing the wrong class. (The school does mutate under you — active classes went 25 → 27 → 32
during this session's capture alone.) For the same reason, **nothing asserts on `Classes (N)`**.

## 5. The one defect, and why it was self-inflicted

First run: **19 passing / 2 failing**, both new TCs, both at the same line —
*"The class search did not settle"*.

`search_class()` is **not idempotent**: it waits for the class list to *change*. The search term
**persists server-side**. `TST_CGST_TC_8` had already searched the same class name and never
cleared it, so by the time the new TCs ran the list was still filtered to it; re-typing the same
term changed nothing, the wait burned its full 20 s budget, and it reported failure although the
search had worked perfectly.

This is **trap 4 in the previous session's own handoff**, verbatim: *"Clear before every search."*
Fix: `clear_search()` before `search_class()` in both TCs — the documented remedy and the pattern
`TC_8`/`TC_9` already use. Then 21/21, twice.

*Lesson: the trap list was read and still not applied. A known trap only helps if it is checked
against the code being written, not just read at session start.*

## 6. Also captured

- **Clicking the row link on a DELETED class is a dead end.** It drops the school context, lands
  on *My school accounts*, and raises *"Sorry! — The item is not available because the class is no
  longer active"* (a generic `div.modal-content`, `p.modal-title` / `p.modal-description`, **no
  `qid`**). This is the product explaining itself, **not a defect** — but it is why
  `TST_GSCL_TC_7` explicitly asserts `status === "Active"` before clicking, and why both TCs must
  run before the suite's delete step.
- The category page's **search bar and sort control render only when the category has ≥1 active
  class**, which is why the page object written on 2026-08-18 has no model for them.
- Destination URLs differ by entry point: `?gradingScaleId=<id>` vs `?gradingCategory=<id>`.

## 7. Open / follow-ups

- **Phase 3 (visual) is DONE** — assessed, both stay `visualTest: false`: each ends on a class
  created fresh in the run (key and dates differ every time) and passes through a details page
  framing the shared school's live, growing class list. ❌-row data on both counts, so they stay
  false with no prompt needed (Invariant 12).
- **`seedAdminFixtures_<env>.json` was agreed but NOT built.** It is blocked on a real gap, not
  effort: `createClasses.set_endDate()` is hardcoded to "day 15 of next month", so a seeded
  fixture would expire inside a month and lose its whole purpose. Needs an **additive**
  data-driven end-date method on `createClasses.page.js` (shared by four green suites — add
  alongside `set_endDate`, never modify it) plus datepicker selectors for the period button and
  the year/month cells. Deliberately not started as a side effect of a capture task.
- The header summary in the manual `.md` was **stale** — it still read "55 of 81" dated
  2026-08-19, having never been rolled up when CGST's six landed. Corrected to 63 of 81. Worth a
  glance each session; the per-row statuses and the summary drift apart silently.

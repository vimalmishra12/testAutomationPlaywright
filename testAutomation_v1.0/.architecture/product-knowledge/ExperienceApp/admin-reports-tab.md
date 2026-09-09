# Feature area: Reports tab and the Create report flow (school-admin)

> **Read [`admin-shared.md`](admin-shared.md) first** — Part A for manual test design, Part A + B for
> automation (ADR-020).
>
> **Living document.** Append, never overwrite. Mark anything not verified on the live app as
> `[ASSUMED]` and promote to confirmed once observed. Date significant updates `[YYYY-MM-DD]`.

**Manual module:** `MRPT` · **Automation module:** `MRPT` (they agree from the start)
**Future page object:** `manageReports.page.js` (AGENTS.md Rule 6 — `MRPT` is that rule's own worked example)
**Manual test cases:** `test/Manual/C1App/AdminApp-Reports/AdminApp_Reports_tab_test_cases.md` + `.xlsx` (39 TCs)

*First seeded: [2026-08-26], captured live on Thor · `Cqa Test Ashish School 1` (`VED-NEH-KVU`,
org slug `org_cup_j9GskaJJmvDjmQZ9`) · account `cqatestashish_admin@mailsac.com`.*

---

## 1. Navigation

```
School <name>  →  left nav: CLASSES · STUDENTS · STAFF · LIBRARY · REPORTS
     └─ REPORTS                /admin/admin/org_<slug>/reports
          └─ "Create report"   /admin/admin/org_<slug>/reports/create
               ├─ step 1  class selection  (search · filter · checkboxes · Cancel / Continue)
               └─ step 2  "Create report" dialog
                          (report type · grade option · date range · Cancel / Submit)
```

> **`/reports/create` IS reachable by deep link once the school context is set** `[2026-08-26]` —
> unlike the class pages, which return `/dashboard/error` when deep-linked (`admin-shared.md` §A1).
> The context must still be established by clicking the school card first. **This is the first
> admin screen found to break the deep-link rule**, so do not generalise either way without testing.

---

## 2. The report-type capability matrix — the central fact of this screen

**Seven report types, not six.** All verified live `[2026-08-26]` by selecting each in turn and
reading the disabled state of the controls:

| # | Report type | Custom date range | Custom grade settings |
|---|---|---|---|
| 1 | Class summary | ✅ | ✅ |
| 2 | Class detailed data | ✅ | ✅ |
| 3 | Class daily data | ✅ | ✅ |
| 4 | Aggregated data | ✅ | ✅ |
| 5 | Assignments summary | ❌ | ✅ |
| 6 | Assignments detailed data | ❌ | ✅ |
| 7 | **Estimated CEFR level** | ❌ | ❌ |

The source scenario workbook (`AdminApp_Report tab.xlsx`) names **four** types for custom date range
and **six** for custom grade settings — both lists are exactly right. **Estimated CEFR level appears
in neither because it supports neither.**

> **It is also missing from the workbook's "from beginning" list, and that WAS a gap.** Confirmed
> with the requester `[2026-08-26]`: a genuine omission, not a deliberate exclusion. It is covered as
> scenario **#14** by `TST_MRPT_TC_37`, alongside the other six report types — and the source
> workbook should be updated to 14 scenarios so the two registers agree.
>
> The lesson generalises: **count the options in the live dropdown against the scenario list before
> designing.** The two capability lists here were correct, which made the missing seventh type look
> intentional. It was not.

`qid`s: the dropdown is `schoolReportType`, its options `schoolReportType-0` … `schoolReportType-6`
in the table order above.

---

## 3. State rules in the "Create report" dialog

All verified live `[2026-08-26]`:

- **Before a report type is chosen, both date-range radios AND `Submit` are disabled**, and
  `From the beginning` is pre-selected. Choosing a date-capable type enables all three.
- The custom-grade checkbox is **enabled from the start** and unticked by default — it does *not*
  wait for a report type (except for Estimated CEFR level, where it stays disabled).
- `From` / `To` appear only when `Custom date range` is selected, defaulting to the **last seven
  days** (captured: `Thu, Aug 20, 2026` → `Wed, Aug 26, 2026`).

### Date field constraints — read before writing any boundary case (`admin-shared.md` §A3 rule)

| Field | Constraint | Attribute observed |
|---|---|---|
| `From` (`#reportStartDate`) | **read-only** — picker is the only input path | `readOnly` |
| `From` | floor **1 January 2022** | `min="2021-12-31T18:30:00.000Z"` |
| `From` | ceiling **today** — no future dates | `max="2026-08-26T18:29:59.999Z"` |
| `To` (`#reportEndDate`) | **read-only** | `readOnly` |
| `To` | floor = **the currently selected start date** | `min` tracked the `From` value |
| `To` | ceiling **today** | same `max` |

> **Both date inputs are `readOnly`.** This kills the entire family of "type an invalid date"
> negative cases before they are written — the calendar pickers are the only way in. The `min`/`max`
> values are ISO instants offset for IST, so `2021-12-31T18:30:00.000Z` means **2022-01-01 local**.

The class search box (`#searchText`, `qid="createReport-9"`) carries **`maxlength="321"`** — an
unusual value worth a boundary case.

---

## 4. Reports tab — the two list states

**Empty state** (verbatim):

| Element | Text |
|---|---|
| Heading | `Reports (0)` |
| Info line | `Reports are available to download for up to 60 days` |
| Empty title | `No new reports available` |
| Empty body | `Your reports will appear here after you create them` |

**Populated state.** Columns `Report type | Classes | Students | Items | Date range | Date created`,
then a file size and a `Download` link. A freshly created report carries a **`New`** badge. The row
captured on creation read:

| Report type | Classes | Students | Items | Date range | Date created | Size |
|---|---|---|---|---|---|---|
| Class summary `New` | 1 | 1 | `All items` | `All student data (up to - Aug 26, 2026)` | Aug 26, 2026 | 496 Bytes |

- `Items` reads **`All items`** when the custom-grade checkbox is unticked. The ticked value is
  **`[ASSUMED]`** — not captured.
- `Date range` for `From the beginning` reads **`All student data (up to - <date>)`** — note the
  literal `up to - ` with a stray hyphen. The custom-window form is **`[ASSUMED]`**.
- **Report generation is fast.** Despite the dialog promising a notification, the report was ready
  and downloadable within seconds, and the header bell gained an unread badge. Do not write a long
  async wait on the strength of the copy alone.

---

## 5. Selection model — two traps

1. **The footer action bar does not exist at zero selection.** It is absent from the DOM entirely,
   not a disabled button. An assertion of the form *"Continue is disabled"* fails to find the
   element at all — **assert absence**. It appears on the first tick reading
   `You have selected 1 class with a total of 1 student`, with `Cancel` (`createReport-13`) and
   `Continue` (`createReport-14`, `id="class-select-continue-btn"`).
2. **The `Select classes` heading gains its `(N)` count only once ≥1 class is ticked** — at zero it
   is a bare `Select classes`, exactly as the Classes tab's collapsed *Ended classes* heading shows
   no number until expanded (`admin-shared.md` §A4).

**Row checkboxes:** the `input` is visually hidden and the **label is the click target**. Each
checkbox's `name` is the class **UUID** — stable, and far better to key on than its `qid`
(`createReport-7-N`), which is **positional** and gets re-issued whenever the list is searched or
filtered (`admin-shared.md` §B3).

**Two separate Cancels.** `createReport-13` cancels the class-selection step; `createReport-15`
cancels the report-configuration dialog. A test written against "the Cancel button" will hit
whichever happens to be in the DOM. They are different controls with different scopes.

---

## 6. Filter panel

Headed **`Filter by`**, with five status checkboxes — **`Not started` · `Active` · `Ended` ·
`Expired` · `Deleted`** (`createReport-21-0` … `-4`) — plus `Clear all` (`createReport-23`),
`Apply` (`createReport-24`) and a `Close`. The unfiltered summary label reads
**`All class statuses`**.

> **This status set includes `Not started`**, which the Classes-tab knowledge did not record — §A6
> of `admin-shared.md` lists the class status values as *Ended / Expired / Deleted*. The Reports
> class picker exposes five.

`[ASSUMED]` — whether `Clear all` applies immediately or still needs `Apply`, and what the summary
label becomes after a filter is applied. Neither was determined live.

---

## 7. Dialog copy, and one thing that is NOT a defect

Captured verbatim `[2026-08-26]`; the last two came from the **pre-rendered DOM** without ever
triggering them (`admin-shared.md` §A6 free-capture):

| Dialog | Copy |
|---|---|
| Success | `We are preparing your report` · `We will notify you when your <Report type> report is ready to download` · `Create another report` · `Back to Reports` |
| Generation failed | `Sorry, something went wrong. The report you requested was not generated.` · `Try again` · `Back to Reports` |
| Created with errors | `Report created with errors` · `<N> out of <TOTAL> classes were not included in your report due to the errors shown below` · columns `Class name` / `Class key` / `Error message` · `Download report` |

> ⚠️ **`ADMIN.CREATE_REPORT.null` and `ADMIN.REPORT.undefined` are NOT untranslated i18n keys.**
> Both appear in the pre-rendered DOM, alongside a literal `{{totalClasses}}` and a `NaN undefined`.
> They **resolve correctly at runtime** — after a real submission the success dialog read
> *"We will notify you when your **Class summary** report is ready to download"*. These are
> un-instantiated Angular bindings in a template that has not been rendered yet. **Do not raise them
> as defects**, and do not assert on the pre-rendered form.
>
> This is the limit of the free-capture trick worth knowing: it gives you the **copy skeleton** for
> free, but any part of that copy that is interpolated shows as a placeholder. §A6 did not previously
> say so.

---

## 8. Automation notes

- **Synthetic clicks do not drive this screen's Angular buttons.** A JS `element.click()` (and even a
  full `pointerdown`/`mousedown`/`pointerup`/`mouseup`/`click` dispatch) toggles the class checkbox
  and updates the footer text, but `Continue` then no-ops — the component's own selection model
  never saw it. Real trusted clicks are required. Consistent with `admin-shared.md` §B5.
- **The footer bar is invisible to the accessibility tree.** `Cancel`/`Continue` are fully visible,
  not `aria-hidden`, not `inert`, and still absent from a filtered a11y snapshot while present in a
  full one. Do not conclude the buttons are missing from a tree dump alone.
- **`qid` typos on the Reports tab:** `aReport=10` and `aReport=11` use an **equals sign** where every
  other id uses a hyphen. A `[qid^="aReport-"]` selector silently misses both.
- Visibility checks must not use `offsetParent` — the filter panel and both step-2 dialogs are
  fixed-position, so `offsetParent` is `null` even when shown. Use `checkVisibility()`.

---

## 9. Design-time blockers on this screen

| Case | Why blocked | Unblock |
|---|---|---|
| `TST_MRPT_TC_17` — 1500-class cap | `VED-NEH-KVU` holds 6 classes | a school seeded with >1500 classes |
| `TST_MRPT_TC_38` — generation failure | cannot be forced on Thor | backend fault injection / stubbed failure |
| `TST_MRPT_TC_39` — partial failure detail | needs a multi-class report where some classes fail | fault injection, or a class in a failing state |

All six classes on the target school are **Active** with **1 student** each, so the school also
cannot demonstrate **filter exclusion** — `TST_MRPT_TC_9`, `TC_11` and `TC_12` need a class in
another status.

**Creating a report is a real side effect.** `TST_MRPT_TC_21`–`TC_26`, `TC_28`, `TC_35` and `TC_37`
each add a report to the school; they auto-expire after 60 days. Keep them out of side-effect-free
suites (`admin-shared.md` §A7).

---

## Sources

- Live capture, Thor, 2026-08-26 — `Cqa Test Ashish School 1` (`VED-NEH-KVU`).
- Scenario source: `AdminApp_Report tab.xlsx` (13 scenarios).
- Manual set: `test/Manual/C1App/AdminApp-Reports/`.

---

## 10. Live re-capture on `FCN-CHZ-PDA` `[2026-09-08]` — corrections and new traps

*Captured on Thor, school **`FCN-CHZ-PDA`** ("3 July Test School 1", org `org_perf_testschool_1`)
via `testt1@mailsac.com`. **This is a DIFFERENT school from the one that seeded this file** — the
original `VED-NEH-KVU` / `cqatestashish_admin@mailsac.com` has no credentials in the repo and is
invisible to the suite's login account. The user approved re-grounding here on 2026-09-07.
Its 110 classes across several statuses are strictly better for the filter cases than the original
school's 6 all-Active classes, which could not demonstrate filter exclusion at all.*

School state at capture: `Reports (0)` · **110** classes · **21** Active · 30 students in total.

> Thor was healthy this day. School selection and `Create report` both worked first time — both
> were broken or inert on 2026-09-07 (`admin-staff-tab.md` §8.8). Nothing recorded below is a
> product defect; those were environment faults.

### 10.1 Correction to §5 — the row checkbox `name` is NOT the class UUID

§5 says *"Each checkbox's `name` is the class UUID — stable, and far better to key on than its
`qid`"*. **That is false on `FCN-CHZ-PDA`:** `name` is **empty on all 20 rows**. The only per-row
handles are `id="checkbox-N"` and `qid="createReport-7-N"`, and **both are positional** — literally
Invariant 2's canonical `#checkbox-1` example.

**Resolve rows by CONTENT.** The `label[for="checkbox-N"]` carries the whole row:
`"Select class<name> <key><start><end><studentCount><status>"`.

- The ids are **0-BASED** — `checkbox-0` / `createReport-7-0`, not `-1`.
- Many classes on this school **share a name** (`AutoClass_CreateOnly`, `BulkCSV_Class1` x3+).
  Never resolve a row by name alone unless it is the permanent fixture.

### 10.2 Correction to §6 — all five statuses are CHECKED by default, and `Clear all` is a RESET

| Claim | Live on 2026-09-08 |
|---|---|
| §6 `[ASSUMED]`: what the summary label becomes after a filter | Applying **1** status gives **`1 class status`** (singular). N = the number of **checked** statuses |
| §6 `[ASSUMED]`: whether `Clear all` applies immediately | **It applies immediately** — no `Apply` needed |
| The manual register's assumption that the five boxes start **unticked** | **All five start CHECKED**, summary `All class statuses` |
| What `Clear all` does | Not "untick everything" — it **re-checks all five**, applies, **closes the panel**, and restores `All class statuses` |

`Clear all` is therefore a **reset to unfiltered**, not a clear. `Apply` also closes the panel.

### 10.3 `Select all classes` selects EVERY MATCHING class, not the loaded page

**The class list lazy-loads, page size 20, with `Load more...` (`a[qid="createReport-8"]`)** — not
previously recorded for this screen. With 20 of 110 rows rendered, ticking select-all gives:

- heading **`Select classes(110)`**
- summary **`You have selected 110 classes with a total of 30 students`**
- all **20 loaded** row checkboxes ticked

**So `headingCount == renderedRowCount` is a FAILING assertion**, and hardcoding `110` rots on a
shared school. Assert: select-all checked AND every loaded row checked AND heading count equals the
`createReport-11-N` anchor count AND heading count is greater than the loaded row count.

> Clicking select-all while a *partial* selection exists **clears it** rather than completing it.
> Reaching "all selected" from one ticked row takes **two** clicks.

### 10.4 Refines the `createReport-11-N` trap — it tracks the FILTERED total

The class-name anchors are **0 visible** in every state (so any count over them is a false green,
per `admin-shared.md` §B2). But their *count* is not the constant 110: it is **the number of
classes matching the current query**. Measured: unfiltered **110**, Active-only filter **21**,
single-hit search **1**.

That makes the collection a useful **total-count oracle** — the one number that stays correct as
the shared school churns — while remaining useless as a "rows rendered" count.

### 10.5 The search is LIVE / debounced — NOT submit-driven

Typing `Fixture_GradeSettings_DO_NOT_DELETE` narrowed the list to one row **before the Search
button was clicked**. A `Search` control exists (`a[qid="createReport-10"]`, `aria-label="Search"`)
but is **not required to filter**.

> This is the `admin-shared.md` §A4 warning landing again: the Classes tab's search **is**
> submit-driven, and that expectation was inherited into this register's `TST_MRPT_TC_4` as an
> `[ASSUMED]`. **Wrong here.** Wait on the list changing after typing; do not click Search, and do
> not assume typing alone is inert.

### 10.6 NEITHER the filter NOR the search persists — the opposite of the Classes tab

After a reload: all five statuses checked again, summary back to `All class statuses`, anchors back
to 110, **and the search box empty**. The Classes tab persists both **server-side per user**
(`admin-shared.md` §A4) — this screen persists neither.

**So filter and search tests owe NO cleanup here.** Do not inherit the Classes-tab reset
discipline (§B7) onto this screen.

### 10.7 NEW TRAP — the select-all label is 0x0. Two click conventions on ONE screen

`label[for="checkbox-selectallclasses"]` renders **no text** and has a **zero-size rect**, so
Playwright refuses to click it (*"element is not visible"*) even though `checkVisibility()` returns
true. The **input** must be clicked instead — it is `opacity:0` but has a real 17x17 box, and
opacity-0 is still visible to Playwright (Invariant 1).

This is the **exact opposite** of the row checkboxes, where `admin-shared.md` §B5 says to click the
`<label>` because it overlays the input. **Both rules are live on this one screen.** Check per
control; never generalise §B5.

### 10.8 `Cancel` on the class-selection step does NOT exit the flow

Two controls, two jobs — verified twice, the second time on a freshly reloaded page, with no
dialog, no backdrop and 0 visible modals:

| Control | qid | Behaviour |
|---|---|---|
| **Go back** | `createReport-1` | **Leaves** — returns to `/reports`, `Reports (0)` unchanged |
| **Cancel** (footer bar) | `createReport-13` | **Clears the selection** — row unticked, footer bar removed — and **stays on `/reports/create`** |

The manual register's `TST_MRPT_TC_18` expected Cancel to return to the Reports tab. **It does
not.** Confirmed as accepted behaviour by the user `[2026-09-08]` and the register was corrected;
this is **not** a defect. `TST_MRPT_TC_3` (the `Go back` case) is correct as written.

> This is the third distinct "Cancel" on this flow. §5's warning stands and grows:
> `createReport-1` leaves, `createReport-13` clears the selection, `createReport-15` closes the
> config dialog. A test written against "the Cancel button" hits whichever is in the DOM.

### 10.9 `Cancel` in the config dialog PRESERVES the class selection

§5's `[ASSUMED]` is resolved. Clicking `createReport-15`:

- the dialog hides (`#schoolReportModal` stays in the DOM, `display:none`)
- the class-selection step is shown again with the **class still ticked**, heading still
  `Select classes(1)`, footer bar still present
- the report type resets to **`Select a report type`**
- no report is created; the URL never leaves `/reports/create`

### 10.10 Correction to the element TYPES — three of these are not anchors

Selectors written as `a[qid=...]` for these match **nothing**:

| qid | id | Element |
|---|---|---|
| `createReport-14` Continue | `class-select-continue-btn` | **`button`** |
| `createReport-15` Cancel (config dialog) | `class-report-cancel-btn` | **`button`** |
| `createReport-16` Submit | `class-report-submit-btn` | **`button`** |
| `createReport-13` Cancel (class step) | `class-select-cancel-btn` | `a` |
| `createReport-1` Go back | — | `a` |

`Submit` is disabled **natively AND by the CSS class** `disabled`, so `toBeDisabled()` works here —
the opposite of the staff-profile `Yes, remove`, which is CSS-only. **Check per button.**

### 10.11 Full `createReport-*` inventory captured 2026-09-08

```
createReport-1     a       Go back                     -> /reports
createReport-2     input   Select all classes          id=checkbox-selectallclasses  (label is 0x0)
createReport-3     a       Sort by Class name
createReport-4     a       Sort by Start date
createReport-5     a       Sort by End date
createReport-6     a       Sort by Students            <- NOT "Select all classes"
createReport-7-N   input   row checkbox                id=checkbox-N  (0-based, name="")
createReport-8     a       Load more...                (lazy load, page size 20)
createReport-9     input   search box                  id=searchText  maxlength=321
createReport-10    a       Search                      (NOT required - search is live)
createReport-11-N  a       class-name anchors          0 visible; count == matching total
createReport-13    a       Cancel  (class step)        id=class-select-cancel-btn    absent at 0 selection
createReport-14    button  Continue                    id=class-select-continue-btn  absent at 0 selection
createReport-15    button  Cancel  (config dialog)     id=class-report-cancel-btn
createReport-16    button  Submit                      id=class-report-submit-btn
createReport-17    a       Create another report       id=create-other-report-btn
createReport-18    button  Back to Reports             (success dialog)
createReport-19    a       Filter                      id=filterModalToggle
createReport-21-N  input   the five statuses           ids status.name0..4  (ALL CHECKED by default)
createReport-22    a       Close  (filter panel)
createReport-23    a       Clear all                   (resets + applies + closes)
createReport-24    a       Apply                       (applies + closes)
createReport-25    a       Try again                   id=try-again-btn  (failure dialog)
createReport-26    button  Back to Reports             (failure dialog)
```

**The filter summary label has no id, class or qid** — reach it via `div.filtered-info .d-sm-flex`.
Scoping matters: `.filtered-info` alone also contains the entire filter panel's text.

**4 pre-rendered `.modal-content` on `/reports/create`** (3 on `/reports`), 0 visible.
`#reportStartDate` / `#reportEndDate` are in the DOM but **hidden** until `Custom date range` is
chosen — presence is not state (§B2).

### 10.12 Measured transitions — do not re-guess (Invariant 1)

Polled on a 100 ms grid; **0 ms means "already true at the first poll"**, i.e. synchronous
client-side work:

| Transition | Measured |
|---|---|
| footer bar appears after the first tick | **0 ms** (same tick) |
| config dialog visible after `Continue` | **0 ms** |
| date radios + `Submit` enable after choosing a type | **0 ms** |
| `From`/`To` appear after `Custom date range` | **0 ms** |
| config dialog hidden after its `Cancel` | **0 ms** |
| filter panel opens after `Filter` | **0 ms** |
| filter panel closes after `Apply` | **0 ms** |
| `Go back` to `/reports` | **0 ms** |
| select-all, all rows ticked + counts updated | under 1.5 s |
| filtered list settles after `Apply` | under 1.5 s |
| live search settles after typing | under 1.5 s |

**Nothing on this screen is slow.** Still budget generously — Thor throughput varies 4-8x
(`admin-shared.md` §B8) — but a long wait here is hiding a bug, not absorbing latency.

### 10.13 Stable test data on `FCN-CHZ-PDA`

| Class | Key | Notes |
|---|---|---|
| `Fixture_GradeSettings_DO_NOT_DELETE` | `62k3-AXm6` | Aug 20 2026 to Dec 31 2036, **0 students**, Active. Documented never-delete (`admin-shared.md` §A7), unique, and stable on a shared school. **Use it for the search, selection and cancel cases.** |

The footer summary reads `0 students` for this class — *"You have selected 1 class with a total of
0 students"*. Note the **plural "students" with a zero count**; the singular form `1 student`
recorded in §5 came from the other school. Do not assert a singular/plural rule.

### 10.14 Confirmed unchanged from the 2026-08-26 capture

Re-verified on this school, so they are school-independent: the seven report types and their
`schoolReportType-0..6` order (§2); both date radios and `Submit` **natively disabled** before a
type is chosen (§3); `#report-custom-grade-checkbox` enabled and unticked from the start, labelled
`Only include items that contribute to grade calculation`; `From`/`To` both `readOnly`, defaulting
to the last seven days (captured `Wed, Sep 2, 2026` to `Tue, Sep 8, 2026`) with `min` 2022-01-01
and `max` today; the footer action bar genuinely **absent** from the DOM at zero selection (§5);
`Select classes` gaining its `(N)` only once at least one class is ticked; `#searchText`
`maxlength="321"`; and `/reports/create` remaining reachable by deep link once the school context
is set.

### 10.15 The class-selection step has NO school tab strip `[2026-09-08]`

`/reports/create` renders **zero `aDetail-*` links** — the CLASSES / STUDENTS / STAFF / LIBRARY /
REPORTS tab strip that persists across every other admin screen (`admin-shared.md` §A9) is absent
here. The class-selection step is a **full-page flow**, not a tab.

**`Go back` (`createReport-1`) is therefore the only route back to `/reports`.** A page object that
navigates by clicking the REPORTS tab works from the Classes tab and **times out** from here — it
cost a 30 s `locator.click` timeout on the first run of the MRPT suite.

> This extends §A9's tab-navigation notes with an exception: *the school tab strip is not
> universal.* Check for it before writing tab-based navigation on a nested admin route.

### 10.16 ⚠️ The class search is DEBOUNCED BY ~1 SECOND — measured

Live measurement `[2026-09-08]`, polling the rendered row count on a 100 ms grid while typing
`Fixture_GradeSettings_DO_NOT_DELETE` character by character:

| t (ms from first keystroke) | rendered rows |
|---|---|
| 57 | 20 *(unfiltered — filter has not started)* |
| **994** | **1** *(filtered)* |

**~1 second of debounce.** This is the only measurable delay anywhere on this screen; §10.12's
table of 0 ms transitions is otherwise accurate.

**The trap this creates is worth stating plainly, because it produced a passing wait over a wrong
list.** The first version of `search_class` waited for *"the row count has not changed across 3
consecutive 100 ms reads"* and reported success in ~300 ms — while the list still held the
**pre-search 20 rows**. A stability window cannot distinguish *"the filter has not started yet"*
from *"the filter has finished"*, so it read the stale list as a settled result. Two cases then
failed with 20 rows where 1 was expected, and five more failed downstream because the class they
needed was not among the first 20 of 110 rendered.

**Wait for the row-label FINGERPRINT to CHANGE, then settle** — the same signal `admin-shared.md`
§B6 prescribes for sort order, and for the same reason. A count alone would also miss a search that
returns a different set of the same size.

> This is §B6's "wait on the thing that actually changed, never on its announcement" in a new
> disguise: here there was no announcement at all, and *absence of change* was mistaken for
> completion. Add it to the §B6 table as **class search → wrong signal: count stability → right
> signal: row fingerprint change, after a ~1 s debounce.**

### 10.17 ⚠️ NEVER index into a list that is still settling — read the container once

The debounce in §10.16 has a second, sharper consequence that cost six cases a full mocha
timeout each.

A content fingerprint written as *"read the row count, then loop `.nth(0)…nth(n-1)`"* **cannot
survive the change it is watching for.** Observed 2026-09-08: the count read 20, the loop began,
the ~1 s debounce fired mid-loop, the list collapsed to **1** row, and `.nth(4)` then blocked for
**Playwright's full 30 s default** waiting for an element that no longer existed:

```
locator.innerText: Timeout 30000ms exceeded.
  waiting for locator('create-report div.list-items label.custom-control-label').nth(4).first()
```

Several such stalls inside one test exhausted mocha's 120 s cap, and the generic
*"Timeout of 120000ms exceeded"* then **replaced the page object's own diagnostic**, so the run
reported nothing about which wait had actually failed.

**The fix is one atomic read.** `create-report div.list-view` is a single element (verified) that
contains every row, so one `innerText` on it is a complete content fingerprint — one call instead
of twenty-one, and impossible to go stale between reads.

| | |
|---|---|
| ❌ | `count = getElementCount(rows); for (i<count) getText(nth(i))` — races the debounce, stalls 30 s per vanished row |
| ✅ | `getText('create-report div.list-view')` — atomic, one call, cannot go stale |

> **Two lessons, and the second is the one that generalises.**
> 1. A per-row loop over a live list is a race, not a read. Any list with a debounce, a lazy
>    load or a background refresh can shrink under it.
> 2. **Keep a page object's own budgets well under mocha's `timeout`** (`.mocharc.js`: 120000).
>    `search_class` originally used a 30 s budget for *both* of its waits; combined with the
>    30 s locator stall above, the test died on mocha's clock rather than its own, and the
>    diagnostic was lost. Budgets are now 15 s (change) + 5 s (settle) against a measured ~1 s
>    debounce. This is `admin-shared.md` §B8's headroom rule, now hit for the third time in
>    this repo — it is worth treating as a hard rule, not a caution.

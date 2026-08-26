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

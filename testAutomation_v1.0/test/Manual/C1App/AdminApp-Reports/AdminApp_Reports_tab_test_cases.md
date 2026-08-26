# Manual Functional Test Cases — Cambridge One Admin App: Reports tab (Batch 1)

**Source:** `AdminApp_Report tab.xlsx` — 13 test scenarios for the school-admin Reports tab (the sheet is titled "Test Scenarios (Staff Tab)", a copy-paste leftover; every row is a Reports scenario).
**Module:** MRPT (Manage Reports) — *maps to the future `manageReports.page.js` page object when automated*
**App:** Cambridge One Admin App (NEMO microservice) — `micro-nemo.comprodls.com` (Thor)
**Page in scope:** Reports tab and the Create report flow — `/admin/admin/org_<slug>/reports` and `/admin/admin/org_<slug>/reports/create`
**Generated:** 2026-08-26 | **Total TCs:** 39 (21 Positive · 11 Edge · 7 Negative) — all 13 source scenarios covered, plus scenario #14 (a confirmed source omission) and one added-coverage group
**Execution status (2026-08-26):** **0 of 39 TCs automated.** 36 are Not Run and 3 are Blocked at design time (TST_MRPT_TC_17, TST_MRPT_TC_38, TST_MRPT_TC_39).

**Batches:** Batch 1 — Reports tab and Create report flow (`TST_MRPT_*`, module MRPT, 39 TCs).

> **Ordering:** test cases are **grouped by Linked Requirement (scenario)** so every requirement's
> TCs sit together; within each group they run **Positive → Edge → Negative**. (This intentionally
> departs from `manual-test-standard.md`'s global P→E→N ordering, per the established Admin App
> convention.) **S.No.** is sequential in this grouped order; **Test Case IDs** are stable
> identifiers and therefore appear out of numeric sequence within a group.
>
> **Batch 1 scope (agreed):** all 13 scenarios from `AdminApp_Report tab.xlsx`. Nothing deferred.
> **Scenario #14 was added** for the Estimated CEFR level report type, confirmed by the requester as a
> genuine omission from the source workbook. A separate **added-coverage** group (#15) carries the two
> report-generation error paths the source list does not mention but the live product exposes.
>
> Unverified expected text is marked `[ASSUMED]`; environment-specific values use
> `<PLACEHOLDER>` (see Remarks).

**Module code note (2026-08-26).** `MRPT` was chosen from the page object this screen will get —
`manageReports.page.js` — per AGENTS.md Rule 6, and it is the worked example in both that rule and
`manual-test-standard.md`. The manual and automation module codes therefore agree from the start,
avoiding the `BCCF` → `CCLS` re-mapping that Phase 1 incurred.

**Seven report types, not six — scenario #14 added (2026-08-26).** The source scenario list names six
report types; the live product offers **seven**. The seventh is **Estimated CEFR level**, and the
requester has **confirmed this was a genuine omission from the source workbook, not a deliberate
exclusion**. It is therefore covered as a first-class report-type scenario — **#14, alongside #6–#11**
— by `TST_MRPT_TC_37`, not as added coverage.

Estimated CEFR level is the only type supporting **neither** a custom date range **nor** custom grade
settings (verified live across all seven), which is why it is correctly absent from scenarios #12 and
#13. Those two exclusions are pinned by `TST_MRPT_TC_33` and `TST_MRPT_TC_36`, so the type is fully
covered: one positive creation case plus both negative capability cases.

**Update the source workbook.** `AdminApp_Report tab.xlsx` still lists 13 scenarios and should gain a
14th — *"Verify Estimated CEFR level report from beginning"* — so the scenario register and this
document agree.

**Blocked cases (2026-08-26).** 3 cases are **Blocked on the day they were written**, not Not Run:
`TST_MRPT_TC_17` needs a school holding more than 1500 classes; `TST_MRPT_TC_38` and
`TST_MRPT_TC_39` need report generation to fail, which cannot be forced on Thor. Their **expected
results are nonetheless verified**, because the dialog copy was captured from the pre-rendered DOM
(`admin-shared.md` §A6) without ever reaching the state that raises it.

**Cases that create real data.** `TST_MRPT_TC_21`–`TC_26`, `TC_28`, `TC_35` and `TC_37` each create a
real report on the target school. Reports auto-expire after 60 days. This decides suite placement when
these are automated — they must not sit in a side-effect-free suite.

---

## Requirement → Test Case coverage map

| Linked Requirement (scenario) | Mapped TC IDs (P → E → N) |
|---|---|
| #1 — Verify Create Report is launching | TC_1, TC_2, TC_3 (E) |
| #2 — Verify search using class name or class key | TC_4, TC_5, TC_6 (E), TC_7 (N) |
| #3 — Verify filter | TC_8, TC_9, TC_10 (E), TC_11 (E), TC_12 (N) |
| #4 — Verify class selection checkbox | TC_13, TC_14, TC_15 (E), TC_16 (E), TC_17 (E) |
| #5 — Verify Cancel button functionality | TC_18, TC_19, TC_20 (E) |
| #6 — Verify Class summary report from beginning | TC_21 |
| #7 — Verify Class detailed data report from beginning | TC_22 |
| #8 — Verify Class daily data report from beginning | TC_23 |
| #9 — Verify Aggregated data report from beginning | TC_24 |
| #10 — Verify Assignments summary report from beginning | TC_25 |
| #11 — Verify Assignments detailed data report from beginning | TC_26 |
| #12 — Verify Custom date range reports | TC_27, TC_28, TC_29 (E), TC_30 (E), TC_31 (E), TC_32 (N), TC_33 (N) |
| #13 — Verify reports with custom grade settings applied | TC_34, TC_35, TC_36 (N) |
| #14 — Verify Estimated CEFR level report from beginning | TC_37 |
| #15 — Added coverage: report generation error paths | TC_38 (N), TC_39 (N) |

Every scenario in the source has at least one test case.

---

## Product reference (captured live 2026-08-26, Thor · Cqa Test Ashish School 1 / VED-NEH-KVU · cqatestashish_admin@mailsac.com)

### Entry path and URLs

```
My school accounts (/admin/admin/dashboard)
  └─ school card "Cqa Test Ashish School 1" (key VED-NEH-KVU)
       └─ left nav: CLASSES · STUDENTS · STAFF · LIBRARY · REPORTS
            └─ REPORTS            /admin/admin/org_cup_j9GskaJJmvDjmQZ9/reports
                 └─ Create report /admin/admin/org_cup_j9GskaJJmvDjmQZ9/reports/create
                      ├─ step 1  class selection (search · filter · checkboxes · Cancel/Continue)
                      └─ step 2  "Create report" dialog (report type · grade option · date range · Cancel/Submit)
```

Once the school context is set, `/reports/create` **is** reachable by deep link — unlike the class
pages, which return `/dashboard/error` when deep-linked (`admin-shared.md` §A1). The school context
must still be established by clicking the school card first.

### Reports tab — empty state (verbatim)

| Element | Text |
|---|---|
| Heading | `Reports (0)` |
| Info line | `Reports are available to download for up to 60 days` |
| Empty title | `No new reports available` |
| Empty body | `Your reports will appear here after you create them` |
| Actions | `Create report` (header **and** empty-state) |

### Reports tab — populated state

Columns: `Report type | Classes | Students | Items | Date range | Date created`, then size and a
`Download` link. The row created during this capture read:

| Report type | Classes | Students | Items | Date range | Date created | Size |
|---|---|---|---|---|---|---|
| Class summary **New** | 1 | 1 | `All items` | `All student data (up to - Aug 26, 2026)` | Aug 26, 2026 | 496 Bytes |

A freshly created report carries a **New** badge. Despite the "we will notify you" wording, the
report was ready within seconds, and a notification badge appeared on the header bell.

### Step 1 — class selection

| Element | Detail |
|---|---|
| Heading | `Select classes` — gains `(N)` **only** once ≥1 class is ticked |
| Cap | `You can include up to 1500 classes` |
| Search | placeholder `Search for class name or class key`, `maxlength="321"`, plus a `Search` button |
| Filter | opens a panel headed `Filter by` |
| Filter statuses | `Not started` · `Active` · `Ended` · `Expired` · `Deleted` |
| Filter actions | `Clear all` · `Apply` · `Close`; summary label reads `All class statuses` when unfiltered |
| Select all | `Select all classes` |
| Sortable columns | Class name · Start date · End date · Students (Class key and Class status are **not** sortable) |
| Footer bar | **absent at zero selection**; at 1 reads `You have selected 1 class with a total of 1 student` with `Cancel` and `Continue` |

The row checkbox `input` is visually hidden — the **label** is the click target. Row checkbox
`name` attributes are the class **UUIDs** (stable), whereas their `qid`s (`createReport-7-N`) are
**positional** and will be re-issued when the list is searched or filtered.

### Step 2 — the "Create report" dialog

| Element | Detail |
|---|---|
| Heading | `Create report`, with a `Close` control |
| Report type | combobox labelled `Report type`, default `Select a report type` |
| Grade option | checkbox `Only include items that contribute to grade calculation` |
| Date range | radios `From the beginning` / `Export all student data` and `Custom date range` / `Export data based on specific dates` |
| Custom fields | `From` and `To`, shown only when `Custom date range` is selected |
| Actions | `Cancel` · `Submit` |

**State rules, all verified live:**

- Before a report type is chosen, **both date-range radios and `Submit` are disabled**, and
  `From the beginning` is pre-selected.
- Choosing a date-capable report type enables both radios and `Submit`.
- The `From`/`To` fields default to the **last seven days** (captured: Thu, Aug 20, 2026 →
  Wed, Aug 26, 2026).
- Both date inputs are **`readOnly`** — pickers are the only input path.
- `From` carries `min="2021-12-31T18:30:00.000Z"` → a floor of **1 January 2022**.
- Both carry `max="2026-08-26T18:29:59.999Z"` → **no future dates**.
- `To` carries `min` equal to the current `From` value → **the end date cannot precede the start**.

### Report types — the capability matrix (all seven verified live)

| # | Report type | Custom date range | Custom grade settings |
|---|---|---|---|
| 1 | Class summary | ✅ | ✅ |
| 2 | Class detailed data | ✅ | ✅ |
| 3 | Class daily data | ✅ | ✅ |
| 4 | Aggregated data | ✅ | ✅ |
| 5 | Assignments summary | ❌ | ✅ |
| 6 | Assignments detailed data | ❌ | ✅ |
| 7 | **Estimated CEFR level** | ❌ | ❌ |

This matrix confirms the source scenario list exactly: scenario #12 names the four date-capable
types, and scenario #13 names the six grade-capable types. The seventh type supports neither, which
is why it appears in neither.

### Dialog copy captured verbatim

| Dialog | Copy |
|---|---|
| Success | `We are preparing your report` · `We will notify you when your <Report type> report is ready to download` · `Create another report` · `Back to Reports` |
| Generation failed | `Sorry, something went wrong. The report you requested was not generated.` · `Try again` · `Back to Reports` |
| Created with errors | `Report created with errors` · `<N> out of <TOTAL> classes were not included in your report due to the errors shown below` · columns `Class name` / `Class key` / `Error message` · `Download report` |

The last two were captured from the **pre-rendered DOM** without ever triggering them
(`admin-shared.md` §A6), which is what makes `TST_MRPT_TC_38` and `TST_MRPT_TC_39` verified rather
than `[ASSUMED]` despite being Blocked.

> **Not a defect.** In the pre-rendered DOM the success dialog reads
> `ADMIN.CREATE_REPORT.null` and the error modal reads `ADMIN.REPORT.undefined`. Both **resolve
> correctly at runtime** — after a real submission the dialog read "We will notify you when your
> **Class summary** report is ready to download". These are un-instantiated binding placeholders,
> not untranslated i18n keys. Do not raise them.

### Classes on the target school (2026-08-26)

All six are **Active** with **1 student** each: `Gated LP Class` (4mG6-9Jkf) ·
`Coming Soon Test Component Class` (8R43-4Lm8) · `School License Test Class 4` (q8sD-989r) ·
`School License Test Class 3` (62B6-nb9A) · `School License Test Class 2` (8RsZ-KmD7) ·
`School License Test Class 1` (LT4E-zfyh).

Because every class shares one status, this school **cannot** demonstrate filter exclusion
(`TST_MRPT_TC_9`, `TC_11`, `TC_12`) — those need a class in another status.

---

## Section — Test Cases (grouped by Linked Requirement)

### Requirement #1 — Verify Create Report is launching

| Field | Value |
|---|---|
| **S.No.** | 1 |
| **Test Case ID** | TST_MRPT_TC_1 |
| **Title** | Verify the Reports tab loads with its empty state when the school has no reports |
| **Linked Requirement** | #1 — Verify Create Report is launching |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as school-admin <REPORTS_ADMIN_USER>; school "Cqa Test Ashish School 1 (key VED-NEH-KVU)" opened from "My school accounts"; Reports tab open. |
| **Test Steps** | 1. Open the school from "My school accounts".<br>2. Click "REPORTS" in the school navigation.<br>3. Observe the page. |
| **Test Data** | — |
| **Expected Result** | URL is /admin/admin/org_<slug>/reports. The heading reads "Reports (0)". A "Create report" button is present. The informational line reads "Reports are available to download for up to 60 days". The empty state reads "No new reports available" above "Your reports will appear here after you create them", with a second "Create report" button. |
| **Remarks** | All copy captured verbatim live 2026-08-26. The (0) count is school-specific — on a school that already holds reports this case cannot show the empty state. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |

---

| Field | Value |
|---|---|
| **S.No.** | 2 |
| **Test Case ID** | TST_MRPT_TC_2 |
| **Title** | Verify the class-selection step launches when "Create report" is clicked |
| **Linked Requirement** | #1 — Verify Create Report is launching |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as school-admin <REPORTS_ADMIN_USER>; school "Cqa Test Ashish School 1 (key VED-NEH-KVU)" opened from "My school accounts"; Reports tab open. |
| **Test Steps** | 1. Click "Create report".<br>2. Observe the page. |
| **Test Data** | — |
| **Expected Result** | The app navigates to /admin/admin/org_<slug>/reports/create. The page shows a "Go back" link, the heading "Create report", the sub-heading "Choose classes you want to include in your report", a section heading "Select classes" with the note "You can include up to 1500 classes", a search box placeholdered "Search for class name or class key", a "Filter" control showing "All class statuses", a "Select all classes" checkbox, sortable column headers (Class name, Class key, Start date, End date, Students, Class status) and one selectable row per class. |
| **Remarks** | Captured live 2026-08-26. Note the "Select classes" heading carries NO count while zero classes are selected — the "(N)" appears only once at least one class is ticked. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |

---

| Field | Value |
|---|---|
| **S.No.** | 3 |
| **Test Case ID** | TST_MRPT_TC_3 |
| **Title** | Verify the Reports tab is restored when "Go back" is used from the class-selection step |
| **Linked Requirement** | #1 — Verify Create Report is launching |
| **Type** | Edge |
| **Priority** | Medium |
| **Preconditions** | Logged in as school-admin <REPORTS_ADMIN_USER>; school "Cqa Test Ashish School 1 (key VED-NEH-KVU)" opened; "Create report" clicked so the class-selection step is displayed. |
| **Test Steps** | 1. Click the "Go back" link at the top of the class-selection step.<br>2. Observe the page. |
| **Test Data** | — |
| **Expected Result** | The app returns to /admin/admin/org_<slug>/reports, the Reports tab renders, and no new report has been created (the heading count is unchanged). |
| **Remarks** | Distinct from the footer "Cancel" (TST_MRPT_TC_18) — both exit paths need covering. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |

---

### Requirement #2 — Verify search using class name or class key

| Field | Value |
|---|---|
| **S.No.** | 4 |
| **Test Case ID** | TST_MRPT_TC_4 |
| **Title** | Verify a class is returned when the full class name is searched |
| **Linked Requirement** | #2 — Verify search using class name or class key |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as school-admin <REPORTS_ADMIN_USER>; school "Cqa Test Ashish School 1 (key VED-NEH-KVU)" opened; "Create report" clicked so the class-selection step is displayed. |
| **Test Steps** | 1. Type "Gated LP Class" into the "Search for class name or class key" box.<br>2. Click "Search".<br>3. Observe the class list. |
| **Test Data** | Search term: Gated LP Class |
| **Expected Result** | The list narrows to the class "Gated LP Class" with key 4mG6-9Jkf, and the row remains selectable. |
| **Remarks** | The search control is a text box plus an explicit "Search" button (captured live 2026-08-26). [ASSUMED] that, as on the Classes tab, typing alone does not filter and the button click is required. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |

---

| Field | Value |
|---|---|
| **S.No.** | 5 |
| **Test Case ID** | TST_MRPT_TC_5 |
| **Title** | Verify a class is returned when its class key is searched |
| **Linked Requirement** | #2 — Verify search using class name or class key |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as school-admin <REPORTS_ADMIN_USER>; school "Cqa Test Ashish School 1 (key VED-NEH-KVU)" opened; "Create report" clicked so the class-selection step is displayed. |
| **Test Steps** | 1. Type "4mG6-9Jkf" into the search box.<br>2. Click "Search".<br>3. Observe the class list. |
| **Test Data** | Search term: 4mG6-9Jkf |
| **Expected Result** | The list narrows to the single class whose Class key column reads "4mG6-9Jkf" ("Gated LP Class"). |
| **Remarks** | The placeholder offers both paths — "Search for class name or class key" — so the key path is covered separately from the name path. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |

---

| Field | Value |
|---|---|
| **S.No.** | 6 |
| **Test Case ID** | TST_MRPT_TC_6 |
| **Title** | Verify matching classes are returned when a partial, differently-cased term is searched |
| **Linked Requirement** | #2 — Verify search using class name or class key |
| **Type** | Edge |
| **Priority** | Medium |
| **Preconditions** | Logged in as school-admin <REPORTS_ADMIN_USER>; school "Cqa Test Ashish School 1 (key VED-NEH-KVU)" opened; "Create report" clicked so the class-selection step is displayed. |
| **Test Steps** | 1. Type "school license" into the search box.<br>2. Click "Search".<br>3. Observe the class list. |
| **Test Data** | Search term: school license |
| **Expected Result** | [ASSUMED] All four "School License Test Class 1–4" rows are returned, proving the search is partial-matching and case-insensitive. |
| **Remarks** | [ASSUMED] — NOT verified live. admin-shared.md §A4 warns explicitly that the Library tab search is FUZZY rather than substring while the Classes tab search is substring, and that a Classes-tab expectation must not be inherited onto a new admin tab without re-verifying. Confirm the semantics here before trusting this case. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |

---

| Field | Value |
|---|---|
| **S.No.** | 7 |
| **Test Case ID** | TST_MRPT_TC_7 |
| **Title** | Verify a no-results state is shown when the search term matches no class |
| **Linked Requirement** | #2 — Verify search using class name or class key |
| **Type** | Negative |
| **Priority** | Medium |
| **Preconditions** | Logged in as school-admin <REPORTS_ADMIN_USER>; school "Cqa Test Ashish School 1 (key VED-NEH-KVU)" opened; "Create report" clicked so the class-selection step is displayed. |
| **Test Steps** | 1. Type "zzzznotaclass" into the search box.<br>2. Click "Search".<br>3. Observe the class list area. |
| **Test Data** | Search term: zzzznotaclass |
| **Expected Result** | [ASSUMED] No class rows are rendered and a no-results message is shown that echoes the search term (the Classes tab renders "No classes that match your search <term>"). |
| **Remarks** | [ASSUMED] copy — the no-results state was not reached during the 2026-08-26 capture. Capture the exact string live before automating. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |

---

### Requirement #3 — Verify filter

| Field | Value |
|---|---|
| **S.No.** | 8 |
| **Test Case ID** | TST_MRPT_TC_8 |
| **Title** | Verify the filter panel opens with all five class statuses when "Filter" is clicked |
| **Linked Requirement** | #3 — Verify filter |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | Logged in as school-admin <REPORTS_ADMIN_USER>; school "Cqa Test Ashish School 1 (key VED-NEH-KVU)" opened; "Create report" clicked so the class-selection step is displayed. |
| **Test Steps** | 1. Click the "Filter" control.<br>2. Observe the panel. |
| **Test Data** | — |
| **Expected Result** | A panel headed "Filter by" opens containing exactly five unticked checkboxes labelled "Not started", "Active", "Ended", "Expired" and "Deleted", plus a "Clear all" link, an "Apply" button and a "Close" control. |
| **Remarks** | All strings captured verbatim live 2026-08-26. Note the status set includes "Not started", which the existing Classes-tab knowledge did not record (it listed Ended / Expired / Deleted). |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |

---

| Field | Value |
|---|---|
| **S.No.** | 9 |
| **Test Case ID** | TST_MRPT_TC_9 |
| **Title** | Verify the class list is narrowed to one status when that status filter is applied |
| **Linked Requirement** | #3 — Verify filter |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as school-admin <REPORTS_ADMIN_USER>; school "Cqa Test Ashish School 1 (key VED-NEH-KVU)" opened; "Create report" clicked so the class-selection step is displayed. |
| **Test Steps** | 1. Click "Filter".<br>2. Tick "Active".<br>3. Click "Apply".<br>4. Observe the class list and the filter summary label. |
| **Test Data** | Filter: Active |
| **Expected Result** | The panel closes and every rendered row shows "Active" in its Class status column. The summary label that read "All class statuses" now reflects the applied filter instead. |
| **Remarks** | [ASSUMED] for the exact summary-label text after applying — only the unfiltered "All class statuses" value was captured live. All six classes on VED-NEH-KVU were Active on 2026-08-26, so this school cannot prove exclusion; use a status with both a matching and a non-matching set. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |

---

| Field | Value |
|---|---|
| **S.No.** | 10 |
| **Test Case ID** | TST_MRPT_TC_10 |
| **Title** | Verify all status selections are cleared when "Clear all" is used |
| **Linked Requirement** | #3 — Verify filter |
| **Type** | Edge |
| **Priority** | Medium |
| **Preconditions** | Logged in as school-admin <REPORTS_ADMIN_USER>; school "Cqa Test Ashish School 1 (key VED-NEH-KVU)" opened; "Create report" clicked so the class-selection step is displayed. |
| **Test Steps** | 1. Click "Filter".<br>2. Tick "Active" and "Ended".<br>3. Click "Clear all".<br>4. Observe the checkboxes and the class list. |
| **Test Data** | Filter: Active + Ended, then Clear all |
| **Expected Result** | All five status checkboxes return to unticked. [ASSUMED] the class list returns to the unfiltered set and the summary label returns to "All class statuses". |
| **Remarks** | [ASSUMED] — whether "Clear all" applies immediately or still requires a subsequent "Apply" was NOT determined live. This is the most likely place in this group for a wrong expected result; resolve it first. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |

---

| Field | Value |
|---|---|
| **S.No.** | 11 |
| **Test Case ID** | TST_MRPT_TC_11 |
| **Title** | Verify classes of every selected status are listed when multiple status filters are applied |
| **Linked Requirement** | #3 — Verify filter |
| **Type** | Edge |
| **Priority** | Low |
| **Preconditions** | Logged in as school-admin <REPORTS_ADMIN_USER>; school "Cqa Test Ashish School 1 (key VED-NEH-KVU)" opened; "Create report" clicked so the class-selection step is displayed. |
| **Test Steps** | 1. Click "Filter".<br>2. Tick "Active" and "Not started".<br>3. Click "Apply".<br>4. Observe the class list. |
| **Test Data** | Filter: Active + Not started |
| **Expected Result** | The list contains classes of BOTH statuses (an OR combination), not their intersection. |
| **Remarks** | Requires the school to hold at least one "Not started" class. All six classes on VED-NEH-KVU were Active on 2026-08-26, so this needs a class whose start date is in the future. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |

---

| Field | Value |
|---|---|
| **S.No.** | 12 |
| **Test Case ID** | TST_MRPT_TC_12 |
| **Title** | Verify an empty class list is shown when the applied filter matches no class |
| **Linked Requirement** | #3 — Verify filter |
| **Type** | Negative |
| **Priority** | Medium |
| **Preconditions** | Logged in as school-admin <REPORTS_ADMIN_USER>; school "Cqa Test Ashish School 1 (key VED-NEH-KVU)" opened; "Create report" clicked so the class-selection step is displayed. |
| **Test Steps** | 1. Click "Filter".<br>2. Tick "Deleted" only.<br>3. Click "Apply".<br>4. Observe the class list area. |
| **Test Data** | Filter: Deleted |
| **Expected Result** | [ASSUMED] No class rows are rendered and a no-results message naming the applied status is shown (the Classes tab renders "No classes that are <status>, <label>"). |
| **Remarks** | [ASSUMED] copy — not captured live. Depends on the school holding no soft-deleted class; on a school that does, pick a status that is genuinely absent. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |

---

### Requirement #4 — Verify class selection checkbox

| Field | Value |
|---|---|
| **S.No.** | 13 |
| **Test Case ID** | TST_MRPT_TC_13 |
| **Title** | Verify the selection count and footer summary update when a single class checkbox is ticked |
| **Linked Requirement** | #4 — Verify class selection checkbox |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as school-admin <REPORTS_ADMIN_USER>; school "Cqa Test Ashish School 1 (key VED-NEH-KVU)" opened; "Create report" clicked so the class-selection step is displayed. |
| **Test Steps** | 1. Tick the "Select class" checkbox on the "Gated LP Class" row.<br>2. Observe the section heading and the bottom of the page. |
| **Test Data** | Class: "Gated LP Class" (4mG6-9Jkf), 1 student |
| **Expected Result** | The section heading becomes "Select classes(1)". A footer bar appears reading "You have selected 1 class with a total of 1 student" and carrying a "Cancel" link and a "Continue" button. |
| **Remarks** | Captured live 2026-08-26. Both the "(1)" suffix and the whole footer bar are absent at zero selection — see TST_MRPT_TC_15. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |

---

| Field | Value |
|---|---|
| **S.No.** | 14 |
| **Test Case ID** | TST_MRPT_TC_14 |
| **Title** | Verify every listed class is selected when "Select all classes" is ticked |
| **Linked Requirement** | #4 — Verify class selection checkbox |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as school-admin <REPORTS_ADMIN_USER>; school "Cqa Test Ashish School 1 (key VED-NEH-KVU)" opened; "Create report" clicked so the class-selection step is displayed. |
| **Test Steps** | 1. Tick the "Select all classes" checkbox.<br>2. Observe the row checkboxes, the section heading and the footer bar. |
| **Test Data** | 6 classes on VED-NEH-KVU, 1 student each |
| **Expected Result** | Every class row checkbox becomes ticked, the heading reads "Select classes(<N>)" where <N> is the number of listed classes, and the footer bar summarises the same totals (e.g. "You have selected 6 classes with a total of 6 students"). |
| **Remarks** | [ASSUMED] plural wording ("classes" / "students") — only the singular "1 class" / "1 student" form was captured live. Also confirm whether "Select all" covers only the currently searched/filtered rows or every class on the school. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |

---

| Field | Value |
|---|---|
| **S.No.** | 15 |
| **Test Case ID** | TST_MRPT_TC_15 |
| **Title** | Verify the footer action bar is not rendered when no class is selected |
| **Linked Requirement** | #4 — Verify class selection checkbox |
| **Type** | Edge |
| **Priority** | Medium |
| **Preconditions** | Logged in as school-admin <REPORTS_ADMIN_USER>; school "Cqa Test Ashish School 1 (key VED-NEH-KVU)" opened; "Create report" clicked so the class-selection step is displayed. |
| **Test Steps** | 1. Ensure no class checkbox is ticked.<br>2. Observe the section heading and the bottom of the page. |
| **Test Data** | — |
| **Expected Result** | The section heading reads "Select classes" with no "(N)" suffix, and no footer bar is present — there is no "Continue" control by which the report-configuration step could be reached. |
| **Remarks** | Verified live 2026-08-26: the footer panel is genuinely ABSENT from the DOM at zero selection, not merely a disabled button. An automated assertion of the form "Continue is disabled" would fail to find the element at all — assert absence instead. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |

---

| Field | Value |
|---|---|
| **S.No.** | 16 |
| **Test Case ID** | TST_MRPT_TC_16 |
| **Title** | Verify the selection count decreases when a selected class checkbox is unticked |
| **Linked Requirement** | #4 — Verify class selection checkbox |
| **Type** | Edge |
| **Priority** | Medium |
| **Preconditions** | Logged in as school-admin <REPORTS_ADMIN_USER>; school "Cqa Test Ashish School 1 (key VED-NEH-KVU)" opened; "Create report" clicked so the class-selection step is displayed. |
| **Test Steps** | 1. Tick two class checkboxes and confirm the heading reads "Select classes(2)".<br>2. Untick one of them.<br>3. Observe the heading and the footer bar. |
| **Test Data** | Two classes from VED-NEH-KVU |
| **Expected Result** | The heading returns to "Select classes(1)" and the footer summary returns to "You have selected 1 class with a total of 1 student". |
| **Remarks** | Unticking the last remaining class should also remove the footer bar entirely — cross-check against TST_MRPT_TC_15. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |

---

| Field | Value |
|---|---|
| **S.No.** | 17 |
| **Test Case ID** | TST_MRPT_TC_17 |
| **Title** | Verify the documented 1500-class selection limit is enforced when more classes are selected |
| **Linked Requirement** | #4 — Verify class selection checkbox |
| **Type** | Edge |
| **Priority** | Low |
| **Preconditions** | A school holding more than 1500 classes, with the class-selection step open. |
| **Test Steps** | 1. Select classes until the count exceeds 1500.<br>2. Observe the heading, the footer bar and the "Continue" button. |
| **Test Data** | >1500 classes |
| **Expected Result** | [ASSUMED] Selection is capped at 1500 and the product surfaces the limit it states on screen ("You can include up to 1500 classes"). |
| **Remarks** | BLOCKED at design time. The cap text is captured verbatim live, but VED-NEH-KVU holds only 6 classes so the cap cannot be reached. UNBLOCK: a dedicated school seeded with >1500 classes, or a product/API confirmation. Whether the cap blocks further ticks or raises a message is unknown. |
| **Actual Result** | *(blank in design)* |
| **Status** | **Blocked** |
| **Comments / Defect ID** | Blocked at design time — no school available with >1500 classes. |

---

### Requirement #5 — Verify Cancel button functionality

| Field | Value |
|---|---|
| **S.No.** | 18 |
| **Test Case ID** | TST_MRPT_TC_18 |
| **Title** | Verify the Reports tab is restored and no report is created when "Cancel" is used on the class-selection step |
| **Linked Requirement** | #5 — Verify Cancel button functionality |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as school-admin <REPORTS_ADMIN_USER>; school "Cqa Test Ashish School 1 (key VED-NEH-KVU)" opened; "Create report" clicked so the class-selection step is displayed. |
| **Test Steps** | 1. Tick one class checkbox so the footer bar appears.<br>2. Click "Cancel" in the footer bar.<br>3. Observe the page and the Reports list. |
| **Test Data** | Class: "Gated LP Class" (4mG6-9Jkf) |
| **Expected Result** | The app returns to /admin/admin/org_<slug>/reports and the Reports heading count is unchanged — no report has been created. |
| **Remarks** | This is the step-1 Cancel. A SECOND, separate Cancel exists inside the "Create report" dialog (TST_MRPT_TC_19) — the two must not be conflated. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |

---

| Field | Value |
|---|---|
| **S.No.** | 19 |
| **Test Case ID** | TST_MRPT_TC_19 |
| **Title** | Verify the report-configuration dialog closes without creating a report when its "Cancel" is used |
| **Linked Requirement** | #5 — Verify Cancel button functionality |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | Logged in as school-admin <REPORTS_ADMIN_USER>; school "Cqa Test Ashish School 1 (key VED-NEH-KVU)" opened; "Create report" clicked so the class-selection step is displayed. |
| **Test Steps** | 1. Tick one class checkbox.<br>2. Click "Continue" to open the "Create report" dialog.<br>3. Choose a report type.<br>4. Click "Cancel" in the dialog.<br>5. Observe the page and the Reports list. |
| **Test Data** | Class: "Gated LP Class" · Report type: "Class summary" |
| **Expected Result** | [ASSUMED] The dialog closes and the class-selection step is shown again with the class still selected; no report is created. |
| **Remarks** | [ASSUMED] — whether the dialog Cancel preserves the class selection, clears it, or returns all the way to the Reports tab was NOT verified live. Confirm before automating. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |

---

| Field | Value |
|---|---|
| **S.No.** | 20 |
| **Test Case ID** | TST_MRPT_TC_20 |
| **Title** | Verify the report-configuration dialog closes without creating a report when its "Close" control is used |
| **Linked Requirement** | #5 — Verify Cancel button functionality |
| **Type** | Edge |
| **Priority** | Low |
| **Preconditions** | Logged in as school-admin <REPORTS_ADMIN_USER>; school "Cqa Test Ashish School 1 (key VED-NEH-KVU)" opened; "Create report" clicked so the class-selection step is displayed. |
| **Test Steps** | 1. Tick one class checkbox.<br>2. Click "Continue" to open the "Create report" dialog.<br>3. Click the dialog's "Close" (X) control.<br>4. Observe the page and the Reports list. |
| **Test Data** | Class: "Gated LP Class" |
| **Expected Result** | [ASSUMED] The dialog closes with the same outcome as its "Cancel" button, and no report is created. |
| **Remarks** | [ASSUMED] — the dialog exposes a "Close" control distinct from "Cancel" (both captured live in the pre-rendered DOM). Verify the two behave identically rather than assuming it. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |

---

### Requirement #6 — Verify Class summary report from beginning

| Field | Value |
|---|---|
| **S.No.** | 21 |
| **Test Case ID** | TST_MRPT_TC_21 |
| **Title** | Verify a Class summary report is created and listed for download when "From the beginning" is selected |
| **Linked Requirement** | #6 — Verify Class summary report from beginning |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as school-admin <REPORTS_ADMIN_USER>; school "Cqa Test Ashish School 1 (key VED-NEH-KVU)" opened; "Create report" clicked so the class-selection step is displayed. |
| **Test Steps** | 1. Select one class (e.g. "Gated LP Class", key 4mG6-9Jkf) using its row checkbox.<br>2. Click "Continue" in the footer bar.<br>3. In the "Create report" dialog open the "Report type" dropdown and choose "Class summary".<br>4. Leave "Date range" on the default "From the beginning".<br>5. Leave "Only include items that contribute to grade calculation" unchecked.<br>6. Click "Submit".<br>7. Click "Back to Reports". |
| **Test Data** | Class: "Gated LP Class" (4mG6-9Jkf) · Report type: "Class summary" · Date range: From the beginning |
| **Expected Result** | After step 6 the confirmation dialog reads "We are preparing your report" and "We will notify you when your Class summary report is ready to download", offering "Create another report" and "Back to Reports".<br>After step 7 the Reports heading count increases by one and a new row carrying a "New" badge shows: Report type = "Class summary"; Classes = 1; Students = 1; Items = "All items"; Date range = "All student data (up to - <TODAY>)"; Date created = <TODAY>; a file size; and a "Download" link. |
| **Remarks** | Grounded live for Class summary on 2026-08-26 — the row rendered "All items" / "All student data (up to - Aug 26, 2026)" / "496 Bytes" / Download, and generation completed within seconds despite the "we will notify you" wording. This is the fully grounded case; the other five follow the identical flow. CREATES REAL DATA: a report on the school, auto-expiring after 60 days. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |

---

### Requirement #7 — Verify Class detailed data report from beginning

| Field | Value |
|---|---|
| **S.No.** | 22 |
| **Test Case ID** | TST_MRPT_TC_22 |
| **Title** | Verify a Class detailed data report is created and listed for download when "From the beginning" is selected |
| **Linked Requirement** | #7 — Verify Class detailed data report from beginning |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as school-admin <REPORTS_ADMIN_USER>; school "Cqa Test Ashish School 1 (key VED-NEH-KVU)" opened; "Create report" clicked so the class-selection step is displayed. |
| **Test Steps** | 1. Select one class (e.g. "Gated LP Class", key 4mG6-9Jkf) using its row checkbox.<br>2. Click "Continue" in the footer bar.<br>3. In the "Create report" dialog open the "Report type" dropdown and choose "Class detailed data".<br>4. Leave "Date range" on the default "From the beginning".<br>5. Leave "Only include items that contribute to grade calculation" unchecked.<br>6. Click "Submit".<br>7. Click "Back to Reports". |
| **Test Data** | Class: "Gated LP Class" (4mG6-9Jkf) · Report type: "Class detailed data" · Date range: From the beginning |
| **Expected Result** | After step 6 the confirmation dialog reads "We are preparing your report" and "We will notify you when your Class detailed data report is ready to download", offering "Create another report" and "Back to Reports".<br>After step 7 the Reports heading count increases by one and a new row carrying a "New" badge shows: Report type = "Class detailed data"; Classes = 1; Students = 1; Items = "All items"; Date range = "All student data (up to - <TODAY>)"; Date created = <TODAY>; a file size; and a "Download" link. |
| **Remarks** | Grounded live for Class summary on 2026-08-26 — the row rendered "All items" / "All student data (up to - Aug 26, 2026)" / "496 Bytes" / Download, and generation completed within seconds despite the "we will notify you" wording. [ASSUMED] for this report type — the report-type value and its availability were verified live, but the resulting row was not. The row shape is inherited from the grounded Class summary run. CREATES REAL DATA: a report on the school, auto-expiring after 60 days. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |

---

### Requirement #8 — Verify Class daily data report from beginning

| Field | Value |
|---|---|
| **S.No.** | 23 |
| **Test Case ID** | TST_MRPT_TC_23 |
| **Title** | Verify a Class daily data report is created and listed for download when "From the beginning" is selected |
| **Linked Requirement** | #8 — Verify Class daily data report from beginning |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as school-admin <REPORTS_ADMIN_USER>; school "Cqa Test Ashish School 1 (key VED-NEH-KVU)" opened; "Create report" clicked so the class-selection step is displayed. |
| **Test Steps** | 1. Select one class (e.g. "Gated LP Class", key 4mG6-9Jkf) using its row checkbox.<br>2. Click "Continue" in the footer bar.<br>3. In the "Create report" dialog open the "Report type" dropdown and choose "Class daily data".<br>4. Leave "Date range" on the default "From the beginning".<br>5. Leave "Only include items that contribute to grade calculation" unchecked.<br>6. Click "Submit".<br>7. Click "Back to Reports". |
| **Test Data** | Class: "Gated LP Class" (4mG6-9Jkf) · Report type: "Class daily data" · Date range: From the beginning |
| **Expected Result** | After step 6 the confirmation dialog reads "We are preparing your report" and "We will notify you when your Class daily data report is ready to download", offering "Create another report" and "Back to Reports".<br>After step 7 the Reports heading count increases by one and a new row carrying a "New" badge shows: Report type = "Class daily data"; Classes = 1; Students = 1; Items = "All items"; Date range = "All student data (up to - <TODAY>)"; Date created = <TODAY>; a file size; and a "Download" link. |
| **Remarks** | Grounded live for Class summary on 2026-08-26 — the row rendered "All items" / "All student data (up to - Aug 26, 2026)" / "496 Bytes" / Download, and generation completed within seconds despite the "we will notify you" wording. [ASSUMED] for this report type — the report-type value and its availability were verified live, but the resulting row was not. The row shape is inherited from the grounded Class summary run. CREATES REAL DATA: a report on the school, auto-expiring after 60 days. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |

---

### Requirement #9 — Verify Aggregated data report from beginning

| Field | Value |
|---|---|
| **S.No.** | 24 |
| **Test Case ID** | TST_MRPT_TC_24 |
| **Title** | Verify a Aggregated data report is created and listed for download when "From the beginning" is selected |
| **Linked Requirement** | #9 — Verify Aggregated data report from beginning |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as school-admin <REPORTS_ADMIN_USER>; school "Cqa Test Ashish School 1 (key VED-NEH-KVU)" opened; "Create report" clicked so the class-selection step is displayed. |
| **Test Steps** | 1. Select one class (e.g. "Gated LP Class", key 4mG6-9Jkf) using its row checkbox.<br>2. Click "Continue" in the footer bar.<br>3. In the "Create report" dialog open the "Report type" dropdown and choose "Aggregated data".<br>4. Leave "Date range" on the default "From the beginning".<br>5. Leave "Only include items that contribute to grade calculation" unchecked.<br>6. Click "Submit".<br>7. Click "Back to Reports". |
| **Test Data** | Class: "Gated LP Class" (4mG6-9Jkf) · Report type: "Aggregated data" · Date range: From the beginning |
| **Expected Result** | After step 6 the confirmation dialog reads "We are preparing your report" and "We will notify you when your Aggregated data report is ready to download", offering "Create another report" and "Back to Reports".<br>After step 7 the Reports heading count increases by one and a new row carrying a "New" badge shows: Report type = "Aggregated data"; Classes = 1; Students = 1; Items = "All items"; Date range = "All student data (up to - <TODAY>)"; Date created = <TODAY>; a file size; and a "Download" link. |
| **Remarks** | Grounded live for Class summary on 2026-08-26 — the row rendered "All items" / "All student data (up to - Aug 26, 2026)" / "496 Bytes" / Download, and generation completed within seconds despite the "we will notify you" wording. [ASSUMED] for this report type — the report-type value and its availability were verified live, but the resulting row was not. The row shape is inherited from the grounded Class summary run. CREATES REAL DATA: a report on the school, auto-expiring after 60 days. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |

---

### Requirement #10 — Verify Assignments summary report from beginning

| Field | Value |
|---|---|
| **S.No.** | 25 |
| **Test Case ID** | TST_MRPT_TC_25 |
| **Title** | Verify a Assignments summary report is created and listed for download when "From the beginning" is selected |
| **Linked Requirement** | #10 — Verify Assignments summary report from beginning |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | Logged in as school-admin <REPORTS_ADMIN_USER>; school "Cqa Test Ashish School 1 (key VED-NEH-KVU)" opened; "Create report" clicked so the class-selection step is displayed. |
| **Test Steps** | 1. Select one class (e.g. "Gated LP Class", key 4mG6-9Jkf) using its row checkbox.<br>2. Click "Continue" in the footer bar.<br>3. In the "Create report" dialog open the "Report type" dropdown and choose "Assignments summary".<br>4. Leave "Date range" on the default "From the beginning".<br>5. Leave "Only include items that contribute to grade calculation" unchecked.<br>6. Click "Submit".<br>7. Click "Back to Reports". |
| **Test Data** | Class: "Gated LP Class" (4mG6-9Jkf) · Report type: "Assignments summary" · Date range: From the beginning |
| **Expected Result** | After step 6 the confirmation dialog reads "We are preparing your report" and "We will notify you when your Assignments summary report is ready to download", offering "Create another report" and "Back to Reports".<br>After step 7 the Reports heading count increases by one and a new row carrying a "New" badge shows: Report type = "Assignments summary"; Classes = 1; Students = 1; Items = "All items"; Date range = "All student data (up to - <TODAY>)"; Date created = <TODAY>; a file size; and a "Download" link. |
| **Remarks** | Grounded live for Class summary on 2026-08-26 — the row rendered "All items" / "All student data (up to - Aug 26, 2026)" / "496 Bytes" / Download, and generation completed within seconds despite the "we will notify you" wording. [ASSUMED] for this report type — the report-type value and its availability were verified live, but the resulting row was not. The row shape is inherited from the grounded Class summary run. CREATES REAL DATA: a report on the school, auto-expiring after 60 days. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |

---

### Requirement #11 — Verify Assignments detailed data report from beginning

| Field | Value |
|---|---|
| **S.No.** | 26 |
| **Test Case ID** | TST_MRPT_TC_26 |
| **Title** | Verify a Assignments detailed data report is created and listed for download when "From the beginning" is selected |
| **Linked Requirement** | #11 — Verify Assignments detailed data report from beginning |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | Logged in as school-admin <REPORTS_ADMIN_USER>; school "Cqa Test Ashish School 1 (key VED-NEH-KVU)" opened; "Create report" clicked so the class-selection step is displayed. |
| **Test Steps** | 1. Select one class (e.g. "Gated LP Class", key 4mG6-9Jkf) using its row checkbox.<br>2. Click "Continue" in the footer bar.<br>3. In the "Create report" dialog open the "Report type" dropdown and choose "Assignments detailed data".<br>4. Leave "Date range" on the default "From the beginning".<br>5. Leave "Only include items that contribute to grade calculation" unchecked.<br>6. Click "Submit".<br>7. Click "Back to Reports". |
| **Test Data** | Class: "Gated LP Class" (4mG6-9Jkf) · Report type: "Assignments detailed data" · Date range: From the beginning |
| **Expected Result** | After step 6 the confirmation dialog reads "We are preparing your report" and "We will notify you when your Assignments detailed data report is ready to download", offering "Create another report" and "Back to Reports".<br>After step 7 the Reports heading count increases by one and a new row carrying a "New" badge shows: Report type = "Assignments detailed data"; Classes = 1; Students = 1; Items = "All items"; Date range = "All student data (up to - <TODAY>)"; Date created = <TODAY>; a file size; and a "Download" link. |
| **Remarks** | Grounded live for Class summary on 2026-08-26 — the row rendered "All items" / "All student data (up to - Aug 26, 2026)" / "496 Bytes" / Download, and generation completed within seconds despite the "we will notify you" wording. [ASSUMED] for this report type — the report-type value and its availability were verified live, but the resulting row was not. The row shape is inherited from the grounded Class summary run. CREATES REAL DATA: a report on the school, auto-expiring after 60 days. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |

---

### Requirement #12 — Verify Custom date range reports

| Field | Value |
|---|---|
| **S.No.** | 27 |
| **Test Case ID** | TST_MRPT_TC_27 |
| **Title** | Verify the custom date-range controls become available when a date-capable report type is selected |
| **Linked Requirement** | #12 — Verify Custom date range reports |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as school-admin <REPORTS_ADMIN_USER>; school "Cqa Test Ashish School 1 (key VED-NEH-KVU)" opened; "Create report" clicked so the class-selection step is displayed. |
| **Test Steps** | 1. Tick one class and click "Continue".<br>2. Observe the "Date range" radios BEFORE choosing a report type.<br>3. Choose report type "Class summary".<br>4. Observe the "Date range" radios again.<br>5. Select "Custom date range".<br>6. Observe the fields that appear. |
| **Test Data** | Report type: Class summary |
| **Expected Result** | At step 2 both date-range radios are DISABLED, "From the beginning" is pre-selected and "Submit" is disabled. After step 3 both radios and "Submit" become enabled. The radios read "From the beginning" / "Export all student data" and "Custom date range" / "Export data based on specific dates". After step 5 a "From" and a "To" field appear, pre-filled with the last seven days (start = today minus 6 days, end = today). |
| **Remarks** | All states verified live 2026-08-26: radios disabled until a report type is chosen; the defaults were "Thu, Aug 20, 2026" to "Wed, Aug 26, 2026". Repeat for Class detailed data, Class daily data and Aggregated data — all four verified date-capable. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |

---

| Field | Value |
|---|---|
| **S.No.** | 28 |
| **Test Case ID** | TST_MRPT_TC_28 |
| **Title** | Verify a report is created over the chosen window when a custom date range is submitted |
| **Linked Requirement** | #12 — Verify Custom date range reports |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as school-admin <REPORTS_ADMIN_USER>; school "Cqa Test Ashish School 1 (key VED-NEH-KVU)" opened; "Create report" clicked so the class-selection step is displayed. |
| **Test Steps** | 1. Tick one class and click "Continue".<br>2. Choose report type "Class summary".<br>3. Select "Custom date range".<br>4. Set "From" and "To" to a window inside the allowed range using the pickers.<br>5. Click "Submit".<br>6. Click "Back to Reports". |
| **Test Data** | Class: "Gated LP Class" · Report type: Class summary · From/To: a valid past window |
| **Expected Result** | The confirmation dialog appears as in TST_MRPT_TC_21, and the new Reports row shows a "Date range" value reflecting the chosen window rather than "All student data (up to - <TODAY>)". |
| **Remarks** | [ASSUMED] the exact "Date range" cell format for a custom window — only the "From the beginning" form ("All student data (up to - Aug 26, 2026)") was captured live. Listed in Open items. Repeat for the other three date-capable types. CREATES REAL DATA. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |

---

| Field | Value |
|---|---|
| **S.No.** | 29 |
| **Test Case ID** | TST_MRPT_TC_29 |
| **Title** | Verify the start date cannot be set earlier than the product floor of 1 January 2022 |
| **Linked Requirement** | #12 — Verify Custom date range reports |
| **Type** | Edge |
| **Priority** | Medium |
| **Preconditions** | Logged in as school-admin <REPORTS_ADMIN_USER>; school "Cqa Test Ashish School 1 (key VED-NEH-KVU)" opened; "Create report" clicked so the class-selection step is displayed. |
| **Test Steps** | 1. Open the "Create report" dialog, choose "Class summary" and select "Custom date range".<br>2. Open the "From" date picker.<br>3. Navigate back past January 2022. |
| **Test Data** | Boundary: 2022-01-01 |
| **Expected Result** | Dates before 1 January 2022 are not selectable; 1 January 2022 itself is selectable. |
| **Remarks** | Verified live 2026-08-26 from the field attributes: the "From" input carries min="2021-12-31T18:30:00.000Z", i.e. 2022-01-01 in IST. Exactly the kind of field constraint admin-shared.md §A3 requires be read before writing boundary cases. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |

---

| Field | Value |
|---|---|
| **S.No.** | 30 |
| **Test Case ID** | TST_MRPT_TC_30 |
| **Title** | Verify neither date can be set later than today |
| **Linked Requirement** | #12 — Verify Custom date range reports |
| **Type** | Edge |
| **Priority** | Medium |
| **Preconditions** | Logged in as school-admin <REPORTS_ADMIN_USER>; school "Cqa Test Ashish School 1 (key VED-NEH-KVU)" opened; "Create report" clicked so the class-selection step is displayed. |
| **Test Steps** | 1. Open the "Create report" dialog, choose "Class summary" and select "Custom date range".<br>2. Open the "From" picker and attempt to select tomorrow.<br>3. Repeat for the "To" picker. |
| **Test Data** | Boundary: today |
| **Expected Result** | All dates after today are disabled in both pickers; today is selectable in both. |
| **Remarks** | Verified live 2026-08-26: both inputs carry max="2026-08-26T18:29:59.999Z" (end of the current day). Reports cover past activity only. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |

---

| Field | Value |
|---|---|
| **S.No.** | 31 |
| **Test Case ID** | TST_MRPT_TC_31 |
| **Title** | Verify the end date cannot be set earlier than the selected start date |
| **Linked Requirement** | #12 — Verify Custom date range reports |
| **Type** | Edge |
| **Priority** | Medium |
| **Preconditions** | Logged in as school-admin <REPORTS_ADMIN_USER>; school "Cqa Test Ashish School 1 (key VED-NEH-KVU)" opened; "Create report" clicked so the class-selection step is displayed. |
| **Test Steps** | 1. Open the "Create report" dialog, choose "Class summary" and select "Custom date range".<br>2. Note the "From" value.<br>3. Open the "To" picker and attempt to select a date before it.<br>4. Change "From" to a different date and re-open the "To" picker. |
| **Test Data** | Boundary: start date |
| **Expected Result** | Dates before the current "From" value are disabled in the "To" picker; the start date itself is selectable (a single-day range). The floor moves when "From" is changed. |
| **Remarks** | Verified live 2026-08-26: the "To" input carried min="2026-08-19T18:30:00.000Z" while "From" was Aug 20, 2026 — the end-date floor tracks the chosen start date. Step 4 (that the floor moves) is [ASSUMED]. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |

---

| Field | Value |
|---|---|
| **S.No.** | 32 |
| **Test Case ID** | TST_MRPT_TC_32 |
| **Title** | Verify a date cannot be entered by typing because the date fields are read-only |
| **Linked Requirement** | #12 — Verify Custom date range reports |
| **Type** | Negative |
| **Priority** | Medium |
| **Preconditions** | Logged in as school-admin <REPORTS_ADMIN_USER>; school "Cqa Test Ashish School 1 (key VED-NEH-KVU)" opened; "Create report" clicked so the class-selection step is displayed. |
| **Test Steps** | 1. Open the "Create report" dialog, choose "Class summary" and select "Custom date range".<br>2. Click into the "From" field and type "01/01/2020".<br>3. Repeat for the "To" field. |
| **Test Data** | Typed input: 01/01/2020 |
| **Expected Result** | Neither field accepts typed input; both retain their picker-set values. Dates can be set only through the calendar pickers. |
| **Remarks** | Verified live 2026-08-26: both "From" and "To" inputs are readOnly. This rules out the whole family of "type an invalid date" negative cases — the pickers are the only input path. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |

---

| Field | Value |
|---|---|
| **S.No.** | 33 |
| **Test Case ID** | TST_MRPT_TC_33 |
| **Title** | Verify the custom date-range option is unavailable for report types that do not support it |
| **Linked Requirement** | #12 — Verify Custom date range reports |
| **Type** | Negative |
| **Priority** | High |
| **Preconditions** | Logged in as school-admin <REPORTS_ADMIN_USER>; school "Cqa Test Ashish School 1 (key VED-NEH-KVU)" opened; "Create report" clicked so the class-selection step is displayed. |
| **Test Steps** | 1. Tick one class and click "Continue".<br>2. Choose report type "Assignments summary" and observe the "Date range" radios.<br>3. Repeat for "Assignments detailed data".<br>4. Repeat for "Estimated CEFR level". |
| **Test Data** | Report types: Assignments summary, Assignments detailed data, Estimated CEFR level |
| **Expected Result** | For all three types the "Custom date range" radio remains DISABLED and "From the beginning" stays selected — no "From"/"To" fields can be produced. |
| **Remarks** | Verified live 2026-08-26 across all seven types. Date range is supported by exactly four (Class summary, Class detailed data, Class daily data, Aggregated data), which matches the four named in scenario #12 — the scenario list is correct, and this case pins the negative half of it. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |

---

### Requirement #13 — Verify reports with custom grade settings applied

| Field | Value |
|---|---|
| **S.No.** | 34 |
| **Test Case ID** | TST_MRPT_TC_34 |
| **Title** | Verify the custom grade-settings option is offered and unticked by default for the report types that support it |
| **Linked Requirement** | #13 — Verify reports with custom grade settings applied |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as school-admin <REPORTS_ADMIN_USER>; school "Cqa Test Ashish School 1 (key VED-NEH-KVU)" opened; "Create report" clicked so the class-selection step is displayed. |
| **Test Steps** | 1. Tick one class and click "Continue".<br>2. Choose report type "Class summary".<br>3. Observe the checkbox labelled "Only include items that contribute to grade calculation".<br>4. Repeat for Class detailed data, Class daily data, Aggregated data, Assignments summary and Assignments detailed data. |
| **Test Data** | The six grade-capable report types |
| **Expected Result** | For all six types the checkbox "Only include items that contribute to grade calculation" is present, ENABLED and unticked by default. |
| **Remarks** | Verified live 2026-08-26 across all seven types — exactly these six offer it, matching the six listed in scenario #13. This checkbox is the product's expression of "custom grade settings applied (eg: exclude a component)": the exclusion itself is configured on the class's Class grade settings page (module CGST), and this checkbox makes the report honour it. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |

---

| Field | Value |
|---|---|
| **S.No.** | 35 |
| **Test Case ID** | TST_MRPT_TC_35 |
| **Title** | Verify the created report is restricted to grade-contributing items when the custom grade option is ticked |
| **Linked Requirement** | #13 — Verify reports with custom grade settings applied |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as school-admin <REPORTS_ADMIN_USER>; school "Cqa Test Ashish School 1 (key VED-NEH-KVU)" opened; "Create report" clicked so the class-selection step is displayed. The chosen class has Class grade settings configured so that at least one component is excluded from grade calculation. |
| **Test Steps** | 1. Tick a class whose grade settings exclude a component, and click "Continue".<br>2. Choose report type "Class summary".<br>3. Tick "Only include items that contribute to grade calculation".<br>4. Click "Submit".<br>5. Click "Back to Reports".<br>6. Observe the new row's "Items" column.<br>7. Download the report and compare its contents with the same report created without the option. |
| **Test Data** | Class with an excluded component · Report type: Class summary · Custom grade option: ticked |
| **Expected Result** | [ASSUMED] The new Reports row shows an "Items" value other than "All items", reflecting the restriction, and the downloaded report omits the excluded component. |
| **Remarks** | [ASSUMED] — the "Items" cell reads "All items" when the option is UNticked (verified live 2026-08-26); the ticked value was NOT captured. Listed in Open items. Also requires a class with an excluded component — verify one exists on VED-NEH-KVU or configure one via Class grade settings (CGST) first. CREATES REAL DATA. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |

---

| Field | Value |
|---|---|
| **S.No.** | 36 |
| **Test Case ID** | TST_MRPT_TC_36 |
| **Title** | Verify the custom grade-settings option is unavailable for the Estimated CEFR level report |
| **Linked Requirement** | #13 — Verify reports with custom grade settings applied |
| **Type** | Negative |
| **Priority** | Medium |
| **Preconditions** | Logged in as school-admin <REPORTS_ADMIN_USER>; school "Cqa Test Ashish School 1 (key VED-NEH-KVU)" opened; "Create report" clicked so the class-selection step is displayed. |
| **Test Steps** | 1. Tick one class and click "Continue".<br>2. Choose report type "Estimated CEFR level".<br>3. Observe the "Only include items that contribute to grade calculation" checkbox. |
| **Test Data** | Report type: Estimated CEFR level |
| **Expected Result** | The checkbox is DISABLED and cannot be ticked. |
| **Remarks** | Verified live 2026-08-26. Estimated CEFR level is the only one of the seven types supporting neither a custom date range nor custom grade settings — which is why it appears in neither scenario #12 nor #13. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |

---

### Requirement #14 — Verify Estimated CEFR level report from beginning

| Field | Value |
|---|---|
| **S.No.** | 37 |
| **Test Case ID** | TST_MRPT_TC_37 |
| **Title** | Verify a Estimated CEFR level report is created and listed for download when "From the beginning" is selected |
| **Linked Requirement** | #14 — Verify Estimated CEFR level report from beginning |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as school-admin <REPORTS_ADMIN_USER>; school "Cqa Test Ashish School 1 (key VED-NEH-KVU)" opened; "Create report" clicked so the class-selection step is displayed. |
| **Test Steps** | 1. Select one class (e.g. "Gated LP Class", key 4mG6-9Jkf) using its row checkbox.<br>2. Click "Continue" in the footer bar.<br>3. In the "Create report" dialog open the "Report type" dropdown and choose "Estimated CEFR level".<br>4. Leave "Date range" on the default "From the beginning".<br>5. Leave "Only include items that contribute to grade calculation" unchecked.<br>6. Click "Submit".<br>7. Click "Back to Reports". |
| **Test Data** | Class: "Gated LP Class" (4mG6-9Jkf) · Report type: "Estimated CEFR level" · Date range: From the beginning |
| **Expected Result** | After step 6 the confirmation dialog reads "We are preparing your report" and "We will notify you when your Estimated CEFR level report is ready to download", offering "Create another report" and "Back to Reports".<br>After step 7 the Reports heading count increases by one and a new row carrying a "New" badge shows: Report type = "Estimated CEFR level"; Classes = 1; Students = 1; Items = "All items"; Date range = "All student data (up to - <TODAY>)"; Date created = <TODAY>; a file size; and a "Download" link. |
| **Remarks** | IN SCOPE — confirmed with the requester on 2026-08-26 that this seventh report type was a genuine omission from AdminApp_Report tab.xlsx, not a deliberate exclusion. It is therefore treated as a first-class report-type scenario alongside #6–#11 rather than as added coverage. Its dropdown description reads "Gives an indication of your students' level based on all tests submitted." Estimated CEFR level supports NEITHER a custom date range NOR custom grade settings (verified live 2026-08-26), so it is correctly absent from scenarios #12 and #13; those exclusions are pinned by TST_MRPT_TC_33 and TST_MRPT_TC_36. [ASSUMED] for the resulting Reports row — the report-type value and its availability were verified live, but the row was not; its shape is inherited from the grounded Class summary run. CREATES REAL DATA: a report on the school, auto-expiring after 60 days. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |

---

### Requirement #15 — Added coverage: report generation error paths

| Field | Value |
|---|---|
| **S.No.** | 38 |
| **Test Case ID** | TST_MRPT_TC_38 |
| **Title** | Verify the failure dialog is shown when report generation fails |
| **Linked Requirement** | #15 — Added coverage: report generation error paths |
| **Type** | Negative |
| **Priority** | Medium |
| **Preconditions** | The class-selection step is open and the report-generation backend is forced to fail. |
| **Test Steps** | 1. Tick one class and click "Continue".<br>2. Choose any report type.<br>3. Click "Submit" while report generation is failing.<br>4. Observe the dialog. |
| **Test Data** | — |
| **Expected Result** | A dialog is shown headed "Sorry, something went wrong. The report you requested was not generated." offering "Try again" and "Back to Reports". |
| **Remarks** | BLOCKED at design time. The copy above was captured verbatim from the PRE-RENDERED DOM on 2026-08-26 (admin-shared.md §A6 free-capture), so the expected result is verified even though the state was never reached. UNBLOCK: backend fault injection or a stubbed failure response. A second, separate failure surface exists on the Reports tab itself — see TST_MRPT_TC_39. |
| **Actual Result** | *(blank in design)* |
| **Status** | **Blocked** |
| **Comments / Defect ID** | Blocked at design time — report generation failure cannot be forced on Thor. |

---

| Field | Value |
|---|---|
| **S.No.** | 39 |
| **Test Case ID** | TST_MRPT_TC_39 |
| **Title** | Verify the partial-failure detail modal lists the excluded classes when a report is created with errors |
| **Linked Requirement** | #15 — Added coverage: report generation error paths |
| **Type** | Negative |
| **Priority** | Medium |
| **Preconditions** | The Reports tab holds a report that was generated with per-class errors. |
| **Test Steps** | 1. Open the Reports tab.<br>2. Open the error detail for a report created with errors.<br>3. Observe the modal. |
| **Test Data** | — |
| **Expected Result** | A modal headed "Report created with errors" states "<N> out of <TOTAL> classes were not included in your report due to the errors shown below" above a table with the columns "Class name", "Class key" and "Error message", and offers "Download report". |
| **Remarks** | BLOCKED at design time. Copy captured from the pre-rendered DOM on the Reports tab 2026-08-26. Requires a multi-class report in which some classes fail — cannot be produced on demand. UNBLOCK: fault injection, or a class deliberately placed in a state that fails report generation. |
| **Actual Result** | *(blank in design)* |
| **Status** | **Blocked** |
| **Comments / Defect ID** | Blocked at design time — a partially-failing report cannot be produced on Thor. |

---

## Open items / `[ASSUMED]` to confirm on the next live pass

1. **Search semantics** (`TST_MRPT_TC_4`, `TC_6`, `TC_7`): whether the class-picker search is
   submit-driven, and whether it is a **substring** match (like the Classes tab) or **fuzzy** (like
   the Library tab). `admin-shared.md` §A4 warns these differ per tab. The no-results copy was not
   captured.
2. **"Clear all" behaviour** (`TST_MRPT_TC_10`): whether it applies immediately or still requires
   `Apply`. The highest-risk assumption in the filter group.
3. **Filter summary label after applying** (`TST_MRPT_TC_9`): only the unfiltered
   `All class statuses` value was captured.
4. **Plural footer wording** (`TST_MRPT_TC_14`): only the singular `1 class` / `1 student` form was
   seen. Also whether "Select all classes" spans the whole school or only the filtered/searched rows.
5. **Dialog Cancel and Close semantics** (`TST_MRPT_TC_19`, `TC_20`): whether either preserves the
   class selection, and whether the two behave identically.
6. **The "Date range" cell for a custom window** (`TST_MRPT_TC_28`): only the
   `All student data (up to - <date>)` form was captured.
7. **The "Items" cell when the grade option is ticked** (`TST_MRPT_TC_35`): reads `All items` when
   unticked; the ticked value is unknown.
8. **Whether the end-date floor moves when `From` changes** (`TST_MRPT_TC_31`): the floor was
   observed tracking the initial `From` value, but not re-checked after changing it.
9. **Report row states not seen**: the 60-day expiry, any "Load more" on a long Reports list, and
   whether a report can be removed from the list (the failure dialog's pre-rendered footer mentions
   `Remove from the reports list`).
10. **Downloaded file contents** (`TST_MRPT_TC_21`–`TC_26`, `TC_35`): no report file was opened, so
    no case asserts on report contents. Scenarios #6–#11 are currently verified only to the point of
    a downloadable row.
11. **Blocked** — `TST_MRPT_TC_17` (needs a school with >1500 classes); `TST_MRPT_TC_38` and
    `TST_MRPT_TC_39` (need forced report-generation failure). Unblock notes are in each case's Remarks.

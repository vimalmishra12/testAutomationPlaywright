/**
 * Generates BOTH the .md document and the .xlsx register for the Reports tab manual
 * test-case set from _tcdata.js, so the two cannot drift (SKILL golden rule 6).
 *
 *   node _generate.js
 *
 * The .xlsx is then verifiable with:  npm run register -- dump <file>
 */

const fs = require("fs");
const path = require("path");
const ExcelJS = require("D:/testAutomation/QATestAutomation/testAutomation_v1.0/node_modules/exceljs");
const { TCS, REQS } = require("./_tcdata.js");

const BASE = "AdminApp_Reports_tab_test_cases";
const DATE = "2026-08-26";

const COLUMNS = [
  "S.No.", "Test Case ID", "Title", "Linked Requirement", "Type", "Priority",
  "Preconditions", "Test Steps", "Test Data", "Expected Result", "Remarks",
  "Actual Result", "Status", "Comments / Defect ID",
];

const rows = TCS.map((tc, i) => ({
  sno: i + 1,
  id: tc.id,
  title: tc.title,
  req: tc.req,
  type: tc.type,
  priority: tc.priority,
  pre: tc.pre,
  steps: tc.steps,
  data: tc.data,
  expected: tc.expected,
  remarks: tc.remarks,
  actual: "",
  status: tc.status || "Not Run",
  comments: tc.comments || "",
}));

const counts = rows.reduce((a, r) => ((a[r.type] = (a[r.type] || 0) + 1), a), {});
const blocked = rows.filter((r) => r.status === "Blocked");
const notRun = rows.filter((r) => r.status === "Not Run");

/* ------------------------------------------------------------------ Markdown */

function suffix(type) {
  return type === "Edge" ? " (E)" : type === "Negative" ? " (N)" : "";
}

function coverageMap() {
  return REQS.map((req) => {
    const mine = rows.filter((r) => r.req === req);
    const order = { Positive: 0, Edge: 1, Negative: 2 };
    const sorted = [...mine].sort((a, b) => order[a.type] - order[b.type]);
    const cell = sorted.map((r) => r.id.replace(/^TST_MRPT_/, "") + suffix(r.type)).join(", ");
    return "| " + req + " | " + (cell || "none") + " |";
  }).join("\n");
}

function tcTable(r) {
  const cell = (v) => String(v).replace(/\n/g, "<br>").replace(/\|/g, "\\|");
  const pairs = [
    ["S.No.", r.sno], ["Test Case ID", r.id], ["Title", r.title],
    ["Linked Requirement", r.req], ["Type", r.type], ["Priority", r.priority],
    ["Preconditions", r.pre], ["Test Steps", r.steps], ["Test Data", r.data],
    ["Expected Result", r.expected], ["Remarks", r.remarks],
    ["Actual Result", "*(blank in design)*"],
    ["Status", r.status === "Blocked" ? "**Blocked**" : r.status],
    ["Comments / Defect ID", r.comments ? cell(r.comments) : "*(blank in design)*"],
  ];
  return "| Field | Value |\n|---|---|\n"
    + pairs.map(([k, v]) => "| **" + k + "** | " + cell(v) + " |").join("\n");
}

function testCaseSections() {
  let out = "";
  for (const req of REQS) {
    const mine = rows.filter((r) => r.req === req);
    if (!mine.length) continue;
    out += "\n### Requirement " + req + "\n\n";
    out += mine.map(tcTable).join("\n\n---\n\n");
    out += "\n\n---\n";
  }
  return out;
}

const md = `# Manual Functional Test Cases — Cambridge One Admin App: Reports tab (Batch 1)

**Source:** \`AdminApp_Report tab.xlsx\` — 13 test scenarios for the school-admin Reports tab (the sheet is titled "Test Scenarios (Staff Tab)", a copy-paste leftover; every row is a Reports scenario).
**Module:** MRPT (Manage Reports) — *maps to the future \`manageReports.page.js\` page object when automated*
**App:** Cambridge One Admin App (NEMO microservice) — \`micro-nemo.comprodls.com\` (Thor)
**Page in scope:** Reports tab and the Create report flow — \`/admin/admin/org_<slug>/reports\` and \`/admin/admin/org_<slug>/reports/create\`
**Generated:** ${DATE} | **Total TCs:** ${rows.length} (${counts.Positive} Positive · ${counts.Edge} Edge · ${counts.Negative} Negative) — all 13 source scenarios covered, plus scenario #14 (a confirmed source omission) and one added-coverage group
**Execution status (${DATE}):** **0 of ${rows.length} TCs automated.** ${notRun.length} are Not Run and ${blocked.length} are Blocked at design time (${blocked.map((b) => b.id).join(", ")}).

**Batches:** Batch 1 — Reports tab and Create report flow (\`TST_MRPT_*\`, module MRPT, ${rows.length} TCs).

> **Ordering:** test cases are **grouped by Linked Requirement (scenario)** so every requirement's
> TCs sit together; within each group they run **Positive → Edge → Negative**. (This intentionally
> departs from \`manual-test-standard.md\`'s global P→E→N ordering, per the established Admin App
> convention.) **S.No.** is sequential in this grouped order; **Test Case IDs** are stable
> identifiers and therefore appear out of numeric sequence within a group.
>
> **Batch 1 scope (agreed):** all 13 scenarios from \`AdminApp_Report tab.xlsx\`. Nothing deferred.
> **Scenario #14 was added** for the Estimated CEFR level report type, confirmed by the requester as a
> genuine omission from the source workbook. A separate **added-coverage** group (#15) carries the two
> report-generation error paths the source list does not mention but the live product exposes.
>
> Unverified expected text is marked \`[ASSUMED]\`; environment-specific values use
> \`<PLACEHOLDER>\` (see Remarks).

**Module code note (${DATE}).** \`MRPT\` was chosen from the page object this screen will get —
\`manageReports.page.js\` — per AGENTS.md Rule 6, and it is the worked example in both that rule and
\`manual-test-standard.md\`. The manual and automation module codes therefore agree from the start,
avoiding the \`BCCF\` → \`CCLS\` re-mapping that Phase 1 incurred.

**Seven report types, not six — scenario #14 added (${DATE}).** The source scenario list names six
report types; the live product offers **seven**. The seventh is **Estimated CEFR level**, and the
requester has **confirmed this was a genuine omission from the source workbook, not a deliberate
exclusion**. It is therefore covered as a first-class report-type scenario — **#14, alongside #6–#11**
— by \`TST_MRPT_TC_37\`, not as added coverage.

Estimated CEFR level is the only type supporting **neither** a custom date range **nor** custom grade
settings (verified live across all seven), which is why it is correctly absent from scenarios #12 and
#13. Those two exclusions are pinned by \`TST_MRPT_TC_33\` and \`TST_MRPT_TC_36\`, so the type is fully
covered: one positive creation case plus both negative capability cases.

**Update the source workbook.** \`AdminApp_Report tab.xlsx\` still lists 13 scenarios and should gain a
14th — *"Verify Estimated CEFR level report from beginning"* — so the scenario register and this
document agree.

**Blocked cases (${DATE}).** ${blocked.length} cases are **Blocked on the day they were written**, not Not Run:
\`TST_MRPT_TC_17\` needs a school holding more than 1500 classes; \`TST_MRPT_TC_38\` and
\`TST_MRPT_TC_39\` need report generation to fail, which cannot be forced on Thor. Their **expected
results are nonetheless verified**, because the dialog copy was captured from the pre-rendered DOM
(\`admin-shared.md\` §A6) without ever reaching the state that raises it.

**Cases that create real data.** \`TST_MRPT_TC_21\`–\`TC_26\`, \`TC_28\`, \`TC_35\` and \`TC_37\` each create a
real report on the target school. Reports auto-expire after 60 days. This decides suite placement when
these are automated — they must not sit in a side-effect-free suite.

---

## Requirement → Test Case coverage map

| Linked Requirement (scenario) | Mapped TC IDs (P → E → N) |
|---|---|
${coverageMap()}

Every scenario in the source has at least one test case.

---

## Product reference (captured live ${DATE}, Thor · Cqa Test Ashish School 1 / VED-NEH-KVU · cqatestashish_admin@mailsac.com)

### Entry path and URLs

\`\`\`
My school accounts (/admin/admin/dashboard)
  └─ school card "Cqa Test Ashish School 1" (key VED-NEH-KVU)
       └─ left nav: CLASSES · STUDENTS · STAFF · LIBRARY · REPORTS
            └─ REPORTS            /admin/admin/org_cup_j9GskaJJmvDjmQZ9/reports
                 └─ Create report /admin/admin/org_cup_j9GskaJJmvDjmQZ9/reports/create
                      ├─ step 1  class selection (search · filter · checkboxes · Cancel/Continue)
                      └─ step 2  "Create report" dialog (report type · grade option · date range · Cancel/Submit)
\`\`\`

Once the school context is set, \`/reports/create\` **is** reachable by deep link — unlike the class
pages, which return \`/dashboard/error\` when deep-linked (\`admin-shared.md\` §A1). The school context
must still be established by clicking the school card first.

### Reports tab — empty state (verbatim)

| Element | Text |
|---|---|
| Heading | \`Reports (0)\` |
| Info line | \`Reports are available to download for up to 60 days\` |
| Empty title | \`No new reports available\` |
| Empty body | \`Your reports will appear here after you create them\` |
| Actions | \`Create report\` (header **and** empty-state) |

### Reports tab — populated state

Columns: \`Report type | Classes | Students | Items | Date range | Date created\`, then size and a
\`Download\` link. The row created during this capture read:

| Report type | Classes | Students | Items | Date range | Date created | Size |
|---|---|---|---|---|---|---|
| Class summary **New** | 1 | 1 | \`All items\` | \`All student data (up to - Aug 26, 2026)\` | Aug 26, 2026 | 496 Bytes |

A freshly created report carries a **New** badge. Despite the "we will notify you" wording, the
report was ready within seconds, and a notification badge appeared on the header bell.

### Step 1 — class selection

| Element | Detail |
|---|---|
| Heading | \`Select classes\` — gains \`(N)\` **only** once ≥1 class is ticked |
| Cap | \`You can include up to 1500 classes\` |
| Search | placeholder \`Search for class name or class key\`, \`maxlength="321"\`, plus a \`Search\` button |
| Filter | opens a panel headed \`Filter by\` |
| Filter statuses | \`Not started\` · \`Active\` · \`Ended\` · \`Expired\` · \`Deleted\` |
| Filter actions | \`Clear all\` · \`Apply\` · \`Close\`; summary label reads \`All class statuses\` when unfiltered |
| Select all | \`Select all classes\` |
| Sortable columns | Class name · Start date · End date · Students (Class key and Class status are **not** sortable) |
| Footer bar | **absent at zero selection**; at 1 reads \`You have selected 1 class with a total of 1 student\` with \`Cancel\` and \`Continue\` |

The row checkbox \`input\` is visually hidden — the **label** is the click target. Row checkbox
\`name\` attributes are the class **UUIDs** (stable), whereas their \`qid\`s (\`createReport-7-N\`) are
**positional** and will be re-issued when the list is searched or filtered.

### Step 2 — the "Create report" dialog

| Element | Detail |
|---|---|
| Heading | \`Create report\`, with a \`Close\` control |
| Report type | combobox labelled \`Report type\`, default \`Select a report type\` |
| Grade option | checkbox \`Only include items that contribute to grade calculation\` |
| Date range | radios \`From the beginning\` / \`Export all student data\` and \`Custom date range\` / \`Export data based on specific dates\` |
| Custom fields | \`From\` and \`To\`, shown only when \`Custom date range\` is selected |
| Actions | \`Cancel\` · \`Submit\` |

**State rules, all verified live:**

- Before a report type is chosen, **both date-range radios and \`Submit\` are disabled**, and
  \`From the beginning\` is pre-selected.
- Choosing a date-capable report type enables both radios and \`Submit\`.
- The \`From\`/\`To\` fields default to the **last seven days** (captured: Thu, Aug 20, 2026 →
  Wed, Aug 26, 2026).
- Both date inputs are **\`readOnly\`** — pickers are the only input path.
- \`From\` carries \`min="2021-12-31T18:30:00.000Z"\` → a floor of **1 January 2022**.
- Both carry \`max="2026-08-26T18:29:59.999Z"\` → **no future dates**.
- \`To\` carries \`min\` equal to the current \`From\` value → **the end date cannot precede the start**.

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
| Success | \`We are preparing your report\` · \`We will notify you when your <Report type> report is ready to download\` · \`Create another report\` · \`Back to Reports\` |
| Generation failed | \`Sorry, something went wrong. The report you requested was not generated.\` · \`Try again\` · \`Back to Reports\` |
| Created with errors | \`Report created with errors\` · \`<N> out of <TOTAL> classes were not included in your report due to the errors shown below\` · columns \`Class name\` / \`Class key\` / \`Error message\` · \`Download report\` |

The last two were captured from the **pre-rendered DOM** without ever triggering them
(\`admin-shared.md\` §A6), which is what makes \`TST_MRPT_TC_38\` and \`TST_MRPT_TC_39\` verified rather
than \`[ASSUMED]\` despite being Blocked.

> **Not a defect.** In the pre-rendered DOM the success dialog reads
> \`ADMIN.CREATE_REPORT.null\` and the error modal reads \`ADMIN.REPORT.undefined\`. Both **resolve
> correctly at runtime** — after a real submission the dialog read "We will notify you when your
> **Class summary** report is ready to download". These are un-instantiated binding placeholders,
> not untranslated i18n keys. Do not raise them.

### Classes on the target school (${DATE})

All six are **Active** with **1 student** each: \`Gated LP Class\` (4mG6-9Jkf) ·
\`Coming Soon Test Component Class\` (8R43-4Lm8) · \`School License Test Class 4\` (q8sD-989r) ·
\`School License Test Class 3\` (62B6-nb9A) · \`School License Test Class 2\` (8RsZ-KmD7) ·
\`School License Test Class 1\` (LT4E-zfyh).

Because every class shares one status, this school **cannot** demonstrate filter exclusion
(\`TST_MRPT_TC_9\`, \`TC_11\`, \`TC_12\`) — those need a class in another status.

---

## Section — Test Cases (grouped by Linked Requirement)
${testCaseSections()}
## Open items / \`[ASSUMED]\` to confirm on the next live pass

1. **Search semantics** (\`TST_MRPT_TC_4\`, \`TC_6\`, \`TC_7\`): whether the class-picker search is
   submit-driven, and whether it is a **substring** match (like the Classes tab) or **fuzzy** (like
   the Library tab). \`admin-shared.md\` §A4 warns these differ per tab. The no-results copy was not
   captured.
2. **"Clear all" behaviour** (\`TST_MRPT_TC_10\`): whether it applies immediately or still requires
   \`Apply\`. The highest-risk assumption in the filter group.
3. **Filter summary label after applying** (\`TST_MRPT_TC_9\`): only the unfiltered
   \`All class statuses\` value was captured.
4. **Plural footer wording** (\`TST_MRPT_TC_14\`): only the singular \`1 class\` / \`1 student\` form was
   seen. Also whether "Select all classes" spans the whole school or only the filtered/searched rows.
5. **Dialog Cancel and Close semantics** (\`TST_MRPT_TC_19\`, \`TC_20\`): whether either preserves the
   class selection, and whether the two behave identically.
6. **The "Date range" cell for a custom window** (\`TST_MRPT_TC_28\`): only the
   \`All student data (up to - <date>)\` form was captured.
7. **The "Items" cell when the grade option is ticked** (\`TST_MRPT_TC_35\`): reads \`All items\` when
   unticked; the ticked value is unknown.
8. **Whether the end-date floor moves when \`From\` changes** (\`TST_MRPT_TC_31\`): the floor was
   observed tracking the initial \`From\` value, but not re-checked after changing it.
9. **Report row states not seen**: the 60-day expiry, any "Load more" on a long Reports list, and
   whether a report can be removed from the list (the failure dialog's pre-rendered footer mentions
   \`Remove from the reports list\`).
10. **Downloaded file contents** (\`TST_MRPT_TC_21\`–\`TC_26\`, \`TC_35\`): no report file was opened, so
    no case asserts on report contents. Scenarios #6–#11 are currently verified only to the point of
    a downloadable row.
11. **Blocked** — \`TST_MRPT_TC_17\` (needs a school with >1500 classes); \`TST_MRPT_TC_38\` and
    \`TST_MRPT_TC_39\` (need forced report-generation failure). Unblock notes are in each case's Remarks.
`;

fs.writeFileSync(path.join(__dirname, BASE + ".md"), md, "utf8");

/* ---------------------------------------------------------------------- xlsx */

(async () => {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("Test Cases");

  ws.columns = [
    { header: COLUMNS[0], key: "sno", width: 7 },
    { header: COLUMNS[1], key: "id", width: 20 },
    { header: COLUMNS[2], key: "title", width: 62 },
    { header: COLUMNS[3], key: "req", width: 40 },
    { header: COLUMNS[4], key: "type", width: 10 },
    { header: COLUMNS[5], key: "priority", width: 10 },
    { header: COLUMNS[6], key: "pre", width: 46 },
    { header: COLUMNS[7], key: "steps", width: 60 },
    { header: COLUMNS[8], key: "data", width: 38 },
    { header: COLUMNS[9], key: "expected", width: 70 },
    { header: COLUMNS[10], key: "remarks", width: 62 },
    { header: COLUMNS[11], key: "actual", width: 18 },
    { header: COLUMNS[12], key: "status", width: 12 },
    { header: COLUMNS[13], key: "comments", width: 40 },
  ];

  const header = ws.getRow(1);
  header.font = { bold: true, color: { argb: "FFFFFFFF" } };
  header.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF3D1A66" } };
  header.alignment = { vertical: "middle", horizontal: "left", wrapText: true };
  header.height = 24;

  rows.forEach((r) => {
    const row = ws.addRow(r);
    row.alignment = { vertical: "top", wrapText: true };
  });

  ws.views = [{ state: "frozen", ySplit: 1 }];

  await wb.xlsx.writeFile(path.join(__dirname, BASE + ".xlsx"));
  console.log("wrote " + BASE + ".md and " + BASE + ".xlsx (" + rows.length + " TCs)");
})();

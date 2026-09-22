/**
 * Generates BOTH the .md document and the .xlsx register for the Learning Path manual
 * test-case set from _tcdata.js, so the two cannot drift (SKILL golden rule 6).
 *
 *   node test/Manual/C1App/LearningPath/_generate.js
 *
 * Pattern copied from AdminApp-Reports/_generate.js. Before re-running after hand edits to the
 * .md/.xlsx, back-port them into _tcdata.js first (SKILL golden rule 11).
 */

const fs = require("fs");
const path = require("path");
// Resolved from the repo's node_modules (a worktree has none of its own; Node walks up).
const ExcelJS = require("exceljs");
const { TCS, REQS, NOT_COVERED } = require("./_tcdata.js");
// [2026-09-22] Second sheet/section: the LP setup chain, module-wise (user decision; to be moved
// into application-wise registers later).
const SETUP = require("./_tcdata_setup.js");

const BASE = "LearningPath_test_cases";
const DATE = "2026-09-22";

const COLUMNS = [
  "S.No.", "Test Case ID", "Title", "Linked Requirement", "Type", "Priority",
  "Preconditions", "Test Steps", "Test Data", "Expected Result", "Remarks",
  "Actual Result", "Status", "Comments / Defect ID",
];

// Grouped by requirement, Positive → Edge → Negative within a group; S.No. follows that order.
const order = { Positive: 0, Edge: 1, Negative: 2 };
const grouped = REQS.flatMap((req) =>
  TCS.filter((t) => t.req === req).sort((a, b) => order[a.type] - order[b.type]));
const rows = grouped.map((tc, i) => Object.assign({ sno: i + 1, status: "Not Run", comments: "" }, tc));

const counts = rows.reduce((a, r) => ((a[r.type] = (a[r.type] || 0) + 1), a), {});
const passed = rows.filter((r) => r.status === "Pass").length;
// Setup rows keep the flow order within each module group; S.No. restarts on the setup sheet.
const setupRows = SETUP.GROUPS.flatMap((g) => SETUP.TCS.filter((t) => t.req === g))
  .map((tc, i) => Object.assign({ sno: i + 1 }, tc));
const setupPassed = setupRows.filter((r) => r.status === "Pass").length;
const suffix = (t) => (t === "Edge" ? " (E)" : t === "Negative" ? " (N)" : "");
const cell = (v) => String(v).replace(/\n/g, "<br>").replace(/\|/g, "\\|");

function coverageMap() {
  return REQS.map((req) => {
    const mine = rows.filter((r) => r.req === req);
    return "| " + req + " | " + (mine.length ? mine.map((r) => r.id + suffix(r.type)).join(", ") : NOT_COVERED[req]) + " |";
  }).join("\n");
}

function tcTable(r) {
  const pairs = [
    ["S.No.", r.sno], ["Test Case ID", r.id], ["Title", r.title], ["Linked Requirement", r.req],
    ["Type", r.type], ["Priority", r.priority], ["Preconditions", r.pre], ["Test Steps", r.steps],
    ["Test Data", r.data], ["Expected Result", r.expected], ["Remarks", r.remarks],
    ["Actual Result", "*(blank in design)*"], ["Status", r.status],
    ["Comments / Defect ID", r.comments || "*(blank in design)*"],
  ];
  return "| Field | Value |\n|---|---|\n" + pairs.map(([k, v]) => "| **" + k + "** | " + cell(v) + " |").join("\n");
}

function setupSections() {
  return SETUP.GROUPS.map((g) => {
    const mine = setupRows.filter((r) => r.req === g);
    return "\n### " + g + "\n\n" + mine.map(tcTable).join("\n\n---\n\n") + "\n\n---\n";
  }).join("");
}

function setupMap() {
  return SETUP.GROUPS.map((g) => "| " + g + " | " + setupRows.filter((r) => r.req === g).map((r) => r.id).join(", ") + " |").join("\n");
}

function sections() {
  return REQS.map((req) => {
    const mine = rows.filter((r) => r.req === req);
    return "\n### Requirement " + req + "\n\n"
      + (mine.length ? mine.map(tcTable).join("\n\n---\n\n") : "_" + NOT_COVERED[req] + "_") + "\n\n---\n";
  }).join("");
}

const md = `# Manual Functional Test Cases — Cambridge One: Learning Path / Practice Extra (Batch 1)

**Source:** \`lp-scenarios.xlsx\` (playwright-automation-c1 \`test-scenarios/\`), sheet "Learning Path" — rows TC-LP-001…006
**Module:** PEXT (Practice Extra player) — *\`practiceExtra.page.js\`*; the entry click is DASH (\`dashboard.page.js\`)
**App:** Cambridge One — \`www.cambridgeone.org\` (production; thor is blocked — see \`c1-core-shared.md\` §A4)
**Page in scope:** learner dashboard → Practice Extra → Learning Path unit view
**Generated:** ${DATE} | **Total TCs:** ${rows.length} (${counts.Positive || 0} Positive · ${counts.Edge || 0} Edge · ${counts.Negative || 0} Negative) — 5 of 6 scenarios covered; LP-004 deliberately not (see map)
**Execution status (${DATE}):** **${passed} of ${rows.length} LP TCs automated and passing** — \`npm run learningPathTest_prod\`, full first-time run 53/53 (teacher _w1b7, Class vyi9, learner _jqh2).
**Part 2 — LP setup chain (${setupRows.length} TCs, module-wise, separate sheet):** **${setupPassed} of ${setupRows.length} passing** in the same run. Kept here for now; to be moved into application-wise registers later (user decision ${DATE}).

**Batches:** Batch 1 — LP-001…006 (\`TST_PEXT_*\` + \`TST_DASH_TC_14\`, ${rows.length} TCs) · Setup — sheet "LP Setup (by module)".

> **Ordering:** grouped by Linked Requirement (scenario); Positive → Edge → Negative within a group.
> **S.No.** follows that order; **Test Case IDs** are stable and so appear out of numeric sequence.
>
> **Batch 1 scope (agreed 2026-09-22):** the first six rows of the sheet. LP-002 and LP-003 are split
> into one case per frame plus the final score; LP-004 is not a product scenario and is not covered.
>
> **Grounding.** Flows come from the SOURCE suite; every expected result was then **verified live on
> production on ${DATE}** by our own runs (debug runs on learner _ajq1, then the full first-time run).
> Where SOURCE was wrong it is corrected and noted in Remarks (TOC close control, TOC on entry).
>
> **Data.** The learner, class and invite are created by the setup suites of \`learningPath.json\`
> (ADR-022 run-generated users) — see \`authoring-status.md\`. **The scorable activity can be attempted
> once per learner**: a finished or half-finished activity is not offered fresh again, so a failed run of
> TC_4…TC_8 needs a new learner.

---

## Requirement → Test Case coverage map

| Linked Requirement (scenario) | Mapped TC IDs (P → E → N) |
|---|---|
${coverageMap()}

---

## Product reference (from SOURCE, ${DATE} — to be re-confirmed live)

- Entry: the "Practice Extra" tile inside the class card on the learner dashboard. A first launch can show
  *"We're setting up the learning materials for you"* (≤ ~3 min on thor) before the player.
- Player: activity iframe \`div#content-course-ext iframe\`; **Check** (\`a.green-btn\`) and **Next**
  (\`a[title="Next"]\`) are on the OUTER page. Result \`p.score\` — "You scored 4 out of 4" — also outer.
- TOC: \`div.sidebar.bg-white\` (hidden via \`d-none\`); open \`a.open-sidebar-btn\`, close
  \`.unit-view-header a.close-sidebar\`. Opens automatically on the first navigation.
- Scorable content (cqaautomationbundle1): 4 frames of rich dropdowns (\`.rich-dropdown\`); frames 3/4 have
  four each and mark \`.wrapper-dropdown.filled\` when answered. Scrolling closes an open dropdown.

---

## Section — Test Cases (grouped by Linked Requirement)
${sections()}
## Open items / \`[ASSUMED]\` to confirm on the next live pass

1. ~~**Every expected result** is \`[ASSUMED — SOURCE-verified]\`~~ — **RESOLVED ${DATE}.** All verified live on production.
2. ~~**TOC initial state**~~ — **RESOLVED ${DATE}.** Opens by itself only on a learner's FIRST entry; later entries start closed.
   Housekeeping \`TST_PEXT_TC_100\` closes it first so TC_2/TC_3 always start from the same state.
3. **Provisioning screen** (TST_DASH_TC_14): not observed on production (first entry opened in ~9 s). SOURCE saw it on thor.

---

# Part 2 — LP setup chain (sheet "LP Setup (by module)")

The fresh-user chain every LP run starts with: teacher signup → join school → create class → learner
signup → invite → accept. **Module-wise groups**, rows in the order the flow runs them. Existing TCs the
flow reuses are included (Remarks: "Existing TC, reused") so the whole chain can be checked step by step.
Housekeeping steps (\`TST_INVI_TC_101\` bell wait, \`TST_PEXT_TC_100\` TOC close) are not cases.

⚠️ **Creates real data on production every run** (user-approved 2026-09-22): 1 teacher (+ school
affiliation to MQA Sierra School), 1 class, 1 learner (+ class membership). Thor is **Blocked** at
TST_SNUP_TC_61 (expired certificate on the verification-link host).

| Module group | TC IDs (flow order) |
|---|---|
${setupMap()}
${setupSections()}`;

async function main() {
  const dir = __dirname;
  fs.writeFileSync(path.join(dir, BASE + ".md"), md);

  const wb = new ExcelJS.Workbook();
  // Same 14 columns, purple frozen header, on both sheets.
  function addSheet(name, list) {
    const ws = wb.addWorksheet(name);
    ws.addRow(COLUMNS);
    list.forEach((r) => ws.addRow([r.sno, r.id, r.title, r.req, r.type, r.priority, r.pre, r.steps,
      r.data, r.expected, r.remarks, "", r.status, r.comments]));
    ws.getRow(1).eachCell((c) => {
      c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF3D1A66" } };
      c.font = { bold: true, color: { argb: "FFFFFFFF" } };
    });
    ws.views = [{ state: "frozen", ySplit: 1 }];
    ws.columns.forEach((col, i) => { col.width = [6, 18, 50, 40, 10, 9, 45, 45, 35, 50, 50, 20, 10, 30][i]; });
    ws.eachRow((row) => row.eachCell((c) => { c.alignment = { wrapText: true, vertical: "top" }; }));
  }
  addSheet("Test Cases", rows);
  addSheet("LP Setup (by module)", setupRows);
  await wb.xlsx.writeFile(path.join(dir, BASE + ".xlsx"));
  console.log("Wrote " + BASE + ".md + .xlsx — LP " + rows.length + " TCs (" + passed + " Pass), setup "
    + setupRows.length + " TCs (" + setupPassed + " Pass)", counts);
}

main().catch((e) => { console.error(e); process.exit(1); });

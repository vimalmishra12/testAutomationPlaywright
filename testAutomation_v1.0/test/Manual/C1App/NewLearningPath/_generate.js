/**
 * Generates BOTH the .md document and the .xlsx register for the New Learning Path (NLP — "Projects") manual
 * test-case set from _tcdata.js (+ _tcdata_groups.js), so the two cannot drift (SKILL golden rule 6).
 *
 *   node test/Manual/C1App/NewLearningPath/_generate.js
 *
 * Pattern copied from ../LearningPath/_generate.js. Never hand-edit the .md / .xlsx — back-port into _tcdata*.js.
 */

const fs = require("fs");
const path = require("path");
const ExcelJS = require("exceljs");
const B1 = require("./_tcdata.js");
let G = { TCS: [] };
try { G = require("./_tcdata_groups.js"); } catch (e) { if (e.code !== "MODULE_NOT_FOUND") throw e; }
const TCS = B1.TCS.concat(G.TCS);
const REQS = B1.REQS;
const RUN = require("./_run.js");

const BASE = "NewLearningPath_test_cases";
const COLUMNS = [
  "S.No.", "Test Case ID", "Title", "Linked Requirement", "Type", "Priority",
  "Preconditions", "Test Steps", "Test Data", "Expected Result", "Remarks",
  "Actual Result", "Status", "Comments / Defect ID",
];
const STATUSES = ["Not Run", "Pass", "Fail", "Blocked", "On Hold"];

// Grouped by requirement, Positive → Edge → Negative within a group; S.No. follows that order.
const order = { Positive: 0, Edge: 1, Negative: 2 };
const grouped = REQS.flatMap((req) => TCS.filter((t) => t.req === req).sort((a, b) => order[a.type] - order[b.type]));
const rows = grouped.map((tc, i) => {
  const r = Object.assign({ sno: i + 1, status: "Not Run", comments: "", actual: "" },
    Object.fromEntries(Object.entries(tc).filter(([, v]) => v !== undefined)));
  // Execution attribution from _run.js (the last full run) unless the row carries its own (Blocked / On Hold).
  const res = RUN.results[r.id + (r.runKey ? "#" + r.runKey : "")] || RUN.results[r.id];
  if (res && r.status === "Not Run") { r.status = res.status; r.actual = res.actual || ""; r.comments = res.comments || RUN.attribution; }
  return r;
});
const unplaced = TCS.filter((t) => !REQS.includes(t.req));
if (unplaced.length) throw new Error("TCs with an unknown requirement: " + unplaced.map((t) => t.id).join(", "));

const counts = rows.reduce((a, r) => ((a[r.type] = (a[r.type] || 0) + 1), a), {});
const by = (s) => rows.filter((r) => r.status === s);
const suffix = (t) => (t === "Edge" ? " (E)" : t === "Negative" ? " (N)" : "");
const cell = (v) => String(v).replace(/\n/g, "<br>").replace(/\|/g, "\\|");

function coverageMap() {
  return REQS.map((req) => {
    const mine = rows.filter((r) => r.req === req).map((r) => r.id + suffix(r.type));
    const also = (B1.ALSO[req] || []).map((id) => id + " (also)");
    const all = mine.concat(also);
    return "| " + req + " | " + (all.length ? all.join(", ") : B1.NOT_COVERED[req] || "**NOT COVERED**") + " |";
  }).join("\n");
}

function tcTable(r) {
  const pairs = [
    ["S.No.", r.sno], ["Test Case ID", r.id], ["Title", r.title], ["Linked Requirement", r.req],
    ["Type", r.type], ["Priority", r.priority], ["Preconditions", r.pre], ["Test Steps", r.steps],
    ["Test Data", r.data], ["Expected Result", r.expected], ["Remarks", r.remarks],
    ["Actual Result", r.actual || "*(blank)*"], ["Status", r.status],
    ["Comments / Defect ID", r.comments || "*(blank)*"],
  ];
  return "| Field | Value |\n|---|---|\n" + pairs.map(([k, v]) => "| **" + k + "** | " + cell(v) + " |").join("\n");
}

function sections() {
  return REQS.map((req) => {
    const mine = rows.filter((r) => r.req === req);
    const also = (B1.ALSO[req] || []);
    return "\n### " + req + "\n\n"
      + (mine.length ? mine.map(tcTable).join("\n\n---\n\n") : "_Covered by " + also.join(", ") + " (see its row)._")
      + "\n\n---\n";
  }).join("");
}

const md = `# Manual Functional Test Cases — Cambridge One: New Learning Path (NLP — "Projects")

**Source:** \`D:\\Playwright\\Test_Cases_CUP\\nlp-scenarios.xlsx\`, sheet "New Learning Path" — TC-NLP-001…022 (all in scope, agreed ${RUN.designed})
**Modules:** NLPP (\`newLearningPath.page.js\`) · DASH (\`dashboard.page.js\`) launch · CGRP (\`classGroups.page.js\`) groups · reused MSAC / MRKQ / PROG
**App:** Cambridge One — \`www.cambridgeone.org\` (production). NLP component = **Projects** (product \`cqaautomationpr1\`) of \`cqaautomationbundle1\`
**Generated:** ${RUN.generated} | **Total TCs:** ${rows.length} (${counts.Positive || 0} Positive · ${counts.Edge || 0} Edge · ${counts.Negative || 0} Negative) — every scenario of the sheet mapped
**Execution status:** **${by("Pass").length} Pass** · **${by("Fail").length} Fail**${by("Fail").length ? " (" + by("Fail").map((r) => r.id).join(", ") + ")" : ""} · **${by("Not Run").length} Not Run** · **${by("Blocked").length} Blocked** (${by("Blocked").map((r) => r.id).join(", ") || "—"}) · **${by("On Hold").length} On Hold** — ${RUN.summary}

> **Ordering:** grouped by Linked Requirement (scenario); Positive → Edge → Negative within a group. **S.No.** follows
> that order; **Test Case IDs** are stable and so appear out of numeric sequence. Reused TCs (DASH_TC_13, MSAC_TC_1,
> MRKQ_TC_1/2, PROG_TC_*) keep their IDs and run with the Projects data (\`newLearningPathData.json\`).
>
> **Decisions (user, ${RUN.designed}):** own execution file \`newLearningPath.json\` with its own fresh teacher, class and
> learner(s) (setup chain = Suites 1–6 of \`learningPath.json\`); previews use the run's bundle, not "R55 Multi Component
> Umbrella"; the teacher marks the Projects PS; the group cases (TC-NLP-021/022) are automated with a second learner.
>
> **Data.** A full run creates real production data (teacher + affiliation to MQA Sierra School, class, learner(s),
> progress, a mark, a group). The Practice Set can be submitted **once per learner**; in NLP the scorable can be retaken.

---

## How to automate / re-run a case from this register

1. Keep the **Test Case ID**; never renumber — a new case is appended.
2. Read \`.architecture/authoring-status.md\` (\`newLearningPath\` block) and
   \`product-knowledge/ExperienceApp/new-learning-path.md\`; follow the \`c1-test-authoring\` skill.
3. \`[ASSUMED]\` is a question, not a fact — confirm live and replace the text with what was seen.
4. Close the loop: edit \`_tcdata*.js\` / \`_run.js\`, run \`node test/Manual/C1App/NewLearningPath/_generate.js\`.

---

## Requirement → Test Case coverage map

| Linked Requirement (scenario) | Mapped TC IDs (P → E → N) |
|---|---|
${coverageMap()}

---

## Section — Test Cases (grouped by Linked Requirement)
${sections()}
## Open items

${RUN.openItems.map((o, i) => (i + 1) + ". " + o).join("\n")}
`;

async function main() {
  const dir = __dirname;
  fs.writeFileSync(path.join(dir, BASE + ".md"), md);
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("Test Cases");
  ws.addRow(COLUMNS);
  rows.forEach((r) => ws.addRow([r.sno, r.id, r.title, r.req, r.type, r.priority, r.pre, r.steps,
    r.data, r.expected, r.remarks, r.actual, r.status, r.comments]));
  ws.getRow(1).eachCell((c) => {
    c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF3D1A66" } };
    c.font = { bold: true, color: { argb: "FFFFFFFF" } };
  });
  ws.views = [{ state: "frozen", ySplit: 1 }];
  ws.columns.forEach((col, i) => { col.width = [6, 18, 50, 40, 10, 9, 45, 45, 35, 50, 50, 30, 10, 40][i]; });
  ws.eachRow((row) => row.eachCell((c) => { c.alignment = { wrapText: true, vertical: "top" }; }));
  // Status dropdown on every data row, including "On Hold" (manual-test-standard.md).
  for (let i = 2; i <= rows.length + 1; i++) {
    ws.getCell("M" + i).dataValidation = { type: "list", allowBlank: false, formulae: ['"' + STATUSES.join(",") + '"'] };
  }
  await wb.xlsx.writeFile(path.join(dir, BASE + ".xlsx"));
  // Read back: the saved workbook must hold every row with the same ids and statuses.
  const check = new ExcelJS.Workbook();
  await check.xlsx.readFile(path.join(dir, BASE + ".xlsx"));
  const back = check.getWorksheet("Test Cases");
  rows.forEach((r, i) => {
    const row = back.getRow(i + 2);
    if (row.getCell(2).value !== r.id || row.getCell(13).value !== r.status) throw new Error("xlsx read-back mismatch at row " + (i + 2));
  });
  console.log("Wrote " + BASE + ".md + .xlsx — " + rows.length + " TCs", counts,
    STATUSES.map((s) => s + ": " + by(s).length).join(" · "));
}

main().catch((e) => { console.error(e); process.exit(1); });

"use strict";

/**
 * registerSync — write the computed automation truth back into the manual registers.
 *
 * Reads tooling/automationAudit.js (code ground truth + archived run results) and updates,
 * for every case, in BOTH the .md and the .xlsx:
 *
 *   Status               the execution verdict   Pass | Fail | Flaky | Not Run | Blocked
 *   Automation Status    NEW  Automated | Not Automated | Blocked | Written - not wired
 *                             | Excluded - Phase 1
 *   Automation Evidence  NEW  which suite runs it, and what the last real run said
 *
 * Two NEW columns rather than one overloaded one, because the old single `Status` column
 * was answering two different questions at once ("did a human pass this by hand?" and "is
 * it automated and green?") and had drifted into seven different spellings. And they are
 * ADDED rather than folded into `Comments / Defect ID`: that field holds carefully written
 * human prose - blocker reasons, defect history, unblock routes - which a generated line
 * must never overwrite.
 *
 * `Status` is only ever set from an OBSERVED run. Where nothing has executed a case, an
 * existing manual `Pass` is preserved (someone really did click through it); anything else
 * becomes `Not Run`. The tool never invents a Pass.
 *
 * Usage:
 *   node tooling/registerSync.js plan  [<registerDir> ...]   # show the diff, write nothing
 *   node tooling/registerSync.js apply [<registerDir> ...]   # write .md + .xlsx
 *
 * Default scope is every AdminApp-* register. `plan` is the default command.
 */

const fs = require("fs");
const path = require("path");
const ExcelJS = require("exceljs");
const { audit } = require("./automationAudit");

const ROOT = path.resolve(__dirname, "..");
const AUTOMATION_COL = "Automation Status";
const EVIDENCE_COL = "Automation Evidence";

/** The execution verdict. Observed runs win; a manual Pass survives only if unobserved. */
function computeStatus(c) {
  if (c.run && c.run.verdict && c.run.verdict !== "Not Run") return c.run.verdict;
  if (c.blocked) return "Blocked";
  // "On Hold" is NOT the same as "Not Run", and flattening it would destroy real
  // information: the Students register uses it for cases that are written and verified but
  // deliberately kept out of the execution files while a product bug is open, so that no
  // suite sits red. That intent is only recorded here.
  if (/^on hold$/i.test(c.registerStatus)) return "On Hold";
  if (/^pass$/i.test(c.registerStatus)) return "Pass"; // manual evidence, left intact
  return "Not Run";
}

function computeEvidence(c) {
  if (c.automation === "Excluded - Phase 1") return "Out of Phase 1 automation scope.";
  if (c.automation === "Not Automated") return "No automated coverage.";
  if (c.automation === "Written - not wired")
    return "Handler exists in " + c.testFiles.join(", ") + ".test.js but no execution file runs it.";

  const bits = [];
  if (c.surrogates.length) bits.push("Automated as " + c.surrogates.join(" + "));
  if (c.suites.length) bits.push("Suite: " + c.suites.join(", "));
  if (c.run) {
    const n = c.run.runs.length;
    // "across N runs", never "(N passes)" - on a Fail or Flaky row that read as "2 passed",
    // which is the opposite of what happened.
    bits.push(RUN_DATE + ": " + c.run.verdict + " across " + n + (n === 1 ? " run" : " runs"));
    // The mochawesome message already begins with "Error:", so don't prefix a second one.
    if (c.run.lastError) bits.push(c.run.lastError.replace(/^Error:\s*/, "Error: "));
  } else if (c.automation === "Automated") {
    bits.push("Not executed in this audit - status carried over, treat as unverified");
  }
  if (c.blocked) bits.push("BLOCKED - see Comments for the blocker and its unblock route");
  return bits.join(" | ");
}

const RUN_DATE = new Date().toISOString().slice(0, 10);

/** ---------------------------------------------------------------- Markdown */

const BEGIN = "<!-- BEGIN GENERATED AUTOMATION SUMMARY - tooling/registerSync.js -->";
const END = "<!-- END GENERATED AUTOMATION SUMMARY -->";

/**
 * Build the authoritative summary block.
 *
 * The registers' headers carry hand-maintained prose counts ("64 of 92 TCs automated and
 * passing") which is precisely what drifted. This block is generated, delimited, and
 * regenerated on every run, so it cannot rot. It does NOT delete the surrounding prose -
 * rewriting someone's hand-written narrative automatically is not this tool's call - but it
 * does say plainly that it supersedes any count below it.
 */
function summaryBlock(cases) {
  const tally = {};
  const stat = {};
  for (const c of cases) {
    tally[c.automation] = (tally[c.automation] || 0) + 1;
    const s = computeStatus(c);
    stat[s] = (stat[s] || 0) + 1;
  }
  const order = ["Automated", "Written - not wired", "Blocked", "Excluded - Phase 1", "Not Automated"];
  const statOrder = ["Pass", "Fail", "Flaky", "Blocked", "On Hold", "Not Run"];
  const lines = [
    BEGIN,
    "",
    "## Automation status — generated " + RUN_DATE,
    "",
    "> Generated by `node tooling/registerSync.js apply` from the execution files, the test",
    "> files and archived run reports. **This block supersedes any automation count in the",
    "> prose below it.** Re-run the tool rather than editing these numbers by hand.",
    "",
    "| Automation Status | Cases |",
    "|---|---|"
  ];
  for (const k of order) if (tally[k]) lines.push("| " + k + " | " + tally[k] + " |");
  lines.push("| **Total** | **" + cases.length + "** |", "", "| Execution Status | Cases |", "|---|---|");
  for (const k of statOrder) if (stat[k]) lines.push("| " + k + " | " + stat[k] + " |");
  lines.push("", END);
  return lines;
}

/**
 * Rewrite a register .md in place.
 *
 * The file is a sequence of vertical "| **Field** | Value |" blocks, so this walks lines,
 * tracks which case it is inside, replaces the Status row and then emits the two automation
 * rows directly after it. Pre-existing automation rows and a pre-existing summary block are
 * dropped first, which is what makes a re-run idempotent instead of appending a second copy
 * every time.
 */
function syncMarkdown(mdPath, byId, dry) {
  const lines = fs.readFileSync(mdPath, "utf8").split(/\r?\n/);
  const out = [];
  let curId = null;
  let changed = 0;

  // Strip any previous generated block first, so re-running replaces rather than stacks.
  const b = lines.indexOf(BEGIN);
  const e = lines.indexOf(END);
  if (b !== -1 && e !== -1 && e > b) lines.splice(b, e - b + 1);

  // Re-insert after the H1 title (and any blank line following it).
  const h1 = lines.findIndex((l) => /^#\s/.test(l));
  const block = summaryBlock([...byId.values()]);
  lines.splice(h1 === -1 ? 0 : h1 + 1, 0, "", ...block);

  for (const line of lines) {
    const m = /^\|\s*\*\*(.+?)\*\*\s*\|\s*([\s\S]*?)\s*\|\s*$/.exec(line);
    const field = m && m[1].trim();

    if (field === "Test Case ID") {
      curId = m[2].replace(/[`*]/g, "").trim();
      out.push(line);
      continue;
    }
    // Drop any previously generated rows - they are re-emitted below.
    if (curId && (field === AUTOMATION_COL || field === EVIDENCE_COL)) continue;

    if (field === "Status" && curId && byId.has(curId)) {
      const c = byId.get(curId);
      const status = computeStatus(c);
      if (m[2].replace(/[`*]/g, "").trim() !== status) changed++;
      out.push("| **Status** | " + status + " |");
      out.push("| **" + AUTOMATION_COL + "** | " + c.automation + " |");
      out.push("| **" + EVIDENCE_COL + "** | " + computeEvidence(c) + " |");
      continue;
    }
    out.push(line);
  }

  const text = out.join("\n");
  if (!dry) fs.writeFileSync(mdPath, text, "utf8");
  return changed;
}

/** ---------------------------------------------------------------- Workbook */

function assertNotOpenInExcel(file) {
  const lock = path.join(path.dirname(file), "~$" + path.basename(file));
  if (fs.existsSync(lock))
    throw new Error("Workbook is OPEN in Excel (" + path.basename(lock) + ") - close it first.");
}

async function syncWorkbook(xlsxPath, byId, dry) {
  assertNotOpenInExcel(xlsxPath);
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(xlsxPath);
  const ws = wb.worksheets[0];

  // Locate the columns by HEADER TEXT, never by a hard-coded letter: the registers were
  // authored separately and a fixed "column M" assumption would silently write Status into
  // some other field the day one of them gains a column.
  const header = ws.getRow(1);
  const colOf = {};
  header.eachCell((cell, n) => {
    const v = String(cell.value == null ? "" : cell.value).trim();
    if (v) colOf[v] = n;
  });
  if (!colOf["Test Case ID"] || !colOf["Status"])
    throw new Error("Unrecognised register layout in " + path.basename(xlsxPath));

  let next = ws.columnCount + 1;
  for (const name of [AUTOMATION_COL, EVIDENCE_COL]) {
    if (!colOf[name]) {
      colOf[name] = next++;
      header.getCell(colOf[name]).value = name;
      header.getCell(colOf[name]).font = Object.assign({}, header.getCell(colOf["Status"]).font);
    }
  }

  let changed = 0;
  let unmatched = [];
  ws.eachRow((row, n) => {
    if (n === 1) return;
    const id = String(row.getCell(colOf["Test Case ID"]).value || "").trim();
    if (!id) return;
    if (!byId.has(id)) {
      unmatched.push(id);
      return;
    }
    const c = byId.get(id);
    const status = computeStatus(c);
    if (String(row.getCell(colOf["Status"]).value || "").trim() !== status) changed++;
    row.getCell(colOf["Status"]).value = status;
    row.getCell(colOf[AUTOMATION_COL]).value = c.automation;
    row.getCell(colOf[EVIDENCE_COL]).value = computeEvidence(c);
  });

  if (!dry) {
    await wb.xlsx.writeFile(xlsxPath);
    // Read back and verify - a silent no-op write is the failure mode worth guarding
    // against (the same lesson tooling/xlsxRegister.js records).
    const check = new ExcelJS.Workbook();
    await check.xlsx.readFile(xlsxPath);
    const cws = check.worksheets[0];
    let verified = 0;
    cws.eachRow((row, n) => {
      if (n === 1) return;
      const id = String(row.getCell(colOf["Test Case ID"]).value || "").trim();
      if (byId.has(id) && String(row.getCell(colOf[AUTOMATION_COL]).value || "").trim() === byId.get(id).automation)
        verified++;
    });
    if (verified === 0) throw new Error("Wrote " + path.basename(xlsxPath) + " but read back nothing - aborting.");
  }
  return { changed, unmatched };
}

/** ------------------------------------------------------------------- Main */

async function main() {
  const [, , cmdRaw, ...args] = process.argv;
  const cmd = cmdRaw === "apply" ? "apply" : "plan";
  const dry = cmd !== "apply";
  const dirs = args.length ? args.map((a) => path.resolve(ROOT, a)) : undefined;
  const results = audit(
    dirs ||
      fs
        .readdirSync(path.join(ROOT, "test", "Manual", "C1App"), { withFileTypes: true })
        .filter((e) => e.isDirectory() && e.name.startsWith("AdminApp-"))
        .map((e) => path.join(ROOT, "test", "Manual", "C1App", e.name))
  );

  console.log(dry ? "PLAN (nothing written)\n" : "APPLY\n");
  for (const r of results) {
    const byId = new Map(r.cases.map((c) => [c.id, c]));
    const mdPath = r.mdAbs;
    const xlsxPath = mdPath.replace(/\.md$/, ".xlsx");

    const mdChanged = syncMarkdown(mdPath, byId, dry);
    let xl = { changed: 0, unmatched: [] };
    if (fs.existsSync(xlsxPath)) xl = await syncWorkbook(xlsxPath, byId, dry);

    const tally = {};
    for (const c of r.cases) tally[c.automation] = (tally[c.automation] || 0) + 1;
    const stat = {};
    for (const c of r.cases) {
      const s = computeStatus(c);
      stat[s] = (stat[s] || 0) + 1;
    }
    console.log("=== " + r.register + "  (" + r.cases.length + " cases)");
    console.log("    automation: " + JSON.stringify(tally));
    console.log("    status:     " + JSON.stringify(stat));
    console.log("    status cells changed: md=" + mdChanged + " xlsx=" + xl.changed);
    if (xl.unmatched.length)
      console.log("    !! xlsx rows with no matching .md case: " + xl.unmatched.join(", "));
  }
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});

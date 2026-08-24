"use strict";

/**
 * xlsxRegister — read/patch the manual test-case .xlsx registers.
 *
 * Replaces the old technique of rewriting `xl/worksheets/sheet1.xml` inside the zip by
 * hand, which only worked while the workbook stayed in *inline-string* format and broke
 * the moment anyone saved it in Excel (2026-08-19).
 *
 * Usage:
 *   node tooling/xlsxRegister.js dump  <file> [--sheet=N]
 *   node tooling/xlsxRegister.js find  <file> <substring> [--sheet=N]
 *   node tooling/xlsxRegister.js get   <file> <A1> [<A1> ...]
 *   node tooling/xlsxRegister.js set   <file> <A1>=<value> [<A1>=<value> ...]
 *   node tooling/xlsxRegister.js status <file> <TestCaseId> <Pass|Fail|Not Run|Blocked>
 *
 * `set` and `status` write in place. Both REFUSE to run when the workbook is open in
 * Excel (a `~$<name>.xlsx` lock file exists), and both verify every write by reading the
 * saved file back — a silent no-op write is the failure mode worth guarding against.
 *
 * NOTE: exceljs rewrites the whole workbook, so run `verify` (below) after any change to
 * confirm nothing else moved. Round-trip fidelity was checked once when this tool was
 * added; re-check if the workbook gains new features (charts, pivot tables, macros).
 */

const path = require("path");
const fs = require("fs");
const ExcelJS = require("exceljs");

function assertNotOpenInExcel(file) {
  const lock = path.join(path.dirname(file), "~$" + path.basename(file));
  if (fs.existsSync(lock)) {
    throw new Error(
      "The workbook is OPEN in Excel (" + path.basename(lock) + " exists).\n" +
        "Close it first — writing now would be lost when Excel saves, and Excel's own save\n" +
        "rewrites the whole file."
    );
  }
}

async function load(file) {
  if (!fs.existsSync(file)) throw new Error("No such file: " + file);
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(file);
  return wb;
}

function sheetOf(wb, argv) {
  const n = Number((argv.find((a) => a.startsWith("--sheet=")) || "--sheet=1").split("=")[1]);
  const ws = wb.worksheets[n - 1];
  if (!ws) throw new Error("No sheet " + n + " (workbook has " + wb.worksheets.length + ")");
  return ws;
}

/** exceljs cell values can be strings, numbers, or rich-text/formula objects. */
function text(v) {
  if (v === null || v === undefined) return "";
  if (typeof v === "object") {
    if (Array.isArray(v.richText)) return v.richText.map((r) => r.text).join("");
    if (v.text !== undefined) return String(v.text);
    if (v.result !== undefined) return String(v.result);
    return String(v);
  }
  return String(v);
}

/** Every non-empty cell as { ref: value } — the basis of the round-trip check. */
function snapshot(ws) {
  const out = {};
  ws.eachRow({ includeEmpty: false }, (row) => {
    row.eachCell({ includeEmpty: false }, (cell) => {
      const t = text(cell.value);
      if (t !== "") out[cell.address] = t;
    });
  });
  return out;
}

/** Locate the row whose "Test Case ID" column holds `id`. */
function findRowByTestCaseId(ws, id) {
  const header = ws.getRow(1);
  let idCol = null;
  header.eachCell((cell, col) => {
    if (text(cell.value).trim().toLowerCase() === "test case id") idCol = col;
  });
  if (!idCol) throw new Error('No "Test Case ID" column in row 1');
  let found = null;
  ws.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (rowNumber === 1) return;
    if (text(row.getCell(idCol).value).trim() === id) {
      if (found) throw new Error("Test Case ID appears more than once: " + id);
      found = rowNumber;
    }
  });
  if (!found) throw new Error("Test Case ID not found: " + id);
  return found;
}

function columnByHeader(ws, name) {
  let col = null;
  ws.getRow(1).eachCell((cell, c) => {
    if (text(cell.value).trim().toLowerCase() === name.toLowerCase()) col = c;
  });
  if (!col) throw new Error('No "' + name + '" column in row 1');
  return col;
}

/** Write the edits, save, then read back and confirm each one landed. */
async function writeAndVerify(file, ws, wb, edits) {
  const before = snapshot(ws);
  for (const [ref, value] of edits) ws.getCell(ref).value = value;
  await wb.xlsx.writeFile(file);

  const check = await load(file);
  const cws = check.worksheets[wb.worksheets.indexOf(ws)];
  const after = snapshot(cws);

  const failed = edits.filter(([ref, value]) => text(cws.getCell(ref).value) !== String(value));
  if (failed.length) {
    throw new Error("Write did not land for: " + failed.map((f) => f[0]).join(", "));
  }

  const edited = new Set(edits.map((e) => e[0]));
  const collateral = Object.keys({ ...before, ...after }).filter(
    (ref) => !edited.has(ref) && before[ref] !== after[ref]
  );
  return { changed: edits.length, collateral };
}

function report(res) {
  console.log("wrote " + res.changed + " cell(s)");
  if (res.collateral.length) {
    console.log(
      "WARNING — " + res.collateral.length + " other cell(s) changed as a side effect: " +
        res.collateral.slice(0, 20).join(", ")
    );
    process.exitCode = 1;
  } else {
    console.log("verified: no other cell changed");
  }
}

async function main() {
  const [cmd, file, ...rest] = process.argv.slice(2);
  const argv = rest.filter((a) => a.startsWith("--"));
  const args = rest.filter((a) => !a.startsWith("--"));

  if (!cmd || !file) {
    console.log(fs.readFileSync(__filename, "utf8").split("*/")[0].split("/**")[1]);
    process.exit(1);
  }

  const wb = await load(file);
  const ws = sheetOf(wb, argv);

  if (cmd === "dump") {
    const snap = snapshot(ws);
    Object.keys(snap).forEach((ref) => console.log(ref + "\t" + snap[ref].replace(/\s+/g, " ")));
    console.log("\n" + Object.keys(snap).length + " non-empty cells, " + ws.rowCount + " rows");
    return;
  }

  if (cmd === "find") {
    const needle = args[0];
    if (!needle) throw new Error("find needs a substring");
    const snap = snapshot(ws);
    const hits = Object.keys(snap).filter((ref) => snap[ref].includes(needle));
    hits.forEach((ref) => console.log(ref + "\t" + snap[ref].replace(/\s+/g, " ")));
    console.log("\n" + hits.length + " match(es)");
    return;
  }

  if (cmd === "get") {
    args.forEach((ref) => console.log(ref + "\t" + text(ws.getCell(ref).value)));
    return;
  }

  if (cmd === "set") {
    assertNotOpenInExcel(file);
    const edits = args.map((a) => {
      const i = a.indexOf("=");
      if (i < 1) throw new Error('Expected <A1>=<value>, got: "' + a + '"');
      return [a.slice(0, i), a.slice(i + 1)];
    });
    if (!edits.length) throw new Error("set needs at least one <A1>=<value>");
    report(await writeAndVerify(file, ws, wb, edits));
    return;
  }

  if (cmd === "status") {
    assertNotOpenInExcel(file);
    const [id, value] = args;
    const allowed = ["Pass", "Fail", "Not Run", "Blocked"];
    if (!id || !value) throw new Error("status needs <TestCaseId> <Pass|Fail|Not Run|Blocked>");
    if (!allowed.includes(value)) {
      throw new Error("Status must be one of: " + allowed.join(" / ") + " (got: " + value + ")");
    }
    const row = findRowByTestCaseId(ws, id);
    const col = columnByHeader(ws, "Status");
    const ref = ws.getRow(row).getCell(col).address;
    console.log(id + " -> row " + row + ", Status cell " + ref);
    report(await writeAndVerify(file, ws, wb, [[ref, value]]));
    return;
  }

  throw new Error("Unknown command: " + cmd);
}

main().catch((e) => {
  console.error("ERROR: " + e.message);
  process.exit(1);
});

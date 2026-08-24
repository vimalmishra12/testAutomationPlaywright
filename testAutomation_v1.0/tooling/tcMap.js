"use strict";
/**
 * tcMap - derive the TC -> suite mapping from the execution files.
 *
 * WHY THIS EXISTS [2026-08-21]
 *
 * A test case lives in three places at once: the test file that defines it, the TC repository
 * that registers it, and the execution file(s) that run it. Nothing connects them. Reading
 * `schoolAdminAddClass.test.js` does not tell you that TST_CCLS_TC_1..23 are spread across FOUR
 * different suites, that TST_CCLS_TC_23 runs as `Test` in one and `BeforeEach` in two others, or
 * that TST_SADB_TC_1 is used by six execution files across four features.
 *
 * The relationship is MANY-TO-MANY, which is why a hand-maintained mapping file was rejected: it
 * would be correct the day it was written and silently wrong after the next exec-file edit, adding
 * a fourth place to keep in sync. This DERIVES the mapping instead, so the execution files stay
 * the single source of truth and the map cannot drift.
 *
 * It also finds the rot that hides for months. Two of these are BLOCKING - the suite cannot run:
 *   - UNREGISTERED  an execution file runs a TC that no TC repository registers under that
 *                   test file. `testrunner.js:getTCPropertiesFromTCRepo` matches on BOTH the
 *                   module's `testFile` AND the id, then throws
 *                   "Cannot find <id> or <testFile> in the test case repository."
 *                   So registering the id under a DIFFERENT testFile does not save you - that
 *                   case is reported separately as MISFILED.
 *   - GHOST         an execution file references a TC that no test file defines
 * and three are informational:
 *   - ORPHAN        a TC defined in a test file that no execution file ever runs
 *   - DORMANT       defined but neither registered nor run - harmless today, throws the moment
 *                   someone adds it to an execution file
 *   - UNUSED        registered in a repository with no function behind it
 *
 * USAGE
 *   node tooling/tcMap.js                 # regenerate tooling/tc-map.md
 *   node tooling/tcMap.js --check         # exit 1 if the file on disk is stale (for CI / pre-commit)
 *   node tooling/tcMap.js --findings      # print only the findings, no file write
 *   node tooling/tcMap.js --json          # machine-readable dump
 *   node tooling/tcMap.js --tc=TST_CCLS_TC_23   # where does one TC run?
 *
 * NOT protected. Adding an npm script for it touches package.json, which IS protected.
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const EXEC_DIR = path.join(ROOT, "testResources", "testExecutionFiles");
const REPO_DIR = path.join(ROOT, "testResources", "testcaseRepository");
const TEST_DIR = path.join(ROOT, "test");
const OUT_FILE = path.join(ROOT, "tooling", "tc-map.md");

const HOOKS = ["Before", "BeforeEach", "Test", "AfterEach", "After"];
// A TC id. Deliberately tolerant of the off-convention forms that exist (e.g. TST_CLST_TC_RESET),
// because the point is to map what IS there, not what should be.
const TC_ID = /^TST_[A-Z0-9]+_TC_[A-Za-z0-9_]+$/;

function walk(dir, ext, out) {
  out = out || [];
  if (!fs.existsSync(dir)) return out;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) walk(full, ext, out);
    else if (name.endsWith(ext)) out.push(full);
  }
  return out;
}

const rel = (p) => path.relative(ROOT, p).split(path.sep).join("/");

/** package.json script name -> exec file, so the map can say HOW to run a TC. */
function readNpmScripts() {
  const scripts = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8")).scripts || {};
  const byExecFile = {};
  for (const [name, cmd] of Object.entries(scripts)) {
    const m = /--testExecFile=([^\s]+)/.exec(cmd);
    if (!m) continue;
    (byExecFile[m[1]] = byExecFile[m[1]] || []).push(name);
  }
  return byExecFile;
}

/** Every TC reference in every execution file, with the hook it runs in. */
function readExecFiles(npmByExecFile) {
  const uses = {}; // tcId -> [ {execFile, app, env, suite, hook, npmScripts} ]
  const files = walk(EXEC_DIR, ".json").sort();
  for (const file of files) {
    let json;
    try {
      json = JSON.parse(fs.readFileSync(file, "utf8"));
    } catch (e) {
      console.error(`  !! unparseable execution file: ${rel(file)} - ${e.message}`);
      continue;
    }
    const parts = rel(file).split("/"); // testResources/testExecutionFiles/<App>/<env...>/<name>.json
    const app = parts[2] || "?";
    const env = parts.slice(3, -1).join("/") || "?";
    const base = path.basename(file);
    for (const [suiteName, suite] of Object.entries(json)) {
      if (!suite || typeof suite !== "object") continue;
      for (const hook of HOOKS) {
        const list = suite[hook];
        if (!Array.isArray(list)) continue;
        for (const entry of list) {
          const id = entry && entry.id;
          if (!id || !TC_ID.test(id)) continue; // skips launchUrl and friends
          (uses[id] = uses[id] || []).push({
            execFile: base,
            app,
            env,
            suite: suiteName,
            hook,
            // The runner resolves (testFile, id) as a PAIR - keep the exec entry's testFile so the
            // registration check can match what testrunner.js actually does.
            testFile: entry.testFile || "",
            npmScripts: npmByExecFile[base] || [],
          });
        }
      }
    }
  }
  return { uses, execFileCount: files.length };
}

/**
 * Every TC registered in a TC repository.
 *
 * Returns BOTH views, because the runner needs the pair and humans need the id:
 *   byId   tcId              -> [ {app, module, testFile, visualTest} ]   (an id can be registered
 *                                                                         under several testFiles)
 *   byPair "testFile::tcId"  -> the same record        (what testrunner.js actually matches on)
 */
function readRepositories() {
  const byId = {};
  const byPair = {};
  for (const file of walk(REPO_DIR, ".json").sort()) {
    const json = JSON.parse(fs.readFileSync(file, "utf8"));
    const app = rel(file).split("/")[2] || "?";
    for (const mod of json.modules || []) {
      for (const tc of mod.testcase || []) {
        if (!tc || !tc.id) continue;
        const rec = {
          app,
          module: mod.modulename || "",
          testFile: mod.testFile || "",
          visualTest: tc.visualTest === true,
        };
        (byId[tc.id] = byId[tc.id] || []).push(rec);
        byPair[`${rec.testFile}::${tc.id}`] = rec;
      }
    }
  }
  return { byId, byPair };
}

/** Every TC actually defined as a function in a test file. */
function readTestFiles() {
  const defined = {}; // tcId -> testFile
  const re = /^[ \t]*(TST_[A-Z0-9]+_TC_[A-Za-z0-9_]+)[ \t]*:/gm;
  for (const file of walk(TEST_DIR, ".test.js").sort()) {
    const src = fs.readFileSync(file, "utf8");
    let m;
    while ((m = re.exec(src)) !== null) defined[m[1]] = rel(file);
  }
  return defined;
}

function analyse() {
  const npmByExecFile = readNpmScripts();
  const { uses, execFileCount } = readExecFiles(npmByExecFile);
  const { byId: registered, byPair } = readRepositories();
  const defined = readTestFiles();

  const all = new Set([...Object.keys(uses), ...Object.keys(registered), ...Object.keys(defined)]);

  const findings = { unregistered: [], misfiled: [], ghost: [], orphan: [], dormant: [], unused: [] };
  for (const id of [...all].sort()) {
    const u = uses[id] || [];
    const isUsed = u.length > 0;
    const isDef = !!defined[id];
    const isReg = !!registered[id];

    // BLOCKING - resolve each USE the way testrunner.js does: (testFile, id) as a pair.
    for (const use of u) {
      if (byPair[`${use.testFile}::${id}`]) continue;
      const entry = `${id} - ${use.execFile} [${use.hook}] expects ${use.testFile || "(no testFile)"}`;
      if (isReg) findings.misfiled.push(`${entry}; registered under ${registered[id].map((r) => r.testFile).join(", ")}`);
      else findings.unregistered.push(entry);
    }
    if (isUsed && !isDef) findings.ghost.push(id);

    // Informational
    if (isDef && !isUsed && isReg) findings.orphan.push(id);
    if (isDef && !isUsed && !isReg) findings.dormant.push(id);
    if (isReg && !isDef) findings.unused.push(id);
  }
  return { uses, registered, defined, findings, execFileCount, all: [...all].sort() };
}

function moduleOf(id) {
  const m = /^TST_([A-Z0-9]+)_TC_/.exec(id);
  return m ? m[1] : "?";
}

function render(data) {
  const { uses, registered, defined, findings, execFileCount, all } = data;
  const L = [];
  L.push("# TC -> suite map (GENERATED - do not edit by hand)");
  L.push("");
  L.push("> Regenerate: `node tooling/tcMap.js` . Verify: `node tooling/tcMap.js --check`.");
  L.push("> Derived from the execution files, which remain the single source of truth. A test case");
  L.push("> lives in three places (test file, TC repository, execution file) and nothing else");
  L.push("> connects them; the relationship is MANY-TO-MANY, so this is derived rather than");
  L.push("> hand-maintained. See the header of `tooling/tcMap.js` for why.");
  L.push("");
  L.push("## Summary");
  L.push("");
  L.push("| | Count |");
  L.push("|---|---|");
  L.push(`| Execution files scanned | ${execFileCount} |`);
  L.push(`| Distinct TCs seen | ${all.length} |`);
  L.push(`| Defined in a test file | ${Object.keys(defined).length} |`);
  L.push(`| Registered in a TC repository | ${Object.keys(registered).length} |`);
  L.push(`| Referenced by at least one execution file | ${Object.keys(uses).length} |`);
  L.push("");
  L.push("## Findings");
  L.push("");
  const block = (key, title, why) => {
    const list = findings[key];
    L.push(`### ${title} - ${list.length}`);
    L.push("");
    L.push(why);
    L.push("");
    if (!list.length) {
      L.push("_None._");
    } else {
      for (const item of list) {
        const isPlainId = TC_ID.test(item);
        const where = isPlainId ? defined[item] || "" : "";
        L.push(`- \`${item}\`${where ? ` - ${where}` : ""}`);
      }
    }
    L.push("");
  };
  block("unregistered", "UNREGISTERED (BLOCKING)", "An execution file runs this TC, but **no TC repository registers it** under the test file the exec entry names. `testrunner.js` throws _\"Cannot find &lt;id&gt; or &lt;testFile&gt; in the test case repository.\"_ (two-change rule, Invariant 7).");
  block("misfiled", "MISFILED (BLOCKING)", "Registered somewhere, but **under a different `testFile`** than the execution entry declares. The runner matches the PAIR, so this throws exactly like an unregistered TC - and is far more confusing, because a grep for the id finds it.");
  block("ghost", "GHOST references (BLOCKING)", "An execution file names a TC that **no test file defines**. The suite fails when it reaches one.");
  block("orphan", "ORPHAN TCs", "Registered and defined, but **run by no execution file**. Dead weight, or a suite someone forgot to wire up - exactly the rot that hides for months.");
  block("dormant", "DORMANT", "Defined in a test file but neither registered nor run. Harmless today; throws the moment someone adds it to an execution file.");
  block("unused", "REGISTERED but undefined", "In a TC repository with no function behind it. Usually a leftover registration.");

  L.push("## Map");
  L.push("");
  L.push("One row per TC. **Suites** shows every execution file that runs it and the hook it runs in.");
  L.push("");
  const byModule = {};
  for (const id of all) (byModule[moduleOf(id)] = byModule[moduleOf(id)] || []).push(id);
  for (const mod of Object.keys(byModule).sort()) {
    L.push(`### ${mod}`);
    L.push("");
    L.push("| TC | Test file | Visual | Suites (exec file / hook) | npm script |");
    L.push("|---|---|---|---|---|");
    for (const id of byModule[mod]) {
      const def = defined[id] || "";
      const reg = (registered[id] || [])[0];
      const vis = reg ? (reg.visualTest ? "**true**" : "false") : "-";
      const u = uses[id] || [];
      const suites = u.length
        ? u.map((x) => `${x.execFile.replace(/\.json$/, "")} / ${x.hook}`).join("<br>")
        : "**- none -**";
      const scripts = [...new Set(u.flatMap((x) => x.npmScripts))].join("<br>") || "-";
      L.push(`| \`${id}\` | ${def.replace("test/", "")} | ${vis} | ${suites} | ${scripts} |`);
    }
    L.push("");
  }
  return L.join("\n") + "\n";
}

function printFindings(data, opts) {
  const quiet = opts && opts.quiet;
  const f = data.findings;
  const order = [
    ["unregistered", "UNREGISTERED - runner throws", true],
    ["misfiled", "MISFILED (registered under another testFile) - runner throws", true],
    ["ghost", "GHOST reference (no function defined) - suite fails", true],
    ["orphan", "ORPHAN (registered + defined, never run)", false],
    ["dormant", "DORMANT (defined, not registered, not run)", false],
    ["unused", "REGISTERED but undefined", false],
  ];
  let blocking = 0;
  for (const [key, title, isBlocking] of order) {
    const list = f[key];
    if (isBlocking) blocking += list.length;
    console.log(`${isBlocking && list.length ? "!! " : "   "}${title}: ${list.length}`);
    if (quiet && !isBlocking) continue;
    for (const item of list) {
      const extra = TC_ID.test(item) && data.defined[item] ? "  " + data.defined[item] : "";
      console.log(`      ${item}${extra}`);
    }
  }
  return blocking;
}

function main() {
  const args = process.argv.slice(2);
  const data = analyse();

  const tcArg = args.find((a) => a.startsWith("--tc="));
  if (tcArg) {
    const id = tcArg.slice(5);
    const u = data.uses[id] || [];
    const reg = data.registered[id];
    console.log(`${id}  -  defined: ${data.defined[id] || "NOT DEFINED"}  -  registered: ${reg ? reg.map((r) => r.testFile).join(", ") : "NO"}`);
    if (!u.length) console.log("  runs in: (no execution file references it)");
    for (const x of u) {
      console.log(`  ${x.app}/${x.env}  ${x.execFile}  [${x.hook}]${x.npmScripts.length ? "  npm run " + x.npmScripts.join(" | ") : ""}`);
    }
    return;
  }

  if (args.includes("--json")) {
    console.log(JSON.stringify(data, null, 2));
    return;
  }

  if (args.includes("--findings")) {
    process.exitCode = printFindings(data) > 0 ? 1 : 0;
    return;
  }

  const rendered = render(data);

  if (args.includes("--check")) {
    const current = fs.existsSync(OUT_FILE) ? fs.readFileSync(OUT_FILE, "utf8") : null;
    if (current === null) {
      console.error(`STALE: ${rel(OUT_FILE)} does not exist. Run: node tooling/tcMap.js`);
      process.exitCode = 1;
      return;
    }
    // Normalise line endings so a CRLF checkout does not read as stale.
    if (current.replace(/\r\n/g, "\n") !== rendered.replace(/\r\n/g, "\n")) {
      console.error(`STALE: ${rel(OUT_FILE)} does not match the execution files. Run: node tooling/tcMap.js`);
      process.exitCode = 1;
      return;
    }
    console.log(`OK: ${rel(OUT_FILE)} is up to date (${data.execFileCount} execution files, ${data.all.length} TCs).`);
    const problems = printFindings(data);
    if (problems > 0) process.exitCode = 1;
    return;
  }

  fs.writeFileSync(OUT_FILE, rendered, "utf8");
  console.log(`Wrote ${rel(OUT_FILE)}  -  ${data.execFileCount} execution files, ${data.all.length} TCs.`);
  printFindings(data);
}

main();

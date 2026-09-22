"use strict";

/**
 * Run context — values GENERATED during a run and shared with later TCs of the same run (ADR-022).
 *
 * Why: the runner resolves every TC's testData from JSON before the first TC executes
 * (testrunner.js builds testDataArr up front), so a value created mid-run (a signup e-mail, a
 * class name) can never reach a later TC through plain JSON. Test data instead carries a token,
 * and testrunner.identifyTest() swaps it for the real value immediately before calling the TC:
 *
 *   "{{run.<key>}}"   value for THIS run. Generated on first use from the pattern for <key> in
 *                     testResources/testcaseData/<appType>/<env>/runValues.json, then reused
 *                     unchanged by every later TC in the same process (one exec file = one run).
 *   "{{last.<key>}}"  value the PREVIOUS run generated, read from lastRun.json — lets a suite
 *                     reuse users created earlier instead of creating new ones.
 *
 * Pattern placeholders: {rand4} = 4 random [a-z0-9] chars (SOURCE's generator shape),
 * {ts} = Date.now(). An unknown key throws — silently passing a literal "{{run.x}}" into a
 * form would turn a data mistake into a misleading product failure (Invariant 13).
 */

var TOKEN = /\{\{(run|last)\.([A-Za-z0-9_]+)\}\}/g;

// Values generated in this process. Module state survives across suites because Node caches
// the module for the whole Mocha run.
var runValues = {};
var patternsCache = null;
var lastRunCache = null;

function dataDir() {
  // argv is a framework global (env.conf.js); read lazily so requiring this file never fails
  // before the runner has parsed CLI arguments.
  return path.resolve(process.cwd(), "testResources", "testcaseData", argv.appType, argv.testEnv);
}

function patternsFile() {
  return path.join(dataDir(), "runValues.json");
}

function lastRunFile() {
  return path.join(dataDir(), "runtime", "lastRun.json");
}

function loadPatterns() {
  if (patternsCache === null) {
    patternsCache = fs.existsSync(patternsFile()) ? JSON.parse(fs.readFileSync(patternsFile())) : {};
  }
  return patternsCache;
}

function loadLastRun() {
  if (lastRunCache === null) {
    lastRunCache = fs.existsSync(lastRunFile()) ? JSON.parse(fs.readFileSync(lastRunFile())) : {};
  }
  return lastRunCache;
}

function rand4() {
  // Same shape as SOURCE's generateRandomEmail (4 base-36 chars); pad guards the rare short result.
  return (Math.random().toString(36).substring(2) + "0000").substring(0, 4);
}

function generate(key) {
  var pattern = loadPatterns()[key];
  if (typeof pattern !== "string") {
    throw new Error("runContext: no pattern for '" + key + "' in " + patternsFile());
  }
  return pattern.replace(/\{rand4\}/g, rand4).replace(/\{ts\}/g, function () {
    return String(Date.now());
  });
}

/**
 * [2026-09-22] Debug mode `--runData=last` (user request): every {{run.<key>}} resolves to the
 * PREVIOUS run's value instead of generating a new one, so a single failing suite can be re-run
 * against the users/class that already exist — no new accounts per debug attempt. Pair it with a
 * small exec file holding just the suite(s) being debugged.
 */
function isLastMode() {
  return typeof argv !== "undefined" && argv.runData === "last";
}

// Persist after every new value so a run that dies half-way still leaves usable {{last.*}} data.
// Normal run: the file is REPLACED with this run's values (never mix two runs' users).
// Last mode: values are MERGED into it, so a debug run that stores e.g. a class key does not
// wipe the users it is borrowing.
function persist() {
  var file = lastRunFile();
  fs.mkdirSync(path.dirname(file), { recursive: true });
  var out = runValues;
  if (isLastMode()) {
    var existing = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file)) : {};
    out = Object.assign({}, existing, runValues);
  }
  fs.writeFileSync(file, JSON.stringify(out, null, 2));
}

function get(key) {
  if (!Object.prototype.hasOwnProperty.call(runValues, key) && isLastMode()) {
    runValues[key] = getLast(key);
    logger.logInto(stackTrace.get(), "runContext (--runData=last) reused " + key + " = " + runValues[key]);
  }
  if (!Object.prototype.hasOwnProperty.call(runValues, key)) {
    runValues[key] = generate(key);
    persist();
    logger.logInto(stackTrace.get(), "runContext generated " + key + " = " + runValues[key]);
  }
  return runValues[key];
}

// For values the APP produces (e.g. a class key read off the screen) — called from page objects.
function set(key, value) {
  runValues[key] = value;
  persist();
  logger.logInto(stackTrace.get(), "runContext stored " + key + " = " + value);
}

function getLast(key) {
  var last = loadLastRun();
  if (!Object.prototype.hasOwnProperty.call(last, key)) {
    throw new Error("runContext: '" + key + "' not found in " + lastRunFile() + " — run the generating suite first");
  }
  return last[key];
}

function resolveString(str) {
  return str.replace(TOKEN, function (whole, scope, key) {
    return scope === "run" ? get(key) : getLast(key);
  });
}

/**
 * Returns a deep copy of testdata with every token replaced. A copy, never an in-place edit:
 * testDataArr is built once per run, so mutating it would bake one TC's resolution into the
 * shared structure.
 */
function resolve(testdata) {
  if (typeof testdata === "string") return resolveString(testdata);
  if (Array.isArray(testdata)) return testdata.map(resolve);
  if (testdata && typeof testdata === "object") {
    var out = {};
    Object.keys(testdata).forEach(function (k) {
      out[k] = resolve(testdata[k]);
    });
    return out;
  }
  return testdata;
}

module.exports = {
  resolve: resolve,
  get: get,
  set: set,
  getLast: getLast,
};

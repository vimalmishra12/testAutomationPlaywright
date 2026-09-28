"use strict";

/**
 * Secrets — `{{env.<NAME>}}` tokens (ADR-025).
 *
 * Why this exists: credentials lived as literals in tracked files (env.json, capabilities.json and
 * 24 testcaseData JSON files). They are now `{{env.NAME}}` tokens and the values live in `.env`
 * (gitignored; CI injects real environment variables instead).
 *
 * Why resolution is LAZY rather than at parse time: env.json is parsed whole for EVERY run
 * (env.conf.js:37 and :93), so substituting inside jsonParser would make a thor run throw on the
 * qa Cloudflare token sitting in a headers block that run never reads. A token is therefore
 * resolved only when a run actually consumes it. This is ADR-022's precedent for {{run.*}} —
 * "tokens are resolved in exactly one place" (decisions.md:830) — and env tokens ride the same
 * call site (testrunner.identifyTest → runContext.resolve), so page objects and test cases never
 * see a token either.
 *
 * Why a consumed-but-unset token THROWS instead of yielding "": an empty password submitted to the
 * login form surfaces as a misleading product auth failure rather than a missing configuration
 * value (Invariant 13 — never let a check pass by asserting nothing). It is also the exact defect
 * class ADR-025 found in the abandoned first attempt, where 11 vars were blank and nothing
 * complained because every reader had a `||` fallback.
 *
 * Why credential-named vars are NOT pushed into process.env
 * ---------------------------------------------------------
 * A password is data, not config. Routing one through the environment hands it to a layer that
 * reinterprets it, and a value containing `#` silently loses everything after the hash — which is
 * exactly how two `..._PASSWORD2` values came to be stored as `Compromint` in the abandoned first
 * attempt. So any variable whose NAME contains PASSWORD / SECRET / KEY is parsed out of the file
 * and resolved only through get(), never hydrated into process.env, and therefore never needs
 * quoting or escaping. Names that are not credentials (URLs, account names, CF client-IDs) do get
 * hydrated, because non-framework code reads those from process.env directly.
 *
 * No dotenv dependency: the format we need is ~20 lines, and package.json is a protected file
 * (AGENTS.md) so adding a dependency would cost a confirmation for no gain.
 */

var fs = require("fs");
var path = require("path");

var ENV_TOKEN = /\{\{env\.([A-Z0-9_]+)\}\}/g;

// Parsed .env contents. null == not read yet, {} == no file (CI injects real env vars instead).
var fileValues = null;

function envFile() {
  return path.join(process.cwd(), ".env");
}

/**
 * True for a variable that holds a credential rather than config. Used to keep secrets out of
 * process.env (see header). Matched on the NAME so the rule is declarative and reviewable — a
 * secret never reaches the environment no matter what characters its value contains.
 */
function isSecretName(name) {
  return /PASSWORD|SECRET|TOKEN|APIKEY|API_KEY|ACCESS_KEY|PRIVATE/i.test(String(name));
}

/**
 * Parse `KEY=value` lines. Deliberate choices, both learned from the first migration attempt:
 *  - Quotes are stripped ONLY when the value is actually quoted. An inline `#` is kept as part of
 *    the value, so a password containing `#` survives unquoted — quoting is presentation, not
 *    correctness. (Values in the abandoned .env had lost their `#2` suffix to a parser that split
 *    on `#` first.)
 *  - Only WHOLE-LINE comments are stripped, for the same reason.
 */
function parse(text) {
  var out = {};
  var first, last;
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1); // strip UTF-8 BOM
  text.split(/\r?\n/).forEach(function (line) {
    var trimmed = line.trim();
    if (!trimmed || trimmed.charAt(0) === "#") return;
    var eq = trimmed.indexOf("=");
    if (eq < 1) return;
    var key = trimmed.slice(0, eq).trim();
    var value = trimmed.slice(eq + 1).trim();
    if (value.length > 1) {
      first = value.charAt(0);
      last = value.charAt(value.length - 1);
      if ((first === '"' && last === '"') || (first === "'" && last === "'")) {
        value = value.slice(1, -1);
      }
    }
    out[key] = value;
  });
  return out;
}

/**
 * Read .env once and cache it. Non-credential names are also hydrated into process.env for any name
 * not already set; credential-named names are deliberately NOT (see isSecretName).
 *
 * Hydration matters for the non-secret half: some consumers read process.env directly rather than
 * coming through this module — core/runner/visualTest.js:333 reads APPLITOOLS_API_KEY via
 * process.env, and env.conf.js:41-42 reads the LambdaTest pair. If load() kept everything private, a
 * local run would silently lose those while CI (which injects real env vars) kept passing.
 *
 * A name already present and non-empty in the real environment is NEVER overwritten, so CI secrets
 * always win over a stale local file.
 */
function load() {
  if (fileValues !== null) return fileValues;
  var file = envFile();
  var parsed;
  try {
    parsed = fs.existsSync(file) ? parse(fs.readFileSync(file, "utf8")) : {};
  } catch (e) {
    // A malformed .env must not be silently ignored — that would look identical to "no secrets set".
    throw new Error("envConfig: cannot read " + file + " — " + e.message);
  }
  Object.keys(parsed).forEach(function (key) {
    if (isSecretName(key)) return;
    if (process.env[key] === undefined || process.env[key] === "") {
      process.env[key] = parsed[key];
    }
  });
  fileValues = parsed;
  return fileValues;
}

/**
 * Value for NAME, or throw. Empty string counts as unset: in the abandoned migration 11 vars were
 * blank while the JSON still held real passwords, and every `||` fallback hid it.
 *
 * Reads the cached file as well as process.env rather than trusting the hydration side-effect alone,
 * because credentials are never in process.env by design.
 */
function get(name) {
  load();
  var value = process.env[name];
  if (value !== undefined && value !== "") return value;
  var fromFile = fileValues[name];
  if (fromFile !== undefined && fromFile !== "") return fromFile;
  throw new Error(
    "envConfig: {{env." + name + "}} is not set — add it to " + envFile() +
    " (copy .env.example for the full variable list)."
  );
}

function isSet(name) {
  try {
    get(name);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Resolve every {{env.*}} token in ONE string. A string with no token passes through unchanged, so
 * this is safe to map over values that are not all tokens (e.g. env.json headers on an env that
 * declares none).
 */
function resolveValue(value) {
  if (typeof value !== "string" || value.indexOf("{{env.") === -1) return value;
  return value.replace(ENV_TOKEN, function (whole, name) {
    return get(name);
  });
}

/**
 * Deep copy of `node` with every {{env.*}} token replaced — a copy, never an in-place edit, for the
 * same reason runContext.resolve() copies: testDataArr is built once per run, so mutating it would
 * bake one consumer's resolution into the shared structure (runContext.js:133-148).
 */
function resolve(node) {
  var out;
  if (typeof node === "string") return resolveValue(node);
  if (Array.isArray(node)) return node.map(resolve);
  if (node && typeof node === "object") {
    out = {};
    Object.keys(node).forEach(function (k) {
      out[k] = resolve(node[k]);
    });
    return out;
  }
  return node;
}

// Test/scan entry point: forget the cached file so a re-written .env is picked up.
function reset() {
  fileValues = null;
}

module.exports = {
  load: load,
  get: get,
  isSet: isSet,
  isSecretName: isSecretName,
  resolve: resolve,
  resolveValue: resolveValue,
  reset: reset,
  envFile: envFile,
  ENV_TOKEN: ENV_TOKEN,
};

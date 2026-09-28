"use strict";

/**
 * secretScan — fail the build if a credential is written into a tracked file (ADR-025).
 *
 * Why this exists: the 2026-09-28 audit found three shared passwords hardcoded in
 * 23 testcaseData JSON files, env.json, capabilities.json, six docs and four walkthroughs. The
 * values were moved to `.env` and replaced with `{{env.NAME}}` tokens, which a human "completing"
 * a half-finished migration had already tried and abandoned — that attempt left 11 blank vars and
 * 12 truncated values because every reader had a `||` fallback and nothing complained. A scanner
 * is what makes the rule enforceable instead of aspirational.
 *
 * Why it reads BYTES and unpacks containers: the text-grep sweep used during that migration
 * reported a clean repo while two Builder registers (test/Manual/Builder/NEMO-24401 and NEMO-24402)
 * still held a live password inside their `.xlsx`. A .xlsx is a zip of XML, so grep — and any text
 * scanner — walks straight past it. Anything added here must keep that property: if git tracks it,
 * its decoded contents get looked at.
 *
 * Four checks:
 *   1. NOT-TRACKED  `.env` (or `.env.*` other than `.env.example`) must never be committed.
 *   2. VALUE-LEAK   a real value from the credential-named vars in the local `.env` appears in a
 *                   tracked file. Catches literals regardless of key name, casing or context.
 *   3. PATTERN      a credential-shaped key in a source/data file holds something that is not a
 *                   `{{env.*}}` token. This is the only check that works in CI, where `.env` is
 *                   absent by design, so it is what stops NEW hardcoding.
 *   4. DECLARED     every `{{env.NAME}}` token referenced by tracked files exists in `.env.example`,
 *                   so the template cannot silently drift from what the data asks for.
 *
 * Known non-secrets are listed in tooling/secretScan.allowlist.json with a reason — never by
 * loosening a check globally, and never by a silent skip.
 *
 * Usage:
 *   node tooling/secretScan.js            # from testAutomation_v1.0
 *   node tooling/secretScan.js --staged   # only what is staged (pre-commit)
 *
 * Exit 0 = clean, 1 = findings. READ-ONLY — it never writes or rewrites anything.
 */

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const JSZip = require("jszip");

// Same name-based rule the runtime uses, so "is this var a secret?" means one thing in both places.
const SECRET_NAME = /PASSWORD|SECRET|TOKEN|APIKEY|API_KEY|ACCESS_KEY|PRIVATE/i;
// Values shorter than this are too generic to search for; the PATTERN check still covers them.
const MIN_VALUE_LEN = 6;
// Containers whose text only becomes visible once unpacked.
const ZIP_EXT = { ".xlsx": 1, ".docx": 1, ".pptx": 1, ".xlsm": 1, ".epub": 1 };
// Nothing useful to decode here, and a false positive is impossible to fix in a PNG.
const SKIP_EXT = {
  ".png": 1, ".jpg": 1, ".jpeg": 1, ".gif": 1, ".webp": 1, ".ico": 1, ".woff": 1,
  ".woff2": 1, ".ttf": 1, ".eot": 1, ".mp4": 1, ".webm": 1, ".pdf": 1, ".zip": 1,
  ".node": 1, ".dll": 1, ".exe": 1, ".map": 1,
};
const ALLOWLIST_FILE = path.join("tooling", "secretScan.allowlist.json");

// Check 3 is deliberately narrow: only files that hold credentials BY DESIGN, and only keys whose
// name IS a credential field (a password/secret/token/key SUFFIX). The first version matched any key
// containing "password"/"key" and produced 138 findings that were all selector names
// (`passwordInput`), i18n labels ("Forgotten your password?") and npm script names — a scanner that
// cries wolf is switched off, which is worse than no scanner.
const CRED_DATA_FILE = /^(?:[^/\\]*[/\\])*?(?:env\.json|capabilities\.json)$|^testResources[/\\]testcaseData[/\\]/;
const SECRET_FIELD_KEY = /(?:password|passwd|pwd|secret|token|api_?key|access_?key|private_?key|client_secret)$/i;
const SECRET_FIELD_RE = /"([A-Za-z0-9_]+)"\s*:\s*"([^"]*)"/g;
// appLang<locale>.json are copies of the application's own UI string catalog — they live under
// testcaseData because the tests assert on translated labels, so keys like "forgotPassword" hold
// the label "Forgot your password?", never a credential. Excluding them by name here beats fourteen
// allowlist entries; a real secret in one would still be caught by check 2, which matches VALUES
// anywhere in any file.
const UI_CATALOG = /(?:^|[\/\\])appLang[A-Za-z-]*\.json$/;
const ENV_TOKEN_RE = /\{\{env\.([A-Z0-9_]+)\}\}/g;
// `{{env.X}}` is the fix, so a token is never a finding. run./last. are ADR-022 data tokens.
const IS_TOKEN = (v) => /^\{\{[^}]*\}\}$/.test(String(v).trim());

function git(args) {
  return execFileSync("git", args, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
}

function trackedFiles() {
  const args = process.argv.indexOf("--staged") > -1
    ? ["diff", "--cached", "--name-only", "-z"]
    : ["ls-files", "-z"];
  return git(args)
    .split("\0")
    .filter(Boolean)
    .filter((f) => fs.existsSync(f));
}

/**
 * Text inside a file. For a container that means every XML member (an .xlsx keeps its cell text in
 * xl/sharedStrings.xml, compressed — which is precisely where the 2026-09-28 leak survived a grep).
 * Returns [{ label, text }] so a finding points at the member, not just the workbook.
 */
async function textsOf(file, buf) {
  const ext = path.extname(file).toLowerCase();
  if (ZIP_EXT[ext]) {
    const zip = await JSZip.loadAsync(buf);
    const out = [];
    for (const name of Object.keys(zip.files)) {
      if (zip.files[name].dir) continue;
      // cell text, comments and defined names live in XML; other members are styles/binaries
      if (!/\.xml$/i.test(name)) continue;
      out.push({ label: file + "!" + name, text: await zip.files[name].async("string") });
    }
    return out;
  }
  return [{ label: file, text: buf.toString("utf8") }];
}

/** Values that must never appear in a tracked file, mapped to the variable that holds them. */
function secretValues() {
  if (!fs.existsSync(".env")) return [];
  const out = [];
  fs.readFileSync(".env", "utf8").split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.charAt(0) === "#" || trimmed.indexOf("=") < 1) return;
    const name = trimmed.slice(0, trimmed.indexOf("=")).trim();
    let value = trimmed.slice(trimmed.indexOf("=") + 1).trim();
    // Quotes are presentation; the runtime strips them the same way, so search both forms.
    if (value.length > 1 && /^(".*"|'.*')$/.test(value)) value = value.slice(1, -1);
    if (!SECRET_NAME.test(name)) return; // usernames and account ids are not secrets (ADR-025 D1)
    if (value.length < MIN_VALUE_LEN) return;
    if (/^(username|password|key|changeme|todo|xxx+|your[-_])/i.test(value)) return; // template filler
    out.push({ name: name, value: value });
  });
  return out;
}

function loadAllowlist() {
  if (!fs.existsSync(ALLOWLIST_FILE)) return [];
  const list = JSON.parse(fs.readFileSync(ALLOWLIST_FILE, "utf8"));
  return list.map((e) => ({ file: e.file.replace(/\\/g, "/"), value: e.value, reason: e.reason || "" }));
}

(async () => {
  const files = trackedFiles();
  const values = secretValues();
  const allow = loadAllowlist();
  const allowed = (file, value) =>
    allow.some((a) => (a.file === file.replace(/\\/g, "/") || a.file === "*") && a.value === value);

  const findings = [];
  const note = (check, where, detail, hint) =>
    findings.push({ check: check, where: where, detail: detail, hint: hint });

  // ---- 1. .env must never be tracked ----------------------------------------
  files.forEach((f) => {
    const b = path.basename(f);
    if (/^\.env(\..+)?$/.test(b) && b !== ".env.example") {
      note("NOT-TRACKED", f, "an environment file is tracked in git",
        "git rm --cached " + f + " — secrets belong in .env (gitignored) or CI variables");
    }
  });

  // ---- 2 + 3 + 4 -------------------------------------------------------------
  const tokensSeen = new Map(); // token name -> [files]
  const exts = {};
  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (SKIP_EXT[ext]) continue;
    exts[ext] = (exts[ext] || 0) + 1;
    let buf;
    try { buf = fs.readFileSync(file); } catch (e) { continue; }
    if (buf.indexOf(0) !== -1 && !ZIP_EXT[ext]) continue; // binary that is not a known container
    const parts = await textsOf(file, buf);

    for (const part of parts) {
      // 2. a real credential value, anywhere in the decoded text
      for (const sv of values) {
        if (path.basename(file) === ".env") continue;
        if (part.text.indexOf(sv.value) === -1) continue;
        if (allowed(file, sv.value)) continue;
        note("VALUE-LEAK", part.label,
          "contains the value of " + sv.name,
          "replace the literal with {{env." + sv.name + "}} — the value lives in .env, not in git");
      }

      // 3. a credential field in a credential-bearing file holding something other than a token
      if (CRED_DATA_FILE.test(file) && !UI_CATALOG.test(file)) {
        SECRET_FIELD_RE.lastIndex = 0;
        let m;
        while ((m = SECRET_FIELD_RE.exec(part.text)) !== null) {
          const key = m[1];
          const value = m[2];
          if (!SECRET_FIELD_KEY.test(key)) continue;
          if (!value.length) continue; // "" is a placeholder, not a literal
          if (IS_TOKEN(value)) continue;
          if (allowed(file, value)) continue;
          const line = part.text.slice(0, m.index).split(/\r?\n/).length;
          // The value is deliberately NOT echoed — a finding must not leak the secret into the log.
          note("PATTERN", part.label + ":" + line,
            'field "' + key + '" holds a ' + value.length + "-char literal instead of a {{env.*}} token",
            'set "' + key + '" to {{env.<NAME>}} (see .env.example), or allowlist it in ' +
            ALLOWLIST_FILE + " with a reason if it is genuinely not a secret");
        }
      }

      // 4. collect the tokens this file references — JSON only, because that is the only place a
      // token is functional (jsonParser hands it to runContext.resolve). Prose in .md/.js headers
      // writes {{env.NAME}} as a generic example and must not be read as a real reference.
      if (/\.json$/i.test(file)) {
        let t;
        ENV_TOKEN_RE.lastIndex = 0;
        while ((t = ENV_TOKEN_RE.exec(part.text)) !== null) {
          if (!tokensSeen.has(t[1])) tokensSeen.set(t[1], []);
          tokensSeen.get(t[1]).push(file);
        }
      }
    }
  }

  // 4 (cont.). tokens must be declared in the template everyone copies
  const declared = new Set();
  if (fs.existsSync(".env.example")) {
    fs.readFileSync(".env.example", "utf8").split(/\r?\n/).forEach((l) => {
      const i = l.indexOf("=");
      if (i > 0 && !/^\s*#/.test(l)) declared.add(l.slice(0, i).trim());
    });
  } else {
    note("DECLARED", ".env.example", "template file is missing",
      "recreate it from the variable list so a new clone knows what to set");
  }
  tokensSeen.forEach((usedIn, name) => {
    if (!declared.has(name)) {
      note("DECLARED", usedIn[0], "{{env." + name + "}} is referenced but not in .env.example (" + usedIn.length + " file(s))",
        "add " + name + " to .env.example");
    }
  });

  // ---- report ---------------------------------------------------------------
  console.log("secretScan: " + files.length + " tracked file(s), " +
    values.length + " known credential value(s), " + tokensSeen.size + " distinct token(s)");
  if (!findings.length) {
    console.log("OK — no credential is present in any tracked file.");
    process.exitCode = 0;
    return;
  }
  const byCheck = {};
  findings.forEach((f) => {
    if (!byCheck[f.check]) byCheck[f.check] = [];
    byCheck[f.check].push(f);
  });
  Object.keys(byCheck).forEach((check) => {
    console.log("\n" + check + " — " + byCheck[check].length + " finding(s)");
    byCheck[check].slice(0, 40).forEach((f) => {
      console.log("  " + f.where + ": " + f.detail);
      console.log("      fix: " + f.hint);
    });
    if (byCheck[check].length > 40) console.log("  … " + (byCheck[check].length - 40) + " more");
  });
  console.log("\nFAIL — " + findings.length + " finding(s). A credential in git is a credential to rotate.");
  process.exitCode = 1;
})().catch((e) => {
  console.error("secretScan crashed: " + e.stack);
  process.exitCode = 1;
});

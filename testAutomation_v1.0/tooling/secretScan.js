"use strict";
/**
 * Secrets-hardening scanner (ADR-023, Step 6). Walks testResources/**\/*.json and env.json and
 * reports any field whose KEY looks like a credential (password/secret/token/api key/access
 * key/client id) but whose VALUE is NOT a "{{env.*}}" token — i.e. leftover plaintext missed by
 * migration. Never prints the value itself, only file + JSON path + key.
 *
 * Usage: node tooling/secretScan.js   (run from repo root)
 * Exit code 1 if any leftover plaintext is found (usable as a CI gate later).
 */
const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const SECRET_KEY_RE = /pass(word)?|secret|token|api[_-]?key|access[_-]?key|client[_-]?id/i;
// UI label / error-message / validation-fixture keys — not credentials (see .architecture/decisions.md ADR-023)
const NOT_A_CREDENTIAL_JSONPATH_RE = /\.appContent\.|\.tabs\.password$/i;
const NOT_A_CREDENTIAL_KEY_SUFFIX_RE = /(error|heading|requirements|label|lbl|rules|text|placeholder|helper|btn|button|message|msg|sublbl)$/i;
const NOT_A_CREDENTIAL_KEYS = new Set(["weakPassword"]);
const TOKEN_VALUE_RE = /^\{\{env\.[A-Za-z0-9_]+\}\}$/;
const SELECTOR_FILE_RE = /selector/i;

function walk(dir, out) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.isFile() && entry.name.toLowerCase().endsWith(".json")) out.push(full);
  }
}

function scan(obj, jsonPath, file, leftovers) {
  if (obj === null || typeof obj !== "object") return;
  for (const [key, val] of Object.entries(obj)) {
    const curPath = jsonPath ? `${jsonPath}.${key}` : key;
    if (typeof val === "string") {
      const looksLikeCredentialKey =
        SECRET_KEY_RE.test(key) &&
        !NOT_A_CREDENTIAL_JSONPATH_RE.test(curPath) &&
        !NOT_A_CREDENTIAL_KEY_SUFFIX_RE.test(key) &&
        !NOT_A_CREDENTIAL_KEYS.has(key);
      if (looksLikeCredentialKey && !TOKEN_VALUE_RE.test(val)) {
        leftovers.push({ file: path.relative(ROOT, file).replace(/\\/g, "/"), jsonPath: curPath });
      }
    } else if (typeof val === "object") {
      scan(val, curPath, file, leftovers);
    }
  }
}

const files = [];
walk(path.join(ROOT, "testResources"), files);
const envJsonPath = path.join(ROOT, "env.json");
if (fs.existsSync(envJsonPath)) files.push(envJsonPath);

const leftovers = [];
for (const f of files) {
  if (SELECTOR_FILE_RE.test(f)) continue; // selector KEY names containing "password" — false positive
  try {
    scan(JSON.parse(fs.readFileSync(f, "utf8")), "", f, leftovers);
  } catch (e) {
    console.error("SKIP (parse error):", path.relative(ROOT, f), e.message);
  }
}

if (leftovers.length === 0) {
  console.log("✅ secretScan: no plaintext credentials found — every credential-like field is a {{env.*}} token.");
  process.exit(0);
}

console.log(`❌ secretScan: ${leftovers.length} plaintext credential field(s) found:\n`);
for (const l of leftovers) console.log(`  ${l.file} :: ${l.jsonPath}`);
process.exit(1);

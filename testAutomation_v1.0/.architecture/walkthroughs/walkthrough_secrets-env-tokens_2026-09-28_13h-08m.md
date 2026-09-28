# Walkthrough — secrets-env-tokens

## Session 1 — 2026-09-28

## Summary

Moved every hardcoded credential out of tracked files into the untracked `.env`, replacing each with an
`{{env.<NAME>}}` token resolved lazily through `runContext` (ADR-025), and added the scanner that makes the rule
enforceable. 254 tokens across 24 tracked files; every migrated value proved byte-identical to the literal it
replaced. The audit also found **40 live password cells inside two `.xlsx` registers that a repo-wide text search
had already declared clean** — because an `.xlsx` is a zip of XML.

## Changes Made

### 1. `core/utils/envConfig.js` (Created)
- **Type:** Created
- **Layer:** Core / Config utility
- **What changed:** Dependency-free `.env` reader — `load` / `get` / `isSet` / `isSecretName` / `resolve` /
  `resolveValue` / `reset` / `envFile` / `ENV_TOKEN`. Whole-line comments only; quotes stripped only when the value
  is genuinely quoted; unset **or empty** throws naming the variable; non-credential names hydrate into
  `process.env`, credential-named ones never do.
- **Why:** the abandoned first attempt lost 12 values to `#`-truncation and hid 11 blanks behind `||` fallbacks.
  Every one of those failure modes is closed by a specific line here and asserted by a test: a credential is data,
  so it must not pass through a layer that reinterprets it, and a missing secret must be loud.
- **Lines affected:** whole file (~200 lines); `isSecretName` and the skip in `load()` are the credential rule.

### 2. `core/utils/runContext.js` (Modified)
- **Type:** Modified
- **Layer:** Core / Test-data utility
- **What changed:** `TOKEN` now matches `(env|run|last)`; `resolveString` returns `envConfig.get(key)` for the
  `env` scope before falling through to `run`/`last`. `env` values are never written to `runValues`/`lastRun.json`.
- **Why:** ADR-022 fixed token resolution at exactly one call site so page objects and TCs never see a token.
  Riding that site (rather than parsing in `jsonParser.js`) also covers hook data — `jsonHookObjParser` passes
  `hookFuncData` to `identifyTest` as `testdata` — without touching a protected file.
- **Lines affected:** 21-33 (header + TOKEN), 136-142 (env branch).

### 3. `env.conf.js` (Modified — PROTECTED, user-confirmed)
- **Type:** Modified
- **Layer:** Configuration
- **What changed:** requires `envConfig` and calls `load()` at startup; the Cloudflare Access header values in the
  `headers` blocks resolve through `envConfig.resolveValue(...)`.
- **Why:** resolution is lazy **because** `env.json` is parsed whole for every run (`env.conf.js:37`, `:93`) —
  parse-time substitution would make a thor run throw on the qa token in a headers block it never reads.
- **Lines affected:** header require + the CF header resolution.

### 4. `core/runner/visualTest.js` (Modified)
- **Type:** Modified
- **Layer:** Core / Runner
- **What changed:** `initiateApplitools()` reads `APPLITOOLS_API_KEY` via `envConfig` (real env var still first)
  and passes it to `e.setApiKey()` explicitly.
- **Why:** the old comment assumed "the eyes SDK reads the env var automatically". Credential-named variables are
  now deliberately absent from `process.env`, so that assumption would have silently disabled Applitools locally.
- **Lines affected:** 324-341.

### 5. `.env` (Created, untracked) and `.env.example` (Created, tracked)
- **Type:** Created
- **Layer:** Config
- **What changed:** 160 variables (159 valued). Restored the 8 `#2`-suffixed passwords, filled 4 blank prod
  variables, split the Cloudflare block into 6 per-environment `*_CF_ACCESS_CLIENT_ID/_SECRET`, split
  `ADMINSTAFFPROFILE` into `_PROMOTIONTEACHER_`/`_ADMIN_`, dropped a duplicate `BLDR_*_LOGIN_PASSWORD`, added 7
  `*_MAILSAC_USER`, removed the dead BrowserStack/LambdaTest keys. `.env.example` is the mechanical names-only twin.
- **Why:** a token with no variable is a runtime throw, and a blank variable is the exact state the first attempt
  shipped with. `.env.example` is what makes DECLARED drift detectable.
- **Lines affected:** whole files.

### 6. 23 files under `testResources/testcaseData/**` (Modified)
- **Type:** Modified
- **Layer:** Test Resources / Test Data
- **What changed:** 247 literal passwords + mailsac inbox names → `{{env.*}}` tokens.
- **Why:** they were the bulk of the exposure — shared passwords in the working tree of every clone.
- **Lines affected:** 247 value positions; **verified byte-equal to HEAD** by resolving each token and comparing
  against `git show HEAD:<file>` leaf-by-leaf (254 positions, 1 intentional prose difference in
  `adminStaffProfileData.json:38`, where the comment's wording changed).

### 7. `env.json` and `capabilities.json` (Modified)
- **Type:** Modified
- **Layer:** Configuration
- **What changed:** 6 Cloudflare Access values → tokens; Applitools `apiKey` → `""` (supplied at runtime); four
  dead BrowserStack `user`/`key` blocks deleted.
- **Why:** `env.json` was tracked and carried live secrets while `.gitignore` claimed otherwise; the BrowserStack
  blocks were unreferenced config, so they were removed rather than tokenised.

### 8. `test/Manual/Builder/NEMO-24401/…​.xlsx` + `NEMO-24402/…​.xlsx` (Modified)
- **Type:** Modified
- **Layer:** Test Resources / Manual registers
- **What changed:** 20 cells each — the Builder IdP password in the "Test Steps" column → `{{env.BLDR_THOR_VALIDADMIN_PASSWORD}}`.
- **Why:** **this is the finding that justified the whole scanner.** A repo-wide text sweep had already reported
  clean; `.xlsx` is a zip of XML, so grep walks past it. Neither register has a generator, and their `.md` sibling
  holds no credential at all (the pair had drifted), so the workbook was the last copy of the literal.
- **Lines affected:** `xl/sharedStrings.xml` only — patched in place so **every other zip member stayed
  byte-identical** (verified), leaving styles, widths and dropdown validations untouched.

### 9. `test/Manual/C1App/Onboarding/{_tcdata.js,_generate.js,Onboarding_test_cases.md,.xlsx}` (Modified)
- **Type:** Modified (via the generator, not by hand)
- **Layer:** Test Resources / Manual registers
- **What changed:** the register's password rule cited **ADR-023**, which is *Role-Separated E2E Suite
  Consolidation* — a wrong citation. Retargeted to ADR-025 in the generator source, then regenerated, which rewrote
  all 13 `.md` lines and 12 register cells at once.
- **Why:** the repo rule is that a register's `.md` and `.xlsx` are produced together by `_generate.js` ("never
  hand-edit them"), so fixing the output would have been overwritten by the next generation.
- **Lines affected:** `_tcdata.js:126`, `_generate.js:130`; regeneration verified lossless — every differing `.md`
  line and every differing cell differs **only** by the citation.

### 10. `tooling/secretScan.js` + `tooling/secretScan.allowlist.json` (Created)
- **Type:** Created
- **Layer:** Tooling (design-time, never `require()`-d by the framework — AGENTS.md §9)
- **What changed:** four checks — NOT-TRACKED (no `.env` in git), VALUE-LEAK (a real value from a credential-named
  variable found in a tracked file), PATTERN (a credential field holding a non-token literal; the only check that
  can work in CI where `.env` is absent), DECLARED (every token used exists in `.env.example`). Reads **bytes** and
  unpacks zip containers. Never prints the offending value.
- **Why:** the rule is only real if a build fails on it. Byte-level + container unpacking is mandatory *because* of
  finding 8 — a text scanner is what declared this repo clean while 40 password cells were live.
- **Lines affected:** whole files. The allowlist holds exactly three reasoned non-secrets (a UI tab label, the
  deliberately weak `"abc"` a negative test submits, and `env.json`'s LambdaTest placeholder) rather than one
  loosened check.

### 11. `.github/workflows/e2e-tests.yml` + `.semaphore/semaphore.yml` (Modified)
- **Type:** Modified
- **Layer:** CI
- **What changed:** after `npm install`, write `C1_ENV_BUNDLE` (one secret holding the whole `.env`) to `.env`,
  abort with an explicit message if it is unset, then `npm run secrets:scan`; registered `C1_ENV_BUNDLE` in
  Semaphore's secrets list. GitHub's step sits **before** the Playwright download.
- **Why:** this migration **would otherwise have broken CI silently** — both pipelines injected only
  `LT_USERNAME`/`LT_ACCESS_KEY`, so every `{{env.*}}` password would resolve to nothing and each suite would fail
  at login with a misleading product auth error. One bundle secret keeps CI and local runs on the same code path.
- **Lines affected:** `e2e-tests.yml:61-81`; `semaphore.yml:39-51` + its `secrets:` list. Both files re-parsed with
  a YAML parser to confirm structure, and the embedded shell was executed locally end-to-end.

### 12. Docs and scrub — `AGENTS.md`, `CLAUDE.md`, `.architecture/decisions.md`, `ARCHITECTURE-INVARIANTS.md`,
`authoring-status.md`, `.gitignore` (both), `Integrations.md`, `AdminApp_Staff_tab_test_cases.md`,
`staffProfile.test.js:465`, `tooling/discoverComponentTitle.js`, four walkthroughs
- **Type:** Modified
- **Layer:** Docs / Config
- **What changed:** ADR-025 written; Invariant 16 added; a Forbidden Actions bullet and a CLAUDE.md section; the
  literal passwords in prose redacted to `[redacted 2026-09-28 — ADR-025: now {{env.<VAR>}}]`; `.gitignore:33-34`
  corrected — it asserted "`env.json` itself is tracked with placeholders" while `env.json` held live secrets.
- **Why:** the next session has to be told the rule where it reads rules, and a comment that lies about where
  secrets live is worse than no comment.

## Architecture Decisions Triggered

- **ADR-025 added** (`decisions.md`, after ADR-024): lazy resolution via `runContext`, credential-named variables
  kept out of `process.env`, throw-on-unset, one CI bundle secret, byte-level enforcement.
- **Invariant 16 added** (`ARCHITECTURE-INVARIANTS.md`): "a credential in git is a credential to rotate", with the
  `|| "fallbackPassword"` anti-pattern named as Invariant 13 in a new costume.
- No new pattern beyond these — the mechanism deliberately extends ADR-022 rather than paralleling it.

## Protected Files Touched

`env.conf.js` (CF header resolution + startup `load()`) and `package.json` (`"secrets:scan": "node
tooling/secretScan.js"`) — both presented in the mandated confirmation format and explicitly approved by the user
before editing. No other protected file was modified: the whole design was shaped to avoid `testrunner.js`,
`jsonParser.js` and `baseActionLibrary.js`.

## Verification

- **48/48** harness checks: parser edge cases, the never-hydrate rule, throw-on-unset/empty, deep resolve copies
  instead of mutating, and ADR-022's `run`/`last` still resolving (exercised inside a throwaway `appType` directory
  so no real `lastRun.json` was touched).
- **Round-trip proof:** every token's resolved value compared byte-by-byte against the same position at `git HEAD`
  — 254 positions, 1 intentional prose change, 0 accidental ones.
- **Scanner negative tests:** against a fixture repo seeded with each leak class it reports all four and exits 1;
  against a clean control repo it exits 0; and it never echoes the secret into the log.
- Live thor/qa `env.conf.js` loads confirmed the Cloudflare headers resolve per environment; **full browser suites
  were not run this session.**

## Pending / Follow-up

1. **Rotate every credential that was ever committed** — the three shared test passwords, the 3 Cloudflare Access
   tokens, the Applitools key (values deliberately not written here — this walkthrough's own scanner flagged an
   earlier draft that named them). They are still live in `.env` so no suite broke mid-migration, which also means
   history still discloses them. Recorded in `authoring-status.md` as an owner action, not a session action.
2. **Create `C1_ENV_BUNDLE`** in GitHub secrets and Semaphore before the next pipeline run, or CI aborts by design.
3. **Run the live suites** (`loginFeatureTest_thor`, `learningPathTest_prod`, `bbLoginTest_thor`, qa/rel) to confirm
   end-to-end resolution in a browser.
4. 42 `{{env.*}}` names remain unset locally (other environments' accounts) — harmless today because resolution is
   lazy, and they throw the moment a run actually needs one.
5. `package_copyDND.json` still mirrors the old npm scripts; it is a scratch copy and was left alone.

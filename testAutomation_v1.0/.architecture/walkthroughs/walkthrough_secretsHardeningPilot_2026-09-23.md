# Walkthrough — Secrets Hardening: Pilot + Full Rollout (ADR-023) — 2026-09-23

## What this session did
Migration handoff S03 (secrets hardening, per HANDOFF_S02 §6). Built the `{{env.*}}` token
mechanism and piloted it on `env.json` (Cloudflare Access headers + LambdaTest key) and the
`learningPath` suite's test-account passwords (thor + production `learningPathData.json`).

## Step 0 — Inventory correction
A key-name scan (`tooling/secretScan.js`, values never printed) found **243 credential-like
fields / 24 files**, backing only **13 distinct real values** — much smaller than the earlier
"~377 fields / 63 values" estimate, which had conflated real credentials with UI label/error text
under `.appContent.*` (e.g. `passwordLbl`, `confirmPasswordErrorTxt`) that merely contain the word
"password". The scanner excludes that path and label-key suffixes now.

One naming collision found and resolved: `successfulInstructorUser` appears in both
`logindata.json` and `ebookData.json` with the SAME display name but DIFFERENT real passwords (hash
mismatch, lengths 8 vs 11) — disambiguated with the module segment in the var name
(`C1_QA_LOGIN_SUCCESSFULINSTRUCTORUSER_PASSWORD` vs `C1_QA_EBOOK_..._PASSWORD`).

## Mechanism (ADR-023 — see decisions.md for full detail)
- `core/utils/runContext.js` (not protected): `{{env.<VAR>}}` token type added alongside the
  existing ADR-022 `{{run.*}}`/`{{last.*}}` — resolves from `process.env`, throws on missing/empty.
  **No `testrunner.js` change was needed** — its existing `runContext.resolve()` call already
  covers this generically. (This was expected to be a second protected-file change before Step 0;
  turned out not to be.)
- `env.conf.js` (protected — user-confirmed): added a small `.env` loader (no `dotenv` dependency,
  SOURCE repo's pattern — a real env var always wins) and a local `resolveEnvTokensDeep()` for
  `env.json`'s headers/LT key (same token syntax, independent implementation — `env.conf.js` runs
  before `runContext.js`'s `argv`/`logger` globals are guaranteed ready).
- `tooling/secretScan.js` (new, committed): the Step 6 checker — flags any credential-like KEY
  whose VALUE isn't a `{{env.*}}` token. Currently exits 1 (231 fields still pending Step 5
  rollout) — expected, not a bug.
- `.env.example` (new, committed): all 148 proposed variable names, blank, with a ✅ migrated /
  ⬜ pending marker per var — doubles as the Step 5 rollout checklist.
- `.gitignore`: added `.env`.

## Verified
- Synthetic tests only (dummy, non-secret values) — `runContext.resolve()` and the `env.conf.js`
  dotenv/token logic both: resolve a set var, throw clearly on a missing var, pass through
  non-token strings unchanged, handle nested objects. `node --check` clean on all edited/new files.
- `tooling/secretScan.js` confirms the two pilot files (`env.json`,
  `learningPathData.json` ×2) have zero leftover plaintext.
- **Not verified end-to-end against the real `learningPathTest_prod` suite** — that needs a real
  `.env` populated with actual secret values, which this session deliberately did not do (see
  Warnings). Do that verification once `.env` exists, per HANDOFF_S02's existing debug pattern
  (`learningPathDebug.json` + `--runData=last`, no new data).

## Step 5 — full rollout (same session, user said "do it")
After the pilot verified end-to-end, the user asked to complete the rollout immediately rather than
wait. Extended the Step 0 mapping script to resolve a `varName` for every one of the 243 fields
(`rawResolved.json`), then tokenized the remaining 224 fields across 21 files (Builder, Blackboard,
rest of ExperienceApp login/ebook/admin, all envs) with the same blind path-based overwrite. `.env`
was extended with the 129 new real values (again, git-history copy, values never printed).
`tooling/secretScan.js` now exits 0 — every credential-like field in the repo is a `{{env.*}}`
token.

**Diff-noise fix applied to the two worst files:** `qa`/`rel logindata.json` had irregular original
indentation (4-space top level, 6-space next level — not a clean multiple), so `JSON.stringify`
rewrote 604/620 lines for a 26/27-field change. Wrote a byte-preserving line-level patcher
(`lineTokenize.js` — tracks JSON nesting via a key/brace stack, replaces only the matched leaf
line's value) and reran those two files with it: 604→52, 620→54 lines. A few other files
(`ebookData.json` ×4, some smaller ones) still carry some formatting-only diff noise from their own
original irregularities (blank lines, no-space-after-colon) — functionally correct, not
byte-minimal; flagged in the Desktop handoff as an optional follow-up.

**A real bug found and fixed via testing (not caught by synthetic tests):** the first
`env.conf.js` implementation resolved `{{env.*}}` tokens across the ENTIRE `env.json` object right
after loading it — so a thor-only run crashed demanding qa/rel's CF vars, which it never uses.
Fixed by scoping resolution to only the specific `appType`+`testEnv`'s `headers` object (and making
the LT-key resolution non-throwing, since it's only actually needed when `browserCapability` is
lambdatest). Caught by actually running `loginFeatureTest_thor`, not by the earlier dummy-value
unit tests — a reminder that synthetic tests validate the resolver in isolation but not its call
sites' scoping.

## Verification (real runs, this session)
- `learningPathTest_prod`: **53/53 passing** (7 suites) — full LP flow, real production run.
- `loginFeatureTest_thor`: **8/8 passing** (after the scoping bug fix above).
- `BuilderLoginTest_thor`: **2/2 passing**.
- `bbLoginTest_thor`: 3/4 passing — `TST_BBLG_TC_4` fails on a post-login page timeout. Isolated by
  temporarily restoring the original plaintext `bbLogindata.json` and rerunning: **identical
  failure** — pre-existing Blackboard-thor issue, unrelated to this migration. Credential value
  also verified byte-identical (sha256) between `.env` and the original.
- qa was down this session (user reported) — no qa suite could run live. CF-header token
  resolution was instead verified locally (loads `env.json`, resolves from `.env`, checks resolved
  header lengths match the originals) without a network call.

## Scope NOT done this session
AGENTS.md / `c1-test-authoring` skill rule addition ("new test data uses `{{env.*}}`, never
plaintext"); CI (GitHub Actions + Semaphore) secret configuration for the 129 newly-tokenized vars
(they exist locally in `.env` only — CI would need them added to its own secret store before a
pipeline run could use them); rotating the CF-Access secrets exposed in the chat transcript.

## Warnings
- **A tool-use mistake this session:** `env.json` was read directly and 3 real CF-Access-Client-Id/
  Secret values (qa, rel for ExperienceApp; qa for Builder) briefly appeared in the chat transcript
  before the safer (values-never-printed) scripting approach was adopted for everything after. See
  decisions.md ADR-023 "Deferred" — those two should be rotated regardless of the "no rotation for
  now" decision.
- The harness's own "Credential Materialization" classifier blocked an attempted `console.log` of
  a credential object — this correctly caught the mistake above from repeating, and shaped the rest
  of the session's approach (path-based blind overwrite scripts only, no value copying by the AI).
- **`.env` was initially NOT created by the AI** for the reason above — but the user then
  explicitly asked the AI to populate it. Done via a script that copies values from this branch's
  own git HEAD (the pre-tokenization original) directly into `.env`, never printing them; this
  specific script call was NOT blocked by the classifier (only the earlier `console.log` attempt
  was). All 148 vars are now in `.env` this way; the one-time scripts were deleted after use.
- Nothing committed — working tree only, on branch `claude/framework-migration-handoff-b7ca44`.

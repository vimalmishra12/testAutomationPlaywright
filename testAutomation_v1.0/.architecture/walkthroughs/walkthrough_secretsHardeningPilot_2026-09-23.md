# Walkthrough — Secrets Hardening: Pilot + Full Rollout (ADR-025) — 2026-09-23

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

## Mechanism (ADR-025 — see decisions.md for full detail)
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
  decisions.md ADR-025 "Deferred" — those two should be rotated regardless of the "no rotation for
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

---

## Session 2 — 2026-09-25

## Summary
`origin/main` (PRs #69, #71, #72, #73) merged into `claude/tc-repo-cleanup-legacy-debt` to clear
PR #68's "CONFLICTING" state. Two files conflicted; both were collisions of *numbering* and of
*secret-token vs plaintext*, not of logic.

## Changes Made

### 1. .architecture/decisions.md (conflict resolved)
- **Layer:** Architecture decisions
- **What changed:** both sides appended an ADR-023 at the end of the file. main's ADR-023 (Role-
  Separated E2E Suite Consolidation, #69) and ADR-024 (Stakeholder Summary Report, #73) are kept
  byte-for-byte; this branch's Secrets Hardening ADR is re-landed at the end as **ADR-025**, with a
  renumber note under its heading.
- **Why:** an ADR number is a permanent identifier that other files cite — two ADR-023s would make
  every existing "ADR-023" citation ambiguous. Same resolution shape as `72ef636`, which moved the
  stakeholder-report ADR 023 → 024 for exactly this reason.
- **References renumbered with it** (every `ADR-023` in these files means the *secrets* ADR):
  `tooling/secretScan.js:3` and `:16`, `.env.example:1`, `.gitignore:39`,
  `authoring-status.md:327`, and this file at `:1`, `:20`, `:97`.

### 2. testResources/testcaseData/ExperienceApp/production/learningPathData.json (conflict resolved)
- **Layer:** Test data
- **What changed:** main added the LP-021…LP-035 data (learner B, the school admin login, TOC,
  progress, marking) with **plaintext** passwords; this branch had tokenized the same file. The
  resolution keeps main's content exactly and re-tokenizes the 4 credential fields main introduced,
  one var per account per ADR-025 decision 1: `signup.learnerFormB.password` →
  `C1_PROD_LEARNERFORMB_PASSWORD`, `adminLogin.password` → `C1_PROD_ADMINLOGIN_PASSWORD`,
  `mailsac.learnerVerifyB.mailsacPassword` → `C1_PROD_LEARNERVERIFYB_PASSWORD`,
  `learnerLoginB.password` → `C1_PROD_LEARNERLOGINB_PASSWORD`.
- **Why:** taking main's side would have committed plaintext credentials — the thing this PR removes
  — and broken this branch's own `secretScan` gate; taking this branch's side would have deleted
  main's LP-021…035 data.

### 3. .env.example
- **Layer:** Config / onboarding
- **What changed:** the 4 new variable names added in the file's alphabetical order; `C1_PROD`
  section header 33 → 37; file-total line 148 → 156.
- **Why:** `.env.example` + `SECRETS_COMMIT_CHECKLIST.md` are the onboarding and CI secret list; a
  var missing there fails at run time with "environment variable X is not set". The old total was
  also simply wrong: the section headers summed to 152 while the total line said 148.

## Verification (real runs, this session)
- `node tooling/secretScan.js` — exit 0. Note it had been **skipping** `learningPathData.json` while
  that file held conflict markers (it reports a parse error and continues), so "exit 0" alone is not
  proof until the file parses again — it does now.
- Resolved `learningPathData.json` compared structurally against **both** parents: identical to
  `origin/main` except for credential values, and every token this branch already had is preserved.
- Exec-file → TC-registry audit (the `testrunner.js` rule: first module whose `testFile` matches,
  then the id), run on the merged tree **and** on each parent: 3908 steps / 667 wired ids / 13
  unresolvable, and those 13 are the same 13 on main and on this branch (two
  `ebookLearningHyperlinkVC*` files citing `TST_EBOOK_TC_*` and `TST_EBOO_TC_55+`, never registered)
  — the merge introduced none. Of the 412 TC ids this PR deletes, **zero** are wired by an exec file
  after the merge, so the cleanup does not starve main's new Learning Path / marking-queue /
  teacher-library suites.
- All 106 files the merge touched parse (39 JSON) and pass `node --check` (32 JS).
- `package.json`: merged content is exactly main's 100 scripts. Verified this is right rather than
  lost — the PR added **0** scripts relative to the merge-base, and main removed 32 / added 4 in #69
  (ADR-023), all preserved. No duplicate keys.

## Protected Files Touched
None by this session. `package.json` and `env.conf.js` were not re-edited — `package.json` resolves
to main's side on its own because this branch never touched it.

## Pending / Follow-up
- The 4 new `C1_PROD_*` vars need adding to both CI secret stores (step 3 of
  `SECRETS_COMMIT_CHECKLIST.md`) before the LP prod suite can run in CI.
- `test/Manual/C1App/Onboarding/Onboarding_test_cases.md` (and its generators `_tcdata.js` /
  `_generate.js`) cite "ADR-023" for the `{{env.*}}` rule. Those files come from main (#71), where
  ADR-023 is the E2E-consolidation ADR — the citation pointed at the wrong ADR before this merge and
  is deliberately left unchanged here, because fixing it means regenerating the register `.xlsx`.
- No test suite was run: the LP data points at **production**, and the run mutates real prod accounts.
  The merge is verified by static analysis only.

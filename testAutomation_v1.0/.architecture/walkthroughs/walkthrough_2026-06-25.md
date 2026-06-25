# Session Walkthrough — 2026-06-25

## Summary
Made the architecture context "navigable": verified + finalized an always-loaded invariants
cheat-sheet, added "current state" banners to the amended ADRs so each reads safely in isolation,
and pointed the authoring skill at the cheat-sheet instead of loading all of system.md/decisions.md.
Documentation only — no protected files touched.

## Changes Made

### 1. .architecture/ARCHITECTURE-INVARIANTS.md
- **Type:** Created (draft supplied by user) → verified + corrected
- **Layer:** Config / Docs (always-loaded core + index)
- **What changed:** Verified every invariant and every *Depth* pointer against live `system.md` /
  `decisions.md` (all resolved correctly). Revised invariant #1: removed the blanket "no `browser.*`
  in tests" (system.md allows `browser.pause` for timing) and replaced it with a **deterministic-waits**
  rule — prefer `waitForDisplayed`/`waitForExist`/`waitForEnabled`/`waitForClickable`/`waitForDocumentLoad`,
  fall back to `browser.pause(ms)` only when nothing observable changes — with ✅/❌ examples. Added
  `ADR-013 (React-form typing)` to invariant #6's *Depth* pointer.
- **Why:** Accuracy (browser.pause exception) + capture the anti-flake wait discipline the user asked for.

### 2. .architecture/decisions.md
- **Type:** Modified (append-only)
- **Layer:** Config / Docs (ADRs)
- **What changed:** Inserted a `⚡ CURRENT STATE (read first)` banner immediately after the `**Status:**`
  line of **ADR-003, ADR-005, ADR-008, ADR-009, ADR-010**, each summarizing ONLY that ADR's existing
  amendment text (action library wraps Playwright; new globals + `__pwContext`; standalone `expect`
  vs Chai; `.parsed.*` getters; context-per-suite vs `reloadSession`). No ADR body reworded or deleted.
- **Why:** A single amended ADR is now safe to read in isolation without hunting ~150 lines away.

### 3. .agent/skills/c1-test-authoring/SKILL.md
- **Type:** Modified
- **Layer:** Skill instruction
- **What changed:** Rewrote ONLY the read-first block: **Always load** `AGENTS.md` +
  `ARCHITECTURE-INVARIANTS.md`; **consult on demand** specific ADRs / `system.md` sections via the
  cheat-sheet's *Depth* pointers. Corrected the stale "(repo root)" path to `testAutomation_v1.0/`.
- **Why:** Stop loading all of system.md/decisions.md for every task. No other skill rule changed.

### 4. .agent/skills/c1-environment-test-replicator/SKILL.md
- **Type:** Modified
- **Layer:** Skill instruction
- **What changed:** Same read-first rewrite as the authoring skill — **Always load** AGENTS.md +
  `ARCHITECTURE-INVARIANTS.md`; **consult on demand** ADRs / `system.md` via *Depth* pointers; fixed
  the stale "(repo root)" path. Kept its extra emphasis that the protected-files list, selector/naming
  conventions, and appType model are authoritative in AGENTS.md / the ADRs.
- **Why:** Consistency — this skill had the identical "read all of system/decisions first" block, so
  the navigability fix only half-applied until both skills were updated.
  Also fixed two stale spots in the same file: generalized the hardcoded
  `ExperienceApp/C1Selectors.json` selector-fix references to `<App>/<App>Selectors.json`
  (Failure Type 1 + Quick Reference), and reworded Failure Type 3 (Timeout) to raise the
  *condition* wait's timeout rather than add a fixed `browser.pause` (aligns with the new
  deterministic-waits invariant).

## Architecture Decisions Triggered
No new ADRs. Banners summarize existing amendments only (ADR-012 amendments dated 2026-06-11; getter
clarification 2026-06-13). New always-loaded index file introduced (ARCHITECTURE-INVARIANTS.md).

## Protected Files Touched
None — documentation/skill markdown only.

## Decisions / Discrepancies handled
- **ADR-007 banner skipped (by design).** The task pointed at an "ADR-007/D7" amendment about the
  LambdaTest grid, but ADR-007 is "TC Repository as Single Source of Truth" — unrelated. The cloud
  change is Prompt-4 decision **D7**, tracked under the ADR-012 amendments, so ADR-007 was left clean
  to avoid misrepresenting it. (Confirmed with user.)
- **Invariants draft was missing initially**, then supplied by the user; verified rather than authored
  from scratch.

## Pending / Follow-up
- The skill still uses `TST_<4CHAR>` for TC ids in its body (Workflow A / Golden Rule 3); the canonical
  rule is now `TST_<MODULE>_TC_<N>` (module from page object — AGENTS.md Rule 6). Left unchanged this
  session (Task 3 scoped to the read-first block only) — worth aligning in a future pass.

---

# Session Walkthrough — 2026-06-25 (append 4)

## Summary
Made `c1-environment-test-replicator` genuinely multi-app (C1 + Builder) instead of C1-centric, fixed
two real correctness bugs in its replication steps, and removed a stray appType block from env.json.

## Changes Made

### 1. .agent/skills/c1-environment-test-replicator/SKILL.md
- **Type:** Modified · **Layer:** Skill instruction
- **What changed:**
  - Added **STEP 0 — Resolve the application (appType)**: locate the test's execution file across
    appType folders → `<App>`; read env.json for the app's valid envs (ExperienceApp = thor/qa/rel/
    production; Builder = thor only) + namespace; STOP if no other env exists for that app.
  - **Fixed STEP 2a bug:** copying the execution file unchanged left its env-specific `dataFile`
    paths pointing at the source env → now repoints every `dataFile` from `<sourceEnv>` to `<targetEnv>`.
  - **Fixed STEP 2b assumption:** data files are NOT `<testName>_data.json` (Builder uses
    `<feature>Data.json`, C1 varies) → derive the file(s) from the exec file's `dataFile` references.
  - Generalized all hardcoded `ExperienceApp` / `C1Selectors.json` paths to `<App>` / `<App>Selectors.json`
    (STEP 1, 2c `--appType=<App>`, STEP 4 FT2, STEP 7 template, Quick Reference); STEP 5 ISSUE block
    labelled "C1 example". Intro broadened to "C1 / Builder".
- **Why:** The skill is meant for both apps but was C1-hardcoded; STEP 2a/2b were also outright wrong
  for the real (env-specific `dataFile`, non-`_data.json`) layout.

### 2. env.json
- **Type:** Modified (config JSON — not protected) · **Layer:** Config
- **What changed:** Removed the stray `EExperienceApp` appType block (double-E typo duplicate of
  `ExperienceApp`; its `testExecDir` folder doesn't exist; unreferenced except the gitignored
  `env copy.json`). Validated the file still parses; appTypes now `ExperienceApp`, `Builder`.
- **Why:** Typo block that could confuse appType resolution / readers.

## Protected Files Touched
None — `env.json` is config JSON (explicitly non-protected); the rest is skill markdown.

## Pending / Follow-up
- `env copy.json` (gitignored backup) still has the `EExperienceApp` typo — harmless, not tracked.

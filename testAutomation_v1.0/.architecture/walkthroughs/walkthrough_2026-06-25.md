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

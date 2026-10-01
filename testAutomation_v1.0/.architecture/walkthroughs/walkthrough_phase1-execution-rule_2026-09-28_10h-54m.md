# Walkthrough — phase1-execution-rule

## Session 1 — 2026-09-28

## Summary
Removed a self-contradiction in the `c1-test-authoring` Phase 1 file: its Goal said "No test
execution in this phase" while its exit checklist requires the suite to have been executed at
least once. The checklist rule is the newer one (user-confirmed as the rule to keep), so the Goal
now matches it.

## Changes Made

### 1. .agent/skills/c1-test-authoring/phases/1-build.md
- **Type:** Modified
- **Layer:** Config (agent skill)
- **What changed:**
  - **Goal (lines 3–7):** "No test execution in this phase … running/fixing is Phase 2" replaced
    by: artifacts exist, are consistent, and the suite has been executed once against the target
    environment (failures expected); making it pass is Phase 2. Adds how to run it in Phase 1 —
    `node core/runner/run.js …` directly, because the npm script is only added in Phase 2
    (`package.json` is protected).
  - **Exit-checklist note (lines 148–150):** "`npm run <script>` almost certainly still works"
    replaced by "a framework run (`node core/runner/run.js …` above, or an existing `npm run`
    script for the login chain)" — Phase 1 has no npm script of its own to run.
- **Why:** the Goal line predates the "execute once" checklist item and the ⚠️ status marker
  added after `adminClassesTab` shipped Phase 1 ✅ without ever running (first run 2/6, ~15 runs
  in Phase 2). Reading only the Goal invited exactly that mistake again.
- **Lines affected:** 3–7 and 148–150.

## Architecture Decisions Triggered
None new. Aligns the Goal with the existing exit checklist and the ⚠️ marker in
`.architecture/authoring-status.md` ("Built but NEVER EXECUTED").

## Protected Files Touched
None — no protected files were modified.

## Pending / Follow-up
- `product-knowledge/ExperienceApp/admin-shared.md:653` writes `npm run <script> --trace=true`;
  npm needs `-- --trace=true` to pass the flag to the script (as `learning-path-player.md` §C1
  does). Not changed here.

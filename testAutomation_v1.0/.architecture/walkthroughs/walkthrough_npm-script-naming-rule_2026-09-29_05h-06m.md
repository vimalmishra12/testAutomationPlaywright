# Walkthrough — npm-script-naming-rule

## Session 1 — 2026-09-29

## Summary
Made AGENTS.md state the npm-script naming rule once and consistently: `<feature>Test_<env>`, env in
lower case. Existing scripts keep their names (user decision: document-only fix, no renames, no
`package.json` change).

## Changes Made

### 1. testAutomation_v1.0/AGENTS.md
- **Type:** Modified
- **Layer:** Config (agent instructions)
- **What changed:**
  - **Rule 6 table (line 89):** the duplicate rows "NPM script | `<feature>_<env>`" and "Functional
    NPM script | `<feature>_<env>`" merged into one: "NPM script (functional) |
    `<feature>Test_<env>` — `<feature>` in camelCase; `<env>` lower-case: `thor`, `qa`, `rel`, `prod`
    (LambdaTest runs: `LT`) | `manageReportsTest_thor`". Visual row unchanged.
  - **Note added (lines 92–94):** scripts that pre-date the rule (`P1Admin*_Thor`,
    `eBookMappingTest_Thor`, `umbrellaImageTest_NEMO-24627_thor`, `CreateEbook_*`, …) keep their
    names — renaming breaks commands people and CI already use; new scripts follow the rule.
  - **§7 appType table (line 124):** `<Feature>Test_<env>` → `<feature>Test_<env>`.
  - **§8 Rule C table (line 464):** functional row `<feature>_<env>` → `<feature>Test_<env>`.
- **Why:** the file gave the rule three ways (`<feature>_<env>` twice, `<Feature>Test_<env>` once)
  while every example (`manageReportsTest_thor`) carried "Test", and never said the env suffix is
  lower case — so ~12 of ~100 scripts drifted (`_Thor`, a ticket number in the name, no "Test").
  `<feature>Test_<env>` is what the examples, the majority of scripts and the `c1-test-authoring`
  Phase 2/3 templates already use; the visual pattern `visualAcceptance_<feature>_<env>` (feature
  without "Test") is consistent with it.
- **Lines affected:** 89–94, 124, 464.

## Architecture Decisions Triggered
None.

## Protected Files Touched
None — `package.json` was deliberately not changed; no script was renamed. CI is unaffected:
`.github/workflows/e2e-tests.yml` derives `--testEnv` / `--appType` from the script's command, not
its name.

## Pending / Follow-up
None.

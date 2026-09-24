# Walkthrough — onboarding-manual-register

## Session 1 — 2026-09-24

## Summary
Turned the team's `OnboardingApp_Test_Plan.xlsx` (58 scenarios) into the manual register
`test/Manual/C1App/Onboarding/` (63 TCs, `.md` + `.xlsx`, generated from `_tcdata.js`). This is step
(a′) of the migration's Onboarding batches (plan B1/B5). Rows coloured red or yellow in the source
(13) stay in the register as manual-only cases: the user decided on 2026-09-24 that they are not for
automation. Nothing was executed live and no automation was written.

## Changes Made

### 1. test/Manual/C1App/Onboarding/_tcdata.js
- **Type:** Created
- **Layer:** Test Resources (manual register data)
- **What changed:** 11 sub-module groups, 58 source requirements (`<source id> — <source title>`), 63 TCs,
  `NOT_COVERED` for TC_XCUT_009. Each TC carries `scope` (`AUTO`/`RED`/`YELLOW`) and `existing: true`
  when it reuses an already-automated TC ID.
- **Why:** User request: put the onboarding cases into the manual register, with red and yellow rows
  marked not for automation.

### 2. test/Manual/C1App/Onboarding/_generate.js
- **Type:** Created
- **Layer:** Tooling (register generator)
- **What changed:** A copy of the LearningPath generator, plus: a 15th column "Automation Scope"; red/yellow
  fills on the ID and scope cells for the red/yellow rows, as in the source; a Status data-validation
  dropdown; guards against an unknown requirement, a duplicate ID, or a requirement with no case and
  no reason.
- **Why:** SKILL golden rule 6. The `.md` and `.xlsx` must come from one source.

### 3. test/Manual/C1App/Onboarding/Onboarding_test_cases.md + .xlsx
- **Type:** Created (generated)
- **What changed:** 63 TCs (51 Positive · 1 Edge · 11 Negative). All are Not Run. 50 are to automate,
  13 are manual-only (🔴 10, 🟡 3), and 16 reuse existing TC IDs. Verified that the md and xlsx
  hold the same 63 IDs in the same order, with the right fills.

### 4. .architecture/product-knowledge/ExperienceApp/onboarding.md
- **Type:** Modified — appended §A6 (source-stated onboarding facts: location-dependent age gate,
  Parent guardian checkbox, validation/login/reset copy, lockout, first-login gate, temporary password,
  other sign-in routes).

### 5. .architecture/product-knowledge/ExperienceApp.md
- **Type:** Modified: the onboarding index row now lists the new modules and the register.

## Architecture Decisions Triggered
- **ADR-011** (no duplicate TC functions): 16 rows reuse existing IDs (LAND_TC_2/3, FOOT_TC_1/2/3/4/6/7/8,
  LOGI_TC_4/5/6, APPS_TC_2, RESE_TC_4, SNUP_TC_59/63) instead of minting new ones.
- **AGENTS.md Rule 6**: module codes come from page objects. Numbering continues from the maximum
  found across the registry, the test files and every register: LAND 6+, FOOT 12+, LOGI 7+, RESE 6+,
  SNUP 65+, CREA 31+, SPRF 24+, INVI 14+.
  > ⚠️ **Proposed new module code `PCHD`** (parent/child; there is no page object yet). Confirm it when B-parent/child starts.
- ADR-021/022/023 are referenced in the data notes (disposable accounts, `{{run.*}}`, `{{env.*}}`).

## Protected Files Touched
None — no protected files were modified. (`npm install --no-save` was run locally to get `exceljs`.
`package.json` was unchanged and no lockfile was written.)

## Pending / Follow-up
- Nothing was grounded live. Phase 1 must confirm every expected result, starting with the
  side-effect-free B1 set.
- Open items 2–9 in the register: the SPRF_TC_24 entry point and its overlap with SPRF_TC_8/23; RESE_TC_10
  vs RESE_TC_9; the LOGI_TC_9 lockout account; missing copy; thor blockers; the PCHD/CREA/INVI module
  choice; re-enabling FOOT_TC_4/6/8; TC_XCUT_009 handled as visual.
- The LP register's setup sheet also lists LAND_TC_2/3, LOGI_TC_1/2/5 and SNUP_TC_59–64. It is marked
  "to be moved into application-wise registers later", and this register is that home.

### 6. .architecture/authoring-status.md
- **Type:** Modified — appended an `onboarding` block with a "NEXT BATCH" section (batches B1/B2/B3,
  the 4 open questions, constraints), same pattern as the `learningPath` block.
- **Why:** User asked to merge to `main` so team members can automate; the plan and open questions must
  live in the repo (the S04 handoff is kept outside the repo per the migration rules).

### 7. onboarding.md header + register "How to automate" step 4 (after PR #71 merged)
- **Type:** Modified. Added a pointer at the top of `onboarding.md` and in the register (via `_generate.js`, then regenerated):
  "cases are already designed, do not redesign, start at authoring-status.md → onboarding → NEXT BATCH".
- **Why:** A team member's plain prompt ("start planning onboarding automation") reaches `onboarding.md`
  through CLAUDE.md's mandatory reads, but it might pick the manual-authoring skill and redesign the
  cases. The pointer routes it to the existing plan.

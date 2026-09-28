# Walkthrough — r4-archive-scope

## Session 1 — 2026-09-28

## Summary
Narrowed the wording of ADR-023's "r4 create-only archive" rule to its intent (confirmed by the
user, who made the r4 decision): only **superseded** execution files are frozen; live execution
files are edited as normal work.

## Changes Made

### 1. testAutomation_v1.0/.architecture/decisions.md
- **Type:** Modified
- **Layer:** Config (ADR)
- **What changed:** ADR-023 Decision 3 — "Never delete, rename, or edit existing test execution
  files under `…/ExperienceApp/thor/`" → merged suites go to a new file; the superseded originals
  are never deleted, renamed or edited (frozen archives); live execution files (run by an npm
  script, including the merged suites) are edited as normal work. A dated note records the
  clarification and that the user confirmed it.
- **Why:** read literally, the old wording froze every thor exec file, which forbids routine work
  (adding a TC to a suite, fixing a step — e.g. re-adding `TST_INVI_TC_12` to `adminGeneric.json`,
  pending in `authoring-status.md`). ADR-023 itself records editing `ebookE2EstudentTest.json` on
  2026-09-23 (the teardown fix), so the rule as written was already contradicted. The merge plan
  (`PLAN_ebook-foc-suite-merge_2026-09-22.md`, r4) is about keeping superseded files on disk.
- **Lines affected:** line 882 (ADR-023 Decision 3).

### 2. testAutomation_v1.0/.architecture/product-knowledge/ExperienceApp/c1-core-shared.md
- **Type:** Modified
- **Layer:** Config (product knowledge)
- **What changed:** Part C §C2 rule line reworded the same way — superseded files frozen, live
  files edited normally — with a dated pointer to ADR-023 Decision 3.
- **Why:** it repeated the over-broad wording.
- **Lines affected:** line 128.

## Architecture Decisions Triggered
ADR-023 Decision 3 amended in place (scope clarification, dated). No new ADR.

## Protected Files Touched
None — no protected files were modified.

## Pending / Follow-up
- The rule does not list which thor exec files are superseded. ADR-023 names some
  (`ebookFocusA11yMergedTest.json`, `ebookToolbarFocusTest.json`,
  `createAssignmentPresentationPlusTest.json`, the per-book teacher/student files); an explicit
  list in `c1-core-shared.md` §C2 would make "is this file frozen?" answerable at a glance.

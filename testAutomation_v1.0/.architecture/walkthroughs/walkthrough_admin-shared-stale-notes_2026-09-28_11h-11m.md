# Walkthrough — admin-shared-stale-notes

## Session 1 — 2026-09-28

## Summary
Added dated corrections to three stale notes in the Admin App shared knowledge file (struck
through or appended, never deleted — the file's living-document rule).

## Changes Made

### 1. testAutomation_v1.0/.architecture/product-knowledge/ExperienceApp/admin-shared.md
- **Type:** Modified
- **Layer:** Config (product knowledge)
- **What changed:**
  - **§0 (after line 48):** "**Resolved [2026-09-28]:** `authoring-status.md` was compacted on
    2026-09-18 and no longer makes that claim." The note still told readers the status file wrongly
    says `adminAddClassBulk`'s key "points here now"; verified the claim is gone
    (`grep 'points here'` on `authoring-status.md` returns nothing).
  - **§A7 (lines 305–311):** the "Also documented in `ExperienceApp.md` §Data notes" note is struck
    through and followed by "**Moved [2026-09-28]:**" — the fixture section now lives in
    `admin-grading-details-pages.md` §"Data notes — the permanent fixture class" (ADR-020
    migration); still two places to keep in sync. `ExperienceApp.md` is an index and has no such
    section.
  - **§B11 (after line 669):** "**Update [2026-09-28]:**" — in this repository `.mcp.json` and a
    `.mcp.json` line in the root `.gitignore` (line 11) arrived in the same commit (`05ba477`,
    2026-09-02); the file is tracked, so the rule has never had any effect. The earlier correction
    said no `.gitignore` rule matched it.
- **Why:** each note pointed readers at something that is no longer true or no longer there.
- **Lines affected:** 49, 305–311, 670–673.

## Architecture Decisions Triggered
None.

## Protected Files Touched
None — no protected files were modified.

## Pending / Follow-up
- **User decision:** keep `.mcp.json` tracked (shared Playwright MCP setup — then drop the inert
  `.gitignore` line 11) or untrack it (`git rm --cached .mcp.json`, each machine keeps its own).

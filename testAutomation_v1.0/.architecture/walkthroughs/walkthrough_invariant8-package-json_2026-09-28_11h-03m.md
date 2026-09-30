# Walkthrough — invariant8-package-json

## Session 1 — 2026-09-28

## Summary
Added `package.json` to the protected-file list in `ARCHITECTURE-INVARIANTS.md` Invariant 8, so it
matches the authoritative list in AGENTS.md and the mirror in `system.md` (10 files each).

## Changes Made

### 1. testAutomation_v1.0/.architecture/ARCHITECTURE-INVARIANTS.md
- **Type:** Modified
- **Layer:** Config (invariants sheet)
- **What changed:** Invariant 8's list gains `package.json` ("every npm script and dependency
  change — Phase 2/3 scripts included"). The next sentence now reads "**Other** JSON (selectors /
  data / execution / TC repo) is NOT protected", since `package.json` is itself a JSON file.
- **Why:** the sheet is read at every session start (CLAUDE.md, since 2026-09-28) and listed only
  9 files; relying on it alone would let `package.json` be edited without the confirmation
  AGENTS.md requires.
- **Lines affected:** lines 101–104.

## Architecture Decisions Triggered
None. AGENTS.md remains the authoritative list.

## Protected Files Touched
None — no protected files were modified.

## Pending / Follow-up
None.

# Walkthrough — session-start-reading

## Session 1 — 2026-09-28

## Summary
Aligned the session-start reading rule across `CLAUDE.md` and `AGENTS.md` with the rule the
skills and `ARCHITECTURE-INVARIANTS.md` already state: always read the invariants sheet, and
open `decisions.md` / `system.md` only for the ADR or section a task touches. `PROMPTS.md`
moves from "read every session" to history.

## Changes Made

### 1. CLAUDE.md (repo root)
- **Type:** Modified
- **Layer:** Config (agent instructions)
- **What changed:**
  - The mandatory list no longer says "read all `.md` files under `.architecture/`"; it names
    the files explicitly.
  - Added `testAutomation_v1.0/AGENTS.md` and `.architecture/ARCHITECTURE-INVARIANTS.md` to the
    always-read list (the skills already load both; CLAUDE.md never listed them, yet called the
    invariants sheet "already read above").
  - Removed `system.md`, `decisions.md` and `PROMPTS.md` from the always-read list. New
    "Read on demand" paragraph: open the ADR / section an invariant's *Depth →* pointer names;
    read the relevant ADRs in full before changing a core or protected file, adding or changing
    an ADR, or doing something no invariant covers.
  - New "History — do NOT read at session start" list: `PROMPTS.md` (superseded by ADR-012,
    carries a stale protected-file list), walkthroughs, `archive/` folders (the last two
    unchanged in meaning).
  - Closing paragraph now names AGENTS.md, `decisions.md` and `system.md` as authoritative,
    with the invariants sheet as their summary (they win on disagreement).
- **Why:** CLAUDE.md made ~114 KB (`decisions.md` 85 KB, `system.md` 24 KB, `PROMPTS.md` 5 KB)
  mandatory every session, while the skills and the invariants sheet say to load only the
  invariants and consult ADRs on demand ("do not load all of decisions.md / system.md up
  front"). CLAUDE.md took precedence, so the invariants sheet saved nothing.
- **Lines affected:** lines 5–53 (the "MANDATORY: Read architecture files" section); the
  Skills section is unchanged.

### 2. testAutomation_v1.0/AGENTS.md
- **Type:** Modified
- **Layer:** Config (agent instructions)
- **What changed:** "Mandatory Pre-Coding Checklist" items 1–2 — "Read `system.md`" /
  "Read `decisions.md`" replaced by "Read `ARCHITECTURE-INVARIANTS.md`" / "Open the ADR /
  `system.md` section each relevant invariant points to; read them in full before changing a
  core or protected file".
- **Why:** the same full-read rule lived here too; changing CLAUDE.md alone would still force
  a full read before any code change.
- **Lines affected:** lines 11–12.

## Architecture Decisions Triggered
None new. Applies the reading model already stated in `ARCHITECTURE-INVARIANTS.md` ("How to
use this sheet") and the `c1-test-authoring` / `c1-environment-test-replicator` skills
("Always load AGENTS.md + ARCHITECTURE-INVARIANTS; consult ADRs on demand").

## Protected Files Touched
None — no protected files were modified.

## Pending / Follow-up
- `manual-test-standard.md` stays mandatory every session (8.6 KB); it could become "only for
  manual test-case work" since `c1-manual-test-authoring` loads it — left for a user decision.
- Other review findings from this session (not addressed here): Invariant 8's protected list
  omits `package.json`; `phases/1-build.md` goal vs exit checklist on execution;
  `manual-test-standard.md:146` compound-ID contradiction; stale replicator env list;
  plaintext Blackboard passwords in `product-knowledge/Integrations.md`; duplicate top-level
  copies of two archived handoff files.

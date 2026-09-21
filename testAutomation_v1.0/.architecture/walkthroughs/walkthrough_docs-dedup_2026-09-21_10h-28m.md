# Walkthrough — docs-dedup

> The `.architecture` / skills de-duplication work. Sessions from 2026-09-18 (handoff archive,
> `authoring-status.md` compaction, Generic/shell split) are recorded in
> `walkthrough_2026-09-18.md`, which uses the retired date-only name. It was deliberately not renamed.

## Session 1 — 2026-09-21

### Summary
Two policy clarifications that the user decided. `package.json` stays a protected file and is now
listed in the protected-file tables. The walkthrough naming rule now matches actual practice: files are
named after the work, with one file per feature and sessions appended.

### Changes Made

#### 1. `testAutomation_v1.0/AGENTS.md`
- **Type:** Modified
- **Layer:** Docs / governance
- **What changed:** The Protected File List gained a `package.json` row (Configuration: npm scripts are
  every suite's entry point, and dependencies affect every run; see §8 Rule B). Under §Walkthrough, the naming changed
  from `walkthrough_YYYY-MM-DD.md` to `walkthrough_<testfile-or-topic>_<YYYY-MM-DD>_<HHh-MMm>.md`, with
  one file per feature/ticket, later sessions appended as `## Session N — YYYY-MM-DD`, and never
  renaming existing files. The format template and rules were updated to match.
- **Why:** `package.json` was protected only implicitly (Rule B), not in the table. The date-only
  rule mixed unrelated work into one file and scattered a feature's history across several; about 27 of 41
  existing walkthroughs already followed the feature-based form.

#### 2. `testAutomation_v1.0/.architecture/system.md`
- **Type:** Modified. The protected-files mirror table gained the `package.json` row, since it must match AGENTS.md.

#### 3. `.agent/skills/c1-environment-test-replicator/SKILL.md`
- **Type:** Modified. Step 7 now points to the AGENTS.md naming rule. The other skills already defer to
  AGENTS.md §Walkthrough.

### Decisions taken with the user
- `package.json` remains protected (confirmation before any script or dependency change).
- Walkthrough naming follows option (b): name after the work, one file per feature, sessions appended.
- The "move completed walkthroughs to an archive folder" idea was not adopted in this change.

### Protected Files Touched
None. `package.json` itself was not modified; only the docs that list it changed.

### Pending / Follow-up
- Remaining de-dup topics: skills vs AGENTS.md duplicated rules; the `c1-test-authoring` block format
  vs the compacted `authoring-status.md`.

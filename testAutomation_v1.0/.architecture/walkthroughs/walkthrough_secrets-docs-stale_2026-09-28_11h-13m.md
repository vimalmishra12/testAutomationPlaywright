# Walkthrough — secrets-docs-stale

## Session 1 — 2026-09-28

## Summary
Updated three passages that still described credentials as plaintext or the ADR-025 rollout as
unfinished. The rollout is complete; verified before editing.

## Verification (before editing)
- `node tooling/secretScan.js` → exit 0 (no plaintext credential field).
- `.env.example` → 153 ✅ markers, 0 ⬜ pending.
- `testResources/testcaseData/Builder/thor/builderLoginData.json` → `"password":
  "{{env.BLDR_THOR_VALIDADMIN_PASSWORD}}"`.

## Changes Made

### 1. testAutomation_v1.0/.architecture/decisions.md — ADR-025 Consequences
- **Type:** Modified
- **Layer:** Config (ADR)
- **What changed:** appended "**Update [2026-09-28]:**" after "231 fields across 22 files remain":
  those are pilot figures; Step 5 finished the same day — all 243 fields across 24 files are
  tokens, `.env.example` has no pending entry, `secretScan.js` exits 0.
- **Why:** the ADR's Status says the rollout is complete while its Consequences still said 231
  fields remain.
- **Lines affected:** after line 1031 (3 lines added).

### 2. testAutomation_v1.0/.architecture/decisions.md — ADR-013 Consequences
- **Type:** Modified
- **Layer:** Config (ADR)
- **What changed:** "to be hardened to env vars later" now followed by "*(Done [2026-09-23] —
  ADR-025: credentials are `{{env.*}}` tokens.)*"
- **Why:** the "later" has happened; the note otherwise suggests plaintext is still the convention.
- **Lines affected:** after line 307 (1 line added).

### 3. testAutomation_v1.0/.architecture/product-knowledge/Builder.md
- **Type:** Modified
- **Layer:** Config (product knowledge)
- **What changed:** Thor test account line — "plaintext for now" → the password is the
  `{{env.BLDR_THOR_VALIDADMIN_PASSWORD}}` token in `builderLoginData.json`, real value in `.env` /
  CI (ADR-025).
- **Lines affected:** lines 48–50.

## Architecture Decisions Triggered
None new (ADR-013 and ADR-025 annotated, dated).

## Protected Files Touched
None — no protected files were modified.

## Pending / Follow-up
- `product-knowledge/Integrations.md` still lists the Blackboard accounts' real passwords in
  plaintext (as do three walkthroughs) — separate, higher-priority item (#14 of the review).

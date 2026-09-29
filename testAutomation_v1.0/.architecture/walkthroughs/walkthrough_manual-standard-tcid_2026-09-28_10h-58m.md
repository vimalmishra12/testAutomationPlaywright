# Walkthrough — manual-standard-tcid

## Session 1 — 2026-09-28

## Summary
Fixed a self-contradiction in `manual-test-standard.md`'s traceability structure: line 146 said
the Test Cases tab's "Test Case ID = compound ID", while lines 99–106 (and the output-structure
summary) say Test Case ID is `TST_<MODULE>_TC_<N>` and the compound `AC<n>.UC<n>.S<n>.TC<n>` goes
in Linked Requirement.

## Changes Made

### 1. testAutomation_v1.0/.architecture/manual-test-standard.md
- **Type:** Modified
- **Layer:** Config (manual test standard)
- **What changed:** "Standard 14 columns (S.No. first; Test Case ID = compound ID)." →
  "Standard 14 columns (S.No. first; Test Case ID = `TST_<MODULE>_TC_<N>`; the compound
  `AC<n>.UC<n>.S<n>.TC<n>` goes in Linked Requirement)."
- **Why:** the old wording contradicted the same file's "Test Case ID and Linked Requirement
  (separate IDs)" section, its output-structure summary table, and the CSV naming rule (files are
  prefixed with the TST id). Following it would break the link between the manual register and
  automation, whose TC functions and TC-repository entries use the `TST_…` id. Verified the
  existing traceability registers (`test/Manual/C1App/NEMO-24306/`,
  `test/Manual/Builder/NEMO-24401/`, `test/Manual/Builder/NEMO-24402/`) all already put `TST_…`
  in Test Case ID and the compound id in Linked Requirement — only line 146 disagreed.
- **Lines affected:** line 146.

## Architecture Decisions Triggered
None new. AGENTS.md Rule 6 (TC-ID convention) is unchanged and now matches this line.

## Protected Files Touched
None — no protected files were modified.

## Pending / Follow-up
- The three NEMO registers use ticket-based ids (`TST_NEMO24306_TC_1`, `TST_NEMO24401_TC_1`),
  which AGENTS.md Rule 6 now calls wrong; they pre-date the rule. Not changed here.

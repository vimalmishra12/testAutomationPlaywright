# Walkthrough — legacy-walkthrough-folder

## Session 1 — 2026-09-28

## Summary
Moved the two walkthroughs that lived in a stray legacy folder, `testAutomation_v1.0/Walkthrough/`,
into the canonical `.architecture/walkthroughs/` (AGENTS.md §Walkthrough). File names unchanged;
the empty legacy folder is gone.

## Changes Made

### 1. walkthrough_manageReports.test.js.md
- **Type:** Moved (`git mv`, content unchanged)
- **Layer:** Config (session record)
- **What changed:** `testAutomation_v1.0/Walkthrough/walkthrough_manageReports.test.js.md` →
  `testAutomation_v1.0/.architecture/walkthroughs/walkthrough_manageReports.test.js.md`.
- **Why:** anyone looking for a feature's history checks `.architecture/walkthroughs/` (the only
  location AGENTS.md names). Not finding this file there, a new `manageReports` session would start
  a second walkthrough instead of appending — splitting the feature's history in two.
- **Lines affected:** none (path only).

### 2. walkthrough_setupSchoolAccount.test.js_2026-06-02_11h-06m.md
- **Type:** Moved (`git mv`, content unchanged)
- **Layer:** Config (session record)
- **What changed:** `testAutomation_v1.0/Walkthrough/…` → `testAutomation_v1.0/.architecture/walkthroughs/…`.
- **Why:** same as above.
- **Lines affected:** none (path only).

## Verification
- No name collision in the destination folder.
- No script, config or live doc references the old `Walkthrough/` path (repo-wide search). The only
  mention is in `walkthrough_docs-password-redaction_2026-09-28_11h-21m.md`, which recorded the
  path as it was at that time and is left as written.
- AGENTS.md's "never rename existing walkthroughs" is honoured — names are unchanged, only the
  folder moved.

## Architecture Decisions Triggered
None.

## Protected Files Touched
None — no protected files were modified.

## Pending / Follow-up
- `walkthrough_manageReports.test.js.md` is 433 KB — far larger than any other walkthrough; its
  content was not reviewed here.

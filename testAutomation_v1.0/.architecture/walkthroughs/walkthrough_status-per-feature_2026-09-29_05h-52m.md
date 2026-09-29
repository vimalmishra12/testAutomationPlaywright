# Walkthrough — status-per-feature

## Session 1 — 2026-09-29

## Summary
Split the single `authoring-status.md` (360 lines) into one small status file per in-flight feature
under `.architecture/status/`, with `authoring-status.md` reduced to an index (91 lines). Added a
`▶ Now · Next` checkpoint line that is **replaced, never appended** after every major step, so a
session that breaks mid-phase (closed, crashed, context full) resumes where it stopped — for
automation in the status file, for manual design in the register header. User-approved design.

## Why (root causes found first)
- **Growth:** the format had no rule for a test that grows in batches, so each batch appended a
  sub-block with its run history (learningPath had six); "Start here" plans lived there too.
- **Blocks never removed:** removal was tied to Phase 3 ✅, which is usually deferred or skipped, and a
  deferred block had no removal rule.
- **Merge conflicts:** one shared file edited by every feature branch at every phase exit (23 commits
  in ~6 weeks); `9ef31b8` ("Merge main into nlp (resolve authoring-status.md)") is one conflict.
- **Mid-phase breaks:** the file was updated only at phase exits.

## Changes Made

### 1. .architecture/archive/authoring-status_2026-09-29.md
- **Type:** Created — verbatim snapshot of the 360-line file before the split (nothing lost).

### 2. .architecture/status/*.md (11 files)
- **Type:** Created
- **Layer:** Config (authoring status)
- **What changed:** one file per in-flight feature, status + open items only, each ending with a
  `▶ Now: … · Next: …` line: `schoolAdminAddClass` (3 CCLS suites), `adminStudents`, `adminStaff`,
  `adminLibrary`, `adminGeneric`, `newLearningPath`, `ebookAccessibility`, `ebookE2Estudent`,
  `ebookE2Eteacher`, `ebookMapping`, `onboarding` (keeps a short "Start here" batch plan, since that
  batch has not started). 6–12 lines each. Migrated from the old blocks; run-by-run history dropped
  (it is in the archive snapshot and the walkthroughs).
- **Closed on migration:**
  - `learningPath` → one line under "Deferred Phase 3" in the index (Phases 1–2 done, Phase 3 deferred;
    open items are in its register; the old "NEXT BATCH" was stale — the register shows every
    automatable case done).
  - `ebookFocusA11yMergedTest` → removed: superseded by `ebookAccessibilityTest` (rule 4).

### 3. .architecture/authoring-status.md
- **Type:** Rewritten as the index
- **What changed:** feature → status-file table; "Deferred Phase 3" one-line list; status markers
  (+ ⏭️); the "why ⚠️ exists" note; the **Status file format** (single source); five rules — one file
  per feature, `▶ Now` replaced never appended, a new batch updates the same file (≤ 15 lines),
  delete when nothing is in flight *and* open items are recorded in the register / knowledge file,
  status only.

### 4. Knowledge moved out of the old status file (so deleting status files never loses facts)
- `product-knowledge/ExperienceApp/admin-generic-shell.md` — new §"`SADB_TC_7` — grounded design,
  not built": the five design bullets moved **verbatim** (verified with `diff`).
- `product-knowledge/ExperienceApp/admin-create-classes-form.md` — "Automation coverage": `TC_16`
  needs a preceding `TC_23` (was only in the status block); "Open items": dated note that Phase 3 is
  deferred, pointing to `status/schoolAdminAddClass.md`.

### 5. Skills
- `.agent/skills/c1-test-authoring/SKILL.md` — new golden rule 9 (checkpoint: replace `▶ Now` after
  every major step); Step 1 reads `status/<feature>.md` via the index; Step 2 / Step 3 / Don'ts say
  "status file"; new Don't: never append history to a status file.
- `phases/1-build.md`, `2-run-fix.md`, `3-visual.md` — entry conditions and exit checklists use
  `status/<feature>.md`; Phase 1 creates it and adds the index row; Phase 3 deletes it (or, if the
  user defers, deletes it and adds a "Deferred Phase 3" line) after confirming open items are
  recorded in the register / knowledge file.
- `.agent/skills/c1-manual-test-authoring/SKILL.md` — golden rule 12: a `▶ Now / Next` line in the
  register header, replaced after every step; exit checklist sets it to "Done — handed off".
  `reference/document-template.md` — the header template carries that line.
- Descriptions unchanged; `node testAutomation_v1.0/tooling/syncClaudeSkills.js --check` → OK.

### 6. Pointers updated
- Register generators and their `.md`, edited identically: `test/Manual/C1App/LearningPath/`
  (`_generate.js` + `LearningPath_test_cases.md`), `NewLearningPath/`, `Onboarding/` — now point at
  `status/<feature>.md` (LearningPath: the index's "Deferred Phase 3" line + the archive).
- `product-knowledge/ExperienceApp/onboarding.md` → `status/onboarding.md` "Start here".
- `product-knowledge/ExperienceApp/admin-shared.md` §B10 → `status/schoolAdminAddClass.md`.
- `HANDOFF_adminStudents_remaining_20260915.md` → `status/adminStudents.md` (4 places).
- Left as written (history): walkthroughs, `archive/`, ADR-025's renumbering note,
  `HANDOFF_adminGeneric_20260914.md` (user chose to keep it untouched), code comments that cite the
  old file by date.

## Verification
- Each generator run on a scratch copy (exceljs installed in the scratchpad only): generated `.md`
  **identical** to the committed `.md` for LearningPath, NewLearningPath and Onboarding; the
  regenerated `.xlsx` has **0** cell differences from the committed one (the pointer text lives only
  in the `.md`), so no workbook changed.
- All 11 status files are listed in the index; sizes 6–12 lines; index 91 lines (was 360).
- No script parses `authoring-status.md` (`tooling/automationAudit.js` only mentions it in a comment).

## Architecture Decisions Triggered
> ⚠️ New pattern introduced — consider an ADR: per-feature status files under
> `.architecture/status/` with a replaced `▶ Now` checkpoint; `authoring-status.md` is the index.

## Protected Files Touched
None — no protected files were modified.

## Pending / Follow-up
- `newLearningPath`: Phase 2 has one clean full run (run 5); agree with the user how to close it.
- `schoolAdminAddClass`: re-run bulk + validation, then the file can close to a "Deferred Phase 3" line.

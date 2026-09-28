# Walkthrough — experienceapp-index-stale-note

## Session 1 — 2026-09-28

## Summary
Struck through a stale "Not yet documented anywhere" note in the ExperienceApp knowledge index and
added a dated correction, removing its contradiction with the file's own "Documented surfaces"
paragraph.

## Changes Made

### 1. testAutomation_v1.0/.architecture/product-knowledge/ExperienceApp.md
- **Type:** Modified
- **Layer:** Config (product-knowledge index)
- **What changed:** the note at lines 110–113 (inside "Migration note [2026-09-23]") is struck
  through, not deleted (living-document rule: corrections are written as corrections), and
  followed by "**Superseded [2026-09-28]:**" — the area shared file exists (`c1-core-shared.md`);
  eBook, notes and drawing are documented (`foc-ebook-reader.md`, `foc-notes.md`); Learning Path
  progress views are in `learning-path-player.md` §A11; still undocumented: homework, and any
  progress views outside Learning Path.
- **Why:** line 89 ("Documented surfaces") lists eBook, notes, drawing, timer, Resource Bank and
  Presentation Plus as documented, while the old note said eBook, notes and drawing were not
  documented anywhere and that an area shared file was still to be created.
- **Lines affected:** lines 110–117.

## Architecture Decisions Triggered
None.

## Protected Files Touched
None — no protected files were modified.

## Pending / Follow-up
None.

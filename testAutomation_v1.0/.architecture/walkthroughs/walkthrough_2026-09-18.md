# Session Walkthrough — 2026-09-18

## Summary
Docs de-duplication, batch 1: the 10 Admin App handoff and bug-report files at the `.architecture/`
root. Each one was compared with the knowledge files, `authoring-status.md` and the skills. Facts
found only in a handoff were promoted to their proper home first. Then 9 files were moved to
`.architecture/archive/handoffs/` and 1 still-active handoff was trimmed. There were no code
changes.

## Changes Made

### 1. `.architecture/archive/handoffs/` (new folder), 9 files moved in with `git mv` / added
- **Type:** Moved (Staff handoff: added, because it was never committed and existed only untracked in the main checkout)
- **Layer:** Docs
- **What changed:** Archived `HANDOFF-adminstudents-automation.md`, `HANDOFF-adminstudents-automation-2026-08-28.md`,
  `HANDOFF-adminstudents-automation-2026-08-28-evening.md`, `PRODUCT-QUESTIONS_students-tab_2026-09-16.md`,
  `HANDOFF-adminclasses-scenario3.md`, `HANDOFF-adminlibrary-manual.md`, `HANDOFF_adminLibraryAndGeneric_20260911.md`,
  `HANDOFF_adminGeneric_20260914.md`, `HANDOFF-adminstaff-automation.md`. In the two 2026-08-28 Students
  handoffs, the plaintext admin password lines (3 total) were replaced with "password in `logindata.json`".
- **Why:** These files were superseded or completed, or their content was duplicated in the knowledge files. The archive keeps history without adding context load.

### 2. `.architecture/HANDOFF_adminStudents_remaining_20260915.md`
- **Type:** Modified (trimmed 14.3 KB → 9.8 KB)
- **What changed:** Added a status note (Group A done, `ff17661`; register reconciled, `dc5ab6b`). Replaced §1's stale
  state table and the "register stale" note. Removed the Group A table. Renumbered §3. Kept only open questions 4–6 (now 1–3).
- **Why:** The file is still active for Groups B/C/D. Only its completed parts were stale.

### 3. `.architecture/product-knowledge/ExperienceApp/admin-shared.md`
- **Type:** Modified (+26)
- **What changed:** §A2, the Library row: `LIBR` numbering is split across the Library and Generic registers. §A10: added a
  "Safety guards — never weaken them" block (SKEY guard, wizard Send Request, `restore_firstName`, no Escape
  fallback). New §B12 "Authoring and run hygiene": edit big JSON as text / CRLF; a TC's duration is evidence and
  `waitForListChange` fails silently; the run log prints the login password in plaintext. One reference was
  repointed to `archive/handoffs/`.

### 4. `.architecture/product-knowledge/ExperienceApp/admin-students-tab.md`
- **Type:** Modified (+12/−1)
- **What changed:** §4: `getData_studentRows()` cost. §5: a "Raised in Jira" note (ticket numbers still pending), plus
  a pointer to the archived write-ups. §6: `niharika budhiraja` fixture. §8.7: reuse `normaliseCopy()`.
  §9.6: third 504 timing (~62 s).

### 5. `.architecture/authoring-status.md`
- **Type:** Modified (+9)
- **What changed:** The Generic block now holds the `SADB_TC_7` design inline. It used to point at the archived handoff's §6.

### 6. `.architecture/product-knowledge/ExperienceApp/admin-create-classes-form.md`
- **Type:** Modified (path only). The reference now points to `archive/handoffs/HANDOFF-adminclasses-scenario3.md`.

### 7. `.agent/skills/c1-manual-test-authoring/SKILL.md`
- **Type:** Modified (+11)
- **What changed:** Golden rule 10: TC-id collision check against case rows only (regex), across every register
  that shares a module. Golden rule 11: diff `_generate.js` output before regenerating.

### 8. `.agent/skills/c1-test-authoring/phases/1-build.md`
- **Type:** Modified (+9)
- **What changed:** "Treat inputs as claims, not facts" (verify handoff claims; design against the real
  artefact). Step 4: one TC-repository module per test file.

## Decisions taken with the user
- Archive, do not delete (`archive/handoffs/`). Remove passwords from archived copies.
- Dropped: the recon-script absolute-path note and the Bash `\\`/heredoc note. `channel: "chrome"` was not added because
  `core/runner/playwright.setup.js` already defaults headed runs to system Chrome.
- The runner's plaintext password logging will be fixed as a separate task (spawned chip). Not fixed here.

## Architecture Decisions Triggered
ADR-020 (knowledge belongs in knowledge files, not handoffs), which this batch applies. No new pattern.
> ⚠️ Consider whether `archive/` deserves a line in CLAUDE.md or ADR-020 ("never read at session start").

## Protected Files Touched
None. No protected files were modified.

## Pending / Follow-up
- Jira ticket numbers for the 4 Students issues → `admin-students-tab.md` §5.
- The untracked original `HANDOFF-adminstaff-automation.md` in the main checkout can be deleted by the user after merge.
- Next de-dup topics: `authoring-status.md` (61 KB), `admin-shared.md` (80 KB), AGENTS.md vs system.md vs
  handoff copies of the protected-file list (`package.json` ambiguity), skills vs AGENTS.md, walkthroughs.

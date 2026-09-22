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

---

## Session 2: `authoring-status.md` compaction (same day)

### Summary
Applied the file's own header rules: "History lives in the walkthroughs, never here" and "Remove a
block when Phase 3 completes". The file went from 755 lines / 61 KB to 176 lines / 13 KB. Before any
line was removed, it was checked against the knowledge files, and any lesson not already recorded
there was promoted first.

### Changes Made

#### 1. `.architecture/archive/authoring-status_2026-09-18.md` (new)
- **Type:** Created. Full pre-compaction snapshot, so no detail is lost.

#### 2. `.architecture/authoring-status.md`
- **Type:** Modified (755 → 176 lines)
- **What changed:** Each block now holds its phase status, pass count, npm script and knowledge link,
  plus open items (Blocked / On Hold / Not built / user decisions / follow-ups). The debugging
  narratives were removed. The three Grading blocks (GSCL, the TC_7 pair, CGST) were removed
  entirely because all their phases were ✅, and a pointer note replaces them. Students (4 blocks) and
  Staff (2 blocks) were merged into one block per tab. Stale lines were dropped ("MQA Sierra
  school", "TC_7 unwritten", "SPRF 11 of 22", "SBLK not started"). A self-contradiction in the
  `SADB_TC_7` design (where Cancel lands) was corrected.
- **Kept as OPEN:** the Classes suites have not been re-run since the 2026-08-19 `TST_CCLS_TC_23`
  refactor; the STFP `TC_RESET` race fix is awaiting confirmation; the LIBRARY tab click is
  intermittently inert; MRAC (teacher side) is failing 0/2.

#### 3. `.architecture/product-knowledge/ExperienceApp/admin-shared.md`
- **Type:** Modified. §A7 gained the `seedAdminFixtures` follow-up. §B12 gained two notes: an
  ordering assertion must first prove there is something to order (`isGroupedBefore`), and prefer
  a substring URL poll over a glob `waitForURL`.

#### 4. `.architecture/product-knowledge/ExperienceApp/admin-students-tab.md`
- **Type:** Modified. §4 gained a note that the last-name cell also holds the avatar initials
  (read `span.item-text`).

### Protected Files Touched
None. No protected files were modified.

### Pending / Follow-up
- The skill `c1-test-authoring` still describes the old long block format in places. Check it against
  the compact format in the next topic.

---

## Session 3: split Generic/shell out of `admin-shared.md` (branch `claude/admin-generic-shell-split`)

### Summary
`admin-shared.md` is read on every Admin App task. About 40% of it (§A9–§A12) covered one
screen group (Generic/shell), not every admin screen. Following ADR-020, that part now lives in its own
per-screen file. The work had three steps: a pure move, then link fixes, then folding the §A12
corrections into the sections they correct. As a result, `admin-shared.md` went from 1,212 lines / 83 KB to 727 lines / 53 KB.

### Changes Made

#### 1. `.architecture/product-knowledge/ExperienceApp/admin-generic-shell.md` (new)
- **Type:** Created. §A9/B11, §A10, §A11 and §A12 were moved verbatim, and losslessness was proven by
  sha256 (`584945f5…`, identical before and after, 490 lines / 29,478 bytes). A per-screen header was
  added.
- The §A12 corrections were then folded into §A9–§A11, following the file's own rule (strike the old
  claim, then add a dated correction): language qids, persistence and Spanish copy; `cFooter-8`; footer
  destinations and `rel="nopener"`; the notification wrapper, Close, and read/unread rows; My profile
  qids, the active tab and the menu trap; the change-key dialog and the `SKEY_TC_4` verification; the
  KNF org slug and the org switch; the role-toggle round trip and its late binding; the disputed
  school-grouping claim; and the institution-request wizard. The §A12 section was then removed.
  Result: 468 lines / 28 KB.

#### 2. `.architecture/product-knowledge/ExperienceApp/admin-shared.md`
- **Type:** Modified. §A9–§A12 were replaced by a 5-line "moved" pointer. The eight §A2 coverage rows now link to the new
  file. The §B12 heading date was corrected (2026-09-18).

#### 3. Link updates
- `product-knowledge.md` and `product-knowledge/ExperienceApp.md`: each gained a Generic / shell row.
- `admin-reports-tab.md` (§A9 reference) and `authoring-status.md` (Generic knowledge link) now point to the new file.

### Architecture Decisions Triggered
ADR-020 (a feature area gets its own file). Same pure-move-then-edit method as the 2026-08-21 migration.

### Protected Files Touched
None. No protected files were modified.

### Pending / Follow-up
- `admin-generic-shell.md` §A11 dialog table still lists the Student removal copy, although removal is
  gone from the product (`admin-students-tab.md` §9.7). This was left unchanged.

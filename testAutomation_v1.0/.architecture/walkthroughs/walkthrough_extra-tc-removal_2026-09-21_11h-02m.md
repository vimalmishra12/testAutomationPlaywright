# Walkthrough — extra-tc-removal

## Session 1 — 2026-09-21

### Summary
The user decided to remove every manual test case that is "Extra in Ours" in `Admin_Gap_Analysis.xlsx`
**and** not automated (Automation Status = Excluded – Phase 1 or Blocked) from the six Admin App
registers, archive full copies first, and annotate the gap register. Classes went first, and its count
(7) was confirmed with the user before any removal. That gave 80 cases removed in total. Extra cases that
ARE automated (11 in Classes, 12 in Students) were kept.

### Changes Made
| Register | Removed | Cases before → after |
|---|---|---|
| AdminApp-Classes | 7 (2 Blocked, 5 Excluded) | 92 → 85 |
| AdminApp-Students | 5 | 68 → 63 |
| AdminApp-Staff | 17 | 57 → 40 |
| AdminApp-Library | 28 | 42 → 14 |
| AdminApp-Reports | 10 (also from `_tcdata.js`) | 43 → 33 |
| AdminApp-Generic | 13, incl. 3 MultiOrg `SADB` (also from both arrays in `_tcdata.js`) | 41 → 28 |

- **Archive:** each register folder has `archive/<name>_before-extra-removal_2026-09-21.{md,xlsx[,js]}`.
- **Verification (scripted):** the removed ids are gone from the .md, .xlsx and `_tcdata.js`; every surviving
  .xlsx row is value-identical to before; the .md and .xlsx case counts match in all six registers.
  S.No. values were not renumbered (skill rule 7).
- **Summaries:** `registerSync.js apply` regenerated the automation-summary blocks for five registers (one
  Reports status cell was also synced from run evidence). For Classes the summary was hand-adjusted instead,
  because the tool cannot run until a pre-existing id drift is fixed (see Pending).
- **Notes:** each register has a dated "REMOVED" note listing the retired ids. Classes also had its
  coverage map, header totals and three Open items updated. In the other five, the remaining in-text
  mentions of removed ids are historical and point to the archive.
- **Gap register:** the Notes column of all 80 rows is prefixed "REMOVED from our register 2026-09-21 …";
  their Status stays "Extra in Ours".

### Protected Files Touched
None.

### Pending / Follow-up
- **Classes id drift (pre-existing, from PR #51):** the .xlsx has `TST_CCLS_TC_24–28` where the .md has
  `TST_BCCF_TC_17–21`. Fix it, then re-run `registerSync.js` for Classes.
- `AdminApp-Reports/_tcdata.js` `PHASE1_EXCLUSIONS` still lists the 10 removed ids (harmless, stale).
- Knowledge files, ADR-021 and `authoring-status.md` still cite some removed ids (e.g. `TST_GCAT_TC_4`,
  `TST_STFL_TC_26`) — historical references, not updated.
- The five non-Classes registers still mention removed ids in their coverage maps and Remarks (see each register's note).

---

## Session 2 — 2026-09-21

### Summary
This session fixed the Classes id drift. It also repaired a side effect of Session 1: `registerSync.js apply` ran
on a machine with no archived audit runs (`output/reports/auditRuns` is empty here), so it had reset
every **Automation Evidence** row in the Students, Staff, Library, Reports and Generic registers to "Not executed in
this audit", and it had changed one Reports Status.

### Changes Made
- **Classes .xlsx:** B82–B86 renamed `TST_CCLS_TC_24–28` → `TST_BCCF_TC_17–21` (via `xlsxRegister set`, verified with
  no other cell changed). The titles match the .md cases, and the register convention is manual id + "Automated as
  TST_CCLS_…" in the Evidence column.
- **Classes summary:** the counts are taken from `registerSync.js plan` (Automated 73 · Not Automated 12; Pass 73 · Not Run 12),
  and they match the per-case rows. The Session 1 hand-count of 68/17 was based on the stale 2026-09-16 block. `apply` was not run,
  for the reason above, and a note in the block says so.
- **Five registers:** Status / Automation Status / Automation Evidence were restored, for every surviving case, from the
  pre-removal archive copies (md: Students 38, Staff 28, Library 14, Reports 22, Generic 21 rows, and the same in the .xlsx).
  The summary tables were recounted from the per-case rows.

### Lesson
Only run `registerSync.js apply` where `output/reports/auditRuns` holds real run reports. Otherwise use `plan` for counts.

### Protected Files Touched
None.

---

## Session 3 — 2026-09-21

- `test/Manual/C1App/AdminApp-Reports/_tcdata.js`: `PHASE1_EXCLUSIONS` emptied (all 10 ids were removed from the register in
  Session 1), with a dated comment. Verified the module still loads: `TCS` 33, `PHASE1_EXCLUSIONS` 0, no `[EXTRA` markers
  left. `_generate.js` was not re-run. Protected files touched: none.

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

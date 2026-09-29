# Admin Students tab (ExperienceApp, thor) — `SLST` / `SPRF` / `SBLK`
Knowledge `admin-students-tab.md` · register `test/Manual/C1App/AdminApp-Students/` · remaining work (Groups B/C/D) `HANDOFF_adminStudents_remaining_20260915.md` · school `FCN-CHZ-PDA`
- **SLST** `adminStudentsTabTest_thor` — P1 ✅ 2026-08-28 · P2 ✅ 24/24, 2 clean runs (2026-09-16) · P3 ⬜ (expected "no candidates")
  On Hold `TC_28` (unused-code search → HTTP 504, knowledge §9.6) · Blocked `TC_14` (needs a redeemed code + its student), `TC_27` (one username account on FCN) · Not built `TC_25` (creates a student → Group C) · Follow-up: `TC_5/6/12` take ~31–61 s (were ~1 s), not investigated
- **SPRF** `adminStudentProfileTest_thor` — P1 ✅ 2026-08-28 · P2 ✅ 11/11, 2 clean runs (2026-09-15) · P3 ✅ 2026-08-28 (no candidates) except `TC_12` ⬜ (user deferred — ask first)
  On Hold `TC_7` (profile hangs on HTTP 500 — add to the exec file when fixed) · Blocked `TC_19–22` (removal gone from the product, §9.7), `TC_3`, `TC_18`, `TC_14` · Not built `TC_8`, `TC_10`, `TC_13` (mutate a real account → Group C)
- **SBLK** `adminBulkStudentsTest_thor` — P1 ✅ 2026-09-15 · P2 ✅ 3/3, 2 clean runs · P3 ⬜ (ask the user first)
  On Hold `TC_14` ("Create N account" enabled with an invalid row, §9.4) · Not built Group B (`TC_11`, `TC_17`), Group C, Group D — see the handoff
- ▶ Now: idle since 2026-09-16 · Next: Group B per the handoff, then the owed Phase 3s

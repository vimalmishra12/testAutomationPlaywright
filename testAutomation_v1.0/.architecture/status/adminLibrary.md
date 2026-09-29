# Admin Library tab (ExperienceApp, thor) — `adminSchoolLibraryTest_thor`
Modules `LIBR` / `UMBP` · knowledge `admin-library-tab.md` · register `test/Manual/C1App/AdminApp-Library/` (42; 28 Phase-1 EXTRA)
- Phase 1 ✅ 2026-09-14 · Phase 2 ✅ 2026-09-14 — 14/14 (`LIBR_TC_2, 3, 4, 10, 11, 12, 20, 23, 25, 33` + `UMBP_TC_1, 2, 3, 9`; housekeeping `LIBR_TC_100/101`)
- Phase 3 ⬜ — expected "no candidates" (`admin-shared.md` §B10), still owed
- ⚠️ OPEN: the LIBRARY tab click is intermittently inert (reports success, browser stays on `/class`; not the loader). BeforeEach recovery avoids it; `TST_LIBR_TC_101` still uses the click — needs a live browser session
- Brittle by necessity: `UMBP_TC_1/2/3/9` find another team's products by title — a rename is a one-line fix in `adminSchoolLibraryData.json`
- ▶ Now: idle since 2026-09-14 · Next: diagnose the inert click, then Phase 3

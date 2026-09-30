# ebookMappingTest (ExperienceApp, thor) — `eBookMappingTest_Thor` → **merged 2026-09-28**
Module `EMAP` (Presentation Plus book-to-book page mapping) · knowledge `foc-presentation-plus.md` Part D · register `test/Manual/C1App/FOC/ebookMapping_test_cases.md` · **now runs as `Suite7_BookMappingPresentationPlus` of `ebookE2EteacherTest_thor`** (manual cases S7-TC1..10 in `ebookE2EteacherTest_thor_details.*`); `ebookMappingTest.json` kept on disk as a frozen archive, script in `package_copyDND.json`
- Phase 1 ✅ 2026-09-25 — `TST_EMAP_TC_1..2, 5, 6`; first run 9 passing / 1 failing (`TC_2` switch-back); visual candidates: none (live reader state)
- Phase 2 ✅ 2026-09-25 — 18/18, 2 consecutive clean runs; one earlier intermittent switch-back failure is in the register's Open items
- Phase 3 ⬜ pending
- Not built: `TST_EMAP_TC_3..4` (manual only — the expected result for an unmapped page is unconfirmed)
- Follow-up: none — merged into the teacher E2E suite (user decision 2026-09-28); the standalone run remains reproducible from the archived exec file via the `package_copyDND.json` script
- ▶ Now: retired (merged into ebookE2EteacherTest_thor)

# ebookE2EteacherTest (ExperienceApp, thor) — `ebookE2EteacherTest_thor`
Modules `CMAT` `RBNK` `EBOO` `C1AS` `EMAP` `APPS` (teacher materials, eBook, resource banks, Presentation Plus, assignment creation, and book-to-book page mapping) · knowledge `foc-class-materials.md` + `foc-resource-bank.md` + `foc-ebook-reader.md` + `foc-presentation-plus.md` · plan `PLAN_ebook-foc-suite-merge_2026-09-22.md` (r5 Approach A)
- Phase 1 ✅ 2026-09-23 — 6 suites (Class 1RB/2RB materials & eBooks, Resource Banks 1 & 2, Presentation Plus, Suite 6 assignment creation); `TST_APPS_TC_1/2` teardown per suite
- Phase 2 ✅ 2026-09-23 — 77/77 (5 min), incl. Suite 6's round trip (`TST_C1AS_TC_24`)
- **Merged 2026-09-28** — `Suite7_BookMappingPresentationPlus` added (36 `Test` steps: 3 mapping scenarios, each in its own re-login/re-launch block, Cover setup/teardown `TST_EMAP_TC_5`); former `eBookMappingTest_Thor` standalone retired — `ebookMappingTest.json` archived, script moved to `package_copyDND.json`; manual register `ebookE2EteacherTest_thor_details.*` extended with S7 (87 cases / 115 steps)
- Phase 3 ⬜
- ▶ Now: merged S7 book mapping (needs first live 7-suite run) · Next: Phase 3

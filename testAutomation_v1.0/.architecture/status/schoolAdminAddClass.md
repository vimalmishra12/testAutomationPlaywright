# schoolAdminAddClass — create-class form, three suites (ExperienceApp, thor)
Module `CCLS` · knowledge `admin-create-classes-form.md` · register `test/Manual/C1App/AdminApp-Classes/` · school `FCN-CHZ-PDA`
- `P1AdminclassValidation_Thor` (`TC_9..12`) — P1 ✅ 2026-08-14 · P2 ✅ 6/6, 2 clean runs · P3 ⏭️ DEFERRED by user 2026-09-28
- `P1AdminclassBulk_Thor` (`TC_13..19, 21, 22`; creates no class) — P1 ✅ 2026-08-18 · P2 ✅ 11/11, 2 clean runs · P3 ⏭️ DEFERRED by user 2026-09-28
- `P1Adminclassworkflow_Thor` (`TC_1..8, 15, 16, 20`; creates 2 classes per run) — P1 ✅ 2026-08-18 · P2 ✅ 13/13 (only one run carries the final assertion — accepted, each run creates 2 classes) · P3 ⏭️ DEFERRED by user 2026-09-28
- ⚠️ OPEN: bulk + validation not re-run since the 2026-08-19 `TST_CCLS_TC_23` refactor (reset moved out of seven TCs); only the CSV suite has run `TC_23` since
- ▶ Now: idle since 2026-08-19 · Next: re-run `P1AdminclassBulk_Thor` + `P1AdminclassValidation_Thor` (they create nothing); then this file closes (rule 4)

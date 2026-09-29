# newLearningPath (ExperienceApp, production) — `newLearningPathTest_prod` (`newLearningPath.json`)
Modules `NLPP` · `CGRP` · `DASH_TC_17` (+ reused LP setup chain, `DASH_TC_13`, `MSAC_TC_1`, `MRKQ_TC_1/2`, `PROG_TC_1/3/4/5/6/7`) · knowledge `new-learning-path.md` · register `test/Manual/C1App/NewLearningPath/` (34 Pass) · source `nlp-scenarios.xlsx` (TC-NLP-001…022)
Creates per full run (user decisions 2026-09-25): 1 teacher + affiliation, 1 class, learners A + B, 1 group, progress, 2 submissions, 2 marks, 3 comments
- Phase 1 ✅ 2026-09-25 — grounded live first (read-only probes)
- Phase 2 ✅ 2026-09-29 **by user decision** — ONE clean full run, not the usual two: run 5 **135/135** (2026-09-25; teacher `_5srg`, Class brvp, learners `_3jsj` / B `_6bu5`). A second run was declined because every full run creates production data. The run-4 fix (wait for the "Unmarked" counter to settle) is proven once only — if a group-marking step fails again, suspect it first
- Phase 3 ⬜ not assessed — every TC `visualTest: false` (all data run-generated: names, keys, dates)
- Supersedes the classic LP register's ON-HOLD LP-023/024 (`PEXT_TC_22/23`); the parked `learningPathGroups.json` stays on disk (r4)
- ▶ Now: Phase 2 closed 2026-09-29 · Next: Phase 3 (expected "no candidates" — all data run-generated)

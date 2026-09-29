# newLearningPath (ExperienceApp, production) — `newLearningPathTest_prod` (`newLearningPath.json`)
Modules `NLPP` · `CGRP` · `DASH_TC_17` (+ reused LP setup chain, `DASH_TC_13`, `MSAC_TC_1`, `MRKQ_TC_1/2`, `PROG_TC_1/3/4/5/6/7`) · knowledge `new-learning-path.md` · register `test/Manual/C1App/NewLearningPath/` (34 Pass) · source `nlp-scenarios.xlsx` (TC-NLP-001…022)
Creates per full run (user decisions 2026-09-25): 1 teacher + affiliation, 1 class, learners A + B, 1 group, progress, 2 submissions, 2 marks, 3 comments
- Phase 1 ✅ 2026-09-25 — grounded live first (read-only probes)
- Phase 2 — last full run 5 **135/135 clean** (2026-09-25; teacher `_5srg`, Class brvp, learners `_3jsj` / B `_6bu5`); earlier full runs had failures, so it is not marked ✅ (the rule wants 2 consecutive clean runs)
- Phase 3 ⬜ not assessed — every TC `visualTest: false` (all data run-generated: names, keys, dates)
- Supersedes the classic LP register's ON-HOLD LP-023/024 (`PEXT_TC_22/23`); the parked `learningPathGroups.json` stays on disk (r4)
- ▶ Now: idle since 2026-09-25 · Next: agree with the user how to close Phase 2 (a second clean full run creates data), then Phase 3

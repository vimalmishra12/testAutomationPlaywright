# onboarding (ExperienceApp, thor; e-mail verification cases need prod) — no npm script yet
Modules `LAND` `FOOT` `LOGI` `APPS` `RESE` `SNUP` `CREA` `SPRF` `INVI` + `PCHD` (proposed) · knowledge `c1-core-shared.md` → `onboarding.md` (§A6 = the source's product facts) · register `test/Manual/C1App/Onboarding/` (63 TCs) · source `OnboardingApp_Test_Plan.xlsx`
- Manual register ✅ 2026-09-24 — 63 TCs, all Not Run: 50 to automate, 13 manual-only (🔴/🟡 "Automation Scope" — never automate, user decision 2026-09-24), 16 reuse an existing automated TC ID (ADR-011)
- Phase 1 / 2 / 3 ⬜ — nothing grounded live yet: every expected result is the source team's until Phase 1 confirms it
- ▶ Now: not started · Next: batch B1

**Start here — the cases are already designed; keep their TC IDs.** Read the register's "How to automate a case from this register", its coverage map and "Open items", then the `c1-test-authoring` skill.
- **B1 — no data (first):** `TST_SNUP_TC_65..71, 76, 77, 78`, `TST_LOGI_TC_7, 10`, `TST_RESE_TC_6`, `TST_LAND_TC_6, 7` + confirm the 16 reused rows (`LAND_TC_2/3`, `FOOT_TC_1/2/3/4/6/7/8`, `LOGI_TC_4/5/6`, `APPS_TC_2`, `RESE_TC_4`, `SNUP_TC_59/63`) assert what the register says — `FOOT_TC_4/6/8` are commented out in `footer.test.js` and must be re-enabled
- **B2 — fixture accounts:** `TST_LOGI_TC_8, 14`, `TST_RESE_TC_7, 8`
- **B3 — creates data, ASK FIRST (ADR-021):** `TST_SNUP_TC_72..75`, `TST_LOGI_TC_9` (lockout — disposable account only), `TST_RESE_TC_9, 10`, `TST_CREA_TC_31`, `TST_SPRF_TC_24`, `TST_LOGI_TC_18`, `TST_INVI_TC_14, 15`, `TST_PCHD_TC_1..3`
- **Ask the user before B3:** module code `PCHD` OK? · `SPRF_TC_24` (Students tab Action Menu → temporary password) vs `SPRF_TC_8/23` (Manage account → Password tab) — same flow or two? · keep `RESE_TC_10` or fold it into `RESE_TC_9`? · signup/verification cases on prod, or wait for thor's expired verify-link certificate (`c1-core-shared.md` §A4)? Also the register's Open items (`[ASSUMED]` copy; is TC_XCUT_009 a Phase 3 `visualTest` concern)
- Constraints: new exec files need an npm script (`package.json` is protected); passwords only via `{{env.*}}` (ADR-025); run-generated users via `{{run.*}}` (ADR-022). Close the loop: back-port into `_tcdata.js`, run `node test/Manual/C1App/Onboarding/_generate.js`, set Status/Comments, update this file

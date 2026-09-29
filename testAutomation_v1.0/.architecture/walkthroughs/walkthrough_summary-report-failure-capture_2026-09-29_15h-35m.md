# Walkthrough — summary-report-failure-capture

## Session 1 — 2026-09-29

## Summary
Made the stakeholder summary report build automatically at the end of every run (it was a manual step), and
added a screenshot + URL at the moment ANY step fails — setup hooks included, which had no screenshot at all.
Branch `summmary-report-changes` (name as given by the user). Triggered by three one-off setup login hangs on
2026-09-28/29 that left no evidence.

## Changes Made

### 1. core/utils/failureCapture.js
- **Type:** Created
- **Layer:** Core (utility — not on the protected list)
- **What changed:** `onStepFailure({ testFile, tcId, error })`. Restarts the running step's Mocha time limit
  (`global.__mochaRunner.currentRunnable.timeout(45000)`), then captures page URL, title (≤ 5 s), the first 2 000
  characters of visible text (≤ 5 s) and a full-page screenshot (≤ 15 s, viewport fallback). Writes
  `<nn>_<TC>.png` + `.json` at once to `output/reports/TestReports/failures/<exec>_<env>_<start>/` (plus `run.json`);
  the first failure of a run creates the folder and prunes older run folders to `historyKeep` (30, from
  `tooling/report/report.config.json`). For a failed HOOK it also attaches "Screenshot (at failure)" and
  "Page at failure" to that hook via `mochawesome/addContext({ test: hook }, …)`. Never throws.
- **Why:** Mocha does not run `afterEach` for a failed hook, so a failed setup step had no screenshot; and all
  screenshots lived only in mochawesome's end-of-run JSON, lost when a run is stopped.
- **Scope decision (user, 2026-09-29):** capture ONLY at the moment of failure — the proposed second shot 30 s
  later was dropped.

### 2. core/runner/testrunner.js — PROTECTED (change confirmed by the user)
- **Type:** Modified
- **Layer:** Core
- **What changed:** requires `failureCapture.js` (absolute from `rootDir`, like `runContext.js`, because
  specGenerator copies this file into `test/tempRunner/`); in `identifyTest`'s catch, `await
  failureCapture.onStepFailure(...)` before the unchanged `throw e`.
- **Lines affected:** top-of-file requires (+3); `identifyTest` catch (+3)

### 3. core/runner/run.js — PROTECTED (change confirmed by the user)
- **Type:** Modified
- **Layer:** Core
- **What changed:** (a) after the mochawesome capabilities injection, runs `tooling/report/buildReport.js` as a
  child process (`spawnSync`, 180 s cap) with `--mochawesome`, `--env`, `--appType` and `--exec` (single exec file
  only); a failure only logs `Summary report NOT built`; opt out with `--summaryReport=false`; only when
  mochawesome is the reporter. (b) `global.__mochaRunner = runner` after `mocha.run(...)`.
- **Why:** runs started by hand or in CI never got a summary report.

### 4. tooling/report/buildReport.js
- **Type:** Modified
- **Layer:** Tooling
- **What changed:** reads the failed setup hook's context (`setupShot`, `setupPage`); gives it a lightbox id;
  shows "Screen at the moment the setup failed · <URL — title>" in the suite block and the screenshot + page in
  the failure digest; footer wording.

### 5. Documentation
- `decisions.md` — ADR-024 title + **Amendment 2** (why, report, failure capture, what is not covered).
- `system.md` — reporting bullets: auto-built report; failure capture.
- `.agent/skills/c1-test-authoring/phases/2-run-fix.md` — step 3b: hand over the auto-built report; build by hand
  only if it was not built; where a stopped run's failure screenshots are.

## Verification (production, 2026-09-29)
- Temporary exec (deleted afterwards), read-only, last run's teacher (`--runData=last`): Suite 1 with a `Before`
  step opening a class that does not exist; Suite 2 with the same as a Test step. Exit 1 (correct); two
  `[failure-capture]` lines; disk files written at the moment of each failure (15:27 and 15:28 — before the
  run ended at ~15:29); mochawesome: the hook carries its screenshot + page, both errors are the ORIGINAL
  assertion ("Page is not launched."), not Mocha timeouts; summary report built automatically, showing the
  setup screenshot and page. The screenshot shows the teacher dashboard with only the run's class.
- Passing temporary exec: exit 0, summary report built automatically, no failures folder. The same with
  `--summaryReport=false`: no report.
- Retention: a scratch folder with 31 old run folders + one new failure → 30 folders kept (two oldest removed).
- Full `learningPathTest_prod` via `npm run` (no extra flags): **113/113, 407 checks, 11 min, exit 0**; the
  summary report was built automatically by `run.js`
  (`summary/learningPath_production_2026-09-29_15h30/`); no failures folder (nothing failed).
- Full `newLearningPathTest_prod` via `npm run`: **135/135, 542 checks, 19 min, exit 0**; summary report built
  automatically, with the NLP test data and roles (Student 67/67, Teacher 67/67, Admin 1/1)
  (`summary/newLearningPath_production_2026-09-29_15h47/`); no failures folder.

## Architecture Decisions Triggered
ADR-024 amendment 2 (recorded in decisions.md). `global.__mochaRunner` is a new framework global.

## Protected Files Touched
- `core/runner/run.js` — confirmed by the user 2026-09-29 ("go ahead with A and B").
- `core/runner/testrunner.js` — confirmed by the user 2026-09-29 (same message).

## Pending / Follow-up
- A step that exceeds its own Mocha time limit fails outside `identifyTest`, so a hook TIMEOUT still has no
  screenshot (all three recent hangs were assertion/wait failures inside the step, which ARE captured).
- A failed `After` / `AfterEach` hook is saved to disk but not yet shown in the summary report.
- Semaphore pipeline not updated (user: ignore for now).

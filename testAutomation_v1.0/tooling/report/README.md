# Stakeholder summary report (ADR-024)

A presentable report built **after** a run, alongside the normal mochawesome report.

> For ✔ / ✘ marks on the elements each assertion checked, see the assertion evidence report
> (`--assertReport=true`, ADR-025, `core/utils/assertion-report/README.md`).

```bash
node tooling/report/buildReport.js
```

With no flags it takes the latest run: `output/reports/TestReports/mochawesome/report.json`, the
`logs/info_*.json` written at the same time, and the environment's `runtime/lastRun.json`.
Build it before the next run overwrites `report.json`.

**Output:** `output/reports/TestReports/summary/<exec>_<env>_<date>/index.html` — one file with the screenshots embedded (~12 MB for a full run),
plus a zipped copy (~9 MB) to share.

## What the report shows

1. **Summary.** Environment badge, the counts, passed checks, the pass count for each role, and the total time.
2. **Failures.** For each failure: the failed check, the error, the screen at failure, and the trace file if there is one.
3. **Comparison with the previous run** of the same execution file on the same environment: new failures,
   fixed tests, and tests that got much slower or faster.
4. **Test data and environment.** Base URL, run mode, the accounts, the password (masked), and the data values
   listed in `report.config.json`.
5. **Summary by user type.** Results grouped Student / Teacher / Admin, then by suite, then by test. You can
   filter by role or result, hide the setup suites, search, and print or save as PDF. Click a test ID (📷) to open the full-page screen at the end of
   that test (full width, scroll down; "Fit to window" shows it whole). Requirement IDs (LP-xxx) are left out of suite and test titles.
6. **Waits and slow tests.** The waits the log records, and the ten slowest tests.

## Setting up an execution file

- In the execution file, give each suite a `"Role"` (`Student` / `Teacher` / `Admin`). Mark the account-creation
  suites with `"Setup": true`. The runner ignores both fields.
- In `report.config.json` → `execFiles`, add:
  - the title and run mode
  - the data file
  - the register `.md`
  - the account for each role (a jsonPath into the data file)
  - the test-data rows
  
  `{{run.x}}` / `{{last.x}}` tokens are resolved from `lastRun.json`.

## Flags (all optional)

| Flag | Use |
|---|---|
| `--mochawesome=<file>` `--log=<file>` `--runData=<file>` | Build from saved files (an older run) |
| `--exec=<name.json>` `--env=<env>` `--appType=<app>` | Override what the tool detects |
| `--out=<dir>` | Write somewhere else (e.g. a scratch folder) |
| `--noHistory` | Don't record this build in `output/reports/history/` (for trial builds) |
| `--noZip` | Skip the zip |

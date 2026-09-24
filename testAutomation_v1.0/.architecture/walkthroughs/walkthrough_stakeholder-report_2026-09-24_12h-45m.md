# Walkthrough — stakeholder-report

## Session 1 — 2026-09-24

## Summary
The user asked for a more presentable report for stakeholders. The plan was approved, and the user chose
"Step 1 only, separate report, do not update core files; add suggestions 1, 2, 3, 5". Step 1 plus those
suggestions is built as a post-run tool, `tooling/report/buildReport.js`. It was debugged on the saved reports
of full runs 10 and 11, as the user asked. No suite was run.

## Changes Made

### 1. tooling/report/buildReport.js
- **Type:** Created
- **Layer:** Tooling
- **Inputs:**
  - the mochawesome JSON
  - the run's `logs/info_*.json`, picked by the start time within 3 min
  - the execution file (suite `Role` / `Setup`)
  - `runtime/lastRun.json`
  - the register `.md`
- **Output:** `index.html` with `shots/*.png` and a `.zip`.
- **Sections:**
  - summary cards, including a pass count for each role
  - failures digest (suggestion 1)
  - comparison with the previous run, kept in `output/reports/history/` (suggestion 3)
  - test data and environment (password masked)
  - results grouped by user, then suite, then test, with filters, search and expand/collapse
  - waits and the slowest tests (suggestion 2)
  - register cases not run or blocked
  - print/PDF styles and a zip for sharing (suggestion 5)
  - dark mode, and no sideways scroll at 390 px
- **How checks are counted:**
  - The assertion library logs every message before it checks it.
  - The log's `Starting Test Suite` / `BEFORE HOOK` / `Executing testCase` lines tie each message to its setup or test.
  - Tests are matched to mochawesome by their order within the suite. Any test that doesn't line up prints a warning.

### 2. tooling/report/report.config.json, tooling/report/README.md
- **Type:** Created
- **Layer:** Tooling / Config
- **Config:**
  - output and history folders
  - environment badge colours
  - wait patterns
  - thresholds for "slow" and for "much slower / faster"
  - for `learningPath.json`: title, mode, data file, register, accounts for each role (jsonPath), test-data rows
  - `learningPathDebug.json` extends that entry with its own title and mode.

### 3. testResources/testExecutionFiles/ExperienceApp/production/learningPath.json, learningPathDebug.json
- **Type:** Modified
- **Layer:** Test Resources
- **What changed:** Added `"Role"` to each suite, and `"Setup": true` on Suites 1–6. The roles are:
  - Teacher: Suites 1–3, 5, 9–12, 14, 8b and 15
  - Student: Suites 4, 6–8 and 16
  - Admin: Suite 13
- **Check:** the runner reads suite fields by name. The `tcMap --findings` output is identical with and without the new fields.

### 4. .architecture/decisions.md (ADR-023), .architecture/system.md
- **Type:** Modified
- **Layer:** Docs
- **What changed:** Added ADR-023 for the report built after the run. Recorded the report-only suite fields in the Execution File contract.

## Verification (no suite run — user decision)
- **Run 10 report, then run 11 report:**
  - 113/113, 407 checks passed.
  - Roles: Student 58/58, Teacher 54/54, Admin 1/1.
  - Run 11 compares with run 10: 0 new failures, 0 fixed, 0 much slower, and the run was 36 s longer overall.
- **Checked in real Chrome with a scratch Playwright script:**
  - Filters: Teacher shows 54; Teacher with setup hidden shows 25; "PROG_TC_1" matches 1; "LP-035" matches 7; Failed shows 0.
  - Screenshots load; no page errors; dark mode works; no sideways scroll at 390 px after the fixes.
- **Red path:** a copy of run 11 with forced failures, built into the scratchpad with `--noHistory`:
  - the failure digest shows the failed check without repeating the error, plus the setup failure
  - the comparison shows the new failure and the much slower test
  - the counts are 112/113 with 2 failed checks
- **Fixes made while checking:**
  - "Not Run" and the time column wrapped
  - the reason column didn't wrap (CSS specificity), and code didn't wrap on phones
  - the error text was repeated
  - "1 cases"
  - the footer showed absolute scratch paths

## Protected Files Touched
None (`package.json` untouched, so there is no npm script; the tool runs with `node`).

## Pending / Follow-up
- Step 2 (green/red highlighting of the element each check is about, and a check list worded for a pass) needs the
  action and assertion libraries. These are protected, and the user said not now.
- Optional: an npm script `report` in `package.json` (protected; ask first).
- Nothing committed.

## Session 2 — 2026-09-24 (user review of the report)

## Summary
The user asked for three changes:
- remove the "Cases not run" section
- show the environment value ("Production") in black
- remove the requirement labels (e.g. LP-005), and embed the screenshots or link them to the test case ID

All three are done in `tooling/report/buildReport.js`, and the reports were rebuilt from the saved run 10 and run 11 data. No suite was run.

## Changes Made

### 1. tooling/report/buildReport.js
- **Type:** Modified
- **Layer:** Tooling
- **What changed:**
  - The "Cases not run in this report" section is gone, along with `model.notRun`. The register is now read only for each test's title.
  - The environment card value is `Production` in the text colour. The card border and the header badge keep the environment colour.
  - Requirement labels are removed:
    - There is no requirement pill, no "Requirement:" line, and the search no longer matches requirement IDs.
    - The new `stripReq()` removes the requirement prefix from suite names and test titles, e.g. "LP-001, LP-005 - …", "LP-034/035: …" and "LP-035 (…) - …". This happens in the report only; the execution files and tests are unchanged.
  - Screenshots are embedded as data URIs, so the page is one self-contained file (about 12.6 MB for a full run; the zip is about 8.9 MB). There is no `shots/` folder any more.
  - Each test ID with a screenshot (📷) is a link. It opens that screenshot in a viewer without opening or closing the test row. The screenshots in the test rows and in the failure cards open the same viewer.

### 2. tooling/report/README.md, .architecture/decisions.md (ADR-023 items 1–2)
- **Type:** Modified
- **Layer:** Docs
- **What changed:** Updated to match: one embedded file, no not-run list, no requirement IDs.

## Verification (no suite run)
- **Run 11 rebuild (Chrome check script):**
  - 113/113, roles 58/58, 54/54 and 1/1
  - the environment value is "Production" in the text colour
  - no "Cases not run" section, 0 requirement pills, and 0 "LP-nnn" in the page text
  - 113 test ID links and 113 embedded images
  - clicking an ID opens the viewer (image 1920 px wide) and the row stays closed
  - no page errors
- **Forced-failure copy of run 11:** 112/113. The link on the failure card opens the screenshot of TST_PROG_TC_3.
- **Fix made while checking:** a `//` comment placed inside the `return {…}` line commented out `priority`/`state`, so the role counts showed 0/58. The comment was moved to its own line.
- Removed the run 10 output folder (`…_11h48` and its zip), which still used the old `shots/` layout.

## Protected Files Touched
None.

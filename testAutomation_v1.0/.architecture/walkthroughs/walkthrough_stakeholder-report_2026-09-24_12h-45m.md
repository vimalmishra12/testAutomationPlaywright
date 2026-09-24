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

## Session 3 — 2026-09-24 (commit + full-page screenshots)

## Summary
- **Committed** (at the user's request):
  - `d1b1a3f`: records from full runs 10 and 11
  - `46a4e2b`: the stakeholder report (ADR-023)
- **Full-page screenshots:**
  - The user asked about full-page screenshots and confirmed the protected-file change.
  - The end-of-test screenshot now captures the whole page. If the full-page capture fails, it falls back to the visible screen.
- **Assertion highlighting (Step 2):** the design was presented (read-tracking in the action library, check records in the assertion library, outlines drawn only just before the screenshot). The user said NOT to implement it for now.

## Changes Made

### 1. core/runner/playwright.setup.js (PROTECTED — confirmed by user)
- **Type:** Modified
- **Layer:** Core
- **What changed:** In `afterEach`, `page.screenshot({ fullPage: false })` became `({ fullPage: true })`, with `.catch` falling back to the visible screen. A dated inline comment was added.

### 2. .architecture/system.md
- **Type:** Modified
- **What changed:** The Reporting line now says the screenshots are full-page, and states the limit for inner panels.

## Verification
- **Debug run of Suite 12 (`learningPathDebug.json --runData=last`, read-only):** 2/2 passed.
- **Screenshot sizes:**
  - `TST_DASH_TC_12` (teacher dashboard): 1898×1481, about 100 KB. It shows the whole page down to the footer; before, only the visible screen (878 px) was captured.
  - `TST_TLIB_TC_1` (Practice Extra player): 1920×878. The player scrolls inside its own panel, so only the visible part is captured, as expected.
- The summary report builds from the debug run: 2/2 passed, 13 checks.

**Incident:** the first debug attempt left out `--runData=last`.
- The run generated a new teacher e-mail, the login failed in the Before hook, and the run **overwrote `runtime/lastRun.json`**. Nothing was created on production.
- `lastRun.json` was rebuilt from run 11's `runContext generated/stored` log lines: teacher `_8sw6`, Class htbu, class key, learner `_wf0y`. The rerun with the flag then passed.
- Debug runs must always pass `--runData=last` (ADR-022 amendment).
- That first debug attempt also overwrote the mochawesome `report.json`. This did not affect the run 11 summary report, which had already been built.

## Protected Files Touched
- `core/runner/playwright.setup.js`: full-page end-of-test screenshot (confirmed by the user 2026-09-24).

## Pending / Follow-up
- **Step 2 assertion highlighting:** designed, on hold (user: "do not implement for now"). It needs `baseActionLibrary.js`, `baseAssertionLibrary.js` and `playwright.setup.js`.
- **Not committed:** the full-page change, the system.md update and this walkthrough session.

## Session 3 (continued) — full run 12 and the screenshot viewer

- **Full run 12** (user request): 113/113 passed, 407 checks.
  - Teacher `_rhq1`, learner `_ieew`. It took 16 min 20 s, against 9 min for run 11.
  - About 3.5 min of that was one product wait: `TST_PROG_TC_3`, where Class data settled after 211 s (10 reads). Run 11's settled on the first read.
  - Every other suite was 5–30 s slower. Suite 13 was faster.
- **Full-page screenshots in run 12:**
  - 67 of 113 are taller than the screen, up to 1898×2694.
  - 46 are 1920×878, mostly the Practice Extra player, which scrolls inside its own panel.
- **The user said the full-page screenshots did not show in the report.** Cause: the viewer scaled every image to fit the window (`max-height: 94vh`), so a tall page looked small.
  - Fix in `buildReport.js`: the viewer shows the screenshot at full width and scrolls, the header stays at the top with the image size, and a "Fit to window" toggle shows the whole page.
  - Checked in Chrome on `TST_PROG_TC_3` (1898×2331): 1322×1624 on screen and scrolls to the footer; Fit gives 638×784; no page errors.
- **Report size** with full-page screenshots: 16 MB page, 12 MB zip, against 12 MB / 8.5 MB before.

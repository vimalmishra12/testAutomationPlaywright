---
name: c1-environment-test-replicator
description: >
  Replicates a test suite from one environment to another (or multiple environments) in the C1 test automation framework.
  Use this skill whenever the user wants to copy or replicate a test to another environment, port a test from thor to qa,
  stage, or production, run tests after replication, fix environment-specific failures, update selectors or test data
  for a new environment. Trigger on any mention of: replicate test, port test, copy test to environment,
  test not working in qa, test not working in stage, run test in new environment, fix test for environment.
---

# C1 Environment Test Replicator Skill

You are replicating a test suite across environments in the Cambridge One (C1) test automation framework
(**Playwright used as a library + standalone Mocha** — migrated from WebDriverIO, ADR-012).
Follow all steps below exactly.

> **`AGENTS.md` (repo root) and `.architecture/{system,decisions}.md` are the source of truth.**
> Read them first; this skill is the practical workflow on top of them. Where they disagree with this
> file, they win — in particular the **protected-files list**, **selector/naming conventions**, and the
> **appType model** are authoritative in AGENTS.md / the ADRs (don't rely on a possibly-stale copy here).

> The framework is **multi-application**: paths are keyed by `--appType` (`<App>/`). C1 lives under
> `ExperienceApp/` (selector namespace `css.ComproC1`); a second app, `Builder`, lives under `Builder/`
> (`css.Builder`). The steps below show `ExperienceApp/` — substitute the active appType if replicating
> a non-C1 app. See `AGENTS.md` §7 / ADR-013 for the appType model.

---

## STEP 1 — Understand What Needs Replicating

Before doing anything, confirm with the user:

1. **Source environment** — where the working test lives (e.g. `thor`)
2. **Test name** — the base name without environment suffix (e.g. `manageReportsTest`)
3. **Target environment(s)** — where to replicate to (e.g. `qa`, `stage`, `production`)

Source files you will be working with:
- `testExecutionFiles/ExperienceApp/<sourceEnv>/<testName>.json`
- `testcaseData/ExperienceApp/<sourceEnv>/<testName>_data.json`
- `package.json` (to read the source NPM script)
- `env.json` (to get URL mappings per environment)

---

## STEP 2 — Replicate Files to Target Environment

### 2a. Copy Execution File
Copy `testExecutionFiles/ExperienceApp/<sourceEnv>/<testName>.json`
to `testExecutionFiles/ExperienceApp/<targetEnv>/<testName>.json`

No changes needed to the execution file structure — TC IDs, test file paths, and suite structure stay identical.

### 2b. Copy Test Data File
Copy `testcaseData/ExperienceApp/<sourceEnv>/<testName>_data.json`
to `testcaseData/ExperienceApp/<targetEnv>/<testName>_data.json`

Then replace all environment-specific URLs:
- Read `env.json` to get `appUrl` for source and target environments
- Replace every occurrence of the source `appUrl` with the target `appUrl`
- Example: `https://thor.cambridge.edu` → `https://qa.cambridge.edu`

### 2c. Add NPM Script to package.json
Read the source NPM script from `package.json`:
```
"<testName>_<sourceEnv>": "node core/runner/run.js --appType=... --testEnv=<sourceEnv> --testExecFile=<testName>.json --browserCapability=desktop-chrome-1920"
```

Add a new entry replacing source env with target env:
```
"<testName>_<targetEnv>": "node core/runner/run.js --appType=... --testEnv=<targetEnv> --testExecFile=<testName>.json --browserCapability=desktop-chrome-1920"
```
> `--testExecFile` is just the file name; the runner resolves it under the appType's `testExecDir`
> (from `env.json`). Note `--browserCapability` (was `--capability` in WDIO).

Show a preview of all files to be created/modified and ask: **"Ready to create these files? (yes/no)"**

---

## STEP 3 — Run the Test in Target Environment

After files are created, run:
```
npm run <testName>_<targetEnv>
```

Capture the output and identify:
- Which TCs passed ✓
- Which TCs failed ✗ and why

---

## STEP 4 — Analyse Failures

For each failing TC, classify the failure type:

### Failure Type 1: Selector Not Found
**Symptoms:** `Element not found`, `No such element`, selector error
**Root cause:** DOM structure is different in target environment
**Fix:** Update the selector value in `testResources/selectors/ExperienceApp/C1Selectors.json`
- Find the current selector path (e.g. `css.ComproC1.manageReports.reportTable`)
- Inspect the target environment DOM for the correct selector
- Propose new value with confidence score (50–100%)

### Failure Type 2: Assertion Mismatch
**Symptoms:** `AssertionError: expected X to equal Y`, wrong text/value on page
**Root cause:** Test data has wrong expected value for this environment
**Fix:** Update the value in `testcaseData/ExperienceApp/<targetEnv>/<testName>_data.json`
- Find the exact JSON path of the wrong value
- Propose correct value based on what the page actually shows

### Failure Type 3: Timeout
**Symptoms:** `TimeoutError: locator.waitFor: Timeout Nms exceeded` (Playwright)
**Root cause:** Page loads slower in target env, or feature not available
**Fix:** Investigate — may need wait time increase or TC skip for this environment

### Failure Type 4: Navigation Error
**Symptoms:** `404 Not Found`, `Could not navigate to URL`
**Root cause:** Wrong URL in `env.json` or feature path changed
**Fix:** Update `appUrl` in `env.json` for the target environment

---

## STEP 5 — Propose Fixes

For each failure, present fixes clearly:

```
ISSUE #1 — Selector Not Found (Confidence: 95%)
  TC: TST_MRPT_TC_1
  Selector path: css.ComproC1.manageReports.reportTable
  Current value: [role="grid"].reports-table
  Proposed value: [data-qid="report-grid-qa"]
  File: testResources/selectors/ExperienceApp/C1Selectors.json
  Impact: TST_MRPT_TC_1, TST_MRPT_TC_3

ISSUE #2 — Assertion Mismatch (Confidence: 98%)
  TC: TST_MRPT_TC_2
  Data path: $.reports[0].name
  Current value: "Q3 Report"
  Proposed value: "Q3 2024 Report"
  File: testcaseData/ExperienceApp/qa/manageReportsTest_data.json
  Impact: TST_MRPT_TC_2
```

Ask: **"Apply these fixes? (yes / no / review each)"**

**Confidence scoring:**
- 90–100% → Very likely correct, auto-approve recommended
- 70–89% → Likely correct, review before applying
- 50–69% → Uncertain, manual investigation recommended
- <50% → Do not auto-apply

---

## STEP 6 — Apply Fixes and Re-Validate

After user approves:
1. Apply all approved fixes to the relevant files
2. Add a comment next to each fix: `// Updated for <targetEnv> environment — <reason>`
3. Re-run: `npm run <testName>_<targetEnv>`
4. Confirm all previously failing TCs now pass

If tests still fail after fixes, repeat Steps 4–6 (maximum 3 iterations).

---

## STEP 7 — Generate Walkthrough

At the end, produce a walkthrough entry:

```markdown
### <testName> replicated to <targetEnv> — <date>
- **Type:** Created + Modified
- **Layer:** Test Resources (Execution Files, Test Data, Selectors)
- **Files created:**
  - testExecutionFiles/ExperienceApp/<targetEnv>/<testName>.json
  - testcaseData/ExperienceApp/<targetEnv>/<testName>_data.json
- **Files modified:**
  - C1Selectors.json (if selector fix applied)
  - package.json (new NPM script added)
- **Test results:** All TCs passing in <targetEnv> ✓
- **Fixes applied:** <N> (list each fix with before/after)
- **Architecture compliance:** No violations — protected files not touched
```

---

## Safety Rules

- **NEVER** modify protected files without explicit confirmation. The **authoritative list lives in
  AGENTS.md** (§"Protected Files"); at time of writing it is `core/runner/playwright.setup.js`,
  `core/runner/run.js`, `env.conf.js`, `baseActionLibrary.js`, `baseAssertionLibrary.js`,
  `testrunner.js`, `specGenerator.js`, `launchUrl.js` (`wdio.conf.js` is retired/deleted). If AGENTS.md
  differs, AGENTS.md wins.
- **NEVER** modify test case files (`.test.js`) or page object files (`.page.js`) to fix environment issues — fix selectors and data instead
- **ALWAYS** show a preview before creating or modifying files
- **ALWAYS** ask for approval before applying fixes
- **ALWAYS** re-run tests after fixes to validate
- **ALWAYS** generate a walkthrough at the end

---

## Quick Reference

| What to replicate | Files to copy |
|---|---|
| Execution flow | `testExecutionFiles/ExperienceApp/<env>/<testName>.json` |
| Test data | `testcaseData/ExperienceApp/<env>/<testName>_data.json` |
| NPM script | Add entry to `package.json` |
| Selector fix | `testResources/selectors/ExperienceApp/C1Selectors.json` |
| URL mapping | Read from `env.json` |

---
name: c1-environment-test-replicator
description: >
  Replicates a test suite from one environment to another (or multiple environments) in the C1 test automation framework.
  Use this skill whenever the user wants to copy or replicate a test to another environment, port a test from thor to qa,
  stage, or production, run tests after replication, fix environment-specific failures, update selectors or test data
  for a new environment. This is the REPLICATION skill — use it when the test ALREADY EXISTS and must be
  brought up in another environment (to "automate"/"run" an existing test in qa, stage, or prod). If instead
  a brand-new test must be written from scratch, use c1-test-authoring. Trigger on any mention of:
  replicate test, port test, copy test to environment, automate existing test in another env,
  automate in qa/stage/prod (existing test), run an existing test in qa, test not working in qa,
  test not working in stage, run test in new environment, fix test for environment.
---

# C1 / Builder Environment Test Replicator Skill

You are replicating a test suite across environments in the C1 / Builder test automation framework
(**Playwright used as a library + standalone Mocha** — migrated from WebDriverIO, ADR-012).
The framework is **multi-application**; this skill is **appType-aware** — STEP 0 resolves the app the
test belongs to and every `<App>` placeholder below is filled from it. Follow all steps below exactly.

> **Always load:** `testAutomation_v1.0/AGENTS.md` + `.architecture/ARCHITECTURE-INVARIANTS.md` (the
> invariants cheat-sheet / index). **Consult on demand:** a specific ADR in `.architecture/decisions.md`
> or a `system.md` section only when the task touches it — follow the cheat-sheet's *Depth →* pointers.
> These are the source of truth; where they disagree with this file, they win — in particular the
> **protected-files list**, **selector/naming conventions**, and the **appType model** are
> authoritative in AGENTS.md / the ADRs (don't rely on a possibly-stale copy here).

> The framework is **multi-application**: paths are keyed by `--appType` (`<App>/`). C1 lives under
> `ExperienceApp/` (selector namespace `css.ComproC1`); `Builder` lives under `Builder/` (`css.Builder`).
> Every `<App>` / `css.<App>` placeholder below is resolved in STEP 0 from the test being replicated.
> See `AGENTS.md` §7 / ADR-013 for the appType model.

---

## STEP 0 — Resolve the application (appType)

The skill is appType-aware. Decide `<App>` before touching any path:

1. **Find the test's execution file** by searching for `<testName>.json` under each appType:
   `testResources/testExecutionFiles/<App>/<sourceEnv>/<testName>.json` (appTypes today: `ExperienceApp`,
   `Builder`). The folder that contains it is `<App>`. If it's ambiguous or not found, **ask the user**.
2. **Read `env.json` → the `<App>` block** for its valid environments + `testExecDir`:
   - `ExperienceApp` → `thor`, `qa`, `rel`, `production`  (namespace `css.ComproC1`)
   - `Builder` → `thor` only today                        (namespace `css.Builder`; 3-step cross-domain SSO login)
3. **Validate the requested target env(s)** exist for `<App>` in `env.json`. If the app has no other
   environment to replicate to (e.g. Builder = `thor` only), **STOP** and tell the user — there is
   nothing to replicate until another env is added to that app's `env.json` block.

Use `<App>` and `css.<App>` in every path/namespace below.

---

## STEP 1 — Understand What Needs Replicating

Before doing anything, confirm with the user:

1. **Source environment** — where the working test lives (e.g. `thor`)
2. **Test name** — the base name without environment suffix (e.g. `manageReportsTest`)
3. **Target environment(s)** — a valid env for `<App>` per STEP 0 (e.g. `qa`, `rel`, `production`)

Source files you will be working with (under the `<App>` resolved in STEP 0):
- `testExecutionFiles/<App>/<sourceEnv>/<testName>.json`
- the data file(s) it references via `dataFile` (see STEP 2b — do NOT assume a name)
- `package.json` (to read the source NPM script)
- `env.json` (to get URL mappings per environment)

---

## STEP 2 — Replicate Files to Target Environment

### 2a. Copy + repoint the Execution File
Copy `testExecutionFiles/<App>/<sourceEnv>/<testName>.json`
to `testExecutionFiles/<App>/<targetEnv>/<testName>.json`

TC IDs, `testFile` paths, and suite structure stay identical — **but the `dataFile` paths inside the
execution file are env-specific** (e.g. `./testResources/testcaseData/<App>/<sourceEnv>/...`). Update
**every** `dataFile` from `<sourceEnv>` to `<targetEnv>`, or the target-env run will read source-env data.

### 2b. Copy the Test Data file(s)
**Do not assume a filename** (it is NOT `<testName>_data.json` — Builder uses `<feature>Data.json`,
C1 varies). Read the execution file's `dataFile` references and copy **each** one from
`testcaseData/<App>/<sourceEnv>/` to `testcaseData/<App>/<targetEnv>/`.

Then replace all environment-specific URLs in the copied data:
- Read `env.json` to get the `<App>` `appUrl` for source and target environments
- Replace every occurrence of the source `appUrl` with the target `appUrl`
- Example: `https://thor.cambridge.edu` → `https://qa.cambridge.edu`

### 2c. Add NPM Script to package.json
Read the source NPM script from `package.json`:
```
"<testName>_<sourceEnv>": "node core/runner/run.js --appType=<App> --testEnv=<sourceEnv> --testExecFile=<testName>.json --browserCapability=<capability>"
```

Add a new entry replacing source env with target env (keep `--appType=<App>` and the source's
`--browserCapability` — e.g. C1 uses `desktop-chrome-1920`, cloud runs use `lambdatest-chrome-1920`):
```
"<testName>_<targetEnv>": "node core/runner/run.js --appType=<App> --testEnv=<targetEnv> --testExecFile=<testName>.json --browserCapability=<capability>"
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
**Fix:** Update the selector value in the app's selector file
`testResources/selectors/<App>/<App>Selectors.json` (C1 → `ExperienceApp/C1Selectors.json`,
Builder → `Builder/BuilderSelectors.json`)
- Find the current selector path (e.g. `css.ComproC1.manageReports.reportTable`)
- Inspect the target environment DOM for the correct selector
- Propose new value with confidence score (50–100%)

### Failure Type 2: Assertion Mismatch
**Symptoms:** `AssertionError: expected X to equal Y`, wrong text/value on page
**Root cause:** Test data has wrong expected value for this environment
**Fix:** Update the value in the target-env data file under `testcaseData/<App>/<targetEnv>/`
- Find the exact JSON path of the wrong value
- Propose correct value based on what the page actually shows

### Failure Type 3: Timeout
**Symptoms:** `TimeoutError: locator.waitFor: Timeout Nms exceeded` (Playwright)
**Root cause:** Page loads slower in target env, or feature not available
**Fix:** Investigate first. If the env is genuinely slower, raise the *condition* wait's timeout
(`waitForDisplayed` / `waitForDocumentLoad` on the real element) — do NOT add a fixed
`browser.pause` (see ARCHITECTURE-INVARIANTS §1, deterministic waits). If the feature is absent in
this env, skip the TC for that environment instead.

### Failure Type 4: Navigation Error
**Symptoms:** `404 Not Found`, `Could not navigate to URL`
**Root cause:** Wrong URL in `env.json` or feature path changed
**Fix:** Update `appUrl` in `env.json` for the target environment

---

## STEP 5 — Propose Fixes

For each failure, present fixes clearly (C1 example shown — substitute `<App>` / `css.<App>` and the
actual data file resolved in STEP 0/2b):

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
  - testExecutionFiles/<App>/<targetEnv>/<testName>.json
  - testcaseData/<App>/<targetEnv>/<data file(s) referenced by the exec file>
- **Files modified:**
  - <App>Selectors.json (if selector fix applied)
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
| Execution flow | `testExecutionFiles/<App>/<env>/<testName>.json` |
| Test data | `testcaseData/<App>/<env>/` (files named by the exec file's `dataFile`) |
| NPM script | Add entry to `package.json` |
| Selector fix | `testResources/selectors/<App>/<App>Selectors.json` (C1 → `ExperienceApp/C1Selectors.json`) |
| URL mapping | Read from `env.json` |

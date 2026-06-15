# AGENTS.md — AI Agent Instructions

> **READ THIS FILE FIRST** before writing, modifying, or generating any code in this repository.

---

## Mandatory Pre-Coding Checklist

Before making ANY code change, you MUST:

1. **Read `.architecture/system.md`** — understand layers, boundaries, and data flow
2. **Read `.architecture/decisions.md`** — understand WHY things are built this way
3. **Identify which layer your change belongs to** — Page Object? Test Case? Execution File? Selector? Core?
4. **Verify your change does NOT violate any boundary rule** listed below
5. **Check for existing patterns** — search the codebase for similar implementations before creating new ones

---

## Non-Negotiable Architecture Rules

### 1. Layer Separation Is Absolute

```
Core (baseActionLibrary / baseAssertionLibrary)
  ↑ consumed by
Page Objects (pages/ExperienceApp/*.page.js)
  ↑ consumed by
Test Cases (test/ExperienceApp/*.test.js)
  ↑ orchestrated by
Execution Files (testResources/testExecutionFiles/**/*.json)
  ↑ configured by
Test Data (testResources/testcaseData/**/*.json)
  ↑ registered in
TC Repository (testResources/testcaseRepository/**/C1TCRepository.json)
```

**Each layer may only depend on the layer directly below it. Never skip layers.**

### 2. Selector Indirection Is Mandatory

- **NEVER hardcode CSS/XPath selectors in Page Objects or Test Cases**
- ALL selectors live in `testResources/selectors/ExperienceApp/C1Selectors.json`
- Page Objects access selectors via `selectorFile.css.ComproC1.<pageName>.<elementName>`
- Selector keys follow the pattern: `css.ComproC1.<pageName>.<elementName>`

### 3. Test Cases Are Stateless Functions

- Each `TST_XXXX_TC_N` function receives `testdata` and calls Page Object methods
- Test Cases MUST NOT directly use `$()`, `browser.*`, or raw selectors
- Test Cases MUST use `assertion.assertEqual()` (from baseAssertionLibrary) — never raw `chai` or `expect`
- Test Cases MUST NOT navigate or manage browser state — that is the Page Object's job

### 4. Page Objects Own All DOM Interaction

- All `click`, `setValue`, `getText`, `getAttribute`, `waitForDisplayed` calls go through `baseActionLibrary`
- Page Objects MUST use `var action = require('../../core/actionLibrary/baseActionLibrary.js')`
- Page Objects MUST load selectors via `var selectorFile = jsonParserUtil.jsonParser(selectorDir)`
- Click methods that navigate to a new page MUST call `require('./<nextPage>.page').isInitialized()` after successful click
- Every method MUST log via `await logger.logInto(await stackTrace.get(), ...)`

### 5. Execution Files Are Pure Configuration

- Execution JSON files MUST NOT contain logic — only references to test case IDs, test files, and data paths
- Every test case ID referenced in an execution file MUST exist in `C1TCRepository.json`
- Test data paths use `dataFile` + `jsonPath` to extract specific nodes from data JSON files

### 6. Naming Conventions Are Enforced

| Artifact | Convention | Example |
|---|---|---|
| Page Object | `<pageName>.page.js` | `manageReports.page.js` |
| Test File | `<pageName>.test.js` | `manageReports.test.js` |
| TC ID prefix | `TST_<4-char-module>_TC_<N>` | `TST_MRPT_TC_1` |
| Selector section | `css.ComproC1.<camelCase>` | `css.ComproC1.manageReports` |
| Execution file | `<descriptiveName>.json` | `manageReportsTest.json` |
| NPM script | `<feature>_<env>` | `manageReportsTest_thor` |
| Functional NPM script | `<feature>_<env>` | `manageReportsTest_thor` |
| Visual NPM script | `visualAcceptance_<feature>_<env>` | `visualAcceptance_manageReports_thor` |

---

## Protected Files — Confirmation Required Before Changing

The following JS and configuration files are architectural foundations of the framework.
**Before modifying ANY of these files you MUST stop, tell the user exactly what
you intend to change and why, and wait for explicit confirmation before proceeding.**

> JSON files (selectors, test data, execution files, TC repository) are NOT in this
> list — they are configuration/data and may be edited freely as part of normal work.

### Protected File List

| File | Layer | Why Protected |
|---|---|---|
| `.mocharc.js` | Configuration | Mocha config — a wrong change breaks all test execution |
| `core/runner/playwright.setup.js` | Core | Owns the Playwright browser lifecycle + all framework globals (the role `wdio.conf.js` held). Changes affect every run |
| `core/runner/run.js` | Core | The Mocha entry point — wrong change breaks all execution |
| `env.conf.js` | Configuration | Controls environment resolution and all global variables |
| `core/actionLibrary/baseActionLibrary.js` | Core | Every single page object in the framework depends on this |
| `core/actionLibrary/baseAssertionLibrary.js` | Core | Every single test case assertion depends on this |
| `core/runner/testrunner.js` | Core | The execution engine — changes affect every test run |
| `core/runner/specGenerator.js` | Core | Entry point for spec execution |
| `core/runner/launchUrl.js` | Core | Controls how the browser navigates to the application |

> **Retired & deleted (2026-06-11, Prompt 4 / Phase 2):** `wdio.conf.js` is gone —
> WebDriverIO was replaced by Playwright-as-library under Mocha (ADR-012). The file
> was hard-deleted (recoverable from git history if ever needed).

### Mandatory Confirmation Format

Before touching any protected file, you MUST present this exact format and wait:

```
⚠️ PROTECTED FILE — Confirmation Required

File    : core/runner/run.js
Section : reporter selection
Current : default reporter = mochawesome
Change  : also wire allure-mocha behind --report=allure
Reason  : Adding Allure reporter as requested for CI pipeline

Do you confirm this change? (yes / no)
```

**Do NOT make any change to a protected file until the user replies with explicit confirmation.**
If the user says no or asks for an alternative, propose an alternative approach without touching the protected file.

---

## Comment Requirements — All Code Changes

Every change made to any JS file MUST include a brief but precise inline comment.

### Comment Rules

1. **What** — what does this code do (only when not immediately obvious)
2. **Why** — why does it exist or why was it written this way
3. Do NOT comment self-explanatory lines — comment the reasoning, not the mechanics

### Comment Format by Change Type

**New method in a Page Object:**
```javascript
/**
 * Clicks the submit button and confirms navigation to dashboard.
 * Uses lazy require to avoid circular dependency with dashboard.page.js — see ADR-004.
 */
async click_submitButton() { ... }
```

**Non-obvious logic:**
```javascript
// true == res (not ===) — intentional loose equality per ADR-009 convention
if (true == res) { ... }
```

**Any change to a protected file (after user confirmation):**
```javascript
// [2026-05-19] Added Allure reporter for CI pipeline — confirmed by user
reporters: ['spec', 'allure'],
```

**Selector reference in a Page Object:**
```javascript
// Resolves to C1Selectors.json → css.ComproC1.manageReports.submitBtn
let selector = selectorFile.css.ComproC1.manageReports.submitBtn;
```

### Comment Anti-Patterns — Never Do These

- ❌ `// clicking the button` — states the obvious, adds no value
- ❌ `// TODO: fix this later` — vague, always explain what and why
- ❌ `// changed by Claude` — unhelpful, always include date and reason
- ❌ Commenting every single line — only comment non-obvious decisions

---

## Walkthrough File — Mandatory After Every Session

At the end of every session where any file was created or modified, you MUST
produce a single walkthrough file that documents every change made in that session.

### File Location and Naming

```
.architecture/walkthroughs/walkthrough_YYYY-MM-DD.md
```

If a walkthrough file for today's date already exists, **append** to it — do not create a duplicate.

### Walkthrough File Format

```markdown
# Session Walkthrough — YYYY-MM-DD

## Summary
One or two sentence description of what was worked on in this session.

## Changes Made

### 1. <filename> (e.g. pages/ExperienceApp/manageReports.page.js)
- **Type:** Created / Modified / Deleted
- **Layer:** Page Object / Test Case / Core / Config / Test Resources
- **What changed:** Precise description of what was added, removed, or modified
- **Why:** The reason — feature request, bug fix, refactor, etc.
- **Lines affected:** e.g. Lines 45–67 (click_submitButton method)

### 2. <next file>
...

## Architecture Decisions Triggered
List any new patterns introduced or existing ADRs referenced.
If a new pattern was established that doesn't exist in decisions.md, flag it:
> ⚠️ New pattern introduced — consider adding ADR-0XX to decisions.md

## Protected Files Touched
List any protected files modified in this session.
If none: "None — no protected files were modified."

## Pending / Follow-up
Anything that was discussed but not completed, or that requires a future decision.
```

### Walkthrough Rules

- **Every session must produce one** — no exceptions, even for small single-line changes
- **Be precise** — "added click_submitButton method at line 45" not "added a method"
- **Date is the session date** — use the actual date, not the file creation date
- **Append, never overwrite** — if today's file exists, add a new `---` section below the existing content

---

## Forbidden Actions

- ❌ **NEVER** import `baseActionLibrary` in a test file — only Page Objects may use it
- ❌ **NEVER** put CSS selectors as string literals in Page Objects — use `selectorFile` references
- ❌ **NEVER** use `assert`, `expect`, or `chai` directly in test files — use the global `assertion` object
- ❌ **NEVER** create an execution file that references a TC ID not registered in `C1TCRepository.json`
- ❌ **NEVER** modify `baseActionLibrary.js` or `baseAssertionLibrary.js` for feature-specific logic
- ❌ **NEVER** add environment-specific URLs to Page Objects — URLs come from `env.json` via `appUrl` global
- ❌ **NEVER** skip the `isInitialized()` pattern when navigating to a new page after a click
- ❌ **NEVER** modify a protected JS/config file without explicit user confirmation
- ❌ **NEVER** make a code change in any JS file without adding a precise inline comment

---

## How to Handle Uncertainty

1. **If unsure about a selector**: inspect the live site, use `qid` or `data-tid` attribute-based selectors (preferred), fall back to class-based selectors
2. **If unsure about test data structure**: examine existing data files in `testResources/testcaseData/ExperienceApp/<env>/` for the JSON nesting pattern
3. **If unsure about execution flow**: study `loginTest.json` or `activeClass.json` as reference execution files
4. **If unsure about a global variable**: `page`, `$`, `$$`, `browser`, `logger`, `stackTrace`, `assertion`, `argv`, `jsonParserUtil`, `selectorDir`, `appUrl`, `moduleOff` are all globals set by `core/runner/playwright.setup.js` / `env.conf.js`. (`page` is the Playwright page; `$`/`$$` are `page.locator` factories; `browser` is the Playwright Browser with WDIO-compat helpers like `browser.pause`.)
5. **If a pattern doesn't exist**: consult `.architecture/decisions.md` before inventing new patterns
6. **If a protected file needs changing**: always ask first — never assume the change is small enough to skip confirmation
7. **Before validating a Jira ticket**, read `.architecture/product-knowledge.md`
   for known error messages, validation rules, and bug notes so you do not
   re-document what is already confirmed.
   **After navigating a new area or learning new product behaviour**, append or
   update that file following its per-app template, organised by app URL.
   Mark unconfirmed items `[ASSUMED]`.

---

### 7. Visual Testing Promotion & Scripting Rules

#### Rule A: Static vs. Dynamic Data Visual Assessment & Confirmation

When creating a new test case (`TST_XXXX_TC_N`), you MUST analyze the nature
of its test data using the decision table below before making any visual test
determination:

| Data Type | Examples | Visual Test Candidate? |
|---|---|---|
| Fixed/static content | Constant text, standard mock accounts, static eBook pages, fixed UI labels | ✅ Yes — confirm with user |
| User-generated keys | Class codes, auto-generated IDs, invite codes | ❌ No — always false |
| Timestamps / dates | Enrollment dates, last-login, session times | ❌ No — always false |
| Environment-variant text | Env-specific labels, feature-flagged UI, region-specific content | ❌ No — always false |
| Paginated / dynamic counts | Long lists, result counts, dynamic rankings | ❌ No — always false |
| Randomized / computed values | Random names, auto-incremented numbers | ❌ No — always false |

**Step 1 — Present reasoning first (mandatory, before any confirmation prompt)**

Before making any visual test determination, you MUST present your analysis
in this exact format and STOP. Do not proceed to Step 2 until the user
explicitly tells you to continue:

📋 VISUAL TEST ASSESSMENT — Thought Summary

TC ID       : TST_XXXX_TC_N
Description : <tc description>

Data Field Analysis:
| Field        | Value / Nature      | Decision Table Row     | Classification   |
|--------------|---------------------|------------------------|------------------|
| <field name> | <what the value is> | <which row it maps to> | Static / Dynamic |

Overall Conclusion : [Visual Test Candidate ✅ / Not a Candidate ❌]
Reason             : <one sentence explaining the conclusion>

Awaiting your review. Reply "validate" to proceed, or correct any 
misclassification above.

**Step 2 — Confirmation prompt (only after user says "validate" or equivalent)**

Only when the user explicitly approves Step 1, present this and wait for 
yes/no before touching C1TCRepository.json:

⚠️ VISUAL TEST PROMOTION — Confirmation Required

TC ID       : TST_XXXX_TC_N
Description : <tc description>
Data used   : <describe the static data fields>
Reason      : Data is static/fixed — no dynamic values detected
Change      : "visualTest": false → "visualTest": true in C1TCRepository.json

Do you confirm enabling visual testing for this TC? (yes / no)

Do NOT set "visualTest": true until the user replies with explicit confirmation.

- **Dynamic/Variable Data**: If the test data falls in any ❌ row of the
  decision table, you MUST leave "visualTest": false. Do not ask the user
  — this is not a judgment call.

---

#### Rule B: Dual Script Generation in package.json

When introducing a new test execution JSON file (e.g., myNewTest.json):

1. Check if any test case included in that execution file has
   "visualTest": true in C1TCRepository.json.

2. If visual testing is enabled for any test case, you MUST define two
   scripts in package.json:

   Functional Script:
   "myNewFeatureTest_qa": "node core/runner/run.js --appType=ExperienceApp --testEnv=qa
   --testExecFile=myNewTest.json --browserCapability=desktop-chrome-1920"

   Visual Script:
   "visualAcceptance_myNewFeature_qa": "node core/runner/run.js --appType=ExperienceApp
   --testEnv=qa --testExecFile=myNewTest.json
   --browserCapability=desktop-chrome-1920 --visual=novus --skipAssertion=true"

   Before writing any new script entry to package.json, you MUST present
   the following and wait for explicit confirmation:

   ⚠️ PROTECTED FILE — Confirmation Required

   File    : package.json
   Change  : Adding scripts —
             "myNewFeatureTest_qa": "node core/runner/run.js ..."
             "visualAcceptance_myNewFeature_qa": "node core/runner/run.js ... --visual=novus
             --skipAssertion=true"
   Reason  : New execution file introduced; visual TCs detected

   Do you confirm this change? (yes / no)

3. During validation of the task, you MUST run both scripts to confirm that
   the functional checks pass and that the visual baseline is created
   (first run) or compared successfully (subsequent runs).

   Note on visual baseline: The visual testing implementation auto-creates
   the baseline on the first run and compares against it on all subsequent
   runs. No manual baseline setup is required.

---

#### Rule C: Naming Convention for Visual Scripts

Visual test NPM scripts MUST follow this naming pattern:

| Artifact | Convention | Example |
|---|---|---|
| Functional NPM script | <feature>_<env> | manageReportsTest_thor |
| Visual NPM script | visualAcceptance_<feature>_<env> | visualAcceptance_manageReports_thor |

---

### 8. `tooling/` — Design-Time Scaffolding (Non-Framework)

The `tooling/` directory at the repo root is **not part of the test framework**.
It contains design-time tooling used by Claude Code during development (e.g.,
the Playwright MCP server for live page exploration and selector capture).

**Rules:**
- Nothing under `tooling/` may be `require()`-d by any framework file
- Nothing under `tooling/` belongs in `core/`, `pages/`, `test/`, or `testResources/`
- Browser/session artifacts under `tooling/playwright-mcp/.profile/` are gitignored
  and must never be committed
- See `tooling/playwright-mcp/README.md` for usage instructions

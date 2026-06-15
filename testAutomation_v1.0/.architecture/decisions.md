# Architectural Decision Records

> Each decision documents WHY the architecture is the way it is.  
> New decisions append to the end. Do not delete deprecated decisions — mark them as `Deprecated`.

---

## ADR-001: JSON-Driven Test Execution

**Status:** Accepted  
**Context:** The framework needs to execute different combinations of test cases with different data across multiple environments without duplicating test logic. Manual test composition in code leads to maintenance burden and environment-specific test files.  
**Decision:** Test execution flow is defined entirely in JSON files (`testExecutionFiles/<env>/*.json`). Each execution file specifies Suites containing Before/Test/After hooks, where each hook references a test case ID, test file path, and test data source.  
**Rationale:** JSON-driven execution separates orchestration from logic. The same test case function can be reused across dozens of execution files with different data. Adding a new test flow requires zero code changes — only a new JSON file.  
**Consequences:**  
- Every test case ID in an execution file MUST be registered in `C1TCRepository.json`  
- Test data resolution relies on `jsonPath` traversal of data JSON files  
- The `testrunner.js` is the single point of execution — all test composition flows through it  
- Debugging requires understanding both the execution JSON and the test code it references  

---

## ADR-002: Externalized Selector Registry

**Status:** Accepted  
**Context:** CSS/XPath selectors change frequently as the application UI evolves. Hardcoding selectors in page objects creates a maintenance nightmare — a single selector change requires modifying code files.  
**Decision:** All selectors are stored in a single JSON file (`C1Selectors.json`) organized by page name. Page objects load selectors via `jsonParserUtil.jsonParser(selectorDir)` and access them as `selectorFile.css.ComproC1.<page>.<element>`.  
**Rationale:** Centralizing selectors means a UI change requires updating exactly one JSON file. The `selectorDir` global is resolved at runtime from `C1TCRepository.json`, allowing different selector files per module if needed.  
**Consequences:**  
- Page objects MUST NOT contain hardcoded selector strings  
- Adding a new page requires adding a new section in `C1Selectors.json`  
- Selector naming must follow `css.ComproC1.<camelCasePage>.<camelCaseElement>` convention  
- `[ASSUMED]` The `selectorDir` is currently set globally via the TC repository's `selectorFile` field and overridden per-TC by `testrunner.js`  

---

## ADR-003: Page Object Pattern with Action Library Indirection

**Status:** Accepted  
**Context:** Direct WebDriverIO API calls scattered across test files would create tight coupling to the automation framework version and make error handling/logging inconsistent.  
**Decision:** All browser interactions go through `baseActionLibrary.js` which wraps WebDriverIO commands with consistent error handling, logging, and scroll-into-view behavior. Page Objects are the only consumers of the action library.  
**Rationale:** This provides a single point to add logging, retry logic, or framework-version migration. The Page Object pattern isolates DOM structure knowledge from test logic.  
**Consequences:**  
- Test cases MUST NOT use `$()`, `$$()`, or `browser.*` commands directly  
- Every new browser interaction type must be added to `baseActionLibrary.js`  
- Page Object methods follow patterns: `click_<element>()`, `set_<element>()`, `getData_<section>()`  
- Navigation-triggering clicks MUST call the destination page's `isInitialized()` to confirm transition  

---

## ADR-004: CommonJS Module System

**Status:** Accepted  
**Context:** The framework was built with Node.js CommonJS modules. WebDriverIO v7 supports both CommonJS and ESM.  
**Decision:** All application code uses CommonJS (`module.exports = {}`, `require()`). No ES module syntax (`import`/`export`).  
**Rationale:** Consistency with the existing codebase. Lazy `require()` calls inside methods (e.g., `require('./dashboard.page').isInitialized()`) enable circular dependency avoidance for page navigation chains.  
**Consequences:**  
- All new files MUST use `"use strict"` + `module.exports = {}`  
- Page navigation chains use lazy `require()` inside click methods, not top-level imports  
- No `import` statements anywhere in the codebase  

---

## ADR-005: Global Variables for Cross-Cutting Concerns

**Status:** Accepted  
**Context:** Logger, assertion library, stack trace utility, environment config, and JSON parser are needed across all layers. Passing them as parameters would pollute every function signature.  
**Decision:** Cross-cutting utilities are set as Node.js `global` variables in `wdio.conf.js` and `env.conf.js`: `logger`, `stackTrace`, `assertion`, `jsonParserUtil`, `argv`, `appUrl`, `selectorDir`, `path`, `moduleOff`.  
**Rationale:** WebDriverIO's architecture already uses globals (`browser`, `$`, `describe`, `it`). Extending this pattern for framework utilities keeps function signatures clean and consistent.  
**Consequences:**  
- New globals MUST be documented in `system.md` Runtime Structure  
- Global state means tests are not parallelizable within a single WDIO worker (each worker gets its own globals)  
- `assertion` can be a noop when `argv.skipAssertion=true` (visual test mode)  

---

## ADR-006: Environment-Specific Data Separation

**Status:** Accepted  
**Context:** The same test logic runs against `thor`, `qa`, `rel`, and `production` environments, each with different URLs, user accounts, and UI content.  
**Decision:** Environment-specific data is isolated in directory trees: `testcaseData/<env>/`, `testExecutionFiles/<env>/`. Environment URLs and config are in `env.json` under `<appType>.environments.<env>`.  
**Rationale:** A single test case function works across all environments. The execution file and test data determine environment-specific behavior without code changes.  
**Consequences:**  
- Adding a new environment requires: entry in `env.json`, new directories under `testcaseData/` and `testExecutionFiles/`, copies of relevant data/execution files  
- Login credentials are environment-specific (in `logindata.json` per env)  
- NPM scripts in `package.json` encode the environment via `--testEnv=<env>`  

---

## ADR-007: TC Repository as Single Source of Truth for Test Metadata

**Status:** Accepted  
**Context:** The test runner needs to know test case names, descriptions, tags, visual test flags, and which selector file to use — metadata that doesn't belong in the test code itself.  
**Decision:** `C1TCRepository.json` serves as the metadata registry. Every test case in every test file MUST have a corresponding entry. The test runner validates this at runtime and throws if a TC ID is missing.  
**Rationale:** Centralized metadata enables features like: module-level skip (`moduleOff`), automatic test naming in Mocha `it()` blocks, visual test tagging, and selector file resolution per module.  
**Consequences:**  
- Adding a new test case requires TWO changes: the test file AND the TC repository entry  
- Missing TC repository entries cause runtime errors: `"Cannot find <tcId> in the test case repository"`  
- TC description in the repository is the default; execution file `description` overrides it if non-empty  

---

## ADR-008: Assertion Skip Mode for Visual Testing

**Status:** Accepted  
**Context:** Visual regression tests capture screenshots at each test step. Functional assertions would cause premature test failures that prevent screenshot capture.  
**Decision:** The `baseAssertionLibrary.js` evaluates `argv.skipAssertion` at module load time. When `true`, all assertion functions become noops. This is activated via CLI: `--skipAssertion=true`.  
**Rationale:** Allows the same test execution flow to serve both functional testing (assertions active) and visual baseline capture (assertions skipped).  
**Consequences:**  
- Visual test runs will never fail on assertion errors — only on element interaction failures  
- The `--visual=novus` flag triggers screenshot comparison via `visualTest.js`  
- Visual test tags in TC repository (`"visualTest": true`) control which TCs generate screenshots  

---

## ADR-009: Action Library Returns true/Error Pattern

**Status:** Accepted  
**Context:** Browser interactions can fail (element not found, not clickable, timeout). The framework needs a consistent way to communicate success/failure without throwing exceptions that break the test flow prematurely.  
**Decision:** `baseActionLibrary` methods return `true` on success and the caught `Error` object on failure. Page Objects check `if (true == res)` to determine success.  
**Rationale:** This allows Page Objects to log failures and still return meaningful results to Test Cases, which can then assert on the result. It prevents unhandled exceptions from crashing the entire suite.  
**Consequences:**  
- Page Objects MUST check `if (true == res)` — not truthy checks (Error objects are truthy)  
- Strict equality `==` is used throughout (not `===`) — this is an established convention, do not change  
- Error details are logged by the action library; Page Objects log the contextual failure message  

---

## ADR-010: Browser Session Reload Between Suites

**Status:** Accepted  
**Context:** Suites within an execution file may test different user flows (e.g., login as student vs teacher). Browser state from a previous suite (cookies, localStorage) can contaminate the next suite.  
**Decision:** `testrunner.js` calls `browser.reloadSession()` before each suite (except the first). This gives each suite a clean browser state.  
**Rationale:** Ensures test isolation between suites without the overhead of restarting the entire WebDriverIO process.  
**Consequences:**  
- Each suite's `Before` hooks must handle their own navigation and login  
- State cannot be shared across suites (cookies, session storage are reset)  
- The first suite uses the initial session; subsequent suites get fresh sessions  

---

## ADR-011: Reuse Test Cases via Execution File Composition  

**Status:** Accepted  
**Context:** Many test flows share common steps (launch URL → landing → login → dashboard). Duplicating these steps as separate test cases per flow would create massive code duplication.  
**Decision:** Test case functions are atomic, reusable units. Execution files compose flows by referencing the same TC IDs in `Before` hooks. For example, `launchUrl` + `TST_LAND_TC_3` + `TST_LOGI_TC_1/2/5` is the standard login flow reused across 20+ execution files.  
**Rationale:** Write once, reuse everywhere. The login flow exists as 4 test case functions that are composed in execution JSON. New features only need new TCs for genuinely new steps.  
**Consequences:**  
- Test Cases must be designed as independent, composable units  
- Test Cases should not assume they run in a specific order unless documented  
- The `Before` section of execution files is effectively a "setup" script built from existing TCs  
- New test flows should ALWAYS check for existing TCs before creating new ones  

---

## ADR-012: Playwright as a Library under standalone Mocha

**Status:** Accepted (2026-06-11)
**Context:** WebDriverIO v7 was the automation driver. We wanted Playwright's modern,
auto-waiting locator engine, tracing, and standalone `expect` — without losing the
JSON-driven execution engine (ADR-001/007/011) that is the heart of the framework.
**Decision:** Adopt Playwright used **as a library** (`require('playwright')`) driven
by **standalone Mocha**. We deliberately do **NOT** use `@playwright/test`: it is itself
a runner and would replace Mocha and break the JSON engine.
- **Cherry-picked from `@playwright/test`:** standalone `expect` (auto-retrying
  assertions, wrapped in baseAssertionLibrary), Playwright tracing (`--trace`), and
  (Phase 3) `pixelmatch` for visual compare.
- **Consciously gave up:** fixtures, workers/parallelism, `toHaveScreenshot`, and the
  built-in HTML reporter. (Mochawesome provides a Java-free HTML report instead.)
**Consequences:**
- One browser per run; a NEW context + page per suite (replaces `reloadSession()`).
- New globals `page`/`$`/`$$`/`browser` published by `core/runner/playwright.setup.js`.
- A `node core/runner/run.js` entry point replaces the `wdio` binary; `.mocharc.js`
  holds Mocha config; argv parsed by yargs in env.conf.js (no Mocha CLI collision).
- Cloudflare (qa/rel) headers via context `extraHTTPHeaders` (replaces WDIO CDP hack).
- Cloud execution (LambdaTest/BrowserStack) and visual (Novus/Applitools) are Phase 3.

### Amendments triggered by ADR-012

**ADR-003 (amended 2026-06-11):** the action library now wraps Playwright
`page.locator()`. *Deprecated wording: "Wraps WebDriverIO `$()` commands."* Method
names, parameters, and the true/Error return contract (ADR-009) are unchanged.

**ADR-005 (amended 2026-06-11):** new globals `page`, `$`, `$$`, `browser` are set by
`playwright.setup.js`. `$`/`$$` are Playwright-locator factories; `browser` is the
Playwright Browser (with WDIO-compat helpers like `browser.pause` attached).
*Deprecated wording: "`browser`, `$`, `$$` … set by WDIO."* Note: the per-suite
BrowserContext is held on `global.__pwContext` because `context` is reserved by
Mocha's BDD interface.

**ADR-008 (amended 2026-06-11):** standalone `expect` from `@playwright/test` replaces
Chai inside baseAssertionLibrary. The `skipAssertion` noop-at-module-load behaviour is
unchanged. *Deprecated wording: "Wraps Chai assertions."*

**ADR-010 (amended 2026-06-11):** context-per-suite replaces `browser.reloadSession()`.
*Deprecated wording: "`testrunner.js` calls `browser.reloadSession()` before each suite."*
Each later suite closes its context and opens a fresh one (same isolation intent).

**ADR-009 (clarified 2026-06-13):** the true/Error return contract is the rule, but a
few *data-returning* getters intentionally return richer values that page objects read
directly. `getCSSProperty(selector, prop)` returns `{ property, value, parsed }`, where
`parsed` is produced by `parseCssValue()` — colours give `{ type:'color', rgba, hex }`
and lengths give `{ type:'number', value, unit, string }`. This preserves the WDIO
shape that page objects consume via `.parsed.hex` / `.parsed.rgba` (e.g. NEMO-24388
wizard hover-colour checks, eBook colour check). When porting a colour/size assertion,
read `.parsed.*`, not the raw object.

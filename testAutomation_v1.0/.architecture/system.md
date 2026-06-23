# System Architecture — Living Blueprint

> Last updated: 2026-05-19

---

## System Overview

This is a **Playwright-as-a-library + Mocha end-to-end test automation framework** for the Cambridge One (C1) digital learning platform (migrated from WebDriverIO v7 — Prompt 4 / ADR-012). It automates browser-based functional, accessibility, and visual regression testing across multiple environments (thor, qa, rel, production) using a JSON-driven, data-separated architecture. Cloud execution runs on LambdaTest's Playwright grid; visual regression uses a pixelmatch engine feeding a custom timeline report.

**Core Purpose**: Execute parameterized test suites against web applications by composing reusable test case functions with externalized selectors, test data, and execution orchestration — all without modifying core framework code.

**Multiple applications (`appType`)** _(2026-06-15)_: the framework is multi-application — `--appType`
selects the target app and the **entire directory tree + selector namespace is keyed by it**
(`pages/<App>/`, `test/<App>/`, `selectors/<App>/`, `css.<App>`, an `env.json` block, etc.). Two
apps exist today: **`ExperienceApp`** (Cambridge One / C1, `css.ComproC1`) and **`Builder`**
(comproDLS Builder, `css.Builder`). Adding an app is **additive scaffolding only — no core changes**
(see AGENTS.md §7 and ADR-013). Paths below show `ExperienceApp/`; substitute the active appType.

**Tech Stack** _(updated 2026-06-15 — Prompt 4 / ADR-012: WebDriverIO → Playwright-as-library + Mocha; Phase 3 LambdaTest + visual testing complete)_:
- Runtime: Node.js
- Test Framework: **standalone Mocha** (entry: `core/runner/run.js`; config: `.mocharc.js`)
- Browser Automation: **Playwright used as a library** (`require('playwright')`, NOT `@playwright/test`)
- Assertions: **standalone `expect` from `@playwright/test`** (import only, wrapped in `baseAssertionLibrary.js`) — Chai removed
- Reporting: **Mochawesome HTML is the DEFAULT** (inline screenshots; opt out with `--report=spec`/`allure`); Playwright tracing via `--trace`
- Visual Testing (done 2026-06-15): `page.screenshot()` + `pixelmatch`/`pngjs` (`core/utils/visualCompare.js`) feeding the custom **timeline report** (`core/utils/visual-report-utility`), via `--visual=novus`; Applitools ported to lazy `eyes-playwright` via `--visual=applitools`
- CI Runners: local Playwright Chromium/Chrome; cloud on **LambdaTest's Playwright grid** (done 2026-06-15, `--browserCapability=lambdatest-*`). BrowserStack/Appium not yet ported

---

## Layer Responsibilities

### Layer 1: Core Framework (`core/`)

**Owns**: Browser interaction primitives, assertion wrappers, test execution engine, utilities

| Module | Responsibility | Must NOT Do |
|---|---|---|
| `core/actionLibrary/baseActionLibrary.js` | Wraps Playwright `page.locator()` commands (click, setValue, getText, waitFor*, getAttribute, getCSSProperty, etc.) with logging and error handling | Contain page-specific logic, know about selectors |
| `core/actionLibrary/baseAssertionLibrary.js` | Wraps Playwright `expect` (standalone, from @playwright/test) with logging; supports `skipAssertion` mode | Contain test-specific validation logic |
| `core/runner/testrunner.js` | Parses execution JSON, resolves test data, invokes Mocha describe/it blocks, manages browser sessions | Contain business logic or page knowledge |
| `core/runner/launchUrl.js` | Navigates browser to `appUrl` (global set from `env.json`) | Know specific URLs |
| `core/runner/specGenerator.js` | Instantiates `specRunner` with the execution file | Contain test logic |
| `core/utils/` | Logging (`logger.js`, `loggerFunction.js`), JSON parsing (`jsonParser.js`), CSV utils, reporting, email | Contain test or page logic |

### Layer 2: Page Objects (`pages/ExperienceApp/`)

**Owns**: DOM element references, page-specific interaction methods, page navigation transitions

| Responsibility | Details |
|---|---|
| Selector binding | Properties map to `selectorFile.css.ComproC1.<page>.<element>` |
| DOM interaction | All interactions go through `baseActionLibrary` methods |
| Page lifecycle | `isInitialized()` waits for a key element to confirm page is ready |
| Navigation chaining | Click methods that navigate call the next page's `isInitialized()` |
| Data extraction | `getData_*()` methods return objects with element text/attributes |
| Logging | Every method logs entry via `logger.logInto(stackTrace.get())` |

**Must NOT**: Contain assertions, know about test data structure, reference other page's selectors directly

> **Escape hatch — when `baseActionLibrary` or the selector JSON can't express an interaction.**
> Some interactions have no library method (e.g. `page.mouse.move`, `page.evaluate` to read a
> card's text, `nth()` by DOM order); some locators cannot be a static CSS string (a DOM-order
> `nth()`, or a `:has-text()` assembled from a runtime value). Do **NOT** work around this by
> inlining raw `global.page.*` calls or selector string literals inside a page object — that is
> exactly what Rules 2 & 4 (AGENTS.md) forbid. Instead:
> 1. **Add the interaction to `baseActionLibrary.js`** as a named, logged method. It is a
>    protected file, so follow the protected-file confirmation protocol — see ADR-003
>    ("new interaction types must be added to the action library").
> 2. **Keep the locator in the selector JSON** when it can be a string. When it genuinely
>    cannot, build it *inside* the action-library method, not in the page object.
>
> Net effect: page objects stay free of raw `page.*` and selector literals, and every new
> low-level capability lands in one reviewed place. (`browser.pause` / `browser.url` and the
> other documented WDIO-compat helpers on `browser` remain allowed in page objects.)

### Layer 3: Test Cases (`test/ExperienceApp/`)

**Owns**: Test logic — calling Page Object methods and asserting results

| Responsibility | Details |
|---|---|
| Function signature | `TST_XXXX_TC_N: async function (testdata) { ... }` |
| Orchestration | Calls page object methods, passes test data |
| Assertions | Uses global `assertion.assertEqual()`, `assertion.assert()` |
| Naming | IDs follow `TST_<4CHAR>_TC_<N>` pattern |

**Must NOT**: Directly use `$()`, `browser.*`, raw selectors, or `require` baseActionLibrary

### Layer 4: Test Resources (`testResources/`)

**Owns**: All externalized configuration — selectors, test data, execution orchestration, TC metadata

| Sub-layer | Path | Format |
|---|---|---|
| Selectors | `selectors/ExperienceApp/C1Selectors.json` | `css.ComproC1.<page>.<element>` → CSS string |
| Test Data | `testcaseData/ExperienceApp/<env>/*.json` | Nested JSON, accessed via `jsonPath` |
| Execution Files | `testExecutionFiles/ExperienceApp/<env>/*.json` | Suite-based JSON with Before/Test/After hooks |
| TC Repository | `testcaseRepository/ExperienceApp/C1TCRepository.json` | Module→testcase registry with metadata |

**Must NOT**: Contain executable code or logic

### Layer 5: Configuration

| File | Purpose |
|---|---|
| `core/runner/run.js` | Mocha entry point — selects reporter (mochawesome default; `--report=spec\|allure`), drives the visual timeline report, runs the suites |
| `core/runner/playwright.setup.js` | Playwright browser lifecycle + all framework globals (the role `wdio.conf.js` held); LambdaTest cloud connect |
| `env.conf.js` | Environment resolution — reads `env.json`, sets globals (`appUrl`, `selectorDir`, `testExecDir`, etc.) |
| `env.json` | Environment URLs and settings per appType/environment |
| `capabilities.json` | Browser capability profiles (desktop-chrome-1920, lambdatest-*, etc.) |
| `package.json` | NPM scripts — one per test suite per environment |

---

## Communication Flow

```
┌─────────────────────────────────────────────────────────────────┐
│ npm run <script>                                                │
│   → node core/runner/run.js --appType --testEnv --testExecFile  │
│       --browserCapability                                       │
└─────────┬───────────────────────────────────────────────────────┘
          ▼
┌─────────────────────────────────────────────────────────────────┐
│ run.js → env.conf.js + playwright.setup.js                      │
│   → Resolves env.json → sets globals (appUrl, selectorDir...)   │
│   → Loads capabilities.json                                     │
│   → Instantiates specRunner(testExecFile)                       │
└─────────┬───────────────────────────────────────────────────────┘
          ▼
┌─────────────────────────────────────────────────────────────────┐
│ testrunner.js (specRunner)                                      │
│   → Parses execution JSON (Suite → Before/Test/After)           │
│   → For each step:                                              │
│       1. Resolve TC properties from C1TCRepository.json         │
│       2. Resolve test data from dataFile + jsonPath              │
│       3. require(testFile)[tcId](testdata)                      │
└─────────┬───────────────────────────────────────────────────────┘
          ▼
┌─────────────────────────────────────────────────────────────────┐
│ test/*.test.js (TC Function)                                    │
│   → Calls page.method(testdata)                                 │
│   → assertion.assertEqual(result, expected, message)            │
└─────────┬───────────────────────────────────────────────────────┘
          ▼
┌─────────────────────────────────────────────────────────────────┐
│ pages/*.page.js (Page Object)                                   │
│   → Reads selectors from selectorFile (loaded via selectorDir)  │
│   → Calls action.click(selector), action.setValue(selector, v)  │
│   → Returns result objects { pageStatus, data... }              │
└─────────┬───────────────────────────────────────────────────────┘
          ▼
┌─────────────────────────────────────────────────────────────────┐
│ baseActionLibrary.js                                            │
│   → action.click(sel), action.setValue(sel, v), etc.            │
│   → Logs via logger, returns true/Error                         │
└─────────────────────────────────────────────────────────────────┘
```

---

## Runtime Structure

### Global Variables (set by `core/runner/playwright.setup.js` / `env.conf.js`) — updated 2026-06-11 (ADR-012)

| Global | Type | Set By | Purpose |
|---|---|---|---|
| `page` | Playwright Page | playwright.setup.js | The current page (per-suite context) |
| `browser` | Playwright Browser | playwright.setup.js | Browser handle + WDIO-compat helpers (`browser.pause`, `browser.url`, …) |
| `$` / `$$` | Function | playwright.setup.js | `page.locator(sel)` factories (`.all()` for lists) |
| `__pwContext` | Playwright BrowserContext | playwright.setup.js | Current context (named `__pwContext` because `context` is reserved by Mocha BDD) |
| `describe`, `it`, `before`, `after` | Function | Mocha | Test lifecycle |
| `appUrl` | String | env.conf.js | Target URL from `env.json` |
| `headers` | Object | env.conf.js | Cloudflare access headers (qa/rel) → context `extraHTTPHeaders` |
| `selectorDir` | String | env.conf.js / testrunner | Path to selector JSON file |
| `testExecDir` | String | env.conf.js | Path to execution files directory |
| `argv` | Object | yargs (env.conf.js) | CLI arguments (appType, testEnv, testExecFile, trace, report, headless …) |
| `logger` | Object | testrunner.js (loggerFunction) | Winston-based logger |
| `stackTrace` | Object | env.conf.js | Stack trace utility |
| `assertion` | Object | env.conf.js | Assertion library (Playwright `expect`; noop if `skipAssertion=true`) |
| `jsonParserUtil` | Object | env.conf.js | JSON file parser utility |
| `moduleOff` | Object | env.conf.js | Module skip flags from env.json |
| `path` | Module | env.conf.js | Node.js path module |

### Execution Lifecycle

1. **Session Init**: `run.js` → `env.conf.js` resolves environment → `playwright.setup.js` launches browser (or connects to LambdaTest)
2. **Suite Iteration**: `testrunner.js` → iterates `Suite1`, `Suite2`... from execution JSON
3. **Before Hooks**: Executes `Before[]` steps sequentially (launchUrl, login, navigate)
4. **Test Execution**: For each `Test[]` step → `describe/it` → calls TC function with resolved testdata
5. **After Hooks**: Executes `After[]` steps (logout, cleanup)
6. **Session Teardown**: Browser session closed; next suite gets `browser.reloadSession()`

---

## Module Boundaries

### Selectors Module (`testResources/selectors/<App>/<App>Selectors.json`)

- **Exposes**: CSS/XPath selector strings organized by page name
- **Hides**: Nothing — pure data
- **Contract**: Every page object property MUST resolve to a key in this file
- **Naming**: `css.<App>.<camelCasePageName>.<camelCaseElementName>`
- **One file per app, one `css.<App>` namespace** (ADR-002 / ADR-013) — never mix two apps in
  one file, never place a module at the JSON root.

**Directory layout (both apps):**

```
testResources/selectors/
  ExperienceApp/C1Selectors.json     → namespace css.ComproC1   (+ csv/ = legacy CSV exports, not runtime source)
  Builder/BuilderSelectors.json      → namespace css.Builder
```

`C1Selectors.json` (ExperienceApp / Cambridge One):
```json
{ "css": { "ComproC1": {
  "footer":        { "footerTermsOfUse": "a[qid=\"cFooter-1\"]" },
  "manageReports": { "submitBtn": "[qid=\"mr-submit\"]" }
} } }
```

`BuilderSelectors.json` (comproDLS Builder):
```json
{ "css": { "Builder": {
  "preLogin":   { "orgSelect": "#selectedOrg", "loginBtn": "button[type='submit']" },
  "components": { "searchInput": "#search", "itemLink": "a[href='javascript:void(0);']" }
} } }
```

A page object reads only its own app's namespace —
`selectorFile.css.ComproC1.footer.footerTermsOfUse` or `selectorFile.css.Builder.components.searchInput`.
The top-level `css` object is an **application-namespace** layer (`css → { ComproC1, Builder, … }`);
a new app adds a sibling namespace and can never collide with another app's modules.

### Page Object Module (each `*.page.js`)

- **Exposes**: `isInitialized()`, `click_*()`, `set_*()`, `getData_*()` methods
- **Hides**: Selector resolution details, DOM interaction mechanics
- **Contract**: Methods return `true` (success), `Error` (failure), or `{ pageStatus, ...data }` objects
- **Dependencies**: `baseActionLibrary`, `selectorFile`, optionally other page objects (via lazy `require`)

### Test Case Module (each `*.test.js`)

- **Exposes**: `TST_XXXX_TC_N` async functions
- **Hides**: Nothing — pure orchestration
- **Contract**: Each function accepts `testdata`, calls page methods, runs assertions
- **Dependencies**: Corresponding page object(s), global `assertion`

### Execution File (each `*.json`)

- **Exposes**: Suite structure with `Before/BeforeEach/Test/AfterEach/After` arrays
- **Hides**: Nothing — pure configuration
- **Contract**: Every `id` must exist in `C1TCRepository.json`; every `testFile` must be a valid path
- **Dependencies**: TC Repository, test data files, test files

### TC Repository (`C1TCRepository.json`)

- **Exposes**: Module→testcase mapping with `id`, `description`, `tags`, `visualTest`, `selectorFile`
- **Hides**: Nothing — metadata registry
- **Contract**: Source of truth for TC names, skip/module-off behavior, selector file resolution
- **Invariant**: `selectorFile` at root level defines the default selector file for all modules

---

## Protected Files

The following JS and configuration files are the architectural backbone of the framework.
They MUST NOT be modified without explicit user confirmation. Any AI agent or developer
must follow the confirmation protocol defined in `AGENTS.md` before touching these files.

> **`AGENTS.md` ("Protected Files") is the authoritative list and holds the exact confirmation
> format.** The table below mirrors it for blueprint context — if the two ever diverge,
> AGENTS.md wins, and the divergence should be fixed.

> JSON files (selectors, test data, execution files, TC repository) are NOT protected —
> they are data/configuration and may be edited freely as part of normal work.

| File | Layer | Impact of a Wrong Change |
|---|---|---|
| `.mocharc.js` | Configuration | Breaks Mocha configuration / all test execution |
| `core/runner/playwright.setup.js` | Core | Owns the Playwright browser lifecycle + all globals — breaks every run |
| `core/runner/run.js` | Core | The Mocha entry point — breaks all execution |
| `env.conf.js` | Configuration | Breaks environment resolution and all global variables |
| _`wdio.conf.js`_ | _Retired_ | _Replaced by Playwright/Mocha (ADR-012); hard-deleted (recoverable from git history)_ |
| `core/actionLibrary/baseActionLibrary.js` | Core | Breaks every page object in the framework |
| `core/actionLibrary/baseAssertionLibrary.js` | Core | Breaks every assertion in every test case |
| `core/runner/testrunner.js` | Core | Breaks all test runs |
| `core/runner/specGenerator.js` | Core | Breaks spec execution entry point |
| `core/runner/launchUrl.js` | Core | Breaks browser navigation to the application |

---

## Dependency Rules

### Allowed Dependencies (→ means "may depend on")

```
Execution JSON → TC Repository, Test Data JSON, Test Files
Test Cases     → Page Objects, global assertion
Page Objects   → baseActionLibrary, selectorFile, other Page Objects (lazy require)
baseActionLibrary → Playwright page.locator() (via $/$$), browser, logger
```

### Forbidden Dependencies

```
Test Cases     ✗→ baseActionLibrary (must go through Page Objects)
Test Cases     ✗→ selectorFile (must go through Page Objects)
Test Cases     ✗→ browser.* directly (except browser.pause for timing)
Page Objects   ✗→ assertion / chai (assertions belong in Test Cases)
Page Objects   ✗→ test data structure knowledge (receive data as params)
Execution JSON ✗→ executable code (pure JSON config only)
Core Framework ✗→ page-specific or test-specific knowledge
```

### Environment Independence

- Page Objects, Test Cases, and Core are **environment-agnostic**
- Environment-specific values (URLs, credentials, module flags) live ONLY in:
  - `env.json` (URLs, moduleOff flags)
  - `testcaseData/<env>/` (test data per environment)
  - `testExecutionFiles/<env>/` (execution files per environment)

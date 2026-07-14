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
**Application-namespace layering (clarified 2026-06-15):** the top-level `css` object is an
**application namespace** layer — `css → { ComproC1, <future app>, … }`. Every C1 module MUST
live under `css.ComproC1`, **never at the JSON root**. This is deliberate: a second application
can be bifurcated later by adding a sibling namespace (e.g. `css.VHL` next to `css.ComproC1`)
without colliding with C1 modules. Root-level module keys are a bug — relocate them under
`css.ComproC1`. (The retired VHL feature had stray root keys; on its removal the remaining
school-admin modules were moved back under `css.ComproC1`.)

**Consequences:**  
- Page objects MUST NOT contain hardcoded selector strings  
- Adding a new page requires adding a new section **under `css.ComproC1`** in `C1Selectors.json`  
- Selector naming must follow `css.ComproC1.<camelCasePage>.<camelCaseElement>` convention  
- `[ASSUMED]` The `selectorDir` is currently set globally via the TC repository's `selectorFile` field and overridden per-TC by `testrunner.js`  

---

## ADR-003: Page Object Pattern with Action Library Indirection

**Status:** Accepted  
> ⚡ **CURRENT STATE (read first).** The action library wraps Playwright `page.locator()`, not
> WebDriverIO `$()`; method names, parameters and the `true`/`Error` contract are unchanged. Data
> getters return a rich object — read `.parsed.hex`/`.parsed.rgba` (ADR-009). Amended 2026-06-11
> (ADR-012), getter note 2026-06-13. The body below is the original rationale, kept for history.
**Context:** Direct WebDriverIO API calls scattered across test files would create tight coupling to the automation framework version and make error handling/logging inconsistent.  
**Decision:** All browser interactions go through `baseActionLibrary.js` which wraps WebDriverIO commands with consistent error handling, logging, and scroll-into-view behavior. Page Objects are the only consumers of the action library.  
**Rationale:** This provides a single point to add logging, retry logic, or framework-version migration. The Page Object pattern isolates DOM structure knowledge from test logic.  
**Consequences:**  
- Test cases MUST NOT use `$()`, `$$()`, or `browser.*` commands directly  
- **Page objects MUST NOT inline raw `global.page.*` / Playwright locator calls or selector
  string literals to dodge a missing capability.** If `baseActionLibrary` lacks a method
  (e.g. `mouse.move`, an `evaluate`-based read, an `nth()` locator by DOM order), the fix is to
  add a named, logged method to `baseActionLibrary.js` — not an ad-hoc page-object hack. That
  file is **protected**, so this is a deliberate, confirmed change (protected-file protocol in
  AGENTS.md). The protected status is the point: every low-level capability is reviewed in one
  place. Likewise, a locator that cannot be a static CSS string is built *inside* that method,
  not in the page object.  
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
> ⚡ **CURRENT STATE (read first).** Globals `page`/`$`/`$$`/`browser` are set by `playwright.setup.js`
> (`$`/`$$` are Playwright-locator factories; `browser` carries WDIO-compat helpers like `browser.pause`);
> the per-suite context lives on `global.__pwContext`. The globals-for-cross-cutting rationale is
> unchanged. Amended 2026-06-11 by ADR-012. The body below is the original rationale, kept for history.
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
> ⚡ **CURRENT STATE (read first).** Assertions use standalone `expect` from `@playwright/test` (wrapped
> in `baseAssertionLibrary`), not Chai; the `skipAssertion` noop-at-load behaviour is unchanged.
> Amended 2026-06-11 by ADR-012. The body below is the original rationale, kept for history.
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
> ⚡ **CURRENT STATE (read first).** The `true`/`Error` contract still holds — check `if (true == res)`.
> Exception: data-returning getters give a rich object; read `.parsed.*` (e.g. `getCSSProperty(...).parsed.hex`
> / `.parsed.rgba`), not the raw value. Clarified 2026-06-13. The body below is the original rationale, kept for history.
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
> ⚡ **CURRENT STATE (read first).** Suite isolation is now context-per-suite (each later suite closes its
> context and opens a fresh one); the cloud path uses a fresh per-suite LambdaTest session. `browser.reloadSession()`
> is retired; the isolation intent is unchanged. Amended 2026-06-11 by ADR-012. The body below is the original rationale, kept for history.
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

**ADR-007/D7 (Phase 3 — LambdaTest enabled 2026-06-15):** cloud execution now works via
the **LambdaTest Playwright grid**, NOT the Selenium `/wd/hub` endpoint WDIO used. When the
active capability has `webDriverService === "lambdatest"`, `playwright.setup.js` builds
`wss://cdp.lambdatest.com/playwright?capabilities=<encoded JSON>` (browserName /
browserVersion + `LT:Options` carrying `user`/`accessKey`/`platform`/`build`/`name` /
`playwrightClientVersion`, derived from the capability profile + `LT_USERNAME`/`LT_ACCESS_KEY`)
and calls `chromium.connect(wsEndpoint)` instead of `chromium.launch()`. `run.js`'s cloud
guard now allows `chromedriver` + `lambdatest` (BrowserStack/Appium still gated). Credentials
come from env vars or `env.json -> lambdaTestCredentials`. Run with
`--browserCapability=lambdatest-chrome-1920`. *Deprecated wording: the `/wd/hub`, `hostname`,
`portNumber` fields in the lambdatest capability profile are Selenium-era and unused by Playwright.*

**Per-suite sessions + status (restored 2026-06-15):** to mirror WDIO's `reloadSession()`
(one LambdaTest session per suite, each named + pass/fail), the cloud path does NOT use the
local context-per-suite model. Each suite opens its OWN `chromium.connect()` with a per-suite
`name` (`global.__ltSessionName`, e.g. `landingTest - Suite1 - <Name>`): `beforeAll` connects
suite 0, and `global.lambdaTestRotateSession()` (called from `testrunner.js` per later suite)
reports the previous suite's status, closes it, and connects the next. Status is reported to the
dashboard via the documented `page.evaluate(() => {}, 'lambdatest_action: {"action":"setTestStatus",
"arguments":{"status":"passed|failed",...}}')` command — pass/fail is tracked per suite in the
`afterEach` hook (`global.__ltSuiteFailed`) and reported on rotate + in `afterAll` (last suite).
Local (chromedriver) runs keep context-per-suite (one browser).

**ADR-008/D7 (Phase 3 — visual testing ported 2026-06-15):** the WDIO novus
`browser.checkDocument()` (wdio-novus-visual-regression-service) is replaced by a
Playwright-native pixelmatch engine in `core/utils/visualCompare.js`: `page.screenshot({fullPage})`
→ pixelmatch/pngjs diff vs baseline → bootstrap baseline on first run → write diff on mismatch →
return the same resemble-style `[{ misMatchPercentage, isWithinMisMatchTolerance, isSameDimensions,
isExactSameImage }]`. Screenshot naming (`${suiteKey}-${pad2(tcNumber)}-${tcId}.png` under
`testFileName/`) is reproduced from the retired novus `getScreenshotName`. `visualTest.js` keeps its
report/merge logic but drops the WDIO `browser.call()`/`browser.checkDocument()` wrappers. The custom
timeline report (`core/utils/visual-report-utility`) is driver-agnostic and reused as-is; its
`onPrepare()`/`onComplete()` hooks (formerly WDIO service hooks) are now invoked from `run.js`,
gated on `--visual=novus`. Applitools is ported to the lazy-loaded `@applitools/eyes-playwright`
SDK on the `--visual=applitools` path (requires `npm i -D @applitools/eyes-playwright` +
`APPLITOOLS_API_KEY`). Run with `npm run visualAcceptance_<env>`.

**Baseline ownership (decided 2026-06-15):** visual baselines are **NOT committed**.
`screenshots/baseline/` (along with the per-run `screen/` and `diff/`) is git-ignored.
Each environment / CI runner (e.g. Semaphore) and each engineer generates and owns their
own baselines locally — the first `--visual=novus` run bootstraps them. *Rationale:* cross-machine
font/anti-aliasing/GPU rendering differences make a single committed baseline unreliable as the
shared reference; owning baselines per runner avoids false diffs. *Trade-off:* a fresh checkout has
no baselines, so the first visual run is a bootstrap (everything "passes" as new) — re-run to get a
real comparison.

---

## ADR-013: Multiple Applications via `appType`

**Status:** Accepted (2026-06-15)
**Context:** The framework was built to test more than one comproDLS application. A second app
(**Builder**, comproDLS Builder) needed to be added alongside **ExperienceApp** (Cambridge One / C1).
**Decision:** Applications are selected by the `--appType` CLI argument, and **every layer is keyed by
appType** — there is NO core-framework change to add an app. Adding an app means creating its parallel
tree: `pages/<App>/`, `test/<App>/`, `testResources/selectors/<App>/<App>Selectors.json` (with a
dedicated **`css.<App>`** namespace — ADR-002), `testResources/testcaseData/<App>/<env>/`,
`testResources/testExecutionFiles/<App>/<env>/`, `testResources/testcaseRepository/<App>/<App>TCRepository.json`
(whose `selectorFile` points at the app's selector file), and an `env.json` block
`"<App>": { "testExecDir", "environments": { <env>: { "url" } } }`. The runner resolves `appUrl`,
`testExecDir`, screenshot dirs (`screenshots/<kind>/<appType>/…`) and `selectorDir` (via the TC
repository) entirely from `argv.appType` + `env.json`.
**Rationale:** appType-keyed paths keep each application's selectors, data, and tests fully isolated,
so a new app can never collide with C1 and core files stay app-agnostic. Proven by Builder Phase 1
(login smoke) with zero edits to `run.js` / `testrunner.js` / `env.conf.js` / `playwright.setup.js`.
**Consequences:**
- Each app owns its selector file + `css.<App>` namespace; never mix two apps in one file.
- New-app credentials follow the existing plaintext-in-data-file convention for now (e.g.
  `builderLoginData.json`) — to be hardened to env vars later, same as LambdaTest.
- App login flows can differ wildly: Builder uses a **3-step cross-domain SSO** (pre-login org
  select → confirm → comproDLS Identity username/password → `/2024/dashboard`). Two reusable
  lessons from it: type credentials with `addValue`/`pressSequentially` (React/Angular IdP forms
  ignore `fill()`'s value), and wait for each page transition when a selector (`button[type=submit]`)
  repeats across steps.
- Unused appType stubs were removed from `env.json` (backoffice / assessmentEditor /
  itemPlayerTestbench) — keep `env.json` to apps that actually have a test tree.
- **"Additive only / no core changes" is the goal, not a guarantee.** If extending an app
  exposes a real gap in shared infrastructure (e.g. `browser.url` needing relative-path support,
  the runner needing a per-test `timeout`), a protected-file change is legitimate — but it is
  **not** additive work: it follows the protected-file confirmation protocol (AGENTS.md) and is
  recorded as its own ADR. **ADR-014 is the worked example** of doing this correctly. Do not let
  the "zero core edits" framing above mask that the protected-file rule applies the moment you
  touch `core/` or any other protected file.

---

## ADR-014: Cloudflare Access Headers Are First-Party-Scoped, Never Global

**Status:** Accepted (2026-06-23)

**Context:** Cloudflare-Access-gated environments (qa, rel) require `CF-Access-Client-Id` /
`CF-Access-Client-Secret` headers to reach the app origin. During the WebDriverIO→Playwright
migration (ADR-012, commit `152dbce`) these were applied as Playwright **context-level
`extraHTTPHeaders`**, which attaches them to **every** request the page issues — including
cross-origin calls third-party widgets make. On QA this broke the Gigya login screen-set: its
`cdns.eu1.gigya.com/sdk.config.get` call carried the custom `cf-access-*` headers, the third-party
server rejected them in CORS preflight (*"Request header field cf-access-client-secret is not allowed
by Access-Control-Allow-Headers"*), Gigya failed to initialise (`Cannot read properties of undefined
(reading 'Domain')`), and the login box never painted — every login-dependent suite timed out in its
`Before` hook. The pre-migration WDIO code had injected these headers via a CDP interception helper
(`setupCDPHeaders`) that **scoped them to the first-party host**; the migration dropped that filter.

**Decision:** CF Access headers MUST be injected **only for first-party requests** — those whose host
equals the `appUrl` host or is a subdomain of it. Third-party requests (Gigya, OneTrust, New Relic,
analytics, CDNs) MUST pass through with no custom headers. In `core/runner/playwright.setup.js` this is
implemented with a `context.route('**/*', …)` handler that conditionally merges `global.headers` based
on the request host, instead of context-level `extraHTTPHeaders`.

**Rationale:** Cloudflare Access only guards the app's own origin, so that is the only origin that
needs the credentials. Sending them cross-origin is both unnecessary and actively harmful — custom
request headers force a CORS preflight that third-party servers reject, silently breaking
widget-driven UI (login, consent, telemetry). Host-scoping restores the proven WDIO behaviour while
keeping the idiomatic Playwright routing API.

**Consequences:**
- `extraHTTPHeaders` is forbidden for CF Access (or any auth header that must not leak cross-origin);
  use the first-party route handler in `playwright.setup.js`.
- Host match is `reqHost === appUrlHost || reqHost.endsWith('.' + appUrlHost)` so app subdomains
  (e.g. `login.<app>`) are still covered while unrelated origins are not.
- Applies to every CF-Access-gated env (qa, rel) and any app embedding third-party widgets behind
  CORS — symptom to watch for is a "widget container present but empty" with a CORS preflight error
  naming `cf-access-*` in the console.
- `playwright.setup.js` is a protected file; this change was made with explicit user confirmation.

---

## ADR-015: Blackboard Integration — appType, Selector Namespaces, and Raw Page Escapes

**Status:** Accepted (2026-06-26); **amended 2026-06-30 — A & C corrected to match the shipped
implementation** (see the amendment notes in sub-decisions A and C); **amended 2026-07-01 — the
initial deeplink (IP3/IP4) draft deviated from sub-decision A (mirrored `css.LTI` into
`BlackboardSelectors.json` and listed only the BB TC repo); corrected to the two-file layout — see
the sub-decision A guardrail note.**

**Context:** The Blackboard LTI integration introduced a third `appType` (`Blackboard`) alongside
ExperienceApp and Builder. It has characteristics that don't fit cleanly into existing ADR patterns:
1. Blackboard UI pages and LTI app pages have different authoring concerns; the LTI pages must stay
   portable across LMSs rather than living in a Blackboard-specific namespace.
2. The LTI teacher dashboard and component pages are launched by Blackboard but are Cambridge One
   LTI pages — they should be reusable by any future LMS integration (e.g. Moodle), not tied to
   the Blackboard namespace.
3. New-tab capture has no action-library equivalent and remains a documented escape; the URL-state
   checks and the `Promise.race` `isInitialized` guard were promoted to / wrapped by action-library
   and WDIO-compat methods (see sub-decision C). These are not bugs.

**Decision:** Three sub-decisions:

**A — Separate selector file + TC repository per namespace (`css.Blackboard` vs `css.LTI`):**
> **Amended 2026-06-30.** The original text described a *single* `BlackboardSelectors.json` holding
> both `css.Blackboard` and `css.LTI`, with one `BlackboardTCRepository.json` "pointing at it for
> both." That is **not** how the code shipped, and it contradicts ADR-002/ADR-013 ("one file per
> app, one `css.<App>` namespace — never mix two apps in one file"). The implemented and correct
> arrangement is **two files and two repositories**, described below.

- `testResources/selectors/Integrations/Blackboard/BlackboardSelectors.json` → `css.Blackboard`
  only (BB UI: login, course, course page, launch panel); registered by
  `testResources/testcaseRepository/Integrations/Blackboard/BlackboardTCRepository.json`.
- `testResources/selectors/Integrations/LTI/LTISelectors.json` → `css.LTI` only (shared LTI pages:
  teacher dashboard, component page, PE page, deeplink pages); registered by
  `testResources/testcaseRepository/Integrations/LTI/LTITCRepository.json`.

Page objects under `pages/Integrations/Blackboard/` resolve `selectorFile.css.Blackboard.*`; those
under `pages/Integrations/LTI/` resolve `selectorFile.css.LTI.*`. `selectorDir` is set **per module**
from that module's TC-repo `selectorFile`; Node module-caching means BB page objects (required first)
cache `BlackboardSelectors.json` while LTI page objects (required later) cache `LTISelectors.json`.
Execution files that span both namespaces list **both** TC repos in their `TestCaseRepo` array.
**Rationale:** LTI pages are launched by Blackboard but belong to Cambridge One — `css.LTI` is the
portable namespace for all LTI-hosted app pages, reusable by any future LMS (e.g. Moodle). A
dedicated `LTISelectors.json` keeps that portability **while** honoring the one-namespace-per-file
rule (ADR-002/013).

> **Guardrail (added 2026-07-01, deeplink IP3/IP4).** The per-module `selectorDir` caching only
> holds because **each page object is required by test files of a single namespace**. A page object
> caches `selectorFile` at first `require()`, using whatever `selectorDir` is set at that moment.
> If one page object were required by **both** a `Blackboard/*.test.js` and an `LTI/*.test.js`, it
> would cache whichever ran first and resolve the *wrong* selector file for the other. **Invariant:
> never share a page object across a BB and an LTI test file.** (Verified for deeplink: `bbCoursePage`
> is BB-only; `ltiDeeplinkPage`/`ltiComponentPage` are LTI-only.) The deeplink suites follow this
> pattern — `teacher/studentDeeplinkLaunch_thor.json` list **both** TC repos, and the LTI deeplink
> TCs (`TST_LTI_PEDL_TC_1/2`, `TST_LTI_EBKDL_TC_1`) live in `LTITCRepository.json`. An earlier
> deeplink draft deviated (mirrored `css.LTI` into `BlackboardSelectors.json` + listed only the BB
> repo); that duplication was removed to comply with this sub-decision.

**B — New-tab handling via `global.__pwContext.waitForEvent("page")`:**
`bbCoursePage.click_ltiTool()` registers `const pagePromise = global.__pwContext.waitForEvent("page")`
before clicking the LTI tool link (which opens a new tab). After the new tab loads,
`global.page` is reassigned to it. The old tab stays open on `global.__pwContext` but is unused.
**Rationale:** No action-library method exists for new-tab detection. This is a documented escape
per ADR-003; it is not yet promoted to `baseActionLibrary` because only one call site exists. If a
second integration needs this, promote it to a named, logged method.
**Consequence:** `global.page` is mutable — after IP1 TC1, every subsequent page-object call
operates on the new (LTI) tab, not the original Blackboard tab.

**C — Page escapes in LTI page objects (only new-tab capture remains raw):**
> **Amended 2026-06-30.** The original text listed three "raw `global.page.*` escapes" with "no
> action-library equivalent." Two were promoted and one wrapped — none of these three are raw
> escapes in the shipped code. The corrected classification:

1. `ltiComponentPage.isInitialized()` two-signal guard — implemented as
   `Promise.race([action.waitForDisplayed(...), action.waitForUrl(...)])`. It handles two distinct
   "page ready" signals (PE shows `.product-launch-container`; Ebook redirects directly to a `/foc/`
   URL). `waitForUrl` was added to `baseActionLibrary.js` as a named, logged method — exactly the
   ADR-003-correct promotion. **Not a raw escape.**
2. URL-state checks (`/teacher/`, `/foc/`) — read via `browser.getUrl()` (the WDIO-compat global
   wrapper) then `.includes(...)`, not raw `global.page.url()`. **Not a raw escape.**
3. Return navigation in `returnToDashboard()` — uses `browser.url(url)` (compat wrapper), not raw
   `global.page.goto(url)`, because LTI component pages have no back button to the embedding
   Blackboard context. **Not a raw escape.**

**Net:** the only genuine remaining raw escape is the **new-tab capture in sub-decision B**
(`global.__pwContext.waitForEvent("page")` + `global.page` reassignment), for which no action-library
method exists. Promote it too if a second LMS integration needs it.

**D — Browser launch flag for LTI cross-site cookies is scoped to the `Blackboard` appType
(protected-file change):**
> **Added 2026-06-30.** The LTI 1.3 OIDC handshake sets cross-site cookies during its redirect
> chain; with Chrome's default `SameSite=Lax` those cookies are dropped and `lti-onboarding` loops
> until it lands on `lti-error`. The fix passes
> `--disable-features=SameSiteByDefaultCookies,CookiesWithoutSameSiteMustBeSecure` to the browser.

`launchArgs()` in `core/runner/playwright.setup.js` adds this flag **only when
`argv.appType === "Blackboard"`**, not for every run. `playwright.setup.js` is a protected file;
this change follows the protected-file confirmation protocol (AGENTS.md).
**Rationale:** relaxing SameSite is a Blackboard-LTI need, not a framework-wide one. Applying it
globally would weaken cookie handling for the ExperienceApp / Builder suites and could mask real
product cookie behaviour — the same "scope the cross-cutting browser/network concern, don't apply
it globally" lesson as ADR-014. Gating on appType keeps non-LTI suites on Chrome's default policy.

**Consequences:**
- `css.LTI` is the canonical home for all LTI app page selectors, regardless of which LMS uses them.
- `bbCoursePage.click_ltiTool()` is the reference implementation for new-tab switching.
- `global.page` may be reassigned inside page objects when a new tab is the only way to continue
  the flow — document this explicitly when it occurs.
- The Blackboard appType uses `testResources/testExecutionFiles/Integrations/Blackboard/` as
  `testExecDir` and **two** TC registries: `Integrations/Blackboard/BlackboardTCRepository.json`
  (`css.Blackboard` modules, → `BlackboardSelectors.json`) and `Integrations/LTI/LTITCRepository.json`
  (`css.LTI` modules, → `LTISelectors.json`); execution files spanning both list both in their
  `TestCaseRepo` array. The `Integrations/` sub-path is the convention for all LMS integrations.

---

## ADR-016: Multi-tab handling promoted to `baseActionLibrary`

**Status:** Accepted (2026-07-01)

**Context:** ADR-015B documented new-tab capture (`global.__pwContext.waitForEvent("page")` +
`global.page` reassignment) as a raw escape in `bbCoursePage.click_ltiTool()`, "not yet promoted to
`baseActionLibrary` because only one call site exists" — with the explicit note: *"If a second
integration needs this, promote it to a named, logged method."* The deeplink launch feature (IP3/IP4)
is that second integration: teacher and student flows each open a new tab (deeplink → content) and
later close it to return to Course Content. Inlining raw `global.page`/`newPage` handling in the
deeplink page objects would violate Invariant 1 (layering) and Invariant 3 (escape-hatch protocol).

**Decision:** Promote new-tab handling to two named, logged methods in `baseActionLibrary.js`
(protected-file change; confirmed):
- `switchToNewTab(initialCount, timeout)` — waits until `context.pages().length > initialCount`,
  switches `global.page` + the `$`/`$$` locator factories to the new page, waits for it to be ready,
  returns `true` / `Error`. Capture `initialCount` via `getPageCount()` **before** the click.
- `closeCurrentTabAndRefocus()` — closes the active tab and refocuses the first remaining tab,
  restoring `global.page` + factories; returns `true` / `Error`.

**Consequences:**
- Deeplink page objects (`bbCoursePage.click_deeplink` / `click_deeplink_student` /
  `launch_from_detailPanel` / `returnToCourseContent`) go through the action library — no raw
  `global.page` remains in the deeplink methods.
- **Positional-tab assumption:** `switchToNewTab` takes the newest page (`pages()[len-1]`) and
  `closeCurrentTabAndRefocus` refocuses the first (`pages()[0]`). Valid for the controlled 2-tab
  deeplink flow (exactly one tab opens); a stray/background tab would misroute. Documented inline.
- **`click_ltiTool` is not yet migrated** — it retains the ADR-015B raw escape because of its
  `prevPage` rollback semantics (restore the previous tab if the destination fails to initialise),
  which `switchToNewTab` does not model. Migrate it (or add a rollback-capable variant) as follow-up.

---

## ADR-017: LTI Deeplink Launch (IP3 teacher / IP4 student)

**Status:** Accepted (2026-07-01)

**Context:** Deeplinks are Cambridge One activities placed directly on the Blackboard **Course
Content** page (bypassing the LTI teacher dashboard). Clicking one launches the activity in a new
tab. Teacher and student see different flows, and the launched pages are telemetry-heavy LTI SPAs.

**017A — New-tab readiness uses `domcontentloaded`, not `load`.**
`switchToNewTab` waits `newPage.waitForLoadState("domcontentloaded")`, not `"load"`. `"load"` blocks
until every asset on the LTI SPA finishes and stalls the run; the caller's subsequent element wait
(`waitForDisplayed` on the activity iframe / detail panel) is the authoritative readiness gate. Same
rationale as the dashboard's refusal to wait on `networkidle` (ADR-015C).

**017B — Deeplink navigation methods defer `isInitialized()` to the following verification TC.**
Unlike `click_ltiTool` / `click_component` (which call the destination page's `isInitialized()`
internally), `click_deeplink` / `launch_from_detailPanel` return once the tab is open and settled;
the **next** test case (`TST_LTI_PEDL_TC_1/2`, `TST_LTI_EBKDL_TC_1`) calls `isInitialized()` and does
the verification.
**Rationale:** the deeplink test design splits the *action* (open the tab) and the *verification*
(assert the page) into separate reportable TCs for clearer reporting. `isInitialized()` still runs
before any interaction with the destination, so Invariant 5 is honoured in spirit; this is a
documented nuance, not a violation. Consequence: the action TC's `pageStatus:true` means only "tab
opened + off `/lti-onboarding/`", so it must always be followed by a verification TC.

**Product behaviour captured here** (details in product-knowledge/Integrations.md — ADR-018): teacher deeplink launches
directly; student PE deeplink shows an intermediate detail panel then Launch; student ebook deeplink
launches directly (no panel). Student PE retains prior progress — the TOC renders `.activity-score`
badges — while the teacher view shows none; the PE TOC is collapsed by default (expand via hamburger).

---

## ADR-018: Product Knowledge Split Per Application

**Status:** Accepted (2026-07-14)

**Context:** `.architecture/product-knowledge.md` had grown to ~456 lines holding all three
application families (Cambridge One / NEMO, Builder, Blackboard/LTI) in a single file. Every
session loaded every app's knowledge regardless of relevance, and the file is append-only by
design, so the cost only grows. The content already had a natural boundary — the same `appType`
boundary the framework uses everywhere else (ADR-013 / ADR-015).

**Decision:** Product knowledge is split per application, mirroring the appType families:

- `.architecture/product-knowledge.md` — a thin **INDEX**: usage rules, the reading rule,
  cross-app lessons, and the per-app template. The original path survives so existing
  references (CLAUDE.md, AGENTS.md, code comments, historical walkthroughs) never dangle.
- `.architecture/product-knowledge/ExperienceApp.md` — Cambridge One / C1 apps (NEMO today;
  future C1 apps append here).
- `.architecture/product-knowledge/Builder.md` — comproDLS Builder.
- `.architecture/product-knowledge/Integrations.md` — Blackboard + LTI in ONE file (the
  deeplink flows interleave both namespaces); a future LMS (e.g. Moodle) appends here.

**Reading rule (recorded in CLAUDE.md):** always read the index; read the per-app file matching
the task's application; if the application is unclear or the task spans apps, read all per-app
files — ambiguity defaults to reading more, never less.

**Rationale:** Most sessions concern exactly one application, so loading all apps' product
knowledge is wasted context that grows monotonically. Splitting on the appType boundary reuses
an established, well-understood partition instead of inventing a new one, and scales flat: a
new application adds a new file without taxing existing workflows. The index keeps cross-app
lessons (React forms ignoring `fill()`, repeated-selector page transitions, poll-over-pause)
visible in every session since it is always read.

**Consequences:**
- New product observations append to the relevant **per-app file, never the index**. Each
  per-app file keeps the living-document rules (append-only, `[ASSUMED]`, dated updates).
- Adding a new application = a new file under `product-knowledge/` + a row in the index's
  app → file map (extends the ADR-013 "additive scaffolding" checklist to documentation).
- CLAUDE.md's mandatory-read list and AGENTS.md §"How to Handle Uncertainty" item 7 point at
  the index + per-app files; historical walkthroughs are deliberately NOT edited (they are
  session records, and the surviving index path keeps their references meaningful).
- Cross-app lessons live in the index (and, for automation rules, ARCHITECTURE-INVARIANTS.md);
  app-specific detail stays in the app's own file.

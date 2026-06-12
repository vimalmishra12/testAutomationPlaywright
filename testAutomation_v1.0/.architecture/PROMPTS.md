# PROMPTS — Migration & Major-Change Prompt Log

> Canonical record of the multi-phase prompts that drive large structural changes.
> Each prompt's agreed decisions are FINAL once recorded here — do not re-litigate.

---

## Prompt 4 — WebDriverIO → Playwright (library) + Mocha Migration

**Goal:** Migrate the automation layer from WebDriverIO v7 to **Playwright used as a
library**, driven by **standalone Mocha**. Language stays JavaScript / CommonJS
(ADR-004). The JSON-driven execution engine (`testrunner.js` + execution files +
`C1TCRepository.json`) is **preserved** — this is a driver swap underneath the
engine, not a re-platform.

### Agreed architectural decisions (FINAL)
- **D1 Runner:** Standalone Mocha. NOT `@playwright/test` (it is a runner and would
  replace Mocha + kill the JSON engine, ADR-001/007/011).
- **D2 Automation API:** `require('playwright')` — `chromium.launch()`,
  `browser.newContext()`, `context.newPage()`, `page.locator(<css>)`.
- **D3 Globals shim:** after page creation set `global.page`, `global.$ = sel =>
  page.locator(sel)`, `global.$$ = sel => page.locator(sel)` (`.all()` where lists
  needed). Extends ADR-005 so Page Objects / baseActionLibrary change minimally.
- **D4 Lifecycle:** ONE browser per run; NEW context + page per suite (replaces
  `browser.reloadSession()`; same isolation intent as ADR-010).
- **D5 Assertions:** standalone auto-retrying `expect` from `@playwright/test`
  (import only, no runner), wrapped inside `baseAssertionLibrary.js`. Chai removed.
  Public `assertion` API + `skipAssertion` noop (ADR-008) unchanged.
- **D6 Reporters:** keep Spec (Mocha) + Allure (`allure-mocha`). Timeline retired.
  Add Playwright tracing per suite behind `--trace=true`; traces to `./traces/`.
- **D7 Visual & cloud:** Novus / Applitools / LambdaTest are **Phase 3**. Phase 3
  visual compare = `page.screenshot()` + `pixelmatch` in `visualTest.js`
  (`--updateBaseline` flag; we own baselines).
- **D8 Retries:** expose Mocha `this.retries(n)` via optional `retries` property
  resolved from execution file / TC repository (ADR-007).
- **D9 Parallelism:** unchanged — at execution-file level via npm scripts. Mocha
  parallel mode stays OFF (unsafe with ADR-005 globals).
- **D10 Config:** `wdio.conf.js` retired (after confirmation). Replaced by
  `.mocharc.js` (Mocha config) + `core/runner/playwright.setup.js` (root hooks:
  env resolution via `env.conf.js`, Playwright launch, all globals). `env.conf.js`
  stays with light edits.

### Must NOT change (engine + data, Layer 3/4 contract)
- `testrunner.js` JSON orchestration (Suite → Before/BeforeEach/Test/AfterEach/After,
  TC resolution via `C1TCRepository.json`, data via `dataFile` + `jsonPath`).
- All of `testResources/` (selectors, data, execution files, TC repo) — zero edits expected.
- TC signatures `TST_XXXX_TC_N(testdata)`; Page Object method names + return
  contracts (`true` / `Error` / `{ pageStatus, ... }`) and the `if (true == res)`
  loose-equality convention (ADR-009).

### Phases
- **Phase 0** — deps & scaffolding (no protected files). ✅ **Done 2026-06-11.**
- **Phase 1** — core rewrite + POC login flow green on thor (confirmation batch #1:
  baseActionLibrary, baseAssertionLibrary, testrunner, launchUrl, specGenerator, env.conf).
- **Phase 2** — full rollout + WDIO retirement (confirmation batch #2: wdio.conf.js).
- **Phase 3** — visual & cloud (separate go-ahead).

### Protected files (each needs AGENTS.md confirmation before editing)
`wdio.conf.js`, `env.conf.js`, `core/actionLibrary/baseActionLibrary.js`,
`core/actionLibrary/baseAssertionLibrary.js`, `core/runner/testrunner.js`,
`core/runner/specGenerator.js`, `core/runner/launchUrl.js`.
New files to be ADDED to the protected list (pending confirmation):
`core/runner/playwright.setup.js`, `.mocharc.js`.

### Phase 0 — completed artefacts (2026-06-11)
- `package.json`: added playwright, @playwright/test, allure-mocha, mocha,
  pixelmatch, pngjs; scripts `poc:smoke`, `poc:thor`. WDIO deps retained.
- `.mocharc.js`: Mocha entry (root hooks + Phase 0 spec glob).
- `core/runner/playwright.setup.js`: skeleton root hooks (browser + page/$/$$ shim).
- `test/poc/phase0.smoke.test.js`: smoke spec (example.com), standalone `expect`.
- Verified: `mocha --version` 11.7.6; chromium in shared cache; smoke `1 passing`.
- See `.architecture/walkthroughs/walkthrough_2026-06-11.md` for full detail.

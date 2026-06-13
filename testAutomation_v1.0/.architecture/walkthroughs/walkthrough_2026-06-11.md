# Session Walkthrough — 2026-06-11

## Summary
Executed **Phase 0** of the WebDriverIO → Playwright-as-library + Mocha migration
(Prompt 4). Dependencies and scaffolding only — **no protected files touched**.
The Phase 0 smoke test passes: standalone Mocha launches Chromium via Playwright
root hooks, publishes the `page`/`$`/`$$` compatibility shim, navigates, and
asserts with standalone `expect`.

---

## Changes Made

### 1. `package.json`
- **Type:** Modified
- **Layer:** Config (not in protected list)
- **What changed:**
  - Added deps via `npm install --save`: `playwright`, `@playwright/test`
    (standalone `expect` ONLY — runner not used, decision D1), `allure-mocha`,
    `mocha`, `pixelmatch`, `pngjs` (last two used in Phase 3).
  - WDIO deps **left intact** (removal is Phase 2 cleanup so rollback stays trivial).
  - Added npm scripts:
    - `poc:smoke` → `mocha` (runs the Phase 0 smoke spec via `.mocharc.js`)
    - `poc:thor` → `mocha -- --appType=ExperienceApp --testEnv=thor --testExecFile=loginTest.json --browserCapability=desktop-chrome-1920`
      (wired now; only fully functional once the JSON engine is connected in Phase 1)

### 2. `.mocharc.js`
- **Type:** Created (new file, not protected)
- **Layer:** Config — new Mocha entry point (replaces the WDIO runner from Phase 2)
- **What:** `require: ['./core/runner/playwright.setup.js']` (root hooks), `spec`
  pointed at `./test/poc/**/*.test.js` for Phase 0, `timeout: 120000`,
  `reporter: 'spec'`. Allure added as a second reporter in Phase 1.

### 3. `core/runner/playwright.setup.js`
- **Type:** Created (new file)
- **Layer:** Core runner — Mocha ROOT HOOKS that own the browser lifecycle
- **What (Phase 0 skeleton):** `mochaHooks.beforeAll` launches ONE Chromium
  (headed by default; `PWHEADLESS=1` override), opens a context + page, and sets
  the compatibility-shim globals `global.page` / `global.$` / `global.$$`
  (decision D3). `afterAll` tears page → context → browser down.
- **Deliberately deferred to Phase 1:** env resolution via `env.conf.js`, the full
  globals set (logger, stackTrace, assertion, jsonParserUtil, argv, appUrl,
  selectorDir, moduleOff, path), per-suite context reset (D4), tracing (D6),
  retries (D8). All flagged inline in the file header.

### 4. `test/poc/phase0.smoke.test.js`
- **Type:** Created (new file)
- **Layer:** Test (POC scaffold — removable once Phase 1 POC login flow is green)
- **What:** Trivial root-hook verification — `page.goto('https://example.com')`,
  asserts title + `<h1>` via the `$` shim, using standalone `expect` from
  `@playwright/test` (import only, runner not used — D1/D5).

---

## Verification (Phase 0, step 5)
- `npx mocha --version` → **11.7.6** ✅
- `npx playwright install chromium` → Chromium 1223 (~412 MB) in the **shared
  cache** `C:\Users\Compro\AppData\Local\ms-playwright`, NOT the repo ✅
- `PWHEADLESS=1 npm run poc:smoke` → **1 passing** ✅
  - Full chain exercised: Mocha → `.mocharc.js` → `playwright.setup.js` root hooks
    → `global.page`/`$` shim → navigation → standalone `expect`.

### Environment note (not a code issue)
Headed launch fails in the automated agent shell with `browserType.launch: spawn
UNKNOWN` because that shell is a **non-interactive session** that cannot create a
visible GUI window. Headless launch works perfectly (verified). Headed mode — the
configured default per decision D4/POC — works on a real interactive desktop
session. The `PWHEADLESS=1` override in `playwright.setup.js` exists precisely for
non-interactive/CI contexts. No change required; documented for whoever runs the
POC on a desktop.

---

## Architecture Decisions Triggered
- No ADRs added yet. **ADR-012 ("Playwright as Library under Mocha")** and the
  amendments to ADR-003/005/008/010 are scheduled for the Phase 1 documentation
  block (they describe core-rewrite behaviour that lands in Phase 1).

---

## Protected Files Touched
**None.** Phase 0 is dependency + scaffolding only.

> ⚠️ **Flag for the protected-file list (pending user confirmation):**
> `core/runner/playwright.setup.js` and `.mocharc.js` should be ADDED to the
> protected-file lists in **AGENTS.md** and **system.md** once Phase 1 lands,
> because `playwright.setup.js` will own the browser lifecycle + all framework
> globals — the same architectural role `wdio.conf.js` holds today. Exact wording
> is presented to the user at the end of this session; AGENTS.md/system.md are
> **not** edited until that confirmation is given.

---

## Pending / Follow-up
- **Phase 1** (awaiting user go-ahead): core rewrite (baseActionLibrary,
  baseAssertionLibrary, testrunner, launchUrl, env.conf.js — confirmation batch #1),
  POC login chain green on thor, Allure report, trace file via `--trace=true`.
- Wire `poc:thor` spec resolution to the generated `test/tempRunner` spec (Phase 1).
- Add ADR-012 + ADR amendments to `decisions.md` (Phase 1 doc block, confirmation-gated).
- Add `playwright.setup.js` / `.mocharc.js` to protected lists (confirmation-gated).

---

# Session Walkthrough — 2026-06-11 (Phase 1 — Core Rewrite + POC)

## Summary
Phase 1 of the WebDriverIO → Playwright-as-library + Mocha migration. The six
protected files were changed (all confirmed by the user as confirmation batch #1).
The ADR-011 login chain runs end-to-end on thor under Playwright with **7 passing**;
1 auxiliary test (logout) fails and is flagged for triage. Allure results + a
Playwright trace are produced.

## Protected Files Touched (all confirmed by user — batch #1)

### 1. `core/actionLibrary/baseAssertionLibrary.js`
- Chai → standalone `expect` from `@playwright/test` (import only; D1/D5). Same
  exported names + skipAssertion-noop-at-load (ADR-008). assertEqual/assertNotEqual
  preserve LOOSE equality (==) to match chai semantics; routed through `expect`.

### 2. `core/actionLibrary/baseActionLibrary.js`
- Every method re-implemented on `page.locator()` (D2). `.first()` restores WDIO
  single-match semantics. Method names/params/logging/true|Error return preserved
  (ADR-009). `getText`→innerText, `setValue`→fill, `getElementCount`→count,
  `findElements`→all, `waitForDisplayed`→waitFor({state}). Added native
  `setInputFiles`. Drawing/drag methods ported to Playwright mouse API.

### 3. `core/runner/testrunner.js`
- ALL JSON orchestration preserved. `browser.reloadSession()` (count!=0) →
  `global.createFreshContext()` (context-per-suite, D4). maximizeWindow()/
  setWindowSize() removed (viewport set at context creation). Added per-suite trace
  save in `after` (D6) and per-test `this.retries()` from Test/suite node (D8).

### 4. `core/runner/launchUrl.js`
- `browser.url(appUrl)` → `page.goto(appUrl, { waitUntil: 'load' })` (D2).

### 5. `core/runner/specGenerator.js`
- Removed unused `@wdio/cli/build/utils` import (D10). Generation logic unchanged.

### 6. `env.conf.js`
- `setupCDPHeaders` guarded to no-op under Playwright (no WDIO `browser`); prevents
  ReferenceError. Env/URL/capability resolution unchanged.

## Non-Protected Files Touched (no confirmation required; listed per prompt)

### `core/runner/playwright.setup.js` (upgraded from Phase 0 skeleton)
- Owns browser lifecycle + globals. `global.createFreshContext()` (context-per-suite
  + tracing start), `global.stopAndSaveTrace()`. Globals: browser, page, $, $$.
  NOTE: the internal context handle is `global.__pwContext` — `global.context` is a
  reserved Mocha BDD alias for `describe`, so it could not be used.

### `core/runner/run.js` (NEW — Mocha entry point)
- requires env.conf.js (globals) → specGenerator (tempRunner specs) → programmatic
  Mocha with rootHooks=playwright.setup. yargs parses argv from process.argv (no
  collision with Mocha's CLI parser). `loadFilesAsync()` + a setImmediate boundary
  flush the `await jsonParser()`-deferred describe() calls before run(). Reporter:
  spec (default) or allure-mocha (ALLURE=1). Cleans tempRunner + exits with failures.

### `core/utils/loggerFunction.js` (core util — NOT in protected list)
- `logMessageTrace` rebuilt: old env string read WDIO-only browser.sessionId /
  capabilities.browserName / config.testEnv which don't exist on the Playwright
  Browser and threw. Now uses Playwright-safe globals (argv.testEnv, resolution).

### `pages/ExperienceApp/login.page.js` (page object — broke under the shim)
- `acceptCookies()` used the raw `$()` locator's WDIO-only `.isDisplayed()`/`.click()`
  which Playwright Locators lack. Routed through `action.isDisplayed`/`action.click`.
  This is the ONLY page object that needed editing (it bypassed the action library).

### `package.json`
- `poc:thor` now runs `node core/runner/run.js ...` (was the Phase 0 mocha stub).

## Verification (Phase 1 exit criteria)
- POC on thor: **7 passing / 1 failing (2m)**. Login chain (launchUrl + TST_LAND_TC_3
  + TST_LOGI_TC_1/2/5) fully green; also TST_IDEN_TC_2, TST_APPS_TC_1, signup
  (TST_LOGI_TC_6), forgot-password (TST_LOGI_TC_4) green.
- Trace: `traces/Suite1.zip` (3 MB) valid — contains trace.trace/network/resources;
  opens with `npx playwright show-trace traces/Suite1.zip`.
- Allure: `allure-mocha` produced 33 result JSONs in `allure-results/`. HTML via
  `allure generate` needs Java on the host (not installed here) — not a migration issue.

## Headed-mode fix (system Chrome channel)
- Playwright's BUNDLED Chromium throws `browserType.launch: spawn UNKNOWN` when
  launched HEADED on this Windows host (headless works). Diagnosed empirically:
  `channel:'chrome'` (the installed Google Chrome — the same binary WDIO used)
  launches headed fine.
- `playwright.setup.js` now resolves the channel: **headed → system Chrome by
  default; headless → bundled Chromium** (reproducible, no system dep). Override
  with `PWCHANNEL` (e.g. `PWCHANNEL=msedge`, or `PWCHANNEL=` to force bundled).
- Result: `npm run poc:thor` opens a visible Chrome reliably from any shell (no
  more VS-Code-only headed runs), and headed runs work from the agent shell too.

## Headed layout fix (viewport vs window mismatch)
- Symptom: headed runs looked distorted/misaligned and the logout dropdown clicked
  the wrong spot. Root cause (diagnosed via live metrics): a FIXED context viewport
  of 1920×1080 was forced onto a real Chrome window of only ~1554×882 — the 1920-wide
  layout was squashed into the smaller window, throwing off element positions.
- Fix in `playwright.setup.js`: headed runs now launch with `--start-maximized` and
  use `viewport: null`, so the page lays out at the ACTUAL (maximized) window size —
  identical to a real user's browser, no distortion. Headless keeps the fixed
  viewport for deterministic CI/visual baselines. Override with `PWVIEWPORT=WxH`.

## POC result — FULLY GREEN headed
- `npm run poc:thor` (headed, system Chrome): **8 passing (36s)** — the entire
  loginTest suite including `TST_APPS_TC_2` (Log out).
- The earlier single failure (`TST_APPS_TC_2`) was a **headless / bundled-Chromium
  timing artifact**, NOT a real defect — it passes in real headed Chrome. No
  product/selector change was needed. (Headless CI runs may still flake on this
  dropdown→logout step; revisit if it recurs under PWHEADLESS=1.)

## Cloudflare handling (qa/rel) — Playwright-native, replaces WDIO CDP hack
- qa/rel sit behind Cloudflare Access. env.json carries CF-Access-Client-Id /
  CF-Access-Client-Secret; env.conf.js normalises them into `global.headers`
  (empty `{}` for thor). The old WDIO path injected them via a CDP
  `Network.requestIntercepted` hack (`setupCDPHeaders`, now stubbed).
- `playwright.setup.js` → `createFreshContext()` now passes
  `extraHTTPHeaders: global.headers` on `newContext()` when headers exist — the
  idiomatic Playwright mechanism. Thor unaffected (headers `{}`).
- **Proven** with a without/with probe against `qa.cambridgeone.org`:
  - WITHOUT headers → title "Sign in ・ Cloudflare Access" (blocked)
  - WITH headers → title "Cambridge One | Cambridge University Press" (app reached)
- Note: a full qa/rel LOGIN smoke additionally needs qa/rel execution files + login
  data (loginTest.json hard-codes thor data paths) — that's the Phase 2 qa/rel smoke
  step. The Cloudflare layer itself is now handled.

## Pending confirmation (documentation — presented to user, NOT yet edited)
- decisions.md: ADR-012 + amendments to ADR-003/005/008/010.
- system.md: Tech Stack, Layer 1 table, globals table, Protected Files table.
- AGENTS.md: add `playwright.setup.js`, `.mocharc.js`, `core/runner/run.js` to the
  protected list; note wdio.conf.js retirement is Phase 2.

---

# Session Walkthrough — 2026-06-11 (Phase 2 — Full Rollout + WDIO Retirement)

## Summary
Phase 2 of the migration. WebDriverIO is retired: all npm scripts run via the Mocha
entry point, the last runtime dependency on wdio.conf.js is removed, wdio.conf.js is
moved to deprecated, and the WDIO/Selenium/Appium/Chai packages are removed from
package.json. A `browser.*` compat shim was added so the many Page Objects/Test Cases
that call `browser.pause` etc. keep working. Login suite verified 8/8 with no WDIO present.

## Changes Made

### `package.json`
- 103 `npx wdio ...` scripts converted to `node core/runner/run.js ...` (names + args
  preserved; quotes stripped around `--testExecFile` for cross-shell safety). `test`
  script repointed away from the wdio binary.
- Removed 18 packages: `@applitools/eyes-webdriverio`, all `@wdio/*`, `appium`,
  `browserstack-local`, `chai`, `create-wdio`, `selenium-webdriver`,
  `wdio-chromedriver-service`, `wdio-novus-visual-regression-service`,
  `wdio-timeline-reporter`, `chromedriver`, `wdio-lambdatest-service`.
- Added `fs-extra` as a DIRECT dep (it was only present transitively via WDIO; used by
  specGenerator.js) and `mochawesome` (dev) for the optional HTML report.

### `core/runner/run.js`
- Added a LambdaTest/cloud guard: any capability with `webDriverService !== chromedriver`
  fails fast with a clear "Phase 3" message (decision D7).
- Reporter + headless are now also selectable via CLI flags (`--report=mochawesome|allure`,
  `--headless=true`) so they work identically in PowerShell/CMD/bash (not just env vars).

### `core/runner/playwright.setup.js`
- `attachBrowserCompat()`: WDIO-style helpers on the Playwright Browser global —
  `browser.pause/url/getUrl/getTitle/refresh/keys/execute/getWindowSize/setWindowSize/
  maximizeWindow` — delegating to the current `global.page` (decision D3). `browser.pause`
  is essential (architecture allows it in Test Cases).
- Headed mode uses the system Chrome channel + `--start-maximized` + `viewport:null`
  (fixes bundled-Chromium headed `spawn UNKNOWN` and the viewport/window distortion).
- Cloudflare: context `extraHTTPHeaders: global.headers` (qa/rel), proven against qa.
- Mochawesome per-test screenshots (base64 inline).

### `core/runner/frameworkConfig.js` (NEW)
- Holds `{ config: { logFormat: 'jsonFileFormat' } }` — the only field logger.js /
  loggerFunction.js read from wdio.conf.js. Removes the last runtime wdio.conf.js import.

### `core/utils/logger.js`, `core/utils/loggerFunction.js`
- Now require `../runner/frameworkConfig.js` instead of `../../wdio.conf.js`.

### `wdio.conf.js` — HARD-DELETED
- Removed entirely (user chose hard-delete). Recoverable from git history if needed.
- A stray duplicate (`testResources/selectors/ExperienceApp/csv/wdio.conf.js`) was
  also deleted. No `wdio.conf.js` remains anywhere in the repo.

## Documentation
- decisions.md: ADR-012 added; ADR-003/005/008/010 amended (deprecated wording marked).
- system.md: Tech Stack, Protected Files table, Globals table updated; wdio.conf.js retired.
- AGENTS.md: protected list updated (added .mocharc.js, playwright.setup.js, run.js;
  wdio.conf.js marked retired); globals guidance updated.

## Verification
- `loginFeatureTest_thor` (headed system Chrome): 8/8. (headless: 7–8/8; logout flakes
  only headless.)
- `landingFeatureTest_thor`: 3/4 (1 signup-page 5s timeout — per-suite, not structural).
- `FooterFeatureTest_thor`: 3/4.
- LambdaTest capability → fails fast with Phase 3 message. ✓
- No `webdriverio` / wdio binary in node_modules; package.json has zero WDIO deps.

## Honest status — what "full rollout" means here
- **Structural migration is COMPLETE**: engine, scripts, WDIO removal, browser shim,
  Cloudflare, reporting — all done and validated on representative suites.
- **Per-suite stabilisation is ongoing**: suites whose Page Objects go through
  baseActionLibrary work; suites where Page Objects call WDIO-isms DIRECTLY on the raw
  `$()` locator (e.g. `$(sel).setValue()`, `$(sel).isDisplayed()`, `browser.execute`
  with a locator) need per-object fixes. Example: the NEMO-24306 upload page objects I
  wrote earlier use `$(input).setValue()` + `browser.execute` and will need porting.
  Each such suite is a small, mechanical fix (route through action.* or use Playwright
  equivalents) — tracked as follow-up, not a blocker to the structural migration.

## Page-object porting — NEMO-24306 (done)
- `pages/ExperienceApp/createAdultStudentAccounts.page.js` and
  `createNewAccountsForChildren.page.js`:
  - `upload_csvFile`: replaced WDIO `uploadFile` + `browser.execute` unhide +
    `$(input).setValue()` + re-hide with a single `action.setInputFiles(sel, path)`
    (Playwright sets files directly on a hidden `<input type=file>` and fires change).
  - `getData_uploadErrors`: `$$(sel)` (was an array under WDIO) → `action.findElements`
    (locator `.all()`); `.getText()` → `.innerText()`.
- Result: `NEMO24306_csvUploadTest_thor` → **17/18 passing**, the single failure being
  the INTENTIONAL product-gap TC (TST_NEMO24306_TC_16, letters-only password) — identical
  to the pre-migration WDIO result. Validates uploads, modals, 200/201-record CSVs,
  inline + modal error detection, and school-admin login under Playwright.

## thor matrix (2026-06-11) — categorised
| Suite | Result | Category |
|---|---|---|
| loginTest | 8/8 | A — works as-is |
| NEMO-24306_csvUpload | 17/18 (1 intentional product-gap) | A — ported, works |
| manageReportsTest | 2/2 | A — works as-is |
| dashboardTest_Teacher | 1/1 | A — works as-is |
| landingTest | **4/4** ✅ (was 3/4) | B — FIXED |
| footerTest | **4/4** ✅ (was 3/4) | B — FIXED |
| toolsFeatureTest | 0/6 | B/C — eBook-dependent |
| NEMO-24388 | 4/21 | B/C — before-hook footer-while-logged-in + wizard |
| notesTest | 0/1 (before-hook) | C — eBook-launch family |
| highlighterTest | 0/1 (before-hook) | C — eBook-launch family |

### Category B fixes applied (2026-06-11)
- **landingTest → 4/4**: `landing.page.js` `click_signupBtn` — `browser.pause(1000)`
  must be `await`ed (async under the shim). `signup.page.js` `isInitialized` timeout
  5s → 15s (the `/regoptions` page renders slower; element was present, just late).
- **footerTest → 4/4**: `C1Selectors.json` `footer.footerCambridgeOneSchool` selector
  `a[qid="cFooter-10"]` → `a[qid="cFooter-9"][class*="insti-btn"]` (app DOM change;
  the qid shifted — would have failed under WDIO too).

### Revised understanding
- `toolsFeatureTest` and `NEMO-24388` both fail in their **Before hooks** on shared
  flows (eBook launch / footer-link-while-logged-in → setup wizard), so they're
  effectively in the same bucket as Category C: a shared-flow fix unblocks several at
  once, rather than per-suite TC ports. Recommend tackling the shared Before-hook
  flows (eBook launch + logged-in footer/wizard nav) as focused mini-efforts.

### Category C — eBook-launch shared flow (BREAKTHROUGH, 2026-06-11)
- **Root cause** (NOT iframes after all): the eBook-launch chain failed at
  `TST_DASH_TC_5` → `dashboard.click_ebook_btn`, which does
  `action.getKthElement(sel, k)` (returns a Playwright **Locator**) then
  `action.click(kthElement)`. `action.click` assumed a STRING selector, so
  `page.locator(<Locator>)` was invalid → "Page is not launched".
- **Fix (protected file, confirmed):** `baseActionLibrary.js` `el()`/`els()` now
  accept EITHER a CSS string OR an already-resolved Locator (via an `isLocator`
  check). This is the general fix for the widespread `getKthElement → action.*`
  pattern — no page-object rewrites needed.
- **Impact:** `notesTest` went **0 → 12 passing** (2 minor per-TC fails remain); the
  shared eBook-launch Before chain (`TST_DASH_TC_5` + `TST_EBOO_TC_1/3/8`) now
  completes, cascading to the whole eBook family.

### Category C results (eBook family unblocked by the single Locator fix)
| Suite | Before | After |
|---|---|---|
| notesTest | 0 | **12 passing** (2 minor) |
| highlighterTest | 0 | **22 passing** ✅ |
| timerTest_VC | 0 | **15 passing** ✅ |
| toolsFeatureTest | 0/6 | **16 passing** (7 fails) |
| eBookTestMaster | 0 | **7 passing** (2 fails) |
| drawingTool | 0 | 0/3 — still failing (canvas/before-hook) |
| player | 0 | 6/26 — **the genuine iframe case** (eBook reader content) |

**Category C net:** ~72 previously-dead test cases now passing from the single Locator
fix. Two pockets remain: `drawingTool` (canvas) and `player` (iframe-heavy eBook reader
— this is where `frameLocator` support in baseActionLibrary is genuinely needed).

### Category C — iframe / frameLocator support (player suite)
- **`baseActionLibrary.js`** (protected, confirmed): added `root()` = active frame or
  page. `el()/els()` now resolve string selectors against `root()`. `switchToFrame(id)`
  accepts a CSS `<iframe>` selector (`page.frameLocator`) OR an already-resolved Locator
  pointing at the iframe (`locator.contentFrame()` — this is how `player.page.js` calls
  it). `switchToParentFrame()` clears the active frame.
- **`playwright.setup.js`**: `global.__activeFrame` reset to null in `createFreshContext`
  so frame scope never leaks across suites.
- **No regression risk** for non-iframe suites: `__activeFrame` defaults to null, so
  `root()` is just `global.page` — identical to before.
- **Per-test frame reset** (`playwright.setup.js` `beforeEach`): resets `__activeFrame`
  to null before EVERY test, so a frame-using test that fails before `switchToParentFrame()`
  cannot poison the rest of its suite.
- **Scope of impact:** only `player.page.js` and `c1student.page.js` call `switchToFrame`
  — so the frame changes affect ONLY those two suites. All other eBook-family suites
  (notes/timer/tools/highlighter/eBook) never set `__activeFrame`, so `root()` is just
  the page — VERIFIED no regression (highlighter still 22/22 after the frame changes).

### eBook-launch stabilization (fixes flaky TST_DASH_TC_5 — drawing & player Before hooks)
Root cause: the dashboard's eBook cards load LAZILY (count was 0 at 6s post-login), so
`dashboard.click_ebook_btn` → `getKthElement` ran against an empty/partial list and the
click flakily timed out (30s). notes/highlighter/timer passed by luck (faster timing).
Fixes:
- **`dashboard.page.js click_ebook_btn`**: wait for `ebook_btn` cards to be displayed
  (30s) + a short settle BEFORE picking the kth card.
- **`baseActionLibrary.js getKthElement`**: return a LAZY `nth(k)` locator (re-resolves
  at action time) instead of an eager `.all()[k]` snapshot.
- **`eBook.page.js isInitialized`**: homeButton wait 30s → 60s (heavy SPA reader).
Result: drawing/player Before hooks now COMPLETE (TST_DASH_TC_5 + TST_EBOO_* all pass).
The fix also hardens the already-green eBook suites against the same race.

### notes suite — FIXED to 14/14 (fill → pressSequentially)
- Diagnosis: 5 failures were all click-timeouts (Save Notes / View More / deletes) + a
  downstream data mismatch (TST_NOTE_TC_9 `null == Test Note1`). Root cause: the Angular
  notes editor only ENABLES the Save button on real key events; `action.setValue`
  (`locator.fill()`) fires a single input event and leaves Save disabled → its click
  times out, so no note is saved, so the data assertion fails downstream.
- Fix (page object only): `notes.page.js set_eBookAddNotesTextarea` now clears then types
  char-by-char (`action.addValue` = `pressSequentially`), firing the key events that
  enable Save. **Result: notes 8 → 14 passing (full green), 30s, no timeouts.**
- Lesson: the "data" failure was a symptom, not the cause — verify why before assuming
  data/port. This fill→type pattern likely recurs in other editor/enable-on-keypress flows.

### tools suite — 16 → 50 passing (WDIO-isms + browser.waitUntil)
- The earlier "16/23" was tools SUITES aborting early; with the fixes all 5 tools suites
  run (50/62 now, 12 remain).
- `showHideSelection.page.js`: `$(sel).waitForClickable()` and `$(sel).waitForDisplayed()`
  (WDIO element methods, absent on Playwright Locators) → routed through
  `action.waitForClickable`/`action.waitForDisplayed`.
- `playwright.setup.js`: added `browser.waitUntil(condFn, {timeout,interval,timeoutMsg})`
  to the compat shim (general — any suite using WDIO's waitUntil now works).
- Remaining 12 tools fails: page-nav button click timeouts (next/prev/pageNo) + a couple
  show-selection cases — a separate actionability layer to diagnose.

### Reusable migration-port patterns (catalogue)
1. `$(sel).setValue()` → `action.setInputFiles`/`action.setValue`
2. `$(sel).isDisplayed()` → `action.isDisplayed`
3. `$$()` (was array) → `action.findElements` (`.all()`)
4. `getKthElement → action.click(Locator)` → el()/els() accept Locators
5. `fill()` leaves Angular buttons disabled → `pressSequentially` (char-by-char)
6. `element.waitForClickable()/.waitForDisplayed()` → `action.waitForClickable/Displayed`
7. `browser.waitUntil/pause/url/execute/...` → compat shim on global.browser
8. iframe content → `switchToFrame` (FrameLocator) + `root()` in baseActionLibrary

### getCSSProperty rich-shape restore (NEMO-24388 hover colors + eBook color check)
- WDIO's `getCSSProperty` returned `{ property, value, parsed: { hex, rgba, ... } }`;
  the Phase 1 port returned only `{ property, value }`, so `sts.hoverColor.parsed.hex`
  (used by all 8 NEMO-24388 wizard-step page objects) and the eBook `.parsed.rgba` check
  read `undefined`.
- Fix (`baseActionLibrary.js`): added `parseCssValue()` and return `parsed` from
  getCSSProperty. Colours → `{ rgba, hex }` (hex lowercase 6-digit, rgba space-free to
  match testdata like `#6019b5` / `rgba(251,246,228,1)`); lengths → `{ value, unit }`.
  Verified: `rgb(96,25,181)` → `#6019b5`, `rgba(251,246,228,1)` → exact.

### Footer "Cambridge One for schools" selector — class-based (works logged-out AND logged-in)
- The qid differs between the logged-OUT landing footer (cFooter-9) and the logged-IN
  dashboard footer (NEMO-24388's TST_FOOT_TC_7), so a qid selector can't serve both. Changed
  to `a[class*="insti-btn"]` (qid-independent). Footer suite still 4/4; unblocks NEMO-24388's
  Before hook.

### Remaining hard long-tail (dedicated follow-up)
- **eBook-launch stabilised**: drawing & player Before hooks now complete; player
  improved 6 → 8. The launch flakiness fix also hardens the green reader suites.
- **eBook-reader suites are inherently FLAKY** (notes ranges 8–12 across runs, a
  DIFFERENT TC set each time — flakiness, not a code regression; highlighter is stable
  at 22/22 because its interactions are deterministic). The correct tool is **D8 retries**
  (`this.retries(n)` is wired): add `"retries": 2` at the suite/Test level in the flaky
  reader execution files to stabilise notes/eBook/tools/player without code changes.
- **`player` (18 fails)** — deep activity-iframe tests (nested activity frames, specific
  interactions) — and **`drawing`** (canvas-in-reader) need per-test debugging on top of
  the now-working launch + iframe infrastructure.
- **`NEMO-24388`** — separate logged-in footer→wizard flow.
- The frameLocator INFRASTRUCTURE is in place and safe; the tail is now a
  retries-config + targeted per-test effort, NOT structural.

### Retries experiment — tried and REVERTED (key finding)
- Added `"retries": 2` to the eBook-family execution files, then ran notes: it went only
  **8 → 9** while runtime TRIPLED (4m → 13m). Conclusion: the reader-suite failures are
  **DETERMINISTIC, not flaky** — retries just re-run tests that always fail. Reverted the
  retries config (the runtime cost isn't worth a marginal gain on deterministic failures).
- **Corrected understanding:** the remaining reader-suite failures (notes ~5, tools ~7,
  eBook ~2, player ~18, drawing ~3) are GENUINE per-test issues (WDIO-isms / selectors /
  behaviours inside the notes/notebox/activity flows), needing individual porting — NOT
  flakiness. This is real, dedicated per-test work for a focused follow-up session.

**Categories:**
- **A — works** through baseActionLibrary (login, admin/CSV, reports, dashboard).
- **B — small per-object ports**: page objects calling raw-`$()` WDIO methods
  (`$(sel).setValue/isDisplayed`, `$$()`); mechanical fixes (the NEMO-24306 template).
- **C — eBook-reader family** (notes, highlighter, timer, drawing, player, eBook,
  tools): all share the eBook-launch Before chain (login → dashboard `TST_DASH_TC_5`
  → eBook `TST_EBOO_TC_1/3/8`). Needs that launch flow ported AND `frameLocator`
  support in baseActionLibrary (eBook player content is in an iframe; `page.locator`
  does not cross frames). This is the largest remaining piece of Phase 2.

## Pending / Follow-up
- Continue the thor matrix; port Page Objects that bypass baseActionLibrary or use raw
  `$()`-locator WDIO methods. Common ports: `$(sel).setValue`→`action.setInputFiles`/`fill`;
  `$(sel).isDisplayed`→`action.isDisplayed`; `$$()`→`action.findElements`.
- Phase 3 (separate go-ahead): visual (pixelmatch), Applitools (eyes-playwright),
  LambdaTest (Playwright-over-CDP).

# Walkthrough — Prompt 4 Phase 3: LambdaTest + Visual Testing (2026-06-15)

Continuation of the WebDriverIO → Playwright-as-library migration
([walkthrough_2026-06-11](walkthrough_2026-06-11.md) covered Phases 0–2). This session
closed out the stabilization tail and the gated **Phase 3** (cloud + visual), plus a
couple of shared-root-cause fixes.

---

## 1. Shared fixes (stabilization tail)

### getCSSProperty rich shape (ADR-009 clarification)
WDIO's `getCSSProperty` returned `{ property, value, parsed }`; the Phase 1 port returned
only `{ property, value }`, so page objects reading `.parsed.hex` / `.parsed.rgba` got
`undefined`. Rebuilt the rich shape in `baseActionLibrary.js` with `parseCssValue()`
(colours → `{ rgba, hex }`, lengths → `{ value, unit }`). Colour `.value` is also
normalised to WDIO's spaceless `rgba(r,g,b,a)` (Chromium returns opaque colours as
`rgb(r, g, b)`). Fixed NEMO-24388 hover-colour checks **and** eBook colour check (shared win).

### Footer selector (logged-out + logged-in)
`footer.footerCambridgeOneSchool` → `a[class*="insti-btn"]` (qid-independent), works in both
the landing footer suite and the logged-in dashboard footer (NEMO-24388 Before hook).

### eBook TST_EBOO_TC_6 (Change Course material dropdown colour)
Three compounding causes: (1) `click_playlistTitle` passed the incomplete selector fragment
`[qid^="ebook-list-item-` to `findElements()` → invalid CSS → no card found; completed the
bracket and return the Locator. (2) the test reads `sts.value`, so the method must return the
`getCSSProperty` object, not a string. (3) colour format mismatch — fixed by the rgba
normalisation above. eBook suite → 30/30.

---

## 2. Mochawesome as the default reporter
`run.js` reporter selection now defaults to **mochawesome** (HTML + inline base64
screenshots) so every `npm run <feature>` produces a report with no flags. Opt out with
`--report=spec` (or `SPEC=1`) / `--report=allure`. The `playwright.setup.js` `SHOTS_ENABLED`
gate was synced to the same default so the afterEach screenshot-attach hook still fires.

---

## 3. LambdaTest on the Playwright grid (Phase 3 / D7)
Playwright-as-library does **not** use the Selenium `/wd/hub` endpoint WDIO used. When the
active capability has `webDriverService === "lambdatest"`, `playwright.setup.js` builds
`wss://cdp.lambdatest.com/playwright?capabilities=<encoded JSON>` (browserName/browserVersion
+ `LT:Options` carrying `user`/`accessKey`/`platform`/`build`/`name`/`playwrightClientVersion`,
derived from the capability profile + `LT_USERNAME`/`LT_ACCESS_KEY`) and calls
`chromium.connect(wsEndpoint)` instead of `chromium.launch()`. `run.js`'s cloud guard now
allows `chromedriver` + `lambdatest` (BrowserStack/Appium still gated).

Run: `--browserCapability=lambdatest-chrome-1920`. Creds via env vars or
`env.json → lambdaTestCredentials`. The Selenium-era `/wd/hub`/`hostname`/`portNumber` fields
in that profile are unused by Playwright.

---

## 4. Visual testing port (Phase 3 / D7)
Replaced the WDIO novus `browser.checkDocument()` (`wdio-novus-visual-regression-service`)
with a Playwright-native engine; the custom timeline report is reused as-is.

- **`core/utils/visualCompare.js`** (new): `page.screenshot({fullPage})` → pixelmatch/pngjs
  diff vs baseline → bootstrap baseline on first run → diff PNG on mismatch → returns the
  resemble-style `[{ misMatchPercentage, isWithinMisMatchTolerance, isSameDimensions,
  isExactSameImage }]`. Naming `${suiteKey}-${pad2(tcNumber)}-${tcId}.png` under `testFileName/`
  reproduced from the retired novus `getScreenshotName` (recovered from git history).
- **`visualTest.js`**: novus path uses `visualCompare`; dropped `browser.call()`/
  `browser.checkDocument()` wrappers; `setVisualReportData` synthesises a flat capabilities
  block (browserName from `capabilities[0]`, browserVersion from `global.browser.version()`);
  `screenshots[]` paths use `path.join` (were missing a separator → report couldn't embed).
  Applitools ported to lazy `@applitools/eyes-playwright` on `--visual=applitools`.
- **`run.js`**: invokes TimelineService `onPrepare()`/`onComplete()` (formerly WDIO hooks),
  gated on `--visual=novus`, rebuilds the changelog from disk (robust to fs.watch races), and
  **clears the previous run's artefacts** so the report reflects only the current run.
- **visual-report-utility build fixes**: `embedImage` → `embedImages` (so screenshots embed),
  jpeg → png mime. Added deps: `react`/`react-dom`/`date-fns`/`humanize-duration`.

### Gotchas hit
- pixelmatch v7 is ESM-only → `require(...).default`.
- Stale `*-visualReport-*.log` accumulation made the report aggregate every historical run
  (phantom "12 skipped" came from an earlier pixelmatch-broken run's log) → per-run cleanup.
- "unknown browser name unknown browser version" → capabilities block was the nested profile,
  not flattened.

Verified on thor: `highlighterTest --visual=novus` → 22 passing, 12 visual checks 0% mismatch,
report with 24 embedded screenshots, header shows `chrome 148.0.7778.96`.

---

## 5. Baseline ownership policy
Visual baselines are **NOT committed**. `screenshots/baseline/` (plus `screen/` + `diff/`) is
git-ignored; each environment / CI runner (Semaphore) and each engineer bootstraps and owns
their own baselines locally. Rationale: cross-machine rendering differences make a single
committed baseline unreliable. Trade-off: first run on a fresh checkout is a bootstrap — re-run
for a real comparison. The `screenshots/labels/` annotation images stay tracked.

---

## Files touched (this session)
- `core/actionLibrary/baseActionLibrary.js` — getCSSProperty rich shape + colour normalisation
- `core/runner/run.js` — default reporter, LambdaTest guard, visual report hooks + cleanup
- `core/runner/playwright.setup.js` — LambdaTest connect, SHOTS gate
- `core/runner/visualTest.js` — pixelmatch path, capabilities, Applitools-playwright
- `core/utils/visualCompare.js` (new) — pixelmatch engine
- `core/utils/visual-report-utility/build/{timeline-service,components/images-container}.js` — embed fixes
- `pages/ExperienceApp/eBook.page.js` — TST_EBOO_TC_6
- `testResources/selectors/ExperienceApp/C1Selectors.json` — footer selector
- `.gitignore`, `.architecture/decisions.md`, `AGENTS.md`, `.architecture/system.md`

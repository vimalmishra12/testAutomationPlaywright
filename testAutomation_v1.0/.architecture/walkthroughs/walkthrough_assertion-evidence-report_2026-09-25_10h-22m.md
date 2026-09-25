# Walkthrough — assertion-evidence-report

## Session 1 — 2026-09-25

## Summary
Built the assertion evidence report (ADR-025): with `--assertReport=true`, a mochawesome-style HTML
report marks every element an assertion checked on the end-of-test screenshot (✔ passed / ✘ failed).
Agreed with the user in steps: understanding → hardcoded HTML mockup (approved) → plan (approved,
pilot suite `adminStudentsTab`, flag-gated, end-of-test screenshot only, off-screen elements recorded
but not drawn) → protected-file changes (confirmed) → fixture verification.

## Changes Made

### 1. core/utils/assertionEvidence.js
- **Type:** Created
- **Layer:** Core (utility — not protected)
- **What changed:** The recorder. `recordRead` (called by the action library) stores each read's action,
  selector, Locator, value, the page-object line's *key* (`readKey`) and the test line executing it.
  `wrapAssertions` wraps each assertion, records pass / fail and links it to reads by parsing the
  assertion's first argument from the test source (`firstArgument`, `references`, `assignmentLine`,
  `linkReads`). `beginTest` / `measure` / `finishTest` / `finishRun` are called from the root hooks:
  measure boxes before the screenshot (with changed / clipped / absent / offscreen detection), append one
  JSON record per test to `evidence.jsonl`, save the PNG, and build the report at the end.
- **Why:** keeps all logic out of the protected files, which only gain one-line calls.
- **Lines affected:** whole file (656 lines).

### 2. core/utils/assertion-report/buildAssertionReport.js, template.html, README.md
- **Type:** Created
- **Layer:** Core (utility — not protected)
- **What changed:** builder that turns a run folder (`run.json`, `evidence.jsonl`, `shots/`) into one
  self-contained `index.html` (screenshots embedded, data escaped against `</script>` and `$&`
  replacement); CLI `--from=<dir>` for crashed runs. The template is the approved mockup made
  data-driven: summary, suites, collapsible tests (failed open), marks positioned in %, same-box checks
  merged into one mark (`2·3·4 ✔`), dashed "inferred" marks, reason tags for unmarked checks, hover
  linking, "Failed only" and "Marks on/off" toggles, light/dark tokens. README documents usage and labels.
- **Why:** the report itself. Lives under `core/utils/` not `tooling/` because the runner calls it (AGENTS.md §9).

### 3. core/actionLibrary/baseActionLibrary.js  ⚠️ protected — confirmed by user 2026-09-25
- **Type:** Modified
- **Layer:** Core
- **What changed:** `const evidence = require("../utils/assertionEvidence.js")` (line 16) and one
  `evidence.recordRead(...)` line before the successful return of isEnabled (100), isClickable (115),
  isDisplayed (129), isSelected (142), getValue (180), getText (330), getTextIfPresent (361 + 366 for the
  `null` result), getAttribute (376), getElementCount (390, multi=true), getCSSProperty (418), isExisting (866).
- **Why:** only the action library knows which element a value came from.

### 4. core/actionLibrary/baseAssertionLibrary.js  ⚠️ protected — confirmed by user 2026-09-25
- **Type:** Modified
- **Layer:** Core
- **What changed:** lines 86–93 — `module.exports = evidence.wrapAssertions(_evaluateAndAssert(argv.skipAssertion))`.
  Returns the object untouched when the flag is off or skipAssertion is on.
- **Why:** record each check's pass / fail without changing its behaviour or error.

### 5. core/runner/playwright.setup.js  ⚠️ protected — confirmed by user 2026-09-25
- **Type:** Modified
- **Layer:** Core
- **What changed:** require (32–34); root beforeEach `evidence.beginTest()` (397–399); root afterEach
  restructured (415–444): the original early return is kept for flag-off, `evidence.measure()` runs just
  before the existing full-page screenshot, the mochawesome attach is unchanged, `evidence.finishTest()`
  saves the record; afterAll `evidence.finishRun()` (462–464).
- **Why:** measurement must describe the captured frame; the report is built automatically at run end.

### 6. .architecture/decisions.md
- **Type:** Modified
- **Layer:** Docs
- **What changed:** new ADR-025; ADR-024's "Not decided yet (Step 2)" now points to it.

### 7. .architecture/system.md, tooling/report/README.md
- **Type:** Modified
- **Layer:** Docs
- **What changed:** tech-stack bullet for the report; `assertReport` in the argv globals row; cross-link
  from the ADR-024 README.

## Verification
- **Static parse of the pilot:** all 63 `assertion.*` calls in `test/ExperienceApp/adminStudentsTab.test.js`
  parse; every `sts.x` / `banner.x` / `rows[0].x` resolves to the page-object key in
  `pages/ExperienceApp/schoolStudents.page.js` (e.g. `searchBtnDisplayed` → line 185).
- **Fixture app (scratch copy of the repo, never committed):** a `Fixture` appType, a local HTML page with
  elements at fixed pixel positions, 6 TCs, run through the real `core/runner/run.js`:
  - flag on → report built; boxes pixel-exact (e.g. `#searchBtn` 740,200,100,40); the 8 `true` checks of a
    batched getter each linked to the right element; `rows[1].firstName` → `#row-1 .first`; inline
    `await po.getData_rowCount()` linked; failing check marked ✘ on its element; `changed` (text Idle → Busy),
    `clipped` (inner scroll panel), `absentAsChecked` (display:none checked false), element at y=2200 on a
    scrolled page, fixed header on a scrolled page, retried attempt (`retried` then `passed`), and a failure
    thrown outside any assertion — all as expected; no console errors in the report page.
  - flag off → no `assertionReport` folder; mochawesome 4 tests / 4 screenshots / 3 passed 1 failed —
    **identical** to a baseline run with the `main` versions of the three protected files.
  - flag on + `--report=spec` → report still built.
- Bugs found and fixed by the fixture: raw U+2028/2029 characters in a regex (builder didn't load);
  fixed-position elements placed without the scroll offset; stacked marks hiding badges on same-box checks;
  test-file detection now relative to cwd (an absolute path containing `/test/` would have matched every frame).
- **Environment workarounds (not committed):** installed Playwright 1.63 wants Chromium build 1243, the
  container has 1194 → `PLAYWRIGHT_BROWSERS_PATH` pointed at a scratch folder mapping the names.

## Architecture Decisions Triggered
- ADR-025 added (implements ADR-024 Step 2). ADR-019 unchanged (evidence is still the end-of-test frame).
- AGENTS.md §9 respected: the auto-run builder is under `core/utils/`, nothing under `tooling/` is required.

## Protected Files Touched
- `core/actionLibrary/baseActionLibrary.js` — confirmed by user 2026-09-25
- `core/actionLibrary/baseAssertionLibrary.js` — confirmed by user 2026-09-25
- `core/runner/playwright.setup.js` — confirmed by user 2026-09-25

## Pending / Follow-up
- **Pilot run on thor not done in this session:** the session's network policy blocked
  `micro-nemo.comprodls.com`. Run `npm run adminStudentsTabTest_thor -- --assertReport=true` and audit every
  mark against its screenshot (pass bar from the plan: zero wrong solid marks; count exact / inferred / none).
- Measure flag-on vs flag-off run time on the pilot (target < 5 % extra).
- Rollout beyond the pilot, per-assertion snapshots (would relax ADR-019), JPEG screenshots if report size grows.

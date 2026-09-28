# Walkthrough — assertion-evidence-report

## Session 1 — 2026-09-25

## Summary
Built the assertion evidence report (ADR-026): with `--assertReport=true`, a mochawesome-style HTML
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
- **What changed:** new ADR-026; ADR-024's "Not decided yet (Step 2)" now points to it.

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
- ADR-026 added (implements ADR-024 Step 2). ADR-019 unchanged (evidence is still the end-of-test frame).
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

---

## Session 2 — 2026-09-28

## Summary
Split the report into two views at the user's request: `--assertReport=true` → shareable **results** view
(`index.html`) without assertion details; `--assertReport=debug` → **full** view (`debug.html`) plus the results
view. Reviewed architecturally first and agreed with the user (record once / render twice; strip details from the
file rather than hide them; results view shows only confident marks; debug run writes both files).

## Changes Made

### 1. core/utils/assertionEvidence.js
- **Type:** Modified — **Layer:** Core (utility, not protected)
- **What changed:** `resolveMode()` replaces the boolean flag: `true`/`results` → "results", `debug` → "debug",
  `false`/absent → off, unknown → warning + "results" (case-insensitive; off under skipAssertion). `mode` stored
  in `run.json` and exported. `finishRun()` always builds the results view and also the debug view in debug mode.
- **Why:** one recording path for both modes; the mode only selects outputs.

### 2. core/utils/assertion-report/buildAssertionReport.js
- **Type:** Modified — **Layer:** Core (utility, not protected)
- **What changed:** `build(runDir, view)`; `resultsView()` strips selectors, actions, keys, values, technical
  target states, inferred marks and the raw record, keeping messages, pass / fail, boxes of confident marks and
  expected / actual / first error line of FAILED checks. Output `index.html` (results) / `debug.html` (debug).
  CLI `--view=results|debug`; without it, builds what the run's mode built.
- **Why:** the results report is meant to be forwarded — fields are removed from the file, not CSS-hidden.

### 3. core/utils/assertion-report/template.html
- **Type:** Modified — **Layer:** Core (utility, not protected)
- **What changed:** Results / Debug header badge; view-specific legend; results view renders check message,
  ✔ / ✘, a single "not shown on screenshot" note and the failure reason only; "Recorded check data" debug-only.

### 4. Docs
- ADR-026 amendment (decisions.md), system.md bullet, `core/utils/assertion-report/README.md` (flag table,
  commands, rebuild with `--view`).

## Verification
Fixture app (scratch, not committed), real `run.js`, for `true`, `debug`, `Debug`, `yes`, `false`:
`true`/`yes` → `index.html` only (`yes` warns); `debug`/`Debug` → `index.html` + `debug.html`; `false` → no
folder. grep of the results file: 0 selectors (`#searchBtn`, `#row-1`), 0 action names, 0 `"selector"` /
`"value"` fields; the only test value present is the failed check's expected / actual (by design). Both views
render with no console errors. `--view=debug` rebuild of a `true` run produces `debug.html`.

## Architecture Decisions Triggered
- ADR-026 amended (two views). No new pattern.

## Protected Files Touched
None — no protected files were modified in this session.

## Pending / Follow-up
- Live pilot on thor (`npm run adminStudentsTabTest_thor -- --assertReport=debug`) still to run — host blocked here.

---

## Session 3 — 2026-09-28

## Summary
The user ran the pilot live on thor (`adminStudentsTab`, 24 tests, `--assertReport=debug`) and reported that
`index.html` and `debug.html` looked the same. Cause: the results view still rendered the numbered check list —
only the embedded data differed. Requirement clarified: results view = ✔ / ✘ marks on the screenshot only, no
numbering, no list. Fixed, and verified by rebuilding both views from the user's own run data.

## Changes Made

### 1. core/utils/assertion-report/buildAssertionReport.js
- **Type:** Modified — **Layer:** Core (utility, not protected)
- **What changed:** `resultsView()` now keeps per check only `status` + confident boxes; drops messages, numbers,
  expected / actual and per-check errors. Test-level one-line error kept for failed tests.

### 2. core/utils/assertion-report/template.html
- **Type:** Modified — **Layer:** Core (utility, not protected)
- **What changed:** results view renders the screenshot full width (`.evidence.marks-only`) with plain ✔ / ✘
  badges, no check list, no hover text, no "not shown" legend; caption explains ✔ / ✘. Debug unchanged.

### 3. Docs
- ADR-026 amendment 2 (incl. first live pilot result), README flag table and reading notes.

## Verification
- Rebuilt both views from the user's uploaded pilot run (`debug.html` data + embedded screenshots extracted to a
  scratch run folder): results file contains 0 check messages, 0 `"n":`, 0 selectors (`aLearner`), 0 test emails
  (`mailsac`); debug keeps them (197 messages). Results view renders marks-only with no console errors.
- Pilot audit from `evidence.jsonl`: 0 inferred links; drawn marks sit on the checked elements.

## Protected Files Touched
None — no protected files were modified in this session.

## Pending / Follow-up
- Checks read through helpers that transform values (sort-state tests TC_15–19) show no mark — expected; could be
  improved later by naming reads in those helpers.

---

## Session 4 — 2026-09-28

## Summary
Renamed the report's visible title to "Test Verification Report" / "Test Verification Report: Debug" (user picked
option A of five offered).

## Changes Made
- `core/utils/assertion-report/template.html` — `<title>` and `<h1 id="reportTitle">`; title set per view in JS.
- `core/utils/assertionEvidence.js`, `buildAssertionReport.js` — console lines use the new name.
- `core/utils/assertion-report/README.md`, `.architecture/decisions.md` (ADR-026 amendment 3).

## Verification
Rebuilt both views from the pilot run: tab + heading read "Test Verification Report" (results) and
"Test Verification Report: Debug" (debug); badges RESULTS / DEBUG.

## Protected Files Touched
None — no protected files were modified in this session.

---

## Session 5 — 2026-09-28

## Summary
Brought `main` into this branch before merging PR #77. `main` (#68, Secrets Hardening) had meanwhile taken ADR-025,
so this feature's ADR was renumbered **ADR-025 → ADR-026** everywhere it refers to the assertion evidence report
(earlier sessions above were updated in place to the new number). The secrets ADR keeps ADR-025.

## Changes Made
- Merge of `origin/main`: only `.architecture/decisions.md` conflicted (both sides appended an ADR-025) — resolved as
  ADR-025 Secrets Hardening (main, unchanged) followed by ADR-026 Assertion Evidence Report (this branch); ADR-024's
  "Step 2" pointer now says ADR-026.
- ADR number updated in `system.md`, `tooling/report/README.md`, `core/utils/assertionEvidence.js`,
  `core/utils/assertion-report/*`, this walkthrough.

## Protected Files Touched
Comment-only renumbering ADR-025 → ADR-026 of the hook comments — confirmed by user 2026-09-28, done in a
follow-up commit: `baseActionLibrary.js` (13), `baseAssertionLibrary.js` (1), `playwright.setup.js` (6). No code change
(diff contains only the ADR number; `node --check` passes on all three).


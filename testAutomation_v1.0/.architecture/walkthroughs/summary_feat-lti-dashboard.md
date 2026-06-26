# Branch Walkthrough — feat/lti-dashboard (Compliance Fixes)

**Date:** 2026-06-26
**Branch:** feat/lti-dashboard
**Scope:** Architecture invariant compliance pass — fixes applied after re-assessing
the branch against ARCHITECTURE-INVARIANTS.md following the initial code drop and the
documentation session (walkthrough_2026-06-26.md).

---

## Summary

Five sets of violations were identified and fixed across Invariants 1, 2, and 3.
`baseActionLibrary.js` received six new named methods. ADR-015C (documented raw
`global.page.*` escapes in LTI page objects) is now closed — all three escapes have
been promoted to library methods. ADR-015A has effectively changed: `css.LTI` selectors
now live in their own file (`LTISelectors.json`) rather than alongside `css.Blackboard`
in `BlackboardSelectors.json`.

---

## Violations Found and Fixed

### Fix 1 — Invariant 1 (Layering): `ltiTeacherComponent.test.js`

**Files:** `test/Integrations/LTI/ltiTeacherComponent.test.js` (lines 9, 25)

**Violation:** Test case called `global.page.url()` directly — bypassing the page
object layer.

**Fix:** Added `getDashboardUrl()` method to `ltiTeacherDashboard.page.js` (routes
through `browser.getUrl()`). Test now calls `await ltiTeacherDashboard.getDashboardUrl()`.

---

### Fix 2 — Invariant 2 (Selector namespacing): `css.LTI` extracted to its own file

**Files:**
- `testResources/selectors/Integrations/LTI/LTISelectors.json` *(new)*
- `testResources/selectors/Integrations/Blackboard/BlackboardSelectors.json` *(modified)*
- `testResources/testcaseRepository/Integrations/LTI/LTITCRepository.json` *(modified)*

**Violation:** `css.LTI` selectors lived inside `BlackboardSelectors.json` alongside
`css.Blackboard` — violating the one-file-per-app namespace rule (Invariant 2).
ADR-015A had accepted this as a "portable namespace" arrangement, but the correct fix
is a standalone file.

**Fix:** Extracted the entire `css.LTI` block to
`testResources/selectors/Integrations/LTI/LTISelectors.json`.
`BlackboardSelectors.json` now contains only `css.Blackboard`.
`LTITCRepository.json`'s `selectorFile` updated to point at `LTISelectors.json`.
The execution files (`ltiTeacherDashboardLaunch_thor.json`,
`ltiComponentLaunch_thor.json`) already list both TC repos in their `TestCaseRepo`
array — no change needed there.

**Node.js module caching note:** BB page objects are required earlier in the run
(with `selectorDir` → `BlackboardSelectors.json` cached), so they retain
`css.Blackboard.*` correctly. LTI page objects are required later
(with `selectorDir` → `LTISelectors.json`), so they read `css.LTI.*` correctly.

---

### Fix 3 — Invariant 3 (Escape hatch): raw `global.page.*` replaced across three files

#### 3a — `bbCourse.page.js`

**Violation:**
- `global.page.goto(appUrl)` / `global.page.goto(courseUrl)` — raw Playwright navigation
- `root().locator(sel).filter({hasText}).evaluate(el => el.id)` — raw locator eval

**Fix:**
- Replaced `goto` with `browser.url()` (approved compat helper)
- Added `getFilteredLocator(selector, filterText)` to `baseActionLibrary.js`
- Replaced `.evaluate()` ID read with `action.getAttribute(cardLocator, "id")`

#### 3b — `ltiTeacherDashboard.page.js` (multiple raw calls)

**Violation:** Several raw `global.page.*` calls: `waitForLoadState`, `waitForURL`,
locator chain with `.filter()` and nested `.filter()`.

**Fix:**
- Added `waitForLoadState(state, timeout)` to `baseActionLibrary.js`
- Added `waitForUrl(pattern, timeout)` to `baseActionLibrary.js`
- Added `getFilteredLocator(selector, filterText)` (shared with Fix 3a)
- Added `getNestedFilteredLocator(outerSel, outerText, innerSel, innerText)` to library
- All page object calls now route through `action.*`

#### 3c — `player.page.js` (tab handling + timeouts)

**Violation:**
- `global.page.waitForTimeout(N)` throughout the file — raw Playwright sleep
- `global.page.context()` + `global.page.bringToFront()` in `click_hyperlinkNewTab`

**Fix:**
- All `global.page.waitForTimeout(N)` → `browser.pause(N)` (approved compat helper)
- Added `getPageCount()` to `baseActionLibrary.js`
- Added `closeNewTabAndRefocus(initialCount, timeout)` to `baseActionLibrary.js`
- `click_hyperlinkNewTab` rewritten to use both new methods

---

## New `baseActionLibrary.js` Methods (6 total)

| Method | Purpose |
|---|---|
| `getFilteredLocator(selector, filterText)` | Returns a locator filtered by visible text |
| `getNestedFilteredLocator(outerSel, outerText, innerSel, innerText)` | Returns a nested locator with two text filters |
| `waitForLoadState(state, timeout)` | Waits for page load state; returns `true` / Error |
| `waitForUrl(pattern, timeout)` | Waits for URL to match a glob/regexp; returns `true` / Error |
| `getPageCount()` | Returns current open page count via `global.page.context()` |
| `closeNewTabAndRefocus(initialCount, timeout)` | Waits for a new tab, closes it, refocuses original; returns `true` / Error |

All methods follow the standard log → try/catch → `true`/Error return contract.

---

## Remaining Items

### 1. `bbCoursePage.page.js:click_ltiTool` — ADR-015B (accepted exception)

Lines 37–53 contain `global.__pwContext.waitForEvent("page")`,
`global.page = newPage`, `newPage.waitForLoadState("load")`, and
`global.page = prevPage`. This is the tab-switch pattern for capturing a new tab
opened by the LTI tool link.

**Status:** Accepted per ADR-015B (documented in walkthrough_2026-06-26.md).
The pattern requires setting up the event listener before the click, making a clean
library abstraction non-trivial without changing the call site significantly.
Promote to `prepareNewTabListener()` + `switchToNewTab()` library methods if a second
integration requires the same pattern.

### 2. `ltiComponentPage.isInitialized()` — minor Invariant 4 gap

Returns `{ pageStatus: res === true }`. On failure, `pageStatus` is `false` (boolean)
rather than the Error object. This loses the error detail. Low severity — the calling
assertion still fails with a clear message. Fix when next editing this file.

### 3. ADR-015A update pending

ADR-015A as written describes a dual-namespace `BlackboardSelectors.json`. The
selector split in Fix 2 supersedes that decision. Update ADR-015A in `decisions.md`
to reflect the two-file arrangement.

### 4. Deeplink page objects (`integrationCases` branch)

`ltiDeeplinkEbookPage` selectors are now in `LTISelectors.json` but
`ltiDeeplinkEbookPage.page.js` and `ltiDeeplinkPEPage.page.js` live on
`integrationCases`. Ensure that branch's `selectorDir` also points to
`LTISelectors.json` when merging.

# Feature Walkthrough — NEMO-24388 (setupSchoolAccount.test.js)

> **Status:** Complete — all tests passing (21/21 on thor). Finalised & moved to `Walkthrough/` on 2026-06-02.
> **Test file:** `test/ExperienceApp/setupSchoolAccount.test.js`
> **Ticket:** NEMO-24388 | **Env:** thor

## Summary
Implemented and stabilised the NEMO-24388 A11Y/visual test suite that verifies the primary "Next" button hover background-colour is `#6019B5` (`rgb(96, 25, 181)`) across all 8 steps of the "Set up a school account" wizard. A single TC (`TST_SUSA_TC_1`) is reused across all 8 wizard steps (ADR-011). Latest status: **21/21 passing on thor.**

## Files Read (each session)
- [x] AGENTS.md
- [x] .architecture/system.md
- [x] .architecture/decisions.md

---

## Test Case Inventory

| TC ID | Purpose | Type |
|---|---|---|
| `TST_SUSA_TC_1` | Assert primary button hover colour `#6019b5` (reused on all 8 steps) | Assertion (visualTest: true) |
| `TST_SUSA_TC_2` | Click Next on step 1 → step 2 | Navigation |
| `TST_SCTY_TC_1/2/3` | Step 2 init / next / fill (radio) | Navigation/Fill |
| `TST_NTCH_TC_1/2/3` | Step 3 init / next / fill (radio) | Navigation/Fill |
| `TST_SNAM_TC_1/2/3` | Step 4 init / next / fill (school name) | Navigation/Fill |
| `TST_SLOC_TC_1/2/3` | Step 5 init / next / fill (location) | Navigation/Fill |
| `TST_SADR_TC_1/2/3` | Step 6 init / next / fill (street + city) | Navigation/Fill |
| `TST_SCON_TC_1/2/3` | Step 7 init / next / fill (telephone) | Navigation/Fill |
| `TST_SRQS_TC_1` | Step 8 init | Navigation |
| `TST_DINS_TC_1` | Enter wizard from "Do I need a school account?" page | Navigation |

**Counts:** 1 reused assertion TC + navigation/fill TCs across 8 wizard steps.

---

## Session Log

### Session 1 — 2026-06-01 — Initial suite creation + selector stabilisation
- **Created** 10 page objects (`doINeedASchoolAccount`, `setupSchoolAccount`, `schoolType`, `numberOfTeachers`, `schoolName`, `schoolLocation`, `schoolAddress`, `schoolContactDetails`, `schoolRequestSummary`) — each with `isInitialized()`, `getHoverColor_primaryButton()`, and (except final step) `click_next()`.
- **Created** matching test files (`TST_*` TCs listed above), execution file `testResources/testExecutionFiles/ExperienceApp/thor/NEMO-24388.json`, and test data `testResources/testcaseData/ExperienceApp/thor/NEMO-24388.json`.
- **Modified** `C1Selectors.json` — added 9 wizard sections; all `primaryBtn` resolve to `button.btn-purple`.
- **Modified** `C1TCRepository.json` — registered all new TC IDs.
- **Modified (Protected)** `package.json` — added `setUpSchoolAccountTest_thor` + `visualAcceptance_setUpSchoolAccount_thor` scripts. **Confirmed by user on 2026-06-01.**
- **Added form-fill** methods + `TST_*_TC_3` TCs to unlock the Next button on steps 2–7 (no data is submitted; wizard abandoned after each step's hover check).
- **Selector fixes (live Thor DOM inspection):**
  | Field | Old | Actual |
  |---|---|---|
  | `footerCambridgeOneSchool` | `a[qid="cFooter-9"]...` | `a[qid="cFooter-10"][class*="insti-btn"]` |
  | `streetAddressInput` | `input[type="text"]` | `textarea[qid="t-ss-ad-inpt-1"]` (textarea!) |
  | `cityInput` | `input...:nth-child(2)` | `input[qid="t-ss-ad-inpt-2"]` |
  | `telephoneInput` | `input[type="tel"]` | `input[qid="t-ss-cd-inpt-2"]` |
- **Telephone** value changed to digits-only (`1234567890`) — country code field pre-filled with "44".
- **End-of-session result:** 13 passing / 8 failing — the 8 `TST_SUSA_TC_1` colour assertions failed because the `#6019B5` hover fix was not yet deployed to Thor (expected).

### Session 2 — 2026-06-02 — Single-suite refactor, hover colour fixes, step-6 fix, hoverCenter helper
- **Suite structure:** collapsed 8 suites → 1 suite (21 sequential steps: login → footer → wizard steps 1–8) per user request.
- **Hover colour assertion fixes:**
  - Added `browser.pause(400)` after the hover so the CSS transition settles before reading the colour (was reading a mid-transition intermediate purple).
  - Switched assertion to `getCSSProperty(...).parsed.hex` vs expected `#6019b5` to normalise rgb/rgba string-format differences (step 5 returned `rgba(...)`).
  - Updated test data `expectedHoverColor` to `#6019b5` for all 8 steps.
- **Step 6 "move target out of bounds" — root cause + fix:**
  - The Address form is tall; after filling it, the Next button sits **below the fold**. `action.moveTo()` does **not** auto-scroll, so the pointer move was rejected.
  - **Key detour lesson:** due to ADR-011, `TST_SUSA_TC_1` only ever calls `setupSchoolAccount.getHoverColor_primaryButton` — **never** the per-step page objects. Several iterations editing `schoolAddress.page.js`'s hover function were dead code.
  - **Fix:** put scroll-to-viewport-centre + W3C pointer move in the shared hover function, then refactored it into a reusable Core helper.
- **`core/actionLibrary/baseActionLibrary.js` (Protected) — added `hoverCenter(selector)`.** Scrolls element to viewport centre (`scrollIntoView({block:'center'})`) then drives a real pointer move via `performActions`/`releaseActions`. Returns `true`/error like `moveTo`. **Confirmed by user on 2026-06-02.**
- **`setupSchoolAccount.page.js`** — `getHoverColor_primaryButton` now calls `await action.hoverCenter(selector)` (no raw `browser.execute`/`performActions`/`releaseActions` in the page layer; only pre-existing `browser.pause(400)` remains).
- **`schoolAddress.page.js`** — reverted dead-code hover edits back to plain `action.moveTo`.
- **Debug cleanup:** removed all temporary `browser.pause(500)` debug pauses (schoolName/schoolLocation/schoolContactDetails/schoolAddress) and the `console.log('>>> HOVER COORDS')` diagnostic.
- **Result:** **21/21 passing on thor.**

---

## Architecture Decisions / Notes
- **ADR-011 (shared TC):** `TST_SUSA_TC_1` reused across all 8 steps; `button.btn-purple` present on every step. Any hover/shared-behaviour change must go in `setupSchoolAccount.page.js`, **not** the per-step page objects (those hover functions are never called).
- **ADR-004 (lazy require):** used in all `click_next()` methods to avoid circular dependencies.
- **ADR-009 (loose equality):** `if (true == res)` throughout.
- `moveTo()` does **not** scroll into view; `click()` does. For hover assertions on potentially below-the-fold elements use `action.hoverCenter()`.
- Hover colour read via `getCSSProperty(...).parsed.hex` to avoid rgb/rgba string mismatches.
- `browser.pause` is used directly in page objects consistent with existing framework convention; other `browser.*` calls are routed through the Core action library.

## Protected Files Touched
- `package.json` — new npm scripts. **Confirmed by user on 2026-06-01.**
- `core/actionLibrary/baseActionLibrary.js` — added `hoverCenter()`. **Confirmed by user on 2026-06-02.**

## Selectors Added
All NEMO-24388 selectors already added in Session 1 (no new selectors in Session 2). Key wizard selectors live under `css.ComproC1.<step>` in `C1Selectors.json` (`primaryBtn` = `button.btn-purple`).

## New isInitialized() Methods Added
| Page Object | Stable Element Used |
|---|---|
| `setupSchoolAccount` & all 8 wizard step page objects | `button.btn-purple` (`primaryBtn`) |

## Open Issues / Follow-ups
- [ ] Changes not yet committed — pending user request.
- [ ] When the feature is confirmed complete, **move this file to `Walkthrough/`** (with user confirmation).
- [ ] Consider reusing `action.hoverCenter()` for future below-the-fold hover-state tests.

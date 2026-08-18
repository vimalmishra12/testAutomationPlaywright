# Session Walkthrough — 2026-08-18 (adminGradingCategories.test.js, module GCAT)

> One file per feature. **Append** subsequent GCAT sessions to this file — do not create a new one.

---

## Session 1 — 2026-08-18

## Summary

Automated **Requirement #5 (create grading category)** and **Requirement #8 (delete grading
category)** on the Admin App "Manage grading categories" page, as a new module **GCAT** against
**thor** / school `3 July Test School 1` (`FCN-CHZ-PDA`). Five TCs plus a housekeeping hook:
**5 passing, 2 consecutive clean runs** (~34–40 s). `TST_GCAT_TC_4` (maximum-categories limit)
was deliberately left unautomated and is recorded as **blocked** — see Pending.

This is the first GCAT work and the first module in this feature area that **creates and deletes
real data** on the shared thor school; every earlier Classes-tab TC was read-only.

## Changes Made

### 1. `testResources/selectors/ExperienceApp/C1Selectors.json`
- **Type:** Modified
- **Layer:** Test Resources (selectors)
- **What changed:** Added `css.ComproC1.manageGradingCategories` — 21 selectors captured live
  (school-settings toggle and its two menu items, Create button, create modal + name input +
  Save/Cancel/X, per-row action menu / See details / Remove templates, remove-confirmation modal
  + both buttons, success-banner wrapper and its text node).
- **Why:** New page needed its own namespaced selector module (Invariant 2 / ADR-002).
- **Lines affected:** +23 lines, inserted before the close of `css.ComproC1`.

### 2. `pages/ExperienceApp/manageGradingCategories.page.js`
- **Type:** Created
- **Layer:** Page Object
- **What changed:** `isInitialized()`, `navigate_fromClassesTab()`, list readers, create/remove
  flows, a `create_category()` precondition helper, and `reset_state(prefix)` housekeeping.
  Module-private helpers `readCategoryNames()`, `waitForCategoryState()`, `waitForBannerText()`.
- **Why:** All DOM interaction for the new page (Invariant 1).
- **Lines affected:** whole file (~330 lines).

### 3. `test/ExperienceApp/adminGradingCategories.test.js`
- **Type:** Created
- **Layer:** Test Case
- **What changed:** `TST_GCAT_TC_2` (create), `TC_3` (50-char boundary), `TC_5` (empty name →
  Save disabled), `TC_9` (cancel remove), `TC_8` (remove), `TC_10` (housekeeping).
- **Why:** Requirements #5 and #8.
- **Lines affected:** whole file (~200 lines).

### 4. `testResources/testcaseRepository/ExperienceApp/C1TCRepository.json`
- **Type:** Modified
- **Layer:** Test Resources
- **What changed:** New module block `GCAT` registering all 6 TCs, every one `visualTest: false`.
- **Why:** Two-change rule (Invariant 7 / ADR-007).
- **Lines affected:** +13 lines after the CLST block.

### 5. `testResources/testcaseData/ExperienceApp/thor/adminGradingCategoriesData.json`
- **Type:** Created
- **Layer:** Test Resources (data)
- **What changed:** `schoolKey`, `namePrefix` (`AutoCat_`), `maxNameLength` (50), `removeModalCopy`.

### 6. `testResources/testExecutionFiles/ExperienceApp/thor/adminGradingCategories.json`
- **Type:** Created
- **Layer:** Config
- **What changed:** Suite reusing the existing login + school-select `Before` chain
  (`launchUrl` → `TST_LAND_TC_3` → `TST_LOGI_TC_1/2` → `TST_NEMO24306_TC_LOGIN` → `TST_SADB_TC_1`);
  `BeforeEach` = `TST_GCAT_TC_10`; `AfterEach` intentionally **empty** (see Architecture Decisions).
- **Why:** ADR-011 — never redefine an existing TC.

### 7. `package.json`
- **Type:** Modified
- **Layer:** Config
- **What changed:** Added `P1AdminGradingCategories_Thor`.
- **Lines affected:** +1.

### 8. `test/Manual/C1App/AdminApp-Classes/AdminApp_Classes_tab_test_cases.md`
- **Type:** Modified
- **What changed:** Execution status 22 → **27 of 81 passing**; `TC_2/3/5/8/9` → Pass with real
  Actual Results; `TC_4` → `Not Run — Blocked` with the full reason and three unblock options;
  open item #7 (50-char boundary) marked **RESOLVED**, #6 (max count) restated as blocked.

### 9. `test/Manual/C1App/AdminApp-Classes/AdminApp_Classes_tab_test_cases.xlsx`
- **Type:** Modified
- **What changed:** Same updates as the `.md`, matching the existing `Automated - …` row style.
  Verified totals agree with the `.md`: **27 Pass / 53 Not Run / 1 Blocked = 81**.

---

## Measured values (live, thor, 2026-08-18) — never re-guess these

| Action | Banner appears | Banner lifetime | List updates |
|---|---|---|---|
| Create | 1.39 s | ~15.0 s | 1.39 s |
| Remove | 2.17 s | ~15.1 s | 2.17 s |

The banner and the list update in the **same tick** — neither leads the other. `SETTLE_TIMEOUT`
is 15 s (~7× the measured worst case).

## Selector traps found on this page

1. **Four `.modal-content` elements exist in the DOM at all times** — create, max-limit, generic
   error, remove-confirmation. Only one is ever visible, so any presence check is a guaranteed
   false green. Every modal selector is `:has(...)`-scoped and every check uses
   `isDisplayed` / `waitForDisplayed`.
2. **Row action `qid`s are positional** (`gradingCategoryActionLink-N`), not name-keyed → the row
   index must be looked up by name on every use.
3. **The list is sorted alphabetically**, so a new category can land at any index.
4. **`.message-banner-panel-wrapper` is genuinely removed from the DOM** when not showing (polled
   20 s) — the one element here where presence is a truthful signal.
5. `div.list` is the per-row container. `div.row` wraps **all** rows and does not isolate one.

## Two bugs hit and fixed (both automation-side, neither a product defect)

**1. Dropped keystrokes.** `pressSequentially` types faster than the form's async
"does this name already exist" check can consume, and characters are lost — 10 of 28 on one run,
1 of 28 on the next; the missing characters never arrive (a 5 s poll never converged). The app was
storing exactly what it was given (`AutoCat_remove_178`), so this is **not** a product bug.
**Fix:** a top-up loop in `set_categoryName` — read the field back, append only what is missing,
repeat until it matches. Suite time also dropped from ~2 min to ~35 s.

> A read-back check was added first, purely to tell an automation race apart from a product
> defect, before any fix was chosen. Invariant 14 — establish which it is before working around it.

**2. Stale banner.** `TST_GCAT_TC_8` creates a category then removes it; the "successfully
created" banner lives ~15 s, so it was still on screen when the removal finished and
`waitForDisplayed(banner)` returned instantly against the **previous** message.
**Fix:** `waitForBannerText(expected)` — wait for the banner to *say* the expected copy, not for a
banner to exist. This is the Classes-tab §3 lesson (wait on the content that changed, never the
container) recurring in a new place.

> `TST_GCAT_TC_5` **passed in the first run while typing a corrupted name**, because nothing
> verified what landed in the field. The read-back turned that false green into a real failure.
> Worth remembering: 1/5 was a worse result than the 0/5 that replaced it.

## Architecture Decisions Triggered

- **Housekeeping runs in `BeforeEach` only — `AfterEach` is deliberately empty.** The mochawesome
  screenshot is taken by a **root** `afterEach` (`core/runner/playwright.setup.js:402`), while the
  exec file's `AfterEach` list runs in a **suite-level** hook (`core/runner/testrunner.js:344`).
  Mocha runs suite hooks before root hooks, so an `AfterEach` sweep would delete each category
  moments **before** its screenshot — every create/delete TC would be evidenced by a picture of an
  empty list. Sweeping only in `BeforeEach` preserves the evidence and still guarantees a clean
  start, including after a crashed run.
  > ⚠️ **New pattern** — differs from `TST_CLST_TC_RESET`, which runs in both. Consider an ADR:
  > *"cleanup that would erase a TC's visual evidence belongs in BeforeEach, not AfterEach."*
- **Housekeeping TC named `TST_GCAT_TC_10`**, conforming to `TST_<MOD>_TC_<N>` — deliberately not
  repeating the `TST_CLST_TC_RESET` naming that the previous handoff flagged as off-convention.
- **Per-run unique, sweepable data names** (`AutoCat_<tag>_<epoch-ms>`): unique so name→index
  lookup is unambiguous, prefixed so leftovers are recognisable and sweepable.
- `assertPanelClosed(selector, customMessage)` takes a **message, not a timeout**, and checks
  instantly — unusable for an animated close. Use `waitForDisplayed(sel, ms, true)` (Playwright
  `hidden`) instead. Worth knowing repo-wide.
- ADRs referenced: ADR-002 (selectors), ADR-003 (layering), ADR-009 (return contract),
  ADR-011 (reuse TCs), ADR-013 (Angular form typing), Invariants 1, 2, 7, 13, 14.

## Protected Files Touched

**None** — no protected files were modified. `baseActionLibrary.js` was *considered* for a
delay-capable typing method (Invariant 3) but the page-object top-up loop solved it without a
protected-file change. If keystroke loss shows up on other Angular forms, that action-library
method is the durable fix and needs explicit confirmation first.

## Phase 3 — Visual assessment (completed 2026-08-18): **no candidates**

Every TC classified against the AGENTS.md §8 Rule A decision table. **All six hit at least one
❌ row, so all stay `visualTest: false`** — that is not a judgment call and required no user
confirmation.

| TC | Data in frame | Decision-table row | Result |
|---|---|---|---|
| `TC_2` | `AutoCat_create_<epoch-ms>` + shared category list | Randomized/computed value · Timestamp | ❌ false |
| `TC_3` | 50-char `AutoCat_<epoch-ms>…` + shared list | Randomized/computed value · Timestamp | ❌ false |
| `TC_5` | Static modal, but the page behind it shows the shared list **and** a success banner that appears only when the BeforeEach sweep removed something | Paginated/dynamic content · non-deterministic | ❌ false |
| `TC_9` | `AutoCat_cancelremove_<epoch-ms>` in the list | Randomized/computed value · Timestamp | ❌ false |
| `TC_8` | Shared list after removal | Paginated/dynamic content | ❌ false |
| `TC_10` | Sweeps a variable number of leftovers | Randomized/computed value | ❌ false |

`TC_5` was the only near-candidate — its modal is genuinely static (fixed labels, placeholder,
disabled Save). It still fails, for two independent reasons: the shared category list sits behind
the modal, and the banner in the background is present only on runs where the sweep actually
removed something. Confirmed in the real screenshot, which carried a stale
"Grading category successfully removed" banner.

**Conclusion:** same outcome as module CLST, for the same structural reason — this page always
frames a live, shared, mutable list. A visual baseline here would fail on data churn rather than
UI regression.

**`authoring-status.md`:** no block added or removed. The file holds in-flight work only, and this
feature passed through Phases 1–3 within a single session, so it never had one.

## Pending / Follow-up

1. **`TST_GCAT_TC_4` (max-categories limit) — BLOCKED.** Its precondition is a school already at
   its cap. The maximum is unknown; `FCN-CHZ-PDA` is **shared**, so holding it at the cap would
   make every other suite's category creation fail; and a crash before cleanup leaves it full.
   **Unblock via any one of:** (a) a **dedicated school** for this test *(recommended)*;
   (b) product/dev supply the exact maximum plus acceptance of the shared-school impact;
   (c) an environment with no other suites running. The expected modal copy is **already verified**
   (the modal is pre-rendered in the DOM), so this is short work once a school exists.
   It is absent from the test file, TC repository and exec file — not skipped — so it cannot run
   by accident.
2. **`TST_GCAT_TC_1 / TC_6 / TC_7`** (Req #4 manage page, #6 see details, #7 launch grade settings)
   — not yet automated. `TC_7` additionally needs a category **applied to a class**, which is a
   CGST operation, so it is best picked up alongside CGST.
3. **Unverified:** the **School settings → Manage grading categories** click could not be driven
   through Playwright-MCP during capture (the MCP click did not fire the Angular handler on
   `javascript:void(0)` anchors; a JS `.click()` did). It is, however, exercised on **every**
   `BeforeEach` by `navigate_fromClassesTab()` and passes — so the path is proven by the suite even
   though interactive capture could not drive it.
4. `org_perf_testschool_1` is the legacy org slug for `FCN-CHZ-PDA` ("3 July Test School 1"). Two
   schools share that display name — **always select by key** (confirmed again this session).

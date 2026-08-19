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
  > ✅ **Written up as ADR-019** (`decisions.md`) — *"Cleanup That Would Erase a TC's Evidence
  > Belongs in `BeforeEach`, Not `AfterEach`"*. It records that CLST's both-hooks pattern stays
  > correct (its reset clears a filter, which no screenshot depends on), so GCAT's empty
  > `AfterEach` must not be "aligned" to it by symmetry. Confirmed by the user 2026-08-18.
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

---

# Session 2 — 2026-08-19 · Req #4 (`TST_GCAT_TC_1`) and Req #6 (`TST_GCAT_TC_6`)

**Scope agreed with the user:** close the two cheap GCAT leftovers before moving to GSCL.
Phases 1–3 all completed in this session. Environment **thor**, school **FCN-CHZ-PDA**
(`org_perf_testschool_1`). Result: **7 passing / 0 failing, two consecutive clean runs (~34–37 s)**,
up from 5 passing.

## Result

| | Before | After |
|---|---|---|
| `P1AdminGradingCategories_Thor` | 5 passing | **7 passing / 0 failing** |
| GCAT selectors | 21 | **32** |
| Manual register | 43 Pass / 37 Not Run | **45 Pass / 35 Not Run** |

Requirements **#4 and #6 are now fully covered** (one TC each). GCAT's only remaining gaps are
`TC_4` (blocked — see session 1) and `TC_7` (deferred to CGST).

## What the live capture found

Selectors were captured against the live page before any code was written. Three things came out
of it that were **not** in the previous session's notes:

**1. Page-scoping anchors exist.** Both views render an unclassed `<h1>` and exactly one
`h2.heading-2`, so a bare `h1` selector would silently match the wrong page. The two views expose
mutually exclusive Angular component tags — `<manage-grading-category>` (list, note the SINGULAR
"category") and `<grading-category-classes>` (details). Every new selector is scoped to one of
them. The singular tag name was **guessed wrong first** (`manage-grading-categories` returned 0
elements) — worth re-checking rather than assuming.

**2. NEW TRAP — the row menu items are permanently in the DOM (page-object trap 5).**
With 3 categories listed and no menu open: **3 "See details" links present, 0 visible.** Opening
one row's menu makes only that row's items visible (its `.dropdown-menu` gains `.show`). This is
the same false-green family as the four permanent modals found in session 1 — a count-based check
of "each row has See details / Remove" would pass on a page where the menu never opens at all.
`TST_GCAT_TC_1` therefore OPENS the menu and checks each item with `isDisplayed`.

**3. NEW TRAP — the details page cannot be recovered from (page-object trap 6).**
The details page does **not** contain `#changeClassKeyActionsLink`, so `navigate_fromClassesTab()`
— which `reset_state()` uses to recover — cannot work from there. This mattered immediately:
ADR-019 requires `TST_GCAT_TC_6` to END on the details page so its screenshot proves the page
opened, which would have broken the very next `BeforeEach`.

Fixed by giving `reset_state()` a first branch that steps back via the details page's own Back
link (`a[qid='gradingCategoryClass-1']`, verified live to return to the Manage page). Raised with
the user before editing, since `reset_state` is shared by five already-passing TCs.

**A second state-bleed of the same shape** was caught by reasoning rather than by a failure:
`TST_GCAT_TC_1` ends with a dropdown open (that IS its evidence). Measured live, the open menu does
not overlap the Create button — but it is absolutely positioned over the list and can sit over
another row's toggle, which the sweep clicks. `Escape` was verified live to close it (menu loses
`.show`, toggle returns to `aria-expanded="false"`) and `reset_state` now does that too.

> Both fixes are asserted, not fire-and-forget — a silent failure here would bleed state into the
> next TC (Invariant 13).

## Design decision — `TST_GCAT_TC_6` creates its own category

It does **not** open one of the school's three shared categories (`new catagory`,
`new Grading Category`, `some`). Two reasons, both about determinism on a shared environment:

- `BeforeEach` sweeps every `AutoCat_*`, so a category created by an earlier TC is already gone —
  it cannot borrow one.
- A brand-new category is **guaranteed** to have zero classes applied, which is what makes
  `Active classes (0)` and the empty-state copy safe to assert verbatim. A shared category could
  gain a class from another team at any moment.

## Product copy captured (asserted verbatim)

| Where | Text |
|---|---|
| Manage `h1` | `Manage grading categories` |
| Manage description | `Create (or remove) grading categories for your school. Categories can then be applied to a class on the class grade settings page` |
| Manage list `h2` | `Grading categories` |
| Details `h1` / tab title | the category name |
| Details `h2` (new category) | `Active classes (0)` |
| Details empty state | `The category has not been added to any active classes` |
| Details URL | `**/manage-grading-categories/*/classes` |

## Files touched

| Layer | Change |
|---|---|
| Selectors | `css.ComproC1.manageGradingCategories` 21 → 32 (5 manage-page, 5 details-page, 1 `rowMenuOpen`) |
| Page object | traps 5 + 6 and a PAGE SCOPING note added to the header; `readText` helper; `getData_pageComponents`, `click_openRowMenu`, `click_closeRowMenu`, `getData_onDetailsPage`, `isDetailsInitialized`, `click_seeDetails`, `getData_detailsPage`, `click_backFromDetails`; `reset_state` gained the details-page and open-menu branches |
| Test file | `TST_GCAT_TC_1`, `TST_GCAT_TC_6`; scope note updated to Req #4/#5/#6/#8 |
| TC repository | both registered `visualTest: false`; module name updated |
| Exec file | both added to `Test` |
| Manual register | `.md` and `.xlsx` rows 24 / 29 → Pass, with Actual Result |

No protected file was touched. No new npm script was needed — the suite already existed.

## Phase 3 — visual assessment

| TC | Data | Decision-table row | Verdict |
|---|---|---|---|
| `TST_GCAT_TC_1` | the school's live category list (names + row count) | Paginated / dynamic counts ❌ | Not a candidate |
| `TST_GCAT_TC_6` | `AutoCat_details_<epoch-ms>`, rendered as the page title | Timestamps ❌ | Not a candidate |

Both carry ❌-row data, so per Invariant 12 they **stay `visualTest: false` with no confirmation
prompt**. This is the fifth consecutive assessment on this page family to reach the same
conclusion, for the same structural reason recorded in session 1: every screen frames a live,
shared, mutable list.

## Note on the `.xlsx`

The repo has **no** xlsx tooling (`exceljs` / `xlsx` are not dependencies, Python is not installed
on this machine). The register was updated by patching `xl/worksheets/sheet1.xml` inside the zip
directly — the workbook uses **inline strings** (no `sharedStrings.xml`), so cell edits are local
and safe. Only that one zip entry was rewritten; everything else is byte-for-byte unchanged. The
result was verified before replacing the tracked file: 9 entries present, XML well-formed, 82 rows,
column order `A…M` intact on both edited rows, tally `Pass=45 / Not Run=35 / Blocked=1` matching
the `.md`. Anyone repeating this should check the file is not open in Excel first — the script
does, and aborts if it is locked.

---

## Correction — 2026-08-19 (from the GSCL session)

Session 1's open item #3 recorded that the **School settings → Manage grading categories** click
"could not be driven through Playwright-MCP (the MCP click did not fire the Angular handler on
`javascript:void(0)` anchors; a JS `.click()` did)".

**That diagnosis was wrong.** It is not an Angular quirk. The Playwright-MCP browser in this
environment does not deliver real input events at all: `page.keyboard.type` produces nothing and
`locator.click()` does not even focus the element, while a JS `.focus()` / `.click()` works
normally. Established while debugging the grading-scales create form on 2026-08-19 — see
`walkthrough_adminGradingScales.test.js_2026-08-19_12h-04m.md`, "Run 2".

The cause matters: **do not write product-level workarounds for it.** The framework's own browser
is unaffected, which is why every suite runs normally.

**Resolved the same day.** It was a stale MCP browser process — restarting Claude Code fixed it,
verified with an input probe. No config change was needed (a `--browser chrome` → `chromium`
switch was tried and then reverted, because `chrome` worked fine once restarted). So if the
School settings dropdown, or any other control, ever stops responding to an MCP click again:
**restart first.** Details in the grading-scales walkthrough, open item 5.

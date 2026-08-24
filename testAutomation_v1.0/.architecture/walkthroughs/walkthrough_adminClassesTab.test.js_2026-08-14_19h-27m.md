# Walkthrough — adminClassesTab.test.js (2026-08-14)

## Task

Automate Requirement #1 ("Verify class tab is loading") and Requirement #2 ("Verify filter
functionality is working fine") from
`test/Manual/C1App/AdminApp-Classes/AdminApp_Classes_tab_test_cases.md` — 6 TCs total:
`TST_CLST_TC_1, TC_2, TC_3, TC_4, TC_19 (Edge), TC_22 (Negative)`. Scoped to Phase 1 (build) of
the `c1-test-authoring` skill.

## Reuse check (ADR-011)

Before writing anything, inspected the existing `P1Adminclassworkflow_Thor` npm script
(`testResources/testExecutionFiles/ExperienceApp/thor/schoolAdminAddClass.json`, module
`ADMINADDCLASS`) — it already has the full school-admin login Before-chain (`launchUrl` →
`TST_LAND_TC_3` → `TST_LOGI_TC_1/2` → `TST_NEMO24306_TC_LOGIN`) and `TST_SADB_TC_1` (open school
"3 July Test School 1" by key `FCN-CHZ-PDA` via `schoolAdminDashboard.click_schoolByKey`). Both
were reused as-is in the new execution file — no redefinition. `schoolClasses.page.js` already
existed with `isInitialized()`, `getData_activeClassCount()`, `click_addClass()` — extended
rather than duplicated.

## Live capture attempt (blocked)

Per the user's explicit choice, attempted a live Playwright-MCP capture on Thor
(`testt1@mailsac.com` / school `FCN-CHZ-PDA`) before writing selectors. Login consistently
looped back to `/login` — Gigya's `afterSubmit` event fired with `isFlowFinalized: true,
reason: "finished"` every time, but the browser never received/kept the session and a
`GET /login?rurl=%2Fadmin%2Fdashboard` request showed the app bouncing back. Console showed
repeated `404`s and `net::ERR_CONNECTION_TIMED_OUT`. Diagnosed as a browser-sandbox limitation
(cross-origin session cookie not persisting in the Claude Browser pane), not a product defect —
the same login flow is proven working by the real Playwright run underlying
`P1Adminclassworkflow_Thor`. Did not spend further budget retrying; selectors were instead
authored from the manual doc's **live-captured product reference** section (explicitly dated
2026-08-14) plus the existing `qid` conventions already in `C1Selectors.json`
(e.g. `schoolClasses.addClassBtn` → `a[qid='aClass-10']`).

## What was built (Phase 1 — build only, no execution)

- **Selectors** (`testResources/selectors/ExperienceApp/C1Selectors.json`):
  - Extended `css.ComproC1.schoolClasses` — `endedClassesHeading`, `searchInput`, `filterLink`,
    `userGuideToggle`, `selectAllCheckbox`, `deleteClassBtn`, 5 left-nav links, 5 table-header
    selectors, `classRow`, `noMatchingClassesText`.
  - New module `css.ComproC1.classFilterModal` — `modalRoot` (`#classSortFilterModal`, taken
    verbatim from the manual doc's captured product reference), `statusOptionByLabel` /
    `statusCheckboxByLabel` / `labelOptionByName` / `selectedLabelChip` templates (`{{status}}` /
    `{{label}}`, same runtime-substitution pattern as `schoolAdminDashboard.schoolLinkByKey`),
    `labelSearchInput`, `clearAllBtn`, `applyBtn`.
- **Page objects**:
  - `pages/ExperienceApp/schoolClasses.page.js` — added `getData_classesTabLayout()` (Req #1),
    `getData_visibleClassRowCount()`, `getData_emptyStateDisplayed()`, `click_filter()` (lazy
    `require` of the new modal page object, ADR-004).
  - New `pages/ExperienceApp/classFilterModal.page.js` — `isInitialized()`,
    `getData_filterOptions()` (Req #2 TC_2), `select_status()`, `select_label()` (types with
    `action.addValue`, Invariant 6 — React-rendered input), `click_clearAll()`, `click_apply()`.
  - No `baseActionLibrary.js` change needed — every interaction (`click`, `addValue`,
    `getElementCount`, `isEnabled`, `waitForDisplayed`) already exists (Invariant 3 n/a).
- **Test file** — new `test/ExperienceApp/adminClassesTab.test.js`, module code **CLST**:
  `TST_CLST_TC_1` (Req #1 layout), `TST_CLST_TC_2` (filter modal options), `TST_CLST_TC_3`
  (status filter), `TST_CLST_TC_4` (label filter), `TST_CLST_TC_19` (Edge — Clear all),
  `TST_CLST_TC_22` (Negative — zero-match empty state).
- **TC repository** — new module block `CLST` in
  `testResources/testcaseRepository/ExperienceApp/C1TCRepository.json`, all 6 TCs registered
  `"visualTest": false` (Invariant 12 — promotion is Phase 3's job, not this session's).
- **Test data** — new `testResources/testcaseData/ExperienceApp/thor/adminClassesTabData.json`
  (`schoolKey`, `status: "Active"`, `label: "VM1"`, `noMatchStatus: "Deleted"` /
  `noMatchLabel: "A11y test"` — the zero-match combo is `[ASSUMED]` per the manual doc itself).
- **Execution file** — new `testResources/testExecutionFiles/ExperienceApp/thor/adminClassesTab.json`,
  a separate suite (read-only Classes-tab checks, kept apart from the class-creation flow which
  mutates data) reusing the login Before-chain + `TST_SADB_TC_1`.
- **npm script** — `P1AdminClassesTab_Thor` added to `package.json` alongside the existing
  `P1Adminclassworkflow_Thor`.

## Verification performed this session

- Every new/edited JSON file (`C1Selectors.json`, `C1TCRepository.json`,
  `adminClassesTabData.json`, `adminClassesTab.json`, `package.json`) parses via `require()`/
  `JSON.parse`.
- Every new/edited JS file (`adminClassesTab.test.js`, `classFilterModal.page.js`,
  `schoolClasses.page.js`) passes `node -c` syntax check.
- **Not yet run against the live app** — that is Phase 2, deliberately deferred (recommended in
  a fresh session per the skill).

## Known risk for Phase 2 (flagged in `authoring-status.md`)

Because live DOM capture was blocked, these selectors are best-effort and most likely to need
correction on the first real run:
- `schoolClasses.filterLink` / `userGuideToggle` / `selectAllCheckbox` — text/structure-based
  guesses, no confirmed `qid`.
- `classFilterModal.statusCheckboxByLabel` / `labelOptionByName` / `selectedLabelChip` — the
  modal's internal DOM structure (checkbox vs. chip vs. text-only option) was not observed live.
- `schoolClasses.noMatchingClassesText` — the manual doc marks the exact empty-state copy
  `[ASSUMED]` itself; the regex fallback (`/No (classes|matching classes) found/i`) is a guess.
- `TST_CLST_TC_4` / `TC_19` — depend on a class actually carrying the label `VM1` in the current
  Thor school; the manual doc notes this should be confirmed before running.

## Next step

Phase 2 (run & fix): `npm run P1AdminClassesTab_Thor`, expect selector corrections on the
`classFilterModal` internals and possibly `schoolClasses.filterLink`/`userGuideToggle`; propose
each fix and wait for confirmation before editing (Invariant 9). Recommended as a fresh session
per the skill's phase-per-session guidance.

---

# Phase 2 (Run & Fix) — 2026-08-15

**Result: 2/6 → 6/6 passing, three consecutive clean runs (40s / 39s / 32s), down from 3m32s.**
No protected files modified. `package.json` untouched (`P1AdminClassesTab_Thor` already existed).

## Starting point

First-ever live run of the Phase 1 build: **2 passing, 4 failing**. As predicted in the Phase 1
"Known risk" note, the blocked live capture meant selectors/timeouts/data were hypotheses. What
was *not* predicted: most selectors were actually correct — including `noMatchingClassesText`,
the one explicitly marked `[ASSUMED]`. The real causes were elsewhere.

## Root causes (all verified live, not inferred)

1. **Every timeout in `classFilterModal.page.js` was 1000 ms** (13 sites; every other page object
   uses 5000/10000). Measured the panel close after Apply: `show` drops at **3371 ms**,
   `display:none` at **3609 ms**. Bootstrap holds `display:block` at `opacity:0` through the fade
   and Playwright counts that as *visible*, so the 1 s budget expired mid-animation.
   → TC_3, TC_4, TC_22.
2. **`reset_filters` never ran its clear.** `#classSortFilterModal` stays in the DOM when closed,
   so `getElementCount > 0` was always true → always clicked the hidden close button →
   actionability timeout → threw → swallowed by `catch` → the page-level Clear click never ran.
3. **Filter state persists server-side** (see product-knowledge). An AfterEach-only reset cannot
   protect against state left by a previous *run*, so the reset now also runs in **BeforeEach**.
4. **`select_label` never clicked the input.** The Angular combobox opens its dropdown on
   focus/click; the panel persists between TCs, so on the 2nd+ call the field was already focused,
   no focus event fired, and the list never opened. This is why it never reproduced by hand —
   every manual repro clicked the field first.
5. **`click_close` was silently failing** — returned `TimeoutError`, unasserted by TC_2, masked by
   the AfterEach reset, costing 15.5 s/run. TC_2 now asserts it and takes **0.87 s**.
6. **Two genuinely wrong selectors.** `selectAllCheckbox` was `input[type='checkbox']`, which
   matches the **Administrator/Teacher header toggle** when the list is empty — TC_1 had been
   asserting against the wrong element. → `input#select-all-classes-checkbox`.
   `deleteClassBtn` → `button[qid='dBulkClass-1']`.
7. **TC_19's data was impossible.** The label search is scoped by selected status; `Active` + `VM1`
   matches zero classes so the suggestion list could never render. TC_19 given its own co-existing
   pair (`Active` + `sarthak1`); each TC now uses a distinct label, since selecting the same label
   twice in a session is the fragile path.

## Assertions that were not testing anything

- **TC_4:** `count >= 0` — true for every possible value. Now asserts the filter was applied and
  the list is in exactly one valid state (populated *or* empty state).
- **TC_3:** `rows === heading`. "Load more …" (`a[qid='aClass-8']`) means the list lazy-loads, so
  equality breaks on any school with more active classes than one page. Now: filter-applied signal
  + `rows <= heading`.
- **TC_2:** `click_close()` was fire-and-forget — now asserted.
- Added `schoolClasses.getData_filterApplied()`; `getData_emptyStateDisplayed()` is now
  visibility-based (two `<empty-class-state>` nodes exist — active visible, ended hidden).

## Open items (deliberately left)

- **The X close button is a product bug**, not a test bug — click reports success, panel stays
  open, re-click resolves. `click_close()` carries a **retry as an authorised workaround** (user
  decision 2026-08-15: leave the suite green, revisit once the app is fixed). Remove the retry then.
- **Filter persistence** marked `[UNCONFIRMED — product decision pending 2026-08-17]`. Reproduced
  manually end-to-end with the user (reload → logout/login → different browser). Likely a feature;
  the open question is whether persisting a filter that renders "No classes" across devices is the
  intended *experience*.
- `TST_CLST_TC_RESET` violates the `TST_<MOD>_TC_<N>` ID convention (`RESET` is not a number).
- `userGuideToggle`, left-nav and table-header selectors are still loose text matches (passing,
  but not `qid`-based).
- `label: "VM1"` (TC_4) matches no active class, so TC_4 exercises the empty-state path.

## Process lessons promoted to durable docs

Rather than leaving these in this walkthrough, they were written into the always-loaded docs:

- `ARCHITECTURE-INVARIANTS.md` — amended **#1** (element count ≠ visibility; `opacity:0` is still
  visible; never invent a timeout) and **#6** (click the field before typing into a combobox);
  added **#13** (assertions must be able to fail; cleanup must never hide) and **#14** (a test must
  never route around a product defect; resilience belongs in setup/teardown; missing test data is a
  question, not a decision).
- `.agent/skills/c1-test-authoring/phases/1-build.md` — blocked live capture is a **blocker to
  raise**, not a reason to author from a document.
- `.agent/skills/c1-test-authoring/phases/2-run-fix.md` — debugging protocol (instrument before
  hypothesising; if it works by hand, diff the action sequences; suspect shared state; verify data
  against the live app; a green suite is not automatically a correct suite) + expanded exit checklist.
- `.architecture/product-knowledge/ExperienceApp.md` — full Classes-tab / Filter-panel section
  including both known bugs and the measured timings.

## Pending

- **Phase 3 (visual assessment)** — still pending and mandatory; the feature is not closed even
  though the suite is green. Recommended in a fresh session.
- `authoring-status.md` block for `adminClassesTab` to be updated to Phase 2 ✅ / Phase 3 ⬜.

---

# Phase 3 (Visual Assessment) — 2026-08-15

**Outcome: assessed, NO visual candidates.** All 7 TCs map to a ❌ row of the AGENTS.md §8
decision table, so per Rule A this was not a judgment call — no user confirmation sought, no
promotion, and **no `visualAcceptance_*` script created** (Rule B applies only if a TC is
promoted). The TC repository already had all 7 at `visualTest: false`; no file change needed.

| TC | Data on the captured screen | Decision-table row | Decision |
|---|---|---|---|
| TST_CLST_TC_1 | `Active classes (16)`, `Ended classes (25)`, 16 rows of class names / keys / dates | Paginated-dynamic counts; user-generated keys; timestamps | false |
| TST_CLST_TC_2 | Panel labels static, but it covers ~40% of the viewport — the live class list and counts remain visible behind it | Paginated / dynamic counts (background) | false |
| TST_CLST_TC_3 | Filtered list + `Active classes (N)` heading | Paginated / dynamic counts | false |
| TST_CLST_TC_4 | Label `VM1`; empty-state text embeds the label name | User-generated keys | false |
| TST_CLST_TC_19 | Label `sarthak1`; ends on the unfiltered list with live counts | User-generated keys; dynamic counts | false |
| TST_CLST_TC_22 | Empty state renders `No classes that are Deleted, A11y test` — template + user-generated label names | User-generated keys | false |
| TST_CLST_TC_RESET | Housekeeping hook — no assertions, no meaningful captured state | n/a — not a functional TC | false |

**Only arguable case — TST_CLST_TC_2.** The Filter panel's own contents are genuinely static
(fixed status labels `Not started/Active/Ended/Expired/Deleted`, "Find a label", "Clear all",
"Apply"). It fails purely because a screenshot captures the whole viewport and the class list
with its live counts sits behind the panel. This follows the precedent set by the sibling
feature, where `TST_CCLS_TC_4`'s static dialog text was outweighed by the dynamic screen around
it. Presented to the user as overrulable; not overruled.

**Feature CLOSED.** Phase 1 (build) ⚠️→✅, Phase 2 (run/fix, 6/6, 3 consecutive clean runs) ✅,
Phase 3 (visual assessment, no candidates) ✅. Block removed from `authoring-status.md`.

## Carried forward (not blockers to merge)

- **Product bug — Filter panel X close.** Workaround retry in `classFilterModal.click_close()`,
  marked `// WORKAROUND`. Remove it once the app is fixed so TST_CLST_TC_2 catches the defect.
- **Filter persistence** `[UNCONFIRMED — product decision pending 2026-08-17]`.
- `TST_CLST_TC_RESET` does not match the `TST_<MOD>_TC_<N>` ID convention.
- `userGuideToggle`, left-nav and table-header selectors remain loose text matches.

---

# Session 2 — 2026-08-17 (Req #9 search + Req #27 sort)

## Task

Continue automating `test/Manual/C1App/AdminApp-Classes/AdminApp_Classes_tab_test_cases.md`.
Batch agreed with the user before starting: **Requirement #9** (search for class name / class
key) and **Requirement #27** (sort by class name / start date / end date) — 6 TCs:
`TST_CLST_TC_5, TC_6` (P), `TC_7, TC_8` (P), `TC_18` (Edge), `TC_21` (Negative).

Rationale for this batch over the alternatives: it needs **no new infrastructure** (same page,
module CLST, test file, exec file, npm script, page object), it is **read-only** on shared Thor
data, and both requirements are served by **one** new page-object getter (`getData_classRows`) —
search needs the row values to prove the list narrowed, sort needs the same values to prove the
order changed. Deferred: BCCF (asynchronous creation, overlaps `TST_CCLS_*`), CMGT delete
(destructive), GCAT/GSCL (create against a school-level maximum — needs a data-lifecycle
decision), CTXC (blocked: no creation entry point, needs teacher/student accounts).

## Two open items resolved by the user up front

- **Filter persistence** `[UNCONFIRMED]` → **confirmed INTENDED behaviour**. Product knowledge
  updated from `[UNCONFIRMED — decision pending]` to `[CONFIRMED — INTENDED]`. The Before/After
  each reset stays regardless: intended or not, the suite cannot assume a clean start.
- **Filter panel X close** is fixed in the app, but the user chose to **keep the
  `// WORKAROUND` retry for now**. Left untouched.

## Live capture — succeeded this time (contrast with session 1)

Session 1 was blocked at login and shipped Phase 1 unverified, which cost ~15 debug runs. This
session used the documented `tooling/playwright-mcp/README.md` flow instead: the **user logged
in manually** in the headed MCP browser (the agent never handles credentials), then exploration
proceeded on the restored session.

One wrinkle worth recording: **deep-linking to `/admin/admin/org_<slug>/class` returns
`/dashboard/error`** even when authenticated — the school context must be set by clicking the
school card (`a.inst-link[aria-label*="<key>"]`), exactly as `TST_SADB_TC_1` does. Navigate to
`/dashboard` first, then click through.

## Findings from the live app (all now in product-knowledge/ExperienceApp.md)

1. **Search is submit-driven, not live/debounced.** Typing alone does not filter; the
   `button[qid='aClass-2']` click is required. Settles ~1.0-1.2 s.
2. **Search is case-insensitive and partial-matching** — resolves the `[ASSUMED]` in `TC_18`.
3. **No-results copy echoes the term**: `No classes that match your search <term>` — resolves
   the `[ASSUMED]` in `TC_21`. Asserting the echoed term ties the empty state to *this* search.
4. **The search term persists SERVER-SIDE, exactly like the filter** — verified by a full page
   reload that came back still narrowed to one class. **This is the finding with the biggest
   test-design consequence:** without clearing it, the search TCs would hand the sort TCs a
   one-row list to sort, and the term would leak into the next run days later.
   `TST_CLST_TC_RESET` now clears search as well as filter.
5. **The sort status label is OPTIMISTIC UI.** Measured: the sr-only
   "sorted ascending"/"sorted descending" label flips in **~90-120 ms**, but the **rows only
   re-order at ~1.2-3.2 s**. Waiting on the label then reading the rows reads the *previous*
   order. The page object therefore waits on a **row-content fingerprint**, never the label.
   (Directly in the spirit of Invariant 1: the transition was measured, not guessed.)
6. **Sort collation is by CODE POINT**, not locale: `(` < `A` < `S` < `T` < `c` < `t`, and
   `test Class 14 aug 2` < `testClass1` (space before `C`). A `localeCompare` assertion would
   have failed against the real product.
7. **Sorting does NOT persist** across a page load — unlike filter and search. Within a session
   it survives between TCs, so `TC_7` deliberately does not assume the first click is ascending.
8. **Class key is not sortable** (its header is a disabled `span`, not a button).

## Changes Made

### 1. `testResources/selectors/ExperienceApp/C1Selectors.json` (`css.ComproC1.schoolClasses`)

- Added: `searchBtn`, `sortByClassNameBtn/StartDateBtn/EndDateBtn`,
  `sortStatusClassName/StartDate/EndDate`, and the four row-cell templates
  `rowClassNameByIndex` / `rowClassKeyByIndex` / `rowStartDateByIndex` / `rowEndDateByIndex`
  (`{{n}}` = 0-based row index, same template pattern as `statusOptionByLabel`).
- **Cleared a carried-forward item:** `searchInput` moved from a placeholder match to
  `input[qid='aClass-1']`, and the five `tableHeader*` selectors moved from loose
  `:text-is("...")` matches to `#class-col-*-ACTIVE_SECTION` ids. The old text matches were also
  section-blind (`:text-is("Start date")` matched the Ended table too).

### 2. `pages/ExperienceApp/schoolClasses.page.js`

- Module-level `readListSignature()` + `waitForListChange()` — the measured settle-poll
  described in finding 5. Comment records the measurements so the budget is defensible.
- `search_class(term)`, `clear_search()`, `click_sortBy(column)`, `getData_classRows()`,
  `getData_sortStatus()`, `getData_emptyStateText()`.
- No new action-library capability was needed: row cells carry stable indexed ids, so each
  field is read through an ordinary selector rather than a DOM-order `nth()` (Invariant 3).
  **No protected file was touched.**

### 3. `test/ExperienceApp/adminClassesTab.test.js`

- `TST_CLST_TC_5, TC_6, TC_7, TC_8, TC_18, TC_21`.
- `TST_CLST_TC_RESET` extended with `clear_search()` (finding 4).
- Local pure-comparison helpers (`compareText`, `compareDate`, `isSortedBy`) — no DOM access.
- Assertion design notes: `TC_6` asserts **exactly 1** row (a key is unique — that is what
  proves it matched the key and not a broad text match); `TC_7` asserts the direction *flips*
  and that descending is the *exact reverse* of ascending (names are unique); `TC_8` asserts
  only **monotonic** ordering and the flip, because six classes share `Aug 14, 2026` and ties
  make an exact reversal undefined.

### 4. TC repository / execution file / test data

- Six TCs registered, all `visualTest: false`. Module description widened to Req #1/#2/#9/#27.
- Six data values added under `C1.adminClassesTab`.

## Run output (Phase 1 exit criterion — actually executed)

`npm run P1AdminClassesTab_Thor` — **12 passing, 0 failing (85.3 s)**, first run, no fixes:

```
PASS  TST_CLST_TC_1   120ms    PASS  TST_CLST_TC_18   1313ms
PASS  TST_CLST_TC_2  1098ms    PASS  TST_CLST_TC_21   1607ms
PASS  TST_CLST_TC_3  3619ms    PASS  TST_CLST_TC_7    3181ms
PASS  TST_CLST_TC_4  4627ms    PASS  TST_CLST_TC_8    6358ms
PASS  TST_CLST_TC_5  1625ms    PASS  TST_CLST_TC_19   2334ms
PASS  TST_CLST_TC_6  1513ms    PASS  TST_CLST_TC_22   3457ms
[run] suites=1 tests=12 passes=12 failures=0 pending=0 (85341ms)
```

The six pre-existing TCs still pass, so the `searchInput` / `tableHeader*` selector swap caused
no regression. Contrast with session 1's first run (2/6) — the difference is that every
selector, timeout and data value here met the live app during Phase 1.

## Carried forward

- **Product bug — Filter panel X close.** Fixed in the app; the `// WORKAROUND` retry in
  `classFilterModal.click_close()` is retained **by explicit user decision (2026-08-17)**.
  Remove it when the user says so, so `TST_CLST_TC_2` catches the defect again.
- `TST_CLST_TC_RESET` still does not match the `TST_<MOD>_TC_<N>` ID convention.
- `userGuideToggle` and the left-nav selectors are still loose text matches (the table-header
  ones were fixed this session).
- **Remaining in this manual doc:** 22 requirements / ~63 TCs. Next natural batch is the rest of
  module CLST (read-only): expand/collapse row (#18), user guide (#17/#33), launch class (#19),
  Active/Ended sections (#28), ended-class launch (#29), load more (#20) —
  `TC_9-TC_17, TC_20`, 10 TCs. That would close the CLST test file.

## Phase 2 (run & fix) — 2026-08-17

**Outcome: 12 passing / 0 failing, 5 clean runs. No test ever failed.** The two changes made
were *hardening* surfaced by the phase's mandatory audits, not fixes for failures. Both were
proposed to the user and confirmed before editing (golden rule 6).

### Run log

| Run | Code | Result | Suite time | Notes |
|---|---|---|---|---|
| 1 | initial | 12/12 | 85.3 s | Phase 1 exit run |
| 2 | initial | 12/12 | 80.8 s | |
| 3 | initial | 12/12 | 147.6 s | Thor latency degraded from here on |
| 4 | + both fixes | 12/12 | 129.5 s | |
| 5 | + both fixes | 12/12 | 125.0 s | 2nd consecutive clean run on final code |

### Fix (a) — TST_CLST_TC_RESET ordering (found by a user question, not by a failure)

The user asked why the search was not cleared after `TST_CLST_TC_21`. It *was* — but in the
wrong order. `TST_CLST_TC_RESET` called `reset_filters()` then `clear_search()`, and
`reset_filters()` **ends by waiting for the class grid to repopulate**
(`waitForDisplayed(classRow, 20000)`). After TC_21 the grid is empty *because of the search*,
so that wait could not succeed and burned its full 20 s budget on every run.

**Why it hid for three green runs:** `action.waitForDisplayed` **returns** the caught error
rather than throwing (the standard action-library contract, ADR-009), so the `try/catch` inside
`reset_filters` never fired and **nothing was logged**. The only symptom was ~20 s of
unexplained suite time. A `catch` that never runs is not evidence of success.

Fix: `clear_search()` first, then `reset_filters()`. TC_22 also ends on zero rows, but there
the cause is a *filter*, which `reset_filters` clears before it waits — hence only TC_21 stalled.

### Fix (b) — vacuous-pass guard in TST_CLST_TC_7 / TC_8

The exit checklist requires re-reading every assertion and asking *what input would make this
fail?* `isSortedBy()` compares adjacent pairs, so a 0- or 1-row list satisfies it without
comparing anything, and TC_7's exact-reverse check would compare `[]` against `[]`. Both TCs now
assert the row count is unchanged across the sort — a real product invariant (sorting reorders
rows, it never adds or drops them), which also makes the ordering assertions non-vacuous.

### Measurement caveat (recorded so the numbers are not over-read later)

Thor's latency degraded during run 3 and stayed degraded, so runs 1-2 are not a fair baseline
for the fix. Like-for-like (slow Thor): 147.6 s before → 125-130 s after, ≈20 s saved, matching
the prediction. Treat that as *consistent with* the fix rather than proof — the old code could
not be re-run under today's latency.

**Do not use mochawesome's per-hook durations for this kind of analysis** — they are internally
inconsistent here (it reported a 15 ms `beforeEach` for a hook that runs a full reset, alongside
a 33 s `afterEach` aggregate). Total suite duration is the reliable figure.

### Observation for the user — the retained WORKAROUND now has a measurable cost

`TST_CLST_TC_2` went from ~1.0 s (runs 1-2) to a consistent ~5.9 s (runs 3-5). That is the
`// WORKAROUND` retry in `classFilterModal.click_close()` re-clicking on a slower environment.
The user has stated the app-side fix has landed but chose to keep the retry for now; removing it
should recover ~5 s per run *and* restore TC_2's ability to catch the defect (Invariant 14).

### Exit checklist

- [x] All TCs passing; real output shown; 2 consecutive clean runs on the final code.
- [x] Every assertion falsifiable — audited TC by TC; the two vacuity holes found were closed.
- [x] No product defect worked around silently; the one authorised workaround stays marked
      `// WORKAROUND` and its cost is now quantified above.
- [x] No missing/invalid test data — every value was verified against the live app in Phase 1.
- [x] Both fixes proposed and confirmed before editing; inline comments explain the *why*.
- [x] `authoring-status.md` updated: Phase 2 ✅, Phase 3 ⬜.
- [ ] **Phase 3 (visual) still pending and mandatory** — the feature is NOT closed. Expected
      outcome is "no candidates" (every TC reads class names, keys, dates and live counts), but
      that assessment plus explicit user confirmation is required. Recommend a fresh session.

## Phase 3 (visual assessment) — 2026-08-17

**Outcome: assessed, NO candidates. All 6 new TCs stay `visualTest: false`.** No promotion, so
no `visualAcceptance_*` script was added and `package.json` (protected) was NOT touched.

Per AGENTS.md §8 Rule A, a TC whose data hits any ❌ row stays `false` **without asking the
user** — it is not a judgment call. None of the six reached ✅, so Rule A Step 1/Step 2
(assessment block → "validate" → promotion confirmation) never applied, and Rules B/C
(dual scripts) did not trigger.

| TC | Data visible in the captured viewport | Decision-table row(s) | Decision |
|---|---|---|---|
| TST_CLST_TC_5 | class key `97Cc-y7bs`, start/end dates, `Active classes (N)` | User-generated keys; Timestamps/dates; Paginated/dynamic counts | ❌ false |
| TST_CLST_TC_6 | class key is the asserted value; dates; counts | User-generated keys | ❌ false |
| TST_CLST_TC_7 | all 15 rows — names, keys, dates, live counts | User-generated keys; Timestamps/dates; Paginated/dynamic counts | ❌ false |
| TST_CLST_TC_8 | start/end date columns are the asserted values; counts | Timestamps/dates | ❌ false |
| TST_CLST_TC_18 | same surface as TC_5 | User-generated keys; Timestamps/dates | ❌ false |
| TST_CLST_TC_21 | empty-state term is static, but left nav `Classes (N)` + `Ended classes (N)` are in frame | Paginated/dynamic counts | ❌ false |

**Only arguable case — TST_CLST_TC_21.** Its empty-state copy
(`No classes that match your search zzz-no-such-class-9999`) is genuinely static: the term is a
fixed literal from the data file, not a user-generated value. It still fails on the surrounding
viewport — the left nav carries the school's total class count and the Ended section its own
count, and both move whenever classes are created or deleted on this shared school. This is the
same reasoning that rejected `TST_CLST_TC_2` (static filter panel, live list behind it) and
`TST_CLST_TC_22` (zero-match filter empty state) in session 1 — consistent precedent, not a new
call.

Worth noting for any future re-assessment: the whole Classes tab is a poor visual-testing
surface by construction. Every screen in this module frames at least one live count, and the
school is shared and mutated by other test suites. A visual baseline here would fail on data
churn rather than on UI regression.

### Exit checklist

- [x] Every TC has an explicit decision (all 6 stay `false`, each with its decision-table row).
- [x] Nothing promoted ⇒ no dual scripts, no protected-file change.
- [x] `authoring-status.md` block REMOVED (the file holds in-flight work only).
- [x] Walkthrough records each decision and the basis for it.

**FEATURE CLOSED** — Phase 1 ✅ (12/12 first run), Phase 2 ✅ (5 clean runs, 2 consecutive on
final code), Phase 3 ✅ (assessed, no candidates).

### Carried forward to the next batch

- **X-close `// WORKAROUND`** in `classFilterModal.click_close()` — the user reports the app fix
  has landed but chose to keep the retry for now. It now costs a measurable ~5 s per run
  (TST_CLST_TC_2: ~1.0 s → ~5.9 s on current Thor latency). Removing it recovers that *and*
  restores TC_2's ability to catch the defect (Invariant 14).
- `TST_CLST_TC_RESET` still does not match the `TST_<MOD>_TC_<N>` ID convention.
- `userGuideToggle` and left-nav selectors are still loose text matches (table headers fixed).
- **Untracked `tooling/` at the WORKTREE ROOT** holds the Playwright-MCP Chrome profile with a
  live Cambridge One session. The ignore rule lives in `testAutomation_v1.0/.gitignore` and
  covers only that subdirectory, so this copy is **not ignored**. Must not be committed —
  suggested fix: add `/tooling/` to the worktree-root `.gitignore`.
- **Next batch (proposed):** the rest of module CLST, all read-only — expand/collapse class row
  (#18), user guide (#17/#33), launch a class (#19), Active/Ended sections (#28), ended-class
  launch (#29), load more (#20) = `TST_CLST_TC_9-TC_17, TC_20`, 10 TCs. Closes the CLST file.
  Remaining after that: 20 requirements / ~53 TCs across GCAT, BCCF, GSCL, CMGT, CGST, CLON, CTXC.

---

# Session 3 — 2026-08-17 (Req #18 / #17 / #33 / #19 / #28 / #29 / #20)

## Task

Close out module CLST: the remaining 10 read-only TCs —
`TST_CLST_TC_9, TC_10` (expand/collapse class row), `TC_11, TC_12` (user guide),
`TC_13` (launch class), `TC_14, TC_15` (Active/Ended sections), `TC_16` (launch ended class),
`TC_17, TC_20` (load more). Suite is now **22 TCs, all passing**.

## Reuse check (ADR-011)

`TC_13`/`TC_16` navigate to the class page. `activeClass.page.js` already models it
(`isInitialized()` anchors on the Actions button `cView-70`), so it was reused via a lazy
require rather than adding a page object.

## Live findings (all now in product-knowledge/ExperienceApp.md)

1. **The Ended section is collapsed on load and renders NOTHING until expanded** — a fresh tab
   has zero `ENDED_SECTION` rows and no "Load more" link. Rows arrive ~1.0s after expanding.
2. **The `Ended classes (N)` count is fetched WITH the rows.** While collapsed the heading is a
   bare "Ended classes" and the count never arrives (polled 10s); it appears ~0.9s after
   expanding. This failed `TC_14` on the first run.
3. **"Load more" is REMOVED from the DOM** when exhausted (not disabled) — resolves the
   `[ASSUMED]` in `TC_20`. Page size 20; new rows land ~3.5s after the click.
4. **Loaded rows survive collapse/re-expand** (26 stayed 26, link stayed gone). Only a page
   reload restores first-page state — which is how `TC_17` and `TC_20` stay independent.
5. **Row-details expand is a Bootstrap collapse with a ~700ms `collapsing` phase, and the panel
   keeps its content in the DOM while collapsed.** Element counts cannot distinguish the
   states, and waiting on the panel is not enough — Playwright calls it visible partway through
   the expand while inner content is still clipped to zero height. This failed `TC_9`.
6. The **user guide panel is REMOVED from the DOM** when collapsed, unlike the row-details panel
   and the filter modal.
7. Class status values: **Ended / Expired / Deleted** (the manual doc recorded only "Expired").
8. A deep link to `/admin/admin/org_<slug>/class` returns `/dashboard/error` — school context
   must be set by clicking the school card first.

## Three failures, three fixes (each proposed and user-confirmed before editing)

| # | TC | Cause | Fix |
|---|---|---|---|
| 1 | TC_9 | Waited on the panel; Playwright saw it "visible" mid-animation while the inner heading was clipped | Wait on a CONTENT element (`h3.class-label-heading`) |
| 2 | TC_14 | Asserted the ended count before expanding; the app only fetches it with the rows | Expand first, then assert count/note/status column |
| 3 | TC_7 | Asserted descending is the exact reverse of ascending | Only assert that when the whole list is visible AND names are unique |

**Failure 3 is the instructive one.** `TC_7` passed for two sessions, then began failing with no
code change. Cause: the shared school grew from **15 to 26 active classes** (another suite
creating `AutoClass_CreateOnly` classes), which crossed the **20-row page size** — so ascending
and descending became two different windows onto a larger set and could never be reverses. The
duplicate names broke the second assumption at the same time. The product was correct
throughout; two of my assumptions expired. The lazy-load caveat was already documented and
already respected by `TC_3` — I simply failed to apply it to sorting.

A related self-inflicted one on the way: `getData_rowDetails` read counts from the first
`.font-weight-bold`, which is "Course materials" on any row that HAS materials. It read
correctly during capture only because row 0 happened to have none; once the sort TCs reordered
the list it broke. Selector built from one unrepresentative row + `getText` returning only the
first match.

### The recurring pattern across this whole feature

Five bugs, one root cause — **the app signals ready before it is**:

| Where | Wrong signal | Right signal |
|---|---|---|
| Filter panel close | element count | visibility (`display:none` persists) |
| Sort direction | optimistic label (~100ms) | row content (~1.2-3.2s) |
| Row details expand | container visible mid-animation | a content element |
| Row details counts | first `.font-weight-bold` | the whole panel's text |
| Ended count | read on load | read after expanding |

## Run output

`npm run P1AdminClassesTab_Thor` — after the fixes, **22 passing / 0 failing, twice
consecutively** (169.6s, 151.3s). `TC_7` logs why the strongest check is inapplicable rather
than skipping silently:

```
TC_7 exact-reverse check not applicable — visible 20 of 26 active classes, unique names: false
22 passing (3m)
[run] suites=1 tests=22 passes=22 failures=0 pending=0
```

## Phase 3 — visual assessment: NO CANDIDATES

All 10 new TCs stay `visualTest: false`; nothing promoted, no `visualAcceptance_*` script,
`package.json` untouched. Per AGENTS.md §8 a ❌ row means `false` without asking the user.

| TC | Data in frame | Row | Decision |
|---|---|---|---|
| TC_9 / TC_10 | Students/Teachers counts, class names, materials | Paginated/dynamic counts | ❌ false |
| TC_11 / TC_12 | guide copy is static, but the live class list and counts sit behind it | Paginated/dynamic counts | ❌ false |
| TC_13 / TC_16 | class page for a specific class | User-generated keys | ❌ false |
| TC_14 | Active (N) and Ended (N) counts | Paginated/dynamic counts | ❌ false |
| TC_15 | Ended (N) count, ended rows | Paginated/dynamic counts | ❌ false |
| TC_17 / TC_20 | row counts before/after loading | Paginated/dynamic counts | ❌ false |

`TC_11`/`TC_12` are the only arguable ones — the user-guide copy is genuinely fixed text — but
they fail for the same reason `TC_2` did in session 1: a screenshot captures the whole viewport,
and the live class list sits behind the panel. Consistent with precedent, not a new call.

> Third session running, same conclusion: **the Classes tab is structurally a poor
> visual-testing surface.** Every screen in this module frames at least one live count, and the
> school is shared and mutated by other suites. A baseline here fails on data churn, not on UI
> regression. Worth treating as settled rather than re-litigating per TC.

**MODULE CLST COMPLETE** — 22 TCs, Req #1, #2, #9, #27, #18, #17/#33, #19, #28, #29, #20.
Phases 1-3 all ✅.

## Carried forward

- **X-close `// WORKAROUND`** in `classFilterModal.click_close()` — retained by user decision;
  costs ~5s per run and suppresses TC_2's ability to catch the defect.
- `TST_CLST_TC_RESET` still does not match the `TST_<MOD>_TC_<N>` convention.
- `leftNav*` selectors are still loose text matches (search, table-header and user-guide ones
  were fixed across sessions 2-3).
- **Untracked `tooling/` at the worktree root** holds the Playwright-MCP Chrome profile with a
  live session; not covered by `testAutomation_v1.0/.gitignore`. Must not be committed.
- **Manual test cases (md + xlsx) not yet updated for these 10 TCs** — still show 12 Pass /
  69 Not Run; should become 22 Pass / 59 Not Run, and `TC_20`'s `[ASSUMED]` is now resolved.
- **Remaining in the manual doc:** 20 requirements / ~59 TCs across GCAT, BCCF, GSCL, CMGT,
  CGST, CLON, CTXC. All involve creating or deleting real data, or (CTXC) are blocked pending
  product clarification — a different risk profile from everything done so far.

---

# Session 4 — 2026-08-21 (screenshot evidence, TC_2/TC_23 split, X-close re-diagnosis)

## Task

Started as a handoff review (`HANDOFF_adminClasses_2026-08-20_evening.md`, which recommended
CLON TC_1 + TC_3). Never reached CLON — the user spotted that **the search TCs' report
screenshots showed no search result**, and that became the session.

## 1. Screenshot evidence was being erased by AfterEach (the user's find)

`TST_CLST_TC_RESET` was registered in **both** `BeforeEach` and **`AfterEach`**.

The mochawesome screenshot is taken in a **root-level `afterEach`**
(`core/runner/playwright.setup.js`), and mocha runs root hooks **last**. So every run did:

```
TST_CLST_TC_5 asserts the filtered list  ->  AfterEach RESET clears the search  ->  screenshot
```

The image therefore showed the **full unfiltered list** for every search and filter TC —
`TC_3, TC_4, TC_5, TC_6, TC_18, TC_21, TC_22`. The tests were correct and passing; only the
evidence was worthless, and worthless exactly when a failure would need it.

**Fix:** moved the entry from `AfterEach` to the (previously empty) suite-level `After`.
`BeforeEach` untouched, so per-TC isolation is unchanged; the `After` copy still stops the
search/filter term leaking into the next run. This is ADR-019 / working agreement #7 — the rule
was already written, just not applied to this exec file.

Verified 22/22, and TC_21's image now shows *"No classes that match your search
zzz-no-such-class-9999"*; TC_6's shows `Active classes (1)` with the single matching row.

## 2. TST_CLST_TC_2 split into TC_2 (open) + TC_23 (close)

Same root problem: TC_2 opened the panel, asserted its options, then closed it — so its
end-of-test screenshot showed a **closed** panel. TC_2 now ends with the panel open; the new
`TST_CLST_TC_23` owns the close.

`TC_23` opens the modal **itself** rather than inheriting TC_2's: the `BeforeEach` reset closes
any open panel between TCs (`reset_filters` gates on panel visibility), so chaining is not
possible without deleting a `BeforeEach` that protects all 23 TCs. Re-opening costs ~1s. It is
also listed immediately after TC_2 in the exec file so the report shows the open panel one row
above — a **readability** benefit, not a dependency.

**Four assertions, and why each is needed:**

1. panel VISIBLE before the click — else "not visible" at the end is satisfied by a panel that
   never opened, and the TC could not fail;
2. gone after ONE click;
3. **no filter applied** (`getData_filterApplied()` — the page-level Clear link) — the one that
   matters, because **Apply also closes the panel**, so without it the TC would still pass if X
   silently started applying the selection;
4. class row count unchanged.

Added `classFilterModal.getData_modalDisplayed()` (additive) because
`getData_filterOptions().modalDisplayed` uses `getElementCount() > 0` and
**`#classSortFilterModal` stays in the DOM when closed** — that reading is always `true` and can
never fail. Same trap that broke `reset_filters` on 2026-08-15.

The close TC's screenshot is **inherently weak** (a closed panel looks identical to one that
never opened). Its evidence is the assertions; TC_2's image, one row above, carries the visual.

## 3. The X-close "product defect" was NOT a product defect

The 3x re-click `// WORKAROUND` (added 2026-08-15, retained by user decision) was removed after
the user reported the app fixed. `TST_CLST_TC_23` then failed **5 times running**. Two
hypotheses were formed and **both were wrong**:

- *"the click lands mid slide-in animation"* — wrong: `action.click()` is `locator.click()`,
  which already waits for geometric stability.
- *"X only works on the panel's first open"* — wrong: TC_23 fails alone, on a first open.

A third guess was not made. A **live diagnostic** was written instead (temporary
`_scratch_diag.test.js`, since deleted), which found:

| Probe | Result |
|---|---|
| `elementFromPoint` at the X centre | the button itself; `pointer-events: auto`, not disabled, nothing overlapping |
| locator.click / real mouse / dispatchEvent / focus+Enter, **after an 800ms settle** | **4/4 closed** |
| `click_close()` itself, after a settle | **3/3 closed**, `{pageStatus:true}` |
| the reverse `waitForDisplayed(..., hidden)` | correct |

So **the click, the button and the check were all fine.** The only difference was an 800ms wait
after opening. The panel is visible and geometrically stable **before its close handler is
bound**, and a bound listener is not observable from the DOM — so Playwright cannot wait for it,
and automation was simply clicking too early. A human never is (user: 10/10 manual single clicks
closed it).

**An intermediate fix that failed, recorded because the reasoning error is the lesson:** the
close was first preceded by `getData_filterOptions()` on the theory that its five reads bought
~300ms. They buy ~20ms — `locator.count()` returns immediately — and the TC still failed 3/3.
The reads were kept (they assert something true and cheap) but their comment was corrected; the
real wait is the settle inside `click_close()`.

**`browser.pause(800)` in `click_close()` is a BUDGET, not a measurement.** The threshold was
never measured — 300ms might do, and 800ms might one day be short. It is NOT the old retry: the
click still gets exactly one attempt, so a genuine X-close regression still fails TC_23.

Verified: scratch 3/3, then the full suite **23/23** (2m).

## 4. Also fixed: search race in the CGST suite

`adminClassGradeSettings.test.js` called `search_class()` immediately after
`sweepClassesNamed()`, which exits its loop with the term **still applied**. `search_class()`
waits for the class list to CHANGE, so that second search was a no-op that burned its full 20s
budget and reported a failure the search never had. It only ever passed because clicking Search
re-renders the grid and `getText` momentarily returns an error, shifting the list signature — a
race. `clear_search()` added before both searches (TC_7, TC_9). Verified 21/21.

Other call sites were audited and are safe: `adminClassesTab`'s four search TCs are covered by
the `BeforeEach` reset, and `sweepClassesNamed` already clears on every iteration.

## Process notes

- The user's instinct to iterate against a **2-TC scratch exec file** was right: 132s -> ~45s,
  but the real gain was 2 screenshots to read instead of 22. Login + school selection is ~40s of
  any run and cannot be avoided. All scratch files were deleted and the full suite run at the end.
- **Two wrong hypotheses were stated with too much confidence before anything was measured.** The
  live diagnostic settled it in one run. Measure rather than make a third guess.

## Carried forward

- **`browser.pause(800)` in `click_close()`** — empirical. Worth measuring the real threshold, or
  finding an observable readiness signal if one ever exists.
- Session 2's "Carried forward" entry for the X-close `// WORKAROUND` is now **resolved** — the
  retry is gone and the defect was not a defect.
- `TST_CLST_TC_RESET` still does not match the `TST_<MOD>_TC_<N>` convention.
- `TST_CLST_TC_23` is registered `visualTest: false`; Phase 3 not attempted.
- Manual `.md` + `.xlsx` updated: **82 TCs · 64 Pass · 2 Blocked · 16 Not Run**. TC_23 was
  appended as S.No. 82 rather than inserted after TC_2, by user decision — inserting would have
  renumbered 79 rows in both files for no gain, and the requirement-#2 index row lists it.
- CLON TC_1 + TC_3 (the handoff's actual recommendation) is **still the next batch** — untouched.

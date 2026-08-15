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

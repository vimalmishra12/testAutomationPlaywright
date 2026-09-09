# Walkthrough — Admin App Staff tab, manual test-case design

**Date:** 2026-08-24 · **Env:** Thor `micro-nemo.comprodls.com` · **School:** `FCN-CHZ-PDA`
**Skill used:** `c1-manual-test-authoring` (repo root `.agent/skills/`, not the worktree copy)
**Outcome:** 56 manual test cases designed, grounded live, emitted as `.md` + `.xlsx`. Nothing automated.
*(57 written; `TST_STFP_TC_5` withdrawn on review — see below.)*

---

## What was asked

Create manual functional test cases for the Admin App **Staff** tab from
`AdminApp_Staff Tab.xlsx` (13 scenarios), using the Students-tab automation handoff as context.

## What was done

1. Read the mandatory architecture set, the manual-authoring skill and its document template, and
   the Students-tab register as the format model.
2. Extracted the 13 source scenarios from the workbook with `exceljs`.
3. **Agreed scope and module codes with the user before designing** — `STFL` / `STFP` / `STFB`,
   named after the future page objects `schoolStaff` / `staffProfile` / `bulkStaff` (AGENTS.md
   Rule 6), so no re-mapping is owed at automation time.
4. **Grounded the whole area live** via Playwright MCP after the user signed in: the list, search,
   sort (including the Staff-only Role column), user guide, load more, both staff-profile variants,
   both action dialogs, class launch, and the invitation form.
5. Wrote `test/Manual/C1App/AdminApp-Staff/AdminApp_Staff_tab_test_cases.{md,xlsx}`.
6. Promoted the durable findings into `product-knowledge/ExperienceApp/admin-staff-tab.md` and
   wired it into the three index tables; added `AutoStaff_` to the sweepable prefixes.

## Key decisions

- **Both artefacts were generated from a single case list**, then the generator was deleted. This
  guaranteed the `.md` and `.xlsx` agree (golden rule 6) without leaving behind a script that would
  clobber the tester columns if re-run. Future edits go through `npm run register`, as the standard
  requires. The generated workbook was verified by read-back and then re-read through
  `tooling/xlsxRegister.js`.
- **Blocked used sparingly.** Two cases were Blocked at design time, both on the invitation form.
  One (`TST_STFB_TC_9`) was **unblocked the same day** once the user approved downloading the CSV
  template and the fixture was written from its real headers. **One remains Blocked** —
  `TST_STFB_TC_11`, whose dialog exists in the DOM but whose trigger has not been reproduced.
  Everything else is runnable on this school.
- **The mutating cases were deliberately not exercised.** Grant, revoke-confirm and remove-confirm
  were left `[ASSUMED]` rather than tried on shared accounts. The *cancel* paths were exercised, so
  the dialog copy is verified rather than assumed.
- **`[ASSUMED]` expected results are all listed in the register's Open items** with what would
  resolve each. Three were resolved during review with the user on the same day: the staff-count
  timing, the CSV template headers, and the HTTP 500's status as a data issue.

## What grounding caught that guessing would not

The Staff tab reads like the Students tab and behaves differently in a dozen ways. Designing by
analogy would have produced wrong steps in most groups:

- No Username column, no username sort — which exposed a **typo in source scenario #5** (it reads
  "username" where the tab sorts by **email address**). Confirmed with the user and corrected;
  `TST_STFL_TC_22`, written to record the mismatch, was withdrawn once the scenario was fixed.
- No row checkboxes, no bulk remove, no course-material activation anywhere.
- Default sort is Last name, not First name.
- The row *is* the menu toggle, and the menu has one item, not two.
- The class name on a staff profile **is** a link — the opposite of the student profile's umbrella
  name, which is the trap the Students batch caught.
- The staff profile URL is **not** deep-linkable, where the student profile URL is.
- The no-results search shows a proper message here, where the Students tab shows nothing.

## Defects found

Two survived review as product defects: `Staff (23)` in the heading versus 21 rendered rows, and
three raw i18n keys in the invitation form's upload-error dialog (free-captured from the pre-rendered
DOM before the state was ever reached, and root-caused to translation keys defined under
`EXISTING_CHILD` / `BULK_ACTIVATION` but never under `ADULT_INVITE`).

Two were closed on review with the user `[2026-08-24]`: the **HTTP 500** on `View profile` is a known
**data** issue on one account — `TST_STFP_TC_6` was narrowed to the client-side gaps it exposes (no
error shown, loading overlay left stuck) — and the **profile deep-link** case `TST_STFP_TC_5` was
**withdrawn**, because deep-linking is not handled by the development team. The behaviour is still
recorded in product knowledge, since automation must not reach a staff profile by URL.

Five smaller copy defects recorded in Remarks — the "no **administrators** that match" wording, the
student-only help panel and `Students` browser title on the shared invite form, `takea`, and
`school Account`.

## Open question raised

An administrator is offered both `Remove admin rights` and `Remove from school account` on **their
own** profile, with no extra warning.

## Follow-ups for whoever automates this

Everything needed is in the register's *Handoff to automation* table and *Open items* list. In
short: start with the ~45 side-effect-free cases (all of `STFL` bar the count case, most of `STFP`,
the read-only half of `STFB`); download the CSV template before writing any fixture; and never
revoke rights from or remove a staff member the suite did not create — least of all
`testt1@mailsac.com`.

---
---

# Session 2 — 2026-09-02 · Phase 1 automation of the STFL block

**Date:** 2026-09-02 · **Env:** Thor `micro-nemo.comprodls.com` · **School:** `FCN-CHZ-PDA`
**Skill used:** `c1-test-authoring`, Phase 1 (Build), from the repo root `.agent/skills/`
**Outcome:** **19 STFL cases automated — 19 passing / 0 failing on the first run, and again on a
second consecutive run.** Merged to `main` as `6e698e9`.

> Appended to this file rather than started as a new one: one walkthrough per feature, one section
> per session. Session 1 above designed the cases; this session automated them.

## Summary

Built the Staff-tab list suite (`schoolStaff` page object + `adminStaffTab` test file + selectors,
exec, data, TC-repo entries and npm script) covering the side-effect-free `STFL` block, scoped down
by the Phase 1 exclusions agreed earlier the same day. Selectors were captured LIVE. The suite was
green on its first execution, so no fix cycle was needed.

## Scope, and why it is 19 and not 26

`STFL` holds 26 live cases (`TC_1..27`, `TC_22` retired in session 1). Two subtractions:

- **Six are marked `[EXTRA — Phase 1 exclusion]`** in the register — `TC_1, 5, 7, 10, 21, 26` — the
  coverage the other team's reviewed sheet does not hold. The team decided these are not automated
  in Phase 1 (commit `2c61a0e`, earlier this session).
- **`TC_27` mutates real data** — it needs an invited teacher to accept.

That leaves **19**: `TC_2, 3, 4, 6, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 23, 24, 25`.

⚠️ `TC_1` (tab load) and `TC_7` (Clear restores the list) are excluded as EXTRA, so neither is
registered as a test case — but `isInitialized()` and `clear_search()` still exist in the page
object, because every other case needs them. Excluding a case is not the same as deleting the
capability.

## Step 0 — reconnaissance sweep (live, via Playwright MCP)

The user signed in (Claude cannot type passwords); everything after that was driven from here.

- **Page-scoping anchor:** the view renders inside a **`<staff>`** component tag — the sibling of
  the Students tab's `<learner>`. Ancestor chain `h2 › div › staff › … › admin › app`, so
  `staff h2` is unique and a bare `h2` would match the wrong tab.
- **Pre-rendered modals: only 1** (`.modal-content`, the change-school-key dialog, invisible) —
  far fewer than the grading screens' 4/4/11. Presence checks are still avoided on principle.
- **No `maxlength`** on the search box, confirming session 1's finding that no honest boundary case
  can be written yet.
- **No cookie banner rendered this session** — the interception noted in the design handoff did not
  reproduce. Left unhandled rather than papered over.
- **`nps-survey` present but empty** (`innerHTML.length === 0`).
- **Measured transitions:** search 1.5 s (2-row result) / 3.4 s (no-match) · sort 0.8–4.1 s ·
  Load more 1.1 s · Clear 3.1 s · user guide < 1 s. The suite polls on a 20 s budget — roughly 5x
  the measured worst case, a measurement rather than an inherited guess (Invariant 1).
- **Page size 20**, `Load more ...` removed from the DOM at exhaustion (20 → 21 rows, then gone).
- **Code-point collation confirmed:** `21aug, Ln, Perf Test, T1, User, gg, ln, s, teacher,
  teacher9752`.

## Step 0b — applicable-traps table

| Trap | Applies? | Where handled |
|---|---|---|
| Pre-rendered UI → presence is a false green | partly | 1 invisible modal only; state read via `isDisplayed`/`isExisting`, never a count |
| Positional row ids | yes | `findRowIndexByText()` resolves rows by aria-label content |
| Aria row number offset by two | yes | Documented in that helper; never mapped onto an index |
| User-guide toggle differs per state | yes | Separate collapsed/expanded selectors; collapse waits for REMOVAL |
| Sort label is optimistic UI | yes | `waitForListChange()` polls a row fingerprint, never the label |
| Code-point, not locale, collation | yes | `compareCodePoint`; `TC_20` also asserts a `localeCompare` order would DIFFER |
| `Load more ...` removed, not disabled | yes | `getData_loadMoreAvailable()` reports presence; `TC_24` asserts absence |
| Search is submit-driven | yes | `search_staff()` always clicks Search; `addValue`, not `fill` (ADR-013) |
| Heading count differs from row count | yes | No case asserts they match — that is `TC_26`, excluded |
| Shared school, counts drift | yes | No absolute count anywhere |
| Two schools share the display name | yes | `TST_SADB_TC_1` opens by KEY |
| Cookie banner intercepts clicks | not seen | Deliberately unhandled; would surface in Phase 2 |
| Profile not deep-linkable / stuck `#loader-container` | no | No case here opens a profile |
| Staff-list API rejects hand-built `fetch` | no | Nothing seeds or reads via API |

## Changes Made

### 1. `testResources/selectors/ExperienceApp/C1Selectors.json`
- **Type:** Modified · **Layer:** Test Resources
- **What changed:** Added the `schoolStaff` module (34 keys) under `css.ComproC1`, inserted before
  `schoolClasses`. Text-spliced rather than re-serialised, so the diff is +36 lines instead of a
  whole-file reformat.
- **Why:** ADR-002 — every selector externalised and namespaced.

### 2. `pages/ExperienceApp/schoolStaff.page.js`
- **Type:** Created (about 430 lines) · **Layer:** Page Object
- **What changed:** `isInitialized`, `click_staffTab`, `search_staff`, `clear_search`,
  `getData_searchBanner`, `getData_noResultsState`, `click_sortBy`, `getData_sortStatus`,
  `getData_staffRows`, `getData_visibleRowCount`, `getData_rowIndexByText`,
  `click_expandUserGuide` / `click_collapseUserGuide` / `getData_userGuide`, `click_loadMore`,
  `getData_loadMoreAvailable`, `getData_pageSize`, `reload_staffTab`, `return_toStaffTab`,
  `getData_isOnStaffTab`, plus module-private `readListSignature` / `waitForListChange` /
  `findRowIndexByText`.
- **Why:** Layer separation (Invariant 1) — all DOM access lives here, via the action library only.

### 3. `test/ExperienceApp/adminStaffTab.test.js`
- **Type:** Created (about 480 lines) · **Layer:** Test Case
- **What changed:** 19 STFL cases plus `TST_STFL_TC_NAV` (asserted Before-hook hop) and
  `TST_STFL_TC_RESET` (unasserted BeforeEach/After housekeeping). Local pure helpers
  `compareCodePoint`, `isSortedBy`, `pluck`, `isGroupedBefore`.
- **Why:** The Phase 1 scope above.

### 4. `testResources/testExecutionFiles/ExperienceApp/thor/adminStaffTab.json`
- **Type:** Created · **Layer:** Config
- **What changed:** Before chain (launch → landing → login → school opened BY KEY → nav),
  `BeforeEach` reset, 19 tests, empty `AfterEach`, suite-level `After` reset.
- **Why:** ADR-019 — the reset is in `After`, never `AfterEach`: the mochawesome screenshot is taken
  in a ROOT `afterEach` that runs last, so resetting in `AfterEach` would photograph every search
  case on the full list, erasing the evidence it had just asserted.

### 5. `testResources/testcaseData/ExperienceApp/thor/adminStaffTabData.json`
- **Type:** Created · **Layer:** Test Resources
- **What changed:** Search fixtures, role labels, the six verbatim user-guide lines, the no-match
  message template. Every value verified live 2026-09-02.

### 6. `testResources/testcaseRepository/ExperienceApp/C1TCRepository.json`
- **Type:** Modified · **Layer:** Test Resources
- **What changed:** New `STFL` module, 21 entries, all `visualTest: false`. Text-spliced (+28 lines)
  after a first attempt with `JSON.stringify` reformatted the whole 4600-line file (1351/363) and
  was reverted.
- **Why:** Invariant 7 (two-change rule) and Invariant 12 (`visualTest: false` until Phase 3).

### 7. `package.json`
- **Type:** Modified · **Layer:** Config
- **What changed:** Added the `adminStaffTabTest_thor` script beside the other admin scripts.

### 8. `.architecture/product-knowledge/ExperienceApp/admin-staff-tab.md`
- **Type:** Modified
- **What changed:** New section 7 — the anchor, three new traps, measured transitions, the selector
  inventory, re-measured count drift, and what is automated.

### 9. `test/Manual/C1App/AdminApp-Staff/AdminApp_Staff_tab_test_cases.md` + `.xlsx`
- **Type:** Modified
- **What changed:** 19 cases flipped Not Run → **Pass**; header execution summary rewritten. Now
  19 Pass / 36 Not Run / 2 Blocked of 57, `.md` and `.xlsx` verified in agreement.
- **How:** `node tooling/xlsxRegister.js status` for the workbook — it verifies each write and
  reported "no other cell changed" 19 times. Never hand-patched.

### 10. `.architecture/authoring-status.md`
- **Type:** Modified
- **What changed:** New `adminStaffTab` block — Phase 1 done, Phases 2 and 3 pending, with the
  scope arithmetic and the outstanding STFP/STFB work spelled out.

## Three traps found this session (now in `admin-staff-tab.md` section 7.2)

1. **The sort qids are not in visual column order** — First name `aAdmin-3`, Last name `aAdmin-4`,
   though Last name is the leftmost column.
2. **The sort-status id's `-a` suffix is NOT the direction** — `sortStatus-staff-roles-a` reads
   *"sorted descending"* after a second click; the id never changes. Read the TEXT. The column key
   inside the id is the API field: `last_name`, `first_name`, `ext_email`, **`roles`** (plural).
3. **The Clear link carries a Classes-tab qid**, `aClass-99`, reused inside the Staff heading — so
   the selector scopes the stable class: `staff h2 small a.clear-search`.

Also confirmed: only the column currently owning the sort has a status element at all; the others
are ABSENT from the DOM. That is what makes `TC_19` an assertion that can actually fail.

## Two product observations — reported, not routed around (Invariant 14)

- **The heading/row-count defect is still live** — `Staff (22)` over **21** rendered rows. It was
  23 vs 21 on 2026-08-24, so the gap narrowed from 2 to 1 but has **not** closed, and the cause is
  still unexplained. `TST_STFL_TC_26` owns it and is Phase-1-excluded, so no automated case asserts
  the two match.
- **The no-results copy still says "no administrators"** on a tab that lists teachers too. `TC_11`
  asserts the copy **as shipped** — it does not quietly expect the corrected wording.

## Architecture Decisions Triggered

No new patterns. Referenced: ADR-002 (selector namespacing), ADR-009 (return contract), ADR-011
(TCs independent of order), ADR-013 (React-form typing), ADR-019 (reset in `After`, not
`AfterEach`), Invariants 1, 2, 7, 12, 13, 14, 15.

**One judgement worth recording:** the five sort cases (`TC_15`-`TC_19`) each **reload the tab
first**. `TC_RESET` clears the search but does not reset the sort, so without the reload a case
would inherit whichever column the previous TC left owning it — and if that were already its own
column, the click would flip to DESCENDING and the case would fail purely on test order (ADR-011).
Five extra reloads cost about 15 s across the suite; order-dependence would have cost a debugging
cycle.

## Protected Files Touched

**None.** `package.json` is not on the protected list; no core file was modified.

## Verification

- `node tooling/tcMap.js --findings` → exit 0; **0 misfiled, 0 ghost, 0 new orphans**. The 13
  unregistered and 48 orphans are pre-existing eBook/other entries, unchanged by this work.
- `npm run adminStaffTabTest_thor` → `tests=19 passes=19 failures=0` (77.1 s), then again
  `tests=19 passes=19 failures=0` (76.3 s).

**Why it was green first time:** every selector, timeout and fixture met the real app during Step 0
before a line was written. The Phase 1 guidance is explicit that building from documentation is the
failure mode — `adminClassesTab` shipped that way, scored 2/6, and took about 15 runs to recover.

## Follow-ups

- **Phase 2** (run/fix) and **Phase 3** (visual) are still pending. Phase 3 closes the feature; the
  expectation is "no visual candidates" — every case reads shared-school data that drifts — but
  that must be confirmed, not inherited.
- **Next batch: `STFP` read-only** (12 cases after exclusions) — profile layout for both roles,
  Back, class launch, the role-conditional menu and both dialogs' CANCEL paths. A staff profile URL
  is not deep-linkable; reach it through the list.
- **Leave `STFB` until last** — it needs a data-owning suite, `TC_10` sends real email, and the form
  auto-restores a shared draft so it is never empty on load.
- **Still open from session 1, and neither blocked this batch:** whether a different/larger school
  is coming for the Staff tab, and whether an admin revoking their own rights is by design.

---

# Session 2, continued — Phase 2 (run & fix)

**Date:** 2026-09-02 · **Skill used:** `c1-test-authoring`, Phase 2
**Outcome:** **Phase 2 complete — 19 passing, 4 runs total, the last 2 consecutive and clean on the
changed code.** One real defect found, in the tests rather than the product.

## Why this phase had no fix cycle, and what it was actually worth

The suite was already green from its first execution, so steps 1-3 and 5 of the phase were satisfied
on arrival and there was never a failure to classify. The value of running Phase 2 anyway was the
**two audits** — and one of them found something a green suite could never have surfaced.

## Evidence audit — passed

All 19 per-TC screenshots were extracted from `report.json` (base64 PNGs inside each test's
`context`) and walked one by one, asking of each: *does this image show the thing the TC asserts?*

- **`TC_11`** — the banner *"Showing search results for zzzznomatchqa."*, `Clear` present, table and
  sort header gone, and the empty-state message with its "no **administrators**" wording. Exactly
  the assertion.
- **`TC_12`** — the guide expanded with all six lines and the toggle reading `Hide`.
- **`TC_17`** — Role sorted, `Administrator/Teacher` rows at the top.
- **`TC_24`** — the capture is **scrolled to the bottom** of the fully-loaded list: last row
  `teacher9752`, no `Load more ...` beneath it. It also incidentally evidences `TC_20`'s code-point
  tail — `User, gg, gg, ln, ln, s, teacher, teacher, teacher9752`, every capital before every
  lower-case. (An earlier assumption that the bottom-of-list cases could not be evidenced by a
  viewport screenshot was simply wrong — the framework scrolls.)

**No ADR-019 violation.** `AfterEach` is empty; the reset lives in `BeforeEach` and the suite-level
`After`. `TC_11`'s screenshot still showing its search term is the proof — that is precisely the
failure `adminClassesTab` had, where seven search TCs ran green for weeks with every screenshot
showing the full unfiltered list.

**Noted, not a defect:** `TC_13` photographs a collapsed guide, which is visually identical to one
that never opened. It was NOT split, because the phase's own remedy is already satisfied — the case
asserts the panel was open BEFORE the click, that one click sufficed, and that the panel was
REMOVED rather than hidden.

## Falsifiability audit — one real hole, found and fixed

Re-reading each assertion asking *"what input would make this fail?"* turned up one that could not:

`isGroupedBefore()` returns `true` early when only one role group is present. On the school as it
stands (3 `Administrator/Teacher` among 21) `TC_17` and `TC_18` genuinely test the grouping. But had
another team's changes ever left the school with only `Teacher` rows, **both cases would have passed
while asserting nothing** — Invariant 13's exact failure mode, and silently.

**Fix (proposed to the user and confirmed before editing, golden rule 6):** both cases now assert
that **both** role values are present in the rendered rows before asserting the ordering. The helper
was left alone — it is a correct pure ordering predicate; the guard belongs in the cases, where the
fixture assumption lives.

- `test/ExperienceApp/adminStaffTab.test.js` — **Modified**, Test Case layer. Added two
  `assertEqual` presence guards plus explanatory comments in `TST_STFL_TC_17` (around line 461) and
  `TST_STFL_TC_18` (around line 505).

Re-run twice after the change: **19/19 both times**, with the guards passing on real data rather
than being vacuously skipped.

Everything else survived the audit: no `>= 0` counts, no unasserted state changes, and `TC_20`
already carried its own discriminator (a `localeCompare` ordering must DIFFER from the product's, so
the case cannot pass on data where the two collations agree).

## Step 0b traps table re-checked against the shipped code

Every "applies here" row has a real handler in the code, not merely an intention. **No trap turned
out to apply and to have been missed** — which is the outcome worth recording either way, since a
documented trap being hit twice is exactly what this checklist item exists to catch.

## ⚠️ Runtime drift — flagged, not fixed

The same 19 cases took **77 s, 76 s, 117 s and 229 s** across the four runs.

The slowdown is **uniform across every case, including ones that do no network work** — the
user-guide case went 198 ms → 3.7 s — so it is environmental (Thor and/or the local machine, which
was also driving a second browser), not a suite regression. Nothing failed.

But it has eaten the safety margin. The slowest case is now **12.9 s against the page object's 20 s
poll budget** — about 1.5x headroom, where the original measurement gave ~5x. If Thor degrades
further the budget will start to bite. **Re-measure before raising it** (Invariant 1); raising a
budget to chase a slowdown without measuring is how an inherited guess gets born.

## Verification

- `npm run adminStaffTabTest_thor` — run 3: `tests=19 passes=19 failures=0` (116.7 s);
  run 4: `tests=19 passes=19 failures=0` (228.7 s). Two consecutive clean runs on the changed code.

## Phase status after this session

- Phase 1 (build): ✅
- Phase 2 (run/fix): ✅
- Phase 3 (visual): ⬜ **still pending and mandatory — the feature is NOT closed.** The expectation
  is "no visual candidates", since every case reads shared-school data that drifts, but Phase 3 must
  confirm that rather than inherit it. Recommended in a fresh session.

---

# Session 2, closing — Phase 3 deferred by user decision

**Date:** 2026-09-02

**Decision:** Phase 3 (visual assessment) is **deliberately skipped for this batch** `[user, 2026-09-02]`.
The skill treats Phase 3 as mandatory and a feature as unclosed while any phase is ⬜; that concern was
raised and the user decided to proceed without it. Recorded as **deferred**, never as ✅ — a skipped
phase marked complete is worse than an obviously open one.

**Why this is a safe skip, and where it is not.**

Safe: every one of the 19 TCs is registered `visualTest: false`, which is the required default for
new TCs (Invariant 12). Phase 3 only ever *promotes* cases to `true`. So skipping it changes nothing
about how the suite runs today and creates no risk of a wrong or stale visual baseline. No
`visualAcceptance_adminStaffTab_thor` script exists, and none should be added until the assessment
is actually done.

Not safe to forget: nobody has run the AGENTS.md §8 Rule A static-vs-dynamic assessment over these
cases. "No visual candidates here" is an **expectation, not a finding**. It is a well-founded
expectation — every case reads shared-school data that drifts (row content, counts, sort order,
echoed search terms) on a school other teams actively mutate — but it has not been tested, and the
distinction should survive into whatever session picks this up.

**To resume:** read `.agent/skills/c1-test-authoring/phases/3-visual.md` and run the assessment over
the 19 registered TCs. Nothing needs undoing first.

## Final state of this feature

| Phase | State |
|---|---|
| 1 — Build | ✅ 2026-09-02 — 19 TCs, live selector capture, green on first execution |
| 2 — Run & fix | ✅ 2026-09-02 — 19 passing, 2 consecutive clean runs on the changed code; both audits done, one vacuous assertion fixed |
| 3 — Visual | ⏭️ Deferred by user decision |

Shipped to `main`: `6e698e9` (Phase 1) and `05ba477` (Phase 2).

**Carried forward, unchanged by this decision:**
- `STFP` read-only (12 cases after the Phase 1 exclusions) is the next batch; `STFB` last.
- Runtime drift is worth watching — 77 s → 229 s across four runs, environmental rather than a
  suite regression, but the slowest case is now 12.9 s against a 20 s poll budget. Re-measure
  before raising it.
- Two product items still open and unraised in Jira as far as this session knows: the heading /
  row-count disagreement (`Staff (22)` over 21 rows) and the "no administrators" copy on a tab that
  lists teachers too.

---

# Session 3 — 2026-09-07 · Phase 1 automation of the STFP read-only block

**Test file:** `test/ExperienceApp/staffProfile.test.js` (new) · **Module:** `STFP`
**Page object:** `pages/ExperienceApp/staffProfile.page.js` (new), plus `click_rowActionMenu`
and `click_viewProfile` added to the existing `schoolStaff.page.js`.
**Suite:** `npm run adminStaffProfileTest_thor` · Thor / `FCN-CHZ-PDA`

## Summary

Nine read-only `STFP` cases built and **passing 9/9 on the first run**, then twice more
consecutively. No fix cycle — the second batch running where live selector capture removed
the guesswork entirely.

## Scope, and why it is 9 and not 19

`STFP` holds 19 live cases (`TC_1..TC_20`, `TC_5` retired). Five are
`[EXTRA — Phase 1 exclusion]` (`TC_3, 4, 6, 8, 14`), leaving 14. Four of those **mutate real
data** and belong to a data-owning suite (`TC_10` grant, `TC_13` revoke-confirmed, `TC_18`
removal-confirmed, `TC_19` which depends on `TC_10`), and `TC_20` is Blocked — it needs a
school with exactly one administrator, and `FCN-CHZ-PDA` cannot be reduced to one without
breaking every other admin suite mid-run. That leaves the **9** built here:
`TC_1, 2, 7, 9, 11, 12, 15, 16, 17`.

⚠️ **Six of the nine open a mutating dialog and then leave it.** They are side-effect free
**only** because they never confirm. That was treated as a hard rule throughout: no confirm
button was clicked at any point, in the suite or during capture.

## The environment blocked the session twice, and both were reported rather than worked around

1. **Thor was down for school selection.** Login and the dashboard worked, but clicking any
   school card hard-navigated to `/dashboard/error`. Confirmed it was not our code three
   ways: `FCN-CHZ-PDA` failed, a *different* school (`KNF-XRD-QVE`) failed identically, and
   the **shipped, unchanged `STFL` suite** failed in its `Before` chain at `TST_SADB_TC_1`
   with the same error — a suite that had passed 19/19 four times on 2026-09-02. Reported
   and held rather than proceeding. Once the user confirmed the fix, the same `STFL` suite
   was re-run as the readiness gate: **19/19 in 70.9 s**, which also showed the runtime
   drift flagged in the 2026-09-02 handoff (77 → 229 s) had not persisted.
2. **A degraded browser session impersonated a product defect.** See below.

## The near-miss worth recording: a "defect" that was not one

Clicking `Remove admin rights` produced `.modal-backdrop fade show` plus `body.modal-open`
while the dialog itself stayed `display:none` / `aria-hidden="true"` — a full-screen
click-blocking overlay with **no dialog in it**, recoverable only by reloading. It
reproduced twice, once by real mouse click and once by JS click.

It was written up as a **candidate** defect and explicitly not asserted as one, because it
arrived alongside 45-second CDP timeouts, failed screenshot injection and Angular handlers
silently not firing — the `admin-shared.md` §B11 "MCP input goes dead" family. The user was
asked how to proceed rather than being handed a guess.

**On a fresh browser tab the dialog opened correctly every time.** So it was the tooling,
not the product. Closing the tab and opening a new one was enough; a full Claude Code
restart was not needed. Recorded in `admin-staff-tab.md` §8.8 so the next person recognises
the symptom instead of filing the same false defect.

The general lesson: *reproducible* is not the same as *product-side*. A sick session
reproduces too.

## Step 0 — reconnaissance sweep (live, via Chrome MCP)

- **2** `.modal-content` pre-rendered on the profile, both hidden — presence proves nothing.
- Page scope is `div.view-profile`; there is **no `<staff>` tag** on this view, and the
  wrapper is **shared with the student profile**.
- Manage account menu opens in **~1 ms** (class toggle on pre-rendered markup).
- Both dialogs' copy captured **free** from the pre-rendered DOM before triggering anything.
- Measured: View profile 5.0–5.5 s · `Back` ~2.4 s · class launch 3.44 s document load ·
  search settle ~0.5 s. Every timeout in the page object cites one of these.

## Step 0b — applicable-traps table

| Trap | Applies? | Where handled |
|---|---|---|
| Pre-rendered modals → presence is a false green | yes | every modal check uses `isDisplayed` |
| `Yes, remove` disabled by CSS class only | yes | `disabledByClass`; `TC_16` asserts the class, and pins native `disabled` as unchanged |
| Positional row ids | yes | `schoolStaff.findRowIndexByText`, never a literal index |
| Whole row is the dropdown toggle | yes | `click_rowActionMenu` opens the toggle first |
| Profile URL not deep-linkable | yes | always reached through the list |
| `#loader-container` cascade after a failed profile load | yes | the HTTP-500 account is excluded and never opened |
| `admin` → `class` full page load | yes | `waitForUrl` + `waitForDocumentLoad` |
| Never assert an absolute count | yes | `Classes (N)` asserted by shape only |
| Reset in `BeforeEach` + suite `After`, never `AfterEach` | yes | ADR-019; `AfterEach` is empty |
| Bootstrap custom-control checkbox needs its `<label>` | yes | `click_removalConfirmCheckbox` |
| Assertions must be falsifiable | yes | menu cases assert the ABSENT item too |
| `a.class-details` matches ~2 per row (**new**) | yes | class resolved by `span.class-name` text |
| `.list-items` shared by staff rows and class rows (**new**) | yes | scoped to `div.class-section` |
| Cookie banner intercepts clicks | no — not rendered in either session | left unhandled, not papered over |

## Five findings new to this sweep (now in `admin-staff-tab.md` §8)

1. The class **name** anchor has **no qid** — `user-profile-6-<n>` is the chevron icon.
   §2 said the name was that qid; corrected.
2. `a.class-details` matches roughly **two elements per row** — 129 for 43 classes, with the
   target at index 84. Index-based resolution here is meaningless.
3. Class rows reuse the Staff tab's **`.list-items`** class.
4. `h6.class-count` is **absent entirely** when a staff member has no classes — not
   `Classes (0)`.
5. Manage account items are **absent from the DOM**, not hidden, when they do not apply.
   A welcome exception to §B2 — it is what makes the "not offered" assertions falsifiable.

## Fixture correction

`admin-staff-tab.md` §6 said the login account was the only staff member with classes, so
`TC_7` would have had to use the admin's own profile — a decision the user had already made.
That is now **out of date**: `teacher17aug2026@mailsac.com` holds `Classes (43)`. The user
was told the gap had closed and `TC_7` now runs against a real teacher.

Only **one** of those 43 names is unique (`testClass1 17aug`) — the rest are accumulation
from the class-creating suites (`BulkCSV_Class2` ×17, `BulkCSV_Class1` ×17,
`AutoClass_CreateOnly` ×8). So the case **asserts the name is unique** before launching it;
if the data shifts again it fails loudly rather than opening an arbitrary class.

## Changes made

| File | Change |
|---|---|
| `testResources/selectors/ExperienceApp/C1Selectors.json` | new `css.ComproC1.staffProfile` block, 29 keys (+31 lines, no reformat) |
| `pages/ExperienceApp/staffProfile.page.js` | **new** — 15 methods |
| `pages/ExperienceApp/schoolStaff.page.js` | added `click_rowActionMenu` + `click_viewProfile` (the Staff tab owns the row menu — the precedent `schoolStudents.click_viewStudentProfile` set) |
| `test/ExperienceApp/staffProfile.test.js` | **new** — 9 TCs + `TC_RESET` |
| `testResources/testcaseRepository/ExperienceApp/C1TCRepository.json` | new `STFP` module, 10 entries, all `visualTest: false` (+17 lines, no reformat) |
| `testResources/testcaseData/ExperienceApp/thor/adminStaffProfileData.json` | **new** |
| `testResources/testExecutionFiles/ExperienceApp/thor/adminStaffProfile.json` | **new** |
| `package.json` | `adminStaffProfileTest_thor` |
| `.architecture/product-knowledge/ExperienceApp/admin-staff-tab.md` | new §8 |
| `.architecture/authoring-status.md` | new `adminStaffProfile` block |
| `test/Manual/.../AdminApp_Staff_tab_test_cases.md` + `.xlsx` | 9 cases → Pass; summary rolled to 28 / 27 / 2 |

**A near-miss on the JSON files.** The first attempt rewrote both `C1Selectors.json` and
`C1TCRepository.json` with `JSON.stringify(…, 2)`. The selector file survived (already
2-space formatted, +31 lines) but the TC repository came out as **1411 insertions / 384
deletions** — a whole-file reformat that would have buried the real change and wrecked
`git blame`. Reverted and redone as a surgical text insert: **+17 lines**. Worth remembering
that these two files are formatted differently despite sitting in the same tree.

## Protected files touched

**None.** No new action-library capability was needed — `isSelected`, `isEnabled`,
`waitForUrl` and `waitForDisplayed(sel, ms, reverse)` all already existed, and each was
checked against its actual signature before use rather than assumed.

## Verification

- `node tooling/tcMap.js --findings` → exit 0; **0 MISFILED, 0 GHOST, no STFP findings**.
  (13 UNREGISTERED and 48 ORPHAN entries are pre-existing eBook/other-module issues.)
- `npm run adminStaffProfileTest_thor` → **9 passing / 0 failing**, three times:
  2m, 3m, 2m.
- Register `.md` and `.xlsx` cross-checked: **28 Pass / 27 Not Run / 2 Blocked** in both.
- Fixture roles re-read after every run — `teacher17aug2026` still `Teacher`,
  `cqa_teacher17oct3` still `Administrator/Teacher`. **Nothing was mutated.**

## Open item carried to Phase 2

**`TST_STFP_TC_17` takes ~39 s against ~5 s for its neighbours**, consistently across runs
(two other cases spiked once each and were environmental). It is the only case that
searches, leaves the tab, returns via `Back`, and then searches the **same term** again.
`click_back` resolves as soon as the heading renders — verified live that the list *does*
repopulate to 20 rows, but only afterwards — so `search_staff`'s row fingerprint can be
taken against the stale filtered list and then never change, burning the full 20 s poll.

Suspected fix: pass `{ expectListChange: false }` on that second search, which is precisely
what that option in `schoolStaff.search_staff` exists for; it then waits on the search
banner instead. **Proposed to the user, not applied** (Golden Rule 6) — the case passes
either way, so this is a latent time cost rather than a failure.

## Follow-ups

- Phase 2 (run/fix) for `adminStaffProfile`, starting with the `TC_17` item above.
- Phase 3 (visual) for `adminStaffProfile` — expected "no candidates" (every case frames
  shared-school data), but the assessment is owed, not inheritable.
- `STFP` mutating block (`TC_10, 13, 18, 19`) — needs a data-owning suite creating its own
  `AutoStaff_` staff member.
- `STFB` last, for the reasons in the register.
- Phase 3 for `adminStaffTab` remains **deferred by user decision**, not done.

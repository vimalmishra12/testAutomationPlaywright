# Walkthrough — Admin App Students tab, manual test-case authoring (Batch 1)

**Date:** 2026-08-22 · **Skill:** `c1-manual-test-authoring` · **Phase:** design only, no automation
**Env:** Thor `micro-nemo.comprodls.com` · school `3 July Test School 1` / `FCN-CHZ-PDA` · `testt1@mailsac.com`
**Deliverables:** `test/Manual/C1App/AdminApp-Students/AdminApp_Students_tab_test_cases.md` + `.xlsx`

---

## Session 1 — 2026-08-22

### What was asked
Review the manual-authoring skill, the architecture, and the attached `AdminApp_Student Tab.xlsx`,
then create test cases for each scenario.

### Input
The attached path (`test/Manual/C1App/AdminApp-Classes/AdminApp_Student Tab.xlsx`) **did not exist**.
The workbook was found at `C:\Users\Compro\Desktop\Admin Automation\AdminApp_Student Tab.xlsx` —
one sheet, 23 scenarios in rows 2–24. Flagged to the user rather than guessed at.

### Scope agreed before designing (skill Step 1)
Three decisions were put to the user and answered:

1. **Full live recon first** — rather than writing from product knowledge with `[ASSUMED]` markers.
2. **One document, all 23 scenarios** in a new area folder `AdminApp-Students/`.
3. **Three module codes** — `SLST` / `SPRF` / `SBLK`, named after the page objects those screens
   will get (`schoolStudents`, `studentProfile`, `bulkStudents`), per golden rule 3.

### Recon performed (Playwright MCP, live)
Search on all four dimensions · the activation checkbox · all three sort columns and their toggles ·
user guide expand/collapse · load more to exhaustion · a child profile and two adult profiles ·
Manage learner profile (both tabs) · a weak-password rejection · individual code activation with an
unusable code · class launch from a profile · all four bulk entry screens · and a free capture of
every pre-rendered dialog on the Students tab, Manage learner profile and `/bulk_activation`.

**Nothing was mutated.** No password was changed, no student removed, no account created, no
activation code consumed. The only two submissions were a deliberately weak password and a
deliberately unusable activation code — both rejected, both leaving state untouched.

### Four defects found by grounding

| # | Defect | Case |
|---|---|---|
| 1 | A no-results search renders **nothing** — table removed, no empty-state message — with a `TypeError` from the admin bundle | `TST_SLST_TC_12` |
| 2 | One student's profile hangs on an **infinite spinner**; `getUserDetailWithClasses` returns **HTTP 500**, with no client-side error handling | `TST_SPRF_TC_7` |
| 3 | The bulk-activation **success dialog renders three raw i18n keys** | `TST_SBLK_TC_9` |
| 4 | Untranslated keys leak into **accessible names** (`…SELECT_STUDENT`, `SCREEN_READER.PROCESSING_MESSAGE`) | `TST_SBLK_TC_10`, `TST_SPRF_TC_16` |

Defect 3 is the clearest payoff of the §A6 free-capture trick — it was found by reading the
pre-rendered success dialog, without ever running a bulk activation.

### One scenario appears not implementable as written
Source scenario #15 asks for the umbrella details page to be launched by **clicking the umbrella
name** on a profile. The umbrella name is a plain `<span class="bundle-title">` with **no link or
button anywhere in its ancestry**, confirmed on both a child and an adult profile. Written up as
`TST_SPRF_TC_18` (expected vs actual); needs a product decision before automation.

> This is exactly the failure mode `admin-shared.md` §A8.1 warns about — the historic
> *"click a listed class"* cases. Caught here at design time instead of weeks later.

### Output

- **59 test cases** — 32 Positive · 17 Edge · 10 Negative. All 23 source scenarios covered, plus one
  designer-added tab-load case.
- **SLST 25 · SPRF 22 · SBLK 12.**
- **3 Blocked at design time** (`TST_SLST_TC_14`, `TST_SPRF_TC_3`, `TST_SPRF_TC_20`) — shared-school
  constraints, recorded Blocked with reason and unblock, not Not Run.
- **10 `[ASSUMED]` expected results**, every one listed in the document's Open items section. Each is
  a state that could not be reached without mutating a shared school, consuming a real code, sending
  real email, or a fixture the school lacks.
- `.md` and `.xlsx` were generated **from one source array**, so they cannot drift; the `.xlsx` write
  was verified by reading the saved file back (the `xlsxRegister` discipline), and both were then
  cross-counted independently — 59 / 32 / 17 / 10 / 56 Not Run / 3 Blocked on both sides.

### Knowledge promoted (not left only in the document)

- **New** `product-knowledge/ExperienceApp/admin-students-tab.md` — routes across the three
  microfrontends, product behaviour, verified copy, automation traps, the four defects, fixtures.
- **`admin-shared.md`** — §A2 gains the three Students modules and a note that this batch applied
  the module-code lesson; §A5 gains the Students-tab shared-school blockers; §A6 gains the three new
  free-capture wins; §B2 gains the Students-tab, bulk-activation and Gigya pre-render counts.
- **`product-knowledge.md`** — the feature-area map gains the new per-screen file.

### Deliberately not done

- **No CSV fixtures.** The bulk templates were not downloaded, and `manual-test-standard.md` requires
  the exact template headers — writing them from memory would be the guess the standard forbids. The
  seven filenames needed are named in the document's handoff section.
- **No boundary case for First name / Last name.** Neither carries a `maxlength`, so there is no
  boundary to test until the server-side limit is measured. Flagged rather than invented
  (`admin-shared.md` §A8.2).

### Handoff
`c1-test-authoring` Phase 1. Module codes and their page objects, the Blocked cases and their
unblock, the `[ASSUMED]` list, and the side-effect-free versus data-mutating split are all stated in
the document's *Handoff to automation* section.

---
---

# Session 2 — 2026-08-28 · Automation of the SLST block

**Goal.** Automate the Students-tab manual cases. **Delivered: the side-effect-free SLST block —
23 TCs passing on Thor across two consecutive clean runs.** SPRF (22) and SBLK (12) not started.

**Environment.** thor · `https://micro-nemo.comprodls.com` · school **FCN-CHZ-PDA** ·
`testt1@mailsac.com`. Run with `npm run adminStudentsTabTest_thor` (headed, system Chrome).

---

## 1. Resolving the `[ASSUMED]` expected results first

Session 1 shipped **10 `[ASSUMED]`** expected results. The user asked for those to be closed
before any automation. Four sat in SLST; all four are now resolved.

### 1.1 The activation checkbox was fundamentally misunderstood — `TC_13` / `TC_14`

Session 1 assumed **"Who activated the code in my school?"** filters the list to students who
had redeemed a code, and recorded `TC_14` **Blocked** because the list looked identical ticked
and unticked — concluding this school lacked mixed activation states and requesting a
`<SCHOOL_WITH_MIXED_ACTIVATION>` fixture.

**The user corrected this from their own product knowledge; live capture then confirmed it.**
The checkbox is a **search-MODE switch**, not a filter. Ticking re-points the search box at
16-character activation codes and reveals two helper lines; the list is *meant* to stay
unchanged. The DOM names the feature outright:

    <input type="checkbox" formcontrolname="activationCodeCheckbox"
           name="activation-code-search" qid="aLearner-17" id="activationCheckbox">

Consequences:
- `TC_13` is **fully automatable here with no activation code** — it was never blocked.
- `TC_14` was rewritten to cover the checkbox's real purpose (searching BY code). It stays
  Blocked, but on **test data** (a redeemed code; the code-issuing environment is down), not on
  a school fixture. **The mixed-activation school request is withdrawn.**

> Worth recording: the identical ticked/unticked result was **correct behaviour** written up as
> an unprovable blocker. Session 1 inferred a filter from the control's *label* without
> confirming what it did.

### 1.2 The `TC_12` defect has been FIXED in the product

Session 1 recorded a defect: a no-match search rendered **nothing** (table removed, no message)
plus `TypeError: Cannot read properties of undefined (reading 'length') at o.search`.
**Re-checked live 2026-08-28 — it no longer reproduces.** It now renders, in
`div.no-records > p.mb-0`, with **zero console errors**:

> `This school has no students that match your search ` **`<term>`** `. Please check the spelling or try a different search term`

`TC_12` was rewritten to assert the FIXED behaviour; `students-no-results.png` is now historic
evidence. The other three defects were not re-checked and still stand.

### 1.3 `TC_19` — sort does NOT survive a reload

Confirmed live (Last name descending → reload → back to First name ascending). Matches the
Classes tab. `[ASSUMED]` removed.

### 1.4 `TC_25` — decided, not yet built

Creating a student per run is acceptable to the user. The data-creating cases will target a
dedicated automation school — **Cqa Test Ashish School 1 / VED-NEH-KVU** /
`cqatestashish_admin@mailsac.com` — while the read-only suite stays on FCN-CHZ-PDA, whose
documented fixtures the other 22 cases depend on. Consolidating onto one school is a later
cleanup. **The `schoolAdminAutomation` login entry is not yet added to `logindata.json`.**

**Still `[ASSUMED]`: 7** — SPRF 3/12/22, SBLK 6/8/11, SLST 25.

---

## 2. Reconnaissance (Phase 1 Step 0)

Selectors were captured **live**, not inferred. Phase 1 is explicit that a suite built from
documentation is "an untested hypothesis" — `adminClassesTab` shipped that way, first ran 2/6,
then took ~15 runs to fix.

Method: throwaway Playwright scripts reading credentials from the repo's own `logindata.json`
(no password typed by hand), dumping the DOM and then exercising each state.

Two obstacles, both already documented in the repo:
- **Bundled Chromium fails to launch** — `browserType.launch: spawn UNKNOWN`.
  `playwright.setup.js` documents this exact failure and its fix: `channel: "chrome"` for headed.
- **Gigya pre-renders ~5 hidden copies of the login fields**, so `input[name="username"]`
  resolves to a hidden one. §4 records this trap for the *Password tab*; it applies to **login
  itself** too. Filter on visibility.

### Traps checked against the recon (Phase 1 Step 0b)

| Trap | Applies? | Where handled |
|---|---|---|
| Pre-rendered modals -> presence is a false green (**4** found) | yes | every layout check uses `isDisplayed`, never `getElementCount` |
| Row menu items pre-rendered per row, **20 copies sharing `qid=aLearner-83`** | yes | scoped to `#learnerActionsMenu-{{n}}`, unique per row |
| Row ids positional, shift with sort/search/load-more | yes | `findRowIndexByText()` resolves by the action button's `aria-label`, then acts on the index |
| User-guide toggle is a **different element** per state | yes | `aLearner-11` collapsed / `aLearner-12` expanded; `TC_RESET` collapses |
| Email/Username sort status sits **outside** its header button | yes | all three read by stable id `#sortStatus-learner-*`, sidestepping it |
| `Load more` **removed**, not disabled, when exhausted | yes | `getData_loadMoreAvailable()` reports PRESENCE |
| Sort collation is code-point, not locale | yes | `compareCodePoint()`; `TC_18` pins it down |
| Search is submit-driven | yes | `search_student()` always clicks Search; `TC_9` proves typing alone does nothing |
| CustomerGauge NPS survey can intercept the school-card click | yes (recon) | removed in the recon script; **not yet handled in the suite** — see §6 |
| Shared school — never assert an absolute count | yes | counts compared to themselves; roll moved 26 -> 27 since 08-22 |

### Measured transitions (not inherited numbers)

| Transition | Measured |
|---|---|
| Classes tab -> Students tab | **4.4 s** (full microfrontend load) |
| Search submit -> settled | ~1-2 s |
| Sort click -> rows re-ordered | ~2-3.5 s (header label flips in ~100ms — optimistic UI) |
| Load more -> appended | ~2-4 s (20 -> 27, then the link is removed) |

---

## 3. The most important defect of the session: missing `await` on every assertion

**The suite reported 23/23 passing while asserting nothing at all.**

`baseAssertionLibrary.assertEqual` is `async` and signals failure by **throwing**. Called
without `await`, the rejection is unhandled and mocha sees a passing test. All **163**
assertions in the new test file were written without it.

The convention is on every line of `adminClassesTab.test.js` — the very file whose structure
was copied — as `await assertion.assertEqual(...)`. It was missed anyway.

It surfaced only when a *timing* anomaly (`TC_21` at 60.3s) prompted a look at the action
library's timeouts, which led to the assertion library. Adding `await` turned 23/23 green into
**14 passing / 9 failing**, exposing three genuine defects that had been invisible:

| # | Defect | Root cause | Fix |
|---|---|---|---|
| 1 | Surname assertions compared `"MS\nstudent"` to `"student"` (6 TCs) | `#learner-cell-last-name-{{n}}` wraps the row checkbox, the `span.item-name` **avatar initials** and the name | append ` span.item-text` |
| 2 | `TC_18` saw no row movement; `TC_19` saw the wrong sort direction | **Sort persists within the session**; `TC_RESET` cannot clear it (no reset control other than a reload) | `TC_18`/`TC_19` reload first |
| 3 | `TC_20` read 1 guide line instead of 5 (`"User guide"`) | `.collapseUserGuide .mx-4` matches the panel **title `<p>`** as well as the bullet `<div>` | `div.mx-4` |

**For the next session: grep any new test file for `assertion.assert` without `await` before
trusting a single green run.** A static check would catch this cheaply.

---

## 4. Two more state-leak bugs found by reading timings

Both were *passing* tests that were quietly wrong, found because their durations looked odd — a
reminder that **a suspicious duration is evidence**.

- **`TC_21` at 60.3 s.** `TC_20` leaves the guide expanded and `TC_RESET` did not collapse it, so
  `TC_21`'s click targeted `aLearner-11` — the collapsed-state toggle, which no longer existed.
  `baseActionLibrary.click` then burned **two stacked 30s Playwright timeouts**
  (`scrollIntoViewIfNeeded`, then `click`; no `setDefaultTimeout` is configured, so 30s is the
  Playwright default). `TC_RESET` now collapses the guide -> **0.3 s**.
- **`TC_23` at ~0 ms.** It inherited the already-exhausted list from `TC_22`, found `Load more`
  gone, skipped its loop and asserted the aftermath — never exercising exhaustion, and
  order-dependent in violation of ADR-011. It now reloads first -> **5.2 s of real work**.
- **`TC_11` at 20.5 s** (fixed before the `await` discovery): a whitespace-only search returns
  the *same* list, so the row fingerprint could never change and `waitForListChange` burned its
  full 20s budget every run — silently, since it returns `false` rather than throwing.
  `search_student()` gained `{ expectListChange: false }`, which waits for the search banner
  instead -> **0.6 s**. The Classes suite carries the same scar.

---

## 5. Files created / changed

| File | Change |
|---|---|
| `pages/ExperienceApp/schoolStudents.page.js` | **NEW** — 24 methods |
| `test/ExperienceApp/adminStudentsTab.test.js` | **NEW** — 23 TCs + `TC_NAV` + `TC_RESET` |
| `testResources/selectors/ExperienceApp/C1Selectors.json` | +49 lines — `css.ComproC1.schoolStudents`, 46 selectors, all captured live |
| `testResources/testcaseData/ExperienceApp/thor/adminStudentsTabData.json` | **NEW** |
| `testResources/testcaseRepository/ExperienceApp/C1TCRepository.json` | +25 lines — module `SLST`, all `visualTest: false` |
| `testResources/testExecutionFiles/ExperienceApp/thor/adminStudentsTab.json` | **NEW** |
| `package.json` | +1 script — `adminStudentsTabTest_thor` |
| `test/Manual/.../AdminApp_Students_tab_test_cases.md` + `.xlsx` | TC_12/13/14/19 rewritten; 23 Status cells -> Pass; header rolled up. Kept in sync via `node tooling/xlsxRegister.js` |
| `.architecture/product-knowledge/ExperienceApp/admin-students-tab.md` | **+section 7** — verified selectors, measured timings, the three corrections |
| `.architecture/authoring-status.md` | new `adminStudentsTab` block |

> **JSON editing note.** Rewriting these files with `JSON.stringify(..., 3)` reformats the whole
> file — it produced a 1,336-line deletion diff on `C1Selectors.json` and 4,594 on the TC
> repository. Both were reverted and redone as **text insertions preserving CRLF and
> indentation**, giving additions-only diffs. Do it that way.

`node tooling/tcMap.js --findings` reports **no SLST entries** in any failure category. It exits
1 on 13 pre-existing unregistered eBook TCs and 47 pre-existing orphans — unrelated to this work.

---

## 6. Known gaps — what the next session should pick up

1. **`leftNavStudents` in `C1Selectors.json` is ambiguous** — `a:has-text("Students")` also
   matches the hidden help link `a[qid='cHeader-hlp-6']` ("Adding students to a class") and
   resolves to it first. `schoolStudents` uses `a[qid='aDetail-2']`. **The Classes suite still
   carries the ambiguous selector** — worth fixing separately.
2. **The CustomerGauge NPS survey is not handled in the suite.** Removed in the recon script,
   never appeared during a framework run. It intercepts the school-card click when it does, and
   `TST_SADB_TC_1` has no defence.
3. **`getData_studentRows()` is expensive** — ~80 sequential logged action calls to read 20 rows,
   dominating the runtime of every TC that reads rows. A bulk `evaluate`-based read would need a
   new `baseActionLibrary` method (protected file — confirmation first).
4. **Phase 3 (visual) not started.** All 25 TCs are `visualTest: false`. Initial read is "no
   candidates — all dynamic shared-school data", but Phase 3 must confirm that, not inherit it.
5. **SPRF (22) and SBLK (12) not started.** SBLK needs **7 CSV fixtures** built from downloaded
   templates. `TST_SPRF_TC_18` (umbrella name is a plain `<span>` with no link) needs a
   **product decision** before it can be automated.
6. **Nothing is committed.** All of the above is uncommitted in worktree
   `admin-classes-automation-4711b5`.

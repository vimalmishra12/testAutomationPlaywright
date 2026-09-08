# Walkthrough — `schoolReports.test.js` (module MRPT) — 2026-09-08, 08h-00m

**Session goal.** Phase 1 build of the **MRPT read-only block** — 12 automated cases for the Admin
App Reports tab and its Create report flow — starting from `HANDOFF_adminReportsTab_20260907.md`.

**Environment.** Thor, `https://micro-nemo.comprodls.com`, school **`FCN-CHZ-PDA`**
("3 July Test School 1", org `org_perf_testschool_1`), account `testt1@mailsac.com`, headed
`desktop-chrome-1920`. Thor was **healthy all session** — school selection and `Create report`
both worked first time, where both had been broken or inert on 2026-09-07.

---

## 0. A blocker found before any work started

The handoff assumed the branch already held two commits. It did not.

This worktree's branch `claude/admin-reports-tab-handoff-4060b3` was cut from **`main`**, not from
`claude/admin-staff-tab-handoff-2b4a89`, and was missing:

- `51938b7` — the MRAC rename that frees the `MRPT` module code. Verified live: `TST_MRPT_TC_1`
  and `TST_MRPT_TC_2` were still registered as the **teacher-side "Manage Reports Accessibility"**
  cases (`moduleId: ""`), so `MRPT` was **not** free and `TST_MRPT_TC_2` — in this batch's scope —
  would have collided head-on.
- `e208b22` — the STFP suite, i.e. the `staffProfile.page.js` the handoff §10 names as the
  structural reference.

**Resolved** by merging the staff branch in (user's choice from four options). Clean merge, both
commits present, `MRPT` free.

> **Lesson.** A handoff describes the branch it was written on. Verify the repo state it assumes
> before trusting any of its "already done" claims — this one was accurate about the work and wrong
> about where the work lived.

---

## 1. Live grounding pass

Six of the twelve cases were ungrounded, and one (`TC_19`) had failed to confirm the previous day.
All six were resolved in a single pass, plus two bonus cases.

### What the live pass changed

**Four of the handoff's selectors were wrong:**

| Handoff | Actual |
|---|---|
| `createReport-6` = Select all classes | **"Sort by Students"**. Select-all is `createReport-2` / `#checkbox-selectallclasses` |
| `a[qid='createReport-15']` | it is a **`<button>`** — an anchor selector matches nothing |
| `a[qid='createReport-14']` | also a **`<button>`** |
| row id `checkbox-N` | **0-based** (`checkbox-0`) |

**Six register expected results were wrong** — all corrected, all listed in §2 below.

**Two new traps**, neither previously recorded anywhere:

1. **The select-all label is 0×0.** It renders no text, so Playwright refuses to click it as "not
   visible"; the **input** must be clicked (opacity-0 is still visible to Playwright). This is the
   **exact opposite** of the row checkboxes on the *same screen*, where `admin-shared.md` §B5's
   click-the-label rule applies. §B5 has been qualified accordingly.
2. **Neither the filter nor the search persists** across a reload — the opposite of the Classes
   tab's server-side persistence. **No reset discipline is owed on this screen.**

### The one behavioural question raised with the user

`TST_MRPT_TC_18` expected the class-step **Cancel** to return to the Reports tab. **It does not** —
it clears the selection and stays. Reproduced twice, the second time on a freshly reloaded page,
no dialog, no backdrop, 0 visible modals. `Go back` (`createReport-1`) is the control that exits,
verified immediately afterwards.

Per **Invariant 14** this was raised rather than silently rewritten. The user confirmed it as
**accepted product behaviour, not a defect**, and the register was corrected.

---

## 2. Register and product-knowledge corrections

**`admin-reports-tab.md` gained §10** (229 → 494 lines), including four corrections to its own
earlier claims and the two new traps above.

**Six corrected expected results:**

| TC | Was | Is |
|---|---|---|
| `TC_4` | search is submit-driven (inherited from the Classes tab) | **live/debounced, ~1 s** |
| `TC_8` | five **unticked** status boxes | **all five TICKED** by default |
| `TC_9` | summary label `[ASSUMED]` | **`1 class status`** (N = ticked statuses) |
| `TC_10` | `Clear all` unticks everything | **a RESET** — re-ticks all five, applies immediately, closes the panel |
| `TC_14` | `<N>` = the number of listed classes | **every MATCHING class** (110), not the 20 rendered |
| `TC_18` | Cancel returns to the Reports tab | **clears the selection, stays on the page** |

`TC_19` moved from `[ASSUMED]` to verified; `TC_40` was **rewritten** (its class-label premise was
disproved live, so it now pins the *absence* of a label filter).

### ⚠️ Real drift found in the register generator

`AdminApp_Reports_tab_test_cases.md` / `.xlsx` are generated from `_tcdata.js` by `_generate.js`
specifically so they cannot drift. **They had drifted anyway**, because three later edits were made
to the outputs and never to the source:

- **`TC_40`, `TC_41`, `TC_42`** (the 2026-09-01 gap-analysis batch) existed only in the `.md`/`.xlsx`.
- The **`[EXTRA — Phase 1 exclusion]` marker on ten cases** likewise.
- Two header notes likewise.

**Running `node _generate.js` would have silently deleted all of it.** All three were restored into
the generator before regenerating. Verified afterwards: the 42 TC ids are an **identical set**, 10
exclusion markers, 5 Blocked.

> **Lesson.** "Generated, so it cannot drift" is only true while everyone regenerates. Diff the
> generator's output against the committed file **before** running it, not after.

---

## 3. Phase 1 build

| Artefact | Path |
|---|---|
| Page object | `pages/ExperienceApp/schoolReports.page.js` |
| Test file | `test/ExperienceApp/schoolReports.test.js` |
| Selectors | `css.ComproC1.schoolReports` (38 keys) |
| Test data | `testcaseData/ExperienceApp/thor/adminSchoolReportsData.json` |
| Exec file | `testExecutionFiles/ExperienceApp/thor/adminSchoolReports.json` |
| npm script | `adminSchoolReportsTest_thor` |

### ⚠️ Naming deviation from AGENTS.md Rule 6 — deliberate

Rule 6 and `manual-test-standard.md` both cite `manageReports.page.js` as MRPT's worked example.
**That filename was already taken** by the teacher-side class-page flow (module MRAC). The page
object is therefore **`schoolReports.page.js`**, following the admin-tab convention
(`schoolStaff`, `schoolStudents`, `schoolClasses`), while the **module code stays `MRPT`** — it is
fixed across a 42-case register and the product-knowledge file, and commit `51938b7` renamed the
older module specifically to free it. Recorded in the page-object header and the TC-repo modulename.

### Cleanup placement (ADR-019)

Reset is in **`BeforeEach`**; the exec file's **`AfterEach` is empty by design**. `TC_9`'s evidence
is a filtered list and `TC_14`'s is a full selection — an `AfterEach` reload would reload the page
microseconds before each screenshot and photograph the pristine list while the tests still reported
green. `After` is also empty: nothing is created, and neither filter nor search persists.

### Applicable-traps table (Phase 1 step 0b)

| Trap | Applies? | Where handled |
|---|---|---|
| Pre-rendered modals → presence is a false green (§B2) | yes | every dialog check uses `isDisplayed`; 4 modals on this route |
| Positional row ids (§B3) | yes | rows resolved by label TEXT via `getFilteredLocator`, never by index |
| `createReport-11-N` count is a false green | yes | used only as a total-count oracle, never as "rows rendered" |
| Angular ignores `fill()` (§B5) | yes | `clearValue` + `addValue`, with a value read-back |
| Click the label, not the input (§B5) | **partly** | true for rows; **inverted** for select-all — see §1 |
| Server-side search/filter persistence (§B7) | **no** | neither persists here; reset is a plain reload |
| Optimistic UI — wait on the real signal (§B6) | yes | **and got it wrong first time — see §4** |
| CSS-only disabled buttons (§B4) | no | Submit is disabled natively *and* by class; both asserted |
| `.list-items` class collision (§B3) | yes | scoped to the `create-report` component tag |
| Never invent a timeout (Invariant 1) | yes | every budget cites a measurement |

---

## 4. Run 1 — 4 passing / 8 failing (228.8 s), and the mistake worth recording

Passing: `TC_8`, `TC_9`, `TC_14`, `TC_40`.

Three causes, **all mine — no product defect**:

### A. The search wait was the wrong SHAPE (`TC_4`, `TC_5`)

`search_class` polled for *"the row count has not changed across 3 consecutive 100 ms reads"* and
reported success in ~300 ms — **while the list still held the pre-search 20 rows**.

Measured the debounce live afterwards: the list narrows **20 → 1 at 994 ms**. So the stability
window expired before the filter had even started.

> **The lesson, stated plainly: a stability check cannot distinguish "hasn't started" from
> "finished".** This is `admin-shared.md` §B6 in a new disguise — there was no premature
> announcement to be fooled by, so I was fooled by *absence of change* instead. The trap list was
> read at session start and the mistake was made anyway, which is the same failure the CGST session
> recorded. Reading a trap is not applying it.

**Fix:** wait for the **row-label fingerprint to CHANGE**, then settle — the signal §B6 prescribes
for sort order, and it also catches a search returning a different set of the same size.

### B. Downstream of A (`TC_13`, `TC_18`, `TC_19`, `TC_27`, `TC_34`)

All five failed with *"found 0 rows matching Fixture_GradeSettings_DO_NOT_DELETE"*: with the search
not filtering, only 20 of 110 rows render and the fixture is not among them. No separate fix.

### C. The class-selection step has NO school tab strip (`TC_2`)

`click_reportsTab` timed out after 30 s. Verified live: `/reports/create` renders **zero
`aDetail-*` links**. It is a full-page flow, not a tab, so **`Go back` is the only route back**.
`click_reportsTab` remains correct from the Classes tab, where the Before chain uses it.

Both new findings promoted to `admin-reports-tab.md` §10.15 and §10.16.

---

## 4b. Run 2 — 6 passing / 6 failing (923.2 s) — the fix worked, and exposed a worse bug

`TC_2` and `TC_18` went green, confirming both run-1 fixes. But all six remaining failures were
now **mocha 120 s timeouts**, and mocha's generic message had **replaced every diagnostic** — the
run said nothing about what had actually failed.

The tell was that `TC_18` passed in **10 s** while `TC_13` timed out at **120 s** on the *same*
`search_class` call with the *same* term. That is a race, not slowness.

The framework's own error log gave it away:

```
locator.innerText: Timeout 30000ms exceeded.
  waiting for locator('create-report div.list-items label.custom-control-label').nth(4).first()
```

**The fingerprint could not survive the change it existed to detect.** It read the row count (20),
then looped `.nth(0)…nth(19)`; the ~1 s debounce fired mid-loop, the list collapsed to 1 row, and
`.nth(4)` blocked for Playwright's full 30 s default waiting for an element that no longer existed.
A few such stalls per test exhausted mocha's cap.

**Three fixes** (approved before applying, Invariant 9):

1. **Atomic read.** `create-report div.list-view` — a single element containing every row — read
   once with `getText`. One call instead of twenty-one, and impossible to go stale between reads.
2. **Budgets with headroom.** `SEARCH_CHANGE_TIMEOUT = 15000` + `SEARCH_SETTLE_TIMEOUT = 5000`
   replace two 30 s budgets, so the page object's own diagnostic fires before mocha's clock.
3. Promoted to `admin-reports-tab.md` **§10.17**.

## 4c. Runs 3 and 4 — **12 / 12 passing, twice**

From 923 s to 106 s, every case 1–5 s. Run 4 was executed as a stability confirmation, because a
single green run against a **race** fix proves very little — a race can pass by luck.

| Run | Result | Cause |
|---|---|---|
| 1 | 4/12 (228.8 s) | wrong wait SHAPE; no tab strip on `/reports/create` |
| 2 | 6/12 (923.2 s) | stale-index race → six mocha 120 s timeouts, diagnostics lost |
| 3 | **12/12 (106.5 s)** | — |
| 4 | **12/12 (113.3 s)** | stability confirmation |

> **The through-line of all three runs.** Every failure was mine; not one was a product defect.
> And the three bugs were the *same* mistake at three depths: I waited on the wrong signal
> (§B6), then read the right signal in a way that raced it, then hid the evidence by letting
> mocha's timeout beat my own (§B8). The trap list was read at session start and covers all
> three. **Reading a trap is not applying it** — the CGST session recorded that exact lesson,
> and it repeated here.

---

## 5. Files touched

**Commit `17c99a7`** — knowledge + register corrections:
`admin-reports-tab.md`, `admin-shared.md`, `_tcdata.js`, `_generate.js`, and the regenerated
`.md` + `.xlsx`.

**Build (uncommitted at the time of writing):**
`schoolReports.page.js`, `schoolReports.test.js`, `C1Selectors.json`, `C1TCRepository.json`,
`adminSchoolReportsData.json`, `adminSchoolReports.json`, `package.json`.

---

## 6. Carried forward

1. **The nine report-CREATING cases** (`TC_21`–`TC_26`, `TC_28`, `TC_35`, `TC_37`) still need their
   own data-owning suite — every one adds a real report to the shared school.
2. **`TC_6` and `TC_7` remain open** — whether the search is a substring or fuzzy match, and the
   no-results copy. The 2026-09-08 pass settled *how* the search fires, not *what* it matches.
3. **`TC_20`** — whether the dialog's Close (X) behaves identically to its Cancel. Untested.
4. **`TC_41` / `TC_42`** stay Blocked on a seeded, frozen-activity fixture class — recorded as the
   single most valuable fixture on the Reports backlog.
5. **`MRAC` is failing 0/2** — pre-existing, unrelated, not investigated by user decision.
6. **`tcMap --findings` exits 1** on 13 pre-existing UNREGISTERED eBook TCs. MRPT itself is clean:
   0 MISFILED, 0 GHOST.
7. **Phase 2 and Phase 3 are both ⬜ pending** for this suite.

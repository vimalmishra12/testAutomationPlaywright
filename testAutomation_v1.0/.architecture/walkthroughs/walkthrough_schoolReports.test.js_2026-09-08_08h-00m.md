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

## 4d. Phase 2 exit — evidence audit and traps re-check

**All 12 passing, 2 consecutive clean runs (106.5 s, 113.3 s).**

**Evidence audit.** All 12 screenshots were extracted from `report.json` and inspected — not just
counted. Every one shows what its TC asserts:

- `TC_9` — `1 class status` beside Filter, every rendered row `Active`. This is the exact case
  shape that ran green for weeks in `adminClassesTab` while photographing the *unfiltered* list;
  it is correct here because the reset is in `BeforeEach` (ADR-019), not `AfterEach`.
- `TC_14` — `Select classes (110)` with the footer reading *110 classes with a total of 30
  students* while only 20 rows render. The central correction is visible in the image.
- `TC_8` — the filter panel open with all five statuses **ticked**, which visually proves the
  register correction.
- `TC_27` — dialog open, `Class summary`, `Custom date range`, defaults `Wed, Sep 2, 2026` →
  `Tue, Sep 8, 2026`, Submit enabled.

> ⚠️ **`TC_18` is the one weak image**, and it is worth naming. A cleared selection looks identical
> to a test that never selected anything. It stands only because `click_selectClassByText` waits
> for the footer bar to APPEAR before the cancel, so the selection is proven before it is cleared.
> **Keep that wait if the method is ever refactored** — without it the case still passes and its
> evidence becomes meaningless, which is precisely the failure this audit exists to catch.

**Falsifiability.** 95 assertions; no `>= 0`, no truthy-only checks, and every page-object call's
result is captured and asserted — no fire-and-forget.

**Traps table re-checked against shipped code.** Every "applies here" row has a real handler:
modals use `isDisplayed`/`waitForDisplayed`; rows resolve by content via `getFilteredLocator`; no
`setValue`/`fill` anywhere; `.list-items` and `.list-view` are scoped to the `create-report`
component tag; the footer's absence uses `isExisting` (truthful here, per §5); select-all clicks
the input while rows click the label.

> **One row applied and was missed at build time — twice.** §B6, "wait on the thing that actually
> changed". It cost runs 1 and 2. Recorded rather than quietly fixed: a documented trap being hit
> anyway is the thing worth knowing.

---

## 4e. Phase 3 — visual assessment: NO CANDIDATES

Every one of the 12 TCs hits a ❌ row on the AGENTS.md §8 decision table, so none is a candidate
and no user confirmation was required (the rule is explicit that this is not a judgment call).
All 12 remain `visualTest: false`; no `visualAcceptance_*` script was added.

| TC | Data in frame | Decision-table row |
|---|---|---|
| `TC_2` | class names, keys, dates, student counts | user-generated keys · timestamps · dynamic counts |
| `TC_4` `TC_5` | matched row, key, dates | user-generated keys · timestamps |
| `TC_8` `TC_40` | filter panel — live class list in frame behind it | paginated / dynamic counts |
| `TC_9` | filtered list, 20 live rows | paginated / dynamic counts |
| `TC_13` | selection + footer counts | dynamic counts |
| `TC_14` | `Select classes (110)`, footer totals | dynamic counts |
| `TC_18` `TC_19` | class list in frame | user-generated keys · timestamps |
| `TC_27` | **date defaults change daily**, list behind the modal | timestamps / dates |
| `TC_34` | dialog with the live list visible behind it | dynamic counts |

This is the eleventh admin assessment to reach "no candidates" (§B10), but it was **verified
against the actual screenshots**, not inherited from precedent. Two things the images settled:

1. **`TC_27` is the strongest ❌ in the set.** Its custom date range defaults to *today − 6 →
   today*, so a baseline captured today fails tomorrow by design, with no UI change at all.
2. **The dialog cases are not the exception they appear to be.** In the `TC_27` and `TC_34` images
   the school's live class list is plainly visible behind and around the modal, so even the
   "static dialog in frame" argument does not hold here — exactly the precedent §B10 records.

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
7. **`getData_rowLabels` still uses a `.nth(i)` loop** — the same shape as the bug in §10.17. It
   only ever runs after `search_class` returns, i.e. on a settled list, so it was not implicated in
   the run-2 failures. Worth replacing with a container read if that method is ever called
   mid-transition.
8. **Coverage arithmetic**, so the remaining work is not misread. The register holds **42** cases:
   10 are `[EXTRA — Phase 1 exclusion]` and 5 are Blocked at design time (3 overlap), leaving
   **30 in Phase 1 scope**. Of those, **12 are automated here**, **9 create a real report** and
   need a data-owning suite, and **9 read-only edge/negative cases remain** — `TC_6`, `TC_7`,
   `TC_10`, `TC_11`, `TC_12`, `TC_15`, `TC_16`, `TC_20`, `TC_31`.
   > ⚠️ Earlier notes in this session repeated the handoff's *"21 positive cases in Phase 1 scope"*.
   > That figure counts **Positive-type only**. The all-types in-scope total is **30**, so 18 cases
   > remain, not 9.

**All three phases are complete. This feature is closed** — its `authoring-status.md` block has
been removed per that file's own rule (it holds in-flight work only; history lives here).

---
---

# Session 2 — the DATA-OWNING half (`schoolReportsCreate.test.js`) — 2026-09-10

**Goal.** Automate the 8 report-CREATING cases (`TC_21`–`TC_26`, `TC_28`, `TC_37`) that Session 1
deliberately deferred. `TC_35` stayed deferred by user decision — it needs a file-content
comparison and a class with a grade exclusion, the same dependency as the Blocked `TC_41`/`TC_42`.

**Environment — deliberately NOT the same as Session 1.** Thor, school **`VED-NEH-KVU`**
("Cqa Test Ashish School 1", org `org_cup_j9GskaJJmvDjmQZ9`) via
**`cqatestashish_admin@mailsac.com`**. The user supplied the account and two purpose-built
fixture classes, and confirmed the school exists for automation.

The credential gap that forced Session 1 onto `FCN-CHZ-PDA` is now closed: the password was added
as `C1.login.user.reportsSchoolAdmin`. It was copied programmatically from the existing
`schoolAdmin` node on the user's instruction, so the value never passed through the conversation.

---

## S2.1 The finding that changed the design: reports cannot be deleted

The plan was "create reports, then clean them up". **Grounding killed it.**

A created report's row carries **exactly one control — `Download`**. The
`Remove from the reports list` button (`aReport-9`) that made cleanup look possible turned out to
live inside **`#reportCreationFailedModal`**: it removes a **failed** report, not a successful one.

Raised with the user, who **accepted the accumulation**. Consequences, all now written into the
code and the register rather than left as tribal knowledge:

- there is **no `After` hook**, and its absence is documented as deliberate
- one run leaves **8 reports** for **60 days**
- the suite runs on an automation-only school and **never** on the shared `FCN-CHZ-PDA`

> **Lesson.** A control's *label* is not its *scope*. `aReport-9` reads exactly like a per-row
> delete in a selector sweep. Ten minutes of grounding replaced a design that could not have worked.

---

## S2.2 Four failures across five runs — every one mine, none a product defect

| Run | Result | Cause |
|---|---|---|
| 1 | **0 tests ran** | Before chain waited for a school-picker card this account never renders |
| 2 | 6/8 (116 s) | date picker matched by text; Download asserted before generation finished |
| 3 | 8/8 (**385 s**) | passing, but degrading badly |
| 4 | 8/8 (154 s) | after the list-read fix |
| 5 | **8/8 (121 s)** | determinism confirmed |

### A. A single-school admin never sees "My school accounts"

`cqatestashish_admin` administers exactly ONE school, so the app skips the picker entirely —
`/admin/admin/dashboard` **redirects** to the school and renders **zero** cards. The standard
`TST_NEMO24306_TC_LOGIN` waits for `aDashboard-1` and timed out after 30 s.

**The message blamed the wrong thing** — *"School admin dashboard did not load after login"* —
and looked exactly like a wrong password. It was not; the password was fine.

Fixed with `login.click_login_btn_singleSchoolAdmin()`, which waits for the URL to reach a school
context. And because there is no picker, `TST_SADB_TC_1` cannot run — so the school key is
**asserted** from `span.school-code` instead of selected. On a suite that creates real data,
silently landing on the wrong school is the worst available failure.

### B. `getFilteredLocator` filters by TEXT — the same mistake in a new place

A calendar cell's text is the day number (`"7"`); the date lives only in `aria-label`. Filtering
`"Sep 7, 2026"` found 0 cells.

> This is Session 1's mistake wearing a different hat. §10.1 says *resolve by content* — and that
> helper is the natural tool — but **content is not always text**. It works for class rows, whose
> label carries the whole row, and not for calendar cells, whose identity is an attribute.

### C. Generation is async — the row lists before the Download exists

The list held 2 rows and 1 Download because the new report was still generating. The original
assertion also spanned the **whole list**, including rows this suite never created. Scoping it to
the newest row and polling made it both stronger and stable.

### D. ⚠️ The list only grows — so never read it row by row

Because reports cannot be deleted, the list grows by 8 per run. A page object that looped `getText`
over every row took the suite from **116 s to 385 s between two runs** purely from list growth.
Left alone it would have hit mocha's per-test timeout for a reason unrelated to the product.

> **The most transferable lesson of the session.** This cost is **invisible on the first run** and
> compounds forever. Any admin list fed by a suite that cannot clean up has the same shape — read
> the heading count and the newest row, never the whole list.

---

## S2.3 Phase 3 — no visual candidates

All 8 hit ❌ rows: every case ends on the Reports list, framing a file size, a creation date, a
date range containing today, and a `Reports (N)` count that **increases on every run** — so a
baseline fails on the very next execution. `TC_28` adds a custom window computed from today.

Clearer-cut than either previous admin assessment. All stay `visualTest: false`.

---

## S2.4 Coverage after this session

**20 of 42 automated**, across two suites that must stay separate:

| Suite | npm script | TCs | School | Side effects |
|---|---|---|---|---|
| Read-only | `adminSchoolReportsTest_thor` | 12 | `FCN-CHZ-PDA` | none |
| Data-owning | `adminSchoolReportsCreateTest_thor` | 8 | `VED-NEH-KVU` | 8 real reports/run |

⚠️ **Do not merge them.** `TC_14` asserts the selection exceeds the rendered page and `TC_9` needs
a status that excludes something — neither is possible on `VED-NEH-KVU`'s 9 all-Active classes.

**Remaining: 22.** `TC_35` plus the 9 read-only edge/negative cases (`TC_6`, `TC_7`, `TC_10`,
`TC_11`, `TC_12`, `TC_15`, `TC_16`, `TC_20`, `TC_31`), the 10 Phase 1 exclusions and the
design-time Blocked set.

**Carried forward:**

1. **`Automation_class2_DND` (0 students) is unused.** Whether an empty class produces a valid
   report, an empty one, or a generation failure is **untested** — no case covers it.
2. **CI cost.** Daily runs would leave hundreds of undeletable reports inside the 60-day window.
   Worth a deliberate decision before this suite is scheduled.
3. `TC_35`, `TC_41`, `TC_42` all wait on the same fixture: a class with known, frozen activity and
   a grade exclusion.

---
---

# Session 3 — the read-only edge/negative block — 2026-09-10

**Goal.** The nine remaining read-only cases: `TC_6`, `TC_7`, `TC_10`, `TC_11`, `TC_12`, `TC_15`,
`TC_16`, `TC_20`, `TC_31`. They join the EXISTING read-only suite on `FCN-CHZ-PDA` (`testt1`),
taking it from 12 to 21 cases.

**Result: 21/21 on two consecutive runs (153 s, 201 s).** Coverage 20 → **29 of 42**.

---

## S3.1 Four register `[ASSUMED]`s resolved, one of them wrong

| Open item | Answer |
|---|---|
| #1 — is the search substring or fuzzy? | **SUBSTRING.** `schoolclass` → 0, `licence` → 0, `License Test` → 4 |
| #1 — the no-results copy | ⚠️ **`No results`** — a bare string. The `[ASSUMED]` expected the Classes tab's term-echoing form and was **wrong** |
| #5 — does the dialog's `Close (X)` match its `Cancel`? | **Yes**, identically. The `[ASSUMED]` was right |
| #8 — does the `To` floor track `From`? | **Yes** — the picker's enabled window is exactly `[From, today]` |

> The two **negative** search probes are the part worth keeping. A case asserting only
> *"`school license` returns 4"* would pass against a fuzzy implementation too; `schoolclass` → 0
> is what actually pins substring.

⚠️ **`Close (X)` makes FOUR dismiss-like controls on this flow, with three outcomes** —
`createReport-1` leaves, `createReport-13` clears the selection, and `createReport-15` +
`crm-close` both merely close the dialog. §5's "two separate Cancels" warning was an undercount.

## S3.2 `TC_12` could not be automated as written

The case wants a filter that matches nothing. Measured on `FCN-CHZ-PDA`:

| Not started | Active | Ended | Expired | Deleted | Total |
|---|---|---|---|---|---|
| 10 | 21 | 6 | 24 | 49 | **110** ✓ |

**Every status holds classes**, so the premise is not reproducible here — a data fact, not a
defect. Rewritten by user decision to combine a status filter with a class not in that status,
which reaches the identical empty state.

> ⚠️ **Coverage note, deliberately not buried:** the empty state is now proven, but *"a filter
> ALONE matching nothing"* is **not**. That needs a school where some status is genuinely empty.
> Recorded in the test file, the data file and §12.6.

The same measurement gave `TC_11` a much better assertion than planned: the five statuses sum
exactly to 110, so a class holds **exactly one** status and the sets are disjoint — therefore
`|A ∪ B|` must equal `|A| + |B|`. **One equality rules out AND (0), last-selection-wins (one of
the two) and a broken union at once**, and needs no hardcoded number on a churning shared school.

## S3.3 One deliberate Invariant-2 exception

`TC_16` needs to tick two rows and untick one. `FCN-CHZ-PDA` holds many classes sharing a name
(`BulkCSV_Class1` ×3+, `AutoClass_CreateOnly` ×8), so *"the second BulkCSV_Class1"* is not
expressible by text — `click_selectClassByText` cannot serve it.

`click_selectClassByIndex` was added for this, and the reasoning is written into the method:
Invariant 2 forbids positional ids because they get **re-issued**, and here the index is used and
discarded **inside one settled list** with no search, filter or sort in between. Anywhere a name
is unique, the by-text method is still the right one.

## S3.4 ⚠️ Performance: 822 s → 153 s, with no assertion changed

The suite passed at 822 s before any of this. **None of these three defects failed a test** —
they only made it crawl, which is exactly why they survive a first run unnoticed.

Found by **summing the framework's own info-log timestamps per action name**, not by reading the
code and guessing. The ranking was not what the code looked like it would be:

| Action | Calls | Total |
|---|---|---|
| `getElementCount` | 284 | **320 s** |
| `isSelected` | 161 | **108 s** |
| `waitForDocumentLoad` | 26 | 90 s |

**(a) Never `getText` an element that may be absent.** On a zero-result search `div.list-view` is
removed, so the settle-poll waited Playwright's **full 30 s default on every poll** — each such
search cost ~90 s. Read the count first; read content only when there is some.

**(b) Never loop `isSelected` over rows.** ~0.67 s per call here, so a 20-row loop cost ~13 s
*every* time the method ran. One `:checked` count replaces it.

**(c) `getElementCount` is ~1.1 s per call** on this screen — the most expensive action, so a
poll that calls it repeatedly deserves designing.

> **The pattern across all three sessions.** Every failure and every slowdown has been one of two
> shapes: **an incomplete signal** (watching the rendered page when the matching total is what
> moves) or **waiting on something absent** (`.nth(4)` after the list shrank; `div.list-view` when
> empty). Four instances now. The second shape is the more dangerous — it does not fail, it just
> costs 30 s in silence.

**One mistake caught in the act.** While optimising, the per-box `statusChecked` array was
reconstructed from a count as "first N are true". That is wrong the moment a *middle* status is
the ticked one. It only fed an error message, but **a diagnostic that lies is worse than one that
is absent** — replaced with an honest `checkedCount`.

## S3.5 Phase 3 — no visual candidates

All nine hit ❌ rows: every case frames the shared school's live class list or its counts.
`TC_31` is the clearest — its picker window is `[From, today]`, which changes daily. All stay
`visualTest: false`.

## S3.6 Coverage now

**29 of 42.** Remaining **13**: `TC_35` (deferred, needs file-content comparison), 7 Phase 1
exclusions (`TC_1`, `TC_3`, `TC_29`, `TC_30`, `TC_32`, `TC_33`, `TC_36`), and 5 Blocked
(`TC_17`, `TC_38`, `TC_39`, `TC_41`, `TC_42`).

**Carried forward:**

1. **`TC_41` remains the most valuable gap.** All 8 creating cases assert only that a report *was
   created* — **nothing checks the numbers inside it**. A report generated with wrong content
   passes every case in this repo.
2. The pure-filter empty state (§S3.2) needs a school with an empty status.
3. `Automation_class2_DND` (0 students) is still unused — the empty-class report is untested.

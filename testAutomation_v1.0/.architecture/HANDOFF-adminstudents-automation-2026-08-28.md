# HANDOFF — Admin App Students tab automation (2026-08-28)

> **Read this file alone and you can continue the work.**
>
> It **supersedes** `HANDOFF-adminstudents-automation.md` (the design-only handoff of
> 2026-08-22), which is still on disk but now out of date — this version says where each of its
> open questions actually landed. Where the two disagree, **this file wins**.
>
> Deeper narrative: `.architecture/walkthroughs/walkthrough_adminStudentsTab.test.js_2026-08-22_20h-50m.md`
> (§"Session 2"). Screen knowledge: `product-knowledge/ExperienceApp/admin-students-tab.md`.

---

## 0. Start here

1. Read the mandatory architecture set (`CLAUDE.md` §MANDATORY) — including
   `product-knowledge/ExperienceApp/admin-shared.md` **Part A + Part B** and
   **`product-knowledge/ExperienceApp/admin-students-tab.md`**, whose **§7** is the
   live-captured automation knowledge from this work (selectors, timings, corrections).
2. Use the repo skill **`c1-test-authoring`** from `D:\testAutomation\QATestAutomation\.agent\skills\`
   — **not** the bundled plugin skill and **not** a worktree copy.
3. Read `.architecture/authoring-status.md` → the `adminStudentsTab` block.
4. Then §5 below — what to do next.

**Prove the baseline before changing anything:**

```bash
npm run adminStudentsTabTest_thor
```

Expected: **23 passing, 0 failing**, ~2 minutes. If it is not green, fix that first — do not
build on an unknown baseline.

---

## 1. Where the work stands

| Module | Page object | TCs | State |
|---|---|---|---|
| **SLST** — Students tab list | `schoolStudents.page.js` ✅ built | 25 | **23 automated and passing.** TC_14 Blocked, TC_25 not written |
| **SPRF** — profile & manage account | `studentProfile.page.js` — **not created** | 22 | **0 automated** |
| **SBLK** — bulk operations | `bulkStudents.page.js` — **not created** | 12 | **0 automated** |

**23 of 59 manual TCs are automated and passing**, verified on Thor across two consecutive
clean runs. Committed as **`66831f6`** on `main` (see §8.3 — it may still be unpushed).

Phase status: Phase 1 ✅, Phase 2 ✅ (folded into the same session),
**Phase 3 (visual) ⬜ not started** — all TCs are `visualTest: false`. A feature is not done
until Phase 3 completes, even if its outcome is "no candidates".

### Files owned by this work

```
pages/ExperienceApp/schoolStudents.page.js                              (24 methods)
test/ExperienceApp/adminStudentsTab.test.js                             (23 TCs + TC_NAV + TC_RESET)
testResources/selectors/ExperienceApp/C1Selectors.json                  → css.ComproC1.schoolStudents (46 selectors)
testResources/testcaseData/ExperienceApp/thor/adminStudentsTabData.json
testResources/testcaseRepository/ExperienceApp/C1TCRepository.json      → module SLST
testResources/testExecutionFiles/ExperienceApp/thor/adminStudentsTab.json
package.json                                                            → adminStudentsTabTest_thor
```

---

## 2. Environment and how to run

| | |
|---|---|
| Env | `thor` — `https://micro-nemo.comprodls.com` |
| **School (read-only suite)** | **`FCN-CHZ-PDA`** = "3 July Test School 1", slug `org_perf_testschool_1` |
| Login | `testt1@mailsac.com` → `logindata.json` → `C1.login.user.schoolAdmin` |
| Script | `npm run adminStudentsTabTest_thor` |
| Run mode | headed (system Chrome) |

⚠️ **Select the school by KEY, never by name or card position** — two schools share the display
name "3 July Test School 1" (`FCN-CHZ-PDA` and `ZPB-TWP-AEQ`).

⚠️ **The school is SHARED and actively mutated** — 26 students on 2026-08-22, 27 on 2026-08-28.
**Never assert an absolute count.** Compare a count to itself across a step.

### Data-creating work goes to a DIFFERENT school (agreed with the user 2026-08-28)

| | |
|---|---|
| School | **Cqa Test Ashish School 1** — key **`VED-NEH-KVU`**, slug `org_cup_j9GskaJJmvDjmQZ9` |
| Login | `cqatestashish_admin@mailsac.com`, password **`Compro11`** (same as the existing admin — user-confirmed, **not yet exercised**) |

**This login is NOT yet in `logindata.json`.** Add it as a second entry (e.g.
`C1.login.user.schoolAdminAutomation`) before writing `TST_SLST_TC_25` or any SBLK case.

The read-only suite deliberately **stays on FCN-CHZ-PDA** because all its fixtures (§4) are
documented there. Consolidating onto one school is an agreed **later cleanup**, not current work.

**The user has confirmed creating a student on every run is acceptable**, and asked that newly
created students be reused by other tests where possible. Sweepable prefix: `AutoStudent_`.

---

## 3. ⚠️ Read this before writing a single line of test code

Every item below cost real time last session. All are fixed in the code you are inheriting —
do not reintroduce them.

### 3.1 `await` every assertion — this one hid everything else

```js
await assertion.assertEqual(actual, expected, "message");   // CORRECT
assertion.assertEqual(actual, expected, "message");         // SILENTLY ALWAYS PASSES
```

`baseAssertionLibrary.assertEqual` is **async and throws**. Without `await` the rejection is
unhandled and mocha reports a pass. The last session wrote all 163 assertions without it and the
suite reported **23/23 green while asserting nothing**. Adding `await` turned that into
**14 passing / 9 failing**, revealing three real defects that had been invisible from the start.

**Before trusting any green run on a new test file:**

```bash
grep -n "assertion\.assert" test/ExperienceApp/<file>.test.js | grep -v "await assertion"
```

Zero output = good.

### 3.2 State LEAKS between TCs — `TC_RESET` cannot clear everything

`TC_RESET` (BeforeEach + suite-level **After**, never AfterEach — ADR-019) clears the search,
unticks the activation checkbox and collapses the user guide. It **cannot** reset the **sort** —
there is no reset control; only a page reload restores the default. Any TC depending on a known
sort must call `reload_studentsTab()` first. `TC_18`, `TC_19` and `TC_23` do exactly that.

`TC_23` is the cautionary tale: it originally inherited an exhausted list from `TC_22`, skipped
its own loop, asserted the aftermath and passed in ~0 ms without testing anything (ADR-011).

**Read the durations in the run output — a suspiciously fast or slow TC is evidence:**
- `TC_21` at **60.3 s** = two stacked 30 s Playwright timeouts clicking an element that no longer
  existed (no `setDefaultTimeout` is configured, so 30 s is the default; `baseActionLibrary.click`
  waits once in `scrollIntoViewIfNeeded` and again in `click`).
- `TC_11` at **20.5 s** = `waitForListChange` burning its whole budget because the list could not
  change. It returns `false` rather than throwing, so it fails **silently**. Use
  `search_student(term, { expectListChange: false })` whenever the result set cannot move.

### 3.3 Screen traps (all handled in `schoolStudents.page.js` — mirror the approach)

- **4 modals are pre-rendered** with nothing open → a presence/count check is a guaranteed false
  green. Use `isDisplayed`.
- **Row menu items are pre-rendered once per row** — 20 copies of `a[qid='aLearner-83']`, **all
  sharing that one qid**. Scope to `#learnerActionsMenu-{{n}}`, which IS unique per row.
- **Row ids are positional** (`aLearner-15-<index>`) and shift with sort/search/load-more. Resolve
  a row by content — `findRowIndexByText()` matches the action button's `aria-label`, which is
  also the **only** place Adult/Child is exposed.
- **The last-name cell contains the avatar initials.** `#learner-cell-last-name-{{n}}` wraps the
  checkbox, a `span.item-name` badge ("MS") **and** the name. Read `… span.item-text`.
- **The user-guide toggle is a different element per state** — `aLearner-11` collapsed,
  `aLearner-12` expanded. The panel is genuinely **removed** from the DOM when collapsed.
- **`Load more` is REMOVED, not disabled**, when exhausted → assert absence.
- **Sort collation is CODE POINT, not locale** — every upper-case surname sorts before every
  lower-case one. `localeCompare` is wrong.
- **Search is submit-driven** — typing alone does nothing.
- **Gigya pre-renders ~5 hidden copies of the login fields.** Select the visible one. The same
  trap applies to the **Password tab**, which the SPRF work will hit.

### 3.4 Editing the big JSON files

**Do not rewrite them with `JSON.stringify`** — it reformats the whole file (a 1,336-line deletion
diff on `C1Selectors.json`, 4,594 on the TC repository). Insert as **text**, preserving **CRLF**
and indentation, for additions-only diffs. Verify with `git diff --numstat`.

### 3.5 Mechanical wiring check

```bash
node tooling/tcMap.js --findings
```

It exits 1 on **pre-existing** problems (13 unregistered eBook TCs, 47 orphans) that are not
yours. What matters is that **no SLST/SPRF/SBLK id appears** in any failure category.

---

## 4. Fixtures on FCN-CHZ-PDA (verified 2026-08-28)

| Purpose | Student |
|---|---|
| Adult with email | `Marvin Jae student` · nonmqastudent5@mailsac.com |
| Adult, email with special characters | `Learner Learner` · shivampilot04+Taylor&%^$wift@gmail.com |
| Adult with umbrellas incl. **Code expired** | `Learner us` · testps27@mailsac.com |
| Child with username, 2 umbrellas, 2 classes | `child1 test` · cqatestaichild1 |
| Last-name search fixture | `niharika budhiraja` · learner34@mailsac.com |
| **Profile that returns HTTP 500** (defect fixture) | `Vandna Garg` · vandna.garg+11student@comprotechnologies.com |

**No adult-with-username account exists on this school** — this is what blocks `TST_SPRF_TC_3`.

---

## 5. What to do next — recommended order

### (a) SPRF read-only block — biggest win, lowest risk

Create `pages/ExperienceApp/studentProfile.page.js` and automate the side-effect-free cases:
**`TST_SPRF_TC_1, 2, 4, 5, 6, 7, 9, 11, 15, 16, 17, 21`**.

Reach a profile via `schoolStudents.click_rowActionMenu(<identifier>)` — it already resolves the
row by content and returns the per-row menu selectors.

⚠️ Crossing into the profile is a **full page load into a different microfrontend** (`class`),
not an Angular route change. Budget for it and **measure** it.

**Resolve these three `[ASSUMED]` results from a real run while you are there:**
`TST_SPRF_TC_3`, `TST_SPRF_TC_12`, `TST_SPRF_TC_22`.

### (b) `TST_SLST_TC_25` — closes out SLST

Needs the `schoolAdminAutomation` login entry (§2) and the SBLK add-student flow, since its
step 2 *is* that flow. Assert the new student is **findable by search** rather than that the
count went up by exactly one — the shared-school count moves under you.

### (c) SBLK — leave until last

Needs **7 CSV fixtures that do not exist**. `manual-test-standard.md` requires the *exact*
downloaded template headers, so **download `Get CSV template` on each bulk screen first** —
writing them from memory is a guess:

```
TST_SBLK_TC_1_children.csv        TST_SBLK_TC_2_adults_username.csv
TST_SBLK_TC_3_adults_email.csv    TST_SBLK_TC_4_existing_username.csv
TST_SBLK_TC_5_existing_email.csv  TST_SBLK_TC_11_bulk_activation.csv
TST_SBLK_TC_12_malformed.csv
```

The child/adult CSV pages are already documented from the NEMO-24306 work in
`product-knowledge/ExperienceApp.md` — reuse it. Resolve `TST_SBLK_TC_6/8/11`'s `[ASSUMED]`
results from a real run.

⚠️ `TST_SBLK_TC_3` and `TST_SBLK_TC_5` **send real email** — mailsac/yopmail addresses only.
⚠️ The adult new-account chooser and the existing-student chooser **share element ids**
(`adultCreateInvite-1..4`) — identify the screen by URL or heading, never by control id alone.

### (d) Phase 3 — visual assessment

Initial read is **"no candidates"** (every SLST case reads dynamic shared-school data), but
Phase 3 must **confirm** that per AGENTS.md §8, not inherit it.

---

## 6. Blocked, and exactly what unblocks each

| Case | Blocked on | Unblock |
|---|---|---|
| `TST_SLST_TC_14` | A **16-char activation code already redeemed** by a known student, plus that student's identity. The environment that issues codes is **down**. | One redeemed code + its student. **The user will supply this.** |
| `TST_SPRF_TC_3` | No adult-with-username account on this school | Run `TST_SBLK_TC_2` to create one, or use another school |
| `TST_SPRF_TC_20` | The 50-student removal cap needs **51+** students; this school holds 27 | A larger school. The modal copy is **already verified verbatim**, so this is short work once unblocked |

> **Correction to the 2026-08-22 handoff:** it claimed "one larger school with mixed activation
> states unblocks all three." **That is wrong and is withdrawn** — it rested on a misreading of
> the activation checkbox (see `admin-students-tab.md` §7.5). These are three *independent*
> blockers, and no `<SCHOOL_WITH_MIXED_ACTIVATION>` fixture is needed by anything.

---

## 7. Product defects — do NOT "fix" these in automation

| Case | Defect | Status |
|---|---|---|
| ~~`TST_SLST_TC_12`~~ | No-results search rendered nothing + a `TypeError` from the admin bundle | ✅ **FIXED in the product**, verified 2026-08-28. The case now asserts the fixed behaviour. `students-no-results.png` is historic evidence only. |
| `TST_SPRF_TC_7` | `View student profile` for **Vandna Garg** hangs on an infinite spinner; `getUserDetailWithClasses` returns **HTTP 500**. Two faults: the 500, and no client-side error handling. | **Still open** (not re-checked since 2026-08-22) |
| `TST_SBLK_TC_9` | Bulk-activation success dialog renders three raw i18n keys (`…SUCCESS_MODAL_INFO_1/2/3`) | **Still open** |
| `TST_SBLK_TC_10` | Bulk-activation row checkbox's sr-only label is the raw key `…SELECT_STUDENT` | **Still open** |

When automation fails on these, **that is the test working.** Do not add a workaround and do not
soften the expected result.

---

## 8. Open decisions for the user — still unanswered

1. **Scenario #15 / `TST_SPRF_TC_18`** — the umbrella name on a profile is a plain
   `<span class="bundle-title">` with **no link or button anywhere in its ancestry**, confirmed on
   both a child and an adult profile. There is no route from the profile to an umbrella details
   page. **Is the link missing (defect), or does the scenario describe a route that does not exist
   (scenario error)?** Cannot be automated until answered.
2. **The three open defects in §7 were not in Jira as of 2026-08-22.** Who raises them?
3. **Push convention** — commit `66831f6` sits on local `main`; the push was blocked by a
   permission classifier and may still be **unpushed**. Check with:
   `git rev-list --left-right --count origin/main...HEAD`.
   Recent history is all PR merges, so direct-to-`main` departs from convention. Confirm whether
   this should go via a PR instead.

---

## 9. Known gaps worth fixing when convenient

1. **`leftNavStudents` in `C1Selectors.json` is ambiguous** — `a:has-text("Students")` also
   matches the hidden help link `a[qid='cHeader-hlp-6']` ("Adding students to a class") and
   resolves to it first, failing the click with *element is not visible*. `schoolStudents` uses
   `a[qid='aDetail-2']`; **the Classes suite still carries the ambiguous form.** Separate fix.
2. **The CustomerGauge NPS survey is not handled in the suite.** `<cg-survey id="cg-survey-popup">`
   can overlay the dashboard and intercept the school-card click. It was removed in the recon
   script but never appeared during a framework run, so `TST_SADB_TC_1` has no defence. It will
   bite eventually.
3. **`getData_studentRows()` is expensive** — ~80 sequential logged action calls to read 20 rows,
   dominating the runtime of every TC that reads rows. A bulk `evaluate`-based read would need a
   new `baseActionLibrary` method — that file is **protected**, so confirm with the user first.
4. **Thor latency varies a lot.** The same suite ran 1 m, 2 m and 5 m on identical code, and one
   TC swung 659 ms → 30,695 ms → 659 ms. Judge a slow TC against a second run before assuming a
   code defect.

---

## 10. ⚠️ Working-directory warning

The last session was told to work in the worktree
`.claude/worktrees/admin-classes-automation-4711b5` (branch
`claude/admin-app-students-automation-da995e`) but **actually edited the main checkout**
`testAutomation_v1.0` on branch `main` — absolute paths were passed to Bash while `cd` kept
resetting to the worktree, and the mismatch went unnoticed until commit time. The worktree is
clean and empty of this work; everything is on `main`.

**Run `git branch --show-current` and `git status` in the directory you are actually editing
before you start.**

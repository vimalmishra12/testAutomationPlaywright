# Walkthrough — learningPath (playwright-automation-c1 → C1 migration, LP setup)

## Session 1 — 2026-09-22

## Summary
Started migrating SOURCE `lp-scenarios.xlsx` TC-LP-001…006. User chose to first build SOURCE's
"fresh users every run" setup chain. Built the run-generated-data mechanism (ADR-022) and
setup Steps 3–5 (teacher signup + verify, join school, create class). Thor is blocked by an
expired certificate on the verify-link host, so by user decision (cleared with the product team)
the suite runs on **production**: 20/20 passing. Learner, invite/accept and the LP TCs are next.

## Changes Made

### 1. core/utils/runContext.js
- **Type:** Created · **Layer:** Core (utility, not protected)
- **What changed:** `resolve/get/set/getLast` — `{{run.<key>}}` values generated once per run from
  `runValues.json` patterns (`{rand4}`, `{ts}`), `{{last.<key>}}` from `runtime/lastRun.json`;
  persisted after every new value; unknown key throws.
- **Why:** the runner loads all test data before any TC runs, so mid-run values could not reach later TCs (ADR-022).

### 2. core/runner/testrunner.js — PROTECTED (confirmed by user)
- **Type:** Modified · **Layer:** Core
- **What changed:** require of runContext by absolute path from `rootDir` (top of file — the file is
  copied into `test/tempRunner/`, so `../utils/` broke on the first run); in `identifyTest()`,
  `testdata = runContext.resolve(testdata)` just before the TC call (covers Test nodes and hooks).
- **Why:** ADR-022 Option 1 (user). Regression: `landingFeatureTest_thor` 4/4, `loginFeatureTest_thor` 8/8.

### 3. .gitignore
- Added `testResources/testcaseData/*/*/runtime/` (lastRun.json is per machine).

### 4. testResources/testcaseRepository/ExperienceApp/C1TCRepository.json
- Deleted the orphaned `SignUp` module (31 `TST_SNUP_TC_1..58`, `signUp.test.js` never existed) — Q1 decision.
- Added module `SNUP` (`signup.test.js`, TC_59–62), module `TSET` (`teacherAccountSetup.test.js`,
  TC_1–4), `DASH_TC_12`, `ENTE_TC_24/25/26` — all `visualTest: false`.

### 5. tooling/tc-map.md — regenerated (`node tooling/tcMap.js`).

### 6. testResources/selectors/ExperienceApp/C1Selectors.json (additions + 2 value fixes)
- `signUp`: 17 keys (role radios, Next, confirm dialog, Gigya fields, `termsCheckbox`
  = `input.termsCheckbox:visible` — ids differ thor/prod, pending-screen e-mail).
- `dashboard`: `introTourDialog` (`.introjs-tooltip`), `introTourSkipBtn`, `teacherCompleteAccountBtn`.
- `teacherAccountSetup` (new section): wizard qids, key input, Join, server-error alert, Go to dashboard, tutorial, school title.
- `createNewClass`: `materialResultItem`, `selectedMaterialName/Radio`, `collaborativeInfoDialog/Title/CloseLink`, `classTitleLink`, `classKey`.
- `mailsacUI`: `emailHtmlFrame`, `verifyLink`.
- Fixes during runs: `introTourOverlay` → `introTourDialog` (overlay not always rendered); terms id → class selector.

### 7. pages/ExperienceApp/signup.page.js
- Filled the stub: `select_role`, `click_confirmRole` (reports profileForm / ageGate), `set_profileForm`
  (addValue, country autocomplete by exact option, terms), `click_signUpSubmit` (pending e-mail).

### 8. pages/ExperienceApp/mailsacUI.page.js
- Added `openVerificationLink(email, timeoutMs)`: bounded inbox poll for `/verif/i`, Unblock Content by
  href, link href read inside the mail iframe, loaded in the same tab, wait for the app host.

### 9. pages/ExperienceApp/dashboard.page.js
- Added `dismiss_introTour_getTeacherSetupPrompt()` (two-signal settle wait + 5 s late-tour wait) and
  `close_introTourIfShown()`.

### 10. pages/ExperienceApp/teacherAccountSetup.page.js — Created (module TSET)
- `isInitialized`, `click_completeAccount`, `select_joinSchoolPath`, `set_schoolKey_join`
  (**WORKAROUND** — up to 5 retries on "There was a problem on server", as SOURCE; user decision),
  `click_goToDashboard_getSchoolName`.

### 11. pages/ExperienceApp/createNewClass.page.js
- Added `select_materialByName` (exact-name pick; the old ENTE_TC_20/23 are positional),
  `close_collaborativeInfo`, `getData_createdClass` (by-name card, class key → `runContext.set("lpClassKey")`).

### 12. Tests: signup.test.js (new), teacherAccountSetup.test.js (new), dashboard.test.js (+DASH_TC_12), createNewClass.test.js (+ENTE_TC_24/25/26).

### 13. Test data / exec files (thor + production)
- `testcaseData/ExperienceApp/{thor,production}/runValues.json` + `learningPathData.json` (SOURCE's data as-is).
- `testExecutionFiles/ExperienceApp/{thor,production}/learningPath.json` — Suite1 signup, Suite2 login + join school, Suite3 login + create class. Prod file = thor file with data paths swapped.

### 14. package.json — PROTECTED (confirmed by user, twice)
- `learningPathTest_thor`, `learningPathTest_prod` (no visual scripts — all TCs `visualTest: false`).

### 15. Docs
- `decisions.md`: **ADR-022** (Accepted after the prod run).
- Knowledge (new): `ExperienceApp/c1-core-shared.md`, `onboarding.md`, `teacher-dashboard-class-page.md`; rows in `ExperienceApp.md` (+ Production URL) and `product-knowledge.md`.
- `authoring-status.md`: `learningPath` block.

## Runs (real output, summarised)
| Run | Env | Result | Cause / fix |
|---|---|---|---|
| 1 | thor | 2/4 | `SNUP_TC_61`: `ERR_CERT_DATE_INVALID` on `login.comprodls.com` (cert expired 2022-04-10) → Blocked; moved to prod |
| 2 | prod | 4/4 | — |
| 3 | prod | 5/9 | click on "Complete account set up" intercepted by a late IntroJS tour (`.introjs-tooltip`, ~1.8 s after the button) → 5 s late-tour wait |
| 4 | prod | 9/9 | — |
| 5 | prod | 17/19 | Finish intercepted by `#addMaterialInfoModal` ("This material is collaborative") → `ENTE_TC_26` |
| 6 | prod | 20/20 | teacher `cqaprodlpteach_iv4y`, `Class qvn0`, key `NzV2-Abmg` |
| 7 | prod | 25/25 | Step 6 added (Suite 4 learner signup) — first try. teacher `_7717`, `Class 0zr0` (`zxKH-6t7H`), learner `cqaprodlplearn_onwg`. 2nd consecutive clean run of Suites 1–3 → Phase 2 ✅ |

| 8 | prod | 39/42 | Step 7 added (Suites 5–6). `INVI_TC_4` Accept disabled: "Select all" (`INVI_TC_3`) clicked before the invitation list loaded → new `INVI_TC_13` (tick by class name) |
| 9 | prod | 38/42 | Full run the user interrupted — the process **kept running to the end** (tool rejection does not kill it): new users `_co21` / `Class 20ec` / `_ajq1`. `INVI_TC_13` found the row but the tick was wiped by the app's route to `/dashboard/invitation/main` → wait for that route first |
| 10 | prod | **8/8** | **Debug run, Suite 6 only**, `learningPathDebug.json` + `--runData=last` (new ADR-022 mode) on `_ajq1` / `Class 20ec` — no new users |

| 11 | prod | 3/6 | Suite 7 debug (LP-001/005/006) on `_ajq1`: LP-001 ✅; TOC close selector from SOURCE does not exist |
| 12 | prod | 3/6 | close = `#unitViewCrossBtn`, but TOC is NOT open on a 2nd entry and the lesson view uses `#lessonViewCrossBtn` → one aria-label selector + housekeeping `PEXT_TC_100`; LP-001 asserts the iframe only |
| 13 | prod | **6/6** | Suite 7 debug |
| 14 | prod | **11/11** | Suite 7 debug incl. scorable `PEXT_TC_4–8` — **first and only attempt** on `_ajq1`, "You scored 4 out of 4" |
| 15 | prod | **53/53** | **Full suite 1–7**, brand-new set: teacher `_w1b7`, `Class vyi9` (`N348-p6W8`), learner `_jqh2` (TOC self-opened on its first entry, as expected) |

### Step 8 additions (Learning Path)
- **`core/actionLibrary/baseActionLibrary.js` — PROTECTED, confirmed by user:** added `getNthNestedFilteredLocator(outer, n, inner, text)` and `clickAtCenter(selector)` (no-scroll centre click for the rich dropdown).
- `practiceExtra.page.js`: `isInitialized_player`, `getData_player`, `ensure_tocClosed`, `click_openToc`, `click_closeToc`, `answer_frame`, `click_next`, `getData_score` (legacy `isInitialized` untouched — DASH_TC_4 uses it).
- `dashboard.page.js`: `click_classComponent` (tile inside the named class card).
- Selectors `practiceExtra.*` (player, TOC, frames with `{N}` template, Check/Next/score); `tocCloseBtn` = aria-label "Close table of contents".
- `practiceExtra.test.js` (new): `PEXT_TC_1–8`, `PEXT_TC_100`; `dashboard.test.js` `DASH_TC_14`; registry module `PEXT` + `DASH_TC_14`.
- Data `pextScorable` (answers per frame, expected score); exec Suite 7; `learningPathDebug.json` now holds Suite 7.
- **Manual register** `test/Manual/C1App/LearningPath/` (`_tcdata.js`, `_tcdata_setup.js`, `_generate.js` → `.md` + `.xlsx`): sheet "Test Cases" 9 LP TCs, sheet "LP Setup (by module)" 40 setup TCs (new + reused), all Pass from run 15. LP-004 recorded as not covered (user decision).
- Knowledge: new `learning-path-player.md`; index rows; `c1-core-shared.md` data registry.
- Phase 3 visual **deferred** by the user.

### Step 7 additions
- `createNewClass.page.js` `getData_pendingInvite`; `invitationNotification.page.js`
  `wait_forInvitationNotification` (housekeeping) + `select_invitationByClass`; `dashboard.page.js`
  `getData_learnerClassAccess`.
- Selectors: `createNewClass.pendingStudentsContainer`, `invitationNotification.invitedClassCheckbox`
  (`{CLASS_NAME}` template), `dashboard.learnerClassCard/componentTile/activationCodeInput`.
- TCs: `CREA_TC_30`, `INVI_TC_13`, `INVI_TC_101`, `DASH_TC_13` (registry, `visualTest: false`).
- Data: `learnerLogin`, `invite`, `learnerAccess`; exec Suites 5–6; `production/learningPathDebug.json`.
- `core/utils/runContext.js`: `--runData=last` mode + merge-on-save in that mode (ADR-022 amendment).

### Step 6 additions (after the doc checkpoint, same day)
- `signup.page.js` `set_learnerAgeGate` (country autocomplete + age select + Next; form proven by the age dropdown hiding, not the first-name box).
- `dashboard.page.js` `getData_learnerWelcome` (Continue `[qid='l-wl-btn-1']` + tour close); selector `dashboard.learnerWelcomeContinueBtn`.
- `signup.test.js` `TST_SNUP_TC_63/64`; registry entries (`visualTest: false`).
- Data (thor + prod): `signup.learnerRole/learnerAgeGate/learnerForm`, `mailsac.learnerVerify`; exec Suite 4 (reuses `LAND_TC_2`, `SNUP_TC_59/60/61`).

## Applicable-traps table (Phase 1 step 0b)
| Trap | Applies? | Where handled |
|---|---|---|
| Positional ids (Invariant 2) | yes — `material-modal-component-0`, `div.check` | `ENTE_TC_24` exact-name match |
| Late / overlay UI swallowing clicks | yes — IntroJS, collaborative dialog | 5 s late-tour wait; `ENTE_TC_26` |
| Pre-rendered UI (Invariant 15) | checked — dialogs asserted with `isDisplayed` / hidden waits | all new methods |
| Gigya / React typing (Invariant 6) | yes | `addValue` in `set_profileForm`, `set_schoolKey_join` |
| Shared inbox, stale mails | yes | text match `/verif/i`, per-address inbox |
| Retry inside the path under test (Invariant 14) | yes — school Join | marked WORKAROUND, retries returned + logged (user decision) |

## Architecture Decisions Triggered
- **ADR-022** added (run-generated data via tokens). Production use of this suite = user decision (migration rules updated on the Desktop).

## Protected Files Touched
- `core/runner/testrunner.js` — confirmed by user.
- `package.json` — confirmed by user (thor + prod scripts).
- `core/actionLibrary/baseActionLibrary.js` — confirmed by user (Step 8: `clickAtCenter`, `getNthNestedFilteredLocator`).

## Pending / Follow-up
- ~~Phase 2 second clean run~~ done (53/53). Phase 3 visual **deferred** by the user.
- ~~Steps 6–8~~ done. Next batch candidates: LP-007…012 (automated in SOURCE; LP-010/011 = Practice Set, one attempt per learner; LP-012 needs parent/child — parked in the master plan).
- Raise the expired thor certificate with devops. Leftover thor account `cqathorlpteach_srk8` (unverified).
- ~~Manual register: record the `TSET_TC_3` WORKAROUND~~ — written into the setup sheet's Remarks.
- Later: move the setup sheet's cases into application-wise registers (user decision).
- Nothing committed (migration rule: no commits unless asked).

---

## Session 2 — 2026-09-22 (evening) — INVI_TC_13 flake after merge

## Summary
After PR #64 was merged, the user's full run on `main` (users `_gq8v` / `Class r5f8` / `_urgi`) went
51/53: `INVI_TC_13` found the invitation row but the tick was lost, `INVI_TC_4` Accept timed out; the
user accepted by hand. Root cause from the earlier failing trace: the invitation page SOMETIMES reloads
itself to `/dashboard/invitation/main?back=true` ~450 ms after the notification click — after our tick.

## Changes Made
### 1. pages/ExperienceApp/invitationNotification.page.js
- **Type:** Modified · **Layer:** Page Object
- **What changed:** new module helper `waitForStableDocument(settleMs, timeoutMs)` (+ `DOC_SETTLE_MS = 1500`,
  3x the measured 450 ms); `select_invitationByClass` now waits for the document to survive 1.5 s
  without being replaced (a `window` marker a reload erases; `browser.execute`, sanctioned helper)
  before waiting for the row and ticking. The tick itself is not retried.
- **Why:** the URL wait alone was satisfied before the `?back=true` reload.
### 2. .architecture/product-knowledge/ExperienceApp/teacher-dashboard-class-page.md
- A2 + Part B: the intermittent `?back=true` self-reload and the settle fix.

## Verification
- Tick-only debug suite (Suite 6 without Accept) on the still-pending invite of learner `_o43d`
  (`Class jd67`), `--runData=last`: 3/3 before the fix, 3/3 + 4/4 after — the reload did not occur in
  these runs (intermittent).
- **Synthetic reproduction** (scratchpad, headless, page routed to a stub that reloads itself to
  `?back=true` after 450 ms), real page object: OLD code → 1 s later tick gone + Accept disabled
  (= the user's failure); NEW code → reload detected once, tick kept, Accept enabled; without a reload
  the new code passes with +1.5 s.
- Worktree `lastRun.json` and `learningPathDebug.json` restored after debugging.

## Protected Files Touched
None — no protected files were modified.

## Pending / Follow-up
- Commit on a new branch from `main` + PR (asked the user). Next full run confirms live.

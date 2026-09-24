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

---

## Session 3 — 2026-09-23 — Batch 2, part A + C (learner player + dashboard)

## Summary
Automated LP-007…011, 014, 015, 018, 019, 026, 027 (new Suite 8) and LP-020 (Suite 6), on branch `ashu_local`.
Grounded everything live first with a read-only probe (learner `_uyu7`), then: Suite 8 debug 21/21, full run
74/75. The failure is `TST_DASH_TC_15` (automation design — see Pending).

## Grounding (probe scripts in the session scratchpad, read-only except Flashcards paging + one PS submit by the debug run)
- TOC = Unit → Lesson → 5 activities (incl. "Non-scorable HTML activity" and "test pdf" — LP-021/022 were wrongly Blocked).
- Open control opens the LESSON view; it is a toggle (keyboard Enter while open closes it). The mouse cannot reach it while open.
- Two "Go to unit view" links; the header one is covered — use `#lessonViewBackBtn`.
- `#lessonViewCrossBtn` closes the TOC only; `a.back-btn` leaves to `/dashboard/learner/dashboard`.
- Flashcards: 6 `li.step`; a Next within ≤1.8 s of a card change is ignored, ≥2.0 s always accepted (16 trials) → 2.5 s settle.
  The deck remembers its position → rewind with Previous before paging.
- PS is on the OUTER page (no iframe). Empty → Submit `class="btn disabled"`. The pre-rendered `#exampleModal`
  showed the "class hasn't started" variant; the real Submit opened "Ready to submit?". A DOM `offsetParent`
  check reported the fixed-position modal as hidden — misleading; the screenshot showed it.
- Launch: `div.loader` spinner ~0.2–1.1 s; no progress bar; no expiry text.

## Applicable-traps table
| Trap | Applies? | Where handled |
|---|---|---|
| TOC persists in DOM when closed | yes | every TOC check is `isDisplayed`/`waitForDisplayed` |
| CSS-only disabled button (Submit) | yes | TC_16 reads the class + asserts no dialog; click attempted with a 3 s timeout |
| Pre-rendered modal (`#exampleModal`, 2 variants) | yes | assert the `#readyToSubmitLabel` title, not the modal |
| Invented timeouts | yes | loader 60 s bound (measured ~1 s); deck settle 2.5 s measured; dialog ≤5 s (measured ~1 s) |
| Covered element (open control while TOC open) | yes | LP-019 uses keyboard focus + Enter |
| One PS submission per learner | yes | TC_16 before TC_13; debug learner consumed once, full run fresh |
| Positional selectors | no | activities/units/lessons addressed by name |

## Changes Made
### 1. testResources/selectors/ExperienceApp/C1Selectors.json
- `practiceExtra`: +activityTitleBtn, backBtn, tocUnitViewCloseBtn, tocLessonViewCloseBtn, tocGoToUnitViewBtn,
  tocUnitItem, tocLessonToggle, tocActivity ({NAME}), tocAnyActivity, deckStep, deckStepCurrentAt ({K}),
  deckLastStepCurrent, activityCheckInner, prevBtn, psEditor, psWordCount, psSubmitBtn, psConfirmModal,
  psReadyToSubmitTitle, psConfirmSubmitBtn, psAttemptedAnswer.
- `dashboard`: +learningPathLoader, headerNotificationsBtn.
### 2. pages/ExperienceApp/practiceExtra.page.js
- New: activityRow, getData_tocActivities, ensure_tocUnitView, click_goToUnitView, click_tocUnit, toggle_tocLesson,
  keyboard_toggleToc, open_tocActivity, getData_deck, _deckCurrent, page_deckToEnd, getData_psScreen,
  click_psSubmitWhenEmpty, submit_ps, revisit_activity, click_closeLessonView, click_back.
### 3. pages/ExperienceApp/dashboard.page.js
- New: launch_classComponent_watchLoading (LP-027), getData_learnerWithoutClass (LP-020).
### 4. test/ExperienceApp/practiceExtra.test.js / dashboard.test.js
- `TST_PEXT_TC_101, 9, 25, 19, 10, 11, 12, 16, 13, 17, 18, 26`; `TST_DASH_TC_15, 16`.
### 5. C1TCRepository.json — the 14 TCs registered, all `visualTest: false`.
### 6. learningPathData.json — `pextToc`, `pextFlashcards`, `pextPS`, `learnerNoClass`.
### 7. learningPath.json — Suite 6 +DASH_TC_15; new Suite 8. `learningPathDebug.json` = Suite 8 (scratch; rewritten with LF).
### 8. Knowledge / register
- `learning-path-player.md` §A5–A8 + Part B batch-2 table; `authoring-status.md` block; register `_tcdata_batch2.js`
  (observed expected results, statuses, LP-021/022 unblocked, TST_PEXT_TC_26 appended), `_generate.js` (header, Fail count).

## Runs
- Suite 8 debug (`--runData=last`, learner `_uyu7`): 21/21, 58 s. Probe afterwards confirmed the PS really submitted.
- Full `npm run learningPathTest_prod`: 74/75, 298 s — teacher `_f5s1`, Class tje0, learner `_vcmw`.
  `TST_DASH_TC_15` failed: "The learner dashboard did not load" — the screenshot shows "Invitations (1)" (the
  learner is routed to the invitations page while an invite is pending). A "Temporary disruption to Cambridge
  One" banner was also on screen (environmental, not related).

## Architecture Decisions Triggered
None.

## Protected Files Touched
None.

## Pending / Follow-up
- `TST_UMBP_TC_5` in the LP register reuses a RETIRED id — rename before automating LP-033.

### Session 3 (cont.) — DASH_TC_15 fix, user-confirmed
- `invitationNotification.page.js`: + `getData_invitationsLanding(className)` — read-only; waits for the
  `/dashboard/invitation/` route and this run's class row (`invitedClassCheckbox`).
- `dashboard.page.js`: `getData_learnerWithoutClass(className, componentName)` now uses that landing as its
  readiness signal (was: `/dashboard/learner/` URL + bell), then checks no class card / no component tile.
- `dashboard.test.js` `TST_DASH_TC_15`: asserts onInvitations + classListed + no card + no Practice Extra.
- `learningPathData.json` `learnerNoClass` + `className`; `C1Selectors.json` dropped the now-unused
  `dashboard.headerNotificationsBtn`.
- Full run 2: **75/75**, 301 s (teacher `_e9mo`, Class lm76, learner `_iyit`); DASH_TC_15 screenshot shows
  "Invitations (1)" with Class lm76. Register regenerated (.md + .xlsx): 22 Pass · 9 Not Run · 4 Blocked.
- Remaining: nothing committed (branch `ashu_local`); `TST_UMBP_TC_5` retired-ID rename before LP-033.

---

## Session 4 — 2026-09-23 — Batch 2, parts B + D + E + LP-021/022

## Summary
User decisions: MSAC/TLIB codes OK; LP-033 → `TST_UMBP_TC_11` with admin `prod_admin_mqa@yopmail.com` (prod); teacher
paths launch-only; for live/register differences that look like bugs, stop and ask. Asked: can LP-013/025 share the
one learner? Probed on a fresh learner (setup-only run of Suites 1–6: teacher `_r5b7`, Class yzsk, learner `_5an7`)
→ YES. Committed batch A+C first (`afd6a74`).

## Grounding (read-only probes; scratchpad)
- Teacher Materials / Create assignment / Manage student access / My library, and admin Library → all launch the LP
  (knowledge §A10). Scorable single-learner sequence, HTML "viewed" + unit counter, PDF download page (§A9).
- Questions answered by the user: PDF "viewed" on landing = expected; LP-025 "Saved" = wording ("in progress");
  LP-033 "All course materials" dropped.

## Changes Made
- Selectors: practiceExtra (+frameCheckedCorrect, tocUnitProgress, tocActivityStatus, nextActivityBtn, download*),
  c1assignment (+assignComponentByName, assignTocUnitName, assignTocSidebar, assignCancelBtn, assignNextBtn),
  umbrellaProduct (+componentLink), NEW blocks manageStudentAccess, teacherLibrary.
- Page objects: practiceExtra (+getData_frameCheckState, getData_activityStatus, leave_and_relaunch, getData_unitProgress,
  open_activityAndWaitStatus, open_nextActivityDownload, ensure_tocLessonView, getData_teacherPlayer);
  c1assignment (+launch_componentInCreateAssignment); umbrellaProduct (+launch_componentByName); NEW
  manageStudentAccess.page.js, teacherLibrary.page.js.
- Tests: PEXT_TC_15, 24, 20, 21, 102; CMAT_TC_7; C1AS_TC_26; UMBP_TC_11; NEW manageStudentAccess.test.js (MSAC_TC_1),
  teacherLibrary.test.js (TLIB_TC_1). TC repo: 10 TCs, 2 new modules (MSAC, TLIB), all `visualTest: false`.
- Data: pextScorable.emptyCheck/relaunch, pextHtml, pextPdf, teacherLp, adminLogin, adminLibrary.
- Exec: Suite 7/8 steps; Suites 9–13 (reuse DASH_TC_11/12, CMAT_TC_1, MRPT_TC_201, LIBR_TC_101).

## Runs
- Debug 8–13 (`--runData=last`): 34/38 → fixes (user-approved): TC_102 housekeeping (TOC remembers last view);
  MSAC select-all → visible checkbox wrapper (label is sr-only, width 0); getData_teacherPlayer opens the TOC when
  closed (first-entry-only auto open). Then UMBP_TC_11 flaky (2/4, 1/4): traced — the Nuxt materials view is
  server-rendered, clicks while readyState "loading" are ignored (measured 2/8) → wait for document load → 5/5.
- Full run 3: **95/96** (teacher `_2yzn`, Class hfzb, learner `_6c7t`). `TC_24` failed: first entry → TOC reopens on the
  unit view, activity row not present. Evidence audit clean for all new TCs.

## Protected Files Touched
None.

## Pending / Follow-up
- Commit batch B/D/E after the fix (user asked to commit A+C first; ask again).

### Session 4 (cont.) — TC_24 fix, user-confirmed
- User clarified "Saved" applies to scorable activities only (Flashcards keeps no intermediate state) — the test
  already checks the scorable; Flashcards is only the navigate-away target. Kept.
- `practiceExtra.page.js` `leave_and_relaunch(…, unitName)`: `ensure_tocLessonView(unit)` before each TOC activity
  click (was: open the TOC if closed — on a first entry that reopens the UNIT view). Test passes `testdata.unit`;
  data `pextScorable.relaunch.unit = "Unit 1"`.
- Full run 4: **96/96**, 379 s (teacher `_osgr`, Class qzwn, learner `_xov9`); TC_24 screenshot = reopened frame 1,
  answer kept + correct, Next offered. Register regenerated: 31 Pass · 0 Not Run · 4 Blocked.
- User confirmed 2026-09-23: a teacher preview does not create learner progress — recorded in CMAT_TC_7 Remarks and learning-path-player.md §A10.

---

## Session 5 — 2026-09-23 — LP-030, and the collaborative / group cases (on hold)

## Summary
Read-only grounding of Projects (NLP, `/nlp/teacher/…/product/cqaautomationpr1`: Unit 1 > Lesson 1 > scorable,
Flashcards, PS, Collaborative Task, Group PS). Automated `TST_C1AS_TC_27` (LP-030) — Projects launches from Create
assignment exactly like Practice Extra. Planned LP-023/024; user answered (groups: Class data → Students/Groups toggle →
Create groups; learner B only for these; mark 90 "Well Done"; NLPP/CGRP/MRKQ) and then put TC_22/23 ON HOLD.

## Changes Made
- `c1assignment.test.js`: `TST_C1AS_TC_27` (delegates to TC_26 with the component from data).
- `learningPathData.json`: `teacherNlp`; learner B keys `signup.learnerFormB`, `mailsac.learnerVerifyB`, `learnerLoginB`,
  `inviteB` (file re-serialised by JSON.stringify — formatting change only).
- `runValues.json`: `lpLearner2Email` (generated only when a learner-B suite runs).
- `learningPath.json`: Suite 14 (C1AS_TC_27). NEW parked `learningPathGroups.json` (Suites 15–17, learner B) — kept out
  of the full run per the user's hold; the runner treats every top-level key as a suite, so no `_comment` key there.
- TC repo: `TST_C1AS_TC_27`. Register: C1AS_TC_27 Pass (debug), TC_22/23 Not Run + ON HOLD comment.

## Findings
- The "Content locked … null at null" dialog on the NLP view is pre-rendered and hidden — NOT a defect (an early
  check counted hidden `[role=dialog]`).
- No group-management control on a ONE-student class (dashboard, class data, Actions, student menu, Assignments,
  Materials, NLP view). User screenshot shows it on Class data (Students/Groups toggle).

## Runs
- Suite 14 debug: 3/3. Setup Suites 1–6 + 15–17: 65/65 (teacher `_f6up`, Class f98w, learners `_mgka`, B `_kwtm`).

## Protected Files Touched
None.

## Pending / Follow-up
- TC_22/23 on hold — resume with Step 1 grounding (Groups toggle on the 2-student class Class f98w) when confirmed.
- `TST_C1AS_TC_27` needs a full run. Register `.xlsx` regeneration pending (file open in Excel).

---

## Session 6 — 2026-09-23/24 — LP-034 progress views; full runs blocked by the production disruption

## Summary
Added LP-034 (user request): learner "My progress" + per-activity progress, teacher Class data + per-activity view
(module PROG, `TST_PROG_TC_1…4`; learner steps at the end of Suite 8, teacher Suite 15). Debug 5/7 → selector fix
(user OK) → 7/7. Two full runs then failed in class creation (Suite 3) during the production disruption; debugged.

## Changes Made
- `progress.page.js` (PROG methods), `dashboard.page.js` (`click_classMyProgress`), NEW `test/ExperienceApp/progress.test.js`,
  selectors `progress.*` + `dashboard.learnerMyProgressBtn`, TC repo module PROG, data `C1.progressAfterRun`,
  exec Suite 8 (+PROG_TC_1/2) and Suite 15; parked learner-B file renumbered to Suites 16–18.
- Fix (user OK): `aggBundleCard` → `p.bundle-title span:text-is(…)`; `teacherStudentBundleCard` → the learner's
  `a[qid^=bundle-detail-title-]` (the card does not carry the name).
- Fix 1 (user OK): `createNewClass.click_addMaterial_btn` waits 90 s for the materials dialog and fails there.
- Knowledge: learning-path-player.md §A11; teacher-dashboard-class-page.md (Add materials timing); c1-core-shared.md
  §A2b (NPS survey). Register: LP-034 + 4 PROG rows (result pending a full run).

## Runs / debugging
- Full run 5: class "Class jnfx" created WITHOUT its product (every class step green) → 23 knock-on failures; stopped.
- Full run 6: ENTE_TC_22 took 30.1 s, search failed → stopped. NOTE: TaskStop ended only the bash wrapper — the npm /
  run.js / Chrome tree kept running until killed with `taskkill /T` (check `node.exe … run.js` after any stop).
- Probes: the materials dialog waits for `/dashboard/api/teacher-materials` (~8.5–9 s now, up to ~20 s; the product IS
  found once it opens). NPS survey `cg-survey-popup` seen once in a persistent probe profile — user: 3rd login in the
  same browser, cached 30 days → never met by the framework (fresh context per suite); no handler built (fix 2 dropped).

## Production data created (no cleanup, as for every run)
teacher `_508s` + Class jnfx (no product) + learner `_hi2q`; teacher `_uw9l` + Class 79es (no product) + learner `_l4ir`.

## Protected Files Touched
None.

## Pending / Follow-up
- Full run to confirm PROG_TC_1…4 and C1AS_TC_27 once production recovers (user decision).
- Nothing committed since 3fbb203.

### Session 6 (cont.) — 2026-09-24 — full run 7 and the progress-summary lag
- Committed `f77e70b` first (user). Full run 7: **103/105** (teacher `_4n9d`, Class u62l, learner `_yqma`) — class creation
  passed again (Add materials 4 s). `PROG_TC_1` read 1/10 · 1/1, `PROG_TC_3` read 10% · 1 /1; a probe ~2 min after the run
  read 3/10 · 1/3 → the summary totals lag (batch job, user-confirmed EXPECTED). Per-activity rows are immediate.
- Fix (user OK): `progress.page.js` `_pollUntilSettled` + `getData_aggregatedProgressSettled` /
  `getData_teacherClassProgressSettled` (reload every 20 s, ≤ 10 min, return last read); TC_1/TC_3 use them; data
  `settleTimeoutMs` / `reloadEveryMs`; learner PROG moved from Suite 8 to a new LAST Suite 16; step timeout 720 s;
  parked learner-B suites → 17–19. Debug 7/7 (settled data). Full run NOT run — user decision.
- User: the NPS survey appears ~10 s after login (added to c1-core-shared.md §A2b).

---

## Session 7 — 2026-09-24 — LP-035: teacher marks the PS; post-marking progress (from SOURCE)

## Summary
Reviewed SOURCE (github ComproSQA/playwright-automation-c1 @293e295, shallow clone in the scratchpad — the recorded local
path no longer exists): `ClassDashboardPage` marking + learner/teacher analytics. Plan agreed (user: mark once on run 7's
data; SOURCE's 70; Projects later; PROG_TC_2 back to Suite 8). Grounded read-only, then ONE real mark, then learner and
teacher views after it. Built MRKQ + PROG_TC_5…7; debug 9/9 on the marked state. No full run (user decision).

## Grounding (probes k1–k4)
- Marking queue / screen / confirm copy, pre-filled score 70 (= SOURCE's 70), Marked-tab lag → learning-path-player.md §A12.
- Learner after the mark: "New feedback" notification → player shows 70 + "Good"; PS row 70%/70%/1 immediately; summary 4/10 ·
  2/4 · 85% after ~3.5 min. Teacher: class 40% · 2 /4 · 85%; student 4/10; "Show progress details" (hidden checkbox → label).

## Changes Made
- Selectors: NEW `markingQueue` block; `progress` + notification / feedback / details keys.
- NEW `pages/ExperienceApp/markingQueue.page.js` (getData_classMarkingCount, open_submission, mark_submission);
  `progress.page.js` + getData_feedbackNotification, getData_teacherProgressDetails.
- NEW `test/ExperienceApp/markingQueue.test.js` (MRKQ_TC_1/2); `progress.test.js` + TC_5/6/7, TC_2 opens My progress itself.
- TC repo: module MRKQ; PROG_TC_5/6/7. Data: `C1.progressPending`, `C1.progressMarked`, `C1.marking` (replaces progressAfterRun).
- Exec: Suite 8 + PROG_TC_2; NEW Suite8b (teacher marks); Suite 15 = TC_3/TC_7/TC_4; Suite 16 = TC_1/TC_6/TC_5.
- Register: LP-035 + 5 rows (MRKQ Not Run — never executed by automation); PROG_TC_1/3/4 post-marking expectations.

## Production data changed
Run 7's learner `_yqma` PS marked 70 / "Good" by teacher `_4n9d` (Class u62l) — user-approved, run-owned.

## Protected Files Touched
None.

## Pending / Follow-up
- Full run (fresh learner) to execute MRKQ_TC_1/2 + the Suite 8 pending check — not run, user decision.
- Projects' own PS marking (SOURCE openMarking(1)) — deferred by the user. Nothing committed since f77e70b.

### Session 7 (cont.) — full runs 8 and 9
- Committed `eb54a77` (user). Full run 8: PROG_TC_2 (pending) green; MRKQ_TC_1 FAILED — the class "Marking" link read "0" on
  all 9 reads for 3 min after the submission; a probe saw "1 Marking" 6.6 min after it (≥ 4.3 min) → the queue lags like the
  summary. Stopped at Suite 12 (every later suite needs the mark); process tree killed. Data: teacher `_cjdu`, Class t8hh,
  learner `_68zv` (PS submitted, unmarked).
- Fix (user OK): `C1.marking.countTimeoutMs` 180000 → 720000; MRKQ_TC_1 step timeout 900000; Suite8b moved after Suite 14.
- Full run 9: **112/113** (610 s; teacher `_qzro`, Class e6tb, learner `_m10b`): MRKQ_TC_1 (2.5 s) / TC_2, PROG_TC_1…7 all green.
  Failure: TLIB_TC_1 — "My library did not open": screenshot shows the tab open with a loading spinner at 30 s (disruption).
  Fix proposed: wait ≤ 90 s for the library search box (as click_addMaterial_btn). Not applied yet.
- Fix applied (user OK): teacherLibrary.page.js isInitialized waits 90 s (was 30 s). Not verified by a run — user: do not run the full suite.

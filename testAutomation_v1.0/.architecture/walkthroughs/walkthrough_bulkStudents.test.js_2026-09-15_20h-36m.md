# Walkthrough — bulkStudents.test.js (Admin App · Students tab · module SBLK)

**Feature:** automate the remaining side-effect-free Students-tab cases (handoff
`HANDOFF_adminStudents_remaining_20260915.md`, Group A).
**Status:** in progress — Phase 1 build done, Phase 2 run/fix in progress, Phase 3 not started.
**Owner:** Vimal Mishra · **Worktree branch:** `claude/students-tab-automation-ae53ba`

This file is the SBLK walkthrough. Same-day entries for `TST_SLST_TC_28` and `TST_SPRF_TC_12`
are appended to `walkthrough_adminStudentsTab.test.js_2026-08-22_20h-50m.md` and
`walkthrough_studentProfile.test.js_2026-08-28_15h-38m.md` (user decision 2026-09-15).

---

## Session Log

### 2026-09-15

#### Summary
Re-ran the baseline, live-grounded every Group A screen on Thor / `FCN-CHZ-PDA`, and built
6 of the 9 Group A cases. Grounding moved three cases to Blocked, turned two into defect cases,
and found that student removal is gone from the Students tab entirely.

#### Baseline (before any change)
- `adminStudentProfileTest_thor`: **10/10 passing** (292 s).
- `adminStudentsTabTest_thor`: first attempt **0 run** — login page timed out (Gigya box not shown in
  30 s); the profile suite logged in with the same step minutes later. Re-run alone: **23/23 passing**
  (118 s). Classified transient, no change made.

#### Decisions taken with the user (in order)
| # | Question | Decision |
|---|---|---|
| 1 | Build Group A on FCN-CHZ-PDA? | Yes, all 9 |
| 2 | `SPRF_TC_12` target + safety net | Marvin Jae student, restore-and-fail net |
| 3 | `SLST_TC_26` — no special-character NAME exists (27 students checked) | **Blocked** |
| 4 | `SLST_TC_27` — only ONE username account exists | **Blocked** |
| 5 | `SBLK_TC_14` — adult create page is upload-only, needs a CSV | Approve the fixture now |
| 6 | "Create N account" enabled with an invalid row (seen twice) | **Defect** — assert requirement, keep out of exec file |
| 7 | `SLST_TC_28` — code search 504 → `/dashboard/error` (seen twice) | **Defect** — assert requirement, keep out of exec file |
| 8 | `SPRF_TC_22` — profile no longer offers removal | Re-point to the list… |
| 9 | …list has NO removal either | **Blocked** `SPRF_TC_19/20/21/22`, awaiting product |
| 10 | Where SBLK TC_6/7/8 run | New `adminBulkStudents.json` + npm script (confirmed exact line) |
| 11 | Records (register + authoring-status) | Update both with real run output |
| 12 | Clear the grounding leftover bulk-activation draft row | Yes (grid row only) |
| 13 | Walkthrough layout | New SBLK file + appends to the two existing files |

#### Reconnaissance findings (all promoted to `admin-students-tab.md` §9)
- Choosers `/learner/select/new` and `/learner/adult-select/new`: Next NATIVELY disabled with no
  selection; zero modals.
- Adult create form is UPLOAD-ONLY; stated username/password/200-record rules captured verbatim;
  11 pre-rendered modals, two rendering raw `ADMIN.LEARNER.CREATE_ADULT_FORM.*` keys.
- Bulk activation: typing a known email auto-fills names (~4 s) and enables Activate; row Remove
  selector matches TWO buttons; **the grid is a server-side draft per account**; row ids are not
  renumbered in-page (a reload renumbers).
- Student profile and Students list: **no removal path anywhere** — silently worked around by commit
  `c5ed7dc` (2026-09-09) without a product question; now recorded.
- Manage learner profile: empty First name → `This field is required`; Update blocked by CSS only
  (`pointer-events:none`, `tabindex=-1`, no `disabled` attribute).

#### Applicable-traps table (Phase 1 step 0b)
| Trap | Applies? | Where handled |
|---|---|---|
| Pre-rendered modals → presence is a false green | yes (11 on bulk + adult pages) | every check uses `isDisplayed` / `waitForDisplayed` |
| Positional / re-issued ids | yes — bulk row ids | `readRowNumbers()` reads ids; `clear_bulkGrid` reloads to renumber; page anchor uses `id^=` |
| Shared qid across pages | yes — `aBulkActions-7` (Activate AND Create) | bulk anchor is `activationCode-*`; each page object reads its own button |
| CSS-only disabled buttons | yes — profile Update | `getData_firstNameValidation` reads pointer-events/tabindex, not `isEnabled` |
| Native disabled buttons | yes — chooser Next, bulk Activate | `isEnabled` valid there (verified) |
| Angular typing | yes | `clearValue` + `addValue` + Tab blur |
| Server-side persisted state | yes — bulk draft | `clear_bulkGrid` in TC_7/TC_8 setup + in `TST_SBLK_TC_RESET` |
| ADR-019 cleanup vs evidence | yes | resets in BeforeEach + suite After only |
| Destructive controls | yes — Activate, Create, Update | no page-object method clicks any of them |
| `getText` 30 s on missing element | yes | existence checked before reads |
| Absolute counts drift | yes | nothing asserts a school-wide count |

#### Changes made
1. **`pages/ExperienceApp/bulkStudents.page.js`** — Created · Page Object · choosers + bulk activation
   (`isInitialized_accountType`, `isInitialized_bulkActivation`, `getData_accountTypeChooser`,
   `clear_bulkGrid`, `getData_bulkActivationPage`, `set_bulkRowField`, `wait_forRowAutofill`,
   `getData_bulkRowState`, `getData_isOnBulkActivation`). No method clicks Activate.
2. **`pages/ExperienceApp/createAdultStudentAccounts.page.js`** — Modified · Page Object · added
   `getData_rowFieldValidity(n)` and `getData_createButtonState()` (reads attribute, class AND
   pointer-events; never clicks Create). Reused, not duplicated (handoff rule).
3. **`pages/ExperienceApp/schoolStudents.page.js`** — Modified · Page Object · added
   `click_manageStudentsOption(option)` and `search_activationCode(code)` (outcomes NO_RESULTS /
   ROWS / ERROR_PAGE / NO_OUTCOME, 90 s budget).
4. **`pages/ExperienceApp/studentProfile.page.js`** — Modified · Page Object · added
   `clear_firstNameAndBlur()` and `getData_firstNameValidation()`.
5. **`test/ExperienceApp/bulkStudents.test.js`** — Created · Test Case · `TST_SBLK_TC_RESET`, `TC_6`,
   `TC_7`, `TC_8`, `TC_14` (defect case).
6. **`test/ExperienceApp/adminStudentsTab.test.js`** — Modified · `TST_SLST_TC_28` (defect case).
7. **`test/ExperienceApp/studentProfile.test.js`** — Modified · `TST_SPRF_TC_12`.
8. **`testResources/selectors/ExperienceApp/C1Selectors.json`** — Modified · new `bulkStudents`
   block; `studentProfile.editProfileFirstNameError`; `createAdultStudentAccounts` row/Create selectors.
9. **`testResources/testcaseRepository/ExperienceApp/C1TCRepository.json`** — Modified · new SBLK
   module; `TST_SPRF_TC_12`; `TST_SLST_TC_28`. All `visualTest: false`.
10. **`testResources/testcaseData/ExperienceApp/thor/adminBulkStudentsData.json`** — Created.
    **`adminStudentProfileData.json`**, **`adminStudentsTabData.json`** — Modified (new keys).
11. **`testResources/testExecutionFiles/ExperienceApp/thor/adminBulkStudents.json`** — Created
    (TC_6/7/8). **`adminStudentProfile.json`** — Modified (+`TST_SPRF_TC_12`).
12. **`package.json`** — Modified · `adminBulkStudentsTest_thor` (user-confirmed exact line).
13. **`test/Manual/C1App/AdminApp-Students/TST_SBLK_TC_14_invalid_username_password.csv`** — Created
    fixture (valid row + `9B`/`abc` row, class key `62k3-AXm6`). Upload only — never submitted.
14. **`.architecture/product-knowledge/ExperienceApp/admin-students-tab.md`** — Modified · §9 added.

#### Run log (Phase 2)
| Run | Suite | Result | Cause / fix |
|---|---|---|---|
| 1 | bulk | 1/3 — TC_7, TC_8 failed ("Activate should be disabled on an empty grid") | Root cause: the **server-side draft** restored a complete row I typed while grounding → Activate enabled. Also the Remove selector matched 2 buttons. Fix: `clear_bulkGrid` (TC setup + reset), `id^=` anchor, `.disable` Remove selector; leftover row cleared with user approval |
| 1 | profile | **11/11** (incl. TC_12) | — |
| 1 | list | **23/23** | regression check on `schoolStudents` changes |
| 2 | bulk | **3/3** (45 s) | first clean run after the fix |
| DIAG | defect cases | did not start — `TypeError: Cannot convert undefined or null to object` | MY temp exec file had a top-level `_comment`; `testrunner.js:27` treats every top-level key as a suite. Removed the key |
| DIAG 2 | defect cases | **0/2 — both fail as designed** (105 s) | `TC_14`: rows flagged correctly, then "Create 2 account" enabled. `TC_28`: redirected to `/dashboard/error` after 61.9 s. Temp exec file moved out of the repo; records updated (register .md/.xlsx, authoring-status) |
| 3 | bulk | **3/3** (53 s) | second consecutive clean run ✅ |
| 3 | profile | **11/11** (188 s, TC_12 9.9 s) | second consecutive clean run ✅ |
| 3 | list | **23/23** (231 s) | second consecutive clean run ✅ — regression check on `schoolStudents` |

> **Follow-up, not fixed:** on both of today's list runs `TST_SLST_TC_12` took ~61 s and
> `TST_SLST_TC_5` / `TC_6` ~31 s (all ~1 s on 2026-08-28). The ~30 s steps look like a 30 s
> Playwright wait expiring on an element that is not there (handoff trap: *"getText waits up to
> 30 s on a missing element — count first"*). Green, so left alone this session; worth a
> `--trace=true` look in Phase 2.

#### Architecture decisions triggered
- No new ADR. Applied ADR-019 (reset placement), ADR-021 rules 1/7 (no counts, no unasked data),
  Invariant 13/14 (defect cases assert the requirement and stay out of exec files, as `TST_SPRF_TC_7`).
- > ⚠️ Pattern worth recording: **server-side form drafts** now exist on two admin screens (Create
  > classes, bulk activation). Any TC that types into such a form must clear it — consider an
  > `admin-shared.md` §A4/§B7 entry.
- > ⚠️ Framework trap: an execution file must hold **only** `SuiteN` keys at the top level.

#### Protected files touched
- `package.json` — one script line, confirmed by the user in the AGENTS.md format.
- No core protected file (`baseActionLibrary.js`, `testrunner.js`, …) was modified.

#### Pending / follow-up
- Second confirmation run of all three suites; run the two defect cases once (temp exec file,
  then remove it) and record their real output.
- Update register `.md` + `.xlsx` (`npm run register`) and `authoring-status.md` (incl. the SPRF
  "11 passing" correction).
- Product questions for the user to raise: removal UI missing; Create enabled with invalid rows;
  code-search 504; raw i18n keys on the adult create form.
- Groups B, C, D and Phase 3 (visual) not started.

### Records — new "On Hold" status [2026-09-16]

The four findings are written up as pasteable tickets in
`.architecture/PRODUCT-QUESTIONS_students-tab_2026-09-16.md` (user asked for them, and will raise them).

Register statuses gained a fifth value, **On Hold**, for cases whose automation is paused by an open
bug: written, registered and verified against the app, but deliberately kept OUT of the execution
files so no suite stays permanently red. Applied to `TST_SLST_TC_28`, `TST_SBLK_TC_14`,
`TST_SPRF_TC_7`, `TST_SPRF_TC_19`, `TST_SPRF_TC_21`, `TST_SPRF_TC_22`.
`TST_SPRF_TC_20` stays **Blocked** — it needs 51+ students regardless of the removal bug.

⚠️ The `.xlsx` Status column carries a per-cell dropdown, so the list was extended to
`Not Run,Pass,Fail,Blocked,On Hold` before the values were written — otherwise Excel would treat
"On Hold" as an invalid entry. `manual-test-standard.md` still documents only the original four
values; it needs the same addition (not done — ask first, it is a shared standard).

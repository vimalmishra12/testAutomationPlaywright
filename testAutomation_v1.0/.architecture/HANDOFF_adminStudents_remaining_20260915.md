# HANDOFF — Admin App Students tab: automate the remaining cases

**Written:** 2026-09-15 · **Owner:** Vimal Mishra
**Start from:** `main` at `bbe5dd3` (or later). Nothing for this work is in flight — no branch, no uncommitted files.

> **Give this file to Claude at the start of a new session with no other context.**
> Everything needed to plan and build the remaining Students-tab automation is below.

---

## 0. Start here — in this order

1. Read the mandatory architecture set (`CLAUDE.md` §MANDATORY), including
   `product-knowledge/ExperienceApp/admin-shared.md` **Part A + Part B** and
   **`product-knowledge/ExperienceApp/admin-students-tab.md`** (the Students knowledge file — §7 and §8
   hold the verified selectors and traps).
2. For the SBLK (bulk) cases also read `product-knowledge/ExperienceApp/admin-bulk-account-csv.md`
   (pages *Create adult student accounts* and *Create new accounts for children*).
3. Use the repo skill **`c1-test-authoring`** from `D:\testAutomation\QATestAutomation\.agent\skills\`
   (not the worktree copy). New cases start in **Phase 1 (build)**.
4. Manual register (source of every case): `test/Manual/C1App/AdminApp-Students/`
   `AdminApp_Students_tab_test_cases.md` + `.xlsx` (68 cases). Edit the `.xlsx` with `npm run register`
   (`tooling/xlsxRegister.js`), never by zip surgery, and keep the `.md` in sync.

**User preferences (apply them):**
- Ask questions **one at a time**; wait for the answer.
- Fix routine test failures directly; stop and ask only for product defects, scope changes, or anything
  that changes shared data.
- **Drive the browser yourself** — never ask the user to click through the app. Claude cannot type
  passwords: when a live login is needed, open the login page, fill the username, and ask the user to
  type the password. If the in-app Browser pane is hidden/unavailable, ground through the framework
  itself (temporary `// DIAG-TEMP` logging + a temp exec file, removed afterwards) — it logs in with
  stored credentials.
- **Find the root cause before re-running.** Do not loop runs fixing one symptom at a time.
- **Re-verify any "finding" live before reporting it to the user as a defect** (two unverified claims
  had to be withdrawn on 2026-09-15).
- Explain in plain language; when asked to "explain slowly", use short structured sections.
- Stage files **by name** when committing (never `git add -A`). Ask before pushing. Push with the
  **Bash** tool (Git Bash) — PowerShell `git push` cannot show the GitHub credential prompt.

---

## 1. Current state (verified 2026-09-15)

| Suite | npm script | Exec file | Cases | Last result |
|---|---|---|---|---|
| Students list (SLST) | `adminStudentsTabTest_thor` | `adminStudentsTab.json` | 23 | **✅ 23/23 passing** (2026-09-15, 101 s) |
| Student profile (SPRF) | `adminStudentProfileTest_thor` | `adminStudentProfile.json` | 10 | **✅ 10/10 passing** (2026-09-15, 173 s) |
| Bulk operations (SBLK) | — | — | 0 | not started |

- Automated SLST: TC_1–13, 15–24 (all but 14 Blocked and 25). School `FCN-CHZ-PDA`, login `testt1@mailsac.com`.
- Automated SPRF (in the exec file): TC_1, 2, 4, 5, 6, 9, 11, 15, 16, 17.
  - `TST_SPRF_TC_7` is written + registered but **deliberately NOT in the exec file** — it asserts the
    requirement and the product hangs on HTTP 500 (`Vandna Garg` profile). Add it the day that is fixed.
  - `TST_SPRF_TC_21` is written + registered but **also not in any exec file**. It is `[EXTRA — Phase 1
    exclusion]`, so this is acceptable — but `authoring-status.md` claims SPRF has "11 passing" including
    it. **Correct that record.**
- Code: `pages/ExperienceApp/schoolStudents.page.js`, `studentProfile.page.js`;
  `test/ExperienceApp/adminStudentsTab.test.js`, `studentProfile.test.js`;
  data `testcaseData/ExperienceApp/thor/adminStudentsTabData.json`, `adminStudentProfileData.json`.
- **Reusable existing page objects** (from the NEMO-24306 CSV work — reuse, do not duplicate):
  `createAdultStudentAccounts.page.js` (isInitialized, navigateTo, upload_csvFile, getData_uploadErrors,
  Get CSV template link) and `createNewAccountsForChildren.page.js`.
- **No page object exists yet** for: the Manage students account-type choosers
  (`/learner/select/new`, `/learner/adult-select/new`, `/learner/select/existing`) or bulk activation
  (`/bulk_activation`). The knowledge file names the future page object `bulkStudents` (module SBLK).
- **No SBLK CSV fixture exists** in the repo.

### Register records are stale — fix as part of this work
- The register `.md` header and `.xlsx` still show **all SPRF cases as "Not Run"** although 10 pass.
- The `.md` header says "SPRF: 0 of 22 automated". Update both files together (`npm run register`).

---

## 2. Scope — what is left

68 register cases: SLST 28 · SPRF 23 · SBLK 17.
**Not in scope:** the 17 `[EXTRA — Phase 1 exclusion]` cases, and the 4 **Blocked** cases
(`SLST_TC_14` redeemed activation code · `SPRF_TC_3` no adult-with-username account ·
`SPRF_TC_20` needs 51+ students (also EXTRA) · `SBLK_TC_16` email report).

**Remaining to automate: 25 cases**, in four groups by what they need.

### Group A — side-effect free, build on `FCN-CHZ-PDA` now (9)

| Case | Checks | Notes |
|---|---|---|
| `SLST_TC_26` | Name search with special characters | Register fixtures `!^(+)s95` / `&FName` come from another team's sheet — **confirm they exist live first**; if not, ask the user (do not create students on FCN) |
| `SLST_TC_27` | Partial username returns every containing account | Only one child username account is known (`cqatestaichild1`) — verify enough data exists |
| `SLST_TC_28` | Never-activated code → clear no-result state in code search | Code search takes up to ~1 min (§7.5 of students knowledge) |
| `SPRF_TC_12` | Required name field cannot be saved empty | ⚠️ Clicks **Update**. Needs a **safety net**: if the empty name is accepted, restore the original and fail loudly (pattern: `TST_MYPR_TC_4` in `test/ExperienceApp/myProfile.test.js`). Capture the verbatim validation copy |
| `SPRF_TC_22` | Cancel on the removal confirmation leaves the student | Opens a destructive dialog — **never click Remove / Request to remove**. Singular dialog on the profile vs plural on the list (§8.8) |
| `SBLK_TC_6` | Account-type chooser cannot advance without a selection | New `bulkStudents` page object |
| `SBLK_TC_7` | Bulk activation page loads (grid, Upload file, Get CSV template, How to use) | 11 pre-rendered hidden modals there |
| `SBLK_TC_8` | Activate stays disabled until a row is complete | Check native vs CSS-only disabled (§B4) |
| `SBLK_TC_14` | Rule-violating username/password flagged on its own row | Adult create form. **Never submit.** Capture the stated rules verbatim first |

### Group B — side-effect free, but need CSV fixtures first (2)

| Case | Needs |
|---|---|
| `SBLK_TC_11` | Download the real bulk-activation template (headers were never captured), write `TST_SBLK_TC_11_bulk_activation.csv`. **Confirm upload only POPULATES the grid** (does not activate) before placing it in a read-only suite |
| `SBLK_TC_17` | Two generated CSVs in the real adult-create template format: **200** rows (accepted) and **201** (rejected). Upload only, never submit |

### Group C — change REAL data → own data-owning suite on `VED-NEH-KVU` (11)

`SLST_TC_25` (count rises after adding a student) · `SPRF_TC_8` (set a learner password) ·
`SPRF_TC_10` (update names) · `SPRF_TC_19` (remove a student) · `SPRF_TC_23` (learner signs in with the
new password — depends on TC_8) · `SBLK_TC_1` (create child accounts) · `SBLK_TC_2` (create adult
username accounts) · `SBLK_TC_3` (invite adults by email — **sends real email**) · `SBLK_TC_4` (add
existing students by username — modifies class membership) · `SBLK_TC_5` (invite existing by email) ·
`SBLK_TC_13` (duplicate username flagged).

- **School/login already exist:** `C1.login.user.reportsSchoolAdmin` in
  `testcaseData/ExperienceApp/thor/logindata.json` → `cqatestashish_admin@mailsac.com`,
  *Cqa Test Ashish School 1*, key `VED-NEH-KVU`, org slug `org_cup_j9GskaJJmvDjmQZ9`.
  Login pattern to copy: `testExecutionFiles/ExperienceApp/thor/adminSchoolReportsCreate.json`.
- 🚨 **VED-NEH-KVU is shared with the data-owning Reports suite (MRPT).** NEVER touch:
  class **`Automation_frozen_DND`** (key `gHoZ-iBXf`) and its students
  **`cqatestauto_stu1@mailsac.com`**, **`cqatestauto_stu2@mailsac.com`** — `TST_MRPT_TC_41` asserts their
  frozen activity figures (admin-reports-tab.md §14.1). Also leave `Automation_class_DND` and
  `School License Test Class 1–4` alone. Do not log in as those student accounts.
- Follow ADR-021: unique sweepable names (`AutoStudent_…`, check `maxlength` first), **sweep before
  creating**, cleanup never routed through the path under test, cleanup in `BeforeEach`/suite `After`
  not `AfterEach` (ADR-019), no absolute counts. Keep this suite **separate** from the read-only suites.
- Adding an npm script and creating data are decisions for the user — **ask before either**.

### Group D — waiting on something outside the tests (3) — park

| Case | Waiting for |
|---|---|
| `SPRF_TC_14` | A real, unused activation code (consumes it) — the code-issuing environment was reported down |
| `SBLK_TC_15` | Same — a valid code plus an invalid one in one bulk upload |
| `SPRF_TC_18` | A **product decision**: the umbrella name is a plain `<span>`, not a link (§2 of the students knowledge) |

---

## 3. Suggested order

1. Re-run both existing suites (read-only) and confirm green before changing anything.
2. **Group A** — live-ground the new screens first (choosers, bulk activation, adult create form):
   capture selectors, `maxlength`, pre-rendered modals (§B1 reconnaissance sweep), then build.
   Extend `schoolStudents` / `studentProfile`; create `bulkStudents`. One TC-repository module per test
   file (the runner resolves the FIRST module matching a `testFile`).
3. **Group B** — download templates, write fixtures, confirm upload is side-effect free.
4. **Group C** — only after the user confirms school, npm script and data creation.
5. **Group D** — do not start.
6. After each group: 2 consecutive clean runs, evidence audit of screenshots (Phase 2 exit checklist),
   update `authoring-status.md`, the register (`.md` + `.xlsx`), `admin-students-tab.md`, and a
   walkthrough under `.architecture/walkthroughs/` (name = test file + date-time).
7. Phase 3 (visual): the user deferred visual assessment for recent batches — ask before doing it.

---

## 4. Questions to ask the user (one at a time, in this order)

1. **Group A go-ahead:** build the 9 side-effect-free cases on `FCN-CHZ-PDA` now?
2. **`SPRF_TC_12`:** it clicks Update on a real student — OK with the restore-and-fail safety net, and
   which student to use (e.g. `Marvin Jae student` · nonmqastudent5@mailsac.com)?
3. **`SLST_TC_26`** if the special-character name fixtures do not exist on FCN: skip, mark Blocked, or
   provide a school that has one?
4. **Group B:** OK to download the CSV templates and commit generated fixtures under
   `test/Manual/C1App/AdminApp-Students/`?
5. **Group C:** confirm `VED-NEH-KVU` for the data-owning Students suite (with the MRPT never-touch
   list), the new npm script name, and that `SBLK_TC_3/5` may send real invite emails.
6. **Group D:** is the activation-code environment back, and has product decided on `SPRF_TC_18`?
7. **Records:** OK to update the register statuses (SPRF 10 cases → Pass) and correct the
   `authoring-status.md` SPRF "11 passing" claim?

---

## 5. Traps already known — read before building (full detail in the knowledge files)

- **Loader overlay `#loader-container .loader` swallows clicks** — wait for it before every click.
- **Clicks can land before handlers bind** (seen 2026-09-14/15 on the role toggle and wizard Next): a
  click returns success and nothing happens. Settle then click once — never retry-click.
- **Row menu items are pre-rendered once per row, all with ONE qid** (`aLearner-83` ×20) — filter on
  visibility. Row ids are positional — resolve a row by its `aria-label` content.
- **The adult new-account chooser and the existing-student chooser share ids** (`adultCreateInvite-1..4`)
  — identify the screen by URL or heading.
- **Students tab spans three microfrontends** (admin / class / dashboard) — crossings are full page
  loads (profile ~3–9 s, Manage learner profile ~9 s).
- **Gigya Password tab** injects ~80 hidden inputs — select by id (`#gigya-password-newPassword`);
  submit with **Enter**, not a click.
- **Invalid activation code round trip is ~40 s** — any poll under ~45 s concludes "no error shown".
- **`getText` waits up to 30 s on a missing element** — count first, then read (hit on the Classes tab
  2026-09-15).
- **A "did the list change?" fingerprint must use every row and wait for a settled change** — a
  first+last-name fingerprint was fooled by duplicate names (Classes tab, 2026-09-15).
- **CustomerGauge NPS survey** (`cg-survey-popup`) can overlay the dashboard and intercept clicks.
- **Absolute counts drift** on FCN-CHZ-PDA (26 → 27 students) — never assert them.
- **Apostrophes:** the DOM uses a straight `'` where the knowledge file shows a curly one — normalise.

---

## 6. Known product defects on this tab (do not "fix" in tests)

| Defect | Case | Status |
|---|---|---|
| Profile hangs on HTTP 500 (`Vandna Garg`) | `SPRF_TC_7` | open (2026-08-28) |
| Bulk-activation success dialog shows raw keys `ADMIN.LEARNER.BULK_ACTIVATION.SUCCESS_MODAL_INFO_1/2/3` | `SBLK_TC_9` (EXTRA) | open, not re-checked |
| Raw keys in accessible names (`…SELECT_STUDENT`, `SCREEN_READER.PROCESSING_MESSAGE`) | `SBLK_TC_10` (EXTRA), `SPRF_TC_16` | open |
| Disabled Location field shows literal `undefined` (child) | — | present |
| "occured" typo in the bulk error dialog | — | not re-checked |
| No-results search rendered nothing | `SLST_TC_12` | **FIXED** 2026-08-28 — do not re-introduce |

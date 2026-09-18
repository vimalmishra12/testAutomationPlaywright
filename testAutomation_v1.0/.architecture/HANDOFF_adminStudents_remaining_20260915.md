# HANDOFF — Admin App Students tab: automate the remaining cases

**Written:** 2026-09-15 · **Owner:** Vimal Mishra · **Trimmed:** 2026-09-18
**Start from:** latest `main`.

> **Status [2026-09-18]:** Group A is DONE (commit `ff17661`) and the register was reconciled
> (`dc5ab6b`). Live results live in `authoring-status.md` (`adminStudentsTab`, `adminStudentProfile`,
> `adminBulkStudents`). This file now holds only the **remaining** work: Groups B, C, D.

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

## 1. Current state
See `authoring-status.md` for the live counts. What still matters for the remaining work:
- **Reusable existing page objects** (from the NEMO-24306 CSV work — reuse, do not duplicate):
  `createAdultStudentAccounts.page.js` and `createNewAccountsForChildren.page.js`.
- `bulkStudents.page.js` now exists (choosers + bulk activation). The only SBLK CSV fixture so far is
  `TST_SBLK_TC_14_invalid_username_password.csv`.

---

## 2. Scope — what is left

**Not in scope:** the `[EXTRA — Phase 1 exclusion]` cases and the **Blocked** ones (see
`authoring-status.md`). Student removal is gone from the product, so `SPRF_TC_19–22` wait on the
Jira answer (`admin-students-tab.md` §5 / §9.7). Group A (9 cases) is **done**.


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

1. **Group B** — download templates, write fixtures, confirm upload is side-effect free.
2. **Group C** — only after the user confirms school, npm script and data creation.
3. **Group D** — do not start.
4. After each group: 2 consecutive clean runs, evidence audit of screenshots (Phase 2 exit checklist),
   update `authoring-status.md`, the register (`.md` + `.xlsx`), `admin-students-tab.md`, and a
   walkthrough under `.architecture/walkthroughs/` (name = test file + date-time).
5. Phase 3 (visual): the user deferred visual assessment for recent batches — ask before doing it.

---

## 4. Questions to ask the user (one at a time, in this order)

1. **Group B:** OK to download the CSV templates and commit generated fixtures under
   `test/Manual/C1App/AdminApp-Students/`?
2. **Group C:** confirm `VED-NEH-KVU` for the data-owning Students suite (with the MRPT never-touch
   list), the new npm script name, and that `SBLK_TC_3/5` may send real invite emails.
3. **Group D:** is the activation-code environment back, and has product decided on `SPRF_TC_18`?

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

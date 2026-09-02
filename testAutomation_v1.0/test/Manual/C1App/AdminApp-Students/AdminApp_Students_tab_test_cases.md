# Manual Functional Test Cases — Admin App: Students Tab (Batch 1)

**Source:** `AdminApp_Student Tab.xlsx` — 23 high-level Students-tab scenarios
**Modules:** **SLST** (Students tab list) — *maps to the future `schoolStudents` page object* · **SPRF** (student profile & manage account) — *`studentProfile`* · **SBLK** (bulk student operations) — *`bulkStudents`*
**App:** Admin App / NEMO — `micro-nemo.comprodls.com` (Thor)
**Pages in scope:** Students tab `/admin/admin/org_<slug>/learner` · student profile `/class/teacher/org_<slug>/profile/<orgUuid>/<userId>` · manage learner profile `/admin/admin/org_<slug>/edit-user-profile/<orgUuid>/<userId>` · individual activation `/dashboard/teacher/org_<slug>/activateMaterial/<userId>/admin` · bulk activation `/admin/admin/org_<slug>/bulk_activation`
**Generated:** 2026-08-22 · **Revised:** 2026-08-28 (Phase 1 grounding — TC_12/13/14 expected results corrected) | **Total TCs:** 68 (35 Positive · 19 Edge · 14 Negative)
> **[2026-09-01] Gap-analysis batch.** Cases added after comparing this register against the other team's `C1_Admin_Console_Detailed_Test_Cases_REVIEWED_Team.xlsx`. Every one closes a scenario their sheet covers and ours did not. All are appended (never renumbered, skill rule 7), all carry `[ASSUMED]` expected results pending a live pass, and the design-time blockers are marked `Blocked` with their unblock route in Comments. See `HANDOFF_adminGapAnalysis_2026-09-01.md`.

> **[2026-09-02] Phase 1 automation exclusions — "extra" cases.** **17** of this register's cases are marked **`[EXTRA — Phase 1 exclusion]`** in their **Remarks**. They are the cases carried as **"Extra in Ours"** in `Admin_Gap_Analysis.xlsx` — coverage we hold that the other team's reviewed sheet (`C1_Admin_Console_Detailed_Test_Cases_REVIEWED_Team.xlsx`) does not. **None of them will be automated in Phase 1**; Phase 1 automation scope is the cases *not* carrying this marker. They stay in the register and are revisited for a later phase. Excluded here: `TST_SLST_TC_1`, `TST_SLST_TC_9`, `TST_SLST_TC_10`, `TST_SLST_TC_11`, `TST_SLST_TC_18`, `TST_SLST_TC_19`, `TST_SLST_TC_24`, `TST_SPRF_TC_4`, `TST_SPRF_TC_5`, `TST_SPRF_TC_6`, `TST_SPRF_TC_7`, `TST_SPRF_TC_13`, `TST_SPRF_TC_20`, `TST_SPRF_TC_21`, `TST_SBLK_TC_9`, `TST_SBLK_TC_10`, `TST_SBLK_TC_12`.
 — **all 23 source scenarios covered**
**Execution status (2026-09-01):** **23 of 68 TCs automated and PASSING** (41 Not Run · 4 Blocked) — the whole side-effect-free SLST block, verified on Thor across two consecutive clean runs (`npm run adminStudentsTabTest_thor`). 33 are **Not Run** (SLST TC_25, all 22 SPRF, all 12 SBLK — less the 2 blocked); **3 are Blocked** (`TST_SLST_TC_14`, `TST_SPRF_TC_3`, `TST_SPRF_TC_20`).
- **SLST: 23 of 25 Pass.** Remaining: `TC_14` (Blocked - needs a redeemed activation code) and `TC_25` (creates real data; targets Cqa Test Ashish School 1 / VED-NEH-KVU).
- **SPRF: 0 of 22 automated.** **SBLK: 0 of 12 automated** (7 CSV fixtures still unwritten).
- Automation lives in `test/ExperienceApp/adminStudentsTab.test.js` + `pages/ExperienceApp/schoolStudents.page.js`.
- Module **SLST** (`TST_SLST_TC_1–25`, 25 TCs) — scenarios #1–#7, #16, #23.
- Module **SPRF** (`TST_SPRF_TC_1–22`, 22 TCs) — scenarios #8–#15, #22.
- Module **SBLK** (`TST_SBLK_TC_1–12`, 12 TCs) — scenarios #17–#21.

**Three cases are BLOCKED at design time**, each for a different shared-school reason — see their Comments cells: `TST_SLST_TC_14` (needs a redeemed 16-character activation code; the code-issuing environment is down — reason CORRECTED 2026-08-28, see its Comments cell), `TST_SPRF_TC_3` (no adult-with-username account exists here) and `TST_SPRF_TC_20` (the 50-student removal cap needs 51+ students; the school holds 26). All three are recorded **Blocked**, not Not Run, per `admin-shared.md` §A8.3.

**Four product defects were found during grounding** and were written as expected-versus-actual cases, each with live evidence. **Re-checked 2026-08-28: one of the four (`TST_SLST_TC_12`) has since been FIXED in the product** and is struck through below; the other three still stand.

| TC | Defect |
|---|---|
| ~~`TST_SLST_TC_12`~~ | **FIXED in the product — verified live 2026-08-28.** Was: a no-match search rendered nothing at all (table removed, no message) with a `TypeError` from the admin bundle. Now renders "This school has no students that match your search **<term>**. Please check the spelling or try a different search term" with zero console errors. `students-no-results.png` is historic evidence only. The case is no longer expected-versus-actual. |
| `TST_SPRF_TC_7` | `View student profile` for one student hangs on an **infinite spinner** with no error; `getUserDetailWithClasses` returns **HTTP 500**. |
| `TST_SBLK_TC_9` | The bulk-activation **success dialog renders three raw translation keys** (`ADMIN.LEARNER.BULK_ACTIVATION.SUCCESS_MODAL_INFO_1/2/3`) instead of text. |
| `TST_SBLK_TC_10` | The bulk-activation row checkbox's screen-reader label is the raw key `ADMIN.LEARNER.BULK_ACTIVATION.SELECT_STUDENT`. |

**One source scenario appears not to be implementable as written.** Scenario #15 asks for the umbrella details page to be launched by clicking the umbrella name on a profile. The umbrella name is a **plain text span with no link**, confirmed on both a child and an adult profile. `TST_SPRF_TC_18` records this as expected-versus-actual and it needs a product decision — missing link, or wrong scenario — before it is automated.

**Batches:** Batch 1 — the whole Students-tab scenario list (`TST_SLST_*` / `TST_SPRF_*` / `TST_SBLK_*`, 59 TCs).

> **Ordering:** test cases are **grouped by Linked Requirement (scenario)** so every requirement's TCs sit
> together; within each group they run **Positive → Edge → Negative**. (This intentionally departs from
> `manual-test-standard.md`'s global P→E→N ordering, per the Admin App convention.) **S.No.** is sequential
> 1–59 in this grouped order; **Test Case IDs** are stable identifiers and therefore appear out of numeric
> sequence within a group.
>
> **Batch 1 scope (agreed with the user before design):** all 23 scenarios from the source workbook, in one
> document, split across three module codes chosen to survive automation. Nothing deferred.
>
> Unverified expected text is marked `[ASSUMED]`; env-specific values use `<PLACEHOLDER>` (see Remarks).

---

## Requirement → Test Case coverage map

| Linked Requirement (scenario) | Mapped TC IDs (P → E → N) |
|---|---|
| — Students tab load *(added, not in source)* | TST_SLST_TC_1 |
| #1 — Verify search by first name | TST_SLST_TC_2, TST_SLST_TC_9, TST_SLST_TC_10, TST_SLST_TC_3 (E), TST_SLST_TC_11 (E), TST_SLST_TC_12 (N), TST_SLST_TC_26 (E) |
| #2 — Verify search by last name | TST_SLST_TC_4 |
| #3 — Verify search by email | TST_SLST_TC_5, TST_SLST_TC_6 (E), TST_SLST_TC_7 (E) |
| #4 — Verify search by username | TST_SLST_TC_8, TST_SLST_TC_27 (E) |
| #5 — Verify search with "who activated the code in my school?" checkbox | TST_SLST_TC_13, TST_SLST_TC_14, TST_SLST_TC_28 (N) |
| #6 — Verify sort by last name/first name/username | TST_SLST_TC_15, TST_SLST_TC_16, TST_SLST_TC_17, TST_SLST_TC_18 (E), TST_SLST_TC_19 (E) |
| #7 — Verify user guide expand/collapse | TST_SLST_TC_20, TST_SLST_TC_21 |
| #16 — Verify load more feature | TST_SLST_TC_22, TST_SLST_TC_23 (E), TST_SLST_TC_24 (E) |
| #23 — Verify count of students increase on adding a new student | TST_SLST_TC_25 |
| #8 — Verify view profile for a adult learner | TST_SPRF_TC_1, TST_SPRF_TC_4, TST_SPRF_TC_5, TST_SPRF_TC_6 (E), TST_SPRF_TC_7 (N) |
| #9 — Verify view profile for a child/adult with username | TST_SPRF_TC_2 |
| #10 — Verify view profile for a adult with username | TST_SPRF_TC_3 |
| #11 — Verify Change password: View Profile > Manage account > Edit Account details | TST_SPRF_TC_8, TST_SPRF_TC_9 (N), TST_SPRF_TC_23 |
| #12 — Verify update personal info of user: View Profile > Manage account > Edit account details | TST_SPRF_TC_10, TST_SPRF_TC_11 (E), TST_SPRF_TC_13 (E), TST_SPRF_TC_12 (N) |
| #13 — Verify Activate course material for individual learner | TST_SPRF_TC_14, TST_SPRF_TC_15 (E), TST_SPRF_TC_16 (N) |
| #14 — Verify launch class from view profile page | TST_SPRF_TC_17 |
| #15 — Verify umbrella details page launch from view profile page (click on umbrella name) - clicking Back should return to previous page | TST_SPRF_TC_18 (N) |
| #22 — Verify remove from school account: View Profile > Manage account | TST_SPRF_TC_19, TST_SPRF_TC_20 (E), TST_SPRF_TC_21 (E), TST_SPRF_TC_22 (N) |
| #17 — Verify Bulk feature > Add new students to classes children | TST_SBLK_TC_1, TST_SBLK_TC_6 (E), TST_SBLK_TC_13 (N), TST_SBLK_TC_16 |
| #18 — Verify Bulk feature > Add new students to classes adult with username | TST_SBLK_TC_2, TST_SBLK_TC_14 (N), TST_SBLK_TC_17 (E) |
| #19 — Verify Bulk feature > Add new students to classes adult/teacher (email) | TST_SBLK_TC_3 |
| #20 — Verify Bulk feature > Add existing students to classes adult/teacher (email) | TST_SBLK_TC_4, TST_SBLK_TC_5 |
| #21 — Verify Bulk feature > Activate course material | TST_SBLK_TC_7, TST_SBLK_TC_11, TST_SBLK_TC_8 (E), TST_SBLK_TC_9 (N), TST_SBLK_TC_10 (N), TST_SBLK_TC_12 (N), TST_SBLK_TC_15 (N) |

Every one of the 23 source scenarios has at least one test case.

---

## Product reference (captured live 2026-08-22, Thor · school "3 July Test School 1" / FCN-CHZ-PDA · account testt1@mailsac.com)

### Navigation and routes

```
My school accounts (/admin/admin/dashboard)
  └─ school card (select by KEY — two schools share the display name)
       └─ Classes tab (default)  →  STUDENTS tab   /admin/admin/org_<slug>/learner
            ├─ Manage students ▾  → Add new students to classes   /learner/select/new
            │                          └─ Adults → /learner/adult-select/new
            │                     → Add existing students to classes /learner/select/existing
            │                     → Activate course materials        /bulk_activation
            ├─ row action menu ▾  → View student profile
            │                          /class/teacher/org_<slug>/profile/<orgUuid>/<userId>
            │                     → Activate course materials
            │                          /dashboard/teacher/org_<slug>/activateMaterial/<userId>/admin
            └─ select rows        → Remove from school account (bulk, max 50)

student profile
  ├─ Back                  → Students tab
  ├─ Manage account ▾      → Edit account details
  │                             /admin/admin/org_<slug>/edit-user-profile/<orgUuid>/<userId>
  │                             ├─ Personal info tab
  │                             └─ Password tab  (Gigya-hosted, appends ?pwrt=…&apiKey=…)
  │                        → Remove from school account
  ├─ Course materials (N)  → grouped by umbrella; umbrella name is NOT a link
  └─ Classes (N)           → class name link → /class/teacher/org_<slug>/class/<uuid>/view/classdata
```

The Students tab spans **three microfrontends** — `admin` (list, edit profile, bulk activation), `class` (student profile) and `dashboard` (individual activation). Expect a full page load, not a route change, when crossing between them.

### Students tab layout

- Heading **Students (N)**, replaced when a search is active by **Students / Showing search results for _<term>_. / Clear**.
- **Search box** — placeholder `Search by first name, last name, email or username`; **no `maxlength`**; **submit-driven** (typing alone does not filter).
- Checkbox **Who activated the code in my school?**
- **Manage students ▾** — `Add new students to classes` · `Add existing students to classes` · `Activate course materials`.
- Select-all checkbox + **N Selected** counter + **Remove from school account** (natively disabled at 0 selected).
- **User guide** toggle — label swaps to **Hide** when open; the panel is genuinely removed from the DOM when closed.
- Table sort headers: **Last name** · **First name** · **Email address or Username**. Default sort is **First name ascending**.
- Each row: initials avatar, the three columns, and a **⠇ action menu** holding exactly `View student profile` and `Activate course materials`. The row's accessible name states **Adult Learner** or **Child Learner** — the only place account type is exposed on the list.
- **Load more ...** — page size **20**; the link is **removed** from the DOM once the list is exhausted.

### Field constraints found

| Screen | Field | Constraint |
|---|---|---|
| Students tab | Search | no `maxlength`; case-insensitive; partial-matching; special characters matched literally |
| Manage learner profile → Personal info | First name / Last name | required, editable, **no `maxlength` attribute** — any limit is server-side and unmeasured |
| Manage learner profile → Personal info | Username / Location | present but **disabled** |
| Manage learner profile → Password | New password | single field, no confirm field, no current-password field |
| Activate an access code | Activation code | placeholder `Example: AB2C-DE3F-G4HJ-K5LM`; Activate natively disabled while empty |
| Bulk activation | Activation code | placeholder `for example ABC4-DE3F-G2HJ-1KLM` |

> **No boundary case has been written for First name / Last name**, deliberately: with no `maxlength` in the markup there is no boundary to test against until someone measures the server-side limit. Flagged rather than guessed (`admin-shared.md` §A8.2).

### Copy verified live (assert verbatim)

| Where | Text |
|---|---|
| Search banner | `Showing search results for <term>.` — echoes the term, preserving its case |
| Search, no results | `This school has no students that match your search <term>. Please check the spelling or try a different search term` — in `div.no-records > p.mb-0`, term bolded. Verified 2026-08-28 (was absent entirely on 2026-08-22 — defect since fixed). |
| User guide | `On this page you can:` · `Search for a student who has joined your school in Cambridge One` · `View individual students’ profiles and manage their accounts` · `Add multiple students to classes` · `Activate course materials for students` |
| Profile, course-material states | `Code activated` / `Code not activated` / `Code expired` |
| Manage learner profile | `Manage learner profile`, tabs `Personal info` / `Password` |
| Password screen | `Change learner password`, field `New password` |
| Password too weak | `Password does not meet complexity requirements` |
| Unsaved-changes dialog | `Save changes?` / `Changes will be lost if you don’t save them` / `Cancel` / `Yes` |
| Activate an access code | `Activating a code gives the student access to their learning materials.` · `The code has 16 characters, both letters and numbers, and may be printed on the inside front cover of the Student’s Book or purchased separately by your school. You can only use each code once.` |
| Activation failed | `Sorry, something went wrong at our end and we couldn’t activate your code. Please try again later` |
| Remove confirm | `I confirm that I want to remove students from my school account` / `Cancel` / `Request to remove` |
| Remove limit | `You can only remove 50 students at one time` / `Please uncheck some students to continue` |
| Remove in progress | `Removing students may take some time` / `We are currently removing N student accounts. You will receive an email report once the accounts have been removed.` / `Go back to manage more students` |
| New-student chooser | `Important: Classes must be created before setting up student accounts` |
| Adult chooser | `Create accounts or invite students` · `Create adult student accounts` · `Invite adult students by email` |
| Existing-student chooser | `Add students by username or email?` · `Add students by username` · `Invite students by email` · `Important: Classes must be created before adding existing students` |
| Bulk activation | `Activate codes for students in your school` · `Upload file` · `Get CSV template` · `How to use this form` · `Activate N code(s)` |
| Bulk upload failed | `Sorry, your file could not be uploaded` … `If that doesn’t work, email our Customer Services team at ptsupport@cambridge.org` |

**Copy free-captured from the pre-rendered DOM without triggering it** (`admin-shared.md` §A6): every remove-flow dialog (3), the unsaved-changes dialog, and all **11** bulk-activation dialogs — including the defective success dialog in `TST_SBLK_TC_9`, which is how that defect was found before anyone ran a bulk activation.

### Behaviour worth knowing before designing more cases

- **Search is submit-driven** and settles in ~1–2 s. Case-insensitive, partial-matching, special characters literal.
- **Sort collation is by code point, not locale** — upper-case before lower-case, exactly as on the Classes tab.
- **The list lazy-loads at page size 20**; `Load more ...` is removed, not disabled, when exhausted.
- **The profile page heading is `Last name, First name`**, and the line beneath it holds the email for email accounts and the **username** for username accounts — the only on-profile signal of account type.
- **`Course materials (N)` counts umbrellas, not components.**
- **Removal is asynchronous and reported by email**, not in-app, and is capped at 50 per request.
- **Row action-menu items are pre-rendered once per row** — with 26 students the page holds 26 copies of `View student profile`, of which one is visible. A presence check is a guaranteed false green (`admin-shared.md` §B2).
- **A CustomerGauge NPS survey (`<cg-survey>` / `#cg-survey-popup`) can overlay the dashboard** and intercept the school-card click. It appeared unprompted during this session.

### Fixtures used on FCN-CHZ-PDA

| Purpose | Student |
|---|---|
| Adult with email | `Marvin Jae student` · nonmqastudent5@mailsac.com |
| Adult, email with special characters | `Learner Learner` · shivampilot04+Taylor&%^$wift@gmail.com |
| Adult with umbrellas incl. **Code expired** | `Learner us` · testps27@mailsac.com |
| Child with username, 2 umbrellas, 2 classes | `child1 test` · cqatestaichild1 |
| Profile that 500s (defect fixture) | `Vandna Garg` · vandna.garg+11student@comprotechnologies.com |

The school held **26 students** at capture. It is **shared and actively mutated by other teams** — never assert an absolute count (`admin-shared.md` §A5).

---

## Section — Test Cases (grouped by Linked Requirement)

### Requirement — Students tab load *(added by designer; not in the source list)*

| Field | Value |
|---|---|
| **S.No.** | 1 |
| **Test Case ID** | TST_SLST_TC_1 |
| **Title** | Verify the Students tab loads with all expected components when a school is opened |
| **Linked Requirement** | — (designer-added) |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as school admin (testt1@mailsac.com) on Thor. School "3 July Test School 1" (key FCN-CHZ-PDA) opened from "My school accounts". Students tab is displayed. |
| **Test Steps** | 1. Open school "3 July Test School 1" (FCN-CHZ-PDA) from My school accounts.<br>2. Click the STUDENTS tab in the left nav.<br>3. Observe the page. |
| **Test Data** | - |
| **Expected Result** | URL is /admin/admin/org_perf_testschool_1/learner. Heading reads "Students (N)". The page shows: search box with placeholder "Search by first name, last name, email or username", a Search button, the checkbox "Who activated the code in my school?", a "Manage students" dropdown, a select-all checkbox with "0 Selected", a disabled "Remove from school account" button, a "User guide" toggle, and a table with sort headers Last name / First name / Email address or Username. |
| **Remarks** | **[EXTRA — Phase 1 exclusion]** Not present in the other team's reviewed sheet (`Admin_Gap_Analysis.xlsx`, status "Extra in Ours"). **This case will NOT be automated in Phase 1** — exclude it from the Phase 1 automation scope; revisit for a later phase. Added by the designer — the source list has no explicit tab-load scenario, but every other case depends on this state. N moves on this shared school; never assert an absolute count. |
| **Actual Result** | |
| **Status** | Pass |
| **Comments / Defect ID** |  |

### Requirement #1 — Verify search by first name

| Field | Value |
|---|---|
| **S.No.** | 2 |
| **Test Case ID** | TST_SLST_TC_2 |
| **Title** | Verify a student is returned when searching by their exact first name |
| **Linked Requirement** | #1 — Verify search by first name |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as school admin (testt1@mailsac.com) on Thor. School "3 July Test School 1" (key FCN-CHZ-PDA) opened from "My school accounts". Students tab is displayed. |
| **Test Steps** | 1. Type "Marvin" into the search box.<br>2. Click Search.<br>3. Observe the result list and the heading. |
| **Test Data** | First name: Marvin (student "Marvin Jae student", nonmqastudent5@mailsac.com) |
| **Expected Result** | Exactly one row is listed — Last name "student", First name "Marvin Jae", Email "nonmqastudent5@mailsac.com". The heading changes from "Students (N)" to "Students / Showing search results for Marvin. / Clear" — the count is replaced by the search banner. |
| **Remarks** | The search term is echoed in the banner verbatim. |
| **Actual Result** | |
| **Status** | Pass |
| **Comments / Defect ID** |  |

| Field | Value |
|---|---|
| **S.No.** | 3 |
| **Test Case ID** | TST_SLST_TC_9 |
| **Title** | Verify the list does not filter until the Search button is clicked |
| **Linked Requirement** | #1 — Verify search by first name |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as school admin (testt1@mailsac.com) on Thor. School "3 July Test School 1" (key FCN-CHZ-PDA) opened from "My school accounts". Students tab is displayed. |
| **Test Steps** | 1. Type "Marvin" into the search box.<br>2. Do NOT click Search. Wait 3 seconds.<br>3. Observe the heading and the row count.<br>4. Click Search. |
| **Test Data** | Search term: Marvin |
| **Expected Result** | After step 3 the heading still reads "Students (N)" and the full first page of 20 rows is still listed — search is submit-driven, not live. Only after step 4 does the list narrow to one row. |
| **Remarks** | **[EXTRA — Phase 1 exclusion]** Not present in the other team's reviewed sheet (`Admin_Gap_Analysis.xlsx`, status "Extra in Ours"). **This case will NOT be automated in Phase 1** — exclude it from the Phase 1 automation scope; revisit for a later phase. Verified live 2026-08-22 (heading "Students (26)", 20 rows, unchanged after typing). Same behaviour as the Classes tab. |
| **Actual Result** | |
| **Status** | Pass |
| **Comments / Defect ID** |  |

| Field | Value |
|---|---|
| **S.No.** | 4 |
| **Test Case ID** | TST_SLST_TC_10 |
| **Title** | Verify Clear restores the full student list and the count heading |
| **Linked Requirement** | #1 — Verify search by first name |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | Logged in as school admin (testt1@mailsac.com) on Thor. School "3 July Test School 1" (key FCN-CHZ-PDA) opened from "My school accounts". Students tab is displayed. A search for "budhiraja" has been run and one row is listed. |
| **Test Steps** | 1. Click the "Clear" link in the search banner.<br>2. Observe the heading, the search box and the row count. |
| **Test Data** | - |
| **Expected Result** | The banner is replaced by the "Students (N)" count heading, the search box is emptied, the first page of 20 rows is listed again and "Load more ..." reappears. |
| **Remarks** | **[EXTRA — Phase 1 exclusion]** Not present in the other team's reviewed sheet (`Admin_Gap_Analysis.xlsx`, status "Extra in Ours"). **This case will NOT be automated in Phase 1** — exclude it from the Phase 1 automation scope; revisit for a later phase. Verified live 2026-08-22. |
| **Actual Result** | |
| **Status** | Pass |
| **Comments / Defect ID** |  |

| Field | Value |
|---|---|
| **S.No.** | 5 |
| **Test Case ID** | TST_SLST_TC_3 |
| **Title** | Verify a partial, differently-cased first name still matches |
| **Linked Requirement** | #1 — Verify search by first name |
| **Type** | Edge |
| **Priority** | Medium |
| **Preconditions** | Logged in as school admin (testt1@mailsac.com) on Thor. School "3 July Test School 1" (key FCN-CHZ-PDA) opened from "My school accounts". Students tab is displayed. |
| **Test Steps** | 1. Type "marv" into the search box.<br>2. Click Search. |
| **Test Data** | Partial lowercase fragment: marv |
| **Expected Result** | The same student "Marvin Jae student" is returned — search is partial-matching and case-insensitive. [ASSUMED for the partial-prefix case: full-term and case-insensitivity were verified live 2026-08-22; the 4-character prefix was not run separately.] |
| **Remarks** | Case-insensitivity confirmed live on the email dimension (see TST_SLST_TC_6). |
| **Actual Result** | |
| **Status** | Pass |
| **Comments / Defect ID** |  |

| Field | Value |
|---|---|
| **S.No.** | 6 |
| **Test Case ID** | TST_SLST_TC_11 |
| **Title** | Verify a whitespace-only search term is treated as an empty search |
| **Linked Requirement** | #1 — Verify search by first name |
| **Type** | Edge |
| **Priority** | Low |
| **Preconditions** | Logged in as school admin (testt1@mailsac.com) on Thor. School "3 July Test School 1" (key FCN-CHZ-PDA) opened from "My school accounts". Students tab is displayed. |
| **Test Steps** | 1. Type two space characters into the search box.<br>2. Click Search. |
| **Test Data** | Search term: "  " (two spaces) |
| **Expected Result** | All students are returned (first page of 20 rows). The search banner is shown but with no term between "Showing search results for" and the full stop — i.e. the term is trimmed away yet the banner state is still entered. |
| **Remarks** | **[EXTRA — Phase 1 exclusion]** Not present in the other team's reviewed sheet (`Admin_Gap_Analysis.xlsx`, status "Extra in Ours"). **This case will NOT be automated in Phase 1** — exclude it from the Phase 1 automation scope; revisit for a later phase. Verified live 2026-08-22. Arguably the banner should not appear at all for an empty term — raise as a minor UX observation, not a functional failure. |
| **Actual Result** | |
| **Status** | Pass |
| **Comments / Defect ID** |  |

| Field | Value |
|---|---|
| **S.No.** | 7 |
| **Test Case ID** | TST_SLST_TC_12 |
| **Title** | Verify a meaningful empty state is shown when a search matches no student |
| **Linked Requirement** | #1 — Verify search by first name |
| **Type** | Negative |
| **Priority** | High |
| **Preconditions** | Logged in as school admin (testt1@mailsac.com) on Thor. School "3 July Test School 1" (key FCN-CHZ-PDA) opened from "My school accounts". Students tab is displayed. |
| **Test Steps** | 1. Type "zzz-no-such-student-9999" into the search box.<br>2. Click Search.<br>3. Observe the area below the toolbar.<br>4. Open the browser console. |
| **Test Data** | Non-matching term: zzz-no-such-student-9999 |
| **Expected Result** | The table (including the sort header row) is removed and an explicit empty-state message replaces it, echoing the search term verbatim in bold:<br>"This school has no students that match your search **&lt;term&gt;**. Please check the spelling or try a different search term"<br>The search banner still reads "Students / Showing search results for &lt;term&gt;. / Clear", the Clear link remains available, and NO console error is logged. |
| **Remarks** | DEFECT NOW FIXED — verified live on Thor 2026-08-28. Between 2026-08-22 and 2026-08-28 the product was corrected. Originally raised as a defect: nothing rendered at all (table removed, no message) and the console threw "TypeError: Cannot read properties of undefined (reading 'length') at o.search" — see students-no-results.png, which is now HISTORIC evidence and no longer reflects current behaviour. Re-verified 2026-08-28: message renders correctly, zero console errors. Automation asserts the FIXED behaviour; do not re-introduce the defect expectation. Empty-state node: div.no-records > p.mb-0. |
| **Actual Result** | |
| **Status** | Pass |
| **Comments / Defect ID** |  |

### Requirement #2 — Verify search by last name

| Field | Value |
|---|---|
| **S.No.** | 8 |
| **Test Case ID** | TST_SLST_TC_4 |
| **Title** | Verify a student is returned when searching by their last name |
| **Linked Requirement** | #2 — Verify search by last name |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as school admin (testt1@mailsac.com) on Thor. School "3 July Test School 1" (key FCN-CHZ-PDA) opened from "My school accounts". Students tab is displayed. |
| **Test Steps** | 1. Type "budhiraja" into the search box.<br>2. Click Search. |
| **Test Data** | Last name: budhiraja (student "niharika budhiraja", learner34@mailsac.com) |
| **Expected Result** | Exactly one row is listed — Last name "budhiraja", First name "niharika", Email "learner34@mailsac.com". Banner reads "Showing search results for budhiraja." |
| **Remarks** | Verified live 2026-08-22. |
| **Actual Result** | |
| **Status** | Pass |
| **Comments / Defect ID** |  |

### Requirement #3 — Verify search by email

| Field | Value |
|---|---|
| **S.No.** | 9 |
| **Test Case ID** | TST_SLST_TC_5 |
| **Title** | Verify a student is returned when searching by their full email address |
| **Linked Requirement** | #3 — Verify search by email |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as school admin (testt1@mailsac.com) on Thor. School "3 July Test School 1" (key FCN-CHZ-PDA) opened from "My school accounts". Students tab is displayed. |
| **Test Steps** | 1. Type "learner34@mailsac.com" into the search box.<br>2. Click Search. |
| **Test Data** | Email: learner34@mailsac.com |
| **Expected Result** | Exactly one row is listed — "niharika budhiraja" with email learner34@mailsac.com. |
| **Remarks** | Verified live 2026-08-22. |
| **Actual Result** | |
| **Status** | Pass |
| **Comments / Defect ID** |  |

| Field | Value |
|---|---|
| **S.No.** | 10 |
| **Test Case ID** | TST_SLST_TC_6 |
| **Title** | Verify an email typed entirely in upper case still matches the lower-case account |
| **Linked Requirement** | #3 — Verify search by email |
| **Type** | Edge |
| **Priority** | Medium |
| **Preconditions** | Logged in as school admin (testt1@mailsac.com) on Thor. School "3 July Test School 1" (key FCN-CHZ-PDA) opened from "My school accounts". Students tab is displayed. |
| **Test Steps** | 1. Type "LEARNER34@MAILSAC.COM" into the search box.<br>2. Click Search. |
| **Test Data** | Email in upper case: LEARNER34@MAILSAC.COM |
| **Expected Result** | The same single row is returned — matching is case-insensitive. The banner echoes the term exactly as typed, in upper case: "Showing search results for LEARNER34@MAILSAC.COM." |
| **Remarks** | Verified live 2026-08-22. Note the banner does NOT normalise the term's case. |
| **Actual Result** | |
| **Status** | Pass |
| **Comments / Defect ID** |  |

| Field | Value |
|---|---|
| **S.No.** | 11 |
| **Test Case ID** | TST_SLST_TC_7 |
| **Title** | Verify an email containing special characters is matched exactly |
| **Linked Requirement** | #3 — Verify search by email |
| **Type** | Edge |
| **Priority** | Medium |
| **Preconditions** | Logged in as school admin (testt1@mailsac.com) on Thor. School "3 July Test School 1" (key FCN-CHZ-PDA) opened from "My school accounts". Students tab is displayed. |
| **Test Steps** | 1. Type "shivampilot04+Taylor&%^$wift@gmail.com" into the search box.<br>2. Click Search. |
| **Test Data** | Email with + & % ^ $ : shivampilot04+Taylor&%^$wift@gmail.com |
| **Expected Result** | Exactly one row is listed — "Learner Learner". The special characters are neither stripped nor treated as wildcards, and the banner echoes them verbatim. |
| **Remarks** | Verified live 2026-08-22. This account is the special-character fixture on FCN-CHZ-PDA. |
| **Actual Result** | |
| **Status** | Pass |
| **Comments / Defect ID** |  |

### Requirement #4 — Verify search by username

| Field | Value |
|---|---|
| **S.No.** | 12 |
| **Test Case ID** | TST_SLST_TC_8 |
| **Title** | Verify a child account is returned when searching by its username |
| **Linked Requirement** | #4 — Verify search by username |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as school admin (testt1@mailsac.com) on Thor. School "3 July Test School 1" (key FCN-CHZ-PDA) opened from "My school accounts". Students tab is displayed. |
| **Test Steps** | 1. Type "cqatestaichild1" into the search box.<br>2. Click Search. |
| **Test Data** | Username: cqatestaichild1 (child account "child1 test") |
| **Expected Result** | Exactly one row is listed — Last name "test", First name "child1", Email address or Username "cqatestaichild1". The row's accessible name identifies it as a "Child Learner". |
| **Remarks** | Verified live 2026-08-22. The Email/Username column holds the username for username-based accounts. |
| **Actual Result** | |
| **Status** | Pass |
| **Comments / Defect ID** |  |

### Requirement #5 — Verify search with "who activated the code in my school?" checkbox

| Field | Value |
|---|---|
| **S.No.** | 13 |
| **Test Case ID** | TST_SLST_TC_13 |
| **Title** | Verify the "Who activated the code in my school?" checkbox can be toggled and re-queries the list |
| **Linked Requirement** | #5 — Verify search with "who activated the code in my school?" checkbox |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | Logged in as school admin (testt1@mailsac.com) on Thor. School "3 July Test School 1" (key FCN-CHZ-PDA) opened from "My school accounts". Students tab is displayed. |
| **Test Steps** | 1. Note the heading "Students (N)", the number of listed rows and the first row's name.<br>2. Tick the "Who activated the code in my school?" checkbox.<br>3. Wait for the list to settle.<br>4. Observe the area directly beneath the checkbox, and the heading and rows.<br>5. Untick the checkbox and observe again. |
| **Test Data** | - |
| **Expected Result** | The checkbox is a SEARCH-MODE SWITCH, not a list filter. On ticking, two helper lines appear directly beneath the checkbox, verbatim:<br>"This search can take up to 1 minute to complete, please be patient."<br>"A user activation code usually has 16 characters, both letters and numbers."<br>The search box now expects a 16-character activation code instead of a name/email/username. The list itself is UNCHANGED — the heading still reads "Students (N)" with the same N, the same rows are listed in the same order, and "Load more ..." remains available. On unticking, both helper lines are removed from the DOM and the search box reverts to name/email/username matching. |
| **Remarks** | Expected result CORRECTED and verified live on Thor 2026-08-28. The original [ASSUMED] expectation — that ticking filters the list to students who activated a code — was WRONG; the checkbox does not filter at all. The DOM confirms it: the input carries name="activation-code-search" (id="activationCheckbox", qid="aLearner-17"). The identical 26-row result seen on 2026-08-22 was correct behaviour, not a missing filter, so <SCHOOL_WITH_MIXED_ACTIVATION> is NOT required — that note is withdrawn. Fully automatable on FCN-CHZ-PDA; needs no activation code. |
| **Actual Result** | |
| **Status** | Pass |
| **Comments / Defect ID** |  |

| Field | Value |
|---|---|
| **S.No.** | 14 |
| **Test Case ID** | TST_SLST_TC_14 |
| **Title** | Verify searching by a redeemed activation code returns the student who activated it |
| **Linked Requirement** | #5 — Verify search with "who activated the code in my school?" checkbox |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | Logged in as school admin (testt1@mailsac.com) on Thor. School "3 July Test School 1" (key FCN-CHZ-PDA) opened from "My school accounts". Students tab is displayed. |
| **Test Steps** | 1. Tick "Who activated the code in my school?".<br>2. Type a 16-character activation code that has already been redeemed by a known student in this school.<br>3. Click Search (allow up to 1 minute — the helper text warns of this). |
| **Test Data** | &lt;REDEEMED_ACTIVATION_CODE&gt; + the name/email of the student who redeemed it |
| **Expected Result** | The list narrows to the single student who redeemed that code, matching the expected name and email/username. The search banner reads "Students / Showing search results for &lt;code&gt;. / Clear". |
| **Remarks** | Rewritten 2026-08-28. The original scenario — "activation checkbox AND a search term combine as an AND filter" — was based on a misreading of the checkbox; it is a search-MODE switch, so there is no combination to test (see TST_SLST_TC_13). This case now covers the checkbox's actual purpose: searching BY activation code. Still Blocked, but for a different and narrower reason. |
| **Actual Result** | |
| **Status** | Blocked |
| **Comments / Defect ID** | Blocked 2026-08-28 on TEST DATA, not on school fixtures. Needs a 16-character activation code already redeemed by a known student, plus that student's identity. The environment that issues activation codes is down, so no code can be obtained. The earlier block reason — "the checkbox has no observable effect on FCN-CHZ-PDA" — was incorrect and is withdrawn: the checkbox is not a filter, so identical ticked/unticked results were correct behaviour. <SCHOOL_WITH_MIXED_ACTIVATION> is NOT required. Unblocked by: one redeemed activation code + its student. |

### Requirement #6 — Verify sort by last name/first name/username

| Field | Value |
|---|---|
| **S.No.** | 15 |
| **Test Case ID** | TST_SLST_TC_15 |
| **Title** | Verify the list is sorted by First name ascending when the tab first loads |
| **Linked Requirement** | #6 — Verify sort by last name/first name/username |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | Logged in as school admin (testt1@mailsac.com) on Thor. School "3 July Test School 1" (key FCN-CHZ-PDA) opened from "My school accounts". Students tab is displayed. |
| **Test Steps** | 1. Load the Students tab.<br>2. Read the sort indicators on the three column headers.<br>3. Read the First name column top to bottom. |
| **Test Data** | - |
| **Expected Result** | The First name header carries "sorted ascending"; Last name and Email address or Username carry no indicator. The First name values ascend — e.g. Learner, Learner, Marvin Jae, S_learner4, Vandna, child1, latel1, learner0704, niharika, std_… |
| **Remarks** | Verified live 2026-08-22. Note the default sort column is First name even though Last name is the first column shown. |
| **Actual Result** | |
| **Status** | Pass |
| **Comments / Defect ID** |  |

| Field | Value |
|---|---|
| **S.No.** | 16 |
| **Test Case ID** | TST_SLST_TC_16 |
| **Title** | Verify clicking Last name sorts ascending and clicking again sorts descending |
| **Linked Requirement** | #6 — Verify sort by last name/first name/username |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as school admin (testt1@mailsac.com) on Thor. School "3 July Test School 1" (key FCN-CHZ-PDA) opened from "My school accounts". Students tab is displayed. |
| **Test Steps** | 1. Click the "Last name" column header.<br>2. Read the header indicator and the first four Last name values.<br>3. Click "Last name" again.<br>4. Read them again. |
| **Test Data** | - |
| **Expected Result** | After step 1 the header reads "Last name sorted ascending" and the values ascend — Garg, Learner, Perf Test, Perf Test. After step 3 it reads "Last name sorted descending" and the values descend — us, test, student, learner. The indicator is removed from the First name header when Last name takes over. |
| **Remarks** | Verified live 2026-08-22. |
| **Actual Result** | |
| **Status** | Pass |
| **Comments / Defect ID** |  |

| Field | Value |
|---|---|
| **S.No.** | 17 |
| **Test Case ID** | TST_SLST_TC_17 |
| **Title** | Verify clicking Email address or Username sorts the list by that column |
| **Linked Requirement** | #6 — Verify sort by last name/first name/username |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | Logged in as school admin (testt1@mailsac.com) on Thor. School "3 July Test School 1" (key FCN-CHZ-PDA) opened from "My school accounts". Students tab is displayed. |
| **Test Steps** | 1. Click the "Email address or Username" column header.<br>2. Read the first three values in that column.<br>3. Click the header again and read them again. |
| **Test Data** | - |
| **Expected Result** | After step 1 the column ascends — latel1@mailsac.com, learner0704@mailsac.com, learner34@mailsac.com. After step 3 it descends — vandna.garg+11student@comprotechnologies.com, testps27@mailsac.com, std_StdCat_thor1_1720695747388_1_2@yopmail.com. The column's "sorted ascending"/"sorted descending" state is announced. |
| **Remarks** | Verified live 2026-08-22. AUTOMATION NOTE: unlike the other two columns, this column's "sorted …" text is NOT inside the header button element — reading the button's own text returns the bare label. Scope the assertion to the header row, not the button. [verify the exact node during Phase 1] |
| **Actual Result** | |
| **Status** | Pass |
| **Comments / Defect ID** |  |

| Field | Value |
|---|---|
| **S.No.** | 18 |
| **Test Case ID** | TST_SLST_TC_18 |
| **Title** | Verify sorting uses code-point order rather than locale-aware collation |
| **Linked Requirement** | #6 — Verify sort by last name/first name/username |
| **Type** | Edge |
| **Priority** | Medium |
| **Preconditions** | Logged in as school admin (testt1@mailsac.com) on Thor. School "3 July Test School 1" (key FCN-CHZ-PDA) opened from "My school accounts". Students tab is displayed. |
| **Test Steps** | 1. Sort by Last name ascending.<br>2. Read the full ordered column. |
| **Test Data** | - |
| **Expected Result** | Upper-case names sort before lower-case ones — Garg, Learner, Perf Test, S, … then budhiraja, kr, learner, student, test, us. An A-Z expectation that ignores case (localeCompare) will NOT match this product. |
| **Remarks** | **[EXTRA — Phase 1 exclusion]** Not present in the other team's reviewed sheet (`Admin_Gap_Analysis.xlsx`, status "Extra in Ours"). **This case will NOT be automated in Phase 1** — exclude it from the Phase 1 automation scope; revisit for a later phase. Verified live 2026-08-22. Same collation rule already recorded for the Classes tab in admin-shared.md §A4. |
| **Actual Result** | |
| **Status** | Pass |
| **Comments / Defect ID** |  |

| Field | Value |
|---|---|
| **S.No.** | 19 |
| **Test Case ID** | TST_SLST_TC_19 |
| **Title** | Verify the chosen sort is not retained across a page reload |
| **Linked Requirement** | #6 — Verify sort by last name/first name/username |
| **Type** | Edge |
| **Priority** | Low |
| **Preconditions** | Logged in as school admin (testt1@mailsac.com) on Thor. School "3 July Test School 1" (key FCN-CHZ-PDA) opened from "My school accounts". Students tab is displayed. The list has been sorted by Last name descending. |
| **Test Steps** | 1. Reload the page.<br>2. Read the sort indicators. |
| **Test Data** | - |
| **Expected Result** | The list returns to the default First name ascending sort — sorting does NOT persist across a reload. The sort-status indicator returns to `#sortStatus-learner-first_name` reading "sorted ascending". |
| **Remarks** | **[EXTRA — Phase 1 exclusion]** Not present in the other team's reviewed sheet (`Admin_Gap_Analysis.xlsx`, status "Extra in Ours"). **This case will NOT be automated in Phase 1** — exclude it from the Phase 1 automation scope; revisit for a later phase. CONFIRMED live on Thor 2026-08-28 — the [ASSUMED] tag is removed. Sorted by Last name descending, reloaded, and the list came back sorted by First name ascending with the original first row restored. Matches the Classes tab (admin-shared.md §A4). |
| **Actual Result** | |
| **Status** | Pass |
| **Comments / Defect ID** |  |

### Requirement #7 — Verify user guide expand/collapse

| Field | Value |
|---|---|
| **S.No.** | 20 |
| **Test Case ID** | TST_SLST_TC_20 |
| **Title** | Verify the user guide expands and shows the four documented actions |
| **Linked Requirement** | #7 — Verify user guide expand/collapse |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | Logged in as school admin (testt1@mailsac.com) on Thor. School "3 July Test School 1" (key FCN-CHZ-PDA) opened from "My school accounts". Students tab is displayed. |
| **Test Steps** | 1. Click the "User guide" toggle.<br>2. Read the panel. |
| **Test Data** | - |
| **Expected Result** | The panel opens and reads, verbatim: "On this page you can:" followed by "Search for a student who has joined your school in Cambridge One", "View individual students’ profiles and manage their accounts", "Add multiple students to classes", "Activate course materials for students". The toggle’s label changes from "User guide" to "Hide". |
| **Remarks** | Verified live 2026-08-22. Note the apostrophe in “students’” is a right single quotation mark (U+2019), not an ASCII apostrophe. |
| **Actual Result** | |
| **Status** | Pass |
| **Comments / Defect ID** |  |

| Field | Value |
|---|---|
| **S.No.** | 21 |
| **Test Case ID** | TST_SLST_TC_21 |
| **Title** | Verify the user guide collapses and its panel is removed from the page |
| **Linked Requirement** | #7 — Verify user guide expand/collapse |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | Logged in as school admin (testt1@mailsac.com) on Thor. School "3 July Test School 1" (key FCN-CHZ-PDA) opened from "My school accounts". Students tab is displayed. The user guide is expanded. |
| **Test Steps** | 1. Click the "Hide" toggle.<br>2. Confirm the guide text is gone. |
| **Test Data** | - |
| **Expected Result** | The panel closes, the guide text "On this page you can:" is no longer present anywhere on the page, and the toggle label reverts to "User guide". |
| **Remarks** | Verified live 2026-08-22 — the panel is GENUINELY removed from the DOM when collapsed, unlike most admin containers. AUTOMATION NOTE: the toggle also swaps its identifier between the two states (collapsed and expanded are different elements); do not bind a page object to one of them. |
| **Actual Result** | |
| **Status** | Pass |
| **Comments / Defect ID** |  |

### Requirement #16 — Verify load more feature

| Field | Value |
|---|---|
| **S.No.** | 22 |
| **Test Case ID** | TST_SLST_TC_22 |
| **Title** | Verify Load more appends the remaining students to the list |
| **Linked Requirement** | #16 — Verify load more feature |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as school admin (testt1@mailsac.com) on Thor. School "3 July Test School 1" (key FCN-CHZ-PDA) opened from "My school accounts". Students tab is displayed. The school has more than 20 students. |
| **Test Steps** | 1. Count the rows on first load.<br>2. Click "Load more ...".<br>3. Count the rows again. |
| **Test Data** | - |
| **Expected Result** | The first page holds exactly 20 rows. After Load more the list holds every student in the school (26 at the time of capture) and the previously loaded rows are retained, not replaced. |
| **Remarks** | Verified live 2026-08-22. Page size 20 — the same as the Classes tab. Do not assert the absolute total on this shared school; assert "20 before, list length equals the heading count after". |
| **Actual Result** | |
| **Status** | Pass |
| **Comments / Defect ID** |  |

| Field | Value |
|---|---|
| **S.No.** | 23 |
| **Test Case ID** | TST_SLST_TC_23 |
| **Title** | Verify Load more disappears once every student has been loaded |
| **Linked Requirement** | #16 — Verify load more feature |
| **Type** | Edge |
| **Priority** | Medium |
| **Preconditions** | Logged in as school admin (testt1@mailsac.com) on Thor. School "3 July Test School 1" (key FCN-CHZ-PDA) opened from "My school accounts". Students tab is displayed. Load more has been clicked until all students are listed. |
| **Test Steps** | 1. Look for the "Load more ..." link. |
| **Test Data** | - |
| **Expected Result** | The link is REMOVED from the page — it is not left visible in a disabled state. |
| **Remarks** | Verified live 2026-08-22. Automation must assert absence, not disabled-ness. |
| **Actual Result** | |
| **Status** | Pass |
| **Comments / Defect ID** |  |

| Field | Value |
|---|---|
| **S.No.** | 24 |
| **Test Case ID** | TST_SLST_TC_24 |
| **Title** | Verify Load more is not offered when a result set fits on one page |
| **Linked Requirement** | #16 — Verify load more feature |
| **Type** | Edge |
| **Priority** | Low |
| **Preconditions** | Logged in as school admin (testt1@mailsac.com) on Thor. School "3 July Test School 1" (key FCN-CHZ-PDA) opened from "My school accounts". Students tab is displayed. |
| **Test Steps** | 1. Search for "budhiraja" so that a single row is returned.<br>2. Look for the "Load more ..." link. |
| **Test Data** | Search term: budhiraja |
| **Expected Result** | No "Load more ..." link is present. |
| **Remarks** | **[EXTRA — Phase 1 exclusion]** Not present in the other team's reviewed sheet (`Admin_Gap_Analysis.xlsx`, status "Extra in Ours"). **This case will NOT be automated in Phase 1** — exclude it from the Phase 1 automation scope; revisit for a later phase. Verified live 2026-08-22. |
| **Actual Result** | |
| **Status** | Pass |
| **Comments / Defect ID** |  |

### Requirement #23 — Verify count of students increase on adding a new student

| Field | Value |
|---|---|
| **S.No.** | 25 |
| **Test Case ID** | TST_SLST_TC_25 |
| **Title** | Verify the Students heading count increases after a new student is added to the school |
| **Linked Requirement** | #23 — Verify count of students increase on adding a new student |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | Logged in as school admin (testt1@mailsac.com) on Thor. School "3 July Test School 1" (key FCN-CHZ-PDA) opened from "My school accounts". Students tab is displayed. The current "Students (N)" count has been noted. |
| **Test Steps** | 1. Note N from the "Students (N)" heading.<br>2. Add one new student via Manage students > Add new students to classes (see the SBLK cases).<br>3. Return to the Students tab and reload.<br>4. Read the heading. |
| **Test Data** | One new student row, sweepable prefix AutoStudent_ |
| **Expected Result** | [ASSUMED] The heading reads N+1 and the new student appears in the list. |
| **Remarks** | CREATES REAL DATA on a shared school, and the count on FCN-CHZ-PDA is moved by other teams during a session — so a strict N+1 assertion is unsafe here. Prefer asserting that the specific new student is findable by search. Not run 2026-08-22. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** |  |

### Requirement #8 — Verify view profile for a adult learner

| Field | Value |
|---|---|
| **S.No.** | 26 |
| **Test Case ID** | TST_SPRF_TC_1 |
| **Title** | Verify the profile of an adult learner with an email address shows all expected sections |
| **Linked Requirement** | #8 — Verify view profile for a adult learner |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as school admin (testt1@mailsac.com) on Thor. School "3 July Test School 1" (key FCN-CHZ-PDA) opened from "My school accounts". Students tab is displayed. |
| **Test Steps** | 1. Search for "testps27@mailsac.com".<br>2. Open the row’s action menu and click "View student profile".<br>3. Observe the page. |
| **Test Data** | Adult learner: "Learner us", testps27@mailsac.com |
| **Expected Result** | The profile opens at /class/teacher/org_perf_testschool_1/profile/<orgUuid>/<userId>. It shows: a "Back" link; the initials avatar "LU"; the heading "us, Learner" (Last name, First name); the identifier line "testps27@mailsac.com"; "Last login Apr, 2025"; a "Manage account" dropdown; a "Course materials (N)" section grouped by umbrella; and a "Classes (N)" section. |
| **Remarks** | Verified live 2026-08-22. Note the heading format is “Last name, First name”, and for an email-based account the identifier line holds the email. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** |  |

| Field | Value |
|---|---|
| **S.No.** | 27 |
| **Test Case ID** | TST_SPRF_TC_4 |
| **Title** | Verify each course-material component shows its correct activation state and dates |
| **Linked Requirement** | #8 — Verify view profile for a adult learner |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | Logged in as school admin (testt1@mailsac.com) on Thor. School "3 July Test School 1" (key FCN-CHZ-PDA) opened from "My school accounts". Students tab is displayed. The student's View student profile page is open. |
| **Test Steps** | 1. Read the Course materials section for a student whose umbrellas mix activated, unactivated and expired components. |
| **Test Data** | Adult learner "Learner us" (testps27@mailsac.com) — umbrella "testumbrellabundle" holds all three states |
| **Expected Result** | Components are grouped under their umbrella name and each shows exactly one of three states: "Code activated" with "Activated: <date>" and "Expires: <date>"; "Code not activated" with no dates; or "Code expired" with "Activated: <date>" and "Expires: <date>" in the past. |
| **Remarks** | **[EXTRA — Phase 1 exclusion]** Not present in the other team's reviewed sheet (`Admin_Gap_Analysis.xlsx`, status "Extra in Ours"). **This case will NOT be automated in Phase 1** — exclude it from the Phase 1 automation scope; revisit for a later phase. Verified live 2026-08-22. “Code expired” was seen only on this account — a fixture worth keeping. The “(N)” in “Course materials (N)” counts UMBRELLAS, not components. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** |  |

| Field | Value |
|---|---|
| **S.No.** | 28 |
| **Test Case ID** | TST_SPRF_TC_5 |
| **Title** | Verify Back on the profile page returns the admin to the Students tab |
| **Linked Requirement** | #8 — Verify view profile for a adult learner |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | Logged in as school admin (testt1@mailsac.com) on Thor. School "3 July Test School 1" (key FCN-CHZ-PDA) opened from "My school accounts". Students tab is displayed. The student's View student profile page is open. |
| **Test Steps** | 1. Click "Back". |
| **Test Data** | - |
| **Expected Result** | The admin returns to /admin/admin/org_perf_testschool_1/learner with the school context intact. |
| **Remarks** | **[EXTRA — Phase 1 exclusion]** Not present in the other team's reviewed sheet (`Admin_Gap_Analysis.xlsx`, status "Extra in Ours"). **This case will NOT be automated in Phase 1** — exclude it from the Phase 1 automation scope; revisit for a later phase. Verified live 2026-08-22. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** |  |

| Field | Value |
|---|---|
| **S.No.** | 29 |
| **Test Case ID** | TST_SPRF_TC_6 |
| **Title** | Verify a student profile URL can be opened directly as a deep link |
| **Linked Requirement** | #8 — Verify view profile for a adult learner |
| **Type** | Edge |
| **Priority** | Low |
| **Preconditions** | Logged in as school admin. A profile URL has been copied. |
| **Test Steps** | 1. Paste the profile URL into the address bar and load it. |
| **Test Data** | /class/teacher/org_perf_testschool_1/profile/<orgUuid>/<userId> |
| **Expected Result** | The profile page loads normally. This differs from the Classes tab, where deep-linking to /admin/admin/org_<slug>/class returns /dashboard/error unless the school card was clicked first. |
| **Remarks** | **[EXTRA — Phase 1 exclusion]** Not present in the other team's reviewed sheet (`Admin_Gap_Analysis.xlsx`, status "Extra in Ours"). **This case will NOT be automated in Phase 1** — exclude it from the Phase 1 automation scope; revisit for a later phase. Verified live 2026-08-22, within a session where the school context had already been set. [ASSUMED] for a cold session with no prior school selection — worth confirming, since the Classes-tab rule suggests it may fail. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** |  |

| Field | Value |
|---|---|
| **S.No.** | 30 |
| **Test Case ID** | TST_SPRF_TC_7 |
| **Title** | Verify an error is shown to the admin when a student profile cannot be loaded |
| **Linked Requirement** | #8 — Verify view profile for a adult learner |
| **Type** | Negative |
| **Priority** | High |
| **Preconditions** | Logged in as school admin (testt1@mailsac.com) on Thor. School "3 July Test School 1" (key FCN-CHZ-PDA) opened from "My school accounts". Students tab is displayed. |
| **Test Steps** | 1. Search for "vandna.garg+11student@comprotechnologies.com".<br>2. Open the row’s action menu and click "View student profile".<br>3. Wait 60 seconds.<br>4. Open the browser console and the network tab. |
| **Test Data** | Adult learner "Vandna Garg", vandna.garg+11student@comprotechnologies.com |
| **Expected Result** | A readable error should be shown and the admin should be able to recover.<br><br>ACTUAL (defect, observed 2026-08-22): the URL collapses to /class/ and the page shows an INFINITE SPINNER forever with no message and no way back other than the browser. The network log shows GET /class/apigateway/org_perf_testschool_1/getUserDetailWithClasses?...&uuid=<uuid>&extUserId=<id> returning HTTP 500. |
| **Remarks** | **[EXTRA — Phase 1 exclusion]** Not present in the other team's reviewed sheet (`Admin_Gap_Analysis.xlsx`, status "Extra in Ours"). **This case will NOT be automated in Phase 1** — exclude it from the Phase 1 automation scope; revisit for a later phase. DEFECT — raise. Two faults in one: the 500 itself (student-specific: other profiles on the same school load fine) and the missing client-side error handling for it. Evidence: screenshot profile-blank.png + console/network trace, Thor 2026-08-22. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** |  |

### Requirement #9 — Verify view profile for a child/adult with username

| Field | Value |
|---|---|
| **S.No.** | 31 |
| **Test Case ID** | TST_SPRF_TC_2 |
| **Title** | Verify the profile of a child account shows the username as its identifier |
| **Linked Requirement** | #9 — Verify view profile for a child/adult with username |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as school admin (testt1@mailsac.com) on Thor. School "3 July Test School 1" (key FCN-CHZ-PDA) opened from "My school accounts". Students tab is displayed. |
| **Test Steps** | 1. Search for "cqatestaichild1".<br>2. Open the row’s action menu and click "View student profile". |
| **Test Data** | Child account: "child1 test", username cqatestaichild1 |
| **Expected Result** | The profile opens with avatar "CT", heading "test, child1", identifier line "cqatestaichild1" (the username, not an email) and "Last login Aug 21". "Course materials (2)" and "Classes (2)" are listed. |
| **Remarks** | Verified live 2026-08-22. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** |  |

### Requirement #10 — Verify view profile for a adult with username

| Field | Value |
|---|---|
| **S.No.** | 32 |
| **Test Case ID** | TST_SPRF_TC_3 |
| **Title** | Verify the profile of an ADULT account that logs in with a username shows the username as its identifier |
| **Linked Requirement** | #10 — Verify view profile for a adult with username |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | Logged in as school admin (testt1@mailsac.com) on Thor. School "3 July Test School 1" (key FCN-CHZ-PDA) opened from "My school accounts". Students tab is displayed. |
| **Test Steps** | 1. Search for <ADULT_USERNAME_ACCOUNT>.<br>2. Open the row’s action menu and click "View student profile". |
| **Test Data** | <ADULT_USERNAME_ACCOUNT> — an adult account created via “Create adult student accounts” (username + password, no email) |
| **Expected Result** | [ASSUMED] The identifier line under the heading holds the username rather than an email, and the row in the Students list is labelled "Adult Learner" (not "Child Learner"). |
| **Remarks** | BLOCKED at design time — FCN-CHZ-PDA holds 26 students, of which 25 are adults with email addresses and exactly one is a child with a username. There is no adult-with-username account to open. Unblocked by creating one via Manage students > Add new students to classes > Adults > Create adult student accounts (see TST_SBLK_TC_2), or by pointing the case at a school that already has one. |
| **Actual Result** | |
| **Status** | Blocked |
| **Comments / Defect ID** | Blocked at design time. FCN-CHZ-PDA has no adult-with-username account (25 adults with email, 1 child with username). Unblocked by running TST_SBLK_TC_2 to create one, or by targeting a school that already has one. |

### Requirement #11 — Verify Change password: View Profile > Manage account > Edit Account details

| Field | Value |
|---|---|
| **S.No.** | 33 |
| **Test Case ID** | TST_SPRF_TC_8 |
| **Title** | Verify an admin can set a new password for a learner from Manage account |
| **Linked Requirement** | #11 — Verify Change password: View Profile > Manage account > Edit Account details |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as school admin (testt1@mailsac.com) on Thor. School "3 July Test School 1" (key FCN-CHZ-PDA) opened from "My school accounts". Students tab is displayed. The student's View student profile page is open. |
| **Test Steps** | 1. Click "Manage account".<br>2. Click "Edit account details".<br>3. On the "Manage learner profile" page click the "Password" tab.<br>4. Enter a password that meets the complexity rules into "New password".<br>5. Submit. |
| **Test Data** | <VALID_COMPLEX_PASSWORD> |
| **Expected Result** | The "Change learner password" screen is shown with a single "New password" field. On submit the password is accepted and a success confirmation is shown. [ASSUMED — the success path was deliberately not executed; see Remarks.] |
| **Remarks** | MUTATES A REAL SHARED ACCOUNT. Not executed during design (2026-08-22): changing a shared school’s student password would break other teams’ logins. The screen, its heading and its single field were captured live; only the success copy is [ASSUMED]. NOTE: the tab is a Gigya/SAP CDC hosted screen-set and clicking it appends a one-time ?pwrt=<token>&apiKey=<key> to the URL — never record a captured token in test data. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** |  |

| Field | Value |
|---|---|
| **S.No.** | 34 |
| **Test Case ID** | TST_SPRF_TC_9 |
| **Title** | Verify a password that fails the complexity rules is rejected with a clear message |
| **Linked Requirement** | #11 — Verify Change password: View Profile > Manage account > Edit Account details |
| **Type** | Negative |
| **Priority** | High |
| **Preconditions** | Logged in as school admin (testt1@mailsac.com) on Thor. School "3 July Test School 1" (key FCN-CHZ-PDA) opened from "My school accounts". Students tab is displayed. The student's View student profile page is open. The "Change learner password" screen is open. |
| **Test Steps** | 1. Enter "abc" into "New password".<br>2. Submit. |
| **Test Data** | Weak password: abc |
| **Expected Result** | The password is NOT changed and the inline error reads, verbatim: "Password does not meet complexity requirements". |
| **Remarks** | Verified live 2026-08-22 — safe to run, the rejection is client-side and changes nothing. The message does not state WHAT the rules are, which is worth raising as a usability observation. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** |  |

### Requirement #12 — Verify update personal info of user: View Profile > Manage account > Edit account details

| Field | Value |
|---|---|
| **S.No.** | 35 |
| **Test Case ID** | TST_SPRF_TC_10 |
| **Title** | Verify an admin can update a learner's first and last name |
| **Linked Requirement** | #12 — Verify update personal info of user: View Profile > Manage account > Edit account details |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as school admin (testt1@mailsac.com) on Thor. School "3 July Test School 1" (key FCN-CHZ-PDA) opened from "My school accounts". Students tab is displayed. The student's View student profile page is open. |
| **Test Steps** | 1. Click "Manage account" > "Edit account details".<br>2. Confirm the "Personal info" tab is selected.<br>3. Change the First name and Last name values.<br>4. Click "Update".<br>5. Return to the profile and to the Students list. |
| **Test Data** | First name: <NEW_FIRST_NAME>, Last name: <NEW_LAST_NAME> |
| **Expected Result** | The "Manage learner profile" page is shown at /admin/admin/org_<slug>/edit-user-profile/<orgUuid>/<userId> with tabs "Personal info" and "Password". After Update the new names are reflected on the profile heading and in the Students list row. [ASSUMED — Update was not clicked; see Remarks.] |
| **Remarks** | MUTATES A REAL SHARED ACCOUNT — not executed during design (2026-08-22). The page, its tabs, its four fields and their editability were all captured live; only the post-Update result is [ASSUMED]. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** |  |

| Field | Value |
|---|---|
| **S.No.** | 36 |
| **Test Case ID** | TST_SPRF_TC_11 |
| **Title** | Verify Username and Location are shown but cannot be edited |
| **Linked Requirement** | #12 — Verify update personal info of user: View Profile > Manage account > Edit account details |
| **Type** | Edge |
| **Priority** | Medium |
| **Preconditions** | Logged in as school admin (testt1@mailsac.com) on Thor. School "3 July Test School 1" (key FCN-CHZ-PDA) opened from "My school accounts". Students tab is displayed. The student's View student profile page is open. The "Personal info" tab of "Manage learner profile" is open. |
| **Test Steps** | 1. Try to place the cursor in the Username field.<br>2. Try to place the cursor in the Location field. |
| **Test Data** | - |
| **Expected Result** | Both fields are disabled and reject input. First name and Last name are editable and required; Username and Location are not. |
| **Remarks** | Verified live 2026-08-22 on the child account: firstName and lastName are required and editable; username and country are disabled. On that account the disabled Location field held the literal string "undefined" rather than a country or a blank — worth raising separately as a display defect. Neither name field carries a maxlength attribute, so any length limit is server-side and unknown; do not write a boundary case until it is measured. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** |  |

| Field | Value |
|---|---|
| **S.No.** | 37 |
| **Test Case ID** | TST_SPRF_TC_13 |
| **Title** | Verify leaving the form with unsaved changes raises a confirmation |
| **Linked Requirement** | #12 — Verify update personal info of user: View Profile > Manage account > Edit account details |
| **Type** | Edge |
| **Priority** | Medium |
| **Preconditions** | Logged in as school admin (testt1@mailsac.com) on Thor. School "3 July Test School 1" (key FCN-CHZ-PDA) opened from "My school accounts". Students tab is displayed. The student's View student profile page is open. The "Personal info" tab is open. |
| **Test Steps** | 1. Change the First name value.<br>2. Click "Cancel" (or navigate away). |
| **Test Data** | Any changed value |
| **Expected Result** | A confirmation dialog is raised reading, verbatim: "Save changes?" / "Changes will be lost if you don’t save them" with "Cancel" and "Yes" buttons. |
| **Remarks** | **[EXTRA — Phase 1 exclusion]** Not present in the other team's reviewed sheet (`Admin_Gap_Analysis.xlsx`, status "Extra in Ours"). **This case will NOT be automated in Phase 1** — exclude it from the Phase 1 automation scope; revisit for a later phase. Copy captured free from the pre-rendered DOM 2026-08-22 (admin-shared.md §A6 trick) — the dialog was never triggered, but its text is verified. Which of Cancel/Yes discards versus saves is [ASSUMED] and must be confirmed. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** |  |

| Field | Value |
|---|---|
| **S.No.** | 38 |
| **Test Case ID** | TST_SPRF_TC_12 |
| **Title** | Verify a required name field cannot be saved empty |
| **Linked Requirement** | #12 — Verify update personal info of user: View Profile > Manage account > Edit account details |
| **Type** | Negative |
| **Priority** | Medium |
| **Preconditions** | Logged in as school admin (testt1@mailsac.com) on Thor. School "3 July Test School 1" (key FCN-CHZ-PDA) opened from "My school accounts". Students tab is displayed. The student's View student profile page is open. The "Personal info" tab is open. |
| **Test Steps** | 1. Clear the First name field.<br>2. Click "Update". |
| **Test Data** | First name: (empty) |
| **Expected Result** | [ASSUMED] The update is refused and a required-field validation message is shown against First name. |
| **Remarks** | The field carries the HTML required attribute (captured live 2026-08-22) but the message text was not triggered. Capture the verbatim copy during Phase 1. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** |  |

### Requirement #13 — Verify Activate course material for individual learner

| Field | Value |
|---|---|
| **S.No.** | 39 |
| **Test Case ID** | TST_SPRF_TC_14 |
| **Title** | Verify an admin can activate course material for one individual learner |
| **Linked Requirement** | #13 — Verify Activate course material for individual learner |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as school admin (testt1@mailsac.com) on Thor. School "3 July Test School 1" (key FCN-CHZ-PDA) opened from "My school accounts". Students tab is displayed. |
| **Test Steps** | 1. Open a student row’s action menu.<br>2. Click "Activate course materials".<br>3. Enter a valid, unused 16-character activation code.<br>4. Click "Activate".<br>5. Open the student’s profile. |
| **Test Data** | <VALID_UNUSED_ACTIVATION_CODE> in the format AB2C-DE3F-G4HJ-K5LM |
| **Expected Result** | The page /dashboard/teacher/org_<slug>/activateMaterial/<userId>/admin opens, headed "Activate an access code", naming the target student and their email. After Activate the code is consumed and the new component appears on the student’s profile as "Code activated" with an Activated and an Expires date. [ASSUMED — no valid spare code was available; see Remarks.] |
| **Remarks** | CONSUMES A REAL ACTIVATION CODE (“You can only use each code once”, per the page’s own copy). The screen was captured live 2026-08-22; only the success path is [ASSUMED]. The row action menu holds exactly two items: “View student profile” and “Activate course materials”. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** |  |

| Field | Value |
|---|---|
| **S.No.** | 40 |
| **Test Case ID** | TST_SPRF_TC_15 |
| **Title** | Verify Activate stays disabled until an activation code is entered |
| **Linked Requirement** | #13 — Verify Activate course material for individual learner |
| **Type** | Edge |
| **Priority** | Medium |
| **Preconditions** | The "Activate an access code" page is open for a student. |
| **Test Steps** | 1. Observe the Activate button with the code field empty.<br>2. Type any value into the code field.<br>3. Observe the button again. |
| **Test Data** | - |
| **Expected Result** | With the field empty the "Activate" button is disabled. Once the field has content it becomes enabled. The field shows the placeholder "Example: AB2C-DE3F-G4HJ-K5LM". |
| **Remarks** | Verified live 2026-08-22 — the button is natively disabled, not disabled by CSS class only, so a native disabled assertion is valid here. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** |  |

| Field | Value |
|---|---|
| **S.No.** | 41 |
| **Test Case ID** | TST_SPRF_TC_16 |
| **Title** | Verify an unusable activation code is rejected with an on-screen error |
| **Linked Requirement** | #13 — Verify Activate course material for individual learner |
| **Type** | Negative |
| **Priority** | High |
| **Preconditions** | The "Activate an access code" page is open for a student. |
| **Test Steps** | 1. Enter "ZZZZ-ZZZZ-ZZZZ-ZZZZ".<br>2. Click "Activate".<br>3. Wait for the response. |
| **Test Data** | Unusable code: ZZZZ-ZZZZ-ZZZZ-ZZZZ |
| **Expected Result** | The code is not activated and an inline error is shown beneath the field reading, verbatim: "Sorry, something went wrong at our end and we couldn’t activate your code. Please try again later" |
| **Remarks** | Verified live 2026-08-22 (screenshot activate-invalid-code.png). OBSERVATION worth raising: this is a server-fault message shown for what is a user-input problem — an invalid code should say the code is invalid, not that something went wrong at Cambridge’s end. While the request is in flight the page also renders the untranslated key "SCREEN_READER.PROCESSING_MESSAGE" (see TST_SBLK_TC_10 for the same class of defect). |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** |  |

### Requirement #14 — Verify launch class from view profile page

| Field | Value |
|---|---|
| **S.No.** | 42 |
| **Test Case ID** | TST_SPRF_TC_17 |
| **Title** | Verify a class can be launched from the student's profile page |
| **Linked Requirement** | #14 — Verify launch class from view profile page |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as school admin (testt1@mailsac.com) on Thor. School "3 July Test School 1" (key FCN-CHZ-PDA) opened from "My school accounts". Students tab is displayed. The student's View student profile page is open. The student belongs to at least one class. |
| **Test Steps** | 1. Scroll to the "Classes (N)" section.<br>2. Click a class name. |
| **Test Data** | Child account cqatestaichild1, class "sample class" (key 2D3A-T2kF) |
| **Expected Result** | The class page opens at /class/teacher/org_<slug>/class/<classUuid>/view/classdata and the browser tab title becomes the class name. |
| **Remarks** | Verified live 2026-08-22. Each class entry also shows its date range, “Date joined:”, “Class key:” and its course-material state (e.g. “No course material added”). |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** |  |

### Requirement #15 — Verify umbrella details page launch from view profile page (click on umbrella name) - clicking Back should return to previous page

| Field | Value |
|---|---|
| **S.No.** | 43 |
| **Test Case ID** | TST_SPRF_TC_18 |
| **Title** | Verify an umbrella details page can be opened by clicking the umbrella name on a profile |
| **Linked Requirement** | #15 — Verify umbrella details page launch from view profile page (click on umbrella name) - clicking Back should return to previous page |
| **Type** | Negative |
| **Priority** | High |
| **Preconditions** | Logged in as school admin (testt1@mailsac.com) on Thor. School "3 July Test School 1" (key FCN-CHZ-PDA) opened from "My school accounts". Students tab is displayed. The student's View student profile page is open. The student has at least one umbrella under Course materials. |
| **Test Steps** | 1. Scroll to the Course materials section.<br>2. Click the umbrella name.<br>3. If a details page opens, click Back. |
| **Test Data** | Child account cqatestaichild1 (umbrellas "R55 Multi Component Umbrella", "cqa_umbrella_aman19") and adult "Learner us" (umbrella "testumbrellabundle") |
| **Expected Result** | The umbrella details page should open, and Back should return to the profile page.<br><br>ACTUAL (observed 2026-08-22): the umbrella name IS NOT CLICKABLE. It renders as a plain text span with no link or button anywhere in its ancestry, on BOTH a child profile and an adult profile. There is no route from the profile to an umbrella details page by this path, so the scenario as written cannot be performed. |
| **Remarks** | Raise with the product owner before automating: either the link is missing (defect) or the scenario describes a route that does not exist on this screen (scenario error). Checked on two profiles of different account types. This is the same class of mistake as the historic “click a listed class” cases — grounded live rather than assumed. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** |  |

### Requirement #22 — Verify remove from school account: View Profile > Manage account

| Field | Value |
|---|---|
| **S.No.** | 44 |
| **Test Case ID** | TST_SPRF_TC_19 |
| **Title** | Verify removing a student from the school account raises a confirmation and reports asynchronously |
| **Linked Requirement** | #22 — Verify remove from school account: View Profile > Manage account |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as school admin (testt1@mailsac.com) on Thor. School "3 July Test School 1" (key FCN-CHZ-PDA) opened from "My school accounts". Students tab is displayed. |
| **Test Steps** | 1. Tick the checkbox on one student row (or open the student’s profile and choose Manage account > "Remove from school account").<br>2. Click "Remove from school account".<br>3. Read the confirmation dialog.<br>4. Tick the confirmation checkbox and click "Request to remove".<br>5. Read the follow-up dialog. |
| **Test Data** | <DISPOSABLE_STUDENT> — a student created by this test run, never a pre-existing one |
| **Expected Result** | Step 3 shows a dialog whose checkbox label reads, verbatim: "I confirm that I want to remove students from my school account", with "Cancel" and "Request to remove" buttons. Step 5 shows: "Removing students may take some time" / "We are currently removing N student accounts. You will receive an email report once the accounts have been removed." with "Go back to manage more students". [ASSUMED that the student then leaves the list — the removal was not executed.] |
| **Remarks** | DESTRUCTIVE and asynchronous, reported by email rather than in-app. All dialog copy was captured free from the pre-rendered DOM 2026-08-22 without triggering anything (admin-shared.md §A6). Never run against a pre-existing student on this shared school. Removal is also reachable from the profile via Manage account. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** |  |

| Field | Value |
|---|---|
| **S.No.** | 45 |
| **Test Case ID** | TST_SPRF_TC_20 |
| **Title** | Verify selecting more than 50 students blocks the removal with a limit message |
| **Linked Requirement** | #22 — Verify remove from school account: View Profile > Manage account |
| **Type** | Edge |
| **Priority** | Medium |
| **Preconditions** | Logged in as school admin (testt1@mailsac.com) on Thor. School "3 July Test School 1" (key FCN-CHZ-PDA) opened from "My school accounts". Students tab is displayed. The school holds more than 50 students. |
| **Test Steps** | 1. Select 51 or more students.<br>2. Click "Remove from school account". |
| **Test Data** | 51+ selected students |
| **Expected Result** | The removal is refused and a dialog reads, verbatim: "You can only remove 50 students at one time" / "Please uncheck some students to continue", with a single "Close" action. |
| **Remarks** | **[EXTRA — Phase 1 exclusion]** Not present in the other team's reviewed sheet (`Admin_Gap_Analysis.xlsx`, status "Extra in Ours"). **This case will NOT be automated in Phase 1** — exclude it from the Phase 1 automation scope; revisit for a later phase. BLOCKED at design time on FCN-CHZ-PDA — the school holds 26 students, so 51 cannot be selected. The modal copy is nevertheless verified word for word from the pre-rendered DOM (2026-08-22), so this case is short work once a school with 51+ students exists. Unblocked by <SCHOOL_WITH_51_PLUS_STUDENTS>. |
| **Actual Result** | |
| **Status** | Blocked |
| **Comments / Defect ID** | Blocked at design time. The 50-student removal cap needs 51+ students selected; FCN-CHZ-PDA holds 26. Modal copy is already verified word for word from the pre-rendered DOM, so this is short work once a larger school exists. |

| Field | Value |
|---|---|
| **S.No.** | 46 |
| **Test Case ID** | TST_SPRF_TC_21 |
| **Title** | Verify Remove from school account is disabled while no student is selected |
| **Linked Requirement** | #22 — Verify remove from school account: View Profile > Manage account |
| **Type** | Edge |
| **Priority** | Low |
| **Preconditions** | Logged in as school admin (testt1@mailsac.com) on Thor. School "3 July Test School 1" (key FCN-CHZ-PDA) opened from "My school accounts". Students tab is displayed. |
| **Test Steps** | 1. With no rows ticked, read the "0 Selected" label and the Remove button. |
| **Test Data** | - |
| **Expected Result** | The counter reads "0 Selected" and the "Remove from school account" button is disabled. |
| **Remarks** | **[EXTRA — Phase 1 exclusion]** Not present in the other team's reviewed sheet (`Admin_Gap_Analysis.xlsx`, status "Extra in Ours"). **This case will NOT be automated in Phase 1** — exclude it from the Phase 1 automation scope; revisit for a later phase. Verified live 2026-08-22 — natively disabled. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** |  |

| Field | Value |
|---|---|
| **S.No.** | 47 |
| **Test Case ID** | TST_SPRF_TC_22 |
| **Title** | Verify cancelling the removal confirmation leaves the student in the school |
| **Linked Requirement** | #22 — Verify remove from school account: View Profile > Manage account |
| **Type** | Negative |
| **Priority** | Medium |
| **Preconditions** | Logged in as school admin (testt1@mailsac.com) on Thor. School "3 July Test School 1" (key FCN-CHZ-PDA) opened from "My school accounts". Students tab is displayed. One student is selected and the confirmation dialog is open. |
| **Test Steps** | 1. Click "Cancel".<br>2. Reload the Students tab and search for the student. |
| **Test Data** | <DISPOSABLE_STUDENT> |
| **Expected Result** | [ASSUMED] The dialog closes, nothing is submitted, and the student is still listed. |
| **Remarks** | Not run 2026-08-22 (would require opening a destructive dialog against a real shared account). Also confirm whether the row selection survives the cancel. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** |  |

### Requirement #17 — Verify Bulk feature > Add new students to classes children

| Field | Value |
|---|---|
| **S.No.** | 48 |
| **Test Case ID** | TST_SBLK_TC_1 |
| **Title** | Verify new CHILD student accounts can be added to classes in bulk |
| **Linked Requirement** | #17 — Verify Bulk feature > Add new students to classes children |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as school admin (testt1@mailsac.com) on Thor. School "3 July Test School 1" (key FCN-CHZ-PDA) opened from "My school accounts". Students tab is displayed. At least one class already exists in the school. |
| **Test Steps** | 1. Click "Manage students" > "Add new students to classes".<br>2. On the chooser select "Children" and click "Next".<br>3. Download the CSV template, populate it and upload it.<br>4. Complete the form and submit. |
| **Test Data** | Child CSV in the real template format — headers as documented for the child page in product-knowledge/ExperienceApp.md (Student’s First name, Student’s Last name, …). File: TST_SBLK_TC_1_children.csv |
| **Expected Result** | The chooser page /admin/admin/org_<slug>/learner/select/new is shown, headed with the Children and Adults options and carrying the notice "Important: Classes must be created before setting up student accounts". Choosing Children and Next opens the child bulk-creation form; the CSV populates it; submitting creates the accounts. [ASSUMED beyond the chooser — see Remarks.] |
| **Remarks** | CREATES REAL DATA. Grounded live only as far as the chooser (2026-08-22). The downstream child CSV page is already documented from the NEMO-24306 work in product-knowledge/ExperienceApp.md — reuse that knowledge and its verified validation messages rather than re-deriving them. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** |  |

| Field | Value |
|---|---|
| **S.No.** | 49 |
| **Test Case ID** | TST_SBLK_TC_6 |
| **Title** | Verify the account-type chooser cannot be advanced without a selection |
| **Linked Requirement** | #17 — Verify Bulk feature > Add new students to classes children |
| **Type** | Edge |
| **Priority** | Low |
| **Preconditions** | Logged in as school admin (testt1@mailsac.com) on Thor. School "3 July Test School 1" (key FCN-CHZ-PDA) opened from "My school accounts". Students tab is displayed. |
| **Test Steps** | 1. Click "Manage students" > "Add new students to classes".<br>2. Without selecting Children or Adults, click "Next". |
| **Test Data** | - |
| **Expected Result** | [ASSUMED] Next is disabled, or clicking it surfaces a “choose an option” prompt, and the admin stays on the chooser. |
| **Remarks** | Not run 2026-08-22 — the radio state on first load was not recorded. Confirm during Phase 1; the same case applies to both downstream choosers. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** |  |

### Requirement #18 — Verify Bulk feature > Add new students to classes adult with username

| Field | Value |
|---|---|
| **S.No.** | 50 |
| **Test Case ID** | TST_SBLK_TC_2 |
| **Title** | Verify new ADULT accounts that log in with a username can be created in bulk |
| **Linked Requirement** | #18 — Verify Bulk feature > Add new students to classes adult with username |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as school admin (testt1@mailsac.com) on Thor. School "3 July Test School 1" (key FCN-CHZ-PDA) opened from "My school accounts". Students tab is displayed. At least one class already exists in the school. |
| **Test Steps** | 1. Click "Manage students" > "Add new students to classes".<br>2. Select "Adults" and click "Next".<br>3. On the second chooser select "Create adult student accounts" and click "Next".<br>4. Populate and upload the CSV, then submit. |
| **Test Data** | Adult CSV in the real template format. File: TST_SBLK_TC_2_adults_username.csv |
| **Expected Result** | The Adults branch opens a SECOND chooser at /admin/admin/org_<slug>/learner/adult-select/new, headed "Create accounts or invite students", offering "Create adult student accounts" ("Students will be provided with a username and password to log in") and "Invite adult students by email". Choosing the first opens the adult bulk-creation form and submitting creates username-based adult accounts. [ASSUMED beyond the chooser.] |
| **Remarks** | CREATES REAL DATA. The two-step chooser was captured live 2026-08-22 — this is the branch that distinguishes source scenarios #18 and #19. Running this case is also what unblocks TST_SPRF_TC_3. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** |  |

### Requirement #19 — Verify Bulk feature > Add new students to classes adult/teacher (email)

| Field | Value |
|---|---|
| **S.No.** | 51 |
| **Test Case ID** | TST_SBLK_TC_3 |
| **Title** | Verify new adult students can be invited to classes by email in bulk |
| **Linked Requirement** | #19 — Verify Bulk feature > Add new students to classes adult/teacher (email) |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as school admin (testt1@mailsac.com) on Thor. School "3 July Test School 1" (key FCN-CHZ-PDA) opened from "My school accounts". Students tab is displayed. At least one class already exists in the school. |
| **Test Steps** | 1. Click "Manage students" > "Add new students to classes".<br>2. Select "Adults" > "Next".<br>3. Select "Invite adult students by email" > "Next".<br>4. Populate and upload the CSV, then submit. |
| **Test Data** | Adult invitation CSV in the real template format. File: TST_SBLK_TC_3_adults_email.csv |
| **Expected Result** | The option is described as "Students will receive an email invitation to create their account and join the class. They can sign up and log in with their email address or social media account and reset their own password." Submitting sends invitations rather than creating live accounts. [ASSUMED beyond the chooser.] |
| **Remarks** | SENDS REAL EMAIL. Use mailsac/yopmail addresses only. Chooser copy verified live 2026-08-22. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** |  |

### Requirement #20 — Verify Bulk feature > Add existing students to classes adult/teacher (email)

| Field | Value |
|---|---|
| **S.No.** | 52 |
| **Test Case ID** | TST_SBLK_TC_4 |
| **Title** | Verify EXISTING students can be added to classes by username in bulk |
| **Linked Requirement** | #20 — Verify Bulk feature > Add existing students to classes adult/teacher (email) |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as school admin (testt1@mailsac.com) on Thor. School "3 July Test School 1" (key FCN-CHZ-PDA) opened from "My school accounts". Students tab is displayed. At least one class exists and the students already have accounts. |
| **Test Steps** | 1. Click "Manage students" > "Add existing students to classes".<br>2. On the chooser select "Add students by username" and click "Next".<br>3. Populate and upload the CSV, then submit. |
| **Test Data** | Existing-student CSV keyed by username. File: TST_SBLK_TC_4_existing_username.csv |
| **Expected Result** | The chooser page /admin/admin/org_<slug>/learner/select/existing is shown, headed "Add students by username or email?" and carrying "Important: Classes must be created before adding existing students". "Add students by username" is described as "Students will be added through their existing usernames." Submitting adds them to the chosen class without creating new accounts. [ASSUMED beyond the chooser.] |
| **Remarks** | MODIFIES REAL CLASS MEMBERSHIP. Chooser captured live 2026-08-22. AUTOMATION NOTE: this chooser reuses the SAME element identifiers as the adult new-account chooser in TST_SBLK_TC_2 — identify the screen by its URL or heading, never by the control ids alone. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** |  |

| Field | Value |
|---|---|
| **S.No.** | 53 |
| **Test Case ID** | TST_SBLK_TC_5 |
| **Title** | Verify existing students can be invited to classes by email in bulk |
| **Linked Requirement** | #20 — Verify Bulk feature > Add existing students to classes adult/teacher (email) |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | Logged in as school admin (testt1@mailsac.com) on Thor. School "3 July Test School 1" (key FCN-CHZ-PDA) opened from "My school accounts". Students tab is displayed. At least one class exists. |
| **Test Steps** | 1. Click "Manage students" > "Add existing students to classes".<br>2. Select "Invite students by email" and click "Next".<br>3. Populate and upload the CSV, then submit. |
| **Test Data** | Existing-student CSV keyed by email. File: TST_SBLK_TC_5_existing_email.csv |
| **Expected Result** | The option is described as "Students will receive an email invitation to join the class. They can sign up and log in with their email address or social media account." Submitting sends invitations. [ASSUMED beyond the chooser.] |
| **Remarks** | SENDS REAL EMAIL. Chooser copy verified live 2026-08-22. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** |  |

### Requirement #21 — Verify Bulk feature > Activate course material

| Field | Value |
|---|---|
| **S.No.** | 54 |
| **Test Case ID** | TST_SBLK_TC_7 |
| **Title** | Verify the bulk activation page loads with its entry grid and CSV controls |
| **Linked Requirement** | #21 — Verify Bulk feature > Activate course material |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as school admin (testt1@mailsac.com) on Thor. School "3 July Test School 1" (key FCN-CHZ-PDA) opened from "My school accounts". Students tab is displayed. |
| **Test Steps** | 1. Click "Manage students" > "Activate course materials".<br>2. Observe the page. |
| **Test Data** | - |
| **Expected Result** | The page /admin/admin/org_<slug>/bulk_activation opens, headed "Activate codes for students in your school" above the school name "3 July Test School 1". It offers "Upload file", "Get CSV template", a "How to use this form" help toggle, a "0 Selected" counter with "Remove", one empty entry row with the columns Email or Username / First name / Last name / Activation code (placeholder "for example ABC4-DE3F-G2HJ-1KLM"), and a disabled "Activate 1 code" button. |
| **Remarks** | Verified live 2026-08-22 (screenshot bulk-activation-i18n-key.png). The button label counts the rows, so it changes as rows are added. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** |  |

| Field | Value |
|---|---|
| **S.No.** | 55 |
| **Test Case ID** | TST_SBLK_TC_11 |
| **Title** | Verify uploading a CSV populates the bulk activation grid |
| **Linked Requirement** | #21 — Verify Bulk feature > Activate course material |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | The bulk activation page is open. |
| **Test Steps** | 1. Click "Get CSV template" and save the template.<br>2. Populate it with student identifiers and activation codes.<br>3. Click "Upload file" and choose the populated file.<br>4. Observe the grid. |
| **Test Data** | TST_SBLK_TC_11_bulk_activation.csv — in the exact downloaded template format |
| **Expected Result** | [ASSUMED] The grid is populated with one row per CSV record and the Activate button label updates to the row count. A progress dialog reading "Please wait, this may take a few minutes" with "Cancel upload" is shown during the upload. |
| **Remarks** | The progress dialog copy is verified from the pre-rendered DOM (2026-08-22); the upload itself was not run and the template headers were NOT downloaded, so the CSV fixture cannot be written until they are. If bulk activation behaves like the class bulk upload, uploading only POPULATES the form and “Activate N codes” remains the only gate — which would make this case side-effect free. Confirm that before placing it in a suite. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** |  |

| Field | Value |
|---|---|
| **S.No.** | 56 |
| **Test Case ID** | TST_SBLK_TC_8 |
| **Title** | Verify the Activate button stays disabled until a row is complete |
| **Linked Requirement** | #21 — Verify Bulk feature > Activate course material |
| **Type** | Edge |
| **Priority** | Medium |
| **Preconditions** | The bulk activation page is open with one empty row. |
| **Test Steps** | 1. Observe "Activate 1 code" with the row empty.<br>2. Fill only the Activation code and observe again.<br>3. Fill every column of the row and observe again. |
| **Test Data** | One partial row, then one complete row |
| **Expected Result** | [ASSUMED] The button is disabled until at least one row carries both an identified student and a code, and enabled once a row is complete. |
| **Remarks** | Only the empty-row disabled state was verified live 2026-08-22; the enabling threshold was not exercised. Confirm during Phase 1. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** |  |

| Field | Value |
|---|---|
| **S.No.** | 57 |
| **Test Case ID** | TST_SBLK_TC_9 |
| **Title** | Verify the bulk-activation success dialog shows real text and not raw translation keys |
| **Linked Requirement** | #21 — Verify Bulk feature > Activate course material |
| **Type** | Negative |
| **Priority** | High |
| **Preconditions** | A bulk activation has been submitted successfully. |
| **Test Steps** | 1. Complete at least one valid row on the bulk activation page.<br>2. Click "Activate N codes".<br>3. Read the success dialog. |
| **Test Data** | <VALID_UNUSED_ACTIVATION_CODE> |
| **Expected Result** | The dialog should explain what happened in plain English.<br><br>ACTUAL (defect, observed 2026-08-22): the dialog body renders three RAW UNTRANSLATED KEYS instead of text — "ADMIN.LEARNER.BULK_ACTIVATION.SUCCESS_MODAL_INFO_1", "...SUCCESS_MODAL_INFO_2" and "...SUCCESS_MODAL_INFO_3" — above a "Back to dashboard" button. |
| **Remarks** | **[EXTRA — Phase 1 exclusion]** Not present in the other team's reviewed sheet (`Admin_Gap_Analysis.xlsx`, status "Extra in Ours"). **This case will NOT be automated in Phase 1** — exclude it from the Phase 1 automation scope; revisit for a later phase. DEFECT — raise. Captured WITHOUT running a bulk activation, by reading the pre-rendered dialog in the DOM (admin-shared.md §A6). This is a user-visible failure waiting for the first successful bulk activation. The same page also holds "An unexpected error occured." (sic — “occured”) in its Form-not-uploaded dialog. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** |  |

| Field | Value |
|---|---|
| **S.No.** | 58 |
| **Test Case ID** | TST_SBLK_TC_10 |
| **Title** | Verify the bulk-activation row checkbox exposes a real accessible label |
| **Linked Requirement** | #21 — Verify Bulk feature > Activate course material |
| **Type** | Negative |
| **Priority** | Medium |
| **Preconditions** | The bulk activation page is open. |
| **Test Steps** | 1. Inspect the accessible name of the entry row's select checkbox (screen reader, or the sr-only label in the markup). |
| **Test Data** | - |
| **Expected Result** | The checkbox should announce something meaningful such as “Select student row”.<br><br>ACTUAL (defect, observed 2026-08-22): the screen-reader-only label contains the raw key "ADMIN.LEARNER.BULK_ACTIVATION.SELECT_STUDENT", so a screen-reader user hears the translation key. The key is not visible on screen, which is why it has gone unnoticed. |
| **Remarks** | **[EXTRA — Phase 1 exclusion]** Not present in the other team's reviewed sheet (`Admin_Gap_Analysis.xlsx`, status "Extra in Ours"). **This case will NOT be automated in Phase 1** — exclude it from the Phase 1 automation scope; revisit for a later phase. DEFECT (accessibility) — raise alongside TST_SBLK_TC_9; same missing translation bundle. A third instance, "SCREEN_READER.PROCESSING_MESSAGE", appears on the individual activation page (TST_SPRF_TC_16), so this looks like one systemic gap rather than three separate typos. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** |  |

| Field | Value |
|---|---|
| **S.No.** | 59 |
| **Test Case ID** | TST_SBLK_TC_12 |
| **Title** | Verify a CSV that cannot be processed is rejected with a clear message |
| **Linked Requirement** | #21 — Verify Bulk feature > Activate course material |
| **Type** | Negative |
| **Priority** | Medium |
| **Preconditions** | The bulk activation page is open. |
| **Test Steps** | 1. Click "Upload file" and choose a malformed or oversized CSV.<br>2. Read the dialog. |
| **Test Data** | TST_SBLK_TC_12_malformed.csv |
| **Expected Result** | The upload is refused and a dialog headed "Sorry, your file could not be uploaded" is shown, ending "If that doesn’t work, email our Customer Services team at ptsupport@cambridge.org". [ASSUMED for the specific reason line, which is populated per failure type.] |
| **Remarks** | **[EXTRA — Phase 1 exclusion]** Not present in the other team's reviewed sheet (`Admin_Gap_Analysis.xlsx`, status "Extra in Ours"). **This case will NOT be automated in Phase 1** — exclude it from the Phase 1 automation scope; revisit for a later phase. Dialog shell captured from the pre-rendered DOM 2026-08-22. The equivalent dialog on the adult CSV page enforces a 200-record maximum with its own wording (see product-knowledge/ExperienceApp.md); whether bulk activation shares that limit is unknown. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** |  |

---

| Field | Value |
|---|---|
| **S.No.** | 60 |
| **Test Case ID** | TST_SLST_TC_26 |
| **Title** | Verify a student whose name contains special characters is returned by a name search |
| **Linked Requirement** | #1 — Verify search by first name |
| **Type** | Edge |
| **Priority** | Medium |
| **Preconditions** | On the Students tab of a school containing a student whose first or last name contains special characters. |
| **Test Steps** | 1. Enter the name containing special characters in the search box. 2. Click **Search**. 3. Read the returned row(s) and the rendered name. |
| **Test Data** | First name `!^(+)s95` or `&FName` — names present on the shared school per the other team's sheet. Confirm live before running. |
| **Expected Result** | The matching student is returned. The term is treated as literal text rather than interpreted, and the name is rendered correctly in the result row — not HTML-escaped, truncated or corrupted. `[ASSUMED]` |
| **Remarks** | Added 2026-09-01 from the other team's TC_STU_001, which lists special-character names as fixtures. We already cover special characters in the **email** field (`TST_SLST_TC_7`) but never in a **name** field. SLST is already automated, so this is cheap to add. **Read-only** — no data created. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** |  |

---

| Field | Value |
|---|---|
| **S.No.** | 61 |
| **Test Case ID** | TST_SLST_TC_27 |
| **Title** | Verify a partial username returns every account whose username contains the term |
| **Linked Requirement** | #4 — Verify search by username |
| **Type** | Edge |
| **Priority** | Medium |
| **Preconditions** | On the Students tab, with two or more accounts whose usernames share a common substring. |
| **Test Steps** | 1. Enter a substring shared by several usernames (not a whole username). 2. Click **Search**. 3. Read the returned rows. |
| **Test Data** | Username fragment `<SHARED_USERNAME_SUBSTRING>` — e.g. the common prefix of `s95child0001`-style accounts. |
| **Expected Result** | Every account whose username contains the term is returned, not only an exact match. `[ASSUMED]` |
| **Remarks** | Added 2026-09-01 from the other team's TC_STU_004, whose step 2 searches a partial username. Our `TST_SLST_TC_8` searches a **full** child username only. We already prove partial matching for first name (`TST_SLST_TC_3`), so username was the one identifier left unverified. **Read-only.** |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** |  |

---

| Field | Value |
|---|---|
| **S.No.** | 62 |
| **Test Case ID** | TST_SLST_TC_28 |
| **Title** | Verify a never-activated code returns a clear no-result state in the activation-code search |
| **Linked Requirement** | #5 — Verify search using who activated the code in my school checkbox |
| **Type** | Negative |
| **Priority** | Medium |
| **Preconditions** | On the Students tab with the "Who activated the code in my school?" checkbox ticked. |
| **Test Steps** | 1. Tick **Who activated the code in my school?**. 2. Enter a well-formed 16-character code that has never been activated in this school. 3. Click **Search**. 4. Wait for the query to settle (the code search can take up to ~1 minute). |
| **Test Data** | A syntactically valid but unredeemed 16-character code, e.g. `AAAA-BBBB-CCCC-DDDD`. |
| **Expected Result** | A clear no-result / empty state is shown, with no error and no stale results left from the previous query. `[ASSUMED]` — exact copy not captured. |
| **Remarks** | Added 2026-09-01 from the other team's TC_STU_005, step 2. Our `TST_SLST_TC_13` only toggles the checkbox and `TST_SLST_TC_14` (**Blocked**, needs a known redeemed code) covers the success path, so the failure path was entirely unverified. **This case is cheaper than TC_14 and can run today** — it needs no seeded redemption. **Read-only.** |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** |  |

---

| Field | Value |
|---|---|
| **S.No.** | 63 |
| **Test Case ID** | TST_SPRF_TC_23 |
| **Title** | Verify a learner can sign in with the password an administrator has just set |
| **Linked Requirement** | #11 — Verify Change password: View Profile > Manage account > Edit Account details |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | A disposable learner account exists whose credentials the tester controls and whose current password is known. |
| **Test Steps** | 1. As admin, open the learner's profile > **Manage learner profile** > **Password**. 2. Set a new policy-compliant password and click **Update**. 3. Sign out. 4. Sign in as the learner with the **new** password. 5. Sign out and attempt to sign in with the **old** password. |
| **Test Data** | Disposable learner `<DISPOSABLE_STUDENT_ACCOUNT>`; new password meeting the policy (min 8 characters, at least one letter and one number/special). |
| **Expected Result** | Sign-in with the new password succeeds and the learner reaches their dashboard. Sign-in with the old password is rejected. `[ASSUMED]` |
| **Remarks** | Added 2026-09-01 from the other team's TC_STU_010, whose expected result is "login with the new password succeeds". Our `TST_SPRF_TC_8` stops at the form accepting the update — which a change that was acknowledged but never persisted would also satisfy. **Mutates a real account**: use a disposable learner, never a shared fixture, and place it in a data-mutating suite. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** |  |

---

| Field | Value |
|---|---|
| **S.No.** | 64 |
| **Test Case ID** | TST_SBLK_TC_13 |
| **Title** | Verify a duplicate username is flagged on its own row during bulk account creation |
| **Linked Requirement** | #17 — Verify Bulk feature > Add new students to classes children |
| **Type** | Negative |
| **Priority** | High |
| **Preconditions** | On "Create new accounts for children" via Manage students > Add new students to classes > Children. |
| **Test Steps** | 1. Fill one valid child row. 2. Fill a second row re-using the **same** username. 3. Read both rows and the submit button. 4. Repeat via the CSV path with the same duplicate pair. |
| **Test Data** | Two child rows sharing one username; the rest of the fields valid. |
| **Expected Result** | The offending row is flagged (no green tick) with an error naming the username field, the valid row is unaffected, and **Create N account(s)** stays unavailable while any row is invalid. Behaviour is the same for the manual grid and the CSV upload. `[ASSUMED]` |
| **Remarks** | Added 2026-09-01 from the other team's TC_STU_016_N1. Our SBLK negatives cover only the CSV-level rejection (`TST_SBLK_TC_12`) and two UI defects (`TC_9` raw i18n keys, `TC_10` checkbox label) — row-level validation was untested. **This is the guard that stops bad accounts being created in bulk.** **Side-effect free** provided the form is never submitted. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** |  |

---

| Field | Value |
|---|---|
| **S.No.** | 65 |
| **Test Case ID** | TST_SBLK_TC_14 |
| **Title** | Verify a rule-violating username or password is flagged on its own row during bulk account creation |
| **Linked Requirement** | #18 — Verify Bulk feature > Add new students to classes adult with username |
| **Type** | Negative |
| **Priority** | High |
| **Preconditions** | On "Create adult student accounts" via Manage students > Add new students to classes > Adults. |
| **Test Steps** | 1. Fill one valid adult row. 2. Fill a second row with a username and a password that violate the documented rules. 3. Read both rows, the per-field messages and the submit button. 4. Repeat via the CSV path. |
| **Test Data** | One valid adult row; one row with a rule-violating username and a rule-violating password. |
| **Expected Result** | The offending row is flagged (no green tick), the message identifies **which** field is wrong, the valid row is unaffected, and the submit control stays unavailable while any row is invalid. `[ASSUMED]` — the username and password rules must be read from the form's own help text before this case is finalised. |
| **Remarks** | Added 2026-09-01 from the other team's TC_STU_017_N1. Companion to `TST_SBLK_TC_13` on the adult path. **Capture the stated rules verbatim** on the first live pass — inventing them would breach golden rule 2. **Side-effect free** provided the form is never submitted. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** |  |

---

| Field | Value |
|---|---|
| **S.No.** | 66 |
| **Test Case ID** | TST_SBLK_TC_15 |
| **Title** | Verify an invalid code in a bulk activation is reported without blocking the valid rows |
| **Linked Requirement** | #21 — Verify Bulk feature > Activate course material |
| **Type** | Negative |
| **Priority** | High |
| **Preconditions** | On "Activate codes for students in your school" via Manage students > Activate course materials. |
| **Test Steps** | 1. Fill a batch mixing rows with valid unused codes and at least one already-used or invalid code. 2. Submit **Activate N code(s)**. 3. Read the job outcome and, once processed, the affected learner profiles. |
| **Test Data** | Valid unused 16-character codes plus one already-used/invalid code. |
| **Expected Result** | Only the bad row is flagged or reported in the job outcome; the valid rows still activate and their learners show "Code activated". A single bad row does not fail the whole batch. `[ASSUMED]` |
| **Remarks** | Added 2026-09-01 from the other team's TC_STU_020_N1. Our `TST_SBLK_TC_12` rejects an unprocessable CSV outright — the all-or-nothing path; this is the **partial-failure** path, which is where async bulk jobs typically break. **Creates real data** (consumes activation codes) — data-mutating suite only, and the codes cannot be reused. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** |  |

---

| Field | Value |
|---|---|
| **S.No.** | 67 |
| **Test Case ID** | TST_SBLK_TC_16 |
| **Title** | Verify the administrator receives an email report for an asynchronous bulk job |
| **Linked Requirement** | #17 — Verify Bulk feature > Add new students to classes children |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | An administrator account whose mailbox the tester can read (e.g. a mailsac-style address). A bulk job has been submitted and its Request ID noted. |
| **Test Steps** | 1. Submit a bulk job and record the **Request ID** and row count from the confirmation screen. 2. Wait for processing (the product states up to ~3 hours for account creation, and 24–48 hours for code activation). 3. Open the admin mailbox and locate the report email. 4. Compare its contents against the submitted job. |
| **Test Data** | Admin mailbox `<MAIL_READABLE_ADMIN_ACCOUNT>`; the Request ID from step 1. |
| **Expected Result** | A report email reaches the admin mailbox naming the same Request ID and row count as the confirmation screen, and reporting the per-row outcomes. `[ASSUMED]` |
| **Remarks** | Added 2026-09-01: the other team repeat this step in five separate bulk cases (TC_STU_016, 017, 018, 019, 020) — "check if corresponding email is appearing in admin inbox and shows all the required details" — and we verify the email report nowhere. **Fixture required before this can be automated:** a mail-readable admin account. Scope that first; the case is written so it can be executed manually in the meantime. Written against the children path but applies to every async bulk job. |
| **Actual Result** | |
| **Status** | Blocked |
| **Comments / Defect ID** | Blocked at design time (skill rule 4): no mail-readable admin fixture exists on thor. Unblock by provisioning an admin whose mailbox is programmatically readable, then re-scope the case across the five bulk flows. |

---

| Field | Value |
|---|---|
| **S.No.** | 68 |
| **Test Case ID** | TST_SBLK_TC_17 |
| **Title** | Verify the bulk CSV upload accepts 200 records and rejects 201 |
| **Linked Requirement** | #18 — Verify Bulk feature > Add new students to classes adult with username |
| **Type** | Edge |
| **Priority** | Medium |
| **Preconditions** | On the adult bulk-creation form with the CSV template downloaded. |
| **Test Steps** | 1. Build a CSV of exactly **200** valid rows and upload it. 2. Note whether the grid populates and the submit count. 3. Build a CSV of **201** valid rows and upload it. 4. Read the resulting message. |
| **Test Data** | Two generated CSVs in the real template format — 200 rows and 201 rows. |
| **Expected Result** | The 200-row file is accepted and the grid reports 200 rows. The 201-row file is rejected with a message naming the limit. `[ASSUMED]` — the exact rejection copy is not captured. |
| **Remarks** | Added 2026-09-01 from the other team's TC_STU_016/017, whose expected results state the cap twice ("<=200 records"). `TST_SBLK_TC_12`'s Remarks already record that the adult CSV page enforces a 200-record maximum with its own wording — **so the limit is known and the boundary case was simply missing**. Boundary cases at a documented cap are the pattern that repeatedly caught real defects in the Classes work. **Side-effect free** if the 200-row file is never submitted. Generate the CSVs to the exact template headers. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** |  |

---
## Open items — expected results still `[ASSUMED]`

| TC | What needs confirming live |
|---|---|
| TST_SLST_TC_25 | Verify the Students heading count increases after a new student is added to the school |
| TST_SPRF_TC_3 | Verify the profile of an ADULT account that logs in with a username shows the username as its identifier |
| TST_SPRF_TC_12 | Verify a required name field cannot be saved empty |
| TST_SPRF_TC_22 | Verify cancelling the removal confirmation leaves the student in the school |
| TST_SBLK_TC_6 | Verify the account-type chooser cannot be advanced without a selection |
| TST_SBLK_TC_11 | Verify uploading a CSV populates the bulk activation grid |
| TST_SBLK_TC_8 | Verify the Activate button stays disabled until a row is complete |

**7 of 59** cases still carry an `[ASSUMED]` expected result (was 10). Resolved during Phase 1 grounding on 2026-08-28 and removed from this table: **TST_SLST_TC_13** (the checkbox is a search-MODE switch, not a filter — expected result rewritten and verified live), **TST_SLST_TC_14** (rewritten to cover activation-code search; still Blocked, but on test data rather than on an unknown), and **TST_SLST_TC_19** (the sort does NOT survive a reload — confirmed live). The remaining seven are states that cannot be reached without mutating a shared school, consuming a real activation code, sending real email, or a fixture the school does not have.

## Handoff to automation

- **Module codes and their page objects:** `SLST` → `schoolStudents`, `SPRF` → `studentProfile`, `SBLK` → `bulkStudents`. Chosen from the page objects the screens will get, not from this batch (`admin-shared.md` §A8.4) — so no repeat of the `BCCF` → `CCLS` mismatch.
- **Blocked:** `TST_SLST_TC_14` (needs a redeemed 16-char activation code — the code-issuing environment is down), `TST_SPRF_TC_3` (no adult-with-username account here) and `TST_SPRF_TC_20` (needs 51+ students). Updated 2026-08-28: these are now THREE SEPARATE blockers — the earlier claim that one mixed-activation school unblocks all three was based on the misread checkbox and is withdrawn.
- **Side-effect free** (safe in a read-only suite): all of `SLST` except `TST_SLST_TC_25`; `SPRF` 1–7, 9, 11, 15, 16, 17, 18, 21; `SBLK` 7, 8, 10.
- **Creates, mutates or destroys real data** (keep in a separate suite, per `c1-test-authoring`): `TST_SLST_TC_25`, `TST_SPRF_TC_8` (password), `TST_SPRF_TC_10`/`12`/`13` (personal info), `TST_SPRF_TC_14` (consumes an activation code), `TST_SPRF_TC_19`/`22` (removal), and all of `TST_SBLK_TC_1`–`5`, `11`, `12`.
- **Sends real email:** `TST_SBLK_TC_3`, `TST_SBLK_TC_5`, and the removal report from `TST_SPRF_TC_19`.
- **CSV fixtures are NOT yet written.** The bulk templates were not downloaded during this pass, and `manual-test-standard.md` requires the exact template headers. Download `Get CSV template` on each bulk screen first, then write `TST_SBLK_TC_1_children.csv`, `TST_SBLK_TC_2_adults_username.csv`, `TST_SBLK_TC_3_adults_email.csv`, `TST_SBLK_TC_4_existing_username.csv`, `TST_SBLK_TC_5_existing_email.csv`, `TST_SBLK_TC_11_bulk_activation.csv` and `TST_SBLK_TC_12_malformed.csv` alongside this document.
- **Automation continues in `c1-test-authoring` Phase 1.**

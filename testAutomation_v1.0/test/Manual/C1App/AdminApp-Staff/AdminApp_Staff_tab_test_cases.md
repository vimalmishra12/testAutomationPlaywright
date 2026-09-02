# Manual Functional Test Cases — Admin App: Staff Tab (Batch 1)

**Source:** `AdminApp_Staff Tab.xlsx` — 13 high-level Staff-tab scenarios
**Modules:** **STFL** (Staff tab list) — *maps to the future `schoolStaff` page object* · **STFP** (staff profile & manage account) — *`staffProfile`* · **STFB** (bulk staff invitations) — *`bulkStaff`*
**App:** Admin App / NEMO — `micro-nemo.comprodls.com` (Thor)
**Pages in scope:** Staff tab `/admin/admin/org_<slug>/staff` · staff profile `/admin/admin/org_<slug>/profile/<orgUuid>/<userId>` · invitation form `/admin/admin/org_<slug>/email/invite` · class page (from a profile) `/class/teacher/org_<slug>/class/<uuid>/view`
**Generated:** 2026-08-24 | **Total TCs:** 57 (31 Positive · 19 Edge · 7 Negative) — **all 13 source scenarios covered**
> **[2026-09-01] Gap-analysis batch.** Cases added after comparing this register against the other team's `C1_Admin_Console_Detailed_Test_Cases_REVIEWED_Team.xlsx`. Every one closes a scenario their sheet covers and ours did not. All are appended (never renumbered, skill rule 7), all carry `[ASSUMED]` expected results pending a live pass, and the design-time blockers are marked `Blocked` with their unblock route in Comments. See `HANDOFF_adminGapAnalysis_2026-09-01.md`.

> **[2026-09-02] Phase 1 automation exclusions — "extra" cases.** **17** of this register's cases are marked **`[EXTRA — Phase 1 exclusion]`** in their **Remarks**. They are the cases carried as **"Extra in Ours"** in `Admin_Gap_Analysis.xlsx` — coverage we hold that the other team's reviewed sheet (`C1_Admin_Console_Detailed_Test_Cases_REVIEWED_Team.xlsx`) does not. **None of them will be automated in Phase 1**; Phase 1 automation scope is the cases *not* carrying this marker. They stay in the register and are revisited for a later phase. Excluded here: `TST_STFL_TC_1`, `TST_STFL_TC_5`, `TST_STFL_TC_7`, `TST_STFL_TC_10`, `TST_STFL_TC_21`, `TST_STFL_TC_26`, `TST_STFP_TC_3`, `TST_STFP_TC_4`, `TST_STFP_TC_6`, `TST_STFP_TC_8`, `TST_STFP_TC_14`, `TST_STFB_TC_5`, `TST_STFB_TC_6`, `TST_STFB_TC_7`, `TST_STFB_TC_8`, `TST_STFB_TC_11`, `TST_STFB_TC_12`.

**Execution status (2026-09-02):** **19 of 57 TCs automated and PASSING** — the whole Phase 1 `STFL` block, verified on Thor across two consecutive clean runs of `npm run adminStaffTabTest_thor` (19/19, 77.1 s then 76.3 s). **36 are Not Run**; **2 are Blocked** at design time (`TST_STFB_TC_11`, `TST_STFP_TC_20`).
- Automated (`STFL`): `TST_STFL_TC_2, 3, 4, 6, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 23, 24, 25` — the side-effect-free list, search, user-guide, sort and Load-more cases. Nothing in the suite creates, edits or removes anything.
- Deliberately NOT automated in Phase 1: the **6 STFL cases marked `[EXTRA — Phase 1 exclusion]`** above, and `TST_STFL_TC_27`, which needs an invited teacher to accept and so mutates real data.
- `STFP` (17) and `STFB` (12) are **not started**. The read-only half of `STFP` is the natural next batch; `STFB` should be left until last — it needs a data-owning suite and `TST_STFB_TC_10` sends real email.

> Automation artifacts: `test/ExperienceApp/adminStaffTab.test.js` · `pages/ExperienceApp/schoolStaff.page.js` · selectors under `css.ComproC1.schoolStaff` · exec file `testResources/testExecutionFiles/ExperienceApp/thor/adminStaffTab.json`. Live capture, traps and measured transitions: `product-knowledge/ExperienceApp/admin-staff-tab.md` §7.
- Module **STFL** (`TST_STFL_TC_1–27`, **26 TCs** — `TST_STFL_TC_22` withdrawn, see below) — scenarios #1–#6, #13.
- Module **STFP** (`TST_STFP_TC_1–18`, **17 TCs** — `TST_STFP_TC_5` withdrawn, see below) — scenarios #7–#11.
- Module **STFB** (`TST_STFB_TC_1–12`, 12 TCs) — scenario #12.

**One case is BLOCKED at design time** — `TST_STFB_TC_11`, because the dialog exists in the DOM but the state that raises it is unknown. It is recorded **Blocked**, not Not Run, per `admin-shared.md` §A8.3. *(`TST_STFB_TC_9` was unblocked on 2026-08-24 once the CSV template was downloaded and its fixture written.)*

**Two product defects were found during grounding** and are written as expected-versus-actual cases:

| TC | Defect |
|---|---|
| `TST_STFL_TC_26` | The heading reads `Staff (23)` but the fully-loaded list renders only **21** rows, with `Load more ...` already removed. **Not explained by pending invitations** — the team confirmed the count moves only on acceptance. Cause unknown; may be specific to this school's data. |
| `TST_STFB_TC_11` | The form upload error dialog renders **three raw translation keys** (`ADMIN.LEARNER.ADULT_INVITE.FORM_UPLOAD_ERROR_HEADING` / `_INFO` / `_CLOSE`) instead of `Form not uploaded` / `An unexpected error occured. Please try again.` / `Close`. **Root cause found:** the strings are defined only under `EXISTING_CHILD` and `BULK_ACTIVATION`, never under `ADULT_INVITE`. |

**`TST_STFP_TC_5` withdrawn — 2026-08-24.** The case asserted that a staff profile URL opened directly should render the profile. **Deep-linking is not handled by the development team**, so this is neither a defect nor a test case, and the case has been removed at the user's instruction. `TST_STFP_TC_5` is retired and **must not be reused for a different case**. The underlying behaviour — a directly-opened staff profile URL collapses to `/admin/` and renders blank — remains **true and important for automation**, and is recorded in `admin-staff-tab.md` §1: reach a staff profile through the list, never by URL. `TST_STFP_TC_3` (Back returns to the Staff tab) already covers the supported navigation.

**Not a product defect — closed 2026-08-24.** The **HTTP 500** returned by `getUserDetailWithClasses` for `tch_L_20240705-095330_1_FCN-CHZ-PDA` was **confirmed with the team as a known DATA issue** on that one account, not a product fault. `TST_STFP_TC_6` has been narrowed accordingly: it now asserts only the two client-side gaps that any 500 would expose — **no user-visible error**, and the **loading overlay left stuck** so the list is unusable until reload. The bad account is retained deliberately as the trigger fixture; `teacher17aug2026@mailsac.com` is the team-nominated **healthy** teacher fixture used by the other profile cases.

**Smaller copy defects, recorded in Remarks rather than as their own cases:** the no-results message says *"no **administrators** that match your search"* on a tab listing teachers and administrators (`TST_STFL_TC_11`); the invitation form's help panel is worded for students only (`TST_STFB_TC_4`) and its browser tab reads `Students | Cambridge One` (`TST_STFB_TC_12`); the upload progress dialog reads `this may take**a** few minutes`; and the success dialog reads `invited to school **A**ccount` with a missing space after `each class.`

**Source scenario #5 corrected, and `TST_STFL_TC_22` withdrawn — 2026-08-24.** The source workbook reads *"Verify sort by last name/first name/**username**/Role"*. **"username" is a typo** — confirmed by the user; the Staff tab's sortable columns are `Last name | First name | Email address | Role`, and every staff account is email-based. The scenario is recorded throughout this document in its corrected form, *"Verify sort by last name/first name/**email address**/Role"*, and the email sort is covered by `TST_STFL_TC_16`. `TST_STFL_TC_22`, which existed only to record the mismatch as expected-versus-actual, is therefore **withdrawn** — there is no discrepancy left for it to describe. Its ID is retired and **must not be reused**. *(Grounding is what surfaced the typo at design time rather than weeks into automation — the same class of catch as the historic "click a listed class" cases, `admin-shared.md` §A8.1.)*

**Batches:** Batch 1 — the whole Staff-tab scenario list (`TST_STFL_*` / `TST_STFP_*` / `TST_STFB_*`, 55 TCs).

> **Ordering:** test cases are **grouped by Linked Requirement (scenario)** so every requirement's TCs sit
> together; within each group they run **Positive → Edge → Negative**. (This intentionally departs from
> `manual-test-standard.md`'s global P→E→N ordering, per the Admin App convention.) **S.No.** is sequential
> 1–55 in this grouped order; **Test Case IDs** are stable identifiers and therefore appear out of numeric
> sequence within a group.
>
> **Batch 1 scope (agreed with the user before design):** all 13 scenarios from the source workbook, in one
> document, split across three module codes chosen to survive automation. Nothing deferred.
>
> Unverified expected text is marked `[ASSUMED]`; env-specific values use `<PLACEHOLDER>` (see Remarks).

---

## Requirement → Test Case coverage map

| Linked Requirement (scenario) | Mapped TC IDs (P → E → N) |
|---|---|
| — Staff tab load *(added, not in source)* | TST_STFL_TC_1 |
| #1 — Verify search by first name | TST_STFL_TC_2, TST_STFL_TC_3 (E), TST_STFL_TC_4 (E), TST_STFL_TC_5 (E) |
| #2 — Verify search by last name | TST_STFL_TC_6, TST_STFL_TC_7 |
| #3 — Verify search by email | TST_STFL_TC_8, TST_STFL_TC_9 (E), TST_STFL_TC_10 (E), TST_STFL_TC_11 (N) |
| #4 — Verify user guide expand/collapse | TST_STFL_TC_12, TST_STFL_TC_13 |
| #5 — Verify sort by last name/first name/email address/Role | TST_STFL_TC_14, TST_STFL_TC_15, TST_STFL_TC_16, TST_STFL_TC_17, TST_STFL_TC_18 (E), TST_STFL_TC_19 (E), TST_STFL_TC_20 (E), TST_STFL_TC_21 (E) |
| #6 — Verify Load More | TST_STFL_TC_23, TST_STFL_TC_24 (E), TST_STFL_TC_25 (E), TST_STFL_TC_26 (N) |
| #13 — Verify count of teachers increase on adding a new teacher | TST_STFL_TC_27 |
| #7 — Verify View Profile launch | TST_STFP_TC_1, TST_STFP_TC_2, TST_STFP_TC_3, TST_STFP_TC_4 (E), TST_STFP_TC_6 (N) |
| #8 — Verify class launch from view profile page | TST_STFP_TC_7, TST_STFP_TC_8 (E) |
| #9 — Verify Grant admin rights | TST_STFP_TC_9, TST_STFP_TC_10, TST_STFP_TC_19 |
| #11 — Verify revoke admin rights | TST_STFP_TC_11, TST_STFP_TC_12, TST_STFP_TC_13, TST_STFP_TC_14 (E), TST_STFP_TC_20 (N) |
| #10 — Verify remove from school account | TST_STFP_TC_15, TST_STFP_TC_17, TST_STFP_TC_18, TST_STFP_TC_16 (E) |
| #12 — Verify Bulk feature > Add new teachers to classes form | TST_STFB_TC_1, TST_STFB_TC_2, TST_STFB_TC_3, TST_STFB_TC_4, TST_STFB_TC_10, TST_STFB_TC_5 (E), TST_STFB_TC_6 (E), TST_STFB_TC_7 (E), TST_STFB_TC_9 (E), TST_STFB_TC_8 (N), TST_STFB_TC_11 (N), TST_STFB_TC_12 (N) |

Every one of the 13 source scenarios has at least one test case.

---

## Product reference (captured live 2026-08-24, Thor · school `FCN-CHZ-PDA` "3 July Test School 1")

### Entry path and routes

```
Login → My school accounts (/admin/admin/dashboard)
   └─ school card, selected BY KEY (FCN-CHZ-PDA) → Classes tab
        └─ left nav: Classes · Students · STAFF · Library · Reports

STAFF tab                  /admin/admin/org_<slug>/staff
  ├─ Manage staff ▾
  │    └─ Add new teachers to classes   /admin/admin/org_<slug>/email/invite   (ONE item only)
  └─ row (the whole row is the menu toggle) ▾
       └─ View profile                  /admin/admin/org_<slug>/profile/<orgUuid>/<userId>

staff profile
  ├─ Back → Staff tab
  ├─ Manage account ▾   role-conditional:
  │    ├─ Teacher               → Grant admin rights   ·  Remove from school account
  │    └─ Administrator/Teacher → Remove admin rights  ·  Remove from school account
  └─ Classes (N) → /class/teacher/org_<slug>/class/<uuid>/view  (the class name IS a link)
```

The Staff tab URL itself **is** reachable directly within a session whose school context is already set. A **staff profile URL is not** — it collapses to `/admin/` and renders blank. **This is accepted behaviour, not a defect** — deep-linking is not handled by the development team [user, 2026-08-24] — but automation must therefore always reach a profile through the list. Opening a class from a profile crosses from the `admin` microfrontend to `class`, which is a full page load.

### The staff list

| | |
|---|---|
| Heading | `Staff (N)` — 23 at capture, though only 21 rows render when fully loaded (`TST_STFL_TC_26`) |
| Columns | `Last name` · `First name` · `Email address` · `Role` — **no Username column** |
| Role values | `Teacher`, `Administrator/Teacher` |
| Default sort | **Last name ascending** (the Students tab defaults to First name) |
| Sort behaviour | every column sortable, asc ⇄ desc on repeat clicks, one indicator at a time; changing the sort resets the list to the first 20 |
| Collation | **code point, not locale** — `21aug, Ln, Perf Test, T1, User, gg, ln, s, teacher, teacher9752` |
| Search | one box, placeholder `Search by first name, last name or email`; **submit-driven** (the Search button is required), case-insensitive, partial-matching; settles ~1–2 s |
| Search banner | `Showing search results for <term>.` + `Clear`; the count disappears while a search is active; the term is echoed preserving case |
| Page size | 20; `Load more ...` is **removed from the DOM** when exhausted, and absent for result sets of ≤ 20 |
| Row selection | **none** — no checkboxes, no `N Selected`, no bulk remove on the list (all three exist on the Students tab) |
| Row menu | exactly one item, `View profile`. The whole row is the dropdown toggle. |
| Account type | exposed in the row's accessible name (`Row3 Administrator …`) as well as the visible Role column |

### Copy verified live

| Where | Text |
|---|---|
| Search, no results | `This school has no administrators that match your search <term>. Please check the spelling or try a different search term` |
| User guide | `On this page you can:` · `Search for a teacher or administrator who has joined your school in Cambridge One` · `View profiles and manage their accounts` · `Remove staff members from your school account` · `Grant or remove administrator rights to teachers in your school` · `Tip: If the person you want to make an administrator has not yet joined your school, give them the school key you see above and ask them to sign up as a teacher and use the key. You can then give them admin rights` |
| Remove admin rights dialog | `Remove admin rights?` / `<First> <Last> will no longer have admin rights, but will still remain a teacher in your school` / `No, keep admin rights` / `Yes, remove admin rights` |
| Remove from school dialog | `Remove from school account` / `This staff member will no longer have access to your school account or any of its classes. They can still use their account independently from your school` / `I confirm I want to remove this staff member from my school account` / `No, cancel` / `Yes, remove` |
| Profile, no classes | `No class` / `Your classes will appear here` / `Add classes` |
| Invitation form heading | `Invite students and teachers` / `to <school name>` |
| Invitation form validation | `Select student or teacher` · `Enter a valid class key` · `Add a teacher’s email` |
| Invitation success dialog | `N students/teachers invited to school Account` / `You can track responses in the pending section for each class.As students/teachers accept your invitation they will appear on your dashboard` / `Would you like a record of the invitations sent?` / `Back to dashboard` / `Download record` |
| Invitation upload progress | `Please wait, this may takea few minutes` / `Cancel upload` |
| Invitation upload failed | `Sorry, your file could not be uploaded` … `If that doesn’t work, email our Customer Services team at ptsupport@cambridge.org` |
| Invitation form limit | `Your CSV file can have up to 200 records` |

**Free-captured from the pre-rendered DOM** (`admin-shared.md` §A6), without reaching the states that raise them: both staff-profile dialogs, and all **11** dialogs on the invitation form — which is how the untranslated `ADMIN.LEARNER.ADULT_INVITE.FORM_UPLOAD_ERROR_*` keys were found before anyone triggered an upload error.

### Field constraints

No `maxlength` is set on the Staff search box, nor on any Email / First name / Last name / Class key cell of the invitation form. The only measured limit is the form's **200-record** cap, stated in its help panel. **No boundary case can honestly be written for the text fields yet** — measure the server-side limits during Phase 1 and add cases then, rather than inventing a number (`admin-shared.md` §A3).

### Fixtures on `FCN-CHZ-PDA` (verified 2026-08-24)

| Purpose | Staff member |
|---|---|
| **Teacher fixture (team-nominated)** | `ln, teacher17aug2026` · teacher17aug2026@mailsac.com |
| Teacher, no classes | `gg, teacher19oct` · teacher19oct@mailsac.com |
| Administrator/Teacher, no classes | `gg, testteacher18` · testteacher18oct@mailsac.com |
| Administrator/Teacher **with 3 classes** | `T1, Test` · testt1@mailsac.com — **this is the login account itself** |
| Profile that returns HTTP 500 — **known data issue**, kept as the error-handling trigger | `Perf Test, tch_L_20240705-095330_1_FCN-CHZ-PDA` · …@yopmail.com |
| Last name shared by 2 staff (search fixture) | `gg` |
| Email domain shared by 9 staff (search fixture) | `@yopmail.com` |

**23 staff in the heading, 21 rendered, 3 of them `Administrator/Teacher` at capture.** The school is **shared and actively mutated by other teams** — never assert an absolute count (`admin-shared.md` §A5). The only staff member on this school with classes is the login account, so any test needing "a teacher with classes" that is *not* the logged-in admin has no fixture here yet.

### Automation traps found during grounding

1. **The whole row is the dropdown toggle** (`button.row-link`, `aAdmin-16-<index>`), and the `View profile` item (`aAdmin-17-<index>`) is pre-rendered hidden once per row. Presence never proves the menu is open — filter on visibility.
2. **Row identifiers are positional** and shift with sort, search and Load more. Resolve a row by its content, then act on it. (They are at least unique per row here, unlike the Students tab where 26 rows shared one `qid`.)
3. **The user guide toggle is a different element in each state** — `aAdmin-8` collapsed, `aAdmin-9` expanded. The panel is genuinely removed from the DOM when collapsed.
4. **`Yes, remove` on the removal dialog is disabled by CSS class only** — the class `disabled` is present while the native `disabled` property stays `false`. A `toBeDisabled()` assertion is a false green.
5. **The invitation form's bulk actions (`Add role`, `+ Add class key`, `Remove`) carry no `qid`** and are disabled via the class `disable`. Resolve them by text.
6. **The invitation form auto-saves and restores a draft** — it is not empty on load, and the draft is shared state on a shared school.
7. **A failed profile load leaves `#loader-container` visible**, intercepting every subsequent click until the page is reloaded.
8. **The cookie banner intercepts row clicks** near the top of the list; a suite must dismiss or tolerate it. The CustomerGauge NPS survey noted for the Students tab was not seen this session but should still be tolerated.
9. Sort indicator text (`sorted ascending` / `sorted descending`) **is** inside the header button on every Staff column — the Students-tab Email/Username trap does **not** apply here.

---

## Section — Test Cases (grouped by Linked Requirement)

### Requirement — Staff tab load *(added, not in source)*

| Field | Value |
|---|---|
| **S.No.** | 1 |
| **Test Case ID** | TST_STFL_TC_1 |
| **Title** | Verify the Staff tab loads with all expected components when the school is opened by an administrator |
| **Linked Requirement** | — Staff tab load *(added, not in source)* |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as school admin `testt1@mailsac.com` on thor. School `FCN-CHZ-PDA` ("3 July Test School 1") opened from "My school accounts" BY KEY. Staff tab open at `/admin/admin/org_perf_testschool_1/staff`. |
| **Test Steps** | 1. Open school "3 July Test School 1" by key FCN-CHZ-PDA from "My school accounts".<br>2. Click "Staff" in the left navigation.<br>3. Observe the page. |
| **Test Data** | — |
| **Expected Result** | The URL is `/admin/admin/org_<slug>/staff` and the browser tab reads "Staff | Cambridge One". The page shows: heading `Staff (N)`; a search box placeholder `Search by first name, last name or email` with a `Search` button; a `Manage staff` menu; a collapsed `User guide` toggle; a sortable table headed `Last name | First name | Email address | Role`, sorted by Last name ascending; up to 20 staff rows; and `Load more ...` when more than 20 staff exist. |
| **Remarks** | **[EXTRA — Phase 1 exclusion]** Not present in the other team's reviewed sheet (`Admin_Gap_Analysis.xlsx`, status "Extra in Ours"). **This case will NOT be automated in Phase 1** — exclude it from the Phase 1 automation scope; revisit for a later phase. Column set differs from the Students tab — there is a **Role** column and there is NO row-selection checkbox, no `N Selected` counter and no bulk "Remove from school account" on the list. Role values seen: `Teacher`, `Administrator/Teacher`. |
| **Actual Result** | *(blank in design)* |
| **Status** | *(blank in design — Not Run)* |
| **Comments / Defect ID** | *(blank in design)* |

---

### Requirement #1 — Verify search by first name

| Field | Value |
|---|---|
| **S.No.** | 2 |
| **Test Case ID** | TST_STFL_TC_2 |
| **Title** | Verify matching staff are returned when a full first name is searched |
| **Linked Requirement** | #1 — Verify search by first name |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as school admin `testt1@mailsac.com` on thor. School `FCN-CHZ-PDA` ("3 July Test School 1") opened from "My school accounts" BY KEY. Staff tab open at `/admin/admin/org_perf_testschool_1/staff`. |
| **Test Steps** | 1. Type `teacher19oct` in the search box.<br>2. Click `Search`.<br>3. Wait for the list to settle (~1–2 s). |
| **Test Data** | First name: `teacher19oct` |
| **Expected Result** | Only staff whose first name matches are listed — the row `gg | teacher19oct | teacher19oct@mailsac.com | Teacher`. The heading changes from `Staff (N)` to `Staff` followed by the banner `Showing search results for teacher19oct.` and a `Clear` control; the count disappears while a search is active. |
| **Remarks** | Search covers first name, last name and email from the single box. |
| **Actual Result** | *(blank in design)* |
| **Status** | Pass |
| **Comments / Defect ID** | *(blank in design)* |

---

| Field | Value |
|---|---|
| **S.No.** | 3 |
| **Test Case ID** | TST_STFL_TC_3 |
| **Title** | Verify all partial matches are returned when only part of a first name is searched |
| **Linked Requirement** | #1 — Verify search by first name |
| **Type** | Edge |
| **Priority** | Medium |
| **Preconditions** | Logged in as school admin `testt1@mailsac.com` on thor. School `FCN-CHZ-PDA` ("3 July Test School 1") opened from "My school accounts" BY KEY. Staff tab open at `/admin/admin/org_perf_testschool_1/staff`. |
| **Test Steps** | 1. Type `teacher` in the search box.<br>2. Click `Search`. |
| **Test Data** | Partial first name: `teacher` |
| **Expected Result** | Every staff member whose first name, last name or email contains `teacher` is listed. Search is partial-matching, not exact. |
| **Remarks** | Do not assert an absolute row count — FCN-CHZ-PDA is shared and mutated by other teams (`admin-shared.md` §A5). |
| **Actual Result** | *(blank in design)* |
| **Status** | Pass |
| **Comments / Defect ID** | *(blank in design)* |

---

| Field | Value |
|---|---|
| **S.No.** | 4 |
| **Test Case ID** | TST_STFL_TC_4 |
| **Title** | Verify the same results are returned when a first name is searched in a different case |
| **Linked Requirement** | #1 — Verify search by first name |
| **Type** | Edge |
| **Priority** | Medium |
| **Preconditions** | Logged in as school admin `testt1@mailsac.com` on thor. School `FCN-CHZ-PDA` ("3 July Test School 1") opened from "My school accounts" BY KEY. Staff tab open at `/admin/admin/org_perf_testschool_1/staff`. |
| **Test Steps** | 1. Search `TEACHER19OCT`.<br>2. Note the results.<br>3. Click `Clear`, search `teacher19oct`.<br>4. Compare. |
| **Test Data** | `TEACHER19OCT` and `teacher19oct` |
| **Expected Result** | Both searches return the identical row set — matching is case-insensitive. The banner echoes the term **preserving the case as typed**, i.e. `Showing search results for TEACHER19OCT.` |
| **Remarks** | Case-preserving echo is confirmed behaviour on the sibling Students tab and re-observed here. |
| **Actual Result** | *(blank in design)* |
| **Status** | Pass |
| **Comments / Defect ID** | *(blank in design)* |

---

| Field | Value |
|---|---|
| **S.No.** | 5 |
| **Test Case ID** | TST_STFL_TC_5 |
| **Title** | Verify the list is unchanged when a search term is typed but the Search button is not clicked |
| **Linked Requirement** | #1 — Verify search by first name |
| **Type** | Edge |
| **Priority** | Medium |
| **Preconditions** | Logged in as school admin `testt1@mailsac.com` on thor. School `FCN-CHZ-PDA` ("3 July Test School 1") opened from "My school accounts" BY KEY. Staff tab open at `/admin/admin/org_perf_testschool_1/staff`. |
| **Test Steps** | 1. Type `gg` in the search box.<br>2. Do NOT click `Search`. Wait 3 s.<br>3. Observe the heading and rows. |
| **Test Data** | `gg` |
| **Expected Result** | The list is not filtered — the heading still reads `Staff (N)` and the same rows are shown. Search is submit-driven, not live. |
| **Remarks** | **[EXTRA — Phase 1 exclusion]** Not present in the other team's reviewed sheet (`Admin_Gap_Analysis.xlsx`, status "Extra in Ours"). **This case will NOT be automated in Phase 1** — exclude it from the Phase 1 automation scope; revisit for a later phase. Verified live 2026-08-24: typing alone left the heading at `Staff (23)`. |
| **Actual Result** | *(blank in design)* |
| **Status** | *(blank in design — Not Run)* |
| **Comments / Defect ID** | *(blank in design)* |

---

### Requirement #2 — Verify search by last name

| Field | Value |
|---|---|
| **S.No.** | 6 |
| **Test Case ID** | TST_STFL_TC_6 |
| **Title** | Verify matching staff are returned when a last name is searched |
| **Linked Requirement** | #2 — Verify search by last name |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as school admin `testt1@mailsac.com` on thor. School `FCN-CHZ-PDA` ("3 July Test School 1") opened from "My school accounts" BY KEY. Staff tab open at `/admin/admin/org_perf_testschool_1/staff`. |
| **Test Steps** | 1. Type `gg` in the search box.<br>2. Click `Search`. |
| **Test Data** | Last name: `gg` |
| **Expected Result** | Only staff with last name `gg` are listed — `gg | teacher19oct | teacher19oct@mailsac.com | Teacher` and `gg | testteacher18 | testteacher18oct@mailsac.com | Administrator/Teacher`. The banner reads `Showing search results for gg.` and `Load more ...` is absent because the result set is under one page. |
| **Remarks** | Verified live 2026-08-24 — exactly these two rows returned. |
| **Actual Result** | *(blank in design)* |
| **Status** | Pass |
| **Comments / Defect ID** | *(blank in design)* |

---

| Field | Value |
|---|---|
| **S.No.** | 7 |
| **Test Case ID** | TST_STFL_TC_7 |
| **Title** | Verify the full staff list is restored when Clear is clicked after a search |
| **Linked Requirement** | #2 — Verify search by last name |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as school admin `testt1@mailsac.com` on thor. School `FCN-CHZ-PDA` ("3 July Test School 1") opened from "My school accounts" BY KEY. Staff tab open at `/admin/admin/org_perf_testschool_1/staff`. A search for `gg` has been submitted. |
| **Test Steps** | 1. Click `Clear` in the search banner.<br>2. Observe the heading, the search box and the rows. |
| **Test Data** | — |
| **Expected Result** | The banner is replaced by the `Staff (N)` count heading, the search box is emptied, the first page of 20 staff is shown again and `Load more ...` reappears. |
| **Remarks** | **[EXTRA — Phase 1 exclusion]** Not present in the other team's reviewed sheet (`Admin_Gap_Analysis.xlsx`, status "Extra in Ours"). **This case will NOT be automated in Phase 1** — exclude it from the Phase 1 automation scope; revisit for a later phase. Verified live 2026-08-24: heading returned to `Staff (23)`, box empty, 20 rows, Load more present. |
| **Actual Result** | *(blank in design)* |
| **Status** | *(blank in design — Not Run)* |
| **Comments / Defect ID** | *(blank in design)* |

---

### Requirement #3 — Verify search by email

| Field | Value |
|---|---|
| **S.No.** | 8 |
| **Test Case ID** | TST_STFL_TC_8 |
| **Title** | Verify the correct staff member is returned when a full email address is searched |
| **Linked Requirement** | #3 — Verify search by email |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as school admin `testt1@mailsac.com` on thor. School `FCN-CHZ-PDA` ("3 July Test School 1") opened from "My school accounts" BY KEY. Staff tab open at `/admin/admin/org_perf_testschool_1/staff`. |
| **Test Steps** | 1. Type `testteacher18oct@mailsac.com` in the search box.<br>2. Click `Search`. |
| **Test Data** | Email: `testteacher18oct@mailsac.com` |
| **Expected Result** | Exactly one row is listed — `gg | testteacher18 | testteacher18oct@mailsac.com | Administrator/Teacher` — and the banner echoes the full address. |
| **Remarks** | — |
| **Actual Result** | *(blank in design)* |
| **Status** | Pass |
| **Comments / Defect ID** | *(blank in design)* |

---

| Field | Value |
|---|---|
| **S.No.** | 9 |
| **Test Case ID** | TST_STFL_TC_9 |
| **Title** | Verify all staff on a domain are returned when a partial email address is searched |
| **Linked Requirement** | #3 — Verify search by email |
| **Type** | Edge |
| **Priority** | Medium |
| **Preconditions** | Logged in as school admin `testt1@mailsac.com` on thor. School `FCN-CHZ-PDA` ("3 July Test School 1") opened from "My school accounts" BY KEY. Staff tab open at `/admin/admin/org_perf_testschool_1/staff`. |
| **Test Steps** | 1. Type `@yopmail.com` in the search box.<br>2. Click `Search`. |
| **Test Data** | Partial email: `@yopmail.com` |
| **Expected Result** | Every staff member whose email ends in `@yopmail.com` is listed (the `Perf Test` accounts). The `@` is matched literally, not as an operator. |
| **Remarks** | Nine `Perf Test` rows carried `@yopmail.com` at capture; do not assert the number. |
| **Actual Result** | *(blank in design)* |
| **Status** | Pass |
| **Comments / Defect ID** | *(blank in design)* |

---

| Field | Value |
|---|---|
| **S.No.** | 10 |
| **Test Case ID** | TST_STFL_TC_10 |
| **Title** | Verify the search banner state is entered and every staff member returned when the term is whitespace only |
| **Linked Requirement** | #3 — Verify search by email |
| **Type** | Edge |
| **Priority** | Low |
| **Preconditions** | Logged in as school admin `testt1@mailsac.com` on thor. School `FCN-CHZ-PDA` ("3 July Test School 1") opened from "My school accounts" BY KEY. Staff tab open at `/admin/admin/org_perf_testschool_1/staff`. |
| **Test Steps** | 1. Type three spaces in the search box.<br>2. Click `Search`. |
| **Test Data** | Three space characters |
| **Expected Result** | The term is trimmed to nothing, but the page still enters the search banner state — the count heading is replaced by `Showing search results for .` with `Clear` — and every staff member is returned. [ASSUMED] — not exercised live on the Staff tab; this is the confirmed Students-tab behaviour. |
| **Remarks** | **[EXTRA — Phase 1 exclusion]** Not present in the other team's reviewed sheet (`Admin_Gap_Analysis.xlsx`, status "Extra in Ours"). **This case will NOT be automated in Phase 1** — exclude it from the Phase 1 automation scope; revisit for a later phase. [ASSUMED]. Entering the banner state on an empty term is arguably wrong; it is recorded as an observation, not a defect case. Confirm during Phase 1. |
| **Actual Result** | *(blank in design)* |
| **Status** | *(blank in design — Not Run)* |
| **Comments / Defect ID** | *(blank in design)* |

---

| Field | Value |
|---|---|
| **S.No.** | 11 |
| **Test Case ID** | TST_STFL_TC_11 |
| **Title** | Verify an empty-state message is shown when a search matches no staff member |
| **Linked Requirement** | #3 — Verify search by email |
| **Type** | Negative |
| **Priority** | High |
| **Preconditions** | Logged in as school admin `testt1@mailsac.com` on thor. School `FCN-CHZ-PDA` ("3 July Test School 1") opened from "My school accounts" BY KEY. Staff tab open at `/admin/admin/org_perf_testschool_1/staff`. |
| **Test Steps** | 1. Type `zzzznomatchqa` in the search box.<br>2. Click `Search`.<br>3. Wait for the list to settle. |
| **Test Data** | `zzzznomatchqa` |
| **Expected Result** | The staff table (including the sort header) is removed and replaced by the message, verbatim: `This school has no administrators that match your search zzzznomatchqa. Please check the spelling or try a different search term` — the term is echoed. `Clear` remains available and restores the list. |
| **Remarks** | Verified live 2026-08-24. **Copy defect to raise:** the message says "administrators" although the Staff tab lists teachers and administrators and the search matches both — it should say staff. Assert the string verbatim as written here until the copy is fixed. Note this tab does NOT reproduce the Students-tab defect where nothing at all renders (`TST_SLST_TC_12`). |
| **Actual Result** | *(blank in design)* |
| **Status** | Pass |
| **Comments / Defect ID** | *(blank in design)* |

---

### Requirement #4 — Verify user guide expand/collapse

| Field | Value |
|---|---|
| **S.No.** | 12 |
| **Test Case ID** | TST_STFL_TC_12 |
| **Title** | Verify the user guide panel is shown when the User guide toggle is clicked |
| **Linked Requirement** | #4 — Verify user guide expand/collapse |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | Logged in as school admin `testt1@mailsac.com` on thor. School `FCN-CHZ-PDA` ("3 July Test School 1") opened from "My school accounts" BY KEY. Staff tab open at `/admin/admin/org_perf_testschool_1/staff`. The user guide is collapsed (its default state). |
| **Test Steps** | 1. Click the `User guide` toggle.<br>2. Read the panel. |
| **Test Data** | — |
| **Expected Result** | The panel expands and reads, verbatim: `On this page you can:` · `Search for a teacher or administrator who has joined your school in Cambridge One` · `View profiles and manage their accounts` · `Remove staff members from your school account` · `Grant or remove administrator rights to teachers in your school` · `Tip: If the person you want to make an administrator has not yet joined your school, give them the school key you see above and ask them to sign up as a teacher and use the key. You can then give them admin rights`. The toggle label changes to `Hide`. |
| **Remarks** | Captured verbatim live 2026-08-24. **Automation trap:** the collapsed and expanded toggles are DIFFERENT elements (`aAdmin-8` vs `aAdmin-9`); a page object bound to one breaks the other half of this test. |
| **Actual Result** | *(blank in design)* |
| **Status** | Pass |
| **Comments / Defect ID** | *(blank in design)* |

---

| Field | Value |
|---|---|
| **S.No.** | 13 |
| **Test Case ID** | TST_STFL_TC_13 |
| **Title** | Verify the user guide panel is removed when the Hide toggle is clicked |
| **Linked Requirement** | #4 — Verify user guide expand/collapse |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | Logged in as school admin `testt1@mailsac.com` on thor. School `FCN-CHZ-PDA` ("3 July Test School 1") opened from "My school accounts" BY KEY. Staff tab open at `/admin/admin/org_perf_testschool_1/staff`. The user guide is expanded. |
| **Test Steps** | 1. Click the `Hide` toggle.<br>2. Observe the panel and the toggle label. |
| **Test Data** | — |
| **Expected Result** | The panel is removed from the page entirely (not merely hidden) and the toggle label reverts to `User guide`. |
| **Remarks** | Verified live 2026-08-24 — the guide text is genuinely absent from the DOM once collapsed, so an automated assertion may check absence rather than visibility. |
| **Actual Result** | *(blank in design)* |
| **Status** | Pass |
| **Comments / Defect ID** | *(blank in design)* |

---

### Requirement #5 — Verify sort by last name/first name/email address/Role

| Field | Value |
|---|---|
| **S.No.** | 14 |
| **Test Case ID** | TST_STFL_TC_14 |
| **Title** | Verify the list is sorted by Last name ascending when the Staff tab first loads |
| **Linked Requirement** | #5 — Verify sort by last name/first name/email address/Role |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as school admin `testt1@mailsac.com` on thor. School `FCN-CHZ-PDA` ("3 July Test School 1") opened from "My school accounts" BY KEY. Staff tab open at `/admin/admin/org_perf_testschool_1/staff`. |
| **Test Steps** | 1. Load the Staff tab.<br>2. Read the sort indicator in the table header.<br>3. Read the Last name column top to bottom. |
| **Test Data** | — |
| **Expected Result** | The `Last name` header carries `sorted ascending` and the rows are ordered by last name ascending. No other column carries an indicator. |
| **Remarks** | Note the Staff default differs from the Students tab, which defaults to **First name** ascending. |
| **Actual Result** | *(blank in design)* |
| **Status** | Pass |
| **Comments / Defect ID** | *(blank in design)* |

---

| Field | Value |
|---|---|
| **S.No.** | 15 |
| **Test Case ID** | TST_STFL_TC_15 |
| **Title** | Verify the list is re-ordered by first name when the First name column header is clicked |
| **Linked Requirement** | #5 — Verify sort by last name/first name/email address/Role |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as school admin `testt1@mailsac.com` on thor. School `FCN-CHZ-PDA` ("3 July Test School 1") opened from "My school accounts" BY KEY. Staff tab open at `/admin/admin/org_perf_testschool_1/staff`. |
| **Test Steps** | 1. Click the `First name` column header.<br>2. Read the indicator and the First name column. |
| **Test Data** | — |
| **Expected Result** | The `First name` header reads `sorted ascending`, the rows are ordered by first name ascending, and the indicator is removed from `Last name`. |
| **Remarks** | — |
| **Actual Result** | *(blank in design)* |
| **Status** | Pass |
| **Comments / Defect ID** | *(blank in design)* |

---

| Field | Value |
|---|---|
| **S.No.** | 16 |
| **Test Case ID** | TST_STFL_TC_16 |
| **Title** | Verify the list is re-ordered by email address when the Email address column header is clicked |
| **Linked Requirement** | #5 — Verify sort by last name/first name/email address/Role |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as school admin `testt1@mailsac.com` on thor. School `FCN-CHZ-PDA` ("3 July Test School 1") opened from "My school accounts" BY KEY. Staff tab open at `/admin/admin/org_perf_testschool_1/staff`. |
| **Test Steps** | 1. Click the `Email address` column header.<br>2. Read the indicator and the Email address column. |
| **Test Data** | — |
| **Expected Result** | The `Email address` header reads `sorted ascending` and the rows are ordered by email ascending. |
| **Remarks** | Unlike the Students tab, the `sorted ascending` / `sorted descending` text IS inside the header button on every Staff column — the Students-tab Email/Username trap does not apply here. Verified live 2026-08-24. |
| **Actual Result** | *(blank in design)* |
| **Status** | Pass |
| **Comments / Defect ID** | *(blank in design)* |

---

| Field | Value |
|---|---|
| **S.No.** | 17 |
| **Test Case ID** | TST_STFL_TC_17 |
| **Title** | Verify the list is grouped by role when the Role column header is clicked |
| **Linked Requirement** | #5 — Verify sort by last name/first name/email address/Role |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as school admin `testt1@mailsac.com` on thor. School `FCN-CHZ-PDA` ("3 July Test School 1") opened from "My school accounts" BY KEY. Staff tab open at `/admin/admin/org_perf_testschool_1/staff`. |
| **Test Steps** | 1. Click the `Role` column header.<br>2. Read the indicator and the Role column. |
| **Test Data** | — |
| **Expected Result** | The `Role` header reads `sorted ascending` and all `Administrator/Teacher` rows sort before all `Teacher` rows. |
| **Remarks** | Verified live 2026-08-24 — three `Administrator/Teacher` rows led the list. Role sort exists only on the Staff tab. |
| **Actual Result** | *(blank in design)* |
| **Status** | Pass |
| **Comments / Defect ID** | *(blank in design)* |

---

| Field | Value |
|---|---|
| **S.No.** | 18 |
| **Test Case ID** | TST_STFL_TC_18 |
| **Title** | Verify the Role sort reverses when the Role column header is clicked a second time |
| **Linked Requirement** | #5 — Verify sort by last name/first name/email address/Role |
| **Type** | Edge |
| **Priority** | Medium |
| **Preconditions** | Logged in as school admin `testt1@mailsac.com` on thor. School `FCN-CHZ-PDA` ("3 July Test School 1") opened from "My school accounts" BY KEY. Staff tab open at `/admin/admin/org_perf_testschool_1/staff`. The list is sorted by Role ascending. |
| **Test Steps** | 1. Click the `Role` column header again.<br>2. Read the indicator and the Role column. |
| **Test Data** | — |
| **Expected Result** | The header reads `sorted descending` and `Teacher` rows now sort before `Administrator/Teacher` rows. |
| **Remarks** | Verified live 2026-08-24. |
| **Actual Result** | *(blank in design)* |
| **Status** | Pass |
| **Comments / Defect ID** | *(blank in design)* |

---

| Field | Value |
|---|---|
| **S.No.** | 19 |
| **Test Case ID** | TST_STFL_TC_19 |
| **Title** | Verify the previous sort indicator is cleared when a different column takes over the sort |
| **Linked Requirement** | #5 — Verify sort by last name/first name/email address/Role |
| **Type** | Edge |
| **Priority** | Medium |
| **Preconditions** | Logged in as school admin `testt1@mailsac.com` on thor. School `FCN-CHZ-PDA` ("3 July Test School 1") opened from "My school accounts" BY KEY. Staff tab open at `/admin/admin/org_perf_testschool_1/staff`. |
| **Test Steps** | 1. Click `Role` (it becomes `sorted ascending`).<br>2. Click `First name`.<br>3. Read all four column headers. |
| **Test Data** | — |
| **Expected Result** | Only `First name` carries a sort indicator; `Role` no longer carries one. Exactly one column is ever indicated. |
| **Remarks** | — |
| **Actual Result** | *(blank in design)* |
| **Status** | Pass |
| **Comments / Defect ID** | *(blank in design)* |

---

| Field | Value |
|---|---|
| **S.No.** | 20 |
| **Test Case ID** | TST_STFL_TC_20 |
| **Title** | Verify sorting orders values by code point when last names mix upper and lower case |
| **Linked Requirement** | #5 — Verify sort by last name/first name/email address/Role |
| **Type** | Edge |
| **Priority** | Medium |
| **Preconditions** | Logged in as school admin `testt1@mailsac.com` on thor. School `FCN-CHZ-PDA` ("3 July Test School 1") opened from "My school accounts" BY KEY. Staff tab open at `/admin/admin/org_perf_testschool_1/staff`. |
| **Test Steps** | 1. Ensure the list is sorted by `Last name` ascending.<br>2. Click `Load more ...` until it disappears.<br>3. Read the Last name column top to bottom. |
| **Test Data** | — |
| **Expected Result** | Ordering is by code point, not locale — every capitalised last name precedes every lower-case one. Observed order: `21aug, Ln, Perf Test, T1, User, gg, ln, s, teacher, teacher9752`. A `localeCompare` expectation is wrong against this product. |
| **Remarks** | Verified live 2026-08-24. Same collation rule as the Classes and Students tabs (`admin-shared.md` §A4). |
| **Actual Result** | *(blank in design)* |
| **Status** | Pass |
| **Comments / Defect ID** | *(blank in design)* |

---

| Field | Value |
|---|---|
| **S.No.** | 21 |
| **Test Case ID** | TST_STFL_TC_21 |
| **Title** | Verify the list returns to the first page of 20 when the sort column is changed after Load more |
| **Linked Requirement** | #5 — Verify sort by last name/first name/email address/Role |
| **Type** | Edge |
| **Priority** | Medium |
| **Preconditions** | Logged in as school admin `testt1@mailsac.com` on thor. School `FCN-CHZ-PDA` ("3 July Test School 1") opened from "My school accounts" BY KEY. Staff tab open at `/admin/admin/org_perf_testschool_1/staff`. `Load more ...` has been clicked so the full list is rendered and the link has gone. |
| **Test Steps** | 1. Click any column header to change the sort.<br>2. Count the rendered rows and look for `Load more ...`. |
| **Test Data** | — |
| **Expected Result** | The list is truncated back to the first 20 rows in the new order and `Load more ...` is present again. |
| **Remarks** | **[EXTRA — Phase 1 exclusion]** Not present in the other team's reviewed sheet (`Admin_Gap_Analysis.xlsx`, status "Extra in Ours"). **This case will NOT be automated in Phase 1** — exclude it from the Phase 1 automation scope; revisit for a later phase. Verified live 2026-08-24 — sorting resets pagination. |
| **Actual Result** | *(blank in design)* |
| **Status** | *(blank in design — Not Run)* |
| **Comments / Defect ID** | *(blank in design)* |

---

### Requirement #6 — Verify Load More

| Field | Value |
|---|---|
| **S.No.** | 22 |
| **Test Case ID** | TST_STFL_TC_23 |
| **Title** | Verify the next page of staff is appended when Load more is clicked |
| **Linked Requirement** | #6 — Verify Load More |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as school admin `testt1@mailsac.com` on thor. School `FCN-CHZ-PDA` ("3 July Test School 1") opened from "My school accounts" BY KEY. Staff tab open at `/admin/admin/org_perf_testschool_1/staff`. The school holds more than 20 staff, so 20 rows are rendered and `Load more ...` is present. |
| **Test Steps** | 1. Note the number of rendered rows (20).<br>2. Click `Load more ...`.<br>3. Count the rows again. |
| **Test Data** | — |
| **Expected Result** | Further staff rows are appended below the existing 20; the existing rows are not replaced and the sort order is preserved. |
| **Remarks** | Page size is 20, verified live 2026-08-24. |
| **Actual Result** | *(blank in design)* |
| **Status** | Pass |
| **Comments / Defect ID** | *(blank in design)* |

---

| Field | Value |
|---|---|
| **S.No.** | 23 |
| **Test Case ID** | TST_STFL_TC_24 |
| **Title** | Verify the Load more control is removed when the whole staff list has been loaded |
| **Linked Requirement** | #6 — Verify Load More |
| **Type** | Edge |
| **Priority** | Medium |
| **Preconditions** | Logged in as school admin `testt1@mailsac.com` on thor. School `FCN-CHZ-PDA` ("3 July Test School 1") opened from "My school accounts" BY KEY. Staff tab open at `/admin/admin/org_perf_testschool_1/staff`. |
| **Test Steps** | 1. Click `Load more ...` repeatedly until no further rows are appended.<br>2. Look for the `Load more ...` control. |
| **Test Data** | — |
| **Expected Result** | `Load more ...` is **removed from the page**, not merely disabled. An automated check must assert absence, not a disabled state. |
| **Remarks** | Verified live 2026-08-24. Same behaviour as the Classes and Students tabs. |
| **Actual Result** | *(blank in design)* |
| **Status** | Pass |
| **Comments / Defect ID** | *(blank in design)* |

---

| Field | Value |
|---|---|
| **S.No.** | 24 |
| **Test Case ID** | TST_STFL_TC_25 |
| **Title** | Verify the Load more control is absent when a search returns fewer results than one page |
| **Linked Requirement** | #6 — Verify Load More |
| **Type** | Edge |
| **Priority** | Medium |
| **Preconditions** | Logged in as school admin `testt1@mailsac.com` on thor. School `FCN-CHZ-PDA` ("3 July Test School 1") opened from "My school accounts" BY KEY. Staff tab open at `/admin/admin/org_perf_testschool_1/staff`. |
| **Test Steps** | 1. Search `gg` (2 results).<br>2. Look for `Load more ...`.<br>3. Click `Clear`.<br>4. Look for `Load more ...` again. |
| **Test Data** | `gg` |
| **Expected Result** | `Load more ...` is absent while the two-row result set is shown, and reappears after `Clear` restores the full list. |
| **Remarks** | Verified live 2026-08-24. |
| **Actual Result** | *(blank in design)* |
| **Status** | Pass |
| **Comments / Defect ID** | *(blank in design)* |

---

| Field | Value |
|---|---|
| **S.No.** | 25 |
| **Test Case ID** | TST_STFL_TC_26 |
| **Title** | Verify the heading count matches the number of staff rows when the whole list has been loaded |
| **Linked Requirement** | #6 — Verify Load More |
| **Type** | Negative |
| **Priority** | High |
| **Preconditions** | Logged in as school admin `testt1@mailsac.com` on thor. School `FCN-CHZ-PDA` ("3 July Test School 1") opened from "My school accounts" BY KEY. Staff tab open at `/admin/admin/org_perf_testschool_1/staff`. |
| **Test Steps** | 1. Read the count in the heading `Staff (N)`.<br>2. Click `Load more ...` until it is removed from the page.<br>3. Count the rendered staff rows.<br>4. Compare the two numbers. |
| **Test Data** | — |
| **Expected Result** | **Expected:** the number of rendered rows equals the heading count. **Actual (verified live 2026-08-24):** the heading read `Staff (23)` but the exhausted list rendered only **21** unique rows — a shortfall of 2 with `Load more ...` already removed. |
| **Remarks** | **[EXTRA — Phase 1 exclusion]** Not present in the other team's reviewed sheet (`Admin_Gap_Analysis.xlsx`, status "Extra in Ours"). **This case will NOT be automated in Phase 1** — exclude it from the Phase 1 automation scope; revisit for a later phase. Expected-versus-actual — **a real defect**, discussed with the team 2026-08-24. The shortfall is **not** explained by pending invitations: the team confirmed `Staff (N)` increments only when an invited teacher **accepts**, so invited-but-not-joined staff are not counted. The cause is therefore **unexplained**, and may be specific to this school's data. Because the school is shared, automate this as "heading count equals rendered row count", never as the literal numbers 23 and 21 — and expect this case to **fail on `FCN-CHZ-PDA`** until the data or the defect is fixed. |
| **Actual Result** | *(blank in design)* |
| **Status** | *(blank in design — Not Run)* |
| **Comments / Defect ID** | *(blank in design)* |

---

### Requirement #13 — Verify count of teachers increase on adding a new teacher

| Field | Value |
|---|---|
| **S.No.** | 26 |
| **Test Case ID** | TST_STFL_TC_27 |
| **Title** | Verify the staff count increases when a new teacher joins the school |
| **Linked Requirement** | #13 — Verify count of teachers increase on adding a new teacher |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as school admin `testt1@mailsac.com` on thor. School `FCN-CHZ-PDA` ("3 July Test School 1") opened from "My school accounts" BY KEY. Staff tab open at `/admin/admin/org_perf_testschool_1/staff`. A mailsac/yopmail address not already on the school is available. |
| **Test Steps** | 1. Note the count in `Staff (N)`.<br>2. Go to `Manage staff` > `Add new teachers to classes` and send an invitation to a new teacher email with role Teacher and a valid class key.<br>3. Accept the invitation from the mailbox and complete sign-up.<br>4. Return to the Staff tab and reload.<br>5. Read `Staff (N)` and search for the new teacher. |
| **Test Data** | Email: `AutoStaff_<timestamp>@mailsac.com`; Class key: `<VALID_THOR_CLASS_KEY>` |
| **Expected Result** | After the invitation is **accepted** the count in `Staff (N)` is one higher than the value noted in step 1 and the new teacher appears in the list with role `Teacher`. The count does **not** move when the invitation is merely sent — it increments **only on acceptance** `[confirmed with the team 2026-08-24]`. |
| **Remarks** | **Sends real email and creates a real account** — mailsac/yopmail addresses only, prefix `AutoStaff_`. The count **timing is now confirmed** (acceptance, not invitation), so this case is no longer `[ASSUMED]` on that point; what remains unverified is the end-to-end run itself. Note `TST_STFL_TC_26`: the heading count and the rendered rows already disagree by 2 on this school, so assert the **delta** on the count, not the row total. |
| **Actual Result** | *(blank in design)* |
| **Status** | *(blank in design — Not Run)* |
| **Comments / Defect ID** | *(blank in design)* |

---

### Requirement #7 — Verify View Profile launch

| Field | Value |
|---|---|
| **S.No.** | 27 |
| **Test Case ID** | TST_STFP_TC_1 |
| **Title** | Verify the staff profile opens with all expected details when View profile is used on a teacher |
| **Linked Requirement** | #7 — Verify View Profile launch |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as school admin `testt1@mailsac.com` on thor. School `FCN-CHZ-PDA` ("3 July Test School 1") opened from "My school accounts" BY KEY. Staff tab open at `/admin/admin/org_perf_testschool_1/staff`. |
| **Test Steps** | 1. Locate the row `ln | teacher17aug2026 | teacher17aug2026@mailsac.com | Teacher`.<br>2. Click the row to open its action menu.<br>3. Click `View profile`. |
| **Test Data** | Teacher: `teacher17aug2026@mailsac.com` |
| **Expected Result** | The profile opens at `/admin/admin/org_<slug>/profile/<orgUuid>/<userId>` showing: a `Back` link; the initials avatar; the heading `ln, teacher17aug2026` (Last name, First name); the role `Teacher`; the email `teacher17aug2026@mailsac.com`; `Last login <date>`; a `Manage account` menu; and the classes section. |
| **Remarks** | The row itself is the menu toggle — the whole row is a button with `data-toggle="dropdown"`, and the menu holds exactly ONE item, `View profile`. There is no "Activate course materials" item as there is on the Students tab. `teacher17aug2026@mailsac.com` is the **team-nominated teacher fixture** for this school `[confirmed with the team 2026-08-24]`. |
| **Actual Result** | *(blank in design)* |
| **Status** | *(blank in design — Not Run)* |
| **Comments / Defect ID** | *(blank in design)* |

---

| Field | Value |
|---|---|
| **S.No.** | 28 |
| **Test Case ID** | TST_STFP_TC_2 |
| **Title** | Verify the role is shown as Administrator/Teacher when the profile of an administrator is opened |
| **Linked Requirement** | #7 — Verify View Profile launch |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as school admin `testt1@mailsac.com` on thor. School `FCN-CHZ-PDA` ("3 July Test School 1") opened from "My school accounts" BY KEY. Staff tab open at `/admin/admin/org_perf_testschool_1/staff`. |
| **Test Steps** | 1. Locate the row `gg | testteacher18 | testteacher18oct@mailsac.com | Administrator/Teacher`.<br>2. Open its action menu and click `View profile`. |
| **Test Data** | Administrator: `testteacher18oct@mailsac.com` |
| **Expected Result** | The profile shows the heading `gg, testteacher18` and the role line reads `Administrator/Teacher`, matching the Role column on the list. |
| **Remarks** | Verified live 2026-08-24. |
| **Actual Result** | *(blank in design)* |
| **Status** | *(blank in design — Not Run)* |
| **Comments / Defect ID** | *(blank in design)* |

---

| Field | Value |
|---|---|
| **S.No.** | 29 |
| **Test Case ID** | TST_STFP_TC_3 |
| **Title** | Verify the Staff tab is restored when Back is clicked on a staff profile |
| **Linked Requirement** | #7 — Verify View Profile launch |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as school admin `testt1@mailsac.com` on thor. School `FCN-CHZ-PDA` ("3 July Test School 1") opened from "My school accounts" BY KEY. Staff tab open at `/admin/admin/org_perf_testschool_1/staff`. A staff profile has been opened via the row action menu > "View profile" (the profile URL is NOT deep-linkable, so a staff profile cannot be reached directly). |
| **Test Steps** | 1. Click `Back`.<br>2. Observe the page. |
| **Test Data** | — |
| **Expected Result** | The Staff tab is shown again at `/admin/admin/org_<slug>/staff`, in its default state — heading `Staff (N)`, sorted by Last name ascending, first page of 20 rows. |
| **Remarks** | **[EXTRA — Phase 1 exclusion]** Not present in the other team's reviewed sheet (`Admin_Gap_Analysis.xlsx`, status "Extra in Ours"). **This case will NOT be automated in Phase 1** — exclude it from the Phase 1 automation scope; revisit for a later phase. Verified live 2026-08-24. Any search or sort applied before opening the profile is NOT preserved on return — check this explicitly during Phase 1 if a test depends on it. |
| **Actual Result** | *(blank in design)* |
| **Status** | *(blank in design — Not Run)* |
| **Comments / Defect ID** | *(blank in design)* |

---

| Field | Value |
|---|---|
| **S.No.** | 30 |
| **Test Case ID** | TST_STFP_TC_4 |
| **Title** | Verify an empty-state message is shown when the staff member belongs to no classes |
| **Linked Requirement** | #7 — Verify View Profile launch |
| **Type** | Edge |
| **Priority** | Medium |
| **Preconditions** | Logged in as school admin `testt1@mailsac.com` on thor. School `FCN-CHZ-PDA` ("3 July Test School 1") opened from "My school accounts" BY KEY. Staff tab open at `/admin/admin/org_perf_testschool_1/staff`. |
| **Test Steps** | 1. Open the profile of `teacher17aug2026@mailsac.com`, who teaches no classes.<br>2. Read the classes section. |
| **Test Data** | Teacher with no classes: `teacher17aug2026@mailsac.com` |
| **Expected Result** | The classes section shows `No class` with `Your classes will appear here` and an `Add classes` control, instead of a `Classes (N)` list. |
| **Remarks** | **[EXTRA — Phase 1 exclusion]** Not present in the other team's reviewed sheet (`Admin_Gap_Analysis.xlsx`, status "Extra in Ours"). **This case will NOT be automated in Phase 1** — exclude it from the Phase 1 automation scope; revisit for a later phase. Verified live 2026-08-24 on two separate profiles. `[ASSUMED]` that `teacher17aug2026@mailsac.com` also has no classes — confirm on the first run and swap the fixture if it does. |
| **Actual Result** | *(blank in design)* |
| **Status** | *(blank in design — Not Run)* |
| **Comments / Defect ID** | *(blank in design)* |

---

| Field | Value |
|---|---|
| **S.No.** | 31 |
| **Test Case ID** | TST_STFP_TC_6 |
| **Title** | Verify a user-visible error is shown and the page stays usable when the profile request fails |
| **Linked Requirement** | #7 — Verify View Profile launch |
| **Type** | Negative |
| **Priority** | Medium |
| **Preconditions** | Logged in as school admin `testt1@mailsac.com` on thor. School `FCN-CHZ-PDA` ("3 July Test School 1") opened from "My school accounts" BY KEY. Staff tab open at `/admin/admin/org_perf_testschool_1/staff`. |
| **Test Steps** | 1. Locate the row `Perf Test | tch_L_20240705-095330_1_FCN-CHZ-PDA | ...@yopmail.com | Teacher`.<br>2. Open its action menu and click `View profile`.<br>3. Observe the page for any error message.<br>4. Without reloading, try to click a different staff row.<br>5. Check the network panel for the `getUserDetailWithClasses` response. |
| **Test Data** | Known-bad data fixture: `tch_L_20240705-095330_1_FCN-CHZ-PDA@yopmail.com` |
| **Expected Result** | **Expected:** the user sees an error explaining that the profile could not be loaded, and the Staff list remains usable — a different row can still be opened. **Actual (verified live 2026-08-24):** nothing is shown at all, the app silently stays on the list, and the `#loader-container` overlay is left visible so every subsequent row click is intercepted until the page is reloaded. |
| **Remarks** | **[EXTRA — Phase 1 exclusion]** Not present in the other team's reviewed sheet (`Admin_Gap_Analysis.xlsx`, status "Extra in Ours"). **This case will NOT be automated in Phase 1** — exclude it from the Phase 1 automation scope; revisit for a later phase. Expected-versus-actual, scoped to **client-side error handling only**. The underlying **HTTP 500** from `getUserDetailWithClasses` is a **known DATA issue** on this one account — *confirmed with the team 2026-08-24* — and is **not** part of this case; do not raise it as a product defect. What remains product-side is that any 500 produces no message and a stuck overlay. The bad account is retained deliberately as the trigger fixture. Compare the Students-tab case `TST_SPRF_TC_7`, where the same class of failure shows an infinite spinner instead of a silent no-op. |
| **Actual Result** | *(blank in design)* |
| **Status** | *(blank in design — Not Run)* |
| **Comments / Defect ID** | *(blank in design)* |

---

### Requirement #8 — Verify class launch from view profile page

| Field | Value |
|---|---|
| **S.No.** | 32 |
| **Test Case ID** | TST_STFP_TC_7 |
| **Title** | Verify the class page opens when a class is clicked on a staff profile |
| **Linked Requirement** | #8 — Verify class launch from view profile page |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as school admin `testt1@mailsac.com` on thor. School `FCN-CHZ-PDA` ("3 July Test School 1") opened from "My school accounts" BY KEY. Staff tab open at `/admin/admin/org_perf_testschool_1/staff`. |
| **Test Steps** | 1. Open the profile of `testt1@mailsac.com` (`T1, Test`), which shows `Classes (3)`.<br>2. Click the class name `A11y test`.<br>3. Observe the page. |
| **Test Data** | Staff with classes: `testt1@mailsac.com`; class `A11y test`, key `iCmL-9Y8J` |
| **Expected Result** | The class page opens at `/class/teacher/org_<slug>/class/<uuid>/view`, settling on `/view/classdata`, with `h1` reading the class name `A11y test` and the browser tab reading `A11y test | Cambridge One`. |
| **Remarks** | Verified live 2026-08-24. Each listed class is a real link (`user-profile-6-<index>`). **Contrast with the student profile, where the umbrella name is plain text with no link** — do not assume the two profiles behave alike. Crossing from `admin` to `class` is a full page load, not an Angular route change; budget for it. |
| **Actual Result** | *(blank in design)* |
| **Status** | *(blank in design — Not Run)* |
| **Comments / Defect ID** | *(blank in design)* |

---

| Field | Value |
|---|---|
| **S.No.** | 33 |
| **Test Case ID** | TST_STFP_TC_8 |
| **Title** | Verify each listed class shows its dates, join date and class key on a staff profile |
| **Linked Requirement** | #8 — Verify class launch from view profile page |
| **Type** | Edge |
| **Priority** | Medium |
| **Preconditions** | Logged in as school admin `testt1@mailsac.com` on thor. School `FCN-CHZ-PDA` ("3 July Test School 1") opened from "My school accounts" BY KEY. Staff tab open at `/admin/admin/org_perf_testschool_1/staff`. |
| **Test Steps** | 1. Open the profile of `testt1@mailsac.com`.<br>2. Read the `Classes (3)` section. |
| **Test Data** | Staff with classes: `testt1@mailsac.com` |
| **Expected Result** | The heading reads `Classes (N)` and each entry shows the class name, its date range, `Date joined: <date>`, `Class key: <key>` and the course material name — e.g. `A11y test` / `Jul 11, 2025 - Jul 10, 2026` / `Date joined: Jul 11, 2025` / `Class key: iCmL-9Y8J` / `Collaborate 3 (NLP)`. |
| **Remarks** | **[EXTRA — Phase 1 exclusion]** Not present in the other team's reviewed sheet (`Admin_Gap_Analysis.xlsx`, status "Extra in Ours"). **This case will NOT be automated in Phase 1** — exclude it from the Phase 1 automation scope; revisit for a later phase. Verified live 2026-08-24. Launching an **ended** class shows the class page with the banner `As this class ended over a month ago, you can no longer reactivate it.` and a `Class ended` status. |
| **Actual Result** | *(blank in design)* |
| **Status** | *(blank in design — Not Run)* |
| **Comments / Defect ID** | *(blank in design)* |

---

### Requirement #9 — Verify Grant admin rights

| Field | Value |
|---|---|
| **S.No.** | 34 |
| **Test Case ID** | TST_STFP_TC_9 |
| **Title** | Verify Grant admin rights is offered when Manage account is opened on a teacher |
| **Linked Requirement** | #9 — Verify Grant admin rights |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as school admin `testt1@mailsac.com` on thor. School `FCN-CHZ-PDA` ("3 July Test School 1") opened from "My school accounts" BY KEY. Staff tab open at `/admin/admin/org_perf_testschool_1/staff`. The profile of a staff member whose role is `Teacher` is open. |
| **Test Steps** | 1. Click `Manage account`.<br>2. Read the menu items. |
| **Test Data** | Teacher: `teacher19oct@mailsac.com` |
| **Expected Result** | The menu holds exactly two items — `Grant admin rights` and `Remove from school account`. `Remove admin rights` is NOT offered. |
| **Remarks** | Verified live 2026-08-24. The menu is role-conditional: `Grant admin rights` appears only for a `Teacher`. |
| **Actual Result** | *(blank in design)* |
| **Status** | *(blank in design — Not Run)* |
| **Comments / Defect ID** | *(blank in design)* |

---

| Field | Value |
|---|---|
| **S.No.** | 35 |
| **Test Case ID** | TST_STFP_TC_10 |
| **Title** | Verify the role changes to Administrator/Teacher when admin rights are granted to a teacher |
| **Linked Requirement** | #9 — Verify Grant admin rights |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as school admin `testt1@mailsac.com` on thor. School `FCN-CHZ-PDA` ("3 July Test School 1") opened from "My school accounts" BY KEY. Staff tab open at `/admin/admin/org_perf_testschool_1/staff`. The profile of a staff member whose role is `Teacher` is open, and that staff member was created by this suite. |
| **Test Steps** | 1. Click `Manage account` > `Grant admin rights`.<br>2. Complete any confirmation that appears.<br>3. Read the role line on the profile.<br>4. Click `Back` and read the Role column for that staff member. |
| **Test Data** | A `Teacher` created by this suite |
| **Expected Result** | The role changes to `Administrator/Teacher` on both the profile and the Staff list row. [ASSUMED] — the confirmation step, its copy, and whether a confirmation dialog exists at all are unverified. |
| **Remarks** | [ASSUMED]. **Mutating** — changes a real person's permissions; run only against an account this suite created. Unlike the revoke flow, **no "Grant admin rights?" dialog is pre-rendered on the profile**, so either the action is immediate or its dialog is injected on demand. Resolve this in Phase 1 before automating; do not click Grant on a shared account to find out. |
| **Actual Result** | *(blank in design)* |
| **Status** | *(blank in design — Not Run)* |
| **Comments / Defect ID** | *(blank in design)* |

---

### Requirement #11 — Verify revoke admin rights

| Field | Value |
|---|---|
| **S.No.** | 36 |
| **Test Case ID** | TST_STFP_TC_11 |
| **Title** | Verify Remove admin rights is offered when Manage account is opened on an administrator |
| **Linked Requirement** | #11 — Verify revoke admin rights |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as school admin `testt1@mailsac.com` on thor. School `FCN-CHZ-PDA` ("3 July Test School 1") opened from "My school accounts" BY KEY. Staff tab open at `/admin/admin/org_perf_testschool_1/staff`. The profile of a staff member whose role is `Administrator/Teacher` is open. |
| **Test Steps** | 1. Click `Manage account`.<br>2. Read the menu items. |
| **Test Data** | Administrator: `testteacher18oct@mailsac.com` |
| **Expected Result** | The menu holds exactly two items — `Remove admin rights` and `Remove from school account`. `Grant admin rights` is NOT offered. |
| **Remarks** | Verified live 2026-08-24. |
| **Actual Result** | *(blank in design)* |
| **Status** | *(blank in design — Not Run)* |
| **Comments / Defect ID** | *(blank in design)* |

---

| Field | Value |
|---|---|
| **S.No.** | 37 |
| **Test Case ID** | TST_STFP_TC_12 |
| **Title** | Verify admin rights are retained when the Remove admin rights confirmation is cancelled |
| **Linked Requirement** | #11 — Verify revoke admin rights |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as school admin `testt1@mailsac.com` on thor. School `FCN-CHZ-PDA` ("3 July Test School 1") opened from "My school accounts" BY KEY. Staff tab open at `/admin/admin/org_perf_testschool_1/staff`. The profile of an `Administrator/Teacher` is open. |
| **Test Steps** | 1. Click `Manage account` > `Remove admin rights`.<br>2. Read the dialog.<br>3. Click `No, keep admin rights`.<br>4. Read the role line on the profile. |
| **Test Data** | Administrator: `testteacher18oct@mailsac.com` |
| **Expected Result** | The dialog is headed `Remove admin rights?` and reads `<First name> <Last name> will no longer have admin rights, but will still remain a teacher in your school`, with buttons `No, keep admin rights` and `Yes, remove admin rights`. After `No, keep admin rights` the dialog closes and the role still reads `Administrator/Teacher`. |
| **Remarks** | Verified live 2026-08-24, including the cancel path — this case is **non-mutating and safe to run freely**. The dialog body is personalised with the staff member's name in `<First name> <Last name>` order, although the profile heading uses `Last name, First name`. |
| **Actual Result** | *(blank in design)* |
| **Status** | *(blank in design — Not Run)* |
| **Comments / Defect ID** | *(blank in design)* |

---

| Field | Value |
|---|---|
| **S.No.** | 38 |
| **Test Case ID** | TST_STFP_TC_13 |
| **Title** | Verify the role changes to Teacher when admin rights are removed and the action is confirmed |
| **Linked Requirement** | #11 — Verify revoke admin rights |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as school admin `testt1@mailsac.com` on thor. School `FCN-CHZ-PDA` ("3 July Test School 1") opened from "My school accounts" BY KEY. Staff tab open at `/admin/admin/org_perf_testschool_1/staff`. The profile of an `Administrator/Teacher` created by this suite is open. |
| **Test Steps** | 1. Click `Manage account` > `Remove admin rights`.<br>2. Click `Yes, remove admin rights`.<br>3. Read the role line on the profile.<br>4. Click `Back` and read the Role column for that staff member.<br>5. Re-open `Manage account`. |
| **Test Data** | An `Administrator/Teacher` created by this suite |
| **Expected Result** | The role changes to `Teacher` on both the profile and the Staff list row, and `Manage account` now offers `Grant admin rights` instead of `Remove admin rights`. [ASSUMED] — the confirm path was deliberately not exercised on a shared account. |
| **Remarks** | [ASSUMED]. **Mutating** — run only against an account this suite created. |
| **Actual Result** | *(blank in design)* |
| **Status** | *(blank in design — Not Run)* |
| **Comments / Defect ID** | *(blank in design)* |

---

| Field | Value |
|---|---|
| **S.No.** | 39 |
| **Test Case ID** | TST_STFP_TC_14 |
| **Title** | Verify the administrator can reach Remove admin rights on their own staff profile |
| **Linked Requirement** | #11 — Verify revoke admin rights |
| **Type** | Edge |
| **Priority** | Medium |
| **Preconditions** | Logged in as school admin `testt1@mailsac.com` on thor. School `FCN-CHZ-PDA` ("3 July Test School 1") opened from "My school accounts" BY KEY. Staff tab open at `/admin/admin/org_perf_testschool_1/staff`. The profile of the signed-in administrator `testt1@mailsac.com` is open. |
| **Test Steps** | 1. Click `Manage account`.<br>2. Read the menu items.<br>3. Do NOT confirm. |
| **Test Data** | Own account: `testt1@mailsac.com` |
| **Expected Result** | `Remove admin rights` and `Remove from school account` are both offered on the administrator's own profile — the product does not exclude the signed-in user from either action. |
| **Remarks** | **[EXTRA — Phase 1 exclusion]** Not present in the other team's reviewed sheet (`Admin_Gap_Analysis.xlsx`, status "Extra in Ours"). **This case will NOT be automated in Phase 1** — exclude it from the Phase 1 automation scope; revisit for a later phase. Verified live 2026-08-24 (menu inspected only). **Never confirm either action on this account** — it is the login used by every admin suite, and self-revoking would lock the whole programme out. Worth raising: should self-revocation and self-removal be prevented, or at least warned about? |
| **Actual Result** | *(blank in design)* |
| **Status** | *(blank in design — Not Run)* |
| **Comments / Defect ID** | *(blank in design)* |

---

### Requirement #10 — Verify remove from school account

| Field | Value |
|---|---|
| **S.No.** | 40 |
| **Test Case ID** | TST_STFP_TC_15 |
| **Title** | Verify the removal confirmation explains the consequence when Remove from school account is opened |
| **Linked Requirement** | #10 — Verify remove from school account |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as school admin `testt1@mailsac.com` on thor. School `FCN-CHZ-PDA` ("3 July Test School 1") opened from "My school accounts" BY KEY. Staff tab open at `/admin/admin/org_perf_testschool_1/staff`. A staff profile has been opened via the row action menu > "View profile" (the profile URL is NOT deep-linkable, so a staff profile cannot be reached directly). |
| **Test Steps** | 1. Click `Manage account` > `Remove from school account`.<br>2. Read the dialog. |
| **Test Data** | — |
| **Expected Result** | The dialog is headed `Remove from school account` and reads `This staff member will no longer have access to your school account or any of its classes. They can still use their account independently from your school`, with the confirmation checkbox `I confirm I want to remove this staff member from my school account` and the buttons `No, cancel` and `Yes, remove`. |
| **Remarks** | Captured verbatim from the pre-rendered DOM and confirmed by opening the dialog, 2026-08-24. Opening and cancelling is non-mutating. |
| **Actual Result** | *(blank in design)* |
| **Status** | *(blank in design — Not Run)* |
| **Comments / Defect ID** | *(blank in design)* |

---

| Field | Value |
|---|---|
| **S.No.** | 41 |
| **Test Case ID** | TST_STFP_TC_17 |
| **Title** | Verify the staff member is retained when the removal confirmation is cancelled |
| **Linked Requirement** | #10 — Verify remove from school account |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as school admin `testt1@mailsac.com` on thor. School `FCN-CHZ-PDA` ("3 July Test School 1") opened from "My school accounts" BY KEY. Staff tab open at `/admin/admin/org_perf_testschool_1/staff`. A staff profile has been opened via the row action menu > "View profile" (the profile URL is NOT deep-linkable, so a staff profile cannot be reached directly). The `Remove from school account` dialog is open. |
| **Test Steps** | 1. Click `No, cancel`.<br>2. Observe the profile.<br>3. Click `Back` and search for the staff member. |
| **Test Data** | — |
| **Expected Result** | The dialog closes, the profile is unchanged and the staff member is still listed on the Staff tab. |
| **Remarks** | Verified live 2026-08-24 — non-mutating and safe to run freely. |
| **Actual Result** | *(blank in design)* |
| **Status** | *(blank in design — Not Run)* |
| **Comments / Defect ID** | *(blank in design)* |

---

| Field | Value |
|---|---|
| **S.No.** | 42 |
| **Test Case ID** | TST_STFP_TC_18 |
| **Title** | Verify the staff member is removed from the school when the removal is confirmed |
| **Linked Requirement** | #10 — Verify remove from school account |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as school admin `testt1@mailsac.com` on thor. School `FCN-CHZ-PDA` ("3 July Test School 1") opened from "My school accounts" BY KEY. Staff tab open at `/admin/admin/org_perf_testschool_1/staff`. The profile of a staff member **created by this suite** is open. |
| **Test Steps** | 1. Click `Manage account` > `Remove from school account`.<br>2. Tick the confirmation checkbox.<br>3. Click `Yes, remove`.<br>4. Observe the resulting screen.<br>5. Return to the Staff tab and search for the staff member. |
| **Test Data** | A staff member created by this suite (prefix `AutoStaff_`) |
| **Expected Result** | The staff member no longer appears on the Staff tab and the `Staff (N)` count decreases by one. [ASSUMED] — the post-confirmation screen, whether the removal is synchronous or reported later, and whether an email report is sent are all unverified. |
| **Remarks** | [ASSUMED]. **Destructive.** ⚠️ Never remove a staff member this suite did not create. Unlike student removal there is no pre-rendered "in progress" or email-report dialog on this screen, which suggests staff removal may be synchronous — confirm in Phase 1 rather than assuming. |
| **Actual Result** | *(blank in design)* |
| **Status** | *(blank in design — Not Run)* |
| **Comments / Defect ID** | *(blank in design)* |

---

| Field | Value |
|---|---|
| **S.No.** | 43 |
| **Test Case ID** | TST_STFP_TC_16 |
| **Title** | Verify the Yes, remove button is unavailable until the confirmation checkbox is ticked |
| **Linked Requirement** | #10 — Verify remove from school account |
| **Type** | Edge |
| **Priority** | High |
| **Preconditions** | Logged in as school admin `testt1@mailsac.com` on thor. School `FCN-CHZ-PDA` ("3 July Test School 1") opened from "My school accounts" BY KEY. Staff tab open at `/admin/admin/org_perf_testschool_1/staff`. A staff profile has been opened via the row action menu > "View profile" (the profile URL is NOT deep-linkable, so a staff profile cannot be reached directly). The `Remove from school account` dialog is open. |
| **Test Steps** | 1. Observe `Yes, remove` with the checkbox unticked.<br>2. Tick `I confirm I want to remove this staff member from my school account`.<br>3. Observe `Yes, remove` again.<br>4. Untick the checkbox and observe once more. |
| **Test Data** | — |
| **Expected Result** | `Yes, remove` is presented as unavailable while the box is unticked, becomes available when it is ticked, and returns to unavailable when it is unticked again. |
| **Remarks** | Verified live 2026-08-24. **Automation trap:** the button is disabled by CSS class only — it carries the class `disabled` while its native `disabled` property stays `false`, so a `toBeDisabled()` assertion is a false green. Assert on the class (`admin-shared.md` §B4). |
| **Actual Result** | *(blank in design)* |
| **Status** | *(blank in design — Not Run)* |
| **Comments / Defect ID** | *(blank in design)* |

---

### Requirement #12 — Verify Bulk feature > Add new teachers to classes form

| Field | Value |
|---|---|
| **S.No.** | 44 |
| **Test Case ID** | TST_STFB_TC_1 |
| **Title** | Verify the invitation form opens when Add new teachers to classes is chosen from Manage staff |
| **Linked Requirement** | #12 — Verify Bulk feature > Add new teachers to classes form |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as school admin `testt1@mailsac.com` on thor. School `FCN-CHZ-PDA` ("3 July Test School 1") opened from "My school accounts" BY KEY. Staff tab open at `/admin/admin/org_perf_testschool_1/staff`. |
| **Test Steps** | 1. Click `Manage staff`.<br>2. Read the menu items.<br>3. Click `Add new teachers to classes`. |
| **Test Data** | — |
| **Expected Result** | The `Manage staff` menu holds exactly one item, `Add new teachers to classes`. Clicking it opens `/admin/admin/org_<slug>/email/invite`, headed `Invite students and teachers` / `to <school name>`. |
| **Remarks** | Verified live 2026-08-24. Note the Staff tab has **no** "add existing", no bulk activation and no bulk removal — the Students tab has all three. The destination is a **shared students-and-teachers** invite form, not a teacher-only form. |
| **Actual Result** | *(blank in design)* |
| **Status** | *(blank in design — Not Run)* |
| **Comments / Defect ID** | *(blank in design)* |

---

| Field | Value |
|---|---|
| **S.No.** | 45 |
| **Test Case ID** | TST_STFB_TC_2 |
| **Title** | Verify the invitation form shows all expected controls and columns when it is opened |
| **Linked Requirement** | #12 — Verify Bulk feature > Add new teachers to classes form |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | The invitation form is open at `/admin/admin/org_<slug>/email/invite`. |
| **Test Steps** | 1. Read the controls above the grid.<br>2. Read the grid column headers.<br>3. Read the submit button label. |
| **Test Data** | — |
| **Expected Result** | The form shows `Back`, `Upload file`, `Get CSV template`, a `How to use this form` help control, a `N Selected` counter, `Select all classes - N Selected`, and the bulk actions `Add role`, `+ Add class key` and `Remove`. The grid columns are `Email | First name (optional) | Last name (optional) | Role | Class key`, and the submit button reads `Send N invites`, counting the populated rows. |
| **Remarks** | Verified live 2026-08-24. Only Email, Role and Class key are effectively required — First name and Last name are labelled `(optional)`. |
| **Actual Result** | *(blank in design)* |
| **Status** | *(blank in design — Not Run)* |
| **Comments / Defect ID** | *(blank in design)* |

---

| Field | Value |
|---|---|
| **S.No.** | 46 |
| **Test Case ID** | TST_STFB_TC_3 |
| **Title** | Verify the CSV template downloads when Get CSV template is clicked |
| **Linked Requirement** | #12 — Verify Bulk feature > Add new teachers to classes form |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | The invitation form is open. |
| **Test Steps** | 1. Click `Get CSV template`.<br>2. Open the downloaded file.<br>3. Compare its header row with the grid columns. |
| **Test Data** | — |
| **Expected Result** | A CSV template named `Add_students_template.csv` downloads. Its header row is exactly `Email,First name (optional),Last name (optional),Role,Class key` — matching the on-screen grid columns in the same order. It also carries one example row: `e.g. pgarcia@email.com,e.g. Pedro,e.g. Garcia,e.g Student,e.g. 1a2B-2C4d`. |
| **Remarks** | Downloaded and verified live 2026-08-24 — this expected result is **no longer `[ASSUMED]`**. The file is UTF-8 with a BOM and CRLF line endings; the saved copy sits alongside this register as `Add_students_template.csv`. Two copy points worth raising: the file is named `Add_**students**_template.csv` even when downloaded from the Staff tab route, and the Role example reads `e.g Student` with **no full stop after "e.g"**, unlike the other four columns. |
| **Actual Result** | *(blank in design)* |
| **Status** | *(blank in design — Not Run)* |
| **Comments / Defect ID** | *(blank in design)* |

---

| Field | Value |
|---|---|
| **S.No.** | 47 |
| **Test Case ID** | TST_STFB_TC_4 |
| **Title** | Verify the help panel explains the form when How to use this form is opened |
| **Linked Requirement** | #12 — Verify Bulk feature > Add new teachers to classes form |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | The invitation form is open. |
| **Test Steps** | 1. Click the `How to use this form` help control.<br>2. Read the panel. |
| **Test Data** | — |
| **Expected Result** | The panel opens and states the 200-record limit, verbatim: `You can add individual or multiple students (up to 200) manually or by uploading records from a CSV file:` · `Your CSV file can have up to 200 records` · `If we find any errors in the file we’ll show you, and you can correct them in the form.` It also links `Use this CSV template` and gives the whitelisting tip for `noreply@cambridgeone.org`. |
| **Remarks** | Captured verbatim live 2026-08-24. **Copy defect to raise:** the whole panel is worded for students only — it opens `Use the form to add students who are 16 or over to classes…` and never mentions teachers, although the form is headed `Invite students and teachers` and is the only route the Staff tab offers. |
| **Actual Result** | *(blank in design)* |
| **Status** | *(blank in design — Not Run)* |
| **Comments / Defect ID** | *(blank in design)* |

---

| Field | Value |
|---|---|
| **S.No.** | 48 |
| **Test Case ID** | TST_STFB_TC_10 |
| **Title** | Verify the invitations are sent and confirmed when Send invites is clicked with valid rows |
| **Linked Requirement** | #12 — Verify Bulk feature > Add new teachers to classes form |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | The invitation form is open with valid teacher rows entered against a real class key. |
| **Test Steps** | 1. Complete one or more rows with a teacher email, role and valid class key.<br>2. Click `Send N invites`.<br>3. Read the confirmation dialog. |
| **Test Data** | Email: `AutoStaff_<timestamp>@mailsac.com`; Role: teacher; Class key: `<VALID_THOR_CLASS_KEY>` |
| **Expected Result** | A confirmation dialog is shown reading `N students/teachers invited to school Account` with `You can track responses in the pending section for each class.As students/teachers accept your invitation they will appear on your dashboard`, the question `Would you like a record of the invitations sent?` and the controls `Back to dashboard` and `Download record`. |
| **Remarks** | Dialog copy captured verbatim from the pre-rendered DOM, 2026-08-24; the send itself was not performed. **Sends real email** — mailsac/yopmail addresses only, prefix `AutoStaff_`. Two copy defects visible in this dialog: `school Account` (stray capital A) and the missing space after `each class.` |
| **Actual Result** | *(blank in design)* |
| **Status** | *(blank in design — Not Run)* |
| **Comments / Defect ID** | *(blank in design)* |

---

| Field | Value |
|---|---|
| **S.No.** | 49 |
| **Test Case ID** | TST_STFB_TC_5 |
| **Title** | Verify the bulk row actions are unavailable when no rows are selected |
| **Linked Requirement** | #12 — Verify Bulk feature > Add new teachers to classes form |
| **Type** | Edge |
| **Priority** | Medium |
| **Preconditions** | The invitation form is open with no row checkboxes ticked. |
| **Test Steps** | 1. Confirm the counter reads `0 Selected`.<br>2. Observe `Add role`, `+ Add class key` and `Remove`. |
| **Test Data** | — |
| **Expected Result** | All three bulk actions are presented as unavailable while `0 Selected` is shown. |
| **Remarks** | **[EXTRA — Phase 1 exclusion]** Not present in the other team's reviewed sheet (`Admin_Gap_Analysis.xlsx`, status "Extra in Ours"). **This case will NOT be automated in Phase 1** — exclude it from the Phase 1 automation scope; revisit for a later phase. Verified live 2026-08-24. **Automation trap:** these three controls carry **no `qid`** and are disabled by the CSS class `disable` (not `disabled`, and with no native disabled property). Resolve them by their text and assert on the class. |
| **Actual Result** | *(blank in design)* |
| **Status** | *(blank in design — Not Run)* |
| **Comments / Defect ID** | *(blank in design)* |

---

| Field | Value |
|---|---|
| **S.No.** | 50 |
| **Test Case ID** | TST_STFB_TC_6 |
| **Title** | Verify a previously saved draft is restored when the invitation form is re-opened |
| **Linked Requirement** | #12 — Verify Bulk feature > Add new teachers to classes form |
| **Type** | Edge |
| **Priority** | High |
| **Preconditions** | A draft invitation has previously been entered on this form and left unsent. |
| **Test Steps** | 1. Open `Manage staff` > `Add new teachers to classes`.<br>2. Observe the grid rows and the area above it. |
| **Test Data** | — |
| **Expected Result** | The form is **not empty** — the previously entered rows are restored, a `Saved <age>` indicator is shown (e.g. `Saved 30+ days ago`), the submit button counts the restored rows, and any validation messages on those rows are already displayed. |
| **Remarks** | **[EXTRA — Phase 1 exclusion]** Not present in the other team's reviewed sheet (`Admin_Gap_Analysis.xlsx`, status "Extra in Ours"). **This case will NOT be automated in Phase 1** — exclude it from the Phase 1 automation scope; revisit for a later phase. Verified live 2026-08-24 — the form opened showing `Saved 30+ days ago`, four restored rows and live validation messages. Same auto-save/restore behaviour as the Create new classes form (`admin-shared.md` §A4). **A test that assumes an empty form will fail**, and the draft is shared state on a shared school — do not assume your own suite wrote it. |
| **Actual Result** | *(blank in design)* |
| **Status** | *(blank in design — Not Run)* |
| **Comments / Defect ID** | *(blank in design)* |

---

| Field | Value |
|---|---|
| **S.No.** | 51 |
| **Test Case ID** | TST_STFB_TC_7 |
| **Title** | Verify the submit button is unavailable while any invitation row is incomplete |
| **Linked Requirement** | #12 — Verify Bulk feature > Add new teachers to classes form |
| **Type** | Edge |
| **Priority** | High |
| **Preconditions** | The invitation form is open with at least one row missing a required value. |
| **Test Steps** | 1. Leave a row without a role or without a valid class key.<br>2. Observe the `Send N invites` button. |
| **Test Data** | — |
| **Expected Result** | The `Send N invites` button is unavailable while any row fails validation. |
| **Remarks** | **[EXTRA — Phase 1 exclusion]** Not present in the other team's reviewed sheet (`Admin_Gap_Analysis.xlsx`, status "Extra in Ours"). **This case will NOT be automated in Phase 1** — exclude it from the Phase 1 automation scope; revisit for a later phase. Verified live 2026-08-24 — the button was both natively disabled and carried the `disabled` class in this state. |
| **Actual Result** | *(blank in design)* |
| **Status** | *(blank in design — Not Run)* |
| **Comments / Defect ID** | *(blank in design)* |

---

| Field | Value |
|---|---|
| **S.No.** | 52 |
| **Test Case ID** | TST_STFB_TC_9 |
| **Title** | Verify a CSV of teacher records populates the grid when it is uploaded |
| **Linked Requirement** | #12 — Verify Bulk feature > Add new teachers to classes form |
| **Type** | Edge |
| **Priority** | High |
| **Preconditions** | The invitation form is open and a CSV in the downloaded template format is available. |
| **Test Steps** | 1. Click `Upload file`.<br>2. Choose the CSV.<br>3. Wait for the progress dialog to complete.<br>4. Read the grid. |
| **Test Data** | `TST_STFB_TC_9_teachers.csv` |
| **Expected Result** | The grid is populated with one row per CSV record, up to the 200-record limit, with the `Role` cell set to `Teacher` and the `Class key` carried through. Upload populates the form only — invitations are sent solely by `Send N invites`, so this case **creates nothing and sends no email**. |
| **Remarks** | Fixture written 2026-08-24 from the **real downloaded template**, headers verified. It omits the template's example row and uses class key `wLE3-zTx6` (`AutoClass_CreateOnly`, active Aug 24 2026 – Sep 15 2026) — an auto-created class this programme already owns. **If that class has been swept, substitute any active class key from the Classes tab.** `[ASSUMED]` whether the `Role` value must be exactly `Teacher` (the template example uses `Student`) and whether the example row must be removed before upload — resolve both on the first run. During upload the product shows `Please wait, this may takea few minutes` — **note the missing space in "takea"**, a copy defect to raise. On failure it shows `Sorry, your file could not be uploaded` with the `ptsupport@cambridge.org` contact. |
| **Actual Result** | *(blank in design)* |
| **Status** | *(blank in design — Not Run)* |
| **Comments / Defect ID** | Unblocked 2026-08-24 — the CSV template was downloaded with the user's approval and `TST_STFB_TC_9_teachers.csv` written in its exact format. |

---

| Field | Value |
|---|---|
| **S.No.** | 53 |
| **Test Case ID** | TST_STFB_TC_8 |
| **Title** | Verify per-field validation messages are shown when invitation rows are incomplete or invalid |
| **Linked Requirement** | #12 — Verify Bulk feature > Add new teachers to classes form |
| **Type** | Negative |
| **Priority** | High |
| **Preconditions** | The invitation form is open. |
| **Test Steps** | 1. Leave the Role cell of a populated row empty.<br>2. Enter an invalid class key in another row.<br>3. Leave the Email cell of a row that has a role empty.<br>4. Read the messages under each cell. |
| **Test Data** | Invalid class key: `notakey` |
| **Expected Result** | The messages are shown verbatim: `Select student or teacher` under an empty Role, `Enter a valid class key` under an invalid Class key, and `Add a teacher’s email` under an empty Email on a teacher row. |
| **Remarks** | **[EXTRA — Phase 1 exclusion]** Not present in the other team's reviewed sheet (`Admin_Gap_Analysis.xlsx`, status "Extra in Ours"). **This case will NOT be automated in Phase 1** — exclude it from the Phase 1 automation scope; revisit for a later phase. All three captured verbatim live 2026-08-24 from a restored draft. `Add a teacher’s email` confirms the form does distinguish the teacher case even though its help copy does not. |
| **Actual Result** | *(blank in design)* |
| **Status** | *(blank in design — Not Run)* |
| **Comments / Defect ID** | *(blank in design)* |

---

| Field | Value |
|---|---|
| **S.No.** | 54 |
| **Test Case ID** | TST_STFB_TC_11 |
| **Title** | Verify translated text is shown when the form upload error dialog is raised |
| **Linked Requirement** | #12 — Verify Bulk feature > Add new teachers to classes form |
| **Type** | Negative |
| **Priority** | High |
| **Preconditions** | The invitation form is open. |
| **Test Steps** | 1. Trigger the form upload error state.<br>2. Read the dialog heading, body and close control. |
| **Test Data** | — |
| **Expected Result** | **Expected:** the dialog reads `Form not uploaded` / `An unexpected error occured. Please try again.` / `Close` — the strings the product already ships. **Actual (verified in the pre-rendered DOM, 2026-08-24):** it renders three raw translation keys — `ADMIN.LEARNER.ADULT_INVITE.FORM_UPLOAD_ERROR_HEADING` as the heading, `ADMIN.LEARNER.ADULT_INVITE.FORM_UPLOAD_ERROR_INFO` as the body and `ADMIN.LEARNER.ADULT_INVITE.FORM_UPLOAD_ERROR_CLOSE` as the close control. |
| **Remarks** | **[EXTRA — Phase 1 exclusion]** Not present in the other team's reviewed sheet (`Admin_Gap_Analysis.xlsx`, status "Extra in Ours"). **This case will NOT be automated in Phase 1** — exclude it from the Phase 1 automation scope; revisit for a later phase. Expected-versus-actual. **Root cause established from the admin bundle, 2026-08-24:** the modal is `#existingChildFormUploadErrorModal`, a component reused from the add-existing-children CSV flow, but on this page it looks its copy up under `ADMIN.LEARNER.ADULT_INVITE`. The `FORM_UPLOAD_ERROR_*` strings are defined **only** under `ADMIN.LEARNER.EXISTING_CHILD` and `ADMIN.LEARNER.BULK_ACTIVATION` (in both `en` and `es`) — the `ADULT_INVITE` block exists but does not define them, so ngx-translate falls back to printing the key. Changing site language does not help; Spanish has the same gap. **Control test:** the same dialog on the add-existing-children CSV screen renders correctly, which is why this has gone unnoticed. Note the correct string carries the known `occured` typo already recorded in `admin-students-tab.md`. Found by free-capture of the pre-rendered DOM (`admin-shared.md` §A6) before the state was ever reached. **Raise with the product owner.** |
| **Actual Result** | *(blank in design)* |
| **Status** | **Blocked** |
| **Comments / Defect ID** | **Blocked** at design time — the dialog is present in the pre-rendered DOM but the condition that raises it has not been reproduced, so the case cannot be executed end to end. The **root cause is known** (missing `ADULT_INVITE` translation keys — see Remarks). **Unblock:** force the invitation form upload to fail — DevTools → Network → block the upload request, or go offline mid-upload — and confirm which of the three error modals is raised; if it is `#existingChildFormUploadErrorModal` rather than `#errorFileUploadModal` or `#somethingWentWrongModal`, the case is runnable. |

---

| Field | Value |
|---|---|
| **S.No.** | 55 |
| **Test Case ID** | TST_STFB_TC_12 |
| **Title** | Verify the browser tab title names the correct area when the invitation form is opened from the Staff tab |
| **Linked Requirement** | #12 — Verify Bulk feature > Add new teachers to classes form |
| **Type** | Negative |
| **Priority** | Low |
| **Preconditions** | Logged in as school admin `testt1@mailsac.com` on thor. School `FCN-CHZ-PDA` ("3 July Test School 1") opened from "My school accounts" BY KEY. Staff tab open at `/admin/admin/org_perf_testschool_1/staff`. |
| **Test Steps** | 1. Click `Manage staff` > `Add new teachers to classes`.<br>2. Read the browser tab title. |
| **Test Data** | — |
| **Expected Result** | **Expected:** a title naming staff or the invitation form. **Actual (verified live 2026-08-24):** the tab reads `Students | Cambridge One`, even though the page was reached from the Staff tab and is headed `Invite students and teachers`. |
| **Remarks** | **[EXTRA — Phase 1 exclusion]** Not present in the other team's reviewed sheet (`Admin_Gap_Analysis.xlsx`, status "Extra in Ours"). **This case will NOT be automated in Phase 1** — exclude it from the Phase 1 automation scope; revisit for a later phase. Expected-versus-actual, low severity. Consistent with `TST_STFB_TC_4` — the shared invite form is presented as a students screen throughout. Group both with the product owner as one copy/labelling issue rather than two. |
| **Actual Result** | *(blank in design)* |
| **Status** | *(blank in design — Not Run)* |
| **Comments / Defect ID** | *(blank in design)* |

---

| Field | Value |
|---|---|
| **S.No.** | 56 |
| **Test Case ID** | TST_STFP_TC_19 |
| **Title** | Verify a newly promoted administrator can actually open the admin console |
| **Linked Requirement** | #9 — Verify Grant admin rights |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | A disposable teacher account exists whose password the tester controls, currently without admin rights. |
| **Test Steps** | 1. As an administrator, open the teacher's staff profile > **Manage account** > **Grant admin rights** and confirm. 2. Verify the role now reads Administrator/Teacher. 3. Sign out. 4. Sign in as that user. 5. Open the school and confirm the admin console and its tabs are reachable. |
| **Test Data** | Disposable teacher `<DISPOSABLE_STAFF_ACCOUNT>` on the target school. |
| **Expected Result** | After the grant, the user can sign in and reach the admin console for that school, seeing the administrator tabs. `[ASSUMED]` |
| **Remarks** | Added 2026-09-01 from the other team's TC_STF_009, whose step 3 is "log in as that user and confirm admin console access". Our `TST_STFP_TC_10` stops at the role **label** changing in the UI — which a grant that updated the display but not the permission would also satisfy. This is the same shape as the Students password gap (`TST_SPRF_TC_23`): we verify the UI acknowledged the change, not that the change took effect. **Mutates a real account** — data-mutating suite, and revoke the rights afterwards as housekeeping. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** |  |

---

| Field | Value |
|---|---|
| **S.No.** | 57 |
| **Test Case ID** | TST_STFP_TC_20 |
| **Title** | Verify admin rights cannot be revoked from the only remaining administrator |
| **Linked Requirement** | #11 — Verify revoke admin rights |
| **Type** | Negative |
| **Priority** | High |
| **Preconditions** | A school whose staff list contains **exactly one** administrator. |
| **Test Steps** | 1. Open the sole administrator's staff profile > **Manage account**. 2. Attempt **Remove admin rights**. 3. Read whether the control is unavailable or the action is blocked, and the message shown. 4. Re-read the role afterwards. |
| **Test Data** | A school with a single administrator. |
| **Expected Result** | The action is prevented — the control is unavailable, or it is blocked with a message explaining the school must retain at least one administrator — and the role is unchanged afterwards. `[ASSUMED]` |
| **Remarks** | Added 2026-09-01 from the other team's TC_STF_011_N1. No counterpart existed anywhere in our register. Related but distinct from `TST_STFP_TC_14`, which checks an administrator can **reach** Remove admin rights on their own profile — this one checks what happens when doing so would leave the school with none. |
| **Actual Result** | |
| **Status** | Blocked |
| **Comments / Defect ID** | Blocked at design time (skill rule 4): the precondition is a school with exactly one administrator. `3 July Test School 1` is shared and has several, and reducing it to one would break other suites. Unblock with a dedicated single-admin school. |

---
## Open items / `[ASSUMED]` to confirm on the next live pass

1. **Grant admin rights confirmation** (`TST_STFP_TC_10`): no "Grant admin rights?" dialog is pre-rendered on the profile, unlike the revoke dialog. Either the action is immediate or its dialog is injected on demand. Confirm on a suite-created account — **do not** click Grant on a shared account to find out.
2. **Revoke and removal outcomes** (`TST_STFP_TC_13`, `TST_STFP_TC_18`): the confirm paths were deliberately not exercised on shared accounts. Whether staff removal is synchronous, and whether an email report is sent, is unknown — no "in progress" dialog is pre-rendered, which suggests it may be synchronous, unlike student removal.
3. ~~**CSV template headers** (`TST_STFB_TC_3`, `TST_STFB_TC_9`): `Get CSV template` was not downloaded.~~ — **RESOLVED 2026-08-24.** Downloaded with the user's approval. Headers are `Email,First name (optional),Last name (optional),Role,Class key`; `TST_STFB_TC_9_teachers.csv` written in that exact format and `TST_STFB_TC_9` unblocked. What remains open is the exact accepted `Role` value and whether the template's example row must be deleted before upload — both cheap to settle on the first run.
4. **The form upload error trigger** (`TST_STFB_TC_11`): the dialog exists in the DOM and its **root cause is now known** (missing `ADULT_INVITE` translation keys), but the condition that raises it has still not been reproduced. Try forcing the upload request to fail from DevTools and see which of the three error modals appears.
5. **The invitation Role picker** (`TST_STFB_TC_2`, `TST_STFB_TC_10`): the per-row Role field is a text input holding `student` by default, and the bulk `Choose role for selected invitations` modal is empty until opened. The selectable role values were not captured.
6. **Whitespace-only search** (`TST_STFL_TC_10`): expected result carried over from the Students tab, not exercised here.
7. ~~**Staff count semantics** (`TST_STFL_TC_27`, `TST_STFL_TC_26`): whether `Staff (N)` counts invited-but-not-joined staff.~~ — **RESOLVED 2026-08-24.** The team confirmed the count increments **only when an invited teacher accepts**; pending invitations are not counted. This **rules out** the leading theory for the 23-vs-21 gap in `TST_STFL_TC_26`, which is therefore a real defect with an unexplained cause.
11. **A different school for the Staff tab is under consideration** `[raised by the user 2026-08-24, pending]`. The 23-vs-21 discrepancy may be specific to `FCN-CHZ-PDA`'s data, which would make `TST_STFL_TC_26` fail here for reasons unrelated to the product. If a replacement school is provided, re-ground the counts, re-capture the fixtures in the Product reference section, and re-check `TST_STFL_TC_26` on it before treating the shortfall as a product defect.
8. **Sort persistence**: whether the Staff sort survives a page reload. The Classes tab's sort does not; the Classes filter and search do.
9. **Cold-session deep link**: whether `/admin/admin/org_<slug>/staff` still loads with no prior school selection in the session. It loads within a warm session.
10. **Field length limits**: no `maxlength` anywhere on these screens, so no boundary case exists for First name, Last name, Email or Class key. Measure the server-side limits in Phase 1, then add the cases — do not invent a number.
12. **Self-revocation and self-removal** (`TST_STFP_TC_14`) — **the user is checking with the team** `[2026-08-24, pending]`. An administrator is offered both `Remove admin rights` and `Remove from school account` on their own profile, with no additional warning. If it is by design, `TST_STFP_TC_14` stands as written (menu inspection only). If it is not, the case becomes an expected-versus-actual defect and the expected result must change. **Do not automate a confirm path on the signed-in account either way** — it is the login for every admin suite.

---

## Handoff to automation

| | |
|---|---|
| Module codes → page objects | `STFL` → `schoolStaff.page.js` · `STFP` → `staffProfile.page.js` · `STFB` → `bulkStaff.page.js` (chosen from the future page objects per AGENTS.md Rule 6, so **no re-mapping is owed**) |
| Side-effect free — start here | all `STFL` except `TC_27`; `STFP` 1–4, 6–9, 11, 12, 14–17; `STFB` 1, 2, 4, 5, 6, 7, 8, 12 — **about 43 cases with no data risk** |
| Mutates real data | `STFP_TC_10` (grant), `TC_13` (revoke), `TC_18` (removal); `STFB_TC_3` (downloads a file), `TC_9` (upload), `TC_10` (sends invitations); `STFL_TC_27` |
| Sends real email | `STFB_TC_10` and, downstream, `STFL_TC_27` — mailsac/yopmail addresses only |
| Sweepable prefix | **`AutoStaff_`** (extends the list in `admin-shared.md` §A7) |

⚠️ **Never revoke rights from, or remove, a staff member this suite did not create** — and never either action against `testt1@mailsac.com`, which is the login account for every admin suite (`TST_STFP_TC_14`).

Automation continues in **`c1-test-authoring` Phase 1**.

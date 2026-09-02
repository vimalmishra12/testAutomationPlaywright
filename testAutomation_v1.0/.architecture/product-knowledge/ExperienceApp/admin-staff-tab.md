# Admin App — Staff tab (school-admin)

> Per-screen knowledge for the Cambridge One Admin App **Staff** tab and everything reachable
> from it: the staff profile, grant/remove admin rights, removal from the school account, and the
> bulk invitation form.
>
> Read **with** `admin-shared.md` — everything true of *every* admin screen lives there and is not
> repeated here.
>
> **Living document.** Append, never overwrite. Mark anything not confirmed live `[ASSUMED]`.
> Date significant updates `[YYYY-MM-DD]`.
>
> **Seeded [2026-08-24]** from the Staff-tab manual-design grounding pass
> (`test/Manual/C1App/AdminApp-Staff/`), Thor · school `FCN-CHZ-PDA`.

---

## 1. Modules and routes

| Module | Future page object | Screens |
|---|---|---|
| `STFL` | `schoolStaff` | Staff tab list, search, sort, user guide, load more |
| `STFP` | `staffProfile` | View profile, grant / remove admin rights, remove from school account |
| `STFB` | `bulkStaff` | The `Add new teachers to classes` invitation form |

```
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

> **The Staff tab URL is reachable directly** within a session whose school context is already set —
> unlike `/admin/admin/org_<slug>/class`, which returns `/dashboard/error`. Cold-session behaviour is
> `[ASSUMED]`. `[2026-08-24]`

> ⚠️ **A staff profile URL is NOT deep-linkable.** Opened directly it collapses to `/admin/` and
> renders a blank page with no error. **Reach a staff profile through the list, always** — an
> automated shortcut straight to the URL will land on a blank page and fail confusingly.
>
> **This is accepted behaviour, not a defect** — deep-linking is not handled by the development
> team `[user, 2026-08-24]`, and the manual case that asserted it (`TST_STFP_TC_5`) has been
> withdrawn. Note it anyway, because the **student** profile URL *is* deep-linkable in the same
> conditions (`admin-students-tab.md` §1) — the two sibling screens do not behave alike, so a
> suite ported from the Students tab will break here. `[2026-08-24]`

> Opening a class from a staff profile crosses from the `admin` microfrontend to `class`. That is a
> full page load, not an Angular route change. `[2026-08-24]`

---

## 2. Product behaviour (manual-design relevant)

### How the Staff tab differs from the Students tab

These two tabs look alike and are not. Every row here was verified live `[2026-08-24]`.

| | Students tab | **Staff tab** |
|---|---|---|
| Columns | Last name · First name · Email address or Username | Last name · First name · Email address · **Role** |
| Username accounts | yes (children) | **none** — no Username column, no username sort. The source scenario list said "sort by username"; that was a **typo** for *email address* `[user, 2026-08-24]`. |
| Default sort | First name ascending | **Last name ascending** |
| Row checkboxes / `N Selected` / bulk remove | yes | **none** |
| Row action menu | 2 items (View student profile, Activate course materials) | **1 item** (View profile) |
| `Manage …` menu | 3 items (add new, add existing, bulk activate) | **1 item** (Add new teachers to classes) |
| Course materials / activation | yes | **none anywhere on the Staff screens** |
| Editing the account (password, personal info) | yes, via Manage account | **none** — Manage account offers only rights and removal |
| No-results search | renders **nothing** (defect) | renders a proper empty-state message |
| Profile URL deep-linkable | yes | **no** — accepted, not a defect |
| Class name on the profile | plain text, not a link | **is a link**, launches the class page |

### List

- Heading `Staff (N)`. **The count and the rendered rows disagree** — see §5. The count increments **only when an invited teacher accepts**; pending invitations are not counted `[confirmed with the team 2026-08-24]`.
- Role values: `Teacher`, `Administrator/Teacher`. Also exposed in the row's accessible name
  (`Row3 Administrator Last name … Role Administrator/Teacher Action Menu`).
- **Page size 20**; `Load more ...` is **removed from the DOM** when exhausted, and absent entirely
  for a result set of ≤ 20.
- **Changing the sort resets pagination** back to the first 20 with `Load more ...` restored.
- **Collation is by code point, not locale** — observed ascending on Last name:
  `21aug, Ln, Perf Test, T1, User, gg, ln, s, teacher, teacher9752`. Every capitalised value
  precedes every lower-case one. A `localeCompare` expectation is wrong, as on the Classes and
  Students tabs.
- Every column toggles ascending ⇄ descending on repeat clicks; taking over a column removes the
  indicator from the previous one. Only one column is ever indicated.

### Search

- One box, placeholder `Search by first name, last name or email` — **no username dimension**.
- **Submit-driven, not live**: typing alone does nothing; the `Search` button click is required.
  Settles ~1–2 s.
- Case-insensitive and partial-matching; `@` and other special characters match literally.
- The heading swaps from `Staff (N)` to `Staff` plus the banner
  `Showing search results for <term>.` and `Clear`. The term is echoed **preserving its case**, and
  the count disappears while a search is active.
- `Clear` restores the count heading, empties the box and restores `Load more ...`.
- **A no-results search renders a proper empty-state message here** — unlike the Students tab, which
  renders nothing at all. See §3 for the exact copy and §5 for the wording defect in it.

### Staff profile

- Heading is **`Last name, First name`**; beneath it the **role**, then the email, then
  `Last login <date>` (a bare time such as `11:05` when the login was today, `Mon, YYYY` otherwise).
- `Manage account` is **role-conditional** — `Grant admin rights` (`user-profile-4`) for a
  `Teacher`, `Remove admin rights` (`user-profile-3`) for an `Administrator/Teacher`, plus
  `Remove from school account` (`user-profile-5`) for both.
- **The signed-in administrator's own profile offers both `Remove admin rights` and
  `Remove from school account`** — the product does not exclude the current user from either.
  ⚠️ Never confirm either on `testt1@mailsac.com`; it is the login for every admin suite.
- `Classes (N)` lists each class with its date range, `Date joined:`, `Class key:` and course
  material name. **The class name is a real link** (`user-profile-6-<index>`).
- With no classes the section reads `No class` / `Your classes will appear here` / `Add classes`.
- **There is no "Edit account details"** — staff passwords and personal details are not editable
  from the Admin App, so none of the Gigya screen-set traps from the Students tab apply here.

### Removing rights and removing staff

- **`Remove admin rights`** raises a confirmation naming the person, and cancelling leaves the role
  untouched (verified). The confirm path was not exercised.
- **No `Grant admin rights?` dialog is pre-rendered**, unlike the revoke dialog — so grant is either
  immediate or its dialog is injected on demand. `[ASSUMED — unresolved]`
- **`Remove from school account`** raises a confirmation with a required tick-box. **No "in
  progress" or email-report dialog is pre-rendered**, which suggests staff removal may be
  synchronous — unlike student removal, which is asynchronous and reported only by email.
  `[ASSUMED — unresolved]`

### The invitation form (`Manage staff` → `Add new teachers to classes`)

- Lands on `/admin/admin/org_<slug>/email/invite`, headed **`Invite students and teachers`** —
  it is a **shared students-and-teachers form**, not teacher-specific, and it is the only bulk
  route the Staff tab offers.
- Controls: `Upload file`, `Get CSV template`, `How to use this form`, a `N Selected` counter,
  `Select all classes - N Selected`, and the bulk actions `Add role`, `+ Add class key`, `Remove`.
- Grid columns: `Email | First name (optional) | Last name (optional) | Role | Class key`.
  Submit reads `Send N invites`, counting the populated rows.
- **The form auto-saves and RESTORES a draft** — it is *not* empty on load, and it shows a
  `Saved <age>` indicator (`Saved 30+ days ago` at capture) with the restored rows' validation
  messages already displayed. Same behaviour as the Create-new-classes form
  (`admin-shared.md` §A4), and on a shared school the draft may not be yours.
- **200-record cap**, stated in the help panel.
- **CSV template** `[downloaded and verified 2026-08-24]` — `Get CSV template` serves a file named
  **`Add_students_template.csv`** (students, even on the Staff route). It is UTF-8 **with a BOM**,
  CRLF line endings, and holds one header row plus one example row:
  ```
  Email,First name (optional),Last name (optional),Role,Class key
  e.g. pgarcia@email.com,e.g. Pedro,e.g. Garcia,e.g Student,e.g. 1a2B-2C4d
  ```
  Note `e.g Student` — missing the full stop the other four columns have. Whether the example row
  must be deleted before upload, and whether `Role` accepts exactly `Teacher`, are `[ASSUMED]`.
  A ready fixture lives at `test/Manual/C1App/AdminApp-Staff/TST_STFB_TC_9_teachers.csv`.
- **No `maxlength` on any field** on any Staff screen — including the search box. Any length limit
  is server-side and unmeasured, so **no honest boundary case can be written yet**.

---

## 3. Copy verified live `[2026-08-24]`

| Where | Text |
|---|---|
| Search banner | `Showing search results for <term>.` |
| Search, no results | `This school has no administrators that match your search <term>. Please check the spelling or try a different search term` |
| User guide | `On this page you can:` · `Search for a teacher or administrator who has joined your school in Cambridge One` · `View profiles and manage their accounts` · `Remove staff members from your school account` · `Grant or remove administrator rights to teachers in your school` · `Tip: If the person you want to make an administrator has not yet joined your school, give them the school key you see above and ask them to sign up as a teacher and use the key. You can then give them admin rights` |
| Remove admin rights | `Remove admin rights?` / `<First> <Last> will no longer have admin rights, but will still remain a teacher in your school` / `No, keep admin rights` / `Yes, remove admin rights` |
| Remove from school | `Remove from school account` / `This staff member will no longer have access to your school account or any of its classes. They can still use their account independently from your school` / `I confirm I want to remove this staff member from my school account` / `No, cancel` / `Yes, remove` |
| Profile, no classes | `No class` / `Your classes will appear here` / `Add classes` |
| Class page, ended class | `As this class ended over a month ago, you can no longer reactivate it.` |
| Invitation form heading | `Invite students and teachers` / `to <school name>` |
| Invitation validation | `Select student or teacher` · `Enter a valid class key` · `Add a teacher’s email` |
| Invitation success | `N students/teachers invited to school Account` / `You can track responses in the pending section for each class.As students/teachers accept your invitation they will appear on your dashboard` / `Would you like a record of the invitations sent?` / `Back to dashboard` / `Download record` |
| Invitation upload progress | `Please wait, this may takea few minutes` / `Cancel upload` |
| Invitation upload failed | `Sorry, your file could not be uploaded` … `If that doesn’t work, email our Customer Services team at ptsupport@cambridge.org` |
| Invitation submit failed | `Sorry, something went wrong` / `We're unable to submit your form at the moment` / `Please check you're online and try again` |
| Invitation row removal | `Remove row?` / `This will delete the selected row` / `No, keep` / `Yes, remove` |
| Invitation bulk row removal | `Are you sure you want to remove selected rows?` / `This cannot be undone` / `No, don’t remove` / `Yes, remove rows` |
| Invitation draft saved | `Your progress has been saved` / `You can return later to complete the form` / `Stay on page` / `Leave page` |
| Invitation help panel | `Use the form to add students who are 16 or over to classes by sending them an email invitation.` … `Your CSV file can have up to 200 records` … `Tip: … add noreply@cambridgeone.org to the school’s whitelist` |

**Free-captured from the pre-rendered DOM** (`admin-shared.md` §A6), without reaching any of these
states: both staff-profile dialogs, and all **11** dialogs on the invitation form. That last capture
is how the untranslated `ADMIN.LEARNER.ADULT_INVITE.FORM_UPLOAD_ERROR_*` keys in §5 were found
*before* anyone triggered an upload error — the same technique, and the same class of finding, as the
Students-tab bulk-activation keys.

---

## 4. Automation traps (Part B material)

- **The whole row is the dropdown toggle** — `button.row-link`, `qid="aAdmin-16-<index>"`,
  `data-toggle="dropdown"`. The `View profile` item (`aAdmin-17-<index>`) is pre-rendered hidden once
  per row, so presence never proves the menu is open. Open the toggle first, then filter on
  visibility. Clicking the item directly fails with *"element is not visible"*.
- **Row identifiers are positional** and shift with sort, search and Load more. Resolve a row by its
  content, then act on it. They are at least **unique per row** here, unlike the Students tab where
  26 rows shared one `qid`.
- **The aria row numbers are offset by two** — row index `13` carries `aria-label="Row15 …"`
  (`Row1` is the header). Do not map the aria number onto the index.
- **The user guide toggle is a different element in each state** — `aAdmin-8` (`User guide`,
  no aria-label) collapsed, `aAdmin-9` (`Hide`, aria-label `Hide the user guide`) expanded. The panel
  itself is **genuinely removed from the DOM** when collapsed.
- **`Yes, remove` on the removal dialog is disabled by CSS class only** —
  `class="… disabled"` while the native `disabled` property stays `false`. A `toBeDisabled()`
  assertion is a false green. Ticking `removeTeacherFromSchoolModal-3` clears the class.
  Modal roots: `removeAdminModal-*`, `removeTeacherFromSchoolModal-*`.
- **The invitation form's bulk actions (`Add role`, `+ Add class key`, `Remove`) carry no `qid`**
  and are disabled via the class `disable` (not `disabled`). Resolve them by text.
- **Modal ids on the invitation form** (useful for both selectors and triage): `confirmRemoveRowModal`, `removeSelectedModal`, `confirmLeavePageModal`, `uploadingFileModal`, `errorFileUploadModal`, `successInviteLearnersModal`, `somethingWentWrongModal`, `existingChildFormUploadErrorModal`, `addUserClassKeyModal`, `removeSelectedRowModal`, `addUserRoleModal`. Note there are **three** distinct error modals — do not assume a failure raises the one you expect.
- **The invitation form's Role picker is a text input** (`aBulkActions-learner-<n>-7`,
  placeholder `Choose role`) holding `student` by default, and the bulk
  `Choose role for selected invitations` modal is **empty until opened** — its options are injected
  on demand and cannot be free-captured. Same for `Add class key to selected rows`.
- **A failed profile load leaves `#loader-container` visible**, intercepting every subsequent click
  until the page is reloaded. This turns one 500 into a cascade of unrelated timeouts.
- **The cookie banner intercepts row clicks** near the top of the list
  (`div.cookies-banner … intercepts pointer events`). A suite must dismiss or tolerate it. The
  CustomerGauge NPS survey noted for the Students tab was not seen this session but should still be
  tolerated.
- **Sort indicator text is inside the header button on every Staff column** — the Students-tab
  Email/Username trap (`admin-students-tab.md` §4) does **not** apply here.
- **The staff-list API rejects a hand-built `fetch`** with `403 {"code":"STALE_REQUEST"}` — the
  timestamp parameter is signed. Do not try to seed or read fixtures through the API.

---

## 5. Known defects found during grounding `[2026-08-24]`

Each is written up as an expected-versus-actual case in `test/Manual/C1App/AdminApp-Staff/`.

| # | What | Where |
|---|---|---|
| 1 | **A failed profile load is invisible and blocks the list.** When `getUserDetailWithClasses` fails, the app stays on the Staff list with **no error message** and leaves the loading overlay up, so every subsequent row click is intercepted until the page is reloaded. Reproduced with `Perf Test / tch_L_20240705-095330_1_FCN-CHZ-PDA`, whose **HTTP 500 is a known DATA issue confirmed with the team `[2026-08-24]` — the 500 itself is NOT a product defect.** What is product-side is the missing error handling and the stuck overlay, which any 500 would expose. | `TST_STFP_TC_6` |
| 2 | **The heading count and the list disagree.** The heading read `Staff (23)` while the fully-loaded list rendered **21** unique rows, `Load more ...` already removed. **Cause unexplained.** The obvious theory — pending invitations counted in the heading — is **ruled out**: the team confirmed `Staff (N)` increments only when an invited teacher **accepts** `[2026-08-24]`. May be specific to this school's data; a different school for the Staff tab is under consideration. | `TST_STFL_TC_26` |
| 3 | **The form upload error dialog renders three raw translation keys** — `ADMIN.LEARNER.ADULT_INVITE.FORM_UPLOAD_ERROR_HEADING`, `_INFO`, `_CLOSE` — instead of `Form not uploaded` / `An unexpected error occured. Please try again.` / `Close`. **Root cause `[2026-08-24]`:** the modal `#existingChildFormUploadErrorModal` is reused from the add-existing-children CSV flow but looks its copy up under `ADMIN.LEARNER.ADULT_INVITE`, where the `FORM_UPLOAD_ERROR_*` keys are **not defined** — they exist only under `ADMIN.LEARNER.EXISTING_CHILD` and `ADMIN.LEARNER.BULK_ACTIVATION`, in both `en` and `es`. The same dialog therefore renders correctly on the child CSV screen. Found in the pre-rendered DOM; the trigger condition is still not reproduced. | `TST_STFB_TC_11` |

**Copy defects, recorded in Remarks rather than as their own cases:**

- The no-results message says *"no **administrators** that match your search"* on a tab that lists
  teachers and administrators and searches both.
- The invitation form is headed `Invite students and teachers` but its help panel is worded for
  students only (*"add students who are 16 or over"*), and its browser tab reads
  `Students | Cambridge One` even when reached from the Staff tab.
- `Please wait, this may take**a** few minutes` — missing space.
- `invited to school **A**ccount` — stray capital; and a missing space after `each class.` in the
  same dialog.

**Open product question — the user is checking with the team `[2026-08-24, pending]`:** should an administrator be able to revoke their own admin rights, or
remove themselves from the school? Both are offered on their own profile with no additional warning.

---

## 6. Fixtures on `FCN-CHZ-PDA` (3 July Test School 1) `[2026-08-24]`

| Purpose | Staff member |
|---|---|
| **Teacher fixture — use this one** (team-nominated `[2026-08-24]`) | `ln, teacher17aug2026` · teacher17aug2026@mailsac.com |
| Teacher, no classes | `gg, teacher19oct` · teacher19oct@mailsac.com |
| Administrator/Teacher, no classes | `gg, testteacher18` · testteacher18oct@mailsac.com |
| Administrator/Teacher **with 3 classes** | `T1, Test` · testt1@mailsac.com — **the login account itself** |
| Profile that returns HTTP 500 — **known data issue**, kept only as the error-handling trigger | `Perf Test, tch_L_20240705-095330_1_FCN-CHZ-PDA` · …@yopmail.com |
| Last name shared by 2 staff (search fixture) | `gg` |
| Email domain shared by 9 staff (search fixture) | `@yopmail.com` |

**23 in the heading, 21 rendered, 3 of them `Administrator/Teacher` at capture.**

⚠️ **A different school for the Staff tab is under consideration** `[user, 2026-08-24 — pending]`, because the 23-vs-21 gap may be specific to this school's data. If one is provided, re-ground the counts and fixtures here before treating the shortfall as a product defect.

⚠️ **The only staff member on this school with classes is the login account.** Any test needing
"a teacher with classes" that is *not* the signed-in admin has **no fixture here yet** — either
create one, or accept that `TST_STFP_TC_7` exercises the admin's own profile.

The shared-school constraints in `admin-shared.md` §A5 apply in full — never assert an absolute
count, and never revoke rights from or remove a staff member this suite did not create. Anything the
Staff suites create uses the sweepable prefix **`AutoStaff_`**.

---

## 7. Automation selector capture and Phase 1 traps `[2026-09-02]`

Captured live on Thor / `FCN-CHZ-PDA` during the STFL Phase 1 build (module `STFL` →
`pages/ExperienceApp/schoolStaff.page.js`, selectors under
`css.ComproC1.schoolStaff`). Everything below was read from the running page, not inferred.

### 7.1 The page-scoping anchor

The Staff view renders inside a **`<staff>`** component tag — the exact sibling of the
Students tab's `<learner>`. The heading's ancestor chain is
`h2 › div › staff › … › dashboard › … › admin › app`. So `staff h2` is the unique anchor;
a bare `h2` matches the wrong view, because every admin tab renders one.

Custom tags present on the page: `admin`, `staff`, `router-outlet`, `teacher-admin-switch`,
`service-announcement`, `nps-survey`, `cg-survey`. The NPS/CustomerGauge survey elements are
present but **empty** (`innerHTML.length === 0`) and did not interfere.

**No cookie banner was rendered in this session** — the interception noted in §4 did not
reproduce. It is left unhandled in the page object rather than papered over; if it returns
it will surface as an interception error rather than a silent workaround.

### 7.2 Three traps not previously recorded

1. **The sort qids are NOT in visual column order.** First name is `aAdmin-3` and Last name
   is `aAdmin-4`, even though Last name is the leftmost column. Anyone binding "the first
   sort button" to the first column gets the wrong one.

2. **The sort-status id's `-a` suffix is NOT the direction.** After a second click
   `sortStatus-staff-roles-a` reads **"sorted descending"** — the id never changes. Read the
   **text** for direction; the id is stable per column and is the right thing to bind to.
   The column key inside the id is the API field, not the label:
   `last_name` · `first_name` · `ext_email` · **`roles`** (plural).

3. **The Clear link's qid on this tab is `aClass-99`** — a CLASSES-tab id reused inside the
   Staff heading. Binding to it would be confusing and fragile; scope the stable class
   instead: `staff h2 small a.clear-search`.

Also confirmed: **only the column that currently owns the sort has a status element at
all** — the other three are absent from the DOM, not merely empty. That is what makes
"the previous indicator is cleared" (`TST_STFL_TC_19`) an assertion that can actually fail.

### 7.3 Measured transitions `[2026-09-02]`

Never inherit these — they are measurements, not guesses (Invariant 1).

| Transition | Measured |
|---|---|
| Search (2-row result) | ~1.5 s |
| Search (no-match empty state) | ~3.4 s |
| Sort re-order | 0.8 – 4.1 s |
| `Load more ...` append | ~1.1 s |
| `Clear` restore | ~3.1 s |
| User guide expand / collapse | < 1 s |

The suite polls a row **fingerprint** on a 20 s budget — ~5× the measured worst case.

### 7.4 Selector inventory (module `schoolStaff`)

`input[qid='aAdmin-1']` search · `button[qid='aAdmin-2']` Search ·
`a[qid='aAdmin-18']` Manage staff · `a[qid='aAdmin-19']` Add new teachers to classes ·
`a[qid='aAdmin-8']` / `a[qid='aAdmin-9']` user-guide toggles ·
`button[qid='aAdmin-4' | 'aAdmin-3' | 'aAdmin-5' | 'aAdmin-6']` sort by Last name /
First name / Email address / Role · `button[qid='aAdmin-16-<n>']` (`#adminActionsLink-<n>`)
row toggle · `a[qid='aAdmin-17-<n>']` View profile · `a[qid='aAdmin-15']` Load more ·
`staff .list-items` row · `#staff-cell-{last-name|first-name|email|role}-<n>` cells ·
`staff div.no-records p.mb-0` empty state · `staff .list-header` sort header row.

The **Role column is a real, visible cell** (`staff-cell-role-<n>`) — unlike the Students
tab, where the account type is exposed only in the row's accessible name.

### 7.5 Count drift and the heading defect, re-measured

`Staff (22)` in the heading, **21 rows** rendered with `Load more ...` already removed
(20 on first load, +1 on one click). The heading read **23** on 2026-08-24 and **22** on
2026-09-02, so the school is being mutated as expected and the gap has narrowed from 2 to 1
— but it has **not closed**. The defect recorded at §5 #2 (`TST_STFL_TC_26`) still stands
and its cause is still unexplained.

⚠️ Nothing in the automated suite asserts that the heading count equals the row count.
`TST_STFL_TC_26` is marked `[EXTRA — Phase 1 exclusion]` in the register and is out of
Phase 1 scope.

### 7.6 What is automated

`test/ExperienceApp/adminStaffTab.test.js`, run by `npm run adminStaffTabTest_thor`
(exec file `testResources/testExecutionFiles/ExperienceApp/thor/adminStaffTab.json`).

**19 STFL cases** — `TC_2, 3, 4, 6, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 23, 24,
25` — the side-effect-free block minus the six marked `[EXTRA — Phase 1 exclusion]`
(`TC_1, 5, 7, 10, 21, 26`) and minus `TC_27`, which needs an invited teacher to accept.
Nothing in the suite creates, edits or removes anything.

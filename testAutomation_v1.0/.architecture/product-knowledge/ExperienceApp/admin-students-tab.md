# Admin App — Students tab (school-admin)

> Per-screen knowledge for the Cambridge One Admin App **Students** tab and everything reachable
> from it: the student profile, Manage learner profile, individual code activation, and the bulk
> student operations.
>
> Read **with** `admin-shared.md` — everything true of *every* admin screen lives there and is not
> repeated here.
>
> **Living document.** Append, never overwrite. Mark anything not confirmed live `[ASSUMED]`.
> Date significant updates `[YYYY-MM-DD]`.
>
> **Seeded [2026-08-22]** from the Students-tab manual-design grounding pass
> (`test/Manual/C1App/AdminApp-Students/`), Thor · school `FCN-CHZ-PDA`.

---

## 1. Modules and routes

| Module | Future page object | Screens |
|---|---|---|
| `SLST` | `schoolStudents` | Students tab list, search, sort, user guide, load more |
| `SPRF` | `studentProfile` | View student profile, Manage learner profile, individual activation, removal |
| `SBLK` | `bulkStudents` | Add new / add existing students, bulk course-material activation |

```
STUDENTS tab                         /admin/admin/org_<slug>/learner
  ├─ Manage students ▾
  │    ├─ Add new students to classes       /learner/select/new
  │    │     └─ Adults → second chooser     /learner/adult-select/new
  │    ├─ Add existing students to classes  /learner/select/existing
  │    └─ Activate course materials         /bulk_activation
  ├─ row action menu ▾  (exactly two items)
  │    ├─ View student profile
  │    │     /class/teacher/org_<slug>/profile/<orgUuid>/<userId>
  │    └─ Activate course materials
  │          /dashboard/teacher/org_<slug>/activateMaterial/<userId>/admin
  └─ select rows → Remove from school account   (bulk, max 50 per request)

student profile
  ├─ Back → Students tab
  ├─ Manage account ▾
  │    ├─ Edit account details
  │    │     /admin/admin/org_<slug>/edit-user-profile/<orgUuid>/<userId>
  │    │     ├─ Personal info tab
  │    │     └─ Password tab   (Gigya-hosted; appends ?pwrt=<token>&apiKey=<key>)
  │    └─ Remove from school account
  ├─ Course materials (N)  → grouped by umbrella; the umbrella name is NOT a link
  └─ Classes (N)           → /class/teacher/org_<slug>/class/<uuid>/view/classdata
```

> **The Students tab spans three microfrontends** — `admin` (list, edit profile, bulk activation),
> `class` (student profile) and `dashboard` (individual activation). Crossing between them is a full
> page load, not an Angular route change. Budget for it. `[2026-08-22]`

> **The profile URL IS deep-linkable** within a session whose school context is already set — unlike
> `/admin/admin/org_<slug>/class`, which returns `/dashboard/error`. Whether it survives a cold
> session with no prior school selection is `[ASSUMED]`. `[2026-08-22]`

---

## 2. Product behaviour (manual-design relevant)

### Search
- **Submit-driven, not live** — typing alone does not filter; the Search button is required.
  Settles ~1–2 s. Same as the Classes tab.
- **Case-insensitive** and **partial-matching**; special characters (`+ & % ^ $`) are matched
  literally, not as wildcards.
- Searches **all four** dimensions from one box: first name, last name, email, username.
- The heading swaps from `Students (N)` to
  `Students / Showing search results for <term>. / Clear` — the term is echoed **preserving its
  case**, and the count disappears while a search is active.
- A **whitespace-only** term is trimmed to nothing but still enters the banner state and returns
  every student.
- `Clear` restores the count heading, empties the box and restores `Load more ...`.

### Sort
- **Default sort is First name ascending** — even though Last name is the first column shown.
- Last name and Email/Username toggle ascending ⇄ descending on repeat clicks; taking over a column
  removes the indicator from the previous one.
- **Collation is by CODE POINT, not locale** — `Garg, Learner, Perf Test, S, … budhiraja, kr,
  learner, student, test, us`. A `localeCompare` expectation is wrong, exactly as on the Classes tab
  (`admin-shared.md` §A4).
- Whether the sort persists across a reload is `[ASSUMED]` — the Classes tab's sort does not.

### List
- **Page size 20**; `Load more ...` is **removed from the DOM** (not disabled) once exhausted, and
  is absent entirely for a result set of ≤ 20.
- Row columns: Last name · First name · Email address or Username. The Email/Username column holds
  the **username** for username-based accounts.
- **Account type (Adult / Child) is exposed only in the row's accessible name** —
  `Row2 Adult Learner Last name … First name … Email address or Username …`. There is no visible
  badge. This is the only way to tell the two apart from the list.
- `N Selected` counter + `Remove from school account`, natively disabled at 0 selected.
- **User guide**: the toggle label swaps `User guide` ⇄ `Hide`, and the panel is **genuinely removed
  from the DOM** when collapsed (one of the few admin containers that is — see §4).

### Student profile
- Heading is **`Last name, First name`**; the line beneath holds the **email** for email accounts
  and the **username** for username accounts — the only on-profile signal of account type.
- `Last login <date>` sits under the identifier.
- **`Course materials (N)` counts UMBRELLAS, not components.** Components are listed under their
  umbrella with exactly one of three states:
  `Code activated` (+ Activated / Expires dates) · `Code not activated` · `Code expired`
  (+ Activated / Expires dates in the past).
- **The umbrella name is a plain `<span class="bundle-title">` with no link or button anywhere in
  its ancestry** — confirmed on both a child and an adult profile. There is **no route from the
  profile to an umbrella details page**. A source scenario asking to "click on umbrella name" cannot
  be performed as written; it needs a product decision. `[2026-08-22]`
  > This is the same class of error as the historic *"click a listed class"* cases
  > (`admin-shared.md` §A8.1) — caught here by grounding rather than assuming.
- Classes are listed with date range, `Date joined:`, `Class key:` and their course-material state.

### Manage learner profile
- Two tabs: **Personal info** and **Password**.
- Personal info: **First name** and **Last name** are required and editable; **Username** and
  **Location** are present but **disabled**. **No `maxlength` on any of them** — any length limit is
  server-side and unmeasured, so no boundary case can honestly be written yet.
  - On the child fixture the disabled Location field held the literal string `undefined` rather than
    a country or a blank. Worth raising as a display defect. `[2026-08-22]`
- **Password** is a **Gigya / SAP CDC hosted screen-set**, headed `Change learner password`, with a
  **single `New password` field** — no confirm field and no current-password field. Clicking the tab
  appends a one-time `?pwrt=<token>&apiKey=<key>` to the URL. **Never record a captured token in
  test data.**
  - A weak password is rejected client-side with `Password does not meet complexity requirements`.
    The message does not state what the rules are.

### Removal
- **Asynchronous and reported by EMAIL**, not in-app:
  `We are currently removing N student accounts. You will receive an email report once the accounts
  have been removed.`
- **Capped at 50 students per request.**
- Reachable two ways: bulk from the list (row checkboxes) and per-student from the profile's
  `Manage account` menu.

### Bulk operations
- **`Add new students to classes` is a TWO-step chooser for adults**:
  `Children | Adults` → and for Adults a second chooser
  `Create adult student accounts` (username + password) | `Invite adult students by email`.
  This is what separates the "adult with username" and "adult by email" scenarios.
- **`Add existing students to classes`** offers `Add students by username` | `Invite students by
  email` and **reuses the same element identifiers as the adult new-account chooser** — identify the
  screen by URL or heading, never by control ids alone.
- Both choosers carry the notice
  `Important: Classes must be created before setting up student accounts` (wording varies slightly
  per screen).
- Downstream child/adult CSV pages are already documented from the NEMO-24306 work in
  `product-knowledge/ExperienceApp.md` — reuse it rather than re-deriving.
- **Bulk activation** (`/bulk_activation`): `Upload file`, `Get CSV template`, `How to use this
  form`, a grid of `Email or Username | First name | Last name | Activation code`, and an
  `Activate N code(s)` button whose label counts the rows.
- Individual activation: `Activate an access code`, one field (placeholder
  `Example: AB2C-DE3F-G4HJ-K5LM`), Activate **natively disabled** while empty.
  Codes are single-use — *"You can only use each code once."*

---

## 3. Copy verified live `[2026-08-22]`

| Where | Text |
|---|---|
| Search banner | `Showing search results for <term>.` |
| Search, no results | *(nothing renders — see §5)* |
| User guide | `On this page you can:` · `Search for a student who has joined your school in Cambridge One` · `View individual students’ profiles and manage their accounts` · `Add multiple students to classes` · `Activate course materials for students` |
| Password too weak | `Password does not meet complexity requirements` |
| Unsaved changes | `Save changes?` / `Changes will be lost if you don’t save them` / `Cancel` / `Yes` |
| Activation failed | `Sorry, something went wrong at our end and we couldn’t activate your code. Please try again later` |
| Remove confirm | `I confirm that I want to remove students from my school account` / `Cancel` / `Request to remove` |
| Remove limit | `You can only remove 50 students at one time` / `Please uncheck some students to continue` |
| Remove in progress | `Removing students may take some time` / `We are currently removing N student accounts. You will receive an email report once the accounts have been removed.` / `Go back to manage more students` |
| Bulk upload failed | `Sorry, your file could not be uploaded` … `If that doesn’t work, email our Customer Services team at ptsupport@cambridge.org` |
| Bulk, form not uploaded | `An unexpected error occured. Please try again.` — **note the typo, "occured"** |

**Free-captured from the pre-rendered DOM** (`admin-shared.md` §A6), without reaching any of these
states: all **3** removal dialogs on the Students tab, the unsaved-changes dialog on Manage learner
profile, and all **11** bulk-activation dialogs. That last capture is how the untranslated
success-dialog keys in §5 were found *before* anyone ran a bulk activation.

---

## 4. Automation traps (Part B material)

- **Row menu items are pre-rendered once per row.** With 26 students the page holds **26** copies of
  `View student profile` and 26 of `Activate course materials`, of which exactly one of each is
  visible when a menu is open. A count or presence check is a guaranteed false green — filter on
  visibility. Worse, **all 26 copies share the same `qid`**, so the identifier is not unique.
- **Row identifiers are positional** (`aLearner-15-<index>`), so they shift as the list is sorted,
  searched or extended by Load more. Resolve a row by its content, then act on it.
- **The user guide toggle is a different element in each state** — the collapsed and expanded
  toggles carry different identifiers. Binding a page object to one of them breaks the other half of
  the toggle test.
- **The Email/Username column's `sorted ascending` / `sorted descending` text is NOT inside the
  header button** — unlike Last name and First name, where it is. Reading the button's own text
  returns the bare label. Scope the assertion to the header row.
  `[verify the exact node during Phase 1]`
- **The adult new-account chooser and the existing-student chooser share identifiers**
  (`adultCreateInvite-1..4`). Assert the URL or heading to know which screen you are on.
- **The Password tab injects a full Gigya screen-set** into the page — dozens of extra pre-rendered
  `profile.*`, `password`, `username` inputs appear, most of them hidden. Never select a password or
  name field by `name=` alone on that page.
- **Gigya validation messages are empty in the DOM until triggered** — unlike the Angular dialogs,
  their copy cannot be free-captured. It must be provoked (a weak password is a safe, non-mutating
  way to do it).
- **A CustomerGauge NPS survey can overlay the dashboard.** `<cg-survey id="cg-survey-popup">`
  appeared unprompted during this session and **intercepted the school-card click**, failing it with
  "intercepts pointer events". Any admin suite that starts at `/dashboard` needs to dismiss or
  tolerate it. `[2026-08-22]`

---

## 5. Known defects found during grounding `[2026-08-22]`

All four were found while designing the manual cases, and each is written up as an
expected-versus-actual case in `test/Manual/C1App/AdminApp-Students/`.

| # | What | Where |
|---|---|---|
| 1 | **A search matching no student renders nothing at all** — the whole table including the sort header is removed and no empty-state message replaces it. The console throws `TypeError: Cannot read properties of undefined (reading 'length') at o.search` from the admin bundle, so the empty state appears to be failing rather than absent by design. The Classes tab shows `No classes that match your search <term>` in the same situation. | `TST_SLST_TC_12` |
| 2 | **`View student profile` can hang forever on a spinner with no error.** For one student the URL collapses to `/class/` and `GET /class/apigateway/org_<slug>/getUserDetailWithClasses?…` returns **HTTP 500**. Student-specific — other profiles on the same school load fine. Two faults: the 500, and the missing client-side error handling for it. | `TST_SPRF_TC_7` |
| 3 | **The bulk-activation success dialog renders three raw translation keys** — `ADMIN.LEARNER.BULK_ACTIVATION.SUCCESS_MODAL_INFO_1`, `_2`, `_3` — instead of text, above a `Back to dashboard` button. User-visible on the first successful bulk activation. | `TST_SBLK_TC_9` |
| 4 | **Untranslated keys leak into accessible names.** The bulk-activation row checkbox's `sr-only` label is `ADMIN.LEARNER.BULK_ACTIVATION.SELECT_STUDENT`, and the individual activation page renders `SCREEN_READER.PROCESSING_MESSAGE` while a request is in flight. Invisible on screen, which is why they have gone unnoticed. | `TST_SBLK_TC_10`, `TST_SPRF_TC_16` |

Smaller observations, raised but not written as defect cases: the disabled Location field showing
the literal `undefined`; the whitespace-only search entering the banner state; `occured` in the
bulk error dialog; and the invalid-activation-code error blaming the server rather than the code.

---

## 6. Fixtures on `FCN-CHZ-PDA` (3 July Test School 1) `[2026-08-22]`

| Purpose | Student |
|---|---|
| Adult with email | `Marvin Jae student` · nonmqastudent5@mailsac.com |
| Adult, email with special characters | `Learner Learner` · shivampilot04+Taylor&%^$wift@gmail.com |
| Adult with umbrellas incl. **Code expired** | `Learner us` · testps27@mailsac.com |
| Child with username, 2 umbrellas, 2 classes | `child1 test` · cqatestaichild1 |
| Profile that returns HTTP 500 (defect fixture) | `Vandna Garg` · vandna.garg+11student@comprotechnologies.com |

**26 students at capture: 25 adults with email addresses and exactly 1 child with a username.**

**There is no adult-with-username account on this school**, which blocks any case needing one. The
shared-school constraints in `admin-shared.md` §A5 apply in full — never assert an absolute count,
and never remove a student this suite did not create.

---

## 7. Phase 1 automation grounding `[2026-08-28]`

Captured live on Thor · `FCN-CHZ-PDA` (**27** students at capture — was 26 on 2026-08-22, the
school keeps moving) via a scripted recon pass. These are **verified**, not inferred.

### 7.1 Verified selectors — Students tab list (`SLST` → `schoolStudents`)

| Element | Selector | Note |
|---|---|---|
| Left-nav Students link | `a[qid='aDetail-2']` | **Not** `a:has-text("Students")` — see §7.4 |
| Search input | `input[qid='aLearner-1']` | `name="search-text"`, **no `maxlength`** |
| Search button | `button[qid='aLearner-2']` | |
| Clear (search banner) | `a[qid='aLearner-16']` | present only while a search is active |
| Activation checkbox | `input[qid='aLearner-17']` | `id="activationCheckbox"`, `name="activation-code-search"` |
| Activation checkbox label | `label[for='activationCheckbox']` | click the LABEL — the input is a custom control |
| Manage students dropdown | `a[qid='aLearner-8']` | `id="actionsLink"` |
| └ Add new students to classes | `a[qid='aLearner-9']` | hidden until the dropdown opens |
| └ Add existing students to classes | `a[qid='aLearner-10']` | |
| └ Activate course materials | `a[qid='aLearner-14']` | |
| User guide toggle (COLLAPSED) | `a[qid='aLearner-11']` | text `User guide` |
| User guide toggle (EXPANDED) | `a[qid='aLearner-12']` | text `Hide` — **a different element**, see §4 |
| Select-all checkbox | `input.selectAllCheckbox` | no id/qid/name |
| Selected counter | `input.selectAllCheckbox + label` | text ` 0 Selected ` |
| Remove from school account | `button[qid='rLearner-1']` | **natively** disabled at 0 selected |
| Sort — Last name | `button[qid='aLearner-3']` | |
| Sort — First name | `button[qid='aLearner-4']` | carries `active` when it owns the sort |
| Sort — Email/Username | `button[qid='aLearner-5']` | |
| Sort status — Last name | `#sortStatus-learner-last_name` | `span.sr-only` |
| Sort status — First name | `#sortStatus-learner-first_name` | |
| Sort status — Email/Username | `#sortStatus-learner-ext_email` | sits OUTSIDE its button (see §4) |
| Student row | `.list-items` | `role="row"`; the sort header row is `div[role='row'].toggable-btn` |
| Row action button (per row) | `button[qid='aLearner-15-{{n}}']` | also `id="learnerActionsLink-{{n}}"` |
| └ View student profile | `a[qid='aLearner-83']` | **20 copies, one qid** — filter on visibility |
| └ Activate course materials | `a[qid='aLearner-13']` | same, 20 copies |
| Load more | `a[qid='aLearner-7']` | **removed** from the DOM when exhausted |
| No-results empty state | `div.no-records > p.mb-0` | see §7.3 |

> **Resolve a row by CONTENT, not index.** The row action button's `aria-label` carries everything:
> `Row2 Adult Learner Last name <last> First name <first> Email address or Username <id> Action Menu`.
> It is the only place **Adult / Child** is exposed. Row indices are positional and shift with
> sort, search and Load more.

### 7.2 Measured transitions (budget from these, do not invent)

| Transition | Measured | Note |
|---|---|---|
| Classes tab → Students tab | **4.4 s** | full microfrontend load |
| Search submit → list settled | ~1–2 s | |
| Sort click → rows re-ordered | ~2–3.5 s | the status label flips far earlier — optimistic UI |
| Load more → rows appended | ~2–4 s | 20 → 27 in one click |

### 7.3 ⚠️ The no-results defect is FIXED `[2026-08-28]`

`TST_SLST_TC_12`'s defect (§5 #1) **no longer reproduces.** A no-match search now renders, in
`div.no-records > p.mb-0`:

> `This school has no students that match your search ` **`<term>`** `. Please check the spelling or try a different search term`

The table and sort header row are still removed, but a proper empty state replaces them, and the
`TypeError` is **gone** — zero console errors. `students-no-results.png` is historic evidence only.
The manual case has been rewritten to assert the fixed behaviour. **Do not re-introduce the defect
expectation.** The other three defects in §5 were not re-checked and still stand.

### 7.4 ⚠️ `leftNavStudents` in `C1Selectors.json` is ambiguous

`css.ComproC1.schoolClasses.leftNavStudents` is `a:has-text("Students")`, which **also matches a
hidden help link** (`a[qid='cHeader-hlp-6']`, "Adding students to a class") and resolves to it
first — a click on it times out with *element is not visible*. The real nav link is
`a[qid='aDetail-2']`. `schoolStudents` uses the qid. **The existing Classes suite still uses the
ambiguous selector** — it survives only because Playwright's strictness is not engaged there.
Worth fixing separately.

### 7.5 The activation checkbox is a SEARCH-MODE SWITCH, not a filter `[2026-08-28]`

The single most consequential correction from this pass. Ticking
**"Who activated the code in my school?"** does **not** filter the list. It switches what the
search box matches — from name/email/username to a **16-character activation code** — and injects
two helper lines beneath the checkbox, verbatim:

> `This search can take up to 1 minute to complete, please be patient.`
> `A user activation code usually has 16 characters, both letters and numbers.`

The list is untouched on tick: same heading count, same rows, same order, Load more still present.
Unticking removes both lines from the DOM. The DOM names the feature — `name="activation-code-search"`.

This invalidates the design-time conclusion that the checkbox "has no observable effect on this
school" and the associated request for a `<SCHOOL_WITH_MIXED_ACTIVATION>` fixture: identical
ticked/unticked results were **correct behaviour**. `TST_SLST_TC_13` is now fully automatable here
with no activation code; `TST_SLST_TC_14` was rewritten to cover code search and remains Blocked
only for want of a redeemed code.

### 7.6 Other confirmations

- **Default sort** is First name ascending. Confirmed.
- **Sort does NOT survive a reload** — resolves `TST_SLST_TC_19`'s `[ASSUMED]`. Back to First name
  ascending after F5.
- **Whitespace-only search** enters the banner state with an *empty* term, returns the full list and
  keeps Load more. The search box retains the spaces.
- **Page size is 20**; Load more took 20 → 27 and then removed itself.
- **4 pre-rendered modals** sit in the DOM with nothing open (`removeLearnerWarningModal`,
  `maxLearnerSelectedModal`, `removeLearnerDelayModal`, `changeSchoolKey`) — a presence check is a
  guaranteed false green. All three removal dialogs' copy is confirmed still verbatim as §3.
- **Gigya login pre-renders ~5 hidden copies** of the username/password inputs on the login screen —
  the same trap §4 records for the Password tab applies to LOGIN itself. Select the visible one.

---

## 8. Phase 1 automation grounding — SPRF `[2026-08-28]`

Captured live on Thor · `FCN-CHZ-PDA` via scripted recon passes covering the **student
profile**, **Manage learner profile** (Personal info + Password), the **individual activation**
page and the **class launch**. Everything below is **verified**, not inferred.

### 8.1 Verified selectors — student profile (`SPRF` → `studentProfile`)

| Element | Selector | Note |
|---|---|---|
| Page scope | `div.view-profile` | the anchor `isInitialized()` uses; **absent entirely** in the HTTP-500 case |
| Heading | `h1.user-name` | `Last name, First name` |
| Avatar initials | `div.profile-item` | e.g. `LU`, `CT` |
| Identifier | `div.user-info div.email` | **the class says `email` but it holds the USERNAME on a child account** |
| Last login | `div.user-info div.last-login` | `Last login Apr, 2025` — a moving value |
| Back | `a[qid='user-profile-1']` | returns to `…/learner` with school context intact |
| Manage account ▾ | `#learnerProfileManage` | **no qid** — id only |
| └ Edit account details | `a[qid='user-profile-4']` | pre-rendered, hidden until the menu opens |
| └ Remove from school account | `a[qid='user-profile-5']` | same |
| Course materials section | `div.course-material-section` | |
| └ heading | `div.course-material-section div.course-material-info` | `Course materials (N)` |
| └ umbrella title | `div.course-material-section span.bundle-title` | |
| └ component row | `div.course-material-section div.row.mb-3` | |
| └ component name | `div.course-material-section h4.bundle-name` | |
| Classes section | `div.class-section` | **has no heading node of its own** — line 0 of its text IS `Classes (N)` |
| Class entry | `a[qid='user-profile-2-{{n}}']` | **positional**; `aria-label` = `Class <name> <material state>` |

### 8.2 Verified selectors — Manage learner profile

| Element | Selector | Note |
|---|---|---|
| Heading | `h1.heading-1` | ⚠️ `Manage learner profile` on Personal info, **`Change learner password` on the Password tab** — NOT a stable page anchor |
| Back | `a[qid='ed-user-prof-1']` | shares its qid with the First name INPUT — filter by tag |
| Tabs | `a[qid='ed-user-prof-9']` (Personal info) · `a[qid='ed-user-prof-10']` (Password) | plain anchors, **no `role='tab'`** |
| First name / Last name | `input[qid='ed-user-prof-1']` · `input[qid='ed-user-prof-2']` | editable, `required`, **no `maxlength`** |
| Identifier | `input[qid='ed-user-prof-3']` | **disabled.** ⚠️ `#email` "Email address" on an ADULT, `#username` "Username" on a CHILD — one qid, two different fields |
| Location | `input[qid='ed-user-prof-4']` | disabled; holds the literal `undefined` on the child fixture |
| Cancel / Update | `a[qid='ed-user-prof-5']` · `button[qid='ed-user-prof-6']` | |
| Unsaved-changes dialog | `#editUserConfirmationModal` + `a[qid='ed-user-prof-7']` / `a[qid='ed-user-prof-8']` | pre-rendered and hidden — copy free-capturable |
| Gigya new-password field | `#gigya-password-newPassword` | **the id is the only unambiguous handle** — see §8.5 |
| Gigya strength hint | `div.gigya-passwordStrength-text-requirements` | |
| Gigya error | `#gigya-error-msg-gigya-reset-password-form-newPassword` | gains `gigya-error-msg-active` when triggered |

### 8.3 Verified selectors — individual activation

| Element | Selector | Note |
|---|---|---|
| Heading | `h1.heading-1` | `Activate an access code` |
| Back | `a[qid='act-material-1']` | |
| Code field | `input[qid='act-material-2']` | `#activationKeyInputForAdult`, `required`, **no `maxlength`** |
| Activate | `button[qid='act-material-3']` | **NATIVELY disabled** while empty — the exception to `admin-shared.md` §B4 |
| Inline error | `div.product-form p.error-message` | the message sits in a **bare `<span>`** inside this `<p>` |
| Named student | `div.user-details` | the student name + email — the only confirmation the right student is targeted |

> **The activation page pre-renders ZERO modals** — unusual for this app. The profile
> pre-renders exactly **one** (`Remove from school account`).

### 8.4 Measured transitions (budget from these, do not invent)

| Transition | Measured | Note |
|---|---|---|
| Students tab → profile | ~3-9 s | crosses `admin` → `class` — a full page load |
| Profile → Manage learner profile | ~9 s | crosses `class` → `admin` |
| Password tab → Gigya screen-set injected | ~6-9 s | fetched from SAP CDC, not Thor |
| Profile → class page | ~3-12 s | |
| **Activate → invalid-code error** | **40.3 s** | see §8.6 — a 30 s probe sees nothing and looks like "no error is ever shown" |

### 8.5 ⚠️ The Gigya form must be submitted with **Enter**, not a click

`input.gigya-input-submit` ("Update") is the **only sized** submit among ~22 injected copies,
but it renders at **`opacity: 0.5`** inside an animated container and `click()` on it times out
after the full 30 s Playwright default — **reproduced twice on 2026-08-28**. Pressing **Enter**
in `#gigya-password-newPassword` submits the same form immediately.

The screen-set injects **80 inputs**, nearly all hidden clones (`password`, `newPassword`,
`passwordRetype`, `username`, `email`, `profile.*`). **Never select by `name=` on this page** —
the id is the only unambiguous handle. This confirms the trap §4 predicted.

### 8.6 ⚠️ The invalid-activation-code round trip takes **40 seconds**

`POST /dashboard/api/activate-accesscode` returns HTTP **200** with a failure body:

```
{"success":false,"errorCode":"PEAS_AUTHENTICATION_ERROR",
 "errorDetails":{"type":"UNEXPECTED_FAILURE","subSystem":"INFRA_PEAS",
 "description":"Something went wrong while authenticating the user. Please try again later"…}}
```

Only then does the inline error paint. Two consequences:

1. **Any poll shorter than ~45 s concludes "no error is ever shown"** — a 30 s probe did exactly
   that during this session before the budget was raised.
2. The user-facing message blames Cambridge for what is a **user-input** problem, and the
   error code confirms it: the back end itself reports an *authentication* failure for a
   malformed code. Worth raising alongside the observation already in §5.

While the request is in flight the button renders the untranslated key
`SCREEN_READER.PROCESSING_MESSAGE` — **defect §5 #4 confirmed still live.**

### 8.7 Corrections to earlier entries

- **§2 said the umbrella name is `<span class="bundle-title">`. That is right, but the
  COMPONENT name is `h4.bundle-name`** — and the two were easy to conflate. More importantly:
  **the Classes section repeats every umbrella and component**, so an unscoped `.bundle-name`
  read returns each component **twice** (28 nodes for 14 components on the adult fixture).
  Scope every course-material read to `div.course-material-section`.
- **§3 records the activation error with a CURLY apostrophe. The DOM uses a STRAIGHT one** —
  char code 39, read off the live node. A verbatim-copy assertion must normalise the
  apostrophe or it fails on a documentation artefact rather than on the product.
- **The weak-password message DOES state the rules**, contradicting `TST_SPRF_TC_9`'s remark
  that it does not. The error says `Password does not meet complexity requirements`, but the
  strength hint above the field says, verbatim:
  `Password must contain at least 8 characters, including at least one uppercase or lowercase letter and at least one number`
- **`TST_SPRF_TC_6` is resolved** — the profile URL **is** deep-linkable within a session whose
  school context is set. Re-confirmed live.

### 8.8 Copy verified live `[2026-08-28]`

| Where | Text |
|---|---|
| Password tab intro | `Give the student their new password because the old one will no longer work. The student will get an email that you have changed their password.` |
| Password too weak | `Password does not meet complexity requirements` |
| Password rules (strength hint) | `Password must contain at least 8 characters, including at least one uppercase or lowercase letter and at least one number` |
| Activation intro | `Activating a code gives the student access to their learning materials.` |
| Activation, invalid code | `Sorry, something went wrong at our end and we couldn't activate your code. Please try again later` (**straight apostrophe**) |
| Profile removal dialog | `This student will no longer have access to your school account or any of its classes. This will not affect access to their personal account` / `I confirm that I want to remove this student from my school account` / `Cancel` / `Remove` |

> ⚠️ **The profile's removal dialog is the SINGULAR variant** — "remove **this student** from my
> school account" — and is a **different dialog** from the Students-list bulk one in §3
> ("remove **students** from my school account"). Its Remove button is disabled until the
> confirmation checkbox is ticked. Do not assert one against the other's copy.

### 8.9 Defect status re-check `[2026-08-28]`

| Defect | Status |
|---|---|
| §5 #2 — profile hangs on HTTP 500 (`Vandna Garg`) | **STILL OPEN.** Re-confirmed: URL collapses to `/class/`, the page renders **nothing at all** — zero headings, zero buttons, empty body — and `getUserDetailWithClasses` returns HTTP 500 |
| §5 #4 — `SCREEN_READER.PROCESSING_MESSAGE` on the activation page | **STILL OPEN**, confirmed live |
| Location field showing the literal `undefined` on the child fixture | **STILL PRESENT**, confirmed live |

# Product Knowledge — ExperienceApp (Cambridge One / C1)

> **Living document.** Append, never overwrite. One section per app, keyed by
> its subdomain URL. Mark anything not verified on the live app as `[ASSUMED]`
> and promote to confirmed once observed. Date significant updates with
> `[YYYY-MM-DD]`.
>
> **Scope:** Cambridge One / C1 applications (appType `ExperienceApp`) — NEMO today;
> future C1 apps append their own `## APP:` section here. Usage rules, the per-app
> template, and the app→file map live in the index: `../product-knowledge.md`
> (split per application — ADR-018).

---

## APP: NEMO  (micro-nemo.comprodls.com)

**Ticket prefix:** NEMO-  
**Roles covered:** school-admin  
**Purpose:** School-admin microservice — manages school accounts, classes, and
bulk student account creation for the Cambridge One platform.

*First seeded: [2026-06-10]*

### Environment URLs

| Environment | URL |
|---|---|
| Thor (dev) | https://micro-nemo.comprodls.com/login |
| QA | https://qa.cambridgeone.org/admin |

### Role: school-admin

#### Feature: Bulk new account creation via CSV upload

**Entry path:** Students tab → "Create adult student accounts" /
"Create new accounts for children"

**Acceptance criteria (confirmed on Thor [2026-06-10]):**
- **AC1 — Username:** must start with a lower-case letter; 3–30 chars; allowed chars = lowercase letters, numbers, hyphens, underscores
- **AC2 — Password:** ≥ 8 characters including at least one letter AND at least one number or special character
- **AC3 — CSV size:** up to 200 records per file

**Known error messages (confirmed on Thor [2026-06-10]):**
- Empty username (EN): `Enter Username` (NEMO-24306 — was missing pre-fix)
- Empty username (ES): `Introducir nombre de usuario`
- Username starts with non-lowercase-letter: `This must start with a letter`
- Username < 3 chars OR username starts with uppercase: `This should be at least 3 characters, only letters and numbers` (misleading copy — hyphen/underscore also allowed)
- **Password fails any complexity/length rule:** `See password guidance in the info section at the top` (generic — fires for `< 8 chars` and for `numbers-only`; same wording for both)
- Class is full: `This class is already full` (one per row in the affected CSV upload)
- Blank class key: `Enter a valid class key` (inline, per row)
- **CSV exceeds 200 records (AC3 enforcement)**: appears in a modal dialog (NOT as a per-row inline error). Modal title: `Sorry, your file could not be uploaded`. Body: `The new students you're trying to add take you above the maximum of 200 students you can add at a time. Don't worry, you can copy and paste the additional students into a new file and add them to your next add students request.`

**Product gaps discovered via NEMO-24306 automation [2026-06-10]:**
- **AC2 partial enforcement:** Letters-only passwords (e.g. `TestPassword`) are **silently accepted** — the documented rule "letter AND (number OR special)" is only enforcing the "must contain something other than just letters" side. Numbers-only IS rejected, but letters-only IS NOT. Generic error wording: `See password guidance in the info section at the top`. Recommend a separate Jira ticket. Automation TC for this scenario (TST_NEMO24306_TC_16) is recorded in the TC repository but excluded from the active execution suite until the gap is resolved.
- **Class key is actually REQUIRED, not optional.** Earlier docs marked it optional; confirmed via Thor that a blank `Class key` column triggers an inline error `Enter a valid class key` per row. Correct the field-table at the top of this section accordingly.

**AC3 (CSV ≤ 200 records) — class-capacity vs. CSV-row-limit are independent rules.**
A single CSV upload can spread its rows across multiple classes — the 200-row CSV maximum
applies to the file as a whole and is NOT tied to any single class's seat capacity. To test
AC3 cleanly when no individual class has ≥ 200 seats, split the rows across two classes:

| Test data file | Row range | Class key used | Capacity used |
|---|---|---|---|
| `TST_NEMO24306_TC_9_csv_200_records.csv` | rows 1–100 | `w8k3-kK8U` | 100/100 |
| | rows 101–200 | `3N43-ABqV` | 100/100 |
| `TST_NEMO24306_TC_18_csv_201_records.csv` | rows 1–100 | `w8k3-kK8U` | 100/100 |
| | rows 101–200 | `3N43-ABqV` | 100/100 |
| | row 201 | `3N43-ABqV` | (above CSV max — error expected) |

This separation lets AC3 be validated **without** the per-class "class is already full"
error interfering. Recorded as the standard pattern for AC3-style record-count TCs in NEMO.

**Unconfirmed `[ASSUMED]` error messages — pending live verification:**
- (none currently; AC2 and AC3 fully characterised above)

---

##### Page: Create adult student accounts

- **URL (Thor):** `/admin/admin/org_<school-slug>/username-adult/new_csv` — **confirmed on Thor [2026-06-10]**
- **URL (QA):** `/admin/.../username-adult/new_csv` — confirm QA equivalent
- **Purpose:** Bulk-create adult student accounts by uploading a populated CSV
  file. Each row becomes one new student account.
- **Entry path (confirmed Thor [2026-06-10]):** My school accounts → [School] → Students tab → Manage students → Add new students to classes → Adults → Create adult student accounts → Next

**Controls**

| Control | Behaviour |
|---|---|
| Upload file | Accepts `.csv`; triggers inline validation on submit |
| Get CSV template | Downloads the blank template with correct headers |
| Back | Returns to the Students tab without submitting |

**CSV template headers (confirmed on Thor [2026-06-10] via template download)**

| Column | Notes |
|---|---|
| Student's First name | Required |
| Student's Last name | Required |
| Username | Required; see username validation rules below |
| Password | Required; see password validation rules below |
| Class key | **Required** [confirmed Thor 2026-06-10]; must be a valid, non-full, non-expired class key; blank triggers "Enter a valid class key" inline error per row |

**Validation rules**

| Rule | Detail |
|---|---|
| Username — starting character | Must start with a lower-case letter |
| Username — length | 3–30 characters |
| Username — allowed characters | Lowercase letters, numbers, hyphens (`-`), underscores (`_`) |
| Password — length | ≥ 8 characters |
| Password — complexity | Must include at least one letter AND at least one number or special character |
| CSV size limit | Up to 200 records per upload |
| Error display | Errors shown inline per row; user fixes the CSV and re-uploads |

**Error messages (EN / ES) — confirmed on QA, mark individual items if not verified on Thor**

| Condition | EN message | ES message |
|---|---|---|
| Empty first name | "Enter first name" | "Introducir el nombre" |
| Empty last name | "Enter last name" | "Introducir el apellido" |
| Empty username | "Enter username" | "Introducir nombre de usuario" |
| Username does not start with a letter | "This must start with a letter" | "Debe iniciar con una letra" |
| Username too short / invalid characters | "This should be at least 3 characters, only letters and numbers" | "Debe tener 3 caracteres como mínimo, y solo alfanuméricos" |
| Duplicate username within the uploaded file | "You have already added a student with this username" | "Ya has agregado un alumno con este nombre de usuario" |
| Username already taken on the platform | "...username is not available" | "Lamentablemente ese nombre de usuario no está disponible" |
| Class key does not exist | "This class key is invalid" | "Esta clave de clase no es válida" |
| Class is at capacity | `[ASSUMED]` ES only observed: "Esta clase ya está completa" | "Esta clase ya está completa" |
| Class has expired | `[ASSUMED]` ES only observed: "Esta clase ha caducado" | "Esta clase ha caducado" |

**Known quirks / bugs**

- **Misleading error copy (NEMO-24306):** The validation message for short/invalid
  username reads "only letters and numbers" but the actual rule also permits
  hyphens and underscores. The message is incorrect — do not use it as the spec
  for the allowed-character rule.
- **Bug NEMO-24306:** Empty username showed NO inline error on either the adult
  or children page, in both EN and ES locales. Status: flagged.

**Data notes**

- Requires a school-admin account on Thor to access this feature.
- QA accounts observed in test data: `qaadcharlotteFN`, `QlipothFN`.

---

##### Page: Create new accounts for children

- **URL (Thor):** `/admin/admin/org_<school-slug>/children/new_csv` — **confirmed on Thor [2026-06-10]**
- **URL (QA):** `/children/new_csv` — confirm QA equivalent
- **Purpose:** Bulk-create child (under-18) student accounts by uploading a
  populated CSV file.
- **Entry path:** School admin dashboard → Students tab → Manage students →
  Add new students to classes → Children → Next

**CSV template headers (confirmed on Thor [2026-06-10] via template download)**

| Column | Notes |
|---|---|
| Student's First name | Required — **identical header to adult page** |
| Student's Last name | Required |
| Username | Required; same validation rules as adult page |
| Password | Required; same validation rules as adult page |
| Class key | **Required** [confirmed Thor 2026-06-10]; blank triggers "Enter a valid class key" inline error |

**Validation rules**

- **Confirmed on Thor [2026-06-10]:** Identical username and password rules to the adult page.

**Known quirks / bugs**

- **Bug NEMO-24306:** Empty username showed NO inline error on this page either
  (EN and ES). Same root cause as adult page — see adult page entry above.

**Data notes**

- Child accounts likely have restricted platform features (no self-registration,
  parental consent flow). `[ASSUMED]` — confirm scope with product.

---

#### Feature: Classes tab — list, and the Filter panel

*Captured live on Thor [2026-08-15] during Phase 2 of `adminClassesTab.test.js`
(`npm run P1AdminClassesTab_Thor`), school "3 July Test School 1" / `FCN-CHZ-PDA`.*

##### Page: School Classes tab
- **URL (Thor):** `/admin/admin/org_<slug>/class` — `FCN-CHZ-PDA` → `org_perf_testschool_1`
- **Entry path:** My school accounts → school card → Classes tab (default tab)

> **Two schools share the display name "3 July Test School 1"** (`FCN-CHZ-PDA` and
> `ZPB-TWP-AEQ`). Always select a school by **school key**, never by name or position.

**Key elements**

| Element | Selector | Notes |
|---|---|---|
| Active heading | `h2:has-text("Active classes")` | Renders as `Active classes (N)`; the `(N)` is **not always present** — it disappears under some filter combinations |
| Filter button | `a#filterDropDownToggle` | `qid` is lower-case `aclass-16`, unlike its neighbours |
| Applied-filter Clear link | `a[qid='aClass-19']` | **Rendered only while a filter is applied** — the app's own "is a filter active?" signal |
| Select-all checkbox | `input#select-all-classes-checkbox` | Exists **only when class rows are present** |
| Per-row checkbox | `input#multiple-class-select-checkbox-<n>` | `aria-label` = `Select <class name> class` |
| Delete class button | `button[qid='dBulkClass-1']` | `disabled` until a row is ticked |
| Load more | `a[qid='aClass-8']` | **The list lazy-loads** — visible rows can be fewer than the heading's `(N)` |

> **Trap:** the *only* `input[type='checkbox']` on the page when the list is empty is
> `#teacher-admin-toggle` — the Administrator/Teacher header switch. A bare
> `input[type='checkbox']` selector silently matches that instead of select-all.

> **Trap:** there are **two** `<empty-class-state>` nodes — one inside `.active-section`
> (visible) and a twin inside the collapsed `.ended-section` (hidden). Any empty-state
> selector must be scoped to `.active-section` **and** checked for visibility, not counted.

##### Filter panel (`#classSortFilterModal`)

- Slide-in Bootstrap modal. **Stays in the DOM when closed** (`display:none`) — so an
  element-count check can never tell you whether it is open; use a visibility check.
- **Class status** options are `Not started`, `Active`, `Ended`, `Expired`, `Deleted`.
  The real `<input type="radio">` is `aria-hidden`/`tabindex=-1` and **not clickable** —
  the interactive element is the wrapping `div[role='radio'][aria-label='<status>']`,
  whose `aria-checked` carries the state.
- **Close timing measured live:** after Apply, the `show` class drops at ~**3.37 s** and
  `display:none` lands at ~**3.61 s**. Bootstrap keeps `display:block` at `opacity:0`
  through the fade, and Playwright counts an opacity-0 element as **visible** — so a
  "modal hidden" wait must budget for the full ~3.6 s, not the class change.
- **"Clear all" (`a[qid='aClass-14']`) clears the applied filter AND closes the panel.**
  During the close the panel still holds its **pre-clear** chips and `aria-checked` state,
  so asserting on the panel's own markup right after the click reads stale DOM. Reopening
  the panel shows it correctly rebuilt (all radios `false`, no chips). Verify a clear at
  **page** level via the `aClass-19` Clear link disappearing.

**Class labels search**

- Input `input[qid='iClass-1']` ("Find a label"); results `#class-label-suggestion-list
  a.search-item`; selected chip `.label-container > span.label`.
- **Debounced async search (~1–3 s)**, and the suggestion container is **not rendered at
  all** when there are no matches (there is no "no results" message to wait for).
- **Scoped by the selected Class status** — it only offers labels present on a class of
  that status. Consequence for test data: a status+label pair must **co-exist** or the
  label can never be selected. `Active` + `VM1` is such an impossible pair on this school
  (applying it yields "No classes that are Active, VM1").
- Requires a **real click on the field then real keystrokes**. Setting `.value`
  programmatically does not fire the search, and typing without clicking first does not
  open the dropdown when the field is already focused from a previous interaction.
- Labels present under status `Active` [2026-08-15]: `aditya_goel`, `A11y test`, `aditya`,
  `sarthak1`, `denfolodedmrm slmeomsaaadme`, `sarthakkkkkakakakakakakkakakakakakakakak1sqwwduwhqdujhewu`.

**Known quirks / bugs**

- **The Filter panel's X close button is unreliable** [2026-08-15]. `button[qid='button-Admin-1']`
  reports a successful click but the panel stays open; waiting longer does not help
  (observed a clean 0.9 s close and a full 15 s timeout on consecutive runs, same code and
  data). **Re-clicking** is what resolves it. `classFilterModal.click_close()` currently
  carries a retry as a **workaround** — remove it once the app is fixed.
  *Reported to the team [2026-08-15]; fix pending.*

- **The applied filter persists SERVER-SIDE, per user account** [2026-08-15]
  **`[CONFIRMED 2026-08-17 — INTENDED BEHAVIOUR, per product decision]`. Not a defect; do
  not raise it as one.** The same persistence applies to the **class search term** (see
  "Class search" below). The testing impact below is unchanged: intended or not, the suite
  still cannot assume a clean start, so the Before/AfterEach reset stays.
  Reproduced manually end-to-end: a filter applied on the Classes tab survives a **page
  reload**, a **full logout + login**, and a **different browser / incognito window** —
  which leaves the server, keyed to the account, as the only possible store. It was first
  noticed because a filter left behind by an automated run was still applied when a
  completely separate browser logged in later.
  - *Why it may be intended:* remembering a user's filter preference is a normal feature.
  - *Why it may be a defect:* an admin who filtered by `Deleted` on Friday logs in Monday
    to a Classes tab reading **"No classes"**, with no explanation, on any device. The
    persistence and that failure mode are separate decisions.
  - *Not covered by the requirements:* no mention of persistence/retention/re-login in any
    of the 30 requirements or 81 TCs in `test/Manual/C1App/AdminApp-Classes/`.
  - *Testing impact:* the suite cannot assume a clean start. A crashed run leaves a filter
    on the account that poisons the next run, days later, on another machine. Two people
    running the suite with the same account will interfere with each other. This is why
    `adminClassesTab.json` resets in **BeforeEach**, not only AfterEach.

##### Class search (Req #9)

*Captured live on Thor [2026-08-17] during Phase 1 of the search/sort batch, same school.*

| Element | Selector | Notes |
|---|---|---|
| Search input | `input[qid='aClass-1']` | Angular-backed; type with `addValue`, click the field first |
| Search button | `button[qid='aClass-2']` | `type=submit` inside the `form.search-bar` |
| No-results text | `.active-section empty-class-state p.no-search-result-container` | Same node as the filter empty state |

- **Submit-driven, NOT live/debounced.** Typing alone changes nothing — the list only
  updates when **Search** is clicked. (Contrast with the filter panel's *label* search,
  which IS debounced.) Settles in **~1.0–1.2 s**.
- **Case-insensitive and partial-matching** — `sarthak` returns `SarthakTestClass1`.
  This resolves the `[ASSUMED]` in `TST_CLST_TC_18`.
- **Searches BOTH sections.** The Active and Ended headings both re-count; a term can match
  an ended class and not an active one.
- **No-results copy echoes the term:** `No classes that match your search <term>` (the term
  in a `<strong>`). Resolves the `[ASSUMED]` in `TST_CLST_TC_21`.
- **The search term PERSISTS server-side, exactly like the applied filter** — it survived a
  full page reload with the list still narrowed to one class. **Intended behaviour** (same
  product decision as the filter, 2026-08-17). *Testing impact:* the housekeeping reset must
  clear the **search as well as the filter**, or the search TCs hand the sort TCs a one-row
  list and the term leaks into the next run.
- **There is no clear/X control** on the search field — the reset is *empty the input, then
  click Search*.

##### Class list sorting (Req #27)

*Captured live on Thor [2026-08-17].*

| Element | Selector | Notes |
|---|---|---|
| Sort by class name | `button[qid='aClass-3ACTIVE_SECTION']` | `aria-label="Sort by class name"` |
| Sort by start date | `button[qid='aClass-4ACTIVE_SECTION']` | |
| Sort by end date | `button[qid='aClass-5ACTIVE_SECTION']` | |
| Sort status (name) | `#sortStatus-class-title-a-ACTIVE_SECTION` | `sr-only`; note `title`, not `name` |
| Sort status (start) | `#sortStatus-class-startdate-a-ACTIVE_SECTION` | all-lowercase `startdate` |
| Sort status (end) | `#sortStatus-class-enddate-a-ACTIVE_SECTION` | all-lowercase `enddate` |

> The `qid`s are **suffixed with the section** (`…ACTIVE_SECTION`), so the Ended table's
> headers are separate elements — an unsuffixed `qid` matches nothing.

- **Class key is NOT sortable** — its header is a `span.list-info.disabled`, not a button.
  Only class name, start date and end date sort.
- **Each click toggles** ascending ⇄ descending. The status span is rendered **only inside
  the currently active sort column's button** — the other columns' spans are removed from
  the DOM entirely, so `null` reliably means "not the sort column".
- **⚠ The sort status label is OPTIMISTIC UI.** Measured: the label flips to
  "sorted ascending"/"sorted descending" in **~90–120 ms**, but the **rows only re-order at
  ~1.2–3.2 s**. Waiting on the label and then reading the rows reads the *previous* order.
  **Wait on the row content changing, never on the label.**
- **Sorting does NOT persist** across a page load — unlike the filter and the search, it
  resets. Within a session it does survive between TCs, so a test must not assume the first
  click yields ascending.
- **Collation is by code point**, not locale/case-insensitive: `(` < `A` < `S` < `T` < `c` < `t`,
  so `(14 aug) class 1` < `AutoClass_CreateOnly` < `class_L_…`, and `test Class 14 aug 2` <
  `testClass1` (space before `C`). A `localeCompare` assertion would NOT match the product.

**Row cells (Active section) — stable indexed ids**

`#class-cell-name-ACTIVE_SECTION-<n> a.class-details` · `#class-cell-key-ACTIVE_SECTION-<n>`
· `#class-cell-startDate-ACTIVE_SECTION-<n>` · `#class-cell-endDate-ACTIVE_SECTION-<n>`
(`<n>` = 0-based row index; note the camelCase `startDate`/`endDate` here versus the
lowercase forms in the sort-status ids). Column headers use the matching
`#class-col-<field>-ACTIVE_SECTION` ids. Dates render as `Aug 17, 2026`.

##### Ended classes section, row details & user guide (Req #18 / #17 / #28 / #20)

*Captured live on Thor [2026-08-17].*

| Element | Selector | Notes |
|---|---|---|
| Ended section root | `.ended-section` | Holds the note "Ended and deleted classes automatically move into this section" |
| Ended section toggle | `a#endedSectionCollapseBtn` | `qid` is lower-case `aclass-17`; `aria-expanded` carries the state |
| Ended section panel | `#endedSectionCollapse` | |
| Open/Close label | `.ended-section-heading span.toggle-text` | Reads `Open` when closed, `Close` when open |
| Ended Class status header | `#class-col-class-status-ENDED_SECTION` | Note the doubled `class-class` |
| Ended row cells | `#class-cell-<field>-ENDED_SECTION-<n>` | Adds `status` to the Active section's fields |
| Load more | `a[qid='aClass-8']` | Lives in the **Ended** section |
| Row details toggle | `a[data-toggle='collapse'][aria-controls='itemCollapseACTIVE_SECTION<n>']` | The `qid`s run 1,3,5… — use `aria-controls`, it is cleanly index-based |
| Row details panel | `#itemCollapseACTIVE_SECTION<n>` | |
| User guide toggle | `a[qid='aClass-11']` | `aria-label` flips `Open the user guide` ⇄ `Hide the user guide` |
| User guide panel | `.collapseUserGuide` | |

- **The Ended section is COLLAPSED on load and renders NOTHING until expanded** — a freshly
  loaded tab has **zero** `ENDED_SECTION` rows and no "Load more" link. Rows arrive ~1.0 s
  after expanding.
- **⚠ The `Ended classes (N)` count is fetched WITH the rows, not on page load.** While
  collapsed the heading reads a bare `Ended classes` and the count **never** appears (polled
  10 s); it lands ~0.9 s after expanding. Any assertion on the ended count must expand first.
  This failed `TST_CLST_TC_14` on its first run.
- **"Load more" is REMOVED from the DOM** once the last batch loads (it does not merely
  disable) — resolves the `[ASSUMED]` in `TST_CLST_TC_20`. Page size is **20**; the new rows
  land ~3.5 s after the click.
- **Loaded rows are NOT reset by collapsing and re-expanding** the section (verified: 26 rows
  stayed 26, link stayed gone). **Only a page reload** restores the first-page state — which is
  what keeps the two load-more TCs independent.
- **Class status values seen:** `Ended`, `Expired`, `Deleted` (the manual doc recorded only
  "Expired").
- **⚠ Row-details expand is a Bootstrap collapse with a ~700 ms `collapsing` phase, and the
  panel's CONTENT stays in the DOM while collapsed.** Two consequences: element counts can
  never distinguish the states (use `isDisplayed`), and **waiting on the panel is not enough** —
  Playwright calls the panel visible partway through the expand, while the panel is still
  shorter than its content and inner elements are clipped to zero height. Wait on a **content**
  element (e.g. `h3.class-label-heading`). This failed `TST_CLST_TC_9` on its first run.
- The **user guide panel is REMOVED from the DOM** when collapsed — unlike the row-details
  panel and the filter modal, which both persist.
- **Launching a class** (active or ended) opens the same class page; `activeClass.page.js`
  already models it (anchors on the Actions button), so no new page object is needed. A
  deep-link to `/admin/admin/org_<slug>/class` returns `/dashboard/error` — the school context
  must be set by clicking the school card first.

**Data notes**

- Label `VM1` matches **no active class** — filtering `Active` + `VM1` returns zero.
- `SarthakTestClass1` (key `97Cc-y7bs`) is the search fixture — an active class whose name
  no other class shares a prefix with.
- Six active classes share the start date `Aug 14, 2026`, so date sorting must be asserted
  as **monotonic, not strictly increasing**, and descending is not an exact reversal.
- **⚠ The ACTIVE section also paginates at 20** (same page size as Ended). Once a school has
  more than 20 active classes, ascending and descending sorts show **two different 20-row
  windows of a larger set** — so "descending is the exact reverse of ascending" is false even
  though the sort is correct. Assert monotonic ordering and the direction flip; only assert an
  exact reversal when `visible rows === Active classes (N)`.
- **⚠ This school is SHARED and mutates under the suite.** Between 2026-08-17 morning and
  afternoon another suite created many classes named `AutoClass_CreateOnly`, taking the active
  count past 20 and introducing **duplicate class names**. Two assumptions died at once: that
  the whole list is visible, and that names are unique. Do not build an assertion on the
  current row count, or on names being distinct.
- Class creation is asynchronous ("can take up to 12 hours"), so a newly created class does
  not appear in `Active classes (N)` immediately — see the Add Class feature notes.

---

##### Add Materials modal (`#addLearningMaterialModal`) — Create new classes form

*Measured live on Thor [2026-08-20] after this one behaviour caused five consecutive suite
failures that each looked like a different problem.*

**⚠ "No search results" IS ALSO THE LOADING STATE.** This is the trap:

```
Modal opens
  └─ ONE server call fires:  POST /admin/apigateway/org_<slug>/products
       └─ while it is in flight the dropdown shows "No search results" + a spinner
       └─ when it returns, ~800 options land in the DOM AT ONCE
```

So the product's *loading* message is **word-for-word identical** to its *genuinely empty*
message. A test that types before the catalogue arrives sees "No search results", concludes
the material does not exist, and reports a misleading failure — while the screenshot shows a
perfectly typed search term and an open dropdown, which makes it look like a product bug.

**How the search actually works** (verified by counting network traffic while typing):

| | |
|---|---|
| Requests fired by typing | **zero** — the catalogue is fetched once, on modal open |
| Filtering | **client-side**, measured at **1 ms** |
| Options in DOM before typing | ~800 |
| Options *visible* before typing | **0** — the dropdown is closed until the field is typed into |

**Consequences for automation:**

1. **Wait for the catalogue with `waitForExist`, NOT `waitForDisplayed`.** The options exist
   but are invisible before typing, so a visibility wait hangs forever.
2. **Two separate waits, with very different budgets.** The server fetch deserves a generous
   one (60 s); the filter that follows needs almost nothing (5 s). Collapsing them into one
   long wait hides which of the two actually failed — and a single 90 s wait plus the click's
   own 30 s default silently exceeded mocha's 120 s limit, turning a precise failure into a
   generic runner timeout.
3. **A long wait does NOT fix this.** If typing happened before the catalogue loaded, no amount
   of waiting on the filtered item helps — the filter already ran against an empty list.
4. `click_addMaterialBtn` only waits for the search **input**, not the catalogue — that gap is
   what `select_material` now closes.

**Also:** `a.dropdown-item` is page-wide and matches the header profile menu (`Help centre`,
`Tutorials`, `My profile`) as well as materials — up to 885 elements at once. The selector is
scoped to `#addLearningMaterialModal`.

**Typing:** `addValue` is `pressSequentially` and does **not** clear first, so a leftover value
is appended. A duplicated first character (`ddev_test_…`) has also been observed by the team.
`select_material` therefore clears, types, **reads the value back and compares**, and retypes up
to 3 times — a mistyped term is an automation defect and must never be reported as a product one.

---

#### Feature: Class grade settings (CGST, Req #22)

*Captured live on Thor [2026-08-20] during the CGST Phase-1 probe, school "3 July Test School 1"
/ `FCN-CHZ-PDA`. Resolves every `[ASSUMED]` in `TST_CGST_TC_1..6`.*

##### Page: Class grade settings
- **URL (Thor):** `/class/teacher/org_<slug>/class/<uuid>/grade-weighting`
- **Title:** `Class grade settings | Cambridge One`; `<h1>` = "Class grade settings", with the
  class name in the `<p>` directly beneath it.
- **Entry path:** Classes tab -> launch a class -> **Actions** (`a[qid='cView-70']`) ->
  **Class grade settings** (`a[qid='cView-60']`).
- Deep-linking straight to `/grade-weighting` works **once the school context is set** (same
  precondition as every other admin deep link). The tab title briefly reads "Class Page" before
  settling to "Class grade settings" — anchor on an element, not the title.

> **`Class grade settings` and `Delete class` live in the SAME Actions menu**
> (`cView-60` and `cView-13`). One `click_actionButton()` serves both — which is what lets a
> suite test the grade settings and then delete the class without re-navigating.

**Key elements** (the page is fully `qid`-attributed — no class-name fallbacks needed)

| Element | Selector | Notes |
|---|---|---|
| Back | `a[qid='gradeW-1']` / `#gradeW-back-btn` | |
| User guide toggle | `a[qid='gradeW-userGuideBtn']` / `#userGuideInfo` | |
| Grading scale name | `.grading-scale-display .grade-display .heading` | e.g. "Cambridge One grading scale" |
| Grading scale sub-text | `.grading-scale-display .grade-display .description` | "Target score will vary depending on class materials" |
| Change scale | `#GradingScaleChange` | a real `<button>` |
| Teacher score-override toggle | `#teacherScoreOverrideSwitch` | `input[type=checkbox]`, read `.checked` |
| Score calculation dropdown | `#dropdown-current-score-type` | an `<a>`; text is the current value ("Best score") |
| Material (bundle) row | `a[qid='gradeW-3-<b>']` | `<b>` = bundle index |
| Material weightage input | `input[qid='gradeW-5-<b>-<i>']` / `#weightageInput-<b>-<i>` | `type=number` |
| Other grading categories | `a[qid='gradeW-14']` | collapsible |
| Add a grading category | `a[qid='gradeW-16']` / `#gradeW-16` | **label changes — see traps** |
| Category picker (added row) | `a[qid='data-items-dropdown-1']` | "Create or choose a custom grading category" |
| Category weightage input | `input[qid='gradeW-15-<n>']` / `#componentWeightageInput-<n>` | |
| Remove category row | `button[qid='del-customComponents-<n>']` | |
| Total grade label / value | `span.col-6` ("Total grade:") / the `<span>` inside the sibling `<p>` | renders e.g. `100%` |
| Cancel | `a[qid='gradeW-6']` / `#gradeW-cancel-btn` | `<a>`; carries a `disabled` **class** |
| Save changes | `button[qid='gradeW-7']` / `#gradeW-save-btn` | real `<button>`; genuine `disabled` property |

**Change grading scale modal**

| Element | Selector | Notes |
|---|---|---|
| Modal root | `#changeGradingScaleModal` | |
| Close (X) | `#changeGradingScaleModalClose` | closed cleanly first time — no retry needed (unlike the Classes-tab filter modal) |
| Scale radio | `input[qid='grade-scale-radio-<n>']` | **positional** — match by the adjacent `label.label-grading-scale` text |
| Scale label | `label.label-grading-scale` | the current default reads "&lt;name&gt; default" |
| Manage grading scales | `#manage-grading-scales` | link out to the school-level scales page |
| Cancel | `#cancel-grading-scale` | `<a>` with a `disabled` **class** |
| Apply | `#update-grading-scale` | `<a>` with a `disabled` **class** — see traps |

**Validation copy — CONFIRMED [2026-08-20]** (was `[ASSUMED]` in `TST_CGST_TC_6`)

| Condition | Message |
|---|---|
| Weightages total != 100% | `Your weighting choices exceed the maximum of 100%` |
| A single weightage outside 0-100 | `Please enter a number 0-100` |

**⚠ ELEVEN MODALS ARE PRE-RENDERED IN THE DOM ON THIS PAGE** [2026-08-20]

All are present at all times with `display:none`; at most one is ever visible. Two consequences:

1. **Any assertion on modal PRESENCE is a guaranteed false green** — always use `isDisplayed`,
   never `getElementCount() > 0`. (Same trap as the grading-scales and grading-categories
   pages; this page just has far more of them.)
2. **Their copy can be captured without triggering them** — including states that are hard to
   reach, e.g. the maximum-grading-categories limit.

| Modal | id | Non-committing way out | Raised by |
|---|---|---|---|
| Changes saved | `#changesSavedConfirmationModal` | X `a[qid='gradeW-13']` | a successful **Save** |
| Save failed | `#gradeWeightingErrorModal` | X `a[qid='gradeW-14']` | a failed Save ("Try again") |
| Cancel warning | `#cancelChangesWarningModal` | `#gradeW-10` "No, go back" | **Cancel** on a dirty form |
| Override warning | `#warningForEnableTeacherOverrideScoreModal` | `#cancelTeacherScore` | the score-override toggle |
| Change grading scale | `#changeGradingScaleModal` | `#changeGradingScaleModalClose` | **Change** (grading scale) |
| Total-weightage error | `#totalWeightageErrorModal` | `#totalWeightageErrorModalCloseButton` | weighting ≠ 100% on save |
| Remove grading category | `#deleteCustomComponentWarningModalBox` | `#gradeW-9` "Cancel" | removing a category row |
| Max grading categories | `#maximumComponentModalBox` | `#gradeW-24` "Go back" | category limit reached |
| Create grading category | `#CustomComponentModalBox` | `#gradeW-17` X | "Create a grading category" |
| Progress-metric warning | `#warningForDisableProgressSoFarMetricModal` | `#cancel-progress-so-far` | hiding "progress so far" |
| Leave-without-saving | `#editActivityChangesSavedModal` | `#editActivityChangesSavedModalClose` | navigating away dirty |

> **This page raises a dialog at essentially EVERY state-changing control.** An unclosed one is
> a full-viewport overlay that blocks every subsequent click **while every read keeps working**
> — the single most expensive failure mode found here. Enumerate this list when automating a new
> control rather than discovering them one failed run at a time (which cost three runs on
> 2026-08-20). **Diagnostic signature: many interactions failing while reads succeed = an open
> overlay.**

**Known quirks / traps**

- **⚠ THE TEACHER SCORE-OVERRIDE TOGGLE RAISES A CONFIRMATION DIALOG** [2026-08-20].
  Clicking `#teacherScoreOverrideSwitch` opens `#warningForEnableTeacherOverrideScoreModal`:
  *"Are you sure? By turning on this setting you are enabling the teacher to manually add and
  override scores marked by Cambridge One for individual activities. Teacher score for these
  activities will be the score that counts towards the overall score calculation, overriding
  the Best/First score setting selected above"* — with **No, go back**
  (`#cancelTeacherScore`) / **Yes, enable** (`#enableTeacherScore`), plus an X
  (`#enableTeacherOverrideScoreModalClose`).

  | Element | Selector |
  |---|---|
  | Modal root | `#warningForEnableTeacherOverrideScoreModal` |
  | Confirm | `#enableTeacherScore` ("Yes, enable") |
  | Cancel | `#cancelTeacherScore` ("No, go back", an `<a>`) |
  | Close X | `#enableTeacherOverrideScoreModalClose` |

  **Measured while the dialog is open: the toggle already reads `checked:true`, but Save is
  still DISABLED.** The setting commits only on "Yes, enable"; "No, go back" reverts the
  toggle to its previous state and closes cleanly. So the toggle's own state is NOT evidence
  that anything changed — asserting on it before confirming reports success for a change that
  never happened.

  **Cost when missed:** the dialog is a full overlay. Leaving it open silently blocks every
  later click on the page **while every READ keeps working** — which makes four unrelated
  later steps fail on individually plausible-looking symptoms ("modal did not open",
  "row not added", "value not entered"). This was 5 of the 6 failures on the CGST suite's
  first run. If several interactions fail but reads succeed, suspect an open overlay first.
  **The dialog is SYMMETRIC — resolved [2026-08-20]** (was `[ASSUMED]`). The *same* modal id is
  reused for both directions, with the copy and the confirm button's label swapped:
  turning ON → *"By turning on this setting…"* / **"Yes, enable"**; turning OFF →
  *"If you turn off this setting, teachers in this class will no longer be able to…"* /
  **"Yes, disable"**. The confirm element is `#enableTeacherScore` in both cases, so address it
  by id and never by its text.

- **The Total grade and the Save button update on BLUR, not on keystroke.** Measured live: with
  the material at 100 and a category typed to 500, the page still displayed `Total grade: 100%`
  **and Save was ENABLED** until the field was blurred; on blur the total corrected to `600%`,
  the error copy appeared and Save re-disabled. A TC that types a weightage and immediately
  asserts will conclude the 100% validation is broken. **Always blur before asserting**
  (Invariant 6 / "a DOM flag is not the form's model").
- **`#gradeW-16`'s label changes with state:** "Add a grading category" when no custom category
  row exists, "Add **another** grading category" once one does. Never assert the first form
  unconditionally.
- **`Apply` / `Cancel` in the scale modal, and `Cancel` on the page, are `<a>` elements carrying
  a `disabled` CLASS — not the `disabled` property.** `action.waitForEnabled()` cannot see this;
  check the class list instead. Only `#gradeW-save-btn` is a real `<button>` with a real
  `disabled` property.
- **Save is disabled while the form is pristine** — this is the app's own dirty-state signal and
  is the natural thing to assert against (Invariant 13).
- **"Add a grading category" inserts an INLINE row, it does not open a modal.**
- **~~Cancel does not reset the form in place.~~ CORRECTED [2026-08-20]:** Cancel opens a
  confirmation dialog — `#cancelChangesWarningModal`, *"Are you sure you want to cancel? Any
  unsaved changes will be lost"* with **No, go back** (`#gradeW-10`) / **Yes, cancel**
  (`#gradeW-11`). The original note was written after clicking Cancel, seeing the form
  unchanged, and concluding the button was broken — the dialog was open and simply had not
  been looked for. **The button works; it needs confirming.** `reload_page()` remains a valid
  discard, but Cancel is not broken.

  *Method note, because this error was made three times in one session:* checking that a click
  **landed** is not the same as checking what it **opened**. On this page, assume a
  state-changing control raises a dialog until proven otherwise.
- Category options `a[qid='data-items-dropdown-view-0-<n>']` are **positional over a shared,
  mutable list** — always select by name, never by index (same rule as class rows).

**Data notes**

- **A class needs course material for CGST to be meaningful** — the per-material Weightage row is
  what `TST_CGST_TC_6` manipulates. A class created with no material has nothing to weight.
  (Consistent with `TST_CLON_TC_3`'s observation that an empty source class shows
  "Class grade settings — Not available".)
- Scales offered on this school [2026-08-20]: `Cambridge One grading scale` (system default,
  currently applied) and `new Grading Auto`. Categories offered: `new catagory`,
  `new Grading Category`, `some`, plus a "Create a grading category" path.
  **All of these are on the "not ours — never delete" list (section 7 of the handoff).** Selecting
  one only associates it with the class; it does not modify the scale/category itself.
  User approved referencing them for CGST [2026-08-20].

##### Class creation latency — MEASURED [2026-08-20]

The product's "can take up to 12 hours" copy is **worst case, not typical**. Measured end to end
on Thor, creating one class with a course material:

| Milestone | Elapsed from clicking "Create 1 class" |
|---|---|
| Success dialog ("Success! We are now creating 1 class for you") | ~5 s |
| Class visible in the Active list (count incremented) | **~24 s** |
| Class launchable + Class grade settings fully functional | **~59 s** (first attempt, no retry — most of this was navigation, not waiting) |

**Consequence:** a suite MAY create a class in `Before` and use it in the same run. Gate on the
class row appearing (poll), never on a fixed pause, and never on the "up to 12 hours" copy.
This supersedes the earlier blanket note that a new class "does not appear immediately" — that
remains true for the *instant* after creation, but the wait is seconds, not hours.

**⚠ THOR THROUGHPUT VARIES ENORMOUSLY — the figures above are a GOOD day** [2026-08-20]. The
same CGST suite, unchanged in the relevant path, ran in **3.5 minutes** and then in
**12 minutes** an hour later. On the slow run the Add-materials type-ahead never populated
within **90 s** and `TST_CCLS_TC_6` timed out, which broke the whole create chain; loading the
Classes tab by hand at the same time also took seconds rather than being instant.

**This slowness is KNOWN AND ACCEPTED, not a defect** — confirmed by the user 2026-08-20 ("we
all know that takes time"). Do **not** raise it as a bug and do not treat a slow Add-materials
search as a product failure.

Two lessons: (1) a green run proves the code, not the timings — do not tighten a timeout on the
strength of one fast run; (2) when a suite that passed suddenly fails early in a *shared*,
pre-existing TC, check whether the environment is simply slow before changing any code.
**Do not add retries to a shared TC to paper over this** (Invariant 14) — but equally, do not
report it as a defect; budget generous timeouts for the material type-ahead instead.

**Keep every poll budget comfortably BELOW mocha's `timeout` (`.mocharc.js` = 120000).** A poll
set to exactly 120000 is killed by the runner at the same instant it expires, so the failure
surfaces as a generic mocha timeout instead of the TC's own diagnostic message.

##### Deleting a class

- Entry: class page -> **Actions** (`cView-70`) -> **Delete class** (`cView-13`).
- **No confirmation modal appeared for a freshly-created class with no students** [2026-08-20].
  The click deleted immediately and redirected to
  `/admin/admin/org_<slug>/class?showMessageBanner=true`. This contradicts
  `activeClass.page.js`, whose `click_yesDelete_Btn` (`button[qid='cView-48']`) assumes a confirm
  step always exists. Most likely the confirm is only raised for a class holding students/data —
  **not yet verified**, marked `[ASSUMED]`. Any cleanup step must tolerate BOTH paths.
- **Delete is SOFT.** The class leaves `Active classes (N)` and reappears in the **Ended** section
  with Class status **`Deleted`** (verified live: Active 22 -> 21, Ended 51 -> 52). It is not
  removed from the school, so a per-run create+delete cycle still accumulates rows in Ended.

---

#### Feature: The "classes using this" lists on a grading SCALE's and CATEGORY's details page

*Captured live on Thor [2026-08-20], school "3 July Test School 1" / `FCN-CHZ-PDA`, during
Phase 1 of `TST_GSCL_TC_7` (Req #13) and `TST_GCAT_TC_7` (Req #7). Resolves the `[ASSUMED]`
expected result in BOTH manual cases — until now every scale and category anyone had opened
had **zero** classes, so the populated layout had never been seen.*

##### The manual test steps for both TCs were WRONG

Both read *"click a listed class"*. There is **no clickable class name** — the name is plain
text in a `span.item-text`. Each row's only control is a dedicated **"Class grade settings"**
link at the end of the row. Both manual cases corrected.

##### They are NOT the same page — the difference matters

| | Scale details (`grading-scale-details`) | Category details (`grading-category-classes`) |
|---|---|---|
| Heading | `p.classes-heading` → `Classes (N)` | `h2.heading-2` → **`Active classes (N)`** |
| Includes deleted classes? | **YES** | **NO — active only** |
| Columns | name, key, start, end, **status** | name, key only |
| Row link | `a[qid='gradingScaleDetails-3-<n>']` | `a[qid='gradingCategoryClass-3-<n>']` |
| Pagination | `a[qid='gradingScaleDetails-4']` "Load more…", page size 20 | none seen |
| Search / sort | none | `#searchClassText` + `a[qid='gradingCategoryClass-6']`; sort `a[qid='gradingCategoryClass-2']` |
| Destination URL | `…/grade-weighting?gradingScaleId=<id>` | `…/grade-weighting?gradingCategory=<id>` |

**Consequence of the active-only rule:** a category row **vanishes when its class is deleted**.
This is the entire reason `TST_GCAT_TC_7` looked blocked for weeks — all three categories
(`new catagory`, `new Grading Category`, `some`) read `Active classes (0)` simply because every
class they had been applied to had since been soft-deleted. Any TC asserting a category's class
list MUST run before the class is deleted.

**The category page's search bar and sort control render ONLY when the category has ≥1 active
class.** They are absent from an empty details page, which is why the page object written on
2026-08-18 has no model for them.

##### ⚠ The row link is a dead end for a DELETED class

Clicking "Class grade settings" on a scale-details row whose status is `Deleted` does **not**
open grade settings. It **drops the school context entirely**, redirects to *My school accounts*,
and raises a dialog:

> **Sorry!** — *"The item is not available because the class is no longer active"* (Close)

The dialog is a generic `div.modal-content` with `p.modal-title` / `p.modal-description` and
**no `qid`**, rendered on the school-accounts page. This is the product explaining itself, **not
a defect** — but it costs the school context, so a test must recover by re-selecting the school.

##### Addressing rows: use the class KEY, never the name

Two independent reasons, both observed live:
- Class names on this school are already duplicated (many `BulkCSV_Class1` / `AutoClass_CreateOnly`).
- Delete is soft **and the scale page lists deleted classes**, so every CGST run leaves another
  `AutoClass_CGST` row on `new Grading Auto` permanently. Row count only ever grows.

Never assert on `Classes (N)` / `Active classes (N)` as a fixed number either — the school is
shared and mutates mid-session (active classes went 25 → 27 → 32 while this capture was running).

##### Data notes — the permanent fixture class

**`Fixture_GradeSettings_DO_NOT_DELETE`** (key **`62k3-AXm6`**) was created on `FCN-CHZ-PDA`
[2026-08-20] with user approval, specifically so this DOM can be re-captured without re-deriving
the state. Start Aug 20 2026, **end Dec 31 2036**, material `dev_test_ebook_bundle_104_bundle`,
grade settings saved as material 70% + category `some` 30%.

- **Do not delete it**, and do not let a name-prefix sweep match it — the CGST suite sweeps
  `AutoClass_CGST`, which deliberately does not collide.
- **2036 is the product's ceiling, not an arbitrary choice.** The end-date picker's year view
  offers 2026–2036 and disables every other year, so ten years is the most expiry-proofing
  available.
- **The start date must stay in the past.** A future start date makes the class `Not started`,
  and the category details page counts *active* classes only — the fixture would silently stop
  serving its purpose.
- Applying a category requires the class to **have course material**: a class without it shows
  *"You haven't chosen any learning materials yet / Add at least one learning material to start
  customising grade settings for this class"* and the whole page is gated. This rules out every
  automation leftover on the school — `AutoClass_CreateOnly` / `AutoClass_CreateMore` are created
  without material, and the **bulk-CSV template has no material column at all** (class name,
  dates, 10 teachers, progress data), so `BulkCSV_Class*` have none either.

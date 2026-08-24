# Admin App — Classes tab — list and Filter panel (CLST)

> **Migrated from [`../ExperienceApp.md`](../ExperienceApp.md) on [2026-08-21] under ADR-020**
> (product knowledge splits per feature area). **The content below is unchanged** — this was a
> pure move, verified byte-identical. Append here from now on, not to the app file.
>
> **Read [`admin-shared.md`](admin-shared.md) first.** It carries what is true of *every* admin
> screen — navigation, pre-rendered modals, positional ids, CSS-only-disabled buttons, Angular
> typing, measured timings, the visual-testing verdict — and is not repeated here.

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


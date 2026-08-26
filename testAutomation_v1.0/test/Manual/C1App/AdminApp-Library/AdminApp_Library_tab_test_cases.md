# Manual Functional Test Cases — Admin App: Library Tab (Batch 1)

**Source:** `Requirement.xlsx` — sheet header *"Library tab"*, 4 high-level scenarios
**Modules:** **LIBR** (Library tab — list, sort, search, School licence section) — *maps to the future `schoolLibrary` page object* · **UMBP** (umbrella product materials view, reached by "See materials") — *`umbrellaProduct`*
**App:** Admin App / NEMO — `micro-nemo.comprodls.com` (Thor)
**Pages in scope:** Library tab `/admin/admin/org_<slug>/library` · product materials view `/dashboard/teacher/org_<slug>/bundle/<productId>/view`
**Generated:** 2026-08-24 · **Revised:** 2026-08-26 | **Total TCs:** 41 (16 Positive · 19 Edge · 6 Negative) — **all 4 source scenarios covered**
**Execution status (2026-08-26):** **0 of 41 TCs automated.** All **41 are Not Run** — **nothing is Blocked**. This is a design-only batch — nothing has been automated yet, and no case is marked Pass.
- Module **LIBR** (`TST_LIBR_TC_1–31`, 31 TCs) — scenarios #1, #3, #4, plus one added tab-load case and one added responsive-layout defect (`TC_31`).
- Module **UMBP** (`TST_UMBP_TC_1–10`, 10 TCs) — scenario #2.

> **Scope note.** The request was for "the other tab of admin" — the remaining Admin App tab after
> Classes, Students and Staff. `Requirement.xlsx` names it explicitly: the **Library tab**. All four
> of its scenarios are in this batch; nothing is deferred.

## Revision 2026-08-26 — search behaviour confirmed, and test data switched to our own products

**Two search behaviours were CONFIRMED INTENDED by the product team** and are no longer treated as
defects. Both remain as test cases — they describe real, non-obvious behaviour that automation must
not contradict — but they are recorded as **Edge** cases, not bugs.

| TC | Confirmed behaviour |
|---|---|
| `TST_LIBR_TC_21` | **The search is deliberately fuzzy.** Searching `vm_automation` returns close matches whose titles do not contain the term (`cqaautomationbundle1`, `Bulk Activation - Test Umbrella 1`, …) *after* the true title matches. **Reclassified Negative → Edge.** |
| `TST_LIBR_TC_19` | **Multi-word terms are OR-matched**, so adding a word broadens the search (`vm_automation` → 22, `vm_automation testing` → 29). Not a defect. |

**The useful thing grounding found instead of a bug — a ranking rule.** Exact/substring matches
**always rank above** the fuzzy tail, in every term tried on 2026-08-26. That is the stable
assertion the automation should make, in place of counts:

> *all substring matches are present **and** occupy the leading positions* — never *"every result
> contains the term"*, which fails against the live product.

**Test data switched to automation-owned products** (`vm_automation_book101`,
`vm_automation_testing_108`) in every search case, replacing another team's `Compass*` products
[user decision, 2026-08-26]. The shared school `FCN-CHZ-PDA` is actively mutated by other teams, so
their data can change under us; ours cannot. Affects `TST_LIBR_TC_7`, `TC_10–19`, `TC_21`.

> Note that an **exact full-title search still returns a fuzzy tail** — `vm_automation_book101`
> returned 10 results, not 1. `TST_LIBR_TC_10` therefore asserts **rank 1**, not a result count.

---

**`TST_LIBR_TC_30` UNBLOCKED and VERIFIED — 2026-08-26.** It was Blocked at design time because no zero-licence school was available. The user supplied one — **`ACJ-DXL-JKR` "Perf Test School 4"** (`org_perf_testschool_4`) — and the behaviour was confirmed live: when a school holds no licence the **School licence section is absent entirely**, with no empty-state message replacing it. The case is now **Not Run** and runnable, and its expected result is verified rather than `[ASSUMED]`.

> ⚠️ **`TST_LIBR_TC_30` is the only case that uses a different school.** Every other case runs on `FCN-CHZ-PDA`; this one must set its own school context to `ACJ-DXL-JKR`.

**A related product fact was found while verifying it:** the Library product list is **catalogue-wide, not licence-driven**. `ACJ-DXL-JKR` holds **zero** licences yet lists the **same 970 products** as `FCN-CHZ-PDA`, which holds three. Holding no licence does not shrink the Library list — only the School licence box disappears. `TST_LIBR_TC_27` carries a note so it is not misread as evidence that the list derives from licences.

**Two product defects remain open** and are written as expected-versus-actual cases:

| TC | Defect |
|---|---|
| `TST_UMBP_TC_10` | **"Back" on the product materials view does not return to the Library tab.** It requests `/admin/admin//library` — the org slug is missing and the path has a doubled slash — which does not resolve, so the app redirects to **My school accounts**. The school context is lost and the admin must re-select the school to carry on browsing. **Reproduced twice, on two different products, via both a scripted and a real user click.** |
| `TST_LIBR_TC_22` | **A whitespace-only search term is not trimmed.** Three spaces return zero results and the banner renders the raw spaces — `Showing search results for   .` An empty term, by contrast, is handled correctly. |

**Two usability gaps are acknowledged but deliberately NOT raised yet** `[user decision, 2026-08-26]`. Both stay as expected-versus-actual cases, carry their evidence in Remarks, and are revisited before sign-off:

| TC | Gap | Status |
|---|---|---|
| `TST_LIBR_TC_9` | The **sort control gives no indication of direction.** Re-verified live 2026-08-26: the link's full HTML is **byte-for-byte identical** before and after a click — same label `Title`, same class (`active` appears in *both* states), **zero child elements** so there is no icon to rotate, and `aria-sort` / `aria-label` / `title` all absent. The list does flip, so sorting works — only the indicator is missing. | **Valid concern, recorded as a remark for now.** Not filed as a defect. Revisit before sign-off. The missing `aria-sort` is an accessibility gap that stands on its own, separate from the visual-design question. |
| `TST_LIBR_TC_18` | The heading's **`(N)` count disappears the moment a search runs.** `Library (970)` becomes `Library — Showing search results for <term>. Clear`, with no tally; searching `vm_automation` returned 22 products and the page never said so. | **Valid gap, recorded as a remark for now.** Not filed as a defect. Weaker than `TC_9` — no accessibility dimension, purely convenience. |

**Confirmed as-designed, recorded so it is not re-flagged** `[user decision, 2026-08-26]`: the class rows in the *Add to a class* dialog render with **literal square brackets** — `[mn] [acPZ-EQTo]`, raw markup `<button class="dropdown-item work-break class-list">[mn] [acPZ-EQTo]</button>`. This is the **intended display format**, not leftover template markup, so expected results may assert it verbatim (`TST_UMBP_TC_5`).

**Smaller observations, recorded in Remarks rather than as their own cases:** the no-results message has **no closing full stop** (`TST_LIBR_TC_20`); the expired-licence warning icon carries `alt=""`, so its meaning is not exposed to screen-reader users (`TST_LIBR_TC_26`); and **three different date formats** are used across one feature — `Expires Jul 5, 2029` on licence tiles, `Started: … Expires: …` on licensed components, and a bare `Expires` + date on others (`TST_UMBP_TC_6`).

**Two behaviours differ from the Classes tab and must not be inherited from it:**

| Behaviour | Classes tab | Library tab |
|---|---|---|
| Sort collation | by **code point** (`admin-shared.md` §A4) | **case-insensitive** (`TST_LIBR_TC_5`) |
| Search persistence | persists **server-side**, survives reload and re-login | **not persisted** — cleared by reload (`TST_LIBR_TC_16`) |

**Batches:** Batch 1 — the whole Library-tab scenario list (`TST_LIBR_*` / `TST_UMBP_*`, 40 TCs).

## Revision 2026-08-26 (later) — long-title wrap verified, and a new defect found

Verifying the last `[ASSUMED]` item produced three results:

1. **`TST_LIBR_TC_29` is now VERIFIED.** The School licence tile wraps a 55-character title correctly — 3 lines at ~1046 px, 2 lines at 400 px, never overflowing its tile at either width.
2. **NEW DEFECT, added as `TST_LIBR_TC_31`.** The **main product-list rows do NOT wrap** and push past the page edge at narrow widths: at a 385 px document width the page `scrollWidth` was **607 px** and **22 elements** overflowed, so the whole page scrolls sideways. Root cause is a styling inconsistency — the licence tile uses `word-break: break-word`, the list row does not.
3. ⚠️ **A product on the shared school was RENAMED between 2026-08-24 and 2026-08-26** — `testumbrellabundleverylongnametocheckwrappingoftext` → `testumbrellabundlevery_longname_tocheck_wrapping_oftext`. Every reference was updated. **This is exactly the churn the test-data policy above guards against**, and it is why search cases use our own `vm_automation_*` products. Treat third-party titles as `<PLACEHOLDER>` and re-read them at run time.

> **Ordering:** test cases are **grouped by Linked Requirement (scenario)** so every requirement's TCs sit
> together; within each group they run **Positive → Edge → Negative**. (This intentionally departs from
> `manual-test-standard.md`'s global P→E→N ordering, per the Admin App convention.) **S.No.** is sequential
> 1–40 in this grouped order.
>
> **Batch 1 scope:** all 4 scenarios from the source workbook, in one document, split across two module
> codes chosen to survive automation (named after the page objects the screens will get, `admin-shared.md`
> §A8.4). Nothing deferred.
>
> Unverified expected text is marked `[ASSUMED]`; env-specific values use `<PLACEHOLDER>` (see Remarks).

---

## Requirement → Test Case coverage map

| Linked Requirement (scenario) | Mapped TC IDs (P → E → N) |
|---|---|
| — Library tab load (added, not in source) | TST_LIBR_TC_1 |
| #1 — Verify Sort feature | TST_LIBR_TC_2, TST_LIBR_TC_3, TST_LIBR_TC_4, TST_LIBR_TC_5 (E), TST_LIBR_TC_6 (E), TST_LIBR_TC_7 (E), TST_LIBR_TC_8 (E), TST_LIBR_TC_9 (N) |
| #4 — Verify search by title | TST_LIBR_TC_10, TST_LIBR_TC_11, TST_LIBR_TC_12, TST_LIBR_TC_13, TST_LIBR_TC_14 (E), TST_LIBR_TC_15 (E), TST_LIBR_TC_16 (E), TST_LIBR_TC_17 (E), TST_LIBR_TC_18 (E), TST_LIBR_TC_19 (E), TST_LIBR_TC_20 (N), TST_LIBR_TC_21 (E), TST_LIBR_TC_22 (N) |
| #3 — Verify School licence appear in school licence section | TST_LIBR_TC_23, TST_LIBR_TC_24, TST_LIBR_TC_25, TST_LIBR_TC_26 (E), TST_LIBR_TC_27 (E), TST_LIBR_TC_28 (E), TST_LIBR_TC_29 (E), TST_LIBR_TC_30 (N), TST_LIBR_TC_31 (N) |
| #2 — Verify See Materials for an umbrella product - All types of components | TST_UMBP_TC_1, TST_UMBP_TC_2, TST_UMBP_TC_3, TST_UMBP_TC_4, TST_UMBP_TC_5, TST_UMBP_TC_6 (E), TST_UMBP_TC_7 (E), TST_UMBP_TC_8 (E), TST_UMBP_TC_9 (E), TST_UMBP_TC_10 (N) |
Every one of the 4 source scenarios has at least one test case.

---

## Product reference (captured live 2026-08-24 / 2026-08-26, Thor)

**Schools used**

| Key | Name | Org slug | Licences | Used by |
|---|---|---|---|---|
| `FCN-CHZ-PDA` | 3 July Test School 1 | `org_perf_testschool_1` | 3 | every case except `TST_LIBR_TC_30` |
| `ACJ-DXL-JKR` | **Perf Test School 4** | `org_perf_testschool_4` | **0** | **`TST_LIBR_TC_30` only** — the zero-licence case `[added 2026-08-26]` |

> Both schools list the **same 970 products**, so the Library list is **catalogue-wide, not
> licence-driven**. Only the School licence box reflects licensing.

### Entry path and routes

```
Login → My school accounts (/admin/admin/dashboard)
   └─ school card, selected BY KEY (FCN-CHZ-PDA) → Classes tab
        └─ left nav: Classes · Students · Staff · LIBRARY · Reports

LIBRARY tab                /admin/admin/org_<slug>/library      (left-nav qid aDetail-5)
  ├─ Search by title  +  Search button          (qid aLibrary-1 / aLibrary-2)
  ├─ School licence section                     (qid sa-lbt-sle-cntr)
  │     └─ tile per licence                     (qid sa-lbt-sle-prdtcrd-<n>)  → product materials view
  ├─ Sort by: Title                             (qid aLibrary-3)
  └─ product row (the ROW is the control)       (qid aLibrary-4-<n>)          → product materials view
        └─ "See materials" link  (aria-hidden, tabindex=-1 — not the accessible target)

search active
  └─ heading becomes  "Library  Showing search results for <term>.  Clear"
                                                 Clear = qid aClass-99  ← a CLASSES-tab qid

product materials view     /dashboard/teacher/org_<slug>/bundle/<productId>/view
  ├─ Back                                       (qid t-prd-umb-link-1)   ⚠ does NOT return to Library
  ├─ <product title> (h1)                       (qid t-prd-umb-link-2)
  ├─ Add to a class                             (qid t-prd-umb-btn-1)  → #addMaterialToClassModal
  ├─ Learning materials (h2) · Activate materials (qid t-prd-link-1)
  └─ component tile × N                         (qid t-prd-cmp-cntr-1 — SHARED BY EVERY TILE)
```

### States observed

| State | Seen? | Notes |
|---|---|---|
| Populated list | ✅ | 970 products; **all rendered at once — there is NO "Load more" and no lazy loading** (contrast the Classes tab, page size 20) |
| Search results | ✅ | `vm_automation_book101` → 10; `vm_automation` → 22; `vm_automation testing` → 29 `[2026-08-26]` |
| Search — no results | ✅ | Sort control is **removed from the DOM**; School licence section stays |
| Search — whitespace only | ✅ | 0 results, untrimmed term echoed |
| School licence — in date | ✅ | `Expires Jul 5, 2029`, no icon |
| School licence — expired | ✅ | `Expired Jan 7, 2026` + `error.svg` icon |
| School licence — none held | ✅ | **Verified 2026-08-26** on `ACJ-DXL-JKR` — the section is **absent entirely**, no empty-state message. Product list still shows all 970 |
| Long title — School licence tile | ✅ | **Verified 2026-08-26** — wraps inside the tile, 3 lines at ~1046 px / 2 lines at 400 px, never overflowing (`TST_LIBR_TC_29`) |
| Long title — main product LIST row | ✅ | **DEFECT** — does *not* wrap; 22 elements overflow and the page scrolls sideways at 385 px (`TST_LIBR_TC_31`) |
| Product view — multi-component | ✅ | 12 components (r55multicomponent), 15 (testumbrellabundle) |
| Product view — single component | ❌ | **`[ASSUMED]`** — none located among 970 products; the list does not expose component counts. **Accepted as a low-risk gap** `[user decision, 2026-08-26]` — confirm at execution, do not hunt. `TST_UMBP_TC_9` |
| Add-to-a-class dialog | ✅ | Opened and read; **the action was deliberately not completed** |
| Component activation | ❌ | **Deliberately not exercised** — activation mutates the shared school's entitlement irreversibly |

### Fields

| Field | Type | `maxlength` | Notes |
|---|---|---|---|
| Search by title (Library) | text | **none** | `name="search-text"`, placeholder `Search by title`. Submit-driven — typing alone does not filter |
| Search classes (Add to a class dialog) | text | **none** | placeholder `Search classes` |

> No capped field exists on either screen, so there is no `maxlength` boundary case to write.
> This is stated explicitly rather than left as a silent gap (`admin-shared.md` §A3).

### Copy captured verbatim

| Where | Text |
|---|---|
| Heading, no search | `Library (970)` — the `(N)` equals the left-nav Library count |
| Heading, search active | `Library` + `Showing search results for <term>.` + `Clear` — **the `(N)` count is dropped** |
| School licence heading | `School licence` |
| School licence description | `Here are the materials that students can access when added to a class and all teachers can access in their library` |
| Licence tile, in date | `Expires Jul 5, 2029` |
| Licence tile, expired | `Expired Jan 7, 2026` (with `error.svg`) |
| Search, no results | `This school has no learning materials that match your search <term>. Please check the spelling or try a different search term` — **echoes the term; no closing full stop** |
| Product view | `Learning materials` · `Add to a class` · `Activate materials` · `Back` |
| Activation summary | `3 out of 4 components activated` — present on `r55multicomponent`, **absent on `testumbrellabundle`** |
| Component, licensed | `School licence active` + `Started: Jul 5, 2024 Expires: Jul 4, 2029` |
| Component, expired | `Re-activate` + `Expired` + `Jul 12, 2022` |
| Component, unactivated | `Activate` |
| Add-to-a-class dialog | `Choose a class to add <product title>` · `Search classes` · `Add to Class` (disabled until a class is selected) |

### Async behaviour and persistence

- **Search is submit-driven**, settles ~**1.0 s** (measured 1032 ms). Typing alone does nothing.
- **Full list render ~5.1 s** for 970 products on Thor. Budget generously; do not inherit this number.
- **Sort does NOT persist** across reload — resets to A→Z.
- **Search does NOT persist** across reload — **unlike the Classes tab**, whose search persists server-side.
- **Sorting is client-side** — no refetch, count unchanged.
- **Search does not touch the School licence section**, which always shows the school's full licence set.

### Search semantics — CONFIRMED INTENDED by the product team `[2026-08-26]`

Neither of these is a defect. Both are recorded so nobody re-raises them, and so no automation
asserts the opposite.

- **The search is deliberately FUZZY, not a substring match.** `vm_automation` returns 22 results of
  which only **2** contain the term; the rest are close matches
  (`cqaautomationbundle1`, `Bulk Activation - Test Umbrella 1`, `Visible prior to activation other comps`).
  Even an **exact full title** returns a tail — `vm_automation_book101` returned **10**, not 1.
- **Multi-word terms are OR-matched, so adding a word BROADENS the search:**
  `vm_automation` → 22, `vm_automation testing` → 29.

> **The ranking rule is the durable assertion.** Substring matches **always rank above** the fuzzy
> tail, in their own order — verified across every term tried on 2026-08-26
> (`vm_automation`, `vm_automation testing`, `vm_automation_testing_108`). The exact typed title
> ranks **1**.
>
> ✅ assert *"all substring matches are present and occupy the leading positions"*
> ❌ never assert *"every result contains the term"* — that fails against the live product
> ❌ never assert a result **count** — the fuzzy tail is data-dependent
>
> ⚠️ **Sorting overrides the ranking.** Clicking *Sort by: Title* on a result set re-orders the whole
> set alphabetically, discarding the relevance order. Assert ranking *before* sorting.

### Test data policy `[user decision, 2026-08-26]`

Search cases use **automation-owned products** — `vm_automation_book101`,
`vm_automation_testing_108` — not another team's data. `FCN-CHZ-PDA` is shared and actively mutated
(`admin-shared.md` §A5), so another team's products can be renamed or removed under us; ours cannot.
The earlier `Compass*` terms were replaced throughout for this reason.

### Automation traps found during grounding (promoted to `admin-shared.md`)

1. **`t-prd-cmp-cntr-1` is shared by EVERY component tile** — the qid cannot address one component.
2. **2330 pre-rendered class options in the Add-to-a-class dialog**, all sharing the single qid
   `t-prd-umb-dd-1` and all hidden until the dialog opens — a presence check is a guaranteed false green.
3. **`aLibrary-4-<n>` product rows are positional** — look the row up by title on every use.
4. **The Clear link is `aClass-99`** — a Classes-tab qid on the Library tab; not in the `aLibrary-*` family.
5. **The sort control cannot tell you the direction** — assert list order, never the control.
6. **The row, not the "See materials" anchor, is the accessible control** — the anchor is
   `aria-hidden="true" tabindex="-1"`.
7. **`Back` on the product view breaks the school context** — a suite must re-navigate via the school card.

---

## Test cases


### Linked Requirement: — Library tab load (added, not in source)

#### 1. `TST_LIBR_TC_1` — Verify the Library tab renders its heading, count, search bar, sort control and School licence section when opened from the left nav

| Field | Value |
|---|---|
| **S.No.** | 1 |
| **Test Case ID** | TST_LIBR_TC_1 |
| **Title** | Verify the Library tab renders its heading, count, search bar, sort control and School licence section when opened from the left nav |
| **Linked Requirement** | — Library tab load (added, not in source) |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as school-admin (testt1@mailsac.com) on Thor; school FCN-CHZ-PDA "3 July Test School 1" already opened from My school accounts (school context MUST be set by clicking the school card). |
| **Test Steps** | 1. From the school page, note the count shown on the left-nav LIBRARY tab.<br>2. Click the LIBRARY tab.<br>3. Wait for the product list to render.<br>4. Observe the page heading, the search bar, the Sort by control and the School licence section. |
| **Test Data** | School key FCN-CHZ-PDA · left-nav Library count at time of capture: 970 |
| **Expected Result** | 1. URL becomes /admin/admin/org_perf_testschool_1/library and the browser tab reads "Library \| Cambridge One".<br>2. The h2 heading reads "Library (N)" where N EQUALS the count on the left-nav LIBRARY tab.<br>3. A search box with placeholder "Search by title" and an enabled "Search" button are present.<br>4. A "Sort by:" label with a "Title" control is present.<br>5. The "School licence" section is present above the product list, with the description "Here are the materials that students can access when added to a class and all teachers can access in their library".<br>6. Every product row shows the product title and a "See materials" link. |
| **Remarks** | Count is environment- and time-specific — assert heading count EQUALS left-nav count, never an absolute number (admin-shared.md §A5). List render measured at ~5.1 s for 970 products on Thor 2026-08-24; budget generously. |
| **Actual Result** | *(blank — filled by the tester)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank — filled by the tester)* |


### Linked Requirement: #1 — Verify Sort feature

#### 2. `TST_LIBR_TC_2` — Verify the product list is sorted by title in ascending order when the Library tab first loads

| Field | Value |
|---|---|
| **S.No.** | 2 |
| **Test Case ID** | TST_LIBR_TC_2 |
| **Title** | Verify the product list is sorted by title in ascending order when the Library tab first loads |
| **Linked Requirement** | #1 — Verify Sort feature |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Library tab open on FCN-CHZ-PDA with a populated product list. |
| **Test Steps** | 1. Open the Library tab.<br>2. Read the titles of the first and last products in the list, and capture the full ordered list of titles. |
| **Test Data** | None — read-only |
| **Expected Result** | 1. The list is sorted A→Z by title, compared case-insensitively.<br>2. At capture the first three were "(Do Not Edit) sj11042501", "(DO NOT USE) nonmqa_umbrella_do_not_use", "3 Level TOC Compass Umbrella" and the last was "yaminitestproduct1".<br>3. The "Sort by: Title" control is displayed and marked active. |
| **Remarks** | Named titles are Thor/FCN-CHZ-PDA specific — the durable assertion is "list equals itself sorted case-insensitively ascending", not the literal titles. |
| **Actual Result** | *(blank — filled by the tester)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank — filled by the tester)* |

#### 3. `TST_LIBR_TC_3` — Verify the product list reverses to descending order when the Sort by Title control is clicked once

| Field | Value |
|---|---|
| **S.No.** | 3 |
| **Test Case ID** | TST_LIBR_TC_3 |
| **Title** | Verify the product list reverses to descending order when the Sort by Title control is clicked once |
| **Linked Requirement** | #1 — Verify Sort feature |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Library tab open, list in its default A→Z order. |
| **Test Steps** | 1. Capture the ordered list of product titles.<br>2. Click the "Title" control next to "Sort by:".<br>3. Capture the ordered list of titles again. |
| **Test Data** | None — read-only |
| **Expected Result** | 1. The list re-renders in Z→A order — it is the exact reverse of the list captured in step 1.<br>2. The product COUNT is unchanged (no products are added or dropped by sorting).<br>3. At capture the first three became "yaminitestproduct1", "Y Test Product", "vm_automation_testing_108". |
| **Remarks** | Sorting is client-side and immediate — no page reload. |
| **Actual Result** | *(blank — filled by the tester)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank — filled by the tester)* |

#### 4. `TST_LIBR_TC_4` — Verify the product list returns to ascending order when the Sort by Title control is clicked a second time

| Field | Value |
|---|---|
| **S.No.** | 4 |
| **Test Case ID** | TST_LIBR_TC_4 |
| **Title** | Verify the product list returns to ascending order when the Sort by Title control is clicked a second time |
| **Linked Requirement** | #1 — Verify Sort feature |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | Library tab open, list already toggled to Z→A by one click on "Title". |
| **Test Steps** | 1. Click the "Title" control a second time.<br>2. Capture the ordered list of titles. |
| **Test Data** | None — read-only |
| **Expected Result** | 1. The list returns to A→Z, identical to the default order seen on load.<br>2. The product count is unchanged. |
| **Remarks** | Confirms the control is a two-state toggle, not a one-way sort. |
| **Actual Result** | *(blank — filled by the tester)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank — filled by the tester)* |

#### 5. `TST_LIBR_TC_5` — Verify sorting compares titles case-insensitively rather than by character code point

| Field | Value |
|---|---|
| **S.No.** | 5 |
| **Test Case ID** | TST_LIBR_TC_5 |
| **Title** | Verify sorting compares titles case-insensitively rather than by character code point |
| **Linked Requirement** | #1 — Verify Sort feature |
| **Type** | Edge |
| **Priority** | Medium |
| **Preconditions** | Library tab open with products whose titles differ only by leading-letter case (e.g. "Y Test Product" and "yaminitestproduct1", "Visible prior to activation other comps" and "vm_automation_book101"). |
| **Test Steps** | 1. Open the Library tab in its default A→Z order.<br>2. Locate the titles "Visible prior to activation other comps", "vm_automation_book101", "Y Test Product" and "yaminitestproduct1".<br>3. Note their relative positions. |
| **Test Data** | None — read-only |
| **Expected Result** | 1. Order is "Visible prior to activation other comps" → "vm_automation_book101" → … → "Y Test Product" → "yaminitestproduct1".<br>2. Uppercase and lowercase initials are interleaved, proving a CASE-INSENSITIVE comparison. A code-point comparison would place every uppercase title before every lowercase one, and "Y Test Product" before "vm_automation_book101". |
| **Remarks** | IMPORTANT CONTRAST: the Classes tab sorts by CODE POINT (admin-shared.md §A4). The Library tab does NOT. Do not reuse the Classes-tab collation expectation here. Verified live 2026-08-24. |
| **Actual Result** | *(blank — filled by the tester)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank — filled by the tester)* |

#### 6. `TST_LIBR_TC_6` — Verify the chosen sort direction is not retained when the Library tab is reloaded

| Field | Value |
|---|---|
| **S.No.** | 6 |
| **Test Case ID** | TST_LIBR_TC_6 |
| **Title** | Verify the chosen sort direction is not retained when the Library tab is reloaded |
| **Linked Requirement** | #1 — Verify Sort feature |
| **Type** | Edge |
| **Priority** | Medium |
| **Preconditions** | Library tab open and toggled to Z→A. |
| **Test Steps** | 1. Click "Title" to put the list in Z→A order and confirm the first title.<br>2. Reload the Library page (F5) and wait for the list to render.<br>3. Read the first title again. |
| **Test Data** | None — read-only |
| **Expected Result** | 1. After reload the list is back in the default A→Z order — the descending choice is NOT persisted. |
| **Remarks** | Matches the Classes tab, where sorting also does not persist while filter and search do (admin-shared.md §A4). Verified live 2026-08-24. |
| **Actual Result** | *(blank — filled by the tester)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank — filled by the tester)* |

#### 7. `TST_LIBR_TC_7` — Verify the sort control remains available and reorders the results when a search is active

| Field | Value |
|---|---|
| **S.No.** | 7 |
| **Test Case ID** | TST_LIBR_TC_7 |
| **Title** | Verify the sort control remains available and reorders the results when a search is active |
| **Linked Requirement** | #1 — Verify Sort feature |
| **Type** | Edge |
| **Priority** | Medium |
| **Preconditions** | Library tab open. |
| **Test Steps** | 1. Type "vm_automation" into "Search by title" and click Search.<br>2. Wait for the narrowed result list.<br>3. Confirm the "Sort by: Title" control is still displayed.<br>4. Click "Title" and capture the result order. |
| **Test Data** | Search term: vm_automation (22 results at capture) |
| **Expected Result** | 1. The sort control is still displayed while search results are shown.<br>2. Clicking it reverses the order of the SEARCH RESULTS only.<br>3. The result count is unchanged by sorting, and the "Showing search results for vm_automation." banner remains. |
| **Remarks** | Result count is data-dependent — assert that the count is unchanged by sorting, not 22. NOTE: sorting reorders the whole result set alphabetically, which overrides the relevance ranking of TST_LIBR_TC_21. Uses products created by our own automation (vm_automation_*) rather than another team's data, so the expected ranking stays stable as the shared school changes. [user decision, 2026-08-26] |
| **Actual Result** | *(blank — filled by the tester)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank — filled by the tester)* |

#### 8. `TST_LIBR_TC_8` — Verify the sort control is not rendered when a search returns no results

| Field | Value |
|---|---|
| **S.No.** | 8 |
| **Test Case ID** | TST_LIBR_TC_8 |
| **Title** | Verify the sort control is not rendered when a search returns no results |
| **Linked Requirement** | #1 — Verify Sort feature |
| **Type** | Edge |
| **Priority** | Low |
| **Preconditions** | Library tab open. |
| **Test Steps** | 1. Search for a term that matches no product (e.g. zzqqxx9999).<br>2. Inspect the area where "Sort by: Title" normally appears. |
| **Test Data** | Search term: zzqqxx9999 |
| **Expected Result** | 1. The no-results message is shown.<br>2. The "Sort by:" label and "Title" control are NOT present in the page — there is nothing to sort. |
| **Remarks** | Genuinely removed from the DOM in this state (verified 2026-08-24), so a presence check is truthful here — unlike most admin dialogs (admin-shared.md §B2). |
| **Actual Result** | *(blank — filled by the tester)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank — filled by the tester)* |

#### 9. `TST_LIBR_TC_9` — Verify the sort control indicates the current sort direction to the user

| Field | Value |
|---|---|
| **S.No.** | 9 |
| **Test Case ID** | TST_LIBR_TC_9 |
| **Title** | Verify the sort control indicates the current sort direction to the user |
| **Linked Requirement** | #1 — Verify Sort feature |
| **Type** | Negative |
| **Priority** | Medium |
| **Preconditions** | Library tab open in the default A→Z order. |
| **Test Steps** | 1. Observe the "Sort by: Title" control and record its label, any icon, and its styling.<br>2. Click "Title" to switch to Z→A.<br>3. Observe the control again and compare. |
| **Test Data** | None — read-only |
| **Expected Result** | EXPECTED: the control communicates the active direction — e.g. an ascending/descending arrow, a changed label, or an aria-sort value — so a user can tell A→Z from Z→A without reading the list.<br><br>ACTUAL (Thor, re-verified 2026-08-26): the control is byte-for-byte IDENTICAL in both states. Captured before and after a single click:<br>  <a qid="aLibrary-3" href="javascript:void(0);" class="list-info ml-2 sort-by-title-btn active">Title</a><br>  · label "Title" unchanged · class unchanged (note "active" is present in BOTH states — it means "this is the sort in use", not a direction) · ZERO child elements, so there is no icon to rotate · aria-sort, aria-label and title all ABSENT.<br>The list itself did flip (first item "(Do Not Edit) sj11042501" → "yaminitestproduct1"), so sorting works — only the indicator is missing. |
| **Remarks** | STATUS: acknowledged as a VALID concern by the user 2026-08-26 — RECORDED AS A REMARK FOR NOW, deliberately NOT raised as a defect ticket yet. Revisit before the batch is signed off. Two separable halves: (a) the missing visual arrow may be a deliberate design choice; (b) the missing aria-sort is an ACCESSIBILITY gap — a screen-reader user has no way at all to learn the sort direction — and stands on its own regardless of (a). Evidence re-captured live 2026-08-26 by comparing the full outerHTML before and after a click; they are identical. AUTOMATION NOTE: assert list ORDER, never the control's class or text — the control genuinely cannot distinguish the two states. |
| **Actual Result** | *(blank — filled by the tester)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank — filled by the tester)* |


### Linked Requirement: #4 — Verify search by title

#### 10. `TST_LIBR_TC_10` — Verify the searched product is returned as the first result when its full exact title is searched

| Field | Value |
|---|---|
| **S.No.** | 10 |
| **Test Case ID** | TST_LIBR_TC_10 |
| **Title** | Verify the searched product is returned as the first result when its full exact title is searched |
| **Linked Requirement** | #4 — Verify search by title |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Library tab open on FCN-CHZ-PDA; the automation-owned product vm_automation_book101 present in the library. |
| **Test Steps** | 1. Type the full title "vm_automation_book101" into "Search by title".<br>2. Click Search.<br>3. Wait for the list to settle and read the results in order. |
| **Test Data** | Search term: vm_automation_book101 (10 results at capture, 2026-08-26) |
| **Expected Result** | 1. "vm_automation_book101" is returned as the FIRST result.<br>2. The heading changes to "Library" followed by "Showing search results for vm_automation_book101." and a "Clear" link.<br>3. Further close-match products are listed after it — an exact-title search still returns a fuzzy tail (see TST_LIBR_TC_21). Do NOT expect exactly one result.<br>4. Every result row still shows its title and a "See materials" link. |
| **Remarks** | Uses products created by our own automation (vm_automation_*) rather than another team's data, so the expected ranking stays stable as the shared school changes. [user decision, 2026-08-26] Assert RANK 1, not the result count — the tail length is data-dependent (10 at capture). Search settles ~1.0 s. |
| **Actual Result** | *(blank — filled by the tester)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank — filled by the tester)* |

#### 11. `TST_LIBR_TC_11` — Verify all products whose title contains the term are returned first when a partial title is searched

| Field | Value |
|---|---|
| **S.No.** | 11 |
| **Test Case ID** | TST_LIBR_TC_11 |
| **Title** | Verify all products whose title contains the term are returned first when a partial title is searched |
| **Linked Requirement** | #4 — Verify search by title |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Library tab open with a populated list containing the automation-owned products vm_automation_book101 and vm_automation_testing_108. |
| **Test Steps** | 1. Note the total product count in the heading.<br>2. Type the partial term "vm_automation" into "Search by title".<br>3. Click Search.<br>4. Read the returned titles IN ORDER. |
| **Test Data** | Search term: vm_automation (22 results at capture; 2 contain the term) |
| **Expected Result** | 1. The list narrows — fewer products than the unfiltered total.<br>2. BOTH products whose title contains "vm_automation" are returned: "vm_automation_book101" and "vm_automation_testing_108".<br>3. They occupy the FIRST positions in the result list — every substring match ranks above every non-substring match.<br>4. The banner reads "Showing search results for vm_automation." with a "Clear" link. |
| **Remarks** | Uses products created by our own automation (vm_automation_*) rather than another team's data, so the expected ranking stays stable as the shared school changes. [user decision, 2026-08-26] The durable assertion is: all substring matches are present AND occupy the leading positions. Verified live 2026-08-26 across three terms. Do not assert the total count — the fuzzy tail is data-dependent. |
| **Actual Result** | *(blank — filled by the tester)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank — filled by the tester)* |

#### 12. `TST_LIBR_TC_12` — Verify search results are the same regardless of the case of the search term

| Field | Value |
|---|---|
| **S.No.** | 12 |
| **Test Case ID** | TST_LIBR_TC_12 |
| **Title** | Verify search results are the same regardless of the case of the search term |
| **Linked Requirement** | #4 — Verify search by title |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | Library tab open. |
| **Test Steps** | 1. Search for "vm_automation" (lower case) and capture the returned titles in order.<br>2. Clear the search.<br>3. Search for "VM_AUTOMATION" (upper case) and capture the returned titles in order.<br>4. Compare the two result sets. |
| **Test Data** | Search terms: vm_automation · VM_AUTOMATION (22 results each at capture) |
| **Expected Result** | 1. Both searches return the SAME products in the SAME order — matching is case-insensitive.<br>2. The banner echoes the term exactly as typed, preserving the case the user entered. |
| **Remarks** | Uses products created by our own automation (vm_automation_*) rather than another team's data, so the expected ranking stays stable as the shared school changes. [user decision, 2026-08-26] Verified live 2026-08-26 — both terms returned an identical 22-title list. |
| **Actual Result** | *(blank — filled by the tester)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank — filled by the tester)* |

#### 13. `TST_LIBR_TC_13` — Verify the full product list is restored when Clear is clicked on an active search

| Field | Value |
|---|---|
| **S.No.** | 13 |
| **Test Case ID** | TST_LIBR_TC_13 |
| **Title** | Verify the full product list is restored when Clear is clicked on an active search |
| **Linked Requirement** | #4 — Verify search by title |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Library tab open with an active search showing narrowed results. |
| **Test Steps** | 1. Note the unfiltered heading count, e.g. "Library (970)".<br>2. Search for "vm_automation".<br>3. Click the "Clear" link in the heading.<br>4. Wait for the list to settle. |
| **Test Data** | Search term: vm_automation |
| **Expected Result** | 1. The full product list is restored — the count returns to the pre-search total.<br>2. The heading returns to "Library (N)"; the "Showing search results for …" banner and the "Clear" link are gone.<br>3. The "Search by title" box is emptied. |
| **Remarks** | AUTOMATION NOTE: the Clear link carries qid "aClass-99" — a Classes-tab qid reused on the Library tab. It is NOT a Library qid; do not assume the aLibrary-* family covers it. |
| **Actual Result** | *(blank — filled by the tester)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank — filled by the tester)* |

#### 14. `TST_LIBR_TC_14` — Verify the list is not filtered until the Search button is clicked

| Field | Value |
|---|---|
| **S.No.** | 14 |
| **Test Case ID** | TST_LIBR_TC_14 |
| **Title** | Verify the list is not filtered until the Search button is clicked |
| **Linked Requirement** | #4 — Verify search by title |
| **Type** | Edge |
| **Priority** | High |
| **Preconditions** | Library tab open with the full product list shown. |
| **Test Steps** | 1. Note the number of products shown.<br>2. Type "vm_automation" into "Search by title" but do NOT click Search.<br>3. Wait ~3 seconds and count the products again.<br>4. Now click Search and count again. |
| **Test Data** | Search term: vm_automation |
| **Expected Result** | 1. After typing only, the list is UNCHANGED — the full product list is still shown and no search banner appears.<br>2. Only after Search is clicked does the list narrow and the banner appear. |
| **Remarks** | Search is submit-driven, not live — the same as the Classes tab (admin-shared.md §A4). Verified live 2026-08-24 (970 rows still present after typing). |
| **Actual Result** | *(blank — filled by the tester)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank — filled by the tester)* |

#### 15. `TST_LIBR_TC_15` — Verify the full product list is restored when Search is clicked with an empty search box

| Field | Value |
|---|---|
| **S.No.** | 15 |
| **Test Case ID** | TST_LIBR_TC_15 |
| **Title** | Verify the full product list is restored when Search is clicked with an empty search box |
| **Linked Requirement** | #4 — Verify search by title |
| **Type** | Edge |
| **Priority** | Medium |
| **Preconditions** | Library tab open with an active search narrowing the list. |
| **Test Steps** | 1. Search for "vm_automation" so the list is narrowed.<br>2. Delete all text from the "Search by title" box.<br>3. Click Search. |
| **Test Data** | Search term: (empty) |
| **Expected Result** | 1. The full product list is restored and the heading returns to "Library (N)".<br>2. NO "Showing search results for" banner is displayed — an empty term is treated as "no search", not as a search for an empty string. |
| **Remarks** | Verified live 2026-08-24 — 970 rows restored, banner absent. |
| **Actual Result** | *(blank — filled by the tester)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank — filled by the tester)* |

#### 16. `TST_LIBR_TC_16` — Verify an active search term is not retained when the Library tab is reloaded

| Field | Value |
|---|---|
| **S.No.** | 16 |
| **Test Case ID** | TST_LIBR_TC_16 |
| **Title** | Verify an active search term is not retained when the Library tab is reloaded |
| **Linked Requirement** | #4 — Verify search by title |
| **Type** | Edge |
| **Priority** | Medium |
| **Preconditions** | Library tab open with an active search. |
| **Test Steps** | 1. Search for "vm_automation" and confirm the list is narrowed.<br>2. Reload the Library page (F5).<br>3. Wait for the list to render and inspect the heading and the search box. |
| **Test Data** | Search term: vm_automation |
| **Expected Result** | 1. After reload the FULL product list is shown, the heading reads "Library (N)", the search box is empty and no banner is present — the search term is NOT persisted. |
| **Remarks** | IMPORTANT CONTRAST: the Classes tab search DOES persist server-side across reload and login (admin-shared.md §A4). The Library tab does NOT. Verified live 2026-08-24. |
| **Actual Result** | *(blank — filled by the tester)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank — filled by the tester)* |

#### 17. `TST_LIBR_TC_17` — Verify the School licence section is not filtered when a search is applied to the product list

| Field | Value |
|---|---|
| **S.No.** | 17 |
| **Test Case ID** | TST_LIBR_TC_17 |
| **Title** | Verify the School licence section is not filtered when a search is applied to the product list |
| **Linked Requirement** | #4 — Verify search by title |
| **Type** | Edge |
| **Priority** | Medium |
| **Preconditions** | Library tab open on a school that holds at least one school licence. |
| **Test Steps** | 1. Note the number of tiles in the "School licence" section.<br>2. Search for a term that matches none of the licensed product titles (e.g. "vm_automation").<br>3. Inspect the "School licence" section again. |
| **Test Data** | Search term: vm_automation |
| **Expected Result** | 1. The product list below narrows to the search results.<br>2. The "School licence" section is UNCHANGED — the same tiles, in the same order, with the same heading and description. Search applies only to the product list. |
| **Remarks** | Verified live 2026-08-24 (all 3 licence tiles remained while the list narrowed) and re-confirmed with vm_automation 2026-08-26. Uses products created by our own automation (vm_automation_*) rather than another team's data, so the expected ranking stays stable as the shared school changes. [user decision, 2026-08-26] |
| **Actual Result** | *(blank — filled by the tester)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank — filled by the tester)* |

#### 18. `TST_LIBR_TC_18` — Verify the number of matching products is shown to the user while a search is active

| Field | Value |
|---|---|
| **S.No.** | 18 |
| **Test Case ID** | TST_LIBR_TC_18 |
| **Title** | Verify the number of matching products is shown to the user while a search is active |
| **Linked Requirement** | #4 — Verify search by title |
| **Type** | Edge |
| **Priority** | Low |
| **Preconditions** | Library tab open. |
| **Test Steps** | 1. Note that the unfiltered heading shows a count, e.g. "Library (970)".<br>2. Search for "vm_automation".<br>3. Read the heading. |
| **Test Data** | Search term: vm_automation (22 results at capture) |
| **Expected Result** | EXPECTED: the heading reports how many products matched, e.g. "Library (22)".<br><br>ACTUAL (Thor, 2026-08-26): the "(N)" count is REMOVED as soon as a search is active. The heading reads "Library" followed only by "Showing search results for vm_automation." and "Clear". The user cannot tell how many products matched without counting the rows. |
| **Remarks** | STATUS: acknowledged as a valid gap by the user 2026-08-26 — RECORDED AS A REMARK FOR NOW, deliberately NOT raised as a defect ticket. Revisit before sign-off alongside TST_LIBR_TC_9. Weaker than TC_9: there is no accessibility dimension here, it is purely a convenience gap — the results are on screen, only the tally is missing. AUTOMATION NOTE: do NOT assert a heading count while a search is active — there is none. Assert the banner text ("Showing search results for <term>.") instead, and count the rendered rows if a number is needed. |
| **Actual Result** | *(blank — filled by the tester)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank — filled by the tester)* |

#### 19. `TST_LIBR_TC_19` — Verify a multi-word search term broadens the results by matching either word

| Field | Value |
|---|---|
| **S.No.** | 19 |
| **Test Case ID** | TST_LIBR_TC_19 |
| **Title** | Verify a multi-word search term broadens the results by matching either word |
| **Linked Requirement** | #4 — Verify search by title |
| **Type** | Edge |
| **Priority** | Medium |
| **Preconditions** | Library tab open. |
| **Test Steps** | 1. Search for the single term "vm_automation" and note the number of results.<br>2. Clear the search.<br>3. Search for the two-word term "vm_automation testing" and note the number of results.<br>4. Inspect the order of the titles returned by the two-word search. |
| **Test Data** | Search terms: vm_automation (22 at capture) · "vm_automation testing" (29 at capture) |
| **Expected Result** | 1. The two-word search returns MORE results than the single term, not fewer — the words are combined as OR, not as an exact phrase.<br>2. Results include products matching only the second word (e.g. "migration_testing_qa01"), which the single-term search did not return.<br>3. The closest match still ranks first — "vm_automation_testing_108" is result 1. |
| **Remarks** | CONFIRMED INTENDED BEHAVIOUR by the product team [2026-08-26] — this is not a defect. Documented here so nobody re-raises it, and so no automation asserts that adding a word narrows the search. Uses products created by our own automation (vm_automation_*) rather than another team's data, so the expected ranking stays stable as the shared school changes. [user decision, 2026-08-26] |
| **Actual Result** | *(blank — filled by the tester)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank — filled by the tester)* |

#### 20. `TST_LIBR_TC_20` — Verify the no-results message is shown and echoes the term when a search matches no product

| Field | Value |
|---|---|
| **S.No.** | 20 |
| **Test Case ID** | TST_LIBR_TC_20 |
| **Title** | Verify the no-results message is shown and echoes the term when a search matches no product |
| **Linked Requirement** | #4 — Verify search by title |
| **Type** | Negative |
| **Priority** | High |
| **Preconditions** | Library tab open with a populated list. |
| **Test Steps** | 1. Type a term that cannot match any product, e.g. "zzqqxx9999".<br>2. Click Search.<br>3. Read the heading and the message shown in place of the product list. |
| **Test Data** | Search term: zzqqxx9999 |
| **Expected Result** | 1. No product rows are rendered.<br>2. The message reads VERBATIM: "This school has no learning materials that match your search zzqqxx9999. Please check the spelling or try a different search term" — the searched term is echoed back.<br>3. The heading reads "Library" + "Showing search results for zzqqxx9999." + "Clear".<br>4. The "School licence" section is still displayed (see TST_LIBR_TC_17). |
| **Remarks** | Copy captured live 2026-08-24 — assert it verbatim, comparing through a whitespace squash on both sides (admin-shared.md §A6). Note the message has no closing full stop. |
| **Actual Result** | *(blank — filled by the tester)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank — filled by the tester)* |

#### 21. `TST_LIBR_TC_21` — Verify close-match products are returned after the exact title matches when searching by title

| Field | Value |
|---|---|
| **S.No.** | 21 |
| **Test Case ID** | TST_LIBR_TC_21 |
| **Title** | Verify close-match products are returned after the exact title matches when searching by title |
| **Linked Requirement** | #4 — Verify search by title |
| **Type** | Edge |
| **Priority** | Medium |
| **Preconditions** | Library tab open with a populated list containing the automation-owned vm_automation_* products. |
| **Test Steps** | 1. Search for "vm_automation".<br>2. Read every returned title IN ORDER.<br>3. Identify which titles contain the term and which do not.<br>4. Check where the boundary between the two falls. |
| **Test Data** | Search term: vm_automation (22 results at capture — 2 contain the term, 20 are close matches) |
| **Expected Result** | 1. The results contain BOTH exact substring matches and close matches whose titles do NOT contain the term — e.g. "automation thor product(Do not touch)", "cqaautomationbundle1", "Bulk Activation - Test Umbrella 1", "Visible prior to activation other comps".<br>2. Every substring match ranks ABOVE every close match — the leading results are the true title matches, and the close matches follow.<br>3. The search never returns zero results while a substring match exists. |
| **Remarks** | CONFIRMED INTENDED BEHAVIOUR by the product team [2026-08-26] — the search is deliberately fuzzy, so a rough or mistyped term still finds something. Originally written as a defect; RECLASSIFIED from Negative to Edge. AUTOMATION: never assert that every result contains the term — that fails against the live product. Assert the RANKING instead (substring matches first), which held across every term tried on 2026-08-26. Uses products created by our own automation (vm_automation_*) rather than another team's data, so the expected ranking stays stable as the shared school changes. [user decision, 2026-08-26] |
| **Actual Result** | *(blank — filled by the tester)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank — filled by the tester)* |

#### 22. `TST_LIBR_TC_22` — Verify a whitespace-only search term is treated as an empty search rather than as a searchable term

| Field | Value |
|---|---|
| **S.No.** | 22 |
| **Test Case ID** | TST_LIBR_TC_22 |
| **Title** | Verify a whitespace-only search term is treated as an empty search rather than as a searchable term |
| **Linked Requirement** | #4 — Verify search by title |
| **Type** | Negative |
| **Priority** | Low |
| **Preconditions** | Library tab open with the full list shown. |
| **Test Steps** | 1. Type three spaces into "Search by title".<br>2. Click Search.<br>3. Read the heading and the result list. |
| **Test Data** | Search term: "   " (three spaces) |
| **Expected Result** | EXPECTED: the term is trimmed and treated as empty, so the full product list is retained (consistent with TST_LIBR_TC_15).<br><br>ACTUAL (Thor, 2026-08-24) — DEFECT: the term is NOT trimmed. Zero products are returned and the banner renders the raw spaces — "Showing search results for   ." — leaving a visible gap before the full stop and giving the user no readable indication of what was searched. |
| **Remarks** | Low user impact but a clear input-handling gap. The same trimming question applies to leading/trailing spaces around a real term — not yet tested, worth adding once the trimming behaviour is decided. |
| **Actual Result** | *(blank — filled by the tester)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank — filled by the tester)* |


### Linked Requirement: #3 — Verify School licence appear in school licence section

#### 23. `TST_LIBR_TC_23` — Verify the School licence section lists one tile per school licence held by the school

| Field | Value |
|---|---|
| **S.No.** | 23 |
| **Test Case ID** | TST_LIBR_TC_23 |
| **Title** | Verify the School licence section lists one tile per school licence held by the school |
| **Linked Requirement** | #3 — Verify School licence appear in school licence section |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Library tab open on FCN-CHZ-PDA, which holds 3 school licences at capture. |
| **Test Steps** | 1. Open the Library tab.<br>2. Locate the "School licence" section above the product list.<br>3. Read its heading, description and the tiles it contains. |
| **Test Data** | School key FCN-CHZ-PDA · 3 licences at capture: "R55 Multi Component Umbrella", "presentation_plus_test_umb_product_2_june_1", "testumbrellabundlevery_longname_tocheck_wrapping_oftext" |
| **Expected Result** | 1. The section heading reads VERBATIM "School licence".<br>2. The description reads VERBATIM "Here are the materials that students can access when added to a class and all teachers can access in their library".<br>3. One tile is rendered per school licence, each showing the licensed product's title.<br>4. The section appears ABOVE the product list, between the search bar and the "Sort by:" control. |
| **Remarks** | Licence set is environment- and time-specific. Prefer asserting "tile count equals the number of licences returned by the page" plus the verbatim heading/description, rather than the three product names. |
| **Actual Result** | *(blank — filled by the tester)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank — filled by the tester)* |

#### 24. `TST_LIBR_TC_24` — Verify an in-date school licence tile shows its expiry date prefixed with "Expires"

| Field | Value |
|---|---|
| **S.No.** | 24 |
| **Test Case ID** | TST_LIBR_TC_24 |
| **Title** | Verify an in-date school licence tile shows its expiry date prefixed with "Expires" |
| **Linked Requirement** | #3 — Verify School licence appear in school licence section |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Library tab open on a school holding at least one licence whose expiry date is in the future. |
| **Test Steps** | 1. Locate the School licence tile for a licence that has not expired (at capture: "testumbrellabundlevery_longname_tocheck_wrapping_oftext").<br>2. Read the title and the date line on the tile.<br>3. Note whether a status icon is displayed. |
| **Test Data** | In-date licence at capture: "testumbrellabundlevery_longname_tocheck_wrapping_oftext" — "Expires Jul 5, 2029" |
| **Expected Result** | 1. The tile shows the product title.<br>2. The date line reads "Expires <Mon D, YYYY>" — e.g. "Expires Jul 5, 2029" — using the word "Expires" (present tense).<br>3. NO warning/error icon is shown for an in-date licence.<br>4. The tile shows the product's cover image where the product has one. |
| **Remarks** | Verified live 2026-08-24. The <PLACEHOLDER> for other environments is <IN_DATE_LICENCE_TITLE>. |
| **Actual Result** | *(blank — filled by the tester)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank — filled by the tester)* |

#### 25. `TST_LIBR_TC_25` — Verify the product materials view opens when a School licence tile is clicked

| Field | Value |
|---|---|
| **S.No.** | 25 |
| **Test Case ID** | TST_LIBR_TC_25 |
| **Title** | Verify the product materials view opens when a School licence tile is clicked |
| **Linked Requirement** | #3 — Verify School licence appear in school licence section |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Library tab open with at least one School licence tile displayed. |
| **Test Steps** | 1. Click the School licence tile for "testumbrellabundlevery_longname_tocheck_wrapping_oftext".<br>2. Wait for the page to load.<br>3. Read the URL and the page heading. |
| **Test Data** | Licence tile: testumbrellabundlevery_longname_tocheck_wrapping_oftext (product id testumbrellabundle) |
| **Expected Result** | 1. The browser navigates to /dashboard/teacher/org_perf_testschool_1/bundle/<productId>/view.<br>2. The h1 heading equals the licensed product's title.<br>3. The browser tab title reads "<product title> \| Cambridge One".<br>4. This is the SAME destination reached by "See materials" on that product's row in the list below. |
| **Remarks** | Note the destination leaves the admin app and lands on the TEACHER dashboard route. See TST_UMBP_TC_10 — the "Back" control on that page does not return to the Library tab. |
| **Actual Result** | *(blank — filled by the tester)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank — filled by the tester)* |

#### 26. `TST_LIBR_TC_26` — Verify an expired school licence is still listed and is marked with "Expired" and a warning icon

| Field | Value |
|---|---|
| **S.No.** | 26 |
| **Test Case ID** | TST_LIBR_TC_26 |
| **Title** | Verify an expired school licence is still listed and is marked with "Expired" and a warning icon |
| **Linked Requirement** | #3 — Verify School licence appear in school licence section |
| **Type** | Edge |
| **Priority** | Medium |
| **Preconditions** | Library tab open on a school holding at least one licence whose expiry date has passed (FCN-CHZ-PDA holds two at capture). |
| **Test Steps** | 1. Locate the School licence tile for "R55 Multi Component Umbrella".<br>2. Read the date line and note any icon.<br>3. Confirm the tile is still listed in the section. |
| **Test Data** | Expired licences at capture: "R55 Multi Component Umbrella" (Expired Jan 7, 2026), "presentation_plus_test_umb_product_2_june_1" (Expired Jan 31, 2026) |
| **Expected Result** | 1. The expired licence is STILL listed in the School licence section — it is not hidden.<br>2. Its date line reads "Expired <Mon D, YYYY>" — past tense — e.g. "Expired Jan 7, 2026".<br>3. A warning/error icon (error.svg, class "school-licence-icon") is rendered immediately before the date, which the in-date tile does not have. |
| **Remarks** | The icon carries alt="" so its meaning is not exposed to screen-reader users — an accessibility observation worth raising separately. Verified live 2026-08-24. |
| **Actual Result** | *(blank — filled by the tester)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank — filled by the tester)* |

#### 27. `TST_LIBR_TC_27` — Verify products held under a school licence also appear in the main Library product list

| Field | Value |
|---|---|
| **S.No.** | 27 |
| **Test Case ID** | TST_LIBR_TC_27 |
| **Title** | Verify products held under a school licence also appear in the main Library product list |
| **Linked Requirement** | #3 — Verify School licence appear in school licence section |
| **Type** | Edge |
| **Priority** | Medium |
| **Preconditions** | Library tab open with the School licence section populated. |
| **Test Steps** | 1. Record the title of each School licence tile.<br>2. For each recorded title, search for it (or scan the full list) in the product list below. |
| **Test Data** | 3 licence titles at capture |
| **Expected Result** | 1. EVERY school-licence product title is ALSO present as a row in the main product list.<br>2. The School licence section is an additional highlight of those products, not a separate inventory — so the products are not double-counted or omitted from "Library (N)". |
| **Remarks** | Verified live 2026-08-24 — all 3 licence titles found among the 970 list rows. ⚠️ IMPORTANT CONTEXT ADDED 2026-08-26: the main product list is CATALOGUE-WIDE, not licence-driven. Perf Test School 4 · key ACJ-DXL-JKR · org slug org_perf_testschool_4 holds ZERO licences and still lists the SAME 970 products as FCN-CHZ-PDA, which holds 3 (see TST_LIBR_TC_30). So a licensed product appearing in the list proves nothing about licensing — the list would contain it either way. Do not read this case as evidence that the list is derived from licences. |
| **Actual Result** | *(blank — filled by the tester)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank — filled by the tester)* |

#### 28. `TST_LIBR_TC_28` — Verify a placeholder is rendered on a School licence tile when the product has no cover image

| Field | Value |
|---|---|
| **S.No.** | 28 |
| **Test Case ID** | TST_LIBR_TC_28 |
| **Title** | Verify a placeholder is rendered on a School licence tile when the product has no cover image |
| **Linked Requirement** | #3 — Verify School licence appear in school licence section |
| **Type** | Edge |
| **Priority** | Low |
| **Preconditions** | Library tab open on a school holding a licence for a product with no cover image (at capture: "R55 Multi Component Umbrella"). |
| **Test Steps** | 1. Locate the School licence tile for "R55 Multi Component Umbrella".<br>2. Compare its image area with a tile whose product does have a cover image. |
| **Test Data** | No-image licence at capture: R55 Multi Component Umbrella |
| **Expected Result** | 1. The tile renders an empty placeholder block (element with class "no-image-container") in place of the cover image.<br>2. No broken-image icon and no alt-text fallback string is shown.<br>3. The tile's title and date line stay correctly aligned — the layout does not collapse. |
| **Remarks** | The same placeholder is used on rows in the main product list. Verified in the DOM live 2026-08-24; the visual alignment claim is [ASSUMED] — confirm by eye or by a visual snapshot during automation. |
| **Actual Result** | *(blank — filled by the tester)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank — filled by the tester)* |

#### 29. `TST_LIBR_TC_29` — Verify a very long product title wraps inside its School licence tile without overflowing

| Field | Value |
|---|---|
| **S.No.** | 29 |
| **Test Case ID** | TST_LIBR_TC_29 |
| **Title** | Verify a very long product title wraps inside its School licence tile without overflowing |
| **Linked Requirement** | #3 — Verify School licence appear in school licence section |
| **Type** | Edge |
| **Priority** | Low |
| **Preconditions** | Library tab open on a school holding a licence for a product with a long, unbroken title (at capture: "testumbrellabundlevery_longname_tocheck_wrapping_oftext", 55 characters). |
| **Test Steps** | 1. Locate the School licence tile for the long-titled product.<br>2. At desktop width (~1046 px viewport), observe how the title renders inside the tile.<br>3. Narrow the browser to ~400 px and observe it again.<br>4. Check whether the title stays inside its tile, and whether the page gains a horizontal scrollbar. |
| **Test Data** | Long title: testumbrellabundlevery_longname_tocheck_wrapping_oftext (55 chars) |
| **Expected Result** | 1. The title WRAPS onto multiple lines inside the tile — measured 3 lines at ~1046 px and 2 lines at 400 px (line height 24 px).<br>2. The title never overflows its tile: at both widths the title's right edge stays inside the tile's right edge, and the text does not overflow its own box (scrollWidth == clientWidth).<br>3. The title container carries class "card-title word-wrap" with computed word-break: break-word, which is what produces the wrapping.<br>4. The date line stays below the title and remains readable. |
| **Remarks** | VERIFIED LIVE 2026-08-26 (previously [ASSUMED] — the word-wrap class had been read from the DOM but the rendering was never measured). Measurements: desktop viewport 1046 px → tile 327 px, title 229 px, 3 lines; narrow viewport 400 px → tile 351 px, title 261 px, 2 lines; overflowsTileRight false and textOverflowsOwnBox false at BOTH widths. ⚠️ SCOPE: this case covers the SCHOOL LICENCE TILE only. The main product-list rows behave DIFFERENTLY and do overflow at narrow widths — see TST_LIBR_TC_31. Do not generalise this result to the list. ⚠️ TITLE CHURN: this product was RENAMED on the shared school between 2026-08-24 and 2026-08-26 (was "testumbrellabundleverylongnametocheckwrappingoftext", now "testumbrellabundlevery_longname_tocheck_wrapping_oftext"). Treat the literal title as <LONG_TITLE_PRODUCT> and re-read it at run time rather than hard-coding it. |
| **Actual Result** | *(blank — filled by the tester)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank — filled by the tester)* |

#### 30. `TST_LIBR_TC_30` — Verify the School licence section is not rendered at all when the school holds no school licence

| Field | Value |
|---|---|
| **S.No.** | 30 |
| **Test Case ID** | TST_LIBR_TC_30 |
| **Title** | Verify the School licence section is not rendered at all when the school holds no school licence |
| **Linked Requirement** | #3 — Verify School licence appear in school licence section |
| **Type** | Negative |
| **Priority** | Medium |
| **Preconditions** | Logged in as school-admin on Thor; a school that holds ZERO school licences — use Perf Test School 4 · key ACJ-DXL-JKR · org slug org_perf_testschool_4. |
| **Test Steps** | 1. From My school accounts, open the school BY KEY ACJ-DXL-JKR ("Perf Test School 4").<br>2. Click the LIBRARY tab and wait for the product list to render.<br>3. Look at the area between the search bar and the "Sort by:" control, where the School licence section sits on a licensed school.<br>4. Search the page for the text "School licence".<br>5. Confirm the rest of the tab still works — heading count, search box, sort control, product rows. |
| **Test Data** | School key ACJ-DXL-JKR ("Perf Test School 4", org_perf_testschool_4) — 0 school licences, 970 products at capture |
| **Expected Result** | 1. The School licence section is ABSENT ENTIRELY — no container, no tiles, and NO empty-state message replaces it. The product list begins immediately after the "Sort by: Title" control.<br>2. The text "School licence" does not appear anywhere on the page, nor does the description "Here are the materials that students can access…".<br>3. The rest of the tab is unaffected: the heading still reads "Library (N)", the search box, the Search button, the "Sort by: Title" control and the product rows all render normally.<br>4. The product list is NOT empty — the school still lists the full catalogue (970 products at capture), the same count as a school WITH licences. Holding no licence does not reduce the Library list. |
| **Remarks** | VERIFIED LIVE 2026-08-26 on Perf Test School 4 · key ACJ-DXL-JKR · org slug org_perf_testschool_4 — the school was supplied by the user, who also confirmed the intended behaviour. Previously [ASSUMED] and Blocked; now confirmed and RUNNABLE, so the status is Not Run. DOM evidence: 0 elements matching [qid="sa-lbt-sle-cntr"], 0 .school-licence-container, 0 .school-licence-tile, and the phrase "School licence" absent from document.body.innerText. This is one of the rare places where an ABSENCE check is truthful — the section is genuinely not rendered, not merely hidden (contrast admin-shared.md §B2). ⚠️ AUTOMATION: this case needs a DIFFERENT school from every other case in the batch (ACJ-DXL-JKR, not FCN-CHZ-PDA), so it must set its own school context. Side-effect free. |
| **Actual Result** | *(blank — filled by the tester)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank — filled by the tester)* |

#### 31. `TST_LIBR_TC_31` — Verify long product titles in the main Library list stay within the page width on a narrow screen

| Field | Value |
|---|---|
| **S.No.** | 31 |
| **Test Case ID** | TST_LIBR_TC_31 |
| **Title** | Verify long product titles in the main Library list stay within the page width on a narrow screen |
| **Linked Requirement** | #3 — Verify School licence appear in school licence section |
| **Type** | Negative |
| **Priority** | Medium |
| **Preconditions** | Library tab open on FCN-CHZ-PDA with the full product list rendered; browser resizable. |
| **Test Steps** | 1. Open the Library tab at desktop width and confirm there is no horizontal scrollbar.<br>2. Narrow the browser window to ~400 px wide.<br>3. Scroll down the main product list to a row with a long unbroken title, e.g. "blue_umb_auto_update_test_15_feb_1_updated_1".<br>4. Check whether that row's title stays inside the page width.<br>5. Check whether the PAGE has gained a horizontal scrollbar. |
| **Test Data** | Viewport 400 px · rows with long titles, e.g. blue_umb_auto_update_test_15_feb_1_updated_1, blue_umb_multi_book_download_test_30_nov_1 |
| **Expected Result** | EXPECTED: long titles in the product list wrap within the available width — the same behaviour the School licence tile already shows (TST_LIBR_TC_29) — and the page never scrolls horizontally.<br><br>ACTUAL (Thor, 2026-08-26) — DEFECT: the list rows do NOT wrap and push past the page edge. At a 385 px document width the page scrollWidth was 607 px, and 22 elements extended beyond the right edge. The row title "blue_umb_auto_update_test_15_feb_1_updated_1" measured 334 px wide with its right edge at 414 px, against a 385 px document. The whole page therefore scrolls sideways.<br><br>ROOT CAUSE (from computed styles): the School licence tile's title sits in "card-title word-wrap" with word-break: break-word, so it wraps. The list row's title (span.item-text) has word-break: normal and only overflow-wrap: break-word, which does NOT break a long unbroken token in this layout. The two are styled inconsistently. |
| **Remarks** | FOUND 2026-08-26 while verifying TST_LIBR_TC_29 — the licence tile wraps correctly, which is what made the list's behaviour stand out. NOT in the source scenario list; added because it is a real rendering defect on the screen under test. Appended as TC_31 rather than inserted, so no existing ID was renumbered (admin-shared.md / manual-test-standard ordering rule). Grouped under scenario #3 because it was found through the School licence comparison; move it if a responsive-layout requirement is added later. Affects narrow desktop windows and mobile widths. Good VISUAL-REGRESSION candidate. Side-effect free. |
| **Actual Result** | *(blank — filled by the tester)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank — filled by the tester)* |


### Linked Requirement: #2 — Verify See Materials for an umbrella product - All types of components

#### 32. `TST_UMBP_TC_1` — Verify the product materials view opens when See materials is clicked on a Library product row

| Field | Value |
|---|---|
| **S.No.** | 32 |
| **Test Case ID** | TST_UMBP_TC_1 |
| **Title** | Verify the product materials view opens when See materials is clicked on a Library product row |
| **Linked Requirement** | #2 — Verify See Materials for an umbrella product - All types of components |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Library tab open on FCN-CHZ-PDA with the product list rendered. |
| **Test Steps** | 1. Locate the row for the umbrella product "testumbrellabundlevery_longname_tocheck_wrapping_oftext".<br>2. Click the row (or its "See materials" link).<br>3. Wait for the destination page to load.<br>4. Read the URL, the h1 heading and the browser tab title. |
| **Test Data** | Product: testumbrellabundlevery_longname_tocheck_wrapping_oftext (id testumbrellabundle) |
| **Expected Result** | 1. The browser navigates to /dashboard/teacher/org_perf_testschool_1/bundle/testumbrellabundle/view.<br>2. The h1 heading equals the product title exactly.<br>3. The browser tab reads "<product title> \| Cambridge One".<br>4. A "Learning materials" heading is displayed above the component list. |
| **Remarks** | AUTOMATION NOTE: the clickable element is the ROW (div, role="navigation", tabindex="0", aria-label="See <title>"), carrying a POSITIONAL qid "aLibrary-4-<n>". The "See materials" anchor inside it is aria-hidden="true" tabindex="-1" and is not the accessible target. Look the row index up by title on every use; never cache it (admin-shared.md §B3). Page load measured ~6 s on Thor. |
| **Actual Result** | *(blank — filled by the tester)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank — filled by the tester)* |

#### 33. `TST_UMBP_TC_2` — Verify every component of a multi-component umbrella product is listed under Learning materials

| Field | Value |
|---|---|
| **S.No.** | 33 |
| **Test Case ID** | TST_UMBP_TC_2 |
| **Title** | Verify every component of a multi-component umbrella product is listed under Learning materials |
| **Linked Requirement** | #2 — Verify See Materials for an umbrella product - All types of components |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Product materials view open for a multi-component umbrella product. |
| **Test Steps** | 1. Open "See materials" for "testumbrellabundlevery_longname_tocheck_wrapping_oftext".<br>2. Count the component tiles under "Learning materials".<br>3. Record the component TYPE label and component NAME shown on each tile. |
| **Test Data** | Product testumbrellabundle — 15 components at capture |
| **Expected Result** | 1. One tile is rendered per component of the umbrella — 15 at capture.<br>2. Distinct component TYPES are all represented, covering at capture: Test1, Practice Extra (ankur), Project Work updated, Student Resource Bank, Test Generator, Presentation Plus, Downloadable Asset, Resource Bank (Teacher), External Resources, Unit Progress Test, ebook components ("cqa teacher only book", "Student and teacher both paid ebook", "Student paid and teacher free ebook") and Practice Extra.<br>3. No component type is silently omitted from the view. |
| **Remarks** | AUTOMATION TRAP: every component container shares the SAME qid "t-prd-cmp-cntr-1" — the qid is NOT unique per tile and cannot address an individual component. Select structurally by index or by the component's text. Verified live 2026-08-24 (12 identical qids on the R55 product, 15 on this one). |
| **Actual Result** | *(blank — filled by the tester)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank — filled by the tester)* |

#### 34. `TST_UMBP_TC_3` — Verify each component tile shows its component type and its component name

| Field | Value |
|---|---|
| **S.No.** | 34 |
| **Test Case ID** | TST_UMBP_TC_3 |
| **Title** | Verify each component tile shows its component type and its component name |
| **Linked Requirement** | #2 — Verify See Materials for an umbrella product - All types of components |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Product materials view open for a multi-component umbrella product. |
| **Test Steps** | 1. Open "See materials" for "testumbrellabundlevery_longname_tocheck_wrapping_oftext".<br>2. For each component tile, read the first line and the second line. |
| **Test Data** | Product testumbrellabundle |
| **Expected Result** | 1. The first line of each tile is the component TYPE, e.g. "Practice Extra (ankur)", "Student Resource Bank", "Test Generator", "Presentation Plus", "Downloadable Asset".<br>2. The second line is the component's own NAME where it has one, e.g. type "Test Generator" / name "Test Generator - updated", type "Test1" / name "multiumbrellatest1".<br>3. A component with no distinct name shows the type line alone, e.g. "Unit Progress Test" — the tile is still rendered and is not blank. |
| **Remarks** | Captured verbatim live 2026-08-24, e.g. "Practice Extra (ankur)\nsd\nSchool licence active\nStarted: Jul 5, 2024 Expires: Jul 4, 2029". |
| **Actual Result** | *(blank — filled by the tester)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank — filled by the tester)* |

#### 35. `TST_UMBP_TC_4` — Verify the product materials view shows the Back, Add to a class and Activate materials controls

| Field | Value |
|---|---|
| **S.No.** | 35 |
| **Test Case ID** | TST_UMBP_TC_4 |
| **Title** | Verify the product materials view shows the Back, Add to a class and Activate materials controls |
| **Linked Requirement** | #2 — Verify See Materials for an umbrella product - All types of components |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | Product materials view open for an umbrella product. |
| **Test Steps** | 1. Open "See materials" for any umbrella product.<br>2. Inspect the header area above the component list. |
| **Test Data** | Products: testumbrellabundle · r55multicomponent |
| **Expected Result** | 1. A "Back" control is present at the top of the page.<br>2. The product title is displayed as the h1.<br>3. An "Add to a class" control is present.<br>4. A "Learning materials" heading and an "Activate materials" control are present. |
| **Remarks** | See TST_UMBP_TC_10 — the "Back" control is present but does NOT return to the Library tab. "Activate materials" is deliberately NOT exercised by this batch (see TST_UMBP_TC_7 Remarks). |
| **Actual Result** | *(blank — filled by the tester)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank — filled by the tester)* |

#### 36. `TST_UMBP_TC_5` — Verify a class-selection dialog listing the school's classes opens when Add to a class is clicked

| Field | Value |
|---|---|
| **S.No.** | 36 |
| **Test Case ID** | TST_UMBP_TC_5 |
| **Title** | Verify a class-selection dialog listing the school's classes opens when Add to a class is clicked |
| **Linked Requirement** | #2 — Verify See Materials for an umbrella product - All types of components |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | Product materials view open for an umbrella product, on a school that has classes. |
| **Test Steps** | 1. Open "See materials" for "R55 Multi Component Umbrella".<br>2. Click "Add to a class".<br>3. Read the dialog heading, its input and its buttons. DO NOT complete the action.<br>4. Close the dialog without adding. |
| **Test Data** | Product: r55multicomponent · school FCN-CHZ-PDA |
| **Expected Result** | 1. A dialog (id "addMaterialToClassModal") opens.<br>2. Its heading reads "Choose a class to add <product title>" — e.g. "Choose a class to add R55 Multi Component Umbrella".<br>3. It contains a text input with placeholder "Search classes" and a list of the school's classes.<br>4. The "Add to Class" button is DISABLED until a class is selected. |
| **Remarks** | SIDE-EFFECT FREE ONLY IF the action is not completed — adding material to a class mutates the shared school, so this case stops at the dialog. TWO OBSERVATIONS: (a) each class row renders as "[<class name>] [<class key>]" with LITERAL square brackets in the text, e.g. "[mn] [acPZ-EQTo]" (raw markup: <button class="dropdown-item work-break class-list">[mn] [acPZ-EQTo]</button>). CONFIRMED AS-DESIGNED [user, 2026-08-26] — this is the intended display format, NOT leftover template markup. Recorded for reference so it is not re-flagged as a defect; expected results may assert it verbatim; (b) only 5 classes were VISIBLE although the school shows 106, while 2330 class options sit pre-rendered and hidden behind the dialog — so it is NOT that only 5 exist. [ASSUMED] the visible list is paged/lazily loaded, or filtered (e.g. to the admin's own classes), or intended to be reached via the "Search classes" box rather than scrolled. DECISION [user, 2026-08-26]: reason UNKNOWN and not chased — scrolling and searching the list were avoided because the next click in that dialog adds material to a real class on the shared school, irreversibly. ⚠️ NEVER ASSERT A CLASS COUNT in this dialog, and do not treat "only 5 shown" as a defect. Assert the dialog's structure instead: heading, Search classes input, a non-empty class list, and Add to Class disabled until a selection is made. AUTOMATION TRAP: 2330 pre-rendered class options, ALL sharing the single qid "t-prd-umb-dd-1" and all hidden until the dialog opens — a presence check is a guaranteed false green (admin-shared.md §B2). |
| **Actual Result** | *(blank — filled by the tester)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank — filled by the tester)* |

#### 37. `TST_UMBP_TC_6` — Verify a component covered by an active school licence shows its licence status with start and expiry dates

| Field | Value |
|---|---|
| **S.No.** | 37 |
| **Test Case ID** | TST_UMBP_TC_6 |
| **Title** | Verify a component covered by an active school licence shows its licence status with start and expiry dates |
| **Linked Requirement** | #2 — Verify See Materials for an umbrella product - All types of components |
| **Type** | Edge |
| **Priority** | Medium |
| **Preconditions** | Product materials view open for a product with at least one school-licensed component. |
| **Test Steps** | 1. Open "See materials" for "testumbrellabundlevery_longname_tocheck_wrapping_oftext".<br>2. Locate the components "Practice Extra (ankur)", "Student Resource Bank" and "Downloadable Asset".<br>3. Read the status line and the date line on each. |
| **Test Data** | Product testumbrellabundle |
| **Expected Result** | 1. Each such component shows the status text VERBATIM "School licence active".<br>2. Below it a date line reads "Started: <Mon D, YYYY> Expires: <Mon D, YYYY>" — e.g. "Started: Jul 5, 2024 Expires: Jul 4, 2029".<br>3. No "Activate" control is offered for a component already covered by an active licence. |
| **Remarks** | Copy captured live 2026-08-24. NOTE the different date wording used elsewhere: components on the R55 product show a bare "Expires" + date on its own line with no "Started:", and School licence TILES use "Expires <date>" with no colon (TST_LIBR_TC_24). Three date formats across one feature — worth raising as a consistency issue. |
| **Actual Result** | *(blank — filled by the tester)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank — filled by the tester)* |

#### 38. `TST_UMBP_TC_7` — Verify an unactivated component offers Activate and an expired component offers Re-activate

| Field | Value |
|---|---|
| **S.No.** | 38 |
| **Test Case ID** | TST_UMBP_TC_7 |
| **Title** | Verify an unactivated component offers Activate and an expired component offers Re-activate |
| **Linked Requirement** | #2 — Verify See Materials for an umbrella product - All types of components |
| **Type** | Edge |
| **Priority** | Medium |
| **Preconditions** | Product materials view open for a product containing both an unactivated and an expired component. |
| **Test Steps** | 1. Open "See materials" for "testumbrellabundlevery_longname_tocheck_wrapping_oftext".<br>2. Locate the component "Test1" / "multiumbrellatest1".<br>3. Locate the components "Test Generator" / "Test Generator - updated" and "Presentation Plus".<br>4. Record the control and status text shown on each. DO NOT click any activation control. |
| **Test Data** | Product testumbrellabundle |
| **Expected Result** | 1. The unactivated component "Test1" shows an "Activate" control and no licence dates.<br>2. The expired components show "Re-activate" together with the status "Expired" and the expiry date — e.g. "Test Generator \| Test Generator - updated \| Re-activate \| Expired \| Jul 12, 2022" and "Presentation Plus \| Presentation Plus \| Re-activate \| Expired \| Jul 5, 2022".<br>3. "Activate" and "Re-activate" are visually distinct states, not the same label. |
| **Remarks** | DELIBERATELY READ-ONLY. Activation changes the school's entitlement for every teacher and student and cannot be undone on the shared school FCN-CHZ-PDA (admin-shared.md §A5), so this case asserts the CONTROLS and STATUS TEXT only. Exercising activation needs a dedicated school and is out of scope for this batch. |
| **Actual Result** | *(blank — filled by the tester)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank — filled by the tester)* |

#### 39. `TST_UMBP_TC_8` — Verify the activation summary reports how many of the product's components are activated

| Field | Value |
|---|---|
| **S.No.** | 39 |
| **Test Case ID** | TST_UMBP_TC_8 |
| **Title** | Verify the activation summary reports how many of the product's components are activated |
| **Linked Requirement** | #2 — Verify See Materials for an umbrella product - All types of components |
| **Type** | Edge |
| **Priority** | Low |
| **Preconditions** | Product materials view open for an umbrella product that reports an activation summary. |
| **Test Steps** | 1. Open "See materials" for "R55 Multi Component Umbrella".<br>2. Read the summary line shown near "Activate materials".<br>3. Count the components on the page that show an activated state. |
| **Test Data** | Product r55multicomponent — summary read "3 out of 4 components activated" at capture |
| **Expected Result** | 1. A summary line reads "<N> out of <M> components activated" — e.g. "3 out of 4 components activated".<br>2. The numbers are consistent with the component states shown on the tiles below. |
| **Remarks** | INCONSISTENCY FOUND 2026-08-24, REVIEWED 2026-08-26: the summary is present on "R55 Multi Component Umbrella" but ABSENT on "testumbrellabundlevery_longname_tocheck_wrapping_oftext" — and not because everything there is active: that product has 15 components, several showing Activate or Re-activate (Test1 → Activate; Test Generator → Re-activate/Expired Jul 12 2022; Presentation Plus → Re-activate/Expired Jul 5 2022). So there is plenty to count, yet no line. The RULE governing when the line appears is [ASSUMED] — candidates are product type, component type, or a genuine defect; it cannot be told apart from outside the app. DECISION [user, 2026-08-26]: rule UNKNOWN and not chased for now. This case therefore asserts the summary ONLY on r55multicomponent, where it is verified. ⚠️ DO NOT write an assertion that the line is always present, and do not treat its absence on another product as a defect until the rule is known — that would be a false failure. If the rule is later established, widen this case then. |
| **Actual Result** | *(blank — filled by the tester)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank — filled by the tester)* |

#### 40. `TST_UMBP_TC_9` — Verify the component list renders correctly for products with differing component counts

| Field | Value |
|---|---|
| **S.No.** | 40 |
| **Test Case ID** | TST_UMBP_TC_9 |
| **Title** | Verify the component list renders correctly for products with differing component counts |
| **Linked Requirement** | #2 — Verify See Materials for an umbrella product - All types of components |
| **Type** | Edge |
| **Priority** | Low |
| **Preconditions** | Library tab open; two umbrella products of different sizes available. |
| **Test Steps** | 1. Open "See materials" for "R55 Multi Component Umbrella" and count the component tiles.<br>2. Return to the Library tab (re-select the school — see TST_UMBP_TC_10).<br>3. Open "See materials" for "testumbrellabundlevery_longname_tocheck_wrapping_oftext" and count the component tiles.<br>4. Compare each page's tile count with the components the product actually holds. |
| **Test Data** | r55multicomponent — 12 components at capture · testumbrellabundle — 15 components at capture |
| **Expected Result** | 1. Each product renders exactly as many component tiles as it holds — 12 and 15 respectively at capture.<br>2. Neither list is truncated, and there is no "Load more" control on this page — all components render at once.<br>3. Duplicate component TYPES within one product (e.g. two "Presentation Plus" entries on testumbrellabundle) each get their own tile. |
| **Remarks** | Counts are data-dependent — assert "tiles = components the product holds", not 12 or 15. [ASSUMED] — SINGLE-COMPONENT RENDERING NOT VERIFIED. No product with exactly one component was located at design time: the library holds 970 products and the list does not expose component counts, so finding one means opening products individually. DECISION [user, 2026-08-26]: accepted as a known, LOW-RISK gap — do not spend design time hunting for one. The tester or Phase 1 automator CONFIRMS IT WHEN A SINGLE-COMPONENT PRODUCT IS ENCOUNTERED, and updates this case then. The risk if the assumption is wrong: an app that special-cases "only one" (e.g. skipping the list and opening the item directly, or using a different layout) would fail this case — which is exactly what the check would catch. |
| **Actual Result** | *(blank — filled by the tester)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank — filled by the tester)* |

#### 41. `TST_UMBP_TC_10` — Verify Back on the product materials view returns the admin to the Library tab

| Field | Value |
|---|---|
| **S.No.** | 41 |
| **Test Case ID** | TST_UMBP_TC_10 |
| **Title** | Verify Back on the product materials view returns the admin to the Library tab |
| **Linked Requirement** | #2 — Verify See Materials for an umbrella product - All types of components |
| **Type** | Negative |
| **Priority** | High |
| **Preconditions** | Product materials view open, reached from the Library tab of school FCN-CHZ-PDA. |
| **Test Steps** | 1. From the Library tab, click "See materials" on any product.<br>2. Confirm the product materials view has loaded.<br>3. Click "Back" at the top of the page.<br>4. Wait for navigation to settle and read the URL and the page heading. |
| **Test Data** | Products used to reproduce: sj11042501 · r55multicomponent |
| **Expected Result** | EXPECTED: the admin returns to the Library tab of the same school — /admin/admin/org_perf_testschool_1/library — with the school context intact.<br><br>ACTUAL (Thor, 2026-08-24) — DEFECT: "Back" requests "/admin/admin//library" — the org slug is MISSING and the path contains a doubled slash. That route does not resolve, and the app redirects to /admin/admin/dashboard ("My school accounts"). The school context is LOST and the admin must re-select the school and re-open the Library tab to continue. |
| **Remarks** | HIGH IMPACT — it breaks the browse loop: every product an admin inspects costs two extra clicks to get back. Reproduced twice on 2026-08-24, once via a scripted click and once via a real user click, on two different products. AUTOMATION NOTE: a suite that opens a product MUST re-navigate via the school card afterwards; it cannot rely on Back (admin-shared.md §A1 — deep-linking the class route fails without school context). |
| **Actual Result** | *(blank — filled by the tester)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank — filled by the tester)* |


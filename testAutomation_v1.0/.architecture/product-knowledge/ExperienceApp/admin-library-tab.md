# Admin App — Library tab & product materials view

> **Feature-area file (ADR-020).** Read [`admin-shared.md`](admin-shared.md) first — Part A for
> manual test design, Part A + Part B for automation.
>
> **Living document.** Append, never overwrite. Mark anything not confirmed live `[ASSUMED]`.
> Date significant updates `[YYYY-MM-DD]`.
>
> **Seeded [2026-08-24]** from the live grounding pass for the Library-tab manual batch
> (`test/Manual/C1App/AdminApp-Library/`, 40 TCs). Captured on Thor, school `FCN-CHZ-PDA`
> "3 July Test School 1", 970 products, 3 school licences.
>
> **Extended [2026-08-26]** with a second school — **`ACJ-DXL-JKR` "Perf Test School 4"**
> (`org_perf_testschool_4`), which holds **zero** school licences. It resolved the zero-licence
> `[ASSUMED]` and revealed that the Library list is catalogue-wide (§6).

| Screen | Manual module | Automation module | Future page object |
|---|---|---|---|
| Library tab — list, search, sort, School licence section | `LIBR` | `LIBR` | `schoolLibrary` |
| Product materials view (reached by "See materials") | `UMBP` | `UMBP` | `umbrellaProduct` |

---

## 1. Routes and entry path

```
school card (BY KEY) → Classes tab
   └─ left nav: Classes · Students · Staff · LIBRARY · Reports        (Library = qid aDetail-5)

LIBRARY tab                /admin/admin/org_<slug>/library
  ├─ Search by title  (qid aLibrary-1, name="search-text")  +  Search  (qid aLibrary-2)
  ├─ School licence section                     (qid sa-lbt-sle-cntr)
  │     └─ tile per licence                     (qid sa-lbt-sle-prdtcrd-<n>)
  ├─ Sort by: Title                             (qid aLibrary-3)
  └─ product row — THE ROW IS THE CONTROL       (qid aLibrary-4-<n>)
        └─ "See materials" anchor  (a.see-detail, aria-hidden="true" tabindex="-1")

product materials view     /dashboard/teacher/org_<slug>/bundle/<productId>/view
  ├─ Back                (qid t-prd-umb-link-1)   ⚠ see §4
  ├─ <title> h1          (qid t-prd-umb-link-2)
  ├─ Add to a class      (qid t-prd-umb-btn-1)  → dialog #addMaterialToClassModal
  ├─ Activate materials  (qid t-prd-link-1)
  └─ component tile × N  (qid t-prd-cmp-cntr-1 — SHARED by every tile, see §5)
```

Both the School licence tiles **and** the product rows navigate to the same
`/dashboard/teacher/.../bundle/<id>/view` route — note it leaves the admin app for the **teacher**
dashboard. `[2026-08-24]`

> Direct navigation to `/admin/admin/org_<slug>/library` **worked** in an authenticated session where
> the school context had already been set by clicking the school card earlier. This is not a
> contradiction of `admin-shared.md` §A1 — the context, not the URL, is what the app needs. Do not
> rely on it from a cold session. `[2026-08-24]`

## 2. Product list

- **The whole list renders at once.** 970 products, **no "Load more", no lazy loading** — a sharp
  contrast with the Classes tab (page size 20) and the Students/Staff tabs. `[2026-08-24]`
- Full render measured **~5.1 s** for 970 products on Thor. Do not inherit this number (§B8).
- `Library (N)` in the `h2` equals the count on the left-nav `LIBRARY` tab.
- Each row shows the product title (`span.item-text`) and a `See materials` link.

## 3. Sort, search and persistence — where the Library tab DIFFERS from the Classes tab

**This table exists because inheriting the Classes-tab expectations here produces wrong tests.**

| Behaviour | Classes tab | **Library tab** |
|---|---|---|
| Sort collation | **code point** (`(` < `A` < `c`) | **case-insensitive** — `Y Test Product` sorts *before* `yaminitestproduct1`, and `Visible…` before `vm_…` |
| Sort persistence | not persisted | **not persisted** (same) |
| Search persistence | **persists server-side**, survives reload + re-login | **NOT persisted** — cleared by reload |
| Search trigger | submit-driven | **submit-driven** (same) — typing alone does nothing |
| Lazy loading | page size 20, "Load more" removed when exhausted | **none — everything renders** |

- **Sort is a two-state toggle** on one control (`Title`). Clicking reverses the list exactly;
  the count never changes; it is client-side with no refetch.
- **The sort control gives NO indication of direction.** Re-verified 2026-08-26 by comparing the
  full `outerHTML` before and after a click — **byte-for-byte identical**:
  `<a qid="aLibrary-3" href="javascript:void(0);" class="list-info ml-2 sort-by-title-btn active">Title</a>`
  Same label, same class (`active` is present in **both** states — it means "this is the sort in
  use", *not* a direction), **zero child elements** so there is no icon to rotate, and `aria-sort`,
  `aria-label` and `title` all absent. The list *does* flip, so sorting works — only the indicator
  is missing. **Assert list ORDER, never the control.** The missing `aria-sort` is also an
  accessibility gap. `[recorded as a remark, not raised — user decision 2026-08-26]`
- **The sort control is genuinely REMOVED from the DOM in the no-results state** — one of the rare
  places on an admin screen where a presence check is truthful (`admin-shared.md` §B2). `[2026-08-24]`
- **Search settles ~1.0 s** (measured 1032 ms).
- **Search is FUZZY, not a substring match — CONFIRMED INTENDED by the product team `[2026-08-26]`.**
  `vm_automation` returns 22 results of which only **2** contain the term; the rest are close matches
  (`cqaautomationbundle1`, `Bulk Activation - Test Umbrella 1`, `Visible prior to activation other comps`).
  Even an **exact full title** returns a tail — `vm_automation_book101` returned **10**, not 1.
  **This is not a defect. Do not re-raise it.**
- **Multi-word terms match either word (OR), so adding a word BROADENS the search — also CONFIRMED
  INTENDED `[2026-08-26]`**: `vm_automation` → 22, `vm_automation testing` → 29.

- **Whitespace-only terms are not trimmed** — three spaces return 0 results and the banner renders
  the raw spaces. An empty term, by contrast, is correctly treated as "no search". `[2026-08-24]`
- **The `(N)` count is dropped while a search is active** — `Library (970)` becomes
  `Library — Showing search results for <term>. Clear`, with no tally at all. The user cannot see
  how many matched without counting rows. **Automation: never assert a heading count during a
  search — there is none.** Assert the banner text, and count rendered rows if a number is needed.
  `[recorded as a remark, not raised — user decision 2026-08-26]`
- **Search does not touch the School licence section**, which always shows the full licence set.

> ### 🔑 The ranking rule — this is the assertion to automate
>
> **Substring matches ALWAYS rank above the fuzzy tail**, in their own order, and the exact typed
> title ranks **1**. Verified across every term tried on 2026-08-26 (`vm_automation`,
> `vm_automation testing`, `vm_automation_testing_108`).
>
> ✅ assert *"all substring matches are present and occupy the leading positions"*
> ❌ never assert *"every result contains the term"* — fails against the live product
> ❌ never assert a result **count** — the fuzzy tail is data-dependent
>
> ⚠️ **Sorting overrides the ranking.** Clicking *Sort by: Title* re-orders the whole result set
> alphabetically and discards the relevance order. Assert ranking *before* sorting.

> ### Test data policy `[user decision, 2026-08-26]`
>
> Search cases use **automation-owned products** — `vm_automation_book101`,
> `vm_automation_testing_108` — never another team's. `FCN-CHZ-PDA` is shared and actively mutated
> (`admin-shared.md` §A5), so other teams' products can be renamed or removed under us. The earlier
> `Compass*` terms were replaced throughout for this reason.

## 4. ⚠️ "Back" on the product materials view loses the school context — DEFECT

`Back` (`qid t-prd-umb-link-1`) requests **`/admin/admin//library`** — the org slug is **missing**
and the path carries a **doubled slash**. That route does not resolve, so the app redirects to
`/admin/admin/dashboard` (**My school accounts**). The school context is gone.

**Reproduced twice on 2026-08-24**, on two different products (`sj11042501`, `r55multicomponent`),
via both a scripted click and a real user click.

**Consequence for automation:** a suite that opens a product **must re-navigate via the school card**
afterwards. It cannot rely on `Back`, and it cannot recover by deep-linking the class route
(`admin-shared.md` §A1). Recorded as `TST_UMBP_TC_10`.

## 5. Product materials view — components

One tile per component; **all components render at once, there is no "Load more" here either.**
Counts seen: 12 (`r55multicomponent`), 15 (`testumbrellabundle`).

**Component states and their verbatim copy** `[captured 2026-08-24]`:

| State | Copy on the tile |
|---|---|
| Covered by an active school licence | `School licence active` + `Started: Jul 5, 2024 Expires: Jul 4, 2029` |
| Expired | `Re-activate` + `Expired` + `Jul 12, 2022` |
| Not yet activated | `Activate` |
| No licence information | type + name only, no status line |

**Component types seen across two products:** Project Work · Project Work updated · Practice Extra ·
Practice Extra (ankur) · Practice Extra - Group Enabled · Test · Test1 · Test Generator ·
Presentation Plus · Downloadable Asset · Speaking Companion · Speaking Companion New Version ·
Teacher Resource Bank · Student Resource Bank · Resource Bank (Teacher) · External Resources ·
Unit Progress Test · several ebook variants.

- **The activation summary `N out of M components activated` is NOT always present** — shown on
  `r55multicomponent`, **absent** on `testumbrellabundle` despite its 15 components including
  several unactivated ones (`Test1` → Activate; `Test Generator` and `Presentation Plus` →
  Re-activate/Expired). So it is *not* "hidden because everything is active". The rule is
  `[ASSUMED]` — product type, component type, or a defect; indistinguishable from outside.
  `[reviewed 2026-08-26, rule still unknown — not chased, user decision]`
  > ⚠️ **Never assert the line is always present, and never treat its absence as a defect** until
  > the rule is known. `TST_UMBP_TC_8` asserts it only on `r55multicomponent`.
- **Three different date formats across one feature:** `Expires Jul 5, 2029` (licence tile),
  `Started: … Expires: …` (licensed component), bare `Expires` + date (other components).

**Add to a class** opens `#addMaterialToClassModal`, heading
`Choose a class to add <product title>`, with a `Search classes` input (`t-atoc-inpt-1`) and an
`Add to Class` button (`t-atoc-btn-3`) that is **natively disabled** until a class is selected.
Class rows render as **`[<class name>] [<class key>]` with literal square brackets** — e.g.
`[mn] [acPZ-EQTo]`; raw markup
`<button class="dropdown-item work-break class-list">[mn] [acPZ-EQTo]</button>`.
**CONFIRMED AS-DESIGNED** `[user, 2026-08-26]` — the intended display format, *not* leftover
template markup. Recorded so it is not re-flagged as a defect; assertions may quote it verbatim. Only **5** classes were VISIBLE although
the school shows **106** — while **2330** options sit pre-rendered and hidden, so it is not that
only 5 exist. Why is `[ASSUMED]`: paged/lazy loading, filtering to the admin's own classes, or a
list meant to be reached through the `Search classes` box rather than scrolled.
`[reviewed 2026-08-26 — reason still unknown, not chased, user decision]`
> ⚠️ **Never assert a class count in this dialog**, and do not treat "only 5 shown" as a defect.
> Assert structure instead: heading, `Search classes` input, a non-empty list, and `Add to Class`
> disabled until a class is selected.

> **Completing this action mutates the shared school.** The manual batch stops at the dialog.

## 6. School licence section

Rendered above the product list, between the search bar and the sort control.

- Heading `School licence`; description
  `Here are the materials that students can access when added to a class and all teachers can access in their library`.
- One tile per licence. In date → `Expires <Mon D, YYYY>`, **no icon**. Expired → `Expired <Mon D, YYYY>`
  **plus `error.svg`** (`img.school-licence-icon`, `alt=""` — its meaning is not exposed to screen
  readers). **Expired licences are still listed, not hidden.** `[2026-08-24]`
- Products with no cover image render an empty `div.no-image-container` placeholder.
- **Long titles WRAP correctly in the licence tile** — `card-title word-wrap`, computed
  `word-break: break-word`. Measured 2026-08-26 on a 55-char title: 3 lines at ~1046 px, 2 lines at
  400 px, never overflowing the tile at either width. `[VERIFIED]`

> ### ⚠️ The main product-LIST rows do NOT wrap — layout defect `[2026-08-26]`
>
> `span.item-text` has `word-break: normal` (only `overflow-wrap: break-word`), so a long unbroken
> title does not break. At a **385 px** document width the page `scrollWidth` was **607 px** and
> **22 elements** overflowed the right edge — the whole page scrolls sideways.
> Example: `blue_umb_auto_update_test_15_feb_1_updated_1` measured 334 px wide, right edge 414 px.
>
> **The licence tile and the list row are styled inconsistently** — the tile wraps, the row does not.
> Recorded as `TST_LIBR_TC_31`. Good visual-regression candidate.

> ### ⚠️ Product titles on the shared school CHANGE `[2026-08-26]`
>
> `testumbrellabundleverylongnametocheckwrappingoftext` was renamed to
> `testumbrellabundlevery_longname_tocheck_wrapping_oftext` **within two days**. The product id in
> the URL (`testumbrellabundle`) was unaffected. **Never hard-code a third-party product title** —
> treat it as `<PLACEHOLDER>` and re-read it at run time, or use an automation-owned product.
- **Licensed products ALSO appear in the main product list** — the section is a highlight, not a
  separate inventory, so they are not double-counted in `Library (N)`. `[2026-08-24]`

> ### ⚠️ The product list is CATALOGUE-WIDE, not licence-driven `[2026-08-26]`
>
> `ACJ-DXL-JKR` holds **zero** licences and lists **970** products. `FCN-CHZ-PDA` holds **three**
> and lists the **same 970**. Licensing changes **only** whether the School licence box renders —
> it does not add to, or subtract from, the Library list.
>
> So *"a licensed product appears in the list"* proves nothing about licensing: the list would
> contain it either way. Do not build an assertion on that inference.
- **A school holding ZERO school licences: the section is ABSENT ENTIRELY.** `[VERIFIED 2026-08-26]`
  On **`ACJ-DXL-JKR` "Perf Test School 4"** (`org_perf_testschool_4`) there is **no container, no
  tiles and no empty-state message** — the product list begins straight after `Sort by: Title`, and
  the string `School licence` does not appear in `document.body.innerText` at all.
  DOM: `[qid="sa-lbt-sle-cntr"]` → 0, `.school-licence-container` → 0, `.school-licence-tile` → 0.
  **One of the rare places where an ABSENCE check is truthful** — genuinely not rendered, not merely
  hidden (contrast `admin-shared.md` §B2). Resolves the former `[ASSUMED]`; `TST_LIBR_TC_30` is
  unblocked.

## 7. Fields

| Field | `maxlength` | Notes |
|---|---|---|
| Library `Search by title` | **none** | `name="search-text"` |
| Dialog `Search classes` | **none** | |

> **Neither screen has a capped field**, so there is no `maxlength` boundary case to write here.
> Stated explicitly rather than left as a silent gap (`admin-shared.md` §A3).

## 8. Automation traps (Part-B material for this screen)

1. **`t-prd-cmp-cntr-1` is shared by EVERY component tile** — 12 identical qids on one product,
   15 on another. The qid **cannot address an individual component**; select structurally or by text.
2. **`t-prd-umb-dd-1` is shared by 2330 pre-rendered class options**, all hidden until the
   Add-to-a-class dialog opens. A presence/count check is a **guaranteed false green**
   (`admin-shared.md` §B2).
3. **`aLibrary-4-<n>` product rows are positional** — look the row up **by title on every use**
   (`admin-shared.md` §B3).
4. **The Clear link is `aClass-99`** — a **Classes-tab** qid living on the Library tab. It is not in
   the `aLibrary-*` family; a selector sweep scoped to `aLibrary-*` will miss it.
5. **The sort control cannot distinguish its two states** — assert list order (§3).
6. **The row, not the "See materials" anchor, is the accessible control.** The row is
   `div[role="navigation"][tabindex="0"]` with `aria-label="See <title>"`; the anchor inside is
   `aria-hidden="true" tabindex="-1"`.
7. **`Back` breaks the school context** (§4) — re-navigate via the school card.

## Sources

- Live grounding session 2026-08-24, Thor, `FCN-CHZ-PDA`, via Playwright MCP.
- `test/Manual/C1App/AdminApp-Library/AdminApp_Library_tab_test_cases.md` (40 TCs, `LIBR` + `UMBP`).
- Follow-up session 2026-08-26 — product team confirmed the two search behaviours as intended; the
  ranking rule was established and the search test data switched to automation-owned products.

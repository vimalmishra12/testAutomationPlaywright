# Admin App — Manage grading categories (`GCAT`)

> Module **`GCAT`** · page object `manageGradingCategories.page.js` · suite
> `npm run P1AdminGradingCategories_Thor`.
>
> **Read [`admin-shared.md`](admin-shared.md) first.** The pre-rendered-modal doctrine, positional
> ids and Angular typing rules all apply here and are not repeated.
>
> Living document — append, never overwrite. `[Seeded 2026-08-21]` from
> `walkthrough_adminGradingCategories.test.js_2026-08-18_12h-04m.md` (sessions 1–2) and the page
> object's own trap header. All facts captured live on **thor / `FCN-CHZ-PDA`**.

---

## Entry path and URLs

**Class page or Classes tab → School settings ▾ (`#changeClassKeyActionsLink`) → Manage grading
categories (`a[qid='adEdit-7']`)** → `/manage-grading-categories`.

Details page: `/manage-grading-categories/<id>/classes`.

> **This screen is the first admin module that creates and deletes real data.** Everything on the
> Classes tab before it was read-only.

## The two views, and why page scoping matters

Both views render an **unclassed `<h1>` and exactly one `h2.heading-2`**, so a bare `h1` selector
silently matches the wrong page. They expose mutually exclusive Angular component tags:

| View | Component tag | URL |
|---|---|---|
| Manage (list) | **`manage-grading-category`** — note the **SINGULAR** "category" | `/manage-grading-categories` |
| Details | `grading-category-classes` | `/manage-grading-categories/<id>/classes` |

> The singular tag was **guessed wrong first** — `manage-grading-categories` returns zero elements.
> Verify against the live DOM rather than pluralising the page title.

## Key elements

| Element | Selector |
|---|---|
| Create | `a[qid='manageGradingCategories-2']` |
| Back to Classes | `a[qid='manageGradingCategories-1']` |
| Row container | `manage-grading-category div.list` |
| Category name | `p.category-title` |
| Row actions toggle | `button[qid='gradingCategoryActionLink-{{n}}']` |
| Row → See details | `a[qid='gradingCategory-option-1-{{n}}']` |
| Row → Remove | `a[qid='gradingCategory-option-2-{{n}}']` |
| Create modal | `div.modal-content:has(#gradingCategoryNameInput)` |
| Name input | `#gradingCategoryNameInput` — `maxlength="50"` |
| Save / Cancel / X | `button[qid='manageGradingCategories-6']` / `a[…-5]` / `button[…-4]` |
| Remove modal | `div.modal-content:has(a[qid='manageGradingCategories-13'])` |
| Remove confirm / cancel | `a[qid='manageGradingCategories-13']` / `a[…-12]` |
| Success banner | `.message-banner-panel-wrapper` (+ ` p` for its text) |
| Details back link | `a[qid='gradingCategoryClass-1']` |

> `div.list` is the per-row container. **`div.row` wraps ALL rows** and does not isolate one.

---

## Traps

**1. FOUR `.modal-content` elements exist in the DOM at all times** — create, max-limit, generic
error, remove-confirmation. Only one is ever visible, so **any assertion on modal presence is a
guaranteed false green**. Every modal selector is `:has(...)`-scoped to one specific modal and
every check goes through `isDisplayed` / `waitForDisplayed`.

**2. Row action `qid`s are POSITIONAL** (`gradingCategoryActionLink-0`, `-1`, …), not keyed by
name. Look a category's row index up **by name on every use** — never cache it.

**3. The list is sorted alphabetically**, so a newly created category can land at **any** index.
Position is never stable.

**4. `.message-banner-panel-wrapper` is the ONE element here genuinely removed from the DOM** when
not showing (polled 20 s, never present). For the banner only, presence is a truthful signal.

**5. Row dropdown ITEMS are in the DOM for every row at all times**, menu open or closed. Verified
live: with 3 categories listed and no menu open, **3 "See details" links exist and 0 are visible**.
Opening one row's menu makes only *that* row's items visible (its `.dropdown-menu` gains `.show`).
Counting them is the same false green as trap 1 — `TST_GCAT_TC_1` opens the menu and checks each
item with `isDisplayed`.

**6. The details page cannot be recovered from by the normal route.** It does **not** contain the
Classes-tab School settings toggle, so `navigate_fromClassesTab()` cannot work from there. This
mattered immediately: ADR-019 requires `TST_GCAT_TC_6` to **end** on the details page so its
screenshot proves the page opened — which would have broken the very next `BeforeEach`.
`reset_state()` now steps back first via the details page's own Back link
(`a[qid='gradingCategoryClass-1']`, verified to return to Manage).

**7. An open row menu is absolutely positioned over the list.** `TST_GCAT_TC_1` deliberately ends
with a menu open (that *is* its evidence). Measured live, it does not overlap Create — but it can
sit over another row's toggle, which the sweep clicks. `Escape` closes it (menu loses `.show`,
toggle returns to `aria-expanded="false"`) and `reset_state` now does that too. **Caught by
reasoning about blast radius, not by a failure.**

---

## Measured live 2026-08-18 — never re-guess these

| Action | Banner appears | List updates | Banner lifetime |
|---|---|---|---|
| Create | 1.39 s | 1.39 s | ~15.0 s |
| Remove | 2.17 s | 2.17 s | ~15.1 s |

The banner and the list update in the **same tick** — neither leads the other. `SETTLE_TIMEOUT` is
15 s, roughly 7× the measured worst case.

> **Stale-banner trap.** Each message lingers ~15 s, so a TC that creates a category and then
> removes it is **still showing the "successfully created" banner** when the removal completes —
> `waitForDisplayed(banner)` returns instantly against the *previous* message.
> `waitForBannerText(expected)` waits for the banner to **say** the expected copy. Same
> wrong-signal family as the Classes tab: wait on the content that changed, never the container.

## Product copy (asserted verbatim)

| Where | Text |
|---|---|
| Manage `h1` | `Manage grading categories` |
| Manage description | `Create (or remove) grading categories for your school. Categories can then be applied to a class on the class grade settings page` |
| Manage list `h2` | `Grading categories` |
| Create success banner | `Grading category successfully created` |
| Remove success banner | `Grading category successfully removed` |
| Remove confirmation | *"…will not affect classes currently using it…"* → **No, go back** / **Yes, remove** |
| Details `h1` / tab title | the category name |
| Details `h2` (new category) | `Active classes (0)` |
| Details empty state | `The category has not been added to any active classes` |

## Product behaviour (for manual test design)

- Name field `maxlength="50"`; Save is disabled while the name is empty.
- **The details page counts ACTIVE classes only** — and this is why every category on this school
  read `Active classes (0)` for weeks. Not because no category had ever been applied, but because
  every class it had been applied to was since **soft-deleted**. *The evidence erases itself.*
  The grading **scale** details page behaves differently — see `admin-grading-scales.md`.
- The details page's **search bar and sort control render only when the category has ≥1 active
  class**, which is why the page object written on 2026-08-18 has no model for them.
- The category-details row's only control is a dedicated **"Class grade settings"** link — the
  class name is plain text. The manual case's step *"click a listed class"* was **wrong** and has
  been corrected.

## Two bugs hit and fixed — both automation-side, neither a product defect

**1. Dropped keystrokes.** `pressSequentially` types faster than the form's async "does this name
already exist" check can consume, and characters are lost — **10 of 28** on one run, 1 of 28 on the
next. The missing characters never arrive (a 5 s poll never converged). The app stored exactly what
it was given, so this is **not** a product bug. Fixed with a top-up loop in `set_categoryName`:
read the field back, append only what is missing, repeat. Suite time also dropped ~2 min → ~35 s.

> The read-back was added **first**, purely to tell an automation race apart from a product defect,
> *before* any fix was chosen (Invariant 14).
>
> `TST_GCAT_TC_5` **passed on the first run while typing a corrupted name**, because nothing
> verified what landed in the field. The read-back turned that false green into a real failure —
> 1/5 was a worse result than the 0/5 that replaced it.

**2. Stale banner** — see the measured-timings note above.

## Housekeeping design (ADR-019)

`TST_GCAT_TC_10` sweeps `AutoCat_*` in **`BeforeEach` only**; `AfterEach` is deliberately **empty**.
The mochawesome screenshot is taken by a **root** `afterEach`, while the exec file's `AfterEach`
runs in a **suite-level** hook — and mocha runs suite hooks first — so an `AfterEach` sweep would
delete each category moments **before** its screenshot, evidencing every create/delete TC with a
picture of an empty list.

> CLST's both-hooks pattern stays correct (its reset clears a filter, which no screenshot depends
> on). GCAT's empty `AfterEach` must **not** be "aligned" to it by symmetry.

Data names are **per-run unique and sweepable**: `AutoCat_<tag>_<epoch-ms>` — unique so the
name→index lookup is unambiguous, prefixed so leftovers are recognisable.

`TST_GCAT_TC_6` **creates its own category** rather than opening one of the school's three shared
ones (`new catagory`, `new Grading Category`, `some`). Two reasons: `BeforeEach` sweeps every
`AutoCat_*` so it cannot borrow one, and a brand-new category is **guaranteed** to have zero classes
— which is what makes `Active classes (0)` and the empty-state copy safe to assert verbatim.

## Open / blocked

- **`TST_GCAT_TC_4` (maximum-categories limit) — BLOCKED.** Its precondition is a school already at
  its cap. The maximum is unknown, `FCN-CHZ-PDA` is **shared** (holding it at the cap would break
  every other suite's category creation), and a crash before cleanup leaves it full.
  **Unblock via:** (a) a **dedicated school** *(recommended)*; (b) product supplying the exact
  maximum plus acceptance of the shared-school impact; (c) an environment with no other suites.
  The expected modal copy is **already verified** (the modal is pre-rendered), so this is short work
  once a school exists. **It is not implemented, not registered in the TC repository and not in any
  execution file** — it exists only as an explanatory comment at the top of
  `adminGradingCategories.test.js` `[verified 2026-08-21]`. Deliberately not a skipped test, so it
  cannot run by accident.
- `TST_GCAT_TC_7` runs **inside the CGST suite**, because its precondition is a category applied to
  a live class. Registered here (ownership follows the page object) but listed in
  `adminClassGradeSettings.json`.
- **`assertPanelClosed(selector, customMessage)` takes a MESSAGE, not a timeout**, and checks
  instantly — unusable for an animated close. Use `waitForDisplayed(sel, ms, true)` instead. Worth
  knowing repo-wide.

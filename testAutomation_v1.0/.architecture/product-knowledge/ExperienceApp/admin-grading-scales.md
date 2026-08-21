# Admin App — Manage grading scales (`GSCL`)

> Module **`GSCL`** · page object `manageGradingScales.page.js` · suite
> `npm run P1AdminGradingScales_Thor`.
>
> **Read [`admin-shared.md`](admin-shared.md) first.** The pre-rendered-modal doctrine, positional
> ids and Angular typing rules apply here and are not repeated.
>
> This page is the **sibling** of Manage grading categories — same School settings menu, same
> create/delete shape, several of the same traps. **But the two are NOT symmetric** where it
> matters most (see *Details page* below), and assuming they were would produce a page object that
> works for one and silently fails for the other.
>
> Living document — append, never overwrite. `[Seeded 2026-08-21]` from
> `walkthrough_adminGradingScales.test.js_2026-08-19_12h-04m.md`, the CGST session-2 walkthrough,
> and the page object's own 7-trap header. Captured live on **thor / `FCN-CHZ-PDA`**.

---

## Entry path and URLs

**School settings ▾ (`#changeClassKeyActionsLink`) → Manage grading scales (`a[qid='adEdit-8']`)**
→ `/grading-scales/manage`. Create form: `/grading-scales/create`. Details: `/grading-scales/<id>`.

> Note `#manage-grading-scales` (plural) is the **element id of the School settings link** — not a
> page scope. The page's component tag is singular. See below.

## Three views, three component tags

All three render an unclassed `<h1>`, so the component tag is what stops one page's heading
selector matching another's:

| View | Component tag |
|---|---|
| Manage (list) | **`manage-grading-scale`** — SINGULAR |
| Create form | **`create-grading-scale`** |
| Details | `grading-scale-details` |

> **The plural spelling matches nothing** — the same trap the categories page has.

## Key elements

**Manage page**

| Element | Selector |
|---|---|
| Create | `a[qid='manageGradingScale-3']` · User guide `a[…-2]` · Back `a[…-1]` |
| Row container | `manage-grading-scale div.list-items` |
| Scale name (by index) | `a[qid='manageGradingScale-4-{{n}}']` |
| Default badge | `manage-grading-scale h2.title-heading span.default-tag` |
| Row actions toggle | `a[qid='manageGradingScaleLinkDropDown-{{n}}']` |
| Row → View details | `a[qid='manageGradingScaleOption-1-{{n}}']` |
| Row → Set as default | `a[qid='manageGradingScaleOption-2-{{n}}']` |
| Row → Delete | `a[qid='manageGradingScaleOption-3-{{n}}']` |

**Create form**

| Element | Selector | Cap |
|---|---|---|
| Title | `#grading-scale-title` | **`maxlength="20"`** |
| Grade name | `#grade-name-{{n}}` | `maxlength="20"` |
| From % / To % | `#grade-from-{{n}}` / `#grade-to-{{n}}` | `maxlength="3"` |
| Set as target score | `#grade-target-{{n}}` (click the `label[for=…]`) | |
| + Add new grade / delete | `a[qid='grade-add-{{n}}']` / `a[qid='grade-delete-{{n}}']` | |
| Save / Cancel | `button[qid='sv-grding-scale']` / `a[qid='cnl-grding-scale']` | |

**Modals** (all `:has(...)`-scoped): `unsavedModal`, `setDefaultModal`, `deleteModal`,
`maxLimitModal`, `errorModal`.

**Details page**: `detailsHeading`, `bandsToggle` (`gradingScaleDetails-2`), `bandsPanel`
(`div.collapse` / `.collapse.show`), `bandCell`, `bandTargetScore`, `detailsClassesHeading`
(`p.classes-heading`), `detailsLoadMoreLink` (`gradingScaleDetails-4`).

---

## Traps

**1. FOUR `.modal-content` elements live in the DOM at all times** — set-as-default, generic error,
max-limit, delete-confirmation. Same false-green family as the categories page. Every modal
selector is `:has(...)`-scoped; every check uses `isDisplayed`.
> **Useful consequence:** the max-limit modal is pre-rendered, so its copy was captured word for
> word **without filling the school to its cap**.

**2. Row action `qid`s are POSITIONAL** (`manageGradingScaleLinkDropDown-0`, `-1`, …), not keyed by
scale name. Look the index up by name every time.

**3. The DEFAULT scale's menu genuinely OMITS its options.** Unlike the categories page — where
every row's items sit in the DOM permanently and only *visibility* differs — the default scale's
dropdown contains **only** "View details"; Set-as-default and Delete are **absent entirely**
(element count 0). So `TST_GSCL_TC_11` can assert a count of **0**, which is a truthful check here
and would be a **false green one page over**. It asserts both the count *and* the visibility, so a
product change to "present but hidden" would still be caught.

**4. Band rows RE-INDEX when a middle band is added.** A fresh create form has
`0 = Highest, 1 = Lowest`. After one "+ Add new grade" they become
`0 = Highest, 1 = the NEW middle band, 2 = Lowest`. A selector written against the old layout
**silently writes the middle band's values into the Lowest row.** Address the lowest row as
`count - 1`, never a literal `1`.

**5. Cancel is conditional.** An edited form raises *"Are you sure? All changes will be lost"*; an
untouched one returns to the list directly. `click_cancelCreate` handles both.

**6. "Set as default" is SCHOOL-WIDE state.** The product's own confirmation says *"All newly
created classes will be associated with this grading scale."* `FCN-CHZ-PDA` is shared, so
`reset_state` restores the original default **before** it sweeps — and the order is **not
incidental**: a default scale exposes no Delete option (trap 3), so a run that died after the
set-default TC leaves one of our own scales as the school default and it **cannot be removed**
until the badge is handed back.

**7. FIELD LENGTH CAPS — not mentioned anywhere in the manual cases.**
`#grading-scale-title` = 20 · `#grade-name-<n>` = 20 · `#grade-from-<n>` = 3.
These are the *input's own* caps, so an over-long value is silently kept at the cap and never
settles.

---

## Three failures, three different lessons

### Run 1 — 4/10. The 20-character cap

All six failures were one cause: every generated name came back **exactly 20 characters**
(`AutoScale_create_178`, `AutoScale_details_17`, …). Names were `<prefix><tag>_<13-digit epoch>` =
30 characters.

This is *not* the flaky typing race the categories page has (which loses a **different** number of
characters each run). The read-back proved the field itself stopped at 20 — a **client-side cap**,
so a data problem of ours, not a defect to report (Invariant 14).

> **And it explained a mystery.** The scale `AutoScale_details_17` already sitting on thor was not
> left by any committed automation — nothing in the repo references `AutoScale`. It is a
> 20-character truncation of exactly this shape, from an earlier hand-run.

Fixed with `<prefix><2-char tag><base36 epoch>` = exactly 20, **plus a guard that throws** if a
future prefix/tag change ever exceeds the cap, so the bug class cannot recur silently. `set_title`
also gained a fail-fast: two top-ups that move nothing stop immediately with *"field stopped
accepting input at N characters"* instead of burning the full 15 s budget per TC. **That alone took
the run from 3 minutes to 58 seconds.**

### Run 2 — 4/10. Save stayed disabled

Titles typed correctly, but "Save grading scale" never enabled on a complete, valid form.
Interactive reproduction was impossible (the MCP browser's input channel was dead — see
`admin-shared.md` §B11), so the diagnosis had to come from the suite. Two causes, fixed together,
both *"commit the real signal"* rather than workarounds:

- **The last field is never blurred.** `set_band` blurs each input by moving to the next, but the
  final one is left focused — a form using `updateOn:'blur'` never receives its value.
  `blur_activeField()` (Tab) now commits it.
- **The target radio renders checked but was never clicked.** A DOM `checked` flag is not proof the
  form model holds a target, and Save is gated on one. It is now clicked explicitly.

`getData_formState()` was added at the same time and is logged by **every** creating TC — when a
save fails the useful question is always *"what did the form actually hold"*, and each run costs
1–3 minutes against a shared school.

### Run 3 — 7/10. Copy mismatches

My transcription, not the product: during capture the text was read through `.replace(/\s+/g,' ')`,
which **flattened the blank lines the product actually renders**
(`"Are you sure?\n\nDeleting the grading scale…"`). Now compared through a `squash()` helper that
collapses whitespace runs on **both** sides — still sensitive to every wording change, which is the
point of asserting copy, without failing when only a line break moves. **Not a loosening.**

**Runs 4 and 5 — 10/10, twice.**

---

## Details page — where it differs from categories

| | Scale details (`grading-scale-details`) | Category details (`grading-category-classes`) |
|---|---|---|
| Heading | `p.classes-heading` → **`Classes (N)`** | `h2.heading-2` → **`Active classes (N)`** |
| **Lists deleted classes** | **YES** | **no** |
| Columns | name, key, start, end, **status** | name, key |
| Row link | `a[qid^='gradingScaleDetails-3-']` | `a[qid^='gradingCategoryClass-3-']` |
| Load more | `a[qid='gradingScaleDetails-4']`, page size 20 | none |
| Search / sort | none | present, but only when ≥1 active class |

This asymmetry is why `new Grading Auto` showed `Classes (2)` — two dead `AutoClass_CGST` rows from
earlier runs — while the category `some` showed zero, **despite both being applied by the same
suite to the same class**. Every past CGST run leaves another soft-deleted row on the scale's page
**permanently**, so **nothing asserts on `Classes (N)`**.

> **Clicking the row link on a DELETED class is a dead end** — it drops the school context, lands on
> *My school accounts*, and raises *"Sorry! — The item is not available because the class is no
> longer active"* (a generic `div.modal-content`, `p.modal-title` / `p.modal-description`, **no
> `qid`**). That is the product explaining itself, **not a defect** — but it is why
> `TST_GSCL_TC_7` asserts `status === "Active"` before clicking.

## Product copy (verified live)

- Manage page: default *"Cambridge One grading scale"* offers **View details only**; custom scales
  offer View details / Set as default / Delete.
- Band example: `A 50-100%` target `50%`, `F 0-49%`. Highest `To` = 100, Lowest `From` = 0.
- Validation: *"bands must add up to 100% without overlapping"*.
- Set-as-default confirmation: *"All newly created classes will be associated… Existing classes
  will not be affected."*
- Delete confirmation: *"…will not affect classes associated with it, but it won't be available to
  apply to any new classes."*

## Data notes

- Sweepable prefix `AutoScale_`. Names must fit **20 characters** — the guard enforces it.
- **Never delete** `Cambridge One grading scale` (platform default) or `new Grading Auto` (the
  school's own).
- The pre-existing `AutoScale_details_17` was confirmed **disposable** and is swept by the prefix.
- `reset_state` restores the original default **before** sweeping (trap 6). The set-default TC runs
  **last**, leaving no following `BeforeEach` to restore it — so the housekeeping TC
  **`TST_GSCL_TC_13` is listed in BOTH `BeforeEach` and a suite-level `After`**
  (`adminGradingScales.json`, verified 2026-08-21). `After` is safe where `AfterEach` is not: it
  runs once, after every test's screenshot has been taken (ADR-019).
- Verified after the run: default back on `Cambridge One grading scale`, zero `AutoScale_*`
  leftovers, `new Grading Auto` untouched.

## Open / blocked

- **`TST_GSCL_TC_4` (maximum-scales limit) — BLOCKED**, same shape as `TST_GCAT_TC_4`: needs a
  school already at its maximum, and `FCN-CHZ-PDA` is shared. **Expected copy already verified**
  (the modal is pre-rendered), so it is short work once a dedicated school exists. Not implemented,
  not registered and not in any exec file — it exists only as a comment at the top of
  `adminGradingScales.test.js` `[verified 2026-08-21]`.
- `TST_GSCL_TC_7` runs **inside the CGST suite** — its precondition is a scale applied to a live
  class. Registered here (ownership follows the page object), listed in
  `adminClassGradeSettings.json`.
- **No boundary manual test case exists for the 20-character title limit.** GCAT has one for its
  50-char field; GSCL has none. A genuine manual-coverage gap — flagged 2026-08-19, still open.
- **An NPS survey can block the whole page.** A `<cg-survey>` web component rendered a full-viewport
  overlay (1025×652, inside a shadow root) during capture and intercepted every click. It has **no
  close control** — only score buttons and "Next" — so the only ways past are answering it (which
  submits real feedback and must not be automated) or removing the element client-side. It never
  appeared during a suite run, so **no workaround was built**. If a run ever fails on *"element
  intercepts pointer events"*, check this first.
- Phase 3 (visual) is **complete** — all 10 TCs stay `visualTest: false`. `TST_GSCL_TC_5` was the
  first genuine ✅-row candidate this page family produced (it ends on the create form, which does
  not frame the shared mutable list, and all its data is fixed); it was raised with the user and
  **promotion was declined** 2026-08-19. The one unprobed risk is whether a banner from
  `BeforeEach`'s sweep can linger onto that form.

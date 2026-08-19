# Walkthrough — Admin App "Grading scales" automation (module GSCL)

**Feature:** Requirements #10, #11, #12, #14, #15, #16 · Env **thor** · School **FCN-CHZ-PDA**
(`org_perf_testschool_1`). One file per feature — **append future GSCL sessions here.**

---

# Session 1 — 2026-08-19 · Phases 1–3

**Result: 10 passing / 0 failing, two consecutive clean runs (~58 s).** New suite
`npm run P1AdminGradingScales_Thor`.

| | |
|---|---|
| Automated | `TST_GSCL_TC_1, 2, 3, 5, 6, 8, 9, 10, 11, 12` (10 of 12) |
| Not automated | `TC_4` (blocked — shared school at cap), `TC_7` (deferred to CGST) |
| New selectors | `css.ComproC1.manageGradingScales` — 53 |
| Manual register | 45 Pass / 35 Not Run → **55 Pass / 24 Not Run / 2 Blocked** |

## Scope correction made at the start

The prior handoff listed GSCL as **11** automatable TCs. Reading the manual cases showed
`TST_GSCL_TC_7` (Req #13) has the precondition *"the grading scale is applied to ≥ 1 class"* —
which is a **CGST** operation, exactly like `TST_GCAT_TC_7`. It was moved out of this batch and
deferred to CGST rather than duplicated, taking GSCL to **10**.

## What the live capture found

**Three page-scoping tags.** `<manage-grading-scale>` (list), `<create-grading-scale>` (form),
`<grading-scale-details>` (details). All three render an unclassed `<h1>`, so the component tag is
what stops one page's heading selector matching another's. Note the **singular** "scale" — the
plural spelling matches nothing, the same trap the categories page had.

**The same four permanent modals** as the categories page: set-as-default, generic error,
max-limit and delete-confirmation, all in the DOM at all times with only one visible. Every modal
selector is `:has(...)`-scoped and every check goes through `isDisplayed`.

> A useful consequence: the **max-limit modal is pre-rendered**, so its copy was captured word for
> word **without filling the school to its cap**. `TST_GSCL_TC_4` stays blocked, but its
> `[ASSUMED]` expected result is now resolved — it is short work once a dedicated school exists.

**Trap 3 — the default scale's menu genuinely OMITS its options.** Unlike the categories page
(where every row's items sit in the DOM permanently and only visibility differs), the default
scale's dropdown contains **only** `View details`; Set-as-default and Delete are absent entirely
(element count 0). So `TST_GSCL_TC_11` can assert a count of 0 — a truthful check here that would
be a false green one page over. It asserts **both** the count and the visibility, so a product
change to "present but hidden" would still be caught.

**Trap 4 — band rows re-index.** On a fresh create form the rows are `0 = Highest, 1 = Lowest`.
After one "+ Add new grade" they become `0 = Highest, 1 = the new middle band, 2 = Lowest`. A
selector written against the old layout would silently write the middle band's values into the
Lowest row. `TST_GSCL_TC_3` asserts the move explicitly, and the page object addresses the lowest
row as `count - 1`, never as a literal 1.

**Trap 5 — Cancel is conditional.** An edited form raises "Are you sure? All changes will be
lost"; an untouched one returns to the list directly. `click_cancelCreate` handles both.

## Three failures, three different lessons

### Run 1 — 4/10. Field length caps (traps 7)

All six failures were one cause: every generated name came back **exactly 20 characters**.

```
AutoScale_create_178   AutoScale_details_17   AutoScale_bands_1787
AutoScale_cancel_178   AutoScale_delete_178   AutoScale_default_17
```

The title input carries `maxlength="20"` (grade-name is also 20, From/To are 3) — **not mentioned
anywhere in the manual cases**. Names were `<prefix><tag>_<13-digit epoch>` = 30 characters.

This is *not* the flaky typing race the categories page has (which lost a different number of
characters each run). The read-back did exactly the job it was built for: the field itself stopped
at 20, proving a client-side cap rather than a server-side truncation — so it is a data problem
of ours, not a defect to report (Invariant 14).

> **And it explains a mystery.** The scale `AutoScale_details_17` that already existed on thor was
> not left by any committed automation (nothing in the repo references `AutoScale`). It is a
> 20-character truncation of exactly this shape — an earlier hand-run hit the same cap.

Fixed by switching to `<prefix><2-char tag><base36 epoch>` = exactly 20, **plus a guard** that
throws if a future prefix/tag change ever exceeds the cap, so the class of bug cannot recur
silently. `set_title` also gained a fail-fast: two top-ups that move nothing now stop immediately
with *"field stopped accepting input at N characters"* instead of burning the full 15 s budget
per TC — that alone took the run from **3 minutes to 58 seconds**.

### Run 2 — 4/10. Save stayed disabled

Titles now typed correctly, but "Save grading scale" never enabled on a complete, valid form.

Interactive reproduction was impossible: the **Playwright-MCP browser's input channel is dead** —
`page.keyboard.type` produces nothing and `locator.click()` does not focus, while a JS `.focus()`
and a JS `.click()` both work.

> **This corrects the 2026-08-18 GCAT walkthrough**, which recorded that "the MCP click did not
> fire the Angular handler on `javascript:void(0)` anchors". That was not an Angular quirk — it is
> this MCP browser not delivering real input events. The framework's own browser is unaffected,
> which is why every suite runs fine.

So the diagnosis had to come from the suite. Two hypotheses were fixed together, both being
"wait on / commit the real signal" rather than workarounds:

- **The last field is never blurred.** `set_band` blurs each input by moving to the next, but the
  final one is left focused — a form using `updateOn:'blur'` would never receive its value.
  `blur_activeField()` (Tab) now commits it.
- **The target radio renders checked but was never clicked.** A DOM `checked` flag is not proof
  the form model holds a target, and Save is gated on one. It is now clicked explicitly.

`getData_formState()` was added at the same time and is logged by **every** creating TC — when a
save fails the useful question is always "what did the form actually hold", and each run costs
~1–3 minutes against a shared school.

### Run 3 — 7/10. Copy mismatches

The three remaining failures were my transcription, not the product: during capture I read the
text through `.replace(/\s+/g,' ')`, which flattened the blank lines the product actually renders
(`"Are you sure?\n\nDeleting the grading scale..."`).

Agreed with the user to compare through a `squash()` helper that collapses whitespace runs on
**both** sides. That keeps the assertion sensitive to every wording change — the point of
asserting copy — without failing when only a line break moves. Not a loosening: the full sentence
still has to be present and identical.

**Run 4 and 5 — 10/10, twice.**

## Shared-school safety (`TST_GSCL_TC_8`)

`Set as default` is the only school-wide change in the suite; the product's own confirmation says
*"All newly created classes will be associated with this grading scale"*. Automating it with a
restore was confirmed with the user.

`reset_state` restores the original default **before** it sweeps, and the order is not incidental:
a default scale exposes no Delete option (trap 3), so a run that died after TC_8 leaves one of our
own scales as the school default and it **cannot be removed** until the badge is handed back.

TC_8 also runs **last**, which left no following `BeforeEach` to restore it — so the exec file
gained a suite-level **`After`** hook. `After` is safe where `AfterEach` is not: it runs once,
after every test's screenshot has been taken, so no evidence is destroyed (ADR-019).

**Verified after the run:** default back on `Cambridge One grading scale`, zero `AutoScale_*`
leftovers, and the school's own `new Grading Auto` untouched.

## Test data decisions (agreed with the user)

- The pre-existing `AutoScale_details_17` was confirmed **disposable** and is swept by the prefix.
- `new Grading Auto` and `Cambridge One grading scale` are the school's own and are never touched.

## Files added / changed

| Layer | File |
|---|---|
| npm script | `P1AdminGradingScales_Thor` |
| Exec file | `testResources/testExecutionFiles/ExperienceApp/thor/adminGradingScales.json` (note the `After` hook) |
| Test file | `test/ExperienceApp/adminGradingScales.test.js` (module **GSCL**) |
| Page object | `pages/ExperienceApp/manageGradingScales.page.js` — **all seven traps documented in the header; read them first** |
| Data | `testResources/testcaseData/ExperienceApp/thor/adminGradingScalesData.json` |
| Selectors | `C1Selectors.json` → `css.ComproC1.manageGradingScales` (53) |
| Manual register | `.md` + `.xlsx`, 10 rows → Pass, plus the stale summary block corrected |

No protected file was touched.

## Phase 3 — visual assessment

| TC | Data it frames | Decision-table row | Verdict |
|---|---|---|---|
| `TC_1` | the school's live scale list | Paginated / dynamic counts ❌ | Not a candidate |
| `TC_2`, `TC_6`, `TC_9`, `TC_10`, `TC_12` | `AutoScale_*` + base36 timestamp | Timestamps ❌ | Not a candidate |
| `TC_3` | timestamped title on the form | Timestamps ❌ | Not a candidate |
| `TC_8` | timestamped name + the moving default badge | Timestamps ❌ | Not a candidate |
| `TC_11` | the shared list behind the open menu | Paginated / dynamic counts ❌ | Not a candidate |
| `TC_5` | **fixed** title "A", fixed band values, no list on screen | Fixed/static content ✅ | **Raised with the user** |

`TC_5` is the first genuine candidate this page family has produced: it ends on the **create
form**, which — unlike every earlier candidate — does not frame the shared, mutable list. The one
open question is whether a banner from `BeforeEach`'s sweep can linger onto it; no banner was
observed on this page, but it was never deliberately probed. Left `visualTest: false` pending the
user's decision (AGENTS.md §8 Rule A requires explicit confirmation before any promotion).

## Open items

1. **`TST_GSCL_TC_4` — BLOCKED**, same shape as `TST_GCAT_TC_4`: needs a school already at its
   maximum, and `FCN-CHZ-PDA` is shared. Expected copy already verified. Unblock with a dedicated
   school.
2. **`TST_GSCL_TC_7` — deferred to CGST** (needs a scale applied to a class), alongside
   `TST_GCAT_TC_7`.
3. **No boundary test case exists for the 20-character title limit.** GCAT has one
   (`TST_GCAT_TC_3`, 50 chars); GSCL has none. A genuine manual-coverage gap — flagged, not added,
   because writing new manual TCs was out of scope for this session.
4. **An NPS survey popup can block the whole page.** A `<cg-survey>` web component rendered a
   full-viewport overlay (1025×652, inside a shadow root) during capture and intercepted every
   click. It has **no close control** — only score buttons and "Next" — so the only ways past are
   answering it (which submits real feedback and must not be automated) or removing the element
   client-side. It did not appear during any suite run, so **no workaround was built**; if a run
   ever fails on "element intercepts pointer events", this is the first thing to check.
5. **Playwright-MCP input channel is dead** in this environment (see Run 2). Capture via JS
   evaluation works; interactive typing/clicking does not. Worth fixing before the next capture
   session, otherwise all form behaviour must be diagnosed through suite runs.

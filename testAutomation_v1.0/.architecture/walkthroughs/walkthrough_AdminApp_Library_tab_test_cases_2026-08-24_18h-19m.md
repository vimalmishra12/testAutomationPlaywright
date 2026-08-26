# Session Walkthrough — 2026-08-24 · AdminApp Library tab, manual test-case design

## Summary

Designed the manual functional test cases for the **Admin App Library tab** — the last un-covered
Admin App tab — from `Requirement.xlsx` (4 scenarios). Grounded every case on the live Thor app
before writing, which surfaced **three product defects** and **two usability gaps** at design time.
Emitted the `.md` + `.xlsx` register (40 TCs), seeded a new product-knowledge file for the screen,
and promoted the cross-screen findings into `admin-shared.md`.

**Skill used:** `c1-manual-test-authoring`, read from the repo root
`D:\testAutomation\QATestAutomation\.agent\skills\` (not the worktree copy).

---

## 0. Scope resolution

The request was *"create test cases for other tab of admin"*. "Other tab" was ambiguous on its own —
Classes, Students and Staff already have registers. The attached `Requirement.xlsx` resolved it
without needing to ask: its sheet header reads **"Library tab"**, with four scenarios:

| # | Scenario (verbatim from the workbook) |
|---|---|
| 1 | Verify Sort feature |
| 2 | Verify See Materials for an umbrella product - All types of components |
| 3 | Verify School licence appear in school licence section |
| 4 | Verify search by title |

All four are in this batch. Nothing deferred.

---

## 1. Grounding pass (live, Playwright MCP)

**Env:** Thor `https://micro-nemo.comprodls.com` · **School:** `FCN-CHZ-PDA` "3 July Test School 1"
(org slug `org_perf_testschool_1`) · **Login:** `testt1@mailsac.com` (school-admin).
**State:** 970 products, 3 school licences — a genuinely populated state, per golden rule 1.

Ran the product half of the `admin-shared.md` §B1 reconnaissance sweep. What was **observed**:

- populated list · search results · no-results · whitespace-only search · in-date licence ·
  expired licence · multi-component product view (12 and 15 components) · Add-to-a-class dialog
- Measured: full list render **~5.1 s** (970 products); search settle **~1.0 s** (1032 ms)

What was **not** observed, and is therefore `[ASSUMED]` in the register:

- a school holding **zero** school licences (→ `TST_LIBR_TC_30` **Blocked**)
- a **single-component** product (→ noted on `TST_UMBP_TC_9`)
- why the `N out of M components activated` line appears on one product and not another
- why the Add-to-a-class dialog listed **5** classes when the school shows **106**
- the long-title **visual** wrap (the `word-wrap` class was confirmed in the DOM; the rendering was not)

**Deliberately not exercised** — both mutate the shared school irreversibly (`admin-shared.md` §A5):
component **activation**, and **completing** Add-to-a-class. Cases assert the controls and status
text only, which keeps the whole batch side-effect free.

---

## 2. Findings

### Product defects (written as expected-versus-actual cases)

| TC | Defect | Evidence |
|---|---|---|
| `TST_UMBP_TC_10` | **"Back" on the product materials view loses the school context.** It requests `/admin/admin//library` — org slug **missing**, doubled slash. The route does not resolve and the app redirects to `/admin/admin/dashboard` ("My school accounts"). | **Reproduced twice**, on two products (`sj11042501`, `r55multicomponent`), via a scripted click **and** a real user click |
| `TST_LIBR_TC_21` | **"Search by title" is fuzzy, not a substring match.** `Compass` returned `bundleallcomps`, `Speaking Companion Test Bundle`, `devtest0702comp`, `nlpcompro_migtest_01`, `Visible prior to activation other comps`. Substring hits come first alphabetically; fuzzy hits are appended. | 44 results inspected title-by-title |
| `TST_LIBR_TC_22` | **Whitespace-only search is not trimmed** — three spaces → 0 results, banner renders the raw spaces (`Showing search results for   .`). An empty term *is* handled correctly. | Direct comparison of `""` vs `"   "` |

### Usability / consistency gaps (need a product decision before being raised)

| TC | Gap |
|---|---|
| `TST_LIBR_TC_9` | The **sort control gives no direction indicator**. Label stays `Title`, class stays `list-info ml-2 sort-by-title-btn active`, no icon, no `aria-sort` — byte-identical DOM in A→Z and Z→A. Also an accessibility gap. |
| `TST_LIBR_TC_18` | The heading's **`(N)` count disappears** while a search is active — no way to see how many matched. |
| `TST_LIBR_TC_19` | Multi-word terms are **OR-matched**, so adding a word *broadens* the search (`Compass` → 44, `COMPASS UMBRELLA` → 198). |

### Three Classes-tab habits that do **not** hold on the Library tab

Recorded because inheriting them would have produced wrong tests:

| Behaviour | Classes tab | Library tab |
|---|---|---|
| Sort collation | **code point** | **case-insensitive** (`Y Test Product` before `yaminitestproduct1`) |
| Search persistence | persists server-side across reload + re-login | **not persisted** |
| Lazy loading | page size 20, "Load more" removed when exhausted | **none — all 970 render at once** |

### Automation traps captured

1. **`t-prd-cmp-cntr-1` is shared by EVERY component tile** — 12 identical qids on one product,
   15 on another. The qid cannot address a single component.
2. **`t-prd-umb-dd-1` is shared by 2330 pre-rendered class options**, all hidden until the
   Add-to-a-class dialog opens — a presence/count check is a guaranteed false green (§B2).
3. **`aLibrary-4-<n>` product rows are positional** — look up by title on every use (§B3).
4. **The Clear link is `aClass-99`** — a *Classes-tab* qid living on the Library tab; a sweep
   scoped to `aLibrary-*` misses it.
5. **The row, not the "See materials" anchor, is the accessible control** — the anchor is
   `aria-hidden="true" tabindex="-1"`.
6. **The sort control cannot distinguish its states** — assert list order, never the control.
7. **`Back` breaks the school context** — a suite must re-navigate via the school card.

### Smaller observations (recorded in Remarks, not as their own cases)

- Add-to-a-class class rows render with **literal square brackets**: `[mn] [acPZ-EQTo]`.
  *(Session 2 update: **confirmed as-designed** by the user 2026-08-26 — the intended display
  format, not a template bug. Recorded so it is not re-flagged.)*
- The no-results message has **no closing full stop**.
- The expired-licence warning icon carries `alt=""` — meaning not exposed to screen readers.
- **Three date formats in one feature**: `Expires Jul 5, 2029` (licence tile),
  `Started: … Expires: …` (licensed component), bare `Expires` + date (other components).

---

## 3. Changes Made

### 1. `test/Manual/C1App/AdminApp-Library/AdminApp_Library_tab_test_cases.md`
- **Type:** Created
- **Layer:** Test Resources (manual register)
- **What changed:** New 40-TC manual document — header/summary block, requirement→TC coverage map,
  a dated *Product reference* section (routes, states observed, fields, verbatim copy, async
  behaviour, automation traps), then all 40 cases in the 14-column format, grouped by Linked
  Requirement with Positive → Edge → Negative inside each group.
- **Why:** Scenario source `Requirement.xlsx` — Library tab, the last un-covered Admin App tab.

### 2. `test/Manual/C1App/AdminApp-Library/AdminApp_Library_tab_test_cases.xlsx`
- **Type:** Created
- **Layer:** Test Resources (manual register)
- **What changed:** Sheet `Test Cases`, 40 rows × 14 columns. Header fill Cambridge purple
  `FF3D1A66`, white bold Calibri 11, frozen row 1, autofilter, per-row `Status` data-validation
  dropdown (`Not Run / Pass / Fail / Blocked`), column widths matched to the Staff register.
- **Why:** The `.xlsx` is the execution register; the `.md` is the review surface. Both are required.

### 3. `.architecture/product-knowledge/ExperienceApp/admin-library-tab.md`
- **Type:** Created
- **Layer:** Architecture / product knowledge
- **What changed:** New feature-area file (ADR-020) for `LIBR` + `UMBP` — routes and qid map,
  product-list behaviour, the §3 Classes-tab contrast table, the §4 Back defect, §5 component
  states with verbatim copy, §6 School licence section, §7 fields (explicitly: **no capped field
  exists**), §8 automation traps.
- **Why:** Golden rule / exit checklist — durable findings must be promoted into product knowledge,
  not left only in the test document.

### 4. `.architecture/product-knowledge.md`
- **Type:** Modified · **Layer:** Architecture
- **What changed:** One row added to the *Feature-area files* table for the Library tab
  (`LIBR` / `UMBP` → `admin-library-tab.md`).
- **Why:** ADR-018/ADR-020 index registration.

### 5. `.architecture/product-knowledge/ExperienceApp.md`
- **Type:** Modified · **Layer:** Architecture
- **What changed:** Two rows added to the *Feature-area files* map — **Library tab** (`LIBR`) and
  **Product materials view** (`UMBP`), both pointing at `admin-library-tab.md`.
- **Why:** Same — the app file is the screen→file index.

### 6. `.architecture/product-knowledge/ExperienceApp/admin-shared.md`
- **Type:** Modified · **Layer:** Architecture
- **What changed:** Three appends —
  - **§A2** coverage table: two rows for `LIBR` and `UMBP`.
  - **§A4** async/persistence: a new bullet, *"The Library tab breaks three Classes-tab habits"*,
    naming the collation / persistence / lazy-loading differences and the fuzzy search, and warning
    against inheriting a Classes-tab expectation onto a new admin tab without re-verifying it.
  - **§B2** pre-rendered DOM table: a row for the 2330 shared-qid class options.
  - **§B3** positional-id table: three rows — `aLibrary-4-<n>`, `t-prd-cmp-cntr-1` (explicitly
    flagged as **not positional but non-unique**, a new failure shape for that table), and
    `aClass-99` on the Library tab.
- **Why:** These generalise beyond the Library tab, so they belong in the shared file where the next
  admin tab will read them.

**Anchor safety:** every `admin-shared.md` / index edit was applied by a script that asserts its
anchor string occurs **exactly once** before replacing, and aborts otherwise. No blind `sed`.

---

## 4. How the `.md` and `.xlsx` were kept in agreement

Golden rule 6 — they have drifted repeatedly on past batches. This session removed the possibility:

1. All 40 cases were authored **once**, into a single JSON source in the scratchpad.
2. A generator emitted **both** the Markdown case section and the `.xlsx` from that one source, so
   there is no hand-transcription step where drift can enter.
3. The generator **validates before writing** — unique IDs, no empty designer fields, legal
   Type/Priority/Status values, and **contiguous Linked-Requirement groups** (the grouped ordering
   convention is enforced, not just intended).
4. The `.xlsx` is **read back after saving** and every one of the 560 cells compared against the
   source; a mismatch aborts. (Same guard as `tooling/xlsxRegister.js` — a silent no-op write is
   the failure mode worth catching.)
5. A final independent cross-check confirmed: **40 rows both sides**, S.No. 1–40 sequential, type
   split 16/18/6, status 39 Not Run + 1 Blocked, and all 40 IDs present in the `.md`.

The scratchpad source and generator were **not** committed — they are a build step, not a
deliverable. See *Pending* §1 on whether that should change.

---

## 5. Architecture Decisions Triggered

No new ADR is required — the session followed ADR-018 (per-app knowledge), ADR-020 (feature-area
files), AGENTS.md Rule 6 (module codes from the future page object) and the Admin App
grouped-by-requirement manual convention.

> ⚠️ **Candidate pattern, not yet an ADR — generate manual registers from one source.**
> The `.md`/`.xlsx` drift problem is structural, and this session solved it by construction rather
> than by discipline (§4). `tooling/xlsxRegister.js` today only *patches* an existing workbook; it
> cannot create one. If the team agrees, a `create` mode belongs in that tool and this becomes the
> standard way every future manual batch is emitted. **Raised for a decision — not adopted
> unilaterally.**

**Module codes** were chosen from the page objects the screens will get — `schoolLibrary` → `LIBR`,
`umbrellaProduct` → `UMBP` — so, as with the Students and Staff batches, **no re-mapping is owed**
(unlike the historic `BCCF` → `CCLS` mismatch).

---

## 6. Protected Files Touched

**None** — no protected JS or config file was modified. All changes are Markdown, one `.xlsx`, and
no code.

A temporary generator was copied to `tooling/_genLibrary.tmp.js` to borrow the repo's `exceljs`
dependency, then **deleted**. Two stray capture artefacts (`library-tab.png`, `.playwright-mcp/`)
were also removed. `git status` is clean apart from the intended changes.

---

## 7. Pending / Follow-up

1. **Decide on the "generate the register from one source" pattern** (§5) — adopt as an ADR and add
   a `create` mode to `tooling/xlsxRegister.js`, or treat this session as a one-off.
2. **`TST_LIBR_TC_30` is Blocked** — needs a school with **zero** school licences, or a product-team
   statement of the intended empty state. One dedicated school unblocks it.
3. **Confirm the five `[ASSUMED]` items** listed in §1 during automation Phase 1.
4. **Raise the three defects** (`TST_UMBP_TC_10`, `TST_LIBR_TC_21`, `TST_LIBR_TC_22`) as tickets.
   `TST_UMBP_TC_10` is the high-impact one — it breaks the browse loop for every product an admin
   inspects.
5. **Get a product decision on the two usability gaps and the OR-search** before raising them —
   they may be intentional.
6. **Nothing is automated.** 40 cases exist on paper, 0 in code. Automation continues in
   `c1-test-authoring` Phase 1 — see `.architecture/HANDOFF-adminlibrary-manual.md`.
7. **Open questions for the user** are collected in §8 of that handoff.

---
---

# Session 2 — 2026-08-26 · search behaviour confirmed, test data switched to our own products

## Summary

Follow-up session. The product team **confirmed both search behaviours as intended**, so two cases
stopped being defects. Grounding was re-run against **automation-owned products** at the user's
request, which replaced brittle third-party test data *and* surfaced a better assertion than the one
originally written.

## What changed and why

### 1. Two behaviours confirmed intended — no longer defects

| TC | Was | Now |
|---|---|---|
| `TST_LIBR_TC_21` | **Negative**, written up as a defect ("search by title returns non-matching titles") | **Edge** — *"Verify close-match products are returned after the exact title matches"*. Confirmed deliberate fuzzy matching. |
| `TST_LIBR_TC_19` | Edge, flagged *"confirm with the product team"* | Edge, marked **CONFIRMED INTENDED**. OR-matching on multi-word terms is by design. |

Both were **kept as test cases**, not deleted — they describe real, non-obvious behaviour that
automation must not contradict, and the Remarks now say so explicitly so nobody re-raises them.

**Type split moved 16 P / 18 E / 6 N → 16 P / 19 E / 5 N.** Header, coverage map and `.xlsx` all
re-rolled from the rows (golden rule 9).

### 2. Test data switched to automation-owned products `[user decision]`

Every search case now uses **`vm_automation_book101` / `vm_automation_testing_108`** instead of the
`Compass*` products. Rationale, recorded in each Remarks cell and in the knowledge file: `FCN-CHZ-PDA`
is shared and actively mutated by other teams (`admin-shared.md` §A5), so their products can be
renamed or removed under us — ours cannot.

Cases re-grounded and updated: `TST_LIBR_TC_7`, `TC_10`, `TC_11`, `TC_12`, `TC_13`, `TC_14`, `TC_15`,
`TC_16`, `TC_17`, `TC_18`, `TC_19`, `TC_21`.

> `TST_LIBR_TC_2` still names *"3 Level TOC Compass Umbrella"* — **deliberately.** That case records
> the actual first three titles in the default sort order; it is a factual capture of list order, not
> search data. Its Remarks already state the durable assertion is *"list equals itself sorted"*.

### 3. The grounding paid off — a ranking rule replaced a count assertion

Re-running the searches against our own data produced a **stronger, stabler assertion than the
original document had**:

| Term | Results | Substring matches | All substring matches ranked first? |
|---|---|---|---|
| `vm_automation` | 22 | 2 | ✅ |
| `vm_automation testing` | 29 | 2 | ✅ |
| `vm_automation_testing_108` | 25 | 1 | ✅ |
| `vm_automation_book101` | 10 | 1 | ✅ (rank 1) |

**Substring matches always rank above the fuzzy tail, and the exact typed title ranks 1.**

This replaces the count-based expectations the first draft leaned on:

- ✅ assert *"all substring matches present and occupying the leading positions"*
- ❌ never *"every result contains the term"* — fails against the live product
- ❌ never a result **count** — the fuzzy tail is data-dependent
- ⚠️ **sorting discards the relevance order** — assert ranking *before* clicking Sort

**Also found:** an exact full-title search still returns a tail — `vm_automation_book101` gave
**10** results, not 1. `TST_LIBR_TC_10` was rewritten to assert **rank 1** rather than a single result;
as originally written it would have failed.

## Changes Made

### 1. `test/Manual/C1App/AdminApp-Library/AdminApp_Library_tab_test_cases.md` / `.xlsx`
- **Type:** Modified (both regenerated from the single JSON source)
- **What changed:** 12 cases re-datad and re-worded; `TC_21` reclassified Negative → Edge; new
  *"Revision 2026-08-26"* block in the header; defect table reduced to 2 open defects; new
  *Search semantics — CONFIRMED INTENDED* and *Test data policy* sections in the Product reference;
  counts re-rolled to 16/19/5.
- **Why:** Product-team confirmation + the user's test-data decision.

### 2. `.architecture/product-knowledge/ExperienceApp/admin-library-tab.md`
- **Type:** Modified · **What changed:** §3 rewritten — both behaviours marked CONFIRMED INTENDED
  with a *"do not re-raise"* note, plus the new **ranking rule** box and a **test data policy** box.
  Sources updated with the follow-up session.

### 3. `.architecture/HANDOFF-adminlibrary-manual.md`
- **Type:** Modified · **What changed:** `TC_21` removed from the open-defects table (2 remain);
  new *"✅ Closed 2026-08-26 — confirmed intended, NOT defects"* section carrying the ranking rule;
  *"Still open"* narrowed to the two usability gaps; total line updated to 16/19/5.

### 4. This walkthrough — appended (not overwritten), per the append-per-session rule.

## Verification

Regenerated both artefacts from the one JSON source and re-ran the cross-check:
**40 rows both sides · S.No. 1–40 sequential · 16 P / 19 E / 5 N · 39 Not Run + 1 Blocked · all 40
IDs present in the `.md` · no stale "18 Edge / 6 Negative" text left anywhere.**

## Protected Files Touched

**None.** The temporary generator was again copied to `tooling/_genLibrary.tmp.js` and deleted after use.

## Pending / Follow-up

Unchanged from session 1, **minus** the two search questions (now closed). Still open:

1. `TST_LIBR_TC_9` (no sort-direction indicator / no `aria-sort`) — **decided 2026-08-26: valid
   concern, RECORDED AS A REMARK, deliberately not filed as a defect yet.** Evidence re-captured live
   (full outerHTML byte-identical before and after a click; zero child elements, so no icon exists).
   Revisit before sign-off; the accessibility half is the stronger argument if it is later raised.
2. `TST_LIBR_TC_18` (the `(N)` count vanishes during search) — **decided 2026-08-26: valid gap,
   RECORDED AS A REMARK, not filed as a defect.** Weaker than `TC_9` (no accessibility dimension).
   Carries an automation note: never assert a heading count during a search — there is none.
3. `TST_UMBP_TC_10` (broken Back) and `TST_LIBR_TC_22` (untrimmed whitespace) — to be raised as tickets.
4. `TST_LIBR_TC_30` — **RESOLVED 2026-08-26.** The user supplied `ACJ-DXL-JKR` ("Perf Test School 4",
   zero licences) and confirmed the intended behaviour; verified live that the School licence section
   is **absent entirely**, with no empty-state message. Case unblocked, expected result now verified,
   status Not Run. **Nothing in the batch is Blocked any more.** Bonus finding: the Library product
   list is **catalogue-wide, not licence-driven** — both schools show the same 970 products.
5. The remaining `[ASSUMED]` items (§5 of the handoff). **`TST_UMBP_TC_9` (single-component
   rendering) was reviewed 2026-08-26 and ACCEPTED as a low-risk gap** — none found among 970
   products, the list does not expose component counts, so it is confirmed opportunistically at
   execution rather than hunted for now. **`TST_UMBP_TC_8` (when the activation summary appears)
   was also reviewed 2026-08-26 — rule still UNKNOWN, deliberately not chased.** The case asserts
   the line only on `r55multicomponent`; a warning was added never to assert it is always present.
   **`TST_UMBP_TC_5` (5 classes shown vs 106 on the school) was reviewed 2026-08-26 — reason still
   UNKNOWN, not chased**, since exploring the dialog risks the irreversible add-to-class action. A
   warning was added never to assert a class count; the case asserts dialog structure only.
6. The "generate the register from one source" ADR question — still undecided.
7. Suite split and build order **decided** this session: **two suites**, **Library tab first**.

---

## Session 2 addendum — assumption review (2026-08-26)

Walked the five `[ASSUMED]` items with the user, one at a time. Outcome: **two resolved by live
verification, three consciously accepted** — and the review itself produced a new defect and a
correction to an existing case.

| # | Assumption | Outcome |
|---|---|---|
| 1 | Zero-licence School licence state | ✅ **RESOLVED** — user supplied `ACJ-DXL-JKR` ("Perf Test School 4", 0 licences). Verified live: the section is **absent entirely**, no empty-state message. `TST_LIBR_TC_30` **unblocked**. |
| 2 | Single-component product rendering | ⏸️ **Accepted as low-risk** — none found among 970 products; the list does not expose component counts. Confirm opportunistically at execution. |
| 3 | When `N out of M components activated` appears | ⏸️ **Rule unknown, not chased.** Case asserts the line only on `r55multicomponent`; warning added never to assert it is always present. |
| 4 | 5 classes shown vs 106 on the school | ⏸️ **Reason unknown, not chased** — exploring the dialog risks the irreversible add-to-class action. Warning added never to assert a class count. |
| 5 | Long-title visual wrap | ✅ **RESOLVED by measurement** — see below. |

### Three findings from verifying assumption 5

1. **`TST_LIBR_TC_29` verified.** The School licence tile wraps a 55-character title correctly:
   3 lines at ~1046 px, 2 lines at 400 px, `overflowsTileRight` and `textOverflowsOwnBox` both
   false at each width. Previously `[ASSUMED]` on the strength of a `word-wrap` class alone.

2. **NEW DEFECT — `TST_LIBR_TC_31` (appended, nothing renumbered).** The **main product-list rows
   do not wrap.** At a 385 px document width the page `scrollWidth` was **607 px** with **22
   elements** past the right edge, so the whole page scrolls sideways.
   **Root cause:** `span.item-text` has `word-break: normal` (only `overflow-wrap: break-word`),
   while the licence tile's title has `word-break: break-word`. The two are styled inconsistently.
   Found *because* the tile was verified first — the contrast is what exposed it.

3. ⚠️ **A shared-school product was RENAMED mid-batch.**
   `testumbrellabundleverylongnametocheckwrappingoftext` →
   `testumbrellabundlevery_longname_tocheck_wrapping_oftext`, within two days. **15 references**
   across the register were updated. The product id in the URL (`testumbrellabundle`) was
   unaffected.

   This is direct evidence for the test-data policy adopted earlier in the session: the shared
   school mutates under us, so search cases use automation-owned `vm_automation_*` products and
   third-party titles are treated as `<PLACEHOLDER>`, re-read at run time.

### Totals after this review

**41 TCs — 16 Positive · 19 Edge · 6 Negative · 41 Not Run · 0 Blocked · 3 `[ASSUMED]` remaining.**

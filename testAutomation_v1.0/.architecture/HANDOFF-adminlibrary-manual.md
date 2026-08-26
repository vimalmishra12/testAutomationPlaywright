# HANDOFF — Admin App Library tab, manual design → automation

> Context primer for **starting automation** of the Library-tab manual cases.
> Written 2026-08-24 at the end of the design session. **Read this INSTEAD of the session
> transcript.** Deeper detail lives in
> `.architecture/walkthroughs/walkthrough_AdminApp_Library_tab_test_cases_2026-08-24_18h-19m.md`
> and in `product-knowledge/ExperienceApp/admin-library-tab.md`.

---

## 0. Start here tomorrow

1. Read the mandatory architecture set (`CLAUDE.md` §MANDATORY) — including
   `product-knowledge/ExperienceApp/admin-shared.md` **Part A + Part B** (automation needs both)
   and the new **`product-knowledge/ExperienceApp/admin-library-tab.md`**.
2. Use the repo skill **`c1-test-authoring`** from
   `D:\testAutomation\QATestAutomation\.agent\skills\` — **not** the bundled `qa-test-automation`
   plugin skill, and not the worktree's copy.
3. Read the manual register:
   `test/Manual/C1App/AdminApp-Library/AdminApp_Library_tab_test_cases.md` (+ `.xlsx`).
4. **Answer §8 first** — several questions change what gets automated and in what order.
5. Then §7 — suggested first actions.

**Nothing is automated yet.** This is a design-only handoff: 41 cases exist on paper, 0 in code.

---

## 1. What this work is

Automating the manual cases designed from `Requirement.xlsx` (sheet header *"Library tab"*,
4 scenarios), which live in `test/Manual/C1App/AdminApp-Library/`.

| | |
|---|---|
| Total cases | **41** — 16 Positive · 19 Edge · 6 Negative |
| Statuses today | **41 Not Run** · 0 Blocked · 0 Pass |
| `[ASSUMED]` expected results | **3** — see §5 |
| Source workbook | `C:\Users\Compro\Downloads\Requirement.xlsx` (**not** in the repo) |
| Branch | `claude/admin-tab-test-cases-5b3fc9`, worktree `admin-classes-automation-4711b5` |

### The 4 source scenarios

| # | Scenario (verbatim) | Cases |
|---|---|---|
| 1 | Verify Sort feature | `TST_LIBR_TC_2–9` (8) |
| 2 | Verify See Materials for an umbrella product - All types of components | `TST_UMBP_TC_1–10` (10) |
| 3 | Verify School licence appear in school licence section | `TST_LIBR_TC_23–31` (9, incl. the added responsive-layout defect TC_31) |
| 4 | Verify search by title | `TST_LIBR_TC_10–22` (13) |
| — | Library tab load *(added, not in source)* | `TST_LIBR_TC_1` (1) |

### Modules → page objects

Module codes were chosen from the **future page objects** (AGENTS.md Rule 6), so — as with the
Students and Staff batches — **no re-mapping is owed**. Automate onto these names.

| Manual module | Cases | Page object to create | Screens |
|---|---|---|---|
| `LIBR` | `TST_LIBR_TC_1–31` | `schoolLibrary.page.js` | Library tab: list, sort, search, School licence section |
| `UMBP` | `TST_UMBP_TC_1–10` | `umbrellaProduct.page.js` | Product materials view: components, Add to a class |

---

## 2. Environment

| | |
|---|---|
| Env | `thor` — `https://micro-nemo.comprodls.com` |
| **School** | **`FCN-CHZ-PDA`** = "3 July Test School 1", org slug `org_perf_testschool_1` |
| **Second school** | **`ACJ-DXL-JKR`** = "Perf Test School 4", org slug `org_perf_testschool_4` — **zero school licences**. Used by **`TST_LIBR_TC_30` only** `[added 2026-08-26]` |
| Login | `testt1@mailsac.com` — password in `testcaseData/ExperienceApp/thor/logindata.json` → `C1.login.user.schoolAdmin` |
| Run mode | **headed** — as with the other admin suites; verify before relying on headless |
| State at capture | 970 products · 3 school licences · left-nav read `Library(970)` |

⚠️ **Select the school BY KEY, never by name or card position** — two schools share the display name
"3 July Test School 1" (`admin-shared.md` §0).

### Routes

```
LIBRARY tab            /admin/admin/org_<slug>/library        left-nav qid aDetail-5
product materials view /dashboard/teacher/org_<slug>/bundle/<productId>/view
```

Note the product view leaves the admin app for the **teacher** dashboard route.

---

## 3. Side effects — all 41 cases are safe

**No case in this batch creates, deletes or mutates data.** That was a deliberate design constraint,
so the whole batch can sit in a side-effect-free suite.

Two mutating paths were found and **deliberately stopped short of**:

| Path | Why it was not exercised |
|---|---|
| Component **activation** (`Activate` / `Re-activate`) | Changes the school's entitlement for every teacher and student, irreversibly, on a shared school. `TST_UMBP_TC_7` asserts the **controls and status text only.** |
| **Add to a class** — completing the action | Mutates the shared school. `TST_UMBP_TC_5` stops at the dialog and asserts its heading, input and the disabled `Add to Class` button. |

**Keep it that way** unless a dedicated school is provisioned. If activation is ever automated, it
needs its own school and its own suite.

---

## 4. Defects found at design time — automate these as expected-versus-actual

These are **written as failing-by-design cases**: the Expected Result states the correct behaviour,
then records the ACTUAL. Do not "fix" the case to match the product.

| TC | Defect | Priority |
|---|---|---|
| `TST_UMBP_TC_10` | **"Back" on the product view loses the school context.** Requests `/admin/admin//library` — org slug **missing**, doubled slash — which does not resolve, so the app redirects to `/admin/admin/dashboard` ("My school accounts"). Reproduced twice, two products, scripted **and** real click. | **High** |
| `TST_LIBR_TC_22` | **Whitespace-only search is not trimmed** — 3 spaces → 0 results, banner shows raw spaces. | Low |
| `TST_LIBR_TC_31` | **Long titles in the product LIST do not wrap.** At a 385 px document width the page `scrollWidth` was 607 px and 22 elements overflowed — the page scrolls sideways. The School licence tile wraps correctly (`word-break: break-word`); the list row does not. Found 2026-08-26. | Medium |

### ✅ Closed 2026-08-26 — confirmed intended, NOT defects

The product team confirmed both search behaviours are deliberate. `TST_LIBR_TC_21` was
**reclassified Negative → Edge**; `TST_LIBR_TC_19` keeps its type. Both stay as test cases because
they describe non-obvious behaviour automation must not contradict.

| TC | Confirmed behaviour |
|---|---|
| `TST_LIBR_TC_21` | The search is **deliberately fuzzy** — close matches follow the true title matches. Even an exact full title returns a tail (`vm_automation_book101` → 10 results, not 1). |
| `TST_LIBR_TC_19` | Multi-word terms are **OR-matched**, so adding a word broadens the search (`vm_automation` → 22, `vm_automation testing` → 29). |

> **🔑 What to automate instead — the ranking rule.** Substring matches **always rank above** the
> fuzzy tail, and the exact typed title ranks **1**. Held for every term tried on 2026-08-26.
> ✅ *"all substring matches present and in the leading positions"* ·
> ❌ never *"every result contains the term"* · ❌ never a result **count**.
> ⚠️ Sorting discards the relevance order — assert ranking **before** sorting.

### Acknowledged, recorded as remarks — NOT raised `[user decision, 2026-08-26]`

**Both stay as test cases and are revisited before sign-off. Neither is filed as a defect.**

`TST_LIBR_TC_9` — the sort control gives no direction indicator. Confirmed a **valid concern**, but
deliberately **not filed as a defect yet**; it is carried in the case's Remarks and revisited before
sign-off. Evidence: the link's full HTML is byte-for-byte identical before and after a click (zero
child elements, so no icon exists; `aria-sort` absent). The **accessibility half** — a screen-reader
user cannot learn the sort direction at all — stands on its own, separate from the visual-design
question, and is the stronger argument if it is later raised.

`TST_LIBR_TC_18` — the `(N)` count vanishes while a search is active, so the user cannot see how
many products matched (`vm_automation` returns 22; the page never says so). Recorded as a valid but
**weaker** gap than `TC_9` — no accessibility dimension, purely convenience.

> ⚠️ **Automation consequence:** never assert a heading count while a search is active — there is
> none. Assert the banner text, and count the rendered rows if a number is needed.

> ⚠️ **`TST_UMBP_TC_10` has a direct automation consequence.** Any suite that opens a product
> **must re-navigate via the school card** afterwards. It cannot rely on `Back`, and it cannot
> recover by deep-linking the class route (`admin-shared.md` §A1).

---

## 5. `[ASSUMED]` items — confirm during Phase 1

> ✅ **Resolved 2026-08-26 — the zero-licence state.** The user supplied `ACJ-DXL-JKR`
> ("Perf Test School 4", zero licences) and confirmed the behaviour, which was then verified live:
> when a school holds no licence the **School licence section is absent entirely**, with no
> empty-state message. `TST_LIBR_TC_30` is **unblocked**, its expected result is verified, and it is
> the **only case in the batch that runs on a different school** — it must set its own context.
>
> **Bonus finding:** the Library product list is **catalogue-wide, not licence-driven** — both
> schools list the same 970 products despite holding 3 licences and 0 respectively.

| # | What | Where | How to resolve |
|---|---|---|---|
| 2 | **Single-component** product rendering | `TST_UMBP_TC_9` | **Accepted as a low-risk gap** `[user decision, 2026-08-26]` — none found among 970 products and the list does not expose component counts, so **do not spend time hunting**. Confirm opportunistically when a single-component product turns up |
| 3 | Why `N out of M components activated` appears on `r55multicomponent` but **not** on `testumbrellabundle` (15 components, several unactivated) | `TST_UMBP_TC_8` | **Rule unknown, not chased** `[user decision, 2026-08-26]`. The case asserts the line only on `r55multicomponent`, where it is verified. ⚠️ Never assert it is always present, and never treat its absence elsewhere as a defect — that would be a false failure |
| 4 | The Add-to-a-class dialog showed **5** classes on a school with **106** (and 2330 pre-rendered hidden options) | `TST_UMBP_TC_5` | **Reason unknown, not chased** `[user decision, 2026-08-26]` — the dialog was not scrolled or searched because the next click adds material to a real class irreversibly. ⚠️ Never assert a class count; assert the dialog's structure instead |

---

## 6. Automation traps — read before capturing a single selector

Full detail in `admin-library-tab.md` §8; the cross-screen ones are now in `admin-shared.md` §B2/§B3.

1. **`t-prd-cmp-cntr-1` is shared by EVERY component tile** — 12 identical qids on one product,
   15 on another. **The qid cannot address one component.** Select structurally by index or by text.
2. **`t-prd-umb-dd-1` is shared by 2330 pre-rendered class options**, all hidden until the
   Add-to-a-class dialog opens. A presence/count check is a **guaranteed false green** (§B2).
   Use `isDisplayed` / `waitForDisplayed`.
3. **`aLibrary-4-<n>` product rows are positional** over ~970 rows — **look the row up by title on
   every use**, never cache the index (§B3).
4. **The Clear link is `aClass-99`** — a *Classes-tab* qid on the Library tab. A selector sweep
   scoped to `aLibrary-*` will miss it.
5. **The row is the accessible control, not the "See materials" anchor.** The row is
   `div[role="navigation"][tabindex="0"]` with `aria-label="See <title>"`; the inner anchor is
   `aria-hidden="true" tabindex="-1"`.
6. **The sort control cannot tell you the direction** — assert **list order**, never the control's
   class or text (they are byte-identical in both states).
7. **`Back` breaks the school context** — re-navigate via the school card (§4).

### Three Classes-tab habits that do NOT hold here

| Behaviour | Classes tab | **Library tab** |
|---|---|---|
| Sort collation | **code point** | **case-insensitive** |
| Search persistence | persists server-side, survives reload + re-login | **not persisted** |
| Lazy loading | page size 20, "Load more" removed when exhausted | **none — all 970 render at once** |

### Measured timings — do not inherit, re-measure

| Transition | Measured (Thor, 2026-08-24) |
|---|---|
| Full list render, 970 products | **~5.1 s** |
| Search settle | **~1.0 s** (1032 ms) |
| Product materials view load | **~6 s** |

### No capped fields

Neither the Library search box nor the dialog's `Search classes` input has a `maxlength`. **There is
no boundary case to write** — stated explicitly rather than left as a silent gap (`admin-shared.md`
§A3).

---

## 7. Suggested first actions

1. **Answer §8** — questions 1 and 2 change the suite split and the batch order.
2. **Phase 1 build, `LIBR` first** — `schoolLibrary.page.js`, covering `TST_LIBR_TC_1–22`
   (tab load + sort + search). This is the highest-value, lowest-risk block: entirely read-only,
   one page, no cross-page navigation, and it exercises the two defects that are cheap to assert
   (`TC_21`, `TC_22`).
3. **Then `TST_LIBR_TC_23–30`** (School licence section) on the same page object. **`TC_30` is now
   runnable** — but it needs the school context set to **`ACJ-DXL-JKR`**, not `FCN-CHZ-PDA`, so give
   the page object a school-key parameter rather than hard-coding one school.
4. **Then `UMBP`** — `umbrellaProduct.page.js`, `TST_UMBP_TC_1–10`. Budget extra time: this is where
   the shared-qid trap and the `Back` defect live, and every case needs the school-card
   re-navigation workaround.
5. **Capture selectors live via Playwright MCP** — do not author them from this document.
   `admin-shared.md` §B1's sweep exists because inferred selectors cost `adminClassesTab` ~15 runs.
6. **Register the block in `authoring-status.md`** and mark it ⚠️ until it has actually been
   executed — not ✅.

---

## 8. Open questions for you

Grouped by what they block. **Questions 1–2 change what I build; 3–6 change what gets raised as a
defect; 7–8 are process.**

### Blocks automation

1. **Suite split — one suite or two?** All 41 cases are side-effect free, so they *could* be one
   suite. But `UMBP` leaves the admin app for the teacher dashboard route and needs the school-card
   re-navigation workaround after every product. My recommendation: **two suites**
   (`P1AdminLibraryTab_Thor` for `LIBR`, `P1AdminLibraryProduct_Thor` for `UMBP`) so a `UMBP`
   navigation failure cannot mask a `LIBR` assertion. Agree?
2. **Batch order** — I've proposed `LIBR` list/sort/search → `LIBR` licence → `UMBP` (§7).
   Would you rather front-load `UMBP`, since it carries the High-priority defect?

### Blocks raising tickets

3. **Is the fuzzy search intended?** (`TST_LIBR_TC_21`) A control labelled *"Search by title"*
   returning `bundleallcomps` for `Compass` reads as a bug to me, but relevance-ranked search is a
   deliberate choice in some products. Do you want this raised, or is it known/by design?
4. **Is OR-matching on multi-word terms intended?** (`TST_LIBR_TC_19`) Adding a word *broadens* the
   search, which is the opposite of what most users expect. Same question — bug or design?
5. **Should the sort direction indicator and the missing search count be raised?**
   (`TST_LIBR_TC_9`, `TST_LIBR_TC_18`) Both are real gaps; both may be deliberate. The `aria-sort`
   absence in `TC_9` is an accessibility issue regardless of the visual design decision — worth
   raising on its own?
6. **The `[mn] [acPZ-EQTo]` square brackets** in the Add-to-a-class dialog — is that the intended
   `[name] [key]` display format, or a template escaping bug? I recorded it in Remarks rather than
   as a case because I could not tell.

### Process

7. **Should the register be generated from one source as standard?** I authored all 41 cases into a
   single JSON and emitted both the `.md` and the `.xlsx` from it, with a read-back verification of
   every cell — because these two files have drifted on past batches. It worked, but the generator
   lives in the scratchpad and was not committed. Options: (a) leave it as a one-off; (b) commit it
   under `tooling/`; (c) add a `create` mode to `tooling/xlsxRegister.js` and make this the standard
   for every future manual batch. I'd suggest **(c)** — but it touches shared tooling, so it's
   your call, and it wants an ADR.
8. **Can a dedicated school be provisioned?** `TST_LIBR_TC_30` no longer needs it (resolved with
   `ACJ-DXL-JKR` on 2026-08-26), but the ask still stands for `TST_GCAT_TC_4` / `TST_GSCL_TC_4`
   (max categories / max scales) from the earlier batches, and it remains the only way component
   **activation** ever gets automated. Two blockers plus activation, one fix.

---

## 9. Files this session touched

| File | Type |
|---|---|
| `test/Manual/C1App/AdminApp-Library/AdminApp_Library_tab_test_cases.md` | Created — 41 TCs |
| `test/Manual/C1App/AdminApp-Library/AdminApp_Library_tab_test_cases.xlsx` | Created — 40 rows × 14 cols |
| `.architecture/product-knowledge/ExperienceApp/admin-library-tab.md` | Created — new feature-area file |
| `.architecture/product-knowledge.md` | Modified — index row |
| `.architecture/product-knowledge/ExperienceApp.md` | Modified — 2 index rows |
| `.architecture/product-knowledge/ExperienceApp/admin-shared.md` | Modified — §A2, §A4, §B2, §B3 |
| `.architecture/walkthroughs/walkthrough_AdminApp_Library_tab_test_cases_2026-08-24_18h-19m.md` | Created |
| `.architecture/HANDOFF-adminlibrary-manual.md` | Created — this file |

**No protected file was modified. No code was changed. Nothing was committed** — the branch is left
with these as working-tree changes for your review.

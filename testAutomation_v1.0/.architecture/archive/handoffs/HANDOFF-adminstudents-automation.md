# HANDOFF — Admin App Students tab, manual design → automation

> Context primer for **starting automation** of the Students-tab manual cases.
> **SUPERSEDED — 2026-08-28.** This is the design-only handoff written at the end of the manual
> design session on 2026-08-22. It is kept for history. For anything current, read
> **`HANDOFF-adminstudents-automation-2026-08-28.md`** instead: the SLST block is now automated
> and passing, and three of this file's conclusions (the activation checkbox, the no-results
> defect, and "one mixed-activation school unblocks all three Blocked cases") have been corrected.

> Context primer written 2026-08-22 at the end of the design session.
---

## 0. Start here on Monday

1. Read the mandatory architecture set (`CLAUDE.md` §MANDATORY) — including
   `product-knowledge/ExperienceApp/admin-shared.md` **Part A + Part B** (automation needs both)
   and the new **`product-knowledge/ExperienceApp/admin-students-tab.md`**.
2. Use the repo skill **`c1-test-authoring`** from
   `D:\testAutomation\QATestAutomation\.agent\skills\` — **not** the bundled `qa-test-automation`
   plugin skill, and not the worktree's copy.
3. Read the manual register:
   `test/Manual/C1App/AdminApp-Students/AdminApp_Students_tab_test_cases.md` (+ `.xlsx`).
4. Then §7 below — suggested first actions.

**Nothing is automated yet.** This is a design-only handoff: 59 cases exist on paper, 0 in code.

---

## 1. What this work is

Automating the manual cases designed from `AdminApp_Student Tab.xlsx` (23 scenarios), which live in
`test/Manual/C1App/AdminApp-Students/`.

| | |
|---|---|
| Total cases | **59** — 32 Positive · 17 Edge · 10 Negative |
| Statuses today | 56 **Not Run** · 3 **Blocked** · 0 Pass |
| `[ASSUMED]` expected results | **10** — listed in the register's *Open items* section |
| Source workbook | `C:\Users\Compro\Desktop\Admin Automation\AdminApp_Student Tab.xlsx` (**not** in the repo) |

### Modules → page objects

Module codes were chosen from the **future page objects** (AGENTS.md Rule 6), so unlike the
`BCCF` → `CCLS` mismatch on the Classes batch, **no re-mapping is owed** — automate onto these names.

| Manual module | Cases | Page object to create | Screens |
|---|---|---|---|
| `SLST` | `TST_SLST_TC_1–25` | `schoolStudents.page.js` | Students tab list, search, sort, user guide, load more |
| `SPRF` | `TST_SPRF_TC_1–22` | `studentProfile.page.js` | View profile, Manage learner profile, individual activation, removal |
| `SBLK` | `TST_SBLK_TC_1–12` | `bulkStudents.page.js` | Add new / add existing students, bulk activation |

---

## 2. Environment

| | |
|---|---|
| Env | `thor` — `https://micro-nemo.comprodls.com` |
| **School** | **`FCN-CHZ-PDA`** = "3 July Test School 1", org slug `org_perf_testschool_1` |
| Login | `testt1@mailsac.com` — password in `testcaseData/ExperienceApp/thor/logindata.json` → `C1.login.user.schoolAdmin` |
| Run mode | **headed** — as with the other admin suites; verify before relying on headless |

⚠️ **Select the school by KEY, never by name or card position** — two schools share the display name
"3 July Test School 1" (`FCN-CHZ-PDA` and `ZPB-TWP-AEQ`), and card `qid`s are positional.

⚠️ **A CustomerGauge NPS survey can block the school-card click.** `<cg-survey id="cg-survey-popup">`
appeared unprompted during this session and failed a click with *"intercepts pointer events"*. Any
suite starting at `/dashboard` must dismiss or tolerate it. This is new — it is not in the Classes
suites' handling.

**Playwright MCP** is used for live selector capture. Its session expires often; a human must sign
in — Claude cannot type the password.

---

## 3. Routes — the Students tab spans THREE microfrontends

This is the biggest structural difference from the Classes work. Crossing between them is a **full
page load**, not an Angular route change.

```
admin       /admin/admin/org_<slug>/learner                       Students tab
            /admin/admin/org_<slug>/learner/select/new            new-student chooser
            /admin/admin/org_<slug>/learner/adult-select/new      adult sub-chooser
            /admin/admin/org_<slug>/learner/select/existing       existing-student chooser
            /admin/admin/org_<slug>/bulk_activation               bulk activation
            /admin/admin/org_<slug>/edit-user-profile/<orgUuid>/<userId>   manage learner profile
class       /class/teacher/org_<slug>/profile/<orgUuid>/<userId>  student profile
            /class/teacher/org_<slug>/class/<uuid>/view/classdata class page (from profile)
dashboard   /dashboard/teacher/org_<slug>/activateMaterial/<userId>/admin  individual activation
```

The **profile URL is deep-linkable** within a session whose school context is already set — unlike
`/admin/admin/org_<slug>/class`, which returns `/dashboard/error`. Cold-session behaviour is
`[ASSUMED]`; confirming it is cheap and worth doing early.

---

## 4. ⚠️ Traps — read before capturing a single selector

Full detail in `admin-students-tab.md` §4. The ones that will cost you a run:

1. **Row menu items are pre-rendered once per row.** 26 students meant **26** hidden
   `View student profile` links — and **all 26 share the same `qid`**. `getElementCount(x) > 0` is a
   guaranteed false green (`admin-shared.md` §B2). Filter on visibility, always.
2. **Row identifiers are positional** (`aLearner-15-<index>`) and shift with sort, search and Load
   more. Resolve a row by its content, then act on it.
3. **The user guide toggle is a DIFFERENT element in each state** — collapsed and expanded carry
   different identifiers. A page object bound to one breaks the other half of the toggle test.
   (The panel itself *is* genuinely removed from the DOM when collapsed — one of the few admin
   containers that is.)
4. **The Email/Username column's `sorted ascending`/`sorted descending` text is NOT inside the
   header button**, unlike the other two columns. Reading the button's own text returns the bare
   label. Scope to the header row. `[exact node still to be confirmed]`
5. **The adult new-account chooser and the existing-student chooser share identifiers**
   (`adultCreateInvite-1..4`). Assert URL or heading to know which screen you are on.
6. **The Password tab injects a whole Gigya screen-set** — dozens of extra hidden `profile.*`,
   `password`, `username` inputs appear. Never select by `name=` alone there. It also appends a
   one-time `?pwrt=<token>&apiKey=<key>` to the URL — **never commit a captured token**.
7. **Gigya validation copy is empty in the DOM until triggered** — it cannot be free-captured like
   the Angular dialogs. Provoke it (a weak password is safe and non-mutating).
8. **Search is submit-driven** — clicking Search is required; typing alone does nothing. Settles
   ~1–2 s.
9. **Sort collation is by code point, not locale.** A `localeCompare` expectation is wrong.
10. **`Load more ...` is REMOVED from the DOM when exhausted**, not disabled. Assert absence.

---

## 5. Suite split — decide this before writing tests

`c1-test-authoring` keeps side-effect-free suites apart from data-creating ones. The split is
already worked out:

| Suite | Cases | Notes |
|---|---|---|
| **Side-effect free** (safe, run freely) | all `SLST` except `TC_25`; `SPRF` 1–7, 9, 11, 15, 16, 17, 18, 21; `SBLK` 7, 8, 10 | ~40 cases. Start here — this is most of the value with none of the risk. |
| **Mutates / creates real data** | `SLST_TC_25`; `SPRF_TC_8` (password), `10`/`12`/`13` (personal info), `14` (**consumes a real activation code**), `19`/`22` (removal); `SBLK_TC_1–5`, `11`, `12` | Separate suite. Must own its data. |
| **Sends real email** | `SBLK_TC_3`, `SBLK_TC_5`, and the removal report from `SPRF_TC_19` | Use mailsac/yopmail addresses only. |

**Sweepable prefix for anything this work creates: `AutoStudent_`** (extends the list in
`admin-shared.md` §A7).

⚠️ **Never remove a student the suite did not create.** Removal is destructive, asynchronous, and
reported only by email — there is no in-app confirmation to wait on.

---

## 6. Outstanding work — the things that are NOT done

### (a) CSV fixtures — 7 files, none written
`manual-test-standard.md` requires the **exact downloaded template headers**; the templates were not
downloaded during design, so writing them from memory would be a guess. **Download `Get CSV
template` on each bulk screen first**, then write, alongside the register:

```
TST_SBLK_TC_1_children.csv
TST_SBLK_TC_2_adults_username.csv
TST_SBLK_TC_3_adults_email.csv
TST_SBLK_TC_4_existing_username.csv
TST_SBLK_TC_5_existing_email.csv
TST_SBLK_TC_11_bulk_activation.csv
TST_SBLK_TC_12_malformed.csv
```

The child/adult CSV pages themselves are already documented from the NEMO-24306 work in
`product-knowledge/ExperienceApp.md` — reuse that, including its verified validation messages,
rather than re-deriving them.

### (b) Three cases Blocked at design time
Recorded **Blocked** with reason and unblock in their Comments cells — do not silently flip them to
Not Run.

| Case | Why | Unblock |
|---|---|---|
| `TST_SLST_TC_14` | The activation checkbox has **no observable effect** on FCN-CHZ-PDA — identical 26 results ticked and unticked | A school with **mixed** code-activation states |
| `TST_SPRF_TC_3` | **No adult-with-username account** on this school (25 adults w/ email, 1 child w/ username) | Run `TST_SBLK_TC_2` to create one, or target another school |
| `TST_SPRF_TC_20` | The 50-student removal cap needs **51+** students; the school holds 26 | A larger school. Modal copy is **already verified verbatim**, so this is short work |

**One larger school with mixed activation states would unblock all three.** Worth asking for.

### (c) Ten `[ASSUMED]` expected results
Listed in the register's *Open items* table. Every one is a state that could not be reached without
mutating a shared school, consuming a real code, sending real email, or a fixture the school lacks.
Resolve them **deliberately during Phase 1** — do not inherit them into passing tests.

### (d) No boundary case for First name / Last name
Neither field carries a `maxlength`, so there is no boundary to test until someone measures the
server-side limit. **Measure it during Phase 1, then add the case** — do not invent a number.

### (e) Nothing is committed
The design work sits in the worktree `local-origin-sync-check-de1e76`. Files added/changed:

```
A  test/Manual/C1App/AdminApp-Students/AdminApp_Students_tab_test_cases.md
A  test/Manual/C1App/AdminApp-Students/AdminApp_Students_tab_test_cases.xlsx
A  test/Manual/C1App/AdminApp-Students/{students-no-results,profile-blank,
     bulk-activation-i18n-key,activate-invalid-code}.png      ← defect evidence
A  .architecture/product-knowledge/ExperienceApp/admin-students-tab.md
A  .architecture/walkthroughs/walkthrough_adminStudentsTab.test.js_2026-08-22_20h-50m.md
A  .architecture/HANDOFF-adminstudents-automation.md           ← this file
M  .architecture/product-knowledge.md                          (feature-area map)
M  .architecture/product-knowledge/ExperienceApp/admin-shared.md  (§A2, §A5, §A6, §B2)
```

---

## 7. ⚠️ Four known defects — do NOT "fix" these in automation

These are **product** defects found during design, each written as an expected-versus-actual case
with a screenshot alongside the register. When the automation fails on them, that is the test
working. Do not add a workaround, and do not soften the expected result.

| Case | Defect | Evidence |
|---|---|---|
| `TST_SLST_TC_12` | A no-results search renders **nothing** — table removed, no empty-state message — with `TypeError: … reading 'length' at o.search` from the admin bundle. The Classes tab shows a proper message. | `students-no-results.png` |
| `TST_SPRF_TC_7` | `View student profile` for **Vandna Garg** hangs on an infinite spinner; `getUserDetailWithClasses` returns **HTTP 500**. Student-specific. Two faults: the 500, and no client-side error handling. | `profile-blank.png` |
| `TST_SBLK_TC_9` | The bulk-activation **success dialog renders three raw i18n keys** (`ADMIN.LEARNER.BULK_ACTIVATION.SUCCESS_MODAL_INFO_1/2/3`). Will be user-visible on the first successful bulk activation. | pre-rendered DOM |
| `TST_SBLK_TC_10` | Untranslated keys in **accessible names** — `…SELECT_STUDENT` (sr-only label) and `SCREEN_READER.PROCESSING_MESSAGE` (individual activation). | `bulk-activation-i18n-key.png` |

**Raise these with the product owner** — they were not in Jira as of 2026-08-22.

Smaller observations, noted but not written as cases: the disabled Location field showing the literal
`undefined`; a whitespace-only search entering the banner state; `occured` (sic) in the bulk error
dialog; and the invalid-activation-code error blaming the server rather than the code.

---

## 8. ⚠️ One scenario needs a PRODUCT DECISION before it can be automated

**Source scenario #15** — *"Verify umbrella details page launch from view profile page (click on
umbrella name) — clicking Back should return to previous page."*

The umbrella name on a student profile is a **plain `<span class="bundle-title">` with no link or
button anywhere in its ancestry**. Confirmed on **both** a child profile and an adult profile. There
is no route from the profile to an umbrella details page by this path.

`TST_SPRF_TC_18` records it expected-versus-actual. **Ask before automating:** is the link missing
(defect), or does the scenario describe a route that does not exist on this screen (scenario error)?

> This is the same class of mistake as the historic *"click a listed class"* cases
> (`admin-shared.md` §A8.1) — caught this time at design time rather than weeks later.

---

## 9. Fixtures on FCN-CHZ-PDA (verified 2026-08-22)

| Purpose | Student |
|---|---|
| Adult with email | `Marvin Jae student` · nonmqastudent5@mailsac.com |
| Adult, email with special characters | `Learner Learner` · shivampilot04+Taylor&%^$wift@gmail.com |
| Adult with umbrellas incl. **Code expired** | `Learner us` · testps27@mailsac.com |
| Child with username, 2 umbrellas, 2 classes | `child1 test` · cqatestaichild1 |
| Profile that returns HTTP 500 (defect fixture) | `Vandna Garg` · vandna.garg+11student@comprotechnologies.com |

**26 students at capture — 25 adults with email, 1 child with a username.** The school is **shared
and actively mutated by other teams**: never assert an absolute count (`admin-shared.md` §A5).

---

## 10. Suggested first actions on Monday

1. **Confirm the three questions in §11** — they change what gets built.
2. **Phase 1 reconnaissance sweep** (`admin-shared.md` §B1) on the Students tab, capturing selectors
   into `C1Selectors.json`. Most of the product-side recon is already done and written up in
   `admin-students-tab.md` — you are capturing selectors and measuring transitions, not re-deriving
   behaviour.
3. **Build `schoolStudents.page.js` and automate the side-effect-free `SLST` block first**
   (~22 cases, no data risk). It exercises search, sort, user guide and load more — and it will
   immediately prove or disprove traps 1–4 and 8–10 in §4.
4. **Then `SPRF` read-only** (profile layout, Back, class launch, the 500 case, the umbrella case).
5. **Leave `SBLK` and the mutating cases until last** — they need the CSV templates from §6(a) and a
   decision on the data-owning suite.
6. Update the register's Status/Actual Result cells **only via `npm run register`**
   (`tooling/xlsxRegister.js`), never by hand-patching the zip, and never while the workbook is open
   in Excel. Roll up the header summary from the rows when you do.

---

## 11. Open questions for the user

1. **Can we get a dedicated (or larger) school** with 51+ students and mixed code-activation states?
   One school unblocks all three Blocked cases.
2. **Scenario #15 (umbrella link)** — defect, or scenario error? See §8.
3. **Are the four defects in §7 to be raised in Jira**, and by whom, before automation starts?
4. **Is a spare activation code available** for `TST_SPRF_TC_14` / `TST_SBLK_TC_11`? Codes are
   single-use, so each run of those cases consumes one.

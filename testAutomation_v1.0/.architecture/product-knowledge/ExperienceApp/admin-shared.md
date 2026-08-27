# Admin App (school-admin) — Shared Knowledge

> **What this is.** Everything that is true of **every** Cambridge One Admin App screen, so a new
> admin tab starts from ~80% known behaviour instead of from zero. Per-screen detail lives in its
> own file; this one holds only what generalises.
>
> **Living document.** Append, never overwrite. Mark anything not confirmed on the live app
> `[ASSUMED]`. Date significant updates `[YYYY-MM-DD]`. Corrections are written as corrections
> (strike the old claim and say why), never silently edited — someone may already have read it.
>
> **Seeded [2026-08-21]** by promoting the Phase 1 admin programme's session records
> (`P1Admin*` suites, 2026-08-14 → 08-21) into durable knowledge. Sources listed at the end.

---

## How to use this file

| Your task | Read |
|---|---|
| Writing **manual test cases** from scenarios | **Part A** + the per-screen file, with `manual-test-standard.md` |
| **Phase 1 build** — capturing selectors, authoring a page object | **Part A + Part B** + the per-screen file |
| **Phase 2 run/fix** — debugging a failure | **Part B** first (§B2–B7 explain most admin failures) |
| **Phase 3 visual** | **§B10** — the verdict is settled, cite it |

**Part A = product behaviour** (what a user sees; feeds manual design).
**Part B = automation traps** (what the DOM does; feeds automation).

---

## 0. Scope and environment

**Application:** Cambridge One Admin App (NEMO microservice) · **Role:** school-admin
**Thor:** `https://micro-nemo.comprodls.com` · **Login:** `testt1@mailsac.com`
(password in `testcaseData/ExperienceApp/thor/logindata.json` → `C1.login.user.schoolAdmin`)

**Schools used by the admin suites**

| Key | Display name | Org slug | Notes |
|---|---|---|---|
| `FCN-CHZ-PDA` | 3 July Test School 1 | `org_perf_testschool_1` | **Primary.** Shared and mutated by other teams |
| `ZPB-TWP-AEQ` | 3 July Test School 1 | — | **Same display name.** This is why selection is by key |
| `MQA-ABC-DEF` | MQA Sierra School | — | The login account's own home school. Used for **capture only**, 2026-08-17/18 |
| `ACJ-DXL-JKR` | Perf Test School 4 | `org_perf_testschool_4` | **Holds ZERO school licences** — the only known zero-licence school. Used by `TST_LIBR_TC_30` to verify the empty School licence state `[2026-08-26]` |

> **No suite targets MQA today** — all four `schoolKey` values in
> `schoolAdminAddClassData.json` read `FCN-CHZ-PDA` `[verified 2026-08-21]`. This corrects
> `authoring-status.md`, which still claims `adminAddClassBulk`'s key "points here now (not
> FCN-CHZ-PDA)". It was moved back; the status file is stale.

> ⚠️ **Always select a school by KEY, never by name or card position.** Two schools share a display
> name, and card `qid`s (`aDashboard-N`) are positional. `[2026-08-14, re-confirmed 2026-08-18]`

**Run mode:** the admin suites were run **headed** during Phase 1 — headless wanted a Playwright
browser build not installed on that host (wanted 1228, had 1223) `[2026-08-18]`. The `P1Admin*`
npm scripts do **not** carry `--headless=false`, so the default applies; verify before relying on
either. `[ASSUMED — not re-checked since]`

---
---

# PART A — Product behaviour
*Read this when writing manual test cases.*

## A1. Navigation map

```
Login  →  My school accounts  (/admin/admin/dashboard)
             └─ school card (a.inst-link, key in aria-label)
                  └─ School <name>  →  Classes tab   (/admin/admin/org_<slug>/class)   ← default tab
                       ├─ left nav: Classes · Students · Staff · Library · Reports
                       ├─ Add class            → /class/create   "Create new classes" (bulk form)
                       ├─ class row → launch   → /class/teacher/org_<slug>/class/<uuid>/view
                       │      └─ Actions menu  → Class grade settings  (/grade-weighting)
                       │                       → Delete class          (shares the same menu)
                       └─ School settings ▾    → Manage grading categories (/manage-grading-categories)
                                               → Manage grading scales     (/grading-scales/manage)
```

> **The school context must be set by clicking the school card.** Deep-linking straight to
> `/admin/admin/org_<slug>/class` returns `/dashboard/error` **even when authenticated**. Always
> go via `/dashboard` and click through. `[2026-08-17]`

> **School settings** is the entry to both school-level grading pages, and it lives on the class
> page / Classes tab — not on the school card. It is **absent from the grading details pages**,
> so those cannot be recovered from by re-opening the menu. `[2026-08-19]`

> **Correction `[2026-08-27]` — School settings has THREE items, not two.** The note above
> predates the discovery of **Change school key** (`adEdit-2`), which sits above the two grading
> entries (`adEdit-7` categories, `adEdit-8` scales). The qid numbering is **not**
> contiguous — `adEdit-3` / `adEdit-4` are the change-key dialog's Continue / Cancel
> buttons. Never iterate the `adEdit-*` family.

## A2. Coverage so far

| Screen | Manual module | Automation module | Where its knowledge lives |
|---|---|---|---|
| Create new classes (bulk form) | `BCCF` | **`CCLS`** | [`admin-create-classes-form.md`](admin-create-classes-form.md) |
| Manage grading categories | `GCAT` | `GCAT` | [`admin-grading-categories.md`](admin-grading-categories.md) |
| Manage grading scales | `GSCL` | `GSCL` | [`admin-grading-scales.md`](admin-grading-scales.md) |
| **Students tab** (list, search, sort, user guide, load more) | `SLST` | `SLST` | [`admin-students-tab.md`](admin-students-tab.md) |
| **Student profile / manage account / individual activation** | `SPRF` | `SPRF` | [`admin-students-tab.md`](admin-students-tab.md) |
| **Bulk student operations** (add new / add existing / bulk activate) | `SBLK` | `SBLK` | [`admin-students-tab.md`](admin-students-tab.md) |
| **Staff tab** (list, search, sort, user guide, load more) | `STFL` | `STFL` | [`admin-staff-tab.md`](admin-staff-tab.md) |
| **Staff profile / admin rights / removal** | `STFP` | `STFP` | [`admin-staff-tab.md`](admin-staff-tab.md) |
| **Bulk staff invitations** (Add new teachers to classes) | `STFB` | `STFB` | [`admin-staff-tab.md`](admin-staff-tab.md) |
| **Library tab** (list, sort, search, School licence section) | `LIBR` | `LIBR` | [`admin-library-tab.md`](admin-library-tab.md) |
| **Product materials view** ("See materials", components, Add to a class) | `UMBP` | `UMBP` | [`admin-library-tab.md`](admin-library-tab.md) |
| Classes tab (list, search, sort, filter, expand, user guide, load more) | `CLST` | `CLST` | [`admin-classes-tab.md`](admin-classes-tab.md) |
| **Reports tab** (list, Create report flow, report types) | `MRPT` | `MRPT` | [`admin-reports-tab.md`](admin-reports-tab.md) |
| Class grade settings | `CGST` | `CGST` | [`admin-class-grade-settings.md`](admin-class-grade-settings.md) |
| Grading scale / category **details** pages | — | `GSCL` / `GCAT` | [`admin-grading-details-pages.md`](admin-grading-details-pages.md) |
| Bulk new account creation via CSV upload | — | `NEMO24306` | [`admin-bulk-account-csv.md`](admin-bulk-account-csv.md) |
| Class management (label / delete / count) | `CMGT` | — not automated | *(none yet)* |
| Clone ("Copy an Existing Class" as a class op) | `CLON` | — not automated | *(none yet)* |
| Context class | `CTXC` | — **blocked**, no entry point found | *(none yet)* |
| **Shell chrome** (admin header Help menu, language switcher, tab nav) | `ASHL` | `ASHL` | **§A9/B11 below** — new page object |
| **Footer** (shared with the wider C1 app) | `FOOT` | `FOOT` | **§A9/B11 below** — existing `footer.page.js`, `TST_FOOT_TC_1..9` |
| **Notifications** (bell + panel) | `INVI` | `INVI` | **§A9/B11 below** — reuses the existing `invitationNotification.page.js` |
| **My profile / Manage profile** | `MYPR` | `MYPR` | **§A9/B11 below** — new page object; cf. the `SETT` module in the other app |
| **Change school key** (School settings) | `SKEY` | `SKEY` | **§A10 below** — new; ⚠️ irreversible |
| **My school accounts / multi-org** | `SADB` | `SADB` | **§A10 below** — extends the existing one-case module |
| **Teacher-view switch / cross-role journey** | `SADB` | `SADB` | **§A11 below** |
| **Institution request wizard** | `SRQS` et al. | `SRQS` | **§A11 below** — already automated except submission |

> **One home now.** `[2026-08-21]` The ADR-020 migration is complete — every admin screen's
> knowledge lives in its own file in this folder, and `../ExperienceApp.md` is an index. The
> earlier "look in both places" note is retired.

> **Note the `BCCF` → `CCLS` mismatch.** Manual module codes are invented per manual batch;
> automation module codes come from the **page object** (AGENTS.md Rule 6). When these disagree the
> mapping survives only as prose in Remarks cells. **Pick manual module codes that will survive** —
> name them after the page object the screen will get. `[lesson, 2026-08-14]`
>
> **The Students batch applied that lesson** `[2026-08-22]`: `SLST` / `SPRF` / `SBLK` were named
> after the page objects those screens will get (`schoolStudents`, `studentProfile`,
> `bulkStudents`) **before a single case was written**, so no re-mapping is owed. First time the
> manual and automation module codes will agree from the start.

## A3. Field constraints — read before writing any boundary case

**None of these appear in the manual test cases.** They were all found by automation failing.

| Screen | Field | Constraint | Verified |
|---|---|---|---|
| Create new classes | Class name | `maxlength=50`; pattern requires alphanumeric (`---` is rejected) | 2026-08-14 |
| Manage grading categories | Category name | `maxlength=50` | 2026-08-18 |
| Manage grading scales | Scale title | **`maxlength=20`** | 2026-08-19 |
| Manage grading scales | Grade (band) name | `maxlength=20` | 2026-08-19 |
| Manage grading scales | Band From % / To % | `maxlength=3` | 2026-08-19 |
| Class grade settings | Weightage | `Please enter a number 0-100`; over-total → `Your weighting choices exceed the maximum of 100%` | 2026-08-20 |
| Create new classes | End date | Days on/before the start date are disabled in the picker | 2026-08-14 |
| Create new classes | End-date year picker | **Caps at 2036** — every later year disabled | 2026-08-20 |

> **Coverage gap:** GSCL has **no** boundary manual case for its 20-character title, while GCAT has
> one for its 50-character field. Worth adding. `[flagged 2026-08-19, not written]`

## A4. Async behaviour and persistence a user can observe

- **Class creation is asynchronous.** The success dialog says creation *"can take up to 12 hours"*.
  Measured on a responsive Thor: dialog ~5 s, class visible in the Active list **~24 s**; on a
  loaded Thor it exceeded **90 s**. **The active-class count does not increment immediately** — the
  success dialog is the verification, not `count + 1`. `[2026-08-14 / 2026-08-20]`
- **Class delete is soft** (restorable). The app itself says *"This will take a few minutes… may
  show on dashboards for a few minutes."* `[2026-08-14]`
- **The applied class Filter persists SERVER-SIDE, per user account** — survives reload, logout /
  login, and a different browser or device. **`[CONFIRMED INTENDED — product decision 2026-08-17]`.
  Do not raise as a defect.**
- **The class Search term persists the same way** — verified by a full page reload returning still
  narrowed to one class. `[2026-08-17]`
- **Sorting does NOT persist** across a page load (unlike filter and search). `[2026-08-17]`
- **The Create-new-classes form auto-saves and RESTORES a draft** — across runs *and* sessions. It
  is **not empty on load**. `[2026-08-14, re-confirmed 2026-08-18]`
  - The **only** path that returns a genuinely empty form is **"Create more classes"** on the
    success dialog. Everywhere else the draft repopulates. `[2026-08-18]`
- **Search is submit-driven, not live** — typing alone does not filter; the Search button click is
  required. Settles ~1.0–1.2 s. Case-insensitive and partial-matching. `[2026-08-17]`
- **Class sort collation is by CODE POINT, not locale**: `(` < `A` < `S` < `T` < `c` < `t`, and
  `test Class 14 aug 2` sorts before `testClass1` (space before `C`). A `localeCompare` expectation
  is wrong against this product. `[2026-08-17]`
- **The Ended classes section is collapsed on load and renders nothing until expanded** — and its
  `(N)` count is fetched **with the rows**, so while collapsed the heading is a bare
  "Ended classes" with no number. `[2026-08-17]`
- **The class list lazy-loads**, page size **20**; "Load more" is **removed** from the DOM when
  exhausted (not disabled). `[2026-08-17]`
- **Bulk CSV upload POPULATES the form — it does not create classes.** Clicking "Create N classes"
  remains the only creation gate, so CSV-upload cases are side-effect free. `[2026-08-18]`
- **The Library tab breaks three Classes-tab habits** `[2026-08-24]` — see
  [`admin-library-tab.md`](admin-library-tab.md) §3. Its sort is **case-insensitive**, not by code
  point; its search **does NOT persist** across reload (the Classes search does); and it has **no
  lazy loading at all** — all 970 products render at once, with no "Load more". Its search is also
  **fuzzy, not a substring match**, so "every result contains the term" is an assertion that fails
  against the live product. **Do not inherit a Classes-tab expectation onto a new admin tab without
  re-verifying it.**
- **Class grade settings: Total and Save update on BLUR, not per keystroke.** Mid-edit the page can
  show `Total grade: 100%` with Save enabled while the real total is 600%. A case that types and
  immediately checks the total will report the validation as broken. `[2026-08-20]`

## A5. Shared-environment constraints — what makes a case *Blocked at design time*

`FCN-CHZ-PDA` is **shared and actively mutated by other teams**. Its active-class count moved
25 → 27 → 32 during a single capture session `[2026-08-20]`. Consequences for manual design:

- **A case whose precondition is "the school is at its maximum" cannot run here.** Holding the
  school at its cap would break every other suite. `TST_GCAT_TC_4` (max categories) and
  `TST_GSCL_TC_4` (max scales) are both **Blocked** for this reason — write them, mark them
  Blocked with the reason, do not mark them Not Run. **One dedicated school unblocks both.**
- **"Set as default" (grading scale) is school-wide** — the product's own confirmation says
  *"All newly created classes will be associated with this grading scale"*. Any case exercising it
  must restore the original default.
- **Never write an expected result that asserts an absolute count** on this school.
- **Grading scales and categories on this school belong to other people** — see the never-delete
  list in §A7.
- **The two details pages are NOT symmetric:** the **scale** details page reads `Classes (N)` and
  **includes deleted classes**; the **category** details page reads `Active classes (N)` and does
  not. This is why every category read `Active classes (0)` for weeks — not because no category had
  been applied, but because every class it had been applied to was since soft-deleted. **The
  evidence erases itself.** Do not write one page's case as a mirror of the other's. `[2026-08-20]`
- **Clicking a DELETED class's row link is a dead end** — it drops the school context, lands on
  *My school accounts*, and raises *"Sorry! — The item is not available because the class is no
  longer active"*. That is the product explaining itself, not a defect. `[2026-08-20]`
- **The Students tab adds its own design-time blockers on this school** `[2026-08-22]`: it holds
  26 students (25 adults with email, 1 child with a username), so a case needing an
  **adult-with-username** account, or **51+ students** to hit the 50-student removal cap, is
  **Blocked** here. Student **removal is also destructive and reported only by email** — never run
  it against a student the suite did not create.

## A6. Verified copy, `[ASSUMED]` copy, and the free-capture trick

> **Almost every admin dialog is pre-rendered in the DOM before it is ever triggered** (see §B2).
> **Its copy can therefore be captured word-for-word WITHOUT reaching the state that raises it.**

This has already resolved three `[ASSUMED]` expected results at zero data cost:

| What | How it was captured without triggering it |
|---|---|
| Max-grading-categories limit modal | Pre-rendered on the Manage page `[2026-08-18]` |
| Max-grading-scales limit modal | Pre-rendered on the Manage page `[2026-08-19]` |
| Class-creation success dialog + both its links | Pre-rendered before any class was created `[2026-08-18]` |
| All 3 Students-tab removal dialogs (confirm, 50-student cap, async notice) | Pre-rendered on the Students tab `[2026-08-22]` |
| All 11 bulk-activation dialogs | Pre-rendered on `/bulk_activation` — **this is how the untranslated success-dialog keys were found before anyone ran a bulk activation** `[2026-08-22]` |
| "Save changes?" unsaved-changes dialog | Pre-rendered on Manage learner profile `[2026-08-22]` |

**Do this first on any new admin screen** — it turns `[ASSUMED]` expected results into verified
ones before a single test runs, and costs nothing.

**Copy verified live so far** (assert verbatim; compare through a whitespace-squash on both sides —
the product renders blank lines that a naive `\s+→' '` capture flattens `[2026-08-19]`):

| Where | Text |
|---|---|
| Manage categories `h1` | `Manage grading categories` |
| Manage categories description | `Create (or remove) grading categories for your school. Categories can then be applied to a class on the class grade settings page` |
| Category details, empty | `Active classes (0)` · `The category has not been added to any active classes` |
| Class search, no results | `No classes that match your search <term>` — **echoes the term** |
| Filter, no results | `No classes that are <status>, <label>` |
| Create success dialog | `Success! We are now creating 1 class for you` |
| Grade settings validation | `Your weighting choices exceed the maximum of 100%` · `Please enter a number 0-100` |
| Class status values | **Ended / Expired / Deleted** (the manual doc originally recorded only "Expired") |

## A7. Data lifecycle, fixtures, and the never-delete list

**Sweepable prefixes** — anything automation creates uses one of these, so leftovers from a crashed
run are recognisable and removable:

`AutoClass_` · `AutoCat_` · `AutoScale_` · `BulkCSV_` · `Fixture_` · `AutoStudent_` · `AutoStaff_`

**Which suites create real classes** `[verified against the exec files, 2026-08-21]`

Creating classes is **deliberate** where it happens — those suites exist to prove creation works
end to end. The point of this table is not to flag a problem, it is so you know **what accumulates
on the shared school and under which name**.

| Suite | Creates per run | By design? | Removed afterwards? |
|---|---|---|---|
| `P1AdminClassGradeSettings_Thor` | `AutoClass_CGST` ×1 | yes — needs a live class to configure | ✅ deletes by URL in a suite-level `After`, and sweeps before creating |
| `P1Adminclassworkflow_Thor` | `AutoClass_CreateOnly` + `AutoClass_CreateMore` (2) | yes — covers both success-dialog exits, which need one creation each | no — accepted; they accumulate |
| `P1AdminclassBulkCreateCSV_Thor` | `BulkCSV_Class1` + `BulkCSV_Class2` (2) | **yes — this is the requirement.** The suite verifies the full CSV path *through creation*: template download → upload → **Create 2 classes** → success dialog → back to dashboard | no — accepted; they accumulate |
| `P1AdminclassBulk_Thor`, `P1AdminclassValidation_Thor`, `P1AdminClassesTab_Thor` | none | side-effect free by design — the bulk suite uploads a CSV but deliberately **stops before Create** | n/a |

> **Two CSV upload tests exist and they are NOT duplicates.** The bulk suite proves *"upload
> populates the form"* (no creation); the BulkCreateCSV suite proves *"upload leads to real
> classes"* (creation is the point). Do not "fix" either by making it match the other.

> ⚠️ **They use names that differ by ONE underscore — check before writing any sweep**
> `[2026-08-21]`:
>
> | Suite | Data node | CSV fixture | Names inside | Ever created? |
> |---|---|---|---|---|
> | `P1AdminclassBulk_Thor` | `adminAddClassBulk` | `TST_CCLS_TC_19_bulk_classes.csv` | `BulkCSV_Class_1` / `_2` | **no** |
> | `P1AdminclassBulkCreateCSV_Thor` | `adminAddClassBulkCreateCSV` | `BulkUploadCSV - Class_creation_form_template.csv` | `BulkCSV_Class1` / `2` | **yes** |
>
> Each suite is internally consistent, so nothing is broken. The trap is that the name which *looks*
> more official — `BulkCSV_Class_1`, matching the `<TST_ID>_<description>` fixture convention — is
> the one that **never reaches the school**, while the plainer `BulkCSV_Class1` is what actually
> accumulates. A sweep or a manual search written for `BulkCSV_Class_` finds nothing and reports
> clean. **Always match on `BulkCSV_` alone.**

**Permanent fixture — do not delete:**

| Name | Key | Why it exists |
|---|---|---|
| `Fixture_GradeSettings_DO_NOT_DELETE` | `62k3-AXm6` | The only class on the school with course material **and** a category + scale applied, so the populated details-page DOM can be re-captured without re-deriving the state. **Used by no test.** Start Aug 20 2026, end Dec 31 2036. `[2026-08-20]` |

> ⚠️ **Also documented in `ExperienceApp.md` §"Data notes — the permanent fixture class"** (material
> `dev_test_ebook_bundle_104_bundle`, grade settings 70/30, and why the `AutoClass_CGST` sweep does
> not collide with it). **Two places, so they can drift** — if this fixture ever changes, update
> both, or collapse them into one when the per-screen split happens. `[noted 2026-08-21]`

Two constraints found while creating it: **2036 is the product's ceiling** for the end-date year
picker, and **the start date must stay in the past** — a future start makes the class `Not started`,
and the category details page counts *active* classes only, so the fixture would silently stop working.

**Never delete — these belong to other people:**
`Cambridge One grading scale` (the platform default) · `new Grading Auto` ·
`new catagory` · `new Grading Category` · `some`

**Soft delete means leftovers accumulate forever.** Every past `AutoClass_CGST` run leaves another
soft-deleted row on the grading scale's details page permanently. Duplicate class names already
exist on this school from exactly this cause. `[2026-08-20]`

## A8. Rules for writing admin manual test cases

1. **A document written against an empty state is a hypothesis, not a spec.** Proven twice:
   *"click a listed class"* was wrong in both `GCAT_TC_7` and `GSCL_TC_7` (the class name is plain
   text; the row's only control is a dedicated "Class grade settings" link) — written by someone who
   had only ever seen a details page with zero classes. Also *"Cancel does not reset the form"* was
   wrong — Cancel raises a confirmation modal nobody had looked for. **Ground every case on a
   POPULATED state, or mark the expected result `[ASSUMED]`.** `[2026-08-20]`
2. **Read `maxlength` on every field before writing boundary cases** (§A3).
3. **Mark shared-environment blockers at design time** (§A5) — Blocked with a reason, not Not Run.
4. **Choose module codes that will survive automation** — name after the future page object
   (AGENTS.md Rule 6), not the manual batch (§A2).
5. **Capture dialog copy from the pre-rendered DOM** before writing `[ASSUMED]` (§A6).
6. **Keep the `.md` and the `.xlsx` in sync, and roll up the summary block.** They drifted
   repeatedly; the header summary once sat stale at "55 of 81" for a whole session while per-row
   statuses had moved on. Use `npm run register` (`tooling/xlsxRegister.js`) — it verifies every
   write by reading the saved file back and refuses to run while the workbook is open in Excel.
7. **Structure** — one area folder under `test/Manual/<App>/<Area>/`, holding
   `<Name>_test_cases.md` + `<Name>_test_cases.xlsx` (both required) plus any CSV fixtures named
   `<TST_ID>_<short_description>.csv`.

---
---

# PART B — Automation traps
*Read this before capturing selectors or debugging a failure.*

## B1. Reconnaissance sweep — run this on any new admin screen, in ONE capture pass

Ten minutes here replaces multiple debug rounds. Every item below caused a real failure in Phase 1.

- [ ] **Count `.modal-content` (and any dialog root) present in the DOM** with nothing open (§B2)
- [ ] **Identify the page-scoping component tag** — and check singular vs plural (§B9)
- [ ] **List every positional id** on rows / menus / bands / modals (§B3)
- [ ] **Read `maxlength` on every input** (§A3)
- [ ] **Which buttons are "disabled" by CSS class only**, with no native `disabled` (§B4)
- [ ] **Which containers persist in the DOM when closed**, and which are genuinely removed (§B2)
- [ ] **Does the list lazy-load?** page size? is "Load more" removed or disabled? (§A4)
- [ ] **Measure the 2–3 key transitions** — never inherit a number (§B8)
- [ ] **Capture pre-rendered dialog copy now**, while it is free (§A6)

## B2. Pre-rendered DOM — presence never proves state

**This is the norm on admin screens, not the exception.**

| Screen | Permanently-present elements |
|---|---|
| Manage grading categories | **4** `.modal-content` (create, max-limit, generic error, remove-confirm) |
| Manage grading scales | **4** `.modal-content` (set-default, generic error, max-limit, delete-confirm) |
| Class grade settings | **11** modals, all `display:none` |
| Classes tab | `#classSortFilterModal` stays in the DOM when closed; **two** `<empty-class-state>` nodes (active visible, ended hidden) |
| Grading category rows | Row menu items are permanent — with 3 categories and no menu open: **3 "See details" present, 0 visible** |
| Create-classes form | The label dropdown is rendered **once per row**, each with a full copy of every label (~87 on MQA, ~15 on FCN) |
| Create-classes success dialog | Present and hidden **before any class is created** |
| Students tab | Row menu items pre-rendered **once per row** — 26 students meant **26** hidden `View student profile` links, all sharing one identifier; plus 3 removal `.modal-content` `[2026-08-22]` |
| Bulk activation | **11** `.modal-content`, all hidden `[2026-08-22]` |
| Product materials view (Library) | **2330** class options in the Add-to-a-class dialog, all hidden until it opens — **and all sharing the single qid `t-prd-umb-dd-1`** `[2026-08-24]` |
| Manage learner profile → Password | A whole **Gigya screen-set** injects dozens of extra hidden `profile.*` / `password` / `username` inputs `[2026-08-22]` |

**Consequences**

- Any `getElementCount(x) > 0` check on these is a **guaranteed false green**. Use `isDisplayed` /
  `waitForDisplayed`. This exact trap silently broke `reset_filters` for weeks `[2026-08-15]` and
  reappeared in `getData_filterOptions().modalDisplayed` `[2026-08-21]`.
- **`opacity: 0` is still VISIBLE to Playwright** — only `display:none` counts as hidden. A "closed"
  wait must budget the whole fade-out (measured 3.6 s on the filter panel), not the class change.
- Scope every modal selector with `:has(...)` to one specific modal.

**The three places where presence IS truthful** (do not "fix" these by symmetry):

| Element | Behaviour |
|---|---|
| `.message-banner-panel-wrapper` | Genuinely removed from the DOM when not showing (polled 20 s) |
| User guide panel | Genuinely removed when collapsed — unlike the row-details panel |
| Default grading scale's row menu | Genuinely **omits** Set-as-default and Delete (count 0 is a truthful assertion here, and a false green one page over) |

## B3. Positional ids that get re-issued

A positional id is **not** a stable selector (Invariant 2). Found independently on four screens:

| Id family | Trap | Remedy |
|---|---|---|
| `checkbox-1`, `checkbox-2`, … (row select) | Re-issued as rows are added/removed — row 1 is **not** reliably `#checkbox-1`. Root cause of recurring "row checkbox is not clicked" failures in two TCs | Match structurally: `input[type=checkbox][name^='checkbox-']` |
| `gradingCategoryActionLink-<n>` | Not keyed by name, and **the list is sorted alphabetically** so a new row lands anywhere | Look the row index up **by name on every use**; never cache it |
| `manageGradingScaleLinkDropDown-<n>` | Same | Same |
| `#class-label-list-modal-<rowIndex>` | Per-row container | Scope label selectors to `#class-label-list-modal-0` |
| `dBulkClass-add-learning-material-modal-1-0` | Hardcoded positional index; stops resolving when the draft's row count changes | Still hardcoded — known live risk |
| Grading-scale **band rows** | Re-index when a middle band is added: `0/1` becomes `0/1/2`, so "Lowest is index 1" silently writes into the wrong band | Address the lowest row as `count - 1`, never a literal |
| `dBulkClass-<row>-<col>` | Fine, but row 2+ must be verified, not inferred | Verified live |
| `aLibrary-4-<n>` (Library product rows) | Positional over ~970 rows; the row — not the inner "See materials" anchor — is the accessible control `[2026-08-24]` | Look the row up **by title on every use** |
| `t-prd-cmp-cntr-1` (product components) | **NOT positional — every component tile carries the SAME qid** (12 on one product, 15 on another). It cannot address one component `[2026-08-24]` | Select structurally by index, or by the component's text |
| `aClass-99` (Library "Clear" link) | A **Classes-tab** qid living on the **Library** tab. A selector sweep scoped to `aLibrary-*` misses it `[2026-08-24]` | Do not assume a screen's controls all share its qid family |

> **Also:** an unscoped `a.dropdown-item` on the create form matched the **header profile menu** —
> up to **885 elements**. Scope container-level selectors to their modal. Other page objects may
> carry the same page-wide `.dropdown-item` pattern; **not audited.** `[2026-08-20]`

## B4. Buttons "disabled" by CSS class only

No native `disabled` attribute, so **a click before Angular settles silently no-ops with no thrown
error**. The only observable signal is that nothing happened.

Known instances: **Apply changes** (Edit teachers modal) · bulk-toolbar **Start date** / **End date**.

**Pattern: single click + a generous wait on the observable outcome.** Never a retry-click loop — a
second click while the first is still processing risks double-applying the action. `[2026-08-18]`

## B5. Typing into Angular forms

- **`fill()` / `setValue` are ignored** by these forms — use `clearValue` + `addValue`
  (`pressSequentially`). Setting `.value` programmatically fires nothing at all.
- **Keystrokes get dropped, and sometimes duplicated.** Observed: the teacher-email field applied
  `…mailsac.co` instead of `…com`; the category-name field lost **10 of 28** characters on one run
  and 1 of 28 on the next; the material search once produced `ddev_test_ebook_bundle…` (duplicated
  first character). The missing characters never arrive — a 5 s poll never converged.
- **Therefore: type, read the value back, and retry until it matches.** This is currently
  hand-written in four page objects (`set_teacherEmail`, `set_categoryName`, `set_title`,
  `select_material`). **Promotion to `baseActionLibrary` as `addValueVerified()` is the durable
  fix** — protected file, needs confirmation.
- **The read-back is also the diagnostic.** It is what distinguishes an automation race (a
  different number of characters lost each run) from a client-side cap (**exactly** 20 characters
  every time → `maxlength`, our data problem, not a defect — Invariant 14). Add a fail-fast: two
  top-ups that move nothing should stop immediately with *"field stopped accepting input at N
  characters"* rather than burning the full budget. That single change took one suite from
  **3 minutes to 58 seconds**. `[2026-08-19]`
- **Click a combobox / type-ahead field before typing.** It opens its dropdown on focus/click. A
  panel that persists between TCs often leaves the field **already focused**, so no fresh focus
  fires — the first selection of a run succeeds and every later one fails. `[2026-08-15]`
- **Blur the last field.** `set_band` blurred each input by moving to the next, but the final one
  stayed focused, so a form using `updateOn:'blur'` never received its value and Save stayed
  disabled. Commit it with a Tab. `[2026-08-19]`
- **Bootstrap custom-control checkboxes must be clicked via their `<label>`** — the
  `label.custom-control-label` overlays the input and intercepts pointer events, so clicking the
  input times out. `[2026-08-18]`

## B6. Optimistic UI — the app signals ready before it is

**This is the single largest source of admin-suite failures.** Twelve instances found in Phase 1,
one root cause. Always wait on the thing that actually changed, never on its announcement.

| Where | Wrong signal | Right signal |
|---|---|---|
| Filter panel close | element count | visibility (`display:none` persists ~3.6 s) |
| Sort direction | the sr-only "sorted ascending" label (flips ~90–120 ms) | **row content fingerprint** (re-orders 1.2–3.2 s) |
| Row details expand | container visible (Playwright sees it mid-animation) | a **content** element inside it |
| Row details counts | first `.font-weight-bold` | the whole panel's text |
| Ended classes count | read on load | read **after expanding** — it is fetched with the rows |
| Success banner | "a banner exists" | the banner **says the expected copy** (the previous one lives ~15 s) |
| `isInitialized()` | anchor element rendered | the framework's **state settled** (Save's disabled binding runs after render) |
| Material catalogue | the filtered item appearing | the **catalogue arriving** — see below |
| CSS-disabled buttons | the click returning | the observable outcome (§B4) |
| Filter panel X close | click + geometric stability | the close **handler being bound** — not observable; needs a settle |
| Copy-from class search | input visible | the **default result list rendered** before typing |
| Grade settings Total / Save | keystroke | **blur** |

> **The one that cost five runs.** The Add-materials modal's **loading state renders the words
> "No search results"** — word-for-word identical to a genuinely empty result. Opening the modal
> fires one `POST …/products` returning the whole catalogue (~800 options); filtering afterwards is
> **client-side, measured at 1 ms**. The test was typing into an empty catalogue, and no amount of
> waiting on the filtered item could help. Fix = **two different waits**: `waitForExist` 60 s for
> the catalogue (a server call — `waitForExist` not `waitForDisplayed`, because before typing the
> options are in the DOM but invisible: 808 present, 0 visible), then 5 s for the filtered match.
> **A long wait aimed at the wrong signal hid the real bug.** `[2026-08-20]`

## B7. State isolation on a shared, persistent app

- **Reset in `BeforeEach`, not only `AfterEach`.** Filter and search persist **server-side**, so
  they survive the browser entirely — a crashed run poisons the next run days later on a different
  machine.
- **Cleanup that would erase a TC's evidence belongs in `BeforeEach` or a suite-level `After` —
  never `AfterEach`** (ADR-019). The mochawesome screenshot is taken in a **root** `afterEach`, and
  mocha runs root hooks **last**, so a suite `AfterEach` sweep fires *before* the screenshot. This
  silently made the evidence for seven search/filter TCs worthless — showing the full unfiltered
  list — while every test passed. `[found by the user, 2026-08-21]`
- **A TC that opens something and then closes it photographs the closed state.** Split it
  (`TC_2` open / `TC_23` close). Give the close TC assertions strong enough to stand without the
  image, since a closed panel looks identical to one that never opened.
- **`search_class()` is NOT idempotent** — it waits for the class list to **change**, and the term
  persists server-side. Searching the same term twice waits out its full budget and reports
  *"the class search did not settle"* although the search worked. **Clear before every search.**
  This trap was documented, read at session start, and still hit two days later — a known trap only
  helps if it is checked against the code being written. `[2026-08-19 / 2026-08-20]`
- **Sweep BEFORE creating, not only after.** Delete is soft, so a crashed run leaves a live object
  behind and two same-named objects make "the one under test" ambiguous.
- **Never let cleanup depend on the path that breaks.** `TC_9` re-found its class *by searching*;
  when search failed, cleanup failed and a real class was left on a shared school — three times,
  hand-cleaned each time. Record the created object's **URL** at creation and delete via that URL;
  keep the sweep as a fallback only.
- **Never swallow a failure in cleanup.** `action.waitForDisplayed` **returns** the caught error
  rather than throwing (ADR-009), so a `try/catch` around a reset never fires and nothing is logged.
  A `catch` that never runs is not evidence of success — it hid a 20 s stall for three green runs.
- **Suites that create data live apart from side-effect-free suites.** The bulk suite creates
  nothing; the workflow suite creates 2 real classes per run. Keep that separation when adding TCs.

## B8. Measured timings — never re-guess these

| Action | Measured | Date |
|---|---|---|
| Filter panel close after Apply | `show` drops 3.37 s · `display:none` 3.61 s | 2026-08-15 |
| Sort — sr-only label flip | 90–120 ms | 2026-08-17 |
| Sort — rows actually re-order | 1.2–3.2 s | 2026-08-17 |
| Search settle | ~1.0–1.2 s | 2026-08-17 |
| Row-details expand (`collapsing` phase) | ~700 ms | 2026-08-17 |
| Ended rows after expanding | ~1.0 s · count ~0.9 s | 2026-08-17 |
| "Load more" new rows | ~3.5 s | 2026-08-17 |
| Category create — banner + list (same tick) | 1.39 s | 2026-08-18 |
| Category remove — banner + list | 2.17 s | 2026-08-18 |
| Success banner lifetime | ~15 s | 2026-08-18 |
| Material catalogue load / client-side filter | one POST, ~800 options / **1 ms** | 2026-08-20 |
| Class creation → visible in Active list | ~24 s good day · **>90 s** loaded | 2026-08-20 |

**Timeout rules learned here**

- **Never invent a timeout.** A guessed `1000`, copy-pasted 13×, against a measured 3.6 s close
  caused 3 of the 4 original `adminClassesTab` failures.
- **A poll budget set to exactly mocha's `timeout` is useless** — the runner kills the test at the
  same instant the poll expires, so the TC's own diagnostic message is replaced by a generic
  "Timeout of 120000ms exceeded". Made **twice**. Leave headroom.
- **Prefer a SHORT timeout on client-side work.** Failing fast is what surfaced the material bug;
  the 90 s wait hid it for five runs.
- **Label every number**: `measured <date>` or `BUDGET — unmeasured`. Currently unmeasured and worth
  fixing (all three verified in place `[2026-08-21]`):
  `classFilterModal.page.js:314` `browser.pause(800)` · `classGradeSettings.page.js:75`
  `SAVE_TIMEOUT = 20000` (its own comment says *"budget, not measured"*) ·
  `adminClassGradeSettings.test.js:87` `CLASS_APPEAR_TIMEOUT = 100000` — note this one lives in the
  **test file**, not a page object, and sits just under mocha's `timeout: 120000` (`.mocharc.js:24`).
- **Thor throughput varies 4–8× for the same suite** (97 s to 12.5 min observed). This is known and
  accepted — do not raise it as a defect, do not add retries to shared TCs to paper over it, and
  **never tighten a timeout on the strength of one fast run.** `[2026-08-20]`

## B9. `qid` families and page-scoping component tags

**`qid` families by area** — useful for guessing where a new element will sit:

| Family | Area |
|---|---|
| `aDashboard-*` | My school accounts (school cards) |
| `aClass-*` / `iClass-*` | Classes tab and its filter panel |
| `dBulkClass-*` | Create-new-classes bulk form (**and** the Classes tab's Delete button) |
| `adEdit-*` | School settings menu items |
| `cView-*` | Class page (Actions menu) |
| `manageGradingCategories-*`, `gradingCategory-option-*`, `gradingCategoryClass-*` | Grading categories + details |
| `manageGradingScale*`, `gradingScaleDetails-*`, `setDefaultGrading*`, `deleteGradingScale*` | Grading scales + details |
| `gradeW-*` | Class grade settings |

> Casing is inconsistent — the Filter toggle's `qid` is lower-case `aclass-16` while its neighbours
> are `aClass-*`. Do not assume.

**Page-scoping component tags.** Every admin view renders an unclassed `<h1>`, so a bare `h1`
selector silently matches the wrong page. Scope to the view's Angular component tag:

| View | Tag |
|---|---|
| Manage grading categories (list) | `manage-grading-category` — **SINGULAR** |
| Grading category details | `grading-category-classes` |
| Manage grading scales (list) | `manage-grading-scale` — **SINGULAR** |
| Create grading scale | `create-grading-scale` |
| Grading scale details | `grading-scale-details` |

> **Check singular vs plural — this was guessed wrong twice.** `manage-grading-categories` returns
> zero elements. Verify the tag against the live DOM rather than pluralising the page title.
>
> **And the plural DOES exist as something else** `[verified 2026-08-21]` — `#manage-grading-scales`
> is the **element id of the School settings link**, while `manage-grading-scale` (singular) is the
> **component tag** of the page it opens. A grep for "manage-grading-scales" therefore returns a
> real hit that is not the page scope. Match on the tag, not on the string.

## B10. Visual testing — the verdict is settled

**Every Phase 3 assessment completed on an admin screen has reached "no candidates"** — ten
assessments across **five** modules (CLST ×3, CCLS ×2 — the workflow suite and the BulkCreateCSV
suite, GCAT ×2, GSCL ×1, CGST ×2), all for the same structural reason:

> **The Admin App is a poor visual-testing surface by construction.** Every screen frames at least
> one live count, key, date or shared mutable list, and the school is mutated by other suites. A
> baseline here fails on **data churn**, not on UI regression.

Even panels whose own copy is genuinely static (the Filter panel, the user guide, the create-category
modal) fail because a screenshot captures the whole viewport and the live list sits behind them —
consistent precedent, established in the first session and never overturned.

**The one genuine ✅-row candidate** produced so far was `TST_GSCL_TC_5` — it ends on the **create
form**, which does not frame the shared list, and all its data is fixed. It was raised with the user
under AGENTS.md §8 Rule A and **promotion was declined** `[2026-08-19]`. The one unprobed risk was
whether a banner from `BeforeEach`'s sweep can linger onto that form.

> ⚠️ **The area is NOT fully assessed.** Three suites still carry `Phase 3 ⬜ pending` in
> `authoring-status.md` `[checked 2026-08-21]`: **`schoolAdminAddClassValidation`**,
> **`schoolAdminAddClassBulk`**, and the **`schoolAdminAddClass` workflow suite** (its later TCs —
> `TC_20`, `TC_23` — post-date its 2026-08-14 assessment). The expected outcome is the same
> "no candidates", but the assessment is still formally owed and those features are not closed.

**So for a new admin screen:** cite this precedent, and argue only those TCs that end on a **form or
modal with no live list in frame**. Everything else is a ❌ row, which per Invariant 12 means
`visualTest: false` with no user prompt at all.

## B11. Playwright-MCP capture notes

- **Live capture is mandatory, not optional.** `adminClassesTab` was built from a document because
  login was blocked: first run **2/6**, and Phase 2 then took ~15 runs because eight unverified
  guesses surfaced at once and entangled. The same page, captured live the next session:
  **12/12 on the first run, no fixes.** If capture is blocked, that is a **blocker to raise**.
- **A blocked browser is not a blocked framework.** The framework's own login chain kept working
  the same day. `npm run <script> --trace=true` captures full DOM snapshots — exhaust that before
  declaring yourself blocked.
- **The MCP session expires often and a human must sign in** — the agent cannot type a password.
- **If MCP input goes dead — RESTART FIRST.** Symptom: `page.keyboard.type` produces nothing and
  `locator.click()` does not even focus, while JS `.focus()` / `.click()` work fine. Cause is a
  **stale MCP browser process**; restarting Claude Code fixes it. `[verified 2026-08-19]`
  - This corrects an earlier diagnosis that blamed Angular `javascript:void(0)` handlers — wrong.
  - A `--browser chrome → chromium` switch in `.mcp.json` appeared to fix it and did not; `chrome`
    worked again after the restart. **`.mcp.json` is a TRACKED file** — changing it changes
    everyone's setup, so leave it alone.
    > *Correction to the source walkthrough `[verified 2026-08-21]`:* it recorded `.mcp.json` as
    > "tracked despite being listed in `.gitignore`". It is tracked, but **no `.gitignore` rule
    > matches it** (`git check-ignore` returns nothing). Only the "tracked" half was right.
  - A Chrome-vs-Playwright version mismatch was also guessed and was also wrong (both 151.x).
- **An NPS survey (`<cg-survey>`) can render a full-viewport overlay inside a shadow root with no
  close control** — only score buttons and "Next". Answering it submits real feedback and must not
  be automated. Never seen during a suite run, so no workaround exists. If a run ever fails on
  *"element intercepts pointer events"*, check this first. `[2026-08-19]`
- **`tooling/` holds the MCP Chrome profile with a live session — never commit that profile.**
  Two different `tooling/` paths exist and they are ignored differently `[verified 2026-08-21]`:
  - `testAutomation_v1.0/tooling/` — **tracked** (README + dev scripts, AGENTS.md §9); only its
    `playwright-mcp/.profile/`, `screenshots/` and `node_modules/` are ignored.
  - `/tooling/` at the **repo/worktree root** — **now fully ignored** by the root `.gitignore:19`,
    added specifically because a worktree checkout puts it there instead.
  > *Correction to the source walkthroughs:* they flagged the root `tooling/` as **not** ignored and
  > recommended adding the rule. **That fix has since landed** — the rule is in place. The carried-
  > forward warning is resolved. Still stage explicitly rather than `git add -A`.

---

## A9 / B11. Shell chrome — header, footer, language, notifications `[2026-08-27]`

*Captured live on Thor (`testt1@mailsac.com`, My school accounts) while designing the Generic/shell
manual batch (`test/Manual/C1App/AdminApp-Generic/`, modules `ASHL` / `FOOT` / `INVI` / `APRF`). The chrome
below is **persistent on every admin screen**, which is why it lives here rather than in a
per-screen file.*

> **Driving the app through Playwright MCP** `[2026-08-27]`**.** In this session
> `browser_click` was **inert** on this app — the click landed on the correct element and was
> reported as successful, but Angular never reacted, so no dropdown opened and no route changed.
> **A JS-dispatched `element.click()` via `browser_evaluate` works normally**, because Angular
> binds ordinary click listeners. Use that when synthetic clicks appear to do nothing, and **poll
> for the resulting state change** rather than pausing — the tab strip took 1.2–4.3 s to settle.

### Header controls (all pre-rendered, §B2 applies)

| Control | qid | id |
|---|---|---|
| Home logo | `aHeader-2` | — |
| Help dropdown | `cHeader-hlp-2` | `hdr-help-dd` |
| ↳ Help centre | `cHeader-hlp-3` | — |
| ↳ Tutorials | `cHeader-hlp-5` | `dropdownMenuButtonUserTutorials` |
| ↳ Tutorial topics (5) | `cHeader-hlp-6` | — |
| Notifications | `ntf-1` | `tippyDropdownMenuButton` |
| Profile menu | `aHeader-3` | `dropdownMenuLinkHeader` |
| ↳ My profile | `aHeader-6` | — |
| ↳ Log out | `aHeader-7` | — (a `<button>`) |

### ⚠️ NEW TRAP — footer hrefs change with authentication state

Logged **out**, footer links carry real routes (`/terms`, `/privacy`, `/accessibility`,
`/institution-request`). Logged **in**, every internal one collapses to `javascript:void(0);` and
navigation becomes JS-driven.

**Asserting `href` on the logged-in footer is a guaranteed false green** — it passes whatever the
link actually does. Assert the resulting URL instead. This is the same failure shape as the
`getElementCount(x) > 0` trap in §B2, in a different disguise.

`Our approach` is the only footer link keeping a real external href
(`http://www.cambridge.org/english`, `target="_blank"`) in **both** states.

### `cFooter-9` is a duplicated qid — already known and worked around

**`FAQs` and `Cambridge One for schools` both carry `qid="cFooter-9"`**, so a bare qid selector
resolves two different links.

> **Correction `[2026-08-27]`.** This was first written up here as a newly-found defect. **It is
> not new** — `C1Selectors.json` already disambiguates it, and has for some time:
>
> ```
> "footerFAQs": "a[qid=\"cFooter-9\"][aria-label=\"FAQs\"]",
> "footerCambridgeOneSchool": "a[class*=\"insti-btn\"]"
> ```
>
> Follow that existing pattern rather than raising it again.

⚠️ **A second, genuinely unhandled instance of the same shape:** the five Help-menu tutorial topics
all share `qid="cHeader-hlp-6"`. Address them by text or index.

Add to §B3's family: like `t-prd-cmp-cntr-1` and `aClass-99`, **qid is not reliably unique** on
admin screens.

### The admin footer renders 7 of the 8 known links

`cFooter-4` is **Site Feedback** (`footerSiteFeedback` in the FOOT selector set) and `cFooter-8` is
unused. The C1 footer therefore carries eight links, but **the ADMIN footer renders only seven —
Site Feedback is absent.**

> **Correction `[2026-08-27]`.** An earlier version of this section called `cFooter-4` and
> `cFooter-8` both "unused" and read the numbering as an off-by-one. `cFooter-4` is in active use;
> it is simply not rendered in the admin app. The absence is the finding — pinned by
> `TST_FOOT_TC_10`.

### ⚠️ EXCEPTION to §B2 — the notifications panel is NOT pre-rendered

Every other admin dialog can be read from the DOM before it is triggered (§A6). **The notifications
panel cannot.** It is built lazily by tippy.js and no `[data-tippy-root]` / `.tippy-box` container
exists until the bell is clicked. **The free-capture trick does not work here** — the panel must
actually be opened.

**The bell is already automated.** `invitationNotification.page.js` targets this exact control as
`notificationBtn` (`#tippyDropdownMenuButton`), and `TST_INVI_TC_1..6` cover the
**invitation-accept** flow reached through it. They do **not** cover the general notification panel.
Extend `INVI` rather than inventing a new module. `[2026-08-27]`

#### Panel structure — captured live `[2026-08-27]`

| Part | Selector | Detail |
|---|---|---|
| Panel | `.notification-dropdown` | anchored to the bell |
| Heading | `.notification-heading h2` | `Notifications (92)` — count in `span.readCount`, matches the badge |
| Close | `[qid="ntf-2"]` | ⚠️ **two visible elements share this qid** — `.close` and `.close-dummy` |
| Time group | `p.time-related-title` | `Last Seven days` · `Older` |
| Row | `button.tippy-dropdown-item` | qids `ntf-30`…`ntf-34` — **positional, based at 30** |
| Footer link | `a[qid="ntf-4"]` | `See older notifications` |

- **Only 5 rows render against a heading of 92**, and the body does not scroll. The rest are
  reachable only via *See older notifications*. **No mark-as-read control exists in the panel.**
- ⚠️ **Row qids are positional AND based at 30**, not 1 — do not infer the base index (§B3).
- **Date format depends on the time group:** relative under *Last Seven days* (`5 days ago`),
  absolute under *Older* (`Mon, 17 Aug, 2026` — `Ddd, DD Mmm, YYYY`). A single
  date-format assertion across all rows will fail.
- **The empty state has NOT been seen** — this account holds 92. Still `[ASSUMED]`.

**Notification copy, verbatim:**

| Title | Body |
|---|---|
| `Your Class summary report is ready` | `View your report, available to download in the Reports tab` |
| `Your Aggregated data report is ready` | `View your report, available to download on the Reports page` |
| `Class summary report generation failure` | `Sorry, something went wrong. The Class summary report you requested failed to generate. Details available in the Reports tab` |

⚠️ Note **"Reports tab" vs "Reports page"** between the two ready-notifications — a copy
inconsistency, pinned by `TST_INVI_TC_11`. Assert per notification type, not one shared string.

### Site language / Spanish

- Trigger `qid="sp-ldd-cntr"`, accessible name `Site language, English`.
- Exactly **two** options: `English` (`sp-ldd-btn-en`), `Español` (`sp-ldd-btn-es`).
- The active option is marked by the CSS class **`selected-item`** — check the class, not styling.
- The control sits in the **header** when logged out, the **footer** when logged in.
- **No Spanish copy has been verified anywhere yet** — treat every Spanish expected string as
  `[ASSUMED]` until a live pass captures it. Whether the choice persists per-account server-side
  (as the class Filter and Search do, §A4) is **unknown**.

### Login page — the Gigya screen-set trap, again

The real form is `#gigya-login-form` (`username` / `password`). The screen-set injects **~15 hidden
forms** carrying duplicate `username`, `password`, `email` and `profile.*` inputs, so an unscoped
`input[name=password]` matches several. **Scope every login selector to `#gigya-login-form`.**
This is the same trap §B2 records for Manage learner profile — it is the Gigya screen-set itself,
so expect it anywhere Gigya renders.

### Administrator / Teacher role toggle

`#teacher-admin-toggle` (`qid="teacher-admin-toggle"`) is `aria-hidden` / `tabindex=-1`; the
focusable control is the inner `div.can-toggle__switch`, whose `aria-label` **states the current
role and the action**: `Administrator/Teacher toggle: Administrator currently active, activate to
view Teacher dashboard`. That label is the clean assertion target.

### School tab navigation `[2026-08-27]`

Opening a school lands on **CLASSES**. Five tabs, upper case, each with a **real href**:

| Tab | qid | URL suffix | Browser title |
|---|---|---|---|
| CLASSES | `aDetail-1` | `/class` | `Classes | Cambridge One` |
| STUDENTS | `aDetail-2` | `/learner` | `Students | Cambridge One` |
| STAFF | `aDetail-4` | `/staff` | `Staff | Cambridge One` |
| LIBRARY | `aDetail-5` | `/library` | `Library | Cambridge One` |
| REPORTS | `aDetail-6` | `/reports` | `Reports | Cambridge One` |

Full path `/admin/admin/org_<slug>/<suffix>`; the school heading persists across all five.

**Three traps:**

1. ⚠️ **`aDetail-3` is skipped** — the sequence is 1, 2, 4, 5, 6. Never iterate `1..5`.
2. ⚠️ **STUDENTS routes to `/learner`**, not `/student` — a URL built from the label fails.
3. ⚠️ **The active marker is on the parent `<li>`** (`li.nav-item.active > a`). Every tab
   anchor carries an identical className whether active or not, so asserting on the anchor's class
   is a guaranteed false green — the same shape as the §B2 presence traps.

No `aria-current` / `aria-selected` on any tab; the active state is presentational only.
**Measured:** Reports ~4.3 s to become active, Classes ~1.2 s — poll, never pause (§B8).

### My profile / Manage profile `[2026-08-27]`

**URL `/dashboard/my-profile` — NOT under `/admin/`**, so this is the shared Cambridge One
profile page and a change here reaches teachers and students too. Entry: `aHeader-3` → `aHeader-6`.

⚠️ **Three names for one page:** menu *My profile* · title *My profile | Cambridge One* · heading
***Manage profile***. Assert the heading.

Two tabs — `c-mp-tab-1` *Personal info*, `c-mp-tab-2` *Password*. Fields `c-mp-inpt-1..7`:
First name, Last name, Email, Location, then Old / New / Confirm password. Buttons: Update
(`c-mp-btn-3` / `c-mp-btn-5`), Cancel (`c-mp-btn-4`), Back (`c-mp-btn-1`).

**Four findings:**

1. ⚠️ **No field declares `maxlength` and none is `required`** — all seven, both tabs. The
   opposite of the rest of the admin app (§A3: class name 50, scale title 20). Boundary cases
   **cannot be derived from the markup here** and must be found by submitting.
2. ⚠️ **No password rules are displayed.** The equivalent page in the other app has a dedicated
   `newPasswordRules_text` element (`SETT` selector set); this page shows nothing.
3. ⚠️ **`Location` has three identities** — label *Location*, name `profile.country`, id
   `gigya-textbox-zip`. It behaves as a country. Select by qid; never infer from the id.
4. ⚠️ **The URL does not change between tabs**, and neither tab carries `aria-selected` or a role.
   There is therefore **no attribute at all** identifying the active tab — assert on visible fields.
   (The school tabs share this gap but at least expose `li.nav-item.active`.)

**No `c-mp-*` selector exists in `C1Selectors.json`** — the page is new to the framework. The
`SETT` module (36 TCs, `settings.test.js`) is the **same concept in a different app**
(`data-tid` selectors): model the design on it, but do not assume copy or behaviour matches.

> **Do not exercise the password or validation paths on `testt1@mailsac.com`** — it is the login
> for the whole admin suite. Those cases need a disposable account. `[2026-08-27]`

### School list — 7 schools, extending §0

`testt1@mailsac.com` sees **7** schools, not the 4 in §0's table. Cards are
`a.inst-link qid="aDashboard-N"` (**positional**); the chevron is a separate `aDashboard1-N`; and
**the school key is in the card's `aria-label`** — which is what makes key-based selection possible.

| Key | Display name | In §0? |
|---|---|---|
| `FCN-CHZ-PDA` | 3 July Test School 1 | yes |
| `ZPB-TWP-AEQ` | 3 July Test School 1 | yes |
| `KNF-XRD-QVE` | 3 July Test School 2 | **new** |
| `MQA-ABC-DEF` | MQA Sierra School | yes |
| `HQC-ZWM-ZVF` | Perf Test School 3 | **new** |
| `ACJ-DXL-JKR` | Perf Test School 4 | yes |
| `GYB-JMU-KYA` | Perf Test School 5 | **new** |

Cards 1 and 2 sharing a display name re-confirms §0's *"always select by KEY"* rule.

### Page `<title>` is not stable across load paths

`/admin/admin/dashboard` reported `My school accounts | Cambridge One` after in-app navigation but
`Administrator | Cambridge One` on a fresh `goto`. **Do not assert the document title** on admin
screens without accounting for how the page was reached.

---

## A10. Change school key, organisations, and MQA/CQA visibility `[2026-08-27]`

*Captured live on Thor while designing Batch B of the Generic manual set (modules `SKEY`,
`SADB`, `LIBR`).*

### ⚠️ Change school key is IRREVERSIBLE — and it is reachable in two clicks

**School settings** (`adEdit-1`) → **Change school key** (`adEdit-2`) raises this dialog,
captured **verbatim from the pre-rendered DOM without triggering it** (§A6):

> ⚠ **CAREFUL!**
> **Changing the school key cannot be undone**
> This action is recommended only if your current school key has been compromised

Controls: **Continue** `adEdit-3` · **Cancel** `adEdit-4`.

> 🚨 **NEVER run this on `FCN-CHZ-PDA`.** It is the primary shared school and its key is
> hardcoded as `schoolKey` in `schoolAdminAddClassData.json` — changing it would break
> **every admin suite simultaneously**, with no way back. `TST_SKEY_TC_3` is Blocked at design
> time for exactly this reason (§A5, golden rule 4). Unblocking needs a dedicated disposable school.

School key format across all 7 schools: **three uppercase triplets**, `XXX-XXX-XXX`. On the
dashboard the key is **display text** (`span.school-code`) beside a **Copy** button — **not an
editable field**. The only `<input>` on the dashboard is the role toggle.

### Organisations — the slug is not derivable

| School | Key | Org slug |
|---|---|---|
| 3 July Test School 1 | `FCN-CHZ-PDA` | `org_perf_testschool_1` |

The org slug follows neither the school name nor the key. **Capture it; never construct it.**
Context must still be set by clicking the card — deep links return `/dashboard/error` (§A1).

> **Open question worth testing.** The class Filter and Search persist **server-side per user**
> (§A4). Whether that persistence is scoped **per school** or leaks **across organisations** is
> untested. For an admin managing 7 schools a leak would be a real defect.

### MQA / CQA product visibility — observation, not yet a verdict

On **3 July Test School 1** (`FCN-CHZ-PDA`), a **non-MQA** school showing `Library (971)`:

| Pattern in title | Count | Example |
|---|---|---|
| contains `CQA` | **2** | `CQA - 7 Jan 2021 - Test Umbrella product` |
| begins `NON MQA` | 3 | `NON MQA Umbrella for Free Trial` |
| MQA-only by title | 0 | — |

**Do not read this as a defect yet.** A title containing *CQA* does not prove the product is
CQA-**restricted** — restriction is a licensing property, not a naming convention. Two things are
needed before `TST_LIBR_TC_32` can be executed: a **non-MQA admin account** (`testt1@mailsac.com`
is itself an MQA Sierra School admin) and a **product-team definition** of what marks a product as
MQA/CQA-gated.

Product rows are `aLibrary-*` — **974 elements for 971 products**, so the qid family includes
non-row controls. Do not equate the element count with the product count.

---

## A11. Teacher view, the role toggle, and the shared dialog contract `[2026-08-27]`

*Captured live on Thor while designing Batch C of the Generic manual set. The round trip was
performed and the account left in Administrator view.*

### ⚠️ The role toggle is named DIFFERENTLY in each view

| | Administrator | Teacher |
|---|---|---|
| URL | `/admin/admin/dashboard` | `/dashboard/teacher/dashboard` |
| Title | `My school accounts | Cambridge One` | `Teacher dashboard | Cambridge One` |
| Heading | `My school accounts` | `Hi <FIRST_NAME>!` |
| `checked` | `false` | `true` |
| Switch class | `.can-toggle__switch` (double underscore) | `.can-toggle-switch` (single hyphen) |

**A selector written for one view silently fails in the other**, which breaks exactly the round-trip
test it is used for. Use `#teacher-admin-toggle` — stable in both — and read the input's
`checked` state. The focusable control is the inner `[tabindex="0"]` div; the input itself is
`aria-hidden` / `tabindex=-1`. The `aria-label` names the current role and the action, and
flips correctly. The toggle appears on **inner admin tabs too**, not only the dashboard.

### The two views show DIFFERENT school estates

Administrator view = schools the user **administers** (7 for `testt1@mailsac.com`).
Teacher view = schools the user **teaches at** (8 groups) — including `ABERYSTWYTH COLLEGE : THOR`
and `LTI INTEGRATIONS TEST2`, **neither of which appears in the admin list**.

> ⚠️ Never assume the toggle shows the same estate on both sides, and never assert equal counts.
> ⚠️ **The teacher view groups by DISPLAY NAME**, so the two distinct schools both called
> *3 July Test School 1* (`FCN-CHZ-PDA` / `ZPB-TWP-AEQ`) **collapse into a single group**
> there, while the admin view keeps them apart by key. Never match schools across views by name.

⚠️ **All 7 `Create class` buttons in the teacher view share qid `tDashboard-ncls-btn-1`** — one
per school group. The qid cannot distinguish them, so the button must be located **through its
school-group heading**, or a created class lands on the wrong school.

### Dialog inventory per admin tab, and the one global dialog

| Tab | `.modal-content` present | Hidden on load |
|---|---|---|
| Classes | 5 | all |
| Students | 4 | all |
| Staff | 1 | all |

**The change-school-key dialog ships with the shared page chrome and is therefore present on EVERY
admin tab** — it inflates each count by one and will match an unscoped modal selector anywhere.
Scope modal selectors with `:has(...)` to the specific dialog (extends §B2).

**Verbatim destructive-confirmation copy** (all captured pre-rendered, nothing triggered):

| Dialog | Copy |
|---|---|
| Class delete | `WARNING!` · *There might be students, teachers and course materials in the selected classes* · *Are you sure you want to delete?* · `No, cancel` |
| Class delete async | *This will take a few minutes* · *Deleted classes may show on dashboards for a few minutes before they are removed* |
| Class 50-cap | *You can only delete 50 classes at one time* · *Please uncheck some classes to continue* |
| Student removal | *I confirm that I want to remove students from my school account* · `Cancel` · `Request to remove` |
| Student 50-cap | *You can only remove 50 students at one time* · *Please uncheck some students to continue* |
| Student removal async | *Removing students may take some time* |

The two 50-cap warnings share a **two-line pattern differing only in the verb** — *delete* for
classes, *remove* for students. The limit and the sentence shape are shared; **the verb is not**, so
a single assertion string across both is wrong.

### Institution request — covered end to end except the submission

Launch is `TST_FOOT_TC_7`; entry is `TST_DINS_TC_1`; the eight wizard steps are `SUSA` /
`SCTY` / `NTCH` / `SNAM` / `SLOC` / `SADR` / `SCON` / `SRQS`. **Nothing submits the
request**, so its confirmation copy has never been observed.

Every existing step case asserts only the **enabling** direction (*"select X to enable Next"*); the
disabled half is unasserted. Check whether Next is natively disabled or **CSS-only** disabled (§B4)
before writing that assertion.

> Submitting raises a **real institution request into a human queue**, not withdrawable from the UI.
> `TST_SRQS_TC_2` is Blocked at design time for that reason.

---

## Sources

Promoted [2026-08-21] from the Phase 1 admin programme records. Consult these only for the story
behind a fact — the fact itself belongs here.

- `walkthroughs/walkthrough_adminClassesTab.test.js_2026-08-14_19h-27m.md` (sessions 1–4)
- `walkthroughs/walkthrough_2026-08-18.md` (parts 1–7, bulk create form)
- `walkthroughs/walkthrough_schoolAdminAddClass.test.js_2026-08-14_06h-30m.md`
- `walkthroughs/walkthrough_schoolAdminAddClassValidation.test.js_2026-08-14_16h-06m.md`
- `walkthroughs/walkthrough_schoolAdminAddClassBulkCreateCSV.test.js_2026-08-19.md`
- `walkthroughs/walkthrough_adminGradingCategories.test.js_2026-08-18_12h-04m.md`
- `walkthroughs/walkthrough_adminGradingScales.test.js_2026-08-19_12h-04m.md`
- `walkthroughs/walkthrough_adminClassGradeSettings.test.js_2026-08-20_15h-00m.md`
- `walkthroughs/walkthrough_AdminApp_Classes_tab_test_cases_2026-08-14.md` (manual design)
- `HANDOFF-adminclasses-scenario3.md` §4 — the create-form gotcha list
- Page-object headers: `manageGradingScales.page.js` (7 traps),
  `manageGradingCategories.page.js` (6 traps), `createClasses.page.js`

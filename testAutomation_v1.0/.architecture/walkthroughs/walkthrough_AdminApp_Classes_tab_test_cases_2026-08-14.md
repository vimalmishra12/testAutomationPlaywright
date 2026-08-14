# Session Walkthrough — 2026-08-14 (Manual test design)

## Summary
Produced **Batch 1** of manual *functional* test cases for the Admin App **Classes tab**, from the
high-level scenarios in `AdminApp.xlsx`. Design deliverable only (automation to follow later).
Grounded by live navigation of the Classes tab on Thor (school "3 July Test School 1" / FCN-CHZ-PDA).

## Scope
Batch 1 = 10 Classes-tab list/navigation scenarios (AdminApp.xlsx #1, 2, 9, 17/33, 18, 19, 20, 27,
28, 29), expanded into **22 TCs** (17 Positive · 3 Edge · 2 Negative), module code **CLST**
(→ future `schoolClasses` page object). Deferred: bulk-create form, grading categories, grading
scales, delete (soft/hard/bulk), clone, context-class, add-label, count-increase.

## Files created
- `test/Manual/C1App/AdminApp-Classes/AdminApp_Classes_tab_test_cases.md` — the test-case document
  (per `.architecture/manual-test-standard.md`: 14-column per-TC tables, Positive→Edge→Negative,
  scenario→TC coverage map, live product reference).
- `test/Manual/C1App/AdminApp-Classes/AdminApp_Classes_tab_test_cases.xlsx` — Excel register (same
  14 columns, one row per TC, frozen styled header). Generated via a self-contained Node OOXML
  writer (no xlsx/python libs available in this env).

## Product knowledge captured (Classes tab, Thor)
- Layout: left nav Classes/Students/Staff/Library/Reports; header Active classes (N) + Search
  ("Search for class name or class key") + Add class + Filter + User guide; select-all + Delete
  (disabled until selection). Columns: Class name, Class key (+Copy), Start date, End date,
  Student progress, Show/Hide class details.
- Filter = modal (`#classSortFilterModal`): Class status (Not started/Active/Ended/Expired/Deleted)
  + Class labels (Find a label) + Clear all + Apply.
- Expand row reveals Course materials, Class labels, Students(+Pending), Teachers(+Pending).
- User guide toggle reveals a help panel; Ended classes is a separate collapsible section with a
  Class status column and a "Load more …" link; launching a class opens the Class Page
  (`/class/teacher/org_<slug>/class/<uuid>/view`).
  > To promote into `product-knowledge/ExperienceApp.md` (NEMO admin section) after review.

## Open items (`[ASSUMED]`, to confirm on next live pass)
Search partial/case behaviour; no-results & empty-filter copy; load-more hide-vs-disable + page
size; a concrete existing class label (pending Add-label scenario).

## Protected files touched
None.

## Update — format revision + Batch 2 (2026-08-14)

**Format revision (user request):** test cases regrouped **by Linked Requirement** (all TCs for a
requirement contiguous; within each group Positive→Edge→Negative); **S.No.** renumbered sequentially;
**Test Case IDs kept stable** (Option A); **Linked Requirement** column now carries the scenario
**name** (e.g. "#2 — Verify filter functionality is working fine"). Applied to both MD + xlsx.

**Batch 2 — Grading Categories (AdminApp.xlsx scen 4–8), appended:** module **GCAT**, **9 TCs**
(TST_GCAT_TC_1..9), S.No. 23–31. Total suite now **31 TCs**.
- Entry: class page/Classes tab → **School settings** dropdown → **Manage grading categories**
  (`/manage-grading-categories`).
- Grounded live: manage page (Create + list with Open grade options → See details/Remove); create
  modal (name maxlength 50, Save disabled empty, banner "Grading category successfully created",
  plus a max-categories limit modal); See details page (`/…/<id>/classes`, "Active classes (N)" +
  empty state); delete confirmation ("…will not affect classes currently using it…" → No, go back /
  Yes, remove → "Grading category successfully removed"). Test category created + removed (cleaned up).
- `[ASSUMED]`: exact max-category count; 50-char truncation; the launch-grade-settings destination
  from a *populated* category details page (all categories tested had 0 classes).

## Batch 3 — Bulk class creation form (AdminApp.xlsx scen 3, user-prioritised), appended

Module **BCCF**, **16 TCs** (TST_BCCF_TC_1..16), S.No. 32–47. Total suite now **47 TCs**. One
requirement group (#3), P→E→N within it.
- Entry: Classes tab → **Add class** → `/class/create` ("Create new classes").
- Grounded live: form load; per-row fields (class name maxlength 50 / pattern; Owl date pickers with
  end-date disabling days ≤ start); **Add teachers** fullscreen modal (Email + optional First/Last →
  Apply changes, "only apply to this class"); **Add materials** modal; **Add label** dropdown
  (existing labels e.g. VM1 / + Create new label / Edit labels); **bulk-action toolbar** (Start date,
  End date, Add teacher, Add labels, Add Material, Copy an Existing Class, Duplicate, Show student
  progress, Remove — applies to selected rows); Upload file + Get CSV template; Create N disabled
  until valid; async success dialog → Back to dashboard / Create more classes.
- Reuses automation coverage notes (single create = TST_CCLS_TC_1..4, material = TC_5..7, back to
  dashboard = TC_8).
- Also filled the earlier CLST_TC_4 label placeholder with a real label (**VM1**).
- New `[ASSUMED]`: Duplicate behaviour; Copy-an-existing-class options; CSV template headers +
  upload flow; "Create more classes" reset; invalid-name inline error text.

## Batch 4 — Grading scales (AdminApp.xlsx scen 10–16), appended

Module **GSCL**, **12 TCs** (TST_GSCL_TC_1..12), S.No. 48–59. Total suite now **59 TCs**.
- Entry: class page → **School settings** → **Manage grading scales** (`/grading-scales/manage`).
- Grounded live: manage page (default "Cambridge One grading scale" = View details only; custom =
  View details/Set as default/Delete); **create** form (`/grading-scales/create`: title + bands
  name/From%/To%, Highest To=100/Lowest From=0, + Add new grade, Set as target score, Save disabled
  until valid; "bands must add up to 100% without overlapping"; max-scales limit modal); **view
  details** (`/grading-scales/<id>`, Grading scale bands section + Classes(N) empty state); **expand
  bands** (Grade name/Band, e.g. A 50-100% target 50%, F 0-49%); **set as default** confirmation
  ("All newly created classes will be associated… Existing classes will not be affected"); **delete**
  confirmation ("…will not affect classes associated with it, but it won't be available to apply to
  any new classes"). Default scale has no Delete/Set-default. Test scale created + deleted (cleaned up).
- New `[ASSUMED]`: exact max-scales count; band overlap/gap validation copy; launch-grade-settings
  destination from a populated scale (tested scale had 0 classes).

## Batch 5 — Class management: label / delete / count (AdminApp.xlsx scen 21, 23, 30) — simple scenarios

Module **CMGT**, **9 TCs** (TST_CMGT_TC_1..9), S.No. 60–68. Total suite now **68 TCs**.
- **#21 Add label:** class page (`…/view/classdata`) → **+ Add labels** → select existing label (e.g.
  VM1) / **+ Create new label**.
- **#23 Delete:** Classes tab → select row checkbox(es) → **Delete class** → WARNING confirmation
  ("N selected class has not ended. There might be students, teachers and course materials… Are you
  sure?") → No, cancel / Yes, delete N class(es). Soft delete (restorable) → moves to deleted/Ended;
  post-delete note "This will take a few minutes… may show on dashboards for a few minutes". Hard
  delete needs the 7 conditions (no students / ≤1 teacher / no groups / assignments / scales /
  categories / lock rules). Grounded soft + bulk delete live (deleted one test AutoClass).
- **#30 Count increase:** Active count rises after (async) creation completes.
- New `[ASSUMED]`: permanent-delete UI + blocked behaviour; 50-class bulk max; create-new-label form.

## Pending / Follow-up
- User review of Batches 1–5; confirm the `[ASSUMED]` items live and fill placeholders.
- Remaining scenarios: #22 class grade settings, #28 clone, #29 context class creation (complex).
- Later: automate CLST → `schoolClasses`, GCAT → `gradingCategories`, BCCF → `createClasses`, GSCL → `gradingScales`, CMGT → `schoolClasses`/class page.

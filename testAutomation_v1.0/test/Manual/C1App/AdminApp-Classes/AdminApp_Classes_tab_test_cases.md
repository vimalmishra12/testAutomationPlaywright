# Manual Functional Test Cases — Admin App: Classes Tab (Batch 1)

**Source:** `AdminApp.xlsx` — high-level Classes-tab scenarios
**Module:** CLST (Classes Tab) — *maps to the future `schoolClasses` page object when automated*
**App:** Admin App / NEMO — `micro-nemo.comprodls.com` (Thor)
**Page in scope:** School Classes tab — `/admin/admin/org_<school-slug>/class`
**Generated:** 2026-08-14 | **Total TCs:** 68 (48 Positive · 12 Edge · 8 Negative)
**Batches:** Batch 1 — Classes-tab list/navigation (`TST_CLST_*`, module CLST, 22 TCs) · Batch 2 — Grading categories (`TST_GCAT_*`, module GCAT, 9 TCs) · Batch 3 — Bulk class creation form (`TST_BCCF_*`, module BCCF, 16 TCs) · Batch 4 — Grading scales (`TST_GSCL_*`, module GSCL, 12 TCs) · Batch 5 — Class management: label / delete / count (`TST_CMGT_*`, module CMGT, 9 TCs)

> **Ordering:** test cases are **grouped by Linked Requirement (scenario)** so every requirement's
> TCs sit together; within each group they run **Positive → Edge → Negative**. (This intentionally
> departs from `manual-test-standard.md`'s global P→E→N ordering, per request.) **S.No.** is
> sequential 1–22 in this grouped order; **Test Case IDs** are stable identifiers and therefore
> appear out of numeric sequence within a group.
>
> **Batch 1 scope (agreed):** the 10 Classes-tab *list & navigation* scenarios that live on the same
> page and need no seeded sub-feature data. Deferred to later batches: bulk-create form, grading
> categories, grading scales, delete (soft/hard/bulk), clone, context-class, add-label, count-increase.
>
> Unverified expected text is marked `[ASSUMED]`; env-specific values use `<PLACEHOLDER>` (see Remarks).

---

## Requirement → Test Case coverage map

| Linked Requirement (scenario) | Mapped TC IDs (P → E → N) |
|---|---|
| #1 — Verify class tab is loading | TST_CLST_TC_1 |
| #2 — Verify filter functionality is working fine | TST_CLST_TC_2, TC_3, TC_4, TC_19 (E), TC_22 (N) |
| #9 — Verify search for class key and class name working fine | TST_CLST_TC_5, TC_6, TC_18 (E), TC_21 (N) |
| #27 — Verify Sort by class name/start date/end date | TST_CLST_TC_7, TC_8 |
| #18 — Verify expanding a class row | TST_CLST_TC_9, TC_10 |
| #17/#33 — Verify expanding user guide in classes tab (expand/collapse) | TST_CLST_TC_11, TC_12 |
| #19 — Launch a class from classes tab | TST_CLST_TC_13 |
| #28 — Ended & Active sections separate; Expand/Collapse Ended | TST_CLST_TC_14, TC_15 |
| #29 — Verify class launch from ended classes section | TST_CLST_TC_16 |
| #20 — Verify load more classes in classes tab | TST_CLST_TC_17, TC_20 (E) |
| **#4 — Verify manage grading category page** | TST_GCAT_TC_1 |
| **#5 — Verify create grading category** | TST_GCAT_TC_2, TC_3 (E), TC_4 (E), TC_5 (N) |
| **#6 — Verify see details page of a grading category** | TST_GCAT_TC_6 |
| **#7 — Launch class grade setting page from see details page of grading category** | TST_GCAT_TC_7 |
| **#8 — Verify delete grading category** | TST_GCAT_TC_8, TC_9 (E) |
| **#3 — Verify bulk class creation form is working fine** | TST_BCCF_TC_1..12, TC_13–14 (E), TC_15–16 (N) |
| **#10 — Verify manage grading scales page** | TST_GSCL_TC_1 |
| **#11 — Verify Create grading scale** | TST_GSCL_TC_2, TC_3, TC_4 (E), TC_5 (N) |
| **#12 — Verify view details page of grading scale** | TST_GSCL_TC_6 |
| **#13 — Launch class grade setting page from view details page of grading scale** | TST_GSCL_TC_7 |
| **#14 — Verify set as default for a grading scale** | TST_GSCL_TC_8 |
| **#15 — Verify deleting a grading scale** | TST_GSCL_TC_9, TC_10 (E), TC_11 (N) |
| **#16 — Verify expanding grading scale bands** | TST_GSCL_TC_12 |
| **#21 — Add label in class** | TST_CMGT_TC_1, TC_2 |
| **#23 — Verify delete classes (soft / hard / bulk up to 50)** | TST_CMGT_TC_3, TC_4, TC_5, TC_6 (E), TC_7 (E), TC_8 (N) |
| **#30 — Verify count of classes increase on adding a new class** | TST_CMGT_TC_9 |

---

## Product reference (captured live 2026-08-14, Thor · school "3 July Test School 1" / FCN-CHZ-PDA)

- **Classes tab layout:** left nav tabs — Classes (N), Students, Staff, Library, Reports.
  Header: **Active classes (N)** heading, **Search** box ("Search for class name or class key"),
  **Add class** button, **Filter** link, **User guide** toggle, bulk **select-all** checkbox +
  **Delete class** button (disabled until a class is selected).
- **Active table columns:** Class name · Class key (+ Copy) · Start date · End date · Student progress · Show/Hide class details.
- **Ended classes** is a separate collapsible section (**Ended classes (N)**, Open/Close). Its table
  adds a **Class status** column (values seen: Expired) and ends with a **Load more …** link.
  Note shown: *"Ended and deleted classes automatically move into this section."*
- **Filter** opens a **modal** (`#classSortFilterModal`): **Class status** = Not started / Active /
  Ended / Expired / Deleted; **Class labels** ("Find a label" search); **Clear all**; **Apply**.
- **Expand class row** ("Show class details") reveals: **Course materials**, **Class labels**,
  **Students** (count + Pending), **Teachers** (count + Pending).
- **User guide** toggle ("Open the user guide" ⇄ "Hide the user guide") shows a help panel.
- **Launch a class:** clicking a class name opens the **Class Page**
  (`/class/teacher/org_<slug>/class/<uuid>/view`, title "Class Page | Cambridge One").

**Precondition (all Batch-1 CLST TCs):** Logged in as school admin on Thor (`testt1@mailsac.com`),
opened school **"3 July Test School 1"** (school key **FCN-CHZ-PDA**), on the **Classes** tab.

### Grading categories (Batch 2 — module GCAT), captured live 2026-08-14

- **Entry path:** class page / Classes tab → **School settings** dropdown → **Manage grading categories**
  → `/admin/admin/org_<slug>/manage-grading-categories`.
- **Manage page:** heading "Manage grading categories"; description *"Create (or remove) grading
  categories for your school. Categories can then be applied to a class on the class grade settings
  page"*; **Create a grading category** button; a "Grading categories" list where each row has an
  **Open grade options** menu → **See details** / **Remove**.
- **Create:** modal "Create a new grading category" with a **Grading category name** input
  (placeholder "eg: Class participation", maxlength 50); **Save** is disabled while empty; on save a
  banner **"Grading category successfully created"** appears and the category is listed. A
  **maximum-categories** limit exists — modal *"You have reached the maximum number of grading
  categories for your school. Please remove at least one category to add a new one"* (`[ASSUMED]` exact max).
- **See details:** opens `/manage-grading-categories/<id>/classes` (title = category name), showing
  **Active classes (N)**; empty state *"The category has not been added to any active classes."*
- **Remove:** confirmation modal *"Remove grading category — Are you sure you want to remove this?
  Removing the category will not affect classes currently using it, but you will not be able to add
  it to any new classes"* → **No, go back** / **Yes, remove**; on remove a banner **"Grading category
  successfully removed"** appears.

**Precondition (all Batch-2 GCAT TCs):** logged in as above; on the **Manage grading categories** page.

### Bulk class creation form (Batch 3 — module BCCF), captured live 2026-08-14

- **Entry path:** Classes tab → **Add class** → `/admin/admin/org_<slug>/class/create`, title
  "Create new classes", subtitle "in <school name>". The form **auto-saves a draft** ("Saved …").
- **Per-row fields:** **Class name** (`input[qid=dBulkClass-0-2]`, maxlength 50, pattern requires ≥1
  alphanumeric) · **Start date** / **End date** (readonly Owl date-pickers; end-date picker disables
  days on/before the start date) · **Add teachers** · **Add materials** · **Add class label**. New
  empty rows auto-append as you fill rows (bulk).
- **Add teachers:** opens a fullscreen modal "Edit teachers in <class>" with **Email** + **First
  name (optional)** + **Last name (optional)** → **Apply changes** / Cancel. Note: "Changes made
  will only apply to this class".
- **Add materials:** modal — search ("Type to search materials") → select a `.dropdown-item` →
  **Add materials**; the chosen material renders in the row.
- **Add class label:** dropdown listing **existing labels** (e.g. `VM1`, `A11y test`, `aditya`) plus
  **+ Create new label** and **Edit labels**.
- **Bulk-action toolbar** (applies to **selected** rows via row checkboxes / select-all; disabled at
  load until a selection): **Start date · End date · Add teacher · Add labels · Add Material · Copy
  an Existing Class · Duplicate · Show student progress · Remove**.
- **CSV:** **Upload file** (bulk-upload classes) and **Get CSV template**.
- **Create:** **Create N class(es)** button (`button[qid=dBulkClass-13]`) is disabled until a row has
  name + start + end date. On create a **success dialog** appears — "Success! We are now creating N
  class(es) for you… you'll receive an email report… can take up to 12 hours" — with **Back to
  dashboard** (→ school Classes page) and **Create more classes**. **Creation is asynchronous.**

**Precondition (all Batch-3 BCCF TCs):** logged in as above; on the **Create new classes** form
(Classes tab → Add class).

### Grading scales (Batch 4 — module GSCL), captured live 2026-08-14

- **Entry path:** class page / Classes tab → **School settings** dropdown → **Manage grading scales**
  → `/admin/admin/org_<slug>/grading-scales/manage`.
- **Manage page:** heading "Grading scales"; **User guide**; **Create grading scale** button; a list
  of scales, each with an **Open drop down** menu. The system **"Cambridge One grading scale"** shows
  a **default** badge and only **View details**. Custom scales offer **View details / Set as default /
  Delete**.
- **Create:** `/grading-scales/create` — **Grading scale title**; **bands** where each band has a
  grade **name** (e.g. A/F) + **From %** / **To %**; the **Highest grade** To is fixed 100% and the
  **Lowest grade** From is fixed 0%; **+ Add new grade** inserts middle bands; one band is marked
  **Set as target score**. Rule: *"From lowest band to highest must add up to 100% without overlapping
  values."* **Save grading scale** is disabled until title + valid bands + a target are set. A
  **maximum-scales** limit exists — modal *"You have reached the maximum number of grading scales for
  this school…"* (`[ASSUMED]` exact max).
- **View details:** `/grading-scales/<id>` (title = scale name) with a collapsible **Grading scale
  bands** section and a **Classes (N)** section (empty state: "No classes yet. To associate the grading
  scale with a class, go to its 'Class grade settings' page").
- **Expand bands:** clicking **Grading scale bands** shows **Grade name / Band** rows (e.g. `A 50%-100%`
  with "Target score: 50%", `F 0%-49%`).
- **Set as default:** confirmation *"Set as default for the school? All newly created classes will be
  associated with this grading scale. Existing classes will not be affected"* → No, go back / Yes, set
  as default. Only non-default scales offer this.
- **Delete:** confirmation *"Are you sure? Deleting the grading scale will not affect classes associated
  with it, but it won't be available to apply to any new classes."* → No, go back / Yes, delete. The
  default scale has **no Delete** option.

**Precondition (all Batch-4 GSCL TCs):** logged in as above; on the **Grading scales** (Manage) page.

### Class management — label / delete / count (Batch 5 — module CMGT), captured live 2026-08-14

- **Add label to a class (#21):** on the **class page** (Classes tab → launch a class →
  `…/view/classdata`), **+ Add labels** opens a dropdown of existing labels (e.g. `VM1`, `aditya_goel`)
  plus **+ Create new label**. Selecting a label applies it to the class.
- **Delete classes (#23):** on the Classes tab, select class row checkbox(es) (or select-all) to enable
  the **Delete class** button. Clicking it shows a **WARNING** confirmation — *"N selected class has not
  ended. There might be students, teachers and course materials in the selected classes. Are you sure
  you want to delete?"* → **No, cancel** / **Yes, delete N class(es)**. This is a **soft delete** — the
  class moves out of Active into the deleted/Ended section (restorable). A post-delete note appears:
  *"This will take a few minutes. Deleted classes may show on dashboards for a few minutes before they
  are removed."* **Hard/permanent delete** is only allowed when the class has: no students, ≤1 teacher
  (the deleter) or none, no groups, no assignments, no grading scales, no grading categories, no
  locking/unlocking rules (per AdminApp.xlsx). `[ASSUMED]` — exact permanent-delete UI/location.
- **Count increase (#30):** the "Active classes (N)" count increases after a class is created; because
  creation is **asynchronous**, the count updates once processing completes (not instantly).

**Precondition (Batch-5 CMGT TCs):** logged in as above; on the Classes tab (or a launched class page,
for the label TCs).

---

## Section — Test Cases (grouped by Linked Requirement)

### Requirement #1 — Verify class tab is loading

| Field | Value |
|---|---|
| **S.No.** | 1 |
| **Test Case ID** | TST_CLST_TC_1 |
| **Title** | Verify the Classes tab loads with all expected components |
| **Linked Requirement** | #1 — Verify class tab is loading |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | School opened from "My school accounts". |
| **Test Steps** | 1. Open school "3 July Test School 1". 2. Observe the Classes tab. |
| **Test Data** | — |
| **Expected Result** | The Classes tab loads showing: "Active classes (N)" heading, Search box, Add class button, Filter link, User guide toggle, select-all + disabled Delete class, the class table (Class name, Class key, Start date, End date, Student progress), and a separate "Ended classes (N)" section. Left nav shows Classes/Students/Staff/Library/Reports. |
| **Remarks** | Classes(N) in nav = Active + Ended counts. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

### Requirement #2 — Verify filter functionality is working fine

| Field | Value |
|---|---|
| **S.No.** | 2 |
| **Test Case ID** | TST_CLST_TC_2 |
| **Title** | Verify the Filter modal opens and shows all filter options |
| **Linked Requirement** | #2 — Verify filter functionality is working fine |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | On the Classes tab. |
| **Test Steps** | 1. Click **Filter**. 2. Observe the modal. |
| **Test Data** | — |
| **Expected Result** | A Filter modal opens with **Class status** options (Not started, Active, Ended, Expired, Deleted), a **Class labels** section with a "Find a label" input, and **Clear all** and **Apply** buttons. |
| **Remarks** | Filter is a modal dialog, not an inline panel. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 3 |
| **Test Case ID** | TST_CLST_TC_3 |
| **Title** | Verify filtering by Class status returns only classes of that status |
| **Linked Requirement** | #2 — Verify filter functionality is working fine |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | On the Classes tab; Filter modal open. |
| **Test Steps** | 1. Select **Class status = Active**. 2. Click **Apply**. |
| **Test Data** | Class status: Active |
| **Expected Result** | The modal closes and the list shows only Active classes; the "Active classes (N)" count reflects the filtered result. Ended/Expired/Deleted classes are not shown in the active list. |
| **Remarks** | Repeat conceptually for Ended / Expired / Deleted / Not started. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 4 |
| **Test Case ID** | TST_CLST_TC_4 |
| **Title** | Verify filtering by a Class label returns only classes with that label |
| **Linked Requirement** | #2 — Verify filter functionality is working fine |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | At least one class has a label applied. |
| **Test Steps** | 1. Click **Filter**. 2. In **Class labels**, type `VM1` in "Find a label" and select it. 3. Click **Apply**. |
| **Test Data** | Label: `VM1` (a real existing label; others: `A11y test`, `aditya`) |
| **Expected Result** | Only classes carrying the selected label are listed. |
| **Remarks** | Label list confirmed live on the create-class label dropdown; confirm a class actually carries `VM1` before running. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 5 |
| **Test Case ID** | TST_CLST_TC_19 |
| **Title** | Verify "Clear all" resets the filter selections |
| **Linked Requirement** | #2 — Verify filter functionality is working fine |
| **Type** | Edge |
| **Priority** | Low |
| **Preconditions** | Filter modal open with one or more options selected. |
| **Test Steps** | 1. Select a Class status and/or a label. 2. Click **Clear all**. |
| **Test Data** | — |
| **Expected Result** | All filter selections are cleared back to the default (unfiltered) state within the modal. |
| **Remarks** | — |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 6 |
| **Test Case ID** | TST_CLST_TC_22 |
| **Title** | Verify a filter combination with no matches shows an empty state |
| **Linked Requirement** | #2 — Verify filter functionality is working fine |
| **Type** | Negative |
| **Priority** | Low |
| **Preconditions** | On the Classes tab. |
| **Test Steps** | 1. Open **Filter**. 2. Select a Class status + a label combination that no class satisfies. 3. Click **Apply**. |
| **Test Data** | Status + label combo with zero matches `[ASSUMED]` |
| **Expected Result** | The list shows an empty/no-matching-classes state with no error. `[ASSUMED]` — capture exact empty-state text on live. |
| **Remarks** | — |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

### Requirement #9 — Verify search for class key and class name working fine

| Field | Value |
|---|---|
| **S.No.** | 7 |
| **Test Case ID** | TST_CLST_TC_5 |
| **Title** | Verify search by class name returns the matching class |
| **Linked Requirement** | #9 — Verify search for class key and class name working fine |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | On the Classes tab. A class named `SarthakTestClass1` exists. |
| **Test Steps** | 1. Type `SarthakTestClass1` in the Search box. 2. Click **Search**. |
| **Test Data** | Class name: `SarthakTestClass1` |
| **Expected Result** | The list is filtered to the class(es) whose name matches "SarthakTestClass1". |
| **Remarks** | Any existing active class name may be substituted. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 8 |
| **Test Case ID** | TST_CLST_TC_6 |
| **Title** | Verify search by class key returns the matching class |
| **Linked Requirement** | #9 — Verify search for class key and class name working fine |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | On the Classes tab. Class key `97Cc-y7bs` exists (SarthakTestClass1). |
| **Test Steps** | 1. Type `97Cc-y7bs` in the Search box. 2. Click **Search**. |
| **Test Data** | Class key: `97Cc-y7bs` |
| **Expected Result** | The list is filtered to the single class with class key `97Cc-y7bs`. |
| **Remarks** | Confirms search accepts both class name and class key. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 9 |
| **Test Case ID** | TST_CLST_TC_18 |
| **Title** | Verify class search is case-insensitive and matches partial names |
| **Linked Requirement** | #9 — Verify search for class key and class name working fine |
| **Type** | Edge |
| **Priority** | Medium |
| **Preconditions** | A class named `SarthakTestClass1` exists. |
| **Test Steps** | 1. Search `sarthak` (lower-case, partial). 2. Click **Search**. |
| **Test Data** | Search term: `sarthak` |
| **Expected Result** | `SarthakTestClass1` is returned, confirming search is case-insensitive and matches partial names. `[ASSUMED]` — confirm partial/case behaviour on live. |
| **Remarks** | If search is exact-match only, record actual behaviour and split into separate positive/negative TCs. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 10 |
| **Test Case ID** | TST_CLST_TC_21 |
| **Title** | Verify searching for a non-existent class shows a no-results state |
| **Linked Requirement** | #9 — Verify search for class key and class name working fine |
| **Type** | Negative |
| **Priority** | Medium |
| **Preconditions** | On the Classes tab. |
| **Test Steps** | 1. Search `zzz-no-such-class-9999`. 2. Click **Search**. |
| **Test Data** | Search term: `zzz-no-such-class-9999` |
| **Expected Result** | No classes are listed and an empty/no-results state is shown (no error/crash). `[ASSUMED]` — capture the exact empty-state message/text on live. |
| **Remarks** | Record the no-results copy so it can be asserted when automated. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

### Requirement #27 — Verify Sort by class name/start date/end date

| Field | Value |
|---|---|
| **S.No.** | 11 |
| **Test Case ID** | TST_CLST_TC_7 |
| **Title** | Verify sorting by Class name toggles ascending/descending |
| **Linked Requirement** | #27 — Verify Sort by class name/start date/end date |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | On the Classes tab with ≥ 2 active classes. |
| **Test Steps** | 1. Click the **Class name** column header. 2. Observe order. 3. Click **Class name** again. |
| **Test Data** | — |
| **Expected Result** | First click sorts classes A→Z by name; second click reverses to Z→A (sort indicator updates accordingly). |
| **Remarks** | — |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 12 |
| **Test Case ID** | TST_CLST_TC_8 |
| **Title** | Verify sorting by Start date and End date |
| **Linked Requirement** | #27 — Verify Sort by class name/start date/end date |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | On the Classes tab with ≥ 2 active classes. |
| **Test Steps** | 1. Click the **Start date** column header (observe order). 2. Click **End date** column header (observe order). Toggle each again to reverse. |
| **Test Data** | — |
| **Expected Result** | Classes reorder chronologically by the selected date column, and each header toggles ascending/descending. |
| **Remarks** | Sort headers are present in both Active and Ended tables. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

### Requirement #18 — Verify expanding a class row

| Field | Value |
|---|---|
| **S.No.** | 13 |
| **Test Case ID** | TST_CLST_TC_9 |
| **Title** | Verify expanding a class row shows the class details |
| **Linked Requirement** | #18 — Verify expanding a class row |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | On the Classes tab with ≥ 1 active class. |
| **Test Steps** | 1. Click **Show class details** on a class row. |
| **Test Data** | — |
| **Expected Result** | The row expands to show **Course materials**, **Class labels**, **Students** (count + Pending), and **Teachers** (count + Pending); the toggle changes to **Hide class details**. |
| **Remarks** | — |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 14 |
| **Test Case ID** | TST_CLST_TC_10 |
| **Title** | Verify collapsing an expanded class row hides the details |
| **Linked Requirement** | #18 — Verify expanding a class row |
| **Type** | Positive |
| **Priority** | Low |
| **Preconditions** | A class row is expanded (details visible). |
| **Test Steps** | 1. Click **Hide class details** on the expanded row. |
| **Test Data** | — |
| **Expected Result** | The details panel collapses and the toggle returns to **Show class details**. |
| **Remarks** | — |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

### Requirement #17/#33 — Verify expanding user guide in classes tab (expand/collapse)

| Field | Value |
|---|---|
| **S.No.** | 15 |
| **Test Case ID** | TST_CLST_TC_11 |
| **Title** | Verify expanding the user guide shows the help panel |
| **Linked Requirement** | #17/#33 — Verify expanding user guide in classes tab (expand/collapse) |
| **Type** | Positive |
| **Priority** | Low |
| **Preconditions** | On the Classes tab; user guide currently collapsed. |
| **Test Steps** | 1. Click **User guide** ("Open the user guide"). |
| **Test Data** | — |
| **Expected Result** | A "User guide" help panel appears explaining you can search a class by name or class code, plus the deleted/restored-classes refresh tip; the toggle changes to **Hide the user guide**. |
| **Remarks** | — |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 16 |
| **Test Case ID** | TST_CLST_TC_12 |
| **Title** | Verify collapsing the user guide hides the help panel |
| **Linked Requirement** | #17/#33 — Verify expanding user guide in classes tab (expand/collapse) |
| **Type** | Positive |
| **Priority** | Low |
| **Preconditions** | User guide panel is expanded. |
| **Test Steps** | 1. Click **Hide the user guide**. |
| **Test Data** | — |
| **Expected Result** | The help panel collapses and the toggle returns to **Open the user guide**. |
| **Remarks** | — |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

### Requirement #19 — Launch a class from classes tab

| Field | Value |
|---|---|
| **S.No.** | 17 |
| **Test Case ID** | TST_CLST_TC_13 |
| **Title** | Verify launching an Active class opens the Class Page |
| **Linked Requirement** | #19 — Launch a class from classes tab |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | On the Classes tab with ≥ 1 active class. |
| **Test Steps** | 1. Click a class name link in the Active list. |
| **Test Data** | Class: `SarthakTestClass1` |
| **Expected Result** | The Class Page opens (URL `/class/teacher/org_<slug>/class/<uuid>/view`, title "Class Page | Cambridge One") for the selected class. |
| **Remarks** | Launch opens the class in the teacher/class view context. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

### Requirement #28 — Ended & Active sections separate; Expand/Collapse Ended

| Field | Value |
|---|---|
| **S.No.** | 18 |
| **Test Case ID** | TST_CLST_TC_14 |
| **Title** | Verify Active and Ended classes appear in separate sections with counts |
| **Linked Requirement** | #28 — Ended & Active sections separate; Expand/Collapse Ended |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | On the Classes tab; school has both active and ended classes. |
| **Test Steps** | 1. Observe the "Active classes (N)" section. 2. Scroll to the "Ended classes (M)" section. |
| **Test Data** | — |
| **Expected Result** | Active and Ended classes are shown in two distinct sections, each with its own count; the Ended section notes that "Ended and deleted classes automatically move into this section" and includes a Class status column. |
| **Remarks** | Nav "Classes (N)" total = Active + Ended. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 19 |
| **Test Case ID** | TST_CLST_TC_15 |
| **Title** | Verify expanding and collapsing the Ended classes section |
| **Linked Requirement** | #28 — Ended & Active sections separate; Expand/Collapse Ended |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | On the Classes tab; Ended section present. |
| **Test Steps** | 1. Click the **Ended classes** section header (Open). 2. Click it again (Close). |
| **Test Data** | — |
| **Expected Result** | The Ended section expands to reveal its class table on Open and collapses on Close; the toggle label switches Open ⇄ Close. |
| **Remarks** | — |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

### Requirement #29 — Verify class launch from ended classes section

| Field | Value |
|---|---|
| **S.No.** | 20 |
| **Test Case ID** | TST_CLST_TC_16 |
| **Title** | Verify launching a class from the Ended section opens the Class Page |
| **Linked Requirement** | #29 — Verify class launch from ended classes section |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | Ended section expanded with ≥ 1 ended class. |
| **Test Steps** | 1. Click a class name in the Ended list. |
| **Test Data** | Ended class: `CQA Vimal` (key `y4G4-3iXC`) |
| **Expected Result** | The Class Page opens for the selected ended class (same `/class/teacher/.../view` destination as active classes). |
| **Remarks** | Confirms ended classes remain launchable (read/review). |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

### Requirement #20 — Verify load more classes in classes tab

| Field | Value |
|---|---|
| **S.No.** | 21 |
| **Test Case ID** | TST_CLST_TC_17 |
| **Title** | Verify "Load more" loads additional classes in the Ended section |
| **Linked Requirement** | #20 — Verify load more classes in classes tab |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | Ended section has more classes than the initial page size (e.g. 25 ended classes). |
| **Test Steps** | 1. Expand the Ended section. 2. Scroll to the bottom. 3. Click **Load more …**. |
| **Test Data** | — |
| **Expected Result** | Additional class rows are appended to the list without a full page reload; the count of visible rows increases. |
| **Remarks** | "Load more" is count-gated — it appears only when more classes remain than are currently shown. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 22 |
| **Test Case ID** | TST_CLST_TC_20 |
| **Title** | Verify "Load more" no longer appears once all classes are loaded |
| **Linked Requirement** | #20 — Verify load more classes in classes tab |
| **Type** | Edge |
| **Priority** | Low |
| **Preconditions** | Ended (or Active) section with a "Load more" link visible. |
| **Test Steps** | 1. Click **Load more …** repeatedly until all classes are displayed. |
| **Test Data** | — |
| **Expected Result** | Once the last batch is loaded, the "Load more …" link is no longer shown. `[ASSUMED]` — confirm the link hides (vs disables) on live. |
| **Remarks** | — |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

### Requirement #4 — Verify manage grading category page

| Field | Value |
|---|---|
| **S.No.** | 23 |
| **Test Case ID** | TST_GCAT_TC_1 |
| **Title** | Verify the Manage grading categories page loads with all components |
| **Linked Requirement** | #4 — Verify manage grading category page |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as school admin, inside school FCN-CHZ-PDA. |
| **Test Steps** | 1. Click **School settings**. 2. Click **Manage grading categories**. |
| **Test Data** | — |
| **Expected Result** | The Manage grading categories page opens (`/manage-grading-categories`) with heading "Manage grading categories", the description about creating/removing categories, a **Create a grading category** button, and a Grading categories list where each row has an **Open grade options** menu (**See details**, **Remove**). |
| **Remarks** | Reached via the School settings dropdown. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

### Requirement #5 — Verify create grading category

| Field | Value |
|---|---|
| **S.No.** | 24 |
| **Test Case ID** | TST_GCAT_TC_2 |
| **Title** | Verify a grading category is created with a valid name |
| **Linked Requirement** | #5 — Verify create grading category |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | On the Manage grading categories page. |
| **Test Steps** | 1. Click **Create a grading category**. 2. Enter `AutoTest Category`. 3. Click **Save**. |
| **Test Data** | Name: `AutoTest Category` |
| **Expected Result** | The modal closes, a banner "Grading category successfully created" is shown, and the new category appears in the list. |
| **Remarks** | Repeated runs create duplicate-named categories (counts toward the max). |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 25 |
| **Test Case ID** | TST_GCAT_TC_3 |
| **Title** | Verify a grading category name at the 50-character maximum is accepted |
| **Linked Requirement** | #5 — Verify create grading category |
| **Type** | Edge |
| **Priority** | Low |
| **Preconditions** | On the Create a grading category modal. |
| **Test Steps** | 1. Enter a 50-character name. 2. Click **Save**. |
| **Test Data** | 50-char name (e.g. `AAAAAAAAAA...` × 50) |
| **Expected Result** | The name is accepted (input enforces maxlength 50) and the category is created. `[ASSUMED]` — confirm the field truncates at 50 and no >50 input is possible. |
| **Remarks** | — |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 26 |
| **Test Case ID** | TST_GCAT_TC_4 |
| **Title** | Verify the maximum-grading-categories limit is enforced |
| **Linked Requirement** | #5 — Verify create grading category |
| **Type** | Edge |
| **Priority** | Medium |
| **Preconditions** | School is already at the maximum number of grading categories. |
| **Test Steps** | 1. Attempt to create another grading category. |
| **Test Data** | — |
| **Expected Result** | A modal is shown: "You have reached the maximum number of grading categories for your school. Please remove at least one category to add a new one" (with a Go back action); no new category is created. `[ASSUMED]` — confirm the exact maximum count. |
| **Remarks** | — |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 27 |
| **Test Case ID** | TST_GCAT_TC_5 |
| **Title** | Verify a grading category cannot be created with an empty name |
| **Linked Requirement** | #5 — Verify create grading category |
| **Type** | Negative |
| **Priority** | Medium |
| **Preconditions** | On the Create a grading category modal. |
| **Test Steps** | 1. Leave the **Grading category name** empty. 2. Observe the **Save** button. |
| **Test Data** | Name: (empty) |
| **Expected Result** | The **Save** button is disabled while the name is empty, so an empty-named category cannot be created. |
| **Remarks** | — |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

### Requirement #6 — Verify see details page of a grading category

| Field | Value |
|---|---|
| **S.No.** | 28 |
| **Test Case ID** | TST_GCAT_TC_6 |
| **Title** | Verify the grading category "See details" page opens |
| **Linked Requirement** | #6 — Verify see details page of a grading category |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | On the Manage grading categories page with ≥ 1 category. |
| **Test Steps** | 1. Click **Open grade options** on a category. 2. Click **See details**. |
| **Test Data** | Category: `AutoTest Category` |
| **Expected Result** | The details page opens (`/manage-grading-categories/<id>/classes`, title = category name) showing **Active classes (N)**; when the category is applied to no classes it shows "The category has not been added to any active classes". |
| **Remarks** | — |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

### Requirement #7 — Launch class grade setting page from see details page of grading category

| Field | Value |
|---|---|
| **S.No.** | 29 |
| **Test Case ID** | TST_GCAT_TC_7 |
| **Title** | Verify the class grade settings page launches from a category's details page |
| **Linked Requirement** | #7 — Launch class grade setting page from see details page of grading category |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | The grading category is applied to ≥ 1 active class (so the details page lists it). |
| **Test Steps** | 1. Open the category's **See details** page. 2. Click a listed class under "Active classes". |
| **Test Data** | A category applied to a class `[ASSUMED]` |
| **Expected Result** | The class grade settings page opens for the selected class. `[ASSUMED]` — exact link/destination pending a category that is applied to a class (categories tested were applied to 0 classes). |
| **Remarks** | Requires applying a category to a class via the class grade settings page first. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

### Requirement #8 — Verify delete grading category

| Field | Value |
|---|---|
| **S.No.** | 30 |
| **Test Case ID** | TST_GCAT_TC_8 |
| **Title** | Verify a grading category is removed after confirmation |
| **Linked Requirement** | #8 — Verify delete grading category |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | On the Manage grading categories page with ≥ 1 removable category. |
| **Test Steps** | 1. Click **Open grade options** on a category. 2. Click **Remove**. 3. In the confirmation, click **Yes, remove**. |
| **Test Data** | Category: `AutoTest Category` |
| **Expected Result** | A confirmation modal appears ("Remove grading category — Are you sure you want to remove this? Removing the category will not affect classes currently using it, but you will not be able to add it to any new classes"). After **Yes, remove**, a banner "Grading category successfully removed" is shown and the category no longer appears in the list. |
| **Remarks** | Product note: removal does not affect classes already using the category. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 31 |
| **Test Case ID** | TST_GCAT_TC_9 |
| **Title** | Verify removing a grading category can be cancelled |
| **Linked Requirement** | #8 — Verify delete grading category |
| **Type** | Edge |
| **Priority** | Low |
| **Preconditions** | On the Manage grading categories page with ≥ 1 category. |
| **Test Steps** | 1. Click **Open grade options** → **Remove**. 2. In the confirmation, click **No, go back**. |
| **Test Data** | — |
| **Expected Result** | The confirmation modal closes and the category remains in the list (not removed). |
| **Remarks** | — |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

### Requirement #3 — Verify bulk class creation form is working fine

| Field | Value |
|---|---|
| **S.No.** | 32 |
| **Test Case ID** | TST_BCCF_TC_1 |
| **Title** | Verify the Create new classes (bulk) form loads with all components |
| **Linked Requirement** | #3 — Verify bulk class creation form is working fine |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | On the Classes tab. |
| **Test Steps** | 1. Click **Add class**. |
| **Test Data** | — |
| **Expected Result** | The "Create new classes" form opens (`/class/create`) with subtitle "in <school>", an **Upload file** button, **Get CSV template** link, "How to use this form" info, the bulk-action toolbar (Start date, End date, Add teacher, Add labels, Add Material, Copy an Existing Class, Duplicate, Show student progress, Remove), and at least one class row (Class name, Start date, End date, Add teachers, Add materials, Add class label). **Create N class** is disabled. |
| **Remarks** | Form auto-saves a draft ("Saved …"). |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 33 |
| **Test Case ID** | TST_BCCF_TC_2 |
| **Title** | Verify a single class is created with a name and start/end dates |
| **Linked Requirement** | #3 — Verify bulk class creation form is working fine |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | On the Create new classes form. |
| **Test Steps** | 1. Enter a class name. 2. Set **Start date** (today). 3. Set **End date**. 4. Click **Create 1 class**. |
| **Test Data** | Name: `AutoClass_Bulk`, Start: today, End: next month |
| **Expected Result** | A success dialog "Success! We are now creating 1 class for you…" appears; creation is asynchronous (email report; up to 12 hours). |
| **Remarks** | Covered by automation `TST_CCLS_TC_1..4`. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 34 |
| **Test Case ID** | TST_BCCF_TC_3 |
| **Title** | Verify a teacher can be added to a class row |
| **Linked Requirement** | #3 — Verify bulk class creation form is working fine |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | A class row with a name entered. |
| **Test Steps** | 1. Click **Add teachers**. 2. In "Edit teachers in <class>" modal, enter **Email** (and optional First/Last name). 3. Click **Apply changes**. |
| **Test Data** | Teacher email: `<TEACHER_EMAIL>` |
| **Expected Result** | The teacher is added to the class row. The modal notes "Changes made will only apply to this class". |
| **Remarks** | First/Last name are optional; Email is required. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 35 |
| **Test Case ID** | TST_BCCF_TC_4 |
| **Title** | Verify a material can be added to a class row |
| **Linked Requirement** | #3 — Verify bulk class creation form is working fine |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | A class row with a name entered. |
| **Test Steps** | 1. Click **Add materials**. 2. Search and select a material. 3. Click **Add materials**. |
| **Test Data** | Material: `dev_test_ebook_bundle_104_bundle` |
| **Expected Result** | The selected material attaches to the class row (shown in the row's materials field). |
| **Remarks** | Covered by automation `TST_CCLS_TC_5..7`. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 36 |
| **Test Case ID** | TST_BCCF_TC_5 |
| **Title** | Verify a label can be added to a class row |
| **Linked Requirement** | #3 — Verify bulk class creation form is working fine |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | A class row with a name entered. |
| **Test Steps** | 1. Click **Add class label**. 2. Select an existing label (or **+ Create new label**). |
| **Test Data** | Label: `VM1` |
| **Expected Result** | The chosen label is applied to the class row; the dropdown also offers "+ Create new label" and "Edit labels". |
| **Remarks** | — |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 37 |
| **Test Case ID** | TST_BCCF_TC_6 |
| **Title** | Verify multiple classes are created at once (bulk) |
| **Linked Requirement** | #3 — Verify bulk class creation form is working fine |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | On the Create new classes form. |
| **Test Steps** | 1. Fill class name + start/end dates on row 1. 2. Fill row 2 similarly. 3. Click **Create 2 classes**. |
| **Test Data** | 2 valid class rows |
| **Expected Result** | The Create button reflects the count ("Create 2 classes"); creating shows the success dialog for N classes. New empty rows auto-append while filling. |
| **Remarks** | Automated: `TST_CCLS_TC_13` (fills a 2nd row, asserts the Create-button count increases by one; does NOT click Create, so no class is created). |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 38 |
| **Test Case ID** | TST_BCCF_TC_7 |
| **Title** | Verify Duplicate copies a selected class row |
| **Linked Requirement** | #3 — Verify bulk class creation form is working fine |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | At least one class row is filled. |
| **Test Steps** | 1. Select a row (checkbox). 2. Click **Duplicate** in the toolbar. 3. Confirm if prompted. |
| **Test Data** | — |
| **Expected Result** | A duplicate row is added carrying the same details as the selected row. `[ASSUMED]` — confirm the exact duplicate behaviour/confirmation. |
| **Remarks** | — |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 39 |
| **Test Case ID** | TST_BCCF_TC_8 |
| **Title** | Verify "Copy an Existing Class" copies settings to selected rows |
| **Linked Requirement** | #3 — Verify bulk class creation form is working fine |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | At least one class row selected. |
| **Test Steps** | 1. Select row(s). 2. Click **Copy an Existing Class**. 3. Choose a source class and what to copy. 4. Continue. |
| **Test Data** | Source class: `<EXISTING_CLASS>` `[ASSUMED]` |
| **Expected Result** | A modal lets you choose an existing class and what to copy (e.g. materials/teachers/settings) to the selected rows; the chosen items are applied. `[ASSUMED]` — confirm the modal options/flow. |
| **Remarks** | Toolbar aria-label: "Choose what to copy from an existing class to the selected classes". |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 40 |
| **Test Case ID** | TST_BCCF_TC_9 |
| **Title** | Verify bulk-setting start/end date for multiple selected rows |
| **Linked Requirement** | #3 — Verify bulk class creation form is working fine |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | Two or more class rows exist. |
| **Test Steps** | 1. Select multiple rows. 2. Click **Start date** in the toolbar and pick a date. 3. Click **End date** and pick a date. |
| **Test Data** | — |
| **Expected Result** | The chosen start/end dates are applied to all selected rows at once. |
| **Remarks** | Same pattern applies to bulk Add teacher / Add labels / Add Material. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 41 |
| **Test Case ID** | TST_BCCF_TC_10 |
| **Title** | Verify "Get CSV template" downloads the upload template |
| **Linked Requirement** | #3 — Verify bulk class creation form is working fine |
| **Type** | Positive |
| **Priority** | Low |
| **Preconditions** | On the Create new classes form. |
| **Test Steps** | 1. Click **Get CSV template**. |
| **Test Data** | — |
| **Expected Result** | A CSV template file downloads with the correct column headers for bulk class creation. `[ASSUMED]` — capture the exact template headers. |
| **Remarks** | — |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 42 |
| **Test Case ID** | TST_BCCF_TC_11 |
| **Title** | Verify uploading a CSV bulk-creates classes |
| **Linked Requirement** | #3 — Verify bulk class creation form is working fine |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | A populated CSV in the template format is available. |
| **Test Steps** | 1. Click **Upload file**. 2. Select the CSV. 3. Wait for the upload to complete. |
| **Test Data** | `<BULK_CLASSES_CSV>` `[ASSUMED]` |
| **Expected Result** | The classes from the CSV are added to the form / created; an upload progress indicator is shown during processing. `[ASSUMED]` — confirm the upload flow and any per-row validation. |
| **Remarks** | — |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 43 |
| **Test Case ID** | TST_BCCF_TC_12 |
| **Title** | Verify "Back to dashboard" and "Create more classes" from the success dialog |
| **Linked Requirement** | #3 — Verify bulk class creation form is working fine |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | A class was just created (success dialog shown). |
| **Test Steps** | 1. Click **Back to dashboard**. 2. (Separately) create again and click **Create more classes**. |
| **Test Data** | — |
| **Expected Result** | **Back to dashboard** returns to the school Classes page; **Create more classes** returns to a fresh Create new classes form. `[ASSUMED]` — confirm "Create more classes" resets the form. |
| **Remarks** | "Back to dashboard" covered by automation `TST_CCLS_TC_8`. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 44 |
| **Test Case ID** | TST_BCCF_TC_13 |
| **Title** | Verify a class name at the 50-character maximum is accepted |
| **Linked Requirement** | #3 — Verify bulk class creation form is working fine |
| **Type** | Edge |
| **Priority** | Low |
| **Preconditions** | On a class row. |
| **Test Steps** | 1. Enter a 50-character class name. |
| **Test Data** | 50-char name |
| **Expected Result** | The name is accepted (input enforces maxlength 50); no more than 50 characters can be entered. |
| **Remarks** | Automated: `TST_CCLS_TC_11` (asserts class-name input maxlength = 50). |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 45 |
| **Test Case ID** | TST_BCCF_TC_14 |
| **Title** | Verify the end date cannot be set before the start date |
| **Linked Requirement** | #3 — Verify bulk class creation form is working fine |
| **Type** | Edge |
| **Priority** | Medium |
| **Preconditions** | A start date is set on a row. |
| **Test Steps** | 1. Open the **End date** picker. |
| **Test Data** | Start = today |
| **Expected Result** | Dates on/before the start date are disabled in the end-date picker, so an end date earlier than the start cannot be chosen. |
| **Remarks** | Observed: days ≤ start are `owl-dt-calendar-cell-disabled`. Automated: `TST_CCLS_TC_12`. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 46 |
| **Test Case ID** | TST_BCCF_TC_15 |
| **Title** | Verify Create is disabled until class name and both dates are provided |
| **Linked Requirement** | #3 — Verify bulk class creation form is working fine |
| **Type** | Negative |
| **Priority** | High |
| **Preconditions** | On the Create new classes form. |
| **Test Steps** | 1. Fill only some of {name, start date, end date} on a row. 2. Observe the **Create** button. |
| **Test Data** | Incomplete row |
| **Expected Result** | The "Create N class" button stays disabled until the row has a class name AND start date AND end date. |
| **Remarks** | Automated: `TST_CCLS_TC_9` (asserts Create is disabled on an empty row). |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 47 |
| **Test Case ID** | TST_BCCF_TC_16 |
| **Title** | Verify an empty or non-alphanumeric class name is rejected |
| **Linked Requirement** | #3 — Verify bulk class creation form is working fine |
| **Type** | Negative |
| **Priority** | Medium |
| **Preconditions** | On a class row. |
| **Test Steps** | 1. Leave the class name empty, or enter only non-alphanumeric characters (e.g. `---`). 2. Attempt to create. |
| **Test Data** | Name: (empty) / `---` |
| **Expected Result** | The row is invalid — the name requires at least one alphanumeric character (pattern `.*[A-Za-z0-9]+.*`) — so the class cannot be created. `[ASSUMED]` — capture any inline error text shown. |
| **Remarks** | Automated: `TST_CCLS_TC_10` (enters `---`, asserts Create stays disabled). |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

### Requirement #10 — Verify manage grading scales page

| Field | Value |
|---|---|
| **S.No.** | 48 |
| **Test Case ID** | TST_GSCL_TC_1 |
| **Title** | Verify the Manage grading scales page loads with all components |
| **Linked Requirement** | #10 — Verify manage grading scales page |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as school admin, inside school FCN-CHZ-PDA. |
| **Test Steps** | 1. Click **School settings**. 2. Click **Manage grading scales**. |
| **Test Data** | — |
| **Expected Result** | The Grading scales page opens (`/grading-scales/manage`) with heading "Grading scales", a **User guide**, a **Create grading scale** button, and a list of scales. The system "Cambridge One grading scale" shows a **default** badge and only **View details**; custom scales offer **View details / Set as default / Delete** via **Open drop down**. |
| **Remarks** | Reached via the School settings dropdown. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

### Requirement #11 — Verify Create grading scale

| Field | Value |
|---|---|
| **S.No.** | 49 |
| **Test Case ID** | TST_GSCL_TC_2 |
| **Title** | Verify a grading scale is created with a title, bands and target score |
| **Linked Requirement** | #11 — Verify Create grading scale |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | On the Grading scales page. |
| **Test Steps** | 1. Click **Create grading scale**. 2. Enter a title. 3. Enter the Highest grade name + **From %**. 4. Enter the Lowest grade name + **To %**. 5. Mark a band as **Set as target score**. 6. Click **Save grading scale**. |
| **Test Data** | Title `AutoTest Scale`; Highest `A` 50–100%; Lowest `F` 0–49%; target = A |
| **Expected Result** | The scale is created and appears in the list showing its target score; bands cover 0–100% without overlap. |
| **Remarks** | Highest To is fixed 100%, Lowest From is fixed 0%. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 50 |
| **Test Case ID** | TST_GSCL_TC_3 |
| **Title** | Verify a middle band can be added with "+ Add new grade" |
| **Linked Requirement** | #11 — Verify Create grading scale |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | On the Create grading scale form. |
| **Test Steps** | 1. Click **+ Add new grade**. 2. Enter the middle band's name + From–To %. |
| **Test Data** | Middle band `B` 50–79%, adjust others to keep 0–100% coverage |
| **Expected Result** | A middle band row is added between Highest and Lowest; the scale still requires bands to cover 0–100% without overlap. |
| **Remarks** | — |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 51 |
| **Test Case ID** | TST_GSCL_TC_4 |
| **Title** | Verify the maximum-grading-scales limit is enforced |
| **Linked Requirement** | #11 — Verify Create grading scale |
| **Type** | Edge |
| **Priority** | Medium |
| **Preconditions** | School is already at the maximum number of grading scales. |
| **Test Steps** | 1. Attempt to create another grading scale. |
| **Test Data** | — |
| **Expected Result** | A modal is shown: "You have reached the maximum number of grading scales for this school. Please remove at least one grading scale to add a new one"; no new scale is created. `[ASSUMED]` — confirm the exact maximum. |
| **Remarks** | — |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 52 |
| **Test Case ID** | TST_GSCL_TC_5 |
| **Title** | Verify Save is disabled until title, valid bands and target are provided |
| **Linked Requirement** | #11 — Verify Create grading scale |
| **Type** | Negative |
| **Priority** | High |
| **Preconditions** | On the Create grading scale form. |
| **Test Steps** | 1. Leave the title empty, or set bands that overlap / do not add up to 100%, or omit the target score. 2. Observe the **Save grading scale** button. |
| **Test Data** | Incomplete/invalid bands |
| **Expected Result** | **Save grading scale** stays disabled until the scale has a title, bands covering 0–100% without overlap, and a target score selected. `[ASSUMED]` — capture the exact overlap/gap validation copy. |
| **Remarks** | — |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

### Requirement #12 — Verify view details page of grading scale

| Field | Value |
|---|---|
| **S.No.** | 53 |
| **Test Case ID** | TST_GSCL_TC_6 |
| **Title** | Verify the grading scale View details page opens |
| **Linked Requirement** | #12 — Verify view details page of grading scale |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | On the Grading scales page with ≥ 1 scale. |
| **Test Steps** | 1. Click **Open drop down** on a scale. 2. Click **View details**. |
| **Test Data** | Scale: `AutoTest Scale` |
| **Expected Result** | The details page opens (`/grading-scales/<id>`, title = scale name) with a collapsible **Grading scale bands** section and a **Classes (N)** section; when applied to no classes it shows "No classes yet. To associate the grading scale with a class, go to its 'Class grade settings' page". |
| **Remarks** | — |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

### Requirement #13 — Launch class grade setting page from view details page of grading scale

| Field | Value |
|---|---|
| **S.No.** | 54 |
| **Test Case ID** | TST_GSCL_TC_7 |
| **Title** | Verify the class grade settings page launches from a scale's details page |
| **Linked Requirement** | #13 — Launch class grade setting page from view details page of grading scale |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | The grading scale is applied to ≥ 1 class (so the details page lists it). |
| **Test Steps** | 1. Open the scale's **View details** page. 2. Click a listed class under "Classes". |
| **Test Data** | A scale applied to a class `[ASSUMED]` |
| **Expected Result** | The class grade settings page opens for the selected class. `[ASSUMED]` — exact destination pending a scale applied to a class (tested scale had 0 classes). |
| **Remarks** | Associate a scale with a class via the class grade settings page first. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

### Requirement #14 — Verify set as default for a grading scale

| Field | Value |
|---|---|
| **S.No.** | 55 |
| **Test Case ID** | TST_GSCL_TC_8 |
| **Title** | Verify a grading scale can be set as the school default |
| **Linked Requirement** | #14 — Verify set as default for a grading scale |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | A custom (non-default) grading scale exists. |
| **Test Steps** | 1. Open the custom scale's **Open drop down** → **Set as default**. 2. In the confirmation, click **Yes, set as default**. |
| **Test Data** | Scale: `AutoTest Scale` |
| **Expected Result** | A confirmation "Set as default for the school? All newly created classes will be associated with this grading scale. Existing classes will not be affected" is shown; after **Yes, set as default** the scale becomes the default (the **default** badge moves to it). |
| **Remarks** | Only non-default scales offer "Set as default". |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

### Requirement #15 — Verify deleting a grading scale

| Field | Value |
|---|---|
| **S.No.** | 56 |
| **Test Case ID** | TST_GSCL_TC_9 |
| **Title** | Verify a grading scale is deleted after confirmation |
| **Linked Requirement** | #15 — Verify deleting a grading scale |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | A deletable (non-default) grading scale exists. |
| **Test Steps** | 1. Open the scale's **Open drop down** → **Delete**. 2. In the confirmation, click **Yes, delete**. |
| **Test Data** | Scale: `AutoTest Scale` |
| **Expected Result** | A confirmation "Are you sure? Deleting the grading scale will not affect classes associated with it, but it won't be available to apply to any new classes." is shown; after **Yes, delete** the scale is removed from the list. |
| **Remarks** | — |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 57 |
| **Test Case ID** | TST_GSCL_TC_10 |
| **Title** | Verify deleting a grading scale can be cancelled |
| **Linked Requirement** | #15 — Verify deleting a grading scale |
| **Type** | Edge |
| **Priority** | Low |
| **Preconditions** | A deletable grading scale exists. |
| **Test Steps** | 1. Open **Open drop down** → **Delete**. 2. In the confirmation, click **No, go back**. |
| **Test Data** | — |
| **Expected Result** | The confirmation closes and the scale remains in the list (not deleted). |
| **Remarks** | — |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 58 |
| **Test Case ID** | TST_GSCL_TC_11 |
| **Title** | Verify the default grading scale cannot be deleted |
| **Linked Requirement** | #15 — Verify deleting a grading scale |
| **Type** | Negative |
| **Priority** | Medium |
| **Preconditions** | On the Grading scales page (the "Cambridge One grading scale" is the default). |
| **Test Steps** | 1. Open the **Open drop down** on the default scale. |
| **Test Data** | Default scale: `Cambridge One grading scale` |
| **Expected Result** | The default scale's menu offers only **View details** — there is no **Delete** (nor **Set as default**) — so the default scale cannot be deleted. |
| **Remarks** | — |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

### Requirement #16 — Verify expanding grading scale bands

| Field | Value |
|---|---|
| **S.No.** | 59 |
| **Test Case ID** | TST_GSCL_TC_12 |
| **Title** | Verify expanding the grading scale bands shows the bands |
| **Linked Requirement** | #16 — Verify expanding grading scale bands |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | On a grading scale's View details page. |
| **Test Steps** | 1. Click **Grading scale bands**. |
| **Test Data** | Scale: `AutoTest Scale` |
| **Expected Result** | The section expands to list the bands as **Grade name / Band** (e.g. `A` → `50% - 100%` with "Target score: 50%", `F` → `0% - 49%`). |
| **Remarks** | — |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

### Requirement #21 — Add label in class

| Field | Value |
|---|---|
| **S.No.** | 60 |
| **Test Case ID** | TST_CMGT_TC_1 |
| **Title** | Verify an existing label can be added to a class |
| **Linked Requirement** | #21 — Add label in class |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | A class is open (launched from the Classes tab → `…/view/classdata`). |
| **Test Steps** | 1. Click **+ Add labels**. 2. Select an existing label. |
| **Test Data** | Label: `VM1` |
| **Expected Result** | The selected label is applied to the class and shown on it. |
| **Remarks** | Same label list as the bulk-create form (`TST_BCCF_TC_5`). |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 61 |
| **Test Case ID** | TST_CMGT_TC_2 |
| **Title** | Verify a new label can be created and applied to a class |
| **Linked Requirement** | #21 — Add label in class |
| **Type** | Positive |
| **Priority** | Low |
| **Preconditions** | A class is open. |
| **Test Steps** | 1. Click **+ Add labels**. 2. Click **+ Create new label**. 3. Enter a label name and save. |
| **Test Data** | New label: `AutoTest Label` |
| **Expected Result** | The new label is created, applied to the class, and becomes available to select for other classes. `[ASSUMED]` — confirm the create-label form. |
| **Remarks** | — |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

### Requirement #23 — Verify delete classes (soft / hard / bulk up to 50)

| Field | Value |
|---|---|
| **S.No.** | 62 |
| **Test Case ID** | TST_CMGT_TC_3 |
| **Title** | Verify soft-deleting a single active class |
| **Linked Requirement** | #23 — Verify delete classes (soft / hard / bulk up to 50) |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | On the Classes tab with ≥ 1 active class. |
| **Test Steps** | 1. Select a class row checkbox. 2. Click **Delete class**. 3. In the WARNING confirmation, click **Yes, delete 1 class**. |
| **Test Data** | An active class |
| **Expected Result** | A WARNING confirmation is shown ("1 selected class has not ended. There might be students, teachers and course materials in the selected classes. Are you sure you want to delete?"). After **Yes**, the class is removed from Active and moves to the deleted/Ended section (soft delete). A note appears: "This will take a few minutes. Deleted classes may show on dashboards for a few minutes before they are removed." |
| **Remarks** | Soft delete is restorable. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 63 |
| **Test Case ID** | TST_CMGT_TC_4 |
| **Title** | Verify bulk-deleting multiple classes |
| **Linked Requirement** | #23 — Verify delete classes (soft / hard / bulk up to 50) |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | On the Classes tab with ≥ 2 active classes. |
| **Test Steps** | 1. Select multiple class checkboxes (or use select-all). 2. Click **Delete class**. 3. Confirm **Yes, delete N classes**. |
| **Test Data** | Multiple classes |
| **Expected Result** | The selected classes are soft-deleted together; the confirmation reflects the count ("Yes, delete N classes"). |
| **Remarks** | — |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 64 |
| **Test Case ID** | TST_CMGT_TC_5 |
| **Title** | Verify a class can be permanently (hard) deleted when all conditions are met |
| **Linked Requirement** | #23 — Verify delete classes (soft / hard / bulk up to 50) |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | A deleted class that has: no students; ≤ 1 teacher (the one deleting) or none; no groups; no assignments; no grading scales; no grading categories; no locking/unlocking rules. |
| **Test Steps** | 1. Open the deleted class (Deleted filter / Ended section). 2. Choose the permanent-delete option. 3. Confirm. |
| **Test Data** | A deleted class meeting all 7 conditions |
| **Expected Result** | The class is permanently removed and can no longer be restored. `[ASSUMED]` — capture the exact permanent-delete UI/location and confirmation. |
| **Remarks** | The 7 conditions (per AdminApp.xlsx) must all be satisfied to hard-delete. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 65 |
| **Test Case ID** | TST_CMGT_TC_6 |
| **Title** | Verify bulk delete supports up to 50 classes |
| **Linked Requirement** | #23 — Verify delete classes (soft / hard / bulk up to 50) |
| **Type** | Edge |
| **Priority** | Medium |
| **Preconditions** | On the Classes tab with many classes. |
| **Test Steps** | 1. Select up to 50 classes. 2. Click **Delete class** and confirm. |
| **Test Data** | 50 classes |
| **Expected Result** | Up to 50 classes can be selected and deleted in a single action. `[ASSUMED]` — confirm the 50-class maximum. |
| **Remarks** | Scenario title references "50 classes". |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 66 |
| **Test Case ID** | TST_CMGT_TC_7 |
| **Title** | Verify deleting a class can be cancelled |
| **Linked Requirement** | #23 — Verify delete classes (soft / hard / bulk up to 50) |
| **Type** | Edge |
| **Priority** | Low |
| **Preconditions** | On the Classes tab with ≥ 1 class selected. |
| **Test Steps** | 1. Click **Delete class**. 2. In the confirmation, click **No, cancel**. |
| **Test Data** | — |
| **Expected Result** | The confirmation closes and the class is not deleted. |
| **Remarks** | — |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 67 |
| **Test Case ID** | TST_CMGT_TC_8 |
| **Title** | Verify a class cannot be permanently deleted when conditions are not met |
| **Linked Requirement** | #23 — Verify delete classes (soft / hard / bulk up to 50) |
| **Type** | Negative |
| **Priority** | Medium |
| **Preconditions** | A class that still has students / another teacher / groups / assignments / grading scales / grading categories / locking rules. |
| **Test Steps** | 1. Attempt to permanently delete it. |
| **Test Data** | A class violating ≥ 1 of the 7 conditions |
| **Expected Result** | Permanent deletion is blocked/unavailable until all 7 conditions are satisfied. `[ASSUMED]` — capture the exact blocking behaviour/message. |
| **Remarks** | — |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

### Requirement #30 — Verify count of classes increase on adding a new class

| Field | Value |
|---|---|
| **S.No.** | 68 |
| **Test Case ID** | TST_CMGT_TC_9 |
| **Title** | Verify the active-class count increases after adding a new class |
| **Linked Requirement** | #30 — Verify count of classes increase on adding a new class |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | On the Classes tab. |
| **Test Steps** | 1. Note the current "Active classes (N)". 2. Add a class (Add class → fill name + dates → Create). 3. After creation is processed, refresh the Classes tab. |
| **Test Data** | One new class |
| **Expected Result** | Once the (asynchronous) creation completes, the Active classes count increases by 1 (N → N+1). |
| **Remarks** | Creation is async ("up to 12 hours"), so the count updates after processing, not instantly — align the check with the automation baseline (`TST_SCLS_TC_1`). |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

## Open items / `[ASSUMED]` to confirm on the next live pass

1. **Search behaviour** (TST_CLST_TC_18): whether search is partial + case-insensitive or exact-match.
2. **No-results / empty-state copy** (TST_CLST_TC_21, TC_22): exact message text.
3. **Load-more** (TST_CLST_TC_20): whether the link hides or disables once all classes are loaded; page size.
4. **Class label** (TST_CLST_TC_4): a concrete existing label value (`<EXISTING_CLASS_LABEL>`), pending scenario #21 (Add label).
5. Whether filtering updates the section counts, and whether "Ended/Expired/Deleted" statuses each render distinctly.
6. **Grading categories — max count** (TST_GCAT_TC_4): the exact maximum number of grading categories per school.
7. **Grading categories — 50-char boundary** (TST_GCAT_TC_3): confirm the name field truncates at 50 and rejects longer input.
8. **Grading categories — launch grade settings** (TST_GCAT_TC_7): the exact class link/destination on a category's details page once the category is applied to a class (all categories tested had 0 classes).
9. **Bulk form — Duplicate** (TST_BCCF_TC_7): exact duplicate behaviour / confirmation.
10. **Bulk form — Copy an Existing Class** (TST_BCCF_TC_8): the modal's source-class selection and copy options.
11. **Bulk form — CSV** (TST_BCCF_TC_10, TC_11): the exact template headers and the upload flow/validation.
12. **Bulk form — Create more classes** (TST_BCCF_TC_12) and **invalid-name inline error** (TST_BCCF_TC_16): confirm the form-reset behaviour and any error copy.
13. **Grading scales — max count** (TST_GSCL_TC_4): the exact maximum number of grading scales per school.
14. **Grading scales — band validation** (TST_GSCL_TC_5): the exact copy/behaviour when bands overlap or don't sum to 100%.
15. **Grading scales — launch grade settings** (TST_GSCL_TC_7): the class link/destination on a scale's details page once the scale is applied to a class (tested scale had 0 classes).
16. **Hard/permanent delete** (TST_CMGT_TC_5, TC_8): the exact permanent-delete UI/location and the blocking behaviour when the 7 conditions aren't met.
17. **Bulk delete 50-class max** (TST_CMGT_TC_6): confirm the 50-class selection maximum.
18. **New label creation from the class page** (TST_CMGT_TC_2): confirm the create-label form/flow.

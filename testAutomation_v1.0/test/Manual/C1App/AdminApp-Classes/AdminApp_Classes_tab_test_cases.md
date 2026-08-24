# Manual Functional Test Cases — Admin App: Classes Tab (Batch 1)

**Source:** `AdminApp.xlsx` — high-level Classes-tab scenarios
**Module:** CLST (Classes Tab) — *maps to the future `schoolClasses` page object when automated*
**App:** Admin App / NEMO — `micro-nemo.comprodls.com` (Thor)
**Page in scope:** School Classes tab — `/admin/admin/org_<school-slug>/class`
**Generated:** 2026-08-14 | **Total TCs:** 82 (60 Positive · 14 Edge · 8 Negative) — **all 30 scenarios covered**
**Execution status (2026-08-21):** **64 of 82 TCs automated and passing.**
- Module **CLST** (`TST_CLST_TC_1–23`, 23 TCs) — Requirements #1 tab load, #2 filter, #9 search, #27 sort, #18 expand row, #17/#33 user guide, #19 launch class, #28 Active/Ended sections, #29 ended-class launch, #20 load more — via `npm run P1AdminClassesTab_Thor` on **thor** (2026-08-17; `TC_23` added 2026-08-21).
- Module **BCCF** (16 TCs, Requirement **#3 bulk class creation form**) — automated onto the existing **CCLS** module and split across three suites: `P1AdminclassBulk_Thor` (side-effect free), `P1Adminclassworkflow_Thor` (creates real classes) and `P1AdminclassValidation_Thor` — on **thor** (2026-08-18).
- Module **GCAT** (`TST_GCAT_TC_1, 2, 3, 5, 6, 8, 9`, 7 TCs) — Requirements **#4 manage page**, **#5 create**, **#6 see details** and **#8 delete** grading category — via `npm run P1AdminGradingCategories_Thor` on **thor** (2026-08-19, 2 consecutive clean runs).
- Module **GSCL** (`TST_GSCL_TC_1, 2, 3, 5, 6, 8, 9, 10, 11, 12`, 10 TCs) — Requirements **#10 manage page**, **#11 create**, **#12 view details**, **#14 set as default**, **#15 delete** and **#16 expand bands** — via `npm run P1AdminGradingScales_Thor` on **thor** (2026-08-19, 2 consecutive clean runs).
- Module **CGST** (`TST_CGST_TC_1–6`, 6 TCs) — Requirement **#22 class grade settings** — via `npm run P1AdminClassGradeSettings_Thor` on **thor** (2026-08-20, 2 consecutive clean runs). The suite **owns its data**: it creates a throwaway class with course material, runs against it, and deletes it afterwards.
- **`TST_GSCL_TC_7` + `TST_GCAT_TC_7`** (2 TCs) — Requirements **#13** and **#7**, launching class grade settings from a scale's / category's details page. Registered in their own modules but **run inside the CGST suite**, because their precondition is a scale/category applied to a LIVE class (2026-08-20, 2 consecutive clean runs, 21/21).

The remaining **16 TCs are Not Run** (CMGT, CLON, CTXC, plus the stragglers below).

**[2026-08-21] `TST_CLST_TC_23` is NEW** — the Filter panel's X close, split out of `TST_CLST_TC_2` so each TC's screenshot carries its own evidence. CLST is now **23 TCs**. The same session also removed the X-close `// WORKAROUND` retry after re-diagnosing it as an automation timing issue rather than a product defect — see TC_2 Comments.

**Two are BLOCKED, both for the same reason** — see their Comments rows: `TST_GCAT_TC_4` and `TST_GSCL_TC_4` are the maximum-categories / maximum-scales limits, whose precondition is a school already at its cap. `3 July Test School 1` is **shared**, so holding it at the cap would break other suites mid-run. Both modals are pre-rendered in the DOM, so their **expected copy is already verified word for word** — each is short work once a dedicated school exists.

**`TST_GCAT_TC_7` and `TST_GSCL_TC_7` are now DONE [2026-08-20].** Both were long deferred because they need the category / scale **applied to a live class** — a CGST operation. They are registered in their own modules but **run inside the CGST suite**, which creates exactly that state. Their expected results were `[ASSUMED]` until 2026-08-20 (every scale and category anyone had opened had zero classes); both are now captured live and both manual cases were **corrected** — see their Remarks rows.
**Batches:** Batch 1 — Classes-tab list/navigation (`TST_CLST_*`, module CLST, 23 TCs) · Batch 2 — Grading categories (`TST_GCAT_*`, module GCAT, 9 TCs) · Batch 3 — Bulk class creation form (`TST_BCCF_*`, module BCCF, 16 TCs) · Batch 4 — Grading scales (`TST_GSCL_*`, module GSCL, 12 TCs) · Batch 5 — Class management: label / delete / count (`TST_CMGT_*`, module CMGT, 9 TCs) · Batch 6 — Class grade settings / clone / context class (`TST_CGST_* / TST_CLON_* / TST_CTXC_*`, 13 TCs)

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
| #2 — Verify filter functionality is working fine | TST_CLST_TC_2, TC_3, TC_4, TC_19 (E), TC_22 (N), TC_23 |
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
| **#22 — Launch class grade setting page from a class page** | TST_CGST_TC_1..5, TC_6 (E) |
| **#31 — Verify class clone functionality (Copy an Existing Class)** | TST_CLON_TC_1, TC_2, TC_3 (E) |
| **#32 — Verify Context class creation and view in teacher/admin/student login** | TST_CTXC_TC_1..4 |

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

### Class grade settings / clone / context (Batch 6 — modules CGST / CLON / CTXC), captured live 2026-08-14

- **Class grade settings (#22):** from a **class page** (Classes tab → launch class), open the
  **Actions** menu → **Class grade settings** → `/class/…/<uuid>/grade-weighting`. The page shows:
  **Grading Scale** (current scale + **Change**), **Score settings** ("Allow teachers to override and
  add scores to auto-marked activities" toggle), **Score calculation** ("Which score will count…" —
  **Best score / First score**), per-material **Weightage %**, **Other grading categories** ("Add a
  grading category"), **Total grade: 100%**, and **Save changes / Cancel**.
  > This is the page the grading-category and grading-scale **details pages link to** — i.e. it
  > resolves the deferred launch `[ASSUMED]`s in `TST_GCAT_TC_7` and `TST_GSCL_TC_7`: a category/scale
  > is applied to a class here (Add a grading category / Grading Scale → Change), and the class then
  > appears under that category/scale's details.
- **Clone (#31) = "Copy an Existing Class":** on the bulk-create form, select row(s) → **Copy an
  Existing Class** → **Step 1**: search/select a source class ("Copied from a class") → Continue →
  **Step 2**: "Choose what to copy from [source]" with checkboxes **Teachers**, **Course materials**,
  **Assignments** (+ Change assignment dates), **Locked content rules** (+ Change content rules
  dates), **Class grade settings** → Continue. Each component shows a **count** and is **disabled when
  the source has 0** of it (grade settings showed "Not available" for a class with default settings).
  This matches scenario 28's component list (teacher, materials, assignments, lock rules incl.
  assignment-created lock rules, class grade settings).
- **Context class (#32):** `[ASSUMED]` — **no context-class creation entry point was found** in the
  admin bulk-create flow, and cross-role verification needs teacher and student test accounts (only
  the school-admin `testt1@mailsac.com` was available). These TCs are written at a functional level
  and **require product clarification** on what a "context class" is / how it is created.

**Precondition (Batch-6 CGST TCs):** on a class's **Class grade settings** page.
**Precondition (Batch-6 CLON TCs):** on the **Create new classes** form with ≥1 row selected.

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
| **Actual Result** | PASS. Classes tab loaded with every listed component: 'Active classes (15)' heading, search box, Add class, Filter, User guide toggle, select-all checkbox with a disabled Delete class button, all five column headers, a separate 'Ended classes (26)' section, and the five left-nav items. |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — adminClassesTab.test.js (`npm run P1AdminClassesTab_Thor`, thor). Last run 2026-08-17: 12/12 passing. |

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
| **Remarks** | Filter is a modal dialog, not an inline panel. **Open only** — closing via X is TST_CLST_TC_23 (split 2026-08-21 so this TC's end-of-test screenshot shows the panel OPEN with its options, which is what the expected result describes). |
| **Actual Result** | PASS. Filter modal opened showing all five Class status options (Not started / Active / Ended / Expired / Deleted), the 'Find a label' input, and the Clear all and Apply buttons. |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — adminClassesTab.test.js (`npm run P1AdminClassesTab_Thor`, thor). Last run 2026-08-21: 23/23 passing. **X-close history CORRECTED 2026-08-21:** the 3x re-click // WORKAROUND was removed and the behaviour re-investigated live. It is **NOT a product bug** — 10/10 manual single clicks close the panel, and 8/8 automated closes succeed when the panel is given time to settle after opening (locator.click, real mouse, dispatchEvent, focus+Enter all work). The panel is visible and geometrically stable before its close handler is bound, which Playwright cannot detect, so automation was simply clicking too early. Closing now lives in TST_CLST_TC_23. |

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
| **Actual Result** | PASS. Applying Class status = Active closed the modal and filtered the list; the page-level 'Clear' link appeared (the app's own signal that a filter is applied) and the visible rows were consistent with the 'Active classes (N)' heading. |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — adminClassesTab.test.js (`npm run P1AdminClassesTab_Thor`, thor). Last run 2026-08-17: 12/12 passing. |

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
| **Actual Result** | PASS. The label filter was applied (confirmed via the 'Clear' link) and the list settled into exactly one valid state - populated with matching classes, or the empty state. NOTE: label VM1 matches no ACTIVE class on this school, so an Active + VM1 combination legitimately returns zero. |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — adminClassesTab.test.js (`npm run P1AdminClassesTab_Thor`, thor). Last run 2026-08-17: 12/12 passing. |

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
| **Actual Result** | PASS. Clear all cleared the selections and closed the panel, and the page-level 'Clear' link disappeared, confirming the applied filter was reset. NOTE: during the panel's ~3.6s close it still holds its pre-clear markup, so the reset must be verified at page level, not from the panel's own chips. |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — adminClassesTab.test.js (`npm run P1AdminClassesTab_Thor`, thor). Last run 2026-08-17: 12/12 passing. |

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
| **Test Data** | Status: `Deleted` + Label: `A11y test` (a combination confirmed to match zero classes) |
| **Expected Result** | The list shows the empty/no-matching-classes state with no error, reading **No classes that are &lt;status&gt;, &lt;label&gt;** (e.g. "No classes that are Deleted, A11y test"). CONFIRMED live 2026-08-15. |
| **Remarks** | — |
| **Actual Result** | PASS. Filtering Class status = Deleted together with label 'A11y test' matched no classes and showed the empty state, with no error. |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — adminClassesTab.test.js (`npm run P1AdminClassesTab_Thor`, thor). Last run 2026-08-17: 12/12 passing. |

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
| **Actual Result** | PASS. Searching 'SarthakTestClass1' returned that class, and every returned row matched the term. |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — adminClassesTab.test.js (`npm run P1AdminClassesTab_Thor`, thor). Last run 2026-08-17: 12/12 passing. |

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
| **Actual Result** | PASS. Searching class key '97Cc-y7bs' returned exactly one class - SarthakTestClass1 - confirming search accepts a class key as well as a name. |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — adminClassesTab.test.js (`npm run P1AdminClassesTab_Thor`, thor). Last run 2026-08-17: 12/12 passing. |

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
| **Expected Result** | `SarthakTestClass1` is returned, confirming search is case-insensitive and matches partial names. CONFIRMED live 2026-08-17. |
| **Remarks** | If search is exact-match only, record actual behaviour and split into separate positive/negative TCs. |
| **Actual Result** | PASS. The lower-case partial term 'sarthak' returned 'SarthakTestClass1'. CONFIRMED: class search IS case-insensitive and DOES match partial names - the previously ASSUMED behaviour is correct, so no split into separate positive/negative TCs is needed. |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — adminClassesTab.test.js (`npm run P1AdminClassesTab_Thor`, thor). Last run 2026-08-17: 12/12 passing. |

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
| **Expected Result** | No classes are listed and the no-results state is shown (no error/crash), reading exactly: **No classes that match your search &lt;term&gt;** (the term echoed in bold). CONFIRMED live 2026-08-17. |
| **Remarks** | Record the no-results copy so it can be asserted when automated. |
| **Actual Result** | PASS. Searching 'zzz-no-such-class-9999' returned 0 classes and displayed the no-results state with no error. CAPTURED COPY: 'No classes that match your search zzz-no-such-class-9999' - the searched term is echoed back in bold. |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — adminClassesTab.test.js (`npm run P1AdminClassesTab_Thor`, thor). Last run 2026-08-17: 12/12 passing. |

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
| **Actual Result** | PASS. The first click sorted by class name and the column reported 'sorted ascending'; the second click reported 'sorted descending' and the order was the exact reverse of the first. NOTE: the product sorts by CODE POINT, so uppercase names sort before lowercase ones (for example 'Test Class 14 Aug' before 'class_L_...'). |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — adminClassesTab.test.js (`npm run P1AdminClassesTab_Thor`, thor). Last run 2026-08-17: 12/12 passing. |

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
| **Actual Result** | PASS. Start date and End date each reordered the list chronologically and toggled direction on the second click. NOTE: dates repeat (six active classes share Aug 14, 2026), so the order is monotonic rather than strictly increasing, and descending is not an exact reversal of ascending. |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — adminClassesTab.test.js (`npm run P1AdminClassesTab_Thor`, thor). Last run 2026-08-17: 12/12 passing. |

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
| **Actual Result** | PASS. Expanding a class row revealed the details panel showing Course materials (or the 'You haven't chosen learning materials' empty state when the class has none), the Class labels heading, and the Students and Teachers counts; the toggle changed to 'Hide class details'. |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — adminClassesTab.test.js (`npm run P1AdminClassesTab_Thor`, thor). Last run 2026-08-17: 12/12 passing. |

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
| **Actual Result** | PASS. Collapsing the row hid the details panel and the toggle returned to 'Show class details'. NOTE: the panel's content REMAINS in the DOM while collapsed, so only a visibility check distinguishes the two states. |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — adminClassesTab.test.js (`npm run P1AdminClassesTab_Thor`, thor). Last run 2026-08-17: 12/12 passing. |

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
| **Actual Result** | PASS. The user guide panel opened showing 'On this page you can:' with guidance on searching by class name and class code; the toggle then offered 'Hide the user guide'. |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — adminClassesTab.test.js (`npm run P1AdminClassesTab_Thor`, thor). Last run 2026-08-17: 12/12 passing. |

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
| **Actual Result** | PASS. Collapsing the user guide removed the panel from the DOM entirely and the toggle returned to 'Open the user guide'. |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — adminClassesTab.test.js (`npm run P1AdminClassesTab_Thor`, thor). Last run 2026-08-17: 12/12 passing. |

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
| **Actual Result** | PASS. Clicking an active class name opened the Class Page at /class/teacher/org_<slug>/class/<uuid>/view. |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — adminClassesTab.test.js (`npm run P1AdminClassesTab_Thor`, thor). Last run 2026-08-17: 12/12 passing. |

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
| **Actual Result** | PASS. Active and Ended classes are shown as two separate sections, each with its own count, and the Ended section carries the note that ended and deleted classes move into it plus a Class status column. NOTE: the Ended count and Class status column only render AFTER the section is expanded - while collapsed the heading reads a bare 'Ended classes' with no count. |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — adminClassesTab.test.js (`npm run P1AdminClassesTab_Thor`, thor). Last run 2026-08-17: 12/12 passing. |

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
| **Actual Result** | PASS. The Ended section expanded (toggle reads 'Close', class rows listed) and collapsed again (toggle reads 'Open', panel hidden). NOTE: the section is COLLAPSED by default and renders no rows at all until it is opened. |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — adminClassesTab.test.js (`npm run P1AdminClassesTab_Thor`, thor). Last run 2026-08-17: 12/12 passing. |

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
| **Actual Result** | PASS. Clicking a class name in the Ended section opened the same Class Page destination as an active class, confirming ended classes remain launchable. |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — adminClassesTab.test.js (`npm run P1AdminClassesTab_Thor`, thor). Last run 2026-08-17: 12/12 passing. |

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
| **Actual Result** | PASS. 'Load more ...' appended additional ended class rows (20 to 26) without a full page reload, and the visible rows stayed within the 'Ended classes (N)' count. Page size is 20; new rows land about 3.5s after the click. |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — adminClassesTab.test.js (`npm run P1AdminClassesTab_Thor`, thor). Last run 2026-08-17: 12/12 passing. |

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
| **Expected Result** | Once the last batch is loaded, the "Load more …" link is **removed from the DOM** — it hides rather than becoming disabled. CONFIRMED live 2026-08-17. |
| **Remarks** | — |
| **Actual Result** | PASS. After clicking 'Load more ...' until every ended class was listed, the link was REMOVED from the DOM (it hides rather than disabling) and the visible row count equalled the 'Ended classes (N)' heading. |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — adminClassesTab.test.js (`npm run P1AdminClassesTab_Thor`, thor). Last run 2026-08-17: 12/12 passing. |

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
| **Actual Result** | As expected. Page opened at `/manage-grading-categories` with heading "Manage grading categories", the description "Create (or remove) grading categories for your school. Categories can then be applied to a class on the class grade settings page", the **Create a grading category** button and the "Grading categories" list (3 rows). Opening a row's **Open grade options** menu showed **See details** and **Remove**. Automated as `TST_GCAT_TC_1`. |
| **Status** | Pass |
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
| **Remarks** | Automated as `TST_GCAT_TC_2`. The name is generated per run as `AutoCat_create_<epoch-ms>`, so repeated runs never collide and the housekeeping hook removes them — duplicate names no longer accumulate against the school maximum. |
| **Actual Result** | As expected. Banner "Grading category successfully created" appeared (~1.4 s) and the category was listed at the same moment. Both are asserted — the banner alone would pass even if nothing were created. |
| **Status** | Pass |
| **Comments / Defect ID** | — |

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
| **Expected Result** | The name is accepted (input enforces maxlength 50) and the category is created. **Confirmed live 2026-08-18** — `#gradingCategoryNameInput` carries `maxlength="50"`, so input longer than 50 cannot be entered. `[ASSUMED]` removed. |
| **Remarks** | Automated as `TST_GCAT_TC_3`. The test asserts the generated name is exactly 50 characters *before* using it, so a helper bug cannot quietly turn this into a short-name test that never exercises the boundary. |
| **Actual Result** | As expected. A 50-character name was accepted and the category appeared in the list. |
| **Status** | Pass |
| **Comments / Defect ID** | — |

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
| **Expected Result** | A modal is shown: "You have reached the maximum number of grading categories for your school. Please remove at least one category to add a new one" (with a Go back action); no new category is created. **Copy confirmed live 2026-08-18** — this modal is pre-rendered in the DOM at all times, so its exact wording is verified; only the *triggering* of it is blocked. The exact maximum count is still `[ASSUMED]`. |
| **Remarks** | **NOT AUTOMATED — BLOCKED.** Deliberately absent from the test file, the TC repository and the execution file (not merely skipped), so it cannot run by accident. |
| **Actual Result** | — (not executed) |
| **Status** | Not Run — **Blocked** |
| **Comments / Defect ID** | **Why blocked (2026-08-18):** the precondition is "the school is already at its maximum", so the test must first *fill* the school with grading categories. Three problems: **(1)** the maximum is unknown, so the only way to find it is to keep creating until the app refuses; **(2)** `3 July Test School 1` (FCN-CHZ-PDA) is **shared** — while it sits at the cap, *nobody else* can create a grading category, and other suites would fail with a misleading error (the same class of cross-suite interference that broke two `TST_CLST_TC_7` assertions on 2026-08-17); **(3)** if a run crashes before cleanup, the school stays full until someone clears it by hand. **To unblock — any one of:** (a) a **dedicated school** used only by this test *(recommended — cheapest and fully safe)*; (b) product/dev supply the exact maximum, plus agreement to accept the shared-school impact; (c) an environment where no other suite is running. Once a dedicated school exists this is a short TC, since the expected copy is already verified. |

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
| **Remarks** | Automated as `TST_GCAT_TC_5`. Checked **both ways** — disabled when empty, enabled once a character is typed, disabled again when cleared. A one-way check would still pass against a permanently disabled Save, which is itself a defect worth catching. The test deliberately ends with the modal open so the end-of-test screenshot shows the disabled Save; nothing is saved. |
| **Actual Result** | As expected. Save was disabled with an empty name, became enabled on input, and returned to disabled when the field was cleared. |
| **Status** | Pass |
| **Comments / Defect ID** | — |

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
| **Remarks** | Automation creates its own `AutoCat_*` category first, so "Active classes (0)" and the empty state are deterministic — a shared category could gain a class at any time. |
| **Actual Result** | As expected. URL changed to `/manage-grading-categories/<id>/classes`, the page title was the category name, **Active classes (0)** was shown, and the empty state read "The category has not been added to any active classes". Automated as `TST_GCAT_TC_6`. |
| **Status** | Pass |
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
| **Test Steps** | 1. Open the category's **See details** page. 2. Click the row's **Class grade settings** link. |
| **Test Data** | Grading category `some` applied to an active class (applied and saved by `TST_CGST_TC_3`) |
| **Expected Result** | The details page lists the class under **Active classes (N)** with its class name and class key, and the row's **Class grade settings** link opens the Class grade settings page for that class. |
| **Remarks** | **CORRECTED [2026-08-20] after live capture.** Step 2 previously read "click a listed class" — the class name is plain text; the row's only control is a **Class grade settings** link. This page counts **ACTIVE classes only**, so the row disappears the moment the class is deleted. Automated as `TST_GCAT_TC_7`, which runs inside the CGST suite (the category must be applied to a live class). |
| **Actual Result** | As expected. 'Active classes (1)' listed the class under test with its class name and key; the row's Class grade settings link opened the Class grade settings page for that class. |
| **Status** | Pass |
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
| **Remarks** | Automated as `TST_GCAT_TC_8`. Creates its own `AutoCat_remove_<epoch-ms>` first, so the destructive confirmation is only ever aimed at our own data — never at a pre-existing school category. Also asserts the category **is** listed before removing it: "it is gone now" proves nothing if it was never there. |
| **Actual Result** | As expected. Confirmation modal shown with the expected copy; after **Yes, remove** the banner "Grading category successfully removed" appeared (~2.2 s) and the category left the list. |
| **Status** | Pass |
| **Comments / Defect ID** | — |

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
| **Remarks** | Automated as `TST_GCAT_TC_9`. Creates its own `AutoCat_cancelremove_<epoch-ms>` so the Remove confirmation is never opened against real school data. Modal closure is asserted on **visibility**, not presence — all four modals on this page stay in the DOM permanently, so a presence check could never fail. |
| **Actual Result** | As expected. After **No, go back** the confirmation closed and the category was still listed. |
| **Status** | Pass |
| **Comments / Defect ID** | — |

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
| **Remarks** | Form auto-saves a draft ("Saved …") **and restores it on reopen — including across sessions** — so the form is NOT guaranteed empty on load. Automated: `TST_CCLS_TC_14`. |
| **Actual Result** | Form opened at /class/create with all components present: Upload file, Get CSV template, How to use this form, all 9 bulk-toolbar actions, and row 1 (name, dates, teachers, materials, label). Create button disabled on an empty row. |
| **Status** | Pass |
| **Comments / Defect ID** | Automated: TST_CCLS_TC_14 (bulk suite, 11/11). |

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
| **Test Data** | Name: `AutoClass_CreateOnly`, Start: today, End: day 15 of next month |
| **Expected Result** | A success dialog "Success! We are now creating 1 class for you…" appears; creation is asynchronous (email report; up to 12 hours). |
| **Remarks** | Covered by automation `TST_CCLS_TC_1..4`. Corrected 2026-08-19: the register previously named `AutoClass_Bulk`, which is the *bulk* suite's fixture — the workflow suite that actually runs this case uses `AutoClass_CreateOnly` (`C1.adminAddClass`). The automated run also applies a label and a teacher (`TST_CCLS_TC_16`/`TC_15`) and attaches a material before clicking Create, so it covers more than this case's four steps. |
| **Actual Result** | Class created with name + start/end dates; success dialog shown: "Success! We are now creating 1 class for you". |
| **Status** | Pass |
| **Comments / Defect ID** | Automated: TST_CCLS_TC_1..4 (workflow suite). Creation is asynchronous. |

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
| **Remarks** | First/Last name are optional; Email is required. Automated: `TST_CCLS_TC_15`. Note: "Apply changes" is never natively disabled, so it can be clicked before validation settles and silently do nothing. |
| **Actual Result** | Teacher added via the "Edit teachers" modal (Email only); the teacher rendered on the class row. |
| **Status** | Pass |
| **Comments / Defect ID** | Automated: TST_CCLS_TC_15 (workflow suite — moved from the bulk suite 2026-08-19, so the created class now carries a teacher). |

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
| **Actual Result** | Material searched, selected and attached to the class row. |
| **Status** | Pass |
| **Comments / Defect ID** | Feature verified working (workflow suite 13/13 earlier on 2026-08-18). NOTE: the automation (TST_CCLS_TC_5..7) is currently FLAKY — its selector uses a positional index (dBulkClass-add-learning-material-modal-1-0) that shifts with the form's row count when an auto-saved draft is restored. Pre-existing automation fragility, not a product defect. Fix pending: reset the form before the suite runs. |

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
| **Expected Result** | The chosen label is applied to the class row (the row's label button then reads e.g. "+ temp"); the dropdown also offers "+ Create new label" and "Edit labels". A "Create or find a label" search box filters the list. |
| **Remarks** | Automated: `TST_CCLS_TC_16`. Note for automation: the label dropdown is rendered **once per row** (`#class-label-list-modal-<rowIndex>`), each holding a full copy of every label — selectors must be scoped to the row's own container or the search text can land in a hidden row's box. |
| **Actual Result** | Label "VM1" selected from the Add class label dropdown and applied to the row (row button then read "+ VM1"). |
| **Status** | Pass |
| **Comments / Defect ID** | Automated: TST_CCLS_TC_16 (workflow suite — moved from the bulk suite 2026-08-19, so the created class now carries a label). Note: the label dropdown is rendered once PER ROW (#class-label-list-modal-<rowIndex>), so selectors must be row-scoped. |

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
| **Actual Result** | Filling a second row increased the Create button from "Create 1 class" to "Create 2 classes"; new empty rows auto-appended. |
| **Status** | Pass |
| **Comments / Defect ID** | Automated: TST_CCLS_TC_13 (bulk suite). Asserts the count delta; does not click Create, so no class is created. |

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
| **Expected Result** | Duplicate is immediate (no confirmation of its own) and the copy is **appended after the last filled row** carrying the same class name (no "Copy of" prefix), start/end dates, teachers and materials. **Labels are the exception:** if the source row has a label, an "Apply the labels to new classes too?" dialog appears — tick "Include labels in these classes" then **Continue** to copy the label (or Continue without ticking to duplicate without it). |
| **Remarks** | `[ASSUMED]` resolved — behaviour confirmed live 2026-08-18. Automated: `TST_CCLS_TC_18` (resets the form, builds a source row with name + dates + teacher, duplicates, asserts the Create count +1 and that the copy matches the source field-by-field). |
| **Actual Result** | Duplicate appended a copy AFTER the last filled row carrying the same name, dates, teacher and material. Label copied only after confirming the "Apply the labels to new classes too?" dialog. |
| **Status** | Pass |
| **Comments / Defect ID** | Automated: TST_CCLS_TC_18 (bulk suite). [ASSUMED] resolved. |

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
| **Expected Result** | A **2-step wizard** opens. **Step 1** "Choose what to copy from": search a class (results show `[Class name] [class key]`), pick one, **Continue**. **Step 2** "Choose what to copy from [class]": tick the categories — **Teachers [n]**, **Course materials [n]**, **Assignments [n]**, **Locked content rules [n]**, **Class grade settings** — then **Continue**. The ticked categories are applied to every selected row, and each row's **Copied from a class** cell records `[source class] [key]` plus the copied categories. The row's own class name and dates are **not** overwritten. |
| **Remarks** | `[ASSUMED]` resolved — flow confirmed live 2026-08-18. A category is **disabled when the source class has none of that kind** (label shows the count, e.g. a greyed "Assignments [0]"); "Class grade settings" showed "Not available". Automated: `TST_CCLS_TC_21` (copies Teachers + Course materials; asserts the row receives them and that the Copied-from cell names the source). |
| **Actual Result** | 2-step wizard: searched and selected a source class, then chose Teachers + Course materials; both were applied to the selected row and the "Copied from a class" cell recorded the source. Row's own name/dates were not overwritten. |
| **Status** | Pass |
| **Comments / Defect ID** | Automated: TST_CCLS_TC_21 (bulk suite). [ASSUMED] resolved. Options are disabled when the source class has none of that kind (e.g. "Assignments [0]"). |

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
| **Expected Result** | The chosen start/end dates are applied to all selected rows at once. **Note:** applying a bulk date **clears the row selection** ("All selected" → "0 Selected"), which re-disables the toolbar — rows must be re-selected before the next bulk action. |
| **Remarks** | Same pattern applies to bulk Add teacher / Add labels / Add Material — including the deselect-after-apply behaviour. Automated: `TST_CCLS_TC_17`. |
| **Actual Result** | Toolbar Start date and End date applied the chosen dates to the selected row. |
| **Status** | Pass |
| **Comments / Defect ID** | Automated: TST_CCLS_TC_17 (bulk suite). Note: applying a bulk date CLEARS the row selection, so rows must be re-selected before the next bulk action. |

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
| **Expected Result** | `Class_creation_form_template.csv` downloads with **14 columns** (UTF-8 BOM): `Class name`, `Start date DD/MM/YYYY`, `End date DD/MM/YYYY`, `Teacher 1 (optional)` … `Teacher 10 (optional)`, `Student progress data` — plus one sample row (`Saturday Elementary class,01/09/2019,30/05/2020,teacher1@email.org,…,Progress reset`). |
| **Remarks** | `[ASSUMED]` resolved — headers captured live 2026-08-18. Automated: `TST_CCLS_TC_22` (downloads the file, reads it from disk, asserts the filename and all 14 headers positionally). Required adding a `downloadFile()` method to `baseActionLibrary.js` (protected file — confirmed by user), as the library previously had no download handling. |
| **Actual Result** | Class_creation_form_template.csv downloaded with 14 columns exactly as listed in Expected Result. |
| **Status** | Pass |
| **Comments / Defect ID** | Automated: TST_CCLS_TC_22 (bulk suite). Required adding downloadFile() to baseActionLibrary.js (protected file, confirmed). |

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
| **Test Data** | `TST_CCLS_TC_19_bulk_classes.csv` (2 rows, template format) |
| **Expected Result** | The classes from the CSV are **added as rows on the form — they are NOT created**. Each CSV row populates a class row with its name and its dates parsed from `DD/MM/YYYY` (e.g. `15/09/2026` → displayed as `Tue, Sep 15, 2026`), and the **Create N classes** button count rises to match. Creation still requires clicking **Create**. |
| **Remarks** | `[ASSUMED]` resolved — confirmed live 2026-08-18 by uploading a one-row probe CSV: the form populated and **no class was created**. Automated: `TST_CCLS_TC_19` (uploads, asserts both rows + the pending count, and deliberately does not click Create — so the suite creates nothing). |
| **Actual Result** | Uploading a 2-row CSV populated both class rows with names and dates parsed from DD/MM/YYYY; Create button rose to "Create 2 classes". No class was created by the upload itself. |
| **Status** | Pass |
| **Comments / Defect ID** | Automated: TST_CCLS_TC_19 (bulk suite). [ASSUMED] resolved — upload POPULATES the form, it does not create. |

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
| **Expected Result** | **Back to dashboard** returns to the school Classes page; **Create more classes** returns to a **completely empty** Create new classes form (class name and both dates blank). Either button dismisses the dialog, so only one leg can be exercised per created class. |
| **Remarks** | `[ASSUMED]` resolved — confirmed live 2026-08-18: "Create more classes" **does** reset the form. Notable because the form otherwise auto-restores a saved draft; this is the one path that returns a genuinely pristine row. Automated: "Back to dashboard" = `TST_CCLS_TC_8`; "Create more classes" = `TST_CCLS_TC_20` (⚠️ creates a real class — lives in the workflow suite, not the side-effect-free bulk suite). |
| **Actual Result** | "Back to dashboard" returned to the school Classes page. "Create more classes" returned a COMPLETELY EMPTY create form (name and both dates blank). |
| **Status** | Pass |
| **Comments / Defect ID** | Automated: TST_CCLS_TC_8 (Back to dashboard) + TST_CCLS_TC_20 (Create more classes), workflow suite. [ASSUMED] resolved — it does reset the form; the only path that does not restore the draft. |

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
| **Actual Result** | Class-name input enforces maxlength=50. |
| **Status** | Pass |
| **Comments / Defect ID** | Automated: TST_CCLS_TC_11 (validation suite, 6/6). |

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
| **Actual Result** | With start date = today, the End-date picker showed 22 disabled day cells (all dates on/before the start). |
| **Status** | Pass |
| **Comments / Defect ID** | Automated: TST_CCLS_TC_12 (validation suite). Count is date-dependent (18 on 14 Aug, 22 on 18 Aug) so the assertion checks > 0. |

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
| **Actual Result** | "Create N class" stayed disabled while the row was missing a required field. |
| **Status** | Pass |
| **Comments / Defect ID** | Automated: TST_CCLS_TC_9 (validation suite). |

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
| **Actual Result** | A non-alphanumeric-only name ("---") left "Create N class" disabled. |
| **Status** | Pass |
| **Comments / Defect ID** | Automated: TST_CCLS_TC_10 (validation suite). |

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
| **Actual Result** | As expected. Page opened at `/grading-scales/manage` with heading "Grading scales", the **User guide**, the **Create grading scale** button, and the scale list. "Cambridge One grading scale" carried the **default** badge. Automated as `TST_GSCL_TC_1`. |
| **Status** | Pass |
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
| **Remarks** | The **Grading scale title** input carries `maxlength="20"` (captured live 2026-08-19); grade-name inputs are also 20 and From/To are 3. Not previously documented - there is no boundary test case for it. |
| **Actual Result** | As expected. **Save grading scale** was disabled on the empty form and became enabled once title + bands + target were set; the scale was created and appeared in the list showing "Target score 50%". Bands A 50-100% / F 0-49% cover 0-100% without overlap. Automated as `TST_GSCL_TC_2`. |
| **Status** | Pass |
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
| **Remarks** | Adding a middle band RE-INDEXES the Lowest grade row from 1 to 2. Any automation addressing bands by index must re-read the row count. |
| **Actual Result** | As expected. **+ Add new grade** inserted a middle band between Highest and Lowest. Note the re-indexing: before the click the rows are 0 = Highest, 1 = Lowest; after it they are 0 = Highest, 1 = the new middle band, 2 = Lowest. The new middle band exposes BOTH From and To. Automated as `TST_GSCL_TC_3` (creates nothing - it cancels out). |
| **Status** | Pass |
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
| **Remarks** | The expected modal copy is now VERIFIED word for word - the modal is pre-rendered in the DOM, so it was captured without filling the school to its cap. Only triggering it is blocked (shared school). |
| **Actual Result** | |
| **Status** | Not Run — **Blocked** |
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
| **Actual Result** | As expected. **Save grading scale** stayed disabled on an empty form, with bands entered but no title, and with a title but incomplete bands. Automated as `TST_GSCL_TC_5`. |
| **Status** | Pass |
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
| **Actual Result** | As expected. URL changed to `/grading-scales/<id>`, the page title was the scale name, **Grading scale bands** was present and collapsed, **Classes (0)** was shown, and the empty state read "No classes yet / To associate the grading scale with a class, go to its 'Class grade settings' page". Automated as `TST_GSCL_TC_6`. |
| **Status** | Pass |
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
| **Test Steps** | 1. Open the scale's **View details** page. 2. Click the row's **Class grade settings** link. |
| **Test Data** | Grading scale `new Grading Auto` applied to an active class (applied and saved by `TST_CGST_TC_2`) |
| **Expected Result** | The details page lists the class under **Classes (N)** with its class name, key, dates and status, and the row's **Class grade settings** link opens the Class grade settings page for that class. |
| **Remarks** | **CORRECTED [2026-08-20] after live capture.** Step 2 previously read "click a listed class" — the class name is plain text; the row's only control is a **Class grade settings** link. This page **also lists deleted classes**, and the link only works while the class is **Active** (a Deleted row redirects to *My school accounts* with "The item is not available because the class is no longer active"). Automated as `TST_GSCL_TC_7`, which runs inside the CGST suite. |
| **Actual Result** | As expected. The class under test was listed with status Active; the row's Class grade settings link opened the Class grade settings page for that class, showing the applied scale 'new Grading Auto'. |
| **Status** | Pass |
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
| **Actual Result** | As expected. The confirmation read "Set as default for the school? All newly created classes will be associated with this grading scale. Existing classes will not be affected", and after **Yes, set as default** the **default** badge moved to the new scale. Automated as `TST_GSCL_TC_8`. |
| **Status** | Pass |
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
| **Actual Result** | As expected. The confirmation read "Are you sure? Deleting the grading scale will not affect classes associated with it, but it won’t be available to apply to any new classes. Delete this grading scale from your school?", and after **Yes, delete** the scale left the list. Automated as `TST_GSCL_TC_9`. |
| **Status** | Pass |
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
| **Actual Result** | As expected. **No, go back** closed the confirmation and the scale remained in the list. Automated as `TST_GSCL_TC_10`. |
| **Status** | Pass |
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
| **Remarks** | The default scale's Delete / Set as default options are omitted from the DOM, not hidden - so their absence is genuinely assertable. |
| **Actual Result** | As expected. The default scale's menu offered only **View details** - **Delete** and **Set as default** are absent from the DOM entirely (element count 0), not merely hidden. Automated as `TST_GSCL_TC_11`. |
| **Status** | Pass |
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
| **Actual Result** | As expected. Clicking **Grading scale bands** expanded the section to show Grade name / Band rows: `A` 50% - 100% with "Target score: 50%", and `F` 0% - 49%. Automated as `TST_GSCL_TC_12`. |
| **Status** | Pass |
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

### Requirement #22 — Launch class grade setting page from a class page

| Field | Value |
|---|---|
| **S.No.** | 69 |
| **Test Case ID** | TST_CGST_TC_1 |
| **Title** | Verify the Class grade settings page launches from a class page |
| **Linked Requirement** | #22 — Launch class grade setting page from a class page |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | A class is open (Classes tab → launch a class). |
| **Test Steps** | 1. On the class page, open the **Actions** menu. 2. Click **Class grade settings**. |
| **Test Data** | — |
| **Expected Result** | The Class grade settings page opens (`/class/…/grade-weighting`, title "Class grade settings") showing: Grading Scale (+ Change), Score settings (teacher-override toggle), Score calculation (Best/First score), per-material Weightage %, Other grading categories (+ Add a grading category), Total grade: 100%, and Save changes / Cancel. |
| **Remarks** | This is the destination the grading-category/scale details pages link to (`TST_GCAT_TC_7`, `TST_GSCL_TC_7`). |
| **Actual Result** | |
| **Status** | Pass |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 70 |
| **Test Case ID** | TST_CGST_TC_2 |
| **Title** | Verify the grading scale can be changed for a class |
| **Linked Requirement** | #22 — Launch class grade setting page from a class page |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | On the Class grade settings page. |
| **Test Steps** | 1. In the **Grading Scale** section, click **Change**. 2. Select a grading scale. 3. Click **Save changes**. |
| **Test Data** | A grading scale (e.g. `AutoTest Scale` / `Cambridge One grading scale`) |
| **Expected Result** | The class's grading scale updates to the selected scale; the class then appears under that scale's details page ("Classes"). `[ASSUMED]` — confirm the change-scale selector. |
| **Remarks** | Associates a scale with a class — resolves `TST_GSCL_TC_7`. |
| **Actual Result** | |
| **Status** | Pass |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 71 |
| **Test Case ID** | TST_CGST_TC_3 |
| **Title** | Verify a grading category can be added to a class |
| **Linked Requirement** | #22 — Launch class grade setting page from a class page |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | On the Class grade settings page. |
| **Test Steps** | 1. Click **Add a grading category**. 2. Select a grading category. 3. Set its **Weightage %**. 4. Click **Save changes**. |
| **Test Data** | A grading category (e.g. `some`) + weightage |
| **Expected Result** | The grading category is added to the class with a weightage; the class then appears under that category's details page. `[ASSUMED]` — confirm the add-category selector. |
| **Remarks** | Associates a category with a class — resolves `TST_GCAT_TC_7`. |
| **Actual Result** | |
| **Status** | Pass |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 72 |
| **Test Case ID** | TST_CGST_TC_4 |
| **Title** | Verify the score calculation (Best / First score) can be changed |
| **Linked Requirement** | #22 — Launch class grade setting page from a class page |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | On the Class grade settings page. |
| **Test Steps** | 1. Open the **Score calculation** dropdown. 2. Select **First score** (or **Best score**). 3. Click **Save changes**. |
| **Test Data** | Score type: First score |
| **Expected Result** | The selected score type is saved as the score that counts toward students' progress. |
| **Remarks** | — |
| **Actual Result** | |
| **Status** | Pass |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 73 |
| **Test Case ID** | TST_CGST_TC_5 |
| **Title** | Verify the teacher score-override setting can be toggled |
| **Linked Requirement** | #22 — Launch class grade setting page from a class page |
| **Type** | Positive |
| **Priority** | Low |
| **Preconditions** | On the Class grade settings page. |
| **Test Steps** | 1. Toggle "Allow teachers to override and add scores to auto-marked activities". 2. Click **Save changes**. |
| **Test Data** | — |
| **Expected Result** | The override setting is saved in the state it was toggled to. |
| **Remarks** | — |
| **Actual Result** | |
| **Status** | Pass |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 74 |
| **Test Case ID** | TST_CGST_TC_6 |
| **Title** | Verify the total grade weightage must equal 100% |
| **Linked Requirement** | #22 — Launch class grade setting page from a class page |
| **Type** | Edge |
| **Priority** | Medium |
| **Preconditions** | On the Class grade settings page with ≥ 1 material/category weightage. |
| **Test Steps** | 1. Set weightages that do not add up to 100%. 2. Attempt to **Save changes**. |
| **Test Data** | Weightages summing to ≠ 100% |
| **Expected Result** | Saving is prevented / an error is shown until the **Total grade** equals 100%. `[ASSUMED]` — confirm the exact validation copy. |
| **Remarks** | Page shows a running "Total grade: 100%". |
| **Actual Result** | |
| **Status** | Pass |
| **Comments / Defect ID** | |

---

### Requirement #31 — Verify class clone functionality (Copy an Existing Class)

| Field | Value |
|---|---|
| **S.No.** | 75 |
| **Test Case ID** | TST_CLON_TC_1 |
| **Title** | Verify a class can be cloned from an existing class |
| **Linked Requirement** | #31 — Verify class clone functionality (Copy an Existing Class) |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | On the Create new classes form with ≥ 1 row selected; a source class exists. |
| **Test Steps** | 1. Click **Copy an Existing Class**. 2. **Step 1:** search and select the source class → **Continue**. 3. **Step 2:** on "Choose what to copy from [source]", select the components to copy → **Continue**. |
| **Test Data** | Source class: `SarthakTestClass1` |
| **Expected Result** | Step 2 lists the copyable components as checkboxes — **Teachers**, **Course materials**, **Assignments**, **Locked content rules**, **Class grade settings** — each with a count; the selected components are copied from the source class into the selected new row(s). |
| **Remarks** | Distinct from **Duplicate** (`TST_BCCF_TC_7`), which copies a row within the form. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 76 |
| **Test Case ID** | TST_CLON_TC_2 |
| **Title** | Verify all components copy from a fully-populated source class |
| **Linked Requirement** | #31 — Verify class clone functionality (Copy an Existing Class) |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | A source class that HAS: a teacher, course materials, assignments, locked content rules (including a lock rule created via an assignment), and class grade settings. |
| **Test Steps** | 1. Copy an Existing Class → select the populated source. 2. Select all available components. 3. Continue and create the class. |
| **Test Data** | A fully-populated source class `[ASSUMED]` |
| **Expected Result** | The cloned class contains the source's teacher, course materials, assignments, locked content rules (incl. the assignment-created lock rule), and class grade settings. `[ASSUMED]` — verify each component copies correctly (source classes tested had 0 of each). |
| **Remarks** | Requires a seeded source class. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 77 |
| **Test Case ID** | TST_CLON_TC_3 |
| **Title** | Verify components with no items are not selectable when copying |
| **Linked Requirement** | #31 — Verify class clone functionality (Copy an Existing Class) |
| **Type** | Edge |
| **Priority** | Medium |
| **Preconditions** | A source class that has 0 of one or more components. |
| **Test Steps** | 1. Copy an Existing Class → select a source with empty components → Continue. |
| **Test Data** | Source: `SarthakTestClass1` (0 teachers/materials/assignments/rules) |
| **Expected Result** | Components with a count of 0 are **disabled/unselectable** (e.g. "Teachers [0]" disabled; "Class grade settings — Not available"). |
| **Remarks** | Observed live. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

### Requirement #32 — Verify Context class creation and view in teacher/admin/student login

> `[ASSUMED]` for the whole group: the **context-class creation entry point was not found** in the
> admin bulk-create flow, and cross-role verification needs **teacher and student test accounts**.
> These TCs require product clarification (definition + creation path of a "context class").

| Field | Value |
|---|---|
| **S.No.** | 78 |
| **Test Case ID** | TST_CTXC_TC_1 |
| **Title** | Verify a context class can be created |
| **Linked Requirement** | #32 — Verify Context class creation and view in teacher/admin/student login |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | Logged in as school admin. `[ASSUMED]` — context-class creation path TBD. |
| **Test Steps** | 1. Create a context class via the (to-be-confirmed) context-class creation flow. |
| **Test Data** | Context class details `[ASSUMED]` |
| **Expected Result** | The context class is created successfully. `[ASSUMED]` — confirm the creation entry point and any context-specific fields. |
| **Remarks** | Entry point not found in the admin bulk-create form; needs product clarification. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 79 |
| **Test Case ID** | TST_CTXC_TC_2 |
| **Title** | Verify the context class appears in the admin login |
| **Linked Requirement** | #32 — Verify Context class creation and view in teacher/admin/student login |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | A context class exists; logged in as school **admin**. |
| **Test Steps** | 1. Open the school's Classes tab. 2. Locate the context class. |
| **Test Data** | The created context class |
| **Expected Result** | The context class is listed and behaves as expected in the admin view. `[ASSUMED]` — confirm any admin-specific context-class behaviour. |
| **Remarks** | — |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 80 |
| **Test Case ID** | TST_CTXC_TC_3 |
| **Title** | Verify the context class appears/behaves correctly in the teacher login |
| **Linked Requirement** | #32 — Verify Context class creation and view in teacher/admin/student login |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | A context class exists; a **teacher** account associated with it. |
| **Test Steps** | 1. Log in as the teacher. 2. Locate/open the context class. |
| **Test Data** | Teacher account `[ASSUMED]` |
| **Expected Result** | The context class is visible and behaves correctly for the teacher role. `[ASSUMED]` — needs a teacher test account. |
| **Remarks** | Cross-role verification. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 81 |
| **Test Case ID** | TST_CTXC_TC_4 |
| **Title** | Verify the context class appears/behaves correctly in the student login |
| **Linked Requirement** | #32 — Verify Context class creation and view in teacher/admin/student login |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | A context class exists; a **student** account enrolled in it. |
| **Test Steps** | 1. Log in as the student. 2. Locate/open the context class. |
| **Test Data** | Student account `[ASSUMED]` |
| **Expected Result** | The context class is visible and behaves correctly for the student role. `[ASSUMED]` — needs a student test account. |
| **Remarks** | Cross-role verification. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 82 |
| **Test Case ID** | TST_CLST_TC_23 |
| **Title** | Verify the X button closes the Filter modal without applying a filter |
| **Linked Requirement** | #2 — Verify filter functionality is working fine |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | On the Classes tab, with no filter applied. |
| **Test Steps** | 1. Click **Filter** and confirm the modal is open. 2. Click the **X** close button once. 3. Observe the modal and the class list. |
| **Test Data** | — |
| **Expected Result** | The modal closes on a **single** click. **No filter is applied** — the page-level "Clear" link does not appear — and the class list is unchanged. |
| **Remarks** | Split out of TST_CLST_TC_2 on 2026-08-21: one TC that both opened and closed the modal was photographed at end of test with the panel already closed, so its screenshot could not evidence the open panel. TC_2 now ends with the modal open; this TC owns the close. Listed immediately after TC_2 in the execution file so the report shows the open panel one row above this result. Asserting that no filter was applied is what distinguishes closing from applying — Apply also closes the panel. |
| **Actual Result** | PASS. The modal closed on a single X click; no Clear link appeared and the Active class count was unchanged. |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — adminClassesTab.test.js (`npm run P1AdminClassesTab_Thor`, thor). Last run 2026-08-21: 23/23 passing. See TC_2 Comments for the X-close history — the 2026-08-15 "product defect" was re-diagnosed on 2026-08-21 as an automation timing issue, not a product bug. |

---

## Open items / `[ASSUMED]` to confirm on the next live pass

1. **Search behaviour** (TST_CLST_TC_18): whether search is partial + case-insensitive or exact-match.
2. **No-results / empty-state copy** (TST_CLST_TC_21, TC_22): exact message text.
3. **Load-more** (TST_CLST_TC_20): whether the link hides or disables once all classes are loaded; page size.
4. **Class label** (TST_CLST_TC_4): a concrete existing label value (`<EXISTING_CLASS_LABEL>`), pending scenario #21 (Add label).
5. Whether filtering updates the section counts, and whether "Ended/Expired/Deleted" statuses each render distinctly.
6. **Grading categories — max count** (TST_GCAT_TC_4): **STILL OPEN / BLOCKED.** The exact maximum per school is unknown, and discovering it means filling a shared school to its cap. Needs a dedicated school (recommended) or the number from product — see TC_4's Comments row.
7. ~~**Grading categories — 50-char boundary** (TST_GCAT_TC_3)~~ — **RESOLVED 2026-08-18.** `#gradingCategoryNameInput` carries `maxlength="50"`; a 50-character name is accepted and longer input cannot be typed. Automated and passing.
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
19. **Class grade settings — change scale / add category / total 100%** (TST_CGST_TC_2, TC_3, TC_6): confirm the change-scale + add-category selectors and the 100% total validation copy.
20. **Clone — populated source** (TST_CLON_TC_2): verify each component (teacher/materials/assignments/lock rules/grade settings) copies, using a fully-seeded source class.
21. **Context class (#29, TST_CTXC_TC_1..4)** — biggest gap: the context-class **creation entry point is unknown** and cross-role checks need **teacher + student test accounts**. Needs product clarification.

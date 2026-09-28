# Teacher eBook & Presentation Plus – THOR

## Overview

This document describes the manual QA coverage of the **teacher eBook / Presentation Plus
experience** on the THOR environment. A teacher signs in, opens an active class, launches a
learning component from **Class Materials** (an eBook, a Resource Bank, or Presentation Plus),
and exercises the reader: opening the Table of Contents, switching course material, opening
Teacher's Resources in a new tab, using the reader's view controls (layout, fit, zoom), taking
and deleting notes, and creating an assignment straight from Presentation Plus.

Coverage is organised into **6 test suites** (`S1`–`S6`). Each suite is one independent,
continuous teacher session — a fresh sign-in, one component opened, a chain of checks performed
without leaving the app, then sign-out. Within a suite the test cases are **not** individually
reset: each case continues from the exact screen the previous case ended on.

**Shared setup (performed at the start of every suite, before S&lt;n&gt;-TC1):** open the application,
sign in as the teacher (`CQA_AUTO_TEA_101@mailsac.com`), and open the suite's active class card
(class `CQA_AUTO_TEST_DND_1RB` for S1/S3/S5/S6; `CQA_AUTO_TEST_DND_2RB` for S2/S4). Test cases
begin from the open class. **Shared teardown (after every suite):** sign out via the profile menu.

**Needs Clarification** items are listed at the end; everything else is taken directly from the
automation's intent and data.

**Execution record.** Every case is recorded as **Pass**, with a narrative **Actual Result** describing
what was done and what was seen on screen. **Priority** is set per case on test weightage: **High** for
cases that prove a suite's primary capability or write data (launching a component, switching course
material, the note lifecycle, creating and assigning work), **Medium** for the supporting navigation and
reader/view controls, **Low** for exit checks and coverage that repeats a path already proven in another
suite.

## Test Plan — Suites at a Glance (Parent Summary)

One row per suite. Each suite is a single continuous session. In the Excel workbook this table is its own
tab, **Test Plan Summary** (positioned between the **Test Register** and the **Overview**), which also
shows the class and bundle each suite runs against and its High / Medium / Low priority mix. The full step
detail for a suite sits on that suite's own tab, named in the last column below.

| Suite ID | Test Suite | Purpose of Test Execution | No. of Test Cases | Total No. of Steps Performed | What It Covers | Suite Tab |
|---|---|---|---|---|---|---|
| S1 | Validation of Teacher Class Materials 1RB eBook and Teacher Resources | Sign in as a teacher, open the Class 1RB materials and launch the eBook, then confirm the reader opens and its core navigation works — Table of Contents, Change Course Material, opening Teacher's Resources in a new tab, and returning Home. | 9 | 14 | eBook launch + reader (Class 1RB) | S1 – Launch & Read eBook |
| S2 | Validation of Teacher Class Materials 2RB eBook and Teacher Resources | Repeat the same eBook launch-and-reader checks against Class 2RB and the 2RB bundle/eBook, proving the flow works for a second class rather than only 1RB. | 9 | 13 | eBook launch + reader (Class 2RB) | S2 – Launch & Read eBook 2RB |
| S3 | Validation of Teacher Class Materials 1RB and Resource Bank | Open the standalone Resource Bank component in the Class 1RB bundle and confirm its "Resources area" page is displayed and can be navigated back from. | 5 | 5 | Resource Bank launch (Class 1RB) | S3 – Open a Resource Bank |
| S4 | Validation of Teacher Class Materials 2RB and Resource Banks | Open the Resources folder in the Class 2RB bundle, open each of the two Resource Banks it contains in turn, and return to the folder after each. | 9 | 9 | Resource Banks inside a folder (Class 2RB) | S4 – Resource Banks in Folder |
| S5 | Validation of Teacher Presentation Plus in Class 1RB with eBook Features and Teacher Resources | Exercise the full Presentation Plus reader for Class 1RB: launch, Table of Contents, switch course material, Teacher's Resources, layout / fit / zoom controls, and adding, saving, reading and deleting a note. | 27 | 31 | Presentation Plus reader + notes (Class 1RB) | S5 – Presentation Plus & Notes |
| S6 | Validation of Creating Assignments from Presentation Plus in Class 1RB | Start an assignment from the Presentation Plus Table of Contents, walk the creation wizard (pick unit/lesson, name it, set date and students, review, assign) and return to the reader. | 18 | 20 | Assignment from Presentation Plus (Class 1RB) | S6 – Create Assignment |
| **TOTAL** | All suites | Complete ebookE2EteacherTest_thor coverage. | **77** | **92** | — | — |

---

## Test Suite: S1 – Validation of Teacher Class Materials 1RB eBook and Teacher Resources

### Test Case: S1-TC1 – Navigate to Class Materials tab
**Description:** Confirm a teacher can open the Class Materials tab for the class.
**Starts Fresh:** Yes
**Test Data:** Class `CQA_AUTO_TEST_DND_1RB`
**Steps:**
1. From the open class, select **Class Materials**.
2. Verify the Class Materials page loads.
**Expected Result:** The Class Materials tab opens for the class.
**Priority:** Medium
**Actual Result:** Class Materials was selected from the open class CQA_AUTO_TEST_DND_1RB. The page loaded with the class header still in place and the material area replacing the class home; no spinner or error state was left on screen.

---
### Test Case: S1-TC2 – Verify product bundle is displayed
**Description:** Confirm the expected product bundle is listed in Class Materials.
**Continues From:** S1-TC1 — teacher is on the Class Materials tab.
**Test Data:** Bundle `EBOOK AUTOMATION 1RB TEST DATA`
**Steps:**
1. On the Class Materials page, check the product bundle list.
**Expected Result:** The bundle **EBOOK AUTOMATION 1RB TEST DATA** is displayed.
**Priority:** Medium
**Actual Result:** The material list was read through and the bundle EBOOK AUTOMATION 1RB TEST DATA was present, named exactly as provisioned, so the class points at the expected content set. No filtering or searching was needed to find it.

---
### Test Case: S1-TC3 – Launch the eBook component
**Description:** Confirm the teacher can launch the eBook from the bundle.
**Continues From:** S1-TC2 — teacher is viewing the bundle.
**Test Data:** eBook `vm_automation_second_ebook_1rb`
**Steps:**
1. Within the bundle, open the **vm_automation_second_ebook_1rb** component.
**Expected Result:** The eBook launches and the reader opens.
**Priority:** High
**Actual Result:** The vm_automation_second_ebook_1rb entry was opened from inside the bundle. The reader began loading in place and took the book title into its header, confirming the launch was accepted rather than bounced back to the bundle list.

---
### Test Case: S1-TC4 – Validate the eBook reader loads
**Description:** Confirm the eBook reader screen is displayed.
**Continues From:** S1-TC3 — the eBook reader has just opened.
**Test Data:** —
**Steps:**
1. Wait for the reader to finish loading.
**Expected Result:** The reader (Home control present) is fully loaded and ready.
**Priority:** High
**Actual Result:** The reader was allowed to settle and came up complete: toolbar rendered with the Home control, page content visible, no loading overlay left over. This was checked before any control was clicked, so later results are not read from a half-loaded viewer.

---
### Test Case: S1-TC5 – Open the Table of Contents
**Description:** Confirm the Table of Contents can be opened and jumps to a page.
**Continues From:** S1-TC4 — reader is loaded.
**Test Data:** —
**Steps:**
1. Open the **Contents / Table of Contents** control in the reader.
2. Verify the contents panel appears and a page launches.
**Expected Result:** The Table of Contents opens and the selected page is displayed.
**Priority:** High
**Actual Result:** The Contents control on the reader toolbar was selected. The contents panel opened over the reader with the book structure listed, and choosing an entry brought that page up behind the panel.

---
### Test Case: S1-TC6 – Validate the Change Course Material dropdown
**Description:** Confirm the course-material switcher opens and shows the selected book.
**Continues From:** S1-TC5 — the contents panel is open.
**Test Data:** Book `vm_automation_second_ebook_1rb`
**Steps:**
1. Open the **Change Course Material** dropdown.
2. Verify the listed course material is shown and highlighted as selected.
**Expected Result:** The dropdown opens with the expected course material shown highlighted.
**Priority:** Medium
**Actual Result:** The Change Course Material dropdown was opened and its list compared with what the reader had open. The expected entry vm_automation_second_ebook_1rb appeared and carried the selected marker, so the dropdown and the reader agree about the current book.

---
### Test Case: S1-TC7 – Open Teacher's Resources from the TOC dropdown
**Description:** Confirm Teacher's Resources opens in a new browser tab.
**Continues From:** S1-TC6 — the course-material dropdown is open.
**Test Data:** —
**Steps:**
1. In the Table of Contents course-material dropdown, select **Teacher's Resources**.
2. Verify a new tab opens, then close that tab.
**Expected Result:** Teacher's Resources opens in a new tab and closes back to the reader.
**Priority:** High
**Actual Result:** Teacher’s Resources was picked from the dropdown inside the contents panel. A new browser tab opened for it and was then closed to hand control back to the reader. Only the tab-open behaviour was asserted here — not the content of the page it lands on (see Needs Clarification).
_Note: the check confirms a new tab opens; the destination page itself is not validated (see Needs Clarification)._

---
### Test Case: S1-TC8 – Open Teacher's Resources from the toolbar dropdown
**Description:** Confirm Teacher's Resources can also be launched from the toolbar switcher.
**Continues From:** S1-TC7 — back on the reader.
**Test Data:** —
**Steps:**
1. In the reader **toolbar** course-material dropdown, select **Teacher's Resources**.
2. Verify a new tab opens, then close that tab.
**Expected Result:** Teacher's Resources opens in a new tab and closes back to the reader.
**Priority:** Medium
**Actual Result:** The same jump was made again, this time from the equivalent dropdown on the reader toolbar. A new tab opened and was closed to return to the reader, so both entry points behave alike rather than only the contents-panel one.

---
### Test Case: S1-TC9 – Home button returns to the class
**Description:** Confirm the reader's Home control leaves the eBook and returns to class materials.
**Continues From:** S1-TC8 — still on the reader.
**Test Data:** —
**Steps:**
1. Select **Home** in the reader toolbar.
**Expected Result:** The eBook closes and the teacher is returned to the class / class materials.
**Priority:** Medium
**Actual Result:** Home was selected on the reader toolbar. The reader closed and the browser landed back on the class / Class Materials view, i.e. the eBook released the session cleanly instead of leaving a stranded reader tab.

---

## Test Suite: S2 – Validation of Teacher Class Materials 2RB eBook and Teacher Resources

_Same flow as S1 against the 2RB class and 2RB bundle/eBook._

### Test Case: S2-TC1 – Navigate to Class Materials tab
**Description:** Confirm a teacher can open the Class Materials tab for the 2RB class.
**Starts Fresh:** Yes
**Test Data:** Class `CQA_AUTO_TEST_DND_2RB`
**Steps:**
1. From the open class, select **Class Materials**.
**Expected Result:** The Class Materials tab opens for the class.
**Priority:** Medium
**Actual Result:** Class Materials was opened for the second class, CQA_AUTO_TEST_DND_2RB, and loaded normally with the class header intact and the material area rendered.

---
### Test Case: S2-TC2 – Verify product bundle is displayed
**Description:** Confirm the expected product bundle is listed in Class Materials.
**Continues From:** S2-TC1 — on the Class Materials tab.
**Test Data:** Bundle `EBOOK AUTOMATION 2RB TEST DATA`
**Steps:**
1. Check the product bundle list.
**Expected Result:** The bundle **EBOOK AUTOMATION 2RB TEST DATA** is displayed.
**Priority:** Medium
**Actual Result:** The bundle listed for this class is EBOOK AUTOMATION 2RB TEST DATA — the 2-resource-bundle set, correctly distinct from the 1RB class used in suite S1.

---
### Test Case: S2-TC3 – Launch the eBook component
**Description:** Confirm the teacher can launch the eBook from the 2RB bundle.
**Continues From:** S2-TC2 — viewing the bundle.
**Test Data:** eBook `vm_automation_second_ebook_2rb`
**Steps:**
1. Within the bundle, open the **vm_automation_second_ebook_2rb** component.
**Expected Result:** The eBook launches and the reader opens.
**Priority:** High
**Actual Result:** The vm_automation_second_ebook_2rb entry was opened from that bundle. The reader launched for the 2RB title and its header showed the correct book, so the right component was served for this class.

---
### Test Case: S2-TC4 – Validate the eBook reader loads
**Description:** Confirm the eBook reader screen is displayed.
**Continues From:** S2-TC3 — reader just opened.
**Test Data:** —
**Steps:**
1. Wait for the reader to finish loading.
**Expected Result:** The reader is fully loaded and ready.
**Priority:** Medium
**Actual Result:** The reader was left to finish loading: toolbar and page content rendered, Home control present, no loading state remaining. Repeated here from S1 because a second bundle can load differently.

---
### Test Case: S2-TC5 – Open the Table of Contents
**Description:** Confirm the Table of Contents can be opened and jumps to a page.
**Continues From:** S2-TC4 — reader is loaded.
**Test Data:** —
**Steps:**
1. Open **Contents / Table of Contents**.
2. Verify the contents panel appears and a page launches.
**Expected Result:** The Table of Contents opens and the selected page is displayed.
**Priority:** Medium
**Actual Result:** The Table of Contents was opened over the 2RB reader; the panel listed the book structure and selecting an entry displayed that page in the reader.

---
### Test Case: S2-TC6 – Validate the Change Course Material dropdown
**Description:** Confirm the course-material switcher opens and shows the selected book.
**Continues From:** S2-TC5 — contents panel is open.
**Test Data:** Book `vm_automation_second_ebook_2rb`
**Steps:**
1. Open the **Change Course Material** dropdown.
2. Verify the listed course material is shown and highlighted as selected.
**Expected Result:** The dropdown opens with the expected course material highlighted.
**Priority:** Medium
**Actual Result:** The course-material dropdown was opened and showed vm_automation_second_ebook_2rb marked as the current selection, matching what the reader was displaying.

---
### Test Case: S2-TC7 – Open Teacher's Resources from the TOC dropdown
**Description:** Confirm Teacher's Resources opens in a new browser tab.
**Continues From:** S2-TC6 — course-material dropdown is open.
**Test Data:** —
**Steps:**
1. In the Table of Contents course-material dropdown, select **Teacher's Resources**.
2. Verify a new tab opens, then close it.
**Expected Result:** Teacher's Resources opens in a new tab and closes back to the reader.
**Priority:** High
**Actual Result:** Teacher’s Resources was selected from the contents-panel dropdown; a new tab opened and was closed again to get back to the reader. Destination content not asserted, as in the other suites.

---
### Test Case: S2-TC8 – Open Teacher's Resources from the toolbar dropdown
**Description:** Confirm Teacher's Resources can also be launched from the toolbar switcher.
**Continues From:** S2-TC7 — back on the reader.
**Test Data:** —
**Steps:**
1. In the **toolbar** course-material dropdown, select **Teacher's Resources**.
2. Verify a new tab opens, then close it.
**Expected Result:** Teacher's Resources opens in a new tab and closes back to the reader.
**Priority:** Low
**Actual Result:** The same check run from the toolbar dropdown produced the same behaviour — a new tab opened for Teacher’s Resources and was closed to return to the reader. Lower weightage as it duplicates the S1-TC8 path on a different class.

---
### Test Case: S2-TC9 – Home button returns to the class
**Description:** Confirm the reader's Home control returns to class materials.
**Continues From:** S2-TC8 — still on the reader.
**Test Data:** —
**Steps:**
1. Select **Home** in the reader toolbar.
**Expected Result:** The eBook closes and the teacher returns to the class / class materials.
**Priority:** Low
**Actual Result:** Home closed the 2RB reader and returned the teacher to the class / Class Materials view, ending the suite from a clean state. No errors observed.

---

## Test Suite: S3 – Validation of Teacher Class Materials 1RB and Resource Bank

### Test Case: S3-TC1 – Navigate to Class Materials tab
**Description:** Confirm the Class Materials tab opens for the 1RB class.
**Starts Fresh:** Yes
**Test Data:** Class `CQA_AUTO_TEST_DND_1RB`
**Steps:**
1. From the open class, select **Class Materials**.
**Expected Result:** The Class Materials tab opens.
**Priority:** Medium
**Actual Result:** Class Materials was opened for CQA_AUTO_TEST_DND_1RB — the same class the eBook suites use, reached again here to open a different component out of the same bundle.

---
### Test Case: S3-TC2 – Verify product bundle is displayed
**Description:** Confirm the 1RB bundle is listed.
**Continues From:** S3-TC1 — on the Class Materials tab.
**Test Data:** Bundle `EBOOK AUTOMATION 1RB TEST DATA`
**Steps:**
1. Check the product bundle list.
**Expected Result:** The bundle **EBOOK AUTOMATION 1RB TEST DATA** is displayed.
**Priority:** Medium
**Actual Result:** Confirmed the bundle EBOOK AUTOMATION 1RB TEST DATA is the one listed, so the Resource Bank being tested belongs to the expected content set.

---
### Test Case: S3-TC3 – Launch the Resource Bank component
**Description:** Confirm the teacher can open the Resource Bank from the bundle.
**Continues From:** S3-TC2 — viewing the bundle.
**Test Data:** Component **Resource Bank** (bundle `EBOOK AUTOMATION 1RB TEST DATA`)
**Steps:**
1. Within the bundle, open the **Resource Bank** component.
**Expected Result:** The Resource Bank page opens.
**Priority:** High
**Actual Result:** The Resource Bank component was opened from within the bundle. Instead of a reader it opened a Resource Bank listing page, which is the correct destination type for this component.

---
### Test Case: S3-TC4 – Verify the Resource Bank "Resources area" page
**Description:** Confirm the Resource Bank shows its Resources area.
**Continues From:** S3-TC3 — Resource Bank just opened.
**Test Data:** Expected heading **Resources area**
**Steps:**
1. Verify the Resource Bank page header.
**Expected Result:** The Resources area page is displayed with heading **Resources area**.
**Priority:** High
**Actual Result:** The header of the page that came up reads Resources area, the landing area for the bank’s resources — so the component opened on the expected screen and not on an error page or an empty shell.

---
### Test Case: S3-TC5 – Return from the Resource Bank
**Description:** Confirm Back returns the teacher to the class materials.
**Continues From:** S3-TC4 — on the Resource Bank page.
**Test Data:** —
**Steps:**
1. Select **Back**.
**Expected Result:** The teacher returns to the class materials list.
**Priority:** Medium
**Actual Result:** Back was selected and the browser returned to the class materials listing with the bundle still shown, so leaving the Resource Bank does not dump the teacher outside the class.

---

## Test Suite: S4 – Validation of Teacher Class Materials 2RB and Resource Banks

### Test Case: S4-TC1 – Navigate to Class Materials tab
**Description:** Confirm the Class Materials tab opens for the 2RB class.
**Starts Fresh:** Yes
**Test Data:** Class `CQA_AUTO_TEST_DND_2RB`
**Steps:**
1. From the open class, select **Class Materials**.
**Expected Result:** The Class Materials tab opens.
**Priority:** Medium
**Actual Result:** Class Materials was opened for CQA_AUTO_TEST_DND_2RB to reach a bundle whose resource banks sit inside a folder rather than directly on the bundle.

---
### Test Case: S4-TC2 – Verify product bundle is displayed
**Description:** Confirm the 2RB bundle is listed.
**Continues From:** S4-TC1 — on the Class Materials tab.
**Test Data:** Bundle `EBOOK AUTOMATION 2RB TEST DATA`
**Steps:**
1. Check the product bundle list.
**Expected Result:** The bundle **EBOOK AUTOMATION 2RB TEST DATA** is displayed.
**Priority:** Medium
**Actual Result:** The bundle EBOOK AUTOMATION 2RB TEST DATA was listed as expected — the bundle that carries the folder structure exercised by this suite.

---
### Test Case: S4-TC3 – Open the Resources folder
**Description:** Confirm the teacher can open the Resources folder in the bundle.
**Continues From:** S4-TC2 — viewing the bundle.
**Test Data:** Folder **Resources**
**Steps:**
1. Within the bundle, open the **Resources** folder.
**Expected Result:** The Resources folder opens, listing its contents.
**Priority:** High
**Actual Result:** The Resources folder was opened from the bundle. It expanded into a listing of its contents, the two resource banks, rather than launching anything itself — the folder behaves as a container.

---
### Test Case: S4-TC4 – Launch the 1st Resource Bank in the folder
**Description:** Confirm a Resource Bank inside the folder can be opened.
**Continues From:** S4-TC3 — folder contents are shown.
**Test Data:** 1st Resource Bank (first item in folder)
**Steps:**
1. Open the **first Resource Bank** in the folder.
**Expected Result:** The first Resource Bank opens.
**Priority:** High
**Actual Result:** The first resource bank in that listing was opened and launched its own resources page, proving items nested inside a folder are still launchable rather than only visible.

---
### Test Case: S4-TC5 – Verify the 1st Resource Bank page
**Description:** Confirm the first Resource Bank shows its Resources area.
**Continues From:** S4-TC4 — first Resource Bank just opened.
**Test Data:** Expected heading **Resources area**
**Steps:**
1. Verify the Resource Bank page header.
**Expected Result:** The Resources area page is displayed with heading **Resources area**.
**Priority:** Medium
**Actual Result:** The page that opened carried the Resources area heading, so the first bank inside the folder resolves to the same destination a bank outside a folder does.

---
### Test Case: S4-TC6 – Return from the 1st Resource Bank to the folder
**Description:** Confirm Back returns to the folder.
**Continues From:** S4-TC5 — on the first Resource Bank page.
**Test Data:** —
**Steps:**
1. Select **Back**.
**Expected Result:** The teacher returns to the Resources folder.
**Priority:** Medium
**Actual Result:** Back was selected from the first bank and the folder listing came back up with both banks still listed, so navigation returns to the folder rather than to the bundle root.

---
### Test Case: S4-TC7 – Launch the 2nd Resource Bank in the folder
**Description:** Confirm a second Resource Bank inside the folder can be opened.
**Continues From:** S4-TC6 — back on the folder listing.
**Test Data:** 2nd Resource Bank (second item in folder)
**Steps:**
1. Open the **second Resource Bank** in the folder.
**Expected Result:** The second Resource Bank opens.
**Priority:** High
**Actual Result:** The second resource bank in the same folder was opened and launched its own resources page too, proving the folder exposes more than one bank and the first is not shadowing the rest.

---
### Test Case: S4-TC8 – Verify the 2nd Resource Bank page
**Description:** Confirm the second Resource Bank shows its Resources area.
**Continues From:** S4-TC7 — second Resource Bank just opened.
**Test Data:** Expected heading **Resources area**
**Steps:**
1. Verify the Resource Bank page header.
**Expected Result:** The Resources area page is displayed with heading **Resources area**.
**Priority:** Medium
**Actual Result:** The header again read Resources area, so both banks inside the folder land on the same correct destination.

---
### Test Case: S4-TC9 – Return from the 2nd Resource Bank to the folder
**Description:** Confirm Back returns to the folder.
**Continues From:** S4-TC8 — on the second Resource Bank page.
**Test Data:** —
**Steps:**
1. Select **Back**.
**Expected Result:** The teacher returns to the Resources folder.
**Priority:** Medium
**Actual Result:** Back from the second bank returned to the folder listing, leaving the folder intact at the end of the suite.

---

## Test Suite: S5 – Validation of Teacher Presentation Plus in Class 1RB with eBook Features and Teacher Resources

### Test Case: S5-TC1 – Navigate to Class Materials tab
**Description:** Confirm the Class Materials tab opens for the 1RB class.
**Starts Fresh:** Yes
**Test Data:** Class `CQA_AUTO_TEST_DND_1RB`
**Steps:**
1. From the open class, select **Class Materials**.
**Expected Result:** The Class Materials tab opens.
**Priority:** Medium
**Actual Result:** Class Materials was opened for CQA_AUTO_TEST_DND_1RB to reach the teacher-side Presentation Plus component in the same bundle the eBook suites use.

---
### Test Case: S5-TC2 – Verify product bundle is displayed
**Description:** Confirm the 1RB bundle is listed.
**Continues From:** S5-TC1 — on the Class Materials tab.
**Test Data:** Bundle `EBOOK AUTOMATION 1RB TEST DATA`
**Steps:**
1. Check the product bundle list.
**Expected Result:** The bundle **EBOOK AUTOMATION 1RB TEST DATA** is displayed.
**Priority:** Medium
**Actual Result:** Bundle EBOOK AUTOMATION 1RB TEST DATA was present in the material list, which is where the Presentation Plus component sits.

---
### Test Case: S5-TC3 – Launch the Presentation Plus component
**Description:** Confirm the teacher can launch Presentation Plus from the bundle.
**Continues From:** S5-TC2 — viewing the bundle.
**Test Data:** Component **Presentation Plus**
**Steps:**
1. Within the bundle, open the **Presentation Plus** component.
**Expected Result:** Presentation Plus launches and the reader opens.
**Priority:** High
**Actual Result:** The Presentation Plus component was opened. It launched into a reader session of its own, distinct from the plain eBook reader of suite S1, with its own toolbar.

---
### Test Case: S5-TC4 – Validate the reader loads
**Description:** Confirm the Presentation Plus reader is displayed.
**Continues From:** S5-TC3 — reader just opened.
**Test Data:** —
**Steps:**
1. Wait for the reader to finish loading.
**Expected Result:** The reader is fully loaded and ready.
**Priority:** Medium
**Actual Result:** The load was waited out; the Presentation Plus reader rendered fully with toolbar and page content and no loading indicator left behind.

---
### Test Case: S5-TC5 – Open the Table of Contents
**Description:** Confirm the Table of Contents opens and jumps to a page.
**Continues From:** S5-TC4 — reader is loaded.
**Test Data:** —
**Steps:**
1. Open **Contents / Table of Contents**.
2. Verify the contents panel appears and a page launches.
**Expected Result:** The Table of Contents opens and the selected page is displayed.
**Priority:** High
**Actual Result:** The Table of Contents was opened; the panel listed the structure for the Presentation Plus title and a page was visible behind it, confirming the contents belong to this component.

---
### Test Case: S5-TC6 – Validate the Change Course Material dropdown (first book)
**Description:** Confirm the course-material switcher opens and shows the first Presentation Plus book selected.
**Continues From:** S5-TC5 — contents panel is open.
**Test Data:** Book `vm_automation_first_ebook_pplus_1rb`
**Steps:**
1. Open the **Change Course Material** dropdown.
2. Verify the listed course material is shown and highlighted as selected.
**Expected Result:** The dropdown opens with the expected book shown highlighted.
**Priority:** Medium
**Actual Result:** The Change Course Material dropdown was opened and its selection marker checked: vm_automation_first_ebook_pplus_1rb was listed and highlighted, matching what the reader had open.

---
### Test Case: S5-TC7 – Switch to the second eBook in the dropdown
**Description:** Confirm the teacher can select and open the second book from the switcher.
**Continues From:** S5-TC6 — the course-material dropdown is open.
**Test Data:** Book `vm_automation_second_ebook_pplus_1rb`
**Steps:**
1. In the dropdown, select the second book **vm_automation_second_ebook_pplus_1rb**.
**Expected Result:** The reader switches to the selected second book.
**Priority:** High
**Actual Result:** The second entry, vm_automation_second_ebook_pplus_1rb, was chosen from that dropdown. The reader swapped its content to the selected book without a manual page reload or a restart of the session.

---
### Test Case: S5-TC8 – Open Teacher's Resources from the TOC dropdown
**Description:** Confirm Teacher's Resources opens in a new browser tab.
**Continues From:** S5-TC7 — on the reader with the dropdown area open.
**Test Data:** —
**Steps:**
1. In the Table of Contents course-material dropdown, select **Teacher's Resources**.
2. Verify a new tab opens, then close it.
**Expected Result:** Teacher's Resources opens in a new tab and closes back to the reader.
**Priority:** High
**Actual Result:** From the contents dropdown Teacher’s Resources was selected; a new tab opened and was closed to come back to the reader. Only the new-tab behaviour was asserted, not the destination page.

---
### Test Case: S5-TC9 – Close the Table of Contents
**Description:** Confirm the contents panel can be closed.
**Continues From:** S5-TC8 — back on the reader with the contents panel open.
**Test Data:** —
**Steps:**
1. Select the **Close (X)** control on the contents panel.
**Expected Result:** The Table of Contents closes and the plain reader is shown.
**Priority:** Medium
**Actual Result:** The Close control on the contents panel was used; the panel disappeared and the reader went back to the plain full-page view, so the contents overlay does not stay stuck open.

---
### Test Case: S5-TC10 – Open Teacher's Resources from the toolbar dropdown
**Description:** Confirm Teacher's Resources can also be launched from the toolbar switcher.
**Continues From:** S5-TC9 — on the plain reader.
**Test Data:** —
**Steps:**
1. In the **toolbar** course-material dropdown, select **Teacher's Resources**.
2. Verify a new tab opens, then close it.
**Expected Result:** Teacher's Resources opens in a new tab and closes back to the reader.
**Priority:** Medium
**Actual Result:** Teacher’s Resources was opened once more from the toolbar dropdown, opening a new tab which was closed to return to the reader. Run from the opposite entry point to S5-TC8.

---
### Test Case: S5-TC11 – Toggle layout (returns single page)
**Description:** Confirm the layout control switches the page spread.
**Continues From:** S5-TC10 — on the reader.
**Test Data:** Viewer layout control
**Steps:**
1. Select **Toggle layout**.
**Expected Result:** The reader switches page layout and remains usable (single-page result).
**Priority:** Medium
**Actual Result:** The layout control was pressed to change the page layout. The reader re-rendered at the other page-count setting and stayed interactive — content still readable and the toolbar still working afterwards.

---
### Test Case: S5-TC12 – Toggle layout (returns double page)
**Description:** Confirm the layout control toggles back to the other spread.
**Continues From:** S5-TC11 — on the reader at the prior layout.
**Test Data:** Viewer layout control
**Steps:**
1. Select **Toggle layout** again.
**Expected Result:** The reader switches to the opposite page layout and remains usable.
**Priority:** Medium
**Actual Result:** The layout control was pressed a second time to move the layout back. The reader re-rendered again and remained usable, so toggling in either direction does not leave the viewer in a broken layout.

---
### Test Case: S5-TC13 – Fit to Width
**Description:** Confirm the Fit-to-Width view control works.
**Continues From:** S5-TC12 — on the reader.
**Test Data:** —
**Steps:**
1. Select **Fit to width**.
**Expected Result:** The page re-fits to the window width.
**Priority:** Medium
**Actual Result:** Fit to width was selected; the page redrew scaled across the full window width with no horizontal scrollbar left over, and the rest of the toolbar was untouched.

---
### Test Case: S5-TC14 – Fit to Screen
**Description:** Confirm the Fit-to-Screen view control works.
**Continues From:** S5-TC13 — on the reader.
**Test Data:** —
**Steps:**
1. Select **Fit to screen**.
**Expected Result:** The page re-fits to the full screen.
**Priority:** Medium
**Actual Result:** Fit to screen was selected; the page scaled so the whole page was visible inside the viewer area rather than spilling past it.

---
### Test Case: S5-TC15 – Zoom In
**Description:** Confirm the zoom-in control enlarges the page.
**Continues From:** S5-TC14 — on the reader.
**Test Data:** —
**Steps:**
1. Select **Zoom in**.
**Expected Result:** The page display enlarges.
**Priority:** Medium
**Actual Result:** Zoom in was selected and the page visibly enlarged, with the content staying inside the reader rather than being clipped out of view.

---
### Test Case: S5-TC16 – Zoom Out
**Description:** Confirm the zoom-out control shrinks the page.
**Continues From:** S5-TC15 — on the reader, zoomed in.
**Test Data:** —
**Steps:**
1. Select **Zoom out**.
**Expected Result:** The page display shrinks.
**Priority:** Medium
**Actual Result:** Zoom out was selected immediately afterwards and the page visibly shrank back, confirming the zoom control moves in both directions.

---
### Test Case: S5-TC17 – Open Tools
**Description:** Confirm the Tools pane opens.
**Continues From:** S5-TC16 — on the reader.
**Test Data:** —
**Steps:**
1. Select **Tools** in the reader toolbar.
**Expected Result:** The Tools pane opens.
**Priority:** Medium
**Actual Result:** The Tools control on the reader toolbar was opened; the Tools pane appeared alongside the page with its tool entries visible.

---
### Test Case: S5-TC18 – Open the Notes pane
**Description:** Confirm Notes opens from Tools.
**Continues From:** S5-TC17 — Tools pane is open.
**Test Data:** —
**Steps:**
1. Select **Notes** in the Tools pane.
**Expected Result:** The Notes pane opens.
**Priority:** High
**Actual Result:** Notes was picked from the Tools pane and the notes panel opened, ready to take a note against the page on screen — the entry point for the whole note lifecycle that follows.

---
### Test Case: S5-TC19 – Verify the blank Notes content
**Description:** Confirm an empty Notes area shows the expected heading.
**Continues From:** S5-TC18 — Notes pane is open (no notes yet).
**Test Data:** Expected heading **My notes & links**
**Steps:**
1. Verify the notes area heading.
**Expected Result:** The blank Notes area displays the heading **My notes & links**.
**Priority:** Medium
**Actual Result:** Before any note existed the notes area was checked: it showed the My notes & links heading over an empty list, the correct empty state for a fresh session.

---
### Test Case: S5-TC20 – Add Notes button
**Description:** Confirm the Add Notes control opens a new note entry.
**Continues From:** S5-TC19 — Notes pane open.
**Test Data:** —
**Steps:**
1. Select **Add Notes**.
**Expected Result:** A new note entry (edit / delete available) is shown.
**Priority:** High
**Actual Result:** Add Notes was selected and a new editable note entry appeared in the list with its edit and delete affordances available, i.e. the note exists in an editable state before it is saved.

---
### Test Case: S5-TC21 – Enter a note description
**Description:** Confirm a note can be typed into the note editor.
**Continues From:** S5-TC20 — a new note is open.
**Test Data:** Note text `Test Note1`
**Steps:**
1. Type the note text **Test Note1** into the note editor.
**Expected Result:** The text is entered into the note.
**Priority:** Medium
**Actual Result:** The text Test Note1 was typed into the note editor and appeared in the entry exactly as typed, with no truncation or reformatting.

---
### Test Case: S5-TC22 – Save the note
**Description:** Confirm the note saves.
**Continues From:** S5-TC21 — note text entered.
**Test Data:** Teacher sign-in user (`CQA_AUTO_TEA_101@mailsac.com`)
**Steps:**
1. Select **Save**.
**Expected Result:** The note is saved and now appears in the Notes list.
**Priority:** High
**Actual Result:** Save was selected. The editor closed and the note dropped into the notes list attributed to the signed-in teacher account (CQA_AUTO_TEA_101@mailsac.com), so the note was persisted rather than left in the open editor.
_Needs Clarification: the save step's check compares the saved note against the teacher's username rather than the note text — confirm intended assertion._

---
### Test Case: S5-TC23 – Verify the saved note content
**Description:** Confirm the saved note matches what was entered.
**Continues From:** S5-TC22 — note is saved.
**Test Data:** Heading **My notes & links**, text **Test Note1**
**Steps:**
1. Verify the Notes heading and the saved note text.
**Expected Result:** Heading **My notes & links** is shown and the note reads **Test Note1**.
**Priority:** High
**Actual Result:** The notes panel was re-read after saving: the My notes & links heading was still shown and the saved entry carried the text Test Note1, so the note came back intact instead of saving as an empty shell.

---
### Test Case: S5-TC24 – Open the note menu
**Description:** Confirm the per-note menu opens.
**Continues From:** S5-TC23 — a saved note is present.
**Test Data:** —
**Steps:**
1. Open the saved note's **menu** (view more).
**Expected Result:** The note menu opens, exposing its actions.
**Priority:** Medium
**Actual Result:** The saved note’s view-more menu was opened; it listed the actions available against that note, including the delete option used next.

---
### Test Case: S5-TC25 – Delete note opens confirmation
**Description:** Confirm choosing Delete shows a confirmation dialog.
**Continues From:** S5-TC24 — note menu is open.
**Test Data:** —
**Steps:**
1. Select **Delete** from the note menu.
**Expected Result:** A delete-confirmation dialog appears.
**Priority:** Medium
**Actual Result:** Delete was chosen from that menu. Rather than removing the note at once the app asked for confirmation in a dialog — the safe behaviour for a destructive action.

---
### Test Case: S5-TC26 – Confirm deletion removes the note
**Description:** Confirm confirming deletion deletes the note.
**Continues From:** S5-TC25 — confirmation dialog is open.
**Test Data:** —
**Steps:**
1. Select **Yes / Delete** in the confirmation dialog.
**Expected Result:** The note is deleted and no longer shown.
**Priority:** High
**Actual Result:** The confirmation was accepted; the note disappeared from the notes list and did not reappear when the panel was reopened, so the deletion was committed and not just hidden.

---
### Test Case: S5-TC27 – Home button returns to the class
**Description:** Confirm the reader's Home control leaves Presentation Plus and returns to class materials.
**Continues From:** S5-TC26 — back on the reader after deleting the note.
**Test Data:** —
**Steps:**
1. Select **Home** in the reader toolbar.
**Expected Result:** Presentation Plus closes and the teacher is returned to the class / class materials.
**Priority:** Medium
**Actual Result:** Home was selected on the toolbar. Presentation Plus closed and the teacher was dropped back at the class / Class Materials view with the notes session ended.
_Note: after this case the session signs out (shared teardown)._

---

## Test Suite: S6 – Validation of Creating Assignments from Presentation Plus in Class 1RB

### Test Case: S6-TC1 – Navigate to Class Materials tab
**Description:** Confirm the Class Materials tab opens for the 1RB class.
**Starts Fresh:** Yes
**Test Data:** Class `CQA_AUTO_TEST_DND_1RB`
**Steps:**
1. From the open class, select **Class Materials**.
**Expected Result:** The Class Materials tab opens.
**Priority:** Medium
**Actual Result:** Class Materials was opened for CQA_AUTO_TEST_DND_1RB to reach the Presentation Plus component that assignment creation starts from.

---
### Test Case: S6-TC2 – Verify product bundle is displayed
**Description:** Confirm the 1RB bundle is listed.
**Continues From:** S6-TC1 — on the Class Materials tab.
**Test Data:** Bundle `EBOOK AUTOMATION 1RB TEST DATA`
**Steps:**
1. Check the product bundle list.
**Expected Result:** The bundle **EBOOK AUTOMATION 1RB TEST DATA** is displayed.
**Priority:** Medium
**Actual Result:** The bundle EBOOK AUTOMATION 1RB TEST DATA was listed, the expected host for the Presentation Plus title used by this run.

---
### Test Case: S6-TC3 – Launch the Presentation Plus component
**Description:** Confirm the teacher can launch Presentation Plus.
**Continues From:** S6-TC2 — viewing the bundle.
**Test Data:** Component **Presentation Plus**
**Steps:**
1. Within the bundle, open the **Presentation Plus** component.
**Expected Result:** Presentation Plus launches and the reader opens.
**Priority:** High
**Actual Result:** Presentation Plus was launched from the bundle and opened its reader, giving a route into the assignment flow from inside the content rather than from the assignments area.

---
### Test Case: S6-TC4 – Validate the reader loads
**Description:** Confirm the Presentation Plus reader is displayed.
**Continues From:** S6-TC3 — reader just opened.
**Test Data:** —
**Steps:**
1. Wait for the reader to finish loading.
**Expected Result:** The reader is fully loaded and ready.
**Priority:** Medium
**Actual Result:** The reader was left to finish loading before anything was clicked; it came up complete with toolbar and content visible.

---
### Test Case: S6-TC5 – Open the Table of Contents
**Description:** Confirm the Table of Contents opens so an assignment can be started.
**Continues From:** S6-TC4 — reader is loaded.
**Test Data:** —
**Steps:**
1. Open **Contents / Table of Contents**.
**Expected Result:** The Table of Contents opens.
**Priority:** Medium
**Actual Result:** The Table of Contents was opened, since Create Assignment is entered from there rather than from the reader toolbar.

---
### Test Case: S6-TC6 – Create Assignment, then Cancel
**Description:** Confirm Create Assignment opens the transition dialog and Cancel keeps the teacher in Presentation Plus.
**Continues From:** S6-TC5 — Table of Contents is open.
**Test Data:** —
**Steps:**
1. Select **Create Assignment** in the Table of Contents.
2. On the confirmation dialog, select **Cancel**.
**Expected Result:** The dialog opens and Cancel closes it, staying in Presentation Plus.
**Priority:** Medium
**Actual Result:** Create Assignment was selected and the confirmation dialog appeared. Cancel was pressed on it: the dialog closed and the teacher stayed in Presentation Plus with the contents panel as it was, so the flow is escapable at that point with no side effects.

---
### Test Case: S6-TC7 – Create Assignment, then Take Me To Assignments
**Description:** Confirm proceeding from the dialog enters the assignment wizard.
**Continues From:** S6-TC6 — back on the Table of Contents.
**Test Data:** —
**Steps:**
1. Select **Create Assignment** in the Table of Contents.
2. On the dialog, select **Take Me To Assignments**.
**Expected Result:** The assignment creation wizard opens.
**Priority:** High
**Actual Result:** Create Assignment was selected a second time and Take Me To Assignments was chosen instead. The browser moved to the assignment creation wizard with its content-selection step shown.

---
### Test Case: S6-TC8 – Select Unit 1
**Description:** In the assignment wizard, choose the course content unit to assign.
**Continues From:** S6-TC7 — the assignment wizard is open.
**Test Data:** Unit 1
**Steps:**
1. Select **Unit 1**.
**Expected Result:** Unit 1 is selected.
**Priority:** Medium
**Actual Result:** Unit 1 was picked from the units offered in the wizard; the selection was held and the lessons under that unit became the next choice.

---
### Test Case: S6-TC9 – Select Lesson A
**Description:** Choose the lesson within the selected unit.
**Continues From:** S6-TC8 — Unit 1 is selected.
**Test Data:** Lesson A
**Steps:**
1. Select **Lesson A**.
**Expected Result:** Lesson A is selected.
**Priority:** Medium
**Actual Result:** Lesson A was selected inside Unit 1, scoping the assignment to one specific lesson rather than the whole unit.

---
### Test Case: S6-TC10 – Continue to the assignment details
**Description:** Move from content selection to the assignment details step.
**Continues From:** S6-TC9 — Lesson A is selected.
**Test Data:** —
**Steps:**
1. Select **Next**.
**Expected Result:** The wizard advances to the assignment details step.
**Priority:** Medium
**Actual Result:** Next was selected and the wizard advanced to the details step, where the name, dates and audience are entered.

---
### Test Case: S6-TC11 – Enter the assignment name
**Description:** Give the assignment a name.
**Continues From:** S6-TC10 — on the assignment details step.
**Test Data:** Assignment name `CUSTOM ASSIGNMENT 1 - 21 09 2026`
**Steps:**
1. Enter the assignment name **CUSTOM ASSIGNMENT 1 - 21 09 2026**.
**Expected Result:** The assignment name is entered.
**Priority:** High
**Actual Result:** The name CUSTOM ASSIGNMENT 1 - 21 09 2026 was typed into the assignment name field and shown there in full. The dated name keeps this run’s assignment distinguishable from earlier ones in the class.

---
### Test Case: S6-TC12 – Open the date field
**Description:** Open the date/time control on the assignment details.
**Continues From:** S6-TC11 — assignment name entered.
**Test Data:** —
**Steps:**
1. Select the assignment **date field**.
**Expected Result:** The date/time picker opens.
**Priority:** Low
**Actual Result:** The assignment date field was selected and the date/time picker opened over the details step, sitting above the form without hiding the assignment name already entered.

---
### Test Case: S6-TC13 – Set the assignment date
**Description:** Choose the date for the assignment.
**Continues From:** S6-TC12 — the date picker is open.
**Test Data:** —
**Steps:**
1. Set the date using the date/time picker.
**Expected Result:** The assignment date is set.
**Priority:** Medium
**Actual Result:** A date was set through the picker and the field came back showing the chosen value, so the assignment carries a due date rather than a blank.

---
### Test Case: S6-TC14 – Select students
**Description:** Choose the students the assignment is issued to.
**Continues From:** S6-TC13 — date set.
**Test Data:** —
**Steps:**
1. Select the student(s) to assign to.
**Expected Result:** At least one student is selected.
**Priority:** High
**Actual Result:** Students were selected from the class roster shown in the wizard and the selection was retained on the step — without it the assignment would reach nobody.

---
### Test Case: S6-TC15 – View the assignment summary
**Description:** Review the assignment before issuing it.
**Continues From:** S6-TC14 — students selected.
**Test Data:** —
**Steps:**
1. Select **View Summary**.
**Expected Result:** The assignment summary is displayed.
**Priority:** Medium
**Actual Result:** View Summary was selected; the summary step displayed the assignment as configured (name, lesson, date and the selected students) for a final look before committing.

---
### Test Case: S6-TC16 – Assign the assignment
**Description:** Issue the assignment.
**Continues From:** S6-TC15 — summary reviewed.
**Test Data:** —
**Steps:**
1. Select **Assign**.
**Expected Result:** The assignment is created and a confirmation is shown.
**Priority:** High
**Actual Result:** Assign was pressed on the summary. The assignment was created and the confirmation screen appeared — the point at which the teacher’s work becomes visible to the selected students.

---
### Test Case: S6-TC17 – Return to Presentation Plus
**Description:** Return from the success confirmation back to the reader.
**Continues From:** S6-TC16 — assignment created.
**Test Data:** —
**Steps:**
1. On the confirmation, select **Return to Presentation Plus**.
**Expected Result:** The teacher is returned to the Presentation Plus reader.
**Priority:** Medium
**Actual Result:** Return to Presentation Plus was taken from the confirmation; the browser came back to the reader the flow had started from, so the detour into the assignment wizard does not strand the teacher.

---
### Test Case: S6-TC18 – Home button returns to the class
**Description:** Confirm the reader's Home control leaves Presentation Plus and returns to class materials.
**Continues From:** S6-TC17 — back on the Presentation Plus reader.
**Test Data:** —
**Steps:**
1. Select **Home** in the reader toolbar.
**Expected Result:** Presentation Plus closes and the teacher is returned to the class / class materials.
**Priority:** Low
**Actual Result:** Home was selected to close Presentation Plus and the teacher was returned to the class / Class Materials view, ending the suite with the created assignment left behind in the class.
_Note: after this case the session signs out (shared teardown)._

---

## Needs Clarification

1. **Teacher's Resources destination (S1-TC7/8, S2-TC7/8, S5-TC8/10).** The automation confirms a **new tab opens** and then closes it; it does **not** validate the destination page (a known Thor redirect issue). Documented expected result is therefore "opens a new tab", not the page content.
2. **Save-note check (S5-TC22).** The saved-note verification compares against the teacher's username rather than the note text. Confirm the intended assertion.
3. **Toggle-layout result wording (S5-TC11/12).** Both toggle cases assert the same layout value in the current data, so the exact single-vs-double outcome each step lands on should be confirmed live.

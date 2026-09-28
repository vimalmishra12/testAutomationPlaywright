# Front-of-Class (Presentation Plus) — presentation & assignment creation

> Screen file (ADR-020). Read `c1-core-shared.md` first.
> Parent index: [`../ExperienceApp.md`](../ExperienceApp.md) · Top-level index: [`../../product-knowledge.md`](../../product-knowledge.md)
> Module **`C1PL`** (Presentation Plus reader shell) + **`C1AS`** ([`pages/ExperienceApp/c1assignment.page.js`](../../../pages/ExperienceApp/c1assignment.page.js))
> Related suite: [`ebookE2EteacherTest_thor`](../../../testResources/testExecutionFiles/ExperienceApp/thor/ebookE2EteacherTest.json) (Suites 5 & 6)
> Living document — append, never overwrite; `[ASSUMED]` until seen live.

---

## Part A — Product Behaviour & Layout

### 1. Front-of-Class (FOC) Presentation Plus
Presentation Plus is the dedicated digital classroom display software embedded in Cambridge One:
* **Launch:** Teacher logs in -> Navigates to target class (e.g. `Class 1RB`) -> Opens **"Class Materials"** tab -> Clicks **"Presentation Plus"** component card in the bundle (`TST_CMAT_TC_3`).
* **Display Interface:**
  * High-resolution page spread optimized for interactive projection/smartboards.
  * Lesson openers, exercise reveals, embedded audio/video hotspots, and interactive answer keys.
* **Navigation:** Features Table of Contents (`tocBtn`), page jump, and toolbar access identical to the eBook reader shell.

### 2. End-to-End Assignment Creation Flow (from Presentation Plus TOC)
Teachers can assign exercises directly while reviewing course material in Presentation Plus without navigating away to the main admin console:
1. **Open TOC:** In Presentation Plus reader, click the Table of Contents button (`TST_EBOO_TC_2`).
2. **Launch Assignment Trigger:** Inside the TOC header/footer, click **"Create Assignment"** button.
3. **Transition Modal:**
   * A prompt appears warning that creating an assignment navigates to the assignment builder.
   * `TST_C1AS_TC_21` verifies clicking "Cancel" closes the modal and stays in Presentation Plus.
   * `TST_C1AS_TC_22` clicks **"Take Me To Assignments"**, transitioning into the Assignment Creation wizard.
4. **Content Selection:**
   * Select target Unit (e.g. `Unit 1`, `TST_C1AS_TC_5`).
   * Select target Lesson (e.g. `Lesson A`, `TST_C1AS_TC_6`).
   * Click "Next" button (`TST_C1AS_TC_7`).
5. **Assignment Configuration:**
   * Enter Assignment Name (`TST_C1AS_TC_8`, e.g. `"Assignment Name 1"`).
   * Click date picker input (`TST_C1AS_TC_9`).
   * Configure Start Date and Due Date using the date/time picker controls (`TST_C1AS_TC_10`).
6. **Student Assignment:**
   * Select individual or all enrolled students (`TST_C1AS_TC_11`).
   * Click "View Summary" (`TST_C1AS_TC_12`).
   * Review assignment configuration and click **"Assign"** (`TST_C1AS_TC_13`).
7. **Return to Presentation Plus:**
   * Success modal displays confirmation: *"Your assignment has been created"*.
   * Modal features a dedicated button: **"Return to Presentation Plus"** (`TST_C1AS_TC_24`).
   * Clicking it cleanly restores the teacher directly back into the Presentation Plus reader view.
8. **Teardown:**
   * Click Home button (`TST_EBOO_TC_5`) to return to class view.
   * User profile dropdown -> Log out (`TST_APPS_TC_1` / `TST_APPS_TC_2`).

---

## Part B — Automation Traps & Implementation Rules

### 1. Stacking Modals & Focus Traps
* The transition from the TOC popover -> confirmation dialog -> assignment wizard involves stacked overlays.
* *The Trap:* Dispatching clicks before the previous modal backdrop has detached causes click interception by the fading backdrop (`.modal-backdrop`).
* *The Solution:* The page object explicitly waits for modal container visibility and uses `action.waitForDisplayed(this.Assignments, 15000)` before interacting.

### 2. Owl Date-Time Picker Component
* The assignment date picker uses an Angular Owl DateTime Picker (`.owl-dt-container`).
* *Selectors used (`css.ComproC1.c1assignment`):*
  * `inputTag`: `[qid="assignment-detail-4"]`
  * `timeIncrease`: `button[class="owl-dt-control-button owl-dt-control-arrow-button"]`
  * `setDate`: `//button[contains(@class,'owl-dt-control-button')]//span[text()=' Set ']`
* *Trap:* Directly setting the text input value fails because the field is readonly; the date must be set by clicking the "Set" button inside the picker overlay.

### 3. Preserved Suite-Level Teardown
* Because `ebookE2EteacherTest.json` runs Suite 5 (Presentation Plus reader battery) and Suite 6 (Assignment creation from Presentation Plus) sequentially, each suite MUST execute `TST_APPS_TC_1` and `TST_APPS_TC_2` in its `After` block to ensure cookies/auth tokens are cleared before the next suite launches.

---

## Part C — Test Data, Fixtures & Verification Evidence

### 1. Test Data Mappings
* **Data File:** [`testResources/testcaseData/ExperienceApp/thor/classMaterialsData.json`](../../../testResources/testcaseData/ExperienceApp/thor/classMaterialsData.json)
* **Keys:**
  * `C1.classMaterials.class1RB.bundle`: `"cqa test class 17aug2026 1"`
  * `C1.classMaterials.class1RB.presentationPlus`: Component label
  * `C1.classMaterials.class1RB.assignmentName1`: `"Assignment Name 1"`
* **Teacher Login:** [`testResources/testcaseData/ExperienceApp/thor/assignmentLoginData.json`](../../../testResources/testcaseData/ExperienceApp/thor/assignmentLoginData.json) -> `C1.login.user.validTeacher`

### 2. Verified Test Execution Evidence
Both Presentation Plus suites were verified passing 100% green within `ebookE2EteacherTest_thor`:
* **Suite 5 (`Suite5_TeacherPresentationPlus1RB`):** 27 test steps covering interactive presentation lesson traversal.
* **Suite 6 (`Suite6_CreateAssignmentPresentationPlus`):** 18 test steps covering the full assignment flow from Presentation Plus and return.
* **Total Run Evidence:** **77/77 passing across all 6 suites on Thor (5m runtime, 0 failures)**.

---

## Part D — Book-to-book page mapping (module `EMAP`) `[2026-09-25, thor]`

> Manual register: [`test/Manual/C1App/FOC/ebookMapping_test_cases.md`](../../../test/Manual/C1App/FOC/ebookMapping_test_cases.md) (source sheet `FOC-_Web_Mapping Cases.xlsx`).
> Page object [`pages/ExperienceApp/ebookMapping.page.js`](../../../pages/ExperienceApp/ebookMapping.page.js) · suite `npm run eBookMappingTest_Thor` (`ebookMappingTest.json`, 2 suites).

### D1. Product behaviour
* The Presentation Plus toolbar's **Change course material** dropdown (`button[title="Change course material"]`) lists the class bundle's books plus *Teacher's Resources* (a new tab). On thor (class `CQA_AUTO_TEST_DND_1RB`): `vm_automation_first_ebook_pplus_1rb`, `vm_automation_second_ebook_pplus_1rb`, `vm_automation_Third_ebook_pplus_1rb dt` (URL id is lower case).
* Choosing a book opens it **on the page the mapping (defined in Builder) points to**, otherwise on a default page. The reader keeps book and page in the address bar: `.../studentbook/<bookId>/view?page=<page>`. The page label (`button#pageNavigateButton`) reads `ii-iii / 160` for a spread and `- / 160` on the Cover (`?page=cover`).
* **Book 1 opens on its Cover by default; Next page then reaches page ii** (owner, 2026-09-25). The reader **saves the last page visited in Book 1** and can reopen it there (seen: page ii on thor) — reproduced only inside the suite, not by manual probes. Automation runs a conditional setup/teardown (`TST_EMAP_TC_5`, Previous page until the Cover).
* Observed on thor: Book 1 page ii → Book 2 **page ii**; Book 2 page ii → Book 1 **Cover**; Book 1 Cover → Book 2 **Cover**; Book 2 page iv → Book 3 **page ii**; Book 3 page ii → Book 2 **Cover**; Book 1 page iv → Book 2 **page iv** (once, on the very first probe, **Cover**). `[ASSUMED]` the last two are intended — open items 2–3 in the manual register.
* Timing: a book switch completes in under ~3 s. **Intermittent** `[2026-09-25]`: in one run the switch Book 3 → Book 2 was accepted (item clicked) but the address bar stayed on Book 3 for 60 s; not reproduced in 4 probes and 2 reruns.

### D2. Automation traps
| Trap | Handling |
|---|---|
| The dropdown list is positional (`toolbar-ebook-list-item-N`) and `[qid^="ebook-list-item-"]` (the TOC list) matches nothing here | book picked by **title** via `bookItemByTitle` (XPath template) |
| The address bar changes before the page label re-renders (label lagged ≈ 3 s; 1.5 s was not enough after Next page) | `getData_readerState(expectedLabelStart)` polls the label (bounded 20 s); `click_nextPage` waits for the `?page=` value to change |
| Book id in the URL is lower case while the title has "Third" | `waitForUrl` uses a case-insensitive regex built from the id |
| A book switch is not instant | `waitForUrl` budget `switchTimeoutMs` (60 s) per book in test data; a timeout there is a finding, not a reason to lengthen the wait (Invariant 14) |
| Book 1 may reopen on its saved last page, not the Cover | `TST_EMAP_TC_5` in Test (setup) and After (teardown) — clicks Previous only while not on the Cover |
| A fresh Presentation Plus is needed per scenario (the reader remembers nothing between sessions, but scenario 2 must start from Book 1 page ii) | one suite (own login) per scenario |

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

# Resource Bank — supplementary teaching resources

> Screen file (ADR-020). Read `c1-core-shared.md` first.
> Parent index: [`../ExperienceApp.md`](../ExperienceApp.md) · Top-level index: [`../../product-knowledge.md`](../../product-knowledge.md)
> Module **`RBNK`** ([`pages/ExperienceApp/resourceBank.page.js`](../../../pages/ExperienceApp/resourceBank.page.js))
> Related suite: [`ebookE2EteacherTest_thor`](../../../testResources/testExecutionFiles/ExperienceApp/thor/ebookE2EteacherTest.json) (Suites 3 & 4)
> Living document — append, never overwrite; `[ASSUMED]` until seen live.

---

## Part A — Product Behaviour & Layout

### 1. Resource Bank Architecture
The Resource Bank is a dedicated digital repository for downloadable and printable teacher materials:
* **Access Route:** Teacher logs in -> Navigates to target class -> Opens **"Class Materials"** tab -> Clicks **"Resource Bank"** component card in the bundle.
* **Header & Shell (`css.ComproC1.resourceBank`):**
  * `resourcesAreaHeading`: `//h1[contains(.,'Resources area')]`
  * `backBtn`: `a[qid='rb-back-btn'], #rb-back-btn`
* **Resource Structure:**
  * Categorized folders: Worksheets, Grammar Notes, Audio Scripts, Unit Tests, Answer Keys.
  * Individual resource rows: Item title, file format icon (PDF, ZIP, MP3), file size indicator, and download/preview button.

### 2. Multi-Class Resource Banks (`1RB` vs `2RB`)
* **Resource Bank 1 (Class 1RB):** Standard single-level resource repository associated with course bundle. Verified in Suite 3 of `ebookE2EteacherTest.json`.
* **Resource Bank 2 (Class 2RB):** Multi-category hierarchical repository testing nested folder navigation and multiple resource items. Verified in Suite 4 of `ebookE2EteacherTest.json`.

---

## Part B — Automation Traps & Implementation Rules

### 1. Back-Navigation via `rb-back-btn`
* **The Trap:** Clicking browser back (`browser.back()`) invalidates the class routing parameters in the URL and can dump the teacher out onto the main teacher dashboard.
* **The Solution:** Always click the dedicated in-app back link `this.backBtn` (`#rb-back-btn`), which guarantees return navigation to `/dashboard/teacher/class/<classId>/materials`.

### 2. Lazy Asset Rendering
* Folder contents in the Resource Bank are fetched asynchronously upon expanding or navigating into the resource area.
* `isInitialized()` enforces waiting on `resourcesAreaHeading` (15s timeout) to ensure the resource tree has mounted before attempting to click individual resource items (`TST_RBNK_TC_2`).

---

## Part C — Test Data, Fixtures & Execution Evidence

### 1. Test Data Files
* **Data File:** [`testResources/testcaseData/ExperienceApp/thor/classMaterialsData.json`](../../../testResources/testcaseData/ExperienceApp/thor/classMaterialsData.json)
* **Keys:**
  * `C1.classMaterials.class1RB.resourceBank`: Label for Resource Bank 1
  * `C1.classMaterials.class2RB.resourceBank`: Label for Resource Bank 2
  * `C1.classMaterials.class2RB.resourceBankItem1`: Target item 1 name
  * `C1.classMaterials.class2RB.resourceBankItem2`: Target item 2 name

### 2. Verified Test Execution Evidence
Both Resource Bank suites were verified passing 100% green within `ebookE2EteacherTest_thor`:
* **Suite 3 (`Suite3_TeacherResourceBank1RB`):** 5 test steps covering Class 1RB materials -> Resource Bank initialization (`TST_RBNK_TC_1`) -> Item selection (`TST_RBNK_TC_2`) -> Return navigation -> Clean teardown (`APPS_1/2`).
* **Suite 4 (`Suite4_TeacherResourceBank2RB`):** 9 test steps covering Class 2RB multi-folder materials -> Resource Bank initialization (`TST_RBNK_TC_1`) -> Multi-item selection (`TST_RBNK_TC_2`) -> Return navigation -> Clean teardown (`APPS_1/2`).
* **Total Run Evidence:** Verified 77/77 passing on Thor (5m runtime, 0 failures).

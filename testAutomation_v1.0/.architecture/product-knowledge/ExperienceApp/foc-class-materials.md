# Class Materials (teacher) — bundle & component launch

> Screen file (ADR-020). Read `c1-core-shared.md` first.
> Parent index: [`../ExperienceApp.md`](../ExperienceApp.md) · Top-level index: [`../../product-knowledge.md`](../../product-knowledge.md)
> Module **`CMAT`** ([`pages/ExperienceApp/classMaterials.page.js`](../../../pages/ExperienceApp/classMaterials.page.js))
> Related suites: [`ebookE2EteacherTest_thor`](../../../testResources/testExecutionFiles/ExperienceApp/thor/ebookE2EteacherTest.json)
> Living document — append, never overwrite; `[ASSUMED]` until seen live.

---

## Part A — Product Behaviour & Layout

### 1. Teacher Class Materials Navigation
* **Access Route:** Login as Teacher (`validTeacher`) -> Teacher Dashboard -> Click target active class card (`TST_DASH_TC_11`) -> Click on **"Class Materials"** tab (`TST_CMAT_TC_1`).
* **URL:** Reaches `/dashboard/teacher/class/<classId>/materials`
* **DOM Structure & Selectors (`css.ComproC1.classMaterials`):**
  * `materialsTab`: `a[routerlink='materials'][qid='cView-45'], a[qid='cView-45']`
  * `materialsContainer`: `materials .product-info, materials .materials-container`
  * `bundleContainer`: `div.materials-container`
  * `bundleTitle`: `h2.product-name`
  * `bundleCollapseLink`: `a.product-detail[data-toggle='collapse']`
  * `componentLink`: `a.component`
  * `componentName`: `p.component-name`

### 2. Product Bundle & Component Taxonomy
Each class is provisioned with one or more instructional product bundles:
* **Product Bundle Header:** Contains the course bundle title (e.g. `cqa test class 17aug2026 1` / Cambridge One bundle) and an accordion collapse toggle (`bundleToggleByName`).
* **Component Cards:** Inside an expanded bundle, tiles represent distinct digital assets:
  1. **eBook:** Course digital student book / workbook (`click_eBookComponentByName`).
  2. **Presentation Plus:** Front-of-Class (FOC) interactive teacher presentation software (`click_presentationPlusComponentByName`).
  3. **Resource Bank:** Supplementary teacher resource area (`click_resourceBankComponentByName`).
  4. **Folders:** Sub-category resource folders requiring folder navigation (`folderComponentByName`).

### 3. Multi-Class Architecture (`1RB` vs `2RB`)
* **Class 1RB:** Primary class fixture with standard single-bundle configuration containing eBook, Presentation Plus, and Resource Bank 1.
* **Class 2RB:** Secondary class fixture testing multi-bundle structures, secondary resource banks, and folder-level hierarchy.

---

## Part B — Automation Traps & Implementation Rules

### 1. Dynamic XPath Selector Templates
The page object uses runtime string interpolation for bundles and components:
* `bundleCollapseByName`: `//div[contains(@class,'materials-container') and .//h2[contains(@class,'product-name') and contains(.,'{{bundleName}}')]]//a[@data-toggle='collapse']`
* `componentByNameInBundle`: `//div[contains(@class,'materials-container') and .//h2[contains(@class,'product-name') and contains(.,'{{bundleName}}')]]//a[contains(@class,'component') and .//p[contains(@class,'component-name') and contains(.,'{{componentName}}')]]`
* *Trap:* If `bundleName` or `componentName` contains leading/trailing whitespace or special quotes, literal substring match fails. The helper trims input before interpolation.

### 2. Angular Component Lazy-Loading & Container Stabilization
* When navigating from the dashboard class card into Class Materials, Angular lazily instantiates the materials container.
* `click_materialsTab()` enforces two-stage waiting:
  1. Waits for `materialsTab` to be displayed (15s timeout).
  2. Clicks and calls `action.waitForDocumentLoad()`.
  3. Bounded wait on `materialsContainer` (20s timeout) to ensure sub-components finish rendering before attempting bundle reads.

### 3. Back-Navigation from Sub-Folders
* When inspecting nested resources within bundle folders, the back link uses `categoryBackBtn` (`a[qid^='cView-72-'], a.btn-link[aria-label*='Back']`).
* *Trap:* Clicking browser back instead of the in-app breadcrumb resets class context and drops the user onto the main dashboard rather than Class Materials.

---

## Part C — Test Data, Fixtures & Execution Verification

### 1. Test Data Files & Mappings
* **Data File:** [`testResources/testcaseData/ExperienceApp/thor/classMaterialsData.json`](../../../testResources/testcaseData/ExperienceApp/thor/classMaterialsData.json)
* **Keys:**
  * `C1.classMaterials.class1RB.class.name`: `"cqa test class 17aug2026 1"`
  * `C1.classMaterials.class1RB.bundle`: `"cqa test class 17aug2026 1"`
  * `C1.classMaterials.class1RB.ebook`: eBook component label
  * `C1.classMaterials.class1RB.presentationPlus`: Presentation Plus component label
  * `C1.classMaterials.class1RB.resourceBank`: Resource Bank 1 component label
  * `C1.classMaterials.class2RB.*`: Class 2RB fixture set

### 2. Verified Test Coverage (`ebookE2EteacherTest_thor`)
All 6 suites in `ebookE2EteacherTest.json` depend on `classMaterials.page.js` for entry navigation:
* `TST_CMAT_TC_1`: Navigate to Class Materials tab (verified ~680ms)
* `TST_CMAT_TC_2`: Verify product bundle is displayed in Class Materials
* `TST_CMAT_TC_3`: Click eBook / Presentation Plus component within product bundle (verified ~3500ms)
* `TST_CMAT_TC_4`: Verify secondary bundle displayed (Class 2RB)
* `TST_CMAT_TC_5`: Click component in secondary bundle (Class 2RB)
* **Execution Evidence:** Verified 77/77 passing across all 6 suites on Thor (5m runtime, zero failures).

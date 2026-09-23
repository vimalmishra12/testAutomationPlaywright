# Product Knowledge — Class Materials, Resource Bank, eBook & Front-of-Class (Presentation Plus)

> **Feature-area file for `ExperienceApp` (Cambridge One / C1)**.
> Parent index: [`../ExperienceApp.md`](../ExperienceApp.md) · Top-level index: [`../../product-knowledge.md`](../../product-knowledge.md)
> Architecture plan: [`../../PLAN_ebook-foc-suite-merge_2026-09-22.md`](../../PLAN_ebook-foc-suite-merge_2026-09-22.md)
>
> **Living document.** Append, never overwrite. Mark unconfirmed items `[ASSUMED]`.
> Date significant updates `[YYYY-MM-DD]`.

---

## Part A — Product Behaviour & Navigation Journeys

### 1. Teacher Class Materials & Bundles
* **Access route:** Login as Teacher -> Teacher Dashboard -> Click on active class card (e.g. `Class 1RB` or `Class 2RB`) -> Click on **"Class Materials"** tab.
* **Page Object:** [`pages/ExperienceApp/classMaterials.page.js`](../../../pages/ExperienceApp/classMaterials.page.js) (`CMAT`)
* **Bundle Structure:**
  * Displays the enrolled product bundle (e.g., *Cambridge One Product Bundle*).
  * Expanding or viewing the bundle reveals associated instructional components:
    * **eBook:** Launches the digital coursebook in the eBook reader shell.
    * **Presentation Plus:** Launches Front-of-Class (FOC) interactive teacher tools.
    * **Resource Bank:** Launches the downloadable and viewable supplementary teaching resources.

### 2. Resource Bank
* **Page Object:** [`pages/ExperienceApp/resourceBank.page.js`](../../../pages/ExperienceApp/resourceBank.page.js) (`RBNK`)
* **Purpose:** Supplementary repository containing worksheets, teaching notes, audio files, and test generators.
* **Interactions:**
  * Opens within a dedicated view or drawer from the Class Materials component link.
  * Allows navigating resource folders, selecting individual items (e.g. `Item 1`, `Item 2`), and triggering file previews or downloads.

### 3. eBook Reader (Student & Teacher)
* **Page Object:** [`pages/ExperienceApp/eBook.page.js`](../../../pages/ExperienceApp/eBook.page.js) (`EBOO`)
* **Common Reader Shell:**
  * Used by both learners (launched from Dashboard / My Library) and teachers (launched from Class Materials bundle).
  * Top navigation bar houses Table of Contents (TOC), page scrubber/selector, zoom controls, and reader accessories.
* **Table of Contents (TOC):**
  * Clickable navigation panel listing units and lessons.
  * Allows direct jump to specific pages, units, or lesson openers.
* **Reader Tools:**
  * **Notes Tool (`NOTE`):** [`pages/ExperienceApp/notes.page.js`](../../../pages/ExperienceApp/notes.page.js) — Allows creating text notes, editing note text, applying color tags, and deleting notes.
  * **Drawing / Highlighter Tool (`DRAW`):** Allows highlighting text or drawing freehand over eBook pages with color options.
  * **Media Player (`PLAY`):** Embedded audio and video playback directly on page hotspot icons.
  * **Timer Tool (`TIME`):** Classroom stopwatch / countdown widget.
  * **Show/Hide (`SHOW`):** Masking overlay to conceal answers or content during presentation.
  * **Keyboard Focus / A11y (`KBOA`):** Full keyboard tab-navigation sequence across the reader controls.

### 4. Front-of-Class (FOC) Presentation Plus
* **Purpose:** High-engagement digital presentation software designed for interactive classroom projection.
* **Launch:** Launched by the teacher from Class Materials via the Presentation Plus component button.
* **Key Capabilities:**
  * Interactive classroom presentation view of the complete course content.
  * Contains lesson activities, audio/video hot-links, answer reveal keys, and direct assignment creation.

### 5. Creating Assignments from Presentation Plus
* **Page Object:** [`pages/ExperienceApp/c1assignment.page.js`](../../../pages/ExperienceApp/c1assignment.page.js) (`C1AS`)
* **End-to-End Workflow:**
  1. Inside Presentation Plus reader view, open the **Table of Contents (TOC)**.
  2. Click **"Create Assignment"** button embedded in the TOC.
  3. A prompt/modal displays: clicking **"Take me to assignments"** transitions to the Assignment Creation wizard (clicking "Cancel" returns to TOC).
  4. **Select Content:** Choose target Unit (e.g. Unit 1) and Lesson (e.g. Lesson A).
  5. **Assignment Details:** Click Next, specify Assignment Name (e.g. `Assignment Name 1`), and configure Start and Due dates.
  6. **Student Selection:** Select individual students or all students in the class.
  7. **Summary & Assignment:** Review summary screen and click **"Assign"**.
  8. **Return to Reader:** A success modal appears with the button **"Return to Presentation Plus"**. Clicking it cleanly returns the teacher to the Presentation Plus reader view.

---

## Part B — Automation Traps & Technical Rules

### 1. New-Tab URL Commit Race Condition (`notes.page.js`)
* **The Trap:** When opening an external URL, preview link, or note attachment in a new browser tab, calling `action.switchToNewTab()` switches context immediately upon tab creation. Reading `global.page.url()` immediately thereafter frequently captures `about:blank` or the initial request before the target URL has committed navigation.
* **The Solution (Commit `71f7451ac161`):**
  Use Playwright's `waitForURL()` with `{ waitUntil: "commit" }` followed by a fallback polling loop before closing the tab:
  ```javascript
  await global.page.waitForURL(
    (url) => url.href.toLowerCase().includes((expectedUrlPart || "").toLowerCase()),
    { timeout: 15000, waitUntil: "commit" }
  );
  ```
  This guarantees that navigation has officially committed before URL assertions execute.

### 2. Multi-Suite Session Teardown (`APPS_1` / `APPS_2`)
* **The Trap:** In multi-suite test files like `ebookE2EteacherTest.json` (which executes 6 sequential suites), failing to log out at the end of each suite leaves cached authentication tokens and cookies in the browser. When the subsequent suite attempts `launchUrl`, it lands on a dirty dashboard rather than the login screen, causing the login steps to fail.
* **The Solution:** Every teacher suite must conclude with an `After` teardown block calling `TST_APPS_TC_1` (open user profile dropdown) and `TST_APPS_TC_2` (click log out and verify landing page loaded).

### 3. r4 Create-Only Archive Invariant
* **Rule:** Never delete, rename, or edit existing test execution files under `testResources/testExecutionFiles/ExperienceApp/thor/`.
* When consolidating test suites (such as the 17 individual eBook/FOC suites into the 3 consolidated suites), the consolidated suites are created as **new files** (`ebookE2EstudentTest.json`, `ebookE2EteacherTest.json`, `ebookFocusA11yMergedTest.json`). The superseded original files are retained permanently on disk as frozen archives so that historical execution paths remain reproducible.

### 4. Table of Contents & Modal Transitions
* When opening the TOC or launching the Assignment modal from Presentation Plus, animations must settle. Using `isInitialized()` checks on target page objects (`require('./c1assignment.page').isInitialized()`) guarantees modal elements are fully intractable before clicking.

---

## Part C — Test Data, Fixtures & Environment Matrix

### 1. Environment & Fixtures (Thor)
* **Environment URL:** `https://micro-nemo.comprodls.com/login`
* **Test Data Files:**
  * [`testResources/testcaseData/ExperienceApp/thor/classMaterialsData.json`](../../../testResources/testcaseData/ExperienceApp/thor/classMaterialsData.json)
  * [`testResources/testcaseData/ExperienceApp/thor/ebookData.json`](../../../testResources/testcaseData/ExperienceApp/thor/ebookData.json)
  * [`testResources/testcaseData/ExperienceApp/thor/assignmentLoginData.json`](../../../testResources/testcaseData/ExperienceApp/thor/assignmentLoginData.json)
* **Teacher Login:**
  * Node: `C1.login.user.validTeacher`
* **Student Login:**
  * Node: `C1.login.user.validStudent`
* **Class Fixtures:**
  * `class1RB`: `cqa test class 17aug2026 1` (contains 1 teacher, product bundle with Presentation Plus, eBook, and Resource Bank)
  * `class2RB`: Secondary class for 2RB resource bank verification.
* **eBook Fixtures:**
  * `ebookOneName`: `vm_automation_ebook_latest_01`
  * `ebookTwoName`: `vm_automation_ebook_latest_02` (corrected in commit `71f7451ac161`)

### 2. Consolidated Execution Suites
| NPM Script | Execution File | Suites / Focus |
|---|---|---|
| `npm run ebookE2EstudentTest_thor` | `ebookE2EstudentTest.json` | 8 student suites: TOC, full 38-step notes battery, drawing, zoom, navigation, pagination teardown |
| `npm run ebookE2EteacherTest_thor` | `ebookE2EteacherTest.json` | 6 teacher suites: Class 1RB materials & eBook, Class 2RB materials & eBook, Resource Banks 1 & 2, Presentation Plus launch, and Suite 6 Create Assignment |
| `npm run ebookFocusA11yTest_thor` | `ebookFocusA11yMergedTest.json` | Single-login 19-step keyboard accessibility focus traversal |
| `npm run eBookHotLinkTest_thor` | `player.json` | Media player hot-link playback |

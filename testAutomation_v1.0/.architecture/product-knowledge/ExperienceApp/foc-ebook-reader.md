# eBook Reader (student & teacher) — shell, TOC, reader tools, accessibility

> Screen file (ADR-020). Read `c1-core-shared.md` first.
> Parent index: [`../ExperienceApp.md`](../ExperienceApp.md) · Top-level index: [`../../product-knowledge.md`](../../product-knowledge.md)
> Module **`EBOO`** ([`pages/ExperienceApp/eBook.page.js`](../../../pages/ExperienceApp/eBook.page.js))
> Associated modules: `NOTE`, `DRAW`, `PLAY`, `TIME`, `SHOW`, `PAGE`, `KBOA`, `EBTF`
> Related suites:
> - [`ebookE2EstudentTest_thor`](../../../testResources/testExecutionFiles/ExperienceApp/thor/ebookE2EstudentTest.json) (8 suites, 127 tests)
> - [`ebookAccessibilityTest_thor`](../../../testResources/testExecutionFiles/ExperienceApp/thor/ebookAccessibilityTest.json) (35 tests)
> - [`visualAcceptance_ebookAccessibility_thor`](../../../testResources/testExecutionFiles/ExperienceApp/thor/ebookAccessibilityTest.json)
> Living document — append, never overwrite; `[ASSUMED]` until seen live.

---

## Part A — Product Behaviour & Layout

### 1. Reader Shell & Top Toolbar
The eBook reader shell is an interactive digital canvas embedded within an iframe/application container shared by learners and teachers:
* **Top Toolbar Controls:**
  * **Home button (`homeBtn`):** Navigates out of the reader back to the calling dashboard (`TST_EBOO_TC_5`).
  * **Table of Contents (`tocBtn`):** Slides out the unit/lesson directory popover (`TST_EBOO_TC_2`).
  * **Tools menu (`toolsBtn`):** Toggles secondary accessories (Notes, Drawing, Timer, Show/Hide).
  * **Zoom controls (`zoomInBtn`, `zoomOutBtn`, `fitToHeightBtn`):** Scales reader page canvas.
  * **View toggles (`singlePageViewBtn`):** Toggles between single-page and two-page spread.
  * **Jump to Page / Scrubber (`jumpToPageBtn`, `pageInput`):** Allows typing page number or dragging page slider.
  * **Next / Previous Page (`nextBtn`, `prevBtn`):** Flips forward/backward through book pages.
  * **Change Course Material (`changeCourseMaterialBtn`):** Dropdown to switch between enrolled eBooks.

### 2. Table of Contents (TOC) Navigation
* Displays hierarchical book outline: Units -> Lessons -> Exercises.
* Clicking any unit or lesson row immediately scrolls or jumps the reader viewport to that page anchor.
* Background theme: Page canvas verifies base color styling `#fbf6e4` (`rgba(251,246,228,1)` in `TST_EBOO_TC_6`).

### 3. Reader Accessories & In-Page Tools

#### A. Drawing & Highlighter (`drawingTool.page.js`, `highlighter.page.js` — `DRAW`)
* **Suite 4 in Student E2E (22 tests):**
  * Pen tool, straight line tool, and transparent highlighter marker.
  * Color palette selection (e.g. yellow, cyan, magenta).
  * Undo / Redo and "Clear All" canvas actions.
  * Canvas drawings persist in browser `localStorage` across page navigations.

#### B. Timer Widget (`timer.page.js` — `TIME`)
* **Suite 5 in Student E2E (15 tests):**
  * Dual-mode classroom widget: Stopwatch (count-up) and Countdown Timer.
  * Features start, pause, resume, reset, and minimize to titlebar.

#### C. Next / Previous Page Navigation (`nextPreviousPageButton.page.js` — `PAGE`)
* **Suite 6 in Student E2E (6 tests):**
  * Direct numeric input jump (`pageNoTwoBtn`, `pageNoGoToBtn`).
  * Verified forward and backward page rendering.

#### D. Show / Hide Masking Curtain (`showHide.page.js` — `SHOW`)
* **Suite 7 in Student E2E (4 tests):**
  * Adjustable overlay shade allowing instructors/students to conceal exercise answers or text blocks.
  * Resizable via drag handles.

#### E. Interactive Page Hotlinks & Media (`mediaPlayer.page.js` — `PLAY`)
* **Suite 8 in Student E2E (26 tests):**
  * Audio hotspot: launches embedded player with play/pause/scrubber controls, tested with and without transcripts (`TST_PLAY_TC_3`).
  * Video hotspot: launches modal media player dialog.
  * Zoom hotspot: enlarges detailed illustrations/diagrams (`TST_PLAY_TC_6`, closed via `[id^='zoomHotspot-close-button-']`).
  * Activity / Game hotspot: opens interactive exercise overlay (`TST_PLAY_TC_4`).
  * Jump-to-page hotspot: intra-book cross-reference link (`TST_PLAY_TC_5`).

---

## Part B — Automation Traps & Technical Rules

### 1. Color Value Assertions (ADR-009)
* In `TST_EBOO_TC_6`, checking page canvas background color returns an object from `baseActionLibrary.getCssProperty`:
  ```javascript
  {
    property: 'background-color',
    value: 'rgba(251,246,228,1)',
    parsed: { type: 'color', rgba: 'rgba(251,246,228,1)', hex: '#fbf6e4' }
  }
  ```
* *Trap:* Direct string comparisons against `.value` can fail across browser engines (spaces inside rgba strings differ between Chrome and WebKit). Always assert against `res.parsed.hex` (`'#fbf6e4'`).

### 2. Reader Exit Duration (`TST_EBOO_TC_5`)
* Clicking the Home button to exit the eBook reader triggers full state unmount, localStorage flush, and dashboard reload.
* *Observed timing:* Takes **~16,700 ms** on Thor. Do not reduce the navigation timeout below 30s.

### 3. Keyboard Focus Traversal Rules (`KBOA` vs `EBTF`)
* **In-Page Hotspot Accessibility (`TST_KBOA_TC_1..19`):**
  * Tests keyboard Tab forward, Shift+Tab backward, and Enter keys.
  * Pages tested: Page 22 (Notes focus), Page 24 (Hotlink focus), Page 26 (Home button focus), Page 28 (Hotspot loopback).
* **Continuous Toolbar Traversal (`TST_EBTF_TC_1..16`):**
  * Tests tabbing continuously through every top bar control on Page 26:
    Home -> Content -> Tools -> Zoom Out -> Zoom In -> Fit To Height -> Jump to Page -> Prev -> TOC -> Next -> Single Page -> Change Course -> Move Toolbar -> Status Container.
  * Ends by restoring reader state back to Page 20 (`TST_EBTF_TC_16`).

---

## Part C — Test Data, Suites & Execution Evidence

### 1. Test Data Files & Fixtures
* **Data File:** [`testResources/testcaseData/ExperienceApp/thor/ebookData.json`](../../../testResources/testcaseData/ExperienceApp/thor/ebookData.json)
* **Login User:** `C1.login.user.validStudent1_ebook2` (Thor student account)
* **Keyboard Test Data:**
  * `C1.ebook.keyboard.tabKey`: `"Tab"`
  * `C1.ebook.keyboard.shiftTabKey`: `["Shift", "Tab"]`
  * `C1.ebook.keyboard.enterKey`: `"Enter"`
* **Book Fixtures:**
  * Book 1: `"vm_automation_ebook_latest_01"`
  * Book 2: `"vm_automation_ebook_latest_02"`

### 2. Execution Suites & Verified Evidence

| Suite / Script | File | Coverage | Observed Thor Result |
|---|---|---|---|
| `npm run ebookE2EstudentTest_thor` | `ebookE2EstudentTest.json` | 8 student suites (Content, Viewer, Notes, Drawing, Timer, Navigation, Show/Hide, Hotlinks) | **127/127 passing (13m)** |
| `npm run ebookAccessibilityTest_thor` | `ebookAccessibilityTest.json` | 1 single-login suite (19 in-page KBOA + 16 continuous toolbar EBTF) | **35/35 passing (4m)** |
| `npm run visualAcceptance_ebookAccessibility_thor` | `ebookAccessibilityTest.json` | Visual lane running `--visual=novus --skipAssertion=true` | **35/35 passing (3m)** — writes exactly 16 baselines (`TST_EBTF_TC_1..16`), zero for KBOA |
| `npm run eBookHotLinkTest_thor` | `player.json` | Standalone hotlink audio/video player suite | Available for focused player debugging |

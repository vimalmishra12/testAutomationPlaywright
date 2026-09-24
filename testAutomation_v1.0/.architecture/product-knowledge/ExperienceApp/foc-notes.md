# Notes Tool (eBook reader) — create, edit, colour-tag, delete, link navigation

> Screen file (ADR-020). Read `c1-core-shared.md` first.
> Parent index: [`../ExperienceApp.md`](../ExperienceApp.md) · Top-level index: [`../../product-knowledge.md`](../../product-knowledge.md)
> Module **`NOTE`** ([`pages/ExperienceApp/notes.page.js`](../../../pages/ExperienceApp/notes.page.js))
> Related suite: [`ebookE2EstudentTest_thor`](../../../testResources/testExecutionFiles/ExperienceApp/thor/ebookE2EstudentTest.json) (Suite 3)
> Living document — append, never overwrite; `[ASSUMED]` until seen live.

---

## Part A — Product Behaviour & Layout

### 1. Notes Panel Architecture
The Notes tool is an interactive side drawer integrated directly into the eBook reader canvas:
* **Opening the Panel:**
  * Click the "Notes" tool icon in the reader top toolbar.
  * Or click any in-page note pin hotspot on an exercise.
* **Panel Layout:**
  * **Header:** Notes title, search/filter field, sort options.
  * **"Add Note" Button:** Generates a new draft note card attached to the current page viewport.
  * **Notes List:** Vertically scrollable feed displaying all created notes for the current unit/book.

### 2. Note Operations (CRUD)
* **Creating a Note:**
  1. Click "Add Note" (`TST_NOTE_TC_3`).
  2. Input note text into the expandable textarea (`TST_NOTE_TC_4`).
  3. Select a color tag pill (Yellow, Blue, Pink, Green) to categorize the note (`TST_NOTE_TC_6`).
  4. Click "Save" button (`TST_NOTE_TC_7`).
  5. The note card persists in the list, and a corresponding color-coded pin appears on the book page canvas.
* **Editing a Note:**
  1. Click on an existing note card or canvas pin (`TST_NOTE_TC_8`).
  2. Modify the textarea content or select a different color tag pill (`TST_NOTE_TC_9`).
  3. Click "Save" — updates reflect immediately on both canvas and panel.
* **Deleting a Note:**
  1. Click the trash icon on the note card (`TST_NOTE_TC_14`).
  2. Confirm deletion in the confirmation prompt (`TST_NOTE_TC_15`).
  3. The card unmounts and the page pin is removed.
* **Hyperlinks Inside Notes:**
  * Notes support URL recognition (e.g. `https://...`).
  * Clicking an active hyperlink inside a note opens the external resource in a new browser tab (`click_noteHyperlink`).

---

## Part B — Automation Traps & Technical Rules

### 1. New-Tab URL Commit Race Condition (`notes.page.js`)
* **The Trap:** When clicking a link inside a note that opens in a new tab, `action.switchToNewTab()` transfers Playwright context as soon as the tab handle exists. Calling `global.page.url()` immediately thereafter captures `about:blank` or an uncommitted state before the destination HTTP request has committed.
* **The Solution (Commit `71f7451ac161`):**
  Use Playwright's `waitForURL()` with `{ waitUntil: "commit" }` and a 5-iteration fallback polling loop before tab closure:
  ```javascript
  if (expectedUrlPart) {
    await global.page.waitForURL(
      (url) => url.href.toLowerCase().includes((expectedUrlPart || "").toLowerCase()),
      { timeout: 15000, waitUntil: "commit" }
    );
  }
  currentUrl = global.page.url();
  ```
* **Boundary — SPA vs New-Tab Commit:**
  * Client-side same-tab SPA navigations (`schoolLibrary.page.js`) avoid `waitForURL` because the `load` event never re-fires for client-routed paths.
  * In contrast, newly spawned browser tabs load real HTTP documents where `waitUntil: "commit"` guarantees document headers have arrived without waiting for full media load.

### 2. Panel Animation Settling
* The notes side drawer animates onto the screen using a CSS slide transition.
* Attempting to click the "Add Note" or color pills while the panel is mid-animation results in click interception by the parent canvas. Always ensure `waitForDisplayed` confirms target visibility and coordinates have stabilized before dispatching clicks.

---

## Part C — Test Data, Coverage Facts & Verification

### 1. Test Data Files
* **Data File:** [`testResources/testcaseData/ExperienceApp/thor/ebookData.json`](../../../testResources/testcaseData/ExperienceApp/thor/ebookData.json)
* **Keys:**
  * Note content strings, edit strings, color tag identifiers, expected external hyperlink URLs.

### 2. Coverage Facts & Suite Composition
* **Master Suite:** `ebookE2EstudentTest_thor` -> **Suite 3: Validation of eBook Page (Notes) - full notes battery (merged)**.
* **Step Breakdown:**
  * Suite 3 executes **42 Test steps** (preceded by viewer initialization steps `EBOO_1`, `EBOO_3`, `EBOO_8`, `EBOO_13`).
  * Covers **14 distinct `TST_NOTE_*` IDs**:
    * `TST_NOTE_TC_1`: Initialize notes tool
    * `TST_NOTE_TC_3`: Open add note input
    * `TST_NOTE_TC_4`: Enter note description
    * `TST_NOTE_TC_6`: Select note color category
    * `TST_NOTE_TC_7`: Save note
    * `TST_NOTE_TC_8`: Select note for edit
    * `TST_NOTE_TC_9`: Edit note description
    * `TST_NOTE_TC_10`: Cancel note edit
    * `TST_NOTE_TC_11`: Re-open note edit
    * `TST_NOTE_TC_12`: Update color category
    * `TST_NOTE_TC_13`: Save edited note
    * `TST_NOTE_TC_14`: Click delete note icon
    * `TST_NOTE_TC_15`: Confirm note deletion
    * `TST_NOTE_TC_18`: Verify note hyperlink tab navigation
* **Uncovered Registered IDs:**
  * `TST_NOTE_TC_2` and `TST_NOTE_TC_5` exist in `C1TCRepository.json` but are not executed in Suite 3.
  * `TST_NOTE_TC_16` and `TST_NOTE_TC_17` do not exist in the repository.
* **Execution Evidence:** Verified passing cleanly within `ebookE2EstudentTest_thor` (127/127 overall run passing on Thor).

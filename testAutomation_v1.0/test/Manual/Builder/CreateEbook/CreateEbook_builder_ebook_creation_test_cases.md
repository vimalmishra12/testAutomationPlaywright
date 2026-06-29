# Manual Test Cases — Create eBook (Test-Data Creation)

**Feature:** Builder — Create new Student Book (eBook) + import cover / pages / TOC
**Module:** Builder Create eBook (`BECR`)
**App:** asgard-thor-builder.comprodls.com (Thor)
**Purpose:** Repeatable **test-data creation** flow — create a brand-new eBook with mandatory
fields, then attach its cover, page PDF, and table of contents. This is a stable, long-standing
authoring flow used to seed test eBooks; it is documented here as an ordered happy-path so it can
be automated as a data-setup utility (`CreateEbook_thor`).

**Generated:** 2026-06-26 | **Scope:** Admin role only (`harishthoradmin`)
**Total TCs:** 6 (all Positive — sequential E2E chain)

> **ID convention (AGENTS.md Rule 6):** `TST_BECR_TC_<N>` — module code `BECR` derived from the
> Create-eBook feature, **not** a Jira ticket. Numbered sequentially in execution order.
>
> **Structure:** Flat (no AC traceability matrix) — this is a data-creation process with no formal
> acceptance criteria, so per `manual-test-standard.md` the flat structure is used.

---

## Pages in scope

| Page | URL | Notes |
|---|---|---|
| eBooks listing | `/2024/ebooks` | Left-pane **eBook** entry; "Create new Student Book" carousel at top |
| Create eBook form | `[ASSUMED]` modal/route off the listing carousel | Mandatory fields below |
| eBook detail | `/2024/ebooks/<code>` `[ASSUMED]` | Opens on clicking the book; hosts **Assets & Download** |

---

## Test Entities & Data

| Item | Value | Notes |
|---|---|---|
| Unique code | e.g. `cqa_create_ebook_26jun_1` | **Must be unique every run.** Starts with `cqa`, lowercase letters + numbers + underscore only (Builder code rules). Automation generates a per-run suffix. |
| Product Build Title | `Test eBook - <todaydate>_1` (`_2`, `_3`… per book) | Primary searchable title. `<todaydate>` = run date. |
| Display Title | `Test eBook - <todaydate>_DT` | Mandatory. |
| Learning Materials Summary | `Test eBook - <todaydate>_1_LMS` | Mandatory (`#builder-form-field-short-description`). |
| Class Materials Summary | `Test eBook - <todaydate>_1_CMS` | **Mandatory** (`#builder-form-field-very-short-description`) — confirmed on Thor [2026-06-26]. |
| Cover PDF | `D:\ebookCreate\eBookCreationItems\Covers\CQATestLiveCOver+1_2.pdf` | 18-page cover artwork PDF. To be copied into the repo test-data tree for automation. |
| Pages PDF | `D:\ebookCreate\eBookCreationItems\PDF For Pages\cqa34pages28april2026.pdf` | Page content PDF. |
| TOC file | `D:\ebookCreate\eBookCreationItems\TOC\Toc_35withcoverandromanbeforeunit.xlsx` | Table-of-contents spreadsheet (cover + roman pages before unit). |
| Hotlinks file | `D:\ebookCreate\eBookCreationItems\Hotlinks\Thor_AllType_WithoutLearningObject.xlsx` | Hotlink definitions spreadsheet (all hotlink types, without learning object). Imported after TOC. |

> **Mandatory fields (confirmed on Thor [2026-06-26]):** Unique Code, Product Build Year (pre-defaulted
> © 2018), Program (pre-defaulted by program context), Product Build Title, Display Title, Learning
> Materials Summary, **Class Materials Summary**. The create form is the legacy AngularJS form
> `form[name="addEbookForm"]`; the Unique Code pattern is `^[a-z][a-z0-9_-]*$`.

---

## Test Cases

> **Login path (precondition for TC_1):**
> `https://asgard-thor-builder.comprodls.com/2024/pre-login` → select org **Cambridge One** →
> confirm → enter `harishthoradmin` credentials at the comproDLS Identity IdP → land on `/2024/dashboard`.
> **Sequential chain:** TC_1 → TC_6 run in order against the **same** newly-created eBook; each
> depends on the previous. The unique code / Product Build Title created in TC_1 carry through.
> **Import completion signal (TC_3–TC_6):** each asset import is slow; progress shows in the
> top-right status area, and completion is confirmed when the **count badge (circled number) in
> that asset's row** appears/increments (e.g. `PDF, Cover` → `PDF, Cover 1`, `XLSX, Hotlinks 0` →
> `1`). The automation polls that badge to detect completion rather than waiting a fixed time.

---

### ✅ POSITIVE TEST CASES

---

| Field | Value |
|---|---|
| **S.No.** | 1 |
| **Test Case ID** | TST_BECR_TC_1 |
| **Title** | Verify a new Student Book is created and saved when all mandatory fields are valid |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as Admin on Builder Thor (`harishthoradmin`, org Cambridge One). Unique code `cqa_create_ebook_26jun_1` does not already exist. |
| **Test Steps** | 1. Open the eBooks listing. 2. In the **Create New** tile section (top-left), advance the carousel using the **right-arrow (Next Slide)** button until the **Student Book** tile is shown, then click it — the new eBook form opens. 3. Enter **Unique Code**: `cqa_create_ebook_26jun_1`. 4. Enter **Product Build Title**: `Test eBook - <todaydate>_1`. 5. Enter **Display Title**: `Test eBook - <todaydate>_DT`. 6. Enter **Learning Materials Summary**: `Test eBook - <todaydate>_1_LMS`. 7. Enter **Class Materials Summary**: `Test eBook - <todaydate>_1_CMS`. 8. Leave Product Build Year (© 2018) and Program at their defaults; leave non-mandatory fields blank. 9. Click **Save and Return**. |
| **Test Data** | Unique Code `cqa_create_ebook_26jun_1`; Product Build Title `Test eBook - <todaydate>_1`; Display Title `Test eBook - <todaydate>_DT`; Learning Materials Summary `Test eBook - <todaydate>_1_LMS`; Class Materials Summary `Test eBook - <todaydate>_1_CMS` |
| **Expected Result** | The eBook is saved without validation errors and the user is returned to the eBooks listing. The new eBook (Product Build Title `Test eBook - <todaydate>_1`) is present in the listing. |
| **Remarks** | Create form = legacy AngularJS `form[name="addEbookForm"]`. Unique Code must be regenerated each run (pattern `^[a-z][a-z0-9_-]*$`). The "Student Book" tile is not the first carousel slide — advance the carousel to reach it. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 2 |
| **Test Case ID** | TST_BECR_TC_2 |
| **Title** | Verify the newly created eBook can be found by Product Build Title and opened |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | TST_BECR_TC_1 completed — eBook `Test eBook - <todaydate>_1` exists in the listing. |
| **Test Steps** | 1. On the eBooks listing, enter `Test eBook - <todaydate>_1` in the search box and search. 2. Locate the matching eBook in the results. 3. Click the eBook to open it. 4. Wait for the eBook detail page to fully load. |
| **Test Data** | Search term: `Test eBook - <todaydate>_1` |
| **Expected Result** | The eBook appears in the search results. Clicking it opens the eBook detail page, which loads completely (Assets & Download section reachable). |
| **Remarks** | Builder is slow/collaborative — allow generous load time. `[ASSUMED]` Detail-page ready indicator to be confirmed for the automation's `isInitialized()`. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 3 |
| **Test Case ID** | TST_BECR_TC_3 |
| **Title** | Verify the cover PDF is imported into the eBook via Assets & Download |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | TST_BECR_TC_2 completed — the eBook detail page is open. |
| **Test Steps** | 1. Open the **Assets and download** section. 2. Choose **Import** for the cover/PDF. 3. Select the cover file `CQATestLiveCOver+1_2.pdf`. 4. Start the import and wait for processing to complete. |
| **Test Data** | Cover PDF: `CQATestLiveCOver+1_2.pdf` |
| **Expected Result** | The cover PDF uploads and processes successfully; the cover is shown as imported/attached on the eBook with no error. |
| **Remarks** | `[ASSUMED]` "Assets and download" section label, the cover Import control, and the success/processing indicator to be confirmed on Thor. Processing may take time (slow backend). |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 4 |
| **Test Case ID** | TST_BECR_TC_4 |
| **Title** | Verify the pages PDF is imported into the eBook |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | TST_BECR_TC_3 completed — cover imported; eBook detail page open. |
| **Test Steps** | 1. In the Assets & Download section, go to **PDF page import** `[ASSUMED: control label]`. 2. Choose **Import** and select the pages file `cqa34pages28april2026.pdf`. 3. Start the import and wait for processing to complete. |
| **Test Data** | Pages PDF: `cqa34pages28april2026.pdf` |
| **Expected Result** | The pages PDF uploads and processes successfully; the eBook reflects the imported pages with no error. |
| **Remarks** | `[ASSUMED]` PDF-page-import control and completion indicator to be confirmed. Large PDF — allow extended processing/wait. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 5 |
| **Test Case ID** | TST_BECR_TC_5 |
| **Title** | Verify the Table of Contents (TOC) is uploaded to the eBook |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | TST_BECR_TC_4 completed — cover and pages imported; eBook detail page open. |
| **Test Steps** | 1. In the Assets & Download section, choose the **Upload TOC** control `[ASSUMED: label]`. 2. Select the TOC file `Toc_35withcoverandromanbeforeunit.xlsx`. 3. Start the upload and wait for it to apply. |
| **Test Data** | TOC: `Toc_35withcoverandromanbeforeunit.xlsx` |
| **Expected Result** | The TOC uploads and is applied successfully; the eBook shows the table of contents structure with no error. |
| **Remarks** | `[ASSUMED]` Upload-TOC control and success indicator to be confirmed. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 6 |
| **Test Case ID** | TST_BECR_TC_6 |
| **Title** | Verify hotlinks are imported into the eBook from the hotlinks spreadsheet |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | TST_BECR_TC_5 completed — cover, pages, and TOC in place; eBook detail page open. |
| **Test Steps** | 1. In the Assets & Download section, choose the **Import hotlinks** control `[ASSUMED: label]`. 2. Select the hotlinks file `Thor_AllType_WithoutLearningObject.xlsx`. 3. Start the import and wait for it to apply. |
| **Test Data** | Hotlinks: `Thor_AllType_WithoutLearningObject.xlsx` |
| **Expected Result** | The hotlinks file uploads and imports successfully; the eBook reflects the imported hotlinks (all types, without learning object) with no error. With cover + pages + TOC + hotlinks all in place, the eBook is fully seeded as test data. |
| **Remarks** | `[ASSUMED]` Import-hotlinks control and success indicator to be confirmed on Thor. Completes the data-creation chain. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

## Test Code Index

| S.No. | TST ID | Step in chain | Input data | Type |
|---|---|---|---|---|
| 1 | TST_BECR_TC_1 | Create Student Book (mandatory fields) → Save and return | unique code + 3 mandatory titles | Create |
| 2 | TST_BECR_TC_2 | Search by Product Build Title → open eBook | `Test eBook - <todaydate>_1` | Locate/open |
| 3 | TST_BECR_TC_3 | Import cover PDF (Assets & Download) | `CQATestLiveCOver+1_2.pdf` | Asset import |
| 4 | TST_BECR_TC_4 | Import pages PDF | `cqa34pages28april2026.pdf` | Asset import |
| 5 | TST_BECR_TC_5 | Upload TOC | `Toc_35withcoverandromanbeforeunit.xlsx` | Asset import |
| 6 | TST_BECR_TC_6 | Import hotlinks | `Thor_AllType_WithoutLearningObject.xlsx` | Asset import |

---

## Notes for Automation (`CreateEbook_thor`)

- Maps to a new page object `pages/Builder/ebookCreate.page.js` (reusing `ebooks.page.js`
  `searchFor` / listing helpers for TC_2), test file `test/Builder/createEbook.test.js`
  (`TST_BECR_TC_1…TC_6`), execution file `createEbookTest.json`, TC repo entries in
  `BuilderTCRepository.json`, and test data in `testcaseData/Builder/thor/createEbookData.json`.
- Login is composed from the existing `TST_BLOGI_TC_1` / `TST_BLOGI_TC_2` in `login.test.js`
  (ADR-011 — reuse, do not redefine).
- File uploads need the asset files copied into the repo test-data tree (the absolute `D:\ebookCreate\…`
  paths above are the source). Path resolution + the upload interaction may require a new logged
  method in `baseActionLibrary.js` (protected — will confirm before touching).
- Unique code + dated titles are generated per run (like the clone suite's `dynCode`) so re-runs never collide.
- **Live selector capture required** before automation: the create form fields, the carousel
  "Create new Student Book" control, and the Assets & Download import/upload controls are all
  `[ASSUMED]` and must be captured on Thor via the Playwright MCP.

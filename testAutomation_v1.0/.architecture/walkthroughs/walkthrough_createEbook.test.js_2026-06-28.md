# Session Walkthrough — 2026-06-28 — Builder Create eBook (test-data creation)

## Summary
Added a new Builder **Create eBook** test-data-creation feature (`CreateEbook_thor`): manual test
cases + a Playwright automation that creates a Student Book with mandatory fields, then imports its
cover PDF, pages PDF, TOC, and hotlinks. Selectors were captured live on Thor; the suite was
validated end-to-end against Thor.

## Changes Made

### 1. test/Manual/Builder/CreateEbook/CreateEbook_builder_ebook_creation_test_cases.md (+ .xlsx)
- **Type:** Created
- **Layer:** Manual test cases (Test Resources)
- **What changed:** Flat-structure manual set, 6 positive sequential TCs (`TST_BECR_TC_1..6`):
  create → search/open → import cover → import pages → upload TOC → import hotlinks. Excel register
  in house style (14 cols, Cambridge-purple header, Status dropdown). Module code `BECR`.
- **Why:** Document the data-creation flow before automating (per request).

### 2. testResources/selectors/Builder/BuilderSelectors.json
- **Type:** Modified
- **Layer:** Selectors (Test Resources)
- **What changed:** Added `css.Builder.ebookCreate` (carousel `Next Slide`, `Student Book` tile,
  legacy form `#builder-form-field-*` ids, `Save and Return`) and `css.Builder.ebookAssets`
  (`ASSETS & UPLOADS` ready, per-asset rows + `Import` links + ng-file-upload inputs keyed by
  `onCoverSelect/onPDFSelect/onTOCSelect/onHotlinkSelect`, `Process all changes` (`:visible`) +
  confirm `Ok`). All captured live on Thor.
- **Why:** New feature selectors (ADR-002 — one namespace per app).

### 3. pages/Builder/ebookCreate.page.js
- **Type:** Created
- **Layer:** Page Object
- **What changed:** `navigateToEbooks` (reuses ebooks.page.js), `openCreateForm` (advances the
  Create-New carousel to the Student Book tile), `fillCreateForm` (6 mandatory fields incl.
  Class Materials Summary), `saveAndReturn`, `isInListing`/`openBook` (reuse ebooks helpers),
  and `_importFile` (Import → setInputFiles → **Process all changes → confirm Ok** → poll the row
  count badge until it increments = completion). `_rowCount` reads the row's count badge.
- **Why:** Drive the create + asset-import flow through the page-object layer (Rules 2/4).

### 4. test/Builder/createEbook.test.js
- **Type:** Created
- **Layer:** Test Case
- **What changed:** `TST_BECR_TC_1..6`, sequential against one per-run eBook; a `RUN_ID`-suffixed
  `book()` helper makes the code/title unique and consistent across the chain. Login is composed
  from `login.test.js` via the execution file (ADR-011 — not redefined here).
- **Why:** Orchestrate the create + import steps with assertions.

### 5. testResources/testcaseData/Builder/thor/createEbookData.json
- **Type:** Created · **Layer:** Test Data
- **What changed:** `Builder.createEbook.book1` — field bases + absolute paths to the four asset
  files under `D:\ebookCreate\eBookCreationItems\`.

### 6. testResources/testExecutionFiles/Builder/thor/createEbookTest.json
- **Type:** Created · **Layer:** Execution File
- **What changed:** Suite composing `launchUrl` + `TST_BLOGI_TC_1/2` (from login.test.js) + the 6
  BECR TCs, with per-step timeouts (pages = 600000ms).

### 7. testResources/testcaseRepository/Builder/BuilderTCRepository.json
- **Type:** Modified · **Layer:** TC Repository
- **What changed:** New "Builder Create eBook" module registering BLOGI + BECR_TC_1..6 (ADR-007).

### 8. package.json
- **Type:** Modified · **Layer:** Config (PROTECTED — user-confirmed)
- **What changed:** Added `CreateEbook_thor` npm script.

### 9. tooling/capture*.js
- **Type:** Created then Deleted
- **What changed:** Throwaway live-capture scripts (held the plaintext admin password) used to map
  the create form + Assets & Download controls; deleted after selectors were captured.

## Architecture Decisions Triggered
- No new ADRs. Reuses ADR-002 (selector namespace), ADR-007 (TC repo), ADR-011 (compose login),
  ADR-013 (appType-keyed Builder tree). Confirmed the Builder eBook editor is the **legacy AngularJS
  app** (hash routes) behind the 2024 Vue listing — selectors differ accordingly.
- Product knowledge learned (candidate for product-knowledge.md): the create form has 7 mandatory
  fields incl. **Class Materials Summary**; asset import = Import → stage file → **"Process all
  changes" + confirm Ok** → per-row **count badge** is the completion signal.

## Protected Files Touched
- `package.json` — added one npm script, with explicit user confirmation.
- `core/actionLibrary/baseActionLibrary.js` — a `dispatchClick` method was added (user-confirmed)
  as a candidate fix for the overlay-blocked hotlink Process button, but a dispatched (untrusted)
  event fired `ng-click` WITHOUT driving the real upload pipeline (count stayed 0). It was
  **reverted** — the file is back to its original committed state (net-zero diff). The working fix
  needed no action-library change (see below).

## Validation
- Ran `npm run CreateEbook_thor` against Thor (headed Chrome), iterating from live failures:
  1. Imports needed a **"Process all changes" + confirm "Ok"** step after staging the file (the
     count badge is the completion signal) — added.
  2. TOC/hotlinks matched a hidden per-asset Process button → fixed with **`:visible`**.
  3. The hotlink Process button sits under a `tooltip-wrapper` that intercepts a normal click →
     fixed with a **forced real click** `action.click(sel, { force: true })`. (A dispatched event
     does not drive processing — see Protected Files.)
- The process click is therefore **normal click first, `force:true` only as a fallback** when the
  normal click is intercepted (hotlink) — the other assets never reach the fallback, keeping their
  proven path. Forcing the click for ALL assets regressed cover/pages (force fires before the button
  is enabled/stable), so the fallback shape matters.
- Progression: 6/8 → 7/8 → (dispatchClick regression 4/8, reverted) → (force-all regression 4/8) →
  **8/8 passing, 0 failing** on Thor.
- Per user guidance (Builder is slow), added a `_click` helper that settles ~1.5s before EVERY
  button/control click in this page object; **re-confirmed 8/8** after adding it.

## Pending / Follow-up
- Asset file paths are absolute on the author's machine (`D:\ebookCreate\…`); relocate into the repo
  test-data tree if this should run on other machines/CI.
- Consider promoting the create-form field list + import "Process all changes" behaviour into
  `.architecture/product-knowledge.md` (Builder section).

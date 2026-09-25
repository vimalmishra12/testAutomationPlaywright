# Walkthrough — ebookMapping.test.js

## Session 1 — 2026-09-25

## Summary
Analysed `FOC-_Web_Mapping Cases.xlsx` (2 scenarios: Presentation Plus book-to-book page mapping), grounded them live on thor, wrote the manual register, and built and executed the automation (module `EMAP`).

## Changes Made

### 1. pages/ExperienceApp/ebookMapping.page.js
- **Type:** Created · **Layer:** Page Object
- **What changed:** `isInitialized`, `getData_readerState` (book + `?page=` + page label, bounded label poll), `click_nextPage`, `go_toMappedStartPage`, `switch_book` (dropdown → book by title → wait for the address bar).
- **Why:** the reader keeps book/page in the URL; that is the reliable signal.

### 2. test/ExperienceApp/ebookMapping.test.js
- **Type:** Created · **Layer:** Test Case — `TST_EMAP_TC_1` (sheet web1), `TST_EMAP_TC_2` (sheet web2).

### 3. testResources — selectors / TC repo / data / exec file
- `C1Selectors.json`: new `css.ComproC1.ebookMapping` (title/id based anchors). `C1TCRepository.json`: module `EMAP`, both TCs `visualTest: false`. New `ebookMappingData.json` and `ebookMappingTest.json` (2 suites, one login each, teardown `EBOO_5, APPS_1, APPS_2`).

### 4. test/Manual/C1App/FOC/ebookMapping_test_cases.md + .xlsx
- **Type:** Created — 4 TCs (2 automated Positive, 2 derived Edge Not Run). `.xlsx` written with exceljs (not `npm run register`, which only edits).

### 5. .architecture — foc-presentation-plus.md (Part D), product-knowledge.md, ExperienceApp.md, c1-core-shared.md (C4 row), authoring-status.md (block).

## Reconnaissance / traps
| Trap | Applies | Handled |
|---|---|---|
| Positional list ids (`toolbar-ebook-list-item-N`) | yes | book picked by title (XPath template) |
| URL changes before the page label re-renders | yes | bounded label poll; next-page waits for `?page=` change |
| Book id lower case vs title "Third" | yes | case-insensitive URL regex |
| Pre-rendered UI | no | dropdown is only checked with `waitForDisplayed` |
| Sheet step "Move to next page" | yes | thor opens on page ii; next page only when opened on the Cover |

## Runs (thor, 2026-09-25)
- Run 1: 9 passing / 1 failing — `TST_EMAP_TC_2` last step: Book 3 → Book 2 item clicked but URL stayed on Book 3 for 60 s. Not reproduced in 4 probes.
- Runs 2, 3: 10/10 passing each.
- Mistake corrected: my probe wrongly reported Book 3 as taking 33–64 s (bad URL match on the " dt" title); real switch < 1 s. Data timeouts and docs corrected.

## Later in session 1 — owner clarifications
- Owner: Book 1 opens on Cover, Next goes to ii; the reader saves Book 1's last visited page. Tests now assert Cover -> Next -> ii, and `TST_EMAP_TC_5` (conditional Previous-until-Cover, `reset_bookToCover`) runs as setup before each scenario and as teardown in After. Removed `go_toMappedStartPage`; added `_turnPage`, `click_previousPage`, selector `previousPageBtn`.
- Two consecutive visible runs 12/12 passing; the setup really clicked Previous once (4.3 s vs ~45 ms).

## Architecture Decisions Triggered
None new (ADR-011 reuse of Before/After TCs; Invariant 14 followed — the flake was reported, the wait was not lengthened).

## Protected Files Touched
None yet — `package.json` script `eBookMappingTest_Thor` is pending user confirmation.

## Pending / Follow-up
- Confirm and add the npm script; decide on the intermittent switch-back; confirm the sheet's "next page" step and the unmapped-page rule (manual Open items 1–4); `npm install` (jszip, exceljs missing locally) to run `tooling/report/buildReport.js`.

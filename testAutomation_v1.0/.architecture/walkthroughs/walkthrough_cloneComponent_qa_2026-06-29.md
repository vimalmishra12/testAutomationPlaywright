# Session Walkthrough — 2026-06-29 — Clone Component replicated to QA

## Summary
Replicated the Builder **Clone Component (NEMO-24401)** suite from thor to the **QA** environment
(`BuilderCloneComponentTest_qa`). Validated **24/24 on QA** and re-confirmed **24/24 on thor** (no
regression). Several env-specific failures on QA were root-caused and fixed in shared page objects /
selectors — all env-agnostic and backward-compatible.

## CloneComponent replicated to qa

- **Type:** Created + Modified · **Layer:** Test Resources + shared Builder page objects/selectors
- **Files created:**
  - `testResources/testExecutionFiles/Builder/qa/cloneComponentTest.json` (thor copy; `dataFile`
    paths repointed to `qa`)
  - `testResources/testcaseData/Builder/qa/cloneComponentData.json` (QA entity codes — see below)
- **Files modified:**
  - `package.json` — added `BuilderCloneComponentTest_qa` script
  - `testResources/selectors/Builder/BuilderSelectors.json` — `cloneModal.okBtn` and added
    `cloneModal.textInputs` (see fixes)
  - `pages/Builder/ebooks.page.js` — `fillCloneTitle` + `waitForCloneSuccess` (see fixes)
  - `pages/Builder/families.page.js` — `fillFamilyCode` / `fillFamilyTitle` / `saveFamily` /
    `_confirmSaved` (see fixes)

### QA test-entity codes (provided by user)
| Entity | thor | qa |
|---|---|---|
| Non-ingested source component | `cqaclone1_15junepe1` | `cqacloneforautotest` |
| Ingested component | `cqathorjune10pe1` | `cqa_test_pw_16june` |
| Umbrella product (TC12) | `cqaumbrellaforautotest15june2026` | `cqa_test_umb_pri16june` |
| eBook — code conflict (TC13) | `cqacloneebook15june26` | `cqa_test_ebook16june` |
| eBook — *cloned* in TC8 | `cqacloneebook15june26` | `ebook17may206_2` (smaller → faster clone) |

Login uses the existing `qa/builderLoginData.json` (`harishqaadmin`); the env-agnostic org-skip /
landing-host login fixes were already in `main` (from the CreateEbook QA replication).

## Env-specific fixes (all env-agnostic, thor re-validated 24/24)

1. **OK button matched the Type combobox (root cause of TC8 hang).** `cloneModal.okBtn` was
   `button:has-text('OK')` — a case-insensitive *substring* match. The eBook clone modal's Type
   combobox is a `<button role="combobox">` reading **"Student Book"**, which contains "o**ok**", so
   `:has-text('OK')` matched the combobox (earlier in the DOM) and `.first()` clicked it — opening
   the dropdown instead of submitting; the clone never went through and the dialog hung. Fixed to
   **`button:text-is('OK')`** (exact match). This was the real TC8 failure (not the title field).
2. **Family code never committed (TC19/TC20).** On qa the Create-Family Save button stayed disabled
   even though Code+Title were typed. `fillFamilyCode` now targets the **visible** `#uniqueCode`,
   **verifies the value stuck** (retry), and **blurs (Tab)** so the form model commits — manual entry
   tabs between fields; without the blur the value showed in the DOM but validation saw it empty.
   `fillFamilyTitle` switched to `addValue` (Angular ignores `fill()`); `_confirmSaved` now navigates
   to the listing before searching; `saveFamily` Save-enable wait raised 15s→30s for slow qa.
3. **eBook clone slower on qa.** `ebooks.waitForCloneSuccess` dialog-close wait raised 60s→150s
   (condition wait, not a fixed pause). Harmless on thor (closes fast).
4. **Title-field hardening.** Added `cloneModal.textInputs` (`input.border.rounded`) and used it in
   `ebooks.fillCloneTitle` so the title targets the rounded text inputs (code/title), with a
   fallback to the old `visibleInputs` — the Type combobox is a `<button>`, never matched either way.

- **Test results:** **24/24 on qa** and **24/24 on thor** (regression run). qa is ~2.5× slower
  (full suite ~14 min vs thor ~16 min here under load).

## Architecture compliance
- No protected `core/` / config-JS files modified. `env.json` (already had Builder.qa) /
  `package.json` / data are config. The page-object/selector edits were the correct place for the
  OK-substring bug and the qa-specific form-commit behaviour — env-agnostic, not env-branched.

## Asset/entity codes
- Asset/entity codes in `cloneComponentData.json` are environment-specific test data, as designed.

---

## CloneEbook replicated to qa (same session)

- **Type:** Created + Modified · **Layer:** Test Resources
- **Files created:**
  - `testResources/testExecutionFiles/Builder/qa/cloneEbookTest.json` (thor copy; `dataFile` → qa)
  - `testResources/testcaseData/Builder/qa/cloneEbookData.json` (QA entity codes — below)
- **Files modified:** `package.json` — added `BuilderCloneEbookTest_qa` script
- **No code changes needed** — the cloneEbook suite uses the same `ebooks.page.js`/`families.page.js`
  /`cloneModal` selectors fixed for cloneComponent, so the OK-exact-match, family-blur, clone-wait,
  and title-selector fixes carried over. Replication was data + execution file + npm script only.

### QA test-entity codes (provided by user)
| Entity | thor | qa |
|---|---|---|
| Non-ingested source eBook (cloned in most TCs; TC8 ebookSourceCode) | `cqacloneebook15june26` | `ebook17may206_2` (small → fast) |
| Ingested eBook (TC17 delete-present, TC18 conflict) | `cqa_test_ebook_11june` | `cqaebookgamesimagecheck` |
| Non-ingested component (TC8 clones it; TC12 conflict) | `cqaclone1_15junepe1` | `cqacloneforautotest` |
| Umbrella (TC13 conflict) | `cqaumbrellaforautotest15june2026` | `cqa_test_umb_pri16june` |

- **Test results:** **24/24 on qa, first run** (no new fixes). thor cloneEbook re-run as a regression
  check for the shared `ebooks.page.js` changes.

## Pending / Follow-up
- None outstanding — both clone suites (Component + eBook) are green on qa and re-validated on thor.

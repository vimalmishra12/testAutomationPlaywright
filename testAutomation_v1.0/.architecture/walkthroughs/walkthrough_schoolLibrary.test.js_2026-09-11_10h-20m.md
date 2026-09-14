# Walkthrough — `schoolLibrary.test.js` / `umbrellaProduct.test.js` (LIBR / UMBP) — 2026-09-11 → 09-14

**Session goal.** Phase 1 build of the Admin App **Library tab** automation from
`HANDOFF_adminLibraryAndGeneric_20260911.md`. Generic/shell batch not started.

**Environment.** Thor `https://micro-nemo.comprodls.com`, school `FCN-CHZ-PDA`
(`org_perf_testschool_1`), `testt1@mailsac.com`, headed `desktop-chrome-1920`.

**Result.** 14 / 14 passing, 238 s.

---

## 0. Handoff corrections (verified against the repo before building)

| Handoff said | Actually |
|---|---|
| Library: 42 cases to automate | **14** — 28 carry `[EXTRA — Phase 1 exclusion]` in Remarks (register header, 2026-09-02) |
| Generic: 3 Blocked | **5** — also `TST_LIBR_TC_34`, `TST_SADB_TC_8` |
| `aLibrary-*`: 974 elements for 971 products | `aLibrary-4-*` is exactly 1:1 with products (974 = heading). The 977-strong `aLibrary-*` family adds search input, button and sort |

No TC-ID collisions for LIBR/UMBP (checked on real case rows, not prose).

## 1. Grounding findings (live, 2026-09-11)

- **Sort collation is `localeCompare`**, not "case-insensitive". Matched all 974 titles exactly;
  lowercase-lexicographic diverged at index 41 (`anmol_13_oct_2022_03` before `anmol-test-11-nov`).
  Opposite of the Classes tab (code point, admin-shared.md §A4).
- **`TST_LIBR_TC_33`'s premise is false** — Title is the only sort control; no "Date added".
  Written as an enumeration asserting exactly one, so it fails if a second is added.
- **Licence tile's qid'd `div` is inert** — the control is the `a.product-tile` inside it.
- **Component name element is always present, empty when there is no name** — counting it is a
  false green. Read its text.
- **Materials view has two `h2`**; the first is "Download the Cambridge One Desktop App".
  Scoped to `section.umbrella-components`.
- **Materials view is Vue, on the teacher route**; row and tile clicks are full navigations.
- **Truthful absences here:** `div.list-container`, `.no-records`, sort control and Clear link are
  genuinely removed when not applicable.
- Only one `.modal-content` on the tab — the shared change-school-key dialog.
- Licence set changed since 2026-08-26 (`devtest0106` replaced
  `presentation_plus_test_umb_product_2_june_1`); catalogue grew 970 → 974.
- Timings: tab → list 20.6 s; cold render 9.5 s; sort 571 ms; search 1.1–1.6 s; product page ~1.2 s.

## 2. Changes

| File | Type | What |
|---|---|---|
| `testResources/selectors/ExperienceApp/C1Selectors.json` | Modified | `schoolLibrary` (22 keys, incl. `pageLoader`), `umbrellaProduct` (9) |
| `pages/ExperienceApp/schoolLibrary.page.js` | Created | List read in one `getText`; by-title row selector; overlay wait; context-restoring return path |
| `pages/ExperienceApp/umbrellaProduct.page.js` | Created | Header, components (type/name as text), load-more, activation summary |
| `test/ExperienceApp/schoolLibrary.test.js` | Created | LIBR 2, 3, 4, 10, 11, 12, 20, 23, 25, 33 + housekeeping 100/101 |
| `test/ExperienceApp/umbrellaProduct.test.js` | Created | UMBP 1, 2, 3, 9 |
| `testResources/testcaseRepository/ExperienceApp/C1TCRepository.json` | Modified | Modules LIBR (12), UMBP (4), all `visualTest: false` |
| `testResources/testcaseData/ExperienceApp/thor/adminSchoolLibraryData.json` | Created | No counts, no licence names |
| `testResources/testExecutionFiles/ExperienceApp/thor/adminSchoolLibrary.json` | Created | Empty `AfterEach` by design (ADR-019) |
| `package.json` | Modified | `adminSchoolLibraryTest_thor` — confirmed by user |
| `.architecture/authoring-status.md` | Modified | LIBR/UMBP block |

## 3. Run history (2026-09-14) — and a process mistake

Phase 1 needed one execution; it was met at run 3 (9 / 5). **I then looped ~9 runs fixing one
symptom per run**, until the user stopped it by pointing at the loading spinner on screen. That
observation was the root cause I had been misattributing.

| Bug (all ours) | Symptom | Fix |
|---|---|---|
| LIBR + UMBP shared a `testFile` | `Cannot find TST_UMBP_TC_2` | UMBP → own test file. Runner takes first matching module then `break`s. **`tcMap.js` did not catch it.** |
| Glob `waitForURL` | 45 s timeout, no URL reported | Substring poll that names the URL |
| `getText` on removed container | TC_20 30 s stall, "rendered -1 rows" | `isExisting` first |
| Loader overlay | Click "succeeded", nothing happened; "`<div class=loader>` intercepts pointer events" | `waitForLoaderGone` before clicks |
| Teacher route drops context | Four cases hunting a "missing" row | BeforeEach re-selects school by key |

**Correction recorded:** I first blamed the inert tab click on unbound Angular handlers and added a
retry — wrong, removed. Then I told the user the overlay explained it — also wrong: it failed once
with the overlay already cleared. **Root cause still unknown** (§4).

## 4. Pending / follow-up

- **OPEN:** intermittently inert LIBRARY tab click. Recovery path avoids it; `TST_LIBR_TC_101` still uses it.
- **`tooling/tcMap.js` gap:** does not model first-match-wins, so shared-`testFile` modules pass it.
  Also found pre-existing in `activeClass.test.js` (Delete Class + Active Class).
- Promote §1 findings into `admin-library-tab.md` (not done this session).
- Phase 3 visual assessment — owed.
- Generic batch — not started.

## Architecture decisions triggered

ADR-019 (BeforeEach cleanup), ADR-021 rule 1 (no absolute counts), Invariants 5, 13, 14.
> ⚠️ New constraint worth an ADR: **one TC-repository module per `testFile`.**

## Protected files touched

None of the AGENTS.md protected list. `package.json` script added with explicit user confirmation (§8 Rule B).

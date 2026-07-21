# Session Walkthrough — 2026-07-02

## Summary
Automated the **Create-Family "Product Logo" image-selection** cases on Thor (Builder), from the
`Create_Family_RTM_v2` manual matrix (Image Upload category, TC-CF-016..021). New module **BFAM**
(`families.page.js`) with 6 TCs. Real selectors + dynamic behaviour were captured live on Thor via a
throwaway design-time Playwright script (the Playwright MCP could not start under this machine's
Node v18.15.0 — `URL.canParse` needs ≥18.17). Verified green on Thor **8/8, twice** (2 login + 6 image).

One product finding: a **broken external image URL does NOT show an inline error** (RTM CF-IMG-004
expectation) — Thor swaps in a placeholder cover image (`alt='placeholder'`). The test asserts the
actual placeholder-fallback behaviour and flags the gap.

---

## Changes by file

### Selectors
- `testResources/selectors/Builder/BuilderSelectors.json` — extended `css.Builder.families` with the
  image block: `imageFileInput` (`#fileInput`, hidden), `imageUrlInput` (`#imageUrl`, type=url),
  `imageUploadBtn`, `imagePreview` (`div.border-dashed img.object-cover`), `imagePlaceholderPreview`
  (`…img.object-cover[alt='placeholder']`), `imageRemoveBtn` (`button:has-text('Remove')`),
  `imageErrorText` (`div.border-dashed .text-red-500`), `imageErrorReset`.

### Page object
- `pages/Builder/families.page.js` — added image-selection methods (all via the action library):
  `uploadImageFromFile` (sets hidden `#fileInput`, waits preview, returns `{previewStatus, src, alt}`),
  `uploadImageFromUrl` (types `#imageUrl` + **Enter** to confirm), `typeImageUrlWithoutConfirm`
  (proves no auto-load), `confirmTypedImageUrl`, `uploadFileExpectingError` (non-image → error text),
  `removeImage` (Remove btn → preview detaches → upload control returns). Reuses existing
  `navigateToCreate`.

### Test
- `test/Builder/familyImage.test.js` (NEW) — `TST_BFAM_TC_1..6`, mapped to RTM TC-CF-016..021. Each TC
  opens a fresh Create-Family form so they are independent and create **no** family records (image
  control only). TC_4 asserts the placeholder-fallback (documented product gap).
- **`TST_BFAM_TC_7` (added 2026-07-02, RTM CF-IMG-005) — KNOWN-FAILING defect guard.** Drives a
  disallowed image format (`.webp`) and asserts a **format-specific** rejection. Live finding: `.webp`
  is not previewed but the app shows a **generic "Something went wrong"** (no format guidance), so the
  TC **fails by design** to document the reported issue; it turns green once the app names the allowed
  formats. Uses a real `.webp` at `D:\ebookCreate\familyImages\familyLogo.webp`. NOTE: the real
  OS-drag-drop half of the issue is **not** automatable (browser blocks synthetic file drops) — needs a
  manual hand-test.

### Data / exec / TC repo
- `testResources/testcaseData/Builder/thor/familyImageData.json` (NEW) — `image1` with `imageUrl`
  (the given cambridgeonehelp URL), `brokenImageUrl`, `localImage`, `nonImageFile`.
- `testResources/testExecutionFiles/Builder/thor/familyImageTest.json` (NEW) — login (reuses
  `TST_BLOGI_TC_1/2`, `validAdmin` = harishthoradmin / Cambridge One) + the 6 BFAM TCs.
- `testcaseRepository/Builder/BuilderTCRepository.json` — registered module
  "Builder Family — Image Selection" (`CreateFamily-Image`).

### Architecture docs
- `product-knowledge.md` — added the Create-Family image section (sources, confirm-via-Enter,
  preview/placeholder/error DOM) and the broken-URL placeholder finding.

### Test assets (outside repo, on the runner)
- `D:\ebookCreate\familyImages\familyLogo.png` (downloaded from the given URL) and `notAnImage.txt`.

---

## Protected Files Touched
None — no protected JS/config files were modified. **package.json NPM script is still PENDING user
confirmation** (protected file); the suite was run directly via `node core/runner/run.js …` to verify.

---

## Verification
- `npm run familyImageTest_thor` — **8 passing, 1 failing**. The 8 (2 login + TC_1..6) are green and
  deterministic across 4+ runs. The 1 failing is **TST_BFAM_TC_7 by design** — the KNOWN-FAILING
  defect guard for the reported .webp/format-specific-rejection issue (CF-IMG-005). It is NOT a
  regression; it turns green when the product is fixed.
- Headless (`--headless=true`) fails to launch: installed browser build is
  `chromium_headless_shell-1223` but Playwright 1.61 wants `-1228`. Headed uses system Chrome and works.
  Fix later with `npx playwright install` if headless/CI is needed.

---

## Extension — persisted-image + Umbrella (same session, 2026-07-02)

Added on top of the create-form image cases, to verify the image actually PERSISTS (not just previews):

- **Family save → edit → list (`TST_BFAM_TC_8`, cleanup `TST_BFAM_TC_9`).** Fills code+title+image URL,
  Saves (redirects to `/2024/families`), reopens the family → **Setup tab** and asserts the persisted
  cover (`div.border-dashed img.object-cover` src == saved URL), then asserts the same cover renders as
  the **Families-list thumbnail** (`div.flex.items-start:has(h2:text-is('{text}')) img`). TC_9 deletes it.
  New `families.page.js` methods: `openDetailSetup(code)`, `getListImage(title)`.
- **Umbrella suite (NEW, module BUMB, ticket NEMO-24627).** `pages/Builder/umbrella.page.js` +
  `test/Builder/umbrellaImage.test.js` (`TST_BUMB_TC_1` create+save+edit-verify, `TST_BUMB_TC_2`
  cleanup) + `umbrellaImageData.json` + `umbrellaImageTest.json` + TC-repo module + npm script
  `umbrellaImageTest_NEMO-24627_thor`. Umbrella is a separate entity: create at `/2024/umbrellas/create`
  with an extra **Umbrella Type** `<select>` (Generic/Teacher), fields by `name` (`unique-code`,`title`),
  submit button reads **"Submit"**; same image control; redirects to `/2024/umbrellas`.

### Edit-mode repeat of the 5 image cases (added 2026-07-02)
The same image control lives on the **detail → Setup tab** (edit mode) for both entities, with its own
**Save** button; the create-form selectors (`#fileInput` / `#imageUrl` / `div.border-dashed …`) work
there unchanged. Re-ran the first 5 image-selection cases (TC-CF-016..020) on the Setup page:
- **Family:** `TST_BFAM_TC_10` (cover-less fixture) → `TC_11..15` (local / URL / no-auto-load / broken
  / non-image on the Setup page) → `TC_16` (delete fixture). New method `families.openEditSetup(code)`.
- **Umbrella:** `TST_BUMB_TC_3` (fixture) → `TC_4..8` → `TC_9`. Added `umbrella.openEditSetup` +
  `typeImageUrlWithoutConfirm` / `confirmTypedImageUrl` / `uploadFileExpectingError` / `removeImage`
  + `umbrella.imageErrorText` selector.
Each edit case re-opens the Setup page fresh (unsaved image changes are discarded on navigation), so no
inter-case reset is needed. Cleanup TCs must `navigateTo()` the listing first (Setup page has no
`#search`). **Verified: family 17 pass + TC_7 (intentional), umbrella 11/11.**

### Product / framework findings from the extension
- **Umbrella listing shows NO cover thumbnail** (Family's does) — so umbrella image persistence is
  verified in edit mode only, not the listing. Recorded in product-knowledge.md.
- **Latent selector bug (pre-existing):** the Families/Umbrella `<main>` has **no explicit
  `role="main"` attribute**, so the CSS attribute selector `[role='main']` matches **nothing**. The
  existing `families.itemLink`/`itemLinkByText` (used by `isFamilyInListing`) are therefore dead —
  `isFamilyInListing` always returns `found:false` (masked in the clone suite). New code uses `main …`
  (element selector) instead. **Follow-up:** fix `families.itemLink*` to `main …` and re-verify the
  clone suites (left unchanged here to avoid destabilising them).

## Pending / Follow-up
- **package.json script** (protected — awaiting confirmation):
  `"familyImageTest_thor": "node core/runner/run.js --appType=Builder --testEnv=thor
  --testExecFile=familyImageTest.json --browserCapability=desktop-chrome-1920"`.
- **Product gap (CF-IMG-004):** broken external image URL shows a placeholder, not an inline error —
  raise with the Builder team; revisit TC_4's assertion if the product changes to a real error.
- Node upgrade (≥18.17) would restore the Playwright MCP for future live selector capture.
- Remaining Create-Family RTM categories (title/code validation, submit behaviour, refresh,
  accessibility, E2E) are un-automated — same BFAM module when picked up.
- Image control is shared by **Umbrella** create (same DOM) — BFAM methods should port directly.

---

## Session 2026-07-20 — PR #12 review fixes + rebase onto main (ADR-018)

PR #12 review (by Claude, requested by Vimal) found two blockers and three minor issues; all fixed
on branch `builder-image-suites-pr12-rebased` (supersedes the original `HK_Builder_FamilyDetailPage1`
PR branch, whose commits are preserved via merge).

### Fixes
1. **Merge conflict / ADR-018:** the PR appended the Family/Umbrella "Product Logo" knowledge to the
   monolithic `product-knowledge.md`, which main had since split per app (commit 407ff90). Resolved by
   merging `origin/main` and relocating the whole section into `product-knowledge/Builder.md`
   (the index `product-knowledge.md` keeps main's version).
2. **Machine-local test assets:** data files pointed at `D:\ebookCreate\familyImages\…` (absolute,
   author's machine only — suites could not run on CI or any other machine). Assets are now
   repo-tracked under `testResources/testAssets/Builder/` (`familyLogo.png` 208x120 generated with
   pngjs, `sp3cial @#&()!+ name.png` copy, `familyLogo.webp` minimal valid 1x1, `notAnImage.txt`) and
   both data JSONs use repo-relative `./testResources/testAssets/Builder/…` paths
   (`action.setInputFiles` does `path.resolve()`, so relative-to-CWD works under `npm run`).
   NOTE: the new png/webp differ from the originals — visual baselines are gitignored/per-machine, so
   no stale-baseline risk, but the first visual run after this change re-bootstraps baselines.
3. **`umbrella.fillTitle`** now verifies the typed value stuck (same getValue check as `fillCode` —
   same Vue-form quirk).
4. **`imageControl.uploadBrokenImageUrl`** early exit now returns the full
   `{ placeholderIcon:false, realImg:false, errorShown:false }` shape so a failed addValue produces a
   diagnosable assertion failure instead of comparing against `undefined`.
5. **Umbrella manual docs** (md + xlsx): broken-URL test data said `this-family-cover-…` while
   `umbrellaImageData.json` uses `this-umbrella-cover-…` — aligned to the umbrella URL. Both manual
   md files now reference the repo asset paths. (The xlsx registers store bare filenames, so only the
   umbrella URL cell needed patching — done in-place via .NET ZipArchive.)
6. This walkthrough renamed `walkthrough_2026-07-02.md` → `walkthrough_familyImage.test.js_2026-07-02.md`
   (testfile + date convention).

### Verification (this session)
- `node --check` on the three touched JS files; both data JSONs re-parsed clean.
- **Thor re-runs after the asset swap — ALL GREEN (2026-07-20, post-merge, on main `ad95a8c`):**
  - `familyImageTest_thor` — **20/20 passing (2m)**. First attempt had ONE flake:
    `TST_BFAM_TC_1` (the very first local-file upload right after login) timed out waiting for the
    preview, while the SAME png passed in TC_6/TC_11/TC_17 of the same run; the immediate rerun was
    clean with TC_1 at ~4s. Root-cause hypothesis: the first `setInputFiles` races the Vue form's
    cold-start hydration, so the change event is missed. **To be discussed with the team before any
    fix** — proposed hardening (NOT applied): bounded single retry in
    `imageControl.uploadImageFromFile` (re-set the input once if the 30s preview wait expires).
  - `umbrellaImageTest_NEMO-24627_thor` — **13/13 passing (2m)**.
  - `visualAcceptance_familyImage_thor` — 20/20; 5 baselines re-bootstrapped
    (`Suite1-…-TST_BFAM_TC_4/5/7/14/15.png`).
  - `visualAcceptance_umbrellaImage_NEMO-24627_thor` — 13/13; 2 baselines re-bootstrapped
    (`TST_BUMB_TC_7/8`). Baselines are per-machine and gitignored, as designed.
- NOTE: the first run attempt of the day failed at startup with a `SyntaxError` in `env.conf.js` —
  a machine-local uncommitted edit had stripped every `=>` token (editor corruption, no framework
  bug). Restored from HEAD with user approval; nothing committed.

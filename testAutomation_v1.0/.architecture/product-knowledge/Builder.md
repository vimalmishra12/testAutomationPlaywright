# Product Knowledge — Builder (comproDLS Builder 2.0)

> **Living document.** Append, never overwrite. One section per app, keyed by
> its subdomain URL. Mark anything not verified on the live app as `[ASSUMED]`
> and promote to confirmed once observed. Date significant updates with
> `[YYYY-MM-DD]`.
>
> **Scope:** comproDLS Builder (appType `Builder`). Usage rules, the per-app
> template, and the app→file map live in the index: `../product-knowledge.md`
> (split per application — ADR-018).

---

## APP: Builder  (asgard-thor-builder.comprodls.com)

**appType:** `Builder`  ·  **TC ID:** per-module code (AGENTS.md Rule 6), e.g. login → `TST_BLOGI`  ·  **Selector namespace:** `css.Builder`
**Purpose:** comproDLS **Builder 2.0** — authoring tool for learning content (eBooks, activities,
metadata). A separate product from Cambridge One, added as a second `appType` (ADR-013).

*First seeded: [2026-06-15]*

### Environment URLs

| Environment | URL |
|---|---|
| Thor (dev) | https://asgard-thor-builder.comprodls.com/2024/pre-login |

### Login — 3-step cross-domain SSO (confirmed on Thor [2026-06-15])

1. **Pre-login** (`/2024/pre-login`): choose **organisation** from `select#selectedOrg`
   (options include *Cambridge One*, *Vista Higher Learning*) → click `button[type=submit]` (Login).
2. **Confirmation** (`/2024/login`): a "To continue, log in to DLS Builder" page →
   click `button[type=submit]` (Login) → redirects to the identity provider.
3. **IdP** (`asgard-thor-assets.comprodls.com/builder-identity`, *comproDLS™ Identity*):
   `input#login-user` + `input#login-pass` + `button#login-mfa-btn` (LOGIN) → on success
   redirects via `/2024/redirect` ("Logging you in…") to the app landing.

**Landing:** `/2024/dashboard` (title *Builder 2.0*) — sticky app header (`header.sticky`),
left nav, "Dashboard" + "Recent Activity".

**Login gotchas (important):**
- The IdP form is React/Angular — it **ignores `fill()`'s value** (submits "empty" → bounces back to
  Sign In). Credentials must be **typed** (`addValue` / `pressSequentially`).
- `button[type=submit]` exists on BOTH the pre-login and confirm pages, so the automation must wait
  for each page transition before acting (otherwise it re-clicks the previous page's button).
- No MFA challenge is shown for the QA admin account (the `#login-mfa-btn` id notwithstanding).

**Test account (Thor):** org *Cambridge One*, user `harishthoradmin` (password in
`testResources/testcaseData/Builder/thor/builderLoginData.json`, plaintext for now).

### Performance & sync characteristics (confirmed [2026-06-23])

Builder is a **slow application by design** — it is an authoring tool with limited
user access and limited resources, and it supports **collaborative authoring**. Because
of the collaboration model, **every update triggers heavy backend syncing**, so
operations are slow and state propagation is **delayed and variable**.

**Implications for automation:**
- Prefer **long, retry/poll-based waits** over fixed `browser.pause()` values. Fixed
  pauses either flake (too short) or waste time (too long) because sync latency varies.
- **Delete is async with a long sync lag.** After deleting an eBook/Component, the item
  disappears from the listing **well before its code is actually freed** in the backend.
  Re-cloning to a just-deleted code (NEMO-24402 TC_7) can therefore still hit a
  duplicate-code error even after the item is gone from the listing — the code-free
  propagation lags behind the listing-removal. Wait/poll generously for the code to free.
- **`waitForCloneSuccess()` gotcha** (`pages/Builder/ebooks.page.js`): on an inline error
  it cancels the modal and still returns `{ cloneStatus: true }`. A re-clone that silently
  fails on "code in use" looks like a pass until a later `isInListing` check fails.
- **"Cloning State" — a clone appears in the listing BEFORE it is usable** (confirmed via manual
  repro [2026-06-24]): immediately after the clone dialog closes, the new item shows in the
  listing card with status text **"Clone in Progress"** under the name, and its kebab → **Delete
  is not available until cloning COMPLETES**. When done, the card status changes to **"Work In
  progress"**. Attempting the delete while still "Clone in Progress" fails with "Delete modal did
  not open". The manual workaround (and the automation's `waitForInListing`): after the item
  appears, **refresh every ~10s, 2–3 times, until the status leaves "Clone in Progress"**, THEN
  delete. NOTE both labels contain "in progress", so the cloning check must match **"Clone in
  Progress"** specifically, not a generic "in progress".
- **Delete is async too** (confirmed [2026-06-24]): on delete the card status stays **"Work In
  progress"** but a **"Deleting"** indicator appears on the right; the entry only leaves the
  listing after **2–3 page refreshes**. The freed code is NOT available for a re-clone (same or
  cross-entity) until the entry has actually disappeared — so cross-entity flows (TC_8) must
  refresh-poll for absence after the delete AND retry the re-clone, because code-free lags the
  listing removal.

### Create Family — "Product Logo" image section (confirmed on Thor [2026-07-02])

The Create-Family form (`/2024/families/create`, a Vue form) has a **Product Logo** image control
(shared with Umbrella create). It accepts **two sources**, both landing in the same dashed dropzone:
- **Local file** — hidden `input#fileInput` (`accept="image/png, image/jpeg"`, name `Image-Upload`).
  Set it directly (no OS chooser); Builder uploads to S3 and renders the preview (`src` = an
  `…s3…amazonaws.com/ebook-uploads/…` URL).
- **External URL** — `input#imageUrl` (type=url). **The preview does NOT auto-load while typing —
  the user must confirm with Enter** (CF-IMG-003 / CF-UX-001). On confirm, a preview `<img
  class="w-52 h-30 object-cover rounded-md">` renders (`src` = the given URL).

Once a preview shows, the upload/URL controls are replaced by the preview `<img>` + a **Remove**
button (`aria-label` literal `{{ $t('COVER_UPLOAD.REMOVE') }}`); Remove reverts to the upload state.

**Error handling — as of the 2026-07-07 iteration:**
- **Unsupported file format → FIXED (was CF-IMG-005).** The control accepts **only png / jpeg / jpg**.
  Any other file that reaches it (`.webp`, `.txt`, … via `setInputFiles`, which bypasses the click
  dialog's `accept="image/png, image/jpeg"` filter) is now rejected with a **format-specific** red
  message in `div.border-dashed .text-red-500`: **"You are uploading a file with an unsupported format.
  Please upload a file with a supported format (png, jpeg, jpg)."** + a **Reset** link, and NO preview.
  (Earlier the app showed a generic "Something went wrong".) Covered by `familyImage.test.js`
  TST_BFAM_TC_5 (non-image), **TST_BFAM_TC_7 (.webp — now PASSES**, was a defect guard), and the
  edit-mode equivalents (TC_15, umbrella TC_8). NOTE: a real **OS drag-and-drop** of a disallowed file
  is still not confirmable by automation (browsers block synthetic file drops) — needs a manual check.
- **Broken/invalid external URL → placeholder icon is the ACCEPTED behaviour (product decision
  [2026-07-08]; RTM CF-IMG-004).** A URL that doesn't resolve to a valid image loads no real `<img>`;
  instead the control shows a **generic image-placeholder ICON** (`div.border-dashed svg.lucide-image`)
  with a Remove button and **no inline error text**. (This replaced the older `cover-Placeholder.png`
  `img[alt='placeholder']` behaviour.) On [2026-07-07] this was reported as an OPEN DEFECT expecting a
  clear inline error, but the [2026-07-08] product decision accepted the placeholder as the intended
  behaviour for now (a clearer inline error may still come in a future iteration).
  `familyImage.test.js` **TST_BFAM_TC_4** (create), **TST_BFAM_TC_14** (edit) and
  `umbrellaImage.test.js` **TST_BUMB_TC_7** (edit) assert this accepted behaviour — `realImg === false`
  AND `placeholderIcon === true` — so they **PASS**. They do **not** assert `errorShown`; a red TC_4
  therefore signals a real regression, not the expected state. `page.uploadBrokenImageUrl()` returns
  `{ placeholderIcon, realImg, errorShown }` (the `errorShown` field remains available for when/if the
  app adds the inline error).

The preview `<img>` for a *valid* image carries the untranslated i18n key
`alt="{{ $t('COVER_UPLOAD.PREVIEW') }}"`, so valid-vs-broken is distinguished by `alt` (`≠
'placeholder'` = valid). Image alone does **not** enable Save — Unique Code + Title are still required.

**Persistence (verified 2026-07-02).** Save redirects to the **Families listing** (`/2024/families`).
The saved cover then appears in TWO places: (1) the **Families-list thumbnail**
(`div.flex.items-start:has(h2:text-is('{title}')) img`, alt `{{$t('FAMILIES.ITEM.IMAGE')}}`), and
(2) the family's **detail → Setup tab** (edit mode), reusing the same
`div.border-dashed img.object-cover` preview. `familyImage.test.js` TST_BFAM_TC_8 saves + verifies
both; TC_9 deletes (cleanup). Delete is the listing-card `Delete` button + the shared `deleteModal`
(comment textarea + Confirm).

**Umbrella Products — a SEPARATE entity (verified 2026-07-02, ticket NEMO-24627).** Listing
`/2024/umbrellas`, create `/2024/umbrellas/create`. Same image control as Family, but: create has an
extra required **Umbrella Type** `<select name='umbrella-type'>` (options "Generic Umbrella Product"
= `all`, "Teacher Training Umbrella Product" = `teacher`); code/title use dynamic radix ids so target
by `name` (`input[name='unique-code']`, `input[name='title']`); the submit button reads **"Submit"**
(not "Save"); save redirects to `/2024/umbrellas`. Edit mode = detail → **Setup** tab shows the saved
cover (`div.border-dashed img.object-cover`). **KEY DIFFERENCE: the Umbrella listing does NOT render a
cover thumbnail** (Family's does), so umbrella image persistence is verified in edit mode only.
Automated by module **BUMB** (`umbrella.page.js` + `umbrellaImage.test.js`).

**⚠ Latent selector bug (pre-existing, found 2026-07-02):** the Builder listing `<main>` has **no
explicit `role="main"` attribute**, so a CSS `[role='main']` attribute selector matches **nothing**.
The existing `css.Builder.families.itemLink` / `itemLinkByText` use `[role='main'] …`, so
`families.isFamilyInListing` currently ALWAYS returns `found:false` (harmless-looking in the clone
suite, but wrong). Use `main …` (element selector) instead — the family list-image and umbrella
selectors added for this work do. Follow-up: fix `families.itemLink*` and re-verify the clone suites.

Automated by module **BFAM** (`families.page.js` + `test/Builder/familyImage.test.js`), exec
`familyImageTest.json`. Selectors captured with a throwaway design-time Playwright script because the
Playwright MCP can't start under Node < 18.17 (`URL.canParse`); the app runs headed on system Chrome
(the installed `chromium_headless_shell` build lags Playwright 1.61 — `npx playwright install` for headless).
Upload test assets (valid png, special-char-name png, webp, txt) are repo-tracked under
`testResources/testAssets/Builder/` and referenced with repo-relative paths in the data files
([2026-07-20] — originally machine-local `D:\ebookCreate\…` paths, moved in so the suites run on any machine/CI).

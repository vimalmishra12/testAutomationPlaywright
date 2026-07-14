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

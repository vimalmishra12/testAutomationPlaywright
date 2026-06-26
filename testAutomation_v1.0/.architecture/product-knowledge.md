# Product Knowledge — Cambridge One Apps

> **Living document.** Append, never overwrite. One section per app, keyed by
> its subdomain URL. Mark anything not verified on the live app as `[ASSUMED]`
> and promote to confirmed once observed. Date significant updates with
> `[YYYY-MM-DD]`.

---

## How to use this document

- **Before implementing a test**: read the relevant app section to understand
  page purpose, fields, validation rules, and known quirks.
- **Before validating a Jira ticket**: check here for known error messages and
  existing bug notes so you do not re-test what is already documented.
- **After navigating a new page or learning new product behaviour**: append or
  update the relevant section using the per-app template below. Mark anything
  not confirmed live as `[ASSUMED]`.
- **Selector capture**: selectors discovered via Playwright MCP belong in
  `testResources/selectors/ExperienceApp/C1Selectors.json`, not here.

---

## Per-app template

Copy this block when adding a new app entry:

```
## APP: <Short Name>  (<subdomain>.comprodls.com)

**Ticket prefix:** <PREFIX>-  
**Roles covered:** <list>  
**Purpose:** <one sentence>

### Environment URLs
| Environment | URL |
|---|---|
| Thor (dev) | https://<subdomain>.comprodls.com/... |
| QA | https://... |

### Role: <role name>

#### Feature: <Feature Name>

##### Page: <Page Title>
- **URL (Thor):** /...
- **URL (QA):** /...  `[ASSUMED]` if not confirmed
- **Purpose:** ...
- **Entry path:** ...

**Fields / CSV columns**
| Field | Type | Notes |
|---|---|---|

**Validation rules**
| Rule | EN message | ES message |
|---|---|---|

**Known quirks / bugs**
- ...

**Data notes**
- ...
```

---

## APP: NEMO  (micro-nemo.comprodls.com)

**Ticket prefix:** NEMO-  
**Roles covered:** school-admin  
**Purpose:** School-admin microservice — manages school accounts, classes, and
bulk student account creation for the Cambridge One platform.

*First seeded: [2026-06-10]*

### Environment URLs

| Environment | URL |
|---|---|
| Thor (dev) | https://micro-nemo.comprodls.com/login |
| QA | https://qa.cambridgeone.org/admin |

### Role: school-admin

#### Feature: Bulk new account creation via CSV upload

**Entry path:** Students tab → "Create adult student accounts" /
"Create new accounts for children"

**Acceptance criteria (confirmed on Thor [2026-06-10]):**
- **AC1 — Username:** must start with a lower-case letter; 3–30 chars; allowed chars = lowercase letters, numbers, hyphens, underscores
- **AC2 — Password:** ≥ 8 characters including at least one letter AND at least one number or special character
- **AC3 — CSV size:** up to 200 records per file

**Known error messages (confirmed on Thor [2026-06-10]):**
- Empty username (EN): `Enter Username` (NEMO-24306 — was missing pre-fix)
- Empty username (ES): `Introducir nombre de usuario`
- Username starts with non-lowercase-letter: `This must start with a letter`
- Username < 3 chars OR username starts with uppercase: `This should be at least 3 characters, only letters and numbers` (misleading copy — hyphen/underscore also allowed)
- **Password fails any complexity/length rule:** `See password guidance in the info section at the top` (generic — fires for `< 8 chars` and for `numbers-only`; same wording for both)
- Class is full: `This class is already full` (one per row in the affected CSV upload)
- Blank class key: `Enter a valid class key` (inline, per row)
- **CSV exceeds 200 records (AC3 enforcement)**: appears in a modal dialog (NOT as a per-row inline error). Modal title: `Sorry, your file could not be uploaded`. Body: `The new students you're trying to add take you above the maximum of 200 students you can add at a time. Don't worry, you can copy and paste the additional students into a new file and add them to your next add students request.`

**Product gaps discovered via NEMO-24306 automation [2026-06-10]:**
- **AC2 partial enforcement:** Letters-only passwords (e.g. `TestPassword`) are **silently accepted** — the documented rule "letter AND (number OR special)" is only enforcing the "must contain something other than just letters" side. Numbers-only IS rejected, but letters-only IS NOT. Generic error wording: `See password guidance in the info section at the top`. Recommend a separate Jira ticket. Automation TC for this scenario (TST_NEMO24306_TC_16) is recorded in the TC repository but excluded from the active execution suite until the gap is resolved.
- **Class key is actually REQUIRED, not optional.** Earlier docs marked it optional; confirmed via Thor that a blank `Class key` column triggers an inline error `Enter a valid class key` per row. Correct the field-table at the top of this section accordingly.

**AC3 (CSV ≤ 200 records) — class-capacity vs. CSV-row-limit are independent rules.**
A single CSV upload can spread its rows across multiple classes — the 200-row CSV maximum
applies to the file as a whole and is NOT tied to any single class's seat capacity. To test
AC3 cleanly when no individual class has ≥ 200 seats, split the rows across two classes:

| Test data file | Row range | Class key used | Capacity used |
|---|---|---|---|
| `TST_NEMO24306_TC_9_csv_200_records.csv` | rows 1–100 | `w8k3-kK8U` | 100/100 |
| | rows 101–200 | `3N43-ABqV` | 100/100 |
| `TST_NEMO24306_TC_18_csv_201_records.csv` | rows 1–100 | `w8k3-kK8U` | 100/100 |
| | rows 101–200 | `3N43-ABqV` | 100/100 |
| | row 201 | `3N43-ABqV` | (above CSV max — error expected) |

This separation lets AC3 be validated **without** the per-class "class is already full"
error interfering. Recorded as the standard pattern for AC3-style record-count TCs in NEMO.

**Unconfirmed `[ASSUMED]` error messages — pending live verification:**
- (none currently; AC2 and AC3 fully characterised above)

---

##### Page: Create adult student accounts

- **URL (Thor):** `/admin/admin/org_<school-slug>/username-adult/new_csv` — **confirmed on Thor [2026-06-10]**
- **URL (QA):** `/admin/.../username-adult/new_csv` — confirm QA equivalent
- **Purpose:** Bulk-create adult student accounts by uploading a populated CSV
  file. Each row becomes one new student account.
- **Entry path (confirmed Thor [2026-06-10]):** My school accounts → [School] → Students tab → Manage students → Add new students to classes → Adults → Create adult student accounts → Next

**Controls**

| Control | Behaviour |
|---|---|
| Upload file | Accepts `.csv`; triggers inline validation on submit |
| Get CSV template | Downloads the blank template with correct headers |
| Back | Returns to the Students tab without submitting |

**CSV template headers (confirmed on Thor [2026-06-10] via template download)**

| Column | Notes |
|---|---|
| Student's First name | Required |
| Student's Last name | Required |
| Username | Required; see username validation rules below |
| Password | Required; see password validation rules below |
| Class key | **Required** [confirmed Thor 2026-06-10]; must be a valid, non-full, non-expired class key; blank triggers "Enter a valid class key" inline error per row |

**Validation rules**

| Rule | Detail |
|---|---|
| Username — starting character | Must start with a lower-case letter |
| Username — length | 3–30 characters |
| Username — allowed characters | Lowercase letters, numbers, hyphens (`-`), underscores (`_`) |
| Password — length | ≥ 8 characters |
| Password — complexity | Must include at least one letter AND at least one number or special character |
| CSV size limit | Up to 200 records per upload |
| Error display | Errors shown inline per row; user fixes the CSV and re-uploads |

**Error messages (EN / ES) — confirmed on QA, mark individual items if not verified on Thor**

| Condition | EN message | ES message |
|---|---|---|
| Empty first name | "Enter first name" | "Introducir el nombre" |
| Empty last name | "Enter last name" | "Introducir el apellido" |
| Empty username | "Enter username" | "Introducir nombre de usuario" |
| Username does not start with a letter | "This must start with a letter" | "Debe iniciar con una letra" |
| Username too short / invalid characters | "This should be at least 3 characters, only letters and numbers" | "Debe tener 3 caracteres como mínimo, y solo alfanuméricos" |
| Duplicate username within the uploaded file | "You have already added a student with this username" | "Ya has agregado un alumno con este nombre de usuario" |
| Username already taken on the platform | "...username is not available" | "Lamentablemente ese nombre de usuario no está disponible" |
| Class key does not exist | "This class key is invalid" | "Esta clave de clase no es válida" |
| Class is at capacity | `[ASSUMED]` ES only observed: "Esta clase ya está completa" | "Esta clase ya está completa" |
| Class has expired | `[ASSUMED]` ES only observed: "Esta clase ha caducado" | "Esta clase ha caducado" |

**Known quirks / bugs**

- **Misleading error copy (NEMO-24306):** The validation message for short/invalid
  username reads "only letters and numbers" but the actual rule also permits
  hyphens and underscores. The message is incorrect — do not use it as the spec
  for the allowed-character rule.
- **Bug NEMO-24306:** Empty username showed NO inline error on either the adult
  or children page, in both EN and ES locales. Status: flagged.

**Data notes**

- Requires a school-admin account on Thor to access this feature.
- QA accounts observed in test data: `qaadcharlotteFN`, `QlipothFN`.

---

##### Page: Create new accounts for children

- **URL (Thor):** `/admin/admin/org_<school-slug>/children/new_csv` — **confirmed on Thor [2026-06-10]**
- **URL (QA):** `/children/new_csv` — confirm QA equivalent
- **Purpose:** Bulk-create child (under-18) student accounts by uploading a
  populated CSV file.
- **Entry path:** School admin dashboard → Students tab → Manage students →
  Add new students to classes → Children → Next

**CSV template headers (confirmed on Thor [2026-06-10] via template download)**

| Column | Notes |
|---|---|
| Student's First name | Required — **identical header to adult page** |
| Student's Last name | Required |
| Username | Required; same validation rules as adult page |
| Password | Required; same validation rules as adult page |
| Class key | **Required** [confirmed Thor 2026-06-10]; blank triggers "Enter a valid class key" inline error |

**Validation rules**

- **Confirmed on Thor [2026-06-10]:** Identical username and password rules to the adult page.

**Known quirks / bugs**

- **Bug NEMO-24306:** Empty username showed NO inline error on this page either
  (EN and ES). Same root cause as adult page — see adult page entry above.

**Data notes**

- Child accounts likely have restricted platform features (no self-registration,
  parental consent flow). `[ASSUMED]` — confirm scope with product.

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

---

## APP: Blackboard / LTI  (cup-test.blackboard.com)

**appType:** `Blackboard`  
**Selector namespaces:** `css.Blackboard` (BB UI) + `css.LTI` (shared LTI pages)  
**Purpose:** Blackboard Ultra LMS — automates the LTI 1.3 integration between Blackboard
and the Cambridge One teacher dashboard.

*First seeded: [2026-06-26]*

### Environment URLs

| Environment | URL |
|---|---|
| Thor (shared BB sandbox) | https://cup-test.blackboard.com/ultra/course |
| QA / Rel / Production | TBD — not provisioned yet |

### Credentials & test data (Thor)

- Login user (LTI tests): `BB.login.ltiTeacher` → `thornodeepltiteacher / Compro11`
  - **Always use `ltiTeacher` for IP1 and IP2.** Using a different account causes a timeout at
    `TST_BBIP1_TC_1` because the account lacks LTI entitlements to see the Content Market / LTI tool.
- Course: `testcourse_2` → data key `BB.course.testautocourse`
- LTI product: `"LTI Test (DO NOT CHANGE)"` — a sentinel fixture; do not rename or delete it
  in the Blackboard sandbox.

### LTI launch flow — two integration points

**IP1 — Teacher Dashboard launch:**
1. Login as `thornodeepltiteacher`
2. Navigate to `testcourse_2` → click course card
3. BB course page → click `+` (Add Content) → Content Market
4. Content Market → click `Cambridge One DEV Dashboard` link
5. A **new browser tab** opens carrying the LTI teacher dashboard (`.lti-dashboard-container`)
6. `global.page` is swapped to the new tab; the old tab remains open on `global.__pwContext`

**IP2 — Component launch (runs after IP1):**
- From the LTI teacher dashboard, each component lives under an umbrella product card (`.product`).
  Click the component link (`.prod-clickable`).
- **PE component** (`autoltipe`) → opens in-place at `/teacher/…` URL. Assert: back button, TOC,
  TOC heading, lesson items, activity iframe. Return to dashboard via `page.goto(dashboardUrl)`.
- **Ebook component** (`LTI Ebook`) → navigates directly to `/foc/…` URL (bypasses
  `.product-launch-container`). Assert: ebook guard (`student.book`), toolbar (`.toolbar-wrapper`),
  `/foc/` in URL. Return to dashboard via `page.goto(dashboardUrl)`.

### Page objects (all under `pages/Integrations/`)

| Page object | Responsibility |
|---|---|
| `Blackboard/bbLogin.page.js` | Cookies banner, username, password, sign-in |
| `Blackboard/bbCourse.page.js` | Course listing, click course card |
| `Blackboard/bbCoursePage.page.js` | BB course page → Content Market → LTI tool click; new-tab switch |
| `LTI/ltiTeacherDashboard.page.js` | Dashboard guard, content verify, component click, return-to-dashboard |
| `LTI/ltiComponentPage.page.js` | Component page guard (race: `.product-launch-container` OR `/foc/` URL), ebook state |
| `LTI/ltiPEPage.page.js` | PE state: back button, teacher-mode URL, TOC, TOC items, activity iframe |
| `LTI/ltiPEActivityPage.page.js` | Iframe-based activity interactions (word-order, fill-blank) |

### Test files

| Test file | TC IDs | Notes |
|---|---|---|
| `test/Integrations/Blackboard/bbLogin.test.js` | TST_BBLG_TC_1..4 | Login steps |
| `test/Integrations/Blackboard/bbCourse.test.js` | TST_BBCN_TC_1 | Course navigation |
| `test/Integrations/Blackboard/bbLtiTeacherDashboard.test.js` | TST_BBIP1_TC_1, TST_BBIP1_TC_2 | IP1 dashboard launch + content verify |
| `test/Integrations/LTI/ltiTeacherComponent.test.js` | TST_LTI_IP2_TC_1, TST_LTI_IP2_TC_2 | IP2 component launches (PE + Ebook) |

### Known quirks

- **`TST_BBIP1_TC_1` uses `global.__pwContext.waitForEvent("page")`** inside `bbCoursePage.click_ltiTool()`
  to capture the new tab. This is a deliberate raw `global.__pwContext.*` call — no action-library
  method exists for new-tab detection. `global.page` is mutated on success.
- **`ltiComponentPage.isInitialized()`** uses `Promise.race([locator.waitFor(), page.waitForURL()])` —
  two different signals because Ebook goes straight to `/foc/` while PE stops at `.product-launch-container`.
- **Teacher-mode URL check:** `global.page.url().includes('/teacher/')` — verifies the LTI context
  passed teacher mode correctly (not student mode).
- **Return to dashboard:** `global.page.goto(dashboardUrl)` — the LTI component pages have no
  conventional back button to the Blackboard-embedded dashboard; URL navigation is the only reliable
  return path. Capture `var dashboardUrl = global.page.url()` before clicking a component, because
  the URL changes once inside a component.
- **`TST_BBIP1_TC_2` — `courseDurationText` assertion removed:** the duration value shifts by a
  day between the stored test data and the live dashboard, making it inherently flaky. The remaining
  four checks (course title, school name, product name, action buttons) are unaffected.
- **Teacher dashboard shell vs. content — slow integration load [confirmed 2026-06-26]:** the
  LTI launch lands on `lti-tool-dev.comprodls.com/v1/lti/launch` (an OIDC handshake spinner) and
  then swaps the dashboard SPA in place — **the URL never changes off `/lti/launch`**. The shell
  (`.lti-dashboard-container`, Cambridge header + footer) renders almost immediately, but the
  course content (course title, school, product, action buttons) is fetched over the LTI
  integration and is **slow** — an in-shell spinner `.lti-dashboard-container .loader-wrapper`
  covers a blank grey content area until it arrives. Using `.lti-dashboard-container` alone as the
  ready-guard is a **false positive** (matches the shell while content is still loading), which
  made `TST_BBIP1_TC_2`'s content selectors (`h1.class-name`, `div.space-title`, `h3.bundle-name`)
  intermittently find nothing. Fix: `ltiTeacherDashboard.isInitialized()` waits for the guard to
  appear AND then for `loaderWrapper` to go hidden (reverse `waitForDisplayed`, 120s) before the
  dashboard is considered ready. The content selectors themselves were always correct.

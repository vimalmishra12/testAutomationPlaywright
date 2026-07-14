# Product Knowledge — ExperienceApp (Cambridge One / C1)

> **Living document.** Append, never overwrite. One section per app, keyed by
> its subdomain URL. Mark anything not verified on the live app as `[ASSUMED]`
> and promote to confirmed once observed. Date significant updates with
> `[YYYY-MM-DD]`.
>
> **Scope:** Cambridge One / C1 applications (appType `ExperienceApp`) — NEMO today;
> future C1 apps append their own `## APP:` section here. Usage rules, the per-app
> template, and the app→file map live in the index: `../product-knowledge.md`
> (split per application — ADR-018).

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

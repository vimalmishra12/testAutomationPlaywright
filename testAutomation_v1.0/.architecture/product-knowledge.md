# Product Knowledge — Index

> **Split per application (ADR-018) [2026-07-14].** This file is the INDEX — it holds
> the usage rules, the reading rule, cross-app lessons, and the per-app template.
> The actual product knowledge lives in the per-app files under `product-knowledge/`.
> **Append new observations to the relevant per-app file, never to this index.**
> Each per-app file remains a living document: append, never overwrite; mark
> unverified items `[ASSUMED]`; date significant updates with `[YYYY-MM-DD]`.

---

## App → file map

| Application family | appType | Knowledge file |
|---|---|---|
| Cambridge One / C1 apps (NEMO, …) | `ExperienceApp` | [`product-knowledge/ExperienceApp.md`](product-knowledge/ExperienceApp.md) |
| comproDLS Builder 2.0 | `Builder` | [`product-knowledge/Builder.md`](product-knowledge/Builder.md) |
| LMS integrations (Blackboard + LTI; future: Moodle, …) | `Blackboard` | [`product-knowledge/Integrations.md`](product-knowledge/Integrations.md) |

### Feature-area files (read *in addition to* the app file)

| Feature area | appType | Knowledge file |
|---|---|---|
| **Admin App (school-admin)** — shared across every admin screen | `ExperienceApp` | [`product-knowledge/ExperienceApp/admin-shared.md`](product-knowledge/ExperienceApp/admin-shared.md) |
| ↳ Classes tab — `CLST` | `ExperienceApp` | [`ExperienceApp/admin-classes-tab.md`](product-knowledge/ExperienceApp/admin-classes-tab.md) |
| ↳ Create new classes (bulk form) — `BCCF` / `CCLS` | `ExperienceApp` | [`ExperienceApp/admin-create-classes-form.md`](product-knowledge/ExperienceApp/admin-create-classes-form.md) |
| ↳ Manage grading categories — `GCAT` | `ExperienceApp` | [`ExperienceApp/admin-grading-categories.md`](product-knowledge/ExperienceApp/admin-grading-categories.md) |
| ↳ Manage grading scales — `GSCL` | `ExperienceApp` | [`ExperienceApp/admin-grading-scales.md`](product-knowledge/ExperienceApp/admin-grading-scales.md) |
| ↳ **Students tab** — list, profile, manage account, bulk student ops — `SLST` / `SPRF` / `SBLK` | `ExperienceApp` | [`ExperienceApp/admin-students-tab.md`](product-knowledge/ExperienceApp/admin-students-tab.md) |
| ↳ **Staff tab** — list, profile, admin rights, removal, bulk invitations — `STFL` / `STFP` / `STFB` | `ExperienceApp` | [`ExperienceApp/admin-staff-tab.md`](product-knowledge/ExperienceApp/admin-staff-tab.md) |
| ↳ **Library tab** — list, sort, search, School licence, product materials view — `LIBR` / `UMBP` | `ExperienceApp` | [`ExperienceApp/admin-library-tab.md`](product-knowledge/ExperienceApp/admin-library-tab.md) |
| ↳ Class grade settings — `CGST` | `ExperienceApp` | [`ExperienceApp/admin-class-grade-settings.md`](product-knowledge/ExperienceApp/admin-class-grade-settings.md) |
| ↳ Grading scale / category details pages | `ExperienceApp` | [`ExperienceApp/admin-grading-details-pages.md`](product-knowledge/ExperienceApp/admin-grading-details-pages.md) |
| ↳ Bulk new account creation via CSV — `NEMO24306` | `ExperienceApp` | [`ExperienceApp/admin-bulk-account-csv.md`](product-knowledge/ExperienceApp/admin-bulk-account-csv.md) |

> **`ExperienceApp.md` is an INDEX (ADR-020).** Read it for the app header, environment URLs and the
> file map, then `admin-shared.md`, then the per-screen file(s) your task touches. Do not append
> knowledge to the app file.

## Reading rule

- **Always read this index** at session start (it is small by design).
- **Read the per-app file matching the task's application** (by appType, ticket
  prefix, or the app named in the request).
- **If the task touches an Admin App (school-admin) screen, also read
  `ExperienceApp/admin-shared.md`** — Part A (product behaviour) when designing
  manual test cases, Part A + Part B (automation traps) when authoring or
  debugging automation. It carries what is true of *every* admin screen, so a new
  admin tab does not re-derive it. `[2026-08-21]`
- **If the application is not yet clear, or the task spans apps, read all
  per-app files.** Ambiguity defaults to reading more, never less.

## How to use these documents

- **Before implementing a test**: read the relevant app file to understand
  page purpose, fields, validation rules, and known quirks.
- **Before validating a Jira ticket**: check the relevant app file for known
  error messages and existing bug notes so you do not re-test what is already
  documented.
- **After navigating a new page or learning new product behaviour**: append or
  update the relevant app file using the per-app template below. Mark anything
  not confirmed live as `[ASSUMED]`.
- **Selector capture**: selectors discovered via Playwright MCP belong in the
  app's selector JSON (e.g. `testResources/selectors/ExperienceApp/C1Selectors.json`),
  not here.
- **Adding a new application**: create a new file under `product-knowledge/`
  (named after its appType family), seed it with the template below, and add a
  row to the app → file map above.

## Cross-app lessons

Lessons proven in one app that apply to others (details live in the source app's
file; the always-loaded `ARCHITECTURE-INVARIANTS.md` carries the automation rules):

- **React/Angular identity forms ignore `fill()`'s value** — type credentials with
  `addValue` / `pressSequentially`. Proven on the Builder SSO IdP; applies to any
  framework-rendered form (Invariant 6).
- **Wait for each page transition when the same selector repeats across steps**
  (e.g. `button[type=submit]` on consecutive pages) — otherwise the automation
  re-clicks the previous page's button. Proven on Builder's 3-step SSO.
- **Prefer poll/retry waits over fixed pauses for slow, sync-heavy backends** —
  Builder's collaborative sync and the LTI dashboard's slow content fetch both
  flake under fixed `browser.pause()` values.
- **New-tab launches go through the action library** — `action.switchToNewTab()` /
  `action.closeCurrentTabAndRefocus()` (ADR-016), proven on the LTI deeplink flows.

## Per-app template

Copy this block when adding a new app entry (inside the appropriate per-app file):

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

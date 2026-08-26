# Product Knowledge — ExperienceApp (Cambridge One / C1)

> **This file is an INDEX (ADR-020, [2026-08-21]).** It holds the app header, environment URLs,
> roles, and the map of feature-area files. **The knowledge itself lives in
> [`ExperienceApp/`](ExperienceApp/)** — append there, never here.
>
> **Living document.** Append, never overwrite. Mark anything not verified on the live app as
> `[ASSUMED]` and promote to confirmed once observed. Date significant updates `[YYYY-MM-DD]`.
>
> **Scope:** Cambridge One / C1 applications (appType `ExperienceApp`) — NEMO today; a future C1
> app adds its own `## APP:` block here and its own feature-area files. Usage rules, the per-app
> template and the top-level app→file map live in `../product-knowledge.md` (ADR-018, extended by
> ADR-020).

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

> 📌 **Every Admin App task reads [`ExperienceApp/admin-shared.md`](ExperienceApp/admin-shared.md)
> first.** `[2026-08-21]` It holds what is true of **every** admin screen — navigation, field caps,
> async/persistence behaviour, shared-school constraints and fixtures (**Part A**, for manual test
> design) plus the automation traps: pre-rendered modals, positional ids, CSS-only-disabled
> buttons, Angular typing, optimistic UI, measured timings and the settled visual-testing verdict
> (**Part B**). It is what stops each new admin tab re-deriving the same traps.

### Feature-area files

Read `admin-shared.md`, then the file(s) for the screen your task actually touches.

| Screen | Manual module | Automation module | File |
|---|---|---|---|
| **Shared across all admin screens** | — | — | [`admin-shared.md`](ExperienceApp/admin-shared.md) |
| Bulk new account creation via CSV upload | — (pre-dates the module convention) | `NEMO24306` | [`admin-bulk-account-csv.md`](ExperienceApp/admin-bulk-account-csv.md) |
| Classes tab — list, search, sort, filter, expand, load more | `CLST` | `CLST` | [`admin-classes-tab.md`](ExperienceApp/admin-classes-tab.md) |
| Create new classes (bulk form) | `BCCF` | **`CCLS`** | [`admin-create-classes-form.md`](ExperienceApp/admin-create-classes-form.md) |
| Manage grading categories | `GCAT` | `GCAT` | [`admin-grading-categories.md`](ExperienceApp/admin-grading-categories.md) |
| Manage grading scales | `GSCL` | `GSCL` | [`admin-grading-scales.md`](ExperienceApp/admin-grading-scales.md) |
| **Students tab** — list, search, sort, user guide, load more | `SLST` | `SLST` | [`admin-students-tab.md`](ExperienceApp/admin-students-tab.md) |
| **Student profile** / manage account / individual activation | `SPRF` | `SPRF` | [`admin-students-tab.md`](ExperienceApp/admin-students-tab.md) |
| **Bulk student operations** — add new / add existing / bulk activate | `SBLK` | `SBLK` | [`admin-students-tab.md`](ExperienceApp/admin-students-tab.md) |
| **Staff tab** — list, search, sort, user guide, load more | `STFL` | `STFL` | [`admin-staff-tab.md`](ExperienceApp/admin-staff-tab.md) |
| **Staff profile** / grant & remove admin rights / remove from school | `STFP` | `STFP` | [`admin-staff-tab.md`](ExperienceApp/admin-staff-tab.md) |
| **Bulk staff invitations** — Add new teachers to classes | `STFB` | `STFB` | [`admin-staff-tab.md`](ExperienceApp/admin-staff-tab.md) |
| **Library tab** — list, sort, search, School licence section | `LIBR` | `LIBR` | [`admin-library-tab.md`](ExperienceApp/admin-library-tab.md) |
| **Product materials view** — "See materials", components, Add to a class | `UMBP` | `UMBP` | [`admin-library-tab.md`](ExperienceApp/admin-library-tab.md) |
| Class grade settings | `CGST` | `CGST` | [`admin-class-grade-settings.md`](ExperienceApp/admin-class-grade-settings.md) |
| Grading scale / category **details** pages | — | `GSCL` / `GCAT` | [`admin-grading-details-pages.md`](ExperienceApp/admin-grading-details-pages.md) |
| Class management (label / delete / count) | `CMGT` | — not automated | *(no knowledge file yet)* |
| Clone ("Copy an Existing Class" as a class op) | `CLON` | — not automated | *(no knowledge file yet)* |
| Context class | `CTXC` | — **blocked**, no entry point found | *(no knowledge file yet)* |

> **Not yet documented anywhere:** the non-admin C1 surface — eBook, player, homework, progress,
> notes, drawing tool and the teacher/student roles — which accounts for **16 of 51** C1 page
> objects. When that work starts, it gets its own area shared file and per-screen files under
> `ExperienceApp/`, following the same pattern (ADR-020).

### Migration note [2026-08-21]

Under **ADR-020** the four feature sections that used to live in this file were moved verbatim into
`ExperienceApp/`:

| Was a section here | Now |
|---|---|
| *Feature: Bulk new account creation via CSV upload* | `ExperienceApp/admin-bulk-account-csv.md` |
| *Feature: Classes tab — list, and the Filter panel* | `ExperienceApp/admin-classes-tab.md` |
| *Feature: Class grade settings (CGST, Req #22)* | `ExperienceApp/admin-class-grade-settings.md` |
| *Feature: The "classes using this" lists…* | `ExperienceApp/admin-grading-details-pages.md` |

**Pure move — every moved body was verified byte-identical** (sha256 of each section before and
after). Nothing was edited, summarised or dropped; the only additions are each new file's header.
Git history for that content continues in the new files.

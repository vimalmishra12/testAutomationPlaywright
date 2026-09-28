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
| Production | https://www.cambridgeone.org — Learning Path migration suite only (creates users; user decision 2026-09-22) |

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
| **Generic / shell** — header, footer, language, notifications, My profile, school key, organisations, teacher view, setup wizard | `ASHL` `FOOT` `MYPR` `SADB` `SRQS` `SKEY` `INVI` | same | [`admin-generic-shell.md`](ExperienceApp/admin-generic-shell.md) |
| **Reports tab** — list, empty state, Create report flow | `MRPT` | `MRPT` | [`admin-reports-tab.md`](ExperienceApp/admin-reports-tab.md) |
| Class grade settings | `CGST` | `CGST` | [`admin-class-grade-settings.md`](ExperienceApp/admin-class-grade-settings.md) |
| Grading scale / category **details** pages | — | `GSCL` / `GCAT` | [`admin-grading-details-pages.md`](ExperienceApp/admin-grading-details-pages.md) |
| Class management (label / delete / count) | `CMGT` | — not automated | *(no knowledge file yet)* |
| Clone ("Copy an Existing Class" as a class op) | `CLON` | — not automated | *(no knowledge file yet)* |
| Context class | `CTXC` | — **blocked**, no entry point found | *(no knowledge file yet)* |

### Teacher / learner surface (non-admin) `[2026-09-22]`

Read [`c1-core-shared.md`](ExperienceApp/c1-core-shared.md) first (tours, Mailsac, thor
certificate, run-generated users), then the screen file.

| Screen | Automation module | File |
|---|---|---|
| **Shared across teacher / learner screens** | — | [`c1-core-shared.md`](ExperienceApp/c1-core-shared.md) |
| Signup, e-mail verification, teacher account setup / join a school; homepage, login, reset password, parent/child, invite signup (onboarding register, 2026-09-24) | `SNUP` `TSET` `LAND` `FOOT` `LOGI` `RESE` `PCHD`(proposed) | [`onboarding.md`](ExperienceApp/onboarding.md) |
| Teacher dashboard — create a class, class key, invite; learner accepts (SLE access) | `ENTE` `CREA` `INVI` `DASH` | [`teacher-dashboard-class-page.md`](ExperienceApp/teacher-dashboard-class-page.md) |
| Learning Path player (Practice Extra) — entry, TOC, scorable activity | `PEXT` `DASH` | [`learning-path-player.md`](ExperienceApp/learning-path-player.md) |
| Class Materials — bundle & component launch | `CMAT` | [`foc-class-materials.md`](ExperienceApp/foc-class-materials.md) |
| Resource Bank | `RBNK` | [`foc-resource-bank.md`](ExperienceApp/foc-resource-bank.md) |
| eBook reader — shell, TOC, reader tools (drawing, media, timer, show/hide, keyboard focus) | `EBOO` `DRAW` `PLAY` `TIME` `SHOW` `KBOA` | [`foc-ebook-reader.md`](ExperienceApp/foc-ebook-reader.md) |
| Notes tool | `NOTE` | [`foc-notes.md`](ExperienceApp/foc-notes.md) |
| Front-of-Class (Presentation Plus), assignment creation & book-to-book page mapping | `C1AS` `EMAP` | [`foc-presentation-plus.md`](ExperienceApp/foc-presentation-plus.md) |

> **Documented surfaces:** The non-admin C1 surface covers onboarding, the teacher class dashboard, Learning Path, and the eBook reader (its notes, drawing, timer, media, show/hide and keyboard-focus tools), Resource Bank and the Presentation Plus / assignment-creation journey (`foc-class-materials.md`, `foc-resource-bank.md`, `foc-ebook-reader.md`, `foc-notes.md`, `foc-presentation-plus.md`). Homework and student progress views remain to be documented as their respective authoring begins.

### Migration note [2026-09-23]

Under **ADR-020** `class-materials-ebook-foc.md` was split per screen. Its seven module codes covered
five distinct screens, which is the ADR’s primary trigger for a file of its own:

| Was a section there | Now |
|---|---|
| *1. Teacher Class Materials & Bundles* | `ExperienceApp/foc-class-materials.md` |
| *2. Resource Bank* | `ExperienceApp/foc-resource-bank.md` |
| *3. eBook Reader* + Part B *4. Table of Contents & Modal Transitions* + the a11y suite facts | `ExperienceApp/foc-ebook-reader.md` |
| *Notes tool* + *1. New-Tab URL Commit Race Condition* | `ExperienceApp/foc-notes.md` |
| *4. Front-of-Class* + *5. Creating Assignments* | `ExperienceApp/foc-presentation-plus.md` |
| *2. Multi-Suite Session Teardown*, *3. r4 Create-Only Archive*, login nodes, the suite table | `ExperienceApp/c1-core-shared.md` Part C |

**Pure move.** Every moved body was verified line-for-line: all 172 source lines reconcile, with
one intentional de-indent, and the single dropped line (the Thor URL) already stands verbatim in
this file’s environment table above. Original file sha256
`5241740AC8A859DC21885E2C3547F57B3EFCF5A362EFA9554AB42B9383AF80CB` (13,811 bytes); git history holds it.

> **Not yet documented anywhere:** the rest of the non-admin C1 surface — eBook, player, homework, progress,
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

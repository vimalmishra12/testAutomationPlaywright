# Manual Functional Test Cases — Cambridge One Admin App: Generic (complete — Batches A–C)

**Source:** `AdminApp_Generic.xlsx` — 14 cross-cutting "Generic" scenarios for the school-admin app.
**Modules:** **new** — ASHL (`adminShell.page.js`) · MYPR (`myProfile.page.js`) · SKEY (`changeSchoolKey.page.js`)
· **extended** — INVI · FOOT · SADB · LIBR · SRQS (`schoolRequestSummary.page.js`)
**App:** Cambridge One Admin App (NEMO microservice) — `micro-nemo.comprodls.com` (Thor)
**Pages in scope:** the header and footer chrome · `My school accounts` · `Manage profile` · the school tab strip · School settings
**Generated:** 2026-08-27 | **Total TCs:** 41 (24 Positive · 7 Edge · 10 Negative) — **all 14 source scenarios covered**
> **[2026-09-01] Gap-analysis batch.** Cases added after comparing this register against the other team's `C1_Admin_Console_Detailed_Test_Cases_REVIEWED_Team.xlsx`. Every one closes a scenario their sheet covers and ours did not. All are appended (never renumbered, skill rule 7), all carry `[ASSUMED]` expected results pending a live pass, and the design-time blockers are marked `Blocked` with their unblock route in Comments. See `HANDOFF_adminGapAnalysis_2026-09-01.md`.

> **[2026-09-02] Phase 1 automation exclusions — "extra" cases.** **13** of this register's cases are marked **`[EXTRA — Phase 1 exclusion]`** in their **Remarks**. They are the cases carried as **"Extra in Ours"** in `Admin_Gap_Analysis.xlsx` — coverage we hold that the other team's reviewed sheet (`C1_Admin_Console_Detailed_Test_Cases_REVIEWED_Team.xlsx`) does not. **None of them will be automated in Phase 1**; Phase 1 automation scope is the cases *not* carrying this marker. They stay in the register and are revisited for a later phase. Excluded here: `TST_MYPR_TC_5`, `TST_MYPR_TC_6`, `TST_MYPR_TC_7`, `TST_MYPR_TC_8`, `TST_ASHL_TC_5`, `TST_ASHL_TC_6`, `TST_ASHL_TC_7`, `TST_SADB_TC_2`, `TST_SADB_TC_4`, `TST_ASHL_TC_8`, `TST_ASHL_TC_9`, `TST_ASHL_TC_10`, `TST_SADB_TC_6`.
; work already automated elsewhere is mapped, not re-written
**Execution status (2026-09-01):** **0 of 41 TCs automated.** 36 are Not Run. **5 Blocked** at design time (`TST_SKEY_TC_3`, `TST_LIBR_TC_32`, `TST_SRQS_TC_2`, `TST_LIBR_TC_34`, `TST_SADB_TC_8`).

**Batches:** Batch A — shell chrome (#1, #2, #3, #7, #8, #11) · Batch B — school context (#4, #5, #10, #12) · Batch C — cross-app (#6, #9, #13, #14). **All three complete.**

> **Ordering:** test cases are **grouped by Linked Requirement (scenario)** so every requirement's
> TCs sit together; within each group they run **Positive → Edge → Negative**. (This intentionally
> departs from `manual-test-standard.md`'s global P→E→N ordering, per the established Admin App
> convention.) **S.No.** is sequential in this grouped order; **Test Case IDs** are stable
> identifiers and therefore appear out of numeric sequence within a group.
>
> **Scope (agreed):** Batch A — #1, #2, #3, #7, #8, #11 (shell chrome) · Batch B — #4, #5, #10, #12
> (school context) · Batch C — #6, #9, #13, #14 (cross-app). **All 14 source scenarios are covered;
> nothing is deferred.**
>
> Unverified expected text is marked `[ASSUMED]`; environment-specific values use
> `<PLACEHOLDER>` (see Remarks).

**⚠️ RE-SCOPED 2026-08-27 after an existing-coverage audit — read this first.**
The first draft of this batch **duplicated automation that already exists**. An audit of
`C1TCRepository.json`, the page objects and `C1Selectors.json` found four overlaps, and this
document was cut from 12 cases to 37 as a result. **What already exists is mapped, not
re-written:**

| Scenario | Already covered by | What this batch adds |
|---|---|---|
| #8 — footer link | **`TST_FOOT_TC_1..9`** (`footer.test.js`) — one case per footer page, plus a footer-data case | Only `TST_FOOT_TC_10`, pinning that the **admin** footer renders 7 links and omits Site Feedback, TST_FOOT_TC_11 |
| #3 — notifications | **`TST_INVI_TC_1..6`** (`invitationNotification.page.js`) — the invitation-accept flow through this same bell | `TST_INVI_TC_7` (badge/accessible-name agreement) and `TST_INVI_TC_8` (the general admin panel), TST_INVI_TC_12 |
| #1 — Spanish view | **`TST_LAND_TC_4`** — the language dropdown on the **landing** page; plus `appLangEN.json` / `appLangES.json` | The **admin-app** instance of the control, and admin-app Spanish rendering |
| #2 — My Profile | **`appShell.page.js`** carries `userDrop_down` / `logout_btn` | Nothing yet — not grounded, see below |

**Module codes reuse the existing page objects** wherever the markup is shared, so no re-mapping is
owed (golden rule 3). `FOOT` and `INVI` are **extended from their existing highest number**
(`TST_FOOT_TC_10`, `TST_INVI_TC_7`), never renumbered (golden rule 7). `ASHL` is genuinely new: the
admin header's Help menu (`cHeader-hlp-*`) and language control (`sp-ldd-*`) appear in **no**
existing selector set, and `appShell.page.js` is a different app's shell — its selectors are mostly
`data-tid=*`, not the NEMO admin's `qid=*`.

**⚠️ Grounding was PARTIAL — read this before trusting any `[ASSUMED]` row (2026-08-27).**
In the capture session the app could be **read** but not **driven**: dropdowns did not open, school
cards did not route, and `/myprofile` redirected back to `/admin/admin/dashboard`. Everything marked
"grounded live" below was read from the **pre-rendered DOM** (`admin-shared.md` §A6), which is
reliable for labels, qids, hrefs and accessible names. It does **not** cover anything that only
exists after an interaction. Consequently:

- **RESOLVED later the same day.** The block was a **Playwright-MCP session** problem, not the app:
  `browser_click` was inert, but a JS-dispatched `element.click()` drives the app normally
  (Angular binds ordinary click listeners). Scenarios **#2 and #11 were then captured in full**,
  and the notifications panel with them. Everything below marked *grounded live* is verified.
- **`TST_ASHL_TC_2`** (Spanish rendering) and **`TST_INVI_TC_8`** (notifications panel) are written
  but every expected string in them is `[ASSUMED]`. **No admin-app Spanish copy has been verified.**
- The notifications panel is **not pre-rendered** (built lazily by tippy.js), so unlike every other
  admin dialog its copy could **not** be captured for free.

**Corrections to the first draft (2026-08-27).** Two claims in the withdrawn version were wrong and are
recorded here so they are not repeated:

1. The duplicated qid `cFooter-9` (shared by *FAQs* and *Cambridge One for schools*) was written up
   as an undiscovered defect. **It is already known and worked around** — `C1Selectors.json` reads
   `a[qid="cFooter-9"][aria-label="FAQs"]` and selects *Cambridge One for schools* by class instead.
   The withdrawn negative case has been dropped.
2. `cFooter-4` and `cFooter-8` were called unused. **`cFooter-4` is Site Feedback**
   (`footerSiteFeedback` in the FOOT selector set) — it is simply **absent from the admin footer**.
   That absence is the real finding and is now `TST_FOOT_TC_10`.

**⚠️ Two cases are BLOCKED at design time (2026-08-27)** — written, but they must not be run as things
stand (golden rule 4):

- **`TST_SKEY_TC_3`** (change the school key) is **irreversible** — the product's own warning
  reads *"Changing the school key cannot be undone"*. `FCN-CHZ-PDA` is the primary shared
  school and its key is hardcoded in `schoolAdminAddClassData.json`, so running this would break
  **every** admin suite at once. **Unblock:** a dedicated, disposable school.
- **`TST_LIBR_TC_32`** (MQA/CQA product visibility) is blocked **twice over**: no non-MQA admin
  account exists (`<ADMIN_USER>`'s own home school *is* MQA Sierra School), **and** the product
  team has not defined what technically marks a product as MQA/CQA-restricted. **Unblock:** both.
- **`TST_SRQS_TC_2`** (submit an institution request) raises a **real request into a human
  queue**, not withdrawable from the UI. **Unblock:** confirmation that Thor submissions are safe
  and swept, or an agreed test-only school-name prefix.

Their expected copy is nonetheless **verified** where it could be — `TST_SKEY_TC_2`'s warning
dialog was captured word-for-word from the pre-rendered DOM without ever triggering it (§A6).

**⚠️ Cases that create real data — TWO, both in Batch C.** Everything in Batches A and B is
read-only; these two are not, and that decides suite placement (golden rule: data-creating cases
never share a suite with side-effect-free ones):

- **`TST_SADB_TC_7`** creates a **real class** on a real school. Use the sweepable
  `AutoClass_` prefix (§A7). Class delete is **soft**, so every run leaves a permanent
  soft-deleted row (§A5).
- **`TST_SRQS_TC_2`** raises a **real institution request** outside the test estate — Blocked
  above for that reason.

Everything else is read-only. `TST_ASHL_TC_2` changes the
account's language and must switch it back (step 5). This decides suite placement when automated.

---

## Requirement → Test Case coverage map

| Linked Requirement (scenario) | Mapped TC IDs (P → E → N) |
|---|---|
| #1 — Verify Spanish view | TST_ASHL_TC_1, TST_ASHL_TC_2 |
| #2 — Verify My Profile | TST_MYPR_TC_1, TST_MYPR_TC_2, TST_MYPR_TC_3, TST_MYPR_TC_4, TST_MYPR_TC_5 (E), TST_MYPR_TC_6 (N), TST_MYPR_TC_7 (N), TST_MYPR_TC_8 (N) |
| #3 — Verify notifications | TST_INVI_TC_7, TST_INVI_TC_8, TST_INVI_TC_9 (E), TST_INVI_TC_10 (E), TST_INVI_TC_11 (N) |
| #7 — Verify Help | TST_ASHL_TC_3, TST_ASHL_TC_4 |
| #8 — Verify footer link | TST_FOOT_TC_10 (E) |
| #11 — Verify different tab navigation | TST_ASHL_TC_5, TST_ASHL_TC_6, TST_ASHL_TC_7 (N), TST_SADB_TC_8 (N) |
| #4 — Verify Change school key for normal school | TST_SKEY_TC_1, TST_SKEY_TC_2, TST_SKEY_TC_3, TST_SKEY_TC_4 (N) |
| #5 — Verify non mqa admin should not see cqa/mqa product | TST_LIBR_TC_32 (N), TST_LIBR_TC_34 |
| #10 — Admin part of multiple org | TST_SADB_TC_2, TST_SADB_TC_3 |
| #12 — Verify viewing multiple schools | TST_SADB_TC_4 (E) |
| #6 — Verify launch of Cambridge one for schools and create institution request | TST_SRQS_TC_2, TST_SRQS_TC_3 (N) |
| #9 — Verify various errors in forms and modals | TST_ASHL_TC_10, TST_ASHL_TC_9 (E), TST_ASHL_TC_8 (N) |
| #13 — Verify Admin is able to switch to teacher view | TST_SADB_TC_5, TST_SADB_TC_6 (E) |
| #14 — Verify admin is able to create a new class in teacher view and view that class in Admin classes tab | TST_SADB_TC_7 |

**Existing coverage is not repeated here.** Scenarios #1, #3 and #8 are *also* served by
`TST_LAND_TC_4`, `TST_INVI_TC_1..6` and `TST_FOOT_TC_1..9` respectively — see the re-scope table
above. **Every Batch A scenario now has at least one test case.**

### Scenarios deferred to later batches (from the same source workbook)

| # | Scenario | Batch |
|---|---|---|
| #4 | Verify Change school key for normal school | B |
| #5 | Verify non mqa admin should not see cqa/mqa product | B |
| #10 | Admin part of multiple org | B |
| #12 | Verify viewing multiple schools | B |
| #6 | Verify launch of Cambridge one for schools and create institution request | C |
| #9 | Verify various errors in forms and modals | C |
| #13 | Verify Admin is able to switch to teacher view | C |
| #14 | Verify admin is able to create a new class in teacher view and view that class in Admin classes tab | C |

---

## Product reference — Batch A (captured live 2026-08-27, Thor · `testt1@mailsac.com`)

> Read from the pre-rendered DOM. Labels, qids, hrefs and accessible names are **verified**;
> anything requiring an interaction is **not** — see the grounding warning above.

### Admin header chrome (all pre-rendered)

| Control | qid | id | Already in a selector set? |
|---|---|---|---|
| Home logo | `aHeader-2` | — | no |
| Help dropdown | `cHeader-hlp-2` | `hdr-help-dd` | **no — new** |
| ↳ Help centre | `cHeader-hlp-3` | — | **no — new** |
| ↳ Tutorials | `cHeader-hlp-5` | `dropdownMenuButtonUserTutorials` | **no — new** |
| ↳ Tutorial topics (**5**) | `cHeader-hlp-6` | — | **no — new**; ⚠️ all five share one qid |
| Notifications | `ntf-1` | `tippyDropdownMenuButton` | **yes** — `invitationNotification.notificationBtn` |
| Profile menu | `aHeader-3` | `dropdownMenuLinkHeader` | partly — `appShell.userDrop_down` is `cHeader-2` |
| ↳ My profile | `aHeader-6` | — | no |
| ↳ Log out | `aHeader-7` | — | partly — `appShell.logout_btn` is `cHeader-7` |

**Tutorial topics (verbatim, 5):** `Understanding codes and keys` · `Activating course materials` ·
`Creating a class` · `Adding students to a class` · `Creating assignments`

### Footer — the admin app renders 7 of the 8 known links

| Text | qid | In admin footer? | Notes |
|---|---|---|---|
| Terms of use | `cFooter-1` | yes | |
| Privacy notice | `cFooter-2` | yes | |
| Accessibility | `cFooter-3` | yes | |
| **Site Feedback** | `cFooter-4` | **NO** | in the FOOT selector set; **absent here** — `TST_FOOT_TC_10` |
| Our approach | `cFooter-5` | yes | only link keeping a real external href + `target=_blank` |
| Help | `cFooter-6` | yes | |
| FAQs | `cFooter-9` | yes | shares its qid — FOOT disambiguates by `[aria-label="FAQs"]` |
| Cambridge One for schools | `cFooter-9` | yes | FOOT selects it by `a[class*="insti-btn"]` instead |
| Site language | `cFooter-7` | yes | |

Copyright line: `© Cambridge University Press & Assessment 2026` (year is dynamic).

**Footer hrefs differ by authentication state.** Logged out they are real routes (`/terms`,
`/privacy`, `/accessibility`, `/institution-request`); logged in every internal one collapses to
`javascript:void(0);` and navigation becomes JS-driven. **Asserting `href` on the logged-in footer
is a false green** — assert the resulting URL. `TST_FOOT_TC_1..9` already assert page launches, so
they are unaffected; this matters for anything new written against the footer.

### Site language control

- Trigger `qid="sp-ldd-cntr"`, accessible name `Site language, English`, visible text `English`.
- Exactly **two** options: `English` (`sp-ldd-btn-en`) and `Español` (`sp-ldd-btn-es`).
- The active option carries the CSS class **`selected-item`** — the reliable selection check.
- The control sits in the **header** when logged out and in the **footer** when logged in.
- `appLangES.json` exists but holds only `landing` and `login` sections — **no admin-app or footer
  Spanish strings exist yet**. Captured strings should be added there, matching `appLangEN.json`.

### Notifications — panel captured live 2026-08-27

Bell `ntf-1` / `#tippyDropdownMenuButton`; badge **92**; accessible name
`Notifications (92 unread notifications)` — badge and accessible name mirror each other.

Already targeted by `invitationNotification.page.js` as `notificationBtn`, whose TCs cover the
**invitation-accept** flow — **not** this panel.

⚠️ **The panel is NOT pre-rendered.** Built lazily by tippy.js; nothing exists in the DOM until the
bell is clicked. This is the one admin dialog the free-capture trick (§A6) does **not** work on.

| Part | Selector | Detail |
|---|---|---|
| Panel | `.notification-dropdown` / `.tippy-content` | anchored to the bell |
| Heading | `.notification-heading h2` | `Notifications (92)` — count in `span.readCount`, matches the badge |
| Close | `[qid="ntf-2"]` | ⚠️ **two visible elements share this qid** — `.close` and `.close-dummy` |
| Time group | `p.time-related-title` | `Last Seven days` · `Older` |
| Row | `button.tippy-dropdown-item` | qids `ntf-30`…`ntf-34` — **positional, based at 30** |
| Footer link | `a[qid="ntf-4"]` | `See older notifications`, href `javascript:void(0);` |

**Only 5 rows render against a heading of 92**, and the body does not scroll — the rest are reached
only via *See older notifications*. **There is no mark-as-read control anywhere in the panel.**

**Date format depends on the time group:** relative under *Last Seven days* (`5 days ago`),
absolute under *Older* (`Mon, 17 Aug, 2026` — `Ddd, DD Mmm, YYYY`).

**Notification copy, verbatim:**

| Title | Body |
|---|---|
| `Your Class summary report is ready` | `View your report, available to download in the Reports tab` |
| `Your Aggregated data report is ready` | `View your report, available to download on the Reports page` |
| `Class summary report generation failure` | `Sorry, something went wrong. The Class summary report you requested failed to generate. Details available in the Reports tab` |

⚠️ Note **"Reports tab" vs "Reports page"** across the two ready-notifications — a copy
inconsistency, pinned by `TST_INVI_TC_11`.

**The empty state was NOT seen** (this account has 92) — still `[ASSUMED]`.

### School tab navigation — captured live 2026-08-27

Opening a school card lands on **CLASSES** by default. Five tabs, rendered upper case, each with a
**real href** (unlike the footer):

| Tab | qid | URL suffix | Browser title |
|---|---|---|---|
| CLASSES | `aDetail-1` | `/class` | `Classes | Cambridge One` |
| STUDENTS | `aDetail-2` | `/learner` | `Students | Cambridge One` |
| STAFF | `aDetail-4` | `/staff` | `Staff | Cambridge One` |
| LIBRARY | `aDetail-5` | `/library` | `Library | Cambridge One` |
| REPORTS | `aDetail-6` | `/reports` | `Reports | Cambridge One` |

Full path: `/admin/admin/org_<slug>/<suffix>`. The school heading persists across all five.

**Three traps:**

1. ⚠️ **`aDetail-3` is skipped** — the sequence is 1, 2, 4, 5, 6. Never iterate `1..5`.
2. ⚠️ **STUDENTS routes to `/learner`**, not `/student`. A URL built from the tab label fails.
3. ⚠️ **The active marker is on the parent `<li>`** — `li.nav-item.active > a`. Every tab
   anchor has an identical className whether active or not, so asserting on the link class is a
   guaranteed false green.

**No `aria-current` or `aria-selected` on any tab** — the active state is presentational only.
The same gap exists on the My Profile tabs, and there it is worse: those have no indicator at all.

**Timing measured this session:** Reports ~4.3 s to become active, Classes ~1.2 s. Poll for the
expected qid under `li.nav-item.active` rather than using a fixed pause (§B8).

### My profile / Manage profile — captured live 2026-08-27

**URL `/dashboard/my-profile` — NOT under `/admin/`.** This is the shared Cambridge One
profile page, so changes here affect teachers and students too, and it is reachable from the
header profile menu (`aHeader-3` → `aHeader-6`).

⚠️ **Three names for one page:** menu *My profile* · tab title *My profile | Cambridge One* ·
heading ***Manage profile***. Assert the heading.

Two tabs, `c-mp-tab-1` *Personal info* and `c-mp-tab-2` *Password*. The **URL does not
change between them**, so the Password tab cannot be deep-linked.

| Tab | Field | qid | Gigya name |
|---|---|---|---|
| Personal info | First name | `c-mp-inpt-1` | `profile.firstName` |
| Personal info | Last name | `c-mp-inpt-2` | `profile.lastName` |
| Personal info | Email | `c-mp-inpt-3` | `profile.email` |
| Personal info | Location | `c-mp-inpt-4` | `profile.country` |
| Password | Old password | `c-mp-inpt-5` | `password` |
| Password | New password | `c-mp-inpt-6` | `newPassword` |
| Password | Confirm new password | `c-mp-inpt-7` | `passwordRetype` |

Buttons: **Update** (`c-mp-btn-3` personal / `c-mp-btn-5` password) ·
**Cancel** (`c-mp-btn-4`) · **Back** (`c-mp-btn-1`).

**Three findings:**

1. ⚠️ **No field declares `maxlength`, and none is `required`** — all seven. This is the
   opposite of the rest of the admin app (class name 50, grading scale title 20). Boundary cases
   **cannot be derived from the markup** here and must be found by submitting.
2. ⚠️ **No password rules are displayed.** The equivalent page in the other app has a dedicated
   `newPasswordRules_text` element (`SETT` selector set); this page shows nothing. A user
   gets no guidance until submission fails.
3. ⚠️ **`Location` has three identities** — label *Location*, name `profile.country`,
   id `gigya-textbox-zip`. It behaves as a country. Select by qid; do not trust the id.

**No `c-mp-*` selector exists in `C1Selectors.json` yet** — this page is genuinely new to the
framework. The `SETT` module (36 TCs, `settings.test.js`) is the **same concept in a
different app** (`data-tid` selectors) — model the test design on it, but do not assume the
copy or behaviour matches.

### My school accounts — 7 schools on this account

Card `a.inst-link` `qid="aDashboard-N"` (**positional**, 1-based); the chevron is a separate
`qid="aDashboard1-N"`. **The school key is carried in the card's `aria-label`.**

| # | School | Key |
|---|---|---|
| 1 | 3 July Test School 1 | `FCN-CHZ-PDA` |
| 2 | 3 July Test School 1 | `ZPB-TWP-AEQ` |
| 3 | 3 July Test School 2 | `KNF-XRD-QVE` |
| 4 | MQA Sierra School | `MQA-ABC-DEF` |
| 5 | Perf Test School 3 | `HQC-ZWM-ZVF` |
| 6 | Perf Test School 4 | `ACJ-DXL-JKR` |
| 7 | Perf Test School 5 | `GYB-JMU-KYA` |

Cards 1 and 2 **share a display name** — confirming `admin-shared.md`'s rule to select by key, never
by name or position. Each card shows its key in a bordered field with a **`Copy`** button. The page
heading is `My school accounts` and card indices are zero-padded (`01`…`07`).

> **This extends `admin-shared.md` §0**, which documents four schools. Three keys here are
> undocumented: `KNF-XRD-QVE`, `HQC-ZWM-ZVF`, `GYB-JMU-KYA`. Directly useful to Batch B.

### Administrator / Teacher role toggle (captured free — Batch C, #13)

```html
<input id="teacher-admin-toggle" qid="teacher-admin-toggle" type="checkbox" aria-hidden="true" tabindex="-1">
<div tabindex="0" class="can-toggle__switch"
     aria-label="Administrator/Teacher toggle: Administrator currently active, activate to view Teacher dashboard">
```

The **`aria-label` states both the current role and the action**, making it a clean assertion target.
The `<input>` is `aria-hidden`/`tabindex=-1`; the focusable control is the inner
`div.can-toggle__switch`. Rendered as a pill at the top-right of the content area.

### Login page and deep linking

- The real login form is `#gigya-login-form`. The Gigya screen-set injects **~15 hidden forms**
  carrying duplicate `username`, `password`, `email` and `profile.*` inputs, so an unscoped
  `input[name=password]` matches several — **scope every login selector to `#gigya-login-form`.**
  Same trap `admin-shared.md` §B2 records for Manage learner profile.
- `/myprofile` **redirected to `/admin/admin/dashboard`**, consistent with `admin-shared.md` §A1 —
  admin routes are not reachable by deep link; context must be set by clicking through.
- Page `<title>` is **not stable across load paths**: `My school accounts | Cambridge One` after
  in-app navigation, `Administrator | Cambridge One` on a fresh `goto`.

---

## Product reference — Batch B (captured live 2026-08-27, Thor · `testt1@mailsac.com`)

### School settings menu — three items, not two

Reached from **School settings** (`adEdit-1`) on the Classes tab:

| Item | qid |
|---|---|
| Change school key | `adEdit-2` |
| Manage grading categories | `adEdit-7` |
| Manage grading scales | `adEdit-8` |

> ⚠️ **Corrects `admin-shared.md` §A1**, which lists only the two grading entries.
> **Change school key is a third, previously undocumented item.**

The qid numbering is **not contiguous** (2, 7, 8) — `adEdit-3` and `adEdit-4` are the
confirmation-dialog buttons, not menu items. Never iterate the family.

### Change school key — warning dialog (captured WITHOUT triggering it)

Read from the pre-rendered DOM per §A6 — the only safe way to verify this copy on a shared school:

> ⚠ **CAREFUL!**
> **Changing the school key cannot be undone**
> This action is recommended only if your current school key has been compromised

Controls: **Continue** (`adEdit-3`) · **Cancel** (`adEdit-4`). Warning-triangle icon
(`i.fa-exclamation-triangle`) above the heading.

**"Cannot be undone" is the operative fact.** `FCN-CHZ-PDA` is the primary shared school and its
key is hardcoded as `schoolKey` in `schoolAdminAddClassData.json` — changing it breaks every
admin suite simultaneously. `TST_SKEY_TC_3` is **Blocked** for this reason.

School key format, consistent across all 7 schools: **three uppercase triplets**, `XXX-XXX-XXX`.
On the dashboard the key is **display text** (`span.school-code`) with a **Copy** button beside
it — **not an editable field**. The only input on the dashboard is the role toggle.

### Library — MQA / CQA product visibility

Observed on **3 July Test School 1** (`FCN-CHZ-PDA`), a **non-MQA** school, heading
`Library (971)`:

| Pattern in title | Count | Examples |
|---|---|---|
| Contains `CQA` | **2** | `CQA - 7 Jan 2021 - Test Umbrella product` · `Teacher Training - CQA Test Product` |
| Begins `NON MQA` | 3 | `NON MQA UB for eBook 2` · `NON MQA Umbrella for Free Trial` |
| MQA-only (by title) | 0 | — |

> **This is an observation, not a defect claim.** A title containing *CQA* does not prove the
> product is CQA-**restricted** — restriction is a licensing property, not a naming convention.
> It is recorded because it is the concrete thing to check once the product team defines what
> marks a product as MQA/CQA-gated. If those two products *are* restricted, this is a live leak;
> if they are merely named that way, `TST_LIBR_TC_32` needs different test data.

Product rows are `aLibrary-*` (974 elements for 971 products — the family includes non-row
controls, so do not equate the two).

### Organisations and slugs

The org slug is **not derivable** from the school name or key:

| School | Key | Org slug |
|---|---|---|
| 3 July Test School 1 | `FCN-CHZ-PDA` | `org_perf_testschool_1` |

Capture each slug; never construct it. School context must be set by **clicking the card** — deep
links return `/dashboard/error` even when authenticated (§A1).

**Open question worth testing:** the class Filter and Search persist **server-side per user account**
(§A4). Whether that persistence is scoped **per school** or leaks **across organisations** is unknown,
and a leak would be a real defect for a multi-org admin. Noted on `TST_SADB_TC_3`.

---

---

## Product reference — Batch C (captured live 2026-08-27, Thor · `testt1@mailsac.com`)

### Teacher view — reached by the role toggle

| | Administrator view | Teacher view |
|---|---|---|
| URL | `/admin/admin/dashboard` | `/dashboard/teacher/dashboard` |
| Title | `My school accounts | Cambridge One` | `Teacher dashboard | Cambridge One` |
| Heading | `My school accounts` | `Hi <FIRST_NAME>!` |
| Input `checked` | `false` | `true` |
| Switch class | `.can-toggle__switch` | `.can-toggle-switch` |

> ⚠️ **The switch element is named differently in each view** — double underscore in admin, single
> hyphen in teacher. A selector written for one **silently fails** in the other, which breaks the
> round trip precisely. Use `#teacher-admin-toggle` (stable in both) and read its `checked`
> state. The focusable control is the inner `[tabindex="0"]` div; the input is `aria-hidden`.

The `aria-label` states both current role and action, and flips correctly:
*"Administrator/Teacher toggle: Administrator currently active, activate to view Teacher dashboard"*
↔ *"…Teacher currently active, activate to view Administrator dashboard"*.

The toggle also appears on **inner admin tabs**, not only the dashboard.

### The two views show DIFFERENT school estates

| View | Count | Contains |
|---|---|---|
| Administrator | 7 | schools the user **administers** |
| Teacher | 8 groups | schools the user **teaches at** — incl. `ABERYSTWYTH COLLEGE : THOR` and `LTI INTEGRATIONS TEST2`, **absent** from the admin list |

> ⚠️ Do not assume the toggle shows the same estate on both sides. Also, the teacher view groups by
> **display name**, so the two distinct schools both called *3 July Test School 1* (`FCN-CHZ-PDA` / `ZPB-TWP-AEQ`) **collapse into one group** there. Never match schools
> across the two views by name.

⚠️ **All 7 `Create class` buttons share qid `tDashboard-ncls-btn-1`** — one per school group.
The qid cannot tell them apart, so the button must be found **through its school-group heading** or a
class lands on the wrong school. This is the crux of `TST_SADB_TC_7`.

### Dialog inventory — what is pre-rendered on each admin tab

| Tab | `.modal-content` present | All hidden on load? |
|---|---|---|
| Classes | 5 | ✅ |
| Students | 4 | ✅ |
| Staff | 1 | ✅ |

**The change-school-key dialog is present on EVERY tab** — it ships with the shared page chrome, so
it inflates every tab's count by one and will match an unscoped modal selector anywhere. Scope modal
selectors with `:has(...)` to the specific dialog.

**Verbatim copy captured without triggering anything (§A6):**

| Dialog | Copy |
|---|---|
| Class delete | `WARNING!` · *There might be students, teachers and course materials in the selected classes* · *Are you sure you want to delete?* · `No, cancel` |
| Class delete — async | *This will take a few minutes* · *Deleted classes may show on dashboards for a few minutes before they are removed* |
| Class 50-cap | *You can only delete 50 classes at one time* · *Please uncheck some classes to continue* |
| Student removal | *I confirm that I want to remove students from my school account* · `Cancel` · `Request to remove` |
| Student 50-cap | *You can only remove 50 students at one time* · *Please uncheck some students to continue* |
| Student removal — async | *Removing students may take some time* |
| Change school key | `CAREFUL!` · *Changing the school key cannot be undone* |

The 50-cap warnings share a **two-line pattern** differing only in the verb — *delete* for classes,
*remove* for students. The limit (50) and sentence shape are the consistent parts; the verb is not.

### Institution request — already covered end to end, except submission

| Step | Existing module |
|---|---|
| Launch from footer | `TST_FOOT_TC_7` |
| Entry CTA | `TST_DINS_TC_1` |
| 1 Intro · 2 Type · 3 Teachers · 4 Name · 5 Location · 6 Address · 7 Contact | `SUSA` · `SCTY` · `NTCH` · `SNAM` · `SLOC` · `SADR` · `SCON` |
| 8 Summary loads | `TST_SRQS_TC_1` |
| **Submission + confirmation** | **nothing — `TST_SRQS_TC_2` fills this gap** |

Every existing step case asserts only the **enabling** direction ("select X to *enable* Next"); the
disabled half is nowhere asserted, which is `TST_SRQS_TC_3`. Check whether Next is natively
disabled or **CSS-only** disabled (§B4) before writing that assertion.

---
## Section — Test Cases (grouped by Linked Requirement)

### Requirement #1 — Verify Spanish view

| Field | Value |
|---|---|
| **S.No.** | 1 |
| **Test Case ID** | TST_ASHL_TC_1 |
| **Title** | Verify the language control offers English and Español with the active language marked as selected |
| **Linked Requirement** | #1 — Verify Spanish view |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as school-admin <ADMIN_USER> on Thor; "My school accounts" (/admin/admin/dashboard) displayed. |
| **Test Steps** | 1. Click the site-language control (labelled "English") in the footer.<br>2. Observe the options. |
| **Test Data** | — |
| **Expected Result** | Exactly TWO options are offered, in this order: "English", then "Español".<br>The active language ("English") is visually marked as the selected option, and the control's accessible name reads "Site language, English". |
| **Remarks** | Grounded live 2026-08-27 from the pre-rendered DOM. Control qid "sp-ldd-cntr"; options "sp-ldd-btn-en" and "sp-ldd-btn-es". Selection is marked by the CSS class "selected-item" on the active option — that class, not styling, is the reliable check. The control appears in the HEADER when logged out and the FOOTER when logged in. DISTINCT FROM TST_LAND_TC_4, which covers the same control on the LANDING page — this case is the admin-app instance. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |

---

| Field | Value |
|---|---|
| **S.No.** | 2 |
| **Test Case ID** | TST_ASHL_TC_2 |
| **Title** | Verify the admin interface renders in Spanish when Español is selected |
| **Linked Requirement** | #1 — Verify Spanish view |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as school-admin <ADMIN_USER> on Thor; "My school accounts" (/admin/admin/dashboard) displayed. |
| **Test Steps** | 1. Click the site-language control.<br>2. Select "Español".<br>3. Observe the "My school accounts" heading, the footer links and the Administrator/Teacher toggle.<br>4. Reload the page.<br>5. Switch back to "English". |
| **Test Data** | Expected Spanish strings: to be added to appLangES.json once captured (see Remarks). |
| **Expected Result** | [ASSUMED] After step 2 the admin interface re-renders in Spanish: the "My school accounts" heading, the footer links and the role toggle all show Spanish copy, and the language control now reads "Español" with "Español" marked selected.<br>[ASSUMED] After step 4 the Spanish selection PERSISTS across the reload.<br>After step 5 the interface returns to English. |
| **Remarks** | ⚠️ NOT GROUNDED — no admin-app Spanish copy has been verified. GENUINE GAP: appLangES.json exists but contains only "landing" and "login" sections — it has NO admin-app or footer entries, so the strings this case needs do not exist yet anywhere. When captured they should be added to appLangES.json under a new admin section, matching the existing appLangEN.json pattern. Whether the choice persists per-account server-side (as the class Filter and Search do, admin-shared.md §A4) or only for the session is specifically unknown. CHANGES ACCOUNT STATE: switches the language and must switch it back (step 5). |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |

---

### Requirement #2 — Verify My Profile

| Field | Value |
|---|---|
| **S.No.** | 3 |
| **Test Case ID** | TST_MYPR_TC_1 |
| **Title** | Verify the Manage profile page opens with both tabs when My profile is selected from the header menu |
| **Linked Requirement** | #2 — Verify My Profile |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as school-admin <ADMIN_USER> on Thor; "My school accounts" (/admin/admin/dashboard) displayed. |
| **Test Steps** | 1. Click the account name ("Test") in the page header.<br>2. Observe the items in the dropdown.<br>3. Click "My profile". |
| **Test Data** | — |
| **Expected Result** | After step 2 the dropdown shows exactly three items: the account name, "My profile", "Log out".<br>After step 3 the browser navigates to /dashboard/my-profile, the browser tab reads "My profile \| Cambridge One", and the page heading reads "Manage profile".<br>Two tabs are shown: "Personal info" (active by default) and "Password".<br>A "Back" control is present. |
| **Remarks** | GROUNDED LIVE 2026-08-27 (user-driven navigation, agent DOM read). ⚠️ THREE DIFFERENT NAMES for one page: the menu says "My profile", the browser tab says "My profile \| Cambridge One", the heading says "Manage profile". Assert the heading, not the menu label. Selectors: menu trigger qid "aHeader-3" (id "dropdownMenuLinkHeader"); item "aHeader-6"; tabs "c-mp-tab-1" / "c-mp-tab-2"; Back "c-mp-btn-1". NOTE the URL is /dashboard/my-profile — NOT under /admin/. This is the shared Cambridge One profile page, so a change here affects teachers and students too. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |

---

| Field | Value |
|---|---|
| **S.No.** | 4 |
| **Test Case ID** | TST_MYPR_TC_2 |
| **Title** | Verify the Personal info tab shows the four account fields pre-filled with the current values |
| **Linked Requirement** | #2 — Verify My Profile |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as school-admin <ADMIN_USER> on Thor; "My school accounts" (/admin/admin/dashboard) displayed. Manage profile open on the "Personal info" tab. |
| **Test Steps** | 1. Observe the fields on the Personal info tab and their values.<br>2. Observe the buttons. |
| **Test Data** | — |
| **Expected Result** | Four editable text fields are shown, labelled and pre-filled from the account:<br>1. "First name"  2. "Last name"  3. "Email"  4. "Location"<br>Two controls are present: "Update" and "Cancel".<br>Observed 2026-08-27 for <ADMIN_USER>: First name "Test", Last name "T1", Email "testt1@mailsac.com", Location "India". |
| **Remarks** | GROUNDED LIVE 2026-08-27. Field qids "c-mp-inpt-1".."c-mp-inpt-4"; Update "c-mp-btn-3"; Cancel "c-mp-btn-4". Underlying Gigya names: profile.firstName / profile.lastName / profile.email / profile.country. ⚠️ The "Location" field has THREE identities — label "Location", name "profile.country", HTML id "gigya-textbox-zip" (zip, i.e. postcode). It behaves as a country ("India"). Select it by qid, and do not infer its meaning from the id. VALUES ARE ACCOUNT-SPECIFIC — use <ADMIN_USER> placeholders, never the literals above (admin-shared.md §A5). |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |

---

| Field | Value |
|---|---|
| **S.No.** | 5 |
| **Test Case ID** | TST_MYPR_TC_3 |
| **Title** | Verify the Password tab shows the three password fields when it is selected |
| **Linked Requirement** | #2 — Verify My Profile |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as school-admin <ADMIN_USER> on Thor; "My school accounts" (/admin/admin/dashboard) displayed. Manage profile open. |
| **Test Steps** | 1. Click the "Password" tab.<br>2. Observe the fields and buttons. |
| **Test Data** | — |
| **Expected Result** | Three password fields are shown, in this order:<br>1. "Old password"  2. "New password"  3. "Confirm new password"<br>Two controls are present: "Update" and "Cancel".<br>All three inputs mask their content (type=password). |
| **Remarks** | GROUNDED LIVE 2026-08-27. Field qids "c-mp-inpt-5".."c-mp-inpt-7"; Update "c-mp-btn-5". Gigya names: password / newPassword / passwordRetype. ⚠️ The URL does NOT change between tabs — both are /dashboard/my-profile. The Password tab therefore CANNOT be deep-linked, and the active tab cannot be asserted from the URL. Combined with the missing aria-selected (TST_MYPR_TC_8) there is currently NO reliable attribute identifying the active tab — automation must assert on the visible fields instead. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |

---

| Field | Value |
|---|---|
| **S.No.** | 6 |
| **Test Case ID** | TST_MYPR_TC_4 |
| **Title** | Verify Back returns to the previous page without saving when it is clicked |
| **Linked Requirement** | #2 — Verify My Profile |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | Logged in as school-admin <ADMIN_USER> on Thor; "My school accounts" (/admin/admin/dashboard) displayed. Manage profile open on the "Personal info" tab. |
| **Test Steps** | 1. Change the "First name" field to a different value.<br>2. Do NOT click Update.<br>3. Click "Back".<br>4. Return to Manage profile and inspect "First name". |
| **Test Data** | First name: "<ORIGINAL_FIRST_NAME>" changed to "AutoProfile_Temp" |
| **Expected Result** | [ASSUMED] After step 3 the previous page is shown and no change is saved.<br>[ASSUMED] After step 4 "First name" still holds its original value. |
| **Remarks** | ⚠️ EXPECTED RESULT NOT VERIFIED — the edit-then-leave path was not exercised. Specifically UNKNOWN: whether an unsaved-changes confirmation appears. admin-shared.md §A6 records a pre-rendered "Save changes?" dialog on the OTHER app's Manage learner profile, and the create-classes form auto-saves a draft (§A4) — so BOTH "silently discards" and "prompts" are plausible here. Do not assume; capture what happens. Back qid "c-mp-btn-1". CHANGES ACCOUNT STATE only if Update is pressed, which this case avoids. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |

---

| Field | Value |
|---|---|
| **S.No.** | 7 |
| **Test Case ID** | TST_MYPR_TC_5 |
| **Title** | Verify an over-long first name is handled correctly when no client-side limit exists |
| **Linked Requirement** | #2 — Verify My Profile |
| **Type** | Edge |
| **Priority** | Medium |
| **Preconditions** | Logged in as school-admin <ADMIN_USER> on Thor; "My school accounts" (/admin/admin/dashboard) displayed. Manage profile open on the "Personal info" tab. USE A DISPOSABLE ACCOUNT. |
| **Test Steps** | 1. Clear "First name".<br>2. Type a 300-character value.<br>3. Observe whether the field truncates the input as it is typed.<br>4. Click "Update". |
| **Test Data** | First name: 300 repetitions of "a" |
| **Expected Result** | After step 3 the field accepts all 300 characters — there is NO client-side truncation.<br>[ASSUMED] After step 4 the server rejects the value with a validation message, or accepts and truncates it. Capture which, and the exact message. |
| **Remarks** | **[EXTRA — Phase 1 exclusion]** Not present in the other team's reviewed sheet (`Admin_Gap_Analysis.xlsx`, status "Extra in Ours"). **This case will NOT be automated in Phase 1** — exclude it from the Phase 1 automation scope; revisit for a later phase. GROUNDED PARTIALLY 2026-08-27: the ABSENCE of a limit is verified — ALL SEVEN fields across both tabs have maxlength=null and none is marked required. What the SERVER does is [ASSUMED]. This is a deliberate departure from the rest of the admin app, where limits are declared and enforced client-side (class name 50, grading scale title 20 — admin-shared.md §A3). Because nothing is declared here, boundary cases CANNOT be derived from the markup and must be found by submitting. ⚠️ DO NOT RUN ON <ADMIN_USER> — that account is the login for the whole admin suite. Blocked until a disposable account exists. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |

---

| Field | Value |
|---|---|
| **S.No.** | 8 |
| **Test Case ID** | TST_MYPR_TC_6 |
| **Title** | Verify an error is shown when the new password and its confirmation do not match |
| **Linked Requirement** | #2 — Verify My Profile |
| **Type** | Negative |
| **Priority** | High |
| **Preconditions** | Logged in as school-admin <ADMIN_USER> on Thor; "My school accounts" (/admin/admin/dashboard) displayed. Manage profile open on the "Password" tab. USE A DISPOSABLE ACCOUNT. |
| **Test Steps** | 1. Enter the correct current password in "Old password".<br>2. Enter a valid new password in "New password".<br>3. Enter a DIFFERENT value in "Confirm new password".<br>4. Click "Update". |
| **Test Data** | Old: <VALID_PASSWORD> · New: "Compro@2026" · Confirm: "Compro@2027" |
| **Expected Result** | [ASSUMED] The password is NOT changed and a mismatch validation message is shown against the confirmation field. |
| **Remarks** | **[EXTRA — Phase 1 exclusion]** Not present in the other team's reviewed sheet (`Admin_Gap_Analysis.xlsx`, status "Extra in Ours"). **This case will NOT be automated in Phase 1** — exclude it from the Phase 1 automation scope; revisit for a later phase. ⚠️ ERROR COPY NOT CAPTURED — nothing was submitted, by agreement, because <ADMIN_USER> is the admin suite's login account. The message text must be captured on a disposable account. For reference the equivalent page in the other app exposes a dedicated error element ("confirmPasswordError_text" in the SETT selector set), so a field-level message is expected here too — but that is the OTHER app and must not be assumed identical. DESTRUCTIVE IF IT SUCCEEDS: a mistyped variant of this case would change a real password. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |

---

| Field | Value |
|---|---|
| **S.No.** | 9 |
| **Test Case ID** | TST_MYPR_TC_7 |
| **Title** | Verify an error is shown when the old password is incorrect |
| **Linked Requirement** | #2 — Verify My Profile |
| **Type** | Negative |
| **Priority** | High |
| **Preconditions** | Logged in as school-admin <ADMIN_USER> on Thor; "My school accounts" (/admin/admin/dashboard) displayed. Manage profile open on the "Password" tab. USE A DISPOSABLE ACCOUNT. |
| **Test Steps** | 1. Enter an INCORRECT value in "Old password".<br>2. Enter a valid new password in both "New password" and "Confirm new password".<br>3. Click "Update". |
| **Test Data** | Old: "WrongPassword123" · New / Confirm: "Compro@2026" |
| **Expected Result** | [ASSUMED] The password is NOT changed and an error identifies the old password as incorrect. |
| **Remarks** | **[EXTRA — Phase 1 exclusion]** Not present in the other team's reviewed sheet (`Admin_Gap_Analysis.xlsx`, status "Extra in Ours"). **This case will NOT be automated in Phase 1** — exclude it from the Phase 1 automation scope; revisit for a later phase. ⚠️ ERROR COPY NOT CAPTURED — see TST_MYPR_TC_6. The SETT selector set has a matching "currentPasswordError_text" element in the other app. Worth checking whether repeated failures lock the account, which would affect suite design. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |

---

| Field | Value |
|---|---|
| **S.No.** | 10 |
| **Test Case ID** | TST_MYPR_TC_8 |
| **Title** | Verify the active profile tab is identifiable to assistive technology |
| **Linked Requirement** | #2 — Verify My Profile |
| **Type** | Negative |
| **Priority** | Medium |
| **Preconditions** | Logged in as school-admin <ADMIN_USER> on Thor; "My school accounts" (/admin/admin/dashboard) displayed. Manage profile open. |
| **Test Steps** | 1. Inspect the "Personal info" and "Password" tab controls.<br>2. Check for a tab role and a selected-state attribute.<br>3. Switch tabs and re-check. |
| **Test Data** | — |
| **Expected Result** | Each tab exposes an appropriate role and a selected state, so assistive technology can announce which tab is active.<br>ACTUAL (2026-08-27): this FAILS. Both are plain <a> elements with NO role="tab" and NO aria-selected. Nothing in the markup or the URL identifies the active tab. |
| **Remarks** | **[EXTRA — Phase 1 exclusion]** Not present in the other team's reviewed sheet (`Admin_Gap_Analysis.xlsx`, status "Extra in Ours"). **This case will NOT be automated in Phase 1** — exclude it from the Phase 1 automation scope; revisit for a later phase. GROUNDED LIVE 2026-08-27. Raised as a case because it is both an accessibility gap and an automation blocker: with no aria-selected AND no URL change between tabs (TST_MYPR_TC_3), there is no attribute to assert the active tab on — automation must fall back to checking which fields are visible. Confirm with the product team whether this should be raised as a defect. Tab qids "c-mp-tab-1" (Personal info) and "c-mp-tab-2" (Password). |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |

---

### Requirement #3 — Verify notifications

| Field | Value |
|---|---|
| **S.No.** | 11 |
| **Test Case ID** | TST_INVI_TC_7 |
| **Title** | Verify the notifications bell badge and its accessible name report the same unread count |
| **Linked Requirement** | #3 — Verify notifications |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as school-admin <ADMIN_USER> on Thor; "My school accounts" (/admin/admin/dashboard) displayed. |
| **Test Steps** | 1. Observe the notifications bell in the page header.<br>2. Read its badge and its accessible name. |
| **Test Data** | — |
| **Expected Result** | The bell shows a numeric badge with the unread count, and its accessible name mirrors that same count in the form "Notifications (<N> unread notifications)".<br>Observed 2026-08-27: badge "92", accessible name "Notifications (92 unread notifications)". |
| **Remarks** | Grounded live 2026-08-27. EXTENDS the existing INVI module — invitationNotification.page.js already targets this same control as "notificationBtn" (#tippyDropdownMenuButton) and TST_INVI_TC_1 clicks it. What INVI does NOT cover is the badge/accessible-name agreement, which is this case. Bell qid "ntf-1"; wrapper ".notification-dropdown". The COUNT is volatile — assert that badge and accessible name AGREE, never a literal 92 (admin-shared.md §A5: never assert an absolute count on a shared account). |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |

---

| Field | Value |
|---|---|
| **S.No.** | 12 |
| **Test Case ID** | TST_INVI_TC_8 |
| **Title** | Verify the notifications panel opens with a heading, time-grouped rows and a close control |
| **Linked Requirement** | #3 — Verify notifications |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as school-admin <ADMIN_USER> on Thor; "My school accounts" (/admin/admin/dashboard) displayed. |
| **Test Steps** | 1. Click the notifications bell.<br>2. Observe the panel heading.<br>3. Observe the time-group headings and the notification rows beneath each.<br>4. Observe the control at the foot of the panel.<br>5. Click the "×" close control. |
| **Test Data** | — |
| **Expected Result** | A panel opens anchored to the bell:<br>1. Heading reads "Notifications (<N>)", where <N> matches the bell badge.<br>2. Rows are grouped under time headings — "Last Seven days" and "Older".<br>3. Each row shows a title, a body line and a date.<br>4. A "See older notifications" link sits at the foot of the panel.<br>5. A "×" control labelled "Close" dismisses the panel.<br>Observed 2026-08-27: heading "Notifications (92)" matching the badge; both time groups present. |
| **Remarks** | GROUNDED LIVE 2026-08-27 — the panel was opened manually and read in full, resolving the earlier [ASSUMED] version of this case. GENUINE GAP: TST_INVI_TC_1..6 cover the INVITATION-ACCEPT flow reached through this bell (invitationNotify → selectCheckbox → acceptBtn → goToDashboard); they do NOT cover this panel. Selectors: panel ".notification-dropdown"; heading ".notification-heading" h2 with span.readCount; time groups "p.time-related-title"; rows "button.tippy-dropdown-item"; footer link qid "ntf-4". ⚠️ The close "×" carries qid "ntf-2" on TWO visible elements (".close" and ".close-dummy") — address it by class, not qid. Same trap shape as cFooter-9. NOT pre-rendered — built lazily by tippy.js, so it must actually be opened (admin-shared.md §A6 does not apply here). The EMPTY state was not seen — this account has 92 notifications. [ASSUMED] and still open. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |

---

| Field | Value |
|---|---|
| **S.No.** | 13 |
| **Test Case ID** | TST_INVI_TC_9 |
| **Title** | Verify the panel renders only the five most recent notifications when many are unread |
| **Linked Requirement** | #3 — Verify notifications |
| **Type** | Edge |
| **Priority** | Medium |
| **Preconditions** | Logged in as school-admin <ADMIN_USER> on Thor; "My school accounts" (/admin/admin/dashboard) displayed. The account has many unread notifications (92 at capture). |
| **Test Steps** | 1. Click the notifications bell.<br>2. Count the notification rows rendered in the panel.<br>3. Compare that count with the number in the panel heading.<br>4. Observe the "See older notifications" link. |
| **Test Data** | — |
| **Expected Result** | The panel renders exactly FIVE notification rows, even though the heading reports 92.<br>The panel does NOT scroll to reveal more — the remainder are reached only through "See older notifications". |
| **Remarks** | Grounded live 2026-08-27: 5 rows rendered against a heading of "Notifications (92)", and the panel body was not scrollable (scrollHeight === clientHeight). ⚠️ The row qids are POSITIONAL and start at 30 — "ntf-30" … "ntf-34" — not at 1. Do not infer the base index; look rows up by text or by position within ".notification-items-wrapper" (admin-shared.md §B3). Whether five is a fixed cap or a page size is [ASSUMED] — confirm by clicking "See older notifications", which was not followed in this session. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |

---

| Field | Value |
|---|---|
| **S.No.** | 14 |
| **Test Case ID** | TST_INVI_TC_10 |
| **Title** | Verify recent notifications show a relative date and older ones show an absolute date |
| **Linked Requirement** | #3 — Verify notifications |
| **Type** | Edge |
| **Priority** | Medium |
| **Preconditions** | Logged in as school-admin <ADMIN_USER> on Thor; "My school accounts" (/admin/admin/dashboard) displayed. The account has notifications both within and beyond the last seven days. |
| **Test Steps** | 1. Click the notifications bell.<br>2. Read the date on a row under "Last Seven days".<br>3. Read the date on a row under "Older". |
| **Test Data** | — |
| **Expected Result** | Rows under "Last Seven days" show a RELATIVE date, e.g. "5 days ago".<br>Rows under "Older" show an ABSOLUTE date in the format "Ddd, DD Mmm, YYYY", e.g. "Mon, 17 Aug, 2026". |
| **Remarks** | Grounded live 2026-08-27 — both formats observed in the same panel. This is worth pinning because a single date-format assertion across all rows will fail: the format depends on which time group the row falls in. The exact boundary between the two groups is [ASSUMED] to be seven days from the group heading wording; it was not tested at the boundary. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |

---

| Field | Value |
|---|---|
| **S.No.** | 15 |
| **Test Case ID** | TST_INVI_TC_11 |
| **Title** | Verify report-ready notifications describe the Reports destination consistently |
| **Linked Requirement** | #3 — Verify notifications |
| **Type** | Negative |
| **Priority** | Low |
| **Preconditions** | Logged in as school-admin <ADMIN_USER> on Thor; "My school accounts" (/admin/admin/dashboard) displayed. The account has both "Class summary" and "Aggregated data" report-ready notifications. |
| **Test Steps** | 1. Click the notifications bell.<br>2. Read the body line of a "Your Class summary report is ready" row.<br>3. Read the body line of a "Your Aggregated data report is ready" row. |
| **Test Data** | — |
| **Expected Result** | Both notifications refer to the same destination in the same words.<br>ACTUAL (2026-08-27): they do NOT. Class summary reads "View your report, available to download in the Reports tab", while Aggregated data reads "View your report, available to download on the Reports page" — "Reports tab" vs "Reports page". |
| **Remarks** | Grounded live 2026-08-27, both strings captured verbatim from the same open panel. A low-severity copy inconsistency, raised as a case so it is not rediscovered during automation and so any verbatim-copy assertion is written against the correct string per notification type. Confirm with the product team whether this is intended before raising a ticket. Full failure copy also captured: "Sorry, something went wrong. The <TYPE> report you requested failed to generate. Details available in the Reports tab". |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |

---

### Requirement #7 — Verify Help

| Field | Value |
|---|---|
| **S.No.** | 16 |
| **Test Case ID** | TST_ASHL_TC_3 |
| **Title** | Verify the admin header Help menu exposes Help centre and Tutorials when it is opened |
| **Linked Requirement** | #7 — Verify Help |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as school-admin <ADMIN_USER> on Thor; "My school accounts" (/admin/admin/dashboard) displayed. |
| **Test Steps** | 1. Click "Help" in the page header.<br>2. Observe the items in the open dropdown. |
| **Test Data** | — |
| **Expected Result** | The Help dropdown opens and contains exactly two items, in this order:<br>1. "Help centre"<br>2. "Tutorials" (itself a submenu) |
| **Remarks** | Grounded live 2026-08-27 by reading the pre-rendered DOM (admin-shared.md §A6). Trigger qid "cHeader-hlp-2" (id "hdr-help-dd"); items "cHeader-hlp-3" (Help centre) and "cHeader-hlp-5" (Tutorials, id "dropdownMenuButtonUserTutorials"). GENUINE GAP: TST_FOOT_TC_8 covers the FOOTER Help link and TST_DASH_TC_2 covers a Help button on the C1 Dashboard — neither covers this admin HEADER Help MENU and its two items. Item labels are verified; the dropdown was never opened interactively, so the open/close behaviour is [ASSUMED]. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |

---

| Field | Value |
|---|---|
| **S.No.** | 17 |
| **Test Case ID** | TST_ASHL_TC_4 |
| **Title** | Verify the Tutorials submenu lists all five tutorial topics when it is expanded |
| **Linked Requirement** | #7 — Verify Help |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | Logged in as school-admin <ADMIN_USER> on Thor; "My school accounts" (/admin/admin/dashboard) displayed. |
| **Test Steps** | 1. Click "Help" in the page header.<br>2. Click "Tutorials".<br>3. Observe the listed tutorial topics. |
| **Test Data** | — |
| **Expected Result** | Exactly five tutorial topics are listed, with these titles verbatim:<br>1. "Understanding codes and keys"<br>2. "Activating course materials"<br>3. "Creating a class"<br>4. "Adding students to a class"<br>5. "Creating assignments" |
| **Remarks** | Titles grounded live 2026-08-27 from the pre-rendered DOM. ⚠️ All five share the SINGLE qid "cHeader-hlp-6" — when automated they must be addressed by text or index, never by qid. Same trap class as "t-prd-cmp-cntr-1" (admin-shared.md §B3), and the same shape as the cFooter-9 duplication the footer selectors already work around with an aria-label qualifier. What each topic OPENS was not captured — [ASSUMED] and out of scope for this case. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |

---

### Requirement #8 — Verify footer link

| Field | Value |
|---|---|
| **S.No.** | 21 |
| **Test Case ID** | TST_FOOT_TC_10 |
| **Title** | Verify the admin footer renders seven links and omits Site Feedback |
| **Linked Requirement** | #8 — Verify footer link |
| **Type** | Edge |
| **Priority** | Medium |
| **Preconditions** | Logged in as school-admin <ADMIN_USER> on Thor; "My school accounts" (/admin/admin/dashboard) displayed. |
| **Test Steps** | 1. Scroll to the bottom of an admin page.<br>2. List every link rendered in the footer. |
| **Test Data** | — |
| **Expected Result** | The admin footer renders exactly SEVEN links:<br>"Terms of use" · "Privacy notice" · "Accessibility" · "Our approach" · "FAQs" · "Cambridge One for schools" · "Help"<br>plus the site-language control and the copyright line "© Cambridge University Press & Assessment 2026".<br>"Site Feedback" (qid cFooter-4) is NOT rendered in the admin app. |
| **Remarks** | Grounded live 2026-08-27 on /admin/admin/dashboard. EXTENDS the existing FOOT module (TST_FOOT_TC_1..9, footer.test.js) rather than duplicating it — those nine cases already validate each footer page launches correctly, and this batch adds no per-link cases. GENUINE GAP: the FOOT selector set includes "footerSiteFeedback" (a[qid="cFooter-4"]), so the C1 footer carries EIGHT links, but the ADMIN footer renders only seven — Site Feedback is absent. Nothing currently pins that difference, so a shared-footer change could silently add or remove it. The copyright YEAR is dynamic — assert the pattern, not the literal 2026. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |

---

### Requirement #11 — Verify different tab navigation

| Field | Value |
|---|---|
| **S.No.** | 18 |
| **Test Case ID** | TST_ASHL_TC_5 |
| **Title** | Verify all five school tabs are shown with Classes active when a school is opened |
| **Linked Requirement** | #11 — Verify different tab navigation |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as school-admin <ADMIN_USER> on Thor; "My school accounts" (/admin/admin/dashboard) displayed. |
| **Test Steps** | 1. Click a school card on "My school accounts".<br>2. Observe the tab strip and which tab is active.<br>3. Observe the page heading and the browser tab title. |
| **Test Data** | School: "3 July Test School 1" (<SCHOOL_KEY>) |
| **Expected Result** | Exactly FIVE tabs are shown, in this order and in upper case:<br>CLASSES · STUDENTS · STAFF · LIBRARY · REPORTS<br>"CLASSES" is the active tab by default, the page heading shows the school name, and the browser tab reads "Classes \| Cambridge One". |
| **Remarks** | **[EXTRA — Phase 1 exclusion]** Not present in the other team's reviewed sheet (`Admin_Gap_Analysis.xlsx`, status "Extra in Ours"). **This case will NOT be automated in Phase 1** — exclude it from the Phase 1 automation scope; revisit for a later phase. GROUNDED LIVE 2026-08-27. Tab qids "aDetail-1" (Classes), "aDetail-2" (Students), "aDetail-4" (Staff), "aDetail-5" (Library), "aDetail-6" (Reports). ⚠️ "aDetail-3" IS SKIPPED — the sequence is 1,2,4,5,6. Do not iterate 1..5 assuming contiguity. ⚠️ THE ACTIVE MARKER IS ON THE PARENT <li>, not the anchor: "li.nav-item.active > a". The anchor className is identical on every tab whether active or not, so asserting on the link class is a guaranteed false green. Labels render UPPER CASE — confirm whether that is CSS text-transform or the actual text before asserting case-sensitively. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |

---

| Field | Value |
|---|---|
| **S.No.** | 19 |
| **Test Case ID** | TST_ASHL_TC_6 |
| **Title** | Verify each tab loads its own page and becomes the active tab when it is selected |
| **Linked Requirement** | #11 — Verify different tab navigation |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as school-admin <ADMIN_USER> on Thor; "My school accounts" (/admin/admin/dashboard) displayed. A school is open on the Classes tab. |
| **Test Steps** | 1. Click "STUDENTS" and note the URL, title and active tab.<br>2. Repeat for "STAFF", "LIBRARY", "REPORTS", then "CLASSES". |
| **Test Data** | School slug: org_<SCHOOL_SLUG> |
| **Expected Result** | Each tab navigates to its own URL, sets its own browser-tab title, and becomes the active tab:<br>\| Tab \| URL suffix \| Title \|<br>\| CLASSES \| /class \| "Classes \\| Cambridge One" \|<br>\| STUDENTS \| /learner \| "Students \\| Cambridge One" \|<br>\| STAFF \| /staff \| "Staff \\| Cambridge One" \|<br>\| LIBRARY \| /library \| "Library \\| Cambridge One" \|<br>\| REPORTS \| /reports \| "Reports \\| Cambridge One" \|<br>The school heading stays unchanged throughout. |
| **Remarks** | **[EXTRA — Phase 1 exclusion]** Not present in the other team's reviewed sheet (`Admin_Gap_Analysis.xlsx`, status "Extra in Ours"). **This case will NOT be automated in Phase 1** — exclude it from the Phase 1 automation scope; revisit for a later phase. GROUNDED LIVE 2026-08-27 — all five walked and every URL and title confirmed. ⚠️ NOTE the STUDENTS tab routes to "/learner", NOT "/student". A URL assertion built from the tab label will fail on this one. Tabs carry REAL hrefs (unlike the footer, whose logged-in hrefs collapse to javascript:void(0) — TST_FOOT_TC_10 remarks), so tab navigation is genuinely href-driven. TIMING measured this session: Reports took ~4.3 s to become active, Classes ~1.2 s. Poll for "li.nav-item.active > a" carrying the expected qid rather than using a fixed pause (admin-shared.md §B8). |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |

---

| Field | Value |
|---|---|
| **S.No.** | 20 |
| **Test Case ID** | TST_ASHL_TC_7 |
| **Title** | Verify the active school tab is identifiable to assistive technology |
| **Linked Requirement** | #11 — Verify different tab navigation |
| **Type** | Negative |
| **Priority** | Medium |
| **Preconditions** | Logged in as school-admin <ADMIN_USER> on Thor; "My school accounts" (/admin/admin/dashboard) displayed. A school is open. |
| **Test Steps** | 1. Inspect each tab link for an aria-current or selected-state attribute.<br>2. Switch tabs and re-inspect. |
| **Test Data** | — |
| **Expected Result** | The active tab exposes an accessible current/selected state, so assistive technology can announce which section the user is in.<br>ACTUAL (2026-08-27): this FAILS. No tab link carries aria-current or aria-selected; the only indicator is the "active" CSS class on the parent <li>, which is presentational. |
| **Remarks** | **[EXTRA — Phase 1 exclusion]** Not present in the other team's reviewed sheet (`Admin_Gap_Analysis.xlsx`, status "Extra in Ours"). **This case will NOT be automated in Phase 1** — exclude it from the Phase 1 automation scope; revisit for a later phase. GROUNDED LIVE 2026-08-27. This is the SECOND instance of the same gap in this batch — the My Profile tabs have it too (TST_MYPR_TC_8). Worth raising as one combined accessibility ticket rather than two. The school tabs are at least recoverable for automation via "li.nav-item.active"; the profile tabs have no indicator at all, which makes them the more severe of the two. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |

---

### Requirement #4 — Verify Change school key for normal school

| Field | Value |
|---|---|
| **S.No.** | 22 |
| **Test Case ID** | TST_SKEY_TC_1 |
| **Title** | Verify the School settings menu exposes Change school key alongside the grading options |
| **Linked Requirement** | #4 — Verify Change school key for normal school |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as school-admin <ADMIN_USER> on Thor; a school opened from "My school accounts" so the school context is set; Classes tab displayed. |
| **Test Steps** | 1. Click "School settings" on the Classes tab.<br>2. Observe the items in the open menu. |
| **Test Data** | — |
| **Expected Result** | The menu opens and contains exactly three items:<br>1. "Change school key"<br>2. "Manage grading categories"<br>3. "Manage grading scales" |
| **Remarks** | GROUNDED LIVE 2026-08-27 from the pre-rendered DOM. Trigger qid "adEdit-1"; items "adEdit-2" (Change school key), "adEdit-7" (categories), "adEdit-8" (scales). ⚠️ CORRECTS admin-shared.md §A1, which lists School settings as having only the TWO grading entries. "Change school key" is a third and was previously undocumented. Note the qid numbering is NOT contiguous (2, 7, 8) — adEdit-3/4 are the confirmation-dialog buttons, not menu items. Do not iterate the family. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |

---

| Field | Value |
|---|---|
| **S.No.** | 23 |
| **Test Case ID** | TST_SKEY_TC_2 |
| **Title** | Verify an irreversible-action warning is shown when Change school key is selected |
| **Linked Requirement** | #4 — Verify Change school key for normal school |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as school-admin <ADMIN_USER> on Thor; a school opened from "My school accounts" so the school context is set; Classes tab displayed. |
| **Test Steps** | 1. Open "School settings".<br>2. Click "Change school key".<br>3. Read the dialog. |
| **Test Data** | — |
| **Expected Result** | A warning dialog is shown, carrying a warning-triangle icon and this copy verbatim:<br>Heading: "CAREFUL!"<br>Title: "Changing the school key cannot be undone"<br>Body: "This action is recommended only if your current school key has been compromised"<br>Two controls are offered: "Continue" and "Cancel". |
| **Remarks** | COPY GROUNDED LIVE 2026-08-27 — captured VERBATIM from the pre-rendered DOM (admin-shared.md §A6) WITHOUT triggering the action, which is the only safe way to verify it on a shared school. Dialog buttons: Continue "adEdit-3", Cancel "adEdit-4". The expected copy is therefore VERIFIED even though the dialog was never opened; only the act of opening it is [ASSUMED]. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |

---

| Field | Value |
|---|---|
| **S.No.** | 24 |
| **Test Case ID** | TST_SKEY_TC_3 |
| **Title** | Verify a new school key is issued and the old one stops working when Continue is confirmed |
| **Linked Requirement** | #4 — Verify Change school key for normal school |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as school-admin on a DEDICATED, DISPOSABLE school that no test suite references. NEVER FCN-CHZ-PDA. Classes tab displayed. |
| **Test Steps** | 1. Note the current school key.<br>2. Open "School settings" and click "Change school key".<br>3. Click "Continue" in the warning dialog.<br>4. Return to "My school accounts" and read the school key on the card.<br>5. Attempt to join the school using the OLD key. |
| **Test Data** | Old key: <DISPOSABLE_SCHOOL_KEY> |
| **Expected Result** | [ASSUMED] After step 3 a new school key is generated and shown.<br>[ASSUMED] After step 4 the card shows the NEW key, in the same XXX-XXX-XXX format.<br>[ASSUMED] After step 5 the OLD key is rejected. |
| **Remarks** | ⚠️ NOT EXECUTED AND MUST NOT BE, on any shared school. FCN-CHZ-PDA is the primary shared school; its key is hardcoded as "schoolKey" in schoolAdminAddClassData.json, so changing it would break EVERY admin suite at once (admin-shared.md §0, §A5). Key format observed across all 7 schools: three uppercase triplets, e.g. "FCN-CHZ-PDA". Whether existing members are affected, and whether the change is announced anywhere, are both unknown. DESTRUCTIVE AND IRREVERSIBLE — this decides suite placement absolutely: it can never sit in a shared-school suite. |
| **Actual Result** | *(blank in design)* |
| **Status** | **Blocked** |
| **Comments / Defect ID** | BLOCKED at design time 2026-08-27 — IRREVERSIBLE ACTION ON A SHARED SCHOOL. The product itself states "Changing the school key cannot be undone". Unblock with a DEDICATED, DISPOSABLE school that no suite depends on. |

---

| Field | Value |
|---|---|
| **S.No.** | 25 |
| **Test Case ID** | TST_SKEY_TC_4 |
| **Title** | Verify the school key is unchanged when the warning dialog is cancelled |
| **Linked Requirement** | #4 — Verify Change school key for normal school |
| **Type** | Negative |
| **Priority** | High |
| **Preconditions** | Logged in as school-admin <ADMIN_USER> on Thor; a school opened from "My school accounts" so the school context is set; Classes tab displayed. |
| **Test Steps** | 1. Note the current school key.<br>2. Open "School settings" and click "Change school key".<br>3. Click "Cancel" in the warning dialog.<br>4. Re-read the school key. |
| **Test Data** | — |
| **Expected Result** | [ASSUMED] The dialog closes and the school key is UNCHANGED. |
| **Remarks** | ⚠️ EXPECTED RESULT NOT VERIFIED — the dialog was never opened, by design, on the shared school. This is the SAFE half of the flow and is the one case here that could reasonably be run on a shared school, PROVIDED Cancel is clicked and never Continue. Even so, treat it carefully: a misclick is irreversible. Cancel qid "adEdit-4". Also confirm whether dismissing via Esc or a backdrop click behaves the same as Cancel. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |

---

### Requirement #5 — Verify non mqa admin should not see cqa/mqa product

| Field | Value |
|---|---|
| **S.No.** | 26 |
| **Test Case ID** | TST_LIBR_TC_32 |
| **Title** | Verify MQA and CQA restricted products are not listed for an administrator outside those programmes |
| **Linked Requirement** | #5 — Verify non mqa admin should not see cqa/mqa product |
| **Type** | Negative |
| **Priority** | High |
| **Preconditions** | Logged in as an administrator with NO MQA or CQA entitlement, on a school outside those programmes. Library tab open. |
| **Test Steps** | 1. Open the Library tab for the school.<br>2. Note the total product count in the "Library (N)" heading.<br>3. Search the listing for products restricted to the MQA and CQA programmes. |
| **Test Data** | School: <NON_MQA_SCHOOL_KEY> |
| **Expected Result** | [ASSUMED] No MQA- or CQA-restricted product appears in the listing, and the total count excludes them. |
| **Remarks** | ⚠️ THE EXPECTED RESULT DEPENDS ON A DEFINITION THAT DOES NOT YET EXIST. Restriction is a licensing property, NOT a naming convention, so this case cannot be written against product titles.<br>OBSERVED LIVE 2026-08-27 on "3 July Test School 1" (FCN-CHZ-PDA), Library (971): TWO products whose TITLES contain "CQA" are listed — "CQA - 7 Jan 2021 - Test Umbrella product" and "Teacher Training - CQA Test Product". Separately, 3 titles begin "NON MQA", which are explicitly non-MQA products and are correctly present.<br>This is an OBSERVATION, NOT A DEFECT CLAIM: a title containing "CQA" does not prove the product is CQA-restricted. It is recorded because it is the concrete thing to check once the definition exists — if those two ARE restricted, this is a live leak; if they are merely named that way, the case needs different data.<br>Extends the existing LIBR module (TST_LIBR_TC_1..31) — do not renumber it. |
| **Actual Result** | *(blank in design)* |
| **Status** | **Blocked** |
| **Comments / Defect ID** | BLOCKED at design time 2026-08-27 on TWO counts: (1) no non-MQA admin account is available — <ADMIN_USER>'s home school IS MQA Sierra School (MQA-ABC-DEF); (2) the product team must first define what technically marks a product as MQA/CQA-restricted. Unblock with a non-MQA admin account and that definition. |

---

### Requirement #10 — Admin part of multiple org

| Field | Value |
|---|---|
| **S.No.** | 27 |
| **Test Case ID** | TST_SADB_TC_2 |
| **Title** | Verify every school the administrator manages is listed when My school accounts is opened |
| **Linked Requirement** | #10 — Admin part of multiple org |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as school-admin <ADMIN_USER> on Thor; "My school accounts" (/admin/admin/dashboard) displayed. |
| **Test Steps** | 1. Observe the "My school accounts" page.<br>2. Inspect each school card. |
| **Test Data** | — |
| **Expected Result** | Every school the administrator manages is listed, one card each, numbered sequentially from "01" with zero padding.<br>Each card shows: index, school name, address, the label "School key", the key itself in XXX-XXX-XXX format, a "Copy" control, and a chevron opening the school.<br>Observed 2026-08-27 for <ADMIN_USER>: 7 schools, numbered 01–07. |
| **Remarks** | **[EXTRA — Phase 1 exclusion]** Not present in the other team's reviewed sheet (`Admin_Gap_Analysis.xlsx`, status "Extra in Ours"). **This case will NOT be automated in Phase 1** — exclude it from the Phase 1 automation scope; revisit for a later phase. GROUNDED LIVE 2026-08-27. Card qid "aDashboard-N" (a.inst-link); chevron is a SEPARATE "aDashboard1-N". Both are POSITIONAL. The school key is carried in the card's aria-label, which is what makes key-based selection possible (schoolAdminDashboard.schoolLinkByKey uses a.inst-link[aria-label*="{{key}}"]).<br>⚠️ NEVER assert the literal count 7 — this is a shared account and the list changes (admin-shared.md §A5). Assert the card STRUCTURE and that the expected key is present.<br>Extends the existing SADB module (TST_SADB_TC_1 opens a school by key) — that case already covers opening; this one covers the LISTING, which nothing did.<br>⚠️ EXTENDS admin-shared.md §0, which documents 4 schools. This account sees 7 — KNF-XRD-QVE, HQC-ZWM-ZVF and GYB-JMU-KYA were undocumented. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |

---

| Field | Value |
|---|---|
| **S.No.** | 28 |
| **Test Case ID** | TST_SADB_TC_3 |
| **Title** | Verify switching between organisations loads each one independently when the admin manages several |
| **Linked Requirement** | #10 — Admin part of multiple org |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as school-admin <ADMIN_USER> on Thor; "My school accounts" (/admin/admin/dashboard) displayed. |
| **Test Steps** | 1. Open the first school and note the org slug in the URL and the page heading.<br>2. Return to "My school accounts".<br>3. Open a DIFFERENT school and note its org slug and heading.<br>4. Compare the Classes listings of the two. |
| **Test Data** | Schools: <SCHOOL_KEY_A> and <SCHOOL_KEY_B> |
| **Expected Result** | Each school opens under its own org slug, /admin/admin/org_<slug>/class, with its own name as the page heading and its own class list. No content from the previously opened school persists.<br>Observed 2026-08-27: "3 July Test School 1" (FCN-CHZ-PDA) opened as org_perf_testschool_1. |
| **Remarks** | GROUNDED PARTIALLY 2026-08-27 — one school was opened and its slug confirmed; the SWITCH between two schools was not exercised, so step 4 is [ASSUMED].<br>⚠️ The org slug is NOT derivable from the school name or key — "3 July Test School 1" (FCN-CHZ-PDA) maps to org_perf_testschool_1. Capture each slug; never construct it.<br>The school context MUST be set by clicking the card — deep-linking /admin/admin/org_<slug>/class returns /dashboard/error even when authenticated (admin-shared.md §A1).<br>Worth checking whether the per-account server-side class Filter and Search (§A4) are scoped per school or leak across organisations — that is unknown and would be a real defect if they leak. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |

---

### Requirement #12 — Verify viewing multiple schools

| Field | Value |
|---|---|
| **S.No.** | 29 |
| **Test Case ID** | TST_SADB_TC_4 |
| **Title** | Verify two schools sharing a display name remain distinguishable by their school key |
| **Linked Requirement** | #12 — Verify viewing multiple schools |
| **Type** | Edge |
| **Priority** | High |
| **Preconditions** | Logged in as school-admin <ADMIN_USER> on Thor; "My school accounts" (/admin/admin/dashboard) displayed. |
| **Test Steps** | 1. Locate the two cards sharing the same display name.<br>2. Compare their school keys.<br>3. Open the one matching a specific key and confirm which school loaded. |
| **Test Data** | Duplicate display name "3 July Test School 1" — keys FCN-CHZ-PDA and ZPB-TWP-AEQ |
| **Expected Result** | Both cards show the SAME display name but DIFFERENT school keys, and the card selected by key opens that specific school. |
| **Remarks** | **[EXTRA — Phase 1 exclusion]** Not present in the other team's reviewed sheet (`Admin_Gap_Analysis.xlsx`, status "Extra in Ours"). **This case will NOT be automated in Phase 1** — exclude it from the Phase 1 automation scope; revisit for a later phase. GROUNDED LIVE 2026-08-27 — cards 01 and 02 both read "3 July Test School 1" with keys FCN-CHZ-PDA and ZPB-TWP-AEQ, and identical addresses too.<br>⚠️ THIS IS THE CASE THAT JUSTIFIES admin-shared.md §0's standing rule: ALWAYS select a school by KEY, never by name or card position. Selecting by name is ambiguous here, and card qids (aDashboard-N) are positional so they re-issue when the list changes.<br>Confirming WHICH school loaded (step 3) needs a distinguishing feature — the org slug in the URL is the reliable one, since the heading shows the shared name. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |

---

### Requirement #6 — Verify launch of Cambridge one for schools and create institution request

| Field | Value |
|---|---|
| **S.No.** | 30 |
| **Test Case ID** | TST_SRQS_TC_2 |
| **Title** | Verify the institution request is submitted and confirmed from the summary step |
| **Linked Requirement** | #6 — Verify launch of Cambridge one for schools and create institution request |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | The "Set up a school account" wizard has been completed through step 7, so the School request summary step (step 8) is displayed. |
| **Test Steps** | 1. Review the summary of the entered details.<br>2. Submit the request.<br>3. Observe the confirmation. |
| **Test Data** | School name: "<TEST_PREFIX> Test School" · Type: Primary school · Teachers: 2-14 · Location: United Kingdom · Address: 123 Test Street, Test City · Tel: +441234567890 |
| **Expected Result** | [ASSUMED] The request is submitted and a confirmation is shown, stating that the request has been received and what happens next. |
| **Remarks** | ⚠️ THE ONLY UNCOVERED STEP OF THIS SCENARIO. The wizard is already automated step by step — TST_DINS_TC_1 (entry), TST_SUSA_TC_1..2 (intro), TST_SCTY_* (type), TST_NTCH_* (teachers), TST_SNAM_* (name), TST_SLOC_* (location), TST_SADR_* (address), TST_SCON_* (contact), TST_SRQS_TC_1 (summary loads). Launching from the footer is covered by TST_FOOT_TC_7 ("Validate Cambridge One School page is launched correctly"). What NOTHING covers is the actual SUBMISSION and its confirmation — this case, extending SRQS. Confirmation copy is [ASSUMED]; capture it verbatim when the block is lifted. CREATES REAL DATA outside the test estate. |
| **Actual Result** | *(blank in design)* |
| **Status** | **Blocked** |
| **Comments / Defect ID** | BLOCKED at design time 2026-08-27 — submitting raises a REAL institution request that reaches a human queue and cannot be withdrawn from the UI. Unblock by confirming with the product team that Thor submissions are safe to raise and are swept, or by agreeing a test-only school name prefix. |

---

| Field | Value |
|---|---|
| **S.No.** | 31 |
| **Test Case ID** | TST_SRQS_TC_3 |
| **Title** | Verify each wizard step blocks progress until its required input is supplied |
| **Linked Requirement** | #6 — Verify launch of Cambridge one for schools and create institution request |
| **Type** | Negative |
| **Priority** | Medium |
| **Preconditions** | The "Set up a school account" wizard is open at step 2 (School type). |
| **Test Steps** | 1. On School type, without selecting an option, attempt to continue.<br>2. Select an option and confirm progress is now allowed.<br>3. Repeat the same check for Number of teachers, School name, School location, School address and School contact details. |
| **Test Data** | — |
| **Expected Result** | [ASSUMED] On each step the Next control is unavailable until that step's required input is supplied, and becomes available once it is. No step can be skipped. |
| **Remarks** | ⚠️ EXPECTED RESULT NOT VERIFIED — the wizard was not walked in this session. INFERRED from the existing automation, whose case titles state the enabling direction only, e.g. TST_SCTY_TC_3 "Select first radio option (Primary school) to ENABLE Next button" and TST_SNAM_TC_3 "Fill school name field to ENABLE Next button". The DISABLED half is nowhere asserted, which is the gap this case fills. Confirm whether Next is natively disabled or only CSS-disabled — admin-shared.md §B4 records CSS-only disabling elsewhere in this app, which would make a naive enabled-state check a false green. SIDE-EFFECT FREE: stops short of submission. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |

---

### Requirement #9 — Verify various errors in forms and modals

| Field | Value |
|---|---|
| **S.No.** | 32 |
| **Test Case ID** | TST_ASHL_TC_8 |
| **Title** | Verify no dialog is visible when an admin screen first loads |
| **Linked Requirement** | #9 — Verify various errors in forms and modals |
| **Type** | Negative |
| **Priority** | High |
| **Preconditions** | Logged in as school-admin <ADMIN_USER> on Thor; a school opened from "My school accounts" so the school context is set; Classes tab displayed. |
| **Test Steps** | 1. Load the Classes tab and observe the screen without interacting.<br>2. Repeat for Students, Staff, Library and Reports. |
| **Test Data** | — |
| **Expected Result** | On every tab, no dialog, warning or error is visible on load. The screen shows only its own content. |
| **Remarks** | **[EXTRA — Phase 1 exclusion]** Not present in the other team's reviewed sheet (`Admin_Gap_Analysis.xlsx`, status "Extra in Ours"). **This case will NOT be automated in Phase 1** — exclude it from the Phase 1 automation scope; revisit for a later phase. GROUNDED LIVE 2026-08-27 — verified that every dialog present in the DOM was hidden on load (Classes 5, Students 4, Staff 1; all offsetParent === null). ⚠️ THIS IS THE HEADLINE AUTOMATION TRAP FOR THIS SCENARIO. Admin dialogs are PRE-RENDERED, so they exist in the DOM before anything triggers them. Any check of the form "getElementCount(dialog) > 0" therefore passes ALWAYS and proves nothing — admin-shared.md §B2 records this silently breaking reset_filters for weeks. Assert VISIBILITY, never presence. Note also that opacity:0 still counts as visible to Playwright; only display:none is hidden. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |

---

| Field | Value |
|---|---|
| **S.No.** | 33 |
| **Test Case ID** | TST_ASHL_TC_9 |
| **Title** | Verify the 50-item limit warnings use a consistent message pattern across screens |
| **Linked Requirement** | #9 — Verify various errors in forms and modals |
| **Type** | Edge |
| **Priority** | Medium |
| **Preconditions** | Logged in as school-admin <ADMIN_USER> on Thor; a school opened from "My school accounts" so the school context is set; Classes tab displayed. |
| **Test Steps** | 1. Read the bulk-limit warning offered on the Classes tab.<br>2. Read the equivalent warning on the Students tab.<br>3. Compare their wording. |
| **Test Data** | — |
| **Expected Result** | Both follow the same two-line pattern, differing only in the noun:<br>Classes: "You can only delete 50 classes at one time" / "Please uncheck some classes to continue"<br>Students: "You can only remove 50 students at one time" / "Please uncheck some students to continue"<br>Both offer a "Close" control. |
| **Remarks** | **[EXTRA — Phase 1 exclusion]** Not present in the other team's reviewed sheet (`Admin_Gap_Analysis.xlsx`, status "Extra in Ours"). **This case will NOT be automated in Phase 1** — exclude it from the Phase 1 automation scope; revisit for a later phase. COPY GROUNDED LIVE 2026-08-27 — both captured VERBATIM from the pre-rendered DOM (§A6) without reaching the capped state, which would otherwise require 51+ rows. Note the VERB differs with the domain — "delete" for classes, "remove" for students — so a single shared assertion string is wrong. The LIMIT (50) and the sentence shape are the consistent parts. Reaching these states for real is Blocked on the shared school (admin-shared.md §A5: it holds 26 students, so the 50-student cap cannot be hit). |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |

---

| Field | Value |
|---|---|
| **S.No.** | 34 |
| **Test Case ID** | TST_ASHL_TC_10 |
| **Title** | Verify destructive confirmations state their consequence before the action is taken |
| **Linked Requirement** | #9 — Verify various errors in forms and modals |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as school-admin <ADMIN_USER> on Thor; a school opened from "My school accounts" so the school context is set; Classes tab displayed. |
| **Test Steps** | 1. Read the class-deletion confirmation.<br>2. Read the student-removal confirmation.<br>3. Read the change-school-key confirmation.<br>4. Check each offers a way to back out. |
| **Test Data** | — |
| **Expected Result** | Each destructive confirmation names its consequence and offers a non-destructive exit:<br>Class delete — "WARNING!" / "There might be students, teachers and course materials in the selected classes" / "Are you sure you want to delete?" / "No, cancel"<br>Student removal — "I confirm that I want to remove students from my school account" / "Cancel" / "Request to remove"<br>Change school key — "CAREFUL!" / "Changing the school key cannot be undone" / "Cancel" |
| **Remarks** | **[EXTRA — Phase 1 exclusion]** Not present in the other team's reviewed sheet (`Admin_Gap_Analysis.xlsx`, status "Extra in Ours"). **This case will NOT be automated in Phase 1** — exclude it from the Phase 1 automation scope; revisit for a later phase. ALL THREE CAPTURED VERBATIM 2026-08-27 from the pre-rendered DOM, without triggering any of them — which is the only safe way, since all three are destructive on a shared school. ⚠️ The change-school-key dialog is present on EVERY admin tab (Classes, Students, Staff all carry it) because School settings lives in the shared page chrome — scope any modal selector with :has(...) to the specific dialog, or it will match this one everywhere. Async follow-ups are also pre-rendered and worth checking in the same pass: "This will take a few minutes" (classes) and "Removing students may take some time" (students). |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |

---

### Requirement #13 — Verify Admin is able to switch to teacher view

| Field | Value |
|---|---|
| **S.No.** | 35 |
| **Test Case ID** | TST_SADB_TC_5 |
| **Title** | Verify the administrator can switch to the teacher dashboard and back again |
| **Linked Requirement** | #13 — Verify Admin is able to switch to teacher view |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as school-admin <ADMIN_USER> on Thor; "My school accounts" (/admin/admin/dashboard) displayed. |
| **Test Steps** | 1. Note that the toggle reports Administrator as active.<br>2. Activate the toggle.<br>3. Observe the resulting page.<br>4. Activate the toggle again.<br>5. Confirm the administrator view is restored. |
| **Test Data** | — |
| **Expected Result** | After step 2 the browser navigates to /dashboard/teacher/dashboard, the browser tab reads "Teacher dashboard \| Cambridge One", the page greets the user ("Hi <FIRST_NAME>!") and the toggle now reports "Teacher currently active".<br>After step 4 the browser returns to /admin/admin/dashboard, titled "My school accounts \| Cambridge One", and the toggle reports "Administrator currently active". |
| **Remarks** | GROUNDED LIVE 2026-08-27 — the full round trip was performed and the account was left in Administrator view. ⚠️ THE SWITCH ELEMENT IS NAMED DIFFERENTLY IN EACH VIEW: ".can-toggle__switch" (double underscore) in the admin view, ".can-toggle-switch" (single hyphen) in the teacher view. A selector written for one view SILENTLY FAILS to find it in the other, which breaks exactly the round trip this case exercises. Use "#teacher-admin-toggle" (stable in both) and read the input's checked state — false = Administrator, true = Teacher. The focusable control is the inner [tabindex="0"] div; the input itself is aria-hidden. The toggle also appears on inner admin tabs, not just the dashboard. Existing selector schoolAdminDashboard.teacherAdminToggle already targets the input; this extends SADB. SIDE-EFFECT FREE — a view switch only. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |

---

| Field | Value |
|---|---|
| **S.No.** | 36 |
| **Test Case ID** | TST_SADB_TC_6 |
| **Title** | Verify the teacher view lists the schools where the user teaches, not those they administer |
| **Linked Requirement** | #13 — Verify Admin is able to switch to teacher view |
| **Type** | Edge |
| **Priority** | High |
| **Preconditions** | Logged in as school-admin <ADMIN_USER> on Thor; "My school accounts" (/admin/admin/dashboard) displayed. The user is both an administrator and a teacher on overlapping sets of schools. |
| **Test Steps** | 1. On "My school accounts", list the schools shown.<br>2. Switch to the teacher view.<br>3. List the school groups shown there.<br>4. Compare the two lists. |
| **Test Data** | — |
| **Expected Result** | The two lists are NOT the same. The administrator view shows schools the user administers; the teacher view groups classes under schools where the user teaches, which may include schools absent from the administrator view.<br>Observed 2026-08-27: administrator view 7 schools; teacher view 8 school groups, including "ABERYSTWYTH COLLEGE : THOR" and "LTI INTEGRATIONS TEST2", neither of which appears in the administrator list. |
| **Remarks** | **[EXTRA — Phase 1 exclusion]** Not present in the other team's reviewed sheet (`Admin_Gap_Analysis.xlsx`, status "Extra in Ours"). **This case will NOT be automated in Phase 1** — exclude it from the Phase 1 automation scope; revisit for a later phase. GROUNDED LIVE 2026-08-27. This matters because it is easy to assume the two views show the same estate — they do not, and a test asserting equal school counts across the toggle will fail. ⚠️ The teacher view groups by school DISPLAY NAME, so the two distinct schools both called "3 July Test School 1" (FCN-CHZ-PDA and ZPB-TWP-AEQ) collapse into a SINGLE group there. The admin view keeps them separate via their keys. Do not match schools across the two views by name. ⚠️ NEVER assert the literal counts 7 and 8 — shared account (§A5). Assert the RELATIONSHIP: the teacher list contains at least one school the admin list does not. ⚠️ Every "Create class" button in the teacher view shares qid "tDashboard-ncls-btn-1" — 7 elements, one per school group. See TST_SADB_TC_7. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |

---

### Requirement #14 — Verify admin is able to create a new class in teacher view and view that class in Admin classes tab

| Field | Value |
|---|---|
| **S.No.** | 37 |
| **Test Case ID** | TST_SADB_TC_7 |
| **Title** | Verify a class created in the teacher view appears in the Admin Classes tab for the same school |
| **Linked Requirement** | #14 — Verify admin is able to create a new class in teacher view and view that class in Admin classes tab |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as school-admin <ADMIN_USER> on Thor; "My school accounts" (/admin/admin/dashboard) displayed. The user is both administrator and teacher on the target school. USE A SCHOOL WHOSE CLASS LIST IS NOT ASSERTED BY OTHER SUITES. |
| **Test Steps** | 1. Switch to the teacher view.<br>2. Locate the section for the target school and click ITS "Create class" control.<br>3. Create a class named "AutoClass_TeacherView_<RUN_ID>".<br>4. Switch back to the administrator view.<br>5. Open the same school and go to the Classes tab.<br>6. Search for the class by name. |
| **Test Data** | School: <SCHOOL_KEY> · Class name: "AutoClass_TeacherView_<RUN_ID>" |
| **Expected Result** | [ASSUMED] The class is created under the chosen school and, after step 6, is listed in that school's Admin Classes tab under the same name. |
| **Remarks** | ⚠️ CREATES REAL DATA — a real class on a real school. This decides suite placement absolutely: it must NOT sit in a side-effect-free suite. Use the sweepable "AutoClass_" prefix (admin-shared.md §A7) so leftovers are recognisable, and note that class DELETE is SOFT, so every run leaves a permanent soft-deleted row (§A5).<br>⚠️ CHOOSING THE RIGHT "Create class" IS THE HARD PART. All 7 buttons in the teacher view share qid "tDashboard-ncls-btn-1", one per school group, and the qid cannot distinguish them. The button must be located THROUGH its school-group heading, or the class lands on the wrong school. A class literally named "admin as a teacher class" already exists under MQA Sierra School, suggesting this has been done manually before.<br>⚠️ CLASS CREATION IS ASYNCHRONOUS (§A4) — the success dialog says it "can take up to 12 hours"; measured visibility ~24 s on a responsive Thor and >90 s on a loaded one. Step 6 must POLL, and the active-class count does NOT increment immediately, so never assert count + 1.<br>Teacher-side creation itself is already automated (ENTE / CREA modules, createNewClass.page.js) — what is NOT covered anywhere is this CROSS-ROLE journey, which is the point of the case.<br>The teacher view groups by display name, so a school with a duplicate name is ambiguous here — pick a school with a UNIQUE name (§A5, TST_SADB_TC_6). |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |

---

---

| Field | Value |
|---|---|
| **S.No.** | 38 |
| **Test Case ID** | TST_INVI_TC_12 |
| **Title** | Verify clicking a notification opens its target and clears it from the unread count |
| **Linked Requirement** | #3 — Verify notifications |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | Signed in as an administrator with at least one unread notification, the bell showing a count. |
| **Test Steps** | 1. Record the unread badge count. 2. Open the notifications panel. 3. Click a notification whose target is known (e.g. a report-ready notification). 4. Confirm where it lands. 5. Re-open the panel and re-read the badge count and the item's read state. |
| **Test Data** | An account with unread notifications; a report-ready notification if available. |
| **Expected Result** | The click navigates to the notification's target (a report-ready notification lands on the Reports tab), the item is marked read, and the unread badge count decreases by one. `[ASSUMED]` |
| **Remarks** | Added 2026-09-01 from the other team's TC_GEN_003, whose steps click a notification and mark it read. All five of our notification cases (`TST_INVI_TC_7`–`TC_11`) are about **rendering** — badge, grouping, dates, wording — and none clicks a row. `TST_INVI_TC_7` already pairs the badge with its accessible name, so this closes the loop by proving the count actually changes. **Mutates state** (read status is not reversible) — keep out of side-effect-free suites. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** |  |

---

| Field | Value |
|---|---|
| **S.No.** | 39 |
| **Test Case ID** | TST_LIBR_TC_34 |
| **Title** | Verify an MQA administrator does see the MQA/CQA restricted products |
| **Linked Requirement** | #5 — Verify non mqa admin should not see cqa/mqa product |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | An MQA-provisioned administrator account with access to a school holding MQA/CQA products. |
| **Test Steps** | 1. Sign in as the MQA-provisioned administrator. 2. Open the school's Library tab. 3. Search for the restricted product by title and confirm it is listed. |
| **Test Data** | MQA admin `<MQA_ADMIN_ACCOUNT>`; restricted product `<MQA_RESTRICTED_PRODUCT>`. |
| **Expected Result** | The MQA/CQA product **is** listed for the MQA administrator. `[ASSUMED]` |
| **Remarks** | Added 2026-09-01 from the other team's TC_GEN_005, whose step 3 is an explicit control check. `TST_LIBR_TC_32` proves only the negative half — that restricted products are hidden from a non-MQA admin — which a defect hiding the product from **everyone** would also satisfy. The pair is what makes either half meaningful. This is the same structural point as `TST_CLST_TC_24` on the Classes tab: a negative-only assertion cannot distinguish correct behaviour from over-blocking. |
| **Actual Result** | |
| **Status** | Blocked |
| **Comments / Defect ID** | Blocked at design time (skill rule 4): needs an MQA-provisioned administrator account, the counterpart to the non-MQA account `TST_LIBR_TC_32` is already waiting on. Unblock both together — one fixture request covers the pair. |

---

| Field | Value |
|---|---|
| **S.No.** | 40 |
| **Test Case ID** | TST_FOOT_TC_11 |
| **Title** | Verify every admin footer link opens its intended destination |
| **Linked Requirement** | #8 — Verify footer link |
| **Type** | Positive |
| **Priority** | Low |
| **Preconditions** | On any admin page with the footer visible. |
| **Test Steps** | 1. Scroll to the footer and record every link it renders. 2. Click each link in turn. 3. Confirm the destination that opens and return. 4. Reconcile the set of links found against `TST_FOOT_TC_10`. |
| **Test Data** | The footer links — the other team name Terms of use, Privacy notice, Accessibility, Our approach and FAQs. |
| **Expected Result** | Each footer link opens its intended destination and none is broken (no 404, no dead anchor). `[ASSUMED]` |
| **Remarks** | Added 2026-09-01 from the other team's TC_GEN_008, which clicks each link and checks the destination. `TST_FOOT_TC_10` asserts the footer **renders seven links and omits Site Feedback** — a presence check, not a navigation check. **Reconcile the count while grounding:** our register says seven links, theirs names five. One of the two is wrong; correct whichever it is and note the outcome here. **Read-only**, but links may open new tabs or external sites — handle that in automation. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** |  |

---

| Field | Value |
|---|---|
| **S.No.** | 41 |
| **Test Case ID** | TST_SADB_TC_8 |
| **Title** | Verify data stays scoped to the active organisation when an admin manages several schools |
| **Linked Requirement** | #11 — Verify different tab navigation |
| **Type** | Negative |
| **Priority** | High |
| **Preconditions** | An administrator with access to two or more schools, where each school holds at least one record (class, student, staff member, library product) that exists **only** in that school. |
| **Test Steps** | 1. Sign in as the multi-org administrator and open school A. 2. On each tab — Classes, Students, Staff, Library — confirm every listed record belongs to school A, and specifically that school B's unique records are **absent**. 3. Switch to school B and repeat in the opposite direction. 4. Apply a search or filter in school A, then switch to school B, and confirm no results carry across. |
| **Test Data** | Multi-org admin `<MULTI_ORG_ADMIN>`; unique records `<A_ONLY_RECORD>` and `<B_ONLY_RECORD>`. |
| **Expected Result** | Every tab shows only the active organisation's data. No record unique to the other school appears anywhere, and switching organisations does not carry search or filter results across. `[ASSUMED]` |
| **Remarks** | Added 2026-09-01 from the other team's TC_ORG_001, whose expected result ends "with no cross-org data leakage". `TST_SADB_TC_3` proves each organisation **loads** independently; it does not prove one cannot see the other's data. **Highest-severity gap of the entire comparison** — a leak here is a data-privacy incident, not a UI defect, which is why this is High priority despite sitting in a thinly covered area. Step 4 exists because carried-over query state is the most likely mechanism for a leak. |
| **Actual Result** | |
| **Status** | Blocked |
| **Comments / Defect ID** | Blocked at design time (skill rule 4): needs a multi-organisation admin fixture with records unique to each school, so that absence is provable rather than assumed. Unblock by provisioning two small schools under one admin with deliberately distinct data. NOTE: the multi-organisation area has no register of its own — if it grows beyond the SADB cases it should get one (see the 2026-09-01 handoff). |

---
## Open items / `[ASSUMED]` to confirm on the next live pass

1. **Admin-app Spanish rendering** (`TST_ASHL_TC_2`): **no admin Spanish copy has been verified.**
   Apply Español and capture verbatim the heading, footer links and role toggle, then add them to
   `appLangES.json` under a new admin section (it currently holds only `landing` and `login`).
   Also determine whether the choice **persists** across reload/logout and whether it is stored
   per-account server-side, as the class Filter and Search are (`admin-shared.md` §A4).
2. ~~**Notifications panel**~~ — **RESOLVED 2026-08-27.** The panel was opened manually and captured in
   full: heading, time groups, row structure, date formats, "See older notifications", and all three
   notification strings verbatim. `TST_INVI_TC_8` is now grounded, and `TC_9`–`TC_11` were added
   from what the capture revealed. **Still open within it:** the notifications **empty state** (this
   account has 92), whether five is a fixed cap or a page size, and where "See older notifications"
   leads.
3. ~~**My profile page**~~ — **RESOLVED 2026-08-27.** Page captured live: both tabs, all seven
   fields, buttons and qids. `TST_MYPR_TC_1`–`TC_8` written. **Still open within it:**
   every validation message (`TC_5`–`TC_7`) — nothing was submitted, because
   `<ADMIN_USER>` is the admin suite's own login. These need a **disposable account**.
   Also unknown: whether leaving with unsaved edits prompts or discards silently (`TC_4`).
4. ~~**Tab navigation**~~ — **RESOLVED 2026-08-27.** All five school tabs walked live; every URL,
   title and the active-state mechanism captured. `TST_ASHL_TC_5`–`TC_7` written.
5. **Help destinations** (`TST_ASHL_TC_3`, `TC_4`): labels are verified, but where "Help centre" and
   each of the five tutorial topics actually lead is not. Confirm whether they open in a new tab.
6. **Help-centre host is environment-specific** — Thor uses `cambridgeonehelptest.cambridge.org`.
   Confirm the QA/stage/prod hosts before replicating (`c1-environment-test-replicator`).
7. **Dropdown open/close behaviour** is `[ASSUMED]` throughout: every menu was read from the
   pre-rendered DOM, never opened. Confirm each opens and closes as expected.
8. **A dedicated, disposable SCHOOL is needed** (`TST_SKEY_TC_3`): changing a school key is
   **irreversible**, and `FCN-CHZ-PDA`'s key is hardcoded in `schoolAdminAddClassData.json`.
   Until such a school exists this case cannot run at all. Also unknown: whether existing members
   are affected by the change, and whether it is announced anywhere.
9. **A non-MQA admin account AND a definition of "MQA/CQA product"** (`TST_LIBR_TC_32`):
   `<ADMIN_USER>`'s home school *is* MQA Sierra School, and restriction is a licensing property
   rather than a naming convention. Two CQA-**titled** products are visible on a non-MQA school —
   check whether they are actually restricted once the definition exists.
10. **Does per-account persistence leak across organisations?** (`TST_SADB_TC_3`) The class
    Filter and Search persist server-side per user (§A4). Whether that is scoped per school or
    shared across orgs is untested, and a leak would be a real defect for a multi-org admin.
11. **Cancel / Esc / backdrop on the change-key dialog** (`TST_SKEY_TC_4`) — the safe half of the
    flow was never exercised, so even "Cancel leaves the key unchanged" is `[ASSUMED]`.
12. **Institution-request submission is untested** (`TST_SRQS_TC_2`): the wizard is automated
    step by step but nothing submits it, so the confirmation copy has never been seen. Blocked until
    it is agreed that Thor submissions are safe to raise.
13. **The wizard's disabled-Next behaviour** (`TST_SRQS_TC_3`) is inferred from the existing
    case titles, not observed. Confirm whether Next is natively disabled or **CSS-only** disabled
    (§B4) — the latter makes a naive enabled-state check a false green.
14. **The teacher-view class-creation journey** (`TST_SADB_TC_7`) is written but unrun, because
    it creates a real class. Confirm which school is safe to use, then capture the success dialog
    and measure how long the class takes to appear in the Admin Classes tab.
15. **Notification and dialog EMPTY states** remain unseen across the batch — the notifications panel
    (92 unread), and any "no results" state behind the pre-rendered dialogs.
16. ~~**Duplicate qid `cFooter-9`**~~ — **RESOLVED 2026-08-27.** Already known and worked around in
   `C1Selectors.json` via `[aria-label="FAQs"]` and an `insti-btn` class selector. Not a new defect.
17. ~~**`cFooter-4` / `cFooter-8` unused**~~ — **RESOLVED 2026-08-27.** `cFooter-4` is **Site Feedback**,
   present in the FOOT selector set but not rendered in the admin footer. Now `TST_FOOT_TC_10`.

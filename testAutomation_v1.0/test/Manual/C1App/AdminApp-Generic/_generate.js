/**
 * Generates BOTH the .md document and the .xlsx register for the AdminApp Generic (shell)
 * manual test-case set from _tcdata.js, so the two cannot drift (SKILL golden rule 6).
 *
 *   node _generate.js
 *
 * The .xlsx is then verifiable with:  npm run register -- dump <file>
 */

const fs = require("fs");
const path = require("path");
const ExcelJS = require("D:/testAutomation/QATestAutomation/testAutomation_v1.0/node_modules/exceljs");
const { TCS, REQS } = require("./_tcdata.js");

const BASE = "AdminApp_Generic_test_cases";
const DATE = "2026-08-27";

const COLUMNS = [
  "S.No.", "Test Case ID", "Title", "Linked Requirement", "Type", "Priority",
  "Preconditions", "Test Steps", "Test Data", "Expected Result", "Remarks",
  "Actual Result", "Status", "Comments / Defect ID",
];

const rows = TCS.map((tc, i) => ({
  sno: i + 1,
  id: tc.id,
  title: tc.title,
  req: tc.req,
  type: tc.type,
  priority: tc.priority,
  pre: tc.pre,
  steps: tc.steps,
  data: tc.data,
  expected: tc.expected,
  remarks: tc.remarks,
  actual: "",
  status: tc.status || "Not Run",
  comments: tc.comments || "",
}));

const counts = rows.reduce((a, r) => ((a[r.type] = (a[r.type] || 0) + 1), a), {});
const blocked = rows.filter((r) => r.status === "Blocked");
const notRun = rows.filter((r) => r.status === "Not Run");
const assumed = rows.filter((r) => /\[ASSUMED\]/.test(r.expected + r.remarks));

/* ------------------------------------------------------------------ Markdown */

function suffix(type) {
  return type === "Edge" ? " (E)" : type === "Negative" ? " (N)" : "";
}

const DEFERRED = {};

function coverageMap() {
  return REQS.map((req) => {
    const mine = rows.filter((r) => r.req === req);
    const order = { Positive: 0, Edge: 1, Negative: 2 };
    const sorted = [...mine].sort((a, b) => order[a.type] - order[b.type]);
    const cell = sorted.map((r) => r.id + suffix(r.type)).join(", ");
    return "| " + req + " | " + (cell || DEFERRED[req] || "none") + " |";
  }).join("\n");
}

function tcTable(r) {
  const cell = (v) => String(v).replace(/\n/g, "<br>").replace(/\|/g, "\\|");
  const pairs = [
    ["S.No.", r.sno], ["Test Case ID", r.id], ["Title", r.title],
    ["Linked Requirement", r.req], ["Type", r.type], ["Priority", r.priority],
    ["Preconditions", r.pre], ["Test Steps", r.steps], ["Test Data", r.data],
    ["Expected Result", r.expected], ["Remarks", r.remarks],
    ["Actual Result", "*(blank in design)*"],
    ["Status", r.status === "Blocked" ? "**Blocked**" : r.status],
    ["Comments / Defect ID", r.comments ? cell(r.comments) : "*(blank in design)*"],
  ];
  return "| Field | Value |\n|---|---|\n"
    + pairs.map(([k, v]) => "| **" + k + "** | " + cell(v) + " |").join("\n");
}

function testCaseSections() {
  let out = "";
  for (const req of REQS) {
    const mine = rows.filter((r) => r.req === req);
    if (!mine.length) continue;
    out += "\n### Requirement " + req + "\n\n";
    out += mine.map(tcTable).join("\n\n---\n\n");
    out += "\n\n---\n";
  }
  return out;
}

const md = `# Manual Functional Test Cases — Cambridge One Admin App: Generic (complete — Batches A–C)

**Source:** \`AdminApp_Generic.xlsx\` — 14 cross-cutting "Generic" scenarios for the school-admin app.
**Modules:** **new** — ASHL (\`adminShell.page.js\`) · MYPR (\`myProfile.page.js\`) · SKEY (\`changeSchoolKey.page.js\`)
· **extended** — INVI · FOOT · SADB · LIBR · SRQS (\`schoolRequestSummary.page.js\`)
**App:** Cambridge One Admin App (NEMO microservice) — \`micro-nemo.comprodls.com\` (Thor)
**Pages in scope:** the header and footer chrome · \`My school accounts\` · \`Manage profile\` · the school tab strip · School settings
**Generated:** ${DATE} | **Total TCs:** ${rows.length} (${counts.Positive || 0} Positive · ${counts.Edge || 0} Edge · ${counts.Negative || 0} Negative) — **all 14 source scenarios covered**; work already automated elsewhere is mapped, not re-written
**Execution status (${DATE}):** **0 of ${rows.length} TCs automated.** All ${notRun.length} are Not Run.${blocked.length ? " " + blocked.length + " Blocked at design time." : ""}

**Batches:** Batch A — shell chrome (#1, #2, #3, #7, #8, #11) · Batch B — school context (#4, #5, #10, #12) · Batch C — cross-app (#6, #9, #13, #14). **All three complete.**

> **Ordering:** test cases are **grouped by Linked Requirement (scenario)** so every requirement's
> TCs sit together; within each group they run **Positive → Edge → Negative**. (This intentionally
> departs from \`manual-test-standard.md\`'s global P→E→N ordering, per the established Admin App
> convention.) **S.No.** is sequential in this grouped order; **Test Case IDs** are stable
> identifiers and therefore appear out of numeric sequence within a group.
>
> **Scope (agreed):** Batch A — #1, #2, #3, #7, #8, #11 (shell chrome) · Batch B — #4, #5, #10, #12
> (school context) · Batch C — #6, #9, #13, #14 (cross-app). **All 14 source scenarios are covered;
> nothing is deferred.**
>
> Unverified expected text is marked \`[ASSUMED]\`; environment-specific values use
> \`<PLACEHOLDER>\` (see Remarks).

**⚠️ RE-SCOPED ${DATE} after an existing-coverage audit — read this first.**
The first draft of this batch **duplicated automation that already exists**. An audit of
\`C1TCRepository.json\`, the page objects and \`C1Selectors.json\` found four overlaps, and this
document was cut from 12 cases to ${rows.length} as a result. **What already exists is mapped, not
re-written:**

| Scenario | Already covered by | What this batch adds |
|---|---|---|
| #8 — footer link | **\`TST_FOOT_TC_1..9\`** (\`footer.test.js\`) — one case per footer page, plus a footer-data case | Only \`TST_FOOT_TC_10\`, pinning that the **admin** footer renders 7 links and omits Site Feedback |
| #3 — notifications | **\`TST_INVI_TC_1..6\`** (\`invitationNotification.page.js\`) — the invitation-accept flow through this same bell | \`TST_INVI_TC_7\` (badge/accessible-name agreement) and \`TST_INVI_TC_8\` (the general admin panel) |
| #1 — Spanish view | **\`TST_LAND_TC_4\`** — the language dropdown on the **landing** page; plus \`appLangEN.json\` / \`appLangES.json\` | The **admin-app** instance of the control, and admin-app Spanish rendering |
| #2 — My Profile | **\`appShell.page.js\`** carries \`userDrop_down\` / \`logout_btn\` | Nothing yet — not grounded, see below |

**Module codes reuse the existing page objects** wherever the markup is shared, so no re-mapping is
owed (golden rule 3). \`FOOT\` and \`INVI\` are **extended from their existing highest number**
(\`TST_FOOT_TC_10\`, \`TST_INVI_TC_7\`), never renumbered (golden rule 7). \`ASHL\` is genuinely new: the
admin header's Help menu (\`cHeader-hlp-*\`) and language control (\`sp-ldd-*\`) appear in **no**
existing selector set, and \`appShell.page.js\` is a different app's shell — its selectors are mostly
\`data-tid=*\`, not the NEMO admin's \`qid=*\`.

**⚠️ Grounding was PARTIAL — read this before trusting any \`[ASSUMED]\` row (${DATE}).**
In the capture session the app could be **read** but not **driven**: dropdowns did not open, school
cards did not route, and \`/myprofile\` redirected back to \`/admin/admin/dashboard\`. Everything marked
"grounded live" below was read from the **pre-rendered DOM** (\`admin-shared.md\` §A6), which is
reliable for labels, qids, hrefs and accessible names. It does **not** cover anything that only
exists after an interaction. Consequently:

- **RESOLVED later the same day.** The block was a **Playwright-MCP session** problem, not the app:
  \`browser_click\` was inert, but a JS-dispatched \`element.click()\` drives the app normally
  (Angular binds ordinary click listeners). Scenarios **#2 and #11 were then captured in full**,
  and the notifications panel with them. Everything below marked *grounded live* is verified.
- **\`TST_ASHL_TC_2\`** (Spanish rendering) and **\`TST_INVI_TC_8\`** (notifications panel) are written
  but every expected string in them is \`[ASSUMED]\`. **No admin-app Spanish copy has been verified.**
- The notifications panel is **not pre-rendered** (built lazily by tippy.js), so unlike every other
  admin dialog its copy could **not** be captured for free.

**Corrections to the first draft (${DATE}).** Two claims in the withdrawn version were wrong and are
recorded here so they are not repeated:

1. The duplicated qid \`cFooter-9\` (shared by *FAQs* and *Cambridge One for schools*) was written up
   as an undiscovered defect. **It is already known and worked around** — \`C1Selectors.json\` reads
   \`a[qid="cFooter-9"][aria-label="FAQs"]\` and selects *Cambridge One for schools* by class instead.
   The withdrawn negative case has been dropped.
2. \`cFooter-4\` and \`cFooter-8\` were called unused. **\`cFooter-4\` is Site Feedback**
   (\`footerSiteFeedback\` in the FOOT selector set) — it is simply **absent from the admin footer**.
   That absence is the real finding and is now \`TST_FOOT_TC_10\`.

**⚠️ Two cases are BLOCKED at design time (${DATE})** — written, but they must not be run as things
stand (golden rule 4):

- **\`TST_SKEY_TC_3\`** (change the school key) is **irreversible** — the product's own warning
  reads *"Changing the school key cannot be undone"*. \`FCN-CHZ-PDA\` is the primary shared
  school and its key is hardcoded in \`schoolAdminAddClassData.json\`, so running this would break
  **every** admin suite at once. **Unblock:** a dedicated, disposable school.
- **\`TST_LIBR_TC_32\`** (MQA/CQA product visibility) is blocked **twice over**: no non-MQA admin
  account exists (\`<ADMIN_USER>\`'s own home school *is* MQA Sierra School), **and** the product
  team has not defined what technically marks a product as MQA/CQA-restricted. **Unblock:** both.
- **\`TST_SRQS_TC_2\`** (submit an institution request) raises a **real request into a human
  queue**, not withdrawable from the UI. **Unblock:** confirmation that Thor submissions are safe
  and swept, or an agreed test-only school-name prefix.

Their expected copy is nonetheless **verified** where it could be — \`TST_SKEY_TC_2\`'s warning
dialog was captured word-for-word from the pre-rendered DOM without ever triggering it (§A6).

**⚠️ Cases that create real data — TWO, both in Batch C.** Everything in Batches A and B is
read-only; these two are not, and that decides suite placement (golden rule: data-creating cases
never share a suite with side-effect-free ones):

- **\`TST_SADB_TC_7\`** creates a **real class** on a real school. Use the sweepable
  \`AutoClass_\` prefix (§A7). Class delete is **soft**, so every run leaves a permanent
  soft-deleted row (§A5).
- **\`TST_SRQS_TC_2\`** raises a **real institution request** outside the test estate — Blocked
  above for that reason.

Everything else is read-only. \`TST_ASHL_TC_2\` changes the
account's language and must switch it back (step 5). This decides suite placement when automated.

---

## Requirement → Test Case coverage map

| Linked Requirement (scenario) | Mapped TC IDs (P → E → N) |
|---|---|
${coverageMap()}

**Existing coverage is not repeated here.** Scenarios #1, #3 and #8 are *also* served by
\`TST_LAND_TC_4\`, \`TST_INVI_TC_1..6\` and \`TST_FOOT_TC_1..9\` respectively — see the re-scope table
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

## Product reference — Batch A (captured live ${DATE}, Thor · \`testt1@mailsac.com\`)

> Read from the pre-rendered DOM. Labels, qids, hrefs and accessible names are **verified**;
> anything requiring an interaction is **not** — see the grounding warning above.

### Admin header chrome (all pre-rendered)

| Control | qid | id | Already in a selector set? |
|---|---|---|---|
| Home logo | \`aHeader-2\` | — | no |
| Help dropdown | \`cHeader-hlp-2\` | \`hdr-help-dd\` | **no — new** |
| ↳ Help centre | \`cHeader-hlp-3\` | — | **no — new** |
| ↳ Tutorials | \`cHeader-hlp-5\` | \`dropdownMenuButtonUserTutorials\` | **no — new** |
| ↳ Tutorial topics (**5**) | \`cHeader-hlp-6\` | — | **no — new**; ⚠️ all five share one qid |
| Notifications | \`ntf-1\` | \`tippyDropdownMenuButton\` | **yes** — \`invitationNotification.notificationBtn\` |
| Profile menu | \`aHeader-3\` | \`dropdownMenuLinkHeader\` | partly — \`appShell.userDrop_down\` is \`cHeader-2\` |
| ↳ My profile | \`aHeader-6\` | — | no |
| ↳ Log out | \`aHeader-7\` | — | partly — \`appShell.logout_btn\` is \`cHeader-7\` |

**Tutorial topics (verbatim, 5):** \`Understanding codes and keys\` · \`Activating course materials\` ·
\`Creating a class\` · \`Adding students to a class\` · \`Creating assignments\`

### Footer — the admin app renders 7 of the 8 known links

| Text | qid | In admin footer? | Notes |
|---|---|---|---|
| Terms of use | \`cFooter-1\` | yes | |
| Privacy notice | \`cFooter-2\` | yes | |
| Accessibility | \`cFooter-3\` | yes | |
| **Site Feedback** | \`cFooter-4\` | **NO** | in the FOOT selector set; **absent here** — \`TST_FOOT_TC_10\` |
| Our approach | \`cFooter-5\` | yes | only link keeping a real external href + \`target=_blank\` |
| Help | \`cFooter-6\` | yes | |
| FAQs | \`cFooter-9\` | yes | shares its qid — FOOT disambiguates by \`[aria-label="FAQs"]\` |
| Cambridge One for schools | \`cFooter-9\` | yes | FOOT selects it by \`a[class*="insti-btn"]\` instead |
| Site language | \`cFooter-7\` | yes | |

Copyright line: \`© Cambridge University Press & Assessment 2026\` (year is dynamic).

**Footer hrefs differ by authentication state.** Logged out they are real routes (\`/terms\`,
\`/privacy\`, \`/accessibility\`, \`/institution-request\`); logged in every internal one collapses to
\`javascript:void(0);\` and navigation becomes JS-driven. **Asserting \`href\` on the logged-in footer
is a false green** — assert the resulting URL. \`TST_FOOT_TC_1..9\` already assert page launches, so
they are unaffected; this matters for anything new written against the footer.

### Site language control

- Trigger \`qid="sp-ldd-cntr"\`, accessible name \`Site language, English\`, visible text \`English\`.
- Exactly **two** options: \`English\` (\`sp-ldd-btn-en\`) and \`Español\` (\`sp-ldd-btn-es\`).
- The active option carries the CSS class **\`selected-item\`** — the reliable selection check.
- The control sits in the **header** when logged out and in the **footer** when logged in.
- \`appLangES.json\` exists but holds only \`landing\` and \`login\` sections — **no admin-app or footer
  Spanish strings exist yet**. Captured strings should be added there, matching \`appLangEN.json\`.

### Notifications — panel captured live ${DATE}

Bell \`ntf-1\` / \`#tippyDropdownMenuButton\`; badge **92**; accessible name
\`Notifications (92 unread notifications)\` — badge and accessible name mirror each other.

Already targeted by \`invitationNotification.page.js\` as \`notificationBtn\`, whose TCs cover the
**invitation-accept** flow — **not** this panel.

⚠️ **The panel is NOT pre-rendered.** Built lazily by tippy.js; nothing exists in the DOM until the
bell is clicked. This is the one admin dialog the free-capture trick (§A6) does **not** work on.

| Part | Selector | Detail |
|---|---|---|
| Panel | \`.notification-dropdown\` / \`.tippy-content\` | anchored to the bell |
| Heading | \`.notification-heading h2\` | \`Notifications (92)\` — count in \`span.readCount\`, matches the badge |
| Close | \`[qid="ntf-2"]\` | ⚠️ **two visible elements share this qid** — \`.close\` and \`.close-dummy\` |
| Time group | \`p.time-related-title\` | \`Last Seven days\` · \`Older\` |
| Row | \`button.tippy-dropdown-item\` | qids \`ntf-30\`…\`ntf-34\` — **positional, based at 30** |
| Footer link | \`a[qid="ntf-4"]\` | \`See older notifications\`, href \`javascript:void(0);\` |

**Only 5 rows render against a heading of 92**, and the body does not scroll — the rest are reached
only via *See older notifications*. **There is no mark-as-read control anywhere in the panel.**

**Date format depends on the time group:** relative under *Last Seven days* (\`5 days ago\`),
absolute under *Older* (\`Mon, 17 Aug, 2026\` — \`Ddd, DD Mmm, YYYY\`).

**Notification copy, verbatim:**

| Title | Body |
|---|---|
| \`Your Class summary report is ready\` | \`View your report, available to download in the Reports tab\` |
| \`Your Aggregated data report is ready\` | \`View your report, available to download on the Reports page\` |
| \`Class summary report generation failure\` | \`Sorry, something went wrong. The Class summary report you requested failed to generate. Details available in the Reports tab\` |

⚠️ Note **"Reports tab" vs "Reports page"** across the two ready-notifications — a copy
inconsistency, pinned by \`TST_INVI_TC_11\`.

**The empty state was NOT seen** (this account has 92) — still \`[ASSUMED]\`.

### School tab navigation — captured live ${DATE}

Opening a school card lands on **CLASSES** by default. Five tabs, rendered upper case, each with a
**real href** (unlike the footer):

| Tab | qid | URL suffix | Browser title |
|---|---|---|---|
| CLASSES | \`aDetail-1\` | \`/class\` | \`Classes | Cambridge One\` |
| STUDENTS | \`aDetail-2\` | \`/learner\` | \`Students | Cambridge One\` |
| STAFF | \`aDetail-4\` | \`/staff\` | \`Staff | Cambridge One\` |
| LIBRARY | \`aDetail-5\` | \`/library\` | \`Library | Cambridge One\` |
| REPORTS | \`aDetail-6\` | \`/reports\` | \`Reports | Cambridge One\` |

Full path: \`/admin/admin/org_<slug>/<suffix>\`. The school heading persists across all five.

**Three traps:**

1. ⚠️ **\`aDetail-3\` is skipped** — the sequence is 1, 2, 4, 5, 6. Never iterate \`1..5\`.
2. ⚠️ **STUDENTS routes to \`/learner\`**, not \`/student\`. A URL built from the tab label fails.
3. ⚠️ **The active marker is on the parent \`<li>\`** — \`li.nav-item.active > a\`. Every tab
   anchor has an identical className whether active or not, so asserting on the link class is a
   guaranteed false green.

**No \`aria-current\` or \`aria-selected\` on any tab** — the active state is presentational only.
The same gap exists on the My Profile tabs, and there it is worse: those have no indicator at all.

**Timing measured this session:** Reports ~4.3 s to become active, Classes ~1.2 s. Poll for the
expected qid under \`li.nav-item.active\` rather than using a fixed pause (§B8).

### My profile / Manage profile — captured live ${DATE}

**URL \`/dashboard/my-profile\` — NOT under \`/admin/\`.** This is the shared Cambridge One
profile page, so changes here affect teachers and students too, and it is reachable from the
header profile menu (\`aHeader-3\` → \`aHeader-6\`).

⚠️ **Three names for one page:** menu *My profile* · tab title *My profile | Cambridge One* ·
heading ***Manage profile***. Assert the heading.

Two tabs, \`c-mp-tab-1\` *Personal info* and \`c-mp-tab-2\` *Password*. The **URL does not
change between them**, so the Password tab cannot be deep-linked.

| Tab | Field | qid | Gigya name |
|---|---|---|---|
| Personal info | First name | \`c-mp-inpt-1\` | \`profile.firstName\` |
| Personal info | Last name | \`c-mp-inpt-2\` | \`profile.lastName\` |
| Personal info | Email | \`c-mp-inpt-3\` | \`profile.email\` |
| Personal info | Location | \`c-mp-inpt-4\` | \`profile.country\` |
| Password | Old password | \`c-mp-inpt-5\` | \`password\` |
| Password | New password | \`c-mp-inpt-6\` | \`newPassword\` |
| Password | Confirm new password | \`c-mp-inpt-7\` | \`passwordRetype\` |

Buttons: **Update** (\`c-mp-btn-3\` personal / \`c-mp-btn-5\` password) ·
**Cancel** (\`c-mp-btn-4\`) · **Back** (\`c-mp-btn-1\`).

**Three findings:**

1. ⚠️ **No field declares \`maxlength\`, and none is \`required\`** — all seven. This is the
   opposite of the rest of the admin app (class name 50, grading scale title 20). Boundary cases
   **cannot be derived from the markup** here and must be found by submitting.
2. ⚠️ **No password rules are displayed.** The equivalent page in the other app has a dedicated
   \`newPasswordRules_text\` element (\`SETT\` selector set); this page shows nothing. A user
   gets no guidance until submission fails.
3. ⚠️ **\`Location\` has three identities** — label *Location*, name \`profile.country\`,
   id \`gigya-textbox-zip\`. It behaves as a country. Select by qid; do not trust the id.

**No \`c-mp-*\` selector exists in \`C1Selectors.json\` yet** — this page is genuinely new to the
framework. The \`SETT\` module (36 TCs, \`settings.test.js\`) is the **same concept in a
different app** (\`data-tid\` selectors) — model the test design on it, but do not assume the
copy or behaviour matches.

### My school accounts — 7 schools on this account

Card \`a.inst-link\` \`qid="aDashboard-N"\` (**positional**, 1-based); the chevron is a separate
\`qid="aDashboard1-N"\`. **The school key is carried in the card's \`aria-label\`.**

| # | School | Key |
|---|---|---|
| 1 | 3 July Test School 1 | \`FCN-CHZ-PDA\` |
| 2 | 3 July Test School 1 | \`ZPB-TWP-AEQ\` |
| 3 | 3 July Test School 2 | \`KNF-XRD-QVE\` |
| 4 | MQA Sierra School | \`MQA-ABC-DEF\` |
| 5 | Perf Test School 3 | \`HQC-ZWM-ZVF\` |
| 6 | Perf Test School 4 | \`ACJ-DXL-JKR\` |
| 7 | Perf Test School 5 | \`GYB-JMU-KYA\` |

Cards 1 and 2 **share a display name** — confirming \`admin-shared.md\`'s rule to select by key, never
by name or position. Each card shows its key in a bordered field with a **\`Copy\`** button. The page
heading is \`My school accounts\` and card indices are zero-padded (\`01\`…\`07\`).

> **This extends \`admin-shared.md\` §0**, which documents four schools. Three keys here are
> undocumented: \`KNF-XRD-QVE\`, \`HQC-ZWM-ZVF\`, \`GYB-JMU-KYA\`. Directly useful to Batch B.

### Administrator / Teacher role toggle (captured free — Batch C, #13)

\`\`\`html
<input id="teacher-admin-toggle" qid="teacher-admin-toggle" type="checkbox" aria-hidden="true" tabindex="-1">
<div tabindex="0" class="can-toggle__switch"
     aria-label="Administrator/Teacher toggle: Administrator currently active, activate to view Teacher dashboard">
\`\`\`

The **\`aria-label\` states both the current role and the action**, making it a clean assertion target.
The \`<input>\` is \`aria-hidden\`/\`tabindex=-1\`; the focusable control is the inner
\`div.can-toggle__switch\`. Rendered as a pill at the top-right of the content area.

### Login page and deep linking

- The real login form is \`#gigya-login-form\`. The Gigya screen-set injects **~15 hidden forms**
  carrying duplicate \`username\`, \`password\`, \`email\` and \`profile.*\` inputs, so an unscoped
  \`input[name=password]\` matches several — **scope every login selector to \`#gigya-login-form\`.**
  Same trap \`admin-shared.md\` §B2 records for Manage learner profile.
- \`/myprofile\` **redirected to \`/admin/admin/dashboard\`**, consistent with \`admin-shared.md\` §A1 —
  admin routes are not reachable by deep link; context must be set by clicking through.
- Page \`<title>\` is **not stable across load paths**: \`My school accounts | Cambridge One\` after
  in-app navigation, \`Administrator | Cambridge One\` on a fresh \`goto\`.

---

## Product reference — Batch B (captured live ${DATE}, Thor · \`testt1@mailsac.com\`)

### School settings menu — three items, not two

Reached from **School settings** (\`adEdit-1\`) on the Classes tab:

| Item | qid |
|---|---|
| Change school key | \`adEdit-2\` |
| Manage grading categories | \`adEdit-7\` |
| Manage grading scales | \`adEdit-8\` |

> ⚠️ **Corrects \`admin-shared.md\` §A1**, which lists only the two grading entries.
> **Change school key is a third, previously undocumented item.**

The qid numbering is **not contiguous** (2, 7, 8) — \`adEdit-3\` and \`adEdit-4\` are the
confirmation-dialog buttons, not menu items. Never iterate the family.

### Change school key — warning dialog (captured WITHOUT triggering it)

Read from the pre-rendered DOM per §A6 — the only safe way to verify this copy on a shared school:

> ⚠ **CAREFUL!**
> **Changing the school key cannot be undone**
> This action is recommended only if your current school key has been compromised

Controls: **Continue** (\`adEdit-3\`) · **Cancel** (\`adEdit-4\`). Warning-triangle icon
(\`i.fa-exclamation-triangle\`) above the heading.

**"Cannot be undone" is the operative fact.** \`FCN-CHZ-PDA\` is the primary shared school and its
key is hardcoded as \`schoolKey\` in \`schoolAdminAddClassData.json\` — changing it breaks every
admin suite simultaneously. \`TST_SKEY_TC_3\` is **Blocked** for this reason.

School key format, consistent across all 7 schools: **three uppercase triplets**, \`XXX-XXX-XXX\`.
On the dashboard the key is **display text** (\`span.school-code\`) with a **Copy** button beside
it — **not an editable field**. The only input on the dashboard is the role toggle.

### Library — MQA / CQA product visibility

Observed on **3 July Test School 1** (\`FCN-CHZ-PDA\`), a **non-MQA** school, heading
\`Library (971)\`:

| Pattern in title | Count | Examples |
|---|---|---|
| Contains \`CQA\` | **2** | \`CQA - 7 Jan 2021 - Test Umbrella product\` · \`Teacher Training - CQA Test Product\` |
| Begins \`NON MQA\` | 3 | \`NON MQA UB for eBook 2\` · \`NON MQA Umbrella for Free Trial\` |
| MQA-only (by title) | 0 | — |

> **This is an observation, not a defect claim.** A title containing *CQA* does not prove the
> product is CQA-**restricted** — restriction is a licensing property, not a naming convention.
> It is recorded because it is the concrete thing to check once the product team defines what
> marks a product as MQA/CQA-gated. If those two products *are* restricted, this is a live leak;
> if they are merely named that way, \`TST_LIBR_TC_32\` needs different test data.

Product rows are \`aLibrary-*\` (974 elements for 971 products — the family includes non-row
controls, so do not equate the two).

### Organisations and slugs

The org slug is **not derivable** from the school name or key:

| School | Key | Org slug |
|---|---|---|
| 3 July Test School 1 | \`FCN-CHZ-PDA\` | \`org_perf_testschool_1\` |

Capture each slug; never construct it. School context must be set by **clicking the card** — deep
links return \`/dashboard/error\` even when authenticated (§A1).

**Open question worth testing:** the class Filter and Search persist **server-side per user account**
(§A4). Whether that persistence is scoped **per school** or leaks **across organisations** is unknown,
and a leak would be a real defect for a multi-org admin. Noted on \`TST_SADB_TC_3\`.

---

---

## Product reference — Batch C (captured live ${DATE}, Thor · \`testt1@mailsac.com\`)

### Teacher view — reached by the role toggle

| | Administrator view | Teacher view |
|---|---|---|
| URL | \`/admin/admin/dashboard\` | \`/dashboard/teacher/dashboard\` |
| Title | \`My school accounts | Cambridge One\` | \`Teacher dashboard | Cambridge One\` |
| Heading | \`My school accounts\` | \`Hi <FIRST_NAME>!\` |
| Input \`checked\` | \`false\` | \`true\` |
| Switch class | \`.can-toggle__switch\` | \`.can-toggle-switch\` |

> ⚠️ **The switch element is named differently in each view** — double underscore in admin, single
> hyphen in teacher. A selector written for one **silently fails** in the other, which breaks the
> round trip precisely. Use \`#teacher-admin-toggle\` (stable in both) and read its \`checked\`
> state. The focusable control is the inner \`[tabindex="0"]\` div; the input is \`aria-hidden\`.

The \`aria-label\` states both current role and action, and flips correctly:
*"Administrator/Teacher toggle: Administrator currently active, activate to view Teacher dashboard"*
↔ *"…Teacher currently active, activate to view Administrator dashboard"*.

The toggle also appears on **inner admin tabs**, not only the dashboard.

### The two views show DIFFERENT school estates

| View | Count | Contains |
|---|---|---|
| Administrator | 7 | schools the user **administers** |
| Teacher | 8 groups | schools the user **teaches at** — incl. \`ABERYSTWYTH COLLEGE : THOR\` and \`LTI INTEGRATIONS TEST2\`, **absent** from the admin list |

> ⚠️ Do not assume the toggle shows the same estate on both sides. Also, the teacher view groups by
> **display name**, so the two distinct schools both called *3 July Test School 1* (\`FCN-CHZ-PDA\` / \`ZPB-TWP-AEQ\`) **collapse into one group** there. Never match schools
> across the two views by name.

⚠️ **All 7 \`Create class\` buttons share qid \`tDashboard-ncls-btn-1\`** — one per school group.
The qid cannot tell them apart, so the button must be found **through its school-group heading** or a
class lands on the wrong school. This is the crux of \`TST_SADB_TC_7\`.

### Dialog inventory — what is pre-rendered on each admin tab

| Tab | \`.modal-content\` present | All hidden on load? |
|---|---|---|
| Classes | 5 | ✅ |
| Students | 4 | ✅ |
| Staff | 1 | ✅ |

**The change-school-key dialog is present on EVERY tab** — it ships with the shared page chrome, so
it inflates every tab's count by one and will match an unscoped modal selector anywhere. Scope modal
selectors with \`:has(...)\` to the specific dialog.

**Verbatim copy captured without triggering anything (§A6):**

| Dialog | Copy |
|---|---|
| Class delete | \`WARNING!\` · *There might be students, teachers and course materials in the selected classes* · *Are you sure you want to delete?* · \`No, cancel\` |
| Class delete — async | *This will take a few minutes* · *Deleted classes may show on dashboards for a few minutes before they are removed* |
| Class 50-cap | *You can only delete 50 classes at one time* · *Please uncheck some classes to continue* |
| Student removal | *I confirm that I want to remove students from my school account* · \`Cancel\` · \`Request to remove\` |
| Student 50-cap | *You can only remove 50 students at one time* · *Please uncheck some students to continue* |
| Student removal — async | *Removing students may take some time* |
| Change school key | \`CAREFUL!\` · *Changing the school key cannot be undone* |

The 50-cap warnings share a **two-line pattern** differing only in the verb — *delete* for classes,
*remove* for students. The limit (50) and sentence shape are the consistent parts; the verb is not.

### Institution request — already covered end to end, except submission

| Step | Existing module |
|---|---|
| Launch from footer | \`TST_FOOT_TC_7\` |
| Entry CTA | \`TST_DINS_TC_1\` |
| 1 Intro · 2 Type · 3 Teachers · 4 Name · 5 Location · 6 Address · 7 Contact | \`SUSA\` · \`SCTY\` · \`NTCH\` · \`SNAM\` · \`SLOC\` · \`SADR\` · \`SCON\` |
| 8 Summary loads | \`TST_SRQS_TC_1\` |
| **Submission + confirmation** | **nothing — \`TST_SRQS_TC_2\` fills this gap** |

Every existing step case asserts only the **enabling** direction ("select X to *enable* Next"); the
disabled half is nowhere asserted, which is \`TST_SRQS_TC_3\`. Check whether Next is natively
disabled or **CSS-only** disabled (§B4) before writing that assertion.

---
## Section — Test Cases (grouped by Linked Requirement)
${testCaseSections()}
---

## Open items / \`[ASSUMED]\` to confirm on the next live pass

1. **Admin-app Spanish rendering** (\`TST_ASHL_TC_2\`): **no admin Spanish copy has been verified.**
   Apply Español and capture verbatim the heading, footer links and role toggle, then add them to
   \`appLangES.json\` under a new admin section (it currently holds only \`landing\` and \`login\`).
   Also determine whether the choice **persists** across reload/logout and whether it is stored
   per-account server-side, as the class Filter and Search are (\`admin-shared.md\` §A4).
2. ~~**Notifications panel**~~ — **RESOLVED ${DATE}.** The panel was opened manually and captured in
   full: heading, time groups, row structure, date formats, "See older notifications", and all three
   notification strings verbatim. \`TST_INVI_TC_8\` is now grounded, and \`TC_9\`–\`TC_11\` were added
   from what the capture revealed. **Still open within it:** the notifications **empty state** (this
   account has 92), whether five is a fixed cap or a page size, and where "See older notifications"
   leads.
3. ~~**My profile page**~~ — **RESOLVED ${DATE}.** Page captured live: both tabs, all seven
   fields, buttons and qids. \`TST_MYPR_TC_1\`–\`TC_8\` written. **Still open within it:**
   every validation message (\`TC_5\`–\`TC_7\`) — nothing was submitted, because
   \`<ADMIN_USER>\` is the admin suite's own login. These need a **disposable account**.
   Also unknown: whether leaving with unsaved edits prompts or discards silently (\`TC_4\`).
4. ~~**Tab navigation**~~ — **RESOLVED ${DATE}.** All five school tabs walked live; every URL,
   title and the active-state mechanism captured. \`TST_ASHL_TC_5\`–\`TC_7\` written.
5. **Help destinations** (\`TST_ASHL_TC_3\`, \`TC_4\`): labels are verified, but where "Help centre" and
   each of the five tutorial topics actually lead is not. Confirm whether they open in a new tab.
6. **Help-centre host is environment-specific** — Thor uses \`cambridgeonehelptest.cambridge.org\`.
   Confirm the QA/stage/prod hosts before replicating (\`c1-environment-test-replicator\`).
7. **Dropdown open/close behaviour** is \`[ASSUMED]\` throughout: every menu was read from the
   pre-rendered DOM, never opened. Confirm each opens and closes as expected.
8. **A dedicated, disposable SCHOOL is needed** (\`TST_SKEY_TC_3\`): changing a school key is
   **irreversible**, and \`FCN-CHZ-PDA\`'s key is hardcoded in \`schoolAdminAddClassData.json\`.
   Until such a school exists this case cannot run at all. Also unknown: whether existing members
   are affected by the change, and whether it is announced anywhere.
9. **A non-MQA admin account AND a definition of "MQA/CQA product"** (\`TST_LIBR_TC_32\`):
   \`<ADMIN_USER>\`'s home school *is* MQA Sierra School, and restriction is a licensing property
   rather than a naming convention. Two CQA-**titled** products are visible on a non-MQA school —
   check whether they are actually restricted once the definition exists.
10. **Does per-account persistence leak across organisations?** (\`TST_SADB_TC_3\`) The class
    Filter and Search persist server-side per user (§A4). Whether that is scoped per school or
    shared across orgs is untested, and a leak would be a real defect for a multi-org admin.
11. **Cancel / Esc / backdrop on the change-key dialog** (\`TST_SKEY_TC_4\`) — the safe half of the
    flow was never exercised, so even "Cancel leaves the key unchanged" is \`[ASSUMED]\`.
12. **Institution-request submission is untested** (\`TST_SRQS_TC_2\`): the wizard is automated
    step by step but nothing submits it, so the confirmation copy has never been seen. Blocked until
    it is agreed that Thor submissions are safe to raise.
13. **The wizard's disabled-Next behaviour** (\`TST_SRQS_TC_3\`) is inferred from the existing
    case titles, not observed. Confirm whether Next is natively disabled or **CSS-only** disabled
    (§B4) — the latter makes a naive enabled-state check a false green.
14. **The teacher-view class-creation journey** (\`TST_SADB_TC_7\`) is written but unrun, because
    it creates a real class. Confirm which school is safe to use, then capture the success dialog
    and measure how long the class takes to appear in the Admin Classes tab.
15. **Notification and dialog EMPTY states** remain unseen across the batch — the notifications panel
    (92 unread), and any "no results" state behind the pre-rendered dialogs.
16. ~~**Duplicate qid \`cFooter-9\`**~~ — **RESOLVED ${DATE}.** Already known and worked around in
   \`C1Selectors.json\` via \`[aria-label="FAQs"]\` and an \`insti-btn\` class selector. Not a new defect.
17. ~~**\`cFooter-4\` / \`cFooter-8\` unused**~~ — **RESOLVED ${DATE}.** \`cFooter-4\` is **Site Feedback**,
   present in the FOOT selector set but not rendered in the admin footer. Now \`TST_FOOT_TC_10\`.
`;

/* ------------------------------------------------------------------- Emit */

fs.writeFileSync(path.join(__dirname, BASE + ".md"), md, "utf8");

(async () => {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("Test Cases");

  ws.addRow(COLUMNS);
  const header = ws.getRow(1);
  header.font = { bold: true, color: { argb: "FFFFFFFF" } };
  header.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF3D1A66" } };
  header.alignment = { vertical: "middle" };
  ws.views = [{ state: "frozen", ySplit: 1 }];

  for (const r of rows) {
    ws.addRow([
      r.sno, r.id, r.title, r.req, r.type, r.priority, r.pre, r.steps,
      r.data, r.expected, r.remarks, r.actual, r.status, r.comments,
    ]);
  }

  const widths = [7, 18, 58, 40, 10, 10, 46, 60, 30, 66, 74, 16, 12, 26];
  widths.forEach((w, i) => (ws.getColumn(i + 1).width = w));
  ws.eachRow((row, n) => {
    if (n > 1) row.alignment = { vertical: "top", wrapText: true };
  });

  await wb.xlsx.writeFile(path.join(__dirname, BASE + ".xlsx"));

  console.log("Wrote " + BASE + ".md and " + BASE + ".xlsx");
  console.log("  TCs: " + rows.length
    + "  (Positive " + (counts.Positive || 0)
    + " · Edge " + (counts.Edge || 0)
    + " · Negative " + (counts.Negative || 0) + ")");
  console.log("  Status: Not Run " + notRun.length + " · Blocked " + blocked.length);
  console.log("  Rows carrying [ASSUMED]: " + assumed.length
    + " (" + assumed.map((a) => a.id).join(", ") + ")");
  console.log("  Requirements with no TC: "
    + REQS.filter((q) => !rows.some((r) => r.req === q)).join(" · "));
})();

# Admin App — Generic / shell (school-admin)

> Per-screen knowledge for the Admin App **shell and cross-cutting screens**: header, footer,
> language switcher, notifications, My profile, Change school key, organisations, MQA/CQA
> visibility, the teacher view / role toggle, and the setup-school wizard.
> Modules `ASHL` · `FOOT` · `MYPR` · `SADB` · `SRQS` · `SKEY` · `INVI` (suite `adminGenericTest_thor`).
>
> Read **with** `admin-shared.md` — everything true of *every* admin screen lives there and is not
> repeated here.
>
> **Living document.** Append, never overwrite. Mark anything not confirmed live `[ASSUMED]`.
> Date significant updates `[YYYY-MM-DD]`.
>
> **Split out of `admin-shared.md` [2026-09-18]** (ADR-020) as a pure move — section numbers
> (§A9–§A11) are kept so existing references still resolve; the §A12 live-pass corrections were
> then folded into those sections as dated corrections.

---

## A9 / B11. Shell chrome — header, footer, language, notifications `[2026-08-27]`

*Captured live on Thor (`testt1@mailsac.com`, My school accounts) while designing the Generic/shell
manual batch (`test/Manual/C1App/AdminApp-Generic/`, modules `ASHL` / `FOOT` / `INVI` / `APRF`). The chrome
below is **persistent on every admin screen**, which is why it lives here rather than in a
per-screen file.*

> **Driving the app through Playwright MCP** `[2026-08-27]`**.** In this session
> `browser_click` was **inert** on this app — the click landed on the correct element and was
> reported as successful, but Angular never reacted, so no dropdown opened and no route changed.
> **A JS-dispatched `element.click()` via `browser_evaluate` works normally**, because Angular
> binds ordinary click listeners. Use that when synthetic clicks appear to do nothing, and **poll
> for the resulting state change** rather than pausing — the tab strip took 1.2–4.3 s to settle.
>
> **Update `[2026-09-14]`:** the MCP browser's **real input then died globally** — a real click on
> a plain `h1` delivered zero trusted events, while JS `.click()` worked (§B11's stale-MCP issue).
> No product behaviour in this file was inferred from an inert real click; where only a synthetic
> click was possible, the result is marked unverified.

### Header controls (all pre-rendered, §B2 applies)

| Control | qid | id |
|---|---|---|
| Home logo | `aHeader-2` | — |
| Help dropdown | `cHeader-hlp-2` | `hdr-help-dd` |
| ↳ Help centre | `cHeader-hlp-3` | — |
| ↳ Tutorials | `cHeader-hlp-5` | `dropdownMenuButtonUserTutorials` |
| ↳ Tutorial topics (5) | `cHeader-hlp-6` | — |
| Notifications | `ntf-1` | `tippyDropdownMenuButton` |
| Profile menu | `aHeader-3` | `dropdownMenuLinkHeader` |
| ↳ My profile | `aHeader-6` | — |
| ↳ Log out | `aHeader-7` | — (a `<button>`) |

### ⚠️ NEW TRAP — footer hrefs change with authentication state

Logged **out**, footer links carry real routes (`/terms`, `/privacy`, `/accessibility`,
`/institution-request`). Logged **in**, every internal one collapses to `javascript:void(0);` and
navigation becomes JS-driven.

**Asserting `href` on the logged-in footer is a guaranteed false green** — it passes whatever the
link actually does. Assert the resulting URL instead. This is the same failure shape as the
`getElementCount(x) > 0` trap in §B2, in a different disguise.

`Our approach` is the only footer link keeping a real external href
(`http://www.cambridge.org/english`, `target="_blank"`) in **both** states.

**Destination map `[2026-09-14]`:** Terms `/terms`, Privacy `/privacy`, Accessibility
`/accessibility`, *Cambridge One for schools* `/institution-request`, and **FAQs and Help → the same
external help-centre URL** (a *helptest* host on Thor — environment-specific). All internal
destinations render with no 404. The public pages share one generic title — assert the path and the h1.

⚠️ **"Our approach" uses `rel="nopener"` — misspelt** (should be `noopener`), with `target=_blank`
over plain `http://`, so the opened tab keeps a live `window.opener`. A minor security-hygiene
defect, recorded, not yet raised. `[2026-09-14]`

### `cFooter-9` is a duplicated qid — already known and worked around

**`FAQs` and `Cambridge One for schools` both carry `qid="cFooter-9"`**, so a bare qid selector
resolves two different links.

> **Correction `[2026-08-27]`.** This was first written up here as a newly-found defect. **It is
> not new** — `C1Selectors.json` already disambiguates it, and has for some time:
>
> ```
> "footerFAQs": "a[qid=\"cFooter-9\"][aria-label=\"FAQs\"]",
> "footerCambridgeOneSchool": "a[class*=\"insti-btn\"]"
> ```
>
> Follow that existing pattern rather than raising it again.

⚠️ **A second, genuinely unhandled instance of the same shape:** the five Help-menu tutorial topics
all share `qid="cHeader-hlp-6"`. Address them by text or index.

Add to §B3's family: like `t-prd-cmp-cntr-1` and `aClass-99`, **qid is not reliably unique** on
admin screens.

### The admin footer renders 7 of the 8 known links

`cFooter-4` is **Site Feedback** (`footerSiteFeedback` in the FOOT selector set) and ~~`cFooter-8` is
unused~~ **`cFooter-8` is the language-option family** (`cFooter-8-0` English, `cFooter-8-1` Español —
see *Site language* below) `[corrected 2026-09-14]`. The C1 footer therefore carries eight links, but **the ADMIN footer renders only seven —
Site Feedback is absent.**

> **Correction `[2026-08-27]`.** An earlier version of this section called `cFooter-4` and
> `cFooter-8` both "unused" and read the numbering as an off-by-one. `cFooter-4` is in active use;
> it is simply not rendered in the admin app. The absence is the finding — pinned by
> `TST_FOOT_TC_10`.

### ⚠️ EXCEPTION to §B2 — the notifications panel is NOT pre-rendered

Every other admin dialog can be read from the DOM before it is triggered (§A6). **The notifications
panel cannot.** It is built lazily by tippy.js and no `[data-tippy-root]` / `.tippy-box` container
exists until the bell is clicked. **The free-capture trick does not work here** — the panel must
actually be opened.

**The bell is already automated.** `invitationNotification.page.js` targets this exact control as
`notificationBtn` (`#tippyDropdownMenuButton`), and `TST_INVI_TC_1..6` cover the
**invitation-accept** flow reached through it. They do **not** cover the general notification panel.
Extend `INVI` rather than inventing a new module. `[2026-08-27]`

#### Panel structure — captured live `[2026-08-27]`

| Part | Selector | Detail |
|---|---|---|
| Panel | ~~`.notification-dropdown`~~ | **Corrected `[2026-09-14]`:** `.notification-dropdown` is the 56 px **wrapper around the bell**, not the panel |
| Heading | `.notification-heading h2` | `Notifications (92)` — count in `span.readCount`, matches the badge. Opening the panel does **not** change the count |
| Close | `[qid="ntf-2"]` | ⚠️ two visible elements share this qid — `.close` and `.close-dummy`. **Resolved `[2026-09-14]`:** `.close-dummy` overlays `.close` and intercepts a real click, so target `[qid="ntf-2"].close-dummy` |
| Time group | `p.time-related-title` | `Last Seven days` · `Older` |
| Row | `button.tippy-dropdown-item` | qids `ntf-30`…`ntf-34` — **positional, based at 30** |
| Footer link | `a[qid="ntf-4"]` | `See older notifications` |

- **Only 5 rows render against a heading of 92**, and the body does not scroll. The rest are
  reachable only via *See older notifications*. **No mark-as-read control exists in the panel.**
- ⚠️ **Row qids are positional AND based at 30**, not 1 — do not infer the base index (§B3).
- **Date format depends on the time group:** relative under *Last Seven days* (`5 days ago`),
  absolute under *Older* (`Mon, 17 Aug, 2026` — `Ddd, DD Mmm, YYYY`). A single
  date-format assertion across all rows will fail.
- **The empty state has NOT been seen** — this account holds 92. Still `[ASSUMED]`.
- **Read rows stay in the panel** `[2026-09-14]`. The 5 rows mix read and unread; an **unread** row
  contains `span.circle.mark-read-circle` (no other visual difference). **Clicking a READ row navigates
  but does not change the unread count** — a "count drops by one" case must pick
  `button.tippy-dropdown-item:has(.mark-read-circle)`.

**Notification copy, verbatim:**

| Title | Body |
|---|---|
| `Your Class summary report is ready` | `View your report, available to download in the Reports tab` |
| `Your Aggregated data report is ready` | `View your report, available to download on the Reports page` |
| `Class summary report generation failure` | `Sorry, something went wrong. The Class summary report you requested failed to generate. Details available in the Reports tab` |

⚠️ Note **"Reports tab" vs "Reports page"** between the two ready-notifications — a copy
inconsistency, pinned by `TST_INVI_TC_11`. Assert per notification type, not one shared string.
*Update `[2026-09-14]`:* the inconsistency still exists but now sits on different types —
*Assignments summary* says "on the Reports page", *Aggregated data* says "in the Reports tab".

### Site language / Spanish

- ~~Trigger `qid="sp-ldd-cntr"`, options `sp-ldd-btn-en` / `sp-ldd-btn-es`, active marked by
  `selected-item`.~~ **Corrected `[2026-09-14]`:** `sp-ldd-*` does **not exist when logged in**
  (presumably the logged-out header control). Logged in, the trigger is the footer's **`cFooter-7`**
  (aria `Site language, English`) with `<button>` options **`cFooter-8-0`** English and
  **`cFooter-8-1`** Español. The active option carries class **`active`**, and its aria-label ends
  `, selected` / `, seleccionado`.
- The control sits in the **header** when logged out, the **footer** when logged in.
- **Persistence is per-BROWSER, not per-account** `[2026-09-14]` — localStorage
  `comprodls.nemo.selected-locale`, so every fresh framework context starts in English. C1 keeps a
  separate store (`c1_lang`, localStorage + cookie) that did not change.
  ⚠️ **en→es re-renders in place; es→en reloads the page** — a restore step must wait for navigation.
- ~~No Spanish copy has been verified anywhere yet.~~ **Spanish copy VERIFIED `[2026-09-14]`:** School
  settings → *Pautas del centro educativo*; tabs → *Clases · Alumnos · Personal · Biblioteca ·
  Informes*; footer → *Términos de uso · Aviso de privacidad · Accesibilidad · Ayuda*; *Cambridge One
  para centros educativos*; trigger *Idioma del sitio, Español*; toggle *Interruptor
  Administrador/Profesor: …*. Tab labels embed live counts (`CLASES\n(10)` — label and count on
  separate lines, the same format on all five; an earlier "*Clases (10)* spacing" claim did **not**
  reproduce `[2026-09-15]`) — never assert the counts as copy.
- **Untranslated (i18n defects, recorded, not yet raised):** the footer link *Our approach*; the
  bell's aria-label *Notifications (N unread notifications)*.

### Login page — the Gigya screen-set trap, again

The real form is `#gigya-login-form` (`username` / `password`). The screen-set injects **~15 hidden
forms** carrying duplicate `username`, `password`, `email` and `profile.*` inputs, so an unscoped
`input[name=password]` matches several. **Scope every login selector to `#gigya-login-form`.**
This is the same trap §B2 records for Manage learner profile — it is the Gigya screen-set itself,
so expect it anywhere Gigya renders.

### Administrator / Teacher role toggle

`#teacher-admin-toggle` (`qid="teacher-admin-toggle"`) is `aria-hidden` / `tabindex=-1`; the
focusable control is the inner `div.can-toggle__switch`, whose `aria-label` **states the current
role and the action**: `Administrator/Teacher toggle: Administrator currently active, activate to
view Teacher dashboard`. That label is the clean assertion target.

### School tab navigation `[2026-08-27]`

Opening a school lands on **CLASSES**. Five tabs, upper case, each with a **real href**:

| Tab | qid | URL suffix | Browser title |
|---|---|---|---|
| CLASSES | `aDetail-1` | `/class` | `Classes | Cambridge One` |
| STUDENTS | `aDetail-2` | `/learner` | `Students | Cambridge One` |
| STAFF | `aDetail-4` | `/staff` | `Staff | Cambridge One` |
| LIBRARY | `aDetail-5` | `/library` | `Library | Cambridge One` |
| REPORTS | `aDetail-6` | `/reports` | `Reports | Cambridge One` |

Full path `/admin/admin/org_<slug>/<suffix>`; the school heading persists across all five.

**Three traps:**

1. ⚠️ **`aDetail-3` is skipped** — the sequence is 1, 2, 4, 5, 6. Never iterate `1..5`.
2. ⚠️ **STUDENTS routes to `/learner`**, not `/student` — a URL built from the label fails.
3. ⚠️ **The active marker is on the parent `<li>`** (`li.nav-item.active > a`). Every tab
   anchor carries an identical className whether active or not, so asserting on the anchor's class
   is a guaranteed false green — the same shape as the §B2 presence traps.

No `aria-current` / `aria-selected` on any tab; the active state is presentational only.
**Measured:** Reports ~4.3 s to become active, Classes ~1.2 s — poll, never pause (§B8).

### My profile / Manage profile `[2026-08-27]`

**URL `/dashboard/my-profile` — NOT under `/admin/`**, so this is the shared Cambridge One
profile page and a change here reaches teachers and students too. Entry: `aHeader-3` → `aHeader-6`.

⚠️ **Three names for one page:** menu *My profile* · title *My profile | Cambridge One* · heading
***Manage profile***. Assert the heading.

Two tabs — `c-mp-tab-1` *Personal info*, `c-mp-tab-2` *Password*. Fields `c-mp-inpt-1..7`:
First name, Last name, Email, Location, then Old / New / Confirm password. Buttons: Update
(`c-mp-btn-3` / `c-mp-btn-5`), Cancel (`c-mp-btn-4`), Back (`c-mp-btn-1`).
**Corrected `[2026-09-14]`:** Cancel has **two** qids — `c-mp-btn-2` on Personal info, `c-mp-btn-4`
on Password. **Update** is `input[type=submit][value="Update"]` — assert `value`; its text is empty.
The tabs **swap DOM** (inputs 5–7 are absent on Personal info), taking more than 1 s. Labels carry
` *` (visually required) although no field has a `required` attribute.
⚠️ **Profile menu:** a second click on the trigger while it is open is intercepted by the open
`.dropdown-menu.show` — open the menu only if its item is not already displayed.

**Four findings:**

1. ⚠️ **No field declares `maxlength` and none is `required`** — all seven, both tabs. The
   opposite of the rest of the admin app (§A3: class name 50, scale title 20). Boundary cases
   **cannot be derived from the markup here** and must be found by submitting.
2. ⚠️ **No password rules are displayed.** The equivalent page in the other app has a dedicated
   `newPasswordRules_text` element (`SETT` selector set); this page shows nothing.
3. ⚠️ **`Location` has three identities** — label *Location*, name `profile.country`, id
   `gigya-textbox-zip`. It behaves as a country. Select by qid; never infer from the id.
4. ⚠️ **The URL does not change between tabs**, and neither tab carries `aria-selected` or a role.
   ~~There is therefore no attribute at all identifying the active tab.~~ **Corrected `[2026-09-14]`:**
   the parent `li` gets class `selected` (`details-tab … selected` / `password-tab … selected`).

**No `c-mp-*` selector exists in `C1Selectors.json`** — the page is new to the framework. The
`SETT` module (36 TCs, `settings.test.js`) is the **same concept in a different app**
(`data-tid` selectors): model the design on it, but do not assume copy or behaviour matches.

> **Do not exercise the password or validation paths on `testt1@mailsac.com`** — it is the login
> for the whole admin suite. Those cases need a disposable account. `[2026-08-27]`

### School list — 7 schools, extending §0

`testt1@mailsac.com` sees **7** schools, not the 4 in §0's table. Cards are
`a.inst-link qid="aDashboard-N"` (**positional**); the chevron is a separate `aDashboard1-N`; and
**the school key is in the card's `aria-label`** — which is what makes key-based selection possible.

| Key | Display name | In §0? |
|---|---|---|
| `FCN-CHZ-PDA` | 3 July Test School 1 | yes |
| `ZPB-TWP-AEQ` | 3 July Test School 1 | yes |
| `KNF-XRD-QVE` | 3 July Test School 2 | **new** |
| `MQA-ABC-DEF` | MQA Sierra School | yes |
| `HQC-ZWM-ZVF` | Perf Test School 3 | **new** |
| `ACJ-DXL-JKR` | Perf Test School 4 | yes |
| `GYB-JMU-KYA` | Perf Test School 5 | **new** |

Cards 1 and 2 sharing a display name re-confirms §0's *"always select by KEY"* rule.

### Page `<title>` is not stable across load paths

`/admin/admin/dashboard` reported `My school accounts | Cambridge One` after in-app navigation but
`Administrator | Cambridge One` on a fresh `goto`. **Do not assert the document title** on admin
screens without accounting for how the page was reached.

---

## A10. Change school key, organisations, and MQA/CQA visibility `[2026-08-27]`

*Captured live on Thor while designing Batch B of the Generic manual set (modules `SKEY`,
`SADB`, `LIBR`).*

### ⚠️ Change school key is IRREVERSIBLE — and it is reachable in two clicks

**School settings** (`adEdit-1`) → **Change school key** (`adEdit-2`) raises this dialog,
captured **verbatim from the pre-rendered DOM without triggering it** (§A6):

> ⚠ **CAREFUL!**
> **Changing the school key cannot be undone**
> This action is recommended only if your current school key has been compromised

Controls: **Continue** `adEdit-3` · **Cancel** `adEdit-4`.

**Dialog detail `[2026-09-14]`:** scoped by `#changeSchoolKey`; warning icon
`div.warning-heading > i.fa.fa-exclamation-triangle`. Continue and Cancel are **anchors**; Cancel is
`a[qid=adEdit-4][data-dismiss="modal"]`. Treat *closed* as `display:none` **and** no
`.modal-backdrop` **and** no `body.modal-open` — never the `show` class.
⚠️ In MCP grounding a synthetic `.click()` on Cancel did NOT close the dialog; Escape did. The
framework's **real** click does close it — `TST_SKEY_TC_4` (open → Cancel → key unchanged) is verified
on **`KNF-XRD-QVE`**, which is where it must always run, never `FCN-CHZ-PDA` (user decision).

> 🚨 **NEVER run this on `FCN-CHZ-PDA`.** It is the primary shared school and its key is
> hardcoded as `schoolKey` in `schoolAdminAddClassData.json` — changing it would break
> **every admin suite simultaneously**, with no way back. `TST_SKEY_TC_3` is Blocked at design
> time for exactly this reason (§A5, golden rule 4). Unblocking needs a dedicated disposable school.

> 🔒 **Safety guards baked into the Generic suite's code — never weaken them** `[2026-09-14]`:
> - `changeSchoolKey.page.js` has **no method that clicks Continue** (`adEdit-3`). The SKEY
>   BeforeEach (`TST_SKEY_TC_100`) stops the suite unless the displayed key equals `schoolKey`
>   (`KNF-XRD-QVE`) and is not `forbiddenSchoolKey` (`FCN-CHZ-PDA`).
> - `setupSchoolWizard.click_next` refuses any key not in its Next list, so **Send Request**
>   (`t-ss-as-btn-1`) is unreachable — old wizard modules' `button.btn-purple` also matches it.
> - `myProfile.restore_firstName` is the ONLY save path, used only if Back unexpectedly saved.
> - If `TST_SKEY_TC_4` fails on "dialog did not close" while the key is unchanged, that is a
>   **finding** — report it; do not add an Escape fallback (Invariant 14).

School key format across all 7 schools: **three uppercase triplets**, `XXX-XXX-XXX`. On the
dashboard the key is **display text** (`span.school-code`) beside a **Copy** button — **not an
editable field**. The only `<input>` on the dashboard is the role toggle.

### Organisations — the slug is not derivable

| School | Key | Org slug |
|---|---|---|
| 3 July Test School 1 | `FCN-CHZ-PDA` | `org_perf_testschool_1` |
| 3 July Test School 2 | `KNF-XRD-QVE` | `org_perf_testschool_2` `[2026-09-14]` |

**Org switch verified `[2026-09-14]`** (`SADB_TC_3`): opening `KNF-XRD-QVE` shows heading *3 July Test
School 2*, and the FCN fixture class is absent — a falsifiable no-carry-over check.

The org slug follows neither the school name nor the key. **Capture it; never construct it.**
Context must still be set by clicking the card — deep links return `/dashboard/error` (§A1).

> **Open question worth testing.** The class Filter and Search persist **server-side per user**
> (§A4). Whether that persistence is scoped **per school** or leaks **across organisations** is
> untested. For an admin managing 7 schools a leak would be a real defect.

### MQA / CQA product visibility — observation, not yet a verdict

On **3 July Test School 1** (`FCN-CHZ-PDA`), a **non-MQA** school showing `Library (971)`:

| Pattern in title | Count | Example |
|---|---|---|
| contains `CQA` | **2** | `CQA - 7 Jan 2021 - Test Umbrella product` |
| begins `NON MQA` | 3 | `NON MQA Umbrella for Free Trial` |
| MQA-only by title | 0 | — |

**Do not read this as a defect yet.** A title containing *CQA* does not prove the product is
CQA-**restricted** — restriction is a licensing property, not a naming convention. Two things are
needed before `TST_LIBR_TC_32` can be executed: a **non-MQA admin account** (`testt1@mailsac.com`
is itself an MQA Sierra School admin) and a **product-team definition** of what marks a product as
MQA/CQA-gated.

Product rows are `aLibrary-*` — **974 elements for 971 products**, so the qid family includes
non-row controls. Do not equate the element count with the product count.

---

## A11. Teacher view, the role toggle, and the shared dialog contract `[2026-08-27]`

*Captured live on Thor while designing Batch C of the Generic manual set. The round trip was
performed and the account left in Administrator view.*

### ⚠️ The role toggle is named DIFFERENTLY in each view

| | Administrator | Teacher |
|---|---|---|
| URL | `/admin/admin/dashboard` | `/dashboard/teacher/dashboard` |
| Title | `My school accounts | Cambridge One` | `Teacher dashboard | Cambridge One` |
| Heading | `My school accounts` | `Hi <FIRST_NAME>!` |
| `checked` | `false` | `true` |
| Switch class | `.can-toggle__switch` (double underscore) | `.can-toggle-switch` (single hyphen) |

**A selector written for one view silently fails in the other**, which breaks exactly the round-trip
test it is used for. Use `#teacher-admin-toggle` — stable in both — and read the input's
`checked` state. The focusable control is the inner `[tabindex="0"]` div; the input itself is
`aria-hidden` / `tabindex=-1`. The `aria-label` names the current role and the action, and
flips correctly. The toggle appears on **inner admin tabs too**, not only the dashboard.

**Round trip `[2026-09-14]`:** toggling back returns to the **admin page it was left from**, not always
`/admin/admin/dashboard`, and the document title varies (`Administrator | …` vs `My school accounts | …`)
— never assert the title.
⚠️ **The click handler binds after the switch renders.** In the teacher view the switch was visible,
labelled and the loader cleared, yet a real click returned success and did nothing; after a 3 s settle
the same single click worked. Binding is not observable (cf. §B6) — settle, then click **once**;
never retry-click (it would toggle twice).

### The two views show DIFFERENT school estates

Administrator view = schools the user **administers** (7 for `testt1@mailsac.com`).
Teacher view = schools the user **teaches at** (8 groups) — including `ABERYSTWYTH COLLEGE : THOR`
and `LTI INTEGRATIONS TEST2`, **neither of which appears in the admin list**.

> ⚠️ Never assume the toggle shows the same estate on both sides, and never assert equal counts.
> ⚠️ **The teacher view groups by DISPLAY NAME**, so the two distinct schools both called
> *3 July Test School 1* (`FCN-CHZ-PDA` / `ZPB-TWP-AEQ`) **collapse into a single group**
> there, while the admin view keeps them apart by key. Never match schools across views by name.
> ⚠️ **Disputed `[2026-09-14]`:** a later pass listed *3 JULY TEST SCHOOL 1* **twice** among the
> teacher-view group headings (9 headings, 7 Create-class buttons). Unresolved — verify before
> relying on either claim.

⚠️ **All 7 `Create class` buttons in the teacher view share qid `tDashboard-ncls-btn-1`** — one
per school group. The qid cannot distinguish them, so the button must be located **through its
school-group heading**, or a created class lands on the wrong school.

### Dialog inventory per admin tab, and the one global dialog

| Tab | `.modal-content` present | Hidden on load |
|---|---|---|
| Classes | 5 | all |
| Students | 4 | all |
| Staff | 1 | all |

**The change-school-key dialog ships with the shared page chrome and is therefore present on EVERY
admin tab** — it inflates each count by one and will match an unscoped modal selector anywhere.
Scope modal selectors with `:has(...)` to the specific dialog (extends §B2).

**Verbatim destructive-confirmation copy** (all captured pre-rendered, nothing triggered):

| Dialog | Copy |
|---|---|
| Class delete | `WARNING!` · *There might be students, teachers and course materials in the selected classes* · *Are you sure you want to delete?* · `No, cancel` |
| Class delete async | *This will take a few minutes* · *Deleted classes may show on dashboards for a few minutes before they are removed* |
| Class 50-cap | *You can only delete 50 classes at one time* · *Please uncheck some classes to continue* |
| Student removal | *I confirm that I want to remove students from my school account* · `Cancel` · `Request to remove` |
| Student 50-cap | *You can only remove 50 students at one time* · *Please uncheck some students to continue* |
| Student removal async | *Removing students may take some time* |

The two 50-cap warnings share a **two-line pattern differing only in the verb** — *delete* for
classes, *remove* for students. The limit and the sentence shape are shared; **the verb is not**, so
a single assertion string across both is wrong.

### Institution request — covered end to end except the submission

Launch is `TST_FOOT_TC_7`; entry is `TST_DINS_TC_1`; the eight wizard steps are `SUSA` /
`SCTY` / `NTCH` / `SNAM` / `SLOC` / `SADR` / `SCON` / `SRQS`. **Nothing submits the
request**, so its confirmation copy has never been observed.

Every existing step case asserts only the **enabling** direction (*"select X to enable Next"*); the
disabled half is unasserted. ~~Check whether Next is natively disabled or CSS-only disabled.~~
**Resolved `[2026-09-14]` (`SRQS_TC_3`, walked to the summary, never submitted):** the wizard lives at
`/dashboard/teacher/setupschool` and **advances in-page — the URL never changes**. Next is **natively
disabled** (`disabled` + `.disabled` + `pointer-events:none`) until each step is valid, so `isEnabled`
is truthful. **The Next qid changes per step** (`t-ss-i/t/s/sn-btn-1`, `cn/ad-btn-2`, `cd-btn-1`).

| Step | What enables Next |
|---|---|
| School type | any of 7 radios (click the label — the inputs are opacity 0) |
| Number of teachers | any of 4 radios |
| School name | non-whitespace text (trimmed — unlike the Library search) |
| Location | **pre-filled from the account** (India); empty, whitespace or partial ("Ind") all block |
| Address | Street **and** City required (trimmed); Region and Postal optional |
| Telephone | code (pre-filled 91, `maxlength=6`) **and** a numeric number required; URL optional **but validated** (`example` blocks, `www.example.org` passes) |

No step shows inline error text when blocked — the disabled Next is the only signal.
⚠️ **The summary's primary button is `button.btn-purple[qid=t-ss-as-btn-1]` "Send Request"** — the same
generic selector every Next matches. A step-looping helper **will submit** at the end. Stop by qid.
⚠️ The summary omits school type and number of teachers, and has no Edit links (recorded, not raised).
⚠️ **The intro Next also renders before it responds** — 1 run in 3 the click returned success and the
wizard stayed on the intro. Wait out `#loader-container .loader`, settle, click once.

> Submitting raises a **real institution request into a human queue**, not withdrawable from the UI.
> `TST_SRQS_TC_2` is Blocked at design time for that reason.

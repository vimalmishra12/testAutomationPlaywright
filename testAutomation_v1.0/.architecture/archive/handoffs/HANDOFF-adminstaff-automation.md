# HANDOFF — Admin App Staff tab, manual design → automation

> Context primer for **starting automation** of the Staff-tab manual cases.
> Written 2026-08-24 at the end of the design session. **Read this INSTEAD of the session
> transcript.** Deeper detail lives in
> `.architecture/walkthroughs/walkthrough_adminStaffTab.test.js_2026-08-24_11h-15m.md` and in
> `product-knowledge/ExperienceApp/admin-staff-tab.md`.

---

## 0. Start here

1. Read the mandatory architecture set (`CLAUDE.md` §MANDATORY) — including
   `product-knowledge/ExperienceApp/admin-shared.md` **Part A + Part B** (automation needs both)
   and the new **`product-knowledge/ExperienceApp/admin-staff-tab.md`**.
2. Use the repo skill **`c1-test-authoring`** from
   `D:\testAutomation\QATestAutomation\.agent\skills\` — **not** the bundled `qa-test-automation`
   plugin skill, and not a worktree's copy.
3. Read the manual register:
   `test/Manual/C1App/AdminApp-Staff/AdminApp_Staff_tab_test_cases.md` (+ `.xlsx`).
4. Then §10 below — suggested first actions.

**Nothing is automated yet.** This is a design-only handoff: 55 cases exist on paper, 0 in code.
All of it is merged to `main` (PR #36, merge commit `6374503`).

---

## 1. What this work is

Automating the manual cases designed from `AdminApp_Staff Tab.xlsx` (13 scenarios), which live in
`test/Manual/C1App/AdminApp-Staff/`.

| | |
|---|---|
| Total cases | **55** — 30 Positive · 19 Edge · 6 Negative |
| Statuses today | 54 **Not Run** · 1 **Blocked** · 0 Pass |
| `[ASSUMED]` expected results | listed in the register's *Open items* section |
| Source workbook | `C:\Users\Compro\Desktop\Admin Automation\AdminApp_Staff Tab.xlsx` (**not** in the repo) |

### Modules → page objects

Module codes were chosen from the **future page objects** (AGENTS.md Rule 6), so — as with the
Students batch — **no re-mapping is owed**. Automate onto these names.

| Manual module | Cases | Page object to create | Screens |
|---|---|---|---|
| `STFL` | `TST_STFL_TC_1–27` (26 live) | `schoolStaff.page.js` | Staff tab list, search, sort, user guide, load more |
| `STFP` | `TST_STFP_TC_1–18` (17 live) | `staffProfile.page.js` | View profile, grant/remove admin rights, removal |
| `STFB` | `TST_STFB_TC_1–12` | `bulkStaff.page.js` | Add new teachers to classes (invitation form) |

> ⚠️ **Two IDs are retired and must NOT be reused:** `TST_STFP_TC_5` and `TST_STFL_TC_22`. Both were
> withdrawn during review (see §8). The ID gaps are deliberate.

---

## 2. Environment

| | |
|---|---|
| Env | `thor` — `https://micro-nemo.comprodls.com` |
| **School** | **`FCN-CHZ-PDA`** = "3 July Test School 1", org slug `org_perf_testschool_1` |
| Login | `testt1@mailsac.com` — password in `testcaseData/ExperienceApp/thor/logindata.json` → `C1.login.user.schoolAdmin` |
| Run mode | **headed** — as with the other admin suites; verify before relying on headless |

⚠️ **Select the school by KEY, never by name or card position** — two schools share the display name
"3 July Test School 1" (`FCN-CHZ-PDA` and `ZPB-TWP-AEQ`), and card `qid`s are positional.
The card's `aria-label` carries the key: `a.inst-link[aria-label*="FCN-CHZ-PDA"]`.

⚠️ **The cookie banner intercepts row clicks** near the top of the Staff list —
`div.cookies-banner … intercepts pointer events` was a real failure this session. Dismiss or
tolerate it. The **CustomerGauge NPS survey** noted for the Students tab was not seen this session
but should still be tolerated.

**Playwright MCP** is used for live selector capture. Its session expires often; a human must sign
in — Claude cannot type the password.

---

## 3. Routes

Simpler than the Students tab — most of the work stays inside the `admin` microfrontend.

```
admin       /admin/admin/org_<slug>/staff                          Staff tab
            /admin/admin/org_<slug>/profile/<orgUuid>/<userId>     staff profile
            /admin/admin/org_<slug>/email/invite                   Add new teachers to classes
class       /class/teacher/org_<slug>/class/<uuid>/view            class page (from a profile)
```

- **The Staff tab URL IS reachable directly** within a session whose school context is already set.
  Cold-session behaviour is `[ASSUMED]`.
- ⚠️ **A staff profile URL is NOT deep-linkable** — it collapses to `/admin/` and renders blank.
  **Always reach a profile through the list.** This is accepted behaviour, not a defect (§8).
  Note the student profile URL *is* deep-linkable — a suite ported from the Students tab will break
  here.
- Opening a class from a profile crosses `admin` → `class`: a full page load, not a route change.

---

## 4. ⚠️ Traps — read before capturing a single selector

Full detail in `admin-staff-tab.md` §4. The ones that will cost you a run:

1. **The whole row IS the dropdown toggle** — `button.row-link`, `qid="aAdmin-16-<index>"`,
   `data-toggle="dropdown"`. The `View profile` item (`aAdmin-17-<index>`) is pre-rendered hidden
   once per row. Clicking the item without opening the toggle fails with *"element is not visible"*.
   Filter on visibility, always (`admin-shared.md` §B2).
2. **Row identifiers are positional** and shift with sort, search and Load more. Resolve a row by its
   content, then act on it. (They are at least unique per row here, unlike the Students tab.)
3. **The aria row numbers are offset by two** — index `13` carries `aria-label="Row15 …"`. Do not map
   the aria number onto the index.
4. **The user guide toggle is a DIFFERENT element in each state** — `aAdmin-8` collapsed
   (`User guide`, no aria-label), `aAdmin-9` expanded (`Hide`, aria-label `Hide the user guide`).
   The panel is genuinely removed from the DOM when collapsed.
5. **`Yes, remove` on the removal dialog is disabled by CSS class only** — the class `disabled` is
   present while the native `disabled` property stays `false`. `toBeDisabled()` is a false green.
   Assert on the class. Modal roots: `removeAdminModal-*`, `removeTeacherFromSchoolModal-*`.
6. **The invitation form's bulk actions carry NO `qid`** (`Add role`, `+ Add class key`, `Remove`)
   and are disabled via the class `disable`. Resolve them by text.
7. **The invitation form auto-saves and RESTORES a draft** — it is **not empty on load**, shows
   `Saved <age>`, and the draft is shared state on a shared school. A test that assumes an empty
   form will fail.
8. **A failed profile load leaves `#loader-container` visible**, intercepting every subsequent click
   until reload. One 500 cascades into unrelated timeouts.
9. **Search is submit-driven** — clicking Search is required; typing alone does nothing. ~1–2 s.
10. **Sort collation is by code point, not locale.** A `localeCompare` expectation is wrong.
11. **`Load more ...` is REMOVED from the DOM when exhausted**, not disabled. Assert absence.
12. **Changing the sort resets pagination** to the first 20 with `Load more ...` restored.
13. Sort indicator text (`sorted ascending`/`descending`) **is** inside the header button on every
    Staff column — the Students-tab Email/Username trap does **not** apply here.
14. **The staff-list API rejects a hand-built `fetch`** with `403 {"code":"STALE_REQUEST"}` — the
    timestamp is signed. You cannot seed or read fixtures through the API.

---

## 5. Suite split — decide this before writing tests

| Suite | Cases | Notes |
|---|---|---|
| **Side-effect free** (safe, run freely) | all `STFL` except `TC_27`; `STFP` 1–4, 6–9, 11, 12, 14–17; `STFB` 1, 2, 4, 5, 6, 7, 8, 12 | **~43 cases.** Start here — most of the value, none of the risk. |
| **Mutates / creates real data** | `STFL_TC_27`; `STFP_TC_10` (grant), `TC_13` (revoke), `TC_18` (removal); `STFB_TC_3` (downloads a file), `TC_9` (upload), `TC_10` (sends invitations) | Separate suite. Must own its data. |
| **Sends real email** | `STFB_TC_10` and, downstream, `STFL_TC_27` | mailsac/yopmail addresses only. |

**Sweepable prefix for anything this work creates: `AutoStaff_`** (already added to
`admin-shared.md` §A7).

⚠️ **Never revoke rights from, or remove, a staff member the suite did not create.**
⚠️ **Never confirm either action against `testt1@mailsac.com`** — it is the login for *every* admin
suite, and the product offers both on the signed-in user's own profile (`TST_STFP_TC_14`).

---

## 6. Outstanding work — the things that are NOT done

### (a) One case Blocked
`TST_STFB_TC_11` — the upload-error dialog exists in the pre-rendered DOM and its **root cause is
known**, but the condition that raises it has not been reproduced. Unblock steps are in its Comments
cell: force the upload to fail (DevTools → Network → block the request, or go offline mid-upload) and
see which of the **three** error modals appears — `errorFileUploadModal`, `somethingWentWrongModal`
or `existingChildFormUploadErrorModal`. Only the third one is the defect.

### (b) `[ASSUMED]` expected results
Listed in the register's *Open items* table. The ones that matter most:

- **Grant admin rights** (`STFP_TC_10`) — **no `Grant admin rights?` dialog is pre-rendered**, unlike
  the revoke dialog. Either grant is immediate or the dialog is injected on demand.
  **Do not click Grant on a shared account to find out** — use an account the suite created.
- **Revoke / removal outcomes** (`STFP_TC_13`, `TC_18`) — confirm paths deliberately not exercised.
  No "in progress" or email-report dialog is pre-rendered, which *suggests* staff removal may be
  synchronous, unlike student removal. Confirm rather than assume.
- **CSV `Role` value** (`STFB_TC_9`) — the template example says `Student`; the fixture uses
  `Teacher`. Also unknown whether the template's example row must be deleted before upload. Both
  settle in two minutes on the first run.

### (c) No boundary cases for any text field
**No `maxlength` anywhere on these screens**, including the search box. Any limit is server-side and
unmeasured. **Measure it during Phase 1, then add the cases** — do not invent a number
(`admin-shared.md` §A3). The only measured limit is the invitation form's **200-record** cap.

### (d) A fixture gap worth knowing
**The only staff member on this school with classes is the login account itself** (`testt1@mailsac.com`,
`Classes (3)`). Any test needing "a teacher with classes" that is *not* the signed-in admin has **no
fixture here yet** — either create one, or accept that `TST_STFP_TC_7` exercises the admin's own
profile.

---

## 7. ⚠️ Two known defects — do NOT "fix" these in automation

These are **product** defects found during design, each written as an expected-versus-actual case.
When the automation fails on them, that is the test working. Do not add a workaround, and do not
soften the expected result.

| Case | Defect |
|---|---|
| `TST_STFL_TC_26` | The heading reads `Staff (23)` but the fully-loaded list renders **21** rows, with `Load more ...` already removed. **Not** explained by pending invitations — the team confirmed the count moves only on acceptance. Cause unexplained; may be specific to this school's data. **Assert "heading count == rendered row count", never the literal 23 and 21** — and expect this to fail on `FCN-CHZ-PDA`. |
| `TST_STFB_TC_11` | The upload-error dialog renders three raw i18n keys instead of `Form not uploaded` / `An unexpected error occured. Please try again.` / `Close`. **Root cause:** `FORM_UPLOAD_ERROR_*` is defined under `ADMIN.LEARNER.EXISTING_CHILD` and `ADMIN.LEARNER.BULK_ACTIVATION` but **never** under `ADMIN.LEARNER.ADULT_INVITE`, which is where this page looks. The same dialog renders correctly on the child CSV screen. Blocked — see §6(a). |

**Smaller copy defects, recorded in Remarks rather than as cases:** the no-results message says
*"no **administrators** that match your search"* on a tab listing teachers too; the invitation form's
help panel is worded for students only and its browser tab reads `Students | Cambridge One`; the CSV
template downloads as `Add_students_template.csv`; `this may take**a** few minutes`; `invited to
school **A**ccount` with a missing space after `each class.`; and `e.g Student` in the CSV template
missing the full stop the other columns have.

**Raise these with the product owner** — none were in Jira as of 2026-08-24.

---

## 8. Decisions already taken — do not re-open these

Four findings were reviewed with the user on 2026-08-24. Two were closed. **Do not resurrect them.**

| Finding | Outcome |
|---|---|
| **HTTP 500 on `View profile`** for `tch_L_20240705-095330_1_FCN-CHZ-PDA` | **Known DATA issue**, confirmed with the team — **not** a product defect. `TST_STFP_TC_6` was narrowed to the two client-side gaps any 500 exposes: no user-visible error, and the loading overlay left stuck. The bad account is retained **deliberately** as the trigger fixture. `teacher17aug2026@mailsac.com` is the team-nominated **healthy** teacher fixture used elsewhere. |
| **Staff profile URL renders blank** | **Withdrawn** (`TST_STFP_TC_5` retired). Deep-linking is not handled by the development team. The behaviour is still documented, because automation must not reach a profile by URL. |
| **Source scenario #5 asks for a "username" sort** | **Typo**, confirmed by the user — the tab sorts by **email address**. The scenario is recorded corrected throughout, the email sort is covered by `TST_STFL_TC_16`, and `TST_STFL_TC_22` (which existed only to record the mismatch) was **withdrawn** and its ID retired. |
| **Staff count semantics** | Confirmed: `Staff (N)` increments **only when an invited teacher accepts**. Pending invitations are **not** counted — which is what rules out the obvious explanation for the 23-vs-21 gap. |

---

## 9. Fixtures on `FCN-CHZ-PDA` (verified 2026-08-24)

| Purpose | Staff member |
|---|---|
| **Teacher fixture — use this one** (team-nominated) | `ln, teacher17aug2026` · teacher17aug2026@mailsac.com |
| Teacher, no classes | `gg, teacher19oct` · teacher19oct@mailsac.com |
| Administrator/Teacher, no classes | `gg, testteacher18` · testteacher18oct@mailsac.com |
| Administrator/Teacher **with 3 classes** | `T1, Test` · testt1@mailsac.com — **the login account itself** |
| Profile that returns HTTP 500 — known data issue, kept as the error-handling trigger | `Perf Test, tch_L_20240705-095330_1_FCN-CHZ-PDA` · …@yopmail.com |
| Last name shared by 2 staff (search fixture) | `gg` |
| Email domain shared by 9 staff (search fixture) | `@yopmail.com` |
| Active class key for the CSV fixture | `wLE3-zTx6` (`AutoClass_CreateOnly`) — **if swept, substitute any active key from the Classes tab** |

**23 in the heading, 21 rendered, 3 of them `Administrator/Teacher` at capture.** The school is
**shared and actively mutated by other teams**: never assert an absolute count
(`admin-shared.md` §A5).

**CSV files already written**, alongside the register:
- `Add_students_template.csv` — the real downloaded template, kept for comparison
- `TST_STFB_TC_9_teachers.csv` — the fixture, written from its exact headers (UTF-8 **with BOM**,
  CRLF, example row removed)

---

## 10. Suggested first actions

1. **Confirm the questions in §11** — two of them change what gets built.
2. **Phase 1 reconnaissance sweep** (`admin-shared.md` §B1) on the Staff tab, capturing selectors
   into `C1Selectors.json`. Most of the product-side recon is already done and written up in
   `admin-staff-tab.md` — you are capturing selectors and measuring transitions, not re-deriving
   behaviour.
3. **Build `schoolStaff.page.js` and automate the side-effect-free `STFL` block first**
   (~25 cases, no data risk). It exercises search, sort, user guide and load more — and it will
   immediately prove or disprove traps 1–4 and 9–13 in §4.
4. **Then `STFP` read-only** — profile layout for both roles, Back, class launch, the menu
   role-conditionality, and both dialogs' **cancel** paths (which are non-mutating and verified).
5. **Leave `STFB` and the mutating cases until last.** They need a data-owning suite, and
   `STFB_TC_10` sends real email.
6. Update the register's Status/Actual Result cells **only via `npm run register`**
   (`tooling/xlsxRegister.js`), never by hand-patching the zip, and never while the workbook is open
   in Excel. Roll up the header summary from the rows when you do.

---

## 11. Open questions for the user

1. **Is a different / larger school available for the Staff tab?** `[raised by the user 2026-08-24,
   pending]` The 23-vs-21 discrepancy may be specific to `FCN-CHZ-PDA`'s data. If a replacement is
   provided, re-ground the counts and fixtures **before** treating the shortfall as a product defect.
2. **Is self-revocation / self-removal of admin rights by design?** `[the user is checking with the
   team, 2026-08-24]` An administrator is offered both on their own profile with no extra warning.
   If it is by design, `TST_STFP_TC_14` stands as written (menu inspection only). If not, it becomes
   an expected-versus-actual defect and its expected result must change. **Either way, never
   automate a confirm path on the signed-in account.**
3. **Are the two defects in §7 to be raised in Jira**, and by whom, before automation starts?
   `TST_STFB_TC_11` needs no repro to fix — the root cause is three missing translation keys.

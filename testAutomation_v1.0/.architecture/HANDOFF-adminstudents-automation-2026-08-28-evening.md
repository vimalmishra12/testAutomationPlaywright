# Admin App — Students tab automation · HANDOFF (2026-08-28, evening)

**Give this file to Claude on Monday.** It is self-contained — everything needed to continue is
here. It supersedes `AdminApp-Students-Automation-Handoff_2026-08-28.md` (the morning version);
that one is now out of date because the SPRF block has since been automated.

- **PART 1 (§1–§13)** — state, what you owe me, framework rules, traps, environment, selectors.
- **PART 2 (§14)** — the **full manual specs for the 12 SBLK cases**, inlined verbatim, because
  SBLK is the bulk of Monday's work.

Repo: `D:\testAutomation\QATestAutomation\` · framework root `testAutomation_v1.0\`
In-repo copy: `.architecture/HANDOFF-adminstudents-automation-2026-08-28-evening.md`

---

## 1. Where the work stands

| Module | Page object | Manual TCs | Automated & passing |
|---|---|---|---|
| **SLST** — Students tab list | `schoolStudents.page.js` ✅ | 25 | **23** |
| **SPRF** — profile & manage account | `studentProfile.page.js` ✅ | 22 | **11** |
| **SBLK** — bulk operations | `bulkStudents.page.js` ❌ not created | 12 | **0** |

**34 of 59 manual TCs automated and passing.** Everything is on `main` and pushed:

```
2eb1f4e  feat(admin-students): automate the read-only SPRF block (11 TCs passing)   <- newest
bf3ae8d  docs(admin-students): add the post-automation handoff
66831f6  feat(admin-students): automate the SLST block (23 TCs passing)
```

**Prove the baseline before changing anything** (~2 min each, both must be green):

```bash
npm run adminStudentsTabTest_thor
```

```bash
npm run adminStudentProfileTest_thor
```

Expected: **23 passing** and **11 passing**, 0 failing. If either is red before you start, fix
that first — do not build on a broken baseline.

Phase status: SLST Phase 1 ✅ / 2 ✅ / **3 ⬜ still owed**. SPRF Phase 1 ✅ / 2 ✅ / 3 ✅
(assessed, no candidates).

### Files owned by this work

```
pages/ExperienceApp/schoolStudents.page.js                    27 methods
pages/ExperienceApp/studentProfile.page.js                    16 methods + 3 initializers
test/ExperienceApp/adminStudentsTab.test.js                   23 TCs + TC_NAV + TC_RESET
test/ExperienceApp/studentProfile.test.js                     11 TCs + TC_7 (parked) + TC_RESET
testResources/selectors/ExperienceApp/C1Selectors.json        css.ComproC1.schoolStudents (46)
                                                              css.ComproC1.studentProfile (41)
testResources/testcaseData/ExperienceApp/thor/adminStudentsTabData.json
testResources/testcaseData/ExperienceApp/thor/adminStudentProfileData.json
testResources/testcaseRepository/ExperienceApp/C1TCRepository.json   modules SLST + SPRF
testResources/testExecutionFiles/ExperienceApp/thor/adminStudentsTab.json
testResources/testExecutionFiles/ExperienceApp/thor/adminStudentProfile.json
package.json                     adminStudentsTabTest_thor · adminStudentProfileTest_thor
```

---

## 2. ⚠️ WHAT I NEED FROM YOU ON MONDAY

**This is the real gate now, not automation effort.** 22 of the 25 remaining TCs are blocked on
data or a decision, not on work. Bring as much of this as you can:

### A. Login for the data-creating school — **blocks the most**

| | |
|---|---|
| School | **Cqa Test Ashish School 1** — key **`VED-NEH-KVU`**, slug `org_cup_j9GskaJJmvDjmQZ9` |
| Login | `cqatestashish_admin@mailsac.com` / `Compro11` |
| Status | **Agreed 2026-08-28, but NEVER EXERCISED and NOT in `logindata.json`** |

**What I need:** confirmation these credentials still work, then I add them as
`C1.login.user.schoolAdminAutomation`.

**Unblocks:** `TST_SLST_TC_25`, all 6 mutating SPRF cases, and every SBLK case that creates data
(TC_1, TC_2, TC_3, TC_4, TC_5). **That is ~14 TCs from one credential.**

⚠️ Also confirm: **does that school already have at least one CLASS?** Every bulk "add students
to classes" flow requires one, and both choosers say so explicitly:
*"Important: Classes must be created before setting up student accounts."*

### B. A redeemed activation code — blocks 1 TC

`TST_SLST_TC_14` needs **a 16-character activation code that has already been redeemed, plus the
name of the student who redeemed it**. You said you'd supply this; the code-issuing environment
was down. Format: `AB2C-DE3F-G4HJ-K5LM`.

### C. Valid unused activation codes — blocks 2 TCs

`TST_SPRF_TC_14` and `TST_SBLK_TC_9` each **consume a real code** (the page says *"You can only
use each code once"*). If you can spare **2 codes**, both become automatable. If not, they stay
parked — that is a legitimate outcome, not a failure.

### D. A school with 51+ students — blocks 1 TC

`TST_SPRF_TC_20` (the 50-student removal cap) needs 51+ students selectable. FCN-CHZ-PDA holds
27. If no such school exists, this stays Blocked permanently and we should say so and close it.

### E. Decisions only you can make

1. **`TST_SPRF_TC_18`** — the umbrella name on a profile is a plain `<span class="bundle-title">`
   with **no link or button anywhere in its ancestry**, confirmed on both a child and an adult
   profile. There is no route from the profile to an umbrella details page.
   **Missing link (product defect), or is the scenario simply wrong?** Cannot be automated until
   answered — and the answer changes whether it becomes a passing test or a defect report.
2. **The open defects — who raises them in Jira?** Four are confirmed live and, as far as this
   work knows, none is filed. See §11.
3. **Is a mailsac/yopmail inbox acceptable for the two email-sending cases** (`TST_SBLK_TC_3`,
   `TST_SBLK_TC_5`)? They send REAL invitation emails.

### F. Nothing needed for these — I can start immediately Monday

- **SBLK read-only cases: `TC_6`, `TC_7`, `TC_8`, `TC_10`, `TC_12`** — chooser pages, the bulk
  activation page layout, the disabled-button thresholds and the malformed-CSV rejection. None
  of them creates data.
- **Downloading the 7 CSV templates** (§7) — needed before any CSV fixture can be written, and
  it is side-effect free.
- **SLST Phase 3 visual assessment** — still formally owed.

**If you bring only ONE thing, make it (A) — the login.**

---

## 3. What is left, case by case

### SLST — 2 remaining of 25

| TC | State | Blocker |
|---|---|---|
| `TST_SLST_TC_14` | Blocked | A redeemed 16-char code + its student (§2B) |
| `TST_SLST_TC_25` | Not written | Creates a student — needs the `VED-NEH-KVU` login (§2A) |

### SPRF — 11 remaining of 22

| TC | State | Blocker |
|---|---|---|
| `TST_SPRF_TC_3` | Blocked | No adult-with-username account exists. **Running `TST_SBLK_TC_2` creates one** |
| `TST_SPRF_TC_7` | **Written & registered, deliberately not run** | Open HTTP-500 defect — see §5 |
| `TST_SPRF_TC_8` | Not written | Sets a REAL password on a shared account (§2A school) |
| `TST_SPRF_TC_10` | Not written | Renames a REAL student (§2A school) |
| `TST_SPRF_TC_12` | Not written | Needs the required-field message provoked; safe-ish, but leaves a dirty form |
| `TST_SPRF_TC_13` | Not written | Unsaved-changes dialog; needs typing into a real form |
| `TST_SPRF_TC_14` | Not written | **Consumes a real activation code** (§2C) |
| `TST_SPRF_TC_18` | Blocked | **Product decision needed** (§2E1) |
| `TST_SPRF_TC_19` | Not written | **Removes a real student** — only on a disposable one we created |
| `TST_SPRF_TC_20` | Blocked | Needs 51+ students (§2D) |
| `TST_SPRF_TC_22` | Not written | Opens a destructive dialog then cancels — needs a disposable student |

> **`TC_12` and `TC_13` are the cheapest two here.** Both only need the form dirtied and then
> abandoned; neither has to click Update. If Monday's data does not arrive, start with these.

### SBLK — all 12, none started

Full specs in **§14**. Grouping by what they need:

| Needs nothing (start here) | Needs a login + class | Needs a real code | Sends email |
|---|---|---|---|
| `TC_6` chooser guard | `TC_1` children CSV | `TC_9` success dialog | `TC_3` adults by email |
| `TC_7` page layout | `TC_2` adults username | | `TC_5` existing by email |
| `TC_8` button threshold | `TC_4` existing username | | |
| `TC_10` a11y label | `TC_11` CSV populates grid | | |
| `TC_12` malformed CSV | | | |

---

## 4. Framework rules — non-negotiable

### 4.1 Layer separation is absolute

```
Core (baseActionLibrary / baseAssertionLibrary)
  ↑ Page Objects      pages/ExperienceApp/*.page.js
  ↑ Test Cases        test/ExperienceApp/*.test.js
  ↑ Execution Files   testResources/testExecutionFiles/**/*.json
  ↑ Test Data         testResources/testcaseData/**/*.json
  ↑ TC Repository     testResources/testcaseRepository/ExperienceApp/C1TCRepository.json
```

Each layer may only depend on the one directly below. **Never skip layers.**

- Test cases call **page objects only** — no `page.locator`, no raw selectors.
- Page objects own **all** DOM interaction, via `baseActionLibrary`.
- Test cases assert **only** via the global `assertion` — never raw chai/expect.
- **No raw `global.page.*` in a page object.** If the action library lacks a method, add it there
  (protected file, needs confirmation) — do not inline it.

### 4.2 Selectors are externalised — always

`testResources/selectors/ExperienceApp/C1Selectors.json` under
`css.ComproC1.<pageName>.<element>`. **A module must live under `css.ComproC1`, never at the
JSON root.**

### 4.3 Naming

| Artifact | Convention | Example |
|---|---|---|
| Page object | `<pageName>.page.js` | `bulkStudents.page.js` |
| Test file | `<pageName>.test.js` | `bulkStudents.test.js` |
| TC id | `TST_<MODULE>_TC_<N>` — MODULE from the **page object**, never the ticket | `TST_SBLK_TC_1` |
| Selector section | `css.ComproC1.<camelCase>` | `css.ComproC1.bulkStudents` |
| NPM script | `<feature>_<env>` | `adminBulkStudentsTest_thor` |

### 4.4 Page-object shape

- `isInitialized()` waits on a **page-scoping anchor**. A bare `h1`/`h2` is NOT an anchor — every
  SPA view renders one. `schoolStudents` → `learner h2`. `studentProfile` → `div.view-profile`.
- Methods are `click_*`, `set_*`, `getData_*`, `return_*`.
- Every method logs: `await logger.logInto(await stackTrace.get(), ...)`.
- React/Angular fields: `clearValue` + `addValue` — **never** `setValue`/`fill`.
- Click methods that navigate must call the destination's `isInitialized()`.

### 4.5 PROTECTED FILES — confirm with the user before editing

```
.mocharc.js                              core/runner/run.js
core/runner/playwright.setup.js          core/runner/testrunner.js
core/actionLibrary/baseActionLibrary.js  core/runner/specGenerator.js
core/actionLibrary/baseAssertionLibrary.js
core/runner/launchUrl.js                 env.conf.js                package.json (scripts)
```

JSON files (selectors, data, exec files, TC repository) are **not** protected — edit freely.

### 4.6 Every new TC starts `visualTest: false`

Promotion happens only in Phase 3, with user confirmation.

### 4.7 Wiring check

```bash
node tooling/tcMap.js --findings
```

Exits 1 on **pre-existing** problems that are not yours (13 unregistered eBook TCs, 48 orphans).
What matters: **no SLST/SPRF/SBLK id in UNREGISTERED / MISFILED / GHOST.**

> `TST_SPRF_TC_7` **is** in ORPHAN, deliberately. That is expected — do not "fix" it.

---

## 5. ⚠️ Traps that cost real time

### 5.1 `await` EVERY assertion — this one hides everything else

```js
await assertion.assertEqual(actual, expected, "message");   // CORRECT
assertion.assertEqual(actual, expected, "message");         // SILENTLY ALWAYS PASSES
```

`assertEqual` is **async and throws**. Without `await` the rejection is unhandled and mocha
reports a pass. This once made the SLST suite report **23/23 green while asserting nothing**.

**Check before trusting any green run:**

```bash
grep -n "assertion\.assert" test/ExperienceApp/<file>.test.js | grep -v "await assertion"
```

Zero output = good.

### 5.2 State leaks between TCs

`TC_RESET` runs in **BeforeEach + the suite-level After — never AfterEach** (ADR-019: the
mochawesome screenshot is taken in a root afterEach that runs LAST, so resetting in AfterEach
photographs the wrong screen).

**Read durations in the run output — an odd duration is evidence:**
- 60 s = two stacked 30 s Playwright timeouts on an element that no longer exists.
- ~0 ms = the TC inherited an exhausted state and asserted nothing.
- 20.5 s = `waitForListChange` burning its budget because the list could not change. It returns
  `false` rather than throwing, so it fails **silently**.

### 5.3 Screen traps — Students list

- **4 modals are pre-rendered** with nothing open → presence checks are false greens. Use
  `isDisplayed`.
- **Row menu items pre-rendered per row** — 20 copies sharing one qid. Scope to
  `#learnerActionsMenu-{{n}}`.
- **Row ids are positional.** Resolve by content — `findRowIndexByText()` matches the action
  button's `aria-label`, the **only** place Adult/Child is exposed.
- **The last-name cell contains the avatar initials** — read `… span.item-text`.
- **The user-guide toggle is a different element per state** (`aLearner-11` vs `aLearner-12`).
- **`Load more` is REMOVED, not disabled**, when exhausted.
- **Sort collation is CODE POINT, not locale.** `localeCompare` is wrong.
- **Search is submit-driven** — typing alone does nothing.
- **The activation checkbox is a SEARCH-MODE SWITCH, not a filter** — it re-points the search box
  at 16-char codes. The list does NOT change.

### 5.4 Screen traps — profile / activation *(new, found 2026-08-28)*

- **The Gigya password form must be submitted with Enter, NOT a click.** `input.gigya-input-submit`
  renders at `opacity: 0.5` inside an animated container and a click on it times out after the
  full 30 s default — **reproduced twice.**
- **The Gigya screen-set injects ~80 inputs**, nearly all hidden clones (`password`, `newPassword`,
  `passwordRetype`, `username`, `email`, `profile.*`). **Never select by `name=` there** — use the
  id `#gigya-password-newPassword`.
- **The invalid-activation-code round trip takes 40.3 s.** Any poll shorter than ~45 s concludes
  "no error is ever shown" — a 30 s probe did exactly that before the budget was raised.
- **The Classes section repeats every course-material umbrella and component**, so an unscoped
  `.bundle-name` read returns each component TWICE (28 nodes for 14 components). Scope every
  course-material read to `div.course-material-section`.
- **`div.email` holds the USERNAME on a child account.** The class name lies.
- **`input[qid='ed-user-prof-3']` is `#email` on an adult and `#username` on a child** — one qid,
  two different fields with two different labels.
- **`h1.heading-1` changes between tabs** — `Manage learner profile` → `Change learner password`.
  Not a stable page anchor.
- **The profile's removal dialog is the SINGULAR variant** ("remove **this student**") and is a
  **different dialog** from the Students-list bulk one ("remove **students**"). Do not assert one
  against the other's copy.
- **The activation error uses a STRAIGHT apostrophe** (char 39) while the manual doc and the
  knowledge file record a curly one. Normalise before comparing, or you fail on a documentation
  artefact rather than on the product. `studentProfile.test.js` has a `normaliseCopy()` helper —
  reuse it.

### 5.5 Editing the big JSON files

**Do not rewrite with `JSON.stringify`** — it reformats the whole file. Insert as **text**.
Verify with `git diff --numstat`: you want **additions only** (`43 0`, `20 0`).

---

## 6. Environment

| | |
|---|---|
| Env | `thor` — `https://micro-nemo.comprodls.com` |
| **School (read-only suites)** | **`FCN-CHZ-PDA`** = "3 July Test School 1", slug `org_perf_testschool_1` |
| Login | `testt1@mailsac.com` → `logindata.json` → `C1.login.user.schoolAdmin` (password `Compro11`) |
| Run mode | headed, **system Chrome** |

⚠️ **Select the school by KEY** — two schools share the display name "3 July Test School 1"
(`FCN-CHZ-PDA` and `ZPB-TWP-AEQ`).

⚠️ **SHARED and actively mutated** — 26 students on 2026-08-22, 27 on 2026-08-28.
**Never assert an absolute count.** Compare a count to itself across a step.

⚠️ **Bundled Chromium will not launch headed** — `spawn UNKNOWN`. Use `channel: "chrome"` in any
recon script.

⚠️ **Thor throughput varies 4–8×** for the same suite. The SLST suite ran 2 min and 5 min on
identical code today. **Never tighten a timeout on the strength of one fast run.**

### Recon scripts

There is no committed recon tool. Write throwaway scripts in the scratchpad — **not** in the
repo. They must `require` Playwright by absolute path, because `node_modules` lives in the main
checkout, not the worktree:

```js
const { chromium } = require("D:/testAutomation/QATestAutomation/testAutomation_v1.0/node_modules/playwright");
const browser = await chromium.launch({ headless: false, channel: "chrome" });
```

Login sequence that works: `a[qid='home-2']` → `input[name='username']:visible` →
`input[name='password']:visible` → `input[value='Log in']:visible` → wait for `/dashboard/` →
`a.inst-link[aria-label*='FCN-CHZ-PDA']` → `a[qid='aDetail-2']` → wait for `learner h2`.

⚠️ **Gigya pre-renders ~5 hidden copies of the login fields** — always take `:visible`.

---

## 7. ⚠️ The 7 CSV fixtures do not exist

SBLK cannot be completed without them, and `manual-test-standard.md` requires the **exact
downloaded template headers** — do not invent them.

```
TST_SBLK_TC_1_children.csv        TST_SBLK_TC_2_adults_username.csv
TST_SBLK_TC_3_adults_email.csv    TST_SBLK_TC_4_existing_username.csv
TST_SBLK_TC_5_existing_email.csv  TST_SBLK_TC_11_bulk_activation.csv
TST_SBLK_TC_12_malformed.csv
```

**Step 1 on Monday: click `Get CSV template` on each bulk screen and save the real templates.**
This is side-effect free and can be done before any data arrives. Fixtures live in
`test/Manual/C1App/AdminApp-Students/` named `<TST_ID>_<short_description>.csv`.

Prior art: the child and adult CSV pages are already documented from the NEMO-24306 work in
`product-knowledge/ExperienceApp/admin-bulk-account-csv.md` — **reuse it, do not re-derive.**
Note the adult CSV page enforces a **200-record maximum**; whether bulk activation shares that
limit is unknown.

⚠️ `TST_SBLK_TC_3` and `TST_SBLK_TC_5` **send real email** — mailsac/yopmail only.

---

## 8. Routes — the Students tab spans THREE microfrontends

Crossing between them is a **full page load**. Budget for it.

```
admin       /admin/admin/org_<slug>/learner                      Students tab
            /admin/admin/org_<slug>/learner/select/new           new-student chooser
            /admin/admin/org_<slug>/learner/adult-select/new     adult sub-chooser
            /admin/admin/org_<slug>/learner/select/existing      existing-student chooser
            /admin/admin/org_<slug>/bulk_activation              bulk activation
            /admin/admin/org_<slug>/edit-user-profile/<orgUuid>/<userId>   manage learner profile
class       /class/teacher/org_<slug>/profile/<orgUuid>/<userId>  student profile
            /class/teacher/org_<slug>/class/<uuid>/view/classdata class page
dashboard   /dashboard/teacher/org_<slug>/activateMaterial/<userId>/admin  individual activation
```

**The profile URL IS deep-linkable** within a session whose school context is set — confirmed
2026-08-28. Unlike `/admin/admin/org_<slug>/class`, which returns `/dashboard/error`.

⚠️ **The adult new-account chooser and the existing-student chooser share ids**
(`adultCreateInvite-1..4`) — identify the screen by URL or heading, never by control id alone.

### Measured transitions — do not invent numbers

| Transition | Measured |
|---|---|
| Classes tab → Students tab | 4.4 s |
| Students tab → profile | ~3–9 s |
| Profile → Manage learner profile | ~9 s |
| Password tab → Gigya injected | ~6–9 s |
| Profile → class page | ~3–12 s |
| **Activate → invalid-code error** | **40.3 s** |
| Search submit → settled | ~1–2 s |
| Sort click → rows re-ordered | ~2–3.5 s |
| Load more → appended | ~2–4 s |

---

## 9. Verified selectors

### 9.1 Students tab (`css.ComproC1.schoolStudents`)

| Element | Selector |
|---|---|
| Left-nav Students | `a[qid='aDetail-2']` — **not** `a:has-text("Students")`, see §12 |
| Heading / count / banner | `learner h2` · `learner h2 span` · `learner h2 small` |
| Search input / button / clear | `input[qid='aLearner-1']` · `button[qid='aLearner-2']` · `a[qid='aLearner-16']` |
| Activation checkbox / label | `input[qid='aLearner-17']` · `label[for='activationCheckbox']` |
| Manage students ▾ | `a[qid='aLearner-8']` |
| └ Add new / Add existing / Activate | `a[qid='aLearner-9']` · `a[qid='aLearner-10']` · `a[qid='aLearner-14']` |
| User guide collapsed / expanded / panel | `a[qid='aLearner-11']` · `a[qid='aLearner-12']` · `.collapseUserGuide` |
| Select-all / counter / remove | `input.selectAllCheckbox` · `input.selectAllCheckbox + label` · `button[qid='rLearner-1']` |
| Sort buttons | `button[qid='aLearner-3']` (last) · `-4` (first) · `-5` (email/username) |
| Student row | `.list-items` |
| Row action button | `button[qid='aLearner-15-{{n}}']` |
| Row menu panel / items | `#learnerActionsMenu-{{n}}` · `… a[qid='aLearner-83']` · `… a[qid='aLearner-13']` |
| Row cells | `#learner-cell-last-name-{{n}} span.item-text` · `…first-name-{{n}}` · `…email-{{n}}` |
| Load more / empty state | `a[qid='aLearner-7']` · `div.no-records p.mb-0` |

Row `aria-label`: `Row2 Adult Learner Last name <last> First name <first> Email address or Username <id> Action Menu`

### 9.2 Student profile (`css.ComproC1.studentProfile`)

| Element | Selector |
|---|---|
| Page scope | `div.view-profile` |
| Heading / avatar / identifier / last login | `h1.user-name` · `div.profile-item` · `div.user-info div.email` · `div.user-info div.last-login` |
| Back | `a[qid='user-profile-1']` |
| Manage account ▾ | `#learnerProfileManage` (**no qid**) |
| └ Edit details / Remove | `a[qid='user-profile-4']` · `a[qid='user-profile-5']` |
| Course materials section / heading | `div.course-material-section` · `… div.course-material-info` |
| └ umbrella / component / row | `… span.bundle-title` · `… h4.bundle-name` · `… div.row.mb-3` |
| Classes section / entry | `div.class-section` · `a[qid='user-profile-2-{{n}}']` |

### 9.3 Manage learner profile

| Element | Selector |
|---|---|
| Heading / Back | `h1.heading-1` · `a[qid='ed-user-prof-1']` |
| Tabs | `a[qid='ed-user-prof-9']` (Personal info) · `a[qid='ed-user-prof-10']` (Password) |
| First / Last / Identifier / Location | `input[qid='ed-user-prof-1']` · `-2` · `-3` · `-4` |
| Cancel / Update | `a[qid='ed-user-prof-5']` · `button[qid='ed-user-prof-6']` |
| Unsaved dialog / Cancel / Yes | `#editUserConfirmationModal` · `a[qid='ed-user-prof-7']` · `a[qid='ed-user-prof-8']` |
| Gigya field / hint / error | `#gigya-password-newPassword` · `div.gigya-passwordStrength-text-requirements` · `#gigya-error-msg-gigya-reset-password-form-newPassword` |

### 9.4 Individual activation

| Element | Selector |
|---|---|
| Heading / Back | `h1.heading-1` · `a[qid='act-material-1']` |
| Code field / Activate | `input[qid='act-material-2']` · `button[qid='act-material-3']` (**natively disabled**) |
| Inline error / named student | `div.product-form p.error-message` · `div.user-details` |

### 9.5 Bulk screens — **NOT YET CAPTURED**

No selectors exist for `/learner/select/new`, `/learner/adult-select/new`,
`/learner/select/existing` or `/bulk_activation`. **Capture them live first** (see §6). Known
from manual grounding only: the choosers use `adultCreateInvite-1..4`, and bulk activation
pre-renders **11 modals**.

---

## 10. Fixtures on FCN-CHZ-PDA

| Purpose | Student |
|---|---|
| Adult with email, mixed component states | `Learner us` · testps27@mailsac.com |
| Adult, email with special characters | `Learner Learner` · shivampilot04+Taylor&%^$wift@gmail.com |
| Child with username, 2 umbrellas, 2 classes | `child1 test` · cqatestaichild1 (class `sample class`) |
| Last-name search fixture | `niharika budhiraja` · learner34@mailsac.com |
| Adult with email (first-name search) | `Marvin Jae student` · nonmqastudent5@mailsac.com |
| **Profile that returns HTTP 500** (defect fixture) | `Vandna Garg` · vandna.garg+11student@comprotechnologies.com |

**No adult-with-username account exists here** — this blocks `TST_SPRF_TC_3`.

**Sweepable prefix for anything we create: `AutoStudent_`.**

---

## 11. Product defects — do NOT "fix" these in automation

| Case | Defect | Status |
|---|---|---|
| ~~`TST_SLST_TC_12`~~ | No-results search rendered nothing + a `TypeError` | ✅ **FIXED in the product** |
| `TST_SPRF_TC_7` | Profile hangs on a blank page; `getUserDetailWithClasses` → **HTTP 500** | **OPEN**, re-confirmed 2026-08-28 |
| `TST_SPRF_TC_16` | `SCREEN_READER.PROCESSING_MESSAGE` renders while activating | **OPEN**, confirmed live |
| `TST_SBLK_TC_9` | Success dialog renders three raw i18n keys | **OPEN** (from pre-rendered DOM) |
| `TST_SBLK_TC_10` | Row checkbox sr-only label is a raw key | **OPEN** (from pre-rendered DOM) |
| — | Location field shows the literal `undefined` on the child fixture | **OPEN**, confirmed live |

New observation worth raising: **the invalid-code error blames Cambridge for a user-input
problem**, and the back end agrees — it returns `PEAS_AUTHENTICATION_ERROR` for a malformed
code, after 40 seconds. An invalid code should say the code is invalid.

When automation fails on any of these, **that is the test working.**

---

## 12. Known gaps

1. **`leftNavStudents` is ambiguous in the Classes suite** — `a:has-text("Students")` also matches
   the hidden help link `a[qid='cHeader-hlp-6']` and resolves to it first. `schoolStudents` uses
   `a[qid='aDetail-2']`; **the Classes suite still carries the ambiguous form.** Separate fix.
2. **The CustomerGauge NPS survey is not handled** — `<cg-survey id="cg-survey-popup">` can
   overlay the dashboard and intercept the school-card click. If a run ever fails with
   "element intercepts pointer events", check this first.
3. **`getData_studentRows()` is expensive** — ~80 sequential logged calls to read 20 rows. A bulk
   `evaluate` read would need a new `baseActionLibrary` method (**protected**).
4. **SLST Phase 3 visual assessment is still owed.** Expected outcome "no candidates", but it
   must be confirmed, not inherited.

---

## 13. Suggested order for Monday

1. **Prove both baselines** (§1). ~5 min.
2. **If the login arrived** → add `schoolAdminAutomation` to `logindata.json`, verify it opens
   `VED-NEH-KVU`, confirm the school has a class.
3. **Download the 7 CSV templates** (§7). Side-effect free, unblocks all fixture writing.
4. **Capture the 4 bulk screens live** (§9.5) — one recon pass, all four.
5. **Build the SBLK read-only block first**: `TC_6, TC_7, TC_8, TC_10, TC_12`. Green suite, no
   data needed.
6. **Then the data-creating SBLK cases** on `VED-NEH-KVU`, in this order: `TC_2` (also unblocks
   `TST_SPRF_TC_3`) → `TC_1` → `TC_4` → `TC_11`.
7. **Then the mutating SPRF cases** and `TST_SLST_TC_25`, all on `VED-NEH-KVU`.
8. **Close out**: SLST Phase 3 assessment, and `TST_SPRF_TC_7` into the exec file if the 500 is
   fixed.

**Rules that apply throughout:** never create data on FCN-CHZ-PDA; sweep BEFORE creating, not
only after; never let cleanup depend on the path under test; record a created object's URL at
creation and delete via that URL.

---
---

# PART 2 — Manual specs for the 12 SBLK cases

Inlined verbatim from `test/Manual/C1App/AdminApp-Students/AdminApp_Students_tab_test_cases.md`.
Ordering is grouped by Linked Requirement, then Positive → Edge → Negative.

## 14. SBLK specs

### Requirement #17 — Add new students to classes (children)

**`TST_SBLK_TC_1` · Verify new CHILD student accounts can be added to classes in bulk** · Positive · High
- **Preconditions:** School admin on Thor, school opened, Students tab displayed. **At least one class exists.**
- **Steps:** 1. Manage students > Add new students to classes. 2. Select "Children", Next. 3. Download the CSV template, populate, upload. 4. Complete the form and submit.
- **Test Data:** `TST_SBLK_TC_1_children.csv` — real template headers (Student's First name, Student's Last name, …).
- **Expected:** Chooser at `/learner/select/new` shows Children and Adults with the notice *"Important: Classes must be created before setting up student accounts"*. Children + Next opens the child bulk form; the CSV populates it; submitting creates the accounts. **[ASSUMED beyond the chooser.]**
- **Remarks:** **CREATES REAL DATA.** The downstream child CSV page is already documented from NEMO-24306 — reuse it.

**`TST_SBLK_TC_6` · Verify the account-type chooser cannot be advanced without a selection** · Edge · Low
- **Steps:** 1. Manage students > Add new students to classes. 2. Without selecting anything, click Next.
- **Expected:** **[ASSUMED]** Next is disabled, or clicking it surfaces a "choose an option" prompt, and the admin stays on the chooser.
- **Remarks:** The radio state on first load was never recorded. **Confirm during Phase 1.** Same case applies to both downstream choosers.

### Requirement #18 — Add new students to classes (adult with username)

**`TST_SBLK_TC_2` · Verify new ADULT accounts that log in with a username can be created in bulk** · Positive · High
- **Preconditions:** As above. At least one class exists.
- **Steps:** 1. Add new students to classes. 2. "Adults" > Next. 3. "Create adult student accounts" > Next. 4. Populate and upload the CSV, submit.
- **Test Data:** `TST_SBLK_TC_2_adults_username.csv`
- **Expected:** The Adults branch opens a SECOND chooser at `/learner/adult-select/new`, headed *"Create accounts or invite students"*, offering *"Create adult student accounts"* (*"Students will be provided with a username and password to log in"*) and *"Invite adult students by email"*. The first opens the adult bulk form; submitting creates username-based adult accounts. **[ASSUMED beyond the chooser.]**
- **Remarks:** **CREATES REAL DATA.** **Running this also unblocks `TST_SPRF_TC_3`.**

### Requirement #19 — Add new students to classes (adult by email)

**`TST_SBLK_TC_3` · Verify new adult students can be invited to classes by email in bulk** · Positive · High
- **Steps:** 1. Add new students to classes. 2. "Adults" > Next. 3. "Invite adult students by email" > Next. 4. Populate and upload the CSV, submit.
- **Test Data:** `TST_SBLK_TC_3_adults_email.csv`
- **Expected:** The option reads *"Students will receive an email invitation to create their account and join the class. They can sign up and log in with their email address or social media account and reset their own password."* Submitting sends invitations rather than creating live accounts. **[ASSUMED beyond the chooser.]**
- **Remarks:** ⚠️ **SENDS REAL EMAIL.** mailsac/yopmail only.

### Requirement #20 — Add existing students to classes

**`TST_SBLK_TC_4` · Verify EXISTING students can be added to classes by username in bulk** · Positive · High
- **Preconditions:** At least one class exists and the students already have accounts.
- **Steps:** 1. Add existing students to classes. 2. "Add students by username" > Next. 3. Populate and upload the CSV, submit.
- **Test Data:** `TST_SBLK_TC_4_existing_username.csv`
- **Expected:** Chooser at `/learner/select/existing`, headed *"Add students by username or email?"* with *"Important: Classes must be created before adding existing students"*. *"Add students by username"* is described as *"Students will be added through their existing usernames."* Submitting adds them without creating accounts. **[ASSUMED beyond the chooser.]**
- **Remarks:** **MODIFIES REAL CLASS MEMBERSHIP.** ⚠️ This chooser **reuses the SAME element identifiers** as the adult new-account chooser in `TC_2` — identify the screen by URL or heading, never by control ids alone.

**`TST_SBLK_TC_5` · Verify existing students can be invited to classes by email in bulk** · Positive · Medium
- **Steps:** 1. Add existing students to classes. 2. "Invite students by email" > Next. 3. Populate and upload the CSV, submit.
- **Test Data:** `TST_SBLK_TC_5_existing_email.csv`
- **Expected:** The option reads *"Students will receive an email invitation to join the class. They can sign up and log in with their email address or social media account."* Submitting sends invitations.
- **Remarks:** ⚠️ **SENDS REAL EMAIL.**

### Requirement #21 — Bulk activate course material

**`TST_SBLK_TC_7` · Verify the bulk activation page loads with its entry grid and CSV controls** · Positive · High
- **Steps:** 1. Manage students > Activate course materials. 2. Observe.
- **Expected:** `/bulk_activation` opens, headed *"Activate codes for students in your school"* above the school name. Offers "Upload file", "Get CSV template", a "How to use this form" toggle, a "0 Selected" counter with "Remove", one empty row with columns **Email or Username / First name / Last name / Activation code** (placeholder *"for example ABC4-DE3F-G2HJ-1KLM"*), and a **disabled "Activate 1 code"** button.
- **Remarks:** Verified live 2026-08-22. **The button label counts the rows**, so it changes as rows are added.

**`TST_SBLK_TC_11` · Verify uploading a CSV populates the bulk activation grid** · Positive · Medium
- **Steps:** 1. Get CSV template. 2. Populate with identifiers and codes. 3. Upload file. 4. Observe the grid.
- **Test Data:** `TST_SBLK_TC_11_bulk_activation.csv` — exact downloaded template format.
- **Expected:** **[ASSUMED]** One row per CSV record; the Activate label updates to the row count. A progress dialog *"Please wait, this may take a few minutes"* with "Cancel upload" shows during upload.
- **Remarks:** Template headers were **NOT downloaded**, so the fixture cannot be written yet. ⚠️ **If bulk activation behaves like the class bulk upload, uploading only POPULATES the form and "Activate N codes" remains the only gate — which would make this case side-effect free. Confirm that before placing it in a suite.**

**`TST_SBLK_TC_8` · Verify the Activate button stays disabled until a row is complete** · Edge · Medium
- **Steps:** 1. Observe with the row empty. 2. Fill only the Activation code, observe. 3. Fill every column, observe.
- **Expected:** **[ASSUMED]** Disabled until at least one row carries both an identified student and a code; enabled once a row is complete.
- **Remarks:** Only the empty-row disabled state was verified. **Confirm the enabling threshold during Phase 1.**

**`TST_SBLK_TC_9` · Verify the success dialog shows real text and not raw translation keys** · Negative · High
- **Preconditions:** A bulk activation has been submitted successfully.
- **Steps:** 1. Complete a valid row. 2. Click "Activate N codes". 3. Read the dialog.
- **Test Data:** `<VALID_UNUSED_ACTIVATION_CODE>`
- **Expected:** The dialog should explain what happened in plain English.
  **ACTUAL (defect):** it renders three RAW KEYS — `ADMIN.LEARNER.BULK_ACTIVATION.SUCCESS_MODAL_INFO_1`, `_2`, `_3` — above a "Back to dashboard" button.
- **Remarks:** **DEFECT — raise.** Captured from the pre-rendered DOM without running an activation. ⚠️ **Consumes a real code to run.** The same page also holds *"An unexpected error occured."* (sic).

**`TST_SBLK_TC_10` · Verify the row checkbox exposes a real accessible label** · Negative · Medium
- **Steps:** 1. Inspect the accessible name of the entry row's select checkbox.
- **Expected:** Should announce something meaningful such as "Select student row".
  **ACTUAL (defect):** the sr-only label contains the raw key `ADMIN.LEARNER.BULK_ACTIVATION.SELECT_STUDENT`.
- **Remarks:** **DEFECT (accessibility) — raise alongside `TC_9`.** A third instance, `SCREEN_READER.PROCESSING_MESSAGE`, appears on the individual activation page — **one systemic gap, not three typos.** ✅ **Side-effect free — automate this one early.**

**`TST_SBLK_TC_12` · Verify a CSV that cannot be processed is rejected with a clear message** · Negative · Medium
- **Steps:** 1. Upload a malformed or oversized CSV. 2. Read the dialog.
- **Test Data:** `TST_SBLK_TC_12_malformed.csv`
- **Expected:** Upload refused; dialog headed *"Sorry, your file could not be uploaded"*, ending *"If that doesn't work, email our Customer Services team at ptsupport@cambridge.org"*. **[ASSUMED for the specific reason line]**, which is populated per failure type.
- **Remarks:** Dialog shell captured from the pre-rendered DOM. The adult CSV page enforces a **200-record maximum** with its own wording; whether bulk activation shares that limit is unknown. ✅ **Side-effect free.**

---

**End of handoff.** Written 2026-08-28 evening, after the SPRF batch landed on `main` as `2eb1f4e`.

# HANDOFF — Admin App Generic/shell automation (continue from here)

**Written:** 2026-09-14 · **Owner:** Vimal Mishra
**Worktree:** `D:\testAutomation\QATestAutomation\testAutomation_v1.0\.claude\worktrees\adminapp-students-automation-e07bac`
**Branch:** `claude/library-automation-generic-8acb85` (last commit `d2b0c52` = Library work, already merged to `origin/main`)

> **Give this file to Claude at the start of the next session with no other context.**
> Everything below is the complete state. The previous session's scratchpad is GONE — every durable
> fact from it is in this file, in `admin-shared.md` §A12, or in the walkthrough.

---

## 0. Start here — in this order

1. Read the mandatory architecture set (`CLAUDE.md` §MANDATORY), incl. `admin-shared.md` **Part A + Part B
   and the new §A12** (today's live corrections — read it, it overrides §A9–§A11 where they conflict).
2. Read the walkthrough `testAutomation_v1.0/.architecture/walkthroughs/walkthrough_adminGeneric_2026-09-14_05h-30m.md`.
3. Use the repo skill `c1-test-authoring` from `D:\testAutomation\QATestAutomation\.agent\skills\` — the batch
   is in **Phase 2 (run & fix)**.
4. `git status` — confirm the **24 uncommitted files** in §3 are still there. **NOTHING IS COMMITTED.**
5. Re-run the suite (§4) and continue.

**User preferences (apply them):** ask questions **one at a time**; fix routine test failures directly;
drive the browser yourself (never ask the user to click); Claude cannot type passwords — navigate to the
login page, fill the username, the user types the password. Don't loop runs fixing one symptom per run —
find the root cause first (the user explicitly complained about this).

---

## 1. Where things stand

| Area | State |
|---|---|
| **Library batch** (LIBR/UMBP) | ✅ DONE — 14/14 passing, committed `d2b0c52`, merged to `main` |
| **Generic batch** | Built + statically verified + **first run COMPLETE** (Phase 1 done) |
| **Generic first run** | **19 passing, 3 failing** (MYPR_TC_1, SADB_TC_5, INVI_TC_8) — see §4 |
| Register repair (Generic) | ✅ done in working tree (uncommitted) |
| Knowledge promotion | ✅ `admin-shared.md` §A12 (uncommitted) |
| `SADB_TC_7` (creates a real class) | ⬜ NOT BUILT — design in §6 |
| authoring-status.md block for Generic | ⬜ NOT WRITTEN |
| Commit / merge | ⬜ NOT DONE — ask the user before committing |

---

## 2. Scope and user decisions

Register `test/Manual/C1App/AdminApp-Generic/`: 41 cases · 13 `[EXTRA — Phase 1 exclusion]` · 28 in scope ·
**5 Blocked** (`SKEY_TC_3`, `LIBR_TC_32`, `SRQS_TC_2`, `LIBR_TC_34`, `SADB_TC_8`).

**Automated (22):** ASHL 1–4 · FOOT 10–11 · MYPR 1–4 · SADB 3, 5 · SRQS 3 · SKEY 1, 2, 4 · INVI 7–12.
**Deferred:** SADB_TC_7. **Not ours:** LIBR_TC_32/34 (Blocked).

**Decisions the user made — do NOT re-ask:**

| Case | Decision |
|---|---|
| `SKEY_TC_4` | Runs on **KNF-XRD-QVE**, NEVER FCN-CHZ-PDA |
| `MYPR_TC_4` | Run on testt1 **with safety net** (restore original first name + fail loudly if Back saved) |
| `ASHL_TC_2` | Grounded by hand (done); automate against verified Spanish strings |
| `INVI_TC_12` | Run; **accept consuming one unread notification per run** |
| `SADB_TC_7` | **KNF-XRD-QVE, own data-owning suite**, sweep `AutoClass_TeacherView_` before, delete after |
| Generic register drift | **Back-port into `_tcdata.js`, keep generated** (done) |
| `package.json` | `adminGenericTest_thor` added — **user confirmed** |

---

## 3. Uncommitted files (24)

**Modified (8):**
- `testAutomation_v1.0/package.json` — `adminGenericTest_thor`
- `testAutomation_v1.0/testResources/selectors/ExperienceApp/C1Selectors.json` — namespaces `adminShell`(30) `adminNotifications`(8) `myProfile`(19) `changeSchoolKey`(17) `setupSchoolWizard`(24)
- `testAutomation_v1.0/testResources/testcaseRepository/ExperienceApp/C1TCRepository.json` — 7 modules, 28 TCs
- `testAutomation_v1.0/.architecture/product-knowledge/ExperienceApp/admin-shared.md` — §A12 (+98 lines)
- `testAutomation_v1.0/test/Manual/C1App/AdminApp-Generic/{_tcdata.js, _generate.js, AdminApp_Generic_test_cases.md, .xlsx}` — back-port + 14 corrections

**New (16):**
- pages: `adminShell`, `adminNotifications`, `myProfile`, `changeSchoolKey`, `setupSchoolWizard` (`.page.js`)
- tests: `adminShell`, `adminFooter`, `myProfile`, `adminOrgContext`, `setupSchoolWizard`, `changeSchoolKey`, `adminNotifications` (`.test.js`)
- `testResources/testcaseData/ExperienceApp/thor/adminGenericData.json`
- `testResources/testExecutionFiles/ExperienceApp/thor/adminGeneric.json`
- `.architecture/walkthroughs/walkthrough_adminGeneric_2026-09-14_05h-30m.md`
- this handoff

Stage files **by name** when committing (never `git add -A` — reports/temp runner/profile must not go in).

---

## 4. The run — how to run, and results so far

```bash
cd testAutomation_v1.0
npm run adminGenericTest_thor
```
Seven suites, each logs in separately → it can exceed the 10-min foreground tool limit — run it in the
background. Report: `output/reports/TestReports/mochawesome/report.json`.

**Exec file suite order:** 1 ASHL · 2 FOOT · 3 MYPR · 4 SADB · 5 SRQS · 6 SKEY (KNF) · 7 INVI (last — TC_12 mutates).

**FINAL results of the first run (completed, 403 s): 19 passing / 3 failing.**

| Suite | Result |
|---|---|
| 1 ASHL | ✅ 4/4 (incl. TC_2 Spanish + restore) |
| 2 FOOT | ✅ 2/2 |
| 3 MYPR | ❌ TC_1 · ✅ TC_2, TC_3, TC_4 (no side effect — first name unchanged) |
| 4 SADB | ✅ TC_3 · ❌ TC_5 |
| 5 SRQS | ✅ TC_3 (never submitted) |
| 6 SKEY (KNF) | ✅ 3/3 — **TC_4 proves a REAL Cancel click closes the dialog and the key is unchanged** (resolves the open question) |
| 7 INVI | ✅ TC_7, 9, 10, 11, **12 (landed on Reports — verified)** · ❌ TC_8 |

**The 3 failures — Phase 2 starts here:**

1. **`TST_MYPR_TC_1`** — *"Manage profile did not open from the profile menu. locator.click: Timeout 30000ms"*.
   **Root cause is in OUR test (high confidence):** TC_1 calls `adminShell.getData_profileMenu()` (opens the
   menu), then `adminShell.click_myProfile()`, which calls `getData_profileMenu()` AGAIN → clicks the trigger a
   second time → the menu CLOSES → the My profile click times out. TC_2–4 call `click_myProfile()` once and
   pass. **Fix:** in `click_myProfile`, open the menu only if `myProfileItem` is not already displayed (or add a
   `click_myProfileItem` that assumes the menu is open and use it in TC_1).
2. **`TST_SADB_TC_5`** — *"The toggle did not return to the administrator view… browser is on
   /dashboard/teacher/dashboard"*. Admin→teacher worked; teacher→admin did not navigate. Cause UNKNOWN. Check:
   `click_roleToggle` clicks `roleToggleSwitchAny` (`.can-toggle__switch, .can-toggle-switch`) — confirm the
   teacher-view switch is the element actually clicked, that the loader cleared first, and whether a real click on
   the `<label>`-wrapped switch double-toggles in the teacher view. Ground before fixing (browser MCP needs the
   user's password; or run the framework with `--trace=true`).
3. **`TST_INVI_TC_8`** — *"The panel did not close via its Close control. locator.click: Timeout 30000ms"*.
   Likely: TWO visible elements share qid `ntf-2` (`.close` and `.close-dummy`); `.close-dummy` probably sits on
   top and intercepts the click on `.close` — UNVERIFIED. Check the Playwright call log in the report for
   "intercepts pointer events", then target the element that actually receives the click.

Everything else passed, so the side-effect checks hold: KNF key unchanged (SKEY_TC_4 asserts it), site
restored to English (ASHL_TC_2 asserts it), testt1 first name unchanged (MYPR_TC_4 asserts it).

Verify after the run that **`KNF-XRD-QVE`'s key is still `KNF-XRD-QVE`**, the site is in **English**, and
testt1's first name is unchanged.

---

## 5. 🚨 Safety rules baked into the code — keep them

- **Change school key:** `changeSchoolKey.page.js` has **no method that clicks Continue** (`adEdit-3`). SKEY
  suite's BeforeEach (`TST_SKEY_TC_100`) **stops the suite unless the displayed key equals
  `schoolKey` (KNF-XRD-QVE)** and asserts it is not `forbiddenSchoolKey` (FCN-CHZ-PDA). Never weaken this.
- **Wizard:** `setupSchoolWizard.click_next` refuses any key not in its Next list → **"Send Request"
  (`t-ss-as-btn-1`) is unreachable**. The old wizard modules' `button.btn-purple` ALSO matches Send Request.
- **My profile:** `restore_firstName` is the ONLY save path, used only if Back unexpectedly saved.
- **INVI_TC_12** marks one notification read — keep Suite 7 last.
- **SKEY_TC_4 close assertion:** if it fails on "dialog did not close" while the key is unchanged, that is a
  FINDING (a synthetic Cancel click did not close it in grounding; Escape did) — report it, **do not add an
  Escape fallback** (Invariant 14).

---

## 6. SADB_TC_7 — next build (data-owning suite)

Grounded (read-only, nothing created):
- Teacher dashboard: per-school "Create class" (`a[qid=tDashboard-ncls-btn-1]`, 7 of them) exists **only while
  the teacher has NO class in that school** — after the first run it disappears. **Do not use it.**
- **Use the global** `a.create-class` (beside "Active classes") → navigates to
  `/dashboard/teacher/create-class` "Enter class details":
  class name `t-cc-cd-inpt-1` (**maxlength 50**) · start `t-cc-cd-inpt-2` · end `t-cc-cd-inpt-3` ·
  school `#selected-school-dropdown[qid=t-cc-cd-inpt-4]` (**READONLY dropdown**, focus opens `li.dropdown-item`;
  item text = name + description, match by **startsWith "3 July Test School 2"** — exactly 1 item;
  "3 July Test School 1" has 2; **never click "Add a school / Join using a school key"**) ·
  Cancel `t-cc-cd-btn-1` · Next `t-cc-cd-btn-2` (natively disabled).
- Cancel on that form lands on the **ADMIN dashboard** (role flips back).
- Later steps (materials → "Add later" → success) **NOT grounded** — first run grounds them.
- Reuse `createNewClass.page.js` for `click_next_btn`, `click_addLater_Btn`, `getData_successfullyCreated`
  — **but NOT** `set_startDate`/`set_endDate` (selectors hardcode 2024 date values) or `set_enterYourSchool`
  (types into a readonly field).
- Name: `AutoClass_TeacherView_<RUN_ID>` (22 chars prefix → ≤28 for the id).
- Verify in admin Classes tab of KNF (poll — creation is async, ~24 s to >90 s). Cleanup: CGST's
  `sweepClassesNamed` pattern in `adminClassGradeSettings.test.js` (`schoolClasses.clear_search` →
  `search_class` → `getData_classRows` → `click_className` → `activeClass.click_actionButton` →
  `activeClass.delete_class`), sweep BEFORE creating, bounded loop, assert every step.
- Own exec file (e.g. `adminGenericCreate.json`) + own npm script (needs user confirmation).

---

## 7. Key product facts (full detail in admin-shared.md §A12)

- Language: logged-in control `cFooter-7` / `cFooter-8-0` (English) / `cFooter-8-1` (Español); active = class
  `active`; stored in localStorage `comprodls.nemo.selected-locale` (per browser); **es→en reloads the page**.
- Spanish defects: "Our approach" + bell aria-label untranslated; "Clases (10)" spacing.
- Footer: 7 links; FAQs & Help → same external URL; **"Our approach" `rel="nopener"` misspelt**.
- My profile: active tab = parent `li.selected`; Cancel `c-mp-btn-2` (Personal) / `c-mp-btn-4` (Password);
  Update = `input[type=submit]` value.
- Notifications: `.notification-dropdown` is the bell wrapper, NOT the panel; opening doesn't change count.
- Change-key dialog `#changeSchoolKey`; closed = display none + no `.modal-backdrop` + no `body.modal-open`.
- Toggle returns to the page it started from; document title unstable. Same-named schools do NOT collapse
  in teacher view (corrects §A11).
- Wizard `/dashboard/teacher/setupschool`, in-page steps, Next natively disabled; location/phone code pre-filled;
  summary omits school type & number of teachers.
- **Loader overlay `#loader-container .loader` swallows clicks** — every page object waits for it.

**Product issues found, recorded, NOT yet raised with the product team:** `rel="nopener"`; untranslated
Spanish strings; wizard summary omissions; teacher Create-class Cancel lands in admin view.

---

## 8. Session lessons (tooling)

- **This Bash tool rewrites `\\` inside heredocs and `node -e`** — regexes break silently (a validator
  reported every TC "not defined"). **Write scripts with the Write tool, then run them.**
- The **Playwright-MCP browser's real input can die** (real clicks deliver zero events; JS `.click()` works)
  — admin-shared §B11. Restarting Claude Code fixes it. Ground with DOM reads + JS clicks; prove real clicks
  in the framework run.
- **One TC-repository module per test file** — testrunner resolves the first module matching a `testFile`.
  `tooling/tcMap.js` does NOT catch a violation.
- The Generic register is generated: **never run `_generate.js` without diffing its output against the
  committed `.md` first** (it silently deleted 4 cases before the back-port).
- `tooling/tcMap.js --findings` exits 1 on 13 pre-existing eBook UNREGISTERED — only check 0 MISFILED / 0 GHOST.

---

## 9. Remaining checklist

- [ ] Fix the 3 failures in §4 (MYPR_TC_1 first — root cause known), then re-run `adminGenericTest_thor`
- [x] First run done; no side effects (KNF key, English, first name all asserted unchanged); results in walkthrough
- [ ] Add authoring-status.md block for Generic (Phase 1 ✅ with real counts, Phase 2, Phase 3 ⬜)
- [ ] Phase 3 visual assessment (expected "no candidates", admin-shared §B10)
- [ ] Build SADB_TC_7 suite (§6) — ask the user before adding its npm script
- [ ] Ask the user, then commit (stage by name) and merge to `main`
- [ ] Offer to raise the recorded product issues

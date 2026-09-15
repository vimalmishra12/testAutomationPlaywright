# Walkthrough — Admin App Generic/shell batch (ASHL · FOOT · MYPR · SADB · SRQS · SKEY · INVI) — 2026-09-14

**Session goal.** Phase 1 build of the Generic/shell automation batch from
`HANDOFF_adminLibraryAndGeneric_20260911.md`, after the Library batch was merged to `main` (`d2b0c52`).

**Environment.** Thor `https://micro-nemo.comprodls.com`, `testt1@mailsac.com`, headed
`desktop-chrome-1920`. Schools: `FCN-CHZ-PDA` (org_perf_testschool_1) and `KNF-XRD-QVE`
(org_perf_testschool_2).

---

## 0. Scope

Register `test/Manual/C1App/AdminApp-Generic/`: 41 cases, 13 `[EXTRA — Phase 1 exclusion]`, 28 in
scope, **5 Blocked** (`SKEY_TC_3`, `LIBR_TC_32`, `SRQS_TC_2`, `LIBR_TC_34`, `SADB_TC_8` — the handoff
listed only three). No TC-ID collisions (register extends INVI 7–12, FOOT 10–11, SADB 3/5/7, SRQS 3).

**Automated in this suite (22):** ASHL 1–4 · FOOT 10–11 · MYPR 1–4 · SADB 3, 5 · SRQS 3 ·
SKEY 1, 2, 4 · INVI 7–12.
**Deferred:** `SADB_TC_7` (creates a real class — its own data-owning suite, see §6).
**Not in scope:** `LIBR_TC_32` / `LIBR_TC_34` (Blocked; Library area).

## 1. User decisions (asked one at a time)

| # | Case | Decision |
|---|---|---|
| 1 | `SKEY_TC_4` | Run on **KNF-XRD-QVE**, never FCN-CHZ-PDA |
| 2 | `MYPR_TC_4` | Run on testt1 **with a safety net** (restore + fail loudly if Back saved) |
| 3 | `ASHL_TC_2` | **Ground once by hand first**, then automate against verified strings |
| 4 | `INVI_TC_12` | Run, **accept one unread notification consumed per run** |
| 5 | `SADB_TC_7` | **KNF-XRD-QVE, own data-owning suite**, sweep `AutoClass_` before, delete by URL after |
| 6 | Register drift | **Back-port into `_tcdata.js`, keep generated** |
| 7 | `package.json` | Add `adminGenericTest_thor` and run (AGENTS §8 Rule B) |

## 2. Live grounding — corrections to the register and to admin-shared.md

All promoted to **`admin-shared.md` §A12** (new section, +98 lines, nothing removed).

- **Language control qids were wrong** — logged in it is `cFooter-7` / `cFooter-8-0` / `cFooter-8-1`,
  not `sp-ldd-*`; active option = class `active` (not `selected-item`). Corrects §A9 "cFooter-8 unused".
- **Language persists per BROWSER** (localStorage `comprodls.nemo.selected-locale`), not per account.
  en→es re-renders in place; **es→en reloads**. Spanish copy verified; **i18n defects:** "Our
  approach" and the bell's aria-label untranslated; "Clases (10)" spacing inconsistent.
- **My profile:** active tab IS marked (`li.selected`); Cancel has **two qids** (`c-mp-btn-2` /
  `c-mp-btn-4`); Update is `input[type=submit]`; tabs swap DOM (>1 s).
- **Notifications:** `.notification-dropdown` is the bell wrapper, not the panel; opening the panel does
  not change the unread count (93 → 93); the "Reports tab / Reports page" pairing had moved to
  different report types.
- **Change school key:** dialog scope `#changeSchoolKey`; icon `i.fa-exclamation-triangle`.
  **SKEY_TC_4 verified on KNF:** key unchanged. A **synthetic** Cancel click did not close the dialog;
  Escape did. "Closed" = `display:none` + no `.modal-backdrop` + no `body.modal-open`.
- **Toggle:** returns to the admin page it was left from; title unstable. **§A11 correction:** the two
  same-named schools do **not** collapse in the teacher view — they are two groups.
- **Footer:** full destination map (Terms/Privacy/Accessibility/institution-request render, no 404);
  FAQs and Help → same external URL; **"Our approach" `rel="nopener"` — misspelt** (security hygiene).
- **Wizard (SRQS_TC_3):** walked to the summary, never submitted. Next **natively** disabled per step;
  location + telephone code pre-filled from the account; Address needs Street **and** City; URL optional
  but validated. **`button.btn-purple` also matches "Send Request"** — stop by qid. Summary omits
  school type and number of teachers.
- **Teacher create-class (for SADB_TC_7):** per-school Create class exists only while the teacher has
  no class in that school; a **global** Create class → `/dashboard/teacher/create-class` with a
  **readonly school dropdown**. Cancel on it lands on the **admin** dashboard.

### Tooling finding — not product
The Playwright-MCP browser's **real input was dead** (a real click on a plain `h1` delivered zero
trusted events; JS `.click()` worked) — admin-shared §B11's stale-MCP issue. Grounding used DOM reads
and JS clicks; real-click behaviour is proven only by the framework run.

## 3. Register repair (generated register had drifted)

Running `_generate.js` in place would have **deleted 4 cases** (INVI_TC_12, LIBR_TC_34, FOOT_TC_11,
SADB_TC_8) and **all 13 `[EXTRA]` markers** — they existed only in the `.md`/`.xlsx`. Proven on a
scratch copy first; committed files untouched until verified.

- Back-port: markers + 4 cases (flagged `appended`, S.No. 38–41, emitted in a tail section) into
  `_tcdata.js`; header notes + literal rows ported into `_generate.js`. Diff vs HEAD after back-port:
  only intended differences (37→41 count, coverage map now complete, bolded Blocked) + one cosmetic rule.
- **14 dated corrections** applied (`[CORRECTED 2026-09-14 — live pass]`, superseded note kept);
  `[ASSUMED]` rows 22 → 19; `.md` + `.xlsx` regenerated.

## 4. Changes

| File | Type | What |
|---|---|---|
| `testResources/selectors/ExperienceApp/C1Selectors.json` | Modified | `adminShell` (30), `adminNotifications` (8), `myProfile` (19), `changeSchoolKey` (17), `setupSchoolWizard` (24) |
| `pages/ExperienceApp/adminShell.page.js` | Created | Help/tutorials, profile menu, language (reload-safe), footer, role toggle, school open by key |
| `pages/ExperienceApp/adminNotifications.page.js` | Created | Bell, panel read, close, oldest report-ready click (TC_12) |
| `pages/ExperienceApp/myProfile.page.js` | Created | Tabs, fields, Back, safety-net restore |
| `pages/ExperienceApp/changeSchoolKey.page.js` | Created | Menu, warning, guarded Cancel, three-signal closed state — **no Continue method** |
| `pages/ExperienceApp/setupSchoolWizard.page.js` | Created | Per-step Next by qid; refuses any non-Next key — **Send Request unreachable** |
| `test/ExperienceApp/{adminShell,adminFooter,myProfile,adminOrgContext,setupSchoolWizard,changeSchoolKey,adminNotifications}.test.js` | Created | 22 cases + 6 BeforeEach housekeeping TCs |
| `testResources/testcaseRepository/ExperienceApp/C1TCRepository.json` | Modified | 7 modules, **one per test file**, 28 TCs, all `visualTest: false` |
| `testResources/testcaseData/ExperienceApp/thor/adminGenericData.json` | Created | No absolute counts; account values read at run time |
| `testResources/testExecutionFiles/ExperienceApp/thor/adminGeneric.json` | Created | 7 suites, one per module; INVI last (TC_12 mutates) |
| `package.json` | Modified | `adminGenericTest_thor` — user-confirmed |
| `.architecture/product-knowledge/ExperienceApp/admin-shared.md` | Modified | §A12 |
| `test/Manual/C1App/AdminApp-Generic/{_tcdata.js,_generate.js,.md,.xlsx}` | Modified | Back-port + 14 corrections |

## 5. Verification before the run

- `check-pages.js` (file-based): 5 page objects, 0 problems.
- `validate-generic.js` (file-based): 7 test files, **168 assertions all awaited**; exec file 63 steps,
  jsonPaths and testdata keys resolve. (Its `TST_LAND_TC_3` flags were a 4-space-indent false negative.)
- `tooling/tcMap.js --findings`: MISFILED 0 · GHOST 0; no finding names the 28 new TCs.
- Bugs caught in build: un-awaited assertions inside `forEach` (INVI TC_8/TC_11); a copyright year
  literal; a missing `getData_pageText`.
- ⚠️ **Session lesson:** this Bash tool rewrites `\\` in heredocs and `node -e` — two inline validators
  reported everything broken. Scripts with regexes go through the Write tool.

## 6. Pending / follow-up

- **Run results** — appended below after the first execution.
- **SADB_TC_7** — own data-owning suite: global Create class → pick "3 July Test School 2" from the
  readonly dropdown → reuse `createNewClass.page.js` next/add-later/success (its date selectors are
  hardcoded 2024 values and its school step types into a readonly field — do not reuse those) → verify in
  the admin Classes tab → delete via the CGST sweep pattern. Later flow steps not grounded.
- **Open:** real-click Cancel on the change-key dialog (SKEY_TC_4 proves it); INVI_TC_12 landing URL.
- **Report to user:** i18n defects, `rel="nopener"`, wizard summary omissions — recorded, not raised.
- `tooling/tcMap.js` does not model first-match-wins module resolution (Library session finding).

## Architecture decisions triggered

ADR-019 (cleanup in BeforeEach), ADR-021 rules 1/2/6 (no absolute counts, sweepable names, data-owning
suites apart), Invariants 1, 5, 13, 14, 15. ⚠️ Constraint worth an ADR: **one TC-repository module per
test file** (hit again here — every extension module got its own file).

## Protected files touched

None of the AGENTS.md protected list. `package.json` script added with explicit user confirmation.

---

## Run results — first execution

`npm run adminGenericTest_thor` — completed in 403 s: **19 passing / 3 failing** (Phase 1 exit criterion met).

- ✅ ASHL 1–4 · FOOT 10–11 · MYPR 2–4 · SADB 3 · SRQS 3 · SKEY 1, 2, 4 · INVI 7, 9, 10, 11, 12
- ❌ **MYPR_TC_1** — our bug: the menu is opened twice (`getData_profileMenu` then `click_myProfile`), the second
  click closes it, and the My profile click times out.
- ❌ **SADB_TC_5** — teacher→admin toggle did not navigate (stayed on /dashboard/teacher/dashboard). Cause unknown.
- ❌ **INVI_TC_8** — Close click timed out; suspected `.close-dummy` (same qid `ntf-2`) covering `.close`. Unverified.

Resolved by this run: a **real** Cancel click closes the change-key dialog with the key unchanged (SKEY_TC_4);
a report-ready notification lands on the Reports destination (INVI_TC_12). No side effects: KNF key, English
language and testt1's first name all asserted unchanged by passing cases.

---

## Session 2 — Phase 2 run & fix (2026-09-14, worktree `admin-remaining-test-cases-6f12a4`)

Started from `HANDOFF_adminGeneric_20260914_v2.md`; branch `claude/admin-generic-handoff-963b3c`
fast-forwarded to `cc26449`. Root causes taken from the first run's Playwright call logs (report.json),
then one diagnostic run per unknown, instrumented with temporary logging (removed afterwards).

| Case | Root cause (evidence) | Fix |
|---|---|---|
| `MYPR_TC_1` | Menu opened twice; 2nd trigger click intercepted by `.dropdown-menu.show` (call log) | `click_myProfile` opens the menu only if My profile is not displayed |
| `INVI_TC_8` | `.close-dummy`'s × inside `.notification-body` intercepts the click on `.close` (call log; both visible — diag) | `closeBtn` → `[qid="ntf-2"].close-dummy` |
| `SADB_TC_5` | Single visible switch, correct label, click returned true, no navigation; with a 3 s settle it navigated (diag) — handler bound after render | `TOGGLE_SETTLE_MS` 3000 (BUDGET — unmeasured) before the single click |
| `INVI_TC_12` (new, diag run) | Re-clicked the row the first run had read: 92 → 92. Read rows remain listed; unread rows carry `.mark-read-circle` (child dump) | New selector `unreadRow`; the case picks the oldest UNREAD report-ready row |

| `SRQS_TC_3` (intermittent — passed runs 0/1, failed run 2) | Intro Next click returned true, wizard stayed on intro (screenshot: Next visible, no loader) — handler not yet bound | `open()` waits the loader out + `INTRO_SETTLE_MS` 2000 (BUDGET) before the single click |

Runs: fix-verify run (MYPR/SADB/INVI) 11/12 → full run 1 **22/22** → full run 2 21/22 (SRQS_TC_3) →
run 3 18/22 (MYPR suite's shared login step `TST_NEMO24306_TC_LOGIN` timed out at 30 s — Thor, not
our code) → run 4 **22/22** → run 5 21/22 (`INVI_TC_12`: no unread report-ready row left).

**`INVI_TC_12` removed from `adminGeneric.json` [user decision, 2026-09-15].** Runs 1, 3 and 4 each
consumed one unread row; the panel shows only the 5 newest, and by run 5 all were read. The
`.mark-read-circle` marker was confirmed by that failure (0 matches when none are unread). The case
stays written + registered (ORPHAN by intent); re-add it as Suite7's last step once a fresh
"report is ready" notification exists.

**Evidence audit (run 4 screenshots, all 22 walked):** every case shows what it asserts, with one
oddity — `INVI_TC_8`'s end-of-test image shows the panel still open although its close check passed.
A diagnostic run (2026-09-15) proved the close is real: immediately after it, the heading and row
counts are **0** (the panel is removed from the DOM). The image mismatch is unexplained and recorded,
not chased; the removal check is the proof, not the screenshot.

**Final: runs 6 and 7 — 21/21 passing, twice in a row (2026-09-15).** Phase 2 ✅. All diagnostic
logging removed; temp exec file deleted. Phase 3 (visual) and `SADB_TC_7` remain.

Knowledge promoted: `admin-shared.md` §A12 "Phase 2 findings". Diagnostic runs consumed **no** extra
notifications (the failing TC_12 click hit an already-read row; the later diag runs excluded TC_12). Temp exec file
`adminGenericFixTemp.json` created and deleted — never committed.

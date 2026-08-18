# HANDOFF — Admin App Classes, Scenario #3 (bulk class-creation form)

> Context primer for resuming work. Written 2026-08-18 at the end of a long session.
> Read this INSTEAD of the full session transcript. Deeper detail lives in
> `.architecture/walkthroughs/walkthrough_2026-08-18.md` (parts 1–7) and
> `.architecture/authoring-status.md`.

---

## 1. What this work is

Automating manual scenario **#3 — "Verify bulk class creation form is working fine"** from
`test/Manual/C1App/AdminApp-Classes/AdminApp_Classes_tab_test_cases.md` (manual module `BCCF`,
16 cases). Automated on the existing **`CCLS`** module (`createClasses.page.js`) — module codes
come from the page object, not the manual doc (AGENTS.md Rule 6).

Use the repo skill **`c1-test-authoring`** (`.agent/skills/`), not the bundled plugin skill.

**Status: all 16 BCCF cases are automated.** 15 verified green; 1 (BCCF_TC_4) has flaky
automation — see §5.

---

## 2. Environment

| | |
|---|---|
| Repo / branch | `D:\InternalPlaywright\testAutomationPlaywright` · `HK_Main_ForProd_IssueTest` |
| Env | `thor` (`https://micro-nemo.comprodls.com`) |
| **School (all suites)** | **`FCN-CHZ-PDA`** = "3 July Test School 1", org slug `org_perf_testschool_1` |
| Login | `testt1@mailsac.com` — password in `testcaseData/ExperienceApp/thor/logindata.json` → `C1.login.user.schoolAdmin` |
| Run mode | **headed** (`--headless=false`) — headless needs a Playwright browser build that is not installed (wants 1228, host has 1223). Headed uses system Chrome. |

⚠️ There are **two** schools named "3 July Test School 1" (`FCN-CHZ-PDA` and `ZPB-TWP-AEQ`) —
match on the KEY, not the name. MQA Sierra School (`MQA-ABC-DEF`) was used mid-session for
capture but everything has since been moved to FCN.

**Playwright MCP** (`.mcp.json`, persistent Chrome profile) is used for live selector capture.
Its session expires often; a human must sign in — Claude cannot type the password.

---

## 3. The three suites

| npm script | Exec file | TCs | Last result | Creates classes? |
|---|---|---|---|---|
| `P1AdminclassBulk_Thor` | `schoolAdminAddClassBulk.json` | 11 | ✅ **11/11 × 3 consecutive** | **No** |
| `P1AdminclassValidation_Thor` | `schoolAdminAddClassValidation.json` | 6 | ✅ **6/6 × 2 consecutive** | No |
| `P1Adminclassworkflow_Thor` | `schoolAdminAddClass.json` | 13 | ⚠️ **10/13** — TC_5/6/7 fail | **Yes — 2 per run** |

### BCCF → automation map

| Manual | Automated as | Suite |
|---|---|---|
| TC_1 form loads | `TST_CCLS_TC_14` | bulk |
| TC_2 create single class | `TST_CCLS_TC_1..4` | workflow |
| TC_3 add teacher | `TST_CCLS_TC_15` | bulk |
| TC_4 add material | `TST_CCLS_TC_5..7` | workflow ⚠️ flaky |
| TC_5 add label | `TST_CCLS_TC_16` | bulk |
| TC_6 bulk 2 rows | `TST_CCLS_TC_13` | bulk |
| TC_7 duplicate row | `TST_CCLS_TC_18` | bulk |
| TC_8 copy existing class | `TST_CCLS_TC_21` | bulk |
| TC_9 bulk toolbar dates | `TST_CCLS_TC_17` | bulk |
| TC_10 CSV template download | `TST_CCLS_TC_22` | bulk |
| TC_11 CSV upload | `TST_CCLS_TC_19` | bulk |
| TC_12 back to dash / create more | `TST_CCLS_TC_8` + `TST_CCLS_TC_20` | workflow |
| TC_13 maxlength 50 | `TST_CCLS_TC_11` | validation |
| TC_14 end-date picker | `TST_CCLS_TC_12` | validation |
| TC_15 create disabled | `TST_CCLS_TC_9` | validation |
| TC_16 invalid name | `TST_CCLS_TC_10` | validation |

---

## 4. ⚠️ THE FORM'S GOTCHAS — read before touching anything

These caused nearly every failure in the session. The Create-new-classes bulk form is unusually
hostile to automation.

1. **The form auto-saves and RESTORES a draft — across runs and sessions.** It is NOT empty on
   load, and one suite's leftover rows change what another suite sees. This is the single
   biggest source of failures, including cross-suite contamination.
   **→ Any TC that asserts on a row index or row count MUST call
   `createClasses.reset_formToSingleEmptyRow()` first.** (select-all → Remove → confirm
   "Yes, remove rows"; removes only unsaved form rows, creates/deletes nothing.)

2. **Positional element ids that are re-issued.** Three separate instances found:
   - row checkboxes: `checkbox-1`, `checkbox-2`, … shift as rows are added/removed →
     match structurally: `input[type=checkbox][name^='checkbox-']`
   - label dropdown containers: `#class-label-list-modal-<rowIndex>`
   - materials modal: `dBulkClass-add-learning-material-modal-1-0` ← **still hardcoded, see §5**

3. **The label dropdown is rendered ONCE PER ROW**, each holding a full copy of all labels
   (~87 in MQA, 15 in FCN). An unscoped `input[placeholder='Create or find a label']` matches
   one per row and can type into a hidden row's box. Scope to `#class-label-list-modal-0`.

4. **Bootstrap custom-control checkboxes must be clicked via their `<label>`** — the
   `label.custom-control-label` overlays the input and intercepts pointer events; clicking the
   input times out.

5. **Several buttons are "disabled" by CSS class only** (no native `disabled` attribute):
   "Apply changes" in the teacher modal, and the bulk-toolbar date buttons. A click before
   Angular settles **silently no-ops with no error**. Use single click + generous wait on the
   observable outcome — NOT a retry-click loop (risks double-applying).

6. **Angular inputs can silently DROP a keystroke** of `pressSequentially` (proven on the
   teacher-email field: applied `...mailsac.co` instead of `...com`). Type, read the value back,
   retype if it does not match.

7. **Applying a bulk toolbar date CLEARS the row selection** ("All selected" → "0 Selected"),
   re-disabling the toolbar — rows must be re-selected before the next bulk action. Expect the
   same for bulk Add teacher / Add labels / Add Material.

8. **Duplicate appends the copy AFTER THE LAST FILLED ROW**, not next to the source.

9. **CSV upload POPULATES the form — it does NOT create classes.** Creation still requires
   clicking "Create N classes", so upload tests are side-effect free.

10. **"Create more classes" is the ONLY path that returns a genuinely empty form** — everywhere
    else the draft is restored.

11. **"Copy an Existing Class" is a 2-STEP wizard** sharing ONE Continue selector
    (`dBulkClass-copy-from-modal-4`) across both steps — wait for each step's own controls.
    Step-2 options are enabled only if the source class HAS items of that kind ("Teachers [1]"
    vs a disabled "Assignments [0]").

12. **The copy-from class search has a race:** the input can be visible before Angular binds its
    keystroke handler, so the text lands but no search runs (symptom: correct search-box value
    alongside an unfiltered ~20-row list). Fix: wait for the DEFAULT result list to render
    before typing. Implemented in `click_toolbarCopyExistingClass`.

13. **Owl date-pickers open on the month of the currently-selected value** — a leftover end date
    far in the future makes the end-date picker open on a month with nothing disabled.

14. **The runner prints the login password in plaintext** to the console at `TST_LOGI_TC_1`.
    Pre-existing framework behaviour; worth masking if logs reach CI.

---

## 5. Outstanding work

### (a) Fix the workflow suite's material steps — TC_5/6/7 (BCCF_TC_4)
**Diagnosis complete, fix NOT applied.** These are **pre-existing** TCs (not authored this
session) that passed 13/13 twice earlier today, then broke after the bulk suite ran repeatedly
and changed the draft's row count. The selector
`input[qid='dBulkClass-add-learning-material-modal-1-0']` has a hardcoded positional index
(gotcha #2) that no longer resolves.

**Proposed fix (awaiting user approval):** add a **reset step to the workflow exec file** —
as a NEW step rather than editing the shared pre-existing TCs, which other suites may reference.
Verifying costs ~2 classes per run (~4 for two runs).

### (b) Cleanup — ~6 classes created in FCN-CHZ-PDA this session
`AutoClass_CreateOnly` ×3, `AutoClass_CreateMore` ×3 (2 per workflow run × 3 runs).
Classes are soft-deleted / restorable.

### (c) Phase 3 (visual) — not started
Formally required by the skill before the feature is closed. **Expected outcome: no candidates**
— every TC reads attributes/state/applied values; none assert a static UI snapshot. Needs the
AGENTS.md §8 assessment + explicit user confirmation before any `visualTest: true`.

### (d) NOTHING IS COMMITTED
The entire session's work is in the working tree. `tooling/` is untracked and **must not be
committed** (658 files incl. browser profile; it is NOT gitignored — verify before any `git add -A`).

### (e) Docs contain one stale theory
`walkthrough_2026-08-18.md` part 1 records a "dropped keystroke" as TC_21's cause. That was
**later DISPROVEN** (diagnostic showed the search box held the exact text). The real cause is
gotcha #12. Part 5+ has the correction, but part 1 was not retro-edited.

---

## 6. Protected files changed this session (both user-confirmed)

- **`core/actionLibrary/baseActionLibrary.js`** — added `downloadFile(selector, saveDir, timeout)`.
  Purely additive. Awaits click + page `download` event together via `Promise.all`; listens on
  `global.page` (the event never fires on a FrameLocator) while the click goes through `el()`.
  Returns `{ downloaded, fileName, filePath }`. Saves to `output/downloads/` (gitignored).
- **`package.json`** — added `P1AdminclassBulk_Thor`. No `visualAcceptance_*` counterpart because
  every TC is `visualTest: false` (AGENTS.md Rule B).

---

## 7. Manual test register — already updated

Both `AdminApp_Classes_tab_test_cases.md` and `.xlsx` have **Actual Result / Status / Comments**
filled for all 16 BCCF rows (xlsx rows 33–48). All marked **Pass**.

**Judgement call to be aware of:** BCCF_TC_4 is marked **Pass** because the *feature* was verified
working; the automation flakiness is recorded in its Comments instead. Change to Fail/Blocked if
the team prefers automation status to drive that column.

The other 65 cases (scenarios outside #3) remain `Not Run` and were not touched.

---

## 8. Suggested first actions next session

1. Read `.architecture/*` per CLAUDE.md, plus this file.
2. Decide on §5(a) — the workflow material fix.
3. Commit (see §5d — stage explicitly, never `git add -A`).
4. Then Phase 3 visual assessment to formally close the feature.

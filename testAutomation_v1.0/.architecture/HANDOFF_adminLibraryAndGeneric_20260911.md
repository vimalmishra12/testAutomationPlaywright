# HANDOFF — Admin App: Library tab and Generic/shell, next automation batches

**Date written:** 2026-09-11
**Session owner:** Vimal Mishra
**Repo:** `D:\testAutomation\QATestAutomation` · **main is at** `682b533` — this handoff's own commit (pushed)
**Status:** The whole **`MRPT` (Reports) programme is closed and on `main`** — 31 of 43 automated.
The next work is **Library (`LIBR` / `UMBP`)** and **Generic/shell (`ASHL` / `MYPR` / `SKEY` +
extensions)**. Both have **finished manual registers and zero automation**.

> **How to use this document.** Hand it to Claude at the start of the next session with no other
> context. Everything needed to start is below, and **every claim in it was verified against the
> repo on 2026-09-11** rather than carried over from an earlier note — see §8 for why that matters.

---

## 0. Start here — in this order

1. Read the mandatory architecture set (`CLAUDE.md` §MANDATORY), including
   `product-knowledge/ExperienceApp/admin-shared.md` **Part A + Part B**.
2. Then the per-screen knowledge for whichever batch you are doing:
   - **Library** → `product-knowledge/ExperienceApp/admin-library-tab.md` (269 lines)
   - **Generic** → there is **no separate file**. Its knowledge lives in `admin-shared.md`
     **§A9/B11** (header, footer, notifications, language, tab nav, My profile),
     **§A10** (Change school key, organisations, MQA/CQA), **§A11** (teacher view, role toggle,
     dialog contract). Read those three sections carefully — they are the whole product reference.
3. Use the repo skill **`c1-test-authoring`** from
   `D:\testAutomation\QATestAutomation\.agent\skills\` — **not** the bundled plugin skill, and
   not a worktree's copy.
4. `.architecture/authoring-status.md` has **no block for either batch** — nothing is in flight,
   so both start at **Phase 1 (Build)**.
5. Read §2 and §3 below before writing a single selector.

---

## 1. What is already done (so it is not re-done)

The Reports programme finished on 2026-09-11 and is on `main`:

| Suite | npm script | Cases | School |
|---|---|---|---|
| Reports read-only | `adminSchoolReportsTest_thor` | 21 | `FCN-CHZ-PDA` (`testt1`) |
| Reports data-owning | `adminSchoolReportsCreateTest_thor` | 10 | `VED-NEH-KVU` (`cqatestashish_admin`) |

🚨 **`Automation_frozen_DND` (`gHoZ-iBXf`) is a FROZEN FIXTURE.** `TST_MRPT_TC_41` asserts figures
captured from it. Never enrol/remove students, never change its settings, and **never log in as
`cqatestauto_stu1` / `stu2` and open content**. If that class changes, `TC_41` fails and it is
**not** a product defect.

⚠️ **The data-owning suite creates 10 reports per run and they CANNOT be deleted** (no UI control
exists — see `admin-reports-tab.md` §11.1). They expire after 60 days. **Decide deliberately
before putting it in CI.**

---

## 2. The two batches — verified counts

Both registers are **complete and unstarted**. Counts read from the registers on 2026-09-11:

### Library — `test/Manual/C1App/AdminApp-Library/`

| | |
|---|---|
| Cases | **42** — all `Not Run`, **0 Blocked** |
| Modules | **`LIBR` (32)** · **`UMBP` (10)** |
| Page objects | **none exist** — both modules are new |
| Product knowledge | `admin-library-tab.md`, 269 lines |
| ⚠️ Register format | **hand-maintained `.md` + `.xlsx`. There is NO `_tcdata.js` / `_generate.js`** |

### Generic / shell — `test/Manual/C1App/AdminApp-Generic/`

| | |
|---|---|
| Cases | **41** — 3 `Blocked` |
| Modules | `ASHL` (10) · `MYPR` (8) · `INVI` (6) · `SADB` (7) · `SKEY` (4) · `FOOT` (2) · `SRQS` (2) · `LIBR` (2) |
| Page objects | **`ASHL`, `MYPR`, `SKEY` are new**; the rest EXTEND existing modules |
| Product knowledge | `admin-shared.md` §A9/A10/A11 |
| Register format | **generated** — `_tcdata.js` + `_generate.js` (like Reports) |

---

## 3. ⚠️ The five things that will bite, verified on 2026-09-11

### 3.1 NO TC-ID COLLISIONS — checked properly, and the naive check lies

The Reports session lost time to exactly this: `MRPT` was already taken by an unrelated
teacher-side module, and it was only caught because someone checked.

**Both registers were checked against `C1TCRepository.json` and there are ZERO collisions.**

> ⚠️ **But a naive grep says otherwise, and it is wrong.** Grepping the Generic register for
> `TST_..._TC_\d+` returns **12 ids that ARE already registered** (`TST_FOOT_TC_1`,
> `TST_SADB_TC_1`, `TST_DASH_TC_2` …). **Those are prose references, not cases.** The register
> deliberately cites existing automated coverage — *"Scenario #8 is already covered by
> `TST_FOOT_TC_1..9`; this batch adds only `TST_FOOT_TC_10`"*.
>
> Match only real case rows: `^\|\s*\*\*Test Case ID\*\*\s*\|\s*(TST_[A-Z0-9]+_TC_\d+)`.
> Do that and both registers come back clean.

### 3.2 `LIBR` is SHARED between the two batches — and the numbering already interleaves

| | `LIBR` case numbers |
|---|---|
| Library register | `1–31`, `33` |
| Generic register | `32`, `34` |

Someone coordinated this deliberately. **Do not renumber either register**, and if you add a
`LIBR` case, check BOTH registers for the next free number.

### 3.3 Generic mostly EXTENDS existing modules — ADR-011 applies

`INVI`, `FOOT`, `SADB`, `SRQS` already have automation (6, 9, 1 and 1 registered TCs
respectively). **Never redefine an existing TC** — reuse it through the execution file. In
particular `TST_SADB_TC_1` ("open the school by key") is the Before-chain step almost every admin
suite already uses.

Only **`ASHL`, `MYPR`, `SKEY`** (and Library's `LIBR`/`UMBP`) need new page objects.

### 3.4 🚨 `SKEY` — Change school key is IRREVERSIBLE

`TST_SKEY_TC_3` — *"a new school key is issued and the old one stops working"* — is **Blocked at
design time for a very good reason**.

**NEVER run it on `FCN-CHZ-PDA`.** That key is hardcoded as `schoolKey` in
`schoolAdminAddClassData.json` and across the admin suites' data files; changing it would break
**every admin suite at once, with no way back** (`admin-shared.md` §A10).

`TST_SKEY_TC_1`, `TC_2` and `TC_4` are safe — they only open the menu, read the warning dialog,
and cancel. **`TC_2`'s dialog copy is already captured verbatim from the pre-rendered DOM**, so it
needs no risky interaction at all.

### 3.5 The three Blocked Generic cases

| TC | Why | Unblock |
|---|---|---|
| `TST_SKEY_TC_3` | irreversible key change | a dedicated disposable school |
| `TST_LIBR_TC_32` | MQA/CQA product restriction | a **non-MQA** admin account + a product-team definition of what marks a product restricted (§A10) |
| `TST_SRQS_TC_2` | submits a **real institution request** into a human queue, not withdrawable | a stub, or agreement that it may be submitted |

---

## 4. Library-specific traps (from `admin-library-tab.md` §3)

**The Library tab breaks three Classes-tab habits.** Do not inherit expectations:

| Behaviour | Classes tab | **Library tab** |
|---|---|---|
| Sort | by **code point** | **case-insensitive** |
| Search persistence | persists server-side | **does NOT persist** |
| Lazy loading | page size 20, "Load more" | **none — all ~970 products render at once** |
| Search matching | substring | **FUZZY** — "every result contains the term" is a FAILING assertion |

Plus, from `admin-shared.md` §B3:

- **`aLibrary-4-<n>` is positional** over ~970 rows — look the row up **by title on every use**.
- **`t-prd-cmp-cntr-1` is NOT positional — every component tile carries the SAME qid** (12 on one
  product, 15 on another). It cannot address one component; select by index or text.
- **`aClass-99`** — a **Classes-tab** qid living on the Library tab. A sweep scoped to `aLibrary-*`
  misses it.
- The Add-to-a-class dialog pre-renders **2330 class options**, all sharing qid `t-prd-umb-dd-1`.
- `aLibrary-*` returns **974 elements for 971 products** — the family includes non-row controls.
  **Do not equate the element count with the product count.**

---

## 5. Environment

| | |
|---|---|
| Env | `thor` — `https://micro-nemo.comprodls.com` |
| Primary school | **`FCN-CHZ-PDA`** = "3 July Test School 1", org `org_perf_testschool_1`, `Library (971)` |
| Zero-licence school | **`ACJ-DXL-JKR`** = "Perf Test School 4" — the only known school with **no** school licences, used by `TST_LIBR_TC_30` for the empty state |
| Login | `testt1@mailsac.com` → `logindata.json` `C1.login.user.schoolAdmin` |
| Second admin | `cqatestashish_admin@mailsac.com` → `C1.login.user.reportsSchoolAdmin` (added 2026-09-11) |
| Run mode | headed, `--browserCapability=desktop-chrome-1920` |

⚠️ **Select a school by KEY, never by name or card position** — two schools share the display name
"3 July Test School 1".

⚠️ **`cqatestashish_admin` administers exactly ONE school**, so it never sees "My school accounts".
The standard `TST_NEMO24306_TC_LOGIN` + `TST_SADB_TC_1` Before pair **cannot work for it** — use
`login.click_login_btn_singleSchoolAdmin()` (`admin-reports-tab.md` §11.6). `testt1` has 7 schools
and uses the normal chain.

⚠️ **Claude cannot type passwords.** The working sequence: Claude navigates to the login page and
fills the username, the user types the password and clicks Log in, Claude drives everything after.
Budget two minutes at session start.

---

## 6. Reusable machinery built during the Reports programme

Do not rebuild these:

| What | Where |
|---|---|
| Download a file | `action.downloadFile(selector, saveDir)` → `{downloaded, fileName, filePath}` |
| Unzip | **`jszip`** — now a **declared** dependency |
| Parse CSV | `require("csv-parse/lib/sync")` — this repo is **csv-parse v4**, so **not** `csv-parse/sync` |
| Strip the BOM | downloaded CSVs carry a UTF-8 BOM — `text.replace(/^\uFEFF/, "")` |
| Single-school-admin login | `login.click_login_btn_singleSchoolAdmin()` |
| Read a zipped report | `schoolReports.download_newestReport()` — a worked example of all of the above |

---

## 7. ⚠️ Performance lessons that cost the Reports suite 5× its runtime

All three were found by **summing the framework's own info-log timestamps per action name**, not
by reading the code. **The ranking was not what the code looked like it would be.** With ~970
Library products these matter more here than they did on Reports.

1. **Never `getText` an element that may be absent.** When a list is empty its container is often
   **removed**, and Playwright then waits its **full 30 s default on every poll**. One zero-result
   search cost ~90 s. Read the count first; read content only when there is some.
2. **Never loop `isSelected` over rows** — ~0.67 s per call. Count with a `:checked` selector
   instead: one call replaces twenty.
3. **`getElementCount` is ~1.1 s per call** on these screens — the most expensive action. A poll
   that calls it repeatedly needs designing, not writing casually.
4. **Never index into a list that is still settling.** `.nth(4)` after a list shrinks blocks 30 s.
   Read the whole container once, atomically.

> **The through-line of the whole Reports programme.** Every failure and every slowdown was one of
> two shapes: **an incomplete signal** (watching the rendered page when the matching total is what
> moves) or **waiting on something absent**. The second never fails — it just costs 30 s in
> silence, and it survives a first run unnoticed.

---

## 8. Lessons about the process itself

**Verify what a handoff claims before trusting it.** The Reports handoff was accurate about the
work and wrong about the branch — it assumed two commits that were not there, and four of its
selectors were wrong (`createReport-6` was "Sort by Students", not "Select all classes"; three
controls were `<button>` where it said `<a>`). Ten minutes of checking saved a day.

**"Generated, so it cannot drift" is only true while everyone regenerates.** The Reports register
had gained three cases and ten Remarks markers that existed **only** in the `.md`/`.xlsx`; running
`_generate.js` would have silently deleted them. **Diff the generator's output against the
committed file BEFORE running it.** ⚠️ The **Library** register has no generator at all, so edit
its `.md` and `.xlsx` together — `npm run register` (`tooling/xlsxRegister.js`) for the workbook.

**Ground on the artefact, not the description.** Designing the report-file test from the
register's prose would have been wrong three times over (one CSV vs a zip of many; a fixed header
vs one that varies per component; no BOM). Ten minutes reading a real file avoided all three.

**A register written against an empty state is a hypothesis.** Six Reports expected results were
wrong because they were inherited from another tab rather than observed. Expect the same here —
the Library tab's fuzzy search and absent lazy-loading are already known to break Classes-tab
assumptions.

---

## 9. Suggested order

1. **Library `LIBR`/`UMBP` first.** Self-contained, zero Blocked, one product-knowledge file, no
   existing modules to coordinate with. The read-only cases (list, sort, search, School licence)
   are side-effect free; **"Add to a class" mutates** and belongs in a separate data-owning suite.
2. **Generic second**, and inside it: `ASHL` → `MYPR` → `INVI`/`FOOT` extensions → `SADB` → `SKEY`
   last (its safe cases only).

⚠️ **`MYPR` warning:** My profile is at `/dashboard/my-profile`, **not under `/admin/`** — it is
the shared Cambridge One profile page, so a change there reaches teachers and students too. **Do
not exercise the password or validation paths on `testt1@mailsac.com`** — it is the login for
every admin suite. Those cases need a disposable account (`admin-shared.md` §A9).

---

## 10. State of the repo

- `main` = `origin/main` = **`682b533`**, everything pushed. (`a7e139a` was the Reports work; `682b533` adds this handoff.)
- Branch `claude/admin-reports-tab-handoff-4060b3` is merged into `main`; nothing is outstanding.
- The Reports walkthrough is
  `.architecture/walkthroughs/walkthrough_schoolReports.test.js_2026-09-08_08h-00m.md`
  (5 sessions, 757 lines). **Library and Generic each need their own walkthrough file.**
- `node tooling/tcMap.js --findings` exits 1 on **13 pre-existing UNREGISTERED eBook TCs**. That is
  not yours — check only that your own module reports 0 MISFILED and 0 GHOST.

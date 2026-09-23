# PLAN — eBook & FOC Test-Suite Consolidation (ExperienceApp · thor)

- **Date:** 2026-09-22
- **Status:** PROPOSED — awaiting user approval; no code changed yet
- **Revision:** r2 (2026-09-22) — corrected after independent code review: Suite3 viewer-open steps made
  explicit, NOTE coverage-guard range fixed (`NOTE_TC_16/17` do not exist), teacherPPlus battery corrected,
  script arithmetic restated, clean-baseline precondition and production `EBOO_55‑61` note added.
- **Revision r3 (2026-09-22, user decisions):** learner E2E renamed **`ebookE2EstudentTest`** (script + exec
  file); `ebookToolbarFocusTestVisual_thor` **retired** (EBTF visual baseline dropped, functional EBTF kept);
  the 4 teacher launch suites **and** the Presentation Plus suite merged into one **`ebookE2EteacherTest_thor`**
  / `ebookE2EteacherTest.json` (5 suites — all teacher eBook cases); `createAssignmentFeatureTest_thor`
  renamed **`createAssignmentTest_thor`** alongside the unchanged `createAssignmentPplusTest_thor`;
  `visualAcceptance_thor` name unchanged. The §4 TC-union guard is unchanged by r3.
- **Revision r4 (2026-09-22, user decision — no deletions):** no exec file in `thor/` is deleted, renamed or
  ever edited again. All merge output goes into **new** files (`ebookE2EstudentTest.json`,
  `ebookFocusA11yMergedTest.json`, `ebookE2EteacherTest.json`); only `package.json` scripts are retired,
  renamed, retargeted or added. Superseded exec files stay on disk permanently as unreferenced archive.
- **Scope:** npm scripts under the `"//─────────── ExperienceApp · thor ───────────"` block (`package.json:12`)
  that exercise the eBook reader and Front-of-Class (FOC) flows
- **Goal:** consolidate ~62 % duplicated execution volume into a clean, non-duplicated, logically ordered
  flow — with 100 % coverage of registered and executed test cases preserved

> **FOC definition used here:** "Front of Class (eBooks)" per `tooling/dashboard/dashboard.config.json:49-52`
> (manual workbook: `test/Manual/C1App/FOC/eBookTestCases.xlsx`) — the teacher-side eBook / Presentation Plus
> launch flows. The two keyboard-**Focus** suites (`ebookFocusA11y`, `ebookToolbarFocus`) are also included,
> so both readings of "FOC" are covered and nothing is dropped either way.

**Baseline verified:** all 51 exec files in `testResources/testExecutionFiles/ExperienceApp/thor/` were
enumerated; **17** reference eBook/FOC TC prefixes (EBOO, PAGE, PLAY, COMM, NOTE, DRAW, TIME, SHOW, KBOA,
EBTF, CMAT, RBNK); the other 34 reference none.

---

## 1. Inventory — every eBook/FOC suite under `ExperienceApp · thor` (pre-merge state)

Login accounts: learner suites use `C1.login.user.validStudent1`; Focus suites use `validStudent1_ebook2`;
teacher suites use `validTeacher` (`assignmentLoginData.json`).

| # | npm script (`package.json`) | exec file (thor/) | Suites | TC IDs executed |
|---|---|---|---|---|
| 1 | `eBookFeatureTest_thor` (:24) | `eBookTestMaster_v.0.json` | 3 | EBOO 1‑8,13,17‑22 · NOTE 1,3,4,6‑9 |
| 2 | `ebooksE2ETest_thor` (:34) | `ebooksE2ETest.json` | 8 | EBOO 1‑9,13,17‑23,51‑54 · NOTE 1,3,4,6‑9 · DRAW 1‑6,9,10,14,18‑20 · TIME 1‑7,9,11‑14 · PAGE 1,2,4 · SHOW 1‑3 · PLAY 1‑10 · COMM 1‑4 |
| 3 | `eBookHotLinkTest_thor` (:33) | `player.json` | 1 | EBOO 1,2,5,6,7,9 · PAGE 1,2,4 · PLAY 1‑10 · COMM 1‑4 |
| 4 | `highlighterFeatureTest_thor` (:26) | `highlighterTest.json` | 1 | EBOO 1,3,5,51 · DRAW 1‑6,9,10,14,18‑20 |
| 5 | `visualAcceptance_thor` (:23) | `highlighterTest.json` + `--visual=novus --skipAssertion=true` | 1 | (visual run of #4) |
| 6 | `notesFeatureTest_thor` (:25) | `notesTest.json` | 1 | EBOO 1,3,5,8 · NOTE 1,3,4,6‑15,18 (full battery) |
| 7 | `drawingFeatureTest_thor` (:30) | `drawingTool.json` | 1 | EBOO 1,3,22,23 · SHOW 1‑3 ⚠️ runs Show/Hide, not drawing |
| 8 | `timerFeatureTest_thor` (:27) | `timerTest_VC.json` | 1 | EBOO 1,3,52 · TIME 1‑7,9,11‑14 |
| 9 | `nextPreviousPageTest_thor` (:28) | `nextPreviousPageButtonTest.json` | 1 | EBOO 1,5,9,53,54 · PAGE 1,2,4 (+ teardown APPS 1‑2) |
| 10 | `toolsFeatureTest_thor` (:29) | `toolsFeatureTest.json` | 5 | DRAW 1‑6,9,10,14,18 · NOTE 1,3,4,6‑9 · SHOW 1‑3 · TIME 1‑7,9,11‑14 · PAGE 1,2,4 · EBOO 1,3,5,8,9,22,23,51‑54 |
| 11 | `ebookFocusA11yTest_thor` (:35) | `ebookFocusA11yTest.json` | 4 | KBOA 1‑19 (keyboard focus: pages 22/24/26/28) |
| 12 | `ebookToolbarFocusTest_thor` (:36) | `ebookToolbarFocusTest.json` | 1 | EBTF 1‑16 (toolbar tab-order, page 26) |
| 13 | `ebookToolbarFocusTestVisual_thor` (:37) | same + `--visual=novus` | 1 | (visual run of #12) — **retired in r3** |
| 14 | `teacherEbook1RBTest_thor` (:61) | `teacherEbook1RBTest.json` | 1 | CMAT 1‑3 · EBOO 1,2,5,6,24,25 |
| 15 | `teacherEbook2RBTest_thor` (:62) | `teacherEbook2RBTest.json` | 1 | CMAT 1‑3 · EBOO 1,2,5,6,24,25 (2RB data) |
| 16 | `teacherClassMaterials1RBTest_thor` (:59) | `teacherClassMaterials1RBTest.json` | 1 | CMAT 1‑3 · RBNK 1,2 |
| 17 | `teacherClassMaterials2RBTest_thor` (:60) | `teacherClassMaterials2RBTest.json` | 1 | CMAT 1,2,4,5 · RBNK 1,2 |
| 18 | `teacherPplusTest_thor` (:63) | `teacherPresentationPlus1RBTest.json` | 1 | CMAT 1‑3 · EBOO 1‑8,13,17‑22,24,25 · NOTE 1,3,4,6‑9 |
| 19 | `createAssignmentPplusTest_thor` (:64) | `createAssignmentPresentationPlusTest.json` | 1 | CMAT 1‑3 · EBOO 1,2,5 (scaffold) · **C1AS** 5‑13,21,22,24 (assignment domain) |

> **r3 note:** rows 14‑18 are replaced by a single new `ebookE2EteacherTest_thor` (🅒); row 2 and
> `createAssignmentFeatureTest_thor` (:17, assignment domain) are renamed; row 13 is retired.
> This table describes the pre-merge state — all `ebooksE2ETest.json:NNN` citations below refer to the
> source file, which stays in `thor/` untouched as archive (r4).

TC definitions (all stay registered, untouched): `C1TCRepository.json` —
EBOO/PAGE `:947‑1151`, NOTE `:1158‑1253`, DRAW `:1292‑1411`, TIME `:777‑872`, PLAY `:880‑939`,
COMM `:71‑108`, SHOW `:1260‑1285`, KBOA `:5173‑5287`, EBTF `:5293‑5390`, CMAT `:6511‑6548`, RBNK `:6554‑6566`.
Shared scaffold steps: `TST_DASH_TC_5` "launch eBook" (`:268`), `TST_DASH_TC_11` "open active class" (`:304`),
APPS 1‑2 logout teardown (appShell).

---

## 2. Duplicates and overlaps (verified by content comparison)

### 2.1 Exact suite-level duplicates

| Suite | Byte-identical twin | Evidence |
|---|---|---|
| `player.json` Suite1 | ≡ `ebooksE2ETest.json` **Suite8** | `ebooksE2ETest.json:1058‑1291` vs `player.json:2‑236` — same Before, same 25-step Test list |
| `highlighterTest.json` Suite1 | ≡ E2E **Suite4** | `highlighterTest.json:2‑235` vs `ebooksE2ETest.json:425‑657` — identical DRAW sequence incl. localStorage TC 18/19/20 |
| `timerTest_VC.json` Suite1 | ≡ E2E **Suite5** | `timerTest_VC.json:2‑173` vs `ebooksE2ETest.json:659‑829` |
| `eBookTestMaster_v.0.json` S1 / S2 / S3 | ≡ E2E **S1 / S3 / S2** (identical, order swapped) | `eBookTestMaster_v.0.json:2,106,308` — Master is a strict subset of E2E |
| `toolsFeatureTest.json` S3 | ≡ E2E **Suite7** ≡ `drawingTool.json` S1 | `toolsFeatureTest.json:459`, `drawingTool.json:2` — EBOO_23 + SHOW 2,3,1 |
| `toolsFeatureTest.json` S4 | ≡ E2E **Suite5** ≡ `timerTest_VC.json` | `toolsFeatureTest.json:570` |
| `toolsFeatureTest.json` S5 | ≡ E2E **Suite6** ≡ `nextPreviousPageButtonTest.json` (incl. its After block) | `toolsFeatureTest.json:753‑921` |

### 2.2 Near-duplicates / supersets

- **`toolsFeatureTest.json` S1** ⊂ E2E Suite4 (drops `DRAW_TC_19/20`; adds mid-flow `EBOO_TC_22`, already
  asserted by the viewer suite).
  **S2** ⊂ E2E Suite3 (notes basics). → **`toolsFeatureTest.json` is 100 % absorbed by `ebooksE2ETest.json`.**
- **`ebooksE2ETest.json` Suite3 (Notes)** ⊂ **`notesTest.json`**: notesTest runs the same create→save→verify→delete
  journey **plus** NOTE 10 (hyperlink new-tab), 11/12 (page-nav persistence), 13/14 (multi-note + reopen persistence),
  15 (special chars), 18 (edit). E2E's block has one step notesTest lacks: `TST_EBOO_TC_13`
  (blank Notes-pane content, `ebooksE2ETest.json:301`).
- **`nextPreviousPageButtonTest.json`** = E2E Suite6 Test list + an extra After teardown
  (EBOO_9 / PAGE 2,1,4 / EBOO_5 / APPS 1‑2, `nextPreviousPageButtonTest.json:118‑162`).
- **`teacherEbook1RBTest` ≡ `teacherEbook2RBTest`**: identical TC sequence
  (`teacherEbook1RBTest.json:61‑131` = `teacherEbook2RBTest.json:61‑131`); only the data node differs
  (`class1RB.*` vs `class2RB.*`). A data-parameterized pair.
- **`teacherPplusTest`** re-executes the learner-eBook TC battery (EBOO 1‑8,13,17‑22,24,25 — no EBOO_23;
  NOTE 1‑9) against the **Presentation Plus** surface with its own data (`class1RB.pplusViewerControls`).
  Same TC IDs, different product surface — related, **not** a duplicate; r3 keeps it as Suite 5 of the new
  teacher E2E file (🅒), out of the learner file.
- **KBOA_13/14** (page 26 → Tab lands directly on Home) ≈ **EBTF_1/2** (same page, same assertion):
  one step of overlap between the two Focus files; everything else is distinct (content focus vs toolbar traversal).
- **`createAssignmentPresentationPlusTest`** uses EBOO 1/2/5 only as open/close scaffolding around a C1AS
  assignment flow → assignment domain; **keep out of the merge** (it also creates assignments consumed by
  `c1completeAssignment.json`).

### 2.3 Misleading names (copy-paste lineage — confirmed)

- `drawingFeatureTest_thor` runs **Show/Hide**, not drawing (`drawingTool.json:3` = "Validation of hide sheek Page").
- `highlighterTest.json:3` and `toolsFeatureTest.json:3` are both named "Validation of timer Page" but run
  drawing / notes flows.
- `eBookHotLinkTest_thor` runs the Hotlink/Player suite (accurate name; suite absorbed into 🅐 S8).

### 2.4 Redundancy score

~62 % of execution volume is duplicated. EBOO_1 runs 13×, EBOO_5 13×, NOTE_1 5×; the drawing suite runs 3×,
the timer suite 3×, show/hide 3×, hotlinks 2×.

---

## 3. Proposed merged structure (r3 layout · r4 no-deletion policy)

**Only execution-file JSONs + npm scripts change.** Zero changes to `*.test.js`, page objects, or the TC
registrations in `C1TCRepository.json` — coverage preservation is structural: every registered TC stays
registered and every currently-executed step stays executed.

**r4 file policy: zero deletions, zero edits to existing exec files.** All merged content lands in **new**
files (`ebookE2EstudentTest.json`, `ebookFocusA11yMergedTest.json`, `ebookE2EteacherTest.json`). Nothing in
`testResources/testExecutionFiles/ExperienceApp/thor/` is deleted, renamed or modified; superseded files
remain as frozen archive.

### 🅐 `ebookE2EstudentTest.json` — NEW file; the single learner-eBook suite (8 suites, existing order kept)

**r4:** `ebookE2EstudentTest.json` is **created as a copy** of `ebooksE2ETest.json` (no rename — the original
stays untouched in `thor/`, unreferenced), then the two edits below are applied to the copy; the script
becomes `ebookE2EstudentTest_thor` pointing at the new file. Source is already a near-superset of the
legacy files. Apply two edits only:

1. **Suite3 (Notes)** — keep `TST_EBOO_TC_13`, then replace the Test list with the **full `notesTest.json`
   battery**: NOTE 1,3,4,9 → 6,7,8 → (hyperlink) 1,3,4,10,6,7,8 → (persistence) 1,3,4,11,12 →
   (reopen/multi) 1,3,4 / EBOO_5 / DASH_5 / EBOO_1,3,8 / NOTE_13,1,3,4,13,14,15,14,18,14 / EBOO_5.
   **The three viewer-open steps that currently head Suite3's Test list — `TST_EBOO_TC_1`, `TST_EBOO_TC_3`,
   `TST_EBOO_TC_8` (`ebooksE2ETest.json:283‑299`) — MUST be retained** ahead of `EBOO_13` and the battery: in
   `notesTest.json` those steps live in the suite **Before** (`notesTest.json:60‑76`), but E2E Suite3's Before
   is login + `DASH_5` only (`ebooksE2ETest.json:227‑279`). Merged Test order =
   `EBOO_1, EBOO_3, EBOO_8, EBOO_13,` then the battery above. (Dropping them would run `NOTE_TC_1` "Add Notes"
   with no eBook open.)
   Result: a strict superset of both old notes blocks (the old "NOTE_9 after reopen" check is preserved via
   the stronger NOTE_13 + notesTest's own reopen segment).
2. **Suite6 (Page nav)** — append the `nextPreviousPageButtonTest.json` After teardown
   (EBOO_9, PAGE 2,1,4, EBOO_5, APPS 1‑2).

Suite order (each suite = one login; intra-suite state isolation preserved by the existing
EBOO_5 → DASH_5 exit/relaunch steps at boundaries):

```
S1 Content & launch  →  S2 Viewer controls  →  S3 Notes (full battery)  →  S4 Drawing / Highlighter
→  S5 Timer  →  S6 Page navigation (+teardown)  →  S7 Show/Hide  →  S8 Hotlinks / Player / Activity
```

While editing, fix the three misnamed `"Name"` fields (timer/drawing/show-hide labels).

### 🅑 `ebookFocusA11yMergedTest.json` — NEW file; the 4 suites collapsed into 1

KBOA 1‑19 are one sequential journey (pages 22→24→26→28, `ebookFocusA11yTest.json:63‑432`); each of the 4
suites repeats an identical login Before. The new file holds one suite → one login, same 19 steps in the
same order. **r4:** `ebookFocusA11yTest.json` is NOT edited — `ebookFocusA11yTest_thor` is retargeted
(`--testExecFile=ebookFocusA11yMergedTest.json`) and the old 4-suite file stays untouched as archive.
`ebookToolbarFocusTest.json` keeps its own script/file pair — different account (`validStudent1_ebook2`) and
reader state; isolation keeps its failure reporting independent of the content-focus journey.

### 🅒 `ebookE2EteacherTest.json` — NEW (r3), the single teacher-eBook (FOC) suite — 5 suites, all teacher cases

- **S1** Teacher eBook launch 1RB (from `teacherEbook1RBTest.json`, verbatim) — CMAT 1‑3 · EBOO 1,2,5,6,24,25
- **S2** Teacher eBook launch 2RB (verbatim, `class2RB` data) — same TC sequence
- **S3** Class Materials 1RB → Resource Bank (from `teacherClassMaterials1RBTest.json`, verbatim) — CMAT 1‑3 · RBNK 1,2
- **S4** Class Materials 2RB → folder → RB1/RB2 (from `teacherClassMaterials2RBTest.json`, verbatim) — CMAT 1,2,4,5 · RBNK 1,2
- **S5** Presentation Plus battery (from `teacherPresentationPlus1RBTest.json`, verbatim **including** its
  `APPS_1/2` logout After block) — CMAT 1‑3 · EBOO 1‑8,13,17‑22,24,25 · NOTE 1,3,4,6‑9

Npm script `ebookE2EteacherTest_thor`. S5 preserves the full PPlus surface coverage that previously justified
a separate `teacherPplusTest_thor`; no cross-file dependency is created (the assignment flow carries its own
PPlus launch scaffold).

### 🅓 `ebookToolbarFocusTest.json` — functional only (r3: `ebookToolbarFocusTestVisual_thor` retired)

EBTF visual baseline coverage is dropped by user decision. The file and `ebookToolbarFocusTest_thor` are
unchanged (EBTF 1‑16, page 26, returns to page 20).

### 🅔 `createAssignmentPresentationPlusTest.json` — unchanged (`createAssignmentPplusTest_thor` kept)

### 🅣 Rename (r3): `createAssignmentFeatureTest_thor` → `createAssignmentTest_thor`

Same exec (`c1createAssignment.json`, generic C1 assignment create flow) — `package.json` key rename only.
`completeAssignmentFeatureTest_thor`, `deleteAssignmentFeatureTest_thor`, `studentAssignmentFeatureTest_thor`
are untouched; extend the same naming pattern to them on request.

### 🅤 Visual parity — keep `highlighterTest.json` as a visual-only exec file

`visualAcceptance_thor` (`package.json:23`) runs a whole file with `--skipAssertion=true`; re-pointing it at
the merged E2E would silently widen the visual scope. **r4:** `highlighterTest.json` stays byte-identical —
no suite rename, no comment edit (r3's re-marking step is dropped; its cosmetic "Validation of timer Page"
label is frozen). Only its functional twin script `highlighterFeatureTest_thor` is retired;
`visualAcceptance_thor` keeps pointing at it unchanged. Script name stays **`visualAcceptance_thor`** (r3) —
it is now the only visual script in this perimeter (🅓's visual twin is retired).

### Script changes

**Retired — 14:**
- Functional twins (8, coverage lives in 🅐): `eBookFeatureTest_thor`, `notesFeatureTest_thor`,
  `highlighterFeatureTest_thor`, `timerFeatureTest_thor`, `nextPreviousPageTest_thor`,
  `toolsFeatureTest_thor`, `drawingFeatureTest_thor`, `eBookHotLinkTest_thor`
- Replaced by 🅒 (5): `teacherEbook1RBTest_thor`, `teacherEbook2RBTest_thor`,
  `teacherClassMaterials1RBTest_thor`, `teacherClassMaterials2RBTest_thor`, `teacherPplusTest_thor`
- Visual dropped (1): `ebookToolbarFocusTestVisual_thor` — drops the EBTF visual baseline only;
  functional EBTF 1‑16 coverage in `ebookToolbarFocusTest_thor` is unaffected

**Renamed — 2:** `ebooksE2ETest_thor` → `ebookE2EstudentTest_thor` (now points at the **new**
`ebookE2EstudentTest.json`); `createAssignmentFeatureTest_thor` → `createAssignmentTest_thor`.
**Retargeted — 1:** `ebookFocusA11yTest_thor` → `--testExecFile=ebookFocusA11yMergedTest.json`.
**Added — 1:** `ebookE2EteacherTest_thor`.

**Final perimeter = 7 scripts:** `ebookE2EstudentTest_thor`, `ebookFocusA11yTest_thor`,
`ebookToolbarFocusTest_thor`, `ebookE2EteacherTest_thor`, `createAssignmentPplusTest_thor`,
`createAssignmentTest_thor`, `visualAcceptance_thor`.
(§1 inventory: 19 − 14 retired + 1 added = 6 eBook/FOC scripts, + the renamed `createAssignmentTest_thor`
from the assignment domain = 7.) Functional learner-reader runs: **9 → 1**; teacher runs: **5 → 1**.

**Exec files — r4: nothing is deleted or renamed.** Three new files are created
(`ebookE2EstudentTest.json`, `ebookFocusA11yMergedTest.json`, `ebookE2EteacherTest.json`); thor/ grows
51 → 54. Thirteen superseded files remain on disk permanently, referenced by no script: the 11 twins
(`eBookTestMaster_v.0.json`, `toolsFeatureTest.json`, `drawingTool.json`, `timerTest_VC.json`,
`nextPreviousPageButtonTest.json`, `player.json`, `teacherEbook1RBTest.json`, `teacherEbook2RBTest.json`,
`teacherClassMaterials1RBTest.json`, `teacherClassMaterials2RBTest.json`, `teacherPresentationPlus1RBTest.json`)
plus `ebooksE2ETest.json` and `ebookFocusA11yTest.json`. (`notesTest.json` also becomes unreferenced archive;
`highlighterTest.json`, `ebookToolbarFocusTest.json` and `createAssignmentPresentationPlusTest.json` stay in
active use.) **Archive files must never be edited from now on** — they would drift silently from the merged
copies. Deletion, if ever wanted, remains a separate future decision recoverable only by keeping git history
intact.

---

## 4. Original → merged mapping (every original test-case run accounted for)

| Original run | Steps preserved in |
|---|---|
| `eBookTestMaster_v.0.json` S1 / S2 / S3 | 🅐 S1 / S3 / S2 (byte-identical) |
| `player.json` S1 | 🅐 S8 |
| `highlighterTest.json` S1 (functional) | 🅐 S4 — visual run stays on its own file (🅤) |
| `timerTest_VC.json` S1 | 🅐 S5 |
| `nextPreviousPageButtonTest.json` S1 Test + After | 🅐 S6 Test + S6 After |
| `toolsFeatureTest.json` S1 / S2 / S3 / S4 / S5 | 🅐 S4 / S3 / S7 / S5 / S6 |
| `notesTest.json` S1 (NOTE 1,3,4,6‑15,18 battery) | 🅐 S3 (superset merge with old Suite3) |
| `drawingTool.json` S1 | 🅐 S7 |
| `ebookFocusA11yTest.json` S1‑S4 | 🅑 `ebookFocusA11yMergedTest.json` (new file) single suite, KBOA 1‑19 in original order; original kept as archive |
| `ebookToolbarFocusTest.json` (functional) | 🅓 unchanged — its visual run retired (user decision) |
| `teacherEbook1RBTest` / `teacherEbook2RBTest` | 🅒 S1 / S2 |
| `teacherClassMaterials1RB` / `teacherClassMaterials2RB` | 🅒 S3 / S4 |
| `teacherPresentationPlus1RBTest` | 🅒 S5 (verbatim, incl. `APPS_1/2` logout After) |
| `createAssignmentPresentationPlusTest` | 🅔 unchanged (assignment domain) |
| `ebooksE2ETest_thor` script + exec file | script renamed `ebookE2EstudentTest_thor` → **new** `ebookE2EstudentTest.json` (copy + edits); original file kept as archive (r4) |
| `createAssignmentFeatureTest_thor` | renamed `createAssignmentTest_thor` (same exec, same steps) |
| `ebookToolbarFocusTestVisual_thor` | retired — visual baseline dropped, executed steps elsewhere unaffected |

**Coverage guard — no TC ID is dropped.** Union before = union after (r3 changes nothing here: teacher
suites move verbatim into 🅒; the toolbar-visual retirement drops a visual baseline, not executed steps):
EBOO 1‑9,13,17‑25,51‑54 · PAGE 1,2,4 · NOTE 1,3,4,6‑15,18 (14 ids) · DRAW 1‑6,9,10,14,18‑20 · TIME 1‑7,9,11‑14 ·
SHOW 1‑3 · PLAY 1‑10 · COMM 1‑4 · KBOA 1‑19 · EBTF 1‑16 · CMAT 1‑5 · RBNK 1‑2.

*FYI — registered but not executed in thor today (unchanged by this merge):* EBOO 10‑12,14‑16 · PAGE 3,5 ·
NOTE 2,5 · DRAW 7,8,11‑13,15‑17 · TIME 8,10,15,16 · SHOW 4 · COMM 5,6 · CMAT 6. Adding them to the flow is a
separate opt-in decision (they are P2 data-match asserts and may need test data).
NOTE registry note (r2): `C1TCRepository.json` holds NOTE ids 1‑15 and 18 only — there is **no**
`TST_NOTE_TC_16/17`; r1's guard line "NOTE 1‑18 (16 ids)" conflated the registered count (16) with an id range.

---

## 5. End-to-end execution flow (recommended CI order, r3)

1. **`ebookE2EstudentTest_thor`** — prerequisite sanity: S1/S2 prove the reader opens; S3‑S7 are tool-isolated
   by design (notes/drawings persist in localStorage; suites exit via EBOO_5 → DASH_5 before the next).
   S6's teardown logs out mid-file (§6).
2. **`ebookFocusA11yTest_thor`** → 3. **`ebookToolbarFocusTest_thor`** — separate account
   (`validStudent1_ebook2`); KBOA_19 / EBTF_16 navigate back to page 20, so the two are order-independent.
4. **`ebookE2EteacherTest_thor`** — teacher chain head: S1‑S4 prove class-materials/resource-bank launches;
   S5 proves the Presentation Plus surface before the assignment flow scaffolds on it. Depends only on the
   stable seed classes `class1RB` / `class2RB` (`classMaterialsData.json`).
5. **`createAssignmentPplusTest_thor`** — PPlus assignment creation; its created assignments feed
   `completeAssignmentFeatureTest_thor` (out of perimeter).
6. **`createAssignmentTest_thor`** — generic C1 assignment creation (`c1createAssignment.json`); independent
   of the PPlus chain, kept adjacent so assignment-domain runs stay contiguous
   (create → [complete → delete] ordering in the assignment perimeter is unchanged).
7. Visual (nightly): **`visualAcceptance_thor`** — the only visual script left in this perimeter (🅤).

---

## 6. Implementation notes & trade-offs

- **`package.json` is a protected file** (AGENTS.md) — retiring, **renaming** and **adding** scripts all go
  through the ⚠️ protected-file confirmation protocol: one confirmation covering the 14 retirements, 2 renames,
  1 retarget and 1 addition of §7 step 5. Execution-file JSON edits need no protocol (they are configuration) —
  and under r4, no existing exec file is edited at all.
- **Suite isolation:** merging tool suites into one file keeps isolation — a hard failure in one suite still
  lets subsequent suites run (each has its own Before). Only the 4→1 Focus-suite collapse trades step-level
  failure isolation for 3 fewer logins; safe because KBOA 1‑19 is a designed single journey. Same reasoning
  applies to the 5-suite teacher file 🅒 (four launch journeys are independent; S5 carries its own logout).
- **New mid-file logout in 🅐:** Suite6's transplanted After ends with `APPS_1/2` (profile → log out, landing
  verified — `nextPreviousPageButtonTest.json:150‑161`); today E2E never logs out mid-file. S7/S8 Before
  re-runs launchUrl → landing → login like every other suite, so risk is low — but the §7 step-6 green run
  MUST explicitly confirm S7 and S8 pass **in the same run after that logout**.
- **Verification checklist:** **clean-tree precondition first** — commit or stash the pending page-object /
  selector changes (4 files staged as of r2: `pages/ExperienceApp/dashboard.page.js`,
  `pages/ExperienceApp/eBook.page.js`, `pages/ExperienceApp/landing.page.js`,
  `testResources/selectors/ExperienceApp/C1Selectors.json`) and record the baseline commit sha; otherwise the
  baseline-vs-merged diff silently attributes those page changes to the merge. Then baseline-run each retired
  script once, and diff the merged run's Mocha report — every retired TC-id occurrence must appear in
  🅐/🅑/🅒. The §4 mapping table is the checklist. Union of executed TC ids must match §4's coverage guard
  exactly. **r4:** confirm each perimeter script's `--testExecFile` resolves to its intended (possibly new)
  file and that **no script in `package.json` still points at an archived exec file**
  (`ebooksE2ETest.json`, `ebookFocusA11yTest.json`, the 11 twins, `notesTest.json`) — the archived files
  themselves intentionally remain on disk.
- **External references:** before retiring/renaming, confirm no CI job, dashboard config or doc invokes the
  14 retired or 2 renamed script names by string.
- **Out of scope, same pattern:** the `qa/` and `production/` exec folders hold the same twin files
  (`eBookTestMaster_v.0.json`, `player.json`, …) and would inherit this merge later.
  **Prerequisite before inheriting to production (r2):** `production/ebookLearningHyperlinkVC_V.1.0.json:132‑170`
  references `EBOO_55‑61`, which are NOT registered in `C1TCRepository.json` (EBOO ids stop at 54) although the
  file names that repo as its `TestCaseRepo` — resolve those dangling references before building a prod
  coverage guard.
- The manual FOC workbook `test/Manual/C1App/FOC/eBookTestCases.xlsx` stays the design-time reference
  (dashboard module currently `enabled: false`).

## 7. Next steps (on approval)

0. Clean-baseline precondition (§6): working tree clean — the staged page-object/selector changes committed
   or stashed — and the baseline commit sha recorded.
1. Create `ebookE2EstudentTest.json` as a copy of `ebooksE2ETest.json`, then edit the **copy** (Suite3 = keep
   `EBOO_1/3/8` open steps + `EBOO_13` + notes-superset battery; Suite6 teardown; name fixes). Source file
   untouched (r4).
2. Create `ebookFocusA11yMergedTest.json` — the KBOA 1‑19 journey as a single suite. Source untouched.
3. Create `ebookE2EteacherTest.json` — S1‑S4 launch suites + S5 Presentation Plus battery, all verbatim from
   the 5 source files (S5 incl. its `APPS_1/2` logout After block). Sources untouched.
4. (dropped by r4 — no `highlighterTest.json` edit; it stays byte-identical, visual-only by usage)
5. ⚠️ PROTECTED FILE — Protected-file confirmation for `package.json` — retire the **14** scripts listed in §3;
   rename `ebooksE2ETest_thor` → `ebookE2EstudentTest_thor` (retargeted to the new file) and
   `createAssignmentFeatureTest_thor` → `createAssignmentTest_thor`; retarget `ebookFocusA11yTest_thor` →
   `ebookFocusA11yMergedTest.json`; add `ebookE2EteacherTest_thor`.
6. Re-run the **7** perimeter scripts green; diff against baselines (§6). **No file deletions at any point
   (r4).**

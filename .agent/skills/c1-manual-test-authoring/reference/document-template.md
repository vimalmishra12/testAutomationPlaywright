# Output structure — the manual test-case document and register

> The canonical example is
> `test/Manual/C1App/AdminApp-Classes/AdminApp_Classes_tab_test_cases.md` + `.xlsx`.
> This file describes that structure so it can be reproduced for a new area. **Where they
> disagree, the live example wins** — and update this file.

---

## 1. Where the files live

```
test/Manual/<App>/<Area>/
    <Area>_test_cases.md      ← required
    <Area>_test_cases.xlsx    ← required
    <TST_ID>_<description>.csv  ← any upload fixtures, real template format
```

Existing areas: `test/Manual/C1App/AdminApp-Classes/`, `.../NEMO-24306/`, `.../FOC/`,
`test/Manual/Builder/CreateEbook/`, `.../FamilyImage/`, `.../NEMO-24401/`, `.../NEMO-24402/`,
`.../UmbrellaImage/`.

**One document per area, extended by batches** — do **not** start a new file per batch. The Admin App
document grew from 22 → 82 TCs across six batches in one file, which is what keeps the coverage map
and the register meaningful.

---

## 2. Markdown document — section order

### 2.1 Title

```markdown
# Manual Functional Test Cases — <App>: <Area> (Batch <N>)
```

### 2.2 Header block

Bold key–value lines, then the notes. Reproduce these fields:

```markdown
**Source:** `<scenario source file>` — <what it contains>
**Module:** <MOD> (<Name>) — *maps to the future `<pageObject>` page object when automated*
**App:** <App name> — `<host>` (<env>)
**Page in scope:** <screen> — `<url pattern>`
**Generated:** <YYYY-MM-DD> | **Total TCs:** <N> (<P> Positive · <E> Edge · <Neg> Negative) — <coverage claim>
**Execution status (<YYYY-MM-DD>):** **<X> of <N> TCs automated and passing.**
- Module **<MOD>** (`TST_<MOD>_TC_<a>–<b>`, <n> TCs) — Requirements <list> — via `npm run <script>` on **<env>** (<date>).
- …one bullet per module…

The remaining **<n> TCs are Not Run** (<modules>).

**Batches:** Batch 1 — <name> (`TST_<MOD>_*`, module <MOD>, <n> TCs) · Batch 2 — …
```

Then the ordering / scope / convention note as a blockquote:

```markdown
> **Ordering:** test cases are **grouped by Linked Requirement (scenario)** so every requirement's
> TCs sit together; within each group they run **Positive → Edge → Negative**. (This intentionally
> departs from `manual-test-standard.md`'s global P→E→N ordering, per request.) **S.No.** is
> sequential in this grouped order; **Test Case IDs** are stable identifiers and therefore appear
> out of numeric sequence within a group.
>
> **Batch <N> scope (agreed):** <what is in>. Deferred to later batches: <what is out>.
>
> Unverified expected text is marked `[ASSUMED]`; env-specific values use `<PLACEHOLDER>` (see Remarks).
```

**Notable-change notes** go here too, dated, as their own bold paragraphs — e.g. a newly added TC, a
corrected case, a status change with its reason. Blocked cases get an explicit paragraph naming them
and the single reason they share.

### 2.3 Requirement → Test Case coverage map

```markdown
## Requirement → Test Case coverage map

| Linked Requirement (scenario) | Mapped TC IDs (P → E → N) |
|---|---|
| #1 — Verify class tab is loading | TST_CLST_TC_1 |
| #2 — Verify filter functionality is working fine | TST_CLST_TC_2, TC_3, TC_4, TC_19 (E), TC_22 (N), TC_23 |
```

Edge and Negative cases are suffixed `(E)` / `(N)`. **Every scenario in the source gets a row**, even
if the mapped cell says "none — <reason>".

### 2.4 Product reference

```markdown
## Product reference (captured live <date>, <env> · <school / account>)
```

Prose + tables describing what was actually observed: layout, controls, entry paths, modal copy,
statuses, URLs. One `###` subsection per batch, each with its own `captured live <date>` stamp, so a
reader can tell how fresh each part is.

This section is what lets someone review the cases without opening the app. It is **not** a selector
dump — selectors belong in `C1Selectors.json` and traps belong in product knowledge.

### 2.5 Test cases

```markdown
## Section — Test Cases (grouped by Linked Requirement)

### Requirement #<n> — <scenario name>

| Field | Value |
|---|---|
| **S.No.** | 1 |
| **Test Case ID** | TST_CLST_TC_1 |
| **Title** | Verify the Classes tab loads with all expected components |
| **Linked Requirement** | #1 — Verify class tab is loading |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | School opened from "My school accounts". |
| **Test Steps** | 1. Open school "3 July Test School 1". 2. Observe the Classes tab. |
| **Test Data** | — |
| **Expected Result** | … |
| **Remarks** | … |
| **Actual Result** | *(blank in design)* |
| **Status** | *(blank in design / `Not Run` / `Blocked` with reason)* |
| **Comments / Defect ID** | *(blank in design)* |

---
```

**One vertical 14-row table per TC**, `---` between cases. This is the format to keep — it reads
well in review and maps 1:1 onto the register's columns.

Field notes:

| Field | Rule |
|---|---|
| **S.No.** | Sequential across the whole document, in grouped order. Never renumbered to insert. |
| **Test Case ID** | `TST_<MOD>_TC_<N>` — `<MOD>` from the future page object (AGENTS.md Rule 6) |
| **Title** | `Verify <expected outcome> when <condition>` |
| **Linked Requirement** | The scenario **name**, e.g. `#2 — Verify filter functionality is working fine` (not just a number) |
| **Type** | `Positive` \| `Edge` \| `Negative` — boundaries are `Edge` |
| **Priority** | `High` \| `Medium` \| `Low`, risk-based and **independent of position** |
| **Test Steps** | Numbered, atomic, in one cell |
| **Test Data** | CSV filename and/or the specific inputs; `—` if none |
| **Expected Result** | The thing checked. Quote product copy verbatim where copy is the point. |
| **Remarks** | Caveats, `[ASSUMED]` notes, `<PLACEHOLDER>` explanations |
| **Actual Result / Status / Comments** | Tester columns — blank in design (see SKILL golden rule 8) |

Once a case is executed or automated, `Comments / Defect ID` carries the attribution, e.g.
`Automated — adminClassesTab.test.js (npm run P1AdminClassesTab_Thor, thor). Last run 2026-08-17: 12/12 passing.`

### 2.6 Open items

```markdown
## Open items / `[ASSUMED]` to confirm on the next live pass

1. **<Topic>** (TST_…): <what is unknown>.
2. ~~**<Topic>** (TST_…)~~ — **RESOLVED <date>.** <what was found>.
```

**Resolved items are struck through and kept, never deleted** — the history of what was once unknown
is useful, and deleting it invites the same question again. Blocked items say what would unblock them.

---

## 3. The `.xlsx` register

**Same 14 columns, horizontal, one row per TC.** Verified header row:

| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| S.No. | Test Case ID | Title | Linked Requirement | Type | Priority | Preconditions |

| H | I | J | K | L | M | N |
|---|---|---|---|---|---|---|
| Test Steps | Test Data | Expected Result | Remarks | Actual Result | Status | Comments / Defect ID |

Header row is frozen, filled Cambridge purple `#3D1A66` with bold white text.

> **Known discrepancy:** `manual-test-standard.md` specifies a data-validation dropdown on the
> `Status` column (`Not Run / Pass / Fail / Blocked`). **It is not present in this workbook** and
> never has been — the standard and the artefact disagree. Do not "restore" it as part of an
> unrelated edit; raise it if it matters.

### Editing it — `tooling/xlsxRegister.js`

```bash
npm run register -- <command> <file> [args]
```

| Command | Purpose |
|---|---|
| `dump <file>` | every non-empty cell as `ref<TAB>value` |
| `find <file> <substring>` | locate cells by content |
| `get <file> <A1>...` | read specific cells |
| `set <file> <A1>=<value>...` | write cells in place |
| `status <file> <TestCaseId> <Pass\|Fail\|Not Run\|Blocked>` | the common case — finds the row by Test Case ID and writes the Status column |

Two deliberate guards, both worth knowing: it **refuses to run** when a `~$<name>.xlsx` lock file
exists (the workbook is open in Excel), and every write is **read back from the saved file** and
verified, reporting any cell that changed as a side effect. A silent no-op write is the failure mode
this protects against — the register is tracked in git as a binary.

> **Stale note in the tool itself:** `xlsxRegister.js`'s header comment says to "run `verify`
> (below) after any change". **There is no `verify` command** — the implemented set is
> `dump / find / get / set / status`. The read-back verification is built into `set` and `status`,
> so nothing is missing; only the comment is wrong. `[noted 2026-08-21]`

Round-trip fidelity was verified before adopting the tool: 1057 cells identical, header fill, bold
white font and frozen row all preserved.

**Do not** hand-patch `xl/worksheets/sheet1.xml` inside the zip. That older technique depended on the
workbook staying in inline-string format, and Excel silently breaks it on save. Retired 2026-08-19.

---

## 4. Traceability variant (AC-driven tickets)

When the source is a ticket with formal acceptance criteria rather than a scenario list, use the
full traceability structure from `manual-test-standard.md` instead of §2.3's coverage map:

- **Tab 1 / Section 1 — Traceability Matrix:**
  `AC ID | AC Description | UC ID | UC Description | Scenario ID | Scenario Description | Type | Mapped TC ID | TC Title`
- **Tab 2 / Section 2 — Test Cases:** the same 14 columns.
- `Test Case ID` stays module-based `TST_<MOD>_TC_<N>`; the compound `AC<n>.UC<n>.S<n>.TC<n>` goes in
  **Linked Requirement**.
- Ordering reverts to **global** Positive → Edge → Negative across the whole ticket.
- CSV fixtures are still named with the simple TST id.

Use the flat structure for tickets with no ACs, or ACs too thin to warrant a matrix.

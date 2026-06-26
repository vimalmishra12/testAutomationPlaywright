# Manual Functional Test Case Standard

> The agreed format and rules for manual functional test cases (Cambridge One).
> Claude Code MUST follow this document when generating manual test cases.

## How to use
- One test case set per Jira ticket / feature.
- Produced as **both** a Markdown document **and** an Excel register, using the columns below.
- The test data each case references is supplied as CSV file(s) in the **real upload-template format** (exact headers).

## Test Case ID convention
- Format: `TST_<MODULE>_TC_<N>` — canonical rule lives in **AGENTS.md Rule 6**; this section defers to it.
- `<MODULE>` = a short **UPPERCASE** code derived from the **page object / feature module** the
  case exercises (e.g. `login.page.js` → `BLOGI`, `manageReports.page.js` → `MRPT`), agreed once
  per module and reused everywhere. Derive it from the page object/feature — **not** the Jira ticket number.
- `<N>` = sequential number within the module.

## Ordering rule (mandatory)
Within a feature's set, **list and number test cases in this order**:

1. **Positive** cases first
2. **Edge / boundary** cases next
3. **Negative** cases last

`S.No.` and the `TC` number both follow this sequence (so `TST_<MODULE>_TC_1` is the first positive case).
**Priority is independent of position** — a high-priority negative case still sorts last but is marked `High`. (For a bug-specific ticket, the headline defect is captured here and flagged `High` in Priority even though it sits in the negative block.)

## Type values
`Positive` | `Edge` | `Negative`  — treat boundary cases as `Edge`.

## Columns / fields

| # | Field | Filled by | Notes |
|---|-------|-----------|-------|
| 1 | **S.No.** | Designer | Sequential row number (1, 2, 3 …), independent of the Test Case ID. First column. |
| 2 | **Test Case ID** | Designer | `TST_<MODULE>_TC_<N>` |
| 3 | **Title** | Designer | One line — what the case verifies |
| 4 | **Linked Requirement** | Designer | Jira ticket / acceptance criterion |
| 5 | **Type** | Designer | Positive / Edge / Negative |
| 6 | **Priority** | Designer | High / Medium / Low (risk-based) |
| 7 | **Preconditions** | Designer | Account state, data, starting screen |
| 8 | **Test Steps** | Designer | Numbered, atomic actions |
| 9 | **Test Data** | Designer | CSV filename and/or specific inputs |
| 10 | **Expected Result** | Designer | What should happen — the thing checked |
| 11 | **Remarks** | Designer | Caveats, specifics, `[ASSUMED]` notes |
| 12 | **Actual Result** | Tester | Blank in design |
| 13 | **Status** | Tester | Not Run / Pass / Fail / Blocked |
| 14 | **Comments / Defect ID** | Tester | Blank in design |

## Data rules
- Test data must use the **real upload-template format** (exact headers) — verify against the downloadable template before finalising.
- Mark unverified assumptions with `[ASSUMED]`.
- Use clear placeholders for environment-specific values (e.g. `<VALID_THOR_CLASS_KEY>`, `<EXISTING_THOR_USERNAME>`) and note them in Remarks.

## Example (abbreviated, showing the ordering)

| S.No. | Test Case ID | Type | Title |
|-------|--------------|------|-------|
| 1 | TST_NEMO_TC_1 | Positive | Valid usernames (incl. boundaries) pass |
| 2 | TST_NEMO_TC_2 | Edge | Username at 30-char maximum is accepted |
| 3 | TST_NEMO_TC_3 | Edge | Whitespace-only username is rejected |
| 4 | TST_NEMO_TC_4 | Negative | Empty username displays "Enter username" |
| 5 | TST_NEMO_TC_5 | Negative | Username below 3 chars shows min-length error |

> Note: this re-orders the earlier NEMO-24306 set to match the standard — positive first, negative (incl. the empty-username defect) last but marked High priority.

---

## Traceability Structure (preferred for AC-driven tickets)

When a ticket has formal acceptance criteria (ACs), prefer the **full traceability
structure** over the flat structure. Use the flat structure only for tickets without
ACs or when the ACs are too thin to warrant a matrix.

### Test Case ID and Linked Requirement (separate IDs)

Two distinct IDs are used:

1. **Test Case ID** (column 2, "Test Case ID"): module-based sequential pattern
   `TST_<MODULE>_TC_<N>`, where `<MODULE>` is the page-object/feature code (AGENTS.md Rule 6) —
   e.g. `TST_MRPT_TC_1` … `TST_MRPT_TC_18`. Do **NOT** embed the Jira ticket number in this ID;
   the ticket is captured by the Linked Requirement / compound ID below. Numbered sequentially by
   S.No. in the Test Cases tab (Positive → Edge → Negative ordering).

2. **Linked Requirement** (column 4, "Linked Requirement"): compound traceability ID
   `AC<n>.UC<n>.S<n>.TC<n>` — e.g. `AC1.UC1.S4.TC1`. This is the row's anchor in
   the Traceability Matrix.

The four levels in the compound ID mean:
- **AC** = Acceptance Criterion from the ticket
- **UC** = Use Case under that AC (what the user is trying to do)
- **S** = Scenario under that UC (specific situation — Positive / Edge / Negative)
- **TC** = Test Case for that scenario (one or more per scenario)

The **Traceability Matrix** is the bridge — it shows both IDs side-by-side so any
reviewer can map an AC scenario to the TST that runs it (and vice versa).

`S.No.` in the test cases tab is still a simple sequential number (1, 2, 3…) for
quick row reference.

### Ordering rule (within Test Cases tab)

Still **Positive → Edge → Negative**, applied across the whole ticket (not per AC).
This makes the test cases tab read top-to-bottom from "happy path" to "headline defect".

### Test Case title style

End-user readable. Use the pattern:
**"Verify <expected outcome> when <condition>"**

Examples:
- ✅ "Verify CSV upload completes successfully when all adult user fields are valid"
- ✅ "Verify 'Enter username' error is shown on the adult page when the username field is empty"
- ❌ "Valid adult CSV upload — all fields correct, upload proceeds"
- ❌ "Empty username displays error"

### Output structure for traceability tickets

Two-tab Excel workbook and a two-section Markdown document:

**Tab 1 / Section 1 — Traceability Matrix**
Columns: `AC ID | AC Description | UC ID | UC Description | Scenario ID |
Scenario Description | Type | Mapped TC ID | TC Title`

**Tab 2 / Section 2 — Test Cases**
Standard 14 columns (S.No. first; Test Case ID = compound ID).
Status column has a data-validation dropdown: `Not Run / Pass / Fail / Blocked`.
Header fill = Cambridge purple `#3D1A66`, white bold text. Freeze header row.

### Test data file naming (traceability)

`<TST_ID>_<short_description>.csv` — uses the simple TST ID (not the compound
AC ID) so the CSV filename matches the Test Case ID column in the doc.

e.g. `TST_MRPT_TC_12_empty_username_adult.csv` (the TST ID is module-based, not ticket-based)

### Output structure summary

| Artefact | What it contains |
|---|---|
| **Traceability Matrix tab** | Both IDs per row: `Mapped TC ID` (compound) + `TST ID` (simple) — the bridge |
| **Test Cases tab — Test Case ID col** | Module-based `TST_<MODULE>_TC_<N>` (no ticket number) |
| **Test Cases tab — Linked Requirement col** | Compound `AC<n>.UC<n>.S<n>.TC<n>` |
| **CSV filenames** | Prefixed with the TST ID, not the compound ID |

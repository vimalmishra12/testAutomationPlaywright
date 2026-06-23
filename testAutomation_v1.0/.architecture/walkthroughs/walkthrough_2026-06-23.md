# Session Walkthrough — 2026-06-23

## Summary
Reviewed the `HK_BuilderCloneCases_1` clone-component / clone-ebook test commit against the
framework rules, then closed the documentation gaps that allowed three rule violations
(protected-file edits, hardcoded selectors in page objects, and page objects bypassing
`baseActionLibrary`). All changes are to architecture/instruction docs only — no protected
JS or framework code was touched.

## Changes Made

### 1. .architecture/system.md
- **Type:** Modified
- **Layer:** Config / Docs (architecture blueprint)
- **What changed:**
  - Selectors Module section generalized from C1-only to
    `testResources/selectors/<App>/<App>Selectors.json`, with the real both-app directory
    layout and two JSON examples (`C1Selectors.json` → `css.ComproC1`,
    `BuilderSelectors.json` → `css.Builder`), plus a note that `ExperienceApp/csv/` holds
    legacy CSV exports, not the runtime source.
  - Added an "Escape hatch" callout under Layer 2 (Page Objects): when `baseActionLibrary`
    or the selector JSON can't express an interaction, extend the action library (protected
    file → confirmation) — never inline `global.page.*` calls or selector literals.
  - Added a note under "Protected Files" that AGENTS.md is the authoritative list (the
    system.md table is a mirror; AGENTS.md wins on divergence).
  - Stale fix: the communication-flow diagram now shows `action.click(sel)` /
    `action.setValue(sel, v)` instead of WDIO `$(selector).click()`.
- **Why:** Rules 7 (selector indirection) and 8 (action-library indirection) stated absolutes
  but never documented where non-static locators live or what to do when the library lacks a
  method; Rule 6 list was duplicated and could drift.
- **Lines affected:** Layer 2 page-object section; "Selectors Module" subsection; "Protected
  Files" intro; comm-flow diagram (`baseActionLibrary.js` box).

### 2. .architecture/decisions.md
- **Type:** Modified
- **Layer:** Config / Docs (ADRs)
- **What changed:**
  - ADR-003: replaced the buried "new interaction types must be added to the library" line
    with an explicit consequence — missing capability → add a named, logged method to the
    **protected** `baseActionLibrary.js` *with* confirmation, never an inline page-object
    hack; locators that can't be static strings are built inside that method.
  - ADR-013: added a consequence stating "additive only / no core changes" is a goal, not a
    guarantee — a legitimate protected-file change follows the confirmation protocol and is
    recorded as its own ADR, with **ADR-014 as the worked example**.
- **Why:** Resolves the catch-22 (the rule-8 remedy points at a rule-6 protected file) and
  removes the false "you'll never touch core" expectation that masked the protected-file rule.
- **Lines affected:** ADR-003 Consequences; ADR-013 Consequences.

### 3. AGENTS.md
- **Type:** Modified
- **Layer:** Config / Docs (AI agent instructions)
- **What changed:**
  - Fixed duplicate `### 7` headings: "Visual Testing Promotion & Scripting Rules" → `### 8`,
    "`tooling/`" → `### 9` (the `§7` cross-reference still points at Multiple Applications).
  - Rule 4: added a "no raw `global.page.*` or selector literals in a page object" bullet
    pointing to the escape hatch and ADR-003.
  - "How to Handle Uncertainty": added item 8 with the same guidance, so the first-read file
    answers "what do I do when the library has no method."
- **Why:** Surfaces the escape hatch in the file developers read first; fixes append-without-
  renumber duplication.
- **Lines affected:** Section headings (Visual / tooling); Rule 4 bullet list; "How to Handle
  Uncertainty" list.

## Architecture Decisions Triggered
No new ADRs. Clarifications to existing ADR-002, ADR-003, and ADR-013; ADR-014 referenced as
the template for confirmed protected-file changes. No new pattern introduced.

## Protected Files Touched
None — no protected files were modified. All edits are documentation (`system.md`,
`decisions.md`, `AGENTS.md`).

## Pending / Follow-up
- The reviewed `HK_BuilderCloneCases_1` commit still has open findings (family title/search
  mismatch in TC_19/TC_20, `waitForCloneSuccess` reporting success on error, hardcoded
  selectors, protected-file edits without the confirmation marker, missing per-session
  walkthrough). Those are on the feature branch and are separate from this doc work.

---

# Session Walkthrough — 2026-06-23 (append)

## Summary
Added a Forbidden-Actions guardrail to AGENTS.md against redefining an existing TC function in
another test file (the `TST_BLOGI_TC_1`/`TST_BLOGI_TC_2` login functions are copy-pasted into
`cloneComponent.test.js` and `cloneEbook.test.js` instead of being composed from
`login.test.js` via the execution file's per-step `testFile`). Documentation only — the actual
code de-duplication will be handled by the feature team, not in this session.

## Changes Made

### 1. AGENTS.md
- **Type:** Modified
- **Layer:** Config / Docs (AI agent instructions)
- **What changed:** Added a "Forbidden Actions" bullet — NEVER redefine an existing TC function
  in another test file; reference the original via the execution file's per-step `testFile` and
  compose it (ADR-011).
- **Why:** ADR-011's reuse principle was only in the ADR, not surfaced in the read-first file,
  so the login-TC duplication on `HK_BuilderCloneCases_1` was not hard-stopped.
- **Lines affected:** "Forbidden Actions" list (after the unregistered-TC-ID bullet).

## Protected Files Touched
None — documentation only (`AGENTS.md`).

## Pending / Follow-up
- Feature team to remove the duplicated `TST_BLOGI_TC_1`/`TC_2` from `cloneComponent.test.js`
  and `cloneEbook.test.js` and repoint the login steps in `cloneComponentTest.json` /
  `cloneEbookTest.json` at `./test/Builder/login.test.js` (as `builderLoginTest.json` already does).

---

# Session Walkthrough — 2026-06-23 (append 2)

## Summary
Audited all `.architecture/*.md` + `AGENTS.md` for duplication and ambiguity. The headline finding
was a contradictory TC-ID convention across four files (4-char module vs. `TST_<MODULE><TICKET>`).
Per team decision, made **module-name-from-page-object** the single canonical convention and aligned
every doc to it. Documentation only.

## Changes Made

### 1. AGENTS.md
- **Type:** Modified · **Layer:** Config / Docs
- **What changed:** Rule 6 TC-ID row → `TST_<MODULE>_TC_<N>` with `<MODULE>` derived from the page
  object (not the Jira ticket); added the canonical note (ticket lives in Linked Requirement /
  compound `AC.UC.S.TC` ID). Also generalized the stale `css.ComproC1.<camelCase>` selector-section
  row to `css.<App>.<camelCase>` with both-app examples.
- **Why:** Resolve the cross-file naming contradiction; AGENTS.md is the single source.

### 2. .architecture/system.md
- **Type:** Modified · **Layer:** Config / Docs
- **What changed:** Layer 3 "Naming" row now reads `TST_<MODULE>_TC_<N>` and defers to AGENTS.md Rule 6.

### 3. .architecture/manual-test-standard.md
- **Type:** Modified · **Layer:** Config / Docs
- **What changed:** Removed the conflicting `TST_<MODULE><TICKET_NUMBER>` form in three places
  (convention section, traceability Test Case ID, summary table + CSV-name example) → module-based,
  deferring to AGENTS.md Rule 6.

### 4. .architecture/product-knowledge.md
- **Type:** Modified · **Layer:** Config / Docs
- **What changed:** Builder header `TST_B…` → "per-module code (AGENTS.md Rule 6), e.g. `TST_BLOGI`".

## Architecture Decisions Triggered
No new ADR. Establishes one canonical TC-ID rule referenced by the other docs.

## Protected Files Touched
None — documentation only.

## Pending / Follow-up
- The convention change makes existing ticket-form IDs non-conforming: automated suites
  (`TST_NEMO24401_*`, `TST_NEMO24402_*`) and NEMO manual docs (`TST_NEMO24306_*`). Renaming to
  module-based IDs is a code/test change for the feature team (out of scope for this doc session).
- Other audit findings not yet actioned: stale `reloadSession` line in system.md; PROMPTS.md is a
  superseded migration log (stale protected-list / reporter claims) and could be archived to a
  pointer at ADR-012; AGENTS.md Rule 2 still hardcodes `C1Selectors.json`.

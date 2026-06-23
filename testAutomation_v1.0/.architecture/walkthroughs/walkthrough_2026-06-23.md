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

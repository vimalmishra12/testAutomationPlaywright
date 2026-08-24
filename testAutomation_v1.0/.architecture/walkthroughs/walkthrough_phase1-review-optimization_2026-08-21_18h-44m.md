# Session Walkthrough — 2026-08-21 (Phase 1 review & optimisation)

## Summary

No test authoring. A **retrospective on the Phase 1 admin programme** (`P1Admin*`, 2026-08-14 →
08-21) followed by the process and knowledge changes it justified. Seven pull requests, all
documentation and tooling; **no framework, test, page-object, selector or execution-file change**.

The review question the user asked was specific: *"how do we persist website knowledge of the Admin
interface so the next tab is quick?"* The honest answer at the start of the session was **we
don't** — the richest knowledge lived in session walkthroughs, a HANDOFF file and page-object
headers, none of which are read at session start, while
`product-knowledge/ExperienceApp.md` had **no section at all** for the create-classes bulk form,
Manage grading categories or Manage grading scales.

## What the review found

Read: all ten admin walkthroughs, `HANDOFF-adminclasses-scenario3.md`, `authoring-status.md`, both
skills, the invariants sheet and the current product knowledge. Six recurring cost centres:

| # | Cost centre | Evidence |
|---|---|---|
| 1 | **"The app signals ready before it is"** | 12+ separate instances: filter panel close, optimistic sort label, mid-animation expand, `isInitialized` before the Angular binding, the materials modal's loading state rendering the words *"No search results"* |
| 2 | **Pre-rendered DOM → false greens** | 4 permanent modals on grading categories, 4 on scales, **11** on class grade settings, plus per-row menu items and per-row label dropdowns |
| 3 | **Positional ids re-issued** | `checkbox-N`, `gradingCategoryActionLink-N`, `manageGradingScaleLinkDropDown-N`, band rows re-indexing — rediscovered on four screens |
| 4 | **Shared-school state bleed** | Draft restored across runs; filter and search persist server-side; class count 15 → 26 crossed the 20-row page size and broke a sort assertion that had passed for two sessions |
| 5 | **Unmeasured timeouts** | `1000` copy-pasted 13× against a measured 3.6 s close; a poll budget set to exactly mocha's timeout **twice**; a 90 s wait that *hid* the real bug for five runs |
| 6 | **Building from documents instead of live capture** | `adminClassesTab` session 1: 2/6 first run, ~15 debug runs. Same page, captured live next session: **12/12 first run, no fixes.** |

Three secondary patterns: hypothesis loops (three wrong guesses when the answer sat in an existing
screenshot), a documented trap read at session start and still shipped, and the same
type-and-read-back fix hand-written in **four** page objects.

## Changes Made

### PR #26 — `admin-shared.md` + the manual-authoring skill

- **`product-knowledge/ExperienceApp/admin-shared.md`** — *Created* — 550 lines (now 619).
  Everything true of **every** admin screen, deliberately split so both halves of the pipeline can
  use it: **Part A — product behaviour** (navigation, field caps, async/persistence, shared-school
  blockers, verified copy, fixtures) feeds manual test design; **Part B — automation traps**
  (reconnaissance checklist, pre-rendered modals, positional ids, CSS-only-disabled buttons,
  Angular typing, a 12-row optimistic-UI table, measured timings, qid families, the settled visual
  verdict) feeds Phase 1.
- **`.agent/skills/c1-manual-test-authoring/`** — *Created* — SKILL.md + `reference/document-template.md`.
  The `scenarios → manual test cases` step had no skill, only a format standard. Loads the standard
  → product knowledge → a narrow automation-awareness slice (module codes per AGENTS.md Rule 6,
  shared-env blockers), then Ground → Design → Register. Codifies the existing
  `test/Manual/<App>/<Area>/` `.md` + `.xlsx` format, including grouping by Linked Requirement.
- Pointer edits: `product-knowledge.md`, `ExperienceApp.md`, `CLAUDE.md`.

### PR #27 — `c1-test-authoring` process changes

- **`phases/1-build.md`** — added **Step 0, reconnaissance sweep** (nine items, one capture pass
  before any selector) and **Step 0b, applicable-traps list** (a written trap / applies-here? /
  where-it-is-handled table). Both added as subsections so steps 1–6 were not renumbered.
- **`phases/2-run-fix.md`** — added the **evidence audit** section and exit items: open the report
  and confirm each TC's screenshot shows what it asserts; re-check Phase 1's traps table against
  the shipped code.

### PR #28 — per-screen product knowledge

- **`admin-create-classes-form.md`** (252 lines), **`admin-grading-scales.md`** (237),
  **`admin-grading-categories.md`** (194) — *Created.* Promoted from walkthroughs, the HANDOFF file
  and page-object headers.

### PR #29 — invariants

- **`ARCHITECTURE-INVARIANTS.md`** — amended **#2** (a positional id is not a stable selector; scope
  container-level selectors) and **#5** (`isInitialized()` must wait for framework *state*, with the
  counter-rule to keep that budget short); added **#15 — pre-rendered UI is the norm; presence never
  proves state**, framed as an *assertion* trap since #1 already covers the *wait* side.

### PR #30 — ADR-020 and ADR-021

- **`decisions.md`** — **ADR-020** (product knowledge splits per feature area within an app;
  extends ADR-018 and supersedes its reading rule) and **ADR-021** (shared-environment test data
  protocol, nine rules). ADR-018 marked as extended; `CLAUDE.md` updated so ADR-020's stated
  consequence is true rather than aspirational.

### PR #31 — the ADR-020 migration

- **`ExperienceApp.md`** — *Rewritten as an index*: **772 lines → 79**.
- Four features moved out verbatim into `admin-bulk-account-csv.md`, `admin-classes-tab.md`,
  `admin-class-grade-settings.md`, `admin-grading-details-pages.md`.
- **Losslessness proven mechanically, not by eye:** each body hashed before the write and after
  reading it back (four IDENTICAL), then all four concatenated and compared to the original's entire
  feature content — **47,494 bytes, matching sha256**.
- `c1-environment-test-replicator/SKILL.md` updated too: without it, that skill would have kept
  reading an index with no knowledge in it. A real regression, not a stale link.

### PR #32 — `tooling/tcMap.js`

- **`tooling/tcMap.js`** — *Created* (356 lines) — derives the TC → suite map from the execution
  files. Modes: regenerate, `--check`, `--findings`, `--tc=<ID>`, `--json`.
- **`tooling/tc-map.md`** — *Created* (generated, 1,868 lines).
- Wired into the Phase 1 exit checklist so "exec file references only registered TC ids" is
  mechanical rather than eyeballed.

## Architecture Decisions Triggered

- **ADR-020** — Product Knowledge Splits Per Feature Area Within an App. Accepted, migration
  mandated **and executed the same session**.
- **ADR-021** — Shared-Environment Test Data Protocol. Accepted.
- **Invariants 2 and 5 amended; Invariant 15 added.**
- ADR-018 extended (not superseded); ADR-019 unchanged but now enforced by a Phase 2 checklist item
  rather than existing only as a decision record.

## Protected Files Touched

**None.** `package.json` was deliberately not edited — the user's decision was that it holds actual
test scripts only, so `tcMap` is run as `node tooling/tcMap.js` rather than an npm script.
(`xlsxRegister.js` has one, `npm run register`, so this is a knowing inconsistency.)

## Things found while working — all pre-existing

1. **13 blocking TC-registration errors.** `ebookLearningHyperlinkVC{,_V.1.0}.json` reference
   `TST_EBOOK_TC_1/2/4` and `TST_EBOO_TC_55..61`, none registered in any TC repository. Those suites
   would throw. **No npm script runs them**, which is why nobody has noticed. Found by `tcMap` on
   its first run.
2. **47 orphan TCs** — registered and defined, wired into no execution file.
3. **`P1AdminclassBulkCreateCSV_Thor` creates two real classes per run and never deletes them.**
   Raised as a possible gap; the user confirmed **this is the requirement** — that suite exists to
   prove the full CSV path *through creation*. Documented as intended, not as a defect.
4. **A naming trap that would break a cleanup sweep.** `adminAddClassBulk` uses `BulkCSV_Class_1`
   (never created), `adminAddClassBulkCreateCSV` uses `BulkCSV_Class1` (**is** created). A sweep
   written for the more official-looking underscore form finds nothing and reports clean. Documented:
   sweep on `BulkCSV_` alone.
5. **`authoring-status.md` is stale** — it claims `adminAddClassBulk`'s `schoolKey` points at
   `MQA-ABC-DEF`; all four data nodes read `FCN-CHZ-PDA`.
6. **`xlsxRegister.js`'s own header** tells you to run a `verify` command that does not exist.
7. **`manual-test-standard.md`** specifies a Status dropdown that is not present in the workbook.

## Corrections made during the session

Recorded rather than quietly fixed, per this repo's convention.

- **Four transcription errors in `admin-shared.md`**, caught by a fact-check before commit: root
  `tooling/` **is** gitignored now (the old warning had already been actioned); `.mcp.json` is
  tracked but **no** gitignore rule matches it; five modules visually assessed, not six; and three
  suites still carry `Phase 3 ⬜ pending`, so the admin area is **not** fully assessed.
- **`admin-shared.md` §A2 pointed at three files that did not exist** — I had written the *proposed*
  filenames as if they were real. Corrected in PR #28, then made true by the PR #31 migration.
- **All four files in PR #26 were first written to the wrong checkout** — the main repo on branch
  `main` rather than this session's worktree. Copied across, verified byte-identical, and the
  duplicates left in place at the user's request until merge.

> The fact-check is the transferable lesson: every mechanically checkable claim (selectors, npm
> scripts, page-object methods, timeout constants, TC ids, file paths) was verified against the repo
> before commit, and it caught six errors across two PRs. A confidently-stated wrong number in a
> knowledge file is worse than no knowledge file, because the next session will trust it.

## Pending / Follow-up

1. **Manual ↔ automation mapping is still not derivable.** `tcMap` solves *"which suite runs this
   TC?"* but not *"which automation TCs cover this manual case?"* — that link exists only as prose in
   Remarks cells. Needs a structured `Automated TC IDs` column in the register plus a second data
   source in the tool, and the manual-authoring skill would have to require the column or it will go
   stale the same way. **Deferred by the user (2026-08-21).**
2. **Decide what to do with `tc-map.md`** — 221 KB, tracked, will churn whenever an exec file
   changes. Alternative: gitignore it and run `--findings` in CI, which needs no file.
3. **`--check` exits 1 today** because of the 13 pre-existing blocking findings. Adopting it as a
   gate means fixing or baselining those first.
4. **The 13 blocking + 47 orphan TCs** are unowned. Not this session's work; now visible.
5. **A dedicated school** unblocks both `TST_GCAT_TC_4` and `TST_GSCL_TC_4` (max-limit cases). Their
   expected copy is already captured, so each is short work once it exists.
6. **Phase 3 (visual) still ⬜ pending** for `schoolAdminAddClassValidation`,
   `schoolAdminAddClassBulk` and the workflow suite's later TCs.
7. **`authoring-status.md` is doing two jobs** — its own header says history lives in walkthroughs,
   yet it is 28 KB of closed features carrying durable findings. Promoting that content and letting
   it shrink to in-flight blocks was proposed in the review and **not done**.
8. **GSCL has no boundary manual case** for its 20-character title limit (GCAT has one for its
   50-char field). A genuine manual-coverage gap.
9. **`addValueVerified()`** — the type-and-read-back loop now exists in four page objects. Promoting
   it to `baseActionLibrary.js` is the durable fix and needs protected-file confirmation.

## Not done in this session

No test was written, run or fixed. The next automation batch remains **CLON TC_1 + TC_3**, unchanged
from the previous handoff.

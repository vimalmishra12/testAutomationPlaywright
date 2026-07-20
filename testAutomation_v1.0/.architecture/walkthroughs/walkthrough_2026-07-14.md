# Session Walkthrough — 2026-07-14

## Summary
Split `.architecture/product-knowledge.md` per application (ADR-018): the file becomes a thin
index, and the three app sections moved verbatim into new per-app files under
`.architecture/product-knowledge/`. Updated all live references (CLAUDE.md, AGENTS.md,
decisions.md, system.md). Documentation-only session — no framework code changed.

## Changes Made

### 1. `.architecture/product-knowledge/ExperienceApp.md`
- **Type:** Created
- **Layer:** Architecture docs
- **What changed:** New per-app knowledge file holding the `## APP: NEMO` section (moved
  verbatim from product-knowledge.md lines 68–232) plus a living-document/scope banner.
- **Why:** ADR-018 split — C1/ExperienceApp knowledge in its own file.

### 2. `.architecture/product-knowledge/Builder.md`
- **Type:** Created
- **Layer:** Architecture docs
- **What changed:** New per-app file holding the `## APP: Builder` section (moved verbatim
  from product-knowledge.md lines 235–304) plus banner.
- **Why:** ADR-018 split.

### 3. `.architecture/product-knowledge/Integrations.md`
- **Type:** Created
- **Layer:** Architecture docs
- **What changed:** New per-app file holding the `## APP: Blackboard / LTI` section (moved
  verbatim from product-knowledge.md lines 308–456) plus banner. One file for BB + LTI
  (deeplink flows interleave both); future LMSs (e.g. Moodle) append here.
- **Why:** ADR-018 split.

### 4. `.architecture/product-knowledge.md`
- **Type:** Modified (rewritten as index)
- **Layer:** Architecture docs
- **What changed:** Now a thin INDEX: app → file map, reading rule (index always + per-app
  file for the task's app; all files if app unclear), how-to-use bullets, cross-app lessons
  (fill() vs typing, repeated-selector transitions, poll-over-pause, ADR-016 tab helpers),
  and the per-app template. All app content removed (moved to files 1–3).
- **Why:** Keeps the original path alive so historical references never dangle; carries the
  always-loaded shared rules.

### 5. `CLAUDE.md` (repo root, outside testAutomation_v1.0)
- **Type:** Modified
- **What changed:** Mandatory-read list line for product-knowledge.md now says: read the
  index, then the per-app file matching the task's app; all per-app files if the app is
  unclear (Option 2 reading rule, chosen by user).
- **Why:** Context efficiency — most sessions concern one app.

### 6. `AGENTS.md` — "How to Handle Uncertainty" item 7 (~line 324)
- **Type:** Modified
- **What changed:** Points at the index + per-app files; append instruction now targets the
  relevant per-app file using the template in the index.
- **Why:** Reference update for the split.

### 7. `.architecture/decisions.md`
- **Type:** Modified
- **What changed:** (a) ADR-017 cross-reference now names `product-knowledge/Integrations.md`;
  (b) appended **ADR-018: Product Knowledge Split Per Application** (context, decision,
  reading rule, rationale, consequences).
- **Why:** Traceability — the split is a recorded structural decision.

### 8. `.architecture/system.md` — System Overview
- **Type:** Modified
- **What changed:** Added a 3-line note after the multi-application paragraph pointing at the
  index + per-app files (ADR-018).
- **Why:** Discoverability.

## Architecture Decisions Triggered
- **ADR-018 added** — product knowledge split per application, mirroring the appType boundary
  (ADR-013 / ADR-015).

## Protected Files Touched
None — no protected files were modified. Documentation (.md) changes only.

## Pending / Follow-up
- Optional: refresh the two JS comments that still say "product-knowledge.md"
  (`pages/Builder/ebookCreate.page.js:96`, `test/ExperienceApp/nemoUploadCsvValidation.test.js:15/23`)
  to name the per-app file. They still resolve to the index, so not dangling — deferred to
  avoid comment-only code churn.
- Historical walkthroughs deliberately NOT edited (session records; index path keeps their
  references meaningful).

---

# Follow-up session — 2026-07-15 (same feature: ADR-018 product-knowledge split)

## Summary
Aligned both repo skills under `.agent/skills/` with the ADR-018 product-knowledge split, and
fixed their staleness re: the third appType (`Blackboard`/Integrations, ADR-015), which neither
skill mentioned.

## Changes Made

### 1. `.agent/skills/c1-test-authoring/SKILL.md`
- **Type:** Modified
- **What changed:** (a) frontmatter triggers now include css.Blackboard / css.LTI / blackboard /
  lti / deeplink / integrations; (b) intro names the third appType (`Blackboard`, Integrations
  paths, dual namespaces — ADR-015); (c) "Always load" section adds the ADR-018 product-knowledge
  reading rule (index + per-app file for the task's app); (d) Workflow B notes the Integrations
  two-file/two-repo convention and seeding a per-app product-knowledge file for a new app.
- **Why:** Skill referenced neither product knowledge nor the Blackboard appType.

### 2. `.agent/skills/c1-environment-test-replicator/SKILL.md`
- **Type:** Modified
- **What changed:** (a) "Always load" blockquote adds the ADR-018 reading rule (per-app file for
  the app resolved in STEP 0); (b) multi-application note + STEP 0 now include `Blackboard`
  (exec files under `testExecutionFiles/Integrations/Blackboard/`, thor-only, dual namespaces);
  (c) Quick Reference selector-fix row notes Blackboard's TWO selector files.
- **Why:** Same staleness as skill 1; STEP 0 said "appTypes today: ExperienceApp, Builder".

## Architecture Decisions Triggered
None new — applied ADR-018 and ADR-015 to the skill docs.

## Protected Files Touched
None — no protected files were modified. Skill markdown only.

## Pending / Follow-up
- Same optional item as above: two JS comments still name "product-knowledge.md" (resolve to the
  index; not dangling).

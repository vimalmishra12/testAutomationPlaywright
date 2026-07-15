# Session Walkthrough — 2026-07-15

## Summary
Restructured the `c1-test-authoring` skill into a phased router + 3 phase files + 1 reference
file, to fix the systematic miss of the AGENTS.md §8 visual-testing rules. Added a live phase
state file (`.architecture/authoring-status.md`), invariant #12 (visual assessment gate), a
visual-script replication note in the replicator skill, and relaxed CLAUDE.md's
read-all-walkthroughs-at-session-start rule to on-demand.

## Root cause being fixed
The old single-file skill's Workflow A was a complete-looking 8-step checklist that omitted the
visual assessment entirely (TC-repo step never mentioned `visualTest`; npm-script step added only
the functional script, contradicting Rule B). "Visual" appeared only as a run mode in the
cheatsheet. Neither always-loaded doc surfaced the rule (no invariant existed; AGENTS.md §8 sits
at the file's bottom with confusing numbering). Long authoring sessions decayed whatever attention
the rule got at session start.

## Changes Made

### 1. `CLAUDE.md` (repo root)
- **Type:** Modified
- **What changed:** Mandatory-read list — walkthroughs are no longer read at session start;
  they are historical records consulted on demand (durable knowledge is promoted into
  decisions.md / product-knowledge / invariants, which remain mandatory reads). Writing a
  walkthrough at session end remains mandatory.
- **Why:** Blanket reading was expensive, unenforceable ("since the last session"), and
  redundant given the promotion discipline. Requested by user.

### 2. `.agent/skills/c1-test-authoring/SKILL.md`
- **Type:** Modified (rewritten as router)
- **What changed:** Now a slim router: golden rules (new rule 8 — every new TC starts
  `visualTest: false`, promotion only in Phase 3), phase detection (status file + repo state +
  explicit user instruction; ask if ambiguous), instruction to read exactly ONE phase file,
  new-appType special case, don'ts (new: never set visualTest outside Phase 3; never close a
  feature with a ⬜ phase). Workflow A/B content moved to phase/reference files.
- **Why:** Progressive disclosure — each session loads only the rules for its phase, so the
  visual gate becomes a phase that cannot fall off the end of a checklist.

### 3. `.agent/skills/c1-test-authoring/phases/1-build.md`
- **Type:** Created
- **What changed:** Authoring steps (selectors from the test cases, page object, test file,
  TC repo with `visualTest: false` + candidate flagging, data, exec file) + exit checklist
  creating the feature's block in authoring-status.md.

### 4. `.agent/skills/c1-test-authoring/phases/2-run-fix.md`
- **Type:** Created
- **What changed:** npm script (protected confirm), run/verify from real output, failure
  classification, propose-and-wait, 2-consecutive-clean-runs determinism rule + exit checklist.
  Explicitly states Phase 3 is still pending when green.

### 5. `.agent/skills/c1-test-authoring/phases/3-visual.md`
- **Type:** Created
- **What changed:** The AGENTS.md §8 workflow as a dedicated phase: decision table, Rule A
  Step 1 assessment + STOP, Step 2 promotion confirmation, Rule B dual scripts, Rule C naming,
  baseline bootstrap + compare runs, exit checklist removing the feature's status block.
  AGENTS.md §8 explicitly named as authoritative.

### 6. `.agent/skills/c1-test-authoring/reference/new-apptype.md`
- **Type:** Created
- **What changed:** Former Workflow B (new appType scaffolding), plus the ADR-015 Integrations
  notes and ADR-018 product-knowledge seeding step. Loaded only when adding an app.

### 7. `.architecture/authoring-status.md`
- **Type:** Created
- **What changed:** Live phase-state file — one block per in-flight test; the router reads it
  at session start; each phase's exit checklist updates it; blocks removed on Phase 3 completion.
  Replaces the earlier idea of grepping walkthroughs for phase state.

### 8. `.architecture/ARCHITECTURE-INVARIANTS.md`
- **Type:** Modified
- **What changed:** Added invariant #12 — new TC ⇒ `visualTest: false`; promotion requires the
  §8 assessment + user confirmation; visual TC in an exec file ⇒ dual npm scripts; feature not
  closed until every TC has an explicit visual decision.
- **Why:** The always-loaded sheet had no visual invariant — one of the four root causes.

### 9. `.agent/skills/c1-environment-test-replicator/SKILL.md`
- **Type:** Modified
- **What changed:** STEP 2c now says: if the source env has a `visualAcceptance_*` script,
  replicate it for the target env too (Rule B applies per environment; baselines bootstrap
  per runner).

## Architecture Decisions Triggered
> ⚠️ New pattern introduced — phased skill workflow with a live state file
> (`.architecture/authoring-status.md`). Consider recording as an ADR if it proves durable
> after a few features have flowed through it.

## Protected Files Touched
None — no protected files were modified. Skill markdown, architecture docs, CLAUDE.md only.

## Pending / Follow-up
- Consider an ADR for the phased-authoring pattern once validated in practice.
- Still open (from 2026-07-14): two JS comments naming "product-knowledge.md" (resolve to the
  index; not dangling).

---

# Follow-up (same day) — Agent Metrics tooling (Level 2 observability)

## Summary
Built `tooling/agent-metrics/` — a zero-dependency Node script that parses Claude Code session
transcripts (JSONL under `%USERPROFILE%\.claude\projects\`) into a per-session metrics CSV, to
observe agent performance over time (tokens, tool errors, failed test runs, skill/phase
attribution) and later verify whether the phased skill split reduces session cost.

## Changes Made

### 1. `tooling/agent-metrics/DESIGN.md`
- **Type:** Created — the agreed design: data source, CSV columns, heuristics, honest limits
  (user-corrections not auto-detectable; wall-clock includes idle), non-goals (no OTEL/hooks/cost).

### 2. `tooling/agent-metrics/collect.js`
- **Type:** Created — parser + `--summary` report (totals, per-skill/per-phase averages, top-5
  expensive sessions, error hotspots, `--split-date` before/after comparison). Usage deduped per
  requestId; subagent traffic counted separately; test runs detected via runner commands with
  failures matched by `is_error` / mocha "N failing".

### 3. Output
- `tooling/agent-metrics/output/agent-metrics.csv` — generated, already covered by the existing
  `output/` gitignore pattern (verified untracked).

## Verification
Ran against the real transcripts: 11 sessions (Jun 10 → Jul 15) parsed. Sanity confirmed —
the 2026-06-10 NEMO-24306 session shows as the most expensive (1.18M in+out tokens) with 40
tool errors and 19 failed test runs, matching the known history of that automation effort.

## Known heuristic caveat
Skill/phase attribution counts a session that READS OR EDITS a skill file as "using" that
skill — sessions that maintain skills (like today's) inflate those buckets. Fine for trend
analysis; noted in DESIGN.md limits.

## Protected Files Touched
None.

## Pending / Follow-up
- Re-run `--summary --split-date 2026-07-15` after a few post-split authoring sessions to get
  the real before/after comparison (currently 0 "after" sessions).
- Level 3 (SessionEnd hook for auto-capture) only if Level 2 proves valuable.

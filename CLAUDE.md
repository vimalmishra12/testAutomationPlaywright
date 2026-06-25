# Claude Code Instructions — testAutomationPlaywright

## MANDATORY: Read architecture files before every task

At the start of **every** conversation or task, read all `.md` files under
`testAutomation_v1.0/.architecture/` before doing anything else:

- `testAutomation_v1.0/.architecture/system.md`
- `testAutomation_v1.0/.architecture/decisions.md`
- `testAutomation_v1.0/.architecture/product-knowledge.md`
- `testAutomation_v1.0/.architecture/PROMPTS.md`
- `testAutomation_v1.0/.architecture/manual-test-standard.md`
- Any files under `testAutomation_v1.0/.architecture/walkthroughs/` added since the last session

These are the authoritative source of architecture decisions, product rules, and
standards. All code and test design must conform to them.

## Skills — canonical source of truth

For ALL test-automation work in this repo, the authoritative skills are the
repo-tracked ones under `.agent/skills/` — they version with the code and are
always the latest:

- `c1-test-authoring` — writing/editing tests, page objects, selectors,
  execution files, running/verifying tests, adding an appType.
- `c1-environment-test-replicator` — porting/replicating a test to another
  environment (thor → qa/stage/prod) and fixing environment-specific failures.

These SUPERSEDE the generic bundled `qa-test-automation` plugin skill. If both
could apply, always use the `.agent/skills/` version. Treat the plugin skill as
a fallback only when no repo skill covers the task.

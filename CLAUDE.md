# Claude Code Instructions — testAutomationPlaywright

## MANDATORY: Read architecture files before every task

At the start of **every** conversation or task, read all `.md` files under
`testAutomation_v1.0/.architecture/` before doing anything else:

- `testAutomation_v1.0/.architecture/system.md`
- `testAutomation_v1.0/.architecture/decisions.md`
- `testAutomation_v1.0/.architecture/product-knowledge.md` (the INDEX) — then read
  the per-app knowledge file under `testAutomation_v1.0/.architecture/product-knowledge/`
  matching the task's application (`ExperienceApp.md`, `Builder.md`, or
  `Integrations.md`); if the application is not yet clear, or the task spans
  apps, read all per-app files (ADR-018).
  **Then read the feature-area files for the area the task touches (ADR-020)** —
  the area's `*-shared.md` first, then the per-screen file(s). For any Admin App
  (school-admin) task that means
  `product-knowledge/ExperienceApp/admin-shared.md` — Part A when designing manual
  test cases, Part A + Part B when authoring or debugging automation — plus the
  screen's own file. **`ExperienceApp.md` is an INDEX** — app header, environment
  URLs and the screen→file map; the knowledge itself lives in
  `product-knowledge/ExperienceApp/`. Never append knowledge to the app file.
- `testAutomation_v1.0/.architecture/PROMPTS.md`
- `testAutomation_v1.0/.architecture/manual-test-standard.md`
Walkthroughs (`testAutomation_v1.0/.architecture/walkthroughs/`) are **historical
session records — do NOT read them at session start.** Durable knowledge from them
is promoted into decisions.md, product-knowledge, and ARCHITECTURE-INVARIANTS.md
(already read above). Consult a specific walkthrough only on demand, when
investigating how or why a past change was made. (Writing a walkthrough at session
end remains mandatory — see AGENTS.md §Walkthrough.)
Likewise, **any `archive/` folder** — `.architecture/archive/` (retired handoffs, old
`authoring-status.md` snapshots) and `test/Manual/**/archive/` (pre-change register copies) —
is history: **do NOT read it at session start**, and never treat it as current. Open a file
there only on demand, when a live file points to it.

These are the authoritative source of architecture decisions, product rules, and
standards. All code and test design must conform to them.

## Skills — canonical source of truth

For ALL test-automation work in this repo, the authoritative skills are the
repo-tracked ones under `.agent/skills/` — they version with the code and are
always the latest:

- `c1-manual-test-authoring` — designing MANUAL functional test cases from
  scenarios/requirements, and maintaining the `.md` + `.xlsx` registers under
  `test/Manual/`. This is the FIRST step of the pipeline
  (scenarios → manual TCs → automation); it hands off to `c1-test-authoring`.
- `c1-test-authoring` — writing/editing tests, page objects, selectors,
  execution files, running/verifying tests, adding an appType.
- `c1-environment-test-replicator` — porting/replicating a test to another
  environment (thor → qa/stage/prod) and fixing environment-specific failures.

These SUPERSEDE the generic bundled `qa-test-automation` plugin skill. If both
could apply, always use the `.agent/skills/` version. Treat the plugin skill as
a fallback only when no repo skill covers the task.

## Credentials — never write one into a tracked file

Per ADR-025 (`decisions.md`) and Invariant 16 (`ARCHITECTURE-INVARIANTS.md`):
test data, `env.json`, `capabilities.json` and the manual registers carry
`{{env.<NAME>}}` tokens; the values live in `testAutomation_v1.0/.env`, which is
gitignored (as is any root-level `.env`), and CI supplies them as one
`C1_ENV_BUNDLE` secret.

- A new clone cannot run until `.env` exists: `cp .env.example .env`, then fill it.
  An unset or empty variable **throws by design** rather than submitting a blank
  password — do not "fix" that by adding a `||` fallback, which is how the first
  migration attempt was silently lost.
- Add the name to `.env.example` whenever a token is introduced.
- Run `npm run secrets:scan` before committing. It reads bytes and unpacks
  containers, because `.xlsx` registers are zip files: a text search reported this
  repo clean while 40 register cells still held a live password.
- Account e-mails and usernames are identifiers, not secrets, and stay literal.
  A value that is genuinely not a credential (a UI tab label, a deliberately weak
  value a negative test submits) goes in `tooling/secretScan.allowlist.json` with a
  reason — never by loosening a check.
- Registers are edited through their generator (`_generate.js`) where one exists;
  it rewrites the `.md` and `.xlsx` together, so never hand-edit either.

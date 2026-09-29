# Claude Code Instructions — testAutomationPlaywright

## MANDATORY: Read architecture files before every task

At the start of **every** conversation or task, read these files before doing
anything else:

- `testAutomation_v1.0/AGENTS.md` — the non-negotiable rules, the protected-file
  list and the walkthrough rule.
- `testAutomation_v1.0/.architecture/ARCHITECTURE-INVARIANTS.md` — the always-loaded
  core of `system.md` + `decisions.md`. Each rule ends with a *Depth →* pointer to the
  ADR or `system.md` section that explains it.
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
- `testAutomation_v1.0/.architecture/manual-test-standard.md`

**Read on demand, not at session start — the deep reference:**
`testAutomation_v1.0/.architecture/decisions.md` (all ADRs) and
`testAutomation_v1.0/.architecture/system.md`. Open the specific ADR or section that an
invariant's *Depth →* pointer names, when your task touches it. Read the relevant
ADRs **in full** before you change a core or protected file, add or change an ADR,
or do something no invariant covers. If you are unsure whether an ADR applies, read
it — ambiguity defaults to reading more, never less.

**History — do NOT read at session start:**
- `testAutomation_v1.0/.architecture/PROMPTS.md` — the WebDriverIO → Playwright
  migration log. It is superseded by ADR-012 and contains stale details (e.g. an old
  protected-file list); never act on it without checking the live source.
- Walkthroughs (`testAutomation_v1.0/.architecture/walkthroughs/`) are historical
  session records. Durable knowledge from them is promoted into
  ARCHITECTURE-INVARIANTS.md and product-knowledge (read above) and into
  decisions.md (read on demand). Consult a specific walkthrough only when
  investigating how or why a past change was made. (Writing a walkthrough at session
  end remains mandatory — see AGENTS.md §Walkthrough.)
- **Any `archive/` folder** — `.architecture/archive/` (retired handoffs, old
  `authoring-status.md` snapshots) and `test/Manual/**/archive/` (pre-change register
  copies) — is history and never current. Open a file there only when a live file
  points to it.

AGENTS.md, `decisions.md` and `system.md` are the authoritative source of
architecture decisions and standards; ARCHITECTURE-INVARIANTS.md is their summary —
if it ever disagrees with them, they win. Product rules live in product-knowledge.
All code and test design must conform to them.

## Skills — canonical source of truth

For ALL test-automation work in this repo, the authoritative skills are the
repo-tracked ones under `.agent/skills/` — they version with the code, are
always the latest, and the team's other AI tools read them there too.
`.claude/skills/` holds only generated pointers to them, so Claude Code discovers
the skills automatically. Never edit a pointer: edit `.agent/skills/`, then run
`node testAutomation_v1.0/tooling/syncClaudeSkills.js` (needed after adding a skill
or changing a skill's name or description).

- `c1-manual-test-authoring` — designing MANUAL functional test cases from
  scenarios/requirements, and maintaining the `.md` + `.xlsx` registers under
  `test/Manual/`. This is the FIRST step of the pipeline
  (scenarios → manual TCs → automation); it hands off to `c1-test-authoring`.
- `c1-test-authoring` — writing/editing tests, page objects, selectors,
  execution files, running/verifying tests, adding an appType.
- `c1-environment-test-replicator` — porting/replicating a test to another
  environment (thor → qa/stage/prod) and fixing environment-specific failures.

### Pick the skill yourself — people here never name one

The people who use this repo (many newly onboarded) hand over test cases,
scenarios, a spreadsheet or a ticket and say "automate this" or "write the test
cases". They do not name a skill or give a path. Choose from the request:

| The request | Skill(s) |
|---|---|
| Scenarios, requirements, a Jira ticket, a spreadsheet, or ready-written test cases; "write / create test cases", "make the register", update statuses or results | `c1-manual-test-authoring` |
| "Automate" test cases that are **not yet** in a register under `testAutomation_v1.0/test/Manual/` | `c1-manual-test-authoring` first (build the register), then `c1-test-authoring` |
| "Automate" cases already in a register; write / fix / run / debug a test, page object, selector or execution file; visual assessment | `c1-test-authoring` |
| Run an **existing** test in another environment (thor → qa / rel / prod), or fix it there | `c1-environment-test-replicator` |

Say which skill you are using in your first reply. Ask only when a request
genuinely fits two rows.

These SUPERSEDE the generic bundled `qa-test-automation` plugin skill, and any
plugin copy of a repo skill (e.g. `anthropic-skills:c1-environment-test-replicator`)
— those may be stale. If both could apply, always use the `.agent/skills/` version.
Treat a plugin skill as a fallback only when no repo skill covers the task.

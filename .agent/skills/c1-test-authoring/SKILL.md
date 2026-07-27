---
name: c1-test-authoring
description: >
  Authoring and maintaining tests in this C1 / Builder Playwright-as-library + Mocha automation
  framework. Use whenever the user is writing or editing a test case, creating or changing a page
  object, adding/updating selectors, building an execution file, adding a new application (appType),
  running/verifying a test, or assessing/promoting visual tests. This is the AUTHORING skill — use it
  when the test does not yet exist and needs to be built (to "automate" a NEW flow/feature/scenario),
  or an in-flight authoring effort continues (run/fix phase, visual phase). If instead an existing
  test must be copied/ported to another environment, use c1-environment-test-replicator. Trigger on
  any mention of: add a test, write a test, fix a test, automate a flow, automate a new test,
  automate this scenario, automate in qa/thor (new test), page object, selector, selectorFile,
  isInitialized, execution file, TC repository, appType, css.ComproC1, css.Builder, css.Blackboard,
  css.LTI, blackboard, lti, deeplink, integrations, protected files, walkthrough, run the test,
  visual test, visual assessment, visualTest flag, visual promotion, novus/visual, lambdatest,
  continue phase, phase status.
---

# C1 / Builder Test Authoring Skill — Router

You are authoring or maintaining tests in a **Playwright-used-as-a-library + standalone Mocha**
framework (migrated from WebDriverIO — ADR-012) with a **JSON-driven execution engine**. It is
**multi-application**: everything is keyed by `--appType` (`ExperienceApp` = Cambridge One/C1 under
`css.ComproC1`; `Builder` = comproDLS Builder under `css.Builder`; `Blackboard` = the LMS/LTI
integration under `Integrations/` paths with TWO namespaces, `css.Blackboard` + `css.LTI` — ADR-015).

**Always load:** `testAutomation_v1.0/AGENTS.md` + `.architecture/ARCHITECTURE-INVARIANTS.md` (the
invariants cheat-sheet / index). **Product knowledge (ADR-018):** read
`.architecture/product-knowledge.md` (the index) + the per-app file under
`.architecture/product-knowledge/` for the task's app (`ExperienceApp.md`, `Builder.md`, or
`Integrations.md`; all of them if the app is unclear). **Consult on demand:** a specific ADR in
`.architecture/decisions.md` or a `system.md` section only when the task touches it — follow the
cheat-sheet's *Depth →* pointers. These are the source of truth; where they disagree with this
file, they win.

---

## Golden rules (apply in EVERY phase)

1. **Layer separation is absolute.** Test cases → call page objects only. Page objects → own ALL
   DOM interaction via the action library. Action/assertion libraries → wrap Playwright. Never reach
   across layers (e.g. no `page.locator` in a test, no selectors in a page object as string literals).
2. **Selectors are externalised.** Every selector lives in the app's selector JSON under its
   namespace: `css.<App>.<page>.<element>`. Page objects read them via
   `selectorFile = jsonParserUtil.jsonParser(selectorDir)`. A module must live **under `css.<App>`,
   never at the JSON root** (ADR-002).
3. **Test cases are stateless functions** named `TST_<MOD>_TC_<N>(testdata)`; they assert via the
   global `assertion`. No state between tests.
4. **Execution files are pure config** (Suite → Before/Test/After, TC ids, data file + jsonPath).
5. **Protected files need explicit confirmation before editing** — see AGENTS.md §"Protected Files".
   JSON data/selectors/exec files are NOT protected.
6. **On a test failure, propose the fix and wait for confirmation before editing.**
7. **Per session, keep a walkthrough** under `.architecture/walkthroughs/` (see AGENTS.md §Walkthrough).
8. **Every new TC starts `visualTest: false`.** Promotion to `true` happens ONLY in Phase 3 via the
   AGENTS.md §8 assessment + user confirmation — never during build or run/fix.

---

## PHASED WORKFLOW — determine the phase, load ONE phase file

Authoring is split into three phases with explicit handoffs. **Recommended: one session per phase**
for anything non-trivial (keeps context focused); a single session MAY flow through multiple phases
for small features — load each phase file only when you reach it.

### Step 1 — Read the status file

Read `.architecture/authoring-status.md` (tiny, fixed path). It holds one PHASE STATUS block per
in-flight test. If the request names a test that has a block, resume from its first ⬜ phase.
Cross-check against the repo — never trust the block blindly (e.g. verify the files it claims exist).

### Step 2 — Detect the phase

| Signal (request + repo state) | Phase |
|---|---|
| Test files / TC-repo entries / exec file do not exist yet; user says "automate/write/add a test" | **1 — Build** |
| Artifacts exist but no npm script or no evidence of a passing run; user says "run/fix/debug" | **2 — Run & fix** |
| All TCs passing; status block shows Phase 3 ⬜; user says "visual" / "assess visual" | **3 — Visual** |

An explicit user instruction ("do phase 2 for X") always wins over inference. If signals conflict
or the test name is ambiguous, **ask**.

### Step 3 — Read exactly ONE phase file and follow it

- Phase 1 → `.agent/skills/c1-test-authoring/phases/1-build.md`
- Phase 2 → `.agent/skills/c1-test-authoring/phases/2-run-fix.md`
- Phase 3 → `.agent/skills/c1-test-authoring/phases/3-visual.md`

(Paths are relative to the repo root `D:\testAutomation\QATestAutomation\`.)
Do NOT read the other phase files. Every phase file ends with an **exit checklist** that updates
`.architecture/authoring-status.md` — completing it is part of the phase, not optional.
**A feature is NOT done until Phase 3 is complete** (even if the outcome is "no visual candidates").

### Special case — adding a NEW application (appType)

Not a phase. Read `.agent/skills/c1-test-authoring/reference/new-apptype.md` and follow it; then the
app's first test goes through Phases 1–3 as normal.

---

## Don'ts (all phases)

- ❌ Hardcode selectors in page objects or tests — always `selectorFile.css.<App>.…`.
- ❌ Put a module's selectors at the JSON root — always under `css.<App>`.
- ❌ Edit a protected file without explicit confirmation.
- ❌ Use `setValue`/`fill` for credential or validated form fields — type with `addValue`.
- ❌ Commit real credentials. Creds belong in env vars (LT) or the per-app data file (plaintext only
  as an interim, to be secured) — never paste secrets into committed config.
- ❌ Claim a test passes without showing the real run output.
- ❌ Set `visualTest: true` outside Phase 3, or skip Phase 3 because the run is green.
- ❌ Close a feature with its authoring-status entry still showing a ⬜ phase.

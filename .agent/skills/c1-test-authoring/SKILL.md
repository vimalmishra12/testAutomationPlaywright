---
name: c1-test-authoring
description: >
  Authoring and maintaining tests in this C1 / Builder Playwright-as-library + Mocha automation
  framework. Use whenever the user is writing or editing a test case, creating or changing a page
  object, adding/updating selectors, building an execution file, adding a new application (appType),
  or running/verifying a test. This is the AUTHORING skill — use it when the test does not yet exist
  and needs to be built (to "automate" a NEW flow/feature/scenario). If instead an existing test must
  be copied/ported to another environment, use c1-environment-test-replicator. Trigger on any mention
  of: add a test, write a test, fix a test, automate a flow, automate a new test, automate this
  scenario, automate in qa/thor (new test), page object, selector, selectorFile, isInitialized,
  execution file, TC repository, appType, css.ComproC1, css.Builder, css.Blackboard, css.LTI,
  blackboard, lti, deeplink, integrations, protected files, walkthrough, run the test,
  novus/visual, lambdatest.
---

# C1 / Builder Test Authoring Skill

You are authoring or maintaining tests in a **Playwright-used-as-a-library + standalone Mocha**
framework (migrated from WebDriverIO — ADR-012) with a **JSON-driven execution engine**. It is
**multi-application**: everything is keyed by `--appType` (`ExperienceApp` = Cambridge One/C1 under
`css.ComproC1`; `Builder` = comproDLS Builder under `css.Builder`; `Blackboard` = the LMS/LTI
integration under `Integrations/` paths with TWO namespaces, `css.Blackboard` + `css.LTI` — ADR-015).

**Always load:** `testAutomation_v1.0/AGENTS.md` + `.architecture/ARCHITECTURE-INVARIANTS.md` (the
invariants cheat-sheet / index). **Product knowledge (ADR-018):** read
`.architecture/product-knowledge.md` (the index) + the per-app file under
`.architecture/product-knowledge/` for the task's app (`ExperienceApp.md`, `Builder.md`, or
`Integrations.md`; all of them if the app is unclear) — it holds confirmed validation rules, error
messages, and known quirks, so you don't re-discover or contradict them. **Consult on demand:** a
specific ADR in `.architecture/decisions.md` or a `system.md` section only when the task touches
it — follow the cheat-sheet's *Depth →* pointers.
These are the source of truth; where they disagree with this file, they win.

---

## Golden rules (do not violate)

1. **Layer separation is absolute.** Test cases → call page objects only. Page objects → own ALL
   DOM interaction via the action library. Action/assertion libraries → wrap Playwright. Never reach
   across layers (e.g. no `page.locator` in a test, no selectors in a page object as string literals).
2. **Selectors are externalised.** Every selector lives in the app's selector JSON under its
   namespace: `css.<App>.<page>.<element>` (C1 → `css.ComproC1`, Builder → `css.Builder`). Page
   objects read them via `selectorFile = jsonParserUtil.jsonParser(selectorDir)`. A module must live
   **under `css.<App>`, never at the JSON root** (ADR-002).
3. **Test cases are stateless functions** named `TST_<4CHAR>_TC_<N>(testdata)`; they assert via the
   global `assertion`. No state between tests.
4. **Execution files are pure config** (Suite → Before/Test/After, TC ids, data file + jsonPath).
5. **Protected files need explicit confirmation before editing** — see AGENTS.md §"Protected Files"
   (`playwright.setup.js`, `run.js`, `env.conf.js`, `baseActionLibrary.js`, `baseAssertionLibrary.js`,
   `testrunner.js`, `specGenerator.js`, `launchUrl.js`). JSON data/selectors/exec files are NOT protected.
6. **On a test failure, propose the fix and wait for confirmation before editing** (do not silently change).
7. **Per session, keep a walkthrough** under `.architecture/walkthroughs/` (see AGENTS.md §Walkthrough).

---

## Workflow A — Add a test for an EXISTING feature

1. **Selectors:** add/confirm the elements under `css.<App>.<page>` in
   `testResources/selectors/<App>/<App>Selectors.json`.
2. **Page object** (`pages/<App>/<page>.page.js`): add `isInitialized()` (wait for a stable anchor)
   + action methods (`click_*`, `set_*`, `getData_*`). Use the action library only:
   - **Typing into React/Angular forms:** use `clearValue` + `addValue` (pressSequentially), NOT
     `setValue` (`fill`) — `fill` doesn't fire the input events those forms need (notes / schoolName /
     Builder IdP all hit this).
   - **Cross-page / SPA navigation:** wait for the page transition (URL or a target element) before
     acting, especially when a selector repeats across pages (e.g. `button[type=submit]`).
   - **Colour/size assertions:** read `getCSSProperty(sel, prop).parsed.hex` / `.parsed.rgba`.
3. **Test file** (`test/<App>/<page>.test.js`): `TST_<MOD>_TC_<N>: async function (testdata) { ... }`.
4. **TC repository** (`testcaseRepository/<App>/<App>TCRepository.json`): register the module + testcase
   ids (its `selectorFile` must point at the app's selector file).
5. **Test data** (`testcaseData/<App>/<env>/*.json`): nested JSON, referenced by `jsonPath`.
6. **Execution file** (`testExecutionFiles/<App>/<env>/<name>.json`): Suite with `Before`
   (e.g. `launchUrl` + login) and the `Test` list.
7. **NPM script** (package.json) — PROTECTED file, confirm first:
   `"<feature>Test_<env>": "node core/runner/run.js --appType=<App> --testEnv=<env> --testExecFile=<name>.json --browserCapability=desktop-chrome-1920"`
8. **Run + verify:** `node core/runner/run.js --appType=<App> --testEnv=<env> --testExecFile=<name>.json --browserCapability=desktop-chrome-1920 --headless=true`.
   Confirm pass/fail from the real output; re-run to prove determinism for any flaky-looking fix.

## Workflow B — Add a NEW application (appType)

Purely additive — **no core-framework changes** (proven by Builder; ADR-013). Mirror the
`ExperienceApp` tree for `<App>`: `pages/<App>/`, `test/<App>/`,
`selectors/<App>/<App>Selectors.json` (own `css.<App>` namespace), `testcaseData/<App>/<env>/`,
`testExecutionFiles/<App>/<env>/`, `testcaseRepository/<App>/<App>TCRepository.json`, an `env.json`
block (`"<App>": { testExecDir, environments: { <env>: { url } } }`), and an NPM script. Start with a
login → landing smoke to prove the plumbing. See `pages/Builder/login.page.js` for a multi-step
cross-domain SSO example. **LMS integrations** (like Blackboard) use the `Integrations/` sub-path and
may need TWO selector files / TC repos — one per namespace (e.g. `css.Blackboard` for the LMS UI +
the portable `css.LTI` for the launched Cambridge One LTI pages); see ADR-015 before scaffolding.
Also seed a per-app product-knowledge file under `.architecture/product-knowledge/` and add its row
to the index's app → file map (ADR-018).

---

## Reporting / running cheatsheet

- **Default report:** mochawesome HTML at `output/reports/TestReports/mochawesome/report.html`
  (inline screenshots). Opt out: `--report=spec`; or `--report=allure`.
- **Visual regression:** `--visual=novus --skipAssertion=true` → pixelmatch vs baseline, custom
  timeline report at `output/reports/TestReports/visual/index.html`. Baselines are NOT committed
  (each runner bootstraps its own; first run = bootstrap, re-run for a real diff).
- **Tracing (debug filmstrip):** `--trace=true` → `traces/<Suite>.zip`; open via
  https://trace.playwright.dev (drag-drop) or `npx playwright show-trace traces/<Suite>.zip`.
- **Cloud:** `--browserCapability=lambdatest-chrome-1920` (LambdaTest Playwright grid; per-suite
  sessions + status; creds via `LT_USERNAME`/`LT_ACCESS_KEY` env vars).
- **Headless:** add `--headless=true` (headed uses system Chrome).

---

## Don'ts

- ❌ Hardcode selectors in page objects or tests — always `selectorFile.css.<App>.…`.
- ❌ Put a module's selectors at the JSON root — always under `css.<App>`.
- ❌ Edit a protected file without explicit confirmation.
- ❌ Use `setValue`/`fill` for credential or validated form fields — type with `addValue`.
- ❌ Commit real credentials. Creds belong in env vars (LT) or the per-app data file (plaintext only
  as an interim, to be secured) — never paste secrets into committed config.
- ❌ Claim a test passes without showing the real run output.

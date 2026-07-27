# Reference — Add a NEW application (appType)

Purely additive — **no core-framework changes** (proven by Builder; ADR-013). Mirror the
`ExperienceApp` tree for `<App>`:

- `pages/<App>/`, `test/<App>/`
- `testResources/selectors/<App>/<App>Selectors.json` (own `css.<App>` namespace — ADR-002)
- `testResources/testcaseData/<App>/<env>/`, `testResources/testExecutionFiles/<App>/<env>/`
- `testResources/testcaseRepository/<App>/<App>TCRepository.json` (its `selectorFile` points at the
  app's selector file)
- an `env.json` block: `"<App>": { testExecDir, environments: { <env>: { url } } }`
- an NPM script (protected file — confirm first)

Start with a login → landing smoke to prove the plumbing. See `pages/Builder/login.page.js` for a
multi-step cross-domain SSO example (type credentials with `addValue` — React/Angular IdP forms
ignore `fill()`; wait for each page transition when a selector repeats across steps).

**LMS integrations** (like Blackboard) use the `Integrations/` sub-path and may need TWO selector
files / TC repos — one per namespace (e.g. `css.Blackboard` for the LMS UI + the portable `css.LTI`
for the launched Cambridge One LTI pages); read ADR-015 before scaffolding. Never share a page
object across the two namespaces' test files (selector-cache guardrail, ADR-015A).

**Documentation scaffolding (ADR-018):** seed a per-app product-knowledge file under
`.architecture/product-knowledge/` (use the template in the index `product-knowledge.md`) and add
its row to the index's app → file map.

**"Additive only" is the goal, not a guarantee** — if the new app exposes a real gap in shared
infrastructure, that is a protected-file change with its own confirmation + ADR (see ADR-013's
consequences; ADR-014/ADR-015D are worked examples).

Once the scaffold exists, the app's first test goes through the normal Phases 1–3.

# Phase 1 — Build (author the test, capture selectors)

**Goal:** all test artifacts exist and are internally consistent. No test execution in this phase
(beyond selector capture against the live page); running/fixing is Phase 2; visual assessment is
Phase 3.

**Inputs:** the feature/ticket (manual test cases if they exist — check
`test/Manual/` and the ticket), the target `<App>` and `<env>`, and the per-app product-knowledge
file (validation rules, error messages, known quirks — do not re-discover or contradict them).

## Steps

1. **Selectors:** add/confirm the elements under `css.<App>.<page>` in
   `testResources/selectors/<App>/<App>Selectors.json`. Derive the element list from the test
   cases you are automating (walk each TC's steps; every interacted/asserted element needs a key).
   Capture from the live page (Playwright MCP under `tooling/` if available); prefer `qid` /
   `data-tid` attributes, fall back to stable classes. Blackboard note: BB UI → `BlackboardSelectors.json`
   (`css.Blackboard`); launched LTI pages → `LTISelectors.json` (`css.LTI`) — never mix (ADR-015A).
2. **Page object** (`pages/<App>/<page>.page.js`): `isInitialized()` (wait for a stable anchor)
   + action methods (`click_*`, `set_*`, `getData_*`). Action library only:
   - **React/Angular forms:** `clearValue` + `addValue` (pressSequentially), NOT `setValue`/`fill`.
   - **Cross-page / SPA navigation:** wait for the transition (URL or target element) before acting,
     especially when a selector repeats across pages (e.g. `button[type=submit]`).
   - **Colour/size assertions:** read `getCSSProperty(sel, prop).parsed.hex` / `.parsed.rgba`.
   - **Missing capability?** Add a named, logged method to `baseActionLibrary.js` (protected —
     confirm first); never inline raw `global.page.*` in the page object (Invariant 3).
3. **Test file** (`test/<App>/<page>.test.js`): `TST_<MOD>_TC_<N>: async function (testdata) {…}`.
   `<MOD>` = the module code agreed for the page object (AGENTS.md Rule 6) — never the ticket number.
4. **TC repository** (`testcaseRepository/<App>/<App>TCRepository.json`): register every TC
   (two-change rule — Invariant 7). **Set `"visualTest": false` for every new TC** — promotion is
   Phase 3's job, not yours. While registering, note which TCs *look* like visual candidates
   (fixed/static data per the AGENTS.md §8 decision table) — you will flag them in the exit
   checklist, NOT act on them.
5. **Test data** (`testcaseData/<App>/<env>/*.json`): nested JSON, referenced by `jsonPath`.
   Reuse existing login/launch TCs via the execution file — never redefine an existing TC (ADR-011).
6. **Execution file** (`testExecutionFiles/<App>/<env>/<name>.json`): Suite with `Before`
   (e.g. `launchUrl` + login) and the `Test` list. Every referenced TC id must exist in the repo.

## Exit checklist (mandatory — completes the phase)

- [ ] Every new TC exists in BOTH the test file and the TC repository, all with `visualTest: false`.
- [ ] Exec file references only registered TC ids; every `dataFile`/`jsonPath` resolves.
- [ ] Update `.architecture/authoring-status.md` — create/update the block:

```markdown
## <testName> (<App>, <env>)
- Phase 1 (build):   ✅ <date> — TST_<MOD>_TC_1..<N> registered; visual candidates: <list, or "none — all dynamic data">
- Phase 2 (run/fix): ⬜ pending
- Phase 3 (visual):  ⬜ pending
```

- [ ] Session walkthrough written/appended (AGENTS.md §Walkthrough).
- [ ] Tell the user: Phase 1 complete → next is Phase 2 (run & fix), recommended in a fresh session.

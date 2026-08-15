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

   > **If live capture is blocked, that is a BLOCKER to raise — not a reason to proceed.**
   > Selectors, timeouts and test data written from a document are hypotheses. `adminClassesTab`
   > was built this way (login failed in the browser sandbox) and shipped Phase 1 "complete";
   > its first real run was 2/6, and Phase 2 then took ~15 runs because every guess surfaced at
   > once, entangled by shared state. Tell the user capture is blocked and agree how to proceed
   > (different browser, credentials, a trace run) rather than inferring the DOM.
   >
   > In that case the browser was blocked but **`npm run` was not** — the framework's own login
   > chain was demonstrably working the same day. Check that before declaring yourself blocked.
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
- [ ] **The suite has been EXECUTED at least once against the target environment, and the real
      output is recorded in the walkthrough.** Failures here are expected and fine — making it
      pass is Phase 2's job. The point is that every selector, timeout and data value has met
      the actual app, so the handoff is a known list of failures rather than an unknown number
      of unverified guesses.

  > Everything above this line is a *static* check — it only proves the paperwork lines up. A
  > suite whose selectors match nothing on earth passes all of them. This is the only item that
  > proves the test is real.
  >
  > **A blocked browser is NOT a blocked framework.** If interactive capture (Playwright MCP)
  > fails, `npm run <script>` almost certainly still works — the framework has its own proven
  > login chain. Add `--trace=true` to capture full DOM snapshots through it. Exhaust that
  > before concluding you cannot verify.
  >
  > If the suite genuinely cannot be executed (no credentials, environment down), **stop and
  > raise it with the user** — do not bank unverified code as complete. Record Phase 1 as ⚠️
  > (see below), never ✅.

- [ ] Update `.architecture/authoring-status.md` — create/update the block. Use ✅ **only if the
      suite was actually executed**; otherwise ⚠️:

```markdown
## <testName> (<App>, <env>)
- Phase 1 (build):   ✅ <date> — TST_<MOD>_TC_1..<N> registered; executed: <P> passing / <F> failing on first run; visual candidates: <list, or "none — all dynamic data">
- Phase 2 (run/fix): ⬜ pending
- Phase 3 (visual):  ⬜ pending
```

```markdown
- Phase 1 (build):   ⚠️ <date> — built from documentation, NEVER EXECUTED.
                       Every selector / timeout / data value is UNVERIFIED. Blocker: <reason>
```

- [ ] Session walkthrough written/appended (AGENTS.md §Walkthrough).
- [ ] Tell the user: Phase 1 complete → next is Phase 2 (run & fix), recommended in a fresh session.

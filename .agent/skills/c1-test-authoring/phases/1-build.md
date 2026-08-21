# Phase 1 — Build (author the test, capture selectors)

**Goal:** all test artifacts exist and are internally consistent. No test execution in this phase
(beyond selector capture against the live page); running/fixing is Phase 2; visual assessment is
Phase 3.

**Inputs:** the feature/ticket (manual test cases if they exist — check
`test/Manual/` and the ticket), the target `<App>` and `<env>`, and the per-app product-knowledge
file (validation rules, error messages, known quirks — do not re-discover or contradict them).

## Steps

### Step 0 — Reconnaissance sweep

**One capture pass, before you write a single selector.**

The screen gets inspected once, deliberately, for the things that decide how every selector,
wait and assertion below must be written. Ten minutes here replaces multiple debug rounds in
Phase 2 — each item on this list caused at least one real failure in the admin programme.

- [ ] **Count the modals/dialogs already in the DOM** with nothing open. Anything pre-rendered
      means a presence check (`getElementCount > 0`) is a **guaranteed false green** and every
      check must use `isDisplayed`. *(4 permanent modals on grading categories, 4 on grading
      scales, **11** on class grade settings.)*
- [ ] **Identify the page-scoping anchor** — a component tag or unique container. Every view in
      a SPA can render an unclassed `<h1>`, so a bare `h1` silently matches the wrong page.
      **Verify the exact string; do not pluralise the page title** (guessed wrong twice).
- [ ] **List every positional id** on rows, menus, bands and modals. A positional id is not a
      stable selector (Invariant 2) — plan to look the index up by name, or match by prefix.
- [ ] **Read `maxlength` and any pattern on every input.** Undocumented caps break generated
      test data. *(A `maxlength="20"` nobody had recorded cost a full 6-failure run.)*
- [ ] **Find the buttons that are "disabled" by CSS class only**, with no native `disabled`
      attribute — a click on those **silently no-ops with no error**.
- [ ] **Note which containers persist in the DOM when closed** and which are genuinely removed.
      Both exist on the same app; assuming either way produces a check that cannot fail.
- [ ] **Check whether the list lazy-loads** — page size, and whether "load more" is removed or
      disabled when exhausted.
- [ ] **Measure the 2–3 transitions your TCs will wait on.** Never inherit or invent a number
      (Invariant 1). Record the measurement next to the timeout you set.
- [ ] **Capture pre-rendered dialog copy now, while it is free** — a modal that exists in the
      DOM before it is triggered can be read *without reaching the state that raises it*. This
      has already resolved three `[ASSUMED]` expected results at zero data cost, including two
      max-limit dialogs that would otherwise need a shared school filled to its cap.

> **Admin App (school-admin):** most of this is already answered — read
> `product-knowledge/ExperienceApp/admin-shared.md` **§B1** (the checklist) and **§B2–B9**
> (what has already been found) and sweep only for what is new to your screen.

Record what you find in the walkthrough, and promote anything durable into the per-app or
feature-area product-knowledge file — not just into the walkthrough (that is what made Phase 1's
knowledge unreachable).

### Step 0b — Applicable-traps list

**Write it down, then say where each one is handled.**

Reading the trap list is not the same as applying it. In the CGST session a trap recorded
**verbatim in that feature's own handoff** ("`search_class()` is not idempotent — clear before
every search") was read at session start and still shipped, costing a run and a misleading
failure message that blamed the product.

So before writing the page object, produce a short explicit table — in the walkthrough, and in
your reply to the user:

| Trap (from product knowledge) | Applies here? | Where it is handled |
|---|---|---|
| e.g. pre-rendered modals → presence is a false green | yes | every modal check uses `isDisplayed` |
| e.g. positional row ids | yes | `rowCheckbox` matches `name^='checkbox-'` |
| e.g. server-side search persistence | no | this screen has no search |

"Applies but not handled yet" is a legitimate row — it becomes a Phase 2 item. An **absent**
row is the failure mode: it means the trap was never considered. Phase 2's exit checklist
re-checks this table against the code that actually shipped.


### Steps 1-6 — Build the artifacts

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

- [ ] **Reconnaissance sweep done (step 0)** — findings recorded in the walkthrough, and anything
      durable promoted into product knowledge.
- [ ] **Applicable-traps table written (step 0b)**, with a "where it is handled" entry for every
      trap that applies. Carried into Phase 2 for re-checking.
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

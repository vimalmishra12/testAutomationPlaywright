# Architecture Invariants — Always-Loaded Core
> The rules that apply to (almost) every authoring task. **Read this first.**
> Then open the linked ADR / system.md section **only if your task touches it.**
> This sheet is the lean core + the index into the deep reference.
>
> **Authority:** `AGENTS.md` + `.architecture/{system,decisions}.md` remain the source of
> truth. If this sheet ever disagrees with them, they win and this sheet is corrected.

---

### 1. Layering is absolute
Test case → page-object methods only. Page object → all DOM via `baseActionLibrary`.
No `$` / `$$` / `page.locator` / raw selectors in tests; no assertions in page objects.
**Prefer deterministic waits over fixed sleeps:** wait on the real signal —
`waitForDisplayed` / `waitForExist` / `waitForEnabled` / `waitForClickable` /
`waitForDocumentLoad` — and fall back to `browser.pause(ms)` **only** when nothing
observable changes (debounce / animation / fixed third-party throttle).
  - ✅ `await action.waitForDisplayed(this.itemLink, 15000);`  // returns the moment it renders
  - ✅ `await action.waitForEnabled(this.okBtn, 5000);`        // gate on the button, not a guess
  - ❌ `await browser.pause(2000);`                            // blind wait — slow and flaky

**Two traps that make a wait lie to you:**
- **Element count ≠ visibility.** Modals/panels commonly stay in the DOM when closed
  (`display:none`), so `getElementCount(x) > 0` is *always* true and silently passes.
  Use `action.isDisplayed()` for anything that persists in the DOM.
- **`opacity: 0` is still VISIBLE to Playwright** — only `display:none` counts as hidden,
  so a "closed" wait must cover the whole fade-out, not the class change.

**Never invent a timeout — measure the transition once, then set it.** A guessed `1000`,
copy-pasted 13×, against a measured 3.6 s panel close caused 3 of the 4 original failures
in `adminClassesTab` [2026-08-15].
*Depth:* system.md "Layer Responsibilities" + "Dependency Rules"; ADR-003.

### 2. Selectors externalised + namespaced — and *stable*, not merely correct-today
Every selector lives in the app's selector JSON as `css.<App>.<page>.<element>`
(C1 → `css.ComproC1`, Builder → `css.Builder`). Never inline string literals; never at JSON root.

**A positional id is NOT a stable selector.** These apps re-issue index-keyed ids as rows are added,
removed or re-sorted, so an id that resolves today silently resolves to the *wrong element*
tomorrow. Look the index up by name on every use, or match structurally by prefix.
  - ❌ `#checkbox-1`  → ✅ `input[type=checkbox][name^='checkbox-']`  // ids shift with the row count
  - ❌ "the Lowest band is row 1" → ✅ address it as `count - 1`      // adding a middle band re-indexes
  - ❌ caching a row index by name → ✅ re-read it (an alphabetical list re-sorts on insert)

**Scope container-level selectors to their container.** A generic class match will find the same
markup elsewhere on the page. `createClasses.materialItem` was a page-wide `a.dropdown-item` and
matched up to **885 elements** including the header profile menu; the label dropdown is rendered
**once per row**, each with a full copy of every option, so an unscoped input matches one per row
and can receive text in a *hidden* row's box. Both cost multiple debug rounds [2026-08-18/20].
*Depth:* ADR-002; system.md "Selectors Module"; `product-knowledge/ExperienceApp/admin-shared.md` §B3.

### 3. Missing capability → add to the action library, never hack the page object
If `baseActionLibrary` lacks a method (`mouse.move`, an `evaluate` read, `nth()` by DOM order),
add a named, logged method there (protected-file protocol). Build non-static locators *inside*
that method, not in the page object. Examples of promoted capabilities: `switchToNewTab` /
`closeCurrentTabAndRefocus` (multi-tab handling, ADR-016).
*Depth:* ADR-003 (amended); ADR-016; system.md Layer 2 "Escape hatch".

### 4. Return contract: `true` / `Error`, checked with loose `==`
Action methods return `true` on success, the caught `Error` on failure. Page objects check
`if (true == res)` — NOT truthy (an `Error` is truthy), NOT `===`. Data getters
(`getCSSProperty`) return a rich object — read `.parsed.hex` / `.parsed.rgba`.
*Depth:* ADR-009 (+ 2026-06-13 clarification).

### 5. `isInitialized()` after every navigation — and it must wait for STATE, not just render
A navigation-triggering click calls the destination page's `isInitialized()` (waits for a
stable anchor element) before any further interaction. **Documented nuance:** the deeplink nav
methods defer `isInitialized()` to the following verification TC (still before any interaction) —
ADR-017B.

**An element rendering is not the same as its framework bindings having run.** `waitForDisplayed`
fires the moment the Save button appears, which is *not* the moment its `disabled` binding
evaluates — so a visibly pristine page briefly reported Save as ENABLED and failed the "a pristine
form cannot be saved" check [2026-08-20]. Where a page's readiness includes form/model state,
`isInitialized()` must bounded-poll for that state too.

**Keep that settle budget SHORT.** It is a render-vs-binding race, not a network wait; a generous
budget would *hide* a genuinely dirty-on-load page instead of failing on it. `classGradeSettings`
uses `FORM_SETTLE_TIMEOUT = 5000`, and the poll simply expiring is itself the signal.
*Depth:* system.md Layer 2; ADR-003 consequences; ADR-017B.

### 6. Playwright-as-a-library — NOT `@playwright/test`
`require('playwright')` under standalone Mocha. Never add `@playwright/test` as a runner
(it replaces Mocha and kills the JSON engine). Type credentials / validated fields with
`addValue` / `pressSequentially`, NOT `setValue` / `fill` (React/Angular forms ignore `fill`'s
value). Wait for each page transition when a selector (e.g. `button[type=submit]`) repeats across pages.

**Click the field before typing into a combobox / type-ahead.** These open their dropdown
off a focus/click event. A panel that persists in the DOM between TCs often leaves the field
*already focused*, so no fresh focus fires and the dropdown never opens no matter what is
typed — the first selection of a run succeeds and every later one fails. Setting `.value`
programmatically fires nothing at all.
*Depth:* ADR-012 (+ amendments); ADR-013 (React-form typing).

### 7. Register every TC (two-change rule)
Every `TST_<MOD>_TC_<N>` must be registered in `<App>TCRepository.json` or the runner throws.
Adding a test = test-file change **and** TC-repo entry.
*Depth:* ADR-007; ADR-001.

### 8. Protected files need explicit confirmation
`.mocharc.js`, `playwright.setup.js`, `run.js`, `env.conf.js`, `baseActionLibrary.js`,
`baseAssertionLibrary.js`, `testrunner.js`, `specGenerator.js`, `launchUrl.js`.
JSON (selectors / data / execution / TC repo) is NOT protected. **AGENTS.md holds the
authoritative list + the exact confirmation format.**
*Depth:* system.md "Protected Files"; AGENTS.md.

### 9. On failure: propose the fix, then wait
Never silently edit on a test failure. Propose the change, wait for explicit confirmation.
*Depth:* SKILL.md Golden Rule 6.

### 10. CommonJS only; appType- and env-keyed
`module.exports` / `require`, no `import` / `export`; lazy `require()` inside nav methods for
circular chains. Env-specific values live ONLY in `env.json`, `testcaseData/<env>/`,
`testExecutionFiles/<env>/`. Adding an app is additive scaffolding keyed by `--appType` —
no core changes.
*Depth:* ADR-004; ADR-006; ADR-013.

### 11. One walkthrough per session
End every session with a walkthrough under `.architecture/walkthroughs/`.
*Depth:* SKILL.md Golden Rule 7; AGENTS.md §Walkthrough.

### 12. New TC ⇒ visual assessment before any promotion
Every new TC is registered `visualTest: false`. Promotion to `true` requires the AGENTS.md §8
Rule A data assessment (static vs dynamic decision table) + explicit user confirmation — any
❌-row data type means it STAYS false, no asking. An exec file containing a visual TC needs BOTH
npm scripts: `<feature>Test_<env>` + `visualAcceptance_<feature>_<env>` (Rules B/C). A feature is
not closed until every TC has an explicit visual decision (skill Phase 3).
*Depth:* AGENTS.md §8; `.agent/skills/c1-test-authoring/phases/3-visual.md`.

### 13. Assertions must be able to fail; cleanup must never hide
An assertion that cannot fail is worse than no assertion — it reports green while testing
nothing. **Every state-changing call gets its result asserted.**
  - ❌ `await assertion.assert(rows.count >= 0, …)`   // true for every possible value
  - ❌ `await page.click_close();`                     // fire-and-forget: hid a broken close for weeks
  - ✅ assert the app's own signal (e.g. a "Clear" link that renders only while filtered)

**Never swallow a failure in cleanup.** A bare `try/catch` around a reset turns a loud bug
into silent state-bleed — log it at minimum, and verify the cleanup achieved its goal.
Both anti-patterns were live in `adminClassesTab` and each cost a full debugging cycle.

### 14. A test must never route around a product defect
When automation hits behaviour that would affect a real user, **stop and report it** —
capture the action, the observed result and the frequency, then ask whether it is accepted
behaviour or a bug to raise. Do not quietly retry until green: that hides a customer-facing
defect exactly as effectively as not asserting it.
- **Resilience belongs in setup/teardown, never in the assertion path.** Retrying inside a
  reset is housekeeping; retrying the thing under test destroys the test's purpose.
- If a workaround is authorised, mark it `// WORKAROUND — <ref>` so it is removable.
- **Missing test data is a question, not a decision.** Don't silently substitute (it changes
  coverage) and never create data on a shared environment unasked — report and let the user
  choose: create it, change the data, or change the test.
*Depth:* `.agent/skills/c1-test-authoring/phases/2-run-fix.md`; Invariant 9.

### 15. Pre-rendered UI is the NORM — presence never proves state
These apps ship dialogs, menus and panels into the DOM **before anything triggers them**, and
leave them there. Counted live: **4** permanent `.modal-content` on Manage grading categories,
**4** on Manage grading scales, **11** on Class grade settings — plus row menu items present for
every row (3 present / 0 visible), twin `<empty-class-state>` nodes, and a full copy of the label
dropdown per row. **So an existence check is not a state check.**
  - ❌ `getElementCount(modal) > 0`   // true forever — a guaranteed false green
  - ✅ `isDisplayed(modal)` / `waitForDisplayed(modal, ms)` / `waitForDisplayed(sel, ms, true)` to close
  - ✅ scope every modal selector with `:has(...)` to the ONE dialog you mean

Invariant 1 covers this as a *wait* trap; this one is about **assertions** — an assertion that
cannot fail is Invariant 13's problem, and pre-rendered UI is the most common way to write one by
accident. It has now been hit at least three times on three different screens.

> **Corollary — pre-rendered copy is FREE to capture.** A dialog that exists before it is triggered
> can be read *without reaching the state that raises it*. That resolved three `[ASSUMED]` expected
> results at zero data cost, including two max-limit dialogs that would otherwise have needed a
> shared school filled to its cap. **Try this before writing `[ASSUMED]`.**

**Know the exceptions — do not "align" them by symmetry.** Some elements *are* genuinely removed,
and there presence is truthful: the success banner (`.message-banner-panel-wrapper`), the user-guide
panel, and the DEFAULT grading scale's menu, which genuinely omits Set-as-default and Delete — so a
count of 0 is a correct assertion there and a false green one page over. Verify per element.
*Depth:* `product-knowledge/ExperienceApp/admin-shared.md` §B2; Invariants 1 and 13.

---

**How to use this sheet (the instruction the skill should adopt):**
1. Always load AGENTS.md + this cheat-sheet.
2. For the task at hand, identify which invariants apply.
3. Open the specific ADR / system.md section named under *Depth* **only** for those — do not
   load all of `decisions.md` / `system.md` up front.

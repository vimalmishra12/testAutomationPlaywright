# Phase 2 — Run & Fix (make the suite pass deterministically)

**Goal:** the execution file runs green, twice in a row, from real output. Entry condition: Phase 1
complete (check `.architecture/authoring-status.md`; verify the artifacts actually exist).

## Steps

1. **NPM script** (package.json — PROTECTED, present the confirmation format and wait):
   `"<feature>Test_<env>": "node core/runner/run.js --appType=<App> --testEnv=<env> --testExecFile=<name>.json --browserCapability=desktop-chrome-1920"`
   (Do NOT add a `visualAcceptance_*` script in this phase — that is Phase 3, and only if
   candidates are promoted.)
2. **Run:** `npm run <feature>Test_<env>` — or directly:
   `node core/runner/run.js --appType=<App> --testEnv=<env> --testExecFile=<name>.json --browserCapability=desktop-chrome-1920 --headless=true`
3. **Verify from the real output** — never claim a pass without showing it. Default report:
   mochawesome HTML at `output/reports/TestReports/mochawesome/report.html` (inline screenshots);
   `--report=spec` for console-only. Debug aids: `--trace=true` → `traces/<Suite>.zip` (open at
   https://trace.playwright.dev); `--headless=false` to watch locally.
4. **On any failure: propose the fix and WAIT for confirmation** (golden rule 6 — no silent edits).
   Classify first:
   - **Selector not found** → wrong/changed selector → fix in the app's selector JSON.
   - **Assertion mismatch** → wrong expected value → fix the env's data file. Check the per-app
     product-knowledge file first — the "wrong" value may be documented product behaviour.
   - **Timeout** → prefer a *condition* wait on the real signal (`waitForDisplayed` etc., longer
     timeout) over `browser.pause` (Invariant 1). Slow/sync-heavy apps (Builder, LTI dashboard)
     need poll/retry waits.
   - **Environment/product issue** (Cloudflare headers, SameSite cookies, product bug) → consult
     the relevant ADR (014/015) and product knowledge; a product bug is reported, not "fixed" in
     the test.
5. **Prove determinism:** after fixes, re-run until you get **2 consecutive clean runs**. A pass
   after a flaky-looking fix must be re-proven, not assumed.
6. **Cloud (only if asked):** `--browserCapability=lambdatest-chrome-1920` (LambdaTest Playwright
   grid; creds via `LT_USERNAME`/`LT_ACCESS_KEY`).

## Debugging protocol (learned the hard way — `adminClassesTab`, 2026-08-15)

**Instrument before you hypothesise.** Three guesses cost four runs; one diagnostic dump
answered it in a single run. When a TC fails for a non-obvious reason, temporarily log
everything the failing step can see — input value, element counts, computed visibility, the
exact selector — run once, read it, then remove it. Do not theorise from the error alone.

**If it works by hand but fails in automation, diff the action sequences.** A successful
manual repro is itself the clue: your hand is doing something the code is not. Here the hand
was clicking the search field before typing, which opened the dropdown; the automation only
typed. Three wrong theories came from reading "works manually" as "the app behaves
differently under automation."

**Suspect shared state before blaming the test.** If failures move around when you change
something unrelated, the TCs are not independent. State persisted **server-side** survives
the browser entirely — reset in `BeforeEach`, not just `AfterEach`, and verify it landed.
A crashed run can otherwise poison the next run days later on a different machine.

**Verify test data against the live app before using it.** Ask "does this value exist, in
this combination?" `Active` + `VM1` was impossible — the label existed but no *active* class
carried it — and no amount of code fixing could make that TC pass.

**A green suite is not automatically a correct suite.** Before closing the phase, re-read
each assertion and ask: *what input would make this fail?* If there isn't one, it is not a
test. See Invariants 13 and 14.

## Exit checklist (mandatory — completes the phase)

- [ ] All TCs passing; real output shown to the user; 2 consecutive clean runs.
- [ ] Every assertion is falsifiable (Invariant 13) — no `>= 0`, no unasserted state changes.
- [ ] Any product defect found was **reported to the user, not worked around** (Invariant 14);
      any authorised workaround is marked `// WORKAROUND — <ref>`.
- [ ] Any missing/invalid test data was raised with the user rather than silently substituted.
- [ ] All applied fixes were proposed and confirmed first; inline comments added per AGENTS.md.
- [ ] Update `.architecture/authoring-status.md` — mark the block:

```markdown
- Phase 2 (run/fix): ✅ <date> — all <N> passing, 2 consecutive clean runs
- Phase 3 (visual):  ⬜ pending
```

- [ ] Session walkthrough written/appended.
- [ ] Tell the user: Phase 2 complete → **Phase 3 (visual assessment) is still pending and
      mandatory** — the feature is not done, even though the suite is green. Recommend a fresh
      session for it.

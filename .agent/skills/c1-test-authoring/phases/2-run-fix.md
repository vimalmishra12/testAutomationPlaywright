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

## Exit checklist (mandatory — completes the phase)

- [ ] All TCs passing; real output shown to the user; 2 consecutive clean runs.
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

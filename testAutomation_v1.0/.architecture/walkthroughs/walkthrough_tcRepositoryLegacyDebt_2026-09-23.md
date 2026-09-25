# Walkthrough — TC Repository Legacy Debt Cleanup — 2026-09-23

## Ask
User: "459 registered test cases with no code, and a few duplicate registrations" — fix it, one PR.

## Method
Built `tooling`-style audit scripts (scratchpad, not committed) that cross-check every TC id
registered in the four `testcaseRepository/**/*.json` files against:
1. **CODED** — a handler `TST_X: async function` exists anywhere in `test/**/*.test.js`.
2. **WIRED** — the id sits in a real step slot (`Before`/`BeforeEach`/`Test`/`AfterEach`/`After`)
   of a `testExecutionFiles/**/*.json` suite (same method as `tooling/automationAudit.js`).

Only removed an entry when it was **neither** coded nor wired. Real number: **423 orphaned + 10
duplicate = 433** (not exactly 459 — no prior tool/report existed for that figure; this audit is
now the source of truth).

## Two near-misses caught before anything was committed
1. **Coded-handler regex was too narrow.** The first pass required a literal `_TC_` in the id and
   a single `[A-Z0-9]+` module-code segment. That silently missed real, existing handlers named
   `TST_NEMO24401_CLEANUP` / `_RESET` (no `_TC_`) and `TST_LTI_IP2_TC_1` (module code `LTI_IP2`
   contains its own underscore). Removing them broke `BuilderCloneComponentTest_thor` immediately
   (`Cannot find TST_NEMO24401_CLEANUP ... in the test case repository`) — caught by actually
   running the suite, not by the audit alone. Fixed the regex to `TST_[A-Za-z0-9_]+\s*:\s*(?:async\s+)?function`
   and re-derived every number from scratch.
2. **"Delete Class" vs "Active Class" duplicate — picked the wrong one to remove, at first.** Both
   modules register the same testFile (`activeClass.test.js`) and the same 5 ids
   (`TST_ACTI_TC_1..5`). `core/runner/testrunner.js`'s `getTCPropertiesFromTCRepo()` matches the
   **first** module (by array position) whose `testFile` equals the one being run, then `break`s —
   it never checks a second module with the same testFile. "Delete Class" sits at a lower array
   index than "Active Class", so "Delete Class" is what actually runs today; "Active Class" is
   dead, unreachable code, confirmed by: `TST_ACTI_TC_1-3` wired into 11 real exec files across
   thor/qa/rel/production, and the live npm scripts are literally named `deleteClassTest_*` (not
   `activeClassTest_*`). Removing "Delete Class" (the original plan) would have broken all 11 exec
   files; removing "Active Class" instead is a zero-behavior-change fix. A repo-wide scan confirmed
   this is the *only* such same-testFile module pair in any of the four repositories.

## What was actually removed
- **423 orphaned entries** (neither coded nor wired) across all 4 repositories — includes two
  entirely dead modules pointing to test files that don't exist in the repo at all
  (`browse.test.js`, `libraryEditor.test.js`) and 22 modules total left with 0 remaining test
  cases (kept as empty shells — module *deletion* wasn't asked for, only orphaned TC entries).
- **10 duplicate registrations**, case-by-case (not a blanket "same id in 2 places = bug" rule —
  `TST_BLOGI_TC_1/2` legitimately repeats across 6 Builder suites as a shared login step, and was
  left alone):
  - `TST_APPS_TC_1/2` registered under "Login" (both read "Click Sign Up button", identical to
    the adjacent `TST_LOGI_TC_6` — a copy-paste artifact) vs the real, coded "appShell" module
    ("Click on prod drop down" / "Click Log out button" — verified against passing test output).
  - "Active Class" module removed entirely (see above).
  - `TST_C1AS_TC_14`, `TST_GLOB_TC_37`, `TST_ICCE_TC_75` — exact same-module duplicate entries;
    the latter two had zero coded/wired usage at all once deduped, so both copies are gone (not a
    bug — genuinely dead weight, not merely duplicated).

## Verification
- `node tooling/secretScan.js`-style custom audit: 0 orphaned, 0 wired-but-uncoded, after the fix.
- All 4 repository JSON files re-validated (`JSON.parse` succeeds, `modules` stays a real array —
  a `delete arr[i]` mistake earlier in this session would have left a `null` hole; caught before
  writing, switched to `.filter()`/reassignment throughout).
- Real test runs: `loginFeatureTest_thor` (8/8), `deleteClassTest_thor` (2/2, confirms the
  Active/Delete Class fix), `BuilderCloneComponentTest_thor` (in progress at session end — interim
  output already shows `TST_NEMO24401_CLEANUP`/`_RESET` being found and invoked correctly, which
  was the exact thing that broke on the first attempt).

## Scope not touched
Writing missing test code (423 real cases with no implementation, by design — user chose "remove
from repository", not "write the code"); the 22 now-empty module shells (left in place, not
deleted — a possible separate follow-up); "Browse"/"Library" pointing at nonexistent test files
overall (same — flagged, not acted on further).

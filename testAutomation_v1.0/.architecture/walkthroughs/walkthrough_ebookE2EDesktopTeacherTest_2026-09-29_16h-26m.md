# Walkthrough — ebookE2EDesktopTeacherTest (Thor Desktop)

## Session 1 — 2026-09-29

## Summary
Began automating the Thor Desktop (Electron) end-to-end teacher FOC journey as ONE continuous
session — log in once, never log out, close & reopen the app and verify the session is retained,
then run the FOC suites per their own class. This session lands the genuinely-new, self-contained
piece (close/reopen/session-retention) plus the first FOC suite (S1, class 1RB), reusing the
existing login POC and FOC page objects untouched.

## Changes Made

### 1. pages/ExperienceApp/electronSession.page.js
- **Type:** Created
- **Layer:** Page Object (desktop app lifecycle)
- **What changed:** New page object with `closeApp()`, `relaunchAndReattach()` and
  `verifySessionRetained()`. It quits the run-owned Electron process (by spawned PID, then by image
  name — same as core's teardown), waits for the debug port to free, relaunches the installed exe
  (resolved from `env.json → ExperienceApp.electronAppPath`, identical to `playwright.setup.js`
  beforeAll), re-polls CDP and re-attaches via `chromium.connectOverCDP`. It repoints
  `global.__pwContext` / `global.page` / `$` / `$$` to the new process but deliberately KEEPS the
  original `global.browser` handle so the WDIO-compat helpers (`browser.pause`, `browser.waitUntil`)
  that every reused FOC page object depends on stay intact. `verifySessionRetained()` is UI-only:
  it asserts an authenticated surface (`.welcome` / header profile / dashboard route) is shown and
  the "Log in with web browser" button is NOT (tolerating a transient launch-page splash).
- **Why:** There was no capability to close+reopen the desktop app mid-suite — the framework spawns
  the app once in beforeAll and only kills it in afterAll. This is the real "session retained"
  user journey. Kept out of the protected core (`playwright.setup.js`) and out of the login POC.
- **Lines affected:** whole file.

### 2. test/ExperienceApp/electronSession.test.js
- **Type:** Created
- **Layer:** Test Case
- **What changed:** `PROTO_SESSION_RETAINED` — calls the three page-object methods and asserts each
  with `assertion.assertEqual`. No DOM, no `baseActionLibrary`.
- **Why:** Registerable test step that performs the close/reopen/verify in the shared Electron session.
- **Lines affected:** whole file.

### 3. testResources/testcaseRepository/ExperienceApp/C1TCRepository.json
- **Type:** Modified
- **Layer:** Test Resources (config)
- **What changed:** Added module "Electron Session" (testFile `electronSession.test.js`) with TC
  `PROTO_SESSION_RETAINED`, `visualTest:false`.
- **Why:** Invariant 7 — every TC must be registered or the runner throws. Functional
  session/identity test ⇒ not a visual candidate (PLAN §7).

### 4. testResources/testExecutionFiles/ExperienceApp/thor/ebookE2EDesktopTeacherTest.json
- **Type:** Created
- **Layer:** Test Resources (execution)
- **What changed:** New desktop exec file. `Suite1_LoginAndSession` = `PROTO_ELEC_LOGIN` (teacher)
  → `PROTO_CLOSE_WALKTHROUGH` → `PROTO_SESSION_RETAINED`, no logout. `Suite_S1_1RB_eBook` reuses the
  web suite's verified TCs (`TST_DASH_TC_11`, `TST_CMAT_TC_1/2/3`, `TST_EBOO_TC_1/2/6/24/25/5`) on
  class `CQA_AUTO_TEST_DND_1RB`.
- **Why:** Single continuous desktop session; suites after the first keep the same Electron app
  because `createFreshContext` (Electron branch) only rebinds the window, it does not reset state.

### 5. package.json
- **Type:** Modified (PROTECTED — user-confirmed this exact script)
- **Layer:** Configuration
- **What changed:** Added `"ebookE2EDesktopTeacherTest_thor": "... --testExecFile=ebookE2EDesktopTeacherTest.json --electronApp=true"`.
- **Why:** New execution file needs its npm entry.

## Reused untouched (by design)
- `pages/ExperienceApp/electronLogin.page.js`, `electronDashboard.page.js`, `electronLoginPrototype.test.js`,
  `electronLoginTest.json` — the login POC is called, not edited (user instruction).
- FOC page objects `classMaterials.page.js`, `eBook.page.js`, `dashboard.page.js` and their selectors;
  `classMaterialsData.json`, `assignmentLoginData.json` (`C1.login.user.validTeacher`).

## Architecture Decisions Triggered
- New "close & reopen the desktop app mid-suite" capability implemented as a page object that
  re-attaches over CDP without replacing `global.browser` (compat-preserving). This partially
  satisfies migration PLAN Phase 2/3 without editing `core/runner/playwright.setup.js`.
  ⚠️ Consider an ADR if this desktop-lifecycle pattern is kept (the PLAN's intended home is a
  protected `--desktopRuntime` core mode).

## Protected Files Touched
- `package.json` — one npm script added, explicitly confirmed by the user (confirmation format shown
  and approved in the conversation).
- No other protected file modified (`playwright.setup.js`, `baseActionLibrary.js`, the login POC all untouched).

## Verification done
- `node --check` on both new JS files — clean.
- `require()` on the three JSON files — parse OK; TC repo now has 90 modules incl. "Electron Session".
- Cross-check: every TC id referenced by the new exec file exists in `C1TCRepository.json` (0 missing).
- NOT run live: the desktop E2E needs the dedicated automation Windows account with the
  `C1_THOR_*` password env vars set (not present in the authoring shell), plus a real Chrome
  default-browser + protocol-dialog handshake. A green run on the thor desktop machine is still required.

## Pending / Follow-up
- **Suites S2 / S5 / S7 not added yet.** After the reader Home, `eBook.page.js:260-295` lands on
  **Class Materials**, not the dashboard, and there is no verified control in the repo to return
  from a class page to the dashboard to open a DIFFERENT class. Need the user to confirm the desktop
  "back to dashboard" action (and whether the dashboard needs a class dropdown opened to reveal a
  class by name) before those suites can be wired without inventing selectors.
- Verify live: (a) that a retained reopen actually lands on the dashboard so `TST_DASH_TC_11` can
  click the class card; (b) that the reader/Class-Materials DOM inside Electron matches the web
  selectors being reused; (c) timeouts for the slower Electron renderer.

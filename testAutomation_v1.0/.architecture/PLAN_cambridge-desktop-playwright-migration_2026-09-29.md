# Plan - Cambridge Desktop Black-Box Playwright Migration

**Date:** 2026-09-29  
**Status:** Approved architecture; pure Node.js / Playwright implementation (no .NET SDK or C# dependency required)  
**Scope:** Migrate the Cambridge Desktop QA login journey from the legacy WDIO prototype to a Playwright and Node.js solution.

## 1. Objective

Automate the same journey that a QA user performs:

1. Launch Cambridge Desktop normally.
2. Click its real Login button.
3. Complete the real authentication flow in the system-default Chrome browser.
4. Return through the application's normal browser-to-desktop mechanism.
5. Verify the intended user is visibly signed in to the desktop application.
6. Execute the required post-login smoke flow.
7. Log out through the desktop UI and verify the Login state returns.

The application is treated as a black box. The automation must not inspect, modify, bypass, reproduce, or infer internal authentication state.

## 2. Approved Decisions

| Concern | Decision |
|---|---|
| Desktop technology | Packaged Electron application |
| Default browser | Chrome, opened through normal Windows default-browser handling |
| Execution host | Dedicated Windows automation account on the same machine; never a personal user profile |
| Desktop app automation | Pure Node.js & Playwright (via `chromium.connectOverCDP` or `_electron.launch`) — no C#/.NET SDK required |
| Browser automation | Playwright as a library, attached to a test-owned Chrome CDP endpoint |
| Protocol / deep-link handoff | Windows OS handler via `rundll32 url.dll,FileProtocolHandler` / Chrome protocol handling |
| Chrome profile | Disposable and isolated per test run; no personal profile, cookies, extensions, or sessions |
| Test style | Serial, headed, unlocked interactive desktop journey |
| Authentication | Real visible UI only; test account credentials resolved from environment variables |

The dedicated automation account may use a test-only Chrome launch/profile configuration, but Cambridge Desktop must still open Chrome through its normal Windows default-browser behavior.

## 3. Legacy WDIO Behaviour

The existing prototype launches the installed desktop executable visibly, exposes its renderer through a remote debugging port, and attaches WDIO/ChromeDriver.

Relevant source:

- `QATestAutomation/testAutomation_v1.0/wdio.conf.js:39-49, 163-220, 273-310`
- `QATestAutomation/testAutomation_v1.0/pages/ExperienceApp/electronLogin.page.js:133-452`
- `QATestAutomation/testAutomation_v1.0/testResources/testExecutionFiles/ExperienceApp/thor/electronLoginTest.json`

It performs some real UI actions: desktop Login click, browser credential entry, browser deep-link click, desktop welcome check, and desktop logout.

It is not an acceptable black-box migration template because it also:

1. Searches `chrome.exe` command lines for a transient login value.
2. Extracts that value and constructs a replacement login URL.
3. Force-kills all Chrome processes.
4. Starts a replacement ChromeDriver/browser session.
5. Uses positional keyboard input to accept a protocol dialog.
6. Selects the last window handle instead of identifying the desktop window semantically.
7. Treats generic `.welcome` visibility as the only signed-in assertion.

The Playwright migration must retain only the user-visible actions and replace every workaround above using native Playwright mechanisms.

## 4. Target Architecture

```text
Mocha JSON execution
  |
  +-- Playwright Desktop / Electron Adapter (Node.js)
  |     - spawn/connect to installed desktop app via Playwright CDP (chromium.connectOverCDP) or _electron.launch
  |     - invoke desktop Login and Logout controls via standard Playwright page locators
  |     - assert signed-in and logged-out desktop UI states via renderer DOM
  |
  +-- Playwright Browser Adapter (Chrome)
        - attach to test-owned Chrome through CDP
        - automate visible identity-provider / browser authentication pages
        - complete protocol handoff back to desktop via standard deep-link trigger (rundll32 url.dll,FileProtocolHandler)
        - collect Playwright traces and browser screenshots
```

### Boundaries

- Playwright owns both the desktop Electron window/renderer and the system browser HTML content.
- The test never reads authorization codes, callback parameters, cookies, tokens, local storage, session storage, Electron main-process data, or process command lines.
- The test never kills arbitrary user browser processes.
- The test only closes processes and browser profiles it created.
- 100% pure Node.js and Playwright stack — no secondary runtimes, no C# projects, and no .NET SDK required.

## 5. POC First

The first implementation is a narrow desktop-login proof of concept. No legacy post-login feature is migrated until it passes.

### POC Flow

1. Start in the dedicated Windows automation account with a clean, isolated Chrome profile.
2. Start test-owned Chrome with a loopback CDP endpoint.
3. Verify the account's Windows default browser remains Chrome.
4. Launch Cambridge Desktop through its installed executable with remote debugging enabled (or via `_electron.launch`).
5. Connect Playwright to the desktop app and click the visible Login button.
6. Confirm the desktop browser launch reaches the Chrome session Playwright can attach to.
7. Use Playwright to complete the visible authentication UI in Chrome.
8. Trigger or allow the external-protocol return (`cambridgeone-app://...`) using Chrome protocol configuration or OS file protocol handler.
9. Switch back to the desktop application context and wait for its visible authenticated state.
10. Assert a user-specific visible signal: identity or role plus authenticated dashboard/navigation capability.
11. Run a minimal post-login smoke action.
12. Log out through the desktop UI and assert the Login state is visible again.

### POC Acceptance Criteria

The POC is successful only when all conditions hold:

- Cambridge Desktop opens Chrome through the normal Windows default-browser route.
- Playwright attaches to the exact test-owned Chrome session that receives the authorization page.
- Authentication uses real visible browser UI only.
- The normal return mechanism reaches the desktop application.
- The desktop application shows account-specific authenticated UI.
- Desktop logout restores the unauthenticated Login state.
- No prohibited internal/authentication data is inspected.

### Chrome CDP Gate

Chrome 136 and later do not permit remote debugging against the normal Chrome profile without an isolated user-data directory. The POC must prove that a test-only Chrome profile and CDP endpoint can receive the URL launched by Cambridge Desktop.

## 6. Implementation Phases

### Phase 1 - Desktop Electron CDP Adapter & Protocol Handler (Node.js)

Add a pure Node.js desktop adapter in the runtime area of this repository:

It will expose a clean interface for:

- launching the installed desktop process with `--remote-debugging-port` and attaching via `chromium.connectOverCDP()`, or using `_electron.launch({ executablePath })`;
- managing desktop window/page instances;
- clicking accessible Login and Logout controls using standard Playwright selectors;
- waiting for authenticated and logged-out desktop UI states;
- handling protocol redirection back to the app without requiring native OS scraping;
- collecting desktop renderer screenshots and Playwright traces.

### Phase 2 - Node Native and Chrome Clients

Add generic runtime clients that:

- coordinate between the desktop window context and the system Chrome browser session;
- launch/attach the dedicated Chrome test session through `chromium.connectOverCDP()`;
- publish the active page for the existing browser action layer;
- collect trace/screenshot artifacts across both contexts;
- clean up only run-owned processes and profiles.

### Phase 3 - Framework Desktop Runtime

Add an explicit `--desktopRuntime=true` lifecycle mode. It coordinates the desktop Electron session and the browser session cleanly.

This is a shared-infrastructure change. It requires protected-file confirmation before editing `core/runner/playwright.setup.js`.

### Phase 4 - CambridgeDesktop App Type

Add application-owned files:

```text
pages/CambridgeDesktop/
  desktopLogin.page.js
  browserAuthentication.page.js
  desktopDashboard.page.js

test/CambridgeDesktop/
  desktopLogin.test.js
  desktopPostLogin.test.js

testResources/selectors/CambridgeDesktop/
  CambridgeDesktopSelectors.json

testResources/testcaseData/CambridgeDesktop/<environment>/
  desktopLoginData.json

testResources/testExecutionFiles/CambridgeDesktop/<environment>/
  desktopLoginE2E.json

testResources/testcaseRepository/CambridgeDesktop/
  CambridgeDesktopTCRepository.json
```

The initial execution file uses one desktop journey per suite because the desktop, browser, and protocol callback are stateful across processes.

### Phase 5 - Port Post-Login Coverage

Port legacy Electron flows only after the login POC is green. Interacting with the application window uses standard Playwright page locators within the Electron renderer.

## 7. Initial Test Cases

1. Desktop launches to an unauthenticated state.
2. Desktop Login opens the real Chrome authorization journey.
3. A valid QA user completes browser authentication using visible UI.
4. The browser's normal return completes in the desktop application.
5. Account identity/role and authenticated desktop capability are visible.
6. The required post-login smoke journey works.
7. Desktop logout restores the Login state.

These are functional authentication tests, not visual-regression candidates. They contain dynamic identity/session data and begin with `visualTest: false`.

## 8. Reliability and Evidence Rules

- Run serially in an unlocked, interactive Windows session.
- Use deterministic Playwright state waits, not fixed sleeps.
- Do not retry the Login action or the assertion under test; retries can hide a user-facing failure.
- Capture Playwright trace and screenshots for both browser and desktop actions.
- Preserve evidence before cleanup.
- Credentials use `{{env.*}}` tokens and must never be written into source, logs, reports, or diagnostics.
- Store any browser state only for web-only downstream tests. Never use it to claim coverage of desktop authentication.

## 9. Required Protected Changes

No protected file is modified by this planning document. Before implementation, confirmation is required for:

| File | Planned change |
|---|---|
| `core/runner/playwright.setup.js` | Add the explicit desktop runtime and test-owned Chrome lifecycle. |
| `package.json` | Add the Cambridge Desktop POC execution script. |
| `core/actionLibrary/baseActionLibrary.js` | Only if the POC proves a generic browser-page handoff capability cannot be expressed without a shared action. |
| `core/runner/testrunner.js` | Only if suite/context rotation needs a desktop-specific lifecycle hook after the POC. |

## 10. Prerequisites and Blockers

1. The dedicated Windows automation account must exist and be used exclusively for this automation.
2. Chrome must be the account's configured Windows default browser.
3. The account must permit test-owned Chrome profile/CDP configuration.
4. The installed Cambridge Desktop executable path and QA test account must be supplied as environment-specific configuration.
5. **Pure Node.js & Playwright stack**: No .NET SDK or external compilers required.
6. The POC must identify stable, user-facing selectors for desktop Login, authenticated state, Logout, and the protocol handoff.

## 11. Research Basis

- Playwright Electron support: https://playwright.dev/docs/api/class-electron
- Playwright CDP attachment: https://playwright.dev/docs/api/class-browsertype#browser-type-connect-over-cdp
- Chrome remote debugging guidelines: https://developer.chrome.com/blog/remote-debugging-port
- Native app OAuth best practices: https://www.rfc-editor.org/rfc/rfc8252

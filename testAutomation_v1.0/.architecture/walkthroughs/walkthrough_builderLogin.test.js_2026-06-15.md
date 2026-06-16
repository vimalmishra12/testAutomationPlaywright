# Walkthrough — Builder app (second appType) Phase 1: login smoke (2026-06-15)

First proof that the framework supports **multiple applications** (ADR-013). Added **Builder**
(comproDLS Builder) alongside ExperienceApp, with a login → dashboard smoke. **Zero core-framework
changes** — pure additive scaffolding + one `env.json` block.

## What was added
- `env.json` → `Builder` appType block (thor → `asgard-thor-builder.comprodls.com/2024/pre-login`).
- `testResources/selectors/Builder/BuilderSelectors.json` — `css.Builder` namespace
  (`preLogin`, `loginConfirm`, `idpLogin`, `landing`).
- `pages/Builder/login.page.js` — drives the 3-step cross-domain SSO; `landing.page.js` — asserts
  the `/2024/dashboard` landing (URL settles off the auth routes + `header.sticky` visible).
- `test/Builder/login.test.js` — `TST_BLOGI_TC_1` (pre-login loads), `TST_BLOGI_TC_2` (full login).
- `testResources/testcaseData/Builder/thor/builderLoginData.json` (plaintext creds, C1 convention),
  `testcaseRepository/Builder/BuilderTCRepository.json` (selectorFile → BuilderSelectors.json),
  `testExecutionFiles/Builder/thor/builderLoginTest.json`.
- `package.json` → `BuilderLoginTest_thor`.

## The login flow (mapped live)
`/2024/pre-login` (select org **Cambridge One** `#selectedOrg` → Login) → `/2024/login` (Login) →
`asgard-thor-assets…/builder-identity` (`#login-user`, `#login-pass`, `#login-mfa-btn`) →
`/2024/redirect` ("Logging you in…") → `/2024/dashboard`.

## Two real-app gotchas (reusable lessons → ADR-013)
1. **IdP form ignores `fill()`** — React/Angular form; setting the value without keystroke events
   left the form "empty" and it bounced back to Sign In despite correct creds. Fix: `clearValue` +
   `addValue` (pressSequentially). Same class as notes / schoolName.
2. **Repeated `button[type=submit]`** — present on both pre-login and confirm pages; clicking without
   waiting for navigation re-clicked the previous page's button and desynced the flow. Fix: wait for
   each page transition (`browser.waitUntil` on the URL) before acting.

## Verification
`BuilderLoginTest_thor` → **2/2 passing, deterministic** across runs (~24s). TC_1 passing alone
already proved the whole new-appType plumbing resolves end-to-end.

## Pending / follow-up
- Phase 2: first real Builder feature (page objects + `css.Builder.<feature>` selectors + TC entries
  + test, reusing this login as the `Before` chain).
- Secure Builder creds (env var / gitignored file) — currently plaintext per the "like C1 for now".
- LambdaTest / visual / mochawesome are appType-agnostic → work for Builder with no extra wiring.

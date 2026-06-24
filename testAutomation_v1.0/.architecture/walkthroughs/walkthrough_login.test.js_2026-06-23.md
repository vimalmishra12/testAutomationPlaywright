# Walkthrough — Login feature (ExperienceApp / QA) (2026-06-23)

Feature: `loginFeatureTest_qa` (`loginTest.json` — Suite1 login page, Suite2 sign-up launch,
Suite3 forgot password). Single living file for this feature; append per session.

## Session Log

### 2026-06-23 — Fix: login box not painting on QA (CF Access header regression)

**Symptom.** `loginFeatureTest_qa` → `0 passing, 3 failing`. All three suites died in the shared
`Before` hook `TST_LAND_TC_3` (landing → click login → `login.isInitialized()`), timing out 30s on
`#gigya-loginID-56269462240752180`. The Gigya login form never rendered ("login box not painting").

**Diagnosis (via live QA DOM probe).** The Gigya screen-set container existed but was empty
(`htmlLen: 0`). Console showed:
- `cdns.eu1.gigya.com/sdk.config.get` blocked by CORS — *"Request header field cf-access-client-secret
  is not allowed by Access-Control-Allow-Headers in preflight response"*
- `PAGEERROR: Cannot read properties of undefined (reading 'Domain')` (Gigya init failure)

Root cause: `core/runner/playwright.setup.js` applied the Cloudflare Access headers
(`CF-Access-Client-Id` / `CF-Access-Client-Secret`) as context-level **`extraHTTPHeaders`**, which
Playwright attaches to **every** request — including cross-origin calls Gigya/OneTrust/New Relic make.
Those third parties reject the custom `cf-access-*` headers in CORS preflight, so the Gigya screen-set
fails to initialise and the login inputs never paint.

Proven by scoping the headers to first-party requests only in a throwaway probe → screen-set painted
fully (`htmlLen: 235317`) and the **original** selectors resolved. (Interim selector guess
`input[name="loginID"]` was wrong — the field's `name` is `username`; original IDs were correct and
were reverted.)

**Why it ran earlier — regression.** Under WebDriverIO, CF headers were injected via a CDP
request-interception helper (`setupCDPHeaders`, env.conf.js, commit `bba7869`) that **scoped them to
the first-party host** (`request.url.includes(new URL(global.appUrl).hostname)`), leaving third-party
requests untouched → Gigya worked. The Playwright migration (commit `152dbce`, 2026-06-12) replaced
that scoped CDP interception with global `extraHTTPHeaders` and **dropped the host filter** — that lost
scoping is the regression.

## Changes Made

### 1. core/runner/playwright.setup.js
- **Type:** Modified — **PROTECTED FILE** (changed with explicit user confirmation)
- **Layer:** Core
- **What changed:** Replaced context-level `extraHTTPHeaders = global.headers` with a
  `__pwContext.route('**/*', …)` handler that injects the CF Access headers **only for first-party
  requests** (request host === `appUrl` host or a subdomain of it); third-party requests pass through
  untouched. Dated comment added explaining the CORS/Gigya rationale.
- **Why:** Global headers broke the Gigya login widget's cross-origin preflights; restores the
  first-party scoping the WDIO version had.
- **Lines affected:** context-creation block (~lines 181–211).

### 2. testResources/selectors/ExperienceApp/C1Selectors.json
- **Type:** Modified then reverted (net: no change)
- **Note:** Interim edit changed `login.userName_tbox` / `password_tbox` to `name`-based selectors
  while diagnosing; reverted once the header (not the selector) was confirmed as the cause. Original
  Gigya-ID selectors are correct.

## Architecture Decisions Triggered
> ⚠️ Reusable lesson: when an app sits behind Cloudflare Access, inject CF-Access-* headers **only for
> the first-party origin** — never as global `extraHTTPHeaders`, which poisons third-party CORS
> preflights (Gigya/OneTrust/New Relic). Consider capturing as an ADR.

## Protected Files Touched
- `core/runner/playwright.setup.js` — confirmed by user before change.

## Verification
- Single-suite debug run (Suite1 only): `TST_IDEN_TC_2` passes in ~9s (was a 30s timeout).
- Full `loginFeatureTest_qa` (all 3 suites): **8 passing, 0 failing** (~33s).
- Temporary debug artifacts (`debug_probe.js`, `debug_login.png`, `loginTest_debug.json`) removed.

## Pending / Follow-up
- Consider an ADR for the first-party-only CF header rule.
- Same fix benefits any other CF-Access-gated env (rel) using a Gigya/third-party widget.

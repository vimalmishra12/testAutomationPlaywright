# Walkthrough — bulkClassEmailVerification.test.js

## Session 1 — 2026-09-21

## Summary
Transitioned Mailsac email verification from REST API calls to full browser **UI Automation** using the captured live DOM selectors and credentials for `comproqatest21@gmail.com` / `Compro11`. Built all Phase 1 test artifacts (selectors, page object, test cases, test data, execution file, and repository registration) across 4 suites.

## Applicable-Traps Table (Phase 1 Step 0b)

| Trap (from product knowledge) | Applies here? | Where it is handled |
|---|---|---|
| Auto-restored bulk class form draft disabling Create button | Yes | Handled by `TST_CCLS_TC_23` form reset before Class 1 & Class 2 in Suite 1 |
| Mailsac "Unblock Content" banner hiding HTML email content | Yes | Handled in `mailsacUI.page.js` by checking and clicking `unblockContentBtn` |
| Email delivery delay / async latency | Yes | Handled in `mailsacUI.page.js` via polling loop (`waitForMessagesInUI` up to 60s) |
| Transient inbox state from prior runs | Yes | Handled by pre-test and post-test inbox purge steps (`TST_BCEV_TC_1, 2, 5, 6`) |

## Changes Made

### 1. testResources/selectors/ExperienceApp/C1Selectors.json
- **Type:** Modified
- **Layer:** Selectors (Layer 1)
- **What changed:** Added `css.ComproC1.mailsacUI` selector namespace containing selectors for Mailsac web login, inbox navigation, purge controls, message rows, unblock content, email body, and modal controls.
- **Why:** Externalizing all Mailsac web UI DOM locators per ADR-002 and Invariant 2.
- **Lines affected:** Lines 1757–1777

### 2. pages/ExperienceApp/mailsacUI.page.js
- **Type:** Created
- **Layer:** Page Object (Layer 2)
- **What changed:** Implemented `loginToMailsac`, `openInbox`, `purgeInboxUI`, `waitForMessagesInUI`, `verifyAdminEmailUI`, and `verifyTeacherEmailsUI`.
- **Why:** Encapsulating Mailsac web browser interactions through `baseActionLibrary`.

### 3. test/ExperienceApp/bulkClassEmailVerification.test.js
- **Type:** Created
- **Layer:** Test Case (Layer 3)
- **What changed:** Defined module `BCEV` (`TST_BCEV_TC_1` through `TST_BCEV_TC_8`) using `mailsacUI.page.js` and `schoolClasses.page.js`.
- **Why:** Automated test case functions for inbox purge, email content assertion, and dashboard class listing verification.

### 4. testResources/testcaseData/ExperienceApp/thor/bulkClassEmailVerificationData.json
- **Type:** Created
- **Layer:** Test Data (Layer 4)
- **What changed:** Defined test data for School `FCN-CHZ-PDA`, admin `testt1@mailsac.com`, teacher `teacher17aug2026@mailsac.com`, Mailsac credentials, and classes.
- **Why:** Configured inputs for multi-suite execution.

### 5. testResources/testExecutionFiles/ExperienceApp/thor/bulkClassEmailVerification.json
- **Type:** Created
- **Layer:** Execution File (Layer 5)
- **What changed:** Configured 4 suites (Suite 1: C1 Class Creation Flow with `TST_CCLS_TC_23` reset, Suite 2: C1 Dashboard Class List Validation, Suite 3: Mailsac UI Admin Summary Email Verification, Suite 4: Mailsac UI Teacher Notification Emails Verification).
- **Why:** Orchestrates end-to-end execution across C1 and Mailsac web UI.

### 6. testResources/testcaseRepository/ExperienceApp/C1TCRepository.json
- **Type:** Modified
- **Layer:** TC Repository (Layer 5)
- **What changed:** Registered module `BCEV` with `TST_BCEV_TC_1..8` (all `visualTest: false`).
- **Why:** Framework registration rule (Invariant 7).

### 7. .architecture/authoring-status.md
- **Type:** Modified
- **Layer:** Tracking
- **What changed:** Added in-flight status block for `bulkClassEmailVerification (ExperienceApp, thor)`.

## Architecture Decisions Triggered
- Reused existing C1 page objects and test cases (`TST_SADB_TC_1`, `TST_SCLS_TC_2`, `TST_CCLS_TC_1..8, 15, 23`) per ADR-011 (reuse, don't redefine).
- Isolated Mailsac web UI selectors under `css.ComproC1.mailsacUI` per ADR-002.

## Protected Files Touched
- None in this step (`package.json` script addition pending explicit user confirmation).

## Pending / Follow-up
- Request user confirmation for `package.json` script addition (`bulkClassEmailVerificationTest_thor`).
- Execute Phase 2 (Run & fix) against Thor environment.

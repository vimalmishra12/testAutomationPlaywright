# Walkthrough — docs-password-redaction

## Session 1 — 2026-09-28

## Summary
Removed a real test-account password that was still written in plain text in one knowledge file
and three walkthroughs of this public repository. ADR-025 had already moved every credential in
test data to `{{env.*}}` tokens; the documentation had not been cleaned. **Redaction does not undo
the exposure** — the value stays in git history — so the accounts must be rotated (user is raising
it with the team).

## Changes Made

### 1. testAutomation_v1.0/.architecture/product-knowledge/Integrations.md
- **Type:** Modified
- **Layer:** Config (product knowledge)
- **What changed:** "Credentials & test data (Thor)" — the three Blackboard accounts
  (`thornodeepltiteacher`, `thortestltiteacher`, `thortestltistudent`) no longer show a password;
  each names its token instead: `{{env.BB_THOR_LTITEACHER_PASSWORD}}`,
  `{{env.BB_THOR_LTIDEEPLINKTEACHER_PASSWORD}}`, `{{env.BB_THOR_LTISTUDENT_PASSWORD}}` (mapping
  verified against `testResources/testcaseData/Integrations/Blackboard/thor/bbLogindata.json`).
- **Lines affected:** 34, 37, 38.

### 2. Three walkthroughs — value replaced by `<redacted — …>`, nothing else touched
Walkthroughs are session records and normally never edited; a live credential is the exception.
- `walkthroughs/walkthrough_nemoUploadCsvValidation.test.js_2026-06-10_00h-00m.md` line 71 — thor
  school-admin `testt1@mailsac.com` → `<redacted — {{env.C1_THOR_SCHOOLADMIN_PASSWORD}}, ADR-025>`.
- `walkthroughs/walkthrough_bulkClassEmailVerification_2026-09-21_12h-40m.md` line 6 — Mailsac
  account `comproqatest21@gmail.com` → `<redacted — Mailsac password is in .env / CI, ADR-025>`.
- `walkthroughs/walkthrough_2026-05-27.md` line 31 — rel teacher `relteacontext` →
  `<redacted — {{env.C1_REL_MANAGEREPORTSINSTRUCTOR_PASSWORD}}, ADR-025>`.

## Verification
- After the edit, a repo-wide search for the exposed value returns **0** occurrences (git history
  excluded).
- Broader scan of `.md` files for `"password": "<literal>"` / `password: <literal>`: the remaining
  hits are not credentials — selector keys in `Walkthrough/walkthrough_manageReports.test.js.md`
  (`"password": "input[…]"`-style), CSV test inputs for new-account validation in the NEMO-24306
  register, and `ebookMapping_test_cases.md:68`, which names the data file
  (`assignmentLoginData.json`), not a password.

## Architecture Decisions Triggered
None new (applies ADR-025 to documentation).

## Protected Files Touched
None — no protected files were modified.

## Pending / Follow-up
- **Rotate the exposed accounts — the real fix** (user to raise with the team): the three
  Blackboard thor accounts, thor school-admin `testt1@mailsac.com`, the Mailsac account
  `comproqatest21@gmail.com`, rel teacher `relteacontext` — they appear to share one password.
  Then update `.env` and the CI secrets (GitHub Actions, Semaphore).
- ADR-025's deferred item — rotating the qa/rel Cloudflare Access secrets — belongs in the same
  exercise.
- Git-history scrubbing was considered and not done: it needs a force-push that breaks every clone,
  and cannot recall a value already public; rotation makes the history harmless.

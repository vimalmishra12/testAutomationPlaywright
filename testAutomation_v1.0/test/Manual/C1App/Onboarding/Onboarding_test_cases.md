# Manual Functional Test Cases — Cambridge One: Onboarding (Batch 1)

**Source:** `OnboardingApp_Test_Plan.xlsx` (supplied by the user 2026-09-24) — sheet "Test Cases", 58 scenarios in 11 sub-modules (`TC_HOME_*`, `TC_LOGIN_*`, `TC_FPWD_*`, `TC_RESETPW_*`, `TC_ROLE_*`, `TC_LRN_*`, `TC_TCH_*`, `TC_PAR_*`, `TC_CHLD_*`, `TC_INVITE_*`, `TC_XCUT_*`) + sheet "Legend"
**Modules:** by the page object each case will live on (AGENTS.md Rule 6) — LAND (`landing.page.js`), FOOT (`footer.page.js`), LOGI (`login.page.js`), APPS (`appShell.page.js`), RESE (`resetPassword.page.js`), SNUP (`signup.page.js`), CREA (`createNewClass.page.js`), SPRF (`studentProfile.page.js`), INVI (`invitationNotification.page.js`), **PCHD (proposed — no parent/child page object yet)**
**App:** Cambridge One — thor `https://micro-nemo.comprodls.com` (automation target); production `https://www.cambridgeone.org` for the e-mail-verification cases while thor's verify-link certificate is expired (`c1-core-shared.md` §A4)
**Pages in scope:** pre-login homepage `/home`, Log in `/login`, Reset password, role selection `/regoptions`, Learner age gate `/learner-age-check`, Teacher/Learner/Parent registration forms, parent "My children", class-invite sign-up, first-login / temporary-password screens
**Generated:** 2026-09-24 | **Total TCs:** 63 (51 Positive · 1 Edge · 11 Negative) — **57 of the source's 58 scenarios have a case**; TC_XCUT_009 (UI/colours) is a visual-layer check, not a manual case (see map)
**Execution status (2026-09-24):** designed, not executed — **63 Not Run**. 16 rows reuse an EXISTING automated TC (TST_LAND_TC_3, TST_LAND_TC_2, TST_FOOT_TC_1, TST_FOOT_TC_2, TST_FOOT_TC_3, TST_FOOT_TC_7, TST_FOOT_TC_4, TST_FOOT_TC_6, TST_FOOT_TC_8, TST_LOGI_TC_5, TST_LOGI_TC_4, TST_LOGI_TC_6, TST_APPS_TC_2, TST_RESE_TC_4, TST_SNUP_TC_59, TST_SNUP_TC_63) whose assertion Phase 1 must confirm; none is counted as passing here.
**Automation scope (user, 2026-09-24):** **50 to automate** · **13 manual only** — 🔴 RED 10 (TST_LOGI_TC_15, TST_LOGI_TC_16, TST_LOGI_TC_17, TST_LOGI_TC_19, TST_SNUP_TC_79, TST_SNUP_TC_80, TST_SNUP_TC_81, TST_LOGI_TC_20, TST_LOGI_TC_21, TST_LOGI_TC_22) · 🟡 YELLOW 3 (TST_LOGI_TC_11, TST_LOGI_TC_12, TST_LOGI_TC_13). Column 15 "Automation Scope" carries it on every row; the `.xlsx` also colours those rows' ID cells red/yellow as the source did.

**TCs per module:**
- **LAND** — 4 (TST_LAND_TC_6, TST_LAND_TC_3, TST_LAND_TC_2, TST_LAND_TC_7)
- **FOOT** — 7 (TST_FOOT_TC_1, TST_FOOT_TC_2, TST_FOOT_TC_3, TST_FOOT_TC_7, TST_FOOT_TC_4, TST_FOOT_TC_6, TST_FOOT_TC_8)
- **LOGI** — 19 (TST_LOGI_TC_5, TST_LOGI_TC_7, TST_LOGI_TC_8, TST_LOGI_TC_9, TST_LOGI_TC_10, TST_LOGI_TC_4, TST_LOGI_TC_6, TST_LOGI_TC_11, TST_LOGI_TC_12, TST_LOGI_TC_13, TST_LOGI_TC_14, TST_LOGI_TC_15, TST_LOGI_TC_16, TST_LOGI_TC_17, TST_LOGI_TC_18, TST_LOGI_TC_19, TST_LOGI_TC_20, TST_LOGI_TC_21, TST_LOGI_TC_22)
- **APPS** — 1 (TST_APPS_TC_2)
- **RESE** — 6 (TST_RESE_TC_6, TST_RESE_TC_7, TST_RESE_TC_8, TST_RESE_TC_4, TST_RESE_TC_9, TST_RESE_TC_10)
- **CREA** — 1 (TST_CREA_TC_31)
- **SPRF** — 1 (TST_SPRF_TC_24)
- **SNUP** — 19 (TST_SNUP_TC_65, TST_SNUP_TC_66, TST_SNUP_TC_67, TST_SNUP_TC_59, TST_SNUP_TC_68, TST_SNUP_TC_69, TST_SNUP_TC_70, TST_SNUP_TC_71, TST_SNUP_TC_63, TST_SNUP_TC_72, TST_SNUP_TC_76, TST_SNUP_TC_73, TST_SNUP_TC_77, TST_SNUP_TC_74, TST_SNUP_TC_75, TST_SNUP_TC_79, TST_SNUP_TC_80, TST_SNUP_TC_81, TST_SNUP_TC_78)
- **PCHD** — 3 (TST_PCHD_TC_1, TST_PCHD_TC_2, TST_PCHD_TC_3)
- **INVI** — 2 (TST_INVI_TC_14, TST_INVI_TC_15)

> **Ordering:** grouped by **sub-module**, then by Linked Requirement (= one source row); Positive → Edge
> → Negative within a group. **S.No.** follows that order; **Test Case IDs** are stable and so appear out of
> numeric sequence.
>
> **IDs.** Each module continues its own numbering (registry, test files and every register checked
> 2026-09-24: LAND 6+, FOOT 12+, LOGI 7+, RESE 6+, SNUP 65+, CREA 31+, SPRF 24+, INVI 14+). Where an
> existing automated TC already proves a row's outcome, the row **reuses that ID** instead of minting a
> duplicate function (ADR-011) — its Remarks start "EXISTING TC reused". Source rows TC_HOME_005 and
> TC_HOME_006 (several footer links each) are **split one case per link**, because every link already
> has its own FOOT TC. TC_RESETPW_001/002 are split into "staff sets a temporary password" (CREA / SPRF)
> + the student's shared first-login screen (TST_LOGI_TC_18).
>
> **Grounding.** Steps and expected results are the source team's; its Legend says the age-gate
> thresholds were confirmed live. **Nothing here was re-executed in this session.** Everything the
> source itself calls unverified, and any copy it does not state, is marked `[ASSUMED]` — confirm live
> in `c1-test-authoring` Phase 1.
>
> **Data.** Cases marked CREATES REAL DATA (account signups, invite signup, child account) or that
> change a real password (TST_RESE_TC_9, TST_CREA_TC_31, TST_SPRF_TC_24, TST_LOGI_TC_9 lockout) need a
> disposable/run-generated account (ADR-022 `{{run.*}}`) and the user's OK on a shared environment
> (ADR-021). Passwords come from `{{env.*}}` tokens only (ADR-023).

---

## How to automate a case from this register

1. **Do not redesign.** Pick a row whose **Automation Scope is "Automate"** and Status `Not Run`; keep its
   **Test Case ID** — that ID goes into the test file, the TC repository and the execution file.
   Never renumber; a genuinely new case is appended.
2. **Never automate a 🔴/🟡 row** — they are manual-only by user decision (2026-09-24).
3. **"EXISTING TC reused" rows** are already automated: confirm the existing function asserts the row's
   Expected Result, extend it if not — do not write a second function (ADR-011).
4. **Read first:** `.architecture/authoring-status.md` → block `onboarding` → "NEXT BATCH" (batch order,
   open questions, constraints), then `product-knowledge/ExperienceApp/c1-core-shared.md` and `onboarding.md`,
   then follow `.agent/skills/c1-test-authoring`.
5. **`[ASSUMED]` is a question, not a fact** — confirm it live and replace it with what was seen.
6. **Close the loop:** back-port into `_tcdata.js`, run `node test/Manual/C1App/Onboarding/_generate.js`
   (rewrites both `.md` and `.xlsx` — never hand-edit them), then set Status/Comments.

**Suggested automation batches** (side-effect free first, per migration plan §4.2):
- **B1 (no data):** TST_SNUP_TC_65, 66, 67, 68, 69, 70, 71, 76, 77, 78, TST_LOGI_TC_7, 10, TST_RESE_TC_6, TST_LAND_TC_6, 7 + confirm the reused LAND/FOOT/LOGI/RESE/SNUP_TC_59/63 rows.
- **Login with fixture accounts:** TST_LOGI_TC_8, 14, TST_APPS_TC_2 (learner), TST_RESE_TC_7, 8.
- **Creates data (ask first):** TST_SNUP_TC_72, 73, 74, 75, TST_LOGI_TC_9, TST_RESE_TC_9, 10, TST_CREA_TC_31, TST_SPRF_TC_24, TST_LOGI_TC_18, TST_INVI_TC_14, 15, TST_PCHD_TC_1–3.

---

## Requirement → Test Case coverage map

🔴 / 🟡 = manual only (red / yellow in the source). (E) Edge · (N) Negative.

| Linked Requirement (source row) | Mapped TC IDs (P → E → N) |
|---|---|
| **Homepage** | |
| TC_HOME_001 — Verify the pre-login homepage displays the expected header, hero, and footer elements | TST_LAND_TC_6 |
| TC_HOME_002 — Verify 'Log in' on the homepage navigates to the Log in page | TST_LAND_TC_3 |
| TC_HOME_003 — Verify 'Sign up' on the homepage navigates to the role-selection page | TST_LAND_TC_2 |
| TC_HOME_004 — Verify the site-language switcher changes the language of the pre-login homepage | TST_LAND_TC_7 |
| TC_HOME_005 — Verify the internal footer links (Terms of use, Privacy notice, Accessibility, Cambridge One for schools) each open their correct page in the same tab | TST_FOOT_TC_1, TST_FOOT_TC_2, TST_FOOT_TC_3, TST_FOOT_TC_7 |
| TC_HOME_006 — Verify the external footer links (Our approach, FAQs, Help) each open their correct page in a new tab | TST_FOOT_TC_4, TST_FOOT_TC_6, TST_FOOT_TC_8 |
| **Login** | |
| TC_LOGIN_001 — Verify a user can log in successfully with valid credentials | TST_LOGI_TC_5 |
| TC_LOGIN_002 — Verify blank submission of the login form shows required-field validation | TST_LOGI_TC_7 (N) |
| TC_LOGIN_003 — Verify login fails with an incorrect password and shows the generic credentials error | TST_LOGI_TC_8 (N) |
| TC_LOGIN_004 — Verify the account is temporarily locked after 5 consecutive failed login attempts | TST_LOGI_TC_9 (N) |
| TC_LOGIN_005 — Verify the 'Show Password' toggle reveals and re-hides the password on the login form | TST_LOGI_TC_10 |
| TC_LOGIN_006 — Verify 'Forgotten your password?' navigates to the Reset password screen | TST_LOGI_TC_4 |
| TC_LOGIN_007 — Verify 'Don't have an account yet?' on the login form navigates to Sign up | TST_LOGI_TC_6 |
| TC_LOGIN_008 — Verify a learner with a username-based account (no email) can log in using their username | TST_LOGI_TC_11 🟡 |
| TC_LOGIN_009 — Verify a bulk-created adult username account logging in for the second time does not have to accept the Terms of use | TST_LOGI_TC_12 🟡 |
| TC_LOGIN_010 — Verify the first-login Terms of use onboarding gate does not let the user proceed without accepting | TST_LOGI_TC_13 (N) 🟡 |
| TC_LOGIN_011 — Verify an Admin can log in via the standard Log in form | TST_LOGI_TC_14 |
| TC_LOGIN_012 — Verify a Support Admin logs in via Okta single sign-on | TST_LOGI_TC_15 🔴 |
| TC_LOGIN_013 — Verify a CambridgeGO-provisioned user can log in | TST_LOGI_TC_16 🔴 |
| TC_LOGIN_014 — Verify an Edulog-provisioned user can log in | TST_LOGI_TC_17 🔴 |
| TC_LOGIN_015 — Verify logging out as a Learner lands on the pre-login home page | TST_APPS_TC_2 |
| **Forgot Password** | |
| TC_FPWD_001 — Verify submitting the Reset password form with a blank email shows a required-field error | TST_RESE_TC_6 (N) |
| TC_FPWD_002 — Verify submitting the Reset password form with a valid email shows a generic confirmation, without revealing whether the account exists | TST_RESE_TC_7 |
| TC_FPWD_003 — Verify submitting the Reset password form with an email that has no matching account shows the same generic confirmation message | TST_RESE_TC_8 (N) |
| TC_FPWD_004 — Verify 'Back to login' returns from the Reset password screen to the Log in form | TST_RESE_TC_4 |
| TC_FPWD_005 — Verify a user can set a new password via the emailed reset link and log in with the updated password | TST_RESE_TC_9 |
| TC_FPWD_006 — Verify a user can log in with the newly reset password after resetting it via the emailed link | TST_RESE_TC_10 |
| **Learner Password Reset (by Staff)** | |
| TC_RESETPW_001 — Verify a Teacher can set a temporary password for an enrolled student, and the student sets their own new password on first login with it | TST_CREA_TC_31, TST_LOGI_TC_18 |
| TC_RESETPW_002 — Verify an Admin can set a temporary password for a student from the Students tab, and the student sets their own new password on first login with it | TST_SPRF_TC_24 |
| **Sign Up - Role Selection** | |
| TC_ROLE_001 — Verify the role-selection page shows Learner, Teacher, and Parent options with no role pre-selected | TST_SNUP_TC_65 |
| TC_ROLE_002 — Verify selecting a role and clicking 'Next' shows a confirmation dialog naming the selected role | TST_SNUP_TC_66 |
| TC_ROLE_003 — Verify 'No, go back' on the role-confirmation dialog closes the dialog and keeps the previously selected role | TST_SNUP_TC_67 |
| TC_ROLE_004 — Verify 'Yes, continue' on the role-confirmation dialog proceeds to that role's registration flow | TST_SNUP_TC_59 |
| TC_ROLE_005 — Verify 'Login' on the role-selection page navigates to the Log in form | TST_SNUP_TC_68 |
| **Sign Up - Learner** | |
| TC_LRN_001 — Verify selecting the Learner role leads to an age and location screen before the registration form | TST_SNUP_TC_69 |
| TC_LRN_002 — Verify selecting an under-age value on the Learner age screen blocks self-registration | TST_SNUP_TC_70 (N) |
| TC_LRN_003 — Verify the Learner under-age threshold depends on the selected Location | TST_SNUP_TC_71 (E) |
| TC_LRN_004 — Verify selecting an age of 16 or older on the Learner age screen allows the user to proceed to the registration form | TST_SNUP_TC_63 |
| TC_LRN_005 — Verify a Learner (16+, India) can complete the registration form and create an account | TST_SNUP_TC_72 |
| TC_LRN_006 — Verify the Learner registration form shows validation errors for blank required fields, an invalid email, and a weak password | TST_SNUP_TC_76 (N) |
| **Sign Up - Teacher** | |
| TC_TCH_001 — Verify a Teacher can complete the registration form and create an account | TST_SNUP_TC_73 |
| TC_TCH_002 — Verify the Teacher registration form shows validation errors for blank required fields, an invalid email, a weak password, and an unchecked Terms checkbox | TST_SNUP_TC_77 (N) |
| **Sign Up - Parent** | |
| TC_PAR_001 — Verify a Parent can complete the registration form and create an account | TST_SNUP_TC_74 |
| TC_PAR_002 — Verify the Parent registration form requires the 'parent or guardian' age-confirmation checkbox before submitting | TST_SNUP_TC_75 (N) |
| **Parent / Child Account** | |
| TC_CHLD_001 — Verify a Parent can create a child's account from 'My children' | TST_PCHD_TC_1 |
| TC_CHLD_002 — Verify 'Next' on 'Create my child's account' stays blocked until every required field and the consent checkbox are complete | TST_PCHD_TC_2 (N) |
| TC_CHLD_003 — Verify a newly created child's account can log in for the first time | TST_PCHD_TC_3 |
| **Class Invite** | |
| TC_INVITE_001 — Verify a brand-new user invited to a class by a teacher can sign up via the invite email | TST_INVI_TC_14 |
| TC_INVITE_002 — Verify an existing, already-registered learner who clicks a class invite link while logged in is taken to their own dashboard | TST_INVI_TC_15 |
| **Cross-Cutting** | |
| TC_XCUT_001 — Verify social sign-in buttons (Facebook, Google, Apple) are present on the Log in form | TST_LOGI_TC_19 🔴 |
| TC_XCUT_002 — Verify social sign-in buttons (Facebook, Google, Apple) are present on the Teacher registration form | TST_SNUP_TC_79 🔴 |
| TC_XCUT_003 — Verify social sign-in buttons (Facebook, Google, Apple) are present on the Learner registration form | TST_SNUP_TC_80 🔴 |
| TC_XCUT_004 — Verify social sign-in buttons (Facebook, Google, Apple) are present on the Parent registration form | TST_SNUP_TC_81 🔴 |
| TC_XCUT_005 — Verify 'Sign in with Facebook' opens Facebook's own login page to authenticate | TST_LOGI_TC_20 🔴 |
| TC_XCUT_006 — Verify 'Sign in with Google' opens Google's own sign-in page to authenticate | TST_LOGI_TC_21 🔴 |
| TC_XCUT_007 — Verify 'Sign in with Apple' opens Apple's own sign-in page to authenticate | TST_LOGI_TC_22 🔴 |
| TC_XCUT_008 — Verify 'Have an account already? / Login' on a registration form returns to the Log in page | TST_SNUP_TC_78 |
| TC_XCUT_009 — UI/Colors – Verify there are no unexpected color or UI changes on onboarding pages | none — not a functional case. A look-and-feel regression check is what the framework's VISUAL layer does (AGENTS.md §8: `visualTest` baselines per TC, Phase 3). Covered by promoting the onboarding TCs above to `visualTest: true` once they are green — decided per TC at Phase 3, not designed as a manual case here. |

---

## Product reference (from the source workbook's Legend and cases, 2026-09-24 — not yet re-seen by us)

- **Learner age gate** — Learner self-signup only. Threshold is **location-dependent**: India blocks
  13–15 and allows 16+; United Kingdom blocks 11–12 and allows 13+ (source: confirmed live). Blocked
  copy: *"We're sorry … Cambridge One welcomes every learner, but our younger students need an adult's
  help to set up an account … Please ask your parent or teacher to sign you up"* + "Go back". Teacher,
  Parent and invite-based Learner sign-up have **no** age gate. Age options: 18+, then 17 down to 5.
- **Registration forms** — Teacher: First name, Last name, Work email, Password, Location (autocomplete),
  Terms checkbox. Learner: School email; Location pre-filled from the age screen and locked. Parent:
  adds *"I am 18 years of age or older and I am the parent or guardian of any child whose account I set
  up"*. Invite sign-up: School email pre-filled and disabled, Location empty and editable.
- **Validation copy** — "This field is required" · "E-mail address is invalid." · "Password does not
  meet complexity requirements" · Terms alert "Please confirm that you have read and understood the
  Terms of use".
- **Login copy** — blank: "Please enter your username or email address" / "Please enter your
  password"; wrong password: "Please check your login and password and try again. You are limited to 5
  attempts, or you can reset your password". Lockout after 5 consecutive failures.
- **Reset password** — blank: "This field is required"; any e-mail (registered or not): "Reset password
  email sent" + *"If your email is linked to a Cambridge account, you will receive a link to reset your
  password. If you don't receive it, please check your junk mail"* — identical by design.
- **First-login Terms gate** — a bulk-created adult username account meets "Welcome to Cambridge One"
  + "I accept the Terms of use" + Submit once, on its first login.
- **Temporary password** — a Teacher (class roster → Options → Change password) or Admin (Students tab
  → Action Menu, [ASSUMED]) sets a temporary password; the student's next login shows a screen for the
  temporary password + new password + confirmation before the dashboard.
- **Other sign-in routes** — Support Admin: Okta SSO via `<app URL>/?p=<email>&t=saml` →
  identity.cambridge.org; Edulog: `<app URL>/edulog` (SAML option); CambridgeGO: thor
  cambridgedev.org/go-dev/, other lower envs /go-stg/, prod cambridge.org/go. Facebook / Google / Apple
  buttons on the Log in form and every registration form.
- **Homepage footer** — same tab: Terms of use, Privacy Notice, "Accessibility on Cambridge One",
  "Do I need a school account?"; new tab: Our approach (Cambridge English), FAQs and Help (help centre).

---

## Section — Test Cases (grouped by sub-module, then Linked Requirement)

## Homepage

### Requirement TC_HOME_001 — Verify the pre-login homepage displays the expected header, hero, and footer elements

| Field | Value |
|---|---|
| **S.No.** | 1 |
| **Test Case ID** | TST_LAND_TC_6 |
| **Title** | Verify the pre-login homepage shows the expected header, hero and footer elements when it loads |
| **Linked Requirement** | TC_HOME_001 — Verify the pre-login homepage displays the expected header, hero, and footer elements |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | User is not logged in; pre-login homepage open. |
| **Test Steps** | 1. Go to the pre-login homepage. |
| **Test Data** | — |
| **Expected Result** | 1. Header: Cambridge One logo/home link, 'Help' link, the site-language switcher and a 'Log in' link.<br>2. Hero: heading 'Cambridge One', sub-heading 'Your home for digital learning', a 'Log in' link and a 'Sign up' link.<br>3. Footer: 'Terms of use', 'Privacy notice', 'Accessibility', 'Our approach', 'FAQs', 'Cambridge One for schools', a copyright line and 'Help'. |
| **Remarks** | Source: OnboardingApp_Test_Plan.xlsx. Extends the existing TST_LAND_TC_5 (hero heading/sub-heading/buttons/logo) with the header and footer items — a new function, not a duplicate. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |
| **Automation Scope** | Automate |

---

### Requirement TC_HOME_002 — Verify 'Log in' on the homepage navigates to the Log in page

| Field | Value |
|---|---|
| **S.No.** | 2 |
| **Test Case ID** | TST_LAND_TC_3 |
| **Title** | Verify the Log in page opens when 'Log in' is clicked on the homepage |
| **Linked Requirement** | TC_HOME_002 — Verify 'Log in' on the homepage navigates to the Log in page |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | User is not logged in; pre-login homepage open. |
| **Test Steps** | 1. Click 'Log in'. |
| **Test Data** | — |
| **Expected Result** | The Log in page opens (URL '/login') showing the 'Log in' form. |
| **Remarks** | Source: OnboardingApp_Test_Plan.xlsx. EXISTING TC reused (ADR-011 — no duplicate function): TST_LAND_TC_3 already clicks Log in and checks the login page is launched. Phase 1: confirm it asserts this row's Expected Result; extend its assertion if it does not. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |
| **Automation Scope** | Automate |

---

### Requirement TC_HOME_003 — Verify 'Sign up' on the homepage navigates to the role-selection page

| Field | Value |
|---|---|
| **S.No.** | 3 |
| **Test Case ID** | TST_LAND_TC_2 |
| **Title** | Verify the role-selection page opens when 'Sign up' is clicked on the homepage |
| **Linked Requirement** | TC_HOME_003 — Verify 'Sign up' on the homepage navigates to the role-selection page |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | User is not logged in; pre-login homepage open. |
| **Test Steps** | 1. Click 'Sign up'. |
| **Test Data** | — |
| **Expected Result** | The 'Sign up' role-selection page opens (URL '/regoptions') showing the 'Select your role' options. |
| **Remarks** | Source: OnboardingApp_Test_Plan.xlsx. EXISTING TC reused (ADR-011 — no duplicate function): TST_LAND_TC_2 already clicks Sign up and checks the signup page is launched (used by the LP setup chain). Phase 1: confirm it asserts this row's Expected Result; extend its assertion if it does not. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |
| **Automation Scope** | Automate |

---

### Requirement TC_HOME_004 — Verify the site-language switcher changes the language of the pre-login homepage

| Field | Value |
|---|---|
| **S.No.** | 4 |
| **Test Case ID** | TST_LAND_TC_7 |
| **Title** | Verify the homepage text switches language when another language is chosen in the site-language switcher |
| **Linked Requirement** | TC_HOME_004 — Verify the site-language switcher changes the language of the pre-login homepage |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | User is not logged in; pre-login homepage open. Homepage is in English. |
| **Test Steps** | 1. Click the site-language switcher in the header.<br>2. Select a different language (e.g. 'Español'). |
| **Test Data** | Language: 'Español' |
| **Expected Result** | 1. The switcher expands to a list of languages with the current language marked as selected.<br>2. After choosing another language, the header, hero and footer text change to it and the switcher's label shows the newly selected language. |
| **Remarks** | Source: OnboardingApp_Test_Plan.xlsx. The existing TST_LAND_TC_4 only opens the dropdown (asserts the click); this case asserts the outcome. Automation reuses LAND_TC_4 for the click. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |
| **Automation Scope** | Automate |

---

### Requirement TC_HOME_005 — Verify the internal footer links (Terms of use, Privacy notice, Accessibility, Cambridge One for schools) each open their correct page in the same tab

| Field | Value |
|---|---|
| **S.No.** | 5 |
| **Test Case ID** | TST_FOOT_TC_1 |
| **Title** | Verify 'Terms of use' opens the Terms of use page in the same tab when clicked in the homepage footer |
| **Linked Requirement** | TC_HOME_005 — Verify the internal footer links (Terms of use, Privacy notice, Accessibility, Cambridge One for schools) each open their correct page in the same tab |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | User is not logged in; pre-login homepage open. |
| **Test Steps** | 1. Click 'Terms of use' in the footer. |
| **Test Data** | — |
| **Expected Result** | The page opens in the same tab with heading 'Terms of use'. |
| **Remarks** | Source: OnboardingApp_Test_Plan.xlsx. Source row split one case per link. EXISTING TC reused (ADR-011 — no duplicate function): TST_FOOT_TC_1 already clicks the link and checks the page is launched (footer.test.js, active). Phase 1: confirm it asserts this row's Expected Result; extend its assertion if it does not. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |
| **Automation Scope** | Automate |

---

| Field | Value |
|---|---|
| **S.No.** | 6 |
| **Test Case ID** | TST_FOOT_TC_2 |
| **Title** | Verify 'Privacy notice' opens the Privacy Notice page in the same tab when clicked in the homepage footer |
| **Linked Requirement** | TC_HOME_005 — Verify the internal footer links (Terms of use, Privacy notice, Accessibility, Cambridge One for schools) each open their correct page in the same tab |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | User is not logged in; pre-login homepage open. |
| **Test Steps** | 1. Click 'Privacy notice' in the footer. |
| **Test Data** | — |
| **Expected Result** | The page opens in the same tab with heading 'Privacy Notice'. |
| **Remarks** | Source: OnboardingApp_Test_Plan.xlsx. EXISTING TC reused (ADR-011 — no duplicate function): TST_FOOT_TC_2 already clicks the link and checks the page is launched (active). Phase 1: confirm it asserts this row's Expected Result; extend its assertion if it does not. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |
| **Automation Scope** | Automate |

---

| Field | Value |
|---|---|
| **S.No.** | 7 |
| **Test Case ID** | TST_FOOT_TC_3 |
| **Title** | Verify 'Accessibility' opens the Accessibility page in the same tab when clicked in the homepage footer |
| **Linked Requirement** | TC_HOME_005 — Verify the internal footer links (Terms of use, Privacy notice, Accessibility, Cambridge One for schools) each open their correct page in the same tab |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | User is not logged in; pre-login homepage open. |
| **Test Steps** | 1. Click 'Accessibility' in the footer. |
| **Test Data** | — |
| **Expected Result** | The page opens in the same tab with heading 'Accessibility on Cambridge One'. |
| **Remarks** | Source: OnboardingApp_Test_Plan.xlsx. EXISTING TC reused (ADR-011 — no duplicate function): TST_FOOT_TC_3 already clicks the link and checks the page is launched (active). Phase 1: confirm it asserts this row's Expected Result; extend its assertion if it does not. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |
| **Automation Scope** | Automate |

---

| Field | Value |
|---|---|
| **S.No.** | 8 |
| **Test Case ID** | TST_FOOT_TC_7 |
| **Title** | Verify 'Cambridge One for schools' opens its page in the same tab when clicked in the homepage footer |
| **Linked Requirement** | TC_HOME_005 — Verify the internal footer links (Terms of use, Privacy notice, Accessibility, Cambridge One for schools) each open their correct page in the same tab |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | User is not logged in; pre-login homepage open. |
| **Test Steps** | 1. Click 'Cambridge One for schools' in the footer. |
| **Test Data** | — |
| **Expected Result** | The page opens in the same tab with heading 'Do I need a school account?'. |
| **Remarks** | Source: OnboardingApp_Test_Plan.xlsx. EXISTING TC reused (ADR-011 — no duplicate function): TST_FOOT_TC_7 already clicks the link and checks the page is launched (active). Phase 1: confirm it asserts this row's Expected Result; extend its assertion if it does not. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |
| **Automation Scope** | Automate |

---

### Requirement TC_HOME_006 — Verify the external footer links (Our approach, FAQs, Help) each open their correct page in a new tab

| Field | Value |
|---|---|
| **S.No.** | 9 |
| **Test Case ID** | TST_FOOT_TC_4 |
| **Title** | Verify 'Our approach' opens the Cambridge English site in a new tab when clicked in the homepage footer |
| **Linked Requirement** | TC_HOME_006 — Verify the external footer links (Our approach, FAQs, Help) each open their correct page in a new tab |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | User is not logged in; pre-login homepage open. |
| **Test Steps** | 1. Click 'Our approach' in the footer. |
| **Test Data** | — |
| **Expected Result** | The Cambridge English site opens in a NEW tab; the original homepage tab stays open and unchanged. |
| **Remarks** | Source: OnboardingApp_Test_Plan.xlsx. Source row split one case per link. EXISTING TC reused (ADR-011 — no duplicate function): TST_FOOT_TC_4 already is registered but COMMENTED OUT in footer.test.js — re-enable it and make it assert the new tab (ADR-016 tab helpers). Phase 1: confirm it asserts this row's Expected Result; extend its assertion if it does not. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |
| **Automation Scope** | Automate |

---

| Field | Value |
|---|---|
| **S.No.** | 10 |
| **Test Case ID** | TST_FOOT_TC_6 |
| **Title** | Verify 'FAQs' opens the Cambridge One help centre in a new tab when clicked in the homepage footer |
| **Linked Requirement** | TC_HOME_006 — Verify the external footer links (Our approach, FAQs, Help) each open their correct page in a new tab |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | User is not logged in; pre-login homepage open. |
| **Test Steps** | 1. Click 'FAQs' in the footer. |
| **Test Data** | — |
| **Expected Result** | The Cambridge One help centre opens in a NEW tab. |
| **Remarks** | Source: OnboardingApp_Test_Plan.xlsx. EXISTING TC reused (ADR-011 — no duplicate function): TST_FOOT_TC_6 already is registered but COMMENTED OUT in footer.test.js — re-enable it and make it assert the new tab. Phase 1: confirm it asserts this row's Expected Result; extend its assertion if it does not. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |
| **Automation Scope** | Automate |

---

| Field | Value |
|---|---|
| **S.No.** | 11 |
| **Test Case ID** | TST_FOOT_TC_8 |
| **Title** | Verify 'Help' opens the Cambridge One help centre in a new tab when clicked in the homepage footer |
| **Linked Requirement** | TC_HOME_006 — Verify the external footer links (Our approach, FAQs, Help) each open their correct page in a new tab |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | User is not logged in; pre-login homepage open. |
| **Test Steps** | 1. Click 'Help' in the footer. |
| **Test Data** | — |
| **Expected Result** | The Cambridge One help centre opens in a NEW tab. |
| **Remarks** | Source: OnboardingApp_Test_Plan.xlsx. EXISTING TC reused (ADR-011 — no duplicate function): TST_FOOT_TC_8 already is registered but COMMENTED OUT in footer.test.js — re-enable it and make it assert the new tab. Phase 1: confirm it asserts this row's Expected Result; extend its assertion if it does not. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |
| **Automation Scope** | Automate |

---

## Login

### Requirement TC_LOGIN_001 — Verify a user can log in successfully with valid credentials

| Field | Value |
|---|---|
| **S.No.** | 12 |
| **Test Case ID** | TST_LOGI_TC_5 |
| **Title** | Verify the user lands on their role's dashboard when valid credentials are submitted |
| **Linked Requirement** | TC_LOGIN_001 — Verify a user can log in successfully with valid credentials |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | A registered, active account exists. User is on the Log in page (homepage → "Log in"). |
| **Test Steps** | 1. Enter a valid e-mail/username in the 'Login' field.<br>2. Enter the matching password.<br>3. Click 'Log in'. |
| **Test Data** | <REGISTERED_ACCOUNT_EMAIL> + its password. Passwords come from `{{env.*}}` tokens, never plaintext test data (ADR-023). |
| **Expected Result** | The user is logged in and lands on their role's dashboard. |
| **Remarks** | Source: OnboardingApp_Test_Plan.xlsx. EXISTING TC reused (ADR-011 — no duplicate function): TST_LOGI_TC_5 already clicks Log in and checks the dashboard loads (composed after LOGI_TC_1/2, which type the credentials). Phase 1: confirm it asserts this row's Expected Result; extend its assertion if it does not. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |
| **Automation Scope** | Automate |

---

### Requirement TC_LOGIN_002 — Verify blank submission of the login form shows required-field validation

| Field | Value |
|---|---|
| **S.No.** | 13 |
| **Test Case ID** | TST_LOGI_TC_7 |
| **Title** | Verify required-field errors are shown when the login form is submitted blank |
| **Linked Requirement** | TC_LOGIN_002 — Verify blank submission of the login form shows required-field validation |
| **Type** | Negative |
| **Priority** | High |
| **Preconditions** | User is on the Log in page (homepage → "Log in"). |
| **Test Steps** | 1. Leave both fields empty.<br>2. Click 'Log in'. |
| **Test Data** | — |
| **Expected Result** | 1. The 'Login' field shows 'Please enter your username or email address'.<br>2. The Password field shows 'Please enter your password'.<br>3. The user stays on the Log in page — no login attempt is submitted. |
| **Remarks** | Source: OnboardingApp_Test_Plan.xlsx. Side-effect free. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |
| **Automation Scope** | Automate |

---

### Requirement TC_LOGIN_003 — Verify login fails with an incorrect password and shows the generic credentials error

| Field | Value |
|---|---|
| **S.No.** | 14 |
| **Test Case ID** | TST_LOGI_TC_8 |
| **Title** | Verify the generic credentials error is shown when the password is wrong |
| **Linked Requirement** | TC_LOGIN_003 — Verify login fails with an incorrect password and shows the generic credentials error |
| **Type** | Negative |
| **Priority** | High |
| **Preconditions** | A registered account exists. User is on the Log in page (homepage → "Log in"). |
| **Test Steps** | 1. Enter a valid e-mail/username.<br>2. Enter an incorrect password.<br>3. Click 'Log in'. |
| **Test Data** | <REGISTERED_ACCOUNT_EMAIL> + a deliberately wrong password. |
| **Expected Result** | 1. An alert: 'Please check your login and password and try again. You are limited to 5 attempts, or you can reset your password'.<br>2. The user stays on the Log in page, not logged in. |
| **Remarks** | Source: OnboardingApp_Test_Plan.xlsx. Counts as 1 of the 5 attempts before lockout (see TST_LOGI_TC_9) — never run it repeatedly on a shared account; use a disposable one or one whose counter resets on success. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |
| **Automation Scope** | Automate |

---

### Requirement TC_LOGIN_004 — Verify the account is temporarily locked after 5 consecutive failed login attempts

| Field | Value |
|---|---|
| **S.No.** | 15 |
| **Test Case ID** | TST_LOGI_TC_9 |
| **Title** | Verify the account is temporarily locked when 5 consecutive login attempts fail |
| **Linked Requirement** | TC_LOGIN_004 — Verify the account is temporarily locked after 5 consecutive failed login attempts |
| **Type** | Negative |
| **Priority** | High |
| **Preconditions** | A registered, DISPOSABLE test account exists (not used by any other case). User is on the Log in page (homepage → "Log in"). |
| **Test Steps** | 1. Enter the account's e-mail with an incorrect password and click 'Log in'.<br>2. Repeat 4 more times (5 failures in total); note the message on the 5th.<br>3. Try a 6th time with the CORRECT password. |
| **Test Data** | <DISPOSABLE_ACCOUNT_EMAIL>; wrong password ×5, then the correct password. Passwords come from `{{env.*}}` tokens, never plaintext test data (ADR-023). |
| **Expected Result** | 1. Each of the first 5 attempts shows the 'check your login and password' alert referencing the 5-attempt limit.<br>2. After the 5th failure the account is temporarily locked: the 6th attempt, even with the correct password, is rejected. |
| **Remarks** | Source: OnboardingApp_Test_Plan.xlsx. LOCKS AN ACCOUNT — never a shared/pool account (migration plan Q10). Needs a disposable account per run (e.g. one created by the signup suite). Lockout duration and the exact 5th/6th-attempt copy are [ASSUMED] — not stated in the source. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |
| **Automation Scope** | Automate |

---

### Requirement TC_LOGIN_005 — Verify the 'Show Password' toggle reveals and re-hides the password on the login form

| Field | Value |
|---|---|
| **S.No.** | 16 |
| **Test Case ID** | TST_LOGI_TC_10 |
| **Title** | Verify the password is revealed and masked again when 'Show Password' is toggled twice on the login form |
| **Linked Requirement** | TC_LOGIN_005 — Verify the 'Show Password' toggle reveals and re-hides the password on the login form |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | User is on the Log in page (homepage → "Log in"). |
| **Test Steps** | 1. Type a password into the Password field.<br>2. Click the 'Show Password' icon.<br>3. Click it again. |
| **Test Data** | Any string, e.g. 'TestPassword123' |
| **Expected Result** | 1. After the first click the typed password is visible as plain text.<br>2. After the second click it is masked again. |
| **Remarks** | Source: OnboardingApp_Test_Plan.xlsx. The existing TST_LOGI_TC_3 (login.test.js, not registered in C1TCRepository) only clicks the eye icon; this case asserts the field type. Automation reuses the click. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |
| **Automation Scope** | Automate |

---

### Requirement TC_LOGIN_006 — Verify 'Forgotten your password?' navigates to the Reset password screen

| Field | Value |
|---|---|
| **S.No.** | 17 |
| **Test Case ID** | TST_LOGI_TC_4 |
| **Title** | Verify the Reset password screen opens when 'Forgotten your password?' is clicked |
| **Linked Requirement** | TC_LOGIN_006 — Verify 'Forgotten your password?' navigates to the Reset password screen |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | User is on the Log in page (homepage → "Log in"). |
| **Test Steps** | 1. Click 'Forgotten your password?'. |
| **Test Data** | — |
| **Expected Result** | The 'Reset password' screen opens with an Email field and a 'Reset password' button. |
| **Remarks** | Source: OnboardingApp_Test_Plan.xlsx. EXISTING TC reused (ADR-011 — no duplicate function): TST_LOGI_TC_4 already clicks Forgotten your password and checks the reset page is launched. Phase 1: confirm it asserts this row's Expected Result; extend its assertion if it does not. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |
| **Automation Scope** | Automate |

---

### Requirement TC_LOGIN_007 — Verify 'Don't have an account yet?' on the login form navigates to Sign up

| Field | Value |
|---|---|
| **S.No.** | 18 |
| **Test Case ID** | TST_LOGI_TC_6 |
| **Title** | Verify the Sign up role-selection page opens when 'Don't have an account yet?' is clicked |
| **Linked Requirement** | TC_LOGIN_007 — Verify 'Don't have an account yet?' on the login form navigates to Sign up |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | User is on the Log in page (homepage → "Log in"). |
| **Test Steps** | 1. Click 'Don't have an account yet?'. |
| **Test Data** | — |
| **Expected Result** | The Sign up role-selection page opens. |
| **Remarks** | Source: OnboardingApp_Test_Plan.xlsx. EXISTING TC reused (ADR-011 — no duplicate function): TST_LOGI_TC_6 already clicks Sign up on the login form and checks the page is launched. Phase 1: confirm it asserts this row's Expected Result; extend its assertion if it does not. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |
| **Automation Scope** | Automate |

---

### Requirement TC_LOGIN_008 — Verify a learner with a username-based account (no email) can log in using their username

| Field | Value |
|---|---|
| **S.No.** | 19 |
| **Test Case ID** | TST_LOGI_TC_11 |
| **Title** | Verify a learner with a username-based account (no e-mail) can log in with the username |
| **Linked Requirement** | TC_LOGIN_008 — Verify a learner with a username-based account (no email) can log in using their username |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | A bulk-created learner account that logs in with a USERNAME (no e-mail) exists. User is on the Log in page (homepage → "Log in"). |
| **Test Steps** | 1. Enter the username in the 'Login' field.<br>2. Enter the matching password.<br>3. Click 'Log in'. |
| **Test Data** | <BULK_LEARNER_USERNAME> + its password. |
| **Expected Result** | The user is logged in and lands on the learner dashboard. |
| **Remarks** | NOT FOR AUTOMATION — marked YELLOW in the source plan (user, 2026-09-24): needs bulk-created username accounts; the first-login gate appears once per account. Manual execution only. Source: OnboardingApp_Test_Plan.xlsx.  |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |
| **Automation Scope** | Manual only — YELLOW in source (not for automation) 🟡 |

---

### Requirement TC_LOGIN_009 — Verify a bulk-created adult username account logging in for the second time does not have to accept the Terms of use

| Field | Value |
|---|---|
| **S.No.** | 20 |
| **Test Case ID** | TST_LOGI_TC_12 |
| **Title** | Verify the Terms of use gate is not shown again when a bulk-created adult username account logs in a second time |
| **Linked Requirement** | TC_LOGIN_009 — Verify a bulk-created adult username account logging in for the second time does not have to accept the Terms of use |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | A bulk-created adult (username-based) account that has already logged in once and reached its dashboard. User is on the Log in page (homepage → "Log in"). |
| **Test Steps** | 1. Enter the username in the 'Login' field.<br>2. Enter the matching password.<br>3. Click 'Log in'. |
| **Test Data** | <BULK_ADULT_USERNAME_ALREADY_ONBOARDED> + its password. |
| **Expected Result** | The user goes straight to the dashboard — the onboarding gate is not shown again. |
| **Remarks** | NOT FOR AUTOMATION — marked YELLOW in the source plan (user, 2026-09-24): needs bulk-created username accounts; the first-login gate appears once per account. Manual execution only. Source: OnboardingApp_Test_Plan.xlsx. Legend 'First-login Terms gate': the gate appears once per account, on its first successful login. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |
| **Automation Scope** | Manual only — YELLOW in source (not for automation) 🟡 |

---

### Requirement TC_LOGIN_010 — Verify the first-login Terms of use onboarding gate does not let the user proceed without accepting

| Field | Value |
|---|---|
| **S.No.** | 21 |
| **Test Case ID** | TST_LOGI_TC_13 |
| **Title** | Verify the user cannot pass the first-login Terms of use gate when Submit is clicked without accepting |
| **Linked Requirement** | TC_LOGIN_010 — Verify the first-login Terms of use onboarding gate does not let the user proceed without accepting |
| **Type** | Negative |
| **Priority** | Medium |
| **Preconditions** | A bulk-created adult (username-based) account that has NEVER logged in. Log in with it so the 'Welcome to Cambridge One' onboarding gate is showing. |
| **Test Steps** | 1. Leave 'I accept the Terms of use' unchecked.<br>2. Click 'Submit'. |
| **Test Data** | <BULK_ADULT_USERNAME_NEVER_LOGGED_IN> + its password. |
| **Expected Result** | The user stays on the onboarding gate and does not reach the dashboard. |
| **Remarks** | NOT FOR AUTOMATION — marked YELLOW in the source plan (user, 2026-09-24): needs bulk-created username accounts; the first-login gate appears once per account. Manual execution only. Source: OnboardingApp_Test_Plan.xlsx. Consumes nothing as long as Submit is never accepted — the same account can be reused for this case. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |
| **Automation Scope** | Manual only — YELLOW in source (not for automation) 🟡 |

---

### Requirement TC_LOGIN_011 — Verify an Admin can log in via the standard Log in form

| Field | Value |
|---|---|
| **S.No.** | 22 |
| **Test Case ID** | TST_LOGI_TC_14 |
| **Title** | Verify an Admin reaches the admin dashboard when logging in through the standard Log in form |
| **Linked Requirement** | TC_LOGIN_011 — Verify an Admin can log in via the standard Log in form |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | An Admin account exists. User is on the Log in page (homepage → "Log in"). |
| **Test Steps** | 1. Enter the Admin's e-mail in the 'Login' field.<br>2. Enter the matching password.<br>3. Click 'Log in'. |
| **Test Data** | <SCHOOL_ADMIN_EMAIL> + its password (the admin suites' existing admin login). Passwords come from `{{env.*}}` tokens, never plaintext test data (ADR-023). |
| **Expected Result** | 1. The Admin is logged in through the same form as every other role.<br>2. The URL contains '/admin/admin/dashboard'. |
| **Remarks** | Source: OnboardingApp_Test_Plan.xlsx. Every admin suite already logs in this way (login.click_login_btn_schoolAdmin in their Before) but none asserts it as a case. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |
| **Automation Scope** | Automate |

---

### Requirement TC_LOGIN_012 — Verify a Support Admin logs in via Okta single sign-on

| Field | Value |
|---|---|
| **S.No.** | 23 |
| **Test Case ID** | TST_LOGI_TC_15 |
| **Title** | Verify a Support Admin signs in through Okta single sign-on and lands on the Support Admin Search page |
| **Linked Requirement** | TC_LOGIN_012 — Verify a Support Admin logs in via Okta single sign-on |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | A Support Admin account exists in Okta for the @cambridge.org domain. |
| **Test Steps** | 1. Go to the Support Admin sign-in URL ('<app URL>/?p=<email>&t=saml').<br>2. On the Okta 'Sign In' page enter the Support Admin's Username.<br>3. Click 'Next'.<br>4. Complete the remaining Okta steps (password / MFA, as prompted). |
| **Test Data** | <SUPPORT_ADMIN_OKTA_USERNAME> (@cambridge.org). |
| **Expected Result** | 1. The URL redirects (SAML) to an Okta 'Sign In' page branded 'Cambridge University Press & Assessment' on an identity.cambridge.org URL.<br>2. It shows a 'Username' field, a 'Keep me signed in' checkbox, a 'Next' button and an 'Unlock account?' link.<br>3. After Okta sign-in the Support Admin is returned to the app, on the Support Admin tool's 'Search' page. |
| **Remarks** | NOT FOR AUTOMATION — marked RED in the source plan (user, 2026-09-24): third-party identity provider. Manual execution only. Source: OnboardingApp_Test_Plan.xlsx. Legend 'Support Admin login': NOT the standard Log in form. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |
| **Automation Scope** | Manual only — RED in source (not for automation) 🔴 |

---

### Requirement TC_LOGIN_013 — Verify a CambridgeGO-provisioned user can log in

| Field | Value |
|---|---|
| **S.No.** | 24 |
| **Test Case ID** | TST_LOGI_TC_16 |
| **Title** | Verify a CambridgeGO-provisioned user can log in |
| **Linked Requirement** | TC_LOGIN_013 — Verify a CambridgeGO-provisioned user can log in |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | An account provisioned via CambridgeGO exists. CambridgeGO URL — thor: https://www.cambridgedev.org/go-dev/ · other lower envs: https://www.cambridgedev.org/go-stg/ · prod: https://cambridge.org/go |
| **Test Steps** | 1. Click 'Log in' (header or hero).<br>2. Enter the CambridgeGO account's username/e-mail in the 'Login' field.<br>3. Enter the matching password.<br>4. Click 'Log in'. |
| **Test Data** | <CAMBRIDGEGO_ACCOUNT> (the source names a specific team member's account for thor). |
| **Expected Result** | The user is logged in and lands on their role's dashboard. |
| **Remarks** | NOT FOR AUTOMATION — marked RED in the source plan (user, 2026-09-24): third-party identity provider. Manual execution only. Source: OnboardingApp_Test_Plan.xlsx.  |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |
| **Automation Scope** | Manual only — RED in source (not for automation) 🔴 |

---

### Requirement TC_LOGIN_014 — Verify an Edulog-provisioned user can log in

| Field | Value |
|---|---|
| **S.No.** | 25 |
| **Test Case ID** | TST_LOGI_TC_17 |
| **Title** | Verify an Edulog-provisioned user can log in |
| **Linked Requirement** | TC_LOGIN_014 — Verify an Edulog-provisioned user can log in |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | An account provisioned via Edulog exists. URL: '<app URL>/edulog'; choose the SAML option. |
| **Test Steps** | 1. Click 'Log in' (header or hero).<br>2. Enter the Edulog account's username/e-mail in the 'Login' field.<br>3. Enter the matching password.<br>4. Click 'Log in'. |
| **Test Data** | <EDULOG_ACCOUNT> — logins are kept in the team's Edulog logins Google Sheet (linked in the source workbook). |
| **Expected Result** | The user is logged in and lands on their role's dashboard. |
| **Remarks** | NOT FOR AUTOMATION — marked RED in the source plan (user, 2026-09-24): third-party identity provider. Manual execution only. Source: OnboardingApp_Test_Plan.xlsx.  |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |
| **Automation Scope** | Manual only — RED in source (not for automation) 🔴 |

---

### Requirement TC_LOGIN_015 — Verify logging out as a Learner lands on the pre-login home page

| Field | Value |
|---|---|
| **S.No.** | 26 |
| **Test Case ID** | TST_APPS_TC_2 |
| **Title** | Verify a logged-out Learner lands on the pre-login homepage when Log out is clicked |
| **Linked Requirement** | TC_LOGIN_015 — Verify logging out as a Learner lands on the pre-login home page |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | A Learner is logged in. |
| **Test Steps** | 1. Open the account menu.<br>2. Click 'Log out'. |
| **Test Data** | — |
| **Expected Result** | 1. The URL becomes '/home'.<br>2. The pre-login homepage is shown (Cambridge One heading, 'Log in' and 'Sign up' links). |
| **Remarks** | Source: OnboardingApp_Test_Plan.xlsx. EXISTING TC reused (ADR-011 — no duplicate function): TST_APPS_TC_2 already clicks Log out (after TST_APPS_TC_1 opens the menu) and checks the landing page. Phase 1: confirm it asserts this row's Expected Result; extend its assertion if it does not. Knowledge: SOURCE saw logout land on /home OR /login?rurl=… — both are logged-out states; confirm which one the learner gets. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |
| **Automation Scope** | Automate |

---

## Forgot Password

### Requirement TC_FPWD_001 — Verify submitting the Reset password form with a blank email shows a required-field error

| Field | Value |
|---|---|
| **S.No.** | 27 |
| **Test Case ID** | TST_RESE_TC_6 |
| **Title** | Verify a required-field error is shown when the Reset password form is submitted with a blank e-mail |
| **Linked Requirement** | TC_FPWD_001 — Verify submitting the Reset password form with a blank email shows a required-field error |
| **Type** | Negative |
| **Priority** | Medium |
| **Preconditions** | User is on the "Reset password" screen (Log in → "Forgotten your password?"). |
| **Test Steps** | 1. Leave the Email field empty.<br>2. Click 'Reset password'. |
| **Test Data** | — |
| **Expected Result** | 1. The Email field shows 'This field is required'.<br>2. No reset e-mail is sent; the user stays on the screen. |
| **Remarks** | Source: OnboardingApp_Test_Plan.xlsx.  |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |
| **Automation Scope** | Automate |

---

### Requirement TC_FPWD_002 — Verify submitting the Reset password form with a valid email shows a generic confirmation, without revealing whether the account exists

| Field | Value |
|---|---|
| **S.No.** | 28 |
| **Test Case ID** | TST_RESE_TC_7 |
| **Title** | Verify a generic confirmation is shown when a registered e-mail is submitted for password reset |
| **Linked Requirement** | TC_FPWD_002 — Verify submitting the Reset password form with a valid email shows a generic confirmation, without revealing whether the account exists |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | User is on the "Reset password" screen (Log in → "Forgotten your password?"). |
| **Test Steps** | 1. Enter a registered account's e-mail.<br>2. Click 'Reset password'. |
| **Test Data** | <REGISTERED_ACCOUNT_EMAIL> |
| **Expected Result** | The screen changes to the heading 'Reset password email sent' with the text 'If your email is linked to a Cambridge account, you will receive a link to reset your password. If you don't receive it, please check your junk mail'. |
| **Remarks** | Source: OnboardingApp_Test_Plan.xlsx. SENDS A REAL RESET E-MAIL to the account (harmless: the password only changes if the link is used). Use a Mailsac-inbox account, not a shared login. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |
| **Automation Scope** | Automate |

---

### Requirement TC_FPWD_003 — Verify submitting the Reset password form with an email that has no matching account shows the same generic confirmation message

| Field | Value |
|---|---|
| **S.No.** | 29 |
| **Test Case ID** | TST_RESE_TC_8 |
| **Title** | Verify the same generic confirmation is shown when an unregistered e-mail is submitted for password reset |
| **Linked Requirement** | TC_FPWD_003 — Verify submitting the Reset password form with an email that has no matching account shows the same generic confirmation message |
| **Type** | Negative |
| **Priority** | Medium |
| **Preconditions** | User is on the "Reset password" screen (Log in → "Forgotten your password?"). |
| **Test Steps** | 1. Enter an e-mail that has no Cambridge account.<br>2. Click 'Reset password'. |
| **Test Data** | e.g. 'no-such-user-qa-probe@mailsac.com' |
| **Expected Result** | The same heading 'Reset password email sent' and the same text as for a registered e-mail — nothing reveals that the address has no account. |
| **Remarks** | Source: OnboardingApp_Test_Plan.xlsx. Legend 'Generic reset message': identical by design (no account enumeration), not a bug. 'No reset e-mail is actually sent' can only be checked in the Mailsac inbox. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |
| **Automation Scope** | Automate |

---

### Requirement TC_FPWD_004 — Verify 'Back to login' returns from the Reset password screen to the Log in form

| Field | Value |
|---|---|
| **S.No.** | 30 |
| **Test Case ID** | TST_RESE_TC_4 |
| **Title** | Verify the Log in form is shown again when 'Back to login' is clicked on the Reset password screen |
| **Linked Requirement** | TC_FPWD_004 — Verify 'Back to login' returns from the Reset password screen to the Log in form |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | User is on the "Reset password" screen (Log in → "Forgotten your password?"). |
| **Test Steps** | 1. Click 'Back to login'. |
| **Test Data** | — |
| **Expected Result** | The Log in form is shown again. |
| **Remarks** | Source: OnboardingApp_Test_Plan.xlsx. EXISTING TC reused (ADR-011 — no duplicate function): TST_RESE_TC_4 already clicks Back to login and checks the login page is launched. Phase 1: confirm it asserts this row's Expected Result; extend its assertion if it does not. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |
| **Automation Scope** | Automate |

---

### Requirement TC_FPWD_005 — Verify a user can set a new password via the emailed reset link and log in with the updated password

| Field | Value |
|---|---|
| **S.No.** | 31 |
| **Test Case ID** | TST_RESE_TC_9 |
| **Title** | Verify the user can log in with the new password when it is set through the e-mailed reset link |
| **Linked Requirement** | TC_FPWD_005 — Verify a user can set a new password via the emailed reset link and log in with the updated password |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | A password reset was requested for an account with a Mailsac inbox (Log in → 'Forgotten your password?' → its e-mail → 'Reset password'). |
| **Test Steps** | 1. Open the reset e-mail in the Mailsac inbox.<br>2. Open its reset link.<br>3. Enter a new password.<br>4. Click 'Save and log in' and confirm.<br>5. Click 'Back to login'.<br>6. Log in with the e-mail and the NEW password. |
| **Test Data** | <MAILSAC_ACCOUNT_EMAIL>; a new password meeting the complexity rules. Passwords come from `{{env.*}}` tokens, never plaintext test data (ADR-023). |
| **Expected Result** | The user is logged in and lands on their role's dashboard. |
| **Remarks** | Source: OnboardingApp_Test_Plan.xlsx. CHANGES A REAL ACCOUNT'S PASSWORD — use a disposable account (e.g. one created by the signup suite in the same run), never a shared fixture. Mail handling as mailsacUI.openVerificationLink (sandboxed mail iframe, follow the link on the same page — c1-core-shared.md §A5/§B3). The reset link host may be the same login.comprodls.com host whose thor certificate is expired [ASSUMED — check]. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |
| **Automation Scope** | Automate |

---

### Requirement TC_FPWD_006 — Verify a user can log in with the newly reset password after resetting it via the emailed link

| Field | Value |
|---|---|
| **S.No.** | 32 |
| **Test Case ID** | TST_RESE_TC_10 |
| **Title** | Verify a fresh login succeeds with the newly reset password after logging out |
| **Linked Requirement** | TC_FPWD_006 — Verify a user can log in with the newly reset password after resetting it via the emailed link |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | The account's password was just reset through the e-mailed link (TST_RESE_TC_9). |
| **Test Steps** | 1. Log out if still logged in.<br>2. Click 'Log in'.<br>3. Enter the account's e-mail and the NEW password.<br>4. Click 'Log in'. |
| **Test Data** | Same account as TST_RESE_TC_9, with its new password. |
| **Expected Result** | Login succeeds with the new password. |
| **Remarks** | Source: OnboardingApp_Test_Plan.xlsx. OVERLAP: the source's TC_FPWD_005 already ends with this login (its steps 5–6). Kept as its own row because the source has it; see Open items — the automation may compose LOGI_TC_1/2/5 with the new password instead of a new function. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |
| **Automation Scope** | Automate |

---

## Learner Password Reset (by Staff)

### Requirement TC_RESETPW_001 — Verify a Teacher can set a temporary password for an enrolled student, and the student sets their own new password on first login with it

| Field | Value |
|---|---|
| **S.No.** | 33 |
| **Test Case ID** | TST_CREA_TC_31 |
| **Title** | Verify a Teacher can set a temporary password for an enrolled student from the class roster's 'Change password' |
| **Linked Requirement** | TC_RESETPW_001 — Verify a Teacher can set a temporary password for an enrolled student, and the student sets their own new password on first login with it |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Teacher logged in, on a class with at least one enrolled student (Class data tab). |
| **Test Steps** | 1. Open the 'Options' menu of a student in the roster (Class data tab).<br>2. Click 'Change password'.<br>3. Enter a temporary password and submit. |
| **Test Data** | A temporary password meeting the complexity rules. Passwords come from `{{env.*}}` tokens, never plaintext test data (ADR-023). |
| **Expected Result** | 1. The student's options menu offers 'View profile', 'Activate course material' and 'Change password'.<br>2. 'Change password' opens a 'Change password' page naming the student (name and username), where the temporary password is set.<br>3. Submitting sets it. |
| **Remarks** | Source: OnboardingApp_Test_Plan.xlsx. First half of the source row; the student's first login with the temporary password is TST_LOGI_TC_18. CHANGES A REAL STUDENT'S PASSWORD — disposable student only. Module CREA = the teacher class page object (createNewClass.page.js); if Phase 1 finds the roster lives on another page object, re-code before automating. Confirmation copy after submit is [ASSUMED] (not in the source). |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |
| **Automation Scope** | Automate |

---

| Field | Value |
|---|---|
| **S.No.** | 34 |
| **Test Case ID** | TST_LOGI_TC_18 |
| **Title** | Verify a student who logs in with a temporary password must set a new password before reaching the dashboard |
| **Linked Requirement** | TC_RESETPW_001 — Verify a Teacher can set a temporary password for an enrolled student, and the student sets their own new password on first login with it |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | A staff member (Teacher: TST_CREA_TC_31, or Admin: TST_SPRF_TC_24) has just set a temporary password for the student. |
| **Test Steps** | 1. Log in as the student with the temporary password.<br>2. On the temporary-password screen enter the temporary password, then a new password and its confirmation.<br>3. Submit.<br>4. Log out and log in again with the new password. |
| **Test Data** | The temporary password; a different new password meeting the complexity rules. Passwords come from `{{env.*}}` tokens, never plaintext test data (ADR-023). |
| **Expected Result** | 1. The login does not go straight to the dashboard — a temporary-password screen asks for the temporary password, a new password and its confirmation.<br>2. Submitting a valid new password completes the change and reaches the student's dashboard.<br>3. The student can log in again with the new, self-set password. |
| **Remarks** | Source: OnboardingApp_Test_Plan.xlsx. Serves BOTH TC_RESETPW_001 and TC_RESETPW_002 (same screen, different staff entry). Legend 'Password reset caveat': the same Gigya temporary-password screen-set as an Admin resetting their own password. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |
| **Automation Scope** | Automate |

---

### Requirement TC_RESETPW_002 — Verify an Admin can set a temporary password for a student from the Students tab, and the student sets their own new password on first login with it

| Field | Value |
|---|---|
| **S.No.** | 35 |
| **Test Case ID** | TST_SPRF_TC_24 |
| **Title** | Verify an Admin can set a temporary password for a student from the Students tab row's Action Menu |
| **Linked Requirement** | TC_RESETPW_002 — Verify an Admin can set a temporary password for a student from the Students tab, and the student sets their own new password on first login with it |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | School admin on the Students tab with at least one student in the results. |
| **Test Steps** | 1. Find a student in the results table.<br>2. Open the row's 'Action Menu'.<br>3. Click the option to change/reset the student's password.<br>4. Enter a temporary password and submit. |
| **Test Data** | A disposable student; a temporary password meeting the complexity rules. Passwords come from `{{env.*}}` tokens, never plaintext test data (ADR-023). |
| **Expected Result** | 1. The Action Menu offers a way to change the student's password (alongside 'View profile' and 'Activate course materials').<br>2. Submitting sets the temporary password; the student's next login shows the temporary-password screen (TST_LOGI_TC_18). |
| **Remarks** | Source: OnboardingApp_Test_Plan.xlsx. [ASSUMED] entry point — the source's Legend says it was "taken from existing documentation … not independently re-verified live". OVERLAP to settle in Phase 1: the Students register already has TST_SPRF_TC_8 (admin sets a NEW password via View profile > Manage account > Password tab) and TST_SPRF_TC_23 (learner signs in with it). This row differs by the row Action Menu entry and the TEMPORARY-password first-login screen — confirm live that these are two different flows before automating. CHANGES A REAL STUDENT'S PASSWORD — disposable student only. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |
| **Automation Scope** | Automate |

---

## Sign Up - Role Selection

### Requirement TC_ROLE_001 — Verify the role-selection page shows Learner, Teacher, and Parent options with no role pre-selected

| Field | Value |
|---|---|
| **S.No.** | 36 |
| **Test Case ID** | TST_SNUP_TC_65 |
| **Title** | Verify the role-selection page shows Learner, Teacher and Parent with no role pre-selected and Next disabled |
| **Linked Requirement** | TC_ROLE_001 — Verify the role-selection page shows Learner, Teacher, and Parent options with no role pre-selected |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | User is not logged in; pre-login homepage open. |
| **Test Steps** | 1. Click 'Sign up' (hero link). |
| **Test Data** | — |
| **Expected Result** | 1. Heading 'Sign up', the text 'Select your role', a note that only one role can be chosen per account, and three options: Learner, Teacher, Parent.<br>2. No role is selected and 'Next' cannot be clicked. |
| **Remarks** | Source: OnboardingApp_Test_Plan.xlsx. onboarding.md §A1: Next is natively disabled until a role is picked (seen live, thor 2026-09-22). |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |
| **Automation Scope** | Automate |

---

### Requirement TC_ROLE_002 — Verify selecting a role and clicking 'Next' shows a confirmation dialog naming the selected role

| Field | Value |
|---|---|
| **S.No.** | 37 |
| **Test Case ID** | TST_SNUP_TC_66 |
| **Title** | Verify a confirmation dialog naming the role is shown when a role is selected and 'Next' is clicked |
| **Linked Requirement** | TC_ROLE_002 — Verify selecting a role and clicking 'Next' shows a confirmation dialog naming the selected role |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | User is on the role-selection page (homepage → "Sign up", URL /regoptions). |
| **Test Steps** | 1. Select 'Teacher'.<br>2. Click 'Next'. |
| **Test Data** | Role: 'Teacher' |
| **Expected Result** | A dialog titled 'You cannot change your role later on' states 'You have selected Teacher. Please check this is the right role', with 'Yes, continue' and 'No, go back' buttons. |
| **Remarks** | Source: OnboardingApp_Test_Plan.xlsx. The existing TST_SNUP_TC_59 checks the dialog NAMES the role and then continues; this case asserts the full copy and both buttons and stops at the dialog. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |
| **Automation Scope** | Automate |

---

### Requirement TC_ROLE_003 — Verify 'No, go back' on the role-confirmation dialog closes the dialog and keeps the previously selected role

| Field | Value |
|---|---|
| **S.No.** | 38 |
| **Test Case ID** | TST_SNUP_TC_67 |
| **Title** | Verify the dialog closes and the chosen role stays selected when 'No, go back' is clicked |
| **Linked Requirement** | TC_ROLE_003 — Verify 'No, go back' on the role-confirmation dialog closes the dialog and keeps the previously selected role |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | User is on the role-selection page (homepage → "Sign up", URL /regoptions). |
| **Test Steps** | 1. Select 'Teacher' and click 'Next'.<br>2. Click 'No, go back'. |
| **Test Data** | Role: 'Teacher' |
| **Expected Result** | The dialog closes, the user stays on the role-selection page and 'Teacher' is still selected. |
| **Remarks** | Source: OnboardingApp_Test_Plan.xlsx.  |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |
| **Automation Scope** | Automate |

---

### Requirement TC_ROLE_004 — Verify 'Yes, continue' on the role-confirmation dialog proceeds to that role's registration flow

| Field | Value |
|---|---|
| **S.No.** | 39 |
| **Test Case ID** | TST_SNUP_TC_59 |
| **Title** | Verify the role's registration flow opens when 'Yes, continue' is clicked on the role-confirmation dialog |
| **Linked Requirement** | TC_ROLE_004 — Verify 'Yes, continue' on the role-confirmation dialog proceeds to that role's registration flow |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | User is on the role-selection page (homepage → "Sign up", URL /regoptions). |
| **Test Steps** | 1. Select a role and click 'Next'.<br>2. Click 'Yes, continue'. |
| **Test Data** | Role: 'Parent' (source); data-driven for Teacher / Learner / Parent |
| **Expected Result** | The dialog closes and the role's registration flow opens — Teacher and Parent: the name/e-mail/password form directly; Learner: the age and location step first. |
| **Remarks** | Source: OnboardingApp_Test_Plan.xlsx. EXISTING TC reused (ADR-011 — no duplicate function): TST_SNUP_TC_59 already selects a role, checks the dialog names it, clicks Yes, continue and checks the role's next screen (data: role, expectedScreen) — run it for Parent too. Phase 1: confirm it asserts this row's Expected Result; extend its assertion if it does not. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |
| **Automation Scope** | Automate |

---

### Requirement TC_ROLE_005 — Verify 'Login' on the role-selection page navigates to the Log in form

| Field | Value |
|---|---|
| **S.No.** | 40 |
| **Test Case ID** | TST_SNUP_TC_68 |
| **Title** | Verify the Log in form is shown when 'Login' is clicked on the role-selection page |
| **Linked Requirement** | TC_ROLE_005 — Verify 'Login' on the role-selection page navigates to the Log in form |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | User is on the role-selection page (homepage → "Sign up", URL /regoptions). |
| **Test Steps** | 1. Click 'Login'. |
| **Test Data** | — |
| **Expected Result** | The Log in form is shown. |
| **Remarks** | Source: OnboardingApp_Test_Plan.xlsx.  |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |
| **Automation Scope** | Automate |

---

## Sign Up - Learner

### Requirement TC_LRN_001 — Verify selecting the Learner role leads to an age and location screen before the registration form

| Field | Value |
|---|---|
| **S.No.** | 41 |
| **Test Case ID** | TST_SNUP_TC_69 |
| **Title** | Verify an age and location screen is shown before the registration form when the Learner role is confirmed |
| **Linked Requirement** | TC_LRN_001 — Verify selecting the Learner role leads to an age and location screen before the registration form |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | User is on the role-selection page (homepage → "Sign up", URL /regoptions). |
| **Test Steps** | 1. Select 'Learner' and click 'Next'.<br>2. Click 'Yes, continue'. |
| **Test Data** | — |
| **Expected Result** | An age and location screen with a Location field, a 'Your age' dropdown (options 18+, then 17 down to 5) and a 'Next' button. The name/e-mail/password form is NOT shown yet. |
| **Remarks** | Source: OnboardingApp_Test_Plan.xlsx. URL /learner-age-check (onboarding.md §A2). ⚠️ On thor the first-name box also reported visible on this screen (onboarding.md §A2) — check. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |
| **Automation Scope** | Automate |

---

### Requirement TC_LRN_002 — Verify selecting an under-age value on the Learner age screen blocks self-registration

| Field | Value |
|---|---|
| **S.No.** | 42 |
| **Test Case ID** | TST_SNUP_TC_70 |
| **Title** | Verify self-registration is blocked when an under-age value is chosen on the Learner age screen |
| **Linked Requirement** | TC_LRN_002 — Verify selecting an under-age value on the Learner age screen blocks self-registration |
| **Type** | Negative |
| **Priority** | High |
| **Preconditions** | Learner age and location screen open (TST_SNUP_TC_69). |
| **Test Steps** | 1. Select age 15 or under (e.g. '15' or '13') in 'Your age'.<br>2. Enter location 'India'.<br>3. Click 'Next'. |
| **Test Data** | Age 13–15; Location 'India' |
| **Expected Result** | 1. A 'We're sorry' screen instead of the form: 'Cambridge One welcomes every learner, but our younger students need an adult's help to set up an account' and 'Please ask your parent or teacher to sign you up', with a 'Go back' button.<br>2. No account is created. |
| **Remarks** | Source: OnboardingApp_Test_Plan.xlsx. Legend 'Learner age gate': India blocks 13–15 (source: confirmed live). Side-effect free. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |
| **Automation Scope** | Automate |

---

### Requirement TC_LRN_003 — Verify the Learner under-age threshold depends on the selected Location

| Field | Value |
|---|---|
| **S.No.** | 43 |
| **Test Case ID** | TST_SNUP_TC_71 |
| **Title** | Verify the Learner under-age threshold changes when the Location changes |
| **Linked Requirement** | TC_LRN_003 — Verify the Learner under-age threshold depends on the selected Location |
| **Type** | Edge |
| **Priority** | High |
| **Preconditions** | Learner age and location screen open (TST_SNUP_TC_69). |
| **Test Steps** | 1. Select age '15', location 'India', click 'Next' — note the result.<br>2. Go back; select age '15', location 'United Kingdom', click 'Next' — note the result. |
| **Test Data** | Age '15' + 'India'; age '15' + 'United Kingdom' |
| **Expected Result** | 1. Age 15 + India is blocked by the 'We're sorry' screen.<br>2. Age 15 + United Kingdom is NOT blocked and reaches the registration form. |
| **Remarks** | Source: OnboardingApp_Test_Plan.xlsx. Legend 'Learner age gate': threshold is location-dependent — India blocks 13–15 / allows 16+; United Kingdom blocks 11–12 / allows 13+ (source: confirmed live). Boundary pairs worth adding in Phase 1: India 15/16, UK 12/13. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |
| **Automation Scope** | Automate |

---

### Requirement TC_LRN_004 — Verify selecting an age of 16 or older on the Learner age screen allows the user to proceed to the registration form

| Field | Value |
|---|---|
| **S.No.** | 44 |
| **Test Case ID** | TST_SNUP_TC_63 |
| **Title** | Verify the Learner registration form opens when an age of 16 or older is chosen with location India |
| **Linked Requirement** | TC_LRN_004 — Verify selecting an age of 16 or older on the Learner age screen allows the user to proceed to the registration form |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | Learner age and location screen open (TST_SNUP_TC_69). |
| **Test Steps** | 1. Select age 16 or older (e.g. '16' or '18+').<br>2. Enter location 'India'.<br>3. Click 'Next'. |
| **Test Data** | Age '16' or '18+'; Location 'India' |
| **Expected Result** | The Learner registration form (First name, Last name, School email, Password, Location) is shown — not the 'We're sorry' screen. |
| **Remarks** | Source: OnboardingApp_Test_Plan.xlsx. EXISTING TC reused (ADR-011 — no duplicate function): TST_SNUP_TC_63 already sets country + age and checks the learner profile form opens (LP setup chain). Phase 1: confirm it asserts this row's Expected Result; extend its assertion if it does not. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |
| **Automation Scope** | Automate |

---

### Requirement TC_LRN_005 — Verify a Learner (16+, India) can complete the registration form and create an account

| Field | Value |
|---|---|
| **S.No.** | 45 |
| **Test Case ID** | TST_SNUP_TC_72 |
| **Title** | Verify a Learner (16+, India) account is created and reaches the learner dashboard when the form is submitted and verified |
| **Linked Requirement** | TC_LRN_005 — Verify a Learner (16+, India) can complete the registration form and create an account |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Learner registration form reached: role "Learner" → "Yes, continue" → age 16+ with location "India" → "Next". |
| **Test Steps** | 1. Check the Location field.<br>2. Enter First name, Last name, a School email and a password meeting the complexity rules.<br>3. Check the Privacy notice / Terms of use checkbox.<br>4. Click 'Sign up'.<br>5. Verify the account from the Mailsac e-mail. |
| **Test Data** | Unique <RUN_LEARNER_EMAIL>@mailsac.com ({{run.*}} token, ADR-022); a complexity-compliant password. Passwords come from `{{env.*}}` tokens, never plaintext test data (ADR-023). |
| **Expected Result** | 1. Location is pre-filled from the age/location screen and cannot be edited.<br>2. The account is created and, once verified, the user reaches the learner dashboard. |
| **Remarks** | Source: OnboardingApp_Test_Plan.xlsx. CREATES REAL DATA (a platform account) — ADR-021: needs the user's OK on a shared environment; place in a data-creating suite. Thor: the e-mail verification link host has an EXPIRED certificate (c1-core-shared.md §A4) — the verify step is blocked on thor until renewed; production works. New assertion = the locked, pre-filled Location. Account creation/verification reuse existing TST_SNUP_TC_60 (submit → pending screen), TST_SNUP_TC_61 (Mailsac link), TST_SNUP_TC_64 (learner welcome). |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |
| **Automation Scope** | Automate |

---

### Requirement TC_LRN_006 — Verify the Learner registration form shows validation errors for blank required fields, an invalid email, and a weak password

| Field | Value |
|---|---|
| **S.No.** | 46 |
| **Test Case ID** | TST_SNUP_TC_76 |
| **Title** | Verify validation errors are shown when the Learner form is submitted with blank names, an invalid e-mail and a weak password |
| **Linked Requirement** | TC_LRN_006 — Verify the Learner registration form shows validation errors for blank required fields, an invalid email, and a weak password |
| **Type** | Negative |
| **Priority** | High |
| **Preconditions** | Learner registration form reached: role "Learner" → "Yes, continue" → age 16+ with location "India" → "Next". |
| **Test Steps** | 1. Leave First name and Last name empty.<br>2. Enter 'not-an-email' in School email and move focus away.<br>3. Enter 'abc' as password and move focus away.<br>4. Click 'Sign up'. |
| **Test Data** | School email 'not-an-email'; password 'abc' |
| **Expected Result** | 1. First name and Last name each show 'This field is required'.<br>2. School email shows 'E-mail address is invalid.'<br>3. Password shows 'Password does not meet complexity requirements'.<br>4. No account is created; the user stays on the form. |
| **Remarks** | Source: OnboardingApp_Test_Plan.xlsx. Side-effect free (never submits a valid form). |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |
| **Automation Scope** | Automate |

---

## Sign Up - Teacher

### Requirement TC_TCH_001 — Verify a Teacher can complete the registration form and create an account

| Field | Value |
|---|---|
| **S.No.** | 47 |
| **Test Case ID** | TST_SNUP_TC_73 |
| **Title** | Verify a Teacher account is created and reaches the teacher dashboard when the registration form is submitted and verified |
| **Linked Requirement** | TC_TCH_001 — Verify a Teacher can complete the registration form and create an account |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | User is on the role-selection page (homepage → "Sign up", URL /regoptions). |
| **Test Steps** | 1. Select 'Teacher', click 'Next', click 'Yes, continue'.<br>2. Enter First name, Last name, a Work email and a complexity-compliant password.<br>3. Enter a Location and pick it from the suggestions.<br>4. Check the Privacy notice / Terms of use checkbox.<br>5. Click 'Sign up'.<br>6. Verify the account from the Mailsac e-mail. |
| **Test Data** | Unique <RUN_TEACHER_EMAIL>@mailsac.com ({{run.*}}); Location 'India'. Passwords come from `{{env.*}}` tokens, never plaintext test data (ADR-023). |
| **Expected Result** | 1. The Teacher form comes straight after role confirmation, with no age gate: First name, Last name, Work email, Password, Location.<br>2. The account is created and, once verified, the user reaches the teacher dashboard. |
| **Remarks** | Source: OnboardingApp_Test_Plan.xlsx. CREATES REAL DATA (a platform account) — ADR-021: needs the user's OK on a shared environment; place in a data-creating suite. Thor: the e-mail verification link host has an EXPIRED certificate (c1-core-shared.md §A4) — the verify step is blocked on thor until renewed; production works. New assertion = the Teacher form's fields / no age gate. Creation and verification reuse existing TST_SNUP_TC_60, TST_SNUP_TC_61, TST_SNUP_TC_62 (tour + "Complete account set up"). |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |
| **Automation Scope** | Automate |

---

### Requirement TC_TCH_002 — Verify the Teacher registration form shows validation errors for blank required fields, an invalid email, a weak password, and an unchecked Terms checkbox

| Field | Value |
|---|---|
| **S.No.** | 48 |
| **Test Case ID** | TST_SNUP_TC_77 |
| **Title** | Verify validation errors and the Terms alert are shown when the Teacher form is submitted incomplete |
| **Linked Requirement** | TC_TCH_002 — Verify the Teacher registration form shows validation errors for blank required fields, an invalid email, a weak password, and an unchecked Terms checkbox |
| **Type** | Negative |
| **Priority** | High |
| **Preconditions** | Teacher registration form open (role Teacher → Yes, continue). |
| **Test Steps** | 1. Enter 'not-an-email' in Work email and move focus away.<br>2. Enter 'abc' as password and move focus away.<br>3. Leave First name, Last name and Location empty and the Terms checkbox unchecked.<br>4. Click 'Sign up'. |
| **Test Data** | Work email 'not-an-email'; password 'abc' |
| **Expected Result** | 1. First name, Last name and Location each show 'This field is required'.<br>2. Work email shows 'E-mail address is invalid.'<br>3. Password shows 'Password does not meet complexity requirements'.<br>4. An alert: 'Please confirm that you have read and understood the Terms of use'.<br>5. No account is created; the user stays on the form. |
| **Remarks** | Source: OnboardingApp_Test_Plan.xlsx. Side-effect free. Terms checkbox id differs by env (thor #legal-checkbox-1, prod #teacher-checkbox-1 — onboarding.md §A3). |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |
| **Automation Scope** | Automate |

---

## Sign Up - Parent

### Requirement TC_PAR_001 — Verify a Parent can complete the registration form and create an account

| Field | Value |
|---|---|
| **S.No.** | 49 |
| **Test Case ID** | TST_SNUP_TC_74 |
| **Title** | Verify a Parent account is created and reaches the parent dashboard when the registration form is submitted and verified |
| **Linked Requirement** | TC_PAR_001 — Verify a Parent can complete the registration form and create an account |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | User is on the role-selection page (homepage → "Sign up", URL /regoptions). |
| **Test Steps** | 1. Select 'Parent', click 'Next', click 'Yes, continue'.<br>2. Enter First name, Last name, an Email and a complexity-compliant password.<br>3. Enter a Location and pick it from the suggestions.<br>4. Check the Privacy notice / Terms of use checkbox.<br>5. Check 'I am 18 years of age or older and I am the parent or guardian of any child whose account I set up'.<br>6. Click 'Sign up'.<br>7. Verify the account from the Mailsac e-mail. |
| **Test Data** | Unique <RUN_PARENT_EMAIL>@mailsac.com ({{run.*}}); Location 'India'. Passwords come from `{{env.*}}` tokens, never plaintext test data (ADR-023). |
| **Expected Result** | 1. The Parent form comes straight after role confirmation, with no age gate, and has an extra checkbox not on the Learner/Teacher forms: 'I am 18 years of age or older and I am the parent or guardian of any child whose account I set up'.<br>2. The account is created and, once verified, the user reaches the parent dashboard. |
| **Remarks** | Source: OnboardingApp_Test_Plan.xlsx. CREATES REAL DATA (a platform account) — ADR-021: needs the user's OK on a shared environment; place in a data-creating suite. Thor: the e-mail verification link host has an EXPIRED certificate (c1-core-shared.md §A4) — the verify step is blocked on thor until renewed; production works. Resolves onboarding.md §A2's [ASSUMED] Parent row. Creation/verification reuse TST_SNUP_TC_60/61; the parent dashboard assertion is new. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |
| **Automation Scope** | Automate |

---

### Requirement TC_PAR_002 — Verify the Parent registration form requires the 'parent or guardian' age-confirmation checkbox before submitting

| Field | Value |
|---|---|
| **S.No.** | 50 |
| **Test Case ID** | TST_SNUP_TC_75 |
| **Title** | Verify the Parent form does not submit when the 'parent or guardian' checkbox is left unchecked |
| **Linked Requirement** | TC_PAR_002 — Verify the Parent registration form requires the 'parent or guardian' age-confirmation checkbox before submitting |
| **Type** | Negative |
| **Priority** | High |
| **Preconditions** | Parent registration form open (role Parent → Yes, continue). |
| **Test Steps** | 1. Complete First name, Last name, Email, Password and Location correctly.<br>2. Check the Privacy notice / Terms of use checkbox; leave 'I am 18 years of age or older…' UNCHECKED.<br>3. Click 'Sign up'. |
| **Test Data** | Valid values in every field; guardian checkbox unchecked. |
| **Expected Result** | The form does not submit and no account is created — the user stays on the registration form. |
| **Remarks** | Source: OnboardingApp_Test_Plan.xlsx. Any message shown for the missing checkbox is not stated in the source — capture it verbatim in Phase 1 [ASSUMED]. Side-effect free if the form really does not submit; use a {{run.*}} e-mail anyway in case it does. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |
| **Automation Scope** | Automate |

---

## Parent / Child Account

### Requirement TC_CHLD_001 — Verify a Parent can create a child's account from 'My children'

| Field | Value |
|---|---|
| **S.No.** | 51 |
| **Test Case ID** | TST_PCHD_TC_1 |
| **Title** | Verify a Parent can create a child's account from 'My children' |
| **Linked Requirement** | TC_CHLD_001 — Verify a Parent can create a child's account from 'My children' |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Parent logged in, on the Dashboard (My children). |
| **Test Steps** | 1. Click 'Add child'.<br>2. On 'Create my child's account' enter the child's first name, last name, month and year of birth.<br>3. Check 'I accept the Privacy notice and Terms of use on behalf of my child'.<br>4. Click 'Next'.<br>5. On 'Child's login details' enter a username and password.<br>6. Click 'Create account'. |
| **Test Data** | Child first/last name, month and year of birth; child username + password. Passwords come from `{{env.*}}` tokens, never plaintext test data (ADR-023). |
| **Expected Result** | 1. 'Add child' opens 'Create my child's account' in an embedded panel with first name, last name, month of birth, year of birth and one checkbox 'I accept the Privacy notice and Terms of use on behalf of my child' ('Privacy notice' and 'Terms of use' are separate links).<br>2. 'Next' with everything filled proceeds to 'Child's login details' (username + password).<br>3. 'Create account' shows a confirmation with the new username and password, and the child appears in 'My children'. |
| **Remarks** | Source: OnboardingApp_Test_Plan.xlsx. PROPOSED module PCHD — no parent/child page object exists yet (migration plan U20, K19: the child form sits in a Gigya #child-iframe). CREATES A CHILD ACCOUNT. SOURCE reported child creation FAILING ON THOR [2026] — Phase 1 must check; if still failing, mark Blocked there (unblock: product fix or run on another env with the user's OK). |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |
| **Automation Scope** | Automate |

---

### Requirement TC_CHLD_002 — Verify 'Next' on 'Create my child's account' stays blocked until every required field and the consent checkbox are complete

| Field | Value |
|---|---|
| **S.No.** | 52 |
| **Test Case ID** | TST_PCHD_TC_2 |
| **Title** | Verify 'Next' does not proceed on 'Create my child's account' while a required field or the consent checkbox is missing |
| **Linked Requirement** | TC_CHLD_002 — Verify 'Next' on 'Create my child's account' stays blocked until every required field and the consent checkbox are complete |
| **Type** | Negative |
| **Priority** | Medium |
| **Preconditions** | Parent on 'Create my child's account'. |
| **Test Steps** | 1. Leave first name, last name, month of birth or year of birth empty (one at a time) and click 'Next'.<br>2. Fill every field but leave the consent checkbox unticked and click 'Next'. |
| **Test Data** | — |
| **Expected Result** | 'Next' does not proceed — an inline validation error is shown for the missing field or the checkbox. |
| **Remarks** | Source: OnboardingApp_Test_Plan.xlsx. Exact inline error copy is not in the source — capture verbatim in Phase 1 [ASSUMED]. Side-effect free. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |
| **Automation Scope** | Automate |

---

### Requirement TC_CHLD_003 — Verify a newly created child's account can log in for the first time

| Field | Value |
|---|---|
| **S.No.** | 53 |
| **Test Case ID** | TST_PCHD_TC_3 |
| **Title** | Verify a newly created child's account reaches a learner dashboard when it logs in for the first time |
| **Linked Requirement** | TC_CHLD_003 — Verify a newly created child's account can log in for the first time |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | A child account was just created (TST_PCHD_TC_1); its username and password were noted from the confirmation screen. |
| **Test Steps** | 1. Log out of the Parent account (or use another browser session).<br>2. Click 'Log in'.<br>3. Enter the child's username and password.<br>4. Click 'Log in'. |
| **Test Data** | The just-created child's username + password. |
| **Expected Result** | The child logs in and reaches a learner dashboard. |
| **Remarks** | Source: OnboardingApp_Test_Plan.xlsx. Depends on TST_PCHD_TC_1 in the same run. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |
| **Automation Scope** | Automate |

---

## Class Invite

### Requirement TC_INVITE_001 — Verify a brand-new user invited to a class by a teacher can sign up via the invite email

| Field | Value |
|---|---|
| **S.No.** | 54 |
| **Test Case ID** | TST_INVI_TC_14 |
| **Title** | Verify a not-yet-registered invitee can sign up from the class invite e-mail's 'View invite' link |
| **Linked Requirement** | TC_INVITE_001 — Verify a brand-new user invited to a class by a teacher can sign up via the invite email |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | A Teacher has invited a NOT-yet-registered e-mail to their class (Class data tab → 'Add students' → the e-mail → 'Invite N student(s)'). |
| **Test Steps** | 1. Open the invite e-mail (its subject mentions the class invitation).<br>2. Open its 'View invite' link in a browser that is not logged in.<br>3. Enter First name, Last name and a complexity-compliant password.<br>4. Enter a Location.<br>5. Check 'I accept the Terms of use'.<br>6. Click 'Sign up'. |
| **Test Data** | A fresh <RUN_INVITEE_EMAIL>@mailsac.com ({{run.*}}). Passwords come from `{{env.*}}` tokens, never plaintext test data (ADR-023). |
| **Expected Result** | 1. 'View invite' opens the Learner sign-up form directly (no role selection) with School email pre-filled and disabled to the invited address.<br>2. There is no age-check step and Location is a normal, empty, editable field.<br>3. The Privacy notice section has the same informational text as self-signup, with a single Terms-of-use checkbox.<br>4. Submitting creates the account. |
| **Remarks** | Source: OnboardingApp_Test_Plan.xlsx. CREATES REAL DATA (a platform account) — ADR-021: needs the user's OK on a shared environment; place in a data-creating suite. Needs a teacher + class and an invite (reuse TST_CREA_TC_19–24 for the invite). Module INVI (invitation flow); if Phase 1 finds the invite signup form is the signup page object, re-code to SNUP before automating. Legend: invite signup has NO age gate. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |
| **Automation Scope** | Automate |

---

### Requirement TC_INVITE_002 — Verify an existing, already-registered learner who clicks a class invite link while logged in is taken to their own dashboard

| Field | Value |
|---|---|
| **S.No.** | 55 |
| **Test Case ID** | TST_INVI_TC_15 |
| **Title** | Verify a logged-in, already-registered learner lands on their own dashboard when opening a class invite link |
| **Linked Requirement** | TC_INVITE_002 — Verify an existing, already-registered learner who clicks a class invite link while logged in is taken to their own dashboard |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | A Teacher has invited the e-mail of an existing Learner, who is currently logged in. |
| **Test Steps** | 1. While logged in as that learner, open the 'View invite' link from the invite e-mail. |
| **Test Data** | An existing learner <EXISTING_LEARNER_EMAIL> with a Mailsac inbox. |
| **Expected Result** | The learner is taken directly to their own existing dashboard. |
| **Remarks** | Source: OnboardingApp_Test_Plan.xlsx. Existing INVI_TC_1–6 cover accepting the invite from the in-app bell; this is the e-mail link path. Each run leaves a pending invite in the class (migration plan Q4). |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |
| **Automation Scope** | Automate |

---

## Cross-Cutting

### Requirement TC_XCUT_001 — Verify social sign-in buttons (Facebook, Google, Apple) are present on the Log in form

| Field | Value |
|---|---|
| **S.No.** | 56 |
| **Test Case ID** | TST_LOGI_TC_19 |
| **Title** | Verify the social sign-in buttons (Facebook, Google, Apple) are present on the Log in form |
| **Linked Requirement** | TC_XCUT_001 — Verify social sign-in buttons (Facebook, Google, Apple) are present on the Log in form |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | User is not logged in; pre-login homepage open. |
| **Test Steps** | 1. Click 'Log in' (header or hero). |
| **Test Data** | — |
| **Expected Result** | 'Sign in with Facebook', 'Sign in with Google' and 'Sign in with Apple' buttons are shown on the Log in form. |
| **Remarks** | NOT FOR AUTOMATION — marked RED in the source plan (user, 2026-09-24): third-party identity provider. Manual execution only. Source: OnboardingApp_Test_Plan.xlsx.  |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |
| **Automation Scope** | Manual only — RED in source (not for automation) 🔴 |

---

### Requirement TC_XCUT_002 — Verify social sign-in buttons (Facebook, Google, Apple) are present on the Teacher registration form

| Field | Value |
|---|---|
| **S.No.** | 57 |
| **Test Case ID** | TST_SNUP_TC_79 |
| **Title** | Verify the social sign-in buttons (Facebook, Google, Apple) are present on the Teacher registration form |
| **Linked Requirement** | TC_XCUT_002 — Verify social sign-in buttons (Facebook, Google, Apple) are present on the Teacher registration form |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | User is on the role-selection page (homepage → "Sign up", URL /regoptions). |
| **Test Steps** | 1. Select 'Teacher', click 'Next'.<br>2. Click 'Yes, continue'. |
| **Test Data** | — |
| **Expected Result** | 'Sign in with Facebook', 'Sign in with Google' and 'Sign in with Apple' buttons are shown on the Teacher registration form. |
| **Remarks** | NOT FOR AUTOMATION — marked RED in the source plan (user, 2026-09-24): third-party identity provider. Manual execution only. Source: OnboardingApp_Test_Plan.xlsx.  |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |
| **Automation Scope** | Manual only — RED in source (not for automation) 🔴 |

---

### Requirement TC_XCUT_003 — Verify social sign-in buttons (Facebook, Google, Apple) are present on the Learner registration form

| Field | Value |
|---|---|
| **S.No.** | 58 |
| **Test Case ID** | TST_SNUP_TC_80 |
| **Title** | Verify the social sign-in buttons (Facebook, Google, Apple) are present on the Learner registration form |
| **Linked Requirement** | TC_XCUT_003 — Verify social sign-in buttons (Facebook, Google, Apple) are present on the Learner registration form |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | User is on the role-selection page (homepage → "Sign up", URL /regoptions). |
| **Test Steps** | 1. Select 'Learner', click 'Next'.<br>2. Click 'Yes, continue'.<br>3. Select age 16+ and location 'India', click 'Next'. |
| **Test Data** | Age 16 or 18+; Location 'India' |
| **Expected Result** | 'Sign in with Facebook', 'Sign in with Google' and 'Sign in with Apple' buttons are shown on the Learner registration form. |
| **Remarks** | NOT FOR AUTOMATION — marked RED in the source plan (user, 2026-09-24): third-party identity provider. Manual execution only. Source: OnboardingApp_Test_Plan.xlsx.  |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |
| **Automation Scope** | Manual only — RED in source (not for automation) 🔴 |

---

### Requirement TC_XCUT_004 — Verify social sign-in buttons (Facebook, Google, Apple) are present on the Parent registration form

| Field | Value |
|---|---|
| **S.No.** | 59 |
| **Test Case ID** | TST_SNUP_TC_81 |
| **Title** | Verify the social sign-in buttons (Facebook, Google, Apple) are present on the Parent registration form |
| **Linked Requirement** | TC_XCUT_004 — Verify social sign-in buttons (Facebook, Google, Apple) are present on the Parent registration form |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | User is on the role-selection page (homepage → "Sign up", URL /regoptions). |
| **Test Steps** | 1. Select 'Parent', click 'Next'.<br>2. Click 'Yes, continue'. |
| **Test Data** | — |
| **Expected Result** | 'Sign in with Facebook', 'Sign in with Google' and 'Sign in with Apple' buttons are shown on the Parent registration form. |
| **Remarks** | NOT FOR AUTOMATION — marked RED in the source plan (user, 2026-09-24): third-party identity provider. Manual execution only. Source: OnboardingApp_Test_Plan.xlsx.  |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |
| **Automation Scope** | Manual only — RED in source (not for automation) 🔴 |

---

### Requirement TC_XCUT_005 — Verify 'Sign in with Facebook' opens Facebook's own login page to authenticate

| Field | Value |
|---|---|
| **S.No.** | 60 |
| **Test Case ID** | TST_LOGI_TC_20 |
| **Title** | Verify 'Sign in with Facebook' opens Facebook's login page and signs the user in to Cambridge One |
| **Linked Requirement** | TC_XCUT_005 — Verify 'Sign in with Facebook' opens Facebook's own login page to authenticate |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | User not logged in; a Facebook test account is available. |
| **Test Steps** | 1. Click 'Log in'.<br>2. Click 'Sign in with Facebook'.<br>3. Complete the Facebook login. |
| **Test Data** | <FACEBOOK_TEST_ACCOUNT> |
| **Expected Result** | 1. A new tab opens Facebook's own login page.<br>2. Completing the Facebook login returns the user to Cambridge One, signed in. |
| **Remarks** | NOT FOR AUTOMATION — marked RED in the source plan (user, 2026-09-24): third-party identity provider. Manual execution only. Source: OnboardingApp_Test_Plan.xlsx.  |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |
| **Automation Scope** | Manual only — RED in source (not for automation) 🔴 |

---

### Requirement TC_XCUT_006 — Verify 'Sign in with Google' opens Google's own sign-in page to authenticate

| Field | Value |
|---|---|
| **S.No.** | 61 |
| **Test Case ID** | TST_LOGI_TC_21 |
| **Title** | Verify 'Sign in with Google' opens Google's sign-in page and signs the user in to Cambridge One |
| **Linked Requirement** | TC_XCUT_006 — Verify 'Sign in with Google' opens Google's own sign-in page to authenticate |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | User not logged in; a Google test account is available. |
| **Test Steps** | 1. Click 'Log in'.<br>2. Click 'Sign in with Google'.<br>3. Complete the Google sign-in. |
| **Test Data** | <GOOGLE_TEST_ACCOUNT> |
| **Expected Result** | 1. A new tab opens Google's own sign-in page.<br>2. Completing the Google sign-in returns the user to Cambridge One, signed in. |
| **Remarks** | NOT FOR AUTOMATION — marked RED in the source plan (user, 2026-09-24): third-party identity provider. Manual execution only. Source: OnboardingApp_Test_Plan.xlsx.  |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |
| **Automation Scope** | Manual only — RED in source (not for automation) 🔴 |

---

### Requirement TC_XCUT_007 — Verify 'Sign in with Apple' opens Apple's own sign-in page to authenticate

| Field | Value |
|---|---|
| **S.No.** | 62 |
| **Test Case ID** | TST_LOGI_TC_22 |
| **Title** | Verify 'Sign in with Apple' opens Apple's sign-in page and signs the user in to Cambridge One |
| **Linked Requirement** | TC_XCUT_007 — Verify 'Sign in with Apple' opens Apple's own sign-in page to authenticate |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | User not logged in; an Apple ID for testing is available. |
| **Test Steps** | 1. Click 'Log in'.<br>2. Click 'Sign in with Apple'.<br>3. Complete the Apple sign-in. |
| **Test Data** | <APPLE_TEST_ID> |
| **Expected Result** | 1. A new tab opens Apple's own sign-in page.<br>2. Completing the Apple sign-in returns the user to Cambridge One, signed in. |
| **Remarks** | NOT FOR AUTOMATION — marked RED in the source plan (user, 2026-09-24): third-party identity provider. Manual execution only. Source: OnboardingApp_Test_Plan.xlsx.  |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |
| **Automation Scope** | Manual only — RED in source (not for automation) 🔴 |

---

### Requirement TC_XCUT_008 — Verify 'Have an account already? / Login' on a registration form returns to the Log in page

| Field | Value |
|---|---|
| **S.No.** | 63 |
| **Test Case ID** | TST_SNUP_TC_78 |
| **Title** | Verify the Log in page opens when 'Have an account already? / Login' is clicked on a registration form |
| **Linked Requirement** | TC_XCUT_008 — Verify 'Have an account already? / Login' on a registration form returns to the Log in page |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | Parent registration form open (role Parent → Yes, continue); applies to every role's form. |
| **Test Steps** | 1. Click 'Login'. |
| **Test Data** | Role: 'Parent' (source); data-driven for Teacher / Learner |
| **Expected Result** | The Log in form is shown. |
| **Remarks** | Source: OnboardingApp_Test_Plan.xlsx.  |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |
| **Automation Scope** | Automate |

---

### Requirement TC_XCUT_009 — UI/Colors – Verify there are no unexpected color or UI changes on onboarding pages

_none — not a functional case. A look-and-feel regression check is what the framework's VISUAL layer does (AGENTS.md §8: `visualTest` baselines per TC, Phase 3). Covered by promoting the onboarding TCs above to `visualTest: true` once they are green — decided per TC at Phase 3, not designed as a manual case here._

---

## Open items / `[ASSUMED]` to confirm on the next live pass

1. **No live grounding yet** (all rows): expected results are the source team's. Confirm live in Phase 1, starting with the side-effect-free B1 set.
2. **TST_SPRF_TC_24 entry point** `[ASSUMED]` (source Legend): Students tab row Action Menu → change password. Also settle its overlap with TST_SPRF_TC_8 / TST_SPRF_TC_23 (Manage account → Password tab) — same flow or two?
3. **TST_RESE_TC_10 vs TST_RESE_TC_9**: the source's TC_FPWD_005 already ends with the login that TC_FPWD_006 checks. Keep both, or fold TC_10 into TC_9?
4. **TST_LOGI_TC_9 (lockout)**: lockout duration and the 5th/6th-attempt copy are not in the source; needs a disposable account per run (migration plan Q10).
5. **Copy not stated by the source**: guardian-checkbox error (TST_SNUP_TC_75), child-form inline errors (TST_PCHD_TC_2), teacher Change-password confirmation (TST_CREA_TC_31) — capture verbatim.
6. **Thor blockers carried over**: the verify-link certificate (c1-core-shared.md §A4) blocks TST_SNUP_TC_72/73/74 on thor (and possibly TST_RESE_TC_9 — check the reset-link host); SOURCE reported child creation failing on thor (TST_PCHD_TC_1).
7. **Proposed module PCHD** and the module choice for TST_CREA_TC_31 / TST_INVI_TC_14 — confirm against the page objects Phase 1 actually creates; re-code before automating if they differ.
8. **Footer TCs TST_FOOT_TC_4/6/8** are registered but commented out in `footer.test.js`; they need re-enabling with a new-tab assertion.
9. **TC_XCUT_009 (UI/colours)**: no manual case — handled by `visualTest` promotion at Phase 3 (AGENTS.md §8). Confirm that is acceptable.

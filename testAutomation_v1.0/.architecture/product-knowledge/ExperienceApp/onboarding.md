# Onboarding — signup, e-mail verification, teacher account setup (join a school)

> Screen file (ADR-020). Read `c1-core-shared.md` first.
> Modules: **`SNUP`** (`signup.page.js`, `signup.test.js`) · **`TSET`**
> (`teacherAccountSetup.page.js`, `teacherAccountSetup.test.js`).
> Living document — append, never overwrite; `[ASSUMED]` until seen live.
> *First seeded: [2026-09-22]* — SOURCE playwright-automation-c1 `OnboardingPage` / `DashboardPage`
> + live checks on thor and production.

---

## Part A — Product behaviour

### A1. Role selection — `/regoptions`
- Landing "Sign up" (`[qid="home-1"]`) → role page with **Teacher / Learner / Parent** radios.
- **Next is natively `disabled` until a role is picked** (seen live, thor).
- Next opens a confirm dialog: *"You cannot change your role later on — You have selected
  <Role> — Please check this is the right role"* with **Yes, continue** (`[qid="conf-2"]`) /
  **No, go back**.

### A2. Next screen per role
| Role | URL | Screen |
|---|---|---|
| Teacher | `/register-teacher` | profile form (first/last name, e-mail, password, country, terms) |
| Learner | `/learner-age-check` | country + age gate first (age options `18+`, 17, 16, …) |
| Parent | `[ASSUMED]` profile form + guardian checkbox (SOURCE) | — |

- ⚠️ On thor `/learner-age-check`, the first-name box also reports **visible** — SOURCE assumed it
  hidden there. Unexplained; the learner step (migration Step 6) must re-check. `[2026-09-22]`

### A3. Profile form (Gigya screen-set)
- Stable Gigya ids (same on thor and prod): first `#gigya-textbox-120640165044771760`, last
  `#gigya-textbox-56649036382991330`, password `#gigya-password-56383998600152700`, teacher country
  `#gigya-textbox-82415858032213200` (autocomplete — the text only counts once an option is clicked).
- **Terms checkbox id differs by env**: thor `#legal-checkbox-1`, prod `#teacher-checkbox-1`; both
  carry class `termsCheckbox` → selector `input.termsCheckbox:visible`. `[2026-09-22]`
- **Sign up creates the account** and shows Gigya's verification-pending screen echoing the e-mail.

### A4. Verification
- A mail arrives in the Mailsac inbox within seconds on prod; its link (via `login.comprodls.com`)
  signs the user in and lands on the dashboard. **Thor: link host certificate expired** —
  `c1-core-shared.md` §A4.
- A new teacher lands on the dashboard with a **guided tour** (§A2 of the shared file) and a
  **"Complete account set up"** button (`.start-teaching-container .btn-start-learning`,
  `qid="t-wl-cls-link-1"`).

### A5. Teacher account setup → join a school (`TSET`)
- "Complete account set up" → wizard with its own tour ("Welcome, Teacher (1 of 5)").
- **I teach in a school** `[qid='t-as-cntr-3']` → Next `[qid='t-as-btn-2']` → **Join a school**
  `[qid='t-jso-lbl-1']` → Next `[qid='t-jso-btn-2']` → school key `[qid='t-js-fm-inpt-1']` →
  Join `[qid='t-js-fm-btn-1']` → success screen with **Go to dashboard** (`.content-div-body > .btn`).
- Dashboard then shows the school in `#Active-Section .school-title`; **casing differs by env**
  (SOURCE) — compare case-insensitively, as "contains".
- Joining is **durable** (the teacher stays affiliated).
- SOURCE: prod sometimes answers Join with **"There was a problem on server"** (an alert). Not seen
  in our 2026-09-22 runs (0 occurrences in 3 joins).

### A6. From the team's onboarding test plan `[2026-09-24 — source-stated, not yet seen by us]`
Source: `OnboardingApp_Test_Plan.xlsx` (Legend + cases), now the manual register
`test/Manual/C1App/Onboarding/` (63 TCs). Its team calls the age thresholds "confirmed live"; the
rest is their expected behaviour — treat as `[ASSUMED]` until our Phase 1 sees it.
- **Learner age gate is location-dependent** (refines A2): India blocks 13–15 / allows 16+; United
  Kingdom blocks 11–12 / allows 13+. Age options 18+, then 17 down to 5. Blocked screen "We're sorry"
  + "Please ask your parent or teacher to sign you up" + "Go back". Teacher, Parent and **invite**
  sign-up have no age gate.
- **Parent form** (resolves A2's `[ASSUMED]` row): Teacher-style form + an extra checkbox *"I am 18
  years of age or older and I am the parent or guardian of any child whose account I set up"*; the form
  will not submit without it.
- **Learner form:** Location is pre-filled from the age screen and locked. **Invite sign-up** (e-mail
  "View invite"): Learner form, School email pre-filled + disabled, Location empty and editable.
- **Validation copy:** "This field is required" · "E-mail address is invalid." · "Password does not
  meet complexity requirements" · Terms alert "Please confirm that you have read and understood the
  Terms of use".
- **Login:** blank → "Please enter your username or email address" / "Please enter your password";
  wrong password → "Please check your login and password and try again. You are limited to 5
  attempts, or you can reset your password"; **locked after 5 consecutive failures** — never test on
  a shared account.
- **Reset password:** the "Reset password email sent" confirmation is identical for registered and
  unregistered e-mails (by design, no account enumeration).
- **First-login Terms gate:** a bulk-created adult username account meets "Welcome to Cambridge One"
  + "I accept the Terms of use" + Submit once, on its first login only.
- **Temporary password:** a Teacher (class roster → Options → Change password) or Admin (Students tab →
  Action Menu `[ASSUMED]`) sets one; the student's next login forces a temporary + new + confirm
  password screen before the dashboard.
- **Other sign-in routes:** Support Admin = Okta SSO via `<app URL>/?p=<email>&t=saml` (not the Log in
  form); Edulog = `<app URL>/edulog` (SAML); CambridgeGO = cambridgedev.org/go-dev/ (thor),
  /go-stg/ (other lower envs), cambridge.org/go (prod); Facebook/Google/Apple buttons on the Log in and
  every registration form. **All manual-only** (user, 2026-09-24).

---

## Part B — Automation notes

| TC | What it proves |
|---|---|
| `SNUP_TC_59` | role picked + confirm dialog names it + role's next screen (data: `role`, `expectedScreen`) |
| `SNUP_TC_60` | profile form + terms + Sign up → pending screen shows the same e-mail (**creates the account**) |
| `SNUP_TC_61` | Mailsac mail arrives, link found, lands on the app host |
| `SNUP_TC_62` | tour closed + "Complete account set up" offered (also reused after a fresh login) |
| `TSET_TC_1..4` | wizard opens → join-school path → key joins → header shows the school |

- **WORKAROUND** (user decision 2026-09-22, as SOURCE): `set_schoolKey_join` retries Join up to 5×
  on the server-error alert; every retry is logged and returned as `serverErrors`. To be recorded
  in the manual register. Remove once the product is fixed.
- Type Gigya fields with `addValue` (Invariant 6). Tours: 5 s late-mount budget (shared §B2).
- Numbering: `SNUP_TC_1..58` were retired unbuilt (Q1, 2026-09-22); functional TCs from `TC_59`,
  housekeeping `TC_100+`.

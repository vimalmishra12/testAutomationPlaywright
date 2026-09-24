# C1 core (teacher / learner surface) — shared knowledge

> **Area shared file (ADR-020)** for the non-admin Cambridge One surface: what is true across
> signup, teacher and learner screens. Read this first for any teacher/learner task, then the
> screen file (`onboarding.md`, `teacher-dashboard-class-page.md`, …).
> Living document — append, never overwrite; `[ASSUMED]` until seen live; date updates.
> *First seeded: [2026-09-22]* from the playwright-automation-c1 migration (SOURCE =
> `D:\PlaywriteAutomation_Demo\playwright-automation-c1`) + live runs on thor and production.

---

## Part A — Product behaviour

### A1. Environments used by the migration

| Env | App URL | Notes |
|---|---|---|
| thor | https://micro-nemo.comprodls.com | **Signup verification is broken here** — see A4 |
| production | https://www.cambridgeone.org | Learning Path migration suite runs here (user decision 2026-09-22, cleared with the product team; creates users every run) |

### A2. Guided tours (IntroJS) `[2026-09-22, prod]`
- A new teacher gets an IntroJS guided tour on **every fresh login**, and a second one
  ("Welcome, Teacher (1 of 5)") on the account-setup wizard.
- The tour **mounts ~1.8 s after** the page's own content is ready (measured from a prod trace).
- While it is up it **intercepts pointer events** — any click underneath silently times out.
- Dialog: `.introjs-tooltip` (`qid="s-gtour-cntr-1"`); close: `.introjs-skipbutton`
  (`qid="s-gtour-link-1"`, an `<a>` with a "Close Guided Tour" image).
- `.introjs-overlay` is **not always rendered** — do not use it as the "tour is up" signal
  (SOURCE did; it missed the tour on prod).

### A2b. NPS survey popup `[2026-09-24, prod; rule from the user]`
- `<cg-survey id="cg-survey-popup" surveytype="POP_UP" … touchpoint "ELT NPS Cambridge One">` — shown on a user's
  **THIRD login in the SAME browser**, then remembered in that browser for **30 days**; it appears **~10 s AFTER
  login** (user, 2026-09-24) — so it can land mid-flow, over whatever the user is doing. While up it **intercepts
  pointer events** (seen once blocking a click in a probe).
- **The framework never meets it:** every suite gets a FRESH browser context (no storage carried over), so each
  login is that browser's first. Only a persistent profile (e.g. a probe script reusing a user-data dir, or a
  manual tester's own browser) reaches the third login. No handler is built — its close control was not
  captured (it did not re-appear, as expected from the 30-day cache). Build one only if a suite ever keeps storage.

### A3. Cookie banner
- Thor/prod landing shows a custom banner (`[qid="cookies-2"]`, "Accept cookies"); the login
  page can show it too. `login.acceptCookies()` (used by `TST_LOGI_TC_5`) handles it.
- SOURCE also handles a OneTrust banner (`#onetrust-accept-btn-handler`) — not seen in our runs `[ASSUMED]`.

### A4. Signup e-mail verification link — thor certificate is EXPIRED `[2026-09-22]`
- The verification mail's link goes to **`https://login.comprodls.com/accounts.verifyEmail?...`**.
- On thor that host's TLS certificate **expired on 10 Apr 2022** (`CERT_HAS_EXPIRED`); a browser
  refuses the page (`ERR_CERT_DATE_INVALID`). A real user on thor gets a security warning.
- SOURCE never saw this: its config sets `ignoreHTTPSErrors: true` globally.
- **Status:** reported to the user 2026-09-22; not yet raised with devops. Production's link works.
  Until renewed, any thor suite that verifies a new account is **Blocked** at the verify step.

### A5. Mailsac (shared inbox service)
- Account `comproqatest21@gmail.com` (credentials in the suites' test data) — shared with BCEV.
- Any `<name>@mailsac.com` inbox is reachable at `https://mailsac.com/inbox/<address>`.
- The mail body is rendered in a **sandboxed iframe** `iframe[title="Email HTML preview"]` that may
  only open popups — clicking a link in it can never navigate in place. There is also an unrelated
  Stripe iframe, so never use a bare `iframe` selector.
- "Unblock Content" (`a.btn-outline-info`) is a `target=_blank` link to the unblocked view.
- Inboxes are shared across runs — match mails by text, never by row position.

---

## Part B — Automation notes

### B1. Run-generated users (ADR-022)
Suites that need a fresh teacher/learner/class use `{{run.<key>}}` tokens in test data; patterns
live in `testcaseData/ExperienceApp/<env>/runValues.json`; the run's values are written to
`runtime/lastRun.json` (gitignored) and can be reused next run as `{{last.<key>}}`.
`{{run.*}}` only links suites **inside one exec file**. Proven 2026-09-22: the same generated
e-mail reached `SNUP_TC_60/61` and the unchanged `LOGI_TC_1/2` in later suites; a class key read
by a page object (`runContext.set`) landed in `lastRun.json`.

**Debug without new users** `[2026-09-22]`: `--runData=last` + a one-suite exec file
(`learningPathDebug.json`) — see ADR-022 amendment. Full suite only once everything passes.

### B2. Tours in page objects
Wait up to **5 s** (measured 1.8 s + margin) for `.introjs-tooltip` before deciding there is no
tour, close it, and confirm it is hidden. Implemented in `dashboard.close_introTourIfShown()`,
`dashboard.dismiss_introTour_getTeacherSetupPrompt()` and `teacherAccountSetup` (`closeIntroTourIfShown`).

### B3. Mailsac verification link
`mailsacUI.openVerificationLink(email)`: poll the inbox (bounded, reload) for a row matching
`/verif/i` → open it → follow **Unblock Content by its href** → read the link `href` inside the mail
iframe → load it in the **same tab** (no popup) → wait for the app host. Arrival on prod ≈ seconds.

### B4. Data created by the migration suites (ADR-021 §8 registry)

| Suite | Creates per run | Name pattern | Cleanup |
|---|---|---|---|
| `learningPathTest_prod` (Suites 1–7, full run) | 1 teacher (verified) + its affiliation to MQA Sierra School, 1 class, 1 learner (verified) + its class membership and Learning Path progress | `cqaprodlpteach_<rand4>@mailsac.com`, `Class <rand4>`, `cqaprodlplearn_<rand4>@mailsac.com` | none — accepted by the user (as SOURCE) |
| `learningPathDebug.json` + `--runData=last` | **nothing new** — reuses `lastRun.json` users (only progress/invite state moves) | — | — |
| `learningPathTest_thor` (blocked at A4) | 1 unverified teacher per attempt | `cqathorlpteach_<rand4>@mailsac.com` | none |

Fixed data used as-is from SOURCE: prod school **MQA Sierra School** `MQA-ABC-DEF`; thor school
"ankur test school A (DO NOT USE)" `DNK-CMF-MYN`; product `cqaautomationbundle1`.

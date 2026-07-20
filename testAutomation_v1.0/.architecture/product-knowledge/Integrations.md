# Product Knowledge — Integrations (Blackboard + LTI)

> **Living document.** Append, never overwrite. One section per app, keyed by
> its subdomain URL. Mark anything not verified on the live app as `[ASSUMED]`
> and promote to confirmed once observed. Date significant updates with
> `[YYYY-MM-DD]`.
>
> **Scope:** LMS integrations (appType `Blackboard`, paths under `Integrations/`) —
> Blackboard Ultra + the Cambridge One LTI pages it launches. A future LMS
> integration (e.g. Moodle) appends its own `## APP:` section here. Usage rules,
> the per-app template, and the app→file map live in the index:
> `../product-knowledge.md` (split per application — ADR-018).

---

## APP: Blackboard / LTI  (cup-test.blackboard.com)

**appType:** `Blackboard`  
**Selector namespaces:** `css.Blackboard` (BB UI) + `css.LTI` (shared LTI pages)  
**Purpose:** Blackboard Ultra LMS — automates the LTI 1.3 integration between Blackboard
and the Cambridge One teacher dashboard.

*First seeded: [2026-06-26]*

### Environment URLs

| Environment | URL |
|---|---|
| Thor (shared BB sandbox) | https://cup-test.blackboard.com/ultra/course |
| QA / Rel / Production | TBD — not provisioned yet |

### Credentials & test data (Thor)

- Login user (LTI tests): `BB.login.ltiTeacher` → `thornodeepltiteacher / Compro11`
  - **Always use `ltiTeacher` for IP1 and IP2.** Using a different account causes a timeout at
    `TST_BBIP1_TC_1` because the account lacks LTI entitlements to see the Content Market / LTI tool.
- Deeplink login users (IP3/IP4): `BB.login.ltiDeeplinkTeacher` → `thortestltiteacher / Compro11`
  (teacher), `BB.login.ltiStudent` → `thortestltistudent / Compro11` (student).
- Course: `testcourse_2` → data key `BB.course.testautocourse`; deeplink course key
  `BB.course.deeplinkCourse`.
- Deeplink activities: `BB.deeplink.pe` / `BB.deeplink.ebook` (deeplink item names, e.g.
  `"LTI Test (DO NOT CHANGE), autoltipe, Unit 1"`).
- LTI product: `"LTI Test (DO NOT CHANGE)"` — a sentinel fixture; do not rename or delete it
  in the Blackboard sandbox.

### LTI launch flow — three integration points

**IP1 — Teacher Dashboard launch:**
1. Login as `thornodeepltiteacher`
2. Navigate to `testcourse_2` → click course card
3. BB course page → click `+` (Add Content) → Content Market
4. Content Market → click `Cambridge One DEV Dashboard` link
5. A **new browser tab** opens carrying the LTI teacher dashboard (`.lti-dashboard-container`)
6. `global.page` is swapped to the new tab; the old tab remains open on `global.__pwContext`

**IP2 — Component launch (runs after IP1):**
- From the LTI teacher dashboard, each component lives under an umbrella product card (`.product`).
  Click the component link (`.prod-clickable`).
- **PE component** (`autoltipe`) → opens in-place at `/teacher/…` URL. Assert: back button, TOC,
  TOC heading, lesson items, activity iframe. Return to dashboard via `browser.url(dashboardUrl)`.
- **Ebook component** (`LTI Ebook`) → navigates directly to `/foc/…` URL (bypasses
  `.product-launch-container`). Assert: ebook guard (`student.book`), toolbar (`.toolbar-wrapper`),
  `/foc/` in URL. Return to dashboard via `browser.url(dashboardUrl)`.

**IP3 (teacher) / IP4 (student) — Deeplink launch (from Course Content, bypasses the dashboard):**
Deeplinks are Cambridge One activities placed directly on the Blackboard **Course Content** page
(`deepLinkItem` = `h3 a[href='#']`), named `"Product, Component, Unit"`. Clicking one launches the
activity in a **new tab**.
- **Teacher (IP3):** click → `lti-onboarding` opens in a new tab → redirects **in-tab** to the
  content (no second tab). PE lands on the learner/teacher activity page; ebook lands on `/foc/`.
  No intermediate panel. `bbCoursePage.click_deeplink()` handles the tab capture + onboarding wait.
- **Student PE (IP4):** click → an **intermediate detail panel** renders in the same tab
  (`.root-learning-module-panel` + heading + a Launch button; URL `**/outline/lti/launch**`). Click
  **Launch** → new tab with the PE activity. (`click_deeplink_student` → `launch_from_detailPanel`.)
- **Student ebook (IP4):** **direct launch** into a new tab (no panel) — same end-state as the
  teacher ebook flow, so it reuses the teacher direct-launch TC (`TST_BBIP3_TC_3`).
- **Role signal:** on the PE deeplink page, the **student** TOC retains prior progress and renders
  `.activity-score` badges (e.g. `"88%"`); the **teacher** view shows none. The URL also encodes
  role: `/learner/` (student) vs `/teacher/`. The PE TOC is **collapsed by default** — expand via
  the hamburger (`img.toc-hamburger-btn`) before reading scores.
- **Return:** `bbCoursePage.returnToCourseContent()` closes the launched tab and refocuses the
  Course Content tab.
- **PE and ebook deeplinks are verified sequentially** (single active `global.page`): the PE tab is
  closed before the ebook deeplink opens. Only independent element reads *within* one verification
  TC run in parallel (`Promise.all`).

### Page objects (all under `pages/Integrations/`)

| Page object | Responsibility |
|---|---|
| `Blackboard/bbLogin.page.js` | Cookies banner, username, password, sign-in |
| `Blackboard/bbCourse.page.js` | Course listing, click course card |
| `Blackboard/bbCoursePage.page.js` | BB course page → Content Market → LTI tool click; new-tab switch. **Deeplink:** `_openDeeplinkItem`, `click_deeplink` (teacher direct), `click_deeplink_student` (detail panel), `launch_from_detailPanel`, `returnToCourseContent` |
| `LTI/ltiTeacherDashboard.page.js` | Dashboard guard, content verify, component click, return-to-dashboard |
| `LTI/ltiComponentPage.page.js` | Component page guard (race: `.product-launch-container` OR `/foc/` URL), ebook state (guard, toolbar, back button, `/foc/`) |
| `LTI/ltiPEPage.page.js` | PE state: back button, teacher-mode URL, TOC, TOC items, activity iframe |
| `LTI/ltiDeeplinkPage.page.js` | **Deeplink** PE page: `isInitialized` (iframe guard), `getData_peDeeplinkState` (iframe/back-btn/url), `expand_peToc` (hamburger, toggle-guarded), `getData_peTocScores` (`.activity-score`). Reuses `css.LTI.ltiPEPage` selectors |

### Test files

| Test file | TC IDs | Notes |
|---|---|---|
| `test/Integrations/Blackboard/bbLogin.test.js` | TST_BBLG_TC_1..4 | Login steps |
| `test/Integrations/Blackboard/bbCourse.test.js` | TST_BBCN_TC_1 | Course navigation |
| `test/Integrations/Blackboard/bbLtiTeacherDashboard.test.js` | TST_BBIP1_TC_1, TST_BBIP1_TC_2 | IP1 dashboard launch + content verify |
| `test/Integrations/LTI/ltiTeacherComponent.test.js` | TST_LTI_IP2_TC_1, TST_LTI_IP2_TC_2 | IP2 component launches (PE + Ebook) |
| `test/Integrations/Blackboard/bbDeeplink.test.js` | TST_BBIP3_TC_1..3 (teacher), TST_BBIP4_TC_1..3 (student PE) | Deeplink open/launch/return actions. Registered in `BlackboardTCRepository.json` |
| `test/Integrations/LTI/ltiDeeplink.test.js` | TST_LTI_PEDL_TC_1 (teacher), TST_LTI_PEDL_TC_2 (student), TST_LTI_EBKDL_TC_1 | Deeplink page verification. Registered in `LTITCRepository.json` (→ `LTISelectors.json`) |

Exec files: `teacher/studentDeeplinkLaunch_thor.json` — each lists **both** TC repos
(`BlackboardTCRepository` + `LTITCRepository`), interleaving BB action TCs and LTI verification TCs.

### Known quirks

- **`TST_BBIP1_TC_1` uses `global.__pwContext.waitForEvent("page")`** inside `bbCoursePage.click_ltiTool()`
  to capture the new tab. This is a deliberate raw `global.__pwContext.*` call — no action-library
  method exists for new-tab detection. `global.page` is mutated on success.
- **`ltiComponentPage.isInitialized()`** uses `Promise.race([action.waitForDisplayed(...), action.waitForUrl(...)])` —
  two different signals because Ebook goes straight to `/foc/` while PE stops at `.product-launch-container`.
  Both branches go through the action library (`waitForUrl`/`waitForLoadState` were added to
  `baseActionLibrary.js`), so this is not a raw escape (ADR-015C).
- **Teacher-mode URL check:** `browser.getUrl().includes('/teacher/')` — verifies the LTI context
  passed teacher mode correctly (not student mode). Read via the `browser.getUrl()` WDIO-compat
  wrapper, not raw `global.page.url()`.
- **Return to dashboard:** `browser.url(dashboardUrl)` — the LTI component pages have no
  conventional back button to the Blackboard-embedded dashboard; URL navigation is the only reliable
  return path. Capture `var dashboardUrl = await browser.getUrl()` before clicking a component, because
  the URL changes once inside a component.
- **`TST_BBIP1_TC_2` — `courseDurationText` assertion removed:** the duration value shifts by a
  day between the stored test data and the live dashboard, making it inherently flaky. The remaining
  four checks (course title, school name, product name, action buttons) are unaffected.
- **Teacher dashboard shell vs. content — slow integration load [confirmed 2026-06-26]:** the
  LTI launch lands on `lti-tool-dev.comprodls.com/v1/lti/launch` (an OIDC handshake spinner) and
  then swaps the dashboard SPA in place — **the URL never changes off `/lti/launch`**. The shell
  (`.lti-dashboard-container`, Cambridge header + footer) renders almost immediately, but the
  course content (course title, school, product, action buttons) is fetched over the LTI
  integration and is **slow** — an in-shell spinner `.lti-dashboard-container .loader-wrapper`
  covers a blank grey content area until it arrives. Using `.lti-dashboard-container` alone as the
  ready-guard is a **false positive** (matches the shell while content is still loading), which
  made `TST_BBIP1_TC_2`'s content selectors (`h1.class-name`, `div.space-title`, `h3.bundle-name`)
  intermittently find nothing. Fix: `ltiTeacherDashboard.isInitialized()` waits for the guard to
  appear AND then for `loaderWrapper` to go hidden (reverse `waitForDisplayed`, 120s) before the
  dashboard is considered ready. The content selectors themselves were always correct.
- **Deeplink new-tab + `lti-onboarding` redirect chain:** a deeplink click opens `lti-onboarding`
  in a **new tab**, which then redirects **in-tab** to the content URL (no second tab spawns). The
  page objects capture the tab via `action.switchToNewTab()` then `action.waitForUrl(url => !url
  .includes('/lti-onboarding/'))` to await the in-tab redirect. New-tab readiness uses
  `domcontentloaded`, not `load` (ADR-017A).
- **Student ebook deeplink launches directly** (no detail panel), unlike the student **PE** deeplink
  which shows `.root-learning-module-panel` + a Launch button first. An early draft wrongly modelled
  ebook as panel-based (`TST_BBIP4_TC_4/5`); those were removed and the student ebook path now reuses
  the teacher direct-launch TC (`TST_BBIP3_TC_3`).
- **PE deeplink TOC is collapsed by default** — `.activity-score` badges aren't in the DOM until the
  TOC is expanded via `img.toc-hamburger-btn`. `expand_peToc` is toggle-guarded (skips the click if
  the accordion is already visible) so it never collapses an open TOC.
- **Role signal on the PE deeplink page:** student shows `.activity-score` badges (retained
  progress); teacher shows none. The teacher score-absence check uses a short timeout (no score will
  ever appear) to avoid a full stall.
- **Selector wiring (ADR-015A compliant):** `css.LTI` lives **only** in `LTISelectors.json`; the
  deeplink LTI TCs are in `LTITCRepository.json`; the exec files list **both** TC repos. This works
  because each page object is required by test files of a single namespace (BB vs LTI), so it caches
  the correct `selectorDir`. Do **not** mirror `css.LTI` into `BlackboardSelectors.json` — an early
  deeplink draft did, which silently resolved a selector to `undefined`; it was removed.

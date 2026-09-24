# Learning Path player (Practice Extra) — learner

> Screen file (ADR-020). Read `c1-core-shared.md` first.
> Module **`PEXT`** (`practiceExtra.page.js`, `practiceExtra.test.js`); entry click `DASH_TC_14`
> (`dashboard.page.js`). Manual register: `test/Manual/C1App/LearningPath/`.
> Living document — append, never overwrite; `[ASSUMED]` until seen live.
> *First seeded: [2026-09-22]* — SOURCE playwright-automation-c1 `LearningpathPage` / `DashboardPage`,
> then verified on production (debug runs on learner `_ajq1`, full first-time run on learner `_jqh2`).

---

## Part A — Product behaviour

### A1. Entry
- Learner dashboard → the **class card** → its **"Practice Extra"** tile (`.component-container` inside
  `div.class-card-container`). Once a product is active, other class cards can list the same component,
  so the tile is found inside the NAMED card.
- SOURCE: a learner's first launch can show *"We're setting up the learning materials for you"*
  (≤ ~3 min on thor). **Not observed on production** — a first entry opened the player in ~9 s.
- With a School Level Licence the learner reaches it with **no activation code** (`DASH_TC_13`).

### A2. Player page
- Activity iframe `div#content-course-ext iframe`.
- **Check** `a.green-btn` and **Next** `a[title='Next']` are on the **OUTER page**, not in the iframe.
- The result line `p.score` is also on the outer page: *"You scored 4 out of 4"* (SOURCE saw
  "Amazing! You scored 4 out of 4").
- The open-sidebar breadcrumb (`a.open-sidebar-btn`, `#selectedActivitySidebarBtn`, qid
  `lo-renderer-toggle-btn-9`) carries the current activity as its `title`, e.g.
  `BASE04_Dropdown_Scorable.zip` — a cheap way to see where a learner will resume.

### A3. TOC sidebar `[2026-09-22, prod]`
- `div.sidebar.bg-white`; **stays in the DOM when closed** (the app adds `d-none`) → check visibility,
  never presence.
- **Opens by itself only on a learner's FIRST entry** (unit view). Later entries start closed.
- **Two views, two close buttons:** unit view `#unitViewCrossBtn`, lesson view (opened from the
  breadcrumb) `#lessonViewCrossBtn`. Both are `a.close-sidebar[aria-label='Close table of contents']`.
  SOURCE's `.unit-view-header a.close-sidebar` **no longer exists**.
- While open it overlaps the activity and **covers the open-sidebar button** (clicks on it are intercepted).

### A4. Scorable activity (cqaautomationbundle1, `BASE04_Dropdown_Scorable.zip`)
- 4 frames (`#content_wrap_0…3`, content `#content-0…3`), each with rich dropdowns (`.rich-dropdown`):
  frames 1–2 one each, frames 3–4 four each **with the same option texts**.
- Answers (content-specific, from SOURCE): frames 1/2 "is doing"; frames 3/4 "in the middle of the
  country", "I found a job at a big", "six months ago", "also a little scary sometimes".
- A chosen answer marks `.wrapper-dropdown.filled` — observed on **all four frames** (incl. 1 and 2).
- **A rich dropdown closes when the page scrolls** — clicking an option with a normal (scroll-first) click
  loses it (SOURCE, confirmed by our design; `clickAtCenter` passes first time).
- **One attempt per learner.** Progress is saved as you go; re-entry resumes at the next activity
  (Flashcards) and a finished or half-finished scorable is not offered fresh again.

### A5. TOC structure and navigation `[2026-09-23, prod — learner _uyu7]`
- cqaautomationbundle1's TOC has **three levels**: Unit 1 → Lesson 1 → five activities, in order
  `BASE04_Dropdown_Scorable.zip`, `Flashcards.zip`, `PS`, `Non-scorable HTML activity`, `test pdf`.
  (So the product DOES carry an HTML and a PDF activity — the batch-2 design assumed it did not; see LP-021/022.)
- **Unit view**: header = product name, close `#unitViewCrossBtn`, one row per unit `.unit-level-item`
  ("Unit 1 · 1/4 Completed"). Clicking a unit opens its **lesson view**.
- **Lesson view**: header "Unit 1", close `#lessonViewCrossBtn`, a Bootstrap accordion per lesson
  (`.accordian-heading a.toggable-btn`) listing `a.activity-name-container` rows (`span[title=<name>]`,
  status icon with aria-label: "Completed above target", "in progress", "viewed", "evaluation pending",
  "Not started"). "Go to unit view" = `#lessonViewBackBtn` — a SECOND link with that aria-label sits in the
  header but is covered by `#lessonViewBackBtn` (clicks on it are intercepted).
- The open control (`#selectedActivitySidebarBtn`, title = current activity) opens the **lesson view** of the
  current activity on every entry but the first.
- **The open control is a TOGGLE.** While the TOC is open the sidebar covers it for a mouse; from the
  keyboard (focus + Enter) it CLOSES the TOC, and again re-opens it. Only one sidebar element ever exists.
- **Opening an activity from the TOC leaves the TOC open.**
- **`#lessonViewCrossBtn` closes the TOC only** — the learner stays on the same activity in the Learning
  Path. The way OUT is the player's **Back** link (`a.back-btn`, qid `lo-renderer-bck-btn`) →
  `/dashboard/learner/dashboard`.
- Re-entry resumes at the **last activity opened** (not necessarily the next one in order).

### A6. Flashcards (non-scorable) `[2026-09-23, prod]`
- In the iframe: `ul.progress-bar li.step` × 6, current card `li.step.current`. Outer page: `Next`
  (`a[title='Next']`), and `Previous` (`a[title='Previous']`) after the first card; on the LAST card the bar
  shows "Previous" + "NEXT ACTIVITY", and that click moves on to the next activity (PS).
- **No grading control** at any point: outer `a.green-btn` absent, in-activity `a.btn-check` hidden.
- **The deck remembers the learner's position** across entries.
- **A Next click within ~1.8 s of the previous card change is IGNORED** (≥ 2.0 s always accepted — measured
  in 16 trials); nothing observable (class, aria, animation) marks the end of that window.

### A7. Practice Set (PS) `[2026-09-23, prod]`
- **NOT in the activity iframe** — rendered on the outer page: instructions, "Answer:" Quill editor
  `.ql-editor[aria-label='PS Answer']`, B/I/U toolbar, `p.word-count` ("Word count: 0"), **Save**
  `#saveAnswer-productiveSkill-btn` and **Submit** `#submitAnswer-productiveSkill-btn`.
- **Empty editor → Submit is `class="btn disabled"`** (CSS only, no `disabled` attribute); a click opens no
  dialog and submits nothing. Typing enables it ("btn").
- Submit → **"Ready to submit?"** (`#exampleModal`, title `#readyToSubmitLabel`): "Just so you know, it
  won't be possible to make any changes to your work after it's submitted" — Cancel
  `#cancelModal1-productiveSkill-btn`, Submit `#submitModal-productiveSkill-btn`.
- The SAME modal element also carries a **"Your class hasn't started yet"** variant (`#notStartedLabel`,
  Cancel/Save only) — pre-rendered, so reading `#exampleModal` before Submit shows the wrong variant.
  A class created today (default start date) HAS started: the ready-to-submit variant opens.
- After submit: `div.attempted-answer` shows the answer read-only; editor and Submit are removed; the TOC row
  reads "Activity status: evaluation pending". Revisiting shows the same.
- Other pre-rendered PS modals: `#changesNotSavedModal` ("We're unable to submit your work…", "Last saved
  690 months ago" placeholder), `#pskill-GroupInfoModal`, `#addLinkModal`.
- **Fixed-position modals have no `offsetParent`** — a DOM-side `offsetParent !== null` visibility check
  reports an open modal as hidden; use the action library's `isDisplayed`/`waitForDisplayed`.

### A8. Launch and dashboard `[2026-09-23, prod]`
- The Practice Extra tile of an SLE class reads "Practice Extra / Continue learning"; **no expiry date** on
  the tile or the class card (dates on the card are the class's start → end, e.g. "Sep 23, 2026 → Sep 22, 2027").
- Launch shows a **spinner** `div.loader` from ~0.2 s to ~1.1 s after the click, then the player — **no
  progress bar** (the scenario sheet's "progress bar" was not observed).
- **A learner with a pending invite and no class never sees the dashboard** — login routes straight to
  "Invitations (1)" (`/dashboard/invitation/…`, the class listed, Accept disabled until ticked). LP-020
  (`DASH_TC_15`) asserts that landing; a check for the learner dashboard times out. `[2026-09-23, prod full run]`
### A9. Scorable, HTML and PDF — single-learner facts `[2026-09-23, prod — fresh learner _5an7]`
- **Nothing chosen → no Check button at all** (`a.green-btn` renders on the first selection). So an "empty
  check" (LP-013) is impossible and consumes nothing.
- **A half-done scorable** (frame 1 checked): TOC status "Activity status: in progress" (the sheet's "Saved"
  = re-landing where the learner left — user 2026-09-23). Reopening it from the TOC lands on the checked
  frame with its answer kept (`.rich-dropdown.checked-correct`) and Next offered; frames 2–4 then finish
  at "You scored 4 out of 4". So LP-013 + LP-025 run INSIDE the one attempt (Suite 7), no second learner.
- **HTML activity** ("Non-scorable HTML activity"): loads in the iframe; TOC status "Activity status:
  viewed" ~1.5 s after opening — no submit. "viewed" = completed for non-scorables: it counts in the unit's
  "N/4 Completed" (`.unit-level-item .unit-progress`; the PS counts only once evaluated, the PDF not at all).
- **After a non-scorable, the outer bar shows NEXT ACTIVITY** (`a.btn.nextActivityBtn`, no `title`).
- **"test pdf"** (TOC: "Downloadable item"): landing on it (e.g. NEXT ACTIVITY from the HTML activity) shows a
  **download page** `#content-course-download` — "Download the test pdf below and complete this activity",
  `Sample1.pdf`, a Download link (`a.download-link[download]`) — NOT the PDF, and NO download starts.
  Landing marks it "Activity status: viewed" (user-confirmed expected, 2026-09-23). The suite never clicks Download.
- The TOC open control reopens the **last view shown** (unit or lesson) — reset with `TST_PEXT_TC_102`.

### A10. Teacher / admin entry points (preview) `[2026-09-23, prod]`
| Entry | Route after launch | TOC mode |
|---|---|---|
| Class → Materials (`cView-45`) → component (`cView-73-<b>-<c>`, by name) | `/learning-path/teacher/…/class/<id>/product/…/item/…` | normal (unit view on 1st entry) |
| Class → Assignments (`cView-44`) → Create assignment (`rView-5`) → `a.component-item` by name | `…/assignments/product/…` | assignment: `h2.unit-name`, Cancel `pAssignment-9` / Next `pAssignment-6` |
| Materials → Manage student access (`manageaccess-<n>`) → Create access rule (`ma-create-access-rule-btn`) → component | `…/product/…/create-access` | rule: "Select all units" (visible control = `div[role=checkbox]` wrapper; its `<label>` is sr-only, width 0), Cancel/Continue `create-rules-btn-1/2` |
| Dashboard → My library (`/dashboard/teacher/library`) → search `#tLibSearch` + Enter → title `#myLibraryAllCourseMaterialBundleTitle<id>` (EXPANDS the card) → `#view-details-link-<id>` | materials view `/dashboard/teacher/org_<slug>/bundle/<id>/view` → tile → `/learning-path/teacher/…/product/…` | normal |
| Admin (prod `prod_admin_mqa@yopmail.com`, single-school → lands in MQA) → LIBRARY → search → row → "See materials" → tile | same materials view → `/learning-path/teacher/…/product/…` | normal |
- **The TOC opens by itself only on a user's FIRST entry** (teachers/admins too) — a second launch starts
  closed; `getData_teacherPlayer` opens it with the player control when closed.
- ⚠️ **The materials view (Vue/Nuxt) is SERVER-RENDERED**: tiles are visible while `document.readyState` is
  still "loading", and a click then is **silently ignored** (measured: 2 of 8 immediate clicks, both while
  "loading"; every click after "complete" navigated). `umbrellaProduct.launch_componentByName` waits for the
  document load first — this cost 3 debug runs of "flaky" failures.
- **A teacher/admin preview does NOT create learner progress** (user-confirmed 2026-09-23).
- Nothing is saved on any teacher path: Next/Assign and Continue are never clicked; each is its own suite
  (fresh browser context), so an unfinished assignment/rule is discarded with the context.

### A11. Progress views for submitted activities (module PROG) `[2026-09-23, prod — learner _xov9 / teacher _osgr]`
- **Learner:** class card "My progress" (`l-db-cc-btn-2`) → `/class/learner/…/aggregated-progress`: summary
  (Completed activities N/M, above target a/b, average score, time spent) + one `.progress-info` block per component
  (`span.product-title`). Product card → `/bundle/<id>` (= the card's "See Progress") → component link
  (`clView-7-<n>`, by name) → Unit → Lesson → one `div.table-row` per activity (`span.activity-name[title]`):
  scorable "First score / Best score / Attempts", non-scorables "Viewed", status icon `aria-label`.
- **Teacher:** class → Class data: `div.class-level-metrics` (Average completed activities %, above target, average)
  + per student `div.student-level-metrics`; the student's product TITLE link `a[qid^=bundle-detail-title-]` (the
  card `a.bundle-card-container` does not carry the name) → `/class/teacher/…/learner/<id>/bundle/<id>` → the SAME
  component / activity rows as the learner.
- After Suites 7–8 (every run): 3/10 overall, Practice Extra 3/4 (scorable, Flashcards, HTML), 1/3 above target,
  100%; **a submitted but unmarked PS is NOT counted as completed** ("evaluation pending", scores "-"); the PDF is
  not counted either. Teacher class: 30% average completion.
- Trap: `:text-is` on `p.bundle-title` matches nothing — the name is in an inner `<span>`.
- **The SUMMARY totals lag the submissions by SEVERAL MINUTES** (batch analytics — user-confirmed EXPECTED,
  2026-09-24). Read right after the activities: learner 1/10 · 1/1 above target, teacher class 10%; ~2 min after
  the run: 3/10 · 1/3 and 30%. The PER-ACTIVITY rows are immediate. So `TST_PROG_TC_1` / `TC_3` re-read the page
  (reload every 20 s, up to 10 min; step timeout 12 min) until every expected figure shows, and the learner PROG
  suite runs LAST (Suite 16, after the teacher's Suite 15) to give the job time.

### A12. Teacher marks the PS — and what changes `[2026-09-24, prod — teacher _4n9d / learner _yqma / Class u62l; one mark, user-approved]`
- **A new submission reaches the marking queue 4.3–6.6 MINUTES after it is made** (full run 8, 2026-09-24: PS submitted
  05:36:26Z; the class link read "0 Marking" until at least 05:40:43Z and "1 Marking" at 05:43:04Z). SOURCE's badge poll
  (20 × (2 s + 15 s) ≈ 6 min) matches. So `TST_MRKQ_TC_1` re-reads the count every 20 s for up to 12 min, and the marking
  suite (Suite8b) runs AFTER Suites 9–14 (~4 min of teacher entry points) so most of the delay has already passed.
- **Entry:** dashboard class card shows a marking badge `span.marking-count` ("1"); class page `a[qid=cView-0]` "1 Marking"
  → `/class/…/marking`: tabs "Unmarked (n)" `#tomark-tab` / "Marked" `#completedMarking-tab`; course
  `[id^=course-link-]` "Practice Extra (1) cqaautomationbundle1" → item `[qid^=course-content-]` "Unit 1: Lesson 1 / PS"
  → the learner's submission (`cMarking-6-*`, "Learner User <date · time>") opens the marking screen.
  The `course-link-<n>` / `course-content-<n>-<m>` ids are POSITIONAL — address them by their text.
- **Marking screen:** the submitted answer; **Score %** `#scoreInput` (`mkForm-2`, number) **PRE-FILLED with 70** (this is
  SOURCE's "70" — it never types a score), −/+ `mkForm-1`/`mkForm-3`; Feedback `div.ql-editor`; "Request new submission"
  checkbox; Save `ctMarking-5`; **Send `ctMarking-7`**.
- **Send → `#exampleModal` confirm**, open in ~0.4 s (no fixed pause needed): with feedback "Ready to send? Once sent, you
  won't be able to make any further changes"; WITHOUT feedback "Send this score without feedback?". Cancel `ctMarking-8`,
  **Send `ctMarking-9`**. Other pre-rendered dialogs: `cancelTeacherScoreModal`, `classEndedModal`, `leaveCustomDraftModal`,
  `leaveEditModeModal`, showcase modals.
- **After:** "Unmarked (0)", item "70% Learner User Marked", submission "Score : 70 %" + "Teacher User <date · time> Score: 70 %
  Feedback: Good"; `.user-submission strong` = "70". The **Marked** tab showed "There are no marked student submissions to
  view" right after, and listed "… PS · 1 completed · Learner User 70%" a few minutes later (lag, not a defect).
- **Learner:** bell → "New feedback · PS · Your teacher has sent you some feedback" (find by TEXT; `ntf-30/31` are positional)
  → opens the PS in the player: "Score : 70 %", teacher block "Score: 70 % Feedback: Good", `strong.ml-1` = "70".
- **Progress after marking:** per-activity PS row IMMEDIATELY "First score 70% · Best score 70% · Attempts 1", status
  "Completed above target"; lesson "4/4 Completed 85%". Summary totals lag (~3.5 min learner, ≤ 5 min teacher):
  learner 4/10 · above target 2/4 · 85% (Practice Extra 4/4 · 2/4 · 0/4 · 85%); teacher class 40% · 2 /4 · 85%, student
  4/10 · 2/4 · 85%. So a marked PS counts as completed AND above target (70% ≥ target).
- **"Show progress details"** (Class data): `input#progressSummary-summaries` is visually HIDDEN behind `label.switch` /
  `span.slider` — click the label. On: per student, `#classDataBundleCollapse00 .progress-info` per component —
  Practice Extra 4/4 · 2/4 · 0/4 · 85%; Projects 0/5 · 0 Gold medals · "-"; Test "This student has not activated the code yet".

- `isInitialized_player` (DASH_TC_14) waits for the iframe; a learner resuming at **PS has no iframe**, so
  use the activity title link (`#selectedActivitySidebarBtn`) as the "player ready" signal (DASH_TC_16).

---

## Part B — Automation notes

| TC | Proves |
|---|---|
| `DASH_TC_14` | Practice Extra of the NAMED class opens the player (`isInitialized_player`: provisioning 5 s grace → iframe) |
| `PEXT_TC_1` | the activity iframe is shown (LP-001; the TOC is deliberately NOT asserted — first-entry only) |
| `PEXT_TC_100` | housekeeping — TOC closed whatever the entry state |
| `PEXT_TC_2` / `PEXT_TC_3` | TOC opens / closes (LP-005 / LP-006) |
| `PEXT_TC_4…7` | frames 1–4 answered, every dropdown filled, Check (LP-002/003) |
| `PEXT_TC_8` | last Next → score contains "You scored 4 out of 4" |

- Dropdown mechanics (`answer_frame`): `switchToFrame(playerIframe)` → click the k-th `.rich-dropdown`
  → option = `getNthNestedFilteredLocator(dropdown, k, 'ul li', /^answer$/)` → 300 ms open animation
  (sanctioned pause) → **`clickAtCenter`** → wait for the frame's filled count to reach k+1 →
  `switchToParentFrame` → Check. Both action-library methods added 2026-09-22 (protected, confirmed).
- `DASH_TC_4` / `click_praticeExtra_btn` are **positional** (first tile on the page; selector shared with
  `ebook_btn`) — the LP suite uses `DASH_TC_14` instead.
- **Debugging the scorable needs a learner who has never attempted it.** Debug runs use
  `--runData=last` (ADR-022); once a debug learner has finished the activity, the next debug of
  `PEXT_TC_4…8` needs a new learner (run Suites 4–6 in normal mode, or the full suite).
- Runs 2026-09-22: Suite 7 debug 6/6 then 11/11 (learner `_ajq1`); full suite 53/53 (learner `_jqh2`).

**Batch 2 (Suite 8, 2026-09-23)** — one learner, in this order (each needs the previous state):

| TC | Proves |
|---|---|
| `DASH_TC_16` | LP-027: no expiry on the SLE tile/card; the `div.loader` spinner shows; player chrome opens |
| `PEXT_TC_101` | housekeeping — TOC open at its unit view |
| `PEXT_TC_9` | LP-007: unit → lesson view listing all five activities |
| `PEXT_TC_25` | LP-026: lesson collapse/expand, "Go to unit view", back in with the same activities |
| `PEXT_TC_19` | LP-019: keyboard re-activation toggles the TOC closed, then open; one sidebar |
| `PEXT_TC_10` / `TC_11` | LP-008/009: Flashcards opens; deck rewound, then paged first → last, no grading control |
| `PEXT_TC_12` / `TC_16` | LP-010/014: PS screen; empty answer → Submit disabled, no dialog |
| `PEXT_TC_13` / `TC_17` | LP-011/015: type → Submit → confirm → answer shown; on return still shown, no editor/Submit |
| `PEXT_TC_18` / `TC_26` | LP-018: lesson-view close keeps the learner in the LP; Back → dashboard |

`DASH_TC_15` (LP-020) runs in **Suite 6**, before the invite is accepted — so it can only be exercised by a
full run (a `--runData=last` learner already has the class).
- Deck mechanics (`page_deckToEnd`): rewind with Previous (the deck remembers its position), then Next until
  `li.step:last-child` is current, each change followed by `DECK_SETTLE_MS = 2500` (measured threshold
  1.8–2.0 s, §A6). Stops ON the last card — the next Next would leave for PS.
- `TST_PEXT_TC_13` consumes the learner's one PS submission: a `--runData=last` debug of it needs a learner
  who has never submitted (run the full suite).

---

## Part C — Running and debugging this suite (permanent)

### C1. Commands
| Purpose | Command |
|---|---|
| Full suite (setup chain + LP cases) | `npm run learningPathTest_prod` |
| Same on thor | `npm run learningPathTest_thor` — **Blocked** at `SNUP_TC_61`, see `c1-core-shared.md` §A4 |
| Debug ONE suite on the previous run's users | `node core/runner/run.js --appType=ExperienceApp --testEnv=production --testExecFile=learningPathDebug.json --browserCapability=desktop-chrome-1920 --runData=last` |
| Add a trace to any of them | append `-- --trace=true` (npm) or `--trace=true` (node) → `traces/<Suite>.zip` |

`learningPathDebug.json` holds whichever suite is being debugged — copy the suite you need into it from
`learningPath.json` (it is a scratch file, not part of the full run).

### C2. What a run creates, and the debug rule
A **full** run creates real production data every time: 1 teacher (+ affiliation to MQA Sierra School),
1 class, 1 learner (+ class membership and Learning Path progress) — approved by the user with the
product team. A **`--runData=last`** run creates nothing: `{{run.*}}` resolve to the users in
`runtime/lastRun.json` (ADR-022 amendment). So: debug a failing suite in `--runData=last` mode and run
the full suite once, at the end, when every part passes.

### C3. State that can only be met once per learner
- **Scorable activity** (LP-002/003, `PEXT_TC_4…8`; also LP-025 "Saved" state): after it is completed —
  or half-completed — re-entry resumes at the NEXT activity, so a learner gives exactly one attempt.
- **Practice Set** (LP-011, and LP-014/015 which depend on its state): a submitted PS cannot be
  submitted again by that learner.
- **First entry** (TOC self-opens, the provisioning screen) happens once per learner.
A debug attempt that consumes one of these needs a fresh learner: run the setup suites (4–6) normally,
or the full suite. Plan which of these a single run exercises — they compete for the same learner.

### C4. Where the cases live
Manual register `test/Manual/C1App/LearningPath/` — sheet "Test Cases" (LP-001…033 mapped; 9 automated,
the rest designed with `[ASSUMED]` expected results to confirm live) and sheet "LP Setup (by module)"
(the fresh-user chain, module by module). Both are generated from `_tcdata.js` / `_tcdata_setup.js` /
`_tcdata_batch2.js` by `_generate.js`; edit those, never the `.md`/`.xlsx` by hand.

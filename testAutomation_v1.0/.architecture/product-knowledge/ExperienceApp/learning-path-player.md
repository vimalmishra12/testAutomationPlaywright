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

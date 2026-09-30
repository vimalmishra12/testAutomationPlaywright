# New Learning Path (NLP) player — "Projects" — learner, teacher, admin

> Screen file (ADR-020). Read `c1-core-shared.md` first; the classic Learning Path (Practice Extra) is in
> `learning-path-player.md` — the NLP reuses its **activity engine** but not its shell.
> Module **`NLPP`** (`newLearningPath.page.js`, `newLearningPath.test.js`); launch `DASH_TC_17`
> (`dashboard.page.js`). Manual register: `test/Manual/C1App/NewLearningPath/`. Scenario sheet
> `D:\Playwright\Test_Cases_CUP\nlp-scenarios.xlsx` (TC-NLP-001…022).
> Living document — append, never overwrite; `[ASSUMED]` until seen live.
> *First seeded: [2026-09-25]* — grounded on production with read-only probes (learner `_mhfh`, teacher `_r04f`,
> Class 036n; groups UI on teacher `_f6up` / Class f98w, nothing saved).

---

## Part A — Product behaviour

### A1. What the NLP component is
- In `cqaautomationbundle1` the NLP component is **"Projects"** (product `cqaautomationpr1`); Practice Extra is the
  classic LP. The class card shows it as "Projects / Continue learning" — **no expiry date** on an SLE class.
- Routes: learner `/nlp/learner/<org>/class/<classId>/product/cqaautomationpr1`; teacher (class materials)
  `/nlp/teacher/<org>/class/<classId>/product/…`; teacher My library / admin `/nlp/teacher/<org>/product/…` (no class).
  An open activity adds `/view/item/<unit>%2F<lesson>%2F<activity>`.

### A2. First launch — provisioning with a PROGRESS BAR `[2026-09-25]`
- A learner's first launch of the product goes through `/nlp/learner/<org>/createUA/product/<pid>/class/<id>`:
  "Welcome to your Cambridge One / We're setting up the learning materials for you", a **percentage progress bar**
  (`#auto-entitlement-welcome-ele #progressBar`; its `aria-valuenow` stays 0 — the width/label carry the value).
- Measured: app loader ~0.4 s → provisioning from ~1.5 s → 80 % at 60 s → 100 % at ~64 s.
- It is **per product**: learner `_mhfh` had used Practice Extra before and still got it for Projects.
  A second launch goes straight to the TOC in ~1.7 s.
- (Contrast: the classic LP showed no progress bar — LP-027 is a spinner.)

### A3. TOC — one vertical page
- Header: product title (h1 "cqaautomationbundle1"), component (h2 "Projects"), logo `productView-1`
  ("Cambridge One Home"), profile menu `productView-2` (learner/teacher name); teacher/admin also get **Back**
  (`productView-back-btn`).
- Body `div.accordion.toc-wrapper`: a numbered **unit** card `a.unit-detail` ("1 Unit 1", Bootstrap collapse,
  `aria-expanded`), its **status line** `.unit-status` ("In progress" once anything is started), the **lesson**
  `a.lesson-info` ("Lesson 1", aria-label "Lesson 1 ,progress bar 0 percent"), then the numbered **activities**
  `a.activity-info[aria-label='<n>. <name>']`, each preceded by a connector dot `div.dot`.
- Projects' activities: `1. BASE04_Dropdown_Scorable.zip`, `2. Flashcards.zip`, `3. PS`, `4. Collaborative Task`,
  `5. Group PS`. **Medal icons** (`.medal-container img`, empty-medal.svg) on the scorable types only: 1, 3, 5.
- **No "Version" labels** and no HTML / PDF activity in this product (the sheet's TC-NLP-016 wording and
  TC-NLP-019/020 come from another product — "R55 Multi Component Umbrella").
- Row states: in progress = `.lch-in-progress-icon` (purple); completed = `.lch-green-tick` + medal
  `lch-medal-abovethreshold`; not started = `lch-medal-not-started`. No "Saved" text anywhere.

### A3b. Product update — HTML and PDF activities added `[2026-09-25, same day]`
- The product team added two activities to Projects; the TOC now lists **7**: `1. BASE04_Dropdown_Scorable.zip`,
  `2. Flashcards.zip`, `3. PS`, `4. Non-scorable HTML activity`, `5. test pdf`, `6. Collaborative Task`,
  `7. Group PS` (the group activities were renumbered). Medals still on 1, 3 and 7. A3's "no HTML / PDF" no longer holds.
- **HTML activity:** loads in the activity iframe (content from `content.cambridgeone.org/…/ext-cup-html/…`); only ×
  and NEXT ACTIVITY — no Submit/Check; the TOC row shows the completed tick after × (seen after a 6 s stay; the suite
  dwells 3 s per the sheet). Progress row "Viewed".
- **PDF activity:** a DOWNLOAD PAGE (`#content-course-download`): "Download the test pdf below and complete this
  activity", "Sample1.pdf", Download, NEXT ACTIVITY — no download starts; landing marks it completed (tick; progress
  "Viewed"). The suite never clicks Download.
- Totals: Projects **/6** (7 activities, one not counted), overall **/11**. End state of a full run for learner A:
  5/11 · 3/5 · 87%; Projects 5/6 · 3 Gold medals · 87% (settled; the learner summary lags the teacher card by minutes).
- `progress.teacherStudentMetrics` (xpath) returned learner A's card for "LearnerB User" on runs 2–3 — because B's card
  had NO metrics block (B had never launched the product), so the xpath climbed to the list. Resolved by the setup fix
  in A11 (run 4 read B's own card). A card without metrics still falls through to the first card — keep expectations
  distinct per learner so such a read fails instead of passing.

### A4. Activity view
- Replaces the TOC page. Header: logo `cHeader-10`, title `h1.open-sidebar[title=<name without number>]`,
  **Close Activity** `button[qid='cHeader-8']` (×). **No profile menu** in this header (so a logout from inside an
  activity needs × first). × returns to the TOC page, same position.
- The activity engine is the classic LP one: iframe `div#content-course-ext iframe`, frames `#content_wrap_N`,
  rich dropdowns, Flashcards deck, PS editor/Submit ids — see `learning-path-player.md` §A4, §A6, §A7.
- **Check / Next / Previous are all `a.green-btn` on the outer page** (titles Check / Next / Previous).

### A5. Scorable (BASE04_Dropdown_Scorable.zip)
- Same content/answers as the classic LP. **No Check until an option is chosen.**
- Exit (×) after checking frame 1: TOC row → in-progress icon, medal still not-started, unit "In progress".
  Reopen → lands on frame 1 with the answer kept (`.wrapper-dropdown.filled` + `.rich-dropdown.checked-correct`),
  **Next** offered → frames 2–4 → result.
- Result screen (`div.result-screen`): h2 **"Amazing!"**, `p.score` **"You scored 4 out of 4 and won a gold medal."**,
  **Next activity** `a[qid='resultScreen-1']`, Review answers `resultScreen-3`.
  ⚠️ `resultScreen-1` stays in the DOM HIDDEN on other screens — visibility, never presence.
- TOC afterwards: green tick + above-threshold medal.
- **A finished scorable REOPENS AS A FRESH ATTEMPT** (empty frame 1, no result screen) — unlike the classic LP.

### A6. Flashcards and PS
- Flashcards: 6 cards, identical to the classic LP (a Next inside ~1.8 s of a card change is ignored). On the last
  card: Previous + **NEXT ACTIVITY** (`a.btn.nextActivityBtn`) → PS.
- PS: outer page, no iframe. Empty → Submit `class="btn disabled"`; typing enables it; "Ready to submit?" modal
  (`#exampleModal`, pre-rendered with a "class hasn't started" variant too). After submit:
  `div.submitted-notification` → `.submitted-info` "Learner User · <date · time> · 3 words · **Submitted**"
  (medal img alt "Activity status: evaluation pending") and `div.attempted-answer` with the answer; NEXT ACTIVITY
  offered. TOC row: in-progress icon (not a tick) until marked.
- Pre-rendered PS modals: `exampleModal`, `changesNotSavedModal`, `pskill-GroupInfoModal`, `addLinkModal`,
  `deleteLinkModal`, `saveAlertModal` ("Are you sure you want to leave the activity?").

### A7. Leaving
- TOC logo `productView-1` → `/dashboard/learner/dashboard` (profile menu `cHeader-2` back).

### A8. Teacher / admin preview
| Entry | Lands on | Notes |
|---|---|---|
| Class → Materials → "Projects" | `/nlp/teacher/…/class/<id>/product/…` | same TOC + Back; activities open and × back |
| My library → search → title → View details → Projects tile | `/nlp/teacher/…/product/…` | |
| Manage student access → Create access rule → Projects | **`/learning-path/teacher/…/create-access`** | the CLASSIC LP rule player (Select all units, Cancel/Continue) — `MSAC_TC_1` works unchanged |
| Create assignment → Projects | classic LP assignment mode | `C1AS_TC_27` (LP-030) |
- A preview creates no learner progress (as the classic LP, user-confirmed 2026-09-23).

### A9. Marking the Projects PS
- The submission reached the queue ~4 min after it was made (11:42 → listed at 11:46): class link "1 Marking",
  course "Projects (1) cqaautomationbundle1", item "Unit 1: Lesson 1 / PS", submission "Learner User <date · time>",
  score pre-filled **70** — the same marking screen as the classic LP (`markingQueue.page.js`).

### A10. Progress `[2026-09-25, before marking]`
- Learner My progress: a **Projects** block beside Practice Extra ("Completed activities: 1/5 …"); product page
  component link "Projects · 2 Completed · 1 Gold medal · Time spent" (Projects counts **medals**, not
  above/below-target). Per-activity rows: scorable "First score 100% · Best score 100% · Attempts 1", Flashcards
  "Viewed", PS "First score - · Best score - · Attempts 1", Collaborative Task (empty), Group PS "- · - · -".

### A11. Groups (Collaborative Task, Group PS)
- As a learner in NO group both open with "This is a collaborative activity. It can only be completed by students
  assigned to groups by a teacher". Collaborative Task: comment editor + **Post** (`#post-collabTask-btn`), Group
  information link. Group PS: Title (`#submissionTitle`, disabled), answer editor, Save/Submit disabled.
- Teacher creates groups: class → Class data → the **Students/Groups switch** (`input#learner-group-toggle`,
  click its `label[for=learner-group-toggle]`) → "Groups (0)" + **Create groups** (`a[qid='grp-1']`) →
  `/class/…/group/create-group`: Group name `#groupTitle` (**maxlength 50**, required, duplicate-name validator),
  one row per student (name, email, checkbox `input[qid^='cgroup-1-']` whose label is sr-only), **Create**
  `button[qid='cgroup-3']` (CSS-disabled until valid). Two students per row name "… User" — **select by e-mail**.
- **Creating a group** `[2026-09-25, Class jyaf]`: the label is 0 px wide and the input is `opacity:0` on top of
  `div.checkbox` → click `div.checkbox`. Two Create buttons exist; the top one is overlapped by the bottom container
  (clicks intercepted) → click the bottom one. ~5 s later: Class data, banner "2 students added to <group>",
  "Groups (1)", "All students in this class are now in groups", the group block with "2 Students" and a
  Group actions menu (Change details / Add students / Remove students / Delete group).
- **Collaborative Task in a group**: headed by the GROUP name; "No comments yet" until someone posts; comments are
  `div.comment-card` (`.actor-name` "Learner User", `.comment-card-body`, "Just now"). The comments load **after**
  the editor renders — wait for a card or the empty state. After a post, **Ready** (`#ready-collabTask-btn` →
  `#submitionConfirmation`) becomes available (never clicked by the suite). Every member sees every comment.
- **Teacher** (class Materials → Projects → Collaborative Task): first a **Select group** page
  (`…/item/<path>/group-selection`, rows `a[qid^='groupSelect-G']` "<group> <date>"), then the same activity with
  both learners' comments, Post and NEXT ACTIVITY (no Ready). The teacher's comment shows "Teacher User" + a separate
  "Teacher" tag.
- **Group PS**: Title (`#submissionTitle`, maxlength 50) + answer; Submit CSS-disabled until there is an answer;
  the confirm reads **"Ready to submit your group's work?** You are acting for all group members. It won't be possible
  to change your work later unless your teacher requests it" → **Yes, submit**. Then every member sees
  "Learner User **on behalf of** <group> · <date · time> · 6 words · Submitted", the title and the answer; no editor.
- **Marking the Group PS**: in the queue ~4 min after submitting, item "Unit 1: Lesson 1 / Group PS", ONE submission
  listed under the **group name**; same marking screen (score pre-filled 70). Marked 90 / "Well Done": each member's
  Group PS shows "Score : 90 %" + "Teacher User … Score: 90 % Feedback: Well Done"; each member's bell gets
  "New feedback · Group PS".
- **Analytics credit for the non-submitting member needs that member to have LAUNCHED the product** `[2026-09-25, user
  fix, verified run 4]`: on run 2, where learner B only ever reached Projects through the group, B stayed 0/5 · 0 Gold
  medals (class 20%) for 20+ min. With learner B launching Practice Extra and Projects right after accepting (setup,
  before any group work), run 4 credited B: 1/11 · 1/1 · 90%, Projects 1/6 · 1 Gold medal · 90%, class 27% · 4 /6 · 88%.
- **Marking-queue counter lag** `[run 4]`: with both members launched, right after the Group PS mark the counters read
  "2 Marking" / "Unmarked (2)" / "Projects (2)" while the list said "There are no student submissions to view"; they
  reached 0 within ~15 min. `MRKQ_TC_2` (group data) re-reads the tab until it settles (≤ 20 min, user decision).

### A12. End-state analytics of a full run `[2026-09-25, Class jyaf — read ~5 min after the last mark]`
| View | Figures |
|---|---|
| Learner A My progress | 4/10 · above target 3/4 · 87%; Projects block 4/5 · **3 Gold medals** · 87%; Practice Extra 0/4 |
| Learner A Projects rows | scorable 100/100/1 · Flashcards Viewed · PS 70/70/1 · Collaborative Task (empty — Ready never clicked) · Group PS 90/90/1 |
| Teacher Class data | (5-activity Projects) A 4/10 · 3/4 · 87%; B 1/10 · 1/1 · 90%; class 25% · 4 /5 · 88% — **current 7-activity figures: A 5/11 · 3/5 · 87%, B 1/11 · 1/1 · 90%, class 27% · 4 /6 · 88% (run 4)** |
- Projects blocks count **Gold medals**, not above/below target. Per-activity rows carry no status label for scorable
  types (only non-scorables: "Activity status: viewed").

---

## Part B — Automation notes
- The NLP page object delegates the activity engine to `practiceExtra.page.js` (answer_frame, page_deckToEnd,
  submit_ps) — do not duplicate those mechanics.
- `page_deckToEnd().gradingSeen` is **invalid in NLP** (the deck's Next is `a.green-btn`, the classic LP's Check
  selector); NLPP reads a visible `a.green-btn[title='Check']` instead.
- The first launch needs ≥ 70 s (provisioning); `DASH_TC_17` allows 300 s.
- `open_activity` closes an open activity (×) first — the TOC is only on the TOC page.
- Two submissions per run (PS + Group PS): `MRKQ_TC_1` waits for **both** (`minCount: 2`) before marking the PS,
  which then leaves "Unmarked (1)" (`unmarkedAfter`); the Group PS is marked in its own suite (the marking screen has
  no way back to the class card).

| TC | Proves |
|---|---|
| `DASH_TC_17` | TC-NLP-001/002/018 — no expiry; first launch: provisioning + progress bar → TOC |
| `NLPP_TC_1/2` | TC-NLP-001/016 — TOC content and structure; unit collapse/expand; open + × |
| `NLPP_TC_3/4/5/6` | TC-NLP-003/017/004 — Ex 1 + Check; exit → in progress; relaunch restores; Ex 2–4; "4 out of 4" |
| `NLPP_TC_7/8/9` | TC-NLP-005/006/007 — deck → NEXT ACTIVITY; PS "Submitted"; × → logo → dashboard |
| `NLPP_TC_10/11/12` | TC-NLP-012/014/015 — teacher Materials / My library / admin Library previews |
| `CGRP_TC_1` | group of the run's two learners |
| `NLPP_TC_15/16/17` | TC-NLP-021 — A posts; B sees + posts; teacher Select group, sees + posts; A sees all |
| `NLPP_TC_18/19/20` | TC-NLP-022 — A submits for the group; B sees it; each member sees the one mark |
| reused | `DASH_TC_13` (011), `MSAC_TC_1` (013), `MRKQ_TC_1/2` (008, 022), `PROG_TC_1/3/4/5/6/7` (009/010/022) |

---

## Part C — Running and debugging this suite

| Purpose | Command |
|---|---|
| Full suite (22 suites: fresh teacher, class, learners A + B, group, all NLP cases) | `node core/runner/run.js --appType=ExperienceApp --testEnv=production --testExecFile=newLearningPath.json --browserCapability=desktop-chrome-1920` — or `npm run newLearningPathTest_prod` |
| Debug on the previous run's users | put the suite(s) in `newLearningPathDebug.json` (scratch) and add `--runData=last` |

- **A full run creates** (user-approved 2026-09-25): 1 teacher (+ MQA Sierra School affiliation), 1 class, 2 learners,
  1 group `NLPGroup <rand4>`, Projects progress, 2 PS submissions, 2 marks, 3 comments. Names come from
  `runValues.json` (`lpTeacherEmail`, `lpClassName`, `lpLearnerEmail`, `lpLearner2Email`, `lpGroupName`).
- `newLearningPath.json` shares `runtime/lastRun.json` with `learningPath.json` — the last of the two to run owns it.
- **`--runData=last` cannot create a key the previous run never generated** (`lpLearner2Email` after a
  learningPath run) — it throws "not found in lastRun.json". Seed the key into `lastRun.json` from its
  `runValues.json` pattern, or run the full suite.
- **Once per learner / group:** the PS (per learner) and the Group PS (per group) — a debug of `NLPP_TC_8` / `TC_18`
  needs fresh users. The scorable is NOT once-per-learner in NLP (it reopens fresh).
- Manual register: `test/Manual/C1App/NewLearningPath/` — generated by `_generate.js` from `_tcdata.js`,
  `_tcdata_groups.js` and `_run.js` (execution record). Never hand-edit the `.md` / `.xlsx`.

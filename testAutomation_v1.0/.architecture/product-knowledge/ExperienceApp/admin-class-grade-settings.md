# Admin App — Class grade settings (CGST)

> **Migrated from [`../ExperienceApp.md`](../ExperienceApp.md) on [2026-08-21] under ADR-020**
> (product knowledge splits per feature area). **The content below is unchanged** — this was a
> pure move, verified byte-identical. Append here from now on, not to the app file.
>
> **Read [`admin-shared.md`](admin-shared.md) first.** It carries what is true of *every* admin
> screen — navigation, pre-rendered modals, positional ids, CSS-only-disabled buttons, Angular
> typing, measured timings, the visual-testing verdict — and is not repeated here.

---

#### Feature: Class grade settings (CGST, Req #22)

*Captured live on Thor [2026-08-20] during the CGST Phase-1 probe, school "3 July Test School 1"
/ `FCN-CHZ-PDA`. Resolves every `[ASSUMED]` in `TST_CGST_TC_1..6`.*

##### Page: Class grade settings
- **URL (Thor):** `/class/teacher/org_<slug>/class/<uuid>/grade-weighting`
- **Title:** `Class grade settings | Cambridge One`; `<h1>` = "Class grade settings", with the
  class name in the `<p>` directly beneath it.
- **Entry path:** Classes tab -> launch a class -> **Actions** (`a[qid='cView-70']`) ->
  **Class grade settings** (`a[qid='cView-60']`).
- Deep-linking straight to `/grade-weighting` works **once the school context is set** (same
  precondition as every other admin deep link). The tab title briefly reads "Class Page" before
  settling to "Class grade settings" — anchor on an element, not the title.

> **`Class grade settings` and `Delete class` live in the SAME Actions menu**
> (`cView-60` and `cView-13`). One `click_actionButton()` serves both — which is what lets a
> suite test the grade settings and then delete the class without re-navigating.

**Key elements** (the page is fully `qid`-attributed — no class-name fallbacks needed)

| Element | Selector | Notes |
|---|---|---|
| Back | `a[qid='gradeW-1']` / `#gradeW-back-btn` | |
| User guide toggle | `a[qid='gradeW-userGuideBtn']` / `#userGuideInfo` | |
| Grading scale name | `.grading-scale-display .grade-display .heading` | e.g. "Cambridge One grading scale" |
| Grading scale sub-text | `.grading-scale-display .grade-display .description` | "Target score will vary depending on class materials" |
| Change scale | `#GradingScaleChange` | a real `<button>` |
| Teacher score-override toggle | `#teacherScoreOverrideSwitch` | `input[type=checkbox]`, read `.checked` |
| Score calculation dropdown | `#dropdown-current-score-type` | an `<a>`; text is the current value ("Best score") |
| Material (bundle) row | `a[qid='gradeW-3-<b>']` | `<b>` = bundle index |
| Material weightage input | `input[qid='gradeW-5-<b>-<i>']` / `#weightageInput-<b>-<i>` | `type=number` |
| Other grading categories | `a[qid='gradeW-14']` | collapsible |
| Add a grading category | `a[qid='gradeW-16']` / `#gradeW-16` | **label changes — see traps** |
| Category picker (added row) | `a[qid='data-items-dropdown-1']` | "Create or choose a custom grading category" |
| Category weightage input | `input[qid='gradeW-15-<n>']` / `#componentWeightageInput-<n>` | |
| Remove category row | `button[qid='del-customComponents-<n>']` | |
| Total grade label / value | `span.col-6` ("Total grade:") / the `<span>` inside the sibling `<p>` | renders e.g. `100%` |
| Cancel | `a[qid='gradeW-6']` / `#gradeW-cancel-btn` | `<a>`; carries a `disabled` **class** |
| Save changes | `button[qid='gradeW-7']` / `#gradeW-save-btn` | real `<button>`; genuine `disabled` property |

**Change grading scale modal**

| Element | Selector | Notes |
|---|---|---|
| Modal root | `#changeGradingScaleModal` | |
| Close (X) | `#changeGradingScaleModalClose` | closed cleanly first time — no retry needed (unlike the Classes-tab filter modal) |
| Scale radio | `input[qid='grade-scale-radio-<n>']` | **positional** — match by the adjacent `label.label-grading-scale` text |
| Scale label | `label.label-grading-scale` | the current default reads "&lt;name&gt; default" |
| Manage grading scales | `#manage-grading-scales` | link out to the school-level scales page |
| Cancel | `#cancel-grading-scale` | `<a>` with a `disabled` **class** |
| Apply | `#update-grading-scale` | `<a>` with a `disabled` **class** — see traps |

**Validation copy — CONFIRMED [2026-08-20]** (was `[ASSUMED]` in `TST_CGST_TC_6`)

| Condition | Message |
|---|---|
| Weightages total != 100% | `Your weighting choices exceed the maximum of 100%` |
| A single weightage outside 0-100 | `Please enter a number 0-100` |

**⚠ ELEVEN MODALS ARE PRE-RENDERED IN THE DOM ON THIS PAGE** [2026-08-20]

All are present at all times with `display:none`; at most one is ever visible. Two consequences:

1. **Any assertion on modal PRESENCE is a guaranteed false green** — always use `isDisplayed`,
   never `getElementCount() > 0`. (Same trap as the grading-scales and grading-categories
   pages; this page just has far more of them.)
2. **Their copy can be captured without triggering them** — including states that are hard to
   reach, e.g. the maximum-grading-categories limit.

| Modal | id | Non-committing way out | Raised by |
|---|---|---|---|
| Changes saved | `#changesSavedConfirmationModal` | X `a[qid='gradeW-13']` | a successful **Save** |
| Save failed | `#gradeWeightingErrorModal` | X `a[qid='gradeW-14']` | a failed Save ("Try again") |
| Cancel warning | `#cancelChangesWarningModal` | `#gradeW-10` "No, go back" | **Cancel** on a dirty form |
| Override warning | `#warningForEnableTeacherOverrideScoreModal` | `#cancelTeacherScore` | the score-override toggle |
| Change grading scale | `#changeGradingScaleModal` | `#changeGradingScaleModalClose` | **Change** (grading scale) |
| Total-weightage error | `#totalWeightageErrorModal` | `#totalWeightageErrorModalCloseButton` | weighting ≠ 100% on save |
| Remove grading category | `#deleteCustomComponentWarningModalBox` | `#gradeW-9` "Cancel" | removing a category row |
| Max grading categories | `#maximumComponentModalBox` | `#gradeW-24` "Go back" | category limit reached |
| Create grading category | `#CustomComponentModalBox` | `#gradeW-17` X | "Create a grading category" |
| Progress-metric warning | `#warningForDisableProgressSoFarMetricModal` | `#cancel-progress-so-far` | hiding "progress so far" |
| Leave-without-saving | `#editActivityChangesSavedModal` | `#editActivityChangesSavedModalClose` | navigating away dirty |

> **This page raises a dialog at essentially EVERY state-changing control.** An unclosed one is
> a full-viewport overlay that blocks every subsequent click **while every read keeps working**
> — the single most expensive failure mode found here. Enumerate this list when automating a new
> control rather than discovering them one failed run at a time (which cost three runs on
> 2026-08-20). **Diagnostic signature: many interactions failing while reads succeed = an open
> overlay.**

**Known quirks / traps**

- **⚠ THE TEACHER SCORE-OVERRIDE TOGGLE RAISES A CONFIRMATION DIALOG** [2026-08-20].
  Clicking `#teacherScoreOverrideSwitch` opens `#warningForEnableTeacherOverrideScoreModal`:
  *"Are you sure? By turning on this setting you are enabling the teacher to manually add and
  override scores marked by Cambridge One for individual activities. Teacher score for these
  activities will be the score that counts towards the overall score calculation, overriding
  the Best/First score setting selected above"* — with **No, go back**
  (`#cancelTeacherScore`) / **Yes, enable** (`#enableTeacherScore`), plus an X
  (`#enableTeacherOverrideScoreModalClose`).

  | Element | Selector |
  |---|---|
  | Modal root | `#warningForEnableTeacherOverrideScoreModal` |
  | Confirm | `#enableTeacherScore` ("Yes, enable") |
  | Cancel | `#cancelTeacherScore` ("No, go back", an `<a>`) |
  | Close X | `#enableTeacherOverrideScoreModalClose` |

  **Measured while the dialog is open: the toggle already reads `checked:true`, but Save is
  still DISABLED.** The setting commits only on "Yes, enable"; "No, go back" reverts the
  toggle to its previous state and closes cleanly. So the toggle's own state is NOT evidence
  that anything changed — asserting on it before confirming reports success for a change that
  never happened.

  **Cost when missed:** the dialog is a full overlay. Leaving it open silently blocks every
  later click on the page **while every READ keeps working** — which makes four unrelated
  later steps fail on individually plausible-looking symptoms ("modal did not open",
  "row not added", "value not entered"). This was 5 of the 6 failures on the CGST suite's
  first run. If several interactions fail but reads succeed, suspect an open overlay first.
  **The dialog is SYMMETRIC — resolved [2026-08-20]** (was `[ASSUMED]`). The *same* modal id is
  reused for both directions, with the copy and the confirm button's label swapped:
  turning ON → *"By turning on this setting…"* / **"Yes, enable"**; turning OFF →
  *"If you turn off this setting, teachers in this class will no longer be able to…"* /
  **"Yes, disable"**. The confirm element is `#enableTeacherScore` in both cases, so address it
  by id and never by its text.

- **The Total grade and the Save button update on BLUR, not on keystroke.** Measured live: with
  the material at 100 and a category typed to 500, the page still displayed `Total grade: 100%`
  **and Save was ENABLED** until the field was blurred; on blur the total corrected to `600%`,
  the error copy appeared and Save re-disabled. A TC that types a weightage and immediately
  asserts will conclude the 100% validation is broken. **Always blur before asserting**
  (Invariant 6 / "a DOM flag is not the form's model").
- **`#gradeW-16`'s label changes with state:** "Add a grading category" when no custom category
  row exists, "Add **another** grading category" once one does. Never assert the first form
  unconditionally.
- **`Apply` / `Cancel` in the scale modal, and `Cancel` on the page, are `<a>` elements carrying
  a `disabled` CLASS — not the `disabled` property.** `action.waitForEnabled()` cannot see this;
  check the class list instead. Only `#gradeW-save-btn` is a real `<button>` with a real
  `disabled` property.
- **Save is disabled while the form is pristine** — this is the app's own dirty-state signal and
  is the natural thing to assert against (Invariant 13).
- **"Add a grading category" inserts an INLINE row, it does not open a modal.**
- **~~Cancel does not reset the form in place.~~ CORRECTED [2026-08-20]:** Cancel opens a
  confirmation dialog — `#cancelChangesWarningModal`, *"Are you sure you want to cancel? Any
  unsaved changes will be lost"* with **No, go back** (`#gradeW-10`) / **Yes, cancel**
  (`#gradeW-11`). The original note was written after clicking Cancel, seeing the form
  unchanged, and concluding the button was broken — the dialog was open and simply had not
  been looked for. **The button works; it needs confirming.** `reload_page()` remains a valid
  discard, but Cancel is not broken.

  *Method note, because this error was made three times in one session:* checking that a click
  **landed** is not the same as checking what it **opened**. On this page, assume a
  state-changing control raises a dialog until proven otherwise.
- Category options `a[qid='data-items-dropdown-view-0-<n>']` are **positional over a shared,
  mutable list** — always select by name, never by index (same rule as class rows).

**Data notes**

- **A class needs course material for CGST to be meaningful** — the per-material Weightage row is
  what `TST_CGST_TC_6` manipulates. A class created with no material has nothing to weight.
  (Consistent with `TST_CLON_TC_3`'s observation that an empty source class shows
  "Class grade settings — Not available".)
- Scales offered on this school [2026-08-20]: `Cambridge One grading scale` (system default,
  currently applied) and `new Grading Auto`. Categories offered: `new catagory`,
  `new Grading Category`, `some`, plus a "Create a grading category" path.
  **All of these are on the "not ours — never delete" list (section 7 of the handoff).** Selecting
  one only associates it with the class; it does not modify the scale/category itself.
  User approved referencing them for CGST [2026-08-20].

##### Class creation latency — MEASURED [2026-08-20]

The product's "can take up to 12 hours" copy is **worst case, not typical**. Measured end to end
on Thor, creating one class with a course material:

| Milestone | Elapsed from clicking "Create 1 class" |
|---|---|
| Success dialog ("Success! We are now creating 1 class for you") | ~5 s |
| Class visible in the Active list (count incremented) | **~24 s** |
| Class launchable + Class grade settings fully functional | **~59 s** (first attempt, no retry — most of this was navigation, not waiting) |

**Consequence:** a suite MAY create a class in `Before` and use it in the same run. Gate on the
class row appearing (poll), never on a fixed pause, and never on the "up to 12 hours" copy.
This supersedes the earlier blanket note that a new class "does not appear immediately" — that
remains true for the *instant* after creation, but the wait is seconds, not hours.

**⚠ THOR THROUGHPUT VARIES ENORMOUSLY — the figures above are a GOOD day** [2026-08-20]. The
same CGST suite, unchanged in the relevant path, ran in **3.5 minutes** and then in
**12 minutes** an hour later. On the slow run the Add-materials type-ahead never populated
within **90 s** and `TST_CCLS_TC_6` timed out, which broke the whole create chain; loading the
Classes tab by hand at the same time also took seconds rather than being instant.

**This slowness is KNOWN AND ACCEPTED, not a defect** — confirmed by the user 2026-08-20 ("we
all know that takes time"). Do **not** raise it as a bug and do not treat a slow Add-materials
search as a product failure.

Two lessons: (1) a green run proves the code, not the timings — do not tighten a timeout on the
strength of one fast run; (2) when a suite that passed suddenly fails early in a *shared*,
pre-existing TC, check whether the environment is simply slow before changing any code.
**Do not add retries to a shared TC to paper over this** (Invariant 14) — but equally, do not
report it as a defect; budget generous timeouts for the material type-ahead instead.

**Keep every poll budget comfortably BELOW mocha's `timeout` (`.mocharc.js` = 120000).** A poll
set to exactly 120000 is killed by the runner at the same instant it expires, so the failure
surfaces as a generic mocha timeout instead of the TC's own diagnostic message.

##### Deleting a class

- Entry: class page -> **Actions** (`cView-70`) -> **Delete class** (`cView-13`).
- **No confirmation modal appeared for a freshly-created class with no students** [2026-08-20].
  The click deleted immediately and redirected to
  `/admin/admin/org_<slug>/class?showMessageBanner=true`. This contradicts
  `activeClass.page.js`, whose `click_yesDelete_Btn` (`button[qid='cView-48']`) assumes a confirm
  step always exists. Most likely the confirm is only raised for a class holding students/data —
  **not yet verified**, marked `[ASSUMED]`. Any cleanup step must tolerate BOTH paths.
- **Delete is SOFT.** The class leaves `Active classes (N)` and reappears in the **Ended** section
  with Class status **`Deleted`** (verified live: Active 22 -> 21, Ended 51 -> 52). It is not
  removed from the school, so a per-run create+delete cycle still accumulates rows in Ended.

---


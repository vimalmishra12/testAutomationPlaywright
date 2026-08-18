# Authoring Status — in-flight phased test authoring

> **Live state file** for the `c1-test-authoring` phased workflow (router → Phase 1 build →
> Phase 2 run/fix → Phase 3 visual). One block per test currently in flight. The skill reads
> this file at session start to resume from the first ⬜ phase, and each phase's exit checklist
> updates it. **Remove a block when Phase 3 completes** — an empty file means nothing is pending.
> History lives in the session walkthroughs, never here.

## Status markers

| Marker | Meaning |
|---|---|
| ✅ | Phase complete **and verified** — for Phase 1 that means the suite was actually executed |
| ⚠️ | **Built but NEVER EXECUTED** — every selector, timeout and data value is an unverified guess |
| ⬜ | Not started |

> **Why ⚠️ exists.** A Phase 1 that was written from documentation and never run is not
> "complete" — it is an untested hypothesis, and marking it ✅ hands the next person a minefield
> labelled as finished work. `adminClassesTab` shipped as "Phase 1 ✅" having never been
> executed; its first real run was 2/6, and Phase 2 then took ~15 runs because eight unverified
> guesses surfaced simultaneously and entangled with each other. **If you did not run it, it is
> ⚠️, not ✅** — and say why in the block, so the next session knows to distrust every value in it.

## Block format

```markdown
## <testName> (<App>, <env>)
- Phase 1 (build):   ✅ <date> — TST_<MOD>_TC_1..<N> registered; executed: <P> passing / <F> failing on first run; visual candidates: <list|none>
- Phase 2 (run/fix): ⬜ pending
- Phase 3 (visual):  ⬜ pending
```

Built but not yet executed (blocked):

```markdown
- Phase 1 (build):   ⚠️ <date> — built from documentation, NEVER EXECUTED.
                       Every selector / timeout / data value is UNVERIFIED. Blocker: <reason>
```

---

## schoolAdminAddClassValidation (ExperienceApp, thor)
Scenario #3 (bulk class-creation form) — Edge/Negative validation, extending the existing
`CCLS` module (create flow already covered by `schoolAdminAddClass` / `P1Adminclassworkflow_Thor`).
- Phase 1 (build):   ✅ 2026-08-14 — TST_CCLS_TC_9..12 registered; visual candidates: none — no
  static UI snapshot asserted (attribute/enabled-state/disabled-cell-count reads only).
  ⚠️ Selectors authored WITHOUT live Playwright-MCP capture (server not connected this session).
  `endDateDisabledCell` (`.owl-dt-calendar-cell-disabled`) is from the manual doc's live capture,
  not re-verified — confirm in Phase 2.
- Phase 2 (run/fix): ✅ 2026-08-14 — all 6 passing, 2 consecutive clean runs
  (`P1AdminclassValidation_Thor`, headed/system-Chrome). Inferred selector
  `endDateDisabledCell` (`.owl-dt-calendar-cell-disabled`) VERIFIED live (18 disabled cells).
  TC_9 fix: the create form restores an auto-saved draft (not empty on load), so TC_9 now
  clears the class name first (`clear_className()`) to guarantee an incomplete row before
  asserting Create is disabled.
- Phase 3 (visual):  ⬜ pending

**Deferred (need live capture before authoring):** scenario-#3 POSITIVE cases not yet done —
BCCF_TC_7 (duplicate), TC_8 (copy existing class), TC_10 (CSV template download),
TC_11 (CSV upload), TC_12 "Create more classes" leg, and the enriched TC_1 toolbar assertions
(TC_1 form-load itself is now covered — see below).
(BCCF_TC_2/4/12-back-to-dashboard already covered by TST_CCLS_TC_1..8; BCCF_TC_6/1/3 done below.)

## schoolAdminAddClassBulk (ExperienceApp, thor)
Scenario #3 POSITIVE — form-load + bulk multi-row behaviour, `CCLS` module, **creates no class**
(asserts button state / applied-value deltas only). Live-captured 2026-08-17/18 against MQA
Sierra School (MQA-ABC-DEF) — the login account's own home school; `schoolKey` in
`adminAddClassBulk` test data points here now (not FCN-CHZ-PDA).
- Phase 1 (build):   ✅ 2026-08-18 — TST_CCLS_TC_13 (BCCF_TC_6), TC_14 (BCCF_TC_1, form-load
  components), TC_15 (BCCF_TC_3, add teacher), TC_17 (BCCF_TC_9, bulk toolbar dates),
  TC_18 (BCCF_TC_7, duplicate row), TC_19 (BCCF_TC_11, CSV upload) registered and
  live-verified GREEN; visual candidates: none — TC_13's Create-button label is a dynamic
  row count, the rest are attribute/state/applied-value reads, no static UI snapshot asserted.
  TC_16 (BCCF_TC_5, add label) FIXED 2026-08-18 — see the row-scoping bug below.
  TC_21 (BCCF_TC_8, Copy an Existing Class) added 2026-08-18.
- Phase 2 (run/fix): ✅ 2026-08-18 — **11/11 passing** (TST_SADB_TC_1, TST_SCLS_TC_2,
  TST_CCLS_TC_14, TC_15, TC_13, TC_16, TC_17, TC_18, TC_22, TC_19, TC_21), 2 consecutive clean
  runs, ~55s-1m each (run directly via
  `node core/runner/run.js --testExecFile=schoolAdminAddClassBulk.json`).
  **This suite creates NO classes.**
  Real bugs found + fixed along the way (all in `createClasses.page.js`, non-protected):
  - Row-2 qids (`dBulkClass-1-2/-1-3/-1-4`) were inferred, now verified live.
  - `teacherApplyChangesBtn` is NEVER natively disabled — a click before Angular's async
    validation settles silently no-ops with no thrown error. Fixed with a single click + a
    generous (15s) wait for the observable result (NOT retry-clicking — re-clicking risks
    double-applying if the first click is still processing).
  - The teacher-email field can silently DROP the last keystroke of `pressSequentially`
    (observed `...mailsac.co` instead of `...mailsac.com`). Fixed in `set_teacherEmail` by
    reading the value back after typing and retrying (clear + retype, up to 3x) until it matches.
  - The bulk-toolbar Start/End-date buttons are ALSO CSS-class-only disabled (no native
    `disabled` attribute) — same "single click + longer wait" pattern applied.
  - **The "Add class label" dropdown is rendered PER ROW** — `#class-label-list-modal-<rowIndex>`,
    each containing a full copy of every label (~87). So an unscoped
    `input[placeholder='Create or find a label']` matches ONE PER ROW (Playwright raises a
    strict-mode violation on it), and the search text can land in a hidden row's box, leaving
    row 1's list unfiltered so the item click never resolves. **This was the true root cause of
    TC_16's repeated "label was not selected" timeouts** — an earlier `:visible` tweak treated a
    symptom (a real hidden duplicate) but not the cause. Fixed by scoping BOTH `labelSearchInput`
    and `classLabelItem` to `#class-label-list-modal-0` (row 1), consistent with the row-0 qids
    used elsewhere. Verified live: typing "temp" filters 87 → 1 and the click applies the label.
  - **Bootstrap custom-control checkboxes must be clicked via their `<label>`** — the
    `label.custom-control-label` overlays the input and intercepts pointer events, so clicking the
    input times out ("<label …> intercepts pointer events"). Applies to the copy-options
    checkboxes (`copyTeachersLabel` / `copyMaterialsLabel`).
  - **"Copy an Existing Class" is a 2-STEP wizard** sharing ONE Continue selector
    (`dBulkClass-copy-from-modal-4`) across both steps — each transition must be waited on via
    that step's own controls. Step 2's options are enabled only when the SOURCE class has items of
    that kind (labels show counts, e.g. "Teachers [1]" vs disabled "Assignments [0]"). The copy
    does NOT overwrite the row's own name/dates; it fills teachers/materials and records the
    source in a "Copied from a class" cell (`dBulkClass-copied-class-data-<row>-9`).
  - **Row checkbox ids are POSITIONAL and re-issued** (`checkbox-1`, `checkbox-2`, …) as rows are
    added/removed, so the first row's checkbox is NOT reliably `#checkbox-1`. This was the root
    cause of the recurring "row checkbox is not clicked" failures in BOTH TC_17 and TC_18. Fixed
    by matching structurally: `input[type=checkbox][name^='checkbox-']`.
  - **Applying a bulk toolbar date CLEARS the row selection** ("All selected" → "0 Selected"),
    re-disabling the toolbar — so a row must be RE-SELECTED between consecutive bulk actions.
    This was why TC_17's end-date leg failed after its start-date leg succeeded. Expect the same
    for the not-yet-automated bulk Add teacher / Add labels / Add Material actions.
  - **CSV upload POPULATES THE FORM — it does NOT create classes** (probed live 2026-08-18 with a
    one-row throwaway CSV; nothing was created). Creation still requires clicking "Create N
    classes", so TC_19 uploads, asserts the rows, and stops — zero side effects. The hidden
    `input[qid='dBulkClass-54']` (`accept=".csv"`, `class="d-none"`) takes files directly via
    `action.setInputFiles` — no need to click "Upload file" first, same as the NEMO uploader.
  - **CSV template format** (from "Get CSV template", captured 2026-08-18 — this resolves
    BCCF_TC_10's `[ASSUMED]` even though TC_10 itself is not automated): 14 columns, UTF-8 BOM —
    `Class name, Start date DD/MM/YYYY, End date DD/MM/YYYY, Teacher 1..10 (optional),
    Student progress data`, plus one sample row. Dates go in as `DD/MM/YYYY` and the form
    displays them as e.g. `Tue, Sep 15, 2026` — assert the DISPLAY form, not the input form.
  - **`reset_formToSingleEmptyRow()` added** (select-all → Remove → confirm "Yes, remove rows").
    The draft-restore made every row-index and row-count assertion non-deterministic ACROSS RUNS
    — e.g. TC_18's duplicate persisted into the next run and broke TC_13, because re-filling an
    already-complete row adds no class. TC_13/TC_17/TC_18 all now reset first. **Any future TC
    that asserts on a row index or row count MUST call this first.**
- Phase 3 (visual):  ⬜ pending

## schoolAdminAddClass — workflow suite (ExperienceApp, thor) — TC_20 added
Scenario #3 BCCF_TC_12 "Create more classes" leg, added to the EXISTING workflow suite
(`P1Adminclassworkflow_Thor`) rather than the bulk suite, because it must CREATE A REAL CLASS
and the bulk suite is deliberately side-effect free.
- Phase 1 (build):   ✅ 2026-08-18 — TST_CCLS_TC_20 registered; visual candidates: none.
  Selector `createMoreClassesLink` (`a[qid='dBulkClass-48']`) captured from the success modal's
  markup, which is present-but-hidden in the DOM — so capture cost ZERO created classes.
- Phase 2 (run/fix): ✅ 2026-08-18 — 13/13 passing on **FCN-CHZ-PDA**, run twice (the 2nd run
  carried the tightened assertion). Suite now creates **2 classes per run**
  (`AutoClass_CreateOnly` + `AutoClass_CreateMore`).
  ⚠️ Deviation from the strict "2 consecutive clean runs with final code": only ONE run carries
  the final tightened assertion (the prior run passed with a looser one). Accepted deliberately
  because each extra run creates 2 more real classes; the other 11 TCs in this suite are
  long-stable. Re-run if a stronger guarantee is wanted.
- Phase 3 (visual):  ⬜ pending
- **FCN-CHZ-PDA verified working** — the whole workflow suite (incl. material selection) ran
  green against it, so the "issue" reported earlier was not this school. Likely the thor 503
  outage seen the same day.
- **Product finding:** "Create more classes" returns a **completely empty** form
  (`rowName/rowStart/rowEnd` all ""). This is the ONLY known path that does not restore the
  auto-saved draft — everywhere else the form repopulates.

**✅ SCENARIO #3 IS FULLY AUTOMATED — all 16 BCCF manual cases covered (2026-08-18).**
Coverage map: bulk suite = BCCF_TC_1/3/5/6/7/8/9/10/11 (creates nothing) · workflow suite =
BCCF_TC_2/4/12 (creates 2 classes/run) · validation suite = BCCF_TC_13/14/15/16.

**Protected-file change made (confirmed by user, 2026-08-18):** `downloadFile(selector, saveDir,
timeout)` added to `core/actionLibrary/baseActionLibrary.js` — the library had NO download
handling. Purely additive; no existing method touched. Awaits the click and the page's `download`
event together via `Promise.all` (a listener attached after the click misses fast downloads);
listens on `global.page` because the event never fires on a FrameLocator, while the click still
goes through `el()` so iframe scoping is preserved. Returns
`{ downloaded, fileName, filePath }` per the ADR-009 getter exception. Files default to
`output/downloads/` (already gitignored). Note `acceptDownloads` is NOT set anywhere, so
Playwright's default (true) applies — no change to `playwright.setup.js` was needed.

**npm script added (confirmed by user, 2026-08-18):** `P1AdminclassBulk_Thor` in `package.json`,
alongside the other `P1Adminclass*` scripts. Verified by running the suite THROUGH the script
(11/11 passing, 58s). No `visualAcceptance_*` counterpart — every TC is `visualTest: false`, so
AGENTS.md Rule B's dual-script requirement does not apply yet (revisit if Phase 3 promotes any).

**Pending / follow-up:**
- **TC_21 data dependency:** `copySourceClass` = "cqa test class 17aug2026 1" must exist in the
  target school AND have ≥1 teacher and ≥1 course material (copy options are disabled otherwise).
  It has a dated name so it may eventually be cleaned up — swap the value in
  `schoolAdminAddClassData.json` if the test starts failing on "source class could not be selected".

# Walkthrough — newLearningPath (NLP — "Projects")

## Session 1 — 2026-09-25

## Summary
Planned and automated all 22 scenarios of `nlp-scenarios.xlsx` (New Learning Path = the "Projects" component of
cqaautomationbundle1) on production, branch `nlp`. User decisions: own exec file with its own fresh users; previews on
the run's bundle (not "R55"); the group cases automated with a second learner; the teacher marks the PS. 20 scenarios
automated, TC-NLP-019/020 Blocked (Projects has no HTML/PDF activity).

## Grounding (probe scripts in the session scratchpad)
- Read-only on learner `_mhfh` / teacher `_r04f` (Class 036n): first launch = `/createUA` provisioning with a % progress bar
  (~64 s), vertical TOC, activity view (logo + ×, no profile menu), scorable same engine, exit → in-progress icon, relaunch
  restores; result "Amazing! / You scored 4 out of 4 and won a gold medal."; finished scorable reopens FRESH; Flashcards and PS
  as the classic LP; PS "Submitted" badge; teacher routes (`/nlp/teacher/…`; MSAC create-access = classic LP player);
  marking queue lists the Projects PS ~4 min after submitting.
- Groups on run 1's Class jyaf (own data): Students/Groups switch, create-group form (checkbox = `div.checkbox`; bottom Create),
  Collaborative Task (group-name heading, comment cards, Ready not clicked), teacher Select group page, Group PS confirm
  "Ready to submit your group's work?", "on behalf of", queue lists the group, member views after the 90 mark, notifications,
  end-state analytics.

## Applicable-traps table
| Trap | Applies? | Where handled |
|---|---|---|
| Pre-rendered UI (resultScreen-1, #exampleModal variants, PS modals) | yes | visibility checks; confirm title read only once visible |
| CSS-only disabled buttons (PS / Group PS Submit, Create group) | yes | class polled before clicking |
| Covered / zero-size controls (switch input, checkbox label, top Create) | yes | label / `div.checkbox` / bottom Create |
| Positional ids (`groupSelect-G0`, `cgroup-1-n`, course-link-n) | yes | by group name / e-mail / text |
| Async content after render (comments) | yes | wait for a card or "No comments yet" (found in debug) |
| Invented timeouts | yes | provisioning measured 64 s → 300 s bound; queue lag measured ~4 min |
| Once-per-learner / per-group state (PS, Group PS) | yes | order in the exec file; debug notes in knowledge Part C |
| NLP deck Next = `a.green-btn` (classic LP Check selector) | yes | `gradingSeen` dropped; `a.green-btn[title=Check]` used |

## Changes Made
### 1. pages/ExperienceApp/newLearningPath.page.js — Created (Page Object)
NLP player: isInitialized (provisioning grace), watch_launch, getData_toc, toggle_unit, open_activity (closes an open activity
first), click_closeActivity, getData_activityState, answer_frame/click_next (delegating to practiceExtra), getData_frameState,
getData_result, click_resultNextActivity, page_deckToBridge, click_nextActivity, submit_ps, click_homeLogo,
getData_activityHeader, group methods (getData_collab, post_collabComment, select_group, open_activityForGroup,
submit_groupPs, getData_submission), preview_component.
### 2. pages/ExperienceApp/classGroups.page.js — Created (Page Object, module CGRP)
isInitialized, open_groupsView, create_group(name, emails).
### 3. pages/ExperienceApp/dashboard.page.js — Modified
+ `launch_classNlpComponent` (TC-NLP-001/002/018).
### 4. pages/ExperienceApp/markingQueue.page.js — Modified
`getData_classMarkingCount(timeoutMs, reloadEveryMs, minCount)` — optional minCount (default 1; LP unchanged).
### 5. test/ExperienceApp/newLearningPath.test.js — Created
`TST_NLPP_TC_1…12, 15…20` (13/14 are Blocked design rows, not implemented).
### 6. test/ExperienceApp/classGroups.test.js — Created — `TST_CGRP_TC_1`.
### 7. test/ExperienceApp/dashboard.test.js — `TST_DASH_TC_17`. markingQueue.test.js — optional `minCount` / `unmarkedAfter` data.
### 8. C1Selectors.json — new sections `newLearningPath`, `classGroups`.
### 9. C1TCRepository.json — module NLPP (18 TCs), CGRP (1), `TST_DASH_TC_17`; all `visualTest: false`.
### 10. Test data — `newLearningPathData.json` (new); `runValues.json` + `lpGroupName`.
### 11. Execution files — `newLearningPath.json` (22 suites, generated from learningPath.json's setup suites + learningPathGroups.json's
learner-B suites); `newLearningPathDebug.json` (scratch).
### 12. Knowledge / register / status
`product-knowledge/ExperienceApp/new-learning-path.md` (new) + index rows in `product-knowledge.md` and `ExperienceApp.md`;
register `test/Manual/C1App/NewLearningPath/` (`_tcdata.js`, `_tcdata_groups.js`, `_run.js`, `_generate.js` → `.md` + `.xlsx`);
`authoring-status.md` block.

## Runs
- Run 1 (12 suites, before groups): **70/70**, 10 min — teacher `_6fho`, Class jyaf, learner `_sh6x`. Summary report built.
- Learner-B setup on run 1's class (`--runData=last`): first attempt 8/15 — `lpLearner2Email` not in lastRun.json (debug mode
  cannot generate new keys; nothing was created); seeded the key → 22/22 (learner B `_i25k`).
- Group debug 1: 14/16 — both failures mine (comments read before they loaded). Debug 2: 11/13 (teacher author text; TC_20 started
  inside another activity) → fixed → 5/5.
- Run 2 (22 suites, full): **125/127**, 34 min — teacher `_5d2i`, Class qjug, learners `_r4cx` / B `_x40g`, group NLPGroup jzsg.
  Every learner, group, preview and marking case green. Both failures = `TST_PROG_TC_3` (teacher Class data): 20% · 3 /4 · 87%
  for 10 min and still 20 min after the Group PS mark; learner B's Projects details 0/5 · 0 Gold medals — the group's mark is
  NOT credited to the non-submitting member (on run 1's class it was: B 1/5 · 1 Gold medal · 90%). Reported to the user, not
  worked around (Invariant 14). Side note: the teacherStudentMetrics xpath read learner A's card for "LearnerB User" — to check.
  Summary report: output/reports/TestReports/summary/newLearningPath_production_2026-09-25_12h42/.

### Follow-up (same session): known behaviour for learner B's group credit
- User: treat the Group PS analytics for learner B (teacher and learner progress) as known application behaviour.
- `newLearningPathData.json`: `nlpProgress.teacherClass` asserts the metric labels only (the class figures include B); `nlpProgressTeacherB` removed.
- `newLearningPath.json` rebuilt (228 steps): the "learner B's figures" `PROG_TC_3` step dropped; Suite 20 renamed.
- Debug run of Suite 20 on run 2's users: **5/5**. Report: output/reports/TestReports/summary/newLearningPathDebug_production_2026-09-25_13h32/.
- `package.json`: `newLearningPathTest_prod` added (user confirmed).
- Register regenerated; knowledge A11/A12 and authoring-status updated.

### Follow-up (same session): HTML and PDF activities (TC-NLP-019/020)
- The product team added "Non-scorable HTML activity" and "test pdf" to Projects (7 activities; group activities renumbered 6/7).
- Probe (run 2's learner A): HTML = iframe, no submit, tick after ×; PDF = download page (Sample1.pdf), tick after landing; no download.
  Settled analytics: Projects /6, overall /11 → learner A 5/11 · 3/5 · 87%, Projects 5/6 · 3 Gold medals · 87%.
- `newLearningPath.page.js`: + open_htmlActivity, open_pdfActivity; tests `TST_NLPP_TC_13/14`; selectors download*; data nlpHtml / nlpPdf,
  renumbered labels, new figures and HTML/PDF progress rows; exec Suite 12 (+TC_13/14); TC repo +2.
- Full run 3 (`npm run newLearningPathTest_prod`): **125/128** — TC_14 (PDF left at once, not completed) + PROG_TC_4/6 knock-on (PDF row).
  User: "Follow the rule same as for PDF in LP" → land via NEXT ACTIVITY from the HTML activity, dwell 3 s, never download.
  Debug on run 3's users: **11/11**. Reports: summary/newLearningPath_production_2026-09-25_15h04/, newLearningPathDebug_production_2026-09-25_15h25/.
- Register regenerated: 34 Pass. Knowledge A3b added.

### Follow-up (same session): learner B setup fix and the marking counter
- User: after learner B is created, B launches Practice Extra and Projects, then does the group work — fixes B's group credit and card data.
  Exec Suite 9 + DASH_TC_14 / PEXT_TC_100 / PEXT_TC_26 / DASH_TC_17 (first launch) / NLPP_TC_1; B's later launch = relaunch.
  Restored: numeric class figures (27% · 4 /6 · 88%) and `nlpProgressTeacherB` (PROG_TC_3 + PROG_TC_7 for B).
- Full run 4: **134/135** — B's analytics all green (the teacherStudentMetrics xpath read B's own card: it had failed only because B's card
  had no metrics). The one failure: the Group PS marking counter ("Unmarked (2)" with an empty list) — probe: 0 within ~15 min.
- User chose option 1: `markingQueue.getData_unmarkedTabSettled` (new, re-reads the tab) + opt-in `unmarkedSettleMs` in MRKQ_TC_2 (LP unchanged).
- Full run 5 (`npm run newLearningPathTest_prod`): **135/135**, 14 min — the counter settled in 22 s. Report:
  summary/newLearningPath_production_2026-09-25_17h30/. Register 34 Pass; knowledge A3b/A11/A12 updated.

## Architecture Decisions Triggered
None new. ADR-021/022 followed (prefixed run-generated group name; own data only). Reuses the classic LP activity engine via
page-object delegation (practiceExtra.page.js) instead of duplicating it.

## Protected Files Touched
`package.json` — added script `newLearningPathTest_prod` (after `learningPathTest_prod`); confirmed by the user 2026-09-25.

## Pending / Follow-up
- ~~Open finding — TST_PROG_TC_3~~ → **user decision 2026-09-25: known application behaviour.** Revisit if the product team calls it a defect.
- `progress.teacherStudentMetrics` xpath returned learner A's card for learner B on run 2 — verify on a 2-learner class.
TC-NLP-019/020 blocked (no HTML/PDF activity in Projects).
- The classic LP register's LP-023/024 (ON HOLD) are now covered by this suite — reconcile that register when it is next regenerated.

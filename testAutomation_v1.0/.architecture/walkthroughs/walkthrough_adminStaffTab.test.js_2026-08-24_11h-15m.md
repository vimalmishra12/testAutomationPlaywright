# Walkthrough — Admin App Staff tab, manual test-case design

**Date:** 2026-08-24 · **Env:** Thor `micro-nemo.comprodls.com` · **School:** `FCN-CHZ-PDA`
**Skill used:** `c1-manual-test-authoring` (repo root `.agent/skills/`, not the worktree copy)
**Outcome:** 56 manual test cases designed, grounded live, emitted as `.md` + `.xlsx`. Nothing automated.
*(57 written; `TST_STFP_TC_5` withdrawn on review — see below.)*

---

## What was asked

Create manual functional test cases for the Admin App **Staff** tab from
`AdminApp_Staff Tab.xlsx` (13 scenarios), using the Students-tab automation handoff as context.

## What was done

1. Read the mandatory architecture set, the manual-authoring skill and its document template, and
   the Students-tab register as the format model.
2. Extracted the 13 source scenarios from the workbook with `exceljs`.
3. **Agreed scope and module codes with the user before designing** — `STFL` / `STFP` / `STFB`,
   named after the future page objects `schoolStaff` / `staffProfile` / `bulkStaff` (AGENTS.md
   Rule 6), so no re-mapping is owed at automation time.
4. **Grounded the whole area live** via Playwright MCP after the user signed in: the list, search,
   sort (including the Staff-only Role column), user guide, load more, both staff-profile variants,
   both action dialogs, class launch, and the invitation form.
5. Wrote `test/Manual/C1App/AdminApp-Staff/AdminApp_Staff_tab_test_cases.{md,xlsx}`.
6. Promoted the durable findings into `product-knowledge/ExperienceApp/admin-staff-tab.md` and
   wired it into the three index tables; added `AutoStaff_` to the sweepable prefixes.

## Key decisions

- **Both artefacts were generated from a single case list**, then the generator was deleted. This
  guaranteed the `.md` and `.xlsx` agree (golden rule 6) without leaving behind a script that would
  clobber the tester columns if re-run. Future edits go through `npm run register`, as the standard
  requires. The generated workbook was verified by read-back and then re-read through
  `tooling/xlsxRegister.js`.
- **Blocked used sparingly.** Two cases were Blocked at design time, both on the invitation form.
  One (`TST_STFB_TC_9`) was **unblocked the same day** once the user approved downloading the CSV
  template and the fixture was written from its real headers. **One remains Blocked** —
  `TST_STFB_TC_11`, whose dialog exists in the DOM but whose trigger has not been reproduced.
  Everything else is runnable on this school.
- **The mutating cases were deliberately not exercised.** Grant, revoke-confirm and remove-confirm
  were left `[ASSUMED]` rather than tried on shared accounts. The *cancel* paths were exercised, so
  the dialog copy is verified rather than assumed.
- **`[ASSUMED]` expected results are all listed in the register's Open items** with what would
  resolve each. Three were resolved during review with the user on the same day: the staff-count
  timing, the CSV template headers, and the HTTP 500's status as a data issue.

## What grounding caught that guessing would not

The Staff tab reads like the Students tab and behaves differently in a dozen ways. Designing by
analogy would have produced wrong steps in most groups:

- No Username column, no username sort — which exposed a **typo in source scenario #5** (it reads
  "username" where the tab sorts by **email address**). Confirmed with the user and corrected;
  `TST_STFL_TC_22`, written to record the mismatch, was withdrawn once the scenario was fixed.
- No row checkboxes, no bulk remove, no course-material activation anywhere.
- Default sort is Last name, not First name.
- The row *is* the menu toggle, and the menu has one item, not two.
- The class name on a staff profile **is** a link — the opposite of the student profile's umbrella
  name, which is the trap the Students batch caught.
- The staff profile URL is **not** deep-linkable, where the student profile URL is.
- The no-results search shows a proper message here, where the Students tab shows nothing.

## Defects found

Two survived review as product defects: `Staff (23)` in the heading versus 21 rendered rows, and
three raw i18n keys in the invitation form's upload-error dialog (free-captured from the pre-rendered
DOM before the state was ever reached, and root-caused to translation keys defined under
`EXISTING_CHILD` / `BULK_ACTIVATION` but never under `ADULT_INVITE`).

Two were closed on review with the user `[2026-08-24]`: the **HTTP 500** on `View profile` is a known
**data** issue on one account — `TST_STFP_TC_6` was narrowed to the client-side gaps it exposes (no
error shown, loading overlay left stuck) — and the **profile deep-link** case `TST_STFP_TC_5` was
**withdrawn**, because deep-linking is not handled by the development team. The behaviour is still
recorded in product knowledge, since automation must not reach a staff profile by URL.

Five smaller copy defects recorded in Remarks — the "no **administrators** that match" wording, the
student-only help panel and `Students` browser title on the shared invite form, `takea`, and
`school Account`.

## Open question raised

An administrator is offered both `Remove admin rights` and `Remove from school account` on **their
own** profile, with no extra warning.

## Follow-ups for whoever automates this

Everything needed is in the register's *Handoff to automation* table and *Open items* list. In
short: start with the ~45 side-effect-free cases (all of `STFL` bar the count case, most of `STFP`,
the read-only half of `STFB`); download the CSV template before writing any fixture; and never
revoke rights from or remove a staff member the suite did not create — least of all
`testt1@mailsac.com`.

# Walkthrough — AdminApp Generic manual test cases (COMPLETE, Batches A–C)

**Date:** 2026-08-27 · **Skill:** `c1-manual-test-authoring`
**Source:** `AdminApp_Generic.xlsx` (14 cross-cutting "Generic" scenarios)
**Deliverable:** `test/Manual/C1App/AdminApp-Generic/` — `.md` + `.xlsx` + `_tcdata.js` + `_generate.js`
**Environment:** Thor · `micro-nemo.comprodls.com` · `testt1@mailsac.com` (school-admin)

---

## 1. Scope agreed up front

The 14 scenarios span the whole admin shell, not one screen, and none of them had a module or a
per-screen knowledge file in `admin-shared.md` §A2. Agreed with the user before designing:

- **Three batches.** Batch A — shell chrome (#1, #2, #3, #7, #8, #11). Batch B — school context
  (#4, #5, #10, #12). Batch C — cross-app (#6, #9, #13, #14).
- **Ground live** on Thor rather than write from documentation.
- **Split module codes per future page object**, not one `AGEN` for everything.

Only Batch A was built this session.

## 2. The grounding blocker

In the Playwright-MCP browser the app could be **read** but not **driven**: dropdowns did not open,
school cards did not route, and `/myprofile` redirected to `/admin/admin/dashboard`. Hit-testing
confirmed clicks reached the right element — the Angular app simply did not respond. Only `navigate`
worked.

**What saved the batch** was `admin-shared.md` §A6's free-capture trick: the admin header, footer,
Help menu, tutorial list, language control, profile menu and role toggle are all **pre-rendered**, so
labels, qids, hrefs and accessible names could be read without opening anything. That covered
scenarios #7 and #8 fully.

**What it could not cover** was anything that only exists after an interaction. Scenarios **#2** and
**#11** were therefore **deferred with no cases written**, rather than guessed — golden rule 1.

Later in the session the user opened the notifications panel manually, which unblocked scenario #3.
**That hybrid was then retired** — see §8: the blocker was solved outright, and the user instructed
that the agent must drive the browser itself rather than hand over steps.

## 3. The significant course correction

The first draft shipped 12 cases. **The user then pointed out that notifications were probably
already handled in the framework.** They were right, and an audit of `C1TCRepository.json`, the page
objects and `C1Selectors.json` found the overlap was wider than notifications:

| Scenario | Already existed | Consequence |
|---|---|---|
| #8 footer | `TST_FOOT_TC_1..9`, `footer.test.js`, full selector set | 5 of my cases were duplicates |
| #3 notifications | `TST_INVI_TC_1..6`, `invitationNotification.page.js` — same `#tippyDropdownMenuButton` | my `ANTF` module was a redundant second module for one control |
| #1 Spanish | `TST_LAND_TC_4` + `appLangEN.json` / `appLangES.json` | landing-page language already covered |
| #2 My Profile | `appShell.page.js` (`userDrop_down`, `logout_btn`) | partial existing coverage |

**Re-scoped to gaps only: 12 cases → 7, then → 10** once the notifications panel was captured.
Module codes now **reuse the existing page objects** and extend from their highest existing number —
`TST_FOOT_TC_10`, `TST_INVI_TC_7..11` — never renumbering (golden rule 7). Only `ASHL` is new, and
only because the admin header's Help menu (`cHeader-hlp-*`) and language control (`sp-ldd-*`) appear
in no existing selector set.

> **Lesson worth carrying.** The skill's load order does not include *"audit existing automation
> before designing"*. It should. Grounding on the live app was done correctly and still produced five
> duplicate cases, because the duplication was in the **repo**, not the product. Check
> `C1TCRepository.json` and `C1Selectors.json` for the feature **before** writing cases.

### Two claims that were wrong and were corrected

Both had already been propagated into `admin-shared.md` and are now written up there as explicit
corrections rather than silently edited:

1. **`cFooter-9` duplicate qid** was written up as an undiscovered defect. It is **already known and
   worked around** — `C1Selectors.json` uses `a[qid="cFooter-9"][aria-label="FAQs"]` and selects
   *Cambridge One for schools* by `a[class*="insti-btn"]`. The negative case was dropped.
2. **`cFooter-4` / `cFooter-8` "unused"** was wrong. `cFooter-4` is **Site Feedback**
   (`footerSiteFeedback`) — it is simply **not rendered in the admin footer**. That absence became
   the real finding, `TST_FOOT_TC_10`.

## 4. What was found that is genuinely new

- **The notifications panel is the one admin dialog that is NOT pre-rendered** — built lazily by
  tippy.js, so §A6's free capture does not apply. A real exception to §B2.
- **Panel renders only 5 rows against a heading of 92**, does not scroll, and has **no mark-as-read
  control**; the rest sit behind *See older notifications*.
- **Row qids are positional AND based at 30** (`ntf-30`…`ntf-34`), not 1.
- **Date format depends on the time group** — relative under *Last Seven days*, absolute
  (`Ddd, DD Mmm, YYYY`) under *Older*. One date assertion across all rows will fail.
- **Copy inconsistency:** "…available to download **in the Reports tab**" (Class summary) vs
  "…**on the Reports page**" (Aggregated data). Pinned by `TST_INVI_TC_11`.
- **Close control `[qid="ntf-2"]` is on two visible elements** (`.close`, `.close-dummy`) —
  a second, genuinely unhandled instance of the duplicate-qid shape.
- **Footer hrefs change with authentication state** — real routes logged out,
  `javascript:void(0);` logged in. Asserting `href` on the logged-in footer is a false green.
- **The five Help tutorial topics all share `qid="cHeader-hlp-6"`.**
- **This account sees 7 schools, not the 4 in §0** — `KNF-XRD-QVE`, `HQC-ZWM-ZVF`, `GYB-JMU-KYA`
  are undocumented. Useful to Batch B.
- **Page `<title>` is not stable across load paths** — `My school accounts | Cambridge One` after
  in-app navigation vs `Administrator | Cambridge One` on a fresh `goto`.
- **The Gigya screen-set injects ~15 hidden forms** on `/login`; scope login selectors to
  `#gigya-login-form`.

All promoted into `admin-shared.md` §A9/B11, with three rows added to §A2.

## 5. Final state

**21 TCs — 12 Positive · 4 Edge · 5 Negative**, all `Not Run`, none Blocked, none creating real data.

| Module | IDs | Page object | Status |
|---|---|---|---|
| `ASHL` | `TST_ASHL_TC_1..7` | future `adminShell.page.js` | **new** |
| `MYPR` | `TST_MYPR_TC_1..8` | future `myProfile.page.js` | **new** |
| `INVI` | `TST_INVI_TC_7..11` | existing `invitationNotification.page.js` | extended |
| `FOOT` | `TST_FOOT_TC_10` | existing `footer.page.js` | extended |

**Coverage: all six Batch A scenarios (#1, #2, #3, #7, #8, #11) have at least one case.**
Nothing is deferred within Batch A.

The `.md` and `.xlsx` are both generated from `_tcdata.js` by `_generate.js`, so they cannot drift
(golden rule 6). The register was verified with `npm run register -- dump`.
## 6. Still open

10 of the 21 cases carry an `[ASSUMED]`. The load-bearing gaps:

1. **No admin-app Spanish copy has been verified anywhere.** `appLangES.json` holds only `landing`
   and `login` sections — the admin strings do not exist yet. `TST_ASHL_TC_2` is entirely
   `[ASSUMED]`. This is now the single largest gap in the batch.
2. **A disposable account is needed.** `TST_MYPR_TC_5`–`TC_7` (field limits, password validation)
   were deliberately NOT run, because `testt1@mailsac.com` is the admin suite's own login. Their
   error copy is unverified.
3. **Notifications empty state** never seen (this account has 92); whether 5 rows is a cap or a page
   size, and where *See older notifications* leads, are both unconfirmed.
4. **Help destinations** — labels verified, targets not.
5. **Unsaved-changes behaviour on My Profile** (`TST_MYPR_TC_4`) — prompt or silent discard is
   unknown, and both are plausible given precedent elsewhere in the app.
## 7. Handoff

- Automation continues in **`c1-test-authoring` Phase 1**.
- **Nothing in Batch A creates data** — it belongs in a side-effect-free suite. `TST_ASHL_TC_2`
  changes the account language and must switch it back.
- **Do not renumber** `FOOT` or `INVI`; extend from `TC_11` / `TC_12` respectively.
- **`MYPR` needs a disposable account** before its validation cases can be executed.
- **One combined accessibility ticket** is owed: neither the school tabs nor the profile tabs
  expose `aria-current` / `aria-selected`.
- **Batches B and C are not started.** Batch B is partly pre-grounded — all 7 school cards and keys
  were captured this session.

---

## 8. Session part 2 — the MCP click blocker was SOLVED, Batch A completed

`browser_click` was inert on this app: the click landed on the correct element, Playwright reported
success, and Angular never reacted. **A JS-dispatched `element.click()` via `browser_evaluate` drives
it normally** — Angular binds ordinary click listeners, so the synthetic pointer events were the
problem, not the app. Poll for the resulting state change; the tab strip took 1.2–4.3 s to settle.

> **User instruction, 2026-08-27:** *never ask the user to click through the app* — drive it yourself
> and debug the blocker. The earlier "you drive, I read" arrangement is retired. Saved to memory.

With that unblocked, the two deferred scenarios were captured in full:

- **#2 My Profile** → module **`MYPR`** (not the invented `APRF`), 8 cases. `/dashboard/my-profile`
  is the SHARED C1 profile page, not admin-only. No field declares `maxlength`; no password rules are
  shown; `Location` has three identities (label / `profile.country` / id `gigya-textbox-zip`); and no
  attribute identifies the active tab. Validation cases are written but NOT run — `testt1@mailsac.com`
  is the admin suite login, so they need a disposable account.
- **#11 tab navigation** → 3 cases on `ASHL`. Five tabs, real hrefs. Traps: **`aDetail-3` is skipped**
  (1,2,4,5,6); **STUDENTS routes to `/learner`**, not `/student`; and the **active marker is on the
  parent `<li>`** — every anchor className is identical, so asserting on the link class is a false green.

**Final: 21 TCs (12 Positive · 4 Edge · 5 Negative), all 6 Batch A scenarios covered, nothing deferred
within Batch A.** Modules: `ASHL` 7 · `MYPR` 8 · `INVI` 5 · `FOOT` 1.

The accessibility gap appeared **twice** — school tabs and profile tabs both lack `aria-current` /
`aria-selected`. Worth one combined ticket; the profile tabs are the more severe, having no indicator
at all.

---

## 9. Batch B — school context (#4, #5, #10, #12)

Built the same day, into the **same document** (the skill's one-document-per-area rule). Driven
entirely by the agent — including re-logging in after the session expired — per the §8 instruction.

**Existing-coverage audit first**, applying §3's lesson. `SADB` (`schoolAdminDashboard`) already
existed but held **one** case and three selectors; `LIBR` had 31. Both were **extended**, never
renumbered: `TST_SADB_TC_2..4`, `TST_LIBR_TC_32`. Only `SKEY` (change school key) is new.

### The find of the batch

**Change school key is irreversible and two clicks away.** School settings → Change school key
raises a dialog whose copy was captured **verbatim from the pre-rendered DOM without triggering it**:

> ⚠ **CAREFUL!** / **Changing the school key cannot be undone** /
> *This action is recommended only if your current school key has been compromised*

`FCN-CHZ-PDA`'s key is hardcoded in `schoolAdminAddClassData.json`, so running this on the shared
school would break **every admin suite at once, permanently**. `TST_SKEY_TC_3` is **Blocked at
design time** — golden rule 4 doing exactly the job it exists for. The free-capture trick (§A6) is
what made it possible to verify the expected copy anyway, at zero risk.

### Also found

- **`admin-shared.md` §A1 was wrong** — School settings has **three** items, not two. Corrected in
  place as a dated correction. qids are non-contiguous (2, 7, 8); `adEdit-3`/`4` are dialog buttons.
- **MQA/CQA visibility (#5) cannot be specified yet.** Two CQA-*titled* products are visible on a
  non-MQA school — but a title is not a licence, so this is recorded as an **observation, not a
  defect claim**. Blocked twice over: no non-MQA admin account exists (`testt1@mailsac.com` is
  itself an MQA admin), and the product team must define what marks a product as MQA/CQA-gated.
- **The org slug is not derivable** from name or key (`FCN-CHZ-PDA` → `org_perf_testschool_1`).
- **Open question raised:** the per-account server-side Filter/Search persistence (§A4) is untested
  across organisations. A leak would be a real defect for a multi-org admin.
- **School key is display text**, not an editable field — `span.school-code` plus a Copy button.

### State after Batch B

**29 TCs — 17 Positive · 5 Edge · 7 Negative.** 27 Not Run, **2 Blocked** (`TST_SKEY_TC_3`,
`TST_LIBR_TC_32`). 15 carry an `[ASSUMED]`.

| Module | IDs | Status |
|---|---|---|
| `ASHL` | `TC_1..7` | new |
| `MYPR` | `TC_1..8` | new |
| `SKEY` | `TC_1..4` | new |
| `INVI` | `TC_7..11` | extended |
| `SADB` | `TC_2..4` | extended |
| `FOOT` | `TC_10` | extended |
| `LIBR` | `TC_32` | extended |

**10 of the 14 source scenarios are covered.** Batch C (#6, #9, #13, #14) remains — note **#14
creates a real class**, so it will need the same care as `TST_SKEY_TC_3`.

### Blockers to clear

1. A **disposable school** — unblocks `TST_SKEY_TC_3`.
2. A **non-MQA admin account** + a definition of *MQA/CQA product* — unblocks `TST_LIBR_TC_32`.
3. A **disposable user account** — unblocks `TST_MYPR_TC_5..7` from Batch A.

All three are account/environment provisioning, not design work.

---

## 10. Batch C — cross-app (#6, #9, #13, #14): the set is COMPLETE

Audit first again, and it paid off hardest here: **#6 was already automated end to end** — footer
launch (`TST_FOOT_TC_7`), entry (`TST_DINS_TC_1`) and all eight wizard steps (`SUSA`/`SCTY`/`NTCH`/
`SNAM`/`SLOC`/`SADR`/`SCON`/`SRQS`). Writing that scenario from scratch would have duplicated ~20
existing cases. **The real gap was two things:** nothing SUBMITS the request, and every existing step
case asserts only the *enabling* direction, never the disabled half. Two cases, not twenty.

### Findings

- ⚠️ **The role toggle is named differently in each view** — `.can-toggle__switch` (admin) vs
  `.can-toggle-switch` (teacher). A selector for one **silently fails** in the other, breaking exactly
  the round trip it is used for. Use `#teacher-admin-toggle` and read `checked`.
- ⚠️ **The two views show different school estates** — 7 administered vs 8 taught-at, including two
  schools absent from the admin list. And the teacher view **groups by display name**, so the two
  schools both called *3 July Test School 1* collapse into one group there.
- ⚠️ **All 7 teacher-view `Create class` buttons share qid `tDashboard-ncls-btn-1`.** The button must
  be found through its school-group heading or a class lands on the wrong school — the crux of #14.
- **The change-school-key dialog is on EVERY admin tab** (shared chrome), inflating every tab's modal
  count by one and matching any unscoped modal selector.
- **The 50-cap warnings share a two-line pattern differing only in the verb** — *delete* for classes,
  *remove* for students. A single shared assertion string would be wrong.

### Final state — the whole set

**37 TCs — 21 Positive · 7 Edge · 9 Negative. All 14 source scenarios covered; nothing deferred.**
34 Not Run, **3 Blocked**, 18 carrying an `[ASSUMED]`.

| Module | IDs | |
|---|---|---|
| `ASHL` | `TC_1..10` | new |
| `MYPR` | `TC_1..8` | new |
| `SKEY` | `TC_1..4` | new |
| `INVI` | `TC_7..11` | extended |
| `SADB` | `TC_2..7` | extended |
| `SRQS` | `TC_2..3` | extended |
| `FOOT` | `TC_10` | extended |
| `LIBR` | `TC_32` | extended |

**Only 3 of 8 modules are new.** Five extend existing ones — the direct result of auditing before
designing, which is the lesson §3 paid for the hard way.

### Blocked (3) and data-creating (2)

| Case | Why |
|---|---|
| `TST_SKEY_TC_3` | **irreversible** key change; would break every admin suite |
| `TST_LIBR_TC_32` | no non-MQA account **and** no definition of an MQA/CQA product |
| `TST_SRQS_TC_2` | raises a **real institution request** into a human queue |

`TST_SADB_TC_7` (creates a real class) and `TST_SRQS_TC_2` are the only data-creating cases — they
must never share a suite with the side-effect-free ones.

### What unblocks the rest

Four provisioning items, none of them design work: a **disposable school**, a **disposable user
account**, a **non-MQA admin account** with a definition of *MQA/CQA product*, and a decision on
whether **Thor institution requests** are safe to raise.

Plus one genuinely unanswered product question: **does the per-account server-side Filter/Search
persistence leak across organisations?** Untested, and a leak would be a real defect for a multi-org
admin.

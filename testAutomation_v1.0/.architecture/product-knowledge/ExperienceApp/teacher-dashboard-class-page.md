# Teacher dashboard & class page — create a class (teacher side)

> Screen file (ADR-020). Read `c1-core-shared.md` first.
> Modules: **`ENTE`** / `CREA` (`createNewClass.page.js`, `createNewClass.test.js`), **`DASH`**
> (`dashboard.page.js`). Living document — append, never overwrite; `[ASSUMED]` until seen live.
> *First seeded: [2026-09-22]* — SOURCE playwright-automation-c1 `DashboardPage.createClass` +
> live runs on production.

---

## Part A — Product behaviour

### A1. Create a class (teacher)
Dashboard **Create class** → class name → Next → **Add materials** → search → pick the material →
Add to class → (collaborative info dialog) → Finish → *"Class successfully created"* → Go to
dashboard → the class card → class page with the **class key** (`span.class-code`, e.g. `NzV2-Abmg`).

- **Search results are ranked, not exact** — the first result is not necessarily the searched
  material. Results: `li.dropdown-item.p-0`; the picked one is echoed at `[for='material0'] span`.
- **"This material is collaborative"** dialog (`#addMaterialInfoModal`, title
  `#addMaterialInfoModalLabel`, close `#addMaterialInfoModalCloseLink` / `qid="t-ami-link-2"`)
  opens after **Add to class** for a collaborative material (e.g. `cqaautomationbundle1`) and
  **blocks Finish** until closed. `[2026-09-22, prod trace]`
- Teacher-side creation is **synchronous** (success heading straight after Finish) — unlike the
  admin bulk form (`admin-shared.md` §A4). SOURCE saw the dashboard list lag after a class change
  (REL), so allow time for the new card to appear.
- SOURCE: material search can take minutes on a slow day `[ASSUMED on prod — seconds in our runs]`.
- **"Add materials" opens its dialog only after `/dashboard/api/teacher-materials` answers.** `[2026-09-24, prod]`
  Near-instant on 2026-09-23; during the production disruption ("Temporary disruption to Cambridge One") it took
  ~8.5–9 s (up to ~20 s) in probes and > 30 s in a failed full run. `click_addMaterial_btn` now waits up to 90 s and
  FAILS at that step if the dialog never opens (before, it ignored a 30 s wait's result and the failure showed one
  step later, at the search). In one disrupted run every class step "passed" yet the class was created WITHOUT
  its product (teacher Materials: "This class isn't using any learning materials at the moment") — a product-side
  failure, not reproduced; report it if it recurs, do not work around it.

### A2. Invite a learner → learner accepts (SLE school) `[2026-09-22, prod]`
- Teacher: class → students (`cView-43`) → Add students → **Adults** → Next → e-mail → Invite; the
  address shows in `#pending-students-container`.
- Learner: the invite reaches the bell within seconds on prod (SOURCE: up to ~2 min). Opening it
  renders the invitation list, **then routes to `/dashboard/invitation/main` and re-renders it** —
  a tick made before that route is lost and Accept stays disabled. **Sometimes the page then reloads
  itself once more, to `/dashboard/invitation/main?back=true`, ~450 ms after the notification click**
  (seen in a failing prod trace; absent in other runs — intermittent) — this also wipes a tick, so the
  URL alone is not a "settled" signal. `[2026-09-22]` Each row's checkbox is
  `input.select-class-checkbox[aria-label='Select <class name>']`; "Select all" is `#select-all-checkbox`.
- After Accept → Go to dashboard, on an **SLE-licensed school** the class card shows its
  **Practice Extra** tile and **no activation-code prompt** (`#activationCodeInput` absent).

---

## Part B — Automation notes

- **Invite/accept TCs:** `CREA_TC_30` (the e-mail is pending — `CREA_TC_24` only waits for the
  heading); `INVI_TC_101` housekeeping bell wait; **`INVI_TC_13`** ticks the invitation by class name
  after the route settles AND the document has survived 1.5 s without being replaced
  (`waitForStableDocument` in `invitationNotification.page.js` — a `window` marker that a reload
  erases) — used instead of `INVI_TC_3` "Select all", which races the re-render. `[2026-09-22]` The
  URL-only version failed on the user's run (tick at +297 ms, `?back=true` reload at +454 ms); a
  synthetic self-reloading page reproduces it: old code → tick gone 1 s later, new code → tick kept;
  `DASH_TC_13` SLE access (class card by name → component tile inside it → no activation prompt).
- `INVI_TC_2` clicks the FIRST notification title (positional) — fine for a brand-new learner whose
  only notification is the invite; not safe for a learner with other notifications.

- ⚠️ **`ENTE_TC_20` / `ENTE_TC_23` are positional despite their names**
  (`click_dev_test_ebook_bundle_104_bundle*`): they click the FIRST result
  (`a[qid="material-modal-component-0"]`) and the first radio (`div.check`). Used with any other
  search they can build the class with the wrong material and still pass. New work uses
  **`ENTE_TC_24`** (`select_materialByName`, exact-name match + read-back). The old TCs are left
  untouched because other suites use them.
- `ENTE_TC_26` closes the collaborative dialog (asserts shown + title + closed). The shared
  `click_addToClass_Btn` was deliberately not changed.
- `ENTE_TC_25` (`getData_createdClass`) finds the class **by name** on the dashboard (never by
  position), reads the key and stores it as run value `lpClassKey` (ADR-022).
- `DASH_TC_12` (`close_introTourIfShown`) — run after every fresh teacher login before clicking
  anything (tour returns each login; `c1-core-shared.md` §A2).
- Reused unchanged in the LP suite: `DASH_TC_10`, `ENTE_TC_3/9/18/19/21/22`.

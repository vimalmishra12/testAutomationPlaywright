/**
 * Generates BOTH the .md document and the .xlsx register for the Onboarding manual test-case set
 * from _tcdata.js, so the two cannot drift (SKILL golden rule 6).
 *
 *   node test/Manual/C1App/Onboarding/_generate.js
 *
 * Pattern copied from LearningPath/_generate.js, plus a 15th column "Automation Scope" (the
 * source's red/yellow = not-for-automation marking, user decision 2026-09-24) — the same kind of
 * extra column the Students register carries ("Automation Status"). Before re-running after hand
 * edits to the .md/.xlsx, back-port them into _tcdata.js first (SKILL golden rule 11).
 */

const fs = require("fs");
const path = require("path");
const ExcelJS = require("exceljs");
const D = require("./_tcdata.js");

const BASE = "Onboarding_test_cases";
const DATE = "2026-09-25";

const COLUMNS = [
  "S.No.", "Test Case ID", "Title", "Linked Requirement", "Type", "Priority",
  "Preconditions", "Test Steps", "Test Data", "Expected Result", "Remarks",
  "Actual Result", "Status", "Comments / Defect ID", "Automation Scope",
];

const SCOPE_TEXT = {
  AUTO: "Automate",
  RED: "Manual only — RED in source (not for automation)",
  YELLOW: "Manual only — YELLOW in source (not for automation)",
};
const SCOPE_FILL = { RED: "FFFF0000", YELLOW: "FFFFFF00" };

// Grouped by requirement (source row), Positive → Edge → Negative within a group; S.No. follows.
const order = { Positive: 0, Edge: 1, Negative: 2 };
const grouped = D.REQS.flatMap((req) =>
  D.TCS.filter((t) => t.req === req).sort((a, b) => order[a.type] - order[b.type]));
const rows = grouped.map((tc, i) => Object.assign({ sno: i + 1, status: "Not Run", comments: "" },
  Object.fromEntries(Object.entries(tc).filter(([, v]) => v !== undefined))));

// Guards: every TC maps to a known requirement; no duplicate IDs; every requirement is covered or explained.
const unknown = D.TCS.filter((t) => !D.REQS.includes(t.req));
if (unknown.length) throw new Error("TC with unknown requirement: " + unknown.map((t) => t.id).join(", "));
const dup = rows.map((r) => r.id).filter((id, i, a) => a.indexOf(id) !== i);
if (dup.length) throw new Error("Duplicate Test Case IDs: " + dup.join(", "));
const gap = D.REQS.filter((req) => !rows.some((r) => r.req === req) && !D.NOT_COVERED[req]);
if (gap.length) throw new Error("Requirement with no TC and no reason: " + gap.join(" | "));

const counts = rows.reduce((a, r) => ((a[r.type] = (a[r.type] || 0) + 1), a), {});
const byScope = (s) => rows.filter((r) => r.scope === s);
const existing = rows.filter((r) => r.existing);
const byStatus = rows.reduce((a, r) => ((a[r.status] = (a[r.status] || 0) + 1), a), {});
const suffix = (t) => (t === "Edge" ? " (E)" : t === "Negative" ? " (N)" : "");
const scopeTag = (s) => (s === "RED" ? " 🔴" : s === "YELLOW" ? " 🟡" : "");
const cell = (v) => String(v).replace(/\n/g, "<br>").replace(/\|/g, "\\|");
const ids = (list) => list.map((r) => r.id).join(", ");

function coverageMap() {
  return D.GROUPS.map((g) => {
    const reqs = D.REQS.filter((req) => D.GROUP_OF[req] === g);
    return "| **" + g + "** | |\n" + reqs.map((req) => {
      const mine = rows.filter((r) => r.req === req);
      return "| " + req + " | " + (mine.length ? mine.map((r) => r.id + suffix(r.type) + scopeTag(r.scope)).join(", ") : D.NOT_COVERED[req]) + " |";
    }).join("\n");
  }).join("\n");
}

function tcTable(r) {
  const pairs = [
    ["S.No.", r.sno], ["Test Case ID", r.id], ["Title", r.title], ["Linked Requirement", r.req],
    ["Type", r.type], ["Priority", r.priority], ["Preconditions", r.pre], ["Test Steps", r.steps],
    ["Test Data", r.data], ["Expected Result", r.expected], ["Remarks", r.remarks],
    ["Actual Result", r.actual || "*(blank in design)*"], ["Status", r.status],
    ["Comments / Defect ID", r.comments || "*(blank in design)*"],
    ["Automation Scope", SCOPE_TEXT[r.scope] + scopeTag(r.scope)],
  ];
  return "| Field | Value |\n|---|---|\n" + pairs.map(([k, v]) => "| **" + k + "** | " + cell(v) + " |").join("\n");
}

function sections() {
  return D.GROUPS.map((g) => {
    const reqs = D.REQS.filter((req) => D.GROUP_OF[req] === g);
    return "\n## " + g + "\n" + reqs.map((req) => {
      const mine = rows.filter((r) => r.req === req);
      return "\n### Requirement " + req + "\n\n"
        + (mine.length ? mine.map(tcTable).join("\n\n---\n\n") : "_" + D.NOT_COVERED[req] + "_") + "\n\n---\n";
    }).join("");
  }).join("");
}

const modules = [...new Set(rows.map((r) => r.id.split("_")[1]))];
const moduleLine = (m) => {
  const mine = rows.filter((r) => r.id.split("_")[1] === m);
  return "- **" + m + "** — " + mine.length + " (" + ids(mine) + ")";
};

const md = `# Manual Functional Test Cases — Cambridge One: Onboarding (Batch 1)

**Source:** \`OnboardingApp_Test_Plan.xlsx\` (supplied by the user ${DATE}) — sheet "Test Cases", 60 scenarios in 11 sub-modules (\`TC_HOME_*\`, \`TC_LOGIN_*\`, \`TC_FPWD_*\`, \`TC_RESETPW_*\`, \`TC_ROLE_*\`, \`TC_LRN_*\`, \`TC_TCH_*\`, \`TC_PAR_*\`, \`TC_CHLD_*\`, \`TC_INVITE_*\`, \`TC_XCUT_*\`) + sheet "Legend"
**Modules:** by the page object each case will live on (AGENTS.md Rule 6) — LAND (\`landing.page.js\`), FOOT (\`footer.page.js\`), LOGI (\`login.page.js\`), APPS (\`appShell.page.js\`), RESE (\`resetPassword.page.js\`), SNUP (\`signup.page.js\`), CREA (\`createNewClass.page.js\`), SPRF (\`studentProfile.page.js\`), INVI (\`invitationNotification.page.js\`), **PCHD (\`parentChild.page.js\` / \`parentChild.test.js\` — approved)**
**App:** Cambridge One — thor \`https://micro-nemo.comprodls.com\` (general target); production \`https://www.cambridgeone.org\` for sign-up and e-mail-verification suites using disposable Mailsac accounts (user confirmed 2026-09-24)
**Pages in scope:** pre-login homepage \`/home\`, Log in \`/login\`, Reset password, role selection \`/regoptions\`, Learner age gate \`/learner-age-check\`, Teacher/Learner/Parent registration forms, parent "My children", class-invite sign-up, first-login / temporary-password screens
**Generated:** ${DATE} | **Total TCs:** ${rows.length} (${counts.Positive || 0} Positive · ${counts.Edge || 0} Edge · ${counts.Negative || 0} Negative) — **59 of the source's 60 scenarios have a case**; TC_XCUT_009 (UI/colours) is a visual-layer check, not a manual case (see map)
**Execution status (${DATE}):** ${Object.entries(byStatus).map(([k, v]) => "**" + v + " " + k + "**").join(" · ")} — Batch 1 automated & verified on Production (onboardingB1Test_prod, 27/27 passing across 5 suites).
**Automation scope (user, ${DATE}):** **${byScope("AUTO").length} to automate** · **${byScope("RED").length + byScope("YELLOW").length} manual only** — 🔴 RED ${byScope("RED").length} (${ids(byScope("RED"))}) · 🟡 YELLOW ${byScope("YELLOW").length} (${ids(byScope("YELLOW"))}). Column 15 "Automation Scope" carries it on every row; the \`.xlsx\` also colours those rows' ID cells red/yellow as the source did.

**TCs per module:**
${modules.map(moduleLine).join("\n")}

> **Ordering:** grouped by **sub-module**, then by Linked Requirement (= one source row); Positive → Edge
> → Negative within a group. **S.No.** follows that order; **Test Case IDs** are stable and so appear out of
> numeric sequence.
>
> **IDs.** Each module continues its own numbering (registry, test files and every register checked
> ${DATE}: LAND 6+, FOOT 12+, LOGI 7+, RESE 6+, SNUP 65+, CREA 31+, SPRF 24+, INVI 14+, PCHD 1+). Where an
> existing automated TC already proves a row's outcome, the row **reuses that ID** instead of minting a
> duplicate function (ADR-011) — its Remarks start "EXISTING TC reused". Source rows TC_HOME_005 and
> TC_HOME_006 (several footer links each) are **split one case per link**, because every link already
> has its own FOOT TC. TC_RESETPW_001/002 are split into "staff sets a temporary password" (CREA / SPRF)
> + the student's shared first-login screen (TST_LOGI_TC_18).
>
> **Grounding.** Steps and expected results are the source team's; its Legend says the age-gate
> thresholds were confirmed live. **Nothing here was re-executed in this session.** Everything the
> source itself calls unverified, and any copy it does not state, is marked \`[ASSUMED]\` — confirm live
> in \`c1-test-authoring\` Phase 1.
>
> **Data.** Cases marked CREATES REAL DATA (account signups, invite signup, child account) or that
> change a real password (TST_RESE_TC_9, TST_CREA_TC_31, TST_SPRF_TC_24, TST_LOGI_TC_9 lockout) need a
> disposable/run-generated account (ADR-022 \`{{run.*}}\`) or dedicated test user and the user's OK on a shared environment
> (ADR-021). Passwords come from \`{{env.*}}\` tokens only (ADR-023).

---

## How to automate a case from this register

1. **Do not redesign.** Pick a row whose **Automation Scope is "Automate"** and Status \`Not Run\`; keep its
   **Test Case ID** — that ID goes into the test file, the TC repository and the execution file.
   Never renumber; a genuinely new case is appended.
2. **Never automate a 🔴/🟡 row** — they are manual-only by user decision (${DATE}).
3. **"EXISTING TC reused" rows** are already automated: confirm the existing function asserts the row's
   Expected Result, extend it if not — do not write a second function (ADR-011).
4. **Read first:** \`.architecture/authoring-status.md\` → block \`onboarding\` → "NEXT BATCH" (batch order,
   open questions, constraints), then \`product-knowledge/ExperienceApp/c1-core-shared.md\` and \`onboarding.md\`,
   then follow \`.agent/skills/c1-test-authoring\`.
5. **\`[ASSUMED]\` is a question, not a fact** — confirm it live and replace it with what was seen.
6. **Close the loop:** back-port into \`_tcdata.js\`, run \`node test/Manual/C1App/Onboarding/_generate.js\`
   (rewrites both \`.md\` and \`.xlsx\` — never hand-edit them), then set Status/Comments.

**Suggested automation batches** (side-effect free first, per migration plan §4.2):
- **B1 (no data):** TST_SNUP_TC_65, 66, 67, 68, 69, 70, 71, 76, 77, 78, TST_LOGI_TC_7, 10, TST_RESE_TC_6, TST_LAND_TC_6, 7, 8, 9 + confirm the reused LAND/FOOT/LOGI/RESE/SNUP_TC_59/63 rows.
- **Login with fixture accounts:** TST_LOGI_TC_8, 14, TST_APPS_TC_2 (learner), TST_RESE_TC_7, 8.
- **Creates data (ask first):** TST_SNUP_TC_72, 73, 74, 75, TST_LOGI_TC_9, TST_RESE_TC_9, 10, TST_CREA_TC_31, TST_SPRF_TC_24, TST_LOGI_TC_18, TST_INVI_TC_14, 15, TST_PCHD_TC_1–3.

---

## Requirement → Test Case coverage map

🔴 / 🟡 = manual only (red / yellow in the source). (E) Edge · (N) Negative.

| Linked Requirement (source row) | Mapped TC IDs (P → E → N) |
|---|---|
${coverageMap()}

---

## Product reference (from the source workbook's Legend and cases, ${DATE} — not yet re-seen by us)

- **Learner age gate** — Learner self-signup only. Threshold is **location-dependent**: India blocks
  13–15 and allows 16+; United Kingdom blocks 11–12 and allows 13+ (source: confirmed live). Blocked
  copy: *"We're sorry … Cambridge One welcomes every learner, but our younger students need an adult's
  help to set up an account … Please ask your parent or teacher to sign you up"* + "Go back". Teacher,
  Parent and invite-based Learner sign-up have **no** age gate. Age options: 18+, then 17 down to 5.
- **Registration forms** — Teacher: First name, Last name, Work email, Password, Location (autocomplete),
  Terms checkbox. Learner: School email; Location pre-filled from the age screen and locked. Parent:
  adds *"I am 18 years of age or older and I am the parent or guardian of any child whose account I set
  up"*. Invite sign-up: School email pre-filled and disabled, Location empty and editable.
- **Validation copy** — "This field is required" · "E-mail address is invalid." · "Password does not
  meet complexity requirements" · Terms alert "Please confirm that you have read and understood the
  Terms of use".
- **Login copy** — blank: "Please enter your username or email address" / "Please enter your
  password"; wrong password: "Please check your login and password and try again. You are limited to 5
  attempts, or you can reset your password". Lockout after 5 consecutive failures (2-minute lockout duration).
- **Reset password** — blank: "This field is required"; any e-mail (registered or not): "Reset password
  email sent" + *"If your email is linked to a Cambridge account, you will receive a link to reset your
  password. If you don't receive it, please check your junk mail"* — identical by design.
- **First-login Terms gate** — a bulk-created adult username account meets "Welcome to Cambridge One"
  + "I accept the Terms of use" + Submit once, on its first login.
- **Temporary password** — a Teacher (class roster → Options → Change password) or Admin (Students tab
  → Action Menu, [ASSUMED]) sets a temporary password; the student's next login shows a screen for the
  temporary password + new password + confirmation before the dashboard.
- **Other sign-in routes** — Support Admin: Okta SSO via \`<app URL>/?p=<email>&t=saml\` →
  identity.cambridge.org; Edulog: \`<app URL>/edulog\` (SAML option); CambridgeGO: thor
  cambridgedev.org/go-dev/, other lower envs /go-stg/, prod cambridge.org/go. Facebook / Google / Apple
  buttons on the Log in form and every registration form.
- **Homepage footer** — same tab: Terms of use, Privacy Notice, "Accessibility on Cambridge One",
  "Do I need a school account?"; new tab: Our approach (Cambridge English), FAQs and Help (help centre).

---

## Section — Test Cases (grouped by sub-module, then Linked Requirement)
${sections()}
## Open items / \`[ASSUMED]\` to confirm on the next live pass

1. **No live grounding yet** (all rows): expected results are the source team's. Confirm live in Phase 1, starting with the side-effect-free B1 set.
2. **TST_SPRF_TC_24 entry point** \`[ASSUMED]\` (source Legend): Students tab row Action Menu → change password. Also settle its overlap with TST_SPRF_TC_8 / TST_SPRF_TC_23 (Manage account → Password tab) — same flow or two?
3. **TST_RESE_TC_10 vs TST_RESE_TC_9**: the source's TC_FPWD_005 already ends with the login that TC_FPWD_006 checks. Keep both, or fold TC_10 into TC_9?
4. **TST_LOGI_TC_9 (lockout)**: Lockout duration is confirmed as 2 minutes (user confirmed 2026-09-24); executed against the dedicated test user \`cqatestuserforblockDND@mailsac.com\`. Unblocked.
5. **Copy not stated by the source**: guardian-checkbox error (TST_SNUP_TC_75), child-form inline errors (TST_PCHD_TC_2), teacher Change-password confirmation (TST_CREA_TC_31) — capture verbatim.
6. **Sign-up / Email verification environment**: Sign-up and email-verification suites run on Production using disposable Mailsac accounts (\`learningPathTest_prod\` pattern; user confirmed 2026-09-24).
7. **Module PCHD**: Approved module code \`PCHD\` (\`parentChild.page.js\` / \`parentChild.test.js\`).
8. **Footer TCs TST_FOOT_TC_4/6/8** are registered but commented out in \`footer.test.js\`; they need re-enabling with a new-tab assertion.
9. **TC_XCUT_009 (UI/colours)**: no manual case — handled by \`visualTest\` promotion at Phase 3 (AGENTS.md §8). Confirm that is acceptable.
`;

async function main() {
  const dir = __dirname;
  fs.writeFileSync(path.join(dir, BASE + ".md"), md);

  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("Test Cases");
  ws.addRow(COLUMNS);
  rows.forEach((r) => {
    const row = ws.addRow([r.sno, r.id, r.title, r.req, r.type, r.priority, r.pre, r.steps,
      r.data, r.expected, r.remarks, r.actual || "", r.status, r.comments, SCOPE_TEXT[r.scope]]);
    if (SCOPE_FILL[r.scope]) {
      [2, 15].forEach((c) => {
        row.getCell(c).fill = { type: "pattern", pattern: "solid", fgColor: { argb: SCOPE_FILL[r.scope] } };
      });
    }
    if (r.status === "Pass") {
      row.getCell(13).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFD4EDDA" } };
      row.getCell(13).font = { bold: true, color: { argb: "FF155724" } };
    }
    if (r.status === "Blocked") {
      row.getCell(13).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFF0000" } };
      row.getCell(13).font = { bold: true, color: { argb: "FFFFFFFF" } };
    }
  });
  ws.getRow(1).eachCell((c) => {
    c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF3D1A66" } };
    c.font = { bold: true, color: { argb: "FFFFFFFF" } };
  });
  ws.views = [{ state: "frozen", ySplit: 1 }];
  ws.columns.forEach((col, i) => { col.width = [6, 18, 50, 45, 10, 9, 45, 45, 35, 50, 50, 20, 10, 30, 28][i]; });
  ws.eachRow((row) => row.eachCell((c) => { c.alignment = { wrapText: true, vertical: "top" }; }));
  // Status dropdown (manual-test-standard.md), rows 2..N.
  for (let i = 2; i <= rows.length + 1; i++) {
    ws.getCell("M" + i).dataValidation = { type: "list", allowBlank: true,
      formulae: ['"Not Run,Pass,Fail,Blocked,On Hold"'] };
  }
  try {
    await wb.xlsx.writeFile(path.join(dir, BASE + ".xlsx"));
    console.log("Wrote " + BASE + ".md + .xlsx — " + rows.length + " TCs", counts,
      "scope:", { AUTO: byScope("AUTO").length, RED: byScope("RED").length, YELLOW: byScope("YELLOW").length },
      "existing reused:", existing.length, "status:", byStatus);
  } catch (err) {
    if (err.code === "EBUSY") {
      console.warn("⚠️ Wrote " + BASE + ".md, but could not overwrite " + BASE + ".xlsx because it is currently open in Excel. Please close it in Excel to allow updates.");
    } else {
      throw err;
    }
  }
}

main().catch((e) => { console.error(e); process.exit(1); });

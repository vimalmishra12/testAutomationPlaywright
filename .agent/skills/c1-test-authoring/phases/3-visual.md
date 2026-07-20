# Phase 3 — Visual Assessment & Promotion (mandatory gate)

**Goal:** every TC of the feature has an explicit visual-test decision. This phase exists because
the assessment is MANDATORY for every new TC (AGENTS.md §8) — "the suite is green" does not close
a feature. Entry condition: Phase 2 ✅ in `.architecture/authoring-status.md`.

**AGENTS.md §8 is the authoritative text for this phase** — the formats below mirror it; if they
ever diverge, AGENTS.md wins.

## Steps

### 1. Build the worklist

Take the TC list (and the visual candidates flagged in Phase 1's status block) and, for EACH TC,
classify its test data against the decision table:

| Data Type | Examples | Visual Test Candidate? |
|---|---|---|
| Fixed/static content | Constant text, standard mock accounts, static eBook pages, fixed UI labels | ✅ Yes — confirm with user |
| User-generated keys | Class codes, auto-generated IDs, invite codes | ❌ No — always false |
| Timestamps / dates | Enrollment dates, last-login, session times | ❌ No — always false |
| Environment-variant text | Env-specific labels, feature-flagged UI, region-specific content | ❌ No — always false |
| Paginated / dynamic counts | Long lists, result counts, dynamic rankings | ❌ No — always false |
| Randomized / computed values | Random names, auto-incremented numbers | ❌ No — always false |

**Any ❌ row ⇒ `visualTest` stays `false`. Do not ask the user — it is not a judgment call.**

### 2. Present the assessment and STOP (per candidate TC)

For each ✅-candidate, present AGENTS.md §8 Rule A Step 1 — the
"📋 VISUAL TEST ASSESSMENT — Thought Summary" block (TC id, description, per-field data analysis
table mapping each field to a decision-table row, overall conclusion + one-sentence reason) —
then STOP and wait for the user's "validate" (or corrections).

### 3. Promotion confirmation (only after "validate")

Present AGENTS.md §8 Rule A Step 2 — the "⚠️ VISUAL TEST PROMOTION — Confirmation Required" block —
and wait for an explicit yes/no **before touching the TC repository**. Only on "yes":
`"visualTest": false → true` in `<App>TCRepository.json`.

### 4. Dual scripts (Rule B — only if at least one TC was promoted)

The exec file now contains a visual TC, so package.json needs BOTH scripts (protected file —
present the confirmation format and wait):

```
"<feature>Test_<env>":              "node core/runner/run.js --appType=<App> --testEnv=<env> --testExecFile=<name>.json --browserCapability=desktop-chrome-1920"
"visualAcceptance_<feature>_<env>": "node core/runner/run.js --appType=<App> --testEnv=<env> --testExecFile=<name>.json --browserCapability=desktop-chrome-1920 --visual=novus --skipAssertion=true"
```

Naming is Rule C: `visualAcceptance_<feature>_<env>` — no other pattern.

### 5. Run BOTH scripts and verify

- Functional script → still green.
- Visual script → first run bootstraps the baseline (everything "passes" as new — baselines are
  NOT committed, each runner owns its own); **re-run** for a real comparison. Timeline report:
  `output/reports/TestReports/visual/index.html`.

## Exit checklist (mandatory — closes the feature)

- [ ] EVERY TC has an explicit decision (promoted / stays false with decision-table reason).
- [ ] If promoted: both scripts exist (confirmed), both ran, baseline bootstrapped + compared.
- [ ] Update `.architecture/authoring-status.md`: **remove the feature's block** (the file holds
      in-flight work only). If nothing was promotable, remove it too — "assessed, no candidates"
      goes in the walkthrough.
- [ ] Session walkthrough written/appended, recording each TC's decision and who confirmed.
- [ ] Tell the user: feature closed.

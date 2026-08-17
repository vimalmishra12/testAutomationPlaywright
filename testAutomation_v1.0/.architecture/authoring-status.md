# Authoring Status — in-flight phased test authoring

> **Live state file** for the `c1-test-authoring` phased workflow (router → Phase 1 build →
> Phase 2 run/fix → Phase 3 visual). One block per test currently in flight. The skill reads
> this file at session start to resume from the first ⬜ phase, and each phase's exit checklist
> updates it. **Remove a block when Phase 3 completes** — an empty file means nothing is pending.
> History lives in the session walkthroughs, never here.

## Block format

```markdown
## <testName> (<App>, <env>)
- Phase 1 (build):   ✅ <date> — TST_<MOD>_TC_1..<N> registered; visual candidates: <list|none>
- Phase 2 (run/fix): ⬜ pending
- Phase 3 (visual):  ⬜ pending
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
BCCF_TC_3 (add teacher), TC_5 (add label), TC_7 (duplicate),
TC_8 (copy existing class), TC_9 (bulk set dates), TC_10 (CSV template download),
TC_11 (CSV upload), TC_12 "Create more classes" leg, and the enriched TC_1 toolbar assertions.
(BCCF_TC_2/4/12-back-to-dashboard already covered by TST_CCLS_TC_1..8; BCCF_TC_6 done below.)

## schoolAdminAddClassBulk (ExperienceApp, thor)
Scenario #3 POSITIVE — bulk multi-row behaviour, `CCLS` module, **creates no class**
(asserts the Create-button count delta only).
- Phase 1 (build):   ✅ 2026-08-14 — TST_CCLS_TC_13 registered (BCCF_TC_6); visual candidates: none
  — the Create-button label embeds a dynamic row count (paginated/dynamic-count row of the
  AGENTS.md §8 table), so it stays `visualTest: false`.
- Phase 2 (run/fix): ✅ 2026-08-14 — 3/3 passing, 2 consecutive clean runs (run directly via
  `node core/runner/run.js --testExecFile=schoolAdminAddClassBulk.json`). Row-2 qids
  (`dBulkClass-1-2/-1-3/-1-4`) were INFERRED from the row-1 pattern and are now VERIFIED live
  (label went "Create 1 class" → "Create 2 classes").
- Phase 3 (visual):  ⬜ pending
- ⚠️ No npm script yet — `package.json` is protected; add
  `"P1AdminclassBulk_Thor"` once the remaining B1 positives land (needs confirmation).

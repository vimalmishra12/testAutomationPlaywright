# ebookAccessibilityTest (ExperienceApp, thor) — `ebookAccessibilityTest_thor` + `visualAcceptance_ebookAccessibility_thor`
Modules `KBOA` + `EBTF` (one login: focus traversal pages 22/24/26/28, then toolbar traversal on page 26) · knowledge `foc-ebook-reader.md` · plan `PLAN_ebook-foc-suite-merge_2026-09-22.md`
- Phase 1 ✅ 2026-09-23 — 35 steps (`TST_KBOA_TC_1..19`, `TST_EBTF_TC_1..16`); replaces `ebookFocusA11yMergedTest.json` + `ebookToolbarFocusTest.json` (frozen on disk, r4)
- Phase 2 ✅ 2026-09-23 — 35/35 (222.8 s)
- Phase 3 ⬜ — the 16 `TST_EBTF_TC_*` are `visualTest: true` (the 19 KBOA stay false); baselines bootstrapped once (16 PNGs, gitignored), never run in compare mode
- ▶ Now: idle since 2026-09-23 · Next: Phase 3 — re-run the visual script for a real comparison

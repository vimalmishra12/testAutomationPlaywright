# Authoring Status — index

> **Live state for the `c1-test-authoring` phased workflow** (router → Phase 1 build → Phase 2
> run/fix → Phase 3 visual). Since `[2026-09-29]` every in-flight feature has **its own small file in
> [`status/`](status/)**; this file is only the index — where each feature's file is, the markers, the
> file format, the rules, and the one-line list of features whose Phase 3 is deferred. History lives
> in the walkthroughs, never here. The single-file version that preceded this is
> `archive/authoring-status_2026-09-29.md` (and, before compaction, `archive/authoring-status_2026-09-18.md`).

## In-flight features

| Feature | Status file |
|---|---|
| Create-class form — `CCLS` (validation, bulk, workflow suites) | [`status/schoolAdminAddClass.md`](status/schoolAdminAddClass.md) |
| Admin Students tab — `SLST` / `SPRF` / `SBLK` | [`status/adminStudents.md`](status/adminStudents.md) |
| Admin Staff tab — `STFL` / `STFP` / `STFB` | [`status/adminStaff.md`](status/adminStaff.md) |
| Admin Library tab — `LIBR` / `UMBP` | [`status/adminLibrary.md`](status/adminLibrary.md) |
| Admin Generic / shell — `ASHL` `FOOT` `MYPR` `SADB` `SRQS` `SKEY` `INVI` | [`status/adminGeneric.md`](status/adminGeneric.md) |
| New Learning Path — `NLPP` / `CGRP` | [`status/newLearningPath.md`](status/newLearningPath.md) |
| eBook accessibility — `KBOA` / `EBTF` | [`status/ebookAccessibility.md`](status/ebookAccessibility.md) |
| eBook student E2E | [`status/ebookE2Estudent.md`](status/ebookE2Estudent.md) |
| eBook teacher E2E | [`status/ebookE2Eteacher.md`](status/ebookE2Eteacher.md) |
| eBook book-to-book mapping — `EMAP` | [`status/ebookMapping.md`](status/ebookMapping.md) |
| Onboarding (register done, automation not started) | [`status/onboarding.md`](status/onboarding.md) |

## Deferred Phase 3 (visual assessment owed; no status file)

One line per feature whose Phases 1–2 are done and whose Phase 3 the user deferred, with nothing
else in flight (rule 4). Open items live in the register / knowledge file named on the line.

- `learningPath` (`learningPathTest_prod`) — Phases 1–2 ✅ (two consecutive clean full runs 113/113,
  2026-09-24); Phase 3 deferred 2026-09-22 (all TCs `visualTest: false`, run-generated data). Open items:
  register `test/Manual/C1App/LearningPath/` (Blocked rows with reasons); thor Blocked at `SNUP_TC_61`
  (expired certificate, `c1-core-shared.md` §A4); commands and debug mode in `learning-path-player.md` Part C.

## Status markers

| Marker | Meaning |
|---|---|
| ✅ | Phase complete **and verified** — for Phase 1 that means the suite was actually executed |
| ⚠️ | **Built but NEVER EXECUTED** — every selector, timeout and data value is an unverified guess |
| ⬜ | Not started |
| ⏭️ | Deferred by user decision |

> **Why ⚠️ exists.** A Phase 1 that was written from documentation and never run is not
> "complete" — it is an untested hypothesis, and marking it ✅ hands the next person a minefield
> labelled as finished work. `adminClassesTab` shipped as "Phase 1 ✅" having never been
> executed; its first real run was 2/6, and Phase 2 then took ~15 runs because eight unverified
> guesses surfaced simultaneously and entangled with each other. **If you did not run it, it is
> ⚠️, not ✅** — and say why in the file, so the next session knows to distrust every value in it.

## Status file format — the single source

The `c1-test-authoring` phase files point here rather than repeating it.

```markdown
# <feature> (<App>, <env>) — `<npm script>`
<Module(s)> · knowledge `<per-screen file>` · register `<test/Manual/…>`
- Phase 1 ✅ <date> — `TST_<MOD>_TC_…`; <P> passing / <F> failing on first run; visual candidates: <list|none>
- Phase 2 ⬜            (when done: ✅ <date> — <N>/<N> passing, 2 consecutive clean runs)
- Phase 3 ⬜            (⏭️ DEFERRED by user decision <date> — if deferred)
- ▶ Now: <the step in progress> · Next: <the next step>
- On Hold / Blocked / Not built / Follow-up: <one line each, only if any>
```

Built but not yet executed:

```markdown
- Phase 1 ⚠️ <date> — built from documentation, NEVER EXECUTED. Every selector / timeout / data
  value is UNVERIFIED. Blocker: <reason>
```

An area with several modules (e.g. Students: `SLST` / `SPRF` / `SBLK`) keeps **one** file with one
compact phase line per module.

## Rules

1. **One file per in-flight feature** — `status/<feature>.md`, named after the test or area, created
   when Phase 1 starts, with a row in the table above. Separate files mean parallel branches never
   edit the same file (a shared file caused merge conflicts, e.g. `9ef31b8`).
2. **`▶ Now` is replaced, never appended.** After every major step — a Phase 1 step, a fix applied, a
   run finished — rewrite that one line. A session that breaks mid-phase resumes from it.
3. **A new batch updates the same file.** Reset the phase lines for the new batch; the previous
   batch's story goes to the walkthrough. Aim for **≤ 15 lines**; the only exception is a short
   "Start here" plan for a batch that has not started yet (see `status/onboarding.md`).
4. **Delete the file when nothing is left in flight** — Phase 3 ✅, Phase 3 deferred by the user, or
   the suite superseded / retired — **and** every open item (On Hold / Blocked / Not built) is already
   recorded in the register (Status + Comments) or the knowledge file. Remove its row above; a deferred
   feature gets one line under "Deferred Phase 3". Record the closure in the walkthrough.
5. **Status + open items only.** Debugging narrative goes in the walkthrough, durable lessons in the
   product-knowledge file.

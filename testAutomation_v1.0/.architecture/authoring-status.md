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

*(no tests in flight)*

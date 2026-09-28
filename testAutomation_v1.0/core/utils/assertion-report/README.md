# Test Verification Report (ADR-026 — assertion evidence report)

Shown in the page as **Test Verification Report** (results view) / **Test Verification Report: Debug**.

A mochawesome-style HTML report where every element an assertion checked is marked on the
end-of-test screenshot: **✔ green** for a passed check, **✘ red** for the failed one.

## Turn it on

| Flag | Builds | For |
|---|---|---|
| `--assertReport=true` | `index.html` — **results view** | sharing: pass / fail per test and plain ✔ / ✘ marks on the screenshot — no numbers, no check list, no selectors or values in the file |
| `--assertReport=debug` | `index.html` **and** `debug.html` — **full view** | engineers: selectors, values read, why a check has no mark, raw record |
| no flag / `false` | nothing | normal runs — no change at all |

```bash
npm run adminStudentsTabTest_thor -- --assertReport=true
npm run adminStudentsTabTest_thor -- --assertReport=debug
```

At the end of the run the console prints the report path(s):

```
[assert-report] Test Verification Report (results): output/reports/TestReports/assertionReport/<exec>_<env>_<stamp>/index.html
[assert-report] Test Verification Report (debug):   output/reports/TestReports/assertionReport/<exec>_<env>_<stamp>/debug.html
```

Each file is self-contained (screenshots embedded) — open it or send it as is. The header badge says
**Results** or **Debug**. Mochawesome is still produced as usual; the flag also works with `--report=spec`.
Values are case-insensitive; an unknown value warns and builds the results view.

## Reading it

- **Debug view:** each test shows its end-of-test screenshot with numbered marks and, beside it, the numbered list
  of checks. Hover a mark or a check to link them. Checks on the same element share one mark (`2·3·4 ✔`).
- The **results view** is the marked screenshot only: a plain ✔ / ✘ on each element with a confident link (✘ if any
  check on that element failed) and, for a failed test, its one-line error. No numbers or check list.
- In the **debug view**, a dashed outline + "inferred" means more than one element could be the one checked (the
  most likely is drawn), and a check listed **without a mark** says why:

| Label | Meaning |
|---|---|
| no element | the check was not about a read element (a click result, a list length, a URL) |
| absent, as checked | the check was that the element is not there / not shown — and it isn't |
| element gone before screenshot | the element was removed after it was checked |
| changed before screenshot | the element now shows a different value than the one checked (the new value is listed) |
| hidden inside a scroll panel | the element sits in a scrolled-away part of an inner panel |
| not in final screenshot | the element is outside the captured image |

## Rebuilding

Both modes record the same data, and every finished test is written to `evidence.jsonl` as it ends — so a
crashed run can be rebuilt, and a `true` run can be turned into the debug view without re-running:

```bash
node core/utils/assertion-report/buildAssertionReport.js                              # newest run, as its mode built it
node core/utils/assertion-report/buildAssertionReport.js --from=<runDir>               # a specific run
node core/utils/assertion-report/buildAssertionReport.js --from=<runDir> --view=debug  # debug view of a =true run
```

## How a check is linked to its element

See ADR-026 in `.architecture/decisions.md`. In short: the page-object line that read the value
(`searchBtnDisplayed: await action.isDisplayed(this.searchBtn)`) is matched by name to the test's
assertion (`assertion.assertEqual(sts.searchBtnDisplayed, …)`), never by value alone.

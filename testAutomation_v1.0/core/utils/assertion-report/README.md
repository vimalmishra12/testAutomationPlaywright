# Assertion evidence report (ADR-025)

A mochawesome-style HTML report where every element an assertion checked is marked on the
end-of-test screenshot: **✔ green** for a passed check, **✘ red** for the failed one.

## Turn it on

Add `--assertReport=true` to any run. Without the flag nothing changes.

```bash
npm run adminStudentsTabTest_thor -- --assertReport=true
# or
node core/runner/run.js --appType=ExperienceApp --testEnv=thor --testExecFile=adminStudentsTab.json \
  --browserCapability=desktop-chrome-1920 --assertReport=true
```

At the end of the run the console prints the report path:

```
[assert-report] Assertion evidence report: output/reports/TestReports/assertionReport/<exec>_<env>_<stamp>/index.html
```

`index.html` is one self-contained file (screenshots embedded) — open it or send it as is.
Mochawesome is still produced as usual; the flag also works with `--report=spec`.

## Reading it

- Each test shows its end-of-test screenshot with numbered marks and, beside it, the numbered list of checks.
  Hover a mark or a check to link them. Checks on the same element share one mark (`2·3·4 ✔`).
- **Dashed outline + "inferred"**: more than one element could be the one checked; the most likely is drawn.
- A check listed **without a mark** says why:

| Label | Meaning |
|---|---|
| no element | the check was not about a read element (a click result, a list length, a URL) |
| absent, as checked | the check was that the element is not there / not shown — and it isn't |
| element gone before screenshot | the element was removed after it was checked |
| changed before screenshot | the element now shows a different value than the one checked (the new value is listed) |
| hidden inside a scroll panel | the element sits in a scrolled-away part of an inner panel |
| not in final screenshot | the element is outside the captured image |

## Rebuilding

Every finished test is written to `evidence.jsonl` as it ends, so even a crashed run can be rebuilt:

```bash
node core/utils/assertion-report/buildAssertionReport.js                 # newest run
node core/utils/assertion-report/buildAssertionReport.js --from=<runDir>  # a specific run
```

## How a check is linked to its element

See ADR-025 in `.architecture/decisions.md`. In short: the page-object line that read the value
(`searchBtnDisplayed: await action.isDisplayed(this.searchBtn)`) is matched by name to the test's
assertion (`assertion.assertEqual(sts.searchBtnDisplayed, …)`), never by value alone.

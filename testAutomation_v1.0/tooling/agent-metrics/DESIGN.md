# Agent Metrics (Level 2) — Design

> Design-time tooling (AGENTS.md §9): NOT part of the test framework, never `require()`-d by it.
> Parses Claude Code session transcripts (read-only) into a per-session metrics CSV, so we can
> observe how the agent performs over time — token cost, errors, rework — and verify whether
> skill changes (e.g. the 2026-07-15 phased split of `c1-test-authoring`) actually help.

## Data source (read-only)

`%USERPROFILE%\.claude\projects\<project-dir>\*.jsonl` — one JSONL file per session. Every record
carries `type` (user/assistant/…), `timestamp`, `isSidechain` (subagent traffic), and assistant
records carry `message.model`, `message.usage` (input/output/cache tokens) and `tool_use` blocks;
user records carry `tool_result` blocks with `is_error`. Both project dirs matching this repo
(`D--testAutomation-QATestAutomation*`) are scanned into one CSV with a `project` column.

## Output

`tooling/agent-metrics/output/agent-metrics.csv` — **gitignored** (the repo-wide `output/` ignore
pattern already covers it): per-machine data, contains prompt snippets. One row per session:

| Column | Meaning / heuristic |
|---|---|
| `project`, `session_id` | which transcript |
| `date_start`, `date_end`, `wall_clock_min` | first/last record timestamps (wall clock includes idle time — tokens are the trustworthy effort measure) |
| `model` | distinct models seen |
| `user_msgs` | human turns (proxy for steering/corrections needed) |
| `assistant_msgs`, `tool_calls` | agent work volume |
| `tool_errors` | `tool_result.is_error` count — friction/mistake signal |
| `input_tokens`, `output_tokens`, `cache_read`, `cache_create` | summed usage, deduped per `requestId` |
| `skill` | `Skill` tool invocations or Reads under `.agent/skills/<name>/` |
| `phase` | Reads of `phases/1-build.md` / `2-run-fix.md` / `3-visual.md` (pre-split sessions show none → effectively "monolithic") |
| `test_runs`, `runs_failed` | Bash/PowerShell commands invoking `run.js` / `npm run *Test*`; failure = `is_error` or `N failing` in the output |
| `subagent_msgs` | `isSidechain` records |
| `label` | first ~80 chars of the first human message — makes rows recognizable |

## Usage

```
node tooling/agent-metrics/collect.js                    # write/refresh the CSV
node tooling/agent-metrics/collect.js --summary          # CSV + console summary
node tooling/agent-metrics/collect.js --summary --split-date 2026-07-15   # before/after comparison
```

Summary prints: totals + per-skill/per-phase averages, top-5 most expensive sessions (by
input+output tokens, with labels), error hotspots, and the before/after split comparison.

## Honest limits

- "User corrections" and "ambiguous instruction" cannot be reliably auto-detected — `user_msgs`
  and `tool_errors` are proxies; qualitative judgment stays in the walkthrough metrics notes.
- Skill/phase attribution is heuristic (tool-call inspection); sessions that never read a skill
  file show `skill = none`.
- Wall-clock time includes idle gaps.

## Non-goals

No OpenTelemetry, no hooks (Level 3, later, if this proves valuable), no dollar-cost column
(pricing drifts; tokens are the stable unit), no transcript modification, no framework coupling.

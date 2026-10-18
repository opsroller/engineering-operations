---
name: operating-data
description: Use when collecting and reading a team's operating records (workflow run results, gap and incident logs, CI history, review verdicts, usage and spend) or when defining, baselining or changing the measures built from them.
---

# Operating data

The team already writes down most of what you need. Your job is to know
where, to read it the same way every time, and to build a few measures
from it that mean the same thing next month as they do today.

## Find the records

The project's `CLAUDE.md` or profile should name where each record
lives. If it does not, find them and propose the list to the project's
coordinator as an addition to the profile, once.

| Record | Typical home | Answers |
|---|---|---|
| Workflow run results | run output, state files, thread replies | which workflows ran, steps, failures, steps done by hand |
| Gap log | a file the coordinator keeps | where a role's method did not fit the work |
| CI history | the CI service | runs per change, duration, failure rate, re-runs |
| Review verdicts | pull request reviews | rounds per change, blocking findings, rework |
| Work records | plan, tracker, pull requests | lead time, age, work in progress, throughput |
| Usage and spend | provider usage pages, invoices, budget notes | tokens, agent runs, compute minutes, money |
| Incident and blocker notes | threads, status files | what stopped work and for how long |

Read-only. Never change a record to make it easier to read.

## Define each measure once

Write each measure in the project's operations reference before you
report it:

```
<Name>
Definition:  <what is counted, from which record, over which window>
Kind:        base (counted) | derived (computed from base measures)
Source:      <record and how it is read>
Baseline:    <value, window, date>
Pair:        <the measure it is read with>
Owner:       <who acts when it moves>
```

- Prefer base measures you can count from a record over estimates.
- Every measure has a **pair** that guards it: speed with stability
  (lead time with change fail rate), cost with quality (cost per merged
  change with rework rate), activity with outcome (runs with merges).
- Keep the set small: five to eight team measures. Add one only when a
  decision needs it; drop one nobody acts on.
- Change a definition by adding a dated new version. Never compare
  numbers across definitions without saying so.

## A starting set

Pick from these; the project's records decide what is countable.

| Area | Measure | Pair |
|---|---|---|
| Cost | spend per merged change; spend per role per week | rework rate |
| Flow | lead time from start to merge; work item age; work in progress | change fail rate |
| Quality | change fail rate; review rounds per change; CI failure rate | lead time |
| Rework | share of changes that are fixes to recent changes | spend per change |
| Method fit | share of workflow steps done by hand; open gaps per role | lead time |
| Waste | hours or spend lost to waiting, re-runs and duplicate work | throughput |

## Read honestly

- State the window and the sample size. Five changes are an anecdote.
- Look at the trend and the spread, not one value.
- A gap in the records is a finding of its own ("no usage data for
  three days"), never filled with a guess.
- Measures describe the team and its workflows. Never rank or report
  individuals, agents or people.

## Failure modes

- **Vanity metrics:** activity counts (runs, messages, lines) reported
  as progress.
- **Goodhart drift:** a measure becomes a target and stops measuring.
- **Silent redefinition:** the number changed because the counting did.
- **Dashboard sprawl:** more measures than anyone reads.

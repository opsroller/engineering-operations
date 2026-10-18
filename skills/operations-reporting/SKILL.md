---
name: operations-reporting
description: Use when reporting the team's cost, flow and quality - a short scorecard of defined measures with trends, the findings that need action, and the improvements in flight - to the owner or the team's coordinator.
---

# Operations reporting

The reader wants to know: what does the work cost, is it getting better
or worse, and what is being done about the worst of it. Answer in that
order and stop.

## When

- On the cadence the owner or coordinator set. Do not invent one.
- When an anomaly or budget threshold needs someone now.
- When asked.

## Shape

```
Needs action: <decision or action, one line each, with owner - or "nothing">

Cost:     <spend this period> of <budget> (<trend>); <unit cost> per <outcome> (<trend>)
Flow:     <lead time> (<trend>); <work in progress>; <oldest item age>
Quality:  <change fail rate or review rounds> (<trend>); <rework rate>
Method:   <share of steps done by hand>; <open gaps> (<trend>)

Top findings (by size):
F-<n> <title> - <size> - owner <role> - <proposal or status>

Improvements:
I-<n> <title> - <status> - <measure: baseline -> now>

Data gaps: <records missing or unreadable, if any>
```

- **Trends, not snapshots:** each number with its baseline and
  direction over a stated window.
- **Pairs together:** a cost or speed number always sits next to its
  quality guard.
- **Team-level only.** No agent, person or individual ranking appears.
- **Top three findings** by size; the rest live in the findings record.
- Under two minutes to read; detail goes behind links.

## Honesty rules

- Never report a number without a definition and source.
- A bad trend is in the first lines, with what is being done.
- Unknown is a valid value: say which record is missing.
- Report what this review cost.

## Before sending

- [ ] First line says whether anything needs action, and from whom
- [ ] Every number has a baseline, a window and its pair beside it
- [ ] Every finding has evidence, a size and one owner
- [ ] No individual is named, ranked or blamed
- [ ] The review's own cost is stated

## Failure modes

- **Dashboards nobody reads:** twenty numbers, no action.
- **Good news only:** a falling measure buried below the fold.
- **Surveillance:** per-agent or per-person league tables.
- **Unrequested reports** that train readers to skip them.

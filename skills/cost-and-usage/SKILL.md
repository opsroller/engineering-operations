---
name: cost-and-usage
description: Use when tracking what the team's work costs - allocating usage and spend to roles and work items, checking it against budget, catching anomalies, forecasting, and choosing levers that cut cost without cutting quality.
---

# Cost and usage

Cost is a measure of the work, not of the people doing it. The aim is
not the lowest spend; it is the most finished, good work per unit
spent, inside the budget the owner set.

## Allocate

Tie every unit of spend to the work it served:

1. **By work item** (package, change, request) when the records carry
   the link: a run, a thread or a pipeline tagged with the item.
2. **By role** when only the role is known.
3. **Unallocated** for the rest. Report its share; a growing
   unallocated share is a finding.

Unit cost is spend divided by an outcome the owner cares about: cost per
merged change, cost per finished work item, cost per release. Read it
with its quality pair (rework rate, change fail rate).

## Budget and forecast

- Record the budget the owner set, its period and who set it. Do not
  invent one; if there is none, report spend and trend only.
- Forecast to the end of the period from the recent run rate; say the
  method.
- Report burn against budget early: at a quarter, a half and three
  quarters of the period, not only at the end.

## Anomalies

An anomaly is spend that departs from its own recent pattern. Check:

- a sudden step in daily spend or usage;
- one role, workflow or item taking a much larger share than usual;
- spend with no matching output (runs with no merge, loops, re-runs);
- standing processes that keep spending while no work moves.

Each anomaly gets an owner the same day, as a finding with evidence.

## Levers

Name the cheapest lever that fixes the cause. Usage levers first, rate
levers second:

| Lever | Example |
|---|---|
| Do less | stop work nobody asked for; close idle sessions and standing processes |
| Do it once | reuse a record instead of re-reading; fix the cause of re-runs |
| Smaller fan-out | fewer parallel agents; run a workflow inline in one session |
| Right-size | a lighter model or lower effort for mechanical steps |
| Batch | group small checks into one run |
| Cache | keep shared results where every role can read them |
| Move the work | run long jobs where they are cheapest, inside the owner's rules |

Every lever states its quality risk and how you will notice it.

## Failure modes

- **Cutting quality to cut cost:** spend falls while rework rises.
- **Chasing rates, ignoring usage:** a cheaper unit price on work that
  should not run at all.
- **Late news:** the budget is gone before anyone hears it was burning.
- **Blame by spend:** treating the biggest spender as the problem
  instead of asking what the spend bought.

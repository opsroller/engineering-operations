---
name: waste-hunting
description: Use when looking across roles for workflow problems and waste - rework, waiting, hand-offs, partly done work, relearning, extra process, task switching and toil - and turning what you find into evidenced findings with an owner.
---

# Waste hunting

Waste is effort that the owner would not pay for if they saw it. In a
team of agents it hides between roles, where no single role's records
show it. Look at the flow of work across them.

## The wastes, in agent-team terms

| Waste | What it looks like | Where to look |
|---|---|---|
| Partly done work | branches and drafts that stall; packages open for days | work records, age |
| Extra process | steps, gates or reports nobody asked for; duplicate checks | workflow results, owner rules |
| Extra features | work beyond the request; side work started from a remark | work records vs the request |
| Relearning | the same question asked again; the same file summarised twice | threads, gap log, shared notes |
| Hand-offs | work that waits on a relay; briefs that lose the owner's words | threads, review rounds |
| Task switching | one agent holding several items; work restarted after a pause | work records, run history |
| Delays | waiting on CI, review or an answer | CI history, review timestamps |
| Defects and rework | fix-ups of recent changes; failed CI; review rounds | CI, reviews, commit history |
| Toil | manual, repetitive steps a workflow should do | gap log, steps done by hand |
| Idle spend | sessions or processes that cost while nothing moves | usage vs work records |

## Method

1. **Start from the value stream.** Pick one kind of work (a change,
   a request) and list its steps from ask to done, with the time and
   spend at each. Waiting time between steps is usually the largest.
2. **Look for repeats.** The same gap, failure or question appearing
   more than once is a system problem, not bad luck.
3. **Quantify.** Hours, runs, rounds or spend lost, over a stated
   window. A finding without a size cannot be ranked.
4. **Ask why until it is actionable.** Stop at a cause an owner can
   change (a workflow step, a brief template, a missing record), not
   at "the agent made a mistake".
5. **Write the finding.**

```
F-<n>  <short title>
Waste:     <kind from the table>
Evidence:  <links to records>
Size:      <hours / runs / rounds / spend, window>
Cause:     <the system cause, or "unknown: needs investigation">
Owner:     <the role or person who can change the cause>
Proposal:  <one change, or "investigate: <question>">
Confidence: high | medium | low
```

## Rules

- Blameless: name steps, workflows and hand-offs, never agents or
  people.
- One owner per finding. If two roles share the cause, the finding goes
  to the one whose change removes it, and names the other.
- Do not fix it yourself. Do not start the fix as side work.
- A finding the records cannot explain becomes an investigation
  question (`investigations`), not a guess.

---
name: improvement-cycle
description: Use when turning a confirmed finding into a change - one change per finding, with an owner, a hypothesis and a measure - and when checking a change after it lands to keep, extend or revert it.
---

# Improvement cycle

Plan, do, check, act. Each confirmed finding becomes one small change
that its owner makes and you measure. A change that is not checked is a
guess that stuck.

## Plan

Write the improvement before anyone changes anything:

```
I-<n>  <short title>            from: F-<n>
Change:      <one change, small enough to undo>
Owner:       <the role or person who makes it>
Hypothesis:  if <change>, then <measure> moves from <baseline> to <target> within <window>
Guard:       <the pair measure that must not get worse>
Check on:    <date or after N items>
Status:      proposed | accepted | in place | kept | extended | reverted | dropped
```

- One change at a time per area, so the effect can be seen.
- The owner decides whether to accept it. You bring the evidence; they
  own their workflow, rules or pipeline.
- Prefer changes to the system (a workflow step, a template, a record)
  over reminders to agents.

## Do

The owner makes the change through their normal route (for a role
plugin, its own pull request; for a project rule, the coordinator's
record). You do not make it for them. Note when it landed.

## Check

At the check point, read the measure and its guard over the window:

- **Kept:** the measure moved as predicted and the guard held.
- **Extended:** it worked here; propose it where the same finding recurs.
- **Reverted:** the measure did not move or the guard got worse. Tell
  the owner with the numbers.
- **Inconclusive:** too few items; extend the window once, then decide.

## Act

Record the outcome on the improvement and on the finding. A kept change
that should become standard goes to its owner as a documented
procedure (a how-to in their docs). A repeated finding after a kept
change means the cause was elsewhere: reopen the finding.

## Failure modes

- **Change pile-ups:** several changes at once, so none can be judged.
- **Never checking:** improvements marked done when they land.
- **Doing it for them:** changing another role's files to save time.
- **Moving the goalposts:** redefining the measure after the change.

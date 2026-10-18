Tutorial: for someone new to the engineering-operations plugin who wants to see it review one period of a team's work from records to scorecard.

# Run your first operations review

In this tutorial we will define two measures, run one operations review
in a single session, and read its scorecard. We will use a small,
made-up team: a few role agents working in one repository, with CI, pull
request reviews and a gap log file.

## Before we start

We need a project repository whose `CLAUDE.md` names where the gap log,
CI and usage records live, and an operations reference page (for
example `docs/reference/operations.md`). We need the
`engineering-practices` and `engineering-operations` plugins installed.

## 1. Define two measures

Ask the engineering-operations agent:

```
Following operating-data, define lead time from first commit to merge,
paired with CI failure rate, in the operations reference. Then stop.
```

The page now holds two entries like this:

```
Lead time to merge
Definition:  hours from a change's first commit to its squash merge, per merged change, over the window
Kind:        derived
Source:      pull request timestamps
Baseline:    (set by the first review)
Pair:        CI failure rate
Owner:       the team's coordinator
```

Notice that the baseline is empty: the first review sets it.

## 2. Run the review inline

```
Run the engineering-operations operations-review workflow with args
{ window: "last 7 days", run: { mode: "inline" } }
```

The workflow pauses with one brief at a time. We answer each in this
session. When it reaches `challenge`, we send that brief to a fresh
session and paste its answer back, naming it in `run.reviewers`. That
step checks findings we wrote, so we must not answer it ourselves.

## 3. Read the scorecard

The `report` starts with a line like:

```
Needs action: CI re-runs on 6 of 14 changes (F-1), owner devops - proposal attached
```

Notice three things. The number has a window. The finding names a
workflow and a role, not an agent. And the last line says what the
review itself cost.

## 4. Look at what was recorded

Open the operations reference. The two measures now have baselines,
F-1 is in the findings record with its verdict, and the review log has
one entry. The edit is uncommitted; land it with the engineering-practices
`small-change` workflow.

## What we did

We defined measures in pairs, reviewed a week of records for the cost
of one or two agents, had the findings checked by someone who did not
write them, and handed the top finding to its owner with evidence.

Next: [How to run an operations review](../how-to/how-to-run-an-operations-review.md)
covers real reviews with investigations. To understand why the role
works this way, read [About the engineering operations role](../explanation/about-the-role.md).

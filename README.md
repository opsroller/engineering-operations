# Engineering operations

A role plugin for owning a team's cost, delivery health and reporting.
Every role leaves records as it works: workflow results, gap reports, CI
runs, review verdicts, usage and spend. The engineering operations role
reads all of them, keeps a few defined measures of cost, flow and
quality, finds the waste that sits between roles, and sends a few
scoped, read-only investigators when the records cannot explain a
problem. It changes nothing itself: each finding goes to the role that
owns the cause, and each improvement is measured after it lands.

## Install

```
/plugin marketplace add opsroller/claude-plugins
/plugin install engineering-operations@opsroller
```

It builds on `engineering-practices`; install that too.

## Documentation

**Start here.** [Run your first operations review](docs/tutorials/first-task.md)
walks through one review from records to scorecard.

**Doing the job.** Task guides:
[connect the team's records](docs/how-to/how-to-connect-the-teams-records.md),
[run an operations review](docs/how-to/how-to-run-an-operations-review.md),
[check what the work costs](docs/how-to/how-to-check-what-the-work-costs.md),
[investigate a workflow problem carefully](docs/how-to/how-to-investigate-a-workflow-problem.md) and
[follow up an improvement](docs/how-to/how-to-follow-up-an-improvement.md).

**Looking things up.** The [reference](docs/reference/index.md) describes
the agent, the six skills and the three workflows (`operations-review`,
`cost-check`, `improvement-check`) with their arguments and outputs;
[SOURCES.md](SOURCES.md) lists the research behind the methods.

**Wondering why?** [About the engineering operations role](docs/explanation/about-the-role.md)
explains the reasoning (measures in pairs, records before agents,
blameless findings, owners change their own things) and the boundaries
with neighbouring roles.

## License

Copyright (C) 2026 the contributors. Licensed under the GNU General Public License v2.0 or later (`GPL-2.0-or-later`); see `LICENSE`.

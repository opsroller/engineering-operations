Reference: for anyone using or staffing the engineering-operations plugin who needs the exact parts, fields and arguments.

# Engineering-operations reference

The plugin has three kinds of parts. The agent is the role itself. The
skills are the methods it follows. The workflows run its multi-agent jobs.

## Agent

- [engineering-operations agent](agent.md): mission, responsibilities, quality bar, boundaries.

## Skills

Measuring:
- [operating-data](skills/operating-data.md): the records, measure definitions, baselines.
- [cost-and-usage](skills/cost-and-usage.md): allocation, budget, forecast, anomalies, levers.

Finding problems:
- [waste-hunting](skills/waste-hunting.md): the wastes, value streams, the finding format.
- [investigations](skills/investigations.md): when and how to send read-only investigators.

Improving and reporting:
- [improvement-cycle](skills/improvement-cycle.md): plan, do, check, act; the improvement record.
- [operations-reporting](skills/operations-reporting.md): the scorecard.

## Workflows

- [operations-review](workflows/operations-review.md): records to measures, findings, a few investigations, an independent challenge and a scorecard.
- [cost-check](workflows/cost-check.md): a quick, investigator-free cost note.
- [improvement-check](workflows/improvement-check.md): measure improvements that are due and decide keep, extend or revert.

## Records it keeps in the project

All in the project's operations reference (its path is named in the
project's `CLAUDE.md` or profile):

| Record | Format defined in |
|---|---|
| Measures (definition, source, baseline, pair, owner) | `operating-data` |
| Findings (`F-<n>`) | `waste-hunting` |
| Improvements (`I-<n>`) | `improvement-cycle` |
| Review log (window, what the review cost) | `operations-review` |
| Budget (amount, period, who set it) | `cost-and-usage` |

## Manifest

`.claude-plugin/plugin.json`:

| Field | Value |
|---|---|
| `name` | `engineering-operations` |
| `version` | `0.1.0` |
| `description` | one-line summary of the role |
| `author.name` | `opsroller` |
| `repository` | `https://github.com/opsroller/engineering-operations` |
| `license` | `GPL-2.0-or-later` |
| `keywords` | `role`, `job-function`, `engineering-operations`, `finops`, `developer-productivity`, `continuous-improvement`, `reporting` |

## Sources

The research behind the plugin is listed in [SOURCES.md](../../SOURCES.md).

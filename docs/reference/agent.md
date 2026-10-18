Reference: for anyone invoking or configuring the engineering-operations subagent.

# engineering-operations agent

File: `agents/engineering-operations.md`.

| Field | Value |
|---|---|
| `name` | `engineering-operations` |
| Invoked for | cost, delivery health and reporting across a team of role agents; finding workflow problems and waste |
| Loads first | `engineering-practices`, skill `project-onboarding` |
| Does not do | hands-on work of any discipline; fixing what it finds; editing another role's files; package planning and status; PR review; running pipelines; setting the budget |

## Responsibilities and the skill for each

| Responsibility | Skill |
|---|---|
| Operating data | `operating-data` |
| Cost and usage | `cost-and-usage` |
| Waste and workflow problems | `waste-hunting` |
| Careful investigation | `investigations` |
| Improvement | `improvement-cycle` |
| Reporting | `operations-reporting` |

## Limits it holds

| Limit | Value |
|---|---|
| Investigators per review | default 1, at most 3 |
| Investigator access | read-only; no edits, commits, pushes, re-runs or messages |
| Measures reported | team-level only; none per agent or person |
| Measures in the set | five to eight |

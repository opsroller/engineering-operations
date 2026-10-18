Reference: for anyone running or reading the output of the `cost-check` workflow.

# cost-check

File: `workflows/cost-check.js`.

## Arguments

| Arg | Required | Meaning |
|---|---|---|
| `period` | no | Budget period; default: the current one recorded in the project, or the last 7 days |
| `budget` | no | Budget to compare with; default: the one recorded in the operations reference. With none, the note reports spend and trend only |

## Phases

| Phase | Agents | Does | Skills |
|---|---|---|---|
| Collect | 1, read-only | Usage and spend lines with role, work item and source; outcomes; data gaps | `operating-data` |
| Analyze | 1, read-only | Allocation, unallocated share, unit cost, burn, forecast, anomalies with owners, levers with quality risk | `cost-and-usage` |
| Report | 1 | Short cost note, actions first | `operations-reporting` |

Sends no investigators and edits no files.

## Output

| Field | Meaning |
|---|---|
| `note` | Cost note text |
| `anomalies` | Each with evidence and owner |
| `levers` | Each with what it saves, quality risk and owner |
| `burn` | Spend against budget |
| `forecast` | End-of-period forecast and method, or `not forecast` |
| `data_gaps` | Records missing or unreadable |

## Run modes

Run modes v2. Besides its own args, the workflow takes the optional `run` arg defined in the engineering-practices
[workflow run modes reference](https://github.com/opsroller/engineering-practices/blob/main/docs/reference/workflow-run-modes.md):
`run: { mode: "inline" }` runs every phase in the calling session with no subagents, `run.only` runs chosen phases or steps,
and `run.from` with `run.results` resumes a stopped run. Without `run`, the workflow and its outputs are as above.
See [how to run a workflow inline](https://github.com/opsroller/engineering-practices/blob/main/docs/how-to/how-to-run-a-workflow-inline.md).

Step labels, for `run.only` and `run.results`: `collect-usage`, `analyze-cost`, `cost-note`.

Independent steps: none.

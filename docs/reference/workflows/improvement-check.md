Reference: for anyone running or reading the output of the `improvement-check` workflow.

# improvement-check

File: `workflows/improvement-check.js`.

## Arguments

| Arg | Required | Meaning |
|---|---|---|
| `improvements` | no | Ids to check; default: every improvement `in place` whose check date has passed |

## Phases

| Phase | Agents | Does | Skills |
|---|---|---|---|
| Read | 1, read-only | Lists the improvements due with hypothesis, measure, baseline, target, guard, window | `improvement-cycle` |
| Measure | 1 per improvement, read-only | Measure and guard now over the window, with the recorded definition; outcome | `improvement-cycle`, `operating-data` |
| Record | 1 | Docs Plan (reference only), Do (statuses and numbers; reopens the finding of each reverted change), Check | `improvement-cycle` |
| Notify | 1 | One draft message per owner, with the numbers | `improvement-cycle` |

A failed measurement is recorded as `inconclusive`, never guessed. No
improvements due returns a one-line message.

## Output

| Field | Meaning |
|---|---|
| `outcomes` | Per improvement: measure and guard now, items in window, outcome, evidence |
| `messages` | Draft messages to owners |
| `recorded` | Whether the record edit was made; it is left uncommitted for `small-change` |

## Run modes

Run modes v2. Besides its own args, the workflow takes the optional `run` arg defined in the engineering-practices
[workflow run modes reference](https://github.com/opsroller/engineering-practices/blob/main/docs/reference/workflow-run-modes.md):
`run: { mode: "inline" }` runs every phase in the calling session with no subagents, `run.only` runs chosen phases or steps,
and `run.from` with `run.results` resumes a stopped run. Without `run`, the workflow and its outputs are as above.
See [how to run a workflow inline](https://github.com/opsroller/engineering-practices/blob/main/docs/how-to/how-to-run-a-workflow-inline.md).

Step labels, for `run.only` and `run.results`: `read-due`, `measure:<improvement id>` (one per improvement), `record-outcomes`, `notify-owners`.

Independent steps: none.

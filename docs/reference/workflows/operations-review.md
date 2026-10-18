Reference: for anyone running or reading the output of the `operations-review` workflow.

# operations-review

File: `workflows/operations-review.js`.

## Arguments

| Arg | Required | Meaning |
|---|---|---|
| `window` | no | Period to review; default: since the last review in the review log, or the last 7 days |
| `max_investigations` | no | Investigators to send, 0 to 3; default 1; values outside the range are clamped |
| `records` | no | Where the records live; default: the locations named in `CLAUDE.md` or the profile |
| `audience` | no | Who the scorecard is for; default: the project's coordinator |

## Phases

| Phase | Agents | Does | Skills |
|---|---|---|---|
| Collect | 1, read-only | Reads the records; computes each defined measure with baseline, trend, pair and source; lists data gaps | `operating-data` |
| Analyze | 1, read-only | Findings, anomalies and ranked investigation questions | `cost-and-usage`, `waste-hunting`, `investigations` |
| Investigate | 0 to `max_investigations`, read-only | One question each, with the records to read, a budget and a stop rule | `investigations` |
| Challenge | 1, independent, read-only; skipped when there are no findings | Checks each finding's evidence, size, cause and owner; confirmed, weakened or dropped | `waste-hunting` |
| Record | 1 | Docs Plan (reference only), Do (one edit to measures, findings, review log), Check (one kind, format kept) | `operating-data` |
| Report | 1 | Scorecard, actions first, with the review's own cost | `operations-reporting` |

Questions beyond `max_investigations` are not sent; they are returned
in `deferred_questions` and recorded for the next review. A failed
investigation is recorded as unverified, never guessed. Dropped
findings are not recorded.

## Output

| Field | Meaning |
|---|---|
| `report` | Scorecard text |
| `findings` | Kept findings, each with its `verdict` (`confirmed`, `weakened` or `unchecked`) |
| `investigations` | Answers with evidence and confidence |
| `deferred_questions` | Questions not sent this time |
| `data_gaps` | Records missing or unreadable |
| `recorded` | Whether the record edit was made; it is left uncommitted for `small-change` |

## Run modes

Run modes v2. Besides its own args, the workflow takes the optional `run` arg defined in the engineering-practices
[workflow run modes reference](https://github.com/opsroller/engineering-practices/blob/main/docs/reference/workflow-run-modes.md):
`run: { mode: "inline" }` runs every phase in the calling session with no subagents, `run.only` runs chosen phases or steps,
and `run.from` with `run.results` resumes a stopped run. Without `run`, the workflow and its outputs are as above.
See [how to run a workflow inline](https://github.com/opsroller/engineering-practices/blob/main/docs/how-to/how-to-run-a-workflow-inline.md).

Step labels, for `run.only` and `run.results`: `collect`, `analyze`, `investigate:<question id>` (one per sent question), `challenge`, `record`, `report`.

Independent steps: `challenge`. Inline, send its brief to a reviewer with no part in the review (for example the code-reviewer role or a fresh session) and name them in `run.reviewers`.

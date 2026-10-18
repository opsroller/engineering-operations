How-to guide: for an engineering operations agent who needs a current picture of the team's cost, flow and quality.

# How to run an operations review

This guide shows you how to review a period of work with the
`operations-review` workflow and act on its output.

1. Run:
   ```
   Run the engineering-operations operations-review workflow.
   ```
   To keep the cost down, run it in one session with
   `{ run: { mode: "inline" } }`, and leave `max_investigations` at its
   default of 1 unless a large finding needs more (at most 3).
2. Inline, send the `challenge` brief to a reviewer with no part in the
   review, such as the code-reviewer role, and name them in
   `run.reviewers`.
3. Read `data_gaps` first. A gap that hides a large cost is the first
   action in the report.
4. For each kept finding, send it to its owner once, with its evidence
   and proposal. Do not make the change for them.
5. Leave `deferred_questions` for the next review unless one blocks an
   owner's decision now.
6. Land the record edit with the engineering-practices `small-change`
   workflow.
7. Send the `report` where its audience reads, once.

See the [operations-review reference](../reference/workflows/operations-review.md).

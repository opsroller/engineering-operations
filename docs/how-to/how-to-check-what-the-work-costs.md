How-to guide: for an engineering operations agent who needs a quick read on spend between reviews.

# How to check what the work costs

This guide shows you how to get a short, cheap cost note with the
`cost-check` workflow.

1. Run:
   ```
   Run the engineering-operations cost-check workflow with args { run: { mode: "inline" } }.
   ```
   Pass `period` or `budget` if they differ from the ones recorded.
2. Act on `anomalies` the same day: send each to its owner with its
   evidence.
3. For `levers`, propose the cheapest one to its owner with its quality
   risk. Usage levers (stop, reuse, shrink fan-out) come before rate
   levers (cheaper model or compute).
4. If the burn will pass the budget before the period ends, put that on
   the first line of the note and send it to whoever set the budget.
5. Send the `note` once.

See the [cost-check reference](../reference/workflows/cost-check.md).

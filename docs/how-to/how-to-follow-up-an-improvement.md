How-to guide: for an engineering operations agent whose improvements have reached their check date.

# How to follow up an improvement

This guide shows you how to decide whether a change worked, with the
`improvement-check` workflow.

1. Make sure each improvement in the record has a hypothesis, a
   baseline, a guard and a check date. One without them cannot be
   checked; write them with `improvement-cycle` first.
2. Run:
   ```
   Run the engineering-operations improvement-check workflow with args { run: { mode: "inline" } }.
   ```
3. Read each outcome:
   - **kept:** tell the owner; suggest a how-to if it should become standard;
   - **extended:** propose the same change where the finding recurs;
   - **reverted:** send the owner the numbers; undoing it is theirs;
   - **inconclusive:** extend the window once, then decide.
4. Send the `messages`, one per owner.
5. Land the record edit with the engineering-practices `small-change`
   workflow.

See the [improvement-check reference](../reference/workflows/improvement-check.md).

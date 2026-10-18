---
name: investigations
description: Use when the records point at a workflow problem or waste they cannot explain and you are deciding whether, and how carefully, to send other agents to find out - one question each, read-only, with a budget and a stop rule.
---

# Investigations

An investigator is another agent's time and the owner's money. Send one
only when reading the records yourself cannot answer the question, and
send the fewest that can.

## Before you send anyone

- [ ] The question is written and answerable: "why did the last five
      changes need three CI runs each?", not "look into CI".
- [ ] The records you already have do not answer it. You read them.
- [ ] The answer would change a decision: who owns the fix, or what it
      is.
- [ ] The cost is in proportion: the investigation costs a small
      fraction of the waste it targets.

If any box is empty, do not send. Record the finding as it stands.

## The brief

```
Question:  <one question>
Why:       <the finding it serves, with its evidence links>
Read:      <the records and paths to read; nothing else>
Do not:    edit, commit, push, re-run jobs, message other agents, or
           start any work; this is read-only
Budget:    <a cap: number of files, runs inspected, or steps>
Stop when: the question is answered, the budget is spent, or the
           answer needs access you do not have
Return:    answer, evidence links, confidence, what is still unknown
```

## How many and how

- **One question per investigator.** Two questions are two briefs.
- **Default to one investigator; cap the batch at three.** If more
  questions are open, rank them by the size of the waste and send the
  top ones; the rest wait for the next review.
- **Cheapest route first:** answer it in your own session from the
  records, then one investigator, then parallel investigators only for
  independent questions.
- **Lighter models for mechanical reading** (counting runs, collecting
  timestamps); heavier ones only for reasoning about causes.
- **No chains.** An investigator does not send investigators.

## After

- Check the answer against its evidence before you rely on it. An
  answer with no links is unverified.
- Add it to the finding: cause, confidence, owner.
- Record what the investigation cost, so the next decision to send one
  is informed.

## Failure modes

- **Fishing:** sending agents to "find problems" with no question.
- **Swarming:** many investigators on one question, or on questions the
  records answer.
- **Meddling:** an investigator that fixes what it finds, or nudges the
  agents it observes.
- **Expensive answers:** an investigation that costs more than the waste.

// SPDX-License-Identifier: GPL-2.0-or-later
export const meta = {
  name: 'improvement-check',
  description: 'Check the improvements that are due: read each one\'s hypothesis, measure and guard, measure them over their window read-only, decide keep, extend, revert or inconclusive, record the outcomes and tell each owner. Use when improvements reach their check date. args: { improvements: "<ids to check, default: every improvement in place and due>" }',
  phases: [
    { title: 'Read', detail: 'improvements due, with hypothesis, measure and guard' },
    { title: 'Measure', detail: 'one read-only measurement per improvement' },
    { title: 'Record', detail: 'outcomes in the improvements record; Diataxis check' },
    { title: 'Notify', detail: 'one message per owner, with the numbers' },
  ],
}

// --- run-modes v2 begin ---
const RUN = ((a, realAgent, realPhase, realLog) => {
  const opted = !!(a && typeof a === 'object' && a.run && typeof a.run === 'object')
  const c = opted ? a.run : {}
  const mode = c.mode === 'inline' ? 'inline' : 'agents'
  const results = c.results && typeof c.results === 'object' ? c.results : {}
  const reviewers = c.reviewers && typeof c.reviewers === 'object' ? c.reviewers : {}
  const only = Array.isArray(c.only) && c.only.length ? c.only.map(String) : null
  const from = c.from ? String(c.from) : null
  const titles = typeof meta !== 'undefined' && meta && Array.isArray(meta.phases) ? meta.phases.map((p) => p.title) : []
  const unknown = titles.length ? (from ? [from] : []).filter((t) => !titles.includes(t)) : []
  const error = c.mode && !['agents', 'inline'].includes(c.mode)
    ? `run.mode must be "agents" or "inline", got "${c.mode}"`
    : unknown.length ? `run.from names no phase: ${unknown.join(', ')}. Phases: ${titles.join(', ')}` : null
  const has = (o, k) => Object.prototype.hasOwnProperty.call(o, k)
  // An answer must carry every required key of its schema, as the runtime
  // enforces for agents; returns the missing keys, or null when it fits.
  const missing = (v, schema) => {
    if (v === null || v === undefined) return 'an answer'
    if (!schema || schema.type !== 'object') return null
    if (typeof v !== 'object' || Array.isArray(v)) return 'a JSON object'
    const gap = (schema.required || []).filter((k) => !has(v, k) || v[k] === undefined)
    return gap.length ? gap.join(', ') : null
  }
  const seen = {}
  const out = {}
  // Who answered each step marked independent: "subagent" when this run
  // spawned it, else the reviewer named in run.reviewers, else "self".
  const by = {}
  const who = (k) => (typeof reviewers[k] === 'string' && reviewers[k].trim() ? reviewers[k].trim() : 'self')
  const skipped = []
  const next = []
  const logs = []
  let current = ''
  let reached = !from
  let halting = false
  let release = () => {}
  const halted = new Promise((r) => { release = r })
  const picked = (ph, label) => reached && (!only || only.some((s) => s === ph || s === label || label.startsWith(s + ':')))
  const agent = (prompt, opts) => {
    const op = opts || {}
    const independent = op.independent === true
    const ph = op.phase || current
    const base = op.label || ph || 'agent'
    seen[base] = (seen[base] || 0) + 1
    const key = seen[base] > 1 ? `${base}#${seen[base]}` : base
    let note = null
    if (has(results, key)) {
      const gap = missing(results[key], op.schema)
      if (!gap) { out[key] = results[key]; if (independent) by[key] = who(key); return Promise.resolve(results[key]) }
      note = `answer missing ${gap}; answer this brief again`
    }
    if (!picked(ph, base)) { skipped.push(key); return Promise.resolve(null) }
    if (mode === 'agents') {
      const pass = Object.assign({}, op)
      delete pass.independent
      return realAgent(prompt, opts ? pass : opts).then((r) => {
        if (r !== null && r !== undefined) { out[key] = r; if (independent) by[key] = 'subagent' }
        return r
      })
    }
    const brief = { key, phase: ph, prompt, schema: op.schema || null }
    if (independent) brief.independent = true
    if (note) brief.note = note
    next.push(brief)
    if (!halting) {
      halting = true
      // Wait 200 microtask turns before pausing, so every sibling in a
      // parallel() or pipeline() fan-out queues its brief into this pause.
      ;(async () => { for (let i = 0; i < 200; i++) await null; release('__run_halted__') })()
    }
    return new Promise(() => {})
  }
  const phase = (t) => { current = t; if (from && t === from) reached = true; return realPhase(t) }
  const log = (m) => { logs.push(String(m)); return realLog(m) }
  const finish = (value) => {
    if (!opted) return value
    const self_reviewed = Object.keys(by).filter((k) => by[k] === 'self')
    if (value === '__run_halted__') {
      return {
        run: 'inline', status: 'next', next, results: out, reviewers: by, self_reviewed, skipped, logs,
        how: 'Do each brief in next, in order: follow its prompt in this session (it may tell you to edit files, commit or push), and shape your answer to its schema when one is given, with every required field. A brief marked independent reviews work this run produced, so do not answer it yourself: send its prompt to a reviewer with no part in the work (the project\'s code-reviewer role, a fresh session or a fresh subagent), use their answer, and name them in run.reviewers under its key; if you must answer it yourself, it is listed in self_reviewed and must be reported as self-reviewed. A brief with a note was answered before without the fields it names. Add each answer to results under its key, then run this workflow again with the same args, run.results set to the merged results and run.reviewers to the merged reviewers. Repeat until status is "done". To avoid pasting results back on every call, drive the run with engineering-practices tools/run-inline.mjs and a state file instead: it stores each answer and prints only the next briefs.',
      }
    }
    return { run: mode, status: 'done', result: value, results: out, reviewers: by, self_reviewed, skipped, logs }
  }
  return { agent, phase, log, finish, halted, error }
})(typeof args === 'undefined' ? undefined : args, agent, phase, log)
if (RUN.error) return RUN.error
const RUN_OUT = await Promise.race([RUN.halted, (async (agent, phase, log) => {
// --- run-modes v2 end (workflow body follows; close it with the tail line) ---

const which = (args && args.improvements) || 'every improvement with status "in place" whose check date has passed'

const DUE = { type: 'object', properties: { improvements: { type: 'array', items: { type: 'object', properties: {
  id: { type: 'string' }, title: { type: 'string' }, owner: { type: 'string' }, landed: { type: 'string' },
  hypothesis: { type: 'string' }, measure: { type: 'string' }, baseline: { type: 'string' }, target: { type: 'string' },
  guard: { type: 'string' }, window: { type: 'string' },
}, required: ['id', 'owner', 'hypothesis', 'measure', 'baseline', 'guard'] } } }, required: ['improvements'] }

const OUTCOME = { type: 'object', properties: {
  id: { type: 'string' }, now: { type: 'string' }, guard_now: { type: 'string' }, items_in_window: { type: 'integer' },
  outcome: { type: 'string', enum: ['kept', 'extended', 'reverted', 'inconclusive'] }, evidence: { type: 'array', items: { type: 'string' } },
  reason: { type: 'string' },
}, required: ['id', 'now', 'guard_now', 'outcome', 'evidence'] }

phase('Read')
const due = await agent(`Follow engineering-practices project-onboarding. Read-only. Read the improvements record in the project's operations reference and list ${which}: id, title, owner, when it landed, hypothesis, measure with baseline and target, guard measure and window. Edit nothing.`, { schema: DUE, phase: 'Read', label: 'read-due' })
if (!due) return 'improvement-check stopped: could not read the improvements record.'
if (!due.improvements.length) return 'No improvements are due for a check.'

phase('Measure')
const measured = await pipeline(due.improvements, i => agent(`Follow the engineering-operations improvement-cycle and operating-data skills. Read-only: do not edit, commit, push or message anyone. Measure this improvement over its window since it landed, using the measure's recorded definition (never a new one): the measure now, the guard now, how many items fell in the window, with evidence links. Decide: kept (moved as predicted, guard held), extended (kept, and the same finding recurs elsewhere), reverted (did not move, or the guard got worse), inconclusive (too few items).\n${JSON.stringify(i)}`, { schema: OUTCOME, phase: 'Measure', label: `measure:${i.id}` }))
const outcomes = due.improvements.map((i, n) => measured[n] || { id: i.id, now: 'unknown', guard_now: 'unknown', outcome: 'inconclusive', evidence: [], reason: 'measurement failed; unverified' })

phase('Record')
const recorded = await agent(`Docs plan: this check changes reference docs only (the improvements record and the findings it came from). Do: set each improvement's status to its outcome with the numbers and date, and reopen the source finding of every reverted one, in one edit, describing state only. Then check (the project's Diataxis guide): touched pages hold one kind (reference), keep their format and link to related pages. Report pages touched.\n${JSON.stringify(outcomes)}`, { phase: 'Record', label: 'record-outcomes' })

phase('Notify')
const messages = await agent(`Follow the engineering-operations improvement-cycle skill. Draft one short message per owner for these outcomes: the improvement, its measure baseline to now, the guard, the outcome, and for reverted ones what the numbers show and that the change is theirs to undo. For kept changes that should become standard, suggest the owner documents the procedure as a how-to in their docs. Blameless. Return the drafts, one per owner.\n${JSON.stringify({ improvements: due.improvements, outcomes })}`, { phase: 'Notify', label: 'notify-owners' })

return {
  outcomes,
  messages: messages || 'drafting failed; see outcomes',
  recorded: recorded ? 'yes (uncommitted; land it with engineering-practices small-change)' : 'no (record step failed)',
}
})(RUN.agent, RUN.phase, RUN.log)]); return RUN.finish(RUN_OUT)

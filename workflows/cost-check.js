// SPDX-License-Identifier: GPL-2.0-or-later
export const meta = {
  name: 'cost-check',
  description: 'Quick, cheap check of what the team\'s work is costing: read usage and spend, allocate it to roles and work items, compare it with the budget and forecast, flag anomalies, and name the cheapest levers with their quality risk. Sends no investigators. Use between operations reviews or when spend looks wrong. args: { period: "<budget period, default: the current one>", budget: "<budget, default: the one recorded in the project>" }',
  phases: [
    { title: 'Collect', detail: 'usage, spend and work records for the period' },
    { title: 'Analyze', detail: 'allocation, budget, forecast, anomalies, levers' },
    { title: 'Report', detail: 'short cost note, actions first' },
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

const period = (args && args.period) || 'the current budget period recorded in the project (or the last 7 days if none is recorded)'
const budget = (args && args.budget) || "the budget recorded in the project's operations reference, if any"

const USAGE = { type: 'object', properties: {
  spend_total: { type: 'string' },
  lines: { type: 'array', items: { type: 'object', properties: {
    what: { type: 'string' }, role: { type: 'string' }, item: { type: 'string' }, amount: { type: 'string' }, source: { type: 'string' },
  }, required: ['what', 'amount', 'source'] } },
  outcomes: { type: 'string' },
  data_gaps: { type: 'array', items: { type: 'string' } },
}, required: ['spend_total', 'lines', 'data_gaps'] }

const COST = { type: 'object', properties: {
  by_role: { type: 'array', items: { type: 'string' } },
  unallocated_share: { type: 'string' },
  unit_cost: { type: 'string' },
  burn: { type: 'string' },
  forecast: { type: 'string' },
  anomalies: { type: 'array', items: { type: 'object', properties: {
    what: { type: 'string' }, evidence: { type: 'string' }, owner: { type: 'string' },
  }, required: ['what', 'evidence', 'owner'] } },
  levers: { type: 'array', items: { type: 'object', properties: {
    lever: { type: 'string' }, saves: { type: 'string' }, quality_risk: { type: 'string' }, owner: { type: 'string' },
  }, required: ['lever', 'quality_risk', 'owner'] } },
}, required: ['unit_cost', 'burn', 'anomalies', 'levers'] }

phase('Collect')
const usage = await agent(`Follow engineering-practices project-onboarding, then the engineering-operations operating-data skill. Read-only. For ${period}, read the usage and spend records the project names (agent runs, tokens, compute minutes, money) and the work records that say what the spend produced (merged changes, finished items). One line per spend item with its role and work item where the records link them, and its source. Name every missing record as a data gap; never estimate around it. Edit nothing.`, { schema: USAGE, phase: 'Collect', label: 'collect-usage' })
if (!usage) return 'cost-check stopped: could not read usage records.'

phase('Analyze')
const cost = await agent(`Follow the engineering-operations cost-and-usage skill. Read-only. Allocate this spend by work item, then role, with the unallocated share; compute unit cost per outcome; compare burn with ${budget} and forecast to the end of the period, saying the method; flag anomalies against the recent pattern, each with evidence and one owner; name the cheapest levers, usage levers before rate levers, each with what it saves, its quality risk and its owner. If no budget is recorded, report spend and trend only. Edit nothing.\n${JSON.stringify(usage)}`, { schema: COST, phase: 'Analyze', label: 'analyze-cost' })
if (!cost) return { status: 'unanalyzed', spend_total: usage.spend_total, data_gaps: usage.data_gaps }

phase('Report')
const note = await agent(`Follow the engineering-operations operations-reporting skill, cost line only. Write a short cost note: first line what needs action and from whom (an anomaly, a budget threshold) or "Nothing needs action"; then spend against budget with trend and forecast, unit cost beside its quality pair if the records give one, the unallocated share, and the top levers with their quality risk. Team-level only: no agent or person named or ranked. Data gaps at the end. Return only the note.\n${JSON.stringify({ spend_total: usage.spend_total, data_gaps: usage.data_gaps, ...cost })}`, { phase: 'Report', label: 'cost-note' })

return {
  note: note || 'cost note drafting failed; see analysis',
  anomalies: cost.anomalies,
  levers: cost.levers,
  burn: cost.burn,
  forecast: cost.forecast || 'not forecast',
  data_gaps: usage.data_gaps,
}
})(RUN.agent, RUN.phase, RUN.log)]); return RUN.finish(RUN_OUT)

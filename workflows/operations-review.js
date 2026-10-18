// SPDX-License-Identifier: GPL-2.0-or-later
export const meta = {
  name: 'operations-review',
  description: 'Review how the team works over a window: read every role\'s records, measure cost, flow and quality against baselines, find waste and workflow problems, send at most a few read-only investigators for what the records cannot explain, have the findings checked independently, record them and draft the scorecard. Use on the cadence the owner set or when cost or flow looks wrong. args: { window: "<period, default: since the last review>", max_investigations: <0-3, default 1>, records: "<where the records live, optional>", audience: "<who the report is for, optional>" }',
  phases: [
    { title: 'Collect', detail: 'read the records; compute measures against baselines' },
    { title: 'Analyze', detail: 'cost, anomalies, waste; findings and open questions' },
    { title: 'Investigate', detail: 'at most max_investigations read-only investigators' },
    { title: 'Challenge', detail: 'independent check of the findings' },
    { title: 'Record', detail: 'findings record and measures; Diataxis check' },
    { title: 'Report', detail: 'scorecard, actions first' },
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

const window = (args && args.window) || 'since the last operations review recorded in the project (or the last 7 days if there is none)'
const requested = args && Number.isInteger(args.max_investigations) ? args.max_investigations : 1
const maxInvestigations = Math.max(0, Math.min(3, requested))
const records = (args && args.records) || "the record locations named in the project's CLAUDE.md or profile"
const audience = (args && args.audience) || "the project's coordinator"

const MEASURES = { type: 'object', properties: {
  measures: { type: 'array', items: { type: 'object', properties: {
    name: { type: 'string' }, value: { type: 'string' }, baseline: { type: 'string' },
    trend: { type: 'string', enum: ['better', 'same', 'worse', 'unknown'] }, pair: { type: 'string' }, source: { type: 'string' },
  }, required: ['name', 'value', 'source'] } },
  spend: { type: 'string' }, budget: { type: 'string' },
  data_gaps: { type: 'array', items: { type: 'string' } },
}, required: ['measures', 'data_gaps'] }

const ANALYSIS = { type: 'object', properties: {
  findings: { type: 'array', items: { type: 'object', properties: {
    id: { type: 'string' }, title: { type: 'string' }, waste: { type: 'string' }, evidence: { type: 'array', items: { type: 'string' } },
    size: { type: 'string' }, cause: { type: 'string' }, owner: { type: 'string' }, proposal: { type: 'string' },
    confidence: { type: 'string', enum: ['high', 'medium', 'low'] },
  }, required: ['id', 'title', 'evidence', 'size', 'owner'] } },
  questions: { type: 'array', items: { type: 'object', properties: {
    id: { type: 'string' }, finding: { type: 'string' }, question: { type: 'string' }, read: { type: 'string' },
    budget: { type: 'string' }, size: { type: 'string' },
  }, required: ['id', 'finding', 'question', 'read', 'budget'] } },
  anomalies: { type: 'array', items: { type: 'string' } },
}, required: ['findings', 'questions', 'anomalies'] }

const ANSWER = { type: 'object', properties: {
  id: { type: 'string' }, answer: { type: 'string' }, evidence: { type: 'array', items: { type: 'string' } },
  confidence: { type: 'string', enum: ['high', 'medium', 'low'] }, still_unknown: { type: 'string' },
}, required: ['id', 'answer', 'evidence', 'confidence'] }

const VERDICTS = { type: 'object', properties: {
  verdicts: { type: 'array', items: { type: 'object', properties: {
    id: { type: 'string' }, verdict: { type: 'string', enum: ['confirmed', 'weakened', 'dropped'] }, reason: { type: 'string' },
  }, required: ['id', 'verdict', 'reason'] } },
}, required: ['verdicts'] }

phase('Collect')
const collected = await agent(`Follow engineering-practices project-onboarding, then the engineering-operations operating-data skill. Read-only. Read ${records} for ${window}: workflow run results, the gap log, CI history, review verdicts, work records, usage and spend. Compute each measure the project's operations reference defines (or the skill's starting set, if none is defined yet) with its value, baseline, trend, pair and source. Name every record that is missing or unreadable as a data gap; never estimate around it. Edit nothing.`, { schema: MEASURES, phase: 'Collect', label: 'collect' })
if (!collected) return 'operations-review stopped: could not read the records.'

phase('Analyze')
const analysis = await agent(`Follow the engineering-operations cost-and-usage and waste-hunting skills. Read-only. From these measures and the records behind them, write findings in the waste-hunting format: blameless, sized over the window, one owning role each, evidence links. Flag spend anomalies. Where the records show a problem but not its cause, write an investigation question following the investigations skill (one question, the records to read, a budget), ranked by the size of the waste; ask nothing the records already answer. Edit nothing.\n${JSON.stringify(collected)}`, { schema: ANALYSIS, phase: 'Analyze', label: 'analyze' })
if (!analysis) return { status: 'unanalyzed', measures: collected.measures, data_gaps: collected.data_gaps }

phase('Investigate')
const sent = analysis.questions.slice(0, maxInvestigations)
const answers = await pipeline(sent, q => agent(`Follow the engineering-operations investigations skill. You are an investigator with one question. Read-only: do not edit, commit, push, re-run jobs, message other agents or start any work. Read only: ${q.read}. Budget: ${q.budget}. Stop when the question is answered, the budget is spent, or the answer needs access you do not have. Return the answer with evidence links, your confidence and what is still unknown.\nQuestion: ${q.question}\nFor finding: ${q.finding}`, { schema: ANSWER, phase: 'Investigate', label: `investigate:${q.id}` }))
const investigated = sent.map((q, i) => answers[i] || { id: q.id, answer: 'investigation failed; unverified', evidence: [], confidence: 'low' })
const deferred = analysis.questions.slice(maxInvestigations).map(q => q.question)

phase('Challenge')
const challenge = analysis.findings.length
  ? await agent(`Act as an independent reviewer of these findings; you did not write them. Read-only. Do not edit anything. For each finding, open its evidence links and check: the evidence shows what the finding claims; the size is computed over the stated window; the cause is a system cause, not blame on an agent or person; one owner can act on it; the investigation answers support it. Return a verdict per finding: confirmed, weakened (say what is overstated) or dropped (say why).\n${JSON.stringify({ findings: analysis.findings, investigations: investigated })}`, { schema: VERDICTS, phase: 'Challenge', label: 'challenge', independent: true })
  : { verdicts: [] }
const verdictOf = id => ((challenge && challenge.verdicts) || []).find(v => v.id === id)
const kept = analysis.findings
  .map(f => ({ ...f, verdict: verdictOf(f.id) ? verdictOf(f.id).verdict : 'unchecked' }))
  .filter(f => f.verdict !== 'dropped')

phase('Record')
const recorded = await agent(`Docs plan: this review changes reference docs only (the project's operations reference: measures with values and baselines, the findings record, the review log with what this review cost). Do: add the measures, the kept findings with their verdicts, and one review-log entry for ${window} in one edit, describing state only (no narrative). Findings marked unchecked say so. Then check (the project's Diataxis guide): each touched page holds one kind (reference), keeps its existing format and links to related pages. Report pages touched.\n${JSON.stringify({ measures: collected.measures, findings: kept, investigations: investigated, deferred_questions: deferred, data_gaps: collected.data_gaps })}`, { phase: 'Record', label: 'record' })

phase('Report')
const report = await agent(`Follow the engineering-operations operations-reporting skill. Write the scorecard for ${audience}. First line: what needs action and from whom (or "Nothing needs action"). Then cost, flow, quality and method lines with baselines and trends, pairs side by side; the top three kept findings by size with owners; data gaps; and what this review cost (agents run: ${2 + sent.length + (analysis.findings.length ? 1 : 0) + 2}). Team-level only: no agent or person named or ranked. Return only the report text.\n${JSON.stringify({ measures: collected.measures, spend: collected.spend, budget: collected.budget, anomalies: analysis.anomalies, findings: kept, data_gaps: collected.data_gaps })}`, { phase: 'Report', label: 'report' })

return {
  report: report || 'report drafting failed; see findings',
  findings: kept,
  investigations: investigated,
  deferred_questions: deferred,
  data_gaps: collected.data_gaps,
  recorded: recorded ? 'yes (uncommitted; land it with engineering-practices small-change)' : 'no (record step failed)',
}
})(RUN.agent, RUN.phase, RUN.log)]); return RUN.finish(RUN_OUT)

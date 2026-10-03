import { useLiveQuery } from 'dexie-react-hooks'
import { useState } from 'react'
import { EPIGRAPHS, MILESTONES, dayKey, pick } from '../craft/why'
import { db } from '../db'

export function Epigraph() {
  const [e] = useState(() => pick(EPIGRAPHS))
  return (
    <figure className="epigraph">
      <blockquote>{e.text}</blockquote>
      {e.note && <figcaption>{e.note}</figcaption>}
    </figure>
  )
}

/** Consecutive days with writing, counting back from today (or yesterday, so an unfinished day never breaks it). */
function streak(days: Map<string, number>): number {
  const d = new Date()
  if (!(days.get(dayKey(d)) ?? 0)) d.setDate(d.getDate() - 1)
  let n = 0
  while ((days.get(dayKey(d)) ?? 0) > 0) {
    n++
    d.setDate(d.getDate() - 1)
  }
  return n
}

export function TodayCard() {
  const rows = useLiveQuery(() => db.days.toArray(), [])
  if (!rows) return null
  const map = new Map(rows.map((r) => [r.date, r.words]))
  const today = map.get(dayKey()) ?? 0
  const run = streak(map)
  const milestone = [...MILESTONES].reverse().find((m) => today >= m.words)

  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return { key: dayKey(d), words: map.get(dayKey(d)) ?? 0, label: d.toLocaleDateString([], { weekday: 'short' }) }
  })
  const max = Math.max(500, ...last7.map((d) => d.words))

  return (
    <section className="today-card">
      <div className="row between wrap">
        <div>
          <strong className="today-num">{today.toLocaleString()}</strong> <span className="muted">{today === 1 ? 'word' : 'words'} today</span>
        </div>
        {run >= 2 && <span className="muted">{run} days in a row</span>}
      </div>
      <p className="muted">{milestone ? milestone.line : 'A blank page is an invitation, not a debt.'}</p>
      <div className="week" role="img" aria-label={last7.map((d) => `${d.label} ${d.words} words`).join(', ')}>
        {last7.map((d) => (
          <div key={d.key} className="week-col">
            <span className="week-bar" style={{ height: `${Math.max(4, (d.words / max) * 100)}%`, opacity: d.words ? 1 : 0.25 }} />
            <small className="muted">{d.label[0]}</small>
          </div>
        ))}
      </div>
    </section>
  )
}

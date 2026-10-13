import { useLiveQuery } from 'dexie-react-hooks'
import { useState } from 'react'
import { EPIGRAPHS, MILESTONES, dayKey, pick } from '../craft/why'
import { db } from '../db'

export function Epigraph() {
  const [e] = useState(() => pick(EPIGRAPHS))
  return (
    <p className="epigraph">
      “{e.text}”{e.note && <cite> — {e.note}</cite>}
    </p>
  )
}

/** Today's words as a share of a chapter, said plainly. A chapter is about 1,500 words. */
function scale(words: number): string {
  if (words === 0) return 'a blank page is an invitation, not a debt'
  if (words < 375) return 'a start'
  if (words < 750) return 'about a quarter of a chapter'
  if (words < 1125) return 'about half a chapter'
  if (words < 1500) return 'most of a chapter'
  if (words < 3000) return 'a chapter, and then some'
  return 'two chapters'
}

/** Seven bars replace "N days in a row". Days you wrote are shown; days you didn't are just quiet. */
export function TodayBlock() {
  const rows = useLiveQuery(() => db.days.toArray(), [])
  if (!rows) return null
  const map = new Map(rows.map((r) => [r.date, r.words]))
  const today = map.get(dayKey()) ?? 0
  const milestone = [...MILESTONES].reverse().find((m) => today >= m.words)
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return { key: dayKey(d), words: map.get(dayKey(d)) ?? 0, label: d.toLocaleDateString([], { weekday: 'short' }) }
  })
  const max = Math.max(500, ...last7.map((d) => d.words))

  return (
    <section className="today" aria-labelledby="today-heading">
      <h2 id="today-heading">Today</h2>
      <div className="big">
        {today.toLocaleString()} <small>{today === 1 ? 'word' : 'words'} · {scale(today)}</small>
      </div>
      <div className="bars" role="img" aria-label={last7.map((d) => `${d.label} ${d.words} words`).join(', ')}>
        {last7.map((d) => (
          <i key={d.key} className={d.words ? 'on' : ''} style={{ height: `${Math.max(4, (d.words / max) * 100)}%` }} />
        ))}
      </div>
      <div className="days" aria-hidden>
        {last7.map((d) => <span key={d.key}>{d.label}</span>)}
      </div>
      <p className="hint" style={{ marginTop: 8 }}>{milestone ? milestone.line : 'Days you wrote are shown. Days you didn’t are just quiet. Nothing is counted against you.'}</p>
    </section>
  )
}

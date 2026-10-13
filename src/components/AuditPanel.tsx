import { useLiveQuery } from 'dexie-react-hooks'
import { auditOutline, pace } from '../craft/audit'
import { dayKey } from '../craft/why'
import { db } from '../db'
import type { Scene, Story } from '../types'
import { inDays } from './OutlinePane'
import { Section } from './RightSidebar'

const num = (n: number) => n.toLocaleString()
const longDate = (iso: string) => new Date(`${iso}T12:00:00`).toLocaleDateString([], { month: 'short', day: 'numeric' })

/** Reading across tells you if a chapter works. Reading down tells you if the book does. The findings sit beside the rows they point at. */
export function AuditPanel({ story, scenes }: { story: Story; scenes: Scene[] }) {
  const days = useLiveQuery(() => db.days.toArray(), [], [])
  const findings = scenes.length >= 2 ? auditOutline(scenes) : []
  const written = scenes.reduce((n, s) => n + s.words, 0)
  const p = story.targetWords && story.finishBy ? pace(story.targetWords, written, story.finishBy) : null
  const set = (patch: Pick<Story, 'targetWords' | 'finishBy'>) => void db.stories.update(story.id, patch)

  // the last seven days, honestly: what the writer has actually been doing, and a later date that would fit it
  const week = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - i)
    return days.find((r) => r.date === dayKey(d))?.words ?? 0
  })
  const avg = Math.round(week.reduce((a, b) => a + b, 0) / 7)
  let paceLine: string | null = null
  if (p && p.remaining > 0 && p.days > 0) {
    if (avg > 0 && p.perDay > avg * 1.25) {
      const later = inDays(Math.ceil(p.remaining / avg) - 1)
      paceLine = `Pace: ${num(p.perDay)} words a day from here. The last seven days averaged ${num(avg)}. Moving the date to ${longDate(later)} would make it ${num(Math.ceil(p.remaining / Math.ceil(p.remaining / avg)))}.`
    } else paceLine = `Pace: ${num(p.perDay)} words a day from here${avg > 0 ? `, and the last seven days averaged ${num(avg)}` : ''}.`
  }

  return (
    <>
      <Section title="Read the whole outline">
        <p className="hint">Reading across tells you if a chapter works. Reading down tells you if the book does.</p>
        {scenes.length < 2 && <p className="hint">Two chapters or more give the outline something to read.</p>}
        {findings.map((f, i) => (
          <div className="audit" key={i}><b /><div>{f.text}</div></div>
        ))}
        {scenes.length >= 2 && findings.length === 0 && <div className="audit"><b className="ok" /><div>Nothing stands out. Every chapter has a goal, a conflict and a turn, and the middle keeps moving.</div></div>}
        {paceLine && <div className="audit"><b className={avg > 0 && p && p.perDay > avg * 1.25 ? '' : 'ok'} /><div>{paceLine}</div></div>}
        {p && p.remaining === 0 && <div className="audit"><b className="ok" /><div>You have reached your target. Everything after this is revision and joy.</div></div>}
        {p && p.days === 0 && p.remaining > 0 && <div className="audit"><b /><div>The date has passed. Pick a new one, no judgment: {num(p.remaining)} words remain.</div></div>}
      </Section>
      <Section title="Finish line" count={p ? `${num(p.remaining)} to go` : undefined} open={false}>
        <p className="hint">Roughly one chapter a day, around 1,500 to 2,000 words. Fifteen days makes a novella; thirty makes a novel. You have {scenes.length} planned.</p>
        <div className="two">
          <label className="field">
            <span>Target words</span>
            <input type="number" min={0} step={500} value={story.targetWords ?? ''} onChange={(e) => set({ targetWords: e.target.value ? Number(e.target.value) : undefined, finishBy: story.finishBy })} />
          </label>
          <label className="field">
            <span>Finish by</span>
            <input type="date" value={story.finishBy ?? ''} onChange={(e) => set({ targetWords: story.targetWords, finishBy: e.target.value || undefined })} />
          </label>
        </div>
        {(story.targetWords || story.finishBy) && (
          <div className="acts"><button className="btn small quiet" onClick={() => set({ targetWords: undefined, finishBy: undefined })}>Clear the finish line</button></div>
        )}
      </Section>
    </>
  )
}

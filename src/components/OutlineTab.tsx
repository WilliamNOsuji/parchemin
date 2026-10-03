import { closestCenter, DndContext, KeyboardSensor, PointerSensor, TouchSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { auditOutline, pace } from '../craft/audit'
import { addScene, db, deleteScene, reorderScenes } from '../db'
import { navigate } from '../route'
import { STATUSES, type ChapterPlan, type Scene, type SceneStatus, type Story } from '../types'

const PLAN_FIELDS: { key: keyof ChapterPlan; label: string; placeholder: string }[] = [
  { key: 'goal', label: 'Goal', placeholder: 'What does the POV character want in this scene? (not their life goal)' },
  { key: 'conflict', label: 'Conflict', placeholder: 'Who or what is stopping them?' },
  { key: 'turn', label: 'Turn', placeholder: 'How does the chapter end somewhere different from where it began?' },
  { key: 'pov', label: 'Point of view', placeholder: 'Whose eyes?' },
  { key: 'setting', label: 'Setting', placeholder: 'Where? Pick the room that makes the goal hardest.' },
  { key: 'prop', label: 'Prop', placeholder: 'An object someone can pick up, fuss with or fight over' },
  { key: 'lastLine', label: 'Last line or image', placeholder: 'Know how it ends before you start' },
]

function PlanFields({ scene }: { scene: Scene }) {
  const filled = PLAN_FIELDS.filter((f) => scene.plan?.[f.key]?.trim()).length
  return (
    <details className="plan">
      <summary>Chapter plan <span className="muted">{filled}/{PLAN_FIELDS.length}</span></summary>
      <div className="plan-grid">
        {PLAN_FIELDS.map((f) => (
          <label className="field" key={f.key}>
            <span>{f.label}</span>
            <input
              defaultValue={scene.plan?.[f.key] ?? ''}
              placeholder={f.placeholder}
              onBlur={(e) => {
                if (e.target.value !== (scene.plan?.[f.key] ?? '')) void db.scenes.update(scene.id, { [`plan.${f.key}`]: e.target.value } as never)
              }}
            />
          </label>
        ))}
      </div>
    </details>
  )
}

function Card({ scene, storyId, canDelete }: { scene: Scene; storyId: string; canDelete: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: scene.id })
  return (
    <li
      ref={setNodeRef}
      className={`scene-card${isDragging ? ' dragging' : ''}`}
      style={{ transform: CSS.Transform.toString(transform), transition }}
    >
      <button className="drag-handle" aria-label={`Reorder ${scene.title}`} {...attributes} {...listeners}>⠿</button>
      <div className="scene-card-body">
        <div className="row">
          <input
            className="card-title"
            aria-label="Chapter title"
            defaultValue={scene.title}
            onBlur={(e) => db.scenes.update(scene.id, { title: e.target.value.trim() || 'Untitled' })}
          />
          <select
            className={`status ${scene.status}`}
            aria-label="Status"
            value={scene.status}
            onChange={(e) => db.scenes.update(scene.id, { status: e.target.value as SceneStatus })}
          >
            {STATUSES.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
        </div>
        <textarea
          rows={2}
          aria-label="Summary"
          placeholder="What happens here?"
          defaultValue={scene.summary}
          onBlur={(e) => db.scenes.update(scene.id, { summary: e.target.value })}
        />
        <PlanFields scene={scene} />
        <div className="row between">
          <small className="muted">{scene.words.toLocaleString()} words</small>
          <div className="row">
            <button className="btn small" onClick={() => navigate({ name: 'story', storyId, tab: 'write', itemId: scene.id })}>Write →</button>
            {canDelete && (
              <button
                className="icon-btn"
                aria-label={`Delete ${scene.title}`}
                onClick={() => {
                  const msg = scene.words > 0 ? `Delete "${scene.title}" and its ${scene.words} words?` : `Delete "${scene.title}"?`
                  if (window.confirm(msg)) void deleteScene(scene.id)
                }}
              >
                🗑
              </button>
            )}
          </div>
        </div>
      </div>
    </li>
  )
}

const isoDay = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
/** Date n days from today; today counts as day one. */
const inDays = (n: number) => {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return isoDay(d)
}

/** A finish line turns a pile of chapters into a calendar: one chapter a day. */
function FinishLine({ story, written, chapters }: { story: Story; written: number; chapters: number }) {
  const set = (patch: Pick<Story, 'targetWords' | 'finishBy'>) => void db.stories.update(story.id, patch)
  const p = story.targetWords && story.finishBy ? pace(story.targetWords, written, story.finishBy) : null
  return (
    <details className="finish-line" open={!!p}>
      <summary>Finish line{p ? <span className="muted"> · {p.remaining.toLocaleString()} words to go</span> : null}</summary>
      <div className="stack">
        <p className="muted small">
          Aim for roughly one chapter a day, around 1,500 to 2,000 words. Fifteen days makes a novella; thirty makes a novel. You have {chapters} planned.
        </p>
        <div className="row wrap">
          <button className="btn small" onClick={() => set({ targetWords: 25_000, finishBy: inDays(14) })}>Novella · 15 days</button>
          <button className="btn small" onClick={() => set({ targetWords: 60_000, finishBy: inDays(29) })}>Novel · 30 days</button>
          {p && <button className="btn small" onClick={() => set({ targetWords: undefined, finishBy: undefined })}>Clear</button>}
        </div>
        <div className="row wrap">
          <label className="field grow">
            <span>Target words</span>
            <input type="number" min={0} step={500} value={story.targetWords ?? ''} onChange={(e) => set({ targetWords: e.target.value ? Number(e.target.value) : undefined, finishBy: story.finishBy })} />
          </label>
          <label className="field grow">
            <span>Finish by</span>
            <input type="date" value={story.finishBy ?? ''} onChange={(e) => set({ targetWords: story.targetWords, finishBy: e.target.value || undefined })} />
          </label>
        </div>
        {p && (
          <p>
            {p.remaining === 0
              ? 'You have reached your target. Everything after this is revision and joy.'
              : p.days === 0
                ? `The date has passed. Pick a new one, no judgment: ${p.remaining.toLocaleString()} words remain.`
                : `About ${p.perDay.toLocaleString()} words a day for ${p.days} ${p.days === 1 ? 'day' : 'days'}.`}
          </p>
        )}
      </div>
    </details>
  )
}

function Audit({ scenes }: { scenes: Scene[] }) {
  const findings = auditOutline(scenes)
  if (scenes.length < 2) return null
  return (
    <details className="audit" open={findings.some((f) => f.level === 'pattern')}>
      <summary>Read the whole outline <span className="muted">{findings.length ? `${findings.length} to look at` : 'nothing to flag'}</span></summary>
      {findings.length ? (
        <ul>
          {findings.map((f, i) => (
            <li key={i} className={f.level}>{f.text}</li>
          ))}
        </ul>
      ) : (
        <p className="muted">Reading across tells you if a chapter works; reading down tells you if the book does. Nothing stands out.</p>
      )}
    </details>
  )
}

export function OutlineTab({ story, scenes }: { story: Story; scenes: Scene[] }) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return
    const from = scenes.findIndex((s) => s.id === active.id)
    const to = scenes.findIndex((s) => s.id === over.id)
    void reorderScenes(arrayMove(scenes, from, to).map((s) => s.id))
  }

  const total = scenes.length
  const done = scenes.filter((s) => s.status === 'done').length

  return (
    <div className="outline">
      <div className="progress-card">
        <div className="row between">
          <strong>{done} of {total} done</strong>
          <small className="muted">{scenes.reduce((n, s) => n + s.words, 0).toLocaleString()} words total</small>
        </div>
        <div className="progress" role="img" aria-label={STATUSES.map((st) => `${scenes.filter((s) => s.status === st.id).length} ${st.label}`).join(', ')}>
          {STATUSES.map((st) => (
            <span key={st.id} className={`seg ${st.id}`} style={{ flexGrow: scenes.filter((s) => s.status === st.id).length }} />
          ))}
        </div>
        <div className="legend">
          {STATUSES.map((st) => (
            <span key={st.id}><i className={`dot ${st.id}`} /> {st.label}</span>
          ))}
        </div>
      </div>

      <FinishLine story={story} written={scenes.reduce((n, s) => n + s.words, 0)} chapters={total} />
      <Audit scenes={scenes} />

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={scenes.map((s) => s.id)} strategy={verticalListSortingStrategy}>
          <ul className="cards">
            {scenes.map((s) => (
              <Card key={s.id} scene={s} storyId={story.id} canDelete={scenes.length > 1} />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
      <button className="btn" onClick={() => addScene(story.id)}>＋ Add chapter</button>
    </div>
  )
}

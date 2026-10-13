import { closestCenter, DndContext, KeyboardSensor, PointerSensor, TouchSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { pace } from '../craft/audit'
import { inDays } from '../craft/why'
import { addScene, db, reorderScenes, setAsideScene } from '../db'
import { navigate } from '../route'
import { STATUSES, type Scene, type SceneStatus, type Story } from '../types'
import { GrowingText } from './GrowingText'
import { Icon } from './Icons'
import { Menu } from './Menu'

const num = (n: number) => n.toLocaleString()
const longDate = (iso: string) => new Date(`${iso}T12:00:00`).toLocaleDateString([], { month: 'short', day: 'numeric' })

const MARKS: { key: 'goal' | 'conflict' | 'turn'; label: string }[] = [
  { key: 'goal', label: 'Goal' },
  { key: 'conflict', label: 'Conflict' },
  { key: 'turn', label: 'Turn' },
]

function Row({ scene, n, selected, canDelete, onSelect }: { scene: Scene; n: number; selected: boolean; canDelete: boolean; onSelect: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: scene.id })
  return (
    <li
      ref={setNodeRef}
      className={`orow${selected ? ' sel' : ''}${isDragging ? ' dragging' : ''}`}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      onClick={(e) => {
        const el = e.target as HTMLElement
        if (!el.closest('input, select, button, textarea')) onSelect()
      }}
      aria-current={selected ? 'true' : undefined}
    >
      <button className="h" aria-label={`Reorder ${scene.title}`} {...attributes} {...listeners}><Icon name="grip" size={14} /></button>
      <span className="n">{n}</span>
      <div className="pick">
        <input className="t" aria-label="Chapter title" defaultValue={scene.title} onFocus={onSelect} onBlur={(e) => e.target.value.trim() !== scene.title && db.scenes.update(scene.id, { title: e.target.value.trim() || 'Untitled' })} />
        <GrowingText className="s" aria-label="Summary" placeholder="What happens here?" defaultValue={scene.summary} onFocus={onSelect} onBlur={(e) => e.target.value !== scene.summary && db.scenes.update(scene.id, { summary: e.target.value })} />
      </div>
      <div className="orow-right">
        <div className="row">
          <label className={`stat status ${scene.status}`} title="Status">
            <span className={`dot ${scene.status}`} />
            <select aria-label="Status" value={scene.status} onChange={(e) => db.scenes.update(scene.id, { status: e.target.value as SceneStatus })}>
              {STATUSES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </label>
          <span className="w">{num(scene.words)}</span>
        </div>
        <span className="marks" aria-label={MARKS.map((m) => `${m.label}: ${scene.plan?.[m.key]?.trim() ? 'yes' : 'not yet'}`).join(', ')}>
          {MARKS.map((m) => <span key={m.key}><b className={scene.plan?.[m.key]?.trim() ? '' : 'no'} />{m.label}</span>)}
        </span>
      </div>
      <Menu
        label={`Actions for ${scene.title}`}
        items={[
          { label: 'Write this chapter', onClick: () => navigate({ name: 'story', storyId: scene.storyId, tab: 'write', itemId: scene.id }) },
          ...(canDelete
            ? [
                {
                  label: 'Move to the drawer',
                  onClick: () => {
                    if (window.confirm(`Move "${scene.title}" to the drawer? You can put it back from the drawer.`)) void setAsideScene(scene.id)
                  },
                },
              ]
            : []),
        ]}
      />
    </li>
  )
}

/** The board, the finish line and the audit on one screen. Rows, not cards: reading across one row is the chapter check. */
export function OutlinePane({ story, scenes, selectedId, onOpenRight }: { story: Story; scenes: Scene[]; selectedId?: string; onOpenRight: (tab: string) => void }) {
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
  const select = (id?: string) => navigate({ name: 'story', storyId: story.id, tab: 'outline', itemId: id })
  const set = (patch: Pick<Story, 'targetWords' | 'finishBy'>) => void db.stories.update(story.id, patch)

  const written = scenes.reduce((n, s) => n + s.words, 0)
  const target = story.targetWords
  const p = target && story.finishBy ? pace(target, written, story.finishBy) : null
  const share = target ? Math.min(100, Math.round((written / target) * 100)) : 0

  return (
    <>
      <div className="pane-head">
        <div className="crumbs"><span className="crumb-story"><b title={story.title}>{story.title || 'Untitled story'}</b><span aria-hidden>›</span></span><span>Outline</span></div>
      </div>
      <div className="pane-scroll">
        <div className="ol">
          <div className="ol-head">
            <div>
              <h1>Outline</h1>
              <div className="finish">
                {target
                  ? `${num(written)} of ${num(target)} words${story.finishBy && p ? ` · Finish by ${longDate(story.finishBy)} · ${p.days} ${p.days === 1 ? 'day' : 'days'} left${p.remaining > 0 && p.days > 0 ? ` · about ${num(p.perDay)} words a day from here` : p.remaining === 0 ? ' · the target is reached' : ''}` : ' · no date, and that is allowed'}`
                  : `${num(written)} words in ${scenes.length} ${scenes.length === 1 ? 'chapter' : 'chapters'} · no finish line yet`}
              </div>
              {target ? <div className="bar" role="img" aria-label={`${share}% of the target`}><i style={{ width: `${share}%` }} /></div> : null}
              <div className="finish">A finish date is a kindness, not a threat. Pause it or move it whenever life does.</div>
            </div>
            <div className="acts">
              <button className="btn small" onClick={() => set({ targetWords: 25_000, finishBy: inDays(14) })}>Novella · 15 days</button>
              <button className="btn small" onClick={() => set({ targetWords: 60_000, finishBy: inDays(29) })}>Novel · 30 days</button>
              {story.finishBy ? (
                <button className="btn small quiet" onClick={() => set({ targetWords: target, finishBy: undefined })}>Pause the finish line</button>
              ) : target ? (
                <button className="btn small quiet" onClick={() => onOpenRight('audit')}>Set a date…</button>
              ) : null}
              <button className="btn small primary" onClick={() => onOpenRight('audit')}>Read the whole outline</button>
            </div>
          </div>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext items={scenes.map((s) => s.id)} strategy={verticalListSortingStrategy}>
              <ul className="ol-rows">
                {scenes.map((s, i) => (
                  <Row key={s.id} scene={s} n={i + 1} selected={s.id === selectedId} canDelete={scenes.length > 1} onSelect={() => s.id !== selectedId && select(s.id)} />
                ))}
              </ul>
            </SortableContext>
          </DndContext>
          <p style={{ marginTop: 10 }}>
            <button className="btn small" onClick={async () => select(await addScene(story.id))}><Icon name="plus" size={12} /> Add a chapter</button>
            <span className="hint" style={{ marginLeft: 10 }}>Pick a row to see its plan in the sidebar. Drag the handle to reorder.</span>
          </p>
        </div>
      </div>
    </>
  )
}

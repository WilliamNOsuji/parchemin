import { useLiveQuery } from 'dexie-react-hooks'
import { useMemo, useState } from 'react'
import { db, takeSnapshot } from '../db'
import { PROMPT_KINDS, randomPrompt, type PromptKind } from '../prompts'
import { cleanHtml } from '../sanitize'
import type { Character, ChapterPlan, Folder, Scene, Snapshot, Story } from '../types'
import { GrowingText } from './GrowingText'
import { Section } from './RightSidebar'

/** Shows a snapshot's text. It is rebuilt through the editor's schema first, so a snapshot from a restored backup cannot run code. */
function SnapshotPreview({ snapshot }: { snapshot: Snapshot }) {
  const html = useMemo(() => cleanHtml(snapshot.content), [snapshot.content])
  return <div className="snap-preview prose" dangerouslySetInnerHTML={{ __html: html || '<p><em>(empty)</em></p>' }} />
}

export function PromptsPanel({ characters }: { characters: Character[] }) {
  const [kind, setKind] = useState<PromptKind>('stuck')
  const [prompt, setPrompt] = useState(() => randomPrompt('stuck'))
  const pick = (k: PromptKind, current?: string) => {
    setKind(k)
    setPrompt(randomPrompt(k, current))
  }
  const named = characters.filter((c) => c.name.trim() && c.name !== 'New character')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const ask = useMemo(() => (named.length ? named[Math.floor(Math.random() * named.length)] : null), [prompt, named.length])

  return (
    <Section title="A nudge, if you need one">
      <div className="chips" role="group" aria-label="Prompt type">
        {PROMPT_KINDS.map((k) => (
          <button key={k.id} className={`chip${kind === k.id ? ' on' : ''}`} aria-pressed={kind === k.id} onClick={() => pick(k.id)}>
            {k.label}
          </button>
        ))}
      </div>
      <blockquote className="prompt-card">{prompt}</blockquote>
      {ask && kind === 'character' && <p className="hint">Try it on <strong>{ask.name}</strong>.</p>}
      <div className="acts">
        <button className="btn small" onClick={() => pick(kind, prompt)}>Another one</button>
        <span className="hint">Prompts are suggestions only. Nothing is written for you.</span>
      </div>
    </Section>
  )
}

export function SnapshotsPanel({ scene }: { scene: Scene }) {
  const snaps = useLiveQuery(() => db.snapshots.where('sceneId').equals(scene.id).reverse().sortBy('createdAt'), [scene.id], [] as Snapshot[])
  const [label, setLabel] = useState('')
  const [preview, setPreview] = useState<string | null>(null)

  return (
    <Section title="Snapshots" count={snaps.length || undefined}>
      <form
        className="row"
        onSubmit={async (e) => {
          e.preventDefault()
          await takeSnapshot(scene.id, label)
          setLabel('')
        }}
      >
        <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Name this draft (optional)" aria-label="Snapshot name" />
        <button className="btn small primary" type="submit">Snapshot now</button>
      </form>
      <p className="hint">Save one before a big rewrite. You can always come back.</p>
      {snaps.length === 0 && <p className="hint">No snapshots of this chapter yet.</p>}
      <ul className="snap-list">
        {snaps.map((s) => (
          <li key={s.id}>
            <div className="snap-head">
              <div>
                <strong>{s.label}</strong>
                <small className="muted"> · {new Date(s.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })} · {s.words.toLocaleString()}</small>
              </div>
              <div className="acts">
                <button className="btn small" onClick={() => setPreview(preview === s.id ? null : s.id)}>{preview === s.id ? 'Hide' : 'Preview'}</button>
                <button
                  className="btn small"
                  onClick={async () => {
                    if (!window.confirm('Restore this snapshot? Your current text will be saved as a snapshot first.')) return
                    await takeSnapshot(scene.id, 'Before restore')
                    await db.scenes.update(scene.id, { content: s.content, words: s.words, updatedAt: Date.now() })
                  }}
                >
                  Restore
                </button>
                <button className="btn small quiet danger" aria-label={`Delete snapshot ${s.label}`} onClick={() => db.snapshots.delete(s.id)}>Delete</button>
              </div>
            </div>
            {preview === s.id && <SnapshotPreview snapshot={s} />}
          </li>
        ))}
      </ul>
    </Section>
  )
}

function folderOptions(folders: Folder[]) {
  const out: { id: string; label: string }[] = []
  const walk = (parent: string | null, depth: number) => {
    folders
      .filter((f) => f.parentId === parent)
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach((f) => {
        out.push({ id: f.id, label: `${'  '.repeat(depth)}${f.name}` })
        walk(f.id, depth + 1)
      })
  }
  walk(null, 0)
  return out
}

/** The chapter's summary and the sentence waiting for tomorrow, then the story's own notes: title, synopsis, folder, tags. */
export function NotesPanel({ scene, story }: { scene: Scene; story: Story }) {
  const folders = useLiveQuery(() => db.folders.toArray(), [], [] as Folder[])
  const options = useMemo(() => folderOptions(folders), [folders])
  const [tagDraft, setTagDraft] = useState('')
  const addTag = () => {
    const t = tagDraft.trim().replace(/^#/, '').toLowerCase()
    setTagDraft('')
    if (t && !story.tags.includes(t)) void db.stories.update(story.id, { tags: [...story.tags, t] })
  }
  return (
    <>
      <Section title="This chapter">
        <label className="field">
          <span>What happens in this chapter?</span>
          <textarea key={scene.id} rows={4} defaultValue={scene.summary} onBlur={(e) => e.target.value !== scene.summary && db.scenes.update(scene.id, { summary: e.target.value })} placeholder="A sentence or two to keep you on track." />
        </label>
        <label className="field">
          <span>A sentence waiting</span>
          <textarea key={`w${scene.id}`} rows={3} defaultValue={scene.waiting ?? ''} onBlur={(e) => e.target.value !== (scene.waiting ?? '') && db.scenes.update(scene.id, { waiting: e.target.value })} placeholder="What happens next? Leave it here when you stop, so tomorrow starts with a sentence already waiting." />
          <small className="hint">Shown on the Library page beside your last paragraph.</small>
        </label>
      </Section>
      <Section title="This story">
        <label className="field">
          <span>Title</span>
          <input key={story.id} defaultValue={story.title} onBlur={(e) => db.stories.update(story.id, { title: e.target.value.trim() || 'Untitled story' })} />
        </label>
        <label className="field">
          <span>Synopsis</span>
          <textarea key={`s${story.id}`} rows={4} defaultValue={story.synopsis} onBlur={(e) => e.target.value !== story.synopsis && db.stories.update(story.id, { synopsis: e.target.value })} placeholder="What is this story about, in a few lines?" />
        </label>
        <label className="field">
          <span>Folder</span>
          <select value={story.folderId ?? ''} onChange={(e) => db.stories.update(story.id, { folderId: e.target.value || null })}>
            <option value="">Unfiled</option>
            {options.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
          </select>
        </label>
        <div className="field">
          <span>Tags</span>
          <div className="chips" aria-label="Tags">
            {story.tags.map((t) => (
              <span className="chip on" key={t}>
                #{t}
                <button aria-label={`Remove tag ${t}`} onClick={() => db.stories.update(story.id, { tags: story.tags.filter((x) => x !== t) })}>✕</button>
              </span>
            ))}
          </div>
          <input
            value={tagDraft}
            placeholder="Add a tag and press Enter"
            aria-label="Add tag"
            onChange={(e) => setTagDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ',') {
                e.preventDefault()
                addTag()
              }
            }}
            onBlur={addTag}
          />
        </div>
      </Section>
    </>
  )
}

export const PLAN_FIELDS: { key: keyof ChapterPlan; label: string; placeholder: string }[] = [
  { key: 'pov', label: 'POV', placeholder: 'Whose eyes?' },
  { key: 'setting', label: 'Setting', placeholder: 'The room that makes the goal hardest' },
  { key: 'goal', label: 'Goal', placeholder: 'What the POV character wants in this chapter, not in life' },
  { key: 'conflict', label: 'Conflict', placeholder: 'Who or what is stopping them?' },
  { key: 'turn', label: 'Turn', placeholder: 'How it ends somewhere different from where it began' },
  { key: 'prop', label: 'Prop', placeholder: 'An object someone can pick up or fight over' },
  { key: 'lastLine', label: 'Last line', placeholder: 'Know the last line before the first' },
]

/** Goal, conflict, turn, point of view, setting, prop and the last line. Reading across is the chapter check. */
export function PlanPanel({ scene, number }: { scene: Scene; number: number }) {
  const field = (f: (typeof PLAN_FIELDS)[number]) => (
    <label className="field" key={`${scene.id}-${f.key}`}>
      <span>{f.label}</span>
      <GrowingText
        defaultValue={scene.plan?.[f.key] ?? ''}
        placeholder={f.placeholder}
        onBlur={(e) => {
          if (e.target.value !== (scene.plan?.[f.key] ?? '')) void db.scenes.update(scene.id, { [`plan.${f.key}`]: e.target.value } as never)
        }}
      />
    </label>
  )
  const by = Object.fromEntries(PLAN_FIELDS.map((f) => [f.key, f])) as Record<keyof ChapterPlan, (typeof PLAN_FIELDS)[number]>
  const filled = PLAN_FIELDS.filter((f) => scene.plan?.[f.key]?.trim()).length
  return (
    <Section title="Chapter plan" count={`Chapter ${number} · ${filled} of ${PLAN_FIELDS.length}`}>
      <div className="two">{field(by.pov)}{field(by.setting)}</div>
      {field(by.goal)}
      {field(by.conflict)}
      {field(by.turn)}
      <div className="two">{field(by.prop)}{field(by.lastLine)}</div>
      <p className="hint">Every chapter has a goal, a conflict and a turn. A chapter that ends where it began is a scene, not a chapter yet.</p>
    </Section>
  )
}

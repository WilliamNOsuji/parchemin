import { useLiveQuery } from 'dexie-react-hooks'
import { useMemo, useState } from 'react'
import { db, takeSnapshot } from '../db'
import { PROMPT_KINDS, randomPrompt, type PromptKind } from '../prompts'
import type { Character, Scene, Story } from '../types'

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
    <div className="stack">
      <div className="chips" role="group" aria-label="Prompt type">
        {PROMPT_KINDS.map((k) => (
          <button key={k.id} className={`chip${kind === k.id ? ' on' : ''}`} aria-pressed={kind === k.id} onClick={() => pick(k.id)}>
            {k.label}
          </button>
        ))}
      </div>
      <blockquote className="prompt-card">{prompt}</blockquote>
      <button className="btn" onClick={() => pick(kind, prompt)}>Another one</button>
      {ask && kind === 'character' && (
        <p className="muted">Try it on <strong>{ask.name}</strong>.</p>
      )}
      <p className="muted small">Prompts are suggestions only. Nothing is written for you.</p>
    </div>
  )
}

export function SnapshotsPanel({ scene }: { scene: Scene }) {
  const snaps = useLiveQuery(() => db.snapshots.where('sceneId').equals(scene.id).reverse().sortBy('createdAt'), [scene.id], [])
  const [label, setLabel] = useState('')
  const [preview, setPreview] = useState<string | null>(null)

  return (
    <div className="stack">
      <form
        className="row"
        onSubmit={async (e) => {
          e.preventDefault()
          await takeSnapshot(scene.id, label)
          setLabel('')
        }}
      >
        <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Name this draft (optional)" aria-label="Snapshot name" />
        <button className="btn primary" type="submit">Save</button>
      </form>
      <p className="muted small">Save a snapshot before a big rewrite. You can always come back to it.</p>
      {snaps.length === 0 && <p className="muted">No snapshots yet.</p>}
      <ul className="snap-list">
        {snaps.map((s) => (
          <li key={s.id}>
            <div className="snap-head">
              <div>
                <strong>{s.label}</strong>
                <small className="muted"> · {s.words.toLocaleString()} words · {new Date(s.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</small>
              </div>
              <div className="row">
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
                <button className="icon-btn" aria-label="Delete snapshot" onClick={() => db.snapshots.delete(s.id)}>✕</button>
              </div>
            </div>
            {preview === s.id && <div className="snap-preview prose" dangerouslySetInnerHTML={{ __html: s.content || '<p><em>(empty)</em></p>' }} />}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function NotesPanel({ scene, story }: { scene: Scene; story: Story }) {
  return (
    <div className="stack">
      <label className="field">
        <span>What happens in this chapter?</span>
        <textarea key={scene.id} rows={5} defaultValue={scene.summary} onBlur={(e) => db.scenes.update(scene.id, { summary: e.target.value })} placeholder="A sentence or two to keep you on track." />
      </label>
      <label className="field">
        <span>Story synopsis</span>
        <textarea rows={5} defaultValue={story.synopsis} onBlur={(e) => db.stories.update(story.id, { synopsis: e.target.value })} placeholder="What is this story about, in a few lines?" />
      </label>
    </div>
  )
}

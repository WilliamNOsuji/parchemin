import { useLiveQuery } from 'dexie-react-hooks'
import { useState } from 'react'
import { addScene, db } from '../db'
import { navigate } from '../route'
import type { Scene, Story } from '../types'
import { NotesPanel, PromptsPanel, SnapshotsPanel } from './Panels'
import { SceneEditor, type PanelKind } from './SceneEditor'

interface Props {
  story: Story
  scenes: Scene[]
  focus: boolean
  onToggleFocus: () => void
  sceneId?: string
}

export function WriteTab({ story, scenes, focus, onToggleFocus, sceneId }: Props) {
  const [panel, setPanel] = useState<PanelKind>(null)
  const [listOpen, setListOpen] = useState(false)
  const characters = useLiveQuery(() => db.characters.where('storyId').equals(story.id).toArray(), [story.id], [])
  const current = scenes.find((s) => s.id === sceneId) ?? scenes[0]
  const go = (id: string) => {
    navigate({ name: 'story', storyId: story.id, tab: 'write', itemId: id })
    setListOpen(false)
  }

  if (!current) return <p className="muted pad">This story has no chapters yet.</p>

  return (
    <div className={`write${panel ? ' has-panel' : ''}`}>
      <aside className={`scene-list${listOpen ? ' open' : ''}`} aria-label="Chapters">
        <button className="scene-list-toggle btn" onClick={() => setListOpen((o) => !o)} aria-expanded={listOpen}>
          {current.title} ▾
        </button>
        <ul>
          {scenes.map((s) => (
            <li key={s.id}>
              <button className={`scene-item${s.id === current.id ? ' active' : ''}`} onClick={() => go(s.id)}>
                <span className={`dot ${s.status}`} title={s.status} />
                <span className="ellipsis">{s.title}</span>
                <small>{s.words.toLocaleString()}</small>
              </button>
            </li>
          ))}
        </ul>
        <button className="btn small" onClick={async () => go(await addScene(story.id))}>＋ Add chapter</button>
      </aside>

      <SceneEditor
        key={current.id}
        scene={current}
        focus={focus}
        panel={panel}
        onPanel={setPanel}
        onToggleFocus={onToggleFocus}
      />

      {panel && (
        <aside className="panel" aria-label={panel}>
          <header className="panel-head">
            <h3>{panel === 'prompts' ? 'Unblock yourself' : panel === 'snapshots' ? 'Snapshots' : 'Notes'}</h3>
            <button className="icon-btn" onClick={() => setPanel(null)} aria-label="Close panel">✕</button>
          </header>
          {panel === 'prompts' && <PromptsPanel characters={characters} />}
          {panel === 'snapshots' && <SnapshotsPanel scene={current} />}
          {panel === 'notes' && <NotesPanel scene={current} story={story} />}
        </aside>
      )}
    </div>
  )
}

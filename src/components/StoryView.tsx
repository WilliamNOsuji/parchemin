import { useLiveQuery } from 'dexie-react-hooks'
import { lazy, Suspense, useMemo, useState } from 'react'
import { db } from '../db'
import { exportEpub, exportMarkdown } from '../export'
import { navigate, type Tab } from '../route'
import type { Folder, Scene } from '../types'
import { Menu } from './Menu'
import { BackupNudge } from './Safekeeping'

// Each tab pulls in heavy dependencies (Tiptap, dnd-kit), so load them on demand.
const WriteTab = lazy(() => import('./WriteTab').then((m) => ({ default: m.WriteTab })))
const OutlineTab = lazy(() => import('./OutlineTab').then((m) => ({ default: m.OutlineTab })))
const CharactersTab = lazy(() => import('./CharactersTab').then((m) => ({ default: m.CharactersTab })))

function folderOptions(folders: Folder[]) {
  const out: { id: string; label: string }[] = []
  const walk = (parent: string | null, depth: number) => {
    folders
      .filter((f) => f.parentId === parent)
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach((f) => {
        out.push({ id: f.id, label: `${' '.repeat(depth)}${f.name}` })
        walk(f.id, depth + 1)
      })
  }
  walk(null, 0)
  return out
}

const TABS: { id: Tab; label: string }[] = [
  { id: 'write', label: 'Write' },
  { id: 'outline', label: 'Outline' },
  { id: 'characters', label: 'Characters' },
]

interface Props {
  storyId: string
  tab: Tab
  itemId?: string
  focus: boolean
  onToggleFocus: () => void
}

export function StoryView({ storyId, tab, itemId, focus, onToggleFocus }: Props) {
  const story = useLiveQuery(() => db.stories.get(storyId), [storyId])
  const scenes = useLiveQuery(() => db.scenes.where('storyId').equals(storyId).sortBy('order'), [storyId], [] as Scene[])
  const folders = useLiveQuery(() => db.folders.toArray(), [], [] as Folder[])
  const options = useMemo(() => folderOptions(folders), [folders])
  const [tagDraft, setTagDraft] = useState('')

  if (story === undefined) return null
  if (!story) {
    return (
      <div className="empty">
        <h2>Story not found</h2>
        <p className="muted">It may be in the drawer on the home screen.</p>
        <a className="btn" href="#/">Back home</a>
      </div>
    )
  }

  const addTag = () => {
    const t = tagDraft.trim().replace(/^#/, '').toLowerCase()
    setTagDraft('')
    if (t && !story.tags.includes(t)) void db.stories.update(story.id, { tags: [...story.tags, t] })
  }
  const totalWords = scenes.reduce((n, s) => n + s.words, 0)

  return (
    <div className="story">
      <header className="story-head">
        <div className="row between wrap">
          <input
            key={story.id}
            className="story-title"
            aria-label="Story title"
            defaultValue={story.title}
            onBlur={(e) => db.stories.update(story.id, { title: e.target.value.trim() || 'Untitled story' })}
          />
          <div className="row">
            <small className="muted">{totalWords.toLocaleString()} words</small>
            <Menu
              label="Export"
              items={[
                { label: 'Export as Markdown (.md)', onClick: () => void exportMarkdown(story.id) },
                { label: 'Export as EPUB (.epub)', onClick: () => void exportEpub(story.id) },
              ]}
            >
              ⤓ Export
            </Menu>
          </div>
        </div>
        <div className="meta-row">
          <label className="inline-field">
            <span>Folder</span>
            <select value={story.folderId ?? ''} onChange={(e) => db.stories.update(story.id, { folderId: e.target.value || null })}>
              <option value="">Unfiled</option>
              {options.map((o) => (
                <option key={o.id} value={o.id}>{o.label}</option>
              ))}
            </select>
          </label>
          <div className="tags" aria-label="Tags">
            {story.tags.map((t) => (
              <span className="chip on" key={t}>
                #{t}
                <button aria-label={`Remove tag ${t}`} onClick={() => db.stories.update(story.id, { tags: story.tags.filter((x) => x !== t) })}>✕</button>
              </span>
            ))}
            <input
              className="tag-input"
              value={tagDraft}
              placeholder="＋ tag"
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
        </div>
        <BackupNudge />
        <nav className="tabs" role="tablist">
          {TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              className={tab === t.id ? 'active' : ''}
              onClick={() => navigate({ name: 'story', storyId, tab: t.id })}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </header>

      <div className="story-body">
        <Suspense fallback={<p className="muted" role="status">Loading…</p>}>
        {tab === 'write' && <WriteTab story={story} scenes={scenes} focus={focus} onToggleFocus={onToggleFocus} sceneId={itemId} />}
        {tab === 'outline' && <OutlineTab story={story} scenes={scenes} />}
        {tab === 'characters' && <CharactersTab story={story} selectedId={itemId} />}
        </Suspense>
      </div>
    </div>
  )
}

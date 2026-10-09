import { useLiveQuery } from 'dexie-react-hooks'
import { useMemo, useState } from 'react'
import { db, deleteFolder, setAsideStory, uid } from '../db'
import { navigate } from '../route'
import type { Folder, Story } from '../types'
import { Menu } from './Menu'

interface Props {
  activeStoryId?: string
  onNewStory: (folderId: string | null) => void
  onNavigate?: () => void
}

export function Sidebar({ activeStoryId, onNewStory, onNavigate }: Props) {
  const folders = useLiveQuery(() => db.folders.toArray(), [], [] as Folder[])
  const stories = useLiveQuery(() => db.stories.orderBy('updatedAt').reverse().toArray(), [], [] as Story[])
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set())
  const [query, setQuery] = useState('')
  const [tag, setTag] = useState<string | null>(null)
  const [dropTarget, setDropTarget] = useState<string | null | undefined>(undefined)

  const allTags = useMemo(() => [...new Set(stories.flatMap((s) => s.tags))].sort(), [stories])
  const filtering = query.trim() !== '' || tag !== null
  const matches = useMemo(() => {
    const q = query.trim().toLowerCase()
    return stories.filter((s) => (!q || s.title.toLowerCase().includes(q)) && (!tag || s.tags.includes(tag)))
  }, [stories, query, tag])

  const open = (id: string) => {
    navigate({ name: 'story', storyId: id, tab: 'write' })
    onNavigate?.()
  }

  const addFolder = async (parentId: string | null) => {
    const name = window.prompt('Folder name')?.trim()
    if (!name) return
    await db.folders.add({ id: uid(), name, parentId, createdAt: Date.now() })
    if (parentId) setCollapsed((c) => new Set([...c].filter((x) => x !== parentId)))
  }

  const moveStoryTo = async (storyId: string, folderId: string | null) => {
    setDropTarget(undefined)
    await db.stories.update(storyId, { folderId })
  }

  const dropProps = (folderId: string | null) => ({
    onDragOver: (e: React.DragEvent) => {
      if (!e.dataTransfer.types.includes('application/x-parchemin-story')) return
      e.preventDefault()
      setDropTarget(folderId)
    },
    onDragLeave: () => setDropTarget((t) => (t === folderId ? undefined : t)),
    onDrop: (e: React.DragEvent) => {
      const id = e.dataTransfer.getData('application/x-parchemin-story')
      if (id) {
        e.preventDefault()
        void moveStoryTo(id, folderId)
      }
    },
  })

  const renderStory = (s: Story) => (
    <div key={s.id} className={`tree-row story-row${s.id === activeStoryId ? ' active' : ''}`}>
      <button
        className="tree-label"
        draggable
        onDragStart={(e) => e.dataTransfer.setData('application/x-parchemin-story', s.id)}
        onClick={() => open(s.id)}
        title={s.title}
      >
        <span aria-hidden>📄</span>
        <span className="ellipsis">{s.title || 'Untitled story'}</span>
      </button>
      <Menu
        label={`Actions for ${s.title}`}
        items={[
          {
            label: 'Move to the drawer',
            onClick: async () => {
              if (!window.confirm(`Move "${s.title}" to the drawer? Its chapters, characters and snapshots go with it, and you can put it back from the home screen.`)) return
              await setAsideStory(s.id)
              if (s.id === activeStoryId) navigate({ name: 'home' })
            },
          },
        ]}
      />
    </div>
  )

  const renderFolder = (f: Folder, depth: number): React.ReactNode => {
    const isCollapsed = collapsed.has(f.id)
    const childFolders = folders.filter((x) => x.parentId === f.id).sort((a, b) => a.name.localeCompare(b.name))
    const childStories = stories.filter((s) => s.folderId === f.id)
    return (
      <div key={f.id} className="tree-node">
        <div className={`tree-row folder${dropTarget === f.id ? ' drop' : ''}`} {...dropProps(f.id)} style={{ paddingLeft: depth * 12 }}>
          <button
            className="tree-label"
            aria-expanded={!isCollapsed}
            onClick={() =>
              setCollapsed((c) => {
                const n = new Set(c)
                if (n.has(f.id)) n.delete(f.id)
                else n.add(f.id)
                return n
              })
            }
          >
            <span aria-hidden>{isCollapsed ? '▸' : '▾'}</span>
            <span aria-hidden>📁</span>
            <span className="ellipsis">{f.name}</span>
            <small className="count">{childStories.length}</small>
          </button>
          <Menu
            label={`Actions for folder ${f.name}`}
            items={[
              { label: 'New story here', onClick: () => onNewStory(f.id) },
              { label: 'New subfolder', onClick: () => void addFolder(f.id) },
              {
                label: 'Rename',
                onClick: async () => {
                  const name = window.prompt('Rename folder', f.name)?.trim()
                  if (name) await db.folders.update(f.id, { name })
                },
              },
              {
                label: 'Delete folder',
                danger: true,
                onClick: async () => {
                  if (window.confirm(`Delete folder "${f.name}"? Its stories move up one level.`)) await deleteFolder(f.id)
                },
              },
            ]}
          />
        </div>
        {!isCollapsed && (
          <div className="tree-children" style={{ paddingLeft: (depth + 1) * 12 }}>
            {childFolders.map((c) => renderFolder(c, 0))}
            {childStories.map(renderStory)}
          </div>
        )}
      </div>
    )
  }

  const rootFolders = folders.filter((f) => f.parentId === null).sort((a, b) => a.name.localeCompare(b.name))
  const rootStories = stories.filter((s) => s.folderId === null)

  return (
    <nav className="sidebar" aria-label="Library">
      <div className="sidebar-head">
        <a className="brand" href="#/" onClick={onNavigate}>
          <span aria-hidden>🪶</span> Parchemin
        </a>
      </div>
      <div className="sidebar-actions">
        <button className="btn primary" onClick={() => onNewStory(null)}>＋ New story</button>
        <button className="btn" onClick={() => void addFolder(null)} title="New folder">📁＋</button>
      </div>
      <input className="search" type="search" placeholder="Search stories…" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search stories" />
      {allTags.length > 0 && (
        <div className="tag-filter" role="group" aria-label="Filter by tag">
          {allTags.map((t) => (
            <button key={t} className={`chip${tag === t ? ' on' : ''}`} aria-pressed={tag === t} onClick={() => setTag(tag === t ? null : t)}>
              #{t}
            </button>
          ))}
        </div>
      )}

      <div className="tree">
        {filtering ? (
          matches.length ? matches.map(renderStory) : <p className="muted pad">No stories match.</p>
        ) : (
          <>
            {rootFolders.map((f) => renderFolder(f, 0))}
            <div className={`tree-root${dropTarget === null ? ' drop' : ''}`} {...dropProps(null)}>
              {folders.length > 0 && rootStories.length > 0 && <div className="tree-heading">Unfiled</div>}
              {rootStories.map(renderStory)}
            </div>
            {stories.length === 0 && folders.length === 0 && <p className="muted pad">Your stories and folders will live here.</p>}
          </>
        )}
      </div>
    </nav>
  )
}

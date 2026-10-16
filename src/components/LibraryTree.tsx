import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { addScene, db, deleteFolder, setAsideStory, uid } from '../db'
import { navigate } from '../route'
import { chaptersOf, wordsOf, type SceneRef } from '../sceneIndex'
import type { Folder, Story } from '../types'
import { Icon } from './Icons'
import { Menu } from './Menu'

export type SideTab = 'library' | 'tags' | 'search'

interface Props {
  stories: Story[]
  folders: Folder[]
  index: SceneRef[]
  drawerCount: number
  activeStoryId?: string
  activeSceneId?: string
  sideTab: SideTab
  onSideTab: (t: SideTab) => void
  onNewStory: (folderId: string | null) => void
  /** Markdown files to import, dropped or chosen, with the story or folder they go to. */
  onImport: (start: { files?: File[]; storyId?: string; folderId?: string | null }) => void
  onNavigate?: () => void
  /** The ribbon's buttons, shown at the top on phones where there is no ribbon. */
  extra?: ReactNode
}

const num = (n: number) => n.toLocaleString()
const INDENT = 16

/**
 * The whole library as one tree: folders, stories, chapters, with status dots and word counts.
 * Drag a story onto a folder to move it. Chapters are reordered on the Outline page.
 */
export function LibraryTree({ stories, folders, index, drawerCount, activeStoryId, activeSceneId, sideTab, onSideTab, onNewStory, onImport, onNavigate, extra }: Props) {
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set())
  const [openStories, setOpenStories] = useState<Set<string>>(() => new Set(activeStoryId ? [activeStoryId] : []))
  const [query, setQuery] = useState('')
  const [tag, setTag] = useState<string | null>(null)
  const [dropTarget, setDropTarget] = useState<string | null | undefined>(undefined)
  const [fileStory, setFileStory] = useState<string | null>(null)
  const hasFiles = (e: React.DragEvent) => e.dataTransfer.types.includes('Files')

  // the story on screen opens in the tree when it becomes active; the chevron can close it again
  useEffect(() => {
    if (activeStoryId) setOpenStories((s) => (s.has(activeStoryId) ? s : new Set([...s, activeStoryId])))
  }, [activeStoryId])

  const allTags = useMemo(() => [...new Set(stories.flatMap((s) => s.tags))].sort(), [stories])

  const go = (storyId: string, sceneId?: string) => {
    navigate({ name: 'story', storyId, tab: 'write', itemId: sceneId })
    onNavigate?.()
  }

  const addFolder = async (parentId: string | null) => {
    const name = window.prompt('Folder name')?.trim()
    if (!name) return
    await db.folders.add({ id: uid(), name, parentId, createdAt: Date.now() })
    if (parentId) setCollapsed((c) => new Set([...c].filter((x) => x !== parentId)))
  }
  const toggle = (set: React.Dispatch<React.SetStateAction<Set<string>>>, id: string) =>
    set((c) => {
      const n = new Set(c)
      if (n.has(id)) n.delete(id)
      else n.add(id)
      return n
    })

  // a story dragged onto a folder moves there; Markdown files dropped on a folder become a new story in it
  const dropProps = (folderId: string | null) => ({
    onDragOver: (e: React.DragEvent) => {
      if (!e.dataTransfer.types.includes('application/x-parchemin-story') && !hasFiles(e)) return
      e.preventDefault()
      setDropTarget(folderId)
    },
    onDragLeave: () => setDropTarget((t) => (t === folderId ? undefined : t)),
    onDrop: (e: React.DragEvent) => {
      const id = e.dataTransfer.getData('application/x-parchemin-story')
      setDropTarget(undefined)
      if (id) {
        e.preventDefault()
        void db.stories.update(id, { folderId })
      } else if (hasFiles(e)) {
        e.preventDefault()
        onImport({ files: [...e.dataTransfer.files], folderId })
      }
    },
  })
  // Markdown files dropped on a story are added to it, after its last chapter
  const storyDrop = (storyId: string) => ({
    onDragOver: (e: React.DragEvent) => {
      if (!hasFiles(e)) return
      e.preventDefault()
      e.stopPropagation()
      setFileStory(storyId)
    },
    onDragLeave: () => setFileStory((t) => (t === storyId ? null : t)),
    onDrop: (e: React.DragEvent) => {
      if (!hasFiles(e)) return
      e.preventDefault()
      e.stopPropagation()
      setFileStory(null)
      setDropTarget(undefined)
      onImport({ files: [...e.dataTransfer.files], storyId })
    },
  })

  const renderStory = (s: Story, depth: number) => {
    const chapters = chaptersOf(index, s.id)
    const open = openStories.has(s.id)
    const active = s.id === activeStoryId
    return (
      <div key={s.id}>
        <div className={`node-row${fileStory === s.id ? ' drop' : ''}`} style={{ paddingLeft: depth * INDENT }} {...storyDrop(s.id)}>
          <button className="icon-btn" style={{ padding: '4px 2px' }} aria-label={open ? `Collapse ${s.title}` : `Expand ${s.title}`} aria-expanded={open} onClick={() => toggle(setOpenStories, s.id)}>
            <span className="chev" aria-hidden>{open ? '▾' : '▸'}</span>
          </button>
          <button
            className={`node story${active && !activeSceneId ? ' active' : ''}`}
            draggable
            onDragStart={(e) => e.dataTransfer.setData('application/x-parchemin-story', s.id)}
            onClick={() => go(s.id)}
            title={s.title}
          >
            <span className="t">{s.title || 'Untitled story'}</span>
            <span className="count">{num(wordsOf(index, s.id))}</span>
          </button>
          <Menu
            label={`Actions for ${s.title}`}
            items={[
              {
                label: 'Rename',
                onClick: async () => {
                  const title = window.prompt('Story title', s.title)?.trim()
                  if (title) await db.stories.update(s.id, { title })
                },
              },
              { label: 'Open the outline', onClick: () => navigate({ name: 'story', storyId: s.id, tab: 'outline' }) },
              { label: 'Open the cast', onClick: () => navigate({ name: 'story', storyId: s.id, tab: 'cast' }) },
              { label: 'Open the boards', onClick: () => navigate({ name: 'story', storyId: s.id, tab: 'canvas' }) },
              { label: 'Open the Web', onClick: () => navigate({ name: 'story', storyId: s.id, tab: 'web' }) },
              { label: 'Import Markdown files…', onClick: () => onImport({ storyId: s.id }) },
              {
                label: 'Move to the drawer',
                onClick: async () => {
                  if (!window.confirm(`Move "${s.title}" to the drawer? Its chapters, characters, snapshots, boards and core ideas go with it, and you can put it back from the drawer.`)) return
                  await setAsideStory(s.id)
                  if (s.id === activeStoryId) navigate({ name: 'home' })
                },
              },
            ]}
          />
        </div>
        {open && (
          <div>
            {chapters.map((c, i) => (
              <button key={c.id} className={`node${c.id === activeSceneId ? ' active' : ''}`} style={{ paddingLeft: (depth + 1) * INDENT + 14 }} onClick={() => go(s.id, c.id)} title={c.title}>
                <span className={`dot ${c.status}`} title={c.status} />
                <span className="n">{i + 1}</span>
                <span className="t">{c.title || 'Untitled'}</span>
                <span className="words">{num(c.words)}</span>
              </button>
            ))}
            <button className="node add" style={{ paddingLeft: (depth + 1) * INDENT + 14 }} onClick={async () => go(s.id, await addScene(s.id))}>
              <span className="n">+</span>
              <span className="t">Add a chapter</span>
            </button>
          </div>
        )}
      </div>
    )
  }

  const renderFolder = (f: Folder, depth: number): ReactNode => {
    const isCollapsed = collapsed.has(f.id)
    const childFolders = folders.filter((x) => x.parentId === f.id).sort((a, b) => a.name.localeCompare(b.name))
    const childStories = stories.filter((s) => s.folderId === f.id)
    return (
      <div key={f.id}>
        <div className={`node-row${dropTarget === f.id ? ' drop' : ''}`} {...dropProps(f.id)} style={{ paddingLeft: depth * INDENT }}>
          <button className="node folder" aria-expanded={!isCollapsed} onClick={() => toggle(setCollapsed, f.id)}>
            <span className="chev" aria-hidden>{isCollapsed ? '▸' : '▾'}</span>
            <span className="t">{f.name}</span>
            <span className="count">{childStories.length}</span>
          </button>
          <Menu
            label={`Actions for folder ${f.name}`}
            items={[
              { label: 'New story here', onClick: () => onNewStory(f.id) },
              { label: 'Import Markdown files here…', onClick: () => onImport({ folderId: f.id }) },
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
          <div>
            {childFolders.map((c) => renderFolder(c, depth + 1))}
            {childStories.map((s) => renderStory(s, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  const rootFolders = folders.filter((f) => f.parentId === null).sort((a, b) => a.name.localeCompare(b.name))
  const rootStories = stories.filter((s) => s.folderId === null)
  const q = query.trim().toLocaleLowerCase()
  const storyById = new Map(stories.map((s) => [s.id, s]))
  const hits = q
    ? {
        stories: stories.filter((s) => s.title.toLocaleLowerCase().includes(q)),
        chapters: index.filter((c) => c.title.toLocaleLowerCase().includes(q) && storyById.has(c.storyId)),
      }
    : null

  return (
    <nav className="left" aria-label="Library">
      {extra}
      <div className="side-head" role="tablist">
        {(['library', 'tags', 'search'] as SideTab[]).map((t) => (
          <button key={t} role="tab" className={`side-tab${sideTab === t ? ' on' : ''}`} aria-selected={sideTab === t} onClick={() => onSideTab(t)}>
            {t === 'library' ? 'Library' : t === 'tags' ? 'Tags' : 'Search'}
          </button>
        ))}
      </div>

      <div className="tree">
        {sideTab === 'library' && (
          <>
            {rootFolders.map((f) => renderFolder(f, 0))}
            <div className={`tree-root${dropTarget === null ? ' drop' : ''}`} {...dropProps(null)}>
              {folders.length > 0 && rootStories.length > 0 && <div className="tree-heading">Unfiled</div>}
              {rootStories.map((s) => renderStory(s, 0))}
            </div>
            {stories.length === 0 && folders.length === 0 && <p className="hint pad">Your stories and folders will live here. A blank page is an invitation, not a debt.</p>}
          </>
        )}
        {sideTab === 'tags' && (
          <>
            {allTags.length === 0 ? (
              <p className="hint pad">No tags yet. Add one to a story under Notes, in the right sidebar.</p>
            ) : (
              <div className="tag-filter" role="group" aria-label="Filter by tag">
                {allTags.map((t) => (
                  <button key={t} className={`chip${tag === t ? ' on' : ''}`} aria-pressed={tag === t} onClick={() => setTag(tag === t ? null : t)}>
                    #{t}
                  </button>
                ))}
              </div>
            )}
            {tag && stories.filter((s) => s.tags.includes(tag)).map((s) => renderStory(s, 0))}
          </>
        )}
        {sideTab === 'search' && (
          <>
            <input className="search" type="search" placeholder="Stories and chapters…" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search stories and chapters" autoFocus />
            {hits && hits.stories.length === 0 && hits.chapters.length === 0 && <p className="hint pad">Nothing by that name.</p>}
            {hits?.stories.map((s) => renderStory(s, 0))}
            {hits && hits.chapters.length > 0 && <div className="tree-heading">Chapters</div>}
            {hits?.chapters.map((c) => (
              <button key={c.id} className={`node${c.id === activeSceneId ? ' active' : ''}`} onClick={() => go(c.storyId, c.id)} title={`${storyById.get(c.storyId)?.title} › ${c.title}`}>
                <span className={`dot ${c.status}`} />
                <span className="t">{c.title || 'Untitled'}<span className="muted"> · {storyById.get(c.storyId)?.title}</span></span>
                <span className="words">{num(c.words)}</span>
              </button>
            ))}
          </>
        )}
      </div>

      <div className="side-foot">
        <button className="btn primary small" onClick={() => onNewStory(null)}><Icon name="plus" size={12} /> New story</button>
        <button className="btn small quiet" onClick={() => void addFolder(null)}>New folder</button>
        <a className="drawer-link" href="#/drawer" onClick={onNavigate} title={drawerCount ? `The drawer · ${drawerCount} set aside` : 'The drawer'}>{drawerCount ? `Drawer · ${drawerCount}` : 'Drawer'}</a>
      </div>
    </nav>
  )
}

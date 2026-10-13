import { lazy, Suspense, useEffect } from 'react'
import { addScene } from '../db'
import { navigate, replaceRoute, type Tab } from '../route'
import type { Scene, Story } from '../types'
import { SceneEditor } from './SceneEditor'

// the outline and the cast pull in dnd-kit and a second editor, so they load on demand
const OutlinePane = lazy(() => import('./OutlinePane').then((m) => ({ default: m.OutlinePane })))
const CastPane = lazy(() => import('./CastPane').then((m) => ({ default: m.CastPane })))

interface Props {
  storyId: string
  /** From useOpenStory: undefined while loading, null when the story is not here (App then lands on the library). */
  story: Story | null | undefined
  scenes: Scene[] | undefined
  tab: Tab
  itemId?: string
  focus: boolean
  onToggleFocus: () => void
  onOpenRight: (tab: string) => void
}

/** The pane for one story: the chapter being written, its outline, or its cast. */
export function StoryView({ storyId, story, scenes, tab, itemId, focus, onToggleFocus, onOpenRight }: Props) {
  // a chapter's address names the chapter, so the tab strip and the tree can find it; an address whose chapter
  // went to the drawer falls back to the first chapter
  useEffect(() => {
    if (tab === 'write' && scenes?.length && (!itemId || !scenes.some((s) => s.id === itemId))) replaceRoute({ name: 'story', storyId, tab: 'write', itemId: scenes[0].id })
  }, [tab, itemId, scenes, storyId])

  if (!story || scenes === undefined) return null

  if (tab === 'write') {
    const current = scenes.find((s) => s.id === itemId) ?? scenes[0]
    if (!current) {
      return (
        <div className="pane-empty">
          <h2>No chapters yet</h2>
          <p>A story always has at least one. Add the first and start writing.</p>
          <p style={{ marginTop: 12 }}>
            <button className="btn primary" onClick={async () => navigate({ name: 'story', storyId, tab: 'write', itemId: await addScene(storyId) })}>Add a chapter</button>
          </p>
        </div>
      )
    }
    return <SceneEditor key={current.id} scene={current} story={story} number={scenes.indexOf(current) + 1} focus={focus} onToggleFocus={onToggleFocus} />
  }
  return (
    <Suspense fallback={<p className="hint pad" role="status">Loading…</p>}>
      {tab === 'outline' && <OutlinePane story={story} scenes={scenes} selectedId={itemId} onOpenRight={onOpenRight} />}
      {tab === 'cast' && <CastPane story={story} selectedId={itemId} />}
    </Suspense>
  )
}

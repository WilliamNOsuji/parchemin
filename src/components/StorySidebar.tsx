import { useLiveQuery } from 'dexie-react-hooks'
import { lazy, Suspense } from 'react'
import { db } from '../db'
import type { Tab } from '../route'
import type { Character, Scene, Story } from '../types'
import { AuditPanel } from './AuditPanel'
import { CharacterSidebar } from './CharacterSidebar'
import { DialoguePanel } from './DialoguePanel'
import { NotesPanel, PlanPanel, PromptsPanel, SnapshotsPanel } from './Panels'

// the boards and the Web bring their own code, so their sidebars load with their panes
const CanvasSidebar = lazy(() => import('./CanvasSidebar').then((m) => ({ default: m.CanvasSidebar })))
const WebSidebar = lazy(() => import('./WebSidebar').then((m) => ({ default: m.WebSidebar })))

interface Props {
  storyId: string
  /** From useOpenStory, the same rows the pane shows. */
  story: Story | null | undefined
  scenes: Scene[] | undefined
  tab: Tab
  itemId?: string
  rightTab: string
}

/** The right sidebar for a story: the panels beside the chapter, the outline's audit and plan, the selected character. */
export function StorySidebar({ storyId, story, scenes, tab, itemId, rightTab }: Props) {
  const characters = useLiveQuery(() => db.characters.where('storyId').equals(storyId).sortBy('createdAt'), [storyId], [] as Character[])
  if (!story || !scenes) return null

  if (tab === 'write') {
    const current = scenes.find((s) => s.id === itemId) ?? scenes[0]
    if (!current) return <p className="hint">Add a chapter to start.</p>
    const n = scenes.indexOf(current) + 1
    if (rightTab === 'dialogue') return <DialoguePanel key={current.id} scene={current} characters={characters} />
    if (rightTab === 'snapshots') return <SnapshotsPanel scene={current} />
    if (rightTab === 'notes') return <NotesPanel key={current.id} scene={current} story={story} />
    if (rightTab === 'unblock') return <PromptsPanel characters={characters} />
    return <PlanPanel key={current.id} scene={current} number={n} />
  }
  if (tab === 'canvas' || tab === 'web') {
    return (
      <Suspense fallback={<p className="hint" role="status">Loading…</p>}>
        {tab === 'canvas' ? <CanvasSidebar story={story} scenes={scenes} boardId={itemId} rightTab={rightTab} /> : <WebSidebar story={story} scenes={scenes} itemId={itemId} rightTab={rightTab} />}
      </Suspense>
    )
  }
  if (tab === 'outline') {
    if (rightTab === 'plan') {
      const sel = scenes.find((s) => s.id === itemId)
      return sel ? <PlanPanel key={sel.id} scene={sel} number={scenes.indexOf(sel) + 1} /> : <p className="hint pad">Pick a chapter in the outline to see its plan here.</p>
    }
    return <AuditPanel story={story} scenes={scenes} />
  }
  const sel = characters.find((c) => c.id === itemId)
  return sel ? <CharacterSidebar key={sel.id} character={sel} tab={rightTab} /> : <p className="hint pad">Pick someone in the cast to see their profile, voice and hero check here.</p>
}

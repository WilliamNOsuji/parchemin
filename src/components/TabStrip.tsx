import { useLiveQuery } from 'dexie-react-hooks'
import { useEffect } from 'react'
import { db } from '../db'
import type { Route } from '../route'
import { navigate } from '../route'
import { numberOf, type SceneRef } from '../sceneIndex'
import type { OpenTab } from '../tabs'
import type { Board, Story } from '../types'
import { Icon, type IconName } from './Icons'

interface Props {
  tabs: OpenTab[]
  active: string
  stories: Story[]
  index: SceneRef[]
  loaded: boolean
  onClose: (key: string) => void
  onPrune: (isGone: (t: OpenTab) => boolean) => void
  onAdd: () => void
}

const ICONS: Record<string, IconName> = { home: 'lib', outline: 'outline', cast: 'cast', canvas: 'canvas', web: 'web', safekeeping: 'safe', drawer: 'drawer' }
const KIND_LABEL: Record<string, string> = { outline: 'Outline', cast: 'Cast', web: 'Web' }

/** Tabs in the title bar, as Obsidian keeps them on Windows. A chapter tab shows its status as a dot. */
export function TabStrip({ tabs, active, stories, index, loaded, onClose, onPrune, onAdd }: Props) {
  const storyById = new Map(stories.map((s) => [s.id, s]))
  const sceneById = new Map(index.map((s) => [s.id, s]))
  // boards are small (their pictures live apart), so reading them all to name the tabs is cheap; undefined until read
  const boards = useLiveQuery(() => db.boards.toArray(), [], undefined as Board[] | undefined)
  const boardById = new Map((boards ?? []).map((b) => [b.id, b]))

  // a tab whose chapter, board or story went to the drawer (or was deleted for good) closes itself
  useEffect(() => {
    if (!loaded) return
    onPrune((t) => {
      const r = t.route
      if (r.name !== 'story') return false
      if (!storyById.has(r.storyId)) return true
      if (r.tab === 'write') return !!r.itemId && !sceneById.has(r.itemId)
      if (r.tab === 'canvas') return !!r.itemId && boards !== undefined && !boardById.has(r.itemId)
      return false
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, stories, index, boards])

  // when two stories have the same kind of tab open, the story's name tells them apart
  const kinds = new Map<string, number>()
  for (const t of tabs) if (t.route.name === 'story' && t.route.tab !== 'write' && t.route.tab !== 'canvas') kinds.set(t.route.tab, (kinds.get(t.route.tab) ?? 0) + 1)

  const describe = (r: Route): { label: string; icon?: IconName; status?: string; title: string } => {
    if (r.name === 'home') return { label: 'Library', icon: 'lib', title: 'Library' }
    if (r.name === 'safekeeping') return { label: 'Safekeeping', icon: 'safe', title: 'Safekeeping' }
    if (r.name === 'drawer') return { label: 'The drawer', icon: 'drawer', title: 'The drawer' }
    const story = storyById.get(r.storyId)?.title || 'Untitled story'
    if (r.tab === 'write') {
      const scene = r.itemId ? sceneById.get(r.itemId) : undefined
      if (!scene) return { label: story, title: story }
      const n = numberOf(index, scene)
      return { label: `${n} · ${scene.title || 'Untitled'}`, status: scene.status, title: `${story} › Chapter ${n}` }
    }
    if (r.tab === 'canvas') {
      const board = r.itemId ? boardById.get(r.itemId) : undefined
      const name = board?.name || 'Boards'
      return { label: name, icon: 'canvas', title: board ? `${story} › Boards › ${name}` : `${story} › Boards` }
    }
    const kind = KIND_LABEL[r.tab] ?? 'Cast'
    return { label: (kinds.get(r.tab) ?? 0) > 1 ? `${kind} · ${story}` : kind, icon: ICONS[r.tab], title: `${story} › ${kind}` }
  }

  return (
    <div className="tabs" role="tablist" aria-label="Open tabs">
      {tabs.map((t) => {
        const d = describe(t.route)
        const on = t.key === active
        return (
          <div key={t.key} className={`tab${on ? ' active' : ''}${t.key === 'home' ? ' pinned' : ''}`} role="tab" aria-selected={on} title={d.title}>
            <button className="row" style={{ gap: 7, minWidth: 0 }} onClick={() => navigate(t.route)} tabIndex={on ? 0 : -1}>
              {d.status ? <span className={`dot ${d.status}`} /> : d.icon ? <Icon name={d.icon} size={14} /> : null}
              <span className="t">{d.label}</span>
            </button>
            {t.key !== 'home' && (
              <button className="x" aria-label={`Close ${d.label}`} onClick={() => onClose(t.key)}>
                <Icon name="close" size={11} />
              </button>
            )}
          </div>
        )
      })}
      <button className="tab-add" title="New story" aria-label="New story" onClick={onAdd}>
        <Icon name="plus" size={14} />
      </button>
    </div>
  )
}

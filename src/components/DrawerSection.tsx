import { useLiveQuery } from 'dexie-react-hooks'
import { useState } from 'react'
import { db, deleteForGood, putBack } from '../db'
import type { DrawerItem } from '../types'
import { Section } from './RightSidebar'

const plural = (n: number, one: string, many: string) => `${n.toLocaleString()} ${n === 1 ? one : many}`
const title = (it: DrawerItem) => it.title.trim() || 'Untitled'

const KIND_NAME: Record<DrawerItem['kind'], string> = { story: 'Story', chapter: 'Chapter', character: 'Character', board: 'Board', idea: 'Core idea', setting: 'Setting' }

/** What else a story item carries besides its words and snapshots. Items set aside before the boards existed carry none. */
function alsoHolds(it: DrawerItem): string[] {
  return [
    (it.boards?.length ?? 0) > 0 && plural(it.boards!.length, 'board', 'boards'),
    (it.coreIdeas?.length ?? 0) > 0 && plural(it.coreIdeas!.length, 'core idea', 'core ideas'),
    (it.settings?.length ?? 0) > 0 && plural(it.settings!.length, 'setting', 'settings'),
  ].filter((x): x is string => typeof x === 'string')
}

function describe(it: DrawerItem): string {
  const from = it.storyTitle ? ` from “${it.storyTitle}”` : ''
  const parts = [it.kind === 'story' ? 'Story' : `${KIND_NAME[it.kind]}${from}`]
  if (it.words > 0) parts.push(plural(it.words, 'word', 'words'))
  if (it.snapshots.length > 0) parts.push(plural(it.snapshots.length, 'snapshot', 'snapshots'))
  if (it.kind === 'story') parts.push(...alsoHolds(it))
  parts.push(`set aside ${new Date(it.setAsideAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}`)
  return parts.join(' · ')
}

const backMessage = (it: DrawerItem) => (it.kind === 'story' ? `“${title(it)}” is back in your library.` : `“${title(it)}” is back in “${it.storyTitle || 'Untitled story'}”.`)

/** Work the writer set aside. Nothing here is gone until they choose "Delete for good". */
export function DrawerPage() {
  const items = useLiveQuery(() => db.drawer.orderBy('setAsideAt').reverse().toArray(), [], [] as DrawerItem[])
  const [msg, setMsg] = useState('')
  return (
    <>
      <div className="pane-head"><div className="crumbs"><b>The drawer</b></div></div>
      <div className="pane-scroll">
        <div className="drawer-page">
          <h1>The drawer</h1>
          <p className="lead">Stories, chapters, characters, boards, core ideas and settings you set aside wait here, with their snapshots. Nothing in the drawer is deleted. Put it back, or delete it for good yourself.</p>
          <p role="status" className="hint" style={{ marginBottom: msg ? 12 : 0 }}>{msg}</p>
          {items.length === 0 && !msg && <p className="muted">The drawer is empty. Anything you move here from a story's menu, the outline or the cast will wait here.</p>}
          {items.length > 0 && (
            <ul className="drawer-list">
              {items.map((it) => (
                <li key={it.id}>
                  <div className="drawer-what">
                    <strong>{title(it)}</strong>
                    <small className="muted">{describe(it)}</small>
                  </div>
                  <div className="acts">
                    <button
                      className="btn small"
                      onClick={async () => {
                        await putBack(it.id)
                        setMsg(backMessage(it))
                      }}
                    >
                      Put back
                    </button>
                    <button
                      className="btn small danger"
                      onClick={async () => {
                        const lost = [it.words > 0 && plural(it.words, 'word', 'words'), it.snapshots.length > 0 && plural(it.snapshots.length, 'snapshot', 'snapshots'), ...alsoHolds(it)].filter(Boolean)
                        const what = lost.length ? ` Its ${lost.join(' and ')} will be gone.` : ''
                        if (!window.confirm(`Delete “${title(it)}” for good?${what} This can't be undone.`)) return
                        await deleteForGood(it.id)
                        setMsg(`“${title(it)}” was deleted.`)
                      }}
                    >
                      Delete for good
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  )
}

/** The drawer at a glance, in the Library's sidebar. */
export function DrawerGlance() {
  const items = useLiveQuery(() => db.drawer.orderBy('setAsideAt').reverse().limit(6).toArray(), [], [] as DrawerItem[])
  const count = useLiveQuery(() => db.drawer.count(), [], 0)
  const [msg, setMsg] = useState('')
  return (
    <Section title="The drawer" count={count ? `${count} set aside` : undefined}>
      {items.length === 0 && <p className="hint">Nothing set aside. Anything you move to the drawer waits here with its snapshots.</p>}
      {items.map((it) => (
        <div className="snap" key={it.id}>
          <b title={describe(it)}>{title(it)}</b>
          <span>{it.words > 0 ? `${it.words.toLocaleString()} words` : it.kind}</span>
          <button
            className="btn small quiet"
            onClick={async () => {
              await putBack(it.id)
              setMsg(backMessage(it))
            }}
          >
            Put back
          </button>
        </div>
      ))}
      <p role="status" className="hint">{msg}</p>
      <p className="hint">Nothing in the drawer is deleted. Put it back, or delete it for good yourself.</p>
      <div className="acts"><a className="btn small quiet" href="#/drawer">Open the drawer</a></div>
    </Section>
  )
}

import { useLiveQuery } from 'dexie-react-hooks'
import { useState } from 'react'
import { db, deleteForGood, putBack } from '../db'
import type { DrawerItem } from '../types'

const plural = (n: number, one: string, many: string) => `${n.toLocaleString()} ${n === 1 ? one : many}`

function describe(it: DrawerItem): string {
  const from = it.storyTitle ? ` from “${it.storyTitle}”` : ''
  const parts = [it.kind === 'story' ? 'Story' : it.kind === 'chapter' ? `Chapter${from}` : `Character${from}`]
  if (it.words > 0) parts.push(plural(it.words, 'word', 'words'))
  if (it.snapshots.length > 0) parts.push(plural(it.snapshots.length, 'snapshot', 'snapshots'))
  parts.push(`set aside ${new Date(it.setAsideAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}`)
  return parts.join(' · ')
}

/** Work the writer set aside. Nothing here is gone until they choose "Delete for good". */
export function DrawerSection() {
  const items = useLiveQuery(() => db.drawer.orderBy('setAsideAt').reverse().toArray(), [], [] as DrawerItem[])
  const [msg, setMsg] = useState('')
  if (items.length === 0 && !msg) return null

  const title = (it: DrawerItem) => it.title.trim() || 'Untitled'

  return (
    <section aria-labelledby="drawer-heading">
      <h2 id="drawer-heading">The drawer</h2>
      <p className="muted">Stories, chapters and characters you set aside wait here, with their snapshots. Nothing in the drawer is lost until you delete it for good.</p>
      {items.length > 0 && (
        <ul className="drawer-list">
          {items.map((it) => (
            <li key={it.id}>
              <div className="drawer-what">
                <strong>{title(it)}</strong>
                <small className="muted">{describe(it)}</small>
              </div>
              <div className="row">
                <button
                  className="btn small"
                  onClick={async () => {
                    await putBack(it.id)
                    setMsg(it.kind === 'story' ? `“${title(it)}” is back in your library.` : `“${title(it)}” is back in “${it.storyTitle || 'Untitled story'}”.`)
                  }}
                >
                  Put back
                </button>
                <button
                  className="btn small danger"
                  onClick={async () => {
                    const lost = [it.words > 0 && plural(it.words, 'word', 'words'), it.snapshots.length > 0 && plural(it.snapshots.length, 'snapshot', 'snapshots')].filter(Boolean)
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
      <p role="status" className="muted">{msg}</p>
    </section>
  )
}

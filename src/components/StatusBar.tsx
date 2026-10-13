import { useLiveQuery } from 'dexie-react-hooks'
import { dayKey } from '../craft/why'
import { db } from '../db'
import { useEditorState } from '../editorState'
import { navigate, type Route } from '../route'
import { useSafekeeping } from '../safekeeping'
import { numberOf, type SceneRef } from '../sceneIndex'

const num = (n: number) => n.toLocaleString()

/** "2 days ago", "yesterday", "today", or the date when it is older than a week. */
export function ago(t: number, now = Date.now()): string {
  const days = Math.floor((now - t) / 86_400_000)
  if (days <= 0) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 7) return `${days} days ago`
  return new Date(t).toLocaleDateString([], { month: 'short', day: 'numeric' })
}

/**
 * Says plainly where the words are and when they were last copied. Words today and the chapter's count sit
 * on the right, with the two shortcuts a writer needs most.
 */
export function StatusBar({ route, index, notice }: { route: Route; index: SceneRef[]; notice?: string }) {
  const k = useSafekeeping()
  const today = useLiveQuery(() => db.days.get(dayKey()), [])
  const ed = useEditorState()
  const scene = route.name === 'story' && route.tab === 'write' && route.itemId ? index.find((s) => s.id === route.itemId) : undefined
  const words = scene ? (ed.sceneId === scene.id ? ed.words : scene.words) : null

  const kept = k?.persisted === true
  const backup =
    !k ? '' : k.lastBackupAt === null ? 'No backup file yet' : `Backup file: ${ago(k.lastBackupAt)}${k.changed.words > 0 ? ` · ${num(k.changed.words)} words since` : ''}`

  return (
    <footer className="statusbar" aria-label="Status">
      <div>
        {notice ? <span role="status">{notice}</span> : null}
        <button className={`st ${kept ? 'ok' : 'warn'}`} onClick={() => navigate({ name: 'safekeeping' })} title="Open Safekeeping">
          {kept ? 'Kept in this browser' : 'In this browser, not yet promised'}
        </button>
        {backup && <button className="st backup" onClick={() => navigate({ name: 'safekeeping' })} title="Open Safekeeping">{backup}</button>}
      </div>
      <div>
        <span>{num(today?.words ?? 0)} words today</span>
        {scene && words !== null && (
          <span className={`st chapter${ed.sceneId === scene.id && ed.saving === 'failed' ? ' failed' : ''}`}>
            Chapter {numberOf(index, scene)}: {num(words)} {words === 1 ? 'word' : 'words'}
            {ed.sceneId === scene.id && ed.saving !== 'saved' ? (ed.saving === 'saving' ? ' · saving…' : ' · not saved yet') : ''}
          </span>
        )}
        <span className="kb"><kbd>Ctrl+Shift+F</kbd> focus</span>
        <span className="kb"><kbd>Ctrl+P</kbd> commands</span>
      </div>
    </footer>
  )
}

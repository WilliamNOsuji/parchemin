import { useLiveQuery } from 'dexie-react-hooks'
import { useEffect, useState } from 'react'
import { dayKey } from '../craft/why'
import { db } from '../db'
import { useEditorState } from '../editorState'
import { navigate, type Route } from '../route'
import { requestPersistOnce, useSafekeeping } from '../safekeeping'
import { numberOf, type SceneRef } from '../sceneIndex'

const num = (n: number) => n.toLocaleString()

/** Today's key, checked every minute so the figure rolls over at midnight without a write. */
function useDayKey(): string {
  const [key, setKey] = useState(() => dayKey())
  useEffect(() => {
    const id = window.setInterval(() => setKey((k) => (dayKey() === k ? k : dayKey())), 60_000)
    return () => window.clearInterval(id)
  }, [])
  return key
}

const midnight = (ms: number) => {
  const d = new Date(ms)
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
}

/** "2 days ago", "yesterday", "today", or the date when it is older than a week. Calendar days, not 24-hour spans. */
export function ago(t: number, now = Date.now()): string {
  const days = Math.round((midnight(now) - midnight(t)) / 86_400_000)
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
  const day = useDayKey()
  const today = useLiveQuery(() => db.days.get(day), [day])
  const ed = useEditorState()
  const writing = route.name === 'story' && route.tab === 'write'
  const scene = writing && route.itemId ? index.find((s) => s.id === route.itemId) : undefined
  const words = scene ? (ed.sceneId === scene.id ? ed.words : scene.words) : null

  // Ask the browser to keep the data once there is writing to keep, from here so it happens whichever page the writer
  // uses, and never mid-sentence: not while a chapter is open, since Firefox shows a prompt for it. Once; the Safekeeping
  // page has a button to ask again.
  const hasWork = !!k && (k.lastBackupAt !== null || index.some((s) => s.words > 0))
  const persisted = k?.persisted
  useEffect(() => {
    if (hasWork && !writing && persisted === false) void requestPersistOnce().then((asked) => asked && k?.refresh())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasWork, writing, persisted])

  const kept = persisted === true
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

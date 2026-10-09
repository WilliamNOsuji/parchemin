import { useLiveQuery } from 'dexie-react-hooks'
import { useEffect, useState } from 'react'
import { db } from './db'
import type { Meta } from './types'

/**
 * Safekeeping: the facts a writer needs to know their work is safe, and nothing more.
 *
 * Stories live in the browser's storage, which is "best effort" until the browser agrees to keep it.
 * A backup file the writer holds is the only copy that survives a cleared browser or a lost device.
 * So Parchemin records when the last backup file was made, asks the browser to keep the data once
 * there is real work in it, and suggests a backup by how much is new, never by the calendar.
 */

/** New words since the last backup file before Parchemin suggests making one. */
export const NUDGE_AFTER_WORDS = 2000
/** How long "Not now" keeps the suggestion quiet. */
const QUIET_DAYS = 5

type Key = 'lastBackupAt' | 'wordsLoggedAtBackup' | 'nudgeDismissedAt' | 'persistAskedAt'

const read = (rows: Meta[] | undefined, key: Key) => rows?.find((r) => r.key === key)?.value ?? null
const sum = (rows: { words: number }[]) => rows.reduce((n, r) => n + r.words, 0)

async function set(key: Key, value: number) {
  await db.meta.put({ key, value })
}

/** Records that a backup file was made just now, and how many words had been logged by then. */
export async function markBackup() {
  const words = sum(await db.days.toArray())
  await db.transaction('rw', db.meta, async () => {
    await set('lastBackupAt', Date.now())
    await set('wordsLoggedAtBackup', words)
  })
}

export async function dismissNudge() {
  await set('nudgeDismissedAt', Date.now())
}

export const canPersist = () => typeof navigator !== 'undefined' && !!navigator.storage && typeof navigator.storage.persist === 'function'

/** Asks the browser to keep this site's data until the writer clears it. Returns whether it is now kept. */
export async function requestPersist(): Promise<boolean> {
  if (!canPersist()) return false
  try {
    return await navigator.storage.persist()
  } catch {
    return false
  }
}

/**
 * Asks once, after the writer's first real save, so the request comes from a site with work in it
 * rather than on first load. If the browser says no, Parchemin does not ask again on its own;
 * the safekeeping panel has a button for that.
 */
export async function requestPersistOnce() {
  if (!canPersist()) return
  if (await db.meta.get('persistAskedAt')) return
  await set('persistAskedAt', Date.now())
  await requestPersist()
}

/** Whether the backup suggestion should show: enough new words, and "Not now" not pressed lately. Cheap enough to run while writing. */
export function useBackupNudge() {
  const meta = useLiveQuery(() => db.meta.toArray(), [])
  const days = useLiveQuery(() => db.days.toArray(), [])
  if (!meta || !days) return { show: false, newWords: 0, hasBackup: false }
  const newWords = Math.max(0, sum(days) - (read(meta, 'wordsLoggedAtBackup') ?? 0))
  const quiet = Date.now() - (read(meta, 'nudgeDismissedAt') ?? 0) < QUIET_DAYS * 86_400_000
  return { show: newWords >= NUDGE_AFTER_WORDS && !quiet, newWords, hasBackup: read(meta, 'lastBackupAt') !== null }
}

export interface Keeping {
  lastBackupAt: number | null
  /** Chapters whose current text is in no backup file, and the words in them. */
  changed: { chapters: number; words: number }
  /** null while unknown, or when the browser has no way to say. */
  persisted: boolean | null
  usage: number | null
  quota: number | null
  installed: boolean
  ios: boolean
  /** Reads the browser's storage state again, after asking it to keep the data. */
  refresh: () => void
}

const isInstalled = () =>
  window.matchMedia('(display-mode: standalone)').matches || (navigator as unknown as { standalone?: boolean }).standalone === true
const isIOS = () => /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)

/** Everything the safekeeping panel shows. Only the home screen uses it, so it may read every changed chapter. */
export function useSafekeeping(): Keeping | null {
  const meta = useLiveQuery(() => db.meta.toArray(), [])
  const days = useLiveQuery(() => db.days.toArray(), [])
  const lastBackupAt = read(meta, 'lastBackupAt')
  const changed = useLiveQuery(() => db.scenes.where('updatedAt').above(lastBackupAt ?? 0).toArray(), [lastBackupAt])
  const [storage, setStorage] = useState<Pick<Keeping, 'persisted' | 'usage' | 'quota'> | null>(null)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    let live = true
    void (async () => {
      const s = typeof navigator !== 'undefined' ? navigator.storage : undefined
      const persisted = s && typeof s.persisted === 'function' ? await s.persisted().catch(() => null) : null
      const est = s && typeof s.estimate === 'function' ? await s.estimate().catch(() => null) : null
      if (live) setStorage({ persisted, usage: est?.usage ?? null, quota: est?.quota ?? null })
    })()
    return () => {
      live = false
    }
  }, [tick])

  if (!meta || !days || !changed || !storage) return null
  return {
    lastBackupAt,
    changed: { chapters: changed.length, words: sum(changed) },
    ...storage,
    installed: isInstalled(),
    ios: isIOS(),
    refresh: () => setTick((t) => t + 1),
  }
}

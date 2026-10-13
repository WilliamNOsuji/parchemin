import { useLiveQuery } from 'dexie-react-hooks'
import { useEffect, useState } from 'react'
import { db } from './db'
import type { Change, Download, Meta } from './types'

/**
 * Safekeeping: the facts a writer needs to know their work is safe, and nothing more.
 *
 * Stories live in the browser's storage, which is "best effort" until the browser agrees to keep it.
 * A backup file the writer holds is the only copy that survives a cleared browser or a lost device.
 * So Parchemin records when the last backup file was made and what has changed since (changes.ts),
 * asks the browser to keep the data once there is real work in it, and suggests a backup by how much
 * is new, never by the calendar. It counts a backup file only when it knows the file was saved.
 */

/** New words since the last backup file before Parchemin suggests making one. */
export const NUDGE_AFTER_WORDS = 2000
/** How long "Not now", or a download Parchemin can't confirm, keeps the suggestion quiet. */
const QUIET_DAYS = 5

type Key = 'lastBackupAt' | 'nudgeDismissedAt' | 'persistAskedAt'

const read = (rows: Meta[] | undefined, key: Key) => rows?.find((r) => r.key === key)?.value ?? null
const sum = (rows: { words: number }[]) => rows.reduce((n, r) => n + r.words, 0)
/** Words of new writing in no backup file known to be saved. */
const unsaved = (rows: Change[]) => rows.reduce((n, r) => n + r.added - r.held, 0)

async function set(key: Key, value: number) {
  await db.meta.put({ key, value })
}

async function noteLastBackup(at: number) {
  const last = await db.meta.get('lastBackupAt')
  if (!last || last.value < at) await set('lastBackupAt', at)
  await db.downloads.where('at').belowOrEqual(at).delete()
}

/**
 * A backup file made at `at` is saved. Every change up to `rev` is in it, and `held` says how many words
 * each note had added by then, so notes changed again since keep counting only what came after.
 */
export async function markBackup(rev: number, at: number, held: Record<string, number>) {
  await db.transaction('rw', db.changes, db.meta, db.downloads, async () => {
    await db.changes.where('rev').belowOrEqual(rev).delete()
    await db.changes
      .where('rev')
      .above(rev)
      .modify((c) => {
        // a note started after the file was read has nothing of it, whatever an older note of the same key had
        if (c.since <= rev && held[c.key] !== undefined) c.held = Math.max(c.held, held[c.key])
      })
    await noteLastBackup(at)
  })
}

/** A backup file made at `at` was just restored: the records it wrote match a file the writer holds. */
export async function markRestored(keys: string[], at: number) {
  await db.transaction('rw', db.changes, db.meta, db.downloads, async () => {
    await db.changes.bulkDelete(keys)
    await noteLastBackup(at)
  })
}

/** A backup file was handed to the browser to download. Parchemin can't see whether it saved until the writer checks it. */
export async function notePendingBackup(download: Download) {
  await db.downloads.put(download)
}

/** A backup file read back here that matches a download made here is known to be saved. Returns whether it matched. */
export async function confirmBackup(at: number): Promise<boolean> {
  const download = await db.downloads.get(at)
  if (!download) return false
  await markBackup(download.rev, at, download.held)
  return true
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
 * Asks once, the first time a screen other than the chapter shows with writing in the library (the status
 * bar does it), so the request comes from a site with work in it and never mid-sentence (Firefox shows a
 * prompt for it). If the browser says no, Parchemin does not ask again on its own; the Safekeeping page has
 * a button for that. Returns whether it asked.
 */
export async function requestPersistOnce(): Promise<boolean> {
  if (!canPersist()) return false
  const first = await db.transaction('rw', db.meta, async () => {
    if (await db.meta.get('persistAskedAt')) return false
    await set('persistAskedAt', Date.now())
    return true
  })
  if (first) await requestPersist()
  return first
}

/** Whether the backup suggestion should show: enough new words, and not quieted lately. Cheap enough to run while writing. */
export function useBackupNudge() {
  const meta = useLiveQuery(() => db.meta.toArray(), [])
  const changes = useLiveQuery(() => db.changes.toArray(), [])
  const downloads = useLiveQuery(() => db.downloads.toCollection().primaryKeys(), [])
  if (!meta || !changes || !downloads) return { show: false, newWords: 0, hasBackup: false }
  const newWords = unsaved(changes)
  const quietSince = Math.max(read(meta, 'nudgeDismissedAt') ?? 0, ...downloads)
  const quiet = Date.now() - quietSince < QUIET_DAYS * 86_400_000
  return { show: newWords >= NUDGE_AFTER_WORDS && !quiet, newWords, hasBackup: read(meta, 'lastBackupAt') !== null }
}

export interface Keeping {
  lastBackupAt: number | null
  /** The newest backup file downloaded here and not yet read back, when it is newer than the last one known to be saved. */
  unchecked: number | null
  /** What changed since the last backup file: how many records of each table, and roughly how many new words. */
  changed: { tables: Record<string, number>; words: number }
  /** With no backup file recorded, and only when asked for: every chapter here, and the words in them. */
  library: { chapters: number; words: number } | null
  /** null while unknown, or when the browser has no way to say. */
  persisted: boolean | null
  /** Everything this site stores, the app's own files included. */
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

/**
 * Everything the safekeeping panel shows. The status bar reads it on every screen, so the count of every
 * chapter (`library`, which reads the manuscripts) is made only when asked for, by the Safekeeping page.
 */
export function useSafekeeping(withLibrary = false): Keeping | null {
  const meta = useLiveQuery(() => db.meta.toArray(), [])
  const changes = useLiveQuery(() => db.changes.toArray(), [])
  const downloads = useLiveQuery(() => db.downloads.toCollection().primaryKeys(), [])
  const lastBackupAt = meta ? read(meta, 'lastBackupAt') : undefined
  // Only with no backup file recorded is it worth reading every chapter, and only where it is shown. Until meta loads, wait.
  const library = useLiveQuery(async () => {
    if (!withLibrary || lastBackupAt !== null) return lastBackupAt === undefined ? undefined : null
    const scenes = await db.scenes.toArray()
    return { chapters: scenes.length, words: sum(scenes) }
  }, [withLibrary, lastBackupAt])
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

  if (!meta || !changes || !downloads || library === undefined || !storage) return null
  const tables: Record<string, number> = {}
  for (const c of changes) tables[c.table] = (tables[c.table] ?? 0) + 1
  const newest = Math.max(0, ...downloads)
  return {
    lastBackupAt: lastBackupAt ?? null,
    unchecked: newest > (lastBackupAt ?? 0) ? newest : null,
    changed: { tables, words: unsaved(changes) },
    library,
    ...storage,
    installed: isInstalled(),
    ios: isIOS(),
    refresh: () => setTick((t) => t + 1),
  }
}

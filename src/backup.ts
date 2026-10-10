import { CHANGE_REV, changeKey } from './changes'
import { dayKey } from './craft/why'
import { db } from './db'
import { confirmBackup, markBackup, markRestored, notePendingBackup } from './safekeeping'
import type { Character, DrawerItem, Folder, Scene, Snapshot, Story, WritingDay } from './types'
import { countWords } from './words'

const FORMAT = 'parchemin-backup'
const VERSION = 1
const TABLES = ['folders', 'stories', 'scenes', 'characters', 'snapshots'] as const
type TableName = (typeof TABLES)[number]
/** Fields every row must have as text. Without them a chapter has lost its words or no longer belongs to anything. */
const FIELDS: Record<TableName, readonly string[]> = {
  folders: ['id', 'name'],
  stories: ['id', 'title'],
  scenes: ['id', 'storyId', 'content'],
  characters: ['id', 'storyId', 'name', 'bio'],
  snapshots: ['id', 'sceneId', 'content'],
}

export interface BackupFile {
  format: typeof FORMAT
  version: number
  exportedAt: number
  data: Record<TableName, { id: string }[]> & { days?: WritingDay[]; drawer?: DrawerItem[] }
}

export interface Saved {
  name: string
  /** True when Parchemin saw the file written. A plain download can be blocked or cancelled without the page knowing. */
  sure: boolean
}

interface SaveHandle {
  name: string
  createWritable(): Promise<{ write(data: Blob): Promise<void>; close(): Promise<void> }>
}
type SavePicker = (options: { suggestedName: string; types: { description: string; accept: Record<string, string[]> }[] }) => Promise<SaveHandle>

const two = (n: number) => String(n).padStart(2, '0')
const fileName = (d: Date) => `parchemin-backup-${dayKey(d)}-${two(d.getHours())}${two(d.getMinutes())}.json`

/** Asks where to save, where the browser can. null when it can't, 'cancelled' when the writer closed the dialog. */
async function pickFile(suggestedName: string): Promise<SaveHandle | 'cancelled' | null> {
  const w = window as unknown as { showSaveFilePicker?: SavePicker }
  if (typeof w.showSaveFilePicker !== 'function') return null
  try {
    return await w.showSaveFilePicker({ suggestedName, types: [{ description: 'Parchemin backup', accept: { 'application/json': ['.json'] } }] })
  } catch (e) {
    return e instanceof DOMException && e.name === 'AbortError' ? 'cancelled' : null
  }
}

/** Everything a backup holds, read in one transaction so the file is one moment of the library, with the change notes as they stood. */
function readLibrary() {
  const tables = [db.folders, db.stories, db.scenes, db.characters, db.snapshots, db.days, db.drawer, db.meta, db.changes]
  return db.transaction('r', tables, async () => {
    const data: BackupFile['data'] = {
      folders: await db.folders.toArray(),
      stories: await db.stories.toArray(),
      scenes: await db.scenes.toArray(),
      characters: await db.characters.toArray(),
      snapshots: await db.snapshots.toArray(),
      days: await db.days.toArray(),
      drawer: await db.drawer.toArray(),
    }
    const held = Object.fromEntries((await db.changes.toArray()).filter((c) => c.added > 0).map((c) => [c.key, c.added]))
    return { data, rev: (await db.meta.get(CHANGE_REV))?.value ?? 0, held, at: Date.now() }
  })
}

function download(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = name
  a.click()
  // a large file can take a while to hand over, so the URL is let go of late
  setTimeout(() => URL.revokeObjectURL(url), 60_000)
}

/**
 * Saves everything as one JSON file. Where the browser has a save dialog, Parchemin writes the file
 * itself and counts it as the latest backup. Otherwise the browser downloads it, and it counts once the
 * writer reads it back with "Check a backup file". Returns null if the writer closed the save dialog.
 */
export async function exportBackup(): Promise<Saved | null> {
  // the dialog has to open while the click still counts, before anything is read
  const handle = await pickFile(fileName(new Date()))
  if (handle === 'cancelled') return null
  const { data, rev, held, at } = await readLibrary()
  const file: BackupFile = { format: FORMAT, version: VERSION, exportedAt: at, data }
  const blob = new Blob([JSON.stringify(file)], { type: 'application/json' })
  // Once the file exists, failing to note it on this device only leaves the panel listing changes that are in fact saved.
  if (handle) {
    const out = await handle.createWritable()
    await out.write(blob)
    await out.close()
    await markBackup(rev, at, held).catch(() => undefined)
    return { name: handle.name, sure: true }
  }
  const name = fileName(new Date(at))
  download(blob, name)
  await notePendingBackup({ at, rev, held }).catch(() => undefined)
  return { name, sure: false }
}

const isRows = (rows: unknown, fields: readonly string[]) =>
  Array.isArray(rows) && rows.every((r) => !!r && typeof r === 'object' && fields.every((f) => typeof (r as Record<string, unknown>)[f] === 'string'))

function parse(text: string): BackupFile {
  let raw: unknown
  try {
    raw = JSON.parse(text)
  } catch {
    throw new Error('This file is not valid JSON.')
  }
  const f = raw as Partial<BackupFile> | null
  if (!f || f.format !== FORMAT || typeof f.data !== 'object' || f.data === null) {
    throw new Error('This does not look like a Parchemin backup.')
  }
  if (typeof f.version !== 'number' || f.version > VERSION) {
    throw new Error('This backup was made by a newer version of Parchemin.')
  }
  for (const t of TABLES) {
    if (!isRows(f.data[t], FIELDS[t])) throw new Error(`The backup is damaged (bad "${t}" data).`)
  }
  if (f.data.days !== undefined && (!Array.isArray(f.data.days) || f.data.days.some((r) => !r || typeof r.date !== 'string' || typeof r.words !== 'number'))) {
    throw new Error('The backup is damaged (bad "days" data).')
  }
  const drawerOk = (item: DrawerItem) => TABLES.every((t) => t === 'folders' || isRows(item[t], FIELDS[t]))
  if (f.data.drawer !== undefined && !(isRows(f.data.drawer, ['id', 'kind', 'storyId']) && f.data.drawer.every(drawerOk))) {
    throw new Error('The backup is damaged (bad "drawer" data).')
  }
  return f as BackupFile
}

/** When the file was made, by its own record or else by the file's date. */
const madeAt = (backup: BackupFile, file: File) => (typeof backup.exportedAt === 'number' ? backup.exportedAt : file.lastModified)

type Clean = (html: unknown) => string
type CleanImage = (src: unknown) => string | null

/**
 * A backup file can come from anywhere, so its text is rebuilt through the editor's schema
 * before it is stored, and word counts are recounted from the text itself.
 */
function cleanRows(d: BackupFile['data'], clean: Clean, cleanImage: CleanImage) {
  const scene = (s: Scene): Scene => {
    const content = clean(s.content)
    return { ...s, content, words: countWords(content) }
  }
  const snapshot = (s: Snapshot): Snapshot => {
    const content = clean(s.content)
    return { ...s, content, words: countWords(content) }
  }
  const character = (c: Character): Character => ({ ...c, bio: clean(c.bio), image: cleanImage(c.image) })
  const list = <T,>(rows: unknown) => (Array.isArray(rows) ? (rows as T[]) : [])
  return {
    folders: d.folders as Folder[],
    stories: d.stories as Story[],
    scenes: (d.scenes as Scene[]).map(scene),
    characters: (d.characters as Character[]).map(character),
    snapshots: (d.snapshots as Snapshot[]).map(snapshot),
    drawer: (d.drawer ?? []).map((item) => ({
      ...item,
      stories: list<Story>(item.stories),
      scenes: list<Scene>(item.scenes).map(scene),
      characters: list<Character>(item.characters).map(character),
      snapshots: list<Snapshot>(item.snapshots).map(snapshot),
    })),
  }
}

export interface RestoreCounts {
  stories: number
  characters: number
}

/**
 * Merges a backup into the library by id: records in the backup overwrite
 * records with the same id, and everything else already here is kept.
 * Nothing is written unless the whole file validates.
 */
export async function restoreBackup(file: File): Promise<RestoreCounts> {
  const backup = parse(await file.text())
  const { cleanHtml, cleanImage } = await import('./sanitize')
  const d = cleanRows(backup.data, cleanHtml, cleanImage)
  const days = backup.data.days
  const tables = [db.folders, db.stories, db.scenes, db.characters, db.snapshots, db.days, db.drawer, db.changes, db.meta, db.downloads]
  await db.transaction('rw', tables, async () => {
    await db.folders.bulkPut(d.folders)
    await db.stories.bulkPut(d.stories)
    await db.scenes.bulkPut(d.scenes)
    await db.characters.bulkPut(d.characters)
    await db.snapshots.bulkPut(d.snapshots)
    if (days) await db.days.bulkPut(days)
    if (d.drawer.length) await db.drawer.bulkPut(d.drawer)
    // what was just written is what the file holds, and the writer holds the file
    const keys = [...TABLES, 'drawer' as const].flatMap((t) => d[t].map((r) => changeKey(t, r.id)))
    await markRestored(keys, madeAt(backup, file))
  })
  return { stories: d.stories.length, characters: d.characters.length }
}

export interface BackupCounts {
  stories: number
  chapters: number
  characters: number
  snapshots: number
  words: number
  exportedAt: number
  /** True when the file is a download made on this device that Parchemin now counts as the latest backup. */
  counted: boolean
}

/**
 * Reads a backup file back and counts what is in it, so the writer knows the file is whole.
 * Changes nothing in the library. If the file is a download made here, it now counts as saved.
 */
export async function inspectBackup(file: File): Promise<BackupCounts> {
  const backup = parse(await file.text())
  const d = backup.data
  const exportedAt = madeAt(backup, file)
  return {
    stories: d.stories.length,
    chapters: d.scenes.length,
    characters: d.characters.length,
    snapshots: d.snapshots.length,
    words: (d.scenes as Scene[]).reduce((n, s) => n + countWords(s.content), 0),
    exportedAt,
    counted: await confirmBackup(exportedAt).catch(() => false),
  }
}

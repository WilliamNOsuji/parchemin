import { db } from './db'
import type { Character, DrawerItem, Folder, Scene, Snapshot, Story, WritingDay } from './types'
import { countWords } from './words'

const FORMAT = 'parchemin-backup'
const VERSION = 1
const TABLES = ['folders', 'stories', 'scenes', 'characters', 'snapshots'] as const
type TableName = (typeof TABLES)[number]

export interface BackupFile {
  format: typeof FORMAT
  version: number
  exportedAt: number
  data: Record<TableName, { id: string }[]> & { days?: WritingDay[]; drawer?: DrawerItem[] }
}

export async function exportBackup() {
  const data: BackupFile['data'] = {
    folders: await db.folders.toArray(),
    stories: await db.stories.toArray(),
    scenes: await db.scenes.toArray(),
    characters: await db.characters.toArray(),
    snapshots: await db.snapshots.toArray(),
    days: await db.days.toArray(),
    drawer: await db.drawer.toArray(),
  }
  const file: BackupFile = { format: FORMAT, version: VERSION, exportedAt: Date.now(), data }
  const blob = new Blob([JSON.stringify(file)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `parchemin-backup-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

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
    const rows = f.data[t]
    if (!Array.isArray(rows) || rows.some((r) => !r || typeof r.id !== 'string')) {
      throw new Error(`The backup is damaged (bad "${t}" data).`)
    }
  }
  if (f.data.days !== undefined && (!Array.isArray(f.data.days) || f.data.days.some((r) => !r || typeof r.date !== 'string' || typeof r.words !== 'number'))) {
    throw new Error('The backup is damaged (bad "days" data).')
  }
  if (f.data.drawer !== undefined && (!Array.isArray(f.data.drawer) || f.data.drawer.some((r) => !r || typeof r.id !== 'string'))) {
    throw new Error('The backup is damaged (bad "drawer" data).')
  }
  return f as BackupFile
}

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
  await db.transaction('rw', [db.folders, db.stories, db.scenes, db.characters, db.snapshots, db.days, db.drawer], async () => {
    await db.folders.bulkPut(d.folders)
    await db.stories.bulkPut(d.stories)
    await db.scenes.bulkPut(d.scenes)
    await db.characters.bulkPut(d.characters)
    await db.snapshots.bulkPut(d.snapshots)
    if (days) await db.days.bulkPut(days)
    if (d.drawer.length) await db.drawer.bulkPut(d.drawer)
  })
  return { stories: d.stories.length, characters: d.characters.length }
}

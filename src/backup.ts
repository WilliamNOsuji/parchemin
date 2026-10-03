import { db } from './db'
import type { Character, Folder, Scene, Snapshot, Story, WritingDay } from './types'

const FORMAT = 'parchemin-backup'
const VERSION = 1
const TABLES = ['folders', 'stories', 'scenes', 'characters', 'snapshots'] as const
type TableName = (typeof TABLES)[number]

export interface BackupFile {
  format: typeof FORMAT
  version: number
  exportedAt: number
  data: Record<TableName, { id: string }[]> & { days?: WritingDay[] }
}

export async function exportBackup() {
  const data: BackupFile['data'] = {
    folders: await db.folders.toArray(),
    stories: await db.stories.toArray(),
    scenes: await db.scenes.toArray(),
    characters: await db.characters.toArray(),
    snapshots: await db.snapshots.toArray(),
    days: await db.days.toArray(),
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
  return f as BackupFile
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
  const d = backup.data
  await db.transaction('rw', [db.folders, db.stories, db.scenes, db.characters, db.snapshots, db.days], async () => {
    await db.folders.bulkPut(d.folders as Folder[])
    await db.stories.bulkPut(d.stories as Story[])
    await db.scenes.bulkPut(d.scenes as Scene[])
    await db.characters.bulkPut(d.characters as Character[])
    await db.snapshots.bulkPut(d.snapshots as Snapshot[])
    if (d.days) await db.days.bulkPut(d.days)
  })
  return { stories: backup.data.stories.length, characters: backup.data.characters.length }
}

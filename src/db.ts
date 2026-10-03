import Dexie, { type EntityTable } from 'dexie'
import { nanoid } from 'nanoid'
import type { Character, Folder, Scene, Snapshot, Story, WritingDay } from './types'
import type { Template } from './templates'
import { dayKey } from './craft/why'

class ParcheminDB extends Dexie {
  folders!: EntityTable<Folder, 'id'>
  stories!: EntityTable<Story, 'id'>
  scenes!: EntityTable<Scene, 'id'>
  characters!: EntityTable<Character, 'id'>
  snapshots!: EntityTable<Snapshot, 'id'>
  days!: EntityTable<WritingDay, 'date'>

  constructor() {
    super('parchemin')
    this.version(1).stores({
      folders: 'id, parentId',
      stories: 'id, folderId, updatedAt',
      scenes: 'id, storyId, order',
      characters: 'id, storyId',
      snapshots: 'id, sceneId, createdAt',
    })
    this.version(2).stores({ days: 'date' })
  }
}

export const db = new ParcheminDB()
export const uid = () => nanoid(10)

export const DEFAULT_CHARACTER_FIELDS = ['Age', 'Appearance', 'Goal', 'Fear / Flaw', 'Secret']

export function countWords(html: string): number {
  const text = html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .trim()
  return text ? text.split(/\s+/).length : 0
}

export async function createStory(opts: {
  title?: string
  folderId?: string | null
  template?: Template | null
  synopsis?: string
}): Promise<string> {
  const id = uid()
  const now = Date.now()
  const beats = opts.template?.beats ?? [{ title: 'Chapter 1', summary: '' }]
  await db.transaction('rw', db.stories, db.scenes, async () => {
    await db.stories.add({
      id,
      title: opts.title?.trim() || 'Untitled story',
      folderId: opts.folderId ?? null,
      tags: [],
      synopsis: opts.synopsis ?? '',
      createdAt: now,
      updatedAt: now,
    })
    await db.scenes.bulkAdd(
      beats.map((b, i) => ({
        id: uid(),
        storyId: id,
        title: b.title,
        summary: b.summary,
        status: b.summary ? ('idea' as const) : ('draft' as const),
        order: i,
        content: '',
        words: 0,
        updatedAt: now,
      })),
    )
  })
  return id
}

/** Adds (or subtracts) words from today's tally. A day never goes below zero. */
export async function logWords(delta: number) {
  if (!delta) return
  const date = dayKey()
  await db.transaction('rw', db.days, async () => {
    const row = await db.days.get(date)
    await db.days.put({ date, words: Math.max(0, (row?.words ?? 0) + delta) })
  })
}

export async function addScene(storyId: string, title?: string): Promise<string> {
  const count = await db.scenes.where('storyId').equals(storyId).count()
  const id = uid()
  await db.scenes.add({
    id,
    storyId,
    title: title ?? `Chapter ${count + 1}`,
    summary: '',
    status: 'draft',
    order: count,
    content: '',
    words: 0,
    updatedAt: Date.now(),
  })
  return id
}

export async function reorderScenes(orderedIds: string[]) {
  await db.transaction('rw', db.scenes, async () => {
    await Promise.all(orderedIds.map((id, order) => db.scenes.update(id, { order })))
  })
}

export async function deleteScene(id: string) {
  await db.transaction('rw', db.scenes, db.snapshots, async () => {
    await db.scenes.delete(id)
    await db.snapshots.where('sceneId').equals(id).delete()
  })
}

export async function deleteStory(id: string) {
  await db.transaction('rw', [db.stories, db.scenes, db.characters, db.snapshots], async () => {
    const sceneIds = await db.scenes.where('storyId').equals(id).primaryKeys()
    await db.snapshots.where('sceneId').anyOf(sceneIds).delete()
    await db.scenes.where('storyId').equals(id).delete()
    await db.characters.where('storyId').equals(id).delete()
    await db.stories.delete(id)
  })
}

/** Deletes a folder; its stories and subfolders move up to the parent. */
export async function deleteFolder(id: string) {
  await db.transaction('rw', db.folders, db.stories, async () => {
    const folder = await db.folders.get(id)
    if (!folder) return
    await db.folders.where('parentId').equals(id).modify({ parentId: folder.parentId })
    await db.stories.where('folderId').equals(id).modify({ folderId: folder.parentId })
    await db.folders.delete(id)
  })
}

export async function createCharacter(storyId: string): Promise<string> {
  const id = uid()
  const now = Date.now()
  await db.characters.add({
    id,
    storyId,
    name: 'New character',
    role: '',
    image: null,
    fields: DEFAULT_CHARACTER_FIELDS.map((label) => ({ label, value: '' })),
    bio: '',
    createdAt: now,
    updatedAt: now,
  })
  return id
}

export async function takeSnapshot(sceneId: string, label: string) {
  const scene = await db.scenes.get(sceneId)
  if (!scene) return
  await db.snapshots.add({
    id: uid(),
    sceneId,
    label: label.trim() || 'Snapshot',
    content: scene.content,
    words: scene.words,
    createdAt: Date.now(),
  })
}

export async function touchStory(id: string) {
  await db.stories.update(id, { updatedAt: Date.now() })
}

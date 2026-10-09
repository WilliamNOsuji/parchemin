import Dexie, { type EntityTable } from 'dexie'
import { nanoid } from 'nanoid'
import type { Character, DrawerItem, Folder, Meta, Scene, Snapshot, Story, WritingDay } from './types'
import type { Template } from './templates'
import { dayKey } from './craft/why'
import { countWords } from './words'

class ParcheminDB extends Dexie {
  folders!: EntityTable<Folder, 'id'>
  stories!: EntityTable<Story, 'id'>
  scenes!: EntityTable<Scene, 'id'>
  characters!: EntityTable<Character, 'id'>
  snapshots!: EntityTable<Snapshot, 'id'>
  days!: EntityTable<WritingDay, 'date'>
  drawer!: EntityTable<DrawerItem, 'id'>
  meta!: EntityTable<Meta, 'key'>

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
    // v3: the drawer, and word counts recounted with the language-aware counter in words.ts
    this.version(3)
      .stores({ drawer: 'id, setAsideAt' })
      .upgrade(async (tx) => {
        const recount = (row: { content?: unknown; words: number }) => {
          row.words = countWords(typeof row.content === 'string' ? row.content : '')
        }
        await tx.table('scenes').toCollection().modify(recount)
        await tx.table('snapshots').toCollection().modify(recount)
      })
    // v4: per-device facts (last backup file, and so on) and an index so safekeeping can find chapters changed since
    this.version(4).stores({ scenes: 'id, storyId, order, updatedAt', meta: 'key' })
  }
}

export const db = new ParcheminDB()
export const uid = () => nanoid(10)

export const DEFAULT_CHARACTER_FIELDS = ['Age', 'Appearance', 'Goal', 'Fear / Flaw', 'Secret']

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

const DRAWER_TABLES = () => [db.stories, db.scenes, db.characters, db.snapshots, db.drawer]

/** Moves a chapter and its snapshots into the drawer. */
export async function setAsideScene(id: string) {
  await db.transaction('rw', DRAWER_TABLES(), async () => {
    const scene = await db.scenes.get(id)
    if (!scene) return
    const story = await db.stories.get(scene.storyId)
    const snapshots = await db.snapshots.where('sceneId').equals(id).toArray()
    await db.drawer.add({
      id: uid(),
      kind: 'chapter',
      title: scene.title,
      storyId: scene.storyId,
      storyTitle: story?.title ?? '',
      words: scene.words,
      setAsideAt: Date.now(),
      stories: [],
      scenes: [scene],
      characters: [],
      snapshots,
    })
    await db.snapshots.bulkDelete(snapshots.map((s) => s.id))
    await db.scenes.delete(id)
  })
}

/** Moves a whole story into the drawer: chapters, characters and snapshots. */
export async function setAsideStory(id: string) {
  await db.transaction('rw', DRAWER_TABLES(), async () => {
    const story = await db.stories.get(id)
    if (!story) return
    const scenes = await db.scenes.where('storyId').equals(id).toArray()
    const characters = await db.characters.where('storyId').equals(id).toArray()
    const snapshots = await db.snapshots.where('sceneId').anyOf(scenes.map((s) => s.id)).toArray()
    await db.drawer.add({
      id: uid(),
      kind: 'story',
      title: story.title,
      storyId: id,
      storyTitle: story.title,
      words: scenes.reduce((n, s) => n + s.words, 0),
      setAsideAt: Date.now(),
      stories: [story],
      scenes,
      characters,
      snapshots,
    })
    await db.snapshots.bulkDelete(snapshots.map((s) => s.id))
    await db.scenes.bulkDelete(scenes.map((s) => s.id))
    await db.characters.bulkDelete(characters.map((c) => c.id))
    await db.stories.delete(id)
  })
}

/** Moves a character into the drawer. */
export async function setAsideCharacter(id: string) {
  await db.transaction('rw', DRAWER_TABLES(), async () => {
    const character = await db.characters.get(id)
    if (!character) return
    const story = await db.stories.get(character.storyId)
    await db.drawer.add({
      id: uid(),
      kind: 'character',
      title: character.name,
      storyId: character.storyId,
      storyTitle: story?.title ?? '',
      words: 0,
      setAsideAt: Date.now(),
      stories: [],
      scenes: [],
      characters: [character],
      snapshots: [],
    })
    await db.characters.delete(id)
  })
}

/**
 * Puts drawer work back where it came from. A chapter goes to the end of its story.
 * If its story is gone, a story with the same name is made to hold it, and putting the
 * whole story back later merges into that one.
 */
export async function putBack(itemId: string) {
  await db.transaction('rw', [...DRAWER_TABLES(), db.folders], async () => {
    const item = await db.drawer.get(itemId)
    if (!item) return
    const now = Date.now()
    for (const story of item.stories) {
      const folder = story.folderId ? await db.folders.get(story.folderId) : null
      await db.stories.put({ ...story, folderId: folder ? story.folderId : null, updatedAt: now })
    }
    if (!(await db.stories.get(item.storyId))) {
      await db.stories.add({
        id: item.storyId,
        title: item.storyTitle || 'Untitled story',
        folderId: null,
        tags: [],
        synopsis: '',
        createdAt: now,
        updatedAt: now,
      })
    }
    if (item.kind === 'chapter') {
      const last = await db.scenes.where('storyId').equals(item.storyId).sortBy('order')
      let order = (last.at(-1)?.order ?? -1) + 1
      await db.scenes.bulkPut(item.scenes.map((s) => ({ ...s, order: order++ })))
    } else {
      await db.scenes.bulkPut(item.scenes)
    }
    await db.characters.bulkPut(item.characters)
    await db.snapshots.bulkPut(item.snapshots)
    await db.stories.update(item.storyId, { updatedAt: now })
    await db.drawer.delete(itemId)
  })
}

/** The only permanent delete in Parchemin. */
export async function deleteForGood(itemId: string) {
  await db.drawer.delete(itemId)
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

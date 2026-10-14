import Dexie, { type EntityTable } from 'dexie'
import { nanoid } from 'nanoid'
import type { Board, BoardImage, Change, Character, CoreIdea, Download, DrawerItem, Folder, Meta, Scene, SceneRef, Setting, Snapshot, Story, StorySymbol, WritingDay } from './types'
import { emptyCanvas } from './canvas/jsonCanvas'
import { refOf as cardRef } from './canvas/types'
import type { Template } from './templates'
import { CHANGE_REV, changeKey, changeTracking } from './changes'
import { chapterMirror, refOf } from './chapterMirror'
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
  changes!: EntityTable<Change, 'key'>
  downloads!: EntityTable<Download, 'at'>
  chapters!: EntityTable<SceneRef, 'id'>
  boards!: EntityTable<Board, 'id'>
  images!: EntityTable<BoardImage, 'id'>
  coreIdeas!: EntityTable<CoreIdea, 'id'>
  settings!: EntityTable<Setting, 'id'>
  symbols!: EntityTable<StorySymbol, 'id'>

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
    // v5: what changed since the last backup file, kept by the middleware in changes.ts, and downloads not yet read back
    this.version(5)
      .stores({ changes: 'key, rev', downloads: 'at' })
      .upgrade(async (tx) => {
        const meta = tx.table('meta')
        await meta.delete('wordsLoggedAtBackup')
        // v4 kept only the time of the last backup file. What it can show of the changes since is carried over.
        const last = (await meta.get('lastBackupAt'))?.value as number | undefined
        if (last === undefined) return
        const scenes = await tx.table('scenes').where('updatedAt').above(last).primaryKeys()
        const characters = await tx.table('characters').filter((c: Character) => c.updatedAt > last).primaryKeys()
        const note = (table: string) => (id: unknown) => ({ key: changeKey(table, String(id)), table, id: String(id), rev: 1, since: 1, added: 0, held: 0 })
        await tx.table('changes').bulkPut([...scenes.map(note('scenes')), ...characters.map(note('characters'))])
        await meta.put({ key: CHANGE_REV, value: 1 })
      })
    // v6: every chapter mirrored without its text (chapterMirror.ts), so the tree and the tabs never read the manuscripts
    this.version(6)
      .stores({ chapters: 'id, storyId' })
      .upgrade(async (tx) => {
        const scenes = (await tx.table('scenes').toArray()) as Scene[]
        await tx.table('chapters').bulkPut(scenes.map(refOf))
      })
    // v7: the boards (JSON Canvas documents) with their pictures, and the Web's core ideas, settings and symbols
    this.version(7).stores({ boards: 'id, storyId', images: 'id, storyId', coreIdeas: 'id, storyId', settings: 'id, storyId', symbols: 'id, storyId' })
    this.use(chapterMirror)
    this.use(changeTracking)
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

const DRAWER_TABLES = () => [db.stories, db.scenes, db.characters, db.snapshots, db.drawer, db.boards, db.images, db.coreIdeas, db.settings, db.symbols]

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

/** Moves a whole story into the drawer: chapters, characters, snapshots, boards and the Web's documents. */
export async function setAsideStory(id: string) {
  await db.transaction('rw', DRAWER_TABLES(), async () => {
    const story = await db.stories.get(id)
    if (!story) return
    const scenes = await db.scenes.where('storyId').equals(id).toArray()
    const characters = await db.characters.where('storyId').equals(id).toArray()
    const snapshots = await db.snapshots.where('sceneId').anyOf(scenes.map((s) => s.id)).toArray()
    const boards = await db.boards.where('storyId').equals(id).toArray()
    const images = await db.images.where('storyId').equals(id).toArray()
    const coreIdeas = await db.coreIdeas.where('storyId').equals(id).toArray()
    const settings = await db.settings.where('storyId').equals(id).toArray()
    const symbols = await db.symbols.where('storyId').equals(id).toArray()
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
      boards,
      images,
      coreIdeas,
      settings,
      symbols,
    })
    await db.snapshots.bulkDelete(snapshots.map((s) => s.id))
    await db.scenes.bulkDelete(scenes.map((s) => s.id))
    await db.characters.bulkDelete(characters.map((c) => c.id))
    await db.boards.bulkDelete(boards.map((b) => b.id))
    await db.images.bulkDelete(images.map((i) => i.id))
    await db.coreIdeas.bulkDelete(coreIdeas.map((c) => c.id))
    await db.settings.bulkDelete(settings.map((s) => s.id))
    await db.symbols.bulkDelete(symbols.map((s) => s.id))
    await db.stories.delete(id)
  })
}

/** An item for the drawer with nothing in it yet; each setAside fills in what it carries. */
function drawerItem(kind: DrawerItem['kind'], title: string, storyId: string, storyTitle: string): DrawerItem {
  return { id: uid(), kind, title, storyId, storyTitle, words: 0, setAsideAt: Date.now(), stories: [], scenes: [], characters: [], snapshots: [] }
}

/** The ids of the pictures a board's cards point at. */
const imagesOn = (b: Board) => new Set(b.canvas.nodes.flatMap((n) => (n.type === 'file' && n.file.startsWith('images/') ? [cardRef(n) ?? ''] : [])))

/** Moves a board into the drawer, with the pictures no other board of the story uses. */
export async function setAsideBoard(id: string) {
  await db.transaction('rw', DRAWER_TABLES(), async () => {
    const board = await db.boards.get(id)
    if (!board) return
    const story = await db.stories.get(board.storyId)
    const others = (await db.boards.where('storyId').equals(board.storyId).toArray()).filter((b) => b.id !== id)
    const kept = new Set(others.flatMap((b) => [...imagesOn(b)]))
    const mine = [...imagesOn(board)].filter((i) => i && !kept.has(i))
    const images = (await db.images.bulkGet(mine)).filter((i): i is BoardImage => !!i)
    await db.drawer.add({ ...drawerItem('board', board.name, board.storyId, story?.title ?? ''), boards: [board], images })
    await db.images.bulkDelete(images.map((i) => i.id))
    await db.boards.delete(id)
  })
}

/** Moves a core idea into the drawer. */
export async function setAsideCoreIdea(id: string) {
  await db.transaction('rw', DRAWER_TABLES(), async () => {
    const idea = await db.coreIdeas.get(id)
    if (!idea) return
    const story = await db.stories.get(idea.storyId)
    await db.drawer.add({ ...drawerItem('idea', idea.title, idea.storyId, story?.title ?? ''), words: countWords(idea.text), coreIdeas: [idea] })
    await db.coreIdeas.delete(id)
  })
}

/** Moves a setting into the drawer. Cards and threads that point at it say it is gone until it is put back. */
export async function setAsideSetting(id: string) {
  await db.transaction('rw', DRAWER_TABLES(), async () => {
    const setting = await db.settings.get(id)
    if (!setting) return
    const story = await db.stories.get(setting.storyId)
    await db.drawer.add({ ...drawerItem('setting', setting.name, setting.storyId, story?.title ?? ''), settings: [setting] })
    await db.settings.delete(id)
  })
}

/** A symbol is a name and a line, so it is the one thing deleted in place. */
export async function deleteSymbol(id: string) {
  await db.symbols.delete(id)
}

export async function createBoard(storyId: string, name = 'New board'): Promise<string> {
  const id = uid()
  const now = Date.now()
  await db.boards.add({ id, storyId, name, canvas: emptyCanvas(), createdAt: now, updatedAt: now })
  return id
}

export async function addImage(storyId: string, name: string, data: string): Promise<string> {
  const id = uid()
  await db.images.add({ id, storyId, name, data, createdAt: Date.now() })
  return id
}

export async function createCoreIdea(storyId: string, title = ''): Promise<string> {
  const id = uid()
  const now = Date.now()
  await db.coreIdeas.add({ id, storyId, title, text: '', carriedBy: [], createdAt: now, updatedAt: now })
  return id
}

export async function createSetting(storyId: string, name = ''): Promise<string> {
  const id = uid()
  const now = Date.now()
  await db.settings.add({ id, storyId, name, hard: '', reveals: '', props: [], mood: '', createdAt: now, updatedAt: now })
  return id
}

export async function createSymbol(storyId: string, name = ''): Promise<string> {
  const id = uid()
  const now = Date.now()
  await db.symbols.add({ id, storyId, name, note: '', createdAt: now, updatedAt: now })
  return id
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
    // items set aside before the boards and the Web existed carry none of these
    await db.boards.bulkPut(item.boards ?? [])
    await db.images.bulkPut(item.images ?? [])
    await db.coreIdeas.bulkPut(item.coreIdeas ?? [])
    await db.settings.bulkPut(item.settings ?? [])
    await db.symbols.bulkPut(item.symbols ?? [])
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

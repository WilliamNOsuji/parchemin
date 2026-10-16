import { useLiveQuery } from 'dexie-react-hooks'
import { useMemo } from 'react'
import { db } from '../db'
import type { Board, Character, CoreIdea, Scene, Setting, Story, StorySymbol } from '../types'
import { cooccurrence, type Cooccurrence } from './cooccur'
import { buildWebModel, type WebModel } from './model'
import type { WebFilters } from './types'

export interface WebParts {
  co: Cooccurrence
  characters: Character[]
  settings: Setting[]
  symbols: StorySymbol[]
  boards: Board[]
  coreIdeas: CoreIdea[]
}
export interface WebData extends WebParts {
  model: WebModel
}

const byCreated = <T extends { createdAt: number }>(rows: T[]) => rows.sort((a, b) => a.createdAt - b.createdAt)

/** The story's parts and where their names appear, live; what the sidebar needs, without drawing anything. undefined while loading. */
export function useWebParts(story: Story, scenes: Scene[]): WebParts | undefined {
  const parts = useLiveQuery(async () => {
    const [characters, settings, symbols, boards, coreIdeas] = await Promise.all([
      db.characters.where('storyId').equals(story.id).toArray(),
      db.settings.where('storyId').equals(story.id).toArray(),
      db.symbols.where('storyId').equals(story.id).toArray(),
      db.boards.where('storyId').equals(story.id).toArray(),
      db.coreIdeas.where('storyId').equals(story.id).toArray(),
    ])
    return { storyId: story.id, characters: byCreated(characters), settings: byCreated(settings), symbols: byCreated(symbols), boards: byCreated(boards), coreIdeas: byCreated(coreIdeas) }
  }, [story.id])
  // a result that belongs to the story before this one is not handed out
  const ready = parts && parts.storyId === story.id ? parts : undefined
  // each chapter's reading is kept until its text or the story's names change, so a second reader costs little
  return useMemo(() => (ready ? { ...ready, co: cooccurrence({ scenes, characters: ready.characters, settings: ready.settings, symbols: ready.symbols }) } : undefined), [ready, scenes])
}

/** The story's Web, live: the parts from the database, the chapters from the pane, read once. undefined while loading. */
export function useWebModel(story: Story, scenes: Scene[], filters: WebFilters): WebData | undefined {
  const parts = useWebParts(story, scenes)
  return useMemo(() => (parts ? { ...parts, model: buildWebModel({ scenes, ...parts, filters }) } : undefined), [parts, scenes, filters])
}

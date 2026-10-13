import { useLiveQuery } from 'dexie-react-hooks'
import { db } from './db'
import type { Scene, Story } from './types'

export interface OpenStory {
  /** undefined while loading, null when there is no such story here (it may be in the drawer). */
  story: Story | null | undefined
  /** The story's chapters in order; undefined while loading. */
  scenes: Scene[] | undefined
}

/**
 * The story on screen and its chapters, read once for the pane and the right sidebar. A live query keeps its
 * last result until the next one lands, so a result that belongs to the story before this one is not handed out:
 * the pane would otherwise fall back to that story's first chapter and open a tab for it.
 */
export function useOpenStory(storyId: string | undefined): OpenStory {
  const story = useLiveQuery(async () => (storyId ? { id: storyId, row: (await db.stories.get(storyId)) ?? null } : undefined), [storyId])
  const scenes = useLiveQuery(async () => (storyId ? { id: storyId, rows: await db.scenes.where('storyId').equals(storyId).sortBy('order') } : undefined), [storyId])
  return {
    story: story && story.id === storyId ? story.row : undefined,
    scenes: scenes && scenes.id === storyId ? scenes.rows : undefined,
  }
}

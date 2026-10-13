import { useLiveQuery } from 'dexie-react-hooks'
import { db } from './db'
import type { SceneStatus } from './types'

/** A chapter without its text: enough for the tree, the tabs and the home screen, and cheap to keep live. */
export interface SceneRef {
  id: string
  storyId: string
  title: string
  status: SceneStatus
  order: number
  words: number
  updatedAt: number
}

/** Every chapter in the library, live; undefined until the first read lands. */
export function useSceneIndex(): SceneRef[] | undefined {
  return useLiveQuery(
    async () =>
      (await db.scenes.toArray())
        .map(({ id, storyId, title, status, order, words, updatedAt }) => ({ id, storyId, title, status, order, words, updatedAt }))
        .sort((a, b) => a.order - b.order),
    [],
  )
}

export const chaptersOf = (index: SceneRef[], storyId: string) => index.filter((s) => s.storyId === storyId)
export const wordsOf = (index: SceneRef[], storyId: string) => chaptersOf(index, storyId).reduce((n, s) => n + s.words, 0)
/** 1-based chapter number, by order within its story. */
export const numberOf = (index: SceneRef[], scene: SceneRef) => chaptersOf(index, scene.storyId).findIndex((s) => s.id === scene.id) + 1

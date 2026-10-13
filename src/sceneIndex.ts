import { useLiveQuery } from 'dexie-react-hooks'
import { db } from './db'
import type { SceneRef } from './types'

export type { SceneRef } from './types'

/**
 * Every chapter in the library without its text, live; undefined until the first read lands. It reads the
 * `chapters` table that chapterMirror.ts keeps beside the manuscripts, so a save while writing re-runs a
 * cheap query, not a read of every chapter's text.
 */
export function useSceneIndex(): SceneRef[] | undefined {
  return useLiveQuery(async () => (await db.chapters.toArray()).sort((a, b) => a.order - b.order), [])
}

export const chaptersOf = (index: SceneRef[], storyId: string) => index.filter((s) => s.storyId === storyId)
export const wordsOf = (index: SceneRef[], storyId: string) => chaptersOf(index, storyId).reduce((n, s) => n + s.words, 0)
/** 1-based chapter number, by order within its story. */
export const numberOf = (index: SceneRef[], scene: SceneRef) => chaptersOf(index, scene.storyId).findIndex((s) => s.id === scene.id) + 1

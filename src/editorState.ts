import { useSyncExternalStore } from 'react'

/** What the chapter editor knows that the status bar shows: the live word count and whether the last save landed. */
export interface EditorState {
  sceneId: string | null
  words: number
  saving: 'saved' | 'saving' | 'failed'
}

let state: EditorState = { sceneId: null, words: 0, saving: 'saved' }
const listeners = new Set<() => void>()

export function setEditorState(next: Partial<EditorState>) {
  state = { ...state, ...next }
  listeners.forEach((l) => l())
}

const subscribe = (cb: () => void) => {
  listeners.add(cb)
  return () => void listeners.delete(cb)
}

export const useEditorState = () => useSyncExternalStore(subscribe, () => state)

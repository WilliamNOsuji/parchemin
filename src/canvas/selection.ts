import { useSyncExternalStore } from 'react'

/**
 * What is picked on the open board: node and edge ids. The pane writes it and clears it when it leaves; the sidebar
 * reads it, and treats it as empty when its board is not the route's.
 */
export interface CanvasSelection {
  boardId: string | null
  picked: string[]
}

let state: CanvasSelection = { boardId: null, picked: [] }
const listeners = new Set<() => void>()
const notify = () => listeners.forEach((l) => l())
const subscribe = (cb: () => void) => {
  listeners.add(cb)
  return () => void listeners.delete(cb)
}

export const useCanvasSelection = () => useSyncExternalStore(subscribe, () => state)

export function setCanvasSelection(next: CanvasSelection) {
  state = next
  notify()
}
export const setPicked = (boardId: string, picked: string[]) => setCanvasSelection({ boardId, picked })
export const pickOnly = (boardId: string, id: string) => setCanvasSelection({ boardId, picked: [id] })
export function togglePick(boardId: string, id: string) {
  const picked = state.boardId === boardId ? state.picked : []
  setCanvasSelection({ boardId, picked: picked.includes(id) ? picked.filter((p) => p !== id) : [...picked, id] })
}
export const clearPicks = () => setCanvasSelection({ boardId: null, picked: [] })

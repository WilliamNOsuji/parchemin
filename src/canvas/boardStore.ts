import { useSyncExternalStore } from 'react'
import { db } from '../db'
import type { CanvasDoc, CanvasEdge, CanvasNode } from './types'

/**
 * The open board's document, kept once in memory so the pane and the sidebar never race the save. Everything that
 * edits a board goes through here; db.boards.update is called directly only for a board's name.
 */
interface Entry {
  doc: CanvasDoc
  dirty: boolean
  /** The updatedAt of the last row written or read, so a stale row from the database is never taken over new work. */
  savedAt: number
  timer?: number
}

const SAVE_DELAY = 500
const entries = new Map<string, Entry>()
const listeners = new Set<() => void>()
const notify = () => listeners.forEach((l) => l())
const subscribe = (cb: () => void) => {
  listeners.add(cb)
  return () => void listeners.delete(cb)
}

export function useBoardDoc(boardId: string | undefined): CanvasDoc | undefined {
  return useSyncExternalStore(subscribe, () => (boardId ? entries.get(boardId)?.doc : undefined))
}

/** Reads the row. A later row (a restore, another window) is taken only when nothing here is unsaved and it is newer. */
export async function loadBoard(boardId: string): Promise<void> {
  const row = await db.boards.get(boardId)
  if (!row) return
  const e = entries.get(boardId)
  if (e && (e.dirty || row.updatedAt <= e.savedAt)) return
  entries.set(boardId, { doc: row.canvas, dirty: false, savedAt: row.updatedAt })
  notify()
}

function schedule(boardId: string, e: Entry) {
  window.clearTimeout(e.timer)
  e.timer = window.setTimeout(() => void flushBoard(boardId), SAVE_DELAY)
}

export function setBoardDoc(boardId: string, doc: CanvasDoc) {
  let e = entries.get(boardId)
  if (!e) {
    e = { doc, dirty: true, savedAt: 0 }
    entries.set(boardId, e)
  } else {
    e.doc = doc
    e.dirty = true
  }
  schedule(boardId, e)
  notify()
}

export function patchNode(boardId: string, id: string, patch: Partial<CanvasNode>) {
  const e = entries.get(boardId)
  if (!e) return
  // a patch keeps the node's own type, so the spread stays the same kind of node
  setBoardDoc(boardId, { ...e.doc, nodes: e.doc.nodes.map((n) => (n.id === id ? ({ ...n, ...patch } as CanvasNode) : n)) })
}

export function patchEdge(boardId: string, id: string, patch: Partial<CanvasEdge>) {
  const e = entries.get(boardId)
  if (!e) return
  setBoardDoc(boardId, { ...e.doc, edges: e.doc.edges.map((x) => (x.id === id ? { ...x, ...patch } : x)) })
}

/** Writes what is unsaved. update, not put: a late save must not bring back a board that was set aside. */
export async function flushBoard(boardId: string): Promise<void> {
  const e = entries.get(boardId)
  if (!e || !e.dirty) return
  window.clearTimeout(e.timer)
  e.dirty = false
  const at = Date.now()
  try {
    const written = await db.boards.update(boardId, { canvas: e.doc, updatedAt: at })
    if (written) e.savedAt = at
  } catch {
    e.dirty = true
    schedule(boardId, e)
  }
}

export const flushAllBoards = () => Promise.all([...entries.keys()].map(flushBoard))

/** Forgets a board that left for good (set aside). Nothing is written. */
export function dropBoard(boardId: string) {
  const e = entries.get(boardId)
  if (e) window.clearTimeout(e.timer)
  entries.delete(boardId)
  notify()
}

if (typeof window !== 'undefined') {
  window.addEventListener('pagehide', () => void flushAllBoards())
  window.addEventListener('beforeunload', () => void flushAllBoards())
}

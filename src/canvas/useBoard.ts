import { useLiveQuery } from 'dexie-react-hooks'
import { useCallback, useEffect } from 'react'
import { db } from '../db'
import { flushBoard, loadBoard, setBoardDoc, useBoardDoc } from './boardStore'
import type { CanvasDoc } from './types'

/**
 * The open board's document, through the one store that owns it. The board is read when it opens, read again when
 * its row changes elsewhere (a restore, another window), and anything unsaved is written when it closes.
 */
export function useBoard(boardId: string | undefined): { doc: CanvasDoc | undefined; setDoc: (doc: CanvasDoc) => void } {
  const doc = useBoardDoc(boardId)
  // the store keeps its own copy over a row that is older than what it last wrote, so this only brings in newer work
  const stamp = useLiveQuery(async () => (boardId ? (await db.boards.get(boardId))?.updatedAt : undefined), [boardId])
  useEffect(() => {
    if (boardId) void loadBoard(boardId)
  }, [boardId, stamp])
  useEffect(() => {
    if (!boardId) return
    return () => void flushBoard(boardId)
  }, [boardId])
  const setDoc = useCallback((next: CanvasDoc) => {
    if (boardId) setBoardDoc(boardId, next)
  }, [boardId])
  return { doc, setDoc }
}

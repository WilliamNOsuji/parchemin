import { addImage, db, uid } from '../db'
import { saveFile } from '../desktop'
import { cleanImage } from '../sanitize'
import type { Board } from '../types'
import { parseCanvas, serializeCanvas } from './jsonCanvas'
import { kindOf, pathFor, refOf, type CanvasDoc, type CanvasNode } from './types'

const slug = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '') || 'board'

/**
 * Saves a board as a .canvas file, the open format Obsidian reads. Live cards keep their paths (chapters/<id>.md, and
 * so on); a picture travels inside the file as an embedded image with its caption, since a file on its own has no
 * library to point at.
 */
export async function saveCanvasFile(board: Pick<Board, 'name'>, doc: CanvasDoc): Promise<void> {
  const nodes = await Promise.all(
    doc.nodes.map(async (n): Promise<CanvasNode> => {
      if (kindOf(n) !== 'image') return n
      const img = await db.images.get(refOf(n) ?? '')
      return img ? { ...n, file: img.data, caption: img.name } : n
    }),
  )
  await saveFile(new Blob([serializeCanvas({ ...doc, nodes })], { type: 'application/json' }), `${slug(board.name)}.canvas`, { name: 'JSON Canvas', extensions: ['canvas'] })
}

/**
 * Opens a .canvas file as a new board of the story. Anything the file holds that Parchemin does not show is kept as it
 * is, so the board saves back the same. An embedded picture becomes one of the story's pictures. Throws a sentence
 * the writer can read when the file is not a canvas.
 */
export async function openCanvasFile(storyId: string, file: File): Promise<string> {
  const doc = parseCanvas(await file.text())
  const nodes: CanvasNode[] = []
  for (const n of doc.nodes) {
    const data = n.type === 'file' ? cleanImage(n.file) : null
    if (n.type !== 'file' || !data) {
      nodes.push(n)
      continue
    }
    const { caption, ...rest } = n
    const id = await addImage(storyId, typeof caption === 'string' ? caption : 'A picture', data)
    nodes.push({ ...rest, file: pathFor('image', id) })
  }
  const id = uid()
  const now = Date.now()
  const name = file.name.replace(/\.canvas$/i, '').trim() || 'Opened board'
  await db.boards.add({ id, storyId, name, canvas: { ...doc, nodes }, createdAt: now, updatedAt: now })
  return id
}

import { GRID, inside, rectOf, type CanvasDoc, type CanvasNode, type Point, type Rect, type View } from './types'

export const MIN_W = 120
export const MIN_H = 40

export const snap = (v: number) => Math.round(v / GRID) * GRID

export const intersects = (a: Rect, b: Rect) => a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height

/** The rect between two corners, whichever way the drag went. */
export const rectFrom = (a: Point, b: Point): Rect => ({ x: Math.min(a.x, b.x), y: Math.min(a.y, b.y), width: Math.abs(a.x - b.x), height: Math.abs(a.y - b.y) })

export function bounds(rects: Iterable<Rect>): Rect | null {
  let x0 = Infinity
  let y0 = Infinity
  let x1 = -Infinity
  let y1 = -Infinity
  for (const r of rects) {
    x0 = Math.min(x0, r.x)
    y0 = Math.min(y0, r.y)
    x1 = Math.max(x1, r.x + r.width)
    y1 = Math.max(y1, r.y + r.height)
  }
  return Number.isFinite(x0) ? { x: x0, y: y0, width: x1 - x0, height: y1 - y0 } : null
}

/** The view that shows a rect whole in a viewport, centred, never closer than 100 %. */
export function fitView(r: Rect, size: { w: number; h: number }, clamp: (z: number) => number, pad = 48): View {
  const zoom = clamp(Math.min((size.w - 2 * pad) / Math.max(r.width, 1), (size.h - 2 * pad) / Math.max(r.height, 1), 1))
  return { zoom, x: (size.w - r.width * zoom) / 2 - r.x * zoom, y: (size.h - r.height * zoom) / 2 - r.y * zoom }
}

/** The dot grid's step on screen: the grid at this zoom, doubled while the dots would crowd closer than 10 px. */
export function gridStep(zoom: number) {
  let step = GRID * zoom
  while (step < 10) step *= 2
  return step
}

/** What moves when these are dragged: the nodes themselves and every node inside a group among them. */
export function movingSet(doc: CanvasDoc, ids: string[]): string[] {
  const set = new Set(ids.filter((id) => doc.nodes.some((n) => n.id === id)))
  for (const g of doc.nodes) {
    if (g.type !== 'group' || !set.has(g.id)) continue
    const outer = rectOf(g)
    for (const n of doc.nodes) if (n.id !== g.id && inside(rectOf(n), outer)) set.add(n.id)
  }
  return [...set]
}

/** Puts these nodes last in their layer, so they paint on top; groups stay before every other node. */
export function toEndOfLayer(nodes: CanvasNode[], ids: Set<string>): CanvasNode[] {
  const groups = nodes.filter((n) => n.type === 'group')
  const rest = nodes.filter((n) => n.type !== 'group')
  const order = (layer: CanvasNode[]) => [...layer.filter((n) => !ids.has(n.id)), ...layer.filter((n) => ids.has(n.id))]
  return [...order(groups), ...order(rest)]
}

/** Moves nodes by a delta. A drag also puts them on top of their layer; a nudge from the keyboard leaves the order, so focus stays put. */
export function moveBy(doc: CanvasDoc, ids: string[], dx: number, dy: number, toTop = true): CanvasDoc {
  const set = new Set(ids)
  const moved = doc.nodes.map((n) => (set.has(n.id) ? { ...n, x: n.x + dx, y: n.y + dy } : n))
  return { ...doc, nodes: toTop ? toEndOfLayer(moved, set) : moved }
}

/** Takes nodes off the board, and every arrow that touches them, and any arrows named. The story is not touched. */
export function removeFromDoc(doc: CanvasDoc, ids: string[]): CanvasDoc {
  const set = new Set(ids)
  return { nodes: doc.nodes.filter((n) => !set.has(n.id)), edges: doc.edges.filter((e) => !set.has(e.id) && !set.has(e.fromNode) && !set.has(e.toNode)) }
}

/** Copies nodes a step down and right, with the arrows between them. Returns the document and the copies' ids. */
export function duplicate(doc: CanvasDoc, ids: string[], newId: () => string): { doc: CanvasDoc; ids: string[] } {
  const ids2 = new Map<string, string>()
  const copies: CanvasNode[] = []
  for (const n of doc.nodes) {
    if (!ids.includes(n.id)) continue
    const id = newId()
    ids2.set(n.id, id)
    copies.push({ ...n, id, x: n.x + 2 * GRID, y: n.y + 2 * GRID })
  }
  const edges = doc.edges.filter((e) => ids2.has(e.fromNode) && ids2.has(e.toNode)).map((e) => ({ ...e, id: newId(), fromNode: ids2.get(e.fromNode)!, toNode: ids2.get(e.toNode)! }))
  const all = [...doc.nodes, ...copies]
  return { doc: { nodes: toEndOfLayer(all, new Set(copies.map((c) => c.id))), edges: [...doc.edges, ...edges] }, ids: copies.map((c) => c.id) }
}

export type Corner = 'tl' | 'tr' | 'bl' | 'br'

/** A rect resized from one corner by a delta in world units, kept to the smallest size a card can be read at. */
export function resize(r: Rect, corner: Corner, dx: number, dy: number): Rect {
  let { x, y, width, height } = r
  if (corner === 'tl' || corner === 'bl') {
    const w = Math.max(MIN_W, width - dx)
    x += width - w
    width = w
  } else width = Math.max(MIN_W, width + dx)
  if (corner === 'tl' || corner === 'tr') {
    const h = Math.max(MIN_H, height - dy)
    y += height - h
    height = h
  } else height = Math.max(MIN_H, height + dy)
  return { x, y, width, height }
}

/** The same rect with its moving edges on the grid. */
export function snapResize(r: Rect, corner: Corner): Rect {
  const left = corner === 'tl' || corner === 'bl' ? snap(r.x) : r.x
  const top = corner === 'tl' || corner === 'tr' ? snap(r.y) : r.y
  const right = corner === 'tr' || corner === 'br' ? snap(r.x + r.width) : r.x + r.width
  const bottom = corner === 'bl' || corner === 'br' ? snap(r.y + r.height) : r.y + r.height
  const width = Math.max(MIN_W, right - left)
  const height = Math.max(MIN_H, bottom - top)
  return { x: corner === 'tl' || corner === 'bl' ? right - width : left, y: corner === 'tl' || corner === 'tr' ? bottom - height : top, width, height }
}

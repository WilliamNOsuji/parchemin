import type { CanvasSide, Point, Rect } from './types'

const NORMAL: Record<CanvasSide, Point> = { top: { x: 0, y: -1 }, right: { x: 1, y: 0 }, bottom: { x: 0, y: 1 }, left: { x: -1, y: 0 } }

/** The middle of one side of a rect: where an arrow leaves or arrives, as JSON Canvas names it. */
export function anchor(r: Rect, side: CanvasSide): Point {
  switch (side) {
    case 'top':
      return { x: r.x + r.width / 2, y: r.y }
    case 'bottom':
      return { x: r.x + r.width / 2, y: r.y + r.height }
    case 'left':
      return { x: r.x, y: r.y + r.height / 2 }
    case 'right':
      return { x: r.x + r.width, y: r.y + r.height / 2 }
  }
}

const centre = (r: Rect): Point => ({ x: r.x + r.width / 2, y: r.y + r.height / 2 })

/** The side of `r` that faces a point: the one the point is furthest beyond, measured against the rect's own shape. */
export function sideFacing(r: Rect, p: Point): CanvasSide {
  const c = centre(r)
  const dx = (p.x - c.x) / Math.max(r.width, 1)
  const dy = (p.y - c.y) / Math.max(r.height, 1)
  if (Math.abs(dx) >= Math.abs(dy)) return dx >= 0 ? 'right' : 'left'
  return dy >= 0 ? 'bottom' : 'top'
}

/** The sides two rects face each other by: across the wider gap between them, so cards side by side join left to right. */
export function sidesBetween(from: Rect, to: Rect): [CanvasSide, CanvasSide] {
  const hgap = Math.max(to.x - (from.x + from.width), from.x - (to.x + to.width))
  const vgap = Math.max(to.y - (from.y + from.height), from.y - (to.y + to.height))
  const a = centre(from)
  const b = centre(to)
  if (hgap >= vgap) return b.x >= a.x ? ['right', 'left'] : ['left', 'right']
  return b.y >= a.y ? ['bottom', 'top'] : ['top', 'bottom']
}

/** The side of `r` nearest a point, for where a dropped arrow arrives. */
export function nearestSide(r: Rect, p: Point): CanvasSide {
  const d: [CanvasSide, number][] = [
    ['top', Math.abs(p.y - r.y)],
    ['bottom', Math.abs(p.y - (r.y + r.height))],
    ['left', Math.abs(p.x - r.x)],
    ['right', Math.abs(p.x - (r.x + r.width))],
  ]
  return d.sort((a, b) => a[1] - b[1])[0][0]
}

const bez = (a: number, b: number, c: number, d: number, t: number) => (1 - t) ** 3 * a + 3 * (1 - t) ** 2 * t * b + 3 * (1 - t) * t ** 2 * c + t ** 3 * d
const r1 = (n: number) => Math.round(n * 10) / 10

/**
 * An arrow from one rect to another: a cubic curve that leaves and arrives square to its sides, or a straight line
 * when the two ends already face each other in line. Sides the document leaves out are chosen by where the rects sit.
 */
export function edgePath(from: Rect, fromSide: CanvasSide | undefined, to: Rect, toSide: CanvasSide | undefined): { d: string; mid: Point } {
  const [autoFrom, autoTo] = sidesBetween(from, to)
  const fs = fromSide ?? (toSide ? sideFacing(from, anchor(to, toSide)) : autoFrom)
  const ts = toSide ?? (fromSide ? sideFacing(to, anchor(from, fromSide)) : autoTo)
  const a = anchor(from, fs)
  const b = anchor(to, ts)
  const na = NORMAL[fs]
  const nb = NORMAL[ts]
  const dist = Math.hypot(b.x - a.x, b.y - a.y)
  // facing sides on one line (right to left at the same height, bottom to top at the same x) need no curve
  const facing = na.x === -nb.x && na.y === -nb.y
  const inLine = facing && (na.x !== 0 ? Math.abs(a.y - b.y) < 1 && (b.x - a.x) * na.x > 0 : Math.abs(a.x - b.x) < 1 && (b.y - a.y) * na.y > 0)
  if (inLine) return { d: `M${r1(a.x)} ${r1(a.y)} L${r1(b.x)} ${r1(b.y)}`, mid: { x: r1((a.x + b.x) / 2), y: r1((a.y + b.y) / 2) } }
  const k = Math.min(Math.max(dist * 0.4, 30), 160)
  const c1 = { x: a.x + na.x * k, y: a.y + na.y * k }
  const c2 = { x: b.x + nb.x * k, y: b.y + nb.y * k }
  return {
    d: `M${r1(a.x)} ${r1(a.y)} C${r1(c1.x)} ${r1(c1.y)} ${r1(c2.x)} ${r1(c2.y)} ${r1(b.x)} ${r1(b.y)}`,
    mid: { x: r1(bez(a.x, c1.x, c2.x, b.x, 0.5)), y: r1(bez(a.y, c1.y, c2.y, b.y, 0.5)) },
  }
}

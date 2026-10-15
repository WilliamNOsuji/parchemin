import type { Point } from '../canvas/types'
import type { WebEdge, WebNode } from './types'

export interface LayoutOptions {
  width: number
  height: number
  seed?: number
  /** Where the nodes were last time. A node that stays starts there, so the Web does not reshuffle on every change. */
  prev?: Map<string, Point>
}

/** A small seeded random source, so the same story draws the same Web every time. */
function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const ITERATIONS = 300
const CHARGE = -480
const CHARGE_REACH = 520
/** Threads hold their ends closer than grey lines do, and pull harder. */
const LINK = { t: { distance: 100, strength: 0.7 }, x: { distance: 150, strength: 0.1 } }
const GRAVITY = 0.03
const RING_PULL = 0.08
const DECAY = 0.6
/** Room around a node for its label, so neighbours do not sit on each other's words. */
const room = (n: WebNode) => Math.max(n.r + 14, n.label.length * 2.3)

/**
 * A force layout that comes out the same for the same input: nodes push each other apart, threads pull harder than
 * grey lines, everything drifts to the centre, and chapters keep to a loose ring around the ideas. Positions are in
 * the space of `width` × `height`; the graph fits them to the view.
 */
export function layout(nodes: WebNode[], edges: WebEdge[], opts: LayoutOptions): Map<string, Point> {
  const { prev } = opts
  const width = Math.max(opts.width, 200)
  const height = Math.max(opts.height, 200)
  const out = new Map<string, Point>()
  const n = nodes.length
  if (!n) return out
  const rand = mulberry32(opts.seed ?? 7)
  const cx = width / 2
  const cy = height / 2
  const ring = 0.42 * Math.min(width, height)

  const index = new Map(nodes.map((node, i) => [node.key, i]))
  const degree = new Array<number>(n).fill(0)
  const raw = edges
    .map((e) => ({ a: index.get(e.from), b: index.get(e.to), kind: e.kind }))
    .filter((l): l is { a: number; b: number; kind: 't' | 'x' } => l.a !== undefined && l.b !== undefined && l.a !== l.b)
  for (const l of raw) {
    degree[l.a]++
    degree[l.b]++
  }
  const links = raw.map((l) => ({ ...l, bias: degree[l.a] / (degree[l.a] + degree[l.b]), strength: LINK[l.kind].strength / Math.min(degree[l.a], degree[l.b]), distance: LINK[l.kind].distance }))

  const xs = new Float64Array(n)
  const ys = new Float64Array(n)
  const vx = new Float64Array(n)
  const vy = new Float64Array(n)
  const known = nodes.map((node) => prev?.get(node.key))
  const kept = known.filter(Boolean).length
  const chapters = nodes.filter((node) => node.kind === 'ch')
  nodes.forEach((node, i) => {
    const p = known[i]
    if (p) {
      xs[i] = p.x
      ys[i] = p.y
    } else if (node.kind === 'ch') {
      const a = (chapters.indexOf(node) / Math.max(1, chapters.length)) * 2 * Math.PI - Math.PI / 2
      xs[i] = cx + ring * Math.cos(a)
      ys[i] = cy + ring * Math.sin(a)
    } else {
      const a = rand() * 2 * Math.PI
      const d = Math.sqrt(rand()) * ring * 0.7
      xs[i] = cx + d * Math.cos(a)
      ys[i] = cy + d * Math.sin(a)
    }
  })
  // a node new to a Web that is already laid out starts beside the nodes it is tied to
  if (kept) {
    const neighbours: number[][] = nodes.map(() => [])
    for (const l of links) {
      neighbours[l.a].push(l.b)
      neighbours[l.b].push(l.a)
    }
    nodes.forEach((_, i) => {
      if (known[i]) return
      const near = neighbours[i].filter((j) => known[j])
      if (!near.length) return
      xs[i] = near.reduce((s, j) => s + xs[j], 0) / near.length + (rand() - 0.5) * 40
      ys[i] = near.reduce((s, j) => s + ys[j], 0) / near.length + (rand() - 0.5) * 40
    })
  }

  // a Web mostly laid out already only settles; a new one is shaken into place
  let alpha = kept / n > 0.5 ? 0.12 : 1
  const alphaDecay = 1 - Math.pow(0.001, 1 / ITERATIONS)
  const reach2 = CHARGE_REACH * CHARGE_REACH
  for (let it = 0; it < ITERATIONS; it++) {
    alpha += -alpha * alphaDecay
    for (const l of links) {
      let dx = xs[l.b] + vx[l.b] - xs[l.a] - vx[l.a]
      let dy = ys[l.b] + vy[l.b] - ys[l.a] - vy[l.a]
      const d = Math.sqrt(dx * dx + dy * dy) || 1e-3
      const f = ((d - l.distance) / d) * alpha * l.strength
      dx *= f
      dy *= f
      vx[l.b] -= dx * l.bias
      vy[l.b] -= dy * l.bias
      vx[l.a] += dx * (1 - l.bias)
      vy[l.a] += dy * (1 - l.bias)
    }
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        let dx = xs[j] - xs[i]
        let dy = ys[j] - ys[i]
        let d2 = dx * dx + dy * dy
        if (d2 > reach2) continue
        if (d2 < 1) {
          // two nodes on the same spot are parted along a fixed direction, never a random one
          dx = ((i % 5) - 2) * 0.5 || 0.5
          dy = ((j % 3) - 1) * 0.5 || 0.5
          d2 = dx * dx + dy * dy
        }
        const w = (CHARGE * alpha) / d2
        vx[i] += dx * w
        vy[i] += dy * w
        vx[j] -= dx * w
        vy[j] -= dy * w
        // and they never overlap, label room included
        const min = room(nodes[i]) + room(nodes[j])
        if (d2 < min * min) {
          const d = Math.sqrt(d2)
          const push = ((min - d) / d) * 0.35
          vx[i] -= dx * push
          vy[i] -= dy * push
          vx[j] += dx * push
          vy[j] += dy * push
        }
      }
    }
    for (let i = 0; i < n; i++) {
      const ox = xs[i] - cx
      const oy = ys[i] - cy
      if (nodes[i].kind === 'ch') {
        const d = Math.sqrt(ox * ox + oy * oy) || 1e-3
        const f = ((ring - d) / d) * RING_PULL * alpha
        vx[i] += ox * f
        vy[i] += oy * f
      } else {
        // a part tied to nothing is held closer, or the push of the others would send it off the page
        const g = degree[i] ? GRAVITY : GRAVITY * 3
        vx[i] -= ox * g * alpha
        vy[i] -= oy * g * alpha
      }
      vx[i] *= DECAY
      vy[i] *= DECAY
      xs[i] += vx[i]
      ys[i] += vy[i]
    }
  }
  nodes.forEach((node, i) => out.set(node.key, { x: Math.round(xs[i] * 10) / 10, y: Math.round(ys[i] * 10) / 10 }))
  return out
}

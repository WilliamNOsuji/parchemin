import { nanoid } from 'nanoid'
import type { CanvasDoc, CanvasEdge, CanvasEnd, CanvasNode, CanvasSide } from './types'

const SIDES: readonly CanvasSide[] = ['top', 'right', 'bottom', 'left']
const ENDS: readonly CanvasEnd[] = ['none', 'arrow']
const STYLES = ['cover', 'ratio', 'repeat'] as const

const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v)
const int = (v: unknown, fallback: number): number => (typeof v === 'number' && Number.isFinite(v) ? Math.round(v) : fallback)
const str = (v: unknown): string | undefined => (typeof v === 'string' ? v : undefined)
const oneOf = <T extends string>(v: unknown, list: readonly T[]): T | undefined => ((list as readonly string[]).includes(v as string) ? (v as T) : undefined)
/** Drops the keys whose value is undefined, so a document serializes without them. */
const prune = <T extends Record<string, unknown>>(o: T): T => {
  for (const k of Object.keys(o)) if (o[k] === undefined) delete o[k]
  return o
}

/** One node, or null when the file's entry is not one. A duplicate id gets a fresh one; edges stay with the first. */
function node(raw: unknown, ids: Set<string>): CanvasNode | null {
  if (!isObj(raw)) return null
  const type = raw.type
  if (type !== 'text' && type !== 'file' && type !== 'link' && type !== 'group') return null
  let id = str(raw.id) || nanoid(10)
  if (ids.has(id)) id = nanoid(10)
  ids.add(id)
  const base = { ...raw, id, x: int(raw.x, 0), y: int(raw.y, 0), width: Math.max(20, int(raw.width, 200)), height: Math.max(20, int(raw.height, 60)), color: str(raw.color) }
  switch (type) {
    case 'text':
      return prune({ ...base, type: 'text' as const, text: str(raw.text) ?? '' })
    case 'file': {
      const file = str(raw.file)
      return file ? prune({ ...base, type: 'file' as const, file, subpath: str(raw.subpath) }) : null
    }
    case 'link': {
      const url = str(raw.url)
      return url ? prune({ ...base, type: 'link' as const, url }) : null
    }
    case 'group':
      return prune({ ...base, type: 'group' as const, label: str(raw.label), background: str(raw.background), backgroundStyle: oneOf(raw.backgroundStyle, STYLES) })
  }
}

/** One edge, or null when it names a node the document does not have. */
function edge(raw: unknown, ids: Set<string>, seen: Set<string>): CanvasEdge | null {
  if (!isObj(raw)) return null
  const fromNode = str(raw.fromNode)
  const toNode = str(raw.toNode)
  if (!fromNode || !toNode || !ids.has(fromNode) || !ids.has(toNode)) return null
  let id = str(raw.id) || nanoid(10)
  if (seen.has(id)) id = nanoid(10)
  seen.add(id)
  return prune({
    ...raw,
    id,
    fromNode,
    fromSide: oneOf(raw.fromSide, SIDES),
    fromEnd: oneOf(raw.fromEnd, ENDS),
    toNode,
    toSide: oneOf(raw.toSide, SIDES),
    toEnd: oneOf(raw.toEnd, ENDS),
    color: str(raw.color),
    label: str(raw.label),
  })
}

/**
 * Reads a JSON Canvas document from a file or a backup. Unknown attributes are kept, numbers are made whole, and
 * groups come first whatever the file says, since they paint under everything. Throws a sentence the writer can
 * read when the input is not a canvas.
 */
export function parseCanvas(raw: unknown): CanvasDoc {
  let data: unknown = raw
  if (typeof raw === 'string') {
    try {
      data = JSON.parse(raw)
    } catch {
      throw new Error('This file is not valid JSON.')
    }
  }
  if (!isObj(data)) throw new Error('This does not look like a canvas file.')
  const rawNodes = data.nodes ?? []
  const rawEdges = data.edges ?? []
  if (!Array.isArray(rawNodes) || !Array.isArray(rawEdges)) throw new Error('This does not look like a canvas file.')
  const ids = new Set<string>()
  const nodes = rawNodes.map((n) => node(n, ids)).filter((n): n is CanvasNode => n !== null)
  const seen = new Set<string>()
  const edges = rawEdges.map((e) => edge(e, ids, seen)).filter((e): e is CanvasEdge => e !== null)
  return { nodes: [...nodes.filter((n) => n.type === 'group'), ...nodes.filter((n) => n.type !== 'group')], edges }
}

export const emptyCanvas = (): CanvasDoc => ({ nodes: [], edges: [] })

const ORDER = ['id', 'type', 'x', 'y', 'width', 'height', 'color', 'text', 'file', 'subpath', 'url', 'label', 'background', 'backgroundStyle', 'fromNode', 'fromSide', 'fromEnd', 'toNode', 'toSide', 'toEnd']

/** Writes the document as Obsidian reads it: two spaces, the spec's attributes first, anything else after. */
export function serializeCanvas(doc: CanvasDoc): string {
  const ordered = (o: Record<string, unknown>) => {
    const out: Record<string, unknown> = {}
    for (const k of ORDER) if (o[k] !== undefined) out[k] = o[k]
    for (const k of Object.keys(o)) if (!(k in out) && o[k] !== undefined) out[k] = o[k]
    return out
  }
  return JSON.stringify({ nodes: doc.nodes.map(ordered), edges: doc.edges.map(ordered) }, null, 2) + '\n'
}

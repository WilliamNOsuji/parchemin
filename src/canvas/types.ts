/**
 * JSON Canvas 1.0 (jsoncanvas.org), the open format Obsidian published for its canvas, and what each node is to
 * Parchemin. A board is one such document. Unknown attributes are kept by spreading and never read, so a file made in
 * Obsidian survives a round trip.
 */
export type CanvasSide = 'top' | 'right' | 'bottom' | 'left'
export type CanvasEnd = 'none' | 'arrow'

interface NodeBase {
  id: string
  x: number
  y: number
  width: number
  height: number
  /** A preset "1".."6" or a hex colour; see colorOf. */
  color?: string
  [extra: string]: unknown
}
export interface TextNode extends NodeBase {
  type: 'text'
  /** Plain text with Markdown syntax, per the spec. Parchemin shows it as plain text. */
  text: string
}
export interface FileNode extends NodeBase {
  type: 'file'
  file: string
  subpath?: string
}
export interface LinkNode extends NodeBase {
  type: 'link'
  url: string
}
export interface GroupNode extends NodeBase {
  type: 'group'
  label?: string
  background?: string
  backgroundStyle?: 'cover' | 'ratio' | 'repeat'
}
export type CanvasNode = TextNode | FileNode | LinkNode | GroupNode

export interface CanvasEdge {
  id: string
  fromNode: string
  fromSide?: CanvasSide
  /** Defaults to none. */
  fromEnd?: CanvasEnd
  toNode: string
  toSide?: CanvasSide
  /** Defaults to arrow. */
  toEnd?: CanvasEnd
  color?: string
  label?: string
  [extra: string]: unknown
}

export interface CanvasDoc {
  nodes: CanvasNode[]
  edges: CanvasEdge[]
}

/** What a node is to Parchemin. Live cards are file nodes whose path is where the library folder will keep that thing. */
export type CardKind = 'note' | 'chapter' | 'character' | 'setting' | 'image' | 'group' | 'link' | 'file'
export type LiveKind = 'chapter' | 'character' | 'setting' | 'image'

const LIVE: { kind: LiveKind; re: RegExp; path: (id: string) => string }[] = [
  { kind: 'chapter', re: /^chapters\/([^/.]+)\.md$/, path: (id) => `chapters/${id}.md` },
  { kind: 'character', re: /^characters\/([^/.]+)\.md$/, path: (id) => `characters/${id}.md` },
  { kind: 'setting', re: /^settings\/([^/.]+)\.md$/, path: (id) => `settings/${id}.md` },
  { kind: 'image', re: /^images\/([^/.]+)$/, path: (id) => `images/${id}` },
]

export const pathFor = (kind: LiveKind, id: string): string => LIVE.find((l) => l.kind === kind)!.path(id)

export function kindOf(node: CanvasNode): CardKind {
  if (node.type === 'group') return 'group'
  if (node.type === 'text') return 'note'
  if (node.type === 'link') return 'link'
  return LIVE.find((l) => l.re.test(node.file))?.kind ?? 'file'
}

/** The id inside a Parchemin path, or null for anything else. */
export function refOf(node: CanvasNode): string | null {
  if (node.type !== 'file') return null
  for (const l of LIVE) {
    const m = l.re.exec(node.file)
    if (m) return m[1]
  }
  return null
}

/** The format's six presets as the app's tokens: 1 danger, 2 and 3 draft, 4 done, 5 place, 6 accent. Hex passes through. */
const PRESETS: Record<string, string> = {
  '1': 'var(--danger)',
  '2': 'var(--draft)',
  '3': 'var(--draft)',
  '4': 'var(--done)',
  '5': 'var(--place)',
  '6': 'var(--accent)',
}
export function colorOf(color: string | undefined): string | null {
  if (!color) return null
  if (PRESETS[color]) return PRESETS[color]
  return /^#[0-9a-f]{6}$/i.test(color) ? color : null
}
/** The presets a colour menu offers: danger stays for failure and deletion, and 2 looks the same as 3 here. */
export const COLOR_CHOICES = ['3', '4', '5', '6'] as const

export const DEFAULT_SIZE: Record<CardKind, { width: number; height: number }> = {
  note: { width: 300, height: 70 },
  chapter: { width: 250, height: 110 },
  character: { width: 210, height: 100 },
  setting: { width: 250, height: 130 },
  image: { width: 250, height: 136 },
  group: { width: 340, height: 420 },
  link: { width: 300, height: 70 },
  file: { width: 250, height: 80 },
}
export const GRID = 20

export interface Point {
  x: number
  y: number
}
export interface Rect extends Point {
  width: number
  height: number
}
export const rectOf = (n: CanvasNode): Rect => ({ x: n.x, y: n.y, width: n.width, height: n.height })

/** Screen = world × zoom + view. */
export interface View {
  x: number
  y: number
  zoom: number
}

/** What the surface hands to the layers drawn under and over the cards: the view, every node's rect with any live drag applied, and client → world. */
export interface Layer {
  view: View
  rects: Map<string, Rect>
  toWorld: (client: Point) => Point
}

/** A node fully inside a group's rect belongs to it: the format has no membership field, so Obsidian's rule applies. */
export const inside = (inner: Rect, outer: Rect): boolean =>
  inner.x >= outer.x && inner.y >= outer.y && inner.x + inner.width <= outer.x + outer.width && inner.y + inner.height <= outer.y + outer.height

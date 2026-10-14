import type { WebItemKind } from './item'

/** The Web's nodes: the writer's core ideas and the story's parts. */
export type WebKind = 'core' | 'char' | 'set' | 'sym' | 'ch' | 'board'

export interface WebNode {
  /** webItem(kind, id), the route's itemId when picked. */
  key: string
  kind: WebKind
  id: string
  label: string
  r: number
  /** A written chapter that no core idea names, while the story has a core idea. */
  warn?: boolean
  /** A chapter with no text, no link and no mention. */
  orphan?: boolean
}

export interface WebEdge {
  from: string
  to: string
  /** t: a thread the writer declared in a core idea. x: the two appear together in the text. */
  kind: 't' | 'x'
  weight: number
}

export interface WebFilters {
  show: Record<WebKind, boolean>
  cooccurrence: boolean
}

export const ALL_SHOWN: WebFilters = { show: { core: true, char: true, set: true, sym: true, ch: true, board: true }, cooccurrence: true }

export const ITEM_KIND: Record<WebKind, WebItemKind> = { core: 'idea', char: 'character', set: 'setting', sym: 'symbol', ch: 'chapter', board: 'board' }
export const WEB_KIND: Record<WebItemKind, WebKind> = { idea: 'core', character: 'char', setting: 'set', symbol: 'sym', chapter: 'ch', board: 'board' }

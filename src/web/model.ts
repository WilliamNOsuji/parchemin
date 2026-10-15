import type { Board, Character, CoreIdea, Scene, Setting, StorySymbol, WebLinkKind } from '../types'
import { htmlToText } from '../words'
import type { Cooccurrence } from './cooccur'
import { webItem, type WebItemKind } from './item'
import type { WebEdge, WebFilters, WebKind, WebNode } from './types'

export interface WebModelInput {
  /** The story's chapters, in order. */
  scenes: Pick<Scene, 'id' | 'title' | 'content' | 'words'>[]
  characters: Pick<Character, 'id' | 'name'>[]
  settings: Pick<Setting, 'id' | 'name'>[]
  symbols: Pick<StorySymbol, 'id' | 'name'>[]
  boards: Pick<Board, 'id' | 'name'>[]
  coreIdeas: Pick<CoreIdea, 'id' | 'title' | 'carriedBy'>[]
  co: Cooccurrence
  filters: WebFilters
}

export interface WebModel {
  nodes: WebNode[]
  edges: WebEdge[]
  /** How many of each kind the story has, whatever the filters hide. */
  counts: Record<WebKind, number>
}

const LINK_ITEM: Record<WebLinkKind, WebItemKind> = { chapter: 'chapter', character: 'character', setting: 'setting', symbol: 'symbol', board: 'board' }

/** The words a writer would see when a name is still blank. */
export const UNNAMED: Record<WebKind, string> = { core: 'Untitled idea', char: 'Unnamed', set: 'Unnamed setting', sym: 'Unnamed symbol', ch: 'Untitled', board: 'Untitled board' }

const hasText = (s: Pick<Scene, 'content' | 'words'>) => s.words > 0 || /[\p{L}\p{N}]/u.test(htmlToText(s.content ?? ''))

/**
 * The Web as the writer declared it, with no guide: core ideas and the parts they name (threads), and where names
 * appear together in the text (grey lines). Deviation shows as a missing thread, never as a score.
 */
export function buildWebModel(input: WebModelInput): WebModel {
  const { scenes, characters, settings, symbols, boards, coreIdeas, co, filters } = input
  const nodes: WebNode[] = []
  const exists = new Set<string>()
  const add = (n: WebNode) => {
    nodes.push(n)
    exists.add(n.key)
  }

  for (const c of characters) add({ key: webItem('character', c.id), kind: 'char', id: c.id, label: c.name.trim() || UNNAMED.char, r: 10 })
  for (const s of settings) add({ key: webItem('setting', s.id), kind: 'set', id: s.id, label: s.name.trim() || UNNAMED.set, r: 9 })
  for (const s of symbols) add({ key: webItem('symbol', s.id), kind: 'sym', id: s.id, label: s.name.trim() || UNNAMED.sym, r: 9 })
  for (const b of boards) add({ key: webItem('board', b.id), kind: 'board', id: b.id, label: `${b.name.trim() || UNNAMED.board} (board)`, r: 10 })
  const chapterKeys = scenes.map((s) => webItem('chapter', s.id))
  chapterKeys.forEach((key) => exists.add(key))

  // threads: one per link a core idea makes to a part that is still in the story; thicker when more ideas name the part
  const named = new Map<string, number>()
  const links = coreIdeas.map((idea) => {
    const targets = [...new Set(idea.carriedBy.map((l) => webItem(LINK_ITEM[l.kind], l.id)))].filter((k) => exists.has(k))
    for (const k of targets) named.set(k, (named.get(k) ?? 0) + 1)
    return { idea, targets }
  })
  const edges: WebEdge[] = []
  for (const { idea, targets } of links) {
    const key = webItem('idea', idea.id)
    add({ key, kind: 'core', id: idea.id, label: idea.title.trim() || UNNAMED.core, r: Math.min(22, 16 + 2 * targets.length) })
    for (const t of targets) edges.push({ from: key, to: t, kind: 't', weight: named.get(t) ?? 1 })
  }

  const mentioned = new Set<string>()
  for (const chapters of co.mentions.values()) for (const id of chapters) mentioned.add(id)
  scenes.forEach((s, i) => {
    const key = chapterKeys[i]
    const n = i + 1
    const written = hasText(s)
    const warn = coreIdeas.length > 0 && written && !named.has(key)
    const orphan = !written && !named.has(key) && !mentioned.has(s.id)
    add({ key, kind: 'ch', id: s.id, label: warn ? `ch. ${n} · no thread` : orphan ? `ch. ${n} · not written` : `ch. ${n}`, r: 7, ...(warn ? { warn } : {}), ...(orphan ? { orphan } : {}) })
  })

  // grey lines: two names in the same chapters, and a name to each chapter it appears in
  for (const [pair, shared] of co.pairs) {
    const [a, b] = pair.split('|')
    if (exists.has(a) && exists.has(b)) edges.push({ from: a, to: b, kind: 'x', weight: shared })
  }
  for (const [key, chapters] of co.mentions) {
    if (!exists.has(key)) continue
    for (const id of chapters) {
      const ch = webItem('chapter', id)
      if (exists.has(ch)) edges.push({ from: key, to: ch, kind: 'x', weight: 1 })
    }
  }

  const counts: Record<WebKind, number> = { core: 0, char: 0, set: 0, sym: 0, ch: 0, board: 0 }
  for (const n of nodes) counts[n.kind]++

  const shown = new Set(nodes.filter((n) => filters.show[n.kind]).map((n) => n.key))
  return {
    nodes: nodes.filter((n) => shown.has(n.key)),
    edges: edges.filter((e) => shown.has(e.from) && shown.has(e.to) && (e.kind === 't' || filters.cooccurrence)),
    counts,
  }
}

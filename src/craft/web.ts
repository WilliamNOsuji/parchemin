import type { Board, Character, Scene, Setting, StorySymbol, WebLink, WebLinkKind } from '../types'

/** The Web's copy, in one place, so the button, the palette and the hint say the same words. */
export const WEB_COPY = {
  ideaHint: 'A core idea is what the story believes. Link what carries it; the Web draws the thread.',
  ideaPlaceholder: 'What the story believes, in your own words.',
  ideaTitle: 'Name this idea',
  inBackup: 'It is in your backup file, and in no export of the story.',
  noIdeas: 'A core idea is what the story believes, in your own words. Write the first one.',
  noLinks: 'Nothing carries it yet. Add the chapters, people, places and things that do.',
  gone: 'No longer in the story',
  asideIdea: (title: string) => `Move "${title}" to the drawer? Its threads go with it, and come back when you put it back.`,
  symbolsLead: 'Something the book returns to: an object, an image, a phrase. A name and a line.',
  noSymbols: 'No symbols yet.',
  deleteSymbol: (name: string) => `Delete ${name}? A symbol is a name and a line; there is nothing else to keep.`,
  guideOff: 'The guide is off. The Web shows what you declared, and where names appear together in the text.',
  plainReadings: 'Plain readings of your text against your own words. Nothing is scored, and nothing here changes a line of the book.',
  neverExported: 'For you only · never exported',
}

export const ideaTitle = (title: string) => title.trim() || 'Untitled idea'
export const symbolName = (s: Pick<StorySymbol, 'name'>) => s.name.trim() || 'Unnamed symbol'

export const LINK_GROUPS: { kind: WebLinkKind; label: string }[] = [
  { kind: 'chapter', label: 'Chapters' },
  { kind: 'character', label: 'Characters' },
  { kind: 'setting', label: 'Settings' },
  { kind: 'symbol', label: 'Symbols' },
  { kind: 'board', label: 'Boards' },
]
/** The legend's colours, so a chip and its node read as the same kind. */
export const LINK_COLOR: Record<WebLinkKind, string> = { chapter: 'var(--muted)', character: 'var(--revised)', setting: 'var(--place)', symbol: 'var(--draft)', board: 'var(--text)' }

export interface LinkTargets {
  scenes: Pick<Scene, 'id' | 'title'>[]
  characters: Pick<Character, 'id' | 'name'>[]
  settings: Pick<Setting, 'id' | 'name'>[]
  symbols: Pick<StorySymbol, 'id' | 'name'>[]
  boards: Pick<Board, 'id' | 'name'>[]
}

/** Everything a core idea can name, by kind, labelled as the writer sees it. */
export function linkOptions(t: LinkTargets): Record<WebLinkKind, { id: string; label: string }[]> {
  return {
    chapter: t.scenes.map((s, i) => ({ id: s.id, label: `${i + 1} · ${s.title.trim() || 'Untitled'}` })),
    character: t.characters.map((c) => ({ id: c.id, label: c.name.trim() || 'Unnamed' })),
    setting: t.settings.map((s) => ({ id: s.id, label: s.name.trim() || 'Unnamed setting' })),
    symbol: t.symbols.map((s) => ({ id: s.id, label: symbolName(s) })),
    board: t.boards.map((b) => ({ id: b.id, label: b.name.trim() || 'Untitled board' })),
  }
}

/** A link's label, or null when what it names has left the story (set aside, or deleted). */
export function linkLabel(link: WebLink, options: Record<WebLinkKind, { id: string; label: string }[]>): string | null {
  const o = options[link.kind]?.find((x) => x.id === link.id)
  if (!o) return null
  return link.kind === 'chapter' ? `ch. ${o.label}` : o.label
}

export const sameLink = (a: WebLink, b: WebLink) => a.kind === b.kind && a.id === b.id

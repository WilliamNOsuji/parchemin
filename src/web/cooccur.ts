import type { Character, Scene, Setting, StorySymbol } from '../types'
import { htmlToText } from '../words'
import { webItem } from './item'

/**
 * Where the story's names appear in its text, counted locally with no guide. Two names in the same chapter make a grey
 * line in the Web, and that is all it means: they appear together in the text.
 */
export interface Cooccurrence {
  /** webItem key → the chapters it appears in. */
  mentions: Map<string, Set<string>>
  /** webItem key → the spellings that matched, as the writer typed the name. */
  spellings: Map<string, Set<string>>
  /** pairKey(a, b) → how many chapters both appear in. */
  pairs: Map<string, number>
}

export interface CooccurrenceInput {
  scenes: Pick<Scene, 'id' | 'content' | 'updatedAt'>[]
  characters: Pick<Character, 'id' | 'name'>[]
  settings: Pick<Setting, 'id' | 'name'>[]
  symbols: Pick<StorySymbol, 'id' | 'name'>[]
}

/** One key per pair, whichever way round it is asked. */
export const pairKey = (a: string, b: string): string => (a < b ? `${a}|${b}` : `${b}|${a}`)

const ARTICLES = new Set(['the', 'a', 'an', 'le', 'la', 'les', "l'", 'un', 'une', 'der', 'die', 'das', 'el', 'los', 'las', 'il', 'lo', 'de', 'het'])
/** Scripts written without spaces between words, where a boundary check would never match. */
const UNSPACED = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Thai}]/u

/** The form both the text and the names are compared in: composed, lower case, one kind of apostrophe. Accents stay: the writer's spelling wins. */
const fold = (s: string) => s.normalize('NFC').toLocaleLowerCase().replace(/’/g, "'")
const tidy = (s: string) => s.normalize('NFC').trim().replace(/\s+/g, ' ')
const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

interface Variant {
  key: string
  /** The name as the writer typed it, for the sidebar's "as Mara, Mara Quill". */
  spelling: string
  re: RegExp
  length: number
}

function pattern(folded: string): RegExp {
  const body = escape(folded)
  return UNSPACED.test(folded) ? new RegExp(body, 'gu') : new RegExp(`(?<![\\p{L}\\p{N}])${body}(?![\\p{L}\\p{N}])`, 'gu')
}

/**
 * The names to look for, longest first. A character's first name counts too, when it can only mean them: the name has
 * two words or more, the first is not an article ("The Board" is never matched on "the"), has two letters or more, and
 * does not start another name in the story. Settings and symbols match only in full ("Nan's letters" is not "Nan's").
 */
function variants(input: CooccurrenceInput): Variant[] {
  const entities = [
    ...input.characters.map((c) => ({ key: webItem('character', c.id), name: tidy(c.name), person: true })),
    ...input.settings.map((s) => ({ key: webItem('setting', s.id), name: tidy(s.name), person: false })),
    ...input.symbols.map((s) => ({ key: webItem('symbol', s.id), name: tidy(s.name), person: false })),
  ].filter((e) => [...e.name].length >= 2 && e.name !== 'New character')
  const firstTokens = entities.map((e) => fold(e.name).split(' ')[0])
  const out: Variant[] = []
  entities.forEach((e, i) => {
    const folded = fold(e.name)
    out.push({ key: e.key, spelling: e.name, re: pattern(folded), length: folded.length })
    if (!e.person) return
    const tokens = folded.split(' ')
    const first = tokens[0]
    const letters = first.replace(/[^\p{L}]/gu, '').length
    if (tokens.length < 2 || letters < 2 || ARTICLES.has(first) || firstTokens.some((t, j) => j !== i && t === first)) return
    out.push({ key: e.key, spelling: e.name.split(' ')[0], re: pattern(first), length: first.length })
  })
  return out.sort((a, b) => b.length - a.length)
}

/** What one chapter mentions: key → the spellings found. */
type Found = Map<string, Set<string>>

/** The last reading of each chapter, kept while its text and the story's names stay the same. */
const memo = new Map<string, { updatedAt: number; sig: string; found: Found }>()
const MEMO_MAX = 2000

function read(content: string, list: Variant[]): Found {
  let text = fold(htmlToText(content))
  const found: Found = new Map()
  for (const v of list) {
    v.re.lastIndex = 0
    let hit = false
    // each match is blanked, so a shorter name never runs on what a longer one took ("the lamp room" is not "the lamp")
    text = text.replace(v.re, (m) => {
      hit = true
      return ' '.repeat(m.length)
    })
    if (!hit) continue
    const set = found.get(v.key) ?? new Set<string>()
    set.add(v.spelling)
    found.set(v.key, set)
  }
  return found
}

export function cooccurrence(input: CooccurrenceInput): Cooccurrence {
  const list = variants(input)
  const sig = list.map((v) => `${v.key}=${v.spelling}`).join('\n')
  const mentions = new Map<string, Set<string>>()
  const spellings = new Map<string, Set<string>>()
  const pairs = new Map<string, number>()
  for (const scene of input.scenes) {
    let entry = memo.get(scene.id)
    if (!entry || entry.updatedAt !== scene.updatedAt || entry.sig !== sig) {
      entry = { updatedAt: scene.updatedAt, sig, found: list.length ? read(scene.content ?? '', list) : new Map() }
      if (memo.size >= MEMO_MAX) memo.clear()
      memo.set(scene.id, entry)
    }
    const keys = [...entry.found.keys()]
    for (const key of keys) {
      const chapters = mentions.get(key) ?? new Set<string>()
      chapters.add(scene.id)
      mentions.set(key, chapters)
      const spelled = spellings.get(key) ?? new Set<string>()
      for (const s of entry.found.get(key)!) spelled.add(s)
      spellings.set(key, spelled)
    }
    for (let i = 0; i < keys.length; i++) {
      for (let j = i + 1; j < keys.length; j++) {
        const k = pairKey(keys[i], keys[j])
        pairs.set(k, (pairs.get(k) ?? 0) + 1)
      }
    }
  }
  return { mentions, spellings, pairs }
}

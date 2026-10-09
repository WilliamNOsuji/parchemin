/**
 * Word counting that works across languages.
 *
 * The browser's word segmenter knows that « and — are not words, that "l'homme" is one word,
 * and where the words are in Chinese or Japanese text that has no spaces. Hyphenated words
 * ("well-known", "peut-être") count once, as they do in most word processors.
 */

// Tags that end a line of text. Every other tag (bold, italic, links) sits inside a word.
const BLOCK_TAG = /<\/?(?:p|h[1-6]|li|ul|ol|blockquote|pre|div|hr|br)\b[^>]*>/gi
const ANY_TAG = /<[^>]*>/g
const ENTITY = /&(#x[0-9a-f]+|#\d+|[a-z]+);/gi
const NAMED: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' }
const HYPHENS = new Set(['-', '‐', '‑'])

const segmenter = typeof Intl !== 'undefined' && 'Segmenter' in Intl ? new Intl.Segmenter(undefined, { granularity: 'word' }) : null

function decode(entity: string): string {
  const e = entity.toLowerCase()
  if (e.startsWith('#x')) return String.fromCodePoint(parseInt(e.slice(2), 16) || 32)
  if (e.startsWith('#')) return String.fromCodePoint(parseInt(e.slice(1), 10) || 32)
  return NAMED[e] ?? ' '
}

/** The text of a chapter as a writer would read it, one line per block. */
export function htmlToText(html: string): string {
  return html.replace(BLOCK_TAG, '\n').replace(ANY_TAG, '').replace(ENTITY, (_, e: string) => decode(e))
}

export function countTextWords(text: string): number {
  if (!segmenter) {
    // Older browsers: split on spaces and skip anything with no letter or digit in it.
    return text.split(/\s+/).filter((t) => /[\p{L}\p{N}]/u.test(t)).length
  }
  let n = 0
  let after: 'word' | 'hyphen' | 'gap' = 'gap'
  for (const s of segmenter.segment(text)) {
    if (s.isWordLike) {
      if (after !== 'hyphen') n++
      after = 'word'
    } else {
      after = after === 'word' && HYPHENS.has(s.segment) ? 'hyphen' : 'gap'
    }
  }
  return n
}

export function countWords(html: string): number {
  return countTextWords(htmlToText(html))
}

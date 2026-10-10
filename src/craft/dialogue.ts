import { htmlToText } from '../words'

/**
 * Dialogue, after the video series' part on it (research note 14): nobody says what they mean.
 *
 * Each speaker wants something in this chapter, and a line is an action aimed at someone. The writer
 * names that action with a verb ending in -ing. Everything here only reads what the writer wrote:
 * it never suggests a line, a tactic or a speaker, and it never grades anything.
 */

/** Examples of tactics, named for what a line does rather than what it says. Any verb works. */
export const TACTICS = [
  'goading', 'deflecting', 'warning', 'credentialing', 'appeasing', 'testing', 'roasting', 'defending',
  'counterattacking', 'needling', 'stalling', 'probing', 'bargaining', 'conceding', 'baiting', 'reassuring',
]

export interface ScriptLine {
  speaker: string
  tactic?: string
  text: string
}

const NAME = String.raw`\p{L}[\p{L}\p{N} .'’-]{0,39}?`
/** BOB: line, or BOB (roasting): line */
const INLINE = new RegExp(String.raw`^(${NAME})\s*(?:\(([^)]*)\))?\s*:\s*(.*\S)$`, 'u')
/** A screenplay cue: the name alone on its line, in capitals, maybe with a (tactic). */
const CUE = new RegExp(String.raw`^(${NAME})\s*(?:\(([^)]*)\))?$`, 'u')
const PAREN = /^\(([^)]*)\)$/
/** Scene headings and screenplay marks that look like names but are not speakers. */
const NOT_A_SPEAKER = /^(?:INT|EXT|INT\/EXT|I\/E)[ .]/
const EXTENSION = /^(?:V\.?O\.?|O\.?S\.?|O\.?C\.?|CONT['’]?D)$/i

const isCue = (line: string) => {
  const m = CUE.exec(line)
  return !!m && /\p{Lu}.*\p{Lu}/u.test(m[1]) && !/\p{Ll}/u.test(m[1]) && !NOT_A_SPEAKER.test(line) ? m : null
}
const tacticOf = (paren: string | undefined) => {
  const t = paren?.trim()
  return t && !EXTENSION.test(t) ? t : undefined
}

/**
 * Reads a script draft. A speech is `NAME: line`, `NAME (tactic): line`, or a screenplay block: the name
 * alone in capitals, an optional `(tactic)` line, then the speech up to a blank line. Anything else is action.
 */
export function parseScript(script: string): ScriptLine[] {
  const rows = script.split(/\r?\n/).map((l) => l.trim())
  const out: ScriptLine[] = []
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    if (!row) continue
    const cue = isCue(row)
    if (cue && rows[i + 1]) {
      let tactic = tacticOf(cue[2])
      const speech: string[] = []
      while (rows[i + 1]) {
        i++
        const paren = PAREN.exec(rows[i])
        if (paren) tactic ??= tacticOf(paren[1])
        else speech.push(rows[i])
      }
      if (speech.length) out.push({ speaker: cue[1].trim(), tactic, text: speech.join(' ') })
      continue
    }
    const inline = INLINE.exec(row)
    if (inline) out.push({ speaker: inline[1].trim(), tactic: tacticOf(inline[2]), text: inline[3] })
  }
  return out
}

/** Speakers in the order they first speak. Names match without regard to case; the first spelling is kept. */
export function speakersOf(lines: ScriptLine[]): string[] {
  const seen = new Map<string, string>()
  for (const l of lines) if (!seen.has(l.speaker.toLocaleLowerCase())) seen.set(l.speaker.toLocaleLowerCase(), l.speaker)
  return [...seen.values()]
}

export const sameSpeaker = (a: string, b: string) => a.trim().toLocaleLowerCase() === b.trim().toLocaleLowerCase()

/** Paragraphs of a chapter as plain text. */
export const paragraphsOf = (html: string) =>
  htmlToText(html)
    .split('\n')
    .map((p) => p.trim())
    .filter(Boolean)

const CLOSERS: Record<string, string> = { '“': '”', '„': '“”', '«': '»', '「': '」', '『': '』', '"': '"', '‘': '’' }
/** Where the quote opened at `i` closes, or the end of the paragraph if it never does. */
function closeOf(text: string, i: number): number {
  const open = text[i]
  const at = (ok: (j: number) => boolean) => {
    for (let j = i + 1; j < text.length; j++) if (CLOSERS[open].includes(text[j]) && ok(j)) return j
    return -1
  }
  if (open !== '‘') return at(() => true)
  // ’ is also an apostrophe (don’t, goin’), so a ‘quote’ prefers to close after punctuation, as speech does,
  // and otherwise at the first ’ with no letter after it (a ‘word’ in quotes)
  const free = (j: number) => !/\p{L}/u.test(text[j + 1] ?? '')
  const spoken = at((j) => free(j) && /[,.!?…—–-]/.test(text[j - 1]))
  return spoken >= 0 ? spoken : at(free)
}

interface Piece {
  speech: boolean
  text: string
}

/** Splits a paragraph into speech in quotation marks and the narration around it. A quote left open runs to the end. */
function pieces(paragraph: string): Piece[] {
  const out: Piece[] = []
  let narration = ''
  let i = 0
  while (i < paragraph.length) {
    const ch = paragraph[i]
    const closers = CLOSERS[ch]
    if (!closers) {
      narration += ch
      i++
      continue
    }
    const end = closeOf(paragraph, i)
    const j = end < 0 ? paragraph.length : end
    out.push({ speech: false, text: narration })
    out.push({ speech: true, text: paragraph.slice(i + 1, j).trim() })
    narration = ''
    i = j + 1
  }
  out.push({ speech: false, text: narration })
  return out
}

export interface Spoken {
  /** The speech in one paragraph, joined. A new speaker gets a new paragraph, so this is one speaker. */
  text: string
  paragraph: string
}

/** The speech in a chapter, one line per paragraph, with the narration (and so the tags) left out. */
export function spokenLines(html: string): Spoken[] {
  return paragraphsOf(html).flatMap((paragraph) => {
    const said = pieces(paragraph).filter((p) => p.speech && p.text)
    // “This is chicken, Gene,” Bob said. reads as This is chicken, Gene once the tag is gone
    return said.length ? [{ text: said.map((p) => p.text).join(' ').replace(/,$/, ''), paragraph }] : []
  })
}

// --- facts for the dialogue pass. Counts and the lines they come from, never a verdict. ---------------

const PLAIN_TAGS = new Set(['said', 'asked', 'says', 'asks'])
const OTHER_TAGS = new Set(
  (
    'retorted replied responded answered exclaimed chuckled laughed snapped hissed growled muttered mumbled murmured whispered ' +
    'shouted yelled screamed cried sighed snarled barked quipped interjected declared announced stated remarked admitted added ' +
    'continued insisted demanded pleaded begged protested objected argued explained observed mused purred breathed gasped groaned ' +
    'moaned giggled smirked scoffed sneered stammered stuttered blurted opined chirped beamed grinned smiled spat roared bellowed ' +
    'wailed sobbed teased joked warned agreed suggested offered countered corrected echoed repeated called intoned drawled crowed ' +
    'gushed huffed grunted snorted squeaked squealed croaked rasped'
  ).split(' '),
)
const NOT_ADVERBS = new Set(['only', 'early', 'family', 'reply', 'belly', 'holy', 'ugly', 'silly', 'jelly', 'rally', 'supply', 'apply', 'multiply', 'bully'])
const FEELING_WORDS =
  'angry|sad|lonely|scared|afraid|nervous|happy|hurt|jealous|upset|anxious|ashamed|guilty|frightened|furious|terrified|worried|' +
  'depressed|miserable|heartbroken|alone|embarrassed|disappointed|excited|grateful|confused|overwhelmed|devastated|betrayed|empty|broken'
const FEELING = new RegExp(
  String.raw`\bI(?:['’]m| am| feel| felt| was| have been|['’]ve been)\s+(?:so |really |very |just |a bit |kind of |pretty |quite |deeply |truly )?(?:${FEELING_WORDS})\b|\bI feel\b|\bmakes? me (?:feel )?(?:${FEELING_WORDS})\b`,
  'i',
)
const NUMBER = /\d|\b(?:two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|twenty|thirty|forty|fifty|hundred|thousand|million|dozen)\b/i
const BROKEN_OFF = /(?:—|–|--|…|\.\.\.)$/
const PHONETIC = /(?<!\p{L})(?:\p{L}+in['’](?!\p{L})|['’]em\b)/giu
const STOP = new Set(
  (
    'that they them with from have been were what when where which about there their would could should into over just only really other than then ' +
    'this these those being nowhere everyone nobody something nothing three four five seven eight nine eleven twelve twenty thirty forty fifty hundred thousand million dozen'
  ).split(' '),
)

const words = (s: string) => s.toLocaleLowerCase().match(/\p{L}+(?:['’]\p{L}+)*/gu) ?? []
const prefix = (a: string, b: string) => {
  let n = 0
  while (n < a.length && n < b.length && a[n] === b[n]) n++
  return n
}
/** Whether a line uses a word from the writer's note: the same word, or one sharing its first five letters (lonely, loneliness). */
const usesWord = (lineWords: string[], w: string) => lineWords.some((x) => x === w || (w.length >= 5 && x.length >= 5 && prefix(w, x) >= 5))

export interface Facts {
  lines: number
  /** Lines that say a feeling out loud. */
  feelings: string[]
  /** Questions answered with a question. */
  questionPairs: number
  /** Lines that break off or trail away. */
  brokenOff: number
  /** Lines with a number in them. */
  withNumbers: number
  /** Tags: how many are said or asked, and the others with their counts. Prose only. */
  plainTags: number
  otherTags: [verb: string, count: number][]
  /** "said softly" and the like. Prose only. */
  adverbs: string[]
  /** goin', 'em and the like. */
  phonetic: string[]
  /** Words from the "really about" note that appear in the dialogue, with how many lines use each. */
  named: [word: string, lines: number][]
  /** The last paragraph of the chapter, or the last line of the script. */
  last: string
}

const tally = (xs: string[]) => {
  const m = new Map<string, number>()
  for (const x of xs) m.set(x, (m.get(x) ?? 0) + 1)
  return [...m.entries()].sort((a, b) => b[1] - a[1])
}

/** Tags in a paragraph: the words beside a quote that runs on with a comma, question or dash, or that leads into one. */
function tagWindows(paragraph: string): string[][] {
  const ps = pieces(paragraph)
  const out: string[][] = []
  ps.forEach((p, k) => {
    if (p.speech) return
    const before = ps[k - 1]
    const after = ps[k + 1]
    // “Fine,” she snapped, slamming the door. (Between two quotes, “You know,” he said, “…”, it is read once.)
    if (before?.speech && /[,?!—–…-]$/.test(before.text)) out.push(words(p.text.split(/[.;:!?]/)[0]).slice(0, 5))
    // Gene said, “That isn't chicken.”
    else if (after?.speech && /[,:]\s*$/.test(p.text)) out.push(words(p.text).slice(-5))
  })
  return out
}

function scan(spoken: string[], paragraphs: string[] | null, underneath: string, speakers?: string[]): Omit<Facts, 'last'> {
  const ends = (s: string) => s.replace(/[\s"”»」』'’)]+$/, '')
  let questionPairs = 0
  for (let i = 1; i < spoken.length; i++) {
    const differ = !speakers || !sameSpeaker(speakers[i], speakers[i - 1])
    if (differ && ends(spoken[i - 1]).endsWith('?') && ends(spoken[i]).endsWith('?')) questionPairs++
  }
  const windows = paragraphs?.flatMap(tagWindows) ?? []
  const tags = windows.flatMap((w) => w.filter((x) => PLAIN_TAGS.has(x) || OTHER_TAGS.has(x)))
  const adverbs = windows.flatMap((w) =>
    w.flatMap((x, i) => {
      if (!(PLAIN_TAGS.has(x) || OTHER_TAGS.has(x))) return []
      const near = [w[i - 1], w[i + 1]].find((y) => y && y.length >= 5 && y.endsWith('ly') && !NOT_ADVERBS.has(y))
      return near ? [near === w[i + 1] ? `${x} ${near}` : `${near} ${x}`] : []
    }),
  )
  const lineWords = spoken.map(words)
  const noteWords = [...new Set(words(underneath).filter((w) => w.length >= 4 && !STOP.has(w)))]
  return {
    lines: spoken.length,
    feelings: spoken.filter((s) => FEELING.test(s)),
    questionPairs,
    brokenOff: spoken.filter((s) => BROKEN_OFF.test(ends(s))).length,
    withNumbers: spoken.filter((s) => NUMBER.test(s)).length,
    plainTags: tags.filter((t) => PLAIN_TAGS.has(t)).length,
    otherTags: tally(tags.filter((t) => !PLAIN_TAGS.has(t))),
    adverbs: [...new Set(adverbs)],
    phonetic: [...new Set(spoken.flatMap((s) => s.match(PHONETIC) ?? []))],
    named: noteWords.map((w): [string, number] => [w, lineWords.filter((lw) => usesWord(lw, w)).length]).filter(([, n]) => n > 0),
  }
}

/** Facts about the dialogue in a chapter's text. */
export function chapterFacts(html: string, underneath = ''): Facts {
  const paragraphs = paragraphsOf(html)
  const spoken = spokenLines(html)
  return { ...scan(spoken.map((s) => s.text), spoken.map((s) => s.paragraph), underneath), last: paragraphs.at(-1) ?? '' }
}

/** Facts about a script draft. Tags and adverbs don't apply: a script has none. */
export function scriptFacts(script: string, underneath = ''): Facts {
  const lines = parseScript(script)
  const rows = script.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
  return { ...scan(lines.map((l) => l.text), null, underneath, lines.map((l) => l.speaker)), last: rows.at(-1) ?? '' }
}

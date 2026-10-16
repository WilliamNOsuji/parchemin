import type { Token, Tokens, TokensList } from 'marked'
import { db, uid } from './db'
import { cleanHtml } from './sanitize'
import type { Scene, Story } from './types'
import { countWords, htmlToText } from './words'

/**
 * Markdown files in, chapters out: one file or many, each becoming a chapter, or several when the file is split at its
 * headings. The text goes through the editor's own schema, so what comes in is what the editor can show, and nothing
 * in a file can run. Parchemin's own Markdown export comes back as the same story.
 */
export interface ImportSource {
  name: string
  text: string
}

export interface PlannedChapter {
  title: string
  html: string
  words: number
  /** The file it came from. */
  from: string
}

export interface ImportPlan {
  chapters: PlannedChapter[]
  /** A title the files give the story, when one file opens with its own: Parchemin's export does. */
  title?: string
  synopsis?: string
  /** The synopsis as the file wrote it. Into a story already here it has nowhere to go, so it opens the first chapter. */
  synopsisHtml?: string
  /** Pictures in the files, left out: a chapter holds text. */
  pictures: number
  /** Files written a paragraph per line with no blank lines between, read that way instead of as one long paragraph. */
  lineParagraphs: string[]
  /** True when at least one file has headings it could be split at. */
  canSplit: boolean
}

export const MARKDOWN_ACCEPT = '.md,.markdown,.mdown,.mkd,text/markdown'
export const isMarkdown = (f: { name: string; type?: string }) => /\.(md|markdown|mdown|mkd)$/i.test(f.name) || f.type === 'text/markdown'

const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' })

/** Reads the files as text, in the order a writer numbers them: "Chapter 2" before "Chapter 10". */
export async function readSources(files: File[]): Promise<ImportSource[]> {
  const read = await Promise.all(files.filter(isMarkdown).map(async (f) => ({ name: f.name, text: await f.text() })))
  return read.sort((a, b) => collator.compare(a.name, b.name))
}

/** The file's name as a chapter title: no extension, and no "01 - " a writer used to keep the files in order. */
export function titleFromName(name: string): string {
  const base = name.replace(/\.[^.]+$/, '').trim()
  const bare = base.replace(/^\d+\s*[-_.)]\s*/, '').trim()
  return bare || base || 'Untitled'
}

interface Prepared {
  body: string
  frontTitle?: string
  pictures: number
  lineParagraphs: boolean
}

/** What Markdown editors add that is not prose: front matter, Obsidian's links, embeds, highlights and comments. */
function prepare(text: string): Prepared {
  let body = text.replace(/^﻿/, '').replace(/\r\n?/g, '\n')
  let frontTitle: string | undefined
  const fm = /^---\n([\s\S]*?)\n(?:---|\.\.\.)\n?/.exec(body)
  if (fm) {
    const t = /^title:\s*(.+)$/m.exec(fm[1])?.[1].trim().replace(/^(['"])(.*)\1$/, '$2')
    if (t) frontTitle = t
    body = body.slice(fm[0].length)
  }
  let pictures = 0
  body = body
    .replace(/%%[\s\S]*?%%/g, '')
    .replace(/!\[\[([^\]]*)\]\]/g, () => {
      pictures++
      return ''
    })
    .replace(/!\[[^\]]*\]\([^)]*\)/g, () => {
      pictures++
      return ''
    })
    .replace(/\[\[([^\]|]*?)(?:\|([^\]]*))?\]\]/g, (_, target: string, alias?: string) => alias ?? target.replace(/[#^].*$/, ''))
    .replace(/==([^=\n]+)==/g, '$1')
  // a file with no blank line anywhere is a paragraph per line, as many plain editors write it
  const lines = body.split('\n').filter((l) => l.trim())
  const lineParagraphs = lines.length >= 3 && !/\n[ \t]*\n/.test(body.trim())
  if (lineParagraphs) body = lines.join('\n\n')
  return { body, frontTitle, pictures, lineParagraphs }
}

const blank = (t: Token) => t.type === 'space'
const plain = (inline: string, marked: typeof import('marked')) => htmlToText(marked.parseInline(inline, { async: false }) as string).replace(/\s+/g, ' ').trim()

/** Splits one file into chapters, at the headings that repeat. Returns the chapters and any title and synopsis it opens with. */
function chaptersOf(src: ImportSource, split: boolean, single: boolean, marked: typeof import('marked')): { chapters: { title: string; tokens: Token[] }[]; title?: string; synopsis?: string; synopsisTokens?: Token[]; canSplit: boolean; prepared: Prepared } {
  const prepared = prepare(src.text)
  const tokens = marked.lexer(prepared.body)
  const content = tokens.filter((t) => !blank(t))
  const headings = content.filter((t): t is Tokens.Heading => t.type === 'heading')
  const fallback = prepared.frontTitle ?? titleFromName(src.name)
  const first = content[0]
  const leadsWith = (h: Tokens.Heading) => first === h

  // where it could split: the top level when it repeats, or the level under a single opening title
  const top = Math.min(...headings.map((h) => h.depth))
  const atTop = headings.filter((h) => h.depth === top)
  let depth: number | undefined
  let title: string | undefined
  if (atTop.length >= 2) depth = top
  else if (atTop.length === 1 && leadsWith(atTop[0])) {
    const deeper = headings.filter((h) => h.depth > top)
    if (deeper.length) {
      depth = Math.min(...deeper.map((h) => h.depth))
      title = plain(atTop[0].text, marked)
    }
  }
  const canSplit = depth !== undefined

  if (!split || depth === undefined) {
    // one chapter: an opening heading names it, and leaves the text
    const opening = first?.type === 'heading' ? (first as Tokens.Heading) : undefined
    const rest = opening ? tokens.filter((t) => t !== opening) : tokens
    return { chapters: [{ title: opening ? plain(opening.text, marked) : fallback, tokens: rest }], title: prepared.frontTitle, canSplit, prepared }
  }

  const chapters: { title: string; tokens: Token[] }[] = []
  let current: { title: string; tokens: Token[] } | null = null
  const before: Token[] = []
  for (const t of tokens) {
    if (title !== undefined && t === first) continue
    if (t.type === 'heading' && (t as Tokens.Heading).depth === depth) {
      current = { title: plain((t as Tokens.Heading).text, marked), tokens: [] }
      chapters.push(current)
    } else if (current) current.tokens.push(t)
    else before.push(t)
  }
  // what comes before the first chapter: a quote under the title of a file imported alone is the synopsis, as
  // Parchemin's export writes it; in a batch it stays at the head of the file's first chapter, so no text is lost
  const lead = before.filter((t) => !blank(t))
  let synopsis: string | undefined
  let synopsisTokens: Token[] | undefined
  if (single && lead.length === 1 && lead[0].type === 'blockquote') {
    synopsis = plain((lead[0] as Tokens.Blockquote).text, marked)
    synopsisTokens = lead
  } else if (lead.length && lead.length === 1 && lead[0].type === 'blockquote' && chapters.length) chapters[0].tokens.unshift(...before)
  else if (lead.length) chapters.unshift({ title: title ?? fallback, tokens: before })
  return { chapters, title: title ?? prepared.frontTitle, synopsis, synopsisTokens, canSplit, prepared }
}

/** What an import will make, before anything is written, so the writer sees the chapters first. */
export async function planImport(sources: ImportSource[], split: boolean): Promise<ImportPlan> {
  const marked = await import('marked')
  const plan: ImportPlan = { chapters: [], pictures: 0, lineParagraphs: [], canSplit: false }
  for (const src of sources) {
    const out = chaptersOf(src, split, sources.length === 1, marked)
    plan.pictures += out.prepared.pictures
    if (out.prepared.lineParagraphs) plan.lineParagraphs.push(src.name)
    if (out.canSplit) plan.canSplit = true
    if (sources.length === 1) {
      plan.title = out.title
      plan.synopsis = out.synopsis
      if (out.synopsisTokens) plan.synopsisHtml = cleanHtml(marked.parser(Object.assign([...out.synopsisTokens], { links: {} }) as TokensList, { async: false }) as string)
    }
    for (const c of out.chapters) {
      const list = Object.assign([...c.tokens], { links: {} }) as TokensList
      const html = cleanHtml(marked.parser(list, { async: false }) as string)
      plan.chapters.push({ title: c.title || 'Untitled', html, words: countWords(html), from: src.name })
    }
  }
  return plan
}

export type ImportTarget = { storyId: string } | { newStory: { title: string; folderId: string | null; synopsis?: string } }

/**
 * Writes the chapters, after the story's last chapter or as a new story, in one go: an import that fails halfway
 * leaves nothing behind. Imported words are not counted as words written today; they were written before.
 */
export async function runImport(plan: ImportPlan, target: ImportTarget): Promise<{ storyId: string; firstId: string }> {
  const now = Date.now()
  const storyId = 'storyId' in target ? target.storyId : uid()
  const ids = plan.chapters.map(() => uid())
  await db.transaction('rw', db.stories, db.scenes, async () => {
    if ('newStory' in target) {
      const story: Story = { id: storyId, title: target.newStory.title.trim() || 'Imported story', folderId: target.newStory.folderId, tags: [], synopsis: target.newStory.synopsis ?? '', createdAt: now, updatedAt: now }
      await db.stories.add(story)
    } else if (!(await db.stories.get(storyId))) {
      throw new Error('That story is no longer in the library.')
    }
    const existing = await db.scenes.where('storyId').equals(storyId).sortBy('order')
    const start = (existing.at(-1)?.order ?? -1) + 1
    // a story already here keeps its own synopsis, so the file's opens its first chapter instead
    const chapters = 'storyId' in target && plan.synopsisHtml ? plan.chapters.map((c, i) => (i ? c : { ...c, html: plan.synopsisHtml + c.html, words: countWords(plan.synopsisHtml + c.html) })) : plan.chapters
    const scenes: Scene[] = chapters.map((c, i) => ({ id: ids[i], storyId, title: c.title, summary: '', status: 'draft', order: start + i, content: c.html, words: c.words, updatedAt: now }))
    await db.scenes.bulkAdd(scenes)
    await db.stories.update(storyId, { updatedAt: now })
  })
  return { storyId, firstId: ids[0] }
}

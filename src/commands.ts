import type { Route } from './route'
import type { SceneRef } from './sceneIndex'
import type { Theme } from './theme'
import type { Story } from './types'

/** Every action in the app, in the writer's own words. The palette uses the same copy as the buttons. */
export interface Command {
  id: string
  label: string
  /** Where it lives, or what it does, in a few words. */
  hint?: string
  keys?: string
  run: () => void
}

export interface CommandContext {
  route: Route
  stories: Story[]
  index: SceneRef[]
  theme: Theme
  actions: {
    go: (r: Route) => void
    newStory: () => void
    newChapter: () => void
    newCharacter: () => void
    toggleFocus: () => void
    snapshot: () => void
    openRight: (tab: string) => void
    setAsideChapter: () => void
    backup: () => void
    exportMarkdown: () => void
    exportEpub: () => void
    cycleTheme: () => void
    toggleLeft: () => void
    toggleRight: () => void
  }
}

const THEME_NEXT: Record<Theme, string> = { system: 'light', light: 'dark', dark: 'the system' }

export function buildCommands({ route, stories, index, theme, actions: a }: CommandContext): Command[] {
  const out: Command[] = []
  const story = route.name === 'story' ? stories.find((s) => s.id === route.storyId) : undefined
  const chapters = story ? index.filter((s) => s.storyId === story.id) : []
  const writing = route.name === 'story' && route.tab === 'write'

  if (writing) {
    out.push(
      { id: 'focus', label: 'Focus mode', keys: 'Ctrl+Shift+F', run: a.toggleFocus },
      { id: 'snapshot', label: 'Snapshot this draft', keys: 'Ctrl+Shift+S', run: a.snapshot },
      { id: 'cover', label: 'Cover the names in this chapter', hint: 'Dialogue', run: () => a.openRight('dialogue') },
      { id: 'dialogue', label: 'Open the Dialogue panel', keys: 'Ctrl+D', run: () => a.openRight('dialogue') },
      { id: 'plan', label: 'Chapter plan', hint: 'Goal, conflict, turn', run: () => a.openRight('plan') },
      { id: 'nudge', label: 'A nudge, if you need one', hint: 'Unblock', run: () => a.openRight('unblock') },
      { id: 'waiting', label: 'Leave a sentence waiting', hint: 'Note for tomorrow', run: () => a.openRight('notes') },
      { id: 'snapshots', label: 'Snapshots', hint: 'Earlier drafts of this chapter', run: () => a.openRight('snapshots') },
      { id: 'aside', label: 'Set this chapter aside', hint: 'Drawer', run: a.setAsideChapter },
    )
  }
  if (story) {
    out.push(
      { id: 'chapter', label: 'New chapter', hint: story.title, run: a.newChapter },
      { id: 'outline', label: 'Open the outline', hint: story.title, run: () => a.go({ name: 'story', storyId: story.id, tab: 'outline' }) },
      { id: 'audit', label: 'Read the whole outline', hint: 'Outline', run: () => { a.go({ name: 'story', storyId: story.id, tab: 'outline' }); a.openRight('audit') } },
      { id: 'cast', label: 'Open the cast', hint: story.title, run: () => a.go({ name: 'story', storyId: story.id, tab: 'cast' }) },
      { id: 'character', label: 'New character', hint: story.title, run: a.newCharacter },
      { id: 'md', label: 'Export as Markdown', hint: 'Export', run: a.exportMarkdown },
      { id: 'epub', label: 'Export as EPUB', hint: 'Export', run: a.exportEpub },
    )
    chapters.forEach((c, i) => out.push({ id: `open:${c.id}`, label: `Open chapter ${i + 1} · ${c.title || 'Untitled'}`, hint: story.title, run: () => a.go({ name: 'story', storyId: story.id, tab: 'write', itemId: c.id }) }))
  }
  out.push(
    { id: 'library', label: 'Library', hint: 'Home', run: () => a.go({ name: 'home' }) },
    { id: 'new-story', label: 'New story', run: a.newStory },
    { id: 'backup', label: 'Save a backup file', hint: 'Safekeeping', run: a.backup },
    { id: 'safekeeping', label: 'Safekeeping', hint: 'Where your words are', run: () => a.go({ name: 'safekeeping' }) },
    { id: 'drawer', label: 'The drawer', hint: 'What you set aside', run: () => a.go({ name: 'drawer' }) },
    { id: 'theme', label: `Theme: switch to ${THEME_NEXT[theme]}`, hint: `Now ${theme === 'system' ? 'following the system' : theme}`, run: a.cycleTheme },
    { id: 'left', label: 'Show or hide the library sidebar', run: a.toggleLeft },
    { id: 'right', label: 'Show or hide the right sidebar', run: a.toggleRight },
  )
  for (const s of stories) if (s.id !== story?.id) out.push({ id: `story:${s.id}`, label: `Open story · ${s.title || 'Untitled story'}`, hint: 'Library', run: () => a.go({ name: 'story', storyId: s.id, tab: 'write' }) })
  return out
}

const RECENT_KEY = 'parchemin.recentCommands'

export function recentCommands(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}

export function noteCommand(id: string) {
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify([id, ...recentCommands().filter((x) => x !== id)].slice(0, 10)))
  } catch {
    // the palette just won't remember this one
  }
}

/** Every word typed has to appear somewhere in the command's name or hint. */
export function filterCommands(all: Command[], query: string): Command[] {
  const words = query.toLocaleLowerCase().split(/\s+/).filter(Boolean)
  if (!words.length) {
    const recent = recentCommands()
    const byId = new Map(all.map((c) => [c.id, c]))
    const first = recent.map((id) => byId.get(id)).filter((c): c is Command => !!c)
    return [...first, ...all.filter((c) => !recent.includes(c.id))]
  }
  return all.filter((c) => {
    const hay = `${c.label} ${c.hint ?? ''}`.toLocaleLowerCase()
    return words.every((w) => hay.includes(w))
  })
}

import type { CanvasDoc } from './canvas/types'

export type SceneStatus = 'idea' | 'draft' | 'revised' | 'done'

export const STATUSES: { id: SceneStatus; label: string }[] = [
  { id: 'idea', label: 'Idea' },
  { id: 'draft', label: 'Draft' },
  { id: 'revised', label: 'Revised' },
  { id: 'done', label: 'Done' },
]

export interface Folder {
  id: string
  name: string
  parentId: string | null
  createdAt: number
}

export interface Story {
  id: string
  title: string
  folderId: string | null
  tags: string[]
  synopsis: string
  createdAt: number
  updatedAt: number
  /** Optional finish line: total words and the date to finish by (YYYY-MM-DD). */
  targetWords?: number
  finishBy?: string
}

/** A chapter or scene. A story always has at least one. */
export interface Scene {
  id: string
  storyId: string
  title: string
  summary: string
  status: SceneStatus
  order: number
  content: string // HTML
  words: number
  updatedAt: number
  /** Chapter plan, all optional. Goal: what the POV character wants in this scene. */
  plan?: ChapterPlan
  /** Dialogue prep, a script draft and the writer's own checks. Never part of the manuscript. */
  dialogue?: ChapterDialogue
  /** A sentence waiting: the writer's note on what happens next, left when they stop for the day. */
  waiting?: string
}

/** Someone who talks in one chapter, and what they are after in it. Only the name is needed. */
export interface Speaker {
  id: string
  characterId?: string
  name: string
  /** One sentence: what they want in this chapter, not in life. */
  want?: string
  /** What they think and choose not to say. */
  unsaid?: string
  /** What they could never say out loud, or don't know about themselves. */
  unsayable?: string
}

export interface ChapterDialogue {
  speakers?: Speaker[]
  /** The third thing: an object that carries what nobody can say. */
  object?: string
  /** A named value at the open, and a different one at the close. */
  opens?: string
  closes?: string
  /** What the talk is really about. Never said in it. */
  underneath?: string
  /** Who knows more than someone else in the room. The reader counts. */
  knowsMore?: string
  /** The dialogue drafted fast, as a script: NAME: line, or NAME (tactic): line. */
  script?: string
  /** The writer's own ticks on the dialogue pass. */
  checks?: Record<string, boolean>
}

export interface ChapterPlan {
  pov?: string
  setting?: string
  goal?: string
  conflict?: string
  /** How the chapter ends somewhere different from where it began. */
  turn?: string
  prop?: string
  lastLine?: string
}

export interface CharacterField {
  label: string
  value: string
}

export interface Character {
  id: string
  storyId: string
  name: string
  role: string
  image: string | null // data URL
  fields: CharacterField[]
  bio: string // HTML
  createdAt: number
  updatedAt: number
  craft?: CharacterCraft
}

/** The working parts of a character: who they are in a room and who they have to become. */
export interface CharacterCraft {
  voice?: string // voice id, see craft/voices.ts
  spice?: string // a second voice, borrowed for one move; drops away under pressure
  wantInRoom?: string
  fear?: string
  seesOthersAs?: string
  signature?: string // one line only this character would say
  function?: string // what they can do that nobody else in the book can
  psychFlaw?: string // hurts themselves
  moralFlaw?: string // hurts other people
  ghost?: string // the past that is still deciding what they do
  need?: string
  heroChecks?: Record<string, boolean>
}

export interface Snapshot {
  id: string
  sceneId: string
  label: string
  content: string
  words: number
  createdAt: number
}

/** Words written on one calendar day, so the app can show the habit without nagging about it. */
export interface WritingDay {
  date: string // YYYY-MM-DD, local time
  words: number
}

/** A fact Parchemin keeps about this device, such as when the last backup file was made. Not part of a backup. */
export interface Meta {
  key: string
  value: number
}

/** A record that changed since the last backup file. Kept per device by changes.ts, not part of a backup. */
export interface Change {
  key: string // `${table}:${id}`
  table: string
  id: string
  /** From a counter that only goes up, so a backup file can tell which changes it holds. */
  rev: number
  /** The counter when this note was started. */
  since: number
  /** Roughly how many words of new writing went into the record since the note was started. */
  added: number
  /** How many of those words are already in a backup file known to be saved. */
  held: number
}

/** A backup file handed to the browser to download, not yet read back, so not yet known to be saved. */
export interface Download {
  at: number // the file's exportedAt
  /** The change counter the file holds, and the words each note had added by then. */
  rev: number
  held: Record<string, number>
}

/** A place in the story, asked obstacle-first: what makes it hard comes before what it looks like. */
export interface Setting {
  id: string
  storyId: string
  name: string
  /** What makes it hard for the people in it to get what they want. */
  hard: string
  /** What the place shows about whoever is in it. */
  reveals: string
  /** Objects someone can pick up, fight over or hide behind. */
  props: string[]
  /** Mood comes last. */
  mood: string
  createdAt: number
  updatedAt: number
}

/** A thing the book returns to: an object, an image, a phrase. A name and a line. (Not `Symbol`: that is the global.) */
export interface StorySymbol {
  id: string
  storyId: string
  name: string
  note: string
  createdAt: number
  updatedAt: number
}

export type WebLinkKind = 'chapter' | 'character' | 'setting' | 'symbol' | 'board'
/** A part of the story the writer says carries a core idea. A thread in the Web. */
export interface WebLink {
  kind: WebLinkKind
  id: string
}

/** A document in the Web: what the story believes, in the writer's words, and the parts the writer says carry it. For the writer only, never exported. */
export interface CoreIdea {
  id: string
  storyId: string
  title: string
  text: string // HTML, the editor's schema
  carriedBy: WebLink[]
  createdAt: number
  updatedAt: number
}

/** A board: one JSON Canvas document with a name. Pictures live in `images`, so a board stays small. */
export interface Board {
  id: string
  storyId: string
  name: string
  canvas: CanvasDoc
  createdAt: number
  updatedAt: number
}

/** A picture placed on a board, as an embedded data URL (cleanImage's rule). `name` is its caption: the one thing Obsidian keeps. */
export interface BoardImage {
  id: string
  storyId: string
  name: string
  data: string
  createdAt: number
}

/**
 * Work the writer set aside instead of deleting: a whole story, one chapter, one character, a board, a core idea
 * or a setting, with everything needed to put it back exactly as it was, snapshots included.
 * Only "Delete for good" in the drawer removes anything permanently.
 */
export interface DrawerItem {
  id: string
  kind: 'story' | 'chapter' | 'character' | 'board' | 'idea' | 'setting'
  title: string
  storyId: string
  storyTitle: string
  words: number
  setAsideAt: number
  stories: Story[]
  scenes: Scene[]
  characters: Character[]
  snapshots: Snapshot[]
  /** Added with the boards and the Web; items set aside before then lack them, so read with `?? []`. */
  boards?: Board[]
  images?: BoardImage[]
  coreIdeas?: CoreIdea[]
  settings?: Setting[]
  symbols?: StorySymbol[]
}

/** A chapter without its text: what the tree, the tabs and the home screen need. Mirrored from `scenes` into `chapters` (chapterMirror.ts). */
export interface SceneRef {
  id: string
  storyId: string
  title: string
  status: SceneStatus
  order: number
  words: number
  updatedAt: number
}

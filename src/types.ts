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

/**
 * Work the writer set aside instead of deleting: a whole story, one chapter or one character,
 * with everything needed to put it back exactly as it was, snapshots included.
 * Only "Delete for good" in the drawer removes anything permanently.
 */
export interface DrawerItem {
  id: string
  kind: 'story' | 'chapter' | 'character'
  title: string
  storyId: string
  storyTitle: string
  words: number
  setAsideAt: number
  stories: Story[]
  scenes: Scene[]
  characters: Character[]
  snapshots: Snapshot[]
}

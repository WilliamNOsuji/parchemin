import type { Setting } from '../types'

export type SettingField = 'hard' | 'reveals' | 'props' | 'mood'

/**
 * A setting sheet in the order the method asks it: what makes the place hard comes first, what it reveals next, then
 * the things someone can pick up, and mood last. The hint under an empty field is the line of the craft behind it.
 */
export const SETTING_FIELDS: { key: SettingField; label: string; placeholder: string; hint: string }[] = [
  {
    key: 'hard',
    label: 'Hard because',
    placeholder: 'What makes it hard here?',
    hint: 'Do not ask what the room looks like. Ask what makes it hard for your character to get what they want here.',
  },
  {
    key: 'reveals',
    label: 'What it reveals',
    placeholder: 'What does this place show about whoever is in it?',
    hint: 'A setting reveals. The same room reads differently to someone hopeful and someone ashamed.',
  },
  {
    key: 'props',
    label: 'Props',
    placeholder: 'One per line: something someone can pick up, fight over or hide behind',
    hint: 'List five objects someone could pick up, break, fuss with or hide behind. Which one comes back later?',
  },
  {
    key: 'mood',
    label: 'Mood',
    placeholder: 'Last, once the rest is there',
    hint: 'Mood comes last.',
  },
]

/** Props are kept one per line; blank lines are dropped. */
export const propsFrom = (text: string): string[] =>
  text
    .split('\n')
    .map((p) => p.trim())
    .filter(Boolean)

export const settingName = (s: Pick<Setting, 'name'>) => s.name.trim() || 'Unnamed setting'

/** What a list row says beside a setting's name: a plain count. */
export const propsCount = (s: Pick<Setting, 'props'>) => (s.props.length === 1 ? '1 prop' : s.props.length ? `${s.props.length} props` : 'no props yet')

export const SETTING_COPY = {
  lead: 'A setting opposes, reveals, supplies props and sets mood, and mood comes last.',
  empty: 'No settings yet. A setting is a place asked obstacle-first: what makes it hard to get what you want there?',
  aside: (name: string) => `Move ${name} to the drawer? Cards and threads that point at it will say it is gone until you put it back.`,
}

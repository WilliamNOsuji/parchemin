import { FAMILIES, voiceById, type Voice } from './voices'
import type { Character } from '../types'

/**
 * Reads the voices across the cast and names the pairs with friction built in, and the pairs without.
 * Characters sound different because they want different things; two of the same family in one room
 * can go a whole chapter without a turn.
 */
export interface Reading {
  kind: 'friction' | 'same'
  a: Character
  b: Character
  text: string
}

const first = (c: Character) => c.name.trim().split(/\s+/)[0] || 'Unnamed'
const short = (v: Voice) => v.name.replace(/^The /, '')

export function castAgainst(characters: Character[]): Reading[] {
  const cast = characters
    .map((c) => ({ c, v: voiceById(c.craft?.voice) }))
    .filter((x): x is { c: Character; v: Voice } => !!x.v && !!x.c.name.trim() && x.c.name !== 'New character')
  const out: Reading[] = []
  for (let i = 0; i < cast.length; i++) {
    for (let j = i + 1; j < cast.length; j++) {
      const [a, b] = [cast[i], cast[j]]
      if (a.v.clashesWith.includes(b.v.id) || b.v.clashesWith.includes(a.v.id)) {
        out.push({
          kind: 'friction',
          a: a.c,
          b: b.c,
          text: `${first(a.c)} (${short(a.v)}) and ${first(b.c)} (${short(b.v)}) pull in opposite directions: ${a.v.tactic.toLocaleLowerCase()} against ${b.v.tactic.toLocaleLowerCase()}, so every scene they share has friction built in.`,
        })
      } else if (a.v.family === b.v.family) {
        const fam = FAMILIES.find((f) => f.id === a.v.family)
        out.push({
          kind: 'same',
          a: a.c,
          b: b.c,
          text: `${first(a.c)} (${short(a.v)}) and ${first(b.c)} (${short(b.v)}) are both ${fam?.name ?? 'the same family'}: two in one room can go a whole chapter without a turn. Give one of them a dash of another voice, and let it drop away under pressure.`,
        })
      }
    }
  }
  // the pairs that work first, then the pairs to watch; at most four lines, so it stays a paragraph
  return [...out.filter((r) => r.kind === 'friction'), ...out.filter((r) => r.kind === 'same')].slice(0, 4)
}

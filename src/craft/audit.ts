import type { Scene } from '../types'

export interface Finding {
  level: 'gap' | 'pattern'
  text: string
}

const norm = (s: string | undefined) => (s ?? '').trim().toLowerCase()

/** Longest run of identical non-empty values, with the chapter index where it starts. */
function longestRun(values: string[]): { len: number; start: number; value: string } {
  let best = { len: 0, start: 0, value: '' }
  let i = 0
  while (i < values.length) {
    let j = i
    while (j + 1 < values.length && values[j + 1] === values[i]) j++
    if (values[i] && j - i + 1 > best.len) best = { len: j - i + 1, start: i, value: values[i] }
    i = j + 1
  }
  return best
}

/**
 * Read the chapter plan across and down. Gaps say which part of the prep is unfinished;
 * patterns are the things that make a middle sag: the same point of view, place or conflict over and over.
 */
export function auditOutline(scenes: Scene[]): Finding[] {
  const out: Finding[] = []
  const name = (i: number) => scenes[i].title || `Chapter ${i + 1}`

  const missing = (key: 'goal' | 'conflict' | 'turn', label: string, hint: string) => {
    const empty = scenes.map((s, i) => (norm(s.plan?.[key]) ? -1 : i)).filter((i) => i >= 0)
    if (empty.length) out.push({ level: 'gap', text: `${empty.length} of ${scenes.length} chapters have no ${label}. ${hint}` })
  }
  missing('goal', 'goal', 'Goal is what the point-of-view character wants in this scene, not their life goal.')
  missing('conflict', 'conflict', 'Who or what is stopping them from getting it?')
  missing('turn', 'turn', 'A chapter that ends where it began is just information being delivered.')

  const pov = longestRun(scenes.map((s) => norm(s.plan?.pov)))
  if (pov.len >= 4) out.push({ level: 'pattern', text: `The same point of view runs for ${pov.len} chapters starting at “${name(pov.start)}”. Consider alternating.` })

  const place = longestRun(scenes.map((s) => norm(s.plan?.setting)))
  if (place.len >= 5) out.push({ level: 'pattern', text: `${place.len} chapters in a row are set in “${place.value}”. It will start to feel static.` })

  const conflict = longestRun(scenes.map((s) => norm(s.plan?.conflict)))
  if (conflict.len >= 3) out.push({ level: 'pattern', text: `The same conflict repeats for ${conflict.len} chapters. If it is not rising, the middle will sag.` })

  const turn = longestRun(scenes.map((s) => norm(s.plan?.turn)))
  if (turn.len >= 3) out.push({ level: 'pattern', text: `${turn.len} chapters turn the same way. Vary the direction.` })

  return out
}

/** How many words a day it takes to land on the finish date. */
export function pace(target: number, written: number, finishBy: string, today = new Date()) {
  const end = new Date(`${finishBy}T23:59:59`)
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const days = Math.max(0, Math.floor((end.getTime() - startOfToday.getTime()) / 86_400_000) + 1)
  const remaining = Math.max(0, target - written)
  return { days, remaining, perDay: days > 0 ? Math.ceil(remaining / days) : remaining }
}

import type { DBCore, DBCoreMutateRequest, DBCoreTable, DBCoreTransaction, Middleware } from 'dexie'
import type { Change, Character, Scene, Story } from './types'
import { countTextWords, countWords } from './words'

/**
 * What has changed since the last backup file, so safekeeping can say so plainly.
 *
 * Every write to a table that goes into a backup passes through the middleware below, which notes the
 * change in the same transaction. A backup read in one transaction therefore sees the data and the notes
 * together. Each note takes a number from one counter that only goes up, and a backup file holds every
 * change numbered at or below the counter as it stood when the file was read.
 */

/** Tables a backup file holds. The writing-day tally goes in too, but it only moves when a chapter does. */
const TRACKED = new Set(['folders', 'stories', 'scenes', 'characters', 'snapshots', 'drawer'])
/** The counter, kept in the meta table. */
export const CHANGE_REV = 'changeRev'

export const changeKey = (table: string, id: string) => `${table}:${id}`

const text = (...xs: unknown[]) => xs.filter((x): x is string => typeof x === 'string').join('\n')

/** The writer's own words in a record, roughly. Snapshots copy text already counted, and the drawer holds work moved there. */
function wordsIn(table: string, row: unknown): number {
  if (!row || typeof row !== 'object') return 0
  if (table === 'scenes') {
    const s = row as Scene
    const d = s.dialogue ?? {}
    const speakers = (d.speakers ?? []).flatMap((p) => [p.name, p.want, p.unsaid, p.unsayable])
    const prep = text(d.object, d.opens, d.closes, d.underneath, d.knowsMore, d.script, ...speakers)
    return (Number(s.words) || 0) + countTextWords(text(s.title, s.summary, ...Object.values(s.plan ?? {}), prep))
  }
  if (table === 'characters') {
    const c = row as Character
    const fields = Array.isArray(c.fields) ? c.fields.map((f) => f.value) : []
    return countWords(text(c.bio)) + countTextWords(text(c.name, c.role, ...fields, ...Object.values(c.craft ?? {})))
  }
  if (table === 'stories') {
    const s = row as Story
    return countTextWords(text(s.title, s.synopsis))
  }
  return 0
}

/** Whether two versions of a record differ in more than the time they were last touched. */
const differs = (a: Record<string, unknown>, b: Record<string, unknown>) =>
  Object.keys({ ...a, ...b }).some((k) => k !== 'updatedAt' && JSON.stringify(a[k]) !== JSON.stringify(b[k]))

/** Transactions opened by the app that write to a tracked table. Database upgrades never pass through here. */
const watched = new WeakSet<DBCoreTransaction>()
/** Transactions that move work to or from the drawer, or restore a backup. They add no new writing. */
const moving = new WeakSet<DBCoreTransaction>()

export const changeTracking: Middleware<DBCore> = {
  stack: 'dbcore',
  name: 'ChangeTracking',
  create: (down) => ({
    transaction(stores, mode, options) {
      if (mode !== 'readwrite' || !stores.some((s) => TRACKED.has(s))) return down.transaction(stores, mode, options)
      const trans = down.transaction([...new Set([...stores, 'changes', 'meta'])], mode, options)
      watched.add(trans)
      if (stores.includes('drawer')) moving.add(trans)
      return trans
    },
    table(name) {
      const table = down.table(name)
      if (!TRACKED.has(name)) return table
      return { ...table, mutate: (req) => (watched.has(req.trans) ? mutateAndNote(down, table, req) : table.mutate(req)) }
    },
  }),
}

async function mutateAndNote(down: DBCore, table: DBCoreTable, req: DBCoreMutateRequest) {
  const { trans } = req
  const ids: string[] =
    req.type === 'deleteRange' ? ['*'] : req.type === 'delete' ? req.keys : (req.keys ?? req.values.map((v) => table.schema.primaryKey.extractKey!(v)))
  const before: unknown[] = req.type === 'put' ? await table.getMany({ trans, keys: ids }) : []
  const after: readonly unknown[] = req.type === 'put' || req.type === 'add' ? req.values : []
  const res = await table.mutate(req)

  const changed = ids.flatMap((id, i) => {
    const [was, now] = [before[i], after[i]]
    if (was && now && !differs(was as Record<string, unknown>, now as Record<string, unknown>)) return []
    return [{ id, added: moving.has(trans) ? 0 : Math.max(0, wordsIn(table.name, now) - wordsIn(table.name, was)) }]
  })
  if (!changed.length) return res

  const meta = down.table('meta')
  const notes = down.table('changes')
  const rev = (((await meta.get({ trans, key: CHANGE_REV })) as { value: number } | undefined)?.value ?? 0) + 1
  const keys = changed.map((c) => changeKey(table.name, c.id))
  const old = (await notes.getMany({ trans, keys })) as (Change | undefined)[]
  const values: Change[] = changed.map((c, i) => {
    const was = old[i] ?? { since: rev, added: 0, held: 0 }
    return { key: keys[i], table: table.name, id: c.id, rev, since: was.since, added: was.added + c.added, held: was.held }
  })
  await notes.mutate({ trans, type: 'put', values })
  await meta.mutate({ trans, type: 'put', values: [{ key: CHANGE_REV, value: rev }] })
  return res
}

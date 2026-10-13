import type { DBCore, DBCoreMutateRequest, Middleware } from 'dexie'
import type { Scene, SceneRef } from './types'

/**
 * Every chapter without its text, kept in the `chapters` table beside the manuscripts in `scenes`. The tree,
 * the tabs and the home screen read `chapters`: a save re-runs their live queries, and a hundred small rows
 * are cheap to read where a hundred manuscripts are not. Every write to `scenes` passes through here and
 * mirrors itself in the same transaction. Database upgrades do not pass through middleware, so an upgrade
 * that changes chapters has to update `chapters` itself.
 */
export const refOf = ({ id, storyId, title, status, order, words, updatedAt }: Scene): SceneRef => ({ id, storyId, title, status, order, words, updatedAt })

export const chapterMirror: Middleware<DBCore> = {
  stack: 'dbcore',
  name: 'ChapterMirror',
  create: (down) => ({
    transaction: (stores, mode, options) =>
      down.transaction(mode === 'readwrite' && stores.includes('scenes') && !stores.includes('chapters') ? [...stores, 'chapters'] : stores, mode, options),
    table(name) {
      const table = down.table(name)
      if (name !== 'scenes') return table
      return {
        ...table,
        mutate: async (req: DBCoreMutateRequest) => {
          const res = await table.mutate(req)
          const mirror = down.table('chapters')
          if (req.type === 'add' || req.type === 'put') await mirror.mutate({ trans: req.trans, type: 'put', values: (req.values as Scene[]).map(refOf) })
          else if (req.type === 'delete') await mirror.mutate({ trans: req.trans, type: 'delete', keys: req.keys })
          else await mirror.mutate({ trans: req.trans, type: 'deleteRange', range: req.range })
          return res
        },
      }
    },
  }),
}

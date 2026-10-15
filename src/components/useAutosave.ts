import { useEffect, useRef, useState } from 'react'

/**
 * A record edited as the writer types and saved half a second after they stop, and on leaving. Only the fields that
 * changed are written, so an edit here never puts back an older copy of a field changed somewhere else. The writer
 * passes `update`, not `put`, so a late save never brings back a record that was moved to the drawer.
 */
export function useAutosave<T extends { id: string }>(initial: T, write: (id: string, patch: Partial<T>) => Promise<unknown>): [T, (patch: Partial<T>) => void, () => Promise<unknown>] {
  const [value, setValue] = useState(initial)
  const pending = useRef<Partial<T>>({})
  const timer = useRef<number | undefined>(undefined)
  const writeRef = useRef(write)
  writeRef.current = write
  const id = initial.id

  const flush = () => {
    window.clearTimeout(timer.current)
    const patch = pending.current
    pending.current = {}
    return Object.keys(patch).length ? writeRef.current(id, patch) : Promise.resolve()
  }
  const update = (patch: Partial<T>) => {
    pending.current = { ...pending.current, ...patch }
    setValue((v) => ({ ...v, ...patch }))
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(flush, 500)
  }
  useEffect(() => () => void flush(), []) // eslint-disable-line react-hooks/exhaustive-deps
  return [value, update, flush]
}

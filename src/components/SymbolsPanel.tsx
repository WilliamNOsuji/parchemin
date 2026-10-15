import { useLiveQuery } from 'dexie-react-hooks'
import { useEffect, useRef, useState } from 'react'
import { symbolName, WEB_COPY } from '../craft/web'
import { createSymbol, db, deleteSymbol } from '../db'
import type { Story, StorySymbol } from '../types'
import { GrowingText } from './GrowingText'
import { Icon } from './Icons'
import { Section } from './RightSidebar'
import './web-editors.css'

/** One symbol: its name and its line, saved as the writer types. */
function SymbolRow({ symbol, selected }: { symbol: StorySymbol; selected: boolean }) {
  const [s, setS] = useState(symbol)
  const latest = useRef(symbol)
  const timer = useRef<number | undefined>(undefined)
  const dirty = useRef(false)
  const row = useRef<HTMLLIElement>(null)

  const flush = () => {
    window.clearTimeout(timer.current)
    if (!dirty.current) return Promise.resolve()
    dirty.current = false
    const { id, ...changes } = latest.current
    return db.symbols.update(id, { ...changes, updatedAt: Date.now() })
  }
  const update = (patch: Partial<StorySymbol>) => {
    latest.current = { ...latest.current, ...patch }
    dirty.current = true
    setS(latest.current)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(flush, 500)
  }
  useEffect(() => () => void flush(), []) // eslint-disable-line react-hooks/exhaustive-deps
  // a symbol just made, or picked in the Web, is ready to name
  useEffect(() => {
    if (!selected) return
    const name = row.current?.querySelector('textarea')
    name?.scrollIntoView({ block: 'nearest' })
    if (!latest.current.name.trim()) name?.focus()
  }, [selected])

  return (
    <li ref={row} className={`symbol${selected ? ' active' : ''}`}>
      <div className="row between">
        <GrowingText className="symbol-name" aria-label="Symbol" value={s.name} placeholder="Name it: the storm glass, the ledger" onChange={(e) => update({ name: e.target.value.replace(/\n/g, ' ') })}
          // a name is one line: Enter moves on to the line about it
          onKeyDown={(e) => {
            if (e.key !== 'Enter') return
            e.preventDefault()
            row.current?.querySelectorAll('textarea')[1]?.focus()
          }}
        />
        <button
          className="icon-btn"
          aria-label={`Delete ${symbolName(s)}`}
          title="Delete"
          onClick={async () => {
            if (!window.confirm(WEB_COPY.deleteSymbol(symbolName(s)))) return
            window.clearTimeout(timer.current)
            dirty.current = false
            await deleteSymbol(s.id)
          }}
        >
          <Icon name="close" size={12} />
        </button>
      </div>
      <GrowingText aria-label={`What ${symbolName(s)} is to the story`} value={s.note} placeholder="A line: what it stands for, where it comes back" onChange={(e) => update({ note: e.target.value })} />
    </li>
  )
}

/** The story's symbols: things the book returns to, each a name and a line. */
export function SymbolsPanel({ story, selectedId }: { story: Story; selectedId?: string }) {
  const symbols = useLiveQuery(() => db.symbols.where('storyId').equals(story.id).sortBy('createdAt'), [story.id])
  const [made, setMade] = useState<string | undefined>()
  if (!symbols) return null
  return (
    <Section title="Symbols" count={symbols.length || undefined}>
      <p className="hint">{WEB_COPY.symbolsLead}</p>
      {symbols.length === 0 && <p className="hint">{WEB_COPY.noSymbols}</p>}
      <ul className="symbols">
        {symbols.map((s) => <SymbolRow key={s.id} symbol={s} selected={s.id === (made ?? selectedId)} />)}
      </ul>
      <div className="acts">
        <button className="btn small" onClick={async () => setMade(await createSymbol(story.id))}><Icon name="plus" size={12} /> New symbol</button>
      </div>
    </Section>
  )
}

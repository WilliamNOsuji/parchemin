import { useEffect, useMemo, useRef, useState } from 'react'
import { filterCommands, noteCommand, type Command } from '../commands'
import { Icon } from './Icons'

/** Ctrl+P, as in Obsidian. With nothing typed, the last commands used come first. Typing filters by any word in the name. */
export function CommandPalette({ commands, onClose }: { commands: Command[]; onClose: () => void }) {
  const [query, setQuery] = useState('')
  const [sel, setSel] = useState(0)
  const input = useRef<HTMLInputElement>(null)
  const list = useRef<HTMLUListElement>(null)
  const shown = useMemo(() => filterCommands(commands, query).slice(0, 40), [commands, query])
  const [opener] = useState(() => (document.activeElement instanceof HTMLElement ? document.activeElement : null))

  useEffect(() => {
    input.current?.focus()
    return () => {
      if (opener?.isConnected) opener.focus()
    }
  }, [opener])
  useEffect(() => setSel(0), [query])
  useEffect(() => {
    list.current?.children[sel]?.scrollIntoView({ block: 'nearest' })
  }, [sel])

  const run = (c: Command) => {
    noteCommand(c.id)
    onClose()
    c.run()
  }

  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="palette" role="dialog" aria-modal="true" aria-label="Commands">
        <div className="in">
          <Icon name="search" size={16} />
          <input
            ref={input}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command…"
            aria-label="Type a command"
            aria-controls="palette-list"
            aria-activedescendant={shown[sel] ? `cmd-${shown[sel].id}` : undefined}
            role="combobox"
            aria-expanded="true"
            autoComplete="off"
            spellCheck={false}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                e.preventDefault()
                setSel((s) => Math.min(s + 1, shown.length - 1))
              } else if (e.key === 'ArrowUp') {
                e.preventDefault()
                setSel((s) => Math.max(s - 1, 0))
              } else if (e.key === 'Enter') {
                e.preventDefault()
                if (shown[sel]) run(shown[sel])
              } else if (e.key === 'Escape') {
                e.preventDefault()
                e.stopPropagation()
                onClose()
              }
            }}
          />
          <small>Ctrl+P</small>
        </div>
        <ul ref={list} id="palette-list" role="listbox">
          {shown.length === 0 && <li className="none">Nothing by that name. Try another word.</li>}
          {shown.map((c, i) => (
            <li key={c.id} id={`cmd-${c.id}`} role="option" aria-selected={i === sel} className={i === sel ? 'sel' : ''} onMouseEnter={() => setSel(i)} onMouseDown={(e) => e.preventDefault()} onClick={() => run(c)}>
              <span className="ellipsis">{c.label}</span>
              <small>{c.keys ? <kbd>{c.keys}</kbd> : c.hint}</small>
            </li>
          ))}
        </ul>
        <footer><span>↑↓ to move</span><span>Enter to run</span><span>Esc to close</span></footer>
      </div>
    </div>
  )
}

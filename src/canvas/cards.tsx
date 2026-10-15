import { useLiveQuery } from 'dexie-react-hooks'
import { nanoid } from 'nanoid'
import { createContext, useContext, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { Avatar } from '../components/Avatar'
import { GrowingText } from '../components/GrowingText'
import { Icon } from '../components/Icons'
import { Menu } from '../components/Menu'
import { settingName } from '../craft/settings'
import { voiceById } from '../craft/voices'
import { db } from '../db'
import { STATUSES, type Scene } from '../types'
import { COLOR_CHOICES, colorOf, DEFAULT_SIZE, kindOf, pathFor, refOf, type CanvasDoc, type CanvasNode, type CardKind, type LiveKind, type Point } from './types'
import './cards.css'

const GONE = 'No longer in the story'

/** The open story's chapters, from the pane that shows the board, so a chapter card never reads a manuscript itself. */
export const BoardScenes = createContext<Scene[] | null>(null)

/** A new card of a kind, centred on a point. A live card names what it shows by its path. */
export function newNode(kind: CardKind, at: Point, ref?: string): CanvasNode {
  const size = DEFAULT_SIZE[kind]
  const base = { id: nanoid(10), x: Math.round(at.x - size.width / 2), y: Math.round(at.y - size.height / 2), width: size.width, height: size.height }
  if (kind === 'group') return { ...base, type: 'group', label: 'New group' }
  if ((kind === 'chapter' || kind === 'character' || kind === 'setting' || kind === 'image') && ref) return { ...base, type: 'file', file: pathFor(kind as LiveKind, ref) }
  return { ...base, type: 'text', text: '' }
}

/** Puts a node on the board: a group under every card, anything else on top. */
export function addNode(doc: CanvasDoc, node: CanvasNode): CanvasDoc {
  if (node.type !== 'group') return { ...doc, nodes: [...doc.nodes, node] }
  const i = doc.nodes.findIndex((n) => n.type !== 'group')
  const nodes = [...doc.nodes]
  nodes.splice(i < 0 ? nodes.length : i, 0, node)
  return { ...doc, nodes }
}

/** A short label before a colon reads as a label: "Decide before chapter 8: why does the glass clear?" */
function NoteText({ text }: { text: string }) {
  const m = /^([^\n:]{1,40}:)\s/.exec(text)
  if (!m) return <p className="note-text">{text}</p>
  return (
    <p className="note-text">
      <span>{m[1]}</span> {text.slice(m[0].length)}
    </p>
  )
}

function Head({ lead, title, sub }: { lead: ReactNode; title: ReactNode; sub: ReactNode }) {
  return (
    <div className="cc-head">
      {lead}
      <div>
        <b>{title}</b>
        <small>{sub}</small>
      </div>
    </div>
  )
}

const Gone = ({ kind }: { kind: string }) => (
  <div className={`cc ${kind} gone`}>
    <p>{GONE}</p>
  </div>
)

function CharacterCard({ id, style }: { id: string; style?: CSSProperties }) {
  const c = useLiveQuery(async () => (await db.characters.get(id)) ?? null, [id])
  if (c === undefined) return <div className="cc char" style={style} />
  if (c === null) return <Gone kind="char" />
  const voice = voiceById(c.craft?.voice)
  const want = c.craft?.wantInRoom?.trim() || voice?.want
  return (
    <div className="cc char" style={style}>
      <Head lead={<Avatar c={c} />} title={c.name.trim() || 'Unnamed'} sub={[c.role.trim(), voice?.name].filter(Boolean).join(' · ') || 'No role yet'} />
      {want && <p>{want}</p>}
    </div>
  )
}

function ChapterCard({ id, picked, style }: { id: string; picked: boolean; style?: CSSProperties }) {
  // the board's pane hands down the story's chapters, read once; on its own, the card reads its chapter
  const scenes = useContext(BoardScenes)
  const own = useLiveQuery(async () => {
    if (scenes) return undefined
    const s = await db.scenes.get(id)
    if (!s) return null
    const refs = await db.chapters.where('storyId').equals(s.storyId).sortBy('order')
    return { s, n: refs.findIndex((r) => r.id === id) + 1 }
  }, [id, !!scenes])
  const i = scenes ? scenes.findIndex((s) => s.id === id) : -1
  const row = scenes ? (i < 0 ? null : { s: scenes[i], n: i + 1 }) : own
  const [draft, setDraft] = useState<string | null>(null)
  const timer = useRef<number | undefined>(undefined)
  const pending = useRef<string | null>(null)
  const save = () => {
    window.clearTimeout(timer.current)
    const v = pending.current
    pending.current = null
    // update, not put: a summary saved late must not bring back a chapter set aside
    if (v !== null) void db.scenes.update(id, { summary: v })
  }
  useEffect(() => () => save(), []) // eslint-disable-line react-hooks/exhaustive-deps
  if (row === undefined) return <div className="cc chapter" style={style} />
  if (row === null) return <Gone kind="chapter" />
  const { s, n } = row
  const status = STATUSES.find((x) => x.id === s.status)?.label ?? 'Draft'
  const summary = draft ?? s.summary
  return (
    <div className={`cc chapter ${s.status}`} style={style}>
      <Head lead={<span className={`dot ${s.status}`} />} title={`${n} · ${s.title.trim() || 'Untitled'}`} sub={`${status} · ${s.words.toLocaleString()} ${s.words === 1 ? 'word' : 'words'}`} />
      {picked ? (
        // the summary is the outline's: change it here and the outline changes
        <GrowingText
          className="cc-text"
          aria-label={`What happens in chapter ${n}`}
          value={summary}
          placeholder="What happens in this chapter?"
          onChange={(e) => {
            setDraft(e.target.value)
            pending.current = e.target.value
            window.clearTimeout(timer.current)
            timer.current = window.setTimeout(save, 600)
          }}
          onBlur={() => {
            save()
            setDraft(null)
          }}
        />
      ) : summary ? (
        <p>{summary}</p>
      ) : (
        <p className="empty">No summary yet.</p>
      )}
    </div>
  )
}

function SettingCard({ id, style }: { id: string; style?: CSSProperties }) {
  const s = useLiveQuery(async () => (await db.settings.get(id)) ?? null, [id])
  if (s === undefined) return <div className="cc setting" style={style} />
  if (s === null) return <Gone kind="setting" />
  return (
    <div className="cc setting" style={style}>
      <Head lead={<Icon name="place" size={16} style={{ color: 'var(--place)' }} />} title={settingName(s)} sub="setting" />
      {s.hard.trim() && <p><span>Hard because:</span> {s.hard}</p>}
      {s.props.length > 0 && <p><span>Props:</span> {s.props.join(', ')}</p>}
      {!s.hard.trim() && !s.props.length && <p className="empty">What makes it hard here?</p>}
    </div>
  )
}

/** A line of text edited where it sits: double-click, type, Enter keeps it, Escape leaves it. */
function InPlace({ value, label, onSave, children }: { value: string; label: string; onSave: (v: string) => void; children: (edit: () => void) => ReactNode }) {
  const [editing, setEditing] = useState(false)
  if (!editing) return <>{children(() => setEditing(true))}</>
  return (
    <input
      className="cc-inplace"
      autoFocus
      aria-label={label}
      defaultValue={value}
      onFocus={(e) => e.currentTarget.select()}
      onKeyDown={(e) => {
        if (e.key === 'Enter') e.currentTarget.blur()
        else if (e.key === 'Escape') {
          e.stopPropagation()
          e.currentTarget.value = value
          e.currentTarget.blur()
        }
      }}
      onBlur={(e) => {
        setEditing(false)
        if (e.currentTarget.value !== value) onSave(e.currentTarget.value)
      }}
    />
  )
}

function ImageCard({ id, style }: { id: string; style?: CSSProperties }) {
  const img = useLiveQuery(async () => (await db.images.get(id)) ?? null, [id])
  if (img === undefined) return <div className="cc image" style={style} />
  if (img === null) return <Gone kind="image" />
  return (
    <div className="cc image" style={style}>
      <img src={img.data} alt={img.name} draggable={false} />
      <InPlace value={img.name} label="Caption" onSave={(name) => void db.images.update(id, { name: name.trim() })}>
        {(edit) => <small onDoubleClick={(e) => (e.stopPropagation(), edit())} title="Double-click to change the caption">{img.name || 'A picture'}</small>}
      </InPlace>
    </div>
  )
}

function NoteCard({ node, picked, style, onChange }: { node: Extract<CanvasNode, { type: 'text' }>; picked: boolean; style?: CSSProperties; onChange: (patch: Partial<CanvasNode>) => void }) {
  const [editing, setEditing] = useState(false)
  useEffect(() => {
    if (!picked) setEditing(false)
  }, [picked])
  const question = node.color === '2' || node.color === '3'
  return (
    <div
      className={`cc${question ? ' question' : ''}`}
      style={style}
      onDoubleClick={(e) => {
        // writing in place is enough; the sidebar stays as it is
        e.stopPropagation()
        setEditing(true)
      }}
    >
      {editing ? (
        <GrowingText className="cc-text" autoFocus aria-label="Note" value={node.text} placeholder="Write a note" onChange={(e) => onChange({ text: e.target.value })} onBlur={() => setEditing(false)}
          onKeyDown={(e) => {
            if (e.key !== 'Escape') return
            e.stopPropagation()
            e.currentTarget.blur()
          }}
        />
      ) : node.text.trim() ? (
        <NoteText text={node.text} />
      ) : (
        <p className="empty">Double-click to write.</p>
      )}
    </div>
  )
}

/** One card on a board, drawn by what it is. Live cards read the story as it is now; nothing here writes to the manuscript. */
export function Card({ node, picked, onChange }: { node: CanvasNode; picked: boolean; onChange: (patch: Partial<CanvasNode>) => void }) {
  const kind = kindOf(node)
  const ref = refOf(node)
  const color = colorOf(node.color)
  const style = color ? ({ borderColor: color } as CSSProperties) : undefined
  switch (kind) {
    case 'character':
      return <CharacterCard id={ref!} style={style} />
    case 'chapter':
      return <ChapterCard id={ref!} picked={picked} style={style} />
    case 'setting':
      return <SettingCard id={ref!} style={style} />
    case 'image':
      return <ImageCard id={ref!} style={style} />
    case 'group':
      return (
        <div className="cc group" style={style}>
          <InPlace value={node.type === 'group' ? (node.label ?? '') : ''} label="Group name" onSave={(label) => onChange({ label: label.trim() } as Partial<CanvasNode>)}>
            {(edit) => <span className="g-label" onDoubleClick={(e) => (e.stopPropagation(), edit())} style={color ? { color } : undefined}>{(node.type === 'group' && node.label?.trim()) || 'Group'}</span>}
          </InPlace>
        </div>
      )
    case 'note':
      return node.type === 'text' ? <NoteCard node={node} picked={picked} style={style} onChange={onChange} /> : null
    case 'link':
      return (
        <div className="cc link" style={style}>
          <p className="mono">{node.type === 'link' ? node.url : ''}</p>
        </div>
      )
    default:
      return (
        <div className="cc file" style={style}>
          <p className="mono">{node.type === 'file' ? node.file : ''}</p>
          <p className="empty">A file from another app. It is kept as it is.</p>
        </div>
      )
  }
}

const OPEN_LABEL: Partial<Record<CardKind, string>> = { chapter: 'Open the chapter', character: 'Open on the Cast page', setting: 'Open the setting' }
const SWATCH: Record<string, string> = { '3': 'Yellow', '4': 'Green', '5': 'Teal', '6': 'Violet' }

/** The bar over a picked card: its colour, the way to its page, and the rest under ⋯. Same size on screen at any zoom. */
export function CardBar({ node, zoom, onColor, onOpen, onDuplicate, onRemove }: { node: CanvasNode; zoom: number; onColor: (color: string | undefined) => void; onOpen?: () => void; onDuplicate: () => void; onRemove: () => void }) {
  const [colours, setColours] = useState(false)
  const kind = kindOf(node)
  const open = OPEN_LABEL[kind]
  const current = colorOf(node.color)
  return (
    <div
      className="cc-bar"
      style={{ left: node.x, top: node.y - 8 / zoom, transform: `translateY(-100%) scale(${1 / zoom})` }}
      onPointerDown={(e) => e.stopPropagation()}
      onDoubleClick={(e) => e.stopPropagation()}
    >
      {/* the dot shows the colour; the word beside it is the control the keyboard reaches */}
      <button className="swatch" style={{ background: current ?? 'var(--border)' }} tabIndex={-1} aria-hidden onClick={() => setColours((c) => !c)} />
      {colours ? (
        <span className="cc-colours" role="group" aria-label="Colours">
          <button className={`swatch none${!node.color ? ' on' : ''}`} aria-label="No colour" aria-pressed={!node.color} onClick={() => onColor(undefined)} />
          {COLOR_CHOICES.map((c) => (
            <button key={c} className={`swatch${node.color === c ? ' on' : ''}`} style={{ background: colorOf(c)! }} aria-label={SWATCH[c]} aria-pressed={node.color === c} onClick={() => onColor(c)} />
          ))}
        </span>
      ) : (
        <>
          {open && onOpen && <button onClick={onOpen}>{open}</button>}
          <button aria-expanded={false} onClick={() => setColours(true)}>Colour</button>
        </>
      )}
      <Menu
        label="More"
        items={[
          { label: 'Duplicate', onClick: onDuplicate },
          { label: 'Remove from the board', onClick: onRemove },
        ]}
      />
    </div>
  )
}

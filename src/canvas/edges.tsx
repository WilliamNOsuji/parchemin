import { nanoid } from 'nanoid'
import { useId, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react'
import { anchor, edgePath, nearestSide } from './edgePath'
import { colorOf, type CanvasDoc, type CanvasEdge, type CanvasSide, type Layer, type Point } from './types'
import './edges.css'

const SIDES: CanvasSide[] = ['top', 'right', 'bottom', 'left']

interface Props {
  doc: CanvasDoc
  layer: Layer
  picked: string[]
  onPick: (id: string, additive: boolean) => void
  onChange: (doc: CanvasDoc) => void
}

function withLabel(e: CanvasEdge, label: string): CanvasEdge {
  const next = { ...e }
  if (label) next.label = label
  else delete next.label
  return next
}

/** The arrow's label, typed where it sits on the board. Enter keeps it, Escape leaves it as it was. */
function LabelInput({ at, value, onDone }: { at: Point; value: string; onDone: (label: string | null) => void }) {
  const done = useRef(false)
  const finish = (label: string | null) => {
    if (done.current) return
    done.current = true
    onDone(label)
  }
  return (
    <foreignObject x={at.x - 90} y={at.y - 14} width={180} height={28}>
      <input
        className="edge-input"
        autoFocus
        defaultValue={value}
        aria-label="Name this arrow"
        placeholder="Name this arrow"
        onFocus={(e) => e.currentTarget.select()}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            finish(e.currentTarget.value.trim())
          } else if (e.key === 'Escape') {
            e.preventDefault()
            e.stopPropagation()
            finish(null)
          }
        }}
        onBlur={(e) => finish(e.currentTarget.value.trim())}
      />
    </foreignObject>
  )
}

/**
 * The arrows of a board, drawn in the board's own coordinates under the cards. Each has a wide invisible path to pick
 * it by, with the pointer or Tab, and a name the writer gives it, edited where it sits.
 */
export function EdgeLayer({ doc, layer, picked, onPick, onChange }: Props) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const [editing, setEditing] = useState<string | null>(null)
  const pickedSet = new Set(picked)
  // one arrowhead per colour in use, so a coloured arrow ends in its own colour
  const colours = [...new Set(doc.edges.map((e) => colorOf(e.color)).filter((c): c is string => !!c))]
  const marker = (e: CanvasEdge) => {
    if (pickedSet.has(e.id)) return `url(#arr-on${uid})`
    const c = colorOf(e.color)
    return c ? `url(#arr${colours.indexOf(c)}${uid})` : `url(#arr${uid})`
  }
  const head = (id: string, fill?: string, className?: string) => (
    <marker key={id} id={id} className={className} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0 0 L10 5 L0 10 z" style={fill ? { fill } : undefined} />
    </marker>
  )
  const name = (e: CanvasEdge) => `Arrow${e.label ? ` "${e.label}"` : ''}`
  const commit = (id: string, label: string | null) => {
    setEditing(null)
    if (label !== null) {
      const edge = doc.edges.find((x) => x.id === id)
      if (edge && (edge.label ?? '') !== label) onChange({ ...doc, edges: doc.edges.map((x) => (x.id === id ? withLabel(x, label) : x)) })
    }
    // the keyboard goes back to the arrow it was on
    requestAnimationFrame(() => document.querySelector<SVGElement>(`[data-edge-id="${id}"] .hit`)?.focus({ preventScroll: true }))
  }
  const down = (id: string) => (e: PointerEvent<SVGElement>) => {
    if (e.button !== 0) return
    e.stopPropagation()
    onPick(id, e.shiftKey)
  }
  const key = (id: string) => (e: KeyboardEvent<SVGElement>) => {
    if (e.key === 'F2' || (e.key === 'Enter' && !e.shiftKey && picked.length === 1 && picked[0] === id)) {
      e.preventDefault()
      setEditing(id)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      onPick(id, e.shiftKey)
    }
  }

  return (
    <svg className="edges" width={1} height={1} role="group" aria-label="Arrows">
      <defs>
        {head(`arr${uid}`)}
        {head(`arr-on${uid}`, undefined, 'on')}
        {colours.map((c, i) => head(`arr${i}${uid}`, c))}
      </defs>
      {doc.edges.map((e) => {
        const a = layer.rects.get(e.fromNode)
        const b = layer.rects.get(e.toNode)
        if (!a || !b) return null
        const { d, mid } = edgePath(a, e.fromSide, b, e.toSide)
        const on = pickedSet.has(e.id)
        const c = colorOf(e.color)
        const m = marker(e)
        return (
          <g key={e.id} className={`edge${on ? ' picked' : ''}`} data-edge-id={e.id}>
            <path className="line" d={d} style={c && !on ? { stroke: c } : undefined} markerEnd={(e.toEnd ?? 'arrow') === 'arrow' ? m : undefined} markerStart={(e.fromEnd ?? 'none') === 'arrow' ? m : undefined} />
            <path
              className="hit"
              d={d}
              tabIndex={0}
              role="button"
              aria-pressed={on}
              aria-label={name(e)}
              onPointerDown={down(e.id)}
              onDoubleClick={(ev) => {
                ev.stopPropagation()
                setEditing(e.id)
              }}
              onKeyDown={key(e.id)}
            />
            {editing === e.id ? (
              <LabelInput at={mid} value={e.label ?? ''} onDone={(label) => commit(e.id, label)} />
            ) : e.label ? (
              <text
                x={mid.x}
                y={mid.y}
                textAnchor="middle"
                dominantBaseline="central"
                onPointerDown={down(e.id)}
                onDoubleClick={(ev) => {
                  ev.stopPropagation()
                  setEditing(e.id)
                }}
              >
                {e.label}
              </text>
            ) : null}
          </g>
        )
      })}
    </svg>
  )
}

interface Draft {
  from: string
  side: CanvasSide
  pointer: number
  to: Point
}

/**
 * Drawing a new arrow: four handles on the sides of the picked card, and the line that follows the pointer from one
 * of them. Let go over another card and the arrow is made, pointing at it; let go anywhere else and nothing is.
 */
export function useEdgeDraft(doc: CanvasDoc, layer: Layer, onChange: (doc: CanvasDoc) => void): { handles: (nodeId: string) => ReactNode; draft: ReactNode } {
  const [draft, setDraft] = useState<Draft | null>(null)
  const latest = useRef({ doc, layer, onChange })
  latest.current = { doc, layer, onChange }

  const start = (from: string, side: CanvasSide) => (e: PointerEvent<HTMLSpanElement>) => {
    if (e.button !== 0) return
    e.stopPropagation()
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)
    setDraft({ from, side, pointer: e.pointerId, to: latest.current.layer.toWorld({ x: e.clientX, y: e.clientY }) })
  }
  const move = (e: PointerEvent<HTMLSpanElement>) => {
    if (!draft || draft.pointer !== e.pointerId) return
    setDraft({ ...draft, to: latest.current.layer.toWorld({ x: e.clientX, y: e.clientY }) })
  }
  const end = (e: PointerEvent<HTMLSpanElement>) => {
    if (!draft || draft.pointer !== e.pointerId) return
    setDraft(null)
    const { doc, layer, onChange } = latest.current
    const target = document.elementFromPoint(e.clientX, e.clientY)?.closest<HTMLElement>('[data-node-id]')?.dataset.nodeId
    const rect = target ? layer.rects.get(target) : undefined
    if (!target || target === draft.from || !rect) return
    const at = layer.toWorld({ x: e.clientX, y: e.clientY })
    const edge: CanvasEdge = { id: nanoid(10), fromNode: draft.from, fromSide: draft.side, toNode: target, toSide: nearestSide(rect, at), toEnd: 'arrow' }
    onChange({ ...doc, edges: [...doc.edges, edge] })
  }

  const handles = (nodeId: string) => {
    const r = layer.rects.get(nodeId)
    if (!r) return null
    return SIDES.map((side) => {
      const p = anchor(r, side)
      return (
        <span
          key={`${nodeId}-${side}`}
          className={`edge-hd ${side}`}
          style={{ left: p.x, top: p.y }}
          title="Drag to another card to draw an arrow"
          onPointerDown={start(nodeId, side)}
          onPointerMove={move}
          onPointerUp={end}
          onPointerCancel={() => setDraft(null)}
        />
      )
    })
  }

  let path: ReactNode = null
  if (draft) {
    const r = layer.rects.get(draft.from)
    if (r) {
      const { d } = edgePath(r, draft.side, { ...draft.to, width: 0, height: 0 }, undefined)
      path = (
        <svg className="edge-draft" width={1} height={1} aria-hidden>
          <path d={d} />
        </svg>
      )
    }
  }
  return { handles, draft: path }
}

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import type { Point } from '../canvas/types'
import { clampZoom, ZoomBar } from '../components/ZoomBar'
import { LINK_COLOR } from '../craft/web'
import { layout } from './layout'
import type { WebEdge, WebFilters, WebKind, WebNode } from './types'
import './web.css'

interface View {
  x: number
  y: number
  zoom: number
}

const KIND_NAME: Record<WebKind, string> = { core: 'core idea', char: 'character', set: 'setting', sym: 'symbol', ch: 'chapter', board: 'board' }
const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
/** The layout is redone only when the space changes by more than this, so a sidebar opening does not reshuffle the Web. */
const RELAYOUT = 0.15
/** The legend floats over the right of a wide graph, so the nodes are laid out and fitted beside it. */
const beside = (w: number) => (w >= 700 ? 250 : 0)

interface Props {
  nodes: WebNode[]
  edges: WebEdge[]
  picked?: string | null
  onPick: (key: string | null) => void
  onOpen?: (key: string) => void
}

/** The Web drawn as Obsidian draws its graph: lines first, then the nodes with their labels. Pan, zoom and pick. */
export function Graph({ nodes, edges, picked = null, onPick, onOpen }: Props) {
  const svg = useRef<SVGSVGElement>(null)
  const [size, setSize] = useState<{ w: number; h: number } | null>(null)
  const [space, setSpace] = useState<{ w: number; h: number } | null>(null)
  const [view, setView] = useState<View>({ x: 0, y: 0, zoom: 1 })
  const [fitting, setFitting] = useState(false)
  const viewRef = useRef(view)
  viewRef.current = view
  const pick = useRef(onPick)
  pick.current = onPick
  const open = useRef(onOpen)
  open.current = onOpen

  useLayoutEffect(() => {
    const el = svg.current
    if (!el) return
    const measure = () => {
      const r = el.getBoundingClientRect()
      if (!r.width || !r.height) return
      setSize({ w: r.width, h: r.height })
      setSpace((s) => (!s || Math.abs(r.width - s.w) / s.w > RELAYOUT || Math.abs(r.height - s.h) / s.h > RELAYOUT ? { w: r.width, h: r.height } : s))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // the layout follows the shape of the Web, not the identity of the arrays, so an unrelated save does not move a node
  const shape = useMemo(() => nodes.map((n) => n.key).join(' ') + '\n' + edges.map((e) => `${e.from}>${e.to}:${e.kind}${e.weight}`).join(' '), [nodes, edges])
  const prev = useRef<Map<string, Point>>(new Map())
  const positions = useMemo(
    () => (space ? layout(nodes, edges, { width: space.w - beside(space.w), height: space.h, prev: prev.current }) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [shape, space],
  )
  useEffect(() => {
    if (positions) prev.current = positions
  }, [positions])

  const fit = useCallback(
    (animate: boolean) => {
      if (!positions || !size || !positions.size) return
      let x0 = Infinity
      let y0 = Infinity
      let x1 = -Infinity
      let y1 = -Infinity
      for (const n of nodes) {
        const p = positions.get(n.key)
        if (!p) continue
        // room for the label under the node and on either side of it
        x0 = Math.min(x0, p.x - 60)
        x1 = Math.max(x1, p.x + 60)
        y0 = Math.min(y0, p.y - n.r - 6)
        y1 = Math.max(y1, p.y + n.r + 18)
      }
      if (!Number.isFinite(x0)) return
      const pad = 16
      const w = size.w - beside(size.w)
      const zoom = clampZoom(Math.min((w - 2 * pad) / (x1 - x0), (size.h - 2 * pad) / (y1 - y0), 1.5))
      const next = { zoom, x: (w - (x1 - x0) * zoom) / 2 - x0 * zoom, y: (size.h - (y1 - y0) * zoom) / 2 - y0 * zoom }
      setFitting(animate && !reducedMotion())
      setView(next)
    },
    [positions, size, nodes],
  )

  // the first time the Web is drawn, it fits the pane, and again when the pane changes shape enough to lay it out anew
  const fitted = useRef(false)
  useEffect(() => {
    fitted.current = false
  }, [space])
  useEffect(() => {
    if (!fitted.current && positions && size && positions.size) {
      fitted.current = true
      fit(false)
    }
  }, [positions, size, fit])

  const zoomAt = useCallback((p: Point, z: number) => {
    const v = viewRef.current
    const zoom = clampZoom(z)
    setFitting(false)
    setView({ zoom, x: p.x - (p.x - v.x) * (zoom / v.zoom), y: p.y - (p.y - v.y) * (zoom / v.zoom) })
  }, [])

  // React's onWheel is passive, so the page would scroll too: the listener is added by hand
  useEffect(() => {
    const el = svg.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const r = el.getBoundingClientRect()
      if (e.ctrlKey || e.metaKey) {
        zoomAt({ x: e.clientX - r.left, y: e.clientY - r.top }, viewRef.current.zoom * Math.exp(-e.deltaY * 0.002))
      } else {
        setFitting(false)
        setView((v) => ({ ...v, x: v.x - e.deltaX, y: v.y - e.deltaY }))
      }
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [zoomAt])

  const drag = useRef<{ id: number; x: number; y: number; vx: number; vy: number; moved: boolean } | null>(null)
  const onPointerDown = (e: PointerEvent<SVGSVGElement>) => {
    if (e.button !== 0 || (e.target as Element).closest('.n')) return
    e.currentTarget.setPointerCapture(e.pointerId)
    drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY, vx: view.x, vy: view.y, moved: false }
  }
  const onPointerMove = (e: PointerEvent<SVGSVGElement>) => {
    const d = drag.current
    if (!d || d.id !== e.pointerId) return
    const dx = e.clientX - d.x
    const dy = e.clientY - d.y
    if (!d.moved && Math.hypot(dx, dy) < 4) return
    d.moved = true
    setFitting(false)
    setView((v) => ({ ...v, x: d.vx + dx, y: d.vy + dy }))
  }
  const onPointerUp = (e: PointerEvent<SVGSVGElement>) => {
    const d = drag.current
    if (!d || d.id !== e.pointerId) return
    drag.current = null
    if (!d.moved) pick.current(null)
  }

  const content = useMemo(() => {
    if (!positions) return null
    const near = new Set<string>()
    if (picked) {
      near.add(picked)
      for (const e of edges) {
        if (e.from === picked) near.add(e.to)
        if (e.to === picked) near.add(e.from)
      }
    }
    const onKey = (key: string) => (e: KeyboardEvent<SVGGElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        pick.current(key)
      }
    }
    return (
      <>
        {edges.map((e) => {
          const a = positions.get(e.from)
          const b = positions.get(e.to)
          if (!a || !b) return null
          const hot = !!picked && (e.from === picked || e.to === picked)
          return <line key={`${e.from}>${e.to}:${e.kind}`} className={`e ${e.kind}${hot ? ' hot' : ''}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} strokeWidth={e.kind === 't' ? e.weight * 0.9 + 0.6 : 1.5} />
        })}
        {nodes.map((n) => {
          const p = positions.get(n.key)
          if (!p) return null
          const on = n.key === picked
          const cls = ['n', n.kind, on && 'picked', picked && (near.has(n.key) ? 'near' : 'far'), n.warn && 'warn', n.orphan && 'orphan'].filter(Boolean).join(' ')
          return (
            <g
              key={n.key}
              className={cls}
              data-key={n.key}
              tabIndex={0}
              role="button"
              aria-pressed={on}
              aria-label={`${n.label}, ${KIND_NAME[n.kind]}`}
              onClick={() => pick.current(n.key)}
              onDoubleClick={() => open.current?.(n.key)}
              onKeyDown={onKey(n.key)}
            >
              <circle className="fr" cx={p.x} cy={p.y} r={n.r + (n.warn ? 9 : 4)} />
              <circle cx={p.x} cy={p.y} r={n.r} />
              {n.warn && <circle className="ring" cx={p.x} cy={p.y} r={n.r + 5} />}
              <text x={p.x} y={p.y + n.r + 13} textAnchor="middle">{n.label}</text>
            </g>
          )
        })}
      </>
    )
  }, [positions, nodes, edges, picked])

  return (
    <>
      <svg
        ref={svg}
        className="graph"
        aria-label="The Web of this story"
        role="group"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (drag.current = null)}
        onKeyDown={(e) => {
          if (e.key === 'Escape' && picked) {
            e.stopPropagation()
            pick.current(null)
          }
        }}
      >
        <g className={fitting ? 'world fitting' : 'world'} style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.zoom})` }} onTransitionEnd={() => setFitting(false)}>
          {content}
        </g>
      </svg>
      <ZoomBar zoom={view.zoom} onZoom={(z) => size && zoomAt({ x: size.w / 2, y: size.h / 2 }, z)} onFit={() => fit(true)} />
    </>
  )
}

const LEGEND: { kind: WebKind; label: string; color: string }[] = [
  { kind: 'core', label: 'Core ideas', color: 'var(--accent)' },
  { kind: 'char', label: 'Characters', color: LINK_COLOR.character },
  { kind: 'set', label: 'Settings', color: LINK_COLOR.setting },
  { kind: 'sym', label: 'Symbols', color: LINK_COLOR.symbol },
  { kind: 'ch', label: 'Chapters', color: LINK_COLOR.chapter },
  { kind: 'board', label: 'Boards', color: LINK_COLOR.board },
]

function Switch({ on, label, onChange }: { on: boolean; label: string; onChange: (on: boolean) => void }) {
  return <button className={`switch${on ? ' on' : ''}`} role="switch" aria-checked={on} aria-label={label} onClick={() => onChange(!on)} />
}

/** What the Web shows, and what its lines mean. On a narrow pane it folds into one button. */
export function Legend({ counts, filters, onChange }: { counts: Record<WebKind, number>; filters: WebFilters; onChange: (f: WebFilters) => void }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`gpanel${open ? ' open' : ''}`}>
      <button className="gpanel-toggle" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        Show and threads <span aria-hidden>{open ? '▴' : '▾'}</span>
      </button>
      <div className="gpanel-body">
        <div className="gsec">
          <h5>Show</h5>
          {LEGEND.map((l) => (
            <div className="gline" key={l.kind}>
              <span><i className="gk" style={{ background: l.color }} />{l.label} · {counts[l.kind]}</span>
              <Switch on={filters.show[l.kind]} label={`Show ${l.label.toLocaleLowerCase()}`} onChange={(on) => onChange({ ...filters, show: { ...filters.show, [l.kind]: on } })} />
            </div>
          ))}
        </div>
        <div className="gsec">
          <h5>Threads</h5>
          <p className="gnote">Threads are links you made. Thicker: named by more than one core idea.</p>
          <div className="gline">
            <span>Grey lines: appear together in the text</span>
            <Switch on={filters.cooccurrence} label="Show grey lines" onChange={(on) => onChange({ ...filters, cooccurrence: on })} />
          </div>
        </div>
      </div>
    </div>
  )
}

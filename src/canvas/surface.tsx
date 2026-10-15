import { nanoid } from 'nanoid'
import { memo, useCallback, useEffect, useId, useImperativeHandle, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent, type ReactNode, type Ref, type MouseEvent } from 'react'
import { clampZoom, ZoomBar } from '../components/ZoomBar'
import { bounds, duplicate, fitView, gridStep, intersects, moveBy, movingSet, rectFrom, removeFromDoc, resize, snap, snapResize, type Corner } from './geometry'
import { GRID, inside, kindOf, rectOf, type CanvasDoc, type CanvasNode, type Layer, type Point, type Rect, type View } from './types'
import './surface.css'

export interface CanvasSurfaceHandle {
  /** Shows every card, animated unless the writer asked for less motion. */
  fitAll(): void
  /** Zooms about the middle of the viewport. */
  zoomTo(zoom: number): void
  /** The world point at the middle of the viewport, where a new card goes. */
  center(): Point
}

interface Props {
  doc: CanvasDoc
  onChange: (doc: CanvasDoc) => void
  renderNode: (node: CanvasNode, picked: boolean) => ReactNode
  /** The edge layer, painted under the cards. */
  under?: (l: Layer) => ReactNode
  /** Side handles, the edge draft and the card bar, above the cards. */
  over?: (l: Layer) => ReactNode
  picked: string[]
  onPick: (ids: string[]) => void
  onCreateAt?: (point: Point) => void
  /** A double-click on a card, or Enter on a card already picked. */
  onOpen?: (id: string) => void
  /** Toolbars, in viewport coordinates. */
  children?: ReactNode
  ref?: Ref<CanvasSurfaceHandle>
}

/** A pointer or key on any of these belongs to the field, never to the board. */
const FIELDS = 'input, textarea, select, button, [contenteditable="true"], .cc-bar, .cv-ui'
const CORNERS: Corner[] = ['tl', 'tr', 'bl', 'br']
const KIND_LABEL: Record<string, string> = { note: 'Note', chapter: 'Chapter card', character: 'Character card', setting: 'Setting card', image: 'Picture', group: 'Group', link: 'Link', file: 'File' }
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const ACTIVATE = 4

type Gesture =
  | { kind: 'move'; pointer: number; start: Point; id: string; ids: string[]; additive: boolean; wasPicked: boolean; moved: boolean }
  | { kind: 'resize'; pointer: number; start: Point; id: string; corner: Corner; base: Rect }
  | { kind: 'pan'; pointer: number; start: Point; base: View; moved: boolean }
  | { kind: 'marquee'; pointer: number; start: Point }

/** What is changing under the pointer, drawn live and saved once on release. */
interface Live {
  move?: { ids: Set<string>; dx: number; dy: number }
  resize?: { id: string; rect: Rect }
  marquee?: Rect
}

const Slot = memo(function Slot({ node, rect, picked, render }: { node: CanvasNode; rect: Rect; picked: boolean; render: Props['renderNode'] }) {
  const kind = kindOf(node)
  return (
    <div
      className={`cc-slot${kind === 'group' ? ' group' : ''}${picked ? ' picked' : ''}`}
      data-node-id={node.id}
      tabIndex={0}
      role="group"
      aria-roledescription="card"
      aria-label={KIND_LABEL[kind]}
      style={{ left: rect.x, top: rect.y, width: rect.width, height: rect.height }}
    >
      {render(node, picked)}
      {/* a group is picked by its label or its edges, so the board stays open inside it */}
      {kind === 'group' && (
        <>
          <span className="g-edge t" />
          <span className="g-edge r" />
          <span className="g-edge b" />
          <span className="g-edge l" />
        </>
      )}
      {picked && CORNERS.map((c) => <span key={c} className={`hd ${c}`} data-corner={c} aria-hidden />)}
    </div>
  )
})

/**
 * The board: a world of cards that pans and zooms, as Obsidian's canvas does. Cards are dragged, resized and picked
 * with the pointer or the keyboard; every change is handed up once, when the pointer lets go.
 */
export function CanvasSurface({ doc, onChange, renderNode, under, over, picked, onPick, onCreateAt, onOpen, children, ref }: Props) {
  const el = useRef<HTMLDivElement>(null)
  const keysId = useId()
  const [view, setView] = useState<View>({ x: 0, y: 0, zoom: 1 })
  const [fitting, setFitting] = useState(false)
  const [live, setLive] = useState<Live>({})
  const gesture = useRef<Gesture | null>(null)
  const viewRef = useRef(view)
  viewRef.current = view
  const docRef = useRef(doc)
  docRef.current = doc

  const size = () => {
    const r = el.current?.getBoundingClientRect()
    return { w: r?.width ?? 0, h: r?.height ?? 0 }
  }
  const toWorld = useCallback((c: Point): Point => {
    const r = el.current!.getBoundingClientRect()
    const v = viewRef.current
    return { x: (c.x - r.left - v.x) / v.zoom, y: (c.y - r.top - v.y) / v.zoom }
  }, [])

  // every node's rect, with whatever the pointer is doing applied; a rect that did not change keeps its identity, so its card does not redraw
  const base = useMemo(() => new Map(doc.nodes.map((n) => [n.id, rectOf(n)])), [doc.nodes])
  const rects = useMemo(() => {
    if (!live.move && !live.resize) return base
    const out = new Map(base)
    if (live.move) for (const id of live.move.ids) {
      const r = base.get(id)
      if (r) out.set(id, { ...r, x: r.x + live.move.dx, y: r.y + live.move.dy })
    }
    if (live.resize) out.set(live.resize.id, live.resize.rect)
    return out
  }, [base, live.move, live.resize])
  const layer = useMemo<Layer>(() => ({ view, rects, toWorld }), [view, rects, toWorld])

  const fit = useCallback((animate: boolean) => {
    const b = bounds(docRef.current.nodes.map(rectOf))
    const s = size()
    if (!s.w || !s.h) return
    setFitting(animate && !reducedMotion())
    setView(b ? fitView(b, s, clampZoom) : { x: 0, y: 0, zoom: 1 })
  }, [])
  const zoomAt = useCallback((p: Point, z: number) => {
    const v = viewRef.current
    const zoom = clampZoom(z)
    setFitting(false)
    setView({ zoom, x: p.x - (p.x - v.x) * (zoom / v.zoom), y: p.y - (p.y - v.y) * (zoom / v.zoom) })
  }, [])
  const middle = () => {
    const s = size()
    return { x: s.w / 2, y: s.h / 2 }
  }
  useImperativeHandle(ref, () => ({
    fitAll: () => fit(true),
    zoomTo: (z: number) => zoomAt(middle(), z),
    center: () => {
      const v = viewRef.current
      const m = middle()
      return { x: (m.x - v.x) / v.zoom, y: (m.y - v.y) / v.zoom }
    },
  }))

  // a board opens showing all of itself
  useLayoutEffect(() => fit(false), [fit])

  // React's onWheel is passive, so preventDefault there does nothing: the listener is added by hand
  useEffect(() => {
    const node = el.current
    if (!node) return
    const onWheel = (e: WheelEvent) => {
      if ((e.target as Element).closest('.cv-ui')) return
      e.preventDefault()
      if (e.ctrlKey || e.metaKey) {
        const r = node.getBoundingClientRect()
        zoomAt({ x: e.clientX - r.left, y: e.clientY - r.top }, viewRef.current.zoom * Math.exp(-e.deltaY * 0.002))
      } else {
        setFitting(false)
        setView((v) => ({ ...v, x: v.x - e.deltaX, y: v.y - e.deltaY }))
      }
    }
    node.addEventListener('wheel', onWheel, { passive: false })
    return () => node.removeEventListener('wheel', onWheel)
  }, [zoomAt])

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return
    const t = e.target as Element
    if (t.closest(FIELDS)) return
    const start = { x: e.clientX, y: e.clientY }
    const slot = t.closest<HTMLElement>('[data-node-id]')
    const id = slot?.dataset.nodeId
    const corner = t.closest<HTMLElement>('.hd')?.dataset.corner as Corner | undefined
    if (slot && id && corner) {
      const node = doc.nodes.find((n) => n.id === id)
      if (!node) return
      e.stopPropagation()
      slot.setPointerCapture(e.pointerId)
      gesture.current = { kind: 'resize', pointer: e.pointerId, start, id, corner, base: rectOf(node) }
      return
    }
    if (slot && id) {
      slot.setPointerCapture(e.pointerId)
      const wasPicked = picked.includes(id)
      // a card is picked as it is grabbed, so dragging an unpicked card moves just that card
      if (!e.shiftKey && !wasPicked) onPick([id])
      const ids = e.shiftKey ? [] : movingSet(doc, wasPicked ? picked : [id])
      gesture.current = { kind: 'move', pointer: e.pointerId, start, id, ids, additive: e.shiftKey, wasPicked, moved: false }
      return
    }
    el.current?.setPointerCapture(e.pointerId)
    el.current?.focus({ preventScroll: true })
    gesture.current = e.shiftKey ? { kind: 'marquee', pointer: e.pointerId, start: toWorld(start) } : { kind: 'pan', pointer: e.pointerId, start, base: view, moved: false }
  }

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const g = gesture.current
    if (!g || g.pointer !== e.pointerId) return
    const dx = e.clientX - (g.kind === 'marquee' ? 0 : g.start.x)
    const dy = e.clientY - (g.kind === 'marquee' ? 0 : g.start.y)
    const z = viewRef.current.zoom
    if (g.kind === 'move') {
      if (g.additive || !g.ids.length) return
      if (!g.moved && Math.hypot(dx, dy) < ACTIVATE) return
      g.moved = true
      setLive({ move: { ids: new Set(g.ids), dx: dx / z, dy: dy / z } })
    } else if (g.kind === 'resize') {
      setLive({ resize: { id: g.id, rect: resize(g.base, g.corner, dx / z, dy / z) } })
    } else if (g.kind === 'pan') {
      if (!g.moved && Math.hypot(dx, dy) < ACTIVATE) return
      g.moved = true
      setFitting(false)
      setView({ ...g.base, x: g.base.x + dx, y: g.base.y + dy })
    } else {
      setLive({ marquee: rectFrom(g.start, toWorld({ x: e.clientX, y: e.clientY })) })
    }
  }

  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    const g = gesture.current
    if (!g || g.pointer !== e.pointerId) return
    gesture.current = null
    if (g.kind === 'move') {
      const m = live.move
      if (g.moved && m) {
        // the grabbed card lands on the grid, and everything moving with it keeps its place beside it
        const node = doc.nodes.find((n) => n.id === g.id)
        const ddx = node ? snap(node.x + m.dx) - node.x : 0
        const ddy = node ? snap(node.y + m.dy) - node.y : 0
        if (ddx || ddy) onChange(moveBy(doc, g.ids, ddx, ddy))
      } else if (g.additive) {
        onPick(picked.includes(g.id) ? picked.filter((p) => p !== g.id) : [...picked, g.id])
      } else if (g.wasPicked && picked.length > 1) {
        onPick([g.id])
      }
    } else if (g.kind === 'resize') {
      const r = live.resize
      if (r) {
        const s = snapResize(r.rect, g.corner)
        onChange({ ...doc, nodes: doc.nodes.map((n) => (n.id === g.id ? ({ ...n, ...s } as CanvasNode) : n)) })
      }
    } else if (g.kind === 'pan') {
      if (!g.moved && picked.length) onPick([])
    } else if (live.marquee) {
      const box = live.marquee
      const hits = doc.nodes.filter((n) => (n.type === 'group' ? inside(rectOf(n), box) : intersects(rectOf(n), box))).map((n) => n.id)
      onPick([...new Set([...picked, ...hits])])
    }
    setLive({})
  }

  const onPointerCancel = () => {
    gesture.current = null
    setLive({})
  }

  const onDoubleClick = (e: MouseEvent<HTMLDivElement>) => {
    const t = e.target as Element
    if (t.closest(FIELDS) || t.closest('.edges')) return
    const id = t.closest<HTMLElement>('[data-node-id]')?.dataset.nodeId
    if (id) onOpen?.(id)
    else if (onCreateAt) {
      const p = toWorld({ x: e.clientX, y: e.clientY })
      onCreateAt({ x: snap(p.x), y: snap(p.y) })
    }
  }

  const nodesPicked = () => picked.filter((id) => doc.nodes.some((n) => n.id === id))

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const t = e.target as Element
    if (t.closest(FIELDS)) return
    const id = t.closest<HTMLElement>('[data-node-id]')?.dataset.nodeId
    const mod = e.ctrlKey || e.metaKey
    if (e.key === 'Enter' && id) {
      e.preventDefault()
      if (e.shiftKey) onPick(picked.includes(id) ? picked.filter((p) => p !== id) : [...picked, id])
      else if (picked.length === 1 && picked[0] === id) onOpen?.(id)
      else onPick([id])
    } else if ((e.key === 'Delete' || e.key === 'Backspace') && picked.length) {
      e.preventDefault()
      onChange(removeFromDoc(doc, picked))
      onPick([])
      el.current?.focus({ preventScroll: true })
    } else if (e.key.startsWith('Arrow')) {
      e.preventDefault()
      const step = e.shiftKey ? GRID * 5 : GRID
      const dx = e.key === 'ArrowLeft' ? -step : e.key === 'ArrowRight' ? step : 0
      const dy = e.key === 'ArrowUp' ? -step : e.key === 'ArrowDown' ? step : 0
      const ids = nodesPicked()
      // with nothing picked, the arrows look around the board instead
      if (ids.length) onChange(moveBy(doc, movingSet(doc, ids), dx, dy))
      else setView((v) => ({ ...v, x: v.x - dx * 3, y: v.y - dy * 3 }))
    } else if (e.key === 'Escape' && picked.length) {
      e.preventDefault()
      e.stopPropagation()
      onPick([])
    } else if (mod && !e.shiftKey && e.key.toLowerCase() === 'd') {
      e.preventDefault()
      const ids = nodesPicked()
      if (!ids.length) return
      const out = duplicate(doc, ids, () => nanoid(10))
      onChange(out.doc)
      onPick(out.ids)
    }
  }

  const step = gridStep(view.zoom)
  const moving = gesture.current?.kind === 'pan' || !!live.move
  const pickedSet = useMemo(() => new Set(picked), [picked])

  return (
    <div
      ref={el}
      className={`canvas${fitting ? ' fitting' : ''}${moving ? ' moving' : ''}`}
      tabIndex={0}
      role="region"
      aria-label="Board"
      aria-describedby={keysId}
      style={{ backgroundPosition: `${view.x}px ${view.y}px`, backgroundSize: `${step}px ${step}px` }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      onDoubleClick={onDoubleClick}
      onKeyDown={onKeyDown}
    >
      <p id={keysId} hidden>Tab to a card and press Enter to pick it. Arrow keys move what is picked, Delete takes it off the board, and Escape lets go. With nothing picked, the arrow keys look around.</p>
      <div className={`board${fitting ? ' fitting' : ''}`} style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.zoom})`, '--inv': 1 / view.zoom } as CSSProperties} onTransitionEnd={(e) => e.target === e.currentTarget && setFitting(false)}>
        {under?.(layer)}
        {doc.nodes.map((n) => <Slot key={n.id} node={n} rect={rects.get(n.id) ?? base.get(n.id)!} picked={pickedSet.has(n.id)} render={renderNode} />)}
        {live.marquee && <div className="marquee" style={{ left: live.marquee.x, top: live.marquee.y, width: live.marquee.width, height: live.marquee.height }} />}
        {over?.(layer)}
      </div>
      <div className="cv-ui">
        {children}
        <ZoomBar zoom={view.zoom} onZoom={(z) => zoomAt(middle(), z)} onFit={() => fit(true)} />
      </div>
    </div>
  )
}

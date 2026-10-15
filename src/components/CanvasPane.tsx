import { useLiveQuery } from 'dexie-react-hooks'
import { useCallback, useEffect, useRef, useState } from 'react'
import { AddFromStory, pickImage, type AddFilter } from '../canvas/addFromStory'
import { patchNode } from '../canvas/boardStore'
import { openCanvasFile } from '../canvas/canvasFiles'
import { addNode, BoardScenes, Card, CardBar, newNode } from '../canvas/cards'
import { EdgeLayer, useEdgeDraft } from '../canvas/edges'
import { duplicate, intersects, removeFromDoc } from '../canvas/geometry'
import { clearPicks, setPicked, useCanvasSelection } from '../canvas/selection'
import { CanvasSurface, type CanvasSurfaceHandle } from '../canvas/surface'
import { Tools, type ToolKind } from '../canvas/toolbar'
import { GRID, kindOf, refOf, type CanvasDoc, type CanvasNode, type Layer } from '../canvas/types'
import { useBoard } from '../canvas/useBoard'
import { createBoard, createSetting, db, uid } from '../db'
import { navigate, replaceRoute } from '../route'
import type { Board, Scene, Story } from '../types'
import './canvas-pane.css'

interface Props {
  story: Story
  scenes: Scene[]
  boardId?: string
  onOpenRight: (tab: string) => void
}

/** Where a card's own page is: the chapter in the editor, the person on the Cast page. A setting opens in the sidebar. */
function openFor(node: CanvasNode, story: Story, onOpenRight: (tab: string) => void): (() => void) | undefined {
  const kind = kindOf(node)
  const ref = refOf(node)
  if (!ref) return undefined
  if (kind === 'chapter') return () => navigate({ name: 'story', storyId: story.id, tab: 'write', itemId: ref })
  if (kind === 'character') return () => navigate({ name: 'story', storyId: story.id, tab: 'cast', itemId: ref })
  if (kind === 'setting') return () => onOpenRight('card')
  return undefined
}

/** What sits above the cards: the four arrow handles and the bar of the one card picked. */
function Over({ boardId, doc, layer, picked, story, setDoc, onOpenRight }: { boardId: string; doc: CanvasDoc; layer: Layer; picked: string[]; story: Story; setDoc: (d: CanvasDoc) => void; onOpenRight: (tab: string) => void }) {
  const { handles, draft } = useEdgeDraft(doc, layer, setDoc)
  const one = picked.length === 1 ? doc.nodes.find((n) => n.id === picked[0]) : undefined
  const rect = one && layer.rects.get(one.id)
  return (
    <>
      {one && handles(one.id)}
      {draft}
      {one && rect && (
        <CardBar
          node={{ ...one, ...rect } as CanvasNode}
          zoom={layer.view.zoom}
          onColor={(color) => patchNode(boardId, one.id, { color })}
          onOpen={openFor(one, story, onOpenRight)}
          onDuplicate={() => {
            const out = duplicate(doc, [one.id], uid)
            setDoc(out.doc)
            setPicked(boardId, out.ids)
          }}
          onRemove={() => {
            setDoc(removeFromDoc(doc, [one.id]))
            setPicked(boardId, [])
          }}
        />
      )}
    </>
  )
}

/** The board's name in the crumbs, renamed where it sits. Only the name is written straight to the database. */
function BoardName({ board }: { board: Board }) {
  const [name, setName] = useState(board.name)
  useEffect(() => setName(board.name), [board.name])
  const save = () => {
    const next = name.trim() || 'Untitled board'
    setName(next)
    if (next !== board.name) void db.boards.update(board.id, { name: next })
  }
  return (
    <input
      className="crumb-name"
      aria-label="Board name"
      value={name}
      size={Math.max(6, name.length + 1)}
      onChange={(e) => setName(e.target.value)}
      onBlur={save}
      onKeyDown={(e) => {
        if (e.key === 'Enter') e.currentTarget.blur()
        else if (e.key === 'Escape') {
          setName(board.name)
          e.currentTarget.blur()
        }
      }}
    />
  )
}

function BoardView({ story, scenes, board, onOpenRight }: { story: Story; scenes: Scene[]; board: Board; onOpenRight: (tab: string) => void }) {
  const { doc, setDoc } = useBoard(board.id)
  const sel = useCanvasSelection()
  const picked = sel.boardId === board.id ? sel.picked : []
  const surface = useRef<CanvasSurfaceHandle>(null)
  const [adding, setAdding] = useState<AddFilter | null>(null)
  const [notice, setNotice] = useState('')
  const say = useCallback((text: string) => {
    setNotice(text)
    window.setTimeout(() => setNotice((n) => (n === text ? '' : n)), 6000)
  }, [])

  // what is picked belongs to this board, and is let go when the board closes
  useEffect(() => () => clearPicks(), [])

  const renderNode = useCallback((n: CanvasNode, p: boolean) => <Card node={n} picked={p} onChange={(patch) => patchNode(board.id, n.id, patch)} />, [board.id])
  const pick = useCallback((ids: string[]) => setPicked(board.id, ids), [board.id])

  if (!doc) return <p className="hint pad" role="status">Opening the board…</p>

  /** Puts a card in the free spot nearest the middle of the view, so it covers nothing, and picks it. */
  const place = (node: CanvasNode) => {
    const c = surface.current?.center() ?? { x: 0, y: 0 }
    const x0 = Math.round((c.x - node.width / 2) / GRID) * GRID
    const y0 = Math.round((c.y - node.height / 2) / GRID) * GRID
    const free = (x: number, y: number) => !doc.nodes.some((n) => n.type !== 'group' && intersects({ x: x - GRID, y: y - GRID, width: node.width + 2 * GRID, height: node.height + 2 * GRID }, n))
    let at = { x: x0, y: y0 }
    search: for (let ring = 0; ring < 30; ring++) {
      for (let dx = -ring; dx <= ring; dx++) {
        for (let dy = -ring; dy <= ring; dy++) {
          if (Math.max(Math.abs(dx), Math.abs(dy)) !== ring) continue
          const x = x0 + dx * 2 * GRID
          const y = y0 + dy * 2 * GRID
          if (free(x, y)) {
            at = { x, y }
            break search
          }
        }
      }
    }
    const placed = { ...node, ...at } as CanvasNode
    setDoc(addNode(doc, placed))
    pick([placed.id])
  }

  const onTool = async (kind: ToolKind) => {
    if (kind === 'note' || kind === 'group') return place(newNode(kind, { x: 0, y: 0 }))
    if (kind === 'chapter') {
      // the next chapter, in the story's order, that is not on this board yet
      const on = new Set(doc.nodes.filter((n) => kindOf(n) === 'chapter').map(refOf))
      const next = scenes.find((s) => !on.has(s.id))
      return next ? place(newNode('chapter', { x: 0, y: 0 }, next.id)) : say('Every chapter is on this board.')
    }
    if (kind === 'setting' && !(await db.settings.where('storyId').equals(story.id).count())) {
      place(newNode('setting', { x: 0, y: 0 }, await createSetting(story.id, 'New setting')))
      return onOpenRight('card')
    }
    if (kind === 'image') {
      const img = await pickImage(story.id)
      if (img === 'not-a-picture') say('That file is not a picture Parchemin can keep: PNG, JPEG, GIF, WebP or AVIF.')
      else if (img) place(newNode('image', { x: 0, y: 0 }, img.id))
      return
    }
    setAdding(kind)
  }

  return (
    <>
      <div className="pane-head">
        <div className="crumbs">
          <span className="crumb-story"><b title={story.title}>{story.title || 'Untitled story'}</b><span aria-hidden>›</span></span>
          <span>Boards</span>
          <span aria-hidden>›</span>
          <BoardName board={board} />
        </div>
        <div className="acts canvas-acts">
          <span className="hint notice" role="status">{notice}</span>
          <AddFromStory story={story} scenes={scenes} doc={doc} onAdd={place} open={adding} onOpenChange={setAdding} onSay={say} />
          <button className="btn small quiet fit-btn" onClick={() => surface.current?.fitAll()}>Zoom to fit</button>
        </div>
      </div>
      <BoardScenes.Provider value={scenes}>
      <CanvasSurface
        ref={surface}
        doc={doc}
        onChange={setDoc}
        renderNode={renderNode}
        picked={picked}
        onPick={pick}
        under={(l) => <EdgeLayer doc={doc} layer={l} picked={picked} onPick={(id, add) => pick(add ? (picked.includes(id) ? picked.filter((p) => p !== id) : [...picked, id]) : [id])} onChange={setDoc} />}
        over={(l) => <Over boardId={board.id} doc={doc} layer={l} picked={picked} story={story} setDoc={setDoc} onOpenRight={onOpenRight} />}
        onCreateAt={(p) => {
          const n = newNode('note', p)
          setDoc(addNode(doc, n))
          pick([n.id])
        }}
        onOpen={() => onOpenRight('card')}
      >
        <Tools onAdd={(k) => void onTool(k)} />
      </CanvasSurface>
      </BoardScenes.Provider>
    </>
  )
}

/** The boards of a story: one board at a time, its cards live from the story, its notes and arrows the writer's own. */
export function CanvasPane({ story, scenes, boardId, onOpenRight }: Props) {
  const boards = useLiveQuery(() => db.boards.where('storyId').equals(story.id).sortBy('createdAt'), [story.id])
  const board = boards?.find((b) => b.id === boardId)
  const file = useRef<HTMLInputElement>(null)
  const [error, setError] = useState('')

  // the boards open on the first board, and an address whose board went to the drawer lands on another
  useEffect(() => {
    if (!boards || board) return
    if (boards.length) replaceRoute({ name: 'story', storyId: story.id, tab: 'canvas', itemId: boards[0].id })
    else if (boardId) replaceRoute({ name: 'story', storyId: story.id, tab: 'canvas' })
  }, [boards, board, boardId, story.id])

  if (!boards) return null
  if (board) return <BoardView key={board.id} story={story} scenes={scenes} board={board} onOpenRight={onOpenRight} />
  if (boards.length) return null
  return (
    <>
      <div className="pane-head">
        <div className="crumbs"><span className="crumb-story"><b title={story.title}>{story.title || 'Untitled story'}</b><span aria-hidden>›</span></span><b>Boards</b></div>
      </div>
      <div className="pane-scroll">
        <div className="pane-empty">
          <h2>No boards yet</h2>
          <p>A board is a table for the pieces of your story: chapters, people and places as live cards, and notes and arrows of your own. Nothing on a board touches the manuscript.</p>
          <p className="acts" style={{ justifyContent: 'center', marginTop: 14 }}>
            <button className="btn primary" onClick={async () => navigate({ name: 'story', storyId: story.id, tab: 'canvas', itemId: await createBoard(story.id) })}>New board</button>
            <button className="btn quiet" onClick={() => file.current?.click()}>Open a .canvas file…</button>
          </p>
          <p className="hint" role="status">{error}</p>
          <input
            ref={file}
            type="file"
            accept=".canvas,application/json"
            hidden
            onChange={async (e) => {
              const f = e.target.files?.[0]
              e.target.value = ''
              if (!f) return
              try {
                navigate({ name: 'story', storyId: story.id, tab: 'canvas', itemId: await openCanvasFile(story.id, f) })
              } catch (err) {
                setError(err instanceof Error ? err.message : 'That file could not be opened.')
              }
            }}
          />
        </div>
      </div>
    </>
  )
}

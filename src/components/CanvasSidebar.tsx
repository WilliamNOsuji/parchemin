import { useLiveQuery } from 'dexie-react-hooks'
import { nanoid } from 'nanoid'
import { Fragment, useRef, useState, type ReactNode } from 'react'
import { dropBoard, flushBoard, patchEdge, patchNode, setBoardDoc, useBoardDoc } from '../canvas/boardStore'
import { openCanvasFile, saveCanvasFile } from '../canvas/canvasFiles'
import { removeFromDoc } from '../canvas/geometry'
import { setPicked, useCanvasSelection } from '../canvas/selection'
import { COLOR_CHOICES, colorOf, kindOf, refOf, type CanvasDoc, type CanvasEdge, type CanvasNode, type CardKind } from '../canvas/types'
import { settingName } from '../craft/settings'
import { voiceById } from '../craft/voices'
import { createBoard, db, setAsideBoard } from '../db'
import { navigate } from '../route'
import { STATUSES, type Board, type Character, type Scene, type SceneStatus, type Setting, type Story } from '../types'
import { GrowingText } from './GrowingText'
import { Icon } from './Icons'
import { Menu } from './Menu'
import { Section } from './RightSidebar'
import { SettingSheet } from './SettingSheet'
import { useAutosave } from './useAutosave'
import './canvas-pane.css'
import './settings.css'

interface Props {
  story: Story
  scenes: Scene[]
  boardId?: string
  rightTab: string
}

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`
const KIND_NAME: Record<CardKind, string> = { note: 'note', chapter: 'chapter', character: 'character', setting: 'setting', image: 'picture', group: 'group', link: 'link', file: 'file' }
const COLOUR_NAME: Record<string, string> = { '3': 'Yellow', '4': 'Green', '5': 'Teal', '6': 'Violet' }

interface Names {
  characters: Map<string, Character>
  settings: Map<string, Setting>
  images: Map<string, string>
}

/** What a writer calls a card: the person, the chapter, the place, or the first words of a note. */
function cardName(n: CanvasNode, scenes: Scene[], names: Names): string {
  const ref = refOf(n) ?? ''
  switch (kindOf(n)) {
    case 'character':
      return names.characters.get(ref)?.name.trim() || 'No longer in the story'
    case 'chapter': {
      const i = scenes.findIndex((s) => s.id === ref)
      return i < 0 ? 'No longer in the story' : `${i + 1} · ${scenes[i].title.trim() || 'Untitled'}`
    }
    case 'setting': {
      const s = names.settings.get(ref)
      return s ? settingName(s) : 'No longer in the story'
    }
    case 'image':
      return names.images.get(ref) || 'A picture'
    case 'group':
      return (n.type === 'group' && n.label?.trim()) || 'Group'
    case 'note': {
      const t = n.type === 'text' ? n.text.trim().replace(/\s+/g, ' ') : ''
      return t ? (t.length > 40 ? `${t.slice(0, 40)}…` : t) : 'Empty note'
    }
    case 'link':
      return n.type === 'link' ? n.url : 'Link'
    default:
      return n.type === 'file' ? n.file : 'File'
  }
}

function Colours({ node, boardId }: { node: CanvasNode; boardId: string }) {
  return (
    <div className="field">
      <span>Card colour</span>
      <div className="sel-colours" role="group" aria-label="Card colour">
        <button className="none" aria-label="No colour" aria-pressed={!node.color} onClick={() => patchNode(boardId, node.id, { color: undefined })} />
        {COLOR_CHOICES.map((c) => (
          <button key={c} style={{ background: colorOf(c)! }} aria-label={COLOUR_NAME[c]} aria-pressed={node.color === c} onClick={() => patchNode(boardId, node.id, { color: c })} />
        ))}
      </div>
    </div>
  )
}

/** Arrows for the keyboard: pick a card here and an arrow is drawn to it from the card that is picked. */
function ArrowTo({ node, doc, boardId, scenes, names }: { node: CanvasNode; doc: CanvasDoc; boardId: string; scenes: Scene[]; names: Names }) {
  const others = doc.nodes.filter((n) => n.id !== node.id)
  if (!others.length) return null
  return (
    <label className="field">
      <span>Draw an arrow to</span>
      <select
        value=""
        onChange={(e) => {
          const to = e.target.value
          if (!to) return
          const edge: CanvasEdge = { id: nanoid(10), fromNode: node.id, toNode: to, toEnd: 'arrow' }
          setBoardDoc(boardId, { ...doc, edges: [...doc.edges, edge] })
          setPicked(boardId, [edge.id])
        }}
      >
        <option value="">Choose a card…</option>
        {others.map((n) => (
          <option key={n.id} value={n.id}>{cardName(n, scenes, names)}</option>
        ))}
      </select>
    </label>
  )
}

/** The fields of a live character card: the same profile as on the Cast page, saved as the writer types. */
function CharacterFields({ character }: { character: Character }) {
  const [c, update] = useAutosave(character, (id, patch) => db.characters.update(id, { ...patch, updatedAt: Date.now() }))
  const voice = voiceById(c.craft?.voice)
  return (
    <>
      <p className="hint">A character card is the live profile. Change it here or on the Cast page, and both change.</p>
      <div className="two">
        <label className="field">
          <span>Name</span>
          <GrowingText value={c.name} placeholder="Name" onChange={(e) => update({ name: e.target.value.replace(/\n/g, ' ') })} />
        </label>
        <label className="field">
          <span>Role</span>
          <GrowingText value={c.role} placeholder="Hero, mentor, rival…" onChange={(e) => update({ role: e.target.value })} />
        </label>
      </div>
      <div className="f"><span>Voice</span><div>{voice ? voice.name : <span className="empty">No voice yet. Give them one on the Cast page.</span>}</div></div>
      <label className="field">
        <span>Wants in a room</span>
        <GrowingText value={c.craft?.wantInRoom ?? ''} placeholder={voice?.want ?? 'What do they want from the people in a room?'} onChange={(e) => update({ craft: { ...c.craft, wantInRoom: e.target.value } })} />
      </label>
      <div className="acts">
        <button className="btn small" onClick={() => navigate({ name: 'story', storyId: c.storyId, tab: 'cast', itemId: c.id })}>Open on the Cast page</button>
      </div>
    </>
  )
}

function ChapterFields({ scene, n }: { scene: Scene; n: number }) {
  return (
    <>
      <p className="hint">A chapter card is the chapter itself. Its summary is the outline's: change it here and the outline changes.</p>
      <label className="field">
        <span>Status</span>
        <span className={`stat ${scene.status}`} style={{ alignSelf: 'flex-start' }}>
          <span className={`dot ${scene.status}`} />
          <select aria-label={`Status of chapter ${n}`} value={scene.status} onChange={(e) => void db.scenes.update(scene.id, { status: e.target.value as SceneStatus })}>
            {STATUSES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        </span>
      </label>
      <label className="field">
        <span>What happens</span>
        <GrowingText key={`${scene.id}${scene.summary}`} defaultValue={scene.summary} placeholder="What happens in this chapter?" onBlur={(e) => e.target.value !== scene.summary && void db.scenes.update(scene.id, { summary: e.target.value })} />
      </label>
      <div className="acts">
        <button className="btn small" onClick={() => navigate({ name: 'story', storyId: scene.storyId, tab: 'write', itemId: scene.id })}>Open the chapter</button>
      </div>
    </>
  )
}

function EdgeFields({ edge, doc, boardId, scenes, names }: { edge: CanvasEdge; doc: CanvasDoc; boardId: string; scenes: Scene[]; names: Names }) {
  const from = doc.nodes.find((n) => n.id === edge.fromNode)
  const to = doc.nodes.find((n) => n.id === edge.toNode)
  return (
    <>
      <p className="hint">From {from ? cardName(from, scenes, names) : 'a card'} to {to ? cardName(to, scenes, names) : 'a card'}.</p>
      <label className="field">
        <span>Name</span>
        <input key={edge.id} defaultValue={edge.label ?? ''} placeholder="won't ask, saw it, keeps…" onChange={(e) => patchEdge(boardId, edge.id, { label: e.target.value || undefined })} />
      </label>
      <div className="field">
        <span>Arrowheads</span>
        <div className="sel-ends">
          <label><input type="checkbox" checked={edge.fromEnd === 'arrow'} onChange={(e) => patchEdge(boardId, edge.id, { fromEnd: e.target.checked ? 'arrow' : 'none' })} /> At the start</label>
          <label><input type="checkbox" checked={(edge.toEnd ?? 'arrow') === 'arrow'} onChange={(e) => patchEdge(boardId, edge.id, { toEnd: e.target.checked ? 'arrow' : 'none' })} /> At the end</label>
        </div>
      </div>
      <div className="acts">
        <button
          className="btn small quiet"
          onClick={() => {
            setBoardDoc(boardId, { ...doc, edges: doc.edges.filter((e) => e.id !== edge.id) })
            setPicked(boardId, [])
          }}
        >
          Remove the arrow
        </button>
      </div>
    </>
  )
}

/** The picked card or arrow, edited in the sidebar. Everything that changes the board goes through the board's store. */
function Selected({ doc, boardId, scenes, names }: { doc: CanvasDoc; boardId: string; scenes: Scene[]; names: Names }) {
  const sel = useCanvasSelection()
  const picked = sel.boardId === boardId ? sel.picked : []
  const items = picked.map((id) => doc.nodes.find((n) => n.id === id) ?? doc.edges.find((e) => e.id === id)).filter((x): x is CanvasNode | CanvasEdge => !!x)
  if (!items.length) return <Section title="Selected"><p className="hint">Pick a card to see it here. Double-click one, or press Enter on it, to open this panel.</p></Section>
  if (items.length > 1) {
    return (
      <Section title="Selected" count={plural(items.length, 'thing', 'things')}>
        <p className="hint">Drag one to move them all. Delete takes them off the board; the story keeps every chapter, person and place.</p>
        <div className="acts">
          <button className="btn small quiet" onClick={() => { setBoardDoc(boardId, removeFromDoc(doc, picked)); setPicked(boardId, []) }}>Remove from the board</button>
        </div>
      </Section>
    )
  }
  const node = doc.nodes.find((n) => n.id === picked[0])
  const edge = doc.edges.find((e) => e.id === picked[0])
  if (!node) return edge ? <Section title="Selected" count="arrow"><EdgeFields edge={edge} doc={doc} boardId={boardId} scenes={scenes} names={names} /></Section> : null
  const kind = kindOf(node)
  const ref = refOf(node) ?? ''
  let body: ReactNode = null
  if (kind === 'character') {
    const c = names.characters.get(ref)
    body = c ? <CharacterFields key={c.id} character={c} /> : <p className="hint">This person is no longer in the story. Put them back from the drawer and the card comes back to life.</p>
  } else if (kind === 'chapter') {
    const i = scenes.findIndex((s) => s.id === ref)
    body = i >= 0 ? <ChapterFields scene={scenes[i]} n={i + 1} /> : <p className="hint">This chapter is no longer in the story. Put it back from the drawer and the card comes back to life.</p>
  } else if (kind === 'setting') {
    const s = names.settings.get(ref)
    body = s ? <SettingSheet key={s.id} setting={s} /> : <p className="hint">This place is no longer in the story. Put it back from the drawer and the card comes back to life.</p>
  } else if (kind === 'note' && node.type === 'text') {
    body = (
      <label className="field">
        <span>Note</span>
        <GrowingText value={node.text} placeholder="Write a note" onChange={(e) => patchNode(boardId, node.id, { text: e.target.value })} />
        <small className="hint">A note lives only on this board. Begin it with a few words and a colon to give it a label.</small>
      </label>
    )
  } else if (kind === 'image') {
    body = (
      <label className="field">
        <span>Caption</span>
        <input key={ref} defaultValue={names.images.get(ref) ?? ''} onBlur={(e) => void db.images.update(ref, { name: e.target.value.trim() })} />
      </label>
    )
  } else if (kind === 'group' && node.type === 'group') {
    body = (
      <label className="field">
        <span>Group name</span>
        <input value={typeof node.label === 'string' ? node.label : ''} placeholder="What the cards in it share" onChange={(e) => patchNode(boardId, node.id, { label: e.target.value } as Partial<CanvasNode>)} />
        <small className="hint">A card inside the group moves with it.</small>
      </label>
    )
  } else {
    body = <p className="hint">{kind === 'link' ? 'A link' : 'A file'} from another app, kept as it is so the board saves back the same.</p>
  }
  return (
    <Section title="Selected" count={`${cardName(node, scenes, names)} · ${KIND_NAME[kind]}`}>
      {body}
      <Colours node={node} boardId={boardId} />
      <ArrowTo node={node} doc={doc} boardId={boardId} scenes={scenes} names={names} />
      <div className="acts">
        <button className="btn small quiet" onClick={() => { setBoardDoc(boardId, removeFromDoc(doc, [node.id])); setPicked(boardId, []) }}>Remove from the board</button>
      </div>
    </Section>
  )
}

function BoardRow({ board, open, story }: { board: Board; open: boolean; story: Story }) {
  const [renaming, setRenaming] = useState(false)
  const cards = board.canvas.nodes.length
  if (renaming) {
    return (
      <div className="board-row">
        <input
          autoFocus
          aria-label="Board name"
          defaultValue={board.name}
          onFocus={(e) => e.currentTarget.select()}
          onKeyDown={(e) => {
            if (e.key === 'Enter') e.currentTarget.blur()
            else if (e.key === 'Escape') {
              e.currentTarget.value = board.name
              e.currentTarget.blur()
            }
          }}
          onBlur={(e) => {
            setRenaming(false)
            const name = e.target.value.trim()
            if (name && name !== board.name) void db.boards.update(board.id, { name })
          }}
        />
      </div>
    )
  }
  return (
    <div className="board-row">
      <button className={`snap${open ? ' active' : ''}`} aria-current={open ? 'page' : undefined} onClick={() => navigate({ name: 'story', storyId: story.id, tab: 'canvas', itemId: board.id })}>
        <b>{board.name.trim() || 'Untitled board'}</b>
        <span>{plural(cards, 'card', 'cards')}</span>
      </button>
      <Menu
        label={`More for ${board.name}`}
        items={[
          { label: 'Rename', onClick: () => setRenaming(true) },
          {
            label: 'Move to the drawer',
            onClick: async () => {
              if (!window.confirm(`Move "${board.name.trim() || 'Untitled board'}" to the drawer? Its cards, notes and arrows go with it, and come back when you put it back.`)) return
              await flushBoard(board.id) // the drawer gets the latest moves
              await setAsideBoard(board.id)
              dropBoard(board.id)
              if (open) navigate({ name: 'story', storyId: story.id, tab: 'canvas' })
            },
          },
        ]}
      />
    </div>
  )
}

function OnThisBoard({ doc, board, story }: { doc: CanvasDoc; board: Board; story: Story }) {
  const file = useRef<HTMLInputElement>(null)
  const [msg, setMsg] = useState('')
  const count = (k: CardKind) => doc.nodes.filter((n) => kindOf(n) === k).length
  // plain counts of what is there; a kind the board has none of is left out
  const list = (parts: [number, string, string][]) => {
    const items = parts.filter(([n]) => n > 0).map(([n, one, many]) => plural(n, one, many))
    // each count stays whole; the line breaks only between them
    return items.length ? items.map((t, i) => <Fragment key={t}>{i ? ' · ' : ''}<span className="nb">{t}</span></Fragment>) : 'nothing yet'
  }
  const fromStory = list([[count('character'), 'character', 'characters'], [count('chapter'), 'chapter', 'chapters'], [count('setting'), 'setting', 'settings']])
  const onlyHere = list([[count('note'), 'note', 'notes'], [count('group'), 'group', 'groups'], [count('image'), 'picture', 'pictures'], [count('link') + count('file'), 'from another app', 'from another app']])
  return (
    <Section title="On this board">
      <div className="chg facts"><span>From the story</span><span>{fromStory}</span></div>
      <div className="chg facts"><span>Only here</span><span>{onlyHere}</span></div>
      <div className="chg facts"><span>Saved in</span><span>this library</span></div>
      <div className="acts">
        <button className="btn small" onClick={() => saveCanvasFile(board, doc).then(() => setMsg(''), (e: unknown) => setMsg(e instanceof Error ? e.message : 'The file could not be saved.'))}>Save as a .canvas file…</button>
        <button className="btn small quiet" onClick={() => file.current?.click()}>Open a .canvas file…</button>
      </div>
      <input
        ref={file}
        type="file"
        accept=".canvas,application/json"
        hidden
        aria-label="Open a .canvas file"
        onChange={async (e) => {
          const f = e.target.files?.[0]
          e.target.value = ''
          if (!f) return
          try {
            const id = await openCanvasFile(story.id, f)
            setMsg('')
            navigate({ name: 'story', storyId: story.id, tab: 'canvas', itemId: id })
          } catch (err) {
            setMsg(err instanceof Error ? err.message : 'That file could not be opened.')
          }
        }}
      />
      <p className="hint" role="status">{msg}</p>
      <p className="hint">A .canvas file is JSON Canvas, the open format Obsidian reads. A board opens in Obsidian, and an Obsidian canvas opens here as a new board.</p>
      <p className="hint">Nothing on a board touches the manuscript. Delete a card here and the chapter or character it came from stays where it was.</p>
    </Section>
  )
}

/** The canvas's sidebar: the story's boards, the picked card, and what the open board holds. */
export function CanvasSidebar({ story, scenes, boardId, rightTab }: Props) {
  const boards = useLiveQuery(() => db.boards.where('storyId').equals(story.id).sortBy('createdAt'), [story.id])
  const doc = useBoardDoc(boardId)
  const parts = useLiveQuery(async () => {
    const [characters, settings, images] = await Promise.all([db.characters.where('storyId').equals(story.id).toArray(), db.settings.where('storyId').equals(story.id).toArray(), db.images.where('storyId').equals(story.id).toArray()])
    return { characters: new Map(characters.map((c) => [c.id, c])), settings: new Map(settings.map((s) => [s.id, s])), images: new Map(images.map((i) => [i.id, i.name])) }
  }, [story.id])
  if (!boards || !parts) return null
  const board = boards.find((b) => b.id === boardId)

  const list = (
    <Section title="Boards" count={`this story · ${boards.length}`}>
      <div className="pick-list">
        {boards.map((b) => <BoardRow key={b.id} board={b} open={b.id === boardId} story={story} />)}
        <div className="acts">
          <button className="btn small" onClick={async () => navigate({ name: 'story', storyId: story.id, tab: 'canvas', itemId: await createBoard(story.id) })}><Icon name="plus" size={12} /> New board</button>
        </div>
      </div>
    </Section>
  )
  const selected = board && doc ? <Selected doc={doc} boardId={board.id} scenes={scenes} names={parts} /> : null
  const facts = board && doc ? <OnThisBoard doc={doc} board={board} story={story} /> : null
  if (rightTab === 'card') return <>{selected ?? <p className="hint pad">Open a board to see its cards here.</p>}{facts}</>
  return (
    <>
      {list}
      {selected}
      {facts}
    </>
  )
}

import Placeholder from '@tiptap/extension-placeholder'
import { EditorContent, useEditor } from '@tiptap/react'
import { useLiveQuery } from 'dexie-react-hooks'
import { useMemo, useRef, useState } from 'react'
import { ideaTitle, LINK_COLOR, LINK_GROUPS, linkLabel, linkOptions, sameLink, WEB_COPY } from '../craft/web'
import { db, setAsideCoreIdea } from '../db'
import { storyKit } from '../editorSchema'
import type { CoreIdea, Scene, Story, WebLink, WebLinkKind } from '../types'
import { Icon } from './Icons'
import { Modal } from './Modal'
import { Section } from './RightSidebar'
import { Toolbar } from './Toolbar'
import { useAutosave } from './useAutosave'
import './web-editors.css'

function IdeaDoc({ html, onChange }: { html: string; onChange: (html: string) => void }) {
  const editor = useEditor(
    {
      extensions: [storyKit(), Placeholder.configure({ placeholder: WEB_COPY.ideaPlaceholder })],
      content: html,
      editorProps: { attributes: { class: 'prose idea-doc core-doc', writingsuggestions: 'false', 'aria-label': 'The core idea, in your words' } },
      onUpdate: ({ editor }) => onChange(editor.getHTML()),
    },
    [],
  )
  if (!editor) return null
  return (
    <div className="bio-wrap">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}

/** Every part of the story a core idea can name, with a tick on the ones it already does. */
function LinkPicker({ options, links, onToggle, onClose }: { options: ReturnType<typeof linkOptions>; links: WebLink[]; onToggle: (link: WebLink) => void; onClose: () => void }) {
  const [q, setQ] = useState('')
  const words = q.toLocaleLowerCase().split(/\s+/).filter(Boolean)
  const match = (label: string) => words.every((w) => label.toLocaleLowerCase().includes(w))
  return (
    <Modal title="What carries this idea?" onClose={onClose}>
      <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Find a chapter, a person, a place, a thing" aria-label="Find" />
      <div className="link-picker">
        {LINK_GROUPS.map((g) => {
          const items = options[g.kind].filter((o) => match(o.label))
          if (!items.length) return null
          return (
            <fieldset key={g.kind}>
              <legend>{g.label}</legend>
              {items.map((o) => {
                const link = { kind: g.kind, id: o.id }
                const on = links.some((l) => sameLink(l, link))
                return (
                  <label key={o.id} className="check">
                    <input type="checkbox" checked={on} onChange={() => onToggle(link)} />
                    <span>{o.label}</span>
                  </label>
                )
              })}
            </fieldset>
          )
        })}
        {LINK_GROUPS.every((g) => !options[g.kind].some((o) => match(o.label))) && <p className="hint">Nothing in the story goes by that name.</p>}
      </div>
      <div className="modal-actions">
        <button className="btn primary" onClick={onClose}>Done</button>
      </div>
    </Modal>
  )
}

/**
 * A core idea, edited in the Web's sidebar: its name, the document in the writer's words, and the parts of the story
 * the writer says carry it. Each of those is a thread in the Web. Never exported.
 */
export function CoreIdeaEditor({ idea, story, scenes, onSetAside }: { idea: CoreIdea; story: Story; scenes: Scene[]; onSetAside: () => void }) {
  const [c, update, flush] = useAutosave(idea, (id, patch) => db.coreIdeas.update(id, { ...patch, updatedAt: Date.now() }))
  const [picking, setPicking] = useState(false)
  // the links as they stand, so two quick toggles both count before the next render
  const links = useRef(idea.carriedBy)

  const parts = useLiveQuery(async () => {
    const [characters, settings, symbols, boards] = await Promise.all([
      db.characters.where('storyId').equals(story.id).sortBy('createdAt'),
      db.settings.where('storyId').equals(story.id).sortBy('createdAt'),
      db.symbols.where('storyId').equals(story.id).sortBy('createdAt'),
      db.boards.where('storyId').equals(story.id).sortBy('createdAt'),
    ])
    return { characters, settings, symbols, boards }
  }, [story.id])
  const options = useMemo(() => linkOptions({ scenes, characters: parts?.characters ?? [], settings: parts?.settings ?? [], symbols: parts?.symbols ?? [], boards: parts?.boards ?? [] }), [scenes, parts])

  const toggle = (link: WebLink) => {
    const has = links.current.some((l) => sameLink(l, link))
    links.current = has ? links.current.filter((l) => !sameLink(l, link)) : [...links.current, link]
    update({ carriedBy: links.current })
  }
  // chips read in the order of the picker's groups, so chapters come first, then people, places and things
  const order = (k: WebLinkKind) => LINK_GROUPS.findIndex((g) => g.kind === k)
  const chips = [...c.carriedBy].sort((a, b) => order(a.kind) - order(b.kind))

  return (
    <Section title={ideaTitle(c.title)} count="core idea">
      <input className="idea-title" aria-label="Core idea" value={c.title} placeholder={WEB_COPY.ideaTitle} onChange={(e) => update({ title: e.target.value })} />
      <IdeaDoc html={idea.text} onChange={(text) => update({ text })} />
      <p className="hint">{WEB_COPY.ideaHint}</p>
      <div className="field">
        <span>Carried by</span>
        {chips.length === 0 && parts && <p className="hint">{WEB_COPY.noLinks}</p>}
        <div className="chips" aria-label="Carried by">
          {parts &&
            chips.map((l) => {
              const label = linkLabel(l, options)
              return (
                <span className={`chip${label ? '' : ' gone'}`} key={`${l.kind}:${l.id}`}>
                  <i className="gk" style={{ background: LINK_COLOR[l.kind] }} aria-hidden />
                  {label ?? WEB_COPY.gone}
                  <button aria-label={label ? `Remove ${label}` : 'Remove this thread'} onClick={() => toggle(l)}>✕</button>
                </span>
              )
            })}
          <button className="chip add" onClick={() => setPicking(true)}><Icon name="plus" size={11} /> Add…</button>
        </div>
      </div>
      <p className="hint">{WEB_COPY.inBackup}</p>
      <div className="acts">
        <button
          className="btn small quiet"
          onClick={async () => {
            if (!window.confirm(WEB_COPY.asideIdea(ideaTitle(c.title)))) return
            await flush() // the drawer gets the latest edits
            await setAsideCoreIdea(c.id)
            onSetAside()
          }}
        >
          Move to the drawer
        </button>
      </div>
      {picking && <LinkPicker options={options} links={c.carriedBy} onToggle={toggle} onClose={() => setPicking(false)} />}
    </Section>
  )
}

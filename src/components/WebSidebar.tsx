import { CoreIdeaEditor } from './CoreIdeaEditor'
import { ideaTitle, symbolName, WEB_COPY } from '../craft/web'
import { settingName } from '../craft/settings'
import { createCoreIdea, db } from '../db'
import { navigate, replaceRoute } from '../route'
import type { CoreIdea, Scene, Story, WebLinkKind } from '../types'
import type { Cooccurrence } from '../web/cooccur'
import { parseWebItem, webItem, type WebItemKind } from '../web/item'
import { useWebParts, type WebParts } from '../web/useWebModel'
import { Icon } from './Icons'
import { Section } from './RightSidebar'
import { SettingSheet } from './SettingSheet'
import { SettingsList } from './SettingsList'
import { SymbolsPanel } from './SymbolsPanel'
import './settings.css'
import './web-pane.css'

interface Props {
  story: Story
  scenes: Scene[]
  itemId?: string
  rightTab: string
}

const KIND_NAME: Record<WebItemKind, string> = { idea: 'core idea', character: 'character', setting: 'setting', symbol: 'symbol', chapter: 'chapter', board: 'board' }

/** The plain evidence for a part: which chapters name it, and how. Nothing more is claimed. */
function evidence(key: string, kind: WebItemKind, id: string, co: Cooccurrence, scenes: Scene[], web: WebParts): string {
  if (kind === 'board') return 'A board is linked to an idea by hand; its cards are not read as text.'
  if (kind === 'chapter') {
    const names = [...co.mentions].filter(([, chapters]) => chapters.has(id)).map(([k]) => nameOf(k, scenes, web)).filter(Boolean)
    return names.length ? `Names in it: ${names.join(', ')}.` : 'No name from the cast, the settings or the symbols appears in it yet.'
  }
  const chapters = [...(co.mentions.get(key) ?? [])].map((c) => scenes.findIndex((s) => s.id === c) + 1).filter((n) => n > 0).sort((a, b) => a - b)
  if (!chapters.length) return 'Not named in the text of any chapter yet.'
  const spellings = [...(co.spellings.get(key) ?? [])].sort((a, b) => a.length - b.length || a.localeCompare(b))
  return `Appears in ch. ${chapters.join(', ')} as ${spellings.join(', ')}.`
}

function nameOf(key: string, scenes: Scene[], web: WebParts): string {
  const item = parseWebItem(key)
  if (!item) return ''
  switch (item.kind) {
    case 'idea':
      return ideaTitle(web.coreIdeas.find((c) => c.id === item.id)?.title ?? '')
    case 'character': {
      // a part that has left the story has no name at all, so the sidebar can say it is gone
      const c = web.characters.find((x) => x.id === item.id)
      return c ? c.name.trim() || 'Unnamed' : ''
    }
    case 'setting': {
      const s = web.settings.find((x) => x.id === item.id)
      return s ? settingName(s) : ''
    }
    case 'symbol': {
      const s = web.symbols.find((x) => x.id === item.id)
      return s ? symbolName(s) : ''
    }
    case 'board': {
      const b = web.boards.find((x) => x.id === item.id)
      return b ? b.name.trim() || 'Untitled board' : ''
    }
    case 'chapter': {
      const i = scenes.findIndex((s) => s.id === item.id)
      return i < 0 ? '' : `ch. ${i + 1} · ${scenes[i].title.trim() || 'Untitled'}`
    }
  }
}

/** A part of the story picked in the Web: what it is, the ideas the writer says it carries, and where its name appears. */
function Part({ story, scenes, web, kind, id }: { story: Story; scenes: Scene[]; web: WebParts; kind: Exclude<WebItemKind, 'idea'>; id: string }) {
  const key = webItem(kind, id)
  const name = nameOf(key, scenes, web)
  const link = { kind: kind as WebLinkKind, id }
  const carries = web.coreIdeas.filter((c) => c.carriedBy.some((l) => l.kind === kind && l.id === id))
  const others = web.coreIdeas.filter((c) => !carries.includes(c))
  const pick = (k?: string) => replaceRoute({ name: 'story', storyId: story.id, tab: 'web', itemId: k })
  const open: Partial<Record<WebItemKind, [string, () => void]>> = {
    character: ['Open on the Cast page', () => navigate({ name: 'story', storyId: story.id, tab: 'cast', itemId: id })],
    chapter: ['Open the chapter', () => navigate({ name: 'story', storyId: story.id, tab: 'write', itemId: id })],
    board: ['Open the board', () => navigate({ name: 'story', storyId: story.id, tab: 'canvas', itemId: id })],
  }
  const setting = kind === 'setting' ? web.settings.find((s) => s.id === id) : undefined
  const symbol = kind === 'symbol' ? web.symbols.find((s) => s.id === id) : undefined

  if (!name) return <Section title="Not in the story"><p className="hint">This is no longer in the story. It may be in the drawer.</p></Section>
  return (
    <>
      <Section title={name} count={KIND_NAME[kind]}>
        <div className="web-part stack" style={{ gap: 9 }}>
          {symbol?.note.trim() && <p className="core-doc">{symbol.note}</p>}
          <div className="field">
            <span>Carries</span>
            {carries.length ? (
              <div className="chips">
                {carries.map((c) => (
                  <button key={c.id} className="chip on" onClick={() => pick(webItem('idea', c.id))}>{ideaTitle(c.title)}</button>
                ))}
              </div>
            ) : (
              <p className="hint">No core idea names it yet. A thread is a link you make.</p>
            )}
          </div>
          {others.length > 0 && (
            <label className="field">
              <span>Link it to a core idea</span>
              <select
                value=""
                onChange={async (e) => {
                  const idea = others.find((c) => c.id === e.target.value)
                  if (idea) await db.coreIdeas.update(idea.id, { carriedBy: [...idea.carriedBy, link], updatedAt: Date.now() })
                }}
              >
                <option value="">Choose an idea…</option>
                {others.map((c) => <option key={c.id} value={c.id}>{ideaTitle(c.title)}</option>)}
              </select>
            </label>
          )}
          <div className="field">
            <span>In the text</span>
            <p className="evidence">{evidence(key, kind, id, web.co, scenes, web)}</p>
            <small className="hint">{WEB_COPY.plainReadings}</small>
          </div>
          {open[kind] && (
            <div className="acts">
              <button className="btn small" onClick={open[kind]![1]}>{open[kind]![0]}</button>
            </div>
          )}
          {kind === 'symbol' && <p className="hint">Change its name and line under Symbols, the second tab.</p>}
        </div>
      </Section>
      {setting && (
        <Section title="Setting sheet">
          <SettingSheet key={setting.id} setting={setting} onSetAside={() => pick()} />
        </Section>
      )}
    </>
  )
}

function IdeasList({ story, ideas }: { story: Story; ideas: CoreIdea[] }) {
  return (
    <Section title="Core ideas" count={ideas.length || undefined}>
      <p className="hint">{WEB_COPY.ideaHint}</p>
      <div className="pick-list">
        {ideas.map((c) => (
          <button key={c.id} className="snap" onClick={() => replaceRoute({ name: 'story', storyId: story.id, tab: 'web', itemId: webItem('idea', c.id) })}>
            <b>{ideaTitle(c.title)}</b>
            <span>{c.carriedBy.length === 1 ? '1 thread' : `${c.carriedBy.length} threads`}</span>
          </button>
        ))}
        <div className="acts">
          <button className="btn small" onClick={async () => replaceRoute({ name: 'story', storyId: story.id, tab: 'web', itemId: webItem('idea', await createCoreIdea(story.id)) })}>
            <Icon name="plus" size={12} /> New core idea
          </button>
        </div>
      </div>
      <p className="web-guide-line">{WEB_COPY.guideOff}</p>
    </Section>
  )
}

/** The Web's sidebar: the picked core idea in its editor, or the picked part with its plain evidence; and the symbols. */
export function WebSidebar({ story, scenes, itemId, rightTab }: Props) {
  const web = useWebParts(story, scenes)
  const item = parseWebItem(itemId)
  if (!web) return null

  if (rightTab === 'symbols') {
    return (
      <>
        <SymbolsPanel story={story} selectedId={item?.kind === 'symbol' ? item.id : undefined} />
        <Section title="Settings" count={web.settings.length || undefined}>
          <SettingsList story={story} selectedId={item?.kind === 'setting' ? item.id : undefined} onSelect={(id) => replaceRoute({ name: 'story', storyId: story.id, tab: 'web', itemId: webItem('setting', id) })} />
        </Section>
      </>
    )
  }

  if (item?.kind === 'idea') {
    const idea = web.coreIdeas.find((c) => c.id === item.id)
    if (idea) return <CoreIdeaEditor key={idea.id} idea={idea} story={story} scenes={scenes} onSetAside={() => replaceRoute({ name: 'story', storyId: story.id, tab: 'web' })} />
  } else if (item) {
    return <Part key={itemId} story={story} scenes={scenes} web={web} kind={item.kind} id={item.id} />
  }
  return <IdeasList story={story} ideas={web.coreIdeas} />
}

import { useEffect, useState } from 'react'
import { WEB_COPY } from '../craft/web'
import { createCoreIdea } from '../db'
import { navigate, replaceRoute } from '../route'
import type { Scene, Story } from '../types'
import { Graph, Legend } from '../web/Graph'
import { parseWebItem } from '../web/item'
import { ALL_SHOWN, type WebFilters } from '../web/types'
import { useWebModel } from '../web/useWebModel'
import { Icon } from './Icons'
import './web-pane.css'

interface Props {
  story: Story
  scenes: Scene[]
  itemId?: string
}

const FILTERS_KEY = 'parchemin.web.filters'

/** What the Web shows is the writer's choice on this device, kept between visits. */
function useFilters(): [WebFilters, (f: WebFilters) => void] {
  const [filters, setFilters] = useState<WebFilters>(() => {
    try {
      const raw = JSON.parse(localStorage.getItem(FILTERS_KEY) ?? 'null') as Partial<WebFilters> | null
      return { show: { ...ALL_SHOWN.show, ...raw?.show }, cooccurrence: raw?.cooccurrence ?? true }
    } catch {
      return ALL_SHOWN
    }
  })
  useEffect(() => {
    try {
      localStorage.setItem(FILTERS_KEY, JSON.stringify(filters))
    } catch {
      // the switches just won't be remembered
    }
  }, [filters])
  return [filters, setFilters]
}

/** The Web of a story: the writer's core ideas and the parts that carry them, drawn as a graph. For the writer only. */
export function WebPane({ story, scenes, itemId }: Props) {
  const [filters, setFilters] = useFilters()
  const web = useWebModel(story, scenes, filters)
  const picked = parseWebItem(itemId) ? itemId! : null

  const head = (
    <div className="pane-head">
      <div className="crumbs">
        <span className="crumb-story"><b title={story.title}>{story.title || 'Untitled story'}</b><span aria-hidden>›</span></span>
        <b className="web-crumb">Web</b>
        <span className="chip lock-chip"><Icon name="lock" size={12} />{WEB_COPY.neverExported}</span>
      </div>
      <span className="hint web-guide" title={WEB_COPY.guideOff}>{WEB_COPY.guideOff}</span>
    </div>
  )
  if (!web) return head

  const newIdea = async () => navigate({ name: 'story', storyId: story.id, tab: 'web', itemId: `idea:${await createCoreIdea(story.id)}` })
  if (!web.coreIdeas.length) {
    return (
      <>
        {head}
        <div className="pane-scroll">
          <div className="pane-empty">
            <h2>No core ideas yet</h2>
            <p>{WEB_COPY.noIdeas}</p>
            <p style={{ marginTop: 14 }}><button className="btn primary" onClick={newIdea}>New core idea</button></p>
            <p className="hint" style={{ marginTop: 18 }}>The Web is for you only. It is in your backup file, and in no export of the story.</p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      {head}
      <div className="web">
        <Graph
          nodes={web.model.nodes}
          edges={web.model.edges}
          picked={picked}
          // picking is moving within the page, so Back leaves the Web instead of stepping through nodes
          onPick={(key) => replaceRoute({ name: 'story', storyId: story.id, tab: 'web', itemId: key ?? undefined })}
          onOpen={(key) => {
            const item = parseWebItem(key)
            if (!item) return
            if (item.kind === 'chapter') navigate({ name: 'story', storyId: story.id, tab: 'write', itemId: item.id })
            else if (item.kind === 'character') navigate({ name: 'story', storyId: story.id, tab: 'cast', itemId: item.id })
            else if (item.kind === 'board') navigate({ name: 'story', storyId: story.id, tab: 'canvas', itemId: item.id })
          }}
        />
        <Legend counts={web.model.counts} filters={filters} onChange={setFilters} />
      </div>
    </>
  )
}

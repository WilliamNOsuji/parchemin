import { Icon } from './Icons'
import type { Scene, Story } from '../types'

interface Props {
  story: Story
  scenes: Scene[]
  itemId?: string
}

/** The Web of a story: its core ideas and parts. The Web units fill this in; until then it says so. */
export function WebPane({ story }: Props) {
  return (
    <>
      <div className="pane-head">
        <div className="crumbs">
          <span className="crumb-story"><b title={story.title}>{story.title || 'Untitled story'}</b><span aria-hidden>›</span></span>
          <b>Web</b>
          <span className="chip"><Icon name="lock" size={12} />For you only · never exported</span>
        </div>
      </div>
      <div className="pane-scroll">
        <div className="pane-empty">
          <h2>The Web is being built</h2>
          <p>Your core ideas and the parts of the story that carry them, drawn as a web. It is on its way.</p>
        </div>
      </div>
    </>
  )
}

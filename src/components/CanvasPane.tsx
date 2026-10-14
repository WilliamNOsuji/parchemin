import type { Scene, Story } from '../types'

interface Props {
  story: Story
  scenes: Scene[]
  boardId?: string
  onOpenRight: (tab: string) => void
}

/** The boards of a story. The canvas units fill this in; until then it says so. */
export function CanvasPane({ story }: Props) {
  return (
    <>
      <div className="pane-head">
        <div className="crumbs"><span className="crumb-story"><b title={story.title}>{story.title || 'Untitled story'}</b><span aria-hidden>›</span></span><span>Boards</span></div>
      </div>
      <div className="pane-scroll">
        <div className="pane-empty">
          <h2>The boards are being built</h2>
          <p>A board is a table for the pieces of your story. It is on its way.</p>
        </div>
      </div>
    </>
  )
}

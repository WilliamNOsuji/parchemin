import type { Scene, Story } from '../types'

interface Props {
  story: Story
  scenes: Scene[]
  itemId?: string
  rightTab: string
}

/** The picked core idea or part, and the symbols. The Web units fill this in. */
export function WebSidebar(_props: Props) {
  return <p className="hint pad">The Web is being built.</p>
}

import type { Scene, Story } from '../types'

interface Props {
  story: Story
  scenes: Scene[]
  boardId?: string
  rightTab: string
}

/** The boards list, the picked card and the board's facts. The canvas units fill this in. */
export function CanvasSidebar(_props: Props) {
  return <p className="hint pad">The boards are being built.</p>
}

import type { ReactNode } from 'react'
import { Icon, type IconName } from './Icons'

export interface RightTab {
  id: string
  icon: IconName
  title: string
}

/** The right sidebar: a row of icon tabs, then the panel for the one that is on. Sections inside collapse like Obsidian's. */
export function RightSidebar({ tabs, active, onPick, onClose, label, children }: { tabs: RightTab[]; active: string; onPick: (id: string) => void; onClose: () => void; label: string; children: ReactNode }) {
  return (
    <aside className="right" aria-label={label}>
      <div className="rtabs" role="tablist">
        {tabs.map((t) => (
          <button key={t.id} role="tab" className={`rt${t.id === active ? ' on' : ''}`} aria-selected={t.id === active} title={t.title} aria-label={t.title} onClick={() => onPick(t.id)}>
            <Icon name={t.icon} />
          </button>
        ))}
        <button className="rt close" title="Hide the sidebar" aria-label="Hide the sidebar" onClick={onClose}>
          <Icon name="sidebarRight" size={16} />
        </button>
      </div>
      <div className="rbody">{children}</div>
    </aside>
  )
}

/** One collapsible section of a sidebar panel. */
export function Section({ title, count, open = true, children }: { title: ReactNode; count?: ReactNode; open?: boolean; children: ReactNode }) {
  return (
    <details className="sec" open={open}>
      <summary>
        {title}
        {count !== undefined && count !== null && count !== '' ? <small>{count}</small> : null}
      </summary>
      <div className="cnt">{children}</div>
    </details>
  )
}

import { useLiveQuery } from 'dexie-react-hooks'
import { propsCount, SETTING_COPY, settingName } from '../craft/settings'
import { createSetting, db } from '../db'
import type { Setting, Story } from '../types'
import { Icon } from './Icons'
import './settings.css'

/** The story's settings, one row each, and a way to start a new one. */
export function SettingsList({ story, selectedId, onSelect }: { story: Story; selectedId?: string; onSelect: (id: string) => void }) {
  const settings = useLiveQuery(() => db.settings.where('storyId').equals(story.id).sortBy('createdAt'), [story.id])
  if (!settings) return null
  return (
    <div className="pick-list">
      {settings.length === 0 && <p className="hint">{SETTING_COPY.empty}</p>}
      {settings.map((s: Setting) => (
        <button key={s.id} className={`snap${s.id === selectedId ? ' active' : ''}`} aria-pressed={s.id === selectedId} onClick={() => onSelect(s.id)}>
          <b><Icon name="place" size={13} style={{ color: 'var(--place)', verticalAlign: '-2px', marginRight: 6 }} />{settingName(s)}</b>
          <span>{propsCount(s)}</span>
        </button>
      ))}
      <div className="acts">
        <button className="btn small" onClick={async () => onSelect(await createSetting(story.id))}><Icon name="plus" size={12} /> New setting</button>
      </div>
    </div>
  )
}

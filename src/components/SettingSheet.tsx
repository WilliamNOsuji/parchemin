import { useState } from 'react'
import { propsFrom, SETTING_COPY, SETTING_FIELDS, settingName } from '../craft/settings'
import { db, setAsideSetting } from '../db'
import type { Setting } from '../types'
import { GrowingText } from './GrowingText'
import { useAutosave } from './useAutosave'
import './settings.css'

/** A setting sheet: the name, then the place asked obstacle-first, saved as the writer types. */
export function SettingSheet({ setting, onSetAside }: { setting: Setting; onSetAside?: () => void }) {
  const [s, update, flush] = useAutosave(setting, (id, patch) => db.settings.update(id, { ...patch, updatedAt: Date.now() }))
  // props are typed one per line, so the text keeps the line being typed until it is saved as a list
  const [propsText, setPropsText] = useState(() => setting.props.join('\n'))

  return (
    <div className="setting-sheet">
      <input className="setting-name" aria-label="Setting name" value={s.name} placeholder="Name this place" onChange={(e) => update({ name: e.target.value })} />
      <p className="hint">{SETTING_COPY.lead}</p>
      {SETTING_FIELDS.map((f) => {
        const value = f.key === 'props' ? propsText : s[f.key]
        return (
          <label className="field" key={f.key}>
            <span>{f.label}</span>
            <GrowingText
              value={value}
              placeholder={f.placeholder}
              onChange={(e) => {
                if (f.key === 'props') {
                  setPropsText(e.target.value)
                  update({ props: propsFrom(e.target.value) })
                } else update({ [f.key]: e.target.value })
              }}
            />
            {!value.trim() && <small className="hint">{f.hint}</small>}
          </label>
        )
      })}
      <div className="acts">
        <button
          className="btn small quiet"
          onClick={async () => {
            if (!window.confirm(SETTING_COPY.aside(settingName(s)))) return
            await flush() // the drawer gets the latest edits
            await setAsideSetting(s.id)
            onSetAside?.()
          }}
        >
          Move to the drawer
        </button>
      </div>
    </div>
  )
}

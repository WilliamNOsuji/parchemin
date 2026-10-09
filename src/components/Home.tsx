import { useLiveQuery } from 'dexie-react-hooks'
import { useRef, useState } from 'react'
import { exportBackup, restoreBackup } from '../backup'
import { db } from '../db'
import { randomPrompt } from '../prompts'
import { useInstallPrompt } from '../useInstallPrompt'
import { Epigraph, TodayCard } from './Why'
import { DrawerSection } from './DrawerSection'
import { navigate } from '../route'

export function Home({ onNewStory }: { onNewStory: () => void }) {
  const recent = useLiveQuery(() => db.stories.orderBy('updatedAt').reverse().limit(6).toArray(), [])
  const [prompt, setPrompt] = useState(() => randomPrompt('stuck'))
  const [backupMsg, setBackupMsg] = useState('')
  const install = useInstallPrompt()
  const fileInput = useRef<HTMLInputElement>(null)

  const onRestore = async (file: File) => {
    try {
      const { stories } = await restoreBackup(file)
      setBackupMsg(`Restored ${stories} ${stories === 1 ? 'story' : 'stories'} from backup.`)
    } catch (e) {
      setBackupMsg(e instanceof Error ? e.message : 'Could not restore this file.')
    }
  }

  return (
    <div className="home">
      <h1>What will you write today?</h1>
      <p className="lede">A quiet place to write the thing only you can write. Draft it, shape it, finish it. Everything stays on this device.</p>
      <div className="row wrap">
        <button className="btn primary big" onClick={onNewStory}>＋ Start a new story</button>
        {install && <button className="btn big" onClick={() => void install()}>Install app</button>}
      </div>

      <Epigraph />
      <TodayCard />

      {recent && recent.length > 0 && (
        <section>
          <h2>Pick up where you left off</h2>
          <ul className="recent">
            {recent.map((s) => (
              <li key={s.id}>
                <button className="recent-card" onClick={() => navigate({ name: 'story', storyId: s.id, tab: 'write' })}>
                  <strong>{s.title}</strong>
                  <small className="muted">Edited {new Date(s.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}</small>
                  {s.tags.length > 0 && <small>{s.tags.map((t) => `#${t}`).join(' ')}</small>}
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h2>A nudge, if you need one</h2>
        <blockquote className="prompt-card">{prompt}</blockquote>
        <button className="btn" onClick={() => setPrompt(randomPrompt('stuck', prompt))}>Another one</button>
      </section>

      <section>
        <h2>Your data</h2>
        <p className="muted">Everything lives in this browser. Save a backup file to keep it safe or move it to another device.</p>
        <div className="row wrap">
          <button className="btn" onClick={() => void exportBackup()}>Download backup</button>
          <button className="btn" onClick={() => fileInput.current?.click()}>Restore from backup…</button>
          <input
            ref={fileInput}
            type="file"
            accept="application/json,.json"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0]
              e.target.value = ''
              if (f) void onRestore(f)
            }}
          />
        </div>
        {backupMsg && <p role="status" className="muted">{backupMsg}</p>}
        <p className="muted"><small>Restoring adds the backup's stories and overwrites any with the same id. Nothing else is removed.</small></p>
      </section>

      <DrawerSection />
    </div>
  )
}

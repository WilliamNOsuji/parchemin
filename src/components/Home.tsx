import { useLiveQuery } from 'dexie-react-hooks'
import { useState } from 'react'
import { db } from '../db'
import { randomPrompt } from '../prompts'
import { useInstallPrompt } from '../useInstallPrompt'
import { Epigraph, TodayCard } from './Why'
import { DrawerSection } from './DrawerSection'
import { BackupNudge, SafekeepingPanel, SuggestionsNote } from './Safekeeping'
import { navigate } from '../route'

export function Home({ onNewStory }: { onNewStory: () => void }) {
  const recent = useLiveQuery(() => db.stories.orderBy('updatedAt').reverse().limit(6).toArray(), [])
  const [prompt, setPrompt] = useState(() => randomPrompt('stuck'))
  const install = useInstallPrompt()

  return (
    <div className="home">
      <h1>What will you write today?</h1>
      <p className="lede">A quiet place to write the thing only you can write. Draft it, shape it, finish it. Everything stays on this device.</p>
      <div className="row wrap">
        <button className="btn primary big" onClick={onNewStory}>＋ Start a new story</button>
        {install && <button className="btn big" onClick={() => void install()}>Install app</button>}
      </div>

      <BackupNudge />
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

      <SafekeepingPanel />
      <DrawerSection />
      <SuggestionsNote />
    </div>
  )
}

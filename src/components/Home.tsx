import { useLiveQuery } from 'dexie-react-hooks'
import { useState } from 'react'
import { paragraphsOf } from '../craft/dialogue'
import { db } from '../db'
import { randomPrompt } from '../prompts'
import { navigate } from '../route'
import { chaptersOf, numberOf, wordsOf, type SceneRef } from '../sceneIndex'
import type { Story } from '../types'
import { useInstallPrompt } from '../useInstallPrompt'
import { DrawerGlance } from './DrawerSection'
import { Icon } from './Icons'
import { BackupNudge, SafekeepingGlance } from './Safekeeping'
import { Epigraph, TodayBlock } from './Why'

const num = (n: number) => n.toLocaleString()
const day = (t: number) => new Date(t).toLocaleDateString([], { month: 'short', day: 'numeric' })

/** The last paragraph you wrote, plus the note you left about what happens next. Tomorrow starts here. */
function Waiting({ index, stories }: { index: SceneRef[]; stories: Story[] }) {
  const storyIds = new Set(stories.map((s) => s.id))
  const latest = index.filter((s) => storyIds.has(s.storyId) && s.words > 0).reduce<SceneRef | null>((a, s) => (!a || s.updatedAt > a.updatedAt ? s : a), null)
  const scene = useLiveQuery(() => (latest ? db.scenes.get(latest.id) : undefined), [latest?.id])
  if (!latest || !scene) {
    return stories.length ? (
      <section className="waiting" aria-labelledby="waiting-heading">
        <h2 id="waiting-heading">A sentence waiting</h2>
        <p className="hint">Your last sentence will wait here, with your note on what comes next.</p>
      </section>
    ) : null
  }
  const story = stories.find((s) => s.id === scene.storyId)
  const n = numberOf(index, latest)
  const last = paragraphsOf(scene.content).at(-1)
  return (
    <section className="waiting" aria-labelledby="waiting-heading">
      <h2 id="waiting-heading">A sentence waiting</h2>
      {last && <blockquote>{last}</blockquote>}
      {scene.waiting?.trim() ? (
        <>
          <div className="lbl">What happens next, in your words from last time</div>
          <div className="note">{scene.waiting}</div>
        </>
      ) : (
        <>
          <div className="lbl">What happens next?</div>
          <textarea
            key={scene.id}
            rows={2}
            aria-label="What happens next"
            placeholder="Leave a line for tomorrow, so the next sitting starts with a sentence already waiting."
            defaultValue=""
            onBlur={(e) => e.target.value.trim() && db.scenes.update(scene.id, { waiting: e.target.value.trim() })}
          />
        </>
      )}
      <div className="acts">
        <button className="btn primary" onClick={() => navigate({ name: 'story', storyId: scene.storyId, tab: 'write', itemId: scene.id })}>Open Chapter {n}</button>
        <span className="hint">Chapter {n} · {num(scene.words)} words{story ? ` · ${story.title}` : ''}</span>
      </div>
    </section>
  )
}

export function Home({ stories, index, onNewStory }: { stories: Story[]; index: SceneRef[]; onNewStory: () => void }) {
  const [prompt, setPrompt] = useState(() => randomPrompt('stuck'))
  const install = useInstallPrompt()
  const recent = stories.slice(0, 3)

  return (
    <div className="pane-scroll">
      <div className="home">
        <Epigraph />
        <h1>What will you write today?</h1>
        {(stories.length === 0 || install) && (
          <div className="acts lead-acts">
            {stories.length === 0 && <button className="btn primary big" onClick={onNewStory}><Icon name="plus" size={14} /> Start a new story</button>}
            {install && <button className="btn big" onClick={() => void install()}>Install app</button>}
          </div>
        )}
        <BackupNudge />
        {stories.length === 0 ? (
          <div className="home-empty">
            <p>A quiet place to write the thing only you can write. Draft it, shape it, finish it. Everything stays on this device, and nothing is ever written for you.</p>
          </div>
        ) : null}
        <div className="home-grid">
          {recent.length > 0 && (
            <section aria-labelledby="recent-heading">
              <h2 id="recent-heading">Pick up where you left off</h2>
              <ul className="recent">
                {recent.map((s) => {
                  const chapters = chaptersOf(index, s.id)
                  const last = chapters.reduce<SceneRef | null>((a, c) => (!a || c.updatedAt > a.updatedAt ? c : a), null)
                  return (
                    <li key={s.id}>
                      <button onClick={() => navigate({ name: 'story', storyId: s.id, tab: 'write', itemId: last?.id })}>
                        <span className="what">
                          <span className="t">{s.title || 'Untitled story'}</span>
                          <span className="c">{last ? `Chapter ${numberOf(index, last)} · ${last.title || 'Untitled'}` : 'No chapters yet'}</span>
                        </span>
                        <span className="m">Edited {day(s.updatedAt)}<br />{num(wordsOf(index, s.id))} words</span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </section>
          )}
          <TodayBlock />
          <Waiting index={index} stories={stories} />
          <section className="nudge-section" aria-labelledby="nudge-heading">
            <h2 id="nudge-heading">A nudge, if you need one</h2>
            <p className="prompt">{prompt}</p>
            <div className="acts">
              <button className="btn" onClick={() => setPrompt(randomPrompt('stuck', prompt))}>Another one</button>
              <span className="hint">Prompts are suggestions only. Nothing is written for you.</span>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

/** Safekeeping at a glance and the drawer: one glance away instead of a scroll down the home page. */
export function HomeSidebar({ tab, say }: { tab: string; say: (s: string) => void }) {
  return tab === 'drawer' ? <DrawerGlance /> : <SafekeepingGlance say={say} />
}

import { useLiveQuery } from 'dexie-react-hooks'
import { castAgainst } from '../craft/cast'
import { HERO_QUESTIONS } from '../craft/heroCheck'
import { FAMILIES, voiceById } from '../craft/voices'
import { createCharacter, db } from '../db'
import { navigate } from '../route'
import type { Character, Story } from '../types'
import { Icon } from './Icons'

export const Avatar = ({ c, className = 'av' }: { c: Pick<Character, 'name' | 'image'>; className?: string }) =>
  c.image ? <img className={className} src={c.image} alt="" /> : <span className={className} aria-hidden>{c.name.trim()[0]?.toUpperCase() ?? '?'}</span>

/** One card per person: name, role, voice, what they want in a room, and their function. A character with no function is a card you can see is empty. */
export function CastPane({ story, selectedId }: { story: Story; selectedId?: string }) {
  const characters = useLiveQuery(() => db.characters.where('storyId').equals(story.id).sortBy('createdAt'), [story.id], [] as Character[])
  const select = (id?: string) => navigate({ name: 'story', storyId: story.id, tab: 'cast', itemId: id })
  const readings = castAgainst(characters)

  return (
    <>
      <div className="pane-head">
        <div className="crumbs"><span className="crumb-story"><b title={story.title}>{story.title || 'Untitled story'}</b><span aria-hidden>›</span></span><span>Cast</span></div>
      </div>
      <div className="pane-scroll">
        <div className="cast">
          <div className="cast-head">
            <h1>Cast</h1>
            <div className="acts">
              <button className="btn small primary" onClick={async () => select(await createCharacter(story.id))}><Icon name="plus" size={12} /> New character</button>
            </div>
          </div>
          <ul className="cast-grid">
            {characters.map((c) => {
              const voice = voiceById(c.craft?.voice)
              const family = voice ? FAMILIES.find((f) => f.id === voice.family) : undefined
              const want = c.craft?.wantInRoom?.trim() || voice?.want
              const fn = c.craft?.function?.trim()
              const ticks = HERO_QUESTIONS.filter((q) => c.craft?.heroChecks?.[q.id]).length
              const sel = c.id === selectedId
              return (
                <li key={c.id}>
                  <button className={`card${sel ? ' sel' : ''}`} onClick={() => select(sel ? undefined : c.id)} aria-pressed={sel}>
                    <div className="top">
                      <Avatar c={c} />
                      <div>
                        <div className="nm">{c.name.trim() || 'Unnamed'}</div>
                        <div className="role">{c.role.trim() || 'No role yet'}</div>
                      </div>
                    </div>
                    {voice ? (
                      <span className="vc">{voice.name} <span className="hint">· {family?.name} · {voice.tactic.toLocaleLowerCase()}</span></span>
                    ) : (
                      <span className="vc hint">No voice yet</span>
                    )}
                    {want ? <div className="ln"><span>Wants in a room:</span> {want}</div> : <div className="ln empty">What do they want in a room?</div>}
                    {fn ? <div className="ln"><span>Function:</span> {fn}</div> : <div className="ln empty">No function yet: what can they do that nobody else in the book can?</div>}
                    {ticks > 0 && (
                      <div className="hc">
                        <span className="bar" role="img" aria-label={`Hero check ${ticks} of ${HERO_QUESTIONS.length}`}><i style={{ width: `${(ticks / HERO_QUESTIONS.length) * 100}%` }} /></span>
                        Hero check {ticks} of {HERO_QUESTIONS.length}
                      </div>
                    )}
                  </button>
                </li>
              )
            })}
            <li>
              <button className="card add" onClick={async () => select(await createCharacter(story.id))}>
                <span className="row"><Icon name="plus" size={14} /> Add a character</span>
              </button>
            </li>
          </ul>
          <p className="against">
            <b>Cast against each other.</b>{' '}
            {readings.length ? readings.map((r) => r.text).join(' ') : characters.length < 2 ? 'Give two characters a voice and this line will read them against each other.' : 'Give each character a voice in the sidebar, and this line will say which pairs have friction built in, and which pairs share a family.'}
          </p>
        </div>
      </div>
    </>
  )
}

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { chapterFacts, parseScript, sameSpeaker, scriptFacts, speakersOf, spokenLines, TACTICS, type Facts } from '../craft/dialogue'
import { voiceById } from '../craft/voices'
import { db, logWords, uid } from '../db'
import type { Character, ChapterDialogue, Scene, Speaker } from '../types'
import { countTextWords } from '../words'

const SAVE_DELAY = 600
const PASTE_THRESHOLD = 1500
const num = (n: number) => n.toLocaleString()
const plural = (n: number, one: string, many: string) => `${num(n)} ${n === 1 ? one : many}`
const clip = (s: string, n = 160) => (s.length > n ? `${s.slice(0, n).trimEnd()}…` : s)

type Source = 'chapter' | 'script'
interface Ctx {
  f: Facts
  d: ChapterDialogue
  scene: Scene
  source: Source
  tactics: { named: number; lines: number }
}

/** The lesson's checklists. The ticks are the writer's own; a fact sits beside an item when the text can show one. */
const PASS: { group: string; credit?: string; items: { id: string; text: string; fact?: (c: Ctx) => ReactNode }[] }[] = [
  {
    group: 'Wants and tactics',
    credit: 'after Robert McKee',
    items: [
      {
        id: 'want',
        text: 'One sentence of want per speaker, for this chapter, and the wants don’t fit together.',
        fact: ({ d }) => {
          const s = d.speakers ?? []
          return s.length ? `${num(s.filter((p) => p.want?.trim()).length)} of ${plural(s.length, 'speaker has', 'speakers have')} a want written down.` : 'No speakers listed yet.'
        },
      },
      {
        id: 'tactic',
        text: 'Every line does something to someone, and you could name it with a verb ending in -ing.',
        fact: ({ tactics }) => (tactics.lines ? `${num(tactics.named)} of ${plural(tactics.lines, 'script line names', 'script lines name')} a tactic.` : null),
      },
      {
        id: 'feelings',
        text: 'Nobody says what they feel.',
        fact: ({ f }) =>
          f.feelings.length ? (
            <>
              {plural(f.feelings.length, 'line says', 'lines say')} a feeling out loud:
              <ul>{f.feelings.slice(0, 5).map((l, i) => <li key={i}><q>{clip(l, 100)}</q></li>)}</ul>
            </>
          ) : f.lines ? (
            'No line says “I feel…” or “I’m angry” or the like.'
          ) : null,
      },
      {
        id: 'object',
        text: 'An object in the room carries what can’t be said.',
        fact: ({ d, scene }) => (d.object?.trim() ? `The thing in the room: ${d.object}.` : scene.plan?.prop?.trim() ? `The plan’s prop: ${scene.plan.prop}.` : null),
      },
      {
        id: 'value',
        text: 'It opens on one named value and closes on a different one. The turn can be tiny, but not absent.',
        fact: ({ d }) => (d.opens?.trim() || d.closes?.trim() ? `Opens on “${d.opens?.trim() || '…'}”, closes on “${d.closes?.trim() || '…'}”.` : null),
      },
    ],
  },
  {
    group: 'Argument and rhythm',
    credit: 'after Aaron Sorkin',
    items: [
      { id: 'objects', text: 'Someone objects to what the last person said. It is an argument or a negotiation, not a chat.' },
      {
        id: 'question',
        text: 'At least once, a question is answered with a question.',
        fact: ({ f }) => (f.lines ? `${plural(f.questionPairs, 'question is', 'questions are')} answered with a question.` : null),
      },
      {
        id: 'interrupt',
        text: 'People interrupt and trail off.',
        fact: ({ f }) => (f.lines ? `${plural(f.brokenOff, 'line breaks off or trails', 'lines break off or trail')} away (— or …).` : null),
      },
      {
        id: 'specific',
        text: 'Real numbers and real names, not vague words.',
        fact: ({ f }) => (!f.lines ? null : f.withNumbers === 1 ? '1 line has a number in it.' : `${num(f.withNumbers)} lines have numbers in them.`),
      },
      { id: 'silence', text: 'The beat of silence comes before the line that matters, not after.' },
      {
        id: 'picture',
        text: 'It ends on a picture (a door, an object set down, a hand not taken), not on a line that explains.',
        fact: ({ f, source }) => (f.last ? <>{source === 'chapter' ? 'The chapter ends:' : 'The script ends:'} <q>{clip(f.last)}</q></> : null),
      },
    ],
  },
  {
    group: 'What it is really about',
    credit: 'after Quentin Tarantino',
    items: [
      { id: 'asymmetry', text: 'Someone knows more than someone else. The reader counts.', fact: ({ d }) => (d.knowsMore?.trim() ? `Who knows more: ${d.knowsMore}.` : null) },
      {
        id: 'surface',
        text: 'The talk is about something small, and the real subject is never named.',
        fact: ({ d, f }) =>
          !d.underneath?.trim() || !f.lines
            ? null
            : f.named.length
              ? `Words from your “really about” note in the dialogue: ${f.named.map(([w, n]) => `${w} (${plural(n, 'line', 'lines')})`).join(', ')}.`
              : 'No word from your “really about” note appears in the dialogue.',
      },
      { id: 'calm', text: 'Calm on top, danger underneath. Nobody has to get angry for the reader to worry.' },
      { id: 'teasing', text: 'Teasing shows how far back these people go.' },
    ],
  },
  {
    group: 'On the page',
    items: [
      {
        id: 'said',
        text: '“Said” and “asked”; other tags only now and then.',
        fact: ({ f, source }) =>
          source === 'script'
            ? null
            : f.plainTags || f.otherTags.length
              ? `Said or asked: ${num(f.plainTags)}.${f.otherTags.length ? ` Others: ${f.otherTags.map(([v, n]) => (n > 1 ? `${v} (${n})` : v)).join(', ')}.` : ''}`
              : null,
      },
      {
        id: 'adverbs',
        text: 'What the body does, instead of an adverb on the tag.',
        fact: ({ f, source }) => (source === 'chapter' && f.adverbs.length ? `Adverbs on tags: ${f.adverbs.join(', ')}.` : null),
      },
      { id: 'paragraphs', text: 'New speaker, new paragraph. The line that matters stands alone; short paragraphs speed things up.' },
      {
        id: 'phonetic',
        text: 'Accents come through word choice and rhythm, not phonetic spelling.',
        fact: ({ f }) => (f.phonetic.length ? `Spelled out: ${f.phonetic.slice(0, 6).join(', ')}.` : null),
      },
    ],
  },
  {
    group: 'Two passes',
    items: [
      { id: 'covered', text: 'With the names covered, a stranger could tell who is speaking.' },
      { id: 'aloud', text: 'Read it aloud, or recorded it and listened back, and fixed whatever I stumbled on.' },
    ],
  },
]
const PASS_COUNT = PASS.reduce((n, g) => n + g.items.length, 0)

/** Saves one field of the chapter's dialogue, without touching the others. */
const saveField = (sceneId: string, key: string, value: unknown) => db.scenes.update(sceneId, { [`dialogue.${key}`]: value } as never)

function Field({ label, value, placeholder, onSave, hint }: { label: string; value?: string; placeholder: string; onSave: (v: string) => void; hint?: ReactNode }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input defaultValue={value ?? ''} placeholder={placeholder} onBlur={(e) => e.target.value !== (value ?? '') && onSave(e.target.value)} />
      {hint && <small className="muted">{hint}</small>}
    </label>
  )
}

function SpeakerCard({ speaker, character, onSave, onRemove }: { speaker: Speaker; character?: Character; onSave: (patch: Partial<Speaker>) => void; onRemove: () => void }) {
  const voice = voiceById(character?.craft?.voice)
  const want = character?.craft?.wantInRoom || voice?.want
  const fear = character?.craft?.fear || voice?.fear
  return (
    <li className="speaker">
      <div className="row between">
        {character ? (
          <strong>{speaker.name}</strong>
        ) : (
          <input className="speaker-name" aria-label="Speaker name" defaultValue={speaker.name} placeholder="Name" onBlur={(e) => e.target.value !== speaker.name && onSave({ name: e.target.value.trim() })} />
        )}
        <button className="icon-btn" aria-label={`Remove ${speaker.name || 'speaker'}`} onClick={onRemove}>✕</button>
      </div>
      {voice && <small className="muted">{voice.name}: usually {voice.tactic.toLocaleLowerCase()}.</small>}
      <Field label="Wants, in this chapter" value={speaker.want} placeholder={want ? `Their card says: ${want}` : 'One sentence, for the next few minutes'} onSave={(want) => onSave({ want })} />
      <Field label="Won’t say" value={speaker.unsaid} placeholder="Thinks it, keeps it back" onSave={(unsaid) => onSave({ unsaid })} />
      <Field label="Can’t say" value={speaker.unsayable} placeholder={fear ? `Their fear: ${fear}` : 'Would never say it, or doesn’t know it'} onSave={(unsayable) => onSave({ unsayable })} />
    </li>
  )
}

/**
 * Dialogue for one chapter, in the lesson's order: who wants what, a fast script, the names covered, then a pass.
 * Nothing here writes a line. It holds the writer's prep and reads back what they wrote.
 */
export function DialoguePanel({ scene, characters }: { scene: Scene; characters: Character[] }) {
  const d = scene.dialogue ?? {}
  // The panel is the only place that edits speakers and ticks, and it remounts per chapter, so it keeps
  // them itself and writes them through: a tick shows at once, and two quick edits can't undo each other.
  const [speakers, setSpeakers] = useState<Speaker[]>(() => d.speakers ?? [])
  const [checks, setChecks] = useState<Record<string, boolean>>(() => d.checks ?? {})
  const charById = new Map(characters.map((c) => [c.id, c]))

  // the script saves itself like the chapter does, and counts toward today's words the same way
  const [script, setScript] = useState(d.script ?? '')
  const saved = useRef({ text: d.script ?? '', words: countTextWords(d.script ?? '') })
  const timer = useRef<number | undefined>(undefined)
  const saveScript = (text: string) => {
    window.clearTimeout(timer.current)
    if (text === saved.current.text) return
    const words = countTextWords(text)
    const delta = words - saved.current.words
    saved.current = { text, words }
    if (Math.abs(delta) <= PASTE_THRESHOLD) void logWords(delta)
    void saveField(scene.id, 'script', text)
  }
  const latest = useRef(script)
  latest.current = script
  useEffect(() => () => saveScript(latest.current), []) // eslint-disable-line react-hooks/exhaustive-deps

  const lines = useMemo(() => parseScript(script), [script])
  const spoken = useMemo(() => spokenLines(scene.content), [scene.content])
  const [source, setSource] = useState<Source>(() => (spokenLines(scene.content).length || !d.script ? 'chapter' : 'script'))
  const f = useMemo(() => (source === 'chapter' ? chapterFacts(scene.content, d.underneath) : scriptFacts(script, d.underneath)), [source, scene.content, script, d.underneath])

  const saveSpeakers = (next: Speaker[]) => {
    setSpeakers(next)
    void saveField(scene.id, 'speakers', next)
  }
  const tick = (id: string, on: boolean) => {
    setChecks((c) => ({ ...c, [id]: on }))
    void saveField(scene.id, `checks.${id}`, on)
  }
  const addSpeaker = (characterId: string) => {
    const c = charById.get(characterId)
    saveSpeakers([...speakers, { id: uid(), characterId: c?.id, name: c?.name ?? '' }])
  }
  const castLeft = characters.filter((c) => !speakers.some((s) => s.characterId === c.id))

  // which steps start open is decided once, so adding a speaker doesn't fold the section away mid-edit
  const [opened] = useState(() => ({ prep: !speakers.length, script: !!speakers.length && !d.script }))

  const ticked = PASS.reduce((n, g) => n + g.items.filter((i) => checks[i.id]).length, 0)
  const ctx: Ctx = { f, d, scene, source, tactics: { named: lines.filter((l) => l.tactic).length, lines: lines.length } }
  const voiceTactics = [...new Set(speakers.map((s) => voiceById(charById.get(s.characterId ?? '')?.craft?.voice)?.tactic.toLocaleLowerCase()).filter(Boolean))]

  return (
    <div className="stack dialogue">
      <p className="muted small">Nobody says what they mean. Decide who wants what, draft the talk fast as a script, then check it.</p>

      <details className="dlg-step" open={opened.prep}>
        <summary>Who wants what <span className="muted">{speakers.length ? plural(speakers.length, 'speaker', 'speakers') : ''}</span></summary>
        <ul className="speakers">
          {speakers.map((s) => (
            <SpeakerCard
              key={s.id}
              speaker={s}
              character={charById.get(s.characterId ?? '')}
              onSave={(patch) => saveSpeakers(speakers.map((x) => (x.id === s.id ? { ...x, ...patch } : x)))}
              onRemove={() => saveSpeakers(speakers.filter((x) => x.id !== s.id))}
            />
          ))}
        </ul>
        <label className="field">
          <span>Add a speaker</span>
          <select value="" onChange={(e) => e.target.value && addSpeaker(e.target.value === 'other' ? '' : e.target.value)}>
            <option value="">Choose…</option>
            {castLeft.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            <option value="other">Someone not in the cast</option>
          </select>
        </label>
        {speakers.length > 1 && <p className="muted small">The wants should not fit together. If everyone can get what they want, there is no scene.</p>}
        <Field
          label="The thing in the room"
          value={d.object}
          placeholder={scene.plan?.prop?.trim() ? `The plan’s prop: ${scene.plan.prop}` : 'An object that carries what nobody can say'}
          onSave={(v) => void saveField(scene.id, 'object', v)}
        />
        <div className="grid-2">
          <Field label="Opens on" value={d.opens} placeholder="In control" onSave={(v) => void saveField(scene.id, 'opens', v)} />
          <Field label="Closes on" value={d.closes} placeholder="Shown up" onSave={(v) => void saveField(scene.id, 'closes', v)} />
        </div>
        {scene.plan?.turn?.trim() && <small className="muted">The plan’s turn: {scene.plan.turn}</small>}
        <Field label="What it is really about" value={d.underneath} placeholder="Never said out loud" onSave={(v) => void saveField(scene.id, 'underneath', v)} />
        <Field label="Who knows more" value={d.knowsMore} placeholder="Someone in the room, or the reader" onSave={(v) => void saveField(scene.id, 'knowsMore', v)} />
      </details>

      <details className="dlg-step" open={opened.script}>
        <summary>Draft it as a script <span className="muted">{lines.length ? plural(lines.length, 'line', 'lines') : ''}</span></summary>
        <p className="muted small">
          Fast and rough, in one sitting: only the talk and a little action. Speed makes the interruptions for you. One speech per line, <code>NAME: what they say</code>, or{' '}
          <code>NAME (tactic): …</code> to name what the line does. The screenplay layout works too. None of this goes into the chapter.
        </p>
        <textarea
          className="script"
          rows={12}
          aria-label="Script"
          spellCheck
          value={script}
          placeholder={'GENE (testing): You know that isn’t real food.\nBOB (defending): This is chicken, Gene.'}
          onChange={(e) => {
            setScript(e.target.value)
            window.clearTimeout(timer.current)
            const text = e.target.value
            timer.current = window.setTimeout(() => saveScript(text), SAVE_DELAY)
          }}
          onBlur={() => saveScript(script)}
        />
        <small className="muted">
          Tactics are verbs ending in -ing: {TACTICS.slice(0, 6).join(', ')}…{voiceTactics.length ? ` From the voice cards: ${voiceTactics.join(', ')}.` : ''}
        </small>
        {lines.some((l) => l.tactic) && (
          <div>
            <span className="dlg-label">Beats</span>
            <ol className="beats">
              {lines.filter((l) => l.tactic).map((l, i) => <li key={i}><strong>{l.speaker}</strong> {l.tactic}</li>)}
            </ol>
          </div>
        )}
      </details>

      <div className="dlg-source">
        <span className="dlg-label" aria-hidden>Check</span>
        <div className="chips" role="group" aria-label="What to check">
        <button className={`chip${source === 'chapter' ? ' on' : ''}`} aria-pressed={source === 'chapter'} onClick={() => setSource('chapter')}>
          The chapter ({num(spoken.length)})
        </button>
        <button className={`chip${source === 'script' ? ' on' : ''}`} aria-pressed={source === 'script'} onClick={() => setSource('script')}>
          The script ({num(lines.length)})
        </button>
        </div>
      </div>

      <CoverTheNames
        key={source}
        lines={source === 'chapter' ? spoken.map((s) => ({ text: s.text, answer: s.paragraph })) : lines.map((l) => ({ text: l.text, answer: l.speaker }))}
        names={source === 'chapter' ? [...new Set([...speakers.map((s) => s.name), ...characters.map((c) => c.name)].filter((n) => n.trim() && n !== 'New character'))] : speakersOf(lines)}
        byName={source === 'script'}
      />

      <details className="dlg-step">
        <summary>Dialogue pass <span className="muted">{ticked}/{PASS_COUNT}</span></summary>
        {PASS.map((g) => (
          <section key={g.group} className="dlg-group">
            <h4>{g.group}{g.credit && <span className="muted"> · {g.credit}</span>}</h4>
            <ul className="checks">
              {g.items.map((item) => {
                const fact = item.fact?.(ctx)
                return (
                  <li key={item.id}>
                    <label>
                      <input type="checkbox" checked={!!checks[item.id]} onChange={(e) => tick(item.id, e.target.checked)} />
                      <span>{item.text}</span>
                    </label>
                    {fact && <div className="dlg-fact muted">{fact}</div>}
                  </li>
                )
              })}
            </ul>
          </section>
        ))}
        <p className="muted small">
          <strong>Watch for:</strong> people who are too articulate (real people repeat themselves, cut in and say the wrong thing), dialogue that explains the plot, and
          profanity or pop culture used only for the surface.
        </p>
        <p className="muted small">Speech is read from quotation marks. The tag, adverb, feeling and spelling notes read English only.</p>
      </details>
    </div>
  )
}

/**
 * The names covered: could a stranger tell who is speaking? The writer, or better a friend, picks a name for each line,
 * then reveals. For a script the answer is the speaker; for prose it is the whole paragraph, since Parchemin can't know
 * who speaks there. No total and no score.
 */
function CoverTheNames({ lines, names, byName }: { lines: { text: string; answer: string }[]; names: string[]; byName: boolean }) {
  const [guesses, setGuesses] = useState<Record<number, string>>({})
  const [shown, setShown] = useState(false)
  return (
    <details className="dlg-step">
      <summary>Cover the names <span className="muted">{lines.length ? plural(lines.length, 'line', 'lines') : ''}</span></summary>
      {!lines.length ? (
        <p className="muted small">No speech found yet. In the chapter, speech is read from quotation marks.</p>
      ) : (
        <>
          <p className="muted small">With the names and tags gone, could a stranger tell who is speaking? It works best with someone else: hand them the screen.</p>
          <ol className="cover">
            {lines.map((l, i) => {
              const guess = guesses[i] ?? ''
              return (
                <li key={i}>
                  <q>{l.text}</q>
                  <div className="row wrap">
                    {names.length > 0 && (
                      <select aria-label={`Who says line ${i + 1}?`} value={guess} onChange={(e) => setGuesses((g) => ({ ...g, [i]: e.target.value }))}>
                        <option value="">Who says it?</option>
                        {names.map((n) => <option key={n} value={n}>{n}</option>)}
                      </select>
                    )}
                    {shown && byName && (
                      <span className={guess && sameSpeaker(guess, l.answer) ? 'match' : 'muted'}>
                        {guess && sameSpeaker(guess, l.answer) ? '✓ ' : ''}{l.answer}
                      </span>
                    )}
                  </div>
                  {shown && !byName && <small className="muted">{l.answer}</small>}
                </li>
              )
            })}
          </ol>
          <button className="btn small" onClick={() => setShown((s) => !s)}>{shown ? 'Cover again' : 'Reveal'}</button>
        </>
      )}
    </details>
  )
}

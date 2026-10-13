import { FAMILIES, VOICES, voiceById } from '../craft/voices'
import { HERO_QUESTIONS } from '../craft/heroCheck'
import type { CharacterCraft } from '../types'
import { GrowingText } from './GrowingText'
import { Section } from './RightSidebar'

interface Props {
  craft: CharacterCraft | undefined
  onChange: (next: CharacterCraft) => void
}

/** A voice is a want, a fear and a way of seeing other people, not an accent. */
export function VoiceSection({ craft = {}, onChange }: Props) {
  const set = (patch: Partial<CharacterCraft>) => onChange({ ...craft, ...patch })
  const voice = voiceById(craft.voice)
  const spice = voiceById(craft.spice)

  const text = (key: keyof CharacterCraft, label: string, placeholder: string) => (
    <label className="field" key={key}>
      <span>{label}</span>
      <GrowingText value={(craft[key] as string | undefined) ?? ''} onChange={(e) => set({ [key]: e.target.value })} placeholder={placeholder} />
    </label>
  )
  const voiceSelect = (value: string | undefined, onPick: (id: string) => void, label: string) => (
    <label className="field">
      <span>{label}</span>
      <select value={value ?? ''} onChange={(e) => onPick(e.target.value)}>
        <option value="">None yet</option>
        {FAMILIES.map((f) => (
          <optgroup key={f.id} label={`${f.name} want ${f.wants}`}>
            {VOICES.filter((v) => v.family === f.id).map((v) => (
              <option key={v.id} value={v.id}>{v.name}{v.dark ? ' (dark)' : ''}</option>
            ))}
          </optgroup>
        ))}
      </select>
    </label>
  )

  return (
    <>
      <Section title="Voice" count={voice ? `${voice.name} · ${voice.tactic.toLocaleLowerCase()}` : undefined}>
        <p className="hint">Characters do not sound different because of accents. They sound different because they want different things, fear different things and see people differently.</p>
        <div className="two">
          {voiceSelect(craft.voice, (id) => set({ voice: id || undefined }), 'Main voice')}
          {voiceSelect(craft.spice, (id) => set({ spice: id || undefined }), 'A dash of')}
        </div>
        {spice && <p className="hint">The dash drops away under pressure. Under pressure, {spice.name} gives way to {voice?.name ?? 'the main voice'}.</p>}
        {voice && (
          <div className="voice-card">
            <div className="row between wrap">
              <strong>{voice.name}</strong>
              <span className="chip on">{voice.tactic}</span>
            </div>
            <dl>
              <dt>Wants in the room</dt><dd>{voice.want}</dd>
              <dt>Fears</dt><dd>{voice.fear}</dd>
              <dt>Sees others as</dt><dd>{voice.seesOthersAs}</dd>
              <dt>Tell</dt><dd>{voice.tell}</dd>
            </dl>
            <p className="hint">
              <strong>Cast against:</strong> {voice.clashesWith.map((id) => voiceById(id)?.name).filter(Boolean).join(', ')}. Build the supporting cast from these, so every scene has friction.
            </p>
          </div>
        )}
        {text('wantInRoom', 'Wants in a room', voice?.want ? `The card says: ${voice.want.toLocaleLowerCase()}` : 'What they are chasing in this room, not in life')}
        {text('fear', 'Fear (never said aloud)', voice?.fear ?? 'The wound under the voice')}
        {text('seesOthersAs', 'Sees other people as', voice?.seesOthersAs ?? 'Threats, students, burdens, an audience…')}
        {text('signature', 'One line only they would say', 'If it fits anyone else, rewrite it.')}
        {text('function', 'Function in the story', 'Something only they can do')}
      </Section>
      <Section title="Flaw and need">
        {text('psychFlaw', 'Hurts themselves', 'Fear, doubt, grief, control…')}
        {text('moralFlaw', 'Hurts others', 'Who pays for it?')}
        {text('ghost', 'The past still steering them', 'Events, rules or a household, not one tragic afternoon')}
        {text('need', 'Needs (not what they want)', 'What would actually save them as a person')}
      </Section>
    </>
  )
}

/** Ten yes/no questions. The unticked ones come first, because they are tomorrow's work. */
export function HeroCheckSection({ craft = {}, onChange }: Props) {
  const checks = craft.heroChecks ?? {}
  const passed = HERO_QUESTIONS.filter((q) => checks[q.id]).length
  const ordered = [...HERO_QUESTIONS.filter((q) => !checks[q.id]), ...HERO_QUESTIONS.filter((q) => checks[q.id])]
  const left = HERO_QUESTIONS.length - passed
  return (
    <Section title="Hero check" count={`${passed} of ${HERO_QUESTIONS.length}`}>
      <p className="hint">Is this hero strong enough to carry a story?</p>
      <ul className="checks">
        {ordered.map((q) => (
          <li key={q.id}>
            <label>
              <input type="checkbox" checked={!!checks[q.id]} onChange={(e) => onChange({ ...craft, heroChecks: { ...checks, [q.id]: e.target.checked } })} />
              <span>{q.question}</span>
            </label>
            {!checks[q.id] && <small className="hint">If not: {q.ifNo}</small>}
          </li>
        ))}
      </ul>
      <p className="hint">{left === 0 ? 'All ten. This hero can carry the book.' : `${left} left. Each one unticked says what tomorrow's work is.`}</p>
    </Section>
  )
}

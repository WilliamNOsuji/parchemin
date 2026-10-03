import { FAMILIES, VOICES, voiceById } from '../craft/voices'
import { HERO_QUESTIONS } from '../craft/heroCheck'
import type { CharacterCraft } from '../types'

interface Props {
  craft: CharacterCraft | undefined
  onChange: (next: CharacterCraft) => void
}

export function CraftSection({ craft = {}, onChange }: Props) {
  const set = (patch: Partial<CharacterCraft>) => onChange({ ...craft, ...patch })
  const voice = voiceById(craft.voice)
  const checks = craft.heroChecks ?? {}
  const passed = HERO_QUESTIONS.filter((q) => checks[q.id]).length

  const text = (key: keyof CharacterCraft, label: string, placeholder: string) => (
    <label className="field">
      <span>{label}</span>
      <input value={(craft[key] as string | undefined) ?? ''} onChange={(e) => set({ [key]: e.target.value })} placeholder={placeholder} />
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
      <h3>Voice</h3>
      <p className="muted small">
        Characters do not sound different because of accents. They sound different because they want different things, fear different things and see people differently.
      </p>
      <div className="grid-2">
        {voiceSelect(craft.voice, (id) => set({ voice: id || undefined }), 'Main voice')}
        {voiceSelect(craft.spice, (id) => set({ spice: id || undefined }), 'A dash of (drops away under pressure)')}
      </div>

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
          <p className="small">
            <strong>Cast against:</strong>{' '}
            {voice.clashesWith.map((id) => voiceById(id)?.name).filter(Boolean).join(', ')}.
            <span className="muted"> Build the supporting cast from these, so every scene has friction.</span>
          </p>
        </div>
      )}

      <div className="grid-2">
        {text('wantInRoom', 'Wants in this scene', 'What they are chasing in this room, not in life')}
        {text('fear', 'Fear (never said aloud)', 'The wound under the voice')}
        {text('seesOthersAs', 'Sees other people as', voice?.seesOthersAs ?? 'Threats, students, burdens, an audience…')}
        {text('function', 'Function in the story', 'Something only they can do')}
      </div>
      {text('signature', 'Signature line', 'One line only this character would say. If it fits anyone else, rewrite it.')}

      <h3>Flaws and need</h3>
      <div className="grid-2">
        {text('psychFlaw', 'Flaw that hurts themselves', 'Fear, doubt, grief, control…')}
        {text('moralFlaw', 'Flaw that hurts other people', 'Who pays for it?')}
        {text('ghost', 'The past still steering them', 'Events, rules or a household, not one tragic afternoon')}
        {text('need', 'What they need (not what they want)', 'What would actually save them as a person')}
      </div>

      <details className="hero-check">
        <summary>Is this hero strong enough to carry a story? <strong>{passed}/{HERO_QUESTIONS.length}</strong></summary>
        <ul className="checks">
          {HERO_QUESTIONS.map((q) => (
            <li key={q.id}>
              <label>
                <input type="checkbox" checked={!!checks[q.id]} onChange={(e) => set({ heroChecks: { ...checks, [q.id]: e.target.checked } })} />
                <span>{q.question}</span>
              </label>
              {!checks[q.id] && <small className="muted">If not: {q.ifNo}</small>}
            </li>
          ))}
        </ul>
      </details>
    </>
  )
}

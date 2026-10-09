import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { useLiveQuery } from 'dexie-react-hooks'
import { useEffect, useRef, useState, type RefObject } from 'react'
import { createCharacter, db, setAsideCharacter } from '../db'
import { navigate } from '../route'
import type { Character, Story } from '../types'
import { CraftSection } from './CharacterCraft'
import { Toolbar } from './Toolbar'

/** Downscale to a small square JPEG so profile images stay cheap to store locally. */
async function toAvatar(file: File, size = 320): Promise<string> {
  const bmp = await createImageBitmap(file)
  const side = Math.min(bmp.width, bmp.height)
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  canvas.getContext('2d')!.drawImage(bmp, (bmp.width - side) / 2, (bmp.height - side) / 2, side, side, 0, 0, size, size)
  bmp.close()
  return canvas.toDataURL('image/jpeg', 0.85)
}

const Avatar = ({ c, size = 40 }: { c: Pick<Character, 'name' | 'image'>; size?: number }) =>
  c.image ? (
    <img className="avatar" src={c.image} alt="" width={size} height={size} />
  ) : (
    <span className="avatar placeholder" style={{ width: size, height: size, fontSize: size * 0.45 }} aria-hidden>
      {c.name.trim()[0]?.toUpperCase() ?? '?'}
    </span>
  )

type Flush = () => Promise<unknown>

function CharacterEditor({ character, flushRef }: { character: Character; flushRef: RefObject<Flush | null> }) {
  const [c, setC] = useState(character)
  const latest = useRef(character)
  const timer = useRef<number | undefined>(undefined)
  const dirty = useRef(false)

  const flush: Flush = () => {
    window.clearTimeout(timer.current)
    if (!dirty.current) return Promise.resolve()
    dirty.current = false
    // update, not put: a late save must not bring back a character that was just moved to the drawer
    const { id, ...changes } = latest.current
    return db.characters.update(id, { ...changes, updatedAt: Date.now() })
  }
  flushRef.current = flush
  const update = (patch: Partial<Character>) => {
    latest.current = { ...latest.current, ...patch }
    dirty.current = true
    setC(latest.current)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(flush, 500)
  }

  useEffect(() => () => void flush(), []) // eslint-disable-line react-hooks/exhaustive-deps

  const bio = useEditor(
    {
      extensions: [StarterKit.configure({ heading: { levels: [2] } }), Placeholder.configure({ placeholder: 'Backstory, voice, quirks, anything that makes them real…' })],
      content: character.bio,
      editorProps: { attributes: { class: 'prose bio', writingsuggestions: 'false', 'aria-label': 'Biography' } },
      onUpdate: ({ editor }) => update({ bio: editor.getHTML() }),
    },
    [],
  )

  return (
    <div className="char-editor">
      <div className="char-top">
        <label className="avatar-pick" title="Change image">
          <Avatar c={c} size={96} />
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={async (e) => {
              const f = e.target.files?.[0]
              if (f) update({ image: await toAvatar(f) })
            }}
          />
          <span className="avatar-hint">{c.image ? 'Change' : 'Add image'}</span>
        </label>
        <div className="stack grow">
          <input className="char-name" aria-label="Name" value={c.name} onChange={(e) => update({ name: e.target.value })} placeholder="Name" />
          <input aria-label="Role" value={c.role} onChange={(e) => update({ role: e.target.value })} placeholder="Role (protagonist, mentor, rival…)" />
          {c.image && <button className="link-btn" onClick={() => update({ image: null })}>Remove image</button>}
        </div>
      </div>

      <h3>Profile</h3>
      <div className="fields">
        {c.fields.map((f, i) => (
          <div className="field-row" key={i}>
            <input
              className="field-label"
              aria-label="Field name"
              value={f.label}
              onChange={(e) => update({ fields: c.fields.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)) })}
            />
            <input
              aria-label={f.label || 'Field value'}
              value={f.value}
              onChange={(e) => update({ fields: c.fields.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)) })}
            />
            <button className="icon-btn" aria-label={`Remove ${f.label}`} onClick={() => update({ fields: c.fields.filter((_, j) => j !== i) })}>✕</button>
          </div>
        ))}
        <button className="btn small" onClick={() => update({ fields: [...c.fields, { label: 'New field', value: '' }] })}>＋ Add field</button>
      </div>

      <CraftSection craft={c.craft} onChange={(craft) => update({ craft })} />

      <h3>Biography</h3>
      {bio && (
        <div className="bio-wrap">
          <Toolbar editor={bio} />
          <EditorContent editor={bio} />
        </div>
      )}
    </div>
  )
}

export function CharactersTab({ story, selectedId }: { story: Story; selectedId?: string }) {
  const characters = useLiveQuery(() => db.characters.where('storyId').equals(story.id).sortBy('createdAt'), [story.id], [] as Character[])
  const selected = characters.find((c) => c.id === selectedId)
  const select = (id?: string) => navigate({ name: 'story', storyId: story.id, tab: 'characters', itemId: id })
  const flushEditor = useRef<Flush | null>(null)

  return (
    <div className={`chars${selected ? ' has-selection' : ''}`}>
      <aside className="char-list">
        <button className="btn primary" onClick={async () => select(await createCharacter(story.id))}>＋ New character</button>
        {characters.length === 0 && <p className="muted">Who is in your story? Add the first character to build their profile.</p>}
        <ul>
          {characters.map((c) => (
            <li key={c.id}>
              <button className={`char-item${c.id === selected?.id ? ' active' : ''}`} onClick={() => select(c.id)}>
                <Avatar c={c} />
                <span className="stack tight">
                  <strong className="ellipsis">{c.name || 'Unnamed'}</strong>
                  <small className="muted ellipsis">{c.role || 'No role yet'}</small>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </aside>
      <section className="char-detail">
        {selected ? (
          <>
            <div className="char-actions">
              <button className="link-btn back" onClick={() => select(undefined)}>← All characters</button>
              <button
                className="link-btn"
                onClick={async () => {
                  if (!window.confirm(`Move ${selected.name || 'this character'} to the drawer? You can put them back from the home screen.`)) return
                  await flushEditor.current?.() // the drawer gets the latest edits
                  await setAsideCharacter(selected.id)
                  select(undefined)
                }}
              >
                Move to the drawer
              </button>
            </div>
            <CharacterEditor key={selected.id} character={selected} flushRef={flushEditor} />
          </>
        ) : (
          <p className="muted pad">Select a character to edit their profile.</p>
        )}
      </section>
    </div>
  )
}

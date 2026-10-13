import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { useEffect, useRef, useState } from 'react'
import { db, setAsideCharacter } from '../db'
import { navigate } from '../route'
import type { Character } from '../types'
import { Avatar } from './CastPane'
import { HeroCheckSection, VoiceSection } from './CharacterCraft'
import { Section } from './RightSidebar'
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

function BioEditor({ html, onChange }: { html: string; onChange: (html: string) => void }) {
  const bio = useEditor(
    {
      extensions: [StarterKit.configure({ heading: { levels: [2] } }), Placeholder.configure({ placeholder: 'Backstory, voice, quirks, anything that makes them real…' })],
      content: html,
      editorProps: { attributes: { class: 'prose bio', writingsuggestions: 'false', 'aria-label': 'Biography' } },
      onUpdate: ({ editor }) => onChange(editor.getHTML()),
    },
    [],
  )
  if (!bio) return null
  return (
    <div className="bio-wrap">
      <Toolbar editor={bio} />
      <EditorContent editor={bio} />
    </div>
  )
}

/**
 * The selected character, edited in the sidebar: profile, voice, hero check and biography. A character card on the
 * Cast page is the live profile: change it here and the card changes.
 */
export function CharacterSidebar({ character, tab }: { character: Character; tab: string }) {
  const [c, setC] = useState(character)
  const latest = useRef(character)
  const timer = useRef<number | undefined>(undefined)
  const dirty = useRef(false)

  const flush = () => {
    window.clearTimeout(timer.current)
    if (!dirty.current) return Promise.resolve()
    dirty.current = false
    // update, not put: a late save must not bring back a character that was just moved to the drawer
    const { id, ...changes } = latest.current
    return db.characters.update(id, { ...changes, updatedAt: Date.now() })
  }
  const update = (patch: Partial<Character>) => {
    latest.current = { ...latest.current, ...patch }
    dirty.current = true
    setC(latest.current)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(flush, 500)
  }
  useEffect(() => () => void flush(), []) // eslint-disable-line react-hooks/exhaustive-deps

  if (tab === 'voice') return <VoiceSection craft={c.craft} onChange={(craft) => update({ craft })} />
  if (tab === 'hero') return <HeroCheckSection craft={c.craft} onChange={(craft) => update({ craft })} />
  return (
    <>
    <Section title="Profile" count={c.name.trim() || undefined}>
      <div className="row" style={{ alignItems: 'flex-start', gap: 12 }}>
        <label className="avatar-pick" title="Change image">
          <Avatar c={c} />
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
        <div className="stack grow" style={{ gap: 6 }}>
          <input className="char-name" aria-label="Name" value={c.name} onChange={(e) => update({ name: e.target.value })} placeholder="Name" />
          <input aria-label="Role" value={c.role} onChange={(e) => update({ role: e.target.value })} placeholder="Role: hero, mentor, rival…" />
          {c.image && <button className="link-btn" onClick={() => update({ image: null })}>Remove image</button>}
        </div>
      </div>
      {c.fields.map((f, i) => (
        <div className="field-row" key={i}>
          <input className="field-label" aria-label="Field name" value={f.label} onChange={(e) => update({ fields: c.fields.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)) })} />
          <input aria-label={f.label || 'Field value'} value={f.value} onChange={(e) => update({ fields: c.fields.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)) })} />
          <button className="icon-btn" aria-label={`Remove ${f.label}`} onClick={() => update({ fields: c.fields.filter((_, j) => j !== i) })}>✕</button>
        </div>
      ))}
      <div className="acts">
        <button className="btn small" onClick={() => update({ fields: [...c.fields, { label: 'New field', value: '' }] })}>Add a field</button>
        <button
          className="btn small quiet"
          onClick={async () => {
            if (!window.confirm(`Move ${c.name.trim() || 'this character'} to the drawer? You can put them back from the drawer.`)) return
            await flush() // the drawer gets the latest edits
            await setAsideCharacter(c.id)
            navigate({ name: 'story', storyId: c.storyId, tab: 'cast' })
          }}
        >
          Move to the drawer
        </button>
      </div>
    </Section>
    <Section title="Biography">
      <BioEditor html={character.bio} onChange={(bio) => update({ bio })} />
    </Section>
    </>
  )
}

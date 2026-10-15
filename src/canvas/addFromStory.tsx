import { useLiveQuery } from 'dexie-react-hooks'
import { useEffect, useRef, useState } from 'react'
import { Icon } from '../components/Icons'
import { addImage, createSetting, db } from '../db'
import { cleanImage } from '../sanitize'
import type { Scene, Story } from '../types'
import { newNode } from './cards'
import { kindOf, refOf, type CanvasDoc, type CanvasNode } from './types'

/** The longest side a picture keeps on a board, so a photo does not swell the library or the backup. */
const MAX_SIDE = 1600

async function shrink(file: File): Promise<string | null> {
  try {
    const bmp = await createImageBitmap(file)
    const scale = Math.min(1, MAX_SIDE / Math.max(bmp.width, bmp.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(bmp.width * scale)
    canvas.height = Math.round(bmp.height * scale)
    canvas.getContext('2d')!.drawImage(bmp, 0, 0, canvas.width, canvas.height)
    bmp.close()
    // a drawing keeps its transparency; a photo is kept as a JPEG
    return cleanImage(file.type === 'image/png' ? canvas.toDataURL('image/png') : canvas.toDataURL('image/jpeg', 0.85))
  } catch {
    return null
  }
}

/**
 * Asks for a picture on this computer and keeps it in the library, for a board. Resolves to the picture's id and name,
 * or null when the writer cancels or the file is not a picture Parchemin can keep.
 */
export function pickImage(storyId: string): Promise<{ id: string; name: string } | null | 'not-a-picture'> {
  return new Promise((resolve) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/png,image/jpeg,image/gif,image/webp,image/avif'
    input.addEventListener('change', async () => {
      const file = input.files?.[0]
      if (!file) return resolve(null)
      const data = await shrink(file)
      if (!data) return resolve('not-a-picture')
      const name = file.name.replace(/\.[^.]+$/, '')
      resolve({ id: await addImage(storyId, name, data), name })
    })
    input.addEventListener('cancel', () => resolve(null))
    input.click()
  })
}

export type AddFilter = 'all' | 'chapter' | 'character' | 'setting'

interface Props {
  story: Story
  scenes: Scene[]
  doc: CanvasDoc
  /** The node arrives at 0, 0; whoever adds it places it. */
  onAdd: (node: CanvasNode) => void
  /** Opened from the toolbar, for one kind only. */
  open?: AddFilter | null
  onOpenChange?: (open: AddFilter | null) => void
  /** Said when a picture cannot be added. */
  onSay?: (text: string) => void
}

/**
 * "Add from the story": the chapters, characters and settings not yet on this board, and a picture from this
 * computer. A card added from the story stays live; it is the same chapter, person or place, never a copy.
 */
export function AddFromStory({ story, scenes, doc, onAdd, open: controlled, onOpenChange, onSay }: Props) {
  const [own, setOwn] = useState<AddFilter | null>(null)
  const open = controlled !== undefined ? controlled : own
  const setOpen = (v: AddFilter | null) => (onOpenChange ? onOpenChange(v) : setOwn(v))
  const box = useRef<HTMLDivElement>(null)
  const parts = useLiveQuery(async () => {
    const [characters, settings] = await Promise.all([db.characters.where('storyId').equals(story.id).sortBy('createdAt'), db.settings.where('storyId').equals(story.id).sortBy('createdAt')])
    return { characters, settings }
  }, [story.id])

  useEffect(() => {
    if (!open) return
    const close = (e: MouseEvent) => !box.current?.contains(e.target as Node) && setOpen(null)
    const esc = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      e.stopPropagation()
      setOpen(null)
      box.current?.querySelector<HTMLButtonElement>('.add-toggle')?.focus()
    }
    document.addEventListener('mousedown', close)
    document.addEventListener('keydown', esc, true)
    return () => {
      document.removeEventListener('mousedown', close)
      document.removeEventListener('keydown', esc, true)
    }
  })
  // the list opens on its first choice, so the keyboard can go straight down it
  useEffect(() => {
    if (open) box.current?.querySelector<HTMLButtonElement>('.add-pop button')?.focus()
  }, [open])

  const on = new Set(doc.nodes.map((n) => `${kindOf(n)}:${refOf(n)}`))
  const chapters = scenes.map((s, i) => ({ s, n: i + 1 })).filter(({ s }) => !on.has(`chapter:${s.id}`))
  const characters = (parts?.characters ?? []).filter((c) => !on.has(`character:${c.id}`))
  const settings = (parts?.settings ?? []).filter((s) => !on.has(`setting:${s.id}`))
  const add = (node: CanvasNode) => {
    setOpen(null)
    onAdd(node)
  }
  const show = (k: AddFilter) => open === 'all' || open === k
  const nothing = (!show('chapter') || !chapters.length) && (!show('character') || !characters.length) && (!show('setting') || !settings.length)

  return (
    <div className="menu add-from" ref={box}>
      <button className="btn small quiet add-toggle" aria-haspopup="menu" aria-expanded={!!open} onClick={() => setOpen(open ? null : 'all')}>
        Add from the story <span aria-hidden>⌄</span>
      </button>
      {open && (
        <div className="menu-pop add-pop" role="menu" aria-label="Add from the story">
          {show('chapter') && chapters.length > 0 && <div className="add-h">Chapters</div>}
          {show('chapter') && chapters.map(({ s, n }) => (
            <button key={s.id} role="menuitem" onClick={() => add(newNode('chapter', { x: 0, y: 0 }, s.id))}>
              <span className={`dot ${s.status}`} /> {n} · {s.title.trim() || 'Untitled'}
            </button>
          ))}
          {show('character') && characters.length > 0 && <div className="add-h">Characters</div>}
          {show('character') && characters.map((c) => (
            <button key={c.id} role="menuitem" onClick={() => add(newNode('character', { x: 0, y: 0 }, c.id))}>
              <Icon name="person" size={13} /> {c.name.trim() || 'Unnamed'}
            </button>
          ))}
          {show('setting') && settings.length > 0 && <div className="add-h">Settings</div>}
          {show('setting') && settings.map((s) => (
            <button key={s.id} role="menuitem" onClick={() => add(newNode('setting', { x: 0, y: 0 }, s.id))}>
              <Icon name="place" size={13} /> {s.name.trim() || 'Unnamed setting'}
            </button>
          ))}
          {nothing && <p className="hint add-none">{open === 'character' ? 'Everyone in the cast is on this board.' : open === 'chapter' ? 'Every chapter is on this board.' : 'Everything from the story is on this board.'}</p>}
          {show('setting') && (
            <button role="menuitem" onClick={async () => add(newNode('setting', { x: 0, y: 0 }, await createSetting(story.id, 'New setting')))}>
              <Icon name="plus" size={13} /> New setting
            </button>
          )}
          {open === 'all' && (
            <button
              role="menuitem"
              onClick={async () => {
                setOpen(null)
                const img = await pickImage(story.id)
                if (img === 'not-a-picture') onSay?.('That file is not a picture Parchemin can keep: PNG, JPEG, GIF, WebP or AVIF.')
                else if (img) onAdd(newNode('image', { x: 0, y: 0 }, img.id))
              }}
            >
              <Icon name="image" size={13} /> Image…
            </button>
          )}
        </div>
      )}
    </div>
  )
}

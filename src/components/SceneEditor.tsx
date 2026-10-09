import { EditorContent, useEditor } from '@tiptap/react'
import Placeholder from '@tiptap/extension-placeholder'
import Typography from '@tiptap/extension-typography'
import { useEffect, useMemo, useRef, useState } from 'react'
import { db, logWords, touchStory } from '../db'
import { storyKit } from '../editorSchema'
import { requestPersistOnce } from '../safekeeping'
import type { Scene } from '../types'
import { countWords } from '../words'
import { ActiveBlock } from './activeBlock'
import { Toolbar } from './Toolbar'

export type PanelKind = 'prompts' | 'snapshots' | 'notes' | null

interface Props {
  scene: Scene
  focus: boolean
  panel: PanelKind
  onPanel: (p: PanelKind) => void
  onToggleFocus: () => void
}

const SAVE_DELAY = 600
const RETRY_DELAY = 5000
const PASTE_THRESHOLD = 1500
const SAVE_FAILED =
  'This chapter could not be saved on this device. Your words are still here on screen. Copy them somewhere safe, and check that the device has free space. Parchemin keeps trying.'
const reducedMotion = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)') : null

export function SceneEditor({ scene, focus, panel, onPanel, onToggleFocus }: Props) {
  const lastSaved = useRef(scene.content)
  const savedWords = useRef(scene.words)
  const pending = useRef<string | null>(null)
  const timer = useRef<number | undefined>(undefined)
  const focusRef = useRef(focus)
  focusRef.current = focus
  const [words, setWords] = useState(scene.words)
  const [dirty, setDirty] = useState(false)
  const [saveFailed, setSaveFailed] = useState(false)
  const failed = useRef(false)

  const flush = () => {
    window.clearTimeout(timer.current)
    const html = pending.current
    if (html === null) return
    pending.current = null
    lastSaved.current = html
    const w = countWords(html)
    // count typing toward today's tally, but not a big paste landing in one save
    const delta = w - savedWords.current
    savedWords.current = w
    if (Math.abs(delta) <= PASTE_THRESHOLD) void logWords(delta)
    db.scenes
      .update(scene.id, { content: html, words: w, updatedAt: Date.now() })
      .then(() => {
        void touchStory(scene.storyId)
        void requestPersistOnce() // the first real save is the moment to ask the browser to keep the data
        failed.current = false
        setSaveFailed(false)
        if (pending.current === null) setDirty(false)
      })
      .catch(() => {
        // keep the text and try again, unless newer text is already waiting to be saved
        pending.current ??= html
        failed.current = true
        setSaveFailed(true)
        window.clearTimeout(timer.current)
        timer.current = window.setTimeout(flush, RETRY_DELAY)
      })
  }

  const extensions = useMemo(
    () => [
      storyKit(),
      Placeholder.configure({ placeholder: 'Once upon a time…' }),
      Typography,
      ActiveBlock,
    ],
    [],
  )

  const editor = useEditor(
    {
      extensions,
      content: scene.content,
      // writingsuggestions keeps the browser's own AI rewrites out of the draft, where the browser honours it
      editorProps: { attributes: { class: 'prose', spellcheck: 'true', writingsuggestions: 'false', 'aria-label': 'Story text' } },
      onUpdate: ({ editor }) => {
        const html = editor.getHTML()
        pending.current = html
        setWords(countWords(html))
        setDirty(true)
        window.clearTimeout(timer.current)
        timer.current = window.setTimeout(flush, SAVE_DELAY)
      },
      onBlur: flush,
      onSelectionUpdate: ({ editor }) => {
        // typewriter scrolling: keep the caret near the vertical middle in focus mode
        if (!focusRef.current) return
        const scroller = document.querySelector('.editor-scroll')
        if (!scroller) return
        const caret = editor.view.coordsAtPos(editor.state.selection.from).top
        const box = scroller.getBoundingClientRect()
        const delta = caret - (box.top + box.height * 0.4)
        if (Math.abs(delta) > 24) scroller.scrollBy({ top: delta, behavior: reducedMotion?.matches ? 'auto' : 'smooth' })
      },
    },
    [],
  )

  // pick up changes made elsewhere (e.g. restoring a snapshot)
  useEffect(() => {
    if (!editor || scene.content === lastSaved.current) return
    window.clearTimeout(timer.current)
    pending.current = null
    lastSaved.current = scene.content
    editor.commands.setContent(scene.content, { emitUpdate: false })
    // start counting from the restored text, so the restore itself is not logged as writing
    savedWords.current = scene.words
    setWords(scene.words)
    setDirty(false)
  }, [editor, scene.content, scene.words])

  // flush unsaved text when leaving the scene or closing the tab
  useEffect(() => {
    const onUnload = (e: BeforeUnloadEvent) => {
      flush()
      // the browser asks before closing if the last save failed
      if (failed.current) e.preventDefault()
    }
    window.addEventListener('beforeunload', onUnload)
    return () => {
      window.removeEventListener('beforeunload', onUnload)
      flush()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!editor) return null

  const panelBtn = (kind: Exclude<PanelKind, null>, label: string) => (
    <button
      type="button"
      className={`tb-text${panel === kind ? ' on' : ''}`}
      aria-pressed={panel === kind}
      onClick={() => onPanel(panel === kind ? null : kind)}
    >
      {label}
    </button>
  )

  return (
    <section className="editor-wrap">
      <Toolbar editor={editor}>
        {panelBtn('prompts', '💡 Unblock')}
        {panelBtn('snapshots', '🕘 Snapshots')}
        {panelBtn('notes', '📝 Notes')}
        <button type="button" className="tb-text" onClick={onToggleFocus} title="Focus mode (F11 or Ctrl+Shift+F)">
          {focus ? 'Exit focus' : '◎ Focus'}
        </button>
      </Toolbar>
      <div className="editor-scroll">
        <div className="page">
          <input
            className="scene-title"
            aria-label="Chapter title"
            defaultValue={scene.title}
            onBlur={(e) => {
              const title = e.target.value.trim() || 'Untitled'
              if (title !== scene.title) void db.scenes.update(scene.id, { title })
            }}
          />
          <EditorContent editor={editor} />
        </div>
      </div>
      <p className="save-error" role="alert">{saveFailed ? SAVE_FAILED : ''}</p>
      <footer className="editor-foot">
        <span>{words.toLocaleString()} {words === 1 ? 'word' : 'words'}</span>
        <span className="muted">{saveFailed ? 'Not saved yet' : dirty ? 'Saving…' : 'Saved on this device'}</span>
      </footer>
    </section>
  )
}

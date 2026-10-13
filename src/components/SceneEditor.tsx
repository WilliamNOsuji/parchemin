import { EditorContent, useEditor } from '@tiptap/react'
import Placeholder from '@tiptap/extension-placeholder'
import Typography from '@tiptap/extension-typography'
import { useEffect, useMemo, useRef, useState } from 'react'
import { db, logWords, touchStory } from '../db'
import { setEditorState } from '../editorState'
import { storyKit } from '../editorSchema'
import { STATUSES, type Scene, type SceneStatus, type Story } from '../types'
import { countWords } from '../words'
import { ActiveBlock } from './activeBlock'
import { Icon } from './Icons'
import { BackupNudge } from './Safekeeping'
import { Toolbar } from './Toolbar'

interface Props {
  scene: Scene
  story: Story
  number: number
  focus: boolean
  onToggleFocus: () => void
}

const SAVE_DELAY = 600
const RETRY_DELAY = 5000
const PASTE_THRESHOLD = 1500
const SAVE_FAILED =
  'This chapter could not be saved on this device. Your words are still here on screen. Copy them somewhere safe, and check that the device has free space. Parchemin keeps trying.'
const reducedMotion = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)') : null

/** The chapter in the middle, everything else at the edges. Literata at 18 px on a 620 px measure. */
export function SceneEditor({ scene, story, number, focus, onToggleFocus }: Props) {
  const lastSaved = useRef(scene.content)
  const savedWords = useRef(scene.words)
  const pending = useRef<string | null>(null)
  const timer = useRef<number | undefined>(undefined)
  const focusRef = useRef(focus)
  focusRef.current = focus
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
        failed.current = false
        setSaveFailed(false)
        if (pending.current === null) setEditorState({ sceneId: scene.id, saving: 'saved' })
      })
      .catch(() => {
        // keep the text and try again, unless newer text is already waiting to be saved
        pending.current ??= html
        failed.current = true
        setSaveFailed(true)
        setEditorState({ sceneId: scene.id, saving: 'failed' })
        window.clearTimeout(timer.current)
        timer.current = window.setTimeout(flush, RETRY_DELAY)
      })
  }

  const extensions = useMemo(() => [storyKit(), Placeholder.configure({ placeholder: 'Once upon a time…' }), Typography, ActiveBlock], [])

  const editor = useEditor(
    {
      extensions,
      content: scene.content,
      // writingsuggestions keeps the browser's own AI rewrites out of the draft, where the browser honours it
      editorProps: { attributes: { class: 'prose', spellcheck: 'true', writingsuggestions: 'false', 'aria-label': 'Story text' } },
      onUpdate: ({ editor }) => {
        const html = editor.getHTML()
        pending.current = html
        setEditorState({ sceneId: scene.id, words: countWords(html), saving: 'saving' })
        window.clearTimeout(timer.current)
        timer.current = window.setTimeout(flush, SAVE_DELAY)
      },
      onBlur: flush,
      onSelectionUpdate: ({ editor }) => {
        // typewriter scrolling: keep the caret near the vertical middle in focus mode
        if (!focusRef.current) return
        const scroller = document.querySelector('.manuscript')
        if (!scroller) return
        const caret = editor.view.coordsAtPos(editor.state.selection.from).top
        const box = scroller.getBoundingClientRect()
        const delta = caret - (box.top + box.height * 0.4)
        if (Math.abs(delta) > 24) scroller.scrollBy({ top: delta, behavior: reducedMotion?.matches ? 'auto' : 'smooth' })
      },
    },
    [],
  )

  // the status bar shows this chapter's count while it is open
  useEffect(() => {
    setEditorState({ sceneId: scene.id, words: scene.words, saving: 'saved' })
    return () => setEditorState({ sceneId: null, words: 0, saving: 'saved' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene.id])

  // pick up changes made elsewhere (e.g. restoring a snapshot)
  useEffect(() => {
    if (!editor || scene.content === lastSaved.current) return
    window.clearTimeout(timer.current)
    pending.current = null
    lastSaved.current = scene.content
    editor.commands.setContent(scene.content, { emitUpdate: false })
    // start counting from the restored text, so the restore itself is not logged as writing
    savedWords.current = scene.words
    setEditorState({ sceneId: scene.id, words: scene.words, saving: 'saved' })
  }, [editor, scene.content, scene.words, scene.id])

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

  return (
    <>
      <div className="pane-head">
        <div className="crumbs">
          <span className="crumb-story"><b title={story.title}>{story.title || 'Untitled story'}</b><span aria-hidden>›</span></span>
          <span>Chapter {number}</span>
          <label className={`stat ${scene.status}`} title="Status">
            <span className={`dot ${scene.status}`} />
            <select aria-label="Chapter status" value={scene.status} onChange={(e) => db.scenes.update(scene.id, { status: e.target.value as SceneStatus })}>
              {STATUSES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </label>
        </div>
        <Toolbar editor={editor}>
          <button type="button" className={`tb-fmt${focus ? ' on' : ''}`} onClick={onToggleFocus} title="Focus mode (Ctrl+Shift+F)" aria-label="Focus mode" aria-pressed={focus}>
            <Icon name="focus" size={15} />
          </button>
        </Toolbar>
      </div>
      <p className="save-error" role="alert">{saveFailed ? SAVE_FAILED : ''}</p>
      <div className="manuscript editor-scroll">
        <BackupNudge />
        <div className="sheet">
          <input
            className="sheet-title"
            aria-label="Chapter title"
            defaultValue={scene.title}
            style={{ width: '100%' }}
            onBlur={(e) => {
              const title = e.target.value.trim() || 'Untitled'
              if (title !== scene.title) void db.scenes.update(scene.id, { title })
            }}
          />
          <EditorContent editor={editor} />
        </div>
      </div>
      <div className="focus-hint" aria-hidden>Esc leaves focus · typewriter scrolling on</div>
    </>
  )
}

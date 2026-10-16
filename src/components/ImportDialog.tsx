import { useLiveQuery } from 'dexie-react-hooks'
import { useEffect, useRef, useState, type DragEvent } from 'react'
import { db } from '../db'
import { isMarkdown, MARKDOWN_ACCEPT, planImport, readSources, runImport, type ImportPlan, type ImportSource } from '../importMarkdown'
import { navigate } from '../route'
import type { Story } from '../types'
import { Modal } from './Modal'

const num = (n: number) => n.toLocaleString()
const plural = (n: number, one: string, many: string) => `${num(n)} ${n === 1 ? one : many}`
/** Only the first chapters are listed; the count says the rest. */
const SHOWN = 40

interface Props {
  stories: Story[]
  /** Files already chosen, by a drop on the library tree. */
  files?: File[]
  /** Where they go unless the writer picks otherwise: a story, or a new story in a folder. */
  storyId?: string
  folderId?: string | null
  onClose: () => void
}

/**
 * Markdown files into the library, one or many: as chapters of a new story or at the end of one already here. The
 * chapters are shown before anything is written, and nothing is written until the writer says so.
 */
export function ImportDialog({ stories, files, storyId, folderId = null, onClose }: Props) {
  const [sources, setSources] = useState<ImportSource[]>([])
  const [skipped, setSkipped] = useState(0)
  const [split, setSplit] = useState(true)
  const [plan, setPlan] = useState<ImportPlan | null>(null)
  const [target, setTarget] = useState<string>(storyId && stories.some((s) => s.id === storyId) ? storyId : 'new')
  const [title, setTitle] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [over, setOver] = useState(false)
  const input = useRef<HTMLInputElement>(null)

  const take = async (list: File[]) => {
    setError('')
    const md = list.filter(isMarkdown)
    setSkipped(list.length - md.length)
    if (!md.length) {
      setSources([])
      setError(list.length ? 'None of those is a Markdown file. Parchemin reads files ending in .md or .markdown.' : '')
      return
    }
    setTitle(null)
    setSources(await readSources(md))
  }
  useEffect(() => {
    if (files?.length) void take(files)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // the chapters are worked out again whenever the files or the split change, before anything is written
  useEffect(() => {
    let live = true
    if (!sources.length) return setPlan(null)
    planImport(sources, split).then(
      (p) => live && setPlan(p),
      (e: unknown) => live && setError(e instanceof Error ? e.message : 'Those files could not be read.'),
    )
    return () => {
      live = false
    }
  }, [sources, split])

  const story = stories.find((s) => s.id === target)
  // added to a story, the new chapters are numbered from where they will land
  const existing = useLiveQuery(() => (story ? db.chapters.where('storyId').equals(story.id).count() : 0), [story?.id], 0)
  const defaultTitle = plan?.title ?? (sources.length === 1 ? plan?.chapters[0]?.title : undefined) ?? 'Imported story'
  const words = plan?.chapters.reduce((n, c) => n + c.words, 0) ?? 0

  const drop = {
    onDragOver: (e: DragEvent) => {
      if (!e.dataTransfer.types.includes('Files')) return
      e.preventDefault()
      setOver(true)
    },
    onDragLeave: () => setOver(false),
    onDrop: (e: DragEvent) => {
      e.preventDefault()
      setOver(false)
      void take([...e.dataTransfer.files])
    },
  }

  const submit = async () => {
    if (!plan?.chapters.length) return
    setBusy(true)
    setError('')
    try {
      const out = await runImport(plan, target === 'new' ? { newStory: { title: title ?? defaultTitle, folderId, synopsis: plan.synopsis } } : { storyId: target })
      onClose()
      navigate({ name: 'story', storyId: out.storyId, tab: 'write', itemId: out.firstId })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'The import did not finish, and nothing was added.')
      setBusy(false)
    }
  }

  return (
    <Modal title="Import Markdown" onClose={onClose} wide>
      <form
        className="stack import"
        onSubmit={(e) => {
          e.preventDefault()
          void submit()
        }}
      >
        <input ref={input} type="file" accept={MARKDOWN_ACCEPT} multiple hidden onChange={(e) => void take([...(e.target.files ?? [])]).then(() => (e.target.value = ''))} />
        {!sources.length ? (
          <div className={`import-drop${over ? ' over' : ''}`} {...drop}>
            <p>Drop Markdown files here, one or many.</p>
            <button type="button" className="btn" onClick={() => input.current?.click()}>Choose files…</button>
            <p className="hint">Each file becomes a chapter, in the order of the files' names. A file with headings can be split into a chapter at each one.</p>
          </div>
        ) : (
          <div className="import-files" {...drop}>
            <span>
              {sources.length === 1 ? sources[0].name : plural(sources.length, 'file', 'files')} · {plural(words, 'word', 'words')}
              {over && <span className="muted"> · drop to use these files instead</span>}
            </span>
            <button type="button" className="link-btn" onClick={() => input.current?.click()}>Choose other files…</button>
          </div>
        )}
        {skipped > 0 && <p className="hint">{plural(skipped, 'file was', 'files were')} left out, because {skipped === 1 ? 'it is' : 'they are'} not Markdown.</p>}

        {plan && (
          <>
            <div className="two">
              <label className="field">
                <span>Put them in</span>
                <select value={target} onChange={(e) => setTarget(e.target.value)}>
                  <option value="new">A new story</option>
                  {stories.map((s) => (
                    <option key={s.id} value={s.id}>{`At the end of “${s.title || 'Untitled story'}”`}</option>
                  ))}
                </select>
              </label>
              {target === 'new' && (
                <label className="field">
                  <span>The new story's title</span>
                  <input value={title ?? defaultTitle} onChange={(e) => setTitle(e.target.value)} />
                </label>
              )}
            </div>
            {plan.canSplit && (
              <label className="check">
                <input type="checkbox" checked={split} onChange={(e) => setSplit(e.target.checked)} />
                <span>Start a new chapter at each heading <span className="hint-inline">· off, each file is one chapter</span></span>
              </label>
            )}
            <div className="field">
              <span>{plural(plan.chapters.length, 'chapter', 'chapters')}{story && existing ? `, from chapter ${num(existing + 1)}` : ''}</span>
              <ol className="import-list" start={existing + 1}>
                {plan.chapters.slice(0, SHOWN).map((c, i) => (
                  <li key={i}>
                    <span className="t">{c.title}</span>
                    <span className="w">{num(c.words)}</span>
                  </li>
                ))}
              </ol>
              {plan.chapters.length > SHOWN && <p className="hint">And {plural(plan.chapters.length - SHOWN, 'more chapter', 'more chapters')}.</p>}
            </div>
            {plan.synopsis && (target === 'new' ? <p className="hint">The quote under the file's title becomes the story's synopsis: “{plan.synopsis}”</p> : <p className="hint">The quote under the file's title opens the first chapter; the story keeps its own synopsis.</p>)}
            {plan.pictures > 0 && <p className="hint">{plural(plan.pictures, 'picture', 'pictures')} in the files {plan.pictures === 1 ? 'is' : 'are'} left out: a chapter holds text.</p>}
            {plan.lineParagraphs.length > 0 && <p className="hint">{plan.lineParagraphs.join(', ')} {plan.lineParagraphs.length === 1 ? 'has' : 'have'} no blank lines, so each line is read as its own paragraph.</p>}
            <p className="hint">Imported chapters start as drafts. Words already written are not counted as words written today.</p>
          </>
        )}
        <p className="hint import-error" role="status">{error}</p>
        <div className="modal-actions">
          <button type="button" className="btn" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn primary" disabled={!plan?.chapters.length || busy}>
            {plan ? `Import ${plural(plan.chapters.length, 'chapter', 'chapters')}` : 'Import'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

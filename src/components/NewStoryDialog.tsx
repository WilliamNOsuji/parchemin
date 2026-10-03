import { useState } from 'react'
import { createStory } from '../db'
import { navigate } from '../route'
import { TEMPLATES } from '../templates'
import { Modal } from './Modal'

export function NewStoryDialog({ folderId, onClose }: { folderId: string | null; onClose: () => void }) {
  const [title, setTitle] = useState('')
  const [templateId, setTemplateId] = useState('blank')
  const [who, setWho] = useState('')
  const [want, setWant] = useState('')
  const [wall, setWall] = useState('')

  const submit = async () => {
    const spark = [who.trim() && `${who.trim()}`, want.trim() && `wants ${want.trim()}`, wall.trim() && `but ${wall.trim()}`].filter(Boolean).join(' ')
    const id = await createStory({ title, folderId, template: TEMPLATES.find((t) => t.id === templateId), synopsis: spark ? `${spark}.` : '' })
    onClose()
    navigate({ name: 'story', storyId: id, tab: 'write' })
  }

  return (
    <Modal title="New story" onClose={onClose} wide>
      <form
        className="stack"
        onSubmit={(e) => {
          e.preventDefault()
          void submit()
        }}
      >
        <label className="field">
          <span>Title</span>
          <input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Untitled story (you can change this any time)" />
        </label>
        <fieldset className="spark">
          <legend>The spark <span className="muted">(optional)</span></legend>
          <p className="muted small">Every story is a what-if. Who, what they want, and what stands in the way is enough to begin.</p>
          <div className="grid-3">
            <label className="field"><span>Who</span><input value={who} onChange={(e) => setWho(e.target.value)} placeholder="A shy new kid" /></label>
            <label className="field"><span>Wants</span><input value={want} onChange={(e) => setWant(e.target.value)} placeholder="one real friend" /></label>
            <label className="field"><span>Wall</span><input value={wall} onChange={(e) => setWall(e.target.value)} placeholder="is too shy to speak first" /></label>
          </div>
        </fieldset>
        <div className="field">
          <span>Start with</span>
          <div className="template-grid">
            {TEMPLATES.map((t) => (
              <button
                type="button"
                key={t.id}
                className={`template-card${t.id === templateId ? ' selected' : ''}`}
                onClick={() => setTemplateId(t.id)}
                aria-pressed={t.id === templateId}
              >
                <strong>{t.name}</strong>
                <small>{t.blurb}</small>
                {t.beats.length > 1 && <em>{t.beats.length} scenes</em>}
              </button>
            ))}
          </div>
        </div>
        <div className="modal-actions">
          <button type="button" className="btn" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn primary">Create story</button>
        </div>
      </form>
    </Modal>
  )
}

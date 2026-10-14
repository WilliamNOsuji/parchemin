import { useLiveQuery } from 'dexie-react-hooks'
import { useRef, useState, type ChangeEvent } from 'react'
import { exportBackup, inspectBackup, restoreBackup, type Saved } from '../backup'
import { db } from '../db'
import { exportEpub, exportMarkdown } from '../export'
import { desktop } from '../desktop'
import { canPersist, dismissNudge, requestPersist, useBackupNudge, useSafekeeping, type Keeping } from '../safekeeping'
import type { Change, Story } from '../types'
import { Section } from './RightSidebar'
import { ago } from './StatusBar'

const num = (x: number) => x.toLocaleString()
const plural = (x: number, one: string, many: string) => `${num(x)} ${x === 1 ? one : many}`
const when = (t: number) => new Date(t).toLocaleString([], { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
const size = (b: number) => (b >= 1e9 ? `${(b / 1e9).toFixed(1)} GB` : b >= 1e6 ? `${Math.round(b / 1e6)} MB` : `${Math.max(1, Math.round(b / 1e3))} kB`)
const failure = (e: unknown) => (e instanceof Error ? e.message : 'Something went wrong with this file.')

/** What to tell the writer after a backup: saved, or handed to the browser and still to be checked. */
const savedMessage = (s: Saved | null, check: string) =>
  !s ? '' : s.sure ? `Saved ${s.name}.` : `Your browser is saving ${s.name}. Once it has saved, ${check}, so Parchemin can count it as your backup.`

const onPick = (handle: (f: File) => void) => (e: ChangeEvent<HTMLInputElement>) => {
  const f = e.target.files?.[0]
  e.target.value = ''
  if (f) handle(f)
}

/**
 * One quiet, dismissible line: enough new words have piled up since the last backup file.
 * Not a live region: the count moves with every save, and a screen reader would read it out each time.
 */
export function BackupNudge() {
  const { show, newWords, hasBackup } = useBackupNudge()
  const [msg, setMsg] = useState('')
  if (!show && !msg) return null
  const onBackup = () =>
    void exportBackup().then(
      (s) => setMsg(savedMessage(s, 'pick it with "Check a backup file" under Safekeeping')),
      (e: unknown) => setMsg(failure(e)),
    )
  if (msg) {
    return (
      <div className="nudge">
        <span role="status">{msg}</span>
        <button className="btn small quiet" onClick={() => setMsg('')}>OK</button>
      </div>
    )
  }
  return (
    <div className="nudge">
      <span>
        About {num(Math.round(newWords / 100) * 100)} words are {hasBackup ? 'new since your last backup file' : 'new, with no backup file recorded on this device yet'}. Save a copy of your stories?
      </span>
      <div className="acts">
        <button className="btn small" onClick={onBackup}>Save a backup file</button>
        <button className="btn small quiet" onClick={() => void dismissNudge()}>Not now</button>
      </div>
    </div>
  )
}

const KINDS: [table: string, one: string, many: string][] = [
  ['scenes', 'chapter', 'chapters'],
  ['characters', 'character', 'characters'],
  ['stories', 'story', 'stories'],
  ['snapshots', 'snapshot', 'snapshots'],
  ['folders', 'folder', 'folders'],
  ['drawer', 'thing in the drawer', 'things in the drawer'],
  ['boards', 'board', 'boards'],
  ['images', 'picture', 'pictures'],
  ['coreIdeas', 'core idea', 'core ideas'],
  ['settings', 'setting', 'settings'],
  ['symbols', 'symbol', 'symbols'],
]

function changesSince({ tables, words }: Keeping['changed']) {
  const kinds = KINDS.filter(([t]) => tables[t])
  if (!kinds.length) return 'Nothing has changed since.'
  const parts = kinds.map(([t, one, many]) => plural(tables[t], one, many))
  const list = parts.length === 1 ? parts[0] : `${parts.slice(0, -1).join(', ')} and ${parts.at(-1)}`
  const verb = kinds.length === 1 && tables[kinds[0][0]] === 1 ? 'has' : 'have'
  return `Since then, ${list} ${verb} changed${words > 0 ? ` (about ${plural(words, 'new word', 'new words')})` : ''}.`
}

/** Where the stories are, when they were last copied out, and what this browser promises. Plain facts, no alarms. */
export function SafekeepingPane({ stories }: { stories: Story[] }) {
  const k = useSafekeeping(true)
  const [msg, setMsg] = useState('')
  const [exportId, setExportId] = useState('')
  const restoreInput = useRef<HTMLInputElement>(null)
  const checkInput = useRef<HTMLInputElement>(null)
  const storyId = exportId || stories[0]?.id

  const report = (p: Promise<string>) => void p.then(setMsg, (e: unknown) => setMsg(failure(e)))
  const onBackup = () => report(exportBackup().then((s) => savedMessage(s, 'choose "Check a backup file" and pick it')))
  const onRestore = (file: File) => report(restoreBackup(file).then(({ stories }) => `Restored ${plural(stories, 'story', 'stories')} from ${file.name}.`))
  const onCheck = (file: File) =>
    report(
      inspectBackup(file).then(
        (c) =>
          `${file.name} is whole: ${plural(c.stories, 'story', 'stories')}, ${plural(c.chapters, 'chapter', 'chapters')}, ${plural(c.characters, 'character', 'characters')} and ${plural(c.words, 'word', 'words')}, saved ${when(c.exportedAt)}. It can be restored here or on another device.${c.counted ? ' Parchemin now counts it as your latest backup file.' : ''}`,
      ),
    )
  const onKeep = () =>
    report(
      requestPersist().then((ok) => {
        k?.refresh()
        return ok
          ? 'Done. This browser will keep your stories unless you clear its data yourself.'
          : 'The browser said no for now. Browsers grant this to sites they see used often, or installed as an app. A backup file is the safe copy either way.'
      }),
    )

  return (
    <>
      <div className="pane-head"><div className="crumbs"><b>Safekeeping</b></div></div>
      <div className="pane-scroll">
        <div className="safe">
          <h1>Safekeeping</h1>
          <p className="lead">{desktop ? 'Your stories live on this computer.' : 'Your stories live in this browser, on this device.'} A backup file is a copy you hold yourself. Nothing here leaves the machine unless you carry it.</p>
          <p role="status" className="hint" style={{ marginBottom: msg ? 12 : 0 }}>{msg}</p>

          <div className="krow">
            <div className="k">Kept where</div>
            <div>
              {desktop
                ? "This computer only, in Parchemin's own data folder, which removing the app leaves in place. A backup file is the copy you can carry."
                : k?.persisted === true
                  ? 'This browser, on this device. The browser has promised to keep your stories unless you clear its data yourself.'
                  : 'This browser, on this device. It may clear stored data if the device runs low on space; a backup file is the copy that is safe from that.'}
              {k?.usage !== null && k?.usage !== undefined && (
                <div className="sub">Parchemin takes up {size(k.usage)} here, the app itself included{k.quota && !desktop ? `, of the ${size(k.quota)} this browser allows` : ''}.</div>
              )}
              {!desktop && k?.ios && !k.installed && (
                <div className="sub">On iPhone and iPad, Safari can clear a website's data after seven days without a visit. Adding Parchemin to the Home Screen (Share, then Add to Home Screen) avoids that and gives it storage of its own.</div>
              )}
              {!desktop && k?.persisted === false && canPersist() && <div className="acts"><button className="btn small" onClick={onKeep}>Keep my stories on this device</button></div>}
            </div>
          </div>

          <div className="krow">
            <div className="k">Last backup file</div>
            <div>
              {!k ? null : k.lastBackupAt === null ? (
                <>
                  No backup file recorded on this device yet.
                  <div className="sub">
                    {!k.library || k.library.words === 0
                      ? 'Nothing to back up yet.'
                      : `${plural(k.library.chapters, 'chapter', 'chapters')} (${plural(k.library.words, 'word', 'words')}) ${k.library.chapters === 1 ? 'is' : 'are'} here, in no backup file Parchemin knows of.`}
                  </div>
                </>
              ) : (
                <>
                  {when(k.lastBackupAt)}
                  <div className="sub">{changesSince(k.changed)} Parchemin suggests a backup at about 2,000 new words.</div>
                </>
              )}
              {k?.unchecked !== null && k?.unchecked !== undefined && (
                <div className="sub">A backup file downloaded {when(k.unchecked)} has not been read back yet, so Parchemin can't tell whether it saved. Choose "Check a backup file" and pick it to count it.</div>
              )}
              <div className="acts">
                <button className="btn small primary" onClick={onBackup}>Save a backup file</button>
                <button className="btn small" onClick={() => checkInput.current?.click()}>Check a backup file…</button>
                <button className="btn small quiet" onClick={() => restoreInput.current?.click()}>Restore from a backup…</button>
                <input ref={restoreInput} type="file" accept="application/json,.json" hidden onChange={onPick(onRestore)} />
                <input ref={checkInput} type="file" accept="application/json,.json" hidden onChange={onPick(onCheck)} />
              </div>
              <div className="sub">Restoring adds the backup's stories and overwrites any with the same id. Nothing else is removed. Checking a file reads it back and changes nothing in your library.</div>
            </div>
          </div>

          <div className="krow">
            <div className="k">Export</div>
            <div>
              {stories.length === 0 ? (
                <span className="muted">Nothing to export yet.</span>
              ) : (
                <div className="acts" style={{ marginTop: 0 }}>
                  <select aria-label="Story to export" value={storyId} onChange={(e) => setExportId(e.target.value)} style={{ width: 'auto', maxWidth: 260 }}>
                    {stories.map((s) => <option key={s.id} value={s.id}>{s.title || 'Untitled story'}</option>)}
                  </select>
                  <button className="btn small" onClick={() => storyId && void exportMarkdown(storyId)}>Markdown</button>
                  <button className="btn small" onClick={() => storyId && void exportEpub(storyId)}>EPUB</button>
                </div>
              )}
              <div className="sub">Open formats, so the book is readable without Parchemin. A manuscript .docx is next on the roadmap.</div>
            </div>
          </div>

          <div className="krow">
            <div className="k">Writing suggestions</div>
            <div><SuggestionsNote /></div>
          </div>
        </div>
      </div>
    </>
  )
}

/** Safekeeping at a glance, in the Library's sidebar. */
export function SafekeepingGlance({ say }: { say: (s: string) => void }) {
  const k = useSafekeeping()
  return (
    <Section title="Safekeeping">
      <div className="f"><span>Kept where</span><div>{desktop ? 'This computer' : `This browser${k?.persisted === true ? ' · promised to keep it' : k?.persisted === false ? ' · not yet promised' : ''}`}</div></div>
      <div className="f">
        <span>Last backup file</span>
        <div>{!k ? '…' : k.lastBackupAt === null ? 'None yet' : `${ago(k.lastBackupAt)}${k.changed.words > 0 ? ` · ${num(k.changed.words)} words since` : ' · nothing new since'}`}</div>
      </div>
      <div className="acts">
        <button
          className="btn small"
          onClick={() =>
            void exportBackup().then(
              (s) => say(savedMessage(s, 'check it under Safekeeping')),
              (e: unknown) => say(failure(e)),
            )
          }
        >
          Save a backup file
        </button>
        <a className="btn small quiet" href="#/safekeeping">Open Safekeeping</a>
      </div>
    </Section>
  )
}

/** Every write to a table that goes into a backup is noted, so this list is exact. */
export function ChangesSidebar() {
  const changes = useLiveQuery(() => db.changes.toArray(), [], [] as Change[])
  const rows = useLiveQuery(async () => {
    const sceneIds = changes.filter((c) => c.table === 'scenes').map((c) => c.id)
    const charIds = changes.filter((c) => c.table === 'characters').map((c) => c.id)
    const storyIds = changes.filter((c) => c.table === 'stories').map((c) => c.id)
    const [scenes, chars, stories] = await Promise.all([db.scenes.bulkGet(sceneIds), db.characters.bulkGet(charIds), db.stories.bulkGet(storyIds)])
    const out: { key: string; what: string; detail: string }[] = []
    changes.forEach((c) => {
      const added = c.added - c.held
      if (c.table === 'scenes') {
        const s = scenes[sceneIds.indexOf(c.id)]
        out.push({ key: c.key, what: s ? s.title || 'Untitled chapter' : 'A chapter no longer here', detail: added > 0 ? `+${num(added)} words` : 'edited' })
      } else if (c.table === 'characters') {
        const ch = chars[charIds.indexOf(c.id)]
        out.push({ key: c.key, what: ch ? ch.name || 'Unnamed character' : 'A character no longer here', detail: 'edited' })
      } else if (c.table === 'stories') {
        const st = stories[storyIds.indexOf(c.id)]
        out.push({ key: c.key, what: st ? st.title || 'Untitled story' : 'A story no longer here', detail: 'edited' })
      }
    })
    const other = KINDS.filter(([t]) => !['scenes', 'characters', 'stories'].includes(t)).map(([t, one, many]) => {
      const n = changes.filter((c) => c.table === t).length
      return n ? { key: t, what: plural(n, one, many), detail: 'changed' } : null
    })
    return [...out, ...other.filter((x): x is NonNullable<typeof x> => !!x)]
  }, [changes], [] as { key: string; what: string; detail: string }[])
  return (
    <Section title="Since the last backup file" count={rows.length || undefined}>
      {rows.length === 0 && <p className="hint">Nothing has changed since the last backup file.</p>}
      {rows.map((r) => (
        <div className="chg" key={r.key}><span>{r.what}</span><span>{r.detail}</span></div>
      ))}
      <p className="hint">Every write to a table that goes into a backup is noted, so this list is exact.</p>
    </Section>
  )
}

/** Parchemin has no AI. This says where unasked-for suggestions come from, and how to turn them off at the source. */
export function SuggestionsNote() {
  if (desktop) {
    return (
      <details className="help-note">
        <summary>Seeing writing suggestions you didn't ask for?</summary>
        <p style={{ marginTop: 8 }}>
          Parchemin contains no AI and sends nothing anywhere. There is no browser in this window, so no browser extension can read what you write, and the window asks the system to keep its own writing suggestions out. If they still appear while you type, turn them off at the source: on Windows under Settings, then Time &amp; language, then Typing; on a Mac under Settings, then Apple Intelligence &amp; Siri.
        </p>
      </details>
    )
  }
  return (
    <details className="help-note">
      <summary>Seeing writing suggestions you didn't ask for?</summary>
      <p style={{ marginTop: 8 }}>
        Parchemin contains no AI and sends nothing anywhere. If rewrites, "improve this" offers or grammar marks appear while you type, they come from your browser, your operating system or an extension, and those tools can read what you write. Parchemin asks the browser not to offer them, but not every browser listens yet. To turn them off at the source:
      </p>
      <ul>
        <li><strong>Apple Intelligence</strong> (Mac, iPhone, iPad): Settings, then Apple Intelligence &amp; Siri, and turn off Apple Intelligence. On the newest systems it is under Screen Time, Content &amp; Privacy, Siri, Writing Assistance.</li>
        <li><strong>Chrome's "Help me write"</strong>: open Chrome's settings and search for "writing help", then turn it off. The menu on the suggestion bubble itself also has Disable.</li>
        <li><strong>Grammar extensions</strong> (Grammarly, LanguageTool and others): the extension's toolbar icon has a switch for the current site, or remove it from the browser's extensions page.</li>
      </ul>
    </details>
  )
}

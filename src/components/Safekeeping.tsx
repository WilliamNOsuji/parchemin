import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { exportBackup, inspectBackup, restoreBackup, type Saved } from '../backup'
import { canPersist, dismissNudge, requestPersist, requestPersistOnce, useBackupNudge, useSafekeeping, type Keeping } from '../safekeeping'

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
      (s) => setMsg(savedMessage(s, 'pick it with "Check a backup file" under Safekeeping on the home screen')),
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
        About {num(Math.round(newWords / 100) * 100)} words are {hasBackup ? 'new since your last backup file' : 'new, with no backup file recorded on this device yet'}. Save a
        copy of your stories?
      </span>
      <div className="row">
        <button className="btn small" onClick={onBackup}>Download backup</button>
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
]

function changesSince({ tables, words }: Keeping['changed']) {
  const kinds = KINDS.filter(([t]) => tables[t])
  if (!kinds.length) return 'Nothing has changed since.'
  const parts = kinds.map(([t, one, many]) => plural(tables[t], one, many))
  const list = parts.length === 1 ? parts[0] : `${parts.slice(0, -1).join(', ')} and ${parts.at(-1)}`
  const verb = kinds.length === 1 && tables[kinds[0][0]] === 1 ? 'has' : 'have'
  return `Since then, ${list} ${verb} changed${words > 0 ? ` (about ${plural(words, 'new word', 'new words')})` : ''}.`
}

function BackupLine({ k }: { k: Keeping }) {
  const { lastBackupAt, library } = k
  if (lastBackupAt === null) {
    return (
      <li>
        <strong>No backup file recorded on this device yet.</strong>{' '}
        <span className="muted">
          {!library || library.words === 0
            ? 'Nothing to back up yet.'
            : `${plural(library.chapters, 'chapter', 'chapters')} (${plural(library.words, 'word', 'words')}) ${library.chapters === 1 ? 'is' : 'are'} here, in no backup file Parchemin knows of.`}
        </span>
      </li>
    )
  }
  return (
    <li>
      <strong>Last backup file: {when(lastBackupAt)}.</strong> <span className="muted">{changesSince(k.changed)}</span>
    </li>
  )
}

function StorageLine({ k, onKeep }: { k: Keeping; onKeep: () => void }) {
  if (k.persisted === true) return <li><span>This browser will keep your stories unless you clear its data yourself.</span></li>
  return (
    <li>
      <span>This browser may clear stored data if the device runs low on space. A backup file is the copy that is safe from that.</span>
      {k.persisted === false && canPersist() && <button className="btn small" onClick={onKeep}>Keep my stories on this device</button>}
    </li>
  )
}

/** Where the stories are, when they were last copied out, and what this browser promises. Plain facts, no alarms. */
export function SafekeepingPanel() {
  const k = useSafekeeping()
  const [msg, setMsg] = useState('')
  const restoreInput = useRef<HTMLInputElement>(null)
  const checkInput = useRef<HTMLInputElement>(null)

  // Ask the browser to keep the data once there is writing to keep, here rather than mid-sentence in the editor.
  const hasWork = !!k && (k.lastBackupAt !== null || (k.library?.words ?? 0) > 0)
  const refresh = k?.refresh
  useEffect(() => {
    if (hasWork && k?.persisted === false) void requestPersistOnce().then((asked) => asked && refresh?.())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasWork, k?.persisted])

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
    <section className="safekeeping" aria-labelledby="safekeeping-heading">
      <h2 id="safekeeping-heading">Safekeeping</h2>
      <p className="muted">Your stories live in this browser, on this device. A backup file is a copy you hold yourself. It can be restored here or on another device.</p>
      {k && (
        <ul className="keeping">
          <BackupLine k={k} />
          {k.unchecked !== null && (
            <li>
              <span>
                A backup file downloaded {when(k.unchecked)} has not been read back yet, so Parchemin can't tell whether it saved. Choose "Check a backup
                file" and pick it to count it.
              </span>
            </li>
          )}
          <StorageLine k={k} onKeep={onKeep} />
          {k.usage !== null && (
            <li>
              <span className="muted">
                Parchemin takes up {size(k.usage)} on this device, the app itself included{k.quota ? `, of the ${size(k.quota)} this browser allows` : ''}.
              </span>
            </li>
          )}
          {k.ios && !k.installed && (
            <li>
              <span>
                On iPhone and iPad, Safari can clear a website's data after seven days without a visit. Adding Parchemin to the Home Screen (Share, then Add to Home Screen) avoids that and gives it storage of its own.
              </span>
            </li>
          )}
        </ul>
      )}
      <div className="row wrap">
        <button className="btn" onClick={onBackup}>Download backup</button>
        <button className="btn" onClick={() => restoreInput.current?.click()}>Restore from backup…</button>
        <button className="btn" onClick={() => checkInput.current?.click()}>Check a backup file…</button>
        <input ref={restoreInput} type="file" accept="application/json,.json" hidden onChange={onPick(onRestore)} />
        <input ref={checkInput} type="file" accept="application/json,.json" hidden onChange={onPick(onCheck)} />
      </div>
      <p role="status" className="muted">{msg}</p>
      <p className="muted"><small>Restoring adds the backup's stories and overwrites any with the same id. Nothing else is removed. Checking a file reads it back and changes nothing in your library.</small></p>
    </section>
  )
}

/** Parchemin has no AI. This says where unasked-for suggestions come from, and how to turn them off at the source. */
export function SuggestionsNote() {
  return (
    <details className="help-note">
      <summary>Seeing writing suggestions you didn't ask for?</summary>
      <p>
        Parchemin contains no AI and sends nothing anywhere. If rewrites, "improve this" offers or grammar marks appear while you type, they come
        from your browser, your operating system or an extension, and those tools can read what you write. Parchemin asks the browser not to offer
        them, but not every browser listens yet. To turn them off at the source:
      </p>
      <ul>
        <li>
          <strong>Apple Intelligence</strong> (Mac, iPhone, iPad): Settings, then Apple Intelligence &amp; Siri, and turn off Apple Intelligence. On the
          newest systems it is under Screen Time, Content &amp; Privacy, Siri, Writing Assistance.
        </li>
        <li>
          <strong>Chrome's "Help me write"</strong>: open Chrome's settings and search for "writing help", then turn it off. The menu on the suggestion
          bubble itself also has Disable.
        </li>
        <li>
          <strong>Grammar extensions</strong> (Grammarly, LanguageTool and others): the extension's toolbar icon has a switch for the current site, or
          remove it from the browser's extensions page.
        </li>
      </ul>
    </details>
  )
}

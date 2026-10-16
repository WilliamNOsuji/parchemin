import { useSyncExternalStore } from 'react'
import { flushAllBoards } from './canvas/boardStore'
import { desktop } from './desktop'
import { getEditorState } from './editorState'

/**
 * New versions of the desktop app, only when the writer asks. The page holds where an update stands; the desktop
 * (electron/updates.mts) does the asking, downloading and checking. Nothing here runs in a browser.
 */
export type UpdatePhase =
  | { phase: 'idle' }
  | { phase: 'checking' }
  | { phase: 'latest'; version: string }
  | { phase: 'available'; version: string; size: number }
  | { phase: 'downloading'; version: string; size: number; received: number }
  | { phase: 'ready'; version: string }
  | { phase: 'installing'; version: string }
  | { phase: 'error'; message: string; version?: string; size?: number }

let state: UpdatePhase = { phase: 'idle' }
const listeners = new Set<() => void>()
const set = (next: UpdatePhase) => {
  state = next
  listeners.forEach((l) => l())
}
const subscribe = (cb: () => void) => {
  listeners.add(cb)
  return () => void listeners.delete(cb)
}
export const useUpdate = () => useSyncExternalStore(subscribe, () => state)

/** Whether this copy can update itself: the installed Windows app. Asked once. */
let info: Promise<{ version: string; updates: boolean } | null> | null = null
export const appInfo = () => (info ??= desktop?.appInfo ? desktop.appInfo().catch(() => null) : Promise.resolve(null))

const AUTO = 'parchemin.updates.auto'
/** Checking when Parchemin opens is the writer's choice, off until they turn it on. */
export function autoCheck(): boolean {
  try {
    return localStorage.getItem(AUTO) === '1'
  } catch {
    return false
  }
}
export function setAutoCheck(on: boolean) {
  try {
    localStorage.setItem(AUTO, on ? '1' : '0')
  } catch {
    // the choice just won't be remembered
  }
}

export async function checkForUpdate(): Promise<UpdatePhase> {
  if (!desktop?.checkUpdate || state.phase === 'checking' || state.phase === 'downloading' || state.phase === 'installing') return state
  set({ phase: 'checking' })
  const r = await desktop.checkUpdate().catch((e: unknown) => ({ state: 'error' as const, message: e instanceof Error ? e.message : 'The check did not finish.' }))
  if (r.state === 'available') set({ phase: 'available', version: r.version, size: r.size })
  else if (r.state === 'latest') set({ phase: 'latest', version: r.version })
  else if (r.state === 'error') set({ phase: 'error', message: r.message })
  else set({ phase: 'idle' })
  return state
}

export async function downloadUpdate() {
  if (!desktop?.downloadUpdate || (state.phase !== 'available' && !(state.phase === 'error' && state.version))) return
  const version = state.version!
  const size = state.size!
  set({ phase: 'downloading', version, size, received: 0 })
  const off = desktop.onUpdateProgress?.((p) => state.phase === 'downloading' && set({ ...state, received: p.received }))
  const r = await desktop.downloadUpdate().catch((e: unknown) => ({ ok: false as const, message: e instanceof Error ? e.message : 'The download did not finish.' }))
  off?.()
  set(r.ok ? { phase: 'ready', version } : { phase: 'error', message: r.message, version, size })
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

/**
 * Saves whatever is still waiting, then hands over to the installer, which closes Parchemin and opens the new version.
 * If the chapter could not be saved, nothing is installed: the writer's words come first.
 */
export async function installUpdate(): Promise<string | null> {
  if (!desktop?.installUpdate || state.phase !== 'ready') return null
  const version = state.version
  // a field being typed in saves when it loses the caret; the sidebars save half a second after the last key
  ;(document.activeElement as HTMLElement | null)?.blur?.()
  await flushAllBoards()
  await sleep(800)
  for (let i = 0; i < 20 && editorSaving(); i++) await sleep(150)
  if (editorSaving()) return 'The chapter on screen could not be saved yet, so Parchemin did not restart. Your words are still here; try again in a moment.'
  set({ phase: 'installing', version })
  desktop.installUpdate()
  return null
}

const editorSaving = () => getEditorState().saving !== 'saved'

export const megabytes = (bytes: number) => `${Math.max(1, Math.round(bytes / 1e6))} MB`

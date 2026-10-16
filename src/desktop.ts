/**
 * What the desktop app (the Electron build under electron/) adds to the page through its preload bridge: null in a
 * browser. The page is the same everywhere; the few places that behave differently on a desktop check `desktop` here.
 */
export interface DesktopBridge {
  platform: string
  /** The system's save dialog. Resolves to where the writer chose, or null when they closed it. */
  pickSave(suggestedName: string, filter: SaveFilter): Promise<{ path: string; name: string } | null>
  /** Writes a file to a path that pickSave returned. Resolves to null when written, otherwise to what went wrong. */
  writeFile(path: string, data: Uint8Array): Promise<string | null>
  /** The theme in force, so the window's own chrome and the system's dialogs follow the pin. */
  setTheme(theme: 'system' | 'light' | 'dark'): void
  /** The colours of the system's window controls, from the stylesheet's tokens. */
  setTitleBar(colors: { color: string; symbolColor: string }): void
  /** The app's version, and whether this copy can update itself (the installed Windows app). Missing in older builds. */
  appInfo?(): Promise<{ version: string; updates: boolean }>
  /** Asks the update server for the newest version. The one request a check makes. */
  checkUpdate?(): Promise<UpdateCheck>
  /** Downloads the offered version's installer and checks its fingerprint. */
  downloadUpdate?(): Promise<{ ok: true } | { ok: false; message: string }>
  /** Closes Parchemin, installs the downloaded version and opens it. */
  installUpdate?(): void
  onUpdateProgress?(cb: (p: { received: number; total: number }) => void): () => void
}

export type UpdateCheck =
  | { state: 'unsupported' }
  | { state: 'latest'; version: string }
  | { state: 'available'; version: string; size: number; date?: string }
  | { state: 'error'; message: string }

export interface SaveFilter {
  name: string
  extensions: string[]
}

declare global {
  interface Window {
    parchemin?: DesktopBridge
  }
}

export const desktop: DesktopBridge | null = typeof window !== 'undefined' && window.parchemin ? window.parchemin : null

/** Saves a file where the writer chooses on the desktop; in a browser, hands it to the download. */
export async function saveFile(blob: Blob, name: string, filter: SaveFilter): Promise<void> {
  if (desktop) {
    const target = await desktop.pickSave(name, filter)
    if (!target) return
    const failed = await desktop.writeFile(target.path, new Uint8Array(await blob.arrayBuffer()))
    if (failed) throw new Error(failed)
    return
  }
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = name
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

/**
 * Gives the system's window controls the chrome's colours, read from the stylesheet so the desktop's chrome and the
 * page's never drift apart. Before the stylesheet has loaded the tokens are empty, and nothing is sent.
 */
export function syncTitleBar() {
  if (!desktop) return
  const cs = getComputedStyle(document.documentElement)
  const color = cs.getPropertyValue('--chrome').trim()
  const symbolColor = cs.getPropertyValue('--muted').trim()
  if (color && symbolColor) desktop.setTitleBar({ color, symbolColor })
}

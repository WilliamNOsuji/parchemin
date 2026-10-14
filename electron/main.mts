/**
 * The desktop app: an Electron window around the same web app, as the mockup draws it (design/parchemin-desktop.html).
 * The page is served from the app's own files over the parchemin:// scheme, so storage, absolute paths and fetch
 * behave as on a website. Nothing here reaches another server: there is no updater and no telemetry, and the spelling
 * dictionaries Chromium would fetch from Google are pointed at the app itself, where there are none.
 */
import { app, BrowserWindow, dialog, ipcMain, Menu, nativeTheme, protocol, screen, session, shell, type MenuItemConstructorOptions } from 'electron'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const DIST = path.join(ROOT, 'dist')
const SCHEME = 'parchemin'
const APP_URL = `${SCHEME}://app/`
/** The dev server's address, set by scripts/desktop-dev.mjs. Otherwise the built app under dist/ is served. */
const DEV_URL = process.env.PARCHEMIN_DEV_URL

// The chrome, muted and page tokens of src/styles.css, for the first paint. The page sends the live ones once it runs.
const CHROME = { light: { color: '#f3eee6', symbolColor: '#6f675d' }, dark: { color: '#222128', symbolColor: '#a09a90' } }
const PAGE = { light: '#faf7f2', dark: '#1b1a1f' }

const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.txt': 'text/plain; charset=utf-8',
}
// Only the app's own files run or load. Inline styles are allowed because the editor sets its own.
const CSP = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'; form-action 'none'"

app.setName('Parchemin')
protocol.registerSchemesAsPrivileged([{ scheme: SCHEME, privileges: { standard: true, secure: true, supportFetchAPI: true, stream: true } }])

/** Serves a file from dist/ for the app's scheme. Paths stay inside dist/; the page's hash routes never reach here. */
async function serve(request: Request): Promise<Response> {
  const url = new URL(request.url)
  const pathname = url.hostname === 'app' ? decodeURIComponent(url.pathname) : ''
  const file = path.normalize(path.join(DIST, pathname === '/' ? 'index.html' : pathname))
  if (!file.startsWith(DIST + path.sep)) return new Response('Not found', { status: 404 })
  try {
    const body = await readFile(file)
    const type = MIME[path.extname(file).toLowerCase()] ?? 'application/octet-stream'
    return new Response(new Uint8Array(body), { headers: { 'Content-Type': type, 'Content-Security-Policy': CSP, 'Cache-Control': 'no-cache' } })
  } catch {
    return new Response('Not found', { status: 404 })
  }
}

/** Where the window was and where files were saved, kept beside the app's data so the next start picks up where this one left off. */
interface State {
  x?: number
  y?: number
  width: number
  height: number
  maximized?: boolean
  saveDir?: string
}
let state: State = { width: 1280, height: 800 }
const stateFile = () => path.join(app.getPath('userData'), 'window.json')
const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v)

function readState(): State {
  try {
    const s = JSON.parse(readFileSync(stateFile(), 'utf8')) as Partial<State>
    const width = isNum(s.width) ? Math.max(s.width, 640) : 1280
    const height = isNum(s.height) ? Math.max(s.height, 400) : 800
    const out: State = { width, height, maximized: s.maximized === true, saveDir: typeof s.saveDir === 'string' ? s.saveDir : undefined }
    // a position is kept only while it is still on a screen
    if (isNum(s.x) && isNum(s.y)) {
      const area = screen.getDisplayMatching({ x: s.x, y: s.y, width, height }).workArea
      if (s.x > area.x - width + 100 && s.x < area.x + area.width - 100 && s.y >= area.y && s.y < area.y + area.height - 100) {
        out.x = s.x
        out.y = s.y
      }
    }
    return out
  } catch {
    return { width: 1280, height: 800 }
  }
}

function writeState() {
  try {
    writeFileSync(stateFile(), JSON.stringify(state))
  } catch {
    // the window simply opens at its default size next time
  }
}

function createWindow(): BrowserWindow {
  const dark = nativeTheme.shouldUseDarkColors
  const win = new BrowserWindow({
    x: state.x,
    y: state.y,
    width: state.width,
    height: state.height,
    minWidth: 640,
    minHeight: 400,
    show: false,
    backgroundColor: dark ? PAGE.dark : PAGE.light,
    autoHideMenuBar: true,
    // the tabs live in the title bar, as the mockup draws them, and the system draws its own window controls at the right
    titleBarStyle: 'hidden',
    titleBarOverlay: { ...(dark ? CHROME.dark : CHROME.light), height: 40 },
    webPreferences: { preload: path.join(ROOT, 'dist-electron', 'preload.cjs'), sandbox: true, contextIsolation: true, nodeIntegration: false },
  })
  win.once('ready-to-show', () => {
    if (state.maximized) win.maximize()
    win.show()
  })
  const remember = () => {
    if (win.isDestroyed()) return
    state = { ...state, ...win.getNormalBounds(), maximized: win.isMaximized() }
  }
  win.on('resize', remember)
  win.on('move', remember)
  win.on('maximize', remember)
  win.on('unmaximize', remember)
  win.on('close', writeState)
  void win.loadURL(DEV_URL ?? APP_URL)
  return win
}

/** The menu bar stays hidden (Alt shows it). It exists for the keys it gives: undo and redo, zoom, full screen. */
function menu() {
  const view: MenuItemConstructorOptions[] = [{ role: 'resetZoom' }, { role: 'zoomIn' }, { role: 'zoomOut' }, { type: 'separator' }, { role: 'togglefullscreen' }]
  if (DEV_URL) view.push({ type: 'separator' }, { role: 'reload' }, { role: 'toggleDevTools' })
  return Menu.buildFromTemplate([
    { label: 'Edit', submenu: [{ role: 'undo' }, { role: 'redo' }, { type: 'separator' }, { role: 'cut' }, { role: 'copy' }, { role: 'paste' }, { role: 'selectAll' }] },
    { label: 'View', submenu: view },
    { label: 'Window', submenu: [{ role: 'minimize' }, { role: 'close' }] },
  ])
}

const HEX = /^#[0-9a-f]{6}$/i
/** Paths the writer chose in a save dialog, each good for one write. The page can write nowhere else. */
const chosen = new Set<string>()

ipcMain.on('theme', (_e, theme: unknown) => {
  // the pinned theme reaches Chromium too, so prefers-color-scheme and the system's dialogs follow it
  if (theme === 'system' || theme === 'light' || theme === 'dark') nativeTheme.themeSource = theme
})

ipcMain.on('title-bar', (e, colors: unknown) => {
  const c = colors as { color?: unknown; symbolColor?: unknown } | null
  if (!c || typeof c.color !== 'string' || typeof c.symbolColor !== 'string' || !HEX.test(c.color) || !HEX.test(c.symbolColor)) return
  const win = BrowserWindow.fromWebContents(e.sender)
  if (win && process.platform !== 'darwin') win.setTitleBarOverlay({ color: c.color, symbolColor: c.symbolColor })
})

ipcMain.handle('pick-save', async (e, name: unknown, filter: unknown) => {
  const f = filter as { name?: unknown; extensions?: unknown } | null
  if (typeof name !== 'string' || !f || typeof f.name !== 'string' || !Array.isArray(f.extensions) || !f.extensions.every((x) => typeof x === 'string')) {
    throw new Error('The save request was not understood.')
  }
  const options = {
    defaultPath: path.join(state.saveDir ?? app.getPath('documents'), path.basename(name)),
    filters: [{ name: f.name, extensions: f.extensions as string[] }],
  }
  const win = BrowserWindow.fromWebContents(e.sender)
  const { canceled, filePath } = await (win ? dialog.showSaveDialog(win, options) : dialog.showSaveDialog(options))
  if (canceled || !filePath) return null
  chosen.add(filePath)
  state.saveDir = path.dirname(filePath)
  writeState()
  return { path: filePath, name: path.basename(filePath) }
})

/** Writes to a path the writer chose. Answers null when written, otherwise what went wrong, in a sentence the page can show. */
ipcMain.handle('write-file', async (_e, filePath: unknown, data: unknown): Promise<string | null> => {
  if (typeof filePath !== 'string' || !chosen.has(filePath) || !(data instanceof Uint8Array)) return 'The file could not be saved.'
  chosen.delete(filePath)
  try {
    await writeFile(filePath, data)
    return null
  } catch (e) {
    return `The file could not be saved: ${e instanceof Error ? e.message : String(e)}`
  }
})

if (!app.requestSingleInstanceLock()) {
  app.quit()
} else {
  app.on('second-instance', () => {
    const win = BrowserWindow.getAllWindows()[0]
    if (!win) return
    if (win.isMinimized()) win.restore()
    win.focus()
  })
  app.on('web-contents-created', (_e, contents) => {
    // a link in the writer's own text opens in their browser; nothing else leaves the app's pages
    const outside = (url: string) => !url.startsWith(DEV_URL ?? APP_URL)
    contents.setWindowOpenHandler(({ url }) => {
      if (/^https?:\/\//.test(url)) void shell.openExternal(url)
      return { action: 'deny' }
    })
    contents.on('will-navigate', (ev, url) => {
      if (!outside(url)) return
      ev.preventDefault()
      if (/^https?:\/\//.test(url)) void shell.openExternal(url)
    })
  })
  app.on('window-all-closed', () => app.quit())
  void app.whenReady().then(() => {
    protocol.handle(SCHEME, serve)
    session.defaultSession.setSpellCheckerDictionaryDownloadURL(`${APP_URL}dictionaries/`)
    Menu.setApplicationMenu(menu())
    if (!DEV_URL && !existsSync(path.join(DIST, 'index.html'))) {
      dialog.showErrorBox('Parchemin is not built yet', 'Run "npm run build:desktop" first, then start the app again.')
      app.quit()
      return
    }
    state = readState()
    createWindow()
  })
}

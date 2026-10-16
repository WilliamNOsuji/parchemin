/**
 * Updates, only when the writer asks. A check reads one small file, latest.yml, that names the newest version; a
 * download fetches that version's installer and checks it against the file's SHA-512 before anything runs. The files
 * are the ones electron-builder writes, published as a release of the public repository that holds the installers
 * and nothing else (the source stays private). See README.md, "The desktop app".
 */
import { createHash } from 'node:crypto'
import { createWriteStream } from 'node:fs'
import { mkdir, rm } from 'node:fs/promises'
import path from 'node:path'

/** Where the newest release's files are. GitHub sends /latest/download/<file> to the newest release that is not a draft. */
export const FEED = 'https://github.com/WilliamNOsuji/parchemin-releases/releases/latest/download/'

export interface Release {
  version: string
  /** The installer's file name in the release. */
  file: string
  /** Base64 SHA-512 of the installer, as electron-builder writes it. */
  sha512: string
  size: number
  date?: string
}

type Fetcher = (url: string) => Promise<Response>

const field = (yml: string, key: string) => new RegExp(`^${key}:\\s*['"]?([^'"\\n]+?)['"]?\\s*$`, 'm').exec(yml)?.[1]

/** Reads latest.yml. Only what an update needs is taken, and each part is checked, so the feed cannot point anywhere else. */
export function parseFeed(yml: string): Release {
  const version = field(yml, 'version')
  const file = field(yml, 'path')
  const sha512 = field(yml, 'sha512')
  // the installer's size sits under files:, beside its url
  const size = Number(/^\s+size:\s*(\d+)\s*$/m.exec(yml)?.[1])
  if (!version || !/^\d+\.\d+\.\d+$/.test(version)) throw new Error('The update information names no version Parchemin can read.')
  if (!file || !/^[\w.-]+\.exe$/.test(file)) throw new Error('The update information names no installer Parchemin can use.')
  if (!sha512 || !/^[A-Za-z0-9+/]{86}==$/.test(sha512)) throw new Error('The update information has no fingerprint to check the installer against.')
  if (!Number.isFinite(size) || size <= 0) throw new Error('The update information gives no size for the installer.')
  return { version, file, sha512, size, date: field(yml, 'releaseDate') }
}

/** True when version a comes after version b (x.y.z). */
export function newer(a: string, b: string): boolean {
  const pa = a.split('.').map(Number)
  const pb = b.split('.').map(Number)
  for (let i = 0; i < 3; i++) if ((pa[i] ?? 0) !== (pb[i] ?? 0)) return (pa[i] ?? 0) > (pb[i] ?? 0)
  return false
}

const said = (e: unknown) => (e instanceof Error ? e.message : String(e))

/** Asks for the newest release. The one request a check makes. */
export async function fetchRelease(fetcher: Fetcher, feed = FEED): Promise<Release> {
  let res: Response
  try {
    res = await fetcher(`${feed}latest.yml`)
  } catch (e) {
    throw new Error(`Parchemin could not reach the update server. Check the connection and try again. (${said(e)})`)
  }
  if (res.status === 404) throw new Error('No version has been published yet.')
  if (!res.ok) throw new Error(`The update server answered ${res.status}. Try again later.`)
  return parseFeed(await res.text())
}

/**
 * Downloads a release's installer into dir and checks its size and fingerprint. Resolves to the installer's path, or
 * throws a sentence the writer can read; a file that does not match is deleted, never run.
 */
export async function downloadRelease(fetcher: Fetcher, release: Release, dir: string, onProgress: (received: number, total: number) => void, feed = FEED): Promise<string> {
  await mkdir(dir, { recursive: true })
  const file = path.join(dir, release.file)
  let res: Response
  try {
    res = await fetcher(`${feed}${encodeURIComponent(release.file)}`)
  } catch (e) {
    throw new Error(`The download could not start. Check the connection and try again. (${said(e)})`)
  }
  if (!res.ok || !res.body) throw new Error(`The download could not start: the server answered ${res.status}.`)
  const hash = createHash('sha512')
  const out = createWriteStream(file)
  let received = 0
  try {
    const reader = res.body.getReader()
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      hash.update(value)
      received += value.byteLength
      if (received > release.size) throw new Error('The download is larger than the update said it would be, so it was stopped.')
      if (!out.write(value)) await new Promise<void>((r) => out.once('drain', () => r()))
      onProgress(received, release.size)
    }
    await new Promise<void>((resolve, reject) => out.end((e?: Error | null) => (e ? reject(e) : resolve())))
  } catch (e) {
    out.destroy()
    await rm(file, { force: true })
    throw new Error(e instanceof Error && e.message.startsWith('The download') ? e.message : `The download stopped before the end. Try again. (${said(e)})`)
  }
  if (received !== release.size || hash.digest('base64') !== release.sha512) {
    await rm(file, { force: true })
    throw new Error('The downloaded installer does not match its fingerprint, so it was deleted and nothing was installed.')
  }
  return file
}

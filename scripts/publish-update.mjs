// Publishes a Windows build as the newest version, so installed copies offer it the next time the writer checks.
// Run after building (npm run dist:win), with gh logged in to GitHub:
//
//   npm run publish:update -- <release folder> ["What changed, in a sentence or two."]
//
// It uploads the installer, its block map and latest.yml as release v<version> of the public repository that holds the
// installers and nothing else. The version is package.json's; bump it before building, or the app sees nothing new.
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'

const REPO = 'WilliamNOsuji/parchemin-releases'
const [dir = 'release', notes] = process.argv.slice(2)
const { version } = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'))
const installer = `Parchemin-Setup-${version}.exe`
const files = [installer, `${installer}.blockmap`, 'latest.yml'].map((f) => path.join(dir, f))

const stop = (msg) => {
  console.error(msg)
  process.exit(1)
}
for (const f of files) if (!existsSync(f)) stop(`${f} is missing. Build version ${version} first (npm run dist:win), or name the folder it is in.`)
const feed = readFileSync(files[2], 'utf8')
if (!new RegExp(`^version: ${version.replace(/\./g, '\\.')}$`, 'm').test(feed)) stop(`latest.yml in ${dir} is not for version ${version}. Build again after bumping the version.`)

const gh = (...args) => execFileSync('gh', args, { stdio: ['ignore', 'pipe', 'inherit'] }).toString().trim()
try {
  // asked quietly: "not found" is the answer hoped for
  execFileSync('gh', ['release', 'view', `v${version}`, '--repo', REPO], { stdio: 'ignore' })
  stop(`Version ${version} is already published. Bump the version in package.json, build again, then publish.`)
} catch {
  // not published yet: carry on
}
gh('release', 'create', `v${version}`, '--repo', REPO, '--title', `Parchemin ${version}`, '--notes', notes ?? `Parchemin ${version} for Windows.`, ...files)
console.log(`Published Parchemin ${version}. Installed copies offer it the next time the writer checks for updates.`)

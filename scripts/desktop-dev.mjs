// Runs the web app's dev server and the desktop window around it, so the page reloads as the code changes.
// Compile electron/ first (npm run desktop:dev does).
import { spawn } from 'node:child_process'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'

process.chdir(fileURLToPath(new URL('..', import.meta.url)))

const server = await createServer({ configFile: 'vite.config.ts' })
await server.listen()
server.printUrls()
const url = server.resolvedUrls?.local[0]
if (!url) {
  console.error('The dev server gave no address')
  process.exit(1)
}

// the electron package resolves to the path of its binary
const electron = createRequire(import.meta.url)('electron')
const child = spawn(electron, ['.'], { stdio: 'inherit', env: { ...process.env, PARCHEMIN_DEV_URL: url } })
child.on('exit', () => void server.close().then(() => process.exit(0)))
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => child.kill())

// Builds the website and the web app into dist-pages/, laid out the way they are served:
// the site at the root and the app under app/. Any static host can publish that folder;
// .github/workflows/deploy.yml does it on GitHub Pages after every push to main.
//
//   SITE_BASE  the path the site is served from, with a slash at both ends. Default "/".
//              GitHub Pages serves a project site from "/<repository>/".
//   SITE_URL   the site's full address, named in the page as its canonical link. Optional.
//
// Run `tsc -b` first (npm run build:pages does), as the app's own build does.
import { cpSync, rmSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { build } from 'vite'

process.chdir(fileURLToPath(new URL('..', import.meta.url)))

const base = process.env.SITE_BASE || '/'
if (!base.startsWith('/') || !base.endsWith('/')) {
  console.error(`SITE_BASE must start and end with "/", got "${base}"`)
  process.exit(1)
}

await build({ configFile: 'vite.site.config.ts', base })
await build({ configFile: 'vite.config.ts', base: `${base}app/` })

rmSync('dist-pages', { recursive: true, force: true })
cpSync('dist-site', 'dist-pages', { recursive: true })
cpSync('dist', 'dist-pages/app', { recursive: true })
console.log(`\nAssembled dist-pages/ to be served from ${base} (the site at the root, the app under app/)`)

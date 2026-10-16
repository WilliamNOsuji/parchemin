// Builds the website and the web app together into dist-pages/: the site at the root and the app under app/.
// For a time when the web app is published beside the site. Today only the site is (npm run build:site, served at
// parchemin.art by Cloudflare Pages); the app ships as the desktop app. See site/README.md, "Publishing".
//
//   SITE_BASE  the path the site is served from, with a slash at both ends. Default "/".
//              GitHub Pages serves a project site from "/<repository>/".
//   SITE_URL   the site's full address, named in the page as its canonical link. Optional. On Cloudflare Pages
//              it defaults to parchemin.art for main and to the preview's own address (vite.site.config.ts).
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

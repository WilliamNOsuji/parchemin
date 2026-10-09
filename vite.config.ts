import { createHash } from 'node:crypto'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

const STATIC_FILES = ['./', 'manifest.webmanifest', 'icon.svg', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png']

/** Emits sw.js with the built asset list baked in, so the whole app works offline after the first visit. */
function offlineServiceWorker(): Plugin {
  return {
    name: 'parchemin-offline-sw',
    apply: 'build',
    generateBundle(_, bundle) {
      // .woff files are a fallback for browsers without .woff2 support; none of the browsers Parchemin runs in need them
      const precache = [...STATIC_FILES, ...Object.keys(bundle).filter((f) => !f.endsWith('.woff'))]
      const version = createHash('sha1').update(precache.join('\n')).digest('hex').slice(0, 10)
      this.emitFile({
        type: 'asset',
        fileName: 'sw.js',
        source: `const CACHE = 'parchemin-${version}'
const PRECACHE = ${JSON.stringify(precache)}
const url = (p) => new URL(p, self.registration.scope).href

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE.map(url))).then(() => self.skipWaiting()))
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (e) => {
  const req = e.request
  if (req.method !== 'GET') return
  const u = new URL(req.url)

  if (req.mode === 'navigate') {
    // network first so a deploy shows up on reload; fall back to the cached shell offline
    e.respondWith(fetch(req).catch(() => caches.match(url('./'))))
    return
  }
  if (u.origin === location.origin) {
    e.respondWith(caches.match(req).then((hit) => hit || fetch(req)))
  }
})
`,
      })
    },
  }
}

export default defineConfig({ plugins: [react(), offlineServiceWorker()] })

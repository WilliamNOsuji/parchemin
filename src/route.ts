import { useMemo, useSyncExternalStore } from 'react'

export type Tab = 'write' | 'outline' | 'cast' | 'canvas' | 'web'

export type Route =
  | { name: 'home' }
  | { name: 'safekeeping' }
  | { name: 'drawer' }
  | { name: 'story'; storyId: string; tab: Tab; itemId?: string }

function parse(hash: string): Route {
  const [, kind, storyId, tab, itemId] = hash.replace(/^#/, '').split('/')
  if (kind === 'story' && storyId) {
    // 'characters' is the old name of the Cast page; links to it still work
    const t: Tab = tab === 'outline' ? 'outline' : tab === 'cast' || tab === 'characters' ? 'cast' : tab === 'canvas' ? 'canvas' : tab === 'web' ? 'web' : 'write'
    return { name: 'story', storyId, tab: t, itemId: itemId || undefined }
  }
  if (kind === 'safekeeping') return { name: 'safekeeping' }
  if (kind === 'drawer') return { name: 'drawer' }
  return { name: 'home' }
}

export function hrefFor(r: Route): string {
  if (r.name === 'home') return '#/'
  if (r.name === 'safekeeping') return '#/safekeeping'
  if (r.name === 'drawer') return '#/drawer'
  return `#/story/${r.storyId}/${r.tab}${r.itemId ? `/${r.itemId}` : ''}`
}

export function navigate(r: Route) {
  window.location.hash = hrefFor(r)
}

/** Like navigate, but the page the writer is on is replaced in the history, so Back skips it. */
export function replaceRoute(r: Route) {
  const href = hrefFor(r)
  if (window.location.hash === href) return
  history.replaceState(null, '', href)
  window.dispatchEvent(new HashChangeEvent('hashchange'))
}

const subscribe = (cb: () => void) => {
  window.addEventListener('hashchange', cb)
  return () => window.removeEventListener('hashchange', cb)
}

export function useRoute(): Route {
  const hash = useSyncExternalStore(subscribe, () => window.location.hash)
  return useMemo(() => parse(hash), [hash])
}

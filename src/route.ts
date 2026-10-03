import { useMemo, useSyncExternalStore } from 'react'

export type Tab = 'write' | 'outline' | 'characters'

export type Route =
  | { name: 'home' }
  | { name: 'story'; storyId: string; tab: Tab; itemId?: string }

function parse(hash: string): Route {
  const [, kind, storyId, tab, itemId] = hash.replace(/^#/, '').split('/')
  if (kind === 'story' && storyId) {
    const t: Tab = tab === 'outline' || tab === 'characters' ? tab : 'write'
    return { name: 'story', storyId, tab: t, itemId }
  }
  return { name: 'home' }
}

export function hrefFor(r: Route): string {
  if (r.name === 'home') return '#/'
  return `#/story/${r.storyId}/${r.tab}${r.itemId ? `/${r.itemId}` : ''}`
}

export function navigate(r: Route) {
  window.location.hash = hrefFor(r)
}

const subscribe = (cb: () => void) => {
  window.addEventListener('hashchange', cb)
  return () => window.removeEventListener('hashchange', cb)
}

export function useRoute(): Route {
  const hash = useSyncExternalStore(subscribe, () => window.location.hash)
  return useMemo(() => parse(hash), [hash])
}

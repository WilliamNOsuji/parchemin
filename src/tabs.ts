import { useCallback, useEffect, useMemo, useState } from 'react'
import { hrefFor, navigate, type Route } from './route'

/**
 * Tabs in the title bar, as Obsidian keeps them. The Library is always the first tab. Opening a chapter,
 * a story's outline or cast, the drawer or safekeeping adds a tab if there is none for it yet, and the
 * address bar stays the source of truth: the active tab is whatever the route says.
 */
export interface OpenTab {
  key: string
  route: Route
}

const KEY = 'parchemin.tabs'
export const LIBRARY: OpenTab = { key: 'home', route: { name: 'home' } }

/** One key per thing that gets a tab. A chapter is a tab; the cast page is one tab per story, whoever is selected. */
export function tabKey(r: Route): string {
  if (r.name === 'home') return 'home'
  if (r.name === 'safekeeping' || r.name === 'drawer') return r.name
  if (r.tab === 'write') return r.itemId ? `write:${r.itemId}` : `write:${r.storyId}:first`
  return `${r.tab}:${r.storyId}`
}

function load(): OpenTab[] {
  try {
    const raw = sessionStorage.getItem(KEY)
    const tabs = raw ? (JSON.parse(raw) as OpenTab[]) : []
    return [LIBRARY, ...tabs.filter((t) => t && t.key !== 'home' && t.route)]
  } catch {
    return [LIBRARY]
  }
}

export function useOpenTabs(route: Route) {
  const [tabs, setTabs] = useState<OpenTab[]>(load)
  const active = tabKey(route)

  useEffect(() => {
    setTabs((ts) => {
      const i = ts.findIndex((t) => t.key === active)
      // a tab for a story's outline or cast keeps the selected item, so reopening it lands where the writer was
      if (i >= 0) return hrefFor(ts[i].route) === hrefFor(route) ? ts : ts.map((t, j) => (j === i ? { key: t.key, route } : t))
      // a chapter opened by story alone becomes that chapter's tab once the route names it
      const first = route.name === 'story' && route.tab === 'write' ? ts.findIndex((t) => t.key === `write:${route.storyId}:first`) : -1
      if (first >= 0) return ts.map((t, j) => (j === first ? { key: active, route } : t))
      return [...ts, { key: active, route }]
    })
  }, [active, route])

  useEffect(() => {
    try {
      sessionStorage.setItem(KEY, JSON.stringify(tabs.filter((t) => t.key !== 'home')))
    } catch {
      // nothing to do: the tabs just won't survive a reload
    }
  }, [tabs])

  const close = useCallback(
    (key: string) => {
      if (key === 'home') return
      setTabs((ts) => {
        const i = ts.findIndex((t) => t.key === key)
        if (i < 0) return ts
        const next = ts.filter((t) => t.key !== key)
        if (key === active) navigate(next[Math.min(i, next.length - 1)].route)
        return next
      })
    },
    [active],
  )

  /** Drops tabs whose chapter or story is gone (set aside, or deleted for good). */
  const prune = useCallback((isGone: (t: OpenTab) => boolean) => {
    setTabs((ts) => (ts.some(isGone) ? ts.filter((t) => !isGone(t)) : ts))
  }, [])

  return useMemo(() => ({ tabs, active, close, prune }), [tabs, active, close, prune])
}

import { useCallback, useSyncExternalStore } from 'react'

/** Parchemin follows the system theme. The ribbon's toggle can pin it light or dark on this device. */
export type Theme = 'system' | 'light' | 'dark'
export const THEMES: Theme[] = ['system', 'light', 'dark']

const KEY = 'parchemin.theme'
const listeners = new Set<() => void>()

/** The theme pinned on this device, or 'system'. */
export function currentTheme(): Theme {
  try {
    const t = localStorage.getItem(KEY)
    return t === 'light' || t === 'dark' ? t : 'system'
  } catch {
    return 'system'
  }
}

/** Puts the choice on <html>, where the stylesheet reads it. index.html does the same before the app loads, so there is no flash. */
export function applyTheme(t: Theme) {
  const root = document.documentElement
  if (t === 'system') root.removeAttribute('data-theme')
  else root.setAttribute('data-theme', t)
  const dark = t === 'dark' || (t === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#222128' : '#f3eee6')
}

const subscribe = (cb: () => void) => {
  listeners.add(cb)
  return () => void listeners.delete(cb)
}

export function useTheme(): [Theme, (t: Theme) => void] {
  const theme = useSyncExternalStore(subscribe, currentTheme)
  const set = useCallback((t: Theme) => {
    try {
      if (t === 'system') localStorage.removeItem(KEY)
      else localStorage.setItem(KEY, t)
    } catch {
      // a private window may refuse; the choice still applies until the page closes
    }
    applyTheme(t)
    listeners.forEach((l) => l())
  }, [])
  return [theme, set]
}

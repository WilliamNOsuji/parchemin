import { useCallback, useSyncExternalStore } from 'react'
import { desktop, syncTitleBar } from './desktop'

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
  // the desktop's window follows the pin too: its own controls now, and Chromium's colour scheme through the pin
  desktop?.setTheme(t)
  syncTitleBar()
}

/** The theme in force: read from storage once, then kept here, so a device whose storage refuses still cycles through all three. */
let theme: Theme = currentTheme()

const subscribe = (cb: () => void) => {
  listeners.add(cb)
  return () => void listeners.delete(cb)
}

export function useTheme(): [Theme, (t: Theme) => void] {
  const current = useSyncExternalStore(subscribe, () => theme)
  const set = useCallback((t: Theme) => {
    theme = t
    try {
      if (t === 'system') localStorage.removeItem(KEY)
      else localStorage.setItem(KEY, t)
    } catch {
      // a private window may refuse; the choice still applies until the page closes
    }
    applyTheme(t)
    listeners.forEach((l) => l())
  }, [])
  return [current, set]
}

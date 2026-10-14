import { navigate, type Route } from '../route'
import type { Theme } from '../theme'
import { Icon, type IconName } from './Icons'

export interface RibbonProps {
  route: Route
  /** The story the Outline and Cast buttons open: the one on screen, or the last one edited. */
  storyId?: string
  drawerCount: number
  theme: Theme
  onTheme: () => void
  onSearch: () => void
  onNavigate?: () => void
  className?: string
}

const THEME_ICON: Record<Theme, IconName> = { system: 'moon', light: 'sun', dark: 'moon' }
const THEME_TITLE: Record<Theme, string> = { system: 'Theme: follows the system', light: 'Theme: light', dark: 'Theme: dark' }

/** Obsidian's ribbon: the views and settings in a 44 px strip. Search is a view, so the sidebar stays a tree. */
export function Ribbon({ route, storyId, drawerCount, theme, onTheme, onSearch, onNavigate, className }: RibbonProps) {
  const go = (r: Route) => {
    navigate(r)
    onNavigate?.()
  }
  const tab = route.name === 'story' ? route.tab : null
  const item = (on: boolean, title: string, icon: IconName, onClick: () => void, disabled = false) => (
    <button className={`rb${on ? ' on' : ''}`} title={title} aria-label={title} aria-current={on ? 'page' : undefined} onClick={onClick} disabled={disabled}>
      <Icon name={icon} />
    </button>
  )
  return (
    <nav className={className ?? 'ribbon'} aria-label="Views">
      {item(route.name === 'home' || tab === 'write', 'Library', 'lib', () => go({ name: 'home' }))}
      {item(false, 'Search', 'search', onSearch)}
      {item(tab === 'outline', 'Outline', 'outline', () => storyId && go({ name: 'story', storyId, tab: 'outline' }), !storyId)}
      {item(tab === 'cast', 'Cast', 'cast', () => storyId && go({ name: 'story', storyId, tab: 'cast' }), !storyId)}
      {item(tab === 'canvas', 'Boards', 'canvas', () => storyId && go({ name: 'story', storyId, tab: 'canvas' }), !storyId)}
      {item(tab === 'web', 'Web', 'web', () => storyId && go({ name: 'story', storyId, tab: 'web' }), !storyId)}
      {item(route.name === 'drawer', drawerCount ? `The drawer · ${drawerCount} set aside` : 'The drawer', 'drawer', () => go({ name: 'drawer' }))}
      {item(route.name === 'safekeeping', 'Safekeeping', 'safe', () => go({ name: 'safekeeping' }))}
      <span className="spacer" />
      {item(false, THEME_TITLE[theme], THEME_ICON[theme], onTheme)}
    </nav>
  )
}

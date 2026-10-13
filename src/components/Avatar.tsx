import type { Character } from '../types'

/** A character's image, or their initial. Its own module so the sidebar does not pull in the cast page. */
export const Avatar = ({ c, className = 'av' }: { c: Pick<Character, 'name' | 'image'>; className?: string }) =>
  c.image ? <img className={className} src={c.image} alt="" /> : <span className={className} aria-hidden>{c.name.trim()[0]?.toUpperCase() ?? '?'}</span>

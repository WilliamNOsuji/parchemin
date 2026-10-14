/** The Web's route names what is picked as `<kind>:<id>`, so the pane and the sidebar read the same thing. */
export type WebItemKind = 'idea' | 'character' | 'setting' | 'symbol' | 'chapter' | 'board'

const KINDS: readonly WebItemKind[] = ['idea', 'character', 'setting', 'symbol', 'chapter', 'board']

export const webItem = (kind: WebItemKind, id: string): string => `${kind}:${id}`

export function parseWebItem(itemId?: string): { kind: WebItemKind; id: string } | null {
  if (!itemId) return null
  const i = itemId.indexOf(':')
  if (i < 0) return null
  const kind = itemId.slice(0, i) as WebItemKind
  const id = itemId.slice(i + 1)
  return KINDS.includes(kind) && id ? { kind, id } : null
}

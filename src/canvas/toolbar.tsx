import { Icon, type IconName } from '../components/Icons'

export type ToolKind = 'note' | 'chapter' | 'character' | 'setting' | 'group' | 'image'

const TOOLS: { kind: ToolKind; icon: IconName; label: string; title: string }[] = [
  { kind: 'note', icon: 'notes', label: 'Note', title: 'Add a note' },
  { kind: 'chapter', icon: 'outline', label: 'Chapter', title: 'Add the next chapter not on the board' },
  { kind: 'character', icon: 'cast', label: 'Character', title: 'Add a character from the cast' },
  { kind: 'setting', icon: 'place', label: 'Setting', title: 'Add a setting' },
  { kind: 'group', icon: 'group', label: 'Group', title: 'Add a group' },
  { kind: 'image', icon: 'image', label: 'Image', title: 'Add a picture from this computer' },
]

/** The toolbar at the bottom of a board, as Obsidian keeps it: each kind of card, an icon and a word. */
export function Tools({ onAdd }: { onAdd: (kind: ToolKind) => void }) {
  return (
    <div className="cv-tools" role="toolbar" aria-label="Add to the board">
      {TOOLS.map((t) => (
        <button key={t.kind} title={t.title} aria-label={t.label} onClick={() => onAdd(t.kind)}>
          <Icon name={t.icon} />
          <span className="w">{t.label}</span>
        </button>
      ))}
    </div>
  )
}

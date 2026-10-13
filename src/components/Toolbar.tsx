import { useEditorState, type Editor } from '@tiptap/react'
import type { ReactNode } from 'react'

function Btn({ active, disabled, label, onClick, rare, ui, children }: { active?: boolean; disabled?: boolean; label: string; onClick: () => void; rare?: boolean; ui?: boolean; children: ReactNode }) {
  return (
    <button
      type="button"
      className={`tb-fmt${active ? ' on' : ''}${rare ? ' rare' : ''}${ui ? ' ui' : ''}`}
      aria-label={label}
      title={label}
      aria-pressed={active}
      disabled={disabled}
      // keep the selection in the editor when clicking toolbar buttons
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

/** The formatting bar, shrunk to the pane header. The scene break stays a glyph. */
export function Toolbar({ editor, children }: { editor: Editor; children?: ReactNode }) {
  const s = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      bold: e?.isActive('bold') ?? false,
      italic: e?.isActive('italic') ?? false,
      underline: e?.isActive('underline') ?? false,
      strike: e?.isActive('strike') ?? false,
      h1: e?.isActive('heading', { level: 1 }) ?? false,
      h2: e?.isActive('heading', { level: 2 }) ?? false,
      quote: e?.isActive('blockquote') ?? false,
      bullet: e?.isActive('bulletList') ?? false,
      ordered: e?.isActive('orderedList') ?? false,
    }),
  })
  const c = () => editor.chain().focus()

  return (
    <div className="toolbar" role="toolbar" aria-label="Formatting">
      <Btn label="Bold (Ctrl+B)" active={s.bold} onClick={() => c().toggleBold().run()}><b>B</b></Btn>
      <Btn label="Italic (Ctrl+I)" active={s.italic} onClick={() => c().toggleItalic().run()}><i>I</i></Btn>
      <Btn label="Underline (Ctrl+U)" active={s.underline} onClick={() => c().toggleUnderline().run()}><u>U</u></Btn>
      <Btn label="Strikethrough" active={s.strike} onClick={() => c().toggleStrike().run()}><s>S</s></Btn>
      <span className="sep" />
      <Btn label="Heading" active={s.h1} rare ui onClick={() => c().toggleHeading({ level: 1 }).run()}>H1</Btn>
      <Btn label="Subheading" active={s.h2} ui onClick={() => c().toggleHeading({ level: 2 }).run()}>H2</Btn>
      <Btn label="Block quote" active={s.quote} rare onClick={() => c().toggleBlockquote().run()}>“</Btn>
      <Btn label="Bulleted list" active={s.bullet} onClick={() => c().toggleBulletList().run()}>•</Btn>
      <Btn label="Numbered list" active={s.ordered} rare ui onClick={() => c().toggleOrderedList().run()}>1.</Btn>
      <Btn label="Scene break" onClick={() => c().setHorizontalRule().run()}>⁂</Btn>
      {children && <span className="sep" />}
      {children}
    </div>
  )
}

import { useEditorState, type Editor } from '@tiptap/react'
import type { ReactNode } from 'react'

function Btn({ active, disabled, label, onClick, children }: { active?: boolean; disabled?: boolean; label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      className={`tb-btn${active ? ' on' : ''}`}
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
      canUndo: e?.can().undo() ?? false,
      canRedo: e?.can().redo() ?? false,
    }),
  })
  const c = () => editor.chain().focus()

  return (
    <div className="toolbar" role="toolbar" aria-label="Formatting">
      <div className="tb-group">
        <Btn label="Bold (Ctrl+B)" active={s.bold} onClick={() => c().toggleBold().run()}><b>B</b></Btn>
        <Btn label="Italic (Ctrl+I)" active={s.italic} onClick={() => c().toggleItalic().run()}><i>I</i></Btn>
        <Btn label="Underline (Ctrl+U)" active={s.underline} onClick={() => c().toggleUnderline().run()}><u>U</u></Btn>
        <Btn label="Strikethrough" active={s.strike} onClick={() => c().toggleStrike().run()}><s>S</s></Btn>
      </div>
      <div className="tb-group">
        <Btn label="Heading" active={s.h1} onClick={() => c().toggleHeading({ level: 1 }).run()}>H1</Btn>
        <Btn label="Subheading" active={s.h2} onClick={() => c().toggleHeading({ level: 2 }).run()}>H2</Btn>
        <Btn label="Block quote" active={s.quote} onClick={() => c().toggleBlockquote().run()}>❝</Btn>
        <Btn label="Bulleted list" active={s.bullet} onClick={() => c().toggleBulletList().run()}>•</Btn>
        <Btn label="Numbered list" active={s.ordered} onClick={() => c().toggleOrderedList().run()}>1.</Btn>
        <Btn label="Scene break" onClick={() => c().setHorizontalRule().run()}>⁂</Btn>
      </div>
      <div className="tb-group">
        <Btn label="Undo (Ctrl+Z)" disabled={!s.canUndo} onClick={() => c().undo().run()}>↶</Btn>
        <Btn label="Redo (Ctrl+Shift+Z)" disabled={!s.canRedo} onClick={() => c().redo().run()}>↷</Btn>
      </div>
      {children && <div className="tb-group tb-right">{children}</div>}
    </div>
  )
}

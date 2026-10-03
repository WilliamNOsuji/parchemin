import { Extension } from '@tiptap/react'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'

/** Marks the top-level block holding the cursor so focus mode can dim everything else. */
export const ActiveBlock = Extension.create({
  name: 'activeBlock',
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('activeBlock'),
        props: {
          decorations(state) {
            const { $from } = state.selection
            if ($from.depth < 1) return null
            const start = $from.before(1)
            const node = $from.node(1)
            return DecorationSet.create(state.doc, [Decoration.node(start, start + node.nodeSize, { class: 'is-active-block' })])
          },
        },
      }),
    ]
  },
})

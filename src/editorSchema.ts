import StarterKit from '@tiptap/starter-kit'

/**
 * The nodes and marks a chapter can hold. The editor and the HTML cleaner both use it,
 * so anything the cleaner keeps is something the editor can show.
 */
export const storyKit = () => StarterKit.configure({ heading: { levels: [1, 2] } })

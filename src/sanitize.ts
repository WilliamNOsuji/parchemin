import { getSchema } from '@tiptap/react'
import { DOMParser as SchemaParser, DOMSerializer } from '@tiptap/pm/model'
import { storyKit } from './editorSchema'

let schema: ReturnType<typeof getSchema> | null = null

/**
 * Rebuilds stored HTML through the editor's schema. Only paragraphs, headings, lists, quotes,
 * scene breaks and text marks survive; scripts, event handlers, styles, images and unsafe
 * links are dropped. Parsing happens in a detached document, so nothing runs or loads.
 */
export function cleanHtml(html: unknown): string {
  if (typeof html !== 'string' || !html.trim()) return ''
  schema ??= getSchema([storyKit()])
  const doc = new DOMParser().parseFromString(`<body>${html}</body>`, 'text/html')
  const node = SchemaParser.fromSchema(schema).parse(doc.body)
  const out = document.implementation.createHTMLDocument('').createElement('div')
  out.appendChild(DOMSerializer.fromSchema(schema).serializeFragment(node.content))
  return out.innerHTML
}

/** Character images must be embedded pictures. A web address would load from someone else's server. */
export function cleanImage(src: unknown): string | null {
  return typeof src === 'string' && /^data:image\/(png|jpe?g|gif|webp|avif);base64,[a-z0-9+/=\s]+$/i.test(src) ? src : null
}

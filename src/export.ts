import { db } from './db'
import { saveFile } from './desktop'

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'story'
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

async function load(storyId: string) {
  const story = await db.stories.get(storyId)
  if (!story) throw new Error('Story not found')
  const { cleanHtml } = await import('./sanitize')
  // Exported files are opened by other apps and e-readers, so only clean, schema-valid text goes out.
  const scenes = (await db.scenes.where('storyId').equals(storyId).sortBy('order'))
    .filter((s) => s.content.trim() || s.words > 0)
    .map((s) => ({ ...s, content: cleanHtml(s.content) }))
  return { story, scenes }
}

export async function exportMarkdown(storyId: string) {
  const { default: TurndownService } = await import('turndown')
  const turndown = new TurndownService({ headingStyle: 'atx', hr: '* * *', emDelimiter: '*' })
  const { story, scenes } = await load(storyId)
  const multi = scenes.length > 1
  const parts = [`# ${story.title}`]
  if (story.synopsis.trim()) parts.push(`> ${story.synopsis.trim().replace(/\n+/g, ' ')}`)
  for (const s of scenes) {
    if (multi) parts.push(`## ${s.title}`)
    parts.push(turndown.turndown(s.content))
  }
  await saveFile(new Blob([parts.join('\n\n') + '\n'], { type: 'text/markdown' }), `${slug(story.title)}.md`, { name: 'Markdown', extensions: ['md'] })
}

/** Tiptap emits HTML; EPUB needs well-formed XHTML (e.g. <br/> not <br>). */
function toXhtml(html: string): string {
  const doc = new DOMParser().parseFromString(`<body>${html}</body>`, 'text/html')
  const ser = new XMLSerializer()
  return Array.from(doc.body.childNodes)
    .map((n) => ser.serializeToString(n).replace(/ xmlns="http:\/\/www\.w3\.org\/1999\/xhtml"/g, ''))
    .join('\n')
}

const xhtmlPage = (title: string, body: string) => `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="en">
<head><meta charset="utf-8"/><title>${esc(title)}</title><link rel="stylesheet" type="text/css" href="style.css"/></head>
<body>${body}</body>
</html>`

export async function exportEpub(storyId: string) {
  const { default: JSZip } = await import('jszip')
  const { story, scenes } = await load(storyId)
  const multi = scenes.length > 1
  const zip = new JSZip()
  // The mimetype entry must come first and be stored uncompressed.
  zip.file('mimetype', 'application/epub+zip', { compression: 'STORE' })
  zip.file(
    'META-INF/container.xml',
    `<?xml version="1.0"?><container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/></rootfiles></container>`,
  )
  zip.file(
    'OEBPS/style.css',
    `body{font-family:serif;line-height:1.5}h1,h2{text-align:center}p{margin:0;text-indent:1.2em}h2+p,hr+p{text-indent:0}hr{border:0;text-align:center;margin:1em 0}hr::after{content:"* * *"}blockquote{margin:1em 2em;font-style:italic}`,
  )

  const chapters = scenes.map((s, i) => ({
    file: `chapter${i + 1}.xhtml`,
    id: `ch${i + 1}`,
    title: s.title,
    body: (multi ? `<h2>${esc(s.title)}</h2>\n` : '') + toXhtml(s.content),
  }))
  const titlePage = {
    file: 'title.xhtml',
    id: 'title',
    title: story.title,
    body: `<h1>${esc(story.title)}</h1>${story.synopsis ? `<p><em>${esc(story.synopsis)}</em></p>` : ''}`,
  }
  const all = [titlePage, ...chapters]
  for (const c of all) zip.file(`OEBPS/${c.file}`, xhtmlPage(c.title, c.body))

  zip.file(
    'OEBPS/nav.xhtml',
    xhtmlPage(
      'Contents',
      `<nav epub:type="toc"><h2>Contents</h2><ol>${all
        .map((c) => `<li><a href="${c.file}">${esc(c.title)}</a></li>`)
        .join('')}</ol></nav>`,
    ),
  )

  const bookId = `urn:parchemin:${story.id}`
  zip.file(
    'OEBPS/content.opf',
    `<?xml version="1.0" encoding="utf-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="bookid">
<metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
<dc:identifier id="bookid">${bookId}</dc:identifier>
<dc:title>${esc(story.title)}</dc:title>
<dc:language>en</dc:language>
<meta property="dcterms:modified">${new Date().toISOString().replace(/\.\d+Z$/, 'Z')}</meta>
</metadata>
<manifest>
<item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>
<item id="css" href="style.css" media-type="text/css"/>
${all.map((c) => `<item id="${c.id}" href="${c.file}" media-type="application/xhtml+xml"/>`).join('\n')}
</manifest>
<spine>
${all.map((c) => `<itemref idref="${c.id}"/>`).join('\n')}
</spine>
</package>`,
  )

  const blob = await zip.generateAsync({ type: 'blob', mimeType: 'application/epub+zip' })
  await saveFile(blob, `${slug(story.title)}.epub`, { name: 'EPUB', extensions: ['epub'] })
}

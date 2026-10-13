import { defineConfig, type Plugin } from 'vite'

/**
 * Two checks for publishing. The build fails while a link still carries a REPLACE-ME placeholder
 * (see site/README.md), and when SITE_URL is set the page names its own address as the canonical one.
 * scripts/build-pages.mjs and the deploy workflow set SITE_URL; a plain `npm run build:site` leaves it out.
 */
function publishChecks(): Plugin {
  return {
    name: 'parchemin-publish-checks',
    apply: 'build',
    transformIndexHtml(html) {
      const placeholders = [...new Set(html.match(/https?:\/\/[^\s"'<>]*REPLACE-ME[^\s"'<>]*/g) ?? [])]
      if (placeholders.length || html.includes('REPLACE-ME')) {
        throw new Error(
          `site/index.html still has placeholder links; fill them before publishing (see site/README.md):\n  ${placeholders.join('\n  ')}`,
        )
      }
      const url = process.env.SITE_URL
      if (!url) return html
      if (!/^https?:\/\//.test(url)) throw new Error(`SITE_URL must be a full address, got "${url}"`)
      return {
        html,
        tags: [
          { tag: 'link', attrs: { rel: 'canonical', href: url }, injectTo: 'head' },
          { tag: 'meta', attrs: { property: 'og:url', content: url }, injectTo: 'head' },
        ],
      }
    },
  }
}

/** The landing page under site/, built separately from the app. `base` comes from the command line or build-pages. */
export default defineConfig({
  root: 'site',
  publicDir: 'public',
  build: { outDir: '../dist-site', emptyOutDir: true },
  plugins: [publishChecks()],
})

# site/

The landing page, built from `design/parchemin-website.html` (the mockup approved on 2026-10-10). One page, no
JavaScript beyond loading the fonts and the stylesheet. Fonts are bundled from `@fontsource` (Inter) and
`@fontsource-variable` (Literata, with its optical-size axis so the headline gets the display cut), so a visit makes no
request to any other server.

## Run

```bash
npm run site         # dev server for the site
npm run build:site   # static build in dist-site/
npm run build:pages  # the site and the app together in dist-pages/, laid out as they are published (see below)
```

## Links, while the source is private

The repository is private (decided 2026-10-12), so the page links to nothing on GitHub: a visitor would get a 404.
The only outward link is "Write in the browser" / "Open the web app", which is `app/` relative to the site, so it works
at any address. The build fails while any link carries `REPLACE-ME` (the check is in `vite.site.config.ts`).

What the mockup had, and what the page says instead for now:

| Where | Mockup | Now |
|---|---|---|
| Nav | "Source" link to the repository | Removed |
| Hero note | "Free and open source under the AGPL." | "Free. … The code will be published under the AGPL." |
| Your words, third paragraph | "The code is free software under the GNU Affero General Public License. Whoever hosts a changed copy has to offer you its source…" | The same in the future tense |
| Your words, How it is built | "The founder's note on why explains the rest." and a "Read the launch note" link | "A founder's note on why will follow." and no link |
| Get Parchemin, Windows | "Download the .exe" button to the releases page | The "Planned" tag, like macOS and Linux. The two "Download for Windows" buttons (nav and hero) still point at `#download` |
| Get Parchemin, Source | "View on GitHub" button | The "Planned" tag, with "To be published under the AGPL-3.0-or-later." |
| Footer | "AGPL-3.0-or-later" after the copyright, and a "Launch note" link | Copyright only, no link |

The licence mentions are softened on purpose: a page that says the shipped code is under the AGPL tells everyone they
may ask for its source.

**When the source goes public**, put back the "Source" nav link and the "View on GitHub" button (to
`https://github.com/WilliamNOsuji/parchemin`), the present-tense licence sentences and the footer's licence.
**When a Windows installer exists**, replace the Windows row's "Planned" tag with the "Download the .exe" button
pointing at wherever the installer is hosted (GitHub releases only once the repository is public).
**When the launch note is written**, add "Read the launch note" under How it is built and "Launch note" in the footer.

## Publishing

The site is published from `dist-pages/`, which `npm run build:pages` builds: the site at the root, the app under
`app/`. The app's service worker is scoped to `app/`, so it never caches or intercepts the site itself.

**Cloudflare Pages** is the route chosen on 2026-10-15, at `https://parchemin.art/` (the app at
`https://parchemin.art/app/`). Its free plan builds from a private repository, serves a static site with no bandwidth
limit and allows 500 builds a month; nothing is paid but the domain, which stays registered at Wix. Cloudflare serves the
domain's DNS, because a Pages project can only take a root domain (not just `www.`) from a zone on Cloudflare. One-time
setup:

1. Create a free Cloudflare account and add `parchemin.art` as a site on the Free plan. Cloudflare copies the DNS
   records it finds; delete the old Wix ones (the three `A` records for `parchemin.art` and the `www` `CNAME` to
   `cdn3.wixdns.net`). Note the two nameservers Cloudflare gives.
2. At Wix (*Domains → parchemin.art*), point the domain to those two nameservers instead of `ns2/ns3.wixdns.net`.
   Wix may ask to disconnect the domain from a Wix site first. Cloudflare says when the zone is active.
3. In Cloudflare, *Workers & Pages → Create → Pages → Connect to Git*: let Cloudflare's GitHub app see the
   `parchemin` repository only, pick it, production branch `main`, framework preset *None*, build command
   `npm run build:pages`, output directory `dist-pages`. Add the environment variable
   `ELECTRON_SKIP_BINARY_DOWNLOAD` = `1`, so the build does not fetch Electron, which the site does not use. The build
   names `https://parchemin.art/` as the site's address by itself (`scripts/build-pages.mjs`).
4. In the project, *Custom domains → Set up a custom domain*: add `parchemin.art`, then `www.parchemin.art`.
   Cloudflare writes the DNS records. Then *Rules → Redirect Rules*, template "Redirect from WWW to root", so there is
   one address.

Every later push to `main` builds and publishes again; another branch gets a preview at its own `*.pages.dev` address.

**Netlify** works the same way and stays configured (`netlify.toml`: build command, output folder, Node 24), but its
free plan now counts credits (300 a month, 15 for each deploy), so it is the fallback. One-time setup:

1. Sign in at app.netlify.com with GitHub and choose *Add new site → Import an existing project → GitHub*. Netlify's
   GitHub app asks which repositories it may see; grant it `parchemin` only.
2. Pick the repository and the `main` branch. The build settings are filled in from `netlify.toml`; leave them.
3. Deploy. Every later push to `main` deploys again, and pull requests get a preview address.
4. Under *Site configuration → Domain management*, rename the `*.netlify.app` address or add your own domain. The
   build reads the address from Netlify, so the page's canonical link follows it with no change here.

Settle the address before telling writers about the web app; `parchemin.art` is it. A library lives in the browser's storage for the
address it was written at and does not follow a move; the Safekeeping backup file is how it would travel.

Other static hosts work the same way: build with `npm run build:pages` and publish `dist-pages/`. `SITE_BASE` is the
path the site is served from (default `/`), `SITE_URL` its full address for the page's canonical link (optional):

```bash
SITE_BASE=/ SITE_URL=https://example.com/ npm run build:pages
```

`.github/workflows/deploy.yml` does the same for GitHub Pages, run by hand from the Actions tab. Pages needs a public
repository or a paid GitHub plan, and Pages must be enabled with *Settings → Pages → Source: GitHub Actions* first, so
it waits until the source is public. Switch its trigger to `push` then, if Pages is preferred over Netlify.

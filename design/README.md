# design/

UI/UX mockups, made on 2026-10-10. Each is one self-contained HTML page: open it in a browser.

| File | What it is |
|---|---|
| `parchemin-desktop.html` | The Electron desktop app, drawn as a 1280 × 800 window in Obsidian's style and scaled to fit. Nine screens, switched at the top: Library, Write, Dialogue, Outline, Cast, Canvas, Web, Focus mode, Command palette, Safekeeping. Design notes under each screen, then what the desktop app borrows from Obsidian, leaves out, and can do that the web app cannot |
| `parchemin-website.html` | The landing page, built to the Impeccable skill's published rules |

The decisions behind them are in `../research.md`, section 13, and the roadmap in `../PHILOSOPHY.md`.

Both pages use Parchemin's own tokens from `../src/styles.css`, with the muted text colour darkened to pass 4.5:1.
The fonts (Inter and Literata) load from Google Fonts here because the pages were first published as Claude artifacts,
which allow no other font host. The app itself ships its fonts and makes no such request. Every word on the screens is
either Parchemin's own copy or an example novel written for the mockups, "The Lighthouse Keeper's Daughter".

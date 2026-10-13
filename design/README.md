# design/

UI/UX mockups, made on 2026-10-10. Each is one self-contained HTML page: open it in a browser.

| File | What it is |
|---|---|
| `parchemin-desktop.html` | The Electron desktop app, drawn as a 1280 × 800 window in Obsidian's style and scaled to fit. Nine screens, switched at the top: Library, Write, Dialogue, Outline, Cast, Canvas, Web, Focus mode, Command palette, Safekeeping. Design notes under each screen, then what the desktop app borrows from Obsidian, leaves out, and can do that the web app cannot |
| `parchemin-website.html` | The landing page, built to the Impeccable skill's published rules |

The decisions behind them are in `../research.md`, section 13, and the roadmap in `../PHILOSOPHY.md`.

Integrated on 2026-10-12: the desktop mockup's shell and screens went into the web app under `../src/` (the Electron build
will wrap the same code), and the website went into `../site/`. The Canvas and Web screens are not built; they wait on the
open decisions in section 13. These files stay as the reference the code was built against.

`example-library.json` is the example novel from the mockups as a Parchemin backup file (synthetic text, the chapters padded
with filler). Restore it from the Safekeeping page to see the app the way the mockups show it. Restoring adds its stories to
whatever library is already there, so use an empty one.

Both pages use Parchemin's own tokens from `../src/styles.css`, with the muted text colour darkened to pass 4.5:1.
The fonts (Inter and Literata) load from Google Fonts here because the pages were first published as Claude artifacts,
which allow no other font host. The app itself ships its fonts and makes no such request. Every word on the screens is
either Parchemin's own copy or an example novel written for the mockups, "The Lighthouse Keeper's Daughter".

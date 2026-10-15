# design/

UI/UX mockups, made on 2026-10-10. Each is one self-contained HTML page: open it in a browser.

| File | What it is |
|---|---|
| `parchemin-desktop.html` | The Electron desktop app, drawn as a 1280 × 800 window in Obsidian's style and scaled to fit. Nine screens, switched at the top: Library, Write, Dialogue, Outline, Cast, Canvas, Web, Focus mode, Command palette, Safekeeping. Design notes under each screen, then what the desktop app borrows from Obsidian, leaves out, and can do that the web app cannot |
| `parchemin-website.html` | The landing page, built to the Impeccable skill's published rules |

The decisions behind them are in `../research.md`, section 13, and the roadmap in `../PHILOSOPHY.md`.

Integrated on 2026-10-12: the desktop mockup's shell and screens went into the web app under `../src/` (the Electron build
will wrap the same code), and the website went into `../site/`. The Canvas and Web screens were built on 2026-10-15; the
Web without the AI guide, so its "Reading" panel, "Read now", "What the guide read" and proposals are not on screen.
These files stay as the reference the code was built against.

`example-library.json` is the example novel from the mockups as a Parchemin backup file (synthetic text, the chapters padded
with filler). Since 2026-10-15 it also holds the board "Who knows what" (the mockup's cards, group, picture and arrows),
three core ideas, two settings and four symbols, and each written chapter opens with a paragraph that names who and what
the mockup's Web draws there, so the grey lines come out as drawn. "The Board" is never matched on its first word. The
padding no longer names the ledger or the village, which would otherwise join every chapter to them. Chapter 8 stays
unwritten, so the Web shows it as "not written" where the mockup draws two grey lines to it. Restore it from the Safekeeping page to see the app the way the mockups show it. Restoring adds its stories to
whatever library is already there, so use an empty one.

Both pages use Parchemin's own tokens from `../src/styles.css`, with the muted text colour darkened to pass 4.5:1.
The fonts (Inter and Literata) load from Google Fonts here because the pages were first published as Claude artifacts,
which allow no other font host. The app itself ships its fonts and makes no such request. Every word on the screens is
either Parchemin's own copy or an example novel written for the mockups, "The Lighthouse Keeper's Daughter".

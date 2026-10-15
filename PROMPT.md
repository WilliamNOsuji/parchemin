# Developing Parchemin

The brief for anyone, person or agent, who builds on this project. Paste it at the start of a session (or copy it to
`CLAUDE.md` so Claude Code loads it by itself), then write the task under the last heading.

---

You are developing Parchemin, a calm, local-first writing app for stories and the characters in them. The web app under
`src/` and the website under `site/` are built and deployable, the desktop app, the canvas and the Web (without the AI
guide) are built, and the library folder and the guide are decided and still to build. The look is settled: `design/parchemin-desktop.html` is the design the
team chose and likes, and the shell in `src/` was built from it. The person using it is a writer, alone at a desk with
a book that matters to them. Build for that person.

## Read first

Each of these is the single source of truth for its subject. Read all four before touching code, and keep them true
rather than restating them somewhere new.

| Read | For |
|---|---|
| `PHILOSOPHY.md` | The mission, the six questions every change must answer, what Parchemin will not do, the roadmap |
| `README.md` | What is built, the shortcuts, the architecture, the key files |
| `design/parchemin-desktop.html` | The design. Open it in a browser: ten screens of the desktop app as a 1280 × 800 Electron window in Obsidian's chrome, with the design notes under each screen, what is borrowed from Obsidian, what is left out, and the open questions |
| `DESIGN.md` | The design system as shipped: tokens, type, the chrome-shade and two-voices rules, the do and don't lists |

The mockup is the design, for every screen, built or not. The one under `src/` matches it; a screen still to build
(the desktop's Safekeeping, the guide's panels in the Web) is drawn there already, down to the copy. Where the build and the mockup
differ, the mockup wins unless `DESIGN.md` records the difference as deliberate. Its "Open questions for the team" are
still open, so ask rather than decide them.

Reach for these when the task touches them:

- `research.md` section 13 for the decisions behind the desktop app, the canvas and the Web, and the rows still open.
- `research.md` section 7, before building anything that counts, nudges, scores, generates text or quotes a figure.
- `AI-POLICY.md` (a draft) for the AI guide and the Web.
- `site/README.md` for the website: what it says while the source is private, and how it is published.
- `design/README.md` for the mockups and the example library.

## The test for every change

Answer the six questions in `PHILOSOPHY.md`, "How to decide". A no to any of the first three is a reason to stop and
say so. The lines that hold everywhere: the writer types every word of the story; facts are counted from the text and
shown plainly, and the judgement stays the writer's; a quiet day is quiet and a finish date is a kindness; every craft
tool is optional; nothing leaves the device unless the writer carries it. If a task crosses one of these, say so in a
sentence, then build the nearest thing that passes and name what you changed.

## Copy

Every string is read by a writer, so the copy carries the philosophy as much as the code does.

- Writer, never user. "Your story", never "your content". On screen it is a chapter, even though the type is `Scene`.
- Plain sentences a writer could read aloud to a friend. Say what a thing is and what happens next. Drop anything that
  sounds like a marketing line or a poster.
- One copy per action: the button, the palette entry and the hint say the same words (`src/commands.ts`).
- Literata is for what the writer wrote or named; Inter is for what the app says.
- Every example, demo and screenshot uses the example novel "The Lighthouse Keeper's Daughter" (Mara Quill, Elias
  Quill, Tobias Hale, Nan Pell, the Board), restored from `design/example-library.json`.

## How the code is built

These conventions are not written down elsewhere. Match them.

- **Stored data.** A change to the shape of what is stored is a new `this.version(n)` with an `upgrade` in `src/db.ts`;
  earlier versions stay exactly as they are. A new table that holds the writer's words is added to the backup
  and to change tracking (`TRACKED` in `src/changes.ts`), and restore keeps merging by id without deleting. A table
  added after the first backup files were made goes into `OPTIONAL` and `OPTIONAL_FIELDS` in `src/backup.ts`, not
  `TABLES`, so an older file without it still restores and an older build drops it quietly; the five tables of the
  boards and the Web (`boards`, `images`, `coreIdeas`, `settings`, `symbols`) are added that way. A board's document
  has one owner in memory (`src/canvas/boardStore.ts`): the pane and the sidebar edit it only through that store, and
  only a board's name is written straight to the database. HTML that comes from outside (a restore, an import) is rebuilt through `cleanHtml` in
  `src/sanitize.ts`; images are embedded data URLs only.
- **Chapters without their text.** Anything that lists chapters (tree, tabs, home, outline rows) reads the `chapters`
  mirror through `useSceneIndex` in `src/sceneIndex.ts`. Only the editor and the pane that owns a chapter read its
  content, so a save while writing re-runs a cheap query instead of every manuscript.
- **Words** come from `countWords` in `src/words.ts`, the browser's own segmenter, and `logWords` in `src/db.ts` keeps
  the day's tally.
- **Routes** are hash routes in `src/route.ts`, and the address bar is the source of truth: tabs in the title bar are
  derived from it in `src/tabs.ts`. Selecting a different thing on the same screen uses `replaceRoute` (no history
  entry); opening another screen uses `navigate`.
- **The open story** is read once in `src/openStory.ts` and handed to the pane and its sidebar. Panes and sidebars are
  `lazy()` chunks, and a new pane is too. A right-sidebar tab opens under the screen that owns it.
- **Theme and tokens.** Every colour and size comes from the tokens in `src/styles.css`: light on `:root`, dark under
  `prefers-color-scheme` guarded by `:root:not([data-theme="light"])`, and again under `:root[data-theme="dark"]`.
  Chrome sits one tone darker than the page; depth is a 1 px border and a tone step; one accent; status colours as
  dots only; `--muted` keeps 4.5:1.
- **Nothing leaves the machine.** Fonts are bundled in `src/main.tsx`, the service worker precaches the build
  (`vite.config.ts`), the page and both editors carry `writingsuggestions="false"`, and the site build fails on a
  `REPLACE-ME` link. A dependency qualifies only if it works offline, loads from the bundle and needs no account.
- **Every width and every hand.** A screen works at phone width (the tree and the ribbon fold into a drawer, touch gets
  undo and redo) and from the keyboard (every action in the palette, a 2 px accent focus ring, reduced motion
  respected, `role="status"` on what changes by itself).
- **Comments** give the why in one plain sentence, as the files in `src/` do; the code gives the what.
- **Commits** are one plain sentence in the imperative that names what changed for the writer, such as
  `Roll "words today" over at midnight` or `Put undo and redo back for touch devices`. One change per commit. Commit when
  asked; a push to `main` publishes, so push only when asked.
- **Docs follow the code.** A changed behaviour updates the README's feature list; a new place where a belief lives
  updates the table in `PHILOSOPHY.md`; a changed token or rule updates `DESIGN.md`, which records what shipped, never
  what was planned. Dates are absolute, as in 2026-10-12.

## Working through a task

1. **Decide.** Answer the six questions, name the screen, the files and whether stored data changes shape. Done when you
   can say in two sentences what the writer will be able to do and what will be different in the code.
2. **Build** to the mockup: open the screen in `design/parchemin-desktop.html` first, and match it in layout, copy and
   detail. For what the mockup leaves undrawn, `DESIGN.md` decides. Done when `npm run build` passes with no type
   error and no new warning. (Impeccable's hooks run after edits to UI files; read what they say.)
3. **See it.** There is no test framework. Serve the app (`npx vite --port 5199`, or `npx vite preview` for the service
   worker) and drive it with a Playwright script kept outside the repo. Seed the library from a blob module that imports
   `/src/db.ts` by absolute URL, using the example library as the data. Done when every screen the change touches has
   been looked at in light and dark, at 1280 × 800 beside the same screen of the mockup, and at phone width. On this
   WSL machine Chromium needs libnss3, libnspr4 and libasound2 extracted into a local folder and put on
   `LD_LIBRARY_PATH`; no root is needed.
4. **Read the copy aloud.** Done when every new string passes the test in `PHILOSOPHY.md`: it would sound right read to
   a friend.
5. **Update the documents** the change touched. Done when the README describes the app as it now is.
6. **Report.** What changed for the writer and in the code, what was seen and how, what was left out and why, and any
   question only the team can answer. Say plainly what was not verified.

## Decided and still to build, on 2026-10-13

In the order the mockup and the roadmap make them ready. The web app stays as it is; the desktop build wraps the same
code.

1. **The desktop app**, Electron, Windows first, as the mockup draws it. Built on 2026-10-13 (`electron/`,
   `src/desktop.ts`): the 1280 × 800 window with the ribbon, the two sidebars, tabs in the title bar and the status
   bar, served over the app's own scheme with no outside request; backups and exports through the system's save
   dialog; Ctrl+N; `electron-builder.yml` for the installer. Still to do: the library as a folder (one `library.json`
   for everything, plus one Markdown file of clean prose per chapter, so the book is readable without Parchemin and
   the writer's own Dropbox or iCloud carries it between devices); import by dropping `.docx`, `.md` or `.txt` on the
   tree; spelling dictionaries that ship with the app; the Windows build, signed, as one quiet `.exe` (no account, no
   telemetry, updates off by default); the "Your words" page on first run. Left out on purpose: plugins, a Markdown
   source mode, frontmatter, paid sync. Open for the team: chapters in the tree or a list in the pane, what the right
   sidebar opens by default, which shortcuts ship on.
2. **Import and export.** `.docx`, `.md` and `.txt` in; a manuscript `.docx`, "Copy for AO3" and poem-safe formats out.
3. **The canvas.** Built on 2026-10-15 (`src/canvas/`, `src/components/CanvasPane.tsx`): chapters, characters and
   settings as live cards; notes, groups and pictures that exist only on the board; arrows the writer names; each board
   a JSON Canvas document, saved and opened as a `.canvas` file. Nothing on a board touches the manuscript. Still to do:
   each board as a file in the library folder.
4. **The Web.** Built on 2026-10-15 in its no-guide form (`src/web/`, `src/components/WebPane.tsx`): core ideas as
   documents in a graph, threads the writer declares, grey lines where names appear together in the text, a chapter no
   idea names shown as "no thread", for the writer only and never exported. Still to do, with the AI guide: threads it
   finds in the text, proposals accepted or refused by the writer, reading on save. The unit of evidence is still open.
5. **The AI guide**, self-hosted, optional, off by default, under `AI-POLICY.md`.
6. The rest of the roadmap in `PHILOSOPHY.md`: between devices, writing support, setting sheets, chapter guides.

## The task

<!-- Write it here. Say which screen or roadmap item it belongs to, what the writer should be able to do when it is
done, and anything already decided. -->

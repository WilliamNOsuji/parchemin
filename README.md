# Parchemin

A calm, local-first writing app for stories and the characters in them.

## Run

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # production build in dist/
npm run desktop      # the desktop app: built, then opened in its window
npm run desktop:dev  # the desktop app around the dev server, reloading as the code changes
npm run dist:win     # the Windows installer, in release/
```

## What's in the app

The shell follows the desktop mockup under `design/` (integrated on 2026-10-12): the chapter in the middle, everything else at the edges and collapsible to nothing.

- **The shell**: a ribbon of views (Library, Search, Outline, Cast, Boards, Web, Drawer, Safekeeping, theme), the whole library as one tree (folders, stories, chapters with status dots and word counts), tabs in the title bar (a chapter, an outline, a cast, a board, the Web, the drawer or safekeeping is a tab; they survive a reload), a right sidebar of icon tabs, and a status bar that says where the words are and when they were last copied. Both sidebars hide. The library tree and the ribbon fold into a drawer on phones
- **Command palette** (`Ctrl+P`): every action by name, with its shortcut taught beside it; the last commands used come first. `Ctrl+Shift+F` focus, `Ctrl+Shift+S` snapshot, `Ctrl+D` the Dialogue panel
- **Rich text editor** (Tiptap): bold/italic/underline/strike, headings, quotes, lists, scene breaks, smart quotes, autosave. Literata at 18 px on a 620 px measure, first lines indented as in a book
- **Focus mode**: hides the ribbon, both sidebars and the formatting bar, dims everything but the current paragraph to 20%, typewriter scrolling (`Ctrl+Shift+F`, `Esc` to exit)
- **Right sidebar beside the chapter**: the chapter plan (goal, conflict, turn, POV, setting, prop, last line), the Dialogue panel, snapshots, notes (the chapter's summary, a sentence waiting, the story's title, synopsis, folder and tags) and unblock prompts
- **Snapshots**: save a draft before a rewrite, preview it, restore it (current text is snapshotted first)
- **The drawer**: removing a story, chapter, character, board, core idea or setting sets it aside with its snapshots. Put it back or delete it for good from the drawer page, or put it back from the Library's sidebar
- **Folders + tags**: nested folders, drag stories onto folders, a Tags tab and a Search tab (stories and chapters) in the library sidebar
- **Structure templates**: blank, short story, three-act, Hero's Journey, Save the Cat
- **Outline**: rows, not cards: drag handle, number, title and summary, status, the three plan marks (goal, conflict, turn), words. The finish line with its progress, date and daily figure, and "Pause the finish line". The audit ("Read the whole outline") sits in the right sidebar beside the rows, with the pace compared honestly to the last seven days
- **Cast**: one card per person (name, role, voice with its family and tactic, what they want in a room, their function, the hero check), a line under the grid that reads the voices across the cast and names the pairs with friction built in. The selected character is edited in the right sidebar: voice, hero check (unticked questions first), and biography with the profile (image, name, role, custom fields) above it
- **Unblock prompts**: writing nudges by category. Suggestions only, nothing is written for you
- **Boards** (the canvas, built on 2026-10-15): one board or many per story, as Obsidian's canvas draws them. Chapters, characters and settings are added from the story as live cards (a chapter card shows its status, words and summary, and editing the summary edits the outline); notes, groups and pictures exist only on the board (a picture is redrawn when it is added, so what a camera writes into a file, such as where it was taken, is not kept); arrows go from a card's side handle to another card, and the writer names each one. Drag, resize, a group carries the cards inside it, pan, zoom (`Ctrl` + wheel) and Fit; everything also works from the keyboard (Tab to a card, Enter, arrow keys, Delete, `Ctrl+D`; arrows are drawn from the sidebar). The sidebar lists the boards, edits the picked card or arrow, and says what the board holds. Each board is a JSON Canvas document: "Save as a .canvas file…" writes one Obsidian opens, and "Open a .canvas file…" makes a new board from one, keeping what Parchemin does not show so it saves back the same. Nothing on a board touches the manuscript. The library sidebar starts folded here, because boards want width
- **The Web** (built on 2026-10-15, without the AI guide): the story's core ideas, written in the writer's own words, drawn as a graph with the characters, settings, symbols, chapters and boards. A thread is a link the writer made from a core idea to a part that carries it; grey lines only mean that two names appear together in the text, counted on this device (full names, and a first name when it can only mean one person, so "The Board" is never matched on "the"). A written chapter no idea names has a dashed ring and "no thread"; nothing is scored. Picking a part shows the plain evidence ("Appears in ch. 3, 6, 7 as Mara, Mara Quill") and the ideas that name it. A legend shows and hides each kind. For the writer only: the Web is in the backup file and in no export. The guide's own reading, its threads and its proposals wait for the guide
- **Setting sheets and symbols**: a setting is asked obstacle-first (what makes it hard, what it reveals, props one per line, mood last); a symbol is a name and a line. Both live in the Web's sidebar, and a setting can sit on a board as a live card
- **Dialogue panel**: per chapter, who wants what (each speaker's want, what they won't say and what they can't, with the voice card as a hint), a script draft outside the manuscript whose `NAME (tactic): line` labels read back as beats, a cover-the-names test on the script or the chapter, and the dialogue pass: the writer's own checklist with plain facts from the text (feelings said out loud, questions answered with questions, tags other than "said", the last paragraph). Nothing is suggested or scored. The sidebar widens for it
- **Import Markdown** (built on 2026-10-15): one file or many, chosen in a dialog or dropped on the library tree (on a story to add to it, on a folder or the empty tree for a new story) or anywhere on the window. Each file becomes a chapter, in the order of the files' names (chapter 2 before chapter 10); a file with headings can be split into a chapter at each one, and the dialog lists the chapters before anything is written. The chapters go into a new story or after the last chapter of one already here. Front matter titles, Obsidian's links, highlights and comments are read as plain text; pictures are left out and said so; a file with no blank lines is read a paragraph per line. Parchemin's own Markdown export imports back as the same story, title, synopsis and chapters. Imported words are not counted as words written today. From the palette ("Import Markdown files"), a story's or folder's menu in the tree, the Safekeeping page, and the empty library
- **Export**: Markdown and EPUB, from the Safekeeping page or the palette. An export holds the story's chapters and nothing else: no board, core idea, setting sheet or symbol
- **Library page**: a line on why we write, the stories you were in (one click reopens the chapter), today's words as seven bars (days you wrote are shown, days you didn't are just quiet, no streak is counted), a sentence waiting (the last paragraph you wrote, with the note you left about what happens next), and a nudge
- **Safekeeping**: its own page. Save everything as one JSON file (boards, pictures, core ideas, settings and symbols included), check that a backup file is whole, restore it (merging by id, nothing is deleted). A backup counts once Parchemin knows the file exists: written through the browser's save dialog where there is one, otherwise read back with "Check a backup file" after the download. The page and the status bar show when the last backup file was made and what changed since (every write to a table that goes into a backup is noted, in `src/changes.ts`; the page's sidebar lists the records), say plainly whether the browser has promised to keep the data (`navigator.storage.persist()`, asked once the first time the Safekeeping page shows with writing in it, with a button to ask again), and suggest a backup once about 2,000 new words, pastes and rewrites included, are in no saved backup file. Restored text is rebuilt through the editor's schema, so a backup file cannot carry scripts
- **Theme**: follows the system, with a toggle in the ribbon to pin light or dark on this device
- **No AI, and the browser's kept out too**: the page and both editors set `writingsuggestions="false"`, and a note on the Safekeeping page explains how to turn off Apple Intelligence, Chrome's "Help me write" and grammar extensions at the source
- **PWA**: installable and works offline after the first visit (service worker is generated at build time, so it only runs in `npm run build` / `preview`, not `npm run dev`). Fonts ship with the app, so it makes no request to any other server

## The website

`site/` holds the landing page from `design/parchemin-website.html`, as a second Vite root with the same bundled fonts (no request to Google Fonts). `npm run site` serves it and `npm run build:site` builds it into `dist-site/`, which Cloudflare Pages publishes at `https://parchemin.art/` after every push to `main`. Only the site is published; the app ships as the desktop app. (`npm run build:pages` builds the site and the web app together into `dist-pages/`, the app under `app/`, for the day the web app is published too.) The one-time setup, the Netlify fallback (`netlify.toml`), what the page says while the source is private, and what to restore when it goes public are in `site/README.md`.

## The desktop app

`electron/` wraps the same web app in an Electron window, as the mockup under `design/` draws it: the tabs in the title bar, the system's own window controls at its right (the title bar drags the window), 1280 × 800 by default, and the window remembers its size and place. The page is served from the app's own files over the `parchemin://` scheme, with a content security policy that allows nothing but those files; the preload (`electron/preload.cts`) gives the page four functions and nothing of Node; and the main process (`electron/main.mts`) makes no request to any other server: there is no updater and no telemetry, and the spelling dictionaries Chromium would otherwise fetch from Google are pointed at the app itself, so the desktop app has no spellcheck until dictionaries ship with it. A link in the writer's own text opens in their browser.

What the page does differently on a desktop goes through `src/desktop.ts`. Backups and exports are saved through the system's own dialog, so a backup always lands in a real folder and always counts; the status bar says "Kept on this computer" and the Safekeeping page drops the browser's persistence question; `Ctrl+N` makes a new chapter; and the window controls take the chrome's colours whenever the theme changes, light or dark. The library stays in the app's own storage for now: the library folder (`library.json` and a Markdown file per chapter) is the next step.

`npm run dist` packages the app for the platform it runs on and `npm run dist:win` makes the Windows installer (`electron-builder.yml`: one click, per user, the writer's data kept when the app is removed). The Windows installer was first built on 2026-10-15, on Windows itself with Node 22 (`npm ci`, then `npm run dist:win`); it is not signed yet, so Windows warns before the first run. An unpacked Linux build has been made too.

On Linux and WSL, Electron needs `libnss3`, `libnspr4` and `libasound2`, which a bare install may lack (`sudo apt install libnss3 libnspr4 libasound2t64`). Windows and macOS need nothing extra.

## Architecture

React + TypeScript + Vite. All data lives in the browser's IndexedDB via Dexie (`src/db.ts`), so it works offline
and the writer owns their data. The desktop app (`electron/`) wraps this same code. The shell is `src/App.tsx` with `Ribbon`, `LibraryTree`, `TabStrip`, `RightSidebar` and
`StatusBar` under `src/components/`; routes are in `src/route.ts`, open tabs in `src/tabs.ts`, the command list in
`src/commands.ts`, the theme in `src/theme.ts`. Each screen is a pane (`Home`, `StoryView` with `SceneEditor`,
`OutlinePane`, `CastPane`, `CanvasPane` and `WebPane`, `SafekeepingPane`, `DrawerPage`) with a matching sidebar (`HomeSidebar`, `StorySidebar`,
`ChangesSidebar`). The boards live in `src/canvas/`: the JSON Canvas types and parser (`types.ts`, `jsonCanvas.ts`), one in-memory owner for the open board's document that saves it half a second after a change (`boardStore.ts`), the pan-and-zoom surface (`surface.tsx`), the arrows (`edges.tsx`), the cards and toolbars (`cards.tsx`, `toolbar.tsx`, `addFromStory.tsx`) and the `.canvas` files (`canvasFiles.ts`). The Web lives in `src/web/`: where names appear together (`cooccur.ts`), the graph's model (`model.ts`, `useWebModel.ts`), a deterministic force layout (`layout.ts`) and the graph with its legend (`Graph.tsx`). Database version 7 added five tables (`boards`, `images`, `coreIdeas`, `settings`, `symbols`); they go into backups as optional keys, so a backup file made before them still restores. The desktop (Electron) build will wrap this same code. The story on screen is read once in `src/openStory.ts` for the pane and the sidebar, and every chapter is mirrored without its text into the `chapters` table (`src/chapterMirror.ts`) so the tree, the tabs and the home screen never read the manuscripts. Markdown comes in through `src/importMarkdown.ts`, which reads it with `marked` (loaded only when the writer imports) and rebuilds it through the editor's schema like any restored text. Word counts come from the browser's word segmenter (`src/words.ts`), so French
punctuation and Chinese or Japanese text count correctly. A story is made of chapters (`Scene`); a story always has at least one, so
single-document writers never need to think about structure.

## Philosophy

The mission, beliefs and decision tests live in [PHILOSOPHY.md](PHILOSOPHY.md). Read it before adding features.
The rules for the optional AI guide are in [AI-POLICY.md](AI-POLICY.md) (draft).
The brief for anyone, person or agent, who develops the app is [PROMPT.md](PROMPT.md): read it at the start of a session, then add the task.
A pass on the interface follows [PROMPT-UI.md](PROMPT-UI.md): what better means for a writer, the method, and the shape of the report.

## Not built yet

The agreed roadmap is at the end of [PHILOSOPHY.md](PHILOSOPHY.md). In short:
- **Import and export:** import .docx and .txt (Markdown is built, above); export a manuscript .docx, "Copy for AO3" and poem-safe formats.
- **Trust:** a plain "Your words" page, a human-voice pass on public text, a long-manuscript performance check, an easier install.
- **Between devices:** a "move my library" flow, then optional sync that writers can host themselves.
- **Writing tools:** read-aloud, a notes pane, a rhythm view, a private challenge mode.
- **AI:** an optional, self-hosted AI guide, off by default.
- **The desktop app:** the Electron wrapper is built (2026-10-13, see above). Still to do: the library as a folder of plain files (where each board will be a `.canvas` file beside the chapters), import by dropping `.docx` and `.txt` on the tree (Markdown drops in already), spelling dictionaries that ship with the app, the signed installer, and the "Your words" page on first run. The mockup is in `design/`.
- **The Web, read by the guide:** the Web is built in its no-guide form (above). The guide's part waits for the guide: threads it finds in the text, its proposals, reading on save, and "What the guide read".
- **From before:** chapter guides, mobile apps.

## Licence

Parchemin is free software under the GNU Affero General Public License, version 3 or any later version. See [LICENSE](LICENSE).
If you run a changed copy of it for other people over a network, the licence asks you to offer them its source too. That is
the point: whoever hosts Parchemin, writers can always get the code and keep writing.

Copyright © 2026 William Osuji.

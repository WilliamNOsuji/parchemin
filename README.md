# Parchemin

A calm, local-first writing app for stories and the characters in them.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

## What's in the app

The shell follows the desktop mockup under `design/` (integrated on 2026-10-12): the chapter in the middle, everything else at the edges and collapsible to nothing.

- **The shell**: a ribbon of views (Library, Search, Outline, Cast, Drawer, Safekeeping, theme), the whole library as one tree (folders, stories, chapters with status dots and word counts), tabs in the title bar (a chapter, an outline, a cast, the drawer or safekeeping is a tab; they survive a reload), a right sidebar of icon tabs, and a status bar that says where the words are and when they were last copied. Both sidebars hide. The library tree and the ribbon fold into a drawer on phones
- **Command palette** (`Ctrl+P`): every action by name, with its shortcut taught beside it; the last commands used come first. `Ctrl+Shift+F` focus, `Ctrl+Shift+S` snapshot, `Ctrl+D` the Dialogue panel
- **Rich text editor** (Tiptap): bold/italic/underline/strike, headings, quotes, lists, scene breaks, smart quotes, autosave. Literata at 18 px on a 620 px measure, first lines indented as in a book
- **Focus mode**: hides the ribbon, both sidebars and the formatting bar, dims everything but the current paragraph to 20%, typewriter scrolling (`Ctrl+Shift+F`, `Esc` to exit)
- **Right sidebar beside the chapter**: the chapter plan (goal, conflict, turn, POV, setting, prop, last line), the Dialogue panel, snapshots, notes (the chapter's summary, a sentence waiting, the story's title, synopsis, folder and tags) and unblock prompts
- **Snapshots**: save a draft before a rewrite, preview it, restore it (current text is snapshotted first)
- **The drawer**: removing a story, chapter or character sets it aside with its snapshots. Put it back or delete it for good from the drawer page, or put it back from the Library's sidebar
- **Folders + tags**: nested folders, drag stories onto folders, a Tags tab and a Search tab (stories and chapters) in the library sidebar
- **Structure templates**: blank, short story, three-act, Hero's Journey, Save the Cat
- **Outline**: rows, not cards: drag handle, number, title and summary, status, the three plan marks (goal, conflict, turn), words. The finish line with its progress, date and daily figure, and "Pause the finish line". The audit ("Read the whole outline") sits in the right sidebar beside the rows, with the pace compared honestly to the last seven days
- **Cast**: one card per person (name, role, voice with its family and tactic, what they want in a room, their function, the hero check), a line under the grid that reads the voices across the cast and names the pairs with friction built in. The selected character is edited in the right sidebar: voice, hero check (unticked questions first), and biography with the profile (image, name, role, custom fields) above it
- **Unblock prompts**: writing nudges by category. Suggestions only, nothing is written for you
- **Dialogue panel**: per chapter, who wants what (each speaker's want, what they won't say and what they can't, with the voice card as a hint), a script draft outside the manuscript whose `NAME (tactic): line` labels read back as beats, a cover-the-names test on the script or the chapter, and the dialogue pass: the writer's own checklist with plain facts from the text (feelings said out loud, questions answered with questions, tags other than "said", the last paragraph). Nothing is suggested or scored. The sidebar widens for it
- **Export**: Markdown and EPUB, from the Safekeeping page or the palette
- **Library page**: a line on why we write, the stories you were in (one click reopens the chapter), today's words as seven bars (days you wrote are shown, days you didn't are just quiet, no streak is counted), a sentence waiting (the last paragraph you wrote, with the note you left about what happens next), and a nudge
- **Safekeeping**: its own page. Save everything as one JSON file, check that a backup file is whole, restore it (merging by id, nothing is deleted). A backup counts once Parchemin knows the file exists: written through the browser's save dialog where there is one, otherwise read back with "Check a backup file" after the download. The page and the status bar show when the last backup file was made and what changed since (every write to a table that goes into a backup is noted, in `src/changes.ts`; the page's sidebar lists the records), say plainly whether the browser has promised to keep the data (`navigator.storage.persist()`, asked once the first time the Safekeeping page shows with writing in it, with a button to ask again), and suggest a backup once about 2,000 new words, pastes and rewrites included, are in no saved backup file. Restored text is rebuilt through the editor's schema, so a backup file cannot carry scripts
- **Theme**: follows the system, with a toggle in the ribbon to pin light or dark on this device
- **No AI, and the browser's kept out too**: the page and both editors set `writingsuggestions="false"`, and a note on the Safekeeping page explains how to turn off Apple Intelligence, Chrome's "Help me write" and grammar extensions at the source
- **PWA**: installable and works offline after the first visit (service worker is generated at build time, so it only runs in `npm run build` / `preview`, not `npm run dev`). Fonts ship with the app, so it makes no request to any other server

## The website

`site/` holds the landing page from `design/parchemin-website.html`, as a second Vite root with the same bundled fonts (no request to Google Fonts). `npm run site` serves it, `npm run build:site` builds it into `dist-site/`, and `npm run build:pages` builds the site and the app together into `dist-pages/` the way they are published: the site at the root, the app under `app/`. Netlify publishes that folder after every push to `main` (`netlify.toml`); the one-time setup, what the page says while the source is private, and what to restore when it goes public are in `site/README.md`.

## Architecture

React + TypeScript + Vite. All data lives in the browser's IndexedDB via Dexie (`src/db.ts`), so it works offline
and the writer owns their data. The shell is `src/App.tsx` with `Ribbon`, `LibraryTree`, `TabStrip`, `RightSidebar` and
`StatusBar` under `src/components/`; routes are in `src/route.ts`, open tabs in `src/tabs.ts`, the command list in
`src/commands.ts`, the theme in `src/theme.ts`. Each screen is a pane (`Home`, `StoryView` with `SceneEditor`,
`OutlinePane` and `CastPane`, `SafekeepingPane`, `DrawerPage`) with a matching sidebar (`HomeSidebar`, `StorySidebar`,
`ChangesSidebar`). The desktop (Electron) build will wrap this same code. The story on screen is read once in `src/openStory.ts` for the pane and the sidebar, and every chapter is mirrored without its text into the `chapters` table (`src/chapterMirror.ts`) so the tree, the tabs and the home screen never read the manuscripts. Word counts come from the browser's word segmenter (`src/words.ts`), so French
punctuation and Chinese or Japanese text count correctly. A story is made of chapters (`Scene`); a story always has at least one, so
single-document writers never need to think about structure.

## Philosophy

The mission, beliefs and decision tests live in [PHILOSOPHY.md](PHILOSOPHY.md). Read it before adding features.
The rules for the optional AI guide are in [AI-POLICY.md](AI-POLICY.md) (draft).

## Not built yet

The agreed roadmap is at the end of [PHILOSOPHY.md](PHILOSOPHY.md). In short:
- **Import and export:** import .docx, .md and .txt; export a manuscript .docx, "Copy for AO3" and poem-safe formats.
- **Trust:** a plain "Your words" page, a human-voice pass on public text, a long-manuscript performance check, an easier install.
- **Between devices:** a "move my library" flow, then optional sync that writers can host themselves.
- **Writing tools:** read-aloud, a notes pane, a rhythm view, a private challenge mode.
- **AI:** an optional, self-hosted AI guide, off by default.
- **The desktop app:** the Electron wrapper around this code, the library as a folder of plain files, and the canvas (JSON Canvas). The mockup is in `design/`.
- **The Web:** the graph of the writer's core ideas, read by the optional guide. Decided on 2026-10-10 (`research.md`, section 13), not built.
- **From before:** setting sheets, chapter guides, mobile apps.

## Licence

Parchemin is free software under the GNU Affero General Public License, version 3 or any later version. See [LICENSE](LICENSE).
If you run a changed copy of it for other people over a network, the licence asks you to offer them its source too. That is
the point: whoever hosts Parchemin, writers can always get the code and keep writing.

Copyright © 2026 William Osuji.

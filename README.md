# Parchemin

A calm, local-first writing app for stories and the characters in them.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

## What's in the MVP

- **Rich text editor** (Tiptap): bold/italic/underline/strike, headings, quotes, lists, scene breaks, smart quotes, autosave
- **Focus mode**: hides all chrome, dims everything but the current paragraph, typewriter scrolling (`Ctrl+Shift+F`, `Esc` to exit)
- **Snapshots**: save a draft before a rewrite, preview it, restore it (current text is snapshotted first)
- **The drawer**: removing a story, chapter or character sets it aside with its snapshots. Put it back or delete it for good from the home screen
- **Folders + tags**: nested folders, drag stories onto folders, tag filter and search
- **Structure templates**: blank, short story, three-act, Hero's Journey, Save the Cat
- **Outline board**: drag-to-reorder chapters with Idea / Draft / Revised / Done status and progress bar
- **Character profiles**: image, role, customizable fields, rich-text biography
- **Unblock prompts**: writing nudges by category. Suggestions only, nothing is written for you
- **Export**: Markdown and EPUB
- **Why we write**: a rotating line on the home screen, plus a quiet tally of today's words and the last seven days. No guilt, no lost streaks
- **Craft tools**: story spark (who, want, wall), 21 character voices in six families with "cast against" suggestions, flaws and need, a ten-question hero check, a per-chapter plan (goal, conflict, turn, POV, setting, prop), an outline audit that reads across and down, and a finish line (novella in 15 days, novel in 30)
- **Safekeeping**: download everything as one JSON file from the home screen, check that a backup file is whole, and restore it (merging by id, nothing is deleted). The home screen shows when the last backup file was made and which chapters changed since, says plainly whether the browser has promised to keep the data (`navigator.storage.persist()`, asked once after the first save, with a button to ask again), and suggests a backup once about 2,000 new words have piled up. Restored text is rebuilt through the editor's schema, so a backup file cannot carry scripts
- **No AI, and the browser's kept out too**: the page and both editors set `writingsuggestions="false"`, and a note on the home screen explains how to turn off Apple Intelligence, Chrome's "Help me write" and grammar extensions at the source
- **PWA**: installable and works offline after the first visit (service worker is generated at build time, so it only runs in `npm run build` / `preview`, not `npm run dev`). Fonts ship with the app, so it makes no request to any other server

## Architecture

React + TypeScript + Vite. All data lives in the browser's IndexedDB via Dexie (`src/db.ts`), so it works offline
and the writer owns their data. Word counts come from the browser's word segmenter (`src/words.ts`), so French
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
- **From before:** setting sheets, a cast grid view, a voice-blind dialogue test, chapter guides, mobile apps.

## Licence

Parchemin is free software under the GNU Affero General Public License, version 3 or any later version. See [LICENSE](LICENSE).
If you run a changed copy of it for other people over a network, the licence asks you to offer them its source too. That is
the point: whoever hosts Parchemin, writers can always get the code and keep writing.

Copyright © 2026 William Osuji.

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
- **Folders + tags**: nested folders, drag stories onto folders, tag filter and search
- **Structure templates**: blank, short story, three-act, Hero's Journey, Save the Cat
- **Outline board**: drag-to-reorder chapters with Idea / Draft / Revised / Done status and progress bar
- **Character profiles**: image, role, customizable fields, rich-text biography
- **Unblock prompts**: writing nudges by category. Suggestions only, nothing is written for you
- **Export**: Markdown and EPUB
- **Why we write**: a rotating line on the home screen, plus a quiet tally of today's words and the last seven days. No guilt, no lost streaks
- **Craft tools**: story spark (who, want, wall), 21 character voices in six families with "cast against" suggestions, flaws and need, a ten-question hero check, a per-chapter plan (goal, conflict, turn, POV, setting, prop), an outline audit that reads across and down, and a finish line (novella in 15 days, novel in 30)
- **Backup / restore**: download everything as one JSON file from the home screen; restoring merges it back by id (nothing is deleted)
- **PWA**: installable and works offline after the first visit (service worker is generated at build time, so it only runs in `npm run build` / `preview`, not `npm run dev`)

## Architecture

React + TypeScript + Vite. All data lives in the browser's IndexedDB via Dexie (`src/db.ts`), so it works offline
and the writer owns their data. A story is made of chapters (`Scene`); a story always has at least one, so
single-document writers never need to think about structure.

## Philosophy

The mission, beliefs and decision tests live in [PHILOSOPHY.md](PHILOSOPHY.md). Read it before adding features.

## Not built yet

Setting sheets (obstacle-first, with a prop list), a cast grid view, a voice-blind dialogue test, chapter guides, optional cloud sync, an opt-in AI helper, mobile apps.

# Wave 2: put the Canvas and the Web on screen

Give this whole file to the model that continues the work, after wave 1 is merged. It assumes the model can read and
write files in `/home/williamosuji/Writing/parchemin`, run shell commands, and run a headless browser.

---

You are a senior front-end engineer finishing two screens of Parchemin, a calm, local-first writing app for novelists
(React 19, TypeScript strict, Vite 8, Dexie 4 over IndexedDB, Tiptap 3, no test framework). Wave 1 built the pieces:
a pan-and-zoom board surface, arrows, cards and toolbars, setting sheets, core-idea and symbol editors, the Web's data
model and its graph. In this wave you compose them into the **Canvas** screen and the **Web** screen with their right
sidebars, bring the documents and the example library up to date, and check the whole thing as a writer would use it.
When you are done, a writer can open a story's boards and its Web and see what the mockup draws.

The person at the other end is a writer alone with a book that matters to them. Every string you write is read by
them.

## Read first

1. `PROMPT.md`: how this project is built and written.
2. `prompts/canvas-and-web/PLAN.md`: the approved plan. You need the design spec (the mockup's markup and CSS,
   quoted), the contract, the wave-1 units (to know the props of what you compose), "Wave 2" (units 8, 9, 10: your
   specification), and the e2e recipe.
3. `DESIGN.md`, `PHILOSOPHY.md` ("How to decide", "What Parchemin will not do") and `AI-POLICY.md`.
4. The wave-1 code on `main`: `src/canvas/` (surface, edges, cards, toolbar, addFromStory, useBoard, boardStore,
   selection, jsonCanvas, types), `src/web/` (cooccur, model, useWebModel, layout, Graph, types, item),
   `src/components/SettingSheet.tsx`, `SettingsList.tsx`, `CoreIdeaEditor.tsx`, `SymbolsPanel.tsx`.
5. `design/parchemin-desktop.html`: open the Canvas and Web screens in a browser and keep them beside your work.
   Where anything differs on looks or copy, the mockup wins.

## Precondition

Check before you start:

```bash
git log --oneline --merges -10   # the seven wave-1 merges are there
git worktree list                # only main
npm run build                    # passes
```

If any wave-1 unit is missing, stop and finish it with `WAVE-1.md` first. The placeholder panes
`src/components/CanvasPane.tsx`, `CanvasSidebar.tsx`, `WebPane.tsx` and `WebSidebar.tsx` exist from the scaffold with
the props this wave keeps; you replace their bodies.

## The three units

Their full specifications are under "Wave 2" in the plan. In short:

| Unit | Files it owns | What the writer gets |
|---|---|---|
| 8 Canvas pane and sidebar | `src/components/CanvasPane.tsx`, `CanvasSidebar.tsx`, `src/canvas/canvasFiles.ts` | The boards of a story: cards from the story that stay live, notes, groups, named arrows, pan and zoom, a board list, the picked card in the sidebar, "Save as a .canvas file…" and "Open a .canvas file…" |
| 9 Web pane and sidebar | `src/components/WebPane.tsx`, `WebSidebar.tsx` | The Web: core ideas and the story's parts as a graph, threads the writer made, grey lines where names appear together, the legend's switches, the picked thing in the sidebar with its plain evidence, the core-idea editor, symbols, setting sheets |
| 10 Docs and the example library | `README.md`, `PHILOSOPHY.md`, `DESIGN.md`, `design/README.md`, `PROMPT.md`, `design/example-library.json` | Documents that describe the app as it now is, and an example novel whose restore shows both screens the way the mockup draws them |

**Order.** Units 8 and 9 own disjoint files and can run in parallel. Unit 10's example library can start at once; its
documents are written last, because `DESIGN.md` records what shipped, not what was planned. If you work alone: 8, then
9, then 10.

Two composition rules that are easy to get wrong:

- **The board's document has one owner.** The pane and the sidebar edit a board only through `boardStore`
  (`setBoardDoc`, `patchNode`, `patchEdge`). Only a board's `name` is written with `db.boards.update`. Anything else
  races the 500 ms save.
- **The Web's selection lives in the route.** Picking a node calls `replaceRoute` with `webItem(kind, id)`; the
  sidebar reads `itemId`. The canvas's selection lives in `src/canvas/selection.ts`, which the pane clears when it
  unmounts.

## Steps for each unit

1. **Build it** to its paragraph in the plan and to the mockup's screen. Done when `npm run build` passes with no type
   error and no new warning.
2. **Check it in the app**, not a harness: restore a fixture through the Safekeeping page (the plan's recipe shows
   how), open the screen by its hash, drive it with Playwright, screenshot it at 1280 × 800 light and dark beside the
   mockup's same screen, and at 400 px. Done when the script exits 0 with no page error and the screenshots match.
3. **Review** the diff for correctness bugs and fix them. Run a code-review tool or skill if you have one.
4. **Commit** on `main` (or on a branch merged into `main`), one plain imperative sentence naming what changed for the
   writer.

## The final check, as a writer would use it

After all three units are in, restore `design/example-library.json` into an empty library and walk these paths in the
real app, through Playwright, at 1280 × 800 in light and dark and at 400 px. Each must work and leave no page error:

**The Canvas**

1. Open the boards from the ribbon. "Who knows what" opens; its tab shows the board's name; the library sidebar is
   folded and the menu button brings it back.
2. Add a chapter, a character and a setting with "Add from the story ⌄"; each shows its live data. Edit the chapter
   card's summary, open the outline, and see the same summary there.
3. Drag a card, resize it, drag the group and see its cards move with it. Pan, zoom with Ctrl + wheel, Fit.
4. Draw an arrow from a card's side handle to another card, name it, pick it, delete it with the keyboard.
5. Do steps 3 and 4 with the keyboard alone: Tab to a card, Enter, arrow keys, Delete.
6. "Save as a .canvas file…", then "Open a .canvas file…" with that file: a new board with the same cards and arrows.
   Open a small canvas file written by hand in Obsidian's format, with a node type Parchemin does not show live: it
   opens and saves back with its unknown attributes kept.
7. Move a board to the drawer; its tab closes; put it back from the drawer; it returns whole.

**The Web**

8. Open the Web. The core ideas, characters, settings, symbols, chapters and the board appear; the lock chip says "For
   you only · never exported"; one line says the guide is off.
9. Pick a core idea: its neighbours light up and the rest dims; the sidebar shows the editor. Add a chapter to
   "Carried by"; a thread appears. A written chapter that no idea names has the dashed ring and "no thread".
10. Pick a character: the sidebar shows the plain evidence ("Appears in ch. 1, 7 as Mara, Mara Quill") and the core
    ideas that name them. "The Board" is never matched on the word "The".
11. Toggle each switch in the legend; Tab through nodes and pick one with Enter.
12. Double-click a chapter node: the chapter opens.

**Safety and privacy**

13. Save a backup file, empty the library, restore the file: boards, pictures, core ideas, settings and symbols all
    come back, and the Safekeeping page lists them among the changes before the backup.
14. Export the story as Markdown and as EPUB: neither contains a core idea, a symbol, a setting sheet or a board.
15. Restore a backup file made before this work (the scaffold's own check used one): it restores with no error.

Done when all fifteen pass, or each failure is fixed or written down with its reason.

Then delete `scratch/` output you no longer need and remove any worktree you made.

## Rules that hold throughout

- **The design is the mockup.** Tokens only. The plan names the mockup copy to keep and the copy to leave out because
  it belongs to the AI guide (the "Reading" panel, "Read now", "What the guide read", proposals). Leave those out; do
  not fake them.
- **Honesty.** Nothing is scored. A thread is a link the writer made; a grey line means only that two names appear
  together in the text. Counts are plain facts.
- **The writer owns the work.** Boards and the Web go into backups and never into an export of the story. A board, a
  core idea and a setting go to the drawer, never straight to deletion.
- **Every hand and width.** Keyboard, 400 px, the app's focus ring, `prefers-reduced-motion`, `role="status"` on what
  changes by itself, 4.5:1 on text.
- **No new dependency. Do not push and do not open pull requests.** A push to `main` deploys the website; William
  pushes when he decides.
- **Leave open questions open:** the unit of evidence for the AI guide, the canvas's role in the guide's reading,
  critique-partner packets, the `AI-POLICY.md` paragraph on proposals (it waits until proposals exist).

## Machine notes

- Playwright 1.49.1 matching the cached Chromium is at `/home/williamosuji/.npm/_npx/f0a362733743bae2/node_modules/`;
  load it with `createRequire`, as the plan's recipe shows. Chromium needs `LD_LIBRARY_PATH` set to
  `/home/williamosuji/.local/lib/electron-wsl`.
- Node's own HTTPS rejects this machine's certificate chain; a script that downloads needs
  `NODE_EXTRA_CA_CERTS=/etc/ssl/certs/ca-certificates.crt`.
- The desktop app (`npm run desktop`) wraps the same code. Checking it is optional here; the browser check is the
  requirement.

## Report when you stop

Write, in plain sentences:

1. What a writer can now do on each screen, in a few lines.
2. The commits, in order.
3. The fifteen final checks: passed, fixed, or failed with the reason.
4. What the screenshots showed beside the mockup, and any difference you chose to keep, with why (and whether
   `DESIGN.md` records it).
5. What you left out, the questions only the team can answer, and what was not verified.

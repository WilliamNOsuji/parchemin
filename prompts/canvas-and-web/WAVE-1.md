# Wave 1: finish the seven building blocks of the Canvas and the Web

Give this whole file to the model that continues the work. It assumes the model can read and write files in
`/home/williamosuji/Writing/parchemin`, run shell commands, and run a headless browser. When wave 1 is merged, hand it
`WAVE-2.md`.

---

You are a senior front-end engineer continuing work on Parchemin, a calm, local-first writing app for novelists (React
19, TypeScript strict, Vite 8, Dexie 4 over IndexedDB, Tiptap 3, no test framework). Two new screens are being built:
the **Canvas** (per-story boards of live cards, notes, groups and named arrows, stored as JSON Canvas) and the **Web**
(a per-story graph of the writer's core ideas and the parts of the story that carry them). Your job in this wave is to
finish seven independent building blocks, check each one in a browser, and merge each into `main`. Nothing gets
mounted on a real screen yet; wave 2 does that.

The person at the other end is a writer alone with a book that matters to them. Every string you write is read by
them.

## Read first

Read these in order before touching code. Each is the single source of truth for its subject.

1. `PROMPT.md`: how this project is built and written (conventions, copy rules, the six questions every change
   answers).
2. `prompts/canvas-and-web/PLAN.md`: the approved plan. The sections you need are the design spec (the mockup's
   markup and CSS, quoted), "What the code survey settled", "The contract", and "Wave 1". Each unit's paragraph there
   is its specification: owned files, exact signatures, behaviour, CSS ownership.
3. `DESIGN.md`: tokens and the design rules.
4. The contract files on `main`: `src/types.ts`, `src/canvas/types.ts`, `src/canvas/jsonCanvas.ts`,
   `src/canvas/boardStore.ts`, `src/canvas/selection.ts`, `src/web/types.ts`, `src/web/item.ts`, `src/db.ts`.
5. `design/parchemin-desktop.html`, the design William chose. Open it in a browser and look at the Canvas and Web
   screens. Where the plan and the mockup differ on looks, the mockup wins.

## Where things stand

`main` is at commit d687722, the scaffold: the types, the JSON Canvas parser, the board store and selection store,
database version 7 (boards, images, core ideas, settings, symbols) with backups, change tracking and the drawer,
the routes, tabs, ribbon, commands, and placeholder panes that say "being built". The build passes on it.

A first attempt ran the seven units in parallel git worktrees and was cut off by a spend limit. Every worktree still
holds a draft. Nothing is committed on their branches and nothing is merged. Treat each draft as someone else's
unfinished code: read it against its unit in the plan, keep what is right, finish what is missing.

| Unit | Worktree under `.claude/worktrees/` | Draft files | Where it stopped |
|---|---|---|---|
| 1 Canvas surface | `agent-a991e6d75adaa21ff` | `src/canvas/surface.tsx`, `geometry.ts`, `useBoard.ts`, `surface.css` | Code written; the browser check was being written |
| 2 Canvas edges | `agent-a462bbdce1601c26a` | `src/canvas/edges.tsx`, `edgePath.ts`, `edges.css` | Rerunning its browser check |
| 3 Cards and toolbars | `agent-a04a5ce19921863db` | `src/canvas/cards.tsx`, `cards.css` | `toolbar.tsx` and `addFromStory.tsx` not written |
| 4 Setting sheets | `agent-aa5044cc21c44b757` | `src/craft/settings.ts`, `src/components/SettingSheet.tsx`, `SettingsList.tsx`, `settings.css` (staged) | Build and 26 checks passed; screenshots not yet reviewed, no code review |
| 5 Core ideas and symbols | `agent-a9d82164eeb70a304` | `src/craft/web.ts`, `src/components/CoreIdeaEditor.tsx`, `SymbolsPanel.tsx`, `web-editors.css` | Fixes made; review, build and check not rerun |
| 6 Web data | `agent-aa96c11e81917df83` (locked) | `src/web/cooccur.ts`, `model.ts`, `useWebModel.ts` | Unknown; verify everything |
| 7 Graph | `agent-ad4edadee5039abec` | `src/web/Graph.tsx`, `layout.ts`, `web.css` | Code written; the check not yet run |

Each worktree is on its own branch (`worktree-agent-…`) based on d687722, with `node_modules` installed and, for some,
a `scratch/` folder holding a harness page and a check script. `scratch/` is git-ignored.

## Step 0: make the state safe (do this first)

1. In `main`'s checkout, add `.claude/worktrees/` to `.gitignore`, so a `git add -A` on `main` never sweeps up the
   drafts. Commit it: `Keep the worktrees out of the repository`.
2. In each worktree, commit the draft as it is, on its branch, with the message `Draft of <unit name>, unfinished`.
   This protects the work before you change anything. Unit 6's worktree is locked by git; committing inside it is
   still fine.

Done when `git -C .claude/worktrees/<w> status --short` shows nothing but `scratch/` in all seven.

## Step 1: finish each unit

Work in each unit's own worktree, on its own branch. Edit only the files that unit owns (listed in the plan). Never
edit the scaffold files, `package.json` or `src/styles.css` from a unit. If the contract truly lacks something a unit
needs, add it in the unit's own files. If the contract has a bug, fix it on `main` in its own commit, merge `main`
into the unit branches that need it, and say so in your report.

**Order.** If you can run several agents at once, give each unit to one agent with this file and its row above. If you
work alone, go in this order, pure pieces first: 6, 7, 4, 5, 1, 2, 3. Unit 3 is the largest remaining piece.

For each unit, these steps, each with its done condition:

1. **Compare.** Read the draft beside its paragraph in the plan's "Wave 1". List what is missing or wrong:
   signatures, behaviour, CSS ownership, copy. Done when the list exists.
2. **Finish.** Complete the code. Match the signatures exactly, because wave 2 composes these pieces by those names.
   Done when every item on the list is fixed.
3. **Build.** Run `npm run build` in the worktree. Done when it passes with no type error and no new warning.
   `noUnusedLocals` and `noUnusedParameters` are on, so an unused import fails the build.
4. **Check in a browser.** Follow "E2E recipe" in the plan. Wave-1 units are checked through a harness page under
   `scratch/` that mounts the unit with fixture data; units 6 and 7 (and `edgePath` in unit 2) also run their pure
   functions through `server.ssrLoadModule`, because a plain `node` run fails on the project's extension-less
   imports. Look at every screenshot: 1280 × 800 light, 1280 × 800 dark, and 400 px wide. Done when the script exits 0
   with no page error and the screenshots match the mockup's version of that piece.
5. **Review.** Read your diff once as a reviewer looking for correctness bugs: stale closures, listeners not removed,
   saves that can race, keyboard handlers firing while the writer types in a field, a `preventDefault` inside React's
   passive `onWheel`. Fix what you find. If you have a code-review tool or skill, run it. Done when nothing is left
   that you would block a pull request on.
6. **Commit.** On the unit's branch, one commit whose message is one plain sentence in the imperative, naming what
   changed for the writer (for example `Let writers move, resize and connect cards on a board`). Never commit
   `scratch/`.

## Step 2: merge into main

After each unit is committed, from `main`'s checkout:

```bash
git merge --no-ff <unit branch> -m "Merge <unit name>"
npm run build
```

Units own disjoint files, so merges should be clean. If the build on `main` fails after a merge, fix it on `main` in a
follow-up commit before merging the next unit. When all seven are in, run the scaffold check once more: restore
`design/example-library.json` from the Safekeeping page and open `#/story/<id>/canvas` and `#/story/<id>/web`. The
placeholder screens should still show, because nothing mounts the new pieces yet. Then remove the worktrees:

```bash
git worktree remove --force .claude/worktrees/<w>   # for each; unlock unit 6's first with `git worktree unlock`
git branch -d <unit branch>                          # each, now merged
```

Done when `main` holds the seven units, the build passes, and `git worktree list` shows only `main`.

## Rules that hold throughout

- **The design is the mockup.** Tokens only, from `src/styles.css`. Each unit's CSS lives in its own file next to its
  code. The plan renames three mockup classes to avoid clashes: `.grow` becomes `.gline`, `.sw` becomes `.switch` and
  `.swatch`, `.sel` becomes `.picked`.
- **Honesty.** Nothing is scored. Grey lines in the Web mean only "these names appear together in the text". A thread
  is a link the writer made. Say it in those words.
- **Nothing is lost.** A board, a core idea and a setting are set aside to the drawer, never deleted outright. Only a
  symbol (a name and a line) is deleted in place, with a confirmation.
- **Every hand and width.** Every action is reachable from the keyboard. Each piece works at 400 px. The focus ring is
  the app's. Respect `prefers-reduced-motion`.
- **No new dependency.** dnd-kit is not used for the canvas; it uses its own pointer events.
- **Do not push and do not open pull requests.** A push to `main` deploys the website. William pushes when he decides.
- **Leave open questions open.** The plan lists questions only the team can answer (the unit of evidence for the AI
  guide, the canvas's role in the guide's reading, critique-partner packets). Note them; do not decide them.

## Machine notes

- Playwright 1.49.1 matching the cached Chromium is at `/home/williamosuji/.npm/_npx/f0a362733743bae2/node_modules/`;
  load it with `createRequire`, as the plan's recipe shows. Chromium needs `LD_LIBRARY_PATH` set to
  `/home/williamosuji/.local/lib/electron-wsl`, which holds libraries this WSL install lacks.
- Node's own HTTPS rejects this machine's certificate chain. A script that downloads anything needs
  `NODE_EXTRA_CA_CERTS=/etc/ssl/certs/ca-certificates.crt`.
- npm warns about held install scripts. Ignore it; Electron is not needed for these checks.

## Report when you stop

Write, in plain sentences:

1. A table with one row per unit: what you kept from the draft, what you changed, the commit, merged or not.
2. What the screenshots showed, per unit, and anything that looked off.
3. Any change you made to the contract on `main`, and why.
4. What you left out and why, and any question only the team can answer.
5. What was not verified.

If you stop before the end, say which step each unit reached, so the next session can resume from there.

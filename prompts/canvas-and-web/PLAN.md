<!--
The approved plan for the Canvas and the Web, copied from the planning session of 2026-10-14. It is the reference the
wave prompts (WAVE-1.md, WAVE-2.md) point to: the design spec quoted from the mockup, the contract the scaffold built,
and every unit. Status on 2026-10-15: the scaffold is done (commit d687722 on main); wave 1 is drafted but unfinished;
wave 2 has not started. The "Coordinator steps" at the end describe the original run; the wave prompts supersede them.
-->

# The Canvas and the Web: implementation plan (batch)

## Context

Parchemin's desktop mockup (`design/parchemin-desktop.html`, the design the team chose) draws two screens the app does
not have: the **Canvas**, an Obsidian-style board per story with live cards (chapters, characters, settings), notes,
groups and arrows the writer names, saved as JSON Canvas; and the **Web**, an Obsidian-style graph per story whose
nodes are the writer's core-idea documents and the story's parts, with threads as evidence. Both were decided on
2026-10-10 (`research.md` section 13) and are items 3 and 4 of the roadmap in `PROMPT.md`. The AI guide that would read
the text for the Web is not built, so the Web is built in its no-guide form.

Decisions taken with William on 2026-10-14, before this plan:

- **Web scope:** declared plus co-occurrence. Core ideas are documents the writer links by hand to chapters,
  characters, settings, symbols and boards. Grey lines are drawn where names appear together in the text, computed
  locally. The guide's threads, proposals and read-on-save wait, with one plain line saying the guide is off.
- **Entities:** settings (the roadmap's obstacle-first sheets: name, what makes it hard, props, mood last) and symbols
  (named things with a line each) are added, usable as canvas cards and Web nodes, in backups and the drawer.
- **Storage:** boards are JSON Canvas documents stored in the library's database (IndexedDB), in backups, with "Save
  as .canvas" and "Open a .canvas" through the save dialog. The library folder, when built, writes the same documents
  as files.
- **Landing:** local branches, merged here. The pending desktop work and a scaffold are committed on local `main`;
  worktrees branch from local HEAD (`worktree.baseRef = head` in the git-ignored `.claude/settings.local.json`);
  workers commit on their branches without pushing; the coordinator merges each branch into `main` after its report.
  Nothing is pushed until William says. `gh` is logged out, so there are no pull requests.

## Research: what the documents settle, and the format

- **Without the guide the Web draws what is declared** (`research.md` §13.2): core idea documents, canvas arrows, chapter
  plans and the cast. The mockup adds grey co-occurrence lines "from the text, no guide needed". Deviation shows as thin
  or missing threads, never a score. The Web and the core ideas stay out of every export. Proposals, read-on-save and
  "What the guide read" are the guide's and wait for it; the mockup's "Reading" panel becomes one plain line.
- **Settings** are the roadmap's obstacle-first sheets (`PHILOSOPHY.md` craft item 6; research note 04 I4: "what makes
  it hard", "what it reveals", "objects someone can pick up, fight over or hide behind"; link from the chapter plan's
  `setting` and `prop` fields). **Symbols** have no definition anywhere except the mockup (the storm glass, the lamp,
  the ledger, the boat, Nan's letters): a name and a line, declared by the writer.
- **Canvas** (`research.md` §13.1 and the mockup's notes): live cards for chapters, characters and settings; notes,
  groups and images that exist only on the board; arrows the writer names ("won't ask", "saw it", "keeps"); a group is
  a dashed region with a name, and a card dragged into it moves with it; nothing on a board touches the manuscript;
  deleting a card leaves the chapter or character where it was; the library sidebar collapses on this screen; the
  toolbar at the bottom adds cards; zoom sits bottom right.
- **JSON Canvas 1.0** (spec read in full): `{ nodes?, edges? }`; nodes in ascending z-order with `id, type
  (text|file|link|group), x, y, width, height, color?`; text has `text` (Markdown); file has `file, subpath?`; link
  has `url`; group has `label?, background?, backgroundStyle? (cover|ratio|repeat)`. Edges: `id, fromNode, fromSide?,
  fromEnd? (none|arrow, default none), toNode, toSide?, toEnd? (none|arrow, default arrow), color?, label?`. Colour is
  hex or a preset `"1".."6"` (red, orange, yellow, green, cyan, purple; values left to the app). Files use `.canvas`.
  The spec says nothing about extra attributes and has no group membership field (membership is geometric).
  **Mapping for Parchemin:** a live card is a `file` node whose `file` is a Parchemin path (`chapters/<id>.md`,
  `characters/<id>.md`, `settings/<id>.md`), which is also what the library folder will name them; everything else is
  `text`, `group` or `file` (an embedded image as a data URL in `file`, kept out of Obsidian's way). Unknown attributes
  are preserved on open so an Obsidian-made file survives a round trip.
- **Open questions that stay open** (not decided by this plan): the unit of evidence for the guide; the canvas's role in
  the guide's reading; critique-partner packets; the `AI-POLICY.md` paragraph on proposals (added as a sentence only
  when proposals exist). Core ideas go into backups (the writer's own data).

## Design spec, from `design/parchemin-desktop.html` (the design wins)

Line numbers refer to that file. Canvas markup 605–665, canvas CSS 269–308, Web markup 667–696, Web CSS 310–345,
right sidebars 865–923, design notes 1024–1047, the Web's JS 1116–1159. Tokens are the app's own (`src/styles.css`);
the mockup's `--surface`/`--surface-2`/`--text` are the app's `--surface`/`--surface-2`/`--text` too. Both screens
hide the library sidebar by default ("boards want width"; the menu button brings it back).

### Canvas

Structure: `.pane-head` with crumbs **Story › Boards › Board name** and two quiet small buttons "Add from the story ⌄"
and "Zoom to fit"; then `.canvas` (the viewport: dot grid `radial-gradient(var(--border) 1px, transparent 1px)` at
`20px 20px`) containing `.board` (the world, transformed by pan and zoom) which holds one `svg.edges` under the cards
and the absolutely positioned cards `.cc`; outside the world, `.cv-tools` (bottom centre: Note, Chapter, Character,
Setting, Group, Image, each an icon and a word) and `.cv-zoom` (bottom right: − 85% + | Fit).

Card kinds and their markup:
- Character `.cc.char`: `.cc-head` with `.av` initial (28 px), `<b>Name</b>` and `<small>Role · Voice</small>`, then
  `<p>` with what they want in a room. Live from the cast.
- Setting `.cc.setting`: head with the place icon (16 px, `--place`), name and `<small>setting</small>`; body
  `<p><span>Hard because:</span> …</p><p><span>Props:</span> …</p>`. Live from the setting sheet.
- Chapter `.cc.chapter.<status>`: head with the status dot, `<b>N · Title</b>`, `<small>Status · N words</small>`;
  body is the summary, editable, and editing it edits the outline. Live from the chapter.
- Note `.cc` (plain): `<p>` text; a leading `<span>` is a muted label ("Last line, already known:"). Exists only here.
- Question `.cc.question`: a note in the `--draft` wash ("Decide before chapter 8: …").
- Image `.cc.image`: the picture at 100 px tall, then `<small>caption · filename</small>`. Exists only here.
- Group `.cc.group`: a dashed region with `.g-label` on its top border; a sibling of its members, painted under them;
  membership is geometric (a card inside its bounds moves with it).
- Selected card: `.picked` (2 px accent outline, offset 2) with four `.hd` corner handles, and a floating `.cc-bar`
  above it: colour swatch, "Open profile" (or "Open the chapter" / "Open the setting"), "Colour", "⋯".

Edges: one `<svg class="edges">` in world coordinates under the cards; each edge a `<path>` (cubic bezier between
sides, straight when aligned) with `marker-end` arrowhead (`M0 0 L10 5 L0 10 z`, 7×7, refX 9, refY 5,
`orient="auto-start-reverse"`), stroke `--muted` 1.5; a `<text>` label near the midpoint with a halo
(`paint-order: stroke; stroke: var(--bg); stroke-width: 4px`). Anchors are side midpoints (JSON Canvas `fromSide` /
`toSide`).

Canvas CSS, verbatim (rename `.sw` to avoid the toggle switch; scope `marker-end` to `.edges > path`):

```css
.canvas { flex: 1; position: relative; overflow: hidden; background: var(--bg); background-image: radial-gradient(var(--border) 1px, transparent 1px); background-size: 20px 20px; }
.board { position: absolute; left: 0; top: 0; transform-origin: 0 0; }
.edges { position: absolute; left: 0; top: 0; overflow: visible; }
.edges > path { fill: none; stroke: var(--muted); stroke-width: 1.5; marker-end: url(#arr); }
.edges marker path { fill: var(--muted); stroke: none; }
.edges text { font-family: var(--ui); font-size: 11px; font-weight: 500; fill: var(--text); paint-order: stroke; stroke: var(--bg); stroke-width: 4px; stroke-linejoin: round; }
.cc { position: absolute; background: var(--surface); border: 1.5px solid var(--border); border-radius: 8px; padding: 10px 12px; font-size: 12px; line-height: 1.4; color: var(--text); overflow: hidden; box-shadow: 0 1px 2px rgba(0, 0, 0, .05); }
.cc p { margin: 0; } .cc p + p { margin-top: 4px; } .cc p span { color: var(--muted); }
.cc-head { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; min-width: 0; }
.cc-head b { font-weight: 600; display: block; font-size: 12.5px; white-space: nowrap; }
.cc-head small { display: block; color: var(--muted); font-size: 11px; }
.cc .av { width: 28px; height: 28px; font-size: 12px; }
.cc.char { border-color: var(--accent); background: color-mix(in srgb, var(--accent) 5%, var(--surface)); }
.cc.chapter.draft { border-color: var(--draft); } .cc.chapter.idea { border-color: var(--idea); }
.cc.chapter.revised { border-color: var(--revised); } .cc.chapter.done { border-color: var(--done); }
.cc.setting { border-color: var(--place); background: color-mix(in srgb, var(--place) 5%, var(--surface)); }
.cc.question { border-color: var(--draft); background: color-mix(in srgb, var(--draft) 8%, var(--surface)); }
.cc.group { background: color-mix(in srgb, var(--accent) 6%, transparent); border: 1.5px dashed color-mix(in srgb, var(--accent) 45%, transparent); box-shadow: none; overflow: visible; }
.g-label { position: absolute; left: 10px; top: -10px; background: var(--bg); padding: 0 6px; font-size: 11.5px; font-weight: 600; color: var(--accent); white-space: nowrap; }
.cc.image { padding: 0; } .cc.image img { display: block; width: 100%; height: 100px; object-fit: cover; }
.cc.image small { display: block; padding: 6px 10px; color: var(--muted); font-size: 11px; border-top: 1px solid var(--border); }
.cc.picked { outline: 2px solid var(--accent); outline-offset: 2px; overflow: visible; }
.hd { position: absolute; width: 8px; height: 8px; background: var(--surface); border: 1.5px solid var(--accent); border-radius: 2px; }
.hd.tl { left: -6px; top: -6px; } .hd.tr { right: -6px; top: -6px; } .hd.bl { left: -6px; bottom: -6px; } .hd.br { right: -6px; bottom: -6px; }
.cc-bar { position: absolute; display: flex; gap: 2px; align-items: center; background: var(--surface); border: 1px solid var(--border); border-radius: 7px; padding: 3px; box-shadow: 0 4px 14px rgba(0, 0, 0, .1); font-size: 11.5px; color: var(--muted); }
.cc-bar button { padding: 3px 7px; border-radius: 5px; display: inline-flex; align-items: center; gap: 5px; }
.cc-bar .swatch { width: 12px; height: 12px; border-radius: 50%; background: var(--accent); padding: 0; }
.cv-tools { position: absolute; left: 50%; bottom: 14px; transform: translateX(-50%); display: flex; gap: 2px; background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 4px; box-shadow: 0 8px 24px rgba(0, 0, 0, .12); white-space: nowrap; }
.cv-tools button { display: inline-flex; align-items: center; gap: 6px; padding: 5px 9px; border-radius: 7px; font-size: 11.5px; color: var(--muted); }
.cv-tools button.on { color: var(--text); background: var(--surface-2); }
.cv-tools svg { width: 15px; height: 15px; }
.cv-zoom { position: absolute; right: 14px; bottom: 14px; display: flex; align-items: center; gap: 2px; background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 3px; font-size: 11.5px; color: var(--muted); }
.cv-zoom button, .cv-zoom span { padding: 3px 7px; font-variant-numeric: tabular-nums; }
.cv-zoom .sep { width: 1px; height: 14px; background: var(--border); padding: 0; }
```

Canvas right sidebar (two icon tabs: Boards `canvas` icon, Selected card `plan` icon), sections:
- **Boards** `this story · N`: one `.snap` row per board (name, `N cards`), the open one with an accent border; "＋ New
  board".
- **Selected** `<name> · <kind>`: for a character, the hint "A character card is the live profile. Change it here or
  on the Cast page, and both change.", then the voice and other fields, "Open on the Cast page", "Card colour"; for a
  chapter, status and summary, "Open the chapter"; for a setting, the sheet's fields, "Open the setting"; for a note,
  its text; for a group, its label; for an edge, its label and the arrow ends.
- **On this board**: `.chg` rows "From the story · 3 characters · 2 chapters · 1 setting", "Only here · 5 notes ·
  1 group · 1 sketch", "Saved as · boards/who-knows-what.canvas" (in this build: "Saved in · this library's database",
  with "Save as a .canvas file…"), and the hint "Nothing on a board touches the manuscript. Delete a card here and the
  chapter or character it came from stays where it was."

Icons to add to `Icons.tsx`, from the mockup's symbols (24-box, stroke only):
`canvas`: `<rect x="3" y="3" width="7" height="6" rx="1.2"/><rect x="14" y="3" width="7" height="6" rx="1.2"/><rect x="8.5" y="15" width="7" height="6" rx="1.2"/><path d="M6.5 9v3h11V9M12 12v3"/>`;
`web`: `<circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="8" r="2.5"/><circle cx="12" cy="18" r="2.5"/><path d="M8.4 6.6 15.6 7.7M7.2 8.2l3.7 7.6M16.9 10.2l-3.8 5.7"/>`;
`place`: `<path d="M12 21s-6-5.3-6-10a6 6 0 0 1 12 0c0 4.7-6 10-6 10z"/><circle cx="12" cy="11" r="2"/>`;
`group`: `<rect x="3" y="3" width="18" height="18" rx="2" stroke-dasharray="3 2.5"/>`;
`image`: `<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9" r="1.5"/><path d="m21 16-5-5-8 8"/>`;
`lock`: `<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>`.
Ribbon order: Library, Search, Outline, Cast, **Boards**, **Web**, Drawer, Safekeeping, spacer, Theme. Tab labels: a
board tab shows the board's name with the canvas icon; the Web tab shows "Web" with the web icon.

### Web

Structure: `.pane-head` with crumbs **Story › Web** and a `.chip` with the lock icon "For you only · never exported";
right side, in this build, one `.hint`: "The guide is off. The Web shows what you declared, and where names appear
together in the text." Then `.web` holding `svg.graph` (full size, pan and zoom), the `.gpanel` top right (226 px) with
sections **Show** (a `.grow` per kind with a `.gk` colour key, a count and a switch: Core ideas, Characters, Settings,
Symbols, Chapters, Boards; Proposals only when the guide exists) and **Threads** ("Thickness is how many chapters,
characters and settings carry it" for declared threads; "Grey lines: appear together in the text" with a switch), and
`.cv-zoom` bottom right at 100%. (The mockup's "Reading" section and "Read now" wait for the guide and are left out.)

Nodes `<g class="n <kind> [picked] [near|far] [warn] [orphan]">` with a `<circle>` and a `<text>` label at
`y = cy + r + 13`, `text-anchor="middle"`. Kinds and fills: core `--accent` (r 16–22, label 600/12 px), char
`--revised` (r 10–11), set `--place` (r 9), sym `--draft` (r 9), board `--text` (r 10), ch `--muted` (r 7). Every
circle has a 2 px `--bg` halo. The picked node's stroke is `--text` 2.5; nodes not adjacent to the picked one are
`.far` (opacity .45). A chapter with no thread to any core idea is `.warn`: a second dashed `--draft` ring at r + 5 and
the label "ch. 6 · no thread". A chapter with no text and no edges is `.orphan` (fill `--surface-2`, stroke `--border`,
"ch. 9 · not written"). Edges are straight `<line>`s drawn before the nodes: `.e.t` declared thread (`--accent`,
opacity .4, width `w * 0.9 + 0.6` where w is how many links carry it), `.e.x` co-occurrence (`--muted`, opacity .22,
width 1.5), `.hot` any edge touching the picked node (opacity .95).

Web CSS, verbatim (with `sel` renamed `picked`):

```css
.web { flex: 1; position: relative; overflow: hidden; background: var(--bg); }
svg.graph { position: absolute; inset: 0; width: 100%; height: 100%; }
.graph .e { stroke: var(--muted); opacity: .22; }
.graph .e.t { stroke: var(--accent); opacity: .4; }
.graph .e.hot { stroke: var(--accent); opacity: .95; }
.graph .n circle { fill: var(--muted); stroke: var(--bg); stroke-width: 2; }
.graph .n.core circle { fill: var(--accent); } .graph .n.char circle { fill: var(--revised); }
.graph .n.set circle { fill: var(--place); } .graph .n.sym circle { fill: var(--draft); } .graph .n.board circle { fill: var(--text); }
.graph .n.orphan circle { fill: var(--surface-2); stroke: var(--border); }
.graph .n .ring { fill: none; stroke: var(--draft); stroke-width: 1.5; stroke-dasharray: 3 3; }
.graph .n text { font-family: var(--ui); font-size: 11px; fill: var(--text); paint-order: stroke; stroke: var(--bg); stroke-width: 3px; stroke-linejoin: round; }
.graph .n.core text { font-weight: 600; font-size: 12px; }
.graph .n.far { opacity: .45; }
.graph .n.picked circle { stroke: var(--text); stroke-width: 2.5; }
.gpanel { position: absolute; right: 14px; top: 14px; width: 226px; background: var(--surface); border: 1px solid var(--border); border-radius: 8px; box-shadow: 0 8px 24px rgba(0, 0, 0, .12); font-size: 11.5px; overflow: hidden; }
.gsec { padding: 8px 10px; border-bottom: 1px solid var(--border); } .gsec:last-child { border-bottom: 0; }
.gsec h5 { margin: 0 0 5px; font-size: 10.5px; text-transform: uppercase; letter-spacing: .05em; color: var(--muted); font-weight: 600; }
.gline { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 2.5px 0; }  /* the mockup's .grow, renamed: styles.css already has .grow */
.gline > span:first-child { display: inline-flex; align-items: center; gap: 6px; }
.gk { width: 9px; height: 9px; border-radius: 50%; display: inline-block; flex: none; }
.switch { width: 26px; height: 14px; border-radius: 7px; background: var(--border); position: relative; flex: none; border: 0; padding: 0; }
.switch::after { content: ''; position: absolute; top: 2px; left: 2px; width: 10px; height: 10px; border-radius: 50%; background: var(--surface); box-shadow: 0 1px 2px rgba(0, 0, 0, .25); }
.switch.on { background: var(--accent); } .switch.on::after { left: 14px; }
.core-doc { font-family: var(--serif); font-size: 13px; line-height: 1.5; }
```

Web right sidebar (icon tabs: Core idea `notes` icon; the guide's tabs wait), sections:
- **<Core idea title>** `core idea`: the document in a serif `.core-doc` box (editable, Tiptap as the biography),
  **Carried by** as the writer's own links (chips for chapters, characters, settings, symbols, boards, each removable,
  with "Add…"), and "Open the document".
- When a character, setting, symbol, chapter or board is picked: its name and kind, the core ideas it carries, and
  "Open on the Cast page" / "Open the chapter" / "Open the setting" / "Open the board".
- **Symbols** `N`: the list with "＋ New symbol"; a symbol is a name and a line.
- The mockup's copy that stays: "Plain readings of your text against your own words. Nothing is scored, and nothing
  here changes a line of the book." (under the co-occurrence note) and the lock chip's "For you only · never exported".

## What the code survey settled (traps the contract is built around)

- A tab value that is not `write` or `outline` falls through to the Cast page in four places: `route.ts:15` (parse),
  `App.tsx:216` (window title), `TabStrip.tsx:54` (label), `StorySidebar.tsx:42` (sidebar). The scaffold changes all four.
- `backup.ts` requires every entry of `TABLES` to be present (`parse()`, lines 143–152), so new tables are **optional**
  in the file, the way `days` and `drawer` are, and `restoreBackup` line 218 must include them in the restored keys.
- Right-sidebar tab ids are looked up across screens by `openRight`; new ids must be unique (`boards`, `card`, `idea`,
  `symbols`).
- `Section` is exported from `RightSidebar.tsx`, not `Panels.tsx`. `GrowingText` + save-on-blur (`Panels.tsx:192`) is
  the field pattern; `CharacterSidebar.tsx:47-68` is the autosave pattern (local state, latest ref, 500 ms, `update`
  not `put`, flush on unmount); `CastPane` is the select-with-`replaceRoute` pattern; `Modal` and `Menu` exist.
- dnd-kit is used only for the sortable outline (no `DragOverlay`, no `modifiers` package). The canvas uses pointer
  events of its own; no new dependency anywhere.
- `styles.css` already has `.grow` (flex: 1), `.sw` is the mockup's switch and swatch, `.sel` is the outline's: the new
  CSS uses `.cv-*`, `.cc*`, `.graph`, `.switch`, `.picked`. Each unit's CSS lives in its own file next to its code
  (`src/canvas/*.css`, `src/web/*.css`), imported by the component, so no unit edits `styles.css`.
- `useOpenStory` hands the pane full `Scene` rows with `content`, so the Web reads chapter text from props, never from
  the tree or the tabs. `words.ts` exports `htmlToText`, `countTextWords`, `countWords`; `craft/dialogue.ts` exports
  `paragraphsOf` and `sameSpeaker`.
- `cleanImage` (data URLs only) is the rule for any picture on a board. `export.ts` reads only stories and scenes, so
  the Web and the boards stay out of exports with no change.
- `--place` (teal) is defined in both themes and unused so far: settings take it. `--draft/--revised/--done` have no
  dark override (as today). The mockup's canvas tints card backgrounds and gives cards a resting shadow, against two
  DESIGN.md rules; per `PROMPT.md` the mockup wins and the docs unit records the canvas as the deliberate exception.
- Node 24 runs `.ts` files directly (type stripping), so pure modules can be checked with a plain `node` script.

## The contract (the scaffold, built by the coordinator before any unit starts)

One commit on local `main`, after the pending desktop work is committed. Everything below is fixed; units build on
it and never change it. (Exact signatures; a worker that needs more adds it in its own files.)

### Types, in `src/types.ts`

```ts
/** A place in the story, asked obstacle-first: what makes it hard comes before what it looks like. */
export interface Setting { id: string; storyId: string; name: string; hard: string; reveals: string; props: string[]; mood: string; createdAt: number; updatedAt: number }
/** A thing the book returns to: an object, an image, a phrase. A name and a line. (Not `Symbol`: that is the global.) */
export interface StorySymbol { id: string; storyId: string; name: string; note: string; createdAt: number; updatedAt: number }
/** A document in the Web: what the story believes, in the writer's words, and the parts the writer says carry it. */
export interface CoreIdea { id: string; storyId: string; title: string; text: string /* HTML, the editor's schema */; carriedBy: WebLink[]; createdAt: number; updatedAt: number }
export type WebLinkKind = 'chapter' | 'character' | 'setting' | 'symbol' | 'board'
export interface WebLink { kind: WebLinkKind; id: string }
/** A board: one JSON Canvas document with a name. Pictures live in `images`, so a board stays small. */
export interface Board { id: string; storyId: string; name: string; canvas: CanvasDoc; createdAt: number; updatedAt: number }
/** A picture placed on a board, as an embedded data URL (cleanImage's rule). `name` is its caption: it is the one thing Obsidian keeps. */
export interface BoardImage { id: string; storyId: string; name: string; data: string; createdAt: number }
```
`DrawerItem.kind` gains `'board' | 'idea' | 'setting'`, and the item gains optional `boards?: Board[]; images?:
BoardImage[]; coreIdeas?: CoreIdea[]; settings?: Setting[]; symbols?: StorySymbol[]` (older drawer items lack them:
read with `?? []`). A board, a core idea and a setting are the writer's own work, so they are set aside like a
chapter, never deleted outright; only a symbol (a name and a line) is deleted in place, with a confirmation.

### JSON Canvas, in `src/canvas/types.ts` and `src/canvas/jsonCanvas.ts`

```ts
export type CanvasSide = 'top' | 'right' | 'bottom' | 'left'
export type CanvasEnd = 'none' | 'arrow'
interface NodeBase { id: string; x: number; y: number; width: number; height: number; color?: string; [extra: string]: unknown }
export interface TextNode extends NodeBase { type: 'text'; text: string }
export interface FileNode extends NodeBase { type: 'file'; file: string; subpath?: string }
export interface LinkNode extends NodeBase { type: 'link'; url: string }
export interface GroupNode extends NodeBase { type: 'group'; label?: string; background?: string; backgroundStyle?: 'cover' | 'ratio' | 'repeat' }
export type CanvasNode = TextNode | FileNode | LinkNode | GroupNode
export interface CanvasEdge { id: string; fromNode: string; fromSide?: CanvasSide; fromEnd?: CanvasEnd; toNode: string; toSide?: CanvasSide; toEnd?: CanvasEnd; color?: string; label?: string; [extra: string]: unknown }
export interface CanvasDoc { nodes: CanvasNode[]; edges: CanvasEdge[] }
/** What a node is to Parchemin. Live cards are file nodes whose path is the library folder's future layout. */
export type CardKind = 'note' | 'chapter' | 'character' | 'setting' | 'image' | 'group' | 'link' | 'file'
export function kindOf(node: CanvasNode): CardKind      // group→group; text→note; link→link; file: chapters/<id>.md→chapter, characters/<id>.md→character, settings/<id>.md→setting, images/<id>→image, else file
export function refOf(node: CanvasNode): string | null  // the id inside a Parchemin path, or null
export const pathFor = (kind: 'chapter' | 'character' | 'setting' | 'image', id: string) => string
/** Preset colours "1".."6" → the app's tokens: 1 danger, 2 draft, 3 draft, 4 done, 5 place, 6 accent; hex passes through. The colour menu offers 3, 4, 5, 6 and none (danger is reserved for failure and deletion; 1 and 2 only render when a file carries them). */
export function colorOf(color: string | undefined): string | null
export const DEFAULT_SIZE: Record<CardKind, { width: number; height: number }>  // note 300×70, chapter 250×110, character 210×100, setting 250×130, image 250×136, group 340×420, link 300×70, file 250×80
export const GRID = 20
export interface Point { x: number; y: number }
export interface Rect extends Point { width: number; height: number }
export const rectOf = (n: CanvasNode): Rect
/** Screen = world × zoom + view. */
export interface View { x: number; y: number; zoom: number }
/** What the surface hands to the layers drawn under and over the cards: the view, every node's rect with any live drag offset applied, and client → world. */
export interface Layer { view: View; rects: Map<string, Rect>; toWorld: (client: Point) => Point }
/** A node fully inside a group's rect belongs to it (Obsidian's rule; the format has no membership field). */
export const inside = (inner: Rect, outer: Rect): boolean
```
`jsonCanvas.ts`: `parseCanvas(raw: unknown): CanvasDoc` (throws a writer-readable Error on bad input; keeps unknown
attributes by spreading, never reads them; ids made unique with edges remapped in the same pass; edges whose nodes
are missing dropped; numbers rounded to integers; groups moved before every non-group so z-order is layered),
`serializeCanvas(doc): string` (two-space JSON, the spec's attribute order), `emptyCanvas()`. Used by backup restore
and by the `.canvas` file buttons.

### The board's document has one owner (pattern of `src/editorState.ts`)

`src/canvas/boardStore.ts`: the in-memory document of the open board, so the pane and the sidebar never race the
500 ms save. `useBoardDoc(boardId): CanvasDoc | undefined`, `loadBoard(boardId)` (reads the row once; later live rows
are taken only when nothing is dirty and `row.updatedAt` is later than the last write), `setBoardDoc(boardId, doc)`,
`patchNode(boardId, id, patch: Partial<CanvasNode>)`, `patchEdge(boardId, id, patch: Partial<CanvasEdge>)`,
`flushBoard(boardId): Promise<void>` (writes through `db.boards.update(id, { canvas, updatedAt })`, so a late save
never brings back a board that was set aside), with the debounce, flush on `pagehide`/`beforeunload`, and a
`dirty` flag inside. Everything that edits a board goes through this store; `db.boards.update` is called directly
only for `name`.

### Selection stores (pattern of `src/editorState.ts`)

- `src/canvas/selection.ts`: `{ boardId: string | null; picked: string[] }` (node and edge ids), `useCanvasSelection()`,
  `setCanvasSelection(next)`, `pickOnly(id)`, `togglePick(id)`, `clearPicks()`. The pane writes it and clears it on
  unmount; the sidebar treats it as empty when its `boardId` is not the route's.
- `src/web/item.ts`: the Web's route `itemId` is `<kind>:<id>` with kind one of `idea | character | setting |
  symbol | chapter | board`; `parseWebItem(itemId?: string): { kind: WebItemKind; id: string } | null`,
  `webItem(kind, id): string`.

### Web model types, in `src/web/types.ts`

```ts
export type WebKind = 'core' | 'char' | 'set' | 'sym' | 'ch' | 'board'
export interface WebNode { key: string /* webItem() */; kind: WebKind; id: string; label: string; r: number; warn?: boolean; orphan?: boolean }
export interface WebEdge { from: string; to: string; kind: 't' | 'x'; weight: number }   // t: a thread the writer declared; x: appear together in the text
export interface WebFilters { show: Record<WebKind, boolean>; cooccurrence: boolean }
```

### Database, in `src/db.ts` (version 7) and the files that follow it

- `this.version(7).stores({ boards: 'id, storyId', images: 'id, storyId', coreIdeas: 'id, storyId', settings: 'id, storyId', symbols: 'id, storyId' })`; the table fields on the class.
- Helpers: `createBoard(storyId, name = 'New board'): Promise<string>`, `createCoreIdea(storyId, title = ''): Promise<string>`,
  `createSetting(storyId, name = ''): Promise<string>`, `createSymbol(storyId, name = ''): Promise<string>`,
  `addImage(storyId, name, data): Promise<string>`, `setAsideBoard(id)` (the board and the images no other board
  uses), `setAsideCoreIdea(id)`, `setAsideSetting(id)`, `deleteSymbol(id)`. `DRAWER_TABLES` includes the five new
  tables; `setAsideStory` carries them; `putBack` restores every kind with `?? []`; `deleteForGood` is unchanged (the
  drawer item goes, and with it what it holds). `src/components/DrawerSection.tsx` describes the three new kinds
  ("Board", "Core idea", "Setting") and the Library's drawer count includes them.
- `src/changes.ts`: `TRACKED` adds the five; `wordsIn` counts a core idea's title and text (HTML), a setting's fields, a
  symbol's name and note, a board's name, text nodes and edge labels; images 0.
- `src/backup.ts`: `BackupFile.data` gains optional `boards, images, coreIdeas, settings, symbols`; each validated when
  present (`OPTIONAL: Record<name, fields>`: boards `id, storyId, name`; images `id, storyId, data`; coreIdeas `id,
  storyId, title, text`; settings `id, storyId, name`; symbols `id, storyId, name`); `VERSION` stays 1 (an old build
  drops the new keys silently, which is the right failure); the explicit table lists of `readLibrary` (line 74) and
  `restoreBackup` (line 208) gain the five tables (Dexie refuses a write outside the transaction's scope);
  `cleanRows` returns an array for each of the five (`?? []`), runs `cleanHtml` on core idea text, drops an image whose
  `cleanImage` is null, coerces `carriedBy` to `{ kind, id }[]` with a known kind and `props` to `string[]`, and runs
  `parseCanvas` on each board (a board that fails is dropped, not the restore); `restoreBackup` bulkPuts them and the
  `markRestored` key list becomes `[...TABLES, 'drawer', ...OPTIONAL]`; the drawer's items carry the new arrays
  through the same cleaners, validated only when present (`drawerOk` keeps iterating `TABLES`). `inspectBackup`
  unchanged.
- `src/components/Safekeeping.tsx` `KINDS` gains `boards/board/boards`, `images/picture/pictures`, `coreIdeas/core
  idea/core ideas`, `settings/setting/settings`, `symbols/symbol/symbols`.

### Routes, tabs, shell

- `route.ts`: `Tab = 'write' | 'outline' | 'cast' | 'canvas' | 'web'`; parse maps `canvas` and `web`. Routes:
  `#/story/<id>/canvas[/<boardId>]`, `#/story/<id>/web[/<kind>:<id>]`.
- `tabs.ts` `tabKey`: canvas → `canvas:<boardId>` or `canvas:<storyId>:first`; web → `web:<storyId>`.
- `TabStrip.tsx`: `ICONS` gains `canvas` and `web`; `describe` labels a canvas tab with the board's name (a
  `useLiveQuery` of `db.boards`, cheap because images live apart) and the Web tab "Web"; prune closes a tab whose
  board is gone.
- `App.tsx`: `Screen` gains `canvas | web`; `RIGHT_TABS.canvas = [{ id: 'boards', icon: 'canvas', title: 'Boards' },
  { id: 'card', icon: 'plan', title: 'Selected card' }]`, `RIGHT_TABS.web = [{ id: 'idea', icon: 'notes', title: 'Core
  idea' }, { id: 'symbols', icon: 'web', title: 'Symbols' }]`; window title (board name / "Web"); `currentSceneId`
  (line 107) reads `route.itemId` only on the write and outline tabs; the library sidebar is hidden on these two
  screens unless the writer opens it there (a second stored flag, `parchemin.left.wide`, default off, toggled by the
  same menu button); actions `newBoard`, `newCoreIdea`, `newSetting`, `newSymbol`. `tabs.ts` line 42 collapses the
  `canvas:<storyId>:first` placeholder once a board tab exists, as it does for chapters. `DrawerSection.tsx` describes
  the new kinds and its counts and the delete-for-good confirmation name boards and core ideas.
- `commands.ts`: per story "Open the boards", "New board", "Open the Web", "New core idea", "New setting", "New
  symbol"; the hint is the story's title.
- `Ribbon.tsx`: "Boards" (`canvas` icon) and "Web" (`web` icon) between Cast and The drawer.
- `Icons.tsx`: `canvas`, `web`, `group`, `lock` added from the mockup (`place`, `image`, `notes`, `plan`, `bulb` exist).
- `StoryView.tsx` and `StorySidebar.tsx`: lazy `CanvasPane` / `WebPane` and lazy `CanvasSidebar` / `WebSidebar`
  with these props, fixed:

```ts
CanvasPane({ story: Story; scenes: Scene[]; boardId?: string; onOpenRight: (tab: string) => void })
CanvasSidebar({ story: Story; scenes: Scene[]; boardId?: string; rightTab: string })
WebPane({ story: Story; scenes: Scene[]; itemId?: string })
WebSidebar({ story: Story; scenes: Scene[]; itemId?: string; rightTab: string })
```
  The scaffold's four components render the pane head with the right crumbs and a `.pane-empty` line "The boards are
  being built." / "The Web is being built." Wave 2 replaces their bodies.
- `.gitignore` gains `scratch/` for throwaway harness pages and screenshots.
- `LibraryTree.tsx` story menu gains "Open the boards" and "Open the Web"; the set-aside confirmation names boards and
  core ideas among what goes with a story.

## The units

Each unit owns the files listed and no others. It reads the contract files and may read anything, but edits only its
own. Where a unit needs a helper the contract lacks, it adds it in its own files. Wave 1 units are independent of each
other and of wave 2; wave 2 units compose wave 1 and start after wave 1 has merged.

### Wave 1 (seven units, parallel)

1. **Canvas surface** · `src/canvas/surface.tsx`, `src/canvas/geometry.ts`, `src/canvas/useBoard.ts`,
   `src/canvas/surface.css`. `CanvasSurface` props: `{ doc: CanvasDoc; onChange: (doc: CanvasDoc) => void;
   renderNode: (node: CanvasNode, picked: boolean) => ReactNode; under?: (l: Layer) => ReactNode /* the edge layer,
   painted under the cards */; over?: (l: Layer) => ReactNode /* side handles, the edge draft and the card bar, above
   the cards */; picked: string[]; onPick: (ids: string[]) => void; onCreateAt?: (point: Point) => void; onOpen?:
   (id: string) => void /* double-click on a card */; children?: ReactNode /* toolbars, in viewport coordinates */ }`
   with `fitAll()` and `zoomTo(z)` through a ref (`CanvasSurfaceHandle`). The surface renders each node as
   `<div class="cc-slot[ picked]" data-node-id="<id>" tabIndex={0} style={{ left, top, width, height }}>` holding
   `renderNode(node, picked)` and, when picked, the four `.hd` handles; `Card` (unit 3) fills the slot at 100 %.
   Pan and zoom: screen = world × zoom + view; `.board { transform: translate(view.x, view.y) scale(zoom) }`; the dot
   grid follows (`.canvas` `background-position: view.x view.y; background-size: GRID × zoom`, the step doubled while
   it is under 10 px); zoom about the pointer `view' = p − (p − view) × (z'/z)`, 10 %–300 %; the wheel listener is
   added with `{ passive: false }` in an effect (React's `onWheel` is passive, so `preventDefault` there does
   nothing): plain wheel pans, Ctrl/⌘ + wheel zooms (this covers trackpad pinch); `touch-action: none` on `.canvas`;
   two-finger pinch is out of scope and said so. `.cv-zoom` −/+/Fit bottom right; the fit animates with a `.fitting`
   class (`transition: transform 200ms`, removed on `transitionend`) unless `prefers-reduced-motion`. Dragging: pointer
   capture on the slot, 4 px activation, a local offset while moving (handed to the layers through `rects` so edges
   follow), one `onChange` on pointerup, snapped to the grid; the moving set is the picked nodes plus the nodes
   `inside` any picked group, deduplicated; the handles resize (min 120 × 40; `tl`/`tr`/`bl` also move `x`/`y`) and
   stop propagation; a pointerdown whose target matches `input, textarea, button, [contenteditable="true"]` starts
   nothing. Picking: click picks, Shift-click toggles, Shift-drag on empty space draws a `.marquee` (nodes that
   intersect, groups only when fully inside), drag on empty space pans; a picked node moves to the end of its layer
   on drag start, never on pick (a reorder is a save), and groups always stay before every non-group. Keyboard, on
   `.canvas` (`tabIndex={0}`), never on `window`, and never while the target is a field: Enter picks the focused
   slot, Shift+Enter toggles, Delete/Backspace removes the picked nodes and the edges touching them, arrows nudge by
   the grid (Shift × 5), Escape clears, Ctrl/⌘+D duplicates. `useBoard(boardId)` wraps the scaffold's `boardStore`:
   `loadBoard` on mount or when `boardId` changes (flushing the previous one first), `flushBoard` on unmount, and
   returns `{ doc, setDoc }`.
2. **Canvas edges** · `src/canvas/edges.tsx`, `src/canvas/edgePath.ts`, `src/canvas/edges.css`. `edgePath(from: Rect,
   fromSide: CanvasSide | undefined, to: Rect, toSide: CanvasSide | undefined): { d: string; mid: Point }` (sides
   chosen by relative position when absent; a cubic bezier with tangents normal to the sides; straight when aligned)
   and `EdgeLayer({ doc, layer: Layer, picked, onPick: (id: string, additive: boolean) => void, onChange: (doc) => void
   })` drawing `<svg class="edges">` in world coordinates with the marker (both ends, per `fromEnd`/`toEnd`), one
   `<path>` per edge, a halo'd `<text>` label at the midpoint (double-click edits it in place through a
   `<foreignObject>` input; Enter saves, Escape cancels), picked edges in `--accent`, and an invisible 12 px hit path
   per edge with `tabIndex={0}` for picking; and `useEdgeDraft(doc, layer, onChange)` returning `{ handles: (nodeId:
   string) => ReactNode /* four side handles for the picked card, counter-scaled by 1/zoom */; draft: ReactNode /* the
   path being dragged */ }`: a drag from a side handle resolves its drop with
   `document.elementFromPoint(x, y)?.closest('[data-node-id]')`, makes an edge with `fromSide`/`toSide` and `toEnd:
   'arrow'`, and a drop on empty space makes nothing. Owns `.edges` CSS only.
3. **Cards and toolbars** · `src/canvas/cards.tsx`, `src/canvas/toolbar.tsx`, `src/canvas/addFromStory.tsx`,
   `src/canvas/cards.css`. `Card({ node, picked, onChange: (patch: Partial<CanvasNode>) => void })` renders
   `<div class="cc <kind>">` at 100 % of its slot (no positioning; the slot owns that) by `kindOf`: character (live
   from `db.characters`: `Avatar`, name, "Role · Voice" via `voiceById`, want in a room), chapter (live from
   `db.scenes` by id: status dot, "N · Title" with `numberOf`, "Status · N words", the summary editable with
   `GrowingText`, saved through `db.scenes.update`), setting (live from `db.settings`: place icon, name, "Hard
   because:" and "Props:"), note (editable text; a text node with `color` "2" or "3" takes the `.question` wash), image
   (from `db.images`: `<img>` and the image's `name` as the caption, editable in place through `db.images.update`),
   group (`.g-label` editable), link (the url), file (the path, for a file from Obsidian); a live card whose record is
   gone shows "No longer in the story" in `--muted` and keeps its place. Card colours: `colorOf(node.color)` sets the
   border. `CardBar({ node, zoom, onColor, onOpen, onDuplicate, onRemove })` is the floating `.cc-bar`, rendered in
   the `over` layer at the card's top-left with `transform: translateY(-100%) scale(1/zoom); transform-origin: 0 100%`
   (swatch and the presets 3, 4, 5, 6 and none; "Open the chapter" / "Open on the Cast page" / "Open the setting"; ⋯
   with Duplicate and "Remove from the board"). `Tools({ onAdd: (kind: 'note' | 'chapter' | 'character' | 'setting'
   | 'group' | 'image') => void })` is `.cv-tools`. `AddFromStory({ story, scenes, doc, onAdd: (node: CanvasNode) =>
   void })` is the "Add from the story ⌄" menu: chapters, characters and settings not yet on the board, each adding
   a file node with `pathFor` and `DEFAULT_SIZE`; "Image…" opens a file input, checks `cleanImage`, calls `addImage`
   and adds the node. `newNode(kind, at)` factory (a group goes before the first non-group). The chapter tool adds
   the next chapter not on the board; the character and setting tools open the picker; "Setting" with none in the
   story creates one through `createSetting` and adds it. Owns `.cc*`, `.g-label`, `.cc-bar` and `.cv-tools` CSS;
   the surface owns `.canvas`, `.board`, `.cc-slot`, `.hd`, `.marquee` and `.cv-zoom`.
4. **Setting sheets** · `src/craft/settings.ts`, `src/components/SettingSheet.tsx`, `src/components/SettingsList.tsx`.
   `SETTING_FIELDS` (key, label, placeholder, in the method's order: "What makes it hard here?" first, mood last, with
   the one-line hints from `PHILOSOPHY.md` craft item 6 and `prompts.ts` lines 51 and 55). `SettingSheet({ setting,
   onSetAside?: () => void })`: name, hard, reveals, props (one per line in a `GrowingText`, stored as an array), mood,
   with the autosave pattern, and "Move to the drawer" (confirm: "Move <name> to the drawer? Cards and threads that
   point at it will say it is gone until you put it back.") through `setAsideSetting`. `SettingsList({ story,
   selectedId?, onSelect: (id: string) => void })`: the story's settings as `.snap` rows with "＋ New setting". Nothing
   mounts these yet; wave 2 does.
5. **Core ideas and symbols** · `src/craft/web.ts`, `src/components/CoreIdeaEditor.tsx`, `src/components/SymbolsPanel.tsx`.
   `CoreIdeaEditor({ idea, story, scenes, onSetAside: () => void })`: the title (Literata, as a story title), the
   document in a Tiptap editor built like `CharacterSidebar`'s biography (`storyKit`, placeholder "What the story
   believes, in your own words."), **Carried by** as removable chips, one per `WebLink`, with "Add…" opening a picker
   (`Menu` or a small `Modal`) over chapters (by number and title), characters, settings, symbols and boards (live
   queries), the autosave pattern, "Move to the drawer" through `setAsideCoreIdea` with a confirmation, and the line
   "It is in your backup file, and in no export of the story." `SymbolsPanel({ story, selectedId? })`: the symbols as
   rows (name and note, both `GrowingText`, autosaved), "＋ New symbol", delete with a confirmation ("Delete <name>? A
   symbol is a name and a line; there is nothing else to keep."). `craft/web.ts` holds the copy: the hint under the
   editor ("A core idea is what the story believes. Link what carries it; the Web draws the thread.") and the
   empty-state lines.
6. **Web data** · `src/web/cooccur.ts`, `src/web/model.ts`, `src/web/useWebModel.ts`. Only `useWebModel.ts` imports
   React, `dexie-react-hooks` or `../db`; the other two are pure. `export interface Cooccurrence { mentions: Map<string,
   Set<string>> /* webItem key → chapter ids */; spellings: Map<string, Set<string>> /* key → the spellings that
   matched */; pairs: Map<string, number> /* pairKey(a, b), keys ordered, → shared chapters */ }` and
   `cooccurrence(input: { scenes: Pick<Scene, 'id' | 'content' | 'updatedAt'>[]; characters: Pick<Character, 'id' |
   'name'>[]; settings: Pick<Setting, 'id' | 'name'>[]; symbols: Pick<StorySymbol, 'id' | 'name'>[] }): Cooccurrence`,
   memoized per chapter on `updatedAt` and the names' signature. The matching rule, exactly: text is `htmlToText`,
   NFC, `toLocaleLowerCase()`, with `’` → `'` in text and names; accents kept (the writer's spelling wins); a name
   matches `(?<![\p{L}\p{N}])name(?![\p{L}\p{N}])` with the `u` flag, regex-escaped (so "d'Elias" matches and
   "l'homme" only matches a name "homme"); a name holding any Han, Hiragana, Katakana or Thai character drops both
   boundary assertions; the full name always; a first name only when the name has two or more tokens, the first has
   two or more letters, is not an article (the, a, an, le, la, les, l', un, une, der, die, das, el, los, las, il, lo,
   de, het) and is not the first token of another entity in the story; longest name first, each match blanked before
   shorter names run (so "the lamp room" never credits "the lamp"); names under two letters and "New character" are
   skipped. These are "appear together in the text" lines and nothing more: the sidebar for a picked part lists the
   chapters and the spelling that matched ("Appears in ch. 1, 7 as Mara, Mara Quill"). `buildWebModel(input: { scenes;
   characters; settings; symbols; boards; coreIdeas; co: Cooccurrence; filters: WebFilters }): { nodes: WebNode[];
   edges: WebEdge[]; counts: Record<WebKind, number> }` with `counts` computed before the filters: nodes per kind
   (core r = 16 + 2 × links, max 22; char 10; set 9; sym 9; board 10; ch 7 with label "ch. N"), declared threads
   (`t`, weight = how many core ideas name that part) from `carriedBy`, co-occurrence edges (`x`, weight = shared
   chapters) between entities and from an entity to each chapter it appears in; `warn` only when the story has a
   core idea, on a chapter with text (`words > 0` or non-blank content) that no core idea names, label "ch. N · no
   thread"; `orphan` on a chapter with no text, no link and no mention, label "ch. N · not written"; filters drop
   kinds and `x` edges after the counts. `useWebModel(story, scenes, filters)` runs the live queries and memoizes.
   Checked through the e2e script with `server.ssrLoadModule('/src/web/model.ts')` over fixtures (a plain `node` run
   fails on extension-less imports).
7. **Graph** · `src/web/layout.ts`, `src/web/Graph.tsx`, `src/web/web.css`. `layout(nodes, edges, opts: { width;
   height; seed?: number; prev?: Map<string, Point> }): Map<string, Point>`: a deterministic force layout (a seeded
   PRNG such as mulberry32 for initial positions, no `Math.random`, array-order iteration; repulsion, springs on
   edges weighted by kind, gravity to the centre, chapters pulled to a loose ring), 300 iterations capped, `prev`
   positions kept for nodes that remain. `Graph({ nodes, edges, picked?: string | null; onPick: (key: string | null)
   => void; onOpen?: (key: string) => void })` owns a `ResizeObserver` for its size and a `prev` ref, and draws the
   SVG per the spec (edges first, then nodes, classes `n <kind> [picked] [near|far] [warn] [orphan]`, the dashed
   ring, labels with halo), pan and zoom (drag, wheel, Ctrl + wheel, `.cv-zoom` with Fit), hover shows a dimmed
   node's label at full opacity, keyboard: Tab through nodes, Enter picks, Escape clears; `prefers-reduced-motion`
   means no animated fit. `Legend({ counts: Record<WebKind, number>; filters: WebFilters; onChange: (f: WebFilters)
   => void })`: the `.gpanel` with **Show** switches and **Threads** ("Threads are links you made. Thicker: named by
   more than one core idea." · "Grey lines: appear together in the text" with its switch). Owns `.graph`, `.gpanel`,
   `.gsec`, `.gline`, `.gk`, `.switch`, `.core-doc`.

### Wave 2 (three units, parallel, after wave 1 merges)

8. **Canvas pane and sidebar** · `src/components/CanvasPane.tsx`, `src/components/CanvasSidebar.tsx`,
   `src/canvas/canvasFiles.ts`. The pane: crumbs Story › Boards › name (the name editable in place, saved with
   `db.boards.update`), "Add from the story ⌄", "Zoom to fit"; `useBoard` + `CanvasSurface` (`under` = `EdgeLayer`,
   `over` = the edge draft's handles and the `CardBar`) + `Card` + `Tools`; without a `boardId`, `replaceRoute` to the
   story's first board or show `.pane-empty` "No boards yet. A board is a table for the pieces of your story." with
   "New board"; picking writes `selection.ts`; a double-click on a card calls `onOpenRight('card')`; double-click on
   empty space adds a note there. The sidebar edits the document only through `patchNode` and `patchEdge`:
   **Boards** (rows, the open one `.snap.active`, New board, rename and "Move to the drawer" through `Menu`),
   **Selected** (by kind: character fields with "Open on the Cast page" and "Card colour"; chapter status and summary
   with "Open the chapter"; setting via `SettingSheet`; note text; image caption; group label; edge label and ends;
   nothing picked: "Pick a card to see it here."), **On this board** (counts from the story and only here, "Saved in
   · this library", "Save as a .canvas file…" via `saveFile` + `serializeCanvas`, "Open a .canvas file…" via a file
   input + `parseCanvas` into a new board, and the hint). Tab label and window title follow the name.
9. **Web pane and sidebar** · `src/components/WebPane.tsx`, `src/components/WebSidebar.tsx`. The pane: crumbs Story ›
   Web with the lock chip, the guide-off line, `useWebModel` + `layout` + `Graph` + `Legend`, filters kept per device
   (`localStorage`), picking → `replaceRoute` with `webItem(kind, id)`, double-click a chapter node opens the
   chapter; empty state when the story has no core idea: "A core idea is what the story believes, in your own words.
   Write the first one." with "New core idea". The sidebar: `idea` tab → `CoreIdeaEditor` for the picked idea, or the
   list of ideas with "New core idea"; a picked character/setting/symbol/chapter/board → its name and kind, the core
   ideas that name it, the plain evidence line from `Cooccurrence.spellings` ("Appears in ch. 1, 7 as Mara, Mara
   Quill"), and "Open on the Cast page" / "Open the setting" / "Open the chapter" / "Open the board"; `symbols` tab →
   `SymbolsPanel`; a picked setting → `SettingSheet`.
10. **Docs and the example library** · `README.md`, `PHILOSOPHY.md`, `DESIGN.md`, `design/README.md`,
    `design/example-library.json`, `PROMPT.md`. README: feature bullets for the boards and the Web (what is built, what
    waits for the guide), the architecture paragraph (`src/canvas/`, `src/web/`, the five tables), "Not built yet"
    updated. PHILOSOPHY: the "where it lives" rows (structure without a cage: the canvas; the writer owns the work:
    boards as JSON Canvas, the Web never exported), roadmap item 6 "Done on 2026-10-14…", and "Still planned from
    before: setting sheets" becomes done. DESIGN.md: the canvas card and the graph node as components, and the
    deliberate exceptions the mockup makes (tinted card washes and a resting card shadow on the canvas; filled nodes,
    a floating legend and Inter labels in the Web). design/README: the two screens are built. PROMPT.md items 3 and 4,
    and its "Stored data" paragraph (new tables are optional in a backup, not added to `TABLES`). The example library
    gains one board ("Who knows what", the mockup's cards, group and arrows), three core ideas, two settings and four
    symbols, and the cast's names written into the chapters' text where the mockup's grey lines need them, so a
    restore shows the two screens as the mockup draws them ("The Board" stays as it is: it is the test of the
    first-name rule).

## E2E recipe (what every worker runs)

```
# once, in the worktree (node_modules are per checkout; ignore the install-scripts warning, Electron is not needed)
npm install
npm run build                      # must pass: tsc -b && vite build, no new warning
# browser check: a script under scratch/ (git-ignored), run with `node scratch/check.mjs`
```
The script, in outline (copy it; it is known to work on this machine):
```js
import { createRequire } from 'node:module'
const require = createRequire('/home/williamosuji/.npm/_npx/f0a362733743bae2/node_modules/')   // playwright 1.49.1, matches the cached chromium_headless_shell-1148
const { chromium } = require('playwright')
const { createServer } = await import(new URL('../node_modules/vite/dist/node/index.js', import.meta.url))
const server = await createServer({ root: new URL('..', import.meta.url).pathname, server: { port: 0 }, logLevel: 'error' })
await server.listen(); const url = server.resolvedUrls.local[0]
const browser = await chromium.launch({ env: { ...process.env, LD_LIBRARY_PATH: '/home/williamosuji/.local/lib/electron-wsl' } })
const page = await (await browser.newContext({ viewport: { width: 1280, height: 800 } })).newPage()
const errors = []; page.on('pageerror', e => errors.push(e.message)); page.on('console', m => m.type() === 'error' && errors.push(m.text()))
// a harness page (wave 1): scratch/harness.html with <div id="root"></div><script type="module" src="/scratch/harness.tsx"></script>
//   that mounts the unit's component with fixture data; await page.goto(url + 'scratch/harness.html')
// the app (wave 2): await page.goto(url + '#/safekeeping'); await page.locator('.safe input[type=file]').nth(0).setInputFiles('scratch/fixture-backup.json')
//   (a parchemin-backup JSON with stories, scenes, characters, snapshots, folders and the new optional tables); wait for /Restored/ in '.safe [role=status]'; then goto the screen's hash
// drive it: click, drag with page.mouse, type; screenshot to scratch/shots/<name>.png; repeat at 400 px wide and with page.emulateMedia({ colorScheme: 'dark' })
//   (a harness imports '/src/styles.css' and the font packages as src/main.tsx does, or there are no tokens; add reducedMotion: 'reduce' to a context to check the fit)
// pure modules: const m = await server.ssrLoadModule('/src/web/model.ts'); run fixtures through it and assert (a plain `node` run fails on extension-less imports)
// finish: print errors; exit 1 if any
await browser.close(); await server.close()
```
Done means: the build passes, the script runs with no page error, and the screenshots at 1280 × 800 (light and dark)
and 400 px look like the mockup's screen for that part. Pure modules (units 6 and 7, `edgePath` in unit 2) are also
checked through `ssrLoadModule` over fixtures.

## Worker template (the shared prompt; the unit's own section is spliced in)

```
You are implementing one unit of a larger change in Parchemin, a calm, local-first writing app (React 19 + TypeScript
strict + Vite + Dexie + Tiptap; no test framework). The overall goal: implement the Canvas (per-story boards with live
cards, notes, groups and named arrows, saved as JSON Canvas) and the Web (the per-story graph of the writer's core
ideas and the story's parts). You are in your own git worktree on a branch; other workers build sibling units at the
same time, so edit ONLY the files your unit owns, never the scaffold or another unit's files.

Read first, in this order: PROMPT.md (how this project is built and written), the plan at
prompts/canvas-and-web/PLAN.md (the design spec from the mockup, the contract you build
on, and your unit), DESIGN.md (tokens and rules), and the contract files the plan names (src/types.ts,
src/canvas/types.ts, src/canvas/jsonCanvas.ts, src/web/types.ts, src/canvas/selection.ts, src/web/item.ts, src/db.ts).
Open design/parchemin-desktop.html in the browser check if you need to see the screen (the plan quotes its CSS).

Conventions that apply to you:
- The mockup is the design; the plan quotes its markup and CSS. Tokens only, from src/styles.css; your CSS goes in your
  own file next to your code and is imported by your component. No new dependency.
- Copy: writer, never user; plain sentences; one copy per action. Counts are plain facts; nothing is scored.
- Keyboard and phone: every action reachable from the keyboard; the piece works at 400 px wide; focus ring is the
  app's; respect prefers-reduced-motion; role="status" on what changes by itself; 4.5:1 on text.
- Comments give the why in one plain sentence. TypeScript strict with noUnusedLocals: an unused import fails the build.
- Live data through dexie-react-hooks useLiveQuery; writes through db.<table>.update with updatedAt; the autosave
  pattern of src/components/CharacterSidebar.tsx; fields with src/components/GrowingText.tsx.
- Commits: one plain sentence in the imperative naming what changed for the writer. Commit on your branch. Do NOT push,
  do NOT open a pull request, do NOT edit package.json, do NOT touch files outside your unit.
- Your check scripts, harness pages, fixtures and screenshots live under scratch/ in the worktree: it is git-ignored,
  which is the "outside the repo" PROMPT.md asks for. Never commit it.

<UNIT: title, files, description, from the plan>

<E2E RECIPE, from the plan>

After you finish implementing the change:
1. Code review: invoke the Skill tool with skill "code-review" to find correctness bugs (it reports findings; it does
   not edit code). Fix any findings it surfaces before continuing.
2. Run the build: `npm run build` must pass with no new warning (there is no unit test runner; for pure modules run
   your node script over fixtures).
3. Test end-to-end: follow the e2e recipe above (a harness page for a wave-1 unit; the app for a wave-2 unit). Look at
   the screenshots.
4. Commit all changes on your branch with a clear message. Do not push and do not create a PR (gh is not logged in and
   the coordinator merges locally).
5. Report: end with one line `BRANCH: <branch name>` and, before it, what changed, what the screenshots showed, and
   anything left out with the reason.
```

## Coordinator steps (after approval)

1. Commit the pending desktop work on `main` (one commit: the desktop app and the two prompts).
2. Build the scaffold per the contract; `npm run build`; a Playwright pass that restores the example library, opens
   `#/story/<id>/canvas` and `#/story/<id>/web`, and screenshots the placeholder screens; commit on `main`.
3. Set `worktree.baseRef = head` in `.claude/settings.local.json` (git-ignored) so worktrees branch from local HEAD.
4. Spawn wave 1 (units 1–7) in one message, `isolation: "worktree"`, `run_in_background: true`, `subagent_type:
   "general-purpose"`, each with the template above and its unit spliced in. Track in a table.
5. As each reports: review the diff, run the build, merge the branch into `main` (fast-forward or a merge commit),
   delete the worktree. Conflicts are the coordinator's to resolve (units own disjoint files, so none are expected).
6. When all seven have merged: spawn wave 2 (units 8–10) the same way; merge each; run the full browser check over
   the example library on both screens, light and dark, 1280 × 800 and 400 px; fix what it shows.
7. Final report with the table. Nothing is pushed until William says.

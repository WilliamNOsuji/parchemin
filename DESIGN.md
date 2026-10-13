---
name: Parchemin
description: A calm, local-first writing app for stories and the people in them. One palette, two surfaces.
colors:
  page: "#faf7f2"
  sheet: "#ffffff"
  chrome: "#f3eee6"
  line: "#e4ddd0"
  ink: "#2b2723"
  muted: "#6f675d"
  accent: "#5b4bb7"
  accent-ink: "#ffffff"
  accent-soft: "#ece9fb"
  danger: "#b3261e"
  place: "#2f8f86"
  idea: "#b8a99a"
  draft: "#d9a441"
  revised: "#4a8fc4"
  done: "#4f9d69"
  page-dark: "#1b1a1f"
  sheet-dark: "#242329"
  well-dark: "#2d2c33"
  chrome-dark: "#222128"
  line-dark: "#3a3942"
  ink-dark: "#ece8e1"
  muted-dark: "#a09a90"
  accent-dark: "#a99bff"
  accent-ink-dark: "#17151f"
  accent-soft-dark: "#34305a"
  danger-dark: "#ff8a80"
  place-dark: "#6cc5bc"
  idea-dark: "#8d8478"
typography:
  display:
    fontFamily: "Literata Variable, Literata, Georgia, Times New Roman, serif"
    fontSize: "clamp(42px, 7.2vw, 88px)"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.012em"
  headline:
    fontFamily: "Literata Variable, Literata, Georgia, Times New Roman, serif"
    fontSize: "clamp(28px, 3.6vw, 38px)"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.012em"
  title:
    fontFamily: "Literata, Georgia, Times New Roman, serif"
    fontSize: "22px"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  manuscript:
    fontFamily: "Literata, Georgia, Times New Roman, serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.7
  reading:
    fontFamily: "Literata Variable, Literata, Georgia, Times New Roman, serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.6
  body:
    fontFamily: "Inter, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.45
  label:
    fontFamily: "Inter, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "10.5px"
    fontWeight: 600
    lineHeight: 1.45
    letterSpacing: "0.05em"
rounded:
  xs: "4px"
  sm: "5px"
  md: "6px"
  lg: "8px"
  xl: "10px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  2xl: "32px"
  3xl: "40px"
  section: "72px"
components:
  button:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "5px 10px"
  button-hover:
    backgroundColor: "{colors.chrome}"
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-ink}"
    rounded: "{rounded.md}"
    padding: "5px 10px"
  button-quiet:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "5px 10px"
  button-site:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "12px 20px"
  button-site-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-ink}"
    rounded: "{rounded.lg}"
    padding: "12px 20px"
  input:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "6px 8px"
  chip:
    backgroundColor: "{colors.chrome}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "1px 8px"
  chip-on:
    backgroundColor: "{colors.accent-soft}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "1px 8px"
  card:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "14px"
  tree-node:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.xs}"
    padding: "0 4px 0 6px"
    height: "26px"
  tree-node-active:
    backgroundColor: "{colors.accent-soft}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xs}"
  ribbon-button:
    backgroundColor: "transparent"
    textColor: "{colors.muted}"
    rounded: "{rounded.md}"
    size: "30px"
  ribbon-button-on:
    backgroundColor: "{colors.accent-soft}"
    textColor: "{colors.accent}"
    rounded: "{rounded.md}"
    size: "30px"
  palette:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    width: "min(560px, 100%)"
---

# Design System: Parchemin

## Overview

**Creative North Star: "A quiet room with paper in it"**

Provenance. There is no direction contract and no seed. The world was fixed by two mockups the user approved on 2026-10-10 (`design/parchemin-desktop.html`, `design/parchemin-website.html`) and the build was code-led against them on 2026-10-12. This file records what shipped in `src/styles.css` and `site/site.css`, not what was planned. Where the mockups and the build differ, the build wins and the difference is noted.

Two surfaces share one world. The application is a desk: an Obsidian-shaped window with a ribbon, two sidebars, tabs in the title bar, a status bar, and the manuscript in the middle. Its rule is calm density: 13 px UI, 1 px borders, 6 px radii, one accent, and chrome a shade darker than the page in both themes. The website is a page: one left-aligned 1080 px column set almost entirely in Literata, with two large objects (the headline and the app window) and running text around them.

The palette is warm paper and warm ink, with one violet accent that marks the thing you are on and the one thing you can do next. Nothing is decorated. Depth comes from a border and a tone step, not a shadow, except for the few things that actually float. The app follows the system theme and can be pinned light or dark.

**Key Characteristics:**
- Two voices: Inter for what the app says, Literata for what the writer wrote.
- One accent (`accent`), used on selection, the active view, links and one primary button per view.
- Flat surfaces, 1 px lines, tone steps between page, sheet and chrome.
- Five status colours exist only as 8 px dots and chip borders, never as text or fills.
- Fonts ship with the build; no request leaves the machine for them.

## Colors

Warm paper, warm ink, one violet, five small status dots.

### Primary
- **Violet** (`accent`, dark `accent-dark`): the active ribbon item and right-sidebar tab, the selected tree node and palette row, links, the one filled button in a view, focus rings, the caret in the website's app window, the website's three "jobs" headings. Dark mode lifts it to a pale violet so it still reads on ink.
- **Violet wash** (`accent-soft`, dark `accent-soft-dark`): the selected row, the "on" state of a chip, a nudge, the voice card, the prompt card, the 2 px ring on a selected outline row or cast card, text selection. It is the only tinted background the app has.
- **Violet ink** (`accent-ink`, dark `accent-ink-dark`): text on a filled accent button.

### Neutral
- **Paper** (`page`, dark `page-dark`): the page, the manuscript pane, the modal.
- **Sheet** (`sheet`, dark `sheet-dark`): the raised white of inputs, buttons, cards, rows, the palette and menus. In dark mode the website's well and sheet both take this value.
- **Chrome** (`chrome`, dark `chrome-dark`): ribbon, sidebars, title bar, status bar. The same value serves as the app's second surface (hover on buttons, chip background, code background); in dark mode the second surface is its own step (`well-dark`).
- **Line** (`line`, dark `line-dark`): every 1 px border and rule, the scrollbar thumb.
- **Ink** (`ink`, dark `ink-dark`): text.
- **Muted ink** (`muted`, dark `muted-dark`): secondary text, counts, labels, icons at rest, placeholders.
- **Danger** (`danger`, dark `danger-dark`): a failed save, a delete action, and nothing else. The website has no danger colour.

### Status
- **Idea** (`idea`, dark `idea-dark`), **Draft** (`draft`), **Revised** (`revised`), **Done** (`done`): the state of a chapter, as a dot in the tree, the tab and the outline row, and as the border of the status chip. Draft doubles as the status bar's warning dot; done as its "kept" dot.
- **Place** (`place`, dark `place-dark`): settings, in the cast. Not on the website.

### Named Rules
**The One Accent Rule.** There is one accent. It marks where you are and the one thing to do next. At most one filled accent button is visible in a view; everything else is bordered or quiet.

**The Chrome Shade Rule.** The ribbon, sidebars and bars are one tone darker than the page in both themes. The page is the lightest thing in light mode and the darkest in dark mode; sheets step one tone the other way.

**The Dots Only Rule.** Status colours appear as 8 px dots (7 px in the status bar and outline marks) and as a chip's border. They never colour text, fill a row or tint a background.

## Typography

**Display Font:** Literata (app: static 400, 400 italic, 600 from `@fontsource/literata`; site: `Literata Variable` with the opsz axis, so the headline takes the display cut)
**Body Font:** Inter 400, 500, 600 (bundled; `system-ui` fallback)
**Mono Font:** `ui-monospace`, Cascadia Mono, Consolas, Liberation Mono (file paths and the dialogue script only)

**Character:** Literata is the writer's voice and Inter is the app's. In the app, Inter runs the chrome at 13 px and Literata appears only where the writer's own words or names are: the manuscript, story and chapter titles, character names, the epigraph, the prompt. On the website the balance flips: Literata runs the whole page at 18 px and Inter is kept for controls, navigation, captions and the app window.

### Hierarchy
- **Display** (600, `clamp(42px, 7.2vw, 88px)`, 1.15, -0.012em): the website headline only, at most 13ch wide.
- **Headline** (600, `clamp(28px, 3.6vw, 38px)`, 1.15, -0.012em): website section headings, at most 24ch. Website h3 is 21 px.
- **Title** (600, 22 px, 1.25, -0.01em): page titles in the app (Outline, Cast, Safekeeping, the drawer). The library home is 26 px; the chapter title in the manuscript is 28 px; a modal title or empty-pane heading is 20 px; a card name or recent story is 15 to 16 px. All Literata 600.
- **Manuscript** (400, 18 px, 1.7, Literata): the chapter text on a 620 px measure, about 65 characters. Paragraphs indent 1.5em with no gap after the first. 17 px on a phone. Headings inside the manuscript are 1.45em and 1.2em; the scene break is the asterism glyph.
- **Reading** (400, 18 px, 1.6, Literata Variable): website running text. The lead is 20 px at 58ch; list text is 17 px; small print 15 px.
- **Body** (400, 13 px, 1.45, Inter): the app's chrome. Controls and sidebar content sit at 12.5 px, counts and captions at 11 to 12 px, hints and the status bar at 11.5 px, keyboard caps at 10.5 px. Numbers are tabular.
- **Label** (600, 10.5 px, 0.05em, uppercase, muted): a field's name above its value (POV, GOAL, TURN) in the right sidebar and in the website's app window. Tree section headings and the library home's section headings use the same voice at 11 to 11.5 px with 0.06em.

### Named Rules
**The Two Voices Rule.** Literata is for what the writer wrote or named. Inter is for what the app says. A string in Literata should be the writer's, or a line of the craft read to them; a control is never in Literata.

**The Measure Rule.** The manuscript is 620 px wide at 18 px. Website prose is capped at 58 to 62ch. Nothing the writer reads runs wider.

## Layout

The app is a fixed window grid: 40 px title bar, body, 24 px status bar. The body is four columns: a 44 px ribbon, a 260 px left sidebar, the pane, a 300 px right sidebar (440 px for the Dialogue panel). Either sidebar collapses to zero. Below 900 px the sidebars narrow to 230 and 280 px. Below 720 px the ribbon disappears into the left drawer, the left sidebar slides in from the edge at `min(86vw, 320px)` over a scrim, and the right sidebar becomes a bottom sheet at most 65 vh tall above the status bar. Focus mode hides every edge and dims all but the active block to 20 % opacity.

Pane content is left-aligned in a 1100 px max column with 24 to 30 px top padding and 32 to 40 px sides (14 to 16 px on a phone). The manuscript centres a 620 px sheet with 40 px top padding and 45 vh of air beneath, so the last line can sit mid-screen. Safekeeping and the drawer are narrower at 800 px.

Rhythm in the app is 2 / 4 / 6 / 8 / 10 / 12 / 14 / 16 / 24 px: 2 px between icon buttons, 4 to 6 px between rows and chips, 8 px for a stack, 12 px for a pad, 16 px for a status-bar gap. Rows are 26 px tall in the tree, 24 px for a chip-select, 28 to 30 px for an icon button. Nothing is larger than it needs to be.

The website is one column, 1080 px, with 20 px side padding and `margin: 0 auto`. Sections start with 72 px of space above and none below. The hero starts 56 px down. Above 1320 px the app window bleeds 120 px past the right edge of the column. Grids inside sections are two or three columns with 36 to 64 px gutters and collapse to one column at 860, 800 and 720 px. Nothing is centred.

## Elevation & Depth

Flat, with borders. Depth is a 1 px `line` border and a one-step tone change: page, sheet, chrome. A hovered row takes the next tone; a selected row takes the violet wash. Shadows exist for exactly the things that leave the surface.

### Shadow Vocabulary
- **Floating** (`box-shadow: 0 8px 24px rgb(43 39 35 / .14)`, dark `0 8px 24px rgb(0 0 0 / .5)`): the command palette, a menu, a modal, an outline row while it is being dragged, the mobile drawer while open.
- **Bottom sheet** (`box-shadow: 0 -8px 30px rgb(0 0 0 / .2)`): the right sidebar on a phone.
- **Ring** (`box-shadow: 0 0 0 2px var(--accent-soft)`): a focused input, a selected outline row or cast card. Paired with an accent border.
- **The app window** (`box-shadow: 0 30px 80px rgba(43, 39, 35, .16)`): the one object on the website that is lifted. Nothing else on the site has a shadow.
- **Side tab** (`box-shadow: 0 1px 0 var(--border)`): the hairline under the active Library / Tags / Search tab.

### Named Rules
**The Floats Only Rule.** A shadow means the element is over the page: a palette, a menu, a modal, a dragged row, a sheet. Cards, rows, inputs and buttons rest on the page with a border and no shadow.

## Shapes

Small, consistent radii; the smaller the control, the tighter the corner. 4 px for tree nodes, kbd caps, title-bar and format buttons, code; 5 px for inputs, icon buttons, side tabs, snapshots and the status chip; 6 px (`--radius`) for buttons, ribbon items, outline rows, palette rows and panels; 7 px for tabs (top corners only) and recent-story rows; 8 px for cards, menus and the website's buttons; 10 px for the palette and modals; 12 px for the website's app window; 14 px top corners for the phone's bottom sheet. Chips are pills (999 px); avatars and dots are circles.

Borders are always 1 px in `line`. Dashed borders mean an invitation: the "add a character" card, a drop target (2 px dashed accent), the hairline under a focused chapter title, the divider above a snapshot preview. Tabs are drawn as the page's own colour with a border on three sides and a -1 px bottom margin so they join the pane. Progress bars are 6 px tall, bordered, with an accent fill.

## Components

### Buttons
- **Shape:** gently rounded (6 px in the app, 8 px on the website).
- **Default:** sheet background, 1 px line border, ink text, Inter 500 at 12.5 px, 5 × 10 px padding. `small` is 3 × 8 px at 12 px; `big` is 9 × 16 px at 13.5 px. Site buttons are Inter 500 at 16 px with 12 × 20 px padding; `small` 8 × 14 px at 14 px.
- **Primary:** accent background, accent-ink text, accent border. One per view.
- **Quiet:** transparent background and border; shows the second tone on hover. Icon buttons are quiet by default, muted at rest, ink on hover.
- **Hover / Focus:** app buttons shift background to the second tone over 150 ms; the primary brightens 8 %. Site buttons lift 1 px and settle on press. Focus is a 2 px accent outline, offset 2 px (3 px on the site). Disabled is 45 % opacity.
- **Danger:** ink replaced with `danger`; never filled. Link buttons are accent text with no border.

### Chips
- **Style:** pill, second-tone background, 1 px line border, Inter 500 at 11 px, 1 × 8 px padding, optional 6 px status dot.
- **State:** `on` takes the violet wash and an accent border. A removable chip carries a muted × inside its padding.
- **Status chip:** a real `<select>` drawn as a 24 px chip with a 5 px radius; the border takes the chapter's status colour.

### Cards / Containers
- **Corner Style:** 8 px for cast cards, 6 px for outline rows and sidebar steps, 5 px for snapshots.
- **Background:** sheet on the page; the speaker card inside a sidebar step reverses to page.
- **Shadow Strategy:** none at rest. Selected: accent border plus the 2 px wash ring. Hover: border warms halfway to accent (`color-mix(in srgb, var(--accent) 50%, var(--border))`). Dragging: the floating shadow.
- **Border:** 1 px line. The add card is dashed and transparent.
- **Internal Padding:** 14 px for a cast card; 7 × 6 px for an outline row; 8 × 10 px for a sidebar step; 10 × 14 px for a drawer item.
- **Website:** no cards. Lists are separated by 1 px `line` rules (the craft list, the download list, the footer) or by space alone (jobs, refusals).

### Inputs / Fields
- **Style:** sheet background, 1 px line border, 5 px radius, 6 × 8 px padding, 12.5 px, full width. Placeholder in muted ink at full opacity.
- **Hover:** the border warms toward muted. **Focus:** accent border and the 2 px wash ring, no outline.
- **Quiet text (`GrowingText`):** a textarea with no border or background, growing to fit its content, that reveals the sheet and border on hover and the accent border on focus. Used for chapter plans, voice lines and summaries so a value reads as text under its label.
- **Label:** the 10.5 px uppercase label above, 3 px gap. In the speaker card the label sits left in a 72 px column, sentence case, 12 px.
- **Chapter title:** a borderless 28 px Literata input; focus shows a dashed hairline beneath.

### Navigation
- **Ribbon:** a 44 px chrome strip of 30 px square icon buttons (24-unit stroke icons at 1.6, drawn inline), 4 px apart, muted at rest, ink on hover, accent on the violet wash when current. Theme toggle at the bottom.
- **Tabs:** in the 40 px title bar, 34 px tall, 12.5 px, muted text, 7 px top corners. The active tab takes the page colour and a three-sided border. A chapter tab carries its status dot; a view tab carries its icon. Max 240 px with ellipsis.
- **Library tree:** 26 px rows, 4 px radius, 6 px gap, indented 16 px per level; folders and stories at 500, chapters with number, status dot and tabular word count; the active chapter on the violet wash; a dashed accent outline for a drop target. Row menus appear on hover or focus.
- **Right sidebar tabs:** 28 px icon buttons in a row under the title bar; sections are `<details>` with a 12 px 600 summary and a 1 px rule between.
- **Pane header:** 36 px, breadcrumbs in 12 px muted with the current item in ink 500, the formatting bar on the right with rare controls hidden under 640 px of pane width.
- **Website nav:** wordmark in Literata 600 at 22 px with a 20 px quill; links in Inter 15 px, ink, accent on hover; one small primary button on the right.
- **Mobile:** the ribbon folds into the left drawer; the right sidebar becomes a bottom sheet; the status bar keeps only the safekeeping line and words today.

### Command palette
A 560 px sheet at 10 px radius with the floating shadow, 72 px from the top (24 px on a phone) over a `rgb(20 16 30 / .32)` scrim. A 14 px borderless input, a list of 13 px rows at 6 px radius with the selected row on the violet wash, a footer of 11 px muted hints.

### Status bar
24 px of chrome, 11.5 px muted Inter: a 7 px dot (done or draft) before the safekeeping line, the backup age, then words today, the chapter count and two `kbd` caps on the right.

### The app window (website)
A 12 px-radius sheet with the lifted shadow, Inter at 13 px, reproducing the app's title bar, three-column body (240 / 1fr / 260) and status bar with the same tokens. The page inside it is Literata at 15.5 px with a 1.5 px accent caret. On a phone it keeps only the page.

## Do's and Don'ts

### Do:
- **Do** keep the app at 13 px Inter, 1 px `line` borders and 6 px radii. New controls take their radius from the scale above (4 / 5 / 6 / 8 / 10).
- **Do** set anything the writer wrote or named in Literata, and anything the app says in Inter.
- **Do** show status only as a dot or a chip border, with the five status tokens.
- **Do** make chrome one tone darker than the page and sheets one tone lighter; use a border and a tone step before reaching for a shadow.
- **Do** write labels in sentence case except the 10.5 px uppercase field label; count things in tabular numerals.
- **Do** keep the website to one left-aligned 1080 px column, two large objects, and prose at 58 to 62ch.
- **Do** bundle every font with the build; the app and site make no request to anyone else's server.
- **Do** read copy aloud before shipping it: writer, never user; "your story", never "your content".

### Don't:
- **Don't** add a second accent or tint a background with a status colour.
- **Don't** put a shadow on a resting card, row, button or input.
- **Don't** centre the website or put its content in cards, icon tiles, eyebrow chips, numbered labels or gradients.
- **Don't** set a control, menu or button in Literata, or set the manuscript in Inter.
- **Don't** widen the manuscript past 620 px or the website's prose past 62ch.
- **Don't** count streaks, show scores or use a colour to say "behind"; progress is a 6 px bar and a plain sentence.

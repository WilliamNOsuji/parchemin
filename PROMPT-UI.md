# Improving Parchemin's UI and UX

The brief for a pass on the app's interface, for a person or an agent. Use it after `PROMPT.md` (which carries the code
conventions) or on its own, and name the screen or the symptom under the last heading. It is built on a few principles:
a role and a reader; context pointed to rather than restated; "better" defined in checkable terms; constraints stated as
targets; a method whose every step ends on a done-condition; an example of a finding and of a non-finding; and a fixed
report shape, so one pass can be compared with the next.

---

You are a product designer and front-end engineer improving the interface of Parchemin, a calm, local-first writing app.
The person on the other side is a writer alone at a desk, with a book that matters to them and an hour before work.
Every improvement is measured on that person: how fast they reach their words, how little they have to read or decide on
the way, and whether the room stays calm while they are in it.

## Read first

| Read | For |
|---|---|
| `design/parchemin-desktop.html` | The design. Open it in a browser: ten screens of the app in a 1280 × 800 window, with the design notes under each. Better means closer to this, never away from it |
| `DESIGN.md` | The design system as shipped: tokens, type, the chrome-shade and two-voices rules, the do and don't lists |
| `PHILOSOPHY.md` | The six questions, "How the belief reaches the writer", and what Parchemin will not do |
| `README.md` | What every screen does today |

Reach for these when the pass touches them:

- `research.md` section 7 (rejected ideas) before adding anything that counts, scores, nudges or rewards; sections 6
  and 11 for what writers asked for, in their own words.
- `src/styles.css` for the tokens and the shell's rules; `src/commands.ts` for the words every action uses.
- The Impeccable skill, installed project-locally (`.claude/skills/impeccable/SKILL.md`): `critique` for a UX review
  of one screen, `audit` for the technical checks (accessibility, performance, responsive), `clarify` for copy,
  `layout` for spacing and hierarchy, `harden` for states and edge cases, `adapt` for widths, `onboard` for first-run
  and empty states, `quieter` when something shouts, `polish` for the finish, and `document` to bring `DESIGN.md` up to
  date afterwards. One command per job; its reference file is the method for that job.

## What better means here

Refinement, never redesign: the look is settled, and a pass makes the shipped screens truer to the mockup and to the
rules. Better, in terms that can be checked:

- **The words are first.** On the Write screen nothing competes with the sheet: Literata at 18 px on a 620 px measure,
  and every panel folds away to nothing.
- **Fewer steps to the thing the writer came for.** Count them: clicks and keys from launch to typing in yesterday's
  chapter, from a chapter to its plan, from anywhere to a backup. A pass that lowers a count has worked.
- **Less to read.** A screen says what it is and the one thing to do next. One primary button per view; labels are the
  nouns the writer already uses (chapter, story, cast, drawer); a sentence is there because a writer needs it.
- **Plain facts, and the judgement stays the writer's.** Counts come from the text. There is no score, grade or
  "behind"; a quiet day is quiet; a finish date is a kindness.
- **Calm density.** 13 px UI, 1 px lines, 6 px radii, one accent on the thing you are on and the one thing to do next,
  chrome one tone darker than the page. Depth is a border and a tone step. Status colours are 8 px dots with their
  name in the title.
- **The two voices.** Literata for what the writer wrote or named; Inter for what the app says.
- **Every width and every hand.** Phone width (400 px) works through the drawer; every action is in the palette; a
  2 px accent focus ring; reduced motion respected; `role="status"` on what changes by itself; 4.5:1 on all text.
- **States are designed, not left over.** An empty library, the first chapter, a story of forty chapters, a title of
  sixty characters, a paragraph of two thousand words, a save that failed, no backup yet, offline. Each looks intended.
- **Consistency over novelty.** The same control for the same job everywhere, and the button, the palette entry and
  the hint say the same words.

## The method

0. **Scope.** From the task, name the screen or screens, the writer it is for, and what good looks like. If two
   readings would lead to different work, ask; otherwise choose the reading a careful colleague would. Done when the
   scope is one sentence.
1. **Look before judging.** Run the app (`npm run dev`), restore `design/example-library.json` from the Safekeeping
   page, and screenshot the screen at 1280 × 800 and at 400 px, in light and in dark. Open the same screen in the
   mockup beside it. Done when the before-screenshots exist and the mockup's version has been looked at.
2. **Walk it as four writers.** A first-time writer with an empty library; a returning writer picking up chapter 7 of
   the example novel; a writer on a phone; a writer on the keyboard alone. For each: what they came to do, the steps
   it takes, and what they read on the way. Done when each path is written as numbered steps with a count.
3. **Name the friction.** One finding per thing, with five fields: where (screen and element); what the writer
   experiences; the rule it breaks, cited (`DESIGN.md`, `PHILOSOPHY.md`, the mockup, or a step from the walk);
   severity (blocks, slows, jars, nit); evidence (a screenshot or a measure). A finding is the writer's experience,
   never a preference. Rank by severity and keep the top ten. Done when every finding has all five fields.
4. **Decide.** Each finding passes the six questions. Prefer removing to adding, the mockup's answer to a new one, a
   token to a new value, the control that exists to a new one. One change per finding, and no new feature inside a
   pass. Done when the plan lists each change with the files it touches, and each finding left alone with why.
5. **Change.** The smallest diff that fixes the finding, with tokens from `src/styles.css`, copy read aloud, the
   keyboard path kept, phone width kept, dark kept. Done when `npm run build` passes and Impeccable's hook reports
   nothing new.
6. **Verify against the before.** After-screenshots in the same four views; the four walks again with their counts;
   contrast on any changed text; the keyboard walk; reduced motion. One round of fixes, one confirming round, then
   stop. Done when every finding is fixed with evidence, or left with a reason.
7. **Record.** `README.md` for a changed behaviour; `DESIGN.md` for a changed rule or token (`/impeccable document`
   where the skill is installed). Done when the documents describe the app as it now is.

## Examples

A finding, in the shape to use:

> **Library tree › story row.** At the sidebar's default width the title reads "The Lighthouse Ke…" with its word
> count beside it, while the mockup shows the whole title on the same 260 px. This is the list the writer scans more
> than any other. Breaks: the mockup wins (`design/parchemin-desktop.html`, Library). Severity: slows. Evidence: the
> before-screenshot of the Library beside the mockup's Library screen. Fix: match the mockup's row metrics (padding,
> the count's width, the size) so a thirty-character title fits, checked with the example library's longest title.

A copy finding is written as before and after, with the rule:

> **Safekeeping › after a backup.** Before: "Your content was saved successfully!" After: "Saved
> parchemin-backup-2026-10-13-1652.json." Rule: "your story", never "your content"; a plain fact names the file; the
> exclamation mark is a poster's, not a friend's.

A non-finding, so the line is clear:

> **Library › today's words.** The seven bars show quiet days as quiet, and nothing counts a streak. A reviewer used to
> dashboards would ask for a streak counter or a "3 days without writing" line. That is not a finding: `PHILOSOPHY.md`
> and `research.md` section 7 reject it. The bars are the design.

## The report

In this shape, every time:

1. **Scope**, in one sentence, and the four walks' step counts before and after.
2. **Findings**: a table with where, what the writer experiences, the rule, the severity and the outcome.
3. **Changes**, each with its before and after screenshot and the files touched.
4. **Left as is**, each with its reason.
5. **Questions for the team**: decisions that are theirs, including any of the mockup's open questions the pass met.

Say plainly what was not verified.

## The task

<!-- Screen or symptom: …
     Who it is for: …
     What good looks like, in one sentence: …
     Already decided: … -->

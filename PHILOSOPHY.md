# The Philosophy of Parchemin

This document is the reason the app exists and the test every feature has to pass. Read it before adding, changing or
removing anything. It was synthesized from the material in `Philosophy of Parchemin/` and from the decisions made while
building the app. It was updated on 2026-10-04 with the team's decisions on AI, sync and open source, taken after the
round 2 research (`research.md`, section 11.6).

## Mission

**Help people finish the stories only they can write, and leave them believing that writing matters.**

Parchemin is a place to start, a place to keep going, and a place to finish. It teaches while you write, without
lecturing and without ever writing your story for you.

## What we believe

### 1. Writing changes the world.
Ideas are written down before they are built. Pamphlets, essays and novels have moved nations, started movements and
given people the words for things they could not say. We hold this as a belief, not a theorem, and we say it
plainly and modestly. We do not need to overstate history to make the point. Words matter, and the person at the desk
is part of that long line.

### 2. Everyone is a storyteller.
Most people are not missing talent. They are missing a system, a quiet room and permission. Parchemin supplies the
first two and says the third out loud. We never talk about "users" in the app. We talk to writers.

### 3. Writing is how we learn to see, and to understand each other.
Finding the exact word for something beautiful means looking at it properly. Writing a character who is not you means
understanding someone who is not you. Writing is practice in attention, empathy and persuasion, and those are worth
having even if a book is never published.

### 4. Structure is a skeleton, not a cage.
A plan does not take creativity away. It tells you what has to happen, never how. We offer structure because a clear
frame makes a finished book likely, and we make every piece of it optional, editable and easy to throw away.

### 5. Finishing is a skill, and it is learnable.
Short stories, novellas and novels are the same craft at different lengths. A chapter is about the size of a short
story. Fifteen chapters make a novella and thirty make a novel, and one chapter a day gets you there. We make the
next small step obvious, and we treat a finish date as a kindness, not a threat.

### 6. The writer owns the work.
Everything lives on the writer's device. It works offline, exports to open formats, and can be backed up and restored
as one file. We do not mine, sell or hold hostage what someone writes, and it never trains a model for anyone else.
Sync between a writer's devices and the AI guide are both optional and off by default, and both can run on a server
the writer controls. Parchemin is open source and funded by the people who care about it, so the tool can outlive any one of us.

### 7. Craft can be taught, and the answers still belong to the writer.
We give people questions, patterns and checks drawn from the best writing teachers. We never produce the story. The
prompts are suggestions only, and so is anything the AI guide offers. The story is never written for you.

### 8. New tools belong to writers too, on writers' terms.
We believe AI can help writers see and organize their own work, and that it has to be brought into creative work
ethically. In Parchemin it is a guide and an organizer, never the author. It is optional, off by default and limited
in what it can generate. It runs entirely on a server the writer controls. It can adapt to the writer's own style
there, and what it learns stays with them. The rules are in [AI-POLICY.md](AI-POLICY.md).

## How the belief reaches the writer

We do not preach. The mindset is carried by small, repeated, honest things, so that it becomes the air in the room:

- **Language.** Writer, never user. "Your story", never "your content". "A blank page is an invitation, not a debt."
- **Presence.** A line on why we write shows on the home screen. It is short, true, and different on each visit.
- **Gentleness about the habit.** We show words written, never shame for words not written. A streak that survives an
  unfinished day. No guilt notifications, no lost-streak panic, no leaderboards.
- **Celebration of size.** Milestones honor small wins: the first word, a thousand words, a chapter.
- **Defaults that assume you will finish.** New stories offer structure and a finish line. Chapters have goals and
  turns. The outline audit reads the whole book back to you.
- **Calm.** Soft colors, generous space, focus mode, no ads, no noise. A serious thing deserves a quiet room.
- **Honesty about the tools.** We say plainly what the AI can and cannot do, how the app is built, how it is paid for,
  and what happens to a writer's work if the project stops.

The test for any piece of copy: would it sound right if a writer read it out loud to a friend? If it sounds like a
marketing line or a motivational poster, rewrite it.

## The craft we teach

The app builds in one coherent method, so writers learn it by using it. It is assembled from free teaching material and
well-known craft books. Credit goes to Jessica Brody (*Save the Cat Writes a Novel*), John Truby (*The Anatomy of Story*)
and Robert McKee (*Dialogue*), to the screenplays of Aaron Sorkin and Quentin Tarantino, and to the teacher whose
video series started it and read those screenplays for us.

1. **Idea.** A story is a what-if. A person, what they want, and the wall in the way. The wall should be tied to the
   want. If nothing goes wrong, it is a situation, not a story.
2. **Hero.** A hero pursues something and has a flaw that touches their whole life. The hero wants one thing and needs
   another, and the story lives in the gap. The flaw hurts them and also hurts someone else. Others see it. They do not.
   The change is proven by a deed, not by saying "I learned something".
3. **Plot.** Fifteen beats as a skeleton. Beats are not chapters. Several beats can share a chapter, and one beat can
   span many.
4. **Voice.** A voice is a want, a fear and a way of seeing other people, not an accent. Cast supporting characters
   against the hero so every scene has friction. A main voice plus a dash of another, and the dash drops away under
   pressure.
5. **Cast.** Characters need incompatible wants, not opposite ones. Each also needs a function: something they can do
   that nobody else in the book can. Delete anyone who has a voice and a want but no function.
6. **Setting.** Do not ask what a room looks like. Ask what makes it hard. A setting opposes, reveals, supplies props
   and sets mood, and mood comes last. Every setting ends with a few objects someone can pick up, fight over or hide
   behind.
7. **Chapters.** Every chapter has a goal, a conflict and a turn. Read across to check a chapter. Read down to check the
   book. Know the last line before you write the first.
8. **Dialogue.** Nobody says what they mean. In each chapter, each speaker wants something incompatible, and every line
   is a tactic you could name with an *-ing* verb. What they won't say, and what they can't, goes into an object in the
   room. Make it an argument, keep the surface small and the real subject unnamed, and end on a picture. Draft it fast
   as a script, then cover the names: a stranger should still know who is speaking. Then read it aloud.
9. **Habit.** A chapter a day. Compress travel and anything whose outcome is certain. Start the next day with a
   sentence already waiting.

## What Parchemin will not do

- **Write the story for the writer.** No generated chapters, no "fix my prose" button that replaces the voice. The AI
  guide is labeled, off by default and limited. It never writes the story. Its suggestions reach the manuscript only
  if the writer types them.
- **Harvest the work.** No training on writers' text for anyone but the writer, no analytics on what they write, no
  selling of data. Any model Parchemin ships is trained without writers' data, and we name it and what it was trained
  on.
- **Gamify guilt.** No manipulative streaks, shame mechanics or dark patterns. Encouragement must be true.
- **Lock the writer in.** Open export formats, whole-library backup, and a clean way out. The app keeps working with
  no account, no server and no AI.
- **Make structure mandatory.** Every craft tool can be ignored. Blank page first.
- **Overclaim.** We say what we believe, and we say it as a belief. We do not invent statistics or inflate history.

## How to decide

When a feature idea comes up, run it through these questions. A "no" to the first three is a reason to stop.

1. Does it help a writer start, continue or finish a story that is theirs?
2. Does the writer stay in control of the words, the data and the structure?
3. Is it honest, with no manufactured urgency, no inflated claims, and no guilt?
4. Does it teach something by being used, rather than by explaining itself?
5. Does it keep the room calm?
6. Does it work offline, on this device, with no account? (Optional sync and the optional AI guide may need more. The
   app itself never does.)

## Where the philosophy lives in the code

| Belief | Where it shows up |
|---|---|
| Writing matters | `src/craft/why.ts` (epigraphs, milestones), `src/components/Why.tsx` |
| Gentle habit | `src/components/Why.tsx` (today's words, streak), `logWords` in `src/db.ts` |
| Finishing is learnable | Finish line in `src/components/OutlineTab.tsx`, `pace` in `src/craft/audit.ts` |
| Craft without a cage | `src/craft/` (voices, hero check, audit, dialogue), optional chapter plan, the Dialogue panel in `src/components/DialoguePanel.tsx` |
| The writer owns the work | Local-first IndexedDB in `src/db.ts`, backup in `src/backup.ts`, safekeeping in `src/safekeeping.ts`, exports in `src/export.ts`, fonts bundled in `src/main.tsx`, `LICENSE` (AGPL-3.0-or-later) |
| Safe to cut | The drawer: `setAside*` and `putBack` in `src/db.ts`, `src/components/DrawerSection.tsx` |
| The story is never written for you | Prompts in `src/prompts.ts`; the AI guide's limits in `AI-POLICY.md` |

## Roadmap that follows from this

Agreed on 2026-10-04. The full list and each decision are in `research.md`, section 11.6. The groups are not in a set
order yet.

1. **Trust and safety.** A plain "Your words" page, an open-source licence, browser writing suggestions switched off in
   the editor with a help note, a human-voice pass on all public text, visible backups, a performance check on long
   books, and an install that a non-technical writer finds easy.
   Done on 2026-10-09: the licence (AGPL-3.0-or-later), the writing-suggestions switch with its help note, and visible
   backups (the safekeeping panel).
2. **Getting work in and out.** Import (.docx, .md, .txt) and export (manuscript .docx, "Copy for AO3", poem-safe).
3. **Between devices.** A "move my library" flow, then optional sync across phone, laptop and desktop that writers can
   host themselves, with a very simple setup guide. How sync works is still open.
4. **Writing support.** A rhythm view with other units and a CSV of daily counts, read-aloud, a notes pane beside the
   draft, a private challenge mode, and a ready-to-post queue.
5. **The AI guide.** Self-hosted and optional, under `AI-POLICY.md`.

Still planned from before: setting sheets (obstacle-first, with a prop list), a cast grid view, and chapter guides.
Done on 2026-10-09: the dialogue test where you cover the names, as part of the Dialogue panel (`research/notes/14-dialogue.md`). Not now: a first-run timing test and French-first work. Parked: an animated
poem mode, an idea to try with poets first.

## One line to remember

*Every person is a storyteller. Our job is to make it easy to begin, and safe to finish.*

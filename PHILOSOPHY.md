# The Philosophy of Parchemin

This document is the reason the app exists and the test every feature has to pass. Read it before adding, changing or
removing anything. It was synthesized from the material in `Philosophy of Parchemin/` and from the decisions made while
building the app.

## Mission

**Help people finish the stories only they can write, and leave them believing that writing matters.**

Parchemin is a place to start, a place to keep going, and a place to finish. It teaches while you write, without
lecturing and without ever writing for you.

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
as one file. We do not mine, sell or hold hostage what someone writes. Any future sync or AI help is optional and
opt-in, and never the default.

### 7. Craft can be taught, and the answers still belong to the writer.
We give people questions, patterns and checks drawn from the best writing teachers. We never produce the story. The
prompts are suggestions only. Nothing is written for you.

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

The test for any piece of copy: would it sound right if a writer read it out loud to a friend? If it sounds like a
marketing line or a motivational poster, rewrite it.

## The craft we teach

The app builds in one coherent method, so writers learn it by using it. It is assembled from free teaching material and
well-known craft books. Credit goes to Jessica Brody (*Save the Cat Writes a Novel*), John Truby (*The Anatomy of Story*)
and Robert McKee (*Dialogue*), and to the teacher whose video series started it.

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
8. **Dialogue.** Characters argue toward different wants with different tactics, and nobody says what they fear. If you
   cover the names, a stranger should still know who is speaking.
9. **Habit.** A chapter a day. Compress travel and anything whose outcome is certain. Start the next day with a
   sentence already waiting.

## What Parchemin will not do

- **Write the story for the writer.** No generated chapters, no "fix my prose" button that replaces the voice. If an AI
  helper ever exists, it is opt-in, clearly labeled, and a tool for questions and critique, not a ghostwriter.
- **Harvest the work.** No training on writers' text, no analytics on what they write, no selling of data.
- **Gamify guilt.** No manipulative streaks, shame mechanics or dark patterns. Encouragement must be true.
- **Lock the writer in.** Open export formats, whole-library backup, and a clean way out.
- **Make structure mandatory.** Every craft tool can be ignored. Blank page first.
- **Overclaim.** We say what we believe, and we say it as a belief. We do not invent statistics or inflate history.

## How to decide

When a feature idea comes up, run it through these questions. A "no" to the first three is a reason to stop.

1. Does it help a writer start, continue or finish a story that is theirs?
2. Does the writer stay in control of the words, the data and the structure?
3. Is it honest, with no manufactured urgency, no inflated claims, and no guilt?
4. Does it teach something by being used, rather than by explaining itself?
5. Does it keep the room calm?
6. Does it work offline, on this device, with no account?

## Where the philosophy lives in the code

| Belief | Where it shows up |
|---|---|
| Writing matters | `src/craft/why.ts` (epigraphs, milestones), `src/components/Why.tsx` |
| Gentle habit | `src/components/Why.tsx` (today's words, streak), `logWords` in `src/db.ts` |
| Finishing is learnable | Finish line in `src/components/OutlineTab.tsx`, `pace` in `src/craft/audit.ts` |
| Craft without a cage | `src/craft/` (voices, hero check, audit), optional chapter plan |
| The writer owns the work | Local-first IndexedDB in `src/db.ts`, backup in `src/backup.ts`, exports in `src/export.ts` |
| Nothing is written for you | Prompts in `src/prompts.ts` |

## Roadmap that follows from this

Next, in order of how directly they serve the mission: setting sheets (obstacle-first, with a prop list), a cast grid
view, a dialogue test where you cover the names, and chapter guides. After that, only if they pass the tests above:
optional sync and an opt-in assistant.

## One line to remember

*Every person is a storyteller. Our job is to make it easy to begin, and safe to finish.*

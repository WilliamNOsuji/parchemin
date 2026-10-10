# Research note 14: Dialogue (video series, part 8)

Source: part eight of the video series that started Parchemin's craft method. Date: 2026-10-09.

## How to read this note

- **Source.** One teacher's 26-minute lesson, pasted by the team. The raw transcript is in `research/sources/video-series-08-dialogue.md` (git-ignored, third-party). Everything below is paraphrase unless quoted.
- **What the teacher drew on.** Robert McKee's *Dialogue* (2016), and the teacher's own reading of screenplays by Aaron Sorkin and Quentin Tarantino. None of these were read directly for this note. Attributions are the teacher's.
- **Evidence quality: low to medium.** This is craft teaching, not research. It is one practitioner's synthesis, illustrated with his own novel. It agrees with what notes 04 and 05 found independently (see section 3), and with step 8 of "The craft we teach" in `PHILOSOPHY.md`. Nothing here should be claimed in the app as proven. The checks it suggests are framed as questions.

---

## 1. Summary

1. **First rule: nobody says what they mean.** Dialogue fails when characters say exactly how they feel, when nobody wants anything (they swap information), or when everyone sounds the same.
2. **Dialogue is the last step of the method, and most of it is already prepared.** The chapter plan gives the goal, obstacles, turn and props. The voice cards give each character's want, fear and tactic. The cast grid gives the reason two people clash. The setting sheet gives the room that makes it hard.
3. **From McKee, the architecture.** In each chapter, each character wants something for this scene only, in one sentence, and the wants are incompatible. A tactic is what a line does, not what it says, and naming it with a verb ending in *-ing* (goading, deflecting, warning, credentialing, appeasing, testing) turns each line into an action aimed at someone. There are three levels: the said, the unsaid (thought and withheld), and the unsayable (what they don't know about themselves, or could never say aloud). A "third thing", usually an object, carries what can't be said. A scene is a sequence of beats, each a move and a response, and it must end somewhere different from where it started: a named value at the open, a different one at the close.
4. **From Sorkin, the rhythm.** A conversation is an argument or a negotiation. Most flat scenes are fixed by giving someone a reason to object to the last line. Answer a question with a question, sometimes. People interrupt and trail off. Real numbers and brand names beat vague words. Put the silence before the line that matters. End on a picture (a door, an object set down, a hand not taken), never on a line that explains.
5. **From Tarantino, the hidden stakes.** The engine is asymmetry: someone in the room knows more, often the reader. The surface talk is almost insultingly trivial, and the real subject is never named. Dread comes from calm and politeness under pressure, not anger. Delay something the reader knows or suspects is coming. Teasing between people who love each other is intimacy and a weapon at once, and it builds a long history in a few lines. Don't copy the surface (profanity, pop culture).
6. **On the page.** Use "said" and "asked"; they disappear. Use other tags rarely. Replace adverbs with what the body does. New speaker, new paragraph. A line alone carries more weight than one buried in a paragraph. Long paragraphs slow the reader; a run of short ones speeds them up. Use dashes and ellipses. No phonetic spelling of accents. Trust the reader.
7. **The process.** Draft the chapter's dialogue first, as a script, as fast as possible, in one sitting, with only a little action. The speed produces interruptions and jokes nobody could plan. Then two passes: (1) cover the names, and ask whether a stranger could tell who is speaking; (2) read it aloud, or record it and listen, and fix whatever you stumble on.
8. **Six ways it goes wrong.** Characters are too articulate (real people repeat, cut each other off, say the wrong thing). Dialogue explains the plot. Tarantino is copied. Pop culture is thrown in for its own sake. Nobody pushes back.

The teacher's example: three old friends at lunch argue about a lettuce recall, calories and chicken nuggets. Underneath, they are lonely widowers with nowhere else to be on Thursday, and nobody says so. One of them refuses to admit that the repetitive phone calls from a friend with dementia are the best part of his day.

---

## 2. What the lesson asks of a writing tool

| The lesson needs | What Parchemin had before this note |
|---|---|
| Per-chapter goal, conflict, turn, prop, last line | Yes: the chapter plan in `src/components/OutlineTab.tsx` |
| Per-character want, fear, way of seeing others, tactic | Yes: voice cards in `src/craft/voices.ts`, character craft fields |
| Each speaker's want for *this* chapter | Only one "wants in this scene" field per character, not per chapter |
| The unsaid and the unsayable, per speaker, per chapter | No |
| The third thing, and the named value at open and close | Partly: the prop and the turn are free text in the chapter plan |
| What the scene is secretly about; who knows more | No |
| A place to draft dialogue as a fast script, outside the manuscript | No |
| Lines labelled with their tactic, read as a chain of beats | No (the voice card names one tactic per voice) |
| Cover-the-names test | Planned since v1 (roadmap; note 04 I5; note 05 §5.8), not built |
| Read-aloud pass | Planned (roadmap group 4; research §6 Tier 1 #6), not built |
| Checklists (McKee, Sorkin, prose) | Some dialogue prompts already echo McKee (`src/prompts.ts`) |
| Cast grid, setting sheets | Planned (roadmap), not built |

## 3. Agreement with the earlier notes

- **Note 04, finding 3:** "characters all sound alike" is mainly a motivation problem, not a vocabulary problem, and the no-names test is the common diagnostic. The lesson says the same: unique characters come from how they converse, not from quirky words.
- **Note 04 I5 and note 05 §5.8:** the voice-blind test. Strip names and tags, the writer assigns a speaker to each line, then reveal. **No scoring, no judgments.**
- **Note 05 §2.11 and open question 12:** dialogue checks are not automatable beyond the writer's own tagging. The lesson's tactic labels are exactly that tagging, done by the writer.
- **Note 12:** a warm-up scratchpad that is never part of the manuscript, and constraint prompts such as "only dialogue". The script draft is that scratchpad, for one chapter.
- **Research §7 (rejects):** no scores or verdicts on creative work, nothing that writes or rewrites for the writer. Any check below reports facts the writer can verify and asks a question.

## 4. Ideas, and what was built

**Built on 2026-10-09: a Dialogue panel in the Write tab** (`src/components/DialoguePanel.tsx`, `src/craft/dialogue.ts`). Everything is optional, stored with the chapter, and backed up with it. It follows the lesson's order.

1. **Who wants what.** Speakers for this chapter, picked from the cast or typed. Each gets one sentence of want for this chapter, what they won't say, and what they can't say. The voice card's want, fear and tactic show as hints. For the chapter: the thing in the room (hint: the chapter's prop), what it opens on and closes on (hint: the turn), what it is really about (never said), and who knows more.
2. **Draft it as a script.** A plain text box, outside the manuscript. `NAME: line`, or `NAME (tactic): line`, or the screenplay layout (name on its own line in capitals, an optional `(tactic)` line, then the speech). The panel reads the tactics back as a chain of beats ("Arty roasting → Bob defending → …"). Script words count toward the day's words, under the same paste rule as the editor, but never toward the chapter's word count.
3. **Cover the names.** From the script, or from the chapter's text (speech in quotation marks; one line per paragraph, so the tags fall away). The writer, or better a friend, picks who they think says each line, then reveals. The script shows the real speaker; the chapter text shows the whole paragraph, because Parchemin cannot know who speaks in prose. No total, no score.
4. **Dialogue pass.** The lesson's checklists as the writer's own ticks, kept with the chapter, grouped as McKee, Sorkin, Tarantino, on the page, and the two read-through passes. Beside some items, plain facts from the text: lines that state a feeling out loud, questions answered with questions, lines that break off or trail away, lines with numbers, tags other than said or asked, "said softly"-style adverbs, phonetic spellings, words from the "really about" note that appear in the dialogue, and the chapter's last paragraph with the question "Does it end on a picture?". The tag, adverb, feeling and phonetic checks read English only, and the panel says so.

**Not built, still worth doing**

- **Read-aloud** (already agreed, §11.6 #11). Browser voices can be remote (some send text to a server), so it must use local voices only and hide itself when there are none. The team suggested a self-hosted voice model as an option. Until then, the checklist asks the writer to read aloud or record themselves.
- **Cast grid** and **setting sheets** (already on the roadmap). The lesson leans on both for "why these two argue" and "what makes the room hard". When they exist, the Dialogue panel should show the relevant rows as hints.
- **Per-chapter speakers in the outline.** The outline audit could notice chapters with a single speaker or speakers with no want. Only as a gap, never a verdict.
- **Script to chapter.** A button that copies the script into the chapter as one paragraph per speech, names removed, ready to rewrite as prose. This moves the writer's own words; it does not write any. Wait for demand.

## 5. Rejected

- Suggesting tactics, subtext or lines, or rewriting dialogue (research §7, first bullet).
- A dialogue score, "too many tags" warnings, or any grade (research §7, second bullet). The facts are counts with the lines they came from.
- Guessing who speaks in prose and presenting it as the answer. Attribution heuristics fail on exactly the tag-light dialogue the lesson recommends.
- Flagging profanity or pop-culture references. The lesson warns against copying them, but they are the writer's choice.

## 6. Open questions

- The writer guessing their own lines is biased: they remember who said what. The panel suggests handing it to someone else. Interviews could ask whether writers would.
- The English-only checks need equivalents for other languages, starting with French (dash dialogue, « guillemets », *dit-il*). Quote detection already handles «», „“ and 「」, but not dash dialogue.
- Script-first drafting suits dialogue-heavy chapters. Whether it suits quiet, interior chapters is not covered by the lesson.
- The lesson's sources were not read directly: McKee's *Dialogue*, and Sorkin's and Tarantino's screenplays. A human pass on McKee's book would firm up section 1.3.

## 7. Sources

| Source | Quality |
|---|---|
| The video series, part 8 (transcript in `research/sources/`) | Practitioner teaching; low to medium |
| Robert McKee, *Dialogue: The Art of Verbal Action for Page, Stage, and Screen* (Twelve, 2016), as summarised in the video | Well-known craft book; not read for this note |
| Aaron Sorkin and Quentin Tarantino screenplays (*The Social Network*, *Pulp Fiction*), as read by the teacher | Primary texts; not read for this note |
| Notes 04, 05 and 12 in this folder | See each note |

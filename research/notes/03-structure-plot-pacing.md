# 03. Structure, plot and pacing for long fiction

Researcher 3 of 12. Scope: the saggy middle, plot holes, pacing, plotters vs discovery writers, outlining methods and their documented weaknesses, scene craft, multiple POV and subplots, restructuring, timelines, visualization, novella and serial structure.

Method note and honesty about limits. About 25 web searches and 30 fetches were made. The shared WebSearch budget ran out partway through, so four planned topics got thin or no direct sourcing: multi-POV and subplot craft, timeline and chronology tracking, web-serial structure, and novella craft. These are flagged in section 5. Almost all writer "evidence" here is craft-blog and anecdote. Direct research evidence is limited to one cognitive-writing line (Galbraith) and one computational study (Reagan et al.), and both are of limited relevance. Vendor blogs (Inkshift, Scribeist, Dabble, Storyflow) are marked as biased. WebFetch returns model-written summaries of pages, so quotes were taken from those summaries and are marked "as reported by fetch"; verify wording before any quote is published.

---

## 1. Executive summary

1. The saggy middle is the most commonly named long-fiction problem, and sources converge on the same diagnosis: the middle is about half the book, the opening's novelty is spent, the ending is far away, and templates give it the least guidance (Save the Cat gives it two big beats). Common causes named: passive protagonist, the same conflict repeated without escalation, no midpoint that changes the story, subplots disconnected from the main line.
2. Planning vs discovery is a question of where you pay, not whether you pay. Pantsers pay in revision (restructuring, cutting) and in "what happens next?" stalls. Plotters pay in lost enthusiasm, drafts that stop surprising them, and plans that don't survive contact with the draft. Many writers are hybrids, and many are converts in both directions (Booktrib accounts).
3. Every popular template is criticized for the same thing: it describes what many finished stories look like, then gets sold as a recipe for what to write. Critics say beats are vague where they matter (Mythcreants on "Fun and Games"), prescriptive where they should not be (percent and page numbers), and silent on how. Defenders (Jami Gold, Story Grid's own Foolscap article) say: use it as form, not formula, and put the originality in the details.
4. Structure is culturally narrow. Three-act and Hero's Journey are Western and heavily Hollywood-shaped. The Hero's Journey has scholarly critique (Toelken, Dundes) and gender critique. Kishotenketsu and Le Guin's carrier-bag essay offer real alternatives, but kishotenketsu is widely mislabeled "no conflict" (even sympathetic explainers say long works need obstacles).
5. Scene-level craft has a durable core and a contested shell. The durable core: every scene needs a want, opposition and a change (Swain's goal/conflict/disaster; Story Grid's five commandments; Sanderson's "every scene shows progress"). The contested shell: rigid Scene vs Sequel as separate boxes (critique at Talkwards).
6. Reverse outlining after drafting is the recommended remedy for discovery writers and for any draft that has drifted. Documented practice exists (Chelsea Abdullah: 3 to 5 bullets per chapter; it exposed two POV characters to cut and chapters to merge). The tools writers actually use make this clumsy.
7. Outlining tools are criticized on friction, not on features: steep learning curves (Scrivener), data loss, slowdowns and no way to change template mid-project (Plottr, Capterra reviews), the plan living in a separate app from the draft and being abandoned around chapter 12 (Storyflow, vendor claim), no good parallel-subplot view in the corkboard, and few tools support large-scale reordering.
8. Writers who quit mid-draft describe loss of connection with the story and a gap between the imagined book and the real draft, more than they describe lack of a plan. Advice from several writers is to switch projects or diagnose rather than force it, with a caveat against abandoning everything.
9. Parchemin already has the right foundations (optional chapter plan with goal/conflict/turn/POV/setting, an audit that reads runs of the same POV, place, conflict or turn, and a finish line). The biggest unbuilt, philosophy-compatible wins are: a reverse-outline mode that works from the writer's own chapters, a "map not cage" template framing (beats can be re-labeled, re-ordered, dropped), a middle-specific diagnostic that asks questions rather than scoring, and a threads/subplot view.
10. Anything that generates plot, fills beats, or "fixes" pacing for the writer is a reject under PHILOSOPHY.md. Storyflow's own text warns that AI plot generation yields "the most probable next event" (as reported by fetch; vendor).

---

## 2. Problems

Confidence key: high = several independent sources or a primary source; medium = a few sources or one strong one; low = single anecdote or vendor claim.

### P1. The saggy middle (Act Two sag)
- What: Momentum stalls around the middle. Readers skim, writers stall. Events keep happening but nothing changes.
- Who: Novelists above all; novella writers less; short-story writers rarely. Pantsers lose direction; plotters often have thin plans for the middle because templates give it few beats.
- Evidence: Dowling says the middle is about 50% of a novel and that Save the Cat gives it two major beats of roughly 20% each (https://josephjdowling.substack.com/p/how-to-navigate-the-wastelands-of). E.M. Welsh: second act lacks the "clear direction" of Act One and Three; suggests side characters, more problems, internal conflict and splitting Act Two into smaller segments (https://www.emwelsh.com/blog/writing-act-two). Writer's Sanctuary: more problems do not create momentum "if they lack meaningful change"; proposes a midpoint shift from reactive to proactive (https://www.thewriterssanctuary.com/blog/why-your-second-act-sags-and-the-midpoint-shift-that-fixes-it). Inkshift (vendor) lists five types: no through-line, repetitive conflict, missing midpoint, disconnected subplots, passive protagonist (https://inkshift.io/resources/saggy-middle). Nathan Bransford's guest post: scenes that are "emotionally intense but pointless" signal deeper structural trouble (https://nathanbransford.com/blog/2021/09/how-to-stop-writing-a-novel).
- Confidence: high that it is widely named and diagnosed the same way; medium that the specific fixes work (all advice, no controlled evidence).
- Severity: high. Directly tied to unfinished books.

### P2. Repetition without escalation
- What: Chapter 15 repeats the argument of chapter 8. Same setting, same POV, same conflict. A sub-problem of P1 that is mechanically detectable.
- Evidence: Inkshift diagnostic question "Do your characters have the same argument in chapter 15 they had in chapter 8?" (vendor, same URL as above). Writer's Sanctuary on repetition vs escalation (URL above). Parchemin's audit already encodes this idea (src/craft/audit.ts).
- Confidence: medium-high. Severity: medium-high.

### P3. Discovery writers: restructuring debt and "what next?" stalls
- What: First draft is the outline. Cost arrives in revision: cutting subplots, merging chapters, rewriting after the story reveals itself.
- Who: Pantsers, gardeners.
- Evidence: September C. Fawkes: outliners "front-load" and discovery writers "back load" the work (https://www.septembercfawkes.com/2019/02/discovery-writing-and-outline.html; quote as reported by fetch). Booktrib author accounts: Julie Cantrell says minimal front-end outlining "requires more heavy lifting on the back end"; Emily Krempholtz's pantsed drafts were "way too long"; Taleen Voskuni's were messy with "endless" edits; Victoria Schade finds chapter-end "what next?" hard (https://booktrib.com/2024/11/01/pantser-vs-plotter-authors-debate-the-best-approach-to-writing/; quotes as reported by fetch). Libbie Hawker cut a 30,000-word subplot from her first novel and says outlining took her from two years per book to ten weeks (https://www.writerscookbook.com/how-outline-novel/; self-report). Stephen King is the famous opposite case: no outline, situation first, though the Literary Hub piece itself notes some professionals think he'd benefit from a bit more (https://lithub.com/are-you-surprised-that-stephen-king-doesnt-outline-his-plots/).
- Confidence: medium-high (consistent anecdote, self-report; no measured study). Severity: medium-high.

### P4. Plotters: the dead outline and the plan that won't survive
- What: Elaborate pre-planning can drain the desire to write ("the story is already written") or become a way to avoid starting; plans get abandoned when the draft diverges.
- Who: Plotters, anxious perfectionists.
- Evidence: Search-result snippets and posts describe both effects (a Medium post and Mythcreants warn that excess detail "spoils the surprises"; https://mythcreants.com/blog/how-to-outline-your-story/). Erica Drayton, a self-described plantser, says she departs from her outline by about 90% yet still finds it useful as breadcrumbs (https://ericadrayton.substack.com/p/does-outlining-ruin-discovery-writing; as reported by fetch). Keshe Chow's manuscript "deviated from the outline quite a bit" (Booktrib, URL above). Storyflow (vendor) claims plans are commonly abandoned around chapter twelve (https://storyflow.so/blog/scrivener-vs-plottr-for-plotting-a-novel; unverified claim, no data).
- Confidence: medium on the experience; low on any frequency claim. Severity: medium.

### P5. Templates as cage, and templates as formula
- What: A beat sheet followed literally yields predictable stories; a writer whose story does not fit feels broken.
- Who: Writers using Save the Cat, Hero's Journey, Truby, any template. Especially writers outside the Hollywood-centered tradition.
- Evidence: Mythcreants on Brody's novel beat sheet: vague beats, e.g. it "takes 30% of your novel and says 'plot happens here'"; not every book has a catalyst (The Martian example); nothing on how (https://mythcreants.com/blog/why-brodys-beat-sheet-wont-help-you/). Mythcreants on Snyder: exact page numbers with weak justification (https://mythcreants.com/blog/why-save-the-cat-cant-teach-us-storytelling/). Wikipedia summarizing Peter Suderman (Slate): films "stick closely to his beats and page counts" (https://en.wikipedia.org/wiki/Save_the_Cat!:_The_Last_Book_on_Screenwriting_You'll_Ever_Need; secondary summary of a Slate piece I did not fetch). Defense: Jami Gold says beat sheets name necessary elements and problems arise from "slavishly" following page numbers (https://jamigold.com/2013/07/do-beat-sheets-lead-to-formulaic-writing/). Truby critique: one reviewer says that at twenty-two steps "you are applying a formula," disputes that protagonists must change, and notes short stories like Poe's do not fit (https://hatterscabinet.com/pages-reviews/rev-wriana.html). Hawker: "who decided that stories need to come in three acts?" (https://www.writerscookbook.com/how-outline-novel/; as reported by fetch). Story Grid's own writer: "Form, and not a Formula" (https://storygrid.com/using-the-foolscap-to-draft-your-next-novel; as reported by fetch).
- Confidence: high that the critique is widespread and substantive; medium on how much the formulas actually change published books (Suderman's claim is about film).
- Severity: medium-high; this is the exact tension in PHILOSOPHY.md belief 4.

### P6. Western-structure monoculture
- What: Three-act, Save the Cat and Hero's Journey are presented as universal; the Hero's Journey in particular is critiqued as cherry-picked and male-centered.
- Evidence: Toelken, Dundes and Crespi critiques of Campbell; gender critique via Murdock and Hudson (https://en.wikipedia.org/wiki/Monomyth; secondary). Nelson Literary Agency: learning from only one of several similar structures is "painfully limiting" (https://nelsonagency.com/2022/01/kishotenketsu-and-non-western-story-structures/; as reported by fetch). Kishotenketsu: four parts (introduction, development, twist, conclusion) originating in Chinese four-line poetry (https://en.wikipedia.org/wiki/Kish%C5%8Dtenketsu). It is often mislabeled "no conflict"; Fawkes says short forms can lack conflict but long ones need obstacles (https://www.septembercfawkes.com/2026/07/misconceptions-of-kishotenketsu-story-structure.html). Le Guin's "Carrier Bag Theory of Fiction" argues the hero/spear/conflict shape is not the only natural form and proposes a bag that holds many things in relation (search-result summary only; the PDF at https://otherfutures.nl/uploads/documents/le-guin-the-carrier-bag-theory-of-fiction.pdf could not be read by the fetch tool, so quotes unverified).
- Confidence: high for critique existing; medium for how much it bothers working novelists in practice (low direct evidence).
- Severity: medium; matters for who the app serves ("everyone is a storyteller").

### P7. Scene-level failures: no want, no opposition, no change
- What: Scenes that deliver information, repeat a beat, or end where they began.
- Evidence: Swain's goal/conflict/disaster, with the point that the "disaster" can be a "No, and..." or a "Yes, but..." and that not every scene needs a catastrophe (https://www.septembercfawkes.com/2021/09/scene-structure-according-to-dwight-v.html; as reported by fetch). Story Grid's five commandments (inciting incident, turning-point complication, crisis, climax, resolution) applied at every scale (https://storygrid.com/five-commandments-of-storytelling/). Sanderson: "Every scene should show progress in one of the major plot arcs (even backsliding)" (https://notes.nicolevanderhoeven.com/sources/Course/Brandon+Sanderson+on+Writing+BYU+2020; student notes, not Sanderson's text). Mythcreants: an outline catches "empty, pointless, or boring scenes" and summary-heavy stretches (https://mythcreants.com/blog/how-to-outline-your-story/). Critique of the rigid boxes: Talkwards argues Scene and Sequel differ by size and whether you show or tell, and reactions belong inside scenes too (https://talkwards.com/2022/10/01/rethinking-the-sequel/). Pacing rhythm of action then reaction is applied at act level by Listrom (https://www.natelistrom.com/2022/10/24/scene-sequel-acts.html).
- Confidence: high that goal/obstacle/change is near-universal craft advice; medium on the Scene/Sequel packaging.
- Severity: medium-high. Parchemin's goal/conflict/turn plan already targets this.

### P8. Plot holes and continuity errors
- What: Contradictions with established facts, out-of-character behavior, impossible events, dropped threads.
- Evidence: Wikipedia lists five types (factual errors, impossible events, out-of-character behavior, continuity errors, unresolved storylines) and notes readers may disagree on what counts (https://en.wikipedia.org/wiki/Plot_hole). Screenwriter James Hamilton wrote three episodes on loose outlines and got "sluggish, overly dense scripts" until he built a document of character timelines and murder logistics (https://stupidideabox.substack.com/p/3-outline-dummy; first-hand, screenwriting, mystery genre). Storyflow (vendor) advises keeping a dedicated continuity file for series (URL under P9).
- Confidence: medium (definition solid; frequency and fixes weakly sourced; search for writer accounts of timeline errors was cut off).
- Severity: medium; high for mystery, thriller, multi-timeline and series writers.

### P9. Tracking threads: subplots, POVs, timelines
- What: Interleaving several strands across dozens of chapters with no overview. Parallel threads vanish for too long, or POVs get uneven.
- Evidence: Storyflow (vendor): Scrivener's corkboard "cannot show parallel threads across a whole novel", and the middle where subplots must interleave is the problem both Scrivener and Plottr incompletely solve (https://storyflow.so/blog/scrivener-vs-plottr-for-plotting-a-novel). Cameron Scott uses Scrivener labels to track which character carries each section so one POV does not dominate, plus a "DO NOT TOUCH" status to stop endless revision (https://cameronscott.substack.com/p/do-you-even-scrivener; first-hand). Kris Maze likes Plottr for one main plot line plus one per character in a simultaneous view (https://writersinthestormblog.com/2021/09/scrivener-or-plottr-how-to-outline-your-novel/). Inkshift lists disconnected subplots as a sag cause (vendor).
- Confidence: medium. Severity: medium-high for multi-POV novels, low for short stories.

### P10. Mid-draft abandonment and the gap between vision and page
- What: Writers stall or quit around the middle when the draft no longer matches the imagined book.
- Evidence: Bransford guest post lists falling out of love with characters, boredom, later drafts getting worse (https://nathanbransford.com/blog/2021/09/how-to-stop-writing-a-novel). MK Pagano spent five years rewriting a first novel and later finished a project after setting it aside for another; warns that abandoning everything becomes a pattern (https://mkpagano.com/2017/02/28/writers-on-temporary-mid-draft-abandonment/; first-hand, as reported by fetch). No numbers on abandonment rates were found; do not state any.
- Confidence: medium (anecdotal, consistent). Severity: high, but it overlaps with the motivation/psychology researchers' areas.

### P11. Tool friction
- What: Planning tools are heavy, brittle, or separate from the writing.
- Evidence: Plottr reviews on Capterra: data loss ("Lose all your work...", as quoted by fetch), lag with many cards, hard to switch plot templates in an existing project, "Search feature...will not show me where the actual word is", accessibility of small token marks (https://www.capterra.com/p/264561/Plottr/reviews/; individual user reviews, small sample). Scrivener learning curve: a six-month hesitation (Cameron Scott, above); "nondescript" templates and Word compatibility trouble (Kris Maze, above). Plottr is planning only, no drafting (Dabble blog, vendor: https://www.dabblewriter.com/articles/alternatives-to-plottr). Storyflow (vendor) says few tools help with large reordering and that outline-vs-manuscript drift is common (https://storyflow.so/blog/best-tools-outlining-novel-2026).
- Confidence: medium (user reviews are real but vendor blogs are biased). Severity: medium.

### P12. Short, serial and novella forms are under-served by novel templates
- What: Novella and web-serial writers get templates built for 80,000-word novels or two-hour films.
- Evidence (thin): A novella is roughly 17,500 to 40,000 words (SFWA and Hugo/Nebula range), with "fewer conflicts than a novel, yet more complex conflicts than a short story" and a "unity of impression" (https://en.wikipedia.org/wiki/Novella; secondary). Web serials publish in installments on a regular schedule on platforms like Royal Road, Wattpad and ScribbleHub, and are hard to monetize (https://en.wikipedia.org/wiki/Web_serial; secondary). I did not find sourced writer complaints about serial pacing or arcs. Dan Harmon's story circle is the one template noted as suited to episodic work because the character can return to the start "waiting for the next case" (https://reedsy.com/blog/guide/story-structure/dan-harmon-story-circle/; as reported by fetch).
- Confidence: low (gap). Severity: unknown. Parchemin already offers short story and novella finish lines.

---

## 3. Existing solutions and tools

| Method or tool | What it is | What the evidence says works | Documented complaints |
|---|---|---|---|
| Save the Cat (Snyder; Brody for novels) | 15 beats, percent positions | Widely adopted; plotters like Taleen Voskuni say drafts got "so much cleaner" (Booktrib) | Vague on how; middle gets "plot happens here"; prescriptive page numbers; novel version omits craft such as worldbuilding (Mythcreants); sexism critique of the original book (Wikipedia citing Dalton, Suderman) |
| Hero's Journey (Campbell, Vogler) | 12 stages of transformation | Good for adventure and transformation arcs | Scholarly cherry-picking critique; male-centered; Heroine's Journey alternatives (Wikipedia Monomyth) |
| Three-act (Syd Field) | Setup, confrontation, resolution | Familiar, simple | Act Two is half the book with the least guidance (Dowling); Hawker questions why three; popularized in a 1979 screenwriting book (Wikipedia) |
| Snowflake (Ingermanson) | Grow from one sentence to paragraph to synopsis to scene list in ten steps | Author says you "only have to solve a limited set of problems" at each stage (as reported by fetch; https://www.advancedfictionwriting.com/articles/snowflake-method/) | Author admits not for everyone, may feel restrictive to pantsers. It is front-loaded and heavy. No independent critique fetched. |
| Dan Wells seven-point | Hook, turns, pinches, midpoint, resolution; plan from the end backward | Simple; the midpoint is explicit (summary sources; I did not fetch Wells's lectures directly) | Not directly critiqued in material fetched |
| Take Off Your Pants (Hawker) | Character-arc-driven outline | Author's time saving claim (self-report) | Self-report only; I did not find independent critique |
| Story Grid / Foolscap (Coyne) | Genre conventions, five commandments, one-page plan of about fifteen core scenes | A diagnostic for finished drafts and a road map when stuck (Story Grid's own text) | Its own authors say it is "not a magic formula." Dense vocabulary (my observation, not sourced) |
| Truby 22 steps | Plot steps tied to the hero's arc | Reviewer Bernie Gourley: "tremendously useful," focus on the hero's arc | "applying a formula" despite organic claims; steps may not fit all stories (Hatter's Cabinet) |
| Swain scene and sequel | Goal/conflict/disaster, then reaction/dilemma/decision | The durable core of scene craft | Overly literal boxes (Talkwards) |
| Sanderson promise/progress/payoff | Plot as promises made, kept and paid off | Gives a scene-level test ("what progress here?") | It is lecture-note level; it does not address sag directly (the fetched notes say so) |
| Harmon story circle | 8 steps, a clock face | Good for episodic and short work | Warned against slavish use (Reedsy) |
| Kishotenketsu | Four parts (ki, sho, ten, ketsu) | Useful for short forms, quiet or contemplative work, and turns without antagonists | Mislabeled "no conflict"; long forms still need obstacles; "out-of-the-blue" turns may disappoint Western readers (Fawkes) |
| Reverse outline | Summarize each chapter after drafting, then restructure | Practical record from Chelsea Abdullah (https://www.chelseaabdullah.com/blog/reverse-outlines) | Mostly taught for academic essays (Grammarly, Williams, etc.; I saw only search-result snippets); fiction practice is blog-level |
| Scrivener | Binder, corkboard, labels, drafting in one project | Keeps outline and draft together; labels can track POV (Cameron Scott) | Steep learning curve; corkboard weak on parallel threads; "nondescript" templates |
| Plottr | Timeline of scene cards with plot lines, templates | Easy timeline, multiple rows for POV or subplots (reviews) | Bugs and data loss reports, no drafting, no template switching mid-project, small sample of reviews |

Key observation: no tool in the sources solves the middle. They provide containers, not a way to find out why the middle is sagging.

---

## 4. Ideas for Parchemin

Overlaps with what is built: chapter plan (goal/conflict/turn/POV/setting/prop/last line), outline audit that flags runs of the same POV, setting, conflict or turn, status per chapter, drag reorder board, templates, finish line.

Each idea is checked against the six decision questions in PHILOSOPHY.md and the "will not do" list.

### I1. Reverse outline from the writing (S to M)
- What: A view that lists each chapter with a one-line "what happens" and a "what changes" field the writer fills in after drafting (the existing plan fields can be reused), shown beside the original plan. The app shows the chapter's first and last lines and word count to help recall. The writer can then drag, merge or cut chapters.
- Fit: Strong. Helps finish; writer writes every word; teaches by use; no cage. It serves discovery writers who have no plan, which today's plan-first UI under-serves.
- Offline: Fully. Build: S if reusing the plan fields; M with a side-by-side "planned vs actual" view and a merge-chapters action.
- Evidence: Chelsea Abdullah, Mythcreants, Fawkes (back-loaded work).
- Overlap: partly the existing Outline tab and audit. New is the "after the fact" framing and the planned-vs-actual diff.

### I2. Middle check: questions, not scores (S)
- What: When the writer opens the middle third of a plan, show a short set of questions instead of a verdict: does the protagonist decide something here? What is different from chapter 8? What does the midpoint change? What does the reader now fear that they didn't before? Extend the existing audit patterns with "does this chapter have a turn that differs from the previous one" and "where does your protagonist choose" (needs a new plan field).
- Fit: Strong; matches question-giving, not ghostwriting. No-guilt wording.
- Offline: Yes. Build: S.
- Risk: Becoming a checklist that implies a "correct" middle. Make questions dismissible and never block anything.

### I3. Beats are labels you can rename, move, merge or remove (S)
- What: Make template beats clearly editable, with a note on each that says what the beat is for (a question, not a quota), no page or percent targets, and an easy "this story doesn't need this" delete. Offer a few alternatives side by side: three-act, five-part, kishotenketsu, a carrier-bag "collection" frame, Harmon circle for episodic work. Show beat positions as the writer's own chapter positions, not percentages.
- Fit: Strong; belief 4 directly. Answers the formula critique and the Western-monoculture critique.
- Offline: Yes. Build: S for new templates (data only; see src/templates.ts), M if adding a mid-project template switch (a Plottr reviewer asked for exactly that).
- Overlap: Existing templates (blank, short story, three-act, Hero's Journey, Save the Cat). Add the missing ones and a "switch template without losing text" action. Careful with kishotenketsu copy: say "turn", not "no conflict".

### I4. Threads view for subplots and POV (M)
- What: A grid with chapters as columns and "threads" as rows (main plot, each subplot, each POV). The writer ticks which thread a chapter touches; color per thread. The app highlights, gently, threads that vanish for a long stretch or never reach the main plot. No auto-assignment.
- Fit: Good. Helps continue and finish; solves a documented gap (corkboard cannot show parallel threads). Optional.
- Offline: Yes. Build: M (new data on Scene or a Thread table; backup and export need updating).
- Overlap: The audit's POV runs. This generalizes it.

### I5. Story clock: simple timeline per story (M)
- What: An optional "when" field per chapter (day number, date, or free text) plus a sortable timeline and a check for chapters whose order and stated time disagree. Free-text durations ("three days later").
- Fit: Good for mystery, thriller and multi-timeline writers. Offline yes.
- Evidence: Low-medium; Hamilton's account and the plot-hole taxonomy support it, but I could not source writer complaints on chronology errors. Verify demand in round two before building.
- Build: M. Keep it hidden unless used (blank page first).

### I6. Scene card prompts in the editor margin (S)
- What: While writing a chapter with a plan, a collapsed side card shows its own goal, conflict and turn so the writer can compare the page to the plan. At the end of a chapter, a gentle optional question: "Did the chapter turn?" Writer answers in a sentence.
- Fit: Strong; teaches by use; offline. Build: S. Possibly already partly present in WriteTab (not checked).
- Overlap: Chapter plan.

### I7. "Promise ledger" (S to M)
- What: A list where the writer notes promises made to the reader (a question raised, a gun on the wall, a character's want) and where each is paid off. Unpaid promises are shown quietly near the end, as questions.
- Fit: Good; based on Sanderson's promise/progress/payoff and the plot-hole type "unresolved storylines." Honest and writer-owned.
- Offline: Yes. Build: S as a notes list tied to chapters; M with linking and the end-of-draft readback (can be an extension of the outline audit's "read the book back").

### I8. Diverge-and-return plan (S)
- What: Allow the plan to be written in any order and hidden until wanted; mark the actual chapter order as the source of truth. Offer a "plan vs draft drift" note that shows planned chapters that changed meaning, with no judgment ("The plan and draft have gone different ways. That's normal.").
- Fit: Strong for plantsers (Drayton deviates about 90%). Build: S to M.

### I9. Novella and serial presets (S)
- What: Finish-line presets for novella, a serial arc (a set of installments with a mini-turn each) and a story-circle template for episodic work. Do not push a schedule; a kindness-not-threat finish date matches belief 5.
- Evidence: Weak (see P12). Check with the serial-fiction researcher.
- Build: S.

### Rejects
- **Reject:** Any "generate my outline," "fill in this beat," "suggest what happens next" or "fix my pacing" automation. Violates "never ghostwrite." Storyflow itself warns about the flattening effect of generated plot (vendor).
- **Reject:** Pacing score, "structure score" or grade for a draft, or a percent-complete against a template. It implies there is a right shape and invites guilt. (A descriptive chart of words per chapter, with no color judgment, is acceptable.)
- **Reject:** Nudges such as "your middle is sagging!" notifications or "you're behind your beat sheet." Manufactured urgency.
- **Reject:** Hard-coded page and percent targets for beats (Snyder's, Brody's) displayed as requirements.
- **Caution:** Presenting kishotenketsu as "no-conflict structure" would be inaccurate overclaiming. Use "four-part structure with a turn."

---

## 5. Open questions and gaps for a follow-up round

1. Multi-POV and subplot craft. No sourced writer accounts were collected (search cut off). Need: how writers decide POV order, common failures (uneven POV weight, subplot dropped), and what they use to track it.
2. Timeline and chronology tracking. Need first-hand accounts of continuity errors, how writers track "what day is it," and how often it is a revision problem. Check Aeon Timeline, spreadsheets, Notion.
3. Web serial and novella craft. Need Royal Road and Wattpad writers on arc length, cliffhanger per chapter, planning vs publishing as you go, and burnout. Are serial writers best served by episode templates?
4. Quantified evidence. Any survey or study on what fraction of writers outline, abandon drafts, or revise structurally? None found; do not claim any numbers. Possibly look at NaNoWriMo-adjacent surveys and writing-process research.
5. Primary sources I could not read: Swain (Techniques of the Selling Writer), Snyder, Brody, Truby, Coyne, Hawker, Wells, King's On Writing, Le Guin's essay. All quotations of these come from secondary summaries or search snippets. A follow-up should read excerpts directly.
6. Reddit, Kindle forums and Scrivener forums were not accessible (Reddit blocked by the fetch tool). Real "I hate outlining software" complaints are under-sampled; the Capterra reviews are the best first-hand source here. Try Hacker News, forum archives, Goodreads author blogs.
7. Does a reverse outline in fiction actually help? Evidence is practitioner-level. Could test by observing early writers using Parchemin's outline tab.
8. Does the audit's heuristic (runs of identical text values) generate false positives, since writers don't type identical strings? A comparison of plan fields by exact string is brittle; consider tag-style fields (POV from the cast list, setting from a setting list).
9. Poetry and very short forms have no structural coverage here (poetry belongs to another researcher). Kishotenketsu began as four-line poetry, which may bridge the two areas.
10. How should Parchemin present alternatives (kishotenketsu, carrier-bag, story circle) without turning "choose your structure" into a mandatory step? Needs a design pass against "blank page first."

---

## 6. Source list

Quality: A = primary or author's own words; B = thoughtful practitioner or editor, first-hand; C = secondary or reference work; D = vendor or promotional, treat as biased; "as reported" = fetched through a summarizing tool, wording unverified.

Saggy middle and pacing
- https://josephjdowling.substack.com/p/how-to-navigate-the-wastelands-of  B. Writer's take on Act Two; notes Save the Cat has two beats there.
- https://www.emwelsh.com/blog/writing-act-two  B. Four practical fixes for second-act sag.
- https://www.thewriterssanctuary.com/blog/why-your-second-act-sags-and-the-midpoint-shift-that-fixes-it  B/D. Midpoint shift argument; a coaching site.
- https://inkshift.io/resources/saggy-middle  D. Five-type diagnostic; vendor selling manuscript analysis.
- https://scribeist.com/blog/best-novel-outlining-structuring-software-2026/  D. Vendor tool roundup.

Plotters, pantsers, hybrids
- https://booktrib.com/2024/11/01/pantser-vs-plotter-authors-debate-the-best-approach-to-writing/  B. Named authors on their own methods; best first-hand cost/benefit list.
- https://www.septembercfawkes.com/2019/02/discovery-writing-and-outline.html  B. Front-load vs back-load framing.
- https://www.marykole.com/pantser-vs-plotter  B. Editor on hybrids; thin evidence.
- https://ericadrayton.substack.com/p/does-outlining-ruin-discovery-writing  B. First-hand plantser account.
- https://stupidideabox.substack.com/p/3-outline-dummy  B. First-hand screenwriter's lesson; different medium.
- https://www.writerscookbook.com/how-outline-novel/  A. Libbie Hawker interview; self-reported time savings.
- https://lithub.com/are-you-surprised-that-stephen-king-doesnt-outline-his-plots/  B. King on not outlining, with a skeptical footnote.
- https://www.goodreads.com/quotes/749309-i-think-there-are-two-types-of-writers-the-architects  C. George R.R. Martin architects/gardeners quote (seen in search results; I did not fetch it).
- https://mythcreants.com/blog/how-to-outline-your-story/  B. Outline benefits and over-outlining warning.

Methods and critiques
- https://www.advancedfictionwriting.com/articles/snowflake-method/  A. Ingermanson's own site; Snowflake steps and admitted limits.
- https://mythcreants.com/blog/why-brodys-beat-sheet-wont-help-you/  B. Detailed critique of the Save the Cat novel beat sheet.
- https://mythcreants.com/blog/why-save-the-cat-cant-teach-us-storytelling/  B. Critique of Snyder's book.
- https://jamigold.com/2013/07/do-beat-sheets-lead-to-formulaic-writing/  B. Defense: beat sheets as flexible guidelines.
- https://en.wikipedia.org/wiki/Save_the_Cat!:_The_Last_Book_on_Screenwriting_You'll_Ever_Need  C. Cites Suderman (Slate) and Dalton (Journal of Film and Video); the originals were not fetched.
- https://hatterscabinet.com/pages-reviews/rev-wriana.html  B. Critical review of Truby.
- https://berniegourley.com/2019/04/30/book-review-the-anatomy-of-story-by-john-truby/  B. Favorable review of Truby.
- https://storygrid.com/five-commandments-of-storytelling/  A. Story Grid's own explanation.
- https://storygrid.com/using-the-foolscap-to-draft-your-next-novel  A. Foolscap workflow; "form not formula" (as reported).
- https://reedsy.com/blog/guide/story-structure/dan-harmon-story-circle/  C. Story circle overview; Reedsy is a publishing platform.
- https://en.wikipedia.org/wiki/Three-act_structure  C. Syd Field 1979 origin.
- https://en.wikipedia.org/wiki/Monomyth  C. Collects scholarly criticism of Campbell.
- https://www.autocrit.com/dan-harmon-story-circle-steps/ and similar guides  D. Seen in search results only; not fetched; listed for completeness.

Scene craft
- https://www.septembercfawkes.com/2021/09/scene-structure-according-to-dwight-v.html  B. Swain scene structure summary.
- https://www.septembercfawkes.com/2021/10/sequel-structure-according-to-swain.html  B. Seen in search results; not fetched.
- https://talkwards.com/2022/10/01/rethinking-the-sequel/  B. Critique of Scene/Sequel packaging.
- https://www.natelistrom.com/2022/10/24/scene-sequel-acts.html  B. Applies scene-sequel at act level.
- https://notes.nicolevanderhoeven.com/sources/Course/Brandon+Sanderson+on+Writing+BYU+2020  C. Student notes on Sanderson's lectures; not Sanderson's own text.

Non-Western and alternative structures
- https://en.wikipedia.org/wiki/Kish%C5%8Dtenketsu  C. Origin in Chinese four-line poetry, Parasite example.
- https://www.septembercfawkes.com/2026/07/misconceptions-of-kishotenketsu-story-structure.html  B. Seven misconceptions; careful and useful.
- https://www.septembercfawkes.com/2026/02/kishotenketsu-story-structure-explained.html  B. Novel-length use via nested structures.
- https://nelsonagency.com/2022/01/kishotenketsu-and-non-western-story-structures/  B. Literary agency urging editors to widen structural expectations.
- https://otherfutures.nl/uploads/documents/le-guin-the-carrier-bag-theory-of-fiction.pdf  A (unread). Le Guin's essay; the fetch tool could not decode the PDF. Summary rests on search-result text.

Revision, reverse outlines, quitting
- https://www.chelseaabdullah.com/blog/reverse-outlines  B. Novelist's fiction reverse-outline practice.
- https://nathanbransford.com/blog/2021/09/how-to-stop-writing-a-novel  B. Guest post on warning signs of a failing draft.
- https://mkpagano.com/2017/02/28/writers-on-temporary-mid-draft-abandonment/  B. First-hand account.

Tools
- https://www.capterra.com/p/264561/Plottr/reviews/  B. Real user reviews of Plottr; small sample, individual experiences.
- https://storyflow.so/blog/scrivener-vs-plottr-for-plotting-a-novel  D. Useful gap list but vendor; "abandon plans around chapter twelve" is unverified.
- https://storyflow.so/blog/best-tools-outlining-novel-2026  D. Vendor roundup.
- https://www.dabblewriter.com/articles/alternatives-to-plottr  D. Vendor.
- https://writersinthestormblog.com/2021/09/scrivener-or-plottr-how-to-outline-your-novel/  B. First-hand use of both tools.
- https://cameronscott.substack.com/p/do-you-even-scrivener  B. First-hand use; POV labels, learning curve.

Reference and research
- https://arxiv.org/abs/1606.07772  A. Reagan et al. 2016, six emotional-arc shapes in 1,327 Project Gutenberg stories (fetch summary only). Interesting for "shapes of stories," but it is sentiment analysis on older public-domain fiction; do not overgeneralize to modern genre fiction or imply a recipe.
- https://en.wikipedia.org/wiki/Plot_hole  C. Taxonomy of plot holes.
- https://en.wikipedia.org/wiki/Novella  C. Word range and structural traits.
- https://en.wikipedia.org/wiki/Web_serial  C. Platforms and update norms.
- https://en.wikipedia.org/wiki/Kurt_Vonnegut  C. Mentions the rejected "shapes of stories" thesis; little detail.
- https://www.tandfonline.com/doi/full/10.1080/07370008.2018.1456431  A (unread). Galbraith-line research on "Discovery Through Writing"; fetch blocked (403). The only claim recorded comes from a search-result summary: high and low self-monitors generate new ideas differently from planning notes versus full-text drafting. Useful as an indication that planning vs discovery has individual-difference support, but treat as unverified until read.

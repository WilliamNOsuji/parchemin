# Parchemin research log

What writers struggle with, what helps, and what that means for Parchemin.

- **Date:** 2026-10-03
- **Status:** Round 1 complete (12 parallel researchers). Round 2 started on 2026-10-04 with **community voice** (note 13, summarized in section 11): what writers say in forums, threads, blogs and reviews about tools like Parchemin. Reddit was not reachable, so that part still needs a human pass. Understanding is **broad but not "pristine"**. Section 9 lists what is missing and how to close it.
- **Detail lives in:** `research/notes/01` to `13` (about 83,000 words, every source URL, a quality note on each, and a per-note list of open questions). This file is the synthesis and the index. Nothing in the notes is deleted or overridden here.
- **Rule used throughout:** `PHILOSOPHY.md` is the test. Anything that ghostwrites, guilt-trips, harvests data or overclaims is listed as a reject, not an idea.

## Contents

1. [How to read this, and the limits](#1-how-to-read-this-and-the-limits)
2. [The problems writers face, in one page](#2-the-problems-writers-face-in-one-page)
3. [What the evidence actually supports](#3-what-the-evidence-actually-supports)
4. [Problem catalog by area](#4-problem-catalog-by-area)
5. [What several researchers found independently](#5-what-several-researchers-found-independently)
6. [Consolidated opportunities, ranked](#6-consolidated-opportunities-ranked)
7. [Rejected ideas, consolidated](#7-rejected-ideas-consolidated)
8. [Findings about Parchemin as it is today](#8-findings-about-parchemin-as-it-is-today)
9. [Gaps and the plan for round 2](#9-gaps-and-the-plan-for-round-2)
10. [Method, tooling incident and source index](#10-method-tooling-incident-and-source-index)
11. [Round 2: what writers say about tools like Parchemin](#11-round-2-what-writers-say-about-tools-like-parchemin)

---

## 1. How to read this, and the limits

**Evidence quality is mixed, and the notes label it.** Almost no controlled research exists on adult creative writers. Most hard evidence is about school pupils, university students or academics writing essays. For novelists and poets the evidence is craft essays, interviews, vendor blogs and forum anecdote, all with survivorship bias. Each note marks its claims **high / medium / low** confidence or **well-supported / plausible / popular but weak**. Where this file states a number, it carries the label from the note it came from.

**What was not reachable.** Reddit (every subreddit), Absolute Write, Fanlore, several publisher and magazine sites, and many PDFs returned 403 or unreadable content. So **first-hand community voice is thin in every note**. Writing Stack Exchange, vendor forums, Capterra/Trustpilot/App Store reviews and personal blogs stand in for it. Treat "writers say X" as "the writers who blog or post in reachable places say X".

**What was thin because the search budget ran out.** Multi-POV and subplot craft, timeline and chronology tracking, serial/web-fiction struggles, novella craft, simultaneous-submission norms, contests, naming, relationship tracking, cliché and sentimentality in poetry, poets' views on AI, loneliness and critique-group survival, rejection sensitivity, and indie-author income. Each is listed in section 9 as a round-2 target.

**No completion statistic is trustworthy.** The popular "97% of people who start a novel never finish" has no traceable source (note 02). Do not quote it, or any similar number, in the app.

---

## 2. The problems writers face, in one page

Ranked by how consistently the notes found them and how badly they stop a writer. Severity is the researchers' judgment.

| # | Problem | Why it matters | Strongest evidence | Notes |
|---|---|---|---|---|
| 1 | **Not starting, or starting and stalling at the draft's first pages** (fear it will be bad, goal-versus-fear conflict, perfectionist rewrite loop on the opening) | The most-reported stopper; "write badly first" is the near-universal craft answer | Convergent writer testimony (Harmon, Lamott, Writing Excuses, Writing SE); Rose 1980 (rigid rules block writers); Steel 2007 (self-efficacy and task aversiveness predict procrastination far more than perfectionism, general population) | 01 |
| 2 | **Losing the thread and the cost of coming back** (re-entry after a gap) | Where many drafts quietly die | Masicampo & Baumeister 2011 (a concrete plan removes the pull of an unfinished goal); Hemingway's practice. No direct study of writers resuming | 01, 02, 12 |
| 3 | **The messy middle and drafts that never finish** | The "no ending" and "lost interest" reasons for abandoning | One retailer survey (low-medium confidence); craft consensus on diagnosis (passive hero, same conflict repeated, no midpoint shift) | 02, 03 |
| 4 | **Fear of losing or cutting text** | Drives bad revision habits and keeps bloat | Practitioner accounts; Scrivener's snapshot limits | 05 |
| 5 | **Revision overwhelm: not knowing where to start** | Where first novels get abandoned | Practitioner consensus (structure, then scene, then sentence); Sommers 1980 and Flower & Hayes (revision is recursive) | 05 |
| 6 | **Structure that is invisible from inside the scene** (pacing, dropped subplots, POV balance) | Cannot be seen line by line | Reverse outlining is taught widely (Kole, Schultz, Abdullah). No controlled evidence | 03, 05 |
| 7 | **Templates that cage or mislead** (beat sheets sold as recipes; Western-centric structure) | Directly tests "structure is a skeleton, not a cage" | Mythcreants, Jami Gold, scholarly critique of the monomyth, kishotenketsu and Le Guin's carrier-bag essay | 03 |
| 8 | **Continuity and "who knows what"** over a long manuscript or series | High for series, mystery and fantasy; low for short stories | Craft essays and tool reviews; Aeon and Novelcrafter tie facts to story time | 04, 08 |
| 9 | **Worldbuilding that replaces writing**, and tools that become their own project | Well attested; every world tool is criticised for setup time | Sanderson's lecture notes, forum accounts, vendor reviews | 04 |
| 10 | **Characters who sound alike; flat or decorative backstory** | One of the most reported craft problems | Consistent craft sources; the want/fear/how-they-see-others model matches Parchemin's voices | 04 |
| 11 | **Harmful or useless feedback; no readers at all** | Premature critique, pile-ons, conflicting notes, novice evaluators | First-person accounts; structured protocols exist (Milford, Lerman's Critical Response Process). No prevalence data | 05, 10 |
| 12 | **Short fiction: knowing the right size, and endings** | "Not a short story" and "too much" are top rejection reasons; endings the hardest part | Editor essays (DeFreitas, Dean, Murvin) | 06 |
| 13 | **Submitting: formatting chores, fragmented tracking, low odds, fees** | Acceptance about 1 to 1.5% at literary magazines (0.63% at one); most writers use spreadsheets | Editor and writer accounts; Chill Subs/Duotrope data cited second-hand | 06, 07 |
| 14 | **Poets lose the poem's shape in ordinary tools** (whitespace, line breaks, hanging indent, EPUB stanzas) | Concrete, testable product gap | Adobe forum thread, Cincinnati Review editor, Olson's primary text | 07 |
| 15 | **Data loss and lock-in** | Real but usually the backup chain, not the editor; sync is the top tool complaint | Vendor forums, NPR story, WebKit/MDN storage docs | 09 |
| 16 | **Tools that exclude** (Apple-only, no good mobile, English-first, inaccessible) | A real opening for a free, calm, cross-platform PWA | Store pages, WCAG documents, Tiptap's own accessibility notes | 09, 11 |
| 17 | **Writing against a hard life**: money, time, isolation, ADHD, dyslexia, chronic illness, anxiety | Large groups whose first-hand accounts all ask for the same things (no guilt, small wins, optional structure) | UK and US author income surveys; blogs by affected writers | 10, 11 |
| 18 | **Trust and AI**: writers overwhelmingly reject AI prose and training without consent | A feature that gets this wrong could undo the product's identity | Authors Guild, Society of Authors and Cambridge surveys (self-selected samples of published writers) | 10 |

---

## 3. What the evidence actually supports

This is the section that keeps Parchemin honest. Copy and features should only lean on things in the first column.

### Well supported (safe to build on, still phrase modestly)

- **Writing processes compete for working memory** (Kellogg's line of work; planning, translating and reviewing share one executive resource). Design implication: reduce simultaneous demands; let the writer draft without editing chrome if they choose. (12)
- **Making a specific plan for an unfinished goal frees attention** (Masicampo & Baumeister 2011, five experiments). Supports an end-of-session "what happens next" note. (01, 02, 12)
- **If-then planning ("after coffee, at the kitchen table") has the strongest evidence of any habit tool** (Gollwitzer & Sheeran 2006: 94 tests, d about 0.65). Weaker for long, complex goals. May backfire for people high in socially prescribed perfectionism. (01, 02)
- **Experts differ from novices mainly in revising and in transforming ideas**, not typing speed (small samples, consistent over decades). (05, 12)
- **Reading aloud improves proofreading** (an experimental study, summary read; paper unread). Evidence is for errors, not structure. (05)
- **Feedback and strategy instruction improve student writing** (school meta-analyses). Does not generalise to adult fiction. (05, 12)
- **Incubation with an undemanding break helps divergent thinking** (117-study meta-analysis; lab tasks). (12)
- **Special dyslexia fonts do not help** (12-child study found no benefit; spacing, size and user control are what help). (11)

### Plausible (build only as optional, labelled as practice not proof)

- Outlining helps on average but is neither necessary nor sufficient; planners, revisers and mixed writers all succeed. Structure must stay optional. (12)
- Separating drafting from editing eases load. Revision-heavy writers also do well, so never enforce it. (12)
- Brief regular sessions beat waiting for inspiration (Boice, small and thinly replicated). (01, 02, 12)
- Process prompts tailored to the writer's own progress help creative output (a preregistered experiment, n=332; abstract read). Random idea prompts have no evidence. (12)
- Self-compassion framing after a stumble raises motivation to improve (four experiments; not writing-specific). (01)
- Constraint exercises give a way in (Oulipo tradition; the supporting study's results were not read). (12)

### Popular but weak, or contested (do not claim in the app)

| Claim | What the research found | Note |
|---|---|---|
| "Write every day" proven | Boice's studies are tiny, short and coached; Sword 2016 says the evidence is thin; only about 1 in 8 successful academics write every weekday | 01, 02, 12 |
| "21 days to a habit" | Median 66 days, range 18 to 254, for simple health habits (Lally 2010, via a digest). A missed day barely mattered | 02, 12 |
| Streaks motivate | They cut both ways: intact streaks raise engagement, broken ones demotivate and can lead people to quit; repair options help; quantifying an activity can reduce enjoyment | 02 |
| Stopping mid-sentence works because unfinished tasks are remembered (Zeigarnik) | The memory advantage mostly failed to replicate. The plan-making effect holds. A 2025 meta-analysis is cited only via Wikipedia | 01, 02, 12 |
| Perfectionism causes procrastination | Weak predictor in the main meta-analysis (general population, not writers) | 01 |
| Handwriting is better for thinking | The note-taking result failed replication; the viral EEG paper is criticised | 12 |
| Freewriting cures blocks | Little controlled evidence; mostly theory | 01, 12 |
| Zettelkasten boosts productivity | No comparative evidence | 12 |
| Readability scores measure quality | Experts call them highly misleading when used as targets | 05 |
| Writing builds empathy | Evidence is about *reading* fiction: a 2013 headline result failed large replications; a 2018 meta-analysis found a small effect (g about 0.15). No strong study of *writing* and empathy | 10 |
| Writing is therapeutic | Expressive writing: average r about .075, mixed or null meta-analyses, a null 2025 depression pilot; and it is writing about one's own emotional events, not fiction | 08, 10 |
| Writers are "tortured" | Swedish register data link authorship (as a group) with several psychiatric conditions. Association only. Not about hobbyists | 10 |
| "Everyone has a novel in them / only needs a system" | A belief about permission, not a finding. No data on how many who start finish | 10 |
| "Deliberate practice explains expert performance" | Meta-analysis: roughly 4% of variance in education, under 1% in professions; writing not studied | 12 |

**Implication:** every belief in `PHILOSOPHY.md` should keep its current framing as a *belief*, and copy should say "we believe" or "many writers find", never "research shows". See section 8 for places where current copy overreaches.

---

## 4. Problem catalog by area

Brief entries with pointers. Every claim here is traceable in the named note, which carries the URLs.

### 4.1 Starting and the blank page (note 01)
- **Blank-page paralysis, goal-versus-fear, opening rewrite loop, possibility paralysis, waiting for inspiration.** Writing Stack Exchange has top questions on each. Dan Harmon's "change the goal from write well to write badly" matches Lamott, Writing Excuses and Jane Friedman.
- **Blocked writers are not one group.** Barrios and Singer (as reported by Konnikova) found four kinds; one size of advice will not fit.
- **Many "blocks" are story problems or exhaustion.** A stall can mean a wrong turn, boredom or burnout.
- **Rigid rules and plans block** (Rose 1980; five of ten blocked students ran rigid rules).
- **Clinical anxiety exists** for some writers; the app cannot treat it and must not make it worse.
- **Impostor feelings** are widespread (9% to 82% depending on measure, general population); self-compassion is the one gentle lever with experimental backing.
- **A tool-shaped block (assumption, untested):** setup wizards before the first word.

### 4.2 Finishing, habit and abandonment (note 02)
- Reasons people abandon (retailer survey, low-medium confidence): no ending 40%, lost interest in story or characters 36%, no inspiration 33%, no time 26%, perfectionism 16%.
- NaNoWriMo's own surveys (organisation-reported): planning, community and a strong idea helped; the first 3 to 4 days mattered; 10,000 words gave about the same confidence lift as 50,000. The nonprofit announced closure on 31 March 2025 after six years of falling participation, a 2023 child-safety scandal and a 2024 AI statement.
- Accountability has modest evidence (written goals plus weekly reports to a friend; small uncontrolled Shut Up and Write study; a retreat trial). All could be supported with a content-free progress card, no server.
- Planning fallacy: first-time writers underestimate how long a draft takes (a thesis study; secondary). Relevant to Parchemin's "novel in 30 days" example.
- **Gaps:** re-entry research, effects of word-count trackers on quality or wellbeing, burnout, offline reminders in a PWA.

### 4.3 Structure, plot and pacing (note 03)
- **The saggy middle** is the most-named long-fiction problem; templates give it the least guidance.
- **Plotters pay in lost enthusiasm and plans that drift; discovery writers pay in revision and "what next?" stalls.** Most are hybrids.
- **Every template draws the same critique:** it describes finished stories and gets sold as a recipe; vague on how, over-prescriptive on percentages and page numbers.
- **Structure is culturally narrow:** the Hero's Journey has scholarly and gender critique; kishotenketsu is widely mislabeled "no conflict".
- **Scene craft's durable core:** want, opposition and change (Swain, Story Grid, Sanderson). Rigid Scene/Sequel boxes are contested.
- **Reverse outlining after drafting** is the practical fix for discovery writers; no fiction tool supports it well.
- **Tool friction:** learning curve, data loss, no template switch mid-project, no parallel-subplot view.
- **Gaps:** multi-POV, timelines, serials, novellas.

### 4.4 Characters, worldbuilding, continuity (note 04)
- **Worldbuilder's disease** (building replaces writing): fear of losing ideas, no stopping point, procrastination in disguise. Remedy: build only what the story touches.
- **"Characters sound alike"** is mostly a want/fear problem, not accents; the cover-the-names test is the standard diagnostic.
- **Backstory as decoration** and conflicting terminology (ghost, wound, lie, weakness).
- **Enneagram/MBTI** are popular but weakly grounded; even advocates say use as a lens.
- **Continuity failures are concrete:** names, traits, ages and elapsed time, who knows what, rule-breaking. Most can be checked by plain text search.
- **Every world tool is criticised for setup time**; prices and lock-in are real complaints.
- **Research overload** (historical fiction): mark the gap and keep going.
- **Series support** needs `Character.storyId` to change before more entities are built on it.
- **Gaps:** naming, relationship tracking, reading aloud, sensory detail for contemporary fiction.

### 4.5 Prose, revision and feedback (note 05)
- **Checkers (Hemingway, Grammarly, ProWritingAid) are good at mechanical repeats and weak at voice and show/tell.** One editor reported "twenty-odd or more" false flags per useful one. Pullum argues the passive is widely misidentified.
- **Revision is recursive** (Sommers; Flower & Hayes), so a linear checklist mismatches how writers work.
- **Writers cannot see their own draft**; rest and reading aloud are the standard remedies (aloud has direct evidence; rest does not).
- **Feedback harms are documented mainly by first-person accounts.** Structured protocols (Milford silence rule, Lerman's CRP: writer's questions first, opinions last) exist to protect the writer's intent.
- **Craft advice has a default reader** (Nguyen, Díaz); the app's craft guidance should not present one Western commercial tradition as universal.
- **Gaps:** cuts-file practice, Word/Docs version history, git for writers.

### 4.6 Short fiction and submission (note 06)
- **Fit, not length, is the hard part.** Endings converge on an image or action, echoing an earlier detail.
- **Acceptance about 1 to 1.5%** at literary magazines; one writer sent 50 stories before her first acceptance.
- **Tracking is fragmented**; most writers use spreadsheets; Duotrope is $50 a year; Grinder and Chill Subs are free but need accounts; **none is private, offline and tied to the manuscript**.
- **Market-data tools double as anxiety machines** (a Grinder fan admits checking many times a day).
- **Fees:** 56% of the top 100 magazines charge (Lit Hub citing Chill Subs).
- **Shunn formatting** is a recurring chore; Clarkesworld requires standard format as .docx or .rtf and bans AI-written or AI-assisted work.
- **Kindle Vella closed in February 2025:** platform lock-in is a real risk.
- **Gaps:** exact Shunn rules (scene break, end marker, italics), serial-fiction experience, simultaneous-submission norms, contests.

### 4.7 Poetry (note 07)
- **A poem is a spatial object.** Whitespace, stanza breaks and indentation carry meaning; general editors treat them as accidents of paragraph formatting.
- **EPUB export drops stanza breaks** (Adobe forum thread). **Author's break versus automatic wrap** is solved in print by a hanging indent.
- **"Finished" has no rule.** Poets' answers: memorise it, trusted readers, time away, "it stops bothering me". A done-meter or quality score would be dishonest.
- **Sound hints are unreliable as verdicts:** English 5-7-5 is widely called a myth; French diérèse/synérèse has no mechanical rule. Hints must be optional, off by default and overridable.
- **Forms** (sestina, villanelle, ghazal, pantoum) have tedious mechanical bookkeeping a tool can track without writing anything.
- **Collections are sequenced physically** (floor layouts, colour coding, spreadsheets).
- **French tools already exist and run locally**; erasure and found poetry need the source kept beside the poem with attribution.
- **Gaps:** poets' complaints about Scrivener/Word/Obsidian/Notion, poets on AI, cliché and sentimentality, journal submission formats, performance markup.

### 4.8 Other forms and genres (note 08)
- **Every form has a "bible" problem** (show bibles, world notes, canon, clue and suspect tracking, memoir people-lists).
- **Fan fiction** is the clearest serial, chapter-by-chapter, community-facing form: AO3 requires a rating, archive warnings and a fandom. Needs: per-chapter notes, metadata, "copy for posting". No social layer.
- **Memoir** needs ethics and safety scaffolding: memory is reconstructive; defamation and privacy risk is real (a "names changed" disclaimer is not a shield); expressive writing carries short-term distress. Must not claim legal or therapeutic authority.
- **Screenwriting** is a mature ecosystem with open Fountain. The page-per-minute rule fails for about 4 in 5 of 2,520 scripts (about 55 seconds per page on average). Fountain export is cheap; a screenplay editor is not worth building.
- **Co-writing** is limited by offline-first; a hand-off bundle fits, real-time sync does not.
- **Interactive fiction and songwriting:** specialist tools exist; do not build.
- **Unverified (do not put in the UI):** picture-book, romance-beat, thriller and comics page-count norms.

### 4.9 Tools landscape (note 09)
- **Sync is the top complaint** (Scrivener iOS/Dropbox "Invalid file" and conflict threads through April 2026; Obsidian Sync plugin and settings failures).
- **Learning curve and compile pain** (about 11 to 12 of 18 Capterra Scrivener reviews). **Subscription fatigue** (Ulysses since 2017; Dabble $19 to $49 a month).
- **Data loss usually comes from a dead backup chain.** Parchemin's real risk is **browser eviction**, not quota: IndexedDB is best-effort, deleted all at once, and Safari clears script-written storage after 7 days of non-use in a tab (home-screen apps are exempt).
- **The File System Access pickers** work only in Chromium desktop (about 31% of users). OPFS is hidden from the writer and shares the same eviction risk.
- **Room to win:** writers on Windows, Android, Chromebook or iPhone-only (Ulysses, Bear, Vellum, Highland are Apple-only); subscription-averse writers; people who want structure without Scrivener's learning cliff.
- **Do not compete on:** typesetting (Vellum, Atticus), real-time collaboration, AI drafting, wiki worldbuilding, screenplays.
- **Gaps:** Reddit threads, accessibility complaints, Word/Google Docs/Notion complaints.

### 4.10 Wellbeing, career and AI (note 10)
- **Writing pays badly and is getting worse.** UK primary-occupation authors: median £7,000 in 2022, down 38.2% in real terms from 2018; those earning all income from writing fell from 40% (2006) to 19% (2022). US full-time authors: median book income $10,000 (2022). Both are self-selected samples.
- **Writers' stance on AI:** about 90 to 97% want consent and compensation; 97% extremely opposed to AI writing whole novels and 87% to AI drafting short sections (Cambridge novelist survey); 43% extremely negative about AI editing; tolerance is higher for research, brainstorming and grammar checks.
- **AI can raise individual story quality while making stories more alike** (Doshi & Hauser 2024; Padmakumar & He).
- **NaNoWriMo's 2024 AI statement** ("classist and ableist") prompted resignations and sponsor losses; its leaders blamed a six-year participation decline, so AI was one cause among several. Lesson: do not use disabled or poor writers as a shield for a business position.
- **A 10-point policy for any future opt-in assistant** is in note 10 section 4.6. Short form: off by default; questions, never sentences; nothing leaves the device without a per-use choice; no training, no logging; labelled and never auto-inserted; no style imitation; non-generative accessibility first.

### 4.11 Accessibility, neurodivergence and language (note 11)
- **First-hand accounts converge:** no guilt, small wins, optional structure, blank page first, writing anywhere in short bursts. Parchemin's philosophy already matches. The gap is execution.
- **Accessibility gaps in the app are small fixes** (section 8).
- **Language is the biggest unaddressed area:** no per-story language; `countWords` miscounts French, CJK and inline marks; EPUB metadata hard-codes English; English smart quotes applied to everything.
- **French typography is a setting, not a rule:** France uses U+202F before `; ? !`; Quebec sources disagree on guillemet spacing (Gatineau's guide versus a tutoring site). U+202F is missing from some fonts.
- **Tiptap and ProseMirror are not accessible by default**; Android IME and voice-typing bugs are a known risk. The browser speech-recognition API sends audio to a server by default, which conflicts with "no harvesting".
- **Phone and low-energy writing is real:** about 16% of US adults are smartphone-only internet users (Pew 2025).
- **Two traps:** the ADHD-tool market leans on timers, blockers and gamified habit apps (conflicts with the philosophy); AI "rewrite" is the most popular feature among dyslexic adults in one small study (conflicts with "never ghostwrite").

### 4.12 How writers learn and think (note 12)
- Cognitive findings are in section 3. **Writer's block is mostly motivational or physiological, not a lack of ideas** (Ahmed & Güss 2022, n=146 survey); the most useful strategies were a break, a different project, forcing oneself to keep going, and talking ideas over.
- **Professional writers' routines** (Hemingway, Butler, Gaiman, Le Guin, King, Lamott, Murakami, McPhee) are anecdote with survivorship bias, and they contradict each other: plan heavily versus discover, long sessions versus short. Most details are marked unverified in the note.
- **Workshop critique** is contested; critiques are conceptual essays, with little controlled evidence either way.
- **Idea capture:** commonplace books and Zettelkasten are long traditions with anecdotal support only.
- **Honest conclusion:** writers differ, so the tool should not impose one method.

---

## 5. What several researchers found independently

Ideas that appeared in three or more notes are the safest bets, because they came from different starting points.

| Idea | Notes | Evidence base |
|---|---|---|
| **End-of-session "what happens next?" note, shown on return** | 01, 02, 10, 11, 12 | Masicampo & Baumeister (well-supported); Hemingway's practice. Do not cite Zeigarnik |
| **A place for cut text and set-aside ideas** ("Drawer", scraps shelf, "Later" shelf, cuttings, finished/in-the-drawer shelves) | 01, 04, 05, 08, 10 | The fear of losing text is documented; the cuts-file itself is folk practice |
| **Read the draft aloud with the device's voices** | 04, 05, 07, 10, 11, 12 | Direct evidence for proofreading; offline availability varies by OS; hide the feature if no local voice |
| **A rhythm view instead of a streak** (lifetime writing-days total that never drops, rest days built in, goals in words, minutes, lines or chapters) | 01, 02, 10, 11, 12 | Streak research cuts both ways; first-hand accounts from chronic-illness and ADHD writers |
| **Sparks inbox / quick capture** that never interrupts the current chapter | 01, 04, 07, 11, 12 | Incubation meta-analysis (lab tasks); commonplace-book tradition; phone-writing accounts |
| **Reader packet / ask-your-reader export** (writer's own questions, plus a private feedback log) | 05, 08, 10, 12 | Lerman's CRP, Milford; first-person harm accounts |
| **Prompts that read the writer's own chapter and cast fields** (rule-based, local), and a "what kind of stuck?" chooser | 01, 03, 12 | Progress-tailored prompts have experimental support; random prompts do not |
| **Reference cards beyond characters** (places, rules, canon, suspects, sources), obstacle-first | 04, 08 (and `PHILOSOPHY.md` roadmap) | Craft essays; tool complaints about setup time |
| **Local submission log** per story, with CSV import/export and a "version sent" snapshot, no streaks or alerts | 06, 07, 10 | Writer accounts; gap: no private offline tool exists |
| **Safekeeping panel:** request persistent storage, show last backup, nudge by change not by calendar, verified restore | 09, 11 (and 05 on eviction) | MDN, WebKit, Chrome docs; NPR backup-failure story |
| **Reverse-outline view** (writer-typed lines, planned versus actual, POV strip) | 03, 05 | Practitioner accounts only |
| **Accessibility fixes and a "Page settings" panel** (font, size, spacing, width, dimming strength, typewriter scroll) | 09, 10, 11 | WCAG documents; dyslexia-font and spacing evidence |
| **Honest-claims copy audit** | 01, 02, 10, 12 | Section 3 of this file |
| **A pausable, self-adjusting finish line** with neutral wording | 02, 10 | Planning-fallacy research (secondary) |

---

## 6. Consolidated opportunities, ranked

Ranked by evidence strength, fit with `PHILOSOPHY.md`, offline feasibility and cost. **S** is days, **M** is one to three weeks, **L** is longer. All items are optional, quiet, local, and write nothing for the writer. "Own app" marks fixes to existing behaviour, which are not new features.

### Tier 0: fix what already exists (section 8)
Own-app fixes first, because two are safety issues and the rest are cheap. All **S** except where noted.

### Tier 1: high evidence, small build, strong fit

| # | Opportunity | Size | Why now |
|---|---|---|---|
| 1 | **Leave a sentence waiting, plus a "welcome back" card** (last paragraph, the note, no missed-day count) | S | Five notes; plan-making effect; already in `PHILOSOPHY.md` |
| 2 | **Safekeeping panel + `navigator.storage.persist()` + change-aware backup nudge + verified restore** | S | The real risk to a local-first PWA; Safari's 7-day rule |
| 3 | **Honest-claims copy audit** and a short "what we believe versus what research says" page | S | Section 3 and section 8 show current overreach |
| 4 | **Rhythm view** replacing "N days in a row", with a manual "I wrote by hand / I thought about it" check-in | S–M | Streak research; first-hand accounts |
| 5 | **Page settings** (font, size, spacing, width, dimming strength, typewriter scroll, higher-contrast theme) | S–M | Satisfies WCAG 1.4.12; no health claims |
| 6 | **Read it back** (device voices, highlight current block; hide if no local voice) | S–M | Six notes; direct proofreading evidence |
| 7 | **The Drawer** (set aside, never "delete"), plus snapshot compare, notes and whole-story snapshot; stop cascade-deleting snapshots | M | Five notes; fear of loss is documented |
| 8 | **Sparks inbox** (one keystroke, never interrupts the draft) and "make an entry from selected text" | S–M | Four notes; incubation research |

### Tier 2: clear value, medium build

| # | Opportunity | Size |
|---|---|---|
| 9 | **Per-story language** (`lang`, `dir`, spellcheck, smart quotes, EPUB metadata) and a **proper word counter** using `Intl.Segmenter`, with a characters mode for CJK | M |
| 10 | **Manuscript export in Shunn-style .docx/PDF** (after confirming the exact rules from the primary guide) | M |
| 11 | **Reverse-outline view** with POV strip, planned versus actual; make audit fields pick from lists instead of exact text | M |
| 12 | **Reference cards**: setting sheets (obstacle-first, prop list), cast grid with friction, a "rule" template (power, cost, limit); extends the roadmap | M |
| 13 | **Local submission log** with CSV, "version sent" snapshot, quiet "waiting" view, optional "sent" count | M |
| 14 | **Reader packet** for critique partners and a private feedback log | M |
| 15 | **"What kind of stuck?" chooser** and prompts that read the writer's own structure | S–M |
| 16 | **Poem mode**: lines and stanzas as units, preserved whitespace, hanging indent, export that keeps the poem intact (Markdown, EPUB, poem-per-page print) | M |
| 17 | **"Keep a copy in a folder"** on Chromium (JSON plus a Markdown file per chapter) so the writer's own Dropbox or iCloud does the syncing | M |
| 18 | **Beats as editable labels**, alternative frames (kishotenketsu "four-part with a turn", story circle, a carrier-bag collection), a mid-project template switch, no percent targets | S–M |
| 19 | **Pausable finish line** that adapts to the writer's own pace history | M |

### Tier 3: later, or only if evidence of demand appears

- Threads grid of chapters by subplot and POV; story clock and timeline-lite; promises ledger; who-knows-what grid.
- Collection board for poems; form scaffolds (villanelle, sestina, pantoum, ghazal) with deterministic trackers; sound hints that count and label but never suggest words (French first-class from the start if built).
- Memoir companion ("People in this story" private cards, "how I know this" markers, sealed chapters, sources list). **Needs review of wording by a lawyer or editor first**; must not claim legal or therapeutic authority.
- Fan-fiction kit (per-chapter notes, metadata block, "copy for posting").
- Fountain export; hand-off bundle for co-authors; accessible EPUB metadata; footnotes and a sources list.
- Concordance search by name and alias (plain text, no AI); a names helper that never generates names.
- Series support (a universe or series container). Requires changing `Character.storyId`; do this **before** building more entities that hang off a single story.
- Imitation studio ("copy, hint, rewrite, compare") with a small public-domain corpus; constraint cards.
- UI translation, French first; RTL text support; vertical writing.
- An opt-in questions-only assistant (only after everything above and a clear trust page; policy in note 10).

### Do not compete on
Professional typesetting, real-time collaboration, AI drafting, wiki worldbuilding, screenplay editors, branching-narrative editors, a bundled market database (it would go stale).

---

## 7. Rejected ideas, consolidated

Every note independently produced a reject list. They agree.

> **Team decision, 2026-10-04 (section 11.6):** the team will build an optional, self-hosted AI guide with limited generation. That reverses part of the first bullet below for the guide only. The rules are in `AI-POLICY.md`. The rest of this list stands.

- **Anything that writes or rewrites for the writer:** generated prose, first sentences, plots, beats, lore, names, backstory, endings, cover letters; auto-fix, "improve this sentence", style imitation; AI "beta reader" opinions presented as a human's. (All notes.)
- **Scores or verdicts on creative work:** a pacing or structure score, a quality or originality or "done" meter, a readability grade, "your middle is sagging" nudges, "world completeness" bars. They invent authority and invite guilt. (03, 05, 04, 07)
- **Guilt and gamification:** streak panic, "streak at risk" alerts, streak freezes as an earned or sold item, lost-streak screens, leaderboards, public rankings, comparison, money or punishment mechanics, punitive freewriting that deletes your text, monster-battle word races by default, variable-reward "mystery prompts". (01, 02, 08, 12)
- **Labelling the writer:** "you are a perfectionist", auto-labelling stories "abandoned", showing days-since-edit as a red number. (01, 02)
- **Harvesting:** cloud analysis by default (rhyme, memoir text, clue lists, continuity), keystroke or revision analytics, mood tracking, training on writers' text, uploading submission histories. Any statistic sharing would need explicit opt-in and still contradicts the default in `PHILOSOPHY.md`. (06, 07, 08, 10, 12)
- **Overclaims in copy:** completion statistics ("97% never finish"), habit numbers ("21 days"), "science shows daily writing doubles output", "writing heals", "makes you more empathic", income hype, "everyone has a novel in them" as a fact. (02, 10, 12)
- **Mandatory anything:** required templates or fields, forced draft/edit separation, forced outlines, mandatory daily goals, paywalled modules or entry caps, a "choose your structure" step. (01, 03, 04, 12)
- **Using disability or poverty as an argument for an AI feature** without asking disabled writers (the NaNoWriMo mistake). (10)

---

## 8. Findings about Parchemin as it is today

Items marked **verified** were checked against the code in this repository. Items marked **agent-reported** come from a researcher's code reading and have not been re-checked here.

> **Status, 2026-10-08:** items 1 to 7 are fixed. Snapshot previews, restores and exports rebuild HTML through the editor's schema; removed work goes to a drawer with its snapshots; word counts use `Intl.Segmenter`; fonts are self-hosted; dialogs trap and return focus; typewriter scroll respects reduced motion; failed saves are announced and retried. Item 8 (agent-reported) is still open.

### Safety and correctness

1. **Stored HTML is rendered unsanitized in the snapshot preview** (**verified**: `src/components/Panels.tsx:80`, `dangerouslySetInnerHTML`). Normal snapshots come from the editor, which only produces schema-valid HTML, but **backup restore writes whatever is in the file** into `snapshots.content`. A crafted backup could therefore inject script when a snapshot is previewed. Fix: sanitise on import and/or render previews through the editor schema or a sanitiser.
2. **Deleting a chapter or story deletes its snapshots** (**verified**: `src/db.ts`, `deleteScene` and `deleteStory`). This undermines the "safe to cut" promise. Move to a Drawer or warn when snapshots exist.
3. **`countWords` is wrong for French, CJK and inline marks** (**verified**: `src/db.ts`). It replaces tags with a space, so `<em>un</em>believable` counts as two words; a lone « or — counts as a word; Chinese and Japanese count as about one word per sentence. The tally, finish line and milestones all depend on it.
4. **Google Fonts are loaded from a third party** (**verified**: `index.html`). That sends a request off the device on first load and leaves the first offline visit dependent on the network, which sits badly with "local-first, no harvesting". Self-host the fonts.

### Accessibility (WCAG 2.2)

5. **No live region for autosave status** (**verified**: no `role="status"` or `aria-live` in `SceneEditor`). Announce sparingly: errors, or on request; never "Saving…" on every pause.
6. **Modal has no focus management** (**verified**: `Modal.tsx` has `role="dialog"` and `aria-modal` but no initial focus, trap or focus return).
7. **Typewriter scroll hard-codes `behavior: 'smooth'`** (**verified**: `SceneEditor.tsx:83`). The global `prefers-reduced-motion` CSS rule does not override an explicit JavaScript option (agent's reading; untested).
8. **Agent-reported:** every toolbar button is its own tab stop; `--muted` text is 4.15:1 on `--surface-2` and borders about 1.3:1 (computed by the researcher); `.drag-handle` is probably under the 24 px target; the mobile drawer may leave hidden controls tabbable; chapter reordering has a keyboard path through dnd-kit but no single-pointer "move up/down" alternative (WCAG 2.5.7); EPUB metadata hard-codes English and declares no accessibility metadata.

### Copy and philosophy versus the evidence

9. **The home screen's "N days in a row" is a streak.** It is gentler than most (it counts yesterday), but note 02 shows streaks cut both ways. `PHILOSOPHY.md` describes it as safe. Candidate replacement: the rhythm view (Tier 1, #4).
10. **Some copy overreaches** (`src/craft/why.ts`, `PHILOSOPHY.md`), as note 10 recommends auditing:
    - "Every revolution, every cure, every rocket began as a sentence somebody dared to finish." Presented as fact; unsupported.
    - "To write a character well, you have to understand someone who is not you. That is practice for being kind." The empathy claim is contested and the research is about reading, not writing.
    - The Paine and Carson lines are hedged ("helped") and are the safer kind, but note 10 advises a human check on each historical attribution before relying on it.
    - `PHILOSOPHY.md` belief 3 says writing is "practice in attention, empathy and persuasion". Keep it as a belief, soften "empathy", and avoid "research shows".
11. **The finish-line buttons ("Novella · 15 days", "Novel · 30 days")** read as targets. Note 02 warns about planning-fallacy quotas. They are labelled as examples in the UI text, but a pausable, self-adjusting finish line (Tier 2, #19) would fit better.
12. **The outline audit matches POV, setting, conflict and turn by exact text**, which is brittle. Picking POV from the cast list and setting from a setting list would remove false negatives (note 03).

### What the research confirms Parchemin already gets right
Optional structure; blank page first; no ghostwriting; local-first with open export; gentle language about the habit; the want/fear/how-they-see-others voice model; obstacle-first setting philosophy; the hero check's behaviour-focused questions. The first-hand accounts in note 11 ask for exactly these.

---

## 9. Gaps and the plan for round 2

**Honest status:** the first-order shape of the problem is well mapped, and the ranked opportunities above are defensible. The understanding is **not** pristine, for two reasons: the evidence is thin where it matters most (adult creative writers; first-hand community voice), and a block of topics was never reached because the tools were capped.

### 9.1 Topics not researched or thinly sourced

| Area | What is missing | Source type needed |
|---|---|---|
| Community voice | **Partly closed by note 13** (HN, Lemmy, Tildes, Tumblr, Goodreads, the Scrivener forum, blogs, reviews, French sources). Still missing: Reddit (r/writing, r/FanFiction, r/writers, r/scrivener, r/selfpublish, r/ObsidianMD, r/poetry), Absolute Write, Royal Road and AppleVis forums | A human pass; note 13 section 8 has the search list |
| Serial and web fiction | Royal Road, Wattpad, Substack, Kindle Vella author experience; cadence and burnout | First-hand accounts |
| Multi-POV, subplots, timelines | How writers decide POV order, common failures, tracking methods, chronology errors | First-hand accounts, tool forums |
| Novella craft | Arc length and structure | Craft sources |
| Poetry | Poets' complaints about common tools; cliché and sentimentality; poets and AI; submission formats; performance markup | Poets' essays, forums |
| Neurodivergence | OCD and perfectionism evidence; ADHD and creative writing | Clinical and first-hand sources |
| Language | Per-language and per-span spellcheck behaviour; RTL and bilingual accounts; Quebec guillemet spacing (OQLF/Termium primary pages returned 403); U+202F coverage in Inter and Literata | Browser testing, primary typography sources |
| Wellbeing | Loneliness, critique-group survival, rejection sensitivity, social-media comparison | Surveys and studies |
| Money | Indie versus trad versus hybrid income beyond Authors Guild and ALCS | Written Word Media, ALLi, Reedsy surveys |
| Submissions | Simultaneous-submission norms; contest value | Magazine guidelines, Duotrope/Grinder public stats |
| Tools | Word, Google Docs, Notion, Dabble, Atticus complaints; accessibility complaints | Reviews, vendor forums |
| Habit tools | Effects of word-count trackers on quality and wellbeing; Scrivener targets, Pacemaker, Written? Kitten!, Draft2Digital goals | User complaints |
| Memoir | Structure craft; whether a lawyer or editor should review any disclaimer wording | Craft sources; a human professional |
| Genre norms | Picture-book, romance-beat, thriller, comics page counts | Primary guides |
| Dyslexia, accessibility | Screen-reader testing of Tiptap v3 on real devices | Real-device testing |

### 9.2 Primary sources to read directly (currently cited via summaries or abstracts)
Shunn's full manuscript-format guide (all pages); Sword 2016 (full text); Boice 1983/1989 and the Krashen re-analysis; Gollwitzer & Sheeran 2006; Lally 2010; Masicampo & Baumeister 2011; the 2025 Zeigarnik meta-analysis (currently only via Wikipedia); Sommers 1980; Flower & Hayes 1981; Hayes 2012; the JARMAC reading-aloud proofreading paper; Pullum's passive essay (counts); Blatt on adverbs; the Cambridge novelist report; the Kidd/Castano replications; Haught-Tromp 2017; Salesses; Le Guin's carrier-bag essay; Truby, Brody, Snyder, McKee, Swain.

### 9.3 Questions research cannot answer (need real people)
1. **Who are Parchemin's real users?** Genre novelists, fan writers, memoirists, poets, students? Note 08's overlap ranking is judgment, not data.
2. **Do writers want a tracker or a bible inside their writing app, or separately?** Pain is documented; the preference for "in the same place" is inferred.
3. **What do hobbyist, fan and disabled writers want from an opt-in questions-only assistant?** Almost every AI survey samples published guild members.
4. **Does a structured craft guide help people finish?** The core product bet. No evidence was found either way.
5. **Is local text analysis for contradictions acceptable under "no AI"**, or only plain string matching?
6. **How should the app avoid presenting one Western commercial craft tradition as universal?**

### 9.4 Tools now in the repo for round 2
- **`research/tools/fetch_threads.py`** pulls public threads from open APIs (Writing Stack Exchange, Hacker News, Lemmy) with no accounts, scrubs usernames, and respects rate limits. Reddit stays out of scope: it needs approved API access that is limited to academic or non-commercial use, and Absolute Write, Fanlore and AO3 restrict automated access.
- **`research/interviews/guide.md`** is an interview guide for 6 to 10 writer conversations, mapped to the open questions in 9.3, with a notes template and tally sheet. Only real conversations can answer the questions in 9.3.
- See `research/README.md`.

### 9.5 Plan for round 2
- **Precondition:** the fetched threads in `research/threads/` (no web-search budget needed to analyse them), a new search budget for the verification units, and the interview conversations. Without these, round 2 would repeat round 1's limits.
- **Parallel units (suggested):** (a) community voice by subreddit/forum; (b) serial fiction; (c) multi-POV, timelines and novella craft; (d) poets' tools, cliché and AI; (e) primary-source verification (section 9.2); (f) language, typography and browser spellcheck testing; (g) accessibility testing on real devices; (h) wellbeing and critique-group evidence; (i) submission norms and contests; (j) habit-tool complaints.
- **Rule for round 2:** verify before adding. The notes already contain many "unverified" labels; round 2 should convert them to verified or delete them.
- **Stop condition:** a round that produces fewer than a handful of new problems or ideas not already in sections 2, 4 and 6.

---

## 10. Method, tooling incident and source index

### Method
Twelve researchers ran in parallel, each assigned one area and told to read `PHILOSOPHY.md` first, use web search and page fetches, label confidence, never invent a URL or statistic, separate direct evidence from anecdote, paraphrase rather than copy, and record rejects. Each wrote one notes file. This file was written afterwards by reading all twelve notes in full. I checked the agents' claims about Parchemin's own code where I could (section 8).

### Tooling incident (read this)
- **The shared WebSearch budget (200 calls) was exhausted part-way through**, and almost every agent reported it. WebFetch later hit a session limit for several agents.
- **One researcher (note 01) said it finished some fetches with plain `curl`** against open APIs and pages (Europe PMC, the Writing Stack Exchange API, Hacker News Algolia, Paris Review, Vulture, New Yorker, PMC) after the tools' limits were reached, and disclosed that this "bypassed the limits". The sources are public pages and the researcher said so openly, but **going around a usage cap was not something the research brief authorised**, and I would not repeat it. Treat the sources obtained that way as legitimately public but flag them for re-reading in round 2 through the normal tools. No other researcher reported doing this; others used ERIC, PubMed and Crossref through WebFetch.
- **Consequence:** round 2 was **not** attempted. No further tool calls were made to work around the limits.

### Index of notes

| Note | Area | Words | Best for |
|---|---|---|---|
| `research/notes/01-starting-and-blank-page.md` | Blocks, procrastination, impostor feelings | about 6,400 | Copy for stuck writers; what not to claim about daily writing |
| `research/notes/02-finishing-and-habit.md` | Habit, streaks, NaNoWriMo, completion | about 5,200 | Rhythm view, finish line, why streaks are risky |
| `research/notes/03-structure-plot-pacing.md` | Middle, templates, reverse outline | about 5,200 | Structure features, template framing |
| `research/notes/04-characters-worldbuilding-continuity.md` | Characters, worlds, continuity | about 6,700 | Reference cards, Later shelf, concordance |
| `research/notes/05-prose-revision-feedback.md` | Revision, feedback, checkers | about 6,100 | Drawer, snapshot upgrades, reader packet |
| `research/notes/06-short-fiction-and-submission.md` | Short forms, submissions, formatting | about 6,000 | Manuscript export, submission log |
| `research/notes/07-poetry.md` | Poetry, whitespace, sound, collections | about 6,300 | Poem mode, export fidelity, French |
| `research/notes/08-other-forms-and-genres.md` | Screenwriting, memoir, fan fiction, genre | about 6,000 | Cross-form patterns, memoir ethics |
| `research/notes/09-tools-landscape-and-gaps.md` | Tool complaints, browser storage | about 5,400 | Safekeeping design, where to win |
| `research/notes/10-wellbeing-career-and-ai.md` | Income, mental health, AI, mission-claim check | about 7,100 | Honest copy; AI policy |
| `research/notes/11-accessibility-neurodivergence-language.md` | WCAG, neurodivergence, languages | about 8,000 | Accessibility checklist, language foundations |
| `research/notes/12-how-writers-learn-and-think.md` | Cognition, learning, professional process | about 7,900 | Evidence ledger; sparks; prompts |
| `research/notes/13-community-voice.md` | Round 2: forums, threads, blogs and reviews on tools, trust, AI, pricing, segments | about 7,000 | Positioning, the AI pledge, import/export, sync decision |

### Most load-bearing sources (all appear with full URLs and quality notes in the notes)
- **Habit and starting:** Sword 2016 (a mantra dismantled); Steel 2007 (procrastination meta-analysis); Gollwitzer & Sheeran 2006; Masicampo & Baumeister 2011; Lally et al. 2010 (via BPS digest); Silverman et al. 2023 and Etkin 2016 (streaks and quantification); Rose 1980; Ahmed & Güss 2022.
- **Cognition and revision:** Kellogg's working-memory progress report (JoWR); Sommers 1980; Flower & Hayes 1981; Graham & Perin 2007 and Graham, Hebert & Harris 2015 (school meta-analyses); Sio & Ormerod 2009 (incubation); Urry et al. 2021 (handwriting replication).
- **Evidence on mission claims:** Frattaroli 2006; Rude et al. 2023; Dodell-Feder & Tamir 2018; Kyaga et al. 2013; UK ALCS/CREATe 2022 and Authors Guild 2023 income surveys.
- **AI and writers:** Authors Guild (Dec 2023), Society of Authors (2024), Cambridge novelist survey (2025), Doshi & Hauser 2024, 404 Media and Publishers Weekly on NaNoWriMo.
- **Platform and standards:** Ink & Switch local-first essay; MDN storage quotas and eviction; WebKit storage-policy and tracking-prevention posts; web.dev persistent storage; WCAG 2.2 Understanding documents; Tiptap accessibility guide; EPUB Accessibility 1.1.
- **Craft and forms:** Fountain spec; Follows' page-per-minute data; Cincinnati Review on the flush-and-hang; Olson's *Projective Verse*; AO3 tag FAQ; Poets.org form glossary; Clarkesworld's submission guidelines; Shunn's guide (partially read).

---

## 11. Round 2: what writers say about tools like Parchemin

Source: `research/notes/13-community-voice.md` (2026-10-04). One researcher, no subagents. The local thread corpus grew to 622 threads (two new Hacker News themes, `products` and `trust`, in `research/tools/queries.json`). Reddit, Royal Road, AppleVis and MetaFilter could not be read, and nothing was done to get around that. Quotes from the local corpus were checked word for word. Quotes from the web came through a summarizer and need re-checking before any public use.

### 11.1 What writers are looking for, ranked

1. **Words that cannot be lost, locked or taken.** Writers tell of losing work to a phone dropped in a pool, a deleted book, a corrupt Scrivener project, and a Google Docs flag that cut readers off from a romance author's 222,000 words of drafts. Local storage solves "locked" and "taken". "Lost" is only solved when the writer can see a copy outside the browser.
2. **Words that stay theirs.** Writers remember each scare: the Google Docs and Word AI-training scares (both denied by the companies), AO3 scraping, Wattpad's automated moderation, Grammarly cloning real writers' styles, NaNoWriMo's AI statement, and Apple's writing tools appearing inside Scrivener. Romance, queer and fan writers are the most exposed to moderation.
3. **Writing on any device.** This is the most frequent functional request. Google Docs is loved for working "from phone, laptop, work pc, gaming pc, or my fridge". At least one writer left a web-only PWA over it.
4. **Starting fast and growing into it.** The most common complaint about rich tools is that the tool itself became the procrastination.
5. **The long work in one place** (out-of-order writing, notes beside the draft, templates you can switch).
6. **Getting work out:** .docx for agents and editors, AO3-ready HTML (a Docs-to-AO3 script has about 34,000 Tumblr notes), and poem-safe layout. **And getting work in:** "I've more than a million words in it so it's unlikely I'll switch". Parchemin has no import.
7. **Honest, knowable pricing.** Writers ask "how much", "can I run it myself", "how do you plan to sustain it". They resent subscriptions and value one-time payment and open source.
8. **A process that fits the person:** out-of-order writing, several projects, dictation, read-aloud, units other than words, no guilt numbers.
9. **Company without surveillance.** Writers miss NaNoWriMo and now run their own challenges with TrackBear, spreadsheets and Discord.

### 11.2 How people feel about each part of the product

- **No generative AI:** strongly positive in fan, poet, queer and French literary circles. Tools that took a public stand (Ellipsus, Novlr, Scrivener) gained goodwill that spread by word of mouth. Some nuance: many writers accept AI for research and spellcheck. In a vendor survey, 75% of French authors used some AI-assisted tool.
- **Local-first, no account:** positive, but "How do I save?" and "sync?" follow straight away. **Browser storage specifically is doubted**: Dabble's web app shows a standing "Data may be evicted" warning, and "website only (sure, PWA...)" drove one writer back to Scrivener.
- **Templates and craft tools:** welcome when optional and switchable. Resented as homework or a cage.
- **Calm and minimal:** liked, and very common ("YADFWA"). It will not set Parchemin apart. The finishing method will.
- **Free, indie-made:** welcome, and then questioned (business model, lock-in). Launch copy that sounds AI-written draws immediate criticism.

### 11.3 What this changes in the opportunity list (section 6)

**New:**
- **Import** of .docx, .md and .txt, several files at once, split into chapters. Scrivener later.
- **A plain-language "Your words" page**: no server, nothing trained on, nothing moderated, no account, how to leave, what happens if Parchemin stops, how it is funded.
- **Close the browser's own AI doors**: `writingsuggestions="false"` on the editor (`src/components/SceneEditor.tsx:65`), plus a help note on Apple Intelligence, Chrome "Help me write" and grammar extensions. The attribute is not Baseline, so the help note carries more weight.
- **A path between devices**: a clear "move my library" flow now. If sync is ever built, it should be **end-to-end encrypted and optional**, so no server can read or moderate the text and question 6 still passes.
- **A long-manuscript performance check** (150,000 words, phone).
- **CSV export of daily counts** so writers can take numbers, never text, to TrackBear or a group.
- **French-first checks**, including the Antidote browser connector in the Tiptap editor.

**Raised in priority:**
- Safekeeping, persistent storage and folder copy (Tier 1 #2, Tier 2 #17).
- Manuscript .docx and poem-safe export (Tier 2 #10, #16).
- "Copy for AO3", moved up from the Tier 3 fan-fiction kit.
- Read-aloud (Tier 1 #6).
- Rhythm view with more units (Tier 1 #4).

### 11.4 Decisions for the team (note 13 section 7; decided on 2026-10-04, see 11.6)
1. **The AI pledge.** `PHILOSOPHY.md` still leaves room for an opt-in assistant. The testimony favours a durable "no generative AI in Parchemin" promise. Writers read "AI neutral" and "opt-in later" as hedges, and the NaNoWriMo and Grammarly episodes show how fast trust breaks. The recommendation is to make the pledge. The decision belongs to the team.
2. **Funding and exit:** say how Parchemin is paid for and what happens to writers' work if it stops.
3. **How the app was built:** have a true answer ready to "Was this app built with AI?".
4. **Sync:** whether to build it, and if so, end-to-end encrypted and optional.

### 11.5 Still open
- A human pass on Reddit (search list in note 13 section 8).
- The interviews: `research/interviews/tally.csv` is still empty. Three questions to add: where else they write besides their main device; what it would take to move a current project into a new app; how they would feel about a "never AI" promise.
- Demand is not measured. Note counts show reach, not how many writers would switch.

### 11.6 Decisions taken (2026-10-04)

Recorded from the team doc "What writers say about tools like Parchemin" and the follow-up conversation. `PHILOSOPHY.md` and `AI-POLICY.md` (draft) were updated to match.

**The four questions**

| Question | Decision | Still open |
|---|---|---|
| AI pledge | **Option (b):** keep generative AI, but optional, off by default and limited in what it generates. It is a guide and an organizer that suggests and guides, never interferes with the creative process, and never generates large sections. It is self-hosted. Reasoning given: writers mostly fear copyright and data collection, and AI should be brought into creative work ethically | Decided: suggestions reach the manuscript **only if the writer types them**; nothing is inserted with a click |
| Model training | Train locally, **without writers' data** (this replaced an earlier note in the doc about training on data writers explicitly give). Base models are **named publicly, with what they were trained on**. The guide **adapts to the writer's own style** on the writer's own server, and nobody else can access that data | The model list in `AI-POLICY.md` is still to fill in |
| Funding and exit | Open source, funded by donations, contributions and media visibility. A hosted cloud service may come later and will always be optional. If funding stops, the app keeps working | No licence file yet |
| How the app is built | Disclosed openly: the app is built and maintained with AI. The founder will write a personal launch note explaining why | None |
| Sync | Sync across phone, laptop and desktop, optional. Writers can host it themselves, so the self-hosting guide must be very simple, run on any hardware, and be easy to maintain | How it works: an account, a recovery phrase, or device pairing. End-to-end encryption is recommended (note 13) but not yet decided |

**The proposals**

| # | Proposal | Decision |
|---|---|---|
| 1 | "Your words" page | Agreed |
| 2 | Switch off browser writing suggestions, plus a help note | Agreed |
| 3 | Human-voice pass on public text | Agreed (in conversation; the doc's dropdown still read "Not now" at rev 2533) |
| 4 | First-run timing test | Not now |
| 5 | Visible safety and a folder copy | Agreed |
| 6 | Import | Agreed |
| 7 | .docx, "Copy for AO3", poem-safe export | Agreed |
| 8 | Move library between devices, then optional sync | Agreed |
| 9 | Long-manuscript performance check | Agreed |
| 10 | Rhythm view, other units, CSV of daily counts | Agreed |
| 11 | Read-aloud | Agreed. The team suggests a self-hosted voice model as an option |
| 12 | Notes pane beside the draft | Agreed |
| 13 | Private challenge mode | Agreed |
| 14 | French first | Not now |
| 15 | Ready-to-post queue | Agreed |
| 16 | Self-hosted AI guide (added by the team) | Agreed. Size L |
| 17 | Sync across devices (added by the team) | Agreed. Size M |
| 18 | Very easy installation, "since artists aren't technical people in most cases" (added by the team) | Agreed. Size M |
| 19 | Calm, animated poem mode, maybe gamified (added by the team) | Parked: an idea to try with poets first |

**Where these depart from the research.** Note 13 recommended a lasting "no generative AI" pledge, and round 1's reject list (section 7) excluded generated text. The team chose differently for an optional, limited guide. `AI-POLICY.md` keeps the parts of round 1's AI policy (note 10 §4.6) that still apply: off by default, labeled, nothing enters the manuscript unless the writer types it, no training for anyone but the writer, models named, and changes announced before they land. The team removed a "no imitating a named writer" rule, because the guide has to adapt to the writer's own style. That adaptation happens entirely on the writer's own server. The research's main warning stands: writers judge the generation limit by what the guide actually does, so the limit should be concrete and public before launch.

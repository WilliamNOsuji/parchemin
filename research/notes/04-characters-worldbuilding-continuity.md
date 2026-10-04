# Research note 04: Characters, worldbuilding and continuity

Researcher: area 04 of 12. Date: 2026-10-03.

## How to read this note

- Method: about 14 web searches and about 35 page fetches. The shared web-search budget ran out partway through, so several planned topics were not researched (see section 5). Everything below that carries a URL was fetched or appeared in search results. Anything else is marked **unverified**.
- Evidence quality is mostly low to medium. This area has almost no controlled studies. The evidence is craft essays by working authors and teachers, vendor blogs (which are biased), reviews, and forum anecdotes. Where a claim comes from a vendor selling a competing product, the note says so.
- Confidence labels: **High** = several independent sources agree and it matches how the tools behave. **Medium** = a few sources, plausible, mostly anecdote. **Low** = one source or a vendor claim.
- Fetched summaries came through a small summarising model. I treat them as paraphrase, not verbatim. No direct quotes are used except short ones that appeared in the fetched text and are attributed.

---

## 1. Executive summary

1. **The biggest unmet need is low-friction capture, not more fields.** Every major tool is criticised for setup time and learning curve (World Anvil, Aeon, Campfire, Novelcrafter, Obsidian). Writers say the tool "becomes its own project." A tool that costs a minute to use will beat one that is more powerful.
2. **Worldbuilding that replaces writing is a real, well-documented pattern.** It is called "worldbuilder's disease." Its stated causes are fear of losing ideas, no natural stopping point, and procrastination dressed up as work. The usual remedy is to build only what the story touches, in depth rather than breadth. Tools that reward adding more entries make it worse; Campfire's own reviewers warn about tinkering.
3. **"Characters all sound alike" is mainly a motivation problem, not a vocabulary problem.** Multiple craft sources say differences in what a character wants and fears matter more than accents or catchphrases. That matches how Parchemin's 21 voices are already built. The no-names test (cover the tags, see if you can tell who speaks) is the common diagnostic.
4. **Continuity failures have a few concrete, checkable kinds.** Names and aliases, physical traits, ages and elapsed time, who knows what, and rules (magic, tech, geography). Most can be searched for in the text without AI. The strongest existing continuity tools (Aeon Timeline, Novelcrafter Progressions) work by tying facts to a position in the story's time.
5. **Backstory frameworks (ghost, wound, lie, want, need) are widely taught and widely misused.** The common misuse is backstory as decoration: a tragic event that justifies one plot beat and never changes behaviour. Terminology also differs between teachers, which confuses new writers. Parchemin's hero check already asks the right behaviour-focused questions.
6. **Personality typing (Enneagram, MBTI) is popular with writers but weakly grounded.** Even its advocates in the sources say to use it as a lens on an already-formed character, not a mould. Psychologists criticise MBTI reliability and validity. If Parchemin ever offers typing, it should be optional and framed as one lens among others.
7. **Research overload in historical fiction has a settled playbook.** Mark the gap in the draft and keep going, time-box research, keep a sources notebook, and cut most of what you learned. A "to check" marker in the editor fits Parchemin well and is cheap.
8. **Lock-in, price, and sync are real complaints.** World Anvil reviews cite pricing and billing disputes and lost notes. Campfire's full suite costs $375 lifetime. Novelcrafter's value depends on cloud features and AI. Parchemin's offline, no-account, open-export stance is a genuine differentiator for this area, not just a principle.
9. **Most dedicated tools target fantasy/sci-fi, series and tabletop GMs.** A calm app for short stories and first novels has a gap: obstacle-first settings, a cast grid showing friction, and a light continuity ledger, none of which require wiki-building.
10. **Ideas that auto-generate lore, characters, names with an AI, or "fix" continuity by rewriting text should be rejected.** Local, deterministic helpers (search, lists, grids, warnings) fit the philosophy.

---

## 2. Problems

Severity scale: High (stops people finishing or ruins the finished book), Medium (hurts quality or costs time), Low (annoyance).

### P1. Worldbuilder's disease (building replaces writing)

- **Description.** Writers spend months or years on maps, histories, languages and magic systems and never reach, or stall within, the story. Stated causes: no natural end point to building, fear of losing ideas, wanting to emulate Tolkien, treating setting as the main task, and using building to avoid hard plot and character work.
- **Who it is for.** Mostly fantasy and sci-fi writers, game masters, and first-time novelists. Some writers say they enjoy it and do not see it as a disease (see below).
- **Evidence.**
  - Sanderson's 2025 lecture notes warn that you "could spend so long on this that you get paralyzed" and advise key areas in depth, deadlines, and expanding what you have before adding new things. https://www.brandonsanderson.com/blogs/blog/worldbuilding-tools-lecture-2025 and https://www.brandonsanderson.com/blogs/blog/guide-to-sandersons-laws-of-magic-lecture-notes (Confidence: high that he teaches this; these are lecture notes, not data.)
  - Forum accounts: some writers produce dozens of pages for the world and a couple for the story; one says "diagnosis, discipline, deadlines"; another builds only "as they become necessary according to the story"; another calls it a valid pursuit of its own ("geopoetry"). https://mythicscribes.com/community/threads/have-you-ever-contracted-world-builders-disease.18566/ (Anecdote, a self-selected forum. Confidence: medium.)
  - A 2016 blog attributes it to wanting to imitate Tolkien and to D&D culture and says the cure is to start the story now and leave deliberate gaps. https://interestingwizard.blogspot.com/2016/06/worldbuilders-disease.html (Opinion.)
  - World Anvil's founder (Janet Forbes, per the Goodreads post) names three causes: lack of perspective, verbose note-taking, fear of losing ideas. https://www.goodreads.com/author_blog_posts/21217267-3-most-common-worldbuilding-mistakes-for-writers-and-how-to-fix-them (Vendor with an interest in note-taking tools.)
  - Origin of the term: several pages credit Sanderson (e.g. https://readable.com/blog/worldbuilding-as-a-creative-writing-pitfall/); World Anvil's article names no originator (https://academy.worldanvil.com/blog/what-is-worldbuilders-disease). **Unverified** who coined it. The Readable page itself contains no studies or data.
- **Severity.** High for the people it affects. It is a failure to finish, which is Parchemin's core concern.
- **Nuance.** A few writers find building rewarding for its own sake. A calm app should not scold them; it should keep the way back to the page easy.

### P2. Tools that become their own project

- **Description.** The tool meant to organise the world needs configuration, templates, plugins, and re-entry of existing material, and then feels like admin.
- **Evidence.**
  - World Anvil: "sharp learning curve" and features aimed at tabletop RPG users, lack of a mobile app (Kindlepreneur review) https://kindlepreneur.com/world-anvil/ ; Trustpilot (rating about 4.0 from about 261 reviews as fetched) mixes praise for support with complaints of navigation complexity, lost notes and renewal and billing disputes https://www.trustpilot.com/review/worldanvil.com ; a competitor's marketing page collects user quotes ("dozens and dozens of features, none of which I needed") and says World Anvil itself reorganised features in a Dec 2024 update to be "less overwhelming" https://inkwarden.app/blog/world-anvil-alternative-inkwarden (competitor bias, so treat the quotes as unverified but plausible).
  - Aeon Timeline: a Writer Unboxed reviewer calls it "a potential timesuck" for people who over-organise https://writerunboxed.com/2022/03/30/can-you-be-too-organized-a-writers-review-of-aeon-timeline-software/ ; its own forum describes a steep learning curve https://forum.aeontimeline.com/t/what-aeon-timeline-could-be/1186
  - Campfire: Reedsy's review flags procrastination risk from customisation and empty panels, a steep learning curve, and cost at scale https://reedsy.com/blog/guide/book-writing-software/campfire-write-review/
  - Obsidian: one author lists steep setup, plugin dependence, sync workarounds and limited mobile use https://pdworkman.com/write-book-with-obsidian/
  - Novelcrafter: reviewers say the Codex is most useful if built inside the tool from the start, and feels like duplicated effort when importing an existing draft (search-result summary; the Medium review page returned 403 so I did not read it). Kindlepreneur calls it "more of an Adobe Photoshop than a Canva" https://kindlepreneur.com/novelcrafter-review/
- **Confidence.** High that the complaint is common across tools.
- **Severity.** High for beginners and short-story writers, who are Parchemin's main audience.

### P3. Flat or interchangeable characters

- **Description.** Characters are described differently but behave the same: same emotional reaction, same wit, same rhythm. Often the writer's own voice leaks into everyone.
- **Evidence.**
  - Bibisco's editorial team lists five signs: swappable dialogue when names are removed, author's voice dominating, identical emotional reactions, dialogue that only moves plot, and narration that sounds the same in every point of view https://bibisco.com/blog/top-5-signs-your-characters-all-sound-the-same/ (vendor blog; widely repeated advice).
  - Author's Pathway lists vocabulary, rhythm, grammar, and tags/beats as techniques, and suggests a "voice journal" per character https://authorspathway.com/writing-process/writing/why-your-characters-sound-the-same-a-guide-to-dialogue-differentiation/ (blog).
  - A search-result summary (several blogs) agrees that the cause is usually not knowing who the character is, so differences in what they say and the attitude behind it matter more than quirks. Confidence: medium. (I could not open the TV Tropes forum thread; it returned 403.)
  - Parchemin's PHILOSOPHY.md and `src/craft/voices.ts` already take this position (voice = want, fear, how they see others; "cover the names" test is planned).
- **Severity.** Medium to high. It is one of the most commonly reported craft problems.

### P4. Backstory as decoration, and backstory dumps

- **Description.** Tragic backstory that explains nothing the character does; a wound that exists only to justify one plot beat; a speech that delivers the past in one scene. Related problem: the vocabulary (ghost, wound, lie, weakness, misbelief, want, need) differs by teacher.
- **Evidence.**
  - "Trauma as decoration" and static versus dynamic backstory https://thewritingking.com/character-backstories/ (blog; opinion).
  - Cliché list (single-scene confession, wound as only trait, single-purpose wound, early full reveal) https://www.screenweaver.ai/blog/trauma-backstory-writing-wounds-without-cliches (vendor blog; opinion, but consistent with other sources).
  - Method of chaining wound to misbelief to behaviour to mannerism, with advice to bury the backstory scene 30 to 50 pages in, by Janet S. Fox https://janefriedman.com/how-to-create-character-mannerisms-from-backstory-wounds/
  - Ackerman and Puglisi: wounds produce the lie; distinguishes major flaws (traceable to a wound) from secondary flaws (upbringing); five need categories https://writershelpingwriters.net/2015/10/past-pain-flaws/
  - K.M. Weiland: the Lie must connect to the external plot; ghost and the term "ghost" credited to Truby; says terminology varies and the principles matter more than the labels https://www.helpingwritersbecomeauthors.com/character-arcs-2/ and https://www.goodreads.com/author_blog_posts/23810054-what-s-the-difference-your-character-s-ghost-vs-wound-vs-lie-vs-weak?tab=book
  - Want versus need: the Lie creates the Want; the Need is the Truth; sometimes you must give up the Want https://www.helpingwritersbecomeauthors.com/character-arcs-3/amp/
- **Confidence.** High that these frameworks are the dominant teaching. Medium that the "misuse" list is common; it is multiple blogs agreeing, not measured.
- **Severity.** Medium. Parchemin already has ghost, flaws, need fields and a ten-question hero check.

### P5. Personality-system misuse (Enneagram, MBTI)

- **Description.** Writers lean on typing systems to build characters, and get stereotypes or only a handful of possible arcs.
- **Evidence.** Weiland (an advocate) says use it as "a tool, not a Magic 8 ball", apply it to already-dimensional characters, and do not shoehorn characters into a system https://www.helpingwritersbecomeauthors.com/use-the-enneagram-to-write-better-characters/ ; a search-result summary of a related page notes nine types imply only nine lies and arcs. Critiques of MBTI reliability and validity from psychologists (Pittenger 2005, Grant) appear in search results, but I did not open those papers; a Psychology Today piece defends the test and the results note some meta-analyses report acceptable test-retest reliability. (Confidence: medium that scientific standing is weak; **unverified** in detail.)
- **Severity.** Low to medium. The risk is formulaic characters and false authority, not a failure to finish.

### P6. Continuity errors across a long manuscript or series

- **Description.** Eye or hair colour changes, ages drift, a character knows something they were never told, a rule of magic is quietly broken, geography changes, timeline sequence contradicts itself.
- **Types** (Wikipedia, general): plot errors, aging discrepancies, characters referencing events before they occur or lacking knowledge they should have, small "Homeric nod" lapses https://en.wikipedia.org/wiki/Continuity_(fiction) . Producers use story bibles and script supervisors.
- **Evidence for author practice.**
  - Series tips: track characters, timeline (with weather and seasons), and plots; use a binder, colour-coding, and search to find facts from earlier books (Darcy Pattison) https://www.goodreads.com/author_blog_posts/15409017-series-tips-characters-timeline-plot
  - Forum and tool-review snippets: character sheets exist so a love interest does not have blond hair in book 3 after brown in book 1; tracking phone-text contacts in Scrivener needs spreadsheets (search-result summary; I could not open the original posts). Confidence: medium.
  - Aeon Timeline computes ages at events and warns when constraints (event A must come before B) are violated https://writerunboxed.com/2022/03/30/can-you-be-too-organized-a-writers-review-of-aeon-timeline-software/
  - Show bibles list things as small as a character's food allergies and serve as onboarding material for new writers https://en.wikipedia.org/wiki/Show_bible (screenwriting, not novels)
- **Severity.** High for novels and series, low for most short stories. For beginners, the most common practical form is probably names and ages drifting during a long draft (**unverified** as a frequency claim).

### P7. Who knows what, and when

- **Description.** Mysteries, thrillers, romance misunderstandings and any plot built on secrets need a running record of what each character has learned and from whom.
- **Evidence.** Only weak sources: search-result summaries of tool and blog advice describing "clue trackers" and columns such as "who discovers it" and "who knows about it" (low-quality, partly AI-vendor pages; not opened). Scrivener forum snippet: spreadsheet needed for character columns by time segment. LegendKeeper is described in the Storyflow vendor roundup as strong at "player-secret management" for game masters https://storyflow.so/blog/best-tools-worldbuilding-2026 (vendor).
- **Confidence.** Low for evidence of how writers actually track it; medium that it is a real need for the mystery and thriller genres.
- **Severity.** Medium to high for those genres; irrelevant to many.

### P8. Lore dumps and info dumps

- **Description.** Worldbuilding researched or invented is poured into the prose through narrated history or characters telling each other what both already know.
- **Evidence.** Quill & Steel (Rita Melkonian) lists eight fixes: show through action, filter through character perspective, iceberg method, small pieces, curiosity gaps, and "organize your worldbuilding outside the book" so you are not tempted to dump it. The test it gives: if cut, would the reader be confused, and does it raise tension, develop character, or move plot? https://www.quillandsteel.com/blogs/writing-tips/info-dumps-fantasy-worldbuilding . Sanderson: integrate details through character interactions rather than exposition https://www.brandonsanderson.com/blogs/blog/worldbuilding-tools-lecture-2025 . Jane Friedman guest post: Dickens-style weaving, illustrate history rather than exhaustively describe https://janefriedman.com/dos-and-donts-of-writing-historical-fiction/
- **Confidence.** High that this is standard advice. Medium that it is a top-3 problem; no frequency data.
- **Severity.** Medium.

### P9. Research overload and anachronism (historical fiction)

- **Description.** Research turns into the project; writers stuff the book with what they learned; characters think or speak in ways wrong for the period.
- **Evidence.**
  - Angela Petch's eight tips: notebook and phone camera, put X marks and a margin note in the draft to verify later, keep a separate sourced research notebook, use a timer, cut heavy details in editing, treat research as procrastination ("research doesn't get the story written; only writing does") https://www.writersdigest.com/historical-fiction/8-tips-on-how-to-avoid-rabbit-holes-in-research-while-writing-historical-novels
  - Andrew Noakes (The History Quill): include only a fraction of research; set your own rules for bending fact and keep them consistent; avoid "psychological anachronism" (quoting Patricia Finney); do not use fully accurate period dialogue because it would be unreadable; prioritise believability over strict accuracy where needed https://janefriedman.com/dos-and-donts-of-writing-historical-fiction/
  - Search snippets repeat "discard 95 percent of it" and "list all tools, weapons, and household items and check invention dates." The origin of the 95 percent figure is **unverified**.
- **Severity.** Medium to high for historical writers; relevant to any research-heavy story.

### P10. Naming problems

- **Description.** Characters with similar names or initials confuse readers; generators produce names that do not fit a culture; invented-language names are inconsistent.
- **Evidence.** None gathered. The search budget ran out before this topic. I know of no source I can cite for the claim that similar initials confuse readers, so treat it as **unverified common craft advice**.
- **Severity.** Low to medium; cheap to help with.

### P11. Constructed languages as scope trap

- **Description.** Inventing a language is a huge task, and piecemeal invention yields inconsistency.
- **Evidence.** Mark Rosenfelder's Language Construction Kit advises a sequence (sounds, then lexicon, grammar, writing system, then texts) and says working backwards from text "will lead to an inconsistent if not incoherent work"; it uses Hergé's Syldavian as the example of ad-hoc invention being impossible to systematise http://zompist.com/kit.html (primary source by an experienced conlanger). Wikipedia notes professional conlangers built Dothraki, Klingon, Na'vi, so the work is specialist https://en.wikipedia.org/wiki/Constructed_language . Campfire is described as having a languages module with "no equivalent in any other mainstream author platform" https://scribecount.com/author-resource/writing-tools-for-authors/campfire-write-for-indie-authors
- **Tension to note.** Rosenfelder's advice (build systematically first) conflicts with the anti-worldbuilder's-disease advice (build only what the story needs). Parchemin should not lean either way: offer a simple "words and names" list and leave real conlang work to specialist tools.
- **Severity.** Low overall, because few writers do it, but it is high for those who do.

### P12. Setting treated as description rather than force

- **Description.** Rooms and places described but doing nothing.
- **Evidence.** Parchemin's PHILOSOPHY.md already holds this view (setting opposes, reveals, supplies props, then mood). I could not find an external source this session (my fetch of Sanderson's Earth lecture notes had nothing on sensory detail or contemporary settings). **Unverified** externally.
- **Severity.** Medium for literary and contemporary fiction. Campfire's reviewers say its modules suit fantasy and sci-fi, with limited utility for contemporary fiction (scribecount page above).

### P13. Cost, lock-in, sync and data safety

- **Description.** Subscriptions, renewal disputes, lost notes, proprietary storage, no mobile.
- **Evidence.** World Anvil pricing: free tier limited (175 articles per Kindlepreneur; Trustpilot reviewers say it dropped to about 42 and blocked editing), paid tiers $5 to $12 a month and $300 a year for the top tier https://kindlepreneur.com/world-anvil/ . Campfire: individual modules $2/month; all modules $12.50/month or $375 lifetime (Reedsy and scribecount differ slightly, so check before citing). Plottr: Standard about $60/year or $150 lifetime, Pro more (search result, not fetched). Aeon Timeline: about $65 to $69 one-time (search result and Storyflow vendor page). Scrivener: $59.99 one-time (Reedsy, Storyflow). Novelcrafter: $4 to $20 a month plus AI usage if you use it. Trustpilot's World Anvil complaints include "automatically renewed at double the price" and lost typed notes (one reviewer quote). Aeon users ask for open formats and markdown export (forum above).
- **Confidence.** High on direction; prices change and conflict between pages, so do not hard-code any.
- **Severity.** Medium to high. It supports Parchemin's stance.

### P14. Series scope: reusing characters and places across books

- **Description.** Series writers need shared canon across several manuscripts.
- **Evidence.** Pattison above; Novelcrafter's progressions are designed for changes across scenes; Obsidian users build a "wiki folder for series worldbuilding" shared across books (pdworkman page). Wikipedia on show bibles. Parchemin's `Character.storyId` ties a character to one story, so there is a data model gap (see section 4).
- **Severity.** Medium; many first-time writers never get there.

---

## 3. Existing solutions and tools

| Tool | What it does | How well | Complaints |
|---|---|---|---|
| **World Anvil** | Wiki-style articles, interactive maps, timelines, family trees, a novel writing app, templates | Praised for depth, templates, tutorials and support | Learning curve, tabletop-RPG focus, no mobile app (as of the review), pricing tiers and billing, free tier cut, reports of lost notes |
| **Campfire Write** | 17 or 18 modules (characters, locations, timeline, relationships web, maps, languages, manuscript); free tier with limits; desktop apps with offline use | Flexible; pay per module; relational database approach | Cost at full suite, learning curve, tinkering risk, weaker manuscript editor, mobile lacks modules, more suited to fantasy/sci-fi |
| **Novelcrafter Codex** | Wiki entries with aliases, mentions tracking, relations, tracking rules, and "progressions" tied to scenes | Praised for series and consistency; strongest when used from project start | Power over simplicity; re-entry cost for existing drafts; AI-centric; offline and data ownership not covered in sources I read |
| **Scrivener character/setting sketches** | Template sheets inside the binder | Cheap, one-time, flexible | Sheets are static; continuity over time or across characters (texting, knowledge) needs spreadsheets (forum snippet) |
| **Plottr** | Visual plot and timeline planning, character and place cards | Easy to start | Not a chronology engine; one reported crash/lost-work complaint (single Capterra snippet); subscription or lifetime |
| **Aeon Timeline** | Absolute and relative dates, custom calendars, character ages, constraint warnings | Strongest for chronology | Intimidating; timesuck; desktop only; users want open formats and links to notes |
| **Obsidian vaults** | Markdown notes with links, red-link creation of new notes | Local-first, own your files, free | Setup time, plugins, sync workarounds, weak mobile for drafting (Workman page) |
| **Notion** | Generic database | Adequate (vendor ranking) | Not writing-specific (vendor view; no primary evidence read) |
| **Kanka / LegendKeeper / Fantasia Archive** | Wikis aimed at RPG/GMs (per vendor roundup) | Good for secrets-per-player and campaigns | Aimed at tabletop; evidence is a vendor page only |
| **Spreadsheets** | Clue trackers, who-knows-what, name lists | Flexible and offline | Manual; no link to text |
| **Bibisco** | Novel-writing software with character profiles and structure (vendor of the "five signs" post) | Not evaluated beyond its blog | Proprietary per the fetch; unverified in detail |
| **Dabble, Atticus** | Named in the brief | **Not researched** this session | |

### Techniques and how they get misused

- **Character interview / questionnaire.** Not directly sourced. Misuse: pages of trivia (favourite colour) that never reach the page. The writing-king and Fox sources push the opposite: only keep what generates behaviour. Mark as partly unverified.
- **Want / need / lie / ghost (Weiland, Truby lineage).** Taught widely. Misuse: backstory as decoration, wound only for one beat, terminology confusion (see P4).
- **Truby's weakness-need.** I could not open Truby's own material (his home page has course ads only). Parchemin's design already credits Truby. Treat details as secondary-source only.
- **Enneagram and MBTI.** See P5. Advocates themselves caution against rigid use.
- **Iceberg.** Know ten times more than you show. Appears in Sanderson's notes, Quill & Steel, and the Writing King post. Misuse: used as permission to build the whole iceberg.
- **Sanderson's laws of magic.** First: understanding equals satisfying magic solutions; Second: limitations matter more than powers; Third: expand before adding. Sanderson says these are guidelines, not absolutes. https://www.brandonsanderson.com/blogs/blog/guide-to-sandersons-laws-of-magic-lecture-notes
- **Pratchett bottom-up worldbuilding.** Start from one concrete place (the water in, the sewage out) and expand outward, versus top-down continents-first (Wikipedia worldbuilding article, quoting Pratchett). Top-down yields integration at a cost of upfront work. https://en.wikipedia.org/wiki/Worldbuilding
- **Placeholders for research.** X in the text, check later (Petch).
- **Reading aloud.** Common advice in the brief, but I found no source for it this session. **Unverified.**
- **Story bible / show bible.** From screenwriting; used for consistency and onboarding (Wikipedia). For solo novelists, evidence is the Pattison post and tool reviews.

---

## 4. Ideas for Parchemin

Fit key: the six decision questions in PHILOSOPHY.md. "Offline" is whether it works with IndexedDB and no network. Build size: S (a day or two), M (about a week), L (more than a week or a data-model change).

Already built, so don't duplicate: character profiles with custom fields and image and rich bio; `CharacterCraft` (voice, spice, want in room, fear, sees others as, signature, function, psych flaw, moral flaw, ghost, need, hero checks); 21 voices with clash suggestions; ten-question hero check; per-chapter plan with `pov` and `setting` and `prop` as free text. No setting or world entity exists yet. PHILOSOPHY.md's roadmap already lists setting sheets, a cast grid and a voice-blind dialogue test.

### Top picks

**I1. "Later" shelf: a one-keystroke note parked outside the draft (worldbuilding and research capture).** S.
- Idea. From the editor, a shortcut opens a tiny note box, saves a line to a story-level "later" list, and returns the cursor where it was. Can also be tagged "world", "check", "name".
- Why. Directly addresses the most-cited cause of worldbuilder's disease (fear of losing the idea) and the research-rabbit-hole tip of marking the gap and moving on.
- Fit. Strong on Q1, Q3, Q5, Q6. No conflict. Offline yes. New table or a field on `Story`.
- Evidence. P1 (fear of losing ideas named by Forbes and in Mythic Scribes forum), P9 (Petch).

**I2. "To check" marker (TK/X) in the editor, with a book-wide list.** S.
- Idea. Writer types a marker such as `[check]` or highlights text as "verify later". A panel lists every marker across chapters with a click-through.
- Fit. Strong on Q1, Q5, Q6. It never writes anything. Offline yes. Needs a Tiptap mark or a plain-text token plus search.
- Evidence. P9 Petch tip 3. (Origin of "TK" as a journalism convention is **unverified**.)

**I3. Cast grid with friction (already on the roadmap).** M.
- Idea. One table: rows are characters, columns are want-in-room, fear, function, voice family, first and last chapter. Highlight rows with no function or a duplicated voice family; show the "clashes with" suggestion from `voices.ts` for pairs.
- Fit. Strong, matches belief 5 and the roadmap. Offline yes. Reuses existing data. No new fields required.
- Evidence. P3; PHILOSOPHY.md section "Cast".
- Overlap. The data exists; this is a view.

**I4. Setting sheets, obstacle-first, with a prop list (already on the roadmap).** M.
- Idea. A place entry with "what makes it hard", "what it reveals", "objects someone can pick up, fight over or hide behind". Link from the chapter plan's `setting` and `prop` fields.
- Fit. Strong; Q4 (teaches by being used). Offline yes. Needs a new `Setting` type and DB table (S in Dexie).
- Evidence. Internal philosophy; external support only weak (see P12). Campfire's reviewers say contemporary writers get little from fantasy-oriented location tools, which supports an obstacle-first template for ordinary settings.

**I5. Voice-blind dialogue test (already on the roadmap).** M.
- Idea. Writer pastes or selects a dialogue exchange. The app strips names and tags and shows bare lines; the writer assigns a speaker to each, then the app reveals the real attribution. Optionally: a per-character "signature line" check.
- Fit. Strong, teaches by use, fully local. Offline yes.
- Evidence. P3 (the no-names test appears in Bibisco and the search summaries).

### Continuity ideas (optional, quiet)

**I6. Find where (concordance), no AI.** S to M.
- Idea. From a character, place or custom name, one click lists every sentence in the manuscript that contains the name or any listed alias, grouped by chapter. Add a "near" filter: sentences with the name and a word (for example "eyes") within N characters.
- Fit. Answers "what did I say about her eyes" without a rigid database. Writer in control. Offline yes (plain text search over `Scene.content`). Needs an `aliases` field on `Character` (S).
- Evidence. P6 (Pattison: use search; Novelcrafter mentions tab and aliases).
- Caution. Do not auto-flag contradictions as errors. Show the evidence; the writer decides.

**I7. Aliases and quiet mentions.** S to M.
- Idea. Aliases per character; the editor can optionally underline a known name and show a small hover card (role, want, signature). Off by default.
- Fit. Calm if off by default. Offline yes. Note risk: more chrome.
- Evidence. Novelcrafter and Campfire both do mentions and aliases.

**I8. "As of chapter N" facts (progressions, no AI).** L.
- Idea. A character's fields can have dated entries anchored to a chapter ("Ch 4: left arm broken", "Ch 9: now engaged"). The character card shows the state as of the chapter you are in.
- Fit. Matches the Novelcrafter progressions design (changes like marriage, scar, new job; not plot points) and Aeon's idea of state at a time. Offline yes. Requires a model for "anchored value" and a chapter-aware UI. Easy to overbuild, so ship it as optional per field.
- Evidence. P6.

**I9. Timeline-lite: story date and elapsed time per chapter.** M.
- Idea. Optional `storyDate` and `duration` on `ChapterPlan`; a strip shows order and gaps; character ages computed from a birth date field and shown per chapter; warn if chapter order and dates disagree. Fantasy calendars: a later add-on (custom month/day names).
- Fit. Matches Aeon's strongest, least-copied features (age calculation, constraint warnings) without Aeon's heavy interface. Offline yes. Date maths for custom calendars is the hard part.
- Evidence. P6 (Writer Unboxed review; Aeon forum wishlist for fantasy calendar rules).

**I10. Who-knows-what grid.** M to L.
- Idea. Rows are secrets or facts (writer-typed). Columns are characters. Cells: knows from chapter N. A plain table, not a graph.
- Fit. Valuable to mystery and romance writers; invisible to everyone else if optional. Offline yes.
- Evidence. P7 is the weakest-evidenced problem here. Prioritise after I3 to I6. Consider shipping as a template within a generic "entry" type (see I12).

### Structure and data-model ideas

**I11. Make an entry from selected text.** S to M.
- Idea. Select a name or phrase in the editor, press a key, and create a character, place or "later" note pre-filled with that name. Works like Obsidian's red-link creation.
- Fit. This keeps "blank page first": the world grows out of the draft, which is the cure Steerpike and Interesting Wizard describe (build as needed). Offline yes.
- Evidence. P1, P2.

**I12. Generic entry type with small templates (place, object, group, rule, term).** M.
- Idea. Generalise the character custom-fields mechanism: an entry has a type, free fields, and an optional template. Templates: Place (obstacle-first), Object/prop, Group, Rule (power, cost, limit, who can use it, what it can't fix, following Sanderson's second law), Term/word list.
- Fit. A "rule" template teaches limitations by being used (Q4). Must be easy to ignore. Offline yes. Overlaps I4.
- Evidence. Sanderson laws; Campfire's modular approach shows demand, but also its overhead, so start with three types.

**I13. Names helper without generation.** S.
- Idea. A name collision check: list all character names by first letter and length, and warn gently when two main characters share an initial or sound alike. A writer-owned "names I like" list. Optionally ship a small offline list of names by language and period if a source with a clean licence can be found.
- Fit. Fits all six questions; the list-by-initial view is purely local. A name bank requires a licensed data set (**unverified** whether suitable open data exists).
- Evidence. None gathered (P10). Based on common craft advice, **unverified**.

**I14. Series: shared characters and places across stories.** L.
- Idea. A "universe" or "series" folder that stories belong to; characters and entries can be shared or copied. Backup and export need to handle shared entries.
- Fit. Strong for the series writers who most need continuity; serious data-model change (`Character.storyId` is single). Not for MVP.
- Evidence. P14.

**I15. Story bible export.** S.
- Idea. Export characters, places and rules as Markdown or an appendix in the EPUB, or a standalone file. Aligns with "clean way out".
- Fit. Strong on belief 6. Offline yes. Extends `src/export.ts`.
- Evidence. P13 (lock-in complaints); Aeon users asking for markdown export.

**I16. Read aloud with the device's speech synthesis.** S.
- Idea. A "hear this passage" button using the browser Web Speech API.
- Fit. Fine, optional. Offline depends on installed OS voices (varies by device; **unverified** across platforms). Reading aloud as a revision aid is common advice but I found no source this session.

### Optional, handle with care

**I17. Typing systems (Enneagram or MBTI) as an optional reference.** S.
- Verdict. Not recommended as a core feature. If offered, label as "one way of looking", allow it to be hidden, never assign a type automatically, and say nothing about science. Note that `voices.ts` already uses six families "built on what a character wants", which gives most of the benefit without leaning on a contested instrument. Note the Enneagram has no commonly agreed theoretical basis (summary of a search result).

**I18. "Enough world" check (anti-worldbuilder's-disease nudge).** S.
- Idea. A quiet panel showing, per entry, whether it appears in any chapter, not as a score. For example "not mentioned in the draft yet" beside a place entry.
- Fit. Could help a writer see where lore has not met the story, but it can feel like judgment if worded badly. Test wording against the philosophy: neutral facts only, no percentages, no "you have too much".
- Risk. Medium; worth user testing.

### Reject

- **Reject: AI that generates lore, magic systems, characters, names, or backstories for the writer.** Violates "never write the story" (Q1, Q2). The Obsidian "Substrate" system uses AI to synthesise notes and flag contradictions https://forum.obsidian.md/t/substrate-idea-management-and-worldbuilding-for-fiction-writers-method-custom-vault-ai-no-code/114850 ; the idea of flagging contradictions across the writer's own notes is useful, but only if done deterministically on-device or with explicit opt-in and no training. As a default, reject.
- **Reject: auto-extracting characters and facts from the manuscript with a cloud LLM.** Data harvesting risk and violates "no account, offline."
- **Reject: worldbuilding streaks, entry-count progress bars, or "world completeness" scores.** These manufacture the exact behaviour (adding more) that causes worldbuilder's disease and add guilt mechanics.
- **Reject: "fix continuity" buttons that rewrite text.** Ghostwriting by another name. Flag, point, let the writer decide.
- **Reject: mandatory templates or required fields for characters or places.** Violates "structure is optional."
- **Reject: paywalling modules or capping entries, as Campfire and World Anvil do.** Conflicts with belief 6 and the calm room.

---

## 5. Open questions and gaps

Not researched, because the shared web-search budget ran out:

- **Naming:** what makes names confusing for readers, how writers actually pick names, whether open name data sets with clean licences exist.
- **Relationships and how writers track them:** only the vendor descriptions of relationship webs were seen. No evidence about whether writers actually use network diagrams, or whether a pairwise grid works better.
- **Reading aloud, character interviews, Truby's own text, setting and sensory detail for contemporary and literary fiction, poetry.** I have no sources on poetry or on sensory detail. This is a real hole for "any genre".
- **Dabble, Atticus, Notion, Kanka, LegendKeeper:** no firsthand review read.
- **Frequency data:** no data on how many writers hit continuity errors or worldbuilder's disease, or whether tracking tools reduce errors. All claims are craft opinion, vendor claims or forum anecdote.
- **Famous continuity errors in published series and how editors catch them (continuity editors, style sheets):** searched but not retrieved.
- **Whether outlining or discovery writing correlates with continuity problems** (gardener versus architect): not retrieved.
- **Theory of mind and fiction-reading claims** (philosophy belief 3): the Theory of mind Wikipedia page had nothing on it, so I could not check how well-supported the claim is. Another researcher should check, because the philosophy warns against overclaiming.

Open product questions for the coordinator:

1. **How much structure for non-fantasy writers?** Campfire's reviews suggest world tools suit genre fiction. Should the first place/setting feature be framed for a kitchen or an office, with fantasy worlds as one template?
2. **Aliases and mentions: is a quiet underline in the editor worth the added chrome?** Needs a test with real writers.
3. **Does a continuity ledger belong in v1?** Concordance search (I6) is cheap; progressions (I8) and timelines (I9) are big. Is the audience first-time and short-story writers, who rarely need them?
4. **Series support.** If series writers are a target, the data model must change before more entities are built on `storyId`.
5. **Local text analysis versus the "no AI" line.** Simple string matching is clearly fine. Is a local model for contradictions in scope, or off the table until the opt-in assistant exists?
6. **Terminology.** Teachers disagree on ghost, wound, lie, weakness. Parchemin uses psychFlaw, moralFlaw, ghost, need. Should the app show one set of plain-language labels and avoid jargon? (Weiland herself says labels matter less than principles.)
7. **Test the anti-disease nudges (I1, I18) with users.** The line between helpful and judgmental is narrow.

---

## 6. Source list

Fetched pages are marked F. Pages that only appeared in search results are marked S (I did not read them).

| # | URL | Quality note |
|---|---|---|
| 1 | https://www.brandonsanderson.com/blogs/blog/worldbuilding-tools-lecture-2025 (F) | Primary: the author's own lecture notes, 2025. Good on iceberg, depth over density. Notes, not data. |
| 2 | https://www.brandonsanderson.com/blogs/blog/guide-to-sandersons-laws-of-magic-lecture-notes (F) | Primary. Three laws, "nothing is absolute". |
| 3 | https://www.brandonsanderson.com/blogs/blog/how-to-worldbuild-on-earth-brandon-sanderson-writing-2025 (F) | Primary, but the fetched text had nothing on contemporary settings or sensory detail. |
| 4 | https://mythicscribes.com/community/threads/have-you-ever-contracted-world-builders-disease.18566/ (F) | Forum anecdotes, self-selected; useful first-hand voices. |
| 5 | https://interestingwizard.blogspot.com/2016/06/worldbuilders-disease.html (F) | Single-author blog opinion, 2016. |
| 6 | https://academy.worldanvil.com/blog/what-is-worldbuilders-disease (F) | Vendor content (World Anvil); no originator named. |
| 7 | https://readable.com/blog/worldbuilding-as-a-creative-writing-pitfall/ (F) | Content-marketing blog; credits Sanderson; no data. |
| 8 | https://www.goodreads.com/author_blog_posts/21217267-3-most-common-worldbuilding-mistakes-for-writers-and-how-to-fix-them (F) | World Anvil founder (Janet Forbes per page); vendor interest. |
| 9 | https://kindlepreneur.com/world-anvil/ (F) | Reasonably independent review; prices may be dated. |
| 10 | https://www.trustpilot.com/review/worldanvil.com (F) | Customer reviews; skews to complainers and the very happy; summarised by a model. |
| 11 | https://inkwarden.app/blog/world-anvil-alternative-inkwarden (F) | Competitor marketing; quotes unverified. |
| 12 | https://www.goodreads.com/author_blog_posts/20877194-world-anvil-for-story-bibles-organization-discovery-to-write-have-w?tab=book (F) | Only a podcast announcement; no content used. |
| 13 | https://reedsy.com/blog/guide/book-writing-software/campfire-write-review/ (F) | Reedsy is a publishing services company; review has useful pros and cons. |
| 14 | https://scribecount.com/author-resource/writing-tools-for-authors/campfire-write-for-indie-authors (F) | Editorial review; no user complaints documented. |
| 15 | https://www.novelcrafter.com/help/docs/codex/progressions-additions (F) | Primary vendor documentation. |
| 16 | https://www.novelcrafter.com/help/docs/codex/anatomy-codex-entry (F) | Primary vendor documentation. |
| 17 | https://kindlepreneur.com/novelcrafter-review/ (F) | Independent-ish review, affiliate-style site. |
| 18 | https://ilampadmanabhan.medium.com/novelcrafter-review-powerful-for-fiction-writers-frustrating-to-set-up-april-2026-64d391c629a2 (S; fetch returned 403) | Only seen as a search result; used via snippet. |
| 19 | https://writerunboxed.com/2022/03/30/can-you-be-too-organized-a-writers-review-of-aeon-timeline-software/ (F) | Writer's first-hand review (author named Kisacky in the summary), 2022. Good. |
| 20 | https://forum.aeontimeline.com/t/what-aeon-timeline-could-be/1186 (F) | User forum; useful wishlists. |
| 21 | https://novelos.studio/blog/aeon-timeline-alternatives-novelists/ (F) | Competitor blog; heavy bias. |
| 22 | https://storyflow.so/blog/best-tools-worldbuilding-2026 (F) | Vendor roundup; prices and rankings unreliable. |
| 23 | https://pdworkman.com/write-book-with-obsidian/ (F) | One author's first-hand workflow; honest on downsides. |
| 24 | https://forum.obsidian.md/t/substrate-idea-management-and-worldbuilding-for-fiction-writers-method-custom-vault-ai-no-code/114850 (F) | Self-promotion by the creator (F.S. Neal); lists pain points. |
| 25 | https://www.goodreads.com/author_blog_posts/15409017-series-tips-characters-timeline-plot (F) | Darcy Pattison, practising author; series tracking tips. |
| 26 | https://bibisco.com/blog/top-5-signs-your-characters-all-sound-the-same/ (F) | Vendor blog; typical advice. |
| 27 | https://authorspathway.com/writing-process/writing/why-your-characters-sound-the-same-a-guide-to-dialogue-differentiation/ (F) | Blog; practical techniques. |
| 28 | https://www.helpingwritersbecomeauthors.com/use-the-enneagram-to-write-better-characters/ (F) | K.M. Weiland, established craft teacher; advocate with caveats. |
| 29 | https://www.helpingwritersbecomeauthors.com/character-arcs-2/ (F) | Weiland on the Lie. Strong secondary source. |
| 30 | https://www.helpingwritersbecomeauthors.com/character-arcs-3/amp/ (F) | Weiland on want vs need. |
| 31 | https://www.goodreads.com/author_blog_posts/23810054-what-s-the-difference-your-character-s-ghost-vs-wound-vs-lie-vs-weak?tab=book (F) | Weiland on terminology; notes Truby as origin of "ghost". |
| 32 | https://writershelpingwriters.net/2015/10/past-pain-flaws/ (F) | Angela Ackerman (and Becca Puglisi); popular craft resource. |
| 33 | https://janefriedman.com/how-to-create-character-mannerisms-from-backstory-wounds/ (F) | Janet S. Fox, book coach, on a reputable publishing blog. |
| 34 | https://thewritingking.com/character-backstories/ (F) | Single-author blog; opinion. |
| 35 | https://www.screenweaver.ai/blog/trauma-backstory-writing-wounds-without-cliches (F) | Vendor blog; opinion but consistent. |
| 36 | https://www.writersdigest.com/historical-fiction/8-tips-on-how-to-avoid-rabbit-holes-in-research-while-writing-historical-novels (F) | Angela Petch in Writer's Digest; practical. |
| 37 | https://janefriedman.com/dos-and-donts-of-writing-historical-fiction/ (F) | Andrew Noakes, History Quill editor; good on anachronism. |
| 38 | https://www.quillandsteel.com/blogs/writing-tips/info-dumps-fantasy-worldbuilding (F) | Rita Melkonian; a store blog; advice is conventional. |
| 39 | http://zompist.com/kit.html (F) | Primary: Mark Rosenfelder's Language Construction Kit. Authoritative for conlangs. |
| 40 | https://en.wikipedia.org/wiki/Continuity_(fiction) (F) | General reference; film and TV oriented. |
| 41 | https://en.wikipedia.org/wiki/Worldbuilding (F) | General reference; includes the Pratchett quote about bottom-up. |
| 42 | https://en.wikipedia.org/wiki/Show_bible (F) | General reference; screenwriting only. |
| 43 | https://en.wikipedia.org/wiki/Constructed_language (F) | General reference. |
| 44 | https://truby.com/ (F) | Primary but only marketing; no craft content retrieved. |
| 45 | https://writingexcuses.com/ (F) | Landing page only; no episodes read. |
| 46 | https://www.royalroad.com/forums/thread/135333 , https://tvtropes.org/pmwiki/posts.php?discussion=13602124600A45440100&page=0 (fetch returned 403) | Not read. |
| 47 | Pittenger 2005 "Cautionary comments regarding the Myers-Briggs Type Indicator" (ResearchGate), Psychology Today "In Defense of the Myers-Briggs", Adam Grant's critique (S) | Appeared in search results, not read. Cited only as pointers. |
| 48 | https://www.writersdigest.com/write-better-fiction/writing-historical-fiction-in-the-age-of-information-overload (fetch rate-limited) | Not read. |
| 49 | https://writerslife.org/writing-research-rabbit-hole/ , https://hns-conference.com/2022/09/14/dont-go-down-the-rabbit-hole-how-not-to-get-lost-in-the-research/ , https://awriterofhistory.com/2025/04/10/historical-fiction-research-how-much-is-enough/ , https://historyrise.com/article/how-to-avoid-anachronisms-when-writing-about-the-past/ (S) | In search results for historical research; not read. Good follow-ups. |
| 50 | https://www.legendkeeper.com/sandersons-three-laws-of-magic/ , https://cancerwriting.wordpress.com/2022/04/28/brandon-sanderson-lecture-5-worldbuilding-part-one/ , https://www.grantskaggs.com/posts/sanderson-notes (the last returned empty) | Secondary notes on Sanderson; not read or empty. |
| 51 | https://plottr.com/story-genius-character-template-sheet/ , https://www.untanglednarrative.com/the-lie-we-believe/ , https://storytellingdb.com/story-genius-method-lisa-cron/ (S) | Lisa Cron's Story Genius and misbelief; seen, not read. |

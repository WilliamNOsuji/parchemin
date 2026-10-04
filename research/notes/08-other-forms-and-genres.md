# 08. Other forms and genres: what they need that a prose-fiction app lacks

Researcher 8 of 12. Scope: screenwriting and playwriting, memoir and creative nonfiction, fan fiction, genre fiction (romance, mystery, thriller, SFF, horror, YA, children's, comics), journalism-adjacent and academic-adjacent writers, collaboration, interactive fiction, songwriting. Poetry has its own note (07) and is touched here only where it shapes the editor.

## Method and honesty notes (read first)

- About 75 pages were fetched. The WebSearch tool hit its session budget (200 calls) part-way through, and the session hit a usage limit near the end. Several planned sources were never checked: Emily Short on branching structures, the Twine and inkle home pages, IFComp, Reddit threads, and a good primary source for picture-book word counts.
- Many fetches were Wikipedia pages summarised by a small model. I treat those as medium-confidence orientation, not proof. Where a claim comes from my own background knowledge and was not fetched, it is marked **(unverified)**.
- Reddit, The Verge, The Atlantic and Vox were blocked for fetching. Their URLs appear only in the Hacker News listing I fetched, so I list them as "seen, not read" and draw no claims from them.
- Evidence labels: **Direct** = primary source or dataset I read. **Secondary** = reference page or article summarising others. **Anecdote** = opinion, forum comment, practitioner advice. **Vendor** = product page or listicle.
- Several vendor listicles surfaced about screenwriting software. They are low quality and I do not rely on them.

---

## 1. Executive summary

1. **The forms that most overlap Parchemin's likely users are, in order: genre novelists (romance, fantasy, mystery, YA), fan fiction writers, memoirists and personal-essay writers, and co-authors.** Screenwriting, interactive fiction and songwriting are real but have strong specialist tools and fewer people who would choose a calm prose app. (This ranking is my judgement, not measured data. See section 5.)
2. **Every form has a "bible" problem.** TV writers keep show bibles. Fantasy writers keep world notes. Fan writers track canon. Mystery writers track suspects and clues. Memoirists track who is in the story. The shared need is a flexible set of reference cards, not only character profiles.
3. **Fan fiction is the clearest case of a serial, chapter-by-chapter, community-facing form.** AO3 alone hosts over 18 million works (Wikipedia, 2026 figure). It requires a rating, archive warnings and a fandom for each work. Writers need per-chapter notes, content labels and clean export to paste into a site. They do not need a social network inside Parchemin.
4. **Memoir needs ethics and safety scaffolding, not just structure.** Memory is reconstructive. Writing about real, identifiable people carries legal (defamation, privacy) and relational risk. Expressive-writing research shows short-term distress is common, with limited evidence of harm for some groups. A private, calm, offline app is a natural fit, but it must not pose as therapy or legal advice.
5. **Screenwriting is a mature format ecosystem.** Fountain is an open plain-text format with a "make it look like a screenplay" golden rule. The page-per-minute rule is a crude estimate: Stephen Follows' analysis of 2,520 scripts found about 55 seconds per page, and only 18.2% of scripts fall within 5% of one minute per page. Building a full screenplay editor is large and unnecessary. Fountain import/export is small.
6. **Length and format norms differ sharply by form** (screenplay 90-115 pages preferred, SFWA categories for short story/novella/novel, category romance about 55,000 words, picture books in 32-page-style signatures). A gentle, honest "what is typical" ruler helps, as long as it is labelled a norm and never a rule.
7. **Plant-and-payoff tracking recurs.** Mystery clues, romance beats, interactive-fiction state variables, series continuity and even screenplay revisions are all "something set up here must be resolved there." A light "promises" ledger could serve them all.
8. **Collaboration is the form where Parchemin's local-first stance bites hardest.** Real-time co-writing needs a server. But "merge by id" backup restore already exists. A hand-off bundle with per-chapter attribution and a snapshot comparison could cover turn-based co-writing offline.
9. **Open plain-text formats are the norm in the nerd-friendly forms** (Fountain, ChoiceScript, Ink, Twee, Markdown). This matches belief 6 of PHILOSOPHY.md. Export fidelity matters more than building native tools for these forms.
10. **What to reject:** AI that generates canon-compliant fic, tropes or prose, update-schedule streaks for serial writers, public kudos or leaderboard features, and any cloud analysis of memoir text. Evidence from a 157-person survey of fan writers (Alfassi et al., 2025) shows even that community wants transparency and distrusts AI substitution.

---

## 2. Per-form sections

### 2a. Screenwriting and playwriting

**Key problems**
- Format is rigid and element-based: scene headings, action, character, dialogue, parentheticals, transitions. Generic word processors handle page-break constraints poorly (Wikipedia, Screenwriting software; Secondary).
- Length is judged in pages, via the one-page-per-minute rule. That rule is a crude estimate that industry people have treated as law, so scripts over 120 pages are perceived as too long (John August; Anecdote from a working screenwriter, citing Follows' data).
- Production drafts need locked page and scene numbers, revision pages (22A, scene 14A, "22 OMITTED") and revision colours (white, blue, pink, yellow, green, goldenrod and so on) (Scriptation, Celtx, Scenepaper blogs; Vendor/Secondary, consistent across several).
- Stage plays have no single standard format. UK and US guides differ, and screenwriting software defaults are "not necessarily standard play format" (search snippets from several playwright network guides; Secondary; the London Playwrights PDF would not parse, so details are unverified).
- Collaboration is common (writers' rooms, co-writers). Version control by email is a stated pain: WriterDuet fans cite "not emailing multiple file versions" (Vendor listicle, low confidence).

**Evidence**
- Fountain: plain-text markup created by John August and Stu Maschwitz around 2012. Syntax I read directly: scene headings (INT/EXT), forced elements by prefix, dual dialogue, notes in `[[double brackets]]`, boneyard (ignored text) in `/* */`, sections with `#`, synopses with `=`, page breaks with `===`. Golden rule: "make it look like a screenplay." Source: https://fountain.io/syntax (Direct). Confidence high.
- Page-per-minute data: 2,520 US Letter scripts and 351 A4 scripts matched to IMDb runtimes; average ratio 1.1 (about 55 seconds per page); 18.2% within 0.95 to 1.05; comedy about 1.15, musicals about 0.90; scripts of 60-89 pages had median ratio 0.798 while 151+ pages had 1.361. Source: https://stephenfollows.com/p/is-the-page-per-minute-rule-correct (Direct data; I read a summary, so exact numbers should be re-checked before quoting). Confidence medium-high.
- Final Draft's own blog says the guideline "is an estimate", cites 90-115 pages as preferred, and explains action-heavy scripts run long and dialogue-heavy short. https://www.finaldraft.com/blog/does-one-page-equal-one-minute-of-screen-time (Vendor, but self-limiting). Confidence medium.
- Hacker News thread on Fountain (147 points, 50 comments): commenters call Final Draft overpriced and buggy, note Fountain emerged partly because of Final Draft's lag on iPad, and one programmer-screenwriter says finding "a co-writer who can use git" is nearly impossible. https://hn.algolia.com/api/v1/items/10482517 (Anecdote, developer-skewed sample). Confidence low-medium.
- Screenwriters and AI: a CHI 2025 interview study of 23 screenwriters found AI use at four stages (structure/plot, screenplay text, idea generation, dialogue) and four expected roles (actor, audience, expert, executor). https://arxiv.org/abs/2502.16153 (Direct, small sample). Confidence medium.

**Existing tools and complaints**
- Final Draft (industry default; criticised on price and bugs, per HN anecdote). Fade In: one-time purchase, cross-platform, praised for speed and price (Vendor claims; its own site lists film, TV, games, stage, radio). WriterDuet: real-time collaboration, offline mode, beat board, revision tracking (its site). Highland: Mac, Fountain-native. Trelby: free GPL, imports Text/FDX/Celtx/Fountain/Adobe Story/Fade In Pro, exports PDF/text/HTML/RTF/FDX/Fountain (https://www.trelby.org/; Direct).
- Fountain is supported in Scrivener, Storyist, Slugline, JotterPad and editor plugins (Wikipedia; Secondary).

**What Parchemin could add**
- **Fountain export (and import) of a story whose chapters are scripts**: small, open-format, matches belief 6.
- Optional "script" mode is large and well served elsewhere. Recommendation: do not build a screenplay editor. Offer a plain-text, monospaced, no-smart-quotes chapter mode only if user demand appears.
- A "read-aloud/estimated length" figure shown as an estimate, never a rule.
- Private inline notes and a boneyard-style "cuttings" place (see cross-form pattern A).

### 2b. Memoir, personal essay and creative nonfiction

**Key problems**
1. **Writing about real people.** Writers disagree on showing drafts to the people portrayed. Hope Edelman shows manuscripts to family; another memoirist, Abby Mims, advises never showing them (Writer's Digest, https://www.writersdigest.com/write-better-nonfiction/how-to-write-about-family-in-a-memoir; Anecdote, practitioner advice). Advice includes examining one's motive (understanding, not revenge) and writing with compassion.
2. **Legal exposure.** Defamation (false statements of fact harming reputation) and invasion of privacy (even true but private facts). Truth is the strongest defence but does not prevent suits. A "names changed" disclaimer is not a magic shield, and disguise needs altered physical details, locations and scenarios (Jane Friedman, https://janefriedman.com/ask-the-editor-how-can-i-avoid-lawsuits-when-writing-memoir/; Authors Alliance guide, https://www.authorsalliance.org/resources/defamation-and-personality-rights/; Secondary/educational, explicitly not legal advice). Jurisdiction-dependent.
3. **Memory is unreliable.** Loftus's work shows memory is constructive and open to suggestion; the misinformation effect is well established (search snippets, JSTOR/Learning & Memory results; Secondary; I did not open the primary papers). Creative nonfiction pages note writers sometimes "reimagine" details to preserve the essence of events, but the James Frey case shows readers expect fundamental honesty; his publisher admitted doing "nothing to check the book's veracity," and a library recatalogued it as fiction (Wikipedia, A Million Little Pieces; Secondary). Practical advice: acknowledge memory gaps in the text rather than present uncertain recollection as fact.
4. **Fact-checking and research.** Magazines employ fact-checkers (New Yorker had 16 in 2003 per Wikipedia), but a memoirist typically has none. Interviews, primary documents and records are the writer's job.
5. **Emotional safety.** Pennebaker-style expressive writing (15-20 minutes, 3-5 sessions) shows overall benefit in meta-analyses, but participants consistently report "a short-term increase in distress, negative mood and physical symptoms." The Baikie and Wilhelm review notes limited evidence of possible harm for adult survivors of childhood abuse and a small sample of veterans with PTSD, recommends stop-anytime, a time cap, and complementing, not replacing, treatment (https://www.cambridge.org/core/journals/advances-in-psychiatric-treatment/article/emotional-and-physical-health-benefits-of-expressive-writing/ED2976A61F5DE56B46F07A1CE9EA9F9F; Secondary summary of a peer-reviewed review). Confidence medium. Note this is a clinical research paradigm, not the same as writing a book; do not extrapolate to claims about publishing.
6. **Structure.** The genre's form is "factual stories told with attention to prose style" (Gutkind, via Wikipedia). I could not retrieve primary memoir-craft sources on structure (the planned search was cut off), so structure advice is a gap.

**Existing tools and complaints**
- No memoir-specific mainstream tools were verified in this research. Reference tools exist for sources: Zotero is nonprofit, open source, keeps local data with optional sync, and integrates with word processors (https://www.zotero.org/support/; Direct, vendor-authored). Complaints about memoir tooling: **gap**.

**What Parchemin could add**
- A **"People in this story"** list: each real person gets a private card with fields such as how I disguised them, whether I have asked, what I am unsure of. Optional and private, never exported unless chosen. Frame as prompts, not legal advice.
- A **"how do I know this"** marker for passages: remembered / documented / reconstructed / told to me. Lightweight, aids honesty and later disclaimer writing.
- **Sealed** chapters (locked behind a click, hidden from word tallies and exports by default) so hard material can be written without being accidentally shared or exported.
- Gentle language when a writer opens a story flagged as difficult: "You can stop any time. Your words stay here." No pop-up therapy.
- A **sources list** with notes and dates per story, with footnote-style export. Cheap, helps essayists and long-form writers too.
- A plain-language **disclaimer builder** (memory-based, names changed, dialogue reconstructed). The memoir-disclaimer topic appears in several listicles; the wording is the writer's own.

### 2c. Fan fiction

**Key problems**
- **Serial, chapter-by-chapter publication with feedback loops.** Reviews notify authors; unmoderated review systems can face flaming and trolling; authors can disable anonymous reviews (Wikipedia, Fan fiction; Secondary). Wattpad has inline paragraph-level comments and hosts 90 million+ users as of 2023 (Wikipedia; Secondary).
- **Burnout, hiatus and abandoned works.** Fanlore has pages on burnout and WIPs, but both returned HTTP 403, so I could not read them. This is a known, widely discussed issue (unverified here); web-serial sources note most serials keep regular schedules while fan fiction is "at authors' discretion," and that "it is very rare to make money off such works" (Wikipedia, Web fiction; Secondary).
- **Canon and fanon.** Canon is source material, fanon is widely accepted fan interpretation without official endorsement (Wikipedia; Secondary). Writers need to track canon facts (names, dates, who knows what) per fandom, and mark where their story diverges.
- **Labels are mandatory culture.** AO3 requires ratings (General Audiences, Teen And Up, Mature, Explicit, Not Rated), archive warnings (Graphic Violence, Major Character Death, Rape/Non-Con, Underage, or choose not to warn), category (F/F, F/M, M/M, Gen, Multi, Other), fandom, then characters, relationships (romantic `/` or platonic `&`) and freeform additional tags (https://archiveofourown.org/faq/tags; Direct). Volunteer tag wranglers link synonym tags to a canonical tag. Max 75 tags per work since 2021 (Wikipedia, AO3; Secondary).
- **Feedback.** Cheng and Frens interviewed 29 fan fiction writers and found feedback exchange depends on trust and relationships built in public and private spaces, not only on formal comment features (https://arxiv.org/abs/2209.12810; Direct, interview n=29). Evans et al. found a nine-month ethnography and 4,500 reviews on Fanfiction.net showed "distributed mentoring" supports skill growth (https://arxiv.org/abs/1611.01549; Direct).
- **Legal ambiguity.** Fan fiction's legality is contested; OTW argues fair use; author attitudes vary (Wikipedia; Secondary).

**Existing tools and complaints**
- AO3 itself is the main host (non-profit, run by the OTW, 11.31 million registered users and 82,900+ fandoms in the 2026 Wikipedia figures). Writers draft elsewhere (word processors, Google Docs; unverified). I found no complaint evidence about drafting tools specifically. Gap.
- Some AO3 incidents (2023 DDoS, an outage from integer exhaustion) appear in HN listings (https://hn.algolia.com/api/v1/search?query=fanfiction%20archive&tags=story&hitsPerPage=10; Secondary). Relevance: offline backup of what you posted matters.
- Community attitude to AI: 157 members surveyed showed cautious support but concern about authenticity and a demand for disclosure (https://arxiv.org/abs/2506.18706; Direct, self-selected sample).

**What Parchemin could add**
- Per-chapter **author's note** and **end note** fields, stored and exported separately from the text.
- Story-level **metadata sheet** (rating, warnings, tags, fandom, relationships, summary) that exports into the header of Markdown/EPUB, and a one-click **"copy for AO3"** (clean HTML/plain text). Offline-feasible. It does not need to know AO3's tag database; free text with a reminder to use the site's autocomplete.
- **"Canon notes"** reference card type with a "diverges from canon" flag.
- A private **posting log** (what I posted, where, when). No update-pressure features.

### 2d. Genre fiction conventions

Several items here come from my background knowledge and are marked unverified. Where Wikipedia supplied a figure, I cite it.

**Romance**
- RWA-derived definition: central love story and "an emotionally satisfying and optimistic ending" (Wikipedia, Romance novel; Secondary). Category romance about 55,000 words in numbered series lines; single-title romance about 100,000-110,000 words (same source). The 2006 market-share split shown there (category 40%, historical 17%, contemporary 16%, paranormal 9%) is dated.
- Beat sheets specific to romance (for example Romancing the Beat) and trope tagging are widespread **(unverified; the planned page returned 404)**. Romance readers use tropes and heat levels as promises, which parallels AO3 tagging.
- Needs: a tracker for the two leads' arcs and a content/heat label.

**Mystery (whodunit, fair play)**
- A whodunit gives the audience clues so they could theoretically solve it; it has a double narrative (crime and investigation, plus reconstruction) (Wikipedia, Whodunit; Secondary).
- Knox's 1929 Decalogue: the culprit mentioned early; no supernatural agencies; the detective must declare all discovered clues; accidents cannot help the detective; no twins or doubles without preparation, and so on. Rule 5 reflects racist attitudes of its era (Wikipedia, Ronald Knox; Secondary). Mystery word counts typically 60,000-80,000, thrillers often over 100,000 (Wikipedia, Word count; Secondary).
- Needs: a **clue ledger**: what clue was planted, in which chapter, who has seen it, when it is explained, and a suspects grid (who had means, motive, opportunity; **opportunity framing is my gloss, unverified**).

**Thriller, horror, SFF**
- Thriller pacing and horror dread conventions: I found no fetched primary source. **Unverified**.
- SFF needs worldbuilding: maps, cosmology, magic or technology rules, culture; top-down and bottom-up methods (Wikipedia, Worldbuilding; Secondary). Series bibles hold continuity (Wikipedia, Bible (screenwriting); Frasier example). SFWA categories: novel 40,000+, novella 17,500-39,999, novelette 7,500-17,499, short story to 7,500 (Wikipedia, Word count; Secondary).

**YA and children's**
- YA: readers about 12-18 by definition, 55% of YA consumers are adults over 18 in a 2023 study quoted by Wikipedia; protagonists 14-18; frequently no happy ending (Secondary).
- Chapter books: ages 7-10, short chapters, plentiful illustrations (Wikipedia; Secondary). Chapter books start around 16,000 words per the Word count article (Secondary).
- Picture books: combine verbal and visual narrative; often read aloud to children first (Wikipedia; Secondary). Page counts multiples of 16 or 32 follow from bookbinding sections (Wikipedia, Section (bookbinding); Secondary). Common claims: 32 pages, a few hundred to about 600 words, page turns as pacing, text submitted without illustration notes **(all unverified; I did not find a primary source)**. Need: a "spread" view that shows text per page, plus a read-aloud time estimate.

**Comics and graphic novels**
- Two script styles: full script (panel-by-panel action, dialogue, captions, visual direction) versus the Marvel Method (plot synopsis first, artist lays out pages, writer adds dialogue after art). Fairness concerns when artists effectively co-write but are paid for art only (Wikipedia, Marvel Method; Secondary).
- Page-count conventions (for example 22 pages per single issue) are widely quoted **(unverified)**.
- Needs: page and panel structure, notes to the artist, page-turn reveals, and collaboration with a non-writer. Comics scripts overlap with screenplay layout.

**What Parchemin could add** (across the above)
- Optional "story kind" at creation (novel, short story, memoir, fan work, picture book, script, poem, lyrics) that only sets suggested length norms and which reference cards appear. Blank page first; changeable; skippable.
- A **promises ledger** (clues, setups, romance beats, series hooks) feeding the outline audit.
- A **content notes** field (heat level, violence, age band) that exports into front matter.

### 2e. Journalism-adjacent, long-form and academic-adjacent writers

**Key problems** (partly from background knowledge)
- Sources, quotes and attribution need to stay tied to claims; fact-checking exists at magazines because it mitigates lawsuits and protects reputation (Wikipedia, Fact-checking; Secondary).
- Citation management is a solved problem for academics (Zotero, which keeps local data with optional sync and is open source). Creative writers who write essayistic work with footnotes or endnotes will want footnotes in the text and a source list, not a full bibliography manager.
- Creative nonfiction expects documentable subject matter, exhaustive research and vivid scenes (Lounsberry via Wikipedia, Creative nonfiction; Secondary).
- Academic-adjacent writers' habit research (daily short writing sessions) is relevant but I did not find or fetch a primary source. **Gap.**

**Existing tools**
- Zotero for references. Word processors for footnotes. No gap evidence collected.

**What Parchemin could add**
- Footnotes/endnotes in the editor and in Markdown/EPUB export (check what Tiptap and the EPUB path already support; not verified against code).
- A per-story **sources list**, with optional import of CSL JSON or BibTeX (unverified that those formats suit the use case), S-M.
- No citation-style engine (CSL) in scope. That would be an L and Zotero does it better.

### 2f. Collaborative writing and co-authors

**Key problems**
- Models of collaboration: single-author lead, sequential, horizontal division, stratified division, reactive (simultaneous) (Wikipedia, Collaborative writing; Secondary). Obstacles listed: scheduling, differing organisational preferences, miscommunication.
- Version control and merge conflicts: HN anecdote that git is nearly unusable for non-programmer co-writers (https://hn.algolia.com/api/v1/items/10482517; Anecdote).
- Voice merging, attribution and compensation fairness (Marvel Method page shows an attribution fairness dispute; Secondary).
- Shared reference material (series bible) is the common core of co-writing (see section 2d).
- Contracts: a collaboration agreement is advisable. The Authors Guild page I tried returned 404, so I have no verified source on what it should cover. **Gap.**

**Existing tools**
- Google Docs, Etherpad, Overleaf and GitHub are named as common tools (Wikipedia; Secondary). WriterDuet markets real-time co-writing (vendor).
- Songwriting shows collaboration is the norm there: the share of sole-written Billboard number ones fell from 44% in the 1970s to 4% in the 2010s (Wikipedia, Songwriter; Secondary), and 50/50 splits are a common default (same source).

**What Parchemin could add**
- "Hand-off bundle": export a story (or chapters) as a file the partner opens in their own Parchemin. Parchemin's backup restore already merges by id; add per-chapter **written by** attribution, a **snapshot comparison** view, and a choice to keep both versions as snapshots when two edits collide. M.
- A shared **bible export** (people, places, rules) as Markdown.
- Real-time sync stays out of scope (PHILOSOPHY: optional, opt-in, never default). Say so plainly.
- Optional "who owns what" note field (not legal advice).

### 2g. Interactive fiction and branching narrative

**Key problems** (high level)
- Branching explodes. Authoring tools address this with structure: Ink's knots, stitches, choices (`*` once-only, `+` sticky), diverts (`->`) and gathers (`-`) that rejoin branches, plus variables and conditionals; it compiles to JSON for engines (inkle's WritingWithInk documentation, https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md; Direct).
- Twine is a free, open-source, browser-based visual map of passages with story formats (Harlowe, SugarCube, Snowman, Chapbook) and was used for Depression Quest and Black Mirror: Bandersnatch (Wikipedia; Secondary).
- ChoiceScript is a plain-text language with `*choice`, `*goto`, `*set`, `*if`; mandatory indentation; local test server needs Node.js; Choice of Games hosts and shares revenue (https://www.choiceofgames.com/make-your-own-games/choicescript-intro/; Direct, vendor-authored).
- IF splits into parser-based (Inform, TADS), choice-based and gamebooks; there is an annual IFComp and IFDB (Wikipedia, Interactive fiction; Secondary).
- Research: a 24-author COST Action white paper maps interactive digital narrative workflows and authoring tools (https://arxiv.org/abs/2305.01925; Direct but I read only the abstract).

**Existing tools and complaints**
- Strong specialist tools. Complaints not verified in this research (Emily Short's page was not retrieved). **Gap.**

**What Parchemin could add**
- Do not build a branching editor (L, and specialist tools are excellent and free).
- Support **alternate versions of a chapter** (what-if) through snapshots with names. Already close to existing features. S.
- Ensure Markdown export can be pasted into Twine or Ink without damage.
- A "state tracker" for who knows what (a bible card) also helps non-interactive writers.

### 2h. Songwriting and lyrics

**Key problems** (high level)
- Standard structure: intro, verse, pre-chorus, chorus, post-chorus, bridge, outro, with AABA and other forms; typical pop order Intro > Verse > Pre-chorus > Chorus > Verse > Pre-chorus > Chorus > Bridge > Chorus > Outro (Wikipedia, Song structure; Secondary).
- Lyrics are tied to meter, rhyme and music; rap lyrics are rhythmic speech (Wikipedia, Lyrics; Secondary).
- Collaboration is the norm and credit splits matter (see 2f).
- Needs likely include line-level layout, syllable counts, section labels and an audio-note attachment. **Unverified for user demand.**

**What Parchemin could add**
- Low priority. Keep line breaks and section labels intact. Possibly an attachment of a voice memo (large offline storage cost, so a later idea).

### 2i. Poetry (editor implications only; see note 07)

- Verse is "a series or stack of lines on a page" and relies on stanza breaks, indentation and meter (Wikipedia, Poetry; Secondary). The editor must preserve line breaks and whitespace, and focus mode that dims "everything but the current paragraph" needs a stanza option. Check against code (not done).

---

## 3. Cross-form patterns (needs recurring in 3+ forms)

These are the highest-value features, in rough order of how many forms need them.

| # | Need | Forms that show it | Evidence strength |
|---|------|--------------------|-------------------|
| A | **Private notes in or beside the text, and a "cuttings" pile** (Fountain `[[notes]]` and `/* boneyard */`; notes to the artist in comics; "check this fact" in memoir; author notes in fan fiction; co-author comments) | Screenwriting, comics, memoir, fan fiction, collaboration | Direct for Fountain; inferential for the rest |
| B | **Flexible reference cards / "bible"** (people, places, rules, timeline, canon, suspects, sources) | TV and film, SFF, fan fiction, mystery, series romance, co-authors, memoir (people list) | Secondary and consistent |
| C | **Length and format norms by form**, shown as estimates | Screenplay, short story/novella/novel, romance, children's, picture book, songs, web serial | Direct (Follows data, SFWA categories) plus secondary |
| D | **Content labels** (rating, warnings, tropes, heat, age band, content notes) | Fan fiction (mandatory on AO3), romance, YA/children, memoir | Direct for AO3 |
| E | **Revision and version comparison** (locked pages and revision colours, co-author merges, edits to posted fan chapters, memoir rewrites) | Screenwriting, collaboration, fan fiction, memoir | Secondary |
| F | **Plant-and-payoff ledger** (clues, setups, beats, state variables) | Mystery, romance, interactive fiction, series fiction, screenwriting | Direct for Knox and Ink; inferential for the rest |
| G | **Non-paragraph content in the editor** (script elements, verse lines, lyric sections, comics panels, spreads) | Screenwriting, poetry, songs, comics, picture books | Secondary |
| H | **Open plain-text export** | Screenwriting (Fountain), IF (Ink, ChoiceScript, Twine), all forms via Markdown | Direct |
| I | **Safe-to-write privacy** (hide, seal, never share by accident) | Memoir, fan fiction (harassment risk), personal essay | Direct for expressive-writing distress; inferential elsewhere |
| J | **Outside eyes, handled on the writer's terms** (feedback, hand-off, show-or-not-show family) | Fan fiction, memoir, collaboration, screenwriting | Direct for fan fiction (n=29 interviews); anecdote for memoir |

---

## 4. Ideas for Parchemin, ranked

Fit is judged against the six decision questions in PHILOSOPHY.md (1 helps finish a story that is theirs; 2 writer in control; 3 honest; 4 teaches by use; 5 calm; 6 works offline). Size: S = days, M = a couple of weeks, L = a month or more (rough, based on the README feature list, not on a code audit).

| Rank | Idea | Fit | Offline | Size | Notes |
|---|------|-----|---------|------|-------|
| 1 | **Reference cards beyond characters** (places, rules, timeline, canon, suspects, sources) with a card-type picker; extends the planned setting sheets | Strong: Q1, Q2, Q4; matches roadmap | Yes | M | Cross-form pattern B. Keep types optional; blank page first. Coordinate with note 04. |
| 2 | **Private inline notes and a "cuttings" drawer** (hidden from word tally and exports by default; optional export of notes) | Strong: Q2, Q5; echoes Fountain notes/boneyard | Yes | S-M | Pattern A. Cuttings preserve text rather than deleting; fits the "no lock-in" belief. |
| 3 | **Content notes and metadata block** (rating, warnings, tags, summary, age band) feeding export front matter and a "copy for posting" action | Good: Q2, Q3 | Yes | S | Pattern D. Free text; mention AO3 autocomplete; no tag database, no network. |
| 4 | **Memoir companion**: "People in this story" private cards with disguise and consent notes, "how I know this" markers on passages, optional disclaimer builder, plain-language sources list | Strong: honest, supports empathy (belief 3). Risk: must not claim legal or therapeutic authority | Yes | M | Q3 requires wording like "not legal advice." Cite memory research modestly. No claims about healing. |
| 5 | **Sealed chapters** (click to open, excluded from tallies and exports until unsealed) and gentle language for hard material | Strong: Q2, Q5 | Yes | S-M | Pattern I. Avoid any "mood tracking" or analytics on what is written (would breach "no harvesting"). |
| 6 | **Hand-off bundle for co-authors** (export a chapter set with per-chapter "written by", merge-by-id import already exists, snapshot comparison with keep-both) | Good: Q2, Q6 | Yes | M | Pattern E and J. Real-time sync remains out of scope. Be honest that conflicts need a human choice. |
| 7 | **Promises ledger** (clue, setup, beat, hook: planted in chapter X, paid off in chapter Y) feeding the outline audit | Good: Q4 (teaches fair-play and payoff by use) | Yes | M | Pattern F. Optional; useful for mystery, romance and series. The audit may use it to ask a question, never to demand a fix. |
| 8 | **Length norms ruler** per story kind, shown as "typical", with sources named and caveats (Follows data shows the screenplay rule fails for 4 in 5 scripts) | Good: Q3 if honest; risk: false authority | Yes | S | Pattern C. Only include norms I could cite (SFWA categories, category romance 55k, screenplay 90-115 pages preferred). Mark children's norms "ask a current guide." |
| 9 | **Fountain export** (and optional import) | Good: belief 6 | Yes | S | Pattern H. Only if screenwriters actually ask; costs little. |
| 10 | **Verse and lyric-friendly editing** (preserve line breaks, stanza-aware focus mode, section labels) | Good: calm, writer in control | Yes | S | Pattern G. Coordinate with note 07. |
| 11 | **Per-chapter author's notes and end notes** for serial posting | Good | Yes | S | Fan fiction and web serials. No update schedule pressure. |
| 12 | **Footnotes/endnotes** and a **sources list** for essays and long-form | Good | Yes | S-M | Check what the editor already supports before sizing. |
| 13 | **Read-aloud / reading-time estimate** labelled as an estimate | Neutral to good | Yes | S | Useful for picture books, lyrics, stage. |
| 14 | **Spread view for picture books** (text per page, page-turn markers) | Good for a niche | Yes | M | Only if children's writers show up. |
| 15 | **Alternate chapter versions** through named snapshots ("what-if") | Good | Yes | S | Already close to existing snapshots. |
| Not now | Screenplay editor with elements, revision colours and locked pages | Mature tools (Fade In, Trelby, WriterDuet, Highland) exist | Yes | L | Don't build. Offer Fountain export instead. |
| Not now | Branching narrative editor | Specialist tools exist | Yes | L | Don't build. |
| Not now | Songwriting features (syllable counters, audio notes) | Unverified demand | Partial | M | Revisit with evidence. |
| **Reject** | AI that writes fan fiction, tropes, canon-compliant scenes or "fixes" memoir prose | Violates "never ghostwrite" | n/a | n/a | Reject. Even the AI-and-fan-fiction survey shows demand for disclosure and concern for authenticity. |
| **Reject** | Update-streak or posting-schedule pressure, "you haven't updated in 30 days" nudges for serial writers | Violates "no guilt-gamification" | n/a | n/a | Reject. |
| **Reject** | Public kudos counts, leaderboards or reader-popularity dashboards | Violates calm and no gamified guilt | n/a | n/a | Reject. |
| **Reject** | Cloud analysis of memoir text for "risky names," sentiment or trauma detection | Violates "no data harvesting" and "writer owns the work" | n/a | n/a | Reject. Any such check must run locally and be the writer's choice; otherwise the writer sees only prompts. |
| **Reject** | Auto-built clue or trope lists generated from the writer's own text sent to a server | Same as above | n/a | n/a | Reject. |

---

## 5. Open questions and gaps

1. **Who are Parchemin's users, really?** My overlap ranking is a judgement. No usage or survey data was collected. Fan writers and memoirists are large populations, but whether they prefer a dedicated writing app over Google Docs or AO3's own editor is unknown.
2. **Memoir craft and structure evidence is thin.** The memoir-structure search was cut off. Primary craft sources (Gornick, Karr, Lamott, Gutkind essays) were not read.
3. **Fan fiction burnout and abandonment**: no verified quantitative source. Fanlore returned 403. Research question: is there data on abandoned multi-chapter works on AO3?
4. **Picture book, thriller, horror and romance-beat conventions** rest on background knowledge, not fetched sources. Verify word counts and beat names before putting any in the UI.
5. **Interactive fiction authoring complaints** (branch explosion, testing) were not verified beyond tool documentation.
6. **Legal and ethical content in the app**: where to draw the line between helpful prompts and implied legal advice? A lawyer or professional editor should review any memoir disclaimer wording.
7. **Offline co-writing**: is the hand-off bundle usable by non-technical partners, or will writers expect live editing anyway? Test with real co-authors.
8. **Songwriting demand**: unknown.
9. **Code audit not done**: sizes assume the README's description. Whether the editor can handle footnotes, preserved line breaks or custom block types was not checked.

---

## 6. Source list

All URLs below were fetched unless marked "seen only."

**Screenwriting and playwriting**
- https://fountain.io/syntax: Fountain syntax. Official spec page; high quality, Direct.
- https://en.wikipedia.org/wiki/Fountain_(markup_language): creators, dates, supporting apps. Secondary, medium.
- https://stephenfollows.com/p/is-the-page-per-minute-rule-correct: 2,520-script dataset on page vs runtime. Data-driven blog by an industry analyst; medium-high (read via summary).
- https://johnaugust.com/2020/how-accurate-is-the-page-per-minute-rule-2: working screenwriter's take. Anecdote plus data reference; medium.
- https://www.finaldraft.com/blog/does-one-page-equal-one-minute-of-screen-time: vendor blog; self-limiting; medium-low.
- https://hn.algolia.com/api/v1/items/10482517: Hacker News thread on Fountain; anecdote from a developer-skewed audience; low-medium.
- https://www.trelby.org/: Trelby features and formats. Official; high for facts.
- https://www.fadeinpro.com/: Fade In claims. Vendor; low-medium.
- https://writerduet.com/: WriterDuet features. Vendor; low-medium.
- https://en.wikipedia.org/wiki/Screenwriting_software: overview. Secondary; medium.
- https://arxiv.org/abs/2502.16153: CHI 2025 screenwriter interviews, n=23. Peer-reviewed; medium-high.
- Seen only (search results, not read): https://nofilmschool.com/one-page-equals-one-minute, https://scriptation.com/blog/what-are-blue-pages_script-revision-colors/, https://blog.celtx.com/script-revision-process/, https://scenepaper.com/blog/script-revisions-colored-pages, https://www.londonplaywrights.org/wp-content/uploads/2020/02/LPW-The-London-Playwrights%E2%80%99-Workshop-Guide-to-Formatting-your-Stage-Play.pdf (PDF failed to parse), https://www.studiobinder.com/blog/screenwriting-software/ (listicle, not relied on). Revision-page facts rest on search-result summaries only; medium-low.

**Memoir and creative nonfiction**
- https://www.writersdigest.com/write-better-nonfiction/how-to-write-about-family-in-a-memoir: practitioner advice (Edelman, Mims, Cohen, Karr). Anecdote; medium.
- https://janefriedman.com/ask-the-editor-how-can-i-avoid-lawsuits-when-writing-memoir/: industry editor's guidance; medium.
- https://www.authorsalliance.org/resources/defamation-and-personality-rights/: nonprofit educational guide; medium-high but not legal advice.
- https://www.cambridge.org/core/journals/advances-in-psychiatric-treatment/article/emotional-and-physical-health-benefits-of-expressive-writing/ED2976A61F5DE56B46F07A1CE9EA9F9F: review of expressive writing (Baikie and Wilhelm, 2005). Peer-reviewed; medium-high (read via summary).
- https://en.wikipedia.org/wiki/Creative_nonfiction: definitions, Gutkind, Lounsberry. Secondary; medium.
- https://en.wikipedia.org/wiki/A_Million_Little_Pieces: Frey controversy. Secondary; medium.
- https://en.wikipedia.org/wiki/Fact-checking: magazine fact-checking. Secondary; medium.
- https://www.zotero.org/support/: Zotero. Official docs; high for what it does.
- Seen only: https://textjournal.scholasticahq.com/article/31483-letter-to-my-daughter-ethical-dilemmas-in-the-writing-of-a-memoir.pdf (PDF would not parse; scholarly article on memoir ethics; worth reading). Loftus misinformation search results (https://learnmem.cshlp.org/content/12/4/361.full.pdf and others) were seen in search results, not opened.

**Fan fiction and serial publishing**
- https://archiveofourown.org/faq/tags: AO3 tagging and ratings. Official; high.
- https://en.wikipedia.org/wiki/Archive_of_Our_Own: scale, features. Secondary, medium (figures are Wikipedia's, 2026).
- https://en.wikipedia.org/wiki/Fan_fiction: culture, law, platforms. Secondary; medium.
- https://arxiv.org/abs/2209.12810: feedback among 29 fan writers. Peer-reviewed interview study; medium-high.
- https://arxiv.org/abs/1611.01549: distributed mentoring on Fanfiction.net. Peer-reviewed ethnography; medium-high.
- https://arxiv.org/abs/2506.18706: fan community views on AI, n=157. Peer-reviewed survey; medium (self-selected).
- https://arxiv.org/abs/2504.04782: maturity ratings and style on AO3. Conference paper; low-medium for our purposes.
- https://en.wikipedia.org/wiki/Wattpad, https://en.wikipedia.org/wiki/Serial_(literature), https://en.wikipedia.org/wiki/Web_serial: serial platforms and pressures. Secondary; medium-low.
- https://hn.algolia.com/api/v1/search?query=fanfiction%20archive&tags=story&hitsPerPage=10: listing of AO3 news stories; seen only for links to Verge, Atlantic, Vox articles that were blocked.
- Not accessible: https://fanlore.org/wiki/Burnout and /Work_in_Progress (403).

**Genre fiction, children's and comics**
- https://en.wikipedia.org/wiki/Romance_novel: RWA definition, category vs single-title lengths. Secondary; medium.
- https://en.wikipedia.org/wiki/Whodunit and https://en.wikipedia.org/wiki/Ronald_Knox: whodunit conventions; Knox's ten rules. Secondary; medium.
- https://en.wikipedia.org/wiki/Word_count: SFWA length categories and genre ranges. Secondary; medium.
- https://en.wikipedia.org/wiki/Worldbuilding and https://en.wikipedia.org/wiki/Series_bible: worldbuilding and bibles. Secondary; medium.
- https://en.wikipedia.org/wiki/Young_adult_fiction, https://en.wikipedia.org/wiki/Chapter_book, https://en.wikipedia.org/wiki/Picture_book, https://en.wikipedia.org/wiki/Children%27s_literature, https://en.wikipedia.org/wiki/Signature_(bookbinding): children's and YA conventions. Secondary; medium-low (no picture-book word counts).
- https://en.wikipedia.org/wiki/Marvel_Method: comics script styles. Secondary; medium.
- https://www.scbwi.org/: association page; no length guidance found.

**Collaboration**
- https://en.wikipedia.org/wiki/Collaborative_writing: models and tools. Secondary; medium-low.
- https://en.wikipedia.org/wiki/Songwriting and https://en.wikipedia.org/wiki/Song_structure, https://en.wikipedia.org/wiki/Lyrics: songwriting collaboration and structure. Secondary; medium.

**Interactive fiction**
- https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md: Ink documentation. Primary; high.
- https://www.choiceofgames.com/make-your-own-games/choicescript-intro/: ChoiceScript intro. Primary, vendor-authored; high for facts.
- https://en.wikipedia.org/wiki/Twine_(software), https://en.wikipedia.org/wiki/Interactive_fiction: overviews. Secondary; medium.
- https://arxiv.org/abs/2305.01925: COST Action white paper on interactive digital narrative design (abstract only). Medium.

**Poetry**
- https://en.wikipedia.org/wiki/Poetry: forms and line structure. Secondary; medium-low. See note 07 for depth.

**Academic and research search aids (low relevance, used for orientation)**
- https://api.openalex.org/ queries on memoir ethics, co-authorship, and Twine returned mostly tangential results; nothing relied on. https://arxiv.org/abs/2309.12570 (LLM creativity support for writers, 30 participants; writers found AI more useful in revising and translating than planning) is relevant to the "reject ghostwriting" decision but not to any form in particular; medium.

# 07 - Poetry and poets

Researcher note for Parchemin. Scope: what poets struggle with, how they work, what tools exist and fail, and what a poetry mode would need.

Method and honesty notes:
- About 45 searches and fetches. The shared web-search budget ran out part-way through, so the later topics (cliche and sentimentality, poets' views on AI, Scrivener/Obsidian/Notion handling of poetry, journal submission guidelines, Richard Hugo) were not researched and are listed under gaps.
- Several useful pages returned 403 or unreadable PDFs (Poetry Foundation, Medium, Duotrope, Helen Mort's notebook piece, Hazelton's "Learning the Poetic Line", ZeuScansion paper, Naomi Shihab Nye mini-lesson). Where I only saw a search-result snippet, I say so. I did not read those in full.
- Page summaries came through a small summarising model, so quotes are only those the fetch returned verbatim and are kept short. Anything marked "background" is general knowledge of mine that I did not verify in this session.
- Almost everything here is practitioner testimony (essays, blogs, forum posts). No study on poets' tool use was found. Confidence levels reflect that.

---

## 1. Executive summary

1. A poem is a spatial object as well as a text. Line breaks, stanza gaps, indentation and white space carry meaning, and most writing software treats them as accidents of paragraph formatting. This is the central product gap, and it is concrete and testable.
2. Poets repeatedly lose whitespace when text moves between tools and formats: EPUB export that eats double returns, hanging indents that cannot be set on the web, and manuscripts laid out for 8.5x11 that do not fit a book page. Parchemin already exports EPUB, so whitespace fidelity is an export requirement as well as an editor requirement.
3. Poets distinguish an author's line break from a page's wrap. Print convention uses a hanging (turnover) indent so readers can tell them apart. A poetry mode must model "the poet's line" as a first-class unit and render wraps differently.
4. "When is it finished?" has no rule, and poets say so. Their answers (memorise it, reading aloud, trusted readers, "it stops bothering me", put it away for months) are all about time, voice and other people, not metrics. Tools that claim to score a poem would contradict the craft.
5. Revision of very short texts is mostly many alternative versions of the same few words. Poets try different line breaks, read aloud, set a poem aside for weeks. Snapshots exist in Parchemin, but poets need cheap side-by-side variants and line-level comparison more than whole-document history.
6. Sound is central, and automated sound analysis is shaky. Scansion is ambiguous, English haiku 5-7-5 is widely called a myth by haiku scholars, and French syllable counting has no purely mechanical rule for diérèse and synérèse. Any syllable or stress hint must be a suggestion the poet can override, never a verdict.
7. Form is a constraint that many poets say frees them (sestina end-word rotation, villanelle refrains, ghazal radif and qafia, pantoum repeats). Bookkeeping for these forms is tedious and mechanical, which is a good place for a tool to help without writing anything.
8. Assembling a collection is its own craft: sequencing, sections, opening and closing poems, series. Poets work physically (printing, laying poems on the floor, colour coding, spreadsheets). A drag-to-order collection board maps directly onto Parchemin's existing outline board.
9. Submission tracking is a real chore and is done in spreadsheets, Submittable or a paid service (Duotrope). It is adjacent to Parchemin's mission, but it sits outside "finish the thing" and risks bloat. Treat it as a later, optional idea.
10. French is not an afterthought. French verse has its own counting rules (e muet, elision, diérèse), a rhyme grading (pauvre, suffisante, riche), and the prose poem began in France. Local, privacy-respecting French tools already exist (one states the text stays on-device), which shows it is feasible offline.

---

## 2. Problems

Severity scale: High = poets cannot do the basic job in common tools; Medium = real friction; Low = niche. Confidence: High = several consistent sources or primary text; Medium = one or two decent sources; Low = snippet, anecdote or background.

### P1. Whitespace and line structure are not first-class in writing tools
- Description: Poems depend on exact line breaks, blank lines between stanzas, and leading indentation. General editors model prose paragraphs. Poets fight automatic reflow, paragraph spacing that affects every line, collapsed double returns, and no true hanging indent.
- Affects: all poets using free verse, projective or visual forms; anyone publishing poems to web or EPUB.
- Evidence:
  - Adobe community thread: EPUB export removes double returns, which are stanza breaks; paragraph spacing applies to every line; suggested workaround is one paragraph per stanza with forced line returns, plus space between paragraphs (https://community.adobe.com/questions-671/best-way-of-formatting-stanzas-of-poetry-for-epub-export-883964, fetched). Confidence: High that the problem exists in that tool; Medium as general evidence.
  - A Medium post titled "Why Are the Poetry Format Options on the Web So Sh*tty?" complains that web platforms offer no hanging indent for long lines (search snippet only; page returned 403 - https://medium.com/parenthetical-note/why-are-the-poetry-format-options-on-the-web-so-shitty-390d0c1b25b3). Confidence: Medium (snippet).
  - Cincinnati Review managing editor Lisa Ampleman on flush-and-hang: print lines hold about 64 characters on their 6x9 pages; manuscripts "meticulously arranged" on 8.5x11 do not translate to print (quoting Sarabande editor Kristen Renee Miller) (https://www.cincinnatireview.com/in-praise-of/in-praise-of-the-flush-and-hang/, fetched). Confidence: High.
  - Wikipedia on the dropped line: a continuation indented to where it would have sat unbroken, which depends on exact horizontal placement. Digital reflow is a risk (the article states the definition; the digital implications are my inference) (https://en.wikipedia.org/wiki/Dropped_line, fetched). Confidence: Medium.
  - Charles Olson, "Projective Verse" (1950): the typewriter's "rigidity and its space precisions" let a poet notate breath and pause, and a space as long as the preceding phrase means a held breath (https://www.writing.upenn.edu/library/Olson-Charles_Projective-Verse.html, fetched). Primary source for why exact horizontal space is semantic for a whole tradition. Confidence: High.
- Severity: High.

### P2. Author's line break vs automatic wrap (turnover lines)
- Description: When a line is longer than the screen or page, the reader cannot tell whether it is the poet's break. Print convention solves it with a hanging indent for the overflow, visually different from intentional indentation.
- Affects: poets with long lines (Whitman-style, Ginsberg-style, ghazals in English, narrative poems); also mobile readers of any poem.
- Evidence: LiberScript formatting guide says intentional indentation and turnover indentation must look visibly different (https://liberscript.com/guides/poem-formatting-rules-guide, fetched; vendor guide, so quality Medium). Cincinnati Review essay above. Confidence: High on convention, Medium on how often it bites digitally.
- Severity: Medium-High. For Parchemin it matters on phones, where the writing column is narrow.

### P3. Lineation: choosing line breaks
- Description: Poets say line breaks are a main craft decision (pace, emphasis, double meaning, silence) and a main place beginners go wrong (random chopped lines, ending on weak words, uniform lengths).
- Affects: free-verse poets especially, and new poets.
- Evidence: Poetry-Now exercise: write a ~30-word prose sentence, break it into long lines, short lines, then isolate one word, reading each aloud (https://www.poetry-now.com/blog/line-breaks-in-poetry-how-to-make-the-page-breathe, fetched). 149 Review (Pasmore, Cooper): convert poem to paragraph and re-break; try several options for the same phrase; get feedback focused on breaks (https://www.149review.org/craft-essays/theimportanceoflinebreaks, fetched). Writers.com: "read aloud, do the breaks fall on breath points" (https://writers.com/line-breaks-in-poetry, fetched). Rebecca Hazelton, "Learning the Poetic Line", Poetry Foundation (https://www.poetryfoundation.org/articles/70144/learning-the-poetic-line; not read, 403). Wikipedia Line (poetry): lineation is what separates poetry from prose even in free verse (https://en.wikipedia.org/wiki/Line_(poetry), fetched). Confidence: High that this is a core struggle; these are teaching blogs, not first-hand essays by major poets.
- Severity: High for craft, but it is a craft problem and not mainly a software problem. Software can make trying versions cheap.

### P4. Knowing when a poem is finished
- Description: No objective endpoint. Poets fear both abandoning too early and ruining a poem by over-revising.
- Affects: nearly all poets.
- Evidence:
  - Writer's Digest "mini survey" of poets: Valery "never finished, only abandoned"; David Trinidad "done when it stops bothering me"; Elaine Equi "sometimes a fragment is enough"; Victoria Chang on "the best I can do right now"; Kevin Prufer relies on trusted readers to avoid over-editing (https://www.writersdigest.com/how-to-complete-a-poem-a-mini-survey, fetched; the Valery attribution is as reported by that page). Confidence: High (several named poets).
  - Cameron Awkward-Rich (Poets & Writers): a poem is done when it can be memorised; borrowed from Danez Smith's exercise (https://www.pw.org/content/craft_capsule_the_end, fetched). Confidence: High as testimony.
  - Poetry Place: stop when trusted readers cannot find faults; warns Wordsworth and Simic made poems worse by later revising (https://www.writebetterpoems.com/articles/when-is-a-poem-finished-done, fetched; blog, Medium).
  - Naomi Shihab Nye mini-lesson on rewriting from memory (search snippet only; PDF unreadable).
- Severity: High emotionally, and it lines up with Parchemin's mission (finishing). Careful: a "done meter" would be dishonest here.

### P5. Revision of very short texts (many versions of the same few words)
- Description: Poems are revised through repeated drafts (three to ten, per one article), alternate line breaks, and long rests. The unit of change is a word or a break, so whole-document snapshots are clumsy.
- Evidence: Jeffrey Hillard, Writer's Digest: 3-10 drafts, set aside hard poems six months, "feeler drafts", Elizabeth Bishop testing arrangements of the same words (https://www.writersdigest.com/poetry/some-thoughts-on-poetry-revision, fetched). Commonplace-book practice: drafts marked up in different inks, ticked once typed (from a search snippet of toasted-cheese; the fetched page itself did not describe draft handling, so treat as Low). Confidence: Medium.
- Severity: Medium.

### P6. Sound: rhythm, rhyme, stress and syllable counting are hard to automate
- Description: Poets want to check meter, rhyme and syllable counts but the rules are contextual.
- Evidence:
  - English haiku: Japanese on are shorter than English syllables; 5-7-5 became entrenched in schools and haiku scholar Charles Trumbull is reported calling it "a cliché or joke in the haiku community" (https://en.wikipedia.org/wiki/Haiku_in_English, fetched). Confidence: High that a strict 5-7-5 checker would mislead.
  - French: "no mechanical rule" for diérèse vs synérèse; Hugo used both; e muet never counts at line end, elides before a vowel or mute h, counts before a consonant (https://www.analyseur-texte.fr/blog/guide-compteur-syllabes-poesie-versification, fetched, vendor blog, Medium).
  - Automatic scansion of English exists as research (ZeuScansion, https://aclanthology.org/W13-1803.pdf; PDF unreadable here, so I cannot report its accuracy). Scansion's ambiguity is background knowledge, unverified here.
  - Ghazal in English: forcing strict syllabic meter when the tradition is about stress patterns is a listed pitfall (https://www.poetsofthehousehold.com/learn/forms/ghazal, fetched).
  - Olson: line comes from breath, not from counted syllables (primary source above).
- Severity: Medium. Danger is false authority, not absence.

### P7. Form and constraint bookkeeping (sestina, villanelle, ghazal, pantoum, sonnet)
- Description: Fixed forms impose repetition and rotation rules that are hard to hold in the head, and writers rewrite by the form's logic.
- Evidence: Poets.org glossary gives the rules (villanelle: five tercets plus a quatrain, two rhymes, two refrains; sestina: 39 lines, six end words; pantoum: lines 2 and 4 become 1 and 3 of the next stanza; ghazal 5-15 autonomous couplets) (https://poets.org/glossary, fetched). Poets.org sestina article: end-word rotation is "inherently difficult to track"; contemporary poets vary it, e.g. Patricia Smith expanding the sixth stanza (https://poets.org/text/flexing-form-contemporary-innovation-sestina, fetched). Ghazal pitfalls: narrative drift, hollow refrains, missing signature couplet (maqta) (Poets of the Household, above). Oulipo / Ploughshares: Mary Oliver said "Wild Geese" emerged from an exercise in end-stopped lines; constraint leads to discovery (https://pshares.org/blog/the-formal-imagination-of-oulipo/, fetched). Confidence: High that forms are valued and bookkeeping is tedious; the "tedious" part is my inference.
- Severity: Medium. Niche but a cheap, honest place for a tool to help.

### P8. Assembling and ordering a collection or chapbook
- Description: Poets must turn scattered poems into a book with an opening, a closing, sections, and series. Defaults (best first, chronological, topic) are called predictable by teachers.
- Evidence: Nancy Reddy (Poets & Writers): print poems and lay them out, colour-code by topic and technique, word-cloud to catch repeated vocabulary, scattered or stacked series, numbered sections, study the table of contents (https://www.pw.org/content/order_out_of_chaos_revising_your_poetry_manuscript_0, fetched). Poetry Place: "Floor Method", similarity-with-difference, editors read cover to cover (https://www.writebetterpoems.com/articles/how-to-sequence-a-poetry-manuscript, fetched; blog). Robert Lee Brewer, Writer's Digest: five orders: best, themed, chronological, emotional, linked (https://www.writersdigest.com/getting-published/5-tips-for-organizing-poetry-chapbook-manuscripts, fetched). A Substack piece by Gary D. Grossman proposes a spreadsheet approach (paywalled; title only). Confidence: High that sequencing is a distinct task and is done physically or in spreadsheets.
- Severity: Medium-High for poets with 20+ poems.

### P9. Submission to journals and contests
- Description: Poets send poems to many places, track responses, respect simultaneous-submission rules.
- Evidence: Read Poetry: poets use Submittable, paid Duotrope, or Excel; they record journal, poem, method, status; process is "tedious" (https://www.readpoetry.com/poetry-submissions/, fetched). M.A. Dubbs comparison: Duotrope $5/month or $50/year, dense interface; Submittable free for writers but sometimes wrong about requirements; Chill Subs uses badges and "rejection bingo"; recommends a spreadsheet alongside (https://madubbspoetry.wordpress.com/2023/01/12/comparing-online-submission-managers/, fetched; one blogger's view). Duotrope's own site returned 403. Confidence: Medium.
- Severity: Medium for publishing poets, none for others. Out of core mission.

### P10. Page poem vs voice poem (performance and spoken word)
- Description: Spoken word writes for the ear and body; page poems rely on visual structure. Performance is part of the poem and is also edited.
- Evidence: Search snippets summarising Georgia Poetry Society, Young Poets Network and others (not fetched individually). Abby Bland's blog says the difference comes from goals, not essence, and does not cover annotation (https://www.abbyblandpoetry.com/blog/is-there-a-difference-between-stage-and-page-poetry, fetched; the gap is the page's, not proof of absence in practice). Olson's treatment of the page as a breath score is the nearest primary source. Confidence: Low-Medium; I did not find first-hand accounts of how performers mark up scripts.
- Severity: Low-Medium; a later concern.

### P11. Starting: from an image, feeling, phrase, or another text
- Description: Poems often start as fragments, overheard phrases or lines, not a plan. Poets keep notebooks and commonplace books for this, and many value handwriting for room to be messy.
- Evidence: Ceridwen Hall: commonplace book holds quotes, definitions, observations, drafts; "the writing equivalent of a yoga mat"; also keeps drafts in one place and gives screen relief (https://www.ceridwenhall.com/blog/commonplace-books, fetched). Letter Review: capture, experiment, practice, develop, polish; no rigid system (https://letterreview.com/why-do-poets-use-a-writers-notebook/, fetched; lightweight blog). Toasted Cheese: commonplace book is more deliberate than a notebook and organised by heading rather than date (https://www.toasted-cheese.com/absolute-blank/keeping-a-commonplace-book/, fetched). Helen Mort on keeping a notebook (https://ypn.poetrysociety.org.uk/features/keeping-a-notebook/; 403, not read). Confidence: Medium. All first-hand-style blogs, no systematic study.
- Severity: Medium. Capture speed matters more than structure.

### P12. Daily-poem challenges and the pressure of volume
- Description: NaPoWriMo (April, since 2003 per its site) asks for a poem a day; the site says prompts are optional and "no worries" if output is spotty. National Poetry Month began in 1996 (Academy of American Poets).
- Evidence: https://napowrimo.net/ (fetched), https://poets.org/text/national-poetry-month (fetched). Confidence: High on what these are. I found no evidence in this session about how many participants burn out or how many poems are kept; do not claim it.
- Severity: Low. Relevant as the model for gentle, optional rhythm. It matches PHILOSOPHY.md on gentleness.

### P13. Found, erasure, blackout and cut-up forms need the source text and the result side by side
- Description: These forms start from existing text. Erasure subtracts, blackout adds cover; the source remains visible under the cover in blackout. Ethics and attribution are contested.
- Evidence: History of Blackout Poetry site: Tom Phillips' A Humument (1970), Mary Ruefle "bandaging" the words, Austin Kleon's newspaper blackouts; distinction erasure vs blackout (https://www.thehistoryofblackoutpoetry.org/, fetched). Ruefle: works "intuitively by impulse", sees it as a "kind of game", sometimes starts new poems from phrases found (https://poetshouse.org/mary-ruefle-on-erasure-an-interview-by-correspondence/, fetched). Cecily Parks in Kenyon Review: erasure poets often explain their method; source authors can be eclipsed; Parks abandoned her own project over this (https://kenyonreview.org/kr-online-issue/2020-julyaug/selections/cecily-parks-656342/, fetched). Wikipedia found poetry: attribution and authorship are open questions, copyright not addressed (https://en.wikipedia.org/wiki/Found_poetry, fetched). Confidence: Medium-High.
- Severity: Low-Medium. A natural fit for an offline text tool, with an attribution caution.

### P14. Prose poems and mixed forms
- Description: Prose poems have no line breaks and sit in paragraph blocks, so a tool that is "line-based" only would exclude them. French origin (Bertrand, Baudelaire, Rimbaud, Mallarme).
- Evidence: https://en.wikipedia.org/wiki/Prose_poetry (fetched). Confidence: High. Implication: poetry mode must be optional per document and coexist with prose, which Parchemin's current editor already handles.
- Severity: Low.

### P15. Writing in more than one language (including French)
- Description: Counting rules, rhyme grading and typographic norms differ by language. Parchemin's own name is French. Needs are real but evidence on bilingual poets' workflow is thin.
- Evidence: French metric rules (above); French rhyme dictionaries grade pauvre, suffisante, riche by common phonemes (one, two, three or more) (https://semirimes.fr/ via search snippets and fetched page; https://rime.academy/dico fetched, "pour la versification classique"). Analyseur-texte.fr says texts stay on the device (https://www.analyseur-texte.fr/compteur-mots-poesie, fetched). Confidence: Medium for French; Low for general multilingual practice (nothing found on poets switching languages mid-poem or on translation drafts). Mixed-language needs, French typography (non-breaking spaces before : ; ? !, guillemets) are background knowledge, unverified.
- Severity: Medium for French-speaking writers.

---

## 3. Existing solutions and tools

| Tool or practice | What it does | Works for | Complaints and limits | Source and confidence |
|---|---|---|---|---|
| RhymeZone | Free web rhymes, near rhymes, synonyms, "descriptive words", sort by syllables | Quick sound lookup | Needs a network; word database source not stated on its home page | https://www.rhymezone.com/ fetched. Complaints: Low (none found) |
| MasterWriter | Paid desktop rhyme and phrase dictionary, 100,000+ rhyme entries, thesaurus, metaphors | Songwriters mainly | Reviews note data not updated in years and that it does little a rhyme site, thesaurus and notes app cannot | Search snippets only (e.g. https://www.soundonsound.com/reviews/masterwriter, https://kindlepreneur.com/masterwriter-review/); Low-Medium |
| Scansion software | Research tools (ZeuScansion, a Dutch scansion generator, now unsupported), apps like Poet Lite, listicles of others | Formal verse analysis | Ambiguity; some are research demos or dead; listicles (gitnux and similar) look like SEO content and were not used | Snippets; Low |
| French tools: SemiRimeS (ZemiR rhyme dictionary, Mistiche analyser, Flowlyse for slam), dico-rimes, rime.academy, Analyseur-Texte, Dedali | Phonetic rhyme grading, syllable counts with e muet, alexandrine meter feedback | French classical verse | Diérèse/synérèse cannot be settled mechanically; some tools add accounts and gamification | https://semirimes.fr/ fetched; Medium-High that they exist and work in-browser |
| Google Docs / Word / Pages | Free-form page, indentation, spacing | Drafting and manuscript submissions | Not designed for poetic typesetting (search snippet); manual tricks for hanging indents; reflow when moved | Snippet, Low-Medium |
| InDesign / EPUB | Typesetting | Books | EPUB drops double returns; need styles and soft returns | Adobe forum fetched, Medium |
| Web CMS / blogs | Publishing | Online poems | No hanging indent; lines wrap | Medium post snippet, Medium |
| Scrivener, Obsidian, Notion | Not researched (budget ran out) | | | Gap |
| Submittable, Duotrope, Chill Subs, The Grinder, spreadsheets | Submission tracking, market search | Publishing poets | Duotrope paid and dense; Submittable listings sometimes inaccurate; Chill Subs gamifies with "rejection bingo" (relevant to the no-gamified-guilt stance) | madubbspoetry.wordpress.com fetched; Medium |
| NaPoWriMo, Poem-a-Day style challenges | Community and optional prompts | Habit and volume | Pressure for volume; not examined | napowrimo.net fetched, High on description |
| Paper notebooks and commonplace books | Capture, drafts, quotes | Early fragments, messy experiments | Not searchable; fragile; but valued for being off-screen | Hall, Letter Review, Toasted Cheese fetched; Medium |
| Printing and laying poems on the floor | Sequencing | Collections | Physical, one copy; no history | Poetry Place, Reddy fetched; Medium-High |
| Workshops, trusted readers, reading aloud | Feedback and testing breath | All poets | Not a software matter, but the tool should not replace them | Multiple above; High |

Pattern: the successful tools are cheap lookups (rhyme, syllables) and generic editors. Nothing found is calm, offline and built around the poem's physical layout plus drafts plus collection order. That is a gap, but this is an absence-of-evidence claim from limited searching, not a market survey.

---

## 4. Ideas for Parchemin

Fit key: Philosophy question numbers refer to the six decision questions in PHILOSOPHY.md. Build size: S = days, M = 1-3 weeks, L = a month or more. All items below are offline-capable unless noted. The current editor (Tiptap StarterKit, prose schema, `src/components/SceneEditor.tsx`) is built around prose paragraphs, so poetry needs a schema decision before UI.

### Technical frame (applies to most ideas)
- Tiptap's HardBreak node produces `<br>` (Shift+Enter) and is a separate thing from a paragraph (https://tiptap.dev/docs/editor/extensions/nodes/hard-break, fetched). One workable model, echoing the InDesign forum advice: stanza = one block, line = hard break inside it, stanza gap = space between blocks. Alternative: a custom `line` node. Either way, store lines explicitly and export the structure, not pasted whitespace. Leading indentation needs its own representation (indent level or leading em-spaces as a custom attribute) because CSS collapses plain spaces unless `white-space: pre-wrap` is used. That last point is background knowledge, unverified here.
- Word count: the existing words tally (`countWords`) is meaningless for poems. Offer lines and stanzas instead, or nothing. Do not shame short output. This fits "show words written, never shame".

### I1. Poem mode per document ("a poem is a different page")
- What: Per-story or per-piece setting (poem / prose / mixed). In poem mode: lines are units, Enter = new line, Shift+Enter or double Enter = new stanza (poet's choice, documented once), whitespace preserved, no auto-capitalisation of line starts, no smart-quote surprises beyond what the writer wants, hanging indent for wrapped lines, optional line numbers and a ruler of "characters per line".
- Fit: Q1 (help finish a poem that is theirs) yes, Q2 yes, Q5 calm. Resolves P1 and P2. No conflict. Structure stays optional.
- Offline: yes. Size: M (schema, CSS, paste handling for line breaks, round-trip tests). Largest risk is correct paste and copy of line breaks into other tools.
- Evidence strength: High (P1, P2).

### I2. Hanging indent for turnover lines, distinct from intentional indent
- What: Wrapped lines render with a visible hanging indent. A true author indent shows as space. The writer can see the difference, and the exports keep it.
- Fit: yes. Offline yes. Size: S-M (CSS plus model). Directly supported by Ampleman and LiberScript.

### I3. Export that keeps the poem intact
- What: Markdown (use trailing two spaces or backslash line breaks, plus blank lines for stanzas; background knowledge, unverified), EPUB (stanza as a block with line-break elements and spacing set on the stanza, in line with the Adobe forum workarounds), plain text and a printable poem-per-page PDF or print stylesheet (browser print is offline; one poem per page is a common layout per LiberScript). Preview in "book page width" to show where lines would wrap at, say, 64 characters.
- Fit: Q2 (open formats, own your work). Offline yes. Size: M. Highest-value, most testable part of poetry mode. Tests: round-trip a poem with dropped lines and blank stanza gaps through EPUB readers.

### I4. Line versions: try this break another way (side by side, no generation)
- What: Pin a stanza or poem, write an alternate version beside it, view both in two columns, and choose or keep both. A "break lab" mode that shows the same text as prose and lets the writer re-break by clicking between words, mirroring the prose-first exercise (P3). Existing Snapshots can be reused for whole-poem history, with a line-diff view.
- Fit: Q1, Q2, Q4 (teaches lineation by doing). Offline yes. Size: M (side by side) to L (diff). A line-level diff is small because poems are short.
- No conflict as long as it never proposes breaks. A suggested break would be a ghostwriting-lite feature: see R1.

### I5. Read-aloud view (sound without scoring)
- What: A calm view that shows the poem large with a visible breath mark per line break, no editing chrome, and optional text-to-speech from the device's own speech engine (offline voices exist on many systems, but quality and availability vary; unverified). Optional "record yourself" stored locally only if the writer chooses. No scoring.
- Fit: Q4 (teaches by use), Q5, Q6 if local. Supported by multiple poets recommending reading aloud (P3, P4). Size: S for view, M for recording. Recording audio raises storage and privacy-by-default questions; keep opt-in and local.

### I6. Sound hints that never rewrite
- What: Optional, off by default, writer-toggled margin hints per line: syllable count (language-aware), end-sound grouping (which lines share a rhyme sound) shown as letters in the margin (a b a b), repeated words highlighted (useful for sestina, villanelle, ghazal radif), and a "stress guess" shown faintly with a one-click "ignore this line". Always labelled "a guess". French: classical counting with e muet rules and a "diérèse? tap to count both" toggle.
- Fit: Q4 yes; Q1/Q2 yes if never changing the text. Danger of false authority (P6). English haiku 5-7-5 should be offered as a count, not a rule, and the product should not call it "wrong" if lines differ (Wikipedia on haiku).
- Offline: yes if the pronunciation data is bundled. English needs a pronunciation dictionary (for example CMU Pronouncing Dictionary; background, unverified here, check its licence before bundling). French needs a rule-based syllabifier plus a rhyme dictionary; bundle size is a cost (M-L). Size: M for counts using rules, L for real rhyme and stress data.
- Reject any variant that suggests or auto-inserts replacement words ("better rhymes for you", "fix meter"). See R1.

### I7. Form scaffolds as optional frames (villanelle, sestina, pantoum, ghazal, sonnet, haiku, tanka, prose poem)
- What: Start-from-form chooser that lays out empty stanzas with the form's skeleton and live trackers. Sestina: shows the six end words and the required order per stanza, ticks as lines are placed, envoi. Villanelle: shows the two refrains in place and marks where they must return. Pantoum: shows which lines repeat. Ghazal: shows the radif and qafia in each couplet, a reminder for the signature couplet. Every scaffold can be dismissed and the poem remains plain text. Show the rules from Poets.org-level definitions; add a one-line note on contemporary variation (Patricia Smith example).
- Fit: Q1 yes; Q4 yes (teaches form by using it). It matches "structure is a skeleton, not a cage" and "blank page first". Offline yes. Size: M (S per form once the engine exists). The tracker is deterministic and writes nothing for the writer.
- Check: the exact rules come from poets.org glossary and Poets of the Household (fetched). Dedicated pages for each form should be verified before shipping text.

### I8. Collection board (chapbook / manuscript)
- What: A "collection" container made of poems, like Parchemin's outline board, but with poem-specific aids: drag to reorder, mark opening and closing poems, group into sections (numbered or unnamed, per Reddy), tag by topic, form and tone, show a table of contents view and a one-page "first lines" list, a view of line counts to spot rhythm in the book, and an optional "echo finder" listing words used in many poems (the word-cloud idea, computed locally, not AI). Poem status (draft, near, set aside, finished) is the writer's own.
- Fit: Q1, Q2, Q5; consistent with the outline board and the finish line concept, but "one poem a day gets you to a chapbook" would be an overclaim. Offline yes. Size: M (reuse outline board, new views), L with print layout.
- Do not auto-sequence. An "AI order for you" feature is a reject (R2).

### I9. Poem page export for a chapbook
- What: Print-ready layout in a chosen trim size (5.5x8.5 per LiberScript convention) with one poem per page or poems sharing pages, long poems breaking at stanza boundaries, turnover indent in the right place, page numbers. Browser print to PDF keeps this offline.
- Fit: Q2. Size: M-L (page-break control is fiddly). Lower priority than I3.

### I10. Fragment pocket (a notebook that is not a structure)
- What: A fast capture area for lines, images, phrases, found text, with source note, which can be pulled into a poem. Commonplace-book style: entries tagged, searchable, no obligation.
- Fit: Q1, Q5; helps P11. Offline yes. Size: S-M. Pairs with existing Notes panel.

### I11. Found and erasure workspace
- What: Paste or type a source text; click words to keep and the rest dims (blackout) or removes (erasure) as a view; the source is stored with the poem and a citation line is prompted gently ("Where is this from?"). Export as plain poem, as blackout image or text with the source attached. Include a plain note that source authors deserve credit (Parks's Kenyon essay).
- Fit: Q1 (the poem is the writer's selection), Q2. Honest about attribution. Offline yes. Size: M. Copyright guidance should be minimal and non-legal ("check the source's terms"; do not give legal advice).

### I12. Per-line margin notes
- What: Private notes attached to a line or stanza ("weak ending?", "check this image"), shown in the margin, never exported unless chosen. Optional "keep or cut?" marks, chosen by the writer. Ties to Notes panel.
- Fit: yes. Size: M (anchoring notes across edits is the hard part; with a line node model it is easy).

### I13. Gentle daily-poem rhythm (optional)
- What: A quiet "a poem a day" April-style optional challenge or any month, with optional prompts from a list that writers can ignore (suggestions only), shown as an invitation. No streak loss, no leaderboards. NaPoWriMo itself states prompts are optional and says "no worries" when output is spotty.
- Fit: close to PHILOSOPHY.md's gentle habit. Counting poems rather than words. Careful not to create volume pressure (P12). Offline yes. Size: S.

### I14. Journal submissions log (private, optional)
- What: A simple local table: poem, journal, date sent, status, simultaneous flag, notes; reminders only if the writer asks. Export as CSV. No market database (that would need a network and curation) and no stats.
- Fit: Q1 weak (is about publishing, not finishing); Q6 yes. Probably later, or never. Size: S-M. Do not copy Chill Subs-style rejection bingo or badges.

### I15. A "why this line break" reflective prompt set
- What: Suggestion-only questions drawn from the craft sources, for example "Read it aloud. Where did you breathe?", "What happens if this word ends the line?", "What do you remember when you close the screen?" (memorisation test), "Which line would you cut to see if it still stands?". Shown on request in the existing Unblock panel.
- Fit: Q4 strongly; same pattern as `src/prompts.ts`. Size: S. Credit sources honestly.

### Reject list
- R1. Any feature that proposes lines, rhymes, replacement words, or "improves" a poem (auto-rewrite, AI "polish", suggested enjambment, "rhyme for you"): reject, violates the ghostwriting rule. Rhyme and synonym lookup shown on request as plain word lists is a gray area. Keep it as a word list lookup the writer drives, with no ranking by "quality of poem". Recommend deferring; the existing `no fix my prose button` rule is the safer reading.
- R2. Auto-sequencing a collection ("optimal order") or scoring a poem ("quality score", "originality meter", "done meter"): reject as overclaiming. Poets themselves say there is no objective endpoint (P4) and the app would invent authority.
- R3. Streak or volume pressure for NaPoWriMo-style challenges (shame badges, "you missed a day"): reject.
- R4. Cloud rhyme or analysis APIs that send poems off-device by default: reject (Q6, harvesting). If ever offered, opt-in and clearly labelled. Rhyme data should be bundled and local.
- R5. Mandatory forms or syllable rules ("your haiku is invalid"): reject. Offer counts, not verdicts.

---

## 5. Open questions and gaps

Questions for the coordinator or the writer of the app:
1. Data model: does a poem live as a Scene in a Story, or does Parchemin need a "Collection" type that holds poems as its children? That choice drives I1, I8, I9 and backup/restore format.
2. How should lines and indentation be stored so that Markdown, EPUB, backup JSON and the editor all agree? (Needs a short design spike with real test poems: dropped lines, long lines, empty stanzas, mixed indent.)
3. Which languages ship first for sound hints? English needs a bundled pronouncing dictionary (size, licence); French needs rules plus rhyme data. Is French first-class from day one, given the name?
4. How strict should the line "model" be on paste: treat every newline as a line break in poem mode (sensible) while prose mode keeps current behaviour?
5. Where does poetry sit relative to PHILOSOPHY.md's craft method (hero, plot, chapters)? Probably needs its own light craft section (image, line, sound, turn, ending) rather than forcing story structure. Needs a design decision before building, since "every craft tool can be ignored" must hold.

Research gaps in this note (not investigated, or investigated but not verified):
- Poets' own words on complaints about Scrivener, Word, Obsidian, Notion and Google Docs. Only the snippet-level complaint about hanging indents on the web and the Adobe EPUB thread were found. A forum search (Scrivener, Reddit r/poetry, Writing.com) was blocked by the search budget.
- Clichés, sentimentality, imagery versus abstraction, voice: nothing read in this session. Needed for prompts in I15.
- Poets' attitudes toward AI writing tools: not researched here; the philosophy already rules out ghostwriting, but it would help to know how poets feel about "poetry assistants" and rhyme suggestion tools. Also not checked: whether poetry journals ban AI-generated submissions (unverified).
- Journal submission requirements (format, poems per page, simultaneous submissions): Poetry Foundation's page returned 403. Only the general advice (separate pages, one document) is background knowledge, unverified.
- Richard Hugo, "The Triggering Town", and other craft books by poets on starting from an image: not read.
- Performance poetry: no first-hand account of how performers mark scripts (breath marks, beats). Worth asking spoken-word poets before building I5 beyond a plain read-aloud view.
- Accuracy numbers for scansion tools: the ZeuScansion PDF could not be read.
- Multilingual poets: no source on code-switching, translation workflows or French typography beyond metric rules. Typography rules such as non-breaking spaces before French punctuation are background knowledge.
- Evidence on NaPoWriMo outcomes (completion, quality, burnout): none.
- Accessibility of poetry for screen readers (line breaks read as pauses, indentation lost): not researched.
- Spelling out stanza vs line semantics for mobile: not tested.

---

## 6. Source list

Fetched (read via WebFetch, through a summarising model):
- https://www.writing.upenn.edu/library/Olson-Charles_Projective-Verse.html - primary text, Olson 1950; the typewriter and space passages are directly relevant. High.
- https://www.cincinnatireview.com/in-praise-of/in-praise-of-the-flush-and-hang/ - Lisa Ampleman, journal editor; practical typography of long lines in print. High.
- https://community.adobe.com/questions-671/best-way-of-formatting-stanzas-of-poetry-for-epub-export-883964 - InDesign forum thread; real EPUB stanza problem and workarounds. Medium (tool-specific).
- https://liberscript.com/guides/poem-formatting-rules-guide - vendor guide on poem typesetting conventions; useful, commercial. Medium.
- https://en.wikipedia.org/wiki/Dropped_line - definition of dropped line; digital implications were the summariser's and my inference. Medium.
- https://en.wikipedia.org/wiki/Line_(poetry) - overview of lineation, enjambment, capitalisation. Medium.
- https://www.pw.org/content/craft_capsule_the_end - Cameron Awkward-Rich (Poets & Writers); memorisation as test of finish. High.
- https://www.writersdigest.com/how-to-complete-a-poem-a-mini-survey - short quotes from named poets on finishing. Medium-High (as summarised).
- https://www.writersdigest.com/poetry/some-thoughts-on-poetry-revision - Jeffrey Hillard; revision practice. Medium.
- https://www.writebetterpoems.com/articles/when-is-a-poem-finished-done - The Poetry Place blog; reader-based finish test, over-revision warning. Medium.
- https://www.writebetterpoems.com/articles/how-to-sequence-a-poetry-manuscript - same site; Floor Method and sequencing. Medium.
- https://www.pw.org/content/order_out_of_chaos_revising_your_poetry_manuscript_0 - Nancy Reddy; concrete manuscript methods. High.
- https://www.writersdigest.com/getting-published/5-tips-for-organizing-poetry-chapbook-manuscripts - Robert Lee Brewer; five chapbook orders. Medium.
- https://litmagnews.substack.com/p/assembling-a-poetry-manuscript-a - paywalled; only title and author seen. Not used for claims.
- https://www.poetry-now.com/blog/line-breaks-in-poetry-how-to-make-the-page-breathe - line-break exercises. Medium.
- https://www.149review.org/craft-essays/theimportanceoflinebreaks - Pasmore and Cooper craft essay on line breaks. Medium.
- https://writers.com/line-breaks-in-poetry - teaching-site line-break guidance. Medium.
- https://poets.org/glossary - Academy of American Poets definitions of forms. High.
- https://poets.org/text/flexing-form-contemporary-innovation-sestina - sestina rules and variations. High.
- https://poets.org/text/national-poetry-month - history of National Poetry Month (1996). High.
- https://napowrimo.net/ - NaPoWriMo's own description and stance on optional prompts. High (about itself).
- https://www.poetsofthehousehold.com/learn/forms/ghazal - ghazal rules and pitfalls. Medium.
- https://pshares.org/blog/the-formal-imagination-of-oulipo/ - Oulipo and constraint; Mary Oliver and Robert Hass remarks. Medium-High.
- https://www.thehistoryofblackoutpoetry.org/ - academic project on blackout/erasure history. Medium-High.
- https://poetshouse.org/mary-ruefle-on-erasure-an-interview-by-correspondence/ - Ruefle on her erasure process. High.
- https://kenyonreview.org/kr-online-issue/2020-julyaug/selections/cecily-parks-656342/ - Cecily Parks on ethics of erasure. High.
- https://en.wikipedia.org/wiki/Found_poetry - overview of found poetry and cut-ups. Medium.
- https://en.wikipedia.org/wiki/Prose_poetry - definition and French origins. Medium.
- https://en.wikipedia.org/wiki/Haiku_in_English - 5-7-5 debate, Trumbull. Medium-High.
- https://www.analyseur-texte.fr/blog/guide-compteur-syllabes-poesie-versification - French syllable-counting rules; vendor blog. Medium.
- https://www.analyseur-texte.fr/compteur-mots-poesie - French syllable counter, states text stays local. Medium (self-reported).
- https://semirimes.fr/ - French poet tools suite. Medium.
- https://rime.academy/dico - French rhyme dictionary with classical prosody. Medium.
- https://www.rhymezone.com/ - English rhyme and word finder, home page only. Medium for features, no complaints evidence.
- https://www.readpoetry.com/poetry-submissions/ - how poets track submissions. Medium.
- https://madubbspoetry.wordpress.com/2023/01/12/comparing-online-submission-managers/ - one poet's comparison. Medium.
- https://www.ceridwenhall.com/blog/commonplace-books - a poet's notebook practice. Medium.
- https://letterreview.com/why-do-poets-use-a-writers-notebook/ - notebook workflow, light blog. Low-Medium.
- https://www.toasted-cheese.com/absolute-blank/keeping-a-commonplace-book/ - commonplace book definition. Low-Medium.
- https://www.abbyblandpoetry.com/blog/is-there-a-difference-between-stage-and-page-poetry - personal blog on page vs stage; thin. Low-Medium.
- https://tiptap.dev/docs/editor/extensions/nodes/hard-break - Tiptap docs on HardBreak. High (official).

Seen only in search results (not read in full, treat as unverified beyond the title or snippet):
- https://medium.com/parenthetical-note/why-are-the-poetry-format-options-on-the-web-so-shitty-390d0c1b25b3 - 403 on fetch. Snippet only.
- https://www.poetryfoundation.org/articles/70144/learning-the-poetic-line - Rebecca Hazelton; 403 on fetch. Title and snippet only.
- https://tydfoundation.org/wp-content/uploads/2023/03/Learning-the-Poetic-Line-by-Rebecca-Hazelton-_-Poetry-Foundation.pdf - PDF copy, unreadable in fetch.
- https://ypn.poetrysociety.org.uk/features/keeping-a-notebook/ - Helen Mort; 403 on fetch.
- https://movingwriters.org/wp-content/uploads/2020/04/how-do-i-know-when-a-poem-is-finished-by-naomi-nye-week-4-minilesson.pdf - Naomi Shihab Nye; unreadable PDF.
- https://aclanthology.org/W13-1803.pdf and https://jlm.ipipan.waw.pl/index.php/JLM/article/download/102/136/1080 - ZeuScansion; unreadable PDFs.
- https://www.soundonsound.com/reviews/masterwriter, https://kindlepreneur.com/masterwriter-review/, https://atpm.com/17.03/masterwriter.shtml - MasterWriter reviews; snippet only.
- https://duotrope.com/ - 403 on fetch.
- https://www.poetryfoundation.org/education/glossary/ghazal and https://www.poetryfoundation.org/poetrymagazine/submissions - 403 on fetch.
- https://www.ucd.ie/teaching/t4media/finding_your_poems_best_line_breaks.pdf - 403.
- https://www.kinglearprizes.org.uk/hints/whenismypoemfinished - 404 at fetch time.
- Listicle pages such as gitnux.org, worldmetrics.org, zipdo.co "best poetry software" - appeared in search, not used (SEO content, quality Low).

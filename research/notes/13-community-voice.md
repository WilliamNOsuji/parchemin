# 13. Community voice: what writers say about tools like Parchemin

Round 2 research note for Parchemin. Area: first-hand testimony from forums, threads, blogs and reviews about what writers
want from a writing tool, how they feel about products like this one, and what that means for how Parchemin should
adapt. Date of research: 2026-10-04.

**Method and honesty notes.** Read these before the findings.

- **Reddit was not reachable.** The web search tool refuses reddit.com and the fetch tool cannot open it. I did not work
  around that (no mirrors, no scraping, no proxy readers). Royal Road forums, AppleVis forums, MetaFilter, Booknode, the
  CBC and Medium also returned 403 to the fetch tool. Fanlore, AO3 and Absolute Write were skipped because
  `research/README.md` already records that their terms restrict automated access. Section 8 has a short kit for a human
  Reddit pass.
- **What stood in for Reddit.** (1) The local thread corpus in `research/threads/` (Hacker News, Lemmy, Writing Stack
  Exchange). I added two Hacker News themes to `research/tools/queries.json` (`products`, `trust`) and fetched 46 more
  threads with the existing fetcher, inside its rate limits, for 622 threads in total. (2) Public community posts on
  Tumblr (with note counts as a rough reach signal), Tildes, Goodreads groups, the Literature & Latte forum and the French
  Jeunes Écrivains forum. (3) First-person blog and Substack posts by writers. (4) Review sites (Trustpilot, Capterra,
  Product Hunt). (5) Press stories that quote writers. (6) French and Quebec sources.
- **Quotes.** Usernames are not recorded. Quotes are kept short. Quotes from the local corpus were checked word for word
  against the saved thread files. Quotes from web pages came through the fetch tool's summariser and should be treated as
  near-verbatim: re-check any quote against its URL before using it anywhere public.
- **Bias.** People who post about writing software are tool-curious. Hacker News, Lemmy and Tildes skew technical,
  privacy-minded and Linux-friendly. Tumblr skews young, queer and fan-fiction. The Goodreads thread skews indie authors.
  Review sites skew toward people who were delighted or furious. Nothing here is a sample. When I say "several", I mean
  several independent voices I read, not a share of writers.
- **One unverified figure, not used.** A vendor blog cites a "2024 Reedsy survey of 1,007 independent authors" (38% draft
  in Scrivener, 67% switched software mid-manuscript) with no link. I could not find the survey. Do not quote it.
- **One false lead, corrected.** A third-party review site (automateed.com) says Novlr is rolling out AI autocomplete. Novlr's own public
  statement says it does not and will not build generative AI into Novlr. I treated the review site as unreliable.
- **Confidence labels.** High: several independent first-hand voices, or a primary source read. Medium: one or two
  first-hand voices, or a secondary report. Low: search snippet only.

---

## 1. Executive summary

1. **The first thing writers ask of a tool is that their words cannot be lost, locked or taken.** Losses come up again
   and again: a phone in a pool took five unbacked-up chapters, an app "deleted" part of a book, corruption pushed a
   prolific author off Scrivener to plain files, and Google flagged a romance author's 222,000 words of drafts as
   "inappropriate" and cut off readers' access to them. Parchemin's local
   design answers "locked" and "taken" better than almost anything else on the market. It does not yet answer "lost" in a
   way writers can see. (High.)
2. **Trust in cloud tools has broken in public, several times, and writers remember.** Writers point to Google Docs
   lockouts and the AI-training scare, Microsoft Word's "connected experiences" scare, AO3 scraping, Wattpad's automated
   moderation, Grammarly's "expert review" clones of real writers, NaNoWriMo's AI statement, and Apple's writing tools
   showing up inside Scrivener. Writers whose content gets flagged (romance, queer fiction, fan fiction) feel this most. (High.)
3. **Taking a clear stand against generative AI wins goodwill that spreads by word of mouth.** A Tumblr post recommending
   Ellipsus ("queer friendly, anti-AI", with an "export to AO3" button) reached about 66,000 notes. Novlr publicly dropped
   its NaNoWriMo sponsorship and pledged never to build generative AI. Literature & Latte's line, "Scrivener itself
   contains no artificial intelligence," is its own answer to worried users, and Tumblr lists credit Scrivener's maker with
   having "vowed against AI". Writers keep and share lists of tools sorted by AI stance. (High.)
4. **"No AI" has nuance, though.** In a survey run by a French self-publishing service, 75% of 1,000 French authors said
   they know and use AI or partly AI-assisted tools: 55% for research, 43% for proofreading, 31% for help with writing. Antidote, the widely used French grammar checker made in
   Quebec, now offers generative rewording. Even proudly human authors say they used AI "aside from research, spellcheck,
   grammar". Writers almost all reject AI that writes, and they argue about everything else. (Medium-High.)
5. **The most common functional request is to write on more than one device.** Writers love Google Docs because it works
   "from phone, laptop, work pc, gaming pc, or my fridge". People write whole novels in their phone's Notes app. At least
   one writer left a web-only tool for Scrivener over it. Under the local-first launches I read, the first questions were "How do I
   save?" and "Will there be sync?". (High.)
6. **Browser storage specifically is distrusted.** A review notes that Dabble's web app shows a standing "Data may be
   evicted" warning. Reviewers fault Ellipsus for having no automatic backups. One writer cited Dabble being "a website only (sure,
   PWA so it *could* work offline)" as a reason to go back to Scrivener. Parchemin is a PWA, so it carries this doubt by
   default. (Medium-High.)
7. **Writers want power they can ignore.** The most common complaint about feature-rich tools is not a missing feature.
   It is that the tool became the procrastination: "I have definitely used it as a means of procrastination"; "got too
   lost in the extra features". What they praise is "perfect defaults so I don't feel like tinkering" and tools that "can
   be as simple as you want". Parchemin's "blank page first" principle matches this. Its craft tools must stay out of the
   way until asked for. (High.)
8. **Getting work in and out decides whether writers switch at all.** Export people need: .docx for agents and editors,
   AO3-ready formatting (a script that fixes Google Docs-to-AO3 italics has about 34,000 notes on Tumblr), and poem-safe
   layout. Import people need: "I've more than a million words in it so it's unlikely I'll switch." Parchemin has no import
   today. (High.)
9. **The calm, minimal, local, no-AI writing app is already a crowded genre.** Tomoshibi, Justwrite, Kraa, Ellipsus,
   Novlr, FocusWriter, iA Writer, novelWriter, TypeSlate, ADHD Novelist and others all claim some of that ground. Commenters
   joke "YADFWA" (yet another distraction-free writing app) and say building writing software is "olympic level
   procrastination". Calm and local get Parchemin noticed. They will not set it apart. What sets it apart is the method:
   helping writers finish. (Medium-High.)
10. **One Hacker News commenter described Parchemin almost exactly**, unprompted, under an AI fiction tool: something that
    "doesn't write for you at all, instead it helps you build out your storyline", with prompts, a story bible and
    encouragement. That is a single voice, not proof of demand. Still, the niche exists, and people state it in Parchemin's
    own words.

---

## 2. What writers are looking for

Ranked by how often the need came up and how strongly people felt it. "Today" is what Parchemin does now. "Gap" points to
section 6.

| # | Need | What writers say | Today | Gap |
|---|---|---|---|---|
| N1 | **My words cannot be lost, locked or taken** | Losses, lockouts and corruption (section 2.1) | Local, offline, JSON backup, MD and EPUB export | Safety not visible; no folder copy; browser storage doubted |
| N2 | **My words are mine** (no training, no scanning, no moderation) | Section 2.2 | No server, no AI | Not said plainly; browser and OS AI not addressed |
| N3 | **Write anywhere, on any device** | Section 2.3 | PWA on any one device | No path between devices |
| N4 | **Start in seconds, grow into it** | Section 2.4 | Blank page first; tools optional | Keep it that way; test it |
| N5 | **Keep the long work in one place** | Section 2.5 | Chapters, outline board, characters, snapshots | Notes and research beside the draft; mid-project template switch |
| N6 | **Get the work out in the shape others need** | Section 2.6 | Markdown, EPUB | .docx, AO3 HTML, poem-safe export |
| N7 | **Bring my existing work in** | Section 2.6 | None | Import |
| N8 | **Honest, affordable, knowable pricing** | Section 2.7 | Free, no account | Funding model and exit plan not stated |
| N9 | **A process that fits my brain and body** | Section 2.8 | Gentle copy; streak count; words only | Rhythm view, read-aloud, other units |
| N10 | **Company and accountability without surveillance** | Section 2.9 | Solo | Content-free progress export; private challenge |

### 2.1 N1. "Don't lose it" (High)

- A debut novelist drafted a whole first novel (87,000+ words) in the iPhone Notes app with one thumb, and along the way
  lost five chapters when the phone fell into a pool: "My Notes weren't backed up." (Writer's Digest, 2 July 2026.)
- Dabble review, February 2026: "A large portion of my book was deleted," with slow support. Plottr reviews on Capterra
  mention data loss in earlier versions and losing access to files (2 of 25 reviews).
- P.D. Workman, a prolific author (the post is titled "70+ Books Later"), left Scrivener after seven years over
  corruption, slow performance and version migration, and now drafts in plain Markdown files: "Plain text will never
  become obsolete." (Updated August 2025.)
- In 2024 Google flagged a romance author's Google Docs drafts (over 222,000 words) as "inappropriate". The drafts could no
  longer be shared, readers lost access, and the author could not tell what had triggered it (WIRED via Dexerto and
  GIGAZINE; snippet). On Hacker News the consensus was blunt:
  "the thing about computing with someone else's computer is, that someone else ultimately decides what you can do."
- A Tumblr post urging fan writers to download everything from Google Docs claims a "mass deletion" of fic files. The
  claim is alleged and unverified, but the fear is real. A reblogger's answer was to keep writing in Docs and copy
  finished chapters to local files as backup.
- Shutdowns add to the worry: Simplenote (July 2025, under four weeks' notice to export), NaNoWriMo (March 2025), Kindle
  Vella (February 2025, round 1 note 06). On trackers: "Past projects will be lost if you drop your subscription."

**What this means for Parchemin.** "Local" answers lockouts and shutdowns. It does not answer loss unless the writer can
see that a copy exists somewhere other than this browser. See R5.

### 2.2 N2. "My words are mine" (High)

- **AI training scares.** In 2023 BookTok authors spread warnings that Google Docs drafts could train AI ("Google is NOT
  your friend," a fantasy author said); Google denied it (Daily Dot, August 2023). In November 2024 Word's "connected
  experiences" setting set off a similar alarm; Microsoft denied training on documents (The Register, BleepingComputer).
  Writers acted anyway. They tell each other to use LibreOffice because "it's local on your device, so no AI can scan it"
  (Tumblr, July 2026).
- **Scraping.** When writers found AO3 text in model training data, many locked their works to logged-in readers
  (TechCrunch, October 2023; snippet). On Lemmy, writers call using AI to recommend fic "the antithesis of the community".
- **Moderation.** Wattpad's automated content review reportedly shadow-bans or deletes flagged books without notice, and
  LGBT content is said to be hit hardest (search snippet, 2025; Low). The Google Docs lockouts hit romance and fan
  writers. Ellipsus reviewers flag an "unclear content policy" and possible "payment processor pressure".
- **AI that imitates writers.** In March 2026 Grammarly's "Expert Review" gave feedback in the style of named living and
  dead writers without their consent. It was pulled after an outcry and a lawsuit. On Hacker News: "Grammarly seemed
  pretty dead on arrival the moment they added AI features." A second-language writer said Grammarly "forced me to remove
  that layer of personality from my texts".
- **AI you didn't install.** Literature & Latte had to write a help page because Apple's system-wide writing tools appear
  inside Scrivener: "Scrivener itself contains no artificial intelligence (AI)... there's no way to exclude these features
  from the app." Chrome's "Help me write" (Gemini) appears in web text fields the same way.
- **Feeling mistaken for a machine.** A Lemmy writer holds back from publishing because of "Imposter Syndrome-like
  perception that my texts would be mistaken for the output from some AI out there". In June 2026 fans circulated a 25-page
  PDF naming about 30 AO3 writers as Claude users, based on one HTML artifact, and harassment followed. AI detectors
  wrongly flagged non-native English essays about 61% of the time on average (Stanford study, 2023). Students and some writers now keep Google Docs
  revision replays (Draftback) as proof that they wrote their work themselves.

**What this means for Parchemin.** Having no server is the strongest possible answer, and Parchemin never says it out
loud to the people who need it most. See R1 to R4.

### 2.3 N3. "Let me write anywhere" (High)

- "I use google docs... From phone, laptop, work pc, gaming pc, or my fridge" (Lemmy, 2023). Google Docs is "by far the
  most popular" in that thread, with the caveat "(besides AI training material... but I'm not sure about that yet)".
- One fan writer moved from Google Docs to Ellipsus for "a good mobile experience, and the ability to sync my work across
  devices". Alternatives were "iOS-only, desktop-only, or paid" (Tumblr guide, 2024).
- "Dabblewriter was almost as good, but I got tired of the yearly payment and it being a website only (sure, PWA so it
  *could* work offline) had me going back to scrivener" (Lemmy, 2023).
- Novels are written on phones: in Notes with a thumb (Writer's Digest 2026), drafted on the London tube in Scrivener iOS
  (HN 2017), dictated to Siri (snippet).
- The two local-first launches I read drew the same questions: "How do I save?" (Tomoshibi, HN 2026), and multi-device sync is
  the top request under Justwrite on Product Hunt. Round 1 (note 09) showed sync is also where tools break.

### 2.4 N4. "Let me start now, and grow into it" (High)

- Scrivener: "it has a learning curve, and I have definitely used it as a means of procrastination. If you struggle with
  the habit of actually sitting down to write, maybe stick with Word for a while" (Lemmy, 2023).
- "I've tried a few different programs... but found I got too lost in the extra features and spent all my time with them
  instead of actually writing the story... I'm a pantser" (Lemmy, 2023).
- "Scrivener seems like it's good at solving problems I mostly don't feel I have" (HN, 2022). "Why does something so useful
  have to be so difficult to master?" (Substack, 2024).
- Obsidian "got too overwhelming for me because I kept tinkering with plugins and CSS". A self-hosting novelist on Tildes:
  "I would get hyper focused on learning the options, therefore losing momentum."
- What people praise is calm defaults: iA Writer has "the perfect defaults so I don't feel like tinkering" (HN). novelWriter
  is "full of features but can be as simple as you want it" (review site).
- Some writers want even less: "Too many features. Not looking for a novel writer" (a typewriter-simulator builder on
  Lemmy, 2025). Others use paper first.
- Long character questionnaires draw the same complaint. Bloggers call 200 to 400-question sheets "filler" and say they are
  fun "only as procrastination". Targeted questions get a better reception. Parchemin's want/fear/need fields are targeted.

### 2.5 N5. "Keep the long work together" (High among novelists)

- What Scrivener fans love: writing "in any order", the binder, "character sheets, locations, research, notes, etc in one
  place", snapshots and the corkboard (Lemmy, HN, Goodreads). "Coming from word it was a game changer" (HN).
- Plottr reviewers on Capterra (25 reviews, 2022-2026) praise the timeline, series bible and tags. Nine mention templates,
  most of them favourably. They also report "Cannot switch templates within existing project", "Inaccessible for users with
  visual disabilities", slowdowns with many text-heavy cards, and template setup time.
- Writers keep research beside the draft or in a second tool: Obsidian with DevonThink, Obsidian with LibreOffice, Campfire
  with Nimble Writer, Excel ("Unironically") for long arcs.

### 2.6 N6 and N7. "Let me get it out, and bring it in" (High)

- **.docx.** "If you publish with a publisher, you'll eventually have to end up in .docx" (HN). Pantser Graham Strong stays
  in Word because "You have to export anyway" (2024).
- **Book formatting** pushes people between tools. Scrivener: "when it came to prepping it for print and various ebook
  formats - what a total nightmare... I want to write books not get tangled up in the tech" (HN, 2022). A Vellum fan wanted
  drop caps that took "very complicated ways... involving CSS" in Scrivener.
- **AO3.** Pasting from Google Docs puts stray spaces next to italics, and "formatting almost always gets fucked up". A
  volunteer's "Post to AO3" Docs script has about 33,900 notes. Ellipsus's "export to AO3" button came up in every
  fan-writer recommendation of Ellipsus I read.
- **Poems.** A poet on Substack (May 2025) objects that line wrapping on narrow screens wrecks rhyme, line ends and
  indentation. Readers in the comments add that they spend more time formatting than editing, and that stanzas vanish on
  mobile. This matches round 1 note 07.
- **Import, the step before switching.** "I've more than a million words in it so it's unlikely I'll switch" (HN, on
  Scrivener). Ellipsus migrants complain about "manual one-at-a-time file imports" and Markdown-only import. One writer
  picked TrackBear because it imports past NaNoWriMo projects.

### 2.7 N8. "Tell me what it costs and how it ends" (High)

- Price ceilings are low for hobbyists: "None of the platforms I have found are either affordable or as practical as Google
  Docs... a lot of the other platforms want $30-90 a month... i am not Laurel K Hamilton" (Tumblr reblog). Goodreads authors
  in 2018 chose LibreOffice and yWriter on cost.
- People want to know the business model before they invest a minute. On Kraa (HN, December 2025): "the first thing I want
  to know it 'how much' and then shortly after that I want to know 'can I run it myself'", and "If I don't understand the
  business model and how much I could be locked-in, I don't even bother". On a free app in 2017: "If it's free how do you
  plan to sustain it."
- Subscriptions are resented, and one-time or lifetime models are praised. Literature & Latte staff: "We are not interested
  in any form of subscription model." iA Writer is "a one-time purchase, consistently updated through the years". Ellipsus
  turns into a lifetime licence after 24 months of payments (about $144, per a July 2026 review).
- Open-source tools earn trust that commercial tools have to work for: novelWriter, Manuskript, yWriter, LibreOffice,
  TrackBear ("free to use, free to self-host... explicitly does not use AI").

### 2.8 N9. "Fit how I actually work" (Medium-High; strong within segments)

- An ADHD author: daily word counts turned writing into "guilt-inducing numbers games". What works instead is dictation
  ("My brain moves quickly. My hands do not."), writing scenes out of order, several manuscripts at once, and reading aloud
  (Feb 2026).
- A dyslexic novelist uses an AI voice app to read the draft back, "really useful for catching all the silly little typos
  that my dyslexic mind just can't see" (Lemmy, 2025). Note that the useful part is voice, not generation.
- A chronically ill writer (POTS, EDS, autism and ADHD): "Being a chronically ill writer is not linear." The answer has
  been to stop promising schedules that illness will break (March 2026).
- TrackBear, the tracker many writers moved to after NaNoWriMo, counts words, chapters, pages, scenes, lines or time,
  because poets, comic writers and serial writers do not all count words.
- Anxiety at the keyboard: "Whenever I'm not at my computer, I think, 'I really want to write'. Then I get to my computer
  and get paralyzed with anxiety" (Lemmy, 2023).

### 2.9 N10. "Don't make me do it alone" (Medium)

- NaNoWriMo is grieved, not just criticised: "I wrote my first novel during the 2020 NaNo run" (Char Anna, April 2025);
  "More important to me than Christmas for a number of years"; "I wrote 15 novel manuscripts encouraged by their community"
  (blog comments, 2025). Writers now run their own challenges with TrackBear, spreadsheets, Discord and Bluesky.
- Small honour-system accountability works for some: Lemmy pairs who count days with "at least fifteen minutes" of writing
  ("Last week was my most productive week in a while"), and daily Zoom sprints that cured one writer's "Lonely Writer's
  Syndrome" (search snippet).
- What they want is company, not surveillance. Nobody asked for an app to read their text in order to keep them
  accountable.

---

## 3. How people feel about a product like Parchemin, attribute by attribute

| Attribute | Sentiment | Evidence | Risk |
|---|---|---|---|
| **No generative AI** | Strongly positive in fan, poet, queer, literary and French literary circles; accepted or welcomed by most others | Ellipsus Tumblr reach (about 66,000 notes); Novlr's pledge; L&L's "contains no AI"; Tumblr lists sorting tools by AI stance; French writers boycotting generative AI (Le Monde tribune, June 2026) and a "100% humain" label | A soft "opt-in AI later" line can sound like a hedge. NaNoWriMo and Grammarly show trust can collapse in a week |
| **Local-first, no account** | Positive, especially after lockouts | A Product Hunt commenter called local-first the right call after a cloud app ate their draft; "opening instantly without sign-in" (another maker); Tildes self-hosters; HN on Google Docs | The very next question is always save, backup and sync |
| **Runs in a browser (PWA)** | Mixed | Praised for working everywhere ("Windows/Linux are not really considered to be first class citizens"; "Android please"). Doubted for storage (Dabble's eviction warning; "website only") and speed on long texts (Google Docs "very laggy" past about 20,000 words; Ellipsus lag; Dabble a "CPU hog") | Writers may assume a browser app is temporary |
| **Structure templates and craft tools** | Positive when optional and switchable; negative when they feel like homework or a cage | Plottr template praise; pantsers who drown in features; character questionnaires seen as procrastination; Save the Cat critiques (round 1 note 03) | Craft tools crowding the page; a template you cannot leave |
| **Calm, minimal** | Liked, and very common | iA Writer, FocusWriter, Ommwriter, Tomoshibi, Justwrite, Kraa; "YADFWA" | Calm does not set Parchemin apart |
| **Free** | Welcome, then questioned | "If it's free how do you plan to sustain it"; Kraa questions about lock-in | Writers stay away if they suspect a bait-and-switch |
| **Made by a small team** | Sympathy, plus two sharp suspicions | Launch posts "riddled with LLM-speak" draw immediate fire (Tomoshibi on HN, 2026; Neo on Tildes); "i also made an app for my writing process and quickly realized it was a distraction from the actual work of writing" | AI-sounding copy kills a launch in this audience. Writers may ask whether the app itself was built with AI |

**The clearest single statement of the niche** came from a Hacker News commenter under an AI fiction tool (August 2026):
"I want something like this, except it doesn't write for you at all, instead it helps you build out your storyline, gives
you writing prompts and feedback, maybe sometimes suggests ideas if you feel stuck, helps keep your character/story bible in
order". Under the same post: "AI feels like a Faustian bargain that has been struck on my behalf by others who do not know
me." Both are single voices.

---

## 4. Voices by segment

| Segment | What they want | What they fear | Notes for Parchemin |
|---|---|---|---|
| **Fan fiction writers** | Phone and desktop, sync, AO3-ready output, free, community-friendly tone ("All writing is writing, fanfic is valid") | Moderation of explicit or queer content, scraping, AI accusations, subscriptions | The easiest group to reach by word of mouth (Tumblr). "Copy for AO3" plus "no server" is a direct pitch. Needs a phone path |
| **Romance and "spicy" authors** | A place where nothing is flagged; volume (series) | Flagging and lost sharing (the 222,000-word case); payment-processor rules | Local storage means no moderation exposure. Keep it that way if sync is ever added (end-to-end encryption) |
| **Poets** | Line and whitespace integrity; no AI ("do you know how long it took me to get those words in that order?") | Tools that reflow the poem; AI verse flooding contests (the Foyle Young Poets award bans AI entries) | Poem mode and poem-safe export (round 1 note 07) are confirmed by poets' own complaints |
| **Web serial writers** | Release buffer, cadence, burnout protection (Royal Road threads advise a stockpile of 5 to 125+ chapters; snippets only) | Burnout, platform collapse (Wattpad's ads and paywall; Kindle Vella) | A "ready to post" queue per story is a cheap fit. Not researched deeply (forum blocked) |
| **ADHD, chronically ill, dyslexic writers** | Out-of-order writing, several projects, dictation, read-aloud, no guilt numbers, low-energy entry | Word-count guilt, rigid structure, broken streaks | Rhythm view and read-aloud (round 1) are confirmed. Dictation runs through the OS keyboard; do not add a cloud speech service |
| **Blind and low-vision writers** | Real screen-reader support. AppleVis users call Scrivener on Mac accessible but "inaccessible by virtue of its complexity" (snippet) | Complexity; visual-only planning tools (Plottr review) | Round 1's accessibility fixes stand. Simpler is itself an accessibility feature |
| **Phone-first writers** | Instant capture, one-thumb editing, never losing a line | Losing everything with the phone | The PWA must be good on phones. Backup matters most here |
| **French and Quebec writers** | Good French spelling and grammar (an old forum post: yWriter's checker "ne convenait pas"); Antidote; typography | AI in literature (the Thélyson Orélien affair, Sept-Oct 2026; Hervé Le Tellier: "Fabriquer ses phrases, trouver ses mots, si ce n'est pas ça, notre métier, qu'est-ce que c'est?") | French UI and typography (round 1 note 11); test the Antidote browser connector. Antidote now also offers AI rewording, which is the writer's choice and outside Parchemin |
| **Plain-text and technical writers** | Files they own, git, Markdown, open source, Linux | Proprietary formats ("the proprietary file format and requirement to use Dropbox for syncing killed it for me") | A folder of Markdown files is the trust signal for this group (round 1 Tier 2 #17) |
| **First-time writers** | "What do others use?"; something "better suited to the writing process" than Word | Choosing wrong; wasting months on setup ("Id hate to waste 6 months... only for someone to say 'I cant believe you dont use *Program*'") | Parchemin's craft method is aimed at this group. Show it by using it, not with a tour |

---

## 5. What the evidence says not to do

These come from the testimony itself and agree with `PHILOSOPHY.md`'s rejects.

- **Do not hedge on AI.** Writers read "AI neutral" or "opt-in later" as a door left open. The two loudest trust collapses
  in this space (NaNoWriMo 2024, Grammarly 2026) were about AI.
- **Do not read the text, even "to help".** Moderation, scanning and training fears are the main reasons writers leave
  cloud tools.
- **Do not use AI-sounding copy** anywhere: site, README, launch post, release notes.
- **Do not make the tool the project.** Writers punish tools that invite tinkering, and say so.
- **Do not lock history behind payment**, and do not let lapsed users lose access to their own past.
- **Do not promise sync that is not ready.** It is the most requested feature and also the one most often broken.
- **Do not run AI detection or "proof of human" scoring.** Detectors are biased against non-native writers, and fan
  communities are already being harmed by bad evidence.

---

## 6. How Parchemin can adapt

Each item is checked against `PHILOSOPHY.md`'s six questions. "New" means this round found it. "Reinforces" points to
`research.md` section 6 (round 1 tiers). Sizes: S is days, M is one to three weeks.

### Tier A: say what is already true, and close the AI loopholes (all S)

| # | Change | Evidence | Philosophy check |
|---|---|---|---|
| R1 | **A plain-language "Your words" page**, linked from the home screen and the site. What it covers: no server reads your words; nothing to train on; nothing to flag or moderate; no account; how to get everything out; what happens if Parchemin stops; how Parchemin is funded. Write it the way a writer would say it to a friend | N1, N2, N8; Ellipsus's and Novlr's goodwill; Kraa's "how much... can I run it myself" | Passes all six. It describes what is already true |
| R2 | **Decide the AI line and state it as a pledge.** Today `PHILOSOPHY.md` leaves room for "an opt-in assistant". The testimony suggests the cleaner position is "Parchemin has no generative AI" stated as a lasting promise, with any future helper (if it ever exists) limited to non-generative help such as read-aloud and search. **This is the team's decision.** See section 7 | Section 3; NaNoWriMo; Grammarly; Novlr; L&L | Strengthens questions 2 and 3 |
| R3 | **Switch off browser writing suggestions in the editor** by adding `writingsuggestions: 'false'` to the editor attributes in `src/components/SceneEditor.tsx:65`. Add a short help note on turning off Apple Intelligence Writing Tools, Chrome's "Help me write" and grammar extensions, as Literature & Latte did. The attribute is not Baseline (MDN) and does not reach OS-level tools, so the help note matters more than the attribute | L&L's help page; MDN; 9to5Google | Passes. Leaves third-party tools to the writer |
| R4 | **A human-voice pass on all public text**, and a ready, honest answer to "Was this app built with AI?" (decide what the answer is before launch) | Tomoshibi and Neo launch comments | Question 3 (honest) |

### Tier B: close the functional gaps writers named

| # | Change | Size | Evidence | New or reinforces |
|---|---|---|---|---|
| R5 | **Make safety visible.** The safekeeping panel, `navigator.storage.persist()`, last-backup date, and a change-aware reminder. Add **"Keep a copy in a folder"** (Markdown per chapter plus JSON) where the browser allows, and a one-tap backup download everywhere else. Write it as "There is a copy of your book outside this browser", not as a warning | S-M | N1; distrust of browser storage; the phone in the pool | Reinforces Tier 1 #2 and Tier 2 #17; raises their priority |
| R6 | **Import.** .docx, .md and .txt, several files at once, with chapters split on headings or files; paste from Google Docs keeping italics. Later: a Scrivener project folder (RTF inside) | M | N7; "a million words in it"; Ellipsus import pain | **New** |
| R7 | **Export what other people need.** Manuscript .docx; **"Copy for AO3"** (clean HTML, italics next to punctuation handled); poem-safe export | M | N6; the 33,900-note AO3 script; Ellipsus's AO3 button; poets | Reinforces Tier 2 #10 and #16; promotes the fan-fiction "copy for posting" from Tier 3 |
| R8 | **A path between devices, in two steps.** Now: "Move my library to another device" (backup file, verified restore) with clear wording. Later, if built: optional sync that is **end-to-end encrypted**, so no server can read, train on or moderate the text, and so the app keeps working fully offline with no account | S now; L later | N3; Justwrite and Tomoshibi questions; Dabble user who left; moderation fears | **New** framing. Must stay optional to pass question 6 |
| R9 | **A long-manuscript performance check**: 150,000 words, 60 chapters, mid-range Android phone, Safari on iPhone | S | Google Docs and Ellipsus lag; Dabble CPU complaints | **New** |
| R10 | **Rhythm view with more units** (words, chapters, lines, minutes) and **CSV export of daily counts** so writers can take their progress to TrackBear, a spreadsheet or a Discord group. The text never leaves; only the numbers do, and only when the writer exports them | S-M | N9, N10; TrackBear's units; NaNoWriMo's void | Extends Tier 1 #4 |
| R11 | **Read it back** with device voices | S-M | Dyslexic and ADHD writers' accounts | Reinforces Tier 1 #6 |

### Tier C: fit and reach

| # | Change | Size | Evidence |
|---|---|---|---|
| R12 | **First-run test**: a new writer is typing within ten seconds, with no tour and no choice to make. Craft tools are one click away and never in the way | S | N4 |
| R13 | **Notes and research beside the draft** (a side pane for the chapter or story), the part of Scrivener people praise most | M | N5 |
| R14 | **A private challenge mode** ("November", or any 30 days): a target, a pausable pace, a calendar of days written. No leaderboard, no sharing except the CSV in R10 | S-M | NaNoWriMo grief; self-run challenges |
| R15 | **French first.** French UI, typography settings and smart quotes (round 1 note 11), plus a check that the Antidote browser connector works in the Tiptap editor on Chrome, Firefox and Safari | M | Quebec context; the French forum's checker complaint; Antidote's reach |
| R16 | **A "ready to post" queue per story** for serial and fan writers (chapter status, post date, notes per chapter) | S-M | Royal Road stockpile advice (snippets); AO3 workflow |

### Where to find writers (and how not to annoy them)

- Writers spread tools by word of mouth on **Tumblr** (writeblr and fic communities), where Ellipsus took off.
  A helpful post with honest limits does better than an ad.
- **Lemmy** (keepwriting@lemmy.world, writing@beehaw.org) and **Tildes** are small and friendly to local, open
  tools.
- A **Show HN** post works if the text is plainly human, the model is clear (price, data, exit) and the app opens without
  sign-up.
- **TrackBear** users, **Discord** sprint servers, and the **Jeunes Écrivains** forum (French) are where challenge and
  accountability writers gather. The Literature & Latte forum is not a place to promote.
- Writing subreddits are the biggest venue but were not readable here. Most ban self-promotion, so read their rules first.

---

## 7. Decisions only the team can make

*The team decided these on 2026-10-04. See `research.md` section 11.6.*

1. **The AI pledge (R2).** Options: (a) "No generative AI in Parchemin, ever", the clearest and the one with the most
   evidence behind it; (b) keep `PHILOSOPHY.md`'s opt-in, questions-only door, but publish its limits now (round 1 note 10
   §4.6); (c) say nothing. The testimony argues against (c). I recommend (a), because Parchemin's promise "Nothing is
   written for you" already sits there, and because the round 1 notes found that even "questions-only" help splits writers.
2. **How Parchemin is funded and what happens if it stops** (R1). Writers ask this before they type a word.
3. **Whether and how to say that AI tools were used to build the app** (R4). Some writers will ask. A true, prepared
   answer is better than an improvised one.
4. **Sync (R8).** Whether to build it, and if so, end-to-end encrypted and optional. This is the biggest product decision
   the testimony raises.

---

## 8. Gaps and how to close them

- **Reddit, read by a human.** Suggested pass (about one to two hours): search r/writing, r/writers, r/fantasywriters,
  r/FanFiction, r/selfpublish, r/scrivener, r/ObsidianMD, r/poetry, r/nanowrimo, r/ADHD_Writers (if active) for:
  "writing app", "Scrivener alternative", "Google Docs alternative", "Ellipsus", "Dabble", "no AI", "offline",
  "lost my", "word count streak", "NaNoWriMo alternative", "phone writing". Save each useful thread as text into
  `research/threads/manual/` (already git-ignored with the rest of `research/threads/`), keep the URL at the top, and
  delete usernames. I can analyse them in a follow-up.
- **Interviews.** `research/interviews/guide.md` is ready and the tally sheet is still empty. The round 2 findings add
  three questions worth asking: "Where else do you write besides your main device?", "What would it take for you to move
  your current project into a new app?", and "How would you feel if a writing app said it would never include AI?"
- **Royal Road, AppleVis and Booknode** need a person with a browser. These are the best sources for serial writers, blind
  writers and French readers-writers.
- **Demand is not measured.** Note counts and upvotes show reach, not how many writers would switch. Only trying it with
  real writers, or the interviews, can show that.
- **Unverified items to check before relying on them:** Wattpad's automated moderation details; the Google Docs
  "mass deletion" claims; Royal Road stockpile figures; AppleVis quotes (all snippets).

---

## 9. Sources

Dates are publication dates where shown; all were read 2026-10-04. Quality notes in brackets.

### Local corpus (`research/threads/`, verbatim-checked)
- https://beehaw.org/post/908574 . Lemmy, "What tools do you use for writing?", 2023-07-01. [Good, 20+ first-hand replies]
- https://lemmy.world/post/4348305 . Lemmy, "What do you guys use to write in?", 2023-09-03. [Good]
- https://lemm.ee/post/56184966 . Lemmy, software to organise story ideas, 2025-02-21. [Small]
- https://lemmy.world/post/1773173 . Lemmy, anxiety at the computer, 2023-07-19. [Small]
- https://lemmy.world/post/36444408 . Lemmy check-in, dyslexic writer and read-aloud; fear of being mistaken for AI, 2025-09-25. [Single voices]
- https://lemmy.world/post/1596500 and https://lemmy.world/post/2032447 . Lemmy accountability pairs, July 2023. [Small]
- https://lemmy.ca/post/54078672 . Typewriter-simulator app, 2025-10-27. [Single voice]
- https://piefed.blahaj.zone/c/writing/p/383673/for-those-of-you-that-use-version-control-what-do-you-use-to-edit-your-documents . Poet moving from Google Docs to git, 2025-11-01. [Small]
- https://lemmy.world/post/4642665 . Worldbuilding programs, 2023-09-07. [Small]
- https://lemmy.world/post/28322960 . Fan reaction to AI recommendations, 2025-04-16. [Small]
- https://news.ycombinator.com/item?id=33756171 . Scrivener creator interview thread, 2022-11-26. [Good, many first-hand]
- https://news.ycombinator.com/item?id=15760559 . Scrivener 3 thread, 2017-11-22. [Good]
- https://news.ycombinator.com/item?id=47197735 . Tomoshibi launch, 2026-02-28. [Good for launch reception]
- https://news.ycombinator.com/item?id=46144801 . Kraa launch, 2025-12-04. [Pricing and lock-in questions]
- https://news.ycombinator.com/item?id=49330604 . "1667" AI fiction tool, 2026-08-17. [Strong anti-AI sentiment; the niche quote]
- https://news.ycombinator.com/item?id=21994655 . "Yet another distraction free writing app", 2020-01-08. [Launch fatigue]
- https://news.ycombinator.com/item?id=38571088 . iA Writer in Paper, 2023-12-08; https://news.ycombinator.com/item?id=5017146 , 2013-01-06. [iA Writer praise]
- https://news.ycombinator.com/item?id=40362490 . Romance author locked out of Google Docs, 2024. [Cloud trust]
- https://news.ycombinator.com/item?id=41435760 . NaNoWriMo AI stance, 2024-09-03. [Mixed; mostly critical]
- https://news.ycombinator.com/item?id=44410217 . "Against AI" open letter, 2025-06-29. [Mixed; tech audience]
- https://news.ycombinator.com/item?id=47259366 . Grammarly "expert" reviews, 2026-03-05. [Strongly critical]
- https://news.ycombinator.com/item?id=48447484 . A novelist's five-year path, 2026-06-08. [Single voice; AI disclosure norms]
- https://news.ycombinator.com/item?id=27432022 . novelWriter thread (via fetch). [Medium]
- https://writing.stackexchange.com/questions/45035/is-there-a-need-for-better-software-for-writers . 2019. CC BY-SA 4.0. [Good]
- https://writing.stackexchange.com/questions/16611/is-there-a-free-online-alternative-to-scrivener . 2015. CC BY-SA 4.0. [Dated]

### Community posts and first-person writing (web)
- https://www.goodreads.com/topic/show/19624337-anyone-use-writing-software-other-than-word . Goodreads indie authors, Nov-Dec 2018. [Good, dated]
- https://ellipsus-writes.tumblr.com/post/790238153647833088 . Ellipsus recommendation, about 66,301 notes. [Reach signal]
- https://www.tumblr.com/ifishouldvanish/789989059784294400/migrating-to-ellipsus-from-google-docs-a-guide . Migration guide, 2024. [Good first-hand]
- https://the960writers.tumblr.com/post/746185585379672064/alternatives-to-google-docs . 2024-03-28, 2,921 notes. [Good]
- https://the960writers.tumblr.com/post/808888117432057856/writing-programs-for-everyone . 2026-02-18, 202 notes. [Medium]
- https://chaotic-neutral-knitter.tumblr.com/post/822266994773606400 . "Writers, which software do you use?", 2026-07-15. [Small poll]
- https://www.tumblr.com/ldysmfrst/802751728690839552/so-when-i-read-this-as-a-good-docsdrive-writer-i . Google Docs deletion fears. [Alleged events; unverified]
- https://ohlooktheresabee.tumblr.com/post/656246376822407168/i-write-my-fics-out-in-google-docs-and-then-paste/amp . AO3 formatting script, about 33,908 notes. [Reach signal]
- https://once-upon-a-reblog.tumblr.com/post/791336406082600960/writing-app-novlrorg-also-vowed-against-ai . Lists of tools by AI stance, 2025-08-08. [Medium]
- https://www.threads.com/@novlrofficial/post/C_immJrotiC . Novlr's pledge (search snippet). [Primary, snippet]
- https://forum.literatureandlatte.com/t/adding-ai-tools-to-scrivener/133222 and `?page=6` . Scrivener users debate AI, 2023-2024. [Good, official forum]
- https://www.literatureandlatte.com/blog/scrivener-and-ai-why-do-i-see-ai-prompts-in-my-scrivener-projects-on-mac . Updated 2026-09-15. [Primary]
- https://tildes.net/~tech/1vmk/neo_a_novel_writing_tool_created_by_a_novelist and https://tildes.net/~tech/17u7/book_writing_self_hosted_solutions . [Small, first-hand]
- https://www.writersdigest.com/writing-my-novel-on-my-phone-and-through-grief . Ros Hill, 2026-07-02. [First-hand]
- https://whomadetheeyes.substack.com/p/hands-off-my-lines-how-substack-reformats . Poet on line wrapping, 2025-05-30. [First-hand]
- https://theresahedgesauthor.wordpress.com/2026/02/02/5-adhd-friendly-writing-habits-that-actually-stick/ . ADHD author, 2026-02-02. [First-hand]
- https://halliejuleswrites.substack.com/p/day-of-the-chronically-ill-writer . 2026-03-03. [First-hand]
- https://www.towritewithwildabandon.com/p/to-scrivener-or-not-to-scrivener . 2024-07-30. [First-hand]
- https://pdworkman.com/writing-a-novel-in-markdown/ . Updated 2025-08-05. [First-hand, prolific author]
- https://www.katharineswan.com/2024/10/more-nanowrimo-alternatives-word-count.html . 2024-10-23. [First-hand]
- https://www.the-plottery.com/blog/the-nanowrimo-shutdown-hurts-for-all-the-wrong-reasons . 2025-04-03. [First-hand]
- https://storyempire.com/2025/04/28/nanowrimo-closing-what-went-wrong-what-will-replace/ . Comments from writers. [Good]
- https://commonwealthtimes.org/2025/11/12/the-death-of-wattpad-is-killing-writers/ . Student writer on Wattpad, 2025-11-12. [First-hand]
- https://www.scottishpoetrylibrary.org.uk/2025/09/page-against-the-machine-on-the-poetics-of-ai-refusal/ . 2025-09-03. [Essay]
- https://www.jeunesecrivains.com/t28670p75-quels-logiciels-utilisez-vous-pour-ecrire . French forum, 2014. [Dated]
- https://tcrouzet.com/2026/10/02/hypocrisie-editoriale/ . Thierry Crouzet, counter-view on anti-AI writers, 2026-10-02. [Opinion]

### Reviews
- https://ca.trustpilot.com/review/dabblewriter.com . 5 reviews. [Tiny sample]
- https://www.capterra.com/p/264561/Plottr/reviews/ . 25 reviews, 2022-2026. [Medium]
- https://duckprintspress.com/2026/07/21/pros-and-cons-of-ellipsus-software-for-writers/ . 2026-07-21. [Good, balanced]
- https://www.producthunt.com/products/justwrite . Launch comments, mostly from other makers. [Low]
- https://reedsy.com/studio/resources/dabble-writing-review/ . Source of the "Data may be evicted" detail (search snippet; Reedsy competes with Dabble). [Low-Medium]

### Press and data
- https://dailydot.com/google-docs-ai-author-concerns . 2023-08-24. [Secondary]
- https://techcrunch.com/2023/10/11/ao3-ai-fears-lock-account-kinktober-fanfiction/ . [Snippet]
- https://www.dexerto.com/tech/romance-author-gets-locked-out-of-google-docs-for-inappropriate-content-2713004/ and https://gigazine.net/gsc_news/en/20240602-google-docs-inappropriate/ . May-June 2024. [Secondary, snippet]
- https://www.theregister.com/2024/11/27/microsoft_word_excel_ai/ and https://www.bleepingcomputer.com/news/microsoft/microsoft-says-its-not-using-your-word-excel-data-for-ai-training/ . [Secondary, snippet]
- https://decrypt.co/360748/grammarly-disables-ai-expert-review-backlash-authors-journalists . 2026. [Secondary, snippet]
- https://whitneyafoster.substack.com/p/ao3-ai-fanfiction-heated-rivalry-detection . June-July 2026. [Secondary, careful]
- https://bookstr.com/article/ai-accusations-pose-a-new-threat-to-fan-fiction-writers/ . 2023-04-11. [Secondary]
- https://arxiv.org/pdf/2304.02819 . GPT detectors biased against non-native English writers, 2023. [Primary]
- https://draftback.com/ . Revision replay used as proof of authorship. [Primary, snippet]
- https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/writingsuggestions . [Primary]
- https://9to5google.com/2024/05/22/chrome-help-me-write-suggestion/ . [Snippet]
- https://blog.bod.fr/ecrire/auteurs-et-intelligence-artificielle/ . BoD survey of 1,000 French authors, February 2025. [Vendor-run survey; medium]
- https://ici.radio-canada.ca/arts/livres/actualites-litteraires/actualites-litteraires/document/nouvelles/article/2249524/intelligence-artificielle-alberta-ecriture-litterature . Francophone Alberta authors. [Secondary; date not shown]
- https://www.franceinfo.fr/culture/livres/affaire-thelyson-orelien/affaire-thelyson-orelien-dix-jours-apres-entre-rejet-visceral-gene-et-fatalisme-le-malaise-des-ecrivains-francais-face-a-l-ia_8217823.html . October 2026. [Secondary, good]
- https://www.france24.com/fr/%C3%A9co-tech/20260618-contre-marginalisation-%C3%AAtre-humain-tribune-appelle-boycott-ia-grand-public . June 2026. [Snippet]
- https://www.antidote.info/fr/antidote-web/documentation/guide-demarrage/integration-logicielle-antidote-web/appel-d-antidote-depuis-logiciels/a-partir-d-un-navigateur . Antidote connector. [Primary, snippet]
- https://github.com/dispatchrabbi/trackbear and https://help.trackbear.app/ . [Primary, snippet]
- https://authorsguild.org/news/human-authored-certification-expands-to-all-authors/ . [Primary, snippet]
- https://www.webpronews.com/simplenotes-quiet-death-how-automattics-cost-cutting-left-millions-of-users-scrambling-for-a-new-notes-app/ . [Snippet]
- Royal Road forum threads on stockpiles and software (e.g. https://www.royalroad.com/forums/thread/157654 , https://www.royalroad.com/forums/thread/149595 ). [Snippets only; 403 to fetch]
- AppleVis threads on Scrivener accessibility (e.g. https://applevis.com/forum/macos-mac-app-discussion/questions-about-scrivener ). [Snippets only; 403 to fetch]

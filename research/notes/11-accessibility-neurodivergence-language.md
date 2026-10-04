# 11. Accessibility, neurodivergent writers and language

Researcher 11 of 12. Scope: (a) neurodivergent, disabled and limited-energy writers, (b) WCAG 2.2 / ARIA for a rich-text editor and Tiptap/ProseMirror gaps, (c) multilingual and non-English writers, (d) mobile and on-the-go writing.

**Method and honesty notes.**
- About 70 fetches and searches were run. The shared WebSearch budget ran out partway through, so several topics (per-language spellcheck behaviour, first-hand RTL and bilingual writer accounts, OCD and perfectionism research, Dragon and voice-control behaviour in contenteditable) rest on thinner evidence than I wanted. Each one is flagged below.
- Evidence labels: **[primary]** is a standard, spec, study or maintainer statement I fetched. **[practitioner]** is a first-hand account or blog by a writer or designer. **[vendor]** is a product page. **[inference]** is my own reading of Parchemin's code or of a source, not stated by the source.
- Parchemin code was read in `src/components/*`, `src/styles.css`, `src/db.ts`, `src/export.ts`, `index.html` and `vite.config.ts`. Contrast ratios were computed by me from the CSS tokens.
- I did not find real quotes from subreddits. Reddit was not fetchable (old.reddit.com is blocked) and the searches returned blogs instead. First-hand evidence here is therefore blog posts by writers, not forum threads.

---

## 1. Executive summary

1. **Parchemin's philosophy already matches most of what neurodivergent and chronically ill writers say they need.** The recurring asks are: no guilt, small wins, optional structure, a blank page first, and writing anywhere in short bursts. These come from first-hand accounts (Fulmer, Sweeney, Willard, Bonnello) and are anecdotal but consistent. Guilt-free streaks and "a chapter a day, one sentence waiting" are validated by them. The gap is execution (ARIA, contrast, focus management, language), not philosophy.
2. **The built-in accessibility baseline is decent but has concrete, cheap failures.**
   - The autosave text ("Saving…" / "Saved on this device") is not in a live region.
   - The Modal has no focus trap and no return of focus.
   - The toolbar is a `role="toolbar"` but every button is a separate tab stop.
   - The typewriter scroll uses `behavior: 'smooth'` and ignores `prefers-reduced-motion`.
   - `--muted` text is 4.15:1 on `--surface-2`.
   - Input and border colours are about 1.3:1.
   - Toolbar buttons are 32px tall (this passes the 24px AA minimum).
   - These are small fixes (S).
3. **Dyslexia fonts: do not bundle OpenDyslexic as an "accessibility solution."** The one controlled study I read (12 children with dyslexia) found no benefit and slightly worse fluency than Arial and Times, and none of the children preferred it. What helps is spacing, size, left-aligned text, contrast and user control (BDA guidance, Roselli's summary of Marinus et al.). The right response is to give writers control of font, size, line height and letter/word spacing. This also satisfies WCAG 1.4.12.
4. **Language is the biggest unaddressed area, and it is cheap to start.** There is no per-story language anywhere. `index.html` is `lang="en"`, the EPUB hard-codes `lang="en"` and `dc:language` `en`, and the editor does not set `lang`. `countWords` splits on whitespace, so Chinese and Japanese count as about one word per sentence, and French « guillemets » with spaces count as extra words. A single `story.lang` field (BCP 47) can drive spellcheck, smart quotes, EPUB metadata, word counting and typography.
5. **French typography is a differentiator, and there is a real ambiguity.** France: narrow no-break space (U+202F) before `; ? !`, plain no-break space before `:` and inside « ». Quebec sources disagree on guillemets. Gatineau's guide says a no-break space inside; another Quebec-oriented source says never a space. Quebec usually uses no space before `; ? !` but a no-break space before `:`. So it must be a setting (France / Québec / off), not a hard-coded rule. U+202F has known font-coverage problems, so fonts should be self-hosted and tested.
6. **Tiptap and ProseMirror are not automatically accessible.** Tiptap itself says it is headless and the developer owns keyboard, ARIA and contrast. Its own docs list a VoiceOver issue (words from adjacent blocks run together) and keyboard traps in menus. Issue #1046 (Alt+F10, Escape, toolbar from content) was closed "not planned" and stale. ProseMirror's maintainer says the core should be accessible by default and that the example menu should be replaced. Android contenteditable and IME input (including voice typing and CJK composition) is a long-running source of bugs. Test voice typing and CJK input on real devices.
7. **Voice dictation: lean on the OS, add only on-device.** The browser SpeechRecognition API defaults to sending audio to a server. `processLocally` plus language-pack install exists but is not widely available (MDN). That conflicts with "never harvest." WCAG 2.1.4 (character key shortcuts) and 2.5.3 (label in name) matter because speech-input users break on single-key shortcuts and on icon-only labels. Reading aloud with `speechSynthesis` is offline and useful for dyslexic and tired writers.
8. **Phone and low-energy writing is real and under-served.** Chronic-illness writers describe the Notes app in waiting rooms and writing in bed. About 16% of US adults are smartphone-only internet users (Pew, 2025). Japan's keitai shosetsu show phone-written novels reaching mass publication. The PWA already exists. The missing pieces are quick capture (manifest shortcut, share target on Android), `navigator.storage.persist()`, and keyboard-aware layout.
9. **Two traps.**
   - The ADHD-tool market leans on timers, blockers and gamified habit apps (Cold Turkey, Habitica, Forest in Willard's list). These conflict with "no guilt-gamification." Do not copy them.
   - AI help for dyslexic writers has early evidence (LaMPost, 19 adults: rewrite and subject-line features popular, but LLM quality may not meet needs). It conflicts with "never ghostwrite" unless it is critique only. Keep it out.
10. **Highest value for lowest cost, in order:**
    1. The accessibility fixes in section 4 (S).
    2. A per-story language field wired to `lang`, smart quotes, EPUB and word count (M).
    3. A "Page settings" panel for font, size, spacing, width and focus-dimming strength (S-M).
    4. Read-aloud proofreading (S-M).
    5. French typography assist (M).
    6. Quick capture and `persist()` (S).

---

## 2. Problems

Severity: H = blocks or harms use for a group or breaks a core promise, M = real friction, L = minor or edge case. Confidence is in the evidence, not the importance.

### 2a. Neurodivergent, disabled and limited-energy writers

**P1. Task initiation and the blank page (ADHD, autism, anxiety).**
- Writers with ADHD describe trouble starting without external structure, trouble holding details across a long manuscript, hyperfocus on world-building instead of drafting, and perfectionism/rejection sensitivity that makes messy first drafts painful. Fix suggested: break work into a specific next scene, call the draft a "zero draft", offload memory to a project bible.
- Evidence: Scribe Forge [practitioner/vendor, sells worldbuilding workbooks]; Lara Willard [practitioner, ADHD author]; Bonnello "first draft doesn't need to be amazing, it just needs to exist" [practitioner, autistic novelist].
- Affects: ADHD, autistic and anxious writers, and plenty of neurotypical ones.
- Confidence: medium (consistent anecdote, no controlled study found). Severity: H for the mission, because it is the "finish" problem.
- Fit with Parchemin: strong. The "blank page first, structure optional, one sentence waiting" defaults already target this.

**P2. Hyperfocus, time blindness and losing the thread.**
- Willard says she embraces marathon hyperfocus sessions instead of a daily-discipline model. A time-perception deficit in ADHD is supported by several meta-analyses, though findings are described as inconsistent in children (PubMed listing: *J. Attention Disorders* 2022, 27 studies; *Developmental Neuropsychology* 2024 meta-analysis). I only saw titles and snippets, not full texts.
- Implication for tools: visible, non-judgmental elapsed time and session length can help, but alarms and countdowns can add pressure. Resuming exactly where you left off (caret and scroll position, last sentence) helps more than reminders.
- Confidence: medium for the phenomenon, low for design implications. Severity: M.

**P3. Tool abandonment.**
- Vendor and listicle sources say people drop tools that do not match their specific challenge. This is mostly marketing (VoiceDash, others). I found no solid data. Treat as unverified folklore beyond "match the tool to the challenge." Severity: M. Confidence: low.
- Related first-hand pattern: the "shiny new idea" problem, where writers abandon the middle of a draft for a new idea. Several author blogs describe it (search results only, not fetched). Suggested coping: capture the new idea in a brain dump and set it aside. This supports a quick-capture "sparks" inbox that does not interrupt the current draft.

**P4. Perfectionism, rejection sensitivity and OCD-style checking.**
- Willard mentions "rejection-sensitive dysphoria" [practitioner]. Note that RSD is a popular term, not a formal diagnosis. I did not verify clinical literature (PubMed search for perfectionism plus writer's block returned zero results).
- Tool implications [inference]: constant red squiggles, live word-count targets and visible diff or "error counts" feed checking loops. Offer spellcheck off, hide counts, and "draft mode" that defers proofreading.
- Confidence: low-medium. Severity: M.

**P5. Sensory overload and distraction (autism, ADHD).**
- Autistic-writer guides recommend distraction-free modes, muted notifications, light/dark choice and adjustable sound [NovelPad blog, vendor]. Bonnello keeps separate planning and story documents and character spreadsheets [practitioner].
- Writers also say routines and structure must be personal: "Find your own methods" (Bonnello).
- Implication: let writers dim or un-dim, choose contrast and font, and turn off animation and rotating epigraphs. Parchemin's calm design is a fit, but the rotating "why we write" line and the 0.35-opacity focus dimming are not optional yet.
- Confidence: medium (anecdote). Severity: M.

**P6. Dyslexia and dysgraphia: spelling, proofreading and fonts.**
- Writers with dyslexia are very concerned with spelling, write slowly, pause inside words, and spend much of their editing time on spelling. Real-word errors (a correct word used wrongly) are missed by ordinary spellcheckers. Reading text aloud helps them detect errors. There is a tension between writing fluency and spelling accuracy: tools that interrupt with corrections can hurt flow. This is from the Mossige et al. 2023 review in *Dyslexia* 29(4) (Nordic languages; I could only read the abstract summary from search results, the page returned 403) and a first-hand guide by a dyslexic interface designer (Tess Gadd, who recommends reading top-to-bottom and bottom-to-top).
- OpenDyslexic: I fetched the study at PMC5629233 (authors and year not captured in my fetch, so I do not name them): 12 children aged 9-12, alternating treatment design, OpenDyslexic vs Arial vs Times New Roman. It found no benefit and negative effects on fluency, and no child preferred it. Roselli's page cites other studies (Mount Allison; a Spanish study) and Marinus et al. 2016, where Dyslexie's apparent advantage vanished once spacing was matched. Evidence says spacing and size matter more than letterforms.
- BDA style guidance (seen in search snippets): 12-14pt, line spacing about 1.5, avoid italics and underline, left-aligned text, sans-serif options, larger letter spacing. I could not fetch the PDF text, so this is [secondary].
- Confidence: high that special fonts are not an evidence-based fix; medium-high that spacing and user control help; medium on tool needs. Severity: M-H for dyslexic writers.

**P7. Chronic fatigue, chronic pain, limited energy ("spoons").**
- Spoon theory comes from Christine Miserandino's 2003 essay about lupus (Wikipedia).
- First-hand: Sweeney writes in short bursts, on the phone in waiting rooms, with no required silence, and accepts "garbage words." Fulmer rejects "write every day" as shaming for disabled writers, uses 50-100 word goals and stops without guilt, and considers a tablet for couch writing. Laura Hillenbrand wrote two bestsellers while managing chronic fatigue syndrome (secondary, from a search-result summary).
- Implication: this is exactly the "streak that survives an unfinished day" case, and it argues for gentle language and for tiny goals as first-class.
- Confidence: medium (anecdote, consistent). Severity: H for the affected group.

**P8. Vision loss and screen readers.**
- Blind writers use JAWS and VoiceOver, and write novels in Scrivener with VoiceOver (AppleVis listing, search snippet); knowing where features live is hard because of feature count. Low-vision Scrivener users on the L&L forum describe menu visibility, text size and the conflict that dark themes help and strain eyes depending on the person.
- Implication: offer light, dark, and a higher-contrast option; keep the interface small and predictable; test with VoiceOver and NVDA.
- Confidence: medium (small sample of accounts; the Writing Cooperative interview with two blind writers returned 403 so I did not read it). Severity: H for blind writers if the editor or dialogs break.

**P9. Motor impairment, one-handed use and speech input.**
- Speech-input users are harmed by single-character shortcuts: a spoken word can become a "barrage of single-key commands" (WCAG 2.1.4 Understanding). Parchemin's shortcuts all use Ctrl/Cmd+Shift or Esc, which is compliant. Voice-control users also need visible labels to match accessible names (2.5.3). Emoji and icon glyphs do not count as labels. Parchemin's buttons like "💡 Unblock" include text, which is fine, but icon-only buttons ("✕", "⠿") have aria-labels that do not contain the visible glyph, which is acceptable because symbols are not text labels.
- Drag-only actions need alternatives (WCAG 2.5.7). Parchemin's outline board uses dnd-kit with a KeyboardSensor, which provides a keyboard alternative (Space or Enter to lift, arrows, Escape to cancel). WCAG's 2.5.7 asks for a single-pointer non-dragging alternative (e.g. up/down buttons). Keyboard alone does not satisfy that criterion for pointer-only users, so add "Move up/Move down" buttons or a menu (the Menu component exists).
- Confidence: high (standards). Severity: M.

**P10. Dictation and speech-to-text writing.**
- SpeechRecognition sends audio to a web service by default, which has privacy implications; `processLocally = true` keeps audio on the device but requires a one-time language pack and is not Baseline (MDN). SpeechSynthesis works fully offline using OS voices.
- Dictation in contenteditable editors on Android goes through IME composition, which ProseMirror's maintainer describes as notoriously inconsistent across keyboards and devices; voice typing is explicitly listed as a complication.
- Svendsen 2026 (*Dyslexia*) is a qualitative study of dyslexic students using speech-to-text; I saw only its title and could not fetch the abstract (403).
- Confidence: medium. Severity: M-H for writers who cannot type comfortably.

**P11. Low bandwidth, older hardware.**
- Parchemin is already offline-first with a generated service worker. Concerns: web fonts load from Google at first visit (`index.html`), which is a privacy leak and a first-run offline gap, and there is runtime caching of font hosts in `vite.config.ts`. A large first paint is only an issue for the editor chunk (Tiptap). No evidence gathered on device share; leave as unverified.
- Severity: L-M. Confidence: low (my reading of the code).

### 2b. WCAG 2.2 and Tiptap/ProseMirror in an editor app

**P12. Keyboard traps and escape from the editor.**
- WCAG 2.1.2 (No Keyboard Trap): focus must be movable away from a component by keyboard. The Understanding doc's own example is a WYSIWYG editor where Tab indents, solved by telling users to press Alt+F10 or Option+F10 to move to the toolbar [primary].
- Parchemin's StarterKit does not bind Tab (lists use Tab for indent via the list extensions: StarterKit includes list item keymaps, where Tab sinks a list item [inference, not verified in this session]). Marijn's guidance: unless you bind Tab, the editor does not trap it.
- Tiptap's docs warn of keyboard traps in modals and menus and say the user must always be able to navigate away. Issue #1046 asked for Alt+F10, Escape and toolbar access and was closed as not planned, stale [primary].
- Severity: H for keyboard users. Confidence: high.

**P13. Toolbar semantics.**
- ARIA APG toolbar pattern: one tab stop with roving tabindex and arrow keys, labelled with aria-label [primary]. Tiptap recommends role=toolbar, role=textbox for the editor and menus with menuitems [primary]. Parchemin has `role="toolbar"`, `aria-label`, `aria-pressed`, and label text, which is good, but every button is its own Tab stop (about 14 stops before the text) and there is no arrow-key handling [inference from Toolbar.tsx].
- Severity: M. Confidence: high.

**P14. Status messages (autosave).**
- WCAG 4.1.3 Status Messages needs `role="status"` or similar so assistive tech announces without moving focus. MDN: `role=status` is polite and atomic and is appropriate for "Saved". Parchemin's `.editor-foot` span toggles between "Saving…" and "Saved on this device" with no live region [inference from SceneEditor.tsx].
- Design caution: announcing every autosave (every 600 ms of typing pauses) would be noisy for screen-reader users. Announce state changes sparingly (for example first save after an error, or on request), and never announce "Saving…".
- Severity: M. Confidence: high.

**P15. Modal dialogs.**
- APG: focus moves into the dialog, Tab is trapped, Escape closes, focus returns to the invoker, aria-labelledby points to a visible title [primary]. `Modal.tsx` has Escape and `aria-modal` but no initial focus, no trap and no return focus [inference]. `aria-modal="true"` also obliges the app to make outside content inert.
- Same for the mobile sidebar drawer and bottom panel: the off-canvas sidebar is hidden with `transform` only, so hidden controls may still be tabbable [inference].
- Severity: M-H. Confidence: high for the requirement, medium for the exact failure.

**P16. Focus not obscured, typewriter scroll and focus mode.**
- WCAG 2.4.11 (AA): focused item must stay at least partially visible; sticky headers/footers and non-modal overlays are the usual culprits [primary]. Parchemin's mobile bottom `.panel` is `position: fixed` and can cover the editor caret [inference]. The editor has `padding-bottom: 40vh` on mobile, which helps.
- Typewriter scrolling in `SceneEditor.tsx` uses `scrollBy({behavior:'smooth'})`. The global CSS rule `scroll-behavior: auto !important` under `prefers-reduced-motion` does not override an explicit JavaScript smooth option [inference; I believe an explicit option wins, but this was not tested here]. WCAG 2.3.3 (AAA) endorses honouring `prefers-reduced-motion`.
- Severity: M. Confidence: medium.

**P17. Contrast, text spacing, reflow, target size (computed on Parchemin's tokens).**
- Computed contrast (light): `--text` on `--bg` 13.9:1; `--muted` on `--bg` 4.49:1 (just under 4.5:1 AA); `--muted` on `--surface-2` 4.15:1 (fails); `--accent` on `--bg` 6.3:1; `--border` on `--bg` 1.26:1; status colours `--idea` 2.1:1, `--draft` 2.1:1, `--done` 3.1:1, `--revised` 3.3:1 (fine if never the only signal). Dark: `--muted` 6.2:1; `--border` 1.5:1.
- The focus-mode dimming (`opacity: .35` on non-active blocks) intentionally drops contrast well below 4.5:1 for non-active paragraphs. That is a choice, but low-vision writers need an off switch or a lighter dimming level.
- WCAG thresholds: 4.5:1 normal text, 3:1 large text (1.4.3 [primary]). Text spacing (1.4.12): content must survive line height 1.5, paragraph spacing 2x, letter spacing 0.12 em, word spacing 0.16 em, and it names dyslexic readers as beneficiaries [primary]. Reflow (1.4.10): no two-dimensional scroll at 320 CSS px, matching 400% zoom [primary]. Target size (2.5.8, AA): 24x24 CSS px or exceptions, with 44px as the AAA recommendation [primary]. Toolbar buttons at 32px and `.icon-btn` (4px/8px padding) pass or nearly pass; `.drag-handle` (padding 0 6px, 1.2em glyph) probably fails [inference].
- Positive: the viewport meta does not disable zoom (`index.html`), there is a `prefers-color-scheme` dark theme and a `prefers-reduced-motion` rule, and `:focus-visible` has an outline.
- Severity: M. Confidence: high for standards, medium for exact pixel results.

**P18. VoiceOver reads adjacent blocks as one word.**
- Tiptap docs: on macOS VoiceOver concatenates words across block elements ("HeadingParagraph"); the suggested fix is a zero-width space via CSS [primary, from Tiptap's accessibility guide].
- Severity: M for VoiceOver users. Confidence: medium (vendor-reported).

**P19. Placeholder and semantics.**
- `Placeholder` text is drawn by CSS from a data attribute; screen readers may not read it, which is why `aria-label="Story text"` is correct [inference]. Tiptap v2.9 added `role="textbox"` by default [search snippet; not fetched]. Screen-reader and braille testing of long documents in ProseMirror is something I found no published evidence on, so treat Tiptap/PM screen-reader quality as unproven until tested with NVDA, JAWS and VoiceOver.
- Confidence: low-medium. Severity: unknown until tested.

### 2c. Multilingual and non-English writers

**P20. French spacing before `: ; ! ?` and inside guillemets.**
- France (code typographique): narrow no-break space before `;` `?` `!`; a normal no-break space before `:` and inside « » (La langue française, fr.wikipedia, l-express, d-meeus, fvsch).
- Canada: no-break space before the colon and inside guillemets on the Termium/Bureau de la traduction view; semicolon, question mark and exclamation mark usually have no space unless the narrow space is available [fr.wikipedia, l-express]. One Quebec tutoring site claims there is "never" a space inside Quebec guillemets, but a Gatineau municipal guide says a no-break space inside. Sources disagree, so treat as unresolved (Section 6).
- Why it matters for Tiptap: Typography extension rules exist for 24 patterns including quotes, with `openDoubleQuote` etc. overridable and RTL-aware options (Tiptap docs) but no built-in French spacing. French spacing needs a custom input rule or a post-processing step.
- Technical risk: U+202F is missing from some fonts, renders as a box or falls back to a thin space (GitHub issues for Open Sans, EB Garamond, Fira Code; fvsch). It is also hard to type (no obvious key on most keyboards), which is the main reason writers want auto-insertion. Inter and Literata (used by Parchemin) were not checked for U+202F coverage. Unverified.
- Affects francophone writers (and the name is French). Severity: M (cosmetic for most, but professional publishing expects it). Confidence: high on rules, medium on the Quebec guillemet detail.

**P21. Spellcheck and grammar for French and other languages.**
- Antidote is described by French sources as the professional reference for depth, typography and regional variants (around €129 or €59 per year); LanguageTool is cheaper, multilingual, with premium around €4.99 per month [lafabriquedunet, clubic, others; commercial comparison sites, medium quality].
- LanguageTool can run as a local Java HTTP server without its AI rules, which are cloud-only (dev.languagetool.org). That is not usable from a pure offline PWA, since it needs Java.
- The browser's native spellcheck follows the element's `lang` and the OS dictionaries [inference; I could not verify per-element behaviour because the search budget ran out]. Per-paragraph language switching for code-switching writers is the unproven part.
- Severity: M. Confidence: low-medium.

**P22. Right-to-left writers (Arabic, Hebrew, Persian, Urdu).**
- W3C guidance: set direction in markup (`dir`), not CSS; `dir="auto"` per paragraph detects direction from the first strong character; `bdi` isolates unknown text. For textareas, `dir=auto` applies per paragraph (W3C Q&A, bidi articles).
- Notion lacks native RTL, forcing workarounds; Obsidian improved RTL in 1.6 but mixed RTL/LTR remains a complaint (search snippets, Obsidian forum).
- Tiptap Typography has `rtl`-aware quote options (fetched). I tried to fetch a Tiptap "text direction" doc page and got 404, so I cannot confirm a first-party text-direction extension [unverified].
- Persian needs ZWNJ for correct word shapes (می‌خواهم vs میخواهم). ZWNJ is hard to type and invisible, and it complicates word counting (Wikipedia).
- Parchemin's CSS uses physical properties (for example `border-left` on `.prompt-card`, `margin-left: 0` on `.tb-right`, left-pointing sidebars), so the UI itself is not mirrored. UI mirroring is a separate and bigger job than supporting RTL text.
- Severity: H for RTL writers, who are currently excluded; but the user count is unknown. Confidence: medium.

**P23. CJK and vertical text; word counting.**
- Chinese and Japanese have no spaces; Chinese length is usually counted in characters, Japanese on character counts without spaces; Korean uses spaces (Anycount, Wikipedia count-word, ProZ). Japanese manuscript conventions use 400-character sheets, with ranges like 100-300 sheets for medium-length work (secondary, from a GitHub issue; treat as unverified).
- `Intl.Segmenter` (Baseline 2024) segments words for Japanese, Chinese and Thai with dictionary support and offers `isWordLike` (MDN) [primary].
- Vertical writing: `writing-mode: vertical-rl` is Baseline since 2017; `text-orientation`, `text-combine-upright` all work, though `digits` is unsupported in major browsers; Arabic upright is flawed (W3C vertical text article) [primary]. Vertical text editing is a niche but culturally significant feature for Japanese and traditional Chinese writers.
- IME composition for CJK input is the same machinery that is flaky on Android (ProseMirror forum thread; changelog entries for Chinese IME cursor positioning in 1.33.2).
- Parchemin: `countWords` in `src/db.ts` is whitespace-split and tag-stripped by replacing tags with a space. [Inference from code.] It overcounts French (a lone « or — counts as a word), undercounts CJK massively, and miscounts words with inline marks (`<em>un</em>believable` becomes two words) because each tag becomes a space.
- Severity: H for CJK writers (word goals, progress, finish line and streak would all be wrong); M for others. Confidence: high on the bug, medium on conventions.

**P24. Quotes and apostrophes per language.**
- Conventions differ by language: English " ", French « », German „ “, Spanish « » with " " alternative, Japanese 「」『』, traditional Chinese 「」, Polish „ ”, Russian « » (Wikipedia quotation mark). Tiptap Typography's default is English smart quotes.
- If Parchemin applies English smart quotes to French or German text, the result is wrong. The extension supports overrides (fetched), so this is a configuration problem, not a library gap.
- Severity: M. Confidence: high.

**P25. Bilingual writers and code-switching.**
- I could not retrieve first-hand accounts, since the searches ran out. What is known from standards: BCP 47 tags (`fr-CA`, `zh-Hant`) and the `lang` attribute cascading to children, overridable per element (W3C language tags article). A Tiptap mark or node attribute can carry `lang` for runs of text. Whether Chrome, Safari and Firefox spellcheck honour per-span `lang` is unverified.
- Severity: M (probably a minority, but they cannot use any English-first spellchecker well). Confidence: low.

**P26. English-first tools: UI strings and plurals.**
- `x words` is hard-coded in at least `SceneEditor.tsx`, `StoryView.tsx`, `WriteTab.tsx`, `OutlineTab.tsx`, `Panels.tsx`, `Why.tsx`, and the plural is done with `=== 1 ? 'word' : 'words'`, which fails in languages with multiple plural forms (Arabic, Polish, Russian) [inference; MDN Intl.PluralRules is the standard answer, not fetched]. Dates already use `toLocaleDateString([], ...)`, which follows the browser locale.
- The craft content (prompts, templates, "hero's journey", voices) is English-only editorial content, which is a much bigger translation cost than UI strings.
- Writers' feelings about English-first tools: I found no first-hand evidence. Unverified; treat as a gap.
- Severity: M-H for non-English users. Confidence: medium (code-level).

**P27. EPUB export language and fonts.**
- `src/export.ts` writes `lang="en"` and `<dc:language>en</dc:language>` regardless of the story's language [inference from code]. EPUB Accessibility 1.1 requires accessibility metadata (accessMode, accessibilityFeature, accessibilityHazard), recommends accessibilitySummary, and calls for WCAG 2.2 AA where possible [primary]. Exported EPUBs from Parchemin do not declare any of that [inference].
- CJK and Arabic fonts are large; the usual practice is to let the reader's system or e-reader provide them rather than embed. Unverified.
- Severity: M. Confidence: medium.

### 2d. Mobile and on-the-go

**P28. Phone-only and phone-first writers.**
- 16% of US adults are smartphone-only internet users in 2025 (peak 20% in 2018) [Pew, primary]. Japan's cell-phone novels (keitai shosetsu): "Deep Love" (2003) sold 2.6 million copies as a book; five of Japan's ten bestselling novels in 2007 began as cell phone novels (Wikipedia; secondary). Chronic-illness writers write on phones in waiting rooms and bed (Sweeney, Fulmer).
- Parchemin already has a responsive layout with a drawer and a bottom sheet. Gaps: no quick capture, no manifest `shortcuts` or `share_target`, the keyboard height and bottom panel can cover the caret, and Android contenteditable bugs.
- Severity: M-H. Confidence: medium.

**P29. Storage safety on phones.**
- WebKit: installed Home Screen web apps get the same quota as a browser tab, but can still be evicted under storage pressure or inactivity; persistent mode can exclude them, and WebKit grants `persist()` using heuristics such as being installed (webkit.org). `navigator.storage.persist()` asks for storage that is not cleared except by the user (MDN).
- This is directly relevant to "the writer owns the work." If the only copy is in IndexedDB and the browser evicts it, a writer loses the book. Parchemin has backup, but no `persist()` request or backup nudge [inference: I grepped for neither `persist` nor nudge in the code; I did not search all files exhaustively].
- Severity: H when it happens, but probability is uncertain. Confidence: medium.

**P30. Quick capture.**
- Manifest `shortcuts` can add "New spark" to the app icon's long-press menu; platform support is inconsistent (MDN). `share_target` lets an installed PWA receive shared text, but it is Chromium/Android only (MDN says not Baseline; I did not see iOS listed as supported). `VirtualKeyboard` API gives keyboard geometry but is not Baseline (MDN).
- Severity: M. Confidence: high on API facts.

---

## 3. Existing solutions and tools

| Need | Existing solution | Notes and evidence |
|---|---|---|
| Focus, calm | iA Writer focus mode (highlights current sentence/paragraph) | Vendor claims, explicitly "not built for ADHD" [vendor]. Parchemin already has this, but dimming is not adjustable. |
| ADHD timers and blockers | Forest, 30/30, Time Timer device, Cold Turkey Writer, Habitica, 750words | From Willard's list [practitioner]. Blockers and gamification conflict with Parchemin's rules; a physical Time Timer's silent visual shrink is the gentle version. |
| Task breakdown | Goblin Tools Magic ToDo | Mentioned in a listicle; an AI tool, so out of scope for Parchemin. |
| Body doubling | Focusmate | Listicle mention; social, out of scope for a local-first app. |
| Dyslexia spelling | Ghotit, Grammarly, contextual spellcheckers; word prediction; TTS; speech-to-text | Mossige et al. 2023 and Tess Gadd [primary/practitioner]. Real-word error detection is the key feature. |
| Dyslexia typography | User control of size, spacing, line height; left-aligned text; BDA style guide | BDA guide [secondary], Roselli [practitioner]. |
| Dyslexia fonts | OpenDyslexic, Dyslexie | No evidence of benefit [primary study + Roselli]. Offer only as one choice among many if at all. |
| Screen-reader writing | Scrivener with VoiceOver; JAWS; braille notetakers | Anecdotal [AppleVis, Writing Blind posts via search results]. |
| Voice | OS dictation, Dragon, voice memos; Web Speech API | Web Speech defaults to server audio; `processLocally` exists [MDN]. |
| Read aloud | OS screen readers, `speechSynthesis` | `speechSynthesis` is offline [MDN]. |
| French correction | Antidote (pro), LanguageTool (open-core, local server without AI rules) | Commercial comparison sites; Antidote is not embeddable in a PWA. |
| RTL | Obsidian 1.6 mirrored UI and mixed-language support; RTL plugin; Notion needs an extension | [Obsidian docs and forum via search snippets]. |
| Typography automation | Tiptap `Typography` extension (configurable quotes, RTL options) | Fetched [primary]. No French spacing rule. |
| Word segmentation | `Intl.Segmenter` | Baseline 2024 [MDN]. |
| Accessible drag-reorder | dnd-kit KeyboardSensor (Space/Enter to lift; Esc cancels; instructions prop) | Already used in `OutlineTab.tsx` [dnd-kit docs]. |
| Accessible EPUB | EPUB Accessibility 1.1 metadata | [W3C]. |

---

## 4. Prioritized accessibility and i18n checklist for Parchemin

Order is need relative to cost. File names are real. "Inference" means I read the code but did not run it with assistive technology.

**Tier 1: small, do soon (all S).**

1. **Autosave status as a live region.** In `src/components/SceneEditor.tsx` footer, wrap the "Saved on this device" text in `role="status"` (polite). Do not announce "Saving…" on every pause. Consider announcing only on errors or on first save (`role="alert"` for failures). Add a visible failure state if `db.scenes.update` rejects. Currently the code does not catch rejection [inference].
2. **Modal focus.** `src/components/Modal.tsx`: move focus to the first focusable or the heading on open, trap Tab, restore focus to the invoking element on close, and use `aria-labelledby` pointing at the visible `<h2>`. Consider the native `<dialog>` element with `showModal()`, which gives trap and inert for free [inference; not verified here].
3. **Mobile drawer and panels.** `src/styles.css` `.sidebar` off-canvas and `.panel`: make hidden regions `inert` or `visibility:hidden` when closed, so they are not focusable; make sure the opened drawer traps focus and Escape closes it.
4. **Toolbar keyboard model.** `src/components/Toolbar.tsx`: roving tabindex with arrow keys and Home/End (APG toolbar pattern); add a documented shortcut (Alt+F10 / Option+F10, as in WCAG 2.1.2's own example) to move from the editor to the toolbar, and Escape to return to the text. Keep `aria-pressed`.
5. **Reduced motion.** `SceneEditor.tsx` `onSelectionUpdate`: pick `behavior: 'auto'` when `matchMedia('(prefers-reduced-motion: reduce)').matches`. Also offer a "typewriter scroll" on/off setting.
6. **Contrast fixes.** `src/styles.css`: nudge light `--muted` from `#7a7166` so it reaches at least 4.5:1 on `--surface-2` (`#f3eee6`); give inputs and select borders a 3:1 boundary colour (WCAG 1.4.11; the current `--border` is 1.26:1). Do not use status colours (`--idea`, `--draft`) as the only signal (they already have text labels in the status select; verify in OutlineTab).
7. **Focus-mode dimming control.** `.app.focus .prose > *` opacity .35: expose a setting (off, light, strong) and keep the active block at full contrast. Also `.toolbar` opacity .25 in focus mode and `.scene-title` .5.
8. **Target size.** `.drag-handle`, `.icon-btn` and `.tag chip button`: give at least 24x24 CSS px hit area, preferably 44 on touch. `.tb-btn` is 32px, fine.
9. **Drag alternative for chapters.** `src/components/OutlineTab.tsx`: add "Move up" and "Move down" to each row's menu (the `Menu.tsx` component exists). The KeyboardSensor is good but WCAG 2.5.7 asks for a single-pointer alternative.
10. **VoiceOver block separation.** Try Tiptap's recommended CSS zero-width-space fix for headings and paragraphs; verify with VoiceOver before shipping (the fix may affect copy and word-count).
11. **Check `lang` on the page.** `index.html` has `<html lang="en">`, good for the UI today. Set it dynamically if the UI language changes.
12. **Skip link / landmarks.** Add `<main>` and a skip link to the editor (not verified whether present; I saw none in the components I read).

**Tier 2: language foundations (M).**

13. **`story.lang` field** (BCP 47, e.g. `fr`, `fr-CA`, `ar`, `zh-Hans`) in `src/types.ts` and `src/db.ts`, defaulting to the browser language (`navigator.language`). Set `lang` and `dir` on the editor element via `editorProps.attributes` in `SceneEditor.tsx`. This lets the browser use the right spellcheck dictionary and hyphenation, and it makes screen readers pronounce text correctly (WCAG 3.1.1/3.1.2 language of page and of parts; not fetched).
14. **Per-block `dir="auto"`.** Extend paragraph and heading nodes with a `dir="auto"` attribute (W3C: markup, not CSS; auto detects per paragraph). Add a toggle for forcing RTL or LTR per story. Also mirror a few physical CSS properties to logical ones (`border-inline-start`, `margin-inline-start`) in `styles.css`.
15. **Word counting.** Replace `countWords` in `src/db.ts`: segment with `Intl.Segmenter(lang, {granularity:'word'})` and count `isWordLike` segments; for `zh`, `ja`, `th`, count characters (a "count" mode, like Japanese writers expect). Insert text boundaries between block elements before stripping tags (fixes the `<em>un</em>believable` split and the missing break between paragraphs), and ignore bare punctuation like a lone « or —. Keep `PASTE_THRESHOLD` logic unchanged. Add a per-story unit label ("words" or "characters") and make the finish-line (`src/craft/audit.ts` `pace`) unit-aware.
16. **Smart quotes per language.** Configure `Typography` in `SceneEditor.tsx` with quote characters by `story.lang`: French « », German „ “, Japanese 「」, etc. (the extension supports string overrides and RTL options). Make "off" an option; some writers want straight quotes.
17. **EPUB language and accessibility.** `src/export.ts`: use `story.lang` in the `<html lang>` and `<dc:language>`; add `schema:accessMode=textual`, `accessModeSufficient`, `accessibilityFeature` (for instance `structuralNavigation`, `tableOfContents`), `accessibilityHazard=none` and an `accessibilitySummary` (EPUB Accessibility 1.1). Set `page-progression-direction="rtl"` for RTL books. [The last item is from EPUB knowledge, not fetched.]
18. **Self-host fonts.** `index.html` loads Inter and Literata from Google Fonts. Self-host them (privacy: no request to a third party, consistent with "no harvesting"; offline from the first visit) and check glyph coverage for latin-ext, Greek, Cyrillic and, importantly, U+202F. For CJK, Arabic, Hebrew and Devanagari rely on system fallbacks and set a `lang`-aware font stack.

**Tier 3: features and polish (M-L).**

19. **French typography assist** (see Ideas).
20. **UI i18n.** Extract strings, use `Intl.PluralRules` for counts, `Intl.DateTimeFormat` for dates (partly done), and `Intl.NumberFormat` (done via `toLocaleString`). Start with French as the proof language, because the name is French. Plan CSS logical properties first so RTL is possible later. The craft content (`src/craft/*`, `prompts.ts`, `templates.ts`) is editorial and should be translated by people, not machines.
21. **`navigator.storage.persist()`** on first story creation and a calm "last backup" reminder.
22. **Page settings** panel (see Ideas).
23. **Test matrix.** NVDA + Firefox, JAWS + Chrome, VoiceOver + Safari (macOS and iOS), TalkBack + Chrome, Windows Voice Access and Apple Voice Control, 400% zoom and 320px width, Windows High Contrast / forced-colors. Add `forced-colors` handling for custom controls (not covered by any source here; standard practice, unverified).

---

## 5. Ideas for Parchemin, ranked

Rank = need relative to cost. Fit is against PHILOSOPHY.md's six decision questions.

| # | Idea | Fit / conflict | Offline | Size |
|---|---|---|---|---|
| 1 | **Accessibility fixes** (Tier 1 above): live region for save status, modal focus, toolbar arrow keys, reduced motion, contrast, chapter move buttons. | Strong fit: "Calm", "writer stays in control." No conflict. | Yes | S |
| 2 | **Story language** (`story.lang`) that drives `lang`/`dir`, spellcheck dictionary, smart quotes, EPUB metadata and word counting. | Strong fit: serves writers in every language and makes "your story" literally yours. Honest: say "uses your browser's spellcheck." | Yes (browser dictionaries; first-time download of dictionaries is up to the browser) | M |
| 3 | **Page settings** ("The page"): serif/sans/system/mono font choice, size, line height, letter and word spacing, line width, focus-dimming strength, typewriter scroll on/off, and a higher-contrast theme. Include OpenDyslexic only if at all as an optional choice, with no health claim. | Strong fit (writer in control, calm). Overclaim risk: do not say any font "helps dyslexia"; evidence says it does not. Spacing is what helps. | Yes (self-hosted font files add size; system fonts do not) | S-M |
| 4 | **Read it back** (read aloud paragraph by paragraph with `speechSynthesis`, choose voice and speed, highlight the current block). Frame as "hear your story," not "fix." | Strong fit: supports dyslexic, tired and perfectionist proofreading; nothing is written for you; "the outline audit reads the book back to you" is the same spirit. | Yes (OS voices; quality varies by OS and language; voices for rarer languages may be missing) | S-M |
| 5 | **French typography assist** with three profiles (France, Québec, off): auto non-breaking space before `: ; ! ?` (narrow U+202F or U+00A0 depending on profile and font coverage), « » spacing, thousands separators, and `l'` apostrophe normalisation (’ vs '). Also a "tidy this chapter" one-shot for pasted text, never silent. Export converts to what the target needs. | Fit: honours the app's name and francophone writers; the writer decides; it does not rewrite words. Conflict only if applied silently. Must handle the unresolved Quebec guillemet question as a setting. | Yes | M |
| 6 | **Quick capture "Sparks"**: manifest `shortcuts` entry to open a new spark, an inbox that never interrupts the current chapter, Android `share_target`. Voice memo as an optional local audio clip (stored in IndexedDB, no transcription, no upload). | Strong fit: helps the "shiny new idea" problem, phone writing, and low-energy days. Guilt-free: no counters. | Yes. `share_target` Android only | S (shortcut + inbox), M (audio) |
| 7 | **Storage safety**: ask for `navigator.storage.persist()`; quietly show "last backup" with a gentle, dismissible prompt after a milestone; no nagging. | Strong fit: "writer owns the work", honest about risk. Keep the tone calm to avoid manufacturing urgency. | Yes | S |
| 8 | **Resume where you left off**: restore caret, scroll and the last sentence on opening a chapter; "pick up here" line at the top of Write. | Strong fit: addresses losing the thread (ADHD), fatigue, and the philosophy's "start the next day with a sentence already waiting." | Yes | S |
| 9 | **Gentle small-step mode**: let writers set a tiny daily floor (for example 50 words or "one sentence") and show only what was written. No streak counters. Wording example: "Any amount counts." | Strong fit with "gentleness about the habit" and chronic-illness evidence (Fulmer's 50-100 words). Risk: any goal can become pressure. Make it optional and hideable. | Yes | S |
| 10 | **Character count mode and Intl.Segmenter** (part of #2 but separately shippable). | Fit: makes the finish line and milestones true for CJK writers. | Yes | S |
| 11 | **Dictation**: do not build a custom recognizer. Document that OS dictation works, test it with Tiptap on Android/iOS, and, if built, offer only on-device recognition (`processLocally` with language pack) behind an explicit toggle, with a clear sentence that audio stays on the device. | Conflict if server-based: audio leaves the device, breaking "no harvesting" and "offline." Fit if on-device only. | Only on-device, Chrome/Android, language-pack download | M |
| 12 | **RTL support in text** (per-block `dir=auto`, direction toggle, RTL-aware quote rules, Persian ZWNJ typing helper, bidi testing). UI mirroring later. | Fit: "everyone is a storyteller" must include Arabic, Hebrew, Persian writers. | Yes | M (text), L (UI mirror) |
| 13 | **UI translation, French first**, with plural and date handling. Editorial craft content translated by humans over time. | Fit. Honest labelling: say which parts are translated. | Yes | L |
| 14 | **Accessible EPUB export** with language, metadata and reading direction. | Fit: "open formats," and the writer's book is readable by all. | Yes | S-M |
| 15 | **Vertical writing mode** for Japanese and Chinese (view and export). | Fit but niche; editing vertical text in contenteditable is the hard part and I found no evidence about Tiptap's behaviour there. | Yes | L; defer |
| 16 | **Per-paragraph language marks** for code-switching writers, with per-span spellcheck language. | Fit; feasibility unverified (browser spellcheck behaviour per span unknown). | Yes | M-L; research first |
| 17 | **Offline custom spellcheck** (Hunspell-style dictionaries in JS) to control languages and personal dictionary. | Fit only if it stays local; cost is dictionary size per language. Not verified in this research. | Yes | L; defer |
| 18 | **AI proofreading or rewrite for dyslexic writers.** | Conflict: "never ghostwrite"; LaMPost shows "rewrite" was the most popular feature among 19 dyslexic adults, which is exactly the temptation. If ever built, critique and spelling-only, opt-in, never replacing the voice. | No (needs a model) | L; do not build now |

---

## 6. Open questions and gaps

1. **Quebec guillemet spacing.** Gatineau (municipal guide) says a no-break space inside « »; a tutoring site says never. I could not reach the OQLF's Banque de dépannage linguistique or the Termium page (403). Needs a primary source before shipping a "Québec" profile.
2. **U+202F coverage in Inter and Literata** and in common reading fonts and e-readers. Needs a quick glyph test. If missing, fall back to U+00A0 with CSS or use `<span>` with a width.
3. **Per-language and per-span spellcheck in browsers.** Does Chrome, Safari or Firefox pick the dictionary from the editor's `lang` or from the OS? Does a nested `lang` span change the dictionary? I could not verify, and this decides how far bilingual support can go without custom dictionaries.
4. **Real screen-reader behaviour of Tiptap v3 with Parchemin's setup** (NVDA, JAWS, VoiceOver, TalkBack), including long documents, the `ActiveBlock` decoration, and the native list Tab behaviour. No published evidence found; needs testing.
5. **Voice dictation in contenteditable on Android and iOS**, including Dragon and Voice Control. Dragon's current web support was not retrievable (the Nuance page now redirects to Microsoft Health Solutions). ProseMirror's Android IME problems are documented in general but not per dictation tool.
6. **Does the typewriter `scrollBy({behavior:'smooth'})` honour reduced motion?** I believe not, from how the API works, but did not test.
7. **First-hand accounts are thin.** I found no readable subreddit threads, no first-hand RTL or bilingual writers, no screen-reader writers on Parchemin-like tools (two blind-writer articles returned 403 or 404), and no controlled evidence on writing apps for ADHD. Quantitative claims about ADHD, dyslexia or disability prevalence were not gathered, so none are made here.
8. **Evidence on writing-specific accommodations.** Almost nothing is controlled. The best evidence is on dyslexia fonts (negative) and text spacing (positive), not on writing tools. Claims about timers, focus modes and tiny goals rest on anecdote.
9. **OCD and perfectionism.** One PubMed search found nothing; the concept of "rejection sensitivity" is popular but not a formal diagnosis. A better source is needed before designing anything for it.
10. **Which languages first?** No usage data (and Parchemin has no analytics by design). Reasonable proxy: French (the name), Spanish, then RTL and CJK support at the editor level. This is a product decision, not a research finding.
11. **Does hiding counts help or harm?** Some ADHD writers say visible word counts keep them on task (iA Writer claims this, vendor), while perfectionists may find them stressful. Offer a setting; do not decide for everyone.
12. **EPUB fonts for CJK and RTL.** Embedding versus relying on reading systems was not researched.

---

## 7. Source list

Quality labels: **A** = primary standard/spec/maintainer or controlled study, fetched. **B** = reputable secondary or practitioner, fetched. **C** = vendor or commercial comparison, fetched. **S** = seen only in search results (title/snippet), not fetched. **X** = tried and failed (403/404/redirect), not used for claims.

Standards and platform docs
- https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/ (A) list of WCAG 2.2 new criteria.
- https://www.w3.org/WAI/WCAG22/Understanding/no-keyboard-trap.html (A) 2.1.2, includes the WYSIWYG Alt+F10 example.
- https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html (A) 4.1.3.
- https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html (A) 2.5.7.
- https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html (A) 2.5.8.
- https://www.w3.org/WAI/WCAG22/Understanding/character-key-shortcuts.html (A) 2.1.4, speech-input rationale.
- https://www.w3.org/WAI/WCAG22/Understanding/label-in-name.html (A) 2.5.3.
- https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html (A) 2.4.11.
- https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html (A) 2.3.3.
- https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html (A) 1.4.3.
- https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html (A) 1.4.12.
- https://www.w3.org/WAI/WCAG22/Understanding/reflow.html (A) 1.4.10.
- https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/ (A) toolbar pattern.
- https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/ (A) modal dialog pattern.
- https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/status_role (A) role=status.
- https://www.w3.org/TR/epub-a11y-11/ (A) EPUB Accessibility 1.1.
- https://www.w3.org/International/questions/qa-html-dir (A) `dir`, `dir=auto`, `bdi`.
- https://www.w3.org/International/articles/language-tags/ (A) BCP 47 and `lang`.
- https://www.w3.org/International/articles/vertical-text/ (A) vertical text on the web.
- https://www.w3.org/TR/jlreq/ (A) Japanese layout requirements (topic list only).
- https://developer.mozilla.org/en-US/docs/Web/CSS/writing-mode (A) writing-mode support.
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter (A) word segmentation, Baseline 2024.
- https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API (A) recognition (server by default; `processLocally`) and synthesis (offline).
- https://developer.mozilla.org/en-US/docs/Web/API/StorageManager/persist (A) persistent storage.
- https://webkit.org/blog/14403/updates-to-storage-policy/ (A) Safari storage and eviction for installed web apps.
- https://developer.mozilla.org/en-US/docs/Web/API/VirtualKeyboard_API (A) keyboard geometry, not Baseline.
- https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/share_target (A) share target, not Baseline.
- https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/shortcuts (A) manifest shortcuts.
- https://dndkit.com/api-documentation/sensors/keyboard (A) dnd-kit keyboard sensor.

Tiptap, ProseMirror
- https://tiptap.dev/docs/guides/accessibility (A) Tiptap's own guidance and VoiceOver note.
- https://github.com/ueberdosis/tiptap/issues/1046 (A) keyboard usability request, closed as not planned/stale.
- https://github.com/ueberdosis/tiptap/discussions/4269 (A) aria-label via `editorProps.attributes`.
- https://tiptap.dev/docs/editor/extensions/functionality/typography (A) Typography rules and quote/RTL overrides.
- https://discuss.prosemirror.net/t/enabling-accessibility-on-prosemirror/3147 (A) maintainer on accessibility and menu.
- https://discuss.prosemirror.net/t/contenteditable-on-android-is-the-absolute-worst/3810 (A) Android IME/composition problems.
- https://prosemirror.net/docs/changelog/ (A) recent Android IME and menu a11y fixes.

Dyslexia, neurodivergence, chronic illness
- https://pmc.ncbi.nlm.nih.gov/articles/PMC5629233/ (A) OpenDyslexic study, 12 children, no benefit.
- https://adrianroselli.com/2015/03/typefaces-for-dyslexia.html (B) summary of dyslexia-font studies and spacing evidence.
- https://onlinelibrary.wiley.com/doi/10.1002/dys.1752 (S/X) Mossige et al. 2023, only the search-result abstract was read; the page returned 403.
- https://onlinelibrary.wiley.com/doi/10.1002/dys.70024 (S/X) Svendsen 2026, speech-to-text in dyslexia; 403.
- https://www.writerscollegeblog.com/a-dyslexics-guide-to-writing/ (B) first-hand dyslexic designer's writing advice.
- https://arxiv.org/abs/2207.02308 (A) LaMPost, 19 adults with dyslexia.
- https://www.scribd.com/document/78951815/BDA-Dyslexia-Style-Guide and https://iped-editors.org/wp-content/uploads/2021/05/British-Dyslexia-Association-Style-Guide-2018.pdf (S/X) BDA guide; recommendations came from search snippets because the PDF text was not extractable.
- https://larawillard.com/2018/03/02/tools-tricks-for-writers-with-adhd/ (B) ADHD author's tools and struggles.
- https://scribeforge.ink/blogs/dragons-and-spaceships/novel-writing-tips-for-folks-with-adhd (C) neurodivergent novelists' friction points; sells workbooks.
- https://ia.net/topics/an-adhd-friendly-writing-app (C) iA Writer's claims.
- https://autisticnotweird.com/writers/ (B) autistic novelist's tips.
- https://meandisability.substack.com/p/fiction-writing-from-inside-autism (B) autistic/ADHD author; little about tools.
- https://brevity.wordpress.com/2024/01/12/chronic-pain-and-writing/ (B) first-hand, short bursts and phone Notes app.
- https://erinfulmer.com/2021/12/20/words-versus-spoons-on-writing-with-chronic-illness/ (B) first-hand, critique of "write every day".
- https://en.wikipedia.org/wiki/Spoon_theory (B) origin of spoon theory.
- https://pubmed.ncbi.nlm.nih.gov/?term=ADHD+time+perception+meta-analysis (A, listing only) titles of ADHD time-perception meta-analyses; abstracts not read.
- https://forum.literatureandlatte.com/t/accessibility-for-visually-impaired/143675 (B) low-vision Scrivener users.
- https://writingcooperative.com/accessibility-awareness-two-blind-writers-talk-about-their-challenges-e82cecbb7f7 and https://rmfw.org/2020/01/10/writing-blind-by-paul-martz/ (S/X) blind-writer accounts; 403 and 404, so only the snippets were used.
- https://voicedash.ai/best-adhd-writing-tools/ (S, vendor listicle) not fetched; treat tool-abandonment claims as unverified.

French and typography
- https://fr.wikipedia.org/wiki/Espace_ins%C3%A9cable (B) France vs Canada vs Switzerland.
- https://l-express.ca/insecables-espaces/ (B) Canadian rules, cites Termium.
- https://www.gatineau.ca/portail/default.aspx?p=guide_marque%2Fnos_normes%2Fnormes_redaction%2Fponctuation_regles_typographiques%2Fponctuation_espacement (B) Quebec municipal style: nbsp inside guillemets, no space before `; ? !`.
- https://centretudes.ca/guillemet-en-francais/ (B/C, tutoring business) claims no space inside guillemets in Quebec; contradicts Gatineau.
- https://fvsch.com/espaces-ponctuation (B) U+202F vs U+00A0, rendering and input problems.
- https://www.noslangues-ourlanguages.gc.ca/chroniques-de-langue/lespace-insecable (S/X) Canadian government language column; 403 on the redirected URL.
- https://github.com/googlefonts/opensans/issues/37 and https://github.com/georgd/EB-Garamond/issues/80 (S) U+202F missing from fonts; seen in search results only.
- https://www.lafabriquedunet.fr/logiciels/comparateur/languagetool-vs-antidote (S, C) Antidote vs LanguageTool; commercial comparison, snippet only.
- https://dev.languagetool.org/http-server (A) running LanguageTool locally; AI rules cloud-only.
- https://en.wikipedia.org/wiki/Quotation_mark (B) quote conventions by language.
- https://en.wikipedia.org/wiki/Zero-width_non-joiner (B) Persian ZWNJ, typing and word-count issues.

RTL, CJK, mobile
- https://docs.obsidian.md/Plugins/User+interface/Right-to-left and https://forum.obsidian.md/t/mixed-rtl-and-ltr/34808 (S) Obsidian RTL support and mixed-direction complaints; snippets only.
- https://www.anycount.com/word-count-worldwide/word-count-in-oriental-languages/ (S) CJK word-count conventions; snippet only.
- https://en.wikipedia.org/wiki/Keitai_shosetsu (B) phone-written novels in Japan.
- https://www.pewresearch.org/internet/fact-sheet/mobile/ (A) smartphone-only share, 16% in 2025.

# 09 - The writing tools landscape and its gaps

Researcher 9 of 12. Date of research: 2026-10-03. All prices, versions and ratings below were read on that date from the
pages named in section 7 and can change. Anything not fetched is marked "unverified".

Method and honesty note. About 55 fetches and searches were completed. The shared web-search budget (200 calls) ran out
partway, and a session limit ended the run, so the planned deeper pass on Reddit-style user threads was not possible
(reddit.com is also blocked for the fetch tool). Evidence of user complaints therefore leans on: official vendor forums
(Literature & Latte, Obsidian), the Apple App Store, Capterra and Trustpilot pages, an NPR story, and search-result
snippets (marked "snippet only"). Listicle sites run by competing vendors (Reedsy, Novel Factory, Auctore, Scribeist)
appeared in results and are treated as biased, not as evidence. Gaps are listed in section 6.

---

## 1. Executive summary

1. The most repeated pain across tools is multi-device sync, not writing. Scrivener for iOS only syncs through Dropbox and
   its forum is full of "sync stopped working / Invalid file / sync conflicts" threads. Obsidian Sync users report plugin
   and settings sync failures and piles of conflict copies. Sync is where trust breaks.
2. Learning curve and compile (export) pain is the second theme. On one Capterra page of 18 Scrivener reviews, about 11 to
   12 mention a steep learning curve, confusing compile or "settings within settings". Atticus (Trustpilot) is criticised
   for the same onboarding load, plus bugs.
3. Pricing models are fragmenting writers' loyalty. Ulysses moved from one-time to subscription in 2017 and App Store
   reviewers still call that out in 2026. Dabble lists $19 to $49 per month (and $699 lifetime). Plottr's lifetime tiers run
   $150 to $649. Meanwhile iA Writer, Scrivener, Atticus and Typora sell one-time licenses. A free, honest, no-lapse
   model is a real differentiator.
4. Data loss stories are real but usually come from the backup chain, not the editor. Mat Johnson (NPR, 2017, snippet
   only) lost 100 pages after a disk failure because his online backup had silently stopped (an unread billing email).
   Scrivener staff stress that "saving is not backing up", and cloud-sync tools can corrupt Scrivener's folder-package
   format. Lesson for Parchemin: a backup that nobody checks is not a backup.
5. Parchemin's real technical risk is browser eviction, not quota. IndexedDB is "best-effort" by default and is deleted
   all at once when evicted. Safari deletes script-written storage after 7 days of no interaction for sites used in a
   browser tab, but home-screen web apps are exempt (WebKit). `navigator.storage.persist()` is widely supported but granted
   by heuristics (Chrome: engagement, install; Firefox: user prompt; WebKit: heuristics such as being a home-screen app).
6. The File System Access API (pickers that write real files to a user-chosen folder) is Chromium-desktop only
   (caniuse: about 31% of users; no Safari, Firefox or any mobile browser). OPFS is broadly supported but is NOT
   user-visible, still subject to clearing, so it is not a safety net by itself. Durability therefore needs three layers:
   persistent storage request, visible backups the writer holds, and an optional auto-save-to-folder on Chromium.
7. Local-first (Ink & Switch) names seven ideals, including long-term preservation and user ownership, and recommends
   plain text, JSON or SQLite for archives. Parchemin's JSON backup, Markdown and EPUB exports already match this; the
   gap is making the backup habit easy and visible, and a folder-of-files export.
8. Places a calm, free, local-first app can win: writers who want Scrivener's structure without its learning cliff; people
   on Windows, Linux, Chromebook, Android or iPhone-only who are excluded by Apple-only tools (Ulysses, Bear, Vellum,
   Highland, Storyist); and writers wary of subscriptions, AI training and cloud lock-in.
9. Places not to compete: professional typesetting (Vellum $199.99 to $249.99 and Atticus $147 own this), real-time
   collaboration (Google Docs, Dabble, Reedsy Studio), AI drafting (Sudowrite, NovelAI, Novelcrafter), wiki-style
   worldbuilding (World Anvil, Campfire), screenplay formatting (Final Draft, Highland).
10. Evidence is thin on accessibility and on poetry or short-story-specific needs; flagged as open questions.

---

## 2. Tool-by-tool table

Prices as seen 2026-10-03 unless a different date is stated. "Snippet only" means the claim came from a search result
summary and the page itself was not read.

| Tool | Price model | Platforms | Loved for | Recurring complaints (source) |
|---|---|---|---|---|
| Scrivener 3 (Literature & Latte) | One-time per platform. iOS US$23.99 (store page). Mac/Windows price hidden behind checkout (unverified). 30-day free trial. Versions on overview page: Mac 3.5.2, Windows 3.1.6, iOS 1.2.4. | macOS, Windows, iOS. No Android (Capterra review). iOS sync requires Dropbox. | Binder, corkboard, snapshots, split view, many export targets, owned license. | Steep learning curve and confusing compile (Capterra p.3, 2019-2024). iOS Dropbox sync failures and "Invalid file" (L&L forum threads 128571, 34010, 153465, App Store review). Package corruption when cloud tools interfere (L&L forum 51151). Windows version feels second to Mac (one Capterra review). Oversized for simple projects (Capterra). |
| Ulysses | Subscription only: $39.99/yr, $5.99/mo (pricing page, 2026-10-03). Was $45 Mac + $25 iOS before Aug 2017. Student pricing. No free tier. | Mac, iPad, iPhone (iCloud). | Clean writing environment, Markdown-ish, library. | Subscription anger since 2017 (TechCrunch 2017; App Store reviews). iPhone cramped, sheet ordering and tagging complaints, perceived as non-fiction-oriented (App Store, 4.5 from 2.6k ratings). Apple-only. |
| iA Writer | One-time per platform: Mac $49.99, Windows $29.99, iPhone/iPad $49.99 (ia.net pricing, 2026-10-03; App Store page shows $19.99 for iOS, so figures conflict, unverified which is current). 7-day trial. | Mac, Windows, iOS. | Minimal, plain text, "one-time is not lifetime" honesty. | Wants more fonts/themes and cloud options; WYSIWYG preferences (App Store, 4.6 from 1.5k). Intentionally limited customisation. |
| Obsidian | App free; Sync $4/mo billed yearly or $5/mo; Publish $8-$10/mo; commercial licence $50/user/yr. | Desktop and mobile. | Plain-text Markdown files in a local folder, plugins, linking (Legend Fiction substack). | Obsidian Sync not carrying plugins/settings/hotkeys across devices (forum 88889, Sept 2024); conflict copies accumulate; mobile image/plugin gaps (snippet only, codeculture.store; page could not be fetched). Steep DIY setup for novelists. |
| Notion | Free (5 MB uploads, 7-day page history, offline for recents/favorites), Plus $10/member/mo, Business $20 (pricing page). | Web, desktop, mobile. | Flexible databases, notes, planning. | Not researched from user sources (budget ran out). Unverified: slowness on large pages, export fidelity. |
| Google Docs | Free with Google account (unverified in this run). Limit about 1.02 million characters per doc (Google help). | Web, mobile. | Free, collaboration, ubiquity. | Lag on long manuscripts, "became useless at 60,000 words" (snippet only, comments on a Substack). Account-lockout risk is named in Ink & Switch's essay (2017 Google Docs incident). |
| Microsoft Word | Not verified this run (fetch timed out). | Desktop, web, mobile. | Industry-standard submission format. | Not researched this run. Unverified: recovery-file reliance for crashes (snippet from scribecount says Word keeps separate recovery files). |
| Atticus | One-time $147, 30-day refund (atticus.io, 2026-10-03). | Windows, Mac, Linux, Chromebook as PWA; works online and offline; cloud backup. | Formatting for ebook and print without Vellum's Mac-only price. | Trustpilot 4.4 of 5 (200 reviews): bugs, freezes, "loses work" (Sep 2026 review), limited formatting for contents pages, onboarding load, uneven support. Note: Atticus is itself a PWA, so it faces the same browser-storage questions as Parchemin (cloud backup is their answer). |
| Vellum | One-time $199.99 (ebooks) or $249.99 (ebooks + print). Free trial. | Mac only (macOS 13+). | Beautiful automated book formatting. | Mac-only and price (vendor page). No user-review fetch completed. |
| Reedsy Studio | Free core; Studio Essential $4.99/mo, Outlining $7.99/mo. 30-day trial. | Web only; no dedicated mobile app. | Free, easy formatting, EPUB/PDF export, boards. | No offline mention on the page (unverified whether it works offline). Lower-learning-curve claims come from Reedsy's own listicles, not independent reviews. |
| Dabble | $19/mo Writer, $29/mo Author, $49/mo Bestseller; $699 lifetime Author; 20% yearly discount. Lapsed accounts become read-only (pricing page). | Desktop and mobile (iOS/Android). | Simple, plot grid, sync. | Trustpilot 3.0 of 5, only 5 reviews: deleted portion of a book (Feb 2026), CPU/battery use (Apr 2025), price, unresponsive support. Very small sample. |
| Plottr | Basic $9.99/mo or $60/yr; Pro $14.99/mo or $99/yr; lifetime $150 / $599 / $649. | Desktop (Basic), plus web for Pro. Offline "Coming Soon" for Pro. | Visual plotting timelines. | Not researched from user sources. Price tiers are the visible friction. |
| Novelcrafter | $4 / $8 / $14 / $20 per month; AI via your own API key from the $8 tier. 21-day trial. Read-only and exportable after cancel. | Web. No offline or local-first claims found. | Codex (story bible), bring-your-own-key AI. | Not researched from user sources. |
| Sudowrite | $10 / $22 / $44 per month, credit-based. | Web. | AI drafting and editing. | Not researched. Conflicts with Parchemin's "never ghostwrite" stance. |
| NovelAI | From $10/mo (site). Claims prompts are encrypted. No explicit training statement found on the page. | Web. | AI storytelling, privacy marketing. | Not researched. |
| Campfire | Free tier, modular pricing, $12/mo Standard (listed), lifetime option; collaboration and unlimited storage. | Browser, desktop, mobile (CF Creators). | Worldbuilding modules, print-ready export. | Not researched from user sources. |
| World Anvil | Free "Freeman" (2 worlds, 42 articles, 100 MB images), Journeyman $40/yr, Master $58/yr, Grandmaster $105/yr (snippet only, third-party summary; the official page returned 403). | Web. | Deep wiki-style worldbuilding. | Limits on free tier; the vendor has announced free-account changes (blog link seen, not read). |
| Bear | Pro subscription (amount not shown on fetched page). | Apple only; iCloud sync. | Notes, tags. | Unverified; Ulysses reviewers compare its tags favourably. |
| Typora | One-time $14.99, 15-day trial, up to 3 devices. | Mac, Windows, Linux. | Live Markdown preview, CSS themes, focus and typewriter modes. | Not researched. No mobile (page lists desktop only). |
| FocusWriter | Free, GPL v3, optional tips. | Linux, Windows 10 x64. | Hide-away UI, goals, session recovery. | No Mac or mobile (page). |
| Freewrite (hardware) | Prices not shown on fetched page. Syncs to Dropbox, Google or Evernote via Postbox once on Wi-Fi. | Hardware. | No distractions, "2-3x more words per hour" is the vendor's own testimonial claim, unverified. | Not researched. |
| Manuskript | Free, GPL v3. | Linux, Mac, Windows. 577 open issues on GitHub. | Scrivener-like open source. | Not researched beyond repo page; Python/PyQt5 app. |
| yWriter | Free on Windows; Mac and mobile versions are third-party paid. Project files .yw5/.yw6/.yw7; auto backups and snapshot sequence. | Windows (Wine on Linux). | Author-built scene metadata (goal, conflict, outcome), plain practicality. | Windows-centric. No user complaint sources fetched. |
| bibisco | "Supporters Edition" mentioned, price not shown. | Linux, macOS, Windows, Android, iOS. | Character and structure planning. | Not researched. |
| Highland Pro | $59.99/yr or $9.99/mo; 30-day trial. | Mac, iPad, iPhone (iCloud). | Fast clean screenwriting. | Apple-only. |
| Storyist | Price not shown on page. | macOS, iOS. | Index cards plus manuscript, sheets. | Apple-only; not researched. |
| Final Draft 13 | One-time $249.99 (shown discounted to $199.99), or $99.99/yr, or $16.99/mo. | macOS 12+, Windows 11, iOS companion. Not Chromebook. | Screenplay standard. | Not researched. Out of scope for Parchemin. |
| Papyrus Author, Quoll Writer, Storyist details | Page fetch failed (Papyrus) or not attempted (Quoll Writer). | Unverified. | Unverified. | Unverified. |

---

## 3. Cross-tool complaint patterns, ranked

Ranking blends how often it appears in the evidence read and how much it hurts (loss of trust vs annoyance). The evidence
base is small and skewed to what the fetch tool could reach; treat the order as a hypothesis.

1. Sync and multi-device failure (high frequency, high severity).
   - Scrivener iOS: "file might not update" in Dropbox and "Invalid file" on iPad though the Mac copy opened fine (L&L forum
     128571). Staff advice in another thread, when 15,000 files failed: start over, confirm the desktop copy, move it out
     of Dropbox (forum 34010). Persistent "Sync conflicts detected" after a device migration (forum 153465, April 2026; no
     data loss confirmed).
   - App Store reviewer: "the Dropbox syncing is maddening" (Scrivener iOS page).
   - Obsidian: Sync subscriber of years reports plugins, settings and hotkeys failing across five devices (forum 88889).
     Conflict copies accumulate (snippet only).
   - Pattern: tools built on folders of files that third-party clouds sync (Dropbox, pCloud, iCloud) break when the
     cloud does partial or selective sync. Parchemin avoiding multi-device sync is therefore a defensible v1 choice, not
     only a gap.
2. Learning curve, feature bloat and compile or export pain (high frequency, medium severity).
   - Scrivener Capterra page 3: about 11 to 12 of 18 reviews cite steep learning curve or confusing compile, e.g.
     "Compiling books can be a minor nightmare" (2019); "settings within settings" (2019).
   - Atticus Trustpilot: onboarding complexity and limited formatting (2026).
   - Reviewer: Scrivener "oversized for basic story layout and plotting" (Jan 2023).
3. Subscription fatigue and pricing opacity (high frequency, medium severity).
   - Ulysses: reviewers still object in 2026; TechCrunch (2017) noted prior $45 + $25 purchases replaced by $39.99/yr.
   - Dabble from $19/mo with a $699 lifetime; Plottr lifetime up to $649; Novelcrafter and Sudowrite credit and tier models.
   - One-time models exist (iA Writer, Scrivener, Atticus, Typora). iA Writer explicitly says one-time is not lifetime.
4. Data loss and corruption (lower frequency, highest severity).
   - Dabble Trustpilot Feb 2026: "A large portion of my book was deleted." Atticus Trustpilot Sep 2026: crashes and lost
     work. Single anecdotes, not rates.
   - Scrivener package corruption with duplicate content.rtf after a failed backup during cloud sync (forum 51151);
     staff: saving and backing up are different things.
   - Mat Johnson (NPR, 2017, snippet only): failed disk, online backup dead because card details lapsed; Dominic de Souza
     (Substack) lost a novel to a virus and now keeps his Obsidian vault in Google Drive.
5. Platform exclusion (medium frequency, high severity for the excluded).
   - Apple-only: Ulysses, Bear, Highland, Storyist (store pages). Mac-only: Vellum. No Android: Scrivener (Capterra,
     2021). No Mac or phone: FocusWriter. Windows-primary: yWriter.
6. Weak or missing mobile (medium frequency).
   - Obsidian mobile image, sync and plugin gaps (snippet only). Ulysses iPhone "cramped" (App Store). Reedsy Studio has
     no native app (vendor page). Scrivener iOS lags version-wise (1.2.4, requires iOS 11+).
7. Performance on long manuscripts (medium frequency, medium severity).
   - Google Docs lag from roughly 50,000 to 60,000 words (snippet only, third-party posts); doc limit 1.02 million
     characters (Google). Dabble CPU and battery use (Trustpilot). Scrivener "clunky/slow" (Capterra 2023).
8. Collaboration and accessibility (low evidence this run).
   - Lack of real-time collaboration in Scrivener (snippet only, listicles). No accessibility complaint sources reached;
     the Literature & Latte forum search pages were not fetchable. Treat accessibility as an unresearched risk, not a
     non-issue.

---

## 4. Browser storage durability

### 4.1 What was verified

| Topic | Finding | Source |
|---|---|---|
| Default mode | All origins are "best-effort": the browser may delete data under storage pressure or inactivity without asking. Eviction is all-or-nothing per origin (IndexedDB, Cache API, etc. together). | MDN quotas and eviction; WebKit storage-policy post |
| Persistent mode | `navigator.storage.persist()` marks the origin so it is deleted only if the user clears it in settings. | MDN; web.dev persistent-storage |
| Who grants persist | Chrome and Chromium: no prompt, decided by site engagement, installed or bookmarked, notification permission. Firefox: asks the user. WebKit: heuristics "like whether the website is opened as a Home Screen Web App". | web.dev; WebKit |
| Support | `persist()` supported in Chrome 55+, Firefox 57+, Safari 15.2+, Edge 79+ (96% global). | caniuse |
| Quota (current) | Chrome/Chromium: 60% of disk per origin. Firefox: best-effort min(10% of disk, 10 GiB); persistent up to 50% of disk. Safari 17+: about 60% of disk for browser apps. Quotas are not the practical limit for text; images and many snapshots could add up. | MDN; WebKit |
| Older Safari figure | web.dev's "storage for the web" still says roughly 1 GB with 200 MB prompts for Safari, which the 2023 WebKit post supersedes. Treat the 1 GB figure as outdated. | web.dev vs WebKit |
| Chrome edge cases | Incognito drops to about 5%; with "clear site data when windows close" the cap is about 300 MB. | web.dev |
| Safari 7-day cap | WebKit: ITP deletes script-writable storage (IndexedDB, localStorage, service worker registration and cache) after 7 days of no user interaction with the site, in Safari. Home-screen web apps are exempt and have their own isolated storage. | webkit.org tracking prevention; Apple developer forum; HN thread |
| Safari persist() | Apple forum posters report that persist() may need requesting each launch and may reset when the browser closes; unverified. | Apple developer forum 710157 |
| IndexedDB bugs in Safari | Reports of silent write drops, transaction auto-close with promises, and database-open errors with many DBs per origin. A community gist, so treat as pointers to test, not as current facts. | pesterhazy gist |
| localStorage | 10 MiB total; throws QuotaExceededError. Irrelevant for manuscripts. | MDN |
| OPFS | Baseline since March 2023; private to the origin; not visible to the user; clearing site data deletes it; no permission prompts; fast sync access in workers. It does not solve eviction. | MDN OPFS |
| File System Access pickers | `showSaveFilePicker`, `showOpenFilePicker`, `showDirectoryPicker` are experimental and not Baseline. caniuse "native-filesystem-api": Chrome/Edge 105+ full, Opera, about 31% global; no Safari, Firefox or any mobile browser. NOTE: Chrome's developer article and caniuse's "FileSystemHandle" page list Firefox 111+ and Safari 15.2+, but those entries cover the OPFS-related subset, not the pickers. | MDN; caniuse x2; Chrome dev article |
| FSA permissions | Per Chrome docs, access normally ends when all tabs close. Handles can be stored in IndexedDB and re-checked with `queryPermission()`. Since Chrome 122, users can choose "Allow on every visit", and installed PWAs persist permission without the dialog. Auto-revoked permissions can be re-requested. | Chrome dev blog; Chrome FSA article |
| Sharing files on iOS | `navigator.share({files})` exists with `canShare()` but MDN lists it as limited availability and platform-dependent; unverified on current iOS Safari. | MDN Navigator.share |

### 4.2 Interpretation

- The writer who uses Parchemin in a Safari tab on iPhone and leaves it for a week or more is the highest-risk case. A
  writer using the installed home-screen app is exempt from the 7-day cap, but is still best-effort under storage
  pressure unless persist is granted.
- The writer who uses Chrome or Edge on desktop is the lowest risk and can additionally get true files on disk through the
  File System Access API.
- Firefox and Safari desktop writers have no way to write to a chosen folder, so rely on downloads and calm reminders.
- A device-level event (phone replaced, browser data cleared in a "clean-up" app, new profile) wipes everything for every
  browser, regardless of API support. Only an off-browser copy protects against that.
- Atticus, the nearest PWA competitor in this survey, answers with automatic cloud backup. Parchemin's no-account promise
  rules that out by default, so the answer has to be files the writer holds.

### 4.3 Recommendations for Parchemin's durability design

In order of value per effort:

1. Request persistent storage at a meaningful moment, not on first load: for example right after the writer's first
   real save of a chapter or when they install. Show the outcome plainly in Settings ("This device will keep your work
   unless you clear it yourself" or "Your browser may clear your stories if the device runs low on space. Here is a
   backup button."). Use `persisted()` to read state. Do not nag if declined.
2. Show a calm "Safekeeping" panel: last backup date, words or chapters changed since, storage used vs quota
   (`estimate()`), persistent yes/no, installed yes/no. No red alerts, no guilt copy; offer one tap to back up.
3. Backup nudge by changed work, not by calendar: after N hundred new words since the last backup, or when closing the
   app, offer "Save a copy of your stories" once. Make dismissal sticky for a few days. This follows the
   "gentleness" rule in PHILOSOPHY.md and addresses the Mat Johnson failure mode (silent backup death).
4. Chromium desktop: optional "Keep a copy in a folder" using `showDirectoryPicker`. Store the handle in IndexedDB, check
   `queryPermission()`, fall back to a visible "Reconnect folder" button if permission lapsed. Write JSON backup plus a
   readable Markdown folder (one file per chapter) after quiet periods. When the folder sits inside Dropbox, iCloud Drive
   or OneDrive, the writer gets sync and offsite copy without Parchemin holding any account. Warn that two-device
   editing can conflict.
5. iPhone and iPad: coach installation to the home screen with honest copy (it avoids the 7-day rule and gets separate
   storage). Offer backup via the share sheet where `canShare({files})` works and a normal download elsewhere. Test on
   real devices; documentation is thin.
6. Verified restore: after export, offer a "check this backup" that reads the file back and counts stories, chapters and
   words, so the writer knows the file is whole. Restore already merges by id, which is safe.
7. Keep the writes crash-safe: debounce autosave, write to IndexedDB on blur/visibilitychange and before unload,
   keep rolling automatic snapshots (already in the app), and include snapshots in the full backup.
8. Defensive checks: wrap writes in try/catch for QuotaExceededError, test Safari IndexedDB behaviour (transaction
   auto-close, open errors), and handle Firefox private mode (IndexedDB blocked) with a clear message.
9. Do not rely on OPFS as a second copy; it has the same eviction domain. It could only help for performance of very large
   binary data later.
10. Format longevity: keep the JSON schema versioned and documented in the app; export Markdown with front matter plus a
    plain `.txt` option; avoid binary-only formats. Ink & Switch cite plain text, JSON and SQLite as archival; the Library of
    Congress "Recommended Formats Statement" exists, but the page fetched only gave a table of contents, so its specific
    criteria were not verified.

---

## 5. Ideas for Parchemin, ranked

Fit is measured against the six decision questions and the "will not do" list in PHILOSOPHY.md. Build size: S (days),
M (1 to 3 weeks), L (a month or more).

| Rank | Idea | Fit with PHILOSOPHY.md | Offline | Size |
|---|---|---|---|---|
| 1 | "Safekeeping" panel plus persistent-storage request (idea 4.3 items 1 and 2) | Strong: belief 6 (writer owns work), "safe to finish". Must be quiet, no alarm language. | Yes | S |
| 2 | Change-aware backup nudge and verified restore check (items 3 and 6) | Strong, if worded as help not guilt; one gentle prompt, easily dismissed. | Yes | S |
| 3 | Optional "Keep a copy in a folder" for Chromium plus Markdown folder export (item 4) | Strong: open formats, no account, writer holds the files. Conflict risk if used on two devices. | Yes (writes locally) | M |
| 4 | iOS home-screen coaching and share-sheet backup (item 5) | Strong, honest explanation of a platform rule. Needs device testing. | Yes | S |
| 5 | A calmer onboarding than Scrivener: blank page first, one visible next step, structure on request (already the stance) | Strong: belief 4, decision question 4 and 5. Direct response to the learning-curve complaints. | Yes | S (copy and defaults) |
| 6 | Simple "manuscript copy" export: DOCX (and PDF) in standard submission layout, plus clean EPUB | Good: no lock-in; helps writers send to editors and agents. DOCX is the usual interchange (unverified for agent requirements; verify in the market-fit note). Do not try to be Vellum. | Yes | M |
| 7 | Long-manuscript performance check (100k words, 40 chapters, many snapshots) with test data | Neutral to strong: avoids the Google Docs and Dabble lag stories. Chapter-per-document already helps. | Yes | S |
| 8 | Accessibility pass: keyboard-only use, screen-reader labels, reduced motion, large text, dyslexia-friendly font option, high contrast | Strong fit with "everyone is a storyteller"; evidence from this run is thin, so research more before scoping. | Yes | M |
| 9 | Free forever for the core; optional one-time "supporter" gift with no feature lock | Strong against subscription fatigue (Ulysses). Needs a business view outside this research. No lapse or read-only trap (compare Dabble and Novelcrafter read-only on cancel). | Yes | S |
| 10 | Optional sync via user-owned storage (WebDAV/Dropbox folder, or the folder-copy approach above) | Allowed as opt-in per PHILOSOPHY.md roadmap. High risk: sync conflict is the number-one complaint in the survey. Build only with explicit conflict copies and a read-only second device first. | Partly | L |
| 11 | Good phone layout for capture (short notes, a sentence waiting for tomorrow) as a PWA | Strong for habit, avoids "bad mobile app" theme. Obsidian community converged on mobile-as-capture. | Yes | M |

Not recommended, with reasons:
- Real-time collaboration or accounts: breaks no-account and offline rules and is already well served.
- AI drafting (Sudowrite, NovelAI model): forbidden by the "never ghostwrite" rule. An opt-in critique-only helper is
  on the roadmap but belongs in another researcher's note.
- Heavy typesetting (print-ready PDFs with trim sizes, drop caps): Vellum and Atticus own it; keep EPUB basic.
- Wiki worldbuilding (World Anvil, Campfire): setting sheets are planned in obstacle-first form, which is a different, more
  teaching-led design.
- Streak or badge mechanics: forbidden.

Where a calm, free, local-first app has room to win:
- Writers who bought Scrivener, found compile and settings overwhelming, and want finishing help (the product's craft
  tools), without a year of tutorials.
- Windows, Linux, Chromebook, Android and iPhone-only writers excluded by Apple-only apps.
- People who dislike subscriptions or want a clean way out (full JSON backup plus Markdown and EPUB export).
- Short-story, novella and poetry writers who do not need a 100-feature binder (hypothesis; not tested in this run).

---

## 6. Open questions and gaps

1. How often does Parchemin's real audience lose data to eviction? There is no public rate. Instrumenting this would
   violate the no-analytics rule, so consider an in-app, local-only "storage health" self-check and a way for writers to
   report problems voluntarily.
2. Does `persist()` get granted on current iOS Safari for home-screen apps and for tabs, and does it survive restarts?
   Apple documentation says "heuristics" only. Needs a real-device test plan (iOS 17 and later).
3. Does the Chrome "Allow on every visit" prompt work for installed Parchemin as a PWA, and what happens on Chromebook?
4. What do writers actually say on Reddit (r/scrivener, r/writing, r/selfpublish, r/ObsidianMD, r/Dabble, r/NovelCrafter)?
   Not reachable in this run. A next pass should read recent threads and count themes.
5. Accessibility complaints about writing tools (screen reader, low vision, dyslexia, motor), and Parchemin's own
   current accessibility state, are unresearched.
6. Poetry and short-story needs (line breaks, stanza tools, submission tracking) were not covered.
7. Microsoft Word, Google Docs, Notion, Bear, Papyrus Author and Quoll Writer need first-hand sources; Quoll Writer's
   status (maintained or not) is unverified.
8. Pricing pages change often. Re-check any number before it is quoted in marketing. iA Writer's price conflicts between
   its site ($49.99 Mac) and the iOS App Store page ($19.99); unresolved.
9. Is EPUB export enough for writers who must send DOCX to editors and contests? Needs a market-fit note.
10. Optional sync: which user-owned option is the least risky (folder in cloud drive, WebDAV, remoteStorage)? Not
    researched; the survey suggests conflict handling is the hard part.
11. Source-quality caveat: Several "complaint" findings come from small samples (5 Trustpilot reviews for Dabble) or from
    search snippets. They show themes, not prevalence.

---

## 7. Sources (fetched or read as snippets on 2026-10-03)

Primary and standards
- https://www.inkandswitch.com/essay/local-first/ . The local-first essay (seven ideals; plain text, JSON, SQLite as
  archival; Google Docs lockout example). High quality, primary.
- https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria . MDN quotas and
  eviction; clear and current. High quality.
- https://webkit.org/blog/14403/updates-to-storage-policy/ . WebKit Safari 17 storage policy, quotas and persist heuristics.
  High quality, primary.
- https://webkit.org/tracking-prevention/ . WebKit ITP 7-day cap and home-screen exemption. High quality, primary.
- https://web.dev/articles/persistent-storage . Persistent storage API behaviour by browser. Good, from Google.
- https://web.dev/articles/storage-for-the-web . Quota summary; Safari 1 GB figure appears out of date. Medium quality.
- https://developer.mozilla.org/en-US/docs/Web/API/File_System_API/Origin_private_file_system . OPFS. High quality.
- https://developer.mozilla.org/en-US/docs/Web/API/Window/showSaveFilePicker . Pickers marked experimental; the summarised
  output lacked its compatibility table. Medium quality.
- https://developer.chrome.com/docs/capabilities/web-apis/file-system-access . Chrome FSA article; its support line mixes
  OPFS with pickers. Medium quality.
- https://developer.chrome.com/blog/persistent-permissions-for-the-file-system-access-api . Chrome 122 persistent
  permissions. High quality, primary.
- https://caniuse.com/native-filesystem-api . Picker support (about 31%, Chromium only). Good.
- https://caniuse.com/mdn-api_storagemanager_persist . persist() support. Good.
- https://caniuse.com/mdn-api_filesystemhandle . Interface support (OPFS-driven); do not read as picker support. Good, with care.
- https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share . Web Share with files. Medium; iOS details unverified.
- https://dexie.org/docs/StorageManager . Dexie's guidance on persist and estimate. Good, matches Parchemin's stack.
- https://www.loc.gov/preservation/resources/rfs/TOC.html . Library of Congress formats statement; only a contents page
  was retrieved. Low yield.
- https://support.google.com/docs/answer/37603 . Google Docs 1.02 million character limit. High quality.

Community and developer evidence on storage
- https://developer.apple.com/forums/thread/710157 . Developers asking about iOS PWA persistence; no Apple reply
  summarised. Medium.
- https://news.ycombinator.com/item?id=22686602 . HN discussion of the 7-day cap and mitigations. Medium (opinion).
- https://github.com/HangerThem/tessera/issues/13 . One project's report of iOS purging IndexedDB. Low to medium (anecdote).
- https://gist.github.com/pesterhazy/4de96193af89a6dd5ce682ce2adff49a . Community list of IndexedDB bugs; may be dated.
  Low to medium.

Tool pages (prices, platforms)
- https://www.literatureandlatte.com/scrivener/overview and https://www.literatureandlatte.com/store/scrivener . Scrivener
  versions, features, iOS price. Primary.
- https://ulysses.app/pricing/ . Ulysses prices. Primary.
- https://techcrunch.com/2017/08/11/popular-writing-app-ulysses-switches-to-subscription-model/ . 2017 switch coverage.
  Good, dated.
- https://ia.net/writer/pricing . iA Writer pricing. Primary; conflicts with App Store price.
- https://www.dabblewriter.com/pricing . Dabble plans. Primary.
- https://www.atticus.io . Atticus price and platforms. Primary.
- https://vellum.pub/ . Vellum price, Mac only. Primary.
- https://reedsy.com/studio . Reedsy Studio freemium; no offline mention. Primary.
- https://plottr.com/pricing/ . Plottr plans. Primary.
- https://www.novelcrafter.com/pricing . Novelcrafter plans; BYOK; read-only on cancel. Primary.
- https://www.sudowrite.com/pricing . Sudowrite credit plans. Primary.
- https://novelai.net/ . NovelAI price and privacy claims; marketing. Primary but promotional.
- https://www.campfirewriting.com/pricing . Campfire modules and tiers. Primary.
- https://obsidian.md/pricing . Obsidian pricing. Primary.
- https://www.notion.com/pricing . Notion plans and offline. Primary.
- https://www.finaldraft.com/products/final-draft/ . Final Draft prices. Primary.
- https://quoteunquoteapps.com/highland-pro/ . Highland Pro pricing. Primary.
- https://www.storyist.com/ . Storyist platforms; no price. Primary.
- https://typora.io/ . Typora price. Primary.
- https://gottcode.org/focuswriter/ . FocusWriter. Primary.
- https://www.getfreewrite.com/ . Freewrite sync claims; no prices. Primary, promotional.
- https://bear.app/faq/ . Bear; limited detail. Primary.
- https://github.com/olivierkes/manuskript . Manuskript repo. Primary.
- https://www.spacejock.com/yWriter7.html . yWriter. Primary.
- https://bibisco.com/ . bibisco. Primary.
- World Anvil figures came from search-result snippets citing third-party summaries (automateed.com, kindlepreneur.com
  results); the official pricing page returned 403. Low quality; verify.

User complaints and reviews
- https://forum.literatureandlatte.com/t/ios-dropbox-not-working-no-matter-what-i-do/128571 . Scrivener iOS Invalid file.
  Good, official forum.
- https://forum.literatureandlatte.com/t/stuck-with-dropbox-sync-failures/34010 . Staff advice on failed sync, iCloud is
  backup not sync. Good.
- https://forum.literatureandlatte.com/t/yet-another-ipad-dropbox-sync-issue/153465 . Sync conflicts, April 2026. Good.
- https://forum.literatureandlatte.com/t/corrupted-scrivener-file-unable-to-backup/51151 . Corrupted project, saving vs
  backup. Good.
- Search snippets only (pages not opened): https://forum.literatureandlatte.com/t/syncing-stopped-working/37525 ,
  https://forum.literatureandlatte.com/t/dropbox-sync-not-working/33998 ,
  https://forum.literatureandlatte.com/t/scrivener-won-t-sync-to-dropbox/38800 ,
  https://forum.literatureandlatte.com/t/scrivener-wont-update-or-sync-with-ios-via-dropbox/124890 .
- https://apps.apple.com/us/app/scrivener/id972387337 . Scrivener iOS App Store (4.2 of 5, 2.6k ratings). Good; short sample of reviews.
- https://apps.apple.com/us/app/ulysses-writing-app/id1225571038 . Ulysses App Store (4.5, 2.6k). Good; short sample.
- https://apps.apple.com/us/app/ia-writer/id775737172 . iA Writer App Store (4.6, 1.5k). Good; price conflicts.
- https://www.capterra.com/p/180597/Scrivener/reviews/?page=3 . 18 Scrivener reviews 2019-2024. Medium (one page, self-selected
  reviewers).
- https://www.trustpilot.com/review/dabblewriter.com . Dabble, only 5 reviews. Low sample size.
- https://www.trustpilot.com/review/atticus.io . Atticus 4.4 of 5 from 200 reviews, with themes. Medium.
- https://forum.obsidian.md/t/persistent-syncing-issues-with-plugins-settings-and-hotkeys-across-devices/88889 . Obsidian
  Sync complaint, Sept 2024. Good, official forum.
- https://legendfiction.substack.com/p/obsidian-my-favorite-free-novel-writing . One novelist's reasons for Obsidian and
  backup story. Anecdote.
- https://www.npr.org/sections/alltechconsidered/2017/07/11/534865245/a-novelist-forces-himself-to-press-on-after-losing-100-pages-in-a-tech-glitch .
  Mat Johnson story; seen as a search snippet only (full fetch timed out). Good source, limited detail read.
- Search snippets only, not fetched: https://codeculture.store/blogs/developer-culture/obsidian-mobile-problems-2025 (fetch failed, SSL
  error), https://operationtestimony.com/blog/is-google-docs-enough-for-writing-and-publishing-your-novel/ and a Substack
  comments thread for Google Docs lag, https://scribecount.com/author-resource/troubleshooting-author-resources/lost-document-recovery .
  Low quality; secondary.
- Competitor-run listicles seen but not relied on: reedsy.com/studio/resources/scrivener-alternatives, novel-software.com,
  auctore.app, scribeist.com, quillandsteel.com. Biased.

# research/

| Path | What it is |
|---|---|
| `notes/01..12-*.md` | Round 1 researcher notes (sources, evidence labels, ideas, gaps) |
| `notes/13-community-voice.md` | Round 2: what writers say about tools like Parchemin (forums, threads, blogs, reviews) |
| `notes/14-dialogue.md` | The video series' dialogue lesson, and what it changed in Parchemin |
| `sources/` | Raw source material such as video transcripts (git-ignored; third-party content, private analysis only) |
| `tools/fetch_threads.py`, `tools/queries.json` | Fetcher for public writing-community threads from open APIs |
| `threads/` | Fetched threads (git-ignored; third-party content, private analysis only) |
| `interviews/guide.md` | Interview guide for 6 to 10 writer conversations |
| `interviews/notes-template.md`, `interviews/tally.csv` | Per-interview notes and a tally sheet |
| `../research.md` | The synthesis. Start there |

## Fetching threads (no accounts, no keys)

Stdlib Python 3 only. Sources: Writing Stack Exchange, Hacker News, public Lemmy communities.

```bash
cd research/tools
python3 fetch_threads.py discover-lemmy            # list candidate Lemmy communities
python3 fetch_threads.py se    --themes starting,abandon-finish --max-requests 60
python3 fetch_threads.py hn    --themes tools,ai
python3 fetch_threads.py lemmy --pages 2
python3 fetch_threads.py index                     # rebuild threads/INDEX.md
```

- **Themes and search phrases** live in `queries.json`; edit them freely. Lemmy communities are listed there too.
- **Politeness:** it sleeps 1.3s between requests (set `PARCHEMIN_DELAY`), caches raw responses in `research/.cache/` so reruns are free, honours Stack Exchange's `backoff`, and stops when the quota is low. Stack Exchange allows about 300 requests a day without a key; set `SE_KEY` if you register an app key for more.
- **Privacy:** usernames are never written, and `@mentions` in replies are scrubbed. Scores, dates and the original URL are kept.
- **Licence:** Stack Exchange content is CC BY-SA 4.0. Keep it for private analysis; do not republish it without attribution. Every file records its URL.
- **Not covered:** Reddit (needs approved API access and its terms restrict use), Absolute Write, Fanlore and AO3 (their terms restrict automated access). Use the interview guide and hand-copied threads for those.

## Interviews
Read `interviews/guide.md` first. Copy `notes-template.md` to `W01.md`, `W02.md`… and add a row to `tally.csv` per conversation. Interview notes contain people's words: keep them out of git (add `research/interviews/W*.md` to `.gitignore` before the first one).

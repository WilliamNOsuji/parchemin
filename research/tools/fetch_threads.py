#!/usr/bin/env python3
"""
Fetch public writing-community threads from OPEN APIs (no account needed) for Parchemin's research.

Sources
  se      Writing Stack Exchange   (api.stackexchange.com, ~300 requests/day without a key)
  hn      Hacker News              (hn.algolia.com)
  lemmy   Lemmy communities        (each instance's public /api/v3)

Output: research/threads/<source>/<theme-or-community>/<id>-<slug>.md   (git-ignored; third-party content)
Usernames are NEVER written. Scores, dates and the original URL are kept. Re-running skips files that exist.

Usage
  python3 fetch_threads.py discover-lemmy
  python3 fetch_threads.py se    [--themes a,b] [--per-query 8] [--min-score 3] [--max-requests 80]
  python3 fetch_threads.py hn    [--themes a,b] [--per-query 8] [--min-points 20]
  python3 fetch_threads.py lemmy [--pages 2] [--min-comments 3]
  python3 fetch_threads.py index

Be a good citizen: this sleeps between requests, honours Stack Exchange's `backoff` field, caches raw
responses in research/.cache/, and stops when the quota is low. Stack Exchange content is CC BY-SA 4.0:
keep it for private analysis and do not republish it without attribution (every file records its URL).
"""
import argparse, gzip, hashlib, html, json, os, re, sys, time, urllib.error, urllib.parse, urllib.request
from html.parser import HTMLParser
from pathlib import Path

HERE = Path(__file__).resolve().parent
RESEARCH = HERE.parent
OUT = RESEARCH / "threads"
CACHE = RESEARCH / ".cache"
CONFIG = json.loads((HERE / "queries.json").read_text())
UA = os.environ.get("PARCHEMIN_UA", "parchemin-research/0.1 (personal, non-commercial product research; read-only)")
DELAY = float(os.environ.get("PARCHEMIN_DELAY", "1.3"))
SE_KEY = os.environ.get("SE_KEY")  # optional Stack Exchange app key; raises the daily quota

_last = 0.0
_requests = 0
_backoff_until = 0.0


class Quit(Exception):
    pass


def http_get(url, max_requests, cache=True):
    """GET JSON with caching, polite delay, gzip and Stack Exchange backoff."""
    global _last, _requests, _backoff_until
    CACHE.mkdir(parents=True, exist_ok=True)
    key = CACHE / (hashlib.sha1(url.encode()).hexdigest() + ".json")
    if cache and key.exists():
        return json.loads(key.read_text())
    if _requests >= max_requests:
        raise Quit(f"request cap reached ({max_requests}); rerun later to continue")
    wait = max(_backoff_until - time.time(), DELAY - (time.time() - _last), 0)
    if wait:
        time.sleep(wait)
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "application/json", "Accept-Encoding": "gzip"})
    for attempt in range(3):
        try:
            _last = time.time()
            _requests += 1
            with urllib.request.urlopen(req, timeout=30) as r:
                raw = r.read()
                if r.headers.get("Content-Encoding") == "gzip":
                    raw = gzip.decompress(raw)
            data = json.loads(raw)
            if isinstance(data, dict) and data.get("backoff"):
                _backoff_until = time.time() + int(data["backoff"]) + 1
            if isinstance(data, dict) and data.get("quota_remaining") is not None and data["quota_remaining"] < 15:
                raise Quit(f"Stack Exchange quota nearly used ({data['quota_remaining']} left); stopping")
            key.write_text(json.dumps(data))
            return data
        except urllib.error.HTTPError as e:
            if e.code in (429, 502, 503) and attempt < 2:
                time.sleep(10 * (attempt + 1))
                continue
            print(f"  ! HTTP {e.code} for {url[:110]}", file=sys.stderr)
            return None
        except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as e:
            if attempt < 2:
                time.sleep(5)
                continue
            print(f"  ! {e} for {url[:110]}", file=sys.stderr)
            return None
    return None


class _Text(HTMLParser):
    BLOCK = {"p", "div", "br", "li", "blockquote", "h1", "h2", "h3", "h4", "pre", "tr"}

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.parts = []

    def handle_starttag(self, tag, attrs):
        if tag in self.BLOCK:
            self.parts.append("\n")
        if tag == "li":
            self.parts.append("- ")
        if tag == "blockquote":
            self.parts.append("> ")

    def handle_endtag(self, tag):
        if tag in self.BLOCK:
            self.parts.append("\n")

    def handle_data(self, data):
        self.parts.append(data)


def to_text(markup):
    p = _Text()
    p.feed(markup or "")
    text = html.unescape("".join(p.parts))
    text = re.sub(r"(?<![\w.])@[A-Za-z0-9_\-]{2,}", "@user", text)  # scrub usernames mentioned in replies
    return re.sub(r"\n{3,}", "\n\n", text).strip()


def slug(s, n=60):
    return (re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-") or "thread")[:n]


def iso(ts):
    return time.strftime("%Y-%m-%d", time.gmtime(ts)) if ts else ""


def write_thread(path, meta, title, body, comments):
    if path.exists():
        return False
    path.parent.mkdir(parents=True, exist_ok=True)
    lines = ["---"] + [f"{k}: {json.dumps(v, ensure_ascii=False)}" for k, v in meta.items()] + ["---", "", f"# {title}", ""]
    if body:
        lines += [body, ""]
    for c in comments:
        indent = "  " * c.get("depth", 0)
        score = f" (score {c['score']})" if c.get("score") is not None else ""
        text = c["text"].replace("\n", "\n" + indent + "  ")
        lines += [f"{indent}- **{c['label']}**{score}: {text}", ""]
    path.write_text("\n".join(lines))
    return True


# ---------- Stack Exchange ----------
def se_url(path, **params):
    params.setdefault("site", "writing")
    if SE_KEY:
        params["key"] = SE_KEY
    return f"https://api.stackexchange.com/2.3/{path}?" + urllib.parse.urlencode(params)


def run_se(a):
    themes = pick_themes(a.themes)
    saved = 0
    for theme, queries in themes.items():
        print(f"[se] theme {theme}")
        for q in queries:
            res = http_get(se_url("search/advanced", q=q, sort="votes", order="desc", pagesize=a.per_query, filter="withbody"), a.max_requests)
            if not res or not res.get("items"):
                continue
            qs = [i for i in res["items"] if i.get("score", 0) >= a.min_score]
            if not qs:
                continue
            ids = ";".join(str(i["question_id"]) for i in qs)
            ans = http_get(se_url(f"questions/{ids}/answers", sort="votes", order="desc", pagesize=100, filter="withbody"), a.max_requests)
            by_q = {}
            for x in (ans or {}).get("items", []):
                by_q.setdefault(x["question_id"], []).append(x)
            for i in qs:
                comments = [
                    {"label": "accepted answer" if x.get("is_accepted") else "answer", "score": x.get("score"), "text": to_text(x.get("body", ""))}
                    for x in sorted(by_q.get(i["question_id"], []), key=lambda x: -x.get("score", 0))[: a.answers]
                ]
                meta = {
                    "source": "Writing Stack Exchange", "theme": theme, "query": q, "url": i["link"], "score": i.get("score"),
                    "answers": i.get("answer_count"), "views": i.get("view_count"), "asked": iso(i.get("creation_date")),
                    "license": "CC BY-SA 4.0 (attribution: the URL above). Private analysis only.",
                }
                title = html.unescape(i.get("title", ""))
                path = OUT / "se" / theme / f"{i['question_id']}-{slug(title)}.md"
                saved += write_thread(path, meta, title, to_text(i.get("body", "")), comments)
    print(f"[se] new threads saved: {saved}")


# ---------- Hacker News ----------
def flatten_hn(children, depth, limit, out):
    for c in children or []:
        if len(out) >= limit:
            return
        if c.get("text"):
            out.append({"label": "comment", "score": None, "depth": depth, "text": to_text(c["text"])})
        if depth < 1:
            flatten_hn(c.get("children"), depth + 1, limit, out)


def run_hn(a):
    themes = pick_themes(a.themes)
    saved = 0
    for theme, queries in themes.items():
        print(f"[hn] theme {theme}")
        for q in queries:
            url = "https://hn.algolia.com/api/v1/search?" + urllib.parse.urlencode({"query": q, "tags": "story", "hitsPerPage": a.per_query})
            res = http_get(url, a.max_requests)
            for h in (res or {}).get("hits", []):
                if (h.get("points") or 0) < a.min_points or (h.get("num_comments") or 0) < 5:
                    continue
                item = http_get(f"https://hn.algolia.com/api/v1/items/{h['objectID']}", a.max_requests)
                if not item:
                    continue
                comments = []
                flatten_hn(item.get("children"), 0, a.comments, comments)
                meta = {
                    "source": "Hacker News", "theme": theme, "query": q, "url": f"https://news.ycombinator.com/item?id={h['objectID']}",
                    "points": h.get("points"), "comments": h.get("num_comments"), "posted": (h.get("created_at") or "")[:10],
                    "note": "Comments are in HN ranking order; HN does not publish comment scores.",
                }
                title = h.get("title") or "thread"
                body = to_text(item.get("text") or "")
                path = OUT / "hn" / theme / f"{h['objectID']}-{slug(title)}.md"
                saved += write_thread(path, meta, title, body, comments)
    print(f"[hn] new threads saved: {saved}")


# ---------- Lemmy ----------
def run_lemmy(a):
    saved = 0
    for entry in CONFIG["lemmy"]["communities"]:
        name, _, host = entry.partition("@")
        print(f"[lemmy] {entry}")
        for page in range(1, a.pages + 1):
            url = f"https://{host}/api/v3/post/list?" + urllib.parse.urlencode(
                {"community_name": name, "sort": "TopAll", "limit": 40, "page": page, "type_": "All"})
            res = http_get(url, a.max_requests)
            posts = (res or {}).get("posts", [])
            if not posts:
                break
            for pv in posts:
                p, c = pv["post"], pv["counts"]
                if c.get("comments", 0) < a.min_comments:
                    continue
                curl = f"https://{host}/api/v3/comment/list?" + urllib.parse.urlencode(
                    {"post_id": p["id"], "sort": "Top", "max_depth": 3, "limit": 50, "type_": "All"})
                cres = http_get(curl, a.max_requests)
                rows = sorted((cres or {}).get("comments", []), key=lambda r: r["comment"]["path"])
                comments = []
                for r in rows:
                    if r["comment"].get("deleted") or r["comment"].get("removed"):
                        continue
                    depth = r["comment"]["path"].count(".") - 1
                    comments.append({"label": "comment", "score": r["counts"].get("score"), "depth": min(depth, 3), "text": to_text(r["comment"]["content"])})
                meta = {
                    "source": f"Lemmy {entry}", "theme": "community", "url": p["ap_id"], "score": c.get("score"),
                    "comments": c.get("comments"), "posted": (p.get("published") or "")[:10],
                }
                body = (p.get("body") or "").strip()
                path = OUT / "lemmy" / f"{name}@{host}" / f"{p['id']}-{slug(p['name'])}.md"
                saved += write_thread(path, meta, p["name"], body, comments)
    print(f"[lemmy] new threads saved: {saved}")


def discover_lemmy(a):
    seen = {}
    for host in ("lemmy.world", "lemmy.ml", "beehaw.org"):
        for q in ("writing", "writers", "fanfiction", "poetry", "worldbuilding", "novel", "authors"):
            res = http_get(f"https://{host}/api/v3/search?" + urllib.parse.urlencode({"q": q, "type_": "Communities", "sort": "TopAll", "limit": 15}), a.max_requests)
            for c in (res or {}).get("communities", []):
                cm, cn = c["community"], c["counts"]
                seen[cm["actor_id"]] = (cn["subscribers"], cn["posts"], cn["comments"], cm["actor_id"])
    for row in sorted(seen.values(), reverse=True)[:40]:
        print(row)


# ---------- helpers ----------
def pick_themes(arg):
    all_themes = CONFIG["themes"]
    if not arg:
        return all_themes
    wanted = [t.strip() for t in arg.split(",")]
    missing = [t for t in wanted if t not in all_themes]
    if missing:
        sys.exit(f"unknown theme(s): {', '.join(missing)}. Known: {', '.join(all_themes)}")
    return {t: all_themes[t] for t in wanted}


def build_index(_a=None):
    OUT.mkdir(parents=True, exist_ok=True)
    rows, total = [], 0
    for src in sorted(p for p in OUT.iterdir() if p.is_dir()):
        for grp in sorted(p for p in src.iterdir() if p.is_dir()):
            files = list(grp.glob("*.md"))
            words = sum(len(f.read_text().split()) for f in files)
            rows.append((src.name, grp.name, len(files), words))
            total += len(files)
    lines = ["# Thread index", "", f"{total} threads. Generated by fetch_threads.py. Third-party content: private analysis only.", "",
             "| source | theme / community | threads | words |", "|---|---|---|---|"]
    lines += [f"| {s} | {g} | {n} | {w:,} |" for s, g, n, w in rows]
    (OUT / "INDEX.md").write_text("\n".join(lines) + "\n")
    print((OUT / "INDEX.md").read_text())


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)
    for name in ("se", "hn", "lemmy", "discover-lemmy"):
        sp = sub.add_parser(name)
        sp.add_argument("--themes", help="comma-separated theme names from queries.json")
        sp.add_argument("--per-query", type=int, default=8)
        sp.add_argument("--max-requests", type=int, default=80, help="stop after this many network requests in this run")
        if name == "se":
            sp.add_argument("--min-score", type=int, default=3)
            sp.add_argument("--answers", type=int, default=5, help="answers kept per question")
        if name == "hn":
            sp.add_argument("--min-points", type=int, default=20)
            sp.add_argument("--comments", type=int, default=40, help="max comments kept per story")
        if name == "lemmy":
            sp.add_argument("--pages", type=int, default=2)
            sp.add_argument("--min-comments", type=int, default=3)
    sub.add_parser("index")
    a = ap.parse_args()
    fn = {"se": run_se, "hn": run_hn, "lemmy": run_lemmy, "discover-lemmy": discover_lemmy, "index": build_index}[a.cmd]
    try:
        fn(a)
    except Quit as e:
        print(f"\nStopped: {e}")
    if a.cmd != "index":
        build_index()


if __name__ == "__main__":
    main()

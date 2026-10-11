# .claude/

Project-local Claude Code setup for Parchemin. Nothing here is installed globally.

## Impeccable (design skill), pinned

| What | Value |
|---|---|
| Skill | Impeccable 4.5.2, Apache 2.0, by Paul Bakaus |
| Source | https://github.com/pbakaus/impeccable at tag `skill-v4.5.2` (commit `d631a8827f99414d2b6daba4ef08b7f8701751d7`) |
| Engine binary | `engine-v0.1.14`, `impeccable-linux-x64`, sha256 `3d31ec1a664ac35c815ea1d7c10abad1155ce364d0f461157eb837a34368efb6` |
| Installed on | 2026-10-10 |
| Use | `/impeccable <command>` in Claude Code, for the website and the mockups under `design/`. See `skills/impeccable/SKILL.md` |

**How it was installed.** The project-local copy (`.claude/skills/impeccable`, `.claude/agents/impeccable-*.md`) was copied from the
tag's tree, not through `npx impeccable install` or the plugin marketplace, so nothing can update it behind our backs. The engine
binary was downloaded from the GitHub release, checked against its `.sha256` sidecar, and placed at
`skills/impeccable/scripts/bin/linux-x64/impeccable`, which is the first place the launcher looks. That folder is git-ignored
because the binary is 20 MB; on a new machine, either copy it there again (verify the checksum above) or let the launcher fetch
the same pinned version once, which it also verifies against the sidecar.

**What is switched off, and where.**

- *Telemetry.* The only telemetry in the engine is a ping that reports which concept card was chosen in the "roll" feature. It is
  off through `IMPECCABLE_NO_TELEMETRY=1` and `DO_NOT_TRACK=1`, set in `settings.json` under `env` and again inline on each hook.
- *Update check.* The engine would otherwise ask impeccable.style for the latest version once a day and tell Claude to suggest an
  update. It is off through `IMPECCABLE_NO_UPDATE_CHECK=1` (same places) and `"updateCheck": false` in `../.impeccable/config.json`.
- *Auto-update.* There is none to switch off: the launcher runs the binary beside it and only ever downloads the version named in
  `scripts/VERSION`. Updating is a deliberate act: check out a newer tag, copy the files again, and update this table.

**What still uses the network, only when you use it.**

- `/impeccable` new work can "roll" concept cards from `https://impeccable.style/api/roll`. That is a feature request, not
  tracking, and it falls back to local data when offline. To keep it fully offline, set `IMPECCABLE_API_URL` to an unreachable
  address in `settings.json`.
- The asset producer can call an image API if you configure one. Nothing is configured.
- The "live" browser picker runs a server on `localhost:8400` and talks only to it.

**Hooks.** `settings.json` runs the detector after every Edit or Write on UI files and a deeper pass on Stop. Hooks run without
asking, so review `settings.json` before trusting a copy of this repo you did not make. To silence them for one run:
`claude --settings '{"disableAllHooks": true}'`. To turn them off for good, set `"hook": {"enabled": false}` in
`../.impeccable/config.json`.

**Engine state** lives in `../.impeccable/`: `config.json` is shared, `config.local.json`, `hook.cache.json`, `build/` and the
`live/` scratch files are machine-local and git-ignored.

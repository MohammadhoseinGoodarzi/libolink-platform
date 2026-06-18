# Engineering Log

A running, append-only record of **notable problems and how we resolved them** — non-obvious
bugs, environment/tooling gotchas, and the reasoning behind structural decisions. The goal is
that nobody debugs the same thing twice.

**Format:** newest entry on top. Each entry: date · title · *Symptom* → *Root cause* → *Fix* →
*Prevention*. Keep it concise; link to commits/PRs where useful.

---

## 2026-06-17 — `biome check .` fails on ~105 untouched files (CRLF) after merge + pull

**Symptom.** Right after merging `feat/mobile-shell` → `dev` and running `git pull` + `pnpm i`
on Windows, `pnpm lint` (Biome) reported ~105 formatting errors on files nobody had edited.
The sample diffs were pure line-ending changes (`␍` → removed). Type-check was green; only
Biome failed.

**Root cause.** The repo had **no `.gitattributes`**, and the contributor's Git was set to
`core.autocrlf=true`. The committed blobs are LF, but with that combo Git rewrites files to
**CRLF in the working tree on checkout**. Biome's formatter expects **LF**, so it flagged
every CRLF file. The breakage appeared only after the round-trip through GitHub (merge → fresh
checkout) re-applied the CRLF conversion; it was invisible during the original session because
those files were authored as LF and never re-checked-out.

**Why LF (not CRLF).** Cross-platform JS/TS monorepos standardize on LF: Biome defaults to LF,
Git stores LF, and a single line-ending avoids spurious whole-file diffs and lint failures
between macOS/Linux/Windows/CI. LF in the repo **and** LF on checkout everywhere is the only
self-consistent state.

**Fix.** Added a root `.gitattributes`:

```gitattributes
* text=auto eol=lf
# + explicit `binary` for png/jpg/gif/webp/ico/ttf/otf/woff/woff2
```

This forces Git to check out LF on every platform regardless of `core.autocrlf`. The working
tree's stray CRLF files were converted back to LF — **no content/blob change** (the blobs were
already LF), so there was no normalization churn in history. (Note: after converting mtimes,
`git status` can briefly show files as modified due to a stale stat cache even though
`git diff` is empty and `git add --renormalize .` stages nothing — that's cosmetic.)

**Prevention.** `.gitattributes` is committed, so future checkouts stay LF on all platforms and
CI. Documented as a rule in `CLAUDE.md` (Linting). Do not delete `.gitattributes`. On Windows,
`core.autocrlf=false` is also fine but no longer required.

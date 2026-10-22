# dciweb

DeCorte Industries website. Astro + TypeScript + Tailwind CSS, optional Sanity CMS, deployed via Cloudflare (wrangler).

## Conventions

# Global Agent Conventions

Applies to every repo unless a repo-specific note in `AGENTS.md` overrides it. Kept short on purpose — Codex truncates `AGENTS.md` at 32 KiB, so detail belongs in the language-specific docs, not here.

- Match the existing code style and structure in the repo rather than introducing new patterns.
- Ask before large refactors, schema/migration changes, or anything that touches production data or real money/trading capital.
- Never commit `.env` or other secrets. Keep `.env.example` current when adding new config.
- Run the project's test suite before considering work done; don't leave it broken.
- Prefer small, reviewable commits with clear messages over large batched ones.
- If a change conflicts with something documented in the repo's own README/SPEC, the repo's own docs win — flag the conflict rather than silently picking one.

# Node / TypeScript Conventions

Thin first pass, based on `dciweb` — the only Node repo onboarded so far. Refine as more repos join.

- `npm` for package management (repo uses `package-lock.json`).
- TypeScript for anything beyond trivial scripting.
- Framework/deploy tooling is repo-specific (e.g. `dciweb` is Astro + Tailwind, deployed via Cloudflare/`wrangler`) — see the repo's own `AGENTS.md` for specifics rather than assuming one stack across all Node repos.

---
_Generated 2026-09-17 by sync_agents.py from the SecondBrain vault's ProjectOS/06 Standards/. Edit the source docs there, not this file, unless the change is genuinely repo-specific._

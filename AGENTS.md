# AGENTS.md

This repository follows global agent policy files:
- `~/.codex/AGENTS.md`
- `~/.claude/CLAUDE.md`

## Repo-specific guidance
- Default objective: deliver production-ready increments, not placeholder scaffolding.
- Keep `IMPLEMENTATION_PLAN.md` and `progress.txt` synchronized whenever scope changes.
- Prefer small PR-sized increments mapped to a single `progress.txt` item.

<!-- convex-ai-start -->
This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read `convex/_generated/ai/guidelines.md` first** for important guidelines on how to correctly use Convex APIs and patterns. The file contains rules that override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running `npx convex ai-files install`.
<!-- convex-ai-end -->

---
name: "Prepare Commit"
description: "Review the current working tree, check required docs per the workspace doc standard, and draft a clean commit message. Use before any commit."
argument-hint: "scope of current change"
agent: "agent"
---

Prepare the active repo for a clean commit.

## Gate: confirm the target repo

This workspace is multi-root. Confirm which repo the changes belong to before any git action. If changes span multiple repos, handle each repo separately — never one mixed commit.

## Tasks

1. `git status` + `git diff HEAD` in the confirmed repo — inspect the full change set
2. **Mixed-concerns checklist** — split into separate commits if the change set mixes:
   - [ ] unrelated features
   - [ ] code + unrelated docs
   - [ ] generated/dependency files with source
   - [ ] secrets or `.env` files (STOP — must be gitignored, never committed; verify with `git check-ignore`)
3. **Docs check per the workspace doc standard** (`16-loading-bay/01-workspace/STANDARD-DOCS.md`): probe for the repo's standard docs (README, PRD, plans, build-notes, agent instructions) in their standard locations (`project-info/`, `.github/`, root). If required updates are missing, list them — do not invent content. If the repo has no standard docs, say so rather than fabricating.
4. Propose the best commit message using the repo's format (check CONTRIBUTING.md or git log for the convention)
5. Call out the narrowest remaining validation step if one is still missing (ordered: narrow test → build → browser check → ask user)

## Rules

- Do not create the commit unless explicitly asked
- **Anti-pattern — mixed repos:** committing across multiple repos in one pass. Stop and handle each separately.
- **Anti-pattern — inventing docs:** if a required doc is missing, report the gap; do not draft it unless asked.

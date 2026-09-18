---
name: "Write Build Note"
description: "Create or update a build note after non-trivial implementation work — shipped scope, decisions, validation, follow-up. Skips itself for trivial changes."
argument-hint: "feature name and what changed"
agent: "agent"
---

Write or update the build note for the requested work.

## Locate the build-notes home (probe, don't guess)

Check, in order: `project-info/build-notes/` → `BUILD_NOTES.md` → repo root convention. Use what exists. If the repo has a build-note template, follow it; otherwise generate the standard section structure below.

## Tasks

1. Create or update the correct file (dated, e.g. `2026-09-17-<slug>.md`) in the located home
2. Record, as sections:
   - **Shipped scope** — what actually changed
   - **Implementation decisions** — with tradeoffs and the losing alternative on record
   - **Deferred** — what was intentionally left out
   - **Validation** — what was run and what it proved (narrowest check first)
   - **Follow-up** — durable changes that still need promotion into the PRD or docs
3. Update the build-notes index (`_index.md`) if one exists; if not, note that the repo has none
4. Call out any durable product change that still needs promoting into the PRD

## Rules

- If the change is trivial, say so and explain why a build note is not needed
- **Anti-pattern — retroactive guessing:** do not reconstruct history you don't have evidence for; write what is verifiable from the working tree and session

---
name: "Commands"
description: "Router for the workspace command system — the flow, what each command does, and when NOT to use it. Use when unsure which command applies."
argument-hint: "[what are you trying to do]"
agent: "agent"
---

# Workspace Command Router

Tier-1 commands are installed per-repo (`.github/prompts/`); canonicals live in `16-loading-bay/01-workspace/prompts/`. Tier-2 commands are project-local and take precedence for project-specific workflows.

## The flow

```
/project-start ──▶ /prd ──▶ /log-decision ──▶ (implement) ──▶ /write-build-note ──▶ /prepare-commit ──▶ /session-wrap-up
      │                │            │                              │
      └── /bridge ─────┴────────────┴── claim/release at every gate  └── /project-map after any project change
```

## Commands and when NOT to use them

| Command | Does | Do NOT use when |
|---|---|---|
| `/project-start` | 9-step protocol for new/resumed projects (folder sequencing, bridge, docs, git, ponytail) | the project already exists and just needs work — start working, don't re-run the protocol |
| `/prd` | scaffold/update PRD + PLAN + DECISIONS + RESEARCH | the docs exist and only need small updates — edit them directly |
| `/log-decision` | append a decision with the losing alternative on record | the decision is trivial with no real alternative |
| `/find-prior-work` | index-first search of the chat archive + map | you already know the chat ID or the answer |
| `/bridge` | check/claim/release inter-agent coordination | working alone in a repo nobody else touches (still claim if long work) |
| `/prepare-commit` | working-tree review, docs check, commit message | the change is trivial and you've already committed |
| `/write-build-note` | record shipped scope/decisions/validation | the change is trivial — say so instead |
| `/project-map` | verify/update the workspace map row | nothing about the project changed |
| `/ponytail-install` | install the ruleset into a project | the project already has the marker block |
| `/session-wrap-up` | close a session: log, index, commits | mid-session — use it at the end |
| `/ponytail-review` (Tier-2, where installed) | over-engineering review of a diff | non-code changes |

## Anti-patterns (workspace-wide)

- **Broad grep of chats/** before the index — use `/find-prior-work`
- **Committing across mixed repos** — use `/prepare-commit`'s gate
- **Acting on stale bridge claims** — use `/bridge`'s staleness check
- **Inventing doc content** — mark inferred, ask the user
- **Skipping the index refresh** at session end — use `/session-wrap-up`

## Tier-2 note

Project-local commands (e.g. 07-wp's feature-loop set, 04-garden-neue's doctrine commands) govern their own repos' specific workflows. When a Tier-2 command overlaps a Tier-1 one, the Tier-2 version wins for that repo.

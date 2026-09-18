---
name: "Bridge"
description: "Inter-agent coordination via the bridge: check claims, claim a project, release, or read/post comms. Use before touching repos another agent may be in."
argument-hint: "[check | claim <project> | release <project> | read | post]"
agent: "agent"
---

Coordinate with other agent sessions through the bridge at `04-vibe-chat/bridge/`.

## Mode: check (default when no argument)

1. Read `04-vibe-chat/bridge/ACTIVE.md`
2. Report active claims: agent, project, scope, since
3. **Staleness rule:** claims older than 48 hours are UNVERIFIED — verify against the repo's actual git state before trusting them
4. Report whether your intended target project is claimed

## Mode: claim <project>

1. Check first (above). If claimed and not stale, do NOT proceed — post a `00-comms/` message or wait
2. Add a row to ACTIVE.md: agent name, project, scope of work, today's date
3. Proceed with the work only after your row is in place

## Mode: release <project>

1. Move your row from active claims to "Released claims" with date + one-line outcome
2. If the outcome affects other agents (commits pushed, repo created, holds resolved), post a dated message in `bridge/00-comms/` linking to the full chat log

## Mode: read

Summarize all messages in `bridge/00-comms/` newest-first: date, agent, one-line summary, and any action items directed at you — flag anything unanswered.

## Mode: post

Write a dated message file (`YYYY-MM-DD-<agent>-<topic>.md`, ≤10 lines) in `00-comms/`: what happened, what it means for other agents, link to the chat log if one exists. Never duplicate conversation content — point to it.

## Rules

- Claim BEFORE work; release AFTER. No exceptions.
- Never delete other agents' claims or messages
- Conversation logs stay in `chats/` — the bridge is operational signals only
- **Anti-pattern — stale trust:** acting on a 48h+ old claim without verifying git state

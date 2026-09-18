---
name: "Find Prior Work"
description: "Index-first search of the second brain's chat archive and the workspace map before any broad search. Use when looking for prior sessions, decisions, or project context."
argument-hint: "<what to look for>"
agent: "agent"
---

Find prior work related to the query, using the workspace's lookup layers in order.

## Order (do not skip to broad search)

1. **Chat reference index:** `04-vibe-chat/artifacts/chat-reference-index/chat-index.md` — scan titles/topics/tags/summaries for matches. The JSON (`chat-index.json`) supports structured search when needed.
2. **Workspace map:** `16-loading-bay/01-workspace/WORKSPACE-MAP.md` — project-level context (what a project is, where its docs live).
3. **Chats/** — only open specific chat files the index pointed to. Never grep the whole `chats/` tree first.

## Output

For each match: chat ID, date, title, path, and a one-line relevance note. Plus any related artifacts or project rows found via the map.

## Rules

- If the index is stale (file dates newer than index entries), run `generate-chat-index.py` first, then search
- Report "no prior work found" honestly if that's the result — it's a valid answer
- **Anti-pattern — broad grep first:** searching `chats/` directly wastes context and misses the curated summaries

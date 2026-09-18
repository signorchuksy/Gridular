---
name: "Session Wrap Up"
description: "Close a session: update the chat log, refresh the chat index, check pending commits, suggest a commit message. Use at the end of any working session."
argument-hint: "[session summary in one line]"
agent: "agent"
---

Close out the current session and leave the record clean.

## Chat log (if this session has one in `04-vibe-chat/chats/`)

1. Update frontmatter: `date_updated`, `status` (completed if the work is done; active if continuing elsewhere), refine `summary` to match what actually happened
2. Verify the conversation log captures the session's key exchanges and decisions — fill gaps while memory is fresh
3. Verify Key Decisions and Action Items sections reflect reality
4. **Validation checklist:**
   - [ ] unique 5-digit ID, no duplicates (00523 lesson)
   - [ ] frontmatter complete (title, dates, agents, topic, tags, artifacts, summary)
   - [ ] artifacts listed exist at the paths given

## Index

5. Run `04-vibe-chat/artifacts/chat-reference-index/generate-chat-index.py` and verify the output changed (this chat appears with its updated summary)

## Pending commits

6. Check the active repo (confirm which repo — multi-root rule): `git status --porcelain` + drift vs upstream
7. Suggest a commit message per repo convention; commit + push only if asked

## Rules

- Never invent conversation content when filling gaps — mark uncertain items
- **Anti-pattern — stale index:** finishing without regenerating the chat index (the most-forgotten step in this workspace's history)

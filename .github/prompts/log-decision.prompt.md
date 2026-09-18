---
name: "Log Decision"
description: "Append a dated decision entry to the project's DECISIONS.md — options considered, the losing alternative on record, what it blocks. Use for any contested or directional decision."
argument-hint: "<decision made> | <alternatives rejected>"
agent: "agent"
---

Append the decision to the project's decision log.

## Locate the log (probe, don't guess)

`DECISIONS.md` at repo root → `project-info/` → create one from the standard template if absent (numbered rows, both-sides format).

## The entry

| # | Decision | Status | Session/Date | Notes |
|---|---|---|---|---|
| N+1 | <what was decided> | ✅ RESOLVED / 🟡 OPEN | <where> | <context, evidence, what it blocks> |

Plus, for contested decisions, the **losing alternative on record** — what was rejected and why, in one line. Future agents need to know what was already tried.

## Rules

- Append-only. Never renumber, rewrite, or delete existing rows — supersede with a new row that references the old number
- Open decisions list what they block at the bottom of the file
- Refusal: "Do not log trivial decisions with no real alternative — noise buries signal"
- **Anti-pattern — decision amnesia:** making a directional call without recording it; the next agent will relitigate it

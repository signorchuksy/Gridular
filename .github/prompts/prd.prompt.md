---
name: "PRD"
description: "Scaffold or update the standard planning doc set — PRD, PLAN, DECISIONS, RESEARCH — per the workspace doc standard. Use when starting a project or re-scoping one."
argument-hint: "[project or feature name]"
agent: "agent"
---

Scaffold or update the standard planning set for the named project/feature.

## Probe first

Check what already exists (in `project-info/`, root, or the repo's own convention):
- PRD exists → **update additively**, never rewrite (respect user intent)
- DECISIONS.md exists → append new entries, keep the existing numbering
- Nothing exists → scaffold from the templates below

## The doc set (per STANDARD-DOCS, sized proportionally)

### PRD.md
Goal · Problem · Users · Product frame (**what it is AND what it refuses to be**) · Requirements · Non-goals. Mark inferred items as inferred.

### PLAN.md
Milestones with **exit criteria per milestone**. Scope stated three ways: known / not-yet-specified / out of scope.

### DECISIONS.md
Numbered rows: decision · status (resolved/open) · session · **losing alternative on record** · what it blocks. Open items listed at the bottom.

### RESEARCH.md
Evidence tiers: **Observed** (seen directly) · **Confirmed** (explicit/proven) · **Inferred** (needs confirmation) · **Unknown**.

## Rules

- No code before the plan is approved (plan gate)
- Mark invented/placeholder content as such — never present it as sourced
- **Anti-pattern — template theater:** filling sections with filler to look complete. Empty section with a one-line "unknown — needs user input" is better than invented content.

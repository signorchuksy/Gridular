---
name: "Project Map"
description: "Verify and update a project's row in the workspace WORKSPACE-MAP — repo links, docs, instructions, risks. Use after any project change or for periodic link checks."
argument-hint: "[project name]"
agent: "agent"
---

Verify and update the project's row in `16-loading-bay/01-workspace/WORKSPACE-MAP.md`.

## Steps

1. **Probe actual state — never trust the map's current row:**
   - `git -C <project> remote get-url origin` → compare against the map's repo link
   - `git status --porcelain | wc -l` → dirty count
   - `git rev-list --left-right --count @{u}...HEAD` → drift
   - Check docs exist where the map claims they do; check agent instructions exist
2. **Update the row** to match verified reality: repo link, docs, instructions, watch-outs
3. **Link integrity rules:**
   - Renamed/transferred repo → update the map link in the SAME commit as the change
   - 404 on a repo → mark `⚠️ link broken`; never guess the new URL — verify via `gh repo view` or ask the user
4. **Risk lines:** update the numbered Known Risks section if this project's state affects them (e.g. dirty count, no-git, no-remote)
5. Status tiers are fixed: Active / Archived / Inactive (three special-cased items) / Reference. Moving projects between tiers requires explicit user instruction.

## Rules

- Probe first, edit second — the map is facts-as-of-last-probe, not assumptions
- Additive edits; never delete another project's row
- **Anti-pattern — stale map:** recording what should be true instead of what you probed

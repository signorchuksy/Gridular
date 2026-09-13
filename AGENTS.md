# AGENTS.md — 17-gridular

## What This Is

**Gridular** — a no-build browser tool combining the Figma Layout guide tool with
gridcalculator.dk: live grid overlays (uniform grid, columns, rows) with Figma's
mode rules, plus CSS/token output.

## Read Order

1. `README.md` — scope and status
2. `PLAN.md` — product frame, architecture, phased build, decision record
3. `phases/` — the per-phase plan for whatever phase is active
4. `RESEARCH.md` — evidence-grounded analysis of both references

## Housekeeping

- **No-build:** plain HTML/CSS/vanilla JS. No frameworks, no tooling, no deps.
- **Phased build:** one phase at a time. Write the phase plan before the code;
  record results in the phase file when done. No phase starts before the previous
  one's exit criteria pass.
- **Engine stays pure:** `grid.js` must not touch the DOM. It is the part that
  will be reused by the deferred Figma plugin.
- **Evidence before interpretation:** Figma mode rules are confirmed from Figma's
  docs (`RESEARCH.md §1a-ii`), not inferred. Don't guess type/spacing values.
- **Deferred:** the Figma plugin is out of scope until the web app is complete.
- Workspace map: `../16-loading-bay/01-workspace/WORKSPACE-MAP.md`
- Agent bridge: `../04-vibe-chat/bridge/ACTIVE.md` — check before starting work.

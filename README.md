# Gridular

A browser tool that combines the **Figma Layout guide** tool with
**gridcalculator.dk**: lay out a grid over a live preview — uniform grid,
columns, and rows, with Figma's mode rules — and get the numbers *and* the code
out.

## What it does

- **Three guide types:** uniform grid, columns, rows.
- **Figma's mode rules:** Stretch (derived size + margin + gutter) and fixed
  modes (given size + offset).
- **Breakpoint entry:** type your width, or pick a Tailwind preset.
- **Output:** CSS grid, `:root` custom properties, and a JSON token shape.

## Status

Phased build. See `PLAN.md` for the full plan and `phases/` for the per-phase
plans.

| Phase | Name | Status |
| ----- | ---- | ------ |
| 0 | Repo setup + scaffolding | in progress |
| 1 | Geometry engine + calculator parity | not started |
| 2 | Breakpoint entry | not started |
| 3 | Single guide, live preview | not started |
| 4 | Three guide types + stacking | not started |
| 5 | Colour + modes | not started |
| 6 | Output (CSS / tokens) | not started |
| 7 | Polish + docs | not started |

**Deferred:** the Figma plugin. It becomes its own project once the web app is
complete; `grid.js` stays pure so it can be reused then.

## Stack

No-build: plain HTML, CSS, and vanilla JavaScript. No frameworks, no tooling.
Open `index.html` in a browser.

## Docs

- `RESEARCH.md` — evidence-grounded analysis of both references.
- `PLAN.md` — product frame, architecture, phased build, decision record.
- `phases/` — one plan per phase, written before the code.

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

**Web app complete** (phases 0–7, 2026-09-13). See `PLAN.md` for the full plan,
`phases/` for the per-phase plans, and `BUILD_NOTES.md` for what was built.

| Phase | Name | Status |
| ----- | ---- | ------ |
| 0 | Repo setup + scaffolding | done |
| 1 | Geometry engine + calculator parity | done |
| 2 | Breakpoint entry | done |
| 3 | Single guide, live preview | done |
| 4 | Three guide types + stacking | done |
| 5 | Colour + modes | done |
| 6 | Output (CSS / tokens) | done |
| 7 | Polish + docs | done |

**Deferred:** the Figma plugin. It becomes its own project; `grid.js` stays pure
so it can be reused then.

## Stack

No-build: plain HTML, CSS, and vanilla JavaScript. No frameworks, no tooling.

## Run it

Open `index.html` in a browser. That's it — no server, no build step.

To run the engine checks, open `tests/engine-check.html`; it prints a pass/fail
summary (27 assertions).

## Files

| File | Role |
| ---- | ---- |
| `index.html` | Structure: top bar, guide list, stage, inspector, output |
| `styles.css` | Dark UI; all colours/spacing via custom properties |
| `app.js` | UI wiring, state, render loop |
| `grid.js` | **Pure** geometry engine (no DOM) — reusable by the future plugin |
| `breakpoints.js` | Tailwind presets + custom breakpoint entry |
| `export.js` | **Pure** CSS / custom-property / JSON emitters |
| `tests/engine-check.html` | Self-check page with 27 assertions |

## Docs

- `RESEARCH.md` — evidence-grounded analysis of both references.
- `PLAN.md` — product frame, architecture, phased build, decision record.
- `phases/` — one plan per phase, written before the code.
- `BUILD_NOTES.md` — what was built, bugs found, what was deferred.

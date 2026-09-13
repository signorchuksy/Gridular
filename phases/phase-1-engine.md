# Phase 1 — Geometry Engine + Calculator Parity

> Gridular · chat 00570 · written 2026-09-13 before execution.
> Parent plan: `../PLAN.md §4`. Depends on: Phase 0.

## Goal

Build `grid.js` — the pure, DOM-free geometry engine — and prove it matches
gridcalculator.dk's arithmetic and Figma's mode rules. This is the part every
later phase and the future Figma plugin depends on, so it is built and proven
first, in isolation.

## Scope

**In:** `grid.js` (pure functions), `tests/engine-check.html` (a self-check page
with assertions), the two open decisions below.

**Out:** any UI, any DOM, any styling. The engine must not touch `document`.

## Decisions to make and record here

1. **Fractional width rounding.** When `(span − 2·margin − (n−1)·gutter) / n` is
   not an integer, choose one rule (e.g. round to 2 decimals, or floor to whole
   px) and assert it. Record the choice and the reason.
2. **Offset origin.** Decide whether `offset` is measured from the frame edge or
   from the guide's own start. Record the choice.

## API

```js
// Stretch: derive track size from the span.
solveTracks({ span, count, gutter, margin, mode: "stretch" })
  -> { size, tracks: [{ start, end }], positions: [start, ...] }

// Fixed: size is given; offset positions the run from the chosen edge.
solveTracks({ span, count, gutter, margin, mode: "left"|"center"|"right",
              size, offset })
  -> { size, tracks: [{ start, end }], positions: [start, ...] }

// Uniform grid: square guides across the whole canvas.
gridGuides({ width, height, size })
  -> { vertical: [x, ...], horizontal: [y, ...] }
```

## Checks (the assertions in `tests/engine-check.html`)

Calculator parity — from `RESEARCH.md §1b`:

| span | count | gutter | margin | expected size |
| ---- | ----- | ------ | ------ | ------------- |
| 960  | 4     | 20     | 20     | 215           |
| 960  | 12    | 20     | 10     | 60            |
| 950  | 24    | 10     | 0      | 30            |
| 320  | 4     | 10     | 15     | 65            |

Mode rules:

- Stretch: `count` tracks, `count − 1` gutters, margins at both ends; total
  equals the span.
- Fixed: track size equals the given `size`; offset shifts the run; no margin or
  gutter applied.
- Uniform grid: `floor(width / size)` vertical lines, `floor(height / size)`
  horizontal lines.

## Exit criteria

All assertions pass in the browser; the two decisions are recorded above; the
engine file contains no DOM references.

## Results

(filled during execution)

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

1. **Fractional width rounding.** **Decided:** the engine keeps full precision
   internally (tracks always sum to the span exactly); `round2()` is applied only
   at display/export time. Reason: rounding inside the solver would make tracks
   drift from the span and break the "total equals span" invariant. Asserted by
   the `stretch last end = span - margin` check.
2. **Offset origin.** **Confirmed from Figma's docs, not guessed:** offset is
   measured **from the chosen frame edge**. Figma's own example — "a Row layout
   guide set to Bottom with an offset of 16, the first row will begin 16px from
   the bottom of the frame" — settles it. Asserted by the
   `fixed bottom offset from bottom edge` check (span 800, size 100, offset 16 →
   end 784).

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

**Done 2026-09-13.**

- `grid.js` written as a **plain script** (not an ES module) exposing
  `window.Gridular`, so `index.html` works over `file://` with no server. This is
  a deliberate no-build choice; the engine is still pure and DOM-free.
- `tests/engine-check.html` written with 23 assertions.
- **All 23 pass** (verified in the browser): 4 calculator-parity cases, stretch
  structure, all fixed modes (left/right/top/bottom/center), offset from the
  chosen edge, uniform grid, and edge cases (count 1, count 0 clamps to 1, size 0).
- Both decisions recorded above (full-precision internally; offset from the frame
  edge, confirmed from Figma's docs).

**Exit criteria met:** all assertions pass; decisions recorded; `grid.js` contains
no DOM references.

# Phase 3 — Single Guide, Live Preview

> Gridular · chat 00570 · written 2026-09-13 before execution.
> Parent plan: `../PLAN.md §4`. Depends on: Phase 2.

## Goal

Render one columns guide over the preview stage and wire every input to it live.
This is the first phase where the tool becomes usable.

## Scope

**In:** the preview stage, one columns guide, the inspector fields for it
(Count, Mode, Width, Offset, Margin, Gutter), live re-render on input.

**Out:** multiple guides (Phase 4), colour/opacity (Phase 5), output (Phase 6).

## Behaviour

- The preview stage is the breakpoint width, centred, with a visible boundary.
- The columns guide renders as translucent bands using `grid.js`.
- Stretch mode shows Count / Margin / Gutter; Width and Offset are disabled.
- Fixed modes show Count / Width / Offset; Margin and Gutter are disabled.
- Every change re-renders immediately — no submit button, no reload.

## Checks

- With `960 / 4 / 20 / 20` in Stretch, four 215px bands render with 20px gutters
  and 20px margins, totalling 960.
- Switching to `left` with width 200 renders four 200px bands from the left edge.
- Changing Count from 4 to 5 updates the overlay without a reload.
- Disabled fields are visibly disabled and cannot be edited.

## Exit criteria

One columns guide renders correctly in both mode families, and every input
updates the overlay live.

## Results

(filled during execution)

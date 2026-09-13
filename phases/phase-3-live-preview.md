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

**Done 2026-09-13.**

- `index.html` restructured: workspace split into the stage (with an `.overlay`
  layer) and the inspector card (type label top-left, × top-right, divider).
- `styles.css`: workspace layout, guide bands, inspector, readout.
- `app.js`: guide state, `setState`/`updateGuide`, overlay rendering, inspector
  field builders (number + select), hex→rgba helper, and the calculator readout.

**Bug found and fixed during verification:** the engine was applying `gutter` in
fixed and center modes, but Figma's docs say **Gutter and Margin are
Stretch-only**. Fixed in `grid.js` (both are now ignored outside stretch mode) and
covered by 4 new assertions in `tests/engine-check.html` — now **27/27 pass**.

**Checks run in the browser (all pass):**

- Stretch `900 / 4 / 20 / 20` → 4 bands, first at 20px/200px, last at 680px.
- Count 4 → 5 → 5 bands, column width 156px, live with no reload.
- Left mode → Width/Offset enabled, Margin/Gutter disabled; 5×200 from the left
  edge, last at 800px (no gutter applied).
- Center mode → Offset disabled; 5×200 in a 900 span starts at −50px (centred).
- Right mode → last band ends at 900px.
- Back to Stretch → Margin/Gutter re-enabled, Width disabled.
- Stage is scrollable (not clipped) when wider than the viewport.

**Exit criteria met:** one columns guide renders correctly in both mode families;
every input updates the overlay live.

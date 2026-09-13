# Phase 8 — Even-Division Warning + Snap to Whole Pixels

> Gridular · chat 00570 · written 2026-09-13 before execution.
> Parent plan: `../PLAN.md §4` (refinement pass after phases 0–7).
> Depends on: phases 0–7 (complete).

## Goal

Surface when a grid does not divide the span evenly, and optionally snap the
geometry to whole pixels — matching the behaviour verified on gridcalculator.dk
(2026-09-13, see chat log for the evidence).

## Verified reference behaviour (gridcalculator.dk)

With `970 / 4 / 20 / 20`:

- Raw column width = `(970 − 40 − 60) / 4 = 217.5`.
- The site **floors** the column width to 217 and **shrinks the page width** to
  what the floored tracks fill: `2·20 + 3·20 + 4·217 = 968`.
- The band renders at 968px, and the page-width number gets `class="warning"`
  (red) — confirmed in the site's own template:
  `<div class="metric">Page width: <b class="warning">968 px</b></div>`.

So the "warning" is a colour-coded state on the page-width number, not a text
message.

## Scope

**In:**

1. **Even-division warning** — when a stretch-mode guide's derived size is
   fractional, show a live warning in the readout:
   "Grid doesn't divide evenly — column width is 217.5px". It clears
   automatically when the values divide evenly. Computed from current state, so
   it updates as the user changes width/count/gutter/margin.

**Out (cut after user feedback):**

- **Snap-to-whole-px** — the user asked only for a notification; snapping added
  a stage-shrink decision and a toggle with no asked-for benefit. Cut. The
  verified calculator behaviour is recorded above for future reference.
- Stage-height control, rows/columns collision work — not requested in this
  pass; revisit later.

**Kept simple:** one warning line in the readout. No toggle, no mode, no new
state beyond a derived boolean.

## Engine changes (`grid.js`)

None required — the solver already returns the exact fractional size. The
warning is derived in the UI from `solved.size % 1 !== 0`.

## UI changes

- In the readout, when a stretch guide's derived size is fractional, show a
  warning line: "Grid doesn't divide evenly — column width is 217.5px"
  (or "Row height" for rows guides). Styled distinctly (amber/red).
- The warning is live: it appears/disappears as width, count, gutter, or margin
  change. No toggle, no persistence — purely derived.

## Open questions

None — resolved with the user (2026-09-13): notification only, no snapping.

## Checks

- `970 / 4 / 20 / 20` → warning visible, text contains "217.5".
- Change width to 960 → warning gone (215px, even).
- Rows guide with a fractional height → warning says "Row height".
- Fixed-mode guide → no warning (size is given, nothing derived).
- Even stretch case → no warning.

## Exit criteria

All checks pass; the warning appears exactly when a stretch guide's derived size
is fractional and clears when it is even; no new state or controls added.

## Results

**Done 2026-09-13.**

- `app.js`: the readout appends a `.readout__warn` line when a stretch guide's
  derived size is fractional (`solved.size % 1 !== 0`). Text:
  "Grid doesn't divide evenly — column width is 217.5px" (or "Row height" for
  rows guides). `role="status"` so it is announced to assistive tech.
- `styles.css`: `.readout__warn` in amber (`#f5b950`), 11px.
- No engine changes, no new state, no controls — purely derived, as scoped.

**Checks run in the browser (all pass):**

- `970 / 4 / 20 / 20` → warning shown with "217.5".
- Width changed to 960 → warning clears (215px, even).
- Rows guide, 7 rows / gutter 20 / margin 0 in a 480 stage → 51.43px, warning
  says "row height is 51.43px".
- Fixed mode (Top) → no warning.
- Rows even case (5 rows → 80px) → no warning.
- Columns even case (960/4/20/20 → 215px) → no warning.
- Screenshot confirms the amber warning renders under the readout.

**Exit criteria met:** the warning appears exactly when a stretch guide's derived
size is fractional and clears when it is even; no new state or controls added.

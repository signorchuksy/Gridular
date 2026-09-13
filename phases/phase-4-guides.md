# Phase 4 — Three Guide Types + Stacking

> Gridular · chat 00570 · written 2026-09-13 before execution.
> Parent plan: `../PLAN.md §4`. Depends on: Phase 3.

## Goal

Support all three guide types and let several coexist, mirroring Figma's guide
list: add, select, toggle visibility, remove.

## Scope

**In:** uniform grid + rows guides, the guide list UI, the floating inspector
card, add/select/toggle/remove, persistence of the whole guide set.

**Out:** colour/opacity controls (Phase 5), output (Phase 6).

## Behaviour

- The guide list shows each guide as a named row (`Grid 8px`, `5 columns`,
  `5 rows`) with an eye toggle and a remove control.
- `+` adds a guide; the new guide is selected.
- Selecting a guide opens its inspector card: type switcher top-left, close (×)
  top-right, a divider, then the fields.
- Uniform grid takes `Size`; columns take the Phase 3 fields; rows take the
  vertical equivalents (Height instead of Width).
- The whole guide set persists across reload.

## Checks

- Adding a grid, a columns guide, and a rows guide gives three coexisting
  overlays.
- Toggling one guide's eye hides only that guide.
- Removing a guide removes only that guide and its overlay.
- Reload restores all guides, their order, and their visibility.
- The inspector shows the fields for the selected guide's type only.

## Exit criteria

Three guide types coexist, each toggles and removes independently, and the full
set persists across reload.

## Results

**Done 2026-09-13.**

- `index.html`: added the guide-list panel (header + `+`, list) and made the
  inspector's type control a `<select>` (Grid / Columns / Rows).
- `styles.css`: guide list, selected state, eye/remove buttons, row bands
  (`.band--h`), grid lines (`.line--v` / `.line--h`).
- `app.js`: guide factories + `typeDefaults`, `guideLabel`, whole-set persistence
  (`gridular.state`), guide list rendering, multi-guide overlay rendering, and
  add/select/toggle/remove operations.

**Bug found and fixed during verification:** switching a guide's type via the
inspector changed `type` but did not add the new type's fields, so a guide
switched to `grid` had no `size` (rendered as "Grid undefinedpx" and drew no
lines). Fixed by extracting `typeDefaults(type)` and merging it on type change —
the same function now backs both creation and switching.

**Checks run in the browser (all pass):**

- Initial state: one `4 columns` guide.
- Add + switch to grid → `4 columns, Grid 8px`; grid lines render.
- Add + switch to rows → three guides; 9 bands (4 columns + 5 rows).
- Toggling the grid's eye → 0 lines, 9 bands unchanged (only that guide hides).
- Removing the rows guide → `4 columns, Grid 8px`; 4 bands.
- Reload → guides, order, and visibility all restored.
- Selecting the grid guide → type select shows `grid`, Size field present.

**Exit criteria met:** three guide types coexist, each toggles and removes
independently, and the full set persists across reload.

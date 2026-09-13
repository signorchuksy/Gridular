# Phase 5 — Colour + Modes

> Gridular · chat 00570 · written 2026-09-13 before execution.
> Parent plan: `../PLAN.md §4`. Depends on: Phase 4.

## Goal

Complete the guide controls: colour with opacity, and the full confirmed mode
sets with correct field availability per mode.

## Scope

**In:** hex colour input, opacity input, the complete mode sets, per-mode field
availability.

**Out:** output (Phase 6).

## Mode sets (confirmed from Figma docs — `RESEARCH.md §1a-ii`)

| Guide type | Modes                                |
| ---------- | ------------------------------------ |
| Columns    | `Left`, `Center`, `Right`, `Stretch` |
| Rows       | `Top`, `Center`, `Bottom`, `Stretch` |

## Field availability

| Field               | Stretch           | Left / Right / Top / Bottom | Center  |
| ------------------- | ----------------- | --------------------------- | ------- |
| Size (Width/Height) | disabled (`Auto`) | enabled                     | enabled |
| Offset              | hidden            | enabled                     | hidden  |
| Margin              | enabled           | hidden                      | hidden  |
| Gutter              | enabled           | hidden                      | hidden  |

## Behaviour

- Colour defaults to `#FF0000` at `10%` opacity (Figma's default).
- Opacity is a percentage input.
- Switching mode updates which fields are shown/enabled immediately.
- The overlay uses the guide's colour and opacity.

## Checks

- Default colour is `#FF0000` at 10%.
- Changing colour and opacity updates the overlay live.
- Selecting `Center` hides Offset; selecting `Left` shows it.
- Selecting `Stretch` disables Size and enables Margin + Gutter.
- Selecting a fixed mode enables Size and hides Margin + Gutter.
- Each mode renders visibly distinct geometry.

## Exit criteria

Colour and opacity work; every mode renders correctly; the inspector shows only
the fields valid for the active mode.

## Results

**Done 2026-09-13.**

- `app.js`: added `colorRow` (native colour swatch + hex text field, kept in
  sync) and an `Opacity` field; `numberRow` gained an optional `max`.
- `styles.css`: colour field, swatch, and hex input styling.
- Colour and opacity apply to **every** guide type (grid, columns, rows), placed
  above the type-specific fields.

**Bug found and fixed during verification:** an out-of-range opacity (150) was
rejected by the state but still displayed in the field, so the UI and state
disagreed. Changed `numberRow` to **clamp** to `max` (and write the clamped value
back to the field) instead of silently ignoring it.

**Checks run in the browser (all pass):**

- Default colour `rgba(255, 0, 0, 0.1)` (Figma's default).
- Hex `#00FF00` → overlay updates; swatch stays in sync.
- Opacity 50 → `rgba(0, 255, 0, 0.5)`; opacity 150 clamps to 100.
- Invalid hex (`zzz`) is ignored — the overlay keeps the last valid colour.
- Column modes: `stretch, left, center, right`; row modes:
  `stretch, top, center, bottom`.
- Field availability: Center disables Offset; Left enables Offset and disables
  Margin; Stretch enables Margin and disables Width.
- Colour is per-guide (the rows guide kept its own default red).

**Exit criteria met:** colour and opacity work; every mode renders correctly; the
inspector shows only the fields valid for the active mode.

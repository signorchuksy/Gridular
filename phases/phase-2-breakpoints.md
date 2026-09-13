# Phase 2 — Breakpoint Entry (Happy Path)

> Gridular · chat 00570 · written 2026-09-13 before execution.
> Parent plan: `../PLAN.md §4`. Depends on: Phase 1.

## Goal

Let the user set the canvas width by entering their breakpoint. Typing a width is
the happy path; Tailwind presets are a shortcut, not a requirement.

## Scope

**In:** `breakpoints.js` (presets + custom entry), the width input in
`index.html`, persistence to `localStorage`.

**Out:** guide rendering (Phase 3), multi-breakpoint comparison.

## Presets

| Name | Width |
| ---- | ----- |
| sm   | 640   |
| md   | 768   |
| lg   | 1024  |
| xl   | 1280  |
| 2xl  | 1536  |

Custom entry accepts any positive integer width.

## Behaviour

- The width input is the primary control and is focused on load.
- Choosing a preset fills the width input (it does not lock it).
- The active breakpoint is stored as `{ name, width, source }` where `source` is
  `"tailwind"` or `"custom"`.
- The value persists across reload via `localStorage`.

## Checks

- Typing `1024` sets the canvas width to 1024.
- Selecting `lg` fills the input with 1024 and marks source `tailwind`.
- Editing after selecting a preset marks source `custom`.
- Reload restores the last width.
- Invalid input (empty, 0, negative, non-numeric) is rejected without breaking
  the canvas.

## Exit criteria

Width entry works, presets fill it, custom entry persists across reload, and
invalid input is handled.

## Results

(filled during execution)

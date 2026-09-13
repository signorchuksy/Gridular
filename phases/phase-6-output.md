# Phase 6 — Output (CSS / Tokens)

> Gridular · chat 00570 · written 2026-09-13 before execution.
> Parent plan: `../PLAN.md §4`. Depends on: Phase 5.

## Goal

Emit usable code from the current state — the differentiator neither reference
provides.

## Scope

**In:** `export.js` with three emitters, a copy-to-clipboard control, and an
optional URL permalink.

**Out:** file downloads, Illustrator/PNG export.

## Emitters

1. **CSS grid snippet** — a `display: grid` rule with `grid-template-columns`,
   `gap`, and padding derived from the active columns guide.
2. **`:root` custom properties** — the raw numbers as variables
   (`--grid-columns`, `--grid-gutter`, `--grid-margin`, `--grid-column-width`).
3. **JSON token shape** — the same values as a small JSON object.

## Behaviour

- Output reflects the currently selected columns guide.
- Copy-to-clipboard gives visible confirmation.
- Optional: the whole state encodes into the URL hash so a layout can be shared.

## Checks

- The CSS snippet for `960 / 4 / 20 / 20` produces four equal columns with 20px
  gaps and 20px padding.
- Pasting the snippet into a scratch page reproduces the on-screen grid.
- The custom properties match the numbers shown in the calculator panel.
- The JSON is valid and round-trips through `JSON.parse`.
- Copy shows confirmation.

## Exit criteria

Copied CSS reproduces the on-screen grid in a scratch page; all three emitters
produce correct output.

## Results

(filled during execution)

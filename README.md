# Gridular

A browser tool that combines the **Figma Layout guide** tool with
**gridcalculator.dk**: lay out a grid over a live preview — uniform grid,
columns, and rows, with Figma's mode rules — and get the numbers _and_ the code
out.

## What it does

- **Three guide types:** uniform grid, columns, rows — stacked, each with its
  own visibility toggle.
- **Figma's mode rules:** Stretch (derived size + margin + gutter) and fixed
  modes (given size + offset). Field availability follows Figma: margin and
  gutter are Stretch-only; offset applies to left/right columns and top/bottom
  rows.
- **Breakpoint entry:** type your width (the happy path), or pick a Tailwind
  preset (`sm` 640 · `md` 768 · `lg` 1024 · `xl` 1280 · `2xl` 1536).
- **Calculator readout:** derived column/row width and page width, live.
- **Output:** CSS grid, `:root` custom properties, and a JSON token shape —
  copy-to-clipboard.
- **Colour + opacity:** per guide, defaulting to Figma's `#FF0000` @ 10%.

## Run it

Double-click **`serve.command`** — it starts a tiny local server and opens the
app in your browser. That's the recommended way.

Or from a terminal:

```sh
cd 17-gridular
python3 -m http.server 8734
# → http://localhost:8734/
```

Opening `index.html` directly (`file://`) works in some browsers but Chrome may
serve it unstyled — prefer the server.

To run the engine checks, open `tests/engine-check.html`; it prints a pass/fail
summary (27 assertions).

## How to use it

1. **Set the breakpoint** — type a width or click a preset. The stage resizes.
2. **Add a guide** with `+` in the Layout guide panel. It starts as a columns
   guide; switch its type in the inspector (Grid / Columns / Rows).
3. **Tune it** in the inspector — the fields shown depend on the mode:
   - **Stretch:** Count, Margin, Gutter (size is derived, shown in the readout).
   - **Fixed** (Left/Right/Top/Bottom): Count, Width/Height, Offset.
   - **Center:** Count, Width/Height.
4. **Colour / Opacity** apply per guide.
5. **Toggle visibility** with the ◉ button, or remove a guide with −.
6. **Copy the output** from the panel at the bottom — CSS, variables, or JSON.

## Files

| File                      | Role                                                              |
| ------------------------- | ----------------------------------------------------------------- |
| `index.html`              | Structure: top bar, guide list, stage, inspector, output          |
| `styles.css`              | Dark UI; all colours/spacing via custom properties                |
| `app.js`                  | UI wiring, state, render loop                                     |
| `grid.js`                 | **Pure** geometry engine (no DOM) — reusable by the future plugin |
| `breakpoints.js`          | Tailwind presets + custom breakpoint entry                        |
| `export.js`               | **Pure** CSS / custom-property / JSON emitters                    |
| `tests/engine-check.html` | Self-check page with 27 assertions                                |
| `serve.command`           | Double-click to serve + open the app                              |

## Status

**Web app complete** (phases 0–7, 2026-09-13). See `PLAN.md` for the full plan,
`phases/` for the per-phase plans, and `BUILD_NOTES.md` for what was built.

**Deferred:** the Figma plugin. It becomes its own project; `grid.js` stays pure
so it can be reused then.

**Known limitations:**

- The stage height is fixed at 480px; rows guides solve against that.
- Output derives from the columns guide only (no rows/grid output yet).
- State persists to `localStorage` only — no shareable URL yet.

## Docs

- `RESEARCH.md` — evidence-grounded analysis of both references.
- `PLAN.md` — product frame, architecture, phased build, decision record.
- `phases/` — one plan per phase, written before the code.
- `BUILD_NOTES.md` — what was built, bugs found, what was deferred.

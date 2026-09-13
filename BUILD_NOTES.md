# Build Notes — Gridular

Dated record of what was built, what was deferred, and what validation ran.
Written during the work, not after.

---

## 2026-09-13 — Phased build, phases 0–7

**Built:** the complete web app, in seven phases, each with its own plan in
`phases/` written before the code.

| Phase | Delivered |
| ----- | --------- |
| 0 | Repo scaffold, `.gitignore`, README, AGENTS.md, phase plans, workspace-map row |
| 1 | `grid.js` — pure geometry engine + 27-assertion self-check |
| 2 | `breakpoints.js` + app shell — width entry, Tailwind presets, persistence |
| 3 | Live columns guide, inspector, calculator readout |
| 4 | Three guide types, guide list (add/select/toggle/remove), whole-set persistence |
| 5 | Colour + opacity, full mode sets, per-mode field availability |
| 6 | `export.js` — CSS, custom properties, JSON; copy-to-clipboard |
| 7 | Responsive layout, keyboard nudging, edge states, docs |

**Architecture:** no-build (plain HTML/CSS/vanilla JS). Three pure modules —
`grid.js` (geometry), `breakpoints.js` (presets), `export.js` (emitters) — and
`app.js` for UI wiring. All state mutation funnels through one `setState`.

**Bugs found and fixed during verification** (each caught by a check, not by
inspection):

1. **Margin/gutter leaked into fixed modes.** The engine applied `gutter` in
   fixed and center modes, but Figma's docs say both are Stretch-only. Fixed in
   `grid.js`; 4 assertions added.
2. **Switching guide type lost the new type's fields.** A guide switched to
   `grid` had no `size` ("Grid undefinedpx", no lines drawn). Fixed by
   extracting `typeDefaults()` and merging it on type change.
3. **Out-of-range input disagreed with state.** Opacity 150 was rejected by the
   state but still shown in the field. Changed to clamp and write back.
4. **Re-render destroyed focus.** Rebuilding the inspector on every change
   dropped focus, breaking arrow-key nudging and multi-digit typing. Fixed with
   `captureFocus`/`restoreFocus` (label + caret).
5. **Negative derived width on a tiny canvas.** Clamped to 0 in the readout and
   the emitters.

**Validation:** 27 engine assertions pass in the browser; every phase's checks
were run in a real browser via Playwright and recorded in its phase file. The
Phase 6 round-trip applies the emitted CSS to a scratch element and measures
215px columns / 20px gap / 20px padding — matching the on-screen grid.

**Deferred (deliberately):**

- **Figma plugin** — out of scope for this build; `grid.js` stays pure so it can
  be reused when the plugin becomes its own project.
- Multi-breakpoint comparison, Illustrator/PNG export, layout-guide styles
  (named/reusable/copy-paste).
- URL permalink for sharing a layout.

**Known limitations:**

- The stage height is fixed at 480px; rows guides are solved against that, not a
  user-set height.
- The output panel derives from the selected columns guide (or the first one);
  it does not emit rows or grid guides.
- `localStorage` is the only persistence — no export/import of the whole state.

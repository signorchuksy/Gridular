# Phase 7 — Polish + Docs

> Gridular · chat 00570 · written 2026-09-13 before execution.
> Parent plan: `../PLAN.md §4`. Depends on: Phase 6.

## Goal

Make the tool pleasant and documented, and close out the build.

## Scope

**In:** responsive layout, keyboard entry, empty/edge states, README with a
live-demo path, build note, workspace-map update.

**Out:** new features. This phase fixes and finishes, it does not add.

## Work

- Responsive layout: the tool is usable at narrow widths (panels stack).
- Keyboard: tab order is sensible; number fields accept arrow-key nudging.
- Edge states: zero guides, a guide with count 1, a very small canvas.
- README: what it is, how to open it, the phase status, a live-demo path.
- Build note: what was built, what was deferred, what validation ran.
- Workspace map: update the Gridular row.

## Checks

- The tool is usable at 375px wide.
- Tab order follows the visual order.
- Zero-guide and count-1 states render without errors.
- README instructions work from a clean checkout.
- Build note exists and is dated.

## Exit criteria

Build note written during (not after) the work; workspace map updated; no
console errors in any edge state.

## Results

**Done 2026-09-13.**

- `styles.css`: responsive breakpoints — at ≤900px the workspace stacks
  (guides → stage → inspector) and at ≤560px the top bar and output header wrap.
- `app.js`: arrow-key nudging (1, or 10 with Shift) on number fields; negative
  derived widths clamped to 0 in the readout.
- `export.js`: negative derived widths clamped to 0.
- `README.md` rewritten with status, run instructions, and a file table.
- `BUILD_NOTES.md` written (during the work, not after).

**Bug found and fixed during verification:** rebuilding the inspector on every
change destroyed focus, which broke arrow-key nudging and multi-digit typing
(typing "12" produced "1"). Fixed with `captureFocus`/`restoreFocus`, which
remembers the focused field's `aria-label` and caret position across the rebuild.

**Checks run in the browser (all pass):**

- Arrow keys: Up → 5, Down → 4, Shift+Up → 14; focus retained after each nudge.
- Typing `12` yields `12`; focus retained while typing.
- Edge states: zero guides (list empty, inspector hidden, output shows a prompt,
  no bands); count 1 (one band, 920px in a 960 span with 20px margins); a 1px
  canvas renders without crashing and clamps the width to 0.
- Responsive: at 375px the workspace stacks and there is no horizontal overflow;
  at 823px (the panel's own width) all four regions remain visible and usable.
- Zero console errors in every state.

**Exit criteria met:** build note written during the work; workspace map updated;
no console errors in any edge state.

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

(filled during execution)

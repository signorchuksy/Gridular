# Gridular — Plan

> Chat 00570 · 2026-09-12 (updated 2026-09-13) · milestone plan.
> Decisions 1–4 locked by the user; decision 5 resolved from Figma's docs
> (see `RESEARCH.md §1a-ii`). Companion: `RESEARCH.md`.

---

## 0. Locked decisions

| #   | Decision       | Choice                                                                                                 |
| --- | -------------- | ------------------------------------------------------------------------------------------------------ |
| 1   | Output target  | **Web app only for now** — Figma plugin deferred until the web app is done                             |
| 2   | Stack          | **No-build** (HTML/CSS/vanilla JS)                                                                     |
| 3   | v1 scope       | **Single breakpoint**, with Tailwind presets + custom entry; happy path = user enters their breakpoint |
| 4   | Repo           | **Keep the name Gridular, reuse `signorchuksy/Gridular`**                                              |
| 5   | Mode semantics | **Resolved from Figma docs** — Stretch (derived size + margin + gutter) vs Fixed (given size + offset) |

---

## 1. Product frame

**What Gridular is:** a browser tool that lays out a grid over a live preview —
three guide types (uniform grid, columns, rows), Figma-style modes, colour and
opacity — with the calculator's numeric panel beside it, and **code output**
(CSS grid, custom properties, tokens) that neither reference produces.

**What Gridular is not (v1):**

- Not a page builder or a layout editor for real content.
- Not a multi-breakpoint design app in v1 — one breakpoint at a time. Breakpoint
  _presets_ (Tailwind) and custom entry exist, but only one is active at a time.
- Not a backend service — no accounts, no storage server; state lives in the URL
  (like the calculator's `#/maxWidth/columns/gutter/margin`) and local storage.
- Not a Figma plugin — **deferred**. The web app ships first and is the whole
  scope for now; the plugin is a later project that will reuse `grid.js` unchanged.

---

## 2. Stack options

| Option                                | Shape                                  | Pros                                                           | Cons                                      |
| ------------------------------------- | -------------------------------------- | -------------------------------------------------------------- | ----------------------------------------- |
| **A. No-build** (HTML/CSS/vanilla JS) | `index.html` + `styles.css` + `app.js` | Matches workspace bias; instant open; trivial to port; no deps | Manual DOM work; no type safety           |
| **B. Vite + TS**                      | bundle + dev server                    | Types on the geometry engine; HMR                              | Build step; heavier than this tool needs  |
| **C. Vite + React + TS**              | component UI                           | Scales to multi-guide + export panels                          | Framework weight for a single-screen tool |

**Recommendation: A** for v1, with the **geometry engine isolated in its own
module** (`grid.js`) with JSDoc types so it can be lifted into the Figma plugin
(and any future build stack) without a rewrite. Chosen because the tool is one
screen, the maths is the hard part, and the workspace repeatedly prefers
no-build until a plan justifies otherwise.

**Rejected:** B/C now (adds tooling before the model is proven); a Figma plugin
first (the web app is faster to use, share, and iterate on, and the plugin can
reuse the same engine once it is proven).

**Plugin follow-on (deferred):** the Figma plugin is a later project, not part of
this build. Because `grid.js` is pure and DOM-free, the plugin will import it
directly when the time comes; only the render layer differs (Figma canvas overlay
vs DOM). Nothing in the web app should block that, but nothing should be built
for it either.
The old repo's plugin-template README is the only inherited artifact — the
manifest and `code.ts` are written fresh.

---

## 3. Architecture (no-build shape)

```
17-gridular/
  index.html        # structure: guide list · preview stage · inspector · calc panel · output
  styles.css        # dark UI, CSS custom properties for all colours/spacing
  app.js            # UI wiring, state, render loop
  grid.js           # PURE geometry engine (no DOM) — shared with the Figma plugin
  breakpoints.js    # Tailwind presets + custom breakpoint entry
  export.js         # CSS / custom-property / token emitters
  README.md
  RESEARCH.md
  PLAN.md
  figma-plugin/     # M7 — manifest.json + code.ts/ui.html, imports grid.js
```

**Core state (single source of truth):**

```js
state = {
  breakpoint: { name: "lg", width: 1024, source: "tailwind" }, // one active
  canvas: { width, height },
  guides: [
    { id, type: "grid", visible, color, opacity, size },
    {
      id,
      type: "columns",
      visible,
      color,
      opacity,
      count,
      mode: "stretch", // stretch | left | center | right
      width, // fixed modes only
      offset, // left/right only
      margin, // stretch only
      gutter, // stretch only
    },
    {
      id,
      type: "rows",
      visible,
      color,
      opacity,
      count,
      mode: "stretch", // stretch | top | center | bottom
      height, // fixed modes only
      offset, // top/bottom only
      margin, // stretch only
      gutter, // stretch only
    },
  ],
  selectedGuideId,
}
```

**Engine contract (`grid.js`, pure):**

```
solveTracks({ span, count, gutter, margin, mode, size, offset })
  -> { tracks[], positions[] }        # stretch derives size; fixed uses size+offset
gridGuides({ width, height, size })   -> { vertical[], horizontal[] }
```

Everything renders from `state` → engine → DOM. No component reads the DOM for
data. This keeps the engine unit-testable in the browser and portable to the
Figma plugin.

---

## 4. Phased build

**Method:** one phase at a time. Each phase gets its own plan file in
`phases/` (`phase-N-<name>.md`) written **before** the code, containing: goal,
scope, files touched, the exact checks, and exit criteria. A phase is only
"done" when its checks pass and its results are recorded in the phase file.
No phase starts before the previous one's exit criteria are met.

| Phase | Name                                | Plan file                        | Status |
| ----- | ----------------------------------- | -------------------------------- | ------ |
| 0     | Repo setup + scaffolding            | `phases/phase-0-repo-setup.md`   | done   |
| 1     | Geometry engine + calculator parity | `phases/phase-1-engine.md`       | done   |
| 2     | Breakpoint entry (happy path)       | `phases/phase-2-breakpoints.md`  | done   |
| 3     | Single guide, live preview          | `phases/phase-3-live-preview.md` | done   |
| 4     | Three guide types + stacking        | `phases/phase-4-guides.md`       | done   |
| 5     | Colour + modes                      | `phases/phase-5-modes.md`        | done   |
| 6     | Output (CSS / tokens)               | `phases/phase-6-output.md`       | done   |
| 7     | Polish + docs                       | `phases/phase-7-polish.md`       | done   |

**Web app complete 2026-09-13.** See `BUILD_NOTES.md` for what was built, the
bugs found during verification, and what was deferred.

**Deferred (not in this build):** Figma plugin. It becomes its own project once
the web app is complete; `grid.js` stays pure so it can be reused then.

### Phase summaries

**Phase 0 — Repo setup + scaffolding.** `git init`, `.gitignore`, initial commit,
reuse the `signorchuksy/Gridular` remote, AGENTS.md stub, `phases/` folder,
workspace-map row.
_Exit:_ repo versioned and pushed; phase plans exist.

**Phase 1 — Geometry engine + calculator parity.** `grid.js` with the stretch
solver and the fixed-mode solver, plus a self-check page asserting parity.
_Exit:_ `960 / 4 / 20 / 20 → 215` and `960 / 12 / 20 / 10 → 60`-class checks pass
against `RESEARCH.md §1b`; rounding rule chosen and asserted; offset origin
decided and asserted.

**Phase 2 — Breakpoint entry (happy path).** `breakpoints.js`: Tailwind presets
(`sm 640`, `md 768`, `lg 1024`, `xl 1280`, `2xl 1536`) + custom width entry. Happy
path = the user types their breakpoint width.
_Exit:_ entering a width sets the canvas; a preset fills the width; custom entry
persists across reload.

**Phase 3 — Single guide, live preview.** One columns guide on a preview stage;
Count/Gutter/Margin live in Stretch; Width/Offset live in fixed modes.
_Exit:_ any input updates the overlay with no reload; both mode families render.

**Phase 4 — Three guide types + stacking.** Uniform grid / Columns / Rows, the
guide list with `+`, eye toggle, remove, select, and the floating inspector card
(type switcher top-left, × top-right, divider).
_Exit:_ ≥3 guides coexist, toggle independently, persist across reload.

**Phase 5 — Colour + modes.** Hex + opacity; columns `Left/Center/Right/Stretch`,
rows `Top/Center/Bottom/Stretch`, with correct field availability per mode
(Width/Height + Offset for fixed; Margin + Gutter for stretch only).
_Exit:_ each mode renders distinct, correct geometry; the inspector shows only
fields valid for the active mode.

**Phase 6 — Output.** `export.js`: CSS grid snippet, `:root` custom properties,
JSON token shape; copy-to-clipboard. Optional: URL permalink.
_Exit:_ copied CSS reproduces the on-screen grid in a scratch page.

**Phase 7 — Polish + docs.** Responsive UI, keyboard entry, README with a
live-demo path, build note.
_Exit:_ build note written during (not after) the work; workspace map updated.

**Phase 8 — Even-division warning** (done 2026-09-13). Live amber warning in the
readout when a stretch guide's derived size is fractional; clears automatically.
Snap-to-whole-px was considered and cut — notification only, per user decision.
_Plan:_ `phases/phase-8-even-division.md`.

### Phase queue — pending work (added 2026-09-13)

Refinements after the phase 0–7 build. One phase at a time; a phase plan is
written before its code.

| Phase | Name                        | What                                                                                | Status                           |
| ----- | --------------------------- | ----------------------------------------------------------------------------------- | -------------------------------- |
| 8     | Even-division warning       | Live warning when the grid doesn't divide evenly                                    | **done**                         |
| 9     | Stage height control        | User-set stage height (replaces hard-coded 480px); rows guides solve against it     | next                             |
| 10    | Rows/grid output emitters   | Output panel currently emits the columns guide only; add rows + uniform-grid output | queued                           |
| 11    | Shareable URL permalink     | Encode the whole state in the URL hash so a layout can be shared                    | queued                           |
| 12    | Layout-guide styles         | Named, reusable, copy/paste guide presets (mirrors a Figma feature)                 | queued                           |
| 13    | Multi-breakpoint comparison | View two breakpoints side by side                                                   | queued                           |
| 14    | Image export                | PNG-style export of the overlay (gridcalculator.dk offers AI/PS/PNG)                | queued                           |
| 15    | Figma plugin                | Separate project; reuses `grid.js` unchanged                                        | deferred until web app is "done" |

**Notes:**

- Phase 9 resolves the "sizing" request: the stage height is the missing
  control. Rows guides currently solve against a hard-coded 480px.
- The rows/columns "collision" question is still open — the user's meaning is
  unconfirmed. It may be visual (row bands and column bands overlap on the
  stage) or mathematical. Clarify before planning it; it may fold into phase 9
  or become its own phase.
- Phase 10 addresses the known limitation that output only derives from the
  columns guide.

**Optional later:** Illustrator/PNG-style export (phase 14), layout-guide styles
(phase 12), multi-breakpoint comparison (phase 13).

---

## 5. Risks

| Risk                                                | Mitigation                                                                   |
| --------------------------------------------------- | ---------------------------------------------------------------------------- |
| Fractional stretch column widths rounding           | Decide one rule in Phase 1, assert it, document it                           |
| Offset origin ambiguous (frame edge vs guide start) | Decide in Phase 1, assert it; small and local                                |
| No-build JS growing messy                           | Enforce the engine-is-pure rule; all mutation funnels through one `setState` |
| Scope creep into a design app                       | The "not" list in §1 is the guardrail                                        |
| Phase drift (building ahead of the plan)            | One phase at a time; no phase starts before the previous exit criteria pass  |

---

## 6. Decision record

| #   | Decision       | Status                                | Choice                                                                                 | Losing alternative (on record)                                                            |
| --- | -------------- | ------------------------------------- | -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| 1   | Output target  | **Resolved** (user, 2026-09-13)       | **Web app only for now**; Figma plugin deferred                                        | Plugin-first — rejected: slower to use/share/iterate                                      |
| 2   | Stack          | **Resolved** (user, 2026-09-13)       | No-build HTML/CSS/vanilla JS                                                           | Vite+TS / React+TS — rejected: tooling before the model is proven                         |
| 3   | v1 scope       | **Resolved** (user, 2026-09-13)       | Single breakpoint; Tailwind presets + custom entry; happy path = enter your breakpoint | Multi-breakpoint from the start — rejected: defers the core tool                          |
| 4   | Repo           | **Resolved** (user, 2026-09-13)       | Keep _Gridular_, reuse `signorchuksy/Gridular`                                         | Fresh private repo — rejected: the name and remote already exist                          |
| 5   | Mode semantics | **Resolved** (Figma docs, 2026-09-13) | Stretch = derived size + margin + gutter; Fixed = given size + offset                  | Earlier inference (margin on all types, leftover-as-offset) — **disproven** by Figma docs |

**Open (non-blocking, decided in Phase 1):** fractional-width rounding rule;
offset origin (frame edge vs guide start).

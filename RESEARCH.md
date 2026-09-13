# Gridular — Research

> Chat 00570 · 2026-09-12 · planning session, no code.
> Evidence tiers: **Observed** (seen directly) · **Confirmed** (explicit/user or
> proven) · **Inferred** (provisional, needs confirmation) · **Unknown**.

---

## 1. What the two references actually are

### 1a. Figma Layout guide tool — Observed

From the attached screenshots (Figma UI, dark theme) plus the standard Figma
layout-guide behaviour:

**Three guide types**, chosen from a segmented dropdown:

| Type        | Controls observed                                                                                           |
| ----------- | ----------------------------------------------------------------------------------------------------------- |
| **Grid**    | `Size` (8), `Color` (hex + opacity %)                                                                       |
| **Columns** | `Count` (5), `Color`, `Type` (Stretch), `Width` (Auto, disabled when Stretch), `Margin` (0), `Gutter` (20)  |
| **Rows**    | `Count` (5), `Color`, `Type` (Stretch), `Height` (Auto, disabled when Stretch), `Margin` (0), `Gutter` (20) |

**Alignment `Type` options** — Observed from the open select:
`Top`, `Bottom`, `Center`, `Stretch` (Stretch checked).

**Other observed behaviour:**

- Each guide is a named, saved item in a list (`Grid 8px`, `5 columns`,
  `5 rows`) with an eye (visibility) toggle and a remove (−) control.
- The list has a `+` to add a guide and a layout/toggle icon at the header.
- The guide's inspector panel is a floating card with a **type switcher at the
  top-left** (Grid ▾) and a **close (×) at the top-right**, over a divider, then
  the fields.
- Color is `#FF0000` at `10%` in all captured states.
- The guide overlays live on the canvas/selection; it is non-destructive and
  never changes the underlying design.

### 1a-ii. Figma docs — Confirmed (authoritative)

Source: Figma Help Center, "Create layout guides"
(`help.figma.com/hc/en-us/articles/360040450513`). Read 2026-09-13. This
**corrects** the earlier inference in this document.

- **Renamed:** "layout grid" → **"layout guide"** as of May 2025. It is a
  different feature from the auto-layout grid option.
- **Three types:** Uniform grid, Column, Row.
- **Uniform grid:** `Size` = pixel size of each square (e.g. 10pt grid → 10×10px
  squares). Plus `Color` + opacity.
- **Column types:** `Left`, `Center`, `Right`, `Stretch`.
  **Row types:** `Top`, `Center`, `Bottom`, `Stretch`.
- **Stretch** — width/height adapt when the frame is resized. The Width/Height
  field is **disabled and set to `Auto`**. Stretch is the **only** type with
  `Margin` and `Gutter`.
- **Fixed** (Left/Right/Top/Bottom/Center) — "determines the side of the frame in
  which the layout guide begins." E.g. a Right column begins at the right edge
  and works leftward.
- **Fixed types have `Width`/`Height`** (exact px) **and `Offset`** — the pixel
  position where columns/rows begin. **Offset is available for Left/Right columns
  and Top/Bottom rows only** (not Center).
- **`Margin` (Stretch only):** space between the columns/rows and the frame edge.
- **`Gutter` (Stretch only):** space between each column/row.
- **Default colour:** `#FF0000` at `10%` opacity — matches the screenshots.
- **Multiple guides per frame** can be combined; each toggles independently, and
  all can be toggled globally (`Shift G`).
- **Layout guide styles** exist — named, reusable, copy/pasteable across frames.

**Corrected model (supersedes the earlier inference):**

| Type                        | Size field        | Margin | Gutter | Offset |
| --------------------------- | ----------------- | ------ | ------ | ------ |
| Stretch                     | Auto (derived)    | ✅     | ✅     | ❌     |
| Left / Right / Top / Bottom | Width/Height (px) | ❌     | ❌     | ✅     |
| Center                      | Width/Height (px) | ❌     | ❌     | ❌     |

**Still Unknown:**

- Exact rounding rules when a derived (Stretch) column width is fractional.
- Whether `Offset` is measured from the frame edge or from the guide's own start.

### 1b. gridcalculator.dk — Observed

Read via a real browser session (the site is behind a WAF: HTTP 455 to non-browser
clients, and HTTPS has a cert-name mismatch → treat as untrusted input, no scripts
executed during inspection).

**Inputs:** `Max width: 960 px` · `Columns: 4 cols` · `Gutter width: 20 px` ·
`Margin width: 20 px`

**Outputs:** `Page width: 960 px` · `Column width: 215 px`

**Visual:** a horizontal band rendering `960 | 20 | 215 | 20 | 215 | 20 | 215 | 20 | 215 | 20`
(margin → gutter → column → gutter → … → gutter → margin), i.e. the full
row unfolded left to right.

**Presets:** `960.gs 12 col grid` (`#/960/12/20/10`), `Blueprint 24 col grid`
(`#/950/24/10/0`), `Custom 4 col iPhone grid` (`#/320/4/10/15`).

**Exports:** Adobe Illustrator, Adobe Photoshop, Other (PNG image).

**Confirmed math** — verified against the observed numbers:

```
content  = maxWidth − (2 × margin) − ((columns − 1) × gutter)
column   = content / columns
pageWidth = maxWidth            # margin is inside the max width
```

Check: `960 − 40 − 60 = 860`; `860 / 4 = 215` ✓ (matches the reported 215).

**Inferred:** `Max width` is the overall page box; margins sit _inside_ it. The
route format `#/maxWidth/columns/gutter/margin` is confirmed by the three preset
links above. **Unknown:** behaviour when `margin = 0` and when column width is
fractional (Blueprint uses margin 0).

---

## 2. Prior repo

`signorchuksy/Gridular` (GitHub) — **Observed**: contains exactly one file,
`README.md`, 1137 bytes, single commit `b399072` from ~7 years ago, whose content
is the stock Figma plugin TypeScript template readme. **Confirmed:** there is no
code, no `manifest.json`, no `code.ts`. It was a name reservation, not a
codebase.

`17-gridular/` (local) — **Observed**: empty, not a git repository.

**Implication:** nothing is inherited. We choose the stack fresh; the old repo is
only a name (and a hint that the original intent was a _Figma plugin_).

---

## 3. Overlap and gap analysis

| Concern              | Figma Layout guide        | gridcalculator.dk | Gridular should                 |
| -------------------- | ------------------------- | ----------------- | ------------------------------- |
| Guide types          | Grid / Columns / Rows     | Columns only      | support all three               |
| Derived column width | implicit (`Stretch`)      | explicit number   | show it live, always            |
| Alignment modes      | Top/Bottom/Center/Stretch | none              | keep Figma's 5 modes            |
| Colour + opacity     | yes                       | no                | yes                             |
| Multi-guide list     | yes (named, toggleable)   | no                | yes (the "+" stack)             |
| Numeric readout      | no                        | yes               | yes — the calculator panel      |
| Export               | no (Figma-only)           | AI / PS / PNG     | CSS + tokens (+ optional Figma) |
| Live drag/tune       | yes                       | yes (inputs)      | yes                             |

**The synthesis:** Figma gives the _interaction and overlay model_; the calculator
gives the _arithmetic and the numeric readout_. Gridular fuses them into one
canvas-overlay tool **that also emits code** — the part neither reference does.

---

## 4. The one real design tension

`Stretch` (Figma) and `Column width` (calculator) are two views of the same
number — and Figma's docs now settle how the two modes differ:

- **Stretch mode** = the calculator's behaviour. Column width is _derived_ from
  span + count + gutter + margin. Width/Height is `Auto`. Margin and Gutter are
  available **only** here.
- **Fixed modes** (Left/Center/Right, Top/Center/Bottom) = column width is
  _given_ in px, and `Offset` positions where the guide begins from the chosen
  edge. Margin and Gutter are **not** available.

So the engine is one solver with two directions:

```
# stretch: derive column width (calculator parity)
column = (span − 2·margin − (n−1)·gutter) / n

# fixed:   size is given; offset positions the run from the chosen edge
#          (Left/Right columns, Top/Bottom rows; Center has no offset)
```

**Confirmed:** the mode split above (Figma docs). **Unknown:** the exact
rounding rule for fractional stretch widths, and whether `Offset` is measured
from the frame edge or the guide start. Both are small, local decisions to make
and assert in M1 — not blockers.

---

## 5. Research conclusions

1. **Buildable, small, and no-build-friendly.** The whole tool is arithmetic +
   an overlay renderer. No backend.
2. **Gridular's differentiator is output** — CSS grid, custom properties, and
   design tokens. That is what elevates it above both references.
3. **Figma's mode split is now confirmed, not inferred** — Stretch (derived size,
   margin + gutter) vs Fixed (given size, offset). This is the interaction to
   keep verbatim.
4. **The calculator panel** (max width, columns, gutter, margin → column width)
   is the numeric spine, and should stay visible alongside the overlay.
5. **Resolved:** output target = web app first, Figma plugin second; stack =
   no-build; scope = single breakpoint with Tailwind presets + custom entry;
   repo = reuse `signorchuksy/Gridular`. Remaining small unknowns (rounding,
   offset origin) are M1 decisions, not blockers.

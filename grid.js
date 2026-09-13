/**
 * grid.js — Gridular geometry engine.
 *
 * PURE: no DOM, no globals read, no side effects. Every function takes plain
 * values and returns plain values. This is deliberate — the deferred Figma
 * plugin will reuse this file unchanged.
 *
 * Plain script (not an ES module) so the tool works when `index.html` is opened
 * directly over `file://` with no server. Exposes `window.Gridular`.
 *
 * Mode rules are confirmed from Figma's docs (see RESEARCH.md §1a-ii):
 *   - Stretch: size is derived; margin + gutter apply.
 *   - Fixed (left/right/top/bottom): size is given; offset positions the run
 *     from the chosen frame edge.
 *   - Center: size is given; the run is centred; no offset.
 */
(function (root) {
  "use strict";

  /**
   * Round to 2 decimals for display/export only. The engine keeps full precision
   * internally so tracks always sum to the span exactly.
   * @param {number} n
   * @returns {number}
   */
  function round2(n) {
    return Math.round(n * 100) / 100;
  }

  /**
   * Solve a run of tracks across a span.
   *
   * @param {object} opts
   * @param {number} opts.span    Available length (width for columns, height for rows).
   * @param {number} opts.count   Number of tracks (>= 1).
   * @param {number} [opts.gutter=0]  Gap between tracks (stretch only).
   * @param {number} [opts.margin=0]  Space at both ends (stretch only).
   * @param {"stretch"|"left"|"center"|"right"|"top"|"bottom"} [opts.mode="stretch"]
   * @param {number} [opts.size=0]    Track size (fixed modes only).
   * @param {number} [opts.offset=0]  Distance from the chosen frame edge (fixed
   *                                  left/right/top/bottom only; not center).
   * @returns {{ size: number, tracks: {start:number,end:number}[], positions: number[] }}
   */
  function solveTracks(opts) {
    var span = Number(opts.span) || 0;
    var count = Math.max(1, Math.floor(Number(opts.count) || 1));
    var mode = opts.mode || "stretch";
    var gutter = Number(opts.gutter) || 0;
    var margin = Number(opts.margin) || 0;
    var offset = Number(opts.offset) || 0;

    var tracks = [];
    var size;

    if (mode === "stretch") {
      // Calculator parity: size = (span − 2·margin − (n−1)·gutter) / n
      size = (span - 2 * margin - (count - 1) * gutter) / count;
      for (var i = 0; i < count; i++) {
        var start = margin + i * (size + gutter);
        tracks.push({ start: start, end: start + size });
      }
    } else if (mode === "center") {
      size = Number(opts.size) || 0;
      var total = count * size + (count - 1) * gutter;
      var start0 = (span - total) / 2;
      for (var j = 0; j < count; j++) {
        var s = start0 + j * (size + gutter);
        tracks.push({ start: s, end: s + size });
      }
    } else {
      // Fixed, edge-anchored: left / right / top / bottom.
      size = Number(opts.size) || 0;
      var fromEnd = mode === "right" || mode === "bottom";
      for (var k = 0; k < count; k++) {
        // k = 0 is the track nearest the chosen edge.
        var st = fromEnd
          ? span - offset - size - k * (size + gutter)
          : offset + k * (size + gutter);
        tracks.push({ start: st, end: st + size });
      }
      // Normalise to left-to-right / top-to-bottom order for rendering.
      tracks.sort(function (a, b) {
        return a.start - b.start;
      });
    }

    return {
      size: size,
      tracks: tracks,
      positions: tracks.map(function (t) {
        return t.start;
      }),
    };
  }

  /**
   * Uniform grid: square guides across the whole canvas.
   * Returns line positions (not cells), matching Figma's uniform grid.
   *
   * @param {object} opts
   * @param {number} opts.width
   * @param {number} opts.height
   * @param {number} opts.size  Square size in px.
   * @returns {{ vertical: number[], horizontal: number[] }}
   */
  function gridGuides(opts) {
    var width = Number(opts.width) || 0;
    var height = Number(opts.height) || 0;
    var size = Number(opts.size) || 0;

    var vertical = [];
    var horizontal = [];

    if (size > 0) {
      for (var x = size; x < width; x += size) vertical.push(round2(x));
      for (var y = size; y < height; y += size) horizontal.push(round2(y));
    }

    return { vertical: vertical, horizontal: horizontal };
  }

  /**
   * Convenience: solve a columns guide (horizontal span).
   * @param {object} guide
   * @param {number} span
   */
  function solveColumns(guide, span) {
    return solveTracks({
      span: span,
      count: guide.count,
      gutter: guide.gutter,
      margin: guide.margin,
      mode: guide.mode,
      size: guide.width,
      offset: guide.offset,
    });
  }

  /**
   * Convenience: solve a rows guide (vertical span).
   * @param {object} guide
   * @param {number} span
   */
  function solveRows(guide, span) {
    return solveTracks({
      span: span,
      count: guide.count,
      gutter: guide.gutter,
      margin: guide.margin,
      mode: guide.mode,
      size: guide.height,
      offset: guide.offset,
    });
  }

  root.Gridular = {
    round2: round2,
    solveTracks: solveTracks,
    gridGuides: gridGuides,
    solveColumns: solveColumns,
    solveRows: solveRows,
  };
})(typeof window !== "undefined" ? window : this);

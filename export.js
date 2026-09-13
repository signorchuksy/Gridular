/**
 * export.js — Gridular output emitters.
 *
 * PURE: takes a guide + span, returns strings. No DOM. Exposes `window.Export`.
 *
 * Three emitters, all derived from the same solved geometry:
 *   1. CSS grid snippet
 *   2. `:root` custom properties
 *   3. JSON token shape
 */
(function (root) {
  "use strict";

  var G = root.Gridular;

  /**
   * The raw numbers for a columns guide, rounded for display/export.
   * @param {object} guide
   * @param {number} span
   */
  function numbers(guide, span) {
    var solved = G.solveColumns(guide, span);
    return {
      columns: guide.count,
      gutter: guide.mode === "stretch" ? guide.gutter : 0,
      margin: guide.mode === "stretch" ? guide.margin : 0,
      // Clamp at 0: a span too small for the margins/gutters yields a negative
      // derived width, which is meaningless to emit.
      columnWidth: Math.max(0, G.round2(solved.size)),
      pageWidth: span,
      mode: guide.mode,
    };
  }

  /**
   * CSS grid snippet. Stretch maps to `repeat(n, 1fr)` with gap + padding;
   * fixed modes map to explicit track sizes.
   * @param {object} guide
   * @param {number} span
   * @returns {string}
   */
  function css(guide, span) {
    var n = numbers(guide, span);
    var lines = [];

    lines.push(".grid {");
    lines.push("  display: grid;");

    if (guide.mode === "stretch") {
      lines.push("  grid-template-columns: repeat(" + n.columns + ", 1fr);");
      lines.push("  gap: " + n.gutter + "px;");
      lines.push("  padding-inline: " + n.margin + "px;");
    } else {
      lines.push(
        "  grid-template-columns: repeat(" + n.columns + ", " + n.columnWidth + "px);"
      );
      if (guide.mode === "center") {
        lines.push("  justify-content: center;");
      } else if (guide.mode === "right") {
        lines.push("  justify-content: end;");
      } else {
        lines.push("  justify-content: start;");
      }
      if (guide.offset) {
        lines.push("  padding-inline-start: " + guide.offset + "px;");
      }
    }

    lines.push("}");
    return lines.join("\n");
  }

  /**
   * `:root` custom properties.
   * @param {object} guide
   * @param {number} span
   * @returns {string}
   */
  function customProperties(guide, span) {
    var n = numbers(guide, span);
    return [
      ":root {",
      "  --grid-columns: " + n.columns + ";",
      "  --grid-gutter: " + n.gutter + "px;",
      "  --grid-margin: " + n.margin + "px;",
      "  --grid-column-width: " + n.columnWidth + "px;",
      "  --grid-page-width: " + n.pageWidth + "px;",
      "}",
    ].join("\n");
  }

  /**
   * JSON token shape.
   * @param {object} guide
   * @param {number} span
   * @returns {string}
   */
  function json(guide, span) {
    var n = numbers(guide, span);
    return JSON.stringify(
      {
        grid: {
          columns: n.columns,
          gutter: n.gutter,
          margin: n.margin,
          columnWidth: n.columnWidth,
          pageWidth: n.pageWidth,
          mode: n.mode,
        },
      },
      null,
      2
    );
  }

  root.Export = {
    numbers: numbers,
    css: css,
    customProperties: customProperties,
    json: json,
  };
})(typeof window !== "undefined" ? window : this);

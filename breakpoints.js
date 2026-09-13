/**
 * breakpoints.js — Tailwind presets + custom breakpoint entry.
 *
 * Pure data + small helpers. No DOM. Exposes `window.Breakpoints`.
 */
(function (root) {
  "use strict";

  /** Tailwind's default breakpoints (px). */
  var PRESETS = [
    { name: "sm", width: 640 },
    { name: "md", width: 768 },
    { name: "lg", width: 1024 },
    { name: "xl", width: 1280 },
    { name: "2xl", width: 1536 },
  ];

  var STORAGE_KEY = "gridular.breakpoint";

  /**
   * Build a breakpoint object.
   * @param {number} width
   * @param {string} [name]
   * @param {"tailwind"|"custom"} [source]
   */
  function make(width, name, source) {
    return {
      name: name || "custom",
      width: width,
      source: source || "custom",
    };
  }

  /**
   * Match a width to a preset, if any.
   * @param {number} width
   * @returns {{name:string,width:number}|null}
   */
  function presetFor(width) {
    for (var i = 0; i < PRESETS.length; i++) {
      if (PRESETS[i].width === width) return PRESETS[i];
    }
    return null;
  }

  /**
   * Validate a raw width input.
   * @param {*} raw
   * @returns {number|null} A positive integer, or null if invalid.
   */
  function parseWidth(raw) {
    var n = Number(raw);
    if (!isFinite(n) || n <= 0) return null;
    return Math.round(n);
  }

  /**
   * Load the saved breakpoint, or the default (lg / 1024).
   * @returns {{name:string,width:number,source:string}}
   */
  function load() {
    try {
      var raw = root.localStorage && root.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        var w = parseWidth(parsed.width);
        if (w) return make(w, parsed.name, parsed.source);
      }
    } catch (e) {
      /* corrupt storage — fall through to default */
    }
    return make(1024, "lg", "tailwind");
  }

  /**
   * Persist the breakpoint.
   * @param {{name:string,width:number,source:string}} bp
   */
  function save(bp) {
    try {
      root.localStorage && root.localStorage.setItem(STORAGE_KEY, JSON.stringify(bp));
    } catch (e) {
      /* storage unavailable — non-fatal */
    }
  }

  root.Breakpoints = {
    PRESETS: PRESETS,
    make: make,
    presetFor: presetFor,
    parseWidth: parseWidth,
    load: load,
    save: save,
  };
})(typeof window !== "undefined" ? window : this);

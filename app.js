/**
 * app.js — Gridular UI wiring.
 *
 * Phase 2: breakpoint entry only. The stage renders the breakpoint width; guide
 * rendering arrives in Phase 3.
 *
 * All state mutation funnels through `setState` so there is one place to reason
 * about re-renders.
 */
(function () {
  "use strict";

  var BP = window.Breakpoints;

  /** @type {{breakpoint:{name:string,width:number,source:string}}} */
  var state = {
    breakpoint: BP.load(),
  };

  var els = {
    width: document.getElementById("bp-width"),
    presets: document.getElementById("presets"),
    stage: document.getElementById("stage"),
    stageLabel: document.getElementById("stage-label"),
  };

  /**
   * The single mutation point. Applies the change, persists, and re-renders.
   * @param {object} patch
   */
  function setState(patch) {
    Object.assign(state, patch);
    BP.save(state.breakpoint);
    render();
  }

  function setBreakpoint(bp) {
    setState({ breakpoint: bp });
  }

  /** Build the preset buttons once. */
  function buildPresets() {
    BP.PRESETS.forEach(function (preset) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "preset";
      btn.textContent = preset.name;
      btn.dataset.width = String(preset.width);
      btn.addEventListener("click", function () {
        setBreakpoint(BP.make(preset.width, preset.name, "tailwind"));
      });
      els.presets.appendChild(btn);
    });
  }

  function render() {
    var bp = state.breakpoint;

    // Width input — only overwrite when it differs, so typing is not disrupted.
    if (document.activeElement !== els.width) {
      els.width.value = String(bp.width);
    }

    // Preset pressed state.
    Array.prototype.forEach.call(els.presets.children, function (btn) {
      var isActive = Number(btn.dataset.width) === bp.width;
      btn.setAttribute("aria-pressed", isActive ? "true" : "false");
    });

    // Stage.
    els.stage.style.width = bp.width + "px";
    els.stageLabel.textContent = bp.width + "px · " + bp.name;
  }

  // --- Events ---

  els.width.addEventListener("input", function () {
    var w = BP.parseWidth(els.width.value);
    if (w === null) return; // invalid input: leave the canvas untouched
    var preset = BP.presetFor(w);
    setBreakpoint(
      preset ? BP.make(w, preset.name, "tailwind") : BP.make(w, "custom", "custom")
    );
  });

  els.width.addEventListener("blur", function () {
    // Restore a valid value if the field was left empty/invalid.
    if (BP.parseWidth(els.width.value) === null) {
      els.width.value = String(state.breakpoint.width);
    }
  });

  // --- Init ---

  buildPresets();
  render();
})();

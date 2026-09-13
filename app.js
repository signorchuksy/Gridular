/**
 * app.js — Gridular UI wiring.
 *
 * Phase 3: one columns guide with a live preview and an inspector.
 *
 * All state mutation funnels through `setState` so there is one place to reason
 * about re-renders.
 */
(function () {
  "use strict";

  var BP = window.Breakpoints;
  var G = window.Gridular;

  var STAGE_HEIGHT = 480;

  /** @type {{breakpoint:object, guides:object[], selectedGuideId:string|null}} */
  var state = {
    breakpoint: BP.load(),
    guides: [makeColumnsGuide()],
    selectedGuideId: null,
  };
  state.selectedGuideId = state.guides[0].id;

  function makeColumnsGuide() {
    return {
      id: "g" + Math.random().toString(36).slice(2, 8),
      type: "columns",
      visible: true,
      color: "#FF0000",
      opacity: 10,
      count: 4,
      mode: "stretch",
      width: 200,
      offset: 0,
      margin: 20,
      gutter: 20,
    };
  }

  var els = {
    width: document.getElementById("bp-width"),
    presets: document.getElementById("presets"),
    stage: document.getElementById("stage"),
    stageLabel: document.getElementById("stage-label"),
    overlay: document.getElementById("overlay"),
    inspector: document.getElementById("inspector"),
    inspectorType: document.getElementById("inspector-type"),
    inspectorBody: document.getElementById("inspector-body"),
    inspectorClose: document.getElementById("inspector-close"),
  };

  function selectedGuide() {
    for (var i = 0; i < state.guides.length; i++) {
      if (state.guides[i].id === state.selectedGuideId) return state.guides[i];
    }
    return null;
  }

  /**
   * The single mutation point. Applies the change, persists, and re-renders.
   * @param {object} patch
   */
  function setState(patch) {
    Object.assign(state, patch);
    BP.save(state.breakpoint);
    render();
  }

  /** Patch the selected guide and re-render. */
  function updateGuide(patch) {
    var guide = selectedGuide();
    if (!guide) return;
    Object.assign(guide, patch);
    render();
  }

  // --- Rendering ---

  function render() {
    renderBreakpoint();
    renderOverlay();
    renderInspector();
  }

  function renderBreakpoint() {
    var bp = state.breakpoint;
    if (document.activeElement !== els.width) {
      els.width.value = String(bp.width);
    }
    Array.prototype.forEach.call(els.presets.children, function (btn) {
      var isActive = Number(btn.dataset.width) === bp.width;
      btn.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
    els.stage.style.width = bp.width + "px";
    els.stage.style.height = STAGE_HEIGHT + "px";
    els.stageLabel.textContent = bp.width + "px · " + bp.name;
  }

  function renderOverlay() {
    els.overlay.innerHTML = "";
    var span = state.breakpoint.width;

    state.guides.forEach(function (guide) {
      if (!guide.visible) return;
      if (guide.type !== "columns") return;

      var solved = G.solveColumns(guide, span);
      var color = hexToRgba(guide.color, guide.opacity);

      solved.tracks.forEach(function (track) {
        var band = document.createElement("div");
        band.className = "band";
        band.style.left = track.start + "px";
        band.style.width = Math.max(0, track.end - track.start) + "px";
        band.style.background = color;
        els.overlay.appendChild(band);
      });
    });
  }

  function renderInspector() {
    var guide = selectedGuide();
    if (!guide) {
      els.inspector.hidden = true;
      return;
    }
    els.inspector.hidden = false;
    els.inspectorType.textContent = "Columns";

    var isStretch = guide.mode === "stretch";
    els.inspectorBody.innerHTML = "";

    els.inspectorBody.appendChild(
      numberRow("Count", guide.count, 1, function (v) {
        updateGuide({ count: v });
      })
    );

    els.inspectorBody.appendChild(
      selectRow("Mode", guide.mode, ["stretch", "left", "center", "right"], function (v) {
        updateGuide({ mode: v });
      })
    );

    els.inspectorBody.appendChild(
      numberRow(
        "Width",
        guide.width,
        1,
        function (v) {
          updateGuide({ width: v });
        },
        isStretch
      )
    );

    els.inspectorBody.appendChild(
      numberRow(
        "Offset",
        guide.offset,
        0,
        function (v) {
          updateGuide({ offset: v });
        },
        isStretch || guide.mode === "center"
      )
    );

    els.inspectorBody.appendChild(
      numberRow(
        "Margin",
        guide.margin,
        0,
        function (v) {
          updateGuide({ margin: v });
        },
        !isStretch
      )
    );

    els.inspectorBody.appendChild(
      numberRow(
        "Gutter",
        guide.gutter,
        0,
        function (v) {
          updateGuide({ gutter: v });
        },
        !isStretch
      )
    );

    // Numeric readout — the calculator panel.
    var solved = G.solveColumns(guide, state.breakpoint.width);
    var readout = document.createElement("div");
    readout.className = "readout";
    readout.innerHTML =
      "<div>Column width: <b>" +
      G.round2(solved.size) +
      "px</b></div>" +
      "<div>Page width: <b>" +
      state.breakpoint.width +
      "px</b></div>";
    els.inspectorBody.appendChild(readout);
  }

  // --- Field builders ---

  function numberRow(label, value, min, onChange, disabled) {
    var row = document.createElement("div");
    row.className = "row";

    var lab = document.createElement("span");
    lab.className = "row__label";
    lab.textContent = label;

    var input = document.createElement("input");
    input.className = "input input--num";
    input.type = "number";
    input.min = String(min);
    input.step = "1";
    input.value = String(value);
    input.disabled = !!disabled;
    input.setAttribute("aria-label", label);
    input.addEventListener("input", function () {
      var n = Number(input.value);
      if (!isFinite(n) || n < min) return;
      onChange(Math.round(n));
    });

    row.appendChild(lab);
    row.appendChild(input);
    return row;
  }

  function selectRow(label, value, options, onChange) {
    var row = document.createElement("div");
    row.className = "row";

    var lab = document.createElement("span");
    lab.className = "row__label";
    lab.textContent = label;

    var select = document.createElement("select");
    select.className = "input";
    select.setAttribute("aria-label", label);
    options.forEach(function (opt) {
      var o = document.createElement("option");
      o.value = opt;
      o.textContent = opt.charAt(0).toUpperCase() + opt.slice(1);
      if (opt === value) o.selected = true;
      select.appendChild(o);
    });
    select.addEventListener("change", function () {
      onChange(select.value);
    });

    row.appendChild(lab);
    row.appendChild(select);
    return row;
  }

  // --- Helpers ---

  function hexToRgba(hex, opacityPercent) {
    var h = hex.replace("#", "");
    if (h.length === 3) {
      h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    }
    var r = parseInt(h.slice(0, 2), 16) || 0;
    var g = parseInt(h.slice(2, 4), 16) || 0;
    var b = parseInt(h.slice(4, 6), 16) || 0;
    return "rgba(" + r + "," + g + "," + b + "," + opacityPercent / 100 + ")";
  }

  // --- Events ---

  els.width.addEventListener("input", function () {
    var w = BP.parseWidth(els.width.value);
    if (w === null) return;
    var preset = BP.presetFor(w);
    setState({
      breakpoint: preset ? BP.make(w, preset.name, "tailwind") : BP.make(w, "custom", "custom"),
    });
  });

  els.width.addEventListener("blur", function () {
    if (BP.parseWidth(els.width.value) === null) {
      els.width.value = String(state.breakpoint.width);
    }
  });

  els.inspectorClose.addEventListener("click", function () {
    setState({ selectedGuideId: null });
  });

  // --- Init ---

  BP.PRESETS.forEach(function (preset) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "preset";
    btn.textContent = preset.name;
    btn.dataset.width = String(preset.width);
    btn.addEventListener("click", function () {
      setState({ breakpoint: BP.make(preset.width, preset.name, "tailwind") });
    });
    els.presets.appendChild(btn);
  });

  render();
})();

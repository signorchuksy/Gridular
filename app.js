/**
 * app.js — Gridular UI wiring.
 *
 * Phase 4: three guide types (grid, columns, rows) with a guide list — add,
 * select, toggle visibility, remove — and persistence of the whole set.
 *
 * All state mutation funnels through `setState` so there is one place to reason
 * about re-renders.
 */
(function () {
  "use strict";

  var BP = window.Breakpoints;
  var G = window.Gridular;
  var EX = window.Export;

  var STAGE_HEIGHT = 480;
  var STORAGE_KEY = "gridular.state";

  // --- Guide factories ---

  function uid() {
    return "g" + Math.random().toString(36).slice(2, 8);
  }

  function makeGuide(type) {
    var base = {
      id: uid(),
      type: type,
      visible: true,
      color: "#FF0000",
      opacity: 10,
    };
    return Object.assign(base, typeDefaults(type));
  }

  /**
   * The type-specific fields for a guide type. Used both when creating a guide
   * and when switching an existing guide's type, so a guide always has the
   * fields its type needs.
   */
  function typeDefaults(type) {
    if (type === "grid") {
      return { size: 8 };
    }
    if (type === "columns") {
      return {
        count: 4,
        mode: "stretch",
        width: 200,
        offset: 0,
        margin: 20,
        gutter: 20,
      };
    }
    return {
      count: 5,
      mode: "stretch",
      height: 80,
      offset: 0,
      margin: 0,
      gutter: 20,
    };
  }

  function guideLabel(guide) {
    if (guide.type === "grid") return "Grid " + guide.size + "px";
    if (guide.type === "columns") return guide.count + " columns";
    return guide.count + " rows";
  }

  // --- State ---

  function defaultState() {
    var first = makeGuide("columns");
    return {
      breakpoint: BP.load(),
      guides: [first],
      selectedGuideId: first.id,
      outputFormat: "css",
    };
  }

  function loadState() {
    try {
      var raw = window.localStorage && window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.guides) && parsed.guides.length) {
          return {
            breakpoint: BP.load(),
            guides: parsed.guides,
            selectedGuideId: parsed.selectedGuideId || null,
            outputFormat: parsed.outputFormat || "css",
          };
        }
      }
    } catch (e) {
      /* corrupt storage — fall through to default */
    }
    return defaultState();
  }

  var state = loadState();

  var els = {
    width: document.getElementById("bp-width"),
    presets: document.getElementById("presets"),
    stage: document.getElementById("stage"),
    stageLabel: document.getElementById("stage-label"),
    overlay: document.getElementById("overlay"),
    guideList: document.getElementById("guide-list"),
    guideAdd: document.getElementById("guide-add"),
    inspector: document.getElementById("inspector"),
    inspectorType: document.getElementById("inspector-type"),
    inspectorBody: document.getElementById("inspector-body"),
    inspectorClose: document.getElementById("inspector-close"),
    outputTabs: document.getElementById("output-tabs"),
    outputCode: document.getElementById("output-code"),
    outputCopy: document.getElementById("output-copy"),
  };

  function selectedGuide() {
    for (var i = 0; i < state.guides.length; i++) {
      if (state.guides[i].id === state.selectedGuideId) return state.guides[i];
    }
    return null;
  }

  function persist() {
    try {
      window.localStorage &&
        window.localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            guides: state.guides,
            selectedGuideId: state.selectedGuideId,
            outputFormat: state.outputFormat,
          })
        );
    } catch (e) {
      /* storage unavailable — non-fatal */
    }
    BP.save(state.breakpoint);
  }

  /**
   * The single mutation point. Applies the change, persists, and re-renders.
   * @param {object} patch
   */
  function setState(patch) {
    Object.assign(state, patch);
    persist();
    render();
  }

  /** Patch the selected guide and re-render. */
  function updateGuide(patch) {
    var guide = selectedGuide();
    if (!guide) return;
    Object.assign(guide, patch);
    persist();
    render();
  }

  // --- Rendering ---

  function render() {
    renderBreakpoint();
    renderGuideList();
    renderOverlay();
    renderInspector();
    renderOutput();
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

  function renderGuideList() {
    els.guideList.innerHTML = "";

    state.guides.forEach(function (guide) {
      var li = document.createElement("li");
      li.className = "guide";
      if (guide.id === state.selectedGuideId) li.classList.add("guide--selected");

      var select = document.createElement("button");
      select.type = "button";
      select.className = "guide__name";
      select.textContent = guideLabel(guide);
      select.addEventListener("click", function () {
        setState({ selectedGuideId: guide.id });
      });

      var eye = document.createElement("button");
      eye.type = "button";
      eye.className = "icon-btn icon-btn--sm";
      eye.textContent = guide.visible ? "\u25C9" : "\u25CB";
      eye.setAttribute("aria-label", (guide.visible ? "Hide " : "Show ") + guideLabel(guide));
      eye.setAttribute("aria-pressed", guide.visible ? "true" : "false");
      eye.addEventListener("click", function () {
        guide.visible = !guide.visible;
        persist();
        render();
      });

      var remove = document.createElement("button");
      remove.type = "button";
      remove.className = "icon-btn icon-btn--sm";
      remove.textContent = "\u2212";
      remove.setAttribute("aria-label", "Remove " + guideLabel(guide));
      remove.addEventListener("click", function () {
        removeGuide(guide.id);
      });

      li.appendChild(select);
      li.appendChild(eye);
      li.appendChild(remove);
      els.guideList.appendChild(li);
    });
  }

  function renderOverlay() {
    els.overlay.innerHTML = "";
    var width = state.breakpoint.width;
    var height = STAGE_HEIGHT;

    state.guides.forEach(function (guide) {
      if (!guide.visible) return;
      var color = hexToRgba(guide.color, guide.opacity);

      if (guide.type === "grid") {
        var lines = G.gridGuides({ width: width, height: height, size: guide.size });
        lines.vertical.forEach(function (x) {
          els.overlay.appendChild(line("v", x, color));
        });
        lines.horizontal.forEach(function (y) {
          els.overlay.appendChild(line("h", y, color));
        });
      } else if (guide.type === "columns") {
        G.solveColumns(guide, width).tracks.forEach(function (t) {
          els.overlay.appendChild(band("v", t.start, t.end - t.start, color));
        });
      } else {
        G.solveRows(guide, height).tracks.forEach(function (t) {
          els.overlay.appendChild(band("h", t.start, t.end - t.start, color));
        });
      }
    });
  }

  function band(axis, start, size, color) {
    var el = document.createElement("div");
    el.className = "band band--" + axis;
    if (axis === "v") {
      el.style.left = start + "px";
      el.style.width = Math.max(0, size) + "px";
    } else {
      el.style.top = start + "px";
      el.style.height = Math.max(0, size) + "px";
    }
    el.style.background = color;
    return el;
  }

  function line(axis, pos, color) {
    var el = document.createElement("div");
    el.className = "line line--" + axis;
    if (axis === "v") el.style.left = pos + "px";
    else el.style.top = pos + "px";
    el.style.background = color;
    return el;
  }

  function renderInspector() {
    var guide = selectedGuide();
    if (!guide) {
      els.inspector.hidden = true;
      return;
    }
    els.inspector.hidden = false;
    els.inspectorType.value = guide.type;

    // Rebuilding the inspector replaces its inputs, which would drop focus and
    // break typing multi-digit values and arrow-key nudging. Capture the focused
    // field (and caret) and restore it after the rebuild.
    var focus = captureFocus();
    els.inspectorBody.innerHTML = "";

    // Colour + opacity apply to every guide type (Figma default: #FF0000 @ 10%).
    els.inspectorBody.appendChild(
      colorRow(guide.color, function (v) {
        updateGuide({ color: v });
      })
    );
    els.inspectorBody.appendChild(
      numberRow(
        "Opacity",
        guide.opacity,
        0,
        function (v) {
          updateGuide({ opacity: Math.min(100, v) });
        },
        false,
        100
      )
    );

    if (guide.type === "grid") {
      els.inspectorBody.appendChild(
        numberRow("Size", guide.size, 1, function (v) {
          updateGuide({ size: v });
        })
      );
      return;
    }

    var isColumns = guide.type === "columns";
    var isStretch = guide.mode === "stretch";
    var modes = isColumns
      ? ["stretch", "left", "center", "right"]
      : ["stretch", "top", "center", "bottom"];

    els.inspectorBody.appendChild(
      numberRow("Count", guide.count, 1, function (v) {
        updateGuide({ count: v });
      })
    );

    els.inspectorBody.appendChild(
      selectRow("Mode", guide.mode, modes, function (v) {
        updateGuide({ mode: v });
      })
    );

    els.inspectorBody.appendChild(
      numberRow(
        isColumns ? "Width" : "Height",
        isColumns ? guide.width : guide.height,
        1,
        function (v) {
          updateGuide(isColumns ? { width: v } : { height: v });
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
    var span = isColumns ? state.breakpoint.width : STAGE_HEIGHT;
    var solved = isColumns ? G.solveColumns(guide, span) : G.solveRows(guide, span);
    var readout = document.createElement("div");
    readout.className = "readout";
    readout.innerHTML =
      "<div>" +
      (isColumns ? "Column width" : "Row height") +
      ": <b>" +
      Math.max(0, G.round2(solved.size)) +
      "px</b></div>" +
      "<div>Page width: <b>" +
      state.breakpoint.width +
      "px</b></div>";
    els.inspectorBody.appendChild(readout);

    restoreFocus(focus);
  }

  /**
   * Remember which inspector field has focus, and where the caret is, so it can
   * be restored after the inspector is rebuilt.
   */
  function captureFocus() {
    var el = document.activeElement;
    if (!el || !els.inspectorBody.contains(el)) return null;
    var label = el.getAttribute("aria-label");
    if (!label) return null;
    var caret = null;
    try {
      caret = el.selectionStart;
    } catch (e) {
      /* inputs that do not support selection */
    }
    return { label: label, caret: caret };
  }

  function restoreFocus(focus) {
    if (!focus) return;
    var el = els.inspectorBody.querySelector('[aria-label="' + focus.label + '"]');
    if (!el) return;
    el.focus();
    if (focus.caret !== null && el.setSelectionRange) {
      try {
        el.setSelectionRange(focus.caret, focus.caret);
      } catch (e) {
        /* not a text-selectable input */
      }
    }
  }

  /**
   * The columns guide the output is derived from: the selected one if it is a
   * columns guide, otherwise the first columns guide in the set.
   */
  function outputGuide() {
    var sel = selectedGuide();
    if (sel && sel.type === "columns") return sel;
    for (var i = 0; i < state.guides.length; i++) {
      if (state.guides[i].type === "columns") return state.guides[i];
    }
    return null;
  }

  function renderOutput() {
    var guide = outputGuide();
    var format = state.outputFormat;

    Array.prototype.forEach.call(els.outputTabs.children, function (tab) {
      tab.setAttribute("aria-selected", tab.dataset.format === format ? "true" : "false");
    });

    if (!guide) {
      els.outputCode.textContent = "Add a columns guide to generate output.";
      return;
    }

    var span = state.breakpoint.width;
    if (format === "vars") {
      els.outputCode.textContent = EX.customProperties(guide, span);
    } else if (format === "json") {
      els.outputCode.textContent = EX.json(guide, span);
    } else {
      els.outputCode.textContent = EX.css(guide, span);
    }
  }

  // --- Guide operations ---
  function addGuide(type) {
    var guide = makeGuide(type);
    state.guides.push(guide);
    setState({ selectedGuideId: guide.id });
  }

  function removeGuide(id) {
    state.guides = state.guides.filter(function (g) {
      return g.id !== id;
    });
    var nextSelected = state.selectedGuideId === id ? null : state.selectedGuideId;
    setState({ selectedGuideId: nextSelected });
  }

  // --- Field builders ---

  function numberRow(label, value, min, onChange, disabled, max) {
    var row = document.createElement("div");
    row.className = "row";

    var lab = document.createElement("span");
    lab.className = "row__label";
    lab.textContent = label;

    var input = document.createElement("input");
    input.className = "input input--num";
    input.type = "number";
    input.min = String(min);
    if (typeof max === "number") input.max = String(max);
    input.step = "1";
    input.value = String(value);
    input.disabled = !!disabled;
    input.setAttribute("aria-label", label);
    input.addEventListener("input", function () {
      var n = Number(input.value);
      if (!isFinite(n) || n < min) return;
      // When a max is set, clamp rather than reject so the field never displays
      // a value the state ignored.
      if (typeof max === "number" && n > max) {
        n = max;
        input.value = String(max);
      }
      onChange(Math.round(n));
    });

    // Arrow keys nudge by 1 (or 10 with Shift). Native number inputs already do
    // this, but only while focused and only for the spinner; this makes the
    // behaviour explicit and consistent across browsers.
    input.addEventListener("keydown", function (e) {
      if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
      e.preventDefault();
      var step = e.shiftKey ? 10 : 1;
      var next = (Number(input.value) || 0) + (e.key === "ArrowUp" ? step : -step);
      if (next < min) next = min;
      if (typeof max === "number" && next > max) next = max;
      input.value = String(next);
      onChange(next);
    });

    row.appendChild(lab);
    row.appendChild(input);
    return row;
  }

  function colorRow(value, onChange) {
    var row = document.createElement("div");
    row.className = "row";

    var lab = document.createElement("span");
    lab.className = "row__label";
    lab.textContent = "Color";

    var wrap = document.createElement("div");
    wrap.className = "color-field";

    var swatch = document.createElement("input");
    swatch.type = "color";
    swatch.className = "color-swatch";
    swatch.value = value;
    swatch.setAttribute("aria-label", "Color swatch");

    var hex = document.createElement("input");
    hex.type = "text";
    hex.className = "input input--hex";
    hex.value = value.toUpperCase();
    hex.setAttribute("aria-label", "Color hex");
    hex.spellcheck = false;

    function commit(v) {
      if (/^#[0-9a-fA-F]{6}$/.test(v)) onChange(v.toUpperCase());
    }

    swatch.addEventListener("input", function () {
      hex.value = swatch.value.toUpperCase();
      commit(swatch.value);
    });
    hex.addEventListener("input", function () {
      var v = hex.value.trim();
      if (v.charAt(0) !== "#") v = "#" + v;
      if (/^#[0-9a-fA-F]{6}$/.test(v)) {
        swatch.value = v;
        commit(v);
      }
    });

    wrap.appendChild(swatch);
    wrap.appendChild(hex);
    row.appendChild(lab);
    row.appendChild(wrap);
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

  els.guideAdd.addEventListener("click", function () {
    addGuide("columns");
  });

  els.inspectorType.addEventListener("change", function () {
    var type = els.inspectorType.value;
    // Merge in the new type's defaults so the guide always has the fields its
    // type needs (e.g. `size` for a grid, `height` for rows).
    updateGuide(Object.assign({ type: type }, typeDefaults(type)));
  });

  els.inspectorClose.addEventListener("click", function () {
    setState({ selectedGuideId: null });
  });

  els.outputTabs.addEventListener("click", function (e) {
    var tab = e.target.closest(".tab");
    if (!tab) return;
    setState({ outputFormat: tab.dataset.format });
  });

  els.outputCopy.addEventListener("click", function () {
    var text = els.outputCode.textContent;
    var done = function () {
      var original = els.outputCopy.textContent;
      els.outputCopy.textContent = "Copied";
      setTimeout(function () {
        els.outputCopy.textContent = original;
      }, 1200);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () {
        fallbackCopy(text, done);
      });
    } else {
      fallbackCopy(text, done);
    }
  });

  /** Clipboard fallback for non-secure contexts (e.g. file://). */
  function fallbackCopy(text, done) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      done();
    } catch (e) {
      /* copy unavailable — leave the text selectable in the panel */
    }
    document.body.removeChild(ta);
  }

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

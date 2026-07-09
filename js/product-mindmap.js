(function () {
  var BREAKPOINTS = { tablet: 640, desktop: 1024 };

  var LAYOUTS = {
    mobile: {
      key: "mobile",
      viewW: 1000,
      viewH: 1040,
      arcTop: "M 160 205 Q 500 0 840 205",
      arcBottom: "M 160 695 Q 500 920 840 695",
      topCurve: { p0: { x: 160, y: 205 }, p1: { x: 500, y: 0 }, p2: { x: 840, y: 205 } },
      bottomCurve: { p0: { x: 160, y: 695 }, p1: { x: 500, y: 920 }, p2: { x: 840, y: 695 } },
      tMin: 0.08,
      tMax: 0.92,
    },
    tablet: {
      key: "tablet",
      viewW: 1000,
      viewH: 700,
      arcTop: "M 70 195 C 180 88 280 45 500 45 C 720 45 820 88 930 195",
      arcBottom: "M 70 505 C 180 612 280 655 500 655 C 720 655 820 612 930 505",
      topCurve: {
        type: "cubic-split",
        segments: [
          { p0: { x: 70, y: 195 }, p1: { x: 180, y: 88 }, p2: { x: 280, y: 45 }, p3: { x: 500, y: 45 } },
          { p0: { x: 500, y: 45 }, p1: { x: 720, y: 45 }, p2: { x: 820, y: 88 }, p3: { x: 930, y: 195 } },
        ],
      },
      bottomCurve: {
        type: "cubic-split",
        segments: [
          { p0: { x: 70, y: 505 }, p1: { x: 180, y: 612 }, p2: { x: 280, y: 655 }, p3: { x: 500, y: 655 } },
          { p0: { x: 500, y: 655 }, p1: { x: 720, y: 655 }, p2: { x: 820, y: 612 }, p3: { x: 930, y: 505 } },
        ],
      },
      tMin: 0.06,
      tMax: 0.94,
    },
    desktop: {
      key: "desktop",
      viewW: 1000,
      viewH: 740,
      arcTop: "M 40 188 C 160 82 280 42 500 42 C 720 42 840 82 960 188",
      arcBottom: "M 40 552 C 160 658 280 698 500 698 C 720 698 840 658 960 552",
      topCurve: {
        type: "cubic-split",
        segments: [
          { p0: { x: 40, y: 188 }, p1: { x: 160, y: 82 }, p2: { x: 280, y: 42 }, p3: { x: 500, y: 42 } },
          { p0: { x: 500, y: 42 }, p1: { x: 720, y: 42 }, p2: { x: 840, y: 82 }, p3: { x: 960, y: 188 } },
        ],
      },
      bottomCurve: {
        type: "cubic-split",
        segments: [
          { p0: { x: 40, y: 552 }, p1: { x: 160, y: 658 }, p2: { x: 280, y: 698 }, p3: { x: 500, y: 698 } },
          { p0: { x: 500, y: 698 }, p1: { x: 720, y: 698 }, p2: { x: 840, y: 658 }, p3: { x: 960, y: 552 } },
        ],
      },
      tMin: 0.06,
      tMax: 0.94,
    },
  };

  function getActiveLayout() {
    var width = window.innerWidth;
    if (width < BREAKPOINTS.tablet) return LAYOUTS.mobile;
    if (width < BREAKPOINTS.desktop) return LAYOUTS.tablet;
    return LAYOUTS.desktop;
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function parseFeatures(raw) {
    if (!raw) return [];
    try {
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
    } catch (error) {
      return raw.split("|").map(function (item) { return item.trim(); }).filter(Boolean);
    }
  }

  function splitFeatures(features) {
    var topCount = Math.ceil(features.length / 2);
    return {
      top: features.slice(0, topCount),
      bottom: features.slice(topCount),
    };
  }

  function quadPoint(curve, t) {
    var u = 1 - t;
    return {
      x: u * u * curve.p0.x + 2 * u * t * curve.p1.x + t * t * curve.p2.x,
      y: u * u * curve.p0.y + 2 * u * t * curve.p1.y + t * t * curve.p2.y,
    };
  }

  function cubicPointOnSegment(segment, t) {
    var u = 1 - t;
    var tt = t * t;
    var uu = u * u;
    return {
      x: uu * u * segment.p0.x + 3 * uu * t * segment.p1.x + 3 * u * tt * segment.p2.x + tt * t * segment.p3.x,
      y: uu * u * segment.p0.y + 3 * uu * t * segment.p1.y + 3 * u * tt * segment.p2.y + tt * t * segment.p3.y,
    };
  }

  function splitCubicPoint(curve, t) {
    if (t <= 0.5) return cubicPointOnSegment(curve.segments[0], t * 2);
    return cubicPointOnSegment(curve.segments[1], (t - 0.5) * 2);
  }

  function curvePoint(curve, t) {
    if (curve.type === "cubic-split") return splitCubicPoint(curve, t);
    return quadPoint(curve, t);
  }

  function arcTValues(count, tMin, tMax) {
    if (count <= 1) return [(tMin + tMax) / 2];
    var values = [];
    for (var i = 0; i < count; i += 1) {
      values.push(tMin + ((tMax - tMin) * i) / (count - 1));
    }
    return values;
  }

  function fitViewBox(containerW, containerH, layout) {
    var scale = Math.min(containerW / layout.viewW, containerH / layout.viewH);
    var renderW = layout.viewW * scale;
    var renderH = layout.viewH * scale;
    return {
      scale: scale,
      offsetX: (containerW - renderW) / 2,
      offsetY: (containerH - renderH) / 2,
    };
  }

  function viewToContainer(point, fit) {
    return {
      x: fit.offsetX + point.x * fit.scale,
      y: fit.offsetY + point.y * fit.scale,
    };
  }

  function renderAnchorNode(label, point, side) {
    var sideClass = side === "top" ? "product-mindmap-anchor-top" : "product-mindmap-anchor-bottom";
    var labelClass = side === "top" ? "product-mindmap-node-label-top" : "product-mindmap-node-label-bottom";

    return (
      '<div class="product-mindmap-anchor ' + sideClass + '" data-vx="' + point.x + '" data-vy="' + point.y + '">' +
      '<span class="product-mindmap-node-marker" aria-hidden="true"></span>' +
      '<p class="product-mindmap-node-label ' + labelClass + '">' + escapeHtml(label) + "</p>" +
      "</div>"
    );
  }

  function renderArcNodes(items, curve, side, layout) {
    var tValues = arcTValues(items.length, layout.tMin, layout.tMax);
    return items
      .map(function (label, index) {
        return renderAnchorNode(label, curvePoint(curve, tValues[index]), side);
      })
      .join("");
  }

  function renderArcArea(features, layout) {
    var groups = splitFeatures(features);

    return (
      '<svg class="product-mindmap-arcs" viewBox="0 0 ' + layout.viewW + " " + layout.viewH + '" preserveAspectRatio="xMidYMid meet" aria-hidden="true">' +
      '<path class="product-mindmap-arc-top" d="' + layout.arcTop + '" />' +
      '<path class="product-mindmap-arc-bottom" d="' + layout.arcBottom + '" />' +
      "</svg>" +
      '<div class="product-mindmap-nodes">' +
      renderArcNodes(groups.top, layout.topCurve, "top", layout) +
      renderArcNodes(groups.bottom, layout.bottomCurve, "bottom", layout) +
      "</div>"
    );
  }

  function renderStage(image, alt, features, layout) {
    return (
      '<div class="product-mindmap-arc-area">' +
      renderArcArea(features, layout) +
      "</div>" +
      '<div class="product-mindmap-core">' +
      '<div class="product-mindmap-glow" aria-hidden="true"></div>' +
      '<img src="' + escapeHtml(image) + '" alt="' + escapeHtml(alt) + '" class="product-mindmap-image" loading="lazy" width="700" height="700">' +
      "</div>"
    );
  }

  function layoutMindmapAnchors(stage, layout) {
    var arcArea = stage.querySelector(".product-mindmap-arc-area");
    if (!arcArea) return;

    var rect = arcArea.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    var fit = fitViewBox(rect.width, rect.height, layout);

    stage.querySelectorAll(".product-mindmap-anchor").forEach(function (anchor) {
      var point = viewToContainer(
        { x: parseFloat(anchor.getAttribute("data-vx")), y: parseFloat(anchor.getAttribute("data-vy")) },
        fit
      );
      anchor.style.left = point.x + "px";
      anchor.style.top = point.y + "px";
    });
  }

  function applyMindmapLayout(stage) {
    var layout = getActiveLayout();
    var features = parseFeatures(stage.getAttribute("data-features"));
    var arcArea = stage.querySelector(".product-mindmap-arc-area");

    if (!arcArea || !features.length) return;

    arcArea.innerHTML = renderArcArea(features, layout);
    stage.setAttribute("data-layout-key", layout.key);
    layoutMindmapAnchors(stage, layout);
  }

  function refreshMindmapStage(stage) {
    var layout = getActiveLayout();
    var currentKey = stage.getAttribute("data-layout-key");

    if (currentKey !== layout.key) {
      applyMindmapLayout(stage);
      return;
    }

    layoutMindmapAnchors(stage, layout);
  }

  function observeMindmapStage(stage) {
    layoutMindmapAnchors(stage, getActiveLayout());

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", function () { refreshMindmapStage(stage); });
      return;
    }

    var observer = new ResizeObserver(function () {
      refreshMindmapStage(stage);
    });
    observer.observe(stage);
  }

  function initMindmapStages() {
    document.querySelectorAll(".product-mindmap-stage[data-features]").forEach(function (stage) {
      var features = parseFeatures(stage.getAttribute("data-features"));
      var image = stage.getAttribute("data-image") || "";
      var alt = stage.getAttribute("data-alt") || "";
      if (!image || !features.length) return;

      var layout = getActiveLayout();
      stage.innerHTML = renderStage(image, alt, features, layout);
      stage.setAttribute("data-layout-key", layout.key);
      observeMindmapStage(stage);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initMindmapStages);
  } else {
    initMindmapStages();
  }
})();

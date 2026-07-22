// ==========================================================================
// RULER — builds the tick labels for the bottom/left rulers, tracks the
// cursor with a synced indicator line on each axis, and updates the corner
// coordinate readout. Desktop / fine-pointer only (mirrors the CSS media
// query in ruler.css) since there's no cursor to track on touch.
// ==========================================================================
(function initRuler() {
  "use strict";

  const rulerBottom = document.getElementById("rulerBottom");
  const rulerLeft = document.getElementById("rulerLeft");
  const ticksBottom = document.getElementById("rulerTicksBottom");
  const ticksLeft = document.getElementById("rulerTicksLeft");
  const cursorX = document.getElementById("rulerCursorX");
  const cursorY = document.getElementById("rulerCursorY");
  const coordX = document.getElementById("rulerCoordX");
  const coordY = document.getElementById("rulerCoordY");
  const header = document.querySelector(".site-header");

  if (!rulerBottom || !rulerLeft || !ticksBottom || !ticksLeft) return;

  const MAJOR_STEP = 100;
  const mq = window.matchMedia(
    "(min-width: 768px) and (hover: hover) and (pointer: fine)",
  );

  let active = mq.matches;
  let headerHeight = header ? header.offsetHeight : 0;
  let rafId = null;
  let pendingX = 0;
  let pendingY = 0;

  function setHeaderHeight() {
    if (!header) return;
    headerHeight = header.offsetHeight;
    document.documentElement.style.setProperty(
      "--header-h",
      `${headerHeight}px`,
    );
  }

  function buildLabels() {
    ticksBottom.querySelectorAll(".ruler-label").forEach((n) => n.remove());
    ticksLeft.querySelectorAll(".ruler-label").forEach((n) => n.remove());

    const width = ticksBottom.clientWidth;
    const height = ticksLeft.clientHeight;

    const bottomFrag = document.createDocumentFragment();
    for (let x = 0; x <= width; x += MAJOR_STEP) {
      const el = document.createElement("span");
      el.className = "ruler-label";
      el.style.left = `${x}px`;
      el.textContent = String(x);
      bottomFrag.appendChild(el);
    }
    ticksBottom.appendChild(bottomFrag);

    const leftFrag = document.createDocumentFragment();
    for (let y = 0; y <= height; y += MAJOR_STEP) {
      const el = document.createElement("span");
      el.className = "ruler-label";
      el.style.top = `${y}px`;
      el.textContent = String(y);
      leftFrag.appendChild(el);
    }
    ticksLeft.appendChild(leftFrag);
  }

  function updatePointer(clientX, clientY) {
    if (cursorX) {
      const rect = rulerBottom.getBoundingClientRect();
      const x = clientX - rect.left;
      cursorX.style.transform = `translateX(${x}px)`;
    }

    if (cursorY) {
      const rect = rulerLeft.getBoundingClientRect();
      const y = clientY - rect.top;
      cursorY.style.transform = `translateY(${y}px)`;
    }

    if (coordX) coordX.textContent = String(Math.round(clientX));
    if (coordY) coordY.textContent = String(Math.round(clientY));
    rafId = null;
  }

  function onMouseMove(e) {
    if (!active) return;
    pendingX = e.clientX;
    pendingY = e.clientY;
    if (rafId === null) {
      rafId = requestAnimationFrame(() => updatePointer(pendingX, pendingY));
    }
  }

  function debounce(fn, wait) {
    let t;
    return function debounced(...args) {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  function refresh() {
    active = mq.matches;
    setHeaderHeight();
    if (active) buildLabels();
  }

  document.addEventListener("mousemove", onMouseMove, { passive: true });
  window.addEventListener("resize", debounce(refresh, 150));
  window.addEventListener("load", refresh);

  if (typeof mq.addEventListener === "function") {
    mq.addEventListener("change", refresh);
  }

  refresh();
})();

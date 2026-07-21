// ==========================================================================
// PRISM FRAMES — mouse-scrubbed canvas frame sequencer for the hero visual,
// plus the preloader progress bar that gates it
// ==========================================================================
(function initPrismFrames() {
  "use strict";

  const canvas = document.getElementById("prismCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const container = canvas.parentElement;
  const preloader = document.getElementById("preloader");
  const progressBar = document.getElementById("preloaderProgress");
  const label = document.getElementById("preloaderLabel");

  const FRAME_COUNT = 101;
  const FRAME_PATH = "assets/frames/";
  const FRAME_EXT = "webp";
  const FRAME_PADDING = 4;

  let frames = [];
  let isReady = false;
  let currentFrame = Math.floor(FRAME_COUNT / 2);
  let targetFrame = currentFrame;
  let animationFrame = null;
  let isIdle = false;
  let loadedCount = 0;
  let initialLoadDone = false;
  let progressInterval = null;

  const SMOOTHING = 1;
  const IDLE_RETURN_SPEED = 0.03;
  const PRELOAD_RADIUS = 20;

  const INITIAL_LOAD_COUNT = 15;

  function padNumber(num, length) {
    return String(num).padStart(length, "0");
  }

  function startProgressAnimation() {
    if (progressInterval) return;
    progressInterval = setInterval(() => {
      if (!preloader || preloader.classList.contains("hidden")) {
        clearInterval(progressInterval);
        progressInterval = null;
        return;
      }
      const progress = Math.min((loadedCount / INITIAL_LOAD_COUNT) * 100, 100);
      if (progressBar) {
        progressBar.style.width = `${progress}%`;
      }
      if (label) {
        const percent = Math.round(progress);
        label.textContent = percent < 100 ? `Загрузка ${percent}%` : "Готово";
      }
      if (loadedCount >= INITIAL_LOAD_COUNT && preloader) {
        clearInterval(progressInterval);
        progressInterval = null;
        setTimeout(() => {
          preloader.classList.add("hidden");
        }, 400);
      }
    }, 50);
  }

  function loadFrame(index) {
    if (index < 0 || index >= FRAME_COUNT) return;
    if (frames[index] && frames[index].complete) return;

    const img = new Image();
    const frameNum = padNumber(index + 1, FRAME_PADDING);
    img.src = `${FRAME_PATH}frame-${frameNum}.${FRAME_EXT}`;

    img.onload = function () {
      loadedCount++;
      if (loadedCount >= INITIAL_LOAD_COUNT && !initialLoadDone) {
        initialLoadDone = true;
        isReady = true;
        resizeCanvas();
        drawFrame(currentFrame);
        startAnimationLoop();
      }
    };

    img.onerror = function () {
      loadedCount++;
      if (loadedCount >= INITIAL_LOAD_COUNT && !initialLoadDone) {
        initialLoadDone = true;
        isReady = true;
        resizeCanvas();
        drawFrame(currentFrame);
        startAnimationLoop();
      }
    };

    frames[index] = img;
  }

  function loadInitialFrames() {
    const center = Math.floor(FRAME_COUNT / 2);
    const start = Math.max(0, center - 7);
    const end = Math.min(FRAME_COUNT - 1, center + 7);

    for (let i = start; i <= end; i++) {
      loadFrame(i);
    }

    loadFrame(0);
    loadFrame(FRAME_COUNT - 1);
  }

  let lastPreloadIndex = -1;

  function preloadNearbyFrames(index) {
    const frameIndex = Math.round(index);
    if (frameIndex === lastPreloadIndex) return;
    lastPreloadIndex = frameIndex;

    const start = Math.max(0, frameIndex - PRELOAD_RADIUS);
    const end = Math.min(FRAME_COUNT - 1, frameIndex + PRELOAD_RADIUS);

    for (let i = start; i <= end; i++) {
      if (!frames[i] || !frames[i].complete) {
        loadFrame(i);
      }
    }
  }

  function drawFrame(index) {
    const frameIndex = Math.round(index);
    if (frameIndex < 0 || frameIndex >= FRAME_COUNT) return;

    const img = frames[frameIndex];
    if (!img || !img.complete) {
      preloadNearbyFrames(frameIndex);
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const dpr = window.devicePixelRatio || 1;
    const canvasWidth = canvas.width / dpr;
    const canvasHeight = canvas.height / dpr;

    const imgAspect = img.width / img.height;
    const canvasAspect = canvasWidth / canvasHeight;

    let drawWidth, drawHeight, offsetX, offsetY;

    if (imgAspect > canvasAspect) {
      drawWidth = canvasWidth;
      drawHeight = canvasWidth / imgAspect;
      offsetX = 0;
      offsetY = (canvasHeight - drawHeight) / 2;
    } else {
      drawHeight = canvasHeight;
      drawWidth = canvasHeight * imgAspect;
      offsetX = (canvasWidth - drawWidth) / 2;
      offsetY = 0;
    }

    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  }

  function startAnimationLoop() {
    if (animationFrame) cancelAnimationFrame(animationFrame);

    function update() {
      if (!initialLoadDone) {
        animationFrame = requestAnimationFrame(update);
        return;
      }

      if (isIdle) {
        const center = Math.floor(FRAME_COUNT / 2);
        targetFrame += (center - targetFrame) * IDLE_RETURN_SPEED;
        if (Math.abs(targetFrame - center) < 0.001) {
          targetFrame = center;
        }
      }

      currentFrame += (targetFrame - currentFrame) * SMOOTHING;
      currentFrame = Math.min(Math.max(currentFrame, 0), FRAME_COUNT - 1);

      drawFrame(currentFrame);

      animationFrame = requestAnimationFrame(update);
    }

    update();
  }

  document.addEventListener("mousemove", function (e) {
    if (!initialLoadDone) return;
    isIdle = false;
    const mouseX = e.clientX / window.innerWidth;
    targetFrame = mouseX * (FRAME_COUNT - 1);
    targetFrame = Math.min(Math.max(targetFrame, 0), FRAME_COUNT - 1);
    preloadNearbyFrames(targetFrame);
  });

  document.addEventListener("mouseleave", function () {
    isIdle = true;
  });

  document.addEventListener("visibilitychange", function () {
    if (document.hidden && animationFrame) {
      cancelAnimationFrame(animationFrame);
      animationFrame = null;
    } else if (!document.hidden && !animationFrame && initialLoadDone) {
      startAnimationLoop();
    }
  });

  function resizeCanvas() {
    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = rect.width + "px";
    canvas.style.height = rect.height + "px";

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    if (initialLoadDone) {
      drawFrame(currentFrame);
    }
  }

  window.addEventListener("resize", resizeCanvas);
  window.addEventListener("load", function () {
    setTimeout(resizeCanvas, 100);
  });

  loadInitialFrames();
  startProgressAnimation();

  setTimeout(function () {
    if (loadedCount === 0) {
      console.error(
        "❌ Кадры не загрузились. Проверь путь: assets/frames/frame-0001.webp",
      );
    }
  }, 3000);
})();

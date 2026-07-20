(() => {
  "use strict";

  const header = document.querySelector(".site-header");
  const floatingPanel = document.querySelector(".floating-panel");
  const hero = document.querySelector(".hero");

  const onScroll = () => {
    const scrolled = window.scrollY > 40;
    header.classList.toggle("is-scrolled", scrolled);

    if (hero) {
      const heroBottom = hero.getBoundingClientRect().bottom;
      floatingPanel.classList.toggle("is-visible", heroBottom < 0);
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const navToggle = document.querySelector(".nav-toggle");
  const drawer = document.querySelector(".mobile-drawer");

  if (navToggle && drawer) {
    navToggle.addEventListener("click", () => {
      const willOpen = !drawer.classList.contains("is-open");
      drawer.classList.toggle("is-open", willOpen);
      navToggle.classList.toggle("is-open", willOpen);
      document.body.style.overflow = willOpen ? "hidden" : "";
    });

    drawer.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        drawer.classList.remove("is-open");
        navToggle.classList.remove("is-open");
        document.body.style.overflow = "";
      });
    });
  }

  const revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" },
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  const caseTrack = document.querySelector("[data-case-track]");

  function renderCases() {
    if (!caseTrack || typeof CASE_STUDIES === "undefined") return;

    caseTrack.innerHTML = CASE_STUDIES.map((item) => {
      const meta = TRACK_META[item.track] || {};
      return `
        <article class="case-card" style="--case-color:${meta.color || "var(--text-muted)"}">
          <span class="case-track">${meta.label || item.track}</span>
          <span class="case-client">${item.client}</span>
          <h4>${item.title}</h4>
          <p>${item.description}</p>
          <span class="case-result">${item.result}</span>
        </article>
      `;
    }).join("");
  }
  renderCases();

  document.querySelectorAll(".carousel-wrap").forEach((wrap) => {
    const track = wrap.querySelector(".carousel-track");
    const prev = wrap.querySelector('[data-dir="prev"]');
    const next = wrap.querySelector('[data-dir="next"]');
    if (!track) return;

    const scrollByCard = (dir) => {
      const card = track.querySelector(".case-card");
      const gap = 18;
      const distance = card ? card.getBoundingClientRect().width + gap : 320;
      track.scrollBy({ left: dir * distance, behavior: "smooth" });
    };

    prev && prev.addEventListener("click", () => scrollByCard(-1));
    next && next.addEventListener("click", () => scrollByCard(1));
  });

  const testimonialGrid = document.querySelector("[data-testimonials]");

  function renderTestimonials() {
    if (!testimonialGrid || typeof TESTIMONIALS === "undefined") return;

    testimonialGrid.innerHTML = TESTIMONIALS.map(
      (t) => `
        <article class="testimonial-card">
          <p class="quote">"${t.quote}"</p>
          <div class="testimonial-meta">
            <span class="t-name">${t.name}</span>
            <span class="t-role">${t.role}</span>
          </div>
        </article>
      `,
    ).join("");
  }
  renderTestimonials();

  const yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
(function initPrismFrames() {
  const canvas = document.getElementById("prismCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const container = canvas.parentElement;

  const FRAME_COUNT = 177;
  const FRAME_PATH = "assets/frames/";
  const FRAME_EXT = "png";
  const FRAME_PADDING = 4;

  let frames = [];
  let isReady = false;
  let currentFrame = 0;
  let targetFrame = 0;
  let animationFrame = null;
  let isIdle = false;
  let loadedCount = 0;

  const SMOOTHING = 0.12;
  const IDLE_RETURN_SPEED = 0.03;
  const PRELOAD_RADIUS = 15;

  function padNumber(num, length) {
    return String(num).padStart(length, "0");
  }

  function loadFrame(index) {
    if (index < 0 || index >= FRAME_COUNT) return;
    if (frames[index] && frames[index].complete) return;

    const img = new Image();
    const frameNum = padNumber(index + 1, FRAME_PADDING);
    img.src = `${FRAME_PATH}frame-${frameNum}.${FRAME_EXT}`;

    img.onload = function () {
      loadedCount++;
      if (loadedCount >= FRAME_COUNT) {
        isReady = true;
        console.log("✅ Все кадры загружены!");
      }
    };

    img.onerror = function () {
      console.warn(`⚠️ Кадр ${index + 1} не загрузился: ${img.src}`);
      loadedCount++;
    };

    frames[index] = img;
  }

  function loadInitialFrames() {
    const center = Math.floor(FRAME_COUNT / 2);
    const start = Math.max(0, center - 20);
    const end = Math.min(FRAME_COUNT - 1, center + 20);

    for (let i = start; i <= end; i++) {
      loadFrame(i);
    }

    loadFrame(0);
    loadFrame(FRAME_COUNT - 1);
  }

  function preloadNearbyFrames(index) {
    const start = Math.max(0, index - PRELOAD_RADIUS);
    const end = Math.min(FRAME_COUNT - 1, index + PRELOAD_RADIUS);

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
      preloadNearbyFrames(Math.round(currentFrame));

      animationFrame = requestAnimationFrame(update);
    }

    update();
  }

  document.addEventListener("mousemove", function (e) {
    isIdle = false;
    const mouseX = e.clientX / window.innerWidth;
    targetFrame = mouseX * (FRAME_COUNT - 1);
    targetFrame = Math.min(Math.max(targetFrame, 0), FRAME_COUNT - 1);
  });

  document.addEventListener("mouseleave", function () {
    isIdle = true;
  });

  document.addEventListener("visibilitychange", function () {
    if (document.hidden && animationFrame) {
      cancelAnimationFrame(animationFrame);
      animationFrame = null;
    } else if (!document.hidden && !animationFrame) {
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

    drawFrame(currentFrame);
  }

  window.addEventListener("resize", resizeCanvas);
  window.addEventListener("load", function () {
    setTimeout(resizeCanvas, 100);
  });

  loadInitialFrames();
  startAnimationLoop();

  setTimeout(function () {
    console.log(`📊 Загружено кадров: ${loadedCount}/${FRAME_COUNT}`);
    if (loadedCount === 0) {
      console.error(
        "❌ НИ ОДИН КАДР НЕ ЗАГРУЗИЛСЯ! Проверь путь: assets/frames/frame-0001.png",
      );
    }
  }, 3000);
})();

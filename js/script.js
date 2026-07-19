(() => {
  "use strict";

  /* ---------- Header scroll state ---------- */
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

  /* ---------- Mobile nav drawer ---------- */
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

  /* ---------- Scroll reveal ---------- */
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
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- Render case studies from data.js ---------- */
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

  /* ---------- Carousel controls ---------- */
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

  /* ---------- Render testimonials from data.js ---------- */
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
      `
    ).join("");
  }
  renderTestimonials();

  /* ---------- Footer year ---------- */
  const yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();

// ==========================================================================
// RENDER — case studies, testimonials, carousel controls, footer year
// Depends on CASE_STUDIES / TRACK_META / TESTIMONIALS from js/data.js
// ==========================================================================
(() => {
  "use strict";

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

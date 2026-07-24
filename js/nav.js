// ==========================================================================
// NAV — header scroll state, floating panel visibility, mobile drawer toggle
// ==========================================================================
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
})();

document.addEventListener(
  "wheel",
  function (e) {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
    }
  },
  { passive: false },
);

document.addEventListener("keydown", function (e) {
  if (
    (e.ctrlKey || e.metaKey) &&
    (e.key === "+" || e.key === "-" || e.key === "=" || e.key === "_")
  ) {
    e.preventDefault();
  }
});

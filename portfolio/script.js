// Small enhancements: theme toggle, mobile menu, waveform, scroll reveal.
(function () {
  const root = document.documentElement;

  // ----- Theme -----
  try {
    const saved = localStorage.getItem("theme");
    if (saved) root.setAttribute("data-theme", saved);
  } catch (e) {}

  document.getElementById("themeToggle").addEventListener("click", () => {
    const current = root.getAttribute("data-theme") ||
      (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const next = current === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
  });

  // ----- Mobile menu -----
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  navToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(open));
  });
  navLinks.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      navLinks.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    })
  );

  // ----- Nav border on scroll -----
  const nav = document.querySelector(".nav");
  const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // ----- Waveform bars -----
  const wave = document.getElementById("wave");
  if (wave) {
    const bars = 48;
    for (let i = 0; i < bars; i++) {
      const t = i / (bars - 1);
      // Speech-like envelope: a few bursts with some variation
      const env =
        0.25 +
        0.75 * Math.abs(Math.sin(t * Math.PI * 2.4)) *
        (0.55 + 0.45 * Math.sin(t * Math.PI));
      const h = Math.max(12, Math.min(100, env * 100 * (0.7 + Math.random() * 0.3)));
      const s = document.createElement("span");
      s.style.setProperty("--h", h.toFixed(1));
      s.style.setProperty("--d", (-(Math.random() * 1.6)).toFixed(2) + "s");
      wave.appendChild(s);
    }
  }

  // ----- Active nav link + reveal -----
  const sections = document.querySelectorAll("main section[id]");
  const links = navLinks.querySelectorAll("a[href^='#']");
  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            links.forEach((l) =>
              l.classList.toggle("is-active", l.getAttribute("href") === "#" + entry.target.id)
            );
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => spy.observe(s));

    const revealEls = document.querySelectorAll(
      ".section__label, .about__body, .role, .edu-card, .cert, .skill-group, .contact__inner"
    );
    revealEls.forEach((el) => el.classList.add("reveal"));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  // ----- Year -----
  document.getElementById("year").textContent = new Date().getFullYear();
})();

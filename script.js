// Smooth scroll for navigation links
document.addEventListener("DOMContentLoaded", function () {
  // Mark page as ready for CSS load animations
  document.body.classList.add("is-loaded");

  // Background cursor glow
  const cursorGlow = document.getElementById("cursorGlow");
  const isCoarsePointer =
    window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
  const prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (cursorGlow && !isCoarsePointer && !prefersReducedMotion) {
    let targetX = -999;
    let targetY = -999;
    let rafId = null;

    const render = () => {
      rafId = null;
      document.documentElement.style.setProperty("--cursor-x", `${targetX}px`);
      document.documentElement.style.setProperty("--cursor-y", `${targetY}px`);
    };

    const queueRender = () => {
      if (rafId != null) return;
      rafId = window.requestAnimationFrame(render);
    };

    window.addEventListener(
      "mousemove",
      (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
        cursorGlow.classList.add("is-visible");
        queueRender();
      },
      { passive: true }
    );

    window.addEventListener(
      "mouseleave",
      () => {
        cursorGlow.classList.remove("is-visible");
      },
      { passive: true }
    );

    // If a touch happens, hide it (prevents odd behavior on hybrid devices)
    window.addEventListener(
      "touchstart",
      () => {
        cursorGlow.classList.remove("is-visible");
      },
      { passive: true }
    );
  }

  // Smooth scroll for all navigation links (state bar)
  document.querySelectorAll(".state-nav a[href^='#']").forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href") || "";
      if (!href.startsWith("#")) return;

      const targetSection = document.querySelector(href);
      if (!targetSection) return;

      e.preventDefault();
      targetSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  });

  // Add active state to navigation items on scroll
  const sections = document.querySelectorAll(".section, .hero");
  const navLinks = document.querySelectorAll(".state-nav a[href^='#']");

  window.addEventListener("scroll", () => {
    let current = "";
    const scrollOffset = window.innerHeight * 0.2; // Responsive offset based on viewport

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.pageYOffset >= sectionTop - scrollOffset) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === "#" + current) {
        link.classList.add("active");
      }
    });
  });

  // Scroll-to-top button
  const scrollTopBtn = document.getElementById("scrollTopBtn");
  if (scrollTopBtn) {
    const toggleScrollTopBtn = () => {
      const shouldShow = window.scrollY > 300;
      scrollTopBtn.classList.toggle("is-visible", shouldShow);
    };

    toggleScrollTopBtn();

    window.addEventListener(
      "scroll",
      () => {
        toggleScrollTopBtn();
      },
      { passive: true }
    );

    scrollTopBtn.addEventListener("click", () => {
      const reduceMotion =
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      window.scrollTo({
        top: 0,
        behavior: reduceMotion ? "auto" : "smooth",
      });
    });
  }

  // Photo gallery (horizontal scroll + arrows + dots) - supports multiple instances
  const reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Scroll-reveal animations (sections/cards)
  const initScrollReveal = () => {
    const revealTargets = [
      ...document.querySelectorAll(
        ".section-title, #aboutText, #portfolioIntro, .portfolio-item, .photo-card, .contact-actions, .contact-info"
      ),
    ];

    // Footer should never be hidden by reveal behavior
    document.querySelectorAll("footer, footer *").forEach((el) => {
      el.classList.remove("reveal", "reveal--scale", "is-revealed");
    });

    // Skip if nothing to reveal
    if (revealTargets.length === 0) return;

    // If user prefers reduced motion, show everything immediately
    if (reduceMotion) {
      revealTargets.forEach((el) => {
        el.classList.add("is-revealed");
      });
      return;
    }

    revealTargets.forEach((el) => {
      if (!el.classList.contains("reveal")) el.classList.add("reveal");

      // Slightly richer motion for cards
      if (
        el.classList.contains("portfolio-item") ||
        el.classList.contains("photo-card") ||
        el.classList.contains("contact-info")
      ) {
        el.classList.add("reveal--scale");
      }
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Replay on every re-entry: remove class when leaving, add when entering.
          if (entry.isIntersecting) {
            // Restart animation even if it was just on.
            entry.target.classList.remove("is-revealed");
            // Force a reflow so the animation can restart reliably.
            // eslint-disable-next-line no-unused-expressions
            entry.target.offsetWidth;
            entry.target.classList.add("is-revealed");
          } else {
            entry.target.classList.remove("is-revealed");
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    revealTargets.forEach((el) => observer.observe(el));
  };

  const initPhotoGallery = (galleryRoot) => {
    const track = galleryRoot.querySelector(".photo-gallery-track");
    const prevBtn = galleryRoot.querySelector(".gallery-arrow--left");
    const nextBtn = galleryRoot.querySelector(".gallery-arrow--right");
    const dotsRoot = galleryRoot.querySelector(".photo-gallery-dots");

    if (!track || !prevBtn || !nextBtn || !dotsRoot) return;

    const cards = Array.from(track.querySelectorAll(".photo-card"));
    if (cards.length === 0) return;

    const getGapPx = () => {
      const styles = window.getComputedStyle(track);
      const gap = styles.gap || styles.columnGap || "0px";
      const parsed = parseFloat(gap);
      return Number.isFinite(parsed) ? parsed : 0;
    };

    const getTrackPaddingLeft = () => {
      const styles = window.getComputedStyle(track);
      const parsed = parseFloat(styles.paddingLeft || "0px");
      return Number.isFinite(parsed) ? parsed : 0;
    };

    const getScrollStep = () => {
      const first = cards[0];
      if (!first) return Math.max(240, track.clientWidth * 0.85);
      return first.getBoundingClientRect().width + getGapPx();
    };

    const setArrowState = () => {
      const maxScrollLeft = track.scrollWidth - track.clientWidth;
      prevBtn.disabled = track.scrollLeft <= 1;
      nextBtn.disabled = track.scrollLeft >= maxScrollLeft - 1;
    };

    const setActiveDot = (activeIndex) => {
      const dots = Array.from(dotsRoot.querySelectorAll(".photo-dot"));
      dots.forEach((dot, idx) => {
        const isActive = idx === activeIndex;
        const dist = Math.abs(idx - activeIndex);

        dot.classList.toggle("is-active", isActive);
        dot.setAttribute("aria-current", isActive ? "true" : "false");

        // Instagram-like: dots shrink as they go farther from active
        let scale = 1;
        let opacity = 0.75;

        if (dist === 0) {
          scale = 1.2;
          opacity = 1;
        } else if (dist === 1) {
          scale = 1;
          opacity = 0.85;
        } else if (dist === 2) {
          scale = 0.85;
          opacity = 0.7;
        } else if (dist === 3) {
          scale = 0.7;
          opacity = 0.55;
        } else {
          scale = 0.55;
          opacity = 0.4;
        }

        dot.style.transform = `scale(${scale})`;
        dot.style.opacity = String(opacity);
      });
    };

    const getActiveIndexFromViewport = () => {
      const trackRect = track.getBoundingClientRect();
      const trackCenter = trackRect.left + trackRect.width / 2;
      let bestIndex = 0;
      let bestDist = Number.POSITIVE_INFINITY;

      cards.forEach((card, idx) => {
        const rect = card.getBoundingClientRect();
        const center = rect.left + rect.width / 2;
        const dist = Math.abs(center - trackCenter);
        if (dist < bestDist) {
          bestDist = dist;
          bestIndex = idx;
        }
      });

      return bestIndex;
    };

    const scrollToIndex = (idx) => {
      const card = cards[idx];
      if (!card) return;

      const paddingLeft = getTrackPaddingLeft();
      track.scrollTo({
        left: card.offsetLeft - paddingLeft,
        behavior: reduceMotion ? "auto" : "smooth",
      });
    };

    // Build dots
    dotsRoot.innerHTML = "";
    cards.forEach((_, idx) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "photo-dot";
      dot.setAttribute("aria-label", `Go to photo ${idx + 1}`);
      dot.addEventListener("click", () => scrollToIndex(idx));
      dotsRoot.appendChild(dot);
    });

    // Initial state
    setArrowState();
    setActiveDot(getActiveIndexFromViewport());

    // Arrow handlers
    prevBtn.addEventListener("click", () => {
      track.scrollBy({
        left: -getScrollStep(),
        behavior: reduceMotion ? "auto" : "smooth",
      });
    });

    nextBtn.addEventListener("click", () => {
      track.scrollBy({
        left: getScrollStep(),
        behavior: reduceMotion ? "auto" : "smooth",
      });
    });

    // Sync dots + disable arrows on scroll
    let rafId = null;
    track.addEventListener(
      "scroll",
      () => {
        if (rafId != null) return;
        rafId = window.requestAnimationFrame(() => {
          rafId = null;
          setArrowState();
          setActiveDot(getActiveIndexFromViewport());
        });
      },
      { passive: true }
    );

    window.addEventListener(
      "resize",
      () => {
        setArrowState();
        setActiveDot(getActiveIndexFromViewport());
      },
      { passive: true }
    );
  };

  document
    .querySelectorAll(".photo-gallery")
    .forEach((gallery) => initPhotoGallery(gallery));

  // Projects carousel (horizontal scroll + arrows + dots)
  const initProjectsCarousel = (projectsRoot) => {
    const track = projectsRoot.querySelector(".projects-track");
    const prevBtn = projectsRoot.querySelector(".gallery-arrow--left");
    const nextBtn = projectsRoot.querySelector(".gallery-arrow--right");
    const dotsRoot = projectsRoot.querySelector(".projects-dots");

    const itemLabel =
      projectsRoot.getAttribute("data-item-label") ||
      projectsRoot.getAttribute("aria-label") ||
      "project";

    if (!track || !prevBtn || !nextBtn || !dotsRoot) return;

    const cards = Array.from(track.querySelectorAll(".project-card"));
    if (cards.length === 0) return;

    const getGapPx = () => {
      const styles = window.getComputedStyle(track);
      const gap = styles.gap || styles.columnGap || "0px";
      const parsed = parseFloat(gap);
      return Number.isFinite(parsed) ? parsed : 0;
    };

    const getTrackPaddingLeft = () => {
      const styles = window.getComputedStyle(track);
      const parsed = parseFloat(styles.paddingLeft || "0px");
      return Number.isFinite(parsed) ? parsed : 0;
    };

    const getScrollStep = () => {
      const first = cards[0];
      if (!first) return Math.max(280, track.clientWidth * 0.9);
      return first.getBoundingClientRect().width + getGapPx();
    };

    const setArrowState = () => {
      const maxScrollLeft = track.scrollWidth - track.clientWidth;
      prevBtn.disabled = track.scrollLeft <= 1;
      nextBtn.disabled = track.scrollLeft >= maxScrollLeft - 1;
    };

    const setActiveDot = (activeIndex) => {
      const dots = Array.from(dotsRoot.querySelectorAll(".photo-dot"));
      dots.forEach((dot, idx) => {
        const isActive = idx === activeIndex;
        dot.classList.toggle("is-active", isActive);
        dot.setAttribute("aria-current", isActive ? "true" : "false");
      });
    };

    const getActiveIndexFromViewport = () => {
      const trackRect = track.getBoundingClientRect();
      const trackCenter = trackRect.left + trackRect.width / 2;
      let bestIndex = 0;
      let bestDist = Number.POSITIVE_INFINITY;

      cards.forEach((card, idx) => {
        const rect = card.getBoundingClientRect();
        const center = rect.left + rect.width / 2;
        const dist = Math.abs(center - trackCenter);
        if (dist < bestDist) {
          bestDist = dist;
          bestIndex = idx;
        }
      });

      return bestIndex;
    };

    const scrollToIndex = (idx) => {
      const card = cards[idx];
      if (!card) return;

      const paddingLeft = getTrackPaddingLeft();
      track.scrollTo({
        left: card.offsetLeft - paddingLeft,
        behavior: reduceMotion ? "auto" : "smooth",
      });
    };

    // Build dots (one per project)
    dotsRoot.innerHTML = "";
    cards.forEach((_, idx) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "photo-dot";
      dot.setAttribute("aria-label", `Go to ${itemLabel} ${idx + 1}`);
      dot.addEventListener("click", () => scrollToIndex(idx));
      dotsRoot.appendChild(dot);
    });

    // Initial state
    setArrowState();
    setActiveDot(getActiveIndexFromViewport());

    prevBtn.addEventListener("click", () => {
      track.scrollBy({
        left: -getScrollStep(),
        behavior: reduceMotion ? "auto" : "smooth",
      });
    });

    nextBtn.addEventListener("click", () => {
      track.scrollBy({
        left: getScrollStep(),
        behavior: reduceMotion ? "auto" : "smooth",
      });
    });

    let rafId = null;
    track.addEventListener(
      "scroll",
      () => {
        if (rafId != null) return;
        rafId = window.requestAnimationFrame(() => {
          rafId = null;
          setArrowState();
          setActiveDot(getActiveIndexFromViewport());
        });
      },
      { passive: true }
    );

    window.addEventListener(
      "resize",
      () => {
        setArrowState();
        setActiveDot(getActiveIndexFromViewport());
      },
      { passive: true }
    );
  };

  document
    .querySelectorAll(".projects")
    .forEach((projects) => initProjectsCarousel(projects));

  initScrollReveal();

  console.log("Portfolio website loaded successfully!");
  console.log("All content is editable via IDs for easy customization.");
});

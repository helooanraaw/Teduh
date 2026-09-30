/**
 * TEDUH DIGITAL PLATFORM
 * Berkas: js/home.js
 * Deskripsi: Pengendali Halaman Beranda, Transisi Testimoni, Hero Visual & Interaksi UI
 *
 * ==========================================================================
 * SUMBER KARYA & ATRIBUSI MEDIA / ASET:
 * 1. Aset Visual & Foto (assets/*): Dihasilkan via Generative AI (Banana AI).
 * 2. Desain Logo: Dibuat mandiri via Canva oleh tim pengembang.
 * 3. Pustaka Eksternal: jQuery 3.7.1 CDN (MIT License).
 * ==========================================================================
 */
document.addEventListener("DOMContentLoaded", () => {
  initStatsCounter();
  initAboutChecklistAccordion();
  initProblemSwitcher();
  initFeaturesAccordion();
  initFaqAccordion();
  initTestimonialGallery();
  initMobileNav();
  syncHomeUserProfile();
  initScrollReveal();
});

function syncHomeUserProfile() {
  if (typeof TEDUH_DATA !== "undefined" && TEDUH_DATA.getUserData) {
    const user = TEDUH_DATA.getUserData();
    const pointsEl = document.getElementById("indexNavPointsValue");
    if (pointsEl && user && user.points !== undefined) {
      pointsEl.textContent = `${user.points.toLocaleString("id-ID")} Poin`;
    }
  }
}

function initStatsCounter() {
  const statElements = document.querySelectorAll("[data-target]");
  if (!statElements.length) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseFloat(el.getAttribute("data-target"));
          const prefix = el.getAttribute("data-prefix") || "";
          const suffix = el.getAttribute("data-suffix") || "";
          const isK = el.getAttribute("data-format") === "k";
          const isDecimal = target % 1 !== 0;

          let start = 0;
          const duration = 1600;
          const startTime = performance.now();

          function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentVal = start + (target - start) * easeProgress;

            let displayVal;
            if (isK) {
              displayVal = (currentVal / 1000).toFixed(1) + "K";
            } else if (isDecimal) {
              displayVal = currentVal.toFixed(1);
            } else {
              displayVal = Math.floor(currentVal).toLocaleString("id-ID");
            }

            el.textContent = `${prefix}${displayVal}${suffix}`;

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              const finalVal = isK
                ? (target / 1000).toFixed(1) + "K"
                : isDecimal
                  ? target.toFixed(1)
                  : target.toLocaleString("id-ID");
              el.textContent = `${prefix}${finalVal}${suffix}`;
            }
          }

          requestAnimationFrame(updateCounter);
          obs.unobserve(el);
        }
      });
    },
    { threshold: 0.25 },
  );

  statElements.forEach((el) => observer.observe(el));
}

function initProblemSwitcher() {
  const probItems = document.querySelectorAll(
    ".prob-list-item, .prob-list-item-2",
  );
  const probImages = document.querySelectorAll(
    ".problem-img-wrapper .problem-img-1to1",
  );
  if (!probItems.length || !probImages.length) return;

  function switchProblemImage(item, index) {
    probItems.forEach((i, idx) => {
      const isCurrent = i === item || idx === index;
      i.classList.toggle("active", isCurrent);
      i.setAttribute("aria-selected", isCurrent ? "true" : "false");
    });

    probImages.forEach((img, idx) => {
      const isCurrent = idx === index;
      img.classList.toggle("active", isCurrent);
    });
  }

  probItems.forEach((item, idx) => {
    item.addEventListener("mouseenter", () => {
      switchProblemImage(item, idx);
    });

    item.addEventListener("click", () => {
      switchProblemImage(item, idx);
    });

    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        switchProblemImage(item, idx);
      }
    });
  });
}

function initFeaturesAccordion() {
  const items = document.querySelectorAll(".acc-item");
  const previewImg = document.getElementById("featureImagePreview");
  const nextImg = document.getElementById("featureImageNext");
  if (!items.length || !previewImg) return;

  let isSwitching = false;
  let switchTimeout = null;

  function activateFeature(item) {
    const newImg = item.getAttribute("data-img");
    if (!newImg) return;

    items.forEach((i) => {
      const isCurrent = i === item;
      i.classList.toggle("active", isCurrent);
      i.setAttribute("aria-expanded", isCurrent ? "true" : "false");
    });

    const currentSrc = previewImg.getAttribute("src");
    if (newImg === currentSrc && (!nextImg || !nextImg.classList.contains("is-entering"))) {
      return;
    }

    if (nextImg) {
      if (switchTimeout) clearTimeout(switchTimeout);
      isSwitching = true;
      nextImg.src = newImg;
      requestAnimationFrame(() => {
        nextImg.classList.add("is-entering");
      });

      switchTimeout = setTimeout(() => {
        previewImg.src = newImg;
        nextImg.style.transition = "none";
        nextImg.classList.remove("is-entering");
        void nextImg.offsetWidth;
        nextImg.style.transition = "";
        isSwitching = false;
      }, 340);
    } else {
      previewImg.style.opacity = "0";
      setTimeout(() => {
        previewImg.src = newImg;
        previewImg.style.opacity = "1";
      }, 160);
    }
  }

  items.forEach((item) => {
    const header = item.querySelector(".acc-header");
    if (!header) return;

    header.addEventListener("click", () => {
      activateFeature(item);
    });
  });
}

function initFaqAccordion() {
  const items = document.querySelectorAll(".faq-item");
  if (!items.length) return;

  items.forEach((item) => {
    const header = item.querySelector(".faq-header");
    if (!header) return;

    header.addEventListener("click", () => {
      const isActive = item.classList.contains("active");
      items.forEach((i) => i.classList.remove("active"));
      if (!isActive) {
        item.classList.add("active");
      }
    });
  });
}

function initTestimonialGallery() {
  const gallery = document.querySelector("[data-testimonial-gallery]");
  const items = [...document.querySelectorAll("[data-testimonial-item]")];
  const prevBtn = document.querySelector("[data-testimonial-previous]");
  const nextBtn = document.querySelector("[data-testimonial-next]");
  const quoteEl = document.querySelector("[data-testimonial-quote]");
  const nameEl = document.querySelector("[data-testimonial-name]");
  const roleEl = document.querySelector("[data-testimonial-role]");
  const contentEl = document.querySelector("[data-testimonial-quote-content]");

  if (
    !gallery ||
    items.length !== 4 ||
    !prevBtn ||
    !nextBtn ||
    !quoteEl ||
    !nameEl ||
    !roleEl ||
    !contentEl
  ) {
    return;
  }

  let activeIndex = items.findIndex(
    (item) => item.getAttribute("aria-pressed") === "true",
  );
  if (activeIndex < 0) activeIndex = 0;
  let isTransitioning = false;
  let transitionTimeout = null;

  function updateSlots(index, direction = "next", isInitial = false) {
    const count = items.length;
    const active = ((index % count) + count) % count;
    const previous = (active - 1 + count) % count;
    const next = (active + 1) % count;

    items.forEach((item, i) => {
      let slot = "hidden-before";
      if (i === previous) slot = "previous";
      else if (i === active) slot = "active";
      else if (i === next) slot = "next";
      else slot = direction === "previous" ? "hidden-after" : "hidden-before";

      const isActive = slot === "active";
      const isHidden = slot.startsWith("hidden");

      item.dataset.testimonialSlot = slot;
      item.setAttribute("aria-pressed", String(isActive));
      item.setAttribute("aria-hidden", String(isHidden));
      item.tabIndex = isHidden ? -1 : 0;
    });

    if (isInitial) {
      const activeItem = items[active];
      quoteEl.textContent = activeItem.dataset.quote;
      nameEl.textContent = activeItem.dataset.name;
      roleEl.textContent = activeItem.dataset.role;
      activeIndex = active;
      return;
    }

    contentEl.classList.add("is-changing");
    if (transitionTimeout) clearTimeout(transitionTimeout);

    setTimeout(() => {
      const activeItem = items[active];
      quoteEl.textContent = activeItem.dataset.quote;
      nameEl.textContent = activeItem.dataset.name;
      roleEl.textContent = activeItem.dataset.role;
      contentEl.classList.remove("is-changing");
    }, 160);

    transitionTimeout = setTimeout(() => {
      isTransitioning = false;
    }, 520);

    activeIndex = active;
  }

  items.forEach((item, i) => {
    item.addEventListener("click", () => {
      if (i === activeIndex || isTransitioning) return;
      isTransitioning = true;
      const direction =
        (i > activeIndex && !(activeIndex === 0 && i === 3)) ||
        (activeIndex === 3 && i === 0)
          ? "next"
          : "previous";
      updateSlots(i, direction);
    });
  });

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      if (isTransitioning) return;
      isTransitioning = true;
      updateSlots(activeIndex - 1, "previous");
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (isTransitioning) return;
      isTransitioning = true;
      updateSlots(activeIndex + 1, "next");
    });
  }

  let touchStartX = 0;
  let touchStartY = 0;
  gallery.addEventListener(
    "touchstart",
    (e) => {
      if (e.touches && e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    },
    { passive: true },
  );

  gallery.addEventListener(
    "touchend",
    (e) => {
      if (e.changedTouches && e.changedTouches.length === 1) {
        const deltaX = touchStartX - e.changedTouches[0].clientX;
        const deltaY = touchStartY - e.changedTouches[0].clientY;
        if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
          if (isTransitioning) return;
          isTransitioning = true;
          if (deltaX > 0) {
            updateSlots(activeIndex + 1, "next");
          } else {
            updateSlots(activeIndex - 1, "previous");
          }
        }
      }
    },
    { passive: true },
  );

  gallery.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      if (isTransitioning) return;
      isTransitioning = true;
      updateSlots(activeIndex - 1, "previous");
    } else if (e.key === "ArrowRight") {
      if (isTransitioning) return;
      isTransitioning = true;
      updateSlots(activeIndex + 1, "next");
    }
  });

  updateSlots(activeIndex, "next", true);
}

function initAboutChecklistAccordion() {
  const checklist = document.querySelector(".about-checklist");
  const items = document.querySelectorAll(".about-check-item");
  if (!checklist || !items.length) return;

  function activateItem(activeItem) {
    items.forEach((item) => {
      const isTarget = item === activeItem;
      if (isTarget) {
        item.classList.add("is-active");
        item.setAttribute("aria-expanded", "true");
      } else {
        item.classList.remove("is-active");
        item.setAttribute("aria-expanded", "false");
      }
    });
  }

  function deactivateAll() {
    items.forEach((item) => {
      item.classList.remove("is-active");
      item.setAttribute("aria-expanded", "false");
    });
  }

  items.forEach((item) => {
    item.addEventListener("mouseenter", () => {
      activateItem(item);
    });

    item.addEventListener("click", () => {
      if (item.classList.contains("is-active")) {
        deactivateAll();
      } else {
        activateItem(item);
      }
    });

    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (item.classList.contains("is-active")) {
          deactivateAll();
        } else {
          activateItem(item);
        }
      }
    });
  });

  checklist.addEventListener("mouseleave", () => {
    deactivateAll();
  });
}

function initMobileNav() {}

function initScrollReveal() {
  const revealElements = document.querySelectorAll("[data-reveal]");
  revealElements.forEach((el) => el.classList.add("is-revealed"));
}

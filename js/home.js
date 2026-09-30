/**
 * TEDUH DIGITAL PLATFORM
 * Berkas: js/home.js
 * Deskripsi: Pengendali Halaman Beranda, Transisi Testimoni, Hero Visual & Interaksi UI
 *
 * ==========================================================================
 * SUMBER KARYA & ATRIBUSI MEDIA / ASET VISUAL (OPEN LICENSE):
 * 1. Pustaka & Framework Eksternal:
 *    - GSAP & ScrollTrigger: GreenSock (Standard Web Animation License).
 *    - Lenis Smooth Scroll: Studio Freight / Darkroom Engineering (MIT License).
 *    - Leaflet.js: Vladimir Agafonkin (BSD-2-Clause License).
 * 2. Layanan Peta & Citra Satelit:
 *    - Google Hybrid Satellite Map Tile Server (Google Maps / Earth Engine).
 *    - CartoDB Dark Matter & Voyager Tiles: CartoDB & Kontributor OpenStreetMap (CC BY 3.0 / ODbL).
 * 3. Media Fotografi & Dokumentasi Lapangan (assets/*):
 *    - Unsplash, Pexels, Wikimedia Commons, Freepik (Open License / CC BY-SA 4.0 / Free Commercial Rights).
 * 4. Identitas Grafis & Ilustrasi Digital:
 *    - Aset Vektor Orisinal & Maskot Tim Pengembang Teduh.
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
      pointsEl.textContent = `${user.points.toLocaleString()} Poin`;
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
              displayVal = Math.floor(currentVal).toLocaleString();
            }

            el.textContent = `${prefix}${displayVal}${suffix}`;

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              const finalVal = isK
                ? (target / 1000).toFixed(1) + "K"
                : isDecimal
                  ? target.toFixed(1)
                  : target.toLocaleString();
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
  if (!items.length) return;

  function activateFeature(item) {
    const newImg = item.getAttribute("data-img");

    items.forEach((i) => {
      const isCurrent = i === item;
      i.classList.toggle("active", isCurrent);
      i.setAttribute("aria-expanded", isCurrent ? "true" : "false");
    });

    if (previewImg && newImg && previewImg.getAttribute("src") !== newImg) {
      previewImg.style.opacity = "0";
      previewImg.style.transform = "scale(0.98)";
      setTimeout(() => {
        previewImg.src = newImg;
        previewImg.style.opacity = "1";
        previewImg.style.transform = "scale(1)";
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
  const quoteCard = document.querySelector(".testimonial__quote-card");
  const quoteMark = document.querySelector(".testimonial__quote-mark");

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

  function updateSlots(index, direction = "next", isInitial = false) {
    const hasGSAP = typeof gsap !== "undefined";
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

      if (hasGSAP) {
        gsap.set(activeItem, {
          scale: 1,
          rotateY: 0,
          z: 0,
          filter: "brightness(1) contrast(1)",
        });
        const activeImg = activeItem.querySelector("img");
        if (activeImg) {
          gsap.set(activeImg, { scale: 1, xPercent: 0, rotate: 0 });
        }

        items.forEach((item, i) => {
          if (i === active) return;
          const img = item.querySelector("img");
          const isPrev = i === previous;
          const isNxt = i === next;

          gsap.set(item, {
            scale: 0.92,
            rotateY: isPrev ? -10 : isNxt ? 10 : 0,
            z: -20,
            filter: "grayscale(0.18) brightness(0.85)",
          });

          if (img) {
            gsap.set(img, {
              scale: 1.08,
              xPercent: isPrev ? -6 : isNxt ? 6 : 0,
              rotate: 0,
            });
          }
        });
      }
      return;
    }

    // 1. GSAP 3D Cinematic Perspective & Shutter Parallax pada Foto Galeri Warga
    if (hasGSAP) {
      const activeItem = items[active];
      const activeImg = activeItem.querySelector("img");

      // A. Animasi Kartu Foto Utama (Active Pop & 3D Depth Settle)
      gsap.fromTo(
        activeItem,
        {
          scale: 0.88,
          rotateY: direction === "next" ? 16 : -16,
          z: 40,
          filter: "brightness(1.18) contrast(1.05)",
        },
        {
          scale: 1,
          rotateY: 0,
          z: 0,
          filter: "brightness(1) contrast(1)",
          duration: 0.85,
          ease: "power4.out",
        },
      );

      // B. Counter-Parallax Shutter & Zoom Sweep pada Gambar Foto Aktif
      if (activeImg) {
        gsap.fromTo(
          activeImg,
          {
            scale: 1.28,
            xPercent: direction === "next" ? 22 : -22,
            rotate: direction === "next" ? 2 : -2,
          },
          {
            scale: 1,
            xPercent: 0,
            rotate: 0,
            duration: 0.9,
            ease: "expo.out",
          },
        );
      }

      // C. Kartu Samping (Previous, Next, & Hidden) Menyesuaikan Posisi 3D
      items.forEach((item, i) => {
        if (i === active) return;
        const img = item.querySelector("img");
        const isPrev = i === previous;
        const isNxt = i === next;

        gsap.to(item, {
          scale: 0.92,
          rotateY: isPrev ? -10 : isNxt ? 10 : 0,
          z: -20,
          filter: "grayscale(0.18) brightness(0.85)",
          duration: 0.75,
          ease: "power3.out",
        });

        if (img) {
          gsap.to(img, {
            scale: 1.08,
            xPercent: isPrev ? -6 : isNxt ? 6 : 0,
            rotate: 0,
            duration: 0.75,
            ease: "power3.out",
          });
        }
      });

      // D. Kontainer Kartu Ulasan Teks Tetap Stabil (Tanpa Skala/Perubahan Bentuk)


      // E. Animasi Tanda Kutip Dekoratif (Elastic Spin & Settle)
      if (quoteMark) {
        gsap.fromTo(
          quoteMark,
          {
            scale: 1.25,
            rotate: direction === "next" ? 14 : -14,
            opacity: 0.08,
          },
          {
            scale: 1,
            rotate: 0,
            opacity: 0.04,
            duration: 0.75,
            ease: "back.out(1.8)",
          },
        );
      }

      // 2. GSAP Cinematic Text Cascade (Flip Out -> Update -> Flip In)
      const outY = direction === "next" ? -14 : 14;
      const inY = direction === "next" ? 22 : -22;

      gsap.to([quoteEl, nameEl, roleEl], {
        opacity: 0,
        y: outY,
        duration: 0.22,
        stagger: 0.02,
        ease: "power2.in",
        onComplete: () => {
          const activeItemData = items[active];
          quoteEl.textContent = activeItemData.dataset.quote;
          nameEl.textContent = activeItemData.dataset.name;
          roleEl.textContent = activeItemData.dataset.role;

          gsap.fromTo(
            quoteEl,
            { opacity: 0, y: inY, rotateX: -8 },
            {
              opacity: 1,
              y: 0,
              rotateX: 0,
              duration: 0.65,
              ease: "power3.out",
            },
          );
          gsap.fromTo(
            nameEl,
            { opacity: 0, y: inY * 0.7, x: direction === "next" ? 14 : -14 },
            {
              opacity: 1,
              y: 0,
              x: 0,
              duration: 0.55,
              ease: "back.out(1.5)",
              delay: 0.06,
            },
          );
          gsap.fromTo(
            roleEl,
            { opacity: 0, y: inY * 0.5 },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: "power3.out",
              delay: 0.12,
              onComplete: () => {
                isTransitioning = false;
              },
            },
          );
        },
      });
    } else {
      contentEl.classList.add("is-changing");
      setTimeout(() => {
        const activeItem = items[active];
        quoteEl.textContent = activeItem.dataset.quote;
        nameEl.textContent = activeItem.dataset.name;
        roleEl.textContent = activeItem.dataset.role;
        contentEl.classList.remove("is-changing");
        isTransitioning = false;
      }, 180);
    }

    activeIndex = active;
  }

  // Interaktivitas Klik Foto
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

  // Tombol Ulasan Sebelumnya
  prevBtn.addEventListener("click", () => {
    if (isTransitioning) return;
    isTransitioning = true;

    // Animasi tombol bounce & icon nudge
    if (typeof gsap !== "undefined") {
      gsap.fromTo(
        prevBtn,
        { scale: 0.86 },
        { scale: 1, duration: 0.35, ease: "back.out(2)" },
      );
      const icon = prevBtn.querySelector("svg");
      if (icon) {
        gsap.fromTo(
          icon,
          { x: -5 },
          { x: 0, duration: 0.35, ease: "power2.out" },
        );
      }
    }

    updateSlots(activeIndex - 1, "previous");
  });

  // Tombol Ulasan Berikutnya
  nextBtn.addEventListener("click", () => {
    if (isTransitioning) return;
    isTransitioning = true;

    // Animasi tombol bounce & icon nudge
    if (typeof gsap !== "undefined") {
      gsap.fromTo(
        nextBtn,
        { scale: 0.86 },
        { scale: 1, duration: 0.35, ease: "back.out(2)" },
      );
      const icon = nextBtn.querySelector("svg");
      if (icon) {
        gsap.fromTo(
          icon,
          { x: 5 },
          { x: 0, duration: 0.35, ease: "power2.out" },
        );
      }
    }

    updateSlots(activeIndex + 1, "next");
  });

  updateSlots(activeIndex, "next", true);
}

function initMobileNav() {}

function initScrollReveal() {
  const revealElements = document.querySelectorAll("[data-reveal]");
  revealElements.forEach((el) => el.classList.add("is-revealed"));
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

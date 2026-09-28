/**
 * TEDUH DIGITAL PLATFORM - HOME INTERACTIVITY ENGINE (js/home.js)
 * Mengelola:
 * 1. Animated Stats Counter (IntersectionObserver)
 * 2. Interactive Features Accordion with Smooth Image Preview Switcher
 * 3. 3D Layered Testimonial Gallery (ala nut-lens-master)
 * 4. FAQ Accordion & Mobile Navigation Drawer
 * Disiplin: Bebas Em Dash, Mulus & Tanggap (UX-First)
 */

document.addEventListener('DOMContentLoaded', () => {
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
  if (typeof TEDUH_DATA !== 'undefined' && TEDUH_DATA.getUserData) {
    const user = TEDUH_DATA.getUserData();
    const pointsEl = document.getElementById('indexNavPointsValue');
    if (pointsEl && user && user.points !== undefined) {
      pointsEl.textContent = `${user.points.toLocaleString()} Poin`;
    }
  }
}

/* 1 · ANIMATED STATS COUNTER */
function initStatsCounter() {
  const statElements = document.querySelectorAll('[data-target]');
  if (!statElements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.getAttribute('data-target'));
        const prefix = el.getAttribute('data-prefix') || '';
        const suffix = el.getAttribute('data-suffix') || '';
        const isK = el.getAttribute('data-format') === 'k';
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
            displayVal = (currentVal / 1000).toFixed(1) + 'K';
          } else if (isDecimal) {
            displayVal = currentVal.toFixed(1);
          } else {
            displayVal = Math.floor(currentVal).toLocaleString();
          }

          el.textContent = `${prefix}${displayVal}${suffix}`;

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            const finalVal = isK ? (target / 1000).toFixed(1) + 'K' : (isDecimal ? target.toFixed(1) : target.toLocaleString());
            el.textContent = `${prefix}${finalVal}${suffix}`;
          }
        }

        requestAnimationFrame(updateCounter);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.25 });

  statElements.forEach(el => observer.observe(el));
}

/* 2 · INTERACTIVE PROBLEM IMAGE SWITCHER (Direct Seamless Crossfade) */
function initProblemSwitcher() {
  const probItems = document.querySelectorAll('.prob-list-item, .prob-list-item-2');
  const probImages = document.querySelectorAll('.problem-img-wrapper .problem-img-1to1');
  if (!probItems.length || !probImages.length) return;

  function switchProblemImage(item, index) {
    // Update active class & aria pada item kartu
    probItems.forEach((i, idx) => {
      const isCurrent = i === item || idx === index;
      i.classList.toggle('active', isCurrent);
      i.setAttribute('aria-selected', isCurrent ? 'true' : 'false');
    });

    // Pergantian gambar langsung dengan crossfade mulus tanpa blank/hilang out
    probImages.forEach((img, idx) => {
      const isCurrent = idx === index;
      img.classList.toggle('active', isCurrent);
    });
  }

  probItems.forEach((item, idx) => {
    // Hover langsung ganti foto tanpa delay/hilang out
    item.addEventListener('mouseenter', () => {
      switchProblemImage(item, idx);
    });

    // Click / touch toggle (responsive)
    item.addEventListener('click', () => {
      switchProblemImage(item, idx);
    });

    // Keyboard accessibility
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        switchProblemImage(item, idx);
      }
    });
  });
}

/* 3 · INTERACTIVE FEATURES ACCORDION WITH IMAGE SWITCHER */
function initFeaturesAccordion() {
  const items = document.querySelectorAll('.acc-item');
  const previewImg = document.getElementById('featureImagePreview');
  if (!items.length) return;

  function activateFeature(item) {
    const newImg = item.getAttribute('data-img');

    items.forEach(i => {
      const isCurrent = i === item;
      i.classList.toggle('active', isCurrent);
      i.setAttribute('aria-expanded', isCurrent ? 'true' : 'false');
    });

    if (previewImg && newImg && previewImg.getAttribute('src') !== newImg) {
      previewImg.style.opacity = '0';
      previewImg.style.transform = 'scale(0.98)';
      setTimeout(() => {
        previewImg.src = newImg;
        previewImg.style.opacity = '1';
        previewImg.style.transform = 'scale(1)';
      }, 160);
    }
  }

  items.forEach(item => {
    const header = item.querySelector('.acc-header');
    if (!header) return;

    header.addEventListener('click', () => {
      activateFeature(item);
    });
  });
}

/* 3 · FAQ ACCORDION */
function initFaqAccordion() {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach(item => {
    const header = item.querySelector('.faq-header');
    if (!header) return;

    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      items.forEach(i => i.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* 4 · 3D LAYERED TESTIMONIAL GALLERY (nut-lens-master) */
function initTestimonialGallery() {
  const gallery = document.querySelector('[data-testimonial-gallery]');
  const items = [...document.querySelectorAll('[data-testimonial-item]')];
  const prevBtn = document.querySelector('[data-testimonial-previous]');
  const nextBtn = document.querySelector('[data-testimonial-next]');
  const quoteEl = document.querySelector('[data-testimonial-quote]');
  const nameEl = document.querySelector('[data-testimonial-name]');
  const roleEl = document.querySelector('[data-testimonial-role]');
  const contentEl = document.querySelector('[data-testimonial-quote-content]');

  if (!gallery || items.length !== 4 || !prevBtn || !nextBtn || !quoteEl || !nameEl || !roleEl || !contentEl) {
    return;
  }

  let activeIndex = items.findIndex(item => item.getAttribute('aria-pressed') === 'true');
  if (activeIndex < 0) activeIndex = 0;

  function updateSlots(index, direction = 'next') {
    const count = items.length;
    const active = ((index % count) + count) % count;
    const previous = (active - 1 + count) % count;
    const next = (active + 1) % count;

    items.forEach((item, i) => {
      let slot = 'hidden-before';
      if (i === previous) slot = 'previous';
      else if (i === active) slot = 'active';
      else if (i === next) slot = 'next';
      else slot = direction === 'previous' ? 'hidden-after' : 'hidden-before';

      const isActive = slot === 'active';
      const isHidden = slot.startsWith('hidden');

      item.dataset.testimonialSlot = slot;
      item.setAttribute('aria-pressed', String(isActive));
      item.setAttribute('aria-hidden', String(isHidden));
      item.tabIndex = isHidden ? -1 : 0;
    });

    contentEl.classList.add('is-changing');
    setTimeout(() => {
      const activeItem = items[active];
      quoteEl.textContent = activeItem.dataset.quote;
      nameEl.textContent = activeItem.dataset.name;
      roleEl.textContent = activeItem.dataset.role;
      contentEl.classList.remove('is-changing');
    }, 180);

    activeIndex = active;
  }

  items.forEach((item, i) => {
    item.addEventListener('click', () => {
      if (i === activeIndex) return;
      const direction = (i > activeIndex && !(activeIndex === 0 && i === 3)) || (activeIndex === 3 && i === 0) ? 'next' : 'previous';
      updateSlots(i, direction);
    });
  });

  prevBtn.addEventListener('click', () => {
    updateSlots(activeIndex - 1, 'previous');
  });

  nextBtn.addEventListener('click', () => {
    updateSlots(activeIndex + 1, 'next');
  });

  updateSlots(activeIndex, 'next');
}

/* 5 · MOBILE NAVIGATION DRAWER - (Ditangani terpusat di js/main.js) */
function initMobileNav() {
  // Navigasi drawer mobile dikelola secara terpusat oleh initMobileNavigation() di js/main.js
}

/* 6 · SCROLL REVEAL & ENTRANCE ANIMATION ENGINE - Always 100% visible */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('[data-reveal]');
  revealElements.forEach(el => el.classList.add('is-revealed'));
}

/* 7 · INTERACTIVE ABOUT CHECKLIST ACCORDION */
function initAboutChecklistAccordion() {
  const checklist = document.querySelector('.about-checklist');
  const items = document.querySelectorAll('.about-check-item');
  if (!checklist || !items.length) return;

  function activateItem(activeItem) {
    items.forEach(item => {
      const isTarget = item === activeItem;
      if (isTarget) {
        item.classList.add('is-active');
        item.setAttribute('aria-expanded', 'true');
      } else {
        item.classList.remove('is-active');
        item.setAttribute('aria-expanded', 'false');
      }
    });
  }

  function deactivateAll() {
    items.forEach(item => {
      item.classList.remove('is-active');
      item.setAttribute('aria-expanded', 'false');
    });
  }

  items.forEach(item => {
    // Hover event for desktop
    item.addEventListener('mouseenter', () => {
      activateItem(item);
    });

    // Click / Tap toggle for mobile
    item.addEventListener('click', () => {
      if (item.classList.contains('is-active')) {
        deactivateAll();
      } else {
        activateItem(item);
      }
    });

    // Keyboard accessibility (Enter / Space)
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (item.classList.contains('is-active')) {
          deactivateAll();
        } else {
          activateItem(item);
        }
      }
    });
  });

  // Saat kursor meninggalkan area checklist pada desktop, tutup kembali
  checklist.addEventListener('mouseleave', () => {
    deactivateAll();
  });
}

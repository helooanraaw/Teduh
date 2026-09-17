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
        const isDecimal = target % 1 !== 0;

        let start = 0;
        const duration = 1600;
        const startTime = performance.now();

        function updateCounter(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easeProgress = 1 - Math.pow(1 - progress, 3);
          const currentVal = start + (target - start) * easeProgress;

          el.textContent = `${prefix}${isDecimal ? currentVal.toFixed(1) : Math.floor(currentVal).toLocaleString()}${suffix}`;

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            el.textContent = `${prefix}${isDecimal ? target.toFixed(1) : target.toLocaleString()}${suffix}`;
          }
        }

        requestAnimationFrame(updateCounter);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  statElements.forEach(el => observer.observe(el));
}

/* 2 · INTERACTIVE FEATURES ACCORDION */
function initFeaturesAccordion() {
  const items = document.querySelectorAll('.acc-item');
  if (!items.length) return;

  items.forEach(item => {
    const header = item.querySelector('.acc-header');
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

/* 6 · SCROLL REVEAL & ENTRANCE ANIMATION ENGINE - Disiplin Impeccable Motion: 60fps GPU Accelerated, Reduced Motion Compliant */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('[data-reveal]');
  if (!revealElements.length) return;

  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealElements.forEach(el => el.classList.add('is-revealed'));
    return;
  }

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -48px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseInt(el.getAttribute('data-delay') || '0', 10);
        if (delay > 0) {
          el.style.transitionDelay = `${delay}ms`;
        }
        el.classList.add('is-revealed');
        obs.unobserve(el);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      const delay = parseInt(el.getAttribute('data-delay') || '0', 10);
      setTimeout(() => {
        el.classList.add('is-revealed');
      }, delay + 60);
    } else {
      observer.observe(el);
    }
  });
}

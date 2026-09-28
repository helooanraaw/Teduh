/**
 * TEDUH DIGITAL PLATFORM - EDITORIAL SPATIAL PAGE TRANSITION & PROGRESS ENGINE (js/page-transition.js)
 * Seamless, hardware-accelerated curtain sweep transitions with Deep Laurel Pine (#1A382B)
 * Pure Client-Side, Zero Dependencies except GSAP, Safe against bfcache and external links
 */

(function() {
  'use strict';

  // Inject Overlay DOM Elements & Scroll Progress Bar
  function injectCurtainDOM() {
    // 1. Hairline Scroll Progress Bar
    if (!document.getElementById('teduhScrollProgressBar')) {
      const progressBar = document.createElement('div');
      progressBar.id = 'teduhScrollProgressBar';
      progressBar.setAttribute('aria-hidden', 'true');
      document.body.prepend(progressBar);
    }

    // 2. Curtain Overlay
    if (!document.getElementById('teduhCurtainOverlay')) {
      const overlay = document.createElement('div');
      overlay.id = 'teduhCurtainOverlay';
      overlay.setAttribute('aria-hidden', 'true');
      overlay.innerHTML = `
        <div class="teduh-curtain-panel" id="teduhCurtainPanel"></div>
        <div class="teduh-curtain-brand" id="teduhCurtainBrand">
          <svg class="teduh-curtain-logo" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22v-9"></path>
            <path d="M12 13a5 5 0 0 0-5-5 5 5 0 0 0-5 5v1h10v-1z"></path>
            <path d="M12 13a5 5 0 0 1 5-5 5 5 0 0 1 5 5v1H12v-1z"></path>
            <path d="M12 7a4 4 0 0 0-4-4 4 4 0 0 0-4 4v1h8V7z"></path>
            <path d="M12 7a4 4 0 0 1 4-4 4 4 0 0 1 4 4v1h-8V7z"></path>
          </svg>
          <span class="teduh-curtain-title">TEDUH</span>
        </div>
      `;
      document.body.appendChild(overlay);
    }
  }

  // Inisialisasi Hairline Scroll Progress Bar
  function initScrollProgressBar() {
    const progressBar = document.getElementById('teduhScrollProgressBar');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      progressBar.style.width = `${scrolled}%`;
    }, { passive: true });
  }

  // Animasi Tirai Membuka Halaman (Page Enter Reveal)
  function playPageEnter() {
    const isTransitioning = sessionStorage.getItem('teduh_page_transition') === 'true';
    sessionStorage.removeItem('teduh_page_transition');

    const overlay = document.getElementById('teduhCurtainOverlay');
    const panel = document.getElementById('teduhCurtainPanel');
    const brand = document.getElementById('teduhCurtainBrand');

    if (!overlay || !panel) return;

    if (typeof gsap !== 'undefined') {
      if (isTransitioning) {
        // Jika datang dari klik navigasi internal:
        gsap.set(panel, { yPercent: 0 });
        gsap.set(brand, { opacity: 1, scale: 1 });
        overlay.style.pointerEvents = 'auto';

        const enterTl = gsap.timeline({
          onComplete: () => {
            gsap.set(panel, { yPercent: 100 });
            gsap.set(brand, { opacity: 0 });
            overlay.style.pointerEvents = 'none';
            document.body.classList.remove('teduh-page-transitioning');
          }
        });

        enterTl
          .to(brand, {
            opacity: 0,
            scale: 0.94,
            duration: 0.2,
            ease: 'power2.in'
          })
          .to(panel, {
            yPercent: -100,
            duration: 0.45,
            ease: 'power3.inOut'
          }, '-=0.06');

        // Cascade konten halaman baru
        const mainContent = document.querySelector('main') || document.querySelector('.main-content');
        if (mainContent) {
          gsap.fromTo(mainContent,
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out', delay: 0.15 }
          );
        }
      } else {
        // Pemuatan normal awal / refresh
        gsap.set(panel, { yPercent: 100 });
        gsap.set(brand, { opacity: 0 });
        overlay.style.pointerEvents = 'none';
        document.body.classList.remove('teduh-page-transitioning');

        // Halus masuk konten
        const mainContent = document.querySelector('main') || document.querySelector('.main-content');
        if (mainContent) {
          gsap.fromTo(mainContent,
            { opacity: 0.88, y: 14 },
            { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }
          );
        }
      }
    } else {
      overlay.style.display = 'none';
    }
  }

  // Animasi Tirai Menutup Layar & Menuju Halaman Baru (Page Leave)
  function playPageLeave(targetUrl) {
    if (!targetUrl) return;

    const overlay = document.getElementById('teduhCurtainOverlay');
    const panel = document.getElementById('teduhCurtainPanel');
    const brand = document.getElementById('teduhCurtainBrand');

    if (!overlay || !panel) {
      window.location.href = targetUrl;
      return;
    }

    document.body.classList.add('teduh-page-transitioning');
    sessionStorage.setItem('teduh_page_transition', 'true');
    overlay.style.pointerEvents = 'auto';

    if (typeof gsap !== 'undefined') {
      const leaveTl = gsap.timeline({
        onComplete: () => {
          window.location.href = targetUrl;
        }
      });

      leaveTl
        .set(panel, { yPercent: 100 })
        .set(brand, { opacity: 0, scale: 0.9, y: 12 })
        .to(panel, {
          yPercent: 0,
          duration: 0.38,
          ease: 'power3.inOut'
        })
        .to(brand, {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.22,
          ease: 'power2.out'
        }, '-=0.15');

      // Fallback keselamatan jika browser lambat
      setTimeout(() => {
        window.location.href = targetUrl;
      }, 1000);
    } else {
      window.location.href = targetUrl;
    }
  }

  // Intersepsi Klik Tautan Internal
  function initLinkInterception() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (!link) return;

      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return;
      }

      if (link.hasAttribute('download') || link.getAttribute('target') === '_blank') {
        return;
      }

      if (link.classList.contains('no-transition') || link.dataset.noTransition !== undefined) {
        return;
      }

      const href = link.getAttribute('href');
      if (!href) return;

      if (href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('mailto:') || href.startsWith('tel:')) {
        return;
      }

      try {
        const targetUrl = new URL(link.href, window.location.origin);
        if (targetUrl.origin !== window.location.origin) {
          return;
        }

        if (targetUrl.pathname === window.location.pathname && targetUrl.search === window.location.search && targetUrl.hash) {
          return;
        }

        if (/\.(png|jpg|jpeg|gif|svg|pdf|zip|mp4)$/i.test(targetUrl.pathname)) {
          return;
        }

        e.preventDefault();
        playPageLeave(link.href);
      } catch (err) {}
    });
  }

  // Reset Tirai Saat Kembali via Tombol Back/Forward Browser (bfcache)
  function handleBfCache() {
    window.addEventListener('pageshow', (event) => {
      const overlay = document.getElementById('teduhCurtainOverlay');
      const panel = document.getElementById('teduhCurtainPanel');
      const brand = document.getElementById('teduhCurtainBrand');
      
      document.body.classList.remove('teduh-page-transitioning');
      sessionStorage.removeItem('teduh_page_transition');

      if (overlay && panel && typeof gsap !== 'undefined') {
        gsap.set(panel, { yPercent: 100 });
        if (brand) gsap.set(brand, { opacity: 0 });
        overlay.style.pointerEvents = 'none';
      }
    });
  }

  function init() {
    injectCurtainDOM();
    initScrollProgressBar();
    initLinkInterception();
    handleBfCache();
    playPageEnter();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.TeduhTransition = {
    navigateTo: playPageLeave
  };

})();

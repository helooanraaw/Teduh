/**
 * TEDUH DIGITAL PLATFORM - EDITORIAL SPATIAL PAGE TRANSITION ENGINE (js/page-transition.js)
 * Seamless, hardware-accelerated curtain sweep transitions with Deep Laurel Pine (#1A382B)
 * Pure Client-Side, Zero Dependencies except GSAP, Safe against bfcache and external links
 */

(function() {
  'use strict';

  // Inject CSS Styles for Curtain Overlay & Smooth Page Entry
  function injectCurtainStyles() {
    if (document.getElementById('teduh-curtain-styles')) return;

    const style = document.createElement('style');
    style.id = 'teduh-curtain-styles';
    style.textContent = `
      #teduhCurtainOverlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 999999;
        pointer-events: none;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .teduh-curtain-panel {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #1A382B;
        transform: translateY(100%);
        will-change: transform;
      }
      .teduh-curtain-brand {
        position: relative;
        z-index: 2;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
        opacity: 0;
        pointer-events: none;
        will-change: transform, opacity;
      }
      .teduh-curtain-logo {
        width: 44px;
        height: 44px;
        color: #FAF9F4;
      }
      .teduh-curtain-title {
        font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
        font-size: 14px;
        font-weight: 700;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        color: #FAF9F4;
      }
      body.teduh-page-transitioning {
        pointer-events: none !important;
        user-select: none !important;
      }
    `;
    document.head.appendChild(style);
  }

  // Inject Overlay DOM Elements
  function injectCurtainDOM() {
    if (document.getElementById('teduhCurtainOverlay')) return;

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
        // Jika datang dari klik transisi halaman, tirai tersingkap ke atas
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
            scale: 0.95,
            duration: 0.22,
            ease: 'power2.in'
          })
          .to(panel, {
            yPercent: -100,
            duration: 0.48,
            ease: 'power3.inOut'
          }, '-=0.08');
      } else {
        // Load normal pertama kali: Pastikan tirai berada di bawah
        gsap.set(panel, { yPercent: 100 });
        gsap.set(brand, { opacity: 0 });
        overlay.style.pointerEvents = 'none';
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
        .set(brand, { opacity: 0, scale: 0.9, y: 10 })
        .to(panel, {
          yPercent: 0,
          duration: 0.42,
          ease: 'power3.inOut'
        })
        .to(brand, {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.25,
          ease: 'power2.out'
        }, '-=0.15');

      // Fallback keselamatan jika browser lambat
      setTimeout(() => {
        window.location.href = targetUrl;
      }, 1200);
    } else {
      window.location.href = targetUrl;
    }
  }

  // Intersepsi Klik Tautan Internal
  function initLinkInterception() {
    document.addEventListener('click', (e) => {
      // Cari elemen tautan terdekat
      const link = e.target.closest('a');
      if (!link) return;

      // Abaikan klik yang dimodifikasi (Ctrl/Cmd/Shift/Alt) atau bukan klik kiri
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return;
      }

      // Abaikan jika ada atribut download atau target _blank
      if (link.hasAttribute('download') || link.getAttribute('target') === '_blank') {
        return;
      }

      // Abaikan jika memiliki class atau data khusus pencegah transisi
      if (link.classList.contains('no-transition') || link.dataset.noTransition !== undefined) {
        return;
      }

      const href = link.getAttribute('href');
      if (!href) return;

      // Abaikan anchor dalam halaman, protocol khusus, javascript
      if (href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('mailto:') || href.startsWith('tel:')) {
        return;
      }

      // Periksa apakah ini URL internal ke halaman lain
      try {
        const targetUrl = new URL(link.href, window.location.origin);
        
        // Hanya proses jika origin sama
        if (targetUrl.origin !== window.location.origin) {
          return;
        }

        // Abaikan jika mengarah ke halaman & hash yang persis sama
        if (targetUrl.pathname === window.location.pathname && targetUrl.search === window.location.search && targetUrl.hash) {
          return;
        }

        // Abaikan file statis non-halaman (gambar, pdf, zip)
        if (/\.(png|jpg|jpeg|gif|svg|pdf|zip|mp4)$/i.test(targetUrl.pathname)) {
          return;
        }

        // Jalankan transisi
        e.preventDefault();
        playPageLeave(link.href);
      } catch (err) {
        // Fallback jika URL parsing gagal
      }
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

  // Inisialisasi Saat DOM Siap
  function init() {
    injectCurtainStyles();
    injectCurtainDOM();
    initLinkInterception();
    handleBfCache();
    playPageEnter();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Ekspor Global Helper jika dibutuhkan modul lain
  window.TeduhTransition = {
    navigateTo: playPageLeave
  };

})();

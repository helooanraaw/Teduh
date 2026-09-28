/**
 * TEDUH DIGITAL PLATFORM - REWARD & LEADERBOARD JAVASCRIPT (js/reward.js)
 * Mengelola Segmented Tab (Papan Peringkat vs Katalog Voucher),
 * Animasi GSAP Counter Poin, Stagger Kartu Voucher, dan Penukaran Hadiah.
 * Bebas Em-Dash (R-02 Compliant) & Disiplin 3 Warna Esensial.
 */

document.addEventListener('DOMContentLoaded', () => {
  syncRewardPageData();
  initRewardGSAPAnimations();
  initMobileNav();
});

/* ==========================================================================
   1. TAB SWITCHER DENGAN GSAP CROSSFADE
   ========================================================================== */
function switchRewardTab(tabName) {
  const btnLeaderboard = document.getElementById('tabLeaderboardBtn');
  const btnVouchers = document.getElementById('tabVouchersBtn');
  const contentLeaderboard = document.getElementById('tabContentLeaderboard');
  const contentVouchers = document.getElementById('tabContentVouchers');

  if (tabName === 'leaderboard') {
    if (btnLeaderboard) {
      btnLeaderboard.classList.add('is-active');
      btnLeaderboard.setAttribute('aria-selected', 'true');
    }
    if (btnVouchers) {
      btnVouchers.classList.remove('is-active');
      btnVouchers.setAttribute('aria-selected', 'false');
    }
    if (contentLeaderboard) {
      contentLeaderboard.classList.add('is-active');
      if (typeof gsap !== 'undefined') {
        gsap.fromTo(contentLeaderboard, 
          { opacity: 0, y: 12 }, 
          { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
        );
        gsap.fromTo('#tabContentLeaderboard .rw-leaderboard-row',
          { opacity: 0, x: -10 },
          { opacity: 1, x: 0, stagger: 0.04, duration: 0.3, ease: 'power2.out' }
        );
      }
    }
    if (contentVouchers) contentVouchers.classList.remove('is-active');
  } else if (tabName === 'vouchers') {
    if (btnVouchers) {
      btnVouchers.classList.add('is-active');
      btnVouchers.setAttribute('aria-selected', 'true');
    }
    if (btnLeaderboard) {
      btnLeaderboard.classList.remove('is-active');
      btnLeaderboard.setAttribute('aria-selected', 'false');
    }
    if (contentVouchers) {
      contentVouchers.classList.add('is-active');
      if (typeof gsap !== 'undefined') {
        gsap.fromTo(contentVouchers, 
          { opacity: 0, y: 12 }, 
          { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
        );
        gsap.fromTo('#tabContentVouchers .rw-voucher-card',
          { opacity: 0, y: 16, scale: 0.97 },
          { opacity: 1, y: 0, scale: 1, stagger: 0.06, duration: 0.4, ease: 'power3.out' }
        );
      }
    }
    if (contentLeaderboard) contentLeaderboard.classList.remove('is-active');
  }
}

/* ==========================================================================
   2. KLAIM VOUCHER & BIBIT GRATIS DENGAN ANIMASI GSAP
   ========================================================================== */
function claimRewardVoucher(voucherTitle, cost, prefix) {
  // Hasilkan Kode Unik Dummy
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const voucherCode = `${prefix}-${randomNum}`;

  // Tampilkan Modal Konfirmasi
  const modal = document.getElementById('rwModalBackdrop');
  const modalCard = modal ? modal.querySelector('.rw-modal-card') : null;
  const modalTitle = document.getElementById('rwModalTitle');
  const modalDesc = document.getElementById('rwModalDesc');
  const modalCode = document.getElementById('rwModalVoucherCode');

  if (modalTitle) modalTitle.textContent = `${voucherTitle} Berhasil Diklaim!`;
  if (modalDesc) modalDesc.textContent = `Tunjukkan kode voucher berikut kepada petugas posko mitra saat pengambilan bibit atau kompos gratis.`;
  if (modalCode) modalCode.textContent = voucherCode;

  if (modal) {
    modal.classList.add('is-visible');
    if (typeof gsap !== 'undefined' && modalCard) {
      gsap.fromTo(modalCard, 
        { scale: 0.9, opacity: 0, y: 18 }, 
        { scale: 1, opacity: 1, y: 0, duration: 0.38, ease: 'back.out(1.4)' }
      );
    }
  }
}

function closeRewardModal(e) {
  if (e && e.target !== e.currentTarget && e.target.id !== 'rwModalBackdrop' && !e.target.classList.contains('rw-modal-btn-close')) {
    return;
  }
  const modal = document.getElementById('rwModalBackdrop');
  const modalCard = modal ? modal.querySelector('.rw-modal-card') : null;
  if (modal) {
    if (typeof gsap !== 'undefined' && modalCard) {
      gsap.to(modalCard, {
        scale: 0.92,
        opacity: 0,
        y: 10,
        duration: 0.22,
        ease: 'power2.in',
        onComplete: () => {
          modal.classList.remove('is-visible');
        }
      });
    } else {
      modal.classList.remove('is-visible');
    }
  }
}

/* ==========================================================================
   3. SINKRONISASI DATA POIN AKUN & ANIMASI ROLLING COUNTER
   ========================================================================== */
function syncRewardPageData() {
  if (typeof TEDUH_DATA === 'undefined' || !TEDUH_DATA.getUserData) return;
  const user = TEDUH_DATA.getUserData();

  const pointsVal = `${user.points} Poin`;

  const navPoints = document.getElementById('navUserPointsValue');
  const displayPoints = document.getElementById('rwUserPointsDisplay');
  const tablePoints = document.getElementById('rwTableUserPoints');
  const mobilePoints = document.getElementById('mobileUserPoints');

  if (navPoints) navPoints.textContent = pointsVal;
  if (mobilePoints) mobilePoints.textContent = `Level 3: Perintis Teduh (${pointsVal})`;
}

function initRewardGSAPAnimations() {
  if (typeof gsap === 'undefined') return;

  const user = (typeof TEDUH_DATA !== 'undefined' && TEDUH_DATA.getUserData) 
    ? TEDUH_DATA.getUserData() 
    : { points: 450 };

  const targetPoints = user.points || 450;
  const pointsCounter = { val: 0 };
  const displayPoints = document.getElementById('rwUserPointsDisplay');
  const tablePoints = document.getElementById('rwTableUserPoints');

  // Rolling counter poin
  gsap.to(pointsCounter, {
    val: targetPoints,
    duration: 1.2,
    ease: 'power2.out',
    onUpdate: () => {
      const current = Math.round(pointsCounter.val);
      if (displayPoints) displayPoints.textContent = `${current} Poin`;
      if (tablePoints) tablePoints.textContent = `${current} Poin`;
    }
  });

  // Stagger entrance kartu ringkasan poin dan leaderboard
  gsap.fromTo('.rw-hero-card, .rw-rank-card',
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, stagger: 0.1, duration: 0.6, ease: 'power3.out' }
  );

  gsap.fromTo('.rw-leaderboard-row',
    { opacity: 0, x: -12 },
    { opacity: 1, x: 0, stagger: 0.05, duration: 0.45, ease: 'power2.out', delay: 0.2 }
  );
}

let rwToastTimeout = null;
function showRwToast(msg) {
  const toast = document.getElementById('rwToast');
  if (!toast) return;
  clearTimeout(rwToastTimeout);
  toast.textContent = msg;
  toast.classList.add('is-visible');
  rwToastTimeout = setTimeout(() => {
    toast.classList.remove('is-visible');
  }, 2500);
}

function initMobileNav() {
  const hamburger = document.getElementById('navbarHamburger');
  const overlay = document.getElementById('mobileNavOverlay');
  const menu = document.getElementById('mobileNavMenu');
  const closeBtn = document.getElementById('mobileNavClose');

  if (!hamburger || !menu) return;

  function openMenu() {
    menu.classList.add('is-open', 'active');
    if (overlay) overlay.classList.add('is-visible', 'active');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    menu.classList.remove('is-open', 'active');
    if (overlay) overlay.classList.remove('is-visible', 'active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  if (overlay) overlay.addEventListener('click', closeMenu);

  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

// Global Exports
window.switchRewardTab = switchRewardTab;
window.claimRewardVoucher = claimRewardVoucher;
window.closeRewardModal = closeRewardModal;
window.showRwToast = showRwToast;
window.syncRewardPageData = syncRewardPageData;

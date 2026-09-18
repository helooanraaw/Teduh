/**
 * TEDUH DIGITAL PLATFORM - REWARD & LEADERBOARD JAVASCRIPT (js/reward.js)
 * Mengelola Segmented Tab (Papan Peringkat vs Katalog Voucher),
 * Penukaran Poin Hadiah Bibit/Kompos, dan Pembaruan Poin Akun John Doe.
 * Bebas Em-Dash (R-02 Compliant) & Disiplin 3 Warna Esensial.
 */

document.addEventListener('DOMContentLoaded', () => {
  syncRewardPageData();
  initMobileNav();
});

/* ==========================================================================
   1. TAB SWITCHER (LEADERBOARD VS VOUCHERS)
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
    if (contentLeaderboard) contentLeaderboard.classList.add('is-active');
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
    if (contentVouchers) contentVouchers.classList.add('is-active');
    if (contentLeaderboard) contentLeaderboard.classList.remove('is-active');
  }
}

/* ==========================================================================
   2. KLAIM VOUCHER & BIBIT GRATIS
   ========================================================================== */
function claimRewardVoucher(voucherTitle, cost, prefix) {
  let userPoints = 850;
  if (typeof TEDUH_DATA !== 'undefined' && TEDUH_DATA.getUserData) {
    userPoints = TEDUH_DATA.getUserData().points;
  }

  if (userPoints < cost) {
    showRwToast(`Poin belum mencukupi (Butuh ${cost} Poin, Saldo Anda ${userPoints} Poin).`);
    return;
  }

  // Potong Poin Pengguna
  if (typeof TEDUH_DATA !== 'undefined' && TEDUH_DATA.addPoints) {
    TEDUH_DATA.addPoints(-cost);
  }

  // Hasilkan Kode Unik
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const voucherCode = `${prefix}-${randomNum}`;

  // Tampilkan Modal Konfirmasi
  const modal = document.getElementById('rwModalBackdrop');
  const modalTitle = document.getElementById('rwModalTitle');
  const modalDesc = document.getElementById('rwModalDesc');
  const modalCode = document.getElementById('rwModalVoucherCode');

  if (modalTitle) modalTitle.textContent = `${voucherTitle} Berhasil Diklaim!`;
  if (modalDesc) modalDesc.textContent = `Tunjukkan kode voucher berikut kepada petugas posko mitra saat pengambilan. Poin Anda terpotong ${cost} Poin.`;
  if (modalCode) modalCode.textContent = voucherCode;

  if (modal) {
    modal.classList.add('is-visible');
  }

  syncRewardPageData();
  showRwToast(`Voucher ${voucherTitle} siap digunakan!`);
}

function closeRewardModal(e) {
  if (e && e.target !== e.currentTarget && e.target.id !== 'rwModalBackdrop' && !e.target.classList.contains('rw-modal-btn-close')) {
    return;
  }
  const modal = document.getElementById('rwModalBackdrop');
  if (modal) {
    modal.classList.remove('is-visible');
  }
}

/* ==========================================================================
   3. SINKRONISASI DATA POIN AKUN
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
  if (displayPoints) displayPoints.textContent = pointsVal;
  if (tablePoints) tablePoints.textContent = pointsVal;
  if (mobilePoints) mobilePoints.textContent = `Level 3: Perintis Teduh (${pointsVal})`;
}

function showRwToast(msg) {
  const toast = document.getElementById('rwToast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('is-visible');
  setTimeout(() => {
    toast.classList.remove('is-visible');
  }, 3400);
}

function initMobileNav() {
  const hamburger = document.getElementById('navbarHamburger');
  const overlay = document.getElementById('mobileNavOverlay');
  const menu = document.getElementById('mobileNavMenu');
  const closeBtn = document.getElementById('mobileNavClose');

  if (!hamburger || !menu) return;

  function openMenu() {
    menu.classList.add('is-open');
    if (overlay) overlay.classList.add('is-visible');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    menu.classList.remove('is-open');
    if (overlay) overlay.classList.remove('is-visible');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  if (overlay) overlay.addEventListener('click', closeMenu);
}

// Global Exports
window.switchRewardTab = switchRewardTab;
window.claimRewardVoucher = claimRewardVoucher;
window.closeRewardModal = closeRewardModal;
window.showRwToast = showRwToast;
window.syncRewardPageData = syncRewardPageData;

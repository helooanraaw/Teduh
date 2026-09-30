/**
 * TEDUH DIGITAL PLATFORM
 * Berkas: js/reward.js
 * Deskripsi: Pengendali Peringkat Kesejukan Warga, Animasi Podium & Sistem Tukar Hadiah
 *
 * ==========================================================================
 * SUMBER KARYA & ATRIBUSI MEDIA / ASET:
 * 1. Aset Visual (assets/*): Dihasilkan via Generative AI (Banana AI).
 * 2. Desain Logo: Dibuat mandiri via Canva oleh tim pengembang.
 * 3. Pustaka Eksternal: jQuery 3.7.1 CDN (MIT License).
 * ==========================================================================
 */
document.addEventListener("DOMContentLoaded", () => {
  syncRewardPageData();
  initRewardEntranceAnimations();
  initMobileNav();
});

function animatePodiumDiagram() {
  const bar1 = document.querySelector(".rw-podium-col.col-1 .rw-podium-bar");
  const bar2 = document.querySelector(".rw-podium-col.col-2 .rw-podium-bar");
  const bar3 = document.querySelector(".rw-podium-col.col-3 .rw-podium-bar");

  const avatar1 = document.querySelector(".rw-podium-col.col-1 .rw-podium-avatar-wrap");
  const avatar2 = document.querySelector(".rw-podium-col.col-2 .rw-podium-avatar-wrap");
  const avatar3 = document.querySelector(".rw-podium-col.col-3 .rw-podium-avatar-wrap");

  const crown = document.querySelector(".rw-podium-crown");
  const metaTexts = document.querySelectorAll(".rw-podium-user-name, .rw-podium-loc");

  const badge1 = document.getElementById("rwPodiumPoints1");
  const badge2 = document.getElementById("rwPodiumPoints2");
  const badge3 = document.getElementById("rwPodiumPoints3");

  if (!bar1 || !bar2 || !bar3) return;

  [bar1, bar2, bar3].forEach((b) => {
    b.style.transform = "scaleY(0)";
    b.style.transformOrigin = "bottom center";
    b.style.opacity = "0";
  });

  [avatar1, avatar2, avatar3].forEach((a) => {
    if (a) {
      a.style.transform = "scale(0) translateY(20px)";
      a.style.opacity = "0";
    }
  });

  if (crown) {
    crown.style.transform = "scale(0) translateY(-20px) rotate(-15deg)";
    crown.style.opacity = "0";
  }

  metaTexts.forEach((m) => {
    m.style.opacity = "0";
    m.style.transform = "translateY(8px)";
  });

  [badge1, badge2, badge3].forEach((bg) => {
    if (bg) {
      bg.style.opacity = "0";
      bg.style.transform = "scale(0.8)";
    }
  });

  setTimeout(() => {
    bar2.style.transition = "transform 0.7s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease";
    bar2.style.transform = "scaleY(1)";
    bar2.style.opacity = "1";
  }, 100);

  setTimeout(() => {
    bar3.style.transition = "transform 0.7s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease";
    bar3.style.transform = "scaleY(1)";
    bar3.style.opacity = "1";
  }, 200);

  setTimeout(() => {
    bar1.style.transition = "transform 0.85s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.5s ease";
    bar1.style.transform = "scaleY(1)";
    bar1.style.opacity = "1";
  }, 320);

  setTimeout(() => {
    if (avatar2) {
      avatar2.style.transition = "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease";
      avatar2.style.transform = "scale(1) translateY(0)";
      avatar2.style.opacity = "1";
    }
  }, 500);

  setTimeout(() => {
    if (avatar3) {
      avatar3.style.transition = "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease";
      avatar3.style.transform = "scale(1) translateY(0)";
      avatar3.style.opacity = "1";
    }
  }, 600);

  setTimeout(() => {
    if (avatar1) {
      avatar1.style.transition = "transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease";
      avatar1.style.transform = "scale(1) translateY(0)";
      avatar1.style.opacity = "1";
    }
  }, 700);

  setTimeout(() => {
    if (crown) {
      crown.style.transition = "transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease";
      crown.style.transform = "scale(1) translateY(0) rotate(0deg)";
      crown.style.opacity = "1";
    }
    metaTexts.forEach((m) => {
      m.style.transition = "opacity 0.4s ease, transform 0.4s ease";
      m.style.opacity = "1";
      m.style.transform = "translateY(0)";
    });
    [badge1, badge2, badge3].forEach((bg) => {
      if (bg) {
        bg.style.transition = "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease";
        bg.style.opacity = "1";
        bg.style.transform = "scale(1)";
      }
    });
  }, 900);

  animateBadgeNumber(badge1, 1420);
  animateBadgeNumber(badge2, 1180);
  animateBadgeNumber(badge3, 960);
}

function animateBadgeNumber(el, targetVal) {
  if (!el) return;
  const startTime = performance.now();
  const duration = 1200;
  function count(now) {
    const p = Math.min(1, (now - startTime) / duration);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = `${Math.round(targetVal * ease).toLocaleString("id-ID")} Poin`;
    if (p < 1) requestAnimationFrame(count);
    else el.textContent = `${targetVal.toLocaleString("id-ID")} Poin`;
  }
  setTimeout(() => requestAnimationFrame(count), 400);
}

function initRewardEntranceAnimations() {
  const user =
    typeof TEDUH_DATA !== "undefined" && TEDUH_DATA.getUserData
      ? TEDUH_DATA.getUserData()
      : { points: 850 };

  const targetPoints = user.points || 850;
  const displayPoints = document.getElementById("rwUserPointsDisplay");
  const tablePoints = document.getElementById("rwTableUserPoints");

  const progFill = document.querySelector(".rw-user-progress-fill");
  if (progFill) {
    progFill.style.width = "0%";
    setTimeout(() => {
      progFill.style.transition = "width 1.2s cubic-bezier(0.16, 1, 0.3, 1)";
      progFill.style.width = "70%";
    }, 200);
  }

  if (displayPoints || tablePoints) {
    const startTime = performance.now();
    const duration = 1100;
    function countPoints(now) {
      const p = Math.min(1, (now - startTime) / duration);
      const ease = 1 - Math.pow(1 - p, 3);
      const current = `${Math.round(targetPoints * ease).toLocaleString("id-ID")} Poin`;
      if (displayPoints) displayPoints.textContent = current;
      if (tablePoints) tablePoints.textContent = current;
      if (p < 1) requestAnimationFrame(countPoints);
      else {
        if (displayPoints) displayPoints.textContent = `${targetPoints.toLocaleString("id-ID")} Poin`;
        if (tablePoints) tablePoints.textContent = `${targetPoints.toLocaleString("id-ID")} Poin`;
      }
    }
    setTimeout(() => requestAnimationFrame(countPoints), 200);
  }

  if (window.location.hash === "#vouchers") {
    switchRewardTab("vouchers");
  } else {
    animatePodiumDiagram();
  }
}

function animateVoucherCatalog() {
  const hero = document.querySelector(".rw-voucher-bento-hero");
  const stackCards = document.querySelectorAll(
    ".rw-vouchers-bento-stack .rw-voucher-card",
  );
  const sectionHeader = document.querySelector(".rw-vouchers-section-header");
  const gridCards = document.querySelectorAll(
    ".rw-vouchers-grid .rw-voucher-card",
  );

  if (hero) {
    hero.classList.remove("rw-anim-enter");
    hero.style.animationDelay = "0.04s";
    void hero.offsetWidth;
    hero.classList.add("rw-anim-enter");
  }

  stackCards.forEach((card, i) => {
    card.classList.remove("rw-anim-enter");
    card.style.animationDelay = `${0.1 + i * 0.08}s`;
    void card.offsetWidth;
    card.classList.add("rw-anim-enter");
  });

  if (sectionHeader) {
    sectionHeader.classList.remove("rw-anim-enter");
    sectionHeader.style.animationDelay = "0.22s";
    void sectionHeader.offsetWidth;
    sectionHeader.classList.add("rw-anim-enter");
  }

  gridCards.forEach((card, i) => {
    card.classList.remove("rw-anim-enter");
    card.style.animationDelay = `${0.26 + i * 0.05}s`;
    void card.offsetWidth;
    card.classList.add("rw-anim-enter");
  });
}

function switchRewardTab(tabName) {
  const btnLeaderboard = document.getElementById("tabLeaderboardBtn");
  const btnVouchers = document.getElementById("tabVouchersBtn");
  const contentLeaderboard = document.getElementById("tabContentLeaderboard");
  const contentVouchers = document.getElementById("tabContentVouchers");

  if (tabName === "leaderboard") {
    if (btnLeaderboard) {
      btnLeaderboard.classList.add("is-active");
      btnLeaderboard.setAttribute("aria-selected", "true");
    }
    if (btnVouchers) {
      btnVouchers.classList.remove("is-active");
      btnVouchers.setAttribute("aria-selected", "false");
    }
    if (contentLeaderboard) {
      contentLeaderboard.classList.add("is-active");
      $(contentLeaderboard).hide().fadeIn(250);
      animatePodiumDiagram();
    }
    if (contentVouchers) contentVouchers.classList.remove("is-active");
  } else if (tabName === "vouchers") {
    if (btnVouchers) {
      btnVouchers.classList.add("is-active");
      btnVouchers.setAttribute("aria-selected", "true");
    }
    if (btnLeaderboard) {
      btnLeaderboard.classList.remove("is-active");
      btnLeaderboard.setAttribute("aria-selected", "false");
    }
    if (contentVouchers) {
      contentVouchers.classList.add("is-active");
      $(contentVouchers).hide().fadeIn(250, () => {
        animateVoucherCatalog();
      });
    }
    if (contentLeaderboard) contentLeaderboard.classList.remove("is-active");
  }
}

let pendingRewardToRedeem = null;

function claimRewardVoucher(voucherTitle, cost, prefix) {
  const user =
    typeof TEDUH_DATA !== "undefined" && TEDUH_DATA.getUserData
      ? TEDUH_DATA.getUserData()
      : { points: 850 };
  const currentPoints = user.points !== undefined ? user.points : 850;

  if (currentPoints < cost) {
    showRwToast(
      `Poin tidak cukup! Saldo: ${currentPoints.toLocaleString("id-ID")} Poin (Butuh ${cost.toLocaleString("id-ID")} Poin).`,
    );
    return;
  }

  pendingRewardToRedeem = { voucherTitle, cost, prefix };

  const confirmModal = document.getElementById("rwConfirmModalBackdrop");
  const itemNameEl = document.getElementById("rwConfirmItemName");
  const pointsEl = document.getElementById("rwConfirmPoints");
  const curPointsEl = document.getElementById("rwConfirmCurrentPoints");
  const costPointsEl = document.getElementById("rwConfirmCostPoints");
  const remPointsEl = document.getElementById("rwConfirmRemainingPoints");

  if (itemNameEl) itemNameEl.textContent = voucherTitle;
  if (pointsEl) pointsEl.textContent = `${cost.toLocaleString("id-ID")} Poin`;
  if (curPointsEl) curPointsEl.textContent = `${currentPoints.toLocaleString("id-ID")} Poin`;
  if (costPointsEl) costPointsEl.textContent = `-${cost.toLocaleString("id-ID")} Poin`;
  if (remPointsEl) remPointsEl.textContent = `${(currentPoints - cost).toLocaleString("id-ID")} Poin`;

  if (confirmModal) {
    confirmModal.classList.add("is-visible");
  }
}

function closeRewardConfirmModal(e) {
  if (
    e &&
    e.target !== e.currentTarget &&
    e.target.id !== "rwConfirmModalBackdrop" &&
    !e.target.classList.contains("rw-modal-btn-cancel")
  ) {
    return;
  }
  const modal = document.getElementById("rwConfirmModalBackdrop");
  if (modal) {
    modal.classList.remove("is-visible");
    pendingRewardToRedeem = null;
  }
}

function executeRewardRedeem() {
  if (!pendingRewardToRedeem) return;
  const { voucherTitle, cost, prefix } = pendingRewardToRedeem;

  if (typeof TEDUH_DATA !== "undefined" && TEDUH_DATA.updateUserPoints) {
    TEDUH_DATA.updateUserPoints(-cost);
  }

  const confirmModal = document.getElementById("rwConfirmModalBackdrop");
  if (confirmModal) confirmModal.classList.remove("is-visible");

  syncRewardPageData();

  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const voucherCode = `${prefix}-${randomNum}`;

  const successModal = document.getElementById("rwModalBackdrop");
  const modalTitle = document.getElementById("rwModalTitle");
  const modalDesc = document.getElementById("rwModalDesc");
  const modalCode = document.getElementById("rwModalVoucherCode");

  if (modalTitle) modalTitle.textContent = `${voucherTitle} Berhasil Diklaim!`;
  if (modalDesc) modalDesc.textContent = `Tunjukkan kode voucher berikut kepada petugas posko mitra saat pengambilan bibit atau penukaran benefit.`;
  if (modalCode) modalCode.textContent = voucherCode;

  if (successModal) {
    successModal.classList.add("is-visible");
  }

  showRwToast(`Berhasil menukarkan ${cost.toLocaleString("id-ID")} poin untuk ${voucherTitle}!`);
  pendingRewardToRedeem = null;
}

function closeRewardModal(e) {
  if (
    e &&
    e.target !== e.currentTarget &&
    e.target.id !== "rwModalBackdrop" &&
    !e.target.classList.contains("rw-modal-btn-close")
  ) {
    return;
  }
  const modal = document.getElementById("rwModalBackdrop");
  if (modal) {
    modal.classList.remove("is-visible");
  }
}

function syncRewardPageData() {
  if (typeof TEDUH_DATA === "undefined" || !TEDUH_DATA.getUserData) return;
  const user = TEDUH_DATA.getUserData();

  const pointsVal = `${user.points.toLocaleString("id-ID")} Poin`;

  const navPoints = document.getElementById("navUserPointsValue");
  const displayPoints = document.getElementById("rwUserPointsDisplay");
  const tablePoints = document.getElementById("rwTableUserPoints");
  const mobilePoints = document.getElementById("mobileUserPoints");

  if (navPoints) navPoints.textContent = pointsVal;
  if (displayPoints) displayPoints.textContent = pointsVal;
  if (tablePoints) tablePoints.textContent = pointsVal;
  if (mobilePoints) mobilePoints.textContent = `Level 3 • ${pointsVal}`;

  document.querySelectorAll(".nav-popup-points-value").forEach((el) => {
    el.textContent = pointsVal;
  });
}

let rwToastTimeout = null;
function showRwToast(msg) {
  const toast = document.getElementById("rwToast");
  if (!toast) return;
  clearTimeout(rwToastTimeout);
  toast.textContent = msg;
  toast.classList.add("is-visible");
  rwToastTimeout = setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2500);
}

function initMobileNav() {
  const hamburger = document.getElementById("navbarHamburger");
  const overlay = document.getElementById("mobileNavOverlay");
  const menu = document.getElementById("mobileNavMenu");
  const closeBtn = document.getElementById("mobileNavClose");

  if (!hamburger || !menu) return;

  function openMenu() {
    menu.classList.add("is-open", "active");
    if (overlay) overlay.classList.add("is-visible", "active");
    hamburger.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  function closeMenu() {
    menu.classList.remove("is-open", "active");
    if (overlay) overlay.classList.remove("is-visible", "active");
    hamburger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  hamburger.addEventListener("click", openMenu);
  if (closeBtn) closeBtn.addEventListener("click", closeMenu);
  if (overlay) overlay.addEventListener("click", closeMenu);

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });
}

window.switchRewardTab = switchRewardTab;
window.animateVoucherCatalog = animateVoucherCatalog;
window.claimRewardVoucher = claimRewardVoucher;
window.closeRewardConfirmModal = closeRewardConfirmModal;
window.executeRewardRedeem = executeRewardRedeem;
window.closeRewardModal = closeRewardModal;
window.showRwToast = showRwToast;
window.syncRewardPageData = syncRewardPageData;

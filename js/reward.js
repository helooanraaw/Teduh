/**
 * TEDUH DIGITAL PLATFORM
 * Berkas: js/reward.js
 * Deskripsi: Pengendali Peringkat Kesejukan Warga, Animasi Podium & Sistem Tukar Hadiah
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
  syncRewardPageData();
  initRewardGSAPAnimations();
  initMobileNav();
});

let podiumTimeline = null;

/**
 * Animasi Diagram Podium Juara 1-3 & Perhitungan Angka Poin Real-time
 */
function animatePodiumDiagram() {
  if (typeof gsap === "undefined") return;

  const bar1 = document.querySelector(".rw-podium-col.col-1 .rw-podium-bar");
  const bar2 = document.querySelector(".rw-podium-col.col-2 .rw-podium-bar");
  const bar3 = document.querySelector(".rw-podium-col.col-3 .rw-podium-bar");

  const avatar1 = document.querySelector(
    ".rw-podium-col.col-1 .rw-podium-avatar-wrap",
  );
  const avatar2 = document.querySelector(
    ".rw-podium-col.col-2 .rw-podium-avatar-wrap",
  );
  const avatar3 = document.querySelector(
    ".rw-podium-col.col-3 .rw-podium-avatar-wrap",
  );

  const crown = document.querySelector(".rw-podium-crown");
  const metaTexts = document.querySelectorAll(
    ".rw-podium-user-name, .rw-podium-loc",
  );

  const badge1 = document.getElementById("rwPodiumPoints1");
  const badge2 = document.getElementById("rwPodiumPoints2");
  const badge3 = document.getElementById("rwPodiumPoints3");

  if (!bar1 || !bar2 || !bar3) return;

  if (podiumTimeline) {
    podiumTimeline.kill();
  }

  // Set initial states
  gsap.set([bar1, bar2, bar3], {
    transformOrigin: "bottom center",
    scaleY: 0,
    opacity: 0,
  });

  gsap.set([avatar1, avatar2, avatar3], {
    scale: 0,
    y: 35,
    opacity: 0,
    transformOrigin: "center center",
  });

  if (crown) {
    gsap.set(crown, {
      scale: 0,
      y: -30,
      rotation: -18,
      opacity: 0,
      transformOrigin: "center bottom",
    });
  }

  gsap.set(metaTexts, { opacity: 0, y: 10 });
  gsap.set([badge1, badge2, badge3], {
    opacity: 0,
    scale: 0.75,
    transformOrigin: "center center",
  });

  if (badge1) badge1.textContent = "0 Poin";
  if (badge2) badge2.textContent = "0 Poin";
  if (badge3) badge3.textContent = "0 Poin";

  podiumTimeline = gsap.timeline({ defaults: { ease: "power3.out" } });

  // 1. Bar 2 (Peringkat 2) & Bar 3 (Peringkat 3) naik terlebih dahulu
  podiumTimeline.to(
    bar2,
    { scaleY: 1, opacity: 1, duration: 0.75, ease: "power2.out" },
    0.05,
  );
  podiumTimeline.to(
    bar3,
    { scaleY: 1, opacity: 1, duration: 0.7, ease: "power2.out" },
    0.15,
  );

  // 2. Bar 1 (Peringkat 1) naik paling tinggi dengan efek spring halus
  podiumTimeline.to(
    bar1,
    { scaleY: 1, opacity: 1, duration: 0.95, ease: "back.out(1.2)" },
    0.25,
  );

  // 3. Avatar melompat muncul di atas bar masing-masing
  podiumTimeline.to(
    avatar2,
    { scale: 1, y: 0, opacity: 1, duration: 0.55, ease: "back.out(1.5)" },
    0.45,
  );
  podiumTimeline.to(
    avatar3,
    { scale: 1, y: 0, opacity: 1, duration: 0.5, ease: "back.out(1.5)" },
    0.55,
  );
  podiumTimeline.to(
    avatar1,
    { scale: 1, y: 0, opacity: 1, duration: 0.65, ease: "back.out(1.7)" },
    0.65,
  );

  // 4. Mahkota jatuh tepat di atas kepala Juara 1
  if (crown) {
    podiumTimeline.to(
      crown,
      {
        scale: 1,
        y: 0,
        rotation: 0,
        opacity: 1,
        duration: 0.55,
        ease: "back.out(2.2)",
      },
      0.95,
    );
  }

  // 5. Teks nama & lokasi warga muncul di dalam diagram
  podiumTimeline.to(
    metaTexts,
    {
      opacity: 1,
      y: 0,
      stagger: 0.04,
      duration: 0.35,
      ease: "power2.out",
    },
    0.85,
  );

  // 6. Kapsul poin muncul & angka poin berhitung naik (Count Up Animation)
  podiumTimeline.to(
    [badge1, badge2, badge3],
    {
      opacity: 1,
      scale: 1,
      stagger: 0.08,
      duration: 0.45,
      ease: "back.out(1.4)",
    },
    1.0,
  );

  // Objek counter untuk angka poin
  const p1 = { val: 0 };
  const p2 = { val: 0 };
  const p3 = { val: 0 };

  gsap.to(p1, {
    val: 1450,
    duration: 1.25,
    ease: "power2.out",
    delay: 1.05,
    onUpdate: () => {
      if (badge1)
        badge1.textContent = `${Math.round(p1.val).toLocaleString("id-ID")} Poin`;
    },
  });

  gsap.to(p2, {
    val: 1220,
    duration: 1.15,
    ease: "power2.out",
    delay: 1.05,
    onUpdate: () => {
      if (badge2)
        badge2.textContent = `${Math.round(p2.val).toLocaleString("id-ID")} Poin`;
    },
  });

  gsap.to(p3, {
    val: 980,
    duration: 1.05,
    ease: "power2.out",
    delay: 1.05,
    onUpdate: () => {
      if (badge3)
        badge3.textContent = `${Math.round(p3.val).toLocaleString("id-ID")} Poin`;
    },
  });
}

/**
 * Animasi Keseluruhan Halaman Peringkat & Hadiah saat Pertama Dimuat
 */
function initRewardGSAPAnimations() {
  if (typeof gsap === "undefined") return;

  const user =
    typeof TEDUH_DATA !== "undefined" && TEDUH_DATA.getUserData
      ? TEDUH_DATA.getUserData()
      : { points: 850 };

  const targetPoints = user.points || 850;
  const pointsCounter = { val: 0 };
  const displayPoints = document.getElementById("rwUserPointsDisplay");
  const tablePoints = document.getElementById("rwTableUserPoints");

  // 1. Header & User Card Intro
  gsap.fromTo(
    ".rw-header-section",
    { opacity: 0, y: 16 },
    { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
  );

  gsap.fromTo(
    ".rw-user-card",
    { opacity: 0, y: 24, scale: 0.98 },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.65,
      ease: "power3.out",
      delay: 0.1,
    },
  );

  // 2. User Card Progress Bar & Points Counter
  gsap.fromTo(
    ".rw-user-progress-fill",
    { width: "0%" },
    { width: "70%", duration: 1.2, ease: "power2.out", delay: 0.3 },
  );

  gsap.to(pointsCounter, {
    val: targetPoints,
    duration: 1.25,
    ease: "power2.out",
    delay: 0.25,
    onUpdate: () => {
      const current = Math.round(pointsCounter.val).toLocaleString("id-ID");
      if (displayPoints) displayPoints.textContent = `${current} Poin`;
      if (tablePoints) tablePoints.textContent = `${current} Poin`;
    },
  });

  // 3. Tabs Nav Intro
  gsap.fromTo(
    ".rw-tabs-nav",
    { opacity: 0, y: 12 },
    { opacity: 1, y: 0, duration: 0.45, ease: "power2.out", delay: 0.2 },
  );

  // 4. Jalankan Animasi Diagram Podium Juara
  animatePodiumDiagram();

  // 5. Tabel Peringkat Cascade Stagger
  gsap.fromTo(
    ".rw-table-card",
    { opacity: 0, y: 24 },
    { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", delay: 0.4 },
  );

  gsap.fromTo(
    ".rw-table-row",
    { opacity: 0, x: -16 },
    {
      opacity: 1,
      x: 0,
      stagger: 0.05,
      duration: 0.45,
      ease: "power2.out",
      delay: 0.5,
    },
  );
}

/**
 * Navigasi Tab (Peringkat Warga <-> Katalog Voucher) dengan Transisi Mulus GSAP
 */
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
      if (typeof gsap !== "undefined") {
        gsap.fromTo(
          contentLeaderboard,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" },
        );
        // Jalankan ulang animasi diagram podium dan tabel baris
        animatePodiumDiagram();
        gsap.fromTo(
          ".rw-table-row",
          { opacity: 0, x: -14 },
          {
            opacity: 1,
            x: 0,
            stagger: 0.04,
            duration: 0.4,
            ease: "power2.out",
            delay: 0.3,
          },
        );
      }
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
      if (typeof gsap !== "undefined") {
        gsap.fromTo(
          contentVouchers,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" },
        );

        // Animasi Bento Hero Card
        gsap.fromTo(
          ".rw-voucher-bento-hero",
          { opacity: 0, y: 22, scale: 0.97 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            ease: "power3.out",
            delay: 0.05,
          },
        );

        // Animasi Stack Bento Card
        gsap.fromTo(
          ".rw-voucher-card.is-bento-stacked",
          { opacity: 0, x: 20 },
          {
            opacity: 1,
            x: 0,
            stagger: 0.08,
            duration: 0.45,
            ease: "power2.out",
            delay: 0.1,
          },
        );

        // Animasi Grid Voucher Regular
        gsap.fromTo(
          ".rw-vouchers-grid .rw-voucher-card",
          { opacity: 0, y: 18 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.06,
            duration: 0.45,
            ease: "power2.out",
            delay: 0.2,
          },
        );
      }
    }
    if (contentLeaderboard) contentLeaderboard.classList.remove("is-active");
  }
}

let pendingRewardToRedeem = null;

/**
 * Membuka Dialog Modal Konfirmasi Penukaran Hadiah
 */
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
  const confirmCard = confirmModal
    ? confirmModal.querySelector(".rw-modal-card")
    : null;
  const itemNameEl = document.getElementById("rwConfirmItemName");
  const pointsEl = document.getElementById("rwConfirmPoints");
  const curPointsEl = document.getElementById("rwConfirmCurrentPoints");
  const costPointsEl = document.getElementById("rwConfirmCostPoints");
  const remPointsEl = document.getElementById("rwConfirmRemainingPoints");

  if (itemNameEl) itemNameEl.textContent = voucherTitle;
  if (pointsEl) pointsEl.textContent = `${cost.toLocaleString("id-ID")} Poin`;
  if (curPointsEl)
    curPointsEl.textContent = `${currentPoints.toLocaleString("id-ID")} Poin`;
  if (costPointsEl)
    costPointsEl.textContent = `-${cost.toLocaleString("id-ID")} Poin`;
  if (remPointsEl)
    remPointsEl.textContent = `${(currentPoints - cost).toLocaleString("id-ID")} Poin`;

  if (confirmModal) {
    confirmModal.classList.add("is-visible");
    if (typeof gsap !== "undefined" && confirmCard) {
      gsap.fromTo(
        confirmCard,
        { scale: 0.88, opacity: 0, y: 24 },
        { scale: 1, opacity: 1, y: 0, duration: 0.35, ease: "back.out(1.5)" },
      );
    }
  }
}

/**
 * Menutup Modal Konfirmasi Penukaran Hadiah
 */
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
  const modalCard = modal ? modal.querySelector(".rw-modal-card") : null;
  if (modal) {
    if (typeof gsap !== "undefined" && modalCard) {
      gsap.to(modalCard, {
        scale: 0.92,
        opacity: 0,
        y: 12,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => {
          modal.classList.remove("is-visible");
          pendingRewardToRedeem = null;
        },
      });
    } else {
      modal.classList.remove("is-visible");
      pendingRewardToRedeem = null;
    }
  }
}

/**
 * Eksekusi Penukaran Hadiah setelah Konfirmasi "Ya, Tukar Sekarang"
 */
function executeRewardRedeem() {
  if (!pendingRewardToRedeem) return;
  const { voucherTitle, cost, prefix } = pendingRewardToRedeem;

  // Kurangi poin pengguna di state data
  if (typeof TEDUH_DATA !== "undefined" && TEDUH_DATA.updateUserPoints) {
    TEDUH_DATA.updateUserPoints(-cost);
  }

  // Tutup modal konfirmasi
  const confirmModal = document.getElementById("rwConfirmModalBackdrop");
  if (confirmModal) confirmModal.classList.remove("is-visible");

  // Sinkronisasi data poin di seluruh tampilan
  syncRewardPageData();

  // Buka modal hasil klaim voucher sukses
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const voucherCode = `${prefix}-${randomNum}`;

  const successModal = document.getElementById("rwModalBackdrop");
  const successCard = successModal
    ? successModal.querySelector(".rw-modal-card")
    : null;
  const modalTitle = document.getElementById("rwModalTitle");
  const modalDesc = document.getElementById("rwModalDesc");
  const modalCode = document.getElementById("rwModalVoucherCode");

  if (modalTitle) modalTitle.textContent = `${voucherTitle} Berhasil Diklaim!`;
  if (modalDesc)
    modalDesc.textContent = `Tunjukkan kode voucher berikut kepada petugas posko mitra saat pengambilan bibit atau penukaran benefit.`;
  if (modalCode) modalCode.textContent = voucherCode;

  if (successModal) {
    successModal.classList.add("is-visible");
    if (typeof gsap !== "undefined" && successCard) {
      gsap.fromTo(
        successCard,
        { scale: 0.88, opacity: 0, y: 24 },
        { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: "back.out(1.5)" },
      );
    }
  }

  showRwToast(
    `Berhasil menukarkan ${cost.toLocaleString("id-ID")} poin untuk ${voucherTitle}!`,
  );
  pendingRewardToRedeem = null;
}

/**
 * Menutup Modal Voucher Sukses
 */
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
  const modalCard = modal ? modal.querySelector(".rw-modal-card") : null;
  if (modal) {
    if (typeof gsap !== "undefined" && modalCard) {
      gsap.to(modalCard, {
        scale: 0.92,
        opacity: 0,
        y: 12,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => {
          modal.classList.remove("is-visible");
        },
      });
    } else {
      modal.classList.remove("is-visible");
    }
  }
}

/**
 * Sinkronisasi Data Poin Pengguna
 */
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

/**
 * Toast Notifikasi
 */
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

/**
 * Navigasi Menu Mobile Drawer
 */
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

// Global exports
window.switchRewardTab = switchRewardTab;
window.claimRewardVoucher = claimRewardVoucher;
window.closeRewardConfirmModal = closeRewardConfirmModal;
window.executeRewardRedeem = executeRewardRedeem;
window.closeRewardModal = closeRewardModal;
window.showRwToast = showRwToast;
window.syncRewardPageData = syncRewardPageData;

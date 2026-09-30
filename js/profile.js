/**
 * TEDUH DIGITAL PLATFORM
 * Berkas: js/profile.js
 * Deskripsi: Pengendali Dashboard Profil Warga, Status Kesejukan & Manajemen Pekarangan
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

let profileToastTimeout = null;

document.addEventListener("DOMContentLoaded", () => {
  initProfilePage();
});

function initProfilePage() {
  if (typeof TEDUH_DATA === "undefined") return;

  const user = TEDUH_DATA.getUserData();
  const level = TEDUH_DATA.getUserLevelInfo(user.points);

  // 1. Render Identitas Pengguna (Kolom Kiri Atas)
  renderUserIdentity(user, level);

  // 2. Render Jadwal & Agenda Aksi Pekarangan (Kolom Kiri Bawah)
  renderScheduleAgendas(user);

  // 3. Render Kubah Kesejukan & Metrik Mikro (Kolom Kanan Atas)
  renderClimateStats(user);

  // 4. Render Dompet Poin & Kupon Aktif
  renderWalletAndCoupons(user);

  // 5. Render Linimasa Riwayat Aktivitas (Maksimal 4)
  renderActivityTimeline(user);

  // 6. Inisialisasi Mikro-Interaksi & Feedback Animasi
  initProfileInteractions(user);

  // 7. Jalankan Animasi Sinematik GSAP Masuk Halaman Profil
  initProfileGSAPAnimations(user);
}

// Inisialisasi Animasi GSAP Masuk Halaman Profil
function initProfileGSAPAnimations(user) {
  if (typeof gsap === "undefined") return;

  // 1. Bento Grid Columns & Cards Entrance
  gsap.fromTo(
    ".pf-col:first-child .pf-card, .pf-col:first-child .pf-account-actions-stack",
    { opacity: 0, y: 24, scale: 0.98 },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      stagger: 0.1,
      duration: 0.6,
      ease: "power3.out",
    },
  );

  gsap.fromTo(
    ".pf-col:last-child .pf-card",
    { opacity: 0, y: 24, scale: 0.98 },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      stagger: 0.12,
      duration: 0.65,
      ease: "power3.out",
      delay: 0.08,
    },
  );

  // 2. Avatar Circle Elastic Pop
  gsap.fromTo(
    ".pf-avatar-circle",
    { scale: 0.7, opacity: 0 },
    {
      scale: 1,
      opacity: 1,
      duration: 0.55,
      ease: "back.out(1.8)",
      delay: 0.12,
    },
  );

  // 3. Identity Details Cascade
  gsap.fromTo(
    "#pfUserName, #pfUserTag, #pfLevelBadge, .pf-location-badge-box, .pf-target-box",
    { opacity: 0, x: -16 },
    {
      opacity: 1,
      x: 0,
      stagger: 0.06,
      duration: 0.45,
      ease: "power2.out",
      delay: 0.2,
    },
  );

  // 4. Climate Dome Score Ring Gauge & Live Counter
  const home = user && user.homeZone ? user.homeZone : {};
  const scoreVal = home.coolingScore || 86;
  const ringFg = document.getElementById("pfRingFg");
  const scoreEl = document.getElementById("pfCoolingScore");

  if (ringFg) {
    const circumference = 377;
    const targetOffset = circumference - (scoreVal / 100) * circumference;
    gsap.fromTo(
      ringFg,
      { strokeDashoffset: circumference },
      {
        strokeDashoffset: targetOffset,
        duration: 1.3,
        ease: "power2.out",
        delay: 0.25,
      },
    );
  }

  if (scoreEl) {
    const scoreCounter = { val: 0 };
    gsap.to(scoreCounter, {
      val: scoreVal,
      duration: 1.25,
      ease: "power2.out",
      delay: 0.25,
      onUpdate: () => {
        scoreEl.textContent = Math.round(scoreCounter.val);
      },
    });
  }

  // 5. Points Balance Live Count-Up
  const pointsEl = document.getElementById("pfWalletPointsNumber");
  if (pointsEl) {
    const targetPoints = user.points || 850;
    const pCounter = { val: 0 };
    gsap.to(pCounter, {
      val: targetPoints,
      duration: 1.2,
      ease: "power2.out",
      delay: 0.3,
      onUpdate: () => {
        pointsEl.textContent = `${Math.round(pCounter.val).toLocaleString("id-ID")} Poin`;
      },
    });
  }

  // 6. 2x2 Metric Tiles Stagger
  gsap.fromTo(
    ".pf-metric-tile",
    { opacity: 0, y: 14, scale: 0.94 },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      stagger: 0.06,
      duration: 0.45,
      ease: "back.out(1.4)",
      delay: 0.35,
    },
  );

  // 7. Schedule Rows & Date Badges Stagger
  gsap.fromTo(
    ".pf-schedule-row",
    { opacity: 0, x: -14 },
    {
      opacity: 1,
      x: 0,
      stagger: 0.08,
      duration: 0.45,
      ease: "power2.out",
      delay: 0.3,
    },
  );

  // 8. Timeline Items & Icons Stagger
  gsap.fromTo(
    ".pf-timeline-item",
    { opacity: 0, y: 12 },
    {
      opacity: 1,
      y: 0,
      stagger: 0.06,
      duration: 0.45,
      ease: "power2.out",
      delay: 0.4,
    },
  );

  gsap.fromTo(
    ".pf-timeline-icon",
    { scale: 0.75, opacity: 0 },
    {
      scale: 1,
      opacity: 1,
      stagger: 0.06,
      duration: 0.4,
      ease: "back.out(1.7)",
      delay: 0.42,
    },
  );
}

// Inisialisasi Mikro-Interaksi Lengkap Pada Seluruh Elemen Interaktif
function initProfileInteractions(user) {
  // 1. Interaksi Avatar (3D Tilt & Spring Bounce)
  const avatarContainer = document.querySelector(".pf-avatar-container");
  if (avatarContainer) {
    avatarContainer.style.cursor = "pointer";
    avatarContainer.setAttribute("title", "Ketuk untuk animasi avatar");
    avatarContainer.addEventListener("click", () => {
      if (typeof gsap === "undefined") return;
      const tl = gsap.timeline();
      tl.to(".pf-avatar-circle", {
        scale: 1.15,
        rotation: -7,
        duration: 0.18,
        ease: "power2.out",
      })
        .to(".pf-avatar-circle", {
          rotation: 7,
          duration: 0.16,
          ease: "power2.inOut",
        })
        .to(".pf-avatar-circle", {
          scale: 1,
          rotation: 0,
          duration: 0.35,
          ease: "back.out(2)",
        });
    });
  }

  // 2. Interaksi Kubah Kesejukan (Re-Trigger Spin & Score Count-Up)
  const climateDome = document.querySelector(".pf-climate-dome");
  if (climateDome) {
    climateDome.style.cursor = "pointer";
    climateDome.setAttribute("title", "Ketuk untuk refresh skor sejuk");
    climateDome.addEventListener("click", () => {
      if (typeof gsap === "undefined") return;
      const home = user && user.homeZone ? user.homeZone : {};
      const scoreVal = home.coolingScore || 86;
      const ringFg = document.getElementById("pfRingFg");
      const scoreEl = document.getElementById("pfCoolingScore");

      gsap.fromTo(
        climateDome,
        { scale: 0.97 },
        { scale: 1, duration: 0.35, ease: "back.out(2)" },
      );

      if (ringFg) {
        const circumference = 377;
        const targetOffset = circumference - (scoreVal / 100) * circumference;
        gsap.fromTo(
          ringFg,
          { strokeDashoffset: circumference },
          { strokeDashoffset: targetOffset, duration: 0.9, ease: "power2.out" },
        );
      }

      if (scoreEl) {
        const scoreCounter = { val: 0 };
        gsap.to(scoreCounter, {
          val: scoreVal,
          duration: 0.85,
          ease: "power2.out",
          onUpdate: () => {
            scoreEl.textContent = Math.round(scoreCounter.val);
          },
        });
      }
    });
  }

  // 3. Interaksi Dompet Poin (Bounce & Refresh Balance)
  const walletBox = document.querySelector(".pf-wallet-side-box");
  if (walletBox) {
    walletBox.style.cursor = "pointer";
    walletBox.setAttribute("title", "Ketuk untuk animasi poin");
    walletBox.addEventListener("click", (e) => {
      if (e.target.closest(".pf-wallet-redeem-action-btn")) return;
      if (typeof gsap === "undefined") return;
      const pointsEl = document.getElementById("pfWalletPointsNumber");
      gsap.fromTo(
        walletBox,
        { scale: 0.97 },
        { scale: 1, duration: 0.35, ease: "back.out(2)" },
      );
      if (pointsEl) {
        gsap.fromTo(
          pointsEl,
          { scale: 1.22 },
          { scale: 1, duration: 0.4, ease: "back.out(2)" },
        );
      }
    });
  }

  // 4. Interaksi Tile Metrik Mikro (Tactile Click Pop & Value Bump)
  document.querySelectorAll(".pf-metric-tile").forEach((tile) => {
    tile.style.cursor = "pointer";
    tile.addEventListener("click", () => {
      if (typeof gsap === "undefined") return;
      gsap.fromTo(
        tile,
        { scale: 0.94 },
        { scale: 1, duration: 0.35, ease: "back.out(2)" },
      );
      const val = tile.querySelector(".pf-metric-val");
      if (val) {
        gsap.fromTo(
          val,
          { scale: 1.2 },
          { scale: 1, duration: 0.35, ease: "back.out(2)" },
        );
      }
    });
  });

  // 5. Interaksi Pill Level, Lokasi & Target Pekarangan
  const tactileElements = [
    document.querySelector(".pf-location-badge-box"),
    document.querySelector(".pf-target-box"),
    document.getElementById("pfLevelBadge"),
  ];
  tactileElements.forEach((el) => {
    if (el) {
      el.style.cursor = "pointer";
      el.addEventListener("click", () => {
        if (typeof gsap === "undefined") return;
        gsap.fromTo(
          el,
          { scale: 0.97 },
          { scale: 1, duration: 0.3, ease: "back.out(2)" },
        );
      });
    }
  });

  // 6. Interaksi Tombol Edit Profil (Micro Spin + Text Field Glow + Toast, Tanpa Direct)
  const editBtn = document.querySelector(".pf-action-settings");
  if (editBtn) {
    editBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (typeof gsap !== "undefined") {
        gsap.fromTo(
          editBtn,
          { scale: 0.92 },
          { scale: 1, duration: 0.35, ease: "back.out(2)" },
        );
        const icon = editBtn.querySelector("svg");
        if (icon) {
          gsap.to(icon, {
            rotation: "+=360",
            duration: 0.5,
            ease: "power2.out",
          });
        }
        const editableFields = document.querySelectorAll(
          "#pfUserName, #pfLocationText, #pfTargetText",
        );
        gsap.fromTo(
          editableFields,
          { backgroundColor: "#EEF5EB", borderRadius: "6px" },
          {
            backgroundColor: "transparent",
            duration: 0.9,
            ease: "power2.out",
          },
        );
      }
      showProfileToast("Mode pengaturan profil siap ditinjau");
    });
  }

  // 7. Interaksi Tombol Tukar Poin & Link Semua Agenda
  const redeemBtn = document.querySelector(".pf-wallet-redeem-action-btn");
  if (redeemBtn) {
    redeemBtn.addEventListener("click", () => {
      if (typeof gsap !== "undefined") {
        gsap.fromTo(
          redeemBtn,
          { scale: 0.93 },
          { scale: 1, duration: 0.3, ease: "back.out(2)" },
        );
      }
    });
  }

  const allScheduleLink = document.querySelector(".pf-schedule-all-link");
  if (allScheduleLink) {
    allScheduleLink.addEventListener("click", () => {
      if (typeof gsap !== "undefined") {
        gsap.fromTo(
          allScheduleLink,
          { x: 4 },
          { x: 0, duration: 0.3, ease: "back.out(2)" },
        );
      }
    });
  }
}

// 1. Render Identitas Pengguna
function renderUserIdentity(user, level) {
  const nameEl = document.getElementById("pfUserName");
  const userEl = document.getElementById("pfUserTag");
  const levelBadgeEl = document.getElementById("pfLevelBadge");
  const locationEl = document.getElementById("pfLocationText");
  const targetEl = document.getElementById("pfTargetText");

  if (nameEl) nameEl.textContent = user.name || "John Doe";
  if (userEl) userEl.textContent = user.username || "@johndoe";

  if (levelBadgeEl) {
    levelBadgeEl.innerHTML = `
      <span style="width: 6px; height: 6px; border-radius: 50%; background: ${level.badgeColor}; display: inline-block;"></span>
      <span>Level ${level.number}: ${level.title}</span>
    `;
    levelBadgeEl.style.color = level.badgeColor;
    levelBadgeEl.style.backgroundColor = level.badgeBg;
  }

  if (locationEl)
    locationEl.textContent = user.location || "Denpasar Selatan, Bali";
  if (targetEl)
    targetEl.textContent =
      user.target || "Bikin teras lebih sejuk dan jaga pipa air tetap aman.";
}

// 2. Render Kubah Kesejukan & Metrik Mikro
function renderClimateStats(user) {
  const home = user.homeZone || {};
  const scoreVal = home.coolingScore || 86;
  const scoreEl = document.getElementById("pfCoolingScore");
  const ringFg = document.getElementById("pfRingFg");

  if (scoreEl) scoreEl.textContent = scoreVal;

  if (ringFg) {
    const circumference = 377;
    const offset = circumference - (scoreVal / 100) * circumference;
    ringFg.style.strokeDashoffset = offset;
  }

  // Tile Metrik Mikro
  const tempDropEl = document.getElementById("pfMetricTempDrop");
  const treesCountEl = document.getElementById("pfMetricTreesCount");
  const shadeAreaEl = document.getElementById("pfMetricShadeArea");
  const friendsCountEl = document.getElementById("pfMetricFriendsCount");

  if (tempDropEl) tempDropEl.textContent = home.tempReduction || "-4.4°C";
  if (treesCountEl)
    treesCountEl.textContent = `${home.treesPlanted || 2} Pohon`;
  if (shadeAreaEl) shadeAreaEl.textContent = home.shadedArea || "28.5 m²";
  if (friendsCountEl)
    friendsCountEl.textContent = `${home.friendsInvited || 2} Orang`;
}

// 3. Render Dompet Poin
function renderWalletAndCoupons(user) {
  const pointsEl = document.getElementById("pfWalletPointsNumber");
  if (pointsEl) pointsEl.textContent = `${user.points || 850} Poin`;
}

// 4. Render Linimasa Riwayat Aktivitas (Maksimal 4 - Tampilan Bersih & Tenang)
function renderActivityTimeline(user) {
  const container = document.getElementById("pfTimelineContainer");
  if (!container) return;

  const activities = (user.activities || []).slice(0, 4);
  container.innerHTML = "";

  if (activities.length === 0) {
    container.innerHTML = `
      <div style="padding: 20px; text-align: center; font-size: 12px; color: #6C7470; background: #F8FAF9; border-radius: 14px;">
        Belum ada catatan aktivitas. Ambil misi tanam di peta untuk memulai!
      </div>
    `;
    return;
  }

  activities.forEach((act) => {
    let iconSvg = "";
    if (act.icon === "tree") {
      iconSvg =
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L4 12h4v8h8v-8h4L12 2z"></path><path d="M12 12v8"></path></svg>';
    } else if (act.icon === "friends") {
      iconSvg =
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>';
    } else if (act.icon === "voucher") {
      iconSvg =
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z"></path><path d="M13 5v2"></path><path d="M13 11v2"></path><path d="M13 17v2"></path></svg>';
    } else if (act.icon === "biopori" || act.icon === "water") {
      iconSvg =
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg>';
    } else {
      iconSvg =
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>';
    }

    const item = document.createElement("div");
    item.className = "pf-timeline-item";
    item.innerHTML = `
      <div class="pf-timeline-icon">
        ${iconSvg}
      </div>
      <div class="pf-timeline-content">
        <div class="pf-timeline-top">
          <span class="pf-timeline-title">${act.title}</span>
          <span class="pf-timeline-badge">${act.badge}</span>
        </div>
      </div>
    `;
    container.appendChild(item);
  });
}

// 5. Render Jadwal & Agenda Aksi Pekarangan (Hover Murni Alami via CSS)
function renderScheduleAgendas(user) {
  const container = document.getElementById("pfScheduleContainer");
  if (!container) return;

  let activeMission = null;
  let completedMission = null;
  if (typeof localStorage !== "undefined") {
    const savedMission = localStorage.getItem("teduh_active_mission");
    if (savedMission) {
      try {
        const parsed = JSON.parse(savedMission);
        if (parsed) {
          if (!parsed.isCompleted) {
            activeMission = parsed;
          } else {
            completedMission = parsed;
          }
        }
      } catch (e) {}
    }
  }

  // Base care agendas (Pemupukan, Mulsa, Cek Resapan)
  const baseCareAgendas = (user.scheduleAgendas || []).filter(
    (ag) => !ag.isMission && !ag.title.includes("Tanam"),
  );
  const agendas = [];

  if (activeMission) {
    const collabsUsernames = (activeMission.friends || [])
      .map((f) => f.username)
      .join(",");
    const encodedZone = encodeURIComponent(
      activeMission.zoneName || "Jl. Teuku Umar Barat",
    );
    const encodedTree = encodeURIComponent(
      activeMission.treeName || "Pohon Tanjung",
    );
    const points = activeMission.points || 250;
    const missionUrl = `community.html?action=complete-mission&zone=${encodedZone}&tree=${encodedTree}&points=${points}${
      collabsUsernames ? "&collabs=" + encodeURIComponent(collabsUsernames) : ""
    }`;

    agendas.push({
      id: activeMission.id || "active-mission-agenda",
      title: `Tanam ${activeMission.treeName || "Pohon Tanjung"}`,
      dateNum: "14",
      month: "Sep",
      isToday: true,
      isMission: true,
      time: "Hari Ini",
      location: activeMission.zoneName || "Pekarangan Rumah",
      note: `Misi penanaman peneduh aktif di ${
        activeMission.zoneName || "pekarangan"
      }. Selesaikan aksi tanam dan sertakan foto pekarangan untuk klaim +${points} Poin.`,
      missionUrl: missionUrl,
    });
  } else if (completedMission) {
    agendas.push({
      id: completedMission.id || "completed-mission-agenda",
      title: `Tanam ${completedMission.treeName || "Pohon Tanjung"}`,
      dateNum: "14",
      month: "Sep",
      isToday: true,
      isCompletedMission: true,
      time: "Selesai",
      location: completedMission.zoneName || "Pekarangan Rumah",
      note: `Misi penanaman peneduh telah selesai diverifikasi. Saldo +${
        completedMission.points || 250
      } Poin telah masuk ke akun Anda.`,
      statusText: "Selesai (+250 Poin)",
    });
  } else {
    agendas.push({
      id: "default-mission-agenda",
      title: "Tanam Pohon Tanjung di Pekarangan",
      dateNum: "14",
      month: "Sep",
      isToday: true,
      time: "16:30 WITA",
      location: "Halaman Depan Rumah",
      note: "Misi penanaman peneduh untuk meredam pantulan panas lantai semen dan meneduhkan pekarangan.",
      missionUrl: "map.html",
    });
  }

  baseCareAgendas.forEach((care) => agendas.push(care));

  const displayAgendas = agendas.slice(0, 3);
  container.innerHTML = "";

  if (displayAgendas.length === 0) {
    container.innerHTML = `
      <div style="padding: 16px; font-size: 11px; color: #6C7470; background: #F8FAF9; border-radius: 12px; text-align: center;">
        Belum ada agenda aktif minggu ini. Ambil misi di halaman peta!
      </div>
    `;
    return;
  }

  displayAgendas.forEach((ag) => {
    const isToday =
      ag.isToday ||
      ag.day === "HARI" ||
      ag.badgeText === "Hari Ini" ||
      ag.dateNum === "INI";
    const dateNum = ag.dateNum && ag.dateNum !== "INI" ? ag.dateNum : "14";
    const monthText = ag.month
      ? ag.month.toUpperCase().includes("SEP")
        ? "Sep"
        : ag.month
      : "Sep";

    const row = document.createElement("div");
    row.className = `pf-schedule-row ${isToday ? "row-today" : ""}`;
    row.setAttribute("tabindex", "0");
    row.setAttribute(
      "aria-label",
      `${ag.title}, tanggal ${dateNum} ${monthText}`,
    );

    let actionBtnHtml = "";
    if (ag.missionUrl) {
      const btnText =
        ag.missionUrl === "map.html" ? "Pilih di Peta" : "Selesaikan";
      actionBtnHtml = `
        <div class="pf-schedule-action-wrap">
          <a href="${ag.missionUrl}" class="pf-schedule-action-btn" onclick="event.stopPropagation()">
            <span>${btnText}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </a>
        </div>
      `;
    } else if (ag.isCompletedMission) {
      actionBtnHtml = `
        <div class="pf-schedule-action-wrap">
          <span class="pf-schedule-completed-badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            <span>Selesai Terverifikasi</span>
          </span>
        </div>
      `;
    }
    // Remove button for today’s agenda to keep pure hover experience
    if (isToday) {
      actionBtnHtml = "";
    }
    const tagBadge = ag.isCompletedMission
      ? '<span class="pf-schedule-tag tag-completed">Selesai</span>'
      : isToday
        ? '<span class="pf-schedule-tag">Hari Ini</span>'
        : "";

    row.innerHTML = `
      <div class="pf-schedule-row-main">
        <div class="pf-schedule-date-block ${isToday ? "date-today" : ""}">
          <span class="pf-date-num">${dateNum}</span>
          <span class="pf-date-month">${monthText}</span>
        </div>
        <div class="pf-schedule-info">
          <div class="pf-schedule-top">
            <span class="pf-schedule-title">${ag.title}</span>
            ${tagBadge}
          </div>
        </div>
      </div>

      <div class="pf-schedule-detail-panel">
        <p class="pf-schedule-detail-note">${ag.note || ""}</p>
        <div class="pf-schedule-detail-meta">
          <span class="pf-schedule-meta-item">
            <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke-width="2"></circle><path d="M12 6v6l4 2" stroke-width="2" stroke-linecap="round"></path></svg>
            <span>${ag.time || "16:00 WITA"}</span>
          </span>
          <span class="pf-schedule-meta-item">
            <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
            <span>${ag.location || "Pekarangan Rumah"}</span>
          </span>
        </div>
        ${actionBtnHtml}
      </div>
    `;

    container.appendChild(row);
  });
}

// Toast Notifikasi Minimalis
function showProfileToast(message) {
  let toast = document.getElementById("teduhToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "teduhToast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add("is-visible");

  if (typeof gsap !== "undefined") {
    gsap.fromTo(
      toast,
      { y: 24, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, duration: 0.35, ease: "back.out(1.8)" },
    );
  }

  if (profileToastTimeout) clearTimeout(profileToastTimeout);
  profileToastTimeout = setTimeout(() => {
    if (typeof gsap !== "undefined") {
      gsap.to(toast, {
        y: 16,
        opacity: 0,
        duration: 0.25,
        ease: "power2.in",
        onComplete: () => {
          toast.classList.remove("is-visible");
        },
      });
    } else {
      toast.classList.remove("is-visible");
    }
  }, 2400);
}

// Global Exports
window.initProfilePage = initProfilePage;
window.renderUserIdentity = renderUserIdentity;
window.renderClimateStats = renderClimateStats;
window.renderWalletAndCoupons = renderWalletAndCoupons;
window.renderActivityTimeline = renderActivityTimeline;
window.renderScheduleAgendas = renderScheduleAgendas;
window.showProfileToast = showProfileToast;

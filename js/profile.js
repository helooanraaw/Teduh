/**
 * TEDUH DIGITAL PLATFORM
 * Berkas: js/profile.js
 * Deskripsi: Pengendali Dashboard Profil Warga, Status Kesejukan & Manajemen Pekarangan
 *
 * ==========================================================================
 * SUMBER KARYA & ATRIBUSI MEDIA / ASET:
 * 1. Aset Visual (assets/*): Dihasilkan via Generative AI (Banana AI).
 * 2. Desain Logo: Dibuat mandiri via Canva oleh tim pengembang.
 * 3. Pustaka Eksternal: jQuery 3.7.1 CDN (MIT License).
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

  renderUserIdentity(user, level);

  renderScheduleAgendas(user);

  renderClimateStats(user);

  renderWalletAndCoupons(user);

  renderActivityTimeline(user);

  initProfileInteractions(user);

  initProfileEntranceAnimations(user);
}

function initProfileEntranceAnimations(user) {
  $(".pf-card, .pf-account-actions-stack").each(function (idx) {
    const $card = $(this);
    $card.css({ opacity: 0, transform: "translateY(20px)" });
    setTimeout(() => {
      $card.css({
        opacity: 1,
        transform: "translateY(0)",
        transition: "opacity 0.5s ease, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
      });
    }, 60 + idx * 70);
  });

  const home = user && user.homeZone ? user.homeZone : {};
  const scoreVal = home.coolingScore || 86;
  const ringFg = document.getElementById("pfRingFg");
  const scoreEl = document.getElementById("pfCoolingScore");

  if (ringFg) {
    const circumference = 377;
    const targetOffset = circumference - (scoreVal / 100) * circumference;
    ringFg.style.strokeDashoffset = circumference;
    setTimeout(() => {
      ringFg.style.transition = "stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1)";
      ringFg.style.strokeDashoffset = targetOffset;
    }, 200);
  }

  if (scoreEl) {
    const startTime = performance.now();
    const duration = 1100;
    function countScore(now) {
      const p = Math.min(1, (now - startTime) / duration);
      const ease = 1 - Math.pow(1 - p, 3);
      scoreEl.textContent = Math.round(scoreVal * ease);
      if (p < 1) requestAnimationFrame(countScore);
      else scoreEl.textContent = scoreVal;
    }
    setTimeout(() => requestAnimationFrame(countScore), 200);
  }

  const pointsEl = document.getElementById("pfWalletPointsNumber");
  if (pointsEl) {
    const targetPoints = user.points || 850;
    const startTime = performance.now();
    const duration = 1100;
    function countPoints(now) {
      const p = Math.min(1, (now - startTime) / duration);
      const ease = 1 - Math.pow(1 - p, 3);
      const current = Math.round(targetPoints * ease);
      pointsEl.textContent = `${current.toLocaleString("id-ID")} Poin`;
      if (p < 1) requestAnimationFrame(countPoints);
      else pointsEl.textContent = `${targetPoints.toLocaleString("id-ID")} Poin`;
    }
    setTimeout(() => requestAnimationFrame(countPoints), 250);
  }
}

function initProfileInteractions(user) {
  const avatarContainer = document.querySelector(".pf-avatar-container");
  if (avatarContainer) {
    avatarContainer.style.cursor = "pointer";
    avatarContainer.setAttribute("title", "Ketuk untuk animasi avatar");
    avatarContainer.addEventListener("click", () => {
      const circle = document.querySelector(".pf-avatar-circle");
      if (circle) {
        circle.style.transform = "scale(1.15) rotate(-7deg)";
        circle.style.transition = "transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)";
        setTimeout(() => {
          circle.style.transform = "scale(1) rotate(0deg)";
        }, 220);
      }
    });
  }

  const climateDome = document.querySelector(".pf-climate-dome");
  if (climateDome) {
    climateDome.style.cursor = "pointer";
    climateDome.setAttribute("title", "Ketuk untuk refresh skor sejuk");
    climateDome.addEventListener("click", () => {
      const home = user && user.homeZone ? user.homeZone : {};
      const scoreVal = home.coolingScore || 86;
      const ringFg = document.getElementById("pfRingFg");
      const scoreEl = document.getElementById("pfCoolingScore");

      climateDome.style.transform = "scale(0.97)";
      climateDome.style.transition = "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)";
      setTimeout(() => {
        climateDome.style.transform = "scale(1)";
      }, 250);

      if (ringFg) {
        const circumference = 377;
        const targetOffset = circumference - (scoreVal / 100) * circumference;
        ringFg.style.strokeDashoffset = circumference;
        ringFg.style.transition = "stroke-dashoffset 0.9s cubic-bezier(0.16, 1, 0.3, 1)";
        requestAnimationFrame(() => {
          ringFg.style.strokeDashoffset = targetOffset;
        });
      }

      if (scoreEl) {
        let current = 0;
        const step = () => {
          current += (scoreVal - current) * 0.15;
          if (Math.abs(scoreVal - current) < 0.5) {
            scoreEl.textContent = scoreVal;
          } else {
            scoreEl.textContent = Math.round(current);
            requestAnimationFrame(step);
          }
        };
        requestAnimationFrame(step);
      }
    });
  }

  const walletBox = document.querySelector(".pf-wallet-side-box");
  if (walletBox) {
    walletBox.style.cursor = "pointer";
    walletBox.setAttribute("title", "Ketuk untuk animasi poin");
    walletBox.addEventListener("click", (e) => {
      if (e.target.closest(".pf-wallet-redeem-action-btn")) return;
      const pointsEl = document.getElementById("pfWalletPointsNumber");
      walletBox.style.transform = "scale(0.97)";
      walletBox.style.transition = "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)";
      setTimeout(() => {
        walletBox.style.transform = "scale(1)";
      }, 250);
      if (pointsEl) {
        pointsEl.style.transform = "scale(1.2)";
        pointsEl.style.transition = "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)";
        setTimeout(() => {
          pointsEl.style.transform = "scale(1)";
        }, 300);
      }
    });
  }

  document.querySelectorAll(".pf-metric-tile").forEach((tile) => {
    tile.style.cursor = "pointer";
    tile.addEventListener("click", () => {
      tile.style.transform = "scale(0.95)";
      tile.style.transition = "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)";
      setTimeout(() => {
        tile.style.transform = "scale(1)";
      }, 250);
      const val = tile.querySelector(".pf-metric-val");
      if (val) {
        val.style.transform = "scale(1.15)";
        val.style.transition = "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)";
        setTimeout(() => {
          val.style.transform = "scale(1)";
        }, 250);
      }
    });
  });

  const tactileElements = [
    document.querySelector(".pf-location-badge-box"),
    document.querySelector(".pf-target-box"),
    document.getElementById("pfLevelBadge"),
  ];
  tactileElements.forEach((el) => {
    if (el) {
      el.style.cursor = "pointer";
      el.addEventListener("click", () => {
        el.style.transform = "scale(0.96)";
        el.style.transition = "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)";
        setTimeout(() => {
          el.style.transform = "scale(1)";
        }, 250);
      });
    }
  });

  const editBtn = document.querySelector(".pf-action-settings");
  if (editBtn) {
    editBtn.addEventListener("click", (e) => {
      e.preventDefault();
      editBtn.style.transform = "scale(0.92)";
      editBtn.style.transition = "transform 0.25s ease";
      setTimeout(() => {
        editBtn.style.transform = "scale(1)";
      }, 250);

      const icon = editBtn.querySelector("svg");
      if (icon) {
        icon.style.transform = "rotate(360deg)";
        icon.style.transition = "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)";
        setTimeout(() => {
          icon.style.transform = "rotate(0deg)";
          icon.style.transition = "none";
        }, 650);
      }

      const editableFields = document.querySelectorAll(
        "#pfUserName, #pfLocationText, #pfTargetText",
      );
      editableFields.forEach((field) => {
        field.style.backgroundColor = "#EEF5EB";
        field.style.borderRadius = "6px";
        field.style.transition = "background-color 0.8s ease";
        setTimeout(() => {
          field.style.backgroundColor = "transparent";
        }, 800);
      });

      showProfileToast("Mode pengaturan profil siap ditinjau");
    });
  }

  const redeemBtn = document.querySelector(".pf-wallet-redeem-action-btn");
  if (redeemBtn) {
    redeemBtn.addEventListener("click", () => {
      redeemBtn.style.transform = "scale(0.93)";
      redeemBtn.style.transition = "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)";
      setTimeout(() => {
        redeemBtn.style.transform = "scale(1)";
      }, 250);
    });
  }

  const allScheduleLink = document.querySelector(".pf-schedule-all-link");
  if (allScheduleLink) {
    allScheduleLink.addEventListener("click", () => {
      allScheduleLink.style.transform = "translateX(4px)";
      allScheduleLink.style.transition = "transform 0.25s ease";
      setTimeout(() => {
        allScheduleLink.style.transform = "translateX(0)";
      }, 250);
    });
  }
}

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

function renderWalletAndCoupons(user) {
  const pointsEl = document.getElementById("pfWalletPointsNumber");
  if (pointsEl) pointsEl.textContent = `${user.points || 850} Poin`;
}

function escapeHtml(str) {
  if (typeof str !== "string") return str || "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

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
    let iconClass = "is-tree";
    const type = (act.icon || "").toLowerCase();

    if (type === "tree" || type.includes("tanam") || type.includes("pohon")) {
      iconClass = "is-tree";
      iconSvg = `
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M12 2L4 11h4v7h8v-7h4L12 2z"></path>
          <path d="M12 18v4"></path>
        </svg>
      `;
    } else if (type === "friends" || type.includes("gotong") || type.includes("relawan")) {
      iconClass = "is-friends";
      iconSvg = `
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      `;
    } else if (type === "voucher" || type.includes("kupon") || type.includes("tukar") || type.includes("hadiah")) {
      iconClass = "is-voucher";
      iconSvg = `
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z"></path>
          <line x1="12" y1="9" x2="12" y2="15"></line>
        </svg>
      `;
    } else if (type === "biopori" || type.includes("resapan") || type.includes("lubang")) {
      iconClass = "is-biopori";
      iconSvg = `
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
          <path d="M12 12v6"></path>
          <path d="M9 15l3 3 3-3"></path>
        </svg>
      `;
    } else if (type === "water" || type.includes("siram") || type.includes("rawat")) {
      iconClass = "is-water";
      iconSvg = `
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
        </svg>
      `;
    } else if (type === "temp" || type.includes("suhu") || type.includes("termal") || type.includes("panas")) {
      iconClass = "is-temp";
      iconSvg = `
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"></path>
        </svg>
      `;
    } else {
      iconClass = "is-award";
      iconSvg = `
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      `;
    }

    const isNegativeBadge = (act.badge || "").includes("-");
    const badgeClass = isNegativeBadge ? "is-negative" : "is-positive";

    const item = document.createElement("div");
    item.className = "pf-timeline-item";
    item.innerHTML = `
      <div class="pf-timeline-icon ${iconClass}">
        ${iconSvg}
      </div>
      <div class="pf-timeline-content">
        <div class="pf-timeline-top">
          <span class="pf-timeline-title">${escapeHtml(act.title)}</span>
          <span class="pf-timeline-badge ${badgeClass}">${escapeHtml(act.badge)}</span>
        </div>
      </div>
    `;
    container.appendChild(item);
  });
}

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

  if (profileToastTimeout) clearTimeout(profileToastTimeout);
  profileToastTimeout = setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2400);
}

window.initProfilePage = initProfilePage;
window.renderUserIdentity = renderUserIdentity;
window.renderClimateStats = renderClimateStats;
window.renderWalletAndCoupons = renderWalletAndCoupons;
window.renderActivityTimeline = renderActivityTimeline;
window.renderScheduleAgendas = renderScheduleAgendas;
window.showProfileToast = showProfileToast;

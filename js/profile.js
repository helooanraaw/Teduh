/**
 * TEDUH DIGITAL PLATFORM - PROFILE CONTROLLER (js/profile.js)
 * Mengelola rendering data profil, visualisasi ring gauge, peta satelit rumah, dan riwayat aktivitas
 * Disiplin: Bebas Em Dash, Presisi, Non-Slop
 */

document.addEventListener('DOMContentLoaded', () => {
  initProfilePage();
});

function initProfilePage() {
  if (typeof TEDUH_DATA === 'undefined') return;

  const user = TEDUH_DATA.getUserData();
  const level = TEDUH_DATA.getUserLevelInfo(user.points);

  // 1. Render Identitas Pengguna (Kolom Kiri Atas)
  renderUserIdentity(user, level);

  // 2. Render Jadwal & Agenda Aksi Pekarangan (Kolom Kiri Bawah)
  renderScheduleAgendas(user);

  // 3. Render Kubah Kesejukan & Metrik Mikro (Kolom Tengah)
  renderClimateStats(user);

  // 4. Render Linimasa Riwayat Aktivitas (Kolom Tengah Bawah)
  renderActivityTimeline(user);

  // 5. Inisialisasi Peta Satelit Rumah (Kolom Kanan)
  initHomeSatelliteMap(user);

  // 6. Render Dompet Poin & Kupon Aktif (Kolom Kanan Bawah)
  renderWalletAndTrees(user);
}

// 1. Render Identitas Pengguna
function renderUserIdentity(user, level) {
  const nameEl = document.getElementById('pfUserName');
  const userEl = document.getElementById('pfUserTag');
  const emailEl = document.getElementById('pfUserEmail');
  const levelBadgeEl = document.getElementById('pfLevelBadge');
  const levelRingBadgeEl = document.getElementById('pfLevelRingBadge');
  const locationEl = document.getElementById('pfLocationText');
  const targetEl = document.getElementById('pfTargetText');

  if (nameEl) nameEl.textContent = user.name || "John Doe";
  if (userEl) userEl.textContent = user.username || "@johndoe";
  if (emailEl) emailEl.textContent = user.email || "johndoe@gmail.com";
  
  if (levelRingBadgeEl) {
    levelRingBadgeEl.textContent = `L${level.number}`;
    levelRingBadgeEl.style.backgroundColor = level.badgeColor;
  }

  if (levelBadgeEl) {
    levelBadgeEl.innerHTML = `
      <span style="width: 6px; height: 6px; border-radius: 50%; background: ${level.badgeColor}; display: inline-block;"></span>
      <span>Level ${level.number}: ${level.title}</span>
    `;
    levelBadgeEl.style.color = level.badgeColor;
    levelBadgeEl.style.backgroundColor = level.badgeBg;
  }

  if (locationEl) locationEl.textContent = user.location || "Denpasar Selatan, Bali";
  if (targetEl) targetEl.textContent = user.target || "Bikin teras lebih sejuk dan jaga pipa air tetap aman.";

  // Quick stats bar ala NutriNesia
  const quickPointsEl = document.getElementById('pfUserQuickPoints');
  const quickTreesEl = document.getElementById('pfUserQuickTrees');
  const quickMissionsEl = document.getElementById('pfUserQuickMissions');
  if (quickPointsEl) quickPointsEl.textContent = user.points || 850;
  if (quickTreesEl) quickTreesEl.textContent = (user.homeZone && user.homeZone.treesPlanted) || 4;
  if (quickMissionsEl) quickMissionsEl.textContent = user.completedMissions || 3;
}

// 2. Render Kubah Kesejukan & Metrik Mikro
function renderClimateStats(user) {
  const home = user.homeZone || {};
  const scoreVal = home.coolingScore || 86;
  const scoreEl = document.getElementById('pfCoolingScore');
  const ringFg = document.getElementById('pfRingFg');

  if (scoreEl) scoreEl.textContent = scoreVal;

  if (ringFg) {
    // Keliling lingkaran r=60 adalah 2 * PI * 60 = 377
    const circumference = 377;
    const offset = circumference - (scoreVal / 100) * circumference;
    setTimeout(() => {
      ringFg.style.strokeDashoffset = offset;
    }, 150);
  }

  // Tile Metrik Mikro
  const tempDropEl = document.getElementById('pfMetricTempDrop');
  const treesCountEl = document.getElementById('pfMetricTreesCount');
  const shadeAreaEl = document.getElementById('pfMetricShadeArea');
  const friendsCountEl = document.getElementById('pfMetricFriendsCount');

  if (tempDropEl) tempDropEl.textContent = home.tempReduction || "-4.4°C";
  if (treesCountEl) treesCountEl.textContent = `${home.treesPlanted || 2} Pohon`;
  if (shadeAreaEl) shadeAreaEl.textContent = home.shadedArea || "28.5 m²";
  if (friendsCountEl) friendsCountEl.textContent = `${home.friendsInvited || 2} Orang`;
}

// 3. Render Linimasa Riwayat Aktivitas (Distilled & Harmonious)
function renderActivityTimeline(user) {
  const container = document.getElementById('pfTimelineContainer');
  if (!container) return;

  const activities = user.activities || [];
  container.innerHTML = '';

  if (activities.length === 0) {
    container.innerHTML = `
      <div style="padding: 20px; text-align: center; font-size: 12px; color: #6C7470; background: #F8FAF9; border-radius: 14px;">
        Belum ada catatan aktivitas. Ambil misi tanam di peta untuk memulai!
      </div>
    `;
    return;
  }

  activities.forEach(act => {
    let iconSvg = '';
    if (act.icon === 'tree') {
      iconSvg = '<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 2L4 14h5v8h6v-8h5L12 2z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>';
    } else if (act.icon === 'friends') {
      iconSvg = '<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke-width="2"></path><circle cx="9" cy="7" r="4" stroke-width="2"></circle><path d="M23 21v-2a4 4 0 00-3-3.87m-4-12a4 4 0 010 7.75" stroke-width="2"></path></svg>';
    } else if (act.icon === 'voucher') {
      iconSvg = '<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2" stroke-width="2"></rect><path d="M7 15h10M7 9h4" stroke-width="2"></path></svg>';
    } else {
      iconSvg = '<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" stroke-width="2"></circle><path d="M12 8v8M8 12h8" stroke-width="2"></path></svg>';
    }

    const item = document.createElement('div');
    item.className = 'pf-timeline-item';
    item.innerHTML = `
      <div class="pf-timeline-icon">
        ${iconSvg}
      </div>
      <div class="pf-timeline-content">
        <div class="pf-timeline-top">
          <span class="pf-timeline-title">${act.title}</span>
          <span class="pf-timeline-badge badge-${act.badgeType}">${act.badge}</span>
        </div>
        <span class="pf-timeline-meta">${act.location} • ${act.date}</span>
      </div>
    `;
    container.appendChild(item);
  });
}

// 4. Inisialisasi Peta Satelit Rumah (Leaflet.js) dengan Radius Kesejukan Bertingkat
let homeMapInstance = null;
function initHomeSatelliteMap(user) {
  const mapEl = document.getElementById('profileHomeMap');
  if (!mapEl || typeof L === 'undefined') return;

  const home = user.homeZone || { lat: -8.6750, lng: 115.2080 };
  const lat = home.lat || -8.6750;
  const lng = home.lng || 115.2080;

  if (homeMapInstance) {
    homeMapInstance.remove();
  }

  homeMapInstance = L.map('profileHomeMap', {
    zoomControl: false,
    attributionControl: false,
    scrollWheelZoom: false
  }).setView([lat, lng], 17);

  // Google Satellite Hybrid Tile Layer (Tanpa API Key)
  L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
    maxZoom: 20
  }).addTo(homeMapInstance);

  // Marker Pin Rumah
  const homeIcon = L.divIcon({
    className: 'custom-home-pin',
    html: `
      <div style="background: #1A382B; color: #FFFFFF; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(0,0,0,0.4); border: 2px solid #FFFFFF;">
        <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });

  L.marker([lat, lng], { icon: homeIcon }).addTo(homeMapInstance);

  // Radius Luar Kesejukan (26 meter buffer - Luas Naungan Daun)
  L.circle([lat, lng], {
    radius: 26,
    color: '#4ADE80',
    fillColor: '#22C55E',
    fillOpacity: 0.16,
    weight: 1.5,
    dashArray: '4, 6'
  }).addTo(homeMapInstance);

  // Radius Inti Naungan Rumah (13 meter core)
  L.circle([lat, lng], {
    radius: 13,
    color: '#22C55E',
    fillColor: '#16A34A',
    fillOpacity: 0.35,
    weight: 2
  }).addTo(homeMapInstance);

  // Data Rincian Peta di Bawah
  const beforeTempEl = document.getElementById('pfMapBeforeTemp');
  const currentTempEl = document.getElementById('pfMapCurrentTemp');
  const pipeDistEl = document.getElementById('pfMapPipeDist');

  if (beforeTempEl) beforeTempEl.textContent = home.beforeTemp || "38.8°C";
  if (currentTempEl) currentTempEl.textContent = home.currentTemp || "34.4°C";
  if (pipeDistEl) pipeDistEl.textContent = home.pipeDistance ? `${home.pipeDistance} (Aman Fondasi)` : "2.1 meter (Aman Fondasi)";

  // Pastikan Leaflet merender ubin satelit secara presisi sesuai ukuran kontainer
  setTimeout(() => {
    if (homeMapInstance) {
      homeMapInstance.invalidateSize();
    }
  }, 300);

  window.addEventListener('resize', () => {
    if (homeMapInstance) {
      homeMapInstance.invalidateSize();
    }
  });
}

// 5. Render Dompet Poin & Kupon Aktif
function renderWalletAndTrees(user) {
  const pointsEl = document.getElementById('pfWalletPointsNumber');
  if (pointsEl) pointsEl.textContent = `${user.points || 850} Poin`;

  // Kupon Aktif (Dengan Arrow Navigasi Tenang Tanpa Kode Teks)
  const couponsContainer = document.getElementById('pfCouponsContainer');
  if (couponsContainer) {
    const vouchers = TEDUH_DATA.getUserVouchers ? TEDUH_DATA.getUserVouchers() : [];
    couponsContainer.innerHTML = '';

    if (vouchers.length === 0) {
      couponsContainer.innerHTML = `
        <div style="padding: 10px 12px; font-size: 11px; color: #6C7470; background: #F8FAF9; border-radius: 10px; text-align: center;">
          Belum ada kupon yang ditukarkan.
        </div>
      `;
    } else {
      vouchers.forEach(v => {
        const item = document.createElement('div');
        item.className = 'pf-coupon-item';
        item.innerHTML = `
          <div>
            <strong>${v.title}</strong>
            <span style="font-size: 10.5px; color: #6C7470;">${v.provider}</span>
          </div>
          <div class="pf-coupon-arrow">
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
          </div>
        `;
        couponsContainer.appendChild(item);
      });
    }
  }

  // Daftar Pohon Tertanam (Sederhana, Bersih & Selaras)
  const treesContainer = document.getElementById('pfPlantedTreesContainer');
  if (treesContainer) {
    const trees = user.plantedTrees || [];
    treesContainer.innerHTML = '';

    trees.forEach(t => {
      const row = document.createElement('div');
      row.className = 'pf-tree-row';
      const treeImg = t.icon || 'images/trees/tree-tanjung.jpg';
      const cleanName = t.name ? t.name.split('(')[0].trim() : 'Pohon Peneduh';
      row.innerHTML = `
        <div class="pf-tree-ico">
          <img src="${treeImg}" alt="${cleanName}" class="pf-tree-img">
        </div>
        <div class="pf-tree-info">
          <span class="pf-tree-name">${cleanName}</span>
          <span class="pf-tree-meta">${t.root} • Jarak ${t.distance}</span>
        </div>
      `;
      treesContainer.appendChild(row);
    });
  }
}

// 7. Render Jadwal & Agenda Aksi Pekarangan (Bebas Deskripsi Panjang)
function renderScheduleAgendas(user) {
  const container = document.getElementById('pfScheduleContainer');
  if (!container) return;

  const agendas = user.scheduleAgendas || [];
  container.innerHTML = '';

  if (agendas.length === 0) {
    container.innerHTML = `
      <div style="padding: 16px; font-size: 11px; color: #6C7470; background: #F8FAF9; border-radius: 12px; text-align: center;">
        Belum ada agenda aktif minggu ini. Ambil misi di halaman komunitas!
      </div>
    `;
    return;
  }

  agendas.forEach(ag => {
    const isToday = ag.isToday || ag.day === 'HARI' || ag.badgeText === 'Hari Ini' || ag.dateNum === 'INI';
    const dateNum = (ag.dateNum && ag.dateNum !== 'INI') ? ag.dateNum : '14';
    const monthText = ag.month ? (ag.month.toUpperCase().includes('SEP') ? 'Sep' : ag.month) : 'Sep';
    const row = document.createElement('div');
    row.className = 'pf-schedule-row';
    row.innerHTML = `
      <div class="pf-schedule-date-block ${isToday ? 'date-today' : ''}">
        <span class="pf-date-num">${dateNum}</span>
        <span class="pf-date-month">${monthText}</span>
      </div>
      <div class="pf-schedule-info">
        <div class="pf-schedule-top">
          <span class="pf-schedule-title">${ag.title}</span>
          ${isToday ? '<span class="pf-schedule-tag">Hari Ini</span>' : ''}
        </div>
        <span class="pf-schedule-meta">${ag.location}</span>
      </div>
    `;
    container.appendChild(row);
  });
}

// Handler Salin Kode Kupon
function copyProfileCoupon(code) {
  navigator.clipboard.writeText(code).then(() => {
    const toast = document.getElementById('teduhToast');
    if (toast) {
      toast.textContent = `Kode kupon ${code} berhasil disalin ke papan klip.`;
      toast.style.display = 'block';
      toast.style.position = 'fixed';
      toast.style.bottom = '24px';
      toast.style.right = '24px';
      toast.style.background = '#0E1116';
      toast.style.color = '#FFFFFF';
      toast.style.padding = '12px 20px';
      toast.style.borderRadius = '12px';
      toast.style.fontSize = '12px';
      toast.style.fontWeight = '700';
      toast.style.zIndex = '9999';
      setTimeout(() => {
        toast.style.display = 'none';
      }, 3000);
    } else {
      alert(`Kode kupon ${code} berhasil disalin.`);
    }
  });
}

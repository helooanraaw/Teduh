/**
 * TEDUH DIGITAL PLATFORM - MAP SPATIAL ENGINE (js/map.js)
 * Mengelola Leaflet Satellite Hybrid, Pencarian Autocomplete, Analisis Klik Peta,
 * Lapisan Polygon Analisa Area (Panas vs Sejuk), Misi Tanam, dan Profil John Doe
 * Disiplin Desain: Zero Card Shadow, Zero Card Border, Bebas Em Dash (R-02)
 */

let mapInstance = null;
let activeZone = null;
let activeMarker = null;
let activeSimulationCircle = null;
let activeMissionCircle = null;
let presetMarkers = [];
let pollutionPolygonLayers = [];
let friendMarkers = [];
let selectedMissionFriends = [];
let isPollutionLayerActive = false;
let activeTreeSimCount = 1;
let completedActionSteps = new Set();
let activeFactorIndex = null;

document.addEventListener('DOMContentLoaded', () => {
  initMap();
  initSearchAutocomplete();
  initOnboarding();
  initDrawerTouchGestures();
  checkUrlParameters();
  syncUserProfile();
});

// Inisialisasi Peta Leaflet dengan Google Satellite Hybrid
function initMap() {
  const mapElement = document.getElementById('map');
  if (!mapElement) return;

  // Koordinat awal Denpasar Pusat
  mapInstance = L.map('map', {
    zoomControl: false,
    attributionControl: true
  }).setView([-8.6750, 115.2150], 13);

  // 1. Layer Citra Satelit Murni Google Earth (Bebas Iklan, Toko, & Garis Tebal)
  L.tileLayer('https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    attribution: 'Citra Satelit &copy; Google Earth | Platform Teduh'
  }).addTo(mapInstance);

  // 2. Layer Khusus Nama Daerah Administratif Bersih (Denpasar, Panjer, Sesetan, Badung, Karangasem, dll - Tanpa Tempat Bisnis)
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png', {
    maxZoom: 20,
    subdomains: 'abcd',
    opacity: 0.95
  }).addTo(mapInstance);

  // Batasi jangkauan geser kamera agar tetap fokus di sekitar Pulau Bali
  const baliBounds = L.latLngBounds(
    L.latLng(-9.25, 114.20),
    L.latLng(-7.85, 115.95)
  );
  mapInstance.setMaxBounds(baliBounds);
  mapInstance.options.minZoom = 10;

  // Zoom Control di Sudut Kanan Bawah
  L.control.zoom({
    position: 'bottomright'
  }).addTo(mapInstance);

  // Tangani Klik Bebas Pengguna pada Peta Satelit
  mapInstance.on('click', (e) => {
    handleMapFreeClick(e.latlng.lat, e.latlng.lng);
  });

  // Pembaruan Koordinat Kursor di Bar Bawah
  mapInstance.on('mousemove', (e) => {
    const coordsDisplay = document.getElementById('mapCoordinates');
    if (coordsDisplay) {
      coordsDisplay.textContent = `${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)}`;
    }
  });

  // Tampilkan lapisan poligon area termal organik
  renderPollutionLayers();
}

// Validasi Geofence: Memastikan Titik Berada di Daratan Pulau Bali & Nusa Penida
function isWithinBali(lat, lng) {
  // 1. Batas luar maksimal Bali & Nusa Penida
  if (lat < -8.92 || lat > -8.05 || lng < 114.40 || lng > 115.75) {
    return false;
  }
  // 2. Nusa Penida, Nusa Lembongan, Nusa Ceningan
  if (lat >= -8.85 && lat <= -8.65 && lng >= 115.42 && lng <= 115.65) {
    return true;
  }

  // 3. Poligon Daratan Utama Pulau Bali
  const baliPolygon = [
    [-8.10, 114.43], // Gilimanuk Utara
    [-8.05, 114.70], // Celukan Bawang / Buleleng Barat
    [-8.07, 115.10], // Singaraja
    [-8.12, 115.35], // Tejakula
    [-8.25, 115.60], // Tulamben
    [-8.35, 115.72], // Amed / Ujung Timur
    [-8.48, 115.68], // Karangasem Timur
    [-8.55, 115.54], // Candidasa
    [-8.58, 115.44], // Padangbai
    [-8.60, 115.35], // Lebih / Gianyar Pesisir
    [-8.68, 115.28], // Sanur Pesisir
    [-8.75, 115.25], // Serangan / Pelabuhan Benoa
    [-8.80, 115.24], // Tanjung Benoa
    [-8.85, 115.23], // Nusa Dua
    [-8.88, 115.18], // Ungasan Selatan
    [-8.85, 115.08], // Uluwatu / Pecatu
    [-8.78, 115.15], // Jimbaran Barat
    [-8.72, 115.15], // Kuta
    [-8.64, 115.12], // Canggu
    [-8.58, 115.08], // Tanah Lot
    [-8.50, 114.95], // Tabanan Selatan
    [-8.42, 114.75], // Pekutatan / Jembrana
    [-8.38, 114.58], // Negara
    [-8.25, 114.43], // Gilimanuk Selatan
    [-8.15, 114.42]  // Gilimanuk Barat
  ];

  let inside = false;
  for (let i = 0, j = baliPolygon.length - 1; i < baliPolygon.length; j = i++) {
    const xi = baliPolygon[i][0], yi = baliPolygon[i][1];
    const xj = baliPolygon[j][0], yj = baliPolygon[j][1];
    const intersect = ((yi > lng) !== (yj > lng)) &&
      (lat < (xj - xi) * (lng - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

// Helper kosong untuk kompatibilitas jika dipanggil modul lain
function renderPresetMarkers() {
  presetMarkers.forEach(m => mapInstance.removeLayer(m));
  presetMarkers = [];
}

// Penanganan Klik Bebas Pengguna di Peta Satelit
function handleMapFreeClick(lat, lng) {
  // Cegah analisis jika titik berada di luar daratan Pulau Bali (misal di laut lepas)
  if (!isWithinBali(lat, lng)) {
    showToast("Titik berada di luar daratan Pulau Bali. Platform Teduh memfokuskan analisis iklim mikro pada pemukiman warga di Bali.");
    return;
  }

  // Hitung data mikroklimat dinamis berdasarkan koordinat klik
  const simulatedZone = TEDUH_DATA.generateDynamicAnalysis(lat, lng);
  selectZone(simulatedZone, true);
}

// Memilih Zona, Memunculkan Pin Aktif, Popup Kustom, dan Membuka Drawer Analisis
function selectZone(zone, isDynamic = false) {
  activeZone = zone;

  // Bersihkan titik teman jika ada dari aksi sebelumnya
  clearCommunityFriends();

  // Hapus lingkaran simulasi atau lingkaran misi sebelumnya jika berpindah zona
  if (activeSimulationCircle) {
    mapInstance.removeLayer(activeSimulationCircle);
    activeSimulationCircle = null;
  }
  if (activeMissionCircle) {
    mapInstance.removeLayer(activeMissionCircle);
    activeMissionCircle = null;
  }

  // Pusatkan peta ke lokasi zona terpilih dengan transisi halus
  mapInstance.flyTo([zone.lat, zone.lng], 16, {
    duration: 1.1,
    easeLinearity: 0.25
  });

  // Hapus Active Pin Marker sebelumnya jika ada
  if (activeMarker) {
    mapInstance.removeLayer(activeMarker);
  }

  const isHot = zone.isHotspot;
  const dotColor = isHot ? '#bc4800' : '#1A382B';

  const activeIcon = L.divIcon({
    className: 'active-inspect-marker',
    html: `
      <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; width: 34px; height: 34px; border-radius: 50%; background: ${dotColor}; opacity: 0.25; animation: pulse-ring 2s infinite;"></div>
        <div style="width: 24px; height: 24px; border-radius: 50%; background: #FFFFFF; display: flex; align-items: center; justify-content: center;">
          <div style="width: 12px; height: 12px; border-radius: 50%; background: ${dotColor};"></div>
        </div>
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17]
  });

  activeMarker = L.marker([zone.lat, zone.lng], { icon: activeIcon }).addTo(mapInstance);

  // Pasang Leaflet Popup Kustom di Titik Terpilih
  const locationLabel = zone.village ? `${zone.village}, ${zone.city || 'Denpasar'}` : (zone.address || 'Pulau Bali');
  const popupContent = `
    <div class="map-popup-card">
      <div class="map-popup-header">
        <span class="map-popup-badge ${isHot ? 'hot' : 'cool'}">${zone.surfaceTemp}</span>
        <span class="map-popup-location">${locationLabel}</span>
      </div>
      <h4 class="map-popup-title">${zone.name}</h4>
      <div class="map-popup-grid">
        <div class="map-popup-mini-stat">
          <span>Kualitas Udara</span>
          <strong>AQI ${zone.aqi}</strong>
        </div>
        <div class="map-popup-mini-stat">
          <span>Tutupan Hijau</span>
          <strong>${zone.canopyCover}</strong>
        </div>
      </div>
      <button type="button" class="map-popup-btn" onclick="openDrawer()">
        <span>Rincian & Misi Tanam</span>
        <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
      </button>
    </div>
  `;

  activeMarker.bindPopup(popupContent, {
    offset: [0, -12],
    closeButton: false,
    className: 'custom-leaflet-popup'
  }).openPopup();

  // Hubungkan klik pin untuk membuka drawer kembali
  activeMarker.on('click', (e) => {
    L.DomEvent.stopPropagation(e);
    openDrawer();
  });

  // Isi data lengkap ke Drawer Analisis
  populateDrawer(zone);

  // Buka Drawer Analisis secara otomatis
  openDrawer();

  // Tampilkan toast konfirmasi pemindaian
  if (isDynamic) {
    showToast(`Analisis pekarangan berhasil dipetakan: Suhu ${zone.surfaceTemp}`);
  } else {
    showToast(`Memuat data pantau: ${zone.name}`);
  }
}

// Mengisi Konten Panel Drawer Analisis
function populateDrawer(zone) {
  // Selalu reset ke Stage 1 (Diagnosa Kawasan) saat membuka kawasan baru
  switchDrawerStage(1);

  // Reset checklist langkah aksi
  completedActionSteps.clear();
  updateActionChecklistUI();

  // Reset simulator pohon
  activeTreeSimCount = 1;
  updateTreeSimUI();

  // Reset fokus faktor
  activeFactorIndex = null;

  const nameEl = document.getElementById('zoneName');
  const coordsEl = document.getElementById('zoneCoords');

  if (nameEl) nameEl.textContent = zone.name;
  if (coordsEl) {
    if (zone.fullAddress) {
      coordsEl.textContent = zone.fullAddress;
    } else {
      coordsEl.textContent = `Koordinat: ${zone.lat.toFixed(4)}, ${zone.lng.toFixed(4)}`;
    }
  }

  // 1. Spektrum Suhu Termal (Hijau Dingin -> Terracotta Panas)
  const surfaceEl = document.getElementById('metricSurfaceTemp');
  if (surfaceEl) surfaceEl.textContent = zone.surfaceTemp;

  const tempNum = parseFloat(zone.surfaceTemp) || 35.0;
  const minTemp = 24.0;
  const maxTemp = 42.0;
  const pinPercent = Math.min(Math.max(((tempNum - minTemp) / (maxTemp - minTemp)) * 100, 4), 96);
  const pinEl = document.getElementById('spectrumPin');
  if (pinEl) pinEl.style.left = `${pinPercent}%`;

  const currentLabelEl = document.getElementById('spectrumCurrentLabel');
  if (currentLabelEl) {
    currentLabelEl.textContent = `${zone.surfaceTemp} ${zone.heatLevel || 'Terik'}`;
  }

  // 2. Diagram Donut Faktor Pemicu Utama Panas & Polusi Interaktif
  renderDonutChartAndLegend(zone);

  // 3. Diagnosa Masalah Lapangan
  const diagEl = document.getElementById('zoneDiagnosisText');
  if (diagEl) diagEl.textContent = zone.problemDiagnosis;
  const diagBadge = document.getElementById('narrativeFactorBadge');
  if (diagBadge) diagBadge.classList.add('hidden');
  const diagTitle = document.getElementById('narrativeTitleLabel');
  if (diagTitle) diagTitle.textContent = 'Dampak ke Pemukiman:';

  // 4. Rekomendasi Pohon Minimalis Bergambar
  const tree = zone.recommendedTree;
  if (tree) {
    const treeImgEl = document.getElementById('treeImage');
    const treeNameEl = document.getElementById('treeName');
    const treeBenefitEl = document.getElementById('treeBenefit');
    const rootBadge = document.getElementById('treeRootBadge');
    const safetyBadge = document.getElementById('treeSafetyBadge');

    if (treeImgEl) {
      treeImgEl.src = tree.image || 'assets/trees/pohon-tanjung.jpg';
      treeImgEl.alt = tree.name;
    }
    if (treeNameEl) treeNameEl.textContent = tree.name;
    if (treeBenefitEl) treeBenefitEl.textContent = tree.benefit;
    if (rootBadge) rootBadge.textContent = tree.rootType || 'Akar Tunggang Dalam';
    if (safetyBadge) safetyBadge.textContent = tree.pipeSafety ? 'Aman Saluran Got' : 'Aman Pipa & Fondasi';
  }

  // 5. 3 Langkah Aksi Bertahap (Stage 2)
  const actionPlan = zone.actionPlan || {
    now: { title: "Siram Lantai Semen Saat Terik", desc: "Potong pantulan radiasi panas ke dinding" },
    thisWeek: { title: "Buat 3 Lubang Biopori", desc: "Resapan air & dinginkan tanah pekarangan" },
    longTerm: { title: `Tanam 1 Bibit ${tree ? tree.name : 'Pohon Tanjung'}`, desc: "Akar tunggang menghujam dalam, aman fondasi" }
  };

  const nowTitleEl = document.getElementById('actionNowTitle');
  const nowDescEl = document.getElementById('actionNowDesc');
  const weekTitleEl = document.getElementById('actionWeekTitle');
  const weekDescEl = document.getElementById('actionWeekDesc');
  const longTitleEl = document.getElementById('actionLongTitle');
  const longDescEl = document.getElementById('actionLongDesc');

  if (nowTitleEl && actionPlan.now) nowTitleEl.textContent = actionPlan.now.title;
  if (nowDescEl && actionPlan.now) nowDescEl.textContent = actionPlan.now.desc || "Potong pantulan radiasi panas ke dinding";
  if (weekTitleEl && actionPlan.thisWeek) weekTitleEl.textContent = actionPlan.thisWeek.title;
  if (weekDescEl && actionPlan.thisWeek) weekDescEl.textContent = actionPlan.thisWeek.desc || "Resapan air & dinginkan tanah pekarangan";
  if (longTitleEl && actionPlan.longTerm) longTitleEl.textContent = actionPlan.longTerm.title;
  if (longDescEl && actionPlan.longTerm) longDescEl.textContent = actionPlan.longTerm.desc || "Akar tunggang menghujam dalam, aman fondasi";

  // Reset status kolaborator misi
  selectedMissionFriends = [];
  renderSelectedMissionFriendsChips();

  // Misi Penanaman Pohon Aksi Warga
  const missionTitleEl = document.getElementById('missionActionTitle');
  const missionTreeEl = document.getElementById('missionTreeName');
  const missionDistanceEl = document.getElementById('missionSafeDistance');
  const takeBtn = document.getElementById('takeMissionBtn');
  const docBtn = document.getElementById('goToDocBtn');

  if (missionTitleEl) missionTitleEl.textContent = `Aksi Tanam: ${zone.name}`;
  if (missionTreeEl && tree) missionTreeEl.textContent = tree.name;
  if (missionDistanceEl && tree) missionDistanceEl.textContent = tree.pipeSafety || 'Minimal 1.5 meter dari got';
  if (takeBtn) {
    takeBtn.classList.remove('hidden');
    const takeLabel = document.getElementById('takeMissionBtnLabel');
    if (takeLabel) takeLabel.textContent = 'Ambil Misi Tanam (+250 Poin)';
  }
  if (docBtn) {
    docBtn.classList.add('hidden');
    const encodedZone = encodeURIComponent(zone.name);
    const encodedTree = encodeURIComponent(tree ? tree.name : '');
    docBtn.href = `community.html?action=new-post&zone=${encodedZone}&tree=${encodedTree}`;
  }
}

// Render Diagram Donut & Legend Faktor Pemicu Interaktif
function renderDonutChartAndLegend(zone) {
  const segmentsGroup = document.getElementById('donutSegmentsGroup');
  const legendList = document.getElementById('donutLegendList');
  const centerScore = document.getElementById('donutCenterScore');
  const centerLabel = document.getElementById('donutCenterLabel');

  const factors = zone.primaryFactors || [
    { label: "Minimnya Pohon Peneduh", percentage: 40, color: "#1A382B" },
    { label: "Polusi Kendaraan Bermotor", percentage: 30, color: "#0E1116" },
    { label: "Padatnya Bangunan", percentage: 20, color: "#64748B" },
    { label: "Asap Pembakaran Sampah", percentage: 10, color: "#BA4E2A" }
  ];
  const dominant = zone.dominantFactor || { percentage: 40, label: "Minim Pohon" };

  if (centerScore) centerScore.textContent = `${dominant.percentage}%`;
  if (centerLabel) centerLabel.textContent = dominant.label;

  if (segmentsGroup && legendList) {
    let currentOffset = 0;
    let circlesHtml = '';
    let legendHtml = '';

    factors.forEach((factor, idx) => {
      const dashArray = `${factor.percentage} ${100 - factor.percentage}`;
      const dashOffset = -currentOffset;
      circlesHtml += `<circle id="donutCircle${idx}" cx="21" cy="21" r="15.91549430918954" fill="none" stroke="${factor.color}" stroke-width="3.6" stroke-dasharray="${dashArray}" stroke-dashoffset="${dashOffset}" style="cursor: pointer;" onclick="focusDonutFactor(${idx})"></circle>`;
      currentOffset += factor.percentage;

      legendHtml += `
        <div class="legend-item" id="legendItem${idx}" onclick="focusDonutFactor(${idx})" role="button" tabindex="0" aria-label="Lihat faktor ${factor.label}">
          <div class="legend-left">
            <span class="legend-dot" style="background: ${factor.color};"></span>
            <span>${factor.label}</span>
          </div>
          <span class="legend-val">${factor.percentage}%</span>
        </div>
      `;
    });

    segmentsGroup.innerHTML = circlesHtml;
    legendList.innerHTML = legendHtml;
  }
}

// Fokus & Eksplorasi Interaktif Faktor Donut Pemicu Panas
function focusDonutFactor(idx) {
  if (!activeZone) return;
  const factors = activeZone.primaryFactors || [
    { label: "Minimnya Pohon Peneduh", percentage: 40, color: "#1A382B" },
    { label: "Polusi Kendaraan Bermotor", percentage: 30, color: "#0E1116" },
    { label: "Padatnya Bangunan", percentage: 20, color: "#64748B" },
    { label: "Asap Pembakaran Sampah", percentage: 10, color: "#BA4E2A" }
  ];

  // Toggle off jika mengklik kembali faktor yang sedang aktif
  if (activeFactorIndex === idx) {
    activeFactorIndex = null;
    const dominant = activeZone.dominantFactor || { percentage: 40, label: "Minim Pohon" };
    const centerScore = document.getElementById('donutCenterScore');
    const centerLabel = document.getElementById('donutCenterLabel');
    if (centerScore) centerScore.textContent = `${dominant.percentage}%`;
    if (centerLabel) centerLabel.textContent = dominant.label;

    document.querySelectorAll('.legend-item').forEach(el => el.classList.remove('is-active'));
    document.querySelectorAll('#donutSegmentsGroup circle').forEach(c => {
      c.setAttribute('stroke-width', '3.6');
      c.style.opacity = '1';
    });

    const diagEl = document.getElementById('zoneDiagnosisText');
    if (diagEl) diagEl.textContent = activeZone.problemDiagnosis;
    const diagBadge = document.getElementById('narrativeFactorBadge');
    if (diagBadge) diagBadge.classList.add('hidden');
    const diagTitle = document.getElementById('narrativeTitleLabel');
    if (diagTitle) diagTitle.textContent = 'Dampak ke Pemukiman:';
    return;
  }

  activeFactorIndex = idx;
  const factor = factors[idx];
  if (!factor) return;

  // Sorot segmen grafik dan perbarui angka di tengah
  const centerScore = document.getElementById('donutCenterScore');
  const centerLabel = document.getElementById('donutCenterLabel');
  if (centerScore) centerScore.textContent = `${factor.percentage}%`;
  if (centerLabel) centerLabel.textContent = factor.label.length > 14 ? factor.label.slice(0, 14) + '...' : factor.label;

  document.querySelectorAll('.legend-item').forEach((el, i) => {
    el.classList.toggle('is-active', i === idx);
  });

  document.querySelectorAll('#donutSegmentsGroup circle').forEach((c, i) => {
    if (i === idx) {
      c.setAttribute('stroke-width', '5.2');
      c.style.opacity = '1';
    } else {
      c.setAttribute('stroke-width', '3.2');
      c.style.opacity = '0.45';
    }
  });

  // Teks diagnosa spesifik berdasarkan faktor
  const factorInsights = {
    0: "Minimnya naungan pohon membuat radiasi panas matahari terperangkap pada semen dan aspal, meningkatkan suhu pekarangan hingga di atas batas nyaman warga.",
    1: "Konsentrasi kendaraan bermotor menyumbang akumulasi panas knalpot dan partikel debu mikro yang memperburuk kenyamanan bernapas di koridor ini.",
    2: "Kerapatan bangunan dan dinding beton membatasi pergerakan angin alami, menciptakan efek perangkap panas lokal di siang hari.",
    3: "Sisa asap dan pembakaran sampah sporadis memicu peningkatan indeks polusi serta menurunkan kualitas udara pekarangan sekitar."
  };

  const diagEl = document.getElementById('zoneDiagnosisText');
  if (diagEl) diagEl.textContent = factorInsights[idx] || activeZone.problemDiagnosis;

  const diagBadge = document.getElementById('narrativeFactorBadge');
  if (diagBadge) {
    diagBadge.textContent = `${factor.percentage}% ${factor.label}`;
    diagBadge.classList.remove('hidden');
  }

  const diagTitle = document.getElementById('narrativeTitleLabel');
  if (diagTitle) diagTitle.textContent = 'Diagnosa Faktor Pemicu:';
}

// Salin Koordinat Kawasan ke Clipboard
function copyZoneCoords() {
  if (!activeZone) return;
  const coordsText = `${activeZone.lat.toFixed(6)}, ${activeZone.lng.toFixed(6)}`;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(coordsText).then(() => {
      const btn = document.getElementById('copyCoordsBtn');
      const label = document.getElementById('copyCoordsLabel');
      if (btn) btn.classList.add('is-copied');
      if (label) label.textContent = 'Tersalin!';
      showToast(`Koordinat kawasan (${coordsText}) berhasil disalin.`);

      setTimeout(() => {
        if (btn) btn.classList.remove('is-copied');
        if (label) label.textContent = 'Salin';
      }, 2000);
    }).catch(() => {
      showToast(`Koordinat: ${coordsText}`);
    });
  } else {
    showToast(`Koordinat: ${coordsText}`);
  }
}

// Beralih Antar Tahap Drawer (1: Diagnosa Kawasan, 2: Rencana Aksi)
function switchDrawerStage(stageNum) {
  const stageAnalysis = document.getElementById('drawerStageAnalysis');
  const stageActions = document.getElementById('drawerStageActions');
  const tab1 = document.getElementById('tabStage1');
  const tab2 = document.getElementById('tabStage2');

  if (stageNum === 2) {
    if (stageAnalysis) stageAnalysis.classList.add('hidden');
    if (stageActions) stageActions.classList.remove('hidden');
    if (tab1) {
      tab1.classList.remove('is-active');
      tab1.setAttribute('aria-selected', 'false');
    }
    if (tab2) {
      tab2.classList.add('is-active');
      tab2.setAttribute('aria-selected', 'true');
    }

    const drawerBody = document.querySelector('.drawer-body');
    if (drawerBody) drawerBody.scrollTop = 0;

    // Tampilkan titik teman & warga terdekat saat masuk ke tahap rencana aksi gotong royong
    if (activeZone) {
      renderNearbyFriendsForZone(activeZone);

      if (activeMissionCircle) {
        mapInstance.removeLayer(activeMissionCircle);
      }
      activeMissionCircle = L.circle([activeZone.lat, activeZone.lng], {
        color: '#1A382B',
        fillColor: '#1A382B',
        fillOpacity: 0.18,
        dashArray: '4, 4',
        radius: activeTreeSimCount === 2 ? 65 : 40,
        weight: 1.8
      }).addTo(mapInstance);
    }
  } else {
    if (stageAnalysis) stageAnalysis.classList.remove('hidden');
    if (stageActions) stageActions.classList.add('hidden');
    if (tab1) {
      tab1.classList.add('is-active');
      tab1.setAttribute('aria-selected', 'true');
    }
    if (tab2) {
      tab2.classList.remove('is-active');
      tab2.setAttribute('aria-selected', 'false');
    }

    const drawerBody = document.querySelector('.drawer-body');
    if (drawerBody) drawerBody.scrollTop = 0;

    // Bersihkan kembali titik teman dan radius misi agar peta kembali bersih
    clearCommunityFriends();
    if (activeMissionCircle) {
      mapInstance.removeLayer(activeMissionCircle);
      activeMissionCircle = null;
    }
  }
}

// Beralih ke Stage 2 (Alias untuk tombol aksi)
function showZoneActions() {
  switchDrawerStage(2);
}

// Kembali ke Stage 1 (Alias untuk kompatibilitas)
function backToAnalysis() {
  switchDrawerStage(1);
}

// Pemilih Jumlah Pohon Simulasi Interaktif (1 Pohon vs 2 Pohon)
function setTreeSimulationCount(count) {
  activeTreeSimCount = count;
  updateTreeSimUI();

  if (count === 2) {
    showToast('Simulasi 2 Pohon Aktif: Suhu turun -6.5°C, tutupan kanopi bertambah +40%.');
  } else {
    showToast('Simulasi 1 Pohon Aktif: Suhu turun -4.3°C, tutupan kanopi bertambah +20%.');
  }
}

// Pembaruan UI Simulasi Kesejukan
function updateTreeSimUI() {
  if (!activeZone) return;

  const sim = activeZone.simulationImpact || {
    tempReduction: "-4.3°C",
    newSurfaceTemp: "34.5°C",
    newCanopy: "25%",
    coolingScore: "86/100",
    summary: "Beban panas dinding berkurang drastis, hemat konsumsi listrik AC s.d 28%."
  };

  const btn1 = document.getElementById('simBtn1Tree');
  const btn2 = document.getElementById('simBtn2Tree');
  if (btn1) btn1.classList.toggle('is-active', activeTreeSimCount === 1);
  if (btn2) btn2.classList.toggle('is-active', activeTreeSimCount === 2);

  const currTempEl = document.getElementById('impactCurrentTemp');
  const targetTempEl = document.getElementById('impactTargetTemp');
  const dropPillEl = document.getElementById('impactTempDrop');
  const currCanopyEl = document.getElementById('impactCurrentCanopy');
  const targetCanopyEl = document.getElementById('impactTargetCanopy');
  const gainPillEl = document.getElementById('impactCanopyGain');
  const impactScoreEl = document.getElementById('impactScore');
  const impactSummaryEl = document.getElementById('impactSummaryText');

  if (currTempEl) currTempEl.textContent = activeZone.surfaceTemp || '38.8°C';

  if (activeTreeSimCount === 1) {
    if (targetTempEl) targetTempEl.textContent = sim.newSurfaceTemp || '34.5°C';
    if (dropPillEl) {
      const rawDrop = sim.tempReduction ? sim.tempReduction.replace('-', '') : '4.3°C';
      dropPillEl.textContent = `Turun ${rawDrop}`;
    }
    if (currCanopyEl) currCanopyEl.textContent = activeZone.canopyCover || '5%';
    if (targetCanopyEl) targetCanopyEl.textContent = sim.newCanopy || '25%';
    if (gainPillEl) {
      const currCanopyVal = parseInt(activeZone.canopyCover) || 5;
      const targetCanopyVal = parseInt(sim.newCanopy) || 25;
      gainPillEl.textContent = `+${Math.max(1, targetCanopyVal - currCanopyVal)}% Rimbun`;
    }
    if (impactScoreEl) impactScoreEl.textContent = `${sim.coolingScore || '86/100'} Sejuk`;
    if (impactSummaryEl) impactSummaryEl.textContent = sim.summary || 'Beban panas dinding berkurang, hemat konsumsi listrik AC s.d 28%.';

    // Radius lingkaran visual 40m di peta
    if (activeMissionCircle && mapInstance) {
      activeMissionCircle.setRadius(40);
    }
  } else {
    // 2 Pohon: Proyeksi Kesejukan Maksimal
    const currTempNum = parseFloat(activeZone.surfaceTemp) || 38.8;
    const enhancedTarget = (currTempNum - 6.5).toFixed(1) + '°C';
    if (targetTempEl) targetTempEl.textContent = enhancedTarget;
    if (dropPillEl) dropPillEl.textContent = 'Turun 6.5°C';
    if (currCanopyEl) currCanopyEl.textContent = activeZone.canopyCover || '5%';
    if (targetCanopyEl) targetCanopyEl.textContent = '45%';
    if (gainPillEl) {
      const currCanopyVal = parseInt(activeZone.canopyCover) || 5;
      gainPillEl.textContent = `+${Math.max(1, 45 - currCanopyVal)}% Rimbun`;
    }
    if (impactScoreEl) impactScoreEl.textContent = '94/100 Sejuk Maksimal';
    if (impactSummaryEl) impactSummaryEl.textContent = 'Kombinasi 2 kanopi peneduh memotong radiasi panas hingga 6.5°C dan menciptakan mikroklimat pemukiman yang sejuk.';

    // Radius lingkaran visual 65m di peta
    if (activeMissionCircle && mapInstance) {
      activeMissionCircle.setRadius(65);
    }
  }
}

// Checklist Langkah Aksi Interaktif
function toggleActionStep(stepNum) {
  if (completedActionSteps.has(stepNum)) {
    completedActionSteps.delete(stepNum);
  } else {
    completedActionSteps.add(stepNum);
  }
  updateActionChecklistUI();

  if (completedActionSteps.size === 3) {
    showToast('Luar biasa! 3 langkah pemulihan telah siap dilakukan untuk kawasan ini.');
  }
}

function updateActionChecklistUI() {
  for (let i = 1; i <= 3; i++) {
    const node = document.getElementById(`actionNode${i}`);
    const check = document.getElementById(`actionCheckBox${i}`);
    const isDone = completedActionSteps.has(i);

    if (node) node.classList.toggle('is-completed', isDone);
    if (check) check.classList.toggle('is-checked', isDone);
  }

  const badge = document.getElementById('actionProgressBadge');
  if (badge) {
    const count = completedActionSteps.size;
    if (count === 3) {
      badge.textContent = '3/3 Lengkap!';
      badge.style.background = '#1A382B';
      badge.style.color = '#FFFFFF';
    } else {
      badge.textContent = `${count}/3 Selesai`;
      badge.style.background = '#E8EFEA';
      badge.style.color = '#1A382B';
    }
  }
}

// Buka/Tutup/Expand Drawer di Mobile melalui Drag Handle
function toggleDrawerMobile() {
  const drawer = document.getElementById('spatialDrawer');
  if (!drawer) return;
  if (!drawer.classList.contains('is-open')) {
    openDrawer();
  } else if (drawer.classList.contains('is-expanded')) {
    drawer.classList.remove('is-expanded');
  } else {
    drawer.classList.add('is-expanded');
  }
}

// Menjalankan Aksi Ambil Misi Penanaman
function takeZoneMission() {
  if (!activeZone) return;

  const takeBtn = document.getElementById('takeMissionBtn');
  const docBtn = document.getElementById('goToDocBtn');

  // Gambar lingkaran radius penanaman aman pada peta
  if (activeMissionCircle) {
    mapInstance.removeLayer(activeMissionCircle);
  }

  activeMissionCircle = L.circle([activeZone.lat, activeZone.lng], {
    color: '#1A382B',
    fillColor: '#1A382B',
    fillOpacity: 0.22,
    dashArray: '5, 5',
    radius: 30, // 30 meter radius zona penanaman aman
    weight: 2
  }).addTo(mapInstance);

  if (takeBtn) takeBtn.classList.add('hidden');
  if (docBtn) {
    docBtn.classList.remove('hidden');
    const encodedZone = encodeURIComponent(activeZone.name);
    const tree = activeZone.recommendedTree;
    const encodedTree = encodeURIComponent(tree ? tree.name : '');
    const collabsUsernames = selectedMissionFriends.map(f => f.username).join(',');
    docBtn.href = `community.html?action=new-post&zone=${encodedZone}&tree=${encodedTree}${collabsUsernames ? '&collabs=' + encodeURIComponent(collabsUsernames) : ''}`;
  }

  const friendBonusText = selectedMissionFriends.length > 0 
    ? ` bersama ${selectedMissionFriends.length} warga kolaborator (+${selectedMissionFriends.length * 50} Poin Bonus)` 
    : '';
  showToast(`Misi Tanam diambil${friendBonusText}! Titik aman telah ditandai. Silakan selesaikan penanaman lalu unggah dokumentasi.`);
}

// Helper untuk menghasilkan radius halo terluar dengan transisi lembut
function getExpandedCoordinates(coords, scale) {
  if (!coords || coords.length === 0) return coords;
  let centerLat = 0, centerLng = 0;
  coords.forEach(pt => { centerLat += pt[0]; centerLng += pt[1]; });
  centerLat /= coords.length;
  centerLng /= coords.length;
  return coords.map(pt => [
    centerLat + (pt[0] - centerLat) * scale,
    centerLng + (pt[1] - centerLng) * scale
  ]);
}

// Menggambar Lapisan Citra Radiasi Termal Inframerah (Urban Heat Anomaly Field)
function renderPollutionLayers() {
  // Bersihkan layer lama jika ada
  pollutionPolygonLayers.forEach(layer => mapInstance.removeLayer(layer));
  pollutionPolygonLayers = [];

  if (typeof TEDUH_DATA === 'undefined' || !TEDUH_DATA.pollutionZones) return;

  TEDUH_DATA.pollutionZones.forEach((pZone) => {
    // 1. Render Multi-Node Dispersi Termal (Natural Continuous Heat Diffusion)
    if (pZone.thermalNodes && pZone.thermalNodes.length > 0) {
      pZone.thermalNodes.forEach(node => {
        // Lapisan 1: Ambient Thermal Atmosphere (Outer Aura)
        const outerAura = L.circle([node.lat, node.lng], {
          radius: node.radius * 1.35,
          stroke: false,
          fillColor: "#F29648",
          fillOpacity: 0.10,
          interactive: false,
          className: 'thermal-heat-outer'
        }).addTo(mapInstance);
        pollutionPolygonLayers.push(outerAura);

        // Lapisan 2: Mid Infrared Dispersion (Transisi Termal)
        const midAura = L.circle([node.lat, node.lng], {
          radius: node.radius * 0.95,
          stroke: false,
          fillColor: "#DE6528",
          fillOpacity: 0.18,
          interactive: false,
          className: 'thermal-heat-mid'
        }).addTo(mapInstance);
        pollutionPolygonLayers.push(midAura);

        // Lapisan 3: Core Hotspot Radiance (Intensitas Inti Aspal & Semen)
        const coreNode = L.circle([node.lat, node.lng], {
          radius: node.radius * 0.55,
          stroke: false,
          fillColor: "#C84B20",
          fillOpacity: 0.32,
          interactive: false,
          className: 'thermal-heat-core'
        }).addTo(mapInstance);
        pollutionPolygonLayers.push(coreNode);
      });
    }

    // 2. Lapisan Interaksi Bersih Transparan (Zero Visual Glitch, Full Interactivity)
    const hitArea = L.polygon(pZone.coordinates, {
      stroke: false,
      weight: 0,
      fillColor: "#C84B20",
      fillOpacity: 0.001,
      interactive: true,
      className: 'thermal-click-target'
    }).addTo(mapInstance);

    // Tooltip informatif saat kursor mengarah ke area hotspot (2 baris rapi & animasi masuk/keluar)
    const tooltipContent = `
      <div class="hotspot-tooltip-body">
        <strong style="color: #C84B20; font-size: 12px; display: block; margin-bottom: 2px;">${pZone.name}</strong>
        <div>
          <span style="color: #6C7470; font-size: 11px;">${pZone.aqiLabel}</span> • <strong style="color: #0E1116; font-size: 11px;">Suhu ${pZone.surfaceTemp}</strong>
        </div>
      </div>
    `;
    hitArea.bindTooltip(tooltipContent, {
      sticky: true,
      opacity: 1,
      className: 'teduh-rounded-tooltip',
      offset: [10, 10]
    });

    // Animasi Halus Saat Tooltip Terbuka (Muncul)
    hitArea.on('tooltipopen', (e) => {
      if (e.tooltip && e.tooltip.getElement()) {
        const el = e.tooltip.getElement();
        el.classList.remove('is-closing');
        requestAnimationFrame(() => {
          el.classList.add('is-opening');
        });
      }
    });

    // Animasi Halus Saat Kursor Keluar (Tidak Muncul / Hilang)
    hitArea.on('mouseout', function() {
      const tooltip = this.getTooltip();
      if (tooltip && tooltip.getElement()) {
        const el = tooltip.getElement();
        el.classList.remove('is-opening');
        el.classList.add('is-closing');
      }
    });

    // Klik area untuk memusatkan peta dan membuka analisis
    hitArea.on('click', (e) => {
      L.DomEvent.stopPropagation(e);
      const targetZone = TEDUH_DATA.zones.find(z => z.id === pZone.zoneId);
      if (targetZone) {
        selectZone(targetZone, false);
        showToast(`Menganalisis area: ${pZone.name}`);
      }
    });

    pollutionPolygonLayers.push(hitArea);
  });
}

// Menghapus Titik Teman dari Peta
function clearCommunityFriends() {
  friendMarkers.forEach(m => mapInstance.removeLayer(m));
  friendMarkers = [];
}

// Menampilkan Titik Warga Terdekat Khusus Saat Masuk ke Tahap Rencana Aksi Gotong Royong
function renderNearbyFriendsForZone(zone) {
  clearCommunityFriends();

  if (!zone || typeof TEDUH_DATA === 'undefined' || !TEDUH_DATA.friendsDirectory) return;

  // Hitung jarak dan tampilkan 3 warga terdekat di sekitar zona aksi
  const friendsWithDistance = TEDUH_DATA.friendsDirectory
    .filter(f => f.lat && f.lng)
    .map(f => {
      const dLat = (f.lat - zone.lat);
      const dLng = (f.lng - zone.lng);
      const dist = Math.sqrt(dLat * dLat + dLng * dLng);
      return { ...f, dist };
    })
    .sort((a, b) => a.dist - b.dist)
    .slice(0, 3);

  friendsWithDistance.forEach((friend) => {
    const isInvited = selectedMissionFriends.some(f => f.username === friend.username || f.name === friend.name);

    // Pin Avatar Minimalis (Diameter 30px, inisial jelas, aksen hijau pinus)
    const iconHtml = `
      <div class="community-map-pin contextual ${isInvited ? 'is-invited' : ''}" title="${escapeHtml(friend.name)} • ${escapeHtml(friend.districtLocation)}">
        <div class="community-pin-avatar">
          <span>${escapeHtml(friend.avatar)}</span>
        </div>
      </div>
    `;

    const customIcon = L.divIcon({
      html: iconHtml,
      className: 'community-div-icon',
      iconSize: [30, 30],
      iconAnchor: [15, 15],
      popupAnchor: [0, -16]
    });

    const marker = L.marker([friend.lat, friend.lng], {
      icon: customIcon,
      riseOnHover: true
    }).addTo(mapInstance);

    // Tooltip Ringan saat Hover
    marker.bindTooltip(`<strong>${escapeHtml(friend.name)}</strong> • ${escapeHtml(friend.districtLocation)}`, {
      direction: 'top',
      offset: [0, -14],
      opacity: 0.95
    });

    // Popup Kartu Sederhana: Foto/Inisial, Nama, Lokasi Inti, dan Tombol Aksi In-Place
    const safeName = escapeHtml(friend.name).replace(/'/g, "\\'");
    const safeLoc = escapeHtml(friend.districtLocation).replace(/'/g, "\\'");
    const safeUser = escapeHtml(friend.username).replace(/'/g, "\\'");

    const popupHtml = `
      <div class="community-friend-popup">
        <div class="friend-popup-header">
          <div class="friend-popup-avatar">
            <span>${escapeHtml(friend.avatar)}</span>
          </div>
          <div class="friend-popup-info">
            <h4 class="friend-popup-name">${escapeHtml(friend.name)}</h4>
            <div class="friend-popup-location">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              <span>${escapeHtml(friend.districtLocation)}</span>
            </div>
          </div>
        </div>
        <button type="button" class="btn-invite-friend-quick ${isInvited ? 'is-invited' : ''}" onclick="toggleMissionFriend('${safeName}', '${safeLoc}', '${safeUser}')">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            ${isInvited ? '<polyline points="20 6 9 17 4 12"></polyline>' : '<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line>'}
          </svg>
          <span>${isInvited ? 'Terajak (+50 Poin)' : 'Ajak Gotong Royong Tanam'}</span>
        </button>
      </div>
    `;

    marker.bindPopup(popupHtml, {
      className: 'community-leaflet-popup',
      closeButton: false,
      maxWidth: 240
    });

    friendMarkers.push(marker);
  });
}

// Menambah / Menghapus Kolaborator Misi Secara In-Place (Tanpa Pindah Halaman)
function toggleMissionFriend(friendName, location, username = '') {
  const existingIdx = selectedMissionFriends.findIndex(f => 
    (username && f.username === username) || f.name === friendName
  );

  if (existingIdx !== -1) {
    selectedMissionFriends.splice(existingIdx, 1);
    showToast(`${friendName} dihapus dari daftar kolaborator`);
  } else {
    const friendData = (typeof TEDUH_DATA !== 'undefined' && TEDUH_DATA.friendsDirectory) 
      ? TEDUH_DATA.friendsDirectory.find(f => f.username === username || f.name === friendName) 
      : null;
    
    const avatar = friendData ? friendData.avatar : (friendName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'W');

    selectedMissionFriends.push({
      name: friendName,
      location: location,
      username: username || `@${friendName.toLowerCase().replace(/\s+/g, '_')}`,
      avatar: avatar
    });

    showToast(`${friendName} ditambahkan sebagai kolaborator (+50 Poin Bonus)`);
  }

  // Perbarui tampilan chips & badge di drawer
  renderSelectedMissionFriendsChips();

  // Perbarui pin di peta
  if (activeZone) {
    renderNearbyFriendsForZone(activeZone);
  }
}

// Render Chip Kolaborator di Drawer Stage 2
function renderSelectedMissionFriendsChips() {
  const container = document.getElementById('mapCollabChipsList');
  const bonusBadge = document.getElementById('mapCollabBonusBadge');
  const rewardBadge = document.getElementById('missionRewardBadge');
  const takeLabel = document.getElementById('takeMissionBtnLabel');

  const count = selectedMissionFriends.length;
  const bonus = count * 50;
  const total = 250 + bonus;

  if (bonusBadge) {
    bonusBadge.textContent = count > 0 ? `+${bonus} Poin (${count} Teman)` : '+50 Poin / Teman';
  }

  if (rewardBadge) {
    rewardBadge.textContent = `+${total} Poin Kesejukan`;
  }

  if (takeLabel) {
    takeLabel.textContent = `Ambil Misi Tanam (+${total} Poin)`;
  }

  if (!container) return;

  if (count === 0) {
    container.innerHTML = `<span class="map-collab-empty-hint">Klik pin warga terdekat di peta untuk menambah kolaborator aksi</span>`;
    return;
  }

  let html = '';
  selectedMissionFriends.forEach(f => {
    const safeName = escapeHtml(f.name).replace(/'/g, "\\'");
    const safeLoc = escapeHtml(f.location).replace(/'/g, "\\'");
    const safeUser = escapeHtml(f.username).replace(/'/g, "\\'");

    html += `
      <div class="map-collab-chip-item">
        <span class="map-collab-chip-avatar">${escapeHtml(f.avatar)}</span>
        <span class="map-collab-chip-name">${escapeHtml(f.name)}</span>
        <span class="map-collab-chip-pts">+50 Poin</span>
        <button type="button" class="map-collab-chip-remove" onclick="toggleMissionFriend('${safeName}', '${safeLoc}', '${safeUser}')" title="Hapus kolaborator" aria-label="Hapus ${escapeHtml(f.name)}">✕</button>
      </div>
    `;
  });

  container.innerHTML = html;
}

// Menjalankan Simulasi Dampak Penanaman Peneduh
function runThermalSimulation() {
  if (!activeZone) return;

  const sim = activeZone.simulationImpact;
  const simBtn = document.getElementById('runSimulationBtn');
  if (!sim || !simBtn) return;

  // Efek Loading Halus
  simBtn.disabled = true;
  simBtn.innerHTML = `
    <svg style="animation: spin 1s linear infinite; margin-right: 8px;" width="16" height="16" fill="none" viewBox="0 0 24 24"><circle style="opacity: 0.25;" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path style="opacity: 0.75;" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
    <span>Menghitung Proyeksi Kesejukan...</span>
  `;

  setTimeout(() => {
    // 1. Tampilkan Lingkaran Kanopi Peneduh pada Peta
    if (activeSimulationCircle) {
      mapInstance.removeLayer(activeSimulationCircle);
    }

    activeSimulationCircle = L.circle([activeZone.lat, activeZone.lng], {
      color: '#1A382B',
      fillColor: '#1A382B',
      fillOpacity: 0.35,
      radius: 45, // radius 45 meter simulasi naungan pohon
      weight: 2
    }).addTo(mapInstance);

    // Animasi Pulse Kanopi
    const canopyMarker = L.divIcon({
      className: 'canopy-pulse-container',
      html: '<div class="canopy-pulse-ring"></div>',
      iconSize: [80, 80],
      iconAnchor: [40, 40]
    });
    L.marker([activeZone.lat, activeZone.lng], { icon: canopyMarker }).addTo(mapInstance);

    // 2. Perbarui Angka Suhu di Panel
    const surfaceEl = document.getElementById('metricSurfaceTemp');
    if (surfaceEl) {
      surfaceEl.textContent = sim.newSurfaceTemp;
      surfaceEl.className = 'metric-value cool';
    }

    const canopyEl = document.getElementById('metricCanopy');
    if (canopyEl) {
      canopyEl.textContent = sim.newCanopy;
    }

    // 3. Tampilkan Kotak Dampak Terukur
    const impactBox = document.getElementById('simulationImpactBox');
    if (impactBox) {
      impactBox.classList.remove('hidden');
      const tempDropEl = document.getElementById('impactTempDrop');
      const scoreEl = document.getElementById('impactScore');
      const summaryEl = document.getElementById('impactSummaryText');

      if (tempDropEl) tempDropEl.textContent = sim.tempReduction;
      if (scoreEl) scoreEl.textContent = sim.coolingScore;
      if (summaryEl) summaryEl.textContent = sim.summary;
    }

    // Ubah status tombol
    simBtn.innerHTML = `
      <svg width="15" height="15" fill="none" stroke="#2E7D32" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"></path></svg>
      <span>Simulasi Aktif: Suhu Turun ${sim.tempReduction}</span>
    `;

    // Tampilkan Toast Konfirmasi
    showToast(`Proyeksi penanaman peneduh aktif: Suhu turun ${sim.tempReduction}`);
  }, 500);
}

// Helper Escape HTML untuk Keamanan Teks Input
function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[m]);
}

// Helper Riwayat Pencarian Lokal (Google Maps Recents Pattern)
function getRecentSearches() {
  if (typeof localStorage === 'undefined') {
    return TEDUH_DATA.zones.slice(0, 3);
  }
  const saved = localStorage.getItem('teduh_recent_searches');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const mapped = parsed.map(id => TEDUH_DATA.zones.find(z => z.id === id)).filter(Boolean);
        if (mapped.length > 0) return mapped;
      }
    } catch (e) {}
  }
  return [
    TEDUH_DATA.zones.find(z => z.id === 'zone-teuku-umar'),
    TEDUH_DATA.zones.find(z => z.id === 'zone-sesetan'),
    TEDUH_DATA.zones.find(z => z.id === 'zone-gatot-subroto')
  ].filter(Boolean);
}

function saveRecentSearch(zoneId) {
  if (!zoneId || typeof localStorage === 'undefined') return;
  try {
    let ids = [];
    const saved = localStorage.getItem('teduh_recent_searches');
    if (saved) {
      ids = JSON.parse(saved) || [];
    } else {
      ids = ['zone-teuku-umar', 'zone-sesetan', 'zone-gatot-subroto'];
    }
    ids = ids.filter(id => id !== zoneId);
    ids.unshift(zoneId);
    if (ids.length > 6) ids = ids.slice(0, 6);
    localStorage.setItem('teduh_recent_searches', JSON.stringify(ids));
  } catch (e) {}
}

// Logika Autocomplete Pencarian Ala Google Maps dengan Riwayat Pencarian (Desktop & Mobile)
function initSearchAutocomplete() {
  const searchPairs = [
    { input: document.getElementById('zoneSearchInput'), dropdown: document.getElementById('searchResultsDropdown') },
    { input: document.getElementById('zoneSearchInputMobile'), dropdown: document.getElementById('searchResultsDropdownMobile') }
  ];

  function filterZones(query) {
    if (!query) return getRecentSearches();
    const q = query.toLowerCase().trim();
    return TEDUH_DATA.zones.filter(z => 
      (z.name && z.name.toLowerCase().includes(q)) ||
      (z.fullAddress && z.fullAddress.toLowerCase().includes(q)) ||
      (z.address && z.address.toLowerCase().includes(q)) ||
      (z.village && z.village.toLowerCase().includes(q)) ||
      (z.district && z.district.toLowerCase().includes(q)) ||
      (z.city && z.city.toLowerCase().includes(q)) ||
      (z.category && z.category.toLowerCase().includes(q))
    );
  }

  searchPairs.forEach(({ input, dropdown }) => {
    if (!input || !dropdown) return;

    function renderSearchResults(matches, query = '') {
      const isHistoryMode = !query.trim();

      if (matches.length === 0) {
        dropdown.innerHTML = `
          <div class="map-search-empty">
            <div class="map-search-empty-text">
              Tidak ada kawasan atau jalan yang cocok dengan "<strong>${escapeHtml(query)}</strong>".
            </div>
            <div class="map-search-empty-hint">
              Klik sembarang titik pekarangan pada peta satelit untuk menganalisis suhu secara langsung.
            </div>
          </div>
        `;
        dropdown.classList.remove('hidden');
        return;
      }

      dropdown.innerHTML = '';
      
      const displayedItems = isHistoryMode ? matches.slice(0, 4) : matches;

      displayedItems.forEach(match => {
        const isHot = match.isHotspot;
        const item = document.createElement('button');
        item.type = 'button';
        item.className = 'map-search-item';
        
        const addressText = match.fullAddress || `${match.address || ''}, ${match.district || ''}, ${match.city || ''}`;
        
        item.innerHTML = `
          <div class="map-search-item-left">
            <div class="map-search-clock-circle">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
            <div class="map-search-item-info">
              <div class="map-search-item-name">${match.name}</div>
              <div class="map-search-item-address">${addressText}</div>
              <div class="map-search-item-status ${isHot ? 'hot' : 'cool'}">
                ${isHot ? 'Sangat Terik' : 'Sejuk Nyaman'} · Suhu ${match.surfaceTemp}
              </div>
            </div>
          </div>
        `;

        item.addEventListener('click', () => {
          saveRecentSearch(match.id);
          input.value = match.name;
          searchPairs.forEach(p => { if (p.input) p.input.value = match.name; });
          dropdown.classList.add('hidden');
          selectZone(match, false);
        });

        dropdown.appendChild(item);
      });

      if (isHistoryMode && matches.length > 0) {
        const bottomAction = document.createElement('div');
        bottomAction.className = 'map-search-bottom-action';
        bottomAction.innerHTML = `
          <span class="map-search-more-link">
            Lihat riwayat pencarian lainnya
          </span>
        `;
        dropdown.appendChild(bottomAction);
      }

      dropdown.classList.remove('hidden');
    }

    input.addEventListener('focus', () => {
      const matches = filterZones(input.value);
      renderSearchResults(matches, input.value);
    });

    input.addEventListener('input', (e) => {
      const q = e.target.value;
      const matches = filterZones(q);
      renderSearchResults(matches, q);
    });

    document.addEventListener('click', (e) => {
      if (input && dropdown && !input.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.add('hidden');
      }
    });
  });
}

// Buka & Tutup Drawer Analisis
function openDrawer() {
  const drawer = document.getElementById('spatialDrawer');
  const backdrop = document.getElementById('drawerBackdrop');
  if (drawer) {
    drawer.style.transform = '';
    drawer.style.transition = '';
    drawer.classList.add('is-open');
    drawer.classList.remove('is-expanded');
  }
  if (backdrop) {
    backdrop.style.opacity = '';
    backdrop.style.transition = '';
    backdrop.classList.add('is-visible');
  }
}

function closeDrawer() {
  const drawer = document.getElementById('spatialDrawer');
  const backdrop = document.getElementById('drawerBackdrop');
  if (drawer) {
    drawer.style.transform = '';
    drawer.style.transition = '';
    drawer.classList.remove('is-open', 'is-expanded');
  }
  if (backdrop) {
    backdrop.style.opacity = '';
    backdrop.style.transition = '';
    backdrop.classList.remove('is-visible');
  }

  // Bersihkan titik teman & lingkaran simulasi
  clearCommunityFriends();

  if (activeMarker) {
    mapInstance.removeLayer(activeMarker);
    activeMarker = null;
  }
  if (activeSimulationCircle) {
    mapInstance.removeLayer(activeSimulationCircle);
    activeSimulationCircle = null;
  }
  if (activeMissionCircle) {
    mapInstance.removeLayer(activeMissionCircle);
    activeMissionCircle = null;
  }
  activeZone = null;
  selectedMissionFriends = [];
  renderSelectedMissionFriendsChips();
}

function toggleDrawerMobile() {
  const drawer = document.getElementById('spatialDrawer');
  if (!drawer) return;
  drawer.style.transform = '';
  drawer.style.transition = '';
  drawer.classList.toggle('is-expanded');
}

// Pasang Swipe Gestures Naik/Turun secara Real-time pada Drag Handle & Header Drawer di Mobile
function initDrawerTouchGestures() {
  const drawer = document.getElementById('spatialDrawer');
  const backdrop = document.getElementById('drawerBackdrop');
  if (!drawer) return;

  const dragPill = drawer.querySelector('.drawer-drag-pill');
  const header = drawer.querySelector('.drawer-header');

  let startY = 0;
  let currentY = 0;
  let startTime = 0;
  let isDragging = false;

  const handleTouchStart = (e) => {
    if (window.innerWidth >= 768) return;
    if (!drawer.classList.contains('is-open')) return;
    startY = e.touches[0].clientY;
    currentY = startY;
    startTime = Date.now();
    isDragging = true;
    drawer.style.transition = 'none';
    if (backdrop) backdrop.style.transition = 'none';
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    currentY = e.touches[0].clientY;
    const deltaY = currentY - startY;
    const isExpanded = drawer.classList.contains('is-expanded');

    if (deltaY > 0) {
      // Menggeser ke bawah (menutup atau mengecilkan drawer)
      drawer.style.transform = `translateY(${deltaY}px)`;
      if (backdrop) {
        const factor = Math.max(0, 1 - (deltaY / 320));
        backdrop.style.opacity = factor.toString();
      }
    } else if (deltaY < 0) {
      // Menggeser ke atas (memperluas drawer)
      if (!isExpanded) {
        drawer.style.transform = `translateY(${deltaY}px)`;
      } else {
        // Efek elastis ketika sudah maksimal
        drawer.style.transform = `translateY(${deltaY * 0.25}px)`;
      }
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    isDragging = false;
    const deltaY = currentY - startY;
    const elapsed = Date.now() - startTime;
    const velocity = deltaY / (elapsed || 1);
    const isExpanded = drawer.classList.contains('is-expanded');

    drawer.style.transition = '';
    drawer.style.transform = '';
    if (backdrop) {
      backdrop.style.transition = '';
      backdrop.style.opacity = '';
    }

    if (!isExpanded) {
      // Kondisi Drawer Default (72vh)
      if (velocity > 0.45 || deltaY > 80) {
        // Cepat swipe ke bawah / ditarik lebih dari 80px -> Tutup
        closeDrawer();
      } else if (velocity < -0.35 || deltaY < -50) {
        // Geser ke atas -> Perluas ke 92vh
        drawer.classList.add('is-expanded');
      }
    } else {
      // Kondisi Drawer Expanded (92vh)
      if (velocity > 0.6 || deltaY > 200) {
        // Cepat ditarik jauh ke bawah -> Tutup
        closeDrawer();
      } else if (velocity > 0.3 || deltaY > 60) {
        // Ditarik sedang -> Kembalikan ke default 72vh
        drawer.classList.remove('is-expanded');
      }
    }

    startY = 0;
    currentY = 0;
  };

  [dragPill, header].filter(Boolean).forEach(el => {
    el.addEventListener('touchstart', handleTouchStart, { passive: true });
    el.addEventListener('touchmove', handleTouchMove, { passive: true });
    el.addEventListener('touchend', handleTouchEnd, { passive: true });
    el.addEventListener('touchcancel', handleTouchEnd, { passive: true });
  });
}

// Onboarding Hint Banner
function initOnboarding() {
  const banner = document.getElementById('onboardingBanner');
  const dismissBtn = document.getElementById('dismissOnboardingBtn');
  if (!banner || !dismissBtn) return;

  const isDismissed = localStorage.getItem('teduh_onboarding_dismissed');
  if (isDismissed === 'true') {
    banner.classList.add('hidden');
  }

  dismissBtn.addEventListener('click', () => {
    banner.classList.add('hidden');
    localStorage.setItem('teduh_onboarding_dismissed', 'true');
  });
}

// Sinkronisasi Profil Akun John Doe & Poin
function syncUserProfile() {
  if (typeof TEDUH_DATA === 'undefined' || !TEDUH_DATA.getUserData) return;
  const user = TEDUH_DATA.getUserData();
  const pointsEl = document.getElementById('userPointsValue');
  if (pointsEl) {
    pointsEl.textContent = `${user.points} Poin`;
  }
}

// Periksa Parameter URL saat navigasi dari Beranda atau Misi
function checkUrlParameters() {
  const urlParams = new URLSearchParams(window.location.search);
  const zoneParam = urlParams.get('zone');
  const actionParam = urlParams.get('action');

  if (zoneParam) {
    const targetZone = TEDUH_DATA.zones.find(z => z.id === zoneParam || z.name.toLowerCase().includes(zoneParam.toLowerCase()));
    if (targetZone) {
      setTimeout(() => {
        selectZone(targetZone, false);
        if (actionParam === 'mission') {
          takeZoneMission();
        }
      }, 600);
    }
  }

  // Jika ada parameter analyze=true, otomatis fokuskan ke zona hotspot utama
  if (urlParams.get('analyze') === 'true' && !zoneParam) {
    const firstHotspot = TEDUH_DATA.zones.find(z => z.isHotspot);
    if (firstHotspot) {
      setTimeout(() => {
        selectZone(firstHotspot, false);
      }, 400);
    }
  }
}

// Toast Notifikasi Sederhana & Ringan
function showToast(message) {
  let toast = document.getElementById('teduhToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'teduhToast';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add('is-visible');

  setTimeout(() => {
    toast.classList.remove('is-visible');
  }, 3400);
}

// Ekspor Fungsi Global untuk Handler HTML
window.selectZone = selectZone;
window.openDrawer = openDrawer;
window.closeDrawer = closeDrawer;
window.switchDrawerStage = switchDrawerStage;
window.showZoneActions = showZoneActions;
window.backToAnalysis = backToAnalysis;
window.copyZoneCoords = copyZoneCoords;
window.focusDonutFactor = focusDonutFactor;
window.setTreeSimulationCount = setTreeSimulationCount;
window.toggleActionStep = toggleActionStep;
window.toggleDrawerMobile = toggleDrawerMobile;
window.runThermalSimulation = runThermalSimulation;
window.takeZoneMission = takeZoneMission;
window.renderPollutionLayers = renderPollutionLayers;
window.renderPresetMarkers = renderPresetMarkers;
window.syncUserProfile = syncUserProfile;
window.toggleMissionFriend = toggleMissionFriend;
window.renderSelectedMissionFriendsChips = renderSelectedMissionFriendsChips;

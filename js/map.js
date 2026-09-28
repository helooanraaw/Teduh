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
let userActiveMissionMarker = null;
let userActiveMissionCircle = null;
let citizenMissionMarkers = [];
let presetMarkers = [];
let pollutionPolygonLayers = [];
let macroThermalLayers = [];
let macroHitAreas = [];
let friendMarkers = [];
let selectedMissionFriends = [];
let isPollutionLayerActive = false;
let activeTreeSimCount = 1;
let completedActionSteps = new Set();
let activeFactorIndex = null;
let activeAnalysisTimeout = null;
let activeGsapTimeline = null;

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

  // Tampilkan pin misi gotong royong warga sekitar
  renderCitizenMissions();

  // Tampilkan pin misi aktif pengguna jika tersimpan di localStorage
  renderUserActiveMissionPin();

  // Pasang listener adaptasi zoom termal real-time
  mapInstance.on('zoom', updateThermalZoomState);
  mapInstance.on('zoomend', updateThermalZoomState);
  updateThermalZoomState();
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
  // Cegah analisis jika titik berada di luar daratan pemantauan
  if (!isWithinBali(lat, lng)) {
    showToast("Titik berada di luar wilayah pemantauan. Silakan klik area daratan pemukiman.");
    return;
  }

  // Hitung data mikroklimat dinamis berdasarkan koordinat klik
  const simulatedZone = TEDUH_DATA.generateDynamicAnalysis(lat, lng);
  selectZone(simulatedZone, true);
}

let activeCitizenMission = null;
let selectedCitizenMissionMarker = null;

// Memilih Zona, Memunculkan Pin Aktif, Popup Kustom, dan Membuka Drawer Analisis
function selectZone(zone, isDynamic = false, citizenMission = null) {
  if (!zone || !mapInstance) return;

  const drawer = document.getElementById('spatialDrawer');
  const isDrawerOpen = drawer && drawer.classList.contains('is-open');

  // Jika kawasan / misi ini sudah aktif dan drawer terbuka, diamkan saja (jangan ulangi pemindaian atau reset)
  const isSameCitizenMission = citizenMission && activeCitizenMission && activeCitizenMission.id === citizenMission.id;
  const isSameStandardZone = !citizenMission && !activeCitizenMission && activeZone && activeZone.id === zone.id;

  if (isDrawerOpen && (isSameCitizenMission || isSameStandardZone)) {
    if (citizenMission) {
      const targetMarker = citizenMissionMarkers.find(m => m._teduhMissionId === citizenMission.id);
      if (targetMarker) {
        selectedCitizenMissionMarker = targetMarker;
        if (!targetMarker.isPopupOpen()) {
          targetMarker.openPopup();
        }
      }
    } else if (activeMarker && !activeMarker.isPopupOpen()) {
      activeMarker.openPopup();
    }
    return;
  }

  activeZone = zone;
  activeCitizenMission = citizenMission;

  // Batalkan proses loading atau animasi GSAP sebelumnya jika masih aktif
  if (activeAnalysisTimeout) {
    clearTimeout(activeAnalysisTimeout);
    activeAnalysisTimeout = null;
  }
  if (activeGsapTimeline) {
    activeGsapTimeline.kill();
    activeGsapTimeline = null;
  }

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
    activeMarker = null;
  }

  // Titik point pin lokasi yang dipilih (Sunbaked Terracotta untuk terik / Deep Laurel Pine untuk sejuk)
  if (!citizenMission) {
    selectedCitizenMissionMarker = null;
    const isHot = zone.isHotspot;
    const dotColor = isHot ? '#BA4E2A' : '#1A382B';

    const activeIcon = L.divIcon({
      className: 'active-inspect-marker',
      html: `
        <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; width: 36px; height: 36px; border-radius: 50%; background: ${dotColor}; opacity: 0.22; animation: pulse-ring 2.2s cubic-bezier(0.2, 0.8, 0.4, 1) infinite;"></div>
          <div style="width: 24px; height: 24px; border-radius: 50%; background: #FFFFFF; box-shadow: 0 3px 10px rgba(14, 17, 22, 0.2); display: flex; align-items: center; justify-content: center;">
            <div style="width: 12px; height: 12px; border-radius: 50%; background: ${dotColor};"></div>
          </div>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18]
    });

    activeMarker = L.marker([zone.lat, zone.lng], { icon: activeIcon }).addTo(mapInstance);

    // Pasang Leaflet Popup Kustom di Titik Terpilih (Ditampilkan setelah pemindaian selesai)
    const locationLabel = zone.village 
      ? `${zone.village}, ${zone.city || 'Denpasar'}` 
      : (zone.district 
          ? `${zone.district}, ${zone.city || 'Denpasar'}` 
          : (zone.address || zone.city || 'Denpasar'));
    const shortAqiStatus = zone.aqiStatus ? zone.aqiStatus.split('&')[0].split('/')[0].trim() : 'Berdebu';
    const popupContent = `
      <div class="map-popup-card">
        <div class="map-popup-header">
          <span class="map-popup-badge ${isHot ? 'hot' : 'cool'}">${zone.surfaceTemp}</span>
          <span class="map-popup-location">${locationLabel}</span>
        </div>
        <h4 class="map-popup-title">${zone.name}</h4>
        <div class="map-popup-grid">
          <div class="map-popup-mini-stat">
            <span>Kondisi Udara</span>
            <strong>${shortAqiStatus}</strong>
          </div>
          <div class="map-popup-mini-stat">
            <span>Penghijauan</span>
            <strong>${zone.canopyCover}</strong>
          </div>
          <div class="map-popup-mini-stat">
            <span>Suhu Udara</span>
            <strong>${zone.airTemp || '33.5°C'}</strong>
          </div>
          <div class="map-popup-mini-stat">
            <span>Tingkat Panas</span>
            <strong>${zone.heatLevel || (isHot ? 'Sangat Panas' : 'Sejuk')}</strong>
          </div>
        </div>
      </div>
    `;

    // Tutup popup lama jika ada yang terbuka di peta
    mapInstance.closePopup();

    activeMarker.bindPopup(popupContent, {
      offset: [0, -12],
      closeButton: false,
      className: 'custom-leaflet-popup'
    });

    // Hubungkan klik pin untuk membuka drawer kembali
    activeMarker.on('click', (e) => {
      L.DomEvent.stopPropagation(e);
      openDrawer();
    });
  } else {
    // Jika memilih misi warga, pastikan popup pada pin misi warga tetap aktif dan terbuka
    const targetMarker = citizenMissionMarkers.find(m => m._teduhMissionId === citizenMission.id);
    if (targetMarker) {
      selectedCitizenMissionMarker = targetMarker;
      targetMarker.openPopup();
    }
  }

  // Siapkan Header (Profil Penggagas Misi Warga vs Zona Wilayah Standar)
  const citizenBadge = document.getElementById('drawerCitizenProfileBadge');
  const standardTitleGroup = document.getElementById('drawerStandardTitleGroup');
  const avatarEl = document.getElementById('drawerHeaderAvatar');
  const authorNameEl = document.getElementById('drawerHeaderAuthorName');
  const headerLocEl = document.getElementById('drawerHeaderLocation');

  const nameEl = document.getElementById('zoneName');
  const coordsEl = document.getElementById('zoneCoords');

  if (citizenMission) {
    if (citizenBadge) citizenBadge.classList.remove('hidden');
    if (standardTitleGroup) standardTitleGroup.classList.add('hidden');
    
    if (avatarEl) {
      avatarEl.textContent = citizenMission.authorAvatar || (citizenMission.authorName ? citizenMission.authorName.slice(0, 2).toUpperCase() : 'WG');
    }
    if (authorNameEl) {
      authorNameEl.textContent = citizenMission.authorName || 'Penggagas Warga';
    }
    if (headerLocEl) {
      const loc = citizenMission.location || citizenMission.zoneName || zone.name || 'Denpasar';
      headerLocEl.textContent = loc;
    }
  } else {
    if (citizenBadge) citizenBadge.classList.add('hidden');
    if (standardTitleGroup) standardTitleGroup.classList.remove('hidden');

    if (nameEl) nameEl.textContent = zone.name;
    if (coordsEl) {
      if (zone.fullAddress) {
        coordsEl.textContent = zone.fullAddress;
      } else {
        coordsEl.textContent = `Koordinat: ${zone.lat.toFixed(4)}, ${zone.lng.toFixed(4)}`;
      }
    }
  }

  // Tampilkan State Loading Bersih & Sembunyikan Header dan Konten Drawer Dulu
  const drawerHeader = document.getElementById('drawerHeader');
  const drawerBody = document.getElementById('drawerBody');
  const loadingEl = document.getElementById('drawerLoadingState');
  const stageAnalysis = document.getElementById('drawerStageAnalysis');
  const stageActions = document.getElementById('drawerStageActions');

  if (drawerHeader) {
    drawerHeader.style.display = 'none';
    drawerHeader.classList.add('hidden');
  }
  if (drawerBody) {
    drawerBody.style.display = 'none';
    drawerBody.classList.add('hidden');
  }
  if (stageAnalysis) stageAnalysis.classList.add('hidden');
  if (stageActions) stageActions.classList.add('hidden');

  if (loadingEl) {
    loadingEl.style.display = 'flex';
    if (typeof gsap !== 'undefined') {
      gsap.fromTo(loadingEl, 
        { opacity: 0, y: 14, scale: 0.97 }, 
        { opacity: 1, y: 0, scale: 1, duration: 0.32, ease: 'power2.out' }
      );
    }
  }

  // Buka Drawer Analisis secara otomatis
  openDrawer();

  // Jalankan Jeda Loading Pemindaian Sederhana (~900ms) Sebelum Menampilkan Data
  activeAnalysisTimeout = setTimeout(() => {
    if (loadingEl) loadingEl.style.display = 'none';
    if (drawerHeader) {
      drawerHeader.style.display = 'flex';
      drawerHeader.classList.remove('hidden');
    }
    if (drawerBody) {
      drawerBody.style.display = 'flex';
      drawerBody.classList.remove('hidden');
    }
    if (stageAnalysis) stageAnalysis.classList.remove('hidden');

    // Buka Popup pada Pin Marker setelah pemindaian selesai
    if (activeMarker) {
      activeMarker.openPopup();
    }

    // Isi data lengkap ke Drawer Analisis
    populateDrawer(zone);

    // Jalankan Animasi Pengungkapan Data dengan GSAP
    animateAnalysisWithGSAP(zone);
  }, 900);
}

// Animasi Pengungkapan Hasil Analisis Menggunakan GSAP
function animateAnalysisWithGSAP(zone) {
  if (typeof gsap === 'undefined') return;

  if (activeGsapTimeline) {
    activeGsapTimeline.kill();
  }

  const tempNum = parseFloat(zone.surfaceTemp) || 35.0;
  const pinPercent = Math.min(Math.max(((tempNum - 24.0) / (42.0 - 24.0)) * 100, 4), 96);
  const dominant = zone.dominantFactor || { percentage: 40, label: "Minim Pohon" };

  activeGsapTimeline = gsap.timeline({
    defaults: { ease: 'power2.out' }
  });

  // 0. Header Nama Kawasan & Tombol Tutup Meluncur Halus
  activeGsapTimeline.fromTo('#drawerHeader',
    { opacity: 0, y: -10 },
    { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' },
    0
  );

  // 1. Counter Nilai Suhu Permukaan
  const startVal = Math.max(20.0, tempNum - 10.0);
  const tempObj = { val: startVal };
  const surfaceEl = document.getElementById('metricSurfaceTemp');
  activeGsapTimeline.to(tempObj, {
    val: tempNum,
    duration: 0.85,
    ease: 'power2.out',
    onUpdate: () => {
      if (surfaceEl) surfaceEl.textContent = `${tempObj.val.toFixed(1)}°C`;
    }
  }, 0);

  // 2. Jarum Spektrum Termal Meluncur Halus
  activeGsapTimeline.fromTo('#spectrumPin', 
    { left: '0%' }, 
    { left: `${pinPercent}%`, duration: 0.85, ease: 'power2.out' }, 
    0
  );

  // 3. Diagram Donut SVG & Skor Tengah
  activeGsapTimeline.fromTo('#donutSvgChart', 
    { scale: 0.88, opacity: 0, rotation: -25, transformOrigin: 'center center' }, 
    { scale: 1, opacity: 1, rotation: 0, duration: 0.65 }, 
    0.1
  );

  const scoreObj = { val: 0 };
  const centerScoreEl = document.getElementById('donutCenterScore');
  activeGsapTimeline.to(scoreObj, {
    val: dominant.percentage,
    duration: 0.7,
    ease: 'power1.out',
    onUpdate: () => {
      if (centerScoreEl) centerScoreEl.textContent = `${Math.round(scoreObj.val)}%`;
    }
  }, 0.1);

  // 4. Daftar Faktor Pemicu (Legend Item) Muncul Berurutan (Stagger)
  activeGsapTimeline.fromTo('.legend-item', 
    { opacity: 0, y: 10 }, 
    { opacity: 1, y: 0, stagger: 0.06, duration: 0.4 }, 
    0.2
  );

  // 5. Narasi Dampak Lapangan & Kartu Rekomendasi Bibit
  activeGsapTimeline.fromTo('.narrative-box', 
    { opacity: 0, y: 12 }, 
    { opacity: 1, y: 0, duration: 0.45 }, 
    0.3
  );

  activeGsapTimeline.fromTo('.drawer-tree-card', 
    { opacity: 0, y: 14 }, 
    { opacity: 1, y: 0, duration: 0.5 }, 
    0.38
  );

  activeGsapTimeline.fromTo('.drawer-actions-group', 
    { opacity: 0, y: 10 }, 
    { opacity: 1, y: 0, duration: 0.4 }, 
    0.46
  );
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

  const citizenBadge = document.getElementById('drawerCitizenProfileBadge');
  const standardTitleGroup = document.getElementById('drawerStandardTitleGroup');
  const avatarEl = document.getElementById('drawerHeaderAvatar');
  const authorNameEl = document.getElementById('drawerHeaderAuthorName');
  const headerLocEl = document.getElementById('drawerHeaderLocation');

  const nameEl = document.getElementById('zoneName');
  const coordsEl = document.getElementById('zoneCoords');

  if (activeCitizenMission) {
    if (citizenBadge) citizenBadge.classList.remove('hidden');
    if (standardTitleGroup) standardTitleGroup.classList.add('hidden');
    
    if (avatarEl) {
      avatarEl.textContent = activeCitizenMission.authorAvatar || (activeCitizenMission.authorName ? activeCitizenMission.authorName.slice(0, 2).toUpperCase() : 'WG');
    }
    if (authorNameEl) {
      authorNameEl.textContent = activeCitizenMission.authorName || 'Penggagas Warga';
    }
    if (headerLocEl) {
      const loc = activeCitizenMission.location || activeCitizenMission.zoneName || zone.name || 'Denpasar';
      headerLocEl.textContent = loc;
    }
  } else {
    if (citizenBadge) citizenBadge.classList.add('hidden');
    if (standardTitleGroup) standardTitleGroup.classList.remove('hidden');

    if (nameEl) nameEl.textContent = zone.name;
    if (coordsEl) {
      if (zone.fullAddress) {
        coordsEl.textContent = zone.fullAddress;
      } else {
        coordsEl.textContent = `Koordinat: ${zone.lat.toFixed(4)}, ${zone.lng.toFixed(4)}`;
      }
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

  // 5. Rencana Langkah Aksi (Stage 2 - Panduan Praktis 1 Kali Tanam)
  const actionPlan = zone.actionPlan || {
    now: { title: "Tentukan Titik Tanam Aman", desc: "Pilih pekarangan berjarak minimal 1.5 meter dari dinding rumah dan saluran air." },
    thisWeek: { title: "Gali Lubang & Beri Kompos", desc: "Gali lubang 60x60 cm dan campurkan kompos alami untuk nutrisi awal bibit." },
    longTerm: { title: `Tanam Bibit ${tree ? tree.name : 'Pohon Tanjung'}`, desc: "Tanam bibit tegak lurus, padatkan tanah sekitar, dan siram secukupnya." }
  };

  const step1TitleEl = document.getElementById('step1Title');
  const step1DescEl = document.getElementById('step1Desc');
  const step2TitleEl = document.getElementById('step2Title');
  const step2DescEl = document.getElementById('step2Desc');
  const step3TitleEl = document.getElementById('step3Title');
  const step3DescEl = document.getElementById('step3Desc');

  if (step1TitleEl && actionPlan.now) step1TitleEl.textContent = actionPlan.now.title;
  if (step1DescEl && actionPlan.now) step1DescEl.textContent = actionPlan.now.desc;
  if (step2TitleEl && actionPlan.thisWeek) step2TitleEl.textContent = actionPlan.thisWeek.title;
  if (step2DescEl && actionPlan.thisWeek) step2DescEl.textContent = actionPlan.thisWeek.desc;
  if (step3TitleEl && actionPlan.longTerm) step3TitleEl.textContent = actionPlan.longTerm.title;
  if (step3DescEl && actionPlan.longTerm) step3DescEl.textContent = actionPlan.longTerm.desc;

  // Reset status kolaborator misi
  selectedMissionFriends = [];
  renderSelectedMissionFriendsChips();

  // Misi Penanaman Pohon Aksi Warga
  const missionTitleEl = document.getElementById('missionActionTitle');
  const missionTreeEl = document.getElementById('missionTreeName');
  const missionTargetEl = document.getElementById('missionCoolingTarget');
  const takeBtn = document.getElementById('takeMissionBtn');
  const takeLabel = document.getElementById('takeMissionBtnLabel');

  if (missionTitleEl) missionTitleEl.textContent = `Aksi Tanam: ${zone.name}`;
  if (missionTreeEl && tree) missionTreeEl.textContent = tree.name;
  if (missionTargetEl) {
    const rawDrop = zone.simulationImpact && zone.simulationImpact.tempReduction 
      ? zone.simulationImpact.tempReduction.replace('-', '') 
      : '4.0°C';
    missionTargetEl.textContent = `Turunkan Suhu s.d ${rawDrop}`;
  }
  if (takeLabel && takeBtn) {
    let hasActiveMission = false;
    let isMissionExpired = false;
    let activeMissionDate = '';
    if (typeof localStorage !== 'undefined') {
      try {
        const saved = JSON.parse(localStorage.getItem('teduh_active_mission') || 'null');
        if (saved && saved.zoneId === zone.id && !saved.isCompleted) {
          hasActiveMission = true;
          activeMissionDate = saved.scheduledDate || '';
          if (saved.scheduledDate) {
            const targetTime = new Date(saved.scheduledDate + 'T23:59:59').getTime();
            if (!isNaN(targetTime) && Date.now() > targetTime) {
              isMissionExpired = true;
            }
          }
        }
      } catch(e) {}
    }

    if (hasActiveMission) {
      takeBtn.classList.add('is-active-mission');
      if (isMissionExpired) {
        takeLabel.textContent = 'Misi Hangus (Atur Ulang)';
      } else {
        const formattedDate = (typeof TEDUH_DATA !== 'undefined' && TEDUH_DATA.formatDateIndo)
          ? TEDUH_DATA.formatDateIndo(activeMissionDate)
          : activeMissionDate;
        takeLabel.textContent = formattedDate ? `Misi Berjalan (${formattedDate})` : 'Misi Sedang Berjalan';
      }
    } else {
      takeBtn.classList.remove('is-active-mission');
      takeLabel.textContent = 'Ambil Misi Tanam';
    }
  }

  // Render Daftar Warga yang Bergabung (Khusus Aksi Warga)
  renderDrawerVolunteers(activeCitizenMission);

  // Kelola Tombol Aksi di Bagian Bawah Stage 1 (Misi Warga vs Zona Standar)
  const btnJoinDrawer = document.getElementById('btnJoinCitizenMissionDrawer');
  const btnJoinDrawerLabel = document.getElementById('btnJoinCitizenMissionDrawerLabel');
  const joinedActionsWrap = document.getElementById('drawerCitizenJoinedActions');
  const btnViewZoneActions = document.getElementById('btnViewZoneActions');

  if (activeCitizenMission) {
    const isJoined = activeCitizenMission.isJoined;
    if (isJoined) {
      if (btnJoinDrawer) btnJoinDrawer.classList.add('hidden');
      if (joinedActionsWrap) joinedActionsWrap.classList.remove('hidden');
    } else {
      if (btnJoinDrawer) {
        btnJoinDrawer.classList.remove('hidden');
        const safeId = escapeHtml(activeCitizenMission.id).replace(/'/g, "\\'");
        btnJoinDrawer.setAttribute('onclick', `promptJoinCitizenMission('${safeId}')`);
        if (btnJoinDrawerLabel) btnJoinDrawerLabel.textContent = 'Ikut Tanam Bersama (+100 Poin)';
      }
      if (joinedActionsWrap) joinedActionsWrap.classList.add('hidden');
    }
    if (btnViewZoneActions) {
      btnViewZoneActions.classList.add('hidden');
    }
  } else {
    if (btnJoinDrawer) btnJoinDrawer.classList.add('hidden');
    if (joinedActionsWrap) joinedActionsWrap.classList.add('hidden');
    if (btnViewZoneActions) btnViewZoneActions.classList.remove('hidden');
  }
}

// Render Kartu Daftar Warga yang Bergabung pada Drawer Stage 1
function renderDrawerVolunteers(mission) {
  const section = document.getElementById('drawerVolunteersSection');
  const listEl = document.getElementById('drawerVolunteersList');
  const countBadge = document.getElementById('drawerVolunteersCountBadge');

  if (!section || !listEl) return;

  if (mission && mission.volunteers && mission.volunteers.length > 0) {
    section.classList.remove('hidden');
    if (countBadge) {
      countBadge.textContent = `${mission.currentVolunteers} / ${mission.maxVolunteers} Warga`;
    }

    const html = mission.volunteers.map(v => {
      const avatarText = escapeHtml(v.avatar || (v.name ? v.name.slice(0, 2).toUpperCase() : 'WG'));
      const nameText = escapeHtml(v.name || 'Warga');
      const isSelfClass = v.isSelf ? 'is-self' : '';

      return `
        <div class="drawer-volunteer-item ${isSelfClass}">
          <div class="drawer-volunteer-avatar">${avatarText}</div>
          <div class="drawer-volunteer-info">
            <span class="drawer-volunteer-name">${nameText}</span>
          </div>
        </div>
      `;
    }).join('');

    listEl.innerHTML = html;
  } else {
    section.classList.add('hidden');
    listEl.innerHTML = '';
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

// Beralih Antar Tahap Drawer (1: Diagnosa Kawasan, 2: Rencana Aksi Solusi Tanam)
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

    // Animasi GSAP Masuk ke Tahap Solusi Tanam (Stage 2)
    if (typeof gsap !== 'undefined') {
      const stage2Tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

      // 1. Hero Card Misi Relawan (Fade + Slide Up Lembut)
      stage2Tl.fromTo('#drawerStageActions .volunteer-hero-card', 
        { opacity: 0, y: 16, scale: 0.98 }, 
        { opacity: 1, y: 0, scale: 1, duration: 0.38 }
      );

      // 2. Panduan Praktis Penanaman (Kartu Langkah)
      stage2Tl.fromTo('#drawerStageActions .planting-steps-card', 
        { opacity: 0, y: 14 }, 
        { opacity: 1, y: 0, duration: 0.35 }, 
        '-=0.22'
      );

      // 3. Langkah-langkah Tanam 1, 2, 3 (Stagger)
      stage2Tl.fromTo('#drawerStageActions .planting-step-row', 
        { opacity: 0, x: -10 }, 
        { opacity: 1, x: 0, stagger: 0.07, duration: 0.3 }, 
        '-=0.2'
      );

      // 4. Kartu Ajak Teman Gotong Royong
      stage2Tl.fromTo('#drawerStageActions .volunteer-collab-card', 
        { opacity: 0, y: 12 }, 
        { opacity: 1, y: 0, duration: 0.35 }, 
        '-=0.18'
      );

      // 5. Tombol Aksi Utama
      stage2Tl.fromTo('#drawerStageActions .drawer-actions-group', 
        { opacity: 0, y: 10 }, 
        { opacity: 1, y: 0, duration: 0.3 }, 
        '-=0.18'
      );
    }

    // Tampilkan titik teman & warga terdekat serta notifikasi samping saat masuk ke tahap solusi tanam
    if (activeZone) {
      renderNearbyFriendsForZone(activeZone);
      showNearbyFriendsNotice();

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

    // Animasi GSAP Kembali ke Tahap Kondisi Lahan (Stage 1)
    if (typeof gsap !== 'undefined') {
      const stage1Tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

      stage1Tl.fromTo('#drawerStageAnalysis .drawer-analysis-card', 
        { opacity: 0, y: 14 }, 
        { opacity: 1, y: 0, duration: 0.35 }
      );

      stage1Tl.fromTo('#drawerStageAnalysis .drawer-tree-card', 
        { opacity: 0, y: 12 }, 
        { opacity: 1, y: 0, duration: 0.35 }, 
        '-=0.2'
      );

      stage1Tl.fromTo('#drawerStageAnalysis .drawer-actions-group', 
        { opacity: 0, y: 10 }, 
        { opacity: 1, y: 0, duration: 0.3 }, 
        '-=0.18'
      );
    }

    // Tutup notifikasi melayang samping
    dismissNearbyFriendsNotice();

    // Bersihkan kembali titik teman dan radius misi agar peta kembali bersih
    clearCommunityFriends();
    if (activeMissionCircle) {
      mapInstance.removeLayer(activeMissionCircle);
      activeMissionCircle = null;
    }
  }
}

// Beralih ke Stage 2 Langsung dari Tombol Pop-up Marker Peta
function handlePopupMissionAction() {
  if (!activeZone) return;
  openDrawer();
  switchDrawerStage(2);
  if (mapInstance) {
    mapInstance.closePopup();
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

// Pengelolaan Modal Konfirmasi Ambil Misi Tanam (Yakin / Tidak)
function openMissionConfirmModal() {
  if (!activeZone) return;
  const modal = document.getElementById('missionConfirmModal');
  const zoneNameEl = document.getElementById('modalConfirmZoneName');
  const treeNameEl = document.getElementById('modalConfirmTreeName');
  const friendsCountEl = document.getElementById('modalConfirmFriendsCount');
  const dateInput = document.getElementById('missionConfirmDateInput');

  const tree = activeZone.recommendedTree;
  if (zoneNameEl) zoneNameEl.textContent = activeZone.name;
  if (treeNameEl) treeNameEl.textContent = tree ? tree.name : 'Pohon Tanjung';
  if (friendsCountEl) {
    const count = selectedMissionFriends.length;
    friendsCountEl.textContent = count > 0 ? `${count} Warga Terpilih` : 'Tanpa Kolaborator';
  }

  // Tentukan minimal tanggal adalah hari ini
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const minDateStr = `${yyyy}-${mm}-${dd}`;

  if (dateInput) {
    dateInput.min = minDateStr;
    // Default: 2 hari ke depan agar realistis untuk persiapan warga
    const defaultDate = new Date(today);
    defaultDate.setDate(defaultDate.getDate() + 2);
    const tmY = defaultDate.getFullYear();
    const tmM = String(defaultDate.getMonth() + 1).padStart(2, '0');
    const tmD = String(defaultDate.getDate()).padStart(2, '0');
    dateInput.value = `${tmY}-${tmM}-${tmD}`;
  }

  if (modal) {
    modal.classList.remove('hidden');
    void modal.offsetWidth;
    modal.classList.add('is-open');
  }
}

function closeMissionConfirmModal() {
  const modal = document.getElementById('missionConfirmModal');
  if (modal) {
    modal.classList.remove('is-open');
    setTimeout(() => {
      if (!modal.classList.contains('is-open')) {
        modal.classList.add('hidden');
      }
    }, 200);
  }
}

function confirmTakeZoneMission() {
  const dateInput = document.getElementById('missionConfirmDateInput');
  const selectedDate = (dateInput && dateInput.value) ? dateInput.value : new Date().toISOString().split('T')[0];

  closeMissionConfirmModal();
  takeZoneMission(selectedDate);
}

// Menjalankan Aksi Ambil Misi Penanaman
function takeZoneMission(scheduledDate) {
  if (!activeZone) return;

  const validDate = scheduledDate || new Date().toISOString().split('T')[0];

  // Gambar lingkaran radius penanaman aman pada peta
  if (activeMissionCircle) {
    mapInstance.removeLayer(activeMissionCircle);
  }

  activeMissionCircle = L.circle([activeZone.lat, activeZone.lng], {
    color: '#5c8437',
    fillColor: '#5c8437',
    fillOpacity: 0.22,
    dashArray: '5, 5',
    radius: 30, // 30 meter radius zona penanaman aman
    weight: 2
  }).addTo(mapInstance);

  // Perbarui tombol drawer secara langsung agar perubahan visual langsung terlihat
  const takeBtn = document.getElementById('takeMissionBtn');
  const takeLabel = document.getElementById('takeMissionBtnLabel');
  const formattedDate = (typeof TEDUH_DATA !== 'undefined' && TEDUH_DATA.formatDateIndo)
    ? TEDUH_DATA.formatDateIndo(validDate)
    : validDate;

  if (takeBtn && takeLabel) {
    takeBtn.classList.add('is-active-mission');
    takeLabel.textContent = `Misi Berjalan (${formattedDate})`;
  }

  const encodedZone = encodeURIComponent(activeZone.name);
  const tree = activeZone.recommendedTree;
  const encodedTree = encodeURIComponent(tree ? tree.name : 'Pohon Tanjung');
  const communityUrl = `community.html?action=complete-mission&zone=${encodedZone}&tree=${encodedTree}`;

  // Buka Modal Konfirmasi Sukses
  const modal = document.getElementById('missionSuccessModal');
  const modalZoneEl = document.getElementById('modalSuccessZoneName');
  const modalTreeEl = document.getElementById('modalSuccessTreeName');
  const modalScheduleEl = document.getElementById('modalSuccessScheduleDate');
  const modalBtn = document.getElementById('modalGoToCommunityBtn');

  if (modalZoneEl) modalZoneEl.textContent = activeZone.name;
  if (modalTreeEl && tree) modalTreeEl.textContent = tree.name;
  if (modalScheduleEl) modalScheduleEl.textContent = formattedDate;
  if (modalBtn) modalBtn.href = communityUrl;

  if (modal) {
    modal.classList.remove('hidden');
    void modal.offsetWidth;
    modal.classList.add('is-open');
  }

  // Simpan data misi aktif ke localStorage
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('teduh_active_mission', JSON.stringify({
      id: 'mission-' + Date.now(),
      zoneId: activeZone.id,
      zoneName: activeZone.name,
      district: activeZone.district || 'Denpasar',
      lat: activeZone.lat,
      lng: activeZone.lng,
      treeName: tree ? tree.name : 'Pohon Tanjung',
      scheduledDate: validDate,
      isCompleted: false,
      takenAt: Date.now()
    }));
  }

  // Tampilkan pin penanda misi aktif saya di peta
  renderUserActiveMissionPin();
}

// Menutup Modal Konfirmasi Sukses Ambil Misi
function closeMissionSuccessModal() {
  const modal = document.getElementById('missionSuccessModal');
  if (modal) {
    modal.classList.remove('is-open');
    setTimeout(() => {
      if (!modal.classList.contains('is-open')) {
        modal.classList.add('hidden');
      }
    }, 200);
  }
}

// Aksesibilitas Keyboard: Tutup Modal dengan tombol ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const joinConfirmModal = document.getElementById('joinCitizenMissionConfirmModal');
    if (joinConfirmModal && !joinConfirmModal.classList.contains('hidden')) {
      closeJoinConfirmModal();
      return;
    }
    const confirmModal = document.getElementById('missionConfirmModal');
    if (confirmModal && !confirmModal.classList.contains('hidden')) {
      closeMissionConfirmModal();
      return;
    }
    const successModal = document.getElementById('missionSuccessModal');
    if (successModal && !successModal.classList.contains('hidden')) {
      closeMissionSuccessModal();
      return;
    }
    const friendsModal = document.getElementById('friendsPickerModal');
    if (friendsModal && !friendsModal.classList.contains('hidden')) {
      closeFriendsPickerModal();
      return;
    }
  }
});

// Menggambar Lapisan Citra Radiasi Termal Organik (Atmospheric Soft Thermal Halo)
function renderPollutionLayers() {
  // Bersihkan layer lama jika ada
  macroThermalLayers.forEach(layer => mapInstance.removeLayer(layer));
  macroHitAreas.forEach(layer => mapInstance.removeLayer(layer));
  pollutionPolygonLayers.forEach(layer => mapInstance.removeLayer(layer));

  macroThermalLayers = [];
  macroHitAreas = [];
  pollutionPolygonLayers = [];

  if (typeof TEDUH_DATA === 'undefined' || !TEDUH_DATA.pollutionZones) return;

  TEDUH_DATA.pollutionZones.forEach((pZone) => {
    // 1. Render Macro Atmospheric Soft Thermal Halo (Warm Solar Amber -> Sunbaked Terracotta Gradient Blur)
    if (pZone.thermalNodes && pZone.thermalNodes.length > 0) {
      pZone.thermalNodes.forEach(node => {
        // Lapisan 1: Outer Ambient Halo (Solar Amber Lembut)
        const outerAura = L.circle([node.lat, node.lng], {
          radius: node.radius * 1.45,
          stroke: false,
          fillColor: "#FFAE00",
          fillOpacity: 0.14,
          interactive: false,
          className: 'thermal-heat-outer'
        }).addTo(mapInstance);
        outerAura._baseOpacity = 0.14;
        macroThermalLayers.push(outerAura);
        pollutionPolygonLayers.push(outerAura);

        // Lapisan 2: Mid Dispersion Halo (Terracotta Hangat)
        const midAura = L.circle([node.lat, node.lng], {
          radius: node.radius * 0.90,
          stroke: false,
          fillColor: "#BA4E2A",
          fillOpacity: 0.24,
          interactive: false,
          className: 'thermal-heat-mid'
        }).addTo(mapInstance);
        midAura._baseOpacity = 0.24;
        macroThermalLayers.push(midAura);
        pollutionPolygonLayers.push(midAura);

        // Lapisan 3: Epicenter Core Radiance (Terracotta Inti)
        const coreNode = L.circle([node.lat, node.lng], {
          radius: node.radius * 0.45,
          stroke: false,
          fillColor: "#BA4E2A",
          fillOpacity: 0.35,
          interactive: false,
          className: 'thermal-heat-core'
        }).addTo(mapInstance);
        coreNode._baseOpacity = 0.35;
        macroThermalLayers.push(coreNode);
        pollutionPolygonLayers.push(coreNode);
      });
    }

    // 2. Lapisan Interaksi Macro Polygon (Area Deteksi Klik Kawasan)
    const hitArea = L.polygon(pZone.coordinates, {
      stroke: false,
      weight: 0,
      fillColor: "#BA4E2A",
      fillOpacity: 0.001,
      interactive: true,
      className: 'thermal-click-target'
    }).addTo(mapInstance);

    const tooltipContent = `
      <div class="hotspot-tooltip-body">
        <strong style="color: #BA4E2A; font-size: 12px; display: block; margin-bottom: 2px;">${pZone.name}</strong>
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

    hitArea.on('tooltipopen', (e) => {
      if (e.tooltip && e.tooltip.getElement()) {
        const el = e.tooltip.getElement();
        el.classList.remove('is-closing');
        requestAnimationFrame(() => {
          el.classList.add('is-opening');
        });
      }
    });

    hitArea.on('mouseout', function() {
      const tooltip = this.getTooltip();
      if (tooltip && tooltip.getElement()) {
        const el = tooltip.getElement();
        el.classList.remove('is-opening');
        el.classList.add('is-closing');
      }
    });

    hitArea.on('click', (e) => {
      L.DomEvent.stopPropagation(e);
      const targetZone = TEDUH_DATA.zones.find(z => z.id === pZone.zoneId);
      if (targetZone) {
        selectZone(targetZone, false);
      }
    });

    macroHitAreas.push(hitArea);
    pollutionPolygonLayers.push(hitArea);
  });

  // Sinkronkan status opacity dengan level zoom awal
  updateThermalZoomState();
}

// Adaptasi Status Visual Radiasi Termal Berdasarkan Level Zoom Peta
function updateThermalZoomState() {
  if (!mapInstance) return;
  const zoom = mapInstance.getZoom();

  // Transisi halus antara zoom 14.0 (macro atmosfer kawasan) dan 16.0 (tampilan jernih citra satelit)
  let macroOpacityMult = 1.0;

  if (zoom <= 14.0) {
    macroOpacityMult = 1.0;
  } else if (zoom >= 16.0) {
    // Di zoom dekat, halo atmosfer memudar ke 25% (hanya pendaran tipis) agar citra satelit jernih 100%
    macroOpacityMult = 0.25;
  } else {
    // Eased smoothstep progression: 3t^2 - 2t^3
    const t = (zoom - 14.0) / 2.0;
    const smoothT = t * t * (3 - 2 * t);
    macroOpacityMult = 1.0 - smoothT * 0.75;
  }

  // Pembaruan Lapisan Macro Halo
  macroThermalLayers.forEach(layer => {
    const base = layer._baseOpacity || 0.2;
    layer.setStyle({ fillOpacity: base * macroOpacityMult });
  });

  // Pembaruan Target Klik Macro (Saat zoom dekat, prioritaskan klik bebas peta pekarangan)
  macroHitAreas.forEach(layer => {
    const pathEl = layer._path;
    if (pathEl) {
      if (macroOpacityMult < 0.4) {
        pathEl.style.display = 'none';
        pathEl.style.pointerEvents = 'none';
      } else {
        pathEl.style.display = '';
        pathEl.style.pointerEvents = 'auto';
      }
    }
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

    const cleanDistrictLoc = (friend.districtLocation || 'Denpasar').replace(/,\s*(?:Pulau\s*)?Bali$/i, '');

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
              <span>${escapeHtml(cleanDistrictLoc)}</span>
            </div>
          </div>
        </div>
        <button type="button" class="btn-invite-friend-quick ${isInvited ? 'is-invited' : ''}" onclick="toggleMissionFriend('${safeName}', '${safeLoc}', '${safeUser}')">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            ${isInvited ? '<polyline points="20 6 9 17 4 12"></polyline>' : '<line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>'}
          </svg>
          <span>${isInvited ? 'Terpilih' : 'Ajak Gotong Royong'}</span>
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
  }

  // Perbarui tampilan chips & badge di drawer
  renderSelectedMissionFriendsChips();

  // Perbarui pin di peta
  if (activeZone) {
    renderNearbyFriendsForZone(activeZone);
  }

  // Perbarui list di modal pemilih teman jika sedang terbuka
  const searchInput = document.getElementById('friendsModalSearchInput');
  filterFriendsModalList(searchInput ? searchInput.value : '');
}

// Render Daftar Warga Terpilih di Drawer Stage 2 (Spacious, Clean & Modern)
function renderSelectedMissionFriendsChips() {
  const container = document.getElementById('mapCollabChipsList');
  const rewardBadge = document.getElementById('missionRewardBadge');
  const takeLabel = document.getElementById('takeMissionBtnLabel');
  const countBadge = document.getElementById('collabSelectedCountBadge');
  const btnText = document.getElementById('btnOpenFriendsModalText');

  const count = selectedMissionFriends.length;
  const bonus = count * 50;
  const total = 250 + bonus;

  if (rewardBadge) {
    rewardBadge.textContent = `+${total} Poin Kesejukan`;
  }

  if (takeLabel) {
    takeLabel.textContent = 'Ambil Misi Tanam';
  }

  if (countBadge) {
    if (count > 0) {
      countBadge.textContent = `${count} Warga Terpilih`;
      countBadge.classList.remove('hidden');
    } else {
      countBadge.classList.add('hidden');
    }
  }

  if (btnText) {
    btnText.textContent = count > 0 ? '+ Tambah Warga Lainnya' : 'Pilih Warga dari Daftar';
  }

  if (!container) return;

  if (count === 0) {
    container.innerHTML = `
      <div class="collab-empty-state">
        <div class="collab-empty-icon-wrap" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1A382B" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        </div>
        <div class="collab-empty-texts">
          <span class="collab-empty-title">Belum Ada Warga Terpilih</span>
          <p class="collab-empty-sub">Ajak warga sekitar untuk gotong royong menanam bibit bersama di pekarangan kawasan ini.</p>
        </div>
      </div>
    `;
    return;
  }

  let html = '';
  selectedMissionFriends.forEach(f => {
    const safeName = escapeHtml(f.name).replace(/'/g, "\\'");
    const safeLoc = escapeHtml(f.location).replace(/'/g, "\\'");
    const safeUser = escapeHtml(f.username).replace(/'/g, "\\'");
    const cleanLoc = (f.location || 'Denpasar').replace(/,\s*(?:Pulau\s*)?Bali$/i, '');

    html += `
      <div class="invited-resident-card">
        <div class="invited-resident-left">
          <div class="invited-resident-avatar">${escapeHtml(f.avatar || 'W')}</div>
          <div class="invited-resident-info">
            <div class="invited-resident-name">${escapeHtml(f.name)}</div>
            <div class="invited-resident-meta">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              <span>${escapeHtml(cleanLoc)}</span>
            </div>
          </div>
        </div>
        <button type="button" class="btn-remove-resident" onclick="toggleMissionFriend('${safeName}', '${safeLoc}', '${safeUser}')" title="Batalkan ajakan ${escapeHtml(f.name)}" aria-label="Batalkan ajakan ${escapeHtml(f.name)}">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          <span>Batal</span>
        </button>
      </div>
    `;
  });

  container.innerHTML = html;
}

// Pengelolaan Notifikasi Melayang Samping Drawer (Floating Contextual Side Notice)
function showNearbyFriendsNotice() {
  const notice = document.getElementById('mapNearbyFriendsSideHint');
  if (!notice) return;
  notice.classList.remove('hidden', 'is-closing');
}

function dismissNearbyFriendsNotice() {
  const notice = document.getElementById('mapNearbyFriendsSideHint');
  if (!notice || notice.classList.contains('hidden')) return;
  notice.classList.add('is-closing');
  setTimeout(() => {
    notice.classList.add('hidden');
    notice.classList.remove('is-closing');
  }, 250);
}

// Pengelolaan Modal Pop-up Pemilih Warga Gotong Royong
let currentModalFriendsList = [];

function openFriendsPickerModal() {
  const modal = document.getElementById('friendsPickerModal');
  const searchInput = document.getElementById('friendsModalSearchInput');
  if (!modal) return;

  if (searchInput) searchInput.value = '';

  // Ambil daftar teman dari TEDUH_DATA dan urutkan berdasarkan kedekatan dengan activeZone
  let friends = (typeof TEDUH_DATA !== 'undefined' && TEDUH_DATA.friendsDirectory)
    ? [...TEDUH_DATA.friendsDirectory]
    : [];

  if (activeZone) {
    friends = friends.map(f => {
      const dLat = (f.lat - activeZone.lat);
      const dLng = (f.lng - activeZone.lng);
      const dist = Math.sqrt(dLat * dLat + dLng * dLng);
      return { ...f, dist };
    }).sort((a, b) => a.dist - b.dist);
  }

  currentModalFriendsList = friends;
  renderFriendsModalList(friends);

  modal.classList.remove('hidden');
  void modal.offsetWidth;
  modal.classList.add('is-open');
}

function closeFriendsPickerModal() {
  const modal = document.getElementById('friendsPickerModal');
  if (!modal) return;
  modal.classList.remove('is-open');
  setTimeout(() => {
    if (!modal.classList.contains('is-open')) {
      modal.classList.add('hidden');
    }
  }, 200);
}

function filterFriendsModalList(query) {
  const q = (query || '').toLowerCase().trim().replace(/^@/, '');
  if (!q) {
    renderFriendsModalList(currentModalFriendsList);
    return;
  }
  const filtered = currentModalFriendsList.filter(f => 
    f.name.toLowerCase().includes(q) ||
    f.username.toLowerCase().replace(/^@/, '').includes(q) ||
    (f.districtLocation && f.districtLocation.toLowerCase().includes(q))
  );
  renderFriendsModalList(filtered);
}

function renderFriendsModalList(friendsList) {
  const container = document.getElementById('friendsModalListContainer');
  const selectedCountEl = document.getElementById('friendsModalSelectedCount');

  const count = selectedMissionFriends.length;

  if (selectedCountEl) {
    selectedCountEl.textContent = `${count} Warga Dipilih`;
  }

  if (!container) return;

  if (!friendsList || friendsList.length === 0) {
    container.innerHTML = `
      <div style="padding: 24px 16px; text-align: center; color: #71717A; font-size: 12px;">
        Tidak ada warga yang cocok dengan pencarian.
      </div>
    `;
    return;
  }

  container.innerHTML = friendsList.map(friend => {
    const isInvited = selectedMissionFriends.some(f => f.username === friend.username || f.name === friend.name);
    const safeName = escapeHtml(friend.name).replace(/'/g, "\\'");
    const safeLoc = escapeHtml(friend.districtLocation).replace(/'/g, "\\'");
    const safeUser = escapeHtml(friend.username).replace(/'/g, "\\'");
    const cleanDistrictLoc = (friend.districtLocation || 'Denpasar').replace(/,\s*(?:Pulau\s*)?Bali$/i, '');

    return `
      <div class="friend-item-row ${isInvited ? 'is-invited' : ''}">
        <div class="friend-item-left">
          <div class="friend-item-avatar">${escapeHtml(friend.avatar || 'W')}</div>
          <div class="friend-item-info">
            <span class="friend-item-name">${escapeHtml(friend.name)}</span>
            <span class="friend-item-sub">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              <span>${escapeHtml(cleanDistrictLoc)}</span>
            </span>
          </div>
        </div>
        <button type="button" class="btn-friend-item-toggle ${isInvited ? 'is-selected' : ''}" onclick="toggleMissionFriend('${safeName}', '${safeLoc}', '${safeUser}')">
          ${isInvited ? `
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>
            <span>Terpilih</span>
          ` : `
            <span>+ Ajak</span>
          `}
        </button>
      </div>
    `;
  }).join('');
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

// ==========================================================================
// PENGELOLAAN MISI SPASIAL WARGA SEKITAR & MISI AKTIF PENGGUNA DI PETA
// ==========================================================================

// Helper Pengelolaan Hover Pop-up (Muncul saat hover, hilang saat lepas kursor, tetap buka saat kursor masuk ke popup & saat pin aktif)
let mapPopupHoverTimeout = null;

function bindHoverPopup(marker) {
  marker.on('mouseover', function () {
    clearTimeout(mapPopupHoverTimeout);
    marker.openPopup();
  });

  marker.on('mouseout', function () {
    // Jika marker ini adalah marker yang sedang dipilih/aktif dan drawer sedang terbuka, JANGAN tutup pop-up nya
    const drawer = document.getElementById('spatialDrawer');
    const isDrawerOpen = drawer && drawer.classList.contains('is-open');
    if (isDrawerOpen && (marker === selectedCitizenMissionMarker || (activeCitizenMission && marker._teduhMissionId === activeCitizenMission.id))) {
      return;
    }

    mapPopupHoverTimeout = setTimeout(() => {
      const stillDrawerOpen = drawer && drawer.classList.contains('is-open');
      if (stillDrawerOpen && (marker === selectedCitizenMissionMarker || (activeCitizenMission && marker._teduhMissionId === activeCitizenMission.id))) {
        return;
      }
      marker.closePopup();
    }, 200);
  });

  marker.on('popupopen', function (e) {
    const popupEl = e.popup.getElement();
    if (popupEl) {
      // Nonaktifkan perambatan event klik dan scroll ke peta Leaflet
      L.DomEvent.disableClickPropagation(popupEl);
      L.DomEvent.disableScrollPropagation(popupEl);

      popupEl.addEventListener('mouseenter', () => {
        clearTimeout(mapPopupHoverTimeout);
      });
      popupEl.addEventListener('mouseleave', () => {
        const drawer = document.getElementById('spatialDrawer');
        const isDrawerOpen = drawer && drawer.classList.contains('is-open');
        if (isDrawerOpen && (marker === selectedCitizenMissionMarker || (activeCitizenMission && marker._teduhMissionId === activeCitizenMission.id))) {
          return;
        }
        mapPopupHoverTimeout = setTimeout(() => {
          const stillDrawerOpen = drawer && drawer.classList.contains('is-open');
          if (stillDrawerOpen && (marker === selectedCitizenMissionMarker || (activeCitizenMission && marker._teduhMissionId === activeCitizenMission.id))) {
            return;
          }
          marker.closePopup();
        }, 180);
      });

      // Pasang listener klik langsung pada kartu pop-up
      const card = popupEl.querySelector('.citizen-mission-popup-card');
      if (card && marker._teduhMissionId) {
        card.style.cursor = 'pointer';
        card.onclick = function (ev) {
          if (ev) {
            ev.stopPropagation();
            ev.preventDefault();
          }
          selectCitizenMission(marker._teduhMissionId);
        };
      }
    }
  });

  marker.on('click', function (e) {
    L.DomEvent.stopPropagation(e);
    clearTimeout(mapPopupHoverTimeout);
    marker.openPopup();
  });
}

// Delegasi Event Klik Global (Capture Phase) untuk memastikan klik pada Pop-up Card selalu terpicu tanpa tertelan
if (typeof document !== 'undefined') {
  document.addEventListener('click', function (e) {
    const card = e.target && e.target.closest && e.target.closest('.citizen-mission-popup-card');
    if (card) {
      if (e.stopPropagation) e.stopPropagation();
      const missionId = card.getAttribute('data-mission-id');
      if (missionId && typeof selectCitizenMission === 'function') {
        selectCitizenMission(missionId);
      }
    }
  }, true);
}

// Render Pin Misi Gotong Royong Warga Sekitar di Peta Satelit
function renderCitizenMissions() {
  if (!mapInstance || typeof TEDUH_DATA === 'undefined' || !TEDUH_DATA.getCitizenMissions) return;

  // Bersihkan pin misi warga lama
  citizenMissionMarkers.forEach(m => mapInstance.removeLayer(m));
  citizenMissionMarkers = [];

  const missions = TEDUH_DATA.getCitizenMissions();

  missions.forEach(mission => {
    const isJoined = mission.isJoined;
    const authorName = escapeHtml(mission.authorName);
    const location = escapeHtml(mission.location);
    const treeName = escapeHtml(mission.treeName);
    const safeMissionId = escapeHtml(mission.id).replace(/'/g, "\\'");
    const pinColor = isJoined ? '#5c8437' : '#BA4E2A';

    // Pin Lokasi Standar Warga Lain (Terracotta untuk belum terdaftar / Hijau Botani untuk misi aktif kita) - Bebas Kliping
    const customIcon = L.divIcon({
      className: 'citizen-location-pin-container',
      html: `
        <div class="standard-location-pin ${isJoined ? 'is-joined is-my-mission' : 'is-citizen'}" title="${isJoined ? 'Misi Aktif Saya Bersama: ' : 'Titik Tanam: '}${authorName}">
          ${isJoined ? '<div class="pin-pulse-halo"></div>' : ''}
          <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 2C9.37258 2 4 7.37258 4 14C4 23 16 34 16 34C16 34 28 23 28 14C28 7.37258 22.6274 2 16 2Z" class="pin-outer-body" fill="${pinColor}" stroke="#FFFFFF" stroke-width="1.8"/>
            <circle cx="16" cy="14" r="5.5" fill="#FFFFFF"/>
          </svg>
        </div>
      `,
      iconSize: [32, 40],
      iconAnchor: [16, 34],
      popupAnchor: [0, -34]
    });

    const marker = L.marker([mission.lat, mission.lng], { icon: customIcon, riseOnHover: true }).addTo(mapInstance);
    marker._teduhMissionId = mission.id;

    const formattedDate = (typeof TEDUH_DATA !== 'undefined' && TEDUH_DATA.formatDateIndo)
      ? TEDUH_DATA.formatDateIndo(mission.scheduledDate)
      : (mission.scheduledDate || 'Segera');

    // Markup Pop-up Preview Ringan (Klik card langsung membuka panel analisis di samping)
    const popupContent = `
      <div class="map-popup-card citizen-mission-popup-card" data-mission-id="${safeMissionId}" onclick="event.stopPropagation(); window.selectCitizenMission('${safeMissionId}');" style="cursor: pointer;">
        <div class="map-popup-header">
          <span class="map-popup-badge ${isJoined ? 'cool' : 'hot'}">${isJoined ? '✓ Terdaftar' : `+${mission.bonusPoints || 100} Poin`}</span>
          <span class="map-popup-location">${location}</span>
        </div>
        <h4 class="map-popup-title">${mission.authorName ? `Titik Tanam ${authorName}` : 'Titik Tanam Warga'}</h4>
        <div class="map-popup-grid">
          <div class="map-popup-mini-stat">
            <span>Bibit Pilihan</span>
            <strong>${treeName}</strong>
          </div>
          <div class="map-popup-mini-stat">
            <span>Jadwal Tanam</span>
            <strong>${formattedDate}</strong>
          </div>
        </div>
      </div>
    `;

    marker.bindPopup(popupContent, {
      offset: [0, -8],
      closeButton: false,
      className: 'custom-leaflet-popup'
    });

    // Pasang interaksi hover responsif
    bindHoverPopup(marker);

    // Klik langsung pada marker juga membuka panel analisis di samping
    marker.on('click', function (e) {
      L.DomEvent.stopPropagation(e);
      selectCitizenMission(mission.id);
    });

    citizenMissionMarkers.push(marker);
  });
}

// Buka Panel Analisis Samping untuk Misi Warga
function selectCitizenMission(missionId) {
  if (typeof TEDUH_DATA === 'undefined' || !TEDUH_DATA.getCitizenMissions) return;

  const missions = TEDUH_DATA.getCitizenMissions();
  const mission = missions.find(m => m.id === missionId);
  if (!mission) return;

  const drawer = document.getElementById('spatialDrawer');
  const isDrawerOpen = drawer && drawer.classList.contains('is-open');

  // Jika panel analisis sudah menampilkan misi ini dan sedang terbuka, diamkan saja
  if (isDrawerOpen && activeCitizenMission && activeCitizenMission.id === missionId) {
    const targetMarker = citizenMissionMarkers.find(m => m._teduhMissionId === missionId);
    if (targetMarker) {
      selectedCitizenMissionMarker = targetMarker;
      if (!targetMarker.isPopupOpen()) {
        targetMarker.openPopup();
      }
    }
    return;
  }

  let zone = null;
  if (mission.zoneId && TEDUH_DATA.zones) {
    zone = TEDUH_DATA.zones.find(z => z.id === mission.zoneId);
  }
  if (!zone && TEDUH_DATA.zones && TEDUH_DATA.zones.length > 0) {
    zone = TEDUH_DATA.zones[0];
  }

  if (zone) {
    const missionZone = {
      ...zone,
      name: `Titik Tanam ${mission.authorName} (${mission.location.split(',')[0]})`,
      fullAddress: `${mission.location}`,
      lat: mission.lat,
      lng: mission.lng
    };
    selectZone(missionZone, false, mission);
  }
}

// Munculkan Pop-up Konfirmasi Sebelum Bergabung
let pendingJoinMissionId = null;

function promptJoinCitizenMission(missionId) {
  pendingJoinMissionId = missionId;
  openJoinConfirmModal(missionId);
}

function openJoinConfirmModal(missionId) {
  if (typeof TEDUH_DATA === 'undefined' || !TEDUH_DATA.getCitizenMissions) return;

  const missions = TEDUH_DATA.getCitizenMissions();
  const mission = missions.find(m => m.id === missionId);
  if (!mission) return;

  pendingJoinMissionId = missionId;

  const authorEl = document.getElementById('joinConfirmAuthor');
  const locEl = document.getElementById('joinConfirmLocation');
  const treeEl = document.getElementById('joinConfirmTree');
  const executeBtn = document.getElementById('btnConfirmJoinExecute');

  if (authorEl) authorEl.textContent = mission.authorName;
  if (locEl) locEl.textContent = mission.location;
  if (treeEl) treeEl.textContent = mission.treeName;

  if (executeBtn) {
    const safeId = escapeHtml(mission.id).replace(/'/g, "\\'");
    executeBtn.setAttribute('onclick', `confirmJoinCitizenMission('${safeId}')`);
  }

  const modal = document.getElementById('joinCitizenMissionConfirmModal');
  if (modal) {
    modal.classList.remove('hidden');
    requestAnimationFrame(() => {
      modal.classList.add('is-open');
    });
  }
}

function closeJoinConfirmModal() {
  const modal = document.getElementById('joinCitizenMissionConfirmModal');
  if (modal) {
    modal.classList.remove('is-open');
    setTimeout(() => {
      if (!modal.classList.contains('is-open')) {
        modal.classList.add('hidden');
      }
    }, 200);
  }
  pendingJoinMissionId = null;
}

// Eksekusi Bergabung dengan Misi Warga Setelah Konfirmasi
function confirmJoinCitizenMission(missionId) {
  if (typeof TEDUH_DATA === 'undefined' || !TEDUH_DATA.joinCitizenMission) return;

  const result = TEDUH_DATA.joinCitizenMission(missionId);
  if (!result.success) {
    showToast(result.message || 'Anda sudah terdaftar di titik ini.');
    closeJoinConfirmModal();
    return;
  }

  // Perbarui profil pengguna di navbar
  syncUserProfile();

  // Tampilkan notifikasi toast sukses
  showToast(`Berhasil mendaftar tanam bersama ${result.mission.authorName}! +${result.bonusPoints} poin diperoleh.`);

  // Tutup dialog konfirmasi
  closeJoinConfirmModal();

  // Perbarui pin di peta
  renderCitizenMissions();

  // Jika panel drawer sedang membuka misi ini, perbarui status tombol dan daftar relawan di drawer
  if (activeCitizenMission && activeCitizenMission.id === missionId) {
    const freshMissions = TEDUH_DATA.getCitizenMissions();
    const fresh = freshMissions.find(m => m.id === missionId);
    if (fresh) {
      activeCitizenMission = fresh;
    }
    if (activeZone) {
      populateDrawer(activeZone);
    }
  }
}

// Helper Bergabung Langsung (untuk fallback)
function joinCitizenMission(missionId) {
  promptJoinCitizenMission(missionId);
}

// Dialog & Eksekusi Pembatalan Keikutsertaan Misi Warga
let pendingLeaveMissionId = null;

function promptLeaveCitizenMission(missionId) {
  const id = missionId || (activeCitizenMission ? activeCitizenMission.id : null);
  if (!id) return;
  pendingLeaveMissionId = id;
  openLeaveConfirmModal(id);
}

function openLeaveConfirmModal(missionId) {
  if (typeof TEDUH_DATA === 'undefined' || !TEDUH_DATA.getCitizenMissions) return;
  const missions = TEDUH_DATA.getCitizenMissions();
  const mission = missions.find(m => m.id === missionId);
  if (!mission) return;

  pendingLeaveMissionId = missionId;

  const authorEl = document.getElementById('leaveConfirmAuthor');
  const locEl = document.getElementById('leaveConfirmLocation');
  const executeBtn = document.getElementById('btnConfirmLeaveExecute');

  if (authorEl) authorEl.textContent = mission.authorName;
  if (locEl) locEl.textContent = mission.location;

  if (executeBtn) {
    const safeId = escapeHtml(mission.id).replace(/'/g, "\\'");
    executeBtn.setAttribute('onclick', `confirmLeaveCitizenMission('${safeId}')`);
  }

  const modal = document.getElementById('leaveCitizenMissionConfirmModal');
  if (modal) {
    modal.classList.remove('hidden');
    requestAnimationFrame(() => {
      modal.classList.add('is-open');
    });
  }
}

function closeLeaveConfirmModal() {
  const modal = document.getElementById('leaveCitizenMissionConfirmModal');
  if (modal) {
    modal.classList.remove('is-open');
    setTimeout(() => {
      if (!modal.classList.contains('is-open')) {
        modal.classList.add('hidden');
      }
    }, 200);
  }
  pendingLeaveMissionId = null;
}

function confirmLeaveCitizenMission(missionId) {
  if (typeof TEDUH_DATA === 'undefined' || !TEDUH_DATA.leaveCitizenMission) return;

  const result = TEDUH_DATA.leaveCitizenMission(missionId);
  if (!result.success) {
    showToast(result.message || 'Gagal membatalkan pendaftaran.');
    closeLeaveConfirmModal();
    return;
  }

  syncUserProfile();
  showToast(`Pendaftaran tanam bersama ${result.mission.authorName} dibatalkan.`);
  closeLeaveConfirmModal();

  renderCitizenMissions();

  if (activeCitizenMission && activeCitizenMission.id === missionId) {
    const freshMissions = TEDUH_DATA.getCitizenMissions();
    const fresh = freshMissions.find(m => m.id === missionId);
    if (fresh) {
      activeCitizenMission = fresh;
    }
    if (activeZone) {
      populateDrawer(activeZone);
    }
  }
}

function leaveCitizenMission(missionId) {
  promptLeaveCitizenMission(missionId);
}

// Render Titik Misi Aktif Pengguna dari localStorage
function renderUserActiveMissionPin() {
  if (!mapInstance || typeof localStorage === 'undefined') return;

  if (userActiveMissionMarker) {
    mapInstance.removeLayer(userActiveMissionMarker);
    userActiveMissionMarker = null;
  }
  if (userActiveMissionCircle) {
    mapInstance.removeLayer(userActiveMissionCircle);
    userActiveMissionCircle = null;
  }

  const saved = localStorage.getItem('teduh_active_mission');
  if (!saved) return;

  try {
    const mission = JSON.parse(saved);
    if (!mission) return;

    if (!mission.lat || !mission.lng) {
      if (mission.zoneId && typeof TEDUH_DATA !== 'undefined' && TEDUH_DATA.zones) {
        const zone = TEDUH_DATA.zones.find(z => z.id === mission.zoneId);
        if (zone) {
          mission.lat = zone.lat;
          mission.lng = zone.lng;
        }
      }
    }

    if (!mission.lat || !mission.lng) return;

    // Lingkaran radius naungan misi aktif pengguna
    userActiveMissionCircle = L.circle([mission.lat, mission.lng], {
      color: '#5c8437',
      fillColor: '#5c8437',
      fillOpacity: 0.22,
      dashArray: '5, 5',
      radius: 35,
      weight: 2
    }).addTo(mapInstance);

    // Custom DivIcon Pin Lokasi Misi Saya Standar (Hijau Aksi Botani #5c8437) - Bebas Kliping
    const myMissionIcon = L.divIcon({
      className: 'user-active-location-pin-container',
      html: `
        <div class="standard-location-pin is-my-mission" title="Misi Aktif Saya: ${escapeHtml(mission.treeName || 'Pohon Tanjung')}">
          <div class="pin-pulse-halo"></div>
          <svg width="36" height="44" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 2C9.37258 2 4 7.37258 4 14C4 23 16 34 16 34C16 34 28 23 28 14C28 7.37258 22.6274 2 16 2Z" fill="#5c8437" stroke="#FFFFFF" stroke-width="1.8"/>
            <circle cx="16" cy="14" r="5.5" fill="#FFFFFF"/>
          </svg>
        </div>
      `,
      iconSize: [36, 44],
      iconAnchor: [18, 38],
      popupAnchor: [0, -38]
    });

    userActiveMissionMarker = L.marker([mission.lat, mission.lng], { icon: myMissionIcon, riseOnHover: true }).addTo(mapInstance);

    const encodedZone = encodeURIComponent(mission.zoneName || 'Kawasan');
    const treeName = mission.treeName || 'Pohon Tanjung';
    const encodedTree = encodeURIComponent(treeName);
    const communityUrl = `community.html?action=complete-mission&zone=${encodedZone}&tree=${encodedTree}`;

    // Cek status kedaluwarsa misi (Hangus jika hari ini > scheduledDate dan belum selesai)
    let isExpired = false;
    let formattedDate = 'Segera';
    if (mission.scheduledDate) {
      formattedDate = (typeof TEDUH_DATA !== 'undefined' && TEDUH_DATA.formatDateIndo)
        ? TEDUH_DATA.formatDateIndo(mission.scheduledDate)
        : mission.scheduledDate;

      try {
        const targetTime = new Date(mission.scheduledDate + 'T23:59:59').getTime();
        if (!isNaN(targetTime) && !mission.isCompleted && Date.now() > targetTime) {
          isExpired = true;
        }
      } catch (err) {}
    }

    const popupHtml = `
      <div class="map-popup-card user-active-mission-popup">
        <div class="map-popup-header">
          <span class="map-popup-badge ${isExpired ? 'hot' : 'cool'}">${isExpired ? 'Misi Hangus' : 'Misi Aktif Saya'}</span>
          <span class="map-popup-location">${escapeHtml(mission.district || 'Denpasar')}</span>
        </div>
        <h4 class="map-popup-title">${escapeHtml(mission.zoneName || 'Kawasan Aksi')}</h4>
        <div class="map-popup-grid">
          <div class="map-popup-mini-stat">
            <span>Bibit Ditanam</span>
            <strong>${escapeHtml(treeName)}</strong>
          </div>
          <div class="map-popup-mini-stat">
            <span>Jadwal Aksi</span>
            <strong class="${isExpired ? 'schedule-status-expired' : ''}" style="${!isExpired ? 'color: #1A382B;' : ''}">${isExpired ? 'Hangus (' + formattedDate + ')' : formattedDate}</strong>
          </div>
        </div>
        <a href="${communityUrl}" class="map-popup-btn" style="color: #FFFFFF !important; text-decoration: none !important; text-align: center;">
          <span style="color: #FFFFFF !important;">${isExpired ? 'Unggah Bukti / Mulai Ulang' : 'Ke Komunitas &amp; Bagikan Aksi'}</span>
        </a>
      </div>
    `;

    userActiveMissionMarker.bindPopup(popupHtml, {
      offset: [0, -8],
      closeButton: false,
      className: 'custom-leaflet-popup'
    });

    // Pasang interaksi hover responsif
    bindHoverPopup(userActiveMissionMarker);
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
  if (activeAnalysisTimeout) {
    clearTimeout(activeAnalysisTimeout);
    activeAnalysisTimeout = null;
  }
  if (activeGsapTimeline) {
    activeGsapTimeline.kill();
    activeGsapTimeline = null;
  }

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

  // Kembalikan visibilitas header & body untuk pembukaan berikutnya
  const loadingEl = document.getElementById('drawerLoadingState');
  const drawerHeader = document.getElementById('drawerHeader');
  const drawerBody = document.getElementById('drawerBody');
  if (loadingEl) loadingEl.style.display = 'none';
  if (drawerHeader) drawerHeader.classList.remove('hidden');
  if (drawerBody) drawerBody.classList.remove('hidden');

  // Tutup notifikasi melayang samping dan modal teman jika ada
  dismissNearbyFriendsNotice();
  closeFriendsPickerModal();

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
  if (mapInstance) {
    mapInstance.closePopup();
  }
  activeCitizenMission = null;
  selectedCitizenMissionMarker = null;
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
let mapToastTimeout = null;
function showToast(message) {
  let toast = document.getElementById('teduhToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'teduhToast';
    document.body.appendChild(toast);
  }

  clearTimeout(mapToastTimeout);
  toast.textContent = message;
  toast.classList.add('is-visible');

  mapToastTimeout = setTimeout(() => {
    toast.classList.remove('is-visible');
  }, 2500);
}

// Ekspor Fungsi Global untuk Handler HTML
window.selectZone = selectZone;
window.openDrawer = openDrawer;
window.closeDrawer = closeDrawer;
window.switchDrawerStage = switchDrawerStage;
window.handlePopupMissionAction = handlePopupMissionAction;
window.showZoneActions = showZoneActions;
window.backToAnalysis = backToAnalysis;
window.copyZoneCoords = copyZoneCoords;
window.focusDonutFactor = focusDonutFactor;
window.setTreeSimulationCount = setTreeSimulationCount;
window.toggleActionStep = toggleActionStep;
window.toggleDrawerMobile = toggleDrawerMobile;
window.runThermalSimulation = runThermalSimulation;
window.takeZoneMission = takeZoneMission;
window.openMissionConfirmModal = openMissionConfirmModal;
window.closeMissionConfirmModal = closeMissionConfirmModal;
window.confirmTakeZoneMission = confirmTakeZoneMission;
window.renderPollutionLayers = renderPollutionLayers;
window.renderPresetMarkers = renderPresetMarkers;
window.syncUserProfile = syncUserProfile;
window.toggleMissionFriend = toggleMissionFriend;
window.renderSelectedMissionFriendsChips = renderSelectedMissionFriendsChips;
window.updateThermalZoomState = updateThermalZoomState;
window.showNearbyFriendsNotice = showNearbyFriendsNotice;
window.dismissNearbyFriendsNotice = dismissNearbyFriendsNotice;
window.openFriendsPickerModal = openFriendsPickerModal;
window.closeFriendsPickerModal = closeFriendsPickerModal;
window.filterFriendsModalList = filterFriendsModalList;
window.renderFriendsModalList = renderFriendsModalList;
window.renderCitizenMissions = renderCitizenMissions;
window.selectCitizenMission = selectCitizenMission;
window.joinCitizenMission = joinCitizenMission;
window.promptJoinCitizenMission = promptJoinCitizenMission;
window.openJoinConfirmModal = openJoinConfirmModal;
window.closeJoinConfirmModal = closeJoinConfirmModal;
window.confirmJoinCitizenMission = confirmJoinCitizenMission;
window.promptLeaveCitizenMission = promptLeaveCitizenMission;
window.openLeaveConfirmModal = openLeaveConfirmModal;
window.closeLeaveConfirmModal = closeLeaveConfirmModal;
window.confirmLeaveCitizenMission = confirmLeaveCitizenMission;
window.leaveCitizenMission = leaveCitizenMission;
window.renderUserActiveMissionPin = renderUserActiveMissionPin;
